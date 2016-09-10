/**
 * 设备平台判断
 * @return {[type]} [description]
 */
;
(function() {

    //在读酷pc端 navigator的值被改写过了!!
    //navigator.appVersion: "xxt 1.0.5260.29725"
    var ua = navigator.userAgent
    var uv = navigator.appVersion
    var isAndroid = (/android/gi).test(uv)
    var isIphone = (/iphone|ipod/gi).test(ua)
    var isIpad = (/ipad/gi).test(ua)
    var isIOS = isIphone || isIpad
    var isIOS7 = isIOS && (/OS\s7/gi).test(ua)
    var has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix()

    //webkit内核
    var isWebKit = /AppleWebKit/ig.test(uv)

    //微信
    var isWeiXin = /MicroMessenger/ig.test(uv)

    //针对win8的处理
    var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i

    //支持触屏
    var SUPPORT_TOUCH = ('ontouchstart' in window)

    //支持鼠标
    var SUPPORT_MOUSE = ('onmousedown' in window)

    //移动端仅仅只支持touch
    var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

    //判断是否为浏览器
    //http://localhost:12344/index.html
    var location = document.location.href
    var boolBrowser = location.indexOf('http') > -1 || location.indexOf('https') > -1;

    /**
     * 私有前缀
     * @type {[type]}
     */
    var _elementStyle = document.createElement('div').style;
    var _vendor = (function() {
        var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
            transform,
            i = 0,
            l = vendors.length;

        for (; i < l; i++) {
            transform = vendors[i] + 'ransform';
            if (transform in _elementStyle) return vendors[i].substr(0, vendors[i].length - 1);
        }

        return false;
    })();

    function _prefixStyle(style) {
        if (_vendor === false) {
            return false
        }
        if (_vendor === '') {
            return style
        }
        return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
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

    /**
     * 平台支持
     * @type {Object}
     */
    Xut.plat = {
        has3d: has3d,
        isAndroid: isAndroid,
        isIphone: isIphone,
        isIpad: isIpad,
        isIOS: isIOS,
        isIOS7: isIOS7,

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
    }




    /**
     * 支持转换效果
     * @type {Boolean}
     */
    var hasPerspective = _prefixStyle('perspective') in _elementStyle
    var translateZ = hasPerspective ? ' translateZ(0)' : ''

    /**
     * 样式style支持
     * @type {Object}
     */
    Xut.style = {

        /**
         * 不支持蒙版
         * @type {[type]}
         */
        noMaskBoxImage: _prefixStyle('mask-box-image') == undefined,

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
        transitionDuration: _prefixStyle('transitionDuration'),
        transitionDelay: _prefixStyle('transitionDelay'),
        transformOrigin: _prefixStyle('transformOrigin'),
        transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
        transitionEnd: transitionEnd,

        /**
         * css3 admination
         * @type {[type]}
         */
        animation: animation,
        animationEnd: animationEnd,
        keyframes: keyframes,

        translateZ: translateZ,

        /**
         * css3 playState
         * @type {[type]}
         */
        animationPlayState: _prefixStyle('animationPlayState'),


        animationDelay: _prefixStyle('animationDelay'),
        filter: _prefixStyle('filter'),

        /**
         * mask-box-image
         * @type {[type]}
         */
        maskBoxImage: _prefixStyle('maskBoxImage'),

        /**
         * css3分栏
         * @type {[type]}
         */
        columnWidth: _prefixStyle('columnWidth'),
        columnGap: _prefixStyle('columnGap')
    }

})()
