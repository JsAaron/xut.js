/**
 * 页面切换效果
 * 平移
 * @return {[type]} [description]
 */

import { config } from '../config/index'

const transitionDuration = Xut.style.transitionDuration
const transform = Xut.style.transform
const translateZ = Xut.style.translateZ


const dydTransform = (distance) => {
    distance = config.virtualMode ? distance / 2 : distance;
    return transform + ':' + 'translate(' + distance + 'px,0px)' + translateZ
}


/**
 * 创建translate初始值
 * @param  {[type]} offset [description]
 * @return {[type]}        [description]
 */
const createTranslate = (offset) => {
    offset = config.virtualMode ? offset / 2 : offset
    return 'translate(' + offset + 'px,0px)' + translateZ
}


let prevEffect
let currEffect
let nextEffect


/**
 * 设置基本参数
 * @return {[type]} [description]
 */
const setOptions = () => {
    const viewWidth = config.viewSize.width
    const offsetLeft = -viewWidth
    const offsetRight = viewWidth
    const offsetCut =  0
    prevEffect = createTranslate(offsetLeft)
    currEffect = createTranslate(offsetCut)
    nextEffect = createTranslate(offsetRight)
    return {
        offsetLeft,
        offsetRight,
        offsetCut
    }
}


/**
 * 新的可视区页面
 * @param  {[type]}  distance [description]
 * @return {Boolean}          [description]
 */
const newViewPage = function(distance) {
    //calculateDistance中修改了对应的distance
    //这里给swipe捕获
    if (distance === 0 || Math.abs(distance) === Math.abs(config.overflowSize.left)) { //目标页面传递属性
        return true
    }
}


/**
 * 切换坐标
 * @param  {[type]} context  [description]
 * @param  {[type]} distance [description]
 * @param  {[type]} speed    [description]
 * @param  {[type]} element  [description]
 * @return {[type]}          [description]
 */
const toTranslate3d = (context, distance, speed, element) => {
    distance = config.virtualMode ? distance / 2 : distance;
    if (element = element || context.element || context.$contentProcess) {
        element.css(transform, 'translate(' + distance + 'px,0px)' + translateZ)
        if (config.flipMode) {
            //修正flipMode切换页面的处理
            //没有翻页效果
            if (newViewPage(distance)) {
                const cur = Xut.sceneController.containerObj('current')
                cur.vm.$globalEvent.setAnimComplete(element);
            }
        } else {
            element.css(transitionDuration, speed + "ms")
        }
    }
}


/**
 * 复位
 * @return {[type]} [description]
 */
const reset = (context) => {
    var element
    if (element = context.element || context.$contentProcess) {
        element.css(transitionDuration, '');
        element.css(transform, 'translate(0px,0px)' + translateZ);
    }
}


/**
 * 移动
 * @return {[type]} [description]
 */
const flipMove = (context, distance, speed, element) => {
    toTranslate3d(context, distance, speed, element)
}


/**
 * 移动反弹
 * @return {[type]} [description]
 */
const flipRebound = (context, distance, speed, element) => {
    toTranslate3d(context, distance, speed, element)
}


/**
 * 移动结束
 * @return {[type]} [description]
 */
const flipOver = (context, distance, speed, element) => {
    //过滤多个动画回调，保证指向始终是当前页面
    if (context.pageType === 'page') {
        if (newViewPage(distance)) { //目标页面传递属性
            context.element.attr('data-view', true)
        }
    }
    toTranslate3d(context, distance, speed, element)
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
export function fix(element, translate3d) {
    translate3d = translate3d === 'prevEffect' ? prevEffect : nextEffect
    element.css(transform, translate3d)
}


/**
 * 创建li的translate起始坐标信息
 * flowType 如果是flow类型
 * @return {[type]}
 */
export function createPageTransform({
    createIndex,
    currIndex,
    hasFlows,
    initAction,
    filpOverAction
} = {}) {

    const option = setOptions(hasFlows)

    let translate3d
    let direction
    let offset

    if (createIndex < currIndex) {
        translate3d = prevEffect
        offset = option.offsetLeft
        direction = 'before'
    } else if (createIndex > currIndex) {
        translate3d = nextEffect
        offset = option.offsetRight
        direction = 'after'
    } else if (currIndex == createIndex) {
        translate3d = currEffect
        offset = option.offsetCut
        direction = 'original'
    }
    return [translate3d, direction, offset, dydTransform]
}
