/*
 * 母版管理模块
 * @param  {[type]}
 * @return {[type]}
 */
import { Abstract } from './abstract'
import { translation } from '../pagebase/translation'
import { Pagebase } from '../pagebase/pagebase'
//动作热热点派发
import {
    suspend as _suspend,
    original as _original,
    autoRun as _autoRun
} from '../scheduler/index'

//扁平化对象到数组
let toArray = (filter) => {
    var arr = [];
    if (!filter.length) {
        for (var key in filter) {
            arr.push(filter[key]);
        }
        filter = arr;
    }
    return filter;
}

let prefix = Xut.plat.prefixStyle
let rword = "-"


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

export class MasterMgr extends Abstract {

    constructor(vm) {
        super()
        var config = Xut.config
        this.screenWidth = config.screenSize.width
        this.screenHeight = config.screenSize.height

        this.pageType = 'master';

        this.rootNode = vm.options.rootMaster;
        this.recordMasterscope = {}; //记录master区域范围
        this.recordMasterId = {}; //记录页面与母板对应的编号
        this.currMasterId = null; //可视区母板编号

        //记录视察处理的对象
        this.parallaxProcessedContetns = {};

        /**
         * 抽象方法
         * 创建视觉差容器
         */
        this.abstractCreateCollection();
    }

    /****************************************************************
     *
     *                 对外接口
     *
     ***************************************************************/

