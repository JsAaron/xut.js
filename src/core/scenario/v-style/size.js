import { config, resetVisualLayout } from '../../config/index'
import { converDoublePage } from '../scheduler/public'

/**
 * 创建li的translate起始坐标信息
 * flowType 如果是flow类型
 * @return {[type]}
 */
export function getVisualSize(styleDataset) {

  const {
    pageVisualMode,
    direction,
    doubleMainIndex,
    doublePosition,
    visualChapterIndex
  } = styleDataset

  //默认的config.launch.visualMode
  let visualSize = config.visualSize
  let hasRecalculate = false

  /*
  如果页面模式不跟页面保持一致或者是模式3的情况的
  就需要重新计算
  */
  if(pageVisualMode && pageVisualMode !== config.launch.visualMode || pageVisualMode === 3) {
    visualSize = resetVisualLayout(pageVisualMode)
    hasRecalculate = true
  }

  /*
  双页模式，重新定义页面尺寸与布局,从0页面开始叠加每个页面的距离
   */
  if(doublePosition && doubleMainIndex !== undefined) {
    const doubleIds = converDoublePage(doubleMainIndex)
    if(doublePosition === 'left') {
      visualSize.left = doubleIds[0] * visualSize.width
    } else {
      visualSize.left = doubleIds[1] * visualSize.width
    }
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
