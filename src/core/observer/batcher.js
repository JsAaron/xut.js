/*
提供给auto运行动作的延时触发处理
需要注意快速翻页要立马清理，因为定时器在延后触发
 */
let queue = {}
let timer = null

/*
重设状态
 */
function resetBatcherState() {
  queue = {}
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

/*
  运行队列
 */
function runBatcherQueue() {
  for (let key in queue) {
    let watchers = queue[key]
    if (watchers.length) {
      let wather
      while (wather = watchers.shift()) {
        wather()
        wather = null
      }
    }
  }
}


/*
加入监控
 */
export function pushWatcher(pageIndex, watcher) {
  //如果存在了
  if (queue[pageIndex]) {
    queue[pageIndex].push(watcher)
  } else {
    //如果找不到
    //并且存在了上一个处理，清空
    if (Object.keys(queue).length) {
      resetBatcherState()
    }
    queue[pageIndex] = [watcher]
  }

  if (!timer) { //只第一次调用开始执行
    timer = setTimeout(() => {
      runBatcherQueue()
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
