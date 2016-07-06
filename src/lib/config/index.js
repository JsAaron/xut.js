/**
 * 配置文件
 * @param  {[type]} require [description]
 * @param  {[type]} exports [description]
 * @param  {[type]} module  [description]
 * @return {[type]}         [description]
 */
import nativeConf from './native'
import iframeConf from './iframe'
import common from './common'

import {
    _screen,
    _layer,
    _scale,
    _fixProportion
}
from './judge'


let config = {}
let layoutMode
let screenSize
let proportion
let isIphone = Xut.plat.isIphone
let isBrowser = Xut.plat.isBrowser
let sourceUrl = common.sourceUrl


/**
 * 层级关系
 * @return {[type]} [description]
 */
Xut.zIndexlevel = () => {
    return ++config.zIndexlevel
}

/**
 * 修正API接口
 * @return {[type]} [description]
 */
let fiexdAPI = () => {
    screenSize = config.screenSize = _screen()
    layoutMode = config.layoutMode = _layer(screenSize)
    proportion = config.proportion = _scale(config)
}


//通过新学堂加载
//用于处理iframe窗口去全屏
if (/xinxuetang/.test(window.location.href)) {
    config.iframeFullScreen = true;
}


/**
 * 缓存
 */
let cacheVideoPath
let cacheAudioPath
let cacheSvgPath


/**
 * pc端模式
 * 而且是客户端模式
 * @return {[type]} [description]
 */
let pcMode = () => {
    //如果是iframe加载
    //而且是客户端模式
    if (window.GLOBALIFRAME && window.CLIENTCONFIGT) {
        return window.CLIENTCONFIGT.path;
    }

    if (typeof initGalleryUrl != 'undefined') {
        return sourceUrl;
    } else {
        //资源存放位置
        // * storageMode 存放的位置
        // * 0 APK应用本身
        // 1 外置SD卡
        if (Number(config.storageMode)) {
            return "sdcard/" + config.appId + "/" + sourceUrl;
        } else {
            return sourceUrl;
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
let runLoad = () => {
    if (window.MMXCONFIG) {
        return false
    }
    return isBrowser;
}


/**
 * 图片资源配置路径
 * [resourcesPath description]
 * @return {[type]} [description]
 */
let confResources = () => {
    //移动端模式
    let mobileMode = () => {
        return window.GLOBALIFRAME ? iframeConf.resources() : nativeConf.resources()
    }
    return isBrowser ? pcMode() : mobileMode()
}


/**
 * mp3 mp4 音频文件路径
 * 1 音频加载就会自动拷贝到SD卡上
 * 2 或者asset上的资源
 * @return {[type]} [description]
 */
let _videoPath = () => {
    if (cacheVideoPath) {
        return cacheVideoPath;
    }
    //移动
    let mobilePath = () => {
        return window.GLOBALIFRAME ? iframeConf.video() : nativeConf.video();
    }
    return cacheVideoPath = runLoad() ? pcMode() : mobilePath();
}


/**
 * 音频路径
 * @return {[type]} [description]
 */
let _audioPath = () => {
    if (cacheAudioPath) {
        return cacheAudioPath;
    }
    //移动端
    let mobileMode = () => {
        return window.GLOBALIFRAME ? iframeConf.audio() : nativeConf.audio();
    }
    return cacheAudioPath = runLoad() ? pcMode() : mobileMode();
};


/**
 * SVG文件路径
 * @return {[type]} [description]
 */
let _svgPath = () => {
    if (cacheSvgPath) {
        return cacheSvgPath;
    }
    let mobileMode = () => {
        return window.GLOBALIFRAME ? iframeConf.svg() : nativeConf.svg();
    }
    return cacheSvgPath = isBrowser ? pcMode() : mobileMode();
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
     * 调试模式
     * 如果启动桌面调试模式,自动打开缓存加载,就是每次都打开都回到最后看到的一页
     * [debugMode description]
     * @type {Boolean}
     */
    debugMode: false,

    //直接通过数据库的历史记录定位到指定的页面
    // Xut.View.LoadScenario({
    //     'scenarioId' : scenarioInfo[0],
    //     'chapterId'  : scenarioInfo[1],
    //     'pageIndex'  : scenarioInfo[2]
    // })
    // {
    //     'scenarioId' : 7,
    //     'chapterId'  : 9
    // }
    //
    //
    deBugHistory: false,

    /**
     * 支持电子在在线阅读,向服务端取数据
     * 自定义配置地址即可'
     * @type {String}
     */
    onlineModeUrl: 'lib/data/database.php',

    /**
     * 数据库名
     * @type {[type]}
     */
    dbName: window.xxtmagzinedbname || 'magazine',

    /**
     * 全局翻页模式
     * 0 滑动翻页
     * 1 直接换
     * [pageFlip description]
     * @type {Number}
     */
    pageFlip: 0,

    /**
     * 存储模式
     * 0 APK应用本身
     * 1 外置SD卡
     */
    storageMode: 0,

    /**
     * 虚拟模式
     * 采用word排版，如果是横屏的布局放到竖版的手机上
     * 就需要分割排版布局
     * @type {Boolean}
     */
    virtualMode: false,

    /**
     * 画轴模式
     * 在不同分辨率下，按照正比缩放拼接
     * 在一个可视区中，可以看到3个li拼接后的效果
     * [scrollPaintingMode description]
     * @type {Boolean}
     */
    scrollPaintingMode: false,

    /**
     * 独立canvas模式处理
     * 为了测试方便
     * 可以直接切换到dom模式
     * @type {Boolean}
     */
    onlyDomMode: false,

    /**
     *canvas的处理模式
     *合并模式：merge
     *单个模式：single
     */
    canvasProcessMode: 'merge',

    /**
     * 应用路径唯一标示
     * @type {[type]}
     */
    appId: null,


    /**
     * 资源路径
     * @type {[type]}
     */
    pathAddress: null,


    /**
     * 初始化资源路径
     * 配置图片路径地址
     * @return {[type]} [description]
     */
    initResourcesPath() {
        config.pathAddress = confResources()
    },

    /**
     * 视频文件路径
     * @return {[type]} [description]
     */
    videoPath() {
        return _videoPath()
    },

    /**
     * 音频文件路径
     * @return {[type]} [description]
     */
    audioPath() {
        return _audioPath()
    },

    /**
     * 配置SVG文件路径
     * @return {[type]} [description]
     */
    svgPath() {
        return _svgPath()
    },

    /**
     * 设备尺寸
     * @type {[type]}
     */
    screenSize: screenSize,

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
     * 修正
     * @type {[type]}
     */
    revised: fiexdAPI,

    /**
     * 修正缩放比
     * 通过数据库中的设置的模板尺寸与实际尺寸修复
     * @type {[type]}
     */
    fixProportion(pptWidth, pptHeight) {
        _fixProportion(config, pptWidth, pptHeight)
    },

    /**
     * 数据库尺寸
     * @type {Number}
     */
    dbSize: 1
});


Xut.config = config

export { config }
