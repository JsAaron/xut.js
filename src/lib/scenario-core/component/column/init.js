import { config, resetVisualLayout } from '../../../config/index'
import { setCache } from './get'
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
const createStr = (chapterId, data, visualWidth, visualHeight, margin) => {

    const percentageTop = Number(margin[0])
    const percentageLeft = Number(margin[1])
    const percentageBottom = Number(margin[2])
    const percentageRight = Number(margin[3])

    //减去的宽度值
    const negativeWidth = visualWidth / 100 * (percentageLeft + percentageRight)

    //减去的高度值
    const negativeHeight = visualHeight / 100 * (percentageTop + percentageBottom)

    //容器宽度 = 宽度 - 左右距离比值
    const containerWidth = visualWidth - negativeWidth

    //容器高度值 = 宽度 - 上下距离比值
    const containerHeight = visualHeight - negativeHeight

    //容器左边偏移量
    const containerLeft = negativeWidth / 2

    //容器上偏移量
    const containerTop = visualHeight / 100 * percentageTop

    //重复加载杂志
    //不刷新的情况处理
    if(/fix-transform/.test(data)) {
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
    for(let i = 0; i < theChildren.length; i++) {
        paraHeight += $(theChildren[i]).height()
    }
    return Math.ceil(paraHeight / newViewHight)
}


const insertColumn = (seasonNode, seasonsId, vWidth, vHeight, columnCount) => {
    for(let i = 0; i < seasonNode.childNodes.length; i++) {
        let chapterNode = seasonNode.childNodes[i]
        if(chapterNode.nodeType == 1) {
            let tag = chapterNode.id
            let id = tag.match(/\d/)[0]

            //传递的数据
            let margin = chapterNode.getAttribute('data-margin')
            if(margin) {
                margin = margin.split(",")
            } else {
                margin = [0, 0, 0, 0]
            }
            chapterNode.innerHTML = createStr(id, chapterNode.innerHTML, vWidth, vHeight, margin)
            columnCount[seasonsId][id] = 0
        }
    }
}


/**
 * 构建column页面代码结构
 * @return {[type]} [description]
 */
export default function initColumn(callback) {

    let $container = $("#xut-stream-flow")
    let _initColumn = function() {

        //保证有子数据
        let $seasons = $container.children()
        if(!$seasons.length) {
            callback()
            return
        }

        //分栏数
        let columnCount = {}

        //容器尺寸设置
        let flowView = resetVisualLayout(1)
        let vWidth = flowView.width
        let vHeight = newViewHight = flowView.height

        $container.css({
            width: vWidth,
            height: vHeight,
            display: 'block'
        })

        $seasons.each((index, node) => {
            let tag = node.id
            let seasonsId = tag.match(/\d/)[0]
            let $chapters = $seasons.children()
            columnCount[seasonsId] = {}
            insertColumn(node, seasonsId, vWidth, vHeight, columnCount)
        })

        nextTick({
            container: $('body'),
            content: $container
        }, function() {
            $seasons.each((index, node) => {
                let tag = node.id
                let seasonsId = tag.match(/\d/)[0]
                let $chapters = $seasons.children()
                $chapters.each(function(index, node) {
                    let tag = node.id
                    let chapterId = tag.match(/\d+/)[0]
                    let count = resolveCount($(node))
                    columnCount[seasonsId][chapterId] = Number(count)
                })
            })
            $container.hide()
            setCache(columnCount)
            callback(Object.keys(columnCount).length)
        })

    }

    //删除存在的节点
    if($container.length) {
        $container.remove()
    }

    //如果存在json的flow数据
    let results = getResults()
    if(results && results.FlowData) {
        $container = $(results.FlowData)
        removeFlowData() //删除flowdata，优化缓存
        _initColumn()
    } else {
        //没有任何flow
        callback()
    }

}
