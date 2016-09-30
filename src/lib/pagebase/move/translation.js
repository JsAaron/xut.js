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


const dydTransform = (distance) => {
    distance = config.doublePageMode ? distance / 2 : distance;
    return transform + ':' + 'translate(' + distance + 'px,0px)' + translateZ
}


/**
 * 创建translate初始值
 * @param  {[type]} offset [description]
 * @return {[type]}        [description]
 */
const createTranslate = (offset) => {
    offset = config.doublePageMode ? offset / 2 : offset
    return 'translate(' + offset + 'px,0px)' + translateZ
}



/**
 * 切换坐标
 */
const toTranslate3d = (node, distance, speed, viewOffset) => {
    distance = config.doublePageMode ? distance / 2 : distance
    if (node) {
        Xut.nextTick(function() {
            node.style[transform] = `translate(${distance}px,0px) ${translateZ}`
        })
        //修正flipMode切换页面的处理
        //没有翻页效果
        if (config.flipMode) {
            //可视区页面
            if (distance === viewOffset) {
                const cur = Xut.sceneController.containerObj('current')
                cur.vm.$globalEvent.transitionendComplete(node, node.getAttribute('data-view'))
            }
        } else {
            node.style[transitionDuration] = speed + 'ms'
        }
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
    reset: reset,
    flipMove: flipMove,
    flipRebound: flipRebound,
    flipOver: flipOver
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
