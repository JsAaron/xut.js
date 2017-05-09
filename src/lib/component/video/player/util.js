/**
 * 这里有四种播放器:
 *    1：基于html5原生实现的video标签 for ios
 *    2：基于phoneGap插件实现的media  for android
 *    3: 基于videoJS用flash实现的播放 for pc
 *    4: 用于插入一个网页的webview
 */
import { config } from '../../../config/index'

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
