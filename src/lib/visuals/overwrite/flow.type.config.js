import { config } from '../../config/index'

/**
 * flow页面的View尺寸单独设置
 * @return {[type]} [description]
 */
export function setFlowView() {

    let viewWidth = config.screenSize.width
    let viewHeight = config.screenSize.height
    let viewTop = 0
    let viewLeft = 0

    //默认全屏的处理
    if (config.visualMode === 0) {
        return {
            viewWidth,
            viewHeight,
            viewTop,
            viewLeft
        }
    }

    //宽度100%的情况下
    //如果是flow页面处理,全屏
    if (config.visualMode === 2) {
        if (config.pptVertical) {
            //其他页面上下压缩，左右100%
            //flows页面宽高都是100%
            if (config.screenVertical) {
                viewWidth = config.screenSize.width
                viewHeight = config.screenSize.height
                viewTop = 0
            } else {
                viewWidth = config.viewSize.width
                viewHeight = config.viewSize.height
                viewTop = 0
            }
        }
        return {
            viewWidth,
            viewHeight,
            viewTop
        }
    }

    //高度100%的情况下
    //flow下,设置容易宽度
    if (config.visualMode === 3) {
        if (config.pptVertical) {
            //竖版竖版
            //高度100%,宽度会存在溢出
            //所以需要修复flow页面是全屏状态
            if (config.screenVertical) {
                viewWidth = config.screenSize.width
            } else {

            }
        }
    }
}



/**
 * 设置flow页面的样式
 */
export function setFlowStyle() {
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
                if (data.isFlows) {}
            }
        }
    }
}
