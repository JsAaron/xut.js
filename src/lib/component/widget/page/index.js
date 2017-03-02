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

import { fileLoad, removeFileLoad } from './loader'
import { createData } from './data'
import AdvSprite from './extend/adv.sprite'
import ScrollArea from './extend/scroll.area'

/**
 * 解析数据,获取content对象
 * @return {[type]} [description]
 */
let parseContentObjs = (pageType, inputPara, pageProportion) => {
    let contentIds = [];
    inputPara.content && _.each(inputPara.content, (contentId) => {
        contentIds.push(contentId);
    });
    return Xut.Contents.GetPageWidgetData(pageType, contentIds, pageProportion)
}


/**
 * 页面零件
 * @param {[type]} data [description]
 */
export default class PageWidget {

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
            parseContentObjs(this.pageType, this.inputPara, this.pageProportion)
        ]
    }

    /**
     * 初始化,加载文件
     * @return {[type]} [description]
     */
    _init() {
        //滚动区域
        if(this.widgetId == 60 && this.widgetName == "scrollarea") {
            var arg = this._getOptions()
            this.pageObj = new ScrollArea(arg[0], arg[1])
        }
        //Load the localized code first
        //Combined advanced Sprite
        else if(this.widgetId == 72 && this.widgetName == "spirit") {
            var arg = this._getOptions()
            this.pageObj = AdvSprite(arg[0], arg[1])
        }
        //直接扩展加载
        else {
            //If there is no
            if(typeof window[this.widgetName + "Widget"] != "function") {
                this.hasload = true
                fileLoad(this._executive, this)
            } else {
                this._executive()
            }
        }
    }


    /**
     * 执行函数
     * @return {[type]} [description]
     */
    _executive() {
        if(typeof(window[this.widgetName + "Widget"]) == "function") {
            var arg = this._getOptions()
            this.pageObj = new window[this.widgetName + "Widget"](arg[0], arg[1]);
        } else {
            console.error("Function [" + this.widgetName + "Widget] does not exist.");
        }
    }


    /**
     * 动画运行
     * @return {[type]} [description]
     */
    play() {
        return this.pageObj.play();
    }


    /**
     * 外部切换调用接口
     * @return {[type]} [description]
     */
    toggle() {
        this.pageObj && this.pageObj.toggle && this.pageObj.toggle();
    }

    /**
     * 动作停止接口
     * @return {[type]} [description]
     */
    stop() {
        this.pageObj && this.pageObj.stop && this.pageObj.stop();
    }

    /**
     * 销毁页面零件
     * @return {[type]} [description]
     */
    destroy() {
        this.hasload && removeFileLoad()
        this.pageObj && this.pageObj.destroy && this.pageObj.destroy();
    }

}
