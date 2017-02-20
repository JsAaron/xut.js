import {
  config
} from '../../../config/index'
import {
  translation
} from './translation'

/**
 * 滑动容器
 * @param  {[type]} baseProto [description]
 * @return {[type]}           [description]
 */
export default function(baseProto) {

  /**
   * 页面移动
   * @return {[type]} [description]
   */
  baseProto.moveContainer = function(action, distance, speed, viewOffset, direction) {

    const pageNode = this.$pageNode[0]

    //浮动页面
    if (this.pageType === 'page') {
      //移动浮动页面容器
      const $floatElement = this.floatContents.PageContainer
      if ($floatElement) {
        translation[action]($floatElement[0], distance, speed)
      }
    }

    //浮动母版
    if (this.pageType === 'master') {
      //母版交接判断
      //用户事件的触发
      this.onceMaster = false

      //移动浮动容器
      const $masterElement = this.floatContents.MasterContainer
      if ($masterElement) {
        translation[action]($masterElement[0], distance, speed)
      }
    }

    //过滤多个动画回调，
    //保证指向始终是当前页面
    //翻页 && 是母版页 && 是当前页面
    let isVisual = false // 是可视页面
    if (action === 'flipOver') {
      if (this.pageType === 'page' && distance === viewOffset) {
        //增加可视页面标记
        pageNode.setAttribute('data-view', true)
        isVisual = true
      }
    }

    //当前页面
    translation[action](pageNode, distance, speed, () => {
      //修正flipMode切换页面的处理
      //没有翻页效果
      //强制给动画结束触发
      //可视区页面
      //排除母版的情况
      if (config.flipMode === 'allow' && isVisual) {
        //设置动画完成
        Xut.Application.SetTransitionComplete(pageNode, pageNode.getAttribute('data-view'))
        return true
      }
    })
  }

}
