
import { query } from '../../manager/query'

/**
 * 更新数据缓存
 * @param  {[type]}   pid      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
export default function(pid, callback) {
    let fn, base = this,
        pageType = base.pageType;

    //缓存数据
    const addCacheDas = (namespace, data) => {
        let key;
        if (!base._dataCache[namespace]) {
            base._dataCache[namespace] = data;
        } else {
            for (key in data) {
                base._dataCache[namespace][key] = data[key];
            }
        }
    }

    //增加数据缓存
    const addCache = (data, activitys, autoData) => {
        addCacheDas(base.pageType, data); //挂载页面容器数据
        addCacheDas('activitys', activitys); //挂载activitys数据
        addCacheDas('auto', autoData); //挂载自动运行数据
    }

    query(pageType, {
        'pageIndex': pid,
        'pageData': base.chapterData,
        'pptMaster': base.pptMaster
    }, function(data, activitys, autoData) {
        addCache.apply(addCache, arguments)
        callback(data);
    })
}
