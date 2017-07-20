/**
 * 记录分栏数据
 * columnData[seasonsId][chapterId] = {
 *     count,
 *     height
 * }
 * @type {Object}
 */
let columnData

/**
 * 缓存流式布局对象
 */
export function addCache(data) {
  columnData = data
}

/**
 * 后台补全，如果数量错误，重设分栏的数量
 */
export function resetColumnCount(seasonsId, chapterId, value) {
  if (columnData[seasonsId] && columnData[seasonsId][chapterId]) {
    columnData[seasonsId][chapterId] = value
  }
}

/**
 * 是否有流式排版
 * 加快计算
 * @return {Boolean} [description]
 */
export function hasColumn() {
  return columnData
}

/**
 * 获取当前当前到前置的总和
 * @return {[type]} [description]
 */
export function getCurrentBeforeCount(seasonId, chapterId) {
  if (!columnData) return
  if (!seasonId && !chapterId) return
  let seasonIds = columnData[seasonId]
  let count = 0
  for (let key in seasonIds) {
    if (key <= chapterId) {
      count += seasonIds[key];
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
  if (columnData && seasonId && chapterId) {
    let seasonIds = columnData[seasonId]
    let count = 0
    for (let key in seasonIds) {
      if (key < chapterId) {
        count += seasonIds[key];
        --count
      }
    }
    return count > 0 ? count : 0
  }
}

/**
 * 获取chpater总数
 * 一共有多少chapter页面有分栏
 */
export function getColumnChapterCount(seasonId) {
  if (!columnData) return
  return Object.keys(columnData[seasonId]).length
}

/**
 * reutrn seasonIds
 * return chpaterIds
 */
export function getColumnCount(seasonId, chapterId) {
  if (!columnData) return
  if (seasonId) {
    if (chapterId) {
      return columnData[seasonId] && columnData[seasonId][chapterId]
    } else {
      let seasonIds = columnData[seasonId]
      let count = 0
      for (let key in seasonIds) {
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
