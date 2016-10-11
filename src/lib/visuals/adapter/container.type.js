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
    return 'translate(' + offset + 'px,0px)' + translateZ
}

/**
 * 混入钩子处理
 * @param  {[type]} original [description]
 * @param  {[type]} hook     [description]
 * @return {[type]}          [description]
 */
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
 * 创建li的translate起始坐标信息
 * flowType 如果是flow类型
 * @return {[type]}
 */
export default {

    /**
     * 默认视图
     * @return {[type]} [description]
     */
    view() {
        const viewSize = config.viewSize
        return {
            viewWidth: viewSize.width,
            viewHeight: viewSize.height,
            viewTop: viewSize.top,
            viewLeft: 0
        }
    }

    /**
     * 默认样式
     * @param  {Object} options.hooks [description]
     * @param  {[type]} createIndex   [description]
     * @param  {Object} currIndex                     } [description]
     * @return {[type]}               [description]
     */
    , translate({
        hooks = {},
        createIndex,
        currIndex,
        direction
    } = {}) {

        let translate
        let offset

        const viewWidth = config.viewSize.width

        switch (direction) {
            case 'before':
                let offsetLeft = -viewWidth
                offsetLeft = mixHooks(offsetLeft, hooks.left)
                translate = createTranslate(offsetLeft)
                offset = offsetLeft
                break
            case 'middle':
                let offsetMiddle = 0
                offsetMiddle = mixHooks(offsetMiddle, hooks.middle)
                translate = createTranslate(offsetMiddle)
                offset = offsetMiddle
                break
            case 'after':
                let offsetRight = viewWidth
                offsetRight = mixHooks(offsetRight, hooks.right)
                translate = createTranslate(offsetRight)
                offset = offsetRight
                break
        }

        return {
            translate,
            offset
        }
    }

}
