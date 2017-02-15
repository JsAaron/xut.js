function addOnload(node, callback, isCSS, url) {
    var supportOnload = "onload" in node;

    if(supportOnload) {
        node.onload = onload
        node.onerror = function() {
            onload(true)
        }
    } else {
        node.onreadystatechange = function() {
            if(/loaded|complete/.test(node.readyState)) {
                onload()
            }
        }
    }

    function onload(error) {
        // Ensure only run once and handle memory leak in IE
        node.onload = node.onerror = node.onreadystatechange = null

        // Remove the script to reduce memory leak
        if(!isCSS) {
            var head = document.getElementsByTagName("head")[0] || document.documentElement;
            head.removeChild(node)
        }
        // Dereference the node
        node = null

        callback(error)
    }
}

function loadFile(url, callback, charset) {
    var IS_CSS_RE = /\.css(?:\?|$)/i,
        isCSS = IS_CSS_RE.test(url),
        node = document.createElement(isCSS ? "link" : "script");

    if(charset) {
        var cs = $.isFunction(charset) ? charset(url) : charset
        if(cs) {
            node.charset = cs
        }
    }

    addOnload(node, callback, isCSS, url)

    if(isCSS) {
        node.rel = "stylesheet"
        node.href = url
    } else {
        node.async = true
        node.src = url
    }
    // For some cache cases in IE 6-8, the script executes IMMEDIATELY after
    // the end of the insert execution, so use `currentlyAddingScript` to
    // hold current node, for deriving url in `define` call
    //currentlyAddingScript = node
    var head = document.getElementsByTagName("head")[0] || document.documentElement;
    var baseElement = head.getElementsByTagName("base")[0];
    // ref: #185 & http://dev.jquery.com/ticket/2709
    baseElement ?
        head.insertBefore(node, baseElement) :
        head.appendChild(node)
        //currentlyAddingScript = null

    return node
}

/**
 * 加载图片
 */
const loadFigure = (function() {

    let list = []
    let intervalId = null

    // 用来执行队列
    let tick = function() {
        var i = 0;
        for(; i < list.length; i++) {
            list[i].end ? list.splice(i--, 1) : list[i]();
        };
        !list.length && stop();
    }

    // 停止所有定时器队列
    let stop = function() {
        clearInterval(intervalId);
        intervalId = null;
    }

    return function(url, ready, load, error) {
        var onready, width, height, newWidth, newHeight,
            img = new Image();

        img.src = url;

        // 如果图片被缓存，则直接返回缓存数据
        if(img.complete) {
            ready && ready.call(img);
            load && load.call(img);
            return;
        };

        width = img.width;
        height = img.height;

        // 加载错误后的事件
        img.onerror = function() {
            error && error.call(img);
            onready.end = true;
            img = img.onload = img.onerror = null;
        };

        // 图片尺寸就绪
        onready = function() {
            newWidth = img.width;
            newHeight = img.height;
            if(newWidth !== width || newHeight !== height ||
                // 如果图片已经在其他地方加载可使用面积检测
                newWidth * newHeight > 1024
            ) {
                ready && ready.call(img);
                onready.end = true;
            };
        };
        onready();
        // 完全加载完毕的事件
        img.onload = function() {
            // onload在定时器时间差范围内可能比onready快
            // 这里进行检查并保证onready优先执行
            !onready.end && onready();
            load && load.call(img);
            // IE gif动画会循环执行onload，置空onload即可
            img = img.onload = img.onerror = null;
        };

        // 加入队列中定期执行
        if(!onready.end) {
            list.push(onready);
            // 无论何时只允许出现一个定时器，减少浏览器性能损耗
            if(intervalId === null) intervalId = setInterval(tick, 40);
        };
    };
})();

export {
    loadFile,
    loadFigure
}
