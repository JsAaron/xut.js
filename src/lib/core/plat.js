/**
 * 设备平台判断
 * @return {[type]} [description]
 */
;
(function() {

    var ua, uv, _style, _cache, TRANSITION_END, ANIMATION_END, KEYFRAMES, isAndroid, isIphone, isIpad, isIOS, isIOS7, has3d, MOBILE_REGEX, SUPPORT_TOUCH, SUPPORT_MOUSE, SUPPORT_ONLY_TOUCH, location, boolBrowser, PREFIX, prefixStyle, isWebKit, isWeiXin, isBrowser


    //在读酷pc端 navigator的值被改写过了!!
    //navigator.appVersion: "xxt 1.0.5260.29725"
    ua = navigator.userAgent
    uv = navigator.appVersion
    isAndroid = (/android/gi).test(uv)
    isIphone = (/iphone|ipod/gi).test(ua)
    isIpad = (/ipad/gi).test(ua)
    isIOS = isIphone || isIpad
    isIOS7 = isIOS && (/OS\s7/gi).test(ua)

    /**
     * webkit内核
     * @type {RegExp}
     */
    isWebKit = /AppleWebKit/ig.test(uv)

    /**
     * 微信
     * @type {Boolean}
     */
    isWeiXin = /MicroMessenger/ig.test(uv)

    has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix()
    _style = document.documentElement.style
    _cache = Object.create(null)
    TRANSITION_END = 'transitionend'
    ANIMATION_END = 'animationend'
    KEYFRAMES = '@keyframes '
    PREFIX = ['webkit', 'Moz', 'ms', 'o']

    //针对win8的处理
    MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i

    //支持触屏
    SUPPORT_TOUCH = ('ontouchstart' in window)

    //支持鼠标
    SUPPORT_MOUSE = ('onmousedown' in window)

    //移动端仅仅只支持touch
    SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

    //判断是否为浏览器
    //http://localhost:12344/index.html
    location = document.location.href
    boolBrowser = location.indexOf('http') > -1 || location.indexOf('https') > -1;


    prefixStyle = function(attr) {
        var name
            //缓存中存在
        if (_cache[attr]) {
            return _cache[attr];
        }
        //不需要加前缀
        if (attr in _style) {
            return _cache[attr] = attr;
        }
        //需要加前缀
        _.each(PREFIX, function(v) {
            if (jQuery.camelCase(v + '-' + attr) in _style) {
                name = '-' + v + '-' + attr;
                return _cache[attr] = name;
            }
        })
        return name;
    }

    ;
    (function() {
        var vendors = prefixStyle('animation')
        var TRANSITION_END_NAMES = {
            "moz": "transitionend",
            "webkit": "webkitTransitionEnd",
            "ms": "MSTransitionEnd",
            "o": "oTransitionEnd"
        }
        var ANIMATION_END_NAMES = {
            "moz": "animationend",
            "webkit": "webkitAnimationEnd",
            "ms": "MSAnimationEnd",
            "o": "oAnimationEnd"
        }
        if (!vendors) return;
        vendors = vendors.split('-');
        if (!vendors[1]) return;
        TRANSITION_END = TRANSITION_END_NAMES[vendors[1]];
        ANIMATION_END = ANIMATION_END_NAMES[vendors[1]];
        KEYFRAMES = '@-' + vendors[1] + '-keyframes ';
    })()


    var evtTarget = function(event, original) {
        var currTouches = null;
        if (SUPPORT_ONLY_TOUCH) {
            currTouches = event.touches;
            if (currTouches && currTouches.length > 0) {
                event = currTouches[0];
            }
        }
        return original ? event : event.target;
    }


    isBrowser = boolBrowser ? boolBrowser : !SUPPORT_ONLY_TOUCH

    Xut.plat = {
        has3d: has3d,
        isAndroid: isAndroid,
        isIphone: isIphone,
        isIpad: isIpad,
        isIOS: isIOS,
        isWebKit: isWebKit,

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
        noAutoPlayMedia: !isWeiXin && isBrowser && isWebKit && (isIOS || isAndroid),

        isIOS7: isIOS7,
        isOverflow: ("WebkitOverflowScrolling" in _style),
        hasTouch: SUPPORT_ONLY_TOUCH,
        //游览器平台 解决ios Android浏览器判断问题
        isBrowser: isBrowser,
        //2015.3.23
        //可以点击与触摸
        isSurface: SUPPORT_TOUCH && SUPPORT_MOUSE && !SUPPORT_ONLY_TOUCH,
        RESIZE_EV: 'onorientationchange' in window ? 'orientationchange' : 'resize',
        START_EV: SUPPORT_ONLY_TOUCH ? 'touchstart' : 'mousedown',
        MOVE_EV: SUPPORT_ONLY_TOUCH ? 'touchmove' : 'mousemove',
        END_EV: SUPPORT_ONLY_TOUCH ? 'touchend' : 'mouseup',
        CANCEL_EV: SUPPORT_ONLY_TOUCH ? 'touchcancel' : 'mouseup',
        ANIMATION_END: ANIMATION_END,
        TRANSITION_END: TRANSITION_END,
        evtTarget: evtTarget,
        prefixStyle: prefixStyle,
        KEYFRAMES: KEYFRAMES,
        noMaskBoxImage: prefixStyle('mask-box-image') == undefined
    }

})()
