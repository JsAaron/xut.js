import { query } from '../../../../database/query'

/*
更新数据缓存
1 activitys
2 auto
3 activitys
 */
export default function activeCache(base, callback) {

  const pageType = base.pageType

  /*缓存数据*/
  const addCacheGruop = (namespace, data) => {
    let key;
    if(!base.dataActionGroup[namespace]) {
      base.dataActionGroup[namespace] = data;
    } else {
      for(key in data) {
        base.dataActionGroup[namespace][key] = data[key];
      }
    }
  }

  /*增加数据缓存*/
  const addCache = (data, activitys, autoData) => {
    addCacheGruop(pageType, data); //挂载页面容器数据
    addCacheGruop('activitys', activitys); //挂载activitys数据
    addCacheGruop('auto', autoData); //挂载自动运行数据
  }

  query(pageType, {
    'pageIndex': base.chapterIndex,
    'pageData': base.chapterData,
    'pptMaster': base.pptMaster
  }, function(data, activitys, autoData) {
    addCache.apply(addCache, arguments)
    callback(data);
  })
}
