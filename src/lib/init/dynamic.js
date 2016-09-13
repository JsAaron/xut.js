import { createCursor } from '../util/cursor'
import { initFlows } from '../component/flow/layout'
import { importResults } from '../database/results'

import {
    loader,
    setRootfont
} from '../util/index'

import {
    config,
    resetDataAPI,
    fixProportion,
    fixResourcesPath
} from '../config/index'

import initData from './data'

/**
 * 加载css
 * @return {[type]} [description]
 */
const loadStyle = (callback) => {

    const svgsheet = window.DYNAMICCONFIGT ?
        window.DYNAMICCONFIGT.resource + '/gallery/svgsheet.css' :
        'content/gallery/svgsheet.css'

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
 * 修正尺寸
 * 修正实际分辨率
 * @return {[type]} [description]
 */
const fixedSize = (novelData) => {
    if (novelData) {
        if (novelData.pptWidth || novelData.pptHeight) {
            fixProportion(novelData.pptWidth, novelData.pptHeight);
        }
    }
}


/**
 * 动态代码变动区域
 */
export default function dynamic(callback) {
    //导入数据缓存
    importResults(window.DYNAMICCONFIGT.database, () => {
        //初始化数据库设置
        initData(novelData => {

            //重置数据API接口
            resetDataAPI()

            //跟字体大小
            setRootfont()

            //创建忙碌光标
            if (!Xut.IBooks.Enabled) {
                createCursor()
            }

            //修复地址配置
            fixResourcesPath()

            // ppt尺寸修正
            fixedSize(novelData)

            //flows排版
            //嵌入index
            initFlows();
            //iframe要要Xut.config
            loadStyle(() => callback(novelData))
        })
    })
}
