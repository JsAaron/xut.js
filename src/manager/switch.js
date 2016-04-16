/**
 * 页面切换逻辑
 * @param  {[type]} ) [description]
 * @return {[type]}   [description]
 */

/**
 * 跳转之前提高层级问题
 * @return {[type]}          [description]
 */
function prev(complier, data) {
    var currIndex = data.currIndex;
    //跳转之前提高层级问题
    complier.pageMgr.abstractAssistPocess(currIndex, function(pageObj) {
            pageObj.element.css({
                'z-index': 9997
            });
        })
        //提高母版层级
    complier.callMasterMgr(function() {
        this.abstractAssistPocess(currIndex, function(pageObj) {
            pageObj.element.css({
                'z-index': 1
            });
        })
    })
}


//处理跳转逻辑
function calculateFlip(complier, data, createCallback) {
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
                complier.create([pageIndex], targetIndex, 'toPage', callback, {
                    'opacity': 0 //同页面切换,规定切换的样式
                });
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
            collectContainers[i].call(complier, function(callbackPageBase) {
                if (count === 1) {
                    collectContainers = null;
                    setTimeout(function() {
                        createCallback(data);
                    }, 100);
                }
                //接受创建后返回的页面对象
                data.pageBaseCollect.push(callbackPageBase);
                count--;
            });
        }
    }
}


//节点创建完毕后，切换页面动，执行动作
function createContainerView(complier, data) {

    var prveHindex = data.currIndex;
    var pageMgr = complier.pageMgr;

    //停止当前页面动作
    complier.suspend({
        'stopPointer': prveHindex
    });

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
                Translation.fix.call(pageObj, 'nextEffect')
            })
        }
        if (pageIndex < data['targetIndex']) {
            pageMgr.abstractAssistAppoint(pageIndex, function(pageObj) {
                Translation.fix.call(pageObj, 'prevEffect')
            })
        }
    })


    var jumpPocesss;

    //母版
    complier.callMasterMgr(function() {
        jumpPocesss = this.makeJumpPocesss(data);
        jumpPocesss.pre();
    })

    //===========跳槽后逻辑========================
    pageMgr.clearPage(prveHindex);

    jumpPocesss && jumpPocesss.clean(data.currIndex, data.targetIndex);

    /**
     * 同页面切换,规定切换的样式复位
     * @param  {[type]} pageBase [description]
     * @return {[type]}          [description]
     */
    _.each(data.pageBaseCollect, function(pageBase) {
        _.each(pageBase, function(pageObj) {
            pageObj.element && pageObj.element.css({
                'opacity': 1
            })
        })
    })

    data.pageBaseCollect = null;
    jumpPocesss = null;
}


export function SwitchPage(complier, data, success) {
    //跳前逻辑
    prev(complier, data);
    //处理逻辑
    calculateFlip(complier, data, function(data) {
        createContainerView(complier, data);
        success.call(complier, data)
    })
}
