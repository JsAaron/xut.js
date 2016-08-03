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
import AdvSprite from './advsprite'


/**
 * 解析数据,获取content对象
 * @return {[type]} [description]
 */
let parseContentObjs = (pageType, inputPara) => {
    let contentIds = [];
    inputPara.content && _.each(inputPara.content, (contentId) => {
        contentIds.push(contentId);
    });
    return Xut.Contents.GetPageWidgetData(pageType, contentIds)
}


/**
 * 页面零件
 * @param {[type]} data [description]
 */
export class PageWidget {


    constructor(data) {
        _.extend(this, data)
        this.pageObj = null
        this._init()
    }


    /**
     * 获取参数
     * 得到content对象与数据
     * @return {[type]} [description]
     */
    _getOptions() {
        return [
            createData(this.inputPara, this.scrollPaintingMode, this.calculate),
            parseContentObjs(this.pageType, this.inputPara)
        ]
    }


    /**
     * 初始化,加载文件
     * @return {[type]} [description]
     */
    _init() {
        //Load the localized code first
        //Combined advanced Sprite
        if (this.widgetId == "72" && this.widgetName == "spirit") {
            var arg = this._getOptions()
            this.pageObj = AdvSprite(arg[0], arg[1])
        } else {
            //If there is no
            if (typeof window[this.widgetName + "Widget"] != "function") {
                loader(this._executive, this);
            } else {
                this._executive();
            }
        }
    }


    /**
     * 执行函数
     * @return {[type]} [description]
     */
    _executive() {
        if (typeof(window[this.widgetName + "Widget"]) == "function") {
            var arg = this._getOptions()
            this.pageObj = new window[this.widgetName + "Widget"](arg[0], arg[1]);
        } else {
            console.error("Function [" + this.widgetName + "Widget] does not exist.");
        }
    }


    play() {
        return this.pageObj.play();
    }


    getIdName() {
        return this.pageObj.getIdName();
    }


    /**
     * 外部调用接口
     * @return {[type]} [description]
     */
    dispatchProcess() {
        this.pageObj.toggle();
    }


    /**
     * 处理包装容器的状态
     * @return {[type]} [description]
     */
    domWapper() {
        if (!this.wapper) return;
        if (this.state) {
            this.$wapper.hide();
        } else {
            this.$wapper.show();
        }
    }


    /**
     * 销毁页面零件
     * @return {[type]} [description]
     */
    destroy() {
        if (this.pageObj && this.pageObj.destroy) {
            this.pageObj.destroy();
        }
    }

}
