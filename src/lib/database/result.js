import { request } from '../util/loader'
import { $$warn } from '../util/debug'
import { config } from '../config/index'

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
 * flow数据过滤
 * 1 flow数据
 * 2 flow样式
 * 3 svgsheet
 */
function flowJsonFilter() {
    result = window.SQLResult

    if (!result) {
        $$warn('json数据库加载出错')
        return
    }

    //配置了远程地址
    //需要把flow的给处理掉
    if (config.launch && config.launch.resource && result.FlowData) {
        //<img src="content/310/gallery/0920c97a591f525044c8d0d5dbdf12b3.png"
        //xlink:href="content/310/gallery/696c9e701f5e3fd82510d86e174c46a0.png"
        let remoteUrl = config.launch.resource;
        //有基础后缀，需要替换所有的图片地址
        if(config.baseImageSuffix){
            result.FlowData = result.FlowData.replace(/gallery\/[\w]+\./ig, '$&'+ config.baseImageSuffix +'.');
        }
        result.FlowData = result.FlowData.replace(/<img\s*src=\"[\w\/]+gallery/ig, '<img src=\"' + remoteUrl + '/gallery');
        result.FlowData = result.FlowData.replace(/xlink:href=\"[\w\/]+gallery/ig, 'xlink:href=\"' + remoteUrl + '/gallery');
    }

    //全局svg样式
    let hasSvgsheet
    if (result.svgsheet) {
        hasSvgsheet = true;
        insertStyle(result.svgsheet, 'data-svg', 'true');
        result.svgsheet = null;
    }

    //全局flow样式
    if (result.FlowStyle) {
        insertStyle(result.FlowStyle, 'data-flow', 'true');
        result.FlowStyle = null;
    }

    window.SQLResult = null;

    return hasSvgsheet
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
    if (path) {
        //防止外部链接影响
        window.SQLResult = null
        request(path, function() {
            callback(flowJsonFilter())
        })
    }
    //如果外联index.html路径json数据
    else if (window.SQLResult) {
        callback(flowJsonFilter())
    } else {
        callback()
    }
}


/**
 * 移除动态加载的样式
 * @return {[type]} [description]
 */
export function removeStyle() {
    if (styleElements.length) {
        for (let i = 0; i < styleElements.length; i++) {
            if (styleElements[i]) {
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
export function removeFlowData() {
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
