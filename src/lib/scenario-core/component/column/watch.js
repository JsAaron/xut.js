/**
 * 监听分栏高度变化后处理
 */
const watchColumn = function(seasonsId, chapterId, count) {
    // console.log(count)
    setChpaterColumn(seasonsId, chapterId, count)
    //触发页面改变
    Xut.Application.Notify('change:numberTotal')

    //触发column分栏改变
    Xut.Application.Notify('change:column')
}

/**
 * 检测分栏高度
 */
export function checkColumnHeight($seasons, columnCollection, checkCount, callback) {

    getColumnCount($seasons, (seasonsId, chapterId, count) => {
        // if(columnCollection[seasonsId][chapterId] !== count) {
        //     columnCollection[seasonsId][chapterId] = count
        //     watchColumn(seasonsId, chapterId, count)
        // }
    })

    --checkCount

    if(checkCount) {
        setTimeout(function() {
            checkColumnHeight($seasons, columnCollection, checkCount, callback)
        }, 500)
    } else {
        callback()
    }

    return
}
