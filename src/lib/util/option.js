import {
    messageBox as box
}
from './notice'

import {request} from './loader'


/**
 * 执行脚本注入
 */
export function injectScript(code, type) {
    //过滤回车符号
    var enterReplace = function(str) {
        return str.replace(/\r\n/ig, '').replace(/\r/ig, '').replace(/\n/ig, '');
    }
    try {
        new Function("(function(){" + enterReplace(code) + "})")()
    } catch (e) {
        console.log('加载脚本错误', type)
    }
}


/**
 * [ 消息框]
 * @param  {[type]} message [description]
 * @return {[type]}         [description]
 */
export function messageBox(message) {
    box(message);
}



//缩放比
function fiexdProportion(width, height, left, top) {
    var proportion = Xut.config.proportion;
    return {
        width: width * proportion.width,
        height: height * proportion.height,
        left: left * proportion.left,
        top: top * proportion.top
    }
}

/*
 * 修复元素的尺寸
 * @type {[type]}
 */

export function reviseSize(results) {
    //不同设备下缩放比计算
    var layerSize = fiexdProportion(results.width, results.height, results.left, results.top);
    //新的背景图尺寸
    var backSize = fiexdProportion(results.backwidth, results.backheight, results.backleft, results.backtop);

    //赋值新的坐标
    results.scaleWidth = Math.ceil(layerSize.width);
    results.scaleHeight = Math.ceil(layerSize.height);
    results.scaleLeft = Math.floor(layerSize.left);
    results.scaleTop = Math.floor(layerSize.top);

    //背景坐标
    results.scaleBackWidth = Math.ceil(backSize.width);
    results.scaleBackHeight = Math.ceil(backSize.height);
    results.scaleBackLeft = Math.floor(backSize.left);
    results.scaleBackTop = Math.floor(backSize.top);

    return results;
}


/**
 *  读取SVG内容
 *  @return {[type]} [string]
 */
export function readFile(path, callback, type) {

    var paths, name, data;
    var config = Xut.config;

    /**
     * ibooks模式 单独处理svg转化策划给你js,加载js文件
     * @param  {[type]} IBOOKSCONFIG [description]
     * @return {[type]}              [description]
     */
    if (Xut.IBooks.CONFIG) {
        paths = config.svgPath().replace("svg", 'js') + path;
        name = path.replace(".svg", '')
        request(paths.replace(".svg", '.js'), function() {
            data = Xut.IBooks.CONFIG[name];
            if (data) {
                callback(data)
                delete Xut.IBooks.CONFIG[name];
            } else {
                callback('脚本加载失败,文件名:' + path);
            }
        })
        return
    }


    //如果是js动态文件
    //content的html结构
    if (type === "js") {
        paths = config.svgPath() + path;
        name = path.replace(".js", '')
        request(paths, function() {
            data = window.HTMLCONFIG[name];
            if (data) {
                callback(data)
                delete window.HTMLCONFIG[name];
            } else {
                callback('脚本加载失败,文件名:' + path);
            }
        })
        return
    }

    //svg文件
    //游览器模式
    if (Xut.plat.isBrowser) {
        $.ajax({
            type: 'get',
            dataType: 'html',
            url: config.svgPath().replace("www/", "") + path,
            success: function(svgContent) {
                callback(svgContent);
            },
            error: function(xhr, type) {
                callback('ReadFile数据加载失败');
                console.log('SVG' + path + '解析出错!');
            }
        })

    } else {
        //手机模式
        Xut.Plugin.ReadAssetsFile.readAssetsFileAction(config.svgPath() + path, function(svgContent) {
            callback(svgContent);
        }, function(err) {
            callback('数据加载失败');
        });
    }
}
