
import { config } from '../../config/index'

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
    offset = config.virtualMode ? offset / 2 : offset
    return 'translate(' + offset + 'px,0px)' + translateZ
}


/**
 * 创建li的translate起始坐标信息
 * flowType 如果是flow类型
 * @return {[type]}
 */
export default function defaultStyle({
    data,
    hooks = {},
    createIndex,
    currIndex
} = {}) {

    let translate
    let direction
    let offset

    const viewWidth = config.viewSize.width

    const mixHooks = function(original, hook) {
        if (hook) {
            let newValue = hook(original)
            if (newValue !== undefined) {
                return newValue
            }
        }
        return original
    }

    /**
     * 左边
     */
    if (createIndex < currIndex) {
        let offsetLeft = -viewWidth
        offsetLeft = mixHooks(offsetLeft, hooks.left)
        translate = createTranslate(offsetLeft)
        offset = offsetLeft
        direction = 'before'
    }
    /**
     * 右边 
     */
    else if (createIndex > currIndex) {
        let offsetRight = viewWidth
        offsetRight = mixHooks(offsetRight, hooks.right)
        translate = createTranslate(offsetRight)
        offset = offsetRight
        direction = 'after'
    }
    /**
     * 中间区域
     */
    else if (currIndex == createIndex) {
        let offsetMiddle = 0
        offsetMiddle = mixHooks(offsetMiddle, hooks.middle)
        translate = createTranslate(offsetMiddle)
        offset = offsetMiddle
        direction = 'original'
    }

    _.extend(data, {
        translate,
        direction,
        offset
    })
}
