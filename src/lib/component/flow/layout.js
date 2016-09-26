import { config } from '../../config/index'
import {set } from './get'
import { getFlowView } from '../../visuals/expand/api.config'

const COLUMNWIDTH = Xut.style.columnWidth
const COLUMNTAP = Xut.style.columnGap

/**
 * 高度marginTop - marginBottom处理了
 * 不一定等于设备高度
 * @type {Number}
 */
let newViewHight = 0

/**
 * create dom...
 */
const createStr = (chapterId, data, viewWidth, viewHeight, margin) => {

    const percentageTop = Number(margin[0])
    const percentageLeft = Number(margin[1])
    const percentageBottom = Number(margin[2])
    const percentageRight = Number(margin[3])

    //减去的宽度值
    const negativeWidth = viewWidth / 100 * (percentageLeft + percentageRight)
        //减去的高度值
    const negativeHeight = viewHeight / 100 * (percentageTop + percentageBottom)

    //容器宽度 = 宽度 - 左右距离比值
    const containerWidth = viewWidth - negativeWidth
        //容器高度值 = 宽度 - 上下距离比值
    const containerHeight = viewHeight - negativeHeight
        //容器左边偏移量
    const containerLeft = negativeWidth / 2
        //容器上偏移量
    const containerTop = viewHeight / 100 * percentageTop

    const columnGap = `${COLUMNTAP}:${negativeWidth}px`
    const columnWidth = `${COLUMNWIDTH}:${containerWidth}px`
    const container = `
            <section data-flow="true">
                <div data-role="margin" style="width:${containerWidth}px;height:${containerHeight}px;margin-top:${containerTop}px;margin-left:${containerLeft}px;">
                    <div data-role="column" id="columns-content" style="${columnWidth};height:100%;${columnGap}">
                        ${data}
                    </div>
                </div>
            </section>`

    newViewHight = containerHeight

    return container
}


const resolveCount = ($content) => {
    const theChildren = $content.find('#columns-content').children()
    let paraHeight = 0
    for (let i = 0; i < theChildren.length; i++) {
        paraHeight += $(theChildren[i]).height()
    }
    return Math.ceil(paraHeight / newViewHight)
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
 * 构建flow页面代码结构
 * @return {[type]} [description]
 */
export default function initFlows() {

    const $container = $("#xut-stream-flow")
    if (!$container.length) return
    const $seasons = $container.children()
    if (!$seasons.length) return

    /**
     * seasonId:{
     *    chpaterID:count
     * }
     * @type {[type]}
     */
    let flowCounts = Object.create(null)

    /**
     * 容器尺寸设置
     * @type {[type]}
     */
    const flowView = getFlowView()

    const vWidth = flowView.viewWidth
    const vHeight = newViewHight = flowView.viewHeight

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

    set(flowCounts)
}
