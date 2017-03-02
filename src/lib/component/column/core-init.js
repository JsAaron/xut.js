import {
  config,
  resetVisualLayout
} from '../../config/index'
import {
  defAccess,
  nextTick,
  $$warn,
  loadStyle
} from '../../util/index'
import {
  getResults,
  removeColumnData
} from '../../database/result'

//分栏探测
import {
  startColumnDetect,
  simulateCount,
  debug
} from './detect'
import {
  setCache
} from './depend'

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
  if (/section-transform/.test(data)) {
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
          columnCount[seasonsId][id] = 0
        }else{
          $$warn('node tag is null on insertColumn')
        }
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
  for (let i = 0; i < theChildren.length; i++) {
    paraHeight += Math.max(theChildren[i].scrollHeight, theChildren[i].clientHeight)
  }
  // $("#test123").append('<a>' + paraHeight + '</a>，')
  return Math.ceil(paraHeight / newViewHight)
}


/**
 * 获取分栏数量
 */
export function resolveColumnCount($seasons, callback) {
  $seasons.each((index, node) => {
    let tag = node.id
    let seasonsId = tag.match(/\d/)[0]
    let $chapters = $seasons.children()
    $chapters.each(function(index, node) {
      let tag = node.id
      if (tag) {
        let chapterId = tag.match(/\d+/)[0]
        let count = resolveCount($(node))
        callback(seasonsId, chapterId, Number(count))
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

  const init = function(visualWidth, visualHeight) {
    let $seasons = $container.children()
    if (!$seasons.length) {
      callback()
      return
    }

    let columnCount = {} //分栏记录
    setHeight($container, visualWidth, visualHeight)
    eachColumn(columnCount, $seasons, visualWidth, visualHeight)
    $('body').append($container)

    setTimeout(() => {

      //第一次获取分栏数
      resolveColumnCount($seasons, (seasonsId, chapterId, count) => {
        if (debug && config.columnCheck) {
          count = simulateCount
        }
        columnCount[seasonsId][chapterId] = count
      })

      setCache(columnCount)

      //检测分栏数变化
      if (config.columnCheck) {
        startColumnDetect($seasons, $.extend(true, {}, columnCount), () => {
          $container.hide()
        })
      } else {
        $container.hide()
      }

      callback(Object.keys(columnCount).length)
    }, 100)
  }

  //如果存在json的flow数据
  const results = getResults()
  if (results && results.FlowData) {
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
