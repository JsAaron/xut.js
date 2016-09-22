
/*基本动画类鼠标响应事件*/

//支持触屏
var hasTouch = 'ontouchstart' in window;
var isDesktop = !hasTouch
//针对win8的处理
var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;
//移动端仅仅只支持touch
var onlyTouch = hasTouch && MOBILE_REGEX.test(navigator.userAgent);
//可以点击与触摸
var isSurface = hasTouch && ('onmousedown' in window) && !onlyTouch;
var isMacOS = (navigator.userAgent.indexOf("Mac") < 0) ? false : true;
var startEventType = isSurface ? "touchstart mousedown" : (hasTouch ? "touchstart" : "mousedown");
var moveEventType = isSurface ? "touchmove mousemove" : (hasTouch ? "touchmove" : "mousemove");
var endEventType = isSurface ? "touchend mouseup" : (hasTouch ? "touchend" : "mouseup");
var cancelEventType = isSurface ? "touchcancel mouseup" : (hasTouch ? 'touchcancel' : 'mouseup');

var onTouchMove = function (pageType, parentId, objectId, startCallback, moveCallback, endCallback) {
    this.hasTouch = hasTouch;
    this.parent = document.getElementById(parentId);
    this.scroller = document.getElementById(objectId);
    this.startCallback = startCallback;
    this.moveCallback = moveCallback;
    this.endCallback = endCallback;
    if (this.scroller == null) {
        console.error("The control area of the object is empty.");
        return;
    }
    if (Xut.Contents.ResetDefaultControl) Xut.Contents.ResetDefaultControl(pageType, parentId); //取消默认翻页行为

    if (this.scroller["initTouchMove"]) this.scroller["initTouchMove"]._unbind(startEventType); //注销重复事件
    this._bind(startEventType, null);
    this.scroller["initTouchMove"] = this; //实例化对象绑定到元素，便于后期调用
};
onTouchMove.prototype = {
    handleEvent: function (e) {
        switch (e.type) {
            case startEventType:
                this._start(e);
                break;
            case moveEventType:
                this._move(e);
                break;
            case endEventType:
                this._end(e);
                break;
            case cancelEventType:
                this._end(e);
                break;
            case 'mouseout':
                this._end(e);
                break;
        }
    },
    _start: function (e) {
        e.preventDefault();
        if (typeof (this.startCallback) == "function") this.startCallback(e);
        this._bind(moveEventType);
        this._bind(endEventType);
        this._bind(cancelEventType);
        if (!this.hasTouch) this._bind('mouseout', this.parent);
    },
    _move: function (e) {
        if (typeof (this.moveCallback) == "function") this.moveCallback(e);
    }, 
    _end: function (e) {
        this._unbind(moveEventType);
        this._unbind(endEventType);
        this._unbind(cancelEventType);
        if (!this.hasTouch) this._unbind('mouseout', this.parent);
        if (typeof (this.endCallback) == "function") this.endCallback(e);
    },
    _bind: function (type, el, bubble) {
        (el || this.scroller).addEventListener(type, this, !!bubble);
    },
    _unbind: function (type, el, bubble) {
        (el || this.scroller).removeEventListener(type, this, !!bubble);
    }
};


export {isMacOS,hasTouch,isDesktop,onTouchMove}

