import { config, resetVisualProportion } from '../../config/index'

/**
 * 修复动态的缩放比
 * 1 如果尺寸被重新计算过，那么需要重新获取缩放比
 * 2 否则用默认的
 * @return {[type]} [description]
 */
export function getPageProportion(data) {
  if(data.hasRecalculate) {
    return resetVisualProportion({
      width: data.visualWidth,
      height: data.visualHeight,
      top: data.visualTop,
      left: data.visualLeft
    })
  } else {
    return config.proportion
  }
}
