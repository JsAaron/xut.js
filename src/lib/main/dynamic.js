import { createCursor } from '../util/cursor'
import { initFlows } from '../component/flow/layout'
import { importResults } from '../database/results'

import { loader } from '../util/index'

import {
    config,
    initConfig,
    setProportion,
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
 * 动态代码变动区域
 */
export default function dynamic(callback) {
    //导入数据缓存
    importResults(() => {

        /**
         * 初始配置
         */
        initConfig()

        /**
         * 初始化数据库设置
         */
        initData(novelData => {

            /**
             * 创建忙碌光标
             */
            if (!Xut.IBooks.Enabled) {
                createCursor()
            }

            /**
             * 初始资源地址
             */
            initPathAddress()

            /**
             * ppt尺寸修正
             */
            if (novelData && novelData.pptWidth && novelData.pptHeight) {
                setProportion(novelData.pptWidth, novelData.pptHeight)
            }

            /**
             * 初始flows排版
             * 嵌入index
             */
            initFlows()

            /**
             * iframe要要Xut.config
             */
            loadStyle(() => callback(novelData))
        })
    })
}
