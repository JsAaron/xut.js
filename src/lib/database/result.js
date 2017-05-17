import { config } from '../config/index'
import { $warn, loadFile } from '../util/index'

//替换url
//1. 路径
//2. 基础后缀
const urlRE = /(img\s+src|xlink:href)=\"[\w\/]*gallery\/(\w+)(\.[png|jpg|gif]+)/ig

//替换style中的vw,vh单位尺寸
//width\s*:\s*(\d+[.\d]*)\s*(?=[vw|vh])/gi
//height\s*:\s*(\d+[.\d]*)\s*(?=[vw|vh])/gi
// const sizeRE = /([width|height]+)\s*:\s*(\d+[.\d]*)\s*(?=[vw|vh])/ig

//中文符号
// const symbols = {
//     "，": ",",
//     "。": ".",
//     "：": ":",
//     "；": ";",
//     "！": "!",
//     "？": "?",
//     "（": "(",
//     "）": ")",
//     "【": "[",
//     "】": "]"
// }
// const symbolRE = new RegExp(Object.keys(symbols).join("|"), "ig")


/**
 * 数据库缓存结果集
 */
let result

/*
fileName + brModelType + baseSuffix + type
 */
function parseFileName(fileName, baseSuffix, type) {
  //如果启动了模式
  if (config.launch.brModelType) {
    if (config.launch.brModelType === 'delete') {
      return `${fileName}${baseSuffix}` //增加后缀，去掉类型
    } else {
      return `${fileName}${config.launch.brModelType}${baseSuffix}` //增加brModelType，增加后缀，去掉类型
    }
  }
  //如果只加了baseSuffix模式处理
  return `${fileName}${baseSuffix}${type}`
}

/**
 * json数据过滤
 * 1 flow数据
 * 2 flow样式
 * 3 svgsheet
 */
function filterJsonData() {
  result = window.SQLResult

  /*必须保证数据存在*/
  if (!result) {
    $warn('json数据库加载出错')
    return
  }
  /*快速刷新会出错，加强判断*/
  if (!_.isObject(result)) {
    $warn('json数据库必须是对象')
    return
  }
  if (!result.Setting) {
    $warn('json数据库必须要表')
    return
  }

  //配置了远程地址
  //需要把flow的给处理掉
  if (config.launch.resource && result.FlowData) {

    //启动检测
    if (config.launch.flipMode !== 'vertical') {
      config.launch.columnCheck = true
    }

    //有基础后缀，需要补上所有的图片地址
    const baseSuffix = config.launch.baseImageSuffix ? `.${config.launch.baseImageSuffix}` : ''

    //xlink:href
    //<img src
    //<img src="content/gallery/0920c97a591f525044c8d0d5dbdf12b3.png"
    //<img src="content/310/gallery/0920c97a591f525044c8d0d5dbdf12b3.png"
    //xlink:href="content/310/gallery/696c9e701f5e3fd82510d86e174c46a0.png"
    result.FlowData = result.FlowData.replace(urlRE, function (a, prefix, fileName, type) {
      return `${prefix}="${config.launch.resource}/gallery/${parseFileName(fileName,baseSuffix,type)}`
    })
  }

  window.SQLResult = null;

  return result
}



/**
 * style width,height替换值
 * height:42vw
 * height:42.48vw
 * height : 42.48vw
 * height:  66.99vw
 * height:42.48 vw
 */
// function replaceSize(str, prop) {
//     return str.replace(sizeRE, function(a, key, value) {
//         return `${key}:${value * prop}`
//     })
// }



/**
 * 设置数据缓存
 * 加载配置文件指定路径数据库
 * 加载外部动态js加载的数据库文件
 *
 * 1 去掉全局挂着
 * 2 缓存
 */
export function importJsonDatabase(callback) {
  let path = config.launch.database;
  //如果外联指定路径json数据
  if (path) {
    //防止外部链接影响
    window.SQLResult = null
    loadFile(path, function () {
      callback(filterJsonData())
    })
  }
  //如果外联index.html路径json数据
  else if (window.SQLResult) {
    callback(filterJsonData())
  } else {
    callback()
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
