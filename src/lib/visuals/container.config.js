import { getFlowStyle } from './type/type.page.config'
import { config } from '../config/index'

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
const getBaseStyle = function({
    data,
    hooks,
    createIndex,
    currIndex,
    initAction,
    filpOverAction
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



/**
 * 自定义样式页面容器的样式
 * 创建页面的样式，与布局
 * 1 创建页面的初始化的Transform值
 * 是否初始化创建
 * @return {[type]} [description]
 */
export default function styleConfig({
    usefulData,
    initAction,
    filpOverAction
} = {}) {
    _.each(usefulData, function(data, index) {

        //混入指定元素的样式
        //提供可自定义配置接口
        if (data.isFlows) {
            _.extend(data, getFlowStyle())
        }


        /**
         * 容器钩子
         * @type {Object}
         */
        const hooks = {
            left(offsetLeft) {
                if (config.visualMode === 3) {
                    if (data.isFlows) {
                        offsetLeft = offsetLeft - config.viewSize.left
                        return offsetLeft
                    }
                }
            },
            middle(offsetMiddle) {
                if (config.visualMode === 3) {
                    if (data.isFlows) {
                        offsetMiddle = -config.viewSize.left
                        return offsetMiddle
                    }
                }
            },
            right() {
                if (config.visualMode === 3) {
                    if (data.isFlows) {
                    }
                }
            }
        }

        //设置容器的样式
        getBaseStyle({
            data,
            hooks,
            createIndex: data.pid,
            currIndex: data.visiblePid,
            initAction,
            filpOverAction
        })
    })

    return usefulData
}
