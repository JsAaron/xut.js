////////////////////////////////
/// 资源加载错误后，开始循环检测2次
/// 分别是6秒 - 12秒的时间
///////////////////////////////

/**
 * 循环的列表对象
 * @type {Array}
 */
let loopQueue = {}


/**
 * 增加循环列表
 * @param {[type]} argument [description]
 */
export function addLoop(filePath, detect) {
  if (loopQueue[filePath]) {
    Xut.$warn({
      type: 'preload',
      content: `重复增加,文件已经存在循环列表 ${filePath}`,
      level: 'error'
    })
  } else {
    /**
     * 重设循环检测
     * 不重新创建新的对象
     * 通过实例重设检测
     * 1 减少http检测
     * 2 不重复创建对象
     */
    loopQueue[filePath] = detect
    detect.reset(12000, function() {
      loopQueue[filePath].destory()
      loopQueue[filePath] = null
      delete loopQueue[filePath]
    })
  }
}

/**
 * 清理循环检测
 * @return {[type]} [description]
 */
export function clearLoop() {
  if (loopQueue) {
    for (let key in loopQueue) {
      loopQueue[key].destory()
      loopQueue[key] = null
    }
  }
  loopQueue = {}
}
