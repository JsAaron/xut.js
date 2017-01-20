/*********************************************************************
 *            调度器 生成页面模块
 *            处理：事件动作分派
 *            调度：
 *                1. PageMgr     模块
 *                2. MasterMgr 模块                                                          *
 **********************************************************************/

import { config } from '../../config/index'
import PageMgr from '../manage/page'
import MasterMgr from '../manage/master'
import goToPage from './topage'
import { sceneController } from '../../scenario/controller'
import { getVisualDistance } from '../../visual/visual-distance'
import { setVisualStyle } from '../../visual/visual-style'
import { $$set, hash, $$warn } from '../../util/index'
import Stack from '../../util/stack'

import {
    initPointer,
    getDirection,
    converVisiblePid,
    indexConverChapterId,
    indexConverChapterData,
    hasMaster
} from './depend'

import { setVisualMode } from './set-mode'


export default class Controller {

    constructor(vm) {
        this.vm = vm;
        this.options = vm.options;
        //创建前景页面管理模块
        this.pageMgr = new PageMgr(vm)
            // 检测是否需要创母版模块
        if(hasMaster()) {
            this.masterMgr = new MasterMgr(vm);
        }
    }

    /**
     * 初始化页面创建
     * 因为多个页面的问题，所以不是创建调用
     * 统一回调
     * @return {[type]} [description]
     */
    initCreate() {
        let options = this.options
            //pointer
            //  createPointer
            //  initPointer
        let pointer = initPointer(options.initIndex, options.pagetotal, options.multiplePages)
        this.pagePointer = pointer.initPointer
            //初始化
        if(this.pageMgr.swipe) {
            this.pageMgr.swipe.initTranslation(pointer.createPointer, options.initIndex)
        }
        //始化构建页面容器对象
        this.createPageBases(pointer.createPointer, options.initIndex, 'init')
    }


