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
const touchList = ['touchstart', 'touchmove', 'touchend', 'touchcancel', transitionEnd]
const mouseList = ['mousedown', 'mousemove', 'mouseup', 'mousecancel', transitionEnd, 'mouseleave']

//绑定事件名排序
const orderName = {
    start: 0,
    move: 1,
    end: 2,
    cancel: 3,
    transitionend: 4,
    leave: 5
}

const eventNames = (() => {
    if (isSurface) {
        return {
            touch: touchList,
            mouse: mouseList
        }
    }
    return hasTouch ? touchList : mouseList
})()


const eachApply = (events, callbacks, processor) => {
    _.each(callbacks, function(hooks, key) {
        hooks && processor(events[orderName[key]], hooks)
    })
}


/**
 * 合并事件绑定处理
 * 因为isSurface设备上
 * 要同时支持2种方式
 * @return {[type]} [description]
 */
const addEvent = (context, events, callbacks) => {
    eachApply(events, callbacks, function(eventName, hook) {
        context.addEventListener(eventName, hook, false)
    })
}

/**
 * 销毁事件绑定处理
 * 因为isSurface设备上
 * 要同时支持2种方式
 * @return {[type]} [description]
 */
const removeEvent = (context, events, callbacks) => {
    eachApply(events, callbacks, function(eventName, hook) {
        context.removeEventListener(eventName, hook, false)
    })
}


/**
 * 多设备绑定
 * @param  {[type]}   processor    [处理器]
 * @param  {[type]}   eventContext [上下文]
 * @param  {Function} callback     [回调函数]
 * @return {[type]}                [description]
 */
const compatibility = (apply, element, callbacks) => {
    //如果两者都支持
    //鼠标与触摸
    if (isSurface) {
        _.each(eventNames, events => {
            apply(element, events, callbacks)
        })
    } else {
        apply(element, eventNames, callbacks)
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
    compatibility(addEvent, element, callbacks)
}


/**
 * 移除tap事件
 * @param  {[type]} context [description]
 * @param  {[type]} opts    [description]
 * @return {[type]}         [description]
 */
export function $$off(element, callbacks) {
    compatibility(removeEvent, element, callbacks)
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
        case 'mouseleave':
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
