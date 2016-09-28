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


    var mc = new Hammer.Manager(node);


    const START_X = Math.round((window.innerWidth - node.offsetWidth) / 2);
    const START_Y = Math.round((window.innerHeight - node.offsetHeight) / 2);

    var currentX = START_X;
    var currentY = START_Y;

    var ticking = false;


    // mc.add(new Hammer.Pan({
    //     threshold: 0,
    //     pointers: 0
    // }));

    // mc.add(new Hammer.Pinch({
    //     threshold: 0
    // })).recognizeWith([mc.get('pan')]);


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
        ev.srcEvent.stopPropagation()
        if (ev.type == 'pinchstart') {
            initScale = data.scale || 1;
        }
        node.className = '';
        data.scale = initScale * ev.scale
        if (data.scale < 1) {
            data.scale = 1
        }
        requestnodeUpdate();
    }


    function onPan(ev) {
        ev.srcEvent.stopPropagation()
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
        requestnodeUpdate();
    }

    function onPanEnd() {
        currentX = data.translate.x
        currentY = data.translate.y
    }

}
