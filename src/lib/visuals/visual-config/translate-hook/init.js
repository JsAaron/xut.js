import { config } from '../../../config/index'
import { leftTranslate } from './left'
import { rightTranslate } from './right'

/**
 * 设置默认的样式
 * @return {[type]} [description]
 */

const transform = Xut.style.transform
const translateZ = Xut.style.translateZ

/**
 * 创建translate初始值
 * @param  {[type]} offset [description]
 * @return {[type]}        [description]
 */
const createTranslate = (offset) => {
    return `translate(${offset}px,0) ${translateZ}`
}

/**
 * 默认样式
 * @param  {Object} options.hooks [description]
 * @param  {[type]} createIndex   [description]
 * @param  {Object} currIndex                     } [description]
 * @return {[type]}               [description]
 */
export function initTranslate({
    createIndex,
    currIndex,
    direction,
    usefulData
}) {

    let translate
    let offset

    switch (direction) {
        case 'before':
            let offsetLeft = leftTranslate(usefulData)
            translate = createTranslate(offsetLeft)
            offset = offsetLeft
            break;
        case 'middle':
            let offsetMiddle = 0
            translate = createTranslate(offsetMiddle)
            offset = offsetMiddle
            break;
        case 'after':
            let offsetRight = rightTranslate(usefulData)
            translate = createTranslate(offsetRight)
            offset = offsetRight
            break;
    }

    return {
        translate,
        offset
    }
}
