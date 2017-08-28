/*
提供给auto运行动作的延时触发处理
需要注意快速翻页要立马清理，因为定时器在延后触发
 */

let preIndex = undefined //上一个页码索引标记
let queue = []
let timer = null

/*
重设状态
 */
function resetBatcherState() {
  queue.length = 0
  preIndex = undefined
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

/*
  运行队列
 */
function runBatcherQueue(queue) {
  for (let i = 0; i < queue.length; i++) {
    let watcher = queue[i]
    if (watcher) {
      watcher()
    }
  }
  queue.length = 0
}


/*
加入监控
preIndex 的加入非常有必要
1 多场景在跳转的时候，由于自动动画会延时导致了还会调用上一个场景的自动运行动画
 */
export function pushWatcher(pageIndex, watcher) {

  //如果preIndex有值，
  //先比较这个值是不是一样
  //如果不是一样就需要清理
  if (preIndex !== undefined) {
    //如果是新的一页,新清理，然后重新处理
    if (preIndex != pageIndex) {
      clearWatcher()
    }
  }

  preIndex = pageIndex
  queue.push(watcher) //加入队列
  if (!timer) { //只第一次调用开始执行
    timer = setTimeout(() => {
      runBatcherQueue(queue)
      resetBatcherState()
    }, 500)
  }
}

/*
清理
 */
export function clearWatcher() {
  resetBatcherState()
}
