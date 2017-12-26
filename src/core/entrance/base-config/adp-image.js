import { config } from '../../config/index'

/**
 * 自适应图片
 * @return {[type]} [description]
 */
export function adaptiveImage() {
  let $adaptiveImageNode = $('.xut-adaptive-image')
  if ($adaptiveImageNode.length) {
    let baseImageType = $adaptiveImageNode.width()
    let type = config.launch.imageSuffix[baseImageType]
    if (type) {
      config.launch.baseImageSuffix = type
      return
    }
  }
  setDefaultSuffix()
}


/**
 * 最大屏屏幕尺寸
 * @return {[type]} [description]
 */
function getMaxWidth() {
  if (config.visualSize) {
    return config.visualSize.width
  }
  return window.screen.width > document.documentElement.clientWidth ?
    window.screen.width :
    document.documentElement.clientWidth
}


/**
 * 检车分辨率失败的情况
 * 强制用js转化
 * 750:  '', //0-1079
 * 1080: 'mi', //1080-1439
 * 1440: 'hi' //1440->
 */
function setDefaultSuffix() {
  let doc = document.documentElement
  //竖版的情况才调整
  if (doc.clientHeight > doc.clientWidth) {
    let ratio = window.devicePixelRatio || 1
    let maxWidth = getMaxWidth() * ratio
    if (maxWidth >= 1080 && maxWidth < 1439) {
      config.launch.baseImageSuffix = config.launch.imageSuffix['1080']
    }
    if (maxWidth >= 1440) {
      config.launch.baseImageSuffix = config.launch.imageSuffix['1440']
    }
    Xut.$warn({
      type: 'config',
      content: 'css media匹配suffix失败，采用js采用计算 config.launch.baseImageSuffix = ' + config.launch.baseImageSuffix
    })
  }
}