    /**
     *  创建普通页面
     *  创建母版页面
     *  createPointer     需要创建的页面索引
     *  visiblePageIndex  当前可视区页面索引
     *  action            创建的动作：toPage/init/flipOver
     *  toPageCallback    跳转页面支持回调通知
     *  userStyle         规定创建的style属性
     **/
    createPageBases(createPageIndex, visiblePageIndex, action, toPageCallback, userStyle) {

        //2016.1.20
        //修正苗苗学问题 确保createPage不是undefined
        if(createPageIndex[0] === undefined) {
            return;
        }

        let self = this
        let multiplePages = this.options.multiplePages //是否线性
        let createTotal = createPageIndex.length //需要创建的总页面
        let toPageAction = action === 'toPage' //如果是跳转
        let filpOverAction = action === 'flipOver' //如果是翻页

        //将页码pageIndex转化成对应的chapter && 使用第一个是分解可见页面
        //不同场景会自动转化chapter的下标
        //createChapterIndexs
        //  创建的页码ID合集
        //  代表数据库chpaterID的索引
        let createChapterIndexs = indexConverChapterId.call(this, createPageIndex, visiblePageIndex)

        //收集创建的页面对象
        //用于处理2个页面在切换的时候闪屏问题
        //主要是传递createStyle自定义样式的处理
        let collectPageBase = []

        //是否触发母版的自动时间
        //因为页面每次翻页都会驱动auto事件
        //但是母版可能是共享的
        let createMaster = false

        //收集完成回调
        const collectCallback = (() => {
            //收集创建页码的数量
            let createContent = 0;
            return callback => {
                ++createContent
                if(createContent === createTotal) {
                    callback();
                }
            }
        })()

        //构建执行代码
        const callbackAction = {
            //初始化
            init() {
                collectCallback(() => {
                    self._loadPage('init');
                })
            },
            //翻页
            flipOver() {
                collectCallback(() => {
                    self._autoRun({ //翻页
                        'createPointer': createChapterIndexs,
                        'createMaster': createMaster
                    });
                })
            },
            //跳转
            toPage() {
                collectCallback(() => {
                    toPageCallback(collectPageBase);
                })
            }
        }

        //chapter页码，转化成页面chapter数据集合
        let chpaterResults = indexConverChapterData(createChapterIndexs);


        /**
         * 预编译
         * 因为要需要对多个页面进行预处理
         * 需要同步多个页面数据判断
         * 这样需要预编译出数据，做了中间处理后再执行后续动作
         * @type {Array}
         */
        let compile = new Stack()

        //收集有用的数据
        let usefulData = hash()
        _.each(chpaterResults, (chapterData, index) => {
            compile.push((() => {

                //创建的页面索引
                let createChapterIndex = createChapterIndexs[index]

                //转化可视区页码对应的chapter的索引号
                //获取出实际的pageIndex号
                let conversion = converVisiblePid.call(self, createChapterIndex, visiblePageIndex)
                let visibleChapterIndex = conversion.visiblePid
                let pageIndex = conversion.pageIndex

                if(createTotal === 1) {
                    self.options.chapterId = chapterData._id
                }

                //跳转的时候，创建新页面可以自动样式信息
                //优化设置，只是改变当前页面即可
                if(toPageAction && visibleChapterIndex !== createChapterIndex) {
                    userStyle = undefined
                }

                //收集页面之间可配置数据
                usefulData[createChapterIndex] = {
                    pid: createChapterIndex,
                    visiblePid: visibleChapterIndex,
                    userStyle: userStyle,
                    direction: getDirection(createChapterIndex, visibleChapterIndex),
                    //新的页面模式
                    pageVisualMode: setVisualMode(chapterData)
                }

                //延迟创建,先处理style规则
                return pageStyle => {
                    //创建新的页面管理，masterFilter 母板过滤器回调函数
                    const _createPageBase = function(masterFilter) {
                        //初始化构建页面对象
                        //1:page，2:master
                        let currentStyle = pageStyle[createChapterIndex]
                        let pageBase = this.create({
                            'pid': createChapterIndex,
                            'visiblePid': visibleChapterIndex,
                            'chapterData': chapterData,
                            'getStyle': currentStyle,
                            'pageIndex': pageIndex,
                            'multiplePages': multiplePages
                        }, pageIndex, masterFilter, function(shareMaster) {
                            if(shareMaster.getStyle.pageVisualMode !== currentStyle.pageVisualMode) {
                                $$warn(`母版与页面VisualMode不一致,错误页码:${pageIndex+1},母版visualMode:${shareMaster.getStyle.pageVisualMode},页面visualMode:${currentStyle.pageVisualMode}`)
                            }
                        })

                        //判断pageBase是因为母版不需要重复创建
                        //母版是共享多个paga
                        if(pageBase) {
                            //开始线程任务，如果是翻页模式,支持快速创建
                            pageBase.startThreadTask(filpOverAction, () => {
                                callbackAction[action]()
                            })

                            //收集自定义样式的页面对象
                            if(userStyle) {
                                collectPageBase.push(pageBase)
                            }
                        }
                    }

                    //创建母版层
                    if(chapterData.pptMaster && self.masterMgr) {
                        _createPageBase.call(self.masterMgr, () => {
                            //母版是否创建等待通知
                            //母版是共享的所以不一定每次翻页都会创建
                            //如果需要创建,则叠加总数
                            ++createTotal
                            createMaster = true
                        })
                    }

                    //创建页面层
                    _createPageBase.call(self.pageMgr)
                }

            })())
        })


        /**
         * 创建页面的样式与翻页的布局
         * 存在存在flows页面处理
         * 这里创建处理的Transfrom
         */
        const pageStyle = setVisualStyle({
            action,
            usefulData
        })

        compile.shiftAll(pageStyle).destroy()
    }


    /**
     * 滑动处理
     *  1 滑动
     *  2 反弹
     *  3 翻页
     */
    movePageBases({
        action,
        speed,
        distance,
        leftIndex,
        pageIndex,
        rightIndex,
        direction,
        setSwipeInvalid //设置翻页无效
    }) {

        //用户强制直接切换模式
        //禁止页面跟随滑动
        if(this.options.flipMode && action == 'flipMove') {
            return
        }

        let currIndex = pageIndex
        let currObj = this.pageMgr.abstractGetPageObj(currIndex)

        //2016.11.8
        //mini杂志功能
        //一次是拦截
        //一次是触发动作
        if(config.swipeDelegate) {

            //如果是swipe就全局处理
            if(action === 'swipe') {
                //执行动画序列
                currObj.callSwipeSequence(direction)
                return
            }

            //2016.11.8
            //mini杂志功能
            //如果有动画序列
            //拦截翻页动作
            //执行序列动作
            //拦截
            if(currObj.hasSwipeSequence(direction)) {
                //设置为无效翻页
                setSwipeInvalid && setSwipeInvalid()
                return
            }
        }

        //移动的距离
        let moveDist = getVisualDistance({
            action,
            distance,
            direction,
            leftIndex,
            middleIndex: pageIndex,
            rightIndex
        })

        //视觉差页面滑动
        const chapterData = currObj.chapterData
        const nodes = chapterData && chapterData.nodes ? chapterData.nodes : undefined

        const data = {
            nodes,
            speed,
            action,
            moveDist,
            leftIndex,
            currIndex,
            rightIndex,
            direction
        }

        this.pageMgr.move(data)
        this.masterContext(function() {
            this.move(data)
        })

        //更新页码
        if(action === 'flipOver') {
            Xut.nextTick(() => {
                this.vm.$emit('change:pageUpdate', {
                    action,
                    parentIndex: direction === 'next' ? rightIndex : leftIndex,
                    direction
                })
            })
        }
    }


