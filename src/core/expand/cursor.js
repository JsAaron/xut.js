import { config } from '../config/index'

/**
 * 用css3实现的忙碌光标
 * @return {[type]} [description]
 */

/**
 * 延时加载
 * @type {Number}
 */
let delayTime = 500

/**
 * 光标对象
 * @type {[type]}
 */
let node = null

/**
 * 是否禁用忙了光标
 * @type {Boolean}
 */
let isDisable = false

/**
 * 光标状态
 * 调用隐藏
 * @type {Boolean}
 */
let isCallHide = false

/**
 * setTimouet
 * @type {[type]}
 */
let timer = null

/**
 * 设置忙碌光标的图片地址
 */
let path

/**
 * create
 * @return {[type]} [description]
 *   return hasDisable() ? '' : '<div class="xut-busy-icon xut-fullscreen"></div>'
 */
export function createCursor() {
  if (isDisable) return
  const sWidth = config.visualSize.width
  const sHeight = config.visualSize.height
  const width = Math.min(sWidth, sHeight) / 4
  const space = Math.round((sHeight - width) / 2)
  const delay = [0, 0.9167, 0.833, 0.75, 0.667, 0.5833, 0.5, 0.41667, 0.333, 0.25, 0.1667, 0.0833]
  const deg = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]

  let count = 12
  let container = ''

  /*自定义*/
  if (path) {
    container += `<div class="xut-busy-middle fullscreen-background"
                       style="background-image: url(${path});">
                  </div>`
  } else {
    /*自带*/
    while (count--) {
      container +=
        `<div class="xut-busy-spinner"
              style="${Xut.style.transform}:rotate(${deg[count]}deg) translate(0,-142%);${Xut.style.animationDelay}:-${delay[count]}s">
         </div>`
    }
    container = `<div class="xut-busy-middle">${container}</div>`
  }

  return `<div class="xut-busy-icon xut-fullscreen">
            <div style="width:${width}px;height:${width}px;margin:${space}px auto;margin-top:${config.visualSize.top+space}px;">
                <div style="height:30%;"></div>
                  ${container}
                <div class="xut-busy-text"></div>
             </div>
          </div>`
}


const clear = () => {
  clearTimeout(timer)
  timer = null
}

function access(callback) {
  if (!node) {
    node = $('.xut-busy-icon')
  }
  if (node && node.length) {
    callback(node)
  }
}

/**
 * 显示光标
 */
export const showBusy = () => {
  if (isDisable || Xut.IBooks.Enabled || timer) return
  timer = setTimeout(() => {
    access(function(context) {
      context.show()
    })
    clear()
    if (isCallHide) {
      hideBusy()
      isCallHide = false
    }
  }, delayTime)
}


/**
 * 隐藏光标
 */
export const hideBusy = () => {
  //显示忙碌加锁，用于不处理hideBusy
  if (isDisable || Xut.IBooks.Enabled || showBusy.lock) return;
  if (!timer) {
    access(function(context) {
      context.hide()
    })
  } else {
    isCallHide = true
  }
}


/**
 * 显示光标
 * @param {[type]} txt [description]
 */
export const showTextBusy = (txt) => {
  if (isDisable || Xut.IBooks.Enabled) return;
  access(function(context) {
    context.css('pointer-events', 'none').find('.xut-busy-text').html(txt);
  })
  showBusy();
}


/**
 * 重置忙碌光标
 * 因为设置被覆盖了
 */
export const resetCursor = (data) => {
  path = null
  delayTime = 500
  node = null
}


/**
 * 通过lanuch重设接口
 */
export const setPath = (url) => {
  path = url
}

/**
 * 设置时间显示的时间间隔
 */
export const setDelay = (time) => {
  delayTime = time
}

/**
 * 设置禁用光标
 * isDisable 是否禁用
 * @return {[type]} [description]
 */
export const setDisable = () => {
  isDisable = true
}

/*
是否禁止了
 */
export const hasDisable = () => {
  return isDisable
}
