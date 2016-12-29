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
export function simpleEvent(eventContext, eventHandle, supportSwipe) {

    eventContext.isTap = false;

    //这里单独绑定事件有个问题,单击move被触发
    //如果停止e.stopPropagation，那么默认行为就不会被触发
    //你绑定单击的情况下可以翻页
    //这里通过坐标的位置来判断
    var start = function(e) {
        var point = compatibilityEvent(e);
        //记录开始坐标
        eventContext.pageX = point.pageX;
        //是否是tap事件
        eventContext.isTap = true;
        setCanvasStart(supportSwipe);
    }

    var move = function(e) {
        if (!eventContext.isTap) {
            return
        }
        var point = compatibilityEvent(e),
            deltaX = point.pageX - eventContext.pageX;
        //如果有move事件，则取消tap事件
        if (Math.abs(deltaX)) {
            eventContext.isTap = false;
            setCanvasMove(supportSwipe);
        }
    }

    var end = function() {
        //触发tap事件
        eventContext.isTap && eventHandle();
    }

    eventContext = eventContext[0]

    //IE10是不支持touch事件，直接绑定click事件
    if (isIE10) {
        eventContext.isTap = true;
        eventContext.addEventListener('click', end, false);
    } else {

        $$on(eventContext, {
            start: start,
            move: move,
            end: end,
            cancel: end
        })
    }

    return {
        off: function() {
            if (eventContext) {
                if (isIE10) {
                    eventContext.removeEventListener('click', end, false);
                } else {
                    $$off(eventContext)
                }
                eventContext = null;
            }
        }
    }
}
