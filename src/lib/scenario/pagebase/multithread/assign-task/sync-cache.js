import { query } from '../../../../database/query'

/*更新数据缓存*/
export default function(chapterIndex, callback) {

  let pageType = this.pageType

  /*缓存数据*/
  const addCacheDas = (namespace, data) => {
    let key;
    if(!this._dataCache[namespace]) {
      this._dataCache[namespace] = data;
    } else {
      for(key in data) {
        this._dataCache[namespace][key] = data[key];
      }
    }
  }

  /*增加数据缓存*/
  const addCache = (data, activitys, autoData) => {
    addCacheDas(pageType, data); //挂载页面容器数据
    addCacheDas('activitys', activitys); //挂载activitys数据
    addCacheDas('auto', autoData); //挂载自动运行数据
  }

  query(pageType, {
    'pageIndex': chapterIndex,
    'pageData': this.chapterData,
    'pptMaster': this.pptMaster
  }, function(data, activitys, autoData) {
    addCache.apply(addCache, arguments)
    callback(data);
  })
}
