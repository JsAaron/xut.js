/*********************************************************************
 *                 调度器 生成页面模块
 *
 *            处理：事件动作分派
 *            调度：
 *                1. PageMgr     模块
 *                2. MasterMgr 模块
 *                                                                    *
 **********************************************************************/
import { _set } from '../../util/stroage'
import { config } from '../../config/index'
import PageMgr from '../page'
import MasterMgr from '../master'
import SwitchPage from './switch'
import { sceneController } from '../../scenario/controller'
import { closeNavbar } from '../../toolbar/navbar/index'

import Stack from '../../util/stack'

import {
    getFlowDistance
} from '../../visuals/expand/api.config'

import getFlipDistance from '../../visuals/distance.config'
import containerStyle from '../../visuals/container.config'

import {
    offsetPage,
    conversionPageOpts,
    initPointer,
    conversionCid,
    conversionPids,
    checkMasterCreate,
} from './util'


export class Dispatcher {

    constructor(vm) {
        this.vm = vm;

        this.options = vm.options;

        /**
         * 创建前景页面管理模块
         * @type {PageMgr}
         */
        this.pageMgr = new PageMgr(vm);

        /**
         * 检测是否需要创母版模块
         * @return {[type]} [description]
         */
        if (checkMasterCreate()) {
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
        const options = this.options

        //createPointer,
        //initPointer
        const pointer = initPointer(options.initIndex, options.pagetotal, options.multiplePages)

        this.pagePointer = pointer.initPointer

        //始化构建页面
        this.create(pointer.createPointer, options.initIndex, 'init')
    }


    /**
     *  创建普通页面
     *  创建母版页面
     *  createPointer  需要创建的页面索引
     *  visiblePage       当前可视区页面索引
     *  action         toPage/init/flipOver
     *  toPageCallback 跳转页面支持回调通知
     *  userStyle      规定创建的style属性
     **/
    create(createPage, visiblePage, action, toPageCallback, userStyle) {

        //2016.1.20
        //修正苗苗学问题 确保createPage不是undefined
        if (undefined === createPage[0]) {
            return;
        }

        let doublePageMode = config.doublePageMode
        let self = this
        let multiplePages = this.options.multiplePages //是否线性
        let total = createPage.length
        let toPageAction = action === 'toPage' //如果是跳转
        let filpOverAction = action === 'flipOver' //如果是翻页

        //使用第一个是分解可见页面
        //将页码pageIndex转化成对应的chapter
        let createPids = conversionCid.call(this, createPage, visiblePage)

        //收集创建的页面对象
        //用于处理2个页面在切换的时候闪屏问题
        //主要是传递createStyle自定义样式的处理
        let collectCreatePageBase = []

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
                if (createContent === total) {
                    callback();
                }
            }
        })()

        /**
         * 构建执行代码
         * @type {Object}
         */
        const callbackAction = {
            /**
             * 初始化
             * @return {[type]} [description]
             */
            init() {
                collectCallback(() => {
                    self._loadPage('init');
                })
            },
            /**
             * 翻页
             * @return {[type]} [description]
             */
            flipOver() {
                collectCallback(() => {
                    self.autoRun({ //翻页
                        'createPointer': createPids,
                        'createMaster': createMaster
                    });
                })
            },
            /**
             * 跳转
             * @return {[type]} [description]
             */
            toPage() {
                collectCallback(() => {
                    toPageCallback(collectCreatePageBase);
                })
            }
        }


        /**
         * pid页码，转化成页面数据集合
         * pid=>chpterData
         * @type {[type]}
         */
        let chpaterResults = conversionPids(createPids);

        /**
         * 如果是最后一页
         * 没有对应的虚拟数据，取前一页的
         * @return {[type]}             [description]
         */
        if (doublePageMode && !chpaterResults.length) {
            let virtualPid = _.extend([], createPids);
            createPids.forEach(function(pid, index) {
                virtualPid.splice(index, 1, --pid)
            })
            chpaterResults = conversionPids(virtualPid);
        }


        /**
         * 预编译
         * 因为要需要对多个页面进行预处理
         * 需要同步多个页面数据判断
         * 这样需要预编译出数据，做了中间处理后再执行后续动作
         * @type {Array}
         */
        const compile = new Stack()


        //收集有用的数据
        let usefulData = Object.create(null)
        let hasFlow = false
        _.each(chpaterResults, (chapterData, index) => {
            compile.push((function() {
                //转化值
                //chapterId => createPid
                let createPid = createPids[index]

                //createPid
                //pageIndex
                let conversion = conversionPageOpts.call(self, createPid, visiblePage)
                let visiblePid = conversion.visiblePid
                let pageIndex = conversion.pageIndex

                /**
                 * 如果启动了虚拟页面模式
                 * @type {Boolean}
                 */
                let virtualPid = false; //虚拟页面的pid编号
                let virtualOffset = false; //页面坐标left,right
                if (doublePageMode) {
                    //页面位置
                    virtualOffset = offsetPage(pageIndex);

                    //获取新的chpater数据
                    const fixCids = function(originalIndex) {
                        let originalPid = conversionCid.call(self, [originalIndex]);
                        return conversionPids([originalPid])[0];
                    }

                    ////////////
                    //如果是翻页创建 //
                    //由于是拼接的所以chapter移位了
                    ////////////
                    if (virtualOffset === 'left') {
                        chapterData = fixCids(pageIndex / 2)
                    }
                    //修正右边chapter
                    if (virtualOffset === 'right') {
                        chapterData = fixCids((pageIndex - 1) / 2)
                    }
                }

                if (total === 1) {
                    self.options.chapterId = chapterData._id
                }

                /**
                 * 确定存在flows类型页面
                 * @param  {[type]} chapterData.note [description]
                 * @return {[type]}                  [description]
                 */
                const isFlows = chapterData.note === 'flow'
                if (isFlows) {
                    hasFlow = true
                }

                //跳转的时候，创建新页面可以自动样式信息
                //优化设置，只是改变当前页面即可
                if (toPageAction && visiblePid !== createPid) {
                    userStyle = undefined
                }


                //页面之间关系
                const _direction = function(createIndex, currIndex) {
                        let direction
                        if (createIndex < currIndex) {
                            direction = 'before'
                        } else if (createIndex > currIndex) {
                            direction = 'after'
                        } else if (currIndex == createIndex) {
                            direction = 'middle'
                        }
                        return direction
                    }
                    //收集页面之间创建数据
                usefulData[createPid] = {
                    isFlows: isFlows,
                    pid: createPid,
                    visiblePid: visiblePid,
                    userStyle: userStyle,
                    direction: _direction(createPid, visiblePid)
                }

                /**
                 *delay....
                 * @return {[type]} [description]
                 */
                return function(newstyle) {

                    /**
                     * 构件新的页面
                     * masterFilter 母板过滤器回调函数
                     * @param  {[type]} masterFilter [description]
                     * @return {[type]}              [description]
                     */
                    const createPageBase = function(masterFilter) {

                        /**
                         * 初始化构建页面对象
                         * 1:page
                         * 2:master
                         * [pageBase description]
                         * @type {[type]}
                         */
                        const pageBase = this.create({
                            'isFlows': isFlows,
                            'getStyle': newstyle[createPid],
                            'pageIndex': pageIndex,
                            'multiplePages': multiplePages,
                            'pid': createPid, //页码chapterId
                            'chapterDas': chapterData, //当前页面的chpater数据
                            'visiblePid': visiblePid, //实际中页面显示的索引
                            'virtualPid': virtualPid, //pid
                            'virtualOffset': virtualOffset //虚拟页面位置
                        }, pageIndex, masterFilter)

                        //构建页面对象后
                        //开始执行
                        if (pageBase) {
                            //开始线程任务
                            //当为滑动模式,支持快速创建
                            pageBase.startThreadTask(filpOverAction, function() {
                                callbackAction[action]()
                            })

                            //收集自定义样式的页面对象
                            if (userStyle) {
                                collectCreatePageBase.push(pageBase);
                            }
                        }

                    }

                    //母版层
                    if (chapterData.pptMaster && self.masterMgr) {
                        createPageBase.call(self.masterMgr, () => {
                            //母版是否创建等待通知
                            //母版是共享的所以不一定每次翻页都会创建
                            //如果需要创建,则叠加总数
                            ++total;
                            createMaster = true;
                        });
                    }

                    //页面层
                    createPageBase.call(self.pageMgr);
                }

            })())
        })

        /**
         * 创建页面的样式与翻页的布局
         * 存在存在flows页面处理
         * 这里创建处理的Transfrom
         * @param  {[type]} hasFlows [description]
         * @return {[type]}            [description]
         */
        const newstyle = containerStyle({
            action,
            hasFlow,
            usefulData
        })

        /**
         * 执行编译
         */
        compile.shiftAll(newstyle).destroy()
    }


    /**
     * 自动运行处理
     *  流程四:执行自动触发动作
     *   1.初始化创建页面完毕
     *   2.翻页完毕
     */
    autoRun(para) {
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
        if (createPointer) {
            createPointer = conversionPageOpts.call(this, createPointer)
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
                //==========================================
                //
                //      构建完成通知,用于处理历史缓存记录
                //      如果是调试模式
                //      && 不是收费提示页面
                //      && 多场景应用
                //
                //==========================================
                if (config.recordHistory && !options.isInApp && options.multiScenario) {
                    var history;
                    if (history = sceneController.sequence(scenarioId, currIndex)) {
                        _set("history", history)
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
            if (action || this.isBoundary) {
                this.autoRun(data);
            }
        })

        /**
         * 触发自动通知
         * @type {[type]}
         */
        var vm = this.vm;

        switch (action) {
            case 'init':
                //更新页码标示
                vm.$emit('change:pageUpdate', {
                    action,
                    parentIndex: currIndex,
                    direction
                })
                resetToolbar.call(this)
                setTimeout(function() {
                    $(".xut-start-page").hide().remove();
                    $(".xut-removelayer").hide().remove();
                }, 0)
                break;
            case 'toPage':
                //更新页码标示
                vm.$emit('change:pageUpdate', {
                    action,
                    parentIndex: currIndex,
                    direction
                })
                resetToolbar.call(this)
                break;
        }


        /**
         * 初始化与跳转针对翻页案例的设置逻辑
         * @return {[type]} [description]
         */
        function resetToolbar() {
            //不显示首尾对应的按钮
            if (currIndex == 0) {
                vm.$emit('change:hidePrev');
            } else if (currIndex == options.pagetotal - 1) {
                vm.$emit('change:hideNext');
                vm.$emit('change:showPrev');
            } else {
                vm.$emit('change:showNext');
                vm.$emit('change:showPrev');
            }
        }


        /**
         * 线性结构
         * 保存目录索引
         */
        if (!options.multiScenario) {
            _set("pageIndex", currIndex);
        }

        /**
         * 解锁翻页
         * 允许继续执行下一个翻页作用
         */
        if (this.unfliplock) {
            this.unfliplock();
            this.unfliplock = null;
        }

        //关闭快速翻页
        this.isQuickTurn = false;

    }


    /**
     * 滑动处理
     *  1 滑动
     *  2 反弹
     *  3 翻页
     */
    move({
        action,
        speed,
        distance,
        leftIndex,
        pageIndex,
        rightIndex,
        direction
    } = {}) {

        let self = this
        let currIndex = pageIndex

        //用户强制直接切换模式
        //禁止页面跟随滑动
        if (this.options.flipMode && action == 'flipMove') {
            return
        }

        //移动的距离
        let moveDist = getFlipDistance({
            action,
            distance,
            direction,
            leftIndex,
            pageIndex,
            rightIndex
        }, getFlowDistance())

        //视觉差页面滑动
        const currObj = this.pageMgr.abstractGetPageObj(currIndex)
        const chapterData = currObj.chapterDas
        const nodes = chapterData && chapterData.nodes ? chapterData.nodes : undefined

        const data = {
            nodes,
            speed,
            action,
            moveDist,
            leftIndex,
            currIndex,
            rightIndex,
            direction,
        }

        this.pageMgr.move(data)
        this.masterContext(function() {
            this.move(data)
        })

        //更新页码
        if (action === 'flipOver') {
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
    suspend(pointers) {
        //关闭层事件
        this.pageMgr.suspend(pointers);
        this.masterContext(function() {
            this.suspend(pointers)
        })

        //目录栏
        closeNavbar();
        //复位工具栏
        this.vm.$emit('change:resetToolbar')
    }


    /**
     * 翻页动画完毕后
     * @return {[type]}              [description]
     */
    complete(direction, pagePointer, unfliplock, isQuickTurn) {
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
     * 页面跳转切换处
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    jumpPage(data) {

        Xut.View.ShowBusy()

        //如果是非线性,创建页面修改
        if (!this.options.multiplePages) {
            data.create = [data.targetIndex];
            data.destroy = [data.currIndex];
            data.ruleOut = [data.targetIndex];
            data.pagePointer = {
                currIndex: data.targetIndex
            }
        }

        //执行页面切换
        SwitchPage(this, data, function(data) {
            this._updatePointer(data.pagePointer);
            this.autoRun({
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
        if (this.masterMgr) {
            callback.call(this.masterMgr)
        }
    }


    /**
     * 销毁接口
     * 对应多场景操作
     * @return {[type]} [description]
     */
    destroy() {
        this.pageMgr.destroy()
        this.masterContext(function() {
            this.destroy()
        })
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
        var pagetotal = this.options.pagetotal,
            vm = this.vm,
            createPointer = pagePointer.createPointer,
            destroyPointer = pagePointer.destroyPointer,
            //清理页码
            clear = function() {
                delete pagePointer.createPointer;
                delete pagePointer.destroyPointer;
            },
            //创建新的页面对象
            createNextContainer = function(createPointer, currIndex) {
                this.create([createPointer], currIndex, 'flipOver');
            };

        //如果是右边翻页
        if (direction === 'next') {
            //首尾无须创建页面
            if (pagePointer.currIndex === pagetotal - 1) {
                this.autoRun();
                //如果总数只有2页，那么首页的按钮是关闭的，需要显示
                if (pagetotal == 2) {
                    vm.$emit('change:showPrev');
                }
                //多页处理
                vm.$emit('change:hideNext');
                return
            }
            if (createPointer < pagetotal) { //创建的页面
                createNextContainer.call(this, createPointer, pagePointer.currIndex);
                clear();
                vm.$emit('change:showPrev');
                return;
            }
        }

        //如果是左边翻页
        if (direction === 'prev') {
            //首尾无须创建页面
            if (pagePointer.currIndex === 0) {
                this.autoRun();
                //如果总数只有2页，那么首页的按钮是关闭的，需要显示
                if (pagetotal == 2) {
                    vm.$emit('change:showNext');
                }
                vm.$emit('change:hidePrev');
                return
            }
            if (pagePointer.currIndex > -1) { //创建的页面
                createNextContainer.call(this, createPointer, pagePointer.currIndex);
                clear();
                vm.$emit('change:showNext');
                return;
            }
        }

        clear();

        return;
    }


    /**
     * 加载页面事件与动作
     * @param  {[type]} action [description]
     * @return {[type]}        [description]
     */
    _loadPage(action) {
        var self = this;

        //触发自动任务
        function trigger() {
            self.autoRun({
                'action': 'init'
            });
        }

        //加载主场景页面
        function firstLoading() {

            $("#xut-main-scene").css({
                'visibility': 'visible'
            });

            if (window.GLOBALIFRAME) {
                trigger();
                return;
            }
            //获取应用的状态
            if (Xut.Application.getAppState()) {
                //保留启动方法
                var pre = Xut.Application.LaunchApp;
                Xut.Application.LaunchApp = function() {
                    pre();
                    trigger();
                };
            } else {
                trigger();
            }
        }

        //创建完成回调
        self.vm.$emit('change:createComplete', function() {
            if (self.options.multiScenario) {
                trigger();
            } else {
                //第一次加载
                //进入应用
                firstLoading();
            }
        })
    }


}
