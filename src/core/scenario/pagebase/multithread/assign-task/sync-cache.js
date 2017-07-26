import { query } from 'database/query'

/*
更新数据缓存
1 activitys
2 auto
3 activitys
 */
export default function syncCache(base, callback) {

  const pageType = base.pageType

  /*缓存数据*/
  const cacheGruop = (namespace, data) => {
    let key;
    if (!base.dataActionGroup[namespace]) {
      base.dataActionGroup[namespace] = data;
    } else {
      for (key in data) {
        base.dataActionGroup[namespace][key] = data[key];
      }
    }
  }

  query(pageType, {
    'pageIndex': base.chapterIndex,
    'pageData': base.chapterData,
    'pptMaster': base.pptMaster
  }, function (data, activitys, autoData) {
    cacheGruop(pageType, data); //挂载页面容器数据
    cacheGruop('activitys', activitys); //挂载activitys数据
    cacheGruop('auto', autoData); //挂载自动运行数据
    callback(data);
  })
}
