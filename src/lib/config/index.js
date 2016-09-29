/**
 * 配置文件
 * @return {[type]}         [description]
 */
import nativeConf from './native'
import iframeConf from './iframe'

import {
    getWidgetPath,
    getSourcePath
} from './default'

import {
    getSize,
    getLayerMode
}
from './get'

import getViewSize from '../visuals/view.config'
import {
    getFullProportion,
    getRealProportion
} from '../visuals/proportion.config'

import improtMode from './mode.type'
import improtData from './data.type'

const plat = Xut.plat
const isIphone = Xut.plat.isIphone
const isBrowser = Xut.plat.isBrowser
const GLOBALIFRAME = window.GLOBALIFRAME
const CLIENTCONFIGT = window.CLIENTCONFIGT
const MMXCONFIG = window.MMXCONFIG

let config = Object.create(null)
let layoutMode
let proportion


/**
 * 层级关系
 * @return {[type]} [description]
 */
Xut.zIndexlevel = () => {
    return ++config.zIndexlevel
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
 * 为了支持window.DYNAMICCONFIGT模式
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
    if (window.DYNAMICCONFIGT) {
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
        if (Number(config.storageMode)) {
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
 * 打印信息
 * @param  {[type]} info [description]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
Xut.log = function(info, name) {
    if (!config.debugMode) return;
    switch (info) {
        case 'error':
            console.error && console.error(name);
            break;
        case 'debug':
            console.debug && console.debug(name);
            break;
        default:
            console.log(info)
            break;
    }
}


/**
 * 全局配置文件
 * [debugMode description]
 * @type {Boolean}
 */
_.extend(config, {

    /**
     * 视频文件路径
     * @return {[type]} [description]
     */
    videoPath() {
        if (isCacheVideoPath && cacheVideoPath) {
            return cacheVideoPath
        }
        isCacheVideoPath = true
        return cacheVideoPath = _videoPath()
    },

    /**
     * 音频文件路径
     * @return {[type]} [description]
     */
    audioPath() {
        if (isCacheAudioPath && cacheAudioPath) {
            return cacheAudioPath
        }
        isCacheAudioPath = true
        return cacheAudioPath = _audioPath()
    },


    /**
     * 配置SVG文件路径
     * @return {[type]} [description]
     */
    svgPath() {
        if (isCacheSvgPath && cacheSvgPath) {
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
    jsWidgetPath() {
        if (isCacheJsWidgetPath && cacheJsWidgetPath) {
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

}, improtMode, improtData)


Xut.config = config

export { config }


/**
 * 初始化资源路径
 * 配置图片路径地址
 * @return {[type]} [description]
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
 * @type {[type]}
 */
const setProportion = function(pptWidth, pptHeight) {

    //数据ppt排版设计
    if (pptWidth && pptHeight) {
        config.pptHorizontal = pptWidth > pptHeight ? true : false
        config.pptVertical = !config.pptHorizontal
    }

    /**
     * 获取全屏比值，用来设定view的尺寸
     * @type {[type]}
     */
    const fullProportion = getFullProportion(config, pptWidth, pptHeight)

    /**
     * 可视区域尺寸
     * @type {Object}
     */
    const viewSize = config.viewSize = getViewSize(config, fullProportion)

    /**
     * 获取全局缩放比
     * @type {[type]}
     */
    proportion = config.proportion = getRealProportion(config, viewSize, fullProportion)

}


/**
 * 默认设置
 * viewSize,screenSize,layoutMode,proportion
 * @return {[type]} [description]
 */
export function initConfig(pptWidth, pptHeight) {
    /**
     * 获取分辨率
     * @type {[type]}
     */
    config.screenSize = getSize()

    /**
     * 根据设备判断设备的横竖屏
     * @type {[type]}
     */
    config.screenHorizontal = config.screenSize.width > config.screenSize.height ? true : false
    config.screenVertical = !config.screenHorizontal


    layoutMode = config.layoutMode = getLayerMode(config.screenSize)

    /**
     * 设置缩放比
     */
    setProportion(pptWidth, pptHeight)
}
