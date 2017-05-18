/**
 * 当监听的节点内容发生变化时,触发指定的回调
 * @param opts {
 *   container:父容器,dom对象或jQuery对象
 *   content  :要加入父容器的内容,字符串或jQuery对象
 *   position :内容插入父容器的位置,'first' 表示在前加入,默认在末尾
 *   delay    :延时,默认0
 *   }
 * @version  1.02
 * @author [author] bjtqti
 * @return {[type]} [description]
 */

const DOC = document
const MutationObserver = window.MutationObserver ||
  window.WebKitMutationObserver ||
  window.MozMutationObserver;

const implementation = DOC.implementation.hasFeature("MutationEvents", "2.0")


/**
 * Defer a task to execute it asynchronously. Ideally this
 * should be executed as a microtask, so we leverage
 * MutationObserver if it's available, and fallback to
 * setTimeout(0).
 *
 * @param {Function} cb
 * @param {Object} ctx
 */
const _nextTick = (function() {
  var callbacks = []
  var pending = false
  var timerFunc

  function nextTickHandler() {
    pending = false
    var copies = callbacks.slice(0)
    callbacks = []
    for(var i = 0; i < copies.length; i++) {
      copies[i]()
    }
  }

  if(typeof MutationObserver !== 'undefined' && Xut.plat.supportMutationObserver) {
    var counter = 1
    var observer = new MutationObserver(nextTickHandler)
    var textNode = document.createTextNode(counter)
    observer.observe(textNode, {
      characterData: true
    })
    timerFunc = function() {
      counter = (counter + 1) % 2
      textNode.data = counter
    }
  } else {
    // webpack attempts to inject a shim for setImmediate
    // if it is used as a global, so we have to work around that to
    // avoid bundling unnecessary code.
    const context = Xut.plat.isBrowser ? window : typeof global !== 'undefined' ? global : {}
    timerFunc = context.setImmediate || setTimeout
  }
  return function(cb, ctx) {
    var func = ctx ? function() { cb.call(ctx) } : cb
    callbacks.push(func)
    if(pending) return
    pending = true
    timerFunc(nextTickHandler, 0)
  }
})()


const nextTick = function({
  container,
  content,
  position,
  delay = 0
}, callback, context) {

  //如果只提供一个回到函数
  if(arguments.length === 1 && typeof arguments[0] === 'function') {
    callback = arguments[0]
    if(typeof callback === 'function') {
      return _nextTick(callback)
    }
    console.log('nextTick: 参数提供错误');
    return
  }

  if(!container || !content) {
    return;
  }

  //检查容器---$(container) 转为dom对象
  if(container instanceof $) {
    container = container[0]
  }

  if(container.nodeType !== 1) {
    console.log('nextTick: container must be HTMLLIElement ');
    return;
  }

  let animatId = 'T' + (Math.random() * 10000 << 1)
  let tick = DOC.createElement('input')

  //标记任务
  tick.setAttribute('value', animatId);

  //检查内容
  if(typeof content === 'string') {
    let temp = $(content);
    if(!temp[0]) {
      //纯文本内容
      temp = DOC.createTextNode(content);
      temp = $(temp);
    }
    content = temp
    temp = null
  }

  /**
   * 完成任务后处理&Observer
   * @return {[type]} [description]
   */
  const _completeTask = () => {
    container.removeChild(tick);
    callback.call(context)
    container = null
    tick = null
    context = null
  }

  /**
   * 将内容加入父容器
   * @return {[type]} [description]
   */
  const _appendChild = () => {
    //拼接内容
    let frag = DOC.createDocumentFragment()
    let len = content.length;
    for(let i = 0; i < len; i++) {
      frag.appendChild(content[i]);
    }
    frag.appendChild(tick)

    //判断插入的位置
    if(position === 'first') {
      container.insertBefore(frag, container.firstChild);
    } else {
      container.appendChild(frag);
    }

    frag = null

    //触发变动事件
    tick.setAttribute('value', animatId);

  }

  if(MutationObserver) {
    let observer = new MutationObserver(mutations => {
      mutations.forEach(record => {
        if(record.oldValue === animatId) {
          _completeTask()
          observer = null
        }
      });
    });

    //设置要监听的属性
    observer.observe(tick, {
      attributes: true,
      //childList: true,
      attributeOldValue: true,
      attributeFilter: ["value"] //只监听value属性,提高性能
    });

    _appendChild();

  } else {


    //检测是否支持DOM变动事件
    if(implementation) {

      /**
       * 完成任务后处理&Event
       * @param  {[type]} event [description]
       * @return {[type]}       [description]
       */
      const _finishTask = (event) => {
        if(event.target.value === animatId) {
          //container.removeEventListener('DOMNodeRemoved',_finishTask,false);
          container.removeEventListener('DOMNodeInserted', _finishTask, false);
          callback.call(context);
        }
      }

      //container.addEventListener('DOMNodeRemoved',_finishTask,false);
      container.addEventListener('DOMNodeInserted', _finishTask, false);
      _appendChild();
      container.removeChild(tick);
    } else {
      //歉容Android2.xx处理
      _appendChild();
      setTimeout(function() {
        _completeTask();
      }, delay);
    }
  }
}

Xut.nextTick = nextTick

export { nextTick }