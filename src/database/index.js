import { dataQuery } from './sql'
import { setApi, saveCache, convertCache } from './cache'

/**
 * 初始化数据类
 * 获取ppt总数
 * @return {[type]} [description]
 */
export function createStore(callback) {
  dataQuery((results, collectError) => {
    //保存缓存
    saveCache(results, collectError)
    //数据缓存转化
    convertCache()
    //设置API
    setApi(results.Novel.item(0)['_id'])
    callback(results)
  })
}
