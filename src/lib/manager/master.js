/*
 * 母版管理模块
 * @param  {[type]}
 * @return {[type]}
 */
import { Abstract } from './abstract'
import { Pagebase } from '../pagebase/pagebase'

import {
    suspend as _suspend,
    original as _original,
    autoRun as _autoRun
} from '../command/index'

import {
    _overMemory,
    _transformNodes,
    _transformConversion
} from '../pagebase/move/parallax'

import { config } from '../config/index'

/**
 * 扁平化对象到数组
 * @param  {[type]} filter [description]
 * @return {[type]}        [description]
 */
const toArray = (filter) => {
    var arr = [];
    if (!filter.length) {
        for (var key in filter) {
            arr.push(filter[key]);
        }
        filter = arr;
    }
    return filter;
}

const rword = "-"
const transitionDuration = Xut.style.transitionDuration
const transform = Xut.style.transform
const translateZ = Xut.style.translateZ

/**
 * parallaObjsCollection: Object
 *      0: Page
 *      1: Page
 *
 *  recordMasterId: Object
 *      0: 9001
 *      1: 9001
 *
 *  recordMasterscope: Object
 *      9001: Array[2]
 *
 *  rootNode: ul # parallax.xut - parallax xut - flip
 *
 *  currMasterId: 9001 //实际的可使区
 */

export default class MasterMgr extends Abstract {

    constructor(vm) {
        super()

        this.viewWidth = config.viewSize.width
        this.viewHeight = config.viewSize.height

        this.pageType = 'master';

        this.rootNode = vm.options.rootMaster;
        this.recordMasterscope = {}; //记录master区域范围
        this.recordMasterId = {}; //记录页面与母板对应的编号
        this.currMasterId = null; //可视区母板编号

        /**
         * 记录视察处理的对象
         * @type {Object}
         */
        this.parallaxProcessedContetns = {};

        /**
         * 抽象方法
         * 创建视觉差容器
         */
        this.abstractCreateCollection();
    }


    /**
     * 注册状态管理
     * @param  {[type]} pageIndex  [description]
     * @param  {[type]} type       [description]
     * @param  {[type]} hotspotObj [description]
     * @return {[type]}            [description]
     */
    register(pageIndex, type, hotspotObj) {
        var parallaxObj = this.abstractGetPageObj(this._conversionMasterId(pageIndex))
        if (parallaxObj) {
            parallaxObj.registerCotents.apply(parallaxObj, arguments);
        }
    }


    /**
     * 创建
     * @param  {[type]} dataOpts       [description]
     * @param  {[type]} pageIndex      [description]
     * @param  {[type]} createCallBack [description]
     * @return {[type]}                [description]
     */
    create(dataOpts, pageIndex, createCallBack) {
        var masterObj, reuseMasterId, reuseMasterKey
        var pptMaster = dataOpts.chapterDas.pptMaster
        var pageOffset = dataOpts.chapterDas.pageOffset

        //母板复用的标示
        reuseMasterId = pageOffset && pageOffset.split(rword);

        //组合下标
        if (reuseMasterId && reuseMasterId.length === 3) {
            reuseMasterKey = pptMaster + rword + reuseMasterId[2];
        } else {
            reuseMasterKey = pptMaster;
        }

        //检测视觉差对象是否重复创建
        if (this._checkRepeat(reuseMasterKey, pageOffset, pageIndex)) {
            return
        }

        //通知外部,需要创建的母版
        createCallBack();

        masterObj = new Pagebase(
            _.extend(dataOpts, {
                'pageType': this.pageType, //创建页面的类型
                'rootNode': this.rootNode, //根元素
                'pptMaster': pptMaster //ppt母板ID
            })
        );

        //增加页面管理
        this.abstractAddCollection(reuseMasterKey, masterObj);

        return masterObj;
    }


