/**
 * 抽象管理接口
 * @return {[type]} [description]
 */

export function Abstract() {}


Abstract.prototype = {
    /**
     * 创建页面合集
     * @return {[type]} [description]
     */
    abstractCreateCollection: function() {
        this.Collections = {}
    },

    /**
     * 增加合集管理
     */
    abstractAddCollection: function(pageIndex, pageObj) {
        this.Collections[pageIndex] = pageObj;
    },
 
    /**
     * 得到页面合集
     * @return {[type]} [description]
     */
    abstractGetCollection: function() {
        return this.Collections;
    },

    /**
     * 删除合集管理
     * @return {[type]} [description]
     */
    abstractRemoveCollection: function(pageIndex) {
        delete this.Collections[pageIndex];
    },

    /**
     * 销毁合集
     * @return {[type]} [description]
     */
    abstractDestroyCollection: function() {
        var k, Collections = this.Collections;
        for (k in Collections) {
            Collections[k].baseDestroy();
        }
        this.Collections = null;
    },

    /**
     * 找到页面对象
     * 1.页面直接pageIndex索引
     * 2.母版通过母版Id索引
     * @return {[type]} [description]
     */
    abstractGetPageObj: function(pageIndex, pageType) {
        pageType = pageType || this.pageType;
        //模板传递的可能不是页码
        if (pageType === 'master') {
            if (!/-/.test(pageIndex)) { //如果不是母版ID，只是页码
                pageIndex = this.conversionMasterId(pageIndex); //转化成母版id
            }
        }
        return this.Collections[pageIndex];
    },

    /**
     * 合并处理
     * @return {[type]} [description]
     */
    abstractAssistPocess: function(pageIndex, callback) {
        var pageObj;
        if (pageObj = this.abstractGetPageObj(pageIndex, this.pageType)) {
            if (callback) {
                callback(pageObj)
            } else {
                return pageObj;
            }
        }
    },

    /**
     * 获取页面容器ID
     * chpaterID
     * masterID
     * @return {[type]} [description]
     */
    abstractGetPageId: function(pageIndex, pageType) {
        var key = pageType === 'page' ? '_id' : 'pptMaster'
        return this.abstractGetPageData(pageIndex, key, pageType)
    },

    /**
     * 获取页面数据
     */
    abstractGetPageData: function(pageIndex, key, pageType) {
        var pageObj;
        //如果传递key是 pageType
        if (!pageType && key == 'page' || key == 'master') {
            pageType = key;
            key = null;
        }
        if (pageObj = this.abstractGetPageObj(pageIndex, pageType)) {
            return key ? pageObj.chapterDas[key] : pageObj.chapterDas;
        }
    },

    /**
     * 得到页面的nodes数据
     * @param  {[type]} pageIndex [description]
     * @return {[type]}           [description]
     */
    abstractGetPageNode: function(pageIndex, pageType) {
        return this.abstractGetPageData(pageIndex, 'nodes', pageType);
    },


    //***************************************************************
    //
    //  执行辅助对象事件
    //
    //***************************************************************
    abstractAssistAppoint: function(activityId, currIndex, outCallBack, actionName) {
        var pageObj;
        if (pageObj = this.abstractGetPageObj(currIndex)) {
            return pageObj.baseAssistRun(activityId, outCallBack, actionName);
        }
    }


}
