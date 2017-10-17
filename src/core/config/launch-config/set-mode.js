import { config } from '../../config/index'
import { getSize } from '../v-screen'

/**
 * 重设视图显示模式
 * @return {[type]} [description]
 */
export function setVisualMode() {

  //竖版的情况下，页面模式都强制为1
  if (config.launch.scrollMode === 'v') {
    config.launch.visualMode = 1
    return
  }

  //如果数据库定义了模式
  //那么优先数据库
  if (config.data.visualMode !== undefined) {
    config.launch.visualMode = config.data.visualMode
  }

  //默认为1
  if (config.launch.visualMode === undefined) {
    config.launch.visualMode = 1
  }

  //模式5 只在竖版下使用
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
