import { createCursor } from '../util/cursor'
import initFlows from '../component/flow/layout'
import { importResults } from '../database/results'

import { loader } from '../util/index'

import {
    config,
    initConfig,
    initPathAddress
} from '../config/index'

import initData from './data'

/**
 * 加载css
 * @return {[type]} [description]
 */
const loadStyle = (callback) => {

    const svgsheet = window.DYNAMICCONFIGT ?
        window.DYNAMICCONFIGT.resource + '/gallery/svgsheet.css' :
        config.pathAddress + 'svgsheet.css'

    //加载横版或者竖版css
    //nodeBuildMode 是node build下的test.html文件
    //加载build/*.css压缩文件
    //否则就是默认的css/*.css
    const baseCss = window.nodeBuildMode ? window.nodeBuildMode.csspath : './css/' + (config.layoutMode) + '.css'
    let cssArr = [baseCss, svgsheet]

    //是否需要加载svg
    //如果是ibooks模式
    //并且没有svg
    //兼容安卓2.x
    if (Xut.IBooks.Enabled && !Xut.IBooks.existSvg) {
        cssArr = [baseCss]
    }

    loader.load(cssArr, callback, null, true);
}


/**
 * 新增模式,用于记录浏览器退出记录
 * 默认启动
 * 是否回到退出的页面
 * set表中写一个recordHistory
 * 是   1
 * 否   0
 * [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
const setHistory = (data) => {
    let recordHistory = 1; //默认启动
    if (data.recordHistory !== undefined) {
        recordHistory = Number(data.recordHistory);
    }

    //如果启动桌面调试模式
    //自动打开缓存加载
    if (!recordHistory && config.isBrowser && config.debugMode) {
        recordHistory = 1;
    }

    config.recordHistory = recordHistory
}

const setMode = function(data) {
    //如果没有config配置，默认数据库
    if (!config.visualMode && Number(data.scrollPaintingMode)) {
        config.visualMode = 1
    }
}

/**
 * 动态代码变动区域
 */
export default function dynamic(callback) {
    //导入数据缓存
    importResults(() => {

        //初始化数据库设置
        initData((novelData, tempSettingData) => {

            //初始化配置一些信息
            initConfig(novelData.pptWidth, novelData.pptHeight)

            //新增模式,用于记录浏览器退出记录
            setHistory(tempSettingData)

            //2015.2.26
            //启动画轴模式
            setMode(tempSettingData)

            //创建忙碌光标
            if (!Xut.IBooks.Enabled) {
                createCursor()
            }

            //初始资源地址
            initPathAddress()

            /**
             * 初始flows排版
             * 嵌入index
             */
            initFlows()

            //iframe要要Xut.config
            loadStyle(() => callback(novelData))
        })
    })
}
