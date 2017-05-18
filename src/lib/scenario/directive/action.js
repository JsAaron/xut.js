/**
 * 动作热点
 * 1. 跳转页面
 * 2. 打开系统应用程序
 */
import Action from '../../component/action/index'
import { getFileFullPath } from '../../util/option'

export default {
  createDom({
    _id,
    md5,
    actType,
    scaleWidth,
    scaleHeight,
    scaleTop,
    scaleLeft
  }, chpaterData, chapterId, pageIndex, zIndex, pageType) {
    return String.styleFormat(
      `<div id="${actType + "_" + _id}"
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
            ${ md5 ? "background-image: url(" + getFileFullPath(md5,'hot-action') + ");" : '' }">
      </div>`)
  }

  /*
   * touchEnd 全局派发的点击事件
   * 如果stopGlobalEvent == ture 事件由全局派发
   */
  ,
  trigger(data) {
    Action(data)
  }
}
