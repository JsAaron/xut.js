import { request } from '../util/loader'

/**
 * 数据库缓存结果集
 */
let result

/**
 * 设置数据缓存
 * 1 去掉全局挂着
 * 2 缓存
 */
export function importDatabase(callback) {
    //如果外联指定路径json数据
    const path = window.DYNAMICCONFIGT && window.DYNAMICCONFIGT.database
    if (path) {
        //add window.SQLResult database
        request(path, function() {
            result = window.SQLResult;
            //配置了远程地址
            if (window.DYNAMICCONFIGT.request === 'remote' && result.FlowData) {
                //<img src="content/310/gallery/0920c97a591f525044c8d0d5dbdf12b3.png"
                //xlink:href="content/310/gallery/696c9e701f5e3fd82510d86e174c46a0.png"
                let remoteUrl = window.DYNAMICCONFIGT.resource
                result.FlowData = result.FlowData.replace(/<img\s*src=\"[\w\/]+gallery/ig, '<img src=\"' + remoteUrl + 'gallery')
                result.FlowData = result.FlowData.replace(/xlink:href=\"[\w\/]+gallery/ig, 'xlink:href=\"' + remoteUrl + 'gallery')

            }
            window.SQLResult = null;
            callback();
        });
    }
    //如果外联index.html路径json数据
    else if (window.SQLResult) {
        result = window.SQLResult
        window.SQLResult = null
        callback()
    } else {
        callback()
    }
}

/**
 * 删除挂载的flow数据
 * @return {[type]} [description]
 */
export function removeFlowData() {
    result['FlowData'] = null
}

/**
 * 获取数据缓存
 * @return {[type]} [description]
 */
export function getResults() {
    return result
}


/**
 * 移除缓存数据
 * @return {[type]} [description]
 */
export function removeResults() {
    result = null
}
