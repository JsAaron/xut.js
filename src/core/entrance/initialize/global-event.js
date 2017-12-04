/////////////////////////////
/// 初始化页面默认行为
/////////////////////////////

import { config } from '../../config/index'
import { repairImage } from 'repair/image'
import {
  bindMessage,
  unBindMessage,
  watchPostMessage,
  unWatchPostMessage
} from '../../api/post-message'

/**
 * 特殊的一个方法，用来修正图片资源错误的
 * dom中的事件onerror触发，所以直接
 * @return {[type]} [description]
 */
window.fixNodeError = function(type, node, chapterIndex, src) {
  if (type === 'image') {
    repairImage(node, chapterIndex, src)
  }
}

//只初始一次
//横竖切换要判断
let onceBind = false

/**
 * 全局事件
 * 只有完全退出整个应用
 * 或者退出iframe的情况下才使用
 *
 * 只是动态切换应用
 * 或者横竖切换不销毁
 * @return {[type]} [description]
 */
export function initGlobalEvent() {
  if (!onceBind) {

    onceBind = true

    watchPostMessage()
    bindMessage()

    //禁止全局的缩放处理
    $('body').on('touchmove', event => {
      event.preventDefault && event.preventDefault()
    })

    /*防止快速刷新，会触发Original时间*/
    setTimeout(function() {
      /*Home键音频动作处理*/
      $(document).on('visibilitychange', event => {
        /*home 后台*/
        if (document.visibilityState === 'hidden') {
          Xut.Application.Original()
        } else {
          /*如果不是嵌套iframe，激活*/
          if (!window.GLOBALIFRAME) {
            Xut.Application.Activate()
          }
        }
      })
    }, 1500)


    if (Xut.plat.isBrowser) {

      //桌面鼠标控制翻页
      $(document).keyup(event => {
        switch (event.keyCode) {
          case 37:
            Xut.View.GotoPrevSlide()
            break;
          case 39:
            Xut.View.GotoNextSlide()
            break;
        }
      })

      /*
      启动代码用户操作跟踪
      1、先不判断，一律按关闭提交（要有延迟）。
      2、如果是刷新，取消之前的延迟，提交刷新提示。
      */
      $(window).on('beforeunload', function() {
        config.sendTrackCode('exit', { time: (+new Date) - config.launch.launchTime })
      })

    }

  }

}

/*
移除全局绑定
 */
export function clearGlobalEvent() {
  if (onceBind) {
    unBindMessage()
    unWatchPostMessage()
    $('body').off() //touchmove 禁止全局的缩放处理
    $(document).off() //keyup 左右按钮
    $(window).off() //beforeunload,orientationchange
    onceBind = false
  }
}
