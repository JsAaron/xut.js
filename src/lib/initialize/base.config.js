import { createCursor } from './busy.cursor'
import { contentFilter } from '../component/activity/content/filter'
import { importJsonDatabase } from '../database/result'

import { loader } from '../util/index'

import {
    config,
    initConfig,
    initPathAddress
} from '../config/index'

import initTooBar from './toolbar.data'
import initFlows from '../component/flow/layout'

/**
 * 加载svg的css
 * @return {[type]} [description]
 */
const loadStyle = (callback) => {
    let svgsheet = config.launch ?
        config.launch.resource + '/gallery/svgsheet.css' :
        config.pathAddress + 'svgsheet.css'
    loader.load([svgsheet], callback, null, true);
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
    let historyMode = 1; //默认启动
    if (data.recordHistory !== undefined) {
        historyMode = Number(data.recordHistory);
    }

    //如果启动桌面调试模式
    //自动打开缓存加载
    if (!historyMode && config.isBrowser) {
        historyMode = 1;
    }

    config.historyMode = historyMode
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
export default function baseConfig(callback) {

    //导入JSON数据缓存
    importJsonDatabase((hasSvgsheet) => {

        //初始化工具栏
        //与数据库setting数据
        initTooBar((novelData, tempSettingData) => {

            //创建过滤器
            Xut.CreateFilter = contentFilter('createFilter');
            Xut.TransformFilter = contentFilter('transformFilter');

            //初始化配置一些信息
            initConfig(novelData.pptWidth, novelData.pptHeight)

            //新增模式,用于记录浏览器退出记录
            //如果强制配置文件recordHistory = false则跳过数据库的给值
            if (config.historyMode !== false) {
                setHistory(tempSettingData)
            }

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
             * 默认有flow并且没有强制设置关闭的情况，打开缩放
             */
            initFlows(function(hasFlowCounts) {
                if (hasFlowCounts) {
                    //动画事件委托
                    if (config.swipeDelegate !== false) {
                        config.swipeDelegate = true
                    }
                }
                //iframe要要Xut.config
                //如果存在了Svgsheet就不需要动态加载了
                if (hasSvgsheet) {
                    callback(novelData)
                } else {
                    loadStyle(() => callback(novelData))
                }

            })


        })
    })
}
