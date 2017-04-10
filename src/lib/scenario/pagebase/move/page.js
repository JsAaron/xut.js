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
  baseProto.movePage = function(action, distance, speed, viewOffset, direction) {

    const pageNode = this.$pageNode[0]

    //浮动页面
    if(this.pageType === 'page') {
      //移动浮动页面容器
      const $floatElement = this.floatContentGroup.pageContainer
      if($floatElement) {
        translation[action]($floatElement[0], distance, speed)
      }
    }

    //浮动母版
    if(this.pageType === 'master') {
      //母版交接判断
      //用户事件的触发
      this.onceMaster = false
        //移动浮动容器
      const $masterElement = this.floatContentGroup.masterContainer
      if($masterElement) {
        translation[action]($masterElement[0], distance, speed)
      }
    }

    //过滤多个动画回调，
    //保证指向始终是当前页面
    //翻页 && 是母版页 && 是当前页面
    let isVisual = false // 是可视页面
    if(action === 'flipOver' &&
      this.pageType === 'page' &&
      distance === viewOffset) {
      //增加可视页面标记
      pageNode.setAttribute('data-view', true)
      isVisual = true
    }

    /*
      修复一个bug,超快速翻页的时候(speed<20)，动画结束事件会丢失页面
      所以针对这种情况，强制改speed改成0，这样动画完全屏蔽
      手动调用tiggerFilpComplete事件处理
      这里扩大下speed的范围
    */
    let initiative = false
    if(action === 'flipOver') {
      if(speed < 50) {
        speed = 0
        initiative = true
      }
    }


    translation[action](pageNode, distance, speed, () => {
      /*
      2种情况下会主动触发翻页结束回调
      1.flipMode === 'ban'，关闭了翻页效果，并且是可视区页面
      2.超快翻页的时候丢失了动画回调，并且是可视区页面
       */
      if(initiative && isVisual || config.flipMode === 'ban' && isVisual) {
        Xut.Application.tiggerFilpComplete(pageNode, true)
        return true
      }
    })
  }

}
