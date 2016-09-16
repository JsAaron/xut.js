/**
 * 动作热点
 * 1. 跳转页面
 * 2. 打开系统应用程序
 */
import Action from '../component/action/index'


export default {

    /**
     * 创建节点
     * @return {[type]}   
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

        const id = actType + "_" + _id

        const html = `<div id="${id}"
                           data-belong="${pageType}" 
                           data-delegate="action" 
                           style="cursor:pointer;
                                  width:${scaleWidth}px;
                                  height:${scaleHeight}px;
                                  left:${scaleLeft}px;
                                  top:${scaleTop}px;
                                  background-size:100% 100%;
                                  position:absolute;
                                  z-index:${zIndex};
                                  ${backgroundImage}">
                      </div>`

        return String.styleFormat(html)
    },

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
        Action(data)
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
    }

}
