/**
 * 页面切换效果
 * 平移
 * @return {[type]} [description]
 */
import { config } from '../../../config/index'

const reqAnimationFrame = Xut.style.reqAnimationFrame
const transitionDuration = Xut.style.transitionDuration
const transform = Xut.style.transform

/**
 * 切换坐标
 * 保证只是pageType === page才捕获动作
 */
const toTranslate3d = (node, distance, speed, callback) => {
  if (node) {
    if (config.launch.flipMode === 'vertical') {
      node.style[transform] = `translate3d(0px,${distance}px,0px)`
    } else {
      node.style[transform] = `translate3d(${distance}px,0px,0px)`
    }
    node.style[transitionDuration] = speed + 'ms'
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
    if (config.launch.flipMode === 'vertical') {
      node.style[transform] = `translate3d(0px,${value}px,0px)`
    } else {
      node.style[transform] = `translate3d(${value}px,0px,0px)`
    }
  }
}

/**
 * 复位
 * @return {[type]} [description]
 */
const reset = (node) => {
  if (node) {
    node.style[transform] = `translate3d(0px,0px,0px)`
    node.style[transitionDuration] = ''
  }
}

/**
 * 移动
 * @return {[type]} [description]
 */
const flipMove = (...arg) => {
  toTranslate3d(...arg)
}

/**
 * 移动反弹
 * @return {[type]} [description]
 */
const flipRebound = (...arg) => {
  toTranslate3d(...arg)
}

/**
 * 移动结束
 * @return {[type]} [description]
 */
const flipOver = (...arg) => {
  toTranslate3d(...arg)
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
  if (config.launch.flipMode === 'vertical') {
    return `translate3d(0px,${value}px,0px)`
  }
  return `translate3d(${value}px,0px,0px)`
}


/**
 * 修正坐标
 * 跳转使用
 * @return {[type]} [description]
 */
export function fix($node, action) {
  let translate
  if (config.launch.flipMode === 'vertical') {
    const visualHight = config.visualSize.height
    translate = action === 'prevEffect' ? createTranslate(-visualHight) : createTranslate(visualHight)
  } else {
    const visualWidth = config.visualSize.width
    translate = action === 'prevEffect' ? createTranslate(-visualWidth) : createTranslate(visualWidth)
  }
  $node.css(transform, translate)
}
