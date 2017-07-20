import { loadFile } from '../../../util/loader/file'
import { config } from '../../../config/index'

/**
 * 路径地址
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
function path(fileName, widgetId) {
  return config.getWidgetPath() + widgetId + '/' + fileName
}


/**
 * 去重加载处理
 */
let toRepeat = {}

const add = function(path, callback) {
  //去重复处理
  //可能同时执行了多个同样的js文件加载
  if(!toRepeat[path]) {
    toRepeat[path] = []
  }
  toRepeat[path].push(callback)
  if(toRepeat[path].length > 1) {
    return
  }
  loadFile(path, function() {
    _.each(toRepeat[path], function(fn) {
      fn && fn()
    })
    toRepeat[path] = null
    delete toRepeat[path]
  })
}

export function removeFileLoad() {
  toRepeat = {}
}

/**
 * 加载js,css文件
 * @return {[type]} [description]
 */
export function fileLoad(callback, base) {
  var jsPath, cssPath, completeCount,
    widgetId = base.widgetId,
    //定义css,js的命名
    jsName = base.widgetName + '.min.js',
    cssName = (base.widgetType == 'page' || base.widgetType == 'js') ? 'style.min.css' : 0;

  //需要等待完成
  var completeCount = function() {
    var count = 0;
    jsName && count++;
    cssName && count++;
    return function() {
      if(count === 1) {
        return callback && callback.call(base);
      }
      count--;
    }
  }();

  //加载css
  if(cssName) {
    cssPath = path(cssName, widgetId)
    add(cssPath, completeCount)
  }

  //加载js
  if(jsName) {
    jsPath = path(jsName, widgetId)
    add(jsPath, completeCount)
  }
}
