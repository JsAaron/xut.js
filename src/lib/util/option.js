import {
    request
} from './loader'
import { parseJSON } from './lang'
import { config } from '../config/index'

const CEIL = Math.ceil
const FLOOR = Math.floor

/**
 * 获取资源
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
export function getResources(url) {
    var option;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    option = parseJSON(xhr.responseText);
    return option;
}


/**
 * 执行脚本注入
 */
export function execScript(code, type) {
    //过滤回车符号
    var enterReplace = function(str) {
        return str.replace(/\r\n/ig, '').replace(/\r/ig, '').replace(/\n/ig, '');
    }
    try {
        new Function(enterReplace(code))()
    } catch (e) {
        console.log('加载脚本错误', type)
    }
}

/**
 * 创建gif随机数
 * @return {[type]} [description]
 */
export function createRandomImg(url) {
    return url + `?${Math.random()}`
}

/**
 * 路径替换
 * svg html文件的路径是原始处理的
 * 如果动态切换就需要替换
 * @return {[type]} [description]
 */
export function replacePath(svgstr) {
    if (window.DYNAMICCONFIGT) {
        //如果能找到对应的默认路径，则替换
        if (-1 !== svgstr.indexOf('content/gallery/')) {
            svgstr = svgstr.replace(/content\/gallery/ig, Xut.config.pathAddress)
        }
    }
    return svgstr
}


/**
 * 转化缩放比
 * @param  {[type]} width  [description]
 * @param  {[type]} height [description]
 * @param  {[type]} left   [description]
 * @param  {[type]} top    [description]
 * @return {[type]}        [description]
 */
const converProportion = function({
    width,
    height,
    left,
    top,
    padding,
    hasFlow, //这个很关键，这个是针对flow类型页面处理，因为模式3的情况导致母版的缩放比错误
    fixRadio //迷你使用，按照宽度正比缩放高度，相应的要调整top的值
}) {
    let proportion = hasFlow ? config.flowProportion : config.proportion;

    //需要正比缩放
    if (fixRadio) {
        width = CEIL(width * proportion.width) || 0
        height = CEIL(height * proportion.width) || 0
        //应该的正常高度
        let normalHeight = CEIL(height * proportion.height) || 0
        let heightPoor = normalHeight - height

        top = CEIL(top * proportion.top) || 0
        //真正的高度
        top = top - heightPoor/2
        return {
            width,
            height,
            top,
            left: CEIL(left * proportion.left) || 0,
            padding: CEIL(padding * proportion.width) || 0
        }
    } else {
        return {
            width: CEIL(width * proportion.width) || 0,
            height: CEIL(height * proportion.height) || 0,
            left: CEIL(left * proportion.left) || 0,
            top: CEIL(top * proportion.top) || 0,
            padding: CEIL(padding * proportion.width) || 0
        }
    }
}


export function setProportion(...arg) {
    return converProportion(...arg)
}


/*
 * 修复元素的尺寸
 * hasFlow页面额外用全屏的分辨率修正
 * fixRadio 是否保持宽度正比缩放 //2016.12.15 mini使用
 * @type {[type]}
 */
export function reviseSize(results, hasFlow, fixRadio) {

    //不同设备下缩放比计算
    const layerSize = converProportion({
        fixRadio,
        hasFlow,
        width: results.width,
        height: results.height,
        left: results.left,
        top: results.top
    })

    //新的背景图尺寸
    const backSize = converProportion({
        fixRadio,
        hasFlow,
        width: results.backwidth,
        height: results.backheight,
        left: results.backleft,
        top: results.backtop
    })

    //赋值新的坐标
    results.scaleWidth = layerSize.width
    results.scaleHeight = layerSize.height
    results.scaleLeft = layerSize.left
    results.scaleTop = layerSize.top

    //背景坐标
    results.scaleBackWidth = backSize.width
    results.scaleBackHeight = backSize.height
    results.scaleBackLeft = backSize.left
    results.scaleBackTop = backSize.top

    return results
}


/**
 *  读取SVG内容
 *  @return {[type]} [string]
 */
export function readFile(path, callback, type) {

    var paths, name, data;

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
        paths = config.getSvgPath().replace("svg", 'js') + path;
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
        paths = config.getSvgPath() + path;
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
    //游览器模式 && 非强制插件模式
    if (Xut.plat.isBrowser && !config.isPlugin) {
        $.ajax({
            type: 'get',
            dataType: 'html',
            url: config.getSvgPath().replace("www/", "") + path,
            success: function(svgContent) {
                callback(svgContent);
            },
            error: function(xhr, type) {
                callback('ReadFile数据加载失败');
                console.log('SVG' + path + '解析出错!');
            }
        })
    } else {
        Xut.Plugin.ReadAssetsFile.readAssetsFileAction(config.getSvgPath() + path, function(svgContent) {
            callback(svgContent);
        }, function(err) {
            callback('数据加载失败');
        });
    }
}
