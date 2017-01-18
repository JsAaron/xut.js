import {
    config,
    dynamicView
} from '../../config/index'

/**
 * 创建li的translate起始坐标信息
 * flowType 如果是flow类型
 * @return {[type]}
 */
export function visualLayout(dynamicVisualMode) {

    //默认的config.visualMode
    let viewSize
    let needRecalculate = false
    let subViewSize

    //如果需要重新设置当前页面模式
    //visualMode结构需要变动，必须重置
    if(dynamicVisualMode && dynamicVisualMode !== config.visualMode) {
        viewSize = dynamicView(dynamicVisualMode)
        needRecalculate = true
    } else {
        viewSize = config.viewSize
    }

    return {
        viewWidth: viewSize.width,
        viewHeight: viewSize.height,
        viewTop: viewSize.top,
        viewLeft: viewSize.left,
        viewLeftInteger:Math.abs(viewSize.left),
        subViewSize, //子坐标保持模式3的原始数据
        needRecalculate //标记需要重新计算
    }
}
