import { config } from '../config/index'
import {
    rightPageHook,
    middlePageHook,
    leftPageHook
} from './visual-config/distance-hook/index'
import {
    hasValue,
    hash
} from '../util/lang'


/**
 * 获取页面对象的样式配置对象
 * @param  {[type]} pageIndex [description]
 * @return {[type]}           [description]
 */
const getPageStyle = function(pageIndex) {
    let pageBase = Xut.Presentation.GetPageObj(pageIndex)
    return pageBase && pageBase.getStyle
}

/**
 * 获取页面的可视区宽度
 * @return {[type]} [description]
 */
const getPageVisualWidth = function(pageStyle) {
    if(pageStyle) {
        return pageStyle.viewWidth
    }
    return 0
}

/**
 * 动态计算翻页距离
 * @return {[type]} [description]
 */
export function getDistance({
    action,
    distance,
    direction,
    leftIndex,
    middleIndex,
    rightIndex
}) {

    //页面的配置样式
    let pageStyles = {
        left: getPageStyle(leftIndex),
        middle: getPageStyle(middleIndex),
        right: getPageStyle(rightIndex)
    }

    let offset = {
        left: undefined,
        middle: undefined,
        right: undefined,
        //当前视图页面
        //用来处理页面回调
        view: undefined
    }

    if(action === 'flipMove') {
        offset.left = leftPageHook[action][direction](distance, pageStyles)
        offset.middle = distance
        offset.right = rightPageHook[action][direction](distance, pageStyles)
    }

    if(action === 'flipRebound') {
        offset.left = leftPageHook[action][direction](distance, pageStyles)
        offset.middle = distance
        offset.right = rightPageHook[action][direction](distance, pageStyles)
    }

    if(action === 'flipOver') {
        offset.left = leftPageHook[action][direction](distance, pageStyles)
        offset.middle = middlePageHook[action][direction](distance, pageStyles)
        offset.right = rightPageHook[action][direction](distance, pageStyles)
        if(direction === 'prev') {
            offset.view = offset.left
        } else {
            offset.view = offset.right
        }
    }

    return [offset.left, offset.middle, offset.right, offset.view]
}
