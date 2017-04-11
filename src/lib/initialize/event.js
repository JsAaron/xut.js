/////////////////////////////
/// 初始化页面默认行为
/////////////////////////////

import { config } from '../config/index'
import { fixAudio } from '../component/audio/fix'

//修复H5音频自动播放bug
if(Xut.plat.isBrowser && !Xut.plat.hasAutoPlayAudio) {
  fixAudio()
}

//只初始一次
//横竖切换要判断
let hasDefault = false

export function initGlobalEvent() {
  if(Xut.plat.isBrowser && !hasDefault) {
    hasDefault = true

    //禁止全局的缩放处理
    $('body').on('touchmove', event => {
      event.preventDefault && event.preventDefault()
    })

    //桌面鼠标控制翻页
    $(document).keyup(event => {
      switch(event.keyCode) {
        case 37:
          Xut.View.GotoPrevSlide()
          break;
        case 39:
          Xut.View.GotoNextSlide()
          break;
      }
    })

    /*Home键音频动作处理*/
    $(document).on('visibilitychange', event => {
      /*home 后台*/
      if(document.visibilityState === 'hidden') {
        Xut.Application.Original()
      } else {
        /*如果不是嵌套iframe，激活*/
        if(!window.GLOBALIFRAME) {
          Xut.Application.Activate()
        }
      }
    })

    /*启动代码用户操作跟踪*/
    config.hasTrackCode('app', function(notify) {
      $(window).on('beforeunload', function() {
        notify({ time: (+new Date) - config.launch.launchTime })
      })
    })

  }
}


export function cleanGlobalEvent() {
  if(hasDefault) {
    $('body').off() //touchmove 禁止全局的缩放处理
    $(document).off() //keyup 左右按钮
    $(window).off() //beforeunload,orientationchange
    hasDefault = false
  }
}
