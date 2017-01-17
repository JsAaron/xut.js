/**
 * 配置文件
 * @return {[type]}         [description]
 */
import nativeConf from './native'
import iframeConf from './iframe'

import {
    getWidgetPath,
    getSourcePath
} from './depend/path'

import {
    getSize,
    getLayerMode
}
from './depend/size'

import getViewSize from '../visuals/size'

import {
    getFullProportion,
    getRealProportion,
    getFlowProportion
} from '../visuals/proportion'

/**
 * 默认配置与模式
 */
import improtConfig from '../global-config'
import improtDefault from './depend/default'

const plat = Xut.plat
const isIphone = Xut.plat.isIphone
const isBrowser = Xut.plat.isBrowser
const GLOBALIFRAME = window.GLOBALIFRAME
const CLIENTCONFIGT = window.CLIENTCONFIGT
const MMXCONFIG = window.MMXCONFIG

let config = Object.create(null)
let layoutMode
let proportion
let fullProportion

/**
 * 层级关系
 * @return {[type]} [description]
 */
Xut.zIndexlevel = () => {
    return ++config.zIndexlevel
}


//通过新学堂加载
//用于处理iframe窗口去全屏
if(/xinxuetang/.test(window.location.href)) {
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
    if(config.launch) {
        return getSourcePath()
    }

    //如果是iframe加载
    //而且是客户端模式
    if(GLOBALIFRAME && CLIENTCONFIGT) {
        return CLIENTCONFIGT.path
    }

    if(typeof initGalleryUrl != 'undefined') {
        return getSourcePath()
    } else {
        //资源存放位置
        // * storageMode 存放的位置
        // * 0 APK应用本身
        // 1 外置SD卡
        if(Number(config.storageMode)) {
            return "sdcard/" + config.appId + "/" + getSourcePath()
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
    if(MMXCONFIG) {
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
        iframeConf.resources(config) :
        nativeConf.resources(config)
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
        iframeConf.video() :
        nativeConf.video()
}


/**
 * 音频路径
 * @return {[type]} [description]
 */
const _audioPath = () => {
    return runMode ?
        desktopPlat() :
        GLOBALIFRAME ?
        iframeConf.audio() :
        nativeConf.audio()
}


/**
 * SVG文件路径
 * @return {[type]} [description]
 */
const _svgPath = () => {
    return isBrowser ?
        desktopPlat() :
        GLOBALIFRAME ?
        iframeConf.svg() :
        nativeConf.svg()
}


/**
 * js零件
 * 2016.8.3 妙妙学新增
 * 只提供相对路径
 * @return {[type]} [description]
 */
const _jsWidgetPath = () => {
    return isBrowser ? getWidgetPath() :
        GLOBALIFRAME ? iframeConf.jsWidget() : nativeConf.jsWidget()
}


/**
 * 全局配置文件
 * @type {Boolean}
 */
_.extend(config, {

    /**
     * 视频文件路径
     * @return {[type]} [description]
     */
    getVideoPath() {
        if(isCacheVideoPath && cacheVideoPath) {
            return cacheVideoPath
        }
        isCacheVideoPath = true
        return cacheVideoPath = _videoPath()
    },

    /**
     * 音频文件路径
     * @return {[type]} [description]
     */
    getAudioPath() {
        if(isCacheAudioPath && cacheAudioPath) {
            return cacheAudioPath
        }
        isCacheAudioPath = true
        return cacheAudioPath = _audioPath()
    },


    /**
     * 配置SVG文件路径
     * @return {[type]} [description]
     */
    getSvgPath() {
        if(isCacheSvgPath && cacheSvgPath) {
            return cacheSvgPath

        }
        isCacheSvgPath = true
        return cacheSvgPath = _svgPath()
    },

    /**
     * 配置js零件文件路径
     * 2016.8.3增加
     * @return {[type]} [description]
     */
    getWidgetPath() {
        if(isCacheJsWidgetPath && cacheJsWidgetPath) {
            return cacheJsWidgetPath
        }
        isCacheJsWidgetPath = true
        return cacheJsWidgetPath = _jsWidgetPath()
    },

    /**
     * 排版模式
     * @type {[type]}
     */
    layoutMode: layoutMode,

    /**
     * 缩放比例
     * @type {[type]}
     */
    proportion: proportion,

    /**
     * 是浏览器
     * @type {Boolean}
     */
    isBrowser: isBrowser,

    /**
     * 全局层级初始值
     * @type {Number}
     */
    zIndexlevel: 1000,

    /**
     * 默认图标高度
     * @type {[type]}
     */
    iconHeight: isIphone ? 32 : 44,

    /**
     * 数据库尺寸
     * @type {Number}
     */
    dbSize: 1

}, improtConfig, improtDefault)


Xut.config = config

export { config }


/**
 * 销毁配置
 */
export function destroyConfig() {
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
    config.pathAddress = _rsourcesPath()
}



/**
 * 重写默认设置
 * 通过数据库中的设置的模板尺寸与实际尺寸修复
 */
const resetProportion = function(pptWidth, pptHeight) {

    //数据ppt排版设计
    if(pptWidth && pptHeight) {
        config.pptHorizontal = pptWidth > pptHeight ? true : false
        config.pptVertical = !config.pptHorizontal
    }

    //获取全屏比值，用来设定view的尺寸
    //根据分辨率与PPT排版的比值来确定
    fullProportion = getFullProportion(config, pptWidth, pptHeight)

    //可视区域尺寸
    let viewSize = config.viewSize = getViewSize(config, fullProportion)

    //溢出宽度
    viewSize.overflowWidth = false
    if(viewSize.left < 0) {
        viewSize.overflowWidth = Math.abs(viewSize.left) * 2
    }

    //溢出高度
    viewSize.overflowHeight = false
    if(viewSize.top < 0) {
        viewSize.overflowHeight = true
    }

    //获取全局缩放比
    proportion = config.proportion = getRealProportion(config, viewSize, fullProportion)
}

/**
 * 动态计算计算可视区View
 * 每个页面可以重写页面的view
 */
export function dynamicView(setVisualMode) {
    return getViewSize(config, fullProportion, setVisualMode)
}

/**
 * 动态计算缩放比
 * 每个页面可以重写页面的元素缩放比
 */
export function dynamicProportion(newViewSize) {
    return getRealProportion(config, newViewSize, fullProportion)
}


/**
 * 默认设置
 * viewSize,screenSize,layoutMode,proportion
 * @return {[type]} [description]
 */
export function initConfig(pptWidth, pptHeight) {

    //获取分辨率
    config.screenSize = getSize()

    //根据设备判断设备的横竖屏
    config.screenHorizontal = config.screenSize.width > config.screenSize.height ? true : false
    config.screenVertical = !config.screenHorizontal

    layoutMode = config.layoutMode = getLayerMode(config.screenSize)

    //设置缩放比
    resetProportion(pptWidth, pptHeight)
}
