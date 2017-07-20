import { config } from '../../config/index'
import { resetColumnCount } from './api'
import { getColumnData } from './init'


/**
 * debug调试
 */
export let debug = false
export let simulateCount = 2

/**
 * 模拟检测次数
 */
const simulateTimer = 13

/**
 * 检测引用
 */
let timerId = null

/**
 * 基本检测次数 20*500 ~ 10秒范围
 */
let baseCheckCount = 20


/**
 * 分栏探测
 */
const makeDelay = function (seasonsId, chapterId, count) {
  return function () {
    resetColumnCount(seasonsId, chapterId, count)
  }
}

const execDelay = function (tempDelay) {
  if (tempDelay.length) {
    let fn
    while (fn = tempDelay.pop()) {
      fn()
    }
    Xut.Application.Notify('change:number:total')
    Xut.Application.Notify('change:column')
  }
}


/**
 * 检测分栏数
 */
function detectColumn($seasons, columnCollection, callback, checkCount) {
  let tempDelay = []

  getColumnData($seasons, (seasonsId, chapterId, count) => {
    if (debug && checkCount > simulateTimer) {
      count = simulateCount
    }
    //假如高度改变
    if (columnCollection[seasonsId][chapterId] !== count) {
      columnCollection[seasonsId][chapterId] = count
      tempDelay.push(makeDelay(seasonsId, chapterId, count))
    }
  })

  --checkCount

  //执行监控改变
  tempDelay.length && execDelay(tempDelay)

  if (checkCount) {
    timerId = setTimeout(function () {
      detectColumn($seasons, columnCollection, callback, checkCount)
    }, 500)
  } else {
    //如果探测完毕就强制关闭检测了
    config.launch.columnCheck = false
    clearColumnDetection()
    callback()
  }
}


/**
 * 开始分栏探测
 */
export function startColumnDetect($seasons, columnCollection, callback) {
  detectColumn($seasons, columnCollection, callback, baseCheckCount)
}


/**
 * 停止分栏高度探测
 */
export function clearColumnDetection() {
  Xut.Application.unWatch('change:number:total change:column')
  clearTimeout(timerId)
  timerId = null
}
