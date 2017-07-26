import {
  dataOffset,
  transformVideoActivity,
  transformSectionRelated
} from './transform'

import {
  dataRemove,
  oneQuery
} from './sql'


/**
 * 数据缓存
 */
let dataCache

/**
 * 带有场景信息存数
 */
let sectionRelated

/**
 * 音频的ActivityId信息
 */
let videoActivityIdCache

/**
 * 错误表
 */
let errortables


/**
 * 错误表
 * @return {[type]} [description]
 */
export function errorTable() {
  return errortables
}


/**
 * 保存缓存
 * @param {[type]} results [description]
 */
export function saveCache(results, collectError) {
  //错表
  errortables = collectError || []

  //数据结果集
  Xut.data = dataCache = results
}


/**
 * 销毁数据
 * @return {[type]} [description]
 */
export function removeCache() {
  dataCache = null
  sectionRelated = null
  videoActivityIdCache = null
  Xut.data = null
}

/**
 * 转化缓存
 */
export function convertCache() {

  /**
   * 计算数据偏移量
   */
  dataOffset(dataCache)

  /**
   * vidoe特殊处理，需要记录chapterId范围
   */
  if(dataCache.Video) {
    videoActivityIdCache = transformVideoActivity(dataCache)
  }

  /**
   * 带有场景处理
   * @type {[type]}
   */
  sectionRelated = transformSectionRelated(dataCache)
}


/**
 *  查询数据接口
 *  1 video表传递是activityId关联
 *  2 其余表都是传递当前表的id
 *  type 查询ID的类型, 数据的id或者activityId
 *  callback 提供给chapterId使用
 * @return {[type]} [description]
 */
export function setApi(novelId) {

  /**
   * 标记应用ID
   * @type {[type]}
   */
  dataCache.novelId = novelId;

  /**
   * 针对数据库content为空的处理
   * @return {[type]} [description]
   */
  dataCache.preventContent = function() {
    return dataCache.Content.length ? false : true;
  }()


  /**
   * 通过ID查询方式
   * @param  {[type]}  tableName [description]
   */
  dataCache.query = function(tableName, id, type, callback) {
    /**
     * 特殊的字段关联
     * 1 activityId
     * 2 chpaterId
     */
    switch(type) {
      /**
       * 通过activityId查询的方式
       *
       * 表名,ID,类型
       * Xut.data.query('Action', id, 'activityId');
       *
       * @type {[type]}
       */
      case 'activityId':
        var item;
        var activityId = id;
        var data = dataCache[tableName];
        for(var i = 0, len = data.length; i < len; i++) {
          item = data.item(i);
          if(item) {
            if(item[type] == activityId) {
              return item;
            }
          }
        }
        return;

        /**
         * 通过chpaterId查询方式
         * parser中的scanActivity过滤处理
         */
      case 'chapterId':
      case 'seasonId':
        var chapterId = id;
        var data = dataCache[tableName];
        if(data) {
          var item;
          for(var i = 0, len = data.length; i < len; i++) {
            item = data.item(i);
            if(item) {
              if(item[type] == chapterId) {
                callback && callback(item)
              }
            }

          }
        }
        return;
    }


    /**
     * 数据信息
     * @return {[type]} [description]
     */
    const Query = () => {
      var data = dataCache[tableName];
      if(id) {
        var index = id - data.start;
        return data.item(index);
      } else {
        return data.length ? data.item(0) : null;
      }
    }


    /**
     * 通过id查询的方式
     */
    switch(tableName) {
      //获取整个一个用的chapter数据
      case 'appPage':
        return dataCache.Chapter;
        ///获取整个一个用的Section数据 
      case 'appSection':
        return dataCache.Season;
        //如果是是section信息
      case 'sectionRelated':
        return sectionRelated['seasonId->' + id];
        //如果是音频
      case 'Video':
        if(type) {
          return Query();
        } else {
          //传递的id是activityId
          var id = videoActivityIdCache[id];
          return dataCache.query('Video', id, true);
        }

      default:
        //默认其余所有表
        return Query();
    }
  }


  /**
   * 针对动态表查询
   * 每次需要重新取数据
   * Xut.data.oneQuery('Image',function(){});
   * @return {[type]} [description]
   */
  dataCache.oneQuery = function(tableName, callback) {
    oneQuery(tableName, function(data) {
      callback && callback(data);
    })
  }

  /**
   * 删除数据
   * 表名,表ID
   * @return {[type]} [description]
   */
  dataCache.remove = function(tableName, id, success, failure) {
    dataRemove(tableName, id, success, failure)
  }
}