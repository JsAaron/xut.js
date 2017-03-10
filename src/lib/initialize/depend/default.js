/////////////////////////////
/// 初始化页面默认行为
/////////////////////////////

import {
  fixAudio
} from '../../component/audio/fix'

//修复H5音频自动播放bug
if(Xut.plat.isBrowser && !Xut.plat.hasAutoPlayAudio) {
  fixAudio()
}

//只初始一次
//横竖切换要判断
let hasDefault = false

export function initDefalut() {
  if(Xut.plat.isBrowser && !hasDefault) {

    hasDefault = true

    //禁止全局的缩放处理
    $('body').on('touchmove', e => {
      e.preventDefault && e.preventDefault()
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
  }
}


export function cleanDefalut() {
  if(hasDefault) {
    $('body').off() //默认事件
    $(document).off() //左右按钮
    $(window).off() //横竖切换
    hasDefault = false
  }
}