    /**
     * 页面滑动处理
     * 1 母版之间的切换
     * 2 浮动对象的切换
     */
    move({
        nodes,
        speed,
        action,
        moveDist,
        leftIndex,
        currIndex,
        rightIndex,
        direction,
    } = {}) {

        let isBoundary = false; //是边界处理

        //找到需要滑动的母版
        const masterObjs = this._findMaster(leftIndex, currIndex, rightIndex, direction, action)

        _.each(masterObjs, function(pageObj, index) {
            if (pageObj) {
                isBoundary = true
                let dist = moveDist[index]
                pageObj.toMove(action, dist, speed, moveDist[3])
            }
        })

        //越界不需要处理内部视察对象
        this.isBoundary = isBoundary;
        if (isBoundary) {
            return;
        }

        //移动视察对象
        const moveParallaxObject = (nodes) => {
            this._moveParallaxs(currIndex, action, direction, moveDist, speed, nodes, this.parallaxProcessedContetns)
        }

        //移动视察对象
        switch (direction) {
            case 'prev':
                moveParallaxObject();
                break;
            case 'next':
                nodes && moveParallaxObject(nodes)
                break;
        }
    }


    /**
     * 停止行为
     * @return {[type]} [description]
     */
    suspend(pointers) {
        //如果未越界不需要处理行为
        if (!this.isBoundary) return;
        var masterObj,
            stopPointer = pointers.stopPointer;
        if (masterObj = this.abstractGetPageObj(stopPointer)) {
            var pageId = masterObj.baseGetPageId(stopPointer);
            //停止活动对象活动
            _suspend(masterObj, pageId);
        }
    }


    /**
     * 复位初始状态
     * @return {[type]} [description]
     */
    resetOriginal(pageIndex) {
        var originalPageObj;
        if (originalPageObj = this.abstractGetPageObj(pageIndex)) {
            _original(originalPageObj);
        }
    }


    /**
     *  母版自动运行
     */
    autoRun(data) {
        var masterObj, element;
        if (masterObj = this.abstractGetPageObj(data.currIndex)) {
            //热点状态复位
            this.resetOriginal(data.suspendIndex)
            _autoRun(masterObj, data.currIndex);
        }
    }


    /**
     * 重新激动视觉差对象
     * 因为视察滑动对象有动画
     * 2个CSS3动画冲突的
     * 所以在视察滑动的情况下先停止动画
     * 然后给每一个视察对象打上对应的hack=>data-parallaxProcessed
     * 通过动画回调在重新加载动画
     * @return {[type]} [description]
     */
    reactivation(target) {
        if (this.parallaxProcessedContetns) {
            var actName = target.id;
            var contentObj = this.parallaxProcessedContetns[actName];
            if (contentObj) {
                contentObj.runAnimations();
                //视觉差处理一次,停止过动画
                contentObj.parallaxProcessed = false;
                //移除标记
                target.removeAttribute('data-parallaxProcessed');
                //记录
                delete this.parallaxProcessedContetns[actName];
            }
        }
    }


    /**
     * 制作处理器
     * 针对跳转页面
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    makeJumpPocesss(data) {
        var filter;
        var master = this;
        return {
            pre: function() {
                var targetIndex = data.targetIndex;
                //目标母板对象
                var targetkey = master._conversionMasterId(targetIndex);
                //得到过滤的边界keys
                //在filter中的页面为过滤
                filter = master._scanBounds(targetIndex, targetkey);
                //清理多余母板
                //filter 需要保留的范围
                master._checkClear(filter, true);
                //更新可视母板编号
                master.currMasterId = targetkey;
            },
            //修正位置
            clean: function(currIndex, targetIndex) {
                master._fixPosition(filter);
                master._checkParallaxPox(currIndex, targetIndex);
            }
        }
    }


    /**
     * 销毁整个页面对象
     * @return {[type]} [description]
     */
    destroy() {
        this.rootNode = null;
        //销毁对象
        this.abstractDestroyCollection();
    }


    /**
     * 找到当前页面的可以需要滑动是视觉页面对象
     * @return {[type]}            [description]
     */
    _findMaster(leftIndex, currIndex, rightIndex, direction, action) {
        var prevFlag,
            nextFlag,
            prevMasterObj,
            currMasterObj,
            nextMasterObj,
            prevMasterId = this._conversionMasterId(leftIndex),
            currMasterId = this._conversionMasterId(currIndex),
            nextMasterId = this._conversionMasterId(rightIndex);

        switch (direction) {
            case 'prev':
                if (prevFlag = (currMasterId !== prevMasterId)) {
                    currMasterObj = this.abstractGetPageObj(currMasterId);
                }
                if (prevMasterId && prevFlag) {
                    action === 'flipOver' && this._checkClear([currMasterId, prevMasterId]); //边界清理
                    prevMasterObj = this.abstractGetPageObj(prevMasterId)
                }
                break;
            case 'next':
                if (nextFlag = (currMasterId !== nextMasterId)) {
                    currMasterObj = this.abstractGetPageObj(currMasterId);
                }
                if (nextMasterId && nextFlag) {
                    action === 'flipOver' && this._checkClear([currMasterId, nextMasterId]); //边界清理
                    nextMasterObj = this.abstractGetPageObj(nextMasterId)
                }
                break;
        }
        return [prevMasterObj, currMasterObj, nextMasterObj];
    }


