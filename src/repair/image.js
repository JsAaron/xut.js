////////////////////////////////////////////
///
/// 修复采用img的图片错误问题
///   修复错误的图片加载
///   图片错误了，会先隐藏，然后再去请求一次
///   如果还是错误，就抛弃，正确就显示出来
///   queue:{
///     chpaerId:[1.png,2.png,3.png]
///     ................
///   }
///   特别注意，这里是动态加入的
///   所以，有可能是边解析边加入新的
///
///////////////////////////////////////////

import { loadFigure } from 'core/util/loader/image'

let queue = {}
let waiting = false


/**
 * 检测一个chpater中的图片加载是否完成
 * @param  {[type]} chapterIndex [description]
 * @return {[type]}              [description]
 */
function checkFigure(chapterIndex, callback) {
  let length = queue[chapterIndex].length

  if (!length) {
    callback()
    return
  }

  let count = length
  let complete = function() {
    if (count === 1) {
      callback()
      return
    }
    --count
  }

  let data
  while (data = queue[chapterIndex].shift()) {
    data(complete)
  }

}

/*
  运行队列
  1.因为queue的对象结构通过chapterId做页面的标记，保存所有每个页面图片的索引
  2.在这个chapter去检测图片的时候，如果成功了就处理图片显示，然后要删除这个检测的fn
  3.因为是动态加入的，所以每个chapter检测完毕后，还要根据列表是否有值，在去处理
  4.最后通过runBatcherQueue在递归一次检测，最终每个chapter是否都处理完毕了
 */
function runBatcherQueue() {
  let keys = Object.keys(queue)
  if (keys.length) {
    const chapterIndex = keys.shift()
    if (chapterIndex.length) {
      checkFigure(chapterIndex, function() {
        /*如果列表没有数据了*/
        if (!queue[chapterIndex].length) {
          delete queue[chapterIndex]
        }
        /*如果列表还有后续新加入的继续修复当前这个列表*/
        runBatcherQueue()
      })
    } else {
      delete queue[chapterIndex]
    }
  } else {
    waiting = false
  }
}


/**
 * 修复错误的图片加载
 * @return {[type]} [description]
 */
export function repairImage(node, chapterIndex, src) {

  if (!node) {
    return
  }
  /*先隐藏错误节点*/
  node.style.display = "none";

  /*根据页面chpater加入列表*/
  if (!queue[chapterIndex]) {
    queue[chapterIndex] = []
  }

  /*做一次错误节点的预加载处理*/
  queue[chapterIndex].push(function(callback) {
    loadFigure(src, function(data) {
      /*如果请求成功，修改图片状态*/
      if (data.state === 'success') {
        if (node && node.style) {
          node.style.display = "block";
        }
      }
      node = null
      callback()
    })
  })

  if (!waiting) {
    waiting = true
    runBatcherQueue()
  }
}


/**
 * 清理错误检测的图片
 * @return {[type]} [description]
 */
export function clearRepairImage(chapterIndex) {
  if (queue && queue[chapterIndex]) {
    queue[chapterIndex].length = 0
    delete queue[chapterIndex]
  }
}
