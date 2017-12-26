
/**
 * 2015.3.24
 * 1 isBrowser
 * 2 isMobile
 * 3 isMouseTouch
 */
const transitionEnd = Xut.style.transitionEnd

//2015.3.23
//可以点击与触摸
const isMouseTouch = Xut.plat.isMouseTouch
const hasTouch = Xut.plat.hasTouch


//触发事件名
const touchList = ['click', 'touchstart', 'touchmove', 'touchend', 'touchcancel', transitionEnd]
const mouseList = ['click', 'mousedown', 'mousemove', 'mouseup', 'mousecancel', transitionEnd, 'mouseleave']

//绑定事件名排序
const orderName = {
  click: 0,
  start: 1,
  move: 2,
  end: 3,
  cancel: 4,
  transitionend: 5,
  leave: 6
}

const eventNames = (() => {
  if (isMouseTouch) {
    return {
      touch: touchList,
      mouse: mouseList
    }
  }
  return hasTouch ? touchList : mouseList
})()


/**
 * 事件数据缓存
 * @type {Object}
 */
let eventDataCache = {}
let guid = 1

/**
 * 增加缓存句柄
 * @param {[type]} element   [description]
 * @param {[type]} eventName [description]
 * @param {[type]} handler   [description]
 */
function addHandler(element, eventName, handler, capture) {
  if (element.xutHandler) {
    let uuid = element.xutHandler
    let dataCache = eventDataCache[uuid]
    if (dataCache) {
      if (dataCache[eventName]) {
        //如果是isMouseTouch支持同样的事件
        //所以transitionend就比较特殊了，因为都是同一个事件名称
        //所以只要一份，所以重复绑定就需要去掉
        if (eventName !== 'transitionend') {
          Xut.$warn({
            type: 'event',
            content: eventName + '：事件重复绑定添加'
          })
        }
      } else {
        dataCache[eventName] = [handler, capture]
      }
    }
  } else {
    eventDataCache[guid] = {
      [eventName]: [handler, capture]
    }
    element.xutHandler = guid++
  }
}

const eachApply = (events, callbacks, processor, isRmove) => {
  _.each(callbacks, function(handler, key) {
    let eventName
    if (isRmove) {
      //如果是移除，callbacks是数组
      //转化事件名
      if (eventName = events[orderName[handler]]) {
        processor(eventName)
      }
    } else {
      eventName = events[orderName[key]];
      //on的情况，需要传递handler
      handler && eventName && processor(eventName, handler)
    }
  })
}

/**
 * 合并事件绑定处理
 * 因为isMouseTouch设备上
 * 要同时支持2种方式
 * @return {[type]} [description]
 */
const addEvent = (element, events, callbacks, capture) => {
  eachApply(events, callbacks, function(eventName, handler) {
    addHandler(element, eventName, handler, capture)
    element.addEventListener(eventName, handler, capture)
  })
}

/**
 * 移除所有事件
 * @param  {[type]} element [description]
 * @return {[type]}         [description]
 */
function removeAll(element) {
  let uuid = element.xutHandler
  let dataCache = eventDataCache[uuid]
  if (!dataCache) {

    Xut.$warn({
      type: 'event',
      content: '移除所有事件出错'
    })


    return
  }
  _.each(dataCache, function(data, eventName) {
    if (data) {
      element.removeEventListener(eventName, data[0], data[1])
      dataCache[eventName] = null
    }
  })
  delete eventDataCache[uuid]
}

/**
 * 移除指定的事件
 * @return {[type]} [description]
 */
function removeone(element, eventName) {
  let uuid = element.xutHandler
  let dataCache = eventDataCache[uuid]
  if (!dataCache) {
    Xut.$warn({
      type: 'event',
      content: '移除事件' + eventName + '出错'
    })
    return
  }
  let data = dataCache[eventName]
  if (data) {
    element.removeEventListener(eventName, data[0], data[1])
    dataCache[eventName] = null
    delete dataCache[eventName]
  } else {
    Xut.$warn({
      type: 'event',
      content: '移除事件' + eventName + '出错'
    })
  }

  //如果没有数据
  if (!Object.keys(dataCache).length) {
    delete eventDataCache[uuid]
  }
}

