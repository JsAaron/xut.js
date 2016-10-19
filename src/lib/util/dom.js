/**
 * 2015.3.24
 * 1 isBrowser
 * 2 isMobile
 * 3 isSurface
 */
const transitionEnd = Xut.style.transitionEnd

//2015.3.23
//可以点击与触摸
const isSurface = Xut.plat.isSurface
const hasTouch = Xut.plat.hasTouch

//触发事件名
const touchName = ['touchstart', 'touchmove', 'touchend', 'touchcancel', transitionEnd]
const mouseName = ['mousedown', 'mousemove', 'mouseup', 'mousecancel', transitionEnd]

//绑定事件名排序
const orderName = {
    start: 0,
    move: 1,
    end: 2,
    cancel: 3,
    transitionend: 4
}

const EVENT_NAME = (() => {
    if (isSurface) {
        return {
            touch: touchName,
            mouse: mouseName
        }
    }
    return hasTouch ? touchName : mouseName
})()


const eachApply = (events, callbacks, processor) => {
    _.each(callbacks, (hooks, key) => hooks && processor(events[orderName[key]], hooks))
}


/**
 * 合并事件绑定处理
 * 因为isSurface设备上
 * 要同时支持2种方式
 * @return {[type]} [description]
 */
const _on = (context, events, callbacks) => {
    eachApply(events, callbacks, (eventName, hook) => context.addEventListener(eventName, hook, false))
}

/**
 * 销毁事件绑定处理
 * 因为isSurface设备上
 * 要同时支持2种方式
 * @return {[type]} [description]
 */
const _off = (context, events, callbacks) => {
    eachApply(events, callbacks, (eventName, hook) => context.removeEventListener(eventName, hook, false))
}


/**
 * 多设备绑定
 * @param  {[type]}   processor    [处理器]
 * @param  {[type]}   eventContext [上下文]
 * @param  {Function} callback     [回调函数]
 * @return {[type]}                [description]
 */
const bind = (context, element, callbacks) => {
    //如果两者都支持
    //鼠标与触摸
    if (isSurface) {
        _.each(EVENT_NAME, events => {
            context(element, events, callbacks);
        })
    } else {
        context(element, EVENT_NAME, callbacks);
    }
}

/**
 * 合并事件绑定处理
 * 因为isSurface设备上
 * 要同时支持2种方式
 * bindTap(eventContext,{
 *     start   : start,
 *     move    : move,
 *     end     : end
 * })
 * @return {[type]} [description]
 */
export function $$on(element, callbacks) {
    bind(_on, element, callbacks)
}


/**
 * 移除tap事件
 * @param  {[type]} context [description]
 * @param  {[type]} opts    [description]
 * @return {[type]}         [description]
 */
export function $$off(element, callbacks) {
    bind(_off, element, callbacks)
}


/**
 * 如果是$$on绑定的，那么获取事件就可能是多点的
 * 所以需要$$hanle方法
 * @param  {[type]} callbacks [description]
 * @param  {[type]} context   [description]
 * @param  {[type]} event     [description]
 * @return {[type]}           [description]
 */
export function $$handle(callbacks, context, event) {
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
            callbacks.end && callbacks.end.call(context, event)
            break;
        case transitionEnd:
            callbacks.transitionend && callbacks.transitionend.call(context, event)
            break;
    }
}


export function $$target(event, original) {
    var currTouches = null;
    if (hasTouch) {
        currTouches = event.touches;
        if (currTouches && currTouches.length > 0) {
            event = currTouches[0];
        }
    }
    return original ? event : event.target;
}
