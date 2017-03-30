import { config, resetVisualLayout } from '../../config/index'

/**
 * 创建li的translate起始坐标信息
 * flowType 如果是flow类型
 * @return {[type]}
 */
export function getVisualSize(pageVisualMode) {

  //默认的config.visualMode
  let visualSize = config.visualSize
  let hasRecalculate = false

  /*
  如果页面模式不跟页面保持一致或者是模式3的情况的
  就需要重新计算
  */
  if(pageVisualMode && pageVisualMode !== config.visualMode || pageVisualMode === 3) {
    visualSize = resetVisualLayout(pageVisualMode)
    hasRecalculate = true
  }

  return {
    visualWidth: visualSize.width,
    visualHeight: visualSize.height,
    visualTop: visualSize.top,
    visualLeft: visualSize.left,
    visualLeftInteger: Math.abs(visualSize.left),
    hasRecalculate //标记需要重新计算
  }
}
