/**
 * 计算数据偏移量
 * @param  {[type]} tableName [description]
 * @return {[type]}           [description]
 */
export function dataOffset(dataCache) {

  const set = (tableName) => {
    let start
    let data = dataCache[tableName]
    if (data.length) {
      if (data.item(0)) {
        if (start = data.item(0)._id) {
          dataCache[tableName].start = start
        }
      }
    }
  }

  //数据段标记
  for (let key in dataCache) {
    if (dataCache[key].item) {
      set(key);
    }
  }

  return dataCache
}


/**
 * 转化video的activtiy信息
 * 因为Video不是靠id关联的 是靠activtiy关联
 * [description]
 * @return {[type]} [description]
 */
export function transformVideoActivity(dataCache) {
  let data
  let activityIds = {}
  let video = dataCache.Video
  _.each(video, (_, index) => {
    data = video.item(index)

    //确保activityIdID是有值，
    //这样才是靠activity关联的video,
    //而不是动画的video
    if (data && data.activityId) {
      activityIds[data.activityId] = data._id;
    }
  })
  return activityIds;
}


/**
 * chpater分段
 * 转化section信息
 * 带有场景处理
 * @return {[type]} [description]
 */
export const transformSectionRelated = (dataCache) => {
  var seasonId, start, length, sid, i, id, seasonInfo, toolbar, Chapters,
    container = {},
    Chapter = dataCache.Chapter,
    l = Chapter.length,
    end = 0;

  //找到指定的season信息
  const findSeasonInfo = seasonId => {
    var temp,
      seasonNum = dataCache.Season.length;
    while (seasonNum--) {
      if (temp = dataCache.Season.item(seasonNum)) {
        if (temp._id == seasonId) {
          return temp;
        }
      }
    }
  }

  for (i = 0; i < l; i++) {
    Chapters = Chapter.item(i);
    if (Chapters) {
      id = Chapters._id - 1; //保存兼容性,用0开头
      seasonId = Chapters.seasonId;
      sid = 'seasonId->' + seasonId;
      //如果不在集合,先创建
      if (!container[sid]) {
        //场景工具栏配置信息
        if (seasonInfo = findSeasonInfo(seasonId)) {
          toolbar = seasonInfo.parameter;
        }
        container[sid] = {
          start: id,
          length: 1,
          end: id,
          toolbar: toolbar
        }
      } else {
        container[sid].end = id;
        container[sid].length = (container[sid].length + 1);
      }
    }
  }

  return container;
}
