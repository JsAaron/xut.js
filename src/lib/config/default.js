/**
 * 资源路径
 * resource 就是图片音频数据文件
 * widget 是零件资源文件
 * @type {String}
 */

const defaultSourcePath = "content/gallery/"
const defaultWidgetPath = "content/widget/"

/**
 * 资源根路径
 * @type {String}
 */
export const getSourcePath = function() {
    if (window.DYNAMICCONFIGT) {
        return window.DYNAMICCONFIGT.resource + '/gallery/'
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
    if (window.DYNAMICCONFIGT) {
        return window.DYNAMICCONFIGT.resource + '/widget/'
    } else {
        return defaultWidgetPath
    }
}
