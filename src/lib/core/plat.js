///////////
//设备平台判断 //
///////////
;(function() {

  //在读酷pc端 navigator的值被改写过了!!
  //navigator.appVersion: "xxt 1.0.5260.29725"
   var ua =  navigator.userAgent,
       uv = navigator.appVersion,
       _style         = document.documentElement.style,
       _cache         = {},
       TRANSITION_END = 'transitionend',
       ANIMATION_END  = 'animationend',
       KEYFRAMES      = '@keyframes ',
       isAndroid      = (/android/gi).test(uv),
       isIphone       = (/iphone|ipod/gi).test(ua),
       isIpad         = (/ipad/gi).test(ua),
       isIOS          = isIphone || isIpad,
       isIOS7         = isIOS && (/OS\s7/gi).test(ua),
       has3d          = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix();

       //针对win8的处理
       var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;
       //支持触屏
       var SUPPORT_TOUCH = ('ontouchstart' in window);
       //支持鼠标
       var SUPPORT_MOUSE = ('onmousedown' in window);

       //移动端仅仅只支持touch
       var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

       //判断是否为浏览器
       var org_href = document.location.href;
       var boolBrowser = org_href.indexOf('http') > -1 || org_href.indexOf('https') > -1;

       function evtTarget(event, original) {
           var currTouches = null;
           if (SUPPORT_ONLY_TOUCH) {
             currTouches = event.touches;
             if (currTouches && currTouches.length > 0) {
               event = currTouches[0];
             }
           }
           return original ? event : event.target;
       }

       function prefixStyle(attr) {
          var vendors = ['webkit', 'Moz', 'ms', 'o'];
          var name;
          //缓存中存在
          if(_cache[attr]){
            return _cache[attr];
          }
          //不需要加前缀
          if(attr in _style){
            return _cache[attr] = attr;
          }
          //需要加前缀
          _.each(vendors,function(v){
            if(jQuery.camelCase(v+'-'+attr) in _style){
              name = '-' + v + '-' + attr;
              return _cache[attr] = name;
            }
          })

          return name;
      }

    (function() {
      var vendors, TRANSITION_END_NAMES, ANIMATION_END_NAMES;
      vendors = prefixStyle('animation'),
        TRANSITION_END_NAMES = {
          "moz"    : "transitionend",
          "webkit" : "webkitTransitionEnd",
          "ms"     : "MSTransitionEnd",
          "o"      : "oTransitionEnd"
        }
      ANIMATION_END_NAMES = {
        "moz"    : "animationend",
        "webkit" : "webkitAnimationEnd",
        "ms"     : "MSAnimationEnd",
        "o"      : "oAnimationEnd"
      };

      if (!vendors) return;
      vendors = vendors.split('-');
      if (!vendors[1]) return;
      
      TRANSITION_END = TRANSITION_END_NAMES[vendors[1]];
      ANIMATION_END = ANIMATION_END_NAMES[vendors[1]];
      KEYFRAMES = '@-' + vendors[1] + '-keyframes ';
    })();


    //平台判断参数
    var plat = Xut.plat = {
        has3d          : has3d,
        isAndroid      : isAndroid,
        isIphone       : isIphone,
        isIpad         : isIpad,
        isIOS          : isIOS,
        isIOS7         : isIOS7,
        isOverflow     : ("WebkitOverflowScrolling" in _style),
        hasTouch       : SUPPORT_ONLY_TOUCH,
        //游览器平台 解决ios Android浏览器判断问题
        isBrowser      : boolBrowser ? boolBrowser : !SUPPORT_ONLY_TOUCH,
        //2015.3.23 
        //可以点击与触摸
        isSurface      : SUPPORT_TOUCH && SUPPORT_MOUSE && !SUPPORT_ONLY_TOUCH,
        RESIZE_EV      : 'onorientationchange' in window ? 'orientationchange' : 'resize',
        START_EV       : SUPPORT_ONLY_TOUCH ? 'touchstart' : 'mousedown',
        MOVE_EV        : SUPPORT_ONLY_TOUCH ? 'touchmove' : 'mousemove',
        END_EV         : SUPPORT_ONLY_TOUCH ? 'touchend' : 'mouseup',
        CANCEL_EV      : SUPPORT_ONLY_TOUCH ? 'touchcancel' : 'mouseup',
        ANIMATION_EV   : ANIMATION_END,
        TRANSITION_END : TRANSITION_END,
        evtTarget      : evtTarget,
        prefixStyle    : prefixStyle,
        KEYFRAMES      : KEYFRAMES,
        noMaskBoxImage : prefixStyle('mask-box-image') == undefined
    };

 })();