    //====================页面结构处理===========================

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
                'root': this.rootNode, //根元素
                'pptMaster': pptMaster //ppt母板ID
            })
        );

        //增加页面管理
        this.abstractAddCollection(reuseMasterKey, masterObj);

        return masterObj;
    }


    //销毁整个页面对象
    destroy() {
        this.rootNode = null;
        //销毁对象
        this.abstractDestroyCollection();
    }


    /**
     * 找到当前页面的可以需要滑动是视觉页面对象
     * @return {[type]}            [description]
     */
    findMaster(leftIndex, currIndex, rightIndex, direction, action) {
        var prevFlag,
            nextFlag,
            prevMasterObj,
            currMasterObj,
            nextMasterObj,
            prevMasterId = this.conversionMasterId(leftIndex),
            currMasterId = this.conversionMasterId(currIndex),
            nextMasterId = this.conversionMasterId(rightIndex);

        switch (direction) {
            case 'prev':
                if (prevFlag = (currMasterId !== prevMasterId)) {
                    currMasterObj = this.abstractGetPageObj(currMasterId);
                }
                if (prevMasterId && prevFlag) {
                    action === 'flipOver' && this.checkClear([currMasterId, prevMasterId]); //边界清理
                    prevMasterObj = this.abstractGetPageObj(prevMasterId)
                }
                break;
            case 'next':
                if (nextFlag = (currMasterId !== nextMasterId)) {
                    currMasterObj = this.abstractGetPageObj(currMasterId);
                }
                if (nextMasterId && nextFlag) {
                    action === 'flipOver' && this.checkClear([currMasterId, nextMasterId]); //边界清理
                    nextMasterObj = this.abstractGetPageObj(nextMasterId)
                }
                break;
        }
        return [prevMasterObj, currMasterObj, nextMasterObj];
    }


    /**
     * 页面滑动处理
     * 1 母版之间的切换
     * 2 浮动对象的切换
     */
    move(leftIndex, currIndex, rightIndex, direction, moveDistance, action, speed, nodes) {
        var parallaxOffset,
            self = this,
            isBoundary = false; //是边界处理

        //找到需要滑动的母版
        _.each(this.findMaster(leftIndex, currIndex, rightIndex, direction, action), function(pageObj, index) {
            if (pageObj) {

                isBoundary = true

                //母版交接判断
                //用户事件的触发
                pageObj.onceMaster = false

                //移动母版
                translation[action](pageObj, moveDistance[index], speed)

                //移动浮动容器
                if (pageObj.floatContents.MasterContainer) {
                    translation[action](pageObj, moveDistance[index], speed, pageObj.floatContents.MasterContainer)
                }
            }
        })

        //越界不需要处理内部视察对象
        this.isBoundary = isBoundary;
        if (isBoundary) {
            return;
        }

        //移动视察对象
        function moveParallaxObject(nodes) {
            self.moveParallaxs(moveDistance, currIndex, action, direction, speed, nodes)
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
     * 移动内部的视察对象
     */
    moveParallaxs(moveDistance, currIndex, action, direction, speed, nodes) {
        var rootNode,
            floatObj,
            contentObj,
            contentObjs,
            baseContents,
            currParallaxObj,
            currMoveDistance,
            hasFloatMater,
            floatMaterParallaxChange,
            //需要执行动画
            activationAnim = action === "flipRebound" || action === "flipOver",
            self = this;

        //处理当前页面内的视觉差对象效果
        if (currParallaxObj = this.abstractGetPageObj(this.conversionMasterId(currIndex))) {
            if (baseContents = currParallaxObj.baseGetContent()) {
                self.baseContents = baseContents;
                //移动距离
                currMoveDistance = moveDistance[1];
                //遍历所有活动对象
                _.each(baseContents, function(content) {
                    content.eachAssistContents(function(scope) {
                        //如果是视察对象移动
                        if (scope.parallax) {
                            rootNode = scope.parallax.rootNode;
                            contentObj = currParallaxObj.baseGetContentObject(scope.id)
                                /////////////////////
                                //如果有这个动画效果 //
                                //先停止否则通过视觉差移动会出问题
                                // //影响，摩天轮转动APK
                                // * 重新激动视觉差对象
                                // * 因为视察滑动对象有动画
                                // * 2个CSS3动画冲突的
                                // * 所以在视察滑动的情况下先停止动画
                                // * 然后给每一个视察对象打上对应的hack=>data-parallaxProcessed
                                // * 通过动画回调在重新加载动画
                                /////////////////////
                            if (action === "flipMove" && contentObj.anminInstance && !contentObj.parallaxProcessed) {
                                //标记
                                var actName = contentObj.actName;
                                contentObj.stopAnimations();
                                //视觉差处理一次,停止过动画
                                contentObj.parallaxProcessed = true;
                                //增加标记
                                rootNode.attr('data-parallaxProcessed', actName);
                                //记录
                                self.parallaxProcessedContetns[actName] = contentObj;
                            }

                            //移动视觉差对象
                            conversionTranslateX(rootNode, scope.parallax, direction, action, speed, nodes, currMoveDistance, floatMaterParallaxChange);
                        }
                    })
                })
            }
        }

        function conversionTranslateX(rootNode, scope, direction, action, speed, nodes, currMoveDistance, floatMaterParallaxChange) {
            var translate = scope.translate,
                offsetTranslate = scope.offsetTranslate,
                nodes_1, moveTranslate;

            //往前翻页
            if (direction === 'prev') {
                //分割的比例
                nodes_1 = scope.nodeProportion;
                //如果往前溢出则取0
                nodes = (nodes == nodes_1) ? 0 : nodes_1;
            }

            //视觉对象移动的距离
            moveTranslate = self._transformConversion(translate, currMoveDistance, nodes);

            switch (action) {
                //移动中
                case 'flipMove':
                    moveTranslate = self._flipMove(moveTranslate, offsetTranslate);
                    break;
                    //反弹
                case 'flipRebound':
                    moveTranslate = self._flipRebound(moveTranslate, offsetTranslate);
                    break;
                    //翻页结束,记录上一页的坐标
                case 'flipOver':
                    if (direction === 'prev') {
                        moveTranslate = self._flipOver(moveTranslate, offsetTranslate);
                    }
                    self._overMemory(moveTranslate, offsetTranslate);
                    /**
                     * 记录浮动母版视察修改
                     * 2014.6.30针对浮动处理
                     */
                    // floatMaterParallaxChange && floatMaterParallaxChange(moveTranslate.translateX)
                    break;
            }

            //直接操作元素
            self._transformNodes(rootNode, speed, moveTranslate, offsetTranslate.opacityStart || 0);
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


    //变化节点的css3transform属性
    _transformNodes(rootNode, speed, property, opacityStart) {
        var style = {},
            effect = '',
            x = 0,
            y = 0,
            z = 0,
            round = Math.round;

        if (property.translateX != undefined || property.translateY != undefined || property.translateZ != undefined) {
            x = round(property.translateX) || 0;
            y = round(property.translateY) || 0;
            z = round(property.translateZ) || 0;
            effect += String.format('translate3d({0}px,{1}px,{2}px) ', x, y, z);
        }

        if (property.rotateX != undefined || property.rotateY != undefined || property.rotateZ != undefined) {
            x = round(property.rotateX);
            y = round(property.rotateY);
            z = round(property.rotateZ);
            effect += x ? 'rotateX(' + x + 'deg) ' : '';
            effect += y ? 'rotateY(' + y + 'deg) ' : '';
            effect += z ? 'rotateZ(' + z + 'deg) ' : '';
        }

        if (property.scaleX != undefined || property.scaleY != undefined || property.scaleZ != undefined) {
            x = round(property.scaleX * 100) / 100 || 1;
            y = round(property.scaleY * 100) / 100 || 1;
            z = round(property.scaleZ * 100) / 100 || 1;
            effect += String.format('scale3d({0},{1},{2}) ', x, y, z);
        }

        if (property.opacity != undefined) {
            style.opacity = round(property.opacity * 100) / 100 + opacityStart;
            effect += ';'
        }

        ////////////////
        //最终改变视觉对象的坐标 //
        ////////////////
        if (effect) {
            style[prefix('transition-duration')] = speed + 'ms';
            style[prefix('transform')] = effect;
            rootNode.css(style);
        }
    }


    //针对跳转页面
    //制作处理器
    makeJumpPocesss(data) {
        var filter;
        var master = this;
        return {
            pre: function() {
                var targetIndex = data.targetIndex;
                //目标母板对象
                var targetkey = master.conversionMasterId(targetIndex);
                //得到过滤的边界keys
                //在filter中的页面为过滤
                filter = master.scanBounds(targetIndex, targetkey);
                //清理多余母板
                //filter 需要保留的范围
                master.checkClear(filter, true);
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

    //扫描边界
    //扫描key的左右边界
    //当前页面的左右边
    scanBounds(currPage, currkey) {
        var currKey = this.conversionMasterId(currPage),
            filter = {},
            i = currPage,
            prevKey, nextKey;

        //往前
        while (i--) {
            prevKey = this.conversionMasterId(i);
            if (prevKey && prevKey !== currkey) {
                filter['prev'] = prevKey;
                break;
            }
        }

        //往后
        nextKey = this.conversionMasterId(currPage + 1);

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


    //修正位置
    _fixPosition(filter) {

        var self = this

        function setPosition(parallaxObj, position) {
            //设置移动
            function toMove(distance, speed) {
                var element = parallaxObj.element;
                if (element) {
                    element.css(prefix('transition-duration'), speed + 'ms');
                    element.css(prefix('transform'), 'translate3d(' + distance + 'px,0px,0px)');
                }
            }

            if (position === 'prev') {
                toMove(-self.screenWidth);
            } else if (position === 'next') {
                toMove(self.screenWidth);
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


    //=======================去重检测==============================

    //当前同一视觉页面作用的范围
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

    //记录页面与模板标示的映射
    _updatadParallaxMaster(reuseMasterKey, pageIndex) {
        //记录页面与模板标示的映射
        this.recordMasterId[pageIndex] = reuseMasterKey;
        //更新可视区母板的编号
        this.currMasterId = this.conversionMasterId(Xut.Presentation.GetPageIndex())
    }

    //检测是否需要创建视觉差
    _checkRepeat(reuseMasterKey, pageOffset, pageIndex) {
        var tag = this._toRepeat(reuseMasterKey, pageIndex); //false就是没找到视察对象
        this._updataMasterscope(reuseMasterKey, pageIndex);
        this._updatadParallaxMaster(reuseMasterKey, pageIndex);
        return tag;
    }

    //transform转化成相对应的偏移量
    _transformConversion(property, moveDistance, nodes) {
        var temp = {},
            i;

        for (i in property) {
            switch (i) {
                case 'translateX':
                case 'translateZ':
                    temp[i] = moveDistance * nodes * property[i];
                    break;
                case 'translateY':
                    temp[i] = moveDistance * (this.screenHeight / this.screenWidth) * nodes * property[i];
                    break;
                case 'opacityStart':
                    temp[i] = property.opacityStart;
                    break;
                default:
                    //乘以-1是为了向右翻页时取值为正,位移不需这样做
                    temp[i] = -1 * moveDistance / this.screenWidth * property[i] * nodes;
            }
        }
        return temp;
    }

    //移动叠加值
    _flipMove(property, repairProperty) {
        var temp = {};
        var start = property.opacityStart;
        for (var i in property) {
            temp[i] = property[i] + repairProperty[i];
        }
        if (start > -1) temp.opacityStart = start;
        return temp;
    }

    //反弹
    _flipRebound(property, repairProperty) {
        var temp = {};
        for (var i in property) {
            temp[i] = repairProperty[i] || property[i];
        }
        return temp;
    }

    //翻页结束
    _flipOver(property, repairProperty) {
        return this._flipMove(property, repairProperty);
    }

    //结束后缓存上一个记录
    _overMemory(property, repairProperty) {
        for (var i in property) {
            repairProperty[i] = property[i];
        }
    }


    //修正跳转后视觉对象坐标
    _fixParallaxPox(parallaxObj, currPageIndex, targetIndex) {
        var self = this,
            contentObjs, prevNodes, nodes;
        if (contentObjs = parallaxObj.baseGetContent()) {
            contentObjs.forEach(function(contentObj) {
                contentObj.eachAssistContents(function(scope) {
                    if (scope.parallax) {
                        repairNodes.call(self, scope.parallax, currPageIndex, targetIndex);
                    }
                })
            })
        }

        function repairNodes(scope, currPageIndex, targetIndex) {
            var rangePage = scope.calculateRangePage(),
                rootNode = scope.rootNode,
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

            moveTranslate = this._transformConversion(translate, -self.screenWidth, nodes);
            this._transformNodes(rootNode, 300, moveTranslate, offsetTranslate.opacityStart);
            this._overMemory(moveTranslate, offsetTranslate);
        }

    }



    //检测是否需要清理
    // 1 普通翻页清理  【数组过滤条件】
    // 2 跳转页面清理  【对象过滤条件】
    checkClear(filter, toPage) {
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
            this.clearMemory(removeMasterId);
        }
    }

    //清理内存
    //需要清理的key合集
    clearMemory(removeMasterId) {
        var pageObj, self = this;
        _.each(removeMasterId, function(removekey) {
            //销毁页面对象事件
            if (pageObj = self.abstractGetPageObj(removekey)) {
                //移除事件
                pageObj.baseDestroy();
                //移除列表
                self.abstractRemoveCollection(removekey);
                self.removeRecordMasterscope(removekey);;
            }
            //清理作用域缓存
            delete self.recordMasterscope[removekey];
        })
    }


    //注册状态管理
    register(pageIndex, type, hotspotObj) {
        var parallaxObj = this.abstractGetPageObj(this.conversionMasterId(pageIndex))
        if (parallaxObj) {
            parallaxObj.registerCotents.apply(parallaxObj, arguments);
        }
    }

    //=======================工具方法==============================

    //page转化成母版ID
    conversionMasterId(pageIndex) {
        return this.recordMasterId ? this.recordMasterId[pageIndex] : undefined;
    }

    removeRecordMasterscope(removekey) {
        var me = this;
        var recordMasterscope = me.recordMasterscope[removekey];
        //清理页码指示标记
        recordMasterscope.forEach(function(scope) {
            delete me.recordMasterId[scope];
        })
    }


}
