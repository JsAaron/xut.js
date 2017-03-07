let cacheColumns

/**
 * 缓存流式布局对象
 */
export function setCache(columnCount) {
  cacheColumns = columnCount
}


export function setChpaterColumn(seasonsId, chapterId, value) {
  if(cacheColumns[seasonsId] && cacheColumns[seasonsId][chapterId]) {
    cacheColumns[seasonsId][chapterId] = value
  }
}

/**
 * 是否有流式排版
 * 加快计算
 * @return {Boolean} [description]
 */
export function hasColumn() {
  return cacheColumns
}

/**
 * 获取当前当前到前置的总和
 * @return {[type]} [description]
 */
export function getCurrentBeforeCount(seasonId, chapterId) {
  if(!cacheColumns) return
  if(!seasonId && !chapterId) return
  let seasonIds = cacheColumns[seasonId]
  let count = 0
  for(let key in seasonIds) {
    if(key <= chapterId) {
      count += seasonIds[key]
        --count
    }
  }
  return count > 0 ? count : 0
}

/**
 * 获取当前chapterId之前的总页数
 * @return {[type]} [description]
 */
export function getBeforeCount(seasonId, chapterId) {
  if(!cacheColumns) return
  if(!seasonId && !chapterId) return
  let seasonIds = cacheColumns[seasonId]
  let count = 0
  for(let key in seasonIds) {
    if(key < chapterId) {
      count += seasonIds[key]
        --count
    }
  }
  return count > 0 ? count : 0
}

/**
 * 获取chpater总数
 */
export function getColumnChpaterCount(seasonId) {
  if(!cacheColumns) return
  return Object.keys(cacheColumns[seasonId]).length
}

/**
 * reutrn seasonIds
 * return chpaterIds
 */
export function getColumnCount(seasonId, chapterId) {
  if(!cacheColumns) return
  if(seasonId) {
    if(chapterId) {
      return cacheColumns[seasonId] && cacheColumns[seasonId][chapterId]
    } else {
      let seasonIds = cacheColumns[seasonId]
      let count = 0
      for(let key in seasonIds) {
        count += seasonIds[key]
      }
      return count
    }
  } else {
    console.log('getCounts失败')
  }
}


/**
 * 判断是否为分栏布局页面
 * @param  {[type]} seasonId  [description]
 * @param  {[type]} chpaterId [description]
 * @return {[type]}           [description]
 */
export function isColumnPage(seasonId, chapterId) {
  return getColumnCount(seasonId, chapterId) ? true : false
}