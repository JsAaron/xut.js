/**
 * 设备平台判断
 * @return {[type]} [description]
 */
;
(function() {

    // Browser environment sniffing
    var inBrowser =
        typeof window !== 'undefined' &&
        Object.prototype.toString.call(window) !== '[object Object]'

    //在读酷pc端 navigator的值被改写过了!!
    //navigator.appVersion: "xxt 1.0.5260.29725"
    var UA = inBrowser && window.navigator.userAgent.toLowerCase()
    var UV = inBrowser && window.navigator.appVersion.toLowerCase()
    var isAndroid = UA && UA.indexOf('android') > 0
    var isIphone = (/iphone|ipod/gi).test(UA)
    var isIpad = (/ipod/gi).test(UA)
    var isIOS = isIphone || isIpad
    var isIOS7 = isIOS && (/os\s7/gi).test(UA)
    var has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix()

    //webkit内核
    var isWebKit = /applewebKit/ig.test(UV)

    //微信
    var isWeiXin = /micromessenger/ig.test(UV)

    //针对win8的处理
    var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i

    //支持触屏
    var SUPPORT_TOUCH = ('ontouchstart' in window)

    //支持鼠标
    var SUPPORT_MOUSE = ('onmousedown' in window)

    //移动端仅仅只支持touch
    var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(UA);

    //判断是否为浏览器
    //http://localhost:12344/index.html
    var location = document.location.href
    var boolBrowser = location.indexOf('http') > -1 || location.indexOf('https') > -1;


    /**
     * 私有前缀
     * @type {[type]}
     */
    var rdashAlpha = /-([a-z]|[0-9])/ig
    var rmsPrefix = /^-ms-/
    var fcamelCase = function(all, letter) {
        return (letter + '').toUpperCase();
    }
    var camelCase = function(string) {
        return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
    }
    var PREFIX = ['webkit', 'Moz', 'ms', 'o']
    var _elementStyle = document.createElement('div').style
    var _cache = Object.create(null)
    var _prefixStyle = function(attr) {
        var name
            //缓存中存在
        if (_cache[attr]) {
            return _cache[attr];
        }
        //不需要加前缀
        if (attr in _elementStyle) {
            return _cache[attr] = attr;
        }
        //需要加前缀
        PREFIX.forEach(function(v) {
            if (camelCase(v + '-' + attr) in _elementStyle) {
                name = '-' + v + '-' + attr;
                return _cache[attr] = name;
            }
        })
        return name;
    }



    /**
     * css3 keyframes
     * @return {[type]} [description]
     */
    var transitionEnd = 'transitionend'
    var animationEnd = 'animationend'
    var keyframes = '@keyframes '
    var animation = _prefixStyle('animation');
    (function() {
        var vendors = animation
        var transitionEnd_NAMES = {
            "moz": "transitionend",
            "webkit": "webkitTransitionEnd",
            "ms": "MSTransitionEnd",
            "o": "oTransitionEnd"
        }
        var animationEnd_NAMES = {
            "moz": "animationend",
            "webkit": "webkitAnimationEnd",
            "ms": "MSAnimationEnd",
            "o": "oAnimationEnd"
        }
        if (!vendors) return;
        vendors = vendors.split('-');
        if (!vendors[1]) return;
        transitionEnd = transitionEnd_NAMES[vendors[1]];
        animationEnd = animationEnd_NAMES[vendors[1]];
        keyframes = '@-' + vendors[1] + '-keyframes ';
    })()


    var isBrowser = boolBrowser ? boolBrowser : !SUPPORT_ONLY_TOUCH

    //有hasMutationObserverBug
    var iosVersionMatch = isIOS && UA.match(/os ([\d_]+)/)
    var iosVersion = iosVersionMatch && iosVersionMatch[1].split('_')
    // detecting iOS UIWebView by indexedDB
    var hasMutationObserverBug = iosVersion && Number(iosVersion[0]) >= 9 && Number(iosVersion[1]) >= 3 && !window.indexedDB

    /**
     * 平台支持
     * @type {Object}
     */
    Xut.extend(Xut.plat, {
        has3d: has3d,
        isAndroid: isAndroid,
        isIphone: isIphone,
        isIpad: isIpad,
        isIOS: isIOS,
        isIOS7: isIOS7,

        hasMutationObserverBug:hasMutationObserverBug,

        /**
         * 不能自动播放媒体
         * audio
         * video
         * @type {[type]}
         * 浏览器端
         * 不是微信
         * 是webkit
         * 是手机端浏览器
         */
        noAutoPlayMedia: !isWeiXin && isBrowser && SUPPORT_ONLY_TOUCH,

        /**
         * 支持触摸
         * @type {Boolean}
         */
        hasTouch: SUPPORT_ONLY_TOUCH,

        /**
         * 游览器平台 解决ios Android浏览器判断问题
         * @type {Boolean}
         */
        isBrowser: isBrowser,

        /**
         * 2015.3.23
         * isSurface
         * 可以点击与触摸
         * @type {Boolean}
         */
        isSurface: SUPPORT_TOUCH && SUPPORT_MOUSE && !SUPPORT_ONLY_TOUCH,

        /**
         * 事件对象
         * @param  {[type]} event    [description]
         * @param  {[type]} original [description]
         * @return {[type]}          [description]
         */
        evtTarget: function(event, original) {
            var currTouches = null;
            if (SUPPORT_ONLY_TOUCH) {
                currTouches = event.touches;
                if (currTouches && currTouches.length > 0) {
                    event = currTouches[0];
                }
            }
            return original ? event : event.target;
        }
    })


    /**
     * 支持转换效果
     * @type {Boolean}
     */
    var hasPerspective = _prefixStyle('perspective') in _elementStyle
    var translateZ = hasPerspective ? ' translateZ(0)' : ''
    var maskBoxImage = _prefixStyle('mask-box-image')


    var reqAnimationFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) { window.setTimeout(callback, 1000 / 60); };

    /**
     * 样式style支持
     * @type {Object}
     */
    Xut.extend(Xut.style, {

        reqAnimationFrame: reqAnimationFrame,

        /**
         * 不支持蒙版
         * @type {[type]}
         */
        noMaskBoxImage: maskBoxImage == undefined,

        /**
         * 前缀
         * @type {[type]}
         */
        prefixStyle: _prefixStyle,

        /**
         * transform
         * @type {[type]}
         */
        transform: _prefixStyle('transform'),
        transition: _prefixStyle('transition'),
        transitionDuration: _prefixStyle('transition-duration'),
        transitionDelay: _prefixStyle('transition-delay'),
        transformOrigin: _prefixStyle('transform-origin'),
        transitionTimingFunction: _prefixStyle('transition-timing-function'),
        transitionEnd: transitionEnd,

        /**
         * css3 admination
         * @type {[type]}
         */
        animation: animation,
        animationDelay: _prefixStyle('animation-delay'),
        animationPlayState: _prefixStyle('animation-play-state'),
        animationEnd: animationEnd,
        keyframes: keyframes,

        /**
         * 支持3d Z
         * @type {[type]}
         */
        translateZ: translateZ,
        setTranslateZ: function(zValue) {
            return hasPerspective ? ' translateZ(' + zValue + ')' : ''
        },

        /**
         * 额外样式
         * @type {[type]}
         */
        filter: _prefixStyle('filter'),
        maskBoxImage: maskBoxImage,
        borderRadius: _prefixStyle('border-radius'),

        /**
         * css3分栏
         * @type {[type]}
         */
        columnWidth: _prefixStyle('column-width'),
        columnGap: _prefixStyle('column-gap')

    })

})()
