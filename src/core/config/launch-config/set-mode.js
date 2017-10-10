import { config } from '../../config/index'
import { getSize } from '../v-screen'

/**
 * 重设视图显示模式
 * @return {[type]} [description]
 */
export function resetVisualMode(data) {

  /**
   * 重设全局的页面模式
   * 默认页面模式选择
   * 1 全局用户接口
   * 2 PPT的数据接口
   * 3 默认1
   */
  if (config.launch.visualMode === undefined) {
    config.launch.visualMode = config.data.visualMode || 1
  }

  /**
   * 模式5 只在竖版下使用
   */
  if (config.launch.visualMode === 5) {
    const screen = getSize()
    if (screen.height < screen.width) {
      config.launch.visualMode = 1
    }
  }
}


/**
 * 动画事件委托
 * @return {[type]} [description]
 */
export function resetDelegate() {
  if (config.launch.swipeDelegate !== false) {
    config.launch.swipeDelegate = true
  }
}


/**
 * 画轴模式
 * @param {[type]} data [description]
 */
export function setPaintingMode(data) {
  if (!config.launch.visualMode && Number(data.scrollPaintingMode)) {
    config.launch.visualMode = 4
  }
}
