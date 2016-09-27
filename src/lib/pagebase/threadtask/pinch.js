var reqAnimationFrame = (function() {
    return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function(callback) {
        window.setTimeout(callback, 1000 / 60);
    }
})();

/**
 * 缩放平移
 * @param {[type]} element [description]
 */
export default function Pinch(element) {
console.log(element)
    var mc = new Hammer.Manager(element);

    const START_X = Math.round((window.innerWidth - element.offsetWidth) / 2);
    const START_Y = Math.round((window.innerHeight - element.offsetHeight) / 2);

    var ticking = false;


    mc.add(new Hammer.Pan({
        threshold: 0,
        pointers: 0
    }));

    mc.add(new Hammer.Pinch({
        threshold: 0
    })).recognizeWith([mc.get('pan')]);


    mc.on("pinchstart pinchmove", onPinch);


    const transform = {
        translate: {
            x: START_X,
            y: START_Y
        },
        scale: 1
    };

    var initScale = 1;


    function updateElementTransform() {
        var value = [
            // 'translate3d(' + transform.translate.x + 'px, ' + transform.translate.y + 'px, 0)',
            'scale(' + transform.scale + ', ' + transform.scale + ')'
        ];
        value = value.join(" ");
        // element.textContent = value;
        element.style.webkitTransform = value;
        element.style.mozTransform = value;
        element.style.transform = value;
        ticking = false;
    }


    function requestElementUpdate() {
        if (!ticking) {
            reqAnimationFrame(updateElementTransform);
            ticking = true;
        }
    }


    function onPinch(ev) {
        if (ev.type == 'pinchstart') {
            initScale = transform.scale || 1;
        }
        element.className = '';
        transform.scale = initScale * ev.scale
       	if(transform.scale<1){
       		transform.scale = 1
       	}
        requestElementUpdate();
    }

}
