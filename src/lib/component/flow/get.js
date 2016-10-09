let cacheCounts

/**
 * 设置流式布局排版信息
 */
export function set(flowCounts) {
    cacheCounts = flowCounts
}

/**
 * 获取当前当前到前置的总和
 * @return {[type]} [description]
 */
export function getCurrentBeforeCount(seasonId, chapterId) {
    if (!cacheCounts) return
    if (!seasonId && !chapterId) return
    let seasonIds = cacheCounts[seasonId]
    let count = 0
    for (let key in seasonIds) {
        if (key <= chapterId) {
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
    if (!cacheCounts) return
    if (!seasonId && !chapterId) return
    let seasonIds = cacheCounts[seasonId]
    let count = 0
    for (let key in seasonIds) {
        if (key < chapterId) {
            count += seasonIds[key]
                --count
        }
    }
    return count > 0 ? count : 0
}

/**
 * 获取chpater总数
 * @param  {[type]} seasonId [description]
 * @return {[type]}          [description]
 */
export function getFlowChpaterCount(seasonId) {
    if (!cacheCounts) return
    return Object.keys(cacheCounts[seasonId]).length
}

/**
 * reutrn seasonIds
 * return chpaterIds
 * @param  {[type]} seasonId  [description]
 * @param  {[type]} chpaterId [description]
 * @return {[type]}           [description]
 */
export function getFlowCount(seasonId, chapterId) {
    if (!cacheCounts) return
    if (seasonId) {
        if (chapterId) {
            return cacheCounts[seasonId] && cacheCounts[seasonId][chapterId]
        } else {
            let seasonIds = cacheCounts[seasonId]
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
 * 判断是否为流式布局页面
 * @param  {[type]} seasonId  [description]
 * @param  {[type]} chpaterId [description]
 * @return {[type]}           [description]
 */
export function isFlowPage(seasonId, chapterId) {
    return getFlowCount(seasonId, chapterId) ? true : false
}