    /**
     * 翻页松手后
     * 暂停页面的各种活动动作
     * @param  {[type]} pointers [description]
     * @return {[type]}          [description]
     */
    suspendPageBases(pointers) {
        //关闭层事件
        this.pageMgr.suspend(pointers);
        this.masterContext(function() {
            this.suspend(pointers)
        })

        //复位工具栏
        this.vm.$emit('change:resetToolbar')
    }


    /**
     * 翻页动画完毕后
     * @return {[type]}              [description]
     */
    completePageBases(direction, pagePointer, unfliplock, isQuickTurn) {
        //方向
        this.direction = direction;
        //是否快速翻页
        this.isQuickTurn = isQuickTurn || false;
        //解锁
        this.unfliplock = unfliplock;
        //清理上一个页面
        this._clearPage(pagePointer.destroyPointer)
        this._updatePointer(pagePointer);
        //预创建下一页
        this._advanceCreate(direction, pagePointer);
    }


    /**
     * 页面跳转
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    gotoPageBases(data) {

        Xut.View.ShowBusy()

        //如果是非线性,创建页面修改
        if(!this.options.multiplePages) {
            data.create = [data.targetIndex];
            data.destroy = [data.currIndex];
            data.ruleOut = [data.targetIndex];
            data.pagePointer = {
                currIndex: data.targetIndex
            }
        }

        //执行页面切换
        goToPage(this, data, function(data) {
            this._updatePointer(data.pagePointer);
            this._autoRun({
                'action': 'toPage',
                'createPointer': data['create']
            });
            Xut.View.HideBusy();
        })
    }


    /**
     * 调用母版管理器
     * @return {[type]} [description]
     */
    masterContext(callback) {
        if(this.masterMgr) {
            callback.call(this.masterMgr)
        }
    }


    /**
     * 销毁接口
     * 对应多场景操作
     * @return {[type]} [description]
     */
    destroyPageBases() {
        this.pageMgr.destroy()
        this.masterContext(function() {
            this.destroy()
        })
    }



    /**
     * 自动运行处理
     *  流程四:执行自动触发动作
     *   1.初始化创建页面完毕
     *   2.翻页完毕
     */
    _autoRun(para) {
        let options = this.options
        let pagePointer = this.pagePointer
        let prevIndex = pagePointer.leftIndex
        let currIndex = pagePointer.currIndex
        let nextIndex = pagePointer.rightIndex
        let action = para ? para.action : ''
        let createPointer = para ? para.createPointer : ''
        let direction = this.direction

        //暂停的页面索引autorun
        let suspendIndex = action === 'init' ? '' : direction === 'next' ? prevIndex : nextIndex

        /**
         * 存在2中模式的情况下
         * 转化页码标记
         */
        if(createPointer) {
            createPointer = converVisiblePid.call(this, createPointer)
        }

        const data = {
            'prevIndex': prevIndex,
            'currIndex': currIndex,
            'nextIndex': nextIndex,
            'suspendIndex': suspendIndex,
            'createPointer': createPointer,
            'direction': direction,
            'isQuickTurn': this.isQuickTurn,
            //中断通知
            'suspendCallback': options.suspendAutoCallback,
            //构建完毕通知
            'buildComplete': function(scenarioId) {
                /**
                 * 构建完成通知,用于处理历史缓存记录
                 * 如果是调试模式 && 不是收费提示页面 && 多场景应用
                 */
                if(config.historyMode && !options.isInApp && options.multiScenario) {
                    var history;
                    if(history = sceneController.sequence(scenarioId, currIndex)) {
                        $$set("history", history)
                    }
                }
            },

            //流程结束通知
            //包括动画都已经结束了
            'processComplete': function() {}
        }

        //页面自动运行
        this.pageMgr.autoRun(data);

        //模板自动运行
        this.masterContext(function() {
            //如果动作是初始化，或者触发了母版自动运行
            //如果是越界处理
            //console.log(action,this.isBoundary,para.createMaster)
            if(action || this.isBoundary) {
                this.autoRun(data);
            }
        })

        /**
         * 触发自动通知
         * @type {[type]}
         */
        var vm = this.vm

        /**
         * 初始化与跳转针对翻页案例的设置逻辑
         * @return {[type]} [description]
         */
        const setToolbar = () => {
            //不显示首尾对应的按钮
            if(currIndex == 0) {
                vm.$emit('change:hidePrev');
            } else if(currIndex == options.pagetotal - 1) {
                vm.$emit('change:hideNext');
                vm.$emit('change:showPrev');
            } else {
                vm.$emit('change:showNext');
                vm.$emit('change:showPrev');
            }
        }

        switch(action) {
            case 'init':
                //更新页码标示
                vm.$emit('change:pageUpdate', {
                    action,
                    parentIndex: currIndex,
                    direction
                })
                setToolbar.call(this)
                break;
            case 'toPage':
                //更新页码标示
                vm.$emit('change:pageUpdate', {
                    action,
                    parentIndex: currIndex,
                    direction
                })
                setToolbar.call(this)
                break;
        }

        /**
         * 线性结构
         * 保存目录索引
         */
        if(!options.multiScenario) {
            $$set("pageIndex", currIndex);
        }

        /**
         * 解锁翻页
         * 允许继续执行下一个翻页作用
         */
        if(this.unfliplock) {
            this.unfliplock();
            this.unfliplock = null;
        }

        //关闭快速翻页
        this.isQuickTurn = false;

    }



