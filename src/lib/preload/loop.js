////////////////////////////////
/// 资源加载错误后，开始循环检测2次
/// 分别是6秒 - 12秒的时间
///////////////////////////////
import { $warn } from '../util/index'
import { Detect } from './detect'

/**
 * 循环的列表对象
 * @type {Array}
 */
let loopList = {}

/**
 * 增加循环列表
 * @param {[type]} argument [description]
 */
export function addLoop(filePath, parser) {
  if (loopList[filePath]) {
    $warn(`错误循环的文件已经存在检测列表 ${filePath}`)
  } else {
    loopList[filePath] = new Detect({
      parser,
      filePath,
      checkTime: 12000
    })
    loopList[filePath].start(function () {
      delete loopList[filePath]
    })
  }
}

/**
 * 清理循环检测
 * @return {[type]} [description]
 */
export function clearLoop() {
  if (loopList) {
    for (let key in loopList) {
      loopList[key].destory()
      loopList[key] = null
    }
  }
  loopList = {}
}
