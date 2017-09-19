import { loadFile } from './loader/file'
import { $warn } from './debug/index'
import { parseJSON } from './lang'
import { config, resetVisualProportion } from '../config/index'

const CEIL = Math.ceil
const FLOOR = Math.floor
const slashRE = /\/$/

/**
 * 去掉后缀的斜杠
 * @return {[type]} [description]
 */
export function removeSlash(resource) {
  if (resource && slashRE.test(resource)) {
    return resource.substring(0, resource.length - 1)
  }
  return resource
}

/**
 * 动态加载link
 * @return {[type]} [description]
 */
export function loadGolbalStyle(fileName, callback) {

  const path = config.launch.resource ?
    config.launch.resource + '/gallery/' + fileName + '.css' :
    config.data.pathAddress + fileName + '.css'

  const node = loadFile(path, callback)
  node && node.setAttribute('data-type', fileName)
}

/**
 * 设置快速的文件解释正则
 * 每个图片在点击的时候，需要解析文件的一些参数
 * 这里正则只做一次匹配
 */
let brModeRE = null
export function setFastAnalysisRE() {
  brModeRE = null
  //如果存在brModeType
  if (config.launch.brModeType && config.launch.brModeType !== 'delete') {
    //(\w+[_a|_i]?)([.hi|.mi]*)$/i
    brModeRE = new RegExp(`(\\w+[${config.launch.brModeType}]?)([.${config.launch.baseImageSuffix}]*)$`, 'i')
  }
}

/**
 * 获取正确的图片文件名
 * 因为图片可能存在
 * .mi.jpg
 * .mi.php
 * .hi.jpg
 * .hi.php
 * 等等这样的地址
 * @return
    original: "1d7949a5585942ed.jpg"
    suffix  : "1d7949a5585942ed.mi.jpg"
 */
export function analysisImageName(src) {
  let suffix = src
  let original = src
  let result

  //如果存在brModeType
  if (brModeRE) {
    result = src.match(brModeRE)
    if (result && result.length) {
      suffix = result[0]
      original = result[1]
    } else {
      $warn('zoom-image-brModeType解析出错,result：' + result)
    }
  }
  //有基础后缀
  //suffix: 1d7949a5585942ed.mi.jpg
  //original: 1d7949a5585942ed.jpg
  else if (config.launch.baseImageSuffix) {
    /*
        0 1d7949a5585942ed.mi.jpg"
        1 "1d7949a5585942ed"
        2 : ".mi"
        3: ".jpg"
     */
    result = src.match(/(\w+)(\.\w+)(\.\w+)$/)
    if (result && result.length) {
      suffix = result[0]
      original = result[1] + result[3]
    } else {
      $warn('zoom-image-suffix解析出错,result：' + result)
    }
  }
  //如果没有后缀
  else {
    //"1d7949a5585942ed.jpg"
    result = src.match(/\w+\.\w+$/)
    if (result && result.length) {
      suffix = original = result[0]
    } else {
      $warn('zoom-image解析出错,result：' + result)
    }
  }
  return {
    original, //原始版
    suffix //带有后缀
  }
}

/**
 * 给地址增加私有后缀
 * @param  {[type]} originalUrl [description]
 * @param  {[type]} suffix      [description]
 * @return {[type]}             [description]
 */
function insertImageUrlSuffix(originalUrl, suffix) {
  if (originalUrl && suffix) {
    //brModeType 没有类型后缀
    if (config.launch.brModeType && config.launch.brModeType !== 'delete') {
      return originalUrl.replace(/\w+/ig, '$&' + '.' + suffix)
    }
    //带后缀
    return originalUrl.replace(/\w+\./ig, '$&' + suffix + '.')
  }
  return originalUrl
}

/*获取高清图文件*/
export function getHDFilePath(originalUrl) {
  if (config.launch.useHDImageZoom && config.launch.imageSuffix && config.launch.imageSuffix['1440']) {
    return getFileFullPath(insertImageUrlSuffix(originalUrl, config.launch.imageSuffix['1440']), 'getHDFilePath')
  }
  return ''
}

/**
 * 文件是图片格式
 * @param  {[type]}  fileName [description]
 * @return {Boolean}          [description]
 */
export function hasImages(fileName) {
  return /\.[jpg|png|gif]+/i.test(fileName)
}

/**
 * 获取文件的全路径
 * @param  {[type]} fileName  [description]
 * @param  {[type]} debugType [description]
 * @return {[type]}           [description]
 *
 * isGif 为true 跳过brModeType模式
 */