    /**
     * 清理页面结构
     * @param  {[type]} clearPageIndex [description]
     * @return {[type]}                [description]
     */
    _clearPage(clearPageIndex) {
        this.pageMgr.clearPage(clearPageIndex)
    }


    /**
     * 更新页码索引标示
     * @param  {[type]} pagePointer [description]
     * @return {[type]}             [description]
     */
    _updatePointer(pagePointer) {
        this.pagePointer = pagePointer
    }


    /**
     * 预创建新页面
     * @param  {[type]} direction   [description]
     * @param  {[type]} pagePointer [description]
     * @return {[type]}             [description]
     */
    _advanceCreate(direction, pagePointer) {
        let pagetotal = this.options.pagetotal
        let vm = this.vm
        let createPointer = pagePointer.createPointer

        //清理页码
        let clearPointer = function() {
            delete pagePointer.createPointer;
            delete pagePointer.destroyPointer;
        }

        //创建新的页面对象
        let createNextPageBase = currIndex => this.createPageBases([createPointer], currIndex, 'flipOver')

        //如果是左边翻页
        if(direction === 'prev') {
            //首尾无须创建页面
            if(pagePointer.currIndex === 0) {
                this._autoRun()
                if(pagetotal == 2) { //如果总数只有2页，那么首页的按钮是关闭的，需要显示
                    vm.$emit('change:showNext')
                }
                vm.$emit('change:hidePrev')
                return
            }
            if(pagePointer.currIndex > -1) { //创建的页面
                createNextPageBase(pagePointer.currIndex)
                clearPointer()
                vm.$emit('change:showNext')
                return;
            }
        }

        //如果是右边翻页
        if(direction === 'next') {
            //首尾无须创建页面
            if(pagePointer.currIndex === pagetotal - 1) {
                this._autoRun()
                if(pagetotal == 2) { //如果总数只有2页，那么首页的按钮是关闭的，需要显示
                    vm.$emit('change:showPrev')
                }
                //多页处理
                vm.$emit('change:hideNext')
                return
            }
            if(createPointer < pagetotal) { //创建的页面
                createNextPageBase(pagePointer.currIndex)
                clearPointer()
                vm.$emit('change:showPrev')
                return
            }
        }

        clearPointer()

        return
    }


    /**
     * 加载页面事件与动作
     * @param  {[type]} action [description]
     * @return {[type]}        [description]
     */
    _loadPage(action) {

        let autoRun = () => {
            this._autoRun({
                'action': action
            })
        }

        //触发自动任务
        let triggerAuto = () => {
            //第一次进入，处理背景
            let $cover = $(".xut-cover")
            if($cover.length) { //主动探测,只检查一次
                let complete = function() {
                    $cover && $cover.remove()
                    $cover = null
                    autoRun()
                }

                //是否配置启动动画关闭
                if(window.DYNAMICCONFIGT && window.DYNAMICCONFIGT.launchAnim == false) {
                    complete()
                } else {
                    //有动画
                    $cover.transition({
                        opacity: 0,
                        duration: 1000,
                        easing: 'in',
                        complete
                    });
                }
            }
            //第二次
            else {
                $cover = null
                autoRun()
            }
        }

        //创建完成回调
        this.vm.$emit('change:createComplete', () => {
            if(this.options.multiScenario) {
                triggerAuto()
            }
            //第一次加载
            //进入应用
            else {
                if(window.GLOBALIFRAME) {
                    triggerAuto()
                    return
                }
                //获取应用的状态
                if(Xut.Application.getAppState()) {
                    //保留启动方法
                    var pre = Xut.Application.LaunchApp;
                    Xut.Application.LaunchApp = function() {
                        pre()
                        triggerAuto()
                    };
                } else {
                    triggerAuto()
                }
            }
        })
    }


}
