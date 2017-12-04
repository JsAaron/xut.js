import { config, resetVisualLayout } from '../../config/index'
import { defAccess, nextTick, $warn, loadGlobalStyle } from '../../util/index'
import { getResults, removeColumnData } from 'database/result'
import { startColumnDetect, simulateCount, debug } from './detect'
import { addCache } from './api'

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
function createStr(chapterId, data, visualWidth, visualHeight, margin) {

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
  if (/section-transform/.test(data)) {
    data = $(data).find("#columns-content").html()
  }

  if (config.launch.scrollMode === 'v') {
    /*竖版的情况下，不需要分栏了，直接处理*/
    const columnGap = `${COLUMNTAP}:${negativeWidth}px`
    const columnWidth = `${COLUMNWIDTH}:${containerWidth}px`
    const container = `
            <section id="wrapper-section" class="section-transform" data-flow="true" style="width:${visualWidth-containerLeft}px;height:${visualHeight-containerTop}px;top:${containerTop}px;left:${containerLeft}px;">
                <div  id="scroller-section" class="page-flow-scale" data-role="margin" style="width:${containerWidth}px;height:auto;">
                      ${data}
                </div>
            </section>`
    newViewHight = visualHeight - containerTop
    return String.styleFormat(container)
  } else {
    /*配置分栏*/
    const columnGap = `${COLUMNTAP}:${negativeWidth}px`
    const columnWidth = `${COLUMNWIDTH}:${containerWidth}px`
    const container = `
            <section class="section-transform" data-flow="true">
                <div class="page-flow-scale" data-role="margin" style="width:${containerWidth}px;height:${containerHeight}px;margin-top:${containerTop}px;margin-left:${containerLeft}px;">
                    <div data-role="column" id="columns-content" style="${columnWidth};height:100%;${columnGap}">
                        ${data}
                    </div>
                </div>
            </section>`
    newViewHight = containerHeight
    return String.styleFormat(container)
  }
}


function insertColumn(seasonNode, seasonsId, visualWidth, visualHeight, columnData) {
  for (let i = 0; i < seasonNode.childNodes.length; i++) {
    let chapterNode = seasonNode.childNodes[i]
    if (chapterNode.nodeType == 1) {
      let tag = chapterNode.id
      if (tag) {
        let id = /\d+/.exec(tag)[0]
        if (id) {
          let margin = chapterNode.getAttribute('data-margin')
          if (margin) {
            margin = margin.split(",")
          } else {
            margin = [0, 0, 0, 0]
          }
          chapterNode.innerHTML = createStr(id, chapterNode.innerHTML, visualWidth, visualHeight, margin)
          columnData[seasonsId][id] = 0
        } else {
          $warn({
            type: 'column',
            content: 'insertColumn节点是空的'
          })
        }
      } else {
        $warn({
          type: 'column',
          content: 'insertColumn节点是空的'
        })
      }
    }
  }
}


function eachColumn(columnData, $seasons, visualWidth, visualHeight) {
  $seasons.each((index, node) => {
    let tag = node.id
    let seasonsId = tag.match(/\d/)[0]
    let $chapters = $seasons.children()
    columnData[seasonsId] = {}
    insertColumn(node, seasonsId, visualWidth, visualHeight, columnData)
  })
}


/**
 * 获取分栏数
 */
function getColumnCount(content, id) {
  let theChildren = $(content).find(id).children()
  let paraHeight = 0
  for (let i = 0; i < theChildren.length; i++) {
    paraHeight += Math.max(theChildren[i].scrollHeight, theChildren[i].clientHeight)
  }
  return Math.ceil(paraHeight / newViewHight)
}


/**
 * 获取分栏的数量与高度
 * 1 横版，数量
 * 2 竖版，高度
 */
export function getColumnData($seasons, callback) {
  $seasons.each((index, node) => {
    let tag = node.id
    let seasonsId = tag.match(/\d/)[0]
    let $chapters = $seasons.children()
    $chapters.each(function(index, node) {
      let tag = node.id
      if (tag) {
        let chapterId = tag.match(/\d+/)[0]
        let count
        if (config.launch.scrollMode === 'h') {
          count = getColumnCount(node, '#columns-content')
        } else if (config.launch.scrollMode === 'v') {
          count = getColumnCount(node, '#scroller-section')
        }
        callback(seasonsId, chapterId, count)
      }
    })
  })
}


/**
 * 构建column页面代码结构
 */
export function initColumn(callback) {

  let $container = $("#xut-stream-flow")
  if ($container.length) {
    $container.remove()
  }

  const setHeight = function($container, visualWidth, visualHeight) {
    $container.css({
      width: visualWidth,
      height: visualHeight,
      display: 'block'
    })
  }

  const setInit = function(visualWidth, visualHeight) {
    let $seasons = $container.children()
    if (!$seasons.length) {
      callback()
      return
    }

    /**
     * 记录分栏数据
     * columnData[seasonsId][chapterId] = {
     *     count,
     *     height
     * }
     * @type {Object}
     */
    let columnData = {}
    setHeight($container, visualWidth, visualHeight)
    eachColumn(columnData, $seasons, visualWidth, visualHeight)

    /**
     * 得到分栏的数据
     * 1 数量
     * 2 高度
     * 3 检测是否有丢失
     */
    setTimeout(() => {

      //第一次获取分栏数与高度 analysis
      getColumnData($seasons, (seasonsId, chapterId, count) => {
        if (debug && config.launch.columnCheck) {
          count = simulateCount
        }
        columnData[seasonsId][chapterId] = count
      })

      addCache(columnData);

      //检测分栏是否丢失，补充
      if (config.launch.columnCheck) {
        startColumnDetect($seasons, $.extend(true, {}, columnData), () => {
          $container.hide()
        })
      } else {
        $container.hide()
      }

      callback(Object.keys(columnData).length)
    }, 100)

    $('body').append($container)
  }

  //如果存在json的flow数据
  const results = getResults()
  if (results && results.FlowData) {
    //容器尺寸设置
    let visuals = resetVisualLayout(1)
    let visualHeight = newViewHight = visuals.height

    //加载flow样式
    loadGlobalStyle('xxtflow', function() {
      $container = $(results.FlowData)
      removeColumnData() //删除flowdata，优化缓存
      setInit(visuals.width, visualHeight)
    })

  } else {
    //没有任何flow
    callback()
  }

}
