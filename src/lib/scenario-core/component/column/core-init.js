import { config, resetVisualLayout } from '../../../config/index'
import {
    setCache,
    getChpaterColumn,
    setChpaterColumn
} from './depend'
import {
    defAccess,
    nextTick,
    $$warn,
    loadStyle
} from '../../../util/index'
import {
    getResults,
    removeColumnData
} from '../../../database/result'


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
    if(/section-transform/.test(data)) {
        data = $(data).find("#columns-content").html()
    }

    const columnGap = `${COLUMNTAP}:${negativeWidth}px`
    const columnWidth = `${COLUMNWIDTH}:${containerWidth}px`
    const container = `
            <section class="section-transform" data-flow="true">
                <div class="page-flow-pinch" data-role="margin" style="width:${containerWidth}px;height:${containerHeight}px;margin-top:${containerTop}px;margin-left:${containerLeft}px;">
                    <div data-role="column" id="columns-content" style="${columnWidth};height:100%;${columnGap}">
                        ${data}
                    </div>
                </div>
            </section>`

    newViewHight = containerHeight

    return String.styleFormat(container)
}


const insertColumn = (seasonNode, seasonsId, visualWidth, visualHeight, columnCount) => {
    for(let i = 0; i < seasonNode.childNodes.length; i++) {
        let chapterNode = seasonNode.childNodes[i]
        if(chapterNode.nodeType == 1) {
            let tag = chapterNode.id
            if(tag) {
                let id = /\d/.exec(tag)[0]
                let margin = chapterNode.getAttribute('data-margin')
                if(margin) {
                    margin = margin.split(",")
                } else {
                    margin = [0, 0, 0, 0]
                }
                chapterNode.innerHTML = createStr(id, chapterNode.innerHTML, visualWidth, visualHeight, margin)
                columnCount[seasonsId][id] = 0
            } else {
                $$warn('node tag is null on insertColumn')
            }
        }
    }
}


const eachColumn = function(columnCount, $seasons, visualWidth, visualHeight) {
    $seasons.each((index, node) => {
        let tag = node.id
        let seasonsId = tag.match(/\d/)[0]
        let $chapters = $seasons.children()
        columnCount[seasonsId] = {}
        insertColumn(node, seasonsId, visualWidth, visualHeight, columnCount)
    })
}

/**
 * 解析分栏高度
 */
const resolveCount = ($content) => {
    let theChildren = $content.find('#columns-content').children()
    let paraHeight = 0
    for(let i = 0; i < theChildren.length; i++) {
        paraHeight += Math.max(theChildren[i].scrollHeight, theChildren[i].clientHeight)
    }
    // $("#test123").append('<a>' + paraHeight + '</a>，')
    return Math.ceil(paraHeight / newViewHight)
}

/**
 * 获取分栏数量
 */
const getColumnCount = function($seasons, callback) {
    $seasons.each((index, node) => {
        let tag = node.id
        let seasonsId = tag.match(/\d/)[0]
        let $chapters = $seasons.children()
        $chapters.each(function(index, node) {
            let tag = node.id
            if(tag) {
                let chapterId = tag.match(/\d+/)[0]
                let count = resolveCount($(node))
                callback(seasonsId, chapterId, Number(count))
            }
        })
    })
}



const makeDelay = function(seasonsId, chapterId, count) {
    return function() {
        setChpaterColumn(seasonsId, chapterId, count)
    }
}

const execDelay = function(tempDelay) {
    if(tempDelay.length) {
        let fn
        while(fn = tempDelay.pop()) {
            fn()
        }
        Xut.Application.Notify('change:number:total')
        Xut.Application.Notify('change:column')
    }
}

/**
 * debug调试
 */
let debug = false
let simulateCount = 2
let simulateTimer = 13

/**
 * 检测分栏高度
 */
let timerId = null
//基本检测次数 20*500 ~ 10秒范围
let baseCount = 20

export function checkColumnHeight($seasons, columnCollection, checkCount, callback) {

    let tempDelay = []

    getColumnCount($seasons, (seasonsId, chapterId, count) => {
        if(debug && checkCount > simulateTimer) {
            count = simulateCount
        }
        //假如高度改变
        if(columnCollection[seasonsId][chapterId] !== count) {
            columnCollection[seasonsId][chapterId] = count
            tempDelay.push(makeDelay(seasonsId, chapterId, count))
        }
    })

    --checkCount

    //执行监控改变
    execDelay(tempDelay)

    if(checkCount) {
        timerId = setTimeout(function() {
            checkColumnHeight($seasons, columnCollection, checkCount, callback)
        }, 500)
    } else {
        callback()
    }
    return
}

/**
 * 停止分栏高度探测
 * @return {[type]} [description]
 */
export function stopDetection() {
    Xut.Application.unWatch('change:number:total change:column')
    clearTimeout(timerId)
    timerId = null
}

/**
 * 构建column页面代码结构
 * @return {[type]} [description]
 */
export function initColumn(callback) {

    let $container = $("#xut-stream-flow")
    if($container.length) {
        $container.remove()
    }

    const setHeight = function($container, visualWidth, visualHeight) {
        $container.css({
            width: visualWidth,
            height: visualHeight,
            display: 'block'
        })
    }

    const init = function(visualWidth, visualHeight) {
        let $seasons = $container.children()
        if(!$seasons.length) {
            callback()
            return
        }

        let columnCount = {} //分栏记录
        setHeight($container, visualWidth, visualHeight)
        eachColumn(columnCount, $seasons, visualWidth, visualHeight)
        $('body').append($container)

        setTimeout(() => {

            //第一次获取分栏数
            getColumnCount($seasons, (seasonsId, chapterId, count) => {
                if(debug && config.columnCheck) {
                    count = simulateCount
                }
                columnCount[seasonsId][chapterId] = count
            })

            setCache(columnCount)

            //检测分栏数变化
            if(config.columnCheck) {
                checkColumnHeight($seasons, $.extend(true, {}, columnCount), baseCount, () => {
                    $container.hide()
                })
            } else {
                $container.hide()
            }

            callback(Object.keys(columnCount).length)
        },100)
    }

    //如果存在json的flow数据
    const results = getResults()
    if(results && results.FlowData) {
        //容器尺寸设置
        let visuals = resetVisualLayout(1)
        let visualHeight = newViewHight = visuals.height

        //加载flow样式
        loadStyle('xxtflow', function() {
            $container = $(results.FlowData)
            removeColumnData() //删除flowdata，优化缓存
            init(visuals.width, visualHeight)
        })

    } else {
        //没有任何flow
        callback()
    }

}
