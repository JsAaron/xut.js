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
 * create dom...
 */
const createStr = (chapterId, data, vWidth, vHeight, margin) => {

    const percentageTop = parseInt(margin[0])
    const percentageLeft = parseInt(margin[1])
    const percentageBottom = parseInt(margin[2])
    const percentageRight = parseInt(margin[3])

    const marginTop = vHeight / 100 * percentageTop
    const marginLeft = vWidth / 100 * percentageLeft
    const marginBottom = vHeight / 100 * percentageBottom
    const marginRight = vWidth / 100 * percentageRight

    const containerWidth = vWidth - marginLeft
    const containerHeight = vHeight - marginTop - marginBottom
    const containerLeft = marginLeft / 2
    const containerTop = marginTop
    const columnGap = `${COLUMNTAP}:${marginLeft}px`
    const columnWidth = `${COLUMNWIDTH}:${containerWidth}px`

    const container = `
            <section data-flow="true">
                <div data-role="margin" style="width:${containerWidth}px;height:${containerHeight}px;margin-top:${containerTop}px;margin-left:${containerLeft}px;">
                    <div data-role="column" id="columns-content" style="${columnWidth};height:100%;${columnGap}">
                        ${data}
                    </div>
                </div>
            </section>`

    return container
}


const resolveCount = ($content) => {
    const theChildren = $content.find('#columns-content').children()
    let paraHeight = 0
    for (let i = 0; i < theChildren.length; i++) {
        paraHeight += $(theChildren[i]).height()
    }
    return Math.ceil(paraHeight / config.viewSize.height)
}


const insertColumn = (seasonNode, seasonsId, vWidth, vHeight, flowCounts) => {
    for (let i = 0; i < seasonNode.childNodes.length; i++) {
        const chapterNode = seasonNode.childNodes[i]
        if (chapterNode.nodeType == 1) {
            const tag = chapterNode.id
            const id = tag.match(/\d/)[0]

            //传递的数据
            let margin = chapterNode.getAttribute('data-margin')
            if (margin) {
                margin = margin.split(",")
            } else {
                margin = [0, 0, 0, 0]
            }

            chapterNode.innerHTML = createStr(id, chapterNode.innerHTML, vWidth, vHeight, margin)
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
export function getCounts(seasonId, chapterId) {
    if (seasonId) {
        if (chapterId) {
            return flowCounts[seasonId] && flowCounts[seasonId][chapterId]
        } else {
            let seasonIds = flowCounts[seasonId]
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
 * 构建flow页面代码结构
 * @return {[type]} [description]
 */
export function initFlows() {

    const $container = $("#xut-stream-flow")

    if(!$container.length) return

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
