import { loadfile } from '../../../util/loader'



/**
 * 路径地址
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
function path(fileName,widgetId) {
    return 'content/widget/' + widgetId + '/' + fileName
}


/**
 * 加载js,css文件
 * @return {[type]} [description]
 */
export function loader(callback, base) {
    var jsPath, cssPath, completeCount,
        widgetId = base.widgetId,
        //定义css,js的命名
        jsName   = base.widgetName + '.min.js',
        cssName  = (base.widgetType == 'page' || base.widgetType == 'js') ? 'style.min.css' : 0;

    //需要等待完成
    var completeCount = function() {
        var count = 0;
        jsName && count++;
        cssName && count++;
        return function() {
            if (count === 1) {
                return callback && callback.call(base);
            }
            count--;
        }
    }();

    //加载css
    if (cssName) {
        cssPath = path(cssName,widgetId);
        loadfile(cssPath, function() {
            completeCount();
        })
    }

    //加载js
    if (jsName) {
        jsPath = path(jsName,widgetId);
        loadfile(jsPath, function() {
            completeCount();
        });
    }
}
