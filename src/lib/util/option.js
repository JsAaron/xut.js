import {
    messageBox as box
}
from './notice'

import { request } from './loader'


/**
 * 执行脚本注入
 */
export function injectScript(code, type) {
    //过滤回车符号
    var enterReplace = function(str) {
        return str.replace(/\r\n/ig, '').replace(/\r/ig, '').replace(/\n/ig, '');
    }
    try {
        (new Function("return " + enterReplace(code)))();
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


export function setProportion(width, height, left, top) {
    return fiexdProportion.apply(this, arguments)
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
     * @param  {[type]} window.IBOOKSCONFIG [description]
     * @return {[type]}              [description]
     */
    if (Xut.IBooks.CONFIG) {

        //如果是.svg结尾
        //把svg替换成js
        if (/.svg$/.test(path)) {
            path = path.replace(".svg", '.js')
        }

        //全路径
        paths = config.svgPath().replace("svg", 'js') + path;
        //文件名
        name = path.replace(".js", '')

        //加载脚本
        request(paths, function() {
            data = window.HTMLCONFIG[name] || window.IBOOKSCONFIG[name]
            if (data) {
                callback(data)
                delete window.HTMLCONFIG[name];
                delete window.IBOOKSCONFIG[name]
            } else {
                callback('编译:脚本加载失败,文件名:' + name);
            }
        })

        return
    }

    //con str
    //externalFile使用
    //如果是js动态文件
    //content的html结构
    if (type === "js") {
        paths = config.svgPath() + path;
        name = path.replace(".js", '')
        request(paths, function() {
            data = window.window.HTMLCONFIG[name];
            if (data) {
                callback(data)
                delete window.window.HTMLCONFIG[name];
            } else {
                callback('运行：脚本加载失败,文件名:' + path);
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