/**
 * 销毁事件绑定处理
 * 因为isMouseTouch设备上
 * 要同时支持2种方式
 * @return {[type]} [description]
 */
const removeEvent = (element, events, callbacks) => {
  eachApply(events, callbacks, function(eventName) {
    removeone(element, eventName)
  }, 'remove')
}


/**
 * 多设备绑定
 * @param  {[type]}   processor    [处理器]
 * @param  {[type]}   eventContext [上下文]
 * @param  {Function} callback     [回调函数]
 * @return {[type]}                [description]
 */
const compatibility = (controller, element, callbacks, capture) => {
  //如果两者都支持
  //鼠标与触摸
  if (isMouseTouch) {
    _.each(eventNames, events => {
      controller(element, events, callbacks, capture)
    })
  } else {
    controller(element, eventNames, callbacks, capture)
  }
}

/**
 * 变成节点对象
 * @param  {[type]} element [description]
 * @return {[type]}         [description]
 */
function toNodeObj(element) {
  if (element.length) {
    element = element[0]
  }
  return element
}

/**
 * 检测end事件，默认要绑定cancel
 * @return {[type]} [description]
 */
const checkBindCancel = function(callbacks) {
  if (callbacks && callbacks.end && !callbacks.cancel) {
    callbacks.cancel = callbacks.end
  }
}

/**
 * 合并事件绑定处理
 * 因为isMouseTouch设备上
 * 要同时支持2种方式
 * bindTap(eventContext,{
 *     start   : start,
 *     move    : move,
 *     end     : end
 * })
 * capture 默认是冒泡，提供捕获处理
 * @return {[type]} [description]
 */
export function $on(element, callbacks, capture = false) {
  checkBindCancel(callbacks)
  compatibility(addEvent, toNodeObj(element), callbacks, capture)
}


/**
 * 移除tap事件
 * @param  {[type]} context [description]
 * @param  {[type]} opts    [description]
 * @return {[type]}         [description]
 */
export function $off(element, callbacks) {

  if (!element) {
    Xut.$warn({
      type: 'event',
      content: '移除事件对象不存在'
    })
    return
  }

  element = toNodeObj(element)

  //全部移除
  if (arguments.length === 1) {
    removeAll(element)
    return
  }

  if (!_.isArray(callbacks)) {
    Xut.$warn({
      type: 'event',
      content: '移除的事件句柄参数，必须是数组'
    })
    return
  }

  checkBindCancel(callbacks)
  compatibility(removeEvent, element, callbacks)
}


/**
 * 如果是$on绑定的，那么获取事件就可能是多点的
 * 所以需要$hanle方法
 * @param  {[type]} callbacks [description]
 * @param  {[type]} context   [description]
 * @param  {[type]} event     [description]
 * @return {[type]}           [description]
 */
export function $handle(callbacks, context, event) {
  switch (event.type) {
    case 'touchstart':
    case 'mousedown':
      callbacks.start && callbacks.start.call(context, event)
      break;
    case 'touchmove':
    case 'mousemove':
      callbacks.move && callbacks.move.call(context, event)
      break;
    case 'touchend':
    case 'mouseup':
    case 'mousecancel':
    case 'touchcancel':
    case 'mouseleave':
      callbacks.end && callbacks.end.call(context, event)
      break;
    case 'transitionend':
    case 'webkitTransitionEnd':
    case 'oTransitionEnd':
    case 'MSTransitionEnd':
      callbacks.transitionend && callbacks.transitionend.call(context, event)
      break;
  }
}


export function $target(event, original) {
  var currTouches = null;
  if (hasTouch) {
    currTouches = event.touches;
    if (currTouches && currTouches.length > 0) {
      event = currTouches[0];
    }
  }
  return original ? event : event.target;
}


/**
 * 兼容事件对象
 * @return {[type]}   [description]
 */
export function $event(e) {
  return e.touches && e.touches[0] ? e.touches[0] : e
}
