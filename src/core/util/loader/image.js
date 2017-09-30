import { $warn } from '../debug/index'

/**
 * 图片预加载
 */

let list = []
let intervalId = null

/**
 * 用来执行队列
 * @return {[type]} [description]
 */
let tick = function() {
  var i = 0;
  for (; i < list.length; i++) {
    if (list[i].end) {
      //如果执行完毕了，就不处理
      list.splice(i--, 1)
    } else {
      //否则执行检测一次
      list[i]();
    }
  };
  if (!list.length) {
    stop();
  }
}


/**
 * 停止所有定时器队列
 * @return {[type]} [description]
 */
let stop = function() {
  clearInterval(intervalId);
  intervalId = null;
}

/**
 * callback(1,2)
 * 1 图片加载状态 success / fail   true/false
 * 2 图片是否被缓存 hasCache       ture/false
 */
export function loadFigure(data, callback) {

  if (!data) {
    $warn('util', 'loadFigure data有错误')
    callback && callback()
    return
  }

  let img
  if (typeof data === 'string') {
    img = new Image();
    img.src = data;
  } else {
    /*如果传递了图片对象*/
    img = data.image
    img.src = data.url
  }

  let width = img.width
  let height = img.height

  function clear() {
    img = img.onload = img.onerror = null;
  }

  // 如果图片被缓存，则直接返回缓存数据
  if (img.complete) {
    //加载成功，并且有缓存
    callback && callback({
      state: 'success',
      cache: true
    });
    //返回缓存的，不清理
    return img
  };


  /**
   * 图片尺寸就绪
   * 判断图片是否已经被缓存了
   */
  function onReady() {
    //通过onload与onerror提前完成了
    if (onReady.end) {
      return
    }
    let newWidth = img.width;
    let newHeight = img.height;
    // 如果图片已经在其他地方加载可使用面积检测
    if (newWidth !== width || newHeight !== height || newWidth * newHeight > 1024) {
      //标记完成了
      onReady.end = true
      callback && callback({
        state: 'success',
        cache: true
      });
      clear()
    }
  }

  // 加载错误后的事件
  img.onerror = function() {
    if (onReady.end) {
      return
    }
    onReady.end = true //标记完成
    callback && callback({ state: 'fail' })
    clear()
  }

  //完全加载完毕的事件
  img.onload = function() {
    if (onReady.end) {
      return
    }
    onReady.end = true //标记完成
    callback && callback({ state: 'success' })
    clear()
  }

  //检测是不是已经缓存了
  //如果缓存存在，就跳过
  if (onReady()) {
    return
  }

  //加入队列中定期执行
  // if (!onReady.end) {
  //   list.push(onReady);
  //   // 无论何时只允许出现一个定时器，减少浏览器性能损耗
  //   if (intervalId === null) {
  //     intervalId = setInterval(tick, 40);
  //   }
  // };

  return img
}
