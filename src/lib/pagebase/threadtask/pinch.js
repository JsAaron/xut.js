import iconsConfig from '../../toolbar/base/iconconf.js'
import { svgIcon } from '../../toolbar/base/svgicon'
import { config } from '../../config/index'


const transform = Xut.style.transform
const translateZ = Xut.style.translateZ


const createSVGIcon = function(el, callback) {
    var options = {
        speed: 6000,
        onToggle: callback
    };
    return new svgIcon(el, iconsConfig, options);
}


const createCloseIcon = function() {
    const proportion = config.proportion
    const width = proportion.width * 55
    const height = proportion.height * 70
    const top = proportion.height * 10
    const right = config.viewSize.left ? Math.abs(config.viewSize.left) + (top * 2) : top * 2
    const html =
        `<div class="si-icon xut-scenario-close" 
                 data-icon-name="close" 
                 style="width:${width}px;height:${height}px;top:${top}px;right:${right}px">
            </div>'`
    return $(html)
}


/**
 * 缩放平移
 * @param {[type]} node [description]
 */
export default function Pinch($pinchNode, $pagePinch, pageIndex) {

    let belongMaster = Xut.Presentation.GetPageObj('master', pageIndex)
    let masterPageNode
    if (belongMaster) {
        masterPageNode = belongMaster.getContainsNode()[0]
    }

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

        const style =
            `translate(${data.translate.x}px,${data.translate.y}px) ${translateZ}
            scale(${data.scale},${data.scale})`

        pinchNode.style[transform] = style
        if (masterPageNode) {
            masterPageNode.style[transform] = style
        }

        ticking = false
    }


    function requestnodeUpdate() {
        if (!ticking) {
            Xut.nextTick(updatenodeTransform);
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
