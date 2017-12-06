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
import { setVisualMode } from './set-mode'


//导出其余模式
export * from './set-mode'
export { resetBrMode, setHistory }

/*
  获取真实的配置文件 priority
  优先级： launch > config
  1 cursor
  2 trackCode
  3 brMode
 */
export function setLaunch(novelData) {

  /*独立app与全局配置文件*/
  const launch = config.launch
  const global = config.global
  const postMessage = config.postMessage

  /*通过postMessage的配置重写全局配置文件*/
  for (let key in postMessage) {
    global[key] = postMessage[key]
  }

  //////////////////////////////////
  /// brModel命名被修改该了
  /// 这个为了兼容老版本采用了brModel的配置
  //////////////////////////////////
  if (launch.brModel && !launch.brMode) {
    launch.brMode = launch.brModel
  }
  if (global.brModel && !global.brMode) {
    global.brMode = global.brModel
  }

  //debug模式
  for (let key in global.debug) {
    if (global.debug[key] !== undefined) {
      config.debug[key] = global.debug[key]
    }
  }

  //忙碌光标
  setCursor(launch, global)

  //如果启动了代码追踪，配置基本信息
  setTrack(launch, global)

  //设置图片模式webp
  setBrType(launch, global)

  //global混入到launch中
  //优先级数据库>launch>postMessage>global
  for (let key in global) {
    if (launch[key] === undefined) {
      launch[key] = global[key]
    }
  }


  //如果不是浏览器模式
  //强制关闭预加载模式
  if (!Xut.plat.isBrowser) {
    config.launch.preload = null
  }

  //配置VisualMode
  setVisualMode()

  //配置手势
  setGestureSwipe(novelData)

}
