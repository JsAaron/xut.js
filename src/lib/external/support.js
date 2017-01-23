/**
 * 设备平台判断
 * @return {[type]} [description]
 */
;
(function() {

    var location     = document.location.href
    //在读酷pc端 navigator的值被改写过了!!
    //navigator.appVersion: "xxt 1.0.5260.29725"
    var userAgent    = window.navigator.userAgent.toLowerCase()
    var appVersion   = window.navigator.appVersion.toLowerCase()
    var findPlatform = function(needle) {
        return appVersion.indexOf(needle) !== -1;
    }

    var isMacOS      = device.find('mac')
    var isIphone     = device.iphone()
    var isIpad       = device.ipad()
    var isIOS        = device.ios()
    var isWebKit     = findPlatform('applewebkit')//webkit内核
    var isWeiXin     = findPlatform('micromessenger')//微信
    var hasTouch     = ('ontouchstart' in window)//支持触屏
    var hasMouse     = ('onmousedown' in window)//支持鼠标
    var onlyTouch    = hasTouch && device.mobile() //移动端仅仅只支持touch
    //判断是否为浏览器
    //http           ://localhost:12344/index.html
    var boolBrowser  = location.indexOf('http') > -1 || location.indexOf('https') > -1;
    var isBrowser    = boolBrowser ? boolBrowser : !onlyTouch

    //有hasMutationObserverBug
    //detecting iOS UIWebView by indexedDB
    var iosVersionMatch = isIOS && userAgent.match(/os ([\d_]+)/)
    var iosVersion      = iosVersionMatch && iosVersionMatch[1].split('_')
    var hasMutationObserverBug = iosVersion && Number(iosVersion[0]) >= 9 && Number(iosVersion[1]) >= 3 && !window.indexedDB

    /**
     * 平台支持
     */
    Xut.extend(Xut.plat, {
        has3d     :  'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
        isAndroid : device.android(),
        isIphone  : isIphone,
        isIpad    : isIpad,
        isIOS     : isIOS,
        isMacOS   : isMacOS,

        /**
         * 是平板设备
         * ipad
         * android Tablet
         */
        isTablet: device.tablet(),

        hasMutationObserverBug: hasMutationObserverBug,

        /**
         * 是否在支持插件
         * phonegap
         * @type {Boolean}
         */
        hasPlugin: false,

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
        noAutoPlayMedia: !isWeiXin && isBrowser && onlyTouch,

        /**
         * 支持触摸
         */
        hasTouch: hasTouch,

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
        isSurface: hasTouch && hasMouse && !onlyTouch,

        /**
         * 是否桌面
         * @type {Boolean}
         */
        isDesktop: device.desktop()
    })


    //私有前缀
    var rdashAlpha = /-([a-z]|[0-9])/ig
    var rmsPrefix = /^-ms-/
    var fcamelCase = function(all, letter) {
        return(letter + '').toUpperCase();
    }
    var camelCase = function(string) {
        return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
    }
    var prefix = ['webkit', 'Moz', 'ms', 'o']
    var elementStyle = document.createElement('div').style
    var cache = Object.create(null)
    var prefixStyle = function(attr) {
        var name
        //缓存中存在
        if(cache[attr]) {
            return cache[attr];
        }
        //不需要加前缀
        if(attr in elementStyle) {
            return cache[attr] = attr;
        }
        //需要加前缀
        prefix.forEach(function(v) {
            if(camelCase(v + '-' + attr) in elementStyle) {
                name = '-' + v + '-' + attr;
                return cache[attr] = name;
            }
        })
        return name;
    }

    //css3 keyframes
    var transitionEnd = 'transitionend'
    var animationEnd = 'animationend'
    var keyframes = '@keyframes '
    var animation = prefixStyle('animation');
    var adapterPrefix = function() {
        var vendors = animation
        var transitionName = {
            "moz"    : "transitionend",
            "webkit" : "webkitTransitionEnd",
            "ms"     : "MSTransitionEnd",
            "o"      : "oTransitionEnd"
        }
        var animationName = {
            "moz"    : "animationend",
            "webkit" : "webkitAnimationEnd",
            "ms"     : "MSAnimationEnd",
            "o"      : "oAnimationEnd"
        }
        if(!vendors) return;
        vendors = vendors.split('-');
        if(!vendors[1]) return;
        transitionEnd = transitionName[vendors[1]];
        animationEnd = animationName[vendors[1]];
        keyframes = '@-' + vendors[1] + '-keyframes ';
    }
    adapterPrefix()


    /**
     * 支持转换效果
     * @type {Boolean}
     */
    var hasPerspective = prefixStyle('perspective') in elementStyle
    var translateZ = hasPerspective ? ' translateZ(0)' : ''
    var maskBoxImage = prefixStyle('mask-box-image')

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
        prefixStyle: prefixStyle,

        /**
         * transform
         * @type {[type]}
         */
        transform: prefixStyle('transform'),
        transition: prefixStyle('transition'),
        transitionDuration: prefixStyle('transition-duration'),
        transitionDelay: prefixStyle('transition-delay'),
        transformOrigin: prefixStyle('transform-origin'),
        transitionTimingFunction: prefixStyle('transition-timing-function'),
        transitionEnd: transitionEnd,

        /**
         * css3 admination
         * @type {[type]}
         */
        animation: animation,
        animationDelay: prefixStyle('animation-delay'),
        animationPlayState: prefixStyle('animation-play-state'),
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
        filter: prefixStyle('filter'),
        maskBoxImage: maskBoxImage,
        borderRadius: prefixStyle('border-radius'),

        /**
         * css3分栏
         * @type {[type]}
         */
        columnWidth: prefixStyle('column-width'),
        columnGap: prefixStyle('column-gap')

    })

})()
