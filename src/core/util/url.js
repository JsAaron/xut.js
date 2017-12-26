////////////////////////////////////////////////////
///
///  * 杂志支持多种资源的组合形式
///  * _a _i .hi .mi
///  * 根据brModeType与的baseImageSuffix的组合
///
////////////////////////////////////////////////////

import { config } from '../config/index'

function showWarn(data) {
  Xut.$warn({
    type: 'util',
    content: data
  })
}

/**
 * 获取正确的图片文件名
 * 因为图片可能存在,因为图片可能是在flow数据中获取的
 * flow的数据是被处理过的
 * 所以文件路径可以是几种情况
 * .mi.jpg
 * .mi.php
 * .hi.jpg
 * .hi.php
 * 等等这样的地址

  src的地址 4种情况

  content/11/gallery/b9ba3dfc39ddd207.jpg
  content/11/gallery/b9ba3dfc39ddd207.hi.jpg
  content/11/gallery/b9ba3dfc39ddd207.mi.jpg

  content/11/gallery/b9ba3dfc39ddd207_a
  content/11/gallery/b9ba3dfc39ddd207_a.mi
  content/11/gallery/b9ba3dfc39ddd207_a.hi

  content/11/gallery/b9ba3dfc39ddd207_i
  content/11/gallery/b9ba3dfc39ddd207_i.mi
  content/11/gallery/b9ba3dfc39ddd207_i.hi

 *
   根据不同的模式
   解析出对应的文件名出来
 */
export function converUrlName(src) {
  let result
  let hdName //高清图名
  let brModeType = config.launch.brModeType
  let baseImageSuffix = config.launch.baseImageSuffix

  //如果支持高清图
  //判断出高清图后缀
  const hdPostfix = config.launch.useHDImageZoom &&
    config.launch.imageSuffix &&
    config.launch.imageSuffix['1440']

  //没有任何后缀
  //"1d7949a5585942ed.jpg"
  if (!brModeType && !baseImageSuffix) {
    result = src.match(/\w+\.\w+$/)
    if (result && result.length) {
      return {
        hdName: result[0],
        suffix: result[0],
        original: result[0]
      }
    } else {
      showWarn('zoom-image解析出错,result：' + result)
    }
  }

  //仅仅只有 _a _i的情况
  if (brModeType && !baseImageSuffix) {
    result = src.match(/(?!\/)\w+$/)
    if (result && result.length) {
      //因为不存在baseImageSuffix，所以不存在高清图
      return {
        hdName: result[0],
        suffix: result[0],
        original: result[0]
      }
    } else {
      showWarn('zoom-image-brModeType解析出错,result：' + result)
    }
  }

  //如果有_a _i 与 mi hi的 并存的情况
  //http://localhost:8888/content/326/gallery/96c09043866bd398_a.mi
  //0: "96c09043866bd398_a.mi"
  //1: "96c09043866bd398_a"
  //2: ".mi"
  if (baseImageSuffix && brModeType) {
    result = src.match(/(\w+)(\.\w+)$/)
    if (result && result.length) {
      if (hdPostfix) {
        //96c09043866bd398_a.hi
        hdName = `${result[1]}.${hdPostfix}`
      } else {
        hdName = result[0]
      }
      return {
        hdName,
        suffix: result[0], //带有后缀的 "96c09043866bd398_a.mi"
        original: result[1] //解析出来原始的 "96c09043866bd398_a"
      }
    } else {
      showWarn('zoom-image-suffix解析出错,result：' + result)
    }
    return
  }

  //仅仅只有 .hi/.mi的情况
  //http://localhost:8888/content/326/gallery/96c09043866bd398.mi.jpg"
  // 0 1d7949a5585942ed.mi.jpg"
  // 1 "1d7949a5585942ed"
  // 2 : ".mi"
  // 3: ".jpg"
  if (baseImageSuffix && !brModeType) {
    result = src.match(/(\w+)(\.\w+)(\.\w+)$/)
    if (result && result.length) {
      if (hdPostfix) {
        //96c09043866bd398.hi.jpg
        hdName = `${result[1]}.${hdPostfix}${result[3]}`
      } else {
        hdName = result[0]
      }
      return {
        hdName,
        suffix: result[0], //带有后缀的 "1d7949a5585942ed.mi.jpg"
        original: result[1] + result[3] //解析出来原始的 1d7949a5585942ed" + ".jpg"
      }
    } else {
      showWarn('zoom-image-suffix解析出错,result：' + result)
    }
  }

}



/**
 * 普通资源路径转化
 * 载资源都是PNG.JPG的格式
 * 但是杂志支持多种资源的组合形式
 * _a _i .hi .mi
 * 根据brModeType与的baseImageSuffix的组合
 * 匹配正确的后缀名
 *
 * url 传入完成的URL

一种有四种大的组合情况

// 'd048193365eac224_a'
// 'd048193365eac224_i'
//
// 'b9ba3dfc39ddd207.jpg'
//
// 'd048193365eac224_i.mi'
// 'd048193365eac224_i.hi'
// 'd048193365eac224_a.hi'
// 'd048193365eac224_a.mi'
//
// 'b9ba3dfc39ddd207.hi.jpg'
// 'b9ba3dfc39ddd207.mi.jpg'

 */
export function converImageURL(url, supportBrMode, supportSuffix) {

  if (!url) {
    return ''
  }

  const brModeType = supportBrMode ? supportBrMode : config.launch.brModeType
  const baseImageSuffix = supportSuffix ? supportSuffix : config.launch.baseImageSuffix

  //不需要转换
  if (!brModeType && !baseImageSuffix) {
    return url
  }

  const imageData = url.split('.')
  const imagePrefix = imageData[0]
  const imgetPostfix = imageData[1]

  if (brModeType && baseImageSuffix) {
    //http://localhost:8888/content/11/gallery/1ffa8897140f3b99f7b3a5173fbc3ac2 _a .hi
    return `${imagePrefix}${brModeType}.${baseImageSuffix}`
  }

  if (brModeType && !baseImageSuffix) {
    //http://localhost:8888/content/11/gallery/1ffa8897140f3b99f7b3a5173fbc3ac2 _a
    return `${imagePrefix}${brModeType}`
  }

  if (!brModeType && baseImageSuffix) {
    //content/11/gallery/b9ba3dfc39ddd207 .hi .jpg
    return `${imagePrefix}.${baseImageSuffix}.${imgetPostfix}`
  }
}