    /**
     * 移动内部的视察对象
     * 处理当前页面内的视觉差对象效果
     */
    _moveParallaxs(currIndex, ...arg) {
        const getMasterId = this._conversionMasterId(currIndex)
        const currParallaxObj = this.abstractGetPageObj(getMasterId)

        //处理当前页面内的视觉差对象效果
        if (currParallaxObj) {
            currParallaxObj.moveParallax(...arg)
        }
    }


    //扫描边界
    //扫描key的左右边界
    //当前页面的左右边
    _scanBounds(currPage, currkey) {
        var currKey = this._conversionMasterId(currPage),
            filter = {},
            i = currPage,
            prevKey, nextKey;

        //往前
        while (i--) {
            prevKey = this._conversionMasterId(i);
            if (prevKey && prevKey !== currkey) {
                filter['prev'] = prevKey;
                break;
            }
        }

        //往后
        nextKey = this._conversionMasterId(currPage + 1);

        //如果有下一条记录
        if (nextKey && nextKey !== currkey) {
            //如果不是当期页面满足范围要求
            filter['next'] = nextKey;
        }

        //当前页面
        if (currKey) {
            filter['curr'] = currKey;
        }
        return filter;
    }


    /**
     * 修正位置
     * @param  {[type]} filter [description]
     * @return {[type]}        [description]
     */
    _fixPosition(filter) {

        var self = this

        const setPosition = function(parallaxObj, position) {

            /**
             * 设置移动
             */
            const toMove = function(distance, speed) {
                var element = parallaxObj.element;
                if (element) {
                    element.css(transitionDuration, speed + 'ms');
                    element.css(transform, 'translate(' + distance + 'px,0px)' + translateZ)
                }
            }

            if (position === 'prev') {
                toMove(-self.viewWidth);
            } else if (position === 'next') {
                toMove(self.viewWidth);
            } else if (position === 'curr') {
                toMove(0);
            }
        }

        for (var key in filter) {
            switch (key) {
                case 'prev':
                    setPosition(this.abstractGetPageObj(filter[key]), 'prev')
                    break;
                case 'curr':
                    setPosition(this.abstractGetPageObj(filter[key]), 'curr')
                    break;
                case 'next':
                    setPosition(this.abstractGetPageObj(filter[key]), 'next')
                    break;
            }
        }
    }


    _checkParallaxPox(currPageIndex, targetIndex) {
        var key, pageObj,
            pageCollection = this.abstractGetCollection();
        for (key in pageCollection) {
            pageObj = pageCollection[key];
            //跳跃过的视觉容器处理
            this._fixParallaxPox(pageObj, currPageIndex, targetIndex)
        }
    }


    /**
     * 当前同一视觉页面作用的范围
     * @param  {[type]} reuseMasterKey [description]
     * @param  {[type]} pageIndex      [description]
     * @return {[type]}                [description]
     */
    _toRepeat(reuseMasterKey, pageIndex) {
        var temp;
        if (temp = this.recordMasterscope[reuseMasterKey]) {
            return temp;
        }
        return false;
    }

    //更新母板作用域范围
    //recordMasterscope:{
    //   9001-1:[0,1], master 对应记录的页码
    //   9002-1:[2,3]
    //   9001-2:[4,5]
    //}
    _updataMasterscope(reuseMasterKey, pageIndex) {
        var scope;
        if (scope = this.recordMasterscope[reuseMasterKey]) {
            if (-1 === scope.indexOf(pageIndex)) {
                scope.push(pageIndex);
            }
        } else {
            this.recordMasterscope[reuseMasterKey] = [pageIndex]
        }
    }

    /**
     * 记录页面与模板标示的映射
     * @param  {[type]} reuseMasterKey [description]
     * @param  {[type]} pageIndex      [description]
     * @return {[type]}                [description]
     */
    _updatadParallaxMaster(reuseMasterKey, pageIndex) {
        //记录页面与模板标示的映射
        this.recordMasterId[pageIndex] = reuseMasterKey;
        //更新可视区母板的编号
        this.currMasterId = this._conversionMasterId(Xut.Presentation.GetPageIndex())
    }


