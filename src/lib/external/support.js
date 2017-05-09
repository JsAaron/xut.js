/**
 * 设备平台判断
 * @return {[type]} [description]
 */
;
(function () {

  var location = document.location.href
    //在读酷pc端 navigator的值被改写过了!!
    //navigator.appVersion: "xxt 1.0.5260.29725"
  var userAgent = window.navigator.userAgent.toLowerCase()
  var appVersion = window.navigator.appVersion.toLowerCase()

  var isAndroid = device.android() || (/android/gi).test(appVersion)
  var isDesktop = device.desktop()
  var isMacOS = device.find('mac')
  var isIphone = device.iphone()
  var isIpad = device.ipad()
  var isIOS = device.ios()
  var isWebKit = device.find('applewebkit') //webkit内核
  var isWeiXin = device.find('micromessenger') && window.WeixinJSBridge //微信
  var hasTouch = ('ontouchstart' in window) //支持触屏

  //针对win8的处理
  var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;
  //移动端仅仅只支持touch
  var only_touch = hasTouch && MOBILE_REGEX.test(userAgent);
  //判断是否为浏览器
  var boolBrowser = location.indexOf('http') > -1 || location.indexOf('https') > -1
  var isBrowser = boolBrowser ? boolBrowser : !only_touch

  /*ios版本*/
  var iosVersionMatch = isIOS && userAgent.match(/os ([\d_]+)/)
  var iosVersion = iosVersionMatch && iosVersionMatch[1].split('_')

  /*是否支持hasMutationObserverBug*/
  var hasMutationObserver = false
  var iosMainVersion = null
  if (iosVersion) {
    iosMainVersion = Number(iosVersion[0])
    hasMutationObserver = iosMainVersion >= 9 && Number(iosVersion[1]) >= 3 && !window.indexedDB
  }

  /*安卓版本*/
  var androidVersionMatch = isAndroid && userAgent.match(/android ([\d_]+)/)
  var androidVersion = androidVersionMatch && androidVersionMatch[1].split('_')

  /**
   * 平台支持
   */
  Xut.mixin(Xut.plat, {
    has3d: 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
    isAndroid: isAndroid,
    isIphone: isIphone,
    isIpad: isIpad,
    isIOS: isIOS,
    isMacOS: isMacOS,

    androidVersion: androidVersion,

    /**
     * 是平板设备
     * ipad
     * android Tablet
     */
    isTablet: device.tablet(),

    /**
     * 是否在支持插件
     * phonegap
     * @type {Boolean}
     */
    hasPlugin: false,

    /*
    ios的版本>=10 支持视频行内播放
     */
    supportPlayInline: iosMainVersion >= 10,

    /**
     * 是否能自动播放媒体
     * audio
     * video
     * @type {[type]}
     * 浏览器端
     * 不是微信
     * 是webkit
     * 是手机端浏览器
     */
    hasAutoPlayAudio: isWeiXin || isDesktop,

    /**
     * 支持触摸
     */
    hasTouch: only_touch,

    /**
     * 游览器平台 解决ios Android浏览器判断问题
     * @type {Boolean}
     */
    isBrowser: isBrowser,

    /**
     * 2015.3.23
     * 可以点击与触摸
     * @type {Boolean}
     */
    isMouseTouch: hasTouch && ('onmousedown' in window) && !only_touch,

    /**
     * 是否桌面
     * @type {Boolean}
     */
    isDesktop: isDesktop,

    /**
     * 是否支持Mutation
     * @type {Boolean}
     */
    supportMutationObserver: !hasMutationObserver
  })


  //私有前缀
  var rdashAlpha = /-([a-z]|[0-9])/ig
  var rmsPrefix = /^-ms-/
  var fcamelCase = function (all, letter) {
    return (letter + '').toUpperCase();
  }
  var camelCase = function (string) {
    return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
  }
  var prefix = ['webkit', 'Moz', 'ms', 'o']
  var elementStyle = document.createElement('div').style
  var cache = Object.create(null)
  var prefixStyle = function (attr) {
    var name
      //缓存中存在
    if (cache[attr]) {
      return cache[attr];
    }
    //不需要加前缀
    if (attr in elementStyle) {
      return cache[attr] = attr;
    }
    //需要加前缀
    prefix.forEach(function (v) {
      if (camelCase(v + '-' + attr) in elementStyle) {
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
  var adapterPrefix = function () {
    var vendors = animation
    var transitionName = {
      "moz": "transitionend",
      "webkit": "webkitTransitionEnd",
      "ms": "MSTransitionEnd",
      "o": "oTransitionEnd"
    }
    var animationName = {
      "moz": "animationend",
      "webkit": "webkitAnimationEnd",
      "ms": "MSAnimationEnd",
      "o": "oAnimationEnd"
    }
    if (!vendors) return;
    vendors = vendors.split('-');
    if (!vendors[1]) return;
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
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };


  /**
   * 样式style支持
   * @type {Object}
   */
  Xut.mixin(Xut.style, {

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
    setTranslateZ: function (zValue) {
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
