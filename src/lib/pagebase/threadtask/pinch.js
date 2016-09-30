import iconsConfig from '../../toolbar/base/iconconf.js'
import { svgIcon } from '../../toolbar/base/svgicon'

const reqAnimationFrame = (function() {
    return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function(callback) {
        window.setTimeout(callback, 1000 / 60);
    }
})();

const transform = Xut.style.transform
const translateZ = Xut.style.translateZ


const createSVGIcon = function(el, callback) {
    var options = {
        speed: 6000,
        size: {
            w: 50,
            h: 50
        },
        onToggle: callback
    };
    return new svgIcon(el, iconsConfig, options);
}

/**
 * [ 关闭按钮]
 * @return {[type]} [description]
 */
const createCloseIcon = function() {
    var style, html,
        TOP = 10,
        height = '50'
    style = 'top:' + TOP + 'px;width:' + height + 'px;height:' + height + 'px';
    html = '<div class="si-icon xut-scenario-close" data-icon-name="close" style="' + style + '"></div>';
    html = $(html);
    return html
}


/**
 * 缩放平移
 * @param {[type]} node [description]
 */
export default function Pinch($pinchNode, $pagePinch) {

    var pinchNode = $pinchNode[0]
    var mc = new Hammer.Manager(pinchNode);

    const START_X = 0
    const START_Y = 0

    var currentX = START_X;
    var currentY = START_Y;

    var ticking = false;


    const data = {
        translate: {
            x: START_X,
            y: START_Y
        },
        scale: 1
    };

    var initScale = 1;

    let isStart = false
    let $pinchCloseNode

    const createPinchClose = function() {
        const $closeNode = createCloseIcon()
        createSVGIcon($closeNode[0], function() {
            data.scale = 1;
            data.translate.x = START_X;
            data.translate.y = START_Y;
            requestnodeUpdate();
            createPinchCloseHide()
            isStart = false
        })
        $pagePinch.after($closeNode)
        return $closeNode
    }

    const createPinchCloseShow = function() {
        if ($pinchCloseNode) {
            $pinchCloseNode.show()
        } else {
            $pinchCloseNode = createPinchClose()
        }
        isStart = true
    }

    const createPinchCloseHide = function() {
        $pinchCloseNode.hide()
        isStart = false
    }

    var pan = new Hammer.Pan();
    var pinch = new Hammer.Pinch();
    mc.add([pinch])

    mc.on("pinchstart pinchmove", onPinch);

    function updatenodeTransform() {
        pinchNode.style[transform] =
            `translate(${data.translate.x}px,${data.translate.y}px) ${translateZ}
            scale(${data.scale},${data.scale})`
        ticking = false
    }


    function requestnodeUpdate() {
        if (!ticking) {
            reqAnimationFrame(updatenodeTransform);
            ticking = true;
        }
    }


    function onPinch(ev) {
        if (data.scale > 1) {
            ev.srcEvent.stopPropagation()
            mc.get('pan').set({ enable: true });
        }

        if (ev.type == 'pinchstart') {
            initScale = data.scale || 1;
            if (!mc.get('pan')) {
                createPinchCloseShow()
                mc.add([pan])
                mc.on("panstart panmove", onPan);
                mc.on("panend", onPanEnd)
                pan.recogizeWith(pinch)
            } else {
                if (!isStart) {
                    createPinchCloseShow()
                }
            }
        }

        pinchNode.className = '';
        data.scale = initScale * ev.scale

        //还原
        if (data.scale < 1) {
            data.scale = 1
            createPinchCloseHide()
        }
        judgeBoundry()
        requestnodeUpdate();

    }


    function onPan(ev) {
        if (data.scale > 1) {
            //取消冒泡 pinch层滑动 li层不可滑动
            ev.srcEvent.stopPropagation()
            mc.get('pan').set({ enable: true });

            if (currentX != START_X || currentY != START_Y) {
                data.translate = {
                    x: currentX + ev.deltaX,
                    y: currentY + ev.deltaY
                };
            } else {
                data.translate = {
                    x: START_X + ev.deltaX,
                    y: START_Y + ev.deltaY
                };
            }

            judgeBoundry(ev)
            requestnodeUpdate();
        } else {
            //不取消冒泡 禁止pinch层滑动 此时li层可以滑动
            mc.get('pan').set({ enable: false });
        }
    }

    function onPanEnd() {
        currentX = data.translate.x
        currentY = data.translate.y

    }


    function judgeBoundry() {
        var horizontalBoundry = (data.scale - 1) / 2 * pinchNode.offsetWidth;
        var verticalBoundry = (data.scale - 1) / 2 * pinchNode.offsetHeight;
        if (data.scale > 1) {
            //左边界
            if (data.translate.x >= horizontalBoundry) {
                data.translate.x = horizontalBoundry
            }
            //右边界
            if (data.translate.x <= -horizontalBoundry) {
                data.translate.x = -horizontalBoundry
            }
            //上边界
            if (data.translate.y >= verticalBoundry) {
                data.translate.y = verticalBoundry
            }
            //下边界
            if (data.translate.y <= -verticalBoundry) {
                data.translate.y = -verticalBoundry
            }
        } else {
            data.scale = 1;
            data.translate.x = START_X;
            data.translate.y = START_Y;
        }
    }

    return {
        destroy: function() {
            mc.destroy()
        }
    }

}
