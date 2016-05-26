/**
 * 页面切换效果
 * 平移
 * @return {[type]} [description]
 */
var prefix = Xut.plat.prefixStyle,
    xxtTrans = function (offset) {
        offset = Xut.config.virtualMode ? offset / 2 : offset;
        return "translate3d(" + offset + "px, 0, 0)";
    };

function dydTransform(distance) {
    distance = Xut.config.virtualMode ? distance / 2 : distance;
    return prefix('transform') + ':' + 'translate3d(' + distance + 'px,0px,0px)'
}


//保持缩放比,计算缩放比情况下的转化
let calculateContainer
let offsetLeft
let offsetRight
let offsetCut
let prevEffect
let currEffect
let nextEffect

function setConfig() {
    calculateContainer = Xut.config.proportion.calculateContainer()
    offsetLeft = (-1 * calculateContainer.width)
    offsetRight = calculateContainer.width
    offsetCut = 0
    prevEffect = xxtTrans(offsetLeft)
    currEffect = xxtTrans(offsetCut)
    nextEffect = xxtTrans(offsetRight)
}

//切换坐标
function toTranslate3d(distance, speed, element) {
    distance = Xut.config.virtualMode ? distance / 2 : distance;
    if (element = element || this.element || this.$contentProcess) {
        element.css(prefix('transform'), 'translate3d(' + distance + 'px,0px,0px)');
        if (Xut.config.pageFlip) {
            //修正pageFlip切换页面的处理
            //没有翻页效果
            if (distance === 0) {
                var cur = Xut.sceneController.containerObj('current')
                cur.vm.$globalEvent.setAnimComplete(element);
            }
        } else {
            element.css(prefix('transition-duration'), speed + "ms")
        }
    }
}

/**
 * 创建起始坐标
 * @return {[type]}
 */
export function createTransform(currPageIndex, createPageIndex) {
    setConfig();
    var translate3d, direction, offset;
    if (createPageIndex < currPageIndex) {
        translate3d = prevEffect;
        offset = offsetLeft;
        direction = 'before';
    } else if (createPageIndex > currPageIndex) {
        translate3d = nextEffect;
        offset = offsetRight;
        direction = 'after';
    } else if (currPageIndex == createPageIndex) {
        translate3d = currEffect;
        offset = offsetCut;
        direction = 'original';
    }
    return [translate3d, direction, offset, dydTransform];

}


/**
 * 修正坐标
 * @return {[type]} [description]
 */
export function fix(translate3d) {
    var transform = prefix('transform')
    var translate3d = translate3d === 'prevEffect' ? prevEffect : nextEffect
    this.element.css(transform, translate3d)
}

export function reset() {
    var element;
    if (element = this.element || this.$contentProcess) {
        element.css(prefix('transition-duration'), '');
        element.css(prefix('transform'), 'translate3d(0px,0px,0px)');
    }
}

/**
 * 移动
 * @return {[type]} [description]
 */
export function flipMove(distance, speed, element) {
    toTranslate3d.apply(this, arguments)
}

/**
 * 移动反弹
 * @return {[type]} [description]
 */
export function flipRebound(distance, speed) {
    toTranslate3d.apply(this, arguments)
}

/**
 * 移动结束
 * @return {[type]} [description]
 */
export function flipOver(distance, speed) {
    /**
     * 过滤多个动画回调，保证指向始终是当前页面
     */
    if (this.pageType === 'page') {
        if (distance === 0) { //目标页面传递属性
            this.element.attr('data-view', true)
        }
    }
    toTranslate3d.apply(this, arguments)
}


var translation = {
    fix: fix,
    reset: reset,
    flipMove: flipMove,
    flipRebound: flipRebound,
    flipOver: flipOver
}

export {translation}