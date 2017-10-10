////////////////////////////////
///
/// 全局config与 launch配置优先级
/// lauch可以覆盖全局config配置
///
////////////////////////////////

import { config } from '../index'
import setTrack from './set-track'
import setCursor from './set-cursor'
import setHistory from './set-history'
import setGestureSwipe from './set-gesture'
import setBrType, { resetBrMode } from './set-br'

//导出其余模式
export * from './set-mode'
export { setGestureSwipe, resetBrMode, setHistory }

/*
  获取真实的配置文件 priority
  优先级： launch > config
  1 cursor
  2 trackCode
  3 brMode
 */
export function priorityConfig() {

  /*独立app与全局配置文件*/
  const launch = config.launch
  const golbal = config.golbal

  //////////////////////////////////
  /// brModel命名被修改该了
  /// 这个为了兼容老版本采用了brModel的配置
  //////////////////////////////////
  if (launch.brModel && !launch.brMode) {
    launch.brMode = launch.brModel
  }
  if (golbal.brModel && !golbal.brMode) {
    golbal.brMode = golbal.brModel
  }

  //debug模式
  for (let key in golbal.debug) {
    if (golbal.debug[key] !== undefined) {
      config.debug[key] = golbal.debug[key]
    }
  }

  //忙碌光标
  setCursor(launch, golbal)

  //如果启动了代码追踪，配置基本信息
  setTrack(launch, golbal)

  //设置图片模式webp
  setBrType(launch, golbal)

  //golbal混入到launch中
  for (let key in golbal) {
    if (launch[key] === undefined) {
      launch[key] = golbal[key]
    }
  }

  //竖版的情况下，页面模式都强制为1
  if (launch.scrollMode === 'v') {
    launch.visualMode = 1
  }

  //如果不是浏览器模式
  //强制关闭预加载模式
  if (!Xut.plat.isBrowser) {
    config.launch.preload = null
  }

}
