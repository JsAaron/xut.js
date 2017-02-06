import { request } from '../util/loader'
import { $$warn } from '../util/debug'
import { insertImageUrlSuffix } from '../util/option'
import { config } from '../config/index'

//替换url
//1. 路径
//2. 基础后缀
const urlRE = /(img\s+src|xlink:href)=\"[\w\/]*gallery\/(\w+)(?=\.[png|jpg]+)/ig

//替换style中的vw,vh单位尺寸
//width\s*:\s*(\d+[.\d]*)\s*(?=[vw|vh])/gi
//height\s*:\s*(\d+[.\d]*)\s*(?=[vw|vh])/gi
const sizeRE = /([width|height]+)\s*:\s*(\d+[.\d]*)\s*(?=[vw|vh])/ig

/**
 * 数据库缓存结果集
 */
let result

/**
 * 动态样式元素合集
 * @type {Array}
 */
let styleElements = []

/**
 * [ description]动态插入一条样式规则
 * @param  {[type]} rule [样式规则]
 * @return {[type]}      [description]
 */
function insertStyle(rule, attribute, value) {
    let styleElement = document.createElement("style")
    styleElement.type = 'text/css'
    styleElement.innerHTML = rule
    styleElement.setAttribute(attribute, value)
    document.head.appendChild(styleElement)
    styleElements.push(styleElement)
}


/**
 * json数据过滤
 * 1 flow数据
 * 2 flow样式
 * 3 svgsheet
 */
function filterJsonData() {
    result = window.SQLResult

    if(!result) {
        $$warn('json数据库加载出错')
        return
    }

    //配置了远程地址
    //需要把flow的给处理掉
    let remoteUrl = config.launch.resource
    if(config.launch && remoteUrl && result.FlowData) {
        //有基础后缀，需要补上所有的图片地址
        let baseSuffix = ''
        if(config.baseImageSuffix) {
            baseSuffix = `.${config.baseImageSuffix}`
        }

        //xlink:href
        //<img src
        //<img src="content/gallery/0920c97a591f525044c8d0d5dbdf12b3.png"
        //<img src="content/310/gallery/0920c97a591f525044c8d0d5dbdf12b3.png"
        //xlink:href="content/310/gallery/696c9e701f5e3fd82510d86e174c46a0.png"
        result.FlowData = result.FlowData.replace(urlRE, function(a, prefix, fileName) {
            return `${prefix}="${remoteUrl}/gallery/${fileName}${baseSuffix}`
        })
    }

    //全局svg样式
    let hasSvgsheet
    if(result.svgsheet) {
        hasSvgsheet = true;
        insertStyle(result.svgsheet, 'data-svg', 'true');
        result.svgsheet = null;
    }

    window.SQLResult = null;

    return hasSvgsheet
}


/**
 * style width,height替换值
 * height:42vw
 * height:42.48vw
 * height : 42.48vw
 * height:  66.99vw
 * height:42.48 vw
 */
function replaceSize(str, prop) {
    return str.replace(sizeRE, function(a, key, value) {
        return `${key}:${value * prop}`
    })
}


/**
 * 插入column的样式
 * 有工具栏
 * 图片的单位是vw，所以因为工具栏的问题
 * 所以相对点发生变化，图片要缩放vm
 */
export function insertColumnStyle(visualWidth, visualHeight) {
    if(result.FlowStyle) {
        //是否有比值换算
        let screen = window.screen
        let screenWidth = screen.width
        let screenHeight = screen.height

        let prop = 0

        //宽度与高度都被缩了
        if(screenWidth != visualWidth && screenHeight != visualHeight) {
            prop = Math.min(visualWidth / screenWidth, visualHeight / screenHeight)
        }
        //宽度缩了
        else if(screenWidth != visualWidth) {
            prop = visualWidth / screenWidth
        }
        //高度缩了
        else if(screenHeight != visualHeight) {
            prop = visualHeight / screenHeight
        }
        if(prop) {
            result.FlowStyle = replaceSize(result.FlowStyle, prop)
        }

        //动态加载
        insertStyle(result.FlowStyle, 'data-flow', 'true');
        result.FlowStyle = null;
    }
}



/**
 * 设置数据缓存
 * 加载配置文件指定路径数据库
 * 加载外部动态js加载的数据库文件
 *
 * 1 去掉全局挂着
 * 2 缓存
 */
export function importJsonDatabase(callback) {

    //如果外联指定路径json数据
    let path = config.launch && config.launch.database;
    if(path) {
        //防止外部链接影响
        window.SQLResult = null
        request(path, function() {
            callback(filterJsonData())
        })
    }
    //如果外联index.html路径json数据
    else if(window.SQLResult) {
        callback(filterJsonData())
    } else {
        callback()
    }
}


/**
 * 移除动态加载的样式
 * @return {[type]} [description]
 */
export function removeStyle() {
    if(styleElements.length) {
        for(let i = 0; i < styleElements.length; i++) {
            if(styleElements[i]) {
                document.head.removeChild(styleElements[i])
            }
            styleElements[i] = null
        }
        styleElements = []
    }
}

/**
 * 删除挂载的flow数据
 * @return {[type]} [description]
 */
export function removeColumnData() {
    result['FlowData'] = null
}

/**
 * 获取数据缓存
 * @return {[type]} [description]
 */
export function getResults() {
    return result
}


/**
 * 移除缓存数据
 * @return {[type]} [description]
 */
export function removeResults() {
    result = null
}
