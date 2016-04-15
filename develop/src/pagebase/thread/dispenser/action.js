//============动作热点==================
//
// 1. 跳转页面
// 2. 打开系统应用程序
//

import { ActionClass } from '../../../component/action'


let Action = {

    createDom: function(activityData, chpaterData, chapterId, pageIndex, zIndex, pageType) {
        var backgroundImage = '',
            //等比缩放
            width = activityData.scaleWidth,
            height = activityData.scaleHeight,
            top = activityData.scaleTop,
            left = activityData.scaleLeft;

        //热点背景图
        if (md5 = activityData.md5) {
            backgroundImage = "background-image: url(" + Xut.onfig.pathAddress + md5 + ");";
        }

        //==============创建触发点结构=============
        return String.format(
            '<div id="{0}"' + ' data-belong = "{1}"' + ' data-delegate="Action"'
            // +' autoplay="{2}" ' svg打包不可以属性
            + ' style="cursor: pointer;width:{3}px;height:{4}px;left:{5}px;top:{6}px;background-size:100% 100%;position:absolute;z-index:{7};{8}"></div>',
            activityData.actType + "_" + activityData._id,
            pageType,
            activityData.autoPlay,
            width,
            height,
            left,
            top,
            zIndex,
            backgroundImage
        );
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
    eventDelegate: function(data) {
        new ActionClass(data)
    },

    //========复位对象==========
    //
    //  通过按物理键，关闭当前热点
    //
    //  @return 如果当前没有需要处理的Action,
    //  需要返回一个状态标示告诉当前是否应该退出应用
    //
    recovery: function(opts) {
        if (this.state) {
            this.state = false;
            return true;
        } else {
            return false;
        }
    }
}


export {Action}