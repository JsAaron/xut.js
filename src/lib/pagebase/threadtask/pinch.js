const reqAnimationFrame = (function() {
    return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function(callback) {
        window.setTimeout(callback, 1000 / 60);
    }
})();

const transform = Xut.style.transform
const translateZ = Xut.style.translateZ

/**
 * 缩放平移
 * @param {[type]} node [description]
 */
export default function Pinch(node) {

var aa = false
    var mc = new Hammer.Manager(node);

    // const START_X = Math.round((window.innerWidth - node.offsetWidth) / 2);
    // const START_Y = Math.round((window.innerHeight - node.offsetHeight) / 2);

    const START_X = 0
    const START_Y = 0

    var currentX = START_X;
    var currentY = START_Y;

    var ticking = false;

    var pan = new Hammer.Pan();
    var pinch = new Hammer.Pinch();
    mc.add([pinch])

    mc.on("pinchstart pinchmove", onPinch);
    mc.on("pinchstart", function() {
        if (!mc.get('pan')) {
            mc.add([pan])
            mc.on("panstart panmove", onPan);
            mc.on("panend", onPanEnd)
            pan.recogizeWith(pinch)
                // Xut.Application.closeFlip()
        }
    })

    const data = {
        translate: {
            x: START_X,
            y: START_Y
        },
        scale: 1
    };

    var initScale = 1;


    function updatenodeTransform() {
        if(aa) return 
        node.style[transform] =
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
        }

        if (ev.type == 'pinchstart') {
            initScale = data.scale || 1;
        }
        node.className = '';
        data.scale = initScale * ev.scale

        if (data.scale < 1) {
            data.scale = 1
        }
        judgeBoundry()
        requestnodeUpdate();

    }


    function onPan(ev) {
        ev.srcEvent.stopPropagation();

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

        judgeBoundry()
        requestnodeUpdate();
    }

    function onPanEnd() {
        currentX = data.translate.x
        currentY = data.translate.y

    }


    function judgeBoundry() {
        var horizontalBoundry = (data.scale - 1) / 2 * node.offsetWidth;
        var verticalBoundry = (data.scale - 1) / 2 * node.offsetHeight;
        if (data.scale > 1) {
            //左边界
            if (data.translate.x >= horizontalBoundry) {
                data.translate.x = horizontalBoundry
            }
            //右边界
            if (data.translate.x <= -horizontalBoundry) {
                aa = true

                Xut.View.MovePage(data.translate.x , 0, 'next', 'flipMove')

      // Xut.View.GotoNextSlide()
      // Xut.View.GotoPrevSlide()

                // -3.450381679389313 0 "next" "flipMove"
                // flow.js:160 -9.146110056925995 0 "next" "flipMove"
                // flow.js:160 -14.777358490566037 0 "next" "flipMove"
                // flow.js:160 -20.345215759849907 0 "next" "flipMove"
                // flow.js:160 -24.022429906542058 0 "next" "flipMove"
                // flow.js:160 -25.850746268656714 0 "next" "flipMove"
                // Xut.View.MovePage(data.translate.x , 0, 'next', 'flipMove')


                //0 300 "next" "flipRebound
                //Xut.View.MovePage(data.translate.x , 0, 'next', 'flipMove')

                // Xut.View.GotoNextSlide()
                // data.translate.x = -horizontalBoundry
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

}
