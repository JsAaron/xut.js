/*
提供给auto运行动作的延时触发处理
需要注意快速翻页要立马清理，因为定时器在延后触发
 */

let queue = []
let timer = null

/*
重设状态
 */
function resetBatcherState() {
  queue.length = 0
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
 */
export function pushWatcher(type, watcher) {
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
