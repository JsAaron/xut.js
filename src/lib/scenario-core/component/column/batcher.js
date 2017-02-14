import config from './config'
import {
    warn,
    nextTick,
    devtools
} from './util/index'

var queue = []
var has = {}
var circular = {}
var waiting = false


function resetBatcherState() {
    queue.length = 0
    has = {}
    circular = {}
    waiting = false
}

function flushBatcherQueue() {
    runBatcherQueue(queue)
    if(queue.length) {
        return flushBatcherQueue()
    }
    if(devtools && config.devtools) {
        devtools.emit('flush')
    }
    resetBatcherState()
}

function runBatcherQueue(queue) {
    for(let i = 0; i < queue.length; i++) {
        var watcher = queue[i]
        var id = watcher.id
        has[id] = null
        watcher.run()
        if(process.env.NODE_ENV !== 'production' && has[id] != null) {
            circular[id] = (circular[id] || 0) + 1
            if(circular[id] > config._maxUpdateCount) {
                warn(
                    'You may have an infinite update loop for watcher ' +
                    'with expression "' + watcher.expression + '"',
                    watcher.vm
                )
                break
            }
        }
    }
    queue.length = 0
}

export function pushWatcher(watcher) {
    queue.push(watcher)
    if(!waiting) {
        waiting = true
        nextTick(flushBatcherQueue)
    }
}
