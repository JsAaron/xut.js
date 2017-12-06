/**
 * 配置文件
 * @return {[type]}         [description]
 */
import nativeConfig from './path-config/native'
import iframeConfig from './path-config/iframe'
import { getWidgetPath, getSourcePath } from './path-config/browser'

import { getVisualSize } from './view-config/visual'
import { getSize, getLayerMode } from './view-config/screen'
import { getFullProportion, getRealProportion } from './view-config/proportion'

/*
导入
1 全局配置
2 内部配置
3 依赖数据
 */
import {
  improtGlobalConfig,
  improtDebugConfig,
  improtDataConfig
} from '../api/config-api/index'

const plat = Xut.plat
const isBrowser = Xut.plat.isBrowser
const GLOBALIFRAME = window.GLOBALIFRAME
const CLIENTCONFIGT = window.CLIENTCONFIGT
const MMXCONFIG = window.MMXCONFIG

let config = {}

let layoutMode
let proportion
let fullProportion

/*层级关系*/
let _zIndex = 1000
Xut.zIndexlevel = () => {
  return ++_zIndex
}

//通过新学堂加载
//用于处理iframe窗口去全屏
if (/xinxuetang/.test(window.location.href)) {
  config.iframeFullScreen = true;
}

/**
 * 是否启动缓存机制
 * 第一次默认是关闭
 * 必须读取一次后，缓存启动
 * 为了支持Xut.config.launch模式
 * @type {Boolean}
 */
let isCacheVideoPath = false
let isCacheAudioPath = false
let isCacheSvgPath = false
let isCacheJsWidgetPath = false

let cacheVideoPath
let cacheAudioPath
let cacheSvgPath
let cacheJsWidgetPath


/**
 * pc端模式
 * 而且是客户端模式
 * @return {[type]} [description]
 */
const desktopPlat = () => {

  //2016.9.13
  //新增动态模式
  if (config.launch.resource) {
    return getSourcePath()
  }

  //如果是iframe加载
  //而且是客户端模式
  if (GLOBALIFRAME && CLIENTCONFIGT) {
    return CLIENTCONFIGT.path
  }

  if (typeof initGalleryUrl != 'undefined') {
    return getSourcePath()
  } else {
    //资源存放位置
    // * storageMode 存放的位置
    // * 0 APK应用本身
    // 1 外置SD卡
    if (Number(config.launch.storageMode)) {
      return "sdcard/" + config.data.appId + "/" + getSourcePath()
    } else {
      return getSourcePath()
    }
  }
}


/**
 * 平台加载用于
 * 视频.音频妙妙学处理
 * 1 桌面
 * 2 移动端
 * 3 安卓打包后通过网页访问=>妙妙学
 * @return {[type]} [description]
 */
const runMode = (() => {
  if (MMXCONFIG) {
    return false
  }
  return isBrowser
})()


/**
 * 图片资源配置路径
 * [resourcesPath description]
 * @return {[type]} [description]
 */
const _rsourcesPath = () => {
  return isBrowser ?
    desktopPlat() :
    GLOBALIFRAME ?
    iframeConfig.resources(config) :
    nativeConfig.resources(config)
}



/**
 * mp3 mp4 音频文件路径
 * 1 音频加载就会自动拷贝到SD卡上
 * 2 或者asset上的资源
 * @return {[type]} [description]
 */
const _videoPath = () => {
  return runMode ?
    desktopPlat() :
    GLOBALIFRAME ?
    iframeConfig.video() :
    nativeConfig.video()
}


/**
 * 音频路径
 * @return {[type]} [description]
 */
const _audioPath = () => {
  return runMode ?
    desktopPlat() :
    GLOBALIFRAME ?
    iframeConfig.audio() :
    nativeConfig.audio()
}


/**
 * SVG文件路径
 * @return {[type]} [description]
 */
const _svgPath = () => {
  return isBrowser ?
    desktopPlat() :
    GLOBALIFRAME ?
    iframeConfig.svg() :
    nativeConfig.svg()
}


/**
 * js零件
 * 2016.8.3 妙妙学新增
 * 只提供相对路径
 * @return {[type]} [description]
 */
const _jsWidgetPath = () => {
  return isBrowser ? getWidgetPath() :
    GLOBALIFRAME ? iframeConfig.jsWidget() : nativeConfig.jsWidget()
}


/**
 * 全局配置文件
 * @type {Boolean}
 */