export function getFileFullPath(fileName, debugType, isGif) {

  if (!fileName) {
    return ''
  }

  const launch = config.launch

  /*
  如果启动了基础图匹配,替换全部
  并且要是图片
  并且没有私有后缀
  */
  if (launch.baseImageSuffix &&
    hasImages(fileName) &&
    -1 === fileName.indexOf(`.${launch.baseImageSuffix}.`)) {
    /*"50f110321f467d25474b9dba9b342f0a.png"
      1 : "50f110321f467d25474b9dba9b342f0a"
      2 : "png"
    */
    let fileMatch = fileName.match(/(\w+)\.(\w+)$/)
    let name = fileMatch[1]
    let type = fileMatch[2]
    fileName = `${fileMatch[1]}.${launch.baseImageSuffix}.${fileMatch[2]}`
  }

  /*如果是GIF的话需要跳过brModeType类型的处理*/
  if (isGif) {
    return config.data.pathAddress + fileName
  }

  /*
    支持webp图
    1 如果启动brModeType
    2 并且是图片
    3 并且没有被修改过
  */
  if (launch.brModeType && hasImages(fileName) && !/\_[i|a]+\./i.test(fileName)) {

    let suffix = ''
    let name
    if (Xut.plat.isBrowser) { //手机浏览器访问
      let fileMatch = fileName.match(/\w+([.]?[\w]*)\1/ig)
      if (fileMatch.length === 3) {
        name = fileMatch[0]
        suffix = '.' + fileMatch[1]
      } else {
        name = fileMatch[0]
      }

      //content/13/gallery/106d9d86fa19e56ecdff689152ecb28a_i.mi
      return `${config.data.pathAddress + name}${launch.brModeType}${suffix}`
    } else {
      //手机app访问
      //content/13/gallery/106d9d86fa19e56ecdff689152ecb28a.mi
      return `${config.data.pathAddress + name}${suffix}`
    }
  }

  return config.data.pathAddress + fileName
}

/**
 * 获取资源
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
export function getResources(url) {
  var option;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, false);
  xhr.send(null);
  option = parseJSON(xhr.responseText);
  return option;
}

export function createFn(obj, id, callback) {
  var cObj = obj[id];
  if (!cObj) {
    cObj = obj[id] = {};
  }
  callback.call(cObj);
}

/**
 * 执行脚本注入
 */
export function execScript(code, type) {
  //过滤回车符号
  var enterReplace = function(str) {
    return str.replace(/\r\n/ig, '').replace(/\r/ig, '').replace(/\n/ig, '');
  }
  try {
    new Function(enterReplace(code))()
  } catch (e) {
    $warn('加载脚本错误', type)
  }
}

/**
 * 创建gif随机数
 * 用数字代码，不能用0.在有些电脑上不显示
 */
export function createRandomImg(url) {
  let s = Math.random().toString()
  s = s.replace(/\b(0+)(\.+)/gi, "")
  s = parseInt(s)
  return url + `?${s}`
}

/**
 * 路径替换
 * svg html文件的路径是原始处理的
 * 如果动态切换就需要替换
 * @return {[type]} [description]
 */
export function replacePath(svgstr) {
  if (config.launch.lauchMode === 1) {
    //如果能找到对应的默认路径，则替换
    if (-1 !== svgstr.indexOf('content/gallery/')) {
      svgstr = svgstr.replace(/content\/gallery/ig, config.data.pathAddress)
    }
  }
  return svgstr
}

/**
 * 转化缩放比
 */
