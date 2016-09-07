/**
 * 动作热点
 * 1. 跳转页面
 * 2. 打开系统应用程序
 */

import { ActionClass } from '../component/action/index'


export default {

    /**
     * 是否阻止全局事件派发
     * @type {Boolean}
     *   false 事件由全局接管派发
     *   false 事件由hotspot处理触发
     *   全局提供的事件接口
     *   {
     *       globalTouchStart
     *       globalTouchMove
     *       globalTouchEnd
     *   }
     */
    stopDelegate: false,


    /**
     * touchEnd 全局派发的点击事件
     * 如果stopGlobalEvent == ture 事件由全局派发
     */
    eventDelegate(data) {
        new ActionClass(data)
    },

    /**
     * 复位对象
     * 通过按物理键，关闭当前热点
     * 如果当前没有需要处理的Action
     * 需要返回一个状态标示告诉当前是否应该退出应用
     * @param  {[type]} opts [description]
     * @return {[type]}      [description]
     */
    recovery(opts) {
        if (this.state) {
            this.state = false;
            return true;
        } else {
            return false;
        }
    },


    /**
     * 创建节点
     * @param  {[type]} activityData [description]
     * @param  {[type]} chpaterData  [description]
     * @param  {[type]} chapterId    [description]
     * @param  {[type]} pageIndex    [description]
     * @param  {[type]} zIndex       [description]
     * @param  {[type]} pageType     [description]
     * @return {[type]}              [description]
     */
    createDom({
        _id,
        md5,
        actType,
        scaleWidth,
        scaleHeight,
        scaleTop,
        scaleLeft
    } = {}, chpaterData, chapterId, pageIndex, zIndex, pageType) {

        //热点背景图
        let backgroundImage = ''
        if (md5) {
            backgroundImage = "background-image: url(" + Xut.config.pathAddress + md5 + ");";
        }

        let html =
            '<div id="{{id}}" ' +
            'data-belong="{{pageType}}" ' +
            'data-delegate="Action" ' +
            'style=' +
            '"' +
            'cursor:pointer;' +
            'width:{{width}}px;height:{{height}}px;left:{{left}}px;top:{{top}}px;' +
            'background-size:100% 100%;' +
            'position:absolute;' +
            'z-index:{{zIndex}};{{backgroundImage}}' +
            '"' +
            '></div>'

        return _.template(html, {
            id: actType + "_" + _id,
            pageType: pageType,
            width: scaleWidth,
            height: scaleHeight,
            left: scaleLeft,
            top: scaleTop,
            zIndex: zIndex,
            backgroundImage: backgroundImage
        })
    }

}