_.extend(config, {

  /**
   * 应用横竖自适应切换
   * 默认在浏览器端打开
   * 这里可以定义打开关闭
   * 打开：1
   * 默认：0
   * [orientate description]
   * @type {[type]}
   */
  orientateMode: Xut.plat.isBrowser ? true : false,

  /**
   * 视频文件路径
   */
  getVideoPath() {
    if (isCacheVideoPath && cacheVideoPath) {
      return cacheVideoPath
    }
    isCacheVideoPath = true
    return cacheVideoPath = _videoPath()
  },

  /**
   * 音频文件路径
   */
  getAudioPath() {
    if (isCacheAudioPath && cacheAudioPath) {
      return cacheAudioPath
    }
    isCacheAudioPath = true
    return cacheAudioPath = _audioPath()
  },

  /**
   * 配置SVG文件路径
   */
  getSvgPath() {
    if (isCacheSvgPath && cacheSvgPath) {
      return cacheSvgPath

    }
    isCacheSvgPath = true
    return cacheSvgPath = _svgPath()
  },

  /**
   * 配置js零件文件路径
   * 2016.8.3增加
   */
  getWidgetPath() {
    if (isCacheJsWidgetPath && cacheJsWidgetPath) {
      return cacheJsWidgetPath
    }
    isCacheJsWidgetPath = true
    return cacheJsWidgetPath = _jsWidgetPath()
  },

  /**
   * 2016.7.26
   * 读酷增加强制插件模式
   */
  isPlugin: window.DUKUCONFIG && Xut.plat.isIOS,
  /*排版模式*/
  layoutMode: layoutMode,
  /*缩放比例*/
  proportion: proportion,
  /*全局数据配置*/
  data: improtDataConfig,
  /*全局debug配置*/
  debug: improtDebugConfig,
  /*默认全局配置*/
  global: improtGlobalConfig,
  /*默认的提供postMessage的方式配置*/
  postMessage:{}
})

Xut.config = config


export { config }


/**
 * 销毁配置
 */
export function clearConfig() {
  cacheVideoPath = null
  cacheAudioPath = null
  cacheSvgPath = null
  cacheJsWidgetPath = null
}

/**
 * 初始化资源路径
 * 配置图片路径地址
 */
export function initPathAddress() {
  //设置资源缓存关闭
  isCacheVideoPath = false
  isCacheAudioPath = false
  isCacheSvgPath = false
  isCacheJsWidgetPath = false

  /*资源路径*/
  config.data.pathAddress = _rsourcesPath()

  /*根路径*/
  config.data.rootPath = config.data.pathAddress.replace('/gallery/', '')
}

/**
 * 默认设置
 * 通过数据库中的设置的模板尺寸与实际尺寸修复
 */
function resetProportion(pptWidth, pptHeight, setVisualMode, noModifyValue) {
  //获取全屏比值，用来设定view的尺寸
  //根据分辨率与PPT排版的比值来确定
  fullProportion = getFullProportion(config, pptWidth, pptHeight)

  const visualSize = config.visualSize = getVisualSize(config, fullProportion, setVisualMode, noModifyValue)

  //溢出宽度
  visualSize.overflowWidth = false
  if (visualSize.left < 0) {
    visualSize.overflowWidth = Math.abs(visualSize.left) * 2
  }
  //溢出高度
  visualSize.overflowHeight = false
  if (visualSize.top < 0) {
    visualSize.overflowHeight = true
  }
  //获取全局缩放比
  proportion = config.proportion = getRealProportion(config, visualSize, fullProportion)
}

/**
 * 获取基本尺寸
 * @param  {[type]} pptWidth   [description]
 * @param  {[type]} pptHeight  [description]
 * @param  {[type]} screenSize [description]
 * @return {[type]}            [description]
 */
function getBasicSize(pptWidth, pptHeight, screenSize) {
  //获取分辨率
  config.screenSize = screenSize || getSize();
  //根据设备判断设备的横竖屏
  config.screenHorizontal = config.screenSize.width > config.screenSize.height ? true : false
  config.screenVertical = !config.screenHorizontal
  layoutMode = config.layoutMode = getLayerMode(config.screenSize);
  //数据ppt排版设计
  if (pptWidth && pptHeight) {
    config.pptHorizontal = pptWidth > pptHeight ? true : false
    config.pptVertical = !config.pptHorizontal
  }
}

/**
 * 重新设置config
 * @param  {[type]} pptWidth      [description]
 * @param  {[type]} pptHeight     [description]
 * @param  {[type]} screenSize    [description]
 * @param  {[type]} setVisualMode [description]
 * @param  {[type]} noModifyValue [description]
 * @return {[type]}               [description]
 */
