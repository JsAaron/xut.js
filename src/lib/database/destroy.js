import { removeResults } from './results'
import { removeCache } from './cache'

/**
 * 数据销毁
 */
export default function Destroy(isRefresh) {
    if (!isRefresh) {
        removeResults() //json database
    }
    removeCache() //userCache
}
