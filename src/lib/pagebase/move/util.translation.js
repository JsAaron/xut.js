/**
 * 页面切换效果
 * 平移
 * @return {[type]} [description]
 */
import { config } from '../../config/index'

const reqAnimationFrame = Xut.style.reqAnimationFrame
const transitionDuration = Xut.style.transitionDuration
const transform = Xut.style.transform
const translateZ = Xut.style.translateZ

/**
 * 切换坐标
 * 保证只是pageType === page才捕获动作
 */
const toTranslate3d = (node, distance, speed, callback) => {
    node && Xut.nextTick(function() {
        node.style[transform] = `translate(${distance}px,0px) ${translateZ}`
        node.style[transitionDuration] = speed + 'ms'
        callback && callback()
    })
}

/**
 * 设置
 * @param  {[type]} node [description]
 * @return {[type]}      [description]
 */
const set = (node, x) => {
    if (node) {
        node.style[transform] = `translate(${x}px,0px) ${translateZ}`
    }
}

/**
 * 复位
 * @return {[type]} [description]
 */
const reset = (node) => {
    if (node) {
        node.style[transform] = `translate(0px,0px) ${translateZ}`
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
const createTranslate = (offset) => {
    return 'translate(' + offset + 'px,0px)' + translateZ
}

/**
 * 修正坐标
 * @return {[type]} [description]
 */
export function fix($node, action) {
    const viewWidth = config.viewSize.width
    const translate = action === 'prevEffect' ? createTranslate(-viewWidth) : createTranslate(viewWidth)
    $node.css(transform, translate)
}
