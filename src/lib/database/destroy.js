import { removeResults } from './results'
import { removeCache } from './cache'


/**
 * 销毁缓存
 */
export function destroyCache(isRefresh) {
    removeCache() //userCache
}

/**
 * 销毁结果集
 * @param  {Boolean} isRefresh [description]
 * @return {[type]}            [description]
 */
export function destroyResult(isRefresh) {
    removeResults() //json database
}
