import { fix as _fix } from '../../pagebase/move/util.translation'

/**
 * 跳转之前提高层级问题
 * @return {[type]}          [description]
 */
const improveIndex = (complier, { currIndex } = {}) => {
    //提高page层级
    complier.pageMgr.abstractAssistPocess(currIndex, pageObj => {
        pageObj.$pageNode.css({
            'z-index': 9997
        });
    })

    //提高mater层级
    complier.masterContext(function() {
        this.abstractAssistPocess(currIndex, pageObj => {
            pageObj.$pageNode.css({
                'z-index': 1
            });
        })
    })
}


/**
 * 处理跳转逻辑
 * @param  {[type]} complier       [description]
 * @param  {[type]} data           [description]
 * @param  {[type]} createCallback [description]
 * @return {[type]}                [description]
 */
const calculateFlip = (complier, data, createCallback) => {
    //缓存当前页面索引用于销毁
    var pageIndex,
        i = 0,
        collectContainers = [],
        create = data.create,
        targetIndex = data.targetIndex;

    //需要创建的页面闭包器
    for (; i < create.length; i++) {
        pageIndex = create[i];
        collectContainers.push(function(targetIndex, pageIndex) {
            return function(callback) {
                //创建新结构
                complier.createPageBases([pageIndex], targetIndex, 'toPage', callback, {
                    'opacity': 0 //同页面切换,规定切换的样式
                })
            }
        }(targetIndex, pageIndex));
    }


    /**
     * 二维数组保存，创建返回的对象
     * 1 page对象
     * 2 母版对象
     * @type {Array}
     */
    data.pageBaseCollect = [];

    var i = 0,
        collectLength, count,
        count = collectLength = collectContainers.length;

    if (collectContainers && collectLength) {
        for (; i < collectLength; i++) {
            //收集创建的根节点,异步等待容器的创建
            collectContainers[i].call(complier, callbackPageBase => {
                if (count === 1) {
                    collectContainers = null;
                    setTimeout(() => {
                        createCallback(data);
                    }, 100)
                }
                //接受创建后返回的页面对象
                data.pageBaseCollect.push(callbackPageBase);
                count--;
            });
        }
    }
}


/**
 * 节点创建完毕后，切换页面动，执行动作
 * @param  {[type]} complier [description]
 * @param  {[type]} data     [description]
 * @return {[type]}          [description]
 */
const createContainerView = (complier, data) => {

    let prveHindex = data.currIndex
    let pageMgr = complier.pageMgr

    //停止当前页面动作
    complier.suspendPageBases({
        'stopPointer': prveHindex
    })

    //========处理跳转中逻辑=========

    /**
     * 清除掉不需要的页面
     * 排除掉当前提高层次页面
     */
    _.each(data['destroy'], function(destroyIndex) {
        if (destroyIndex !== data.currIndex) {
            pageMgr.clearPage(destroyIndex)
        }
    })


    //修正翻页2页的页面坐标值
    _.each(data['ruleOut'], function(pageIndex) {
        if (pageIndex > data['targetIndex']) {
            pageMgr.abstractAssistAppoint(pageIndex, function(pageObj) {
                _fix(pageObj.$pageNode, 'nextEffect')
            })
        }
        if (pageIndex < data['targetIndex']) {
            pageMgr.abstractAssistAppoint(pageIndex, function(pageObj) {
                _fix(pageObj.$pageNode, 'prevEffect')
            })
        }
    })


    let jumpPocesss

    //母版
    complier.masterContext(function() {
        jumpPocesss = this.makeJumpPocesss(data)
        jumpPocesss.pre();
    })

    //===========跳槽后逻辑========================
    pageMgr.clearPage(prveHindex)

    jumpPocesss && jumpPocesss.clean(data.currIndex, data.targetIndex)

    /**
     * 同页面切换,规定切换的样式复位
     * @param  {[type]} pageBase [description]
     * @return {[type]}          [description]
     */
    _.each(data.pageBaseCollect, function(pageBase) {
        _.each(pageBase, function(pageObj) {
            pageObj.$pageNode && pageObj.$pageNode.css({
                'opacity': 1
            })
        })
    })

    data.pageBaseCollect = null
    jumpPocesss = null
}

/**
 * 跳转页面逻辑处理
 * @param  {[type]} complier [description]
 * @param  {[type]} data     [description]
 * @param  {[type]} success  [description]
 * @return {[type]}          [description]
 */
export default function goToPage(complier, data, success) {
    //跳前逻辑
    improveIndex(complier, data);
    //处理逻辑
    calculateFlip(complier, data, function(data) {
        createContainerView(complier, data);
        success.call(complier, data)
    })
}
