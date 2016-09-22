/**
 * 资源加载
 * @return {[type]} [description]
 */
var loader = function() {
    return {
        /**入口函数,动态脚本加载
         * @param fileList:           需要动态加载的资源列表
         * @param callback:           所有资源都加载完后调用的回调函数,通常是页面上需要onload就执行的函数
         * @param scope:              作用范围
         * @param preserveOrder:      是否保持脚本顺序
         */
        load: function(fileList, callback, scope, preserveOrder) {
            //过来数组元素
            if (fileList.length && preserveOrder) {
                var temp = [];
                fileList.forEach(function(val, index) {
                    if (val) {
                        temp.push(val);
                    }
                })
                fileList = temp.reverse();
                temp = null;
            }

            var scope = scope || this,
                //var scope =this,//默认作用范围是当前页面
                head = document.getElementsByTagName("head")[0],
                fragment = document.createDocumentFragment(),
                numFiles = fileList.length,
                loadedFiles = 0;

            //加载一个特定的文件从fileList通过索引
            var loadFileIndex = function(index) {
                head.appendChild(scope.buildScriptTag(fileList[index], onFileLoaded));
            };

            /**
             * 调用回调函数,当所有文件都加载完后调用
             */
            var onFileLoaded = function() {
                loadedFiles++;
                //如果当前文件是最后一个要加载的文件，则调用回调函数，否则加载下一个文件
                if (numFiles == loadedFiles && typeof callback == 'function') {
                    callback.call(scope);
                } else {
                    if (preserveOrder === true) {
                        loadFileIndex(loadedFiles);
                    }
                }
            };

            if (preserveOrder === true) {
                loadFileIndex.call(this, 0);
            } else {
                for (var i = 0, len = fileList.length; i < len; i++) {
                    fragment.appendChild(this.buildScriptTag(fileList[i], onFileLoaded));
                }
                head.appendChild(fragment);
            }
        },

        //构造javascript和link 标签
        buildScriptTag: function(filename, callback) {
            var exten = filename.substr(filename.lastIndexOf('.') + 1);
            if (exten == 'js') {
                var script = document.createElement('script');
                script.type = "text/javascript";
                script.src = filename;
                script.onload = callback;
                return script;
            }
            if (exten == 'css') {
                var style = document.createElement('link');
                style.rel = 'stylesheet';
                style.type = 'text/css';
                style.href = filename;
                callback();
                return style;
            }
        }
    };
}();


function pollCss(node, callback) {
    var sheet = node.sheet,
        isLoaded;
    var isOldWebKit = +navigator.userAgent
        .replace(/.*AppleWebKit\/(\d+)\..*/, "$1") < 536
        // for WebKit < 536
    if (isOldWebKit) {
        if (sheet) {
            isLoaded = true
        }
    }
    // for Firefox < 9.0
    else if (sheet) {
        try {
            if (sheet.cssRules) {
                isLoaded = true
            }
        } catch (ex) {
            // The value of `ex.name` is changed from "NS_ERROR_DOM_SECURITY_ERR"
            // to "SecurityError" since Firefox 13.0. But Firefox is less than 9.0
            // in here, So it is ok to just rely on "NS_ERROR_DOM_SECURITY_ERR"
            if (ex.name === "NS_ERROR_DOM_SECURITY_ERR") {
                isLoaded = true
            }
        }
    }

    setTimeout(function() {
        if (isLoaded) {
            // Place callback here to give time for style rendering
            callback()
        } else {
            pollCss(node, callback)
        }
    }, 20)
}


function addOnload(node, callback, isCSS, url) {
    var supportOnload = "onload" in node;
    var isOldWebKit = +navigator.userAgent
        .replace(/.*AppleWebKit\/(\d+)\..*/, "$1") < 536
        // for Old WebKit and Old Firefox
    if (isCSS) {
        setTimeout(function() {
                pollCss(node, callback)
            }, 1) // Begin after node insertion
        return
    }

    if (supportOnload) {
        node.onload = onload
        node.onerror = function() {
            onload()
        }
    } else {
        node.onreadystatechange = function() {
            if (/loaded|complete/.test(node.readyState)) {
                onload()
            }
        }
    }

    function onload() {
        // Ensure only run once and handle memory leak in IE
        node.onload = node.onerror = node.onreadystatechange = null
            // Remove the script to reduce memory leak
        if (!isCSS) {
            var head = document.getElementsByTagName("head")[0] || document.documentElement;
            head.removeChild(node)
        }
        // Dereference the node
        node = null
        callback()
    }
}

function request(url, callback, charset) {
    var IS_CSS_RE = /\.css(?:\?|$)/i,
        isCSS = IS_CSS_RE.test(url),
        node = document.createElement(isCSS ? "link" : "script");

    if (charset) {
        var cs = $.isFunction(charset) ? charset(url) : charset
        if (cs) {
            node.charset = cs
        }
    }
    addOnload(node, callback, isCSS, url)
    if (isCSS) {
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
}



var imgReady = (function() {

    var list = [],
        intervalId = null,

        // 用来执行队列
        tick = function() {
            var i = 0;
            for (; i < list.length; i++) {
                list[i].end ? list.splice(i--, 1) : list[i]();
            };
            !list.length && stop();
        },

        // 停止所有定时器队列
        stop = function() {
            clearInterval(intervalId);
            intervalId = null;
        };

    return function(url, ready, load, error) {
        var onready, width, height, newWidth, newHeight,
            img = new Image();

        img.src = url;

        // 如果图片被缓存，则直接返回缓存数据
        if (img.complete) {
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
            if (newWidth !== width || newHeight !== height ||
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
        if (!onready.end) {
            list.push(onready);
            // 无论何时只允许出现一个定时器，减少浏览器性能损耗
            if (intervalId === null) intervalId = setInterval(tick, 40);
        };
    };
})();


let loadfile = request

export {
    loader,
    request,
    loadfile,
    imgReady
}
