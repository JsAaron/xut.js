/////////////////
/// tap click
/////////////////

import {
  $$on,
  $$off
} from '../../../../util/dom'

/**
 * ie10下面mouse事件怪异
 * @return {Boolean} [description]
 */
var isIE10 = document.documentMode === 10;


/**
 * 针对canvas模式
 * 特殊的hack
 * 当前点击的元素是滑动元素
 * 处理元素的全局事件
 */
function setCanvasStart(supportSwipe) {
  Xut.Contents.Canvas.Reset()
  Xut.Contents.Canvas.SupportSwipe = supportSwipe;
  Xut.Contents.Canvas.isTap = true;
}

function setCanvasMove() {
  Xut.Contents.Canvas.isSwipe = true;
}


/**
 * 兼容事件对象
 * @return {[type]}   [description]
 */
function compatibilityEvent(e) {
  var point;
  if (e.touches && e.touches[0]) {
    point = e.touches[0];
  } else {
    point = e;
  }
  return point
}


/**
 * 如果是简单的点击事件
 */
export function simpleEvent(eventName, eventContext, eventHandle, supportSwipe) {

  //仅仅只是单击处理
  //IE10是不支持touch事件，直接绑定click事件
  const onlyClick = isIE10 || eventName === 'click'
  eventContext = eventContext[0]

  //是否触发
  let hasTap = false
    //开始坐标
  let startPageX

  hasTap = false;

  //这里单独绑定事件有个问题,单击move被触发
  //如果停止e.stopPropagation，那么默认行为就不会被触发
  //你绑定单击的情况下可以翻页
  //这里通过坐标的位置来判断
  const start = function(e) {
    let point = compatibilityEvent(e);
    //记录开始坐标
    startPageX = point.pageX;
    //是否是tap事件
    hasTap = true;
    setCanvasStart(supportSwipe);
  }

  const move = function(e) {
    if (!hasTap) {
      return
    }
    let point = compatibilityEvent(e)
    let deltaX = point.pageX - startPageX

    //如果有move事件，则取消tap事件
    if (Math.abs(deltaX)) {
      hasTap = false;
      setCanvasMove(supportSwipe);
    }
  }

  const end = function() {
    hasTap && eventHandle();
  }

  if (eventName === 'tap') {
    $$on(eventContext, {
      start: start,
      move: move,
      end: end,
      cancel: end
    })
  } else if (onlyClick) {
    hasTap = true;
    $$on(eventContext, {
      end: end
    })
  }

  return {
    off: function() {
      if (eventContext) {
        $$off(eventContext)
        eventContext = null;
      }
    }
  }
}
