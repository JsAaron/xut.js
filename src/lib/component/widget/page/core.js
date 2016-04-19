/********************************************************************
 *
 *                  创建所有的JS页面零件类
 *                  1 js
 *                  2 page
 *                  3 svg
 *                  4 canvas
 *                  5 webgL
 *
 * *******************************************************************/

import { loader } from './loader'
import { createData } from './data'
import { spiritSenior } from '../../pixi/spiritesenior/manage'

/**
 * 解析数据,获取content对象
 * @return {[type]} [description]
 */
let parseContentObjs = function(pageType, inputPara) {
    var contentIds = [];
    inputPara.content && _.each(inputPara.content, function(contentId) {
        contentIds.push(contentId);
    });
    return Xut.Contents.GetPageWidgetData(pageType, contentIds)
}


/**
 * 页面零件
 * @param {[type]} data [description]
 */
function pageWidget(data) {

    //获取数据
    _.extend(this, data)

    this.pageObj = null;
    this.widgetName + "Widget"
    this._init()

}

pageWidget.prototype = {

    _init: function() {
        //加载文件
        if (typeof window[this.widgetName + "Widget"] != "function") {
            loader(this._executive, this);
        } else {
            this._executive();
        }
    },

    /**
     * 执行函数
     * @return {[type]} [description]
     */
    _executive: function() {
        //得到content对象与数据
        var data = createData(this.inputPara, this.scrollPaintingMode, this.calculate);
        var contentObjs = parseContentObjs(this.pageType, this.inputPara);


        //pixi webgl模式
        //2016.4.14
        //高级精灵动画
        //如果是canvas模式
        //那么意味着所有的高级精灵动画统一转化pixi模式
        var pageObj = Xut.Presentation.GetPageObj(this.pageType, this.pageIndex)
        if (pageObj) {
            if (pageObj.canvasRelated.enable) {
                //高级精灵动画不处理
                //已经改成本地化pixi=>content调用了
                if (this.widgetName === "spirit") {
                    this.pageObj = new spiritSenior(data, contentObjs)
                    return;
                }
            }
        }

        //普通dom模式
        if (typeof(window[this.widgetName + "Widget"]) == "function") {
            this.pageObj = new window[this.widgetName + "Widget"](data, contentObjs);
        } else {
            console.error("Function [" + this.widgetName + "Widget] does not exist.");
        }
    },


    play: function() {
        // console.log('widget')
        return this.pageObj.play();
    },

    getIdName: function() {
        return this.pageObj.getIdName();
    },

    /**
     * 外部调用接口
     * @return {[type]} [description]
     */
    dispatchProcess: function() {
        this.pageObj.toggle();
    },

    /**
     * 处理包装容器的状态
     * @return {[type]} [description]
     */
    domWapper: function() {
        if (!this.wapper) return;
        if (this.state) {
            this.$wapper.hide();
        } else {
            this.$wapper.show();
        }
    },

    /**
     * 销毁页面零件
     * @return {[type]} [description]
     */
    destroy: function() {
        if (this.pageObj && this.pageObj.destroy) {
            this.pageObj.destroy();
        }
    }
}


export { pageWidget }
