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
export function importResults(callback) {
    const path = window.DYNAMICCONFIGT.database
    if (path) {
        //add window.SQLResult database
        request(path, () => {
            result = window.SQLResult
            window.SQLResult = null
            callback()
        })
    } else if (window.SQLResult) {
        result = window.SQLResult
        window.SQLResult = null
        callback()
    } else {
        callback()
    }
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
