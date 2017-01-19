import {
    config,
    dynamicView
} from '../../config/index'

/**
 * 创建li的translate起始坐标信息
 * flowType 如果是flow类型
 * @return {[type]}
 */
export function visualLayout(pageVisualMode) {

    //默认的config.visualMode
    let visualSize
    let needRecalculate = false

    //如果需要重新设置当前页面模式
    //visualMode结构需要变动，必须重置
    //pageVisualMode=3的情况下，每一个都重新计算新
    if (pageVisualMode && pageVisualMode !== config.visualMode || pageVisualMode === 3) {
        visualSize = dynamicView(pageVisualMode)
        needRecalculate = true
    } else {
        visualSize = config.visualSize
    }

    return {
        visualWidth: visualSize.width,
        visualHeight: visualSize.height,
        visualTop: visualSize.top,
        visualLeft: visualSize.left,
        visualLeftInteger: Math.abs(visualSize.left),
        needRecalculate //标记需要重新计算
    }
}
