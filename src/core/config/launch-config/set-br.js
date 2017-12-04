import { config } from '../../config/index'

//////////////////////////////////
/// 图片模式webp
/// 需要兼容老版本的png模式，base-config会重设
//////////////////////////////////
export default function setBrType(launch, global) {
  if (launch) {
    if (!launch.brMode && global.brMode) {
      launch.brMode = global.brMode
    }

    /*预先判断出基础类型*/
    if (launch.brMode) {
      launch.brModeType = getBrType(launch.brMode)
    }
  }
}


/**
 * 重写配置文件
 * 由于一些数据库，或者不支持的
 * 在框架内部强制修改用户的设定
 *
 * 如果没有预加载文件
 * 如果启动了图片模式，那么就需要去掉
 */
export function resetBrMode(hasPreFile, globalBrMode) {
  //如果在没有hasPreFile，并且没有hasFlowData，那么就是兼容读库的旧版的处理
  //如果没有hasPreFile，但是有hasFlowData，那么就是迷你杂志，不能去掉
  if (!hasPreFile && !config.launch.hasFlowData) {
    config.launch.brMode = ''
    config.launch.brModel = '被resetBrMode清空了'
    config.launch.brModeType = ''
    return
  }

  //全局指定模式
  //globalBrMode:单模式 1 =>png
  //globalBrMode:混合模式 2 =>_i _a
  if (globalBrMode === 1) {
    /*如果用单模式，但是判断出来是混合模式，那么直接清空*/
    if (config.launch.brModeType) {
      config.launch.brMode = ''
      config.launch.brModeType = ''
    }
  } else if (globalBrMode === 2) {
    /*如果是混合模式，判断出来是单模式，需要重新处理*/
    if (!config.launch.brModeType) {
      config.launch.brModeType = getBrType(1)
    }
  }
}


/**
 * 获取后缀
 * @return {[type]} [description]
 * ios 支持apng '_i'
 * 安卓支持webp  '_a'
 */
function getSuffix() {
  return Xut.plat.supportWebp ? '_a' : '_i'
}


/*预先判断br的基础类型*/
// 1 在线模式 返回增加后缀
// 2 手机模式 不修改，保留后缀
// 3 PC模式，不修改，保留后缀
function getBrType(mode) {

  //自适应平台
  if (mode === 1) {
    if (Xut.plat.isIOS) {
      return getBrType(2)
    }
    if (Xut.plat.isAndroid) {
      return getBrType(3)
    }
  }

  //ios
  if (mode === 2) {
    if (Xut.plat.isBrowser) { //浏览器访问
      return getSuffix()
    } else {
      //app访问
      return ''
    }
  }

  //android
  if (mode === 3) {
    if (Xut.plat.isBrowser) { //浏览器访问
      return getSuffix()
    } else {
      //app访问
      return ''
    }
  }

  /**
   * 纯PC端
   * 自动选择支持的
   * 但是不用APNG了
   */
  if (Xut.plat.isBrowser) {
    //浏览器访问，要探测下是否支持Webp
    if (Xut.plat.supportWebp) {
      return getSuffix()
    }
    //否则用默认的格式
    return ''
  }

  /*默认选择png，理论不会走这里了*/
  return ''
}