function resetConfig(pptWidth, pptHeight, screenSize, setVisualMode, noModifyValue) {
  getBasicSize(pptWidth, pptHeight, screenSize)
  resetProportion(pptWidth, pptHeight, setVisualMode, noModifyValue)
}


/****************************************
 *  反向模式探测(PPT设置与显示相反,例如竖版PPT=>横版显示)
 *  为了在originalVisualSize中重置容器的布局
 *  让容器的布局是反向模式的等比缩放的尺寸
 *  这样算法可以保持兼容正向一致
 * ***************************************/
export function initConfig(pptWidth, pptHeight) {

  //第一次探测实际的PPT与屏幕尺寸
  getBasicSize(pptWidth, pptHeight)


  ////////////////////////////////////
  /// 横版PPT，竖版显示，强制为竖版双页面
  ////////////////////////////////////
  if (config.launch.visualMode === 5) {
    resetProportion(pptWidth, pptHeight, config.launch.visualMode)
    config.originalVisualSize = config.visualSize
    return
  }


  ////////////////////////////////////
  /// 竖版PPT，横版显示，并启动了双页模式
  ////////////////////////////////////
  if (config.launch.doublePageMode && config.pptVertical && config.screenHorizontal) {
    resetProportion(pptWidth, pptHeight, config.launch.visualMode === 3 ? 2 : config.launch.visualMode)
    config.originalVisualSize = config.visualSize
    return
  }


  //////////////////////////////////////////////////////////
  /// 反向设置的情况下
  /// 要计算出实际的显示范围与偏移量 visualSize的数据 d
  /// 比如竖版PPT=》
  ///   screenSize => height : 414 width : 736
  ///   visualSize => height : 414 width : 311 left : 213
  /// 屏幕尺寸与显示范围是不一样的，按照竖版的比例，等比缩小了
  //////////////////////////////////////////////////////////

  if (config.pptHorizontal && config.screenHorizontal && config.launch.visualMode === 3) {
    //如果是横版PPT，横版显示的情况下，并且是全局模式3的情况
    //可能存在宽度，不能铺满全屏的情况
    //所以可能存在要修改尺寸
    //可能会修改全局布局尺寸，所以采用3模式探测
    resetProportion(pptWidth, pptHeight, config.launch.visualMode, true)
  } else {
    //强制检测是否是反向显示模式
    //如果是模式3的情况下，用2检测
    resetProportion(pptWidth, pptHeight, config.launch.visualMode === 3 ? 2 : config.launch.visualMode)
  }

  //如果是PPT与设备反向显示
  //这里可能会溢出left的值
  //那么把每个visual就当做一个整体处理
  // config.originalScreenSize = config.screenSize
  config.originalVisualSize = config.visualSize

  //竖版PPT,横版显示
  if (config.pptVertical && config.screenHorizontal) {
    config.verticalToHorizontalVisual = true
  }

  //横版PPT,竖版显示
  if (config.pptHorizontal && config.screenVertical) {
    config.horizontalToVerticalVisual = true
  }

  /*******************************
   *   受反向检测影响了，需要修正config
   * ******************************/
  if (config.launch.visualMode === 2) {
    //如果是反向模式
    //强制设置visualSize=screenSize
    //从新计算config依赖比值
    if (config.visualSize.left) {
      resetConfig(pptWidth, pptHeight, {
        width: config.visualSize.width,
        height: config.visualSize.height
      }, config.launch.visualMode)
    }
  } else if (config.launch.visualMode === 3) {
    //反模式下，重置高度
    //已经尺寸因为探测已经被改过一次了
    //实际使用的时候，需要还原
    if (config.visualSize.left) {
      resetConfig(pptWidth, pptHeight, {
        width: config.visualSize.width,
        height: config.visualSize.height
      }, 1)
    } else {
      //重新把3模式下按照正常1的情况设置
      //2不行，因为高度不对，只有1与3接近
      resetConfig(pptWidth, pptHeight, '', 1)
    }
  }

}

/**
 * 动态计算计算可视区View
 * 每个页面可以重写页面的view
 */
export function resetVisualLayout(setVisualMode) {
  return getVisualSize(config, fullProportion, setVisualMode)
}

/**
 * 动态计算缩放比
 * 每个页面可以重写页面的元素缩放比
 */
export function resetVisualProportion(newVisualSize) {
  return getRealProportion(config, newVisualSize, fullProportion)
}
