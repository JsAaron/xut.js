/**
 * 资源路径
 * resource 就是图片音频数据文件
 * widget 是零件资源文件
 * @type {String}
 */
import { config } from '../index'

const defaultSourcePath = "content/gallery/"
const defaultWidgetPath = "content/widget/"

/**
 * 资源根路径
 * @type {String}
 */
export const getSourcePath = function() {
  if(config.launch.resource) {
    return config.launch.resource + '/gallery/'
  } else {
    return defaultSourcePath
  }
}

/**
 * 零件
 * @param  {[type]} 'source' [description]
 * @return {[type]}          [description]
 */
export const getWidgetPath = function() {
  if(config.launch.resource) {
    return config.launch.resource + '/widget/'
  } else {
    return defaultWidgetPath
  }
}
