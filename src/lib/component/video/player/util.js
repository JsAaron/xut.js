/**
 * 这里有四种播放器:
 *    1：基于html5原生实现的video标签 for ios
 *    2：基于phoneGap插件实现的media  for android
 *    3: 基于videoJS用flash实现的播放 for pc
 *    4: 用于插入一个网页的webview
 */
import { config } from '../../../config/index'

/**
 * 创建视频容器
 */
export function createVideoWrap(type, options) {
  const { width, height, zIndex, top, left } = options

  /*数据可能为100%，或者纯数字*/
  let setWidth = `width:${width}px`
  let setHeight = `height:${height}px`

  if (typeof width === 'string') {
    if (~width.indexOf('%')) {
      setWidth = `width:${width}`
    }
  }

  if (typeof height === 'string') {
    if (~height.indexOf('%')) {
      setHeight = `height:${height}`
    }
  }

  return $(String.styleFormat(
    `<div data-type="${type}"
          style="${setWidth};
                 ${setHeight};
                 position:absolute;
                 visibility:hidden;
                 z-index:${zIndex};
                 top:${top}px;
                 left:${left}px;">
     </div>`))
}


/*获取视频文件路径*/
export function getFilePath(url) {
  return config.getVideoPath() + url
}


/**
 * 获取容器
 * 1 浮动视频单独处理
 * 2 没有浮动视频
 * @return {[type]} [description]
 */
export function getContainer(options) {

  /*视频已经浮动,找到浮动容器的根节点floatGroup*/
  if (options.isfloat) {
    return Xut.Presentation.GetFloatContainer(options.pageType)
  }

  const container = options.container

  /*如果是isColumn的使用，直接用触发节点*/
  if (options.isColumn) {
    return $(container)
  }

  //jquery对象
  if (container.length) {
    return container.children()
  }

  //dom
  return container.children ? $(container.children) : $('body')
}
