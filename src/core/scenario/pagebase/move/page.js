import { config } from '../../../config/index'
import { translation } from './translation'

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
  baseProto.movePage = function(action, distance, speed, viewOffset, outerCallFlip) {

    const pageNode = this.$pageNode[0]

    //浮动页面
    if (this.pageType === 'page') {
      const floatPageContainer = this.floatGroup.pageContainer
      if (floatPageContainer) {
        translation[action](floatPageContainer[0], distance, speed)
      }
    }

    //浮动母版
    if (this.pageType === 'master') {
      //母版交接判断
      //用户事件的触发
      this.onceMaster = false
      const floatMasterContainer = this.floatGroup.masterContainer
      if (floatMasterContainer) {
        translation[action](floatMasterContainer[0], distance, speed)
      }
    }


    /*
    针对翻页结束的处理
     */
    let isVisual = false // 是可视页面
    let fixQuickFlip = false //修复翻页
    let timer = null
    let toTranslateCB = null

    /*
    只有翻页的时候才处理
    1 增加页面标记
    2 处理页面回调
     */
    if (action === 'flipOver') {
      /*
         如果outerCall存在，就是外部调用翻页的的情况下处理
         修复一个bug,超快速翻页的时候(speed<300)，动画结束事件会丢失页面
         所以针对这种情况，强制改speed改成0，这样动画事件完全屏蔽
         通过回调中手动调用SetSwiperFilpComplete事件处理
         这里扩大下speed的范围
       */
      if (outerCallFlip) {
        if (speed < 100) {
          speed = 0
          fixQuickFlip = true
        }
      }

      /*
        过滤多个动画回调
        保证指向始终是当前页面
        翻页 && 是母版页 && 是当前页面
       */
      if (this.pageType === 'page' &&
        distance === viewOffset) {
        /*标记可视区页面*/
        isVisual = true

        /*增加可视页面标记*/
        pageNode.setAttribute('data-visual', true)

        /*
         就上做了fixQuickFlip修复都有可能不触发动画回调的情况，
         是这里做一个手动调用的强制处理,延长原本时间的500毫秒调用
         只处理Visual页面
         这里必须监控data-visual是否被移除了，才能正确处理
         */
        timer = setTimeout(function() {
          clearTimeout(timer)
          timer = null
          if (pageNode.getAttribute('data-visual')) {
            Xut.$warn({
              type: 'pagebase',
              content: '翻页translate回调丢失了，通过定时器手动调用修复'
            })
            toTranslateCB = null
            Xut.View.SetSwiperFilpComplete(pageNode, true)
          }
        }, speed + 500)
      }
    }


    /*Translate调用，通过引用方式，在定时器中可以取消*/
    toTranslateCB = () => {
      /*
      2种情况下会主动触发翻页结束回调
      1.gestureSwipe，关闭了翻页效果,直接跳页面，并且是可视区页面
      2.超快翻页的时候丢失了动画回调，并且是可视区页面
       */
      if (isVisual && (fixQuickFlip || !config.launch.gestureSwipe)) {
        Xut.View.SetSwiperFilpComplete(pageNode, true)
        return true
      }
    }

    translation[action](pageNode, distance, speed, toTranslateCB)

  }

}
