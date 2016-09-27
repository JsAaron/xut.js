var reqAnimationFrame = (function() {
    return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function(callback) {
        window.setTimeout(callback, 1000 / 60);
    }
})();

/**
 * 缩放平移
 * @param {[type]} $node [description]
 */
export default function Pinch($node) {
console.log($node)
    var mc = new Hammer.Manager($node);

    const START_X = Math.round((window.innerWidth - $node.offsetWidth) / 2);
    const START_Y = Math.round((window.innerHeight - $node.offsetHeight) / 2);

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


    function update$nodeTransform() {
        var value = [
            // 'translate3d(' + transform.translate.x + 'px, ' + transform.translate.y + 'px, 0)',
            'scale(' + transform.scale + ', ' + transform.scale + ')'
        ];
        value = value.join(" ");
        // $node.textContent = value;
        $node.style.webkitTransform = value;
        $node.style.mozTransform = value;
        $node.style.transform = value;
        ticking = false;
    }


    function request$nodeUpdate() {
        if (!ticking) {
            reqAnimationFrame(update$nodeTransform);
            ticking = true;
        }
    }


    function onPinch(ev) {
        if (ev.type == 'pinchstart') {
            initScale = transform.scale || 1;
        }
        $node.className = '';
        transform.scale = initScale * ev.scale
       	if(transform.scale<1){
       		transform.scale = 1
       	}
        request$nodeUpdate();
    }

}
