let cacheCounts

/**
 * 设置流式布局排版信息
 */
export function set(flowCounts) {
    cacheCounts = flowCounts
}

/**
 * reutrn seasonIds
 * return chpaterIds
 * @param  {[type]} seasonId  [description]
 * @param  {[type]} chpaterId [description]
 * @return {[type]}           [description]
 */
export function getFlowCount(seasonId, chapterId) {
    if (seasonId) {
        if (chapterId) {
            return cacheCounts[seasonId] && cacheCounts[seasonId][chapterId]
        } else {
            let seasonIds = cacheCounts[seasonId]
            let count = 0
            for (let key in seasonIds) {
                count += seasonId[key]
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
