import { config } from '../../config/index'

const COLUMNWIDTH = Xut.style.columnWidth
const COLUMNTAP = Xut.style.columnGap

/**
 * seasonId:{
 *    chpaterID:count
 * }
 * @type {[type]}
 */
let flowCounts = Object.create(null)


/**
 * dom...
 */
const createStr = (chapterId, data, vWidth, vHeight) => {
    const columnWidth = `${COLUMNWIDTH}:${vWidth}px`
    const columnHeight = `height:${vHeight}px`
    const columnGap = `${COLUMNTAP}:20px`
    const transform = 'translate3d(0, 0, 0)'
    const $container = `
            <section data-flow="true" style="overflow:hidden;">
                <div id="section-column" style="${columnWidth};${columnHeight};${columnGap}">${data}</div>
            </section>`

    return $container
}


const resolveCount = ($content) => {
    const theChildren = $content.find('#section-column').children()
    let paraHeight = 0
    for (let i = 0; i < theChildren.length; i++) {
        paraHeight += $(theChildren[i]).height()
    }
    return Math.floor(paraHeight / config.viewSize.height)
}


const insertColumn = (seasonNode, seasonsId, vWidth, vHeight, flowCounts) => {
    for (let i = 0; i < seasonNode.childNodes.length; i++) {
        const chapterNode = seasonNode.childNodes[i]
        if (chapterNode.nodeType == 1) {
            const tag = chapterNode.id
            const id = tag.match(/\d/)[0]
            chapterNode.innerHTML = createStr(id, chapterNode.innerHTML, vWidth, vHeight)
            flowCounts[seasonsId][id] = 0
        }
    }
}


/**
 * reutrn seasonIds
 * return chpaterIds
 * @param  {[type]} seasonId  [description]
 * @param  {[type]} chpaterId [description]
 * @return {[type]}           [description]
 */
export function getCounts(seasonId, chpaterId) {
    let seasonIds = flowCounts[seasonId]
    if (seasonIds) {
        if (seasonIds[chpaterId]) {
            return seasonIds[chpaterId]
        } else {
            let count = 0
            for(let key in seasonIds){
                count += seasonIds[key]
            }
            return count
        }
    } else {
        // console.log('getCounts失败')
    }
}


/**
 * 构建flow页面代码结构
 * @return {[type]} [description]
 */
export function initFlows() {

    const $container = $("#xut-stream-flow")
    const $seasons = $container.children()
    const vWidth = config.viewSize.width
    const vHeight = config.viewSize.height

    $seasons.each((index, node) => {
        const tag = node.id
        const seasonsId = tag.match(/\d/)[0]
        const $chapters = $seasons.children()
        flowCounts[seasonsId] = Object.create(null)
        insertColumn(node, seasonsId, vWidth, vHeight, flowCounts)
    })

    $container.css({
        width: vWidth,
        height: vHeight,
        overflow: 'hidden'
    }).show()

    $seasons.each((index, node) => {
        const tag = node.id
        const seasonsId = tag.match(/\d/)[0]
        const $chapters = $seasons.children()
        $chapters.each(function(index, node) {
            const tag = node.id
            const chpaterId = tag.match(/\d/)[0]
            let count = resolveCount($(node))
            flowCounts[seasonsId][chpaterId] = parseInt(count)
        })
    })

    $container.hide()

}
