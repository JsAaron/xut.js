/**
 * 图片预加载
 */

let list = []
let intervalId = null

/**
 * 用来执行队列
 * @return {[type]} [description]
 */
let tick = function () {
  var i = 0;
  for (; i < list.length; i++) {
    list[i].end ? list.splice(i--, 1) : list[i]();
  };
  !list.length && stop();
}


/**
 * 停止所有定时器队列
 * @return {[type]} [description]
 */
let stop = function () {
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
    console.log('loadFigure data有错误')
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


  // 如果图片被缓存，则直接返回缓存数据
  if (img.complete) {
    callback && callback.call(img, true, true);
    return img
  };

  let width = img.width
  let height = img.height

  let clear = function () {
    img = img.onload = img.onerror = null;
  }

  /**
   * 图片尺寸就绪
   * 判断图片是否已经被缓存了
   */
  let onready = function (hasCache) {
    let newWidth = img.width;
    let newHeight = img.height;
    // 如果图片已经在其他地方加载可使用面积检测
    if (newWidth !== width || newHeight !== height || newWidth * newHeight > 1024) {
      callback && callback(true, hasCache);
      onready.end = true;
      if (hasCache) {
        clear()
      }
      return true
    }
  }

  // 加载错误后的事件
  img.onerror = function () {
    onready.end = true;
    callback && callback(false);
    clear()
  };


  /**检测是不是已经缓存了*/
  if (onready(true)) {
    /*如果缓存存在，就跳过*/
    return
  }

  /*完全加载完毕的事件*/
  img.onload = function () {
    !onready.end && onready();
    callback && callback(true);
    clear()
  };

  // 加入队列中定期执行
  if (!onready.end) {
    list.push(onready);
    // 无论何时只允许出现一个定时器，减少浏览器性能损耗
    if (intervalId === null) intervalId = setInterval(tick, 40);
  };

  return img
}
