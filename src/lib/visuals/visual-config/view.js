import {
    config,
    dynamicView
} from '../../config/index'

/**
 * 创建li的translate起始坐标信息
 * flowType 如果是flow类型
 * @return {[type]}
 */
export function visualView(dynamicVisualMode) {

    //默认的config.visualMode
    let viewSize
    let overflowLeft = 0
    let needResetProportion = false

    //如果需要重新设置当前页面模式
    //visualMode结构需要变动，必须重置
    if (dynamicVisualMode && dynamicVisualMode != config.visualMode || dynamicVisualMode === 3) {
        viewSize = dynamicView(dynamicVisualMode)
        if (dynamicVisualMode === 3) { //宽度模式，有偏离量
            overflowLeft = viewSize.left
        }
        needResetProportion = true
    } else {
        viewSize = config.viewSize
    }

    return {
        viewWidth: viewSize.width,
        viewHeight: viewSize.height,
        viewTop: viewSize.top,
        viewLeft: 0,
        overflowLeft, //实际偏移量
        needResetProportion //扩展
    }
}