    /**
     * 检测是否需要创建视觉差
     * @param  {[type]} reuseMasterKey [description]
     * @param  {[type]} pageOffset     [description]
     * @param  {[type]} pageIndex      [description]
     * @return {[type]}                [description]
     */
    _checkRepeat(reuseMasterKey, pageOffset, pageIndex) {
        var tag = this._toRepeat(reuseMasterKey, pageIndex); //false就是没找到视察对象
        this._updataMasterscope(reuseMasterKey, pageIndex);
        this._updatadParallaxMaster(reuseMasterKey, pageIndex);
        return tag;
    }


    /**
     * 修正跳转后视觉对象坐标
     * @param  {[type]} parallaxObj   [description]
     * @param  {[type]} currPageIndex [description]
     * @param  {[type]} targetIndex   [description]
     * @return {[type]}               [description]
     */
    _fixParallaxPox(parallaxObj, currPageIndex, targetIndex) {
        let self = this
        let contentObjs
        let prevNodes
        let nodes

        const repairNodes = function(scope, currPageIndex, targetIndex) {
            var rangePage = scope.calculateRangePage(),
                containsNode = scope.containsNode,
                translate = scope.translate,
                offsetTranslate = scope.offsetTranslate,
                moveTranslate,
                nodes = Xut.Presentation.GetPageNode(targetIndex - 1);

            if (targetIndex > currPageIndex) {
                //next
                if (targetIndex > rangePage['end']) {
                    nodes = 1;
                }
            } else {
                //prev
                if (targetIndex < rangePage['start']) {
                    nodes = 0;
                }
            }

            moveTranslate = _transformConversion(translate, -self.viewWidth, nodes);
            _transformNodes(containsNode, 300, moveTranslate, offsetTranslate.opacityStart);
            _overMemory(moveTranslate, offsetTranslate);
        }


        if (contentObjs = parallaxObj.baseGetContent()) {
            contentObjs.forEach(function(contentObj) {
                contentObj.eachAssistContents(function(scope) {
                    if (scope.parallax) {
                        repairNodes.call(self, scope.parallax, currPageIndex, targetIndex);
                    }
                })
            })
        }

    }


    //检测是否需要清理
    // 1 普通翻页清理  【数组过滤条件】
    // 2 跳转页面清理  【对象过滤条件】
    _checkClear(filter, toPage) {
        var key, indexOf,
            removeMasterId = _.keys(this.abstractGetCollection());

        // 如果有2个以上的母板对象,就需要清理
        if (removeMasterId.length > 2 || toPage) { //或者是跳转页面
            //解析对象
            filter = toArray(filter);
            //过滤
            _.each(filter, function(masterId) {
                if (masterId !== undefined) {
                    indexOf = removeMasterId.indexOf(masterId.toString());
                    if (-1 !== indexOf) {
                        //过滤需要删除的对象
                        removeMasterId.splice(indexOf, 1);
                    }
                }
            })
            this._clearMemory(removeMasterId);
        }
    }


    /**
     * 清理内存
     * 需要清理的key合集
     * @param  {[type]} removeMasterId [description]
     * @return {[type]}                [description]
     */
    _clearMemory(removeMasterId) {
        var pageObj, self = this;
        _.each(removeMasterId, function(removekey) {
            //销毁页面对象事件
            if (pageObj = self.abstractGetPageObj(removekey)) {
                //移除事件
                pageObj.baseDestroy();
                //移除列表
                self.abstractRemoveCollection(removekey)
                self._removeRecordMasterscope(removekey)
            }
            //清理作用域缓存
            delete self.recordMasterscope[removekey];
        })
    }


    /**
     * page转化成母版ID
     * @param  {[type]} pageIndex [description]
     * @return {[type]}           [description]
     */
    _conversionMasterId(pageIndex) {
        return this.recordMasterId ? this.recordMasterId[pageIndex] : undefined;
    }


    _removeRecordMasterscope(removekey) {
        var me = this;
        var recordMasterscope = me.recordMasterscope[removekey];
        //清理页码指示标记
        recordMasterscope.forEach(function(scope) {
            delete me.recordMasterId[scope];
        })
    }

}