const converProportion = function({
  width,
  height,
  left,
  top,
  padding,
  proportion,
  zoomMode, //缩放比模式
  getStyle
}) {

  if (!proportion) {
    $warn('没有传递缩放比,取全局config')
    proportion = config.proportion
  }

  //页眉，保持横纵比
  //计算顶部显示中线位置
  //如果溢出就溢出，高度设置为白边中线
  if (zoomMode === 1) {
    let visualTop = getStyle.visualTop
    let proportionalHeight = CEIL(height * proportion.width) || 0;
    return {
      width: CEIL(width * proportion.width) || 0,
      height: proportionalHeight,
      left: CEIL(left * proportion.left) || 0,
      top: -visualTop / 2 - proportionalHeight / 2 || 0,
      padding: CEIL(padding * proportion.width) || 0,
      isHide: proportionalHeight > visualTop //正比高度大于显示高度，隐藏元素
    }

  }
  //页脚，保持横纵比
  //计算底部显示中线位置
  //如果溢出就隐藏，高度设置为白边中线
  else if (zoomMode === 2) {
    let visualTop = getStyle.visualTop
    let proportionalHeight = CEIL(height * proportion.width) || 0;
    return {
      width: CEIL(width * proportion.width) || 0,
      height: proportionalHeight,
      left: CEIL(left * proportion.left) || 0,
      top: getStyle.visualHeight + visualTop / 2 - proportionalHeight / 2 || 0,
      padding: CEIL(padding * proportion.width) || 0,
      isHide: proportionalHeight > visualTop //正比高度大于显示高度，隐藏元素
    }
  }
  //图片正比缩放，而且保持上下居中
  else if (zoomMode === 3) {
    //高度为基本比值
    if (proportion.width > proportion.height) {
      let originalWidth = CEIL(width * proportion.width) || 0
      let proportionalWidth = CEIL(width * proportion.height) || 0
      let proportionalLeft = Math.abs(proportionalWidth - originalWidth) / 2
      left = CEIL(left * proportion.left) + proportionalLeft
      return {
        width: proportionalWidth,
        height: CEIL(height * proportion.height) || 0,
        left: left,
        top: CEIL(top * proportion.top) || 0,
        padding: CEIL(padding * proportion.width) || 0
      }
    } else {
      //宽度作为基本比值
      let originalHeight = CEIL(height * proportion.height) || 0
      let proportionalHeight = CEIL(height * proportion.width) || 0
      let proportionalTop = Math.abs(proportionalHeight - originalHeight) / 2
      top = CEIL(top * proportion.top) + proportionalTop
      return {
        width: CEIL(width * proportion.width) || 0,
        height: proportionalHeight,
        left: CEIL(left * proportion.left) || 0,
        top: top,
        padding: CEIL(padding * proportion.width) || 0
      }
    }

  }
  //默认缩放比
  else {
    return {
      width: CEIL(width * proportion.width) || 0,
      height: CEIL(height * proportion.height) || 0,
      left: CEIL(left * proportion.left) || 0,
      top: CEIL(top * proportion.top) || 0,
      padding: CEIL(padding * proportion.width) || 0
    }
  }
}


export function setProportion(...arg) {
  return converProportion(...arg)
}


/*
 * 修复元素的尺寸
 * @type {[type]}
 */
export function reviseSize({
  results,
  proportion,
  zoomMode,
  getStyle
}) {

  //不同设备下缩放比计算
  let layerSize = converProportion({
    proportion,
    zoomMode,
    getStyle,
    width: results.width,
    height: results.height,
    left: results.left,
    top: results.top
  })

  //新的背景图尺寸
  let backSize = converProportion({
    proportion,
    zoomMode,
    getStyle,
    width: results.backwidth,
    height: results.backheight,
    left: results.backleft,
    top: results.backtop
  })

  //赋值新的坐标
  results.scaleWidth = layerSize.width
  results.scaleHeight = layerSize.height
  results.scaleLeft = layerSize.left
  results.scaleTop = layerSize.top

  //元素状态
  if (layerSize.isHide) {
    results.isHide = layerSize.isHide
  }

  //背景坐标
  results.scaleBackWidth = backSize.width
  results.scaleBackHeight = backSize.height
  results.scaleBackLeft = backSize.left
  results.scaleBackTop = backSize.top

  return results
}


/**
 * 提供全局配置文件
 */
export function mixGolbalConfig(setConfig) {
  if (setConfig) {
    Xut.mixin(config.golbal, setConfig)
  }
}

/**
 * 清理图片
 * @return {[type]} [description]
 * action  'show' / 'hide'  在什么状态下删除
 * clone   克隆一份解决删除的闪动
 * default: 'hide'
 */
export function cleanImage(context, action) {

  if (!context) {
    return
  }

  if (!context.length) {
    context = $(context)
  }
  /**
   * 2017.6.26
   * 销毁图片apng
   * 一次性的apng图片，必须要清理src
   * 否则重复不生效，因为缓存的关系
   */
  function removeSRC(img) {
    if (img) {
      img.removeAttribute('onerror')
      img.src = null
      img.removeAttribute('src')
    }
  }

  try {
    if (action === 'show') {
      context.find('img').each((index, img) => removeSRC(img))
    } else {
      context.hide().find('img').each((index, img) => removeSRC(img))
    }
  } catch (e) {
    console.log('销毁图片出错')
  }
}

/**
 * 设置图片src
 * @param {[type]} context [description]
 * @param {[type]} path    [description]
 */
export function setImage(context, path) {
  if (!context) {
    return
  }
  if (!context.length) {
    context = $(context)
  }
  context.find('img').each(function(index, img) {
    img.src = path
  })
}
