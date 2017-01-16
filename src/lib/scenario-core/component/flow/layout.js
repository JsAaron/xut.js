import { config } from '../../../config/index'
import {set } from './get'
import { getFlowView } from '../../../visuals/hooks/adapter'
import { getResults, removeFlowData } from '../../../database/result'
import { nextTick } from '../../../util/nexttick'

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

    //重复加载杂志
    //不刷新的情况处理
    if (/fix-transform/.test(data)) {
        data = $(data).find("#columns-content").html()
    }

    const columnGap = `${COLUMNTAP}:${negativeWidth}px`
    const columnWidth = `${COLUMNWIDTH}:${containerWidth}px`
    const container = `
            <section class="fix-transform" data-flow="true">
                <div class="page-flow-pinch" data-role="margin" style="width:${containerWidth}px;height:${containerHeight}px;margin-top:${containerTop}px;margin-left:${containerLeft}px;">
                    <div data-role="column" id="columns-content" style="${columnWidth};height:100%;${columnGap}">
                        ${data}
                    </div>
                </div>
            </section>`

    newViewHight = containerHeight

    return String.styleFormat(container)
}


const resolveCount = ($content) => {
    let theChildren = $content.find('#columns-content').children()
    let paraHeight = 0
    for (let i = 0; i < theChildren.length; i++) {
        paraHeight += $(theChildren[i]).height()
    }
    return Math.ceil(paraHeight / newViewHight)
}


const insertColumn = (seasonNode, seasonsId, vWidth, vHeight, flowCounts) => {
    for (let i = 0; i < seasonNode.childNodes.length; i++) {
        let chapterNode = seasonNode.childNodes[i]
        if (chapterNode.nodeType == 1) {
            let tag = chapterNode.id
            let id = tag.match(/\d/)[0]

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
export default function initFlows(callback) {

    let $container = $("#xut-stream-flow")

    /**
     * 初始化flow数据
     * @param  {[type]} initFlow [description]
     * @return {[type]}          [description]
     */
    let initFlow = function() {

        //保证有子数据
        let $seasons = $container.children()
        if (!$seasons.length) {
            callback()
            return
        }

        let flowCounts = {}

        //容器尺寸设置
        let flowView = getFlowView()
        let vWidth = flowView.viewWidth
        let vHeight = newViewHight = flowView.viewHeight

        $container.css({
            width: vWidth,
            height: vHeight,
            display: 'block'
        })

        $seasons.each((index, node) => {
            let tag = node.id
            let seasonsId = tag.match(/\d/)[0]
            let $chapters = $seasons.children()
            flowCounts[seasonsId] = {}
            insertColumn(node, seasonsId, vWidth, vHeight, flowCounts)
        })

        $('body').append($container)

        setTimeout(function() {
            $seasons.each((index, node) => {
                let tag = node.id
                let seasonsId = tag.match(/\d/)[0]
                let $chapters = $seasons.children()
                $chapters.each(function(index, node) {
                    let tag = node.id
                    let chapterId = tag.match(/\d+/)[0]
                    let count = resolveCount($(node))
                    flowCounts[seasonsId][chapterId] = Number(count)
                })
            })
            $container.hide()
            set(flowCounts)
            callback(Object.keys(flowCounts).length)
        }, 100)
    }

    //删除存在的节点
    if ($container.length) {
        $container.remove()
    }

    //如果存在json的flow数据
    let results = getResults()
    if (results && results.FlowData) {
        $container = $(results.FlowData)
        removeFlowData() //删除flowdata，优化缓存
        initFlow()
    } else {
        //没有任何flow
        callback()
    }

}
