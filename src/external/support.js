/**
 * 设备平台判断
 * @return {[type]} [description]
 */
;
(function() {

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
  var isWeiXin = device.find('micromessenger') //微信
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
   * 无痕浏览的模式
   * 导致localStorage报错
   * @param  {[type]} typeof localStorage  [description]
   * @return {[type]}        [description]
   */
  var supportStorage = true
  if (typeof localStorage === 'object') {
    try {
      localStorage.setItem('localStorage', 1);
      localStorage.removeItem('localStorage');
    } catch (e) {
      Storage.prototype._setItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function() {};
      supportStorage = false
    }
  }

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

    isWeiXin: isWeiXin,

    /**
     * 是否支持
     * @type {[type]}
     */
    supportStorage: supportStorage,

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

    /**
     * ios版本号
     * @type {[type]}
     */
    iosVersion: iosMainVersion,

    /*
    ios的版本>=10 支持视频行内播放
     */
    supportPlayInline: iosMainVersion >= 10,

    /**
     * 需要修复音频
     * 修复不能自动播放的情况
     * 不是微信 && 手机浏览器 或 ipad
     * @type {[type]}
     */
    fixWebkitAutoAudio: (function() {

      //微信用自己api播放
      if (isWeiXin) {
        return false
      }

      var localhost = /localhost/ig.test(window.location.href)

      //2017.11.28
      //读库客户端支持自动播放
      //只有ios的客户端才可以，客户端内部通过浏览器打开
      if (window.DUKUCONFIG && isIOS && localhost) {
        return false
      }

      //浏览器打开
      if (isBrowser) {

        //pc端测试
        if (localhost) {
          return false
        }

        //移动端ipad 手机不支持自动播放
        if (device.mobile() || device.tablet()) {
          return true
        }

      }

    })(),

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
  var fcamelCase = function(all, letter) {
    return (letter + '').toUpperCase();
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
    if (cache[attr]) {
      return cache[attr];
    }
    //不需要加前缀
    if (attr in elementStyle) {
      return cache[attr] = attr;
    }
    //需要加前缀
    prefix.forEach(function(v) {
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
  var adapterPrefix = function() {
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
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };


  ////////////////////
  /// 样式style支持
  ////////////////////

  function setTranslateStyle(x, y) {
    return 'translate(' + x + 'px,' + y + 'px)' + translateZ
  }
  var transitionDuration = prefixStyle('transition-duration')
  var transform = prefixStyle('transform')

  /**
   * 获取真的node
   * 1 jquery转化成node
   * 2 普通node
   * 3 jquery是svg但是没有lenght有context
   * @param  {[type]} node [description]
   * @return {[type]}      [description]
   */
  function getNode(node) {
    if (!node) {
      console.log('setTranslate没有提供node')
      return false
    }

    /*如果是jquery对象*/
    if (node instanceof $) {
      /*svg对象length=0所以还需要取context*/
      node = node[0] || node['context']
      if (!node) {
        console.log('setTranslate node不存在,需要检测')
        return false
      }
    }

    return node
  }

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
    transform: transform,
    transition: prefixStyle('transition'),
    transitionDuration: transitionDuration,
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
     * 设置Translate
     * @param {[type]} node [description]
     * @param {[type]} x    [description]
     * @param {[type]} y    [description]
     */
    setTranslateStyle: setTranslateStyle,

    /**
     * 多种组合
     * translate
     * scale
     * 等等
        Xut.style.setTransform({
          speed,
          translate: {
            x: data.translate.x
            y: data.translate.y
          },
          scale: {
            x: data.scale,
            y: data.scale
          },
          node: this.rootNode
        })
        styleText = `translate3d(${}px,${}px,0px) scale(${data.scale},${data.scale})`
     */
    setTransform: function(options) {
      var node = options.node
      if (node = getNode(node)) {
        var styleText = ''
        var translate = options.translate
        if (translate) {
          var translateX = translate.x || 0
          var translateY = translate.y || 0
          styleText += setTranslateStyle(translateX, translateY)
        }
        var scale = options.scale
        if (scale) {
          var scaleX = scale.x || 1
          var scaleY = scale.y || 1
          styleText += 'scale(' + scaleX + ',' + scaleY + ') '
        }
        if (styleText) {
          /*设置styleText*/
          node.style[transform] = styleText;
          /*设置时间*/
          if (options.speed !== undefined) {
            node.style[transitionDuration] = options.speed + 'ms'
          }
        }
      }
    },

    /**
     * 设置setTranslate
     * 1 node是普通的对象
     * 2 node是jquery对象
     *   如果是svg的情况jquery有context但是lenght为0
     * 3 设置xy
     * 4 设置文本style
     * 5 设置事件
     * @param {[type]} options [description]
     */
    setTranslate: function(options) {
      var node = options.node
      var x = options.x || 0
      var y = options.y || 0
      var speed = options.speed
      if (node = getNode(node)) {
        /*Translate*/
        node.style[transform] = setTranslateStyle(x, y);
        /*设置动画的时间*/
        if (speed !== undefined) {
          node.style[transitionDuration] = speed + 'ms'
        }
      }
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
