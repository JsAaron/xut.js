/**
 * 页面切换效果
 * 平移
 * @return {[type]} [description]
 */
import { config } from '../../../config/index'

const transitionDuration = Xut.style.transitionDuration

/**
 * 切换坐标
 * 保证只是pageType === page才捕获动作
 */
const setTranslate = (node, distance, speed, callback) => {
  if (node) {
    if (config.launch.scrollMode === 'v') {
      Xut.style.setTranslate({ node, speed, y: distance })
    } else {
      Xut.style.setTranslate({ node, speed, x: distance })
    }
    callback && callback()
  }
}

/**
 * 设置
 * @param  {[type]} node [description]
 * @return {[type]}      [description]
 */
const set = (node, value) => {
  if (node) {
    if (config.launch.scrollMode === 'v') {
      Xut.style.setTranslate({ node, y: value })
    } else {
      Xut.style.setTranslate({ node, x: value })
    }
  }
}

/**
 * 复位
 * @return {[type]} [description]
 */
const reset = (node) => {
  if (node) {
    Xut.style.setTranslate({ node, x: 0, y: 0 })
    node.style[transitionDuration] = ''
  }
}

/**
 * 移动
 * @return {[type]} [description]
 */
const flipMove = (...arg) => {
  setTranslate(...arg)
}

/**
 * 移动反弹
 * @return {[type]} [description]
 */
const flipRebound = (...arg) => {
  setTranslate(...arg)
}

/**
 * 移动结束
 * @return {[type]} [description]
 */
const flipOver = (...arg) => {
  setTranslate(...arg)
}

/**
 * translation滑动接口
 * @type {Object}
 */
export const translation = {
  set: set,
  reset: reset,
  flipMove: flipMove,
  flipRebound: flipRebound,
  flipOver: flipOver
}


/**
 * 创建translate初始值
 * @param  {[type]} offset [description]
 * @return {[type]}        [description]
 */
const createTranslate = (value) => {
  if (config.launch.scrollMode === 'v') {
    return Xut.style.setTranslateStyle(0, value)
  }
  return Xut.style.setTranslateStyle(value, 0)
}


/**
 * 修正坐标
 * 跳转使用
 * @return {[type]} [description]
 */
export function fix($node, action) {
  let translate
  if (config.launch.scrollMode === 'v') {
    const visualHight = config.visualSize.height
    translate = action === 'prevEffect' ? createTranslate(-visualHight) : createTranslate(visualHight)
  } else {
    const visualWidth = config.visualSize.width
    translate = action === 'prevEffect' ? createTranslate(-visualWidth) : createTranslate(visualWidth)
  }
  $node.css(Xut.style.transform, translate)
}
