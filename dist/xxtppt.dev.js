(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

/**
 * 资源路径
 * resource 就是图片音频数据文件
 * widget 是零件资源文件
 * @type {String}
 */
var defaultSourcePath = "content/gallery/";
var defaultWidgetPath = "content/widget/";

/**
 * 资源根路径
 * @type {String}
 */
var getSourcePath = function getSourcePath() {
  if (config.launch.resource) {
    return config.launch.resource + '/gallery/';
  } else {
    return defaultSourcePath;
  }
};

/**
 * 零件
 * @param  {[type]} 'source' [description]
 * @return {[type]}          [description]
 */
var getWidgetPath = function getWidgetPath() {
  if (config.launch.resource) {
    return config.launch.resource + '/widget/';
  } else {
    return defaultWidgetPath;
  }
};

var isIOS = Xut.plat.isIOS;
var isAndroid = Xut.plat.isAndroid;

//杂志直接打开
var nativeConfig = {

  /**
   * 资源图片
   * @return {[type]} [description]
   */
  resources: function resources(config) {
    if (isIOS) {
      return getSourcePath();
    }
    if (isAndroid) {
      if (parseInt(config.launch.storageMode)) {
        //sd卡加载资源数据
        return "/sdcard/appcarrier/magazine/" + config.data.appId + "/" + getSourcePath();
      } else {
        //android_asset缓存加载资源
        return "/android_asset/www/" + getSourcePath();
      }
    }
  },


  /**
   * 视频路径
   * ios平台在缓存
   * 安卓在编译raw中
   */
  video: function video() {
    if (isIOS) {
      return getSourcePath();
    }
    if (isAndroid) {
      return 'android.resource://#packagename#/raw/';
    }
  },


  /**
   * 音频路径
   * ios平台在缓存
   * 安卓在缓存中
   * @return {[type]} [description]
   */
  audio: function audio() {
    if (isIOS) {
      return getSourcePath();
    }
    if (isAndroid) {
      return "/android_asset/www/" + getSourcePath();
    }
  },


  /**
   * 读取svg路径前缀
   * @return {[type]} [description]
   */
  svg: function svg() {
    return 'www/' + getSourcePath();
  },


  /**
   * js零件
   * 2016.8.3 喵喵学
   * @return {[type]} [description]
   */
  jsWidget: function jsWidget() {
    if (isIOS) {
      return getWidgetPath();
    }
    if (isAndroid) {
      return "/android_asset/www/" + getWidgetPath();
    }
  }
};

var isIOS$1 = Xut.plat.isIOS;
var isAndroid$1 = Xut.plat.isAndroid;
var DUKUCONFIG = window.DUKUCONFIG;
var MMXCONFIG$1 = window.MMXCONFIG;
var CLIENTCONFIGT$1 = window.CLIENTCONFIGT;
var SUbCONFIGT = window.SUbCONFIGT;

/**
 * 读酷模式下的路径
 * @param  {[type]} DUKUCONFIG [description]
 * @return {[type]}                   [description]
 */
if (DUKUCONFIG) {
  DUKUCONFIG.path = DUKUCONFIG.path.replace('//', '/');
}

/**
 * 除右端的"/"
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
var rtrim = function rtrim(str) {
  if (typeof str != 'string') return str;
  var lastIndex = str.length - 1;
  if (str.charAt(lastIndex) === '/') {
    return str.substr(0, lastIndex);
  } else {
    return str;
  }
};

// var MMXCONFIGPath = '.'
// if (MMXCONFIG && MMXCONFIG.path) {
//     MMXCONFIGPath = location.href.replace(/^file:\/\/\/?/i, '/').replace(/[^\/]*$/, '');
// }
var MMXCONFIGPath = location.href.replace(/^file:\/\/\/?/i, '/').replace(/[^\/]*$/, '');
if (MMXCONFIG$1 && MMXCONFIG$1.path) {
  MMXCONFIGPath = rtrim(MMXCONFIG$1.path);
}

/**
 *  通过iframe加载判断当前的加载方式
 *  1 本地iframe打开子文档
 *  2 读酷加载电子杂志
 *  3 读酷加载电子杂志打开子文档
 */
var iframeMode = function () {
  var mode = void 0;
  if (SUbCONFIGT && DUKUCONFIG) {
    //通过读酷客户端开打子文档方式
    mode = 'iframeDuKuSubDoc';
  } else {
    //子文档加载
    if (SUbCONFIGT) {
      mode = 'iframeSubDoc';
    }
    //读酷客户端加载
    if (DUKUCONFIG) {
      mode = 'iframeDuKu';
    }
    //客户端模式
    //通过零件加载
    if (CLIENTCONFIGT$1) {
      mode = 'iframeClient';
    }
    //秒秒学客户端加载
    if (MMXCONFIG$1) {
      mode = 'iframeMiaomiaoxue';
    }
  }
  return mode;
}();

//iframe嵌套配置
//1 新阅读
//2 子文档
//3 秒秒学
var iframeConfig = {

  /**
   * 资源图片
   * @return {[type]} [description]
   */
  resources: function resources() {
    if (isIOS$1) {
      switch (iframeMode) {
        case 'iframeDuKu':
          return DUKUCONFIG.path;
        case 'iframeSubDoc':
          return getSourcePath();
        case 'iframeDuKuSubDoc':
          return getSourcePath();
        case 'iframeClient':
          return CLIENTCONFIGT$1.path;
        case 'iframeMiaomiaoxue':
          return MMXCONFIGPath + '/content/gallery/';
      }
    }

    if (isAndroid$1) {
      switch (iframeMode) {
        case 'iframeDuKu':
          return DUKUCONFIG.path;
        case 'iframeSubDoc':
          return '/android_asset/www/content/subdoc/' + SUbCONFIGT.path + '/content/gallery/';
        case 'iframeDuKuSubDoc':
          return DUKUCONFIG.path.replace('gallery', 'subdoc') + SUbCONFIGT.path + '/content/gallery/';
        case 'iframeClient':
          return CLIENTCONFIGT$1.path;
        case 'iframeMiaomiaoxue':
          return MMXCONFIGPath + '/content/gallery/';
      }
    }
  },


  /**
   * 视频路径
   * @return {[type]} [description]
   */
  video: function video() {
    if (isIOS$1) {
      switch (iframeMode) {
        case 'iframeDuKu':
          return DUKUCONFIG.path;
        case 'iframeSubDoc':
          return getSourcePath();
        case 'iframeDuKuSubDoc':
          return getSourcePath();
        case 'iframeClient':
          return CLIENTCONFIGT$1.path;
        case 'iframeMiaomiaoxue':
          return MMXCONFIGPath + '/content/gallery/';
      }
    }

    if (isAndroid$1) {
      switch (iframeMode) {
        case 'iframeDuKu':
          return DUKUCONFIG.path;
        case 'iframeSubDoc':
          return 'android.resource://#packagename#/raw/';
        case 'iframeDuKuSubDoc':
          return DUKUCONFIG.path.replace('gallery', 'subdoc') + SUbCONFIGT.path + '/content/gallery/';
        case 'iframeClient':
          return CLIENTCONFIGT$1.path;
        case 'iframeMiaomiaoxue':
          return MMXCONFIGPath + '/content/gallery/';
      }
    }
  },


  /**
   * 音频路径
   * @return {[type]} [description]
   */
  audio: function audio() {
    if (isIOS$1) {
      switch (iframeMode) {
        case 'iframeDuKu':
          return DUKUCONFIG.path;
        case 'iframeSubDoc':
          return getSourcePath();
        case 'iframeDuKuSubDoc':
          return getSourcePath();
        case 'iframeClient':
          return CLIENTCONFIGT$1.path;
        case 'iframeMiaomiaoxue':
          return MMXCONFIGPath + '/content/gallery/';
      }
    }
    if (isAndroid$1) {
      switch (iframeMode) {
        case 'iframeDuKu':
          return DUKUCONFIG.path;
        case 'iframeSubDoc':
          return '/android_asset/www/content/subdoc/' + SUbCONFIGT.path + '/content/gallery/';
        case 'iframeDuKuSubDoc':
          return DUKUCONFIG.path.replace('gallery', 'subdoc') + SUbCONFIGT.path + '/content/gallery/';
        case 'iframeClient':
          return CLIENTCONFIGT$1.path;
        case 'iframeMiaomiaoxue':
          return MMXCONFIGPath + '/content/gallery/';
      }
    }
  },


  /**
   * 调用插件处理
   * @return {[type]} [description]
   */
  svg: function svg() {
    if (isIOS$1) {
      switch (iframeMode) {
        case 'iframeDuKu':
          return DUKUCONFIG.path;
        case 'iframeSubDoc':
          //www/content/subdoc/00c83e668a6b6bad7eda8eedbd2110ad/content/gallery/
          return 'www/content/subdoc/' + SUbCONFIGT.path + '/content/gallery/';
        case 'iframeDuKuSubDoc':
          return DUKUCONFIG.path.replace('gallery', 'subdoc') + SUbCONFIGT.path + '/content/gallery/';
        case 'iframeClient':
          return CLIENTCONFIGT$1.path;
        case 'iframeMiaomiaoxue':
          return MMXCONFIGPath + '/content/gallery/';
      }
    }

    if (isAndroid$1) {
      switch (iframeMode) {
        case 'iframeDuKu':
          return DUKUCONFIG.path;
        case 'iframeSubDoc':
          return 'www/content/subdoc/' + SUbCONFIGT.path + '/content/gallery/';
        case 'iframeDuKuSubDoc':
          return DUKUCONFIG.path.replace('gallery', 'subdoc') + SUbCONFIGT.path + '/content/gallery/';
        case 'iframeClient':
          return CLIENTCONFIGT$1.path;
        case 'iframeMiaomiaoxue':
          return MMXCONFIGPath + '/content/gallery/';
      }
    }
  },


  /**
   * js零件
   * 2016.8.3 喵喵学
   * @return {[type]} [description]
   */
  jsWidget: function jsWidget() {
    return MMXCONFIGPath + '/content/widget/';
  }
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var $warn = function $warn() {};

/*
  $warn('hello');
  $warn('信息','info');
  $warn('错误','error');
  $warn('警告','warn');


  debug.success("This is success message:)");
  debug.error("This is error message:)");
  debug.log("This is primary message:)");
  debug.log({a: 1, b: 2});
  debug.log([1,2,3]);
 */
Xut.$warn = $warn;

var CEIL = Math.ceil;

/**
 * 全局可视区域布局处理
 * 4种可选模式，1/2/3/4
 *
 * noModifyValue 是否强制修改值，主要用来第一次进应用探测是否有全局宽度溢出的情况
 */
function getVisualSize(config, fullProportion, setVisualMode, noModifyValue) {

  var screenWidth = config.screenSize.width;
  var screenHeight = config.screenSize.height;

  var newWidth = screenWidth;
  var newHeight = screenHeight;
  var newTop = 0;
  var newLeft = 0;

  if (!setVisualMode) {
    $warn('getVisualSize没有提供setVisualMode');
  }

  /**
   * 模式2：
   * 宽度100%，正比缩放高度
   */
  if (setVisualMode === 2) {

    //竖版PPT
    if (config.pptVertical) {
      //竖版显示：正常
      if (config.screenVertical) {
        newHeight = fullProportion.pptHeight * fullProportion.width;
        newTop = (screenHeight - newHeight) / 2;
      }
      //横版显示：反向
      if (config.screenHorizontal) {
        newWidth = fullProportion.pptWidth * fullProportion.height;
        newLeft = (screenWidth - newWidth) / 2;
      }
    }

    //横版PPT
    if (config.pptHorizontal) {
      //横版显示：正常
      if (config.screenHorizontal) {
        newHeight = fullProportion.pptHeight * fullProportion.width;
        newTop = (screenHeight - newHeight) / 2;
      }
      //竖版显示：反向
      if (config.screenVertical) {
        newHeight = fullProportion.pptHeight * fullProportion.width;
        newTop = (screenHeight - newHeight) / 2;
      }
    }

    //保证模式2高度不能溢出分辨率最大距离
    if (newHeight > screenHeight) {
      newHeight = screenHeight;
      newTop = 0;
    }
  }

  /**
   * 模式3：
   * 高度100%,宽度溢出可视区隐藏
   */
  if (setVisualMode === 3) {

    //竖版：PPT
    if (config.pptVertical) {
      //竖版显示：正常
      if (config.screenVertical) {
        //宽度溢出的情况
        newWidth = fullProportion.pptWidth * fullProportion.height;
        newLeft = (screenWidth - newWidth) / 2;

        //宽度没办法溢出
        //要强制宽度100%
        if (newWidth < screenWidth) {
          newWidth = screenWidth;
          newLeft = 0;
        }
      }
      //横版显示：反向
      if (config.screenHorizontal) {
        newWidth = fullProportion.pptWidth * fullProportion.height;
        newLeft = (screenWidth - newWidth) / 2;
      }
    }

    //横版：PPT
    if (config.pptHorizontal) {

      //横版显示:正常
      if (config.screenHorizontal) {
        newWidth = fullProportion.pptWidth * fullProportion.height;
        newLeft = (screenWidth - newWidth) / 2;

        //宽度没办法溢出
        //要强制宽度100%
        if (!noModifyValue && newWidth < screenWidth) {
          newWidth = screenWidth;
          newLeft = 0;
        }
      }

      //竖版显示：反向
      if (config.screenVertical) {
        newHeight = fullProportion.pptHeight * fullProportion.width;
        newTop = (screenHeight - newHeight) / 2;
      }
    }
  }

  /**
   * 模式1
   * 如果启动了双页模式
   */
  if (config.launch.doublePageMode && setVisualMode === 1) {
    newWidth = newWidth / 2;
  }

  /**
   * 模式5
   */
  if (setVisualMode === 5) {
    newWidth = screenWidth * 2;
  }

  /**
   * 模式2.3.4
   * config.launch.visualMode === 1
   * @return {[type]}
   */
  return {
    width: CEIL(newWidth),
    height: CEIL(newHeight),
    left: CEIL(newLeft),
    top: CEIL(newTop)
  };
}

/**
 * 屏幕尺寸
 * @return {[type]} [description]
 */
function getSize() {
  //如果是IBooks模式处理
  if (Xut.IBooks.Enabled) {
    var screen = Xut.IBooks.CONFIG.screenSize;
    if (screen) {
      return {
        "width": screen.width,
        "height": screen.height
      };
    }
  }

  var clientWidth = document.documentElement.clientWidth || $(window).width();
  var clientHeight = document.documentElement.clientHeight || $(window).height();

  //配置可视区窗口
  //用户在外部指定了可视区域
  if (config.launch.visualHeight) {
    config.launch.visualTop = clientHeight - config.launch.visualHeight;
    clientHeight = config.launch.visualHeight;
  }

  return {
    "width": clientWidth,
    "height": clientHeight
  };
}

/**
 * 排版判断
 * @return {[type]} [description]
 */
function getLayerMode(screenSize) {
  return screenSize.width > screenSize.height ? "horizontal" : "vertical";
}

/**
 * 默认ppt尺寸
 * @type {Number}
 */
var PPTWIDTH = 1024;
var PPTHEIGHT = 768;

/**
 * 获取默认全屏比值关系
 * 用来设置新的view尺寸
 * @param  {[type]} config    [description]
 * @param  {[type]} pptWidth  [description]
 * @param  {[type]} pptHeight [description]
 * @return {[type]}           [description]
 */
function getFullProportion(config, pptWidth, pptHeight) {
  //设备分辨率
  var screenWidth = config.screenSize.width;
  var screenHeight = config.screenSize.height;

  var screenHorizontal = config.screenHorizontal;

  //默认ppt尺寸
  var designWidth = pptWidth ? pptWidth : screenHorizontal ? PPTWIDTH : PPTHEIGHT;
  var designHeight = pptHeight ? pptHeight : screenHorizontal ? PPTHEIGHT : PPTWIDTH;

  //当前屏幕的尺寸与数据库设计的尺寸，比例
  var widthProp = screenWidth / designWidth;
  var heightProp = screenHeight / designHeight;

  return {
    width: widthProp,
    height: heightProp,
    left: widthProp,
    top: heightProp,
    pptWidth: designWidth,
    pptHeight: designHeight
  };
}

/**
 * 计算真正的缩放比
 * 依照真正的view尺寸设置
 * @param  {[type]} pptWidth  [description]
 * @param  {[type]} pptHeight [description]
 * @return {[type]}           [description]
 */
function getRealProportion(config, visualSize, fullProportion) {
  var widthProp = visualSize.width / fullProportion.pptWidth;
  var heightProp = visualSize.height / fullProportion.pptHeight;

  //布局的偏移量，可能是采用了画轴模式，一个可视区可以容纳3个页面
  var offsetTop = 0;
  var offsetLeft = 0;

  return {
    width: widthProp,
    height: heightProp,
    left: widthProp,
    top: heightProp,
    offsetTop: offsetTop,
    offsetLeft: offsetLeft
  };
}

/**
 * 全局配置文件
 * 2种使用方式
 *   1：Xut.Application.setConfig
 *   2：Xut.Application.Launch
 * @type {[type]}
 */

var DEFAULT = undefined;

var improtGolbalConfig = {

  /**
   * 应用的加载模式
   * 0： 应用自行启动
   * 1： 应用通过接口启动
   *     Xut.Application.Launch
   *     提供全局可配置参数
   * @type {Number}
   */
  lauchMode: 0,

  /**
   * 页面可视模式
   * 2016.9.19
   * 4种分辨率显示模式:
   * 默认全屏缩放
   * 1：永远100%屏幕尺寸自适应
   * 2：宽度100% 正比自适应高度
   *     横版PPT：
   *        1：横板显示(充满全屏。第1种模式)
   *        2：竖版显示(宽度100%。上下自适应，显示居中小块)
   *     竖版PPT:
   *        1: 竖版显示(宽度100%。上下空白，显示居中，整体缩短, 整理变化不大)
   *        2: 在横版显示(高度100%，缩放宽度，左右留边)
   *
   * 3: 高度100%,宽度溢出可视区隐藏
   * 4：高度100% 正比自适应宽度
   *     横版：
   *        1：横板显示(充满全屏。第1种模式)
   *        2：竖版显示(宽度100%。上下自适应，显示居中小块)
   *     竖版:
   *        1: 竖版ppt竖版显示(高度100%。宽度溢出，只显示中间部分，整体拉长)
   *        2: 竖版ppt在横版显示(高度100%，显示居中，左右空白，整体缩短)
   *
   * 5: 竖版显示横版PPT：高度100%，双页面模式
   *
      1 全屏自适应
      2 宽度100%，自适应高度
      3 高度100%, 自适应宽度
      4 画轴模式
      5 虚拟页面模式
        用户接口设定> PPT数据库设定 > 默认取1
   */
  visualMode: DEFAULT, //等填充


  /**
   * 全局翻页模式
   * 给妙妙单独开的一个模式
   * 一个novel对应多个season表 所以这里其实不能算全局设置，可以存在多个novel
   * novel表定义，数据库定义的翻页模式
   * 用来兼容客户端的制作模式
   * 妙妙学模式处理，多页面下翻页切换
   *
   * 后期增加竖版模式修正接口
   *
   * scrollMode
   *   横版翻页 horizontal  h
   *   竖版翻页 vertical    v
   *
   */
  scrollMode: 'h',

  /**
   * 是否锁定页面移动
   * false 不锁定，可以移动
   * true 锁定，不能移动
   * @type {Boolean}
   */
  banMove: DEFAULT, //等之后全局设置，或者数据库填充，这里可以全局优先

  /**
   * 是否预加载资源
   * 每次翻页必须等待资源加载完毕后才可以
   * @type {Boolean}
   */
  preload: DEFAULT, //可以填数量，预加载的数量限制

  /*
  资源转化处理，默认资源可能是svg，在跨域的情况下没办法访问
  比如，mini客户端
  所以svg的资源会强制转化成js
  这里要填写'svg'
   */
  convert: DEFAULT, //默认不处理svg转化  参数 'svg'

  /**
   * 是否关闭启动动画，默认是true启动，false为关闭
   * 加快进入的速度
   */
  launchAnim: true,

  /**
   * 双页面模式，竖版ppt在横版显示
   * 一个view中，显示2个page
   * 一个页面宽度50%，拼接2个页面100%
   * 默认禁止：
   * 1 true 启动
   * 2 false 禁止
   */
  doublePageMode: false,

  /**
   * 监听代码追踪
   * type:类型
   *   keepAppTime //应用运行时间
   *   keepPageTime //每个页面运行时间
   *   action => (包含，content的事件，action,audio,video,widget零件触发的事件)
   *
   *  options:参数
   *    keepAppTime => time 运行时间
   *    keepPageTime => time 运行时间
   *
   *    action => {
   *      appId  应用的id
   *      appName 应用标题
   *      id 元素的id
   *      type  触发的类型
   *      pageId 页面的id,对应数据库chapter ID
   *      eventName 事件名
   *    }
   *
    Xut.Application.Watch('trackCode', function(type, options) {
        console.log(type, options)
        switch (type) {
            case 'launch':
                break;
            case 'init':
                break;
            case 'exit':
                break;
            ...........
        }
    }
    launch    应用启动后触发
    init      初始化加载完毕，能显示正常页面后触发
    exit      应用关闭触发
    flip      翻页触发
    content   点击有事件对象触发(content类型)
    hot       点击没有绑定事件,但是又能触发的对象(除了content的其余对象)
    swipe     垂直滑动触发
      ['launch', 'init', 'exit', 'flip', 'content', 'hot'，'swipe']
      特别注意，配置中有'content' 'hot'
    但是实际返回的数据中改成了统一接口 action然后type带类型
     */
  trackCode: null,

  /**
  * 图片模式webp
     0：旧版本
     1：自适应
     2：Ios
     3：Android
  、
     brModel === 0，则什么都不变
     brModel === 1/2/3，
       在线版：
         brModel为ios或android，获取了数据库的文件名之后，去掉扩展名。
         如果是ios，则文件名之后加上_i，Android，则文件名之后，加上_a。
         本地版：
         brModel为ios或android，获取了数据库的文件名之后，去掉扩展名
         图像带有蒙板
         首先，忽略蒙板设置
         然后按照上面的规则，合成新的文件名即
  */
  brModel: 0,

  /**
   * 是否启动分栏高度检测
   * 变更依赖
   * 如果检测到有column数据，会自动启动
   */
  columnCheck: DEFAULT, //如果强制false了就是永远关闭，如果DEFAULT就让其默认处理

  /**
   * 迷你杂志页码显示配置
   * 1 数字 digital (默认)
   * 2 原点 circular {
   *            mode: 1/2/3/4/5/6
   *            position:
   *        }
   * 3 滚动工具栏 scrollbar
   *             direction 滚动方向 'v' / 'h'
   *
   * 组合模式['digital','circular','scrollbar']
   * @type {Object}
   */
  pageBar: {
    type: 'digital',
    mode: DEFAULT,
    position: DEFAULT
  },

  /**
   * 是否支持鼠标滑动
   * @type {Boolean}
   * false 关闭
   */
  mouseWheel: DEFAULT, //默认根据横竖屏幕自定义

  /**
   * 适配平台
   * mini //迷你杂志
   * @type {[type]}
   */
  platform: DEFAULT,

  /**
   * 是否支持快速翻页
   * 这个为超星处理，可以配置关闭快速翻页，必须要等页面创建完毕后才能翻页
   */
  quickFlip: true, //默认是支持

  /**
   * 支持二维码图片
   * 如果有二维码针对img元素放开默认行为的阻止
   * @type {Boolean}
   */
  supportQR: false,

  /**
   * 控制可视区的高度
   * 给mini杂志的客户端使用
   * 因为有工具栏挤压的问题
   */
  visualHeight: DEFAULT,
  visualTop: 0, //根据高度内部算出的top提供给缩放图片的全屏放大使用

  /**
   * 忙碌光标
   * 1 cursor:false 关闭
   * 2 可配置
   *   cursor: {
   *      url: 'images/icons/showNote.png',
   *      time: 500
   *   },
   * @type {[type]}
   */
  cursor: {
    delayTime: DEFAULT, //延时间显示时间
    url: DEFAULT //url
  },

  /**
   * 启动自适应图片分辨率
   * iphone的750*1334，android的720*1280及以下的设备，用标准的
   * iphone plus的1080*1920，android的1080*1920，用mi后缀的
   * android的1440*2560用hi后缀的
   *{
   *   750: '', //0-750
   *   1080: '', //mi:751-1080
   *   1440: '' //hi:1081->
   *}
   */
  imageSuffix: null,

  /**
   * @私有方法
   * 基础图片后缀
   * content类型
   * flow类型
   * @type {String}
   * 通过imageSuffix方法填充
   */
  baseImageSuffix: '',

  /**
   * 不使用高清图片
   * false
   * true
   */
  useHDImageZoom: true,

  /**
   * 是否允许图片缩放
   */
  salePicture: true, //默认启动图片缩放的
  salePictureMultiples: 4, //默认缩放的倍数4倍

  /**
   * 是否允许页面缩放页面
   * 默认情况下页面是不允许被缩放的
   * @type {[type]}
   * salePageType:'flow' / 'page' / 'all'
   * 可选项，缩放流式页面
   *        缩放page页面
   *        all全部支持
   */
  salePageType: DEFAULT, //默认页面是不允许被缩放的，这里可以单独启动页面缩放

  /**
   * 是否需要保存记录加载
   * 1 true 启动缓存
   * 2 false 关闭缓存
   * @type {[type]}
   */
  historyMode: DEFAULT, //不处理，因为有调试的方式

  /**
   * 滑动事件委托
   * 这个东东是针对mini开发的
   * 左右翻页手势提升到全局响应
   * 相应的对象形成形成事件队列
   * [content1,content2,...,翻页]
   * 1 true 启动
   * 2 false 禁止
   */
  swipeDelegate: DEFAULT, //默认关闭，min杂志自动启用


  /**
   * 存储模式
   * 0 APK应用本身
   * 1 外置SD卡
   */
  storageMode: 0
};

/*
内部调试配置
 */
var DEFAULT$1 = undefined;

var improtDebugConfig = {

  /**
   * 支持调试模式
   * @type {[type]}
   */
  devtools: "production" !== 'production',

  /**
   * 是否支持错误日志打印
   * @type {Boolean}
   */
  silent: "production" !== 'production',

  /**
   * 独立canvas模式处理
   * 为了测试方便
   * 可以直接切换到dom模式
   *
   * 默认禁止：
   * 1 true 启动
   * 2 false 禁止
   * @type {Boolean}
   */
  onlyDomMode: false,

  /**
   * 仅做测试处理，因为每个section都可以对应配置tpType参数
   * 配置工具栏行为
   *
   *  工具栏类型
   *  toolType：(如果用户没有选择任何工具栏信息处理，tbType字段就为空)
   *   0  禁止工具栏
   *   1  系统工具栏   - 显示IOS系统工具栏
   *   2  场景工具栏   - 显示关闭按钮
   *   3  场景工具栏   - 显示返回按钮
   *   4  场景工具栏   - 显示顶部小圆点式标示
   *   填充数组格式，可以多项选择[1,2,3,4]
   */
  toolType: { //默认不设置，待数据库填充。如设置,数据库设置忽略
    main: DEFAULT$1, //主场景，系统工具栏
    deputy: DEFAULT$1, //副场景，函数工具栏
    number: DEFAULT$1 //独立配置，默认会启动页面，针对分栏处理
  },

  /**
   * 直接通过数据库的历史记录定位到指定的页面
   * Xut.View.LoadScenario({
   *     'seasonId' : scenarioInfo[0],
   *     'chapterId'  : scenarioInfo[1],
   *     'pageIndex'  : scenarioInfo[2]
   *  })
   *  {
   *     'seasonId' : 7,
   *     'chapterId'  : 9
   *  }
   * @type {Boolean}
   */
  deBugHistory: DEFAULT$1,

  /**
   *  仅做测试处理，因为每个section都可以对应配置pageMode参数
   *  翻页模式（数据库section指定）
   *
   *  每个场景对应自己的模式
   *  所以如果这里配置了，那么所有的场景全部统一配置了
   *  这里其实是不合理的，所以仅作为测试
   *
   *  pageMode：(如果用户没有选择任何处理，pageMode字段就为空)
   *   0 禁止滑动
   *   1 允许滑动无翻页按钮
   *   2 允许滑动带翻页按钮
   *
   *  主场景工具栏配置：默认2
   *  副场景工具栏配置：默认 0
   */
  pageMode: DEFAULT$1 //默认不设置，待数据库填充。如设置,数据库设置忽略

};

/**
 * 数据配置
 */
var improtDataConfig = {

  /*应用novelId*/
  novelId: null,

  /*应用页码索引*/
  pageIndex: null,

  /**
   * 数据库尺寸
   */
  dbSize: 1,

  /**
   * 应用路径唯一标示
   */
  appId: null,

  /**
   * 默认图标高度
   */
  iconHeight: Xut.plat.isIphone ? 32 : 44,

  /**
   * 数据库名
   */
  dbName: window.xxtmagzinedbname || 'magazine',

  /**
   * 支持电子在在线阅读,向服务端取数据
   * 自定义配置地址即可'
   * @type {String}
   */
  onlineModeUrl: 'lib/data/database.php',

  /**
   * 资源路径
   * @type {[type]}
   */
  pathAddress: null
};

/**
 * 配置文件
 * @return {[type]}         [description]
 */
/*
导入
1 全局配置
2 内部配置
3 依赖数据
 */
var isBrowser = Xut.plat.isBrowser;
var GLOBALIFRAME = window.GLOBALIFRAME;
var CLIENTCONFIGT = window.CLIENTCONFIGT;
var MMXCONFIG = window.MMXCONFIG;

var config = {};

var layoutMode = void 0;
var proportion = void 0;
var fullProportion = void 0;

/*层级关系*/
var _zIndex = 1000;
Xut.zIndexlevel = function () {
  return ++_zIndex;
};

//通过新学堂加载
//用于处理iframe窗口去全屏
if (/xinxuetang/.test(window.location.href)) {
  config.iframeFullScreen = true;
}

/**
 * 是否启动缓存机制
 * 第一次默认是关闭
 * 必须读取一次后，缓存启动
 * 为了支持Xut.config.launch模式
 * @type {Boolean}
 */
var isCacheVideoPath = false;
var isCacheAudioPath = false;
var isCacheSvgPath = false;
var isCacheJsWidgetPath = false;

var cacheVideoPath = void 0;
var cacheAudioPath = void 0;
var cacheSvgPath = void 0;
var cacheJsWidgetPath = void 0;

/**
 * pc端模式
 * 而且是客户端模式
 * @return {[type]} [description]
 */
var desktopPlat = function desktopPlat() {

  //2016.9.13
  //新增动态模式
  if (config.launch.resource) {
    return getSourcePath();
  }

  //如果是iframe加载
  //而且是客户端模式
  if (GLOBALIFRAME && CLIENTCONFIGT) {
    return CLIENTCONFIGT.path;
  }

  if (typeof initGalleryUrl != 'undefined') {
    return getSourcePath();
  } else {
    //资源存放位置
    // * storageMode 存放的位置
    // * 0 APK应用本身
    // 1 外置SD卡
    if (Number(config.launch.storageMode)) {
      return "sdcard/" + config.data.appId + "/" + getSourcePath();
    } else {
      return getSourcePath();
    }
  }
};

/**
 * 平台加载用于
 * 视频.音频妙妙学处理
 * 1 桌面
 * 2 移动端
 * 3 安卓打包后通过网页访问=>妙妙学
 * @return {[type]} [description]
 */
var runMode = function () {
  if (MMXCONFIG) {
    return false;
  }
  return isBrowser;
}();

/**
 * 图片资源配置路径
 * [resourcesPath description]
 * @return {[type]} [description]
 */
var _rsourcesPath = function _rsourcesPath() {
  return isBrowser ? desktopPlat() : GLOBALIFRAME ? iframeConfig.resources(config) : nativeConfig.resources(config);
};

/**
 * mp3 mp4 音频文件路径
 * 1 音频加载就会自动拷贝到SD卡上
 * 2 或者asset上的资源
 * @return {[type]} [description]
 */
var _videoPath = function _videoPath() {
  return runMode ? desktopPlat() : GLOBALIFRAME ? iframeConfig.video() : nativeConfig.video();
};

/**
 * 音频路径
 * @return {[type]} [description]
 */
var _audioPath = function _audioPath() {
  return runMode ? desktopPlat() : GLOBALIFRAME ? iframeConfig.audio() : nativeConfig.audio();
};

/**
 * SVG文件路径
 * @return {[type]} [description]
 */
var _svgPath = function _svgPath() {
  return isBrowser ? desktopPlat() : GLOBALIFRAME ? iframeConfig.svg() : nativeConfig.svg();
};

/**
 * js零件
 * 2016.8.3 妙妙学新增
 * 只提供相对路径
 * @return {[type]} [description]
 */
var _jsWidgetPath = function _jsWidgetPath() {
  return isBrowser ? getWidgetPath() : GLOBALIFRAME ? iframeConfig.jsWidget() : nativeConfig.jsWidget();
};

/**
 * 全局配置文件
 * @type {Boolean}
 */
_.extend(config, {

  /**
   * 应用横竖自适应切换
   * 默认在浏览器端打开
   * 这里可以定义打开关闭
   * 打开：1
   * 默认：0
   * [orientate description]
   * @type {[type]}
   */
  orientateMode: Xut.plat.isBrowser ? true : false,

  /**
   * 视频文件路径
   */
  getVideoPath: function getVideoPath() {
    if (isCacheVideoPath && cacheVideoPath) {
      return cacheVideoPath;
    }
    isCacheVideoPath = true;
    return cacheVideoPath = _videoPath();
  },


  /**
   * 音频文件路径
   */
  getAudioPath: function getAudioPath() {
    if (isCacheAudioPath && cacheAudioPath) {
      return cacheAudioPath;
    }
    isCacheAudioPath = true;
    return cacheAudioPath = _audioPath();
  },


  /**
   * 配置SVG文件路径
   */
  getSvgPath: function getSvgPath() {
    if (isCacheSvgPath && cacheSvgPath) {
      return cacheSvgPath;
    }
    isCacheSvgPath = true;
    return cacheSvgPath = _svgPath();
  },


  /**
   * 配置js零件文件路径
   * 2016.8.3增加
   */
  getWidgetPath: function getWidgetPath$$1() {
    if (isCacheJsWidgetPath && cacheJsWidgetPath) {
      return cacheJsWidgetPath;
    }
    isCacheJsWidgetPath = true;
    return cacheJsWidgetPath = _jsWidgetPath();
  },


  /**
   * 2016.7.26
   * 读酷增加强制插件模式
   */
  isPlugin: window.DUKUCONFIG && Xut.plat.isIOS,
  /*排版模式*/
  layoutMode: layoutMode,
  /*缩放比例*/
  proportion: proportion,
  /*全局数据配置*/
  data: improtDataConfig,
  /*全局debug配置*/
  debug: improtDebugConfig,
  /*默认全局配置*/
  golbal: improtGolbalConfig
});

Xut.config = config;

/**
 * 销毁配置
 */
function clearConfig() {
  cacheVideoPath = null;
  cacheAudioPath = null;
  cacheSvgPath = null;
  cacheJsWidgetPath = null;
}

/**
 * 初始化资源路径
 * 配置图片路径地址
 */
function initPathAddress() {
  //设置资源缓存关闭
  isCacheVideoPath = false;
  isCacheAudioPath = false;
  isCacheSvgPath = false;
  isCacheJsWidgetPath = false;

  /*资源路径*/
  config.data.pathAddress = _rsourcesPath();

  /*根路径*/
  config.data.rootPath = config.data.pathAddress.replace('/gallery/', '');
}

/**
 * 默认设置
 * 通过数据库中的设置的模板尺寸与实际尺寸修复
 */
var resetProportion = function resetProportion(pptWidth, pptHeight, setVisualMode, noModifyValue) {
  //获取全屏比值，用来设定view的尺寸
  //根据分辨率与PPT排版的比值来确定
  fullProportion = getFullProportion(config, pptWidth, pptHeight);
  var visualSize = config.visualSize = getVisualSize(config, fullProportion, setVisualMode, noModifyValue);

  //溢出宽度
  visualSize.overflowWidth = false;
  if (visualSize.left < 0) {
    visualSize.overflowWidth = Math.abs(visualSize.left) * 2;
  }
  //溢出高度
  visualSize.overflowHeight = false;
  if (visualSize.top < 0) {
    visualSize.overflowHeight = true;
  }
  //获取全局缩放比
  proportion = config.proportion = getRealProportion(config, visualSize, fullProportion);
};

/*获取基本尺寸*/
var getBasicSize = function getBasicSize(pptWidth, pptHeight, screenSize) {
  //获取分辨率
  config.screenSize = screenSize || getSize();
  //根据设备判断设备的横竖屏
  config.screenHorizontal = config.screenSize.width > config.screenSize.height ? true : false;
  config.screenVertical = !config.screenHorizontal;
  layoutMode = config.layoutMode = getLayerMode(config.screenSize);
  //数据ppt排版设计
  if (pptWidth && pptHeight) {
    config.pptHorizontal = pptWidth > pptHeight ? true : false;
    config.pptVertical = !config.pptHorizontal;
  }
};

/*重新设置config*/
var resetConfig = function resetConfig(pptWidth, pptHeight, screenSize, setVisualMode, noModifyValue) {
  getBasicSize(pptWidth, pptHeight, screenSize);
  resetProportion(pptWidth, pptHeight, setVisualMode, noModifyValue);
};

/****************************************
 *  反向模式探测(PPT设置与显示相反,列入竖版PPT=>横版显示)
 *  为了在originalVisualSize中重置容器的布局
 *  让容器的布局是反向模式的等比缩放的尺寸
 *  这样算法可以保持兼容正向一致
 * ***************************************/
function initConfig(pptWidth, pptHeight) {

  //第一次探测实际的PPT与屏幕尺寸
  getBasicSize(pptWidth, pptHeight);

  ////////////////////////////////////
  /// 横版PPT，竖版显示，强制为竖版双页面
  ////////////////////////////////////
  if (config.launch.visualMode === 5) {

    resetProportion(pptWidth, pptHeight, config.launch.visualMode);
    config.originalVisualSize = config.visualSize;
    return;
  }

  ////////////////////////////////////
  /// 竖版PPT，横版显示，并启动了双页模式
  ////////////////////////////////////
  if (config.launch.doublePageMode && config.pptVertical && config.screenHorizontal) {
    resetProportion(pptWidth, pptHeight, config.launch.visualMode === 3 ? 2 : config.launch.visualMode);
    config.originalVisualSize = config.visualSize;
    return;
  }

  //////////////////////////////////////////////////////////
  /// 反向设置的情况下
  /// 要计算出实际的显示范围与偏移量 visualSize的数据 d
  /// 比如竖版PPT=》
  ///   screenSize => height : 414 width : 736
  ///   visualSize => height : 414 width : 311 left : 213
  /// 屏幕尺寸与显示范围是不一样的，按照竖版的比例，等比缩小了
  //////////////////////////////////////////////////////////

  //如果是横版PPT，横版显示的情况下，并且是全局模式3的情况
  //可能存在宽度，不能铺满全屏的情况
  //所以可能存在要修改尺寸
  if (config.pptHorizontal && config.screenHorizontal && config.launch.visualMode === 3) {
    //可能会修改全局布局尺寸，所以采用3模式探测
    resetProportion(pptWidth, pptHeight, config.launch.visualMode, true);
  } else {
    //强制检测是否是反向显示模式
    //模式3的情况下，用2检测
    resetProportion(pptWidth, pptHeight, config.launch.visualMode === 3 ? 2 : config.launch.visualMode);
  }

  //如果是PPT与设备反向显示
  //这里可能会溢出left的值
  //那么把每个visual就当做一个整体处理
  // config.originalScreenSize = config.screenSize
  config.originalVisualSize = config.visualSize;

  //竖版PPT,横版显示
  if (config.pptVertical && config.screenHorizontal) {
    config.verticalToHorizontalVisual = true;
  }

  //横版PPT,竖版显示
  if (config.pptHorizontal && config.screenVertical) {
    config.horizontalToVerticalVisual = true;
  }

  /*******************************
   *   受反向检测影响了，需要修正config
   * ******************************/
  if (config.launch.visualMode === 2) {
    //如果是反向模式
    //强制设置visualSize=screenSize
    //从新计算config依赖比值
    if (config.visualSize.left) {
      resetConfig(pptWidth, pptHeight, {
        width: config.visualSize.width,
        height: config.visualSize.height
      }, config.launch.visualMode);
    }
  } else if (config.launch.visualMode === 3) {
    //反模式下，重置高度
    //已经尺寸因为探测已经被改过一次了
    //实际使用的时候，需要还原
    if (config.visualSize.left) {
      resetConfig(pptWidth, pptHeight, {
        width: config.visualSize.width,
        height: config.visualSize.height
      }, 1);
    } else {
      //重新把3模式下按照正常1的情况设置
      //2不行，因为高度不对，只有1与3接近
      resetConfig(pptWidth, pptHeight, '', 1);
    }
  }
}

/**
 * 动态计算计算可视区View
 * 每个页面可以重写页面的view
 */
function resetVisualLayout(setVisualMode) {
  return getVisualSize(config, fullProportion, setVisualMode);
}

/**
 * 动态计算缩放比
 * 每个页面可以重写页面的元素缩放比
 */
function resetVisualProportion(newVisualSize) {
  return getRealProportion(config, newVisualSize, fullProportion);
}

//定义属性
var def = Object.defineProperty;

/**
 * 定义一个新的对象
 * 重写属性
 */
function defProtected(obj, key, val, enumerable, writable) {
  def(obj, key, {
    value: val,
    enumerable: enumerable,
    writable: writable,
    configurable: true
  });
}

/**
 * 定义访问控制器
 * @return {[type]} [description]
 */
function defAccess(obj, key, access) {
  def(obj, key, {
    get: access.get,
    set: access.set
  });
}

/**
 * 首字母大写
 * @return {[type]} [description]
 *  string.charAt(0).toUpperCase() + string.slice(1);
 */
function titleCase(category) {
  return category.replace(/(\w)/, function (v) {
    return v.toUpperCase();
  });
}

/**
 * 判断存在
 */
function hasIndexOf(para, value) {
  if (para && value) {
    /*数组形式*/
    if (value.length) {
      if (~value.indexOf(para)) {
        return true;
      }
    }
    /*字符串*/
    if (typeof value === 'string') {
      if (para === value) {
        return true;
      }
    }
  }
}

/**
 * 转化数组
 * @param  {[type]} o [description]
 * @return {[type]}   [description]
 */
function toNumber(o) {
  return Number(o) || null;
}

/**
 * 创建一个纯存的hash对象
 */
function hash() {
  return Object.create(null);
}

/**
 * 存在值
 * 只有值不为undefined
 */


function $extend(object, config) {
  for (var i in config) {
    if (i) {
      if (object[i]) {
        $warn('接口方法重复', 'Key->' + i, 'Value->' + object[i]);
      } else {
        object[i] = config[i];
      }
    }
  }
}

/**
 * /解析json字符串
 * @return {[type]}           [description]
 */
function parseJSON(parameter) {
  if (!parameter) return;
  var json = void 0;
  try {
    json = JSON.parse(parameter);
  } catch (error) {
    $warn('parseJSON\u5931\u8D25:' + parameter);
    return false;
  }
  return json;
}

/**
 * 回车符处理
 */
function enterReplace(str) {
  return str.replace(/\r\n/ig, '').replace(/\r/ig, '').replace(/\n/ig, '');
}

/**
 * 解析json代码
 * 包装脚本
 * @param  {[type]} itemArray [description]
 * execJson("(function(){" + enterReplace(data.postCode) + "})");
 */
function makeJsonPack(code) {
  try {
    var post = "(function(){" + enterReplace(code) + "})";
    return new Function("return " + post)();
  } catch (error) {
    $warn('解析json出错' + code);
  }
}

/**
 * 修正判断是否存在处理
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
function arrayUnique(arr) {
  //去重
  if (arr && arr.length) {
    var length = arr.length;
    while (--length) {
      //如果在前面已经出现，则将该位置的元素删除
      if (arr.lastIndexOf(arr[length], length - 1) > -1) {
        arr.splice(length, 1);
      }
    }
    return arr;
  } else {
    return arr;
  }
}

/**
 *  文件路径拼接
 * @return {[type]} [description]
 */

/**
 * 2015.3.24
 * 1 isBrowser
 * 2 isMobile
 * 3 isMouseTouch
 */
var transitionEnd = Xut.style.transitionEnd;

//2015.3.23
//可以点击与触摸
var isMouseTouch = Xut.plat.isMouseTouch;
var hasTouch = Xut.plat.hasTouch;

//触发事件名
var touchList = ['click', 'touchstart', 'touchmove', 'touchend', 'touchcancel', transitionEnd];
var mouseList = ['click', 'mousedown', 'mousemove', 'mouseup', 'mousecancel', transitionEnd, 'mouseleave'];

//绑定事件名排序
var orderName = {
  click: 0,
  start: 1,
  move: 2,
  end: 3,
  cancel: 4,
  transitionend: 5,
  leave: 6
};

var eventNames = function () {
  if (isMouseTouch) {
    return {
      touch: touchList,
      mouse: mouseList
    };
  }
  return hasTouch ? touchList : mouseList;
}();

/**
 * 事件数据缓存
 * @type {Object}
 */
var eventDataCache = {};
var guid = 1;

/**
 * 增加缓存句柄
 * @param {[type]} element   [description]
 * @param {[type]} eventName [description]
 * @param {[type]} handler   [description]
 */
function addHandler(element, eventName, handler, capture) {
  if (element.xutHandler) {
    var uuid = element.xutHandler;
    var dataCache = eventDataCache[uuid];
    if (dataCache) {
      if (dataCache[eventName]) {
        //如果是isMouseTouch支持同样的事件
        //所以transitionend就比较特殊了，因为都是同一个事件名称
        //所以只要一份，所以重复绑定就需要去掉
        if (eventName !== 'transitionend') {
          $warn(eventName + '：事件重复绑定添加');
        }
      } else {
        dataCache[eventName] = [handler, capture];
      }
    }
  } else {
    eventDataCache[guid] = defineProperty({}, eventName, [handler, capture]);
    element.xutHandler = guid++;
  }
}

var eachApply = function eachApply(events, callbacks, processor, isRmove) {
  _.each(callbacks, function (handler, key) {
    var eventName = void 0;
    if (isRmove) {
      //如果是移除，callbacks是数组
      //转化事件名
      if (eventName = events[orderName[handler]]) {
        processor(eventName);
      }
    } else {
      eventName = events[orderName[key]];
      //on的情况，需要传递handler
      handler && eventName && processor(eventName, handler);
    }
  });
};

/**
 * 合并事件绑定处理
 * 因为isMouseTouch设备上
 * 要同时支持2种方式
 * @return {[type]} [description]
 */
var addEvent = function addEvent(element, events, callbacks, capture) {
  eachApply(events, callbacks, function (eventName, handler) {
    addHandler(element, eventName, handler, capture);
    element.addEventListener(eventName, handler, capture);
  });
};

/**
 * 移除所有事件
 * @param  {[type]} element [description]
 * @return {[type]}         [description]
 */
function removeAll(element) {
  var uuid = element.xutHandler;
  var dataCache = eventDataCache[uuid];
  if (!dataCache) {
    $warn('移除所有事件出错');
    return;
  }
  _.each(dataCache, function (data, eventName) {
    if (data) {
      element.removeEventListener(eventName, data[0], data[1]);
      dataCache[eventName] = null;
    }
  });
  delete eventDataCache[uuid];
}

/**
 * 移除指定的事件
 * @return {[type]} [description]
 */
function removeone(element, eventName) {
  var uuid = element.xutHandler;
  var dataCache = eventDataCache[uuid];
  if (!dataCache) {
    $warn('移除事件' + eventName + '出错');
    return;
  }
  var data = dataCache[eventName];
  if (data) {
    element.removeEventListener(eventName, data[0], data[1]);
    dataCache[eventName] = null;
    delete dataCache[eventName];
  } else {
    $warn('移除事件' + eventName + '出错');
  }

  //如果没有数据
  if (!Object.keys(dataCache).length) {
    delete eventDataCache[uuid];
  }
}

/**
 * 销毁事件绑定处理
 * 因为isMouseTouch设备上
 * 要同时支持2种方式
 * @return {[type]} [description]
 */
var removeEvent = function removeEvent(element, events, callbacks) {
  eachApply(events, callbacks, function (eventName) {
    removeone(element, eventName);
  }, 'remove');
};

/**
 * 多设备绑定
 * @param  {[type]}   processor    [处理器]
 * @param  {[type]}   eventContext [上下文]
 * @param  {Function} callback     [回调函数]
 * @return {[type]}                [description]
 */
var compatibility = function compatibility(controller, element, callbacks, capture) {
  //如果两者都支持
  //鼠标与触摸
  if (isMouseTouch) {
    _.each(eventNames, function (events) {
      controller(element, events, callbacks, capture);
    });
  } else {
    controller(element, eventNames, callbacks, capture);
  }
};

/**
 * 变成节点对象
 * @param  {[type]} element [description]
 * @return {[type]}         [description]
 */
function toNodeObj(element) {
  if (element.length) {
    element = element[0];
  }
  return element;
}

/**
 * 检测end事件，默认要绑定cancel
 * @return {[type]} [description]
 */
var checkBindCancel = function checkBindCancel(callbacks) {
  if (callbacks && callbacks.end && !callbacks.cancel) {
    callbacks.cancel = callbacks.end;
  }
};

/**
 * 合并事件绑定处理
 * 因为isMouseTouch设备上
 * 要同时支持2种方式
 * bindTap(eventContext,{
 *     start   : start,
 *     move    : move,
 *     end     : end
 * })
 * capture 默认是冒泡，提供捕获处理
 * @return {[type]} [description]
 */
function $on(element, callbacks) {
  var capture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  checkBindCancel(callbacks);
  compatibility(addEvent, toNodeObj(element), callbacks, capture);
}

/**
 * 移除tap事件
 * @param  {[type]} context [description]
 * @param  {[type]} opts    [description]
 * @return {[type]}         [description]
 */
function $off(element, callbacks) {

  if (!element) {
    $warn('移除事件对象不存在');
    return;
  }

  element = toNodeObj(element);

  //全部移除
  if (arguments.length === 1) {
    removeAll(element);
    return;
  }

  if (!_.isArray(callbacks)) {
    $warn('移除的事件句柄参数，必须是数组');
    return;
  }

  checkBindCancel(callbacks);
  compatibility(removeEvent, element, callbacks);
}

/**
 * 如果是$on绑定的，那么获取事件就可能是多点的
 * 所以需要$hanle方法
 * @param  {[type]} callbacks [description]
 * @param  {[type]} context   [description]
 * @param  {[type]} event     [description]
 * @return {[type]}           [description]
 */
function $handle(callbacks, context, event) {
  switch (event.type) {
    case 'touchstart':
    case 'mousedown':
      callbacks.start && callbacks.start.call(context, event);
      break;
    case 'touchmove':
    case 'mousemove':
      callbacks.move && callbacks.move.call(context, event);
      break;
    case 'touchend':
    case 'mouseup':
    case 'mousecancel':
    case 'touchcancel':
    case 'mouseleave':
      callbacks.end && callbacks.end.call(context, event);
      break;
    case 'transitionend':
    case 'webkitTransitionEnd':
    case 'oTransitionEnd':
    case 'MSTransitionEnd':
      callbacks.transitionend && callbacks.transitionend.call(context, event);
      break;
  }
}

function $target(event, original) {
  var currTouches = null;
  if (hasTouch) {
    currTouches = event.touches;
    if (currTouches && currTouches.length > 0) {
      event = currTouches[0];
    }
  }
  return original ? event : event.target;
}

/**
 * 兼容事件对象
 * @return {[type]}   [description]
 */
function $event(e) {
  return e.touches && e.touches[0] ? e.touches[0] : e;
}

/**
 *  加载文件
 *  css/js
 */

var isOldWebKit = +navigator.userAgent.replace(/.*AppleWebKit\/(\d+)\..*/, "$1") < 536;

function pollCss(node, callback) {
  var sheet = node.sheet,
      isLoaded;

  // for WebKit < 536
  if (isOldWebKit) {
    if (sheet) {
      isLoaded = true;
    }
  }
  // for Firefox < 9.0
  else if (sheet) {
      try {
        if (sheet.cssRules) {
          isLoaded = true;
        }
      } catch (ex) {
        // The value of `ex.name` is changed from "NS_ERROR_DOM_SECURITY_ERR"
        // to "SecurityError" since Firefox 13.0. But Firefox is less than 9.0
        // in here, So it is ok to just rely on "NS_ERROR_DOM_SECURITY_ERR"
        if (ex.name === "NS_ERROR_DOM_SECURITY_ERR") {
          isLoaded = true;
        }
      }
    }

  setTimeout(function () {
    if (isLoaded) {
      // Place callback here to give time for style rendering
      callback();
    } else {
      pollCss(node, callback);
    }
  }, 20);
}

function addOnload(node, callback, isCSS, url) {
  var supportOnload = "onload" in node;

  if (isCSS && isOldWebKit) {
    setTimeout(function () {
      pollCss(node, callback);
    }, 1); // Begin after node insertion
    return;
  }

  function onload(error) {

    // Ensure only run once and handle memory leak in IE
    node.onload = node.onerror = node.onreadystatechange = null;

    // Remove the script to reduce memory leak
    if (!isCSS) {
      var head = document.getElementsByTagName("head")[0] || document.documentElement;
      head.removeChild(node);
    }
    // Dereference the node
    node = null;
    callback(error);
  }

  if (supportOnload) {
    node.onload = onload;
    node.onerror = function () {
      onload(true);
    };
  } else {
    node.onreadystatechange = function () {
      if (/loaded|complete/.test(node.readyState)) {
        onload();
      }
    };
  }
}

function loadFile(url, callback, charset) {
  var IS_CSS_RE = /\.css(?:\?|$)/i,
      isCSS = IS_CSS_RE.test(url),
      node = document.createElement(isCSS ? "link" : "script");

  if (charset) {
    var cs = $.isFunction(charset) ? charset(url) : charset;
    if (cs) {
      node.charset = cs;
    }
  }

  addOnload(node, callback, isCSS, url);

  if (isCSS) {
    node.rel = "stylesheet";
    node.href = url;
  } else {
    node.async = true;
    node.src = url;
  }
  // For some cache cases in IE 6-8, the script executes IMMEDIATELY after
  // the end of the insert execution, so use `currentlyAddingScript` to
  // hold current node, for deriving url in `define` call
  //currentlyAddingScript = node
  var head = document.getElementsByTagName("head")[0] || document.documentElement;
  var baseElement = head.getElementsByTagName("base")[0];
  // ref: #185 & http://dev.jquery.com/ticket/2709
  baseElement ? head.insertBefore(node, baseElement) : head.appendChild(node);
  //currentlyAddingScript = null

  return node;
}

/**
 * 图片预加载
 */

/**
 * callback(1,2)
 * 1 图片加载状态 success / fail   true/false
 * 2 图片是否被缓存 hasCache       ture/false
 */
function loadFigure(data, callback) {

  if (!data) {
    console.log('loadFigure data有错误');
    callback && callback();
    return;
  }

  var img = void 0;
  if (typeof data === 'string') {
    img = new Image();
    img.src = data;
  } else {
    /*如果传递了图片对象*/
    img = data.image;
    img.src = data.url;
  }

  // 如果图片被缓存，则直接返回缓存数据
  if (img.complete) {
    callback && callback.call(img, true, true);
    return img;
  }

  var width = img.width;
  var height = img.height;

  var clear = function clear() {
    img = img.onload = img.onerror = null;
  };

  /**
   * 图片尺寸就绪
   * 判断图片是否已经被缓存了
   */
  var onready = function onready(hasCache) {
    var newWidth = img.width;
    var newHeight = img.height;
    // 如果图片已经在其他地方加载可使用面积检测
    if (newWidth !== width || newHeight !== height || newWidth * newHeight > 1024) {
      clear();
      callback && callback(true, hasCache);
      onready.end = true;
      return true;
    }
  };

  // 加载错误后的事件
  img.onerror = function () {
    onready.end = true;
    clear();
    callback && callback(false);
  };

  /**检测是不是已经缓存了*/
  if (onready(true)) {
    /*如果缓存存在，就跳过*/
    return;
  }

  /*完全加载完毕的事件*/
  img.onload = function () {
    clear();
    callback && callback(true);
  };

  // 加入队列中定期执行
  // if (!onready.end) {
  //   list.push(onready);
  //   // 无论何时只允许出现一个定时器，减少浏览器性能损耗
  //   if (intervalId === null) intervalId = setInterval(tick, 40);
  // };

  return img;
}

var onlyId = void 0;

var storage = window.localStorage;

/*
过滤
 */
var filter = function filter(key) {
  //添加头部标示
  if (onlyId) {
    return key + onlyId;
  } else {
    if (!config.data.appId) {
      config.data.appId = 'aaron-' + new Date().getDate();
    }
    //子文档标记
    var sub = window.SUbCONFIGT && window.SUbCONFIGT.dbId ? "-" + window.SUbCONFIGT.dbId : '';
    onlyId = "-" + config.data.appId + sub;
  }
  return key + onlyId;
};

/**
 * 设置localStorage
 * @param {[type]} key [description]
 * @param {[type]} val [description]
 */
function setStorage(key, val) {
  var setkey;

  if (_.isObject(key)) {
    for (var i in key) {
      if (key.hasOwnProperty(i)) {
        setkey = filter(i);
        storage.setItem(setkey, key[i]);
      }
    }
  } else {
    key = filter(key);
    storage.setItem(key, val);
  }
}

/**
 * 获取localstorage中的值
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
function getStorage(key) {
  key = filter(key);
  return storage.getItem(key) || undefined;
}

/**
 * 删除localStorage中指定项
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
function removeStorage(key) {
  key = filter(key);
  storage.removeItem(key);
}

/**
 * 重设缓存的UUID
 * 为了只计算一次
 * @return {[type]} [description]
 */
function clearStorageId() {
  onlyId = null;
}

/////////////////////////////////////////////////////////////////////
///
///  默认用H5的localStorage保存数据
///  例外：safari开启了
///  1 safari无痕模式下被禁用的localStorage，不可写，只能读
///  2 有些机型不能存储信息到localStorage中,微信中通过cookie方式单独修复，直接用浏览器不可以
///
/////////////////////////////////////////////////////////////////////


/**
 * 设置setCookie
 * @param {[type]} c_name     [description]
 * @param {[type]} value      [description]
 * @param {[type]} expiredays [description]
 */
function setCookie(name, value, expiredays) {
  if (!expiredays) {
    var day = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000);
    expiredays = exp.toGMTString();
  }
  document.cookie = name + "=" + escape(value) + ";expires=" + expiredays;
}

/**
 * 取回cookie
 * @param  {[type]} c_name [description]
 * @return {[type]}        [description]
 */
function getCookie(name) {
  if (document.cookie.length > 0) {
    var arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
      return unescape(arr[2]);
    } else {
      return null;
    }
  }
  return null;
}

/**
 *  移除
 * @param  {[type]} c_name     [description]
 * @param  {[type]} value      [description]
 * @param  {[type]} expiredays [description]
 * @return {[type]}            [description]
 */
function removeCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null) {
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
  }
}

/////////////////////////////////////////////////////////////////////
///
///  默认用H5的localStorage保存数据
///  例外：safari开启了
///  1 safari无痕模式下被禁用的localStorage，不可写，只能读
///  2 有些机型不能存储信息到localStorage中,微信中通过cookie方式单独修复，直接用浏览器不可以
///
/////////////////////////////////////////////////////////

var supportPlat = function supportPlat(storage, cookie) {
  if (Xut.plat.supportStorage) {
    return storage;
  } else {
    /*微信支持cookie*/
    if (Xut.plat.isWeiXin) {
      return cookie;
    }
    /*剩余就下ios的safari无痕模式*/
    /*无痕模式用cookie暂时替代，至少在不关闭浏览器的情况有一定作用*/
    return cookie;
  }
};

var SET = supportPlat(setStorage, setCookie);
var GET = supportPlat(getStorage, getCookie);
var REMOVE = supportPlat(removeStorage, removeCookie);
var CLEAR = supportPlat(clearStorageId, clearStorageId);

/**
 * 设置localStorage
 * @param {[type]} key [description]
 * @param {[type]} value [description]
 */
function $setStorage(key, value) {
  if (!key || !value) {
    return;
  }
  SET(key, value);
}

/**
 * 获取localstorage中的值
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
function $getStorage(key) {
  if (!key) {
    return;
  }
  return GET(key);
}

/**
 * 删除localStorage中指定项
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
function $removeStorage(key) {
  if (!key) {
    REMOVE(key);
  }
}

/**
 * 退出清理
 * @return {[type]} [description]
 */
function clearId() {
  CLEAR();
}

var CEIL$1 = Math.ceil;
var slashRE = /\/$/;

/**
 * 去掉后缀的斜杠
 * @return {[type]} [description]
 */
function slashPostfix(resource) {
  if (resource && slashRE.test(resource)) {
    return resource.substring(0, resource.length - 1);
  }
  return resource;
}

/**
 * 动态加载link
 * @return {[type]} [description]
 */
function loadGolbalStyle(fileName, callback) {

  var path = config.launch.resource ? config.launch.resource + '/gallery/' + fileName + '.css' : config.data.pathAddress + fileName + '.css';

  var node = loadFile(path, callback);
  node && node.setAttribute('data-type', fileName);
}

/**
 * 设置快速的文件解释正则
 * 每个图片在点击的时候，需要解析文件的一些参数
 * 这里正则只做一次匹配
 */
var brModelRE = null;
function setFastAnalysisRE() {
  brModelRE = null;
  //如果存在brModelType
  if (config.launch.brModelType && config.launch.brModelType !== 'delete') {
    //(\w+[_a|_i]?)([.hi|.mi]*)$/i
    brModelRE = new RegExp('(\\w+[' + config.launch.brModelType + ']?)([.' + config.launch.baseImageSuffix + ']*)$', 'i');
  }
}

/**
 * 获取正确的图片文件名
 * 因为图片可能存在
 * .mi.jpg
 * .mi.php
 * .hi.jpg
 * .hi.php
 * 等等这样的地址
 * @return
    original: "1d7949a5585942ed.jpg"
    suffix  : "1d7949a5585942ed.mi.jpg"
 */
function analysisImageName(src) {
  var suffix = src;
  var original = src;
  var result = void 0;

  //如果存在brModelType
  if (brModelRE) {
    result = src.match(brModelRE);
    if (result && result.length) {
      suffix = result[0];
      original = result[1];
    } else {
      $warn('zoom-image-brModelType解析出错,result：' + result);
    }
  }
  //有基础后缀
  //suffix: 1d7949a5585942ed.mi.jpg
  //original: 1d7949a5585942ed.jpg
  else if (config.launch.baseImageSuffix) {
      /*
          0 1d7949a5585942ed.mi.jpg"
          1 "1d7949a5585942ed"
          2 : ".mi"
          3: ".jpg"
       */
      result = src.match(/(\w+)(\.\w+)(\.\w+)$/);
      if (result && result.length) {
        suffix = result[0];
        original = result[1] + result[3];
      } else {
        $warn('zoom-image-suffix解析出错,result：' + result);
      }
    }
    //如果没有后缀
    else {
        //"1d7949a5585942ed.jpg"
        result = src.match(/\w+\.\w+$/);
        if (result && result.length) {
          suffix = original = result[0];
        } else {
          $warn('zoom-image解析出错,result：' + result);
        }
      }
  return {
    original: original, //原始版
    suffix: suffix //带有后缀
  };
}

/**
 * 给地址增加私有后缀
 * @param  {[type]} originalUrl [description]
 * @param  {[type]} suffix      [description]
 * @return {[type]}             [description]
 */
function insertImageUrlSuffix(originalUrl, suffix) {
  if (originalUrl && suffix) {
    //brModelType 没有类型后缀
    if (config.launch.brModelType && config.launch.brModelType !== 'delete') {
      return originalUrl.replace(/\w+/ig, '$&' + '.' + suffix);
    }
    //带后缀
    return originalUrl.replace(/\w+\./ig, '$&' + suffix + '.');
  }
  return originalUrl;
}

/*获取高清图文件*/
function getHDFilePath(originalUrl) {
  if (config.launch.useHDImageZoom && config.launch.imageSuffix && config.launch.imageSuffix['1440']) {
    return getFileFullPath(insertImageUrlSuffix(originalUrl, config.launch.imageSuffix['1440']), 'getHDFilePath');
  }
  return '';
}

/**
 * 文件是图片格式
 * @param  {[type]}  fileName [description]
 * @return {Boolean}          [description]
 */
function hasImages(fileName) {
  return (/\.[jpg|png|gif]+/i.test(fileName)
  );
}

/**
 * 获取文件的全路径
 * @param  {[type]} fileName  [description]
 * @param  {[type]} debugType [description]
 * @return {[type]}           [description]
 *
 * isGif 为true 跳过brModelType模式
 */
function getFileFullPath(fileName, debugType, isGif) {

  if (!fileName) {
    return '';
  }

  var launch = config.launch;

  /*
  如果启动了基础图匹配,替换全部
  并且要是图片
  并且没有私有后缀
  */
  if (launch.baseImageSuffix && hasImages(fileName) && -1 === fileName.indexOf('.' + launch.baseImageSuffix + '.')) {
    /*"50f110321f467d25474b9dba9b342f0a.png"
      1 : "50f110321f467d25474b9dba9b342f0a"
      2 : "png"
    */
    var fileMatch = fileName.match(/(\w+)\.(\w+)$/);
    var name = fileMatch[1];
    var type = fileMatch[2];
    fileName = fileMatch[1] + '.' + launch.baseImageSuffix + '.' + fileMatch[2];
  }

  /*如果是GIF的话需要跳过brModelType类型的处理*/
  if (isGif) {
    return config.data.pathAddress + fileName;
  }

  /*
    支持webp图
    1 如果启动brModelType
    2 并且是图片
    3 并且没有被修改过
  */
  if (launch.brModelType && hasImages(fileName) && !/\_[i|a]+\./i.test(fileName)) {

    var suffix = '';
    var _name = void 0;
    if (Xut.plat.isBrowser) {
      //手机浏览器访问
      var _fileMatch = fileName.match(/\w+([.]?[\w]*)\1/ig);
      if (_fileMatch.length === 3) {
        _name = _fileMatch[0];
        suffix = '.' + _fileMatch[1];
      } else {
        _name = _fileMatch[0];
      }

      //content/13/gallery/106d9d86fa19e56ecdff689152ecb28a_i.mi
      return '' + (config.data.pathAddress + _name) + launch.brModelType + suffix;
    } else {
      //手机app访问
      //content/13/gallery/106d9d86fa19e56ecdff689152ecb28a.mi
      return '' + (config.data.pathAddress + _name) + suffix;
    }
  }

  return config.data.pathAddress + fileName;
}

/**
 * 获取资源
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
function getResources(url) {
  var option;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, false);
  xhr.send(null);
  option = parseJSON(xhr.responseText);
  return option;
}

function createFn(obj, id, callback) {
  var cObj = obj[id];
  if (!cObj) {
    cObj = obj[id] = {};
  }
  callback.call(cObj);
}

/**
 * 执行脚本注入
 */
function execScript(code, type) {
  //过滤回车符号
  var enterReplace$$1 = function enterReplace$$1(str) {
    return str.replace(/\r\n/ig, '').replace(/\r/ig, '').replace(/\n/ig, '');
  };
  try {
    new Function(enterReplace$$1(code))();
  } catch (e) {
    $warn('加载脚本错误', type);
  }
}

/**
 * 创建gif随机数
 * 用数字代码，不能用0.在有些电脑上不显示
 */
function createRandomImg(url) {
  var s = Math.random().toString();
  s = s.replace(/\b(0+)(\.+)/gi, "");
  s = parseInt(s);
  return url + ('?' + s);
}

/**
 * 路径替换
 * svg html文件的路径是原始处理的
 * 如果动态切换就需要替换
 * @return {[type]} [description]
 */
function replacePath(svgstr) {
  if (config.launch.lauchMode === 1) {
    //如果能找到对应的默认路径，则替换
    if (-1 !== svgstr.indexOf('content/gallery/')) {
      svgstr = svgstr.replace(/content\/gallery/ig, config.data.pathAddress);
    }
  }
  return svgstr;
}

/**
 * 转化缩放比
 */
var converProportion = function converProportion(_ref) {
  var width = _ref.width,
      height = _ref.height,
      left = _ref.left,
      top = _ref.top,
      padding = _ref.padding,
      proportion = _ref.proportion,
      zoomMode = _ref.zoomMode,
      getStyle = _ref.getStyle;


  if (!proportion) {
    $warn('没有传递缩放比,取全局config');
    proportion = config.proportion;
  }

  //页眉，保持横纵比
  //计算顶部显示中线位置
  //如果溢出就溢出，高度设置为白边中线
  if (zoomMode === 1) {
    var visualTop = getStyle.visualTop;
    var proportionalHeight = CEIL$1(height * proportion.width) || 0;
    return {
      width: CEIL$1(width * proportion.width) || 0,
      height: proportionalHeight,
      left: CEIL$1(left * proportion.left) || 0,
      top: -visualTop / 2 - proportionalHeight / 2 || 0,
      padding: CEIL$1(padding * proportion.width) || 0,
      isHide: proportionalHeight > visualTop //正比高度大于显示高度，隐藏元素
    };
  }
  //页脚，保持横纵比
  //计算底部显示中线位置
  //如果溢出就隐藏，高度设置为白边中线
  else if (zoomMode === 2) {
      var _visualTop = getStyle.visualTop;
      var _proportionalHeight = CEIL$1(height * proportion.width) || 0;
      return {
        width: CEIL$1(width * proportion.width) || 0,
        height: _proportionalHeight,
        left: CEIL$1(left * proportion.left) || 0,
        top: getStyle.visualHeight + _visualTop / 2 - _proportionalHeight / 2 || 0,
        padding: CEIL$1(padding * proportion.width) || 0,
        isHide: _proportionalHeight > _visualTop //正比高度大于显示高度，隐藏元素
      };
    }
    //图片正比缩放，而且保持上下居中
    else if (zoomMode === 3) {
        //高度为基本比值
        if (proportion.width > proportion.height) {
          var originalWidth = CEIL$1(width * proportion.width) || 0;
          var proportionalWidth = CEIL$1(width * proportion.height) || 0;
          var proportionalLeft = Math.abs(proportionalWidth - originalWidth) / 2;
          left = CEIL$1(left * proportion.left) + proportionalLeft;
          return {
            width: proportionalWidth,
            height: CEIL$1(height * proportion.height) || 0,
            left: left,
            top: CEIL$1(top * proportion.top) || 0,
            padding: CEIL$1(padding * proportion.width) || 0
          };
        } else {
          //宽度作为基本比值
          var originalHeight = CEIL$1(height * proportion.height) || 0;
          var _proportionalHeight2 = CEIL$1(height * proportion.width) || 0;
          var proportionalTop = Math.abs(_proportionalHeight2 - originalHeight) / 2;
          top = CEIL$1(top * proportion.top) + proportionalTop;
          return {
            width: CEIL$1(width * proportion.width) || 0,
            height: _proportionalHeight2,
            left: CEIL$1(left * proportion.left) || 0,
            top: top,
            padding: CEIL$1(padding * proportion.width) || 0
          };
        }
      }
      //默认缩放比
      else {
          return {
            width: CEIL$1(width * proportion.width) || 0,
            height: CEIL$1(height * proportion.height) || 0,
            left: CEIL$1(left * proportion.left) || 0,
            top: CEIL$1(top * proportion.top) || 0,
            padding: CEIL$1(padding * proportion.width) || 0
          };
        }
};

function setProportion() {
  return converProportion.apply(undefined, arguments);
}

/*
 * 修复元素的尺寸
 * @type {[type]}
 */
function reviseSize(_ref2) {
  var results = _ref2.results,
      proportion = _ref2.proportion,
      zoomMode = _ref2.zoomMode,
      getStyle = _ref2.getStyle;


  //不同设备下缩放比计算
  var layerSize = converProportion({
    proportion: proportion,
    zoomMode: zoomMode,
    getStyle: getStyle,
    width: results.width,
    height: results.height,
    left: results.left,
    top: results.top
  });

  //新的背景图尺寸
  var backSize = converProportion({
    proportion: proportion,
    zoomMode: zoomMode,
    getStyle: getStyle,
    width: results.backwidth,
    height: results.backheight,
    left: results.backleft,
    top: results.backtop
  });

  //赋值新的坐标
  results.scaleWidth = layerSize.width;
  results.scaleHeight = layerSize.height;
  results.scaleLeft = layerSize.left;
  results.scaleTop = layerSize.top;

  //元素状态
  if (layerSize.isHide) {
    results.isHide = layerSize.isHide;
  }

  //背景坐标
  results.scaleBackWidth = backSize.width;
  results.scaleBackHeight = backSize.height;
  results.scaleBackLeft = backSize.left;
  results.scaleBackTop = backSize.top;

  return results;
}

/**
 * 缓存池
 * @return {[type]} [description]
 */

/**
 * 当监听的节点内容发生变化时,触发指定的回调
 * @param opts {
 *   container:父容器,dom对象或jQuery对象
 *   content  :要加入父容器的内容,字符串或jQuery对象
 *   position :内容插入父容器的位置,'first' 表示在前加入,默认在末尾
 *   delay    :延时,默认0
 *   }
 * @version  1.02
 * @author [author] bjtqti
 * @return {[type]} [description]
 */

var DOC = document;
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

var implementation = DOC.implementation.hasFeature("MutationEvents", "2.0");

/**
 * Defer a task to execute it asynchronously. Ideally this
 * should be executed as a microtask, so we leverage
 * MutationObserver if it's available, and fallback to
 * setTimeout(0).
 *
 * @param {Function} cb
 * @param {Object} ctx
 */
var _nextTick = function () {
  var callbacks = [];
  var pending = false;
  var timerFunc;

  function nextTickHandler() {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks = [];
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  if (typeof MutationObserver !== 'undefined' && Xut.plat.supportMutationObserver) {
    var counter = 1;
    var observer = new MutationObserver(nextTickHandler);
    var textNode = document.createTextNode(counter);
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function timerFunc() {
      counter = (counter + 1) % 2;
      textNode.data = counter;
    };
  } else {
    // webpack attempts to inject a shim for setImmediate
    // if it is used as a global, so we have to work around that to
    // avoid bundling unnecessary code.
    var context = Xut.plat.isBrowser ? window : typeof global !== 'undefined' ? global : {};
    timerFunc = context.setImmediate || setTimeout;
  }
  return function (cb, ctx) {
    var func = ctx ? function () {
      cb.call(ctx);
    } : cb;
    callbacks.push(func);
    if (pending) return;
    pending = true;
    timerFunc(nextTickHandler, 0);
  };
}();

var nextTick = function nextTick(_ref, callback, context) {
  var container = _ref.container,
      content = _ref.content,
      position = _ref.position,
      _ref$delay = _ref.delay,
      delay = _ref$delay === undefined ? 0 : _ref$delay;


  //如果只提供一个回到函数
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callback = arguments[0];
    if (typeof callback === 'function') {
      return _nextTick(callback);
    }
    console.log('nextTick: 参数提供错误');
    return;
  }

  if (!container || !content) {
    return;
  }

  //检查容器---$(container) 转为dom对象
  if (container instanceof $) {
    container = container[0];
  }

  if (container.nodeType !== 1) {
    console.log('nextTick: container must be HTMLLIElement ');
    return;
  }

  var animatId = 'T' + (Math.random() * 10000 << 1);
  var tick = DOC.createElement('input');

  //标记任务
  tick.setAttribute('value', animatId);

  //检查内容
  if (typeof content === 'string') {
    var temp = $(content);
    if (!temp[0]) {
      //纯文本内容
      temp = DOC.createTextNode(content);
      temp = $(temp);
    }
    content = temp;
    temp = null;
  }

  /**
   * 完成任务后处理&Observer
   * @return {[type]} [description]
   */
  var _completeTask = function _completeTask() {
    container.removeChild(tick);
    callback.call(context);
    container = null;
    tick = null;
    context = null;
  };

  /**
   * 将内容加入父容器
   * @return {[type]} [description]
   */
  var _appendChild = function _appendChild() {
    //拼接内容
    var frag = DOC.createDocumentFragment();
    var len = content.length;
    for (var i = 0; i < len; i++) {
      frag.appendChild(content[i]);
    }
    frag.appendChild(tick);

    //判断插入的位置
    if (position === 'first') {
      container.insertBefore(frag, container.firstChild);
    } else {
      container.appendChild(frag);
    }

    frag = null;

    //触发变动事件
    tick.setAttribute('value', animatId);
  };

  if (MutationObserver) {
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (record) {
        if (record.oldValue === animatId) {
          _completeTask();
          observer = null;
        }
      });
    });

    //设置要监听的属性
    observer.observe(tick, {
      attributes: true,
      //childList: true,
      attributeOldValue: true,
      attributeFilter: ["value"] //只监听value属性,提高性能
    });

    _appendChild();
  } else {

    //检测是否支持DOM变动事件
    if (implementation) {

      /**
       * 完成任务后处理&Event
       * @param  {[type]} event [description]
       * @return {[type]}       [description]
       */
      var _finishTask = function _finishTask(event) {
        if (event.target.value === animatId) {
          //container.removeEventListener('DOMNodeRemoved',_finishTask,false);
          container.removeEventListener('DOMNodeInserted', _finishTask, false);
          callback.call(context);
        }
      };

      //container.addEventListener('DOMNodeRemoved',_finishTask,false);
      container.addEventListener('DOMNodeInserted', _finishTask, false);
      _appendChild();
      container.removeChild(tick);
    } else {
      //歉容Android2.xx处理
      _appendChild();
      setTimeout(function () {
        _completeTask();
      }, delay);
    }
  }
};

Xut.nextTick = nextTick;

////////////////////////
///  获取文件的内容
///  1 js
///  2 svg->js
///  3 IBooks
///  4 PHP请求 => svg
///  5 插件    => svg
///////////////////////

/**
 * 随机Url地址
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
function randomUrl(url) {
  /*启动了预览，就必须要要缓存*/
  if (config.launch.preload) {
    return url;
  } else {
    return url + '?r=' + new Date().getTime();
  }
}

/**
 *  读取SVG内容
 *  @return {[type]} [string]
 */
function readFileContent(path, callback, type) {

  var paths = void 0;
  var name = void 0;
  var data = void 0;
  var svgUrl = void 0;

  /**
   * js脚本加载
   */
  var loadJs = function loadJs(fileUrl, fileName) {
    loadFile(randomUrl(fileUrl), function () {
      data = window.HTMLCONFIG[fileName];
      if (data) {
        callback(data);
        delete window.HTMLCONFIG[fileName];
      } else {
        $warn('js文件加载失败，文件名:' + path);
        callback('');
      }
    });
  };

  //con str
  //externalFile使用
  //如果是js动态文件
  //content的html结构
  if (type === "js") {
    paths = config.getSvgPath() + path;
    name = path.replace(".js", '');
    loadJs(paths, name);
    return;
  }

  /**
   * 如果配置了convert === 'svg'
   * 那么所有的svg文件就强制转化成js读取
   */
  if (config.launch.convert === 'svg') {
    path = path.replace('.svg', '.js');
    name = path.replace(".js", '');
    svgUrl = config.getSvgPath() + path;
    loadJs(svgUrl, name); //直接采用脚本加载
    return;
  }

  /**
   * ibooks模式 单独处理svg转化策划给你js,加载js文件
   */
  if (Xut.IBooks.CONFIG) {
    //如果是.svg结尾
    //把svg替换成js
    if (/.svg$/.test(path)) {
      path = path.replace(".svg", '.js');
    }
    //全路径
    paths = config.getSvgPath().replace("svg", 'js') + path;
    //文件名
    name = path.replace(".js", '');
    //加载脚本
    loadFile(randomUrl(paths), function () {
      data = window.HTMLCONFIG[name] || window.IBOOKSCONFIG[name];
      if (data) {
        callback(data);
        delete window.HTMLCONFIG[name];
        delete window.IBOOKSCONFIG[name];
      } else {
        $warn('编译:脚本加载失败，文件名:' + name);
        callback('');
      }
    });
    return;
  }

  //svg文件
  //游览器模式 && 非强制插件模式
  if (Xut.plat.isBrowser && !config.isPlugin) {
    //默认的地址
    svgUrl = config.getSvgPath().replace("www/", "") + path;

    //mini杂志的情况，不处理目录的www
    if (config.launch.resource) {
      svgUrl = config.getSvgPath() + path;
    }

    $.ajax({
      type: 'get',
      dataType: 'html',
      url: randomUrl(svgUrl),
      success: function success(svgContent) {
        callback(svgContent);
      },
      error: function error(xhr, type) {
        $warn('svg文件解释出错，文件名:' + path);
        callback('');
      }
    });
    return;
  }

  /**
   * 插件读取
   * 手机客户端模式
   */
  Xut.Plugin.ReadAssetsFile.readAssetsFileAction(config.getSvgPath() + path, function (svgContent) {
    callback(svgContent);
  }, function (err) {
    callback('');
  });
}

//替换url
//1. 路径
//2. 基础后缀
var urlRE = /(img\s+src|xlink:href)=\"[\w\/]*gallery\/(\w+)(\.[png|jpg|gif]+)/ig;

//替换style中的vw,vh单位尺寸
//width\s*:\s*(\d+[.\d]*)\s*(?=[vw|vh])/gi
//height\s*:\s*(\d+[.\d]*)\s*(?=[vw|vh])/gi
// const sizeRE = /([width|height]+)\s*:\s*(\d+[.\d]*)\s*(?=[vw|vh])/ig

//中文符号
// const symbols = {
//     "，": ",",
//     "。": ".",
//     "：": ":",
//     "；": ";",
//     "！": "!",
//     "？": "?",
//     "（": "(",
//     "）": ")",
//     "【": "[",
//     "】": "]"
// }
// const symbolRE = new RegExp(Object.keys(symbols).join("|"), "ig")


/**
 * 数据库缓存结果集
 */
var result = void 0;

/*
fileName + brModelType + baseSuffix + type
 */
function parseFileName(fileName, baseSuffix, type) {
  //如果启动了模式
  if (config.launch.brModelType) {
    if (config.launch.brModelType === 'delete') {
      return '' + fileName + baseSuffix; //增加后缀，去掉类型
    } else {
      return '' + fileName + config.launch.brModelType + baseSuffix; //增加brModelType，增加后缀，去掉类型
    }
  }
  //如果只加了baseSuffix模式处理
  return '' + fileName + baseSuffix + type;
}

/**
 * json数据过滤
 * 1 flow数据
 * 2 flow样式
 * 3 svgsheet
 */
function filterJsonData() {
  result = window.SQLResult;

  /*必须保证数据存在*/
  if (!result) {
    $warn('json数据库加载出错');
    return;
  }
  /*快速刷新会出错，加强判断*/
  if (!_.isObject(result)) {
    $warn('json数据库必须是对象');
    return;
  }
  if (!result.Setting) {
    $warn('json数据库必须要表');
    return;
  }

  //配置了远程地址
  //需要把flow的给处理掉
  if (config.launch.resource && result.FlowData) {

    /*如果没有强制关闭，并且有flow数据，那么就默认启动*/
    if (config.launch.columnCheck !== false) {
      config.launch.columnCheck = true;
    }

    //有基础后缀，需要补上所有的图片地址
    var baseSuffix = config.launch.baseImageSuffix ? '.' + config.launch.baseImageSuffix : '';

    //xlink:href
    //<img src
    //<img src="content/gallery/0920c97a591f525044c8d0d5dbdf12b3.png"
    //<img src="content/310/gallery/0920c97a591f525044c8d0d5dbdf12b3.png"
    //xlink:href="content/310/gallery/696c9e701f5e3fd82510d86e174c46a0.png"
    result.FlowData = result.FlowData.replace(urlRE, function (a, prefix, fileName, type) {
      return prefix + '="' + config.launch.resource + '/gallery/' + parseFileName(fileName, baseSuffix, type);
    });
  }

  window.SQLResult = null;

  return result;
}

/**
 * style width,height替换值
 * height:42vw
 * height:42.48vw
 * height : 42.48vw
 * height:  66.99vw
 * height:42.48 vw
 */
// function replaceSize(str, prop) {
//     return str.replace(sizeRE, function(a, key, value) {
//         return `${key}:${value * prop}`
//     })
// }


/**
 * 设置数据缓存
 * 加载配置文件指定路径数据库
 * 加载外部动态js加载的数据库文件
 *
 * 1 去掉全局挂着
 * 2 缓存
 */
function importJsonDatabase(callback) {
  var path = config.launch.database;
  //如果外联指定路径json数据
  if (path) {
    //防止外部链接影响
    window.SQLResult = null;
    loadFile(path, function () {
      callback(filterJsonData());
    });
  }
  //如果外联index.html路径json数据
  else if (window.SQLResult) {
      callback(filterJsonData());
    } else {
      callback();
    }
}

/**
 * 删除挂载的flow数据
 * @return {[type]} [description]
 */
function removeColumnData() {
  result['FlowData'] = null;
}

/**
 * 获取数据缓存
 * @return {[type]} [description]
 */
function getResults() {
  return result;
}

/**
 * 移除缓存数据
 * @return {[type]} [description]
 */
function removeResults() {
  result = null;
}

/**
 * 创建执行方法
 * @return {[type]} [description]
 */
function createfactory(sql, fn) {
  var key;
  if (typeof sql === 'string') {
    fn(key, sql);
  } else {
    for (key in sql) {
      fn(key, sql[key]);
    }
  }
}

/**
 * 模拟database获取数据
 * @return {[type]}            [description]
 */
function executeDB(sql, callback, errorCB, tName) {
  var jsonResult = getResults();
  var data = void 0;
  var resultObj = void 0;

  //如果json格式数据
  if (jsonResult) {
    if (jsonResult[tName]) {
      data = jsonResult[tName];
      resultObj = {
        length: Object.keys(data).length,
        item: function item(num) {
          return data[num];
        }
      };
      callback(resultObj);
    } else {
      errorCB({
        tName: ':table not exist!!'
      });
    }
  }
  //否则直接ajax php
  else {
      $.ajax({
        url: config.data.onlineModeUrl,
        dataType: 'json',
        data: {
          xxtsql: sql
        },
        success: function success(rs) {
          data = rs;
          resultObj = {
            length: rs.length,
            item: function item(num) {
              return data[num];
            }
          };
          callback(resultObj);
        },

        error: errorCB
      });
    }
}

//建立sql查询
function execute(selectSql, callback) {

  var database = config.data.db,
      tableName,
      //表名
  successResults = {},
      //成功的数据
  tempClosure = [],
      //临时收集器
  collectError = [],
      //收集错误查询
  buildTotal = function () {
    //如果只有一条
    if (typeof selectSql === 'string') {
      return 1;
    } else {
      return Object.keys(selectSql).length;
    }
  }();

  createfactory(selectSql, function (key, value) {
    //开始执行查询
    createSelect(key || 'results', value);
  });

  /**
   * 创建查询
   */
  function createSelect(key, value) {
    buildTotal--;
    tempClosure.push(executeTemplate(key, value));
    0 === buildTotal && executeBuild();
  }

  /**
   * 执行查询
   * @return {[type]} [description]
   */
  function executeBuild() {
    if (tempClosure.length) {
      var temp = tempClosure.shift();
      tableName = temp.tableName;
      temp.execute();
    } else {
      //successResults['results'] 成功表数据
      //collectError 失败表
      callback(successResults['results'] ? successResults['results'] : successResults, collectError);
    }
  }

  //成功后方法
  function success() {
    executeBuild();
  }

  //失败
  function errorCB(error) {
    collectError.push(tableName);
    console.log("数据查询错误 " + error.message, '类型', tableName);
    executeBuild();
  }

  /**
   * 构建执行作用域
   */
  function executeTemplate(tName, sql) {
    return {
      tableName: tName,
      execute: function execute() {
        //支持本地查询
        if (database) {
          database.transaction(function (tx) {
            tx.executeSql(sql, [], function (tx, result) {
              successResults[tName] = result.rows;
            });
          }, errorCB, success);
        }
        //json与ajax
        else {
            executeDB(sql, function (result) {
              successResults[tName] = result;
              success();
            }, errorCB, tName);
          }
      }
    };
  }
}

var statement = {};

'Setting,Parallax,Master,Activity,Content,Video,Image,Action,Animation,Widget,Novel,Season,Chapter'.replace(/[^, ]+/g, function (name) {
  statement[name] = 'select * FROM ' + name + ' order by _id ASC';
});

/**
 * 查询单一的数据
 * @return {[type]} [description]
 */
function oneQuery(tableName, callback) {
  execute('select * FROM ' + tableName + ' order by _id ASC', function (successRet, collectError) {
    callback(successRet, collectError);
  });
}

/**
 * 查询总数据
 */
function dataQuery(callback) {
  //ibook模式，数据库外部注入的
  if (Xut.IBooks.CONFIG) {
    callback(Xut.IBooks.CONFIG.data);
  } else {
    //查询所有数据
    execute(statement, function (successRet, collectError) {
      callback(successRet, collectError);
    });
  }
}

/**
 * 删除数据
 * @type {[type]}
 */
function dataRemove(tableName, id, success, fail) {
  var sql = 'delete from ' + tableName + ' where _id = ' + id;
  //查询所有数据
  execute(sql, function (success, failure) {
    if (success) {
      //成功回调
      success();
    } else if (failure) {
      //失败回调
      fail();
    }
  });
}

/**
 * 计算数据偏移量
 * @param  {[type]} tableName [description]
 * @return {[type]}           [description]
 */
var dataOffset = function dataOffset(dataCache) {

  var set = function set(tableName) {
    var start = void 0;
    var data = dataCache[tableName];
    if (data.length) {
      if (data.item(0)) {
        if (start = data.item(0)._id) {
          dataCache[tableName].start = start;
        }
      }
    }
  };

  //数据段标记
  for (var key in dataCache) {
    if (dataCache[key].item) {
      set(key);
    }
  }

  return dataCache;
};

/**
 * 转化video的activtiy信息
 * 因为Video不是靠id关联的 是靠activtiy关联
 * [description]
 * @return {[type]} [description]
 */
var transformVideoActivity = function transformVideoActivity(dataCache) {
  var data = void 0;
  var activityIds = {};
  var video = dataCache.Video;
  _.each(video, function (_, index) {
    data = video.item(index);

    //确保activityIdID是有值，
    //这样才是靠activity关联的video,
    //而不是动画的video
    if (data && data.activityId) {
      activityIds[data.activityId] = data._id;
    }
  });
  return activityIds;
};

/**
 * chpater分段
 * 转化section信息
 * 带有场景处理
 * @return {[type]} [description]
 */
var transformSectionRelated = function transformSectionRelated(dataCache) {
  var seasonId,
      start,
      length,
      sid,
      i,
      id,
      seasonInfo,
      toolbar,
      Chapters,
      container = {},
      Chapter = dataCache.Chapter,
      l = Chapter.length,
      end = 0;

  //找到指定的season信息
  var findSeasonInfo = function findSeasonInfo(seasonId) {
    var temp,
        seasonNum = dataCache.Season.length;
    while (seasonNum--) {
      if (temp = dataCache.Season.item(seasonNum)) {
        if (temp._id == seasonId) {
          return temp;
        }
      }
    }
  };

  for (i = 0; i < l; i++) {
    Chapters = Chapter.item(i);
    if (Chapters) {
      id = Chapters._id - 1; //保存兼容性,用0开头
      seasonId = Chapters.seasonId;
      sid = 'seasonId->' + seasonId;
      //如果不在集合,先创建
      if (!container[sid]) {
        //场景工具栏配置信息
        if (seasonInfo = findSeasonInfo(seasonId)) {
          toolbar = seasonInfo.parameter;
        }
        container[sid] = {
          start: id,
          length: 1,
          end: id,
          toolbar: toolbar
        };
      } else {
        container[sid].end = id;
        container[sid].length = container[sid].length + 1;
      }
    }
  }

  return container;
};

/**
 * 数据缓存
 */
var dataCache = void 0;

/**
 * 带有场景信息存数
 */
var sectionRelated = void 0;

/**
 * 音频的ActivityId信息
 */
var videoActivityIdCache = void 0;

/**
 * 错误表
 */
var errortables = void 0;

/**
 * 错误表
 * @return {[type]} [description]
 */
function errorTable() {
  return errortables;
}

/**
 * 保存缓存
 * @param {[type]} results [description]
 */
function saveCache(results, collectError) {
  //错表
  errortables = collectError || [];

  //数据结果集
  Xut.data = dataCache = results;
}

/**
 * 销毁数据
 * @return {[type]} [description]
 */
function removeCache() {
  dataCache = null;
  sectionRelated = null;
  videoActivityIdCache = null;
  Xut.data = null;
}

/**
 * 转化缓存
 */
function convertCache() {

  /**
   * 计算数据偏移量
   */
  dataOffset(dataCache);

  /**
   * vidoe特殊处理，需要记录chapterId范围
   */
  if (dataCache.Video) {
    videoActivityIdCache = transformVideoActivity(dataCache);
  }

  /**
   * 带有场景处理
   * @type {[type]}
   */
  sectionRelated = transformSectionRelated(dataCache);
}

/**
 *  查询数据接口
 *  1 video表传递是activityId关联
 *  2 其余表都是传递当前表的id
 *  type 查询ID的类型, 数据的id或者activityId
 *  callback 提供给chapterId使用
 * @return {[type]} [description]
 */
function setApi(novelId) {

  /**
   * 标记应用ID
   * @type {[type]}
   */
  dataCache.novelId = novelId;

  /**
   * 针对数据库content为空的处理
   * @return {[type]} [description]
   */
  dataCache.preventContent = function () {
    return dataCache.Content.length ? false : true;
  }();

  /**
   * 通过ID查询方式
   * @param  {[type]}  tableName [description]
   */
  dataCache.query = function (tableName, id, type, callback) {
    /**
     * 特殊的字段关联
     * 1 activityId
     * 2 chpaterId
     */
    switch (type) {
      /**
       * 通过activityId查询的方式
       *
       * 表名,ID,类型
       * Xut.data.query('Action', id, 'activityId');
       *
       * @type {[type]}
       */
      case 'activityId':
        var item;
        var activityId = id;
        var data = dataCache[tableName];
        for (var i = 0, len = data.length; i < len; i++) {
          item = data.item(i);
          if (item) {
            if (item[type] == activityId) {
              return item;
            }
          }
        }
        return;

      /**
       * 通过chpaterId查询方式
       * parser中的scanActivity过滤处理
       */
      case 'chapterId':
      case 'seasonId':
        var chapterId = id;
        var data = dataCache[tableName];
        if (data) {
          var item;
          for (var i = 0, len = data.length; i < len; i++) {
            item = data.item(i);
            if (item) {
              if (item[type] == chapterId) {
                callback && callback(item);
              }
            }
          }
        }
        return;
    }

    /**
     * 数据信息
     * @return {[type]} [description]
     */
    var Query = function Query() {
      var data = dataCache[tableName];
      if (id) {
        var index = id - data.start;
        return data.item(index);
      } else {
        return data.length ? data.item(0) : null;
      }
    };

    /**
     * 通过id查询的方式
     */
    switch (tableName) {
      //获取整个一个用的chapter数据
      case 'appPage':
        return dataCache.Chapter;
      ///获取整个一个用的Section数据 
      case 'appSection':
        return dataCache.Season;
      //如果是是section信息
      case 'sectionRelated':
        return sectionRelated['seasonId->' + id];
      //如果是音频
      case 'Video':
        if (type) {
          return Query();
        } else {
          //传递的id是activityId
          var id = videoActivityIdCache[id];
          return dataCache.query('Video', id, true);
        }

      default:
        //默认其余所有表
        return Query();
    }
  };

  /**
   * 针对动态表查询
   * 每次需要重新取数据
   * Xut.data.oneQuery('Image',function(){});
   * @return {[type]} [description]
   */
  dataCache.oneQuery = function (tableName, callback) {
    oneQuery(tableName, function (data) {
      callback && callback(data);
    });
  };

  /**
   * 删除数据
   * 表名,表ID
   * @return {[type]} [description]
   */
  dataCache.remove = function (tableName, id, success, failure) {
    dataRemove(tableName, id, success, failure);
  };
}

/**
 * 初始化数据类
 * 获取ppt总数
 * @return {[type]} [description]
 */
function createStore(callback) {
  dataQuery(function (results, collectError) {
    //保存缓存
    saveCache(results, collectError);
    //数据缓存转化
    convertCache();
    //设置API
    setApi(results.Novel.item(0)['_id']);
    callback(results);
  });
}

/**
 * 数据库支持
 * @return {[type]} [description]
 */
var supportTransaction = function supportTransaction(callback) {
  if (window.openDatabase) {
    try {
      //数据库链接对象
      config.data.db = window.openDatabase(config.data.dbName, "1.0", "Xxtebook Database", config.data.dbSize);
    } catch (err) {
      console.log('window.openDatabase出错');
    }
  }

  //如果读不出数据
  if (config.data.db) {
    config.data.db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM Novel', [], function (tx, rs) {
        callback();
      }, function () {
        config.data.db = null;
        callback();
      });
    });
  } else {
    callback();
  }
};

/*
初始化数据库Store
 */
var initStore = function initStore(callback) {
  createStore(function (dataRet) {
    return callback(dataRet);
  });
};

/**
 * 初始化
 * 数据结构
 */
var initDB = function (hasResults, callback) {
  if (hasResults) {
    config.data.db = null;
    initStore(callback);
    return;
  }
  /*如果没有外链数据，需要查找本地是否支持*/
  supportTransaction(function () {
    initStore(callback);
  });
};

/**
 * 默认工具栏配置
 * @type {Object}
 */
var defaults$1 = {
  ToolbarPos: 0, //工具栏[0顶部,1底部]
  NavbarPos: 1, //左右翻页按钮[0顶部, 1中间, 2底部]
  HomeBut: 1, //主页按钮[0不显示,1显示]
  ContentBut: 1, //目录按钮[0不显示,1显示]
  PageBut: 1, //页码按钮[0不显示,1显示]
  NavLeft: 1, //左翻页按钮[0不显示,1显示]
  NavRight: 1, //右翻页按钮[0不显示,1显示]
  customButton: 0, //自定义翻页按钮
  CloseBut: window.SUbDOCCONTEXT ? 1 : 0 //关闭按钮[0不显示,1显示]
};

/**
 * 配置默认数据
 * @return {[type]} [description]
 */
function initDefaults(setData) {

  var rs = void 0;
  var data = {};
  var setConfig = {};

  _.each(setData, function (key, index) {
    rs = setData.item(index);
    data[rs.name] = rs.value;
  });

  _.defaults(data, defaults$1);

  for (var i in defaults$1) {
    setConfig[i] = Number(data[i]);
  }

  _.extend(config.data, {
    //应用的唯一标识符
    //生成时间+appid
    appId: data.adUpdateTime ? data.appId + '-' + /\S*/.exec(data.adUpdateTime)[0] : data.appId,
    settings: setConfig,
    delayTime: data.delayTime,
    Inapp: data.Inapp,
    shortName: data.shortName,
    /*字符串类型，需要转化*/
    visualMode: data.visualMode ? Number(data.visualMode) : 0
  });

  //广告Id
  //2014.9.2
  Xut.Presentation.AdsId = data.adsId;

  return data;
}

/**
 * 用css3实现的忙碌光标
 * @return {[type]} [description]
 */

/**
 * 延时加载
 * @type {Number}
 */
var delayTime = 500;

/**
 * 光标对象
 * @type {[type]}
 */
var node = null;

/**
 * 是否禁用忙了光标
 * @type {Boolean}
 */
var isDisable = false;

/**
 * 光标状态
 * 调用隐藏
 * @type {Boolean}
 */
var isCallHide = false;

/**
 * setTimouet
 * @type {[type]}
 */
var timer = null;

/**
 * 设置忙碌光标的图片地址
 */
var path = void 0;

/**
 * create
 * @return {[type]} [description]
 */
function createCursor() {
  if (isDisable) return;
  var sWidth = config.visualSize.width;
  var sHeight = config.visualSize.height;
  var width = Math.min(sWidth, sHeight) / 4;
  var space = Math.round((sHeight - width) / 2);
  var delay = [0, 0.9167, 0.833, 0.75, 0.667, 0.5833, 0.5, 0.41667, 0.333, 0.25, 0.1667, 0.0833];
  var deg = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  var count = 12;
  var container = '';

  /*自定义*/
  if (path) {
    container += '<div class="xut-busy-middle fullscreen-background"\n                       style="background-image: url(' + path + ');">\n                  </div>';
  } else {
    /*自带*/
    while (count--) {
      container += '<div class="xut-busy-spinner"\n              style="' + Xut.style.transform + ':rotate(' + deg[count] + 'deg) translate(0,-142%);' + Xut.style.animationDelay + ':-' + delay[count] + 's">\n         </div>';
    }
    container = '<div class="xut-busy-middle">' + container + '</div>';
  }

  node = $('.xut-busy-icon').html(String.styleFormat('<div style="width:' + width + 'px;height:' + width + 'px;margin:' + space + 'px auto;margin-top:' + (config.visualSize.top + space) + 'px;">\n        <div style="height:30%;"></div>\n          ' + container + '\n        <div class="xut-busy-text"></div>\n     </div>'));
}

var clear = function clear() {
  clearTimeout(timer);
  timer = null;
};

/**
 * 显示光标
 */
var showBusy = function showBusy() {
  if (isDisable || Xut.IBooks.Enabled || timer) return;
  timer = setTimeout(function () {
    node.show();
    clear();
    if (isCallHide) {
      hideBusy();
      isCallHide = false;
    }
  }, delayTime);
};

/**
 * 隐藏光标
 */
var hideBusy = function hideBusy() {
  //显示忙碌加锁，用于不处理hideBusy
  if (isDisable || Xut.IBooks.Enabled || showBusy.lock) return;
  if (!timer) {
    node.hide();
  } else {
    isCallHide = true;
  }
};

/**
 * 显示光标
 * @param {[type]} txt [description]
 */
var showTextBusy = function showTextBusy(txt) {
  if (isDisable || Xut.IBooks.Enabled) return;
  node.css('pointer-events', 'none').find('.xut-busy-text').html(txt);
  showBusy();
};

/**
 * 重置忙碌光标
 * 因为设置被覆盖了
 */
var resetCursor = function resetCursor(data) {
  path = null;
  delayTime = 500;
};

/**
 * 通过lanuch重设接口
 */
var setPath = function setPath(url) {
  path = url;
};

/**
 * 设置时间显示的时间间隔
 */
var setDelay = function setDelay(time) {
  delayTime = time;
};

/**
 * 设置禁用光标
 * isDisable 是否禁用
 * @return {[type]} [description]
 */
var setDisable = function setDisable() {
  isDisable = true;
};

/*
是否禁止了
 */
var hasDisable = function hasDisable() {
  return isDisable;
};

/**
 * 记录分栏数据
 * columnData[seasonsId][chapterId] = {
 *     count,
 *     height
 * }
 * @type {Object}
 */
var columnData = void 0;

/**
 * 缓存流式布局对象
 */
function addCache(data) {
  columnData = data;
}

/**
 * 后台补全，如果数量错误，重设分栏的数量
 */
function resetColumnCount(seasonsId, chapterId, value) {
  if (columnData[seasonsId] && columnData[seasonsId][chapterId]) {
    columnData[seasonsId][chapterId] = value;
  }
}

/**
 * 是否有流式排版
 * 加快计算
 * @return {Boolean} [description]
 */
function hasColumn() {
  return columnData;
}

/**
 * 获取当前当前到前置的总和
 * @return {[type]} [description]
 */
function getCurrentBeforeCount(seasonId, chapterId) {
  if (!columnData) return;
  if (!seasonId && !chapterId) return;
  var seasonIds = columnData[seasonId];
  var count = 0;
  for (var key in seasonIds) {
    if (key <= chapterId) {
      count += seasonIds[key];
      --count;
    }
  }
  return count > 0 ? count : 0;
}

/**
 * 获取当前chapterId之前的总页数
 * @return {[type]} [description]
 */
function getBeforeCount(seasonId, chapterId) {
  if (columnData && seasonId && chapterId) {
    var seasonIds = columnData[seasonId];
    var count = 0;
    for (var key in seasonIds) {
      if (key < chapterId) {
        count += seasonIds[key];
        --count;
      }
    }
    return count > 0 ? count : 0;
  }
}

/**
 * 获取chpater总数
 * 一共有多少chapter页面有分栏
 */
function getColumnChapterCount(seasonId) {
  if (!columnData) return;
  return Object.keys(columnData[seasonId]).length;
}

/**
 * reutrn seasonIds
 * return chpaterIds
 */
function getColumnCount$1(seasonId, chapterId) {
  if (!columnData) return;
  if (seasonId) {
    if (chapterId) {
      return columnData[seasonId] && columnData[seasonId][chapterId];
    } else {
      var seasonIds = columnData[seasonId];
      var count = 0;
      for (var key in seasonIds) {
        count += seasonIds[key];
      }
      return count;
    }
  } else {
    console.log('getCounts失败');
  }
}

/**
 * 判断是否为分栏布局页面
 * @param  {[type]} seasonId  [description]
 * @param  {[type]} chpaterId [description]
 * @return {[type]}           [description]
 */
function isColumnPage(seasonId, chapterId) {
  return getColumnCount$1(seasonId, chapterId) ? true : false;
}

/**
 * debug调试
 */
var debug = false;
var simulateCount = 2;

/**
 * 模拟检测次数
 */
var simulateTimer = 13;

/**
 * 检测引用
 */
var timerId = null;

/**
 * 基本检测次数 20*500 ~ 10秒范围
 */
var baseCheckCount = 20;

/**
 * 分栏探测
 */
var makeDelay = function makeDelay(seasonsId, chapterId, count) {
  return function () {
    resetColumnCount(seasonsId, chapterId, count);
  };
};

var execDelay = function execDelay(tempDelay) {
  if (tempDelay.length) {
    var fn = void 0;
    while (fn = tempDelay.pop()) {
      fn();
    }
    Xut.Application.Notify('change:number:total');
    Xut.Application.Notify('change:column');
  }
};

/**
 * 检测分栏数
 */
function detectColumn($seasons, columnCollection, callback, checkCount) {
  var tempDelay = [];

  getColumnData($seasons, function (seasonsId, chapterId, count) {
    if (debug && checkCount > simulateTimer) {
      count = simulateCount;
    }
    //假如高度改变
    if (columnCollection[seasonsId][chapterId] !== count) {
      columnCollection[seasonsId][chapterId] = count;
      tempDelay.push(makeDelay(seasonsId, chapterId, count));
    }
  });

  --checkCount;

  //执行监控改变
  tempDelay.length && execDelay(tempDelay);

  if (checkCount) {
    timerId = setTimeout(function () {
      detectColumn($seasons, columnCollection, callback, checkCount);
    }, 500);
  } else {
    //如果探测完毕就强制关闭检测了
    config.launch.columnCheck = false;
    clearColumnDetection();
    callback();
  }
}

/**
 * 开始分栏探测
 */
function startColumnDetect($seasons, columnCollection, callback) {
  detectColumn($seasons, columnCollection, callback, baseCheckCount);
}

/**
 * 停止分栏高度探测
 */
function clearColumnDetection() {
  Xut.Application.unWatch('change:number:total change:column');
  clearTimeout(timerId);
  timerId = null;
}

var COLUMNWIDTH = Xut.style.columnWidth;
var COLUMNTAP = Xut.style.columnGap;

/**
 * 高度marginTop - marginBottom处理了
 * 不一定等于设备高度
 * @type {Number}
 */
var newViewHight = 0;

/**
 * create dom...
 */
var createStr = function createStr(chapterId, data, visualWidth, visualHeight, margin) {

  var percentageTop = Number(margin[0]);
  var percentageLeft = Number(margin[1]);
  var percentageBottom = Number(margin[2]);
  var percentageRight = Number(margin[3]);

  //减去的宽度值
  var negativeWidth = visualWidth / 100 * (percentageLeft + percentageRight);

  //减去的高度值
  var negativeHeight = visualHeight / 100 * (percentageTop + percentageBottom);

  //容器宽度 = 宽度 - 左右距离比值
  var containerWidth = visualWidth - negativeWidth;

  //容器高度值 = 宽度 - 上下距离比值
  var containerHeight = visualHeight - negativeHeight;

  //容器左边偏移量
  var containerLeft = negativeWidth / 2;

  //容器上偏移量
  var containerTop = visualHeight / 100 * percentageTop;

  //重复加载杂志
  //不刷新的情况处理
  if (/section-transform/.test(data)) {
    data = $(data).find("#columns-content").html();
  }

  if (config.launch.scrollMode === 'v') {
    /*竖版的情况下，不需要分栏了，直接处理*/
    var columnGap = COLUMNTAP + ':' + negativeWidth + 'px';
    var columnWidth = COLUMNWIDTH + ':' + containerWidth + 'px';
    var container = '\n            <section id="wrapper-section" class="section-transform" data-flow="true" style="width:' + (visualWidth - containerLeft) + 'px;height:' + (visualHeight - containerTop) + 'px;top:' + containerTop + 'px;left:' + containerLeft + 'px;">\n                <div  id="scroller-section" class="page-flow-scale" data-role="margin" style="width:' + containerWidth + 'px;height:auto;">\n                      ' + data + '\n                </div>\n            </section>';
    newViewHight = visualHeight - containerTop;
    return String.styleFormat(container);
  } else {
    /*配置分栏*/
    var _columnGap = COLUMNTAP + ':' + negativeWidth + 'px';
    var _columnWidth = COLUMNWIDTH + ':' + containerWidth + 'px';
    var _container = '\n            <section class="section-transform" data-flow="true">\n                <div class="page-flow-scale" data-role="margin" style="width:' + containerWidth + 'px;height:' + containerHeight + 'px;margin-top:' + containerTop + 'px;margin-left:' + containerLeft + 'px;">\n                    <div data-role="column" id="columns-content" style="' + _columnWidth + ';height:100%;' + _columnGap + '">\n                        ' + data + '\n                    </div>\n                </div>\n            </section>';
    newViewHight = containerHeight;
    return String.styleFormat(_container);
  }
};

var insertColumn = function insertColumn(seasonNode, seasonsId, visualWidth, visualHeight, columnData) {
  for (var i = 0; i < seasonNode.childNodes.length; i++) {
    var chapterNode = seasonNode.childNodes[i];
    if (chapterNode.nodeType == 1) {
      var tag = chapterNode.id;
      if (tag) {
        var id = /\d+/.exec(tag)[0];
        if (id) {
          var margin = chapterNode.getAttribute('data-margin');
          if (margin) {
            margin = margin.split(",");
          } else {
            margin = [0, 0, 0, 0];
          }
          chapterNode.innerHTML = createStr(id, chapterNode.innerHTML, visualWidth, visualHeight, margin);
          columnData[seasonsId][id] = 0;
        } else {
          $warn('node tag is null on insertColumn');
        }
      } else {
        $warn('node tag is null on insertColumn');
      }
    }
  }
};

var eachColumn = function eachColumn(columnData, $seasons, visualWidth, visualHeight) {
  $seasons.each(function (index, node) {
    var tag = node.id;
    var seasonsId = tag.match(/\d/)[0];
    var $chapters = $seasons.children();
    columnData[seasonsId] = {};
    insertColumn(node, seasonsId, visualWidth, visualHeight, columnData);
  });
};

/**
 * 获取分栏数
 */
var getColumnCount$$1 = function getColumnCount$$1(content, id) {
  var theChildren = $(content).find(id).children();
  var paraHeight = 0;
  for (var i = 0; i < theChildren.length; i++) {
    paraHeight += Math.max(theChildren[i].scrollHeight, theChildren[i].clientHeight);
  }
  return Math.ceil(paraHeight / newViewHight);
};

/**
 * 获取分栏的数量与高度
 * 1 横版，数量
 * 2 竖版，高度
 */
function getColumnData($seasons, callback) {
  $seasons.each(function (index, node) {
    var tag = node.id;
    var seasonsId = tag.match(/\d/)[0];
    var $chapters = $seasons.children();
    $chapters.each(function (index, node) {
      var tag = node.id;
      if (tag) {
        var chapterId = tag.match(/\d+/)[0];
        var count = void 0;
        if (config.launch.scrollMode === 'h') {
          count = getColumnCount$$1(node, '#columns-content');
        } else if (config.launch.scrollMode === 'v') {
          count = getColumnCount$$1(node, '#scroller-section');
        }
        callback(seasonsId, chapterId, count);
      }
    });
  });
}

/**
 * 构建column页面代码结构
 */
function initColumn(callback) {

  var $container = $("#xut-stream-flow");
  if ($container.length) {
    $container.remove();
  }

  var setHeight = function setHeight($container, visualWidth, visualHeight) {
    $container.css({
      width: visualWidth,
      height: visualHeight,
      display: 'block'
    });
  };

  var setInit = function setInit(visualWidth, visualHeight) {
    var $seasons = $container.children();
    if (!$seasons.length) {
      callback();
      return;
    }

    /**
     * 记录分栏数据
     * columnData[seasonsId][chapterId] = {
     *     count,
     *     height
     * }
     * @type {Object}
     */
    var columnData = {};
    setHeight($container, visualWidth, visualHeight);
    eachColumn(columnData, $seasons, visualWidth, visualHeight);

    /**
     * 得到分栏的数据
     * 1 数量
     * 2 高度
     * 3 检测是否有丢失
     */
    setTimeout(function () {

      //第一次获取分栏数与高度 analysis
      getColumnData($seasons, function (seasonsId, chapterId, count) {
        if (debug && config.launch.columnCheck) {
          count = simulateCount;
        }
        columnData[seasonsId][chapterId] = count;
      });

      addCache(columnData);

      //检测分栏是否丢失，补充
      if (config.launch.columnCheck) {
        startColumnDetect($seasons, $.extend(true, {}, columnData), function () {
          $container.hide();
        });
      } else {
        $container.hide();
      }

      callback(Object.keys(columnData).length);
    }, 100);

    $('body').append($container);
  };

  //如果存在json的flow数据
  var results = getResults();
  if (results && results.FlowData) {
    //容器尺寸设置
    var visuals = resetVisualLayout(1);
    var visualHeight = newViewHight = visuals.height;

    //加载flow样式
    loadGolbalStyle('xxtflow', function () {
      $container = $(results.FlowData);
      removeColumnData(); //删除flowdata，优化缓存
      setInit(visuals.width, visualHeight);
    });
  } else {
    //没有任何flow
    callback();
  }
}

/**
 * content对象的创建过滤器
 * 用于阻断对象的创建
 */
function contentFilter(filterName) {

  function setCache(listFilters) {
    $setStorage(filterName || 'aaron', JSON.stringify(listFilters));
  }

  function getCache() {
    var jsonStr = $getStorage(filterName);
    if (jsonStr) {
      return parseJSON(jsonStr);
    }
    return '';
  }

  //过滤的节点
  var listFilters = function () {
    var values = getCache();
    var h = hash();
    if (values) {
      //keep the listFilters has no property
      _.each(values, function (v, i) {
        h[i] = v;
      });
    }
    return h;
  }();

  function access(callback, pageId, contentId) {
    //如果是transformFilter,不需要pageIndex处理
    if (filterName === 'transformFilter' && contentId === undefined) {
      contentId = pageId;
      pageId = 'transformFilter';
    }
    return callback(pageId, Number(contentId));
  }

  return {
    add: function add(pageId, contentId) {
      access(function (pageId, contentId) {
        if (!listFilters[pageId]) {
          listFilters[pageId] = [];
        }
        //去重
        if (-1 === listFilters[pageId].indexOf(contentId)) {
          listFilters[pageId].push(contentId);
          setCache(listFilters);
        }
      }, pageId, contentId);
    },
    remove: function remove(pageId, contentId) {
      access(function (pageId, contentId) {
        var target = listFilters[pageId] || [],
            index = target.indexOf(contentId);
        if (-1 !== index) {
          target.splice(index, 1);
          setCache(listFilters);
        }
      }, pageId, contentId);
    },
    has: function has(pageId, contentId) {
      return access(function (pageId, contentId) {
        var target = listFilters[pageId];
        return target ? -1 !== target.indexOf(contentId) ? true : false : false;
      }, pageId, contentId);
    },


    /**
     * 创建过滤器
     * @param  {[type]} pageId [description]
     * @return {[type]}        [description]
     */
    each: function each(pageId) {
      return access(function (pageId, contentId) {
        var target, indexOf;
        if (target = listFilters[pageId]) {
          return function (contentIds, callback) {
            _.each(target, function (ids) {
              var indexOf = contentIds.indexOf(ids);
              if (-1 !== indexOf) {
                callback(indexOf); //如果找到的过滤项目
              }
            });
          };
        }
      }, pageId);
    },


    //过滤器数量
    size: function size() {
      return _.keys(listFilters).length;
    },
    empty: function empty() {
      $removeStorage(filterName);
      listFilters = {};
    }
  };
}

/**
 * 创建共享对象
 * 这里是为了限制对象的创建数
 * 优化
 *
 * @param  {[type]} total [description]
 * @return {[type]}       [description]
 */

var Share = function () {
  function Share(name) {
    classCallCheck(this, Share);

    this.state = 'init';
    this.cache = [];
  }

  createClass(Share, [{
    key: "add",
    value: function add(object) {
      this.cache.push(object);
    }
  }, {
    key: "get",
    value: function get$$1() {

      if (this.cache.length) {
        return this.cache.shift();
      }
    }
  }, {
    key: "destory",
    value: function destory() {
      for (var i = 0; i < this.cache.length; i++) {
        if (this.cache[i]) {
          this.cache[i].src = null;
          this.cache[i].removeAttribute("src");
          this.cache[i] = null;
        }
      }
    }
  }]);
  return Share;
}();

/**
 * 音频文件解析
 * @param  {[type]}   filePath [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 *
 * */

var audioShare = null;

/**
 * 如果有共享的音频对象就返回
 * @return {[type]} [description]
 */
function getAudio() {
  if (!audioShare) {
    audioShare = new Share();
  }
  if (audioShare) {
    var audio = audioShare.get();
    if (audio) {
      return audio;
    }
  }
  return new Audio();
}

/**
 * 预加载完毕后清除对象
 * @return {[type]} [description]
 */
function clearAudio() {
  if (audioShare) {
    audioShare.destory();
  }
  audioShare = null;
}

/**
 * 音频文件解析
 */
function audioParse(url, callback) {

  var audio = getAudio();
  audio.src = url;
  audio.preload = "auto";
  audio.autobuffer = true;
  audio.autoplay = true;
  audio.muted = true; //ios 10以上静音后可以自动播放

  var loopTimer = null; //循环检测时间

  /**
   * 清理检测对象
   * @return {[type]} [description]
   */
  function clear(isExit) {
    if (loopTimer) {
      clearTimeout(loopTimer);
      loopTimer = null;
    }
    if (audio) {
      audio.removeEventListener("loadedmetadata", success, false);
      audio.removeEventListener("error", exit, false);
      //置空src后会报错 找不到null资源 移除src属性即可
      audio.src = null;
      audio.removeAttribute("src");
      audioShare && audioShare.add(audio); //加入到循环队列
      audio = null;
    }
  }

  /**
   * 成功退出
   * @return {[type]} [description]
   */
  function exit(isExit) {
    clear(isExit);
    callback();
  }

  /**
   * 支持buffered的情况下
   * 可以通过buffered提前判断
   * 为了优化下载的时间
   * @return {[type]} [description]
   */
  function startBuffered() {

    /*如果第一次就已经加载结束
      加载完成之后就不需要再调play了 不然chrome会报打断错误
    */
    if (getComplete()) {
      exit('isExit');
      return;
    }

    audio.play();

    /*总时间*/
    var allTime = audio.duration;

    /*是否缓存完毕*/
    function getComplete(loop) {
      //移动端浏览器loadedmetadata事件执行时可能还没有开始缓存
      //判断是否缓存完毕时要加上audio.buffered.length条件
      if (audio.buffered.length && allTime == audio.buffered.end(audio.buffered.length - 1)) {
        return true;
      } else {
        return false;
      }
    }

    /**
     * loopBuffered检测
     * 循环500毫秒一次
     * @return {[type]} [description]
     */
    function loopBuffered() {
      loopTimer = setTimeout(function () {
        if (getComplete()) {
          exit('isExit');
          return;
        } else {
          loopBuffered();
        }
      }, 500);
    }
    loopBuffered();
  }

  /**
   * 在loadedmetadata事件完成后
   * 1 如果支持buffered判断，那么走buffered
   * 2 如果不支持buffered那么靠外部的定时器处理
   */
  function success() {
    if (!audio.buffered) {
      exit(); //如果不支持buffered，直接退出
      return;
    }
    /////////////////////////////
    /// ios 10与PC端
    /// 1、速度很快的情况马上就缓存完毕
    /// 2、如果文件已经被缓存过了
    /////////////////////////////
    startBuffered();
  }

  audio.addEventListener("loadedmetadata", success, false);
  audio.addEventListener("error", exit, false);

  return {
    destory: clear
  };
}

var imageShare = null;

function getImage() {
  if (!imageShare) {
    imageShare = new Share();
  }
  if (imageShare) {
    var image = imageShare.get();
    if (image) {
      return image;
    }
  }
  return new Image();
}

function clearImage() {
  if (imageShare) {
    imageShare.destory();
  }
  imageShare = null;
}

/**
 * 图片解析
 */
function imageParse(url, callback) {

  /**如果有缓存图片的后缀*/
  var brModelType = config.launch.brModelType;
  if (brModelType) {
    /*必须$结尾，因为url中间有可能存在apng_
    content/22/gallery/apng_70fe7a26b9208e74451c6262fd253cd2_a*/
    url = url.replace(/.png$|.jpg$/, brModelType);
  }

  /**
   * 这里最主要是替换了图片对象，优化了创建
   */
  var imageObject = loadFigure({
    image: getImage(),
    url: url
  }, function () {
    imageShare && imageShare.add(imageObject); //加入到循环队列
    callback();
  });

  return {
    destory: function destory() {
      if (imageObject) {
        imageObject.src = null;
        imageObject.removeAttribute("src");
        imageObject = null;
      }
    }
  };
}

/**
 * 视频文件解析
 * @param  {[type]}   filePath [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */

/**
 * 视频SVG解析
 */
function svgParse(filePath, callback) {
  $.ajax({
    url: filePath,
    complete: callback
  });
}

////////////////////////////
/// 文件路径生成器
/// 不同类型对应不同的路径配置
////////////////////////////

/**
 * 格式字符串
 */
var formatString = function formatString(data, basePath) {
  data = data.split(',');
  var dataset = void 0;
  var sizes = [];
  var fileNames = [];
  data.forEach(function (name) {
    dataset = name.split('-');
    /*如果没有尺寸*/
    if (dataset.length === 1) {
      fileNames.push(basePath + name);
    } else {
      sizes.push(Number(dataset[0]));
      fileNames.push(basePath + dataset[1]);
    }
  });
  return {
    sizes: sizes,
    fileNames: fileNames,
    length: data.length
  };
};

/**
 * 格式对象
 */
var formatObject = function formatObject(data, basePath) {
  var dataset = void 0;
  var fileNames = [];
  var sizes = []; //尺寸

  var _loop = function _loop(dir) {
    var d = data[dir].split(',');
    d.forEach(function (name) {
      dataset = name.split('-');
      if (dataset.length === 1) {
        fileNames.push(basePath + dir + '/' + name);
      } else {
        sizes.push(Number(dataset[0]));
        fileNames.push(basePath + dir + '/' + dataset[1]);
      }
    });
  };

  for (var dir in data) {
    _loop(dir);
  }
  return {
    sizes: sizes,
    fileNames: fileNames,
    length: fileNames.length
  };
};

var pathHooks = {

  /**
   * 文本图片
   */
  content: function content(data) {
    return formatString(data, config.data.pathAddress);
  },


  /**
   * 媒体
   * @type {[type]}
   */
  audio: function audio(data) {
    return formatString(data, config.data.pathAddress);
  },
  video: function video(data) {
    return formatString(data, config.data.pathAddress);
  },


  /**
   * svg
   */
  svg: function svg(data) {
    return formatString(data, config.data.pathAddress);
  },


  /**
   * 零件图片
   */
  widget: function widget(data) {
    return formatString(data, config.data.rootPath + '/widget/gallery/');
  },


  /**
   * content下的自动精灵动画
   * autoSprite: {
   *   2: '1.jpg,2.jpg',
   *   3: '1.jpg,2.jpg'
   * }
   */
  autoSprite: function autoSprite(data) {
    return formatObject(data, config.data.pathAddress);
  },


  /*
    高级精灵动画
    seniorSprite: {
      2: '1.jpg,2.jpg',
      3: '1.jpg,2.jpg'
    }
  */
  seniorSprite: function seniorSprite(data) {
    return formatObject(data, config.data.rootPath + '/widget/gallery/');
  }
};

/**
 *
 * 基本事件管理
 * 1 异步
 * 2 同步
 *
 */

var ArrayProto = Array.prototype;
var nativeIndexOf = ArrayProto.indexOf;
var slice = ArrayProto.slice;
var _indexOf = function _indexOf(array, needle) {
  var i, l;
  if (nativeIndexOf && array.indexOf === nativeIndexOf) {
    return array.indexOf(needle);
  }
  for (i = 0, l = array.length; i < l; i++) {
    if (array[i] === needle) {
      return i;
    }
  }
  return -1;
};

var Observer = function () {
  function Observer() {
    classCallCheck(this, Observer);

    this.$$watch = this.bind;
    this.$$unWatch = this.unbind;
    this.$$emit = this.trigger;
    this.$$once = this.one;

    //触发列表名称
    //防止同步触发
    this._handleName = {};
  }

  createClass(Observer, [{
    key: "bind",
    value: function bind(event, fn) {
      var i, part;
      var events = this.events = this.events || {};
      var parts = event.split(/\s+/);
      var num = parts.length;

      for (i = 0; i < num; i++) {
        events[part = parts[i]] = events[part] || [];
        if (_indexOf(events[part], fn) === -1) {
          events[part].push(fn);
        }
      }

      //假如存在同步句柄
      //执行
      var data;
      if (data = this._handleName[event]) {
        this.$$emit(event, data[0]);
      }

      return this;
    }
  }, {
    key: "one",
    value: function one(event, fn) {
      // [notice] The value of fn and fn1 is not equivalent in the case of the following MSIE.
      // var fn = function fn1 () { alert(fn === fn1) } ie.<9 false
      var fnc = function fnc() {
        this.unbind(event, fnc);
        fn.apply(this, slice.call(arguments));
      };
      this.bind(event, fnc);
      return this;
    }

    //event = 'a b c' 空格分离多个事件名
    //提供fn 指定在某个事件中删除某一个
    //否则只提供事件名 ，全删除

  }, {
    key: "unbind",
    value: function unbind(event, fn) {

      var eventName, i, index, num, parts;
      var events = this.events;

      if (!events) return this;

      //指定
      if (arguments.length) {
        parts = event.split(/\s+/);
        for (i = 0, num = parts.length; i < num; i++) {
          if ((eventName = parts[i]) in events !== false) {
            //如果提供函数引用
            //那么就是在数组中删除其中一个
            if (fn) {
              index = _indexOf(events[eventName], fn);
              if (index !== -1) {
                events[eventName].splice(index, 1);
              }
            } else {
              //如果只提供了名字，则全删除
              events[eventName] = null;
            }

            //如果没有内容了
            if (!events[eventName] || !events[eventName].length) {
              delete events[eventName];
            }
          }
        }
      } else {
        this.events = null;
      }

      return this;
    }
  }, {
    key: "trigger",
    value: function trigger(event) {
      var args, i;
      var events = this.events,
          handlers;

      //参数
      args = slice.call(arguments, 1);

      if (!events || event in events === false) {
        // console.log(event)
        //同步的情况
        //如果除非了事件，可能事件句柄还没有加载
        this._handleName[event] = args;
        return this;
      }

      handlers = events[event];
      for (i = 0; i < handlers.length; i++) {
        handlers[i].apply(this, args);
      }
      return this;
    }
  }]);
  return Observer;
}();

/**
 *  异步存取器
 *  用于异步任务创建
 *  转化同步处理的一个类
 */

var AsyAccess = function (_Observer) {
  inherits(AsyAccess, _Observer);

  function AsyAccess() {
    classCallCheck(this, AsyAccess);

    var _this = possibleConstructorReturn(this, (AsyAccess.__proto__ || Object.getPrototypeOf(AsyAccess)).call(this));

    _this.asys = [];
    return _this;
  }

  /**
   * 只接受函数类型
   * @param  {Function} fn [description]
   * @return {[type]}      [description]
   */


  createClass(AsyAccess, [{
    key: 'create',
    value: function create(fn) {
      var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'push';

      if (fn && typeof fn === 'function') {
        this.asys[position](fn);
      }
    }

    /**
     * 执行
     * @return {[type]} [description]
     */

  }, {
    key: 'exec',
    value: function exec() {
      var _this2 = this;

      if (this.asys.length) {
        var next = function next() {
          if (_this2.asys.length) {
            var asy = _this2.asys.shift();
            asy(next);
          } else {
            _this2.$$emit('complete');
          }
        };
        next();
      }
      return this;
    }
  }]);
  return AsyAccess;
}(Observer);

////////////////////////////////
/// 资源加载错误后，开始循环检测2次
/// 分别是6秒 - 12秒的时间
///////////////////////////////
/**
 * 循环的列表对象
 * @type {Array}
 */
var loopQueue = {};

/**
 * 增加循环列表
 * @param {[type]} argument [description]
 */
function addLoop(filePath, detect) {
  if (loopQueue[filePath]) {
    // $warn(`错误循环的文件已经存在循环列表 ${filePath}`)
  } else {
    /**
     * 重设循环检测
     * 不重新创建新的对象
     * 通过实例重设检测
     * 1 减少http检测
     * 2 不重复创建对象
     */
    loopQueue[filePath] = detect;
    detect.reset(12000, function () {
      loopQueue[filePath].destory();
      loopQueue[filePath] = null;
      delete loopQueue[filePath];
    });
  }
}

/**
 * 清理循环检测
 * @return {[type]} [description]
 */
function clearLoop() {
  if (loopQueue) {
    for (var key in loopQueue) {
      loopQueue[key].destory();
      loopQueue[key] = null;
    }
  }
  loopQueue = {};
}

/////////////////////////////////////////////////////////////////////
///  探测资源的正确性
///
///  1. 通过每个parser自己去请求缓存成功
///  2. 如果parser的第一次请求时间大于2秒，那么主动就默认返回失败
///  3. 失败文件就会走loop队列
///
/////////////////////////////////////////////////////////////////////
var Detect = function () {

  /**
   * [constructor description]
   * @param  {[type]} parser   [解析器]
   * @param  {[type]} filePath [路径]
   * @return {[type]}          [description]
   */
  function Detect(parser, filePath) {
    classCallCheck(this, Detect);

    this.state = false;
    this.timer = null;
    this.parser = parser;
    this.filePath = filePath;
  }

  /**
   * 销毁检测对象
   * 如果parser解析完毕后，主动调用销毁接口
   * 1 audio
   */


  createClass(Detect, [{
    key: '_clearDownload',
    value: function _clearDownload() {
      if (this._downObj) {
        this._downObj.destory && this._downObj.destory();
        this._downObj = null;
      }
    }

    /**
     * 开始通过API下载文件
     * @return {[type]} [description]
     */

  }, {
    key: '_downloadFile',
    value: function _downloadFile() {
      var _this = this;

      this._downObj = this.parser(this.filePath, function () {
        _this.state = true;
        _this.callback && _this.callback();
      });
    }

    /**
     * 清理定时器
     * @return {[type]} [description]
     */

  }, {
    key: '_clearWatcher',
    value: function _clearWatcher() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    }

    /**
     * 创建主动监听
     * @return {[type]} [description]
     */

  }, {
    key: '_createWather',
    value: function _createWather(time) {
      var _this2 = this;

      if (!this.state) {
        this.timer = setTimeout(function () {
          _this2.callback && _this2.callback();
        }, time);
      }
    }

    /**
     * 创建退出函数
     * @return {[type]} [description]
     */

  }, {
    key: '_createExitFn',
    value: function _createExitFn(fn) {
      var _this3 = this;

      this.callback = function () {
        _this3._clearWatcher(); //清理主动观察
        _this3.callback = null;
        fn(_this3.state);
      };
    }

    /////////////////////////////////////
    ///
    ///          对外接口
    ///
    /////////////////////////////////////

    /**
     * 开始下载
     * @param  {[type]}   checkTime [主动检测时间]
     * @param  {Function} fn        [不管成功或者失败都会调用]
     * @return {[type]}             [description]
     */

  }, {
    key: 'start',
    value: function start(checkTime, fn) {

      this._createExitFn(fn);

      /*开始下载*/
      this._downloadFile();

      /**
       * 主动监听
       * 如果在主动观察指定的时间内自动下载没有完毕
       * 那么主动就会被调用，这个detect对象就会走循环队列
       * 执行reset长轮询
       */
      this._createWather(checkTime);
    }

    /**
     * 重设检测
     * 1 在第一次检测失败后
     * 2 循环队列中开始重复检测
     * @return {[type]} [description]
     */

  }, {
    key: 'reset',
    value: function reset(checkTime, fn) {

      this._createExitFn(fn);

      // 开始新的主动检测最长12秒
      this._createWather(checkTime);
    }

    /**
     * 销毁
     * @return {[type]} [description]
     */

  }, {
    key: 'destory',
    value: function destory() {
      this._clearDownload();
      this._clearWatcher();
      this.callback = null;
      this.parse = null;
    }
  }]);
  return Detect;
}();

/***************
资源预加载
一共有5处位置需要验证是否预加载完毕
1 swpier 移动翻页反弹
2 Xut.View.LoadScenario 全局跳转
3 Xut.View.GotoPrevSlide
4 Xut.View.GotoNextSlide
5 Xut.View.GotoSlide
****************/
/**
 * 是否启动预加载
 * true 启动
 * false 关闭
 * 翻页的时候停止
 * 动画结束后开始
 * @type {Boolean}
 */
var enable = true;

/**
 * 预加载的资源列表
 */
var preloadData = null;

/**
 * 页面chpater Id 总数
 * @type {Number}
 */
var chapterIdCount = 0;

/**
 * 正在加载的id标记
 * @type {Number}
 */
var loadingId = 0;

/**
 * 预加载回调通知
 * @type {Array}
 */
var notification = null;

/**
 * 用于检测图片是否有缓存的情况
 * 检测chapter 1的数据情况
 * 只检测第一个成功的content图片的缓存状态
 * 如果本身图片获取失败，就递归图片检测
 * @return {Boolean} [description]
 */
function checkFigure(url, callback) {
  return imageParse(url, function (state, cache) {
    /*如果是有效图，只检测第一次加载的缓存img*/
    if (!checkFigure.url && state) {
      checkFigure.url = url;
    }
    callback();
  });
}

var PARSER = {
  // master 母版标记特殊处理，递归PARSE
  // video: videoParse
  content: checkFigure,
  widget: checkFigure,
  autoSprite: checkFigure,
  seniorSprite: checkFigure,
  audio: audioParse,
  svg: svgParse
};

/**
 * 完成后删除资源的列表
 * 2个好处
 * 1 优化内存空间
 * 2 跳页面检测，如果遇到不存在的资源就不处理了
 *   这代表，1.已经加载了
 *          2.资源或错
 * @return {[type]} [description]
 */
function deleteResource(chaperId) {
  preloadData[chaperId] = null;
}

/**
 * 获取初始化数
 * @return {[type]} [description]
 */
function getNumber() {
  return typeof config.launch.preload === 'number' ? config.launch.preload : 5;
}

/**
 * 母版类型处理
 * 需要重新递归解析,类型需要递归创建
 * @return {[type]} [description]
 */
function masterHandle(childData) {
  var masterId = childData;
  var masterData = preloadData[masterId];
  if (masterData) {
    return function (callback) {
      loadResource(masterData, function () {
        /*删除母版数据，多个Page会共享同一个母版加载*/
        deleteResource(masterId);
        callback();
      });
    };
  }
}

/**
 * 页面层的处理
 * content/widget/audio/video/autoSprite/seniorSprite/svg
 * @return {[type]} [description]
 */
function pageHandle(type, childData, parser) {
  childData = pathHooks[type](childData);
  var total = childData.length;
  return function (callback) {
    var section = getNumber();

    /**
     * 分段处理
     * section 是分段数量
     */
    function segmentHandle() {

      var detectObjs = {}; /*预加载对象列表*/
      var analyticData = void 0;
      var hasComplete = false;

      /*如果可以取整*/
      if (childData.fileNames.length > section) {
        analyticData = childData.fileNames.splice(0, section);
      } else {
        /*如果小于等于检测数*/
        analyticData = childData.fileNames;
        hasComplete = true;
      }

      /**
       * 分段检测的回到次数
       * @type {[type]}
       */
      var analyticCount = analyticData.length;

      /**
       * 检测完成度
       * @return {[type]} [description]
       */
      function complete() {
        if (analyticCount === 1) {
          if (hasComplete) {
            /*分段处理完毕就清理，用于判断跳出*/
            callback();
            return;
          } else {
            segmentHandle();
          }
        }
        --analyticCount;
      }

      function reduce(path) {
        detectObjs[path] = new Detect(parser, path);
        detectObjs[path].start(2000, function (state) {
          if (state) {
            /*如果请求成功了，就必须销毁*/
            detectObjs[path].destory();
          } else {
            /*失败加入到循环队列*/
            addLoop(path, detectObjs[path]);
          }
          detectObjs[path] = null;
          complete();
        });
      }

      /**
       * 分配任务
       * 1 分配到每个解析器去处理
       * 2 给一个定时器的范围
       * 主动检测2秒
       * 成功与失败都认为通过
       * 失败单独加到循环队列中去处理
       */
      for (var i = 0; i < analyticData.length; i++) {
        reduce(analyticData[i]);
      }
    }

    segmentHandle();
  };
}

/**
 * 创建对应的处理器
 */
function createHandle(type, childData, parser) {
  if (type === 'master') {
    return masterHandle(childData);
  } else {
    return pageHandle(type, childData, parser);
  }
}

/**
 * 开始加载资源
 */
function loadResource(data, callback) {
  var asy = new AsyAccess();
  for (var key in data) {
    var parser = PARSER[key];
    if (parser) {
      /*audio优先解析*/
      asy.create(createHandle(key, data[key], parser), key === 'audio' ? 'unshift' : 'push');
    }
  }
  /*执行后监听,监听完成*/
  asy.exec().$$watch('complete', callback);
}

/**
 * 检测下一个解析任务
 * 以及任务的完成度
 */
function repeatCheck(id, callback) {

  //判断是否所有页面加载完毕
  var completeLoad = function completeLoad() {
    /*如果加载数等于总计量数，这个证明加载完毕*/
    if (id === chapterIdCount) {
      $warn('全部预加载完成');
      $setStorage('preload', checkFigure.url);
      clearAudio();
      clearImage();
      return true;
    }
    return false;
  };

  /*第一次加载才有回调*/
  if (callback) {
    callback();
    if (completeLoad()) {
      return;
    }
    return;
  }

  /*执行预加载等待的回调通知对象*/
  if (notification) {
    var newChapterId = notification[0];
    if (id === newChapterId) {
      /*如果下一个解析正好是等待的页面*/
      notification[1]();
      notification = null;
    } else {
      /*跳转页面的情况， 如果不是按照顺序的预加载方式*/
      nextTask(newChapterId);
      return;
    }
  }

  /*如果加载数等于总计量数，这个证明加载完毕*/
  if (completeLoad()) {
    return;
  }

  /*启动了才继续可以预加载*/
  if (enable) {
    nextTask();
  }
}

/**
 * 检测下一个页面加载执行
 * @return {Function} [description]
 */
function nextTask(chapterId, callback) {
  if (!chapterId) {
    /*新加载的Id游标*/
    ++loadingId;
    chapterId = loadingId;
  }

  /*只有没有预加载的数据才能被找到*/
  var pageData = preloadData[chapterId];

  var complete = function complete(info) {
    // $warn(`${info}:${chapterId}`)
    deleteResource(chapterId);
    repeatCheck(loadingId, callback);
  };

  /*必须保证pageData不是一个空对象*/
  if (pageData && Object.keys(pageData).length) {
    // $warn('----预加资源开始chapterId: ' + chapterId)
    loadResource(pageData, function () {
      return complete('预加资源完成-chapterId');
    });
  } else {
    complete('预加载数据是空-chapterId');
  }
}

/**
 * 检测缓存是否存在
 * @return {[type]} [description]
 */
function checkCache(finish, next) {
  var cahceUrl = $getStorage('preload');
  if (cahceUrl) {
    loadFigure(cahceUrl, function (state, cache) {
      if (cache) {
        finish();
      } else {
        next();
      }
    });
  } else {
    next();
  }
}

/**
 * 资源加载接口
 * 必须先预加载第一页
 * @return {[type]} [description]
 */
function initPreload(total, callback) {

  var close = function close() {
    preloadData = null;
    config.launch.preload = false;
    callback();
  };

  var start = function start() {
    nextTask('', function () {
      $warn('预加载资源总数：' + total);
      /*监听预加载初四华*/
      watchPreloadInit();
      callback();
    });
  };

  loadFile(config.data.pathAddress + 'preload.js', function () {
    if (window.preloadData) {
      chapterIdCount = total;
      preloadData = window.preloadData;
      window.preloadData = null;
      checkCache(close, start);
    } else {
      close();
    }
  });
}

/**
 * 监听预加载初始化调用
 * 1 原则上是监听一次autoRunComplete事件
 * 2 可能autoRunComplete会丢失，所以需要定时器处理
 * @return {[type]} [description]
 */
function watchPreloadInit() {

  //如果预加载的只有1页数据 判断第一页加载完成后return
  if (!preloadData[chapterIdCount]) {
    return;
  }

  var timer = null;
  var count = 2;

  /*从第二次开始加载数据*/
  var start = function start(type) {
    if (count === 2) {
      clearTimeout(timer);
      timer = null;
      enable = true;
      nextTask();
    }
    --count;
  };

  /*监听初始化第一次完成*/
  Xut.Application.onceWatch('autoRunComplete', start);

  /*防止autoRunComplete事件丢失处理,或者autoRunComplete执行很长*/
  timer = setTimeout(start, 5000);
}

/**
 * 翻页停止预加载
 */


/**
 * 预加载请求中断处理
 * 监听线性翻页预加载加载
 * 类型，方向，处理器
 * context 处理器的上下文
 */
function requestInterrupt(_ref, context) {
  var type = _ref.type,
      chapterId = _ref.chapterId,
      direction = _ref.direction,
      processed = _ref.processed;


  /*如果是线性模式，左右翻页的情况处理*/
  if (type === 'linear') {
    var currentId = Xut.Presentation.GetPageId();
    chapterId = direction === 'next' ? currentId + 1 : currentId - 1;
  } else if (type === 'nolinear') {}
  /*非线性模式,跳转模式*/


  /*如果不存在预加载数据，就说明加载完毕，或者没有这个数据*/
  if (!preloadData[chapterId]) {
    return false;
  } else {
    /*正在预加载，等待记录回调*/
    if (!processed) {
      $warn('预加载必须传递处理器，有错误');
    }
    notification = [chapterId, function () {
      processed.call(context);
    }];
    return true;
  }
}

/**
 * 资源销毁接口
 * @return {[type]} [description]
 */
function clearPreload() {
  checkFigure.url = null;
  enable = true;
  chapterIdCount = 0;
  loadingId = 0;
  preloadData = null;
  notification = null;
  clearLoop();
}

/**
 * 新增模式,用于记录浏览器退出记录
 * 默认启动
 * 是否回到退出的页面
 * set表中写一个recordHistory
 * 是   1
 * 否   0
 */
var setHistory = function setHistory(data) {
  //Launch接口定义
  if (config.launch.historyMode !== undefined) {
    return;
  }

  //数据库定义 && == 1
  if (data.recordHistory !== undefined && Number(data.recordHistory)) {
    config.launch.historyMode = true;
    return;
  }
  //调试模式，默认启动缓存
  if (config.debug.devtools) {
    config.launch.historyMode = true;
  }
};

/*画轴模式*/
var setPaintingMode = function setPaintingMode(data) {
  if (!config.launch.visualMode && Number(data.scrollPaintingMode)) {
    config.launch.visualMode = 4;
  }
};

/*最大屏屏幕尺寸*/
var getMaxWidth = function getMaxWidth() {
  if (config.visualSize) {
    return config.visualSize.width;
  }
  return window.screen.width > document.documentElement.clientWidth ? window.screen.width : document.documentElement.clientWidth;
};

/**
 * 检车分辨率失败的情况
 * 强制用js转化
 * 750:  '', //0-1079
 * 1080: 'mi', //1080-1439
 * 1440: 'hi' //1440->
 */
var setDefaultSuffix = function setDefaultSuffix() {
  var doc = document.documentElement;
  //竖版的情况才调整
  if (doc.clientHeight > doc.clientWidth) {
    var ratio = window.devicePixelRatio || 1;
    var maxWidth = getMaxWidth() * ratio;
    if (maxWidth >= 1080 && maxWidth < 1439) {
      config.launch.baseImageSuffix = config.launch.imageSuffix['1080'];
    }
    if (maxWidth >= 1440) {
      config.launch.baseImageSuffix = config.launch.imageSuffix['1440'];
    }

    if (config.debug.devtools && config.launch.baseImageSuffix) {
      $warn('css media匹配suffix失败，采用js采用计算. config.launch.baseImageSuffix = ' + config.launch.baseImageSuffix);
    }
  }
};

/*自适应图片*/
var adaptiveImage = function adaptiveImage() {
  var $adaptiveImageNode = $('.xut-adaptive-image');
  if ($adaptiveImageNode.length) {
    var baseImageType = $adaptiveImageNode.width();
    var type = config.launch.imageSuffix[baseImageType];
    if (type) {
      config.launch.baseImageSuffix = type;
      return;
    }
  }
  setDefaultSuffix();
};

/*
  配置初始化
 */
var configInit = function configInit(novelData, tempSettingData) {

  /*启动代码用户操作跟踪:启动*/
  config.sendTrackCode('launch');

  //创建过滤器
  Xut.CreateFilter = contentFilter('createFilter');
  Xut.TransformFilter = contentFilter('transformFilter');

  //初始化配置一些信息
  initConfig(novelData.pptWidth, novelData.pptHeight);

  //新增模式,用于记录浏览器退出记录
  //如果强制配置文件recordHistory = false则跳过数据库的给值
  setHistory(tempSettingData);

  //2015.2.26
  //启动画轴模式
  setPaintingMode(tempSettingData);

  //创建忙碌光标
  if (!Xut.IBooks.Enabled) {
    createCursor();
  }

  //初始资源地址
  initPathAddress();
};

/**
 * 初始分栏排版
 * 嵌入index分栏
 * 默认有并且没有强制设置关闭的情况，打开缩放
 */
var configColumn = function configColumn(callback) {
  initColumn(function (haColumnCounts) {
    if (haColumnCounts) {
      //动画事件委托
      if (config.launch.swipeDelegate !== false) {
        config.launch.swipeDelegate = true;
      }
    }
    callback();
  });
};

function baseConfig(callback) {

  //mini杂志设置
  //如果是pad的情况下设置font为125%
  if (config.launch.platform === 'mini' && Xut.plat.isTablet) {
    $('body').css('font-size', '125%');
  }

  /*图片分辨了自适应*/
  config.launch.imageSuffix && adaptiveImage();

  /*建议快速正则，提高计算*/
  setFastAnalysisRE();

  importJsonDatabase(function (hasResults) {
    initDB(hasResults, function (dataRet) {
      var novelData = dataRet.Novel.item(0);
      var tempSettingData = initDefaults(dataRet.Setting);

      /**
       * 重设全局的页面模式
       * 默认页面模式选择
       * 1 全局用户接口
       * 2 PPT的数据接口
       * 3 默认1
       * @type {[type]}
       */
      if (config.launch.visualMode === undefined) {
        config.launch.visualMode = config.data.visualMode || 1;
      }

      /**
       * 模式5 只在竖版下使用
       */
      if (config.launch.visualMode === 5) {
        var screen = getSize();
        if (screen.height < screen.width) {
          config.launch.visualMode = 1;
        }
      }

      /*配置config*/
      configInit(novelData, tempSettingData);

      /*加载svg的样式*/
      loadGolbalStyle('svgsheet', function () {
        /*分栏*/
        configColumn(function () {
          if (config.launch.preload) {
            /*预加载*/
            initPreload(dataRet.Chapter.length, function () {
              return callback(novelData);
            });
          } else {
            callback(novelData);
          }
        });
      });
    });
  });
}

/*设置缓存，必须要可设置*/
var saveData = function saveData() {
  if (config.launch.historyMode) {
    var data = config.data;
    $setStorage({ "pageIndex": data.pageIndex, "novelId": data.novelId });
  } else {
    //清理
    if ($getStorage('novelId')) {
      $removeStorage('pageIndex');
      $removeStorage('novelId');
    }
  }
};

/**
 * 初始化值
 * @param {[type]} options [description]
 */
var initDefaultValues = function initDefaultValues(options) {
  return {
    'novelId': Number(options.novelId),
    'pageIndex': Number(options.pageIndex),
    'history': options.history
  };
};

/**
 * 检测脚本注入
 * @return {[type]} [description]
 */
var runScript = function runScript() {
  var preCode = void 0,
      novels = Xut.data.query('Novel');
  if (preCode = novels.preCode) {
    execScript(preCode, 'novelpre脚本');
  }
};

var loadScene = function (options) {

  options = initDefaultValues(options || {});

  config.data.novelId = options.novelId;
  config.data.pageIndex = options.pageIndex;

  //设置缓存
  saveData();

  //应用脚本注入
  runScript();

  //检测下seasonId的正确性
  //seasonId = 1 找不到chapter数据
  //通过sectionRelated递归检测下一条数据
  var seasonId = void 0,
      seasondata = void 0,
      i = void 0;
  for (i = 0; i < Xut.data.Season.length; i++) {
    seasondata = Xut.data.Season.item(i);
    if (Xut.data.query('sectionRelated', seasondata._id)) {
      seasonId = seasondata._id;
      break;
    }
  }

  //加载新的场景
  Xut.View.LoadScenario({
    'main': true, //主场景入口
    'seasonId': seasonId,
    'pageIndex': options.pageIndex,
    'history': options.history
  }, function () {

    /*应用初始化加载完毕*/
    Xut.Application.Notify('initComplete');

    /*发送初始化完毕代码跟踪*/
    config.sendTrackCode('init');
  });
};

/**
 * 这里有四种播放器:
 *    1：基于html5原生实现的video标签 for ios
 *    2：基于phoneGap插件实现的media  for android
 *    3: 基于videoJS用flash实现的播放 for pc
 *    4: 用于插入一个网页的webview
 */
/**
 * 创建视频容器
 */
function createVideoWrap(type, options) {
  var width = options.width,
      height = options.height,
      zIndex = options.zIndex,
      top = options.top,
      left = options.left;

  /*数据可能为100%，或者纯数字*/

  var setWidth = 'width:' + width + 'px';
  var setHeight = 'height:' + height + 'px';

  if (typeof width === 'string') {
    if (~width.indexOf('%')) {
      setWidth = 'width:' + width;
    }
  }

  if (typeof height === 'string') {
    if (~height.indexOf('%')) {
      setHeight = 'height:' + height;
    }
  }

  return $(String.styleFormat('<div data-type="' + type + '"\n          style="' + setWidth + ';\n                 ' + setHeight + ';\n                 position:absolute;\n                 visibility:hidden;\n                 z-index:' + zIndex + ';\n                 top:' + top + 'px;\n                 left:' + left + 'px;">\n     </div>'));
}

/*获取视频文件路径*/
function getFilePath(url) {
  return config.getVideoPath() + url;
}

/**
 * 获取容器
 * 1 浮动视频单独处理
 * 2 没有浮动视频
 * @return {[type]} [description]
 */
function getContainer(options) {

  /*视频已经浮动,找到浮动容器的根节点floatGroup*/
  if (options.isfloat) {
    return Xut.Presentation.GetFloatContainer(options.pageType);
  }

  var container = options.container;

  /*如果是isColumn的使用，直接用触发节点*/
  if (options.isColumn) {
    return $(container);
  }

  //jquery对象
  if (container.length) {
    return container.children();
  }

  //dom
  return container.children ? $(container.children) : $('body');
}

/*
 增强判断
 ios上支持行内播放，不能用默认的H5控制条，拖动失效，必须要加进度条
 ios低于10的情况下，用原生播放,而且不能是平板，只能是手机，touch

201.7.6.30
 *微信版本的安卓上面，需要增加这２个属性，要不会弹出广告
**/
/**
 * html5 and flash player
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */

var flarePlayer = function () {
  function flarePlayer(options, removeVideo) {
    classCallCheck(this, flarePlayer);


    var url = getFilePath(options.url);
    var width = options.width,
        height = options.height,
        top = options.top,
        left = options.left,
        zIndex = options.zIndex;


    this.container = getContainer(options);

    var $videoWrap = createVideoWrap('video-flare', {
      width: width,
      height: height,
      top: top,
      left: left,
      zIndex: zIndex
    });

    var fv = this.fv = $videoWrap.flareVideo({
      width: width,
      height: height,
      autoplay: true,
      srcs: url
    });

    /*窗口化*/
    fv.video.setAttribute('playsinline', 'playsinline');

    /**
     * 微信版本的安卓上面，需要增加这２个属性，要不会弹出广告
     * 如果是column页面触发的广告
     * 需要排除，会出现视频错乱的问题
     */
    if (Xut.plat.isAndroid && Xut.plat.isWeiXin && !options.isColumn) {
      fv.video.setAttribute("x5-video-player-type", "h5");
      fv.video.setAttribute("x5-video-player-fullscreen", true);
    }

    /*播放完毕，关闭视频窗口*/
    fv.bind('ended', function () {
      if (options.startBoot) {
        options.startBoot();
      }
      /*非迷你平台关闭视频*/
      if (config.launch.platform !== 'mini') {
        removeVideo(options.chapterId);
      }
    });

    /*播放出错*/
    fv.bind('error', function () {
      if (options.startBoot) {
        options.startBoot();
      }
      removeVideo(options.chapterId);
    });

    this.container.append($videoWrap);

    /*触发了关闭按钮*/
    fv.bind('close', function () {
      removeVideo(options.chapterId);
    });
  }

  createClass(flarePlayer, [{
    key: 'play',
    value: function play() {
      this.fv.play();
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.fv.pause();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.fv.remove();
      this.fv = null;
      this.container = null;
    }
  }]);
  return flarePlayer;
}();

var preloadVideo = {

  //播放状态
  state: false,

  //地址
  path: window.DUKUCONFIG ? window.DUKUCONFIG.path + "duku.mp4" : 'android.resource://#packagename#/raw/duku',

  //加载视频
  load: function load() {
    // if (window.localStorage.getItem("videoPlayer") == 'error') {
    //       alert("error")
    //     return preloadVideo.launchApp();
    // }
    this.play();
    this.state = true;
  },


  //播放视频
  play: function play() {
    //延时应用加载
    Xut.Application.delayAppRun();
    Xut.Plugin.VideoPlayer.play(function () {
      preloadVideo.launchApp();
    }, function () {
      //捕获出错,下次不进入了,,暂无ID号
      // window.localStorage.setItem("videoPlayer", "error")
      preloadVideo.launchApp();
    }, preloadVideo.path, 1, 0, 0, window.innerHeight, window.innerWidth);
  },


  //清理视频
  closeVideo: function closeVideo() {
    Xut.Plugin.VideoPlayer.close(function () {
      preloadVideo.launchApp();
    });
  },


  //加载应用
  launchApp: function launchApp() {
    this.state = false;
    Xut.Application.LaunchApp();
  }
};

/**
 * 获取插件视频状态
 */
function getPlugVideoState() {
  return preloadVideo.state;
}

/**
 * 关闭插件视频
 */
function closePlugVideo() {
  preloadVideo.closeVideo();
}

/**
 * 播放视频插件
 */
function plugVideo() {
  preloadVideo.load();
}

/**
 *  创建播放器
 *  IOS，PC端执行
 */

/**
 * 回退按钮状态控制器
 * @param  {[type]} state [description]
 * @return {[type]}       [description]
 */
var controller = function controller(state) {
  //如果是子文档处理
  if (Xut.isRunSubDoc) {
    //通过Action动作激活的,需要到Action类中处理
    Xut.publish('subdoc:dropApp');
    return;
  }

  //home
  if (state === 'pause') {
    Xut.Application.Original();
  }

  //恢复
  if (state === 'resume') {
    Xut.Application.Activate();
  }

  //退出
  if (state === 'back') {
    window.GLOBALCONTEXT.navigator.notification.confirm('您确认要退出吗？', function (button) {
      if (1 == button) {
        Xut.Application.Suspend({
          processed: function processed() {
            window.GLOBALCONTEXT.navigator.app.exitApp();
          }
        });
      }
    }, '退出', '确定,取消');
  }
};

/**
 * 绑定安卓按钮
 * 回退键
 * @return {[type]} [description]
 */
function bindAndroidBack() {
  //如果是预加载视频
  if (getPlugVideoState()) {
    closePlugVideo();
  } else {
    controller('back');
  }
}

/**
 * 绑定安卓按钮
 * 暂停键
 * @return {[type]} [description]
 */
function bindAndroidPause() {
  controller('pause');
}

/**
 * 前台恢复
 * @return {[type]} [description]
 */
function bindAndroidResume() {
  controller('resume');
}

/**
 * 绑定安卓按钮
 * @return {[type]} [description]
 */
function bindAndroid() {
  if (Xut.plat.hasPlugin) {
    document.addEventListener("backbutton", bindAndroidBack, false);
    document.addEventListener("pause", bindAndroidPause, false);
    document.addEventListener("resume", bindAndroidResume, false);
  }
}

/**
 * 销毁安卓按钮
 * @return {[type]} [description]
 */
function clearAndroid() {
  if (Xut.plat.hasPlugin) {
    document.removeEventListener("backbutton", bindAndroidBack, false);
    document.removeEventListener("pause", bindAndroidPause, false);
    document.removeEventListener("resume", bindAndroidResume, false);
  }
}

var getCache = function getCache(name) {
  return $getStorage(name);
};

var initMain = function initMain(novelData) {

  /**
   * IBOOS模式
   */
  if (Xut.IBooks.Enabled) {
    //删除背景图
    $(".xut-cover").remove();
    loadScene({
      "pageIndex": Xut.IBooks.CONFIG.pageIndex
    });
    return;
  }

  /**
   * 多模式判断
   * 如果
   *   缓存存在
   *   否则数据库解析
         全局翻页模式
         0 滑动翻页 =》allow
         1 直接换  =》ban
   * 所以pageFlip只有在左面的情况下
   */

  if (novelData.parameter) {
    var parameter = parseJSON(novelData.parameter);
    /*全局优先设置覆盖*/
    if (config.launch.banMove === undefined && parameter.pageflip !== undefined) {
      switch (Number(parameter.pageflip)) {
        case 0:
          //允许翻页
          config.launch.banMove = false;
          break;
        case 1:
          //禁止翻页
          config.launch.banMove = true;
          break;
      }
    }
  }

  /*默认不锁定页面*/
  if (config.launch.banMove === undefined) {
    config.launch.banMove = false;
  }

  /**
   * 缓存加载
   * 如果启动recordHistory记录
   */
  var pageIndex = Number(getCache('pageIndex'));
  if (config.launch.historyMode && pageIndex !== undefined) {
    var novelId = parseInt(getCache("novelId"));
    if (novelId) {
      return loadScene({
        "novelId": novelId,
        "pageIndex": pageIndex,
        'history': $getStorage('history')
      });
    }
  }

  //第一次加载
  //没有缓存
  loadScene({ "novelId": novelData._id, "pageIndex": 0 });
};

/**
 * 加载app应用
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
var initApp$1 = function initApp() {
  return baseConfig(initMain);
};

/**
 * 如果是安卓桌面端
 * 绑定事件
 * @return {[type]} [description]
 */
var bindPlatEvent = function bindPlatEvent() {
  //安卓上并且不是浏览器打开的情况
  if (Xut.plat.isAndroid && !Xut.plat.isBrowser) {
    //预加载处理视频
    //妙妙学不加载视频
    //读库不加载视频
    if (window.MMXCONFIG && !window.DUKUCONFIG) {
      plugVideo();
    }
    //不是子文档指定绑定按键
    if (!window.SUbCONFIGT) {
      /*app初始化完毕*/
      Xut.Application.Watch('initComplete', function () {
        bindAndroid();
      });
    }
  }
  if (window.DUKUCONFIG) {
    PMS.bind("MagazineExit", function () {
      PMS.unbind();
      Xut.Application.DropApp();
    }, "*");
  }
  initApp$1();
};

/*
  如果不是读库模式
  播放HTML5视频
  在IOS
  if (!window.DUKUCONFIG && !window.GLOBALIFRAME && Xut.plat.isIOS) {
      html5Video()
  }
  Ifarme嵌套处理
  1 新阅读
  2 子文档
  3 pc
  4 ios/android
 */
function main() {
  if (window.GLOBALIFRAME) {
    bindPlatEvent();
  } else {
    //brower
    if (Xut.plat.isBrowser) {
      initApp$1();
    } else {
      //mobile(apk or ipa)
      window.openDatabase(config.data.dbName, "1.0", "Xxtebook Database", config.data.dbSize);
      document.addEventListener("deviceready", function () {
        Xut.plat.hasPlugin = true; //支持插件
        Xut.Plugin.XXTEbookInit.startup(config.data.dbName, bindPlatEvent, function () {});
      }, false);
    }
  }
}

//动作标示
var HOT = 'hot'; //热点音频
var CONTENT = 'content'; //动画音频
var SEASON = 'season'; //节音频
var COLUMN = 'column'; //column流式布局

/**
 * 音频动作
 * @param  {[type]} global [description]
 * @return {[type]}        [description]
 */

//音频动作
//替换背景图
//指定动画
function Action(options) {

  var element = void 0,
      pageType = void 0;

  /*这里需要注意，浮动音频的情况，翻页DOM被重新创建，所以这里要每次要重新获取最新的*/
  var getAudioNode = function getAudioNode() {
    element = document.querySelector('#Audio_' + options.audioId);
  };

  var startImage = options.startImage && getFileFullPath(options.startImage, 'audio-action');
  var stopImage = options.stopImage && getFileFullPath(options.stopImage, 'audio-action');

  //切换背景
  var toggleImage = function toggleImage(fileName) {
    getAudioNode(); //每次都重新获取新的节点
    if (element) {
      element.style.backgroundImage = 'url(' + fileName + ')';
    }
  };

  getAudioNode();
  pageType = element.getAttribute('data-belong');

  stopImage && loadFigure(stopImage);

  return {
    play: function play() {
      stopImage && toggleImage(stopImage);
      if (options.startScript) {
        Xut.Assist.Run(pageType, options.startScript.split(','));
      }
    },
    pause: function pause() {
      startImage && toggleImage(startImage);
      if (options.stopScript) {
        Xut.Assist.Stop(pageType, options.stopScript.split(','));
      }
    },
    destroy: function destroy() {
      this.pause();
      element = null;
    }
  };
}

/**
 * 音频字幕
 * @param  {[type]} global [description]
 * @return {[type]}        [description]
 */

//字幕检测时间
var Interval = 50;

var getStyles = function getStyles(elem, name) {
  var styles = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
  return styles.getPropertyValue(name);
};

/**
 * 字幕类
 *   音频实例
 * options 参数
 */
var Subtitle = function () {
  function Subtitle(options, controlDoms, getAudioTime) {
    classCallCheck(this, Subtitle);


    var visibility = void 0;
    var orgAncestorVisibility = void 0;

    //快速处理匹配数据
    var checkData = {};

    this.getAudioTime = getAudioTime;
    this.options = options;
    this.parents = controlDoms.parents;
    this.ancestors = controlDoms.ancestors;

    this.timer = 0;

    //缓存创建的div节点
    this.cacheCreateDivs = {};

    //保存原始的属性
    orgAncestorVisibility = this.orgAncestorVisibility = {};
    _.each(this.ancestors, function (node, contentId) {
      visibility = getStyles(node, 'visibility');
      if (visibility) {
        orgAncestorVisibility[contentId] = visibility;
      }
    });

    //去重记录
    this.recordRepart = {};

    //phonegap getCurrentPosition得到的音频播放位置不从0开始 记录起始位置
    this.changeValue = 0;
    _.each(options.subtitles, function (data) {
      checkData[data.start + '-start'] = data;
      checkData[data.end + '-end'] = data;
    });

    this._createSubtitle(checkData);
  }

  /**
   * 运行字幕
   * @return {[type]}
   */


  createClass(Subtitle, [{
    key: '_createSubtitle',
    value: function _createSubtitle(checkData) {
      var _this = this;

      this.timer = setTimeout(function () {
        _this.getAudioTime(function (audioTime) {
          var match = void 0;
          _.each(checkData, function (data, key) {
            match = key.split('-');
            _this._action(match[0], audioTime, match[1], data);
          });
          _this._createSubtitle(checkData);
        });
      }, Interval);
    }

    /**
     * 执行动作
     * 创建文本框
     * 显示/隐藏文本框
     */

  }, {
    key: '_action',
    value: function _action(currentTime, audioTime, action, data) {
      if (audioTime > currentTime - Interval && audioTime < currentTime + Interval) {
        //创建
        if (!this.recordRepart[data.start] && action === 'start') {
          this.recordRepart[data.start] = true;
          this._createDom(data);
        }
        //如果是一段字幕结束处理
        else if (!this.recordRepart[data.end] && action === 'end') {
            this.recordRepart[data.end] = true;
            var ancestorNode = this.ancestors[data.id];
            if (ancestorNode) {
              ancestorNode.style.visibility = "hidden";
            }
          }
      }
    }
  }, {
    key: '_createDom',
    value: function _createDom(data) {

      //屏幕分辨率
      var proportion = config.proportion;
      var proportionWidth = proportion.width;
      var proportionHeight = proportion.height;

      var contentId = data.id;
      var parentNode = this.parents[contentId];
      var ancestorNode = this.ancestors[contentId];
      var preDiv = this.cacheCreateDivs[contentId];
      var preP = preDiv && preDiv.children[0];

      //转换行高
      var sLineHeight = data.lineHeight ? data.lineHeight : '100%';

      /**
       * 设置父容器div 字体颜色，大小，类型，位置，文本水平、垂直居中
       */
      function createDivStyle(parent, data) {
        var value = setProportion({
          width: data.width,
          height: data.height,
          left: data.left,
          top: data.top
        });

        var cssText = 'position:absolute;\n                 display:table;\n                 vertical-align:center;\n                 width:' + value.width + 'px;\n                 height:' + value.height + 'px;\n                 top:' + value.top + 'px;\n                 left:' + value.left + 'px;';

        parent.style.cssText = String.styleFormat(cssText);
      }

      /**
       * 内容元素的样式
       */
      function createPStyle(p, data) {
        var cssText = 'text-align:center;\n                 display:table-cell;\n                 vertical-align :middle;\n                 color:' + data.fontColor + ';\n                 font-family:' + data.fontName + ';\n                 font-bold:' + data.fontBold + ';\n                 font-size:' + data.fontSize * proportionWidth + 'px;\n                 line-height:' + sLineHeight + '%';

        //设置字体间距
        p.style.cssText = String.styleFormat(cssText);

        //设置文字内容
        p.innerHTML = data.title;
      }

      /**
       * 创建内容
       */
      function createContent(parent, p, data) {
        createDivStyle(parent, data); //设置div
        createPStyle(p, data);
      }

      //公用同一个contengid,已经存在
      if (preDiv) {
        createContent(preDiv, preP, data);
      } else {
        //创建父元素与子元素
        var createDiv = document.createElement('div');
        var createP = document.createElement('p');
        //设置样式
        createContent(createDiv, createP, data);
        createDiv.appendChild(createP); //添加到指定的父元素
        parentNode.appendChild(createDiv);
        this.cacheCreateDivs[contentId] = createDiv; //保存引用
      }

      //操作最外层的content节点
      if (ancestorNode) {
        var ancestorNodeValue = getStyles(ancestorNode, 'visibility');
        if (ancestorNodeValue != 'visible') {
          ancestorNode.style.visibility = 'visible';
        }
      }
    }

    /**
     * 清理音频
     * @return {[type]}
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      var self = this;
      _.each(this.cacheCreateDivs, function (node) {
        node.parentNode.removeChild(node);
      });

      //恢复初始状态
      _.each(this.ancestors, function (node, id) {
        var orgValue = self.orgAncestorVisibility[id];
        var currValue = getStyles(node, 'visibility');
        if (currValue != orgValue) {
          node.style.visibility = orgValue;
        }
      });

      this.ancestors = null;
      this.cacheCreateDivs = null;
      this.changeValue = 0;
      this.parents = null;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = 0;
      }
    }
  }]);
  return Subtitle;
}();

/**
 * 音频工厂类
 * @param {[type]} options [description]
 */

var AudioSuper = function () {
  function AudioSuper(options, controlDoms) {
    classCallCheck(this, AudioSuper);

    this.options = options;

    this.trackId = options.trackId;
    this.controlDoms = controlDoms;

    /*构建之前处理*/
    this._$$preRelated(options);
    /*初始化数据*/
    this._init();
    //相关数据
    this._$$afterRelated(options);
  }

  //=============================
  //    私有方法
  //=============================

  /**
   * 构建之前关数据
   * 2个回调处理
   *  1 内部manage
   *  2 外部content的行为音频
   *  二者只会同时存在一个
   */


  createClass(AudioSuper, [{
    key: '_$$preRelated',
    value: function _$$preRelated(options) {

      /*匹配URL地址*/
      this.$$url = config.getAudioPath() + options.url;

      //在manager中附加，播放一次后删除这个对象
      this.innerCallback = options.innerCallback;

      /*按钮的反弹点击触发，设置按钮的行为*/
      if (this.trackId == 9999 && options.complete) {
        this.outerCallback = options.complete;
      }
    }

    /**
     * 构建之后关数据
     */

  }, {
    key: '_$$afterRelated',
    value: function _$$afterRelated(options) {
      var _this = this;

      //音频重复播放次数
      if (options.data && options.data.repeat) {
        this.repeatNumber = Number(options.data.repeat);
      }
      //音频动作
      if (options.action) {
        this.acitonObj = Action(options);
      }
      //字幕对象
      if (options.subtitles && options.subtitles.length > 0) {
        this.subtitleObject = new Subtitle(options, this.controlDoms, function (cb) {
          return _this._getAudioTime(cb);
        });
      }
      //如果有外部回调处理
      if (this.outerCallback) {
        this.outerCallback.call(this);
      }
    }

    //=============================
    //    提供给子类方法
    //=============================


    /**
     * 运行成功失败后处理方法
     * phoengap会调用callbackProcess
     * state
     *   true 成功回调
     *   false 失败回调
     */

  }, {
    key: '_$$callbackProcess',
    value: function _$$callbackProcess(state) {

      /**************************
          处理content的反馈回调
      ***************************/
      if (this.outerCallback) {
        this.destroy();
      } else {

        /**************************
         内部播放的回调，manage的处理
        ***************************/
        /*播放失败*/
        if (!state) {
          this.innerCallback && this.innerCallback(this);
          return;
        }

        /*如果有需要重复的音频*/
        if (this.repeatNumber) {
          --this.repeatNumber;
          this.play();
        } else {
          /*如果不存在重复，那么播放完毕后，直接清理这个对象*/
          this.innerCallback && this.innerCallback(this);
        }
      }
    }

    //=============================
    //    提供外部接口，向上转型
    //=============================

  }, {
    key: 'getTrackId',
    value: function getTrackId() {
      return this.trackId;
    }

    /**
     * 播放
     * @return {[type]} [description]
     */

  }, {
    key: 'play',
    value: function play() {
      var _this2 = this;

      /*子类提供了播放*/
      if (this._play) {
        this._play();
      }

      this.status = 'playing';

      //flash模式不执行
      if (this.audio) {
        //支持自动播放,微信上单独处理
        if (window.WeixinJSBridge) {
          window.WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
            _this2.audio && _this2.audio.play();
          });
        } else {
          this.audio.play();
        }
      }
      this.acitonObj && this.acitonObj.play();
    }

    /**
     * 停止
     * @return {[type]} [description]
     */

  }, {
    key: 'pause',
    value: function pause() {

      /*子类提供了暂停*/
      if (this._pause) {
        this._pause();
      }

      this.status = 'paused';
      this.audio && this.audio.pause && this.audio.pause();
      this.acitonObj && this.acitonObj.pause();
    }

    /**
     * 复位接口
     * @return {[type]} [description]
     */

  }, {
    key: 'reset',
    value: function reset() {
      /*子类提供了复位*/
      if (this._reset) {
        this._reset();
      }
      this.status = 'reseted';
    }

    /**
     * 销毁
     */

  }, {
    key: 'destroy',
    value: function destroy() {

      /*子类提供了销毁*/
      if (this._destroy) {
        this._destroy();
      }

      this.status = 'ended';

      //销毁字幕
      if (this.subtitleObject) {
        this.subtitleObject.destroy();
        this.subtitleObject = null;
      }

      //动作
      if (this.acitonObj) {
        this.acitonObj.destroy();
        this.acitonObj = null;
      }
    }
  }]);
  return AudioSuper;
}();

/**
 * 使用PhoneGap的Media播放
 */
var PhoneGapMedia = function (_AudioSuper) {
  inherits(PhoneGapMedia, _AudioSuper);

  function PhoneGapMedia(options, controlDoms) {
    classCallCheck(this, PhoneGapMedia);
    return possibleConstructorReturn(this, (PhoneGapMedia.__proto__ || Object.getPrototypeOf(PhoneGapMedia)).call(this, options, controlDoms));
  }

  createClass(PhoneGapMedia, [{
    key: "_init",
    value: function _init() {
      var self = this;

      //音频成功与失败调用
      var audio = new window.GLOBALCONTEXT.Media(self.$$url, function () {
        self._$$callbackProcess(true);
      }, function () {
        self._$$callbackProcess(false);
      });

      //autoplay
      this.audio = audio;
      this.play();
    }

    /**
     * 复位接口
     */

  }, {
    key: "_reset",
    value: function _reset() {
      this.audio.pause();
      this.audio.seekTo(0);
    }

    /**
     * Compatible with asynchronous
     * for subitile use
     * get audio
     * @return {[type]} [description]
     */

  }, {
    key: "_getAudioTime",
    value: function _getAudioTime(callback) {
      var _this2 = this;

      this.audio.getCurrentPosition(function (position) {
        var audioTime = void 0;
        position = position * 1000;
        if (!_this2.changeValue) {
          _this2.changeValue = position;
        }
        position -= _this2.changeValue;
        if (position > -1) {
          audioTime = Math.round(position);
        }
        callback(audioTime);
      }, function (e) {
        console.log("error:" + e);
        //出错继续检测
        callback();
      });
    }

    /**
     * 销毁
     */

  }, {
    key: "_destroy",
    value: function _destroy() {
      if (this.audio) {
        this.audio.release();
        this.audio = null;
      }
    }
  }]);
  return PhoneGapMedia;
}(AudioSuper);

var createPart = function createPart(length) {
  var uuidpart = "";
  var uuidchar = void 0;
  for (var i = 0; i < length; i++) {
    uuidchar = parseInt(Math.random() * 256, 10).toString(16);
    if (uuidchar.length == 1) {
      uuidchar = "0" + uuidchar;
    }
    uuidpart += uuidchar;
  }
  return uuidpart;
};

var createUUID = function createUUID() {
  return [4, 2, 2, 2, 6].map(createPart).join('-');
};

/**
 * 使用PhoneGap的 js直接调用 cordova Media播放
 */
var CordovaMedia = function (_AudioSuper) {
  inherits(CordovaMedia, _AudioSuper);

  function CordovaMedia(options, controlDoms) {
    classCallCheck(this, CordovaMedia);
    return possibleConstructorReturn(this, (CordovaMedia.__proto__ || Object.getPrototypeOf(CordovaMedia)).call(this, options, controlDoms));
  }

  createClass(CordovaMedia, [{
    key: "_init",
    value: function _init() {
      var self = this;
      this.id = createUUID();
      var audio = {
        startPlayingAudio: function startPlayingAudio() {
          window.audioHandler.startPlayingAudio(self.id, self.$$url);
        },
        pausePlayingAudio: function pausePlayingAudio() {
          window.audioHandler.pausePlayingAudio(self.id);
        },
        release: function release() {
          window.audioHandler.release(self.id);
        },
        /**
         * 扩充，获取位置
         * @return {[type]} [description]
         */
        expansionCurrentPosition: function expansionCurrentPosition() {
          return window.getCurrentPosition(self.id);
        }
      };

      //autoplay
      this.audio = audio;
      this.play();
    }

    /**
     * Compatible with asynchronous
     * for subitile use
     * get audio
     * @return {[type]} [description]
     */

  }, {
    key: "_getAudioTime",
    value: function _getAudioTime(callback) {
      callback(Math.round(this.audio.expansionCurrentPosition() * 1000));
    }

    //播放

  }, {
    key: "_play",
    value: function _play() {
      if (this.audio) {
        this.audio.startPlayingAudio();
      }
    }

    //停止

  }, {
    key: "_pause",
    value: function _pause() {
      this.audio && this.audio.pausePlayingAudio();
    }

    //结束

  }, {
    key: "_destroy",
    value: function _destroy() {
      if (this.audio) {
        this.audio.release();
        this.audio = null;
      }
    }
  }]);
  return CordovaMedia;
}(AudioSuper);

/**
 * audio对象下标
 * @type {Number}
 */
var index = 0;
var loop = 10;
var audioes = [];

///////////////////////////////////////////////////////////////////
/// 2017.6.28
/// 安卓5以后 chrome浏览器单独的问题处理 需要绑定touchend事件
/// 如果用click那么需要处理swiper的hook 这里需要跳过preventDefault
///////////////////////////////////////////////////////////////////


/**
 * 修复audio
 * @param  {[type]} obj    [description]
 * @param  {[type]} key    [description]
 * @param  {[type]} access [description]
 * @return {[type]}        [description]
 */
function fixAudio(obj, key, access) {
  $on(document, {
    end: function end() {
      var audio = void 0,
          i = void 0;
      for (i = 0; i < loop; i++) {
        audio = new Audio();
        audio.play(); /*必须调用，自动播放的时候没有声音*/
        audioes.push(audio);
      }
      /*修复音频上下文对象*/
      resetAudioContext();
      $off(document);
    }
  });
}

/**
 * 销毁创建的video对象
 * @return {[type]} [description]
 */
function clearFixAudio() {
  for (var i = 0; i < audioes.length; i++) {
    audioes[i].destroy && audioes[i].destroy();
    audioes[i] = null;
  }
  audioes = null;
}

/**
 * 是否存在修复的音频对象
 * @return {Boolean} [description]
 */
function hasAudioes() {
  return audioes.length;
}

/**
 * 获取音频对象
 * @return {[type]} [description]
 */
function getAudio$1() {
  var audio = audioes[index++];
  if (!audio) {
    index = 0;
    return getAudio$1();
  }
  return audio;
}

/**
 * 使用html5的audio播放
 *
 * 1.移动端自动播放，需要调用2次play，但是通过getAudio的方法获取的上下文，每个context被自动play一次
 * 2.如果需要修复自动播放的情况下
 *   A. 音频的执行比hasAudioes的处理快，那么需要resetContext正在播放的音频上下文
 *   B. 如果hasAudioes有了后，在执行音频，正常播放
 * 3.不需要修复自动播放的情况，只有正常的1次play了
 */
var NativeAudio = function (_AudioSuper) {
  inherits(NativeAudio, _AudioSuper);

  function NativeAudio(options, controlDoms) {
    classCallCheck(this, NativeAudio);
    return possibleConstructorReturn(this, (NativeAudio.__proto__ || Object.getPrototypeOf(NativeAudio)).call(this, options, controlDoms));
  }

  /**
   * 创建音频上下文对象
   */


  createClass(NativeAudio, [{
    key: '_createContext',
    value: function _createContext(state) {
      var _this2 = this;

      this.audio = getAudio$1();
      /*IOS上手动点击播放的修复
      1 必须调用，点击播放的时候没有声音
      2 必须手动播放，自动播放跳过，否则有杂音*/
      if (Xut.plat.isIOS && this.options.isTrigger) {
        this.audio.play();
      }
      /**由于修复的问题，先调用了play，改src, 会提示中断报错，所以这延时修改src*/
      setTimeout(function () {
        if (_this2.audio) {
          _this2.audio.src = _this2.$$url;
          _this2._initPlay(state != undefined ? state : true);
        }
      }, 150);
    }

    /**
     * 初始化
     * @return {[type]} [description]
     */

  }, {
    key: '_init',
    value: function _init() {
      var self = this;
      var trackId = this.trackId;
      var hasAudio = hasAudioes();

      if (hasAudio) {
        this._createContext();
      } else {
        this.audio = new Audio(this.$$url);
        //如果是在微信中
        if (window.WeixinJSBridge) {
          //通过微信自己的事件处理，支持自动播放了
          this._startPlay();
        } else {
          this._needFix = true;
          this._initPlay(true);
        }
      }
    }

    /**
     * 清理定时器
     * @return {[type]} [description]
     */

  }, {
    key: '_clearTimer',
    value: function _clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    }

    /**
     * 监听音频播放
     * toPlay
     *   如果为true就是时间完毕后，允许播放
     *   否则就是在resetContext调用处理，音频已经跳过了playing，可能关闭或者停止了
     */

  }, {
    key: '_initPlay',
    value: function _initPlay(toPlay) {
      var _this3 = this;

      this._endBack = function () {
        _this3._clearTimer();
        _this3._$$callbackProcess(true);
      };

      this._errorBack = function () {
        _this3._clearTimer();
        _this3._$$callbackProcess(false);
      };

      this._startBack = function () {
        if (toPlay) {
          _this3.status = 'ready';
          /*延时150毫秒执行*/
          _this3.timer = setTimeout(function () {
            _this3._clearTimer();
            /*必须保证状态正确，因为有翻页太快，状态被修改*/
            if (_this3.status === 'ready') {
              _this3._startPlay();
            }
          }, 150);
        }
      };

      /**
       * loadedmetadata 准好就播
       * canplay 循环一小段
       */
      this.audio.addEventListener('loadedmetadata', this._startBack, false);
      this.audio.addEventListener('ended', this._endBack, false);
      this.audio.addEventListener('error', this._errorBack, false);
    }

    /**
     * 开始播放音频
     */

  }, {
    key: '_startPlay',
    value: function _startPlay() {
      /**
       * safari 自动播放
       * 手机浏览器需要加
       * 2016.8.26
       * @type {Boolean}
       */
      this.audio.autoplay = 'autoplay';
      this.play();
    }

    /**
     * Compatible with asynchronous
     * for subitile use
     * get audio
     * @return {[type]} [description]
     */

  }, {
    key: '_getAudioTime',
    value: function _getAudioTime(callback) {
      callback(Math.round(this.audio.currentTime * 1000));
    }

    /**
     * 复位接口
     */

  }, {
    key: '_reset',
    value: function _reset() {
      this.audio.pause();
      this.audio.currentTime = 0;
    }

    /**
     * 销毁方法
     * @return {[type]} [description]
     */

  }, {
    key: '_destroy',
    value: function _destroy() {
      if (this.audio) {
        this.audio.pause();
        if (!window.WeixinJSBridge) {
          //微信通过自己API 没有绑定事件
          this.audio.removeEventListener('loadedmetadata', this._startBack, false);
          this.audio.removeEventListener('ended', this._endBack, false);
          this.audio.removeEventListener('error', this._errorBack, false);
        }
        this.audio = null;
      }
    }

    ///////////////////////////
    ///   对外接口，修复上下文
    //////////////////////////

    /**
     * 重设音频上下文
     * 因为自动音频播放的关系
     * 在点击后修复这个音频
     * @return {[type]} [description]
     *
     * 这个接口特别注意
     * 音频绑定click可能与这个同时触发
     * 会导致loadedmetadata事件失效
     * this.status === ready
     */

  }, {
    key: 'resetContext',
    value: function resetContext() {
      /*如果不需要修复或者播放结束了*/
      if (!this._needFix || this.status === 'ended') {
        return;
      }
      this._destroy();
      this._createContext(this.status === 'playing' ? true : false);
    }
  }]);
  return NativeAudio;
}(AudioSuper);

var audioPlayer = void 0;

/*安卓客户端apk的情况下*/
if (Xut.plat.isAndroid && !Xut.plat.isBrowser) {
  audioPlayer = PhoneGapMedia;
} else {
  /*妙妙学的 客户端浏览器模式*/
  if (window.MMXCONFIG && window.audioHandler) {
    audioPlayer = CordovaMedia;
  } else {
    /*其余所有情况都用原声的H5播放器*/
    audioPlayer = NativeAudio;
  }
}

/**
 * 音频说明：
 *  一个音频播放有2种情况：
 *       1、自动播放该音频（autoPlay == true）
 *       2、手动播放该音频（点击触发点）
 *
 *   一个音频被停止有3种情况：
 *       1、手动暂停（点击触发点）
 *       2、同轨道的其他音频开始播放
 *       3、0轨道的音频开始播放
 *   特殊情况：
 *       0轨道的音频播放时，可以停止所有其他轨道的音频
 *       其他轨道的音频播放时，可以停止0轨道的音频
 *
 *   基于上面的条件，补充提示：
 *       同轨道只允许有一个自动播放的音频
 *       如果0轨道音频为自动播放，则其他轨道不允许有自动播放音频
 *       反之亦然，其他轨道有自动播放音频，则0轨道不允许有自动播放音频
 *
 *    ===================================================================================================
 *   该版本说明：
 *   一个音频被打断之后，就被销毁，不会在后续恢复播放，而只会重头开始播放
 *
 *  2014.12.1 版本升级
 *  原来只有热点音频，现在多了动画音频和节音频，所以音频管理需要调整,
 *  有两个要注意的地方：
 *  1. 由于在IOS上,new Audio操作会产生新的进程，且不释放，所以同一个音轨只新建一个音频实例
 *     为了防止交互点击时音频播放混乱，要先清除同音轨的上一个音频
 *  2. 节音频可以跨节共用，如,1,2,3节共用一个音频，那么在这些节之间跳转时不打断
 *
 */

/**
 * 容器合集
 * playBox 播放中的热点音频集合
 */
var playBox = void 0;

var initBox = function initBox() {
  playBox = hash();
};

/**
 * 获取父容器
 * @return {[type]} [description]
 */
var getParentNode = function getParentNode(subtitles, pageId, queryId) {
  //字幕数据
  var parentDoms = hash();
  var ancestorDoms = hash();
  var contentsFragment;
  var dom;
  var pageIndex = pageId - 1;
  if (subtitles) {
    //获取文档节点
    contentsFragment = Xut.Contents.contentsFragment[pageId];

    //如果maskId大于9000默认为处理
    var isMask = pageId > 9000;
    if (isMask) {
      //指定页码编号
      pageIndex = Xut.Presentation.GetPageIndex();
    }

    //找到对应的节点
    _.each(subtitles, function (data) {
      //'Content_0_1' 规则 类型_页码（0开始）_id
      if (!parentDoms[data.id]) {
        dom = contentsFragment['Content_' + pageIndex + '_' + data.id];
        ancestorDoms[data.id] = dom;
        var $dom = $(dom);
        if ($dom.length) {
          var _div = $dom.find('div').last();
          if (_div.length) {
            parentDoms[data.id] = _div[0];
          }
        }
      }
    });
  }

  return {
    parents: parentDoms,
    ancestors: ancestorDoms
  };
};

/**
 * 组合数据结构
 */
var deployAudio = function deployAudio(sqlData, pageId, queryId, type, actionData, columnData) {
  //新的查询
  var videoData = {};

  /*************
  组成数据
  1 column
  2 ppt
  *************/
  if (columnData && columnData.isColumn) {
    _.extend(videoData, {
      'trackId': columnData.track, //音轨
      'url': columnData.fileName, //音频名字
      'audioId': queryId,
      'data': sqlData
    });

    /*如果flow数据有动作切换图片*/
    if (columnData.startImage || columnData.stopImage) {
      _.extend(videoData, {
        startImage: columnData.startImage,
        stopImage: columnData.stopImage,
        action: true
      });
    }
  } else {
    //有字幕处理
    var subtitles = sqlData.theTitle ? parseJSON(sqlData.theTitle) : null;
    _.extend(videoData, {
      'trackId': sqlData.track, //音轨
      'url': sqlData.md5, //音频名字
      'subtitles': subtitles,
      'audioId': queryId,
      'data': sqlData
    });

    //混入新的动作数据
    //2015.9.24
    //音频替换图片
    //触发动画
    if (actionData) {
      _.extend(videoData, actionData, {
        action: true //快速判断存在动作数据
      });
    }
  }
  return videoData;
};

/**
 * 装配音频数据
 * @param  {int} pageId    页面id或节的分组id
 * @param  {int} queryId   查询id,支持activityId,audioId
 * @param  {string} type   音频来源类型[动画音频,节音频,热点音频]
 */
var assemblyData = function assemblyData(pageId, queryId, type, actionData, columnData) {

  /************
    column数据组成
  ************/
  if (columnData.isColumn) {
    return deployAudio({}, pageId, queryId, type, null, columnData);
  }

  /************
    PPT数据组成
  ************/
  var data = getMediaData(type, queryId);
  if (data && data.md5) {
    return deployAudio(data, pageId, queryId, type, actionData);
  }
};

/**
 * 检查要打断的音频
 * 不打断返回true,否则返回false
 */
var checkBreakAudio = function checkBreakAudio(type, pageId, queryId, newAuidoData) {

  var oldPlayObj = playBox[type][pageId][queryId];
  var oldTrackId = oldPlayObj.getTrackId();
  var newTrackId = newAuidoData.trackId;

  /**
   * 打断音频,条件
   * 如果要用零音轨||零音轨有音乐在播||两音轨相同
   */
  if (newTrackId == 0 || oldTrackId == 0 || newTrackId == oldTrackId) {
    if (newAuidoData.stetObj && newAuidoData.stetObj === oldPlayObj) {
      // 预加载检测打断，因为当前对象在预加载种已经被加载过了
      // 所以在打断时候要剔除这个对象
      // 保留这个对象不删除
    } else {
      oldPlayObj.destroy();
      delete playBox[type][pageId][queryId];
    }
  }
  return false;
};

/**
 * 播放音频之前检查
 * @param  {int} pageId    [description]
 * @param  {int} queryId    查询id
 * @param  {string} type    决定video表按哪个字段查询
 * @return {object}         音频对象/不存在为nul
 * pageId, queryId, type
 */
var preCheck = function preCheck(auidoData) {
  var types = void 0,
      pageId = void 0,
      queryId = void 0;
  for (types in playBox) {
    for (pageId in playBox[types]) {
      for (queryId in playBox[types][pageId]) {
        checkBreakAudio(types, pageId, queryId, auidoData);
      }
    }
  }
};

/**
 * 填充box,构建播放列表
 * @param  {[type]} pageId [description]
 * @param  {[type]} type   [description]
 * @return {[type]}        [description]
 */
var fillBox = function fillBox(pageId, type) {
  if (!playBox[type]) {
    playBox[type] = hash();
  }
  if (!playBox[type][pageId]) {
    playBox[type][pageId] = hash();
  }
};

/**
 * 创建音频
 * @param  {[type]} pageId    [description]
 * @param  {[type]} queryId   [description]
 * @param  {[type]} type      [description]
 * @param  {[type]} audioData [description]
 * @return {[type]}           [description]
 */
var createAudio = function createAudio(pageId, queryId, type, audioData) {

  //检测是否打断
  preCheck(audioData);

  //构建播放列表
  fillBox(pageId, type);

  //假如有字幕信息
  //找到对应的文档对象
  var subtitleNode = void 0;
  if (audioData.subtitles) {
    subtitleNode = getParentNode(audioData.subtitles, pageId, queryId);
  }

  //播放一次的处理
  audioData.innerCallback = function (audio) {
    if (playBox[type] && playBox[type][pageId] && playBox[type][pageId][queryId]) {
      audio.destroy();
      delete playBox[type][pageId][queryId];
    }
  };

  playBox[type][pageId][queryId] = new audioPlayer(audioData, subtitleNode);
};

/**
 * 交互点击
 * @param  {[type]} pageId    [description]
 * @param  {[type]} queryId   [description]
 * @param  {[type]} type      [description]
 * @param  {[type]} audioData [description]
 * @return {[type]}           [description]
 */
var tiggerAudio = function tiggerAudio(pageId, queryId, type, audioData) {
  var playObj = void 0,
      status = void 0;
  if (playBox[type] && playBox[type][pageId] && playBox[type][pageId][queryId]) {
    playObj = playBox[type][pageId][queryId];
    status = playObj.audio ? playObj.status : null;
  }
  switch (status) {
    case 'playing':
      playObj.pause();
      break;
    case 'paused':
      playObj.play();
      break;
    default:
      createAudio(pageId, queryId, type, audioData);
      break;
  }
};

/**
 * 加载音频对象
 */
var loadAudio = function loadAudio(_ref) {
  var pageId = _ref.pageId,
      queryId = _ref.queryId,
      type = _ref.type,
      action = _ref.action,
      data = _ref.data,
      _ref$columnData = _ref.columnData,
      columnData = _ref$columnData === undefined ? {} : _ref$columnData;


  ///////////////////////
  //  1.初始化、
  //  2.直接加载播放对象
  ////////////////////////

  /*column的参数是字符串类型*/
  if (!columnData.isColumn) {
    pageId = Number(pageId);
    queryId = Number(queryId);
  }

  var audioData = assemblyData(pageId, queryId, type, data, columnData);

  /*手动触发的热点,这种比较特别，手动点击可以切换状态*/
  if (type === 'hot' && action == 'trigger') {
    /*判断是否为点击动作*/
    audioData.isTrigger = true;
    tiggerAudio(pageId, queryId, type, audioData);
  } else {
    createAudio(pageId, queryId, type, audioData);
  }
};

function getPlayBox() {
  return playBox;
}

///////////////////
//1 独立音频处理, 音轨/跨页面 //
//2 动画音频,跟动画一起播放与销毁
///////////////////

/*代码初始化*/
function initAudio() {
  initBox();
}

////////////////////////
/// PPT 动画音频接口
/// 1 自动音频
/// 2 手动音频
///////////////////////


/*
 音频在创建dom的时候需要查下，这个hot对象是否已经被创建过
 如果创建过，那么图标状态需要处理
*/
function hasHotAudioPlay(pageId, queryId) {
  var playBox = getPlayBox();
  if (playBox[HOT] && playBox[HOT][pageId]) {
    var audioObj = playBox[HOT][pageId][queryId];
    if (audioObj && audioObj.status === 'playing') {
      return true;
    }
  }
}

/**
 * 自动播放触发接口
 */
function autoAudio(chapterId, activityId, data) {
  loadAudio({
    pageId: chapterId,
    queryId: activityId,
    type: HOT,
    action: 'auto',
    data: data
  });
}

/**
 * 手动触发
 */
function triggerAudio(_ref) {
  var data = _ref.data,
      columnData = _ref.columnData,
      activityId = _ref.activityId,
      chapterId = _ref.chapterId;

  loadAudio({
    data: data,
    columnData: columnData,
    pageId: chapterId,
    queryId: activityId,
    type: HOT,
    action: 'trigger'
  });
}

////////////////////////
/// 动画音频接口
/// 2 直接播放
/// 3 复位
/// 4 销毁
///////////////////////

/**
 * 动画音频触发接口
 */
function createContentAudio(pageId, audioId) {
  loadAudio({
    pageId: pageId,
    queryId: audioId,
    type: CONTENT
  });
}

var accessAudio = function accessAudio(pageId, queryId, callback) {
  var playBox = getPlayBox();
  if (playBox[CONTENT]) {
    var pagePlayObj = playBox[CONTENT][pageId];
    if (pagePlayObj) {
      var playObj = pagePlayObj[queryId];
      if (playObj) {
        callback(playObj, playBox);
      }
    }
  }
};

/**
 * 复位动画音频
 * 必须要存在content音频对象
 * 待用
 */


/**
 * 销毁动画音频
 * 1 清理页面中的content
 * 2 清理playBox中的content对象
 */
function destroyContentAudio(pageId, queryId) {

  /*如果只有pageId没有queryId就是全部清理*/
  if (pageId && queryId === undefined) {
    return;
  }

  /*单独清理*/
  accessAudio(pageId, queryId, function (playObj, playBox) {
    playObj.destroy();
    /*清理保存容器*/
    delete playBox[CONTENT][pageId][queryId];
    if (!Object.keys(playBox[CONTENT][pageId]).length) {
      delete playBox[CONTENT][pageId];
    }
  });
}

/**
 * 重置音频对象
 * 如果在不支持自动音频的情况下
 * 如果修复代码没有执行的时候，就运行自动音频
 * 那么音频是没有声音的
 * 所以等修复音频代码执行完毕后，手动调用
 * 然后让音频能支持自动播放
 * @return {[type]} [description]
 */
function resetAudioContext() {
  var playBox = getPlayBox();
  var t, p, a;
  for (t in playBox) {
    for (p in playBox[t]) {
      for (a in playBox[t][p]) {
        /*needFix：如果是需要修复的代码*/
        playBox[t][p][a].resetContext();
      }
    }
  }
}

////////////////////////
/// Column音频接口
///////////////////////

/*
2017.5.8新增
每个column页面支持音频，所以翻页就删除
这里不需要页码区分，因为全删
 */
function clearColumnAudio() {
  var playBox = getPlayBox();
  /*清理视频*/
  if (playBox && playBox[HOT] && playBox[HOT][COLUMN]) {
    var playObjs = playBox[HOT][COLUMN];
    for (var player in playObjs) {
      playObjs[player].destroy();
      playObjs[player] = null;
    }
    delete playBox[HOT][COLUMN];
  }
}

/**
 * 获取媒体数据，视频音频
 */
function getMediaData(type, queryId) {
  if (type === CONTENT || type === SEASON) {
    return Xut.data.query('Video', queryId, true);
  } else {
    //如果普通音频数据
    return Xut.data.query('Video', queryId);
  }
}

/**
 * 挂起音频
 */
function hangUpAudio() {
  var playBox = getPlayBox();
  var t, p, a;
  for (t in playBox) {
    for (p in playBox[t]) {
      for (a in playBox[t][p]) {
        playBox[t][p][a].pause();
      }
    }
  }
}

///////////////////////////////
///
///   清理全部音频
///
///////////////////////////////


/**
 * 清理所有音频
 */
function clearAudio$1() {
  var playBox = getPlayBox();
  var t, p, a;
  for (t in playBox) {
    for (p in playBox[t]) {
      for (a in playBox[t][p]) {
        playBox[t][p][a].destroy();
      }
    }
  }
  initBox();
}

/**
 *   html5的video播放器
 *   API :
 *   play();播放
 *   stop();    //停止播放并隐藏界面
 *   destroy(); //清除元素节点及事件绑定
 *  demo :
 *  var video = new Video({url:'1.mp4',width:'320',...});
 *  video.play();
 */

var h5Player = function () {
  function h5Player(options) {
    classCallCheck(this, h5Player);
    var width = options.width,
        height = options.height,
        top = options.top,
        left = options.left,
        zIndex = options.zIndex,
        url = options.url;


    this.options = options;
    this.$container = getContainer(options);

    this._initWrap(width, height, top, left, zIndex, getFilePath(url));
    this._initEvent(options);

    //////////////////////////
    ///2016.6.23
    //移动端必须触发2次play
    //安卓ios需要直接调用play开始
    ////////////////////////
    if (Xut.plat.isIOS || Xut.plat.isAndroid) {
      this.play();
    }

    /**
     * 2017.5.23
     * 安卓手机播放视频，全屏的情况下，会强制横版
     * 导致了触发横竖切换关闭应用
     * @type {Boolean}
     */
    Xut.Application.PlayHTML5Video = true;
  }

  /*初始化容器*/


  createClass(h5Player, [{
    key: '_initWrap',
    value: function _initWrap(width, height, top, left, zIndex, src) {
      this.$videoWrap = createVideoWrap('video-h5', { width: width, height: height, top: top, left: left, zIndex: zIndex });
      this.video = document.createElement('video');

      this.$videoNode = $(this.video).css({ width: width, height: height, display: 'block' }).attr({
        src: src,
        'controls': 'controls',
        'autoplay': 'autoplay',
        'playsinline': 'playsinline'
      });

      //父容器
      this.$videoWrap.append(this.$videoNode);
      this.$container.append(this.$videoWrap);
    }

    /*初始化事件*/

  }, {
    key: '_initEvent',
    value: function _initEvent(options) {
      var _this = this;

      /*开始播放*/
      this._start = function () {
        _this.play();
        //防止播放错误时播放界面闪现
        _this.$videoWrap.css('visibility', 'visible');
      };

      /*如果是启动视频直接清理*/
      this._clear = function () {
        if (options.startBoot) {
          options.startBoot();
        }
        removeVideo(options.chapterId);
      };

      /*提示该视频已准备好开始播放：*/
      this.video.addEventListener('canplay', this._start, false);
      this.video.addEventListener('ended', this._clear, false);
      this.video.addEventListener('error', this._clear, false);
    }
  }, {
    key: 'play',
    value: function play() {
      //iphone手机上，系统接管后，点击完成
      //必须这样处理后，才能再次显示
      this.$videoWrap.show();
      this.video.play();
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.video.pause();
      //妙妙学只需要停止
      if (!window.MMXCONFIG) {
        this.$videoWrap.hide();
        //用于首页启动视频
        if (this.options.startBoot) {
          this.options.startBoot();
          this.destroy();
        }
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.stop();
      this.video.removeEventListener('canplay', this._start, false);
      this.video.removeEventListener('ended', this._clear, false);
      this.video.removeEventListener('error', this._clear, false);
      this.$videoWrap.remove();
      this.$videoNode = null;
      this.$videoWrap = null;
      this.$container = null;
      this.options.container = null;
      this.video = null;

      /*延时1000后改变，因为视频关闭后复位，会引发浏览器翻转事件*/
      setTimeout(function () {
        Xut.Application.PlayHTML5Video = false;
      }, 1000);
    }
  }]);
  return h5Player;
}();

var pixelRatio = window.devicePixelRatio;
var resolution = window.screen;

/**
 * 安卓phonegap播放器
 */

var PhoneGapMedia$1 = function () {
  function PhoneGapMedia(options) {
    classCallCheck(this, PhoneGapMedia);


    //如果是读库或者妙妙学
    var url = window.MMXCONFIG || window.DUKUCONFIG ? options.url
    //如果是纯apk模式
    : options.url.substring(0, options.url.lastIndexOf('.'));

    this.url = getFilePath(url);

    //如果是安卓平台，视频插件去的分辨率
    //所以这里要把 可以区尺寸，转成分辨率
    //读库强制全屏
    if (window.DUKUCONFIG) {
      this.width = resolution.width;
      this.height = resolution.height;
      this.top = 0;
      this.left = 0;
    } else {
      //正常的是按照屏幕尺寸的
      //这是安卓插件问题,按照分辨率计算
      this.width = options.width * pixelRatio;
      this.height = options.height * pixelRatio;
      this.left = options.left * pixelRatio || 0;
      this.top = options.top * pixelRatio || 0;
    }

    this.play();
  }

  createClass(PhoneGapMedia, [{
    key: 'play',
    value: function play() {
      Xut.Plugin.VideoPlayer.play(function () {
        console.log('success');
      }, function () {
        console.log('fail');
      }, this.url, 1, this.left, this.top, this.height, this.width);
    }
  }, {
    key: 'stop',
    value: function stop() {
      Xut.Plugin.VideoPlayer.close();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.stop();
    }
  }]);
  return PhoneGapMedia;
}();

/**
 * 网页
 * @param {[type]} options [description]
 */

var WebPage = function () {
  function WebPage(options) {
    classCallCheck(this, WebPage);


    var pageUrl = options.pageUrl;

    this.container = getContainer(options);

    //跳转app市场
    //普通网页是1
    //跳转app市场就是2
    if (options.hyperlink == 2) {
      //跳转到app市场
      window.open(pageUrl);
      //数据统计
      $.get('http://www.appcarrier.cn/index.php/adplugin/recordads?aid=16&esbId=ios');
    } else {

      var padding = options.padding || 0,
          width = options.width,
          height = options.height,
          videoId = options.videoId,
          left = options.left,
          top = options.top,
          eleWidth,
          eleHeight;

      if (padding) {
        eleWidth = width - 2 * padding;
        eleHeight = height - 2 * padding;
      } else {
        eleWidth = width;
        eleHeight = height;
      }

      this.$videoNode = $('<div id="videoWrap_' + videoId + '" style="position:absolute;left:' + left + 'px;top:' + top + 'px;width:' + width + 'px;height:' + height + 'px;z-index:' + Xut.zIndexlevel() + '">' + '<div style="position:absolute;left:' + padding + 'px;top:' + padding + 'px;width:' + eleWidth + 'px;height:' + eleHeight + 'px;">' + '<iframe src="' + pageUrl + '" style="position:absolute;left:0;top:0;width:100%;height:100%;"></iframe>' + '</div>' + '</div>');

      this.container.append(this.$videoNode);

      this.play();
    }
  }

  createClass(WebPage, [{
    key: 'play',
    value: function play() {
      this.$videoNode && this.$videoNode.show();
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.$videoNode && this.$videoNode.hide();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.$videoNode) {
        this.$videoNode.remove();
        this.$videoNode = null;
      }
      this.container = null;
    }
  }]);
  return WebPage;
}();

var VideoPlayer = void 0;

//浏览器平台
if (Xut.plat.isBrowser) {
  // 安卓手机浏览器全屏问题太多,默认全屏回去的时候会顶出来
  // 苹果手机初始化有一个白色的圆，控制条丢失
  if (Xut.plat.isIOS || Xut.plat.isAndroid) {
    VideoPlayer = flarePlayer;
  } else {
    VideoPlayer = h5Player;
  }
} else {
  //apk ipa
  if (Xut.plat.isIOS || top.EduStoreClient) {
    //如果是ibooks模式
    if (Xut.IBooks.Enabled) {
      VideoPlayer = flarePlayer;
    } else {
      //如果是ios或读酷pc版则使用html5播放
      VideoPlayer = flarePlayer;
    }
  } else if (Xut.plat.isAndroid) {
    if (window.MMXCONFIG) {
      // 安卓妙妙学强制走h5
      // 由于原生H5控制条不显示的问题
      VideoPlayer = flarePlayer;
    } else {
      //android平台
      VideoPlayer = PhoneGapMedia$1;
    }
  }
}

var VideoClass = function () {
  function VideoClass(options) {
    classCallCheck(this, VideoClass);

    switch (options.category) {
      case 'video':
        this.video = new VideoPlayer(options, removeVideo);
        break;
      case 'webpage':
        this.video = new WebPage(options, removeVideo);
        break;
      default:
        console.log('options.category must be video or webPage ');
        break;
    }
    Xut.View.Toolbar("hide");
  }

  createClass(VideoClass, [{
    key: 'play',
    value: function play() {
      Xut.View.Toolbar("hide");
      this.video.play();
    }
  }, {
    key: 'stop',
    value: function stop() {
      Xut.View.Toolbar("show");
      this.video.stop();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.video.destroy();
    }
  }]);
  return VideoClass;
}();

/*
    视频和远程网页管理模块
*/
var playBox$1 = void 0;

/*
初始化盒子
1 当前页面包含的视频数据
2 播放过的视频数据 （播放集合)
 */
var initBox$1 = function initBox() {
  playBox$1 = hash();
};

/**
 * 配置视频结构
 */
var deployVideo = function deployVideo(videoData, options, columnData) {
  var palyData = {};
  var chapterId = options.chapterId,
      activityId = options.activityId,
      pageIndex = options.pageIndex,
      pageType = options.pageType;


  if (columnData) {
    /*width, height, top, left, zIndex, url*/
    _.extend(palyData, {
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      zIndex: 1,
      chapterId: chapterId,
      container: columnData.container,
      url: columnData.fileName,
      isColumn: columnData.isColumn,
      position: columnData.position,
      category: 'video'
    });
  } else {
    var getStyle = Xut.Presentation.GetPageStyle(pageIndex);
    var layerSize = setProportion({
      getStyle: getStyle,
      proportion: getStyle.pageProportion,
      width: videoData.width || config.visualSize.width,
      height: videoData.height || config.visualSize.height,
      left: videoData.left,
      top: videoData.top,
      padding: videoData.padding
    });
    _.extend(palyData, layerSize, {
      pageType: pageType,
      chapterId: chapterId,
      isfloat: videoData.isfloat, //是否浮动
      'videoId': activityId,
      'url': videoData.md5,
      'pageUrl': videoData.url,
      'zIndex': videoData.zIndex || 2147483647,
      'background': videoData.background,
      'category': videoData.category,
      'hyperlink': videoData.hyperlink
    });
  }

  return palyData;
};

/*
装配数据
 */
var assemblyData$1 = function assemblyData(options) {
  /*column处理*/
  if (options.columnData && options.columnData.isColumn) {
    return deployVideo({}, options, options.columnData);
  } else {
    //新的查询
    var videoData = Xut.data.query('Video', options.activityId);
    return deployVideo(videoData, options);
  }
};

/**
 * 加载视频
 */
var createVideo = function createVideo(options, videoData) {
  var chapterId = options.chapterId,
      activityId = options.activityId,
      rootNode = options.rootNode;

  /*如果已经存在，直接调用播放*/

  if (playBox$1[chapterId] && playBox$1[chapterId][activityId]) {
    playBox$1[chapterId][activityId].play();
  } else {
    if (!_.isObject(playBox$1[chapterId])) {
      playBox$1[chapterId] = {};
    }
    if (rootNode) {
      videoData.container = rootNode;
    }
    playBox$1[chapterId][activityId] = new VideoClass(videoData);
  }
};

/**
 * 初始化视频
 */
var initVideo$1 = function initVideo(options) {
  //解析数据
  var videoData = assemblyData$1(options);
  //调用播放
  createVideo(options, videoData);
};

/**
 * 是否有视频对象
 * @return {Boolean} [description]
 */
function hasVideoObj(chapterId, activityId) {
  if (playBox$1[chapterId]) {
    return playBox$1[chapterId][activityId];
  }
}

/*播放视频
1 存在实例
2 重新创建
{ chapterId, activityId, rootNode, pageIndex, pageType }
*/
function playVideo(options) {
  var videoObj = hasVideoObj(options.chapterId, options.activityId);
  if (videoObj) {
    videoObj.play();
  } else {
    initVideo$1(options);
  }
}

function getPlayBox$1() {
  return playBox$1;
}

/*
初始化视频
 */
function initVideo() {
  initBox$1();
}

/**
 * 自动播放
 */
function autoVideo() {
  playVideo.apply(undefined, arguments);
}

/**
 * 手动播放
 */
function triggerVideo() {
  playVideo.apply(undefined, arguments);
}

/**
 * 清理移除指定页的视频
 */
function removeVideo(chapterId) {
  var playBox = getPlayBox$1();
  //清理视频
  if (playBox && playBox[chapterId]) {
    for (var activityId in playBox[chapterId]) {
      playBox[chapterId][activityId].destroy();
      playBox[chapterId][activityId] = null;
    }
    delete playBox[chapterId];
  }
}

/**
 * 清理全部视频
 */
function clearVideo() {
  var playBox = getPlayBox$1();
  var flag = false; //记录是否处理过销毁状态
  for (var chapterId in playBox) {
    for (var activityId in playBox[chapterId]) {
      playBox[chapterId][activityId].destroy();
      flag = true;
    }
  }
  initBox$1();
  return flag;
}

/*
忙碌光标
 */
var getBusyHTML = function getBusyHTML() {
  return hasDisable() ? '' : '<div class="xut-busy-icon xut-fullscreen"></div>';
};

/**
 * 初始化根节点
 */
var getContentHTML = function getContentHTML(newCursor) {
  var coverStyle = '';
  //mini平台不要背景图
  if (config.launch.platform === 'mini') {} else {
    //默认背景图
    var coverUrl = './content/gallery/cover.jpg';
    //重写背景图
    if (config.launch.resource) {
      coverUrl = config.launch.resource + '/gallery/cover.jpg';
    }
    //背景样式
    coverStyle = 'style="background-image: url(' + coverUrl + ');"';
  }
  return getBusyHTML() + '\n            <div class="xut-adaptive-image"></div>\n            <div class="xut-cover xut-fullscreen" ' + coverStyle + '></div>\n            <div class="xut-scene-container xut-fullscreen xut-overflow-hidden"></div>';
};

/**
 * 根节点
 */
var $rootNode = void 0;
var $contentNode = void 0;
function initRootNode() {
  var nodeName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '#xxtppt-app-container';
  var cursor = arguments[1];

  if (nodeName) {
    $rootNode = $(nodeName);
  }
  if (!$rootNode.length) {
    //如果没有传递节点名，直接放到body下面
    nodeName = '';
    $rootNode = $('body');
  }

  var contentHtml = getContentHTML(cursor);

  //如果根节点不存在,配置根节点
  if (!nodeName) {
    contentHtml = '<div id="xxtppt-app-container" class="xut-fullscreen xut-overflow-hidden">' + contentHtml + '</div>';
  }
  $contentNode = $(String.styleFormat(contentHtml));
  return { $rootNode: $rootNode, $contentNode: $contentNode };
}

function clearRootNode() {
  if ($contentNode) {
    $contentNode.remove();
    $contentNode = null;
  }
  $rootNode = null;
}

////////////////////////////////////////////
///
/// 修复采用img的图片错误问题
///   修复错误的图片加载
///   图片错误了，会先隐藏，然后再去请求一次
///   如果还是错误，就抛弃，正确就显示出来
///   queue:{
///     chpaerId:[1.png,2.png,3.png]
///     ................
///   }
///   特别注意，这里是动态加入的
///   所以，有可能是边解析边加入新的
///
///////////////////////////////////////////

var queue = {};
var waiting = false;

/**
 * 检测一个chpater中的图片加载是否完成
 * @param  {[type]} chapterIndex [description]
 * @return {[type]}              [description]
 */
function checkFigure$1(chapterIndex, callback) {
  var length = queue[chapterIndex].length;

  if (!length) {
    callback();
    return;
  }

  var count = length;
  var complete = function complete() {
    if (count === 1) {
      callback();
      return;
    }
    --count;
  };

  var data = void 0;
  while (data = queue[chapterIndex].shift()) {
    data(complete);
  }
}

/*
  运行队列
  1.因为queue的对象结构通过chapterId做页面的标记，保存所有每个页面图片的索引
  2.在这个chapter去检测图片的时候，如果成功了就处理图片显示，然后要删除这个检测的fn
  3.因为是动态加入的，所以每个chapter检测完毕后，还要根据列表是否有值，在去处理
  4.最后通过runBatcherQueue在递归一次检测，最终每个chapter是否都处理完毕了
 */
function runBatcherQueue() {
  var keys = Object.keys(queue);
  if (keys.length) {
    var chapterIndex = keys.shift();
    if (chapterIndex.length) {
      checkFigure$1(chapterIndex, function () {
        /*如果列表没有数据了*/
        if (!queue[chapterIndex].length) {
          delete queue[chapterIndex];
        }
        /*如果列表还有后续新加入的继续修复当前这个列表*/
        runBatcherQueue();
      });
    } else {
      delete queue[chapterIndex];
    }
  } else {
    waiting = false;
  }
}

/**
 * 修复错误的图片加载
 * @return {[type]} [description]
 */
function repairImage(node, chapterIndex, src) {
  if (!node) {
    return;
  }
  /*先隐藏错误节点*/
  node.style.display = "none";

  /*根据页面chpater加入列表*/
  if (!queue[chapterIndex]) {
    queue[chapterIndex] = [];
  }

  /*做一次错误节点的预加载处理*/
  queue[chapterIndex].push(function (callback) {
    loadFigure(src, function (state) {
      /*如果请求成功，修改图片状态*/
      if (state) {
        if (node && node.style) {
          node.style.display = "block";
        }
      }
      node = null;
      callback();
    });
  });

  if (!waiting) {
    waiting = true;
    runBatcherQueue();
  }
}

/**
 * 清理错误检测的图片
 * @return {[type]} [description]
 */
function clearRepairImage(chapterIndex) {
  if (queue && queue[chapterIndex]) {
    queue[chapterIndex].length = 0;
    delete queue[chapterIndex];
  }
}

/////////////////////////////
/// 初始化页面默认行为
/////////////////////////////

/**
 * 特殊的一个方法，用来修正图片资源错误的
 * dom中的事件onerror触发，所以直接
 * @return {[type]} [description]
 */
window.fixNodeError = function (type, node, chapterIndex, src) {
  if (type === 'image') {
    repairImage(node, chapterIndex, src);
  }
};

//修复H5音频自动播放bug
if (!Xut.plat.hasAutoPlayAudio) {
  fixAudio();
}

//只初始一次
//横竖切换要判断
var onceBind = false;

function initGlobalEvent() {

  if (Xut.plat.isBrowser && !onceBind) {

    onceBind = true;

    //禁止全局的缩放处理
    $('body').on('touchmove', function (event) {
      event.preventDefault && event.preventDefault();
    });

    //桌面鼠标控制翻页
    $(document).keyup(function (event) {
      switch (event.keyCode) {
        case 37:
          Xut.View.GotoPrevSlide();
          break;
        case 39:
          Xut.View.GotoNextSlide();
          break;
      }
    });

    /*防止快速刷新，会触发Original时间*/
    setTimeout(function () {
      /*Home键音频动作处理*/
      $(document).on('visibilitychange', function (event) {
        /*home 后台*/
        if (document.visibilityState === 'hidden') {
          Xut.Application.Original();
        } else {
          /*如果不是嵌套iframe，激活*/
          if (!window.GLOBALIFRAME) {
            Xut.Application.Activate();
          }
        }
      });
    }, 1000);

    /*
    启动代码用户操作跟踪
    1、先不判断，一律按关闭提交（要有延迟）。
    2、如果是刷新，取消之前的延迟，提交刷新提示。
    */
    $(window).on('beforeunload', function () {
      config.sendTrackCode('exit', { time: +new Date() - config.launch.launchTime });
    });
  }
}

/*
移除全局绑定
 */
function clearGlobalEvent() {
  if (onceBind) {
    $('body').off(); //touchmove 禁止全局的缩放处理
    $(document).off(); //keyup 左右按钮
    $(window).off(); //beforeunload,orientationchange
    onceBind = false;
  }
}

/**
 * 判断是否支持webp模式
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function supportWebP(callback) {
  var webP = new Image();
  webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  webP.onload = webP.onerror = function () {
    callback(webP.height === 2);
  };
}

/**
 * 提前检测出异步的功能支持
 * @return {[type]} [description]
 */
function initAsyn(callback) {

  /**
   * 检测是否支持webp格式
   */
  supportWebP(function (state) {
    Xut.plat.supportWebp = state;
    callback();
  });
}

/**
 * 抽象管理接口
 * @return {[type]} [description]
 */
var ManageSuper = function () {
  function ManageSuper() {
    classCallCheck(this, ManageSuper);

    //初始化容器
    this._group = {};

    /*数据快速获取接口，首字母直接大写的快捷方式*/
    this.$$GetPageId = this.$$getPageId;
    this.$$GetPageNode = this.$$getPageNode;
    this.$$GetPageData = this.$$getPageData;
    this.$$GetPageBase = this.$$getPageBase;
  }

  //===============================
  //    提供给子子类使用的私有方法
  //===============================

  /**
   * 增加合集管理
   */


  createClass(ManageSuper, [{
    key: '_$$addBaseGroup',
    value: function _$$addBaseGroup(pageIndex, pageObj) {
      this._group[pageIndex] = pageObj;
    }

    /**
     * 得到页面合集
     */

  }, {
    key: '_$$getBaseGroup',
    value: function _$$getBaseGroup() {
      return this._group;
    }

    /**
     * 删除合集管理
     */

  }, {
    key: '_$$removeBaseGroup',
    value: function _$$removeBaseGroup(pageIndex) {
      delete this._group[pageIndex];
    }

    /**
     * 销毁合集
     */

  }, {
    key: '_$$destroyBaseGroup',
    value: function _$$destroyBaseGroup() {
      var k = void 0,
          _group = this._group;
      for (k in _group) {
        _group[k].baseDestroy();
      }
      this._group = null;
    }

    //===============================
    //    提供外部调用方法
    //===============================

    /**
     * 合并处理
     */

  }, {
    key: 'assistPocess',
    value: function assistPocess(pageIndex, callback) {
      var pageObj;
      if (pageObj = this.$$getPageBase(pageIndex, this.pageType)) {
        if (callback) {
          callback(pageObj);
        } else {
          return pageObj;
        }
      }
    }

    /**
     * 执行辅助对象事件
     */

  }, {
    key: 'assistAppoint',
    value: function assistAppoint(activityId, currIndex, outCallBack, actionName) {
      var pageObj;
      if (pageObj = this.$$getPageBase(currIndex)) {
        return pageObj.baseAssistRun(activityId, outCallBack, actionName);
      }
    }

    //===============================
    //    提供外部调用与子类使用
    //===============================

    /////////////////////////////////
    //  "GetPageId",
    //  "GetPageNode",
    //  "GetPageData",
    //  "GetPageBase"
    //////////////////////////////////

    /**
     * 获取页面容器ID
     * chpaterID
     * masterID
     * @return {[type]} [description]
     */

  }, {
    key: '$$getPageId',
    value: function $$getPageId(pageIndex, pageType) {
      var key = pageType === 'page' ? '_id' : 'pptMaster';
      return this.$$getPageData(pageIndex, key, pageType);
    }

    /**
     * 得到页面的nodes数据
     */

  }, {
    key: '$$getPageNode',
    value: function $$getPageNode(pageIndex, pageType) {
      return this.$$getPageData(pageIndex, 'nodes', pageType);
    }

    /**
     * 找到页面对象
     * 1.页面直接pageIndex索引
     * 2.母版通过母版Id索引
     * @return {[type]} [description]
     */

  }, {
    key: '$$getPageBase',
    value: function $$getPageBase(pageIndex, pageType) {
      pageType = pageType || this.pageType;
      //模板传递的可能不是页码
      if (pageType === 'master') {
        //如果不是母版ID，只是页码
        if (!/-/.test(pageIndex)) {
          //转化成母版id
          pageIndex = this.converMasterId(pageIndex);
        }
      }
      return this._group && this._group[pageIndex];
    }

    /**
     * 获取页面数据
     */

  }, {
    key: '$$getPageData',
    value: function $$getPageData(pageIndex, key, pageType) {
      var pageObj;
      //如果传递key是 pageType
      if (!pageType && key == 'page' || key == 'master') {
        pageType = key;
        key = null;
      }
      if (pageObj = this.$$getPageBase(pageIndex, pageType)) {
        return key ? pageObj.chapterData[key] : pageObj.chapterData;
      }
    }
  }]);
  return ManageSuper;
}();

/**
 * 拖拽类
 */
var _class = function () {
  function _class(dragElement, dropElement, autoReturn, dragCallback, dropCallback, container, throwProps) {
    classCallCheck(this, _class);


    this.dragElement = dragElement;
    this.defaultPoint = null;
    this.dropElement = dropElement;
    this.autoReturn = autoReturn >= 1 ? true : false; //1:自动返回(true) 0:留在原地(false)
    this.dragCallback = typeof dragCallback == "function" ? dragCallback : null;
    this.dropCallback = typeof dropCallback == "function" ? dropCallback : null;
    this.throwProps = throwProps == false || this.autoReturn ? false : true;
    this.container = container;
    this.dragElement.attr("data-defaultindex", this.dragElement.css("z-index"));
    //this.dragObject = null; //创建的拖拽对象实例
    var isInit = this.dragElement.attr("data-DragDrop");
    if (isInit == null) {
      this.init();
      this.dragElement.attr("data-DragDrop", true);
    } else {
      console.log("This element has binding DragDropClass.");
    }
  }

  /**
   * 初始化拖拽
   * @return {[type]} [description]
   */


  createClass(_class, [{
    key: "init",
    value: function init() {
      if (this.dragObject != null) return;

      var self = this;

      //now make both boxes draggable.
      var dragObject = this.dragObject = Draggable.create(this.dragElement, {
        bounds: this.container,
        dragResistance: 0,
        edgeResistance: 0.8,
        type: "left,top", //rotation、scroll(x+y模式与PPT动画冲突)
        force3D: false, //是否启用硬件加速(left+top模式无需启用，启用后存在闪现问题)
        throwProps: this.throwProps,
        snap: {
          left: function left(endValue) {
            return endValue;
          },
          top: function top(endValue) {
            return endValue;
          }
        },
        onDragStart: function onDragStart(e) {
          //获取拖拽对象原始参数
          var defaultOffset = self.dragElement.offset();
          self.defaultPoint = {
            x: defaultOffset.left,
            y: defaultOffset.top,
            left: Number(self.dragElement.css("left").replace("px", "")),
            top: Number(self.dragElement.css("top").replace("px", ""))
          };
          if (self.dragCallback) self.dragCallback();
        },
        onDragEnd: function onDragEnd(e) {
          var dropElement = self.dropElement,
              isEnter = false; //是否进入目标

          //目标元素可见才可以拖拽成功
          if (dropElement && dropElement[0].style.visibility != "hidden") {
            //获取拖拽对象当前参数
            var fromOffset = self.dragElement.offset();
            var fromPoint = {
              x: fromOffset.left,
              y: fromOffset.top,
              w: self.dragElement.width(),
              h: self.dragElement.height()
            };
            //获取目标对象参数
            var toOffset = dropElement.offset();
            var toPoint = {
              x: toOffset.left,
              y: toOffset.top,
              w: dropElement.width(),
              h: dropElement.height()
            };
            //目标对象中心点
            var targetCenter = {
              pointerX: toPoint.x + toPoint.w / 2,
              pointerY: toPoint.y + toPoint.h / 2
            };
            //拖拽点位于目标框中或目标中心点位于拖拽框中视为拖拽成功
            if (dragObject.pointerX > toPoint.x && dragObject.pointerX < toPoint.x + toPoint.w && dragObject.pointerY > toPoint.y && dragObject.pointerY < toPoint.y + toPoint.h) {
              isEnter = true;
              dragObject.disable();
            } else if (targetCenter.pointerX > fromPoint.x && targetCenter.pointerX < fromPoint.x + fromPoint.w && targetCenter.pointerY > fromPoint.y && targetCenter.pointerY < fromPoint.y + fromPoint.h) {
              isEnter = true;
              dragObject.disable();
            }
            //拖拽成功
            if (isEnter == true) {
              //结束后恢复层级关系
              // self.dragElement.css("z-index", self.dragElement.attr("data-defaultindex"));

              //拖拽对象与目标对象中心点差
              var moveX = targetCenter.pointerX - (self.defaultPoint.x + fromPoint.w / 2);
              var moveY = targetCenter.pointerY - (self.defaultPoint.y + fromPoint.h / 2);
              //拖拽对象最终停放位置
              var newLeft = self.defaultPoint.left + moveX;
              var newTop = self.defaultPoint.top + moveY;
              //自动拖拽到位
              TweenLite.to(self.dragElement, 0.30, {
                css: {
                  left: newLeft,
                  top: newTop
                },
                ease: Expo.easeOut
              });
            } else if (self.autoReturn) TweenLite.to(self.dragElement, 0.70, {
              css: {
                left: self.defaultPoint.left,
                top: self.defaultPoint.top
              }
            });
          } else if (self.autoReturn) TweenLite.to(self.dragElement, 0.70, {
            css: {
              left: self.defaultPoint.left,
              top: self.defaultPoint.top
            }
          });
          //不管是否存在拖拽目标元素 拖拽成功与否最后还原成原来的z-index
          self.dragElement.css("z-index", self.dragElement.attr("data-defaultindex"));
          //调用结束事件
          if (self.dropCallback) self.dropCallback(isEnter);
        }
      })[0];
    }

    /**
     * 复位动画与状态
     * @return {[type]} [description]
     */

  }, {
    key: "reset",
    value: function reset() {
      var self = this;
      var dragObject;
      if (dragObject = this.dragObject) {
        dragObject.enable();
        if (self.defaultPoint) {
          self.dragElement.css("left", self.defaultPoint.left);
          self.dragElement.css("top", self.defaultPoint.top);
        }
        /*TweenLite.to(self.dragElement, 0, {
            css: {
                x: 0,
                y: 0
            }
        });*/
      }
    }
  }, {
    key: "disable",
    value: function disable() {
      var dragObject;
      if (dragObject = this.dragObject) {
        dragObject.disable();
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.dragObject && this.dragObject.kill();
      this.dropElement = null;
      this.dragElement = null;
      this.dragObject = null;
    }
  }]);
  return _class;
}();

/////////////////
/// tap click
/////////////////
/**
 * ie10下面mouse事件怪异
 * @return {Boolean} [description]
 */
var isIE10 = document.documentMode === 10;

/**
 * 针对canvas模式
 * 特殊的hack
 * 当前点击的元素是滑动元素
 * 处理元素的全局事件
 */
function setCanvasStart(supportSwipe) {
  Xut.Contents.Canvas.Reset();
  Xut.Contents.Canvas.SupportSwipe = supportSwipe;
  Xut.Contents.Canvas.isTap = true;
}

function setCanvasMove() {
  Xut.Contents.Canvas.isSwipe = true;
}

/**
 * 如果是简单的点击事件
 */
function simpleEvent(eventName, eventContext, eventHandle, supportSwipe) {

  //仅仅只是单击处理
  //IE10是不支持touch事件，直接绑定click事件
  var onlyClick = isIE10 || eventName === 'click';
  eventContext = eventContext[0];

  //是否触发
  var hasTap = false;
  //开始坐标
  var startPageX = void 0;

  hasTap = false;

  //这里单独绑定事件有个问题,单击move被触发
  //如果停止e.stopPropagation，那么默认行为就不会被触发
  //你绑定单击的情况下可以翻页
  //这里通过坐标的位置来判断
  var start = function start(e) {
    var point = $event(e);
    //记录开始坐标
    startPageX = point.pageX;
    //是否是tap事件
    hasTap = true;
    setCanvasStart(supportSwipe);
  };

  var move = function move(e) {
    if (!hasTap) {
      return;
    }
    var point = $event(e);
    var deltaX = point.pageX - startPageX;

    //如果有move事件，则取消tap事件
    /*三星S6上就算不移动也会给一个-0.6左右的值，所以这里强制加20PX的判断*/
    if (Math.abs(deltaX) > 10) {
      hasTap = false;
      setCanvasMove(supportSwipe);
    }
  };

  var end = function end() {
    hasTap && eventHandle();
  };

  if (eventName === 'tap') {
    $on(eventContext, {
      start: start,
      move: move,
      end: end,
      cancel: end
    });
  } else if (onlyClick) {
    hasTap = true;
    $on(eventContext, {
      end: end
    });
  }

  return {
    off: function off() {
      if (eventContext) {
        $off(eventContext);
        eventContext = null;
      }
    }
  };
}

/**
 * 优化hammer创建,生成必要配置文件
 * @return {[type]} [description]
 */
function createRecognizers(eventName) {
  var recognizers = [];
  switch (eventName) {
    //如果是swipe处理
    case 'swipeleft':
    case 'swiperight':
    case 'swipeup':
    case 'swipedown':
      var direction = Hammer.DIRECTION_HORIZONTAL;
      if (eventName === 'swipeup' || eventName === "swipedown") {
        direction = Hammer.DIRECTION_VERTICAL;
      }
      recognizers.push([Hammer.Swipe, { 'direction': direction, 'velocity': 0.01 }]);
      break;
    case 'doubletap':
      //双击
      recognizers.push([Hammer.Tap]);
      recognizers.push([Hammer.Tap, { event: 'doubletap', taps: 2 }, ['tap']]);
      break;
    case 'press':
      //长按
      recognizers.push([Hammer.Press]);
      return;
  }
  return recognizers;
}

/**
 * 创建hammer引用
 * @return {[type]}         [description]
 */
function createHammer(eventContext, eventName, supportSwipe) {
  var eventReference;
  var context = eventContext[0];
  var recognizer = createRecognizers(eventName);
  if (recognizer && recognizer.length) {
    eventReference = Hammer(context, {
      'recognizers': recognizer
    });
  } else {
    eventReference = Hammer(context);
  }
  return eventReference;
}

/**
 * 复杂的事件
 * @return {[type]} [description]
 */
function complexEvent(eventContext, eventName, eventHandler, supportSwipe) {
  var eventReference = createHammer(eventContext, eventName, supportSwipe);
  eventReference.on(eventName, function () {
    eventHandler();
  });
  return eventReference;
}

/**
 * ppt事件接口
 *
 * 允许用户自定义其行为
 *     1 支持14种操作行为
 *     2 默认对象都具有滑动翻页的特性
 *     3 翻页的特性在遇到特性的情况可以被覆盖
 *     比如
 *         行为1：用户定义该名字可以支持  click 点击行为， 那么该元素左右滑动能过翻页
 *         行为2：用户如果定义swipeLeft 行为，该元素左右滑动将不会翻页，因为默认翻页已经被覆盖
 *
 * 此接口函数有作用域隔离
 */
/**
 * 事件类型
 * @type {Array}
 * 0 null
 * 1 auto
 * 2 tap
 * 3 drag
 * 4 dragTag
 * .........
 */
var eventName = ['null', 'auto', 'tap', 'drag', 'dragTag', 'swipeleft', 'swiperight', 'swipeup', 'swipedown', 'doubletap', 'press', 'pinchout', 'pinchin', 'rotate', 'assist'];

/**
 * 重写默认事件
 *
 * Content对象默认具有左右翻页的特性
 * 根据过滤来选择是否覆盖重写这个特性
 * 比如 用户如果遇到 swipeLeft，swipeRight 这种本身与翻页行为冲突的
 * 将要覆盖这个行为
 * 过滤事件
 * 如果用户指定了如下操作行为,将覆盖默认的翻页行为
 **/
var filterEvent = ['drag', 'dragTag', 'swipeleft', 'swiperight', 'swipeup', 'swipedown'];

/**
 * 是否过滤
 * @param  {[type]} evtName [description]
 * @return {[type]}         [description]
 */
var isfilter = function isfilter(eventName) {
  return filterEvent.indexOf(eventName) === -1 ? true : false;
};

/**
 * 特性摘除
 * 1 ：无事件，默认可以翻页，还可以切换工具栏
 * 2 ：静态事件，默认可以翻页
 * 3 : 冲突事件，默认删除
 * 去除默认元素具有的翻页特性
 * @param  {[type]} evtName [事件名]
 * @return {[type]}         [description]
 */
var setDefaultBehavior = function setDefaultBehavior(supportSwipe, $contentNode) {
  if (supportSwipe) {
    //静态事件，默认可以翻页，还可以切换工具栏
    $contentNode.attr('data-behavior', 'swipe');
  } else {
    //如果事件存在
    $contentNode.attr('data-behavior', 'disable');
  }
};

/**
 * 针对软件培训的操作行为下光标状态需求
 */
var addCursor = function addCursor(eventName, $contentNode) {
  if ($contentNode) {
    if (!$contentNode.prop('setCursor')) {
      //只设置一次
      if (eventName === ('drag' || 'dragTag')) {
        $contentNode.css('cursor', 'Move');
      } else {
        $contentNode.css('cursor', 'Pointer');
      }
      $contentNode.prop('setCursor', 'true');
    }
  }
};

/**
 *  绑定事件
 * @param  {[type]} eventDrop [description]
 * @param  {[type]} data      [description]
 * @return {[type]}           [description]
 */
var _bind = function _bind(eventDrop, data) {
  var dragObj = void 0;
  var handler = void 0;
  var reference = void 0;
  var eventContext = data.eventContext;
  var eventName = data.eventName;
  var supportSwipe = data.supportSwipe;

  if (eventName === 'drag') {
    //拖动
    dragObj = new _class(eventContext, null, data.parameter, eventDrop.startRun, eventDrop.stopRun);
  } else if (eventName === 'dragTag') {
    //拖拽
    dragObj = new _class(eventContext, data.target, 1, eventDrop.startRun, eventDrop.stopRun);
  } else {
    handler = function handler() {
      data.eventRun.call(eventContext);
    };
    /////////////////
    /// tap click
    /////////////////
    if (eventName === 'tap' || eventName === 'click') {
      reference = simpleEvent(eventName, eventContext, handler, supportSwipe);
    }
    //复杂用hammer
    else {
        reference = complexEvent(eventContext, eventName, handler, supportSwipe);
      }
  }

  return {
    dragObj: dragObj,
    reference: reference,
    handler: handler
  };
};

/**
 * /匹配事件
 * parameter 参数
 * 1：对于自由拖动drag，para参数为0，表示松手后，停留在松手的地方
 *                    para参数为1，表示松手后，返回原来的位置
 * 2: 对于拖拽dragTag， para表示目标对象的target
 */
function distribute(data) {
  //针对软件培训的操作行为下光标状态需求
  Xut.plat.isBrowser && data.domMode && addCursor(data.eventName, data.eventContext);

  //绑定事件
  var eventDrop = data.eventDrop;

  //拖动,引用,回调
  var eventObj = _bind(eventDrop, data);

  //拖动,拖拽对象处理
  if (eventObj.dragObj && eventDrop.init) {
    eventDrop.init(eventObj.dragObj);
    return;
  }
  //其余事件
  data.eventHandler(eventObj.reference, eventObj.handler);
}

//数据库预定义14个事件接口
//提供给content文件
//用于过滤数据库字段指定的行为
//https://github.com/EightMedia/hammer.js/wiki/Getting-Started
//2014.3.18 新增assist 辅助对象事件
function conversionEventType(eventType) {
  return eventName[Number(eventType) - 1] || null;
}

/**
 * 增加默认行为
 */


/**
 * 注册自定义事件
 * this还是引用的当前实例的上下文
 *
 *   '$contentNode'   : 事件对象
 *   'target'    : 目标对象
 *   'parameter' : 拖动参数
 *   'evtName'   : 事件名,
 *
 *   callbackHook 回调函数 ,处理具体的事情
 */
function bindContentEvent(data) {
  //是否支持翻页
  var supportSwipe = data.supportSwipe = isfilter(data.eventName);
  //检测是否移除元素的默认行为,因为元素都具有翻页的特性
  if (data.domMode) {
    setDefaultBehavior(supportSwipe, data.eventContext);
  }
  distribute(data);
}

/**
 * 销毁对象事件
 */
function destroyContentEvent(eventData, eventName) {
  if (eventData.eventReference) {
    eventData.eventReference.off(eventName || eventData.eventName, eventData.eventHandler);
    eventData.eventReference = null;
    eventData.eventHandler = null;
  }
}

/**
 * 多事件模块
 */
/**
 * 获取对应的activity对象
 * @param  {[type]}   activityId [description]
 * @param  {Function} callback   [description]
 * @return {[type]}              [description]
 */
var getActivity = function getActivity(activityId, callback) {
  var activity;
  if (activity = this.activityGroup) {
    _.each(activity.get(), function (contentObj, index) {
      if (activityId == contentObj.activityId) {
        callback(contentObj);
        return;
      }
    }, this);
  }
};

/**
 * 制作一个处理绑定函数
 * @param  {[type]} pagebase [description]
 * @return {[type]}          [description]
 */
var makeRunBinding = function makeRunBinding(pagebase) {
  var registers = this.registers;
  var shift;
  return function () {
    var activityId = registers[0];
    getActivity.call(pagebase, activityId, function (activityObj) {
      activityObj.runAnimation(function () {
        shift = registers.shift();
        registers.push(shift);
      });
    });
  };
};

/**
 * 多事件处理
 * 每次通过同一个热点,触发不同的对象操作
 * @return {[type]} [description]
 */
var combineEvents = function combineEvents(pagebase, eventRelated) {
  var contentObj, eventName;
  //多条activty数据,一个对象上多事件
  _.each(eventRelated, function (edata) {
    _.each(edata, function (scope) {
      contentObj = pagebase.baseGetContentObject(scope.eventContentId);
      if (!contentObj) {
        // console.log('error', 'pagebase.js第' + pagebase.pageIndex + '页多事件处理出错!!!!')
        return;
      }
      eventName = conversionEventType(scope.eventType);
      //制动运行动作
      scope.runAnimation = makeRunBinding.call(scope, pagebase);
      //销毁方法
      scope.destroy = function () {
        destroyContentEvent(scope, eventName);
        scope.registers = null;
        scope.runAnimation = null;
      };

      //事件绑定
      bindContentEvent({
        'eventRun': function eventRun() {
          scope.runAnimation();
        },
        'eventHandler': function eventHandler(eventReference, _eventHandler) {
          scope.eventReference = eventReference;
          scope.eventHandler = _eventHandler;
        },
        'eventContext': contentObj.$contentNode,
        'eventName': eventName,
        'parameter': scope.dragdropPara,
        'target': null,
        'domMode': true
      });
    });

    //暴露引用
    pagebase.divertorHooks.registerEvent = eventRelated;
  });
};

function create(pagebase, eventRelated) {
  combineEvents(pagebase, eventRelated);
}

function destroy(pagebase) {
  var registerEvent = pagebase.divertorHooks.registerEvent;
  if (registerEvent) {
    _.each(registerEvent, function (edata) {
      _.each(edata, function (obj) {
        obj.destroy && obj.destroy();
      });
    });
    pagebase.divertorHooks.registerEvent = null;
  }
}

/**
 * 处理合集
 */
function Collection() {
  this.remove();
}

Collection.prototype = {

  /*加入合集*/
  add: function add(obj) {
    if (!this._group) {
      this._group = [obj];
    } else {
      this._group.push(obj);
    }
  },


  /*得到合集*/
  get: function get() {
    return this._group;
  },


  /**
   * 是否存在
   */
  isExist: function isExist() {
    return this._group.length;
  },

  /**
   * 得到一个指定的实例
   */
  specified: function specified(data) {
    var instance = void 0;
    var length = this._group.length;
    while (length) {
      length--;
      if (instance = this._group[length]) {
        if (instance.type === data.type && instance.id === data.id) {
          return instance;
        }
      }
    }
  },
  remove: function remove() {
    this._group = [];
  },
  reset: function reset() {
    this.remove();
  }
};

/**
 * 根据指定的chpaterId解析
 * @return {[type]} [description]
 */
var scenarioChapter = function scenarioChapter(chapterId) {
  var chapterSection = Xut.data.chapterSection;
  var rang = chapterSection['seasonId->' + chapterId];
  return rang;
};

/**
 * 递归分解
 * chpater直接对应页面的ID编码，直接去下标即可
 * waitCreatePointer     需要分解的页面
 */
var parseChapter = function parseChapter(createPointer) {

  var points = createPointer.length;
  var chapter = void 0,
      key = void 0;
  var dataChpater = Xut.data.Chapter;

  //如果是合集
  if (points) {
    var chapterDataset = [];
    while (points--) {
      key = createPointer[points];
      if (chapter = dataChpater.item(key)) {
        chapterDataset.unshift(chapter);
      }
    }
    return chapterDataset;
  } else {
    //独立的索引号
    return dataChpater.item(createPointer);
  }
};

/**
 * 解析视觉差的数据
 * @param  {[type]}   data     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
var getMasterData = function getMasterData(data, callback) {
  var pptMaster = data['pptMaster'];
  var masterData = Xut.data.query('Master', pptMaster);
  makeActivitys(masterData, function (activitys, autoData) {
    callback(masterData, activitys, autoData);
  });
};

/**
 * 解析出页面自动运行的数据
 * autoplay && !Content
 * @param  {[type]} activitys [description]
 * @return {[type]}           [description]
 */
var makeAuto = function makeAuto(activityData) {

  if (!activityData || !activityData.length) return;

  var sub = void 0;
  //自动热点
  var collectAutoBuffers = [];

  activityData.forEach(function (target, b) {
    //如果是自动播放,并且满足自定义条件
    //并且不是content类型
    if (target.autoPlay && target.actType !== 'Content') {
      //增加note提示信息数据
      // id = target._id
      // key = target.actType ? target.actType + "_" + id : 'showNote_' + id
      sub = {
        'id': target._id,
        'actType': target.actType,
        'category': target.category,
        'autoPlay': target.autoPlay
      };
      collectAutoBuffers.push(sub);
    }
  });

  return collectAutoBuffers.length && collectAutoBuffers;
};

/**
 * 混入shownote
 * 组合showNote数据,弹出信息框,也看作一个热点
 * shownote是chater的信息，混入到activity列表中当作每页的对象处理
 * @return {[type]} [description]
 */
var mixShowNote = function mixShowNote(oneChapter, activityData) {
  if (oneChapter.note) {
    activityData.push(oneChapter);
  }
};

/**
 * 制作activity表的数据
 * chpaters = {
 *     pageIndex-12: Object
 *     pageIndex-13: Object
 *     pageIndex-14: Object
 *  }
 **/
var makeActivitys = function makeActivitys(chapterData, callback) {
  if (!chapterData) callback();

  var activitys = [];
  var chapterId = chapterData._id;

  Xut.data.query('Activity', chapterId, 'chapterId', function (item) {
    activitys.push(item);
  });

  //混入文本提示框
  mixShowNote(chapterData, activitys);

  //自动运行的数据
  //解析出每一页自动运行的 Widget,Action,Video数据
  var autoData = makeAuto(activitys);

  callback(activitys, autoData);
};

/**
 * 解析关联的Activity表数据
 * @param  {[type]}   pageData [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
var getActivitys = function getActivitys(chapterData, callback) {
  makeActivitys(chapterData, function (activitys, autoData) {
    callback(chapterData, activitys, autoData);
  });
};

/**
 * 1 解析chapter页面数据
 * 2 解析对应的Activity数据
 * 3 解析出自动widget数据结构
 * @param  {[type]}   data     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
var getPageData = function getPageData(data, callback) {
  var parsePointer = data.pageIndex;
  var chapterData = data.pageData;
  if (chapterData) {
    getActivitys(chapterData, callback);
  } else {
    //解析章节数据
    parseChapter(parsePointer, function (chapter) {
      //生成chapter数据
      getActivitys(chapter.length ? chapter[0] : chapter, callback);
    });
  }
};

/**
 * 查询接口
 * @param  {[type]}   tableName [description]
 * @param  {[type]}   options   [description]
 * @param  {Function} callback  [description]
 * @return {[type]}             [description]
 */
function query(tableName, options, callback) {
  switch (tableName) {
    case 'page':
      //得到页面关联的数据
      return getPageData(options, callback);
    case 'master':
      //得到母版关联的数据
      return getMasterData(options, callback);
    case 'chapter':
      //得到chapter表数据
      return parseChapter(options);
    case 'scenarioChapter':
      return scenarioChapter(options);
  }
}

/*
更新数据缓存
1 activitys
2 auto
3 activitys
 */
function syncCache(base, callback) {

  var pageType = base.pageType;

  /*缓存数据*/
  var cacheGruop = function cacheGruop(namespace, data) {
    var key = void 0;
    if (!base.dataActionGroup[namespace]) {
      base.dataActionGroup[namespace] = data;
    } else {
      for (key in data) {
        base.dataActionGroup[namespace][key] = data[key];
      }
    }
  };

  query(pageType, {
    'pageIndex': base.chapterIndex,
    'pageData': base.chapterData,
    'pptMaster': base.pptMaster
  }, function (data, activitys, autoData) {
    cacheGruop(pageType, data); //挂载页面容器数据
    cacheGruop('activitys', activitys); //挂载activitys数据
    cacheGruop('auto', autoData); //挂载自动运行数据
    callback(data);
  });
}

/**
 * 解析canvas配置
 * contentMode 分为  0 或者 1
 * 1 是dom模式
 * 0 是canvas模式
 * 以后如果其余的在增加
 * 针对页面chapter中的parameter写入 contentMode   值为 1
 * 针对每一个content中的parameter写入 contentMode 值为 1
 * 如果是canvas模式的时候，同时也是能够存在dom模式是
 * @return {[type]} [description]
 */
function parseContentMode(pageData, base) {
  var parameter = pageData.parameter;
  if (parameter) {
    try {
      parameter = JSON.parse(parameter);
      if (parameter) {
        if (parameter.contentMode && parameter.contentMode == 1) {
          //非强制dom模式
          if (!config.debug.onlyDomMode) {
            //启动dom模式
            base.canvasRelated.enable = true;
          }
        }
        //如果是最后一页处理
        if (parameter.lastPage && base.pageType === 'page') {
          //运行应用运行时间
          base.runLastPageAction = function () {
            var runTime = Number(config.data.delayTime);
            var timeout = void 0;
            if (runTime) {
              timeout = setTimeout(function () {
                Xut.Application.Notify('complete');
              }, runTime * 1000); //转成秒
            }
            return function () {
              //返回停止方法
              if (timeout) {
                clearTimeout(timeout);
                timeout = null;
              }
            };
          };
        }
      }
    } catch (e) {
      console.log('JSON错误,chpterId为', base.chapterId, parameter);
    }
  }
}

/**
 *  创建主容器任务片
 *  state状态
 *      0 未创建
 *      1 正常创建
 *      2 创建完毕
 *      3 创建失败
 */
/**
 * 创建页面容器li
 */
var createHTML = function createHTML(_ref) {
  var base = _ref.base,
      prefix = _ref.prefix,
      translate = _ref.translate,
      customStyle = _ref.customStyle,
      pageData = _ref.pageData,
      background = _ref.background;

  var getStyle = base.getStyle;

  //设置滑动的偏移量
  //双页面只有布局偏移量，没有滑动偏移量
  var setTranslate = translate ? Xut.style.transform + ':' + translate : '';

  //增加一个main-content放body内容
  //增加一个header-footer放溢出的页眉页脚
  return String.styleFormat('<li id="' + prefix + '"\n         data-type="' + base.pageType + '"\n         data-chapter-index="' + base.chapterIndex + '"\n         data-container="true"\n         class="xut-flip preserve-3d"\n         style="width:' + getStyle.visualWidth + 'px;\n                height:' + getStyle.visualHeight + 'px;\n                left:' + getStyle.visualLeft + 'px;\n                top:' + getStyle.visualTop + 'px;\n                ' + setTranslate + ';\n                ' + background + '\n                ' + customStyle + '">\n        <div class="page-scale">\n            <div data-type="main-content"></div>\n            <div data-type="header-footer"></div>\n        </div>\n    </li>');
};

/**
 * 创建父容器li结构
 */
var createContainer = function createContainer(base, pageData, getStyle, prefix) {

  var background = '';

  //chpater有背景，不是svg格式
  if (!/.svg$/i.test(pageData.md5)) {
    background = 'background-image:url(' + getFileFullPath(pageData.md5, 'container-bg') + ');';
  }

  /**
   * 自定义配置了样式
   * 因为单页面跳槽层级的问题处理
   */
  var customStyle = '';
  var userStyle = getStyle.userStyle;
  if (userStyle !== undefined) {
    //解析自定义规则
    _.each(userStyle, function (value, key) {
      customStyle += key + ':' + value + ';';
    });
  }

  return $(createHTML({
    base: base,
    prefix: prefix,
    translate: getStyle.translate,
    customStyle: customStyle,
    pageData: pageData,
    background: background
  }));
};

var TaskContainer = function (base, pageData, taskCallback) {

  var $pageNode = void 0;
  var $pseudoElement = void 0;

  var prefix = Xut.View.GetPageNodeIdName(base.pageType, base.pageIndex, base.chapterId);
  var getStyle = base.getStyle;

  //iboosk编译
  //在执行的时候节点已经存在
  //不需要在创建
  if (Xut.IBooks.runMode()) {
    $pageNode = $("#" + prefix);
    taskCallback($pageNode, $pseudoElement);
    return;
  }

  //创建的flip结构体
  $pageNode = createContainer(base, pageData, getStyle, prefix);

  Xut.nextTick({
    container: base.rootNode,
    content: $pageNode,
    position: getStyle.position === 'left' || getStyle.position === 'top' ? 'first' : 'last'
  }, function () {
    taskCallback($pageNode, $pseudoElement);
  });
};

/**
 *创建浮动相关的信息
 *1 activity
 *2 component
 */
function crateFloat(pageType, pipeData, divertor, baseFloatGroup, complete) {

  /*增加回调次数计算*/
  pipeData.taskCount++;

  var content = [];
  var getStyle = pipeData.getStyle;

  /*activity类型处理*/
  var makePrefix = void 0,
      fragment = void 0,
      zIndex = void 0;
  if (divertor.ids.length) {
    var zIndexs = divertor.zIndex;
    var prefix = 'Content_' + pipeData.chapterIndex + "_";
    //去重复
    divertor.ids = arrayUnique(divertor.ids);
    _.each(divertor.ids, function (id) {
      makePrefix = prefix + id;
      fragment = pipeData.contentsFragment[makePrefix];
      if (fragment) {
        zIndex = zIndexs[id];
        //保证层级关系
        // fragment.style.zIndex = (Number(zIndex) + Number(fragment.style.zIndex))
        content.push(fragment);
        delete pipeData.contentsFragment[makePrefix];
      }
    });
  }

  /*component类型处理*/
  if (divertor.html.length) {
    content = $(divertor.html.join(""));
  }

  //floatPage模式下面
  //如果是当前页面
  //因为会产生三页面并联
  //所以中间去最高层级
  if (pageType === 'page' && getStyle.offset === 0) {
    zIndex = 2001;
  } else {
    zIndex = 2000;
  }

  //浮动根节点
  //floatPage设置的content溢出后处理
  //在非视区增加overflow:hidden
  //可视区域overflow:''
  var overflow = 'overflow:hidden;';

  //如果是母板,排除
  if (pageType === 'master') {
    overflow = '';
  }

  /*浮动容器*/
  var container = void 0;
  if (baseFloatGroup) {
    /*
    在基础的baseFloatGroup中查找是否已经创建过
    容器存在，存在component，在component中已经创建了容器，所以需要复用
    */
    container = baseFloatGroup[pageType + 'Container'];
  }

  /*有可能在competent中已经创建,在content不需要重复创建*/
  if (!container) {
    var id = 'float-' + pageType + '-li-' + pipeData.chapterIndex;
    container = $(String.styleFormat('<ul id="' + id + '"\n         class="xut-float"\n         style="left:' + getStyle.visualLeft + 'px;\n                top:' + getStyle.visualTop + 'px;\n                ' + Xut.style.transform + ':' + getStyle.translate + ';\n                z-index:' + zIndex + ';' + overflow + '">\n       </ul>'));
    $(pipeData.rootNode).after(container);
  }

  /*绘制节点到页面*/
  nextTick({ container: container, content: content }, function () {
    complete(container);
  });
}

/**
 * 任务基类
 * 1 任务检测
 * 2 浮动层处理
 */

var TaskSuper = function () {
  function TaskSuper(detector) {
    classCallCheck(this, TaskSuper);

    //中断检测器
    this.$$detector = detector;
    /*中断队列*/
    this.$$suspendQueues = [];
    /*初始化浮动*/
    this._$$initFloat();
  }

  /*
  初始化浮动页面参数
  私有方法
   */


  createClass(TaskSuper, [{
    key: '_$$initFloat',
    value: function _$$initFloat() {
      var _this = this;

      /*
       1.浮动页面,母板事件引起的层级遮挡问题,用于提升最高
       2.浮动模板,用于实现模板上的事件
       */
      this.$$floatDivertor = {};
      _.each(['page', 'master'], function (type) {
        _this.$$floatDivertor[type] = {
          'ids': [], //content保存合集
          'html': [], //component组件触发点字符串
          'zIndex': {}, //保存索引
          'container': null //浮动容器
        };
      });
    }

    /*
    创建浮动
    1 页面浮动层
    2 母版浮动层
    baseFloatGroup: pagebase中的基础，用来处理是否容器已经创建
     */

  }, {
    key: '_$$createFloatLayer',
    value: function _$$createFloatLayer(complete, pipeData, baseFloatGroup) {
      var _this2 = this;

      var pageDivertor = this.$$floatDivertor.page;
      var masterDivertor = this.$$floatDivertor.master;

      /*结束后清理，因为componnet中的条件会影响activity中的条件判断*/
      var clearDivertor = function clearDivertor(divertor) {
        if (divertor.html.length) {
          divertor.html = null;
        }
      };

      //=====================================
      //  ids 是content的id
      //  html 是component的html字符
      //  2个中有一个存在就需要处理浮动
      //  但是需要注意component在content之前
      //  所以component处理完毕后，要清理html
      //  否则会影响content的判断
      //=====================================

      /*浮动页面对,浮动对象比任何层级都都要高,超过母版*/
      if (pageDivertor.ids.length || pageDivertor.html.length) {
        crateFloat('page', pipeData, pageDivertor, baseFloatGroup, function (container) {
          pageDivertor.container = container;
          _this2.pageBaseHooks.floatPages(pageDivertor);
          clearDivertor(pageDivertor);
          complete();
        });
      }

      /*如果存在母版浮动节点,在创建节点structure中过滤出来，根据参数的tipmost*/
      if (masterDivertor.ids.length || masterDivertor.html.length) {
        crateFloat('master', pipeData, masterDivertor, baseFloatGroup, function (container) {
          masterDivertor.container = container;
          _this2.pageBaseHooks.floatMasters(masterDivertor);
          clearDivertor(masterDivertor);
          complete();
        });
      }
    }

    /*
    检测是否可以运行下一个任务
    1 通过base.detectorTask做的监听，这里的this是pagebase的this
    2 如果检测可以运行直接运行nextTask
    3 如果检测不能运行就会运行suspend 断点
    interrupt 给content使用
     */

  }, {
    key: '_$$checkNextTask',
    value: function _$$checkNextTask(taskName, nextTask, interrupt) {
      var _this3 = this;

      //构建中断方法
      var suspendTask = function suspendTask() {
        _this3.$$suspendQueues.push(function () {
          nextTask();
        });
      };

      //外部检测
      this.$$detector && this.$$detector({
        suspendTask: suspendTask,
        nextTask: nextTask,
        interrupt: interrupt,
        taskName: taskName
      });
    }

    //============================
    //      外部接口
    //============================

    /**
     * 重新运行被阻断的线程任务
     */

  }, {
    key: 'rerunTask',
    value: function rerunTask() {
      if (this.$$suspendQueues && this.$$suspendQueues.length) {
        var task = void 0;
        if (task = this.$$suspendQueues.pop()) {
          task();
        }
        this.$$suspendQueues = [];
      }
    }

    /*
    销毁任务
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      if (this._destroy) {
        this._destroy();
      }
      this.$$detector = null;
      this.$$suspendQueues = null;
    }
  }]);
  return TaskSuper;
}();

var maskBoxImage = Xut.style.maskBoxImage;

/**
 * 修正尺寸
 * @return {[type]} [description]
 */
var setDataSize = function setDataSize(data) {
  //缩放比
  var proportion = config.proportion;

  if (data.imageWidth) {
    data.imageWidth = data.imageWidth * proportion.width;
  }
  if (data.imageHeight) {
    data.imageHeight = data.imageHeight * proportion.height;
  }
  if (data.imageLeft) {
    data.imageLeft = data.imageLeft * proportion.left;
  }
  if (data.imageTop) {
    data.imageTop = data.imageTop * proportion.top;
  }
};

/**
 * 计算出对页排版偏移值
 * @return {[type]} [description]
 */
var getOffset = function getOffset(pageSide) {
  var background = void 0;
  switch (Number(pageSide)) {
    case 1:
      background = 'background-position:0';
      break;
    case 2:
      background = 'background-position:' + config.screenSize.width + 'px';
      break;
  }
  return background;
};

/**
 * 创建分层背景图层
 * [createMaster description]
 * @param  {[type]} svgContent [description]
 * @param  {[type]} data       [description]
 * @return {[type]}            [description]
 */
function createBackground(svgContent, data) {

  var imageLayer,
      maskLayer,
      imageLayerData = data.imageLayer,
      //图片层
  imageMaskData = data.imageMask,
      //蒙版层
  backImageData = data.backImage,
      //真实图片层
  backMaskData = data.backMask,
      //真实蒙版层
  masterData = data.master,
      //母板
  backText = data.md5,
      //背景文字
  pptMaster = data.pptMaster; //母板PPTID

  /**
   * 未分层结构
   * 只有SVG数据，没有层次数据 ,不是视觉差
   * @return {[type]}          [description]
   */
  if (backText && !masterData && !pptMaster && !imageLayerData && !backImageData) {
    return svgContent ? String.styleFormat('<div data-multilayer ="true"class="multilayer"> ' + svgContent + ' </div>') : '';
  }

  /**
   * 分层结构
   * 1 分母板 文字层 背景 蒙版
   * 2 视觉差分层处理
   */

  /**
   * 修正尺寸
   */
  setDataSize(data);

  /**
   * 母版图
   * 如果有母板数据,如果不是视觉差
   * @return {[type]} [description]
   */
  var masterHTML = '';
  if (masterData && !pptMaster) {
    masterHTML = '<div class="multilayer-master" style="background-image:url(' + getFileFullPath(masterData, 'multilayer-master') + ')"></div>';
  }

  /**
   * 存在背景图
   * @return {[type]}
   */
  var maskHTML = '';
  if (imageLayerData) {
    //蒙版图（与背景图是组合关系）
    var _maskLayer = data.imageMask ? maskBoxImage + ":url(" + getFileFullPath(data.imageMask, 'multilayer-maskLayer') + ");" : "";
    var maskImage = getFileFullPath(imageLayerData, 'multilayer-maskImage');
    maskHTML = '<div class="multilayer-imageLayer"\n            style="width:' + data.imageWidth + 'px;\n                   height:' + data.imageHeight + 'px;\n                   top:' + data.imageTop + 'px;\n                   left:' + data.imageLeft + 'px;\n                   background-image:url(' + maskImage + ');' + _maskLayer + '">\n       </div>';
  }

  /**
   * 新增的 真实背景图 默认全屏
   * @return {[type]
   */
  var backImageHTML = '';
  if (backImageData) {
    //计算出对页排版偏移值
    var backImageOffset = getOffset(data.pageSide);
    var backImagePosition = backImageOffset ? backImageOffset : '';
    var newWidth = backImageOffset ? '200%' : '100%';
    var newBackImage = getFileFullPath(backImageData, 'multilayer-backImage');
    var newBackMask = getFileFullPath(backMaskData, 'multilayer-backMask');
    if (backMaskData) {
      //带蒙版
      if (maskBoxImage != undefined) {
        backImageHTML = '<div class="multilayer-backImage"\n                style="width:' + newWidth + ';\n                       background-image:url(' + newBackImage + ');\n                       ' + maskBoxImage + ':url(' + newBackMask + ');\n                       ' + backImagePosition + '">\n           </div>';
      } else {
        //无蒙版
        backImageHTML = '<canvas class="multilayer-backImage edges"\n                   height=' + document.body.clientHeight + '\n                   width=' + document.body.clientWidth + '\n                   src=' + newBackImage + '\n                   mask=' + newBackMask + '\n                   style="width:' + newWidth + ';\n                          opacity:0;\n                          ' + maskBoxImage + ':url(' + newBackImage + ');\n                          ' + backImagePosition + '">\n           </canvas>';
      }
    } else {
      //图片层
      backImageHTML = '<div class="multilayer-backImage"\n                            style="width:' + newWidth + ';\n                                   background-image:url(' + newBackImage + ');\n                                   ' + backImagePosition + '">\n                       </div>';
    }
  }

  /*存在svg文字*/
  var backTextHTML = backText ? '<div class="multilayer-word"> ' + svgContent + ' </div>' : '';

  /*组层背景图开始*/
  return String.styleFormat('<div data-multilayer ="true"\n          class="multilayer">\n        ' + masterHTML + '\n        ' + maskHTML + '\n        ' + backImageHTML + '\n        ' + backTextHTML + '\n    </div>');
}

/**
 * 解析背景内容
 */
var parseContent = function parseContent(content, callback) {
  //背景是svg文件
  if (/.svg$/i.test(content)) {
    readFileContent(content, function (svgContent) {
      callback(svgContent);
    });
  } else {
    callback('');
  }
};

/**
 * 构建背景类
 * @param {[type]} $containsNode         [根节点]
 * @param {[type]} data                 [数据]
 * @param {[type]} suspendCallback      [中断回调]
 * @param {[type]} successCallback      [description]
 */

var TaskBackground = function (_TaskSuper) {
  inherits(TaskBackground, _TaskSuper);

  function TaskBackground(data, $containsNode, success, detector) {
    classCallCheck(this, TaskBackground);

    var _this = possibleConstructorReturn(this, (TaskBackground.__proto__ || Object.getPrototypeOf(TaskBackground)).call(this, detector));

    var self = _this;
    var content = data.md5;

    _this.success = success;

    //iboosk节点预编译
    //在执行的时候节点已经存在
    //不需要在创建
    if (Xut.IBooks.runMode()) {
      //找到背景节点
      // var $element = $containsNode.find('.multilayer');
      success();
      return possibleConstructorReturn(_this);
    }

    //背景是否需要SVG解析
    parseContent(content, function (svgContent) {
      svgContent = replacePath(svgContent);
      var htmlstr = createBackground(svgContent, data);
      if (htmlstr) {
        svgContent = null;
        self._checkNextTask($(htmlstr), $containsNode);
      } else {
        success();
      }
    });
    return _this;
  }

  /**
   * 检测下一个任务
   */


  createClass(TaskBackground, [{
    key: '_checkNextTask',
    value: function _checkNextTask($background, $containsNode) {
      var _this2 = this;

      this._$$checkNextTask('内部background', function () {
        _this2._render($background, $containsNode);
      });
    }

    /*渲染页面*/

  }, {
    key: '_render',
    value: function _render(content, container) {
      var _this3 = this;

      Xut.nextTick({ content: content, container: container }, function () {
        _this3.destroy();
        _this3.success();
      });
    }
  }]);
  return TaskBackground;
}(TaskSuper);

/*****************
 文字特效
 https://tympanus.net/codrops/2016/10/18/inspiration-for-letter-effects/
******************/

var LetterEffect = function () {

  /**
   * 文本节点
   * 编号
   * @param  {[type]} node   [description]
   * @param  {[type]} serial [description]
   * @return {[type]}        [description]
   */
  function LetterEffect(contentId) {
    classCallCheck(this, LetterEffect);

    this.contentId = contentId;
    this.queueLength = 0;
    this.queueIndex = 0;
    this.fxQueue = [];
  }

  /**
   * 执行队列动画
   */


  createClass(LetterEffect, [{
    key: '_makeFn',
    value: function _makeFn(node, serial) {
      var text = new TextFx(node);
      return function (fn) {
        text.show('fx' + serial, fn);
      };
    }

    /**
     * 加入队列
     */

  }, {
    key: 'addQueue',
    value: function addQueue(node, serial) {
      this.queueLength++;
      this.fxQueue.push('fx' + serial, new TextFx(node));
    }
  }, {
    key: '_animate',
    value: function _animate(action) {
      var _this = this;

      var fxName = this.fxQueue[this.queueIndex];
      var fxObj = this.fxQueue[++this.queueIndex];
      if (fxName && fxObj) {
        fxObj[action](fxName, function () {
          ++_this.queueIndex;
          _this._animate(action);
        });
      }
    }

    /**
     * 运行动画
     * @return {[type]} [description]
     */

  }, {
    key: 'play',
    value: function play() {
      this.queueIndex = 0;
      this._animate('show');
    }

    /**
     * 停止动画
     * @return {[type]} [description]
     */

  }, {
    key: 'stop',
    value: function stop() {}

    /**
     * 销毁动画
     * @return {[type]} [description]
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      // console.log(this)
    }
  }]);
  return LetterEffect;
}();

///////////////////////////
///    文本特效
//////////////////////////

function textFx(pipeData, textFx) {

  var uuid = 1;
  var content = void 0;
  var contentNode = void 0;
  var parentNodes = []; //收集父节点做比对
  var group = {};
  var textfxNodes = void 0;
  var parentNode = void 0;

  //文本特效对象
  var textFxObjs = {};

  while (content = textFx.shift()) {
    if (contentNode = pipeData.contentsFragment[content.texteffectId]) {
      (function () {
        var contentId = content._id;

        //初始化文本对象
        textFxObjs[contentId] = new LetterEffect(contentId);
        textfxNodes = contentNode.querySelectorAll('a[data-textfx]');

        if (textfxNodes.length) {
          textfxNodes.forEach(function (node) {
            //如果是共享了父节点
            parentNode = node.parentNode;
            if (-1 != parentNodes.indexOf(parentNode)) {
              group[parentNode.textFxId].push(node);
            } else {
              parentNode.textFxId = uuid;
              group[uuid] = [];
              group[uuid++].push(node);
            }
            parentNodes.push(parentNode);
            textFxObjs[contentId].addQueue(node, node.getAttribute('data-textfx'));
          });
        }
      })();
    }
  }

  return textFxObjs;
}

/**
 * 横版委托
 * 横版状态下，如果iscroll是Y轴滚动
 */


/**
 * 竖版委托
 * 上下滑动的时候，可以翻页
 * @return {[type]} [description]
 */
function delegateScrollY(node, options) {

  _.extend(options, {
    stopPropagation: true,
    preventDefault: false,
    bounce: false,
    probeType: 2
  });

  var iscroll = new iScroll(node, options);

  /*如果是边界翻页*/
  var hasBorderRun = false;
  iscroll.on('beforeScrollStart', function (e) {
    hasBorderRun = false;
  });

  /**
   * directionY
   *   1 向后
   *   -1 向前
   */
  iscroll.on('scroll', function (e) {
    /*探测下全局是否可以滑动了*/
    if (Xut.View.HasEnabledSwiper()) {
      if (iscroll.directionY === -1 && iscroll.startY === 0) {
        hasBorderRun = true;
        /*top*/
        Xut.View.SetSwiperMove({
          action: 'flipMove',
          direction: 'prev',
          distance: iscroll.distY - 10,
          speed: 0
        });
      } else if (iscroll.directionY === 1 && iscroll.startY === iscroll.maxScrollY) {
        /*down*/
        hasBorderRun = true;
        Xut.View.SetSwiperMove({
          action: 'flipMove',
          direction: 'next',
          distance: iscroll.distY + 10,
          speed: 0
        });
      } else {
        /**
         * 内部滑动
         */
        iscroll._execEvent('scrollContent', e);
      }
    }
  });

  iscroll.on('scrollEnd', function (e) {
    if (hasBorderRun) {
      var typeAction = Xut.View.GetSwiperActionType(0, iscroll.distY, iscroll.endTime - iscroll.startTime, 'v');
      if (typeAction === 'flipOver') {
        if (iscroll.directionY === 1) {
          Xut.View.GotoNextSlide();
          iscroll._execEvent('scrollExit', 'down');
        } else if (iscroll.directionY === -1) {
          Xut.View.GotoPrevSlide();
          iscroll._execEvent('scrollExit', 'up');
        }
      } else if (typeAction === 'flipRebound') {
        if (iscroll.directionY === 1) {
          Xut.View.SetSwiperMove({
            action: 'flipRebound',
            direction: 'next',
            distance: 0,
            speed: 300
          });
        } else if (iscroll.directionY === -1) {
          Xut.View.SetSwiperMove({
            action: 'flipRebound',
            direction: 'prev',
            distance: 0,
            speed: 300
          });
        }
      }
    }
  });

  return iscroll;
}

/*
 封装插件iScroll,代理委托页面滑动处理了
 1 横版模式下，竖版滑动iscroll 不处理，(上下滑动，左右全局翻页)
 2 竖版模式下，竖版滑动iscroll 需要处理，竖版边界要翻页
*/
function IScroll(node, options, delegate) {

  ///////////////////////////////
  /// 竖版禁止上下滑动的冒泡，并且不是强制的横屏滑动模式
  ///////////////////////////////
  if (delegate && config.launch.scrollMode === 'v') {
    /*如果是竖版滑动，那么就需要代理下，竖版滑动后，上下翻页*/
    if (!options.scrollX || options.scrollY) {
      return new delegateScrollY(node, options);
    }
  }

  ///////////////////////////////
  /// 启动委托
  /// 启动代码追踪swipe的情况下
  /// 那么停掉事件冒泡，否则滑动会触发
  ///////////////////////////////
  // if (delegate && config.launch.scrollMode === 'h') {
  /*默认参数：横版，上下滑动, 代理左右*/
  // if (options.scrollX === undefined && options.scrollY === undefined || options.scrollY === true) {
  // return new delegateScrollX(node, options)
  // }
  // }

  // if (config.hasTrackCode('swipe')) {
  //   /*启动事件追踪，需要禁止左右默认的左右翻页*/
  //   options.stopPropagation = true
  //   return new iScroll(node, options)
  // }

  return new iScroll(node, options);
}

/**
 * html文本框
 * @param  {[type]} ){} [description]
 * @return {[type]}       [description]
 */

var docElement = document.documentElement;

//默认字体
var defaultFontSize = void 0;

try {
  defaultFontSize = parseInt(getComputedStyle(docElement).fontSize);
} catch (er) {
  defaultFontSize = 16;
}

//新的字体大小
var newFontSize = void 0;

var whiteObject = {
  "rgb(255, 255, 255)": true,
  "#ffffff": true,
  "#FFFFFF": true,
  "#fff": true,
  "#FFF": true
};

/**
 * 字体大小
 * @type {Array}
 */
var sizeArray = ["1", "1.5", "2.0"];

var getFontSize = function getFontSize() {
  newFontSize = defaultFontSize * config.proportion.width;
  return [Math.floor(newFontSize * 1.5), Math.floor(newFontSize * 2.0), Math.floor(newFontSize * 2.5)];
};

/**
 * 工具栏布局
 * @return {[type]} [description]
 */
function toolBar(fontSize) {
  var baseValue1 = fontSize[0];
  var baseValue2 = fontSize[1];
  var baseValue3 = fontSize[2];
  var boxHTML = '<div class="htmlbox_close_container">\n            <a class="htmlbox_close"></a>\n        </div>\n        <ul class="htmlbox_fontsizeUl">\n            <li>\n                <a class="htmlbox_small"\n                   style="width:' + baseValue1 + 'px;height:' + baseValue1 + 'px;margin-top:-' + baseValue1 / 2 + 'px"></a>\n            </li>\n            <li>\n                <a class="htmlbox_middle"\n                   style="width:' + baseValue2 + 'px;height:' + baseValue2 + 'px;margin-top:-' + baseValue2 / 2 + 'px"></a></li>\n            <li>\n                <a class="htmlbox_big"\n                   style="width:' + baseValue3 + 'px;height:' + baseValue3 + 'px;margin-top:-' + baseValue3 / 2 + 'px"></a>\n            </li>\n        </ul>';

  return String.styleFormat(boxHTML);
}

/**
 * 创建盒子容器
 * @return {[type]} [description]
 */
function createWapper(boxHeight, context, iscrollName, textContent) {
  var wapper = '<div class="htmlbox-container">\n            <div class="htmlbox-toolbar" style="height:' + boxHeight + 'px;line-height:' + boxHeight + 'px;">' + context + '</div>\n            <div class="' + iscrollName + '" style="overflow:hidden;position:absolute;width:100%;height:92%;">\n                <ul>' + textContent + '</ul>\n            </div>\n        </div>';
  return String.styleFormat(wapper);
}

var HtmlBox = function () {
  function HtmlBox(contentId, $contentNode) {
    classCallCheck(this, HtmlBox);


    this.contentId = contentId;
    this.$contentNode = $contentNode;

    var self = this;

    //事件对象引用
    var eventHandler = function eventHandler(eventReference, _eventHandler) {
      self.eventReference = eventReference;
      self.eventHandler = _eventHandler;
    };

    //绑定点击事件
    bindContentEvent({
      'eventRun': function eventRun() {
        Xut.View.HideToolBar('pageNumber');
        self._init(contentId, $contentNode);
      },
      'eventHandler': eventHandler,
      'eventContext': $contentNode,
      'eventName': "tap",
      'domMode': true
    });
  }

  createClass(HtmlBox, [{
    key: '_init',
    value: function _init(contentId, $contentNode) {
      var self = this;

      self._adjustColor();

      //移除偏移量 存在偏移量造成文字被覆盖
      var textContent = $contentNode.find(">").html();
      textContent = textContent.replace(/translate\(0px, -\d+px\)/g, 'translate(0px,0px)');

      var iscrollName = "htmlbox-iscroll-" + contentId;

      //缓存名
      this.storageName = iscrollName + config.data.appId;

      var fontSize = getFontSize();

      //工具栏的高度必须大于最大的字体大小
      var boxHeight = fontSize[2] + 2;
      //关闭按钮的top值
      var closeTop = Math.floor(boxHeight / 2);

      //获取保存的字体值
      var initValue = $getStorage(this.storageName);
      if (initValue) {
        this._adjustSize(initValue);
      } else {
        //默认
        this._adjustSize(newFontSize);
      }

      /**
       * 创建容器
       * @type {[type]}
       */
      this.$htmlbox = $(createWapper(boxHeight, toolBar(fontSize), iscrollName, textContent));

      $contentNode.after(this.$htmlbox);

      //修改::before ::after伪元素top值 确保关闭按钮垂直居中
      document.styleSheets[0].addRule('.htmlbox_close::before', 'top:' + closeTop + 'px');
      document.styleSheets[0].insertRule('.htmlbox_close::before { top:' + closeTop + 'px }', 0);
      document.styleSheets[0].addRule('.htmlbox_close::after', 'top:' + closeTop + 'px');
      document.styleSheets[0].insertRule('.htmlbox_close::after { top:' + closeTop + 'px }', 0);

      //修正htmlbox位置
      this._relocateToolbar(iscrollName);
      //卷滚
      this._createIscroll(this.$htmlbox, iscrollName);

      /**
       * 绑定事件上下文呢
       * @type {[type]}
       */
      this.eventContext = this.$htmlbox.find('.htmlbox-toolbar')[0];

      /**
       * 改变字体与刷新卷滚
       * @param  {[type]} fontsize [description]
       * @return {[type]}          [description]
       */
      var change = function change(fontsize) {
        self._adjustSize(fontsize * newFontSize, true);
        self.iscroll && self.iscroll.refresh();
      };

      /**
       * 关闭
       * @return {[type]} [description]
       */
      var colse = function colse() {
        self._restoreColor();

        //还原跟字体大小
        self._adjustSize(defaultFontSize);
        self.removeBox();
        Xut.View.ShowToolBar('pageNumber');
      };

      //处理器
      var process = {
        htmlbox_close_container: colse,
        htmlbox_close: colse,
        htmlbox_small: function htmlbox_small() {
          change(sizeArray[0]);
        },
        htmlbox_middle: function htmlbox_middle() {
          change(sizeArray[1]);
        },
        htmlbox_big: function htmlbox_big() {
          change(sizeArray[2]);
        }
      };

      $on(this.eventContext, {
        start: function start(e) {
          var className = e.target.className;
          process[className] && process[className]();
        }
      });
    }

    /**
     * 遍历p span文字标签 调整字体颜色
     * @return {[type]} [description]
     */

  }, {
    key: '_adjustColor',
    value: function _adjustColor() {
      this.textLabelArray = ['p', 'span'];
      var self = this;
      _.each(self.textLabelArray, function (text) {
        _.each(self.$contentNode.find(text), function (el) {
          var formerColor = getComputedStyle(el).color;
          //若字体颜色为白色 调整为黑色
          if (whiteObject.hasOwnProperty(formerColor)) {
            el.hasFormerColor = true;
            el.style.color = "black";
          }
        });
      });
    }

    /**
     * 调整字体大小
     * @return {[type]} [description]
     */

  }, {
    key: '_adjustSize',
    value: function _adjustSize(value, save) {
      value = parseInt(value);
      docElement.style.fontSize = value + 'px';
      save && $setStorage(this.storageName, value);
    }

    /**
     * 恢复放大过的字体颜色
     * @return {[type]} [description]
     */

  }, {
    key: '_restoreColor',
    value: function _restoreColor() {
      var self = this;
      _.each(self.textLabelArray, function (text) {
        _.each(self.$contentNode.find(text), function (el) {
          //将字体由黑色恢复为白色
          if (el.hasFormerColor) {
            el.style.color = "white";
            el.hasFormerColor = false;
          }
        });
      });
    }

    /**
     * 修正htmlbox位置
     * @param  {[type]} iscrollName [description]
     * @return {[type]}             [description]
     */

  }, {
    key: '_relocateToolbar',
    value: function _relocateToolbar(iscrollName) {
      //修正模式2下屏幕溢出高度
      var visualSize = config.visualSize;
      var left = visualSize.overflowWidth && Math.abs(visualSize.left) || 0;
      var top = visualSize.overflowHeight && Math.abs(visualSize.top) || 0;
      this.$htmlbox[0].style.cssText += "margin-top:" + top + "px";

      //修正模式3下屏幕溢出宽度
      //1.修正关闭按钮::before ::after伪元素left值 确保关闭按钮水平居中
      //首先恢复到最开始的left:2%状态
      document.styleSheets[0].addRule('.htmlbox_close::before', 'left:2%');
      document.styleSheets[0].insertRule('.htmlbox_close::before { left:2% }', 0);
      document.styleSheets[0].addRule('.htmlbox_close::after', 'left:2%');
      document.styleSheets[0].insertRule('.htmlbox_close::after { left:2% }', 0);
      var formerLeft = window.getComputedStyle(this.$htmlbox.find('.htmlbox_close')[0], '::before').getPropertyValue('left');
      var currentLeft = parseInt(formerLeft) + left;

      //开始修正
      document.styleSheets[0].addRule('.htmlbox_close::before', 'left:' + currentLeft + 'px');
      document.styleSheets[0].insertRule('.htmlbox_close::before { left:' + currentLeft + 'px }', 0);
      document.styleSheets[0].addRule('.htmlbox_close::after', 'left:' + currentLeft + 'px');
      document.styleSheets[0].insertRule('.htmlbox_close::after { left:' + currentLeft + 'px }', 0);
      //2.修正字体放大ul按钮
      this.$htmlbox.find(".htmlbox_fontsizeUl")[0].style.cssText += "margin-right:" + left + "px";
      //3.修正文本框
      this.$htmlbox.find("." + iscrollName)[0].style.cssText += "margin-left:" + left + "px;";
      var formerScrollWidth = window.getComputedStyle(this.$htmlbox.find("." + iscrollName)[0]).getPropertyValue('width');

      var currentScrollWidth = parseInt(formerScrollWidth) - 2 * left;

      this.$htmlbox.find("." + iscrollName).width(currentScrollWidth);
    }

    /**
     * 卷滚
     * @param  {[type]} iscrollName [description]
     * @return {[type]}             [description]
     */

  }, {
    key: '_createIscroll',
    value: function _createIscroll($htmlbox, iscrollName) {
      var ulHeight = $htmlbox.find('.' + iscrollName + ' >ul').css('height');
      var htmlboxHeight = $htmlbox.find('.' + iscrollName).css('height');

      //溢出，增加卷滚
      if (parseInt(ulHeight) > parseInt(htmlboxHeight)) {
        this.iscroll = IScroll("." + iscrollName, {
          scrollbars: 'custom',
          fadeScrollbars: true
        });
      }
    }

    /**
     * 移除盒子
     * @return {[type]} [description]
     */

  }, {
    key: 'removeBox',
    value: function removeBox() {
      if (this.eventContext) {
        $off(this.eventContext);
        this.eventContext = null;
      }
      this.$htmlbox && this.$htmlbox.remove();
      if (this.iscroll) {
        this.iscroll.destroy();
        this.iscroll = null;
      }
    }

    /**
     * 销毁
     * @return {[type]} [description]
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      _.each(this.eventReference, function (off) {
        off("tap");
      });
      this.removeBox();
    }
  }]);
  return HtmlBox;
}();

/**
 * 文本框
 */
var textBoxMixin = function (activitProto) {

  /**
   * 检测是HTML文本框处理
   * @return {[type]} [description]
   */
  activitProto._htmlTextBox = function () {
    var self = this;
    var relatedData = this.relatedData;
    var contentHtmlBoxIds = relatedData.contentHtmlBoxIds;
    var contentId;
    var contentName;
    var $contentNode;
    //文本框实例对象
    //允许一个activity有多个
    this.htmlBoxInstance = [];

    //创建文本框对象
    if (contentHtmlBoxIds.length && relatedData.contentDataset) {
      _.each(relatedData.contentDataset, function (data) {
        if (~contentHtmlBoxIds.indexOf(data._id)) {
          contentId = data._id;
          contentName = self.makePrefix('Content', self.chapterIndex, contentId);
          //找到对应绑定事件的元素
          $contentNode = self.getContextNode(contentName);
          if (!$contentNode.attr("data-htmlbox")) {
            //构建html文本框对象
            self.htmlBoxInstance.push(new HtmlBox(contentId, $contentNode));
            //增加htmlbox标志去重
            //多个actictiy共享问题
            $contentNode.attr("data-htmlbox", "true");
          }
        }
      });
    }
  };
};

/**
 * 书签栏
 * 加入这个书签功能后，可以让用户自由选择哪页是需要保存记录的
 * @param options object
 * @example {parent:页面容器,pageId:chapterId,seasonId:seasionId}
 */
var icons = {
  hide: 'images/icons/arrowDown.svg'
};
var sLineHeiht = parseInt($('body').css('font-size')) || 16;
var BOOKCACHE; //书签缓存

function BookMark(options) {
  this.parent = options.parent;
  this.pageId = options.pageId;
  this.seasonId = options.seasonId;
  //是否已存储
  this.isStored = false;
  this.init();
}

/**
 * 初始化
 * @return {[type]} [description]
 */
BookMark.prototype.init = function () {
  var $bookMark = this.createBookMark(),
      that = this;

  this.parent.append($bookMark);
  this.bookMarkMenu = $bookMark.eq(0);
  //显示书签
  setTimeout(function () {
    that.restore();
  }, 20);
  //获取历史记录
  BOOKCACHE = this.getHistory();

  //邦定用户事件
  $on(this.parent, {
    end: this,
    cancel: this
  });
};

/**
 * 创建书签
 * @return {[object]} [jquery生成的dom对象]
 */
BookMark.prototype.createBookMark = function () {

  var sHeight = Xut.config.visualSize.height;

  var height = sLineHeiht * 3,
      // menu的高为3em
  box = '<div class="xut-bookmark-menu" style="width:100%;height:{0}px;left:0;top:{1}px;">' + '<div class="xut-bookmark-wrap">' + '<div class="xut-bookmark-add">加入书签</div>' + '<div class="xut-bookmark-off" style="background-image:url({2})"></div>' + '<div class="xut-bookmark-view">书签记录</div>' + '</div>' + '</div>' + '<div class="xut-bookmark-list" style="display:none;width:100%;height:{3}px;">' + '<ul class="xut-bookmark-head">' + '<li class="xut-bookmark-back">返回</li>' + '<li>书签</li>' + '</ul>' + '<ul class="xut-bookmark-body"></ul>' + '</div>';
  box = String.format(box, height, sHeight, icons.hide, sHeight);
  this.markHeight = height;
  return $(box);
};

/**
 * 生成书签列表
 * @return {[type]} [description]
 */
BookMark.prototype.createMarkList = function () {
  var tmp,
      seasonId,
      pageId,
      list = '',
      self = this;

  //取历史记录
  _.each(BOOKCACHE, function (mark) {
    tmp = mark.split('-');
    seasonId = tmp[0];
    pageId = tmp[1];
    mark = self.getMarkId(seasonId, pageId);
    list += '<li><a data-mark="' + mark + '" class="xut-bookmark-id" href="javascript:0">第' + pageId + '页</a><a class="xut-bookmark-del" data-mark="' + mark + '" href="javascript:0">X</a></li>';
  });

  return list;
};

/**
 * 创建存储标签
 * 存储格式 seasonId-pageId
 * @return {string} [description]
 */
BookMark.prototype.getMarkId = function (seasonId, pageId) {
  return seasonId + '-' + pageId;
};

/**
 * 获取历史记录
 * @return {[type]} [description]
 */
BookMark.prototype.getHistory = function () {
  var mark = $getStorage('bookMark');
  if (mark) {
    return mark.split(',');
  }
  return [];
};

/**
 * 添加书签
 * @return {[type]} [description]
 */
BookMark.prototype.addBookMark = function () {
  var key;

  this.updatePageInfo();
  key = this.getMarkId(this.seasonId, this.pageId);

  //避免重复缓存
  if (BOOKCACHE.indexOf(key) > -1) {
    return;
  }
  BOOKCACHE.push(key);
  $setStorage('bookMark', BOOKCACHE);
};

/**
 * 更新页信息
 *  针对母板层上的书签
 */
BookMark.prototype.updatePageInfo = function () {
  var pageData = Xut.Presentation.GetPageData();
  this.pageId = pageData._id;
  this.seasonId = pageData.seasonId;
};

/**
 * 删除书签
 * @param {object} [key] [事件目标对象]
 * @return {[type]} [description]
 */
BookMark.prototype.delBookMark = function (target) {
  if (!target || !target.dataset) return;

  var key = target.dataset.mark,
      index = BOOKCACHE.indexOf(key);

  BOOKCACHE.splice(index, 1);
  $setStorage('bookMark', BOOKCACHE);

  if (BOOKCACHE.length == 0) {
    $removeStorage('bookMark');
  }

  //移除该行
  $(target).parent().remove();
};

/**
 * 显示书签
 * @param {object} [target] [事件目标对象]
 * @return {[type]} [description]
 */
BookMark.prototype.viewBookMark = function (target) {
  var $bookMarkList,
      list = this.createMarkList();

  if (this.bookMarkList) {
    $bookMarkList = this.bookMarkList;
  } else {
    $bookMarkList = $(target).parent().parent().next();
  }
  //更新书签内容
  $bookMarkList.find('.xut-bookmark-body').html(list);
  this.bookMarkList = $bookMarkList;
  $bookMarkList.fadeIn();
};

/**
 * 点击放大效果
 * @param  {[object]} target [事件目标对象]
 * @return {[type]}      [description]
 */
BookMark.prototype.iconManager = function (target) {
  var $icon = this.bookMarkIcon = $(target),
      restore = this.iconRestore;
  $icon.css({
    'transform': 'scale(1.2)',
    'transition-duration': '500ms'
  })[0].addEventListener(Xut.style.transitionEnd, restore.bind(this), false);
};

/**
 * 复原按钮
 * @return {[type]} [description]
 */
BookMark.prototype.iconRestore = function () {
  this.bookMarkIcon.css('transform', '');
};

/**
 * 跳转到书签页
 * @param  {[type]} target [description]
 * @return {[type]}        [description]
 */
BookMark.prototype.goBookMark = function (target) {
  if (!target || !target.dataset) return;

  var key = target.dataset.mark.split('-'),
      seasonId = Number(key[0]),
      pageId = Number(key[1]);

  this.updatePageInfo();
  //关闭书签列表
  this.backBookMark();

  //忽略当前页的跳转
  if (this.pageId == pageId && this.seasonId == seasonId) {
    return;
  }

  Xut.View.LoadScenario({
    'seasonId': seasonId,
    'chapterId': pageId
  });
};

/**
 * 书签回退键
 * @return {[type]} [description]
 */
BookMark.prototype.backBookMark = function () {
  this.bookMarkList.fadeOut();
};

/**
 * 邦定事件
 * @param  {[type]} evt [事件]
 * @return {[type]}     [description]
 */
BookMark.prototype.handleEvent = function (evt) {
  var target = evt.target;
  switch (target.className) {
    //加入书签
    case 'xut-bookmark-add':
      this.addBookMark();
      this.iconManager(target);
      break;
    //显示书签记录
    case 'xut-bookmark-view':
      this.viewBookMark(target);
      this.iconManager(target);
      break;
    //关闭书签
    case 'xut-bookmark-off':
      this.closeBookMark(target);
      break;
    //返回书签主菜单
    case 'xut-bookmark-back':
      this.backBookMark();
      break;
    //删除书签记录
    case 'xut-bookmark-del':
      this.delBookMark(target);
      break;
    //跳转到书签页
    case 'xut-bookmark-id':
      this.goBookMark(target);
      break;
    default:
      //console.log(target.className)
      break;
  }
};

/**
 * 关闭书签菜单
 * @return {[type]} [description]
 */
BookMark.prototype.closeBookMark = function () {

  Xut.style.setTranslate({
    node: this.bookMarkMenu,
    speed: 1000
  });
};

/**
 * 恢复书签菜单
 */
BookMark.prototype.restore = function () {
  Xut.style.setTranslate({
    y: -this.markHeight,
    node: this.bookMarkMenu,
    speed: 1000
  });
};

/**
 * 销毁书签
 * @return {[type]} [description]
 */
BookMark.prototype.destroy = function () {

  $off(this.parent);

  //菜单部分
  if (this.bookMarkMenu) {
    this.bookMarkMenu.remove();
    this.bookMarkMenu = null;
  }

  //列表部分
  if (this.bookMarkList) {
    this.bookMarkList.remove();
    this.bookMarkList = null;
  }

  //按钮效果
  if (this.bookMarkIcon) {
    this.bookMarkIcon[0].removeEventListener(Xut.plat.transitionEnd, this.iconRestore, false);
    this.bookMarkIcon = null;
  }

  this.parent = null;
};

//书签
/**
 * 创建书签
 * @return {[type]} [description]
 */
var bookMarkMixin = function (activitProto) {

  activitProto.createBookMark = function () {
    var node, seasonId, pageId, pageData;
    if (this.pageType === 'master') {
      //模板取对应的页面上的数据
      pageData = Xut.Presentation.GetPageData();
      node = this.relatedData.floatMasterDivertor.container;
      pageId = pageData._id;
      seasonId = pageData.seasonId;
    } else {
      node = this.$containsNode;
      seasonId = this.relatedData.seasonId;
      pageId = this.pageId;
    }
    var options = {
      parent: node,
      seasonId: seasonId,
      pageId: pageId
    };

    if (this.bookMark) {
      //如果上次只是隐藏则可以恢复
      this.bookMark.restore();
    } else {
      this.bookMark = new BookMark(options);
    }
  };
};

/**
 * 搜索栏
 * 方便用户更加便捷的找到所需要的信息
 *
 */

//图标
var icons$1 = {
  search: 'images/icons/search.svg',
  clear: 'images/icons/clear.svg',
  exit: 'images/icons/exit.svg'
};

function SearchBar(options) {
  //父容器
  this.parent = options.parent;
  //提示信息
  this.tips = options.tips;
  this.init();
}

/**
 * 初始化
 * @return {[type]} [description]
 */
SearchBar.prototype.init = function () {
  var $box = this.searchForm(),
      dom = this.parent[0];

  this.parent.append($box);
  this.searchBox = $box;
  this.resultBox = $box.find('.xut-search-result');
  this.input = $box.find('.xut-search-input');
  this.searchBtn = $box.find('.xut-search-btn');

  //用户操作事件邦定
  $on(dom, {
    end: this,
    cancel: this
  });

  //即时搜索
  dom.addEventListener('keyup', this, false);
};

/**
 * 创建搜索框
 * @return {[object]} [jquery生成的dom对象]
 */
SearchBar.prototype.searchForm = function () {
  var W = window.innerWidth * 0.3,
      H = window.innerHeight;
  var text = this.tips || '请在搜索框中输入要搜索的关键字';

  var box = '<div class="xut-form-search">' + '<div class="xut-form-search-wrap">' + '<div style="height:17%;">' + '<div style="height:20%"></div>' + '<div class="xut-search-row">' + '<input type="text" class="xut-search-input">' + '<div class="xut-search-btn" style="background-image: url(' + icons$1.search + ')"></div>' + '</div>' + '<p class="xut-search-tips" style="line-height:' + Math.round(H * 0.06) + 'px">' + text + '</p>' + '</div>' + '<div style="height:76%">' + '<ul class="xut-search-result"></ul>' + '</div>' + '<div style="height:7%">' + '<div class="xut-search-exit" style="background-image: url(' + icons$1.exit + ')"></div>' + '</div>' + '</div></div>';

  var $box = $(box);

  $box.css('width', W < 200 ? 200 : W);

  return $box;
};

/**
 * 搜索
 * @param {string} [keyword] [搜索关键字]
 */
SearchBar.prototype.search = function (keyword) {
  var data = Xut.data.Chapter,
      ln = data.length,
      list = '',
      rs,
      pageId,
      seasonId;

  if (!keyword) {
    this.resultBox.html('');
    return;
  }

  for (var i = 0; i < ln; i++) {
    rs = data.item(i);
    if (rs.chapterTitle.indexOf(keyword) > -1) {
      pageId = rs._id;
      seasonId = rs.seasonId;
      list += '<li><a class="xut-search-link" data-mark="' + seasonId + '-' + pageId + '" href="javascript:0">' + rs.chapterTitle + '</a></li>';
    }
  }

  this.resultBox.html(list);
};

/**
 * 切换搜索按钮图标
 * @param  {[type]} icon [图标路径]
 * @return {[type]}      [description]
 */
SearchBar.prototype.iconManager = function (icon) {
  if (this.isChange) {
    this.searchBtn.css('background-image', 'url(' + icon + ')');
  }
};

/**
 * 跳转到搜索结果页
 * @param  {[type]} target [description]
 * @return {[type]}        [description]
 */
SearchBar.prototype.searchLink = function (target) {
  if (!target || !target.dataset) return;
  var mark = target.dataset.mark.split('-'),
      seasonId = mark[0],
      pageId = mark[1];

  Xut.View.LoadScenario({
    'seasonId': seasonId,
    'chapterId': pageId
  });
};

/**
 * 邦定事件
 * @param  {[type]} evt [事件]
 * @return {[type]}     [description]
 */
SearchBar.prototype.handleEvent = function (evt) {
  var target = evt.target;
  switch (target.className) {
    case 'xut-search-btn':
      //点击搜索
      this.search(this.input.val());
      this.isChange = true;
      this.iconManager(icons$1.clear);
      break;
    case 'xut-search-input':
      //实时搜索
      this.search(target.value);
      //还原按钮图标
      this.iconManager(icons$1.search);
      this.isChange = false;
      break;
    case 'xut-search-exit':
      //关闭搜索框
      this.exit();
      break;
    case 'xut-search-link':
      //跳转
      this.searchLink(target);
      break;
    default:
      break;
  }
};

/**
 * 关闭搜索框
 * @return {[type]} [description]
 */
SearchBar.prototype.exit = function () {
  this.input.val('');
  this.resultBox.empty();
  this.searchBox.hide();
};

/**
 * 恢复搜索框
 */
SearchBar.prototype.restore = function () {
  var searchBox = this.searchBox;
  searchBox && searchBox.show();
};

/**
 * 销毁搜索框
 * @return {[type]} [description]
 */
SearchBar.prototype.destroy = function () {
  var dom = this.parent[0];

  $off(dom);
  dom.removeEventListener('keyup', this, false);

  this.searchBox.remove();
  this.searchBox = null;
  this.resultBox = null;
  this.searchBtn = null;
  this.input = null;
  this.parent = null;
};

//搜索
/**
 * 创建搜索框
 * @return {[type]} [description]
 */

var searchBarMixin = function (activitProto) {

  activitProto.createSearchBar = function () {
    var options = {
      parent: this.$containsNode
    };
    if (this.searchBar) {
      //如果上次只是隐藏则可以恢复
      this.searchBar.restore();
    } else {
      this.searchBar = new SearchBar(options);
    }
  };
};

var eventMixin = function (activitProto) {

  /**
   * 构建事件体系
   * 解析出事件类型
   */
  activitProto._initEvents = function () {
    this.eventData.eventName = conversionEventType(this.eventData.eventType);
  };

  /**
   * 找到事件上下文
   * @return {[type]} [description]
   */
  activitProto._findContentName = function (chapterIndex, contentId, eventId) {
    var _this = this;

    var contentName = void 0;
    var eventData = this.eventData;

    //dom
    //找到对应绑定事件的元素
    var parseDom = function parseDom() {
      contentName = _this.makePrefix('Content', chapterIndex, contentId);
      eventData.type = 'dom';
      eventData.canvasMode = false;
      eventData.domMode = true;
    };

    //canvas模式非常特别
    //canvas容器+内部pixi对象
    //所以事件绑定在最外面
    var parseCanavs = function parseCanavs() {
      contentName = _this.makePrefix('canvas', chapterIndex, contentId);
      eventData.type = 'canvas';
      eventData.canvasMode = true;
      eventData.domMode = false;
    };

    //canvas事件
    if (eventId && -1 !== this.canvasRelated.contentIdset.indexOf(eventId)) {
      parseCanavs();
    } else {
      //dom事件
      parseDom();
    }

    return contentName;
  };

  /**
   * 获取事件上下文
   * @return {[type]} [description]
   */
  activitProto._parseEventContext = function () {
    //事件上下文对象
    var eventData = this.eventData;
    var eventId = eventData.eventContentId;
    var eventContext = eventData.eventContext;

    if (eventId) {
      if (!eventContext) {
        //被重写过的事件
        var contentId = eventData.rewrite ? eventId : this.id;
        var contentName = this._findContentName(this.chapterIndex, contentId, eventId);
        eventContext = this.getContextNode(contentName);
        eventData.eventContext = eventContext;
      }
      if (eventContext) {
        //绑定事件加入到content钩子
        this.relatedCallback.contentsHooks(this.chapterIndex, eventId, {
          $contentNode: eventContext,
          //增加外部判断
          isBindEventHooks: true,
          type: eventData.type
        });
      } else {
        /**
         * 针对动态事件处理
         * 快捷方式引用到父对象
         */
        eventData.parent = this;
      }
    }

    return eventContext;
  };

  /**
   * 绑定事件行为
   * @return {[type]} [description]
   */
  activitProto._bindEvents = function (callback) {
    var self = this;
    var eventData = this.eventData;
    var eventName = eventData.eventName;
    var eventContext = this._parseEventContext();

    /**
     * 运行动画
     * @return {[type]} [description]
     */
    var startRunAnim = function startRunAnim() {
      //当前事件对象没有动画的时候才能触发关联动作
      var animOffset = void 0;
      var boundary = 5; //边界值
      if (eventData.domMode && (animOffset = eventContext.prop('animOffset'))) {
        var originalLeft = animOffset.left;
        var originalTop = animOffset.top;
        var newOffset = eventContext.offset();
        var newLeft = newOffset.left;
        var newTop = newOffset.top;
        //在合理的动画范围是允许点击的
        //比如对象只是一个小范围的内的改变
        //正负10px的移动是允许接受的
        if (originalLeft > newLeft - boundary && originalLeft < newLeft + boundary || originalTop > newTop - boundary && originalTop < newTop + boundary) {
          self.runAnimation();
        }
      } else {
        self.runAnimation();
      }
    };

    /**
     * 设置按钮的行为
     * 音频
     * 反弹
     */
    var setBehavior = function setBehavior(feedbackBehavior) {
      var behaviorSound = void 0;
      //音频地址
      if (behaviorSound = feedbackBehavior.behaviorSound) {
        //妙妙学客户端强制删除
        if (window.MMXCONFIG && window.audioHandler) {
          self._fixAudio.push(new audioPlayer({
            url: behaviorSound,
            trackId: 9999,
            complete: function complete() {
              this.play();
            }
          }));
        } else {
          //其余平台,如果存在点击过的
          //这里主要是防止重复点击创建
          var audio = self._cacheBehaviorAudio[behaviorSound];
          if (audio) {
            audio.play();
          } else {
            //相同对象创建一次
            //以后取缓存
            audio = new audioPlayer({
              url: behaviorSound
            });
            self._cacheBehaviorAudio[behaviorSound] = audio;
          }
        }
      }

      //反弹效果
      if (feedbackBehavior.isButton) {
        //div通过css实现反弹
        if (eventData.domMode) {
          eventContext.addClass('xut-behavior');
          setTimeout(function () {
            eventContext.removeClass('xut-behavior');
            startRunAnim();
          }, 500);
        } else {
          console.log('feedbackBehavior');
        }
      } else {
        startRunAnim();
      }
    };

    /**
     * 事件引用钩子
     * 用户注册与执行
     */
    var eventDrop = {
      //保存引用,方便直接销毁
      init: function init(drag) {
        eventData.dragDrop = drag;
      },
      //拖拽开始的处理
      startRun: function startRun() {},
      //拖拽结束的处理
      stopRun: function stopRun(isEnter) {
        if (isEnter) {
          //为true表示拖拽进入目标对象区域
          self.runAnimation();
        }
      }
    };

    /**
     * 正常动画执行
     * 除去拖动拖住外的所有事件
     * 点击,双击,滑动等等....
     */
    var eventRun = function eventRun() {

      /*
      跟踪点击动作
      1. 必须配置config
      2. 而且content要有标记
      */
      var contentData = self.relatedData.contentDataset[self.id];
      if (contentData && contentData.trackCode) {
        config.sendTrackCode('content', {
          pageId: self.pageId,
          id: self.id,
          type: self.type,
          eventName: eventData.eventName
        });
      }

      //脚本动画
      if (eventData.rewrite) {
        self.runAnimation();
        return;
      }
      //如果存在反馈动作
      //优先于动画执行
      var feedbackBehavior = eventData.feedbackBehavior[eventData.eventContentId];
      if (feedbackBehavior) {
        setBehavior(feedbackBehavior);
      } else {
        startRunAnim();
      }
    };

    /**
     * 事件对象引用
     */
    var eventHandler = function eventHandler(eventReference, _eventHandler) {
      eventData.eventReference = eventReference;
      eventData.eventHandler = _eventHandler;
    };

    //绑定用户自定义事件
    if (eventContext && eventName) {
      //如果是翻页委托启动了
      //这里处理swiperight与swipeleft
      if (config.launch.swipeDelegate && (eventName === 'swiperight' || eventName === 'swipeleft')) {
        self.relatedCallback.swipeDelegateContents(eventName, function (callback) {
          self.runAnimation(callback);
        });
      }
      //给独立对象绑定事件
      else {

          var domName = void 0;
          var target = void 0;
          var dragdropPara = void 0;

          dragdropPara = eventData.dragdropPara;

          //获取拖拽目标对象
          if (eventName === 'dragTag') {
            domName = this.makePrefix('Content', this.chapterIndex, dragdropPara);
            target = this.getContextNode(domName);
          }

          //增加事件绑定标示
          //针对动态加载节点事件的行为过滤
          eventData.isBind = true;

          bindContentEvent({
            target: target,
            eventName: eventName,
            eventRun: eventRun,
            eventDrop: eventDrop,
            eventHandler: eventHandler,
            eventContext: eventContext,
            'parameter': dragdropPara,
            'domMode': eventData.domMode
          });
        }
    }
  };
};

/**
 * 2017.7.25
 * 1.高级精灵动画
 *   提供给widget使用
 *
 * 2.复杂精灵动画
 *   提供给普通转化高级使用
 */
/*
1 高级精灵动画 =>  替换一张张图片
2 简单精灵强制转换复杂精灵动画
options.type
  1 seniorSprite
  2 autoSprite
 */

var _class$1 = function () {
  function _class(data, options) {
    classCallCheck(this, _class);

    this.data = data;

    //高级精灵动画
    if (options.type == 'seniorSprite') {
      this.contentPrefix = options.contentPrefix;
      this.obj = $("#" + this.contentPrefix + this.data.framId);
      this.resourcePath = options.resourcePath;
    }

    //简单精灵强制转换复杂精灵动画
    if (options.type === 'autoSprite') {
      this.contentId = options.contentId;
      this.obj = $(options.ele);
      this.resourcePath = getFileFullPath(options.resourcePath, 'autoSprite') + "/";
    }

    this.curFPS = 0;

    /*默认值循环一次*/
    this.loop = 1;
    this.resetCount = 0;

    var params = this.data.params;
    var action = this.action = params["actList"].split(",")[0];
    var pa = params[action];
    this.FPS = parseInt(pa.fps);
    this.playerType = pa.playerType;

    //isSports:0非运动状态 isSports:1运动状态
    this.isSports = parseInt(pa.isSports);
    this.originalImageList = pa.ImageList;

    /**webp图片的后缀*/
    var brModelType = config.launch.brModelType;
    if (brModelType) {
      _.each(this.originalImageList, function (imageData) {
        if (imageData.name) {
          imageData.name = imageData.name.replace(/.png|.jpg/, brModelType);
        }
      });
    }

    this.totalFPS = this.originalImageList.length;
    this._imgArray = [];
    this.sprObj = null;

    /*
      默认值播放一次
      如果设置了循环就直接循环处理
     */
    if (this.playerType == "loop") {
      this.loop = 'loop';
    }

    this._init();
  }

  /**
   * 初始化
   * @return {[type]} [description]
   */


  createClass(_class, [{
    key: '_init',
    value: function _init() {
      this._initImage();

      //判断是否运动状态
      if (this.isSports) {
        //初始化位置信息
        this._initPosition();
      }
      //初始化结构
      this._initStructure();
    }

    /**
     * 检查是否可以运行
     * 第一次预加载必须先结束
     * @return {[type]} [description]
     */

  }, {
    key: '_checkNextAction',
    value: function _checkNextAction(task) {
      if (this._initImageState) {
        task();
      } else {
        this._waitTask = [];
        this._waitTask.push(task);
      }
    }

    /**
     * 初始化位置信息
     * @return {[type]} [description]
     */

  }, {
    key: '_initPosition',
    value: function _initPosition() {
      var obj = this.obj;
      var params = this.data.params;
      var action = this.action;
      this.startPoint = {
        x: this.originalImageList[0].X,
        y: this.originalImageList[0].Y,
        w: parseInt(params[action].width),
        h: parseInt(params[action].height)
      };
      this.xRote = parseInt(obj.css("width")) / this.startPoint.w;
      this.yRote = parseInt(obj.css("height")) / this.startPoint.h;
    }

    /**
     * 初始化qualified张图片
     * @return {[type]} [description]
     */

  }, {
    key: '_initImage',
    value: function _initImage() {
      var _this = this;

      var i = 0;
      var qualified = 10;
      var count = this.qualified = this.totalFPS >= qualified ? qualified : this.totalFPS;
      var collect = function () {
        return function () {
          if (count == 1) {
            _this._initImageState = true;
            if (_this._waitTask && _this._waitTask.length) {
              _this._waitTask.pop()();
            }
          } else {
            count--;
          }
        };
      }();

      for (i; i < this.qualified; i++) {
        this._preloadImage(i, collect);
      }
    }

    /**
     * 初始化结构
     * @return {[type]} [description]
     */

  }, {
    key: '_initStructure',
    value: function _initStructure() {
      var src = this.resourcePath + this.originalImageList[0].name;

      var container = void 0;
      if (Xut.plat.isIOS) {
        container = '<img src=' + src + ' class="inherit-size fullscreen-background" style="position:absolute;"/>';
      } else {
        container = '<div class="inherit-size fullscreen-background"\n                            style="position:absolute;background-image: url(' + src + ');"></div>';
      }
      var $sprObj = $(String.styleFormat(container));
      this.sprObj = $sprObj[0];
      this.obj.html(this.sprObj);
    }

    /**
     * 获取文件名
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */

  }, {
    key: '_getFilename',
    value: function _getFilename(name) {
      return name.substr(0, name.indexOf('.'));
    }

    /**
     * 图片预加载
     * 1 png
     * 2 jpg mask
     * @return {[type]} [description]
     */

  }, {
    key: '_preloadImage',
    value: function _preloadImage(index, callback) {
      if (index >= this.totalFPS) {
        return;
      }
      var self = this;
      var collect = function collect() {
        self._imgArray && self._imgArray.push(this);
        callback && callback();
      };
      var imageList = this.originalImageList;
      var resourcePath = this.resourcePath;
      loadFigure(resourcePath + imageList[index].name, collect);
    }

    /**
     * 改变图片位置
     * @return {[type]} [description]
     */

  }, {
    key: '_changePosition',
    value: function _changePosition() {
      var imageList = this.originalImageList;
      var curFPS = imageList[this.curFPS];
      var x = curFPS.X - this.startPoint.x;
      var y = curFPS.Y - this.startPoint.y;
      return {
        left: x * this.xRote,
        top: y * this.yRote
      };
    }

    /**
     * 改变图片url 与 变化的位置
     * @return {[type]} [description]
     */

  }, {
    key: '_changeImage',
    value: function _changeImage() {
      var imageList = this.originalImageList;
      var curFPS = imageList[this.curFPS];
      var resourcePath = this.resourcePath;

      /*第一次循环才加载图片*/
      if (this.resetCount === 0) {
        this._preloadImage(this.curFPS + this.qualified);
      }

      /*如果图片需要运动，改变地址*/
      if (this.isSports) {
        var position = this._changePosition();
        Xut.style.setTranslate({
          node: this.sprObj,
          x: position.left,
          y: position.top
        });
      }

      /*改变图片*/
      if (Xut.plat.isIOS) {
        this.sprObj.setAttribute('src', resourcePath + curFPS.name);
      } else {
        this.sprObj.style.backgroundImage = 'url(' + (resourcePath + curFPS.name) + ')';
      }
    }

    /**
     * 运行动画
     * @return {[type]} [description]
     */

  }, {
    key: '_change',
    value: function _change() {
      if (!this.originalImageList) {
        return;
      }
      /*切换图片*/
      this._changeImage();
    }
  }, {
    key: '_time',
    value: function _time() {
      var _this2 = this;

      this.timer = setTimeout(function () {
        clearTimeout(_this2.timer);
        _this2.timer = null;
        _this2._change();
        _this2.curFPS++;
        _this2._set();
      }, 1000 / this.FPS);
    }

    /**
     * 设置动画运行状态
     * look 0  循环
     * lokk 1~n 指定次数
     */

  }, {
    key: '_set',
    value: function _set() {
      var _this3 = this;

      //循环复位
      if (this.curFPS >= this.totalFPS) {
        this.curFPS = 0;
        this.resetCount++;
      }

      if (this.loop !== 'loop' && this.loop == this.resetCount) {
        this._stop();
        return;
      }

      this._checkNextAction(function () {
        _this3._time();
      });
    }
  }, {
    key: '_stop',
    value: function _stop() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.curFPS = 0;
      this.resetCount = 0;
    }

    /**
     * 开始运行动画
     * loop
     *   1 零件高级动画 loop => N / loop
     *   1 普通转高级动画 loop => N / loop
     */

  }, {
    key: 'play',
    value: function play(action, loop) {
      this.action = action;
      if (!this.data.params[action]) {
        console.log(" Function changeSwitchAni  parameters " + action + " error");
        return;
      }
      if (loop) {
        this.loop = loop;
      }
      this._stop();
      this._set();
    }

    /**
     * 停止
     * @return {[type]} [description]
     */

  }, {
    key: 'stop',
    value: function stop() {
      this._stop();
    }

    /**
     * 销毁
     * @return {[type]} [description]
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this._stop();
      this.obj = null;
      this.sprObj = null;
      this.data.params = null;
      this.data = null;
      this._imgArray.forEach(function (img) {
        img = null;
      });
      this.originalImageList = null;
      this._imgArray = null;
    }
  }]);
  return _class;
}();

var spiritObjs = {};

// $("body").on("dblclick",function(){
//   console.log(spiritObjs)
// })

/**
 * get data
 * @param  {[type]} inputPara [description]
 * @param  {[type]} contents  [description]
 * @return {[type]}           [description]
 */
var getData = function getData(inputPara, contents) {
  var option = void 0;
  var resourcePath = config.getWidgetPath() + "gallery/" + inputPara.id + "/";
  var xhr = new XMLHttpRequest();
  xhr.open('GET', resourcePath + 'app.json', false);
  xhr.send(null);
  try {
    option = parseJSON(xhr.responseText);
  } catch (e) {
    console.log("app.json get error:" + e);
  }
  return option;
};

var moveContent = function moveContent(contentPrefix, id, parentId) {
  var obj = $("#" + contentPrefix + id);
  var parentObj = $("#" + contentPrefix + parentId);
  var $parent = $("#spirit_parent_" + parentId);
  if ($parent.length == 0) {
    parentObj.append("<div style='position:absolute; width:100%; height:100%'  id='spirit_parent_" + parentId + "'></div>");
  }
  $parent.append(obj);
};

var getId = function getId(inputPara, contentPrefix) {
  var id = '';
  if (_.isObject(inputPara)) {
    id = contentPrefix + inputPara.framId;
  } else {
    id = inputPara;
  }
  return id;
};

function updateAction(id, params) {
  var loop = 1;
  var obj = void 0;
  if (params.playerType == "loop") {
    loop = 'loop';
  }

  if (obj = spiritObjs[id]) {
    obj.play(params.actList, loop);
  } else {
    console.log('error');
  }
}

var AdvSprite = function (inputPara, contents) {
  var option = getData(inputPara, contents);
  var ResourcePath = config.getWidgetPath() + "gallery/" + inputPara.id + "/";
  var contentPrefix = inputPara.contentPrefix;
  var ids = [];
  var options = {};
  options.contentPrefix = contentPrefix;
  options.resourcePath = ResourcePath;
  options.type = 'seniorSprite';

  if (option.spiritList) {
    for (var i = 0; i < option.spiritList.length; i++) {
      var spiritList = option.spiritList[i];
      var id = getId(spiritList, contentPrefix);
      var framId = spiritList.framId;
      var parentId = spiritList.parentId;
      if (_.isObject(inputPara)) {
        if (parentId != "0") {
          moveContent(contentPrefix, framId, parentId);
        }
        spiritObjs[id] = new _class$1(spiritList, options);
        ids.push(id);
      } else {
        console.log("inputPara undefine Spirit");
      }
    }
  } else {
    console.log('没有高级精灵动画数据');
  }

  return {
    stop: function stop() {
      ids.forEach(function (key) {
        spiritObjs[key].stop();
      });
    },
    destroy: function destroy() {
      ids.forEach(function (key) {
        if (spiritObjs[key]) {
          spiritObjs[key].destroy();
          spiritObjs[key] = null;
          delete spiritObjs[key];
        }
      });
    }
  };
};

var filter$1 = Xut.style.filter;

/**
 * 淡入淡出动画
 * @param  {[type]} animproto [description]
 * @return {[type]}           [description]
 */
function fade(animproto) {

  //出现/消失
  animproto.getEffectAppear = function (parameter, object, isExit, duration, delay, repeat) {
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    if (isExit == false) t1.to(object, 0.001, {
      autoAlpha: 1
    });else t1.to(object, 0.001, {
      css: {
        visibility: "hidden"
      }
    });
    return t1;
  };

  //淡出
  animproto.getEffectFade = function (parameter, object, isExit, duration, delay, repeat) {
    var t1 = null;
    if (isExit == false) {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object]
      });
      t1.from(object, duration, {
        autoAlpha: 0,
        ease: parameter.tweenEase,
        immediateRender: false
      });
    } else {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object, {
          opacity: 1
        }]
      });
      t1.to(object, duration, {
        autoAlpha: 0,
        ease: parameter.tweenEase
      });
    }
    return t1;
  };

  //闪烁(一次)
  animproto.getEffectFlashOnce = function (parameter, object, duration, delay, repeat) {
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    var time = duration / 3;
    t1.to(object, 0.001, {
      css: {
        visibility: "hidden"
      }
    }).to(object, time * 2, {}).to(object, time, {
      css: {
        visibility: "visible"
      }
    });
    return t1;
  };

  //不饱和
  animproto.getEffectDesaturate = function (parameter, object, duration, delay, repeat) {
    if (!(filter$1 in object[0].style)) return new TimelineMax();
    var saturation = parameter.saturation ? parameter.saturation : 0.5; //饱和度
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object, {
        filter: "none"
      }]
    });
    t1.to(object, duration, {
      onUpdate: updateSaturate
    });
    return t1;

    function updateSaturate() {
      var progress = t1.progress();
      var percent = progress <= 0.5 ? progress * 2 : 1;
      var val = 1 + (saturation - 1) * percent;
      object.css(filter$1, "saturate(" + val + ")");
    }
  };

  //加深
  animproto.getEffectDarken = function (parameter, object, duration, delay, repeat) {
    if (!(filter$1 in object[0].style)) return new TimelineMax();
    var brightness = parameter.brightness && parameter.brightness < 1 ? brightness.saturation : 0.5; //亮度
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object, {
        filter: "none"
      }]
    });
    t1.to(object, duration, {
      onUpdate: updateBrightness
    });
    return t1;

    function updateBrightness() {
      var progress = t1.progress();
      var percent = progress <= 0.5 ? progress * 2 : 1;
      var val = 1 + (brightness - 1) * percent;
      object.css(filter$1, "brightness(" + val + ")");
    }
  };

  //变淡
  animproto.getEffectLighten = function (parameter, object, duration, delay, repeat) {
    if (!(filter$1 in object[0].style)) return new TimelineMax();
    var brightness = parameter.brightness && parameter.brightness > 1 ? parameter.brightness : 1.5; //亮度
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object, {
        filter: "none"
      }]
    });
    t1.to(object, duration, {
      onUpdate: updateBrightness
    });
    return t1;

    function updateBrightness() {
      var progress = t1.progress();
      var percent = progress <= 0.5 ? progress * 2 : 1;
      var val = 1 + (brightness - 1) * percent;
      object.css(filter$1, "brightness(" + val + ")");
    }
  };

  //透明
  animproto.getEffectTransparency = function (parameter, object, duration, delay, repeat) {
    var opacity = parameter.amount ? parameter.amount : 0.5; //透明度
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    t1.to(object, duration, {
      autoAlpha: opacity,
      ease: parameter.tweenEase
    });
    return t1;
  };
}

/**
 * 飞入飞出动画
 * @param  {[type]} animproto [description]
 * @return {[type]}           [description]
 */
function fly(animproto) {

  //飞入效果
  animproto.getEffectFly = function (parameter, object, isExit, duration, delay, repeat) {
    var direction = parameter.direction; //方向(上、下、左、右、左上、左下、右上、右下)
    var t1 = null;
    var objInfo = this._getObjectInfo(object);
    var easeString = Expo.easeOut;
    var x, y;

    if (parameter.tweenEase && parameter.tweenEase.length > 0) easeString = parameter.tweenEase;
    if (parameter.smoothStart == 1 || parameter.smoothEnd == 1 || parameter.bounceEnd == 1) {
      if (isExit == true) easeString = Power4.easeOut;else easeString = Elastic.easeOut;
    }

    if (isExit == false) {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object, {
          visibility: "visible"
        }],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object, {
          visibility: "visible"
        }]
      });
      switch (direction) {
        case "DirectionDown":
          y = Math.abs(objInfo.offsetBottom + objInfo.height);
          t1.from(object, duration, {
            y: y,
            ease: easeString,
            immediateRender: false
          });
          break;
        case "DirectionLeft":
          x = -Math.abs(objInfo.offsetLeft + objInfo.width);
          t1.from(object, duration, {
            x: x,
            ease: easeString,
            immediateRender: false
          });
          break;
        case "DirectionUp":
          y = -Math.abs(objInfo.offsetTop + objInfo.height);
          t1.from(object, duration, {
            y: y,
            ease: easeString,
            immediateRender: false
          });
          break;
        case "DirectionRight":
          x = Math.abs(objInfo.offsetRight + objInfo.width);
          t1.from(object, duration, {
            x: x,
            ease: easeString,
            immediateRender: false
          });
          break;
        case "DirectionDownLeft":
          x = -Math.abs(objInfo.offsetLeft + objInfo.width);
          y = objInfo.offsetBottom + objInfo.height;
          t1.from(object, duration, {
            x: x,
            y: y,
            ease: easeString,
            immediateRender: false
          });
          break;
        case "DirectionDownRight":
          x = Math.abs(objInfo.offsetRight + objInfo.width);
          y = Math.abs(objInfo.offsetBottom + objInfo.height);
          t1.from(object, duration, {
            x: x,
            y: y,
            ease: easeString,
            immediateRender: false
          });
          break;
        case "DirectionUpLeft":
          x = -Math.abs(objInfo.offsetLeft + objInfo.width);
          y = -Math.abs(objInfo.offsetTop + objInfo.height);
          t1.from(object, duration, {
            x: x,
            y: y,
            ease: easeString,
            immediateRender: false
          });
          break;
        case "DirectionUpRight":
          x = Math.abs(objInfo.offsetRight + objInfo.width);
          y = -Math.abs(objInfo.offsetTop + objInfo.height);
          t1.from(object, duration, {
            x: x,
            y: y,
            ease: easeString,
            immediateRender: false
          });
          break;
        default:
          console.log("getEffectFly:parameter error.");
          break;
      }
    } else {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object, {
          x: 0,
          y: 0,
          visibility: "hidden" //clearProps功能(对象被还原)必须隐藏对象
        }]
      });
      switch (direction) {
        case "DirectionDown":
          y = Math.abs(objInfo.offsetBottom + objInfo.height);
          t1.to(object, duration, {
            y: y,
            //clearProps: "y",
            ease: easeString
          });
          break;
        case "DirectionLeft":
          x = -Math.abs(objInfo.offsetLeft + objInfo.width);
          t1.to(object, duration, {
            x: x,
            //clearProps: "x",
            ease: easeString
          });
          break;
        case "DirectionUp":
          y = -Math.abs(objInfo.offsetTop + objInfo.height);
          t1.to(object, duration, {
            y: y,
            //clearProps: "y",
            ease: easeString
          });
          break;
        case "DirectionRight":
          x = Math.abs(objInfo.offsetRight + objInfo.width);
          t1.to(object, duration, {
            x: x,
            //clearProps: "x",
            ease: easeString
          });
          break;
        case "DirectionDownLeft":
          x = -Math.abs(objInfo.offsetLeft + objInfo.width);
          y = objInfo.offsetBottom + objInfo.height;
          t1.to(object, duration, {
            x: x,
            y: y,
            //clearProps: "x,y",
            ease: easeString
          });
          break;
        case "DirectionDownRight":
          x = Math.abs(objInfo.offsetRight + objInfo.width);
          y = Math.abs(objInfo.offsetBottom + objInfo.height);
          t1.to(object, duration, {
            x: x,
            y: y,
            //clearProps: "x,y",
            ease: easeString
          });
          break;
        case "DirectionUpLeft":
          x = -Math.abs(objInfo.offsetLeft + objInfo.width);
          y = -Math.abs(objInfo.offsetTop + objInfo.height);
          t1.to(object, duration, {
            x: x,
            y: y,
            //clearProps: "x,y",
            ease: easeString
          });
          break;
        case "DirectionUpRight":
          x = Math.abs(objInfo.offsetRight + objInfo.width);
          y = -Math.abs(objInfo.offsetTop + objInfo.height);
          t1.to(object, duration, {
            x: x,
            y: y,
            //clearProps: "x,y",
            ease: easeString
          });
          break;
        default:
          console.log("getEffectFly:parameter error.");
          break;
      }
    }
    return t1;
  };

  //浮入/浮出(下方)
  animproto.getEffectAscend = function (parameter, object, isExit, duration, delay, repeat) {
    var t1 = null;
    if (isExit == false) {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object]
      });
      //t1.to(object, 0.001, {opacity: 0, y: 100}).to(object, duration - 0.001, {autoAlpha: 1, y: 0, ease: parameter.tweenEase});
      t1.from(object, duration, {
        autoAlpha: 0,
        y: 100,
        ease: parameter.tweenEase,
        immediateRender: false
      });
    } else {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object, {
          opacity: 1,
          y: 0
        }]
      });
      t1.to(object, duration, {
        autoAlpha: 0,
        y: 100,
        //clearProps: "y", //己失效
        ease: parameter.tweenEase
      });
    }
    return t1;
  };

  //浮入/浮出(上方)
  animproto.getEffectDescend = function (parameter, object, isExit, duration, delay, repeat) {
    var t1 = null;
    if (isExit == false) {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object]
      });
      //t1.to(object, 0.001, {y: -100}).to(object, duration - 0.001, {autoAlpha: 1, y: 0, ease: parameter.tweenEase});
      t1.from(object, duration, {
        autoAlpha: 0,
        y: -100,
        ease: parameter.tweenEase,
        immediateRender: false
      });
    } else {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object, {
          opacity: 1
        }]
      });
      t1.to(object, duration, {
        autoAlpha: 0,
        y: -100,
        ease: parameter.tweenEase,
        clearProps: "y"
      });
    }
    return t1;
  };

  //切入/出
  animproto.getEffectPeek = function (parameter, object, isExit, duration, delay, repeat) {
    var direction = parameter.direction; //方向(上下左右)
    var t1 = null;
    var objInfo = this._getObjectInfo(object);
    if (isExit == false) {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object, {
          visibility: "visible"
        }],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object]
      });
      switch (direction) {
        case "DirectionUp":
          t1.from(object, duration, {
            y: -objInfo.height,
            ease: Linear.easeNone,
            onUpdate: this._updateClipRect,
            onUpdateParams: [t1, object, isExit, "DirectionDown", objInfo]
          });
          break;
        case "DirectionDown":
          t1.from(object, duration, {
            y: objInfo.height,
            ease: Linear.easeNone,
            onUpdate: this._updateClipRect,
            onUpdateParams: [t1, object, isExit, "DirectionUp", objInfo]
          });
          break;
        case "DirectionLeft":
          t1.from(object, duration, {
            x: -objInfo.width,
            ease: Linear.easeNone,
            onUpdate: this._updateClipRect,
            onUpdateParams: [t1, object, isExit, "DirectionRight", objInfo]
          });
          break;
        case "DirectionRight":
          t1.from(object, duration, {
            x: objInfo.width,
            ease: Linear.easeNone,
            onUpdate: this._updateClipRect,
            onUpdateParams: [t1, object, isExit, "DirectionLeft", objInfo]
          });
          break;
        default:
          console.log("getEffectPeek:parameter error.");
          break;
      }
    } else {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object]
      });
      switch (direction) {
        case "DirectionUp":
          t1.to(object, duration, {
            y: -objInfo.height,
            ease: Linear.easeNone,
            onUpdate: this._updateClipRect,
            onUpdateParams: [t1, object, isExit, "DirectionUp", objInfo]
          });
          break;
        case "DirectionDown":
          t1.to(object, duration, {
            y: objInfo.height,
            ease: Linear.easeNone,
            onUpdate: this._updateClipRect,
            onUpdateParams: [t1, object, isExit, "DirectionDown", objInfo]
          });
          break;
        case "DirectionLeft":
          t1.to(object, duration, {
            x: -objInfo.width,
            ease: Linear.easeNone,
            onUpdate: this._updateClipRect,
            onUpdateParams: [t1, object, isExit, "DirectionLeft", objInfo]
          });
          break;
        case "DirectionRight":
          t1.to(object, duration, {
            x: objInfo.width,
            ease: Linear.easeNone,
            onUpdate: this._updateClipRect,
            onUpdateParams: [t1, object, isExit, "DirectionRight", objInfo]
          });
          break;
        default:
          console.log("getEffectPeek:parameter error.");
          break;
      }
    }
    return t1;
  };

  //螺旋飞入/出
  animproto.getEffectSpiral = function (parameter, object, isExit, duration, delay, repeat) {
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object, {
        visibility: "visible"
      }],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    var easeString = Power1.easeInOut;
    if (parameter.tweenEase && parameter.tweenEase.length > 0) easeString = parameter.tweenEase;
    if (isExit == false) {
      t1.from(object, duration, {
        scale: 0,
        bezier: {
          type: "cubic",
          values: [{
            x: 0,
            y: 0
          }, {
            x: 200,
            y: -200
          }, {
            x: 0,
            y: -400
          }, {
            x: -500,
            y: -600
          }]
        },
        ease: easeString
      });
    } else {
      t1.to(object, duration, {
        scale: 0,
        bezier: {
          type: "cubic",
          values: [{
            x: 0,
            y: 0
          }, {
            x: 200,
            y: -200
          }, {
            x: 0,
            y: -400
          }, {
            x: -500,
            y: -600
          }]
        },
        ease: easeString
      });
    }
    return t1;
  };

  //曲线向上/下
  animproto.getEffectArcUp = function (parameter, object, isExit, duration, delay, repeat) {
    var t1 = null;
    var easeString = Power1.easeInOut;
    if (parameter.tweenEase && parameter.tweenEase.length > 0) easeString = parameter.tweenEase;
    if (isExit == false) {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object]
      });
      t1.from(object, duration, {
        autoAlpha: 0,
        scale: 2,
        bezier: {
          type: "cubic",
          values: [{
            x: 0,
            y: 0
          }, {
            x: 200,
            y: 200
          }, {
            x: 0,
            y: 400
          }, {
            x: -500,
            y: 600
          }]
        },
        ease: easeString
      });
    } else {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object, {
          opacity: 1,
          scale: 1
        }]
      });
      t1.to(object, duration, {
        autoAlpha: 0,
        scale: 2,
        bezier: {
          type: "cubic",
          values: [{
            x: 0,
            y: 0
          }, {
            x: 200,
            y: 200
          }, {
            x: 0,
            y: 400
          }, {
            x: -500,
            y: 600
          }]
        },
        ease: easeString,
        clearProps: "x,y"
      });
    }
    return t1;
  };

  //升起/下沉
  animproto.getEffectRiseUp = function (parameter, object, isExit, duration, delay, repeat) {
    var t1 = null;
    var objInfo = this._getObjectInfo(object);
    var y = objInfo.offsetBottom + objInfo.height;
    var easeString = Back.easeInOut;
    if (parameter.tweenEase && parameter.tweenEase.length > 0) easeString = parameter.tweenEase;
    if (isExit == false) {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object]
      });
      t1.from(object, duration, {
        autoAlpha: 0,
        y: y,
        ease: easeString
      });
    } else {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object, {
          opacity: 1
        }]
      });
      t1.to(object, duration, {
        autoAlpha: 0,
        y: y,
        ease: easeString
      });
    }
    return t1;
  };
}

var ceil = Math.ceil;
var pow = Math.pow;
var regexpHex = /^#[0-9a-fA-F]{3,6}$/; //Hex

/**
 * 计算两点直线距离
 */
function calculateDistance(currentPoint, historyPoint) {
  var xdiff = currentPoint.x - historyPoint.x;
  var ydiff = currentPoint.y - historyPoint.y;
  return ceil(pow(xdiff * xdiff + ydiff * ydiff, 0.5));
}

/**
 * 区间计算
 */
function calculateDirection(currentPoint, historyPoint) {
  var quadrant = ""; //象限
  if (currentPoint.y == historyPoint.y && currentPoint.x > historyPoint.x) quadrant = "+x"; //水平正方向
  else if (currentPoint.y == historyPoint.y && currentPoint.x < historyPoint.x) quadrant = "-x"; //水平负方向
    else if (currentPoint.x == historyPoint.x && currentPoint.y > historyPoint.y) quadrant = "+y"; //垂直正方向
      else if (currentPoint.x == historyPoint.x && currentPoint.y < historyPoint.y) quadrant = "-y"; //垂直负方向
        else if (currentPoint.x > historyPoint.x && currentPoint.y < historyPoint.y) quadrant = "1"; //第一象限
          else if (currentPoint.x > historyPoint.x && currentPoint.y > historyPoint.y) quadrant = "2"; //第二象限
            else if (currentPoint.x < historyPoint.x && currentPoint.y > historyPoint.y) quadrant = "3"; //第三象限
              else if (currentPoint.x < historyPoint.x && currentPoint.y < historyPoint.y) quadrant = "4"; //第四象限
  return quadrant;
}

/**
 * 十六进制颜色转换为RGB颜色
 * @param color 要转换的十六进制颜色
 * @return RGB颜色
 */
function colorHexToRGB(color, opacity) {
  color = color.toUpperCase();
  if (regexpHex.test(color)) {
    var hexArray = new Array();
    var count = 1;
    for (var i = 1; i <= 3; i++) {
      if (color.length - 2 * i > 3 - i) {
        hexArray.push(Number("0x" + color.substring(count, count + 2)));
        count += 2;
      } else {
        hexArray.push(Number("0x" + color.charAt(count) + color.charAt(count)));
        count += 1;
      }
    }
    if (opacity && opacity > 0) return "RGBA(" + hexArray.join(",") + "," + opacity + ")";else return "RGB(" + hexArray.join(",") + ")";
  } else {
    console.error("Hex Color string(" + color + ") format conversion error.");
    return color;
  }
}

/**
 * RGB颜色转换为十六进制颜色
 * @param color 要转换的RGB颜色
 * @return 十六进制颜色
 */

/*基本动画类鼠标响应事件*/

var hasTouch$2 = Xut.plat.hasTouch;

var MoveMent = function () {
  function MoveMent(pageType, parentId, objectId, startCallback, moveCallback, endCallback) {
    classCallCheck(this, MoveMent);

    this.hasTouch = hasTouch$2;
    this.parent = document.getElementById(parentId);
    this.scroller = document.getElementById(objectId);
    this.startCallback = startCallback;
    this.moveCallback = moveCallback;
    this.endCallback = endCallback;
    if (this.scroller == null) {
      console.error("The control area of the object is empty.");
      return;
    }

    //取消默认翻页行为
    if (Xut.Contents.ResetDefaultControl) {
      Xut.Contents.ResetDefaultControl(pageType, parentId);
    }

    //注销重复事件
    if (this.scroller["bindMoveMent"]) {
      this.scroller["bindMoveMent"].destroy();
    }

    $on(this.scroller, {
      start: this
    });

    this.scroller["bindMoveMent"] = this; //实例化对象绑定到元素，便于后期调用
  }

  createClass(MoveMent, [{
    key: "handleEvent",
    value: function handleEvent(e) {
      $handle({
        start: function start(e) {
          this._start(e);
        },
        move: function move(e) {
          this._move(e);
        },
        end: function end(e) {
          this._end(e);
        },
        cancel: function cancel(e) {
          this._end(e);
        }
      }, this, e);
    }
  }, {
    key: "_start",
    value: function _start(e) {
      e.preventDefault();
      if (typeof this.startCallback == "function") this.startCallback(e);
      $on(this.scroller, {
        move: this,
        end: this,
        cancel: this
      });
    }
  }, {
    key: "_move",
    value: function _move(e) {
      if (typeof this.moveCallback == "function") this.moveCallback(e);
    }
  }, {
    key: "_end",
    value: function _end(e) {
      $off(this.scroller);
      if (typeof this.endCallback == "function") this.endCallback(e);
    }
  }, {
    key: "destroy",
    value: function destroy(type, el, bubble) {
      $off(this.scroller);
      this.scroller = null;
    }
  }]);
  return MoveMent;
}();

var hasTouch$1 = Xut.plat.hasTouch;

/**
 * 路径动画
 * @param  {[type]} animproto [description]
 * @return {[type]}           [description]
 */
function path$1(animproto) {

  //路径动画
  animproto.getPathAnimation = function (parameter, object, duration, delay, repeat) {
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    var path = parameter.path ? parameter.path : ""; //路径
    if (!path || path == "") return t1;

    var autoReverse = parameter.autoReverse == 1 ? true : false; //自动翻转(系统自带,实为沿路径返回)
    var subRepeat = autoReverse == true ? 1 : 0; //如果autoReverse为真而子动画必须为1，否则默认为0
    var autoRotate = parameter.objFollow == 1 ? true : false; //是否跟随路径旋转对象(Z轴)
    var autoTurn = parameter.objFollow == 2 ? true : false; //反向运动时自动翻转对象(Y轴)
    //连续行为参数处理
    var axis = 0;
    var degree = 0; //旋转角度
    var scaleFactor = null; //缩放比例(未设置时必须为null才能不影响其它动画效果)

    // var motionScript = ""; //连续脚本
    if (parameter.attrAlongPath) {
      axis = parameter.attrAlongPath.axis ? parameter.attrAlongPath.axis : 0;
      degree = Math.abs(parameter.attrAlongPath.degree) > 0 ? Number(parameter.attrAlongPath.degree) : 0;
      scaleFactor = parameter.attrAlongPath.scaleFactor > 0 ? parameter.attrAlongPath.scaleFactor : null;
      // motionScript = parameter.attrAlongPath.motionScript;
    }

    var currentFrame = 0; //当前帧
    var currentDegree = 0; //当前翻转角度
    var currentOffset = object.offset(); //对象当前位置
    var turnState = ""; //当前运动状态(左/右)
    //对象原点坐标（相对页面原点）
    var objInfo = {
      top: currentOffset.top,
      left: currentOffset.left,
      oX: currentOffset.left + object.width() / 2, //计算object的中心点x坐标
      oY: currentOffset.top + object.height() / 2 //计算object的中心点有y坐标
    };
    //移动起点坐标（默认为对象原点0,0）
    var x0 = 0,
        y0 = 0;
    //对象当前坐标
    var cx = 0,
        cy = 0;

    function resetStartPoint(x, y) {
      //如果路径动画为：EffectPathStairsDown向下阶梯、EffectPathBounceLeft向左弹跳、EffectPathBounceRight 向右弹跳，则需要重置起点坐标(此问题待验证,暂取消)
      /*if (parameter.animationName == "EffectPathStairsDown" || parameter.animationName == "EffectPathBounceLeft" || parameter.animationName == "EffectPathBounceRight") {
          x0 = x;
          y0 = y;
      }*/
      //更新当前坐标
      cx = x;
      cy = y;
    }
    var isCurve = path.indexOf("C") < 0 && path.indexOf("c") < 0; //是否为曲线路径
    var ArrPath = path.split(' ');
    var svgPath = ''; //VML路径转SVG路径(测试)
    var quArr = [];
    var x, y;
    for (var k = 0; k < ArrPath.length; k++) {
      var str = ArrPath[k];
      switch (str) {
        case "M": //移动（开始）
        case "m":
          x = Math.round(ArrPath[k + 1] * this.visualWidth);
          y = Math.round(ArrPath[k + 2] * this.visualHeight);
          /*t1.add(TweenMax.to(object, 0.001, {
              x: x,
              y: y
          }));*/
          quArr.push({
            x: x,
            y: y
          });
          k = k + 2;
          resetStartPoint(x, y);
          svgPath += 'M ' + (objInfo.oX + x) + ' ' + (objInfo.oY + y);
          break;
        case "C": //曲线
        case "c":
          var x1 = x0 + Math.round(ArrPath[k + 1] * this.visualWidth);
          var y1 = y0 + Math.round(ArrPath[k + 2] * this.visualHeight);
          var x2 = x0 + Math.round(ArrPath[k + 3] * this.visualWidth);
          var y2 = y0 + Math.round(ArrPath[k + 4] * this.visualHeight);
          var x3 = x0 + Math.round(ArrPath[k + 5] * this.visualWidth);
          var y3 = y0 + Math.round(ArrPath[k + 6] * this.visualHeight);
          quArr.push({
            x: x1,
            y: y1
          }, {
            x: x2,
            y: y2
          }, {
            x: x3,
            y: y3
          });
          k = k + 6;
          resetStartPoint(x3, y3);
          svgPath += ' C ' + (objInfo.oX + x1) + ' ' + (objInfo.oY + y1) + ' ' + (objInfo.oX + x2) + ' ' + (objInfo.oY + y2) + ' ' + (objInfo.oX + x3) + ' ' + (objInfo.oY + y3);
          break;
        case "L": //直线
        case "l":
          x = x0 + Math.round(ArrPath[k + 1] * this.visualWidth);
          y = y0 + Math.round(ArrPath[k + 2] * this.visualHeight);
          if (x == cx && y == cy) {
            k = k + 2;
            break;
          }
          quArr.push({
            x: x,
            y: y
          });
          k = k + 2;
          resetStartPoint(x, y);
          svgPath += ' L ' + (objInfo.oX + x) + ' ' + (objInfo.oY + y);
          break;
        case "Z":
          //闭合
          if (quArr[0].x != quArr[quArr.length - 1].x || quArr[0].y != quArr[quArr.length - 1].y) {
            quArr.push({
              x: quArr[0].x,
              y: quArr[0].y
            });
          }
          svgPath += ' Z';
          break;
        case "E":
          //结束
          break;
      }
    }

    //启用手势
    if (parameter.gesture) {
      t1 = new TimelineMax({
        paused: true,
        useFrames: true
      });
      parameter.tweenEase = "Linear.easeNone"; //手势控制必须为匀速运动

      //创建SVG路径(用于测试)
      /*if (isDesktop) {
          if ($("#svgPathContainer").length == 0)
              this.container.append('<div id="svgPathContainer" style="position:absolute;width:100%;height:100%;"><svg width="100%" height="100%"  xmlns="http://www.w3.org/2000/svg" version="1.1"></svg></div>');
          var svgDocument = $("#svgPathContainer").find("svg")[0];
          //创建当前路径
          var p = makeShape("Path", {
              id: "Path_" + object[0].id,
              d: svgPath
          });
          svgDocument.appendChild(p);
      }*/

      //创建手势控制区域
      var controlId = object[0].id; //控制区ID
      if (parameter.gesture.controlType == 1) {
        if (parameter.pathContent > 0) {
          controlId = controlId.replace(/\d+$/, parameter.pathContent);
        } else {
          controlId = "Cont_" + object[0].id;
          // var expandArea = 20; //最小可触摸尺寸(扩展外框)
          //     var rect = p.getBoundingClientRect();
          //     this.container.append('<div id="' + controlId + '" style="z-index:9999;position:absolute;left:' + (rect.left - expandArea) + 'px;top:' + (rect.top - expandArea) + 'px;width:' + (rect.width + expandArea * 2) + 'px;height:' + (rect.height + expandArea * 2) + 'px;"></div>');
        }
      }
      //计算路径距离
      var distance = 0;
      //distance = p.getTotalLength(); //SVG路径获取长度
      var sprotInfo = [];
      for (var m = 1; m < quArr.length; m++) {
        //获取距离
        distance += calculateDistance(quArr[m], quArr[m - 1]);
        sprotInfo.push({
          start: 0,
          end: distance,
          quadrant: calculateDirection(quArr[m], quArr[m - 1])
        });
      }
      //修改时间为帧数(距离转换为帧)
      duration = Math.floor(distance);
      //触发点列表
      var cuePoints = [];
      if (parameter.gesture.cuePoints) {
        for (var i = 0; i < parameter.gesture.cuePoints.length; i++) {
          cuePoints.push({
            cueStart: Math.floor(parameter.gesture.cuePoints[i].cueStart * duration),
            cueEnd: Math.floor(parameter.gesture.cuePoints[i].cueEnd * duration),
            valueStart: parameter.gesture.cuePoints[i].valueStart,
            valueEnd: parameter.gesture.cuePoints[i].valueEnd,
            mouseEnter: false,
            mouseLeave: false
          });
        }
      }

      //绑定手势事件
      var historyPoint = null;

      var startEvent = function startEvent(e) {
        historyPoint = {
          x: hasTouch$1 ? e.changedTouches[0].pageX : e.clientX,
          y: hasTouch$1 ? e.changedTouches[0].pageY : e.clientY
        };
      };

      var moveEnd = function moveEnd() {
        historyPoint = null;
        //松手后行为(辅助对象ID)
        if (parameter.gesture.afterTouch > 0) Xut.Assist.Run(parameter.pageType, parameter.gesture.afterTouch, null);
      };

      var moveEvent = function moveEvent(e) {
        var i;
        var currentPoint = {
          x: hasTouch$1 ? e.changedTouches[0].pageX : e.clientX,
          y: hasTouch$1 ? e.changedTouches[0].pageY : e.clientY
        };
        var d = calculateDistance(currentPoint, historyPoint); //鼠示移动距离
        var quadrant1 = 0; //对象移动方向
        for (i = 0; i < sprotInfo.length; i++) {
          if (currentFrame <= sprotInfo[i].end) {
            quadrant1 = sprotInfo[i].quadrant;
            break;
          }
        }
        var quadrant2 = calculateDirection(currentPoint, historyPoint); //鼠标移动方向
        switch (quadrant1) {
          case "1":
          case "2":
            if (quadrant2 == "1" || quadrant2 == "2") currentFrame = currentFrame + d;else if (quadrant2 == "3" || quadrant2 == "4") currentFrame = currentFrame - d;else if (quadrant2 == "+x" || quadrant2 == "-x") currentFrame = currentFrame + (currentPoint.x - historyPoint.x);else if (quadrant1 == "1" && (quadrant2 == "+y" || quadrant2 == "-y")) currentFrame = currentFrame - (currentPoint.y - historyPoint.y);else if (quadrant1 == "2" && (quadrant2 == "+y" || quadrant2 == "-y")) currentFrame = currentFrame + (currentPoint.y - historyPoint.y);
            break;
          case "3":
          case "4":
            if (quadrant2 == "3" || quadrant2 == "4") currentFrame = currentFrame + d;else if (quadrant2 == "1" || quadrant2 == "2") currentFrame = currentFrame - d;else if (quadrant2 == "+x" || quadrant2 == "-x") currentFrame = currentFrame - (currentPoint.x - historyPoint.x);else if (quadrant1 == "3" && (quadrant2 == "+y" || quadrant2 == "-y")) currentFrame = currentFrame + (currentPoint.y - historyPoint.y);else if (quadrant1 == "4" && (quadrant2 == "+y" || quadrant2 == "-y")) currentFrame = currentFrame - (currentPoint.y - historyPoint.y);
            break;
          case "+x":
            if (quadrant2 == "1" || quadrant2 == "2") currentFrame = currentFrame + d;else if (quadrant2 == "3" || quadrant2 == "4") currentFrame = currentFrame - d;else if (quadrant2 == "+x" || quadrant2 == "-x") currentFrame = currentFrame + (currentPoint.x - historyPoint.x);
            break;
          case "-x":
            if (quadrant2 == "1" || quadrant2 == "2") currentFrame = currentFrame - d;else if (quadrant2 == "3" || quadrant2 == "4") currentFrame = currentFrame + d;else if (quadrant2 == "+x" || quadrant2 == "-x") currentFrame = currentFrame - (currentPoint.x - historyPoint.x);
            break;
          case "+y":
            if (quadrant2 == "1" || quadrant2 == "4") currentFrame = currentFrame - d;else if (quadrant2 == "2" || quadrant2 == "3") currentFrame = currentFrame + d;else if (quadrant2 == "+y" || quadrant2 == "-y") currentFrame = currentFrame + (currentPoint.y - historyPoint.y);
            break;
          case "-y":
            if (quadrant2 == "1" || quadrant2 == "4") currentFrame = currentFrame + d;else if (quadrant2 == "2" || quadrant2 == "3") currentFrame = currentFrame - d;else if (quadrant2 == "+y" || quadrant2 == "-y") currentFrame = currentFrame - (currentPoint.y - historyPoint.y);
            break;
        }
        if (currentFrame <= 0) currentFrame = 0;
        if (currentFrame >= duration) currentFrame = duration;
        t1.seek(currentFrame);
        updateTurnState();
        historyPoint = currentPoint;
        //处理触发点列表
        for (i = 0; i < cuePoints.length; i++) {
          if (cuePoints[i].mouseEnter == false && currentFrame >= cuePoints[i].cueStart && currentFrame <= cuePoints[i].cueEnd) {
            cuePoints[i].mouseEnter = true;
            cuePoints[i].mouseLeave = false;
            if (cuePoints[i].valueStart > 0) Xut.Assist.Run(parameter.pageType, cuePoints[i].valueStart, null);
            break;
          } else if (cuePoints[i].mouseEnter == true && cuePoints[i].mouseLeave == false && (currentFrame < cuePoints[i].cueStart || currentFrame > cuePoints[i].cueEnd)) {
            cuePoints[i].mouseEnter = false;
            cuePoints[i].mouseLeave = true;
            if (cuePoints[i].valueEnd > 0) Xut.Assist.Run(parameter.pageType, cuePoints[i].valueEnd, null);
            break;
          }
        }
      };

      var objectId = object[0].id;
      if (parameter.gesture.controlType == 1) {
        objectId = controlId;
      }

      new MoveMent(parameter.pageType, controlId, objectId, startEvent, moveEvent, moveEnd);
    }
    //贝赛尔曲线参数构造
    var bezierObj = {
      type: "soft",
      values: quArr,
      autoRotate: autoRotate
    };
    if (isCurve == true) {
      bezierObj = {
        curviness: 0, //curviness圆滑度(数字越大越圆滑),默认为1,0是直线运动
        values: quArr,
        autoRotate: autoRotate
      };
    }
    //实例化动画参数
    if (degree == 0) {
      t1.to(object, duration, {
        scale: scaleFactor,
        bezier: bezierObj,
        repeat: subRepeat,
        yoyo: autoReverse,
        onUpdate: updateTurnState,
        ease: parameter.tweenEase
      });
    } else {
      switch (axis) {
        default:
        case 0:
          //Z轴
          t1.to(object, duration, {
            scale: scaleFactor,
            rotation: degree + "deg",
            bezier: bezierObj,
            repeat: subRepeat,
            yoyo: autoReverse,
            onUpdate: updateTurnState,
            ease: parameter.tweenEase
          });
          break;
        case 1:
          //X轴
          t1.to(object, duration, {
            scale: scaleFactor,
            rotationX: degree + "deg",
            bezier: bezierObj,
            repeat: subRepeat,
            yoyo: autoReverse,
            onUpdate: updateTurnState,
            ease: parameter.tweenEase
          });
          break;
        case 2:
          //Y轴
          t1.to(object, duration, {
            scale: scaleFactor,
            rotationY: degree + "deg",
            bezier: bezierObj,
            repeat: subRepeat,
            yoyo: autoReverse,
            onUpdate: updateTurnState,
            ease: parameter.tweenEase
          });
          break;
      }
    }

    //初始化定位(百分比)
    if (parameter.gesture && parameter.gesture.initPos > 0) {
      currentFrame = duration * parameter.gesture.initPos;
      t1.seek(currentFrame);
    }

    return t1;

    function updateTurnState() {
      /*var sel=object[0]
      sel.style.display = 'none';
      sel.offsetHeight;
      sel.style.display = 'block';*/
      if (autoTurn == false) return;
      var oldOffset = currentOffset;
      currentOffset = object.offset();
      if (turnState == "") {
        if (currentOffset.left > oldOffset.left) {
          turnState = "left";
        } else if (currentOffset.left < oldOffset.left) {
          turnState = "right";
        }
      } else {
        if (currentOffset.left > oldOffset.left) {
          if (turnState == "right") {
            if (currentDegree == 0) currentDegree = 180;else currentDegree = 0;
            TweenLite.set(object.children(), {
              rotationY: currentDegree
            });
            turnState = "left";
          }
        } else if (currentOffset.left < oldOffset.left) {
          if (turnState == "left") {
            if (currentDegree == 0) currentDegree = 180;else currentDegree = 0;
            TweenLite.set(object.children(), {
              rotationY: currentDegree
            });
            turnState = "right";
          }
        }
      }
    }
  };
}

var transformOrigin = Xut.style.transformOrigin;

/**
 * 旋转类动画
 * @param  {[type]} animproto [description]
 * @return {[type]}           [description]
 */
function rotate(animproto) {

  //基本旋转
  animproto.getEffectSwivel = function (parameter, object, isExit, duration, delay, repeat) {
    var direction = parameter.direction; //方向（水平：DirectionHorizontal、垂直：DirectionVertical
    var t1 = null;
    var easeString = Linear.easeNone;
    if (parameter.tweenEase && parameter.tweenEase.length > 0) easeString = parameter.tweenEase;
    if (isExit == false) {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object, {
          visibility: "visible"
        }],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object]
      });
      switch (direction) {
        case "DirectionHorizontal":
          t1.from(object, duration, {
            rotationY: "480deg",
            ease: easeString
          });
          break;
        case "DirectionVertical":
          t1.from(object, duration, {
            rotationX: "480deg",
            ease: easeString
          });
          break;
        default:
          console.log("getEffectSwivel:parameter error.");
          break;
      }
    } else {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object, {
          visibility: "hidden"
        }]
      });
      switch (direction) {
        case "DirectionHorizontal":
          t1.to(object, duration, {
            rotationY: "480deg",
            ease: easeString
          });
          break;
        case "DirectionVertical":
          t1.to(object, duration, {
            rotationX: "480deg",
            ease: easeString
          });
          break;
        default:
          console.log("getEffectSwivel:parameter error.");
          break;
      }
    }
    return t1;
  };

  //陀螺旋转
  animproto.getEffectSpin = function (parameter, object, duration, delay, repeat) {
    var degree = parameter.amount ? parameter.amount : 360; //陀螺旋转角度
    if (Math.abs(parameter.degree) > 0) degree = parameter.degree;
    if (parameter.clockWise == 0) degree = 0 - degree; //逆时针旋转

    switch (parameter.centerPos) {
      case 1:
        //左上角
        object.css(transformOrigin, "left top");
        break;
      case 2:
        //上边中心
        object.css(transformOrigin, "center top");
        break;
      case 3:
        //右上角
        object.css(transformOrigin, "right top");
        break;
      case 4:
        //左边中心
        object.css(transformOrigin, "left cneter");
        break;
      case 5:
        //右边中心
        object.css(transformOrigin, "right center");
        break;
      case 6:
        //左下角
        object.css(transformOrigin, "left bottom");
        break;
      case 7:
        //下边中心
        object.css(transformOrigin, "center bottom");
        break;
      case 8:
        //右下角
        object.css(transformOrigin, "right bottom");
        break;
      case 0:
      default:
        //默认中心0
        object.css(transformOrigin, "center");
        break;
    }

    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    //t1.to(object, duration, {rotation:degree+"deg",ease:parameter.tweenEase});
    switch (parameter.axis) {
      case 1:
        //X轴
        t1.to(object, duration, {
          rotationX: "+=" + degree + "deg",
          ease: parameter.tweenEase
        });
        break;
      case 2:
        //Y轴
        t1.to(object, duration, {
          rotationY: "+=" + degree + "deg",
          ease: parameter.tweenEase
        });
        break;
      case 0: //Z轴
      default:
        t1.to(object, duration, {
          rotation: "+=" + degree + "deg",
          ease: parameter.tweenEase
        });
        break;
    }
    return t1;
  };

  //飞旋
  animproto.getEffectBoomerang = function (parameter, object, isExit, duration, delay, repeat) {
    var t1 = null;
    var time = duration / 3;
    if (isExit == false) {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object]
      });
      t1.add(TweenMax.to(object, 0.01, {
        x: 300,
        y: -200,
        rotation: "-60deg"
      }), "first");
      t1.add(TweenMax.to(object, time, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        rotation: "0deg"
      }), "second");
      t1.add(TweenMax.to(object, time, {
        rotationY: "-80deg"
      }), "second");
      t1.add(TweenMax.to(object, time, {
        rotationY: "0deg"
      }));
    } else {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object, {
          opacity: 1,
          x: 0,
          y: 0,
          rotation: "0deg"
        }]
      });
      t1.add(TweenMax.to(object, time, {
        rotationY: "-80deg"
      }), "frist");
      t1.add(TweenMax.to(object, time, {
        autoAlpha: 0,
        x: 300,
        y: -200,
        rotation: "-60deg"
      }), "second");
      t1.add(TweenMax.to(object, time, {
        rotationY: "0deg"
      }), "second");
    }
    return t1;
  };

  //中心旋转
  animproto.getEffectCenterRevolve = function (parameter, object, isExit, duration, delay, repeat) {
    var t1 = null;
    var easeString = Power1.easeInOut;
    if (parameter.tweenEase && parameter.tweenEase.length > 0) easeString = parameter.tweenEase;
    if (isExit == false) {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object, {
          visibility: "visible"
        }],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object]
      });
      t1.from(object, duration, {
        bezier: {
          type: "cubic",
          values: [{
            x: 0,
            y: 0
          }, {
            x: 200,
            y: 100
          }, {
            x: 200,
            y: 200
          }, {
            x: 0,
            y: 300
          }]
        },
        ease: easeString
      });
    } else {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object, {
          visibility: "hidden"
        }]
      });
      t1.to(object, duration, {
        bezier: {
          type: "cubic",
          values: [{
            x: 0,
            y: 0
          }, {
            x: 200,
            y: 100
          }, {
            x: 200,
            y: 200
          }, {
            x: 0,
            y: 300
          }]
        },
        ease: easeString
      });
    }
    return t1;
  };

  //回旋
  animproto.getEffectSpinner = function (parameter, object, isExit, duration, delay, repeat) {
    var t1 = null;
    var easeString = Expo.easeOut;
    if (parameter.tweenEase && parameter.tweenEase.length > 0) easeString = parameter.tweenEase;
    if (isExit == false) {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object, {
          visibility: "visible"
        }],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object]
      });
      t1.from(object, duration, {
        scale: 0,
        rotation: "180deg",
        ease: easeString
      });
    } else {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object, {
          visibility: "hidden",
          scale: 1,
          rotation: "0deg"
        }]
      });
      t1.to(object, duration, {
        scale: 0,
        rotation: "180deg",
        ease: easeString
      });
    }
    return t1;
  };

  //旋转(淡出式回旋)
  animproto.getEffectFadedSwivel = function (parameter, object, isExit, duration, delay, repeat) {
    var t1 = null;
    var easeString = Linear.easeNone;
    var degree = Math.abs(parameter.degree) > 0 ? Number(parameter.degree) : 90;
    if (parameter.clockWise == 0) degree = 0 - degree; //逆时针旋转
    switch (parameter.centerPos) {
      case 1:
        //左上角
        object.css(transformOrigin, "left top");
        break;
      case 2:
        //上边中心
        object.css(transformOrigin, "center top");
        break;
      case 3:
        //右上角
        object.css(transformOrigin, "right top");
        break;
      case 4:
        //左边中心
        object.css(transformOrigin, "left cneter");
        break;
      case 5:
        //右边中心
        object.css(transformOrigin, "right center");
        break;
      case 6:
        //左下角
        object.css(transformOrigin, "left bottom");
        break;
      case 7:
        //下边中心
        object.css(transformOrigin, "center bottom");
        break;
      case 8:
        //右下角
        object.css(transformOrigin, "right bottom");
        break;
      case 0:
      default:
        //默认中心0
        object.css(transformOrigin, "center");
        break;
    }
    if (parameter.tweenEase && parameter.tweenEase.length > 0) easeString = parameter.tweenEase;
    if (isExit == false) {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object]
      });
      //t1.from(object,duration,{autoAlpha:0,rotationY:"540deg",ease:Linear.easeNone}); //PPT默认效果
      switch (parameter.axis) {
        case 0:
          //Z轴
          t1.from(object, duration, {
            autoAlpha: 0,
            rotation: degree + "deg",
            ease: easeString,
            immediateRender: false
          });
          break;
        case 1:
          //X轴
          t1.from(object, duration, {
            autoAlpha: 0,
            rotationX: degree + "deg",
            ease: easeString,
            immediateRender: false
          });
          break;
        case 2: //Y轴
        default:
          t1.from(object, duration, {
            autoAlpha: 0,
            rotationY: degree + "deg",
            ease: easeString,
            immediateRender: false
          });
          break;
      }
    } else {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object, {
          opacity: 1
        }]
      });
      //t1.to(object,duration,{autoAlpha:0,rotationY:"540deg",ease:Linear.easeNone}); //PPT默认效果
      switch (parameter.axis) {
        case 0:
          //Z轴
          t1.to(object, duration, {
            autoAlpha: 0,
            rotation: degree + "deg",
            ease: easeString
          });
          break;
        case 1:
          //X轴
          t1.to(object, duration, {
            autoAlpha: 0,
            rotationX: degree + "deg",
            ease: easeString
          });
          break;
        case 2: //Y轴
        default:
          t1.to(object, duration, {
            autoAlpha: 0,
            rotationY: degree + "deg",
            ease: easeString
          });
          break;
      }
    }
    return t1;
  };
}

var filter$2 = Xut.style.filter;

function special(animproto) {

  //文字动画
  animproto.getTextAnimation = function (parameter, object, duration, delay, repeat) {
    if (delay == 0) delay = 0.1; //子对象间延时不能为0
    var type = parameter.effectType ? parameter.effectType : "text1";
    var color = parameter.startColor ? parameter.startColor : "";
    var svgElement = object.find("svg").children();
    var t1 = new TimelineMax({
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object, {
        visibility: "visible"
      }],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    switch (type) {
      default:
      case "text5": //文字逐行蹦出(以行为单位)
      case "text1":
        //文字逐个蹦出(以字为单位)
        t1.staggerFrom(svgElement.children(), duration, {
          css: {
            'opacity': 0
          }
        }, delay);
        break;
      case "text2":
        //文字放大出现(以字为单位)
        t1.staggerFrom(svgElement.children(), duration, {
          css: {
            'opacity': 0,
            "font-size": 120
          },
          ease: "Strong.easeOut"
        }, delay);
        break;
      case "text3":
        //文字缩小出现(以字为单位)
        t1.staggerFrom(svgElement.children(), duration, {
          css: {
            'opacity': 0,
            "font-size": 0
          },
          ease: "Power1.easeIn"
        }, delay);
        break;
      case "text4":
        //文字渐变出现(以字为单位)
        t1.staggerFrom(svgElement.children(), duration, {
          css: {
            'opacity': 0,
            "fill": color
          },
          ease: "Power1.easeIn"
        }, delay);
        break;
    }
    return t1;
  };

  //脉冲
  animproto.getEffectFlashBulb = function (parameter, object, duration, delay, repeat) {
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    var range = Number(parameter.range) ? parameter.range : 0.1;
    var time = duration / 2;
    t1.to(object, time, {
      autoAlpha: 0.5,
      scale: "+=" + range
    }).to(object, time, {
      autoAlpha: 1,
      scale: "-=" + range
    });
    return t1;
  };

  //百叶窗
  animproto.getEffectBlinds = function (parameter, object, isExit, duration, delay, repeat) {
    if (this.useMask == false) return this.getEffectAppear(parameter, object, isExit, duration, delay, repeat);

    var direction = parameter.direction; //方向（水平：DirectionHorizontal、垂直：DirectionVertical）
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object, {
        visibility: "visible"
      }],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    t1.to(object, duration, {
      onUpdate: updateEffectBlinds
    });
    return t1;

    function updateEffectBlinds() {
      var num = 6; //分成N等份
      var progress = t1.progress();
      var percent = progress / num;
      var avg = 1 / num;
      var temp = 0.01; //渐变的过渡区
      var str = "";
      if (isExit == false) {
        switch (direction) {
          case "DirectionHorizontal":
            //水平
            str = "-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,1)), to(rgba(0,0,0,0))" + ",color-stop(" + percent + ",rgba(0,0,0,1))" + ",color-stop(" + (percent + temp) + ",rgba(0,0,0,0))";
            for (var i = 1; i < num; i++) {
              str += ",color-stop(" + i * avg + ",rgba(0,0,0,0))" + ",color-stop(" + (i * avg + temp) + ",rgba(0,0,0,1))";
              str += ",color-stop(" + (i * avg + percent) + ",rgba(0,0,0,1))" + ",color-stop(" + (i * avg + percent + temp) + ",rgba(0,0,0,0))";
            }
            str += ")";
            break;
          case "DirectionVertical":
            //垂直
            str = "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,1)), to(rgba(0,0,0,0))" + ",color-stop(" + percent + ",rgba(0,0,0,1))" + ",color-stop(" + (percent + temp) + ",rgba(0,0,0,0))";
            for (var j = 1; j < num; j++) {
              str += ",color-stop(" + j * avg + ",rgba(0,0,0,0))" + ",color-stop(" + (j * avg + temp) + ",rgba(0,0,0,1))";
              str += ",color-stop(" + (j * avg + percent) + ",rgba(0,0,0,1))" + ",color-stop(" + (j * avg + percent + temp) + ",rgba(0,0,0,0))";
            }
            str += ")";
            break;
          default:
            console.log("getEffectBlinds:parameter error.");
            break;
        }
        object.css("-webkit-mask", str);
        if (percent >= avg - temp) object.css("-webkit-mask", "none");
      } else {
        switch (direction) {
          case "DirectionHorizontal":
            //水平
            str = "-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,1)), to(rgba(0,0,0,0))" + ",color-stop(" + (1 - percent) + ",rgba(0,0,0,0))" + ",color-stop(" + (1 - percent - temp) + ",rgba(0,0,0,1))";
            for (var n = 1; n < num; n++) {
              str += ",color-stop(" + n * avg + ",rgba(0,0,0,1))" + ",color-stop(" + (n * avg - temp) + ",rgba(0,0,0,0))";
              str += ",color-stop(" + (n * avg - percent) + ",rgba(0,0,0,0))" + ",color-stop(" + (n * avg - percent - temp) + ",rgba(0,0,0,1))";
            }
            str += ")";
            break;
          case "DirectionVertical":
            //垂直
            str = "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,1)), to(rgba(0,0,0,0))" + ",color-stop(" + (1 - percent) + ",rgba(0,0,0,0))" + ",color-stop(" + (1 - percent - temp) + ",rgba(0,0,0,1))";
            for (var k = 1; k < num; k++) {
              str += ",color-stop(" + k * avg + ",rgba(0,0,0,1))" + ",color-stop(" + (k * avg - temp) + ",rgba(0,0,0,0))";
              str += ",color-stop(" + (k * avg - percent) + ",rgba(0,0,0,0))" + ",color-stop(" + (k * avg - percent - temp) + ",rgba(0,0,0,1))";
            }
            str += ")";
            break;
          default:
            console.log("getEffectBlinds:parameter error.");
            break;
        }
        object.css("-webkit-mask", str);
        if (percent >= avg - temp) {
          //object.css("opacity","0");
          object.css("visibility", "hidden");
          object.css("-webkit-mask", "none");
        }
      }
    }
  };

  //劈裂
  animproto.getEffectSplit = function (parameter, object, isExit, duration, delay, repeat) {
    if (this.useMask == false) return this.getEffectAppear(parameter, object, isExit, duration, delay, repeat);

    var direction = parameter.direction; //方向(DirectionVerticalIn、DirectionHorizontalIn、DirectionHorizontalOut、DirectionVerticalOut)
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object, {
        visibility: "visible"
      }],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    t1.to(object, duration, {
      onUpdate: updateEffectSplit
    });
    return t1;

    function updateEffectSplit() {
      var progress = t1.progress();
      var percent = progress / 2;
      if (isExit == false) {
        if (progress > 0.9) {
          //跳过最后10%（解决iPad的闪问题）
          object.css("-webkit-mask", "none");
          return;
        }
        switch (direction) {
          case "DirectionVerticalIn":
            //左右向中间收
            object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (percent - 0.05) + ",rgba(0,0,0,1)),color-stop(" + percent + ",rgba(0,0,0,0)),color-stop(" + (1 - percent) + ",rgba(0,0,0,0)),color-stop(" + (1 - percent + 0.05) + ",rgba(0,0,0,1)))");
            break;
          case "DirectionHorizontalIn":
            //上下向中间收
            object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (percent - 0.05) + ",rgba(0,0,0,1)),color-stop(" + percent + ",rgba(0,0,0,0)),color-stop(" + (1 - percent) + ",rgba(0,0,0,0)),color-stop(" + (1 - percent + 0.05) + ",rgba(0,0,0,1)))");
            break;
          case "DirectionHorizontalOut":
            //中间向上下展开
            object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,0)), to(rgba(0,0,0,0)),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,0)),color-stop(" + (0.55 - percent) + ",rgba(0,0,0,1)),color-stop(" + (0.5 + percent) + ",rgba(0,0,0,1)),color-stop(" + (percent + 0.55) + ",rgba(0,0,0,0)))");
            break;
          case "DirectionVerticalOut":
            //中间向左右展开
            object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,0)), to(rgba(0,0,0,0)),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,0)),color-stop(" + (0.55 - percent) + ",rgba(0,0,0,1)),color-stop(" + (0.5 + percent) + ",rgba(0,0,0,1)),color-stop(" + (percent + 0.55) + ",rgba(0,0,0,0)))");
            break;
          default:
            console.log("getEffectSplit:parameter error.");
            break;
        }
        //if (percent >= 0.5) object.css("-webkit-mask", "none");
      } else {
        if (progress < 0.1) return; //跳过前面10%（解决iPad的闪问题）
        switch (direction) {
          case "DirectionVerticalIn":
            //左右向中间收
            object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,0)), to(rgba(0,0,0,0)),color-stop(" + (percent - 0.05) + ",rgba(0,0,0,0)),color-stop(" + percent + ",rgba(0,0,0,1)),color-stop(" + (1 - percent) + ",rgba(0,0,0,1)),color-stop(" + (1 - percent + 0.05) + ",rgba(0,0,0,0)))");
            break;
          case "DirectionHorizontalIn":
            //上下向中间收
            object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,0)), to(rgba(0,0,0,0)),color-stop(" + (percent - 0.05) + ",rgba(0,0,0,0)),color-stop(" + percent + ",rgba(0,0,0,1)),color-stop(" + (1 - percent) + ",rgba(0,0,0,1)),color-stop(" + (1 - percent + 0.05) + ",rgba(0,0,0,0)))");
            break;
          case "DirectionHorizontalOut":
            //中间向上下展开
            object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,1)),color-stop(" + (0.55 - percent) + ",rgba(0,0,0,0)),color-stop(" + (0.5 + percent) + ",rgba(0,0,0,0)),color-stop(" + (percent + 0.55) + ",rgba(0,0,0,1)))");
            break;
          case "DirectionVerticalOut":
            //中间向左右展开
            object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,1)),color-stop(" + (0.55 - percent) + ",rgba(0,0,0,0)),color-stop(" + (0.5 + percent) + ",rgba(0,0,0,0)),color-stop(" + (percent + 0.55) + ",rgba(0,0,0,1)))");
            break;
          default:
            console.log("getEffectSplit:parameter error.");
            break;
        }
        if (percent >= 0.5) {
          //object.css("opacity","0");
          object.css("visibility", "hidden");
          object.css("-webkit-mask", "none");
        }
      }
    }
  };

  //擦除
  animproto.getEffectWipe = function (parameter, object, isExit, duration, delay, repeat) {
    var direction = parameter.direction; //方向(上下左右)
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object, {
        visibility: "visible"
      }],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    var objInfo = this._getObjectInfo(object);
    if (isExit == false) {
      //t1.to(object,duration,{onStart:this._startHandler,onStartParams:[object],onUpdate:this.updateLineGradient,onUpdateParams:[t1,object,isExit,direction]});
      t1.to(object, duration, {
        onUpdate: this._updateClipRect,
        onUpdateParams: [t1, object, isExit, direction, objInfo]
      });
    } else {
      //t1.to(object,duration,{onUpdate:this.updateLineGradient,onUpdateParams:[t1,object,isExit,direction]});
      t1.to(object, duration, {
        onUpdate: this._updateClipRect,
        onUpdateParams: [t1, object, isExit, direction, objInfo]
      });
    }
    return t1;
  };

  //翻转式由远及近
  animproto.getEffectGrowAndTurn = function (parameter, object, isExit, duration, delay, repeat) {
    var t1 = null;
    if (isExit == false) {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object]
      });
      t1.from(object, duration, {
        autoAlpha: 0,
        scale: 0,
        rotation: "90deg",
        ease: parameter.tweenEase,
        clearProps: "scale,rotation"
      });
    } else {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object, {
          opacity: 1,
          scale: 1,
          rotation: "0deg"
        }]
      });
      t1.to(object, duration, {
        autoAlpha: 0,
        scale: 0,
        rotation: "90deg",
        ease: parameter.tweenEase
      });
    }
    return t1;
  };

  //玩具风车
  animproto.getEffectPinwheel = function (parameter, object, isExit, duration, delay, repeat) {
    var t1 = null;
    if (isExit == false) {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object]
      });
      t1.from(object, duration, {
        autoAlpha: 0,
        scale: 0,
        rotation: "540deg",
        ease: parameter.tweenEase
      });
    } else {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object, {
          opacity: 1,
          scale: 1,
          rotation: "0deg"
        }]
      });
      t1.to(object, duration, {
        autoAlpha: 0,
        scale: 0,
        rotation: "540deg",
        ease: parameter.tweenEase
      });
    }
    return t1;
  };

  //展开/收缩
  animproto.getEffectExpand = function (parameter, object, isExit, duration, delay, repeat) {
    var t1 = null;
    if (isExit == false) {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object]
      });
      t1.from(object, duration, {
        autoAlpha: 0,
        rotationY: "45deg",
        ease: parameter.tweenEase
      });
    } else {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object, {
          opacity: 1,
          rotationY: "0deg"
        }]
      });
      t1.to(object, duration, {
        autoAlpha: 0,
        rotationY: "45deg",
        ease: parameter.tweenEase
      });
    }
    return t1;
  };

  //浮动
  animproto.getEffectFloat = function (parameter, object, isExit, duration, delay, repeat) {
    var t1 = null;
    var objInfo = this._getObjectInfo(object);
    var x, y;
    if (isExit == false) {
      x = objInfo.offsetRight + objInfo.width;
      y = 0 - (objInfo.offsetTop + objInfo.height);
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object]
      });
      t1.from(object, duration, {
        autoAlpha: 0,
        rotation: "-45deg",
        x: x,
        y: y,
        ease: parameter.tweenEase
      });
    } else {
      x = objInfo.offsetRight + objInfo.width;
      y = 0 - (objInfo.offsetTop + objInfo.height);
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object, {
          opacity: 1
        }]
      });
      t1.to(object, duration, {
        autoAlpha: 0,
        rotation: "-45deg",
        x: x,
        y: y,
        ease: parameter.tweenEase
      });
    }
    return t1;
  };

  //字幕式
  animproto.getEffectCredits = function (parameter, object, isExit, duration, delay, repeat) {
    var objInfo = this._getObjectInfo(object);
    var y = 0,
        top = 0;
    if (isExit == false) {
      //从下往上移
      y = 0 - (this.visualHeight + objInfo.height);
      top = objInfo.top + objInfo.offsetBottom + objInfo.height;
    } else {
      //从上往下移
      y = this.visualHeight + objInfo.height;
      top = objInfo.top - (objInfo.offsetTop + objInfo.height);
    }
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object, {
        visibility: "visible",
        top: top + "px"
      }],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    t1.to(object, duration, {
      y: y,
      ease: parameter.tweenEase
    });
    return t1;
  };

  //弹跳
  animproto.getEffectBounce = function (parameter, object, isExit, duration, delay, repeat) {
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object, {
        visibility: "visible"
      }],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    var objInfo = this._getObjectInfo(object);

    var time2, time3, time4, time5, y1, y2, y3, y4, lastY, height, time1, total, width;

    if (isExit == false) {
      total = duration;
      time1 = total / 5;
      time2 = total / 10;
      time3 = total / 20;
      time4 = total / 40;
      time5 = total / 80;
      width = 50 + 20 + 10 + 5 + 2.5 + 1 + 0.5 + 0.2 + 0.1;
      height = this.visualHeight / 4;
      y1 = height / 2;
      y2 = height / 4;
      y3 = height / 8;
      y4 = height / 16;
      lastY = objInfo.offsetBottom - height + objInfo.height;

      t1.to(object, 0.01, {
        x: -width,
        y: -height
      }).to(object, time1, {
        x: "+=50",
        y: "+=" + height,
        ease: Circ.easeIn
      }) //慢到快
      .to(object, time1, {
        x: "+=20",
        y: "-=" + y1,
        scaleY: 0.8,
        ease: Circ.easeOut
      }) //快到慢
      .to(object, time1, {
        x: "+=10",
        y: "+=" + y1,
        scaleY: 1,
        ease: Circ.easeIn
      }).to(object, time2, {
        x: "+=5",
        y: "-=" + y2,
        scaleY: 0.85,
        ease: Circ.easeOut
      }).to(object, time2, {
        x: "+=2.5",
        y: "+=" + y2,
        scaleY: 1,
        ease: Circ.easeIn
      }).to(object, time3, {
        x: "+=1",
        y: "-=" + y3,
        scaleY: 0.9,
        ease: Circ.easeOut
      }).to(object, time3, {
        x: "+=0.5",
        y: "+=" + y3,
        scaleY: 1,
        ease: Circ.easeIn
      }).to(object, time4, {
        x: "+=0.2",
        y: "-=" + y4,
        scaleY: 0.95,
        ease: Circ.easeOut
      }).to(object, time4, {
        x: "+=0.1",
        y: "+=" + y4,
        scaleY: 1,
        ease: Circ.easeIn,
        clearProps: "x,y"
      });
      return t1;
    } else {
      total = duration;
      time1 = total / 5;
      time2 = total / 10;
      time3 = total / 20;
      time4 = total / 40;
      time5 = total / 80;
      height = this.visualHeight / 4;
      y1 = height / 2;
      y2 = height / 4;
      y3 = height / 8;
      y4 = height / 16;
      lastY = objInfo.offsetBottom - height + objInfo.height;
      t1.to(object, time1, {
        x: "+=50",
        y: "+=" + height,
        ease: Circ.easeIn
      }) //慢到快
      .to(object, time1, {
        x: "+=20",
        y: "-=" + y1,
        scaleY: 0.8,
        ease: Circ.easeOut
      }) //快到慢
      .to(object, time1, {
        x: "+=10",
        y: "+=" + y1,
        scaleY: 1,
        ease: Circ.easeIn
      }).to(object, time2, {
        x: "+=5",
        y: "-=" + y2,
        scaleY: 0.85,
        ease: Circ.easeOut
      }).to(object, time2, {
        x: "+=2.5",
        y: "+=" + y2,
        scaleY: 1,
        ease: Circ.easeIn
      }).to(object, time3, {
        x: "+=1",
        y: "-=" + y3,
        scaleY: 0.9,
        ease: Circ.easeOut
      }).to(object, time3, {
        x: "+=0.5",
        y: "+=" + y3,
        scaleY: 1,
        ease: Circ.easeIn
      }).to(object, time4, {
        x: "+=0.2",
        y: "-=" + y4,
        scaleY: 0.95,
        ease: Circ.easeOut
      }).to(object, time4, {
        x: "+=0.1",
        y: "+=" + y4,
        scaleY: 1,
        ease: Circ.easeIn
      }).to(object, time5, {
        x: "+=0.1",
        y: "+=" + lastY,
        ease: Circ.easeIn
      });
    }
    return t1;
  };

  //彩色脉冲
  animproto.getEffectFlicker = function (parameter, object, duration, delay, repeat) {
    if (!(filter$2 in object[0].style)) return new TimelineMax();
    //if (repeat < 2) repeat = 2; //默认三次
    var color2 = parameter.color2 ? parameter.color2 : "#fff"; //颜色
    var maxGlowSize = parameter.maxGlowSize ? parameter.maxGlowSize : 0.1; //光晕最大尺寸(百分比)
    var minGlowSize = parameter.minGlowSize ? parameter.minGlowSize : 0.05; //光晕最小尺寸(百分比)
    var size = object.width() > object.height() ? object.height() : object.width();
    var maxSize = maxGlowSize * size;
    var minSize = minGlowSize * size;
    var opacity = Number(parameter.opacity) ? parameter.opcity : 0.75; //不透明度
    var distance = Number(parameter.distance) ? parameter.distance * size : 0; //距离
    var color = colorHexToRGB(color2, opacity);
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object, {
        //"box-shadow": "none"
        filter: "none"
      }]
    });
    t1.to(object, duration, {
      onUpdate: updateEffectFlicker
    });
    return t1;

    function updateEffectFlicker() {
      var progress = t1.progress();
      var percent = parseInt(progress * (maxSize - minSize));
      if (progress > 0.5) percent = parseInt((1 - progress) * (maxSize - minSize));
      //object.css("box-shadow", distance + "px " + distance + "px " + minSize + "px " + (minSize + percent) + "px " + color);
      object.css(filter$2, "drop-shadow(" + color + " " + distance + "px " + distance + "px " + (minSize + percent) + "px)");
    }
  };

  //跷跷板
  animproto.getEffectTeeter = function (parameter, object, duration, delay, repeat) {
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    // var mode = parameter.mode;
    var range = Number(parameter.range) ? parameter.range : 0.02;
    var time = duration / 8; //计算指定动画时间内每次运动时间(总时长不变，循环除外)
    switch (parameter.mode) {
      case 1:
        //左右移动
        range = range * object.width();
        t1.to(object, time, {
          x: -range
        }).to(object, time * 2, {
          x: range
        });
        //for (var i = 1; i < repeat; i++) {
        t1.to(object, time * 2, {
          x: -range
        });
        t1.to(object, time * 2, {
          x: range
        });
        //}
        t1.to(object, time, {
          x: 0
        });
        break;
      case 2:
        //上下移动
        range = range * object.height();
        t1.to(object, time, {
          y: -range
        }).to(object, time * 2, {
          y: range
        });
        //for (var i = 1; i < repeat; i++) {
        t1.to(object, time * 2, {
          y: -range
        });
        t1.to(object, time * 2, {
          y: range
        });
        //}
        t1.to(object, time, {
          y: 0
        });
        break;
      case 3:
        //左右挤压
        t1.to(object, time, {
          scaleX: 1 + range
        }).to(object, time * 2, {
          scaleX: 1 - range
        });
        //for (var i = 1; i < repeat; i++) {
        t1.to(object, time * 2, {
          scaleX: 1 + range
        });
        t1.to(object, time * 2, {
          scaleX: 1 - range
        });
        //}
        t1.to(object, time, {
          scaleX: 1
        });
        break;
      case 4:
        //上下挤压
        t1.to(object, time, {
          scaleY: 1 + range
        }).to(object, time * 2, {
          scaleY: 1 - range
        });
        //for (var i = 1; i < repeat; i++) {
        t1.to(object, time * 2, {
          scaleY: 1 + range
        });
        t1.to(object, time * 2, {
          scaleY: 1 - range
        });
        //}
        t1.to(object, time, {
          scaleY: 1
        });
        break;
      case 0: //左右晃晃
      default:
        range = range * 100;
        t1.to(object, time, {
          rotation: range + "deg"
        }).to(object, time * 2, {
          rotation: -range + "deg"
        });
        //for (var i = 1; i < repeat; i++) {
        t1.to(object, time * 2, {
          rotation: range + "deg"
        });
        t1.to(object, time * 2, {
          rotation: -range + "deg"
        });
        //}
        t1.to(object, time, {
          rotation: "0deg"
        });
        break;
    }
    return t1;
  };

  //补色
  animproto.getEffectComplementaryColor = function (parameter, object, duration, delay, repeat) {
    var zIndex = Number(object.css("z-index"));
    if (isNaN(zIndex)) {
      zIndex = 10;
      console.log("The Z-index property for this object to get error.");
    }
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object, {
        "z-Index": zIndex + 100
      }],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object, {
        "z-Index": zIndex
      }]
    });
    t1.to(object, duration, {
      autoAlpha: 1
    });
    return t1;
  };

  //rect切割效果更新
  animproto._updateClipRect = function (t1, object, isExit, direction, objInfo) {
    var progress = t1.progress();
    var len = progress;
    var width, left, top, height;
    if (isExit == false) {
      top = objInfo.height * (1 - len);
      height = objInfo.height - top;
      left = objInfo.width * (1 - len);
      width = objInfo.width - left;
      switch (direction) {
        case "DirectionUp":
          object.css("clip", "rect(0px " + objInfo.width + "px " + height + "px 0px)");
          break;
        case "DirectionDown":
          object.css("clip", "rect(" + top + "px " + objInfo.width + "px " + objInfo.height + "px 0px)");
          break;
        case "DirectionLeft":
          object.css("clip", "rect(0px " + width + "px " + objInfo.height + "px 0px)");
          break;
        case "DirectionRight":
          object.css("clip", "rect(0px " + objInfo.width + "px " + objInfo.height + "px " + left + "px)");
          break;
        default:
          console.log("_updateClipRect:parameter error.");
          break;
      }
    } else {
      top = objInfo.height * len;
      height = objInfo.height - top;
      left = objInfo.width * len;
      width = objInfo.width - left;
      switch (direction) {
        case "DirectionUp":
          object.css("clip", "rect(" + top + "px " + objInfo.width + "px " + objInfo.height + "px 0px)");
          break;
        case "DirectionDown":
          object.css("clip", "rect(0px " + objInfo.width + "px " + height + "px 0px)");
          break;
        case "DirectionLeft":
          object.css("clip", "rect(0px " + objInfo.width + "px " + objInfo.height + "px " + left + "px)");
          break;
        case "DirectionRight":
          object.css("clip", "rect(0px " + width + "px " + objInfo.height + "px 0px)");
          break;
        default:
          console.log("_updateClipRect:parameter error.");
          break;
      }
    }
  };
}

/**
 * 缩放类动画
 * @param  {[type]} animproto [description]
 * @return {[type]}           [description]
 */
function zoom(animproto) {

  //基本缩放
  animproto.getEffectZoom = function (parameter, object, isExit, duration, delay, repeat) {
    var direction = parameter.direction; //方向(放大:DirectionIn、屏幕中心放大:DirectionInCenter、轻微放大:DirectionInSlightly、缩小:DirectionOut、屏幕底部缩小:DirectionOutBottom、轻微缩小:DirectionOutSlightly)
    var t1 = null;
    var result;
    object.css(Xut.style.transformOrigin, "center"); //设置缩放基点(默认是正中心点)
    if (isExit == false) {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object, {
          visibility: "visible"
        }],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object]
      });
      switch (direction) {
        case "DirectionIn":
          t1.from(object, duration, {
            scale: 0,
            ease: parameter.tweenEase
          });
          break;
        case "DirectionInCenter":
          result = this._getDirectionInCenter(object);
          t1.from(object, duration, {
            scale: 0,
            x: result.x,
            y: result.y,
            ease: parameter.tweenEase
          });
          break;
        case "DirectionInSlightly":
          t1.from(object, duration, {
            scale: 0.7,
            ease: parameter.tweenEase
          });
          break;
        case "DirectionOut":
          t1.from(object, duration, {
            scale: 3,
            ease: parameter.tweenEase
          });
          break;
        case "DirectionOutBottom":
          //屏幕底部缩小(理解为底部的中间开始)
          t1.from(object, duration, {
            scale: 2,
            top: this.visualWidth + "px",
            ease: parameter.tweenEase
          });
          break;
        case "DirectionOutSlightly":
          t1.from(object, duration, {
            scale: 1.5,
            ease: parameter.tweenEase
          });
          break;
        default:
          console.log("getEffectZoom:parameter error.");
          break;
      }
    } else {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object, {
          visibility: "hidden"
        }]
      });
      switch (direction) {
        case "DirectionIn":
          t1.to(object, duration, {
            scale: 0,
            ease: parameter.tweenEase
          });
          break;
        case "DirectionInCenter":
          result = this._getDirectionInCenter(object);
          t1.to(object, duration, {
            scale: 0,
            x: result.x,
            y: result.y,
            ease: parameter.tweenEase
          });
          break;
        case "DirectionInSlightly":
          t1.to(object, duration, {
            scale: 0.7,
            ease: parameter.tweenEase
          });
          break;
        case "DirectionOut":
          t1.to(object, duration, {
            scale: 3,
            ease: parameter.tweenEase
          });
          break;
        case "DirectionOutBottom":
          t1.to(object, duration, {
            scale: 2,
            top: this.visualHeight + "px",
            ease: parameter.tweenEase
          });
          break;
        case "DirectionOutSlightly":
          t1.to(object, duration, {
            scale: 1.5,
            ease: parameter.tweenEase
          });
          break;
        default:
          console.log("getEffectZoom:parameter error.");
          break;
      }
    }
    return t1;
  };

  //缩放 淡出式缩放
  animproto.getEffectFadedZoom = function (parameter, object, isExit, duration, delay, repeat) {
    var direction = parameter.direction; //方向(对象中心DirectionIn、幻灯片中心DirectionInCenter)
    var t1 = null;
    object.css(Xut.style.transformOrigin, "center"); //设置缩放基点(默认是正中心点)
    var svgElement = object.find("svg"); //获取SVG对象
    //解决SVG文字错乱问题
    if (svgElement) {
      Xut.style.setTranslate({
        node: svgElement,
        x: 0,
        y: 0
      });
    }

    var keepRatio = parameter.keepRatio == 0 ? false : true; //保持长宽比
    var fullScreen = parameter.fullScreen == 1 ? true : false; //缩放到全屏
    var scaleX = parameter.scaleX ? parameter.scaleX : 1; //横向缩放比例
    var scaleY = parameter.scaleY ? parameter.scaleY : 1; //纵向缩放比例
    var result;
    if (fullScreen == true) {
      //计算比例
      var xScale = this.visualWidth / object.width();
      var yScale = this.visualHeight / object.height();
      var scaleValue = xScale;
      if (xScale > yScale) scaleValue = yScale;
      result = this._getDirectionInCenter(object);
      if (isExit == false) {
        t1 = new TimelineMax({
          delay: delay,
          repeat: repeat,
          onStart: this._startHandler,
          onStartParams: [parameter, object, {
            opacity: 0
          }],
          onComplete: this._completeHandler,
          onCompleteParams: [parameter, object]
        });
        t1.to(object, duration, {
          x: result.x,
          y: result.y,
          autoAlpha: 1,
          scale: scaleValue,
          ease: parameter.tweenEase
        });
      } else {
        t1 = new TimelineMax({
          delay: delay,
          repeat: repeat,
          onStart: this._startHandler,
          onStartParams: [parameter, object],
          onComplete: this._completeHandler,
          onCompleteParams: [parameter, object]
        });
        t1.to(object, duration, {
          x: result.x,
          y: result.y,
          autoAlpha: 0,
          scale: scaleValue,
          ease: parameter.tweenEase
        });
      }
    } else if (isExit == false) {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object]
      });
      switch (direction) {
        case "DirectionIn":
          if (keepRatio == true) t1.from(object, duration, {
            autoAlpha: 0,
            scale: 0,
            ease: parameter.tweenEase
          });else {
            t1.from(object, duration, {
              autoAlpha: 0,
              scaleX: scaleX,
              scaleY: scaleY,
              ease: parameter.tweenEase
            });
          }
          break;
        case "DirectionInCenter":
          result = this._getDirectionInCenter(object);
          if (keepRatio == true) t1.from(object, duration, {
            x: result.x,
            y: result.y,
            autoAlpha: 0,
            scale: 0,
            ease: parameter.tweenEase
          });else t1.from(object, duration, {
            x: result.x,
            y: result.y,
            autoAlpha: 0,
            scaleX: scaleX,
            scaleY: scaleY,
            ease: parameter.tweenEase
          });
          break;
        default:
          console.log("getEffectFadedZoom:parameter error.");
          break;
      }
    } else {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object, {
          opacity: 1
        }]
      });
      switch (direction) {
        case "DirectionOut":
          if (keepRatio == true) t1.to(object, duration, {
            autoAlpha: 0,
            scale: 0,
            ease: parameter.tweenEase,
            clearProps: "scale"
          });else t1.to(object, duration, {
            autoAlpha: 0,
            scaleX: scaleX,
            scaleY: scaleY,
            ease: parameter.tweenEase
          });
          break;
        case "DirectionOutCenter":
          result = this._getDirectionInCenter(object);
          if (keepRatio == true) t1.to(object, duration, {
            x: result.x,
            y: result.y,
            autoAlpha: 0,
            scale: 0,
            ease: parameter.tweenEase
          });else t1.to(object, duration, {
            x: result.x,
            y: result.y,
            autoAlpha: 0,
            scaleX: scaleX,
            scaleY: scaleY,
            ease: parameter.tweenEase
          });
          break;
        default:
          console.log("getEffectFadedZoom:parameter error.");
          break;
      }
    }
    return t1;
  };

  //放大/缩小
  animproto.getEffectGrowShrink = function (parameter, object, duration, delay, repeat) {
    var scaleX = parameter.scaleX ? parameter.scaleX : 1; //横向缩放比例
    var scaleY = parameter.scaleY ? parameter.scaleY : 1; //纵向缩放比例
    // var keepRatio = (parameter.keepRatio == 0) ? false : true; //保持长宽比
    var fullScreen = parameter.fullScreen == 1 ? true : false; //缩放到全屏
    var resetSize = parameter.resetSize == 1 ? true : false; //恢复默认尺寸
    var easeString = Linear.easeNone; //Elastic.easeOut
    if (parameter.tweenEase && parameter.tweenEase.length > 0) easeString = parameter.tweenEase;
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    if (fullScreen == true) {
      //计算比例
      var xScale = this.visualWidth / object.width();
      var yScale = this.visualHeight / object.height();
      var scaleValue = xScale;
      if (xScale > yScale) scaleValue = yScale;
      var result = this._getDirectionInCenter(object);
      t1.to(object, duration, {
        x: result.x,
        y: result.y,
        scale: scaleValue,
        ease: parameter.tweenEase
      });
    } else if (resetSize == true) {
      t1.to(object, duration, {
        scaleX: 1,
        scaleY: 1,
        ease: easeString
      });
    } else t1.to(object, duration, {
      scaleX: scaleX,
      scaleY: scaleY,
      ease: easeString
    });
    return t1;
  };

  /**
   * 获取对象至屏幕中心的距离
   * @param  {[type]} object [description]
   * @return {[type]}        [description]
   */
  animproto._getDirectionInCenter = function (object) {
    var objInfo = this._getObjectInfo(object);
    var x = Math.round(this.visualWidth / 2 - objInfo.offsetLeft - objInfo.width / 2);
    var y = Math.round(this.visualHeight / 2 - objInfo.offsetTop - objInfo.height / 2);
    return {
      x: x,
      y: y
    };
  };
}

/**
 * 形状动画
 * @param  {[type]} animproto [description]
 * @return {[type]}           [description]
 */
function shape(animproto) {

  //形状一(圆)
  animproto.getEffectCircle = function (parameter, object, isExit, duration, delay, repeat) {
    if (this.useMask == false) return this.getEffectAppear(parameter, object, isExit, duration, delay, repeat);

    var direction = parameter.direction; //方向(DirectionIn、DirectionOut)
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object, {
        visibility: "visible"
      }],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    var result = this._getObjectInfo(object);
    var radius = Math.ceil(Math.sqrt(result.width * result.width / 4 + result.height * result.height / 4));
    switch (direction) {
      case "DirectionIn": //放大
      case "DirectionOut":
        //缩小
        if (isExit == false) {
          t1.to(object, duration, {
            onUpdate: updateCircleGradient
          });
        } else {
          t1.to(object, duration, {
            onUpdate: updateCircleGradient
          });
        }
        break;
      default:
        console.log("getEffectCircle:parameter error.");
        break;
    }
    return t1;

    function updateCircleGradient() {
      var progress = t1.progress();
      var len = parseInt(progress * radius);
      if (isExit == false) switch (direction) {
        case "DirectionIn":
          //DirectionIn放大
          object.css("-webkit-mask", "-webkit-gradient(radial,center center," + (radius - len) + ",center center,0,from(rgba(0,0,0,1)),to(rgba(0,0,0,0)),color-stop(10%,rgba(0,0,0,0)))");
          if (len == radius) object.css("-webkit-mask", "none");
          break;
        case "DirectionOut":
          //DirectionOut缩小
          object.css("-webkit-mask", "-webkit-gradient(radial,center center,0,center center, " + len + ",from(rgba(0,0,0,1)), to(rgba(0,0,0,0)), color-stop(90%, rgba(0,0,0,1)))");
          if (len == radius) object.css("-webkit-mask", "none");
          break;
      } else {
        switch (direction) {
          case "DirectionIn":
            //DirectionIn放大
            object.css("-webkit-mask", "-webkit-gradient(radial,center center," + (radius - len) + ",center center,0,from(rgba(0,0,0,0)),to(rgba(0,0,0,1)),color-stop(10%,rgba(0,0,0,1)))");
            if (len == radius) {
              //object.css("opacity","0");
              object.css("visibility", "hidden");
              object.css("-webkit-mask", "none");
            }
            break;
          case "DirectionOut":
            //DirectionOut缩小
            object.css("-webkit-mask", "-webkit-gradient(radial,center center,0,center center, " + len + ",from(rgba(0,0,0,0)), to(rgba(0,0,0,1)), color-stop(90%, rgba(0,0,0,0)))");
            if (len == radius) {
              //object.css("opacity","0");
              object.css("visibility", "hidden");
              object.css("-webkit-mask", "none");
            }
            break;
        }
      }
    }
  };

  //形状二(方框)
  animproto.getEffectBox = function (parameter, object, isExit, duration, delay, repeat) {
    var direction = parameter.direction; //方向(DirectionIn、DirectionOut)
    if (this.useMask == false) direction = "DirectionOut";

    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object, {
        visibility: "visible"
      }],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    var objInfo = this._getObjectInfo(object);
    t1.to(object, duration, {
      onUpdate: updateEffectBox
    });
    return t1;

    function updateEffectBox() {
      var width, height, left, top;
      var progress = t1.progress();
      var percent = progress / 2;
      if (isExit == false) {
        switch (direction) {
          case "DirectionIn":
            object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + percent + ",rgba(0,0,0,1)),color-stop(" + percent + ",transparent),color-stop(" + (1 - percent) + ",transparent),color-stop(" + (1 - percent) + ",rgba(0,0,0,1))),-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + percent + ",rgba(0,0,0,1)),color-stop(" + percent + ",transparent),color-stop(" + (1 - percent) + ",transparent),color-stop(" + (1 - percent) + ",rgba(0,0,0,1)))");
            break;
          case "DirectionOut":
            top = objInfo.height * (0.5 - percent);
            height = objInfo.height - top;
            left = objInfo.width * (0.5 - percent);
            width = objInfo.width - left;
            object.css("clip", "rect(" + top + "px " + width + "px " + height + "px " + left + "px)");
            break;
          default:
            console.log("getEffectBox:parameter error.");
            break;
        }
        if (percent >= 0.5) object.css("-webkit-mask", "none");
      } else {
        switch (direction) {
          case "DirectionIn":
            object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",transparent),color-stop(" + (0.5 + percent) + ",transparent),color-stop(" + (0.5 + percent) + ",rgba(0,0,0,1))),-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",transparent),color-stop(" + (0.5 + percent) + ",transparent),color-stop(" + (0.5 + percent) + ",rgba(0,0,0,1)))");
            break;
          case "DirectionOut":
            top = objInfo.height * percent;
            height = objInfo.height - top;
            left = objInfo.width * percent;
            width = objInfo.width - left;
            object.css("clip", "rect(" + top + "px " + width + "px " + height + "px " + left + "px)");
            break;
          default:
            console.log("getEffectBox:parameter error.");
            break;
        }
        if (percent >= 0.5) {
          //object.css("opacity","0");
          object.css("visibility", "hidden");
          object.css("-webkit-mask", "none");
        }
      }
    }
  };

  //形状三(菱形)
  animproto.getEffectDiamond = function (parameter, object, isExit, duration, delay, repeat) {
    if (this.useMask == false) return this.getEffectAppear(parameter, object, isExit, duration, delay, repeat);

    var direction = parameter.direction; //方向(DirectionIn、DirectionOut)
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object, {
        visibility: "visible"
      }],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    // var objInfo = this._getObjectInfo(object);
    t1.to(object, duration, {
      onUpdate: updateEffectBox
    });
    return t1;

    function updateEffectBox() {
      var progress = t1.progress();
      var percent = progress / 2;
      if (isExit == false) {
        switch (direction) {
          case "DirectionOut":
          case "DirectionIn":
            object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 100% 100%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + percent + ",rgba(0,0,0,1)),color-stop(" + percent + ",transparent),color-stop(" + (1 - percent) + ",transparent),color-stop(" + (1 - percent) + ",rgba(0,0,0,1))),-webkit-gradient(linear,0% 100%, 100% 0%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + percent + ",rgba(0,0,0,1)),color-stop(" + percent + ",transparent),color-stop(" + (1 - percent) + ",transparent),color-stop(" + (1 - percent) + ",rgba(0,0,0,1)))");
            break;
          default:
            console.log("getEffectBox:parameter error.");
            break;
        }
        if (percent >= 0.5) object.css("-webkit-mask", "none");
      } else {
        switch (direction) {
          case "DirectionOut":
          case "DirectionIn":
            object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 100% 100%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",transparent),color-stop(" + (0.5 + percent) + ",transparent),color-stop(" + (0.5 + percent) + ",rgba(0,0,0,1))),-webkit-gradient(linear,0% 100%, 100% 0%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",transparent),color-stop(" + (0.5 + percent) + ",transparent),color-stop(" + (0.5 + percent) + ",rgba(0,0,0,1)))");
            break;
          default:
            console.log("getEffectBox:parameter error.");
            break;
        }
        if (percent >= 0.5) {
          //object.css("opacity","0");
          object.css("visibility", "hidden");
          object.css("-webkit-mask", "none");
        }
      }
    }
  };

  //形状四(加号)
  animproto.getEffectPlus = function (parameter, object, isExit, duration, delay, repeat) {
    if (this.useMask == false) return this.getEffectAppear(parameter, object, isExit, duration, delay, repeat);

    var direction = parameter.direction; //方向(DirectionIn、DirectionOut)
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object, {
        visibility: "visible"
      }],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    t1.to(object, duration, {
      onUpdate: updateEffectPlus
    });
    return t1;

    function updateEffectPlus() {
      var progress = t1.progress();
      var percent = progress / 2;
      if (isExit == false) {
        switch (direction) {
          case "DirectionIn":
          case "DirectionOut":
            object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,0)), to(rgba(0,0,0,0))," + "color-stop(" + (0.5 - percent) + ",transparent),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,1))," + "color-stop(" + (0.5 + percent) + ",rgba(0,0,0,1)),color-stop(" + (0.5 + percent) + ",transparent))," + "-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,0)), to(rgba(0,0,0,0))," + "color-stop(" + (0.5 - percent) + ",transparent),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,1))," + "color-stop(" + (0.5 + percent) + ",rgba(0,0,0,1)),color-stop(" + (0.5 + percent) + ",transparent))");
            break;
          default:
            console.log("getEffectPlus:parameter error.");
            break;
        }
        if (percent >= 0.5) object.css("-webkit-mask", "none");
      } else {
        switch (direction) {
          case "DirectionIn":
          case "DirectionOut":
            object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,0)), to(rgba(0,0,0,0))," + "color-stop(" + percent + ",transparent),color-stop(" + percent + ",rgba(0,0,0,1))," + "color-stop(" + (1 - percent) + ",rgba(0,0,0,1)),color-stop(" + (1 - percent) + ",transparent))," + "-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,0)), to(rgba(0,0,0,0))," + "color-stop(" + percent + ",transparent),color-stop(" + percent + ",rgba(0,0,0,1))," + "color-stop(" + (1 - percent) + ",rgba(0,0,0,1)),color-stop(" + (1 - percent) + ",transparent))");
            break;
          default:
            console.log("getEffectPlus:parameter error.");
            break;
        }
        if (percent >= 0.5) {
          //object.css("opacity","0");
          object.css("visibility", "hidden");
          object.css("-webkit-mask", "none");
        }
      }
    }
  };
}

var ROUND = Math.round;
var CEIL$2 = Math.ceil;

var isMacOS = Xut.plat.isMacOS;
var isDesktop = Xut.plat.isDesktop;

/**
 * 参数说明
 * pageType: 页面类型
 * chapterId: 当前页ID
 * element: 动画对象
 * parameter: 动画参数数组
 * container: 父容器
 * hasLoop: 是否循环动画
 * startEvent: 整个动画开始事件
 * completeEvent: 整个动画结束事件
 **/

var Powepoint = function () {
  function Powepoint(pageIndex, pageType, chapterId, element, parameter, container, getStyle) {
    classCallCheck(this, Powepoint);


    if (_.isArray(parameter) && parameter.length) {
      this.options = parameter;
    } else {
      console.log("Animation options error is not Array.");
      return;
    }

    this.visualWidth = getStyle.visualWidth;
    this.visualHeight = getStyle.visualHeight;

    this.container = container || $(document.body); //父容器(主要用于手势控制路径动画)
    this.isDebug = false; //是否显示调试信息

    this.pageIndex = pageIndex;
    this.pageType = pageType;
    this.chapterId = chapterId;
    this.element = element;

    /**
     * 动画对象默认样式
     * @type {String}
     */
    this.elementStyle = '';

    /**
     * 初始化后对象状态
     * @type {String}
     */
    this.elementVisibility = 'visible';

    /**
     * 是否使用CSS渐变效果
     * @type {[type]}
     */
    this.useMask = isDesktop || isMacOS ? true : false;

    /**
     * 第一个动画参数（默认支持多个动画作用于一个对象）
     * @type {[type]}
     */
    this.parameter0 = null;

    /**
     * 第一个动画类型（进入/退出）
     * @type {Boolean}
     */
    this.isExit0 = false;

    /**
     * 动画前脚本
     * @type {String}
     */
    this.preCode = '';

    /**
     * 动画后脚本
     * @type {String}
     */
    this.postCode = '';

    /**
     * 延时
     * @type {Number}
     */
    this.codeDelay = 0;

    /**
     * 是否完全执行过(用于解决重复执行问题)
     * @type {Boolean}
     */
    this.isCompleted = false;

    /**
     * 初始对象状态:opacity(visibility)
     */
    this._initElement();
  }

  /**
   * 解析脚本代码
   * 包装能函数
   * @return {[type]} [description]
   */


  createClass(Powepoint, [{
    key: '_parseCode',
    value: function _parseCode(code1, code2) {
      if (code1 && code1.length > 0) {
        return makeJsonPack(code1);
      } else if (code2 && code2.length > 0) {
        return makeJsonPack(code2);
      }
    }

    /**
     * 解析延时脚本
     * @param  {[type]} code1 [description]
     * @param  {[type]} code2 [description]
     * @return {[type]}       [description]
     */

  }, {
    key: '_parseDelayCode',
    value: function _parseDelayCode(code1, code2) {
      if (code1 && code1.length > 0) {
        return code1;
      } else if (code2 && code2.length > 0) {
        return code2;
      }
    }

    /**
     * 根据数据库的设置
     * 对象初始化(visibility)
     * @return {[type]} [description]
     */

  }, {
    key: '_initElement',
    value: function _initElement() {

      var data = this.options[0];
      this.parameter0 = parseJSON(data.parameter);

      //为高级动画修改增加
      //2016.3.16
      this.parameter0.pageType = this.pageType;
      this.parameter0.pageIndex = this.pageIndex;

      this.isExit0 = this.parameter0.exit ? this.parameter0.exit.toLowerCase() == "true" : false;

      //获取动画前脚本
      this.preCode = this._parseCode(data.preCode, this.parameter0.preCode);

      //获取动画后脚本
      this.postCode = this._parseCode(data.postCode, this.parameter0.postCode);

      //获取延时时间
      this.codeDelay = this._parseDelayCode(data.codeDelay, this.parameter0.codeDelay);

      //给元素增加ppt属性标记
      if (!this.element.attr("data-pptAnimation")) {
        var animationName = data.animationName;

        //路径动画对象默认显示
        if (animationName.indexOf("EffectPath") == 0 || animationName == "EffectCustom") {
          this.element.css("visibility", "visible");
        } else {

          switch (animationName) {
            //强调动画默认显示
            case "EffectFlashBulb": //脉冲
            case "EffectFlicker": //彩色脉冲
            case "EffectTeeter": //跷跷板
            case "EffectSpin": //陀螺旋转
            case "EffectGrowShrink": //放大/缩小
            case "EffectDesaturate": //不饱和
            case "EffectDarken": //加深
            case "EffectLighten": //变淡
            case "EffectTransparency": //透明
            case "EffectColorBlend": //对象颜色
            case "EffectComplementaryColor": //补色
            case "EffectChangeLineColor": //线条颜色
            case "EffectChangeFillColor": //填允颜色
            case "EffectFlashOnce":
              //闪烁(一次)
              this.element.css("visibility", "visible");
              break;
            case "EffectCredits":
              //字幕式特殊处理
              this.element.css("visibility", "hidden");
              break;
            default:
              if (this.isExit0) this.element.css("visibility", "visible"); //退出动画默认显示
              else this.element.css("visibility", "hidden"); //进入动画默认隐藏
              break;
          }
        }

        //标识初始化状态
        this.element.attr("data-pptAnimation", true);
        this.elementStyle = this.element[0].style.cssText;
        this.elementVisibility = this.element.css("visibility");
      }
    }

    /**
     * 获取对象相关信息
     * @param  {[type]} object [description]
     * @return {[type]}        [description]
     */

  }, {
    key: '_getObjectInfo',
    value: function _getObjectInfo(object) {
      var width = ROUND(object.width()); //四舍五入取整
      var height = ROUND(object.height());
      var top = ROUND(parseInt(object.css("top")));
      var left = ROUND(parseInt(object.css("left")));
      var offsetTop = ROUND(object.offset().top);

      if (object.attr("offsetTop")) {
        offsetTop = parseInt(object.attr("offsetTop"));
      } else {
        object.attr("offsetTop", offsetTop);
      }

      var offsetBottom = CEIL$2(this.visualHeight - offsetTop - height);
      var offsetLeft = ROUND(object.offset().left);
      if (object.attr("offsetLeft")) {
        offsetLeft = parseInt(object.attr("offsetLeft"));
      } else {
        object.attr("offsetLeft", offsetLeft);
      }
      var offsetRight = CEIL$2(this.visualWidth - offsetLeft - width);

      return {
        width: width,
        height: height,
        top: top,
        left: left,
        offsetTop: offsetTop,
        offsetLeft: offsetLeft,
        offsetBottom: offsetBottom,
        offsetRight: offsetRight
      };
    }

    /**
     * 子动画通用开始事件
     * @param  {[type]} parameter [description]
     * @param  {[type]} object    [description]
     * @param  {[type]} params    [description]
     * @return {[type]}           [description]
     */

  }, {
    key: '_startHandler',
    value: function _startHandler(parameter, object, params) {
      for (var item in params) {
        switch (item) {
          case "x":
            TweenLite.set(object, {
              x: params[item]
            });
            break;
          case "y":
            TweenLite.set(object, {
              y: params[item]
            });
            break;
          case "rotation":
            TweenLite.set(object, {
              rotation: params[item]
            });
            break;
          case "rotationX":
            TweenLite.set(object, {
              rotationX: params[item]
            });
            break;
          case "rotationY":
            TweenLite.set(object, {
              rotationY: params[item]
            });
            break;
          case "scale":
            TweenLite.set(object, {
              scale: params[item]
            });
            break;
          default:
            object.css(item, params[item]);
            break;
        }
      }

      //ppt动画音频
      if (parameter.videoId > 0) {
        createContentAudio(parameter.chapterId, parameter.videoId);
      }

      /*eslint-disable */

      //ppt动画扩展处理
      if (parameter.pptanimation && parameter.pptanimation.pptapi) {

        var params = parameter.pptanimation.parameters ? parameter.pptanimation.parameters : {};
        switch (parameter.pptanimation.pptapi) {
          case "bonesWidget":
            //骨骼动画
            bonesWidget.updateAction(object.attr("id"), params.actList);
            break;
          case "spiritWidget":
            // if (window.spiritWidget) {
            updateAction(object.attr("id"), params);
            // }
            break;
        }
      }

      /*eslint-enable */
    }

    /**
     * 子动画通用结束事件
     * @param  {[type]} parameter [description]
     * @param  {[type]} object    [description]
     * @param  {[type]} params    [description]
     * @return {[type]}           [description]
     */

  }, {
    key: '_completeHandler',
    value: function _completeHandler(parameter, object, params) {
      for (var item in params) {
        switch (item) {
          case "x":
            TweenLite.set(object, {
              x: params[item]
            });
            break;
          case "y":
            TweenLite.set(object, {
              y: params[item]
            });
            break;
          case "rotation":
            TweenLite.set(object, {
              rotation: params[item]
            });
            break;
          case "rotationX":
            TweenLite.set(object, {
              rotationX: params[item]
            });
            break;
          case "rotationY":
            TweenLite.set(object, {
              rotationY: params[item]
            });
            break;
          case "scale":
            TweenLite.set(object, {
              scale: params[item]
            });
            break;
          default:
            object.css(item, params[item]);
            break;
        }
      }
    }

    /**
     * 返回动画对象
     * @param  {[type]} data  [description]
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */

  }, {
    key: '_getTimeline',
    value: function _getTimeline(data, index) {
      var object = this.element;
      var parameter = this.parameter0;
      var isExit = this.isExit0;
      if (index > 0 || this.parameter0 == null) {
        parameter = parseJSON(data.parameter);
        isExit = parameter.exit ? parameter.exit.toLowerCase() == "true" : false; //false:进入 true:消失
        if (index == 0) {
          this.parameter0 = parameter;
          this.isExit0 = isExit;
        }
      }
      var duration = data.speed / 1000; //执行时间
      var delay = data.delay / 1000; //延时时间
      if (navigator.epubReadingSystem) {
        //如果是epub阅读器则动画延时0.15秒
        delay += 0.15;
      }
      var repeat = data.repeat >= 0 ? data.repeat - 1 : 0; //重复次数
      parameter.pageType = this.pageType;
      parameter.chapterId = this.chapterId;
      parameter.animationName = data.animationName;
      //赋给动画音频Id
      parameter.videoId = data.videoId;

      var animationName = parameter.animationName;

      //文字动画
      if (animationName == "xxtTextEffect") {
        return this.getTextAnimation(parameter, object, duration, delay, repeat);
      }

      //路径动画
      if (animationName.indexOf("EffectPath") == 0 || animationName == "EffectCustom") {
        return this.getPathAnimation(parameter, object, duration, delay, repeat);
      }

      switch (animationName) {
        case "EffectFade":
          //淡出
          return this.getEffectFade(parameter, object, isExit, duration, delay, repeat);
        case "EffectFly":
          //飞入/飞出
          return this.getEffectFly(parameter, object, isExit, duration, delay, repeat);
        case "EffectAscend":
          //浮入/浮出(上升)
          return this.getEffectAscend(parameter, object, isExit, duration, delay, repeat);
        case "EffectDescend":
          //浮入/浮出(下降)
          return this.getEffectDescend(parameter, object, isExit, duration, delay, repeat);
        case "EffectSplit":
          //劈裂(分割)
          return this.getEffectSplit(parameter, object, isExit, duration, delay, repeat);
        case "EffectWipe":
          //擦除
          return this.getEffectWipe(parameter, object, isExit, duration, delay, repeat);
        case "EffectCircle":
          //形状一(圆)
          return this.getEffectCircle(parameter, object, isExit, duration, delay, repeat);
        case "EffectBox":
          //形状二(方框)
          return this.getEffectBox(parameter, object, isExit, duration, delay, repeat);
        case "EffectDiamond":
          //形状三(菱形)
          return this.getEffectDiamond(parameter, object, isExit, duration, delay, repeat);
        case "EffectPlus":
          //形状四(加号)
          return this.getEffectPlus(parameter, object, isExit, duration, delay, repeat);
        case "EffectGrowAndTurn":
          //翻转式由远及近
          return this.getEffectGrowAndTurn(parameter, object, isExit, duration, delay, repeat);
        case "EffectZoom":
          //基本缩放
          return this.getEffectZoom(parameter, object, isExit, duration, delay, repeat);
        case "EffectFadedZoom":
          //淡出式缩放
          return this.getEffectFadedZoom(parameter, object, isExit, duration, delay, repeat);
        case "EffectSwivel":
          //基本旋转
          return this.getEffectSwivel(parameter, object, isExit, duration, delay, repeat);
        case "EffectFadedSwivel":
          //旋转(淡出式回旋)
          return this.getEffectFadedSwivel(parameter, object, isExit, duration, delay, repeat);
        case "EffectBounce":
          //弹跳
          return this.getEffectBounce(parameter, object, isExit, duration, delay, repeat);
        case "EffectBlinds":
          //百叶窗
          return this.getEffectBlinds(parameter, object, isExit, duration, delay, repeat);
        case "EffectPeek":
          //切入/出
          return this.getEffectPeek(parameter, object, isExit, duration, delay, repeat);
        case "EffectExpand":
          //展开/收缩
          return this.getEffectExpand(parameter, object, isExit, duration, delay, repeat);
        case "EffectRiseUp":
          //升起/下沉
          return this.getEffectRiseUp(parameter, object, isExit, duration, delay, repeat);
        case "EffectCenterRevolve":
          //中心旋转
          return this.getEffectCenterRevolve(parameter, object, isExit, duration, delay, repeat);
        case "EffectSpinner":
          //回旋
          return this.getEffectSpinner(parameter, object, isExit, duration, delay, repeat);
        case "EffectFloat":
          //浮动
          return this.getEffectFloat(parameter, object, isExit, duration, delay, repeat);
        case "EffectSpiral":
          //螺旋飞入/出
          return this.getEffectSpiral(parameter, object, isExit, duration, delay, repeat);
        case "EffectPinwheel":
          //玩具风车
          return this.getEffectPinwheel(parameter, object, isExit, duration, delay, repeat);
        case "EffectCredits":
          //字幕式
          return this.getEffectCredits(parameter, object, isExit, duration, delay, repeat);
        case "EffectBoomerang":
          //飞旋
          return this.getEffectBoomerang(parameter, object, isExit, duration, delay, repeat);
        case "EffectArcUp":
          //曲线向上/下
          return this.getEffectArcUp(parameter, object, isExit, duration, delay, repeat);
        case "EffectFlashBulb":
          //脉冲
          return this.getEffectFlashBulb(parameter, object, duration, delay, repeat);
        case "EffectFlicker":
          //彩色脉冲
          return this.getEffectFlicker(parameter, object, duration, delay, repeat);
        case "EffectTeeter":
          //跷跷板
          return this.getEffectTeeter(parameter, object, duration, delay, repeat);
        case "EffectSpin":
          //陀螺旋转
          return this.getEffectSpin(parameter, object, duration, delay, repeat);
        case "EffectGrowShrink":
          //放大/缩小
          return this.getEffectGrowShrink(parameter, object, duration, delay, repeat);
        case "EffectDesaturate":
          //不饱和
          return this.getEffectDesaturate(parameter, object, duration, delay, repeat);
        case "EffectDarken":
          //加深
          return this.getEffectDarken(parameter, object, duration, delay, repeat);
        case "EffectLighten":
          //变淡
          return this.getEffectLighten(parameter, object, duration, delay, repeat);
        case "EffectTransparency":
          //透明
          return this.getEffectTransparency(parameter, object, duration, delay, repeat);
        case "EffectColorBlend":
          //对象颜色
          return new TimelineMax();
        case "EffectComplementaryColor":
          //补色
          return this.getEffectComplementaryColor(parameter, object, duration, delay, repeat);
        case "EffectChangeLineColor":
          //线条颜色
          return new TimelineMax();
        case "EffectChangeFillColor":
          //填允颜色
          return new TimelineMax();
        case "EffectFlashOnce":
          //闪烁(一次)
          return this.getEffectFlashOnce(parameter, object, duration, delay, repeat);
        //进入退出动画
        default:
        case "EffectAppear":
          //出现/消失
          return this.getEffectAppear(parameter, object, isExit, duration, delay, repeat);
      }
    }

    /**
     * 初始化
     * @param  {[type]} startEvent    [description]
     * @param  {[type]} completeEvent [description]
     * @return {[type]}               [description]
     */

  }, {
    key: '_initAnimation',
    value: function _initAnimation(completeEvent) {
      var self = this;

      /**
       * 整个动画完成事件(动画不需继续执行视为执行完成)
       * @return {[type]} [description]
       */
      var completeAction = function completeAction() {
        if (completeEvent && _.isFunction(completeEvent)) {
          completeEvent();
        }
      };

      var tl = new TimelineLite({
        paused: true,
        onStartParams: [this.preCode],
        onCompleteParams: [this.postCode, this.codeDelay],
        /**
         * 动画执行前的初始化
         * @param  {[type]} preCode [description]
         * @return {[type]}         [description]
         */
        onStart: function onStart(preCode) {
          //条件判断动画是否执行
          if (preCode && _.isFunction(preCode)) {
            self.animation.pause();
            var result = false;
            try {
              result = preCode();
            } catch (error) {
              console.log("Run preCode is error in startHandler:" + error);
            }
            if (result == true) self.animation.resume();else {
              self.animation.stop();
              completeAction();
            }
          }
        },

        /**
         * 动画完成
         * @param  {[type]} postCode  [description]
         * @param  {[type]} codeDelay [description]
         * @return {[type]}           [description]
         */
        onComplete: function onComplete(postCode, codeDelay) {
          self.isCompleted = true;

          //延迟执行postCode代码
          if (postCode) {
            try {
              //简单判断是函数可执行
              if (_.isFunction(postCode)) {
                if (codeDelay > 0) {
                  setTimeout(postCode, codeDelay);
                } else {
                  postCode();
                }
              }
            } catch (error) {
              console.log("Run postCode is error in completeHandler:" + error);
            }
          }
          completeAction();
        }
      });

      for (var i = 0; i < this.options.length; i++) {
        if (i == 0) {
          tl.add(this._getTimeline(this.options[i], i), "shape0");
        } else {
          var invokeMode = this.options[i].invokeMode;
          if (invokeMode == 2) tl.add(this._getTimeline(this.options[i], i));else tl.add(this._getTimeline(this.options[i], i), "shape0"); //"shape"+(i-1)
        }
      }
      return tl;
    }

    /**
     * 执行动画
     * @param  {[type]} scopeComplete [description]
     * @return {[type]}               [description]
     */

  }, {
    key: 'play',
    value: function play(animComplete) {
      if (this.isCompleted) {
        this.reset();
      }
      if (this.animation) {
        this.stop();
        animComplete && animComplete();
      } else {
        this.animation = this._initAnimation(animComplete);
      }
      this.animation.play();
    }

    /**
     * 停止动画
     * @return {[type]} [description]
     */

  }, {
    key: 'stop',
    value: function stop() {
      if (this.animation) {
        this.animation.stop();
        this.animation.kill();
        this.animation.clear();
        this.animation.vars = null;
      }
      this.animation = null;
    }

    /**
     * 复位动画
     * @return {[type]} [description]
     */

  }, {
    key: 'reset',
    value: function reset() {
      this.animation && this.stop();
      if (this.elementStyle && this.elementStyle.length) {
        var origin = this.element.css(Xut.style.transformOrigin);
        //卷滚区域里的对象不需要还原
        if (this.element.attr("data-iscroll") == null) {
          this.element[0].style.cssText = this.elementStyle;
        }
        this.element.css(Xut.style.transformOrigin, origin);
        this.element.css("visibility", this.elementVisibility);
        this.element.css(Xut.style.transform, "none");
        this.element[0]["_gsTransform"] = null; //清理对象上绑定的动画属性
      }
      this.isCompleted = false;
    }

    /**
     * 销毁动画
     * @return {[type]} [description]
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.stop();
      this.container = null;
      this.options = null;
      this.element = null;
    }
  }]);
  return Powepoint;
}();

fade(Powepoint.prototype);
fly(Powepoint.prototype);
path$1(Powepoint.prototype);
rotate(Powepoint.prototype);
special(Powepoint.prototype);
zoom(Powepoint.prototype);
shape(Powepoint.prototype);

/**
 * 普通精灵动画
 * dom版本
 * css3模式
 */
var style = Xut.style;
var keyframes = style.keyframes;
var animationEnd = style.animationEnd;
var playState = style.animationPlayState;
var prefixAnims = style.animation;

var styleElement = null;

/**
 * [ description]动态插入一条样式规则
 * @param  {[type]} rule [样式规则]
 * @return {[type]}      [description]
 */
function insertCSSRule(rule) {
  var number, sheet, cssRules;
  //如果有全局的style样式文件
  if (styleElement) {
    number = 0;
    try {
      sheet = styleElement.sheet;
      cssRules = sheet.cssRules;
      number = cssRules.length;
      sheet.insertRule(rule, number);
    } catch (e) {
      console.log(e);
    }
  } else {
    //创建样式文件
    styleElement = document.createElement("style");
    styleElement.type = 'text/css';
    styleElement.innerHTML = rule;
    styleElement.uuid = 'aaron';
    document.head.appendChild(styleElement);
  }
}

/**
 * [ description]删除一条样式规则
 * @param  {[type]} ruleName [样式名]
 * @return {[type]}          [description]
 */
function deleteCSSRule(ruleName) {
  if (styleElement) {
    var sheet = styleElement.sheet,
        cssRules = sheet.rules || sheet.cssRules,
        //取得规则列表
    i = 0,
        n = cssRules.length,
        rule;
    for (i; i < n; i++) {
      rule = cssRules[i];
      if (rule.name === ruleName) {
        //删除单个规则
        sheet.deleteRule(i);
        break;
      }
    }
    //删除style样式
    if (cssRules.length == 0) {
      document.head.removeChild(styleElement);
      styleElement = null;
    }
  }
}

/**
 * css3模式
 * 单图
 * 矩形图
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function css3(options) {

  var matrix = void 0,
      parameter = void 0,
      rule1 = void 0,
      rule2 = void 0,
      timer = void 0;

  var $spriteNode = options.$contentNode.find('.sprite');
  var data = options.data;
  var callback = options.callback || function () {};
  var aniName = 'sprite_' + options.id;
  var count = data.thecount;
  var fps = data.fps;
  var time = Math.round(1 / fps * count * 10) / 10;
  var width = Math.ceil(data.scaleWidth * count);
  var loop = data.loop ? 'infinite' : 1;

  //如果是矩形图
  if (data.parameter) {
    parameter = parseJSON(data.parameter);
    if (parameter && parameter.matrix) {
      matrix = parameter.matrix.split("-");
    }
  }

  /**
   * 设置精灵动画位置
   * @param {[type]} aniName [description]
   * @param {[type]} x       [description]
   */
  function setPostion(aniName, x) {
    //矩阵生成step的处理
    //  0 1 2
    //  3 4 5
    //  6 7 8
    if (matrix) {
      var frames = [];
      var base = 100 / count;
      var col = Number(matrix[0]); //列数
      //首次
      frames.push(0 + '% { background-position:0% 0%}');
      for (var i = 0; i < count; i++) {
        // var currRow = Math.ceil((i + 1) / col); //当前行数
        var currCol = Math.floor(i / col); //当前列数
        var period = currCol * col; //每段数量
        x = 100 * (i - period);
        var y = 100 * currCol;
        x = x == 0 ? x : "-" + x;
        y = y == 0 ? y : "-" + y;
        frames.push((i + 1) * base + '% { background-position: ' + x + '% ' + y + '%}');
      }
      return aniName + '{' + frames.join("") + '}';
    } else {
      var rule = '{0} {from { background-position:0 0; } to { background-position: -{1}px 0px}}';
      return String.format(rule, aniName, Math.round(x));
    }
  }

  /**
   * 格式化样式表达式
   * 2016.7.15 add paused control
   * @param {[type]}   [description]
   */
  function setStep(aniName, time, count, loop) {
    var rule;
    if (matrix) {
      rule = '{0} {1}s step-start {2}';
      return String.format(rule, aniName, time, loop);
    } else {
      rule = '{0} {1}s steps({2}, end) {3}';
      return String.format(rule, aniName, time, count, loop);
    }
  }

  /**
   * 设置动画样式
   * @param {[type]} rule     [description]
   */
  function initStyle(rule) {
    prefixAnims && $spriteNode.css(prefixAnims, rule).css(playState, 'paused');
  }

  /**
   * 添加到样式规则中
   * @param {[type]} rule [description]
   */
  function setKeyframes(rule) {
    if (keyframes) {
      insertCSSRule(keyframes + rule);
    }
  }

  //动画css关键帧规则
  rule1 = setStep(aniName, time, count, loop);
  rule2 = setPostion(aniName, width);

  initStyle(rule1);
  setKeyframes(rule2);
  $spriteNode.on(animationEnd, callback);

  var clearTimer = function clearTimer() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return {
    play: function play() {
      //添加定时器 解决设备卡顿时普通精灵动画不播放的问题
      timer = setTimeout(function () {
        clearTimer();
        $spriteNode.css(playState, 'running');
      }, 0);
    },
    stop: function stop() {
      clearTimer();
      $spriteNode.css(playState, 'paused');
    },
    destroy: function destroy() {
      //停止精灵动画
      deleteCSSRule(aniName);
      $spriteNode.off(animationEnd, callback);
      clearTimer();
      $spriteNode = null;
    }
  };
}

/**
 * 帧模式-多图
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function keyframe(options) {
  var matrix = void 0,
      parameter = void 0,
      timer = void 0,
      x = void 0,
      y = void 0;

  var arrays = [];
  var t = 0;
  var $spriteNode = options.$contentNode.find('.sprite');
  var data = options.data;
  var callback = options.callback || function () {};

  var count = data.thecount;
  var fps = data.fps;
  var loop = data.loop;
  var width = data.scaleWidth;
  var height = data.scaleHeight;

  //如果是矩形图
  if (data.parameter) {
    parameter = parseJSON(data.parameter);
    if (parameter && parameter.matrix) {
      matrix = parameter.matrix.split("-");
    }
  }

  getCoordinate();
  //得到坐标：矩阵图：X Y坐标 普通：X坐标
  function getCoordinate() {
    //矩阵图
    if (matrix) {
      var cols = matrix[0];
      var rows = matrix[1];
      for (var i = 0; i < rows; i++) {
        y = -height * i + 'px';
        for (var k = 0; k < cols; k++) {
          x = -width * k + 'px';

          arrays.push(x, y);
        }
      }
      //数组长度大于给定的数量时 删除数组中多余的数据
      if (arrays.length / 2 > count) {
        var temp = arrays.length / 2 - count;
        for (var f = 2 * temp; f > 0; f--) {
          arrays.pop();
        }
      }
    } else {
      for (var i = 0; i < count; i++) {
        x = -width * i + 'px';
        arrays.push(x);
      }
    }
  }

  function start() {
    if (matrix) {
      if (t > arrays.length / 2 - 1) {
        if (loop > 0) {
          t = 0;
          time();
        } else {
          return;
        }
      } else {
        time();
      }
    } else {
      if (t > count - 1) {
        if (loop > 0) {
          t = 0;
          time();
        } else {
          return;
        }
      } else {
        time();
      }
    }
  }

  function time() {
    timer = setTimeout(function () {
      if (matrix) {
        x = arrays[2 * t];
        y = arrays[2 * t + 1];
        $spriteNode.css('backgroundPositionX', x);
        $spriteNode.css('backgroundPositionY', y);
      } else {
        x = arrays[t];
        $spriteNode.css('backgroundPositionX', x);
      }
      t++;
      start();
    }, 1000 / fps);
  }

  return {
    play: function play() {
      start();
    },

    stop: function stop() {
      clearTimeout(timer);
    },

    destroy: function destroy() {
      //停止精灵动画
      this.stop();
      t = 0;
      $spriteNode = null;
      data = null;
      arrays = null;
    }

  };
}

//判断是否支持css3属性
var animationPlayState = Xut.style.animationPlayState;

/**
 * css3动画
 * 1 帧动画
 * 2 定时器动画
 * @param {[type]} options [description]
 */
var ComSprite = function (options) {
  //timer,css
  var mode = options.mode || 'css';
  return mode === 'css' && animationPlayState ? css3(options) : keyframe(options);
};

/**
 * 2016.7.10
 * if comsprites is too large，
 * The client will comsprite become the advsprite  by default
 */
var moveContent$1 = function moveContent(contentPrefix, id, parentId) {
  var obj = $("#" + contentPrefix + id);
  var parentObj = $("#" + contentPrefix + parentId);
  var $parent = $("#spirit_parent_" + parentId);
  if ($parent.length == 0) {
    parentObj.append("<div style='position:absolute; width:100%; height:100%'  id='spirit_parent_" + parentId + "'></div>");
  }
  $parent.append(obj);
};

var _class$2 = function () {
  function _class(options) {
    classCallCheck(this, _class);

    this.options = options;
    this.ids = [];
  }

  createClass(_class, [{
    key: "play",
    value: function play() {

      var data = this.options.data;
      var resource = data.resource;

      var id = void 0,
          action = void 0,
          spiritList = void 0,
          framId = void 0,
          parentId = void 0,
          params = void 0;
      var option = {};
      this.spiritObjs = {};

      option.contentId = this.options.id;
      option.ele = this.options.$contentNode;
      option.resourcePath = data.md5;
      option.type = "autoSprite";

      /*
        data.loop
         循环 1
         不循环 0
       */
      var hasLoop = 0;
      if (data.loop) {
        hasLoop = 'loop';
      }

      for (var i = 0; i < resource.spiritList.length; i++) {
        spiritList = resource.spiritList[i];
        id = data.containerName;
        framId = spiritList.framId;
        parentId = spiritList.parentId;
        this.ids.push(id);
        if (parentId != "0") {
          var tempArray = id.split('_');
          var contentPrefix = tempArray[0] + '_' + tempArray[1];
          moveContent$1(contentPrefix, framId, parentId);
        }
        this.spiritObjs[id] = new _class$1(spiritList, option);
        params = spiritList.params;
        action = params["actList"].split(",")[0];

        //0 循环播放 1播放一次
        this.spiritObjs[id].play(action, hasLoop);
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      var _this = this;

      this.ids.forEach(function (key) {
        _this.spiritObjs[key].stop();
      });
    }
  }, {
    key: "reset",
    value: function reset() {
      this.stop();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var _this2 = this;

      this.ids.forEach(function (key) {
        if (_this2.spiritObjs[key]) {
          _this2.spiritObjs[key].destroy();
          _this2.spiritObjs[key] = null;
          delete _this2.spiritObjs[key];
        }
      });
      this.options.data = null;
      this.options.$contentNode = null;
      this.options = null;
      this.ids = null;
    }
  }]);
  return _class;
}();

/*********************************************************************
 *
 * content的动画类对象
 * 1 ppt 动画
 * 2 精灵动画
 * 3 show/hide接口
 * 4 canvas动画
 * @return {[type]} [description]
 *
 ********************************************************************/
//2016.7.15废弃
//pixi暂时不使用
var pixiSpirit = {};
var pixiSpecial = {};

// import { Sprite as pixiSpirit } from '../pixi/sprite/index'
// import { specialSprite as pixiSpecial } from '../pixi/special/index'

/**
 * 1.复位音频
 * 2.销毁音频
 */
var audioHandle = function audioHandle(context, options, chapterId) {
  options && _.each(options, function (data) {
    //如果存在对象音频
    if (data.videoId) {
      context(chapterId, data.videoId);
    }
  });
};

/**
 * 4种扩展对象
 * @type {Array}
 */
var OBJNAME = ['pptObj', 'pixiObj', 'comSpriteObj', 'autoSpriteObj'];

/**
 * Traverse each value of OBJNAME
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
var access = function access(callback) {
  OBJNAME.forEach(function (key) {
    callback(key);
  });
};

/**
 * 动画效果
 * @param {[type]} options [description]
 */

var Animation = function () {
  function Animation(options) {
    classCallCheck(this, Animation);

    _.extend(this, options);
  }

  /**
   * Build the canvas of animation
   * 比较复杂
   * 1 普通与ppt组合
   * 2 高级与ppt组合
   * 3 ppt独立
   * 4 普通精灵动画
   * 8  其中 高级精灵动画是widget创建，需要等待
   * @return {[type]} [description]
   */


  createClass(Animation, [{
    key: '_createCanvas',
    value: function _createCanvas(id, parameter, category, callback) {
      var _this = this;

      var initstate = void 0;

      //动作类型
      //可能是组合动画
      var actionTypes = this.contentData.actionTypes;
      var makeOpts = {
        data: this.contentData,
        renderer: this.$contentNode,
        pageIndex: this.pageIndex
      };

      //创建pixi上下文的ppt对象
      var createPixiPPT = function createPixiPPT() {
        //parameter存在就是ppt动画
        if ((parameter || actionTypes.pptId) && _this.$contentNode.view) {
          _this.pptObj = callback(Powepoint, $(_this.$contentNode.view));
          _this.pptObj.contentId = id;
        }
      };

      var $veiw = this.$contentNode.view;
      if ($veiw) {
        initstate = $veiw.getAttribute('data-init');
      }

      var setState = function setState() {
        $veiw.setAttribute('data-init', true);
      };

      //多个canvas对应多个ppt
      //容器不需要重复创建
      //精灵动画
      if (actionTypes.spiritId) {
        if (initstate) {
          createPixiPPT();
        } else {
          //加入任务队列
          this.nextTask.context.add(id);
          this.pixiObj = new pixiSpirit(makeOpts);
          //防止多条一样的数据绑多个动画
          //构建精灵动画完毕后
          //构建ppt对象
          this.pixiObj.$$once('load', function () {
            //ppt动画
            createPixiPPT();

            //任务完成
            _this.nextTask.context.remove(id);
          });
          setState();
        }
      }

      //特殊高级动画
      //必须是ppt与pixi绑定的
      if (actionTypes.compSpriteId) {
        // console.log(this,this.id,this.contentData.initpixi)
        //这个dom已经创建了pixi了
        if (initstate) {
          createPixiPPT();
        } else {
          this.pixiObj = new pixiSpecial(makeOpts);
          setState();

          //ppt动画
          createPixiPPT();
        }
      }
    }

    /**
     * Build the dom of animation
     * @return {[type]} [description]
     */

  }, {
    key: '_createDom',
    value: function _createDom(category, callback) {
      if (category) {
        var data = {
          id: this.id,
          data: this.contentData,
          $contentNode: this.$contentNode
        };
        switch (category) {
          //普通精灵动画
          case "Sprite":
            this.comSpriteObj = ComSprite(data);
            break;
          //普通转复杂精灵动画
          case "AutoCompSprite":
            this.autoSpriteObj = new _class$2(data);
            break;
        }
      }

      //ppt动画
      this.pptObj = callback(Powepoint);
    }

    /**
     * 绑定动画
     * 为了向上兼容API
     *  1 dom动画
     *  2 canvas动画
     */

  }, {
    key: 'init',
    value: function init(id, $contentNode, $containsNode, chapterId, parameter, pageType) {
      var _this2 = this;

      var category = this.contentData.category;
      var pageIndex = this.pageIndex;
      var create = function create(constr, newContext) {
        var element = newContext || $contentNode;
        if (element.length) {
          return new constr(pageIndex, pageType, chapterId, element, parameter, $containsNode, _this2.getStyle);
        } else {
          console.log('\u521B\u5EFA:' + constr + '\u5931\u8D25');
        }
      };
      this.domMode ? this._createDom(category, create) : this._createCanvas(id, parameter, category, create);
    }

    /**
     * 运行动画
     * @param  {[type]} scopeComplete   [动画回调]
     * @param  {[type]} canvasContainer [description]
     * @return {[type]}                 [description]
     */

  }, {
    key: 'play',
    value: function play(playComplete) {
      var _this3 = this;

      var $contentNode = this.$contentNode;

      //canvas
      if ($contentNode && $contentNode.view) {
        $contentNode = this.$contentNode.view;
      }

      access(function (key) {
        if (_this3[key]) {
          if (key === 'pptObj') {
            //优化处理,只针对互斥的情况下
            //处理层级关系
            if ($contentNode.prop && $contentNode.prop("mutex")) {
              $contentNode.css({ //强制提升层级
                'display': 'block'
              });
            }
          }
          _this3[key].play && _this3[key].play(playComplete);
        }
      });
    }

    /**
     * 停止动画
     * @param  {[type]} chapterId [description]
     * @return {[type]}           [description]
     */

  }, {
    key: 'stop',
    value: function stop(chapterId) {
      var _this4 = this;

      access(function (key) {
        if (_this4[key]) {
          if (key === 'pptObj') {
            audioHandle(destroyContentAudio, _this4[key].options, chapterId);
          }
          _this4[key].stop && _this4[key].stop();
        }
      });
    }

    /**
     * 翻页结束，复位上一页动画
     * @return {[type]} [description]
     */

  }, {
    key: 'reset',
    value: function reset() {
      var _this5 = this;

      access(function (key) {
        _this5[key] && _this5[key].reset && _this5[key].reset();
      });
    }

    /**
     * 销毁动画
     * @return {[type]} [description]
     */

  }, {
    key: 'destroy',
    value: function destroy(chapterId) {
      var _this6 = this;

      access(function (key) {
        if (key === 'pptObj') {
          //销毁ppt音频
          // audioHandle(clearContentAudio, this[key].options, chapterId);
        }
        _this6[key] && _this6[key].destroy && _this6[key].destroy();
      });

      //销毁renderer = new PIXI.WebGLRenderer
      if (this.canvasMode) {
        this.$contentNode.view && this.$contentNode.destroy();
      }

      //销毁每一个数据上的canvas上下文引用
      if (this.contentData.$contentNode) {
        this.contentData.$contentNode = null;
      }

      access(function (key) {
        _this6[key] = null;
      });

      this.$contentNode = null;
      this.getParameter = null;
    }
  }]);
  return Animation;
}();

/**
 * 预处理脚本
 * 1 动画直接显示与隐藏设置
 * 2 动画脚本与处理（跳转）
 */
function FastPipe(data, base) {
  var id = //预显示动画
  //预跳转脚本
  data.id,
      canvasMode = data.canvasMode,
      $contentNode = data.$contentNode,
      prepTag = data.prepTag,
      prepVisible = data.prepVisible,
      prepScript = data.prepScript;

  /////////////////////////////
  ///如果是被预处理截断，跳过动画创建
  ///重写原事件的相关数据
  ///改动脚本auto为click事件
  /////////////////////////////

  if (prepScript) {
    base.eventData.rewrite = true;
    base.eventData.eventName = 'click';
    base.eventData.eventContentId = id;
  }

  /////////////////////////////
  //创建a标签跳转
  /////////////////////////////
  var preCode = void 0;
  if (prepTag) {
    try {
      makeJsonPack(prepTag)();
    } catch (err) {
      console.log('\u9884\u5904\u7406\u622A\u65AD\u6267\u884C\u811A\u672C\u5931\u8D25');
    }
    preCode = window.XXTAPI.PreCode;

    if (preCode) {
      var contentNode = base.getContextNode(base._findContentName(base.chapterIndex, id));
      var imgContext = contentNode.find('img');
      if (imgContext.length) {
        var href = void 0;
        if (_.isString(preCode)) {
          //如果只有一个参数并且是字符串，那么就是URL
          href = preCode;
        } else if (_.isArray(preCode)) {
          //数组
          href = preCode[0];
        }

        //替换img为div>a
        imgContext.replaceWith(String.styleFormat('<div class="inherit-size fullscreen-background fix-miaomiaoxue-img"\n                style="background-image:url(' + imgContext.attr('src') + ');">\n              <a  data-id="' + id + '"\n                  data-page-id="' + base.pageId + '"\n                  data-type="hyperlink"\n                  href="' + href + '"\n                  class="inherit-size"\n                  style="display:block;"/>\n              </a>\n          </div>'));
        window.XXTAPI.PreCode = null;

        //如果有回调，就绑定事件
        if (preCode[1] && _.isFunction(preCode[1])) {
          base.eventData.eventContext = contentNode.find('a');
          base.eventData.rewrite = true;
          base.eventData.eventName = 'tap';
          base.eventData.eventContentId = id;
        } else {
          //清空auto动作
          base.eventData.eventName = '';
        }
      }
    }
  }

  /**
   * 显示预处理,直接越过动画
   */
  var setPrepVisible = function setPrepVisible() {
    //创建的无行为content
    var partContentRelated = base.relatedData.partContentRelated;
    //针对空跳过处理
    if (partContentRelated && partContentRelated.length && -1 !== partContentRelated.indexOf(id)) {} else {
      if (canvasMode) {
        console.log('canvsa prepVisible');
        return;
      }
      //因为执行的顺序问题，动画与页面零件,isscroll标记控制
      if ($contentNode && !$contentNode.attr('data-iscroll')) {
        //必须是设定值与原始值不一致才修改,苹果上闪屏问题
        if ($contentNode.css('visibility') != prepVisible) {
          $contentNode.css({
            'visibility': prepVisible
          });
        }
      }
    }
  };

  return _.extend(data, {
    init: function init() {
      //预显示跳过动画创建
      prepVisible && $contentNode.css({ 'visibility': prepVisible });
    },
    play: function play(callback) {

      //处理显示动画
      if (prepVisible) {
        setPrepVisible(callback);
      }

      //a标签附带的脚本函数
      if (preCode && preCode[1]) {
        try {
          preCode[1]();
        } catch (err) {
          console.log('\u5FEB\u901F\u5904\u7406\u811A\u672C\u51FD\u6570\u6267\u884C\u5931\u8D25');
        }
      }

      //如果是被预处理截断
      //执行脚本
      if (prepScript) {
        try {
          makeJsonPack(prepScript)();
        } catch (err) {
          console.log('\u5FEB\u901F\u5904\u7406\u6267\u884C\u811A\u672C\u5931\u8D25');
        }
      }

      callback && callback();
    },
    destroy: function destroy() {
      preCode = null;
      $contentNode = null;
      prepTag = null;
    }
  });
}

var transitionDuration = Xut.style.transitionDuration;
var transform = Xut.style.transform;
var setTranslateZ = Xut.style.setTranslateZ;
var round = Math.round;

/**
 * 获取视觉差parallax配置
 * @return {[type]} [description]
 */
function setStyle(_ref) {
  var $contentNode = _ref.$contentNode,
      action = _ref.action,
      property = _ref.property,
      pageIndex = _ref.pageIndex,
      _ref$targetProperty = _ref.targetProperty,
      targetProperty = _ref$targetProperty === undefined ? {} : _ref$targetProperty,
      interaction = _ref.interaction,
      _ref$speed = _ref.speed,
      speed = _ref$speed === undefined ? 0 : _ref$speed,
      _ref$pageOffset = _ref.pageOffset,
      pageOffset = _ref$pageOffset === undefined ? 0 : _ref$pageOffset,
      _ref$opacityStart = _ref.opacityStart,
      opacityStart = _ref$opacityStart === undefined ? 0 : _ref$opacityStart;

  var style = {};
  var transformProperty = {};
  var x = 0;
  var y = 0;
  var z = 0;
  var translateZ = void 0;

  if (action === 'init') {
    //如果有special属性
    //提取出第一个对象的设置，混入到special
    var special = property.special;
    if (special && special[1]) {
      _.extend(property, special[1]);
    }
  }

  var specialProperty = void 0; //特殊属性值
  var lastProperty = void 0;
  if (action === 'master') {
    var _special = targetProperty.special;
    if (_special) {
      specialProperty = _special[pageIndex];
      if (!specialProperty) {
        //上一个属性
        lastProperty = _special.lastProperty;
      }
    }
  }

  //视觉差对象初始化偏移量
  var parallaxOffset = pageOffset;

  //平移
  var hasTranslateX = property.translateX !== undefined;
  var hasTranslateY = property.translateY !== undefined;
  var hasTranslateZ = property.translateZ !== undefined;
  if (hasTranslateX) {
    x = round(property.translateX) || 0;
    parallaxOffset += x;
    transformProperty.translateX = 'translateX(' + parallaxOffset + 'px)';
  }
  if (hasTranslateY) {
    y = round(property.translateY) || 0;
    transformProperty.translateY = 'translateY(' + y + 'px)';
  }
  if (hasTranslateX || hasTranslateY || hasTranslateZ) {
    z = round(property.translateZ) || 0;
    transformProperty.translateZ = setTranslateZ(z);
  }

  //旋转
  if (property.rotateX !== undefined) {
    transformProperty.rotateX = 'rotateX(' + round(property.rotateX) + 'deg)';
  }
  if (property.rotateY !== undefined) {
    transformProperty.rotateY = 'rotateY(' + round(property.rotateY) + 'deg)';
  }
  if (property.rotateZ !== undefined) {
    transformProperty.rotateZ = 'rotateZ(' + round(property.rotateZ) + 'deg)';
  }

  //缩放
  var hasScaleX = property.scaleX !== undefined;
  var hasScaleY = property.scaleY !== undefined;
  var hasScaleZ = property.scaleZ !== undefined;
  if (hasScaleX) {
    x = round(property.scaleX * 100) / 100;
    transformProperty.scaleX = 'scaleX(' + x + ')';
  }
  if (hasScaleY) {
    y = round(property.scaleY * 100) / 100;
    transformProperty.scaleY = 'scaleY(' + y + ')';
  }
  if (hasScaleZ) {
    z = round(property.scaleZ * 100) / 100;
    transformProperty.scaleZ = 'scaleZ(' + z + ')';
  }
  //如果设了XY的缩放，默认增加Z处理
  if (!hasScaleZ && (hasScaleX || hasScaleY)) {
    transformProperty.scaleZ = 'scaleZ(1)'; //默认打开3D，如不指定iphone闪屏
  }

  //透明度
  var hasOpacity = false;
  if (property.opacity !== undefined) {
    if (action === 'init') {
      style.opacity = round((property.opacityStart + property.opacity) * 100) / 100;
      hasOpacity = true;
    }
    if (action === 'master') {
      style.opacity = round(property.opacity * 100) / 100 + opacityStart;
      hasOpacity = true;
    }
  }

  //style可以单独设置opacity属性
  if (transformProperty || hasOpacity) {
    if (transformProperty) {

      if (lastProperty) {
        _.extend(transformProperty, lastProperty);
      }

      style[transitionDuration] = speed + 'ms';
      var tempProperty = '';
      for (var key in transformProperty) {
        tempProperty += transformProperty[key];
      }
      if (tempProperty) {
        style[transform] = tempProperty;
      }
    }
    //拿到属性的最终值
    if ($contentNode) {
      $contentNode.css(style);
      //翻页做上一个完成记录
      if (interaction === 'flipOver' && specialProperty) {
        for (var _key in specialProperty) {
          var speciaValue = specialProperty[_key];
          var result = transformProperty[_key];
          if (result) {
            //保存特殊的值
            targetProperty.special.lastProperty[_key] = result;
          }
        }
      }
    }
  }

  return parallaxOffset;
}

/**
 * 初始化元素属性
 */
function getInitProperty(property, nodeOffset, specialProperty, getStyle) {
  var results = {};
  var width = -getStyle.visualWidth;
  var height = -getStyle.visualHeight;

  for (var key in property) {
    //special使用
    //给属性打上标记，用于翻页的时候过滤
    //因为采用动态滑动视觉差
    //可能在某些页面设置属性，某些页面跳过
    if (specialProperty) {
      specialProperty.special[key] = true;
    }

    switch (key) {
      case 'special':
        //特殊属性
        results[key] = {};
        for (var i in property[key]) {
          //因为是独立设置，所以nodeOffset的比值不需要了
          //nodeOffset = 1
          var props = getInitProperty(property[key][i], 1, property);
          results[key][i] = props;
        }
        break;
      case 'scaleX':
      case 'scaleY':
      case 'scaleZ':
        //缩放是从1开始
        //变化值是property[key] - 1
        //然后用nodeOffset处理，算出比值
        results[key] = 1 + (property[key] - 1) * nodeOffset;
        break;
      case 'translateX':
      case 'translateZ':
        results[key] = property[key] * nodeOffset * width;
        break;
      case 'translateY':
        results[key] = property[key] * nodeOffset * height;
        break;
      case 'opacityStart':
        results[key] = property[key];
        break;
      default:
        results[key] = property[key] * nodeOffset;
    }
  }
  return results;
}

/**
 * 获取属性单步变化的比值
 */
function getStepProperty(_ref2) {
  var nodes = _ref2.nodes,
      isColumn = _ref2.isColumn,
      distance = _ref2.distance,
      pageIndex = _ref2.pageIndex,
      lastProperty = _ref2.lastProperty,
      targetProperty = _ref2.targetProperty;

  var temp = {};
  var property = targetProperty; //浅复制
  var lastSpecialProperty = void 0; //上一个特殊的对象属性

  //动态属性页面
  var specialProperty = void 0;
  var nextSpecialProperty = void 0;
  if (targetProperty.special) {
    specialProperty = targetProperty.special[pageIndex];
    nextSpecialProperty = targetProperty.special[pageIndex + 1];
    if (specialProperty) {
      //深复制，这样修改的目的是混入了specialProperty后，不会改变targetProperty原对象
      property = _.extend({}, targetProperty, specialProperty);
    }
  }

  //这里有页面模式的配置处理
  //获取的页面翻页的区域值不一样
  var size = isColumn ? config.screenSize : config.visualSize;
  var width = size.width;
  var height = size.height;

  for (var key in property) {
    switch (key) {
      case 'scaleX':
      case 'scaleY':
      case 'scaleZ':
        //特殊属性的计算
        //没有中间值，直接就 = 百分比*变化区间
        if (specialProperty[key]) {
          var percentage = -distance / width;
          if (nextSpecialProperty[key]) {
            var changeProperty = nextSpecialProperty[key] - specialProperty[key];
            if (changeProperty) {
              temp[key] = percentage * changeProperty;
            }
          }
        } else {
          temp[key] = -1 * distance / width * (property[key] - 1) * nodes;
        }
        break;
      case 'translateX':
      case 'translateZ':
        temp[key] = distance * nodes * property[key];
        break;
      case 'translateY':
        temp[key] = distance * (height / width) * nodes * property[key];
        break;
      case 'opacityStart':
        temp[key] = property.opacityStart;
        break;
      default:
        //乘以-1是为了向右翻页时取值为正,位移不需这样做
        temp[key] = -1 * distance / width * property[key] * nodes;
    }
  }
  return temp;
}

/**
 * 移动叠加值
 */
function flipMove(stepProperty, lastProperty) {
  var temp = {};
  var start = stepProperty.opacityStart;
  for (var i in stepProperty) {
    //叠加值
    temp[i] = stepProperty[i] + lastProperty[i];
  }
  if (start > -1) {
    temp.opacityStart = start;
  }
  return temp;
}

/**
 * 翻页结束
 */
function flipOver() {
  return flipMove.apply(undefined, arguments);
}

/**
 * 反弹
 */
function flipRebound(stepProperty, lastProperty) {
  var temp = {};
  for (var i in stepProperty) {
    temp[i] = lastProperty[i] || stepProperty[i];
  }
  return temp;
}

/**
 * 结束后缓存上一个记录
 */
function cacheProperty(stepProperty, lastProperty) {
  for (var i in stepProperty) {
    lastProperty[i] = stepProperty[i];
  }
}

/**
 * 视觉差对象初始化操作
 */
/**
 * 变化节点的css3transform属性
 * @param  {[type]} $contentNode   [description]
 * @param  {[type]} property   [description]
 * @param  {[type]} pageOffset [description]
 * @return {[type]}            [description]
 */
var setTransformNodes = function setTransformNodes($contentNode, property, pageOffset) {
  return setStyle({ //return parallaxOffset
    $contentNode: $contentNode,
    action: 'init',
    property: property,
    pageOffset: pageOffset
  });
};

/**
 * 转换属性
 * @param  {[type]} parameters [description]
 * @return {[type]}            [description]
 */
var converProperty = function converProperty(property) {
  if (property.opacityStart > -1) {
    property.opacity = (property.opacityEnd || 1) - property.opacityStart;
    delete property.opacityEnd;
  }
  return property;
};

/**
 * 如果母版依赖的页面是flow页面
 * 需要获取到具体的页面长度
 * @return {[type]} [description]
 */
var getFlowFange = function getFlowFange(pageIndex) {
  var relyPageObj = Xut.Presentation.GetPageBase('page', pageIndex);
  if (relyPageObj && relyPageObj.chapterData.note === 'flow') {
    var seasonId = relyPageObj.chapterData.seasonId;
    var chapterId = relyPageObj.chapterId;
    var range = getColumnCount$1(seasonId, chapterId); //分页总数
    return range;
  }
};

function index$1(data, relatedData, getStyle) {

  //转化所有css特效的参数的比例
  var targetProperty = parseJSON(data.getParameter()[0]['parameter']);
  if (!targetProperty) {
    return;
  }

  targetProperty = converProperty(targetProperty);

  var chapterIndex = data.chapterIndex;

  //首位分割点
  var currPageOffset = void 0;

  //如果是flow页面，拿到分页数
  var pageRange = hasColumn() && getFlowFange(data.pageIndex);
  if (pageRange) {
    var visualIndex = Xut.Presentation.GetPageIndex();
    if (data.pageIndex == visualIndex || data.pageIndex > visualIndex) {
      currPageOffset = 1;
    } else {
      currPageOffset = pageRange;
    }
  } else {
    //页面偏移量
    //["3", "6", "4"]
    //表示第4次采用了这个母板，中间有其他模板间隔开了的情况
    var pageOffset = relatedData.pageOffset && relatedData.pageOffset.split("-");
    //开始的nodes值
    currPageOffset = parseInt(pageOffset[0]);
    //范围区域
    pageRange = parseInt(pageOffset[1]);
  }

  //非匀速视觉差，初始化一些参数
  //增加特殊记录历史记录
  if (targetProperty.special) {
    //筛选出所有属性最大的值
    var maxProperty = {};
    var specialProperty = targetProperty.special;
    for (var key in specialProperty) {
      for (var name in specialProperty[key]) {
        if (maxProperty[name]) {
          if (maxProperty[name] < specialProperty[key][name]) {
            maxProperty[name] = specialProperty[key][name];
          }
        } else {
          maxProperty[name] = specialProperty[key][name];
        }
      }
    }
    targetProperty.special.maxProperty = maxProperty;
    targetProperty.special.lastProperty = {};
  }

  //页面偏移比例
  var nodeOffset = (currPageOffset - 1) / (pageRange - 1) || 0;

  //计算出新的新的值
  var lastProperty = getInitProperty(targetProperty, nodeOffset, '', getStyle);

  //页面分割比
  var nodeRatio = 1 / (pageRange - 1);

  //初始化视觉差对象的坐标偏移量
  var transformOffset = relatedData.getTransformOffset(data.id);
  var parallaxOffset = setTransformNodes(data.$contentNode, lastProperty, transformOffset);

  /**
   * 为了兼容动画，把视觉差当作一种行为处理
   * 合并data数据
   * @type {Object}
   */
  data.parallax = {
    $contentNode: data.$contentNode,
    /**
     * 计算页码结束边界值,用于跳转过滤
     */
    calculateRangePage: function calculateRangePage() {
      return {
        'start': chapterIndex - currPageOffset + 1,
        'end': pageRange - currPageOffset + chapterIndex
      };
    },

    /**
     * 目标属性
     */
    targetProperty: targetProperty,
    /**
     * 最后一个属性值
     */
    lastProperty: lastProperty,
    /**
     * 比值
     */
    nodeRatio: nodeRatio,
    /**
     * 经过视觉差修正后的偏移量
     */
    parallaxOffset: parallaxOffset
  };

  return data;
}

/////////////////////////////////
///  预处理
///  1.动画直接改变显示隐藏状态
///  2.动画直接执行脚本
/////////////////////////////////

function pretreatment(data, eventName) {
  var parameter = data.getParameter();

  //过滤预生成动画
  if (parameter && parameter.length === 1) {
    var category = data.contentData.category;
    var para = parameter[0];

    if (para.animationName === 'EffectAppear' && //出现动画
    data.domMode && //并且只有dom模式才可以，canvas排除
    eventName === 'auto' && //自动运行
    !para.videoId && //没有音频
    !para.delay && //没有延时
    category !== 'Sprite' && //不是精灵
    category !== 'AutoCompSprite' && //不是自动精灵
    !/"inapp"/i.test(para.parameter)) {
      //并且不能是收费处理

      //针对预处理动作,并且没有卷滚的不注册，满足是静态动画，true是显示,false隐藏
      if (!para.preCode && !para.postCode) {
        return data.prepVisible = /"exit":"False"/i.test(para.parameter) === true ? 'visible' : 'hidden';
      }

      //如果有脚本，可能是针对迷你杂志跳转的数据
      //需要通过onclick绑定，那么就截断这个数据
      if (para.preCode) {

        //方式一
        //通过创建a标签的处理跳转
        // window.XXTAPI.PreCode = [url, function() {
        //   if (plat === 'iOS') {
        //     $.post("http://www.kidreadcool.com/downloads.php", {
        //       esp: "mios",
        //       url: "mindex1"
        //     }, null, "json");
        //   }
        // }]
        if (-1 !== para.preCode.indexOf('XXTAPI.PreCode')) {
          return data.prepTag = para.preCode;
        }

        //方式二
        
        ['window.location.href', 'window.open'].forEach(function (url) {
          if (-1 !== para.preCode.indexOf(url)) {
            return data.prepScript = para.preCode;
          }
        });
        if (data.prepScript) {
          return data.prepScript;
        }
      }
    }
  }
}

/**
 * 创建执行对象
 * 1 动画作用域
 * 2 视觉差作用域
 * @type {Array}
 */
//2016.7.15废弃
//pixi暂时不使用
// import { Context } from '../pixi/context'


/**
 * 构建动画
 * @return {[type]} [description]
 */
var createScope = function createScope(base, contentId, chapterIndex, actName, parameter, hasParallax) {

  //默认启动dom模式
  var data = {
    type: 'dom',
    canvasMode: false,
    domMode: true
  };
  var $contentNode;
  var pageType = base.pageType;
  var contentName;
  var canvasDom;
  var contentData = base.relatedData.contentDataset[contentId];

  //如果启动了canvas模式
  //改成作用域的一些数据
  if (base.canvasRelated.enable) {
    //如果找到对应的canvas对象
    if (-1 !== base.canvasRelated.contentIdset.indexOf(contentId)) {
      contentName = "canvas_" + chapterIndex + "_" + contentId;
      canvasDom = base.getContextNode(contentName)[0];

      //创建上下文pixi
      if (contentData.$contentNode) {
        $contentNode = contentData.$contentNode;
      } else {
        // $contentNode = Context(contentData, canvasDom, base.pageIndex)
        //保存canvas pixi的上下文引用
        // base.relatedData.contentDataset[contentId].$contentNode = $contentNode
      }
      data.type = 'canvas';
      data.canvasMode = true;
      data.domMode = false;
    }
  }

  //如果是dom模式
  if (!$contentNode) {
    /**
     * 确保节点存在
     * @type {[type]}
     */
    if (!($contentNode = base.getContextNode(actName))) {
      return;
    }
  }

  /**
   * 制作公共数据
   * @type {Object}
   */
  _.extend(data, {
    base: base,
    id: contentId,
    actName: actName,
    contentData: contentData,
    $contentNode: $contentNode,
    pageType: pageType,
    canvasDom: canvasDom,
    chapterIndex: chapterIndex,
    pageIndex: base.pageIndex,
    canvasRelated: base.canvasRelated,
    nextTask: base.nextTask
  });

  /**
   * 如果是母版层理,视觉差处理
   * processType 三种情况
   *          parallax
   *          animation
   *          both(parallax,animation)
   * @type {[type]}
   */
  if (hasParallax && pageType === 'master') {
    data.processType = 'parallax';
  } else {
    data.processType = 'animation';
  }

  /**
   * 生成查询方法
   */
  data.getParameter = function () {
    //分区母版与页面的数据结构
    //parameter-master-parallax
    //parameter-master-animation
    //parameter-page-animation
    var fix = 'parameter-' + pageType + '-' + data.processType;
    data[fix] = parameter;
    return function () {
      return data[fix];
    };
  }();

  //生成视觉差对象
  if (data.processType === 'parallax') {
    return index$1(data, base.relatedData, base.getStyle);
  }

  //数据预处理
  var hasPipe = pretreatment(data, base.eventData.eventName);
  if (hasPipe) {
    return FastPipe(data, base);
  } else {
    //生成子作用域对象，用于抽象处理动画,行为
    data.getStyle = base.getStyle;
    return new Animation(data);
  }
};

/**
 * 分解每个子作用域
 * 1 生成临时占位作用域,用于分段动画
 * 2 生成所有动画子作用域
 * @param  {[type]} parameter [description]
 * @return {[type]}           [description]
 */
var createHandlers = function createHandlers(base, parameter) {
  var para = parameter[0];
  var contentId = para['contentId']; //可能有多个动画数据 [Object,Object,Object]
  var chapterIndex = base.chapterIndex;
  var actName = base.makePrefix('Content', chapterIndex, contentId);
  return createScope(base, contentId, chapterIndex, actName, parameter, para.masterId);
};

/**
 * 构建作用域
 * @return {[type]} [description]
 */
var fnCreate = function fnCreate(base) {
  return function (data, callback) {
    var para, handlers;
    if (data && data.length) {
      //生成动画作用域对象
      while (para = data.shift()) {
        if (handlers = createHandlers(base, para)) {
          callback(handlers);
        }
      }
    }
  };
};

/**
 * 源对象复制到目标对象
 */
var innerExtend = function innerExtend(target, source) {
  var property;
  for (property in source) {
    if (target[property] === undefined) {
      target[property] = source[property];
    }
  }
};

//处理itemArray绑定的动画对象
//注入动画
//绑定用户事件
var createContent = function (base) {

  var animation = base.dataset.animation,
      parallax = base.dataset.parallax,

  //抽出content对象
  contentGroup = [],

  //创建引用
  batcheCreate = fnCreate(base);

  switch (base.pageType) {
    case 'page':
      batcheCreate(animation, function (handlers) {
        contentGroup.push(handlers);
      });
      break;
    case 'master':
      //母版层的处理
      var tempParallaxScope = {},
          tempAnimationScope = {},
          tempAssistContents = [];
      //视觉差处理
      batcheCreate(parallax, function (handlers) {
        tempParallaxScope[handlers.id] = handlers;
      });

      batcheCreate(animation, function (handlers) {
        tempAnimationScope[handlers.id] = handlers;
      });

      var hasParallax = _.keys(tempParallaxScope).length,
          hasAnimation = _.keys(tempAnimationScope).length;

      //动画为主
      //合并，同一个对象可能具有动画+视觉差行为
      if (hasParallax && hasAnimation) {
        _.each(tempAnimationScope, function (target) {
          var id = target.id;
          var source = tempParallaxScope[id];
          if (source) {
            //如果能找到就需要合并
            innerExtend(target, source); //复制方法
            target.processType = 'both'; //标记新组合
            delete tempParallaxScope[id]; //删除引用
          }
        });
        //剩余的处理
        if (_.keys(tempParallaxScope).length) {
          _.extend(tempAnimationScope, tempParallaxScope);
        }
        tempParallaxScope = null;
      }
      //转化成数组
      _.each(hasAnimation ? tempAnimationScope : tempParallaxScope, function (target) {
        tempAssistContents.push(target);
      });
      contentGroup = tempAssistContents;
      break;
  }

  batcheCreate = null;

  return contentGroup;
};

/**
 * 2016.4.11
 * 因为canvas模式导致
 * 任务必须等待context上下创建
 * 完成后执行
 * 1 事件
 * 2 预执行
 * @type {Array}
 */
var createTask = function (callback) {
  return {
    context: {
      /**
       * 状态表示
       */

      /**
       * 是否等待创建
       * @type {Boolean}
       */
      wait: false,

      /**
       * 是否完成创建
       * @type {Boolean}
       */
      statas: false,

      /**
       * id合集
       * @type {Array}
       */
      _ids: [],

      /**
       * 事件
       * @type {Array}
       */
      event: [],

      /**
       * 预执行
       * @type {Object}
       */
      pre: {}, //预执行


      /**
       * 检测是否完成
       * @return {[type]} [description]
       */
      check: function check() {
        var total = this.length();
        if (!total.length) {
          //完成创建
          this.statas = true;
        }
        //如果已经等待
        if (this.wait) {
          callback && callback();
          return;
        }
        // //创建比流程先执行完毕
        // //一般几乎不存在
        // //但是不排除
        // if (!this.wait && this.statas) {
        //     this.wait = true;
        //     return;
        // }
      },
      add: function add(id) {
        if (-1 === this._ids.indexOf(id)) {
          this._ids.push(id);
        }
      },
      remove: function remove(id) {
        if (!id) {
          return;
        }
        var index = this._ids.indexOf(id);
        var val = this._ids.splice(index, 1);
        this.check(val);
        return val;
      },
      length: function length() {
        return this._ids.length;
      }
    }
  };
};

/*******************************************
 *   文本类
 *     处理:
 *       1 异步转同步deferred处理
 *       2 dom结循环创建
 *       创建的四种行为
 *          1 默认创建结构绑定事件
 *          2 用于预先创建activityMode模式,分发动画与事件
 *          3 递归创建,关联子热点
 *          4 ppt文字动画,不创建主体结构,递归子热点
 *                  A 递归处理PPT动画
 *                  B 处理同步音频
 *                                      *
 ******************************************/
/**
 * 处理拖动对象
 * @return {[type]} [description]
 */
function accessDrop(eventData, callback) {
  if (eventData && eventData.dragDrop) {
    callback(eventData.dragDrop);
  }
}

var Activity = function () {

  /**
   * activity触发器类
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  function Activity(data) {
    classCallCheck(this, Activity);


    _.extend(this, data);

    /**
     * 2016.4.11
     * 检测是所有的子任务必须完成
     * 因为canvas模式导致
     * 任务必须等待context上下创建
     * context就是pixi的直接对象，精灵..都是异步的
     */
    this.nextTask = createTask(this.noticeComplete);

    /**
     * 初始化事件
     * 需要先解析
     * createContent需要依赖
     */
    this._initEvents();

    /**
     * 保存子对象content
     */
    this._contentGroup = createContent(this);

    /**
     * 处理html文本框
     * 2016.1.6
     */
    this._htmlTextBox();

    /**
     * 绑定事件
     */
    this._bindEvents();

    /**
     * 初始化content行为
     */
    this._initContents();

    /**
     * 2016.2.26
     * 修复妙妙学
     * 妙妙客户端处理
     * 点击效果的音频处理
     * @type {Array}
     */
    this._fixAudio = [];

    /**
     * 2016.11.2
     * 缓存点击的音频对象
     * 这样用于优化重复点击按钮的时候触发音频
     * @type {Array}
     */
    this._cacheBehaviorAudio = {};

    /**
     * 如果存在content
     * 等待创建执行
     * @param  {[type]} this.nextTask.context.length()
     * @return {[type]}
     */
    if (this.nextTask.context.length()) {
      this.nextTask.context.wait = true;
      return this;
    }

    /**
     * 如果没有pixi的异步创建
     * 同步代码直接完成
     */
    this.noticeComplete();
  }

  /**
   * 初始化content行为
   * @return {[type]} [description]
   */


  createClass(Activity, [{
    key: '_initContents',
    value: function _initContents() {
      var _this = this;

      var pageId = this.relatedData.pageId;
      var $containsNode = this.$containsNode;
      var collectorHooks = this.relatedCallback.contentsHooks;
      var pageType = this.pageType;

      this.eachAssistContents(function (scope) {
        //针对必须创建
        var id = scope.id;
        var $contentNode = scope.$contentNode;

        //如果是视觉差对象，也需要实现收集器
        if (scope.processType === 'parallax') {
          collectorHooks(scope.chapterIndex, scope.id, scope);
          return;
        }

        //初始化动画
        scope.init(id, $contentNode, $containsNode, pageId, scope.getParameter(), pageType);
        _this._toRepeatBind(id, $contentNode, scope, collectorHooks);
      });
    }

    /**
     * dom节点去重绑定
     * 在每一次构建activity对象中，不重复处理content一些特性
     * 1 翻页特性
     * 2 注册钩子
     * @return {[type]} [description]
     */

  }, {
    key: '_toRepeatBind',
    value: function _toRepeatBind(id, $contentNode, scope, collectorHooks) {
      var relatedData = this.relatedData;
      var indexOf = relatedData.createContentIds.indexOf(id);

      //过滤重复关系
      //每个元素只绑定一次
      if (-1 !== indexOf) {
        relatedData.createContentIds.splice(indexOf, 1); //删除,去重
        collectorHooks(scope.chapterIndex, id, scope); //收集每一个content注册
        this._iscrollBind(scope, $contentNode); //增加翻页特性
      }
    }

    /**
     * 增加翻页特性
     * 可能有多个引用关系
     * @return {[type]}         [description]
     */

  }, {
    key: '_iscrollBind',
    value: function _iscrollBind(scope, $contentNode) {
      var _this2 = this;

      var self = this;
      var contentData = scope.contentData;

      var linkFunction = function linkFunction(scrollNode) {

        //滚动文本的互斥不显示做一个补丁处理
        //如果是隐藏的,需要强制显示,待邦定滚动之后再还原
        //如果是显示的,则不需要处理,
        var $parentNode = self.getContextNode(self.makePrefix('Content', scope.chapterIndex, scope.id));
        var visible = $parentNode.css('visibility');
        var resetStyle = function resetStyle() {};

        //元素隐藏状态下，绑定iScroll获取高度是有问题
        //所以这里需要补丁方式修正一下
        //让其不可见，但是可以获取高度
        if (visible == 'hidden') {
          var opacity = $parentNode.css('opacity');
          var setStyle = function setStyle(key, value) {
            arguments.length > 1 ? $parentNode.css(key, value) : $parentNode.css(key);
          };

          //如果设置了不透明,则简单设为可见的
          //否则先设为不透明,再设为可见
          if (opacity == 0) {
            setStyle('visibility', 'visible');
            resetStyle = function resetStyle() {
              return setStyle('visibility', visible);
            };
          } else {
            setStyle({
              'opacity': 0,
              'visibility': 'visible'
            });
            resetStyle = function resetStyle() {
              return setStyle({
                'opacity': opacity,
                'visibility': visible
              });
            };
          }
        }

        return function () {

          var option = {
            scrollbars: 'custom',
            fadeScrollbars: true
          };

          /*迷你平台，工具栏不消失*/
          if (config.launch.platform === 'mini') {
            option.fadeScrollbars = false;
          }

          self.iscroll = IScroll(scrollNode, option, 'delegate');

          //增加标记
          //在PPT动画中reset不还原
          scrollNode.setAttribute("data-iscroll", "true");

          resetStyle();
          resetStyle = null;
          $parentNode = null;
          scrollNode = null;
        };
      };

      var bind = function bind() {
        $contentNode.css('overflow', 'hidden'); //增加元素溢出隐藏处理
        $contentNode.children().css('height', ''); //去掉子元素高度，因为有滚动文本框
        _this2.relatedCallback.iscrollHooks.push(linkFunction($contentNode[0]));
      };

      //增加卷滚条标记
      //但是svg如果没有内容除外
      if (contentData.isScroll) {
        var hasSVG = $contentNode.find('svg');
        if (hasSVG) {
          //必须保证svg有数据
          if (hasSVG.text()) {
            bind();
          }
        } else {
          //如果不是svg数据，直接绑定
          bind();
        }
      }

      //如果是图片则补尝允许范围内的高度
      if (!contentData.mask || !contentData.isGif) {
        $contentNode.find && $contentNode.find('img').css({
          'height': contentData.scaleHeight
        });
      }
    }

    /**
     * 制作一个查找标示
     * @return {[type]}
     */

  }, {
    key: 'makePrefix',
    value: function makePrefix(name, index, id) {
      return name + "_" + index + "_" + id;
    }

    /**
     * 从文档碎片中找到对应的dom节点
     * 查找的范围
     * 1 文档根节点
     * 2 文档容器节点
     * @param  {[type]} prefix [description]
     * @return {[type]}        [description]
     */

  }, {
    key: 'getContextNode',
    value: function getContextNode(prefix, type) {
      var node = void 0,
          $node = void 0,
          containerPrefix = void 0,
          contentsFragment = void 0;

      //dom模式
      contentsFragment = this.relatedData.contentsFragment;
      if (node = contentsFragment[prefix]) {
        $node = $(node);
      } else {
        //容器处理
        if (containerPrefix = this.relatedData.containerPrefix) {
          _.each(containerPrefix, function (containerName) {
            node = contentsFragment[containerName];
            $node = $(node).find('#' + prefix);
            if ($node.length) {
              return;
            }
          });
        }
      }
      return $node;
    }

    /**
     * 复位独立动画
     * 提供快速翻页复用
     * @return {[type]} [description]
     */

  }, {
    key: '_resetAloneAnim',
    value: function _resetAloneAnim() {
      //复位拖动对象
      accessDrop(this.eventData, function (drop) {
        drop.reset();
      });
    }

    /**
     * 动画运行之后
     * 1 创建一个新场景
     * 2 执行跳转到收费提示页面
     * 3 触发搜索工具栏
     * @return {[type]} [description]
     */

  }, {
    key: '_relevantOperation',
    value: function _relevantOperation() {

      var scenarioInfo, eventContentId;

      //触发事件的content id
      if (this.eventData) {
        eventContentId = this.eventData.eventContentId;
      }

      if (eventContentId) {

        //查找出当前节的所有信息
        if (scenarioInfo = this.relatedData.seasonRelated[eventContentId]) {

          //如果存在搜索栏触发
          if (scenarioInfo.SearchBar) {
            this.createSearchBar();
            return;
          }

          //如果存在书签
          if (scenarioInfo.BookMarks) {
            this.createBookMark();
            return;
          }

          //处理新的场景
          if (scenarioInfo.seasonId || scenarioInfo.chapterId) {
            setTimeout(function () {
              Xut.View.LoadScenario({
                'seasonId': scenarioInfo.seasonId,
                'chapterId': scenarioInfo.chapterId
              });
            }, hasAudioes() ? 500 : 0);
            return;
          }
        }
      }
    }

    /**
     * 保证正确遍历
     * @return {[type]} [description]
     */

  }, {
    key: 'eachAssistContents',
    value: function eachAssistContents(callback) {
      _.each(this._contentGroup, function (scope) {
        callback.call(this, scope);
      }, this);
    }

    /**
     * 运行动画
     * @param  {[type]} outComplete [动画回调]
     * @return {[type]}             [description]
     * evenyClick 每次都算有效点击
     */

  }, {
    key: 'runAnimation',
    value: function runAnimation(outComplete, evenyClick) {

      var self = this;
      var pageId = this.relatedData.pageId;

      if (evenyClick) {
        this.preventRepeat = false;
      }

      //防止重复点击
      if (this.preventRepeat) {
        return false;
      }

      this.preventRepeat = true;

      //如果没有运行动画
      if (!this.dataset.animation) {
        this.preventRepeat = false;
        this._relevantOperation();
        return;
      }

      //制作作用于内动画完成
      //等待动画完毕后执行动作or场景切换
      var captureAnimComplete = this.captureAnimComplete = function (counts) {
        return function (scope) {
          //动画结束,删除这个hack
          scope && scope.$contentNode && scope.$contentNode.removeProp && scope.$contentNode.removeProp('animOffset');

          //如果快速翻页
          //运行动画的时候，发现不是可视页面
          //需要关闭这些动画
          var closeAnim = pageId != Xut.Presentation.GetPageId();

          if (closeAnim && scope) {
            scope.stop && scope.stop(pageId);
            scope.reset && scope.reset();
          }

          //捕获动画状态
          if (counts === 1) {
            if (closeAnim) {
              //复位动画
              self._resetAloneAnim();
            }
            self.preventRepeat = false;
            self._relevantOperation();
            outComplete && outComplete();
            self.captureAnimComplete = null;
          } else {
            --counts;
          }
        };
      }(this._contentGroup.length);

      //执行动画
      this.eachAssistContents(function (scope) {

        //标记动画正在运行
        scope.$contentNode && scope.$contentNode.prop && scope.$contentNode.prop({
          'animOffset': scope.$contentNode.offset()
        });
        scope.play(function () {
          captureAnimComplete(scope);
        });
      });

      this.runState = true;
    }

    /**
     * 停止动画
     * @return {[type]} [description]
     */

  }, {
    key: 'stopAnimation',
    value: function stopAnimation() {
      var pageId = this.relatedData.pageId;
      this.runState = false;
      this.eachAssistContents(function (scope) {
        scope.stop && scope.stop(pageId);
      });
    }

    /**
     * 销毁动画
     * @param  {[type]} elementCallback [description]
     * @return {[type]}                 [description]
     */

  }, {
    key: '_destroyAnimation',
    value: function _destroyAnimation(elementCallback) {
      var _this3 = this;

      //销毁拖动对象
      accessDrop(this.eventData, function (drop) {
        drop.destroy();
      });
      this.eachAssistContents(function (scope) {
        scope.destroy && scope.destroy(_this3.relatedData.pageId);
        elementCallback && elementCallback(scope);
      });
    }

    /**
     * 自动运行
     * @param  {[type]} outComplete [description]
     * @return {[type]}             [description]
     */

  }, {
    key: 'autoPlay',
    value: function autoPlay(outComplete) {
      var eventData = this.eventData;
      if (eventData && eventData.eventName === 'auto') {
        this.runAnimation(outComplete);
      } else {
        outComplete();
      }
    }

    /**
     * 复位状态
     * @return {[type]} [description]
     */

  }, {
    key: 'reset',
    value: function reset() {
      this.eachAssistContents(function (scope) {
        scope.reset && scope.reset(); //ppt动画
      });
      this._resetAloneAnim();
    }

    /**
     * 停止动作
     * @return {[type]} [description]
     */

  }, {
    key: 'stop',
    value: function stop() {
      if (this.runState) {
        this.stopAnimation();
      }
      this.preventRepeat = false;

      //复位盒子
      if (this.htmlBoxInstance.length) {
        _.each(this.htmlBoxInstance, function (instance) {
          instance.removeBox();
        });
      }

      //修复妙妙客户端
      //没有点击音频结束的回调
      //最多允许播放5秒
      if (this._fixAudio.length) {
        _.each(this._fixAudio, function (instance) {
          setTimeout(function () {
            instance.destroy();
          }, 5000);
        });
        this._fixAudio = [];
      }
    }

    //销毁
    //提供一个删除回调
    //用于处理浮动对象的销毁

  }, {
    key: 'destroy',
    value: function destroy(elementCallback) {

      //销毁绑定事件
      if (this.eventData.eventContext) {
        destroyContentEvent(this.eventData);
        this.eventData.eventContext = null;
      }

      //2016.1.7
      //如果有文本框事件
      //一个activity允许有多个文本框
      //所以是数组索引
      if (this.htmlBoxInstance.length) {
        _.each(this.htmlBoxInstance, function (instance) {
          instance.destroy();
        });
        this.htmlBoxInstance = null;
      }

      //销毁动画
      this._destroyAnimation(elementCallback);
      this._contentGroup = null;

      //iscroll销毁
      if (this.iscroll) {
        this.iscroll.destroy();
        this.iscroll = null;
      }

      //销毁搜索框
      if (this.searchBar) {
        this.searchBar.destroy();
        this.searchBar = null;
      }

      //销毁书签
      if (this.bookMark) {
        this.bookMark.destroy();
        this.bookMark = null;
      }

      //如果有点击音频
      if (Object.keys(this._cacheBehaviorAudio).length) {
        for (var key in this._cacheBehaviorAudio) {
          var audio = this._cacheBehaviorAudio[key];
          if (audio) {
            audio.destroy();
            this._cacheBehaviorAudio[key] = null;
          }
        }
      }

      this.$containsNode = null;
    }
  }]);
  return Activity;
}();

var activitProto = Activity.prototype;

textBoxMixin(activitProto);
bookMarkMixin(activitProto);
searchBarMixin(activitProto);
eventMixin(activitProto);

/** 配置ID
 * @return {[type]} [description]
 */
function autoUUID() {
  return 'autoRun-' + Math.random().toString(36).substring(2, 15);
}

/**
 * 给所有content节点绑定对应的事件与动画
 * 1 动画
 * 2 事件
 * 3 视觉差
 * 4 动画音频
 * 5 canvas动画
 * @return {[type]} [description]
 */
function compileActivity(callback, pipeData, contentDataset, $$floatDivertor) {
  var compiler,
      $containsNode = pipeData.$containsNode,
      eventRelated = pipeData.eventRelated,
      //合集事件
  chapterIndex = pipeData.chapterIndex,
      createActivitys = pipeData.createActivitys,
      feedbackBehavior = pipeData.feedbackBehavior,
      //反馈数据,跟事件相关
  pageBaseHooks = pipeData.pageBaseHooks,
      pageId = pipeData.chapterId;

  var floatMasterDivertor = $$floatDivertor.master;

  //如果有浮动对象,才需要计算偏移量
  //母版里面可能存在浮动或者不浮动的对象
  //那么在布局的时候想对点不一样
  //如果在浮动区域就取浮动初始值
  //否则就是默认的想对点0
  var getTransformOffset = function (ids, initTransformOffset) {
    return function (id) {
      //匹配是不是属于浮动对象
      if (ids.length && ids[id]) {
        //初始化容器布局的坐标
        return initTransformOffset;
      }
      return 0;
    };
  }(floatMasterDivertor.ids, pipeData.getStyle.offset);

  //相关回调
  var relatedCallback = {
    /*绑定卷滚条钩子*/
    'iscrollHooks': [],
    /*contetn钩子回调*/
    'contentsHooks': pageBaseHooks.contents,
    /**
     * 收集滑动事件
     * 针对mini
     * 2016.11.8
     */
    'swipeDelegateContents': pageBaseHooks.swipeDelegateContents
  };

  //相关数据
  var relatedData = {
    floatMasterDivertor: floatMasterDivertor,
    'seasonId': pipeData.chpaterData.seasonId,
    'pageId': pageId,
    'contentDataset': contentDataset, //所有的content数据合集
    'container': pipeData.liRootNode,
    'seasonRelated': pipeData.seasonRelated,
    'containerPrefix': pipeData.containerPrefix,
    'nodes': pipeData.nodes,
    'pageOffset': pipeData.pageOffset,
    'createContentIds': pipeData.createContentIds,
    'partContentRelated': pipeData.partContentRelated,
    'getTransformOffset': getTransformOffset,
    'contentsFragment': pipeData.contentsFragment,
    'contentHtmlBoxIds': pipeData.contentHtmlBoxIds
  };

  /**
   * 继续下一个任务
   * @return {[type]} [description]
   */
  var nextTask = function nextTask() {
    //多事件合集处理pagebase
    if (eventRelated) {
      pageBaseHooks.eventBinding && pageBaseHooks.eventBinding(eventRelated);
    }
    //删除钩子
    delete relatedCallback.contentsHooks;
    callback(relatedCallback);
  };

  /**
   * 生成activty控制对象
   * @type {[type]}
   */
  var makeActivity = function makeActivity(compiler) {
    return function (callback) {
      var filters;
      var imageId = compiler.imageIds; //父id
      var activity = compiler.activity;
      var eventType = activity.eventType;
      var dragdropPara = activity.para1;
      var eventContentId = imageId;

      /**
       * 多事件数据过滤
       * 为了防止数据写入错误数据
       * 如果当前对象上有多事件的行为
       * 则默认的事件去掉
       * @type {[type]}
       */
      if (filters = eventRelated['eventContentId->' + imageId]) {
        _.each(filters, function (edata) {
          //id不需要
          //eventContentId = void 0;
          if (edata.eventType == activity.eventType) {
            //写入的是伪数据,此行为让多事件抽象接管
            eventType = dragdropPara = undefined;
          }
        });
      }

      //注册引用
      pageBaseHooks.cacheActivity(new Activity({
        'noticeComplete': callback, //监听完成
        'pageIndex': pipeData.pageIndex,
        'canvasRelated': pipeData.canvasRelated, //父类引用
        'id': imageId || autoUUID(),
        "type": 'Content',
        'pageId': pageId,
        'getStyle': pipeData.getStyle,
        'activityId': activity._id,
        '$containsNode': $containsNode,
        'pageType': compiler.pageType, //构建类型 page/master
        'dataset': compiler.dataset, //动画表数据 or 视觉差表数据
        "chapterIndex": chapterIndex, //页码
        /*需要绑定事件的数据*/
        'eventData': { eventContentId: eventContentId, eventType: eventType, dragdropPara: dragdropPara, feedbackBehavior: feedbackBehavior },
        'relatedData': relatedData, //相关数据,所有子作用域Activity对象共享
        'relatedCallback': relatedCallback //相关回调
      }));
    };
  };

  //制作curry Activity闭包
  var fnsActivity = [];
  while (compiler = createActivitys.shift()) {
    fnsActivity.push(makeActivity(compiler));
  }

  // 递归解析 activitys
  var recursiveParse = function recursiveParse() {
    if (!fnsActivity.length) {
      nextTask();
      return;
    }
    var first = fnsActivity.shift();
    first(function () {
      recursiveParse();
    });
  };
  recursiveParse();
}

/**
 * 关闭按钮
 * @param  {[type]} right [description]
 * @param  {[type]} top   [description]
 * @return {[type]}       [description]
 */
var createCloseIcon = function createCloseIcon(right, top) {
  var html = void 0;
  var screenSize = Xut.config.screenSize;
  var width = screenSize.width;
  var height = screenSize.height;
  if (width > height) {
    html = "<div class=\"page-scale-close\" style=\"position: absolute;right:" + right + "px;top:" + top + "px;\">\n           <div class=\"si-icon Flaticon flaticon-error\" style=\"font-size:5.3vw;border-radius:50%;right:0\">\n           </div>\n        </div>";
  } else {
    html = "<div class=\"page-scale-close\" style=\"position: absolute;right:" + right + "px;top:" + top + "px;\">\n             <div class=\"si-icon Flaticon flaticon-error\" style=\"font-size:5.3vh;border-radius:50%;right:0;\"></div>\n        </div>";
  }
  return $(String.styleFormat(html));
};

/**
 * 创建关闭按钮
 * @return {[type]} [description]
 */
function closeButton(callback) {
  var right = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var top = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  var $closeNode = createCloseIcon(right + 4, top + 8);
  $closeNode.on("touchend mouseup", function () {
    callback();
  });
  return $closeNode;
}

var START_X = 0;
var START_Y = 0;

/**
 * 缩放、平移操作
 */
var ScalePan = function () {
  function ScalePan(_ref) {
    var rootNode = _ref.rootNode,
        _ref$hasButton = _ref.hasButton,
        hasButton = _ref$hasButton === undefined ? true : _ref$hasButton,
        updateHook = _ref.updateHook,
        _ref$tapClose = _ref.tapClose,
        tapClose = _ref$tapClose === undefined ? false : _ref$tapClose,
        tapCallabck = _ref.tapCallabck;
    classCallCheck(this, ScalePan);


    this.hasButton = hasButton;
    this.updateHook = updateHook;
    this.tapClose = tapClose;
    this.tapCallabck = tapCallabck;

    this.rootNode = rootNode instanceof $ ? rootNode[0] : rootNode;
    this._offsetWidth = this.rootNode.offsetWidth;
    this._offsetHeight = this.rootNode.offsetHeight;

    //初始化状态
    this._initState();

    //初始化事件
    this._initEvent();
  }

  createClass(ScalePan, [{
    key: '_initState',
    value: function _initState() {

      /**
       * 最大缩放值
       * @type {Number}
       */
      this.maxScale = config.launch.salePictureMultiples || 4;

      /**
       * 允许溢出值
       * @type {Number}
       */
      this.overflowValue = 0.3;

      /**
       * 已经缩放
       * @type {Boolean}
       */
      this.hasZoom = false;

      /**
       * 缩放中
       * @type {Boolean}
       */
      this.scaleing = false;

      /**
       * 最后一个缩放值
       * @type {Number}
       */
      this.lastScale = 1;

      /**
       * 是否更新中
       * @type {Boolean}
       */
      this.ticking = false;

      this.currentX = START_X;
      this.currentY = START_Y;

      /**
       * 需要更新的数据
       * @type {Object}
       */
      this.data = {
        translate: {
          x: START_X,
          y: START_Y
        },
        scale: 1
      };

      this._buttonHide();
    }

    /**
     * 初始化事件
     * @return {[type]} [description]
     */

  }, {
    key: '_initEvent',
    value: function _initEvent() {
      var _this = this;

      this.hammer = new Hammer.Manager(this.rootNode);
      this.hammer.add(new Hammer.Pan({ threshold: 0, pointers: 0, enable: false }));
      this.hammer.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith(this.hammer.get('pan'));

      //配置双击影响
      // if(!this.doubletapBan) {
      //     this.hammer.add(new Hammer.Tap({ event: 'doubletap', taps: 2, posThreshold: 30 }))
      // }

      this.hammer.add(new Hammer.Tap());

      var bindHash = {
        'pinchstart': '_onPinchStart',
        'pinchmove': '_onPinchMove',
        'pinchend': '_onPinchEnd',
        'panstart panmove': '_onPan',
        'panend': '_onPanEnd',
        'pinchcancel': '_onPinchEnd'
      };

      //如果单击关闭存在，就增加
      //否则不能阻止外部的事件关闭
      if (this.tapClose) {
        bindHash['tap'] = '_onTap';
      }

      _.each(bindHash, function (value, key) {
        _this.hammer.on(key, function (e) {
          e.preventDefault();
          e.srcEvent.stopPropagation();
          _this[value](e);
        });
      });
    }

    /**
     * 如果启动了单击关闭
       并且有缩放
     * @return {[type]} [description]
     */

  }, {
    key: '_onTap',
    value: function _onTap() {
      if (this.tapCallabck) {
        this.tapCallabck();
      } else {
        if (this.tapClose && this.data.scale != 1) {
          this.reset();
        }
      }
    }
  }, {
    key: '_onDoubletap',
    value: function _onDoubletap() {
      this.reset();
    }
  }, {
    key: '_onPinchStart',
    value: function _onPinchStart(ev) {
      this.lastScale = this.data.scale || 1;
    }

    /**
     * 缩放移动
     * @param  {[type]} ev [description]
     * @return {[type]}    [description]
     */

  }, {
    key: '_onPinchMove',
    value: function _onPinchMove(ev) {

      //允许溢出值
      if (!this.scaleing) {
        if (ev.scale < this.overflowValue + 1) {
          return;
        }
        this.scaleing = true;
      }

      var scale = ev.scale - this.overflowValue;
      scale = this.lastScale * scale;

      //限定缩放的倍数
      if (scale > this.maxScale) {
        return;
      }

      //新的缩放值
      this.data.scale = scale;

      this._buttonShow();
      this._isBoundry();
      this._updateNodeStyle();
    }

    /**
     * 缩放松手
     * @return {[type]} [description]
     */

  }, {
    key: '_onPinchEnd',
    value: function _onPinchEnd(ev) {
      var _this2 = this;

      if (this.data.scale <= 1) {
        Xut.nextTick(function () {
          _this2._initState();
          _this2._updateNodeStyle(500);
        });
      } else {
        this.overflowValue = 0;
      }
    }

    /**
     * 平移
     * @param  {[type]} ev [description]
     * @return {[type]}    [description]
     */

  }, {
    key: '_onPan',
    value: function _onPan(ev) {
      if (this._isRunning) {
        if (this.currentX != START_X || this.currentY != START_Y) {
          this.data.translate = {
            x: this.currentX + ev.deltaX,
            y: this.currentY + ev.deltaY
          };
        } else {
          this.data.translate = {
            x: START_X + ev.deltaX,
            y: START_Y + ev.deltaY
          };
        }
        this._isBoundry();
        this._updateNodeStyle();
      }
    }

    /**
     * 平移松手
     * @return {[type]} [description]
     */

  }, {
    key: '_onPanEnd',
    value: function _onPanEnd() {
      this.currentX = this.data.translate.x;
      this.currentY = this.data.translate.y;
    }

    /**
     * 边界反弹
     * @return {Boolean} [description]
     */

  }, {
    key: '_isBoundry',
    value: function _isBoundry() {
      if (this._isRunning) {
        var horizontalBoundry = (this.data.scale - 1) / 2 * this._offsetWidth;
        var verticalBoundry = (this.data.scale - 1) / 2 * this._offsetHeight;

        //左边界
        if (this.data.translate.x >= horizontalBoundry) {
          this.data.translate.x = horizontalBoundry;
        }
        //右边界
        if (this.data.translate.x <= -horizontalBoundry) {
          this.data.translate.x = -horizontalBoundry;
        }
        //上边界
        if (this.data.translate.y >= verticalBoundry) {
          this.data.translate.y = verticalBoundry;
        }
        //下边界
        if (this.data.translate.y <= -verticalBoundry) {
          this.data.translate.y = -verticalBoundry;
        }
      } else {
        this.data.scale = 1;
        this.data.translate.x = START_X;
        this.data.translate.y = START_Y;
      }
    }

    /**
     * 更新节点样式
     * @return {[type]} [description]
     */

  }, {
    key: '_updateNodeStyle',
    value: function _updateNodeStyle() {
      var _this3 = this;

      var speed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      if (!this.ticking) {
        Xut.nextTick(function () {
          var data = _this3.data;
          var transform = {
            translate: {
              x: data.translate.x,
              y: data.translate.y
            },
            scale: {
              x: data.scale,
              y: data.scale
            }
          };

          Xut.style.setTransform({
            speed: speed,
            translate: transform.translate,
            scale: transform.scale,
            node: _this3.rootNode
          });
          _this3.updateHook && _this3.updateHook(transform, speed);
          _this3.ticking = false;
        });
        this.ticking = true;
      }
    }

    /**
     * 还原
     * @return {[type]} [description]
     */

  }, {
    key: 'reset',
    value: function reset() {
      this._initState();
      this._updateNodeStyle(500);
    }

    /**
     * 创建按钮
     * @return {[type]} [description]
     */

  }, {
    key: '_createPinchButton',
    value: function _createPinchButton() {
      var _this4 = this;

      var visualSize = config.visualSize;
      var left = visualSize.overflowWidth && Math.abs(visualSize.left) || 0;
      var top = visualSize.overflowHeight && Math.abs(visualSize.top) || 0;
      var $node = closeButton(function () {
        _this4.reset();
      }, left, top);
      $(this.rootNode).after($node);
      return $node;
    }

    /**
     * 按钮显示
     * @return {[type]} [description]
     */

  }, {
    key: '_buttonShow',
    value: function _buttonShow() {
      var _this5 = this;

      //to heavy
      if (this._isRunning) return;
      if (this.data.scale > 1) {
        //必须启动配置
        if (this.hasButton) {
          if (this.$buttonNode) {
            Xut.nextTick(function () {
              _this5.$buttonNode.show();
            });
          } else {
            this.$buttonNode = this._createPinchButton();
          }
        }
        Xut.View.SetSwiperDisable(); //禁止全局滑动
        this._isRunning = true;
        this.hammer.get('pan').set({ enable: true });
      }
    }

    /**
     * 按钮隐藏
     * @return {[type]} [description]
     */

  }, {
    key: '_buttonHide',
    value: function _buttonHide() {
      if (!this._isRunning) return;
      this.hasButton && this.$buttonNode.hide();
      this._isRunning = false;
      Xut.View.SetSwiperEnable(); //全局滑动
      this.hammer.get('pan').set({ enable: false });
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.$buttonNode) {
        this.$buttonNode.off();
        this.$buttonNode = null;
      }
      if (this.hammer) {
        this.hammer.destroy();
        this.hammer = null;
      }
      if (this.$buttonNode) {
        this.$buttonNode.off();
      }
      this.update = null;
      this.rootNode = null;
    }
  }]);
  return ScalePan;
}();

/**
 * 场景控制器
 * 场景对象之间的顺序处理
 * @return {[type]} [description]
 */

//场景层级控制
var zIndex = 999999;

//场景合集
//主场景
//副场景
var sceneCollection = {
  //场景顺序
  scenarioStack: [],
  //场景链表
  scenarioChain: []
};

var sceneController = {

  /**
   * 场景层级控制
   * @return {[type]} [description]
   */
  createIndex: function createIndex() {
    return --zIndex;
  },


  /**
   * 设置一个新场景
   * @param {[type]} seasonId [description]
   * @param {[type]} relevant   [description]
   * @param {[type]} sceneObj   [description]
   */
  add: function add(seasonId, relevant, sceneObj) {
    sceneCollection.scenarioStack.push(seasonId);
    sceneCollection['seasonId->' + seasonId] = sceneObj;
    //场景链表,拥挤记录场景的加载上一页
    sceneCollection.scenarioChain.push({
      'seasonId': seasonId,
      'chapterId': relevant
    });
    return sceneObj;
  },


  /**
   * 取出上一个场景链
   * @return {[type]} [description]
   */
  takeOutPrevChainId: function takeOutPrevChainId() {
    var pre = sceneCollection.scenarioChain.pop();
    if (sceneCollection.scenarioChain.length > 1) {
      return sceneCollection.scenarioChain.pop();
    } else {
      return sceneCollection.scenarioChain[0];
    }
  },


  /**
   * 检测重复
   * @param  {[type]} seasonId [description]
   * @return {[type]}          [description]
   */
  checkToRepeat: function checkToRepeat(seasonId) {
    var last,
        len = sceneCollection.scenarioChain.length;
    if (len > 1) {
      last = sceneCollection.scenarioChain[len - 2];
    } else {
      last = sceneCollection.scenarioChain[len - 1];
    }

    //往回跳一级
    if (last['seasonId'] == seasonId) {
      this.takeOutPrevChainId();
    }

    //直接会跳到主场景
    if (sceneCollection.scenarioStack[0] == seasonId) {
      var scenarioChain = sceneCollection.scenarioChain.shift();
      sceneCollection.scenarioChain.length = 0;
      sceneCollection.scenarioChain.push(scenarioChain);
    }
  },


  /**
   * 返回活动对象
   * @return {[type]} [description]
   */
  containerObj: function containerObj(seasonId) {
    if (seasonId === 'current') {
      var scenarioStack = sceneCollection.scenarioStack;
      seasonId = scenarioStack[scenarioStack.length - 1];
    }
    return sceneCollection['seasonId->' + seasonId];
  },


  /**
   * 找到索引位置的Id
   * @param  {[type]} seasonId [description]
   * @return {[type]}            [description]
   */
  findIndexOfId: function findIndexOfId(seasonId) {
    return sceneCollection.scenarioStack.lastIndexOf(seasonId);
  },


  /**
   * 删除指定场景引用
   * @param  {[type]} seasonId [description]
   * @return {[type]}            [description]
   */
  remove: function remove(seasonId) {
    var indexOf = this.findIndexOfId(seasonId);

    //删除索引
    sceneCollection.scenarioStack.splice(indexOf, 1);

    //删除场景对象区域
    delete sceneCollection['seasonId->' + seasonId];
  },


  /**
   * 销毁所有场景
   * @return {[type]} [description]
   */
  destroyAllScene: function destroyAllScene() {
    var cache = _.clone(sceneCollection.scenarioStack);
    _.each(cache, function (seasonId) {
      sceneCollection['seasonId->' + seasonId].destroy();
    });
    sceneCollection.scenarioChain = [];
  },


  /**
   * 重写场景的顺序编号
   * 用于记录最后一次跳转的问题
   * @return {[type]} [description]
   */
  rewrite: function rewrite(seasonId, chapterId) {
    _.each(sceneCollection.scenarioChain, function (scenarioChain) {
      if (scenarioChain.seasonId == seasonId) {
        scenarioChain.chapterId = chapterId;
      }
    });
  },


  /**
   * 暴露接口
   * @return {[type]} [description]
   */
  expose: function expose() {
    return sceneCollection;
  },


  /**
   * 解析序列
   * @param  {[type]} seasonId    [description]
   * @param  {[type]} currPageIndex [description]
   * @return {[type]}               [description]
   */
  sequence: function sequence(seasonId, currPageIndex) {
    var chains = sceneCollection.scenarioChain;
    //有多个场景关系,需要记录
    if (chains.length > 1) {
      var history = [];
      //只刷新当前场景的页面
      _.each(chains, function (chain) {
        if (chain.seasonId == seasonId) {
          history.push(chain.seasonId + '-' + chain.chapterId + '-' + currPageIndex);
        } else {
          history.push(chain.seasonId + '-' + chain.chapterId);
        }
      });
      return history;
    }
  },


  /**
   * 反解析
   * @param  {[type]} chains [description]
   * @return {[type]}        [description]
   */
  seqReverse: function seqReverse(chains) {
    var chains = chains.split(",");
    var chainsNum = chains.length;

    if (chainsNum === 1) {
      return false;
    }

    //如果只有2层
    if (chainsNum === 2) {
      return chains[1];
    }

    //拼接作用域链
    //排除首页(已存在)
    //尾页(新创建)
    _.each(chains, function (chain, index) {
      if (index >= 1 && index < chainsNum - 1) {
        //从1开始吸入,排除最后一个
        var chain = chain.split('-');
        sceneCollection.scenarioChain.push({
          'seasonId': chain[0],
          'chapterId': chain[1],
          'pageIndex': chain[2]
        });
      }
    });
    return chains[chainsNum - 1];
  }
};

/**
 * given the wrapper's width and height,
 * calculates the final width, height, left and top for the image to fit inside
 * @param  {[type]} imageSize   [description]
 * @param  {[type]} wrapperSize [description]
 * @return {[type]}             [description]
 */
function getFinalSizePosition(imageSize, wrapperSize) {

  // image size
  var imgW = imageSize.width,
      imgH = imageSize.height,

  // container size
  wrapperW = wrapperSize.width,
      wrapperH = wrapperSize.height,
      finalW,
      finalH,
      finalL,
      finalT,

  // flag to indicate we could check for another source (smaller) for the image
  checksource = false,
      ratio;

  //宽度100% 自适应高度
  var widthFullAdaptiveHeight = function widthFullAdaptiveHeight() {
    finalW = wrapperW;
    // calculate the height given the finalW
    ratio = imgW / wrapperW;
    finalH = imgH / ratio;
    if (finalH > wrapperH) {
      checksource = true;
      ratio = finalH / wrapperH;
      finalW /= ratio;
      finalH = wrapperH;
    }
  };

  //高度100% 自适应宽度
  var heightFullAdaptiveWidth = function heightFullAdaptiveWidth() {
    finalH = wrapperH;
    // calculate the width given the finalH
    ratio = imgH / wrapperH;
    finalW = imgW / ratio;
    checksource = true;
    if (finalW > wrapperW) {
      checksource = false;
      ratio = finalW / wrapperW;
      finalW = wrapperW;
      finalH /= ratio;
    }
  };

  // check which image side is bigger
  //横屏图片
  if (imgW > imgH) {
    widthFullAdaptiveHeight();
  } else {
    //竖屏图片
    //竖版显示
    if (wrapperH > wrapperW) {
      widthFullAdaptiveHeight();
    }
    //横版显示
    else {
        heightFullAdaptiveWidth();
      }
  }

  return {
    width: finalW,
    height: finalH,
    left: (wrapperW - finalW) / 2 - wrapperSize.left,
    top: (wrapperH - finalH) / 2,
    checksource: checksource
  };
}

/**
 * 随机生成0-30之间的不重复的数字作为li的id
 * @return {[type]} [description]
 */


/**
 * the single view will include the image
 * navigation buttons and close, play, and pause buttons
 * @return {[type]} [description]
 */
function createContainerView(imgContainer) {
  var html = void 0;
  var visualSize = config.visualSize;
  var right = visualSize.overflowWidth && Math.abs(visualSize.right) || 0;
  var top = visualSize.overflowHeight && Math.abs(visualSize.top) || 0;
  var rightCopy = right + 4;
  var rightCopy2 = right + 3.5;
  var topCopy = top + 4;

  var zoomImg = '<img class="xut-zoom-fly"\n                      src="' + imgContainer.originSrc + '"\n                      style="width:' + imgContainer.width + 'px;\n                             height:' + imgContainer.height + 'px;\n                             top:' + imgContainer.top + 'px;\n                             left:' + imgContainer.left + 'px;" />';

  if (config.screenHorizontal) {
    html = '<div class="xut-zoom-view">\n                <div class="xut-zoom-overlay"></div>\n                <div class="xut-zoom-close" style="right:' + rightCopy + 'px;top:' + topCopy + 'px;">\n                    <div class="si-icon Flaticon flaticon-error" style="font-size:5vw;border-radius:50%;right:0">\n                    </div>\n                </div>\n                ' + zoomImg + '\n            </div>';
  } else {
    //竖屏
    html = '<div class="xut-zoom-view">\n                <div class="xut-zoom-overlay"></div>\n                <div class="xut-zoom-close" style=";right:' + rightCopy + 'px;top:' + topCopy + 'px;">\n                    <div class="si-icon Flaticon flaticon-error" style="font-size:5vh;border-radius:50%;right:0">\n                    </div>\n                </div>\n                ' + zoomImg + '\n            </div>';
  }

  return String.styleFormat(html);
}

/**
 * choose a source based on the item's size and on the configuration
 * set by the user in the initial HTML
 */
function chooseImgSource(sources, w) {
  if (w <= 0) w = 1;
  for (var i = 0, len = sources.length; i < len; ++i) {
    var source = sources[i];
    if (w > source.width) return source;
  }
}

/**
 * 执行动画
 */
function execAnimation(_ref) {
  var element = _ref.element,
      style = _ref.style,
      _ref$speed = _ref.speed,
      speed = _ref$speed === undefined ? 100 : _ref$speed;
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

  if (!element) return;
  setTimeout(function () {
    element.stop().transition(style, speed, 'linear', callback);
  }, 0);
}

function getImgConfig(properties) {
  var imgMaxW = 0;
  var imgMaxH = 0;
  var sources = properties.sources;
  var source = chooseImgSource(sources, properties.wrapper.width);

  // calculate final size and position of image
  var finalSizePosition = getFinalSizePosition(properties.image, properties.wrapper);

  // we still need to check one more detail:
  // if the source is the largest one provided in the html rules,
  // then we need to check if the final width/height are eventually bigger
  // than the original image sizes. If so, we will show the image
  // with its original size, avoiding like this that the image gets pixelated
  if (source.pos === 0 && (imgMaxW !== 0 && finalSizePosition.width > imgMaxW || imgMaxH !== 0 && finalSizePosition.height > imgMaxH)) {
    if (imgMaxW !== 0 && finalSizePosition.width > imgMaxW) {
      var ratio = finalSizePosition.width / imgMaxW;
      finalSizePosition.width = imgMaxW;
      finalSizePosition.height /= ratio;
    } else if (imgMaxH !== 0 && finalSizePosition.height > imgMaxH) {
      var ratio = finalSizePosition.height / imgMaxH;
      finalSizePosition.height = imgMaxH;
      finalSizePosition.width /= ratio;
    }
    finalSizePosition.left = properties.wrapper.width / 2 - finalSizePosition.width / 2;
    finalSizePosition.top = properties.wrapper.height / 2 - finalSizePosition.height / 2;
  }
  return {
    source: source,
    position: finalSizePosition
  };
}

/**
 * gets the position and sizes of the image given its container properties
 */

/**
 * 图片缩放功能
 * 2016.12.5
 */
var ScalePicture = function () {
  function ScalePicture(_ref) {
    var element = _ref.element,
        originalSrc = _ref.originalSrc,
        hdSrc = _ref.hdSrc,
        _ref$hasButton = _ref.hasButton,
        hasButton = _ref$hasButton === undefined ? false : _ref$hasButton;
    classCallCheck(this, ScalePicture);


    var current = sceneController.containerObj('current');
    if (current) {
      this.$container = current.getSceneNode();
    }
    if (!this.$container.length) {
      $warn('图片缩放依赖的容器不存在');
      return;
    }

    //因为取的是xut-main-scene的坐标参考
    //所以坐标的算法是有区别了
    var containerLeft = 0;
    var containerTop = 0;
    var visualSize = config.visualSize;
    if (visualSize.left) {
      containerLeft = visualSize.left;
      containerTop = visualSize.top;
    }

    this.$imgNode = element;
    this.originSrc = originalSrc;
    this.hdSrc = hdSrc;
    this.hasButton = hasButton;

    //获取图片的可视区的绝对布局尺寸
    this.originImgWidth = element.width();
    this.originImgHeight = element.height();

    var offset = element.offset();
    this.originImgLeft = offset.left - containerLeft;
    this.originImgTop = offset.top - containerTop - config.launch.visualTop;

    //关闭动画中执行中
    this.isCloseAniming = false;

    this.source = [{
      pos: 0,
      src: hdSrc ? hdSrc : originalSrc,
      width: 200
    }];

    this._init();
  }

  /**
   * 初始化
   * @return {[type]} [description]
   */


  createClass(ScalePicture, [{
    key: '_init',
    value: function _init() {
      this._initSingleView();
      this._bindTapClose();
      if (!this.targetSize) {
        this.targetSize = this._getData();
      }
      this._startZoom();
    }
  }, {
    key: '_initSingleView',
    value: function _initSingleView() {
      var _this = this;

      this.$singleView = $(createContainerView({
        width: this.originImgWidth,
        height: this.originImgHeight,
        left: this.originImgLeft,
        top: this.originImgTop,
        originSrc: this.originSrc
      }));
      this.$overlay = this.$singleView.find('.xut-zoom-overlay');
      this.$flyNode = this.$singleView.find('.xut-zoom-fly');

      //关闭按钮
      if (this.hasButton) {
        this.$closeButton = this.$singleView.find('.xut-zoom-close');
        this.callbackEnd = function () {
          _this._closeSingleView();
        };
        $on(this.$closeButton, {
          end: this.callbackEnd,
          cancel: this.callbackEnd
        });
        this.$closeButton.show();
      }

      this.$singleView.appendTo(this.$container);
    }

    /**
     * 初始化缩放数据
     * @return {[type]} [description]
     */

  }, {
    key: '_getData',
    value: function _getData() {

      var view = config.screenSize;
      var overflowLeft = 0;

      //如果有宽度溢出
      //就是说用了窗口指定模式
      if (config.visualSize.left) {
        view = config.visualSize;
      }

      //虚拟模拟3下，宽度可能溢出，所以需要取屏幕宽度
      if (config.launch.visualMode === 3) {
        view = config.screenSize;
        overflowLeft = config.visualSize.left;
      }

      return getImgConfig({
        sources: this.source,
        wrapper: {
          width: view.width,
          height: view.height,
          left: overflowLeft //模式3下溢出的left
        },
        image: {
          width: this.originImgWidth,
          height: this.originImgHeight
        }
      });
    }

    /**
     * 执行缩放
     * @return {[type]} [description]
     */

  }, {
    key: '_startZoom',
    value: function _startZoom() {
      var _this2 = this;

      var source = this.targetSize.source;
      var position = this.targetSize.position;

      // 克隆的原图放大动画
      execAnimation({
        element: this.$flyNode,
        style: {
          width: position.width,
          height: position.height,
          left: position.left,
          top: position.top
        },
        speed: 300
      }, function () {
        _this2._replaceHQIMG(position, source.src);
      });

      //白背景
      execAnimation({
        element: this.$overlay,
        style: { opacity: 1 },
        speed: 300
      });
    }

    /**
     * 创建高清图
     * 这里存在网络是2G下载非常慢的情况
     * 会导致高清图的加载会引起卡死的现象
     * 所以针对这样的情况做了处理
     */

  }, {
    key: '_createHQIMG',
    value: function _createHQIMG(position, src, success, fail) {

      //如果高清图已经存在
      if (this.$hQNode) {
        this.$hQNode.show();
        success();
        return;
      }

      //如果创建
      //创建的时候图片太大，网络太慢需要优化
      var img = new Image();

      //保证失败回调只处理一次
      var hasFail = false;
      var self = this;

      //图片失败处理
      function isFail() {
        if (hasFail) {
          return;
        }
        hasFail = true;
        img = null;
        fail();
      }

      img.onload = function () {
        //关闭动画正在执行中
        //这里要强制退出
        if (self.isCloseAniming) {
          isFail();
          return;
        }
        self.$hQNode = $(img);
        self.$hQNode.css({
          width: position.width,
          height: position.height,
          left: position.left,
          top: position.top
        }).addClass('xut-zoom-hd').appendTo(self.$singleView);
        img = null;
        success(500);
      };
      img.onerror = function () {
        isFail();
      };
      img.src = src;
    }

    /*绑定滑动*/

  }, {
    key: '_bindPan',
    value: function _bindPan($imgNode) {
      var _this3 = this;

      if (!this.slideObj && Xut.plat.hasTouch && config.launch.salePicture) {
        var tapCallabck = function tapCallabck() {
          return _this3._closeSingleView();
        };
        this.slideObj = new ScalePan({
          hasButton: false,
          rootNode: $imgNode,
          tapClose: true,
          tapCallabck: tapCallabck
        });
      }
    }

    /**
     * 是否启动图片缩放
     */

  }, {
    key: '_addPinchPan',
    value: function _addPinchPan() {
      //高清图
      if (this.$hQNode) {
        //如果高清图存在
        //因为高清可能是加载有延时
        //所以可能存在fly图先加载过的情况，这里需要直接清理
        if (this._hasBindFlyPan) {
          this._hasBindFlyPan = false;
          this._destroyRelated();
        }
        this._bindPan(this.$hQNode);
      }
      //普通图
      else if (this.$flyNode) {
          this._hasBindFlyPan = true;
          this._bindPan(this.$flyNode);
        }
    }
  }, {
    key: '_stopDefault',
    value: function _stopDefault(e) {
      e.stopPropagation && e.stopPropagation();
      e.preventDefault && e.preventDefault();
    }

    /**
     * 绑定单击关闭
     * @return {[type]} [description]
     */

  }, {
    key: '_bindTapClose',
    value: function _bindTapClose($imgNode) {
      var _this4 = this;

      var isMove = false;
      var start = function start(e) {
        _this4._stopDefault(e);
        isMove = false;
      };
      var move = function move(e) {
        _this4._stopDefault(e);
        isMove = true;
      };
      var end = function end(e) {
        _this4._stopDefault(e);
        if (!isMove) {
          if (_this4.slideObj) {
            //如果有zoom对象后，关闭由zoom接管
            //因为缩放的情况下，如果没有移动页面，会默认关闭
            //这个逻辑是不对的，只能让zoom自己检测
          } else {
            _this4._closeSingleView();
          }
        }
      };

      /********************************
       * 设置全局容器捕获处理
       ********************************/
      $on(this.$singleView, {
        start: start,
        move: move,
        end: end,
        cancel: end
      });
    }

    /**
     * 替换成高清图
     */

  }, {
    key: '_replaceHQIMG',
    value: function _replaceHQIMG(position, src) {
      var _this5 = this;

      //高清图
      if (this.hdSrc) {
        this._createHQIMG(position, src, function () {
          var speed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 200;

          //第一次高清图切换
          execAnimation({
            element: _this5.$flyNode,
            style: { 'opacity': 0 },
            speed: speed
          }, function () {
            //删除飞入图片
            //用高清图替代了
            _this5.$flyNode.hide();
            _this5._addPinchPan();
          });
        }, function () {
          _this5._addPinchPan();
        });
      }
      //普通图
      else {
          this._addPinchPan();
        }
    }

    /**
     * 复位
     * 便于第二次play
     * @return {[type]} [description]
     */

  }, {
    key: '_reset',
    value: function _reset() {
      this.$flyNode.css({
        width: this.originImgWidth,
        height: this.originImgHeight,
        left: this.originImgLeft,
        top: this.originImgTop,
        opacity: 1,
        display: 'block'
      });

      if (this.$hQNode) {
        var position = this.targetSize.position;
        this.$hQNode.css({
          width: position.width,
          height: position.height,
          left: position.left,
          top: position.top,
          display: 'none'
        });
      }

      if (this.hasButton) {
        this.$closeButton.show();
      }

      this.$overlay.css('opacity', 0);

      if (this.slideObj) {
        this.slideObj.reset();
      }
    }

    /**
     * 关闭放大高清图
     * @return {[type]} [description]
     */

  }, {
    key: '_closeSingleView',
    value: function _closeSingleView() {
      var _this6 = this;

      if (this.isCloseAniming) {
        return;
      }
      this.isCloseAniming = true;
      var $imgNode = this.$hQNode ? this.$hQNode : this.$flyNode;

      if (this.hasButton) {
        this.$closeButton.hide();
      }

      execAnimation({
        element: $imgNode,
        style: {
          width: this.originImgWidth,
          height: this.originImgHeight,
          left: this.originImgLeft,
          top: this.originImgTop
        },
        speed: 300
      }, function () {
        _this6.$singleView.hide();
        _this6._reset();
        _this6.isCloseAniming = false;
      });

      //消失背景
      execAnimation({
        element: this.$overlay,
        style: { opacity: 0 },
        speed: 200
      });
    }

    /**
     * 对外接口
     * 播放
     * @return {[type]} [description]
     */

  }, {
    key: 'play',
    value: function play() {
      this.$singleView.show();
      this._startZoom();
    }

    /**
     * 销毁相关的一些数据
     */

  }, {
    key: '_destroyRelated',
    value: function _destroyRelated() {
      if (this.slideObj) {
        this.slideObj.destroy();
        this.slideObj = null;
      }
    }

    /**
     * 对外接口
     * 销毁
     * @return {[type]} [description]
     */

  }, {
    key: 'destroy',
    value: function destroy() {

      this._destroyRelated();

      $off(this.$singleView);

      //关闭按钮
      if (this.hasButton) {
        $off(this.$closeButton);
        this.$closeButton = null;
      }

      this.$hQNode = null;
      this.$overlay = null;
      this.$container = null;
      this.$flyNode = null;
      this.$imgNode = null;

      this.$singleView.remove();
      this.$singleView = null;
    }
  }]);
  return ScalePicture;
}();

///////////////////////////
///    缩放提示图片
//////////////////////////
/*图片*/
function createHTML$1() {
  var size = config.screenSize.width > config.screenSize.height ? '2vw' : '2vh';
  return '<div class="icon-maximize"style="font-size:' + size + ';position:absolute;right:0;"></div>';
}

function zoomPicture(pipeData) {
  var zoomObjs = {};
  var behaviorData = void 0;
  _.each(pipeData.contentsFragment, function (node) {
    var behaviorData = void 0;
    if (behaviorData = pipeData.zoomBehavior[node.id]) {
      /*缩放提示图片*/
      behaviorData.prompt && $(node).append(createHTML$1());

      var hasMove = false;
      $on(node, {
        start: function start() {
          hasMove = false;
        },
        move: function move() {
          hasMove = true;
        },
        end: function end() {
          if (hasMove) return;
          var $node = $(node);
          var $imgNode = $node.find('img');
          if (!$imgNode.length) {
            return;
          }

          /*存在*/
          var src = $imgNode[0].src;
          if (zoomObjs[src]) {
            return zoomObjs[src].play();
          }

          /*创建*/
          var analysisName = analysisImageName(src);
          zoomObjs[src] = new ScalePicture({
            element: $imgNode,
            originalSrc: getFileFullPath(analysisName.suffix, 'pagebase-zoom'),
            hdSrc: getHDFilePath(analysisName.original)
          });
        }
      });

      /*销毁*/
      behaviorData.off = function () {
        $off(node);
        node = null;
      };
    }
  });

  return zoomObjs;
}

/********************************************************
 **
 ** 数据过滤,去重算法
 **  content数据解析息息相关的方法
 **
 *********************************************************/

//零件类型,快速判断
//新增content卷滚区域,所有JS零件content
//类型选择,content有扩充的子类型
//针对零件类型在category字段中的子分类
var widgetType = {};
_.each("jsWidget content svgWidget canvasWidget path".split(" "), function (key, name) {
  widgetType[key] = true;
});

/**
 * 类型统一
 * 满足条件统一为零件类型
 */
function unifyType(activity) {
  return widgetType[activity.category] ? "JsWidget" : activity.actType;
}

/**
 * 配合出item中相关信息
 * 1.场景信息
 * 2.收费信息
 * @param  {[type]} tokens [description]
 * @return {[type]}        [description]
 */
var itemTokens = ['seasonId', 'Inapp', 'SearchBar', 'BookMarks'];

function relatedTokens(relateds, activitys, tokens) {
  var tokenNumber = Object.keys(tokens);

  //快速过滤，如果仅仅只是Animation
  if (tokenNumber.length === 1 && ~tokenNumber.indexOf('Animation')) {
    return;
  }

  var eventId = activitys.imageId;

  /*创建事件容器*/
  var createEventContainer = function createEventContainer() {
    if (!relateds.seasonRelated[eventId]) {
      relateds.seasonRelated[eventId] = {};
    }
  };

  itemTokens.forEach(function (type) {
    var values = tokens[type];
    var chapterId = void 0;
    if (values !== undefined) {
      createEventContainer(); //创建容器
      switch (type) {
        case 'seasonId':
          //跳转新场景信息
          chapterId = tokens['chapterId'] || tokens['chapter'];
          relateds.seasonRelated[eventId] = {
            seasonId: values[0],
            chapterId: chapterId ? chapterId[0] : ''
          };
          break;
        case 'Inapp':
          //收费信息,给事件上绑定收费接口,0 收费 1 已收费
          relateds.seasonRelated[eventId]['Inapp'] = values[0];
          break;
        default:
          //搜索栏,书签
          relateds.seasonRelated[eventId][type] = eventId;
          break;
      }
    }
  });
}

/**
 * 分组
 * @return {[type]} [description]
 */
function tokenGroup(tableName, contentIds) {
  var k = void 0,
      keyName = void 0,
      data = void 0,
      contentId = void 0,
      temp = {},
      dataset = [],
      //数据合集
  idset = []; //id合集

  var query = Xut.data.query;

  _.each(contentIds, function (id) {
    if (data = query(tableName, id)) {
      contentId = data.contentId;
      if (-1 === idset.indexOf(contentId)) {
        idset.push(contentId);
      }
      //合并同个contentId多条动画数据的情况
      keyName = "contentId-" + contentId;
      if (temp[keyName]) {
        temp[keyName].push(data);
      } else {
        temp[keyName] = [data];
      }
    }
  });

  //转成数组格式
  for (k in temp) {
    dataset.push(temp[k]);
  }

  return { dataset: dataset, idset: idset };
}

/**
 * 解析基本数据
 * Animation
 * Parallax
 */
function parseBaseTokens(tableName, tokenIds) {
  var tokenId = void 0;
  var result = {};
  _.each(tableName, function (name) {
    if (tokenId = tokenIds[name]) {
      if (result[name]) {
        $warn('未处理解析同一个表');
      } else {
        result[name] = tokenGroup(name, tokenId);
      }
    }
  });
  return result;
}

/**
 * 解析itemArray序列,得到对应的id
   需要分解的contentIds合集
     1 动画表数据    Animation
     2 视觉差数据    Parallax
     3 超链接        seasonId
     4 收费          Inapp
     return token = {
        Animation:[1,2,3......]
        Parallax:[4,5,6.....]
        seasonId:[1,2...]
     }
 */
function parseItems(itemArray) {
  if (!itemArray) return;
  var actType = void 0;
  var tokens = {};
  itemArray = parseJSON(itemArray);
  if (itemArray.length) {
    _.each(itemArray, function (item) {
      actType = item.actType;
      if (!tokens[actType]) {
        tokens[actType] = [];
      }
      tokens[actType].push(item.id);
    });
  } else {
    actType = itemArray.actType;
    //actType: "Animation", id: 14
    //actType: "Inapp", value: 0
    tokens[actType] = [itemArray.id || itemArray.value];
  }
  return tokens;
}

/**
 * 分组Content表中对应的多个
 *  1：Animation表
 *  2: Parallax表
 *  3: seed种子合集 就是解析1：Animation表，Parallax表得到的数据
 */
function coreParser(callback, activity, pageType, chapterIndex) {
  var contentIdset,
      parallaxContentIdset,
      seedParallaxs,
      parallaxDataset,
      seedAnimations,
      contentDataset = '',
      eventId = activity.imageId,
      tokens = parseItems(activity['itemArray']) || [],

  /*
    解析Animations,Parallaxs数据
    seed {
        Animation:[dataset,Idset]
        Parallax:[dataset,Idset]
    }
   */
  seed = callback(tokens),


  //判断类型
  type = Object.keys(seed)[0];

  /**
   * 去重事件ID
   * original  原ID合集
   * detection 需要检测去重的ID
   *
   */
  function toRepeatContents(original) {
    if (original && eventId) {
      var indexOf = original.indexOf(eventId);
      if (-1 !== indexOf) {
        original.splice(indexOf, 1);
      }
    }
  }

  switch (type) {
    case 'Container':
      //容器
      contentIdset = seed.Container;
      toRepeatContents(contentIdset);
      break;
    case 'Contents':
      //多事件处理
      return seed.Contents;
    default:

      ////////////////////////////////////////
      ///       如果是对象处理，              //
      ///       针对动画表，视觉差表,行为的处理 //
      ////////////////////////////////////////

      /*需要创建的content合集*/
      if (_.keys(seed).length) {

        var _seedAnimations = seed.Animation;
        var _seedParallaxs = seed.Parallax;

        //页面模式
        if (pageType === 'page') {
          if (_seedAnimations) {
            contentIdset = _seedAnimations.idset;
            contentDataset = _seedAnimations.dataset;
          }
        } else {
          //视觉差存在视觉差表处理
          // console.log(1111,seedAnimations, seedParallaxs)
          //母版的动画数据
          if (_seedAnimations) {
            contentIdset = _seedAnimations.idset;
            contentDataset = _seedAnimations.dataset;
          }
          //母版的视察数据
          if (_seedParallaxs) {
            parallaxContentIdset = _seedParallaxs.idset;
            parallaxDataset = _seedParallaxs.dataset;
          }
        }

        //如果id都存在
        //合并
        if (contentIdset && parallaxContentIdset) {
          contentIdset = contentIdset.concat(parallaxContentIdset);
        }

        //只存在视察
        if (!contentIdset && parallaxContentIdset) {
          contentIdset = parallaxContentIdset;
        }
        toRepeatContents(contentIdset);
      }
      break;
  }

  //创建对象是层次关系
  return {
    'pageType': pageType,
    'activity': activity,
    'imageIds': eventId,
    //data
    'dataset': {
      'animation': contentDataset,
      'parallax': parallaxDataset
    },
    //id
    'idset': {
      'content': contentIdset,
      'parallax': parallaxContentIdset
    }
  };
}

/**
 * 合并,过滤需要处理的content
 *  combineImageIds  可以创建的imageId合集，也就是content的合集,用来绑定自定义事件
 *  createContentIds 可以创建的content合集,过滤合并重复
 */
function toRepeatCombineGroup(compilerActivitys, mixFilterRelated, pageType) {
  var idset,
      contentIds,
      needCreateContentIds,
      imageIds,
      activityRelated,
      parallaxId,
      combineItemIds = [],
      combineImageIds = [],
      i = compilerActivitys.length;

  function pushCache(target, original, callback) {
    var id,
        i = original.length;
    while (i--) {
      id = Number(original[i]);
      target.push(id);
      callback && callback(id);
    }
  }

  while (i--) {
    //开始执行过滤操作
    activityRelated = compilerActivitys[i];
    idset = activityRelated.idset;
    contentIds = idset.content;
    parallaxId = idset.parallax; //浮动类型的对象
    imageIds = activityRelated.imageIds;

    //针对普通content对象
    if (contentIds && contentIds.length) {
      //如果不为空
      pushCache(combineItemIds, contentIds);
    }

    //视察对象
    if (parallaxId && parallaxId.length) {
      //如果不为空
      pushCache(combineItemIds, parallaxId);
    }

    //事件合集
    if (imageIds) {
      combineImageIds.push(Number(imageIds));
    }
  }

  //混入外部合并了逻辑
  if (mixFilterRelated && mixFilterRelated.length) {
    _.each(mixFilterRelated, function (data) {
      if (data) {
        combineItemIds = combineItemIds.concat(data);
      }
    });
  }

  //过滤合并多个content数据
  if (combineImageIds.length) {
    needCreateContentIds = arrayUnique(combineItemIds.concat(combineImageIds));
  } else {
    needCreateContentIds = arrayUnique(combineItemIds);
  }

  //排序
  needCreateContentIds = needCreateContentIds.sort(function (a, b) {
    return a - b;
  });

  /**
   * 合并创建信息
   * 需要创建的事件
   * 需要创建的所有对象
   */
  return [combineImageIds, needCreateContentIds];
}

/**
 * 解析解析每一条 Activitys 对应的数据结构
 * @param  {[type]} compileActivitys [description]
 * @param  {[type]} data             [description]
 * @return {[type]}                  [description]
 */
function contentParser(compileActivitys, pipeData) {

  var activity = void 0,
      hookType = void 0,
      //结果合集
  i = compileActivitys.length,
      pageType = pipeData.pageType,
      chapterIndex = pipeData.chapterIndex,


  /*相关数据合集*/
  activityRelated = [],
      //Activit合集相关数据信息
  tempRelated = [],
      //临时数据

  /*解析出来的相关信息*/
  relateds = {
    seasonRelated: {}, //节信息
    containerRelated: [], //容器合集相关数据信息
    eventRelated: {}, //多事件容器合集
    partContentRelated: [] //卷滚conten只创建,不处理行为
  };

  /*创建解析*/
  var createResolve = function createResolve(callback) {
    return coreParser(function (tokens) {
      return callback(tokens);
    }, activity, pageType, chapterIndex);
  };

  /*类型处理器，除去动画的其余处理类型*/
  var hookResolve = {

    /*单独处理容器类型*/
    Container: function Container() {
      relateds.containerRelated.push(createResolve(function (tokens) {
        return {
          'Container': tokens['Content']
        };
      }));
    },


    /*多事件*/
    Contents: function Contents() {
      var item;
      if (item = createResolve(function (tokens) {
        return {
          'Contents': [tokens]
        };
      })[0]) {
        //给content注册多个绑定事件
        var eventId = activity.imageId;
        var eventData = {
          'eventContentId': eventId,
          'activityId': activity._id,
          'registers': item['activity'],
          'eventType': activity.eventType,
          'dragdropPara': activity.para1 //拖拽对象
        };
        var isEvt = relateds.eventRelated['eventContentId->' + eventId];
        if (isEvt) {
          isEvt.push(eventData);
        } else {
          relateds.eventRelated['eventContentId->' + eventId] = [eventData];
        }
      }
    },


    /*所有js零件*/
    JsWidget: function JsWidget() {
      var scrollContents = parseJSON(activity.itemArray);
      if (_.isArray(scrollContents)) {
        _.each(scrollContents, function (content) {
          relateds.partContentRelated.push(content.id);
        });
      } else {
        relateds.partContentRelated.push(scrollContents.id);
      }
    }
  };

  /**
   * 解析出当前页面的所有的Activit表
   * 1个chpater页面 可以对应多个Activit表中的数据
   * 1 Container 容器类型
   * 2 page 类型
   * 3 parallax 类型
   * 4 Scenario 类型
   * 5 content合集 contents处理
   */
  while (activity = compileActivitys.shift()) {
    //统一类型
    hookType = unifyType(activity);

    /*如果有钩子匹配就先处理钩子*/
    if (!hookResolve[hookType] || hookResolve[hookType] && hookResolve[hookType](relateds)) {
      /*如果是动画表,视觉差表关联的content类型 ,tokens => itemArray分类数据*/
      var results = createResolve(function (tokens) {
        //解析其余tokens
        relatedTokens(relateds, activity, tokens);
        //母版是可能带视觉差的，所以除了Animation还有Parallax
        if (pageType === 'page') {
          return parseBaseTokens(['Animation'], tokens);
        } else if (pageType === 'master') {
          return parseBaseTokens(['Animation', 'Parallax'], tokens);
        }
      });

      //如果有手动触发器,置于最后
      if (activity.imageId) {
        tempRelated.push(results);
      } else {
        activityRelated.push(results);
      }
    }
  }

  //合并排序
  if (tempRelated.length) {
    activityRelated = activityRelated.concat(tempRelated);
    tempRelated = null;
  }

  /**
   *  过滤出与创建相关的content合集ID
   *      createEventIds  主content列表 (用来绑定eventType事件)
   *      createContentIds 合并所有content操作后,过滤掉重复的content,得到可以创建的content的ID合集
   */
  var createRelevant = toRepeatCombineGroup(activityRelated, relateds.partContentRelated, pageType);
  var createEventIds = createRelevant[0];
  var createContentIds = createRelevant[1];

  //如果存在过滤器
  if (Xut.CreateFilter.size()) {
    var filterEach = Xut.CreateFilter.each(pipeData.chapterId);
    if (filterEach) {
      filterEach(createEventIds, function (indexOf) {
        createEventIds.splice(indexOf, 1);
      });
      filterEach(createContentIds, function (indexOf) {
        createContentIds.splice(indexOf, 1);
      });
      filterEach = null;
    }
  }

  return _.extend(pipeData, relateds, {
    'createEventIds': createEventIds, //事件ID数
    'createContentIds': createContentIds, //创建的content总ID数
    'createActivitys': activityRelated
  });
}

/**
 * 行为反馈
 *  content id = {
 *      弹动
 *      音频URl
 *  }
 *  2016.12.6
 *     增加，点击放大 zoom
 */
function parseBehavior(pipeData) {
  var parameter = void 0;
  var soundSrc = void 0;
  var contentId = void 0;
  var isButton = void 0;
  var feedbackBehavior = pipeData.feedbackBehavior = {}; //点击行为
  var zoomBehavior = pipeData.zoomBehavior = {}; //缩放行为
  var hasZoom = void 0;
  var chapterIndex = pipeData.chapterIndex;
  var prefix = void 0;
  var id = void 0;

  _.each(pipeData.activitys, function (activitys) {
    if (activitys.parameter && (parameter = parseJSON(activitys.parameter))) {
      contentId = activitys.imageId;

      //视觉反馈
      if (isButton = parameter['isButton']) {
        if (isButton != 0) {
          //过滤数据的字符串类型
          createFn(feedbackBehavior, contentId, function () {
            this['isButton'] = true;
          });
        }
      }

      //音频行为
      if (soundSrc = parameter['behaviorSound']) {
        if (soundSrc != 0) {
          createFn(feedbackBehavior, contentId, function () {
            this['behaviorSound'] = soundSrc;
          });
        }
      }

      //点击图片放大
      if (hasZoom = parameter['zoom']) {
        if (hasZoom.length) {
          _.each(hasZoom, function (zoomData) {
            id = zoomData.content;
            if (id) {
              //保存于节点node命名一致，方便快速查找
              prefix = "Content_" + chapterIndex + "_" + id;
              createFn(zoomBehavior, prefix, function () {
                //缩放提示图片
                this['prompt'] = zoomData.prompt ? true : false;
              });
            }
          });
        }
      }
    }
  });
}

/*解析出需要构建的Activity数据*/
function activityParser(pipeData) {
  var actType = void 0;
  var activitys = [];
  _.each(pipeData.activitys, function (activity) {
    actType = activity.actType || activity.animation;
    //特殊类型 showNote
    if (!actType && activity.note) {
      activity['actType'] = actType = "ShowNote";
    }
    /*匹配content处理相关类型*/
    if (activity.itemArray || activity.autoPlay !== 2) {
      switch (actType) {
        case 'Container':
        case 'Content':
        case 'Parallax':
        case 'Contents':
          activitys.push(activity);
          break;
      }
    }
  });
  return activitys;
}

var maskBoxImage$1 = Xut.style.maskBoxImage;
var FLOOR$2 = Math.floor;

/**
 * 蒙版动画
 */
var maskContent = function maskContent(data, wrapObj) {

  //如果有蒙版图
  var isMaskImg = data.mask ? maskBoxImage$1 + ":url(" + getFileFullPath(data.mask, 'content-mask') + ");" : "";
  var resourcePath = wrapObj.resourcePath;
  var restr = "";

  //蒙板图
  if (data.mask || wrapObj['isGif']) {
    //蒙版图
    if (maskBoxImage$1 != undefined) {
      restr += String.styleFormat('<img data-type="' + (data.qrCode ? 'qrcode' : 'mask') + '"\n              class="inherit-size fullscreen-background edges"\n              src="' + resourcePath + '"\n              onerror="fixNodeError(\'image\',this,\'' + wrapObj.chapterIndex + '\',\'' + resourcePath + '\')"\n              style="' + isMaskImg + '"/>');
    } else {
      //canvas
      restr += String.styleFormat('<canvas class="inherit-size fullscreen-background edges"\n                 src="' + resourcePath + '"\n                 mask="' + isMaskImg + '"\n                 width="' + data.scaleWidth + '"\n                 height="' + data.scaleHeight + '"\n                 style="opacity:0;' + (config.data.pathAddress.replace(/\//g, "\/") + data.mask) + '"/>');
    }

    //精灵图
  } else if (data.category == 'Sprite') {

    var matrixX = 100 * data.thecount;
    var matrixY = 100;

    //如果有参数
    //精灵图是矩阵图
    if (data.parameter) {
      var parameter = parseJSON(data.parameter);
      if (parameter && parameter.matrix) {
        var matrix = parameter.matrix.split("-");
        matrixX = 100 * Number(matrix[0]);
        matrixY = 100 * Number(matrix[1]);
      }
    }
    restr += String.styleFormat('<div data-type="sprite-images"\n            class="sprite"\n            style="height:' + data.scaleHeight + 'px;\n                   background-image:url(' + resourcePath + ');\n                   background-size:' + matrixX + '% ' + matrixY + '%;">\n      </div>');
  } else {
    //普通图片
    restr += String.styleFormat('<img data-type="' + (data.qrCode ? 'qrcode' : 'ordinary') + '"\n            class="inherit-size fullscreen-background fix-miaomiaoxue-img"\n            src="' + resourcePath + '"\n            onerror="fixNodeError(\'image\',this,\'' + wrapObj.chapterIndex + '\',\'' + resourcePath + '\')"\n            style="' + isMaskImg + '"/>');
  }

  return restr;
};

/**
 * 纯文本内容
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
var textContent = function textContent(data) {
  return String.styleFormat('<div id="' + data['_id'] + '"\n          style="background-size:100% 100%;height:auto">\n          ' + data.content + '\n    </div>');
};

/**
 * 如果是.js结尾的
 * 新增的html文件
 * @param  {[type]} data    [description]
 * @param  {[type]} wrapObj [description]
 * @return {[type]}         [description]
 */
var jsContent = function jsContent(data, wrapObj) {
  return replacePath(wrapObj.htmlstr);
};

/**
 * 如果内容是svg
 * @param  {[type]} data    [description]
 * @param  {[type]} wrapObj [description]
 * @return {[type]}         [description]
 */
var svgContent = function svgContent(data, wrapObj) {
  var restr = "";
  var svgstr = wrapObj.svgstr;
  var scaleWidth = data.scaleWidth;

  //从SVG文件中，读取Viewport的值
  if (svgstr != undefined) {

    //替换svg内部读取文件地址
    svgstr = replacePath(svgstr);

    var startPos = svgstr.search('viewBox="');
    var searchTmp = svgstr.substring(startPos, startPos + 64).replace('viewBox="', '').replace('0 0 ', '');
    var endPos = searchTmp.search('"');
    var temp = searchTmp.substring(0, endPos);
    var sptArray = temp.split(" ");
    var svgwidth = sptArray[0];
    var svgheight = sptArray[1];

    //svg内容宽度:svg内容高度 = viewBox宽:viewBox高
    //svg内容高度 = svg内容宽度 * viewBox高 / viewBox宽
    var svgRealHeight = FLOOR$2(scaleWidth * svgheight / svgwidth);
    //如果svg内容高度大于布局高度则添加滚动条
    if (svgRealHeight > data.scaleHeight + 1) {
      var svgRealWidth = FLOOR$2(scaleWidth);
      //if there do need scrollbar, then restore text to its original prop
      //布局位置
      var marginleft = wrapObj.backMode ? data.scaleLeft - data.scaleBackLeft : 0;
      var margintop = wrapObj.backMode ? data.scaleTop - data.scaleBackTop : 0;

      if (data.isScroll) {
        restr = String.styleFormat('<div data-type="svg"\n                style="width:' + svgRealWidth + 'px;\n                       height:' + svgRealHeight + 'px;\n                       margin-left:' + marginleft + 'px;\n                       margin-top:' + margintop + 'px;">\n                ' + svgstr + '\n          </div>');
      } else {
        restr = String.styleFormat('<div data-type="svg"\n                class="inherit-size"\n                style="margin-left:' + marginleft + 'px;\n                       margin-top:' + margintop + 'px;">\n              ' + svgstr + '\n          </div>');
      }
    } else {
      restr += svgstr;
    }
  }
  return restr;
};

/**
 * 填充content内容
 * @param  {[type]} data    [description]
 * @param  {[type]} wrapObj [description]
 * @return {[type]}         [description]
 */
var fillContent = function fillContent(data, wrapObj) {
  var restr = '';
  //如果内容是图片
  //如果是svg或者html
  if (wrapObj.fileName) {
    //如果是SVG
    if (wrapObj.isSvg) {
      restr += svgContent(data, wrapObj);
    }
    //如果是.js结构的html文件
    else if (wrapObj.isJs) {
        restr += jsContent(data, wrapObj);
      }
      //如果是蒙板，或者是gif类型的动画，给高度
      else {
          restr += maskContent(data, wrapObj);
        }
  }
  //纯文本文字
  else {
      restr += textContent(data, wrapObj);
    }
  return restr;
};

/**
 * 创建包含容器content
 * @param  {[type]} data    [description]
 * @param  {[type]} wrapObj [description]
 * @return {[type]}         [description]
 */
var createContainer$1 = function createContainer(data, wrapObj) {
  var wapper = void 0;
  var backwidth = void 0,
      backheight = void 0,
      backleft = void 0,
      backtop = void 0;
  var zIndex = data.zIndex;
  var id = data._id;

  //Content_23_37
  //Content_23_38
  //Content_23_39
  var containerName = wrapObj.containerName;

  //背景尺寸优先
  if (data.scaleBackWidth && data.scaleBackHeight) {
    backwidth = data.scaleBackWidth;
    backheight = data.scaleBackHeight;
    backleft = data.scaleBackLeft;
    backtop = data.scaleBackTop;
    wrapObj.backMode = true; //背景图模式
  } else {
    backwidth = data.scaleWidth;
    backheight = data.scaleHeight;
    backleft = data.scaleLeft;
    backtop = data.scaleTop;
  }

  //content默认是显示的数据的
  //content.visible = 0
  //如果为1 就隐藏改成hidden
  //05.1.14
  var visibility = 'visible';
  if (data.visible) {
    visibility = 'hidden';
  }

  /*css3 滤镜效果 2017.5.12支持,filterNames数组形式*/
  var filterName = data.filterNames ? data.filterNames.join(' ') : '';

  // var isHtml = "";
  //2015.12.29
  //如果是html内容
  if (wrapObj.isJs) {
    wapper = '<div id="' + containerName + '"\n                   data-behavior="click-swipe"\n                   class="fullscreen-background ' + filterName + '"\n                   style="width:' + backwidth + 'px;\n                          height:' + backheight + 'px;\n                          top:' + backtop + 'px;\n                          left:' + backleft + 'px;\n                          position:absolute;\n                          z-index:' + zIndex + ';\n                          visibility:' + visibility + ';\n                          {10}">\n               <div data-type="scroller"\n                    style="width:' + backwidth + 'px;\n                           position:absolute;">';
    return String.styleFormat(wapper);
  } else {
    //scroller:=> absolute 因为别的元素有依赖
    var background = data.background ? 'background-image: url(' + getFileFullPath(data.background, 'content-container') + ');' : '';

    //正常content类型
    //如果是scroller需要绝对的尺寸，所以替换100% 不可以
    wapper = '<div id="' + containerName + '"\n                   data-behavior="click-swipe"\n                   class="' + filterName + '"\n                   style="width:' + backwidth + 'px;\n                          height:' + backheight + 'px;\n                          top:' + backtop + 'px;\n                          left:' + backleft + 'px;\n                          position:absolute;\n                          z-index:' + zIndex + ';\n                          visibility:' + visibility + '">\n              <div data-type="scroller"\n                   class="fullscreen-background "\n                   style="width:' + backwidth + 'px;\n                          height:' + backheight + 'px;\n                          position:absolute;\n                          ' + background + '">';

    return String.styleFormat(wapper);
  }
};

/**
 * 组成HTML结构
 * @param  {[type]} argument [description]
 * @return {[type]}          [description]
 */
function createDom(data, wrapObj) {
  var restr = '';

  //创建包装容器content节点
  restr += createContainer$1(data, wrapObj);

  //创建内容
  restr += fillContent(data, wrapObj);
  restr += "</div></div>";

  return restr;
}

/**
 * 组成HTML结构
 * @param  {[type]} argument [description]
 * @return {[type]}          [description]
 */
function createCanvas(data, wrapObj) {

  var mark = '';
  if (data.category) {
    var cats = data.category.split(",");
    var len = cats.length;
    if (len) {
      while (len--) {
        mark += cats[len];
      }
    }
  }

  var temp = '<canvas id="{0}"' + ' data-ctype={1}' + ' width="{2}"' + ' height="{3}">' + '</canvas>';

  var str = String.format(temp, wrapObj.makeId('canvas'), mark.toLocaleLowerCase(), data.scaleWidth, data.scaleHeight);

  return str;
}

/**
 * 解析序列中需要的数据
 * @param  {[type]}   contentIds [description]
 * @param  {Function} callback   [description]
 * @return {[type]}              [description]
 */
function parseContentData(contentIds, callback) {
  var data,
      temp = [];
  contentIds.forEach(function (contentId, index) {
    data = Xut.data.query('Content', contentId);
    temp.unshift(data);
    callback && callback(data, contentId);
  });
  return temp;
}

/**
 * 针对容器类型的处理
 * @param  {[type]} containerName [description]
 * @param  {[type]} contentId     [description]
 * @param  {[type]} chapterIndex     [description]
 * @return {[type]}               [description]
 */
var createContainerWrap = function createContainerWrap(containerName, contentId, chapterIndex, getStyle) {
  var contentResult = parseContentData([contentId]);
  var data = reviseSize({
    results: contentResult[0],
    proportion: getStyle.pageProportion
  });
  var wapper = '<div  id="' + containerName + '"\n               data-behavior="click-swipe"\n               style="width:' + data.scaleWidth + 'px;\n                      height:' + data.scaleHeight + 'px;\n                      top:' + data.scaleTop + 'px;\n                      left:' + data.scaleLeft + 'px;\n                      position:absolute;\n                      z-index:' + data.zIndex + ';">';

  return String.styleFormat(wapper);
};

function createContainer$2(containerRelated, chapterIndex, getStyle) {
  var itemIds,
      uuid,
      contentId,
      containerName,
      containerObj = {
    createUUID: [],
    containerName: []
  };

  containerRelated.forEach(function (data, index) {
    contentId = data.imageIds;
    containerName = "Container_" + chapterIndex + "_" + contentId;
    uuid = "aaron" + Math.random();
    containerObj[uuid] = {
      'start': [createContainerWrap(containerName, contentId, chapterIndex, getStyle)],
      'end': '</div>'
    };
    containerObj.createUUID.push(uuid);
    containerObj.containerName.push(containerName);
    data.itemIds.forEach(function (id) {
      containerObj[id] = uuid;
    });
  });
  return containerObj;
}

/**
 * 设置canvas数据
 */
var createCanvasData = function createCanvasData(type, opts) {

  var data = opts.data;
  var contentId = opts.contentId;
  var conData = opts.conData;

  //content收集id标记
  //cid =>content=> 普通动画 ppt
  //wid =>widget=>高级动画
  if (data.canvasRelated[type].indexOf(contentId) == -1) {
    data.canvasRelated[type].push(contentId);
    conData.actionTypes[type] = true;
  }

  if (data.canvasRelated.contentIdset.indexOf(contentId) == -1) {
    data.canvasRelated.contentIdset.push(contentId);
  }

  //给content数据增加直接判断标示
  conData.canvasMode = true;

  //拿到最高层级
  if (conData.zIndex) {
    if (conData.zIndex > data.canvasRelated.containerIndex) {
      data.canvasRelated.containerIndex = conData.zIndex;
    }
  }
};

/**
 * canvas pixi.js类型处理转化
 * 填充cid, wid
 * @type {Object}
 */
var pixiType = {
  //普通精灵动画
  "Sprite": function Sprite(opts, data) {
    if (data.canvasRelated.enable) {
      //启动精灵模式
      //在动画处理的时候给initAnimations快速调用
      createCanvasData('spiritId', opts);
    }
  },
  //ppt=》pixi动画
  "PPT": function PPT(opts, data) {
    //双重判断
    //必须启动cnavas模式
    //必须数据是canvs模式
    //因为ppt只支持 高级与复杂精灵
    if (data.canvasRelated.enable && opts.conData.canvasMode) {
      createCanvasData('pptId', opts);
    }
  },
  //高级精灵动画
  //widget
  "SeniorSprite": function SeniorSprite(opts, data) {
    if (data.canvasRelated.enable) {
      createCanvasData('widgetId', opts);
    }
  },
  //复杂精灵动画
  //可以在dom模式与canvas混合使用
  //所以dom下还要强制开始canvasMode
  "CompSprite": function CompSprite(opts) {
    var data = opts.data;
    var conData = opts.conData;
    if (/\./i.test(opts.conData.md5)) {
      console.log('复杂精灵动画数据错误');
      return;
    }

    //特殊判断，见canvas.js
    //如果没有启动canvas也能走进这个程序
    //给上特殊标示
    if (!data.canvasRelated.enable && !data.canvasRelated.onlyCompSprite) {
      //仅仅只是满足特殊动画
      //特殊模式，可能chapter表中没有启动canvas模式
      data.canvasRelated.onlyCompSprite = true;
    }
    createCanvasData('compSpriteId', opts);
  }

};

/**
 * 解析参数
 */
function callResolveArgs(category, opts) {
  var cate;
  var val;
  var data = opts.data;
  var cates = category.split(",");
  var length = cates.length;
  var i = 0;
  //判断ppt是不是数组中最后一个
  //如果不是，需要对调位置
  var pptindex = cates.indexOf('PPT');

  //如果是首位
  if (pptindex == 0) {
    //ppt永远最后一个
    cates = cates.concat(cates.splice(pptindex, 1));
  }

  if (length) {
    for (var i = 0; i < length; i++) {
      cate = cates[i];
      //匹配数据类型
      pixiType[cate] && pixiType[cate](opts, data);
    }
  }
}

/**
 * 解析canvas数据
 *
 */
function parseCanvas(contentId, category, conData, data) {

  //类型转化
  //双数据类型转行单个类型
  if (Xut.config.debug.onlyDomMode) {
    if (category) {
      var cat;
      var cats = category.split(",");
      var len = cats.length;
      if (len > 1) {
        //删除ppt
        var pptindex = cats.indexOf('PPT');
        if (-1 != pptindex) {
          cats.splice(pptindex, 1);
        }
      }
      conData.category = cats[0];
    }
    return;
  }

  //动作类型
  //用于动画判断
  conData.actionTypes = {};

  //下一个数据
  var opts = {
    contentId: contentId,
    conData: conData,
    data: data
  };

  //转成canvas标记
  //如果有pixi的处理类型
  //2016.2.25
  //SeniorSprite,PPT
  //Sprite,PPT
  //SeniorSprite
  //Sprite
  //PPT
  //CompSprite
  //多种处理方式
  //可以组合
  category && callResolveArgs(category, opts);
}

/**
 * 编译content的容器
 * 2013.10.12
 * 1 为处理重复content数据引用问题,增加
 *            makeWarpObj方法,用于隔绝content数据的引用关系，导致重复数据被修正的问题
 * 2 多个页面引用同一个content的处理，Conetnt_0_1 ,类型+页码+ID的标示
 * @return {[type]} [description]
 */

/**
 * 制作包装对象
 * 用于隔绝content数据的引用关系
 * 导致重复数据被修正的问题
 * @return {[type]}             [description]
 */
var makeWarpObj = function makeWarpObj(contentId, content, pageType, chapterIndex) {
  //唯一标示符
  var prefix = "_" + chapterIndex + "_" + contentId;
  return {
    pageType: pageType,
    contentId: contentId,
    isJs: /.js$/i.test(content.md5), //html类型
    isSvg: /.svg$/i.test(content.md5), //svg类型
    contentData: content,
    chapterIndex: chapterIndex,
    containerName: 'Content' + prefix,
    makeId: function makeId(name) {
      return name + prefix;
    }
  };
};

/**
 * 创建图片地址
 * @return {[type]}         [description]
 */
var analysisPath = function analysisPath(wrapObj, conData) {

  var resourcePath = void 0; //资源路径,png/jpg/svg..
  var fileName = conData.md5;
  var isGif = /.gif$/i.test(fileName);

  /*是自动精灵动画*/
  if (conData.category === "AutoCompSprite") {
    try {
      resourcePath = getFileFullPath(fileName, 'content-autoCompSprite', isGif);
      var results = getResources(resourcePath + '/app.json');
      var spiritList = results.spiritList[0];
      var actListName = spiritList.params.actList;
      var name = spiritList.params[actListName].ImageList[0].name;
      resourcePath += '/' + name;
      conData.resource = results;
      conData.containerName = wrapObj.containerName;
    } catch (err) {
      console.log('AutoCompSprite获取数据失败');
    }
  } else {

    var fileFullPath = getFileFullPath(fileName, 'content', isGif);

    /*如果启动了预加载，去掉随机后缀*/
    if (config.launch.preload) {
      resourcePath = fileFullPath;
    } else {
      /*如果没有启动preload，需要随机，保证不缓存*/
      resourcePath = isGif ? createRandomImg(fileFullPath) : fileFullPath;
    }
  }

  wrapObj.fileName = fileName;
  wrapObj.isGif = isGif;
  wrapObj.resourcePath = resourcePath;
};

/**
 * content
 *  svg数据
 *  html数据
 * 解析外部文件
 * @param  {[type]} wrapObj     [description]
 * @param  {[type]} svgCallback [description]
 * @return {[type]}             [description]
 */
var externalFile = function externalFile(wrapObj, svgCallback) {
  //svg零件不创建解析具体内容
  if (wrapObj.isSvg) {
    readFileContent(wrapObj.contentData.md5, function (svgdata) {
      wrapObj.svgstr = svgdata;
      svgCallback(wrapObj);
    });
  } else if (wrapObj.isJs) {
    //如果是.js的svg文件
    readFileContent(wrapObj.contentData.md5, function (htmldata) {
      wrapObj.htmlstr = htmldata;
      svgCallback(wrapObj);
    }, "js");
  } else {
    svgCallback(wrapObj);
  }
};

/**
 * 分配缩放比
 * @return {[type]} [description]
 */
var allotRatio = function allotRatio(fixRadio, headerFooterMode) {
  if (fixRadio && headerFooterMode) {
    config.debug.devtools && $warn('content缩放模式fixRadio与headerFooterMode重叠,优先选择headerFooterMode模式');
  }
  //页眉页脚模式
  if (headerFooterMode) {
    return headerFooterMode;
  }
  //设置图片缩放模式1
  if (fixRadio) {
    return 3;
  }
};

//=====================================================
//
//  构建content的序列tokens
//  createImageIds,
//  createContentIds
//  pageType,
//  dydCreate //重要判断,动态创建
//
//=======================================================
function contentStructure(pipeData, $$floatDivertor, callback) {

  var content = void 0,
      contentId = void 0,
      wrapObj = void 0,
      containerObj = void 0,
      sizeResults = void 0,
      contentCollection = void 0,
      contentCount = void 0,
      cloneContentCount = void 0,
      chapterIndex = pipeData.chapterIndex,
      pageType = pipeData.pageType,
      containerRelated = pipeData.containerRelated,
      seasonRelated = pipeData.seasonRelated,
      isMaster = pageType === 'master',

  //文本框
  //2016.1.7
  contentHtmlBoxIds = [],

  //所有content的id记录
  //返回出去给ibooks预编译使用
  idFix = [],

  //文本效果
  //2017.1.3
  //收集对应的content数据
  textFx = [],

  //缓存contentDataset
  contentDataset = {},

  //缓存content结构
  cachedContentStr = [],

  //页眉页脚对象合集
  headerFooterMode = {},

  //自定义样式
  getStyle = pipeData.getStyle;

  /*开始过滤参数*/
  if (containerRelated && containerRelated.length) {
    containerObj = createContainer$2(containerRelated, chapterIndex, getStyle);
  }

  /**
   * 转化canvas模式 contentMode 0/1
   * 页面或者母板浮动对象
   * 页面是最顶级的
   */
  function parseContentParameter(parameter, contentId, conData) {
    _.each(parameter, function (para) {
      /*如果有css3的滤镜效果*/
      if (para.filter && para.filter.length) {
        conData.filterNames = parseJSON(para.filter);
      }
      /*是否启动代码追踪*/
      if (para.trackCode) {
        conData.trackCode = true;
      }
      /*在模式2与3模式下元素可能会溢出,保证不溢出处理*/
      if (para.fixedPosition) {
        conData.fixedPosition = Number(para.fixedPosition);
      }
      //如果有二维码标记
      //2017.3.1
      if (para.qrCode) {
        conData.qrCode = true;
      }
      //有页眉页脚对象
      //2017.1.18
      if (para.HeaderOrFooter) {
        if (headerFooterMode[contentId]) {
          $warn('页眉页脚对象重复设置,contentId:' + contentId);
        }
        headerFooterMode[contentId] = Number(para.HeaderOrFooter);
      }
      //保持图片正比缩放
      //给mini使用
      //2016.12.15
      if (para.fixRadio) {
        conData.fixRadio = true;
      }
      //针对母版content的topmost数据处理，找出浮动的对象Id
      //排除数据topmost为0的处理
      var zIndex = para['topmost'];
      if (zIndex && zIndex != 0) {
        if (isMaster) {
          //收集浮动的母版对象id
          $$floatDivertor.master.ids.push(contentId);
          $$floatDivertor.master.zIndex[contentId] = zIndex;
        } else {
          //浮动页面
          $$floatDivertor.page.ids.push(contentId);
          $$floatDivertor.page.zIndex[contentId] = zIndex;
        }
      }
    });
  }

  /*开始过滤参数*/
  function prefilter(conData, contentId) {
    //如果是模板书签，强制为浮动对象
    var eventId = void 0;
    if (isMaster && (eventId = seasonRelated[contentId])) {
      if (eventId['BookMarks']) {
        $$floatDivertor.master.ids.push(contentId);
      }
    }

    //如果有parameter参数
    //1 浮动对象
    //2 canvas对象
    if (conData) {
      /*匹配canvas对象数据*/
      conData.category && parseCanvas(contentId, conData.category, conData, pipeData);

      /*如果有parameter,保持数据格式，方便解析*/
      var parameter = void 0;
      if (parameter = conData.parameter && parseJSON(conData.parameter)) {
        parseContentParameter(parameter.length ? parameter : [parameter], contentId, conData);
      }
    }
  }

  /**
   * 解析出每一个content对应的动作
   * 传递prefilter过滤器
   * 1 浮动动作
   * 2 canvas动作
   * @type {[type]}
   */
  contentCollection = parseContentData(pipeData.createContentIds, prefilter);
  contentCount = cloneContentCount = contentCollection.length;

  //如果是启动了特殊高精灵动画
  //强制打开canvas模式设置
  //这里可以排除掉其余的canvas动画
  if (pipeData.canvasRelated.onlyCompSprite) {
    pipeData.canvasRelated.enable = true;
  }

  /*创建content节点*/
  function createRelated(contentId, wrapObj) {
    externalFile(wrapObj, function (wrapObj) {
      var uuid = void 0,
          startStr = void 0,
          contentStr = void 0;
      var conData = wrapObj.contentData;

      /*分析图片地址*/
      analysisPath(wrapObj, conData);

      //canvas节点
      if (conData.canvasMode) {
        contentStr = createCanvas(conData, wrapObj);
      } else {
        //dom节点
        contentStr = createDom(conData, wrapObj);
      }
      //如果创建的是容器对象
      if (containerObj && (uuid = containerObj[contentId])) {
        startStr = containerObj[uuid];
        startStr.start.push(contentStr);
      } else {
        //普通对象
        cachedContentStr.unshift(contentStr);
      }
      //检测完毕
      checkComplete();
    });
  }

  /*开始创建*/
  function startCreate(wrapObj, content, contentId) {
    contentDataset[contentId] = content; //缓存数据
    createRelated(contentId, wrapObj);
  }

  /*清理剔除的content*/
  function checkComplete() {
    if (cloneContentCount === 1) {
      var userData = {
        contentDataset: contentDataset,
        idFix: idFix,
        textFx: textFx,
        contentHtmlBoxIds: contentHtmlBoxIds,
        headerFooterMode: headerFooterMode,
        containerPrefix: ''
      };

      //针对容器处理
      if (containerObj) {
        var start, end, containerPrefix, containerStr;
        containerStr = [];

        //合并容器
        containerObj.createUUID.forEach(function (uuid) {
          start = containerObj[uuid].start.join('');
          end = containerObj[uuid].end;
          containerStr.push(start.concat(end));
        });
        containerStr = containerStr.join('');
        containerPrefix = containerObj.containerName;
        containerObj = null;
        userData.contentStr = cachedContentStr.join('').concat(containerStr);
        userData.containerPrefix = containerPrefix;
      } else {
        userData.contentStr = cachedContentStr.join('');
      }
      callback(userData);
    }
    cloneContentCount--;
  }

  //开始生成所有的节点
  //1:dom
  //2:canvas
  while (contentCount--) {
    //根据数据创content结构
    if (content = contentCollection[contentCount]) {
      contentId = content['_id'];
      //创建包装器,处理数据引用关系
      wrapObj = makeWarpObj(contentId, content, pageType, chapterIndex);
      idFix.push(wrapObj.containerName);

      //如果有文本效果标记
      //content.texteffect = " "//数据库写错，多了一个空格
      if (content.texteffect && content.texteffect.trim()) {
        content.texteffectId = wrapObj.containerName;
        textFx.push(content);
      }
      //保存文本框content的Id
      if (wrapObj.isJs) {
        contentHtmlBoxIds.push(contentId);
      }

      /*转换缩放比*/
      var setRatio = function setRatio() {
        var proportion = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getStyle.pageProportion;

        sizeResults = reviseSize({
          results: wrapObj.contentData,
          getStyle: getStyle,
          proportion: proportion,
          zoomMode: allotRatio(content.fixRadio, headerFooterMode[contentId])
        });
      };
      setRatio();

      /*设置页面缩放比*/
      var setPageProportion = function setPageProportion(baseRatio) {
        var pageProportion = {};
        _.each(getStyle.pageProportion, function (prop, key) {
          pageProportion[key] = prop * baseRatio;
        });
        return pageProportion;
      };

      /*溢出模式才计算，保证元素不溢出，继续修正缩放比*/
      if (content.fixedPosition && getStyle.pageVisualMode === 3) {
        var originalTop = sizeResults.scaleTop;
        var originalHeight = sizeResults.scaleHeight;
        var visualLeftInteger = getStyle.visualLeftInteger;
        var layerWidth = sizeResults.scaleWidth + sizeResults.scaleLeft;
        var overflowMode = '';

        //左边溢出
        if (visualLeftInteger > sizeResults.scaleLeft) {
          overflowMode = 'left';
        }

        //右边溢出
        var rightVisual = getStyle.visualWidth - visualLeftInteger;
        if (layerWidth > rightVisual) {
          if (overflowMode === 'left') {
            overflowMode = 'all'; //全溢出
          } else {
            overflowMode = 'right';
          }
        }

        if (overflowMode === 'left') {
          var baseRatio = (sizeResults.scaleWidth - visualLeftInteger) / sizeResults.scaleWidth;
          setRatio(setPageProportion(baseRatio));
          var ratioWidth = (layerWidth - sizeResults.scaleWidth - visualLeftInteger) / 2;
          sizeResults.scaleLeft = visualLeftInteger + ratioWidth;
          sizeResults.scaleTop = originalTop + (originalHeight - sizeResults.scaleHeight) / 2;
        } else if (overflowMode === 'right') {
          var _baseRatio = rightVisual / layerWidth;
          setRatio(setPageProportion(_baseRatio));
          sizeResults.scaleTop = originalTop + (originalHeight - sizeResults.scaleHeight) / 2;
        } else if (overflowMode === 'all') {
          //左右都溢出
          //强制全屏
          var _baseRatio2 = config.screenSize.width / sizeResults.scaleWidth;
          setRatio(setPageProportion(_baseRatio2));
          sizeResults.scaleLeft = visualLeftInteger;
          sizeResults.scaleTop = originalTop + (originalHeight - sizeResults.scaleHeight) / 2;
        }
      }

      //如果是隐藏的页面页脚，重写这个标记
      if (sizeResults.isHide && headerFooterMode[contentId]) {
        headerFooterMode[contentId] = 'hide';
      }

      //正常模式下创建
      startCreate(wrapObj, content, contentId);
    } else {
      //或者数据出错
      checkComplete();
    }
  }
}

/****************************************************
 *           构建TaskContents对象
 *      依赖数据解析算法类 Algorithm
 *      结构合并创建类    Structure
 *      行为动画绑定类     Content
 * ***************************************************/
/**
 * 构建快速查询节点对象
 * 转成哈希方式
 * @return {[type]} [description]
 */
function toObject(cachedContentStr) {
  var tempFragmentHash = {};
  _.each($(cachedContentStr), function (ele, index) {
    tempFragmentHash[ele.id] = ele;
  });
  return tempFragmentHash;
}

/**
 * 转成数组格式
 * 分组
 *     主体部分内容
 *     页眉页脚内容
 */
function toArray$1(contentsFragment, headerFooterMode) {
  var bodyContent = [];
  var headerFooterContent = [];
  _.each(contentsFragment, function ($node, key) {
    var id = key.split('_').pop();
    var state = void 0;
    if (headerFooterMode && (state = headerFooterMode[id])) {
      if (state !== 'hide') {
        //隐藏抛弃的元素，不需要显示了
        headerFooterContent.push($node);
      }
    } else {
      bodyContent.push($node);
    }
  });
  return {
    bodyContent: bodyContent,
    headerFooterContent: headerFooterContent
  };
}

/**
 * content任务类
 */

var TaskActivitys = function (_TaskSuper) {
  inherits(TaskActivitys, _TaskSuper);

  /*管道参数，贯通*/
  function TaskActivitys(pipeData, success, detector) {
    classCallCheck(this, TaskActivitys);

    var _this = possibleConstructorReturn(this, (TaskActivitys.__proto__ || Object.getPrototypeOf(TaskActivitys)).call(this, detector));

    _.extend(_this, pipeData);
    _this.success = success;

    /*chapter => activity*/
    var activitys = activityParser(pipeData);
    if (activitys) {
      pipeData = contentParser(activitys, pipeData);
      pipeData.createContentIds.length ? _this._dataAfterCheck(pipeData) : _this._loadComplete();
    } else {
      _this._loadComplete();
    }
    return _this;
  }

  /**
   * 检测下个任务创建
   */


  createClass(TaskActivitys, [{
    key: '_checkNextTask',
    value: function _checkNextTask(taskName, nextTask) {
      //如果是当前页面构建,允许打断一次
      var interrupt = void 0;
      if (this.base.hasAutoRun && taskName === 'strAfter') {
        interrupt = true;
      }
      this._$$checkNextTask('内部contents', function () {
        nextTask();
      }, interrupt);
    }

    /**
     * 中断一:构建数据之后
     * 构建结构
     */

  }, {
    key: '_dataAfterCheck',
    value: function _dataAfterCheck(pipeData) {
      var _this2 = this;

      this._checkNextTask('dataAfter', function () {

        /*解析点击反馈，点击缩放*/
        parseBehavior(pipeData);

        /*构建页面content类型结构*/
        contentStructure(pipeData, _this2.$$floatDivertor, function (userData) {
          pipeData.contentHtmlBoxIds = userData.contentHtmlBoxIds;
          pipeData.contentsFragment = {};
          //iboosk节点预编译
          //在执行的时候节点已经存在
          //不需要在创建
          if (Xut.IBooks.runMode()) {
            _.each(userData.idFix, function (id) {
              pipeData.contentsFragment[id] = pipeData.$containsNode.find("#" + id)[0];
            });
          } else {
            //构件快速查询节点对象
            pipeData.contentsFragment = toObject(userData.contentStr);
            delete userData.contentStr;
          }
          //容器的前缀
          pipeData.containerPrefix = userData.containerPrefix;
          /* eslint-disable */
          //2015.5.6暴露到全局
          //提供给音频字幕上下文
          if (!Xut.Contents.contentsFragment[pipeData.chapterId]) {
            Xut.Contents.contentsFragment[pipeData.chapterId];
          }
          Xut.Contents.contentsFragment[pipeData.chapterId] = pipeData.contentsFragment;
          /* elist-enable */
          _this2._dataStrCheck(pipeData, userData);
        });
      });
    }

    /**
     * 中断二:构建结构之后
     * 绑定事件
     */

  }, {
    key: '_dataStrCheck',
    value: function _dataStrCheck(pipeData, userData) {
      var _this3 = this;

      this._checkNextTask('strAfter', function () {
        /*缩放图片*/
        if (Object.keys(pipeData.zoomBehavior).length) {
          _this3.zoomObjs = zoomPicture(pipeData);
          _this3.zoomBehavior = pipeData.zoomBehavior;
        }
        //文本特效
        if (userData.textFx.length) {
          _this3.textFxObjs = textFx(pipeData, userData.textFx);
        }
        //保留场景的留信息
        //用做软件制作单页预加载
        sceneController.seasonRelated = pipeData.seasonRelated;
        //初始化content对象
        compileActivity(function (delayHooks) {
          _this3._eventAfterCheck(pipeData, delayHooks, userData.headerFooterMode);
        }, pipeData, userData.contentDataset, _this3.$$floatDivertor);
      });
    }

    /**
     * 中断三:绑定事件事件之后
     * @param  {[type]} iScrollHooks [description]
     * @return {[type]}              [description]
     */

  }, {
    key: '_eventAfterCheck',
    value: function _eventAfterCheck(pipeData, delayHooks, headerFooterMode) {
      var _this4 = this;

      this._checkNextTask('eventAfter', function () {

        /*
        计算回调的成功的次数
        1 正常节点创建
        2 浮动节点创建
        3 页眉页脚创建
         */
        pipeData.taskCount = 1;

        /**
         * 完成钩子函数
         * 1 content的卷滚条
         * 2 canvas事件绑定
         */
        var hookfns = function hookfns() {
          var iscrollHooks = delayHooks.iscrollHooks;
          var hook = void 0;
          if (iscrollHooks.length) {
            while (hook = iscrollHooks.shift()) {
              hook();
            }
          }
        };

        /**
         * 1 页面浮动
         * 2 母版浮动
         * 3 正常对象
         * 4 页眉页脚
         */
        var complete = function () {
          return function () {
            if (pipeData.taskCount === 1) {
              delayHooks && hookfns();
              _this4._applyAfterCheck();
              return;
            }
            --pipeData.taskCount;
          };
        }();

        /*创建浮动层*/
        _this4._$$createFloatLayer(complete, pipeData, _this4.base.floatGroup);

        /*iboosk节点预编译,在执行的时候节点已经存在,不需要在创建*/
        if (Xut.IBooks.runMode()) {
          complete();
        } else {
          var fragment = toArray$1(pipeData.contentsFragment, headerFooterMode);
          var bodyContent = fragment.bodyContent;
          var headerFooterContent = fragment.headerFooterContent;
          var watchCount = 0;

          /*页面页脚需要叠加计算*/
          headerFooterContent.length && ++watchCount;
          bodyContent.length && ++watchCount;

          /*没有渲染数据*/
          if (!watchCount) {
            complete();
            return;
          }

          var watchNextTick = function () {
            return function () {
              if (watchCount === 1) {
                complete();
                return;
              }
              --watchCount;
            };
          }();

          /*页眉页脚*/
          if (headerFooterContent.length) {
            nextTick({
              'container': pipeData.$headFootNode,
              'content': fragment.headerFooterContent
            }, watchNextTick);
          }

          /*主体内容*/
          if (bodyContent.length) {
            nextTick({
              'container': pipeData.$containsNode,
              'content': fragment.bodyContent
            }, watchNextTick);
          }
        }
      });
    }

    /**
     * 中断四：渲染content
     * @return {[type]} [description]
     */

  }, {
    key: '_applyAfterCheck',
    value: function _applyAfterCheck() {
      var _this5 = this;

      this._checkNextTask('applyAfter', function () {
        _this5._loadComplete(true);
      });
    }

    /**
     * 构建完毕
     * @return {[type]} [description]
     */

  }, {
    key: '_loadComplete',
    value: function _loadComplete() {
      this.success && this.success();
    }

    //============================
    //      super方法
    //============================

    /**
     * 清理引用
     * @return {[type]} [description]
     */

  }, {
    key: '_destroy',
    value: function _destroy() {

      //文字动画
      if (this.textFxObjs) {
        _.each(this.textFxObjs, function (obj) {
          obj.destroy();
        });
        this.textFxObjs = null;
      }

      //删除字幕用的碎片文档
      if (Xut.Contents.contentsFragment[this.chapterId]) {
        delete Xut.Contents.contentsFragment[this.chapterId];
      }

      //清理放大图片功能
      if (this.zoomBehavior && Object.keys(this.zoomBehavior).length) {
        //清理缩放绑定事件
        _.each(this.zoomBehavior, function (zoomBehavior) {
          if (zoomBehavior.off) {
            zoomBehavior.off();
          }
        });
        this.zoomBehavior = null;

        //清理缩放对象
        _.each(this.zoomObjs, function (zoom) {
          zoom.destroy();
        });
        this.zoomObjs = null;
      }

      this.canvasRelated = null;
      this.pageBaseHooks = null;
      this.$containsNode = null;
      this.rootNode = null;
      this.contentsFragment = null;
    }
  }]);
  return TaskActivitys;
}(TaskSuper);

/**
 * 获取访问对象参数
 * 如果pageBase 不存在，则取当前页面的
 * @return {[type]} [description]
 */
function access$1(pageBase, callback) {

  //如果只提供回调函数
  if (arguments.length === 1 && _.isFunction(pageBase)) {
    callback = pageBase;
    pageBase = Xut.Presentation.GetPageBase && Xut.Presentation.GetPageBase();
  } else {
    pageBase = pageBase || Xut.Presentation.GetPageBase && Xut.Presentation.GetPageBase();
  }

  if (pageBase) {
    var contents = pageBase.baseGetContent();
    var components = pageBase.baseGetComponent();
    var pageType = pageBase.pageType || 'page';
    var flag = callback(pageBase, contents.length && contents, components.length && components, pageType);
    return flag;
  }
}

/**
 * by 2016.6.30
 * judgment is backstage run
 * Take the opposite judgment
 * @return {[type]} [description]
 */
var allowNext = function allowNext() {
  if (window.MMXCONFIG) {
    return function () {
      return !(window.MMXCONFIG.back || Xut.Application.IsBackStage());
    };
  } else {
    return function () {
      return !false;
    };
  }
};

var allowNext$1 = allowNext();

/*
提供给auto运行动作的延时触发处理
需要注意快速翻页要立马清理，因为定时器在延后触发
 */

var queue$1 = [];
var timer$1 = null;

/*
重设状态
 */
function resetBatcherState() {
  queue$1.length = 0;
  if (timer$1) {
    clearTimeout(timer$1);
    timer$1 = null;
  }
}

/*
  运行队列
 */
function runBatcherQueue$1(queue) {
  for (var i = 0; i < queue.length; i++) {
    var watcher = queue[i];
    if (watcher) {
      watcher();
    }
  }
  queue.length = 0;
}

/*
加入监控
 */
function pushWatcher(type, watcher) {
  queue$1.push(watcher); //加入队列
  if (!timer$1) {
    //只第一次调用开始执行
    timer$1 = setTimeout(function () {
      runBatcherQueue$1(queue$1);
      resetBatcherState();
    }, 500);
  }
}

/*
清理
 */
function clearWatcher() {
  resetBatcherState();
}

/**
 * 自动触发控制
 * @return {[type]} [description]
 */

var noop$1 = function noop() {};

/**
 * 运行自动的content对象
 * 延时500毫秒执行
 * @return {[type]} [description]
 */
var autoContents = function autoContents(contentObjs, taskAnimCallback) {
  var markComplete = function () {
    var completeStatistics = contentObjs.length; //动画完成统计
    return function () {
      if (completeStatistics === 1) {
        taskAnimCallback && taskAnimCallback();
        markComplete = null;
      }
      completeStatistics--;
    };
  }();

  _.each(contentObjs, function (obj, index) {
    if (!Xut.CreateFilter.has(obj.pageId, obj.id)) {
      //同一个对象类型
      //直接调用对象接口
      obj.autoPlay(markComplete);
    } else {
      markComplete();
    }
  });
};

/**
 * 运行自动的静态类型
 * @return {[type]} [description]
 */
var autoComponents = function autoComponents(pageBase, pageIndex, autoData, pageType) {

  if (pageIndex === undefined) {
    pageIndex = Xut.Presentation.GetPageIndex();
  }

  var chapterId = pageBase.baseGetPageId(pageIndex);
  var directive = void 0;

  _.each(autoData, function (data, index) {
    directive = directives[data.actType];
    //零件类型的接口调用不一致
    //这里需要转接口处理
    if (directive && directive.autoPlay) {
      directive.autoPlay({
        'id': data.id,
        'pageType': pageType,
        'rootNode': pageBase.getContainsNode(),
        'chapterId': chapterId,
        'category': data.category,
        'autoPlay': data.autoPlay,
        'pageIndex': pageIndex
      });
    }
  });
};

/*翻页停止，
翻页速度大于定会器的延时，
那么这个任务就会被重复叠加触发，
所以每次翻页必须停止*/
function $stopAutoWatch() {
  clearWatcher();
}

/**
 * 自动动作
 */
function $autoRun(pageBase, pageIndex, taskAnimCallback) {

  /**
   * 编译IBOOKSCONFIG的时候过滤自动运行的调用
   * @return {[type]}              [description]
   */
  if (Xut.IBooks.compileMode()) {
    return;
  }

  //When the home button by invoking
  //Does not perform automatic animation
  //fix 2016.6.29
  // originalApp
  // window.miaomiaoxue.back = 1;
  // activateApp
  // window.miaomiaoxue.back = 0;
  if (!allowNext$1()) {
    taskAnimCallback();
    return;
  }

  //pageType
  //用于区别触发类型
  //页面还是母版
  access$1(pageBase, function (pageBase, contentObjs, componentObjs, pageType) {

    //如果是母版对象，一次生命周期种只激活一次
    if (pageBase.pageType === 'master') {
      if (pageBase.onceMaster) {
        return;
      }
      pageBase.onceMaster = true;
    }

    taskAnimCallback = taskAnimCallback || noop$1;

    /*自动组件*/
    var autoData = pageBase.baseAutoRun();
    if (autoData) {
      pushWatcher('component', function () {
        autoComponents(pageBase, pageIndex, autoData, pageType);
      });
    }

    /*自动content*/
    if (contentObjs) {
      pushWatcher('content', function () {
        autoContents(contentObjs, taskAnimCallback);
      });
    } else {
      taskAnimCallback(); //无动画
    }
  });
}

/**
 * 全局事件
 * 手动触发控制
 */
function $trigger(_ref, columnData) {
  var target = _ref.target,
      attribute = _ref.attribute,
      rootNode = _ref.rootNode,
      pageIndex = _ref.pageIndex;

  var id = void 0,
      type = void 0;
  var key = target.id;
  if (columnData) {
    type = columnData.type;
    id = columnData.id;
  } else if (key) {
    var tag = key.split('_');
    type = tag[0];
    id = tag[1];
  }

  if (type && id) {
    var directive = directives[type];
    if (directive && directive.trigger) {

      /*获取页面类型,page或master*/
      var pageType = rootNode && rootNode.id ? /page/.test(rootNode.id) ? 'page' : 'master' : 'page';

      var data = { id: id, key: key, type: type, rootNode: rootNode, target: target, pageIndex: pageIndex, pageType: pageType, "activityId": id, columnData: columnData };

      /*如果有代码跟踪*/
      config.sendTrackCode('hot', {
        id: id,
        type: type,
        pageId: Xut.Presentation.GetPageId(pageType, pageIndex),
        eventName: 'tap'
      });

      /*如果是重复点击,比如widget零件*/
      var instance = Xut.Application.GetExistObject(pageType, data);
      if (instance) {
        if (instance.toggle) {
          //如果有对应的处理方法
          return instance.toggle();
        }
      }

      //委派新的任务
      directive.trigger(data);
    }
  }
}

/**
 * 暂停控制
 * @return {[type]} [description]
 */
/**
 * 翻页停止content动作
 * 翻页时,暂停滑动页面的所有热点动作
 *
 * 如果传递了allHandle 停止所有的视频
 * allHandle 给接口Xut.Application.Original() 使用
 *
 * 页面与模板翻页都会调用暂停接口
 */
function $suspend(pageBase, pageId, allHandle) {

  //零件对象翻页就直接销毁了
  //无需暂时
  //这里只处理音频 + content类型
  access$1(pageBase, function (pageBase, contentObjs) {

    /*停止预加载*/
    // stopPreload()

    /*这个必须要，翻页停止AUTO的自动延时延时器，否则任务会乱套,e.g. 跨页面音频*/
    $stopAutoWatch();

    //多媒体处理
    if (pageId !== undefined) {
      //离开页面销毁视频
      removeVideo(pageId);
      //翻页停止母板音频
      if (pageBase.pageType === 'master') {
        hangUpAudio();
      }
    }

    //content类型
    contentObjs && _.each(contentObjs, function (obj) {
      obj.stop && obj.stop();
    });

    //如果是外部调用接口
    //Xut.Application.Original
    //销毁视频
    //销毁所有的音频
    if (allHandle) {
      clearVideo();
      clearAudio$1();
    }
  });
}

/**
 * 复位到初始化的状态
 * @return {[type]} [description]
 */

/**
 * 优化检测
 * @param  {Function} fn [description]
 * @return {[type]}      [description]
 */
var hasOptimize = function hasOptimize(fn) {
  if (!config.launch.visualMode !== 4) {
    fn && fn();
  }
};

/**
 * 翻一页处理： 翻页完毕触发
 * 大量操作DOM结构，所以先隐藏根节点
 * 1 删除所有widget节点
 * 2 复位所有content节点
 * @param  {[type]} pageBase [description]
 * @return {[type]}         [description]
 */
function $original(pageBase) {

  access$1(pageBase, function (pageBase, contentObjs, componentObjs) {

    //母版对象不还原
    if (pageBase.pageType === 'master') return;

    var $containsNode;

    if ($containsNode = pageBase.getContainsNode()) {

      //隐藏根节点
      //display:none下刷新
      hasOptimize(function () {
        $containsNode.hide();
      });

      //content类型复位
      contentObjs && _.each(contentObjs, function (obj) {
        if (!Xut.CreateFilter.has(obj.pageId, obj.id)) {
          obj.reset && obj.reset();
        }
      });

      //销毁所有widget类型的节点
      if (componentObjs) {
        _.each(componentObjs, function (obj) {
          obj && obj.destroy();
        });
        //销毁widget对象管理
        pageBase.baseRemoveComponent();
      }

      hasOptimize(function () {
        setTimeout(function () {
          $containsNode.show();
          $containsNode = null;
        }, 0);
      });
    }
  });
}

/**
 * 停止动作
 * 给全局stop接口使用
 * 与suspend的区别就是，这个全除了suspend的处理，还包括零件的暂停
 * @return {[type]} [description]
 */
/**
 * 停止所有热点动作,并返回状态
 * 1 content
 * 2 widget
 * 动画,视频,音频...........................
 * 增加场景模式判断
 *
 *  skipAudio 是否跳过音频，不处理
 *    true 跳过
 *    false 不跳过
 */

/**
 * 复位状态/状态控制
 * 如果返回false证明有热点
 * 第一次只能关闭热点不能退出页面
 * @param  {[type]} pageObj [description]
 * @return {[type]}         [description]
 */
function $stop() {

  //清理音频
  clearAudio$1();

  //清理视频
  clearVideo();

  //停止热点
  return access$1(function (pageBase, contentObjs, componentObjs) {

    //如果返回值是false,则是算热点处理行为
    var falg = false;

    //content类型
    contentObjs && _.each(contentObjs, function (obj) {
      if (obj.stop && obj.stop()) {
        falg = true;
      }
    });

    //零件类型
    componentObjs && _.each(componentObjs, function (obj) {
      if (obj.stop && obj.stop()) {
        falg = true;
      }
    });

    return falg;
  });
}

/**
 * 扩展子文档
 * @return {[type]} [description]
 */

/**
 *
 *  动作对象
 *      1 跳转页面
 *      2 打开系统程序
 *      3 加载子文档
 *
 */

/**
 * 跳转页面
 * @param  {[type]} para1 [description]
 * @return {[type]}       [description]
 */
var toPage = function toPage(para1) {
  para1 = JSON.parse(para1);
  if (para1.seasonId) {
    Xut.View.GotoSlide(para1.seasonId, para1.chapterId);
  } else {
    //向下兼容
    Xut.View.GotoSlide(para1);
  }
};

function Action$2(data) {
  var id = parseInt(data.id);
  var results = Xut.data.query('Action', id, 'activityId');
  var para1 = results.para1; //跳转参数
  var actionType = parseInt(results.actionType);
  if (actionType == 0) {
    toPage(para1);
  }
}

/**
 * 动作热点
 * 1. 跳转页面
 * 2. 打开系统应用程序
 */
var Action$1 = {
  createDom: function createDom(_ref, chpaterData, chapterId, pageIndex, zIndex, pageType) {
    var _id = _ref._id,
        md5 = _ref.md5,
        actType = _ref.actType,
        scaleWidth = _ref.scaleWidth,
        scaleHeight = _ref.scaleHeight,
        scaleTop = _ref.scaleTop,
        scaleLeft = _ref.scaleLeft;

    return String.styleFormat('<div id="' + (actType + "_" + _id) + '"\n            data-belong="' + pageType + '"\n            data-delegate="action"\n            style="cursor:pointer;\n                   width:' + scaleWidth + 'px;\n                   height:' + scaleHeight + 'px;\n                   left:' + scaleLeft + 'px;\n                   top:' + scaleTop + 'px;\n                   background-size:100% 100%;\n                   position:absolute;\n                   z-index:' + zIndex + ';\n            ' + (md5 ? "background-image: url(" + getFileFullPath(md5, 'hot-action') + ");" : '') + '">\n      </div>');
  }

  /*
   * touchEnd 全局派发的点击事件
   * 如果stopGlobalEvent == ture 事件由全局派发
   */

  ,
  trigger: function trigger(data) {
    Action$2(data);
  }
};

//临时音频动作数据
var tempData = {};

//音频按钮尺寸
var mediaIconSize = 74;

/**
 * 仅创建一次
 * data传递参数问题
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
var onlyCreateOnce = function onlyCreateOnce(id) {
  var data = tempData[id];
  if (data) {
    delete tempData[id];
    return data;
  }
};

var Media = {
  createDom: function createDom(_ref, chpaterData, chapterId, pageIndex, zIndex, pageType) {
    var _id = _ref._id,
        md5 = _ref.md5,
        actType = _ref.actType,
        category = _ref.category,
        itemArray = _ref.itemArray,
        scaleWidth = _ref.scaleWidth,
        scaleHeight = _ref.scaleHeight,
        scaleTop = _ref.scaleTop,
        scaleLeft = _ref.scaleLeft;


    //如果没有宽高则不创建绑定节点
    if (!scaleWidth || !scaleHeight) return '';

    var display = void 0;
    var startImage = void 0;
    var startScript = void 0;
    var stopImage = void 0;
    var stopScript = void 0;
    var mediaIcon = '';

    //解析音乐动作
    if (itemArray) {

      itemArray = parseJSON(itemArray);

      /**
       * 老模式
       *      "itemArray": "[\r\n  {\r\n    \"startImg\": \"027c3803a38237ad567484bbe42385df.png\"\r\n  },\r\n  {\r\n    \"stopImg\": \"676183f05ef671b9ba3609ec762f9e5e.png\"\r\n  }"
       *
       *  */
      if (itemArray.length) {
        var start = itemArray[0];
        var stop = itemArray[1];
        /*音频Action参数*/
        if (start) {
          startImage = start.startImg ? start.startImg : '';
          startScript = start.script ? start.script : '';
        }
        if (stop) {
          stopImage = start.stopImg ? start.stopImg : '';
          stopScript = stop.script ? start.script : '';
        }
      } else {
        /*
        新模式
         itemArray:{
           startImage:'027c3803a38237ad567484bbe42385df.png',
           stopImage:'676183f05ef671b9ba3609ec762f9e5e.png',
           startScript:'',
           stopScript:'',
           zIndex:12,
           display:'hidden'
         }
        */
        zIndex = itemArray.zIndex;
        display = itemArray.display;
        startImage = itemArray.startImage;
        startScript = itemArray.startScript;
        stopImage = itemArray.stopImage;
        stopScript = itemArray.stopScript;
      }

      /*音频Action动作数据*/
      tempData[_id] = {};
      if (startImage) {
        tempData[_id]['startImage'] = startImage;
        startImage = 'background-image:url(' + getFileFullPath(startImage, 'hot-media') + ');';
      }
      if (startScript) {
        tempData[_id]['startScript'] = startScript;
      }
      if (stopImage) {
        tempData[_id]['stopImage'] = stopImage;
        stopImage = 'background-image:url(' + getFileFullPath(stopImage, 'hot-media') + ');';
      }
      if (stopScript) {
        tempData[_id]['stopScript'] = stopScript;
      }
    }

    //只针对网页插件增加单独的点击界面
    //如果有视频图标
    if (category == 'webpage' && scaleWidth > 200 && scaleHeight > 100 && scaleWidth <= config.visualSize.width && scaleHeight <= config.visualSize.height) {
      mediaIcon = '<div id="icon_' + _id + '"\n              type="icon"\n              style="width:' + mediaIconSize + 'px;\n                     height:' + mediaIconSize + 'px;\n                     top:' + (scaleHeight - mediaIconSize) / 2 + 'px;\n                     left:' + (scaleWidth - mediaIconSize) / 2 + 'px;\n                     position:absolute;background-image:url(images/icons/web_hotspot.png)">\n         </div>';
    }

    //首字母大写
    var mediaType = titleCase(category);

    /*默认状态*/
    var imageBackground = startImage || '';

    /*
    音频在创建dom的时候需要查下
    这个hot对象是否已经被创建过
    如果创建过，那么图标状态需要处理
    */
    if (hasHotAudioPlay(chapterId, _id)) {
      imageBackground = stopImage;
    }

    /*
    查找视频音频是否被浮动到页面,这个很特殊的处理
    需要把节点合并到content种一起处理浮动对象
     */
    var hasFloat = false;
    var mediaData = getMediaData(mediaType, _id);
    if (mediaData && mediaData.isfloat) {
      hasFloat = true;
    }

    /*是否隐藏,如果隐藏通过脚本调用*/
    var visibility = display === 'hidden' ? "visibility:hidden;" : '';

    //创建音频对象
    //Webpage_1
    //Audio_1
    //Video_1
    var html = String.styleFormat('<div id="' + (mediaType + "_" + _id) + '"\n            data-belong="' + pageType + '"\n            data-delegate="' + category + '"\n            style="width:' + scaleWidth + 'px;\n                   height:' + scaleHeight + 'px;\n                   left:' + scaleLeft + 'px;\n                   top:' + scaleTop + 'px;\n                   z-index:' + zIndex + ';\n                   ' + visibility + '\n                   ' + imageBackground + '\n                   background-size:100% 100%;\n                   position:absolute;">\n            ' + mediaIcon + '\n       </div>');

    return {
      html: html,
      hasFloat: hasFloat
    };
  }

  /**
   * 自动运行
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */

  ,
  autoPlay: function autoPlay(_ref2) {
    var id = _ref2.id,
        pageType = _ref2.pageType,
        category = _ref2.category,
        rootNode = _ref2.rootNode,
        pageIndex = _ref2.pageIndex,
        chapterId = _ref2.chapterId;

    if (!category) return;
    if (category == 'audio') {
      autoAudio(chapterId, id, onlyCreateOnce(id));
    } else {
      /*通过id搜索*/
      rootNode = rootNode.closest('#' + Xut.View.GetPageNodeIdName(pageType, pageIndex, chapterId));
      if (!rootNode.length) {
        /*自动ppt视频，是采用的li父节点，所以这里需要处理下*/
        rootNode = rootNode.closest('li');
      }
      autoVideo({
        pageType: pageType,
        rootNode: rootNode,
        chapterId: chapterId,
        pageIndex: pageIndex,
        'activityId': id
      });
    }
  }

  /**
   * touchEnd 全局派发的点击事件
   * 如果stopGlobalEvent == ture 事件由全局派发
   * isColumn 流式排版触发的媒体
   */

  ,
  trigger: function trigger(_ref3) {
    var id = _ref3.id,
        target = _ref3.target,
        rootNode = _ref3.rootNode,
        pageIndex = _ref3.pageIndex,
        activityId = _ref3.activityId,
        _ref3$columnData = _ref3.columnData,
        columnData = _ref3$columnData === undefined ? {} : _ref3$columnData;


    /*************
      流式布局处理
    **************/
    if (columnData.isColumn) {
      if (columnData.type === 'Audio') {
        triggerAudio({
          activityId: activityId,
          columnData: columnData,
          chapterId: columnData.chapterId,
          data: onlyCreateOnce(id)
        });
      } else {
        triggerVideo({
          chapterId: columnData.chapterId,
          columnData: columnData,
          activityId: activityId,
          rootNode: rootNode,
          pageIndex: pageIndex
        });
      }
      return;
    }

    /*************
      PPT页面处理
    **************/
    var category = target.getAttribute('data-delegate');
    if (category) {
      /*音频点击可以是浮动母版了，所以这里必须要明确查找chapter属于的类型页面*/
      var pageType = target.getAttribute('data-belong');
      var chapterId = Xut.Presentation.GetPageId(pageType, pageIndex);
      if (category == 'audio') {
        triggerAudio({
          chapterId: chapterId,
          activityId: activityId,
          data: onlyCreateOnce(id)
        });
      } else {
        triggerVideo({
          chapterId: chapterId,
          activityId: activityId,
          rootNode: rootNode,
          pageIndex: pageIndex,
          pageType: pageType
        });
      }
    }
  }

  /*销毁数据*/

  ,
  destory: function destory() {}
};

/**
 * 路径地址
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
function path$2(fileName, widgetId) {
  return config.getWidgetPath() + widgetId + '/' + fileName;
}

/**
 * 去重加载处理
 */
var toRepeat$1 = {};

var add = function add(path, callback) {
  //去重复处理
  //可能同时执行了多个同样的js文件加载
  if (!toRepeat$1[path]) {
    toRepeat$1[path] = [];
  }
  toRepeat$1[path].push(callback);
  if (toRepeat$1[path].length > 1) {
    return;
  }
  loadFile(path, function () {
    _.each(toRepeat$1[path], function (fn) {
      fn && fn();
    });
    toRepeat$1[path] = null;
    delete toRepeat$1[path];
  });
};

function removeFileLoad() {
  toRepeat$1 = {};
}

/**
 * 加载js,css文件
 * @return {[type]} [description]
 */
function fileLoad(callback, base) {
  var jsPath,
      cssPath,
      completeCount,
      widgetId = base.widgetId,

  //定义css,js的命名
  jsName = base.widgetName + '.min.js',
      cssName = base.widgetType == 'page' || base.widgetType == 'js' ? 'style.min.css' : 0;

  //需要等待完成
  var completeCount = function () {
    var count = 0;
    jsName && count++;
    cssName && count++;
    return function () {
      if (count === 1) {
        return callback && callback.call(base);
      }
      count--;
    };
  }();

  //加载css
  if (cssName) {
    cssPath = path$2(cssName, widgetId);
    add(cssPath, completeCount);
  }

  //加载js
  if (jsName) {
    jsPath = path$2(jsName, widgetId);
    add(jsPath, completeCount);
  }
}

/**
 * 创建数据
 * @return {[type]} [description]
 */
function createData(outputPara, scrollPaintingMode, calculate) {
  var item,
      field,
      source = [],
      images = Xut.data['Image'],
      token = null,
      items = outputPara.source;

  for (item in items) {
    if (items.hasOwnProperty(item)) {
      field = {};
      token = images.item((parseInt(items[item]) || 1) - 1);
      field['img'] = token.md5;
      field['thumb'] = '';
      field['title'] = token.imageTitle;
      source.push(field);
    }
  }

  outputPara.source = source;
  outputPara.scrollPaintingMode = scrollPaintingMode;
  outputPara.calculate = calculate;

  /**
   * 2016.8.3
   * 给妙妙学的js零件增加前缀
   * @type {[type]}
   */
  outputPara.rootPath = Xut.config.getWidgetPath();

  return outputPara;
}

/**
 * 眷顾区域扩展
 * @type {Boolean}
 */

var ScrollArea = function () {
  function ScrollArea(data, options) {
    classCallCheck(this, ScrollArea);

    this.data = data;
    this.options = options;
    this.scrolls = [];
    this._init();
  }

  createClass(ScrollArea, [{
    key: '_init',
    value: function _init() {
      var content = this.options;
      var prefix = this.data.contentPrefix;
      //创建多个眷滚区域
      for (var i = 0; i < content.length; i++) {
        var obj = this._create(content[i], prefix);
        if (obj) {
          this.scrolls.push(obj);
        }
      }
    }
  }, {
    key: '_createWrapper',
    value: function _createWrapper() {
      return String.styleFormat('<div data-type="area-wrapper"\n                  style="position:absolute;width:100%; height:100%;overflow:hidden;">\n                <ul data-type="area-scroller"\n                     data-behavior="disable"\n                     style="position:absolute; width:100%; height:100%;overflow:hidden;">\n                </ul>\n             </div>');
    }
  }, {
    key: '_create',
    value: function _create(content, prefix) {

      var contentId = content.id;
      var contentName = prefix + contentId;

      var theTitle = parseJSON(content.theTitle);

      //data-widgetscrollareaList
      //data-widgetscrollareascrolltype
      var obj = theTitle["data-widgetscrollareaList"].split(",");
      if (obj.length == 0) {
        return;
      }

      var contentPanle = $("#" + contentName);
      if (contentPanle.length == 0) {
        console.log(contentId + "not find obj");
        return;
      }

      var scrolltype = theTitle["data-widgetscrollareascrolltype"] ? theTitle["data-widgetscrollareascrolltype"] : "xy";

      //滚动的方向
      //x / y /xy
      scrolltype = scrolltype.toLowerCase();
      var scrollX = scrolltype.indexOf("x") > -1;
      var scrollY = scrolltype.indexOf("y") > -1;

      var $wrapper = void 0;

      //如果来回翻页
      //因为子节点的排列关系已经被改变
      //所以这里直接处理事件
      var hasIscroll = contentPanle.attr("data-iscroll");
      if (hasIscroll) {
        //需要滚动条
        if (hasIscroll === 'visible') {
          $wrapper = contentPanle.children('div[data-type="area-wrapper"]');
          return this._bindIscroll($wrapper[0], scrollX, scrollY, contentId);
        }
        //hidden
        return;
      }

      //去掉默认行为
      Xut.Contents.ResetDefaultControl("page", contentName, "");

      var contentSize = {
        x: parseInt(contentPanle.css("left")),
        y: parseInt(contentPanle.css("top")),
        w: parseInt(contentPanle.css("width")),
        h: parseInt(contentPanle.css("height"))
      };

      var size = this._getSize(obj, prefix);
      var min = size.min;
      var max = size.max;

      //创建容器
      $wrapper = $(this._createWrapper());

      //滚动容器
      var $scroller = $wrapper.children();
      contentPanle.append($wrapper);

      //设置滚动容器宽高
      this._setScrollerStyle(max, min, contentSize, scrollX, scrollY, $scroller);

      //重置各个content的left top值 并得到
      //x轴方向卷滚：snap容器的宽度 个数以及每个snap容器包含的content个数
      //y轴方向卷滚：snap容器的高度 个数以及每个snap容器包含的content个数
      var colsObj = this._resetContents(obj, prefix, contentSize, scrollX, scrollY, min);

      //创建snap容器
      var snapContainer = this._createSnapContainer(colsObj, $scroller, contentId, scrollX, scrollY);

      //将content添加到snap容器中
      if (scrollX) {
        for (var j = 0; j < obj.length; j++) {
          var childId = prefix + obj[j];
          var childObj = $("#" + childId);
          childObj.appendTo(snapContainer[Math.floor(j / colsObj.contentsPerSnapX)]);
        }
      }
      if (scrollY) {
        for (var j = 0; j < obj.length; j++) {
          var childId = prefix + obj[j];
          var childObj = $("#" + childId);
          childObj.appendTo(snapContainer[Math.floor(j / colsObj.contentsPerSnapY)]);
        }
      }

      //如果不满足溢出条件
      var $areaScroller = snapContainer.parent();
      if (scrollX) {
        var snapContainerWidth = parseInt($areaScroller.css('width'));
        if (snapContainerWidth < contentSize.w) {
          scrollX = false;
        }
      }
      if (scrollY) {
        var snapContainerHeight = parseInt($areaScroller.css('height'));
        if (snapContainerHeight < contentSize.h) {
          scrollY = false;
        }
      }

      if (scrollY || scrollX) {
        contentPanle.attr("data-iscroll", "visible");
        //只存在一屏 需要卷滚时 不要要snap
        if (snapContainer.length == 1) {
          return this._bindIscroll($wrapper[0], scrollX, scrollY);
        }
        return this._bindIscroll($wrapper[0], scrollX, scrollY, contentId);
      } else {
        contentPanle.attr("data-iscroll", "hidden");
      }
    }
  }, {
    key: '_bindIscroll',
    value: function _bindIscroll(wrapper, hasScrollX, hasScrollY, contentId) {
      if (contentId) {
        return IScroll(wrapper, {
          scrollX: hasScrollX ? true : false,
          scrollY: hasScrollY ? true : false,
          snap: ".contentsContainer" + contentId,
          scrollbars: 'custom'
        });
      } else {
        return IScroll(wrapper, {
          scrollX: hasScrollX ? true : false,
          scrollY: hasScrollY ? true : false,
          scrollbars: 'custom'
        });
      }
    }
  }, {
    key: '_getSize',
    value: function _getSize(objIds, prefix) {
      //最大区间
      var max = {
        l: null,
        t: null
      };

      //最小区间
      var min = {
        l: null,
        t: null
      };

      var obj = void 0;
      for (var i = 0; i < objIds.length; i++) {
        obj = $("#" + prefix + objIds[i]);
        if (obj.length == 0) {
          console.log(objIds[i] + " not find");
          continue;
        }
        var width = parseInt(obj.css("width"));
        var left = parseInt(obj.css("left"));
        var height = parseInt(obj.css("height"));
        var top = parseInt(obj.css("top"));

        //获取最小区间
        var xMin = left;
        var yMin = top;
        if (min.l == null || min.l > xMin) {
          min.l = xMin;
        }
        if (min.t == null || min.t > yMin) {
          min.t = yMin;
        }

        //获取最大元素的值
        var xMax = width + left;
        var yMax = height + top;
        if (max.l == null || max.l < xMax) {
          max.l = xMax;
        }
        if (max.t == null || max.t < yMax) {
          max.t = yMax;
        }
      }

      return {
        min: min,
        max: max
      };
    }

    /**
     * 设置scroller标签的宽高
     * @param {[type]} max         [description]
     * @param {[type]} min         [description]
     * @param {[type]} contentSize [description]
     * @param {[type]} scrollX     [description]
     * @param {[type]} scrollY     [description]
     * @param {[type]} $scroller   [description]
     */

  }, {
    key: '_setScrollerStyle',
    value: function _setScrollerStyle(max, min, contentSize, scrollX, scrollY, $scroller) {
      var width = 0;
      var height = 0;
      var start = { x: 0, y: 0 };
      var end = { x: 0, y: 0 };

      if (min.l < contentSize.x) {
        start.x = min.l;
      } else {
        start.x = contentSize.x;
      }

      if (min.t < contentSize.y) {
        start.y = min.t;
      } else {
        start.y = contentSize.y;
      }

      if (max.l > contentSize.x + contentSize.w) {
        end.x = max.l;
      } else {
        end.x = contentSize.x + contentSize.w;
      }

      if (max.t > contentSize.y + contentSize.h) {
        end.y = max.t;
      } else {
        end.y = contentSize.y + contentSize.h;
      }

      if (!scrollX && end.x - start.x > contentSize.w) {
        width = contentSize.w;
      } else {
        width = end.x - start.x;
      }

      if (!scrollY && end.y - start.y > contentSize.h) {
        height = contentSize.h;
      } else {
        height = end.y - start.y;
      }

      $scroller.css({
        width: width + "px",
        height: height + "px"
      });
    }

    /**
     * 重设各个子content的left top值 以包裹他们的父容器为基准
     * 并且得到snapContainer的个数 宽度 以及每个snapContainer中可以放的content个数
     * @param  {[type]} obj         [description]
     * @param  {[type]} prefix      [description]
     * @param  {[type]} contentSize [description]
     * @param  {[type]} scrollX     [description]
     * @param  {[type]} scrollY     [description]
     * @param  {[type]} min         [description]
     * @return {[type]}             [description]
     */

  }, {
    key: '_resetContents',
    value: function _resetContents(obj, prefix, contentSize, scrollX, scrollY, min) {
      var contentsPerSnapX = void 0,
          contentsPerSnapY = void 0,
          snapXCount = void 0,
          snapYCount = void 0,
          snapContainerWidth = void 0,
          snapContainerHeight = void 0;
      var contentsXTemp = 0;
      var contentsYTemp = 0;
      var leftArray = new Array();
      var topArray = new Array();
      var contentsLength = obj.length;

      for (var j = 0; j < contentsLength; j++) {
        var childId = prefix + obj[j];
        var childObj = $("#" + childId);
        Xut.Contents.ResetDefaultControl("page", childId, "");
        if (childObj.attr("data-iscroll") == "true") {
          continue;
        }
        var childLeft = parseInt(childObj.css("left"));
        var childTop = parseInt(childObj.css("top"));
        var childWidth = parseInt(childObj.css("width"));

        if (min.l < contentSize.x && scrollX) {
          childLeft = childLeft - min.l;
        } else {
          childLeft = childLeft - contentSize.x;
        }

        if (min.t < contentSize.y && scrollY) {
          childTop = childTop - min.t;
        } else {
          childTop = childTop - contentSize.y;
        }

        childObj.css("left", childLeft);
        childObj.css("top", childTop);

        leftArray.push(childLeft);
        topArray.push(childTop);

        childObj.css("visibility", "inherit");
        childObj.attr("data-iscroll", "true");
      }

      //将left值进行冒泡排序处理 以便后面比较left值与content宽之间的大小 确定一个snap容器中可以放几个content以及snap容器的宽度
      //将top值进行冒泡排序处理 以便后面比较top值与content高之间的大小 确定一个snap容器中可以放几个content以及snap容器的高度
      leftArray = this._bubbleSort(leftArray);
      topArray = this._bubbleSort(topArray);

      //x轴卷滚
      if (scrollX) {
        for (var i = 0; i < leftArray.length; i++) {
          var temp = leftArray[i];
          if (temp < contentSize.w) {
            contentsXTemp++;
          } else {
            if (!contentsPerSnapX) {
              contentsPerSnapX = contentsXTemp;
              snapContainerWidth = temp;
            }
          }
        }

        //无需创建卷滚
        if (!contentsPerSnapX) {
          contentsPerSnapX = obj.length;
          snapXCount = 1;
          snapContainerWidth = contentSize.w;
        } else {
          snapXCount = Math.ceil(obj.length / contentsPerSnapX);
        }
      }
      //y轴卷滚
      if (scrollY) {
        for (var i = 0; i < topArray.length; i++) {
          var temp = topArray[i];
          if (temp < contentSize.h) {
            contentsYTemp++;
          } else {
            if (!contentsPerSnapY) {
              contentsPerSnapY = contentsYTemp;
              snapContainerHeight = temp;
            }
          }
        }

        //得到卷滚区域一行可以放多少列
        var colsPerRow = 1;
        for (var k = 0; k < contentsLength; k++) {
          var childId = prefix + obj[k];
          var childObj = $("#" + childId);
          var childTop = parseInt(childObj.css("top"));
          if (k > 0) {
            var prevChildId = prefix + obj[k - 1];
            var prevChildObj = $("#" + prevChildId);
            var prevChildTop = parseInt(prevChildObj.css("top"));
            if (childTop < prevChildTop + 10) {
              colsPerRow++;
            } else {
              break;
            }
          }
        }

        //无需创建卷滚
        if (!contentsPerSnapY) {
          contentsPerSnapY = Math.floor(obj.length / colsPerRow) + 1; ////在不需要卷滚的条件下 只会存在一个snap snap中的行数由content的总数/每行的个数 +1
          snapYCount = 1;
          snapContainerHeight = contentSize.h;
        } else {
          snapYCount = Math.ceil(obj.length / contentsPerSnapY);
        }
      }

      return {
        contentsPerSnapX: contentsPerSnapX,
        snapXCount: snapXCount,
        snapContainerWidth: snapContainerWidth,
        contentsPerSnapY: contentsPerSnapY,
        snapYCount: snapYCount,
        snapContainerHeight: snapContainerHeight
      };
    }

    /**
     * 冒泡排序
     * @param  {[type]} array [description]
     * @return {[type]}       [description]
     */

  }, {
    key: '_bubbleSort',
    value: function _bubbleSort(array) {
      for (var i = 0; i < array.length - 1; i++) {
        for (var j = 0; j < array.length - 1 - i; j++) {
          if (array[j] > array[j + 1]) {
            var temp = array[j];
            array[j] = array[j + 1];
            array[j + 1] = temp;
          }
        }
      }
      return array;
    }

    /**
     * 创建snapContainer并添加到scroller中
     * @param  {[type]} colsObj   [description]
     * @param  {[type]} $scroller [description]
     * @param  {[type]} contentId [description]
     * @return {[type]}           [description]
     */

  }, {
    key: '_createSnapContainer',
    value: function _createSnapContainer(colsObj, $scroller, contentId, scrollX, scrollY) {
      var snapContainer = '';

      if (scrollX) {
        var scrollerWidth = parseInt($scroller.css("width"));
        var snapXCount = colsObj.snapXCount;
        var snapContainerWidth = colsObj.snapContainerWidth;
        var lastSnapContainerWidth = scrollerWidth - (snapXCount - 1) * snapContainerWidth;
        var containerWidth = void 0;
        for (var i = 0; i < colsObj.snapXCount; i++) {
          //最后一个snap容器的宽度需要单独设置 否则可能所有的snap容器宽度和会大于scroller的宽度
          if (i == colsObj.snapXCount - 1) {
            containerWidth = lastSnapContainerWidth;
          } else {
            containerWidth = snapContainerWidth;
          }
          snapContainer += '<li class="contentsContainer' + contentId + '"\n                                      style=\'width:' + containerWidth + 'px;height:100%;float:left;\'>\n                                  </li>';
        }
      }
      //Y轴滚动
      else if (scrollY) {
          var scrollerHeight = parseInt($scroller.css("height"));
          var snapYCount = colsObj.snapYCount;
          var snapContainerHeight = colsObj.snapContainerHeight;
          var lastSnapContainerHeight = scrollerHeight - (snapYCount - 1) * snapContainerHeight;
          for (var i = 0; i < colsObj.snapYCount; i++) {
            snapContainer += '<li class="contentsContainer' + contentId + '"\n                                      style=\'height:' + snapContainerHeight + 'px;width:100%;float:left;\'>\n                                  </li>';
          }
        }

      snapContainer = $(snapContainer);
      snapContainer.appendTo($scroller);
      return snapContainer;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.scrolls.length) {
        for (var i = 0; i < this.scrolls.length; i++) {
          var obj = this.scrolls[i];
          if (obj) {
            obj.scrollTo(0, 0);
            obj.destroy();
          }
          this.scrolls[i] = null;
        }
        this.scrolls = null;
      }
      this.data.container = null;
      this.options = null;
    }
  }]);
  return ScrollArea;
}();

/********************************************************************
 *
 *                  创建所有的JS页面零件类
 *                  1 js
 *                  2 page
 *                  3 svg
 *                  4 canvas
 *                  5 webgL
 *
 * *******************************************************************/

/**
 * 解析数据,获取content对象
 * @return {[type]} [description]
 */
var parseContentObjs = function parseContentObjs(pageType, inputPara, pageProportion) {
  var contentIds = [];
  inputPara.content && _.each(inputPara.content, function (contentId) {
    contentIds.push(contentId);
  });
  return Xut.Contents.GetPageWidgetData(pageType, contentIds, pageProportion);
};

/**
 * 页面零件
 * @param {[type]} data [description]
 */

var PageWidget = function () {
  function PageWidget(data) {
    classCallCheck(this, PageWidget);

    _.extend(this, data);
    this.pageObj = null;
    this._init();
  }

  /**
   * 获取参数
   * 得到content对象与数据
   * @return {[type]} [description]
   */


  createClass(PageWidget, [{
    key: '_getOptions',
    value: function _getOptions() {
      return [createData(this.inputPara, this.scrollPaintingMode, this.calculate), parseContentObjs(this.pageType, this.inputPara, this.pageProportion)];
    }

    /**
     * 元素隐藏状态下，绑定iScroll获取高度是有问题
     * 所以这里需要补丁方式修正一下
     让其不可见，但是可以获取高度 存在卷滚区域 第一个子元素最开始也要修改样式
     * @return {[type]} [description]
     */

  }, {
    key: '_resetOpacityVisibility',
    value: function _resetOpacityVisibility(firstArg, secondArg) {
      var resetStyle = new Array();

      var _loop = function _loop() {
        var content = secondArg[i];
        var $parentNode = $("#" + content.idName);
        var visible = $parentNode.css('visibility');
        //元素隐藏状态下，绑定iScroll获取高度是有问题
        //所以这里需要补丁方式修正一下
        //让其不可见，但是可以获取高度 存在卷滚区域 只有第一个卷滚区域的第一个子元素最开始也要修改样式
        if (visible == 'hidden') {
          if (i == 0) {
            //第一个卷滚区域的第一个子元素样式修改 如果不改的话 强制显示后他会显示出来 出现闪图现象
            var parent = secondArg[0];
            var prefix = firstArg.contentPrefix;
            var contentName = void 0,
                $firstChild = void 0,
                firstVisible = void 0;
            var theTitle = parseJSON(parent.theTitle);
            var obj = theTitle["data-widgetscrollareaList"].split(",");
            if (obj[0]) {
              contentName = prefix + obj[0];
              $firstChild = $("#" + contentName);
              firstVisible = $firstChild.css('visibility');
              $firstChild.css('visibility', "hidden");
            }

            var firstChildTemp = function firstChildTemp() {
              $firstChild.css('visibility', firstVisible);
            };
            resetStyle.push(firstChildTemp);
          }

          var opacity = $parentNode.css('opacity');
          var setStyle = function setStyle(key, value) {
            arguments.length > 1 ? $parentNode.css(key, value) : $parentNode.css(key);
          };
          //如果设置了不透明,则简单设为可见的
          //否则先设为不透明,再设为可见
          if (opacity == 0) {
            setStyle('visibility', 'visible');
            var temp = function temp() {
              setStyle('visibility', visible);
            };
            resetStyle.push(temp);
          } else {
            setStyle({
              'opacity': 0,
              'visibility': 'visible'
            });
            var _temp = function _temp() {
              setStyle({
                'visibility': visible,
                'opacity': opacity

              });
            };
            resetStyle.push(_temp);
          }
        }
      };

      for (var i = 0; i < secondArg.length; i++) {
        _loop();
      }

      return resetStyle;
    }

    /**
     * 初始化,加载文件
     * @return {[type]} [description]
     */

  }, {
    key: '_init',
    value: function _init() {
      //滚动区域
      if (this.widgetId == 60 && this.widgetName == "scrollarea") {
        var arg = this._getOptions();
        var resetStyle = this._resetOpacityVisibility(arg[0], arg[1]);
        this.pageObj = new ScrollArea(arg[0], arg[1]);
        //还原原有样式
        _.each(resetStyle, function (resetFunction, value) {
          resetFunction();
        });
        resetStyle = null;
      }
      //Load the localized code first
      //Combined advanced Sprite
      else if (this.widgetId == 72 && this.widgetName == "spirit") {
          var arg = this._getOptions();
          this.pageObj = AdvSprite(arg[0], arg[1]);
        }
        //直接扩展加载
        else {
            //If there is no
            if (typeof window[this.widgetName + "Widget"] != "function") {
              this.hasload = true;
              fileLoad(this._executive, this);
            } else {
              this._executive();
            }
          }
    }

    /**
     * 执行函数
     * @return {[type]} [description]
     */

  }, {
    key: '_executive',
    value: function _executive() {
      if (typeof window[this.widgetName + "Widget"] == "function") {
        var arg = this._getOptions();
        this.pageObj = new window[this.widgetName + "Widget"](arg[0], arg[1]);
      } else {
        console.error("Function [" + this.widgetName + "Widget] does not exist.");
      }
    }

    /**
     * 动画运行
     * @return {[type]} [description]
     */

  }, {
    key: 'play',
    value: function play() {
      return this.pageObj.play();
    }

    /**
     * 外部切换调用接口
     * @return {[type]} [description]
     */

  }, {
    key: 'toggle',
    value: function toggle() {
      this.pageObj && this.pageObj.toggle && this.pageObj.toggle();
    }

    /**
     * 动作停止接口
     * @return {[type]} [description]
     */

  }, {
    key: 'stop',
    value: function stop() {
      this.pageObj && this.pageObj.stop && this.pageObj.stop();
    }

    /**
     * 销毁页面零件
     * @return {[type]} [description]
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.hasload && removeFileLoad();
      this.pageObj && this.pageObj.destroy && this.pageObj.destroy();
    }
  }]);
  return PageWidget;
}();

/*
混入图片数据
 */
function mixData(inputPara) {
  var _ref = [undefined],
      item = _ref[0],
      field = _ref[1],
      token = _ref[2];

  var source = [];
  var images = Xut.data['Image'];
  var items = inputPara.source;
  for (item in items) {
    if (items.hasOwnProperty(item)) {
      field = {};
      token = images.item((parseInt(items[item]) || 1) - 1);
      field['img'] = '../gallery/' + token.md5;
      field['thumb'] = '';
      field['title'] = token.imageTitle;
      source.push(field);
    }
  }
  inputPara.source = source;
  return inputPara;
}

/**
 * 创建iframe零件包装器
 */

var iframeWidget = function () {
  function iframeWidget(data) {
    var _this = this;

    classCallCheck(this, iframeWidget);

    _.extend(this, data);
    this._$wapper = this._createWapper();
    Xut.nextTick({ 'container': this.rootNode, 'content': this._$wapper }, function () {
      _this.rootNode = null;
      _this._bindMessage();
    });
    return this;
  }

  createClass(iframeWidget, [{
    key: '_createWapper',
    value: function _createWapper() {
      if (this.zIndex !== 0) {
        this.zIndex = this.zIndex || Xut.zIndexlevel();
      }
      this._$iframe = this._createIframe();
      return $(String.styleFormat('<div id="widget_iframe_' + this.id + '"\n            style="z-index:' + this.zIndex + ';\n                   width:' + this.width + 'px;\n                   height:' + this.height + 'px;\n                   top:' + this.top + 'px;\n                   left:' + this.left + 'px;\n                   position:absolute;">\n       </div>')).append(this._$iframe);
    }
  }, {
    key: '_createIframe',
    value: function _createIframe() {
      var _this2 = this;

      var ifr = document.createElement('iframe');
      var path = config.data.rootPath + '/widget/' + this.widgetId + '/index.html?xxtParaIn=' + this.key;
      ifr.id = 'iframe_' + this.id;
      ifr.src = path;
      ifr.style.width = '100%';
      ifr.style.height = '100%';
      ifr.sandbox = "allow-scripts allow-same-origin";
      ifr.frameborder = 0;
      if (ifr.attachEvent) {
        ifr.attachEvent('onload', function () {
          _this2._iframeComplete();
        });
      } else {
        ifr.onload = function () {
          _this2._iframeComplete();
        };
      }
      return ifr;
    }
  }, {
    key: '_iframeComplete',
    value: function _iframeComplete() {
      var dataSource = mixData(this.inputPara);
      var width = this._$iframe.offsetWidth;
      var height = this._$iframe.offsetHeight;
      if (dataSource.screenSize.width * 0.98 <= width && dataSource.screenSize.height * 0.98 <= height) {
        Xut.View.Toolbar({ show: 'button', hide: 'controlBar' });
      } else if (dataSource.screenSize.width * 0.7 <= width && dataSource.screenSize.height * 0.7 <= height) {
        Xut.View.Toolbar({ show: 'button' });
      }
      PMS.send({
        target: this._$iframe.contentWindow,
        origin: '*',
        type: 'loadData',
        data: dataSource,
        success: function success() {},
        error: function error() {}
      });
      this.state = true;
    }

    /*与iframe通讯接口*/

  }, {
    key: '_bindMessage',
    value: function _bindMessage() {
      var _this3 = this;

      var markId = this.id;
      var $wapper = this._$wapper;
      var $iframe = $(this._$iframe);

      //隐藏widget
      PMS.bind("onHideWapper" + markId, function () {
        $wapper.hide();
        _this3.state = false;
      }, '*');

      /*全屏操作*/
      PMS.bind("onFullscreen" + markId, function (e) {
        if (!$iframe.length) return;

        /*关闭视频*/
        clearVideo();
        $wapper.css({ width: '100%', height: '100%', zIndex: Xut.zIndexlevel(), top: 0, left: 0 });

        /*Widget全屏尺寸自动调整*/
        if (e.full == false) {
          var body = document.body,
              width = parseInt(body.clientWidth),
              height = parseInt(body.clientHeight),
              rote = _this3.width / _this3.height,
              getRote = function getRote(width, height, rote) {
            var w = width,
                h = width / rote;
            if (h > height) {
              h = height;
              w = h * rote;
            }
            return {
              w: parseInt(w),
              h: parseInt(h)
            };
          },
              size = getRote(width, height, rote),
              left = (width - size.w) / 2,
              top = (height - size.h) / 2;
          $iframe.css({ width: size.w, height: size.h, position: 'absolute', top: top, left: left });
        }

        /*隐藏工作条*/
        Xut.View.Toolbar("hide");
      }, '*');

      /*全屏还原*/
      PMS.bind("onReset" + markId, function () {
        if (!$iframe.length) return;
        $wapper.css({
          zIndex: _this3.zIndex,
          width: _this3.width + 'px',
          height: _this3.height + 'px',
          top: _this3.top + 'px',
          left: _this3.left + 'px'
        });
        $iframe.css({ width: '100%', height: '100%', position: '', top: '0', left: '0' });
        Xut.View.Toolbar("show");
      }, '*');

      /*隐藏工作条*/
      PMS.bind("onHideToolbar" + markId, function () {
        Xut.View.HideToolBar();
      }, '*');

      /*跳转页面*/
      PMS.bind('scrollToPage' + markId, function (data) {
        Xut.View.GotoSlide(data['ppts'], data['pageIndex']);
      }, '*');
    }

    /*发送消息通知*/

  }, {
    key: '_send',
    value: function _send(type) {
      PMS.send({
        type: type,
        origin: '*',
        target: this._$iframe.contentWindow,
        url: this._$iframe.src,
        success: function success() {}
      });
    }

    /*处理包装容器的状态*/

  }, {
    key: '_perform',
    value: function _perform(type, state) {
      var _this4 = this;

      if (this.state) {
        this._$wapper.hide();
      } else {
        this._$wapper.show();
      }
      this._send(type);
      setTimeout(function () {
        _this4.state = state;
      }, 0);
    }

    /*开始*/

  }, {
    key: '_start',
    value: function _start() {
      this._perform('onShow', true);
    }

    /*暂停*/

  }, {
    key: '_stop',
    value: function _stop() {
      this._perform('onHide', false);
    }

    /*停止*/

  }, {
    key: 'stop',
    value: function stop() {
      this._stop();
    }

    /*外部调用接口*/

  }, {
    key: 'toggle',
    value: function toggle() {
      if (this.state) {
        this._stop();
      } else {
        this._start();
      }
    }

    /*销毁接口*/

  }, {
    key: 'destroy',
    value: function destroy() {
      var _this5 = this;

      this._send('onDestory');
      PMS.unbind();
      setTimeout(function () {
        _this5._$iframe = null;
        _this5._$wapper.remove();
        _this5._$wapper = null;
      }, 0);
    }
  }]);
  return iframeWidget;
}();

/********************************************************************
 *
 *                   零件适配器
 *
 *              1 数据过滤
 *              构件5种类型
 *
 * *******************************************************************/
/**
 * 注册所有组件对象
 * 2 widget 包括 视频 音频 Action 子文档 弹出口 类型
 * 这种类型是冒泡处理，无法传递钩子，直接用这个接口与场景对接
 * @param  {[type]} regData [description]
 * @return {[type]}         [description]
 */
var injectionComponent = function injectionComponent(regData) {
  var sceneObj = sceneController.containerObj('current');
  sceneObj.$$mediator.$injectionComponent = regData;
};

var load = function load(type, data, constructor) {
  injectionComponent({
    'pageType': data.pageType, //标记类型区分
    'pageIndex': data.pageIndex,
    'widget': new constructor(data)
  });
};

/**
 * 构建5中零件类型
 *  1、iframe零件
 *  2、页面零件
 *  3、SVG零件
 *  4、canvas零件
 *  5、webGL零件
 * @type {Object}
 */
var adapterType = {

  /**
   * iframe零件类型
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  'iframe': function iframe(data) {
    load('widget', data, iframeWidget);
  },
  'widget': function widget(data) {
    load('widget', data, iframeWidget);
  },


  /**
   * js零件类型处理
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  'js': function js(data) {
    load('js', data, PageWidget);
  },
  'page': function page(data) {
    load('page', data, PageWidget);
  },
  'svg': function svg(data) {
    load('svg', data, PageWidget);
  },
  'canvas': function canvas(data) {
    load('canvas', data, PageWidget);
  },
  'webgL': function webgL(data) {
    load('webgL', data, PageWidget);
  }
};

/*过滤出数据*/
var getWidgetData = function getWidgetData(data) {
  //直接通过id查询数据
  if (data.widgetId) {
    _.extend(data, Xut.data.query('Widget', data.widgetId));
  } else {
    //直接通过activityId查询数据
    _.extend(data, Xut.data.query('Widget', data.activityId, 'activityId'));
  }
  return data;
};

/*计算元素的缩放比*/
var calculateSize = function calculateSize(data, pageStyle) {
  var sizeResults = reviseSize({
    results: data,
    getStyle: pageStyle,
    proportion: pageStyle.pageProportion
  });
  data.width = data.scaleWidth;
  data.height = data.scaleHeight;
  data.top = data.scaleTop;
  data.left = data.scaleLeft;
  return data;
};

/*ifarme内部，请求返回数据*/
var parsePara = function parsePara(data) {
  var inputPara = void 0;
  if (inputPara = data.inputPara) {
    return parseJSON(inputPara);
  }
  return {};
};

function Adapter(para) {
  //获取数据
  var data = getWidgetData(_.extend({}, para));

  data.id = data.activityId;
  data.inputPara = parsePara(data);

  /*增加属性参数*/
  if (data.widgetType === 'page') {
    data.inputPara.container = data.rootNode;
  }

  /*重新定义页面的布局参数*/
  var pageStyle = Xut.Presentation.GetPageStyle(para.pageIndex);
  var pageVisualSize = {
    width: pageStyle.visualWidth,
    height: pageStyle.visualHeight,
    left: pageStyle.visualLeft,
    top: pageStyle.visualTop
  };
  data.pageProportion = pageStyle.pageProportion;

  /*缩放比值*/
  data = calculateSize(data, pageStyle);

  data.inputPara.uuid = config.data.appId + '-' + data.activityId; //唯一ID标示
  data.inputPara.id = data.activityId;
  data.inputPara.screenSize = pageVisualSize;

  //content的命名前缀
  data.inputPara.contentPrefix = Xut.Presentation.GetContentPrefix(data.pageIndex, data.pageType);

  //画轴模式
  data.scrollPaintingMode = config.launch.visualMode === 4;
  data.calculate = pageVisualSize;

  //执行类构建
  adapterType[(data.widgetType || 'widget').toLowerCase()](data);
}

var Widget = {

  /**
   * 创建热点元素结构（用于布局可触发点
   * 要retrun返回这个结构，主要是多人操作时,保证只有最终的dom渲染只有一次
   * 根据数据创建自己的热点元素结构（用于拼接结构字符串）
   * @return {[type]}              [description]
   */
  createDom: function createDom(_ref, chpaterData, chapterId, pageIndex, zIndex, pageType) {
    var _id = _ref._id,
        md5 = _ref.md5,
        autoPlay = _ref.autoPlay,
        actType = _ref.actType,
        scaleWidth = _ref.scaleWidth,
        scaleHeight = _ref.scaleHeight,
        scaleTop = _ref.scaleTop,
        scaleLeft = _ref.scaleLeft;

    //如果是自动播放,则不创建结构
    if (autoPlay) {
      return '';
    }
    return String.styleFormat('<div id="' + (actType + "_" + _id) + '"\n            data-belong="' + pageType + '"\n            data-delegate="' + actType + '"\n            style="cursor:pointer;\n                   background-size:100% 100%;\n                   position:absolute;\n                   width:' + scaleWidth + 'px;\n                   height:' + scaleHeight + 'px;\n                   left:' + scaleLeft + 'px;\n                   top:' + scaleTop + 'px;\n                   z-index:' + zIndex + ';\n            ' + (md5 ? "background-image: url(" + getFileFullPath(md5, 'hot-widget') + ");" : '') + '">\n      </div>');
  }

  /**
   * 自动零件
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */

  ,
  autoPlay: function autoPlay(_ref2) {
    var id = _ref2.id,
        rootNode = _ref2.rootNode,
        pageType = _ref2.pageType,
        pageIndex = _ref2.pageIndex;

    Adapter({
      rootNode: rootNode,
      pageType: pageType,
      pageIndex: pageIndex,
      activityId: id,
      isAutoPlay: true
    });
  }

  /**
   * 事件委托
   * 通过点击触发
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */

  ,
  trigger: function trigger(data) {
    return Adapter(data);
  }
};

/**
 * 提示框
 */
var ShowNote$1 = function () {
  function ShowNote(data) {
    classCallCheck(this, ShowNote);

    data.id = parseInt(data.id);
    data.actType = data.type;
    _.extend(this, data);
    this.setup();
  }

  createClass(ShowNote, [{
    key: 'setup',
    value: function setup() {
      var that = this,
          note = this.data.note,
          prop = Xut.config.proportion,
          width = Math.round((prop.width + prop.height) / 2 * config.data.iconHeight),
          space = Math.round(width / 2);

      var retStr = '<div class="xut-shownote-box" style="z-index:' + Xut.zIndexlevel() + '">' + '<div class="close" style="width:' + width + 'px;height:' + width + 'px;top:-' + space + 'px;right:-' + space + 'px"></div>' + '<div class="content">' + note + '</div>' + '</div>';

      this._dom = $(retStr);
      this._dom.find('.close').on("touchend mouseup", function () {
        that.toggle();
      });
      $(this.rootNode).append(this._dom);

      this.show();

      this.iscroll = IScroll(this._dom.find('.content')[0], {
        scrollbars: 'custom',
        fadeScrollbars: true
      });
      return true;
    }

    //外部调用接口

  }, {
    key: 'toggle',
    value: function toggle() {
      //自动热点 取消关闭
      if (this.isAutoPlay) return;
      //当前对象状态
      this.state ? this.hide() : this.show();
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (this.state) {
        this.toggle();
        return true;
      }
      return false;
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.state = false;
      $("#ShowNote_" + this.id).css('background-image', 'url(images/icons/hideNote.png)');
      this._dom.hide();
    }
  }, {
    key: 'show',
    value: function show() {
      this.state = true;
      $("#ShowNote_" + this.id).css('background-image', 'url(images/icons/showNote.png)');
      this._dom.show();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (this._dom) {
        this._dom.find('.close').off();
        this._dom && this._dom.hide().remove();
      }

      //iscroll销毁
      if (this.iscroll) {
        this.iscroll.destroy();
        this.iscroll = null;
      }
    }
  }]);
  return ShowNote;
}();

var ShowNote$$1 = {

  /**
   * 创建热点元素结构（用于布局可触发点）
   * 根据数据创建自己的热点元素结构（用于拼接结构字符串）
   * 要retrun返回这个结构，主要是多人操作时,保证只有最终的dom渲染只有一次
   * actType + "_" + _id
   * @return {[type]}              [description]
   */
  createDom: function createDom(_ref, chpaterData, chapterId, pageIndex, zIndex, pageType) {
    var _id = _ref._id,
        md5 = _ref.md5,
        actType = _ref.actType,
        category = _ref.category,
        itemArray = _ref.itemArray,
        scaleWidth = _ref.scaleWidth,
        scaleHeight = _ref.scaleHeight,
        scaleTop = _ref.scaleTop,
        scaleLeft = _ref.scaleLeft;

    var newWidth = (scaleWidth + scaleHeight) / 2 * config.data.iconHeight;
    return String.styleFormat('<div id="ShowNote_' + _id + '"\n            class="xut-showNote"\n            data-belong ="' + pageType + '"\n            data-delegate="shownote"\n            style="width:' + newWidth + 'px;height:' + newWidth + 'px">\n       </div>');
  }

  /**
   * touchEnd 全局派发的点击事件
   * 如果stopGlobalEvent == ture 事件由全局派发
   */

  ,
  trigger: function trigger(options) {
    options.data = Xut.Presentation.GetPageData(options.pageIndex);
    new ShowNote$1(options);
  }

  /**
   * 自动运行生成Action或者widget触发点对象
   * @param  {[type]} opts [description]
   * @return {[type]}      [description]
   */

  ,
  autoPlay: function autoPlay() {}

  /**
   * 销毁页面hotspot事件与Action或widget事件
   * @param  {[type]} activeObejct [需要处理的活动对象]
   * @param  {[type]} pageIndex    [页码标示]
   * @param  {[type]} rootEle      [根元素]
   * @return {[type]}              [description]
   */

  ,
  destroy: function destroy(opts) {
    this && this.destroy();
  }
};

var directives = {
  'Video': Media,
  'Audio': Media,
  'Webpage': Media,
  Action: Action$1,
  Widget: Widget,
  ShowNote: ShowNote$$1
};

/**
 *  创建widgets对象任务片
 *  state状态
 *      0 未创建
 *      1 正常创建
 *      2 创建完毕
 *      3 创建失败
 */
var TaskComponents = function (_TaskSuper) {
  inherits(TaskComponents, _TaskSuper);

  function TaskComponents(pipeData, success, detector) {
    classCallCheck(this, TaskComponents);

    //预编译模式跳过创建
    var _this = possibleConstructorReturn(this, (TaskComponents.__proto__ || Object.getPrototypeOf(TaskComponents)).call(this, detector));

    if (Xut.IBooks.runMode()) {
      success();
      return possibleConstructorReturn(_this);
    }

    if (pipeData.activitys && pipeData.activitys.length) {
      _this.success = success;
      _this.$containsNode = pipeData.$containsNode;
      _this.pageBaseHooks = pipeData.pageBaseHooks;
      _this.pipeData = pipeData;
      _this._checkNextTask(_this._create(pipeData));
    } else {
      success();
    }
    return _this;
  }

  /**
   * 创建dom节点，但是浮动类型例外
   */


  createClass(TaskComponents, [{
    key: '_create',
    value: function _create() {
      var _this2 = this;

      var _pipeData = this.pipeData,
          pageType = _pipeData.pageType,
          activitys = _pipeData.activitys,
          chpaterData = _pipeData.chpaterData,
          chapterId = _pipeData.chapterId,
          chapterIndex = _pipeData.chapterIndex;


      var resultHTML = [];

      /*
        创建DOM元素结构,返回是拼接字符串
        判断返回值
        1 纯html
        2 对象（浮动音频处理）
      */
      var createDom = function createDom(actType, activityData) {
        activityData = reviseSize({
          results: activityData,
          proportion: _this2.pipeData.getStyle.pageProportion
        });
        var result = directives[actType]['createDom'](activityData, chpaterData, chapterId, chapterIndex, Xut.zIndexlevel(), pageType);
        if (_.isString(result)) {
          resultHTML.push(result);
        } else {
          /*如果有浮动类型，保存*/
          if (result.hasFloat) {
            _this2.$$floatDivertor[pageType].html.push(result.html);
          } else {
            resultHTML.push(result.html);
          }
        }
      };

      //需要创建的数据结构
      activitys.forEach(function (activityData, index) {
        //创建类型
        var actType = activityData.actType || activityData.animation;
        //特殊类型 showNote
        if (!actType && activityData.note) {
          activityData['actType'] = actType = "ShowNote";
        }
        switch (actType) {
          case 'ShowNote':
          case 'Action':
          case 'Widget':
          case 'Audio':
          case 'Video':
            createDom(actType, activityData);
            break;
        }
      });

      return resultHTML.join("");
    }

    /**
     * 检测下个任务是否中断运行
     */

  }, {
    key: '_checkNextTask',
    value: function _checkNextTask(htmlString) {
      var _this3 = this;

      this._$$checkNextTask('内部Component', function () {
        _this3._float(function () {
          _this3._render(htmlString);
        });
      });
    }

    /**
     * 浮动处理
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */

  }, {
    key: '_float',
    value: function _float(callback) {
      var _this4 = this;

      /*制作浮点回调*/
      this.pipeData.taskCount = 0;

      var complete = function () {
        return function () {
          if (_this4.pipeData.taskCount === 1) {
            callback();
            return;
          }
          --_this4.pipeData.taskCount;
        };
      }();

      this._$$createFloatLayer(complete, this.pipeData);

      /*如果不存在浮动*/
      if (this.pipeData.taskCount === 0) {
        complete = null;
        callback();
      }
    }

    /**
     * 渲染页面*
     * @param  {[type]} htmlString [description]
     * @return {[type]}            [description]
     */

  }, {
    key: '_render',
    value: function _render(htmlString) {
      var _this5 = this;

      /*正常component*/
      if (htmlString) {
        Xut.nextTick({
          container: this.$containsNode,
          content: $(htmlString)
        }, function () {
          _this5._destroy();
          _this5.success();
        });
      } else {
        this._destroy();
        this.success();
      }
    }

    //============================
    //      super方法
    //============================

  }, {
    key: '_destroy',
    value: function _destroy() {
      this.$containsNode = null;
    }
  }]);
  return TaskComponents;
}(TaskSuper);

/**
 * 页面切换效果
 * 平移
 * @return {[type]} [description]
 */
var transitionDuration$1 = Xut.style.transitionDuration;

/**
 * 切换坐标
 * 保证只是pageType === page才捕获动作
 */
var setTranslate = function setTranslate(node, distance, speed, callback) {
  if (node) {
    if (config.launch.scrollMode === 'v') {
      Xut.style.setTranslate({ node: node, speed: speed, y: distance });
    } else {
      Xut.style.setTranslate({ node: node, speed: speed, x: distance });
    }
    callback && callback();
  }
};

/**
 * 设置
 * @param  {[type]} node [description]
 * @return {[type]}      [description]
 */
var set$1 = function set(node, value) {
  if (node) {
    if (config.launch.scrollMode === 'v') {
      Xut.style.setTranslate({ node: node, y: value });
    } else {
      Xut.style.setTranslate({ node: node, x: value });
    }
  }
};

/**
 * 复位
 * @return {[type]} [description]
 */
var reset = function reset(node) {
  if (node) {
    Xut.style.setTranslate({ node: node, x: 0, y: 0 });
    node.style[transitionDuration$1] = '';
  }
};

/**
 * 移动
 * @return {[type]} [description]
 */
var flipMove$1 = function flipMove() {
  setTranslate.apply(undefined, arguments);
};

/**
 * 移动反弹
 * @return {[type]} [description]
 */
var flipRebound$1 = function flipRebound() {
  setTranslate.apply(undefined, arguments);
};

/**
 * 移动结束
 * @return {[type]} [description]
 */
var flipOver$1 = function flipOver() {
  setTranslate.apply(undefined, arguments);
};

/**
 * translation滑动接口
 * @type {Object}
 */
var translation = {
  set: set$1,
  reset: reset,
  flipMove: flipMove$1,
  flipRebound: flipRebound$1,
  flipOver: flipOver$1
};

/**
 * 创建translate初始值
 * @param  {[type]} offset [description]
 * @return {[type]}        [description]
 */
var createTranslate = function createTranslate(value) {
  if (config.launch.scrollMode === 'v') {
    return Xut.style.setTranslateStyle(0, value);
  }
  return Xut.style.setTranslateStyle(value, 0);
};

/**
 * 修正坐标
 * 跳转使用
 * @return {[type]} [description]
 */
function fix($node, action) {
  var translate = void 0;
  if (config.launch.scrollMode === 'v') {
    var visualHight = config.visualSize.height;
    translate = action === 'prevEffect' ? createTranslate(-visualHight) : createTranslate(visualHight);
  } else {
    var visualWidth = config.visualSize.width;
    translate = action === 'prevEffect' ? createTranslate(-visualWidth) : createTranslate(visualWidth);
  }
  $node.css(Xut.style.transform, translate);
}

/************************
 * 左边页面钩子
 *     distance 正数，1-2-3-4 -> N 变化
 *     pageStyle：3个页面的style配置
 *************************/
var leftPageHook = {
  flipMove: {
    prev: function prev(getStyle, distance) {
      var middlePageStyle = getStyle('middle');
      var leftPageStyle = getStyle('left');

      //中间：溢出
      if (middlePageStyle && middlePageStyle.visualLeftInteger) {
        //左边：溢出
        if (leftPageStyle && leftPageStyle.visualLeftInteger) {
          return -leftPageStyle.visualWidth + distance;
        }
        //左边：正常
        else {
            return distance - leftPageStyle.visualWidth - middlePageStyle.visualLeftInteger;
          }
      }
      //中间：正常
      else {
          //左边：溢出
          if (leftPageStyle && leftPageStyle.visualLeftInteger) {
            return distance - leftPageStyle.visualWidth + leftPageStyle.visualLeftInteger;
          }
          //左边：正常
          else {
              return distance - leftPageStyle.visualWidth;
            }
        }
    },
    next: function next() {}
  },
  flipRebound: {
    prev: function prev(getStyle) {
      var middlePageStyle = getStyle('middle');
      var leftPageStyle = getStyle('left');

      //中间：溢出
      if (middlePageStyle && middlePageStyle.visualLeftInteger) {
        //左边：溢出
        if (leftPageStyle && leftPageStyle.visualLeftInteger) {
          return -leftPageStyle.visualWidth;
        }
        //左边：正常
        else {
            return -(leftPageStyle.visualWidth + middlePageStyle.visualLeftInteger);
          }
      }
      //中间：正常
      else {
          //左边：溢出
          if (leftPageStyle && leftPageStyle.visualLeftInteger) {
            return -(leftPageStyle.visualWidth - leftPageStyle.visualLeftInteger);
          }
          //左边：正常
          else {
              return -leftPageStyle.visualWidth;
            }
        }
    },
    next: function next() {}
  },
  flipOver: {
    prev: function prev(getStyle, distance) {
      return 0;
    },
    next: function next() {}
  }
};

/************************
 * 中间页面钩子
 *************************/
var hMiddlePageHook = {
  flipMove: {
    prev: function prev() {},
    next: function next() {}
  },
  flipOver: {
    /**
     * 左翻页结束
     */
    prev: function prev(getStyle, distance) {
      var middlePageStyle = getStyle('middle');
      var leftPageStyle = getStyle('left');

      //中间：溢出
      if (middlePageStyle && middlePageStyle.visualLeftInteger) {
        //左边：溢出
        if (leftPageStyle && leftPageStyle.visualLeftInteger) {
          return middlePageStyle.visualWidth;
        }
        //左边：正常
        else {
            return middlePageStyle.visualWidth - middlePageStyle.visualLeftInteger;
          }
      }
      //中间：正常
      else {
          //左边：溢出
          if (leftPageStyle && leftPageStyle.visualLeftInteger) {
            return middlePageStyle.visualWidth + leftPageStyle.visualLeftInteger;
          }
          //左边：正常
          else {
              return middlePageStyle.visualWidth;
            }
        }
    },

    /**
     * 右翻页结束
     */
    next: function next(getStyle) {

      var middlePageStyle = getStyle('middle');
      var rightPageStyle = getStyle('right');

      //中间：溢出
      if (middlePageStyle && middlePageStyle.visualLeftInteger) {
        //右边：溢出
        if (rightPageStyle && rightPageStyle.visualLeftInteger) {
          return -middlePageStyle.visualWidth;
        }
        //右边：正常
        else {
            return -(middlePageStyle.visualWidth - middlePageStyle.visualLeftInteger);
          }
      }
      //中间：正常
      else {
          //右边：溢出
          if (rightPageStyle && rightPageStyle.visualLeftInteger) {
            return -(middlePageStyle.visualWidth + rightPageStyle.visualLeftInteger);
          }
          //右边：正常
          else {
              return -rightPageStyle.visualWidth;
            }
        }
    }
  }
};

/************************
 * right页面钩子
 * distance -1 -2 -3 -N 递减
 *************************/
var rightPageHook = {
  flipMove: {
    prev: function prev() {},

    /**
     * 右滑动
     * distance -1 -> -N 递减
     */
    next: function next(getStyle, distance) {

      var middlePageStyle = getStyle('middle');
      var rightPageStyle = getStyle('right');

      //中间：溢出
      if (middlePageStyle && middlePageStyle.visualLeftInteger) {
        //右边：溢出
        if (rightPageStyle && rightPageStyle.visualLeftInteger) {
          return distance + rightPageStyle.visualWidth;
        }
        //右边：正常
        else {
            return distance + middlePageStyle.visualWidth - middlePageStyle.visualLeftInteger;
          }
      }
      //中间：正常
      else {
          //右边：溢出
          if (rightPageStyle && rightPageStyle.visualLeftInteger) {
            return distance + middlePageStyle.visualWidth + rightPageStyle.visualLeftInteger;
          }
          //右边：正常
          else {
              return distance + rightPageStyle.visualWidth;
            }
        }
    }
  },
  flipRebound: {
    prev: function prev() {},
    next: function next(getStyle) {

      var rightPageStyle = getStyle('right');

      /*如果页面模式是5，特殊处理,返回半页宽度*/
      if (rightPageStyle && rightPageStyle.pageVisualMode === 5) {
        return rightPageStyle.visualWidth / 2;
      }

      var middlePageStyle = getStyle('middle');

      //中间：溢出
      if (middlePageStyle && middlePageStyle.visualLeftInteger) {
        //右边：溢出
        if (rightPageStyle && rightPageStyle.visualLeftInteger) {
          return rightPageStyle.visualWidth;
        }
        //右边：正常
        else {
            return middlePageStyle.visualWidth - middlePageStyle.visualLeftInteger;
          }
      }
      //中间：正常
      else {
          //右边：溢出
          if (rightPageStyle && rightPageStyle.visualLeftInteger) {
            return middlePageStyle.visualWidth + rightPageStyle.visualLeftInteger;
          }
          //右边：正常
          else {
              return middlePageStyle.visualWidth;
            }
        }
    }
  },
  flipOver: {
    prev: function prev() {},
    next: function next() {
      return 0;
    }
  }
};

/************************
 * 顶部页面钩子
 *************************/
var topPageHook = {
  flipMove: {
    /*顶部页面往中间移动*/
    prev: function prev(getStyle, distance) {
      var topPageStyle = getStyle('top');
      return distance - topPageStyle.visualHeight;
    }
  },
  flipRebound: {
    /*顶部往中间反弹*/
    prev: function prev(getStyle) {
      var topPageStyle = getStyle('top');
      return -topPageStyle.visualHeight;
    }
  },
  flipOver: {
    /*顶部往中间翻页*/
    prev: function prev() {
      return 0;
    }
  }
};

/************************
 * 中间页面钩子
 *************************/
var vMiddlePageHook = {
  flipOver: {
    /**
     * 中间页面向底部滑动
     */
    prev: function prev(getStyle) {
      var middle = getStyle('middle');
      return middle.visualHeight;
    },

    /**
     * 中间页面向顶部滑动
     */
    next: function next(getStyle) {
      var middle = getStyle('middle');
      return -middle.visualHeight;
    }
  }
};

/************************
 * 底部页面钩子
 *************************/
var bottomPageHook = {
  flipMove: {
    /*从底部往中间移动*/
    next: function next(getStyle, distance) {
      var bottomPageStyle = getStyle('bottom');
      return distance + bottomPageStyle.visualHeight;
    }
  },
  flipRebound: {
    /*底部往中间反弹*/
    next: function next(getStyle) {
      var topPageStyle = getStyle('bottom');
      return topPageStyle.visualHeight;
    }
  },
  flipOver: {
    /*底部页面，翻页结束后，目标变为当前可是页面*/
    next: function next() {
      return 0;
    }
  }
};

/**
 * 获取页面对象的样式配置对象
 * @param  {[type]} pageIndex [description]
 * @return {[type]}           [description]
 */
var _getPageStyle = function _getPageStyle(pageIndex) {
  if (pageIndex === undefined) {
    return {};
  }
  var pageBase = Xut.Presentation.GetPageBase(pageIndex);
  return pageBase && pageBase.getStyle || {};
};

var makeAccess = function makeAccess(action, direction, distance, getStyle) {
  return function (hooks) {
    return hooks && hooks[action] && hooks[action][direction] && hooks[action][direction](getStyle, distance);
  };
};

/**
 * 单页模式
 * 计算每个页面的移动距离
 * direction  = prev/next
 * orientation  = v/h
 */
var getSingle = function getSingle(_ref) {
  var action = _ref.action,
      distance = _ref.distance,
      direction = _ref.direction,
      frontIndex = _ref.frontIndex,
      middleIndex = _ref.middleIndex,
      backIndex = _ref.backIndex,
      orientation = _ref.orientation;


  /*如果没有传递布方向，就取页面
  flow中没有定义，这个在全局接口中处理*/
  if (!orientation) {
    orientation = config.launch.scrollMode;
  }

  var front = 0;
  var middle = 0;
  var back = 0;

  //当前视图页面
  //用来处理页面回调
  var visualPage = undefined;

  /*根据后去的定位，获取页面的样式*/
  var getStyle = function getStyle(position) {
    var style = void 0,
        pageIndex = void 0;
    switch (position) {
      case 'left':
      case 'top':
        pageIndex = frontIndex;
        break;
      case 'right':
      case 'bottom':
        pageIndex = backIndex;
        break;
      case 'middle':
        pageIndex = middleIndex;
        break;
    }
    return _getPageStyle(pageIndex);
  };

  /*获取页面样式*/
  var access = makeAccess(action, direction, distance, getStyle);

  /*滑动与反弹*/
  if (hasIndexOf(action, ['flipMove', 'flipRebound'])) {
    if (orientation === 'h') {
      front = access(leftPageHook);
      back = access(rightPageHook);
    } else {
      front = access(topPageHook);
      back = access(bottomPageHook);
    }
    middle = distance;
  }

  /*翻页*/
  if (action === 'flipOver') {
    if (orientation === 'h') {
      front = access(leftPageHook);
      middle = access(hMiddlePageHook);
      back = access(rightPageHook);
    } else {
      front = access(topPageHook);
      middle = access(vMiddlePageHook);
      back = access(bottomPageHook);
    }
    visualPage = direction === 'prev' ? front : back;
  }
  return [front, middle, back, visualPage];
};

/*
双页模式
仅计算包裹容器移动的距离
 */
var getDouble = function getDouble(_ref2) {
  var action = _ref2.action,
      distance = _ref2.distance,
      direction = _ref2.direction,
      frontIndex = _ref2.frontIndex,
      middleIndex = _ref2.middleIndex,
      backIndex = _ref2.backIndex;

  var left = 0;
  var middle = 0;
  var right = 0;
  var view = middleIndex;
  var screenWidth = config.screenSize.width;
  if (direction === 'next') {
    /*滑动,反弹，需要叠加当期之前之前所有页面的距离综合，
    因为索引从0开始，所以middleIndex就是之前的总和页面数*/
    if (action === 'flipMove' || action === 'flipRebound') {
      middle = -(screenWidth * middleIndex) + distance;
    }

    /*翻页，需要设置下一页的页面宽度长度*/
    if (action === 'flipOver') {
      middle = -(screenWidth * backIndex);
    }
  }
  return [left, middle, right, view];
};

/**
 * 动态计算翻页距离
 * @return {[type]} [description]
 */
function getVisualDistance(options) {
  return config.launch.doublePageMode ? getDouble(options) : getSingle(options);
}

/*
计算当前已经创建的页面索引
 */
function calculationIndex(visualIndex, targetIndex, totalIndex) {
  var i = 0,
      existpage,
      createpage,
      pageIndex,
      ruleOut = [],
      create = [],
      destroy,
      viewFlip;

  //存在的页面
  if (visualIndex === 0) {
    existpage = [visualIndex, visualIndex + 1];
  } else if (visualIndex === totalIndex - 1) {
    existpage = [visualIndex - 1, visualIndex];
  } else {
    existpage = [visualIndex - 1, visualIndex, visualIndex + 1];
  }

  //需要创建的新页面
  if (targetIndex === 0) {
    createpage = [targetIndex, targetIndex + 1];
  } else if (targetIndex === totalIndex - 1) {
    createpage = [targetIndex - 1, targetIndex];
  } else {
    createpage = [targetIndex - 1, targetIndex, targetIndex + 1];
  }

  for (; i < createpage.length; i++) {
    pageIndex = createpage[i];
    //跳过存在的页面
    if (-1 === existpage.indexOf(pageIndex)) {
      //创建目标的页面
      create.push(pageIndex);
    } else {
      //排除已存在的页面
      ruleOut.push(pageIndex);
    }
  }

  _.each(ruleOut, function (ruleOutIndex) {
    existpage.splice(existpage.indexOf(ruleOutIndex), 1);
  });

  destroy = existpage;

  viewFlip = [].concat(create).concat(ruleOut).sort(function (a, b) {
    return a - b;
  });

  return {
    'create': create, //创建的页面
    'ruleOut': ruleOut, //排除已存在的页面
    'destroy': destroy, //销毁的页面
    'viewFlip': viewFlip,
    'targetIndex': targetIndex,
    'visualIndex': visualIndex
  };
}

/**
 * 初始化首次范围
 * 动态分页一共有3页
 * 横版
 *   左中右 front middle back
 * 竖版
 *   上中下 front middle back
 * @return {[type]} [description]
 */
function initPointer(init, totalIndex) {
  var pointer = {};
  if (init === 0) {
    //首页
    pointer['middleIndex'] = init;
    pointer['backIndex'] = init + 1;
  } else if (init === totalIndex - 1) {
    //尾页
    pointer['middleIndex'] = init;
    pointer['frontIndex'] = init - 1;
  } else {
    //中间页
    pointer['frontIndex'] = init - 1;
    pointer['middleIndex'] = init;
    pointer['backIndex'] = init + 1;
  }
  return pointer;
}

/*
  转换页码索引
  direction 方向
  pointer 当前页码标示
  [17 18 19]  pagePointer
  [18 19 20]  转换后
  17 销毁
  20 创建
 */
function getActionPointer(direction, frontIndex, backIndex) {
  var createIndex = void 0; //创建的页
  var destroyIndex = void 0; //销毁的页
  switch (direction) {
    case 'prev':
      //前处理
      createIndex = frontIndex - 1;
      destroyIndex = backIndex;
      break;
    case 'next':
      //后处理
      createIndex = backIndex + 1;
      destroyIndex = frontIndex;
      break;
  }
  return { createIndex: createIndex, destroyIndex: destroyIndex };
}

function api(Swiper) {

  /**
   * 在column中滑动的时候，会丢失Direction
   * 具体就是flow在首页，而且chpater只有一个flow的情况下
   */
  Swiper.prototype.setDirection = function (value) {
    if (value !== undefined) {
      this.direction = value > 0 ? 'prev' : 'next';
    }
  };

  /**
   * 获取动作
   * 是翻页还是反弹
   * @return {[type]} [description]
   */
  Swiper.prototype.getActionType = function (touchX, touchY, duration, orientation) {
    orientation = orientation || this.orientation;
    if (orientation === 'h') {
      /**单独PPT页面内部滑动 */
      if (this.options.insideScroll) {
        //////////////////
        /// 判断是内部滑动
        //////////////////
        /*left/up* 并且不是前边界*/
        if (this.direction === 'prev' && this.distX < 0) {
          return 'flipMove';
        }
        /*right/down ,如果移动的距离小于页面宽度*/
        if (this.direction === 'next' && Math.abs(this.distX) < this.visualWidth) {
          return 'flipMove';
        }
        ///////////////////////////////
        /// 判断是单页面，强制打开了滑动
        /// 翻页强制改为反弹
        ///////////////////////////////
        if (!this.options.hasMultiPage) {
          return 'flipRebound';
        }
      }
      /*PPT页面之间的处理*/
      touchX = Math.abs(touchX);
      return duration < 200 && touchX > 30 || touchX > this.actualWidth / 6 ? 'flipOver' : 'flipRebound';
    } else if (orientation === 'v') {
      touchY = Math.abs(touchY);
      return duration < 200 && touchY > 30 || touchY > this.actualHeight / 6 ? 'flipOver' : 'flipRebound';
    }
  };

  /**
   * column的情况
   * 动态设置新的页面总数
   */
  Swiper.prototype.setLinearTotal = function (total, location) {

    //如果当前是column
    if (location === 'middle') {

      var borderIndex = void 0;
      //必须是有2页以上并且当前页面就是最后一页
      //如果分栏默认只分出1页的情况，后需要不全就跳过这个处理
      if (this.totalIndex > 1 && this.visualIndex == this.totalIndex - 1) {
        borderIndex = this.visualIndex;
      }

      this.totalIndex = total;

      //如果是最后一页，叠加新的页面
      //需要重写一些数据
      if (borderIndex !== undefined) {
        this.setPointer(borderIndex - 1, total);
        this._updatePointer();
      }
    }

    //如果左边是column页面
    //改变总页面数
    //改变可视区页面为最后页
    if (location === 'left') {
      this.totalIndex = total;
      this.visualIndex = total - 1;
      this.setPointer(this.visualIndex, total);
      this._updatePointer();
      //设置Transform的偏移量，为最后一页
      this._setTransform();
    }

    //如果是右边的column
    if (location === 'right') {
      this.totalIndex = total;
    }

    this._setContainerValue();
  };

  /**
   * 获取初始化距离值
   * @return {[type]} [description]
   */
  Swiper.prototype.getInitDistance = function () {
    return this._initDistance;
  };

  /**
   * 模拟完成状态调用
   * @return {[type]} [description]
   */
  Swiper.prototype.simulationComplete = function () {
    var _this = this;

    setTimeout(function () {
      _this._setRestore();
      _this.enable();
    });
  };

  /*启动滑动*/
  Swiper.prototype.enable = function () {
    this.enabled = true;
  };

  //禁止滑动
  Swiper.prototype.disable = function () {
    this.enabled = false;
  };

  /**
   * 是否锁定
   * @return {Boolean} [description]
   */
  Swiper.prototype.hasEnabled = function () {
    return this.enabled;
  };

  /**
   * 是否为边界
   * @param  {[type]}  distance [description]
   * @return {Boolean}          [description]
   */
  Swiper.prototype.isBorder = function () {
    this._borderBounce.apply(this, arguments);
  };

  /**
   * 获取移动状态
   * @return {Boolean} [description]
   */
  Swiper.prototype.getMoved = function () {
    return this._moved;
  };

  /**
   * 外部直接调用
   * 前翻页接口
   * callback 翻页完成
   * {
      speed,
      callback
    }
   */
  Swiper.prototype.prev = function () {
    var _this2 = this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        speed = _ref.speed,
        callback = _ref.callback;

    if (!this._borderBounce(1)) {

      var toNext = function toNext() {
        _this2._slideTo({ speed: speed, callback: callback, direction: 'prev', action: 'outer' });
      };

      /*启动了预加载模式*/
      if (config.launch.preload) {
        var status = requestInterrupt({
          type: 'linear',
          direction: 'prev',
          processed: function processed() {
            toNext();
            Xut.View.HideBusy();
          }
        }, this);
        /*如果还在预加载，禁止跳转*/
        if (status) {
          Xut.View.ShowBusy();
          return;
        }
      }

      /*正常跳页面*/
      toNext();
    } else {
      //边界反弹
      this._setRebound({ direction: 'next' });
      callback && callback();
    }
  };

  /**
   * 外部直接调用
   * 后翻页接口
   * Xut.View.GotoNextSlide
   * callback 翻页完成
   */
  Swiper.prototype.next = function () {
    var _this3 = this;

    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        speed = _ref2.speed,
        callback = _ref2.callback;

    if (!this._borderBounce(-1)) {

      var toNext = function toNext() {
        _this3._slideTo({ speed: speed, callback: callback, direction: 'next', action: 'outer' });
      };

      /*启动了预加载模式*/
      if (config.launch.preload) {
        var status = requestInterrupt({
          type: 'linear',
          direction: 'next',
          processed: function processed() {
            toNext();
            Xut.View.HideBusy();
          }
        }, this);
        /*如果还在预加载，禁止跳转*/
        if (status) {
          Xut.View.ShowBusy();
          return;
        }
      }

      /*正常模式*/
      toNext();
    } else {
      //边界反弹
      this._setRebound({
        direction: 'prev',
        isAppBoundary: true
      });
      callback && callback();
    }
  };

  /**
   * 获取当前页码
   * @return {[type]} [description]
   */
  Swiper.prototype.getVisualIndex = function () {
    return this.visualIndex;
  };

  /**
   * 主动设置页码编号
   * 因为分栏的关系，内部修改外部
   * 页面需要拼接
   */
  Swiper.prototype.setPointer = function (target, totalIndex) {
    this.pagePointer = initPointer(target, totalIndex || this.totalIndex);
  };

  /**
   * 获取页面Pointer
   * @return {[type]} [description]
   */
  Swiper.prototype.getPointer = function () {
    return this.pagePointer;
  };

  /**
   * 跳指定页面
   * @param  {[type]} targetIndex [description]
   * @param  {[type]} preMode     [description]
   * @param  {[type]} complete    [description]
   * @return {[type]}             [description]
   */
  Swiper.prototype.scrollToPage = function (targetIndex) {
    //目标页面

    //如果还在翻页中
    if (!this.enabled) return;

    var visualIndex = this.visualIndex; //当前页面

    /*跳转页面复位上一个页面的初始化坐标值*/
    this._setKeepDist(0, 0);

    //相邻页
    switch (targetIndex) {
      //前一页
      case visualIndex - 1:
        if (this.options.hasMultiPage) {
          return this.prev();
        }
        break;
      //首页
      case visualIndex:
        if (visualIndex == 0) {
          this.$$emit('onDropApp');
        }
        return;
      //后一页
      case visualIndex + 1:
        if (this.options.hasMultiPage) {
          return this.next();
        }
        break;
    }

    //算出是相关数据
    var data = calculationIndex(visualIndex, targetIndex, this.totalIndex);

    //更新页码索引
    this._updatePointer(data);
    data.pagePointer = this.pagePointer;

    this.$$emit('onJumpPage', data);
  };

  /**
   * 设置页面移动
   */
  Swiper.prototype._setPageMove = function (position, speed) {
    var distance = this.actualWidth * (position / 100) / 2;

    /*必须有效*/
    if (distance == 0) {
      return;
    }

    this.distX = this.distY = -distance;
    this._setKeepDist(this.distX, this.distY);

    var self = this;
    this._distributeMove({
      distance: this.distX,
      speed: speed,
      action: 'flipMove',
      /**
       * 是否无效函数
       * 如果无效，end方法抛弃掉
       * 必须是同步方法：
       * 动画不能在回调中更改状态，因为翻页动作可能在动画没有结束之前，所以会导致翻页卡住
       */
      setSwipeInvalid: function setSwipeInvalid() {
        self._isInvalid = true;
      }
    });
  };

  /**
   * 清理延时运行
   * @return {[type]} [description]
   */
  Swiper.prototype.clearDelayTimer = function () {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }
  };

  /**
   * 移动指定的距离
   * position 默认最右边
   * speed 默认3秒
   * delay 默认没有延时
   */

  Swiper.prototype.scrollToPosition = function () {
    var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;

    var _this4 = this;

    var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5000;
    var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    /*清理上一个延时*/
    this.clearDelayTimer();

    /*如果有延时运行*/
    /*这里没用动画的时间延时，因为运动中延时有问题*/
    if (delay) {
      this.delayTimer = setTimeout(function () {
        _this4.clearDelayTimer();
        _this4._setPageMove(position, speed);
      }, delay);
      return;
    }
    this._setPageMove(position, speed);
  };

  /**
   * 销毁所有
   * @return {[type]} [description]
   */
  Swiper.prototype.destroy = function () {
    this._off();
    this.$$unWatch();
    this.clearDelayTimer();
    if (this._childNodes) {
      this._childNodes.page = null;
      this._childNodes.master = null;
    }
    if (this.options.mouseWheel) {
      this.container.removeEventListener('wheel', this._onWheel, false);
      this.container.removeEventListener('mousewheel', this._onWheel, false);
      this.container.removeEventListener('DOMMouseScroll', this._onWheel, false);
    }
    this.container = null;
  };

  /**
   * 调用动画完成
   * @param {[type]} element [description]
   */
  Swiper.prototype.setTransitionComplete = function () {
    this._distributeComplete.apply(this, arguments);
  };

  /**
   * 目标元素
   * 找到li元素
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  Swiper.prototype.findBubbleRootNode = function (point, pageType) {
    var liNode = void 0,
        pageChpaterIndex = void 0;
    var visualIndex = this.visualIndex;
    var sectionRang = this.options.sectionRang;

    //找到对应的li
    var childNodes = this._childNodes[pageType].childNodes;
    var nodeTotal = childNodes.length;

    while (nodeTotal--) {
      liNode = childNodes[nodeTotal];
      pageChpaterIndex = liNode.getAttribute('data-chapter-index');
      if (sectionRang) {
        visualIndex += sectionRang.start;
      }
      if (pageChpaterIndex == visualIndex) {
        return liNode;
      }
      visualIndex = this.visualIndex;
    }
  };
}

var LINEARTAG = 'data-linearVisual';

function init(Swiper) {

  Swiper.prototype._init = function () {
    this._initMode();
    this._initEvents();
    this._initPrevent();
    if (this.options.mouseWheel) {
      this._initWheel();
    }
  };

  /*基本模式设置*/
  Swiper.prototype._initMode = function () {
    /*分段模式*/
    if (this.options.snap) {
      //用于查找跟元素
      //ul => page
      //ul => master
      var ul = this.container.querySelectorAll('ul');
      if (!ul.length) {
        $warn(" ul element don't found !");
      } else {
        this._childNodes = {
          page: ul[0],
          master: ul[1]
        };
      }
    }

    /*父容器滑动模式*/
    if (this.options.scope === 'parent') {
      if (this.options.scrollX) {
        this.container.setAttribute(LINEARTAG, true);
        this._setTransform();
        this._setContainerValue();
      } else if (this.options.scrollY) {
        this.options.scrollerMode = true;

        /*竖版处理,滚动容器*/
        this.scroller = this.container.children[0];
        this.scrollerStyle = this.scroller.style;
        /*最大溢出高度*/
        this.wrapperHeight = this.container.clientHeight;
        this.maxScrollY = this.wrapperHeight - this.scroller.offsetHeight;
        this._setTransform(this.scroller);
        this._setContainerValue(this.scroller);
      }
    }
  };

  /*默认行为*/
  Swiper.prototype._initPrevent = function () {
    this._stopDefault = this.options.preventDefault ? function (e) {
      e.preventDefault && e.preventDefault();
    } : function () {};
  };

  /**
   * 设置初始的
   */
  Swiper.prototype._setTransform = function (element) {
    this._initDistance = -this.visualIndex * this._getRollVisual();
    if (element) {
      Xut.style.setTranslate({
        y: this._initDistance,
        node: element
      });
    } else {
      Xut.style.setTranslate({
        x: this._initDistance,
        node: this.container
      });
    }
  };

  /**
   * 设置容易溢出的尺寸
   */
  Swiper.prototype._setContainerValue = function (element) {
    if (element) {
      element.style.height = this.actualHeight * this.totalIndex + 'px';
    } else {
      this.container.style.width = this.actualWidth * this.totalIndex + 'px';
    }
  };

  /**
   * 绑定事件
   */
  Swiper.prototype._initEvents = function () {
    var callback = {
      start: this,
      end: this,
      cancel: this,
      leave: this
    };

    if (this.options.banMove) {
      //移动被锁定，不绑定滑动事件
    } else if (this.options.hasMultiPage) {
      //不需要绑定transitionend，会设置手动会触发
      callback.move = this;
      callback.transitionend = this;
    }

    /*如果内部滚动模式打开了，必须强制绑定move*/
    if (!callback.move && this.options.insideScroll) {
      callback.move = this;
    }

    $on(this.container, callback);
  };

  /*滚轮*/
  Swiper.prototype._initWheel = function () {
    this.container.addEventListener('wheel', this._onWheel.bind(this), false);
    this.container.addEventListener('mousewheel', this._onWheel.bind(this), false);
    this.container.addEventListener('DOMMouseScroll', this._onWheel.bind(this), false);
  };
}

/*翻页速率*/
var FLIPSPEED = 600;

function slide(Swiper) {

  Swiper.prototype._transitionTime = function (time) {
    time = time || 0;
    var durationProp = Xut.style.transitionDuration;
    if (!durationProp) {
      return;
    }
    this.scrollerStyle[durationProp] = time + 'ms';
  };

  Swiper.prototype._transitionTimingFunction = function (easing) {
    this.scrollerStyle[Xut.style.transitionTimingFunction] = easing;
  };

  /**
   * 滑动内部页面
   */
  Swiper.prototype._translate = function (x, y) {
    /*父容器滑动模式*/
    if (this.options.scope === 'parent') {
      if (this.options.scrollY) {
        Xut.style.setTranslate({ y: y, node: this.scroller });
      }
    }
    /*更新坐标*/
    this.x = x;
    this.y = y;
  };

  /**
   * 获取滚动的尺寸
   */
  Swiper.prototype._getRollVisual = function () {
    var orientation = this.orientation;
    if (orientation) {
      return this.orientation === 'h' ? this.actualWidth : this.actualHeight;
    }
    //在flow初始化时候，在边界往PPT滑动，是没有值的，所以需要通过全局参数判断
    return this.options.scrollX ? this.actualWidth : this.actualHeight;
  };

  /**
   * 获取滚动的距离值
   * 获取用户在页面滑动的距离
   * flow页面
   * 修复2个问题
   *  1 交界处，没有生成全局翻页的dist的值
   *  2 flow内部，滑动鼠标溢出了浏览器，会卡死
   */
  Swiper.prototype._getRollDist = function () {
    var dist = this.orientation === 'h' ? this.distX : this.distY;
    var visualSize = this._getRollVisual();

    /*这是一个bug,临时修复
    如果一开始布局的页面在flow的首位交界的位置，那么往前后翻页
    在全局中还没有产生dist的值，所以这里强制用一个基本值处理*/
    if (dist === undefined) {
      return visualSize / 1.2;
    }

    dist = Math.abs(dist);

    /**
     * 同样在flow中间页，快速用鼠标滑动到app页面外面部分
     * 会产生dist 大于可视区宽度是情况
     * 浏览器调试模式下会出现
     * 会导致动画回到不触发卡死
     * 因为flow的情况下，没有做定时器修复，所以这里强制给一个时间
     */
    if (dist > visualSize) {
      dist = visualSize / 2;
    }

    return Math.abs(dist);
  };

  /**
   * 快速翻页时间计算
   */
  Swiper.prototype._setRate = function () {
    this._speedRate = 50 / this._getRollVisual();
    this._isQuickTurn = true;
  };

  /**
   * 复位速率
   */
  Swiper.prototype._resetRate = function () {
    this._speedRate = this._originalRate;
    this._isQuickTurn = false;
  };

  /**
   * 判断是否快速翻页
   * 如果是快速翻页
   * 重设置_setRate
   */
  Swiper.prototype._setQuick = function () {
    var startDate = Swiper.getDate();
    if (this._preTapTime) {
      if (startDate - this._preTapTime < FLIPSPEED) {
        this._setRate();
      }
    }
    this._preTapTime = Swiper.getDate();
  };

  /**
   * 边界控制
   */
  Swiper.prototype._isBorder = function (direction) {
    var overflow = void 0;
    var pointer = this.pagePointer;
    var fillength = Object.keys(pointer).length;
    switch (direction) {
      case 'prev':
        //前翻页
        overflow = pointer.middleIndex === 0 && fillength === 2 ? true : false;
        break;
      case 'next':
        //后翻页
        overflow = pointer.middleIndex === this.totalIndex - 1 && fillength === 2 ? true : false;
        break;
    }
    return overflow;
  };

  /**
   * 获取翻页结束的speed的速率
   */
  Swiper.prototype._getFlipOverSpeed = function () {
    var speed = (this._getRollVisual() - this._getRollDist()) * this._speedRate;
    if (speed === undefined) {
      speed = this._defaultFlipTime;
    }
    return speed;
  };

  /**
   * 如果是通过接口翻页的
   * 就需要计算出2次翻页的点击速率
   * 可能是快速翻页
   * @return {[type]} [description]
   */
  Swiper.prototype._getOuterSpeed = function (action) {
    var speed = undefined;

    /*外部调用，比如左右点击案例，需要判断点击的速度*/
    if (action === 'outer') {
      /*如果是第二次开始同一个点击动作*/
      if (action === this._recordRreTick.action) {
        /*最大的点击间隔时间不超过默认的_defaultFlipTime时间，最小的取间隔时间*/
        var time = Swiper.getDate() - this._recordRreTick.time;
        if (time <= this._defaultFlipTime) {
          speed = time;
        } else {
          speed = this._defaultFlipTime;
        }
      }
      /*点击时间啊*/
      this._recordRreTick.time = Swiper.getDate();

      /*外部调用，第一次没有速度，就用默认的*/
      if (speed === undefined) {
        speed = this._defaultFlipTime;
      }
    }

    /*保存每次点击动作*/
    this._recordRreTick.action = action;

    return speed;
  };

  /**
   * 滑动到上下页面
   * 需要区分是否快速翻页
   * 这里有内部翻页跟外部接口调用的处理
   * 内部翻页存在了speed算法
   * 外部翻页需要通过点击的时间差计算
   * direction
   *   "perv" / "next"
   * action
   *   1. inner 用户直接翻页滑动触发，提供hasTouch
   *   2. outer 通过接口调用翻页
   */
  Swiper.prototype._slideTo = function (_ref) {
    var _this = this;

    var speed = _ref.speed,
        action = _ref.action,
        direction = _ref.direction,
        callback = _ref.callback;


    //如果在忙碌状态,如果翻页还没完毕
    if (!this.enabled) {
      return;
    }

    /*外部调用，direction需要更新
    内部调用赋予direction*/
    if (direction) {
      this.direction = direction;
    } else {
      direction = this.direction;
    }

    /**
     * _slideTo => Swipe.prototype.next => Xut.View.GotoNextSlide
     *如果行为一致,并且是外部接口调用，
     *需要手动计算出滑动的speed
     *  inner 用户内部滑动
     *  outer 外部接口调用
     */
    var outerSpeed = speed || this._getOuterSpeed(action);

    /*是外部调用触发接口
    提供给翻页滑动使用*/
    var outerCallFlip = outerSpeed === undefined ? false : true;

    //前后边界
    if (this.options.snap && this._isBorder(direction)) return;

    this.disable();
    this._setQuick();

    /**
     * 监听内部翻页，通过接口调用
     * 需要翻页结束后触发外部通知，绑定一次
     */
    if (callback) {
      this.$$once('_slideFlipOver', callback);
    }

    var distance = 0;

    /*如果启动了内部模式滑动，然后往前翻页，就应该是一半的尺寸，而不是0*/
    if (this.options.insideScroll && this.direction === 'prev') {
      distance = -(this.actualWidth / 2);
    }

    this._distributeMove({
      distance: distance,
      'speed': outerSpeed || this._getFlipOverSpeed(),
      'action': 'flipOver',
      direction: direction,
      outerCallFlip: outerCallFlip
    });

    /*更新数据，触发停止动作*/
    setTimeout(function () {
      _this._updateActionPointer();
      /*手指移开屏幕*/
      _this.$$emit('onEnd', _this.pagePointer);
      _this._updateVisualIndex(_this.pagePointer.middleIndex);
    }, 0);
  };

  /**
   * 增加索引的动作
   * 修正页码指示
   */
  Swiper.prototype._updateActionPointer = function () {

    var pointer = this.pagePointer;

    //获取动作索引
    var actionPointer = getActionPointer(this.direction, pointer.frontIndex, pointer.backIndex);

    var createIndex = actionPointer.createIndex;
    var stopIndex = pointer.middleIndex;

    switch (this.direction) {
      case 'prev':
        if (-1 < createIndex) {
          //首页情况
          this._updatePointer(createIndex, pointer.frontIndex, pointer.middleIndex);
        }
        if (-1 === createIndex) {
          this.pagePointer.backIndex = pointer.middleIndex;
          this.pagePointer.middleIndex = pointer.frontIndex;
          delete this.pagePointer.frontIndex;
        }
        break;
      case 'next':
        if (this.totalIndex > createIndex) {
          this._updatePointer(pointer.middleIndex, pointer.backIndex, createIndex);
        }
        if (this.totalIndex === createIndex) {
          //如果是尾页
          this.pagePointer.frontIndex = pointer.middleIndex;
          this.pagePointer.middleIndex = pointer.backIndex;
          delete this.pagePointer.backIndex;
        }
        break;
    }

    //更新页面索引标识
    this.pagePointer.createIndex = createIndex;
    this.pagePointer.destroyIndex = actionPointer.destroyIndex;
    this.pagePointer.stopIndex = stopIndex;
  };
}

function distribute$1(Swiper) {

  /**
   * 处理松手后滑动
   * pageIndex 页面
   * distance  移动距离
   * speed     时间
   * viewTag   可使区标记
   * follow    是否为跟随滑动
   * @return {[type]} [description]
   */
  Swiper.prototype._distributeMove = function (data) {
    data.direction = this.direction;
    data.orientation = this.orientation;

    /*页码索引标识*/
    var pointer = this.pagePointer;
    data.frontIndex = pointer.frontIndex;
    data.backIndex = pointer.backIndex;
    data.middleIndex = this.visualIndex;
    this.$$emit('onMove', data);
  };

  /*
  翻页结束后，派发动作完成事件
  1 还原动作参数
  2 触发翻页的内部事件监听
  3 延长获取更pagePointer的更新值，并且解锁
   */
  Swiper.prototype._distributeComplete = function () {
    var _this = this;

    this._setRestore.apply(this, arguments);
    /*触发翻页结束，通过slideTo绑定*/
    this.$$emit('_slideFlipOver');
    var callback = function callback() {
      return _this.enable();
    };
    setTimeout(function () {
      _this.$$emit('onComplete', {
        unlock: callback,
        direction: _this.direction,
        pagePointer: _this.pagePointer,
        isQuickTurn: _this._isQuickTurn
      });
    }, 50);
  };
}

/***********************
        惯性算法
************************/

var transitionDuration$2 = Xut.style.transitionDuration;

var ABS = Math.abs;

/**
 * 是否多点触发
 * @return {Boolean} [description]
 */
var hasMultipleTouches = function hasMultipleTouches(e) {
  return e.touches && e.touches.length > 1;
};

/**
 * 自定义事件类型
 * onSwipeDown 触屏点击
 * onSwipeMove 触屏移动
 * onSwipeUp   触屏松手
 * onSwipeUpSlider触屏松手 滑动处理
 * onFlipSliding 松手动画（反弹）
 * onFlipRebound 执行反弹
 * _onComplete 动画完成
 * onDropApp 退出应用
 */

var Swiper = function (_Observer) {
  inherits(Swiper, _Observer);
  createClass(Swiper, null, [{
    key: 'mixProperty',
    value: function mixProperty(target, src) {
      for (var key in src) {
        target[key] = src[key];
      }
    }
  }, {
    key: 'getDate',
    value: function getDate() {
      return +new Date();
    }

    /**
     * 静态方法，获取基本配置
     * @return {[type]} [description]
     */

  }, {
    key: 'getConfig',
    value: function getConfig() {
      /*提供swiperConfig快速配置文件,关键配置*/
      var scrollX = true;
      var scrollY = false;
      if (config.launch.scrollMode === 'v') {
        scrollX = false;
        scrollY = true;
      }
      return {
        scrollY: scrollY,
        scrollX: scrollX,
        banMove: config.launch.banMove
      };
    }

    /**
     * 2种大模式
     * 1 分段，分变化
     * 2 分段，不分变化
     * @type {String}
     */

  }]);

  function Swiper(_ref) {
    var _ref$scope = _ref.scope,
        scope = _ref$scope === undefined ? 'child' : _ref$scope,
        _ref$snap = _ref.snap,
        snap = _ref$snap === undefined ? true : _ref$snap,
        _ref$snapSpeed = _ref.snapSpeed,
        snapSpeed = _ref$snapSpeed === undefined ? 800 : _ref$snapSpeed,
        _ref$banMove = _ref.banMove,
        banMove = _ref$banMove === undefined ? false : _ref$banMove,
        _ref$momentum = _ref.momentum,
        momentum$$1 = _ref$momentum === undefined ? true : _ref$momentum,
        _ref$scrollX = _ref.scrollX,
        scrollX = _ref$scrollX === undefined ? true : _ref$scrollX,
        _ref$scrollY = _ref.scrollY,
        scrollY = _ref$scrollY === undefined ? false : _ref$scrollY,
        _ref$mouseWheel = _ref.mouseWheel,
        mouseWheel = _ref$mouseWheel === undefined ? false : _ref$mouseWheel,
        _ref$hasHook = _ref.hasHook,
        hasHook = _ref$hasHook === undefined ? false : _ref$hasHook,
        _ref$borderBounce = _ref.borderBounce,
        borderBounce = _ref$borderBounce === undefined ? true : _ref$borderBounce,
        _ref$stopPropagation = _ref.stopPropagation,
        stopPropagation = _ref$stopPropagation === undefined ? false : _ref$stopPropagation,
        _ref$preventDefault = _ref.preventDefault,
        preventDefault = _ref$preventDefault === undefined ? true : _ref$preventDefault,
        _ref$insideScroll = _ref.insideScroll,
        insideScroll = _ref$insideScroll === undefined ? false : _ref$insideScroll,
        container = _ref.container,
        visualIndex = _ref.visualIndex,
        totalIndex = _ref.totalIndex,
        actualWidth = _ref.actualWidth,
        actualHeight = _ref.actualHeight,
        hasMultiPage = _ref.hasMultiPage,
        sectionRang = _ref.sectionRang,
        visualWidth = _ref.visualWidth;
    classCallCheck(this, Swiper);

    /*加强判断，如果*/
    var _this = possibleConstructorReturn(this, (Swiper.__proto__ || Object.getPrototypeOf(Swiper)).call(this));

    if (insideScroll) {
      if (!visualWidth || visualWidth && actualWidth < visualWidth) {
        insideScroll = false;
        $warn('启动了insideScroll，但是条件还不成立');
      }
    }

    Swiper.mixProperty(_this, {
      container: container,
      visualIndex: visualIndex,
      totalIndex: totalIndex,
      actualWidth: actualWidth,
      actualHeight: actualHeight,
      visualWidth: visualWidth
    });

    _this.options = {
      scope: scope,
      snap: snap,
      banMove: banMove,
      scrollX: scrollX,
      scrollY: scrollY,
      momentum: momentum$$1,
      mouseWheel: mouseWheel,
      insideScroll: insideScroll,
      hasHook: hasHook,
      borderBounce: borderBounce,
      stopPropagation: stopPropagation,
      preventDefault: preventDefault,
      hasMultiPage: hasMultiPage,
      sectionRang: sectionRang
    };

    /**
     * 滑动的方向
     * 横版：prev next (left/right)
     * 竖版：prev next (up/down)
     */
    _this.direction = '';

    /*默认允许滑动*/
    _this.enabled = true;

    /*翻页时间*/
    _this._defaultFlipTime = banMove ? 0 : snapSpeed;

    /*翻页速率*/
    _this._speedRate = _this._originalRate = _this._defaultFlipTime / (scrollX ? actualWidth : actualHeight);

    /*计算初始化页码*/
    _this.pagePointer = initPointer(visualIndex, totalIndex);

    /*标记上一个翻页动作*/
    _this._recordRreTick = { ation: null, time: null };

    _this._init();

    /*保存上次滑动值*/
    _this.keepDistX = 0;
    _this.keepDistY = 0;

    /*内部滑动页面，优化边界的敏感度*/
    _this.insideScrollRange = {
      min: visualWidth * 0.01,
      max: visualWidth - visualWidth * 0.01
    };

    return _this;
  }

  /**
   * 事件处理
   */


  createClass(Swiper, [{
    key: 'handleEvent',
    value: function handleEvent(e) {
      this.options.stopPropagation && e.stopPropagation();
      $handle({
        start: function start(e) {
          //如果没有配置外部钩子
          if (!this.options.hasHook) {
            this._stopDefault(e);
          }
          this._onStart(e);
        },
        move: function move(e) {
          this._stopDefault(e);
          this._onMove(e);
        },
        end: function end(e) {
          if (!this.options.hasHook) {
            this._stopDefault(e); //超链接有影响
          }
          this._onEnd(e);
        },
        transitionend: function transitionend(e) {
          this._stopDefault(e);
          this._onComplete(e);
        }
      }, this, e);
    }

    /**
     * 触发页面
     */

  }, {
    key: '_onStart',
    value: function _onStart(e) {

      //如果停止滑动
      //或者多点触发
      if (!this.enabled || hasMultipleTouches(e)) {
        return;
      }

      //判断双击速度
      //必须要大于350
      var currtTime = Swiper.getDate();
      if (this._clickTime) {
        if (currtTime - this._clickTime < 350) {
          return;
        }
      }
      this._clickTime = currtTime;

      var interrupt = void 0;
      var point = $event(e);

      /*如果没有事件对象*/
      if (!point) {
        this._stopped = true;
        return;
      }

      /**
       * 获取观察对象
       * 钩子函数
       * point 事件对象
       * @return {[type]} [description]
       */
      this.$$emit('onFilter', function () {
        interrupt = true;
      }, point, e);

      /*打断动作*/
      if (interrupt) return;

      /*针对拖拽翻页阻止是否滑动事件受限*/
      this._stopped = false; //如果页面停止了动作，触发
      this._banBounce = false; //是否有禁止了反弹
      this._hasTap = true; //点击了屏幕
      this._isInvalid = false; //无效的触发
      this._moved = false; /*是否移动中*/
      this._behavior = 'swipe'; //用户行为

      /*锁定滑动相反方向*/
      this._directionBan = false;

      /*滑动方向*/
      this.orientation = '';

      this.distX = 0;
      this.distY = 0;

      /*手指触碰屏幕移动的距离，这个用于反弹判断*/
      this.touchX = 0;
      this.touchY = 0;

      this.pointX = point.pageX;
      this.pointY = point.pageY;

      /*每次滑动第一次触碰页面的实际移动坐标*/
      this.firstMovePosition = 0;

      this.startTime = Swiper.getDate();
    }

    /**
     * 移动
     */

  }, {
    key: '_onMove',
    value: function _onMove(e) {

      //如果停止翻页
      //或者没有点击
      //或是Y轴滑动
      //或者是阻止滑动
      if (!this.enabled || !this._hasTap || this._stopped) return;

      this._moved = true;

      var point = $event(e);

      /*每次滑动的距离*/
      var deltaX = point.pageX - this.pointX;
      var deltaY = point.pageY - this.pointY;
      var absDistX = ABS(deltaX);
      var absDistY = ABS(deltaY);

      /**
       * 判断锁定横竖版滑动
       * 只锁定一次
       * 因为在滑动过程中，
       * 用户的手指会偏移方向，
       * 比如开始是h滑动，在中途换成v了，但是还是锁定h
       */
      var $delta = void 0,
          $absDelta = void 0;
      if (absDistX > absDistY) {
        if (!this.orientation) {
          this.orientation = 'h';
        }
        $delta = deltaX;
        $absDelta = absDistX;
      } else if (absDistY >= absDistX) {
        if (!this.orientation) {
          this.orientation = 'v';
        }
        $delta = deltaY;
        $absDelta = absDistY;
      }

      /**
       * 1.相反方向禁止滑动
       * 2.提供给sendTrackCode使用
       *     猜测用户的意图，滑动轨迹小于80,想翻页
       *     猜测用户相反的方向意向
       *     比如横屏的时候，用户想竖屏上下滑动翻页
       *     竖屏的时候，用户想横屏左右翻页
       *     如果继续保持了Y轴移动，记录下最大偏移量算不算上下翻页动作
       */
      if (this.options.scrollX && this.orientation === 'v') {
        //左右翻页，猜测上下翻页
        if ($absDelta > 80) {
          this._behavior = 'reverse';
        }
        this._directionBan = 'v';
      } else if (this.options.scrollY && this.orientation === 'h') {
        //上下翻页，猜测左右翻页
        if ($absDelta > 80) {
          this._behavior = 'reverse';
        }
        this._directionBan = 'h';
      }

      /*滑动距离*/
      var $dist = void 0;
      if (this.orientation === 'h') {
        this.touchX = this._getDist(deltaX, absDistX);
        $dist = this.distX = this.touchX + this.keepDistX;
        this.setDirection(deltaX);
      } else if (this.orientation === 'v') {
        this.touchY = this._getDist(deltaY, absDistY);
        $dist = this.distY = this.touchY + this.keepDistY;
        this.setDirection(deltaY);
      }

      /*锁定*/
      if (this._directionBan) return;

      /*
       * 减少抖动
       * 算一次有效的滑动
       * 移动距离必须20px才开始移动
       */
      var delayDist = 10;
      var distance = $dist;
      if ($absDelta <= delayDist) return;

      /**
       * 因为抖动优化的关系，需要重新计算distX distY的值
       */
      if (this.direction === 'prev') {
        //正值递增
        distance = this.distX = this.distY = $dist - delayDist;
      } else if (this.direction === 'next') {
        //负值递增
        distance = this.distX = this.distY = $dist + delayDist;
      }

      var self = this;
      this._distributeMove({
        distance: distance,
        speed: 0,
        action: 'flipMove',
        /**
         * 因为模式5的情况下，判断是否是边界，需要获取正确的页面值才可以
         * 所以移动页面在反弹计算之后，所以必须在延后 movePageBases中判断是否为反弹
         */
        setPageBanBounce: function setPageBanBounce(position) {

          /*如果没有启动边界反弹*/
          if (!self.options.borderBounce) {
            /*如果是到边界了，就禁止反弹*/
            if (self._banBounce = self._borderBounce(position)) {
              return true;
            }
          }

          /*模式5下，边界翻页的敏感度处理*/
          if (self.options.insideScroll) {

            var absPosition = Math.abs(position);

            /*只判断每次移动的，第一次触碰*/
            if (!self.firstMovePosition) {
              self.firstMovePosition = absPosition;
            }

            if (self.direction === 'next') {
              if (absPosition >= self.visualWidth) {
                if (self.firstMovePosition > self.insideScrollRange.max) {

                  /*如果是单页面，并且右边移动溢出了，这需要处理*/
                  if (!self.options.hasMultiPage) {
                    self._setKeepDist(-self.visualWidth, 0);
                    self._banBounce = true;
                    return true;
                  }

                  /*如果是在尾部边界的位置翻页，是被允许的*/
                  return false;
                } else {
                  /*其余位置都是被禁止翻页的*/
                  self._setKeepDist(-self.visualWidth, 0);
                  self._banBounce = true;
                  return true;
                }
              }
            } else if (self.direction === 'prev') {
              // 边界
              if (position >= 0) {
                if (self.firstMovePosition < self.insideScrollRange.min) {
                  return false;
                } else {
                  self._setKeepDist(0, 0);
                  self._banBounce = true;
                  return true;
                }
              }
            }
          }
        },

        /**
         * 是否无效函数
         * 如果无效，end方法抛弃掉
         * 必须是同步方法：
         * 动画不能在回调中更改状态，因为翻页动作可能在动画没有结束之前，所以会导致翻页卡住
         */
        setSwipeInvalid: function setSwipeInvalid() {
          self._isInvalid = true;
        }
      });
    }

    /**
     * 翻页松手
     */

  }, {
    key: '_onEnd',
    value: function _onEnd(e) {

      /*停止滑动，或者多点触发，或者是边界，或者是停止翻页*/
      if (!this.enabled || this._banBounce || this._stopped || hasMultipleTouches(e)) {
        return;
      }

      this._hasTap = this._moved = false;

      var duration = void 0;

      /*可能没有点击页面，没有触发start事件*/
      if (this.startTime) {
        duration = Swiper.getDate() - this.startTime;
      }

      /*滑动距离、滑动方向*/
      var distX = ABS(this.distX);
      var distY = ABS(this.distY);
      var orientation = this.orientation;

      /*如果没有滚动页面，判断为点击*/
      if (!distX && !distY) {
        var isReturn = false;
        this.$$emit('onTap', this.visualIndex, function () {
          return isReturn = true;
        }, e, duration);
        if (isReturn) return;
      }

      /*如果是Y轴移动，发送请求,并且不是mouseleave事件，在PC上mouseleave离开非可视区重复触发*/
      if (this._behavior === 'reverse' && e.type !== 'mouseleave') {
        config.sendTrackCode('swipe', {
          'direction': orientation,
          'pageId': this.visualIndex + 1
        });
      }

      /**
       * 锁定滑动
       * 1 横版模式下，如果有Y滑动，但是如果没有X的的变量，就判断无效
       * 1 竖版模式下，如果有X滑动，但是如果没有Y的的变量，就判断无效
       */
      if (this._directionBan === 'v' && !this.distX) {
        return;
      } else if (this._directionBan === 'h' && !this.distY) {
        return;
      }

      /**
       * mini功能，合并翻页时事件
       * move的情况会引起
       * 如果是无效的动作，则不相应
       * 还原默认设置
       */
      if (this._isInvalid) {
        var hasSwipe = void 0;
        if (orientation === 'h') {
          hasSwipe = duration < 200 && distX > this.actualWidth / 10;
        } else if (orientation === 'v') {
          hasSwipe = duration < 200 && distY > this.actualHeight / 10;
        }
        if (hasSwipe) {
          this._distributeMove({ action: 'swipe' });
        }
        this._setRestore();
        return;
      }

      /**
       * 动作推测
       * 1 翻页或者反弹，或者移动
       * 2 这里要区分PPT之间，与PPT内部滑动
       */
      var actionType = this.getActionType(this.touchX, this.touchY, duration);

      /**
       * 单独控制翻页的预加载检测
       * 如果还在预加载中，强制翻页为反弹
       * 然后记录动作，等加载结束后处理
       */
      if (actionType === 'flipOver' && config.launch.preload) {
        var status = requestInterrupt({
          type: 'linear',
          direction: this.direction,
          /*预加载加载结束*/
          processed: function processed() {
            this._nextAction('flipOver');
            Xut.View.HideBusy();
          }
        }, this);

        /*如果还在预加载，执行反弹与等待*/
        if (status) {
          Xut.View.ShowBusy();
          actionType = 'flipRebound';
        }
      }

      /*正常松手后动作处理*/
      this._nextAction(actionType);
    }

    /**
     * 执行松手后的动作
     */

  }, {
    key: '_nextAction',
    value: function _nextAction(actionType) {

      /*如果是首位页面，直接反弹*/
      if (this._isFirstOrEnd()) {
        /*如果是是内部滚动模式，而且还是最后一页*/
        if (this.options.insideScroll) {
          if (this.direction === 'next') {
            if (actionType === 'flipMove') {
              /*如果是向后移动，更新distX*/
              this._setKeepDist(this.distX, this.distY);
            } else if (actionType === 'flipOver' || actionType === 'flipRebound') {
              /*如果是向后移动反弹*/
              var distance = -(this.actualWidth / 2);
              this._setRebound({ distance: distance });
              this._setKeepDist(distance);
            }
          } else if (this.direction === 'prev') {
            /*向前翻页，反弹或者翻页，都强制设置反弹*/
            var _distance = 0;
            this._setRebound({ distance: _distance });
            this._setKeepDist(_distance);
          }
          return;
        }
        this._setKeepDist();
        this._setRebound();
      } else if (actionType === 'flipOver') {
        /*如果是翻页动作*/
        this._setKeepDist();
        this._slideTo({ action: 'inner' });
      } else if (actionType === 'flipRebound') {
        /*如果启动了insideScroll*/
        if (this.options.insideScroll) {
          /*并且是后往回方向反弹，那么反弹的距离只有一半*/
          if (this.direction === 'next') {
            var _distance2 = -(this.actualWidth / 2);
            this._setRebound({ distance: _distance2 });
            this._setKeepDist(_distance2);
          } else if (this.direction === 'prev') {
            /*前反弹，设置为开始值*/
            var _distance3 = 0;
            this._setRebound({ distance: _distance3 });
            this._setKeepDist(_distance3);
          }
        } else {
          /*正常单页PPT的反弹*/
          this._setRebound();
        }
      } else if (actionType === 'flipMove') {
        /*如果还是内部移动*/
        this._setKeepDist(this.distX, this.distY);
      }
    }

    /**
     * 设置Keep
     * @return {[type]} [description]
     */

  }, {
    key: '_setKeepDist',
    value: function _setKeepDist() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      this.keepDistX = x;
      this.keepDistY = y;
    }

    /*
    判断是不是首位页面，直接反弹
    如果是首尾
    如果是liner模式排除
    */

  }, {
    key: '_isFirstOrEnd',
    value: function _isFirstOrEnd(actionType) {
      if (this.options.snap) {
        if (this.orientation === 'h') {
          return !this.visualIndex && this.distX > 0 || this.visualIndex == this.totalIndex - 1 && this.distX < 0;
        }
        if (this.orientation === 'v') {
          return !this.visualIndex && this.distY > 0 || this.visualIndex == this.totalIndex - 1 && this.distY < 0;
        }
      } else {
        return false;
      }
    }

    /**
     * 鼠标滚动
     * win 平台鼠标每次滑动一次产生一次变化
     * mac 平台带有惯性
     * @return {[type]} [description]
     */

  }, {
    key: '_onWheel',
    value: function _onWheel(e) {

      e.preventDefault();
      e.stopPropagation();

      var wheelDeltaX = void 0,
          wheelDeltaY = void 0;

      if ('deltaX' in e) {
        wheelDeltaX = -e.deltaX;
        wheelDeltaY = -e.deltaY;
      } else if ('wheelDeltaX' in e) {
        wheelDeltaX = e.wheelDeltaX;
        wheelDeltaY = e.wheelDeltaY;
      } else if ('wheelDelta' in e) {
        wheelDeltaX = wheelDeltaY = e.wheelDelta;
      } else if ('detail' in e) {
        wheelDeltaX = wheelDeltaY = -e.detail;
      } else {
        return;
      }

      /*强制修复滑动的方向是上下
      因为在页面中左右滑动一下，这个值被修改
      后续就会报错*/
      this.orientation = 'v';

      this.$$emit('onWheel', e, wheelDeltaY);

      return;
    }

    /**
     * 翻页结束
     */

  }, {
    key: '_onComplete',
    value: function _onComplete(e) {

      var node = e.target;
      /*page与master*/
      var pageType = node.getAttribute('data-type');
      /*可能存在多组动画回调，只找到标记data-visual的页面，可视窗口*/
      var isVisual = node.getAttribute('data-visual');
      /*线性的布局方式，cloumn使用*/
      var isLinearVisual = node.getAttribute(LINEARTAG);

      this._removeDuration(node);

      //cloumn流式布局处理
      if (isLinearVisual && !isVisual) {
        this._distributeComplete(node, isVisual);
        return;
      }

      //反弹效果,未翻页
      //页面与母版都不触发回调
      if (!isVisual) {
        //只针对母板处理
        if (!pageType) {
          this.$$emit('onMasterMove', this.visualIndex, node);
        }
        return;
      }

      this._distributeComplete(node, isVisual);
    }

    /**
     * 获取移动距离
     */

  }, {
    key: '_getDist',
    value: function _getDist(value, absDist) {
      return value / (!this.visualIndex && value > 0 || // 在首页
      this.visualIndex == this.totalIndex - 1 && // 尾页
      value < 0 // 中间
      ? absDist / this.actualWidth + 1 : 1);
    }

    /**
     * 前尾边界反弹判断
     */

  }, {
    key: '_borderBounce',
    value: function _borderBounce(position) {
      //首页,并且是左滑动
      if (this.visualIndex === 0 && position > 0) {
        /*到首页边界，end事件不触发，还原内部的值*/
        this._setKeepDist(0, 0);
        return true;
      } else if (this.visualIndex === this.totalIndex - 1 && position < 0) {
        //尾页
        return true;
      }
    }

    /**
     * 设置反弹
     * isBoundary ##317
     * 边界后反弹，最后一页刚好有是视觉差，反弹不归位
     * 这里要强制处理
     * 外部接口可以设置参数
     */

  }, {
    key: '_setRebound',
    value: function _setRebound() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref2$distance = _ref2.distance,
          distance = _ref2$distance === undefined ? 0 : _ref2$distance,
          direction = _ref2.direction,
          isAppBoundary = _ref2.isAppBoundary;

      this._distributeMove({
        direction: direction || this.direction, //方向
        distance: distance, //反弹的位置
        isAppBoundary: isAppBoundary, //是边界后，反弹回来的
        'speed': 300,
        'action': 'flipRebound'
      });
    }

    /*去掉动画时间*/

  }, {
    key: '_removeDuration',
    value: function _removeDuration(node) {
      if (node) {
        node.style[transitionDuration$2] = '';
      }
    }

    /**
     * 还原设置
     * 1 针对拖拽翻页阻止
     * 2 恢复速率
     * 3 去掉页面指示
     */

  }, {
    key: '_setRestore',
    value: function _setRestore(node, isVisual) {
      this._stopped = true;
      this._hasTap = false;
      this._resetRate();
      if (isVisual && node) {
        node.removeAttribute('data-visual');
      }
    }

    /**
     * 修正页面索引
     * 设置新的页面可视区索引
     */

  }, {
    key: '_updateVisualIndex',
    value: function _updateVisualIndex(index) {
      this.visualIndex = index;
    }

    /**
     * 更新页码标示
     * 1. 1个数组参数
     * 2. 2个参数
     * 3. 3个参数
     */

  }, {
    key: '_updatePointer',
    value: function _updatePointer(frontIndex, middleIndex, backIndex) {
      if (arguments.length === 3) {
        this.pagePointer = { frontIndex: frontIndex, middleIndex: middleIndex, backIndex: backIndex };
        return;
      }
      if (arguments.length === 1) {
        var data = frontIndex;
        var viewFlip = data.viewFlip;
        this._updateVisualIndex(data.targetIndex);
        if (viewFlip.length === 3) {
          this._updatePointer(viewFlip[0], viewFlip[1], viewFlip[2]);
        }
        if (viewFlip.length === 2) {
          if (viewFlip[0] === 0) {
            //首页
            this.pagePointer.backIndex = viewFlip[1];
            this.pagePointer.middleIndex = viewFlip[0];
            delete this.pagePointer.frontIndex;
          } else {
            //尾页
            this.pagePointer.frontIndex = viewFlip[0];
            this.pagePointer.middleIndex = viewFlip[1];
            delete this.pagePointer.backIndex;
          }
        }
        return;
      }
    }

    /**
     * 销毁事件
     * @return {[type]} [description]
     */

  }, {
    key: '_off',
    value: function _off() {
      $off(this.container);
    }
  }]);
  return Swiper;
}(Observer);

api(Swiper);
init(Swiper);
slide(Swiper);
distribute$1(Swiper);

////////////////////////
/// 全局钩子
////////////////////////

/**
 * 阻止元素的默认行为
 * 在火狐下面image带有href的行为
 * 会自动触发另存为
 * @return {[type]} [description]
 *
 * 2016.3.18
 * 妙妙学 滚动插件默认行为被阻止
 *
 * 2016.7.26
 * 读库强制PC模式了
 */
function swiperHook(e, node) {

  //禁止鼠标右键
  if (e.button && e.button == 2) {
    return;
  }

  var dataType = node.getAttribute('data-type');

  //代码跟踪
  //如果是点击的超链接页面
  //这个是fast-pipe功能
  var hasTyperlink = false;
  if (dataType === 'hyperlink') {
    hasTyperlink = true;
    config.sendTrackCode('hot', {
      id: node.getAttribute('data-id'),
      pageId: node.getAttribute('data-page-id'),
      type: 'hyperlink',
      eventName: 'tap'
    });
  }

  var nodeName = node.nodeName.toLowerCase();

  //如果是移动端的情况下 && 支持二维码 && 是图片 && 是二维码标记
  if (config.launch.supportQR && Xut.plat.hasTouch && nodeName === "img" && dataType === 'qrcode') {
    return 'qrcode';
  } else {
    if (Xut.plat.isBrowser && !Xut.IBooks.Enabled && !window.MMXCONFIG && !window.DUKUCONFIG && nodeName !== 'a' && //并且不是a标签(在cloumn中有a标签，需要跳转)
    nodeName !== 'video' && //pc视频控制条不灵敏问题
    !hasTyperlink) {
      //超链接不阻止
      e.preventDefault && e.preventDefault();
    }
  }
}

//调度器
//委托事件处理钩子
var delegateHooks = {

  /**
   * 超连接,跳转
   * svg内嵌跳转标记处理
   */
  'data-xxtlink': function dataXxtlink(target, attribute, rootNode, pageIndex) {
    try {
      var para = attribute.split('-');
      if (para.length > 1) {
        //如果有多个就是多场景的组合
        Xut.View.GotoSlide(para[0], para[1]);
      } else {
        Xut.View.GotoSlide(para[0]);
      }
    } catch (err) {
      console.log('跳转错误');
    }
  },


  /**
   * Action', 'Widget', 'Video', 'ShowNote', 'SubDoc'委托
   * arg
   *   target, attribute, rootNode, pageIndex
   */
  'data-delegate': function dataDelegate(target, attribute, rootNode, pageIndex) {
    $trigger({
      target: target,
      attribute: attribute,
      rootNode: rootNode,
      pageIndex: pageIndex
    });
  },


  /**
   * 有效,可滑动
   */
  'data-flow': function dataFlow() {},


  /**
   * 如果是canvas节点
   */
  'data-canvas': function dataCanvas(cur) {
    // alert(1)
  }
};

//事件钩子
/**
 * 简化委托处理，默认一层元素只能绑定一个委托事件
 */
function closestProcessor(event, pageType) {

  var i,
      k,
      attribute,
      attributes,
      value,
      cur = event.target;

  if (cur.nodeType) {
    //如果触发点直接是li
    if (cur === this) {
      return {
        'rootNode': this,
        'elem': cur,
        'handlers': delegateHooks['data-container']
      };
    }
    //否则是内部的节点
    try {
      for (; cur !== this; cur = cur.parentNode || this) {
        //如果是canvas节点
        if (cur.nodeName && cur.nodeName.toLowerCase() === 'canvas') {
          //是否为滑动行为
          if (Xut.Contents.Canvas.getSupportState()) {
            return true;
          } else {
            return false;
          }
        }
        //如果是dom节点
        attributes = cur['attributes'];
        for (k in delegateHooks) {
          if (attribute = attributes[k]) {
            value = attribute['value' || 'nodeValue'];
            return {
              'rootNode': this,
              'elem': cur,
              'attribute': value,
              'pageType': pageType,
              'handlers': delegateHooks[k]
            };
          }
        }
      }
    } catch (err) {
      // Xut.plat.isBrowser && console.log('默认事件跟踪', err)
    }
  }
}

/*
委托处理媒体
视频、音频
 */
function closestMedia(target, chapterId, pageIndex) {
  if (target) {

    var hasPoster = target.getAttribute('data-type');

    /*
      如果是column视频的poster层
      1 保存视频的嵌套容器
      2 修正target的目标为父容器Video
      视频播放节点与图片Poster是平行的
      poster 层级index -1
      video  层级index 0
    */
    var container = void 0;
    if (hasPoster === 'poster' && !key) {
      container = target;
      target = target.parentNode;
    }

    var key = target.getAttribute('id');
    var matchType = key && key.match(/(Audio|Video)_(\w+)/);
    if (matchType) {
      var fileName = target.getAttribute('data-name'); //文件名
      if (fileName) {
        var type = matchType[1];
        var id = matchType[2];

        if (fileName) {
          $trigger({
            target: target,
            pageIndex: pageIndex
          }, {
            id: id,
            type: type,
            startImage: target.getAttribute('data-startImage'),
            stopImage: target.getAttribute('data-stopImage'),
            container: container || target,
            track: 8888, //播放就删除
            chapterId: 'column',
            isColumn: true,
            fileName: fileName
          });
        }
      } else {
        console.log('column中的媒体文件不存在');
      }
    }
  }
}

/**
 * 2017.9.7
 * 流式排版
 */

var ColumnClass = function () {
  function ColumnClass(_ref) {
    var _this = this;

    var rootNode = _ref.rootNode,
        pptMaster = _ref.pptMaster,
        pageIndex = _ref.pageIndex,
        seasonId = _ref.seasonId,
        chapterId = _ref.chapterId,
        callback = _ref.callback;
    classCallCheck(this, ColumnClass);

    /*存放缩放对象*/
    this._scaleObjs = {};
    this.pptMaster = pptMaster;
    this.chapterId = chapterId;
    this.seasonId = seasonId;
    this.initIndex = pageIndex;
    this.$container = $($('#chapter-flow-' + chapterId).html());

    /*布局显示*/
    Xut.nextTick({
      container: rootNode,
      content: this.$container
    }, function () {
      if (config.launch.scrollMode === 'h') {
        _this._initX();
      } else if (config.launch.scrollMode === 'v') {
        _this._initY();
      }
      callback();
    });
  }

  /**
   * 缩放图片
   */


  createClass(ColumnClass, [{
    key: '_zoomPicture',
    value: function _zoomPicture(node) {
      var src = node.src;
      if (!src) {
        return;
      }
      var analysisName = analysisImageName(src);
      var originalName = analysisName.original;

      /*存在*/
      var zoomObj = this._scaleObjs[originalName];
      if (zoomObj) {
        return zoomObj.play();
      }

      /*创建*/
      this._scaleObjs[originalName] = new ScalePicture({
        element: $(node),
        originalSrc: getFileFullPath(analysisName.suffix, 'column-zoom'),
        hdSrc: getHDFilePath(originalName)
      });
    }

    /**
     * pagesCount = 5
     *   等分=> 0.25/0.5/0.75/1/0
     */

  }, {
    key: '_getNodes',
    value: function _getNodes() {
      if (this.pptMaster) {
        var nodes = [];
        var ratio = 1 / (this.columnCount - 1); //比值
        for (var i = 1; i < this.columnCount; i++) {
          nodes.push(i * ratio);
        }
        return nodes.push(0);
      }
    }

    /**
     * 获取母版对象
     */

  }, {
    key: '_getMasterObj',
    value: function _getMasterObj() {
      if (this._masterObj) {
        return this._masterObj;
      }
      if (this.pptMaster) {
        this._masterObj = Xut.Presentation.GetPageBase('master', this.initIndex);
      }
    }

    /**
     * 移动视觉差
     * 处理当前页面内的视觉差对象效果
     */

  }, {
    key: '_moveParallax',
    value: function _moveParallax(action, speed, nodes, visualIndex, direction, viewBeHideDistance) {
      var masterObj = this._getMasterObj();
      if (masterObj) {
        masterObj.moveParallax({
          speed: speed,
          action: action,
          direction: direction,
          pageIndex: visualIndex + 1,
          moveDistance: viewBeHideDistance,
          nodes: direction === 'next' ? nodes[visualIndex] : ''
        });
      }
    }

    /**
     * 横版处理
     * 更新页码
     */

  }, {
    key: '_updataPageNumber',
    value: function _updataPageNumber(direction, location) {
      var initIndex = this.initIndex;
      if (location) {
        direction = location === 'right' ? 'prev' : 'next';
        if (location === 'middle' && initIndex > 0) {
          //如果中间是分栏页
          --initIndex;
        }
      }
      Xut.View.UpdatePage({
        parentIndex: initIndex,
        sonIndex: this.swipe.getVisualIndex() + 1,
        hasSon: true,
        direction: direction
      });
    }

    /**
     * 横版模式下，页面是通过分栏处理的
     * @return {[type]} [description]
     */

  }, {
    key: '_initX',
    value: function _initX() {

      /**************************************
       *     横版模式下的分栏处理
       * ************************************/

      var container = this.$container[0];
      var coloumnObj = this;
      var columnWidth = resetVisualLayout(1).width;

      //分栏数
      this.columnCount = getColumnCount$1(this.seasonId, this.chapterId);

      //边界
      coloumnObj.minBorder = 0;
      coloumnObj.maxBorder = this.columnCount - 1;

      var nodes = this._getNodes();

      var setOptions = {
        container: container,
        scope: 'parent', //父容器滑动
        snap: false, //不分段
        hasHook: true,
        hasMultiPage: true,
        stopPropagation: true,
        visualIndex: Xut.Presentation.GetPageIndex() > coloumnObj.initIndex ? coloumnObj.maxBorder : coloumnObj.minBorder,
        totalIndex: this.columnCount,
        actualWidth: columnWidth
      };

      _.extend(setOptions, Swiper.getConfig());

      /**
       * 分栏整体控制
       * @type {[type]}
       */
      var swipe = this.swipe = new Swiper(setOptions);

      var moveDistance = 0;

      coloumnObj.lastDistance = swipe.getInitDistance();

      var hasQrcode = void 0;
      swipe.$$watch('onFilter', function (hookCallback, point, evtObj) {
        /*二维码*/
        hasQrcode = false;
        if (swiperHook(evtObj, point.target) === 'qrcode') {
          hasQrcode = true;
        }
      });

      swipe.$$watch('onTap', function (pageIndex, hookCallback, point, duration) {
        var node = point.target;
        /*图片缩放*/
        if (!hasQrcode) {
          if (node && node.nodeName.toLowerCase() === "img") {
            coloumnObj._zoomPicture(node);
          }
          if (!Xut.Contents.Canvas.getIsTap()) {
            Xut.View.Toolbar();
          }
        }
        /*点击媒体，视频音频*/
        closestMedia(node, coloumnObj.chapterId, swipe.visualIndex);
      });

      swipe.$$watch('onMove', function (options) {
        var action = options.action,
            speed = options.speed,
            distance = options.distance,
            direction = options.direction;

        /**
         * 首页边界
         */

        if (swipe.visualIndex === coloumnObj.minBorder && swipe.direction === 'prev') {
          if (action === 'flipOver') {
            clearColumnAudio();
            clearVideo();
            Xut.View.GotoPrevSlide({ speed: speed });
            swipe.simulationComplete();
          } else {
            //前边界前移反弹
            Xut.View.SetSwiperMove({
              speed: speed,
              action: action,
              distance: distance,
              direction: swipe.direction
            });
          }
        }
        /**
         * 尾页边界
         */
        else if (swipe.visualIndex === coloumnObj.maxBorder && swipe.direction === 'next') {
            if (action === 'flipOver') {
              clearColumnAudio();
              clearVideo();
              Xut.View.GotoNextSlide({ speed: speed });
              swipe.simulationComplete();
            } else {
              //后边界前移反弹
              Xut.View.SetSwiperMove({
                speed: speed,
                action: action,
                distance: distance,
                direction: swipe.direction
              });
            }
          }
          /**
           * 中间页面
           */
          else {

              var visualIndex = Xut.Presentation.GetPageIndex();

              var viewBeHideDistance = getVisualDistance({
                action: action,
                distance: distance,
                direction: direction,
                frontIndex: visualIndex,
                middleIndex: visualIndex,
                backIndex: visualIndex
              })[1];

              moveDistance = viewBeHideDistance;

              switch (direction) {
                case 'prev':
                  moveDistance = moveDistance + coloumnObj.lastDistance;
                  break;
                case 'next':
                  moveDistance = moveDistance + coloumnObj.lastDistance;
                  break;
              }

              //反弹
              if (action === 'flipRebound') {
                if (direction === 'next') {
                  //右翻页，左反弹
                  moveDistance = -columnWidth * swipe.visualIndex;
                } else {
                  //左翻页，右反弹
                  moveDistance = -(columnWidth * swipe.visualIndex);
                }
              }

              //更新页码
              if (action === 'flipOver') {
                clearColumnAudio();
                clearVideo();
                coloumnObj._updataPageNumber(direction);
              }

              translation[action](container, moveDistance, speed);

              //移动视觉差对象
              coloumnObj._moveParallax(action, speed, nodes, swipe.visualIndex, direction, viewBeHideDistance);
            }
      });

      swipe.$$watch('onComplete', function (_ref2) {
        var unlock = _ref2.unlock;

        coloumnObj.lastDistance = moveDistance;
        unlock();
      });
    }

    /**
     * 获取卷滚的索引
     * @return {[type]} [description]
     */

  }, {
    key: '_initY',


    /**
     * 竖版模式下，整体数据滑动
     * 1 需要判断2个方式，3个方向，3个值
     * 初始化、通过touch的方式滑动，通过鼠标滑动
     * 根据3种行为区分了3种方式，分别要标明，进来进来的方向
     * 通过这个方向值处理内部的滑动
     */
    value: function _initY() {
      var _this2 = this;

      var container = this.$container[0];
      this.columnCount = getColumnCount$1(this.seasonId, this.chapterId);

      var iscroll = this.iscroll = delegateScrollY(container, {
        // mouseWheel: true,
        // scrollbars: true
      });

      /*全局的卷滚条对象*/
      this.scrollBar = Xut.Application.GetScrollBarObject();

      /*全局不止一个迷你bar对象，所以需要不同的更新机制*/
      // if (this.scrollBar && Xut.Application.GetMiniBars() > 1) {
      //   this.multiToolbar = true
      //   this.rangeY = ColumnClass.getScrollYRange(iscroll.maxScrollY, this.columnCount)
      // }

      this.wheelEntryDirection = ''; //鼠标滚动进来的方向
      this.touchEntryDirection = ''; //触摸进来的方向
      this.initEntryDirection = ''; //初始化进来的方向

      /**
       * 进来flow的方式
       * init / touch / wheel
       * @type {String}
       */
      this.entryWay = '';

      /*如果flow初始化是可视区，那么需要开始就设定wheelEntryDirection的值*/
      var setDirection = false;
      if (this.initIndex === Xut.Presentation.GetPageIndex()) {
        setDirection = true;
        this.entryWay = 'init';
      }

      /*初始化Y轴的定位位置*/
      if (Xut.Presentation.GetPageIndex() > this.initIndex) {
        /*从下往上滑动,滚动页面设为最大值*/
        iscroll.scrollTo(0, iscroll.maxScrollY);
        this.visualIndex = this.columnCount - 1;
        this.touchEntryDirection = 'up';
        if (setDirection) {
          this.initEntryDirection = 'up';
        }
      } else {
        /*从上往下滑动*/
        this.visualIndex = 0;
        this.touchEntryDirection = 'down';
        if (setDirection) {
          this.initEntryDirection = 'down';
        }
      }

      var hasQrcode = void 0;
      iscroll.on('beforeScrollStart', function (e) {
        hasQrcode = false;
        if (swiperHook(e, e.target) === 'qrcode') {
          hasQrcode = true;
        }
      });

      /*点击动作
        1. 图片缩放
        2. 点击媒体，视频音频
      */
      iscroll.on('scrollCancel', function (e) {
        var node = e.target;
        if (!hasQrcode) {
          if (node && node.nodeName.toLowerCase() === "img") {
            _this2._zoomPicture(node);
          }
          if (!Xut.Contents.Canvas.getIsTap()) {
            Xut.View.Toolbar();
          }
        }
        closestMedia(node, _this2.chapterId, 0);
      });

      /**
       * 滚动时候变化
       * 强制显示滚动工具栏
       */
      iscroll.on('scroll', function (e) {
        _this2.scrollBar.showBar();
      });

      /**
       * 如果是突然中断
       * 停止滚动
       */
      iscroll.on('intermit', function (y) {
        _this2._updatePosition(y);
      });

      /**
       * 扩展的API
       * 如果是滚动的内容部分
       */
      iscroll.on('scrollContent', function (e) {
        if (!_this2.entryWay) {
          _this2.entryWay = 'touch';
        }
        _this2._updatePosition(_this2.iscroll.y);
      });

      /**
       * 松手后的惯性滑动
       */
      iscroll.on('momentum', function (newY, time) {
        _this2._updatePosition(newY, time);
      });

      /**
       * 扩展API 滚动翻页
       */
      iscroll.on('scrollExit', function (direction) {
        _this2._leave(direction);
      });

      /*滑动的平均概率值*/
      this.sizeRatioY = this.scrollBar.ratio * (this.columnCount - 1) / this.iscroll.maxScrollY;

      /*在翻页的时候，禁止滚动页面*/
      this.wheellook = false;
    }

    /*离开页面：
    touchEntryDirection标记的是进来的方向,
    触摸动作需要取反，因为这个是代表出去的方向*/

  }, {
    key: '_leave',
    value: function _leave(direction) {
      if (direction === 'down') {
        this.touchEntryDirection = 'up';
      } else if (direction === 'up') {
        this.touchEntryDirection = 'down';
      }
      this.wheelEntryDirection = '';
      this.entryWay = '';

      clearColumnAudio();
      clearVideo();
    }

    ////////////////////
    /// 竖版操作
    ///////////////////

    /**
     * 更新滚动坐标
     */

  }, {
    key: '_updatePosition',
    value: function _updatePosition(y, time, directionY) {

      var direction = '';

      if (this.entryWay === 'init') {
        direction = this.initEntryDirection;
      } else if (this.entryWay === 'touch') {
        direction = this.touchEntryDirection;
      } else if (this.entryWay === 'wheel') {
        direction = this.wheelEntryDirection;
      }

      /*如果是下往上进来的*/
      if (direction === 'up') {
        y = Math.round((this.iscroll.maxScrollY - y) * this.sizeRatioY);
        this.scrollBar.updatePosition(y, time, 'up');
        return;
      }

      /*如果是从上往下进来的*/
      if (direction === 'down') {
        y = Math.round(this.sizeRatioY * y) || 0;
        this.scrollBar.updatePosition(y, time, 'down');
      }
    }

    ////////////////////
    /// 鼠标滚动操作
    ///////////////////

  }, {
    key: 'onWheel',
    value: function onWheel(e, wheelDeltaY, direction) {
      var _this3 = this;

      if (wheelDeltaY === undefined) {
        return;
      }

      if (!this.entryWay) {
        this.entryWay = 'wheel';
      }

      /*进来的方向，每次flow页面运行只标记一次*/
      if (!this.wheelEntryDirection) {
        this.wheelEntryDirection = direction;
      }

      /*离开页面，鼠标快速滑动，禁止内部滑动*/
      if (!this.wheellook) {

        /*向上移动，离开flow页面*/
        if (this.iscroll.y === 0 && direction === 'up') {
          this.wheellook = true;
          Xut.View.GotoPrevSlide(function () {
            /*向下翻页，滚动条设置0*/
            _this3.iscroll.scrollTo(0, 0);
            _this3.wheellook = false;
            _this3._leave('up');
          });
          return;
        }

        /*向下移动，离开flow页面*/
        if (this.iscroll.y === this.iscroll.maxScrollY && direction === 'down') {
          this.wheellook = true;
          Xut.View.GotoNextSlide(function () {
            /*向下翻页，滚动条设置最大值*/
            _this3.iscroll.scrollTo(0, _this3.iscroll.maxScrollY);
            _this3.wheellook = false;
            _this3._leave('down');
          });
          return;
        }

        this.iscroll._wheel(e);
      }
    }

    /**
     * 获取进入方向
     * @return {[type]} [description]
     */

  }, {
    key: 'getEntry',
    value: function getEntry() {
      return this.entryWay;
    }

    ////////////////////
    /// 横版分栏刷新接口
    ///////////////////

    /**
     * 横版分栏更新
     * @param  {[type]} newColumnCount [description]
     * @return {[type]}                [description]
     */

  }, {
    key: '_resetX',
    value: function _resetX(newColumnCount) {
      this.columnCount = newColumnCount;
      this.maxBorder = newColumnCount - 1;

      var visualPageId = Xut.Presentation.GetPageId();
      var columnPageId = this.chapterId;
      var location = void 0;

      //区分控制column属于哪个页面对象
      if (visualPageId > columnPageId) {
        location = 'left';
      } else if (visualPageId < columnPageId) {
        location = 'right';
      } else if (visualPageId === columnPageId) {
        location = 'middle';
      }

      //设置column
      this.swipe.setLinearTotal(newColumnCount, location);
      this.lastDistance = this.swipe.getInitDistance();

      //页码
      this._updataPageNumber('', location);
    }

    /**
     * 竖版分栏更新
     * @param  {[type]} newColumnCount [description]
     * @return {[type]}                [description]
     */

  }, {
    key: '_resetY',
    value: function _resetY(newColumnCount) {
      console.log('竖版数据丢失，需要添加功能，补全');
      // console.log(this.columnCount,newColumnCount)
      // this.iscroll.refresh()
      // this._updatePosition(this.iscroll.y)
    }

    /**
     * 重新计算分栏依赖
     * @return {[type]} [description]
     */

  }, {
    key: 'resetColumnDep',
    value: function resetColumnDep() {
      var newColumnCount = getColumnCount$1(this.seasonId, this.chapterId);
      /*假如分栏数有变化*/
      if (newColumnCount > this.columnCount) {
        if (config.launch.scrollMode === 'h') {
          this._resetX(newColumnCount);
        } else if (config.launch.scrollMode === 'v') {
          this._resetY(newColumnCount);
        }
      }
    }

    /*销毁*/

  }, {
    key: 'destroy',
    value: function destroy() {
      var _this4 = this;

      //销毁缩放图片
      if (Object.keys(this._scaleObjs).length) {
        _.each(this._scaleObjs, function (obj, key) {
          obj.destroy();
          _this4._scaleObjs[key] = null;
        });
      }

      this.iscroll && this.iscroll.destroy();
      this.swipe && this.swipe.destroy();
    }
  }], [{
    key: 'getScrollYIndex',
    value: function getScrollYIndex(distY, rangeY) {
      var key = void 0,
          value = void 0,
          pageIndex = void 0;
      var startY = Math.abs(distY);
      for (var _key in rangeY) {
        var _value = rangeY[_key];
        if (startY >= _value.min && startY <= _value.max) {
          pageIndex = _key;
          break;
        }
      }
      return Number(pageIndex);
    }

    /**
     * 获取滚动Y轴的坐标分组
     * 计算出通过坐标模拟分段是区间
     * @return {[type]} [description]
     */

  }, {
    key: 'getScrollYRange',
    value: function getScrollYRange(maxScrollY, columnCount) {
      var baseY = Math.abs(maxScrollY / columnCount);
      var count = columnCount;

      /*获取对比的数据区间值，快速比较*/
      var rangeY = {};
      while (count--) {
        rangeY[count] = {
          min: Math.abs(count * baseY),
          max: Math.abs((count + 1) * baseY)
        };
      }
      return rangeY;
    }
  }]);
  return ColumnClass;
}();

/**
 * 2017.9.7
 * 流式排版
 */
var TaskColumns = function (base, callback) {
  var chapterData = base.chapterData;
  //只有页面类型支持flow && chpater页存在flow数据
  if (base.pageType === "page" && isColumnPage(chapterData.seasonId, base.chapterId)) {
    base.columnGroup.add(new ColumnClass({
      pptMaster: base.chapterData.pptMaster, //母版ID
      pageIndex: base.pageIndex,
      rootNode: base.getContainsNode(),
      seasonId: base.chapterData.seasonId,
      chapterId: base.chapterId,
      callback: callback
    }));
  } else {
    callback();
  }
};

/**
 * 分配Container构建任务
 * 1 同步数据
 * 2 构建容器
 * 3 给出构建回调,这里不能中断,翻页必须存在节点
 * 4 等待之后自动创建或者后台空闲创建之后的任务
 * @return {[type]} [description]
 */
var assignedTasks = {

  /**
   * 主容器
   */
  'assign-container': function assignContainer(success, base) {
    //同步数据
    syncCache(base, function () {
      var pageData = base.baseData();
      parseContentMode(pageData, base);
      TaskContainer(base, pageData, success);
    });
  },


  /**
   *  分配背景构建任务
   *    1 构建数据与结构,执行中断检测
   *    2 绘制结构,执行回调
   *
   *  提供2组回调
   *    1 构建数据结构 suspendCallback
   *    2 执行innerhtml构建完毕 successCallback
   */
  'assign-background': function assignBackground(success, base) {
    if (base.rerunInstanceTask('assign-background')) {
      return;
    }
    var data = base.baseData(base.chapterIndex);
    var $containsNode = base.getContainsNode();
    base.threadTaskRelated.assignTaskGroup['assign-background'] = new TaskBackground(data, $containsNode, success, function () {
      base.detectorTask.apply(base, arguments);
    });
  },


  /**
   * 流式排版
   */
  'assign-column': function assignColumn(success, base) {
    TaskColumns(base, success);
  },


  /**
   * 分配Components构建任务
   * @return {[type]} [description]
   */
  'assign-component': function assignComponent(success, base) {
    if (base.rerunInstanceTask('assign-component')) {
      return;
    }
    var chapterData = base.chapterData;
    var baseData = base.baseData();
    base.threadTaskRelated.assignTaskGroup['assign-component'] = new TaskComponents({
      'rootNode': base.rootNode,
      '$containsNode': base.getContainsNode(),
      'nodes': chapterData['nodes'],
      'pageOffset': chapterData['pageOffset'],
      'activitys': base.baseActivits(),
      'chpaterData': baseData,
      'chapterId': baseData['_id'],
      'chapterIndex': base.chapterIndex,
      'pageType': base.pageType,
      'pageBaseHooks': base.divertorHooks,
      'getStyle': base.getStyle
    }, success, function () {
      base.detectorTask.apply(base, arguments);
    });
  },


  /**
   * 分配Activity构建任务
   * @return {[type]} [description]
   */
  'assgin-activity': function assginActivity(success, base) {

    //通过content数据库为空处理
    if (Xut.data.preventContent) {
      return success();
    }

    if (base.rerunInstanceTask('assgin-activity')) {
      return;
    }

    var chapterData = base.chapterData;
    var baseData = base.baseData();

    base.threadTaskRelated.assignTaskGroup['assgin-activity'] = new TaskActivitys({
      base: base,
      'canvasRelated': base.canvasRelated,
      'rootNode': base.rootNode,
      '$containsNode': base.getContainsNode(),
      '$headFootNode': base.getHeadFootNode(),
      'pageType': base.pageType,
      'nodes': chapterData['nodes'],
      'pageOffset': chapterData['pageOffset'],
      'activitys': base.baseActivits(),
      'chpaterData': baseData,
      'chapterId': baseData._id,
      'pageIndex': base.pageIndex,
      'chapterIndex': base.chapterIndex,
      'pageBaseHooks': base.divertorHooks,
      'getStyle': base.getStyle
    }, success, function () {
      base.detectorTask.apply(base, arguments);
    });
  }
};

var noop$2 = function noop() {};

function initThreadState(instance) {

  return {
    /**
     * 主线任务等待
     */
    taskHangFn: null,

    /**
     * 创建相关的信息
     * @type {Object}
     */
    tasksTimer: 0,

    /**
     * 当前任务是否中断
     * return
     *     true  中断
     *     false 没有中断
     */
    isTaskSuspend: false,

    /**
     * 是否预创建背景中
     */
    isPreCreateBackground: false,

    /*
    缓存的任务名
    动态注册
     */
    assignTaskGroup: null,

    /**
     * 下一个将要运行的任务标示
     */
    nextTaskName: '',

    /**
     * 预创建
     * 构建页面主容器完毕后,此时可以翻页
     * @return {[type]} [description]
     */
    preforkComplete: noop$2,

    /**
     * 整个页面都构建完毕通知
     * @return {[type]} [description]
     */
    createTasksComplete: noop$2
  };
}

/**
 * 页面缩放
 * @param  {[type]} rootNode  [description]
 * @param  {[type]} pageIndex [description]
 * @return {[type]}           [description]
 */
var initPageScale = function initPageScale(rootNode, pageIndex) {
  return new ScalePan({
    rootNode: rootNode,
    hasButton: true,
    tapClose: true,
    updateHook: function updateHook(transform, speed) {
      if (transform) {
        /*如果有母版，缩放母版*/
        var relatedMasterObj = Xut.Presentation.GetPageBase('master', pageIndex);
        if (relatedMasterObj) {
          var pageMasterNode = relatedMasterObj.getContainsNode()[0];
          Xut.style.setTranslate({
            speed: speed,
            translate: transform.translate,
            scale: transform.scale,
            node: pageMasterNode
          });
        }
      }
    }
  });
};

/**
 * 缓存构建中断回调
 * 构建分2步骤
 * 1 构建数据与结构（执行中断处理）
 * 2 构建绘制页面
 * @type {Object}
 */
var registerCacheTask = function registerCacheTask(threadtasks) {
  /*设置缓存的任务名*/
  var cache = {};
  Object.keys(threadtasks).forEach(function (taskName) {
    cache[taskName] = false;
  });
  return cache;
};

function initThreadtasks(instance) {

  /**
   * 创建相关的信息
   * threadTaskRelated
   */
  var threadTaskRelated = instance.threadTaskRelated = initThreadState(instance);

  /*注册缓存任务名*/
  threadTaskRelated.assignTaskGroup = registerCacheTask(assignedTasks);
  threadTaskRelated.nextTaskName = 'container';

  /**
   * 设置下一个任务名
   * 用于标记完成度
   */
  var setNextTaskName = function setNextTaskName(taskName) {
    threadTaskRelated.nextTaskName = taskName;
  };

  /* 创建新任务*/
  var createAssignTask = function createAssignTask(taskName, fn) {
    return assignedTasks[taskName](fn, instance);
  };

  /**
   * 任务钩子
   */
  instance.threadtasks = {

    /**
     * li容器
     */
    container: function container() {

      createAssignTask('assign-container', function ($pageNode, $pseudoElement) {

        //////////////
        //li,li-div //
        //////////////
        instance.$pageNode = $pageNode;
        instance.$pseudoElement = $pseudoElement;

        /**
         * 获取根节点
         * 获取包含容器
         */
        var $containsElement = $pageNode.find('.page-scale > div:first-child');
        instance.getContainsNode = function () {
          return $pseudoElement ? $pseudoElement : $containsElement;
        };

        //页眉页脚
        instance.getHeadFootNode = function () {
          return $pageNode.find('.page-scale > div:last-child');
        };

        //缩放根节点
        instance.getScaleNode = function () {
          return $pseudoElement ? $pseudoElement : $pageNode.find('.page-scale');
        };

        setNextTaskName('background');

        //构建主容器li完毕,可以提前执行翻页动作
        //必须是启动了快速翻页
        threadTaskRelated.preforkComplete();

        //模板上继续创建，不处理创建问题
        if (instance.isMaster) {
          instance.detectorTask({
            'taskName': '外部Background',
            'nextTask': function nextTask() {
              instance.dispatchTasks();
            }
          });
        }
      });
    },


    /**
     * 背景
     */
    background: function background() {

      createAssignTask('assign-background', function () {
        threadTaskRelated.isPreCreateBackground = false;
        setNextTaskName('column');

        //针对当前页面的检测
        //没有背景挂起，或者是母版继续往下创建
        if (!threadTaskRelated.taskHangFn || instance.isMaster) {
          instance.detectorTask({
            'taskName': '外部widgets',
            nextTask: function nextTask() {
              instance.dispatchTasks();
            }
          });
        }

        //如果有挂起任务，则继续执行
        if (threadTaskRelated.taskHangFn) {
          threadTaskRelated.taskHangFn();
        }
      });
    },


    /**
     * 2016.9.7
     * 特殊的一个内容
     * 是否为流式排版
     * @return {[type]} [description]
     */
    column: function column() {

      //如果是页面类型
      var isPageType = instance.pageType === 'page';

      /*
      创建页面缩放缩放
      1.page页面可以配置缩放
      2.flow页面不允许缩放
       */
      var createScale = function createScale() {
        var salePageType = config.launch.salePageType;
        if (isPageType && (salePageType === 'page' || salePageType === 'all')) {
          instance._pageScaleObj = initPageScale(instance.getScaleNode(), instance.pageIndex);
        }
      };

      /*
      chapter=>note == 'flow'
      设计上chapter只有一个flow效果，所以直接跳过别的创建
      只处理页面类型，母版跳过
       */
      if (isPageType && instance.hasColumnData) {
        createAssignTask('assign-column', function () {
          setNextTaskName('complete');
          threadTaskRelated.createTasksComplete();
        });
      } else {
        createScale();
        setNextTaskName('component');
        instance.dispatchTasks();
      }
    },


    /**
     * 组件
     * 构件零件类型任务
     */
    component: function component() {
      createAssignTask('assign-component', function () {
        setNextTaskName('activity');
        instance.detectorTask({
          'taskName': '外部contents',
          nextTask: function nextTask() {
            instance.dispatchTasks();
          }
        });
      });
    },


    /**
     * activity类型
     */
    activity: function activity() {
      createAssignTask('assgin-activity', function () {
        setNextTaskName('complete');
        threadTaskRelated.createTasksComplete();
      });
    }
  };
}

// 观察
/**
 * canvas相关处理
 * 启动canvas,pixi库
 * 事件，动画等
 * 需要收集所有content的执行
 * 因为canvas只能绘制一次
 * cnavas模式下 category === "Sprite" 转化cid
 */

var Factory = function (_Observer) {
    inherits(Factory, _Observer);

    function Factory() {
        classCallCheck(this, Factory);

        /**
         * 是否启动模式
         * @type {Boolean}
         */
        var _this = possibleConstructorReturn(this, (Factory.__proto__ || Object.getPrototypeOf(Factory)).call(this));

        _this.enable = false;

        /**
         * CompSprite非常特殊
         * 可以在dom的情况下使用
         * 所以如果是dom模式要强制开始enable‘
         * 这样会导致 精灵等动画强制转canvas
         * 这是错误的，所以增加一个判断
         *
         */
        _this.onlyCompSprite = false;

        /**
         * 加载失败content列表
         * @type {Array}
         */
        _this.failCid = [];

        //所有contentId合集
        _this.contentIdset = [];

        //开启了contentMode的节点
        //对应的content转化成canvas模式
        //普通精灵动画
        //ppt动画=>转化
        _this.pptId = [];

        //普通灵精
        _this.spiritId = [];

        //widget零件保存的content id
        //高级精灵动画
        _this.widgetId = [];

        //复杂精灵动画
        _this.compSpriteId = [];

        //默认canvas容器的层级
        //取精灵动画最高层级
        //2016.2.25
        _this.containerIndex = 1;

        /**
         * cid=>wid
         * 对应的pixi对象容器
         * @type {Object}
         */
        _this.collections = {};
        return _this;
    }

    return Factory;
}(Observer);

/****************************
 *
 *  监控columns内容是否需要补全
 *
 *****************************/

function watchColumn(instance, config) {
  //注册_columns对象改变
  if (config.launch.columnCheck) {
    var columnObj = instance.columnGroup.get();
    if (columnObj && columnObj.length) {
      if (!instance.unWatchDep) {
        instance.unWatchDep = [];
      }
      columnObj.forEach(function (obj) {
        var dep = Xut.Application.Watch('change:column', function () {
          obj.resetColumnDep();
        });

        //保存监控引用
        instance.unWatchDep.push(function () {
          return Xut.Application.unWatch('change:column', dep);
        });
      });
    }
  }
}

/**
 * 移除监控
 * @param  {[type]} instance [description]
 * @return {[type]}          [description]
 */
function unWatchColumn(instance) {
  //如果有更新记录依赖
  if (instance.unWatchDep) {
    instance.unWatchDep.forEach(function (unDep) {
      unDep();
    });
    instance.unWatchDep = null;
  }
}

var initstate = function (baseProto) {

  /**
   * 初始化多线程任务
   */
  baseProto.init = function (options) {

    var instance = this;

    _.extend(instance, options);

    /**
     * 数据缓存容器
     * @type {Object}
     */
    this.dataActionGroup = {};
    this.seasonId = this.chapterData.seasonId;
    this.chapterId = this.chapterData._id;

    /**
     * 是否开启多线程,默认开启
     * 如果是非线性，则关闭多线程创建
     * 启动 true
     * 关闭 false
     * @type {[type]}
     */
    this.hasMultithread = this.hasMultiPage ? true : false;

    //母版处理
    if (instance.pageType === 'master') {
      this.isMaster = true;
    }

    //canvas模式
    this.canvasRelated = new Factory();

    /*有流式排版数据*/
    if (instance.chapterData.note === 'flow') {
      this.hasColumnData = true;
    }

    ///////////////////////////////////////
    ///
    /// 内部钩子相关
    /// 监听状态的钩子
    /// 注册所有content对象管理
    /// 收集所有content对象
    /// 构建li主结构后,即可翻页
    /// 构建所有对象完毕后处理
    ///
    ////////////////////////////////////////

    /**
     * 缓存所有的content对象引用
     * 1对1的关系
     */
    this.contentGroup = {};

    /**
     * 抽象activtiys合集,用于关联各自的content
     * 划分各自的子作用域
     * 1对多的关系
     */
    this.activityGroup = new Collection();

    /**
     * widget热点处理类
     * 只存在当前页面
     * 1 iframe零件
     * 2 页面零件
     */
    this.componentGroup = new Collection();

    /**
     * 2016.9.7
     * column热点对象
     */
    this.columnGroup = new Collection();

    /**
     * 为mini杂志新功能
     * 动画的调用序列
     * 收集滑动委托对象，针对事件合集触发处理
     * 2016.11.8
     */
    if (config.launch.swipeDelegate) {
      this.swipeSequence = {
        swipeleft: [],
        swiperight: [],
        swipeleftTotal: 0,
        swiperightTotal: 0,
        swipeleftIndex: 0,
        swiperightIndex: 0
      };
    }

    /**
     * 页面中是最高的
     * 浮动对象分组
     * 1 母版
     * 2 页面
     */
    var floatGroup = this.floatGroup = {

      /**
       * 页面浮动对象容器
       */
      pageContainer: null,

      /**
       * 浮动页面对象
       */
      pageGroup: {},

      /**
       * 浮动母版容器
       */
      masterContainer: null,

      /**
       * 浮动母版的content对象
       * 用于边界切换,自动加上移动
       *     1：Object {}      //空对象,零件
       *     2: PPTeffect  {}  //行为对象
       */
      masterGroup: {}
    };

    /**
     * 对象的处理情况的内部钩子方法
     * 收集内部的一些状态与对象
     */
    this.divertorHooks = {

      /**
       * 多线程任务完成后
       * createTasksComplete方法中
       * 开始column观察器
       */
      threadtaskComplete: function threadtaskComplete() {
        watchColumn(instance, config);
      },


      /**
       * 保存Activity类实例
       */
      cacheActivity: function cacheActivity(activityInstance) {
        instance.activityGroup.add(activityInstance);
      },


      /**
       * 搜集所有的content(每一个content对象)
       * 因为content多页面共享的,所以content的合集需要保存在pageMgr中（特殊处理）
       */
      contents: function contents(chapterIndex, id, contentScope) {
        var scope = instance.baseGetContentObject[id];
        //特殊处理,如果注册了事件ID,上面还有动画,需要覆盖
        if (scope && scope.isBindEventHooks) {
          instance.contentGroup[id] = contentScope;
        }
        if (!scope) {
          instance.contentGroup[id] = contentScope;
        }
      },


      /**
       * 2014.11.7
       * 新概念，浮动页面对象
       * 用于是最顶层的，比母版浮动对象还要高
       * 所以这个浮动对象需要跟随页面动
       */
      floatPages: function floatPages(divertor) {

        /*component与activity共享了一个Container，所以只能处理一次*/
        if (divertor && floatGroup.pageContainer) {
          $warn('floatPages重复pageContainer', 'info');
        } else {
          floatGroup.pageContainer = divertor.container;
        }

        if (divertor.ids.length) {
          var contentObj = void 0;
          _.each(divertor.ids, function (id) {
            if (contentObj = instance.baseGetContentObject(id)) {
              //初始视察坐标
              if (contentObj.parallax) {
                contentObj.parallaxOffset = contentObj.parallax.parallaxOffset;
              }
              floatGroup.pageGroup[id] = contentObj;
            } else {
              console.log('页面浮动对象找不到');
            }
          });
        }
      },


      /**
       * 浮动母版对象
       * 1 浮动的对象是有动画数据或者视觉差数据
       * 2 浮动的对象是用于零件类型,这边只提供创建
       *  所以需要制造一个空的容器，用于母版交界动
       */
      floatMasters: function floatMasters(divertor) {

        /*component与activity共享了一个Container，所以只能处理一次*/
        if (divertor && floatGroup.masterContainer) {
          $warn('floatMasters重复masterContainer', 'info');
        } else {
          floatGroup.masterContainer = divertor.container;
        }

        if (divertor.ids.length) {
          var contentObj = void 0;
          var contentNode = void 0;
          //浮动对象
          _.each(divertor.ids, function (id) {
            //转化成实际操作的浮动对象,保存
            if (contentObj = instance.baseGetContentObject(id)) {
              //初始视察坐标
              if (contentObj.parallax) {
                contentObj.parallaxOffset = contentObj.parallax.parallaxOffset;
              }
              floatGroup.masterGroup[id] = contentObj;
            } else {
              Xut.plat.isBrowser && console.log('浮动母版对象数据不存在原始对象,制作伪对象母版移动', id);

              var activity = instance.threadTaskRelated['assgin-activity'];
              var contentsFragment = activity.contentsFragment;

              //获取DOM节点
              if (contentsFragment) {
                var prefix = 'Content_' + instance.chapterIndex + "_";
                _.each(contentsFragment, function (dom) {
                  var makePrefix = prefix + id;
                  if (dom.id == makePrefix) {
                    contentNode = dom;
                  }
                });
              }
              //制作一个伪数据
              //作为零件类型的空content处理
              floatGroup.masterGroup[id] = {
                id: id,
                chapterIndex: instance.chapterIndex,
                $contentNode: $(contentNode),
                'empty': true //空类型
              };
            }
          });
        }
      },


      /**
       * 多事件钩子
       * 执行多事件绑定
       */
      eventBinding: function eventBinding(eventRelated) {
        create(instance, eventRelated);
      },


      /**
       * 2016.11.8
       * 收集滑动委托对象，针对事件合集触发处理
       */
      swipeDelegateContents: function swipeDelegateContents(eventName, fn) {
        ++instance.swipeSequence[eventName + 'Total'];
        instance.swipeSequence[eventName].push(fn);
      }
    };

    /**
     * 初始化任务
     * 等待状态初始化，比如_isFlows
     */
    initThreadtasks(instance);
  };
};

/**
 * 多线程检测代码
 */
function threadCheck(baseProto) {

  /**
   * 自动运行：检测是否需要开始创建任务
   * 1 如果任务全部完成了毕
   * 2 如果有中断任务,就需要继续创建未完成的任务
   * 3 如果任务未中断,还在继续创建
   * currtask 是否为当前任务，加速创建
   */
  baseProto._checkNextTaskCreate = function (callback) {
    var _this = this;

    //如果任务全部完成
    if (this.threadTaskRelated.nextTaskName === 'complete') {
      return callback();
    }

    //开始构未完成的任务
    this._cancelTaskSuspend();

    //任务创建完毕回调
    this.threadTaskRelated.createTasksComplete = function () {
      _this.divertorHooks && _this.divertorHooks.threadtaskComplete();
      callback();
    };

    //派发任务
    this.detectorTask({
      nextTask: function nextTask() {
        this.dispatchTasks();
      }
    });
  };

  /**
   * 任务调度，自动创建下个任务
   */
  baseProto.dispatchTasks = function () {
    var threadtasks = this.threadtasks[this.threadTaskRelated.nextTaskName];
    if (threadtasks) {
      threadtasks.apply(undefined, arguments);
    }
  };

  /**
   * 开始执行下一个线程任务,检测是否中断
      suspendTask,
      nextTask,
      interrupt,
      taskName
   * @return {[type]} [description]
   */
  baseProto.detectorTask = function (options) {
    this._asyTasks({
      suspendCallback: function suspendCallback() {
        options.suspendTask && options.suspendTask.call(this);
      },
      nextTaskCallback: function nextTaskCallback() {
        options.nextTask && options.nextTask.call(this);
      }
    }, options.interrupt);
  };

  /**
   * 任务队列挂起
   * nextTaskCallback 成功回调
   * suspendCallback  中断回调
   * @return {[type]} [description]
   */
  baseProto._asyTasks = function (callbacks, interrupt) {
    //如果关闭多线程,不检测任务调度
    if (!this.hasMultithread) {
      return callbacks.nextTaskCallback.call(this);
    }
    //多线程检测
    this._multithreadCheck(callbacks, interrupt);
  };

  /**
   * 多线程检测
   * @return {[type]} [description]
   */
  baseProto._multithreadCheck = function (callbacks, interrupt) {
    var _this2 = this;

    var check = function check() {
      if (_this2._checkTaskSuspend()) {
        _this2.tasksTimeOutId && clearTimeout(_this2.tasksTimeOutId);
        callbacks.suspendCallback.call(_this2);
      } else {
        callbacks.nextTaskCallback.call(_this2);
      }
    };
    var next = function next() {
      _this2.tasksTimeOutId = setTimeout(function () {
        check();
      }, _this2.canvasRelated.tasksTimer);
    };

    //自动运行页面构建
    if (this.hasAutoRun) {
      //自动运行content中断检测 打断一次
      if (interrupt) {
        next();
      } else {
        check();
      }
    } else {
      //后台构建
      next();
    }
  };

  /**
   * 取消任务中断
   */
  baseProto._cancelTaskSuspend = function () {
    this.canvasRelated.isTaskSuspend = false;
  };

  /**
   * 检测任务是否需要中断
   */
  baseProto._checkTaskSuspend = function () {
    return this.canvasRelated.isTaskSuspend;
  };
}

/**
 *  对外接口
 *  1 开始调用任务
 *  2 调用自动运行任务
 *  3 设置中断
 *  4 取消中断设置
 */

var threadExternal = function (baseProto) {

  /**
   * 开始调用任务
   * dispatch=>index=>create=>startThreadTask
   * 如果是快速翻页，创建container就提前返回callback
   */
  baseProto.startThreadTask = function (isFlipAction, callback) {
    var _this = this;

    /*
    构建container任务完成后的一次调用
    1 如果是快速翻頁，並且是翻頁動作
    2 否則則繼續創建剩下的任務
     */
    this.threadTaskRelated.preforkComplete = function () {
      return function () {
        /*当创建完容器后，就允许快速翻页了
        如果此时是快速打开，并且是翻页的动作*/
        if (config.launch.quickFlip && isFlipAction) {
          callback();
        } else {
          /*如果不是快速翻页，那么就继续往下分解任务*/
          _this._checkNextTaskCreate(callback);
        }
      };
    }();

    //开始构建任务
    this.dispatchTasks();
  };

  /**
   * 主动调用
   * 检测任务是否完成,自动运行的时候需要检测
   * page => autoRun中需要保证任务完成后才能执行自动运行任务
   * src\lib\scenario\manage\page.js
   */
  baseProto.checkThreadTaskComplete = function (completeCallback) {
    var _this2 = this;

    this.hasAutoRun = true;
    this._checkNextTaskCreate(function () {
      _this2.hasAutoRun = false;
      completeCallback();
    });
  };

  /**
   * 主动调用
   * 翻页的时候要设置任务中断
   * left middle right 默认三个页面
   * src\lib\scenario\manage\page.js
   */
  baseProto.setTaskSuspend = function () {
    this.hasAutoRun = false;
    this.canvasRelated.isTaskSuspend = true;
    this.threadTaskRelated.isPreCreateBackground = false;
    this.threadTaskRelated.taskHangFn = null;
  };

  /**
   * 主动调用
   * 后台预创建任务
   * 自动运行任务完成后，需要开始预创建其他页面任务没有创建完毕的的处理
   * 断点续传
   * \src\lib\scenario\manage\page.js:
   */
  baseProto.createPreforkTask = function (callback, isPreCreate) {
    var self = this;
    //2个预创建间隔太短
    //背景预创建还在进行中，先挂起来等待
    if (this.threadTaskRelated.isPreCreateBackground) {
      this.threadTaskRelated.taskHangFn = function (callback) {
        return function () {
          self._checkNextTaskCreate(callback);
        };
      }(callback);
      return;
    }

    /**
     * 翻页完毕后
     * 预创建背景
     */
    if (isPreCreate) {
      this.threadTaskRelated.isPreCreateBackground = true;
    }

    this._checkNextTaskCreate(callback);
  };

  /**
   * 主动调用
   * 2016.10.13 给妙妙学增加watch('complete')
   * 如果有最后一个动作触发，创建最后一次页面动作
   *
   * 只有最后一页的时候才会存在runLastPageAction方法
   * this.runLastPageAction在parseMode中定义
   * \lib\scenario\pagebase\multithread\assign-task\index.js:
   */
  baseProto.createPageAction = function () {
    if (this.runLastPageAction) {
      //返回停止方法
      this.stopLastPageAction = this.runLastPageAction();
    }
  };

  /**
   * 销毁动作触发
   * 处理最后一页动作
   * \src\lib\scenario\manage\page.j
   */
  baseProto.destroyPageAction = function () {
    if (this.stopLastPageAction) {
      this.stopLastPageAction();
      this.stopLastPageAction = null;
    }
  };
};

/**
 * 构建模块任务对象
 * taskCallback 每个模块任务完毕后的回调
 * 用于继续往下个任务构建
 */
var dataExternal = function (baseProto) {

  /**
   * 设置页面容器层级
   * 页面跳转使用接口
   * @return {[type]} [description]
   */
  baseProto.setPageContainerHierarchy = function (style) {
    this.$pageNode.css(style);
  };

  /**
   * 获取文字动画对象
   * 2017.1.6
   * @return {[type]} [description]
   */
  baseProto.getLetterObjs = function (contentId) {
    var activity = this.threadTaskRelated.assignTaskGroup['assgin-activity'];
    if (activity && activity.textFxObjs) {
      return activity.textFxObjs[contentId];
    }
  };

  /**
   * 转化序列名
   * @return {[type]} [description]
   */
  baseProto._converSequenceName = function (direction) {
    return direction === 'next' ? 'swipeleft' : 'swiperight';
  };

  /**
   * 是否有动画序列
   */
  baseProto.hasSwipeSequence = function (direction) {
    var eventName = this._converSequenceName(direction);
    var swipeSequence = this.swipeSequence;

    //如果执行完毕了
    if (swipeSequence[eventName + 'Index'] === swipeSequence[eventName + 'Total']) {
      return false;
    }
    return swipeSequence[eventName].length;
  };

  /**
   * 执行动画序列
   * @return {[type]} [description]
   */
  baseProto.callSwipeSequence = function (direction) {
    if (!this.swipeSequence) {
      return;
    }
    var eventName = this._converSequenceName(direction);
    var sequence = this.swipeSequence[eventName];
    var callAnimSequence = sequence[this.swipeSequence[eventName + 'Index']];
    if (callAnimSequence) {
      ++this.swipeSequence[eventName + 'Index'];
      callAnimSequence(); //动画不能在回调中更改状态，因为翻页动作可能在动画没有结束之前，所以会导致翻页卡住
    }
  };

  /**
   * 复位动画序列
   * @param  {[type]} direction [description]
   * @return {[type]}           [description]
   */
  baseProto.resetSwipeSequence = function () {
    if (!this.swipeSequence) {
      return;
    }
    this.swipeSequence.swipeleftIndex = 0;
    this.swipeSequence.swiperightIndex = 0;
  };

  /**
   * 对象实例内部构建
   * 重新实例运行任务
   */
  baseProto.rerunInstanceTask = function (taskName) {
    var tasksObj;
    if (tasksObj = this.threadTaskRelated.assignTaskGroup[taskName]) {
      tasksObj.rerunTask && tasksObj.rerunTask();
      return true;
    }
  };

  /**
   * 获取页面数据
   * @return {[type]} [description]
   */
  baseProto.baseData = function () {
    return this.dataActionGroup[this.pageType];
  };

  /**
   * 获取热点数据信息
   * @return {[type]} [description]
   */
  baseProto.baseActivits = function () {
    return this.dataActionGroup['activitys'];
  };

  /**
   * 获取自动运行数据
   * @return {[type]} [description]
   */
  baseProto.baseAutoRun = function () {
    var data = this.dataActionGroup['auto'];
    return data && data;
  };

  /**
   * 获取chapterid
   * @return {[type]}     [description]
   */
  baseProto.baseGetPageId = function (index) {
    return this.baseData(index)['_id'];
  };

  /**
   * 找到对象的content对象
   * @param  {[type]}   contentId [description]
   * @param  {Function} callback  [description]
   * @return {[type]}             [description]
   */
  baseProto.baseGetContentObject = function (contentId) {
    var contentsObj = this.contentGroup[contentId];
    if (contentsObj) {
      return contentsObj;
    }

    //查找浮动母版
    return this.floatGroup.masterGroup[contentId];
  };

  /**
   * Xut.Content.show/hide 针对互斥效果增加接口
   * 扩充，显示，隐藏，动画控制接口
   * @param  {[type]} name [description]
   * @return {[type]}      [description]
   */
  baseProto.baseContentMutex = function (contentId, type) {
    var contentObj = void 0;
    if (contentObj = this.baseGetContentObject(contentId)) {
      var $contentElement = contentObj.$contentNode.view ? contentObj.$contentNode.view : contentObj.$contentNode;

      var handle = {
        'Show': function Show() {
          if (contentObj.type === 'dom') {
            $contentElement.css({
              'display': 'blcok',
              'visibility': 'visible'
            }).prop("mutex", false);
          } else {
            $contentElement.visible = true;
          }
        },
        'Hide': function Hide() {
          if (contentObj.type === 'dom') {
            $contentElement.css({
              'display': 'none',
              'visibility': 'hidden'
            }).prop("mutex", true);
          } else {
            $contentElement.visible = false;
          }
        },
        'StopAnim': function StopAnim() {
          contentObj.stopAnims && contentObj.stopAnims();
        }
      };
      handle[type]();
    }
  };

  //content接口
  _.each(["Get", "Specified"], function (type) {
    baseProto['base' + type + 'Content'] = function (data) {
      switch (type) {
        case 'Get':
          return this.activityGroup.get();
        case 'Specified':
          return this.activityGroup.specified(data);
      }
    };
  });

  //components零件类型处理
  //baseGetComponent
  //baseRemoveComponent
  //baseAddComponent
  //baseSpecifiedComponent
  _.each(["Get", "Remove", "Add", "Specified"], function (type) {
    baseProto['base' + type + 'Component'] = function (data) {
      switch (type) {
        case 'Add':
          return this.componentGroup.add(data);
        case 'Get':
          return this.componentGroup.get();
        case 'Specified':
          return this.componentGroup.specified(data);
        case 'Remove':
          return this.componentGroup.remove();
      }
    };
  });

  /**
   *  运行辅助对象事件
   * @param  {[type]} activityId  [description]
   * @param  {[type]} outCallBack [description]
   * @param  {[type]} actionName  [description]
   * @return {[type]}             [description]
   */
  baseProto.baseAssistRun = function (activityId, outCallBack, actionName) {
    var activity;
    if (activity = this.activityGroup) {
      _.each(activity.get(), function (contentObj, index) {
        if (activityId == contentObj.activityId) {
          if (actionName == 'Run') {
            contentObj.runAnimation(outCallBack, true);
          }
          if (actionName == 'Stop') {
            contentObj.stopAnimation(outCallBack);
          }
        }
      }, this);
    }
  };
};

var destroy$1 = function (baseProto) {

  /**
   * 销毁页面对象
   * @return {[type]} [description]
   */
  baseProto.baseDestroy = function () {
    // console.log(this)
    // //清理图片缓存
    // //读库快速退出模式下报错修正
    // try {
    //     this.$pageNode.hide().find('img').each(function(aaa, img) {
    //         img.src = 'images/icons/clearmem.png'
    //     })
    // } catch (e) {
    //     console.log('销毁图片出错')
    // }

    //最后一页动作处理
    //for miaomiaoxue
    this.destroyPageAction();

    //2016/9/30
    //页面缩放对象
    if (this._pageScaleObj) {
      this._pageScaleObj.destroy();
      this._pageScaleObj = null;
    }

    //流式布局对象
    //2016.9.10
    var columns = this.columnGroup.get();
    if (columns && columns.length) {
      columns.forEach(function (flowObj) {
        flowObj.destroy();
      });
    }

    /**
     * 清理可能错误的img修复文件列表
     */
    clearRepairImage(this.chapterIndex);

    //清理多线程任务块
    var taskGroup = this.threadTaskRelated.assignTaskGroup;
    if (taskGroup) {
      for (var key in taskGroup) {
        var task = taskGroup[key];
        if (task) {
          task.destroy && task.destroy();
        }
      }
    }

    //浮动对象
    var floatMaterContents = this.floatGroup.masterGroup;

    //是否有浮动对象
    var hasFloatMater = !_.isEmpty(floatMaterContents);

    //清理activity类型对象
    var activitys = this.activityGroup.get();
    if (activitys && activitys.length) {
      activitys.forEach(function (activityObj) {
        activityObj.destroy(function (destroyObj) {
          //如果不是浮动对象,清理元素引用
          if (!hasFloatMater || destroyObj && !floatMaterContents[destroyObj.id]) {
            destroyObj.$contentNode = null;
          }
        });
      });
    }

    //清除母版浮动容器
    if (hasFloatMater && this.floatGroup.masterContainer) {
      this.floatGroup.masterContainer.remove();
    }

    //清除浮动页面对象
    if (this.floatGroup.pageGroup && this.floatGroup.pageContainer) {
      this.floatGroup.pageContainer.remove();
    }

    //清理零件类型对象
    var components = this.baseGetComponent();
    if (components && components.length) {
      components.forEach(function (obj) {
        obj.destroy && obj.destroy();
      });
    }

    //多事件销毁
    destroy(this);

    //伪li节点
    if (this.$pseudoElement) {
      this.$pseudoElement = null;
    }

    unWatchColumn(this);

    //移除li容器节点节点
    this.$pageNode.remove();
    this.rootNode = null;
    this.$pageNode = null;
  };
};

/**
 * 滑动容器
 * @param  {[type]} baseProto [description]
 * @return {[type]}           [description]
 */
var movePage = function (baseProto) {

  /**
   * 页面移动
   * @return {[type]} [description]
   */
  baseProto.movePage = function (action, distance, speed, viewOffset, outerCallFlip) {

    var pageNode = this.$pageNode[0];

    //浮动页面
    if (this.pageType === 'page') {
      var floatPageContainer = this.floatGroup.pageContainer;
      if (floatPageContainer) {
        translation[action](floatPageContainer[0], distance, speed);
      }
    }

    //浮动母版
    if (this.pageType === 'master') {
      //母版交接判断
      //用户事件的触发
      this.onceMaster = false;
      var floatMasterContainer = this.floatGroup.masterContainer;
      if (floatMasterContainer) {
        translation[action](floatMasterContainer[0], distance, speed);
      }
    }

    /*
    针对翻页结束的处理
     */
    var isVisual = false; // 是可视页面
    var fixQuickFlip = false; //修复翻页
    var timer = null;
    var toTranslateCB = null;

    /*
    只有翻页的时候才处理
    1 增加页面标记
    2 处理页面回调
     */
    if (action === 'flipOver') {
      /*
         如果outerCall存在，就是外部调用翻页的的情况下处理
         修复一个bug,超快速翻页的时候(speed<300)，动画结束事件会丢失页面
         所以针对这种情况，强制改speed改成0，这样动画事件完全屏蔽
         通过回调中手动调用SetSwiperFilpComplete事件处理
         这里扩大下speed的范围
       */
      if (outerCallFlip) {
        if (speed < 100) {
          speed = 0;
          fixQuickFlip = true;
        }
      }

      /*
        过滤多个动画回调
        保证指向始终是当前页面
        翻页 && 是母版页 && 是当前页面
       */
      if (this.pageType === 'page' && distance === viewOffset) {
        /*标记可视区页面*/
        isVisual = true;

        /*增加可视页面标记*/
        pageNode.setAttribute('data-visual', true);

        /*
         就上做了fixQuickFlip修复都有可能不触发动画回调的情况，
         是这里做一个手动调用的强制处理,延长原本时间的500毫秒调用
         只处理Visual页面
         这里必须监控data-visual是否被移除了，才能正确处理
         */
        timer = setTimeout(function () {
          clearTimeout(timer);
          timer = null;
          if (pageNode.getAttribute('data-visual')) {
            $warn('翻页translate回调丢失了，通过定时器手动调用修复');
            toTranslateCB = null;
            Xut.View.SetSwiperFilpComplete(pageNode, true);
          }
        }, speed + 500);
      }
    }

    /*Translate调用，通过引用方式，在定时器中可以取消*/
    toTranslateCB = function toTranslateCB() {
      /*
      2种情况下会主动触发翻页结束回调
      1.banMove，关闭了翻页效果，并且是可视区页面
      2.超快翻页的时候丢失了动画回调，并且是可视区页面
       */
      if (isVisual && (fixQuickFlip || config.launch.banMove)) {
        Xut.View.SetSwiperFilpComplete(pageNode, true);
        return true;
      }
    };

    translation[action](pageNode, distance, speed, toTranslateCB);
  };
};

/**
 * 移动视觉差对象
 */
var translateParallax = function translateParallax(_ref) {
  var $contentNode = _ref.$contentNode,
      scope = _ref.scope,
      direction = _ref.direction,
      pageIndex = _ref.pageIndex,
      action = _ref.action,
      speed = _ref.speed,
      nodes = _ref.nodes,
      distance = _ref.distance,
      isColumn = _ref.isColumn;


  var lastProperty = scope.lastProperty;
  var targetProperty = scope.targetProperty;

  //往前翻页
  if (direction === 'prev') {
    //分割的比例
    var nodeRatio = scope.nodeRatio;

    //如果往前溢出则取0
    nodes = nodes == nodeRatio ? 0 : nodeRatio;
  }

  //每次单步变化属性值
  var stepProperty = getStepProperty({
    nodes: nodes,
    isColumn: isColumn,
    distance: distance,
    lastProperty: lastProperty,
    pageIndex: pageIndex,
    targetProperty: targetProperty
  });

  switch (action) {
    case 'flipMove':
      //移动中
      stepProperty = flipMove(stepProperty, lastProperty);
      break;
    case 'flipRebound':
      //反弹
      stepProperty = flipRebound(stepProperty, lastProperty);
      break;
    case 'flipOver':
      if (direction === 'prev') {
        stepProperty = flipOver(stepProperty, lastProperty);
      }

      //缩放单独处理
      //因为缩放是从1开始的
      //所以每次计算出单步的值后，需要叠加原始的值1
      if (direction === 'next') {
        if (stepProperty.scaleX !== undefined) {
          stepProperty.scaleX = stepProperty.scaleX + 1;
        }
        if (stepProperty.scaleY !== undefined) {
          stepProperty.scaleY = stepProperty.scaleY + 1;
        }
        if (stepProperty.scaleZ !== undefined) {
          stepProperty.scaleZ = stepProperty.scaleZ + 1;
        }
      }

      //翻页结束,记录上一页的坐标
      cacheProperty(stepProperty, lastProperty);
      break;
  }

  // if($contentNode[0].id === 'Content_1_4'){
  //     console.log(stepProperty)
  // }


  //直接操作元素
  setStyle({
    $contentNode: $contentNode,
    action: 'master',
    interaction: action,
    pageIndex: pageIndex,
    targetProperty: targetProperty,
    property: stepProperty,
    speed: speed,
    opacityStart: lastProperty.opacityStart
  });
};

/**
 * 滑动
 * @param  {[type]} baseProto [description]
 * @return {[type]}           [description]
 */
var moveParallax = function (baseProto) {

  /**
   * 移动视察对象
   */
  baseProto.moveParallax = function (_ref2) {
    var action = _ref2.action,
        direction = _ref2.direction,
        moveDistance = _ref2.moveDistance,
        pageIndex = _ref2.pageIndex,
        speed = _ref2.speed,
        nodes = _ref2.nodes,
        parallaxProcessedContetns = _ref2.parallaxProcessedContetns;


    var base = this;
    var baseContents = this.baseGetContent();

    if (!baseContents) {
      return;
    }

    //是珊栏页面，那么翻页的参数需要转化
    var isColumn = base.getStyle.pageVisualMode === 1;

    //移动距离
    var distance = moveDistance.length ? moveDistance[1] : moveDistance;

    //遍历所有活动对象
    _.each(baseContents, function (content) {
      content.eachAssistContents(function (scope) {
        //如果是视察对象移动
        if (scope.parallax) {

          var $contentNode = scope.parallax.$contentNode;

          /**
           * 如果有这个动画效果
           * 先停止否则通过视觉差移动会出问题
           * 影响，摩天轮转动APK
           * 重新激动视觉差对象
           * 因为视察滑动对象有动画
           * 2个CSS3动画冲突的
           * 所以在视察滑动的情况下先停止动画
           * 然后给每一个视察对象打上对应的hack=>data-parallaxProcessed
           * 通过动画回调在重新加载动画
           */
          if (parallaxProcessedContetns) {
            var contentObj = base.baseGetContentObject(scope.id);
            if (contentObj && action === "flipMove" && contentObj.pptObj && //ppt动画
            !contentObj.parallaxProcessed) {
              //标记
              var actName = contentObj.actName;
              contentObj.stop && contentObj.stop();
              //视觉差处理一次,停止过动画
              contentObj.parallaxProcessed = true;
              //增加标记
              $contentNode.attr('data-parallaxProcessed', actName);
              //记录
              parallaxProcessedContetns[actName] = contentObj;
            }
          }

          //移动视觉差对象
          translateParallax({
            pageIndex: pageIndex,
            $contentNode: $contentNode,
            scope: scope.parallax,
            direction: direction,
            action: action,
            speed: speed,
            nodes: nodes,
            distance: distance,
            isColumn: isColumn
          });
        }
      });
    });
  };
};

/*********************************************************************
 *                 构建页面对象
 *             实现目标：
 *                快速翻页
 *                最快中断任务
 *                提高优先级
 *
 *             1 构建四个大任务，每个大人物附属一堆小任务
 *             2 每次触发一个新的任务，都会去检测是否允许创建的条件
 *
 *  2014.11.18
 *  新增canvan模式
 *    contentMode 分为  0 或者 1
 *    0 是dom模式
 *    1 是canvas模式
 *    以后如果其余的在增加
 *    针对页面chapter中的parameter写入 contentMode   值为 1
 *    如果是canvas模式的时候，同时也是能够存在dom模式是
 *
 *                                                         *
 **********************************************************************/

var Pagebase = function Pagebase(options) {
  classCallCheck(this, Pagebase);

  this.init(options);
};

var baseProto = Pagebase.prototype;

initstate(baseProto);
threadCheck(baseProto);
threadExternal(baseProto);
dataExternal(baseProto);
movePage(baseProto);
moveParallax(baseProto);
destroy$1(baseProto);

/**
 * 利用canvas绘制出蒙板效果替换，需要蒙板效果的图片先用一个canvas占位，绘制是异步的
 */

function _getCanvas(className) {
  var children = document.getElementsByTagName('canvas'),
      elements = new Array(),
      i = 0,
      child,
      classNames,
      j = 0;
  for (i = 0; i < children.length; i++) {
    child = children[i];
    classNames = child.className.split(' ');
    for (var j = 0; j < classNames.length; j++) {
      if (classNames[j] == className) {
        elements.push(child);
        break;
      }
    }
  }
  return elements;
}

function _addEdge(canvas) {

  var img = new Image(),
      maskimg = new Image();

  var classNames = canvas.className.split(' ');
  var context = canvas.getContext("2d");
  img.addEventListener("load", loadimg);
  maskimg.addEventListener("load", loadmask);

  function loadimg() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = "source-over";
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    maskimg.src = canvas.getAttribute("mask");
    img.removeEventListener("load", loadimg);
    img.src = null;
    img = null;
  }

  function loadmask() {
    context.globalCompositeOperation = "destination-atop";
    context.drawImage(maskimg, 0, 0, canvas.width, canvas.height);
    canvas.style.opacity = 1;
    maskimg.removeEventListener("load", loadmask);
    maskimg.src = null;
    maskimg = null;
    context = null;
    classNames = null;
    canvas.className = canvas.className.replace("edges", "");
  }
  img.src = canvas.getAttribute("src");
}

function addEdges() {
  var thecanvas = _getCanvas('edges'),
      i;
  for (i = 0; i < thecanvas.length; i++) {
    _addEdge(thecanvas[i]);
  }
}

/**
 * 判断是否能整除2
 * @param  {[type]} num [description]
 * @return {[type]}     [description]
 */


/**
 * 页面之间关系
 * createIndex 创建的页面
 * visualIndex 可视区页面
 * 有横竖布局
 *   所以根据全局的scrollMode参数而定
 */
function getPosition(createIndex, visualIndex) {
  var isVertical = config.launch.scrollMode === 'v';
  var direction = void 0;
  if (createIndex < visualIndex) {
    direction = isVertical ? 'top' : 'left';
  } else if (createIndex > visualIndex) {
    direction = isVertical ? 'bottom' : 'right';
  } else if (visualIndex == createIndex) {
    direction = 'middle';
  }
  return direction;
}

var mixRang = function mixRang(pageIndex, start) {
  return pageIndex.map(function (oldPageIndex) {
    return oldPageIndex - start;
  });
};

/**
 * 如果是场景加载，转化页码数
 * 转化按0开始
 * pageIndex 页码
 * visualPageIndex 可见页面chpaterId
 */
function converVisualPid(options, chapterIndex, visualPageIndex) {

  //转化可视区域值viewPageIndex
  if (options.hasMultiScene) {
    var sectionRang = options.sectionRang;
    //如果传入的是数组数据
    if (!visualPageIndex && _.isArray(chapterIndex)) {
      return mixRang(chapterIndex, sectionRang.start);
    }
    chapterIndex -= sectionRang.start;
    visualPageIndex += sectionRang.start;
  } else {
    //pageIndex是数组，并且realPage为空
    if (_.isArray(chapterIndex)) {
      return chapterIndex;
    }
  }
  return {
    pageIndex: chapterIndex,
    visualChapterIndex: visualPageIndex
  };
}

/**
 * 计算初始化页码
 */
function initPointer$1(targetIndex, pageTotal, hasMultiPage) {

  var leftscope = 0,
      initPointer = {},
      createPointer = [];

  function setValue(pointer) {
    if (pointer.frontIndex !== undefined) {
      initPointer.frontIndex = pointer.frontIndex;
      createPointer.push(pointer.frontIndex);
    }
    if (pointer.middleIndex !== undefined) {
      initPointer.middleIndex = pointer.middleIndex;
      createPointer.push(pointer.middleIndex);
    }
    if (pointer.backIndex !== undefined) {
      initPointer.backIndex = pointer.backIndex;
      createPointer.push(pointer.backIndex);
    }
  }

  //如果只有一页 or  非线性,只创建一个页面
  if (pageTotal === 1 || !hasMultiPage) {
    setValue({
      'middleIndex': targetIndex
    });
  } else {
    //多页情况
    if (targetIndex === leftscope) {
      //首页
      setValue({
        'middleIndex': targetIndex,
        'backIndex': targetIndex + 1
      });
    } else if (targetIndex === pageTotal - 1) {
      //尾页
      setValue({
        'middleIndex': targetIndex,
        'frontIndex': targetIndex - 1
      });
    } else {
      //中间页
      setValue({
        'middleIndex': targetIndex,
        'frontIndex': targetIndex - 1,
        'backIndex': targetIndex + 1
      });
    }
  }

  return {
    createPointer: createPointer,
    initPointer: initPointer
  };
}

/*
页面页面，转化双页面
///启动了双页模式
///创建的页面需要修改了索引处理
///创建索引0
/// 变化成 0-1
///以此类推
needTotal 为true 就是返回带total的合集
1 返回带needTotal的合集
2 返回单页转化的双页数组
 */
function converDoublePage(createPointer, needTotal) {

  /////////////////////////////////////
  ///
  ///启动了双页模式
  ///创建的页面需要修改了索引处理
  ///创建索引0
  /// 变化成 0-1
  ///以此类推
  /////////////////////////////////////
  var createDoublePage = {};

  /*记录总数*/
  var total = 0;

  if (createPointer == undefined) {
    return createDoublePage;
  }

  if (config.launch.doublePageMode) {
    var base = void 0,
        left = void 0,
        right = void 0;
    if (!createPointer.length) {
      createPointer = [createPointer];
    }
    createPointer.forEach(function (index) {
      if (index === 0) {
        createDoublePage[index] = [0, 1];
        total += 2;
      } else {
        base = index * 2;
        left = base;
        right = base + 1;
        total += 2;
        (createDoublePage[index] = []).push(left, right);
      }
    });
  }

  if (needTotal) {
    createDoublePage.total = total;
    return createDoublePage;
  }

  /*createPointer => [0]
    createDoublePage => [0,1]*/
  return createDoublePage[createPointer[0]];
}

/*
获取页面处理的合集，保持接口处理一致，判断逻辑封装
1.双页
2.单页
return []
 */
function getRealPage(pageIndex, type) {

  if (pageIndex === undefined) {
    // $warn(`${type}调用getRealPage传递pageIndex为空`)
    return [];
  }

  if (config.launch.doublePageMode) {
    /*转化后的页面合集*/
    var pageIds = converDoublePage(pageIndex);
    /*双页*/
    if (pageIds.length) {
      return pageIds;
    }
  }

  return [pageIndex];
}

/**
  1 加快页面解析，可视区页面最开始创建
  2 双页面页码解析
  3 场景加载模式,计算正确的chapter顺序
  进入 [0,1,2]
  出来
      1 单页面 [1,0,2]
      2 多页面 [2, 3, 0, 1, 4, 5]
 * createSinglePage 需要创建的页面
 * visualPageIndex 可视区页面
 * createDoublePage 多页面索引
 */
function converChapterIndex(options, createSinglePage, createDoublePage, visualPageIndex) {

  var cloneCreateSinglePage = _.extend([], createSinglePage);

  /*
    保证可视区优先创建
    如果最先创建的的页面不是可视区页面
    就需要切换对应的
   */
  if (cloneCreateSinglePage[0] !== visualPageIndex) {
    var indexOf = cloneCreateSinglePage.indexOf(visualPageIndex);
    var less = cloneCreateSinglePage.splice(indexOf, 1);
    cloneCreateSinglePage = less.concat(cloneCreateSinglePage);
  }

  //如果有双页面，那么转化是页面就是这个了
  //而不是传递的createPage单页面
  //[1,0,2] => [2,3,1,2,4,5]
  if (createDoublePage.total) {
    var newCreatePage = [];
    cloneCreateSinglePage.forEach(function (pageIndex) {
      var doublePage = createDoublePage[pageIndex];
      if (doublePage.length) {
        newCreatePage.push(doublePage[0]);
        if (doublePage[1]) {
          newCreatePage.push(doublePage[1]);
        }
      }
    });
    cloneCreateSinglePage = newCreatePage;
  }

  //场景加载模式,计算正确的chapter顺序
  //多场景的模式chpater分段后
  //叠加起始段落
  if (options.hasMultiScene) {
    //需要提前解析数据库的排列方式
    //chpater的开始位置
    var start = options.sectionRang.start;
    cloneCreateSinglePage.forEach(function (page, index) {
      cloneCreateSinglePage.splice(index, 1, page + start);
    });
  }

  // [0,1,2] => [73,74,75]
  return cloneCreateSinglePage;
}

/**
 * 页码转化成相对应的chpater表数据
 * @param  {[type]} createPage [description]
 * @return {[type]}            [description]
 */
function converChapterData(createPage) {
  return query('chapter', createPage);
}

/**
 * 检测是否构建母板模块处理
 * @return {[type]} [description]
 */
function hasMaster() {
  var table = errorTable();
  //如果没有Master数据,直接过滤
  if (-1 !== table.indexOf('Master') || !Xut.data['Master'] || !Xut.data['Master'].length) {
    return false;
  }
  return true;
}

/**
 * 页面模块
 * @param  {[type]}
 * @return {[type]}
 */
/**
 * 检测脚本注入
 * @return {[type]} [description]
 */
var runScript$1 = function runScript(pageObject, type) {
  var code = pageObject.chapterData[type];
  if (code) {
    execScript(code, type);
  }
};

var PageMgr = function (_ManageSuper) {
  inherits(PageMgr, _ManageSuper);

  function PageMgr(rootNode) {
    classCallCheck(this, PageMgr);

    var _this = possibleConstructorReturn(this, (PageMgr.__proto__ || Object.getPrototypeOf(PageMgr)).call(this));

    _this.rootNode = rootNode;
    _this.pageType = 'page';

    /*
    双页模式，给父节点绑定一个翻页监听事件
    如果翻页完成，手动触发翻页事件
    */
    if (config.launch.doublePageMode) {
      $on(rootNode, {
        transitionend: function transitionend() {
          Xut.View.SetSwiperFilpComplete();
        }
      });
    }
    return _this;
  }

  /*设置页面的初始化的translate值*/


  createClass(PageMgr, [{
    key: 'setInitTranslate',
    value: function setInitTranslate(pageIndex) {
      if (config.launch.doublePageMode) {
        var distance = config.screenSize.width * pageIndex;
        Xut.style.setTranslate({
          x: -distance,
          node: this.rootNode
        });
      }
    }

    /**
     * 创建页新的页面
     * @param  {[type]} dataOpts  [description]
     * @param  {[type]} pageIndex [description]
     * @return {[type]}           [description]
     */

  }, {
    key: 'create',
    value: function create(dataOpts, pageIndex) {
      //生成指定页面对象
      var pageObjs = new Pagebase(_.extend(dataOpts, {
        'pageType': this.pageType, //创建页面的类型
        'rootNode': this.rootNode //根元素
      }));

      //增加页面管理
      this._$$addBaseGroup(pageIndex, pageObjs);
      return pageObjs;
    }

    /*
    滑动页面容器
     */

  }, {
    key: '_moveContainer',
    value: function _moveContainer(distance, speed) {
      Xut.style.setTranslate({
        speed: speed,
        x: distance,
        node: this.rootNode
      });
    }

    /**
     * 移动页面
     * @return {[type]}
     */

  }, {
    key: 'move',
    value: function move(data) {
      var speed = data.speed,
          action = data.action,
          outerCallFlip = data.outerCallFlip,
          moveDistance = data.moveDistance,
          frontIndex = data.frontIndex,
          middleIndex = data.middleIndex,
          backIndex = data.backIndex;

      /*双页模式，移动父容器*/

      if (config.launch.doublePageMode) {
        this._moveContainer(moveDistance[1], speed);
      } else {
        /*单页模式，移动每个独立的页面*/
        _.each([this.$$getPageBase(frontIndex), this.$$getPageBase(middleIndex), this.$$getPageBase(backIndex)], function (pageObj, index) {
          var dist = moveDistance[index];
          if (pageObj && dist !== undefined) {
            pageObj.movePage(action, dist, speed, moveDistance[3], outerCallFlip);
          }
        });
      }
    }

    /**
     * 触屏翻页开始
     * 1 中断所有任务
     * 2 停止热点对象运行
     *     停止动画,视频音频等等
     */

  }, {
    key: 'suspend',
    value: function suspend(frontIndex, middleIndex, backIndex, stopIndex) {

      var suspendPageObj = this.$$getPageBase(stopIndex);
      var prveChapterId = suspendPageObj.baseGetPageId(stopIndex);

      /*如果有代码跟踪*/
      if (suspendPageObj.startupTime) {
        config.sendTrackCode('flip', {
          pageId: suspendPageObj.chapterId,
          time: +new Date() - suspendPageObj.startupTime
        });
      }

      //翻页结束脚本
      runScript$1(suspendPageObj, 'postCode');
      //中断节点创建任务
      this._suspendInnerCreateTasks(frontIndex, middleIndex, backIndex);
      //停止活动对象活动
      suspendPageObj.destroyPageAction();
      suspendPageObj.resetSwipeSequence();
      $suspend(suspendPageObj, prveChapterId);
    }

    /**
     * 复位初始状态
     * 转化：双页
     * @return {[type]} [description]
     */

  }, {
    key: 'resetOriginal',
    value: function resetOriginal(pageIndex) {
      var _this2 = this;

      var originalIds = getRealPage(pageIndex, 'resetOriginal');
      originalIds.forEach(function (originaIndex) {
        var originalPageObj = _this2.$$getPageBase(originaIndex);
        if (originalPageObj) {
          var floatPageContainer = originalPageObj.floatGroup.pageContainer;
          if (floatPageContainer) {
            //float-Pages设置的content溢出后处理
            //在非视区增加overflow:hidden
            //可视区域overflow:''
            floatPageContainer.css({ 'zIndex': 2000, 'overflow': 'hidden' });
          }
          $original(originalPageObj);
        }
      });
    }

    /**
     * 触屏翻页完成
     * 转化：双页
     * 1 停止热点动作
     * 2 触发新的页面动作
     */

  }, {
    key: 'autoRun',
    value: function autoRun(data) {
      var _this3 = this;

      var createPointer = data.createPointer,
          frontIndex = data.frontIndex,
          middleIndex = data.middleIndex,
          backIndex = data.backIndex,
          suspendIndex = data.suspendIndex,
          isQuickTurn = data.isQuickTurn,
          direction = data.direction;


      var self = this;

      /**
       * 预执行背景创建
       * 支持多线程快速翻页
       * 1 初始化,或者快速翻页补全前后页面
       * 2 正常翻页创建前后
       */
      var preCreateTask = function preCreateTask(taskName) {
        var resumePointer = void 0;
        if (isQuickTurn || !direction) {
          //init
          resumePointer = [frontIndex, backIndex];
        } else {
          //flip
          resumePointer = createPointer || backIndex || frontIndex;
        }
        _this3._checkPreforkTasks(resumePointer, taskName);
      };

      /*激活自动运行对象*/
      var activateAutoRun = function activateAutoRun(pageObj, data) {

        //结束通知
        var _complete = function _complete() {
          data.processComplete();
          preCreateTask();
        };

        //运行动作
        var _startRun = function _startRun() {
          $autoRun(pageObj, middleIndex, _complete);
        };

        //如果页面容器存在,才处理自动运行
        var currpageNode = pageObj.getContainsNode();
        if (!currpageNode) {
          return _complete();
        }

        //运行如果被中断,则等待
        if (data.suspendCallback) {
          data.suspendCallback(_startRun);
        } else {
          _startRun();
        }
      };

      /*检测页面是否已经完全创建完毕，并且返回页面对象*/
      this._checkTaskCompleted(middleIndex, function (activatePageObj) {

        /*跟踪，每个页面的停留时间，开始*/
        if (config.hasTrackCode('flip')) {
          activatePageObj.startupTime = +new Date();
        }

        /*watch('complete')方法调用*/
        activatePageObj.createPageAction();

        /*提升当前页面浮动对象的层级,因为浮动对象可以是并联的*/
        var floatPageContainer = activatePageObj.floatGroup.pageContainer;
        if (floatPageContainer) {
          floatPageContainer.css({ 'zIndex': 2001, 'overflow': '' });
        }

        /*IE上不支持蒙版效果的处理*/
        if (Xut.style.noMaskBoxImage) {
          addEdges();
        }

        /*构建完成通知*/
        data.buildComplete(activatePageObj.seasonId);

        /*执行自动动作之前的脚本*/
        runScript$1(activatePageObj, 'preCode');

        /*热点状态复位,多页也只运行一次*/
        self.resetOriginal(suspendIndex);

        /*预构建背景*/
        preCreateTask('background');

        //等待动画结束后构建
        activateAutoRun(activatePageObj, data);
      });
    }

    /**
     * 销毁单个页面的对象
     * 这里不包含管理对象
     * 移除页面对象
     */

  }, {
    key: 'clearPage',
    value: function clearPage(clearPageIndex) {
      var pageObj = this.$$getPageBase(clearPageIndex);
      if (pageObj) {
        pageObj.baseDestroy();
        this._$$removeBaseGroup(clearPageIndex);
      }
    }

    /**
     * 一般退出页面处理
     * 销毁整个页面管理对象
     * 包含所有页面与管理对象
     * @return {[type]} [description]
     */

  }, {
    key: 'destroyManage',
    value: function destroyManage() {
      //清理视频
      var pageId = Xut.Presentation.GetPageId(Xut.Presentation.GetPageIndex());

      removeVideo(pageId);

      //清理对象
      this._$$destroyBaseGroup();

      //销毁事件
      if (config.launch.doublePageMode) {
        $off(this.rootNode);
      }

      //清理节点
      this.rootNode = null;
    }

    /**
     * 设置中断正在创建的页面对象任务
     */

  }, {
    key: '_suspendInnerCreateTasks',
    value: function _suspendInnerCreateTasks(frontIndex, middleIndex, backIndex) {
      var self = this;

      /*设置中断任务
      1.如果没有参数返回
      2.保证数组格式遍历*/
      var suspendTask = function suspendTask(pageIndex) {
        if (pageIndex !== undefined) {
          if (!pageIndex.length) {
            pageIndex = [pageIndex];
          }
          var pageObj = void 0;
          pageIndex.forEach(function (pointer) {
            if (pageObj = self.$$getPageBase(pointer)) {
              pageObj.setTaskSuspend();
            }
          });
        }
      };

      suspendTask(frontIndex);
      suspendTask(middleIndex);
      suspendTask(backIndex);
    }

    /*检测活动窗口任务*/

  }, {
    key: '_checkTaskCompleted',
    value: function _checkTaskCompleted(currIndex, callback) {
      var currPageObj = this.$$getPageBase(currIndex);
      if (currPageObj) {
        currPageObj.checkThreadTaskComplete(function () {
          // console.log('11111111111当前页面创建完毕',currIndex+1)
          callback(currPageObj);
        });
      }
    }

    /**
     * 检测后台预创建任务
     * @return {[type]} [description]
     */

  }, {
    key: '_checkPreforkTasks',
    value: function _checkPreforkTasks(resumePointer, preCreateTask) {
      var resumeObj, resumeCount;
      if (!resumePointer.length) {
        resumePointer = [resumePointer];
      }
      resumeCount = resumePointer.length;
      while (resumeCount--) {
        if (resumeObj = this.$$getPageBase(resumePointer[resumeCount])) {
          resumeObj.createPreforkTask(function () {
            // console.log('后台处理完毕')
          }, preCreateTask);
        }
      }
    }
  }]);
  return PageMgr;
}(ManageSuper);

/*
 * 母版管理模块
 * @param  {[type]}
 * @return {[type]}
 */
/**
 * 扁平化对象到数组
 * @param  {[type]} filter [description]
 * @return {[type]}        [description]
 */
var toArray$2 = function toArray$$1(filter) {
  var arr = [];
  if (!filter.length) {
    for (var key in filter) {
      arr.push(filter[key]);
    }
    filter = arr;
  }
  return filter;
};

var rword = "-";

/**
 * parallaObjsCollection: Object
 *      0: Page
 *      1: Page
 *
 *  recordMasterId: Object
 *      0: 9001
 *      1: 9001
 *
 *  recordMasterRange: Object
 *      9001: Array[2]
 *
 *  rootNode: ul # parallax.xut - parallax xut - flip
 *
 *  currMasterId: 9001 //实际的可使区
 */

var MasterMgr = function (_ManageSuper) {
  inherits(MasterMgr, _ManageSuper);

  function MasterMgr(rootNode) {
    classCallCheck(this, MasterMgr);

    var _this = possibleConstructorReturn(this, (MasterMgr.__proto__ || Object.getPrototypeOf(MasterMgr)).call(this));

    _this.visualWidth = config.visualSize.width;
    _this.visualHeight = config.visualSize.height;

    _this.pageType = 'master';

    _this.rootNode = rootNode;
    _this.recordMasterRange = {}; //记录master区域范围
    _this.recordMasterId = {}; //记录页面与母板对应的编号
    _this.currMasterId = null; //可视区母板编号

    /**
     * 记录视察处理的对象
     * @type {Object}
     */
    _this.parallaxProcessedContetns = {};
    return _this;
  }

  /**
   * 注册状态管理
   */


  createClass(MasterMgr, [{
    key: 'register',
    value: function register(pageIndex, type, hotspotObj) {
      var parallaxObj = this.$$getPageBase(this.converMasterId(pageIndex));
      if (parallaxObj) {
        parallaxObj.registerCotents.apply(parallaxObj, arguments);
      }
    }

    /**
     * 创建
     */

  }, {
    key: 'create',
    value: function create(dataOpts, pageIndex, createCallBack, repeatCallBack) {
      var reuseMasterKey = void 0;
      var pptMaster = dataOpts.chapterData.pptMaster;
      var pageOffset = dataOpts.chapterData.pageOffset;

      //母板复用的标示
      var reuseMasterId = pageOffset && pageOffset.split(rword);

      //组合下标
      if (reuseMasterId && reuseMasterId.length === 3) {
        reuseMasterKey = pptMaster + rword + reuseMasterId[2];
      } else {
        reuseMasterKey = pptMaster;
      }

      //检测母版已经创建
      if (this._hasMaster(reuseMasterKey, pageOffset, pageIndex)) {
        if (config.debug.devtools) {
          //重复的母版对象
          //用于检测页面模式是否一致
          var currMasterObj = this.$$getPageBase(reuseMasterKey);
          currMasterObj && repeatCallBack(currMasterObj);
        }
        return;
      }

      //通知外部,需要创建的母版
      createCallBack();

      var masterObj = new Pagebase(_.extend(dataOpts, {
        pptMaster: pptMaster, //ppt母板ID
        'pageType': this.pageType, //创建页面的类型
        'rootNode': this.rootNode //根元素
      }));

      //增加页面管理
      this._$$addBaseGroup(reuseMasterKey, masterObj);

      return masterObj;
    }

    /**
     * 页面滑动处理
     * 1 母版之间的切换
     * 2 浮动对象的切换
     */

  }, {
    key: 'move',
    value: function move(options, isAppBoundary) {
      var _this2 = this;

      var nodes = options.nodes,
          speed = options.speed,
          action = options.action,
          moveDistance = options.moveDistance,
          direction = options.direction,
          frontIndex = options.frontIndex,
          middleIndex = options.middleIndex,
          backIndex = options.backIndex;

      //是边界处理
      //边界外处理母版
      //边界内处理视觉差

      var isBoundary = false;

      //找到需要滑动的母版
      var masterObjs = this._findMaster(frontIndex, middleIndex, backIndex, direction, action, isAppBoundary);

      _.each(masterObjs, function (pageObj, index) {
        if (pageObj) {
          isBoundary = true;
          pageObj.movePage(action, moveDistance[index], speed, moveDistance[3]);
        }
      });

      //越界不需要处理内部视察对象
      this.isBoundary = isBoundary;
      if (isBoundary) {
        return;
      }

      /**
       * 移动内部的视察对象
       * 处理当前页面内的视觉差对象效果
       */
      var moveParallaxObject = function moveParallaxObject(nodes) {
        var getMasterId = _this2.converMasterId(middleIndex);
        var currParallaxObj = _this2.$$getPageBase(getMasterId);
        if (currParallaxObj) {
          //处理当前页面内的视觉差对象效果
          currParallaxObj.moveParallax({
            action: action,
            direction: direction,
            speed: speed,
            nodes: nodes,
            moveDistance: moveDistance,
            parallaxProcessedContetns: _this2.parallaxProcessedContetns
          });
        }
      };

      //移动视察对象
      switch (direction) {
        case 'prev':
          moveParallaxObject();
          break;
        case 'next':
          nodes && moveParallaxObject(nodes);
          break;
      }
    }

    /**
     * 停止行为
     * @return {[type]} [description]
     */

  }, {
    key: 'suspend',
    value: function suspend(stopPointer) {
      //如果未越界不需要处理行为
      if (!this.isBoundary) return;
      var masterObj = void 0;
      if (masterObj = this.$$getPageBase(stopPointer)) {
        var pageId = masterObj.baseGetPageId(stopPointer);
        //停止活动对象活动
        $suspend(masterObj, pageId);
      }
    }

    /**
     * 复位初始状态
     * @return {[type]} [description]
     */

  }, {
    key: 'resetOriginal',
    value: function resetOriginal(pageIndex) {
      var originalPageObj;
      if (originalPageObj = this.$$getPageBase(pageIndex)) {
        $original(originalPageObj);
      }
    }

    /**
     *  母版自动运行
     */

  }, {
    key: 'autoRun',
    value: function autoRun(data) {
      var middleIndex = data.middleIndex,
          suspendIndex = data.suspendIndex;


      var masterObj;
      if (masterObj = this.$$getPageBase(middleIndex)) {
        //热点状态复位
        this.resetOriginal(suspendIndex);
        $autoRun(masterObj, middleIndex);
      }
    }

    /**
     * 重新激动视觉差对象
     * 因为视察滑动对象有动画
     * 2个CSS3动画冲突的
     * 所以在视察滑动的情况下先停止动画
     * 然后给每一个视察对象打上对应的hack=>data-parallaxProcessed
     * 通过动画回调在重新加载动画
     * @return {[type]} [description]
     */

  }, {
    key: 'reactivation',
    value: function reactivation(target) {
      if (this.parallaxProcessedContetns) {
        var actName = target.id;
        var contentObj = this.parallaxProcessedContetns[actName];
        if (contentObj) {
          contentObj.runAnimations();
          //视觉差处理一次,停止过动画
          contentObj.parallaxProcessed = false;
          //移除标记
          target.removeAttribute('data-parallaxProcessed');
          //记录
          delete this.parallaxProcessedContetns[actName];
        }
      }
    }

    /**
     * 制作处理器
     * 针对跳转页面
     */

  }, {
    key: 'makeJumpPocesss',
    value: function makeJumpPocesss(targetIndex) {
      var filter;
      var master = this;
      return {
        pre: function pre() {
          //目标母板对象
          var targetkey = master.converMasterId(targetIndex);
          //得到过滤的边界keys
          //在filter中的页面为过滤
          filter = master._scanBounds(targetIndex, targetkey);
          //清理多余母板
          //filter 需要保留的范围
          master._checkClear(filter, true);
          //更新可视母板编号
          master.currMasterId = targetkey;
        },
        //修正位置
        clean: function clean(visualIndex, targetIndex) {
          master._fixPosition(filter);
          master._checkParallaxPox(visualIndex, targetIndex);
        }
      };
    }

    /**
     * 销毁整页面管理对象
     * 退出应用处理
     * @return {[type]} [description]
     */

  }, {
    key: 'destroyManage',
    value: function destroyManage() {
      this.rootNode = null;
      //销毁对象
      this._$$destroyBaseGroup();
    }

    /**
     * 找到当前页面的可以需要滑动是视觉页面对象
     * isAppBoundary 是应用边界反弹，##317,最后一页带有视觉差反弹出错,视觉差不归位
     */

  }, {
    key: '_findMaster',
    value: function _findMaster(frontIndex, middleIndex, backIndex, direction, action, isAppBoundary) {
      var prevFlag = void 0,
          nextFlag = void 0,
          prevMasterId = void 0,
          nextMasterId = void 0,
          prevMasterObj = void 0,
          currMasterObj = void 0,
          nextMasterObj = void 0,
          currMasterId = this.converMasterId(middleIndex);

      switch (direction) {
        case 'prev':
          prevMasterId = this.converMasterId(frontIndex);
          prevFlag = currMasterId !== prevMasterId;

          //如果2个页面不一样的视觉差
          //或者是应用最后一页反弹的情况，2个页面同一个视觉差，也就是最后一页，往前面反弹
          if (prevFlag || isAppBoundary) {
            currMasterObj = this.$$getPageBase(currMasterId);
          }

          if (prevMasterId && prevFlag) {
            action === 'flipOver' && this._checkClear([currMasterId, prevMasterId]); //边界清理
            prevMasterObj = this.$$getPageBase(prevMasterId);
          }

          break;
        case 'next':
          nextMasterId = this.converMasterId(backIndex);
          nextFlag = currMasterId !== nextMasterId;
          if (nextFlag) {
            currMasterObj = this.$$getPageBase(currMasterId);
          }
          if (nextMasterId && nextFlag) {
            action === 'flipOver' && this._checkClear([currMasterId, nextMasterId]); //边界清理
            nextMasterObj = this.$$getPageBase(nextMasterId);
          }
          break;
      }
      return [prevMasterObj, currMasterObj, nextMasterObj];
    }

    //扫描边界
    //扫描key的左右边界
    //当前页面的左右边

  }, {
    key: '_scanBounds',
    value: function _scanBounds(currPage, currkey) {
      var currKey = this.converMasterId(currPage),
          filter = {},
          i = currPage,
          prevKey,
          nextKey;

      //往前
      while (i--) {
        prevKey = this.converMasterId(i);
        if (prevKey && prevKey !== currkey) {
          filter['prev'] = prevKey;
          break;
        }
      }

      //往后
      nextKey = this.converMasterId(currPage + 1);

      //如果有下一条记录
      if (nextKey && nextKey !== currkey) {
        //如果不是当期页面满足范围要求
        filter['next'] = nextKey;
      }

      //当前页面
      if (currKey) {
        filter['curr'] = currKey;
      }
      return filter;
    }

    /**
     * 修正位置
     * @param  {[type]} filter [description]
     * @return {[type]}        [description]
     */

  }, {
    key: '_fixPosition',
    value: function _fixPosition(filter) {

      var self = this;

      var setPosition = function setPosition(parallaxObj, position) {

        /**
         * 设置移动
         */
        var _fixToMove = function _fixToMove(distance, speed) {
          var $pageNode = parallaxObj.$pageNode;
          if ($pageNode) {
            Xut.style.setTranslate({
              speed: speed,
              x: distance,
              node: $pageNode
            });
          }
        };

        if (position === 'prev') {
          _fixToMove(-self.visualWidth);
        } else if (position === 'next') {
          _fixToMove(self.visualWidth);
        } else if (position === 'curr') {
          _fixToMove(0);
        }
      };

      for (var key in filter) {
        switch (key) {
          case 'prev':
            setPosition(this.$$getPageBase(filter[key]), 'prev');
            break;
          case 'curr':
            setPosition(this.$$getPageBase(filter[key]), 'curr');
            break;
          case 'next':
            setPosition(this.$$getPageBase(filter[key]), 'next');
            break;
        }
      }
    }
  }, {
    key: '_checkParallaxPox',
    value: function _checkParallaxPox(currPageIndex, targetIndex) {
      var key,
          pageObj,
          pageCollection = this._$$getBaseGroup();
      for (key in pageCollection) {
        pageObj = pageCollection[key];
        //跳跃过的视觉容器处理
        this._fixParallaxPox(pageObj, currPageIndex, targetIndex);
      }
    }

    /**
     * 当前同一视觉页面作用的范围
     * @param  {[type]} reuseMasterKey [description]
     * @param  {[type]} pageIndex      [description]
     * @return {[type]}                [description]
     */

  }, {
    key: '_toRepeat',
    value: function _toRepeat(reuseMasterKey, pageIndex) {
      var temp;
      if (temp = this.recordMasterRange[reuseMasterKey]) {
        return temp;
      }
      return false;
    }

    //更新母板作用域范围
    //recordMasterRange:{
    //   9001-1:[0,1], master 对应记录的页码
    //   9002-1:[2,3]
    //   9001-2:[4,5]
    //}

  }, {
    key: '_updataMasterscope',
    value: function _updataMasterscope(reuseMasterKey, pageIndex) {
      var scope;
      if (scope = this.recordMasterRange[reuseMasterKey]) {
        if (-1 === scope.indexOf(pageIndex)) {
          scope.push(pageIndex);
        }
      } else {
        this.recordMasterRange[reuseMasterKey] = [pageIndex];
      }
    }

    /**
     * 记录页面与模板标示的映射
     */

  }, {
    key: '_updatadParallaxMaster',
    value: function _updatadParallaxMaster(reuseMasterKey, pageIndex) {
      //记录页面与模板标示的映射
      this.recordMasterId[pageIndex] = reuseMasterKey;

      //更新可视区母板的编号
      this.currMasterId = this.converMasterId(Xut.Presentation.GetPageIndex());
    }

    /**
     * 检测是否需要创建母版
     */

  }, {
    key: '_hasMaster',
    value: function _hasMaster(reuseMasterKey, pageOffset, pageIndex) {
      var tag = this._toRepeat(reuseMasterKey, pageIndex); //false就是没找到母版对象
      this._updataMasterscope(reuseMasterKey, pageIndex);
      this._updatadParallaxMaster(reuseMasterKey, pageIndex);
      return tag;
    }

    /**
     * 修正跳转后视觉对象坐标
     * @param  {[type]} parallaxObj   [description]
     * @param  {[type]} currPageIndex [description]
     * @param  {[type]} targetIndex   [description]
     * @return {[type]}               [description]
     */

  }, {
    key: '_fixParallaxPox',
    value: function _fixParallaxPox(parallaxObj, currPageIndex, targetIndex) {
      var self = this;
      var contentObjs = void 0;
      var prevNodes = void 0;
      var nodes = void 0;

      var repairNodes = function repairNodes(parallax) {
        var rangePage = parallax.calculateRangePage();
        var lastProperty = parallax.lastProperty;

        if (targetIndex > currPageIndex) {
          //next
          if (targetIndex > rangePage['end']) {
            nodes = 1;
          }
        } else {
          //prev
          if (targetIndex < rangePage['start']) {
            nodes = 0;
          }
        }

        var property = getStepProperty({
          targetProperty: parallax.targetProperty,
          distance: -self.visualWidth,
          nodes: nodes
        });

        //直接操作元素
        setStyle({
          $contentNode: parallax.$contentNode,
          action: 'master',
          property: property,
          speed: 300,
          opacityStart: lastProperty.opacityStart
        });

        cacheProperty(property, lastProperty);
      };

      if (contentObjs = parallaxObj.baseGetContent()) {
        //获取到页面nodes
        nodes = Xut.Presentation.GetPageNode(targetIndex - 1);
        contentObjs.forEach(function (contentObj) {
          contentObj.eachAssistContents(function (scope) {
            if (scope.parallax) {
              repairNodes(scope.parallax);
            }
          });
        });
      }
    }

    //检测是否需要清理
    // 1 普通翻页清理  【数组过滤条件】
    // 2 跳转页面清理  【对象过滤条件】

  }, {
    key: '_checkClear',
    value: function _checkClear(filter, toPage) {
      var key,
          indexOf,
          removeMasterId = _.keys(this._$$getBaseGroup());

      // 如果有2个以上的母板对象,就需要清理
      if (removeMasterId.length > 2 || toPage) {
        //或者是跳转页面
        //解析对象
        filter = toArray$2(filter);
        //过滤
        _.each(filter, function (masterId) {
          if (masterId !== undefined) {
            indexOf = removeMasterId.indexOf(masterId.toString());
            if (-1 !== indexOf) {
              //过滤需要删除的对象
              removeMasterId.splice(indexOf, 1);
            }
          }
        });
        this._clearMemory(removeMasterId);
      }
    }

    /**
     * 清理内存
     * 需要清理的key合集
     * @param  {[type]} removeMasterId [description]
     * @return {[type]}                [description]
     */

  }, {
    key: '_clearMemory',
    value: function _clearMemory(removeMasterId) {
      var pageObj,
          self = this;
      _.each(removeMasterId, function (removekey) {
        //销毁页面对象事件
        if (pageObj = self.$$getPageBase(removekey)) {
          //移除事件
          pageObj.baseDestroy();
          //移除列表
          self._$$removeBaseGroup(removekey);
          self._removeRecordMasterRange(removekey);
        }
        //清理作用域缓存
        delete self.recordMasterRange[removekey];
      });
    }

    /**
     * page转化成母版ID
     * @param  {[type]} pageIndex [description]
     * @return {[type]}           [description]
     */

  }, {
    key: 'converMasterId',
    value: function converMasterId(pageIndex) {
      return this.recordMasterId ? this.recordMasterId[pageIndex] : undefined;
    }
  }, {
    key: '_removeRecordMasterRange',
    value: function _removeRecordMasterRange(removekey) {
      var me = this;
      var recordMasterRange = me.recordMasterRange[removekey];
      //清理页码指示标记
      recordMasterRange.forEach(function (scope) {
        delete me.recordMasterId[scope];
      });
    }
  }]);
  return MasterMgr;
}(ManageSuper);

/**
 * 跳转之前提高层级问题
 * 提高当前页面的层级，方便别的页面切换不产生视觉影响
 */
var raiseHierarchy = function raiseHierarchy(complier, visualIndex) {
  complier.pageMgr.assistPocess(visualIndex, function (pageObj) {
    pageObj.setPageContainerHierarchy({ 'z-index': 9997 });
  });
  complier.getMasterContext(function () {
    complier.masterMgr.assistPocess(visualIndex, function (pageObj) {
      pageObj.setPageContainerHierarchy({ 'z-index': 1 });
    });
  });
};

/**
 * 创建新的页面
 */
var createNewPage = function createNewPage(complier, data, createCallback) {

  //缓存当前页面索引用于销毁
  var pageIndex = void 0;
  var i = 0;
  var collectContainers = [];
  var create = data.create;
  var targetIndex = data.targetIndex;

  //需要创建的页面闭包器
  for (; i < create.length; i++) {
    pageIndex = create[i];
    collectContainers.push(function (targetIndex, pageIndex) {
      return function (callback) {
        //创建新结构
        this.createPageBase([pageIndex], targetIndex, 'toPage', callback, {
          'opacity': 0 //同页面切换,规定切换的样式
        });
      };
    }(targetIndex, pageIndex));
  }

  /**
   * 二维数组保存，创建返回的对象
   * 1 page对象
   * 2 母版对象
   * @type {Array}
   */
  data.pageBaseCollect = [];

  var count = void 0,
      collectLength = void 0;
  var j = 0;

  count = collectLength = collectContainers.length;

  if (collectContainers && collectLength) {
    for (; j < collectLength; j++) {
      //收集创建的根节点,异步等待容器的创建
      collectContainers[j].call(complier, function (callbackPageBase) {
        if (count === 1) {
          collectContainers = null;
          setTimeout(function () {
            createCallback(data);
          }, 100);
        }
        //接受创建后返回的页面对象
        data.pageBaseCollect.push(callbackPageBase);
        count--;
      });
    }
  }
};

/**
 * 节点创建完毕后，切换页面动，执行动作
 */
var creationLogic = function creationLogic(complier, data) {

  var visualIndex = data.visualIndex;
  var pageMgr = complier.pageMgr;
  var targetIndex = data.targetIndex;

  //停止当前页面动作
  complier.suspendPageBases({ 'stopIndex': visualIndex });

  //========处理跳转中逻辑=========

  /**
   * 清除掉不需要的页面
   * 排除掉当前提高层次页面
   */
  _.each(data.destroy, function (destroyIndex) {
    if (destroyIndex !== visualIndex) {
      pageMgr.clearPage(destroyIndex);
    }
  });

  /*修正翻页2页的页面坐标值*/
  _.each(data.ruleOut, function (pageIndex) {
    if (pageIndex > targetIndex) {
      pageMgr.assistAppoint(pageIndex, function (pageObj) {
        fix(pageObj.$pageNode, 'nextEffect');
      });
    }
    if (pageIndex < targetIndex) {
      pageMgr.assistAppoint(pageIndex, function (pageObj) {
        fix(pageObj.$pageNode, 'prevEffect');
      });
    }
  });

  var jumpPocesss = void 0;

  //母版
  complier.getMasterContext(function () {
    jumpPocesss = this.makeJumpPocesss(targetIndex);
    jumpPocesss.pre();
  });

  //===========跳槽后逻辑========================
  pageMgr.clearPage(visualIndex);

  jumpPocesss && jumpPocesss.clean(visualIndex, targetIndex);

  /**
   * 同页面切换,规定切换的样式复位
   */
  _.each(data.pageBaseCollect, function (pageBase) {
    _.each(pageBase, function (pageObj) {
      pageObj && pageObj.setPageContainerHierarchy({
        'opacity': 1
      });
    });
  });

  data.pageBaseCollect = null;
  jumpPocesss = null;
};

/**
 * 跳转页面逻辑处理
 * @param  {[type]} complier [description]
 * @param  {[type]} data     [description]
 * @param  {[type]} success  [description]
 * @return {[type]}          [description]
 */
function goToPage(complier, data, success) {
  //跳前逻辑
  raiseHierarchy(complier, data.visualIndex);
  /*创建新页面*/
  createNewPage(complier, data, function (data) {
    /*执行切换动作*/
    creationLogic(complier, data);
    success.call(complier, data);
  });
}

/**
 * 加入数组处理
 */
var Stack = function () {
  function Stack() {
    classCallCheck(this, Stack);

    this._cache = [];
  }

  /**
   * 加入首部
   * @return {[type]} [description]
   */


  createClass(Stack, [{
    key: "shift",
    value: function shift(fn) {
      this._cache.unshift(fn);
    }

    /**
     * 加入尾部
     * @param  {Function} fn [description]
     * @return {[type]}      [description]
     */

  }, {
    key: "push",
    value: function push(fn) {
      this._cache.push(fn);
    }

    /**
     * 从头部取出全部执行
     * @return {[type]} [description]
     */

  }, {
    key: "shiftAll",
    value: function shiftAll() {
      if (this._cache.length) {
        var fn = void 0;
        while (fn = this._cache.shift()) {
          fn.apply(null, arguments);
        }
      }
      return this;
    }

    /**
     * 尾部取出执行
     * @return {[type]} [description]
     */

  }, {
    key: "popAll",
    value: function popAll() {
      if (this._cache.length) {
        var fn = void 0;
        while (fn = this._cache.pop()) {
          fn.apply(null, arguments);
        }
      }
      return this;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._cache = null;
    }
  }]);
  return Stack;
}();

/**
 * 创建li的translate起始坐标信息
 * flowType 如果是flow类型
 * @return {[type]}
 */
function getVisualSize$1(styleDataset) {
  var pageVisualMode = styleDataset.pageVisualMode,
      direction = styleDataset.direction,
      doubleMainIndex = styleDataset.doubleMainIndex,
      doublePosition = styleDataset.doublePosition,
      visualChapterIndex = styleDataset.visualChapterIndex;

  //默认的config.launch.visualMode

  var visualSize = config.visualSize;
  var hasRecalculate = false;

  /*
  如果页面模式不跟页面保持一致或者是模式3的情况的
  就需要重新计算
  */
  if (pageVisualMode && pageVisualMode !== config.launch.visualMode || pageVisualMode === 3) {
    visualSize = resetVisualLayout(pageVisualMode);
    hasRecalculate = true;
  }

  /*
  双页模式，重新定义页面尺寸与布局,从0页面开始叠加每个页面的距离
   */
  if (doublePosition && doubleMainIndex !== undefined) {
    var doubleIds = converDoublePage(doubleMainIndex);
    if (doublePosition === 'left') {
      visualSize.left = doubleIds[0] * visualSize.width;
    } else {
      visualSize.left = doubleIds[1] * visualSize.width;
    }
  }

  return {
    visualWidth: visualSize.width,
    visualHeight: visualSize.height,
    visualTop: visualSize.top,
    visualLeft: visualSize.left,
    visualLeftInteger: Math.abs(visualSize.left),
    hasRecalculate: hasRecalculate //标记需要重新计算
  };
}

/**
 * 修复动态的缩放比
 * 1 如果尺寸被重新计算过，那么需要重新获取缩放比
 * 2 否则用默认的
 * @return {[type]} [description]
 */
function getPageProportion(data) {
  if (data.hasRecalculate) {
    return resetVisualProportion({
      width: data.visualWidth,
      height: data.visualHeight,
      top: data.visualTop,
      left: data.visualLeft
    });
  } else {
    return config.proportion;
  }
}

/************************
 * 左边页面Translate钩子
 ************************/

function leftTranslate(styleDataset) {

  var middlePageStyle = styleDataset.getPageStyle('middle', 'left');
  var leftPageStyle = styleDataset.getPageStyle('left');

  //中间：溢出
  if (middlePageStyle && middlePageStyle.visualLeftInteger) {
    //左边：溢出
    if (leftPageStyle && leftPageStyle.visualLeftInteger) {
      return -middlePageStyle.visualWidth;
    }
    //左边：正常
    else {
        return -(middlePageStyle.visualWidth - middlePageStyle.visualLeftInteger);
      }
  }
  //中间：正常
  else {
      //左边：溢出
      if (leftPageStyle && leftPageStyle.visualLeftInteger) {
        return -(leftPageStyle.visualWidth - leftPageStyle.visualLeftInteger);
      }
      //左边：正常
      else {
          return -leftPageStyle.visualWidth;
        }
    }
}

/************************
 * 右边页面Translate钩子
 ************************/

function rightTranslate(styleDataset) {

  var middlePageStyle = styleDataset.getPageStyle('middle', 'right');
  var rightPageStyle = styleDataset.getPageStyle('right');

  if (rightPageStyle.pageVisualMode === 5) {
    return rightPageStyle.visualWidth / 2;
  }

  //中间：溢出
  if (middlePageStyle && middlePageStyle.visualLeftInteger) {
    //右边：溢出
    if (rightPageStyle && rightPageStyle.visualLeftInteger) {
      return rightPageStyle.visualWidth - rightPageStyle.visualLeftInteger;
    }
    //右边：正常
    else {
        return rightPageStyle.visualWidth + middlePageStyle.visualLeftInteger;
      }
  }
  //中间：正常
  else {
      //右边：溢出
      if (rightPageStyle && rightPageStyle.visualLeftInteger) {
        return rightPageStyle.visualWidth - rightPageStyle.visualLeftInteger;
      }
      //右边：正常
      else {
          return rightPageStyle.visualWidth + rightPageStyle.visualLeftInteger;
        }
    }
}

/************************
 * 上面页面Translate钩子
 ************************/
function topTranslate(styleDataset) {
  var bottomPageStyle = styleDataset.getPageStyle('top');
  return -bottomPageStyle.visualHeight;
}

/************************
 * 下面页面Translate钩子
 ************************/

function bottomTranslate(styleDataset) {
  var bottomPageStyle = styleDataset.getPageStyle('bottom');
  return bottomPageStyle.visualHeight;
}

var match = { left: leftTranslate, right: rightTranslate, top: topTranslate, bottom: bottomTranslate };

function getOffset$1(name, styleDataset) {
  return match[name](styleDataset);
}

/**
 * 创建translate初始值
 * @param  {[type]} offset [description]
 * @return {[type]}        [description]
 */
var setTranslate$1 = function setTranslate() {
  var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  return Xut.style.setTranslateStyle(x, y);
};

/**
 * 默认样式
 */
function initTranslate(_ref) {
  var position = _ref.position,
      styleDataset = _ref.styleDataset;


  var translate = void 0;
  var offset = void 0;

  switch (position) {
    case 'left':
    case 'right':
      /*设置X轴*/
      offset = getOffset$1(position, styleDataset);
      translate = setTranslate$1(offset);
      break;
    case 'top':
    case 'bottom':
      /*设置Y轴*/
      offset = getOffset$1(position, styleDataset);
      translate = setTranslate$1(0, offset);
      break;
    case 'middle':
      translate = setTranslate$1();
      offset = 0;
      break;
  }

  return {
    //translate样式
    translate: translate,
    //偏移量
    offset: offset
  };
}

/**
 * 获取页面对象的样式配置对象
 * @param  {[type]} pageIndex [description]
 * @return {[type]}           [description]
 */
var getPageStyle = function getPageStyle(pageIndex) {
  var pageBase = Xut.Presentation.GetPageBase(pageIndex);
  return pageBase && pageBase.getStyle;
};

/**
 * 自定义样式页面容器的样式
 * 创建页面的样式，与布局
 * 1 创建页面的初始化的Transform值
 * 是否初始化创建
 * @return {[type]} [description]
 */
function setCustomStyle(styleDataset) {

  /*
  1.容器可视区尺寸
  2.容器内部元素的缩放比
  3.提供快速索引
   */
  _.each(styleDataset, function (data, index) {
    /*获取容器尺寸*/
    _.extend(data, getVisualSize$1(data));
    data.pageProportion = getPageProportion(data);
    /*数组形式，因为有双页面的情况*/
    if (!styleDataset['_' + data.position]) {
      styleDataset['_' + data.position] = [];
    }
    styleDataset['_' + data.position].push(data.chapterIndex);
  });

  if (!config.launch.doublePageMode) {

    /**
     * 获取指定页面样式
     * pageName
     * assistName 辅助页面名
     * 初始化的时候，可以正常创建多个页面的style，在不同页面可以获取不同的style
     * 但是在翻页的时候，由于只动态创建了一个页，所以在获取其他页面的时候，必须通过辅助参数
     * 跨页面对象获取数据
     */
    styleDataset.getPageStyle = function (pageName, assistName) {
      var pageStyle = this[this['_' + pageName]];
      //翻页动态创建的时候，只能索取到一页，因为只动态创建了一页
      //所以这里需要动态获取关联的中间页面对象
      if (!pageStyle && pageName === 'middle') {
        var standbyStyle = this.getPageStyle(assistName);
        if (assistName === 'left') {
          return getPageStyle(standbyStyle.chapterIndex + 1);
        }
        if (assistName === 'right') {
          return getPageStyle(standbyStyle.chapterIndex - 1);
        }
      }
      return this[this['_' + pageName]];
    };

    _.each(styleDataset, function (data, index) {
      //容器的初始translate值
      if (data.position) {
        _.extend(data, initTranslate({
          styleDataset: styleDataset,
          position: data.position
        }));
      }
    });
  }

  return styleDataset;
}

/**
 * 获取母版页面的visualMode设置
 * 覆盖全局的设置
 * 预先抽出母版上的页面模式定义
 * 定义visualMode：1/2/3/4 覆盖全局页面模式
 * 母版关联的页面必须跟这个参数统一
 * @return {[type]} [description]
 */
function getVisualMode(chapterData) {

  //反向模式设置
  //如果是全局模式1，并且是竖向横显示
  if (config.launch.visualMode === 1 && config.verticalToHorizontalVisual) {
    return 1;
  }

  //flow页面返回1
  if (chapterData.note === 'flow') {
    return 1;
  }

  //如果有独立的页面模式
  var parameter = chapterData.parameter;
  if (parameter) {
    var matchMode = parameter.match(/visualMode[":\s]*(\d)/);
    if (matchMode) {
      return Number(matchMode[1]);
    }
  }

  //返回全局页面模式
  return config.launch.visualMode || 1;
}

/*********************************************************************
 *            调度器 生成页面模块
 *            处理：事件动作分派
 *            调度：
 *                1. PageMgr     模块
 *                2. MasterMgr 模块                                                          *
 **********************************************************************/

/*
获取双页参数
1:从属的主索引
2:摆放位置
 */
var getDoubleOption = function getDoubleOption(chapterIndex, doublePage) {
  if (doublePage.total) {
    for (var key in doublePage) {
      if (key !== 'total') {
        var doubleData = doublePage[key];
        var index = doubleData.indexOf(chapterIndex);
        if (~index) {
          return {
            doubleMainIndex: Number(key),
            doublePosition: index == 0 ? 'left' : 'right'
          };
        }
      }
    }
  }
  return {
    doubleMainIndex: undefined,
    doublePosition: undefined
  };
};

var Scheduler = function () {
  function Scheduler($$mediator) {
    classCallCheck(this, Scheduler);


    this.$$mediator = $$mediator;

    //创建前景页面管理模块
    this.pageMgr = new PageMgr($$mediator.options.scenePageNode);

    //检测是否需要创母版模块
    if (hasMaster()) {
      this.masterMgr = new MasterMgr($$mediator.options.sceneMasterNode);
    }
  }

  /**
   * 初始化页面创建
   * 因为多个页面的问题，所以不是创建调用
   * 提供外部接口启动创建
   */


  createClass(Scheduler, [{
    key: 'initCreate',
    value: function initCreate() {
      var options = this.$$mediator.options;
      var pointer = initPointer$1(options.initIndex, options.pageTotal, options.hasMultiPage);
      this.pagePointer = pointer.initPointer;
      this.createPageBase(pointer.createPointer, options.initIndex, 'init', '', '');
    }

    /**
     *  创建普通页面
     *  创建母版页面
     *  createSinglePage  需要创建的单页面索引
     *  visualPageIndex   当前可视区页面索引
     *  action            创建的动作：toPage/init/flipOver
     *  toPageCallback    跳转页面支持回调通知
     *  userStyle         规定创建的style属性
     *
     * 2017.3.27增加createDoublePage
     *   创建双页的页面记录
     *   createPageIndex中对应的createDoublePage如果有子索引值
     *
     * 流程：
     * 1：传递页面索引createSinglePage  [0]/[0,1]/[0,1,2]
     * 2: 转化索引为chpaterInder的排序，把索引提出当期显示页面最先解析， 如果是非线性，需要转化对应的chpaterIndex ,[1,0,2]
     * 3：通过编译chpaterInder的合集，获取到每一个chapter页面的数据
     * 4：由于非线性存在， 每一个新的场景，可包含有多个chpater，pageIndex都是从0开始的. chapterIndex，不一定是从0开始的
     * 5: 解析出pageIndex，visualChapterIndex的数值
     * 6：自定义每一个页面的样式styleDataset
     * 7：调用page/master管理器，创建pagebase
     **/

  }, {
    key: 'createPageBase',
    value: function createPageBase(createSinglePage, visualPageIndex, action, toPageCallback, userStyle) {

      var firstValue = createSinglePage[0];

      //2016.1.20
      //确保createPage不是undefined
      if (firstValue === undefined) {
        return;
      }

      var self = this;
      var options = this.$$mediator.options;
      var hasMultiPage = options.hasMultiPage; //是否线性
      var isToPageAction = action === 'toPage'; //如果是跳转
      var isFlipAction = action === 'flipOver'; //如果是翻页

      /*启动了双页模式，单页转化双页*/
      var createDoublePage = converDoublePage(createSinglePage, true);

      /* 需要创建的总页面，双页面或者单页面*/
      var createTotal = createDoublePage.total || createSinglePage.length;

      /*
      转化页面合集，自然索引index => chapter Index
      传递的页面的索引永远只是从0,1,2....这样的自然排序
      1.最后需要把最先展示的页面提取到第一位解析，加快页面展示
      2.如果是非线性的多场景应用，那么这样的自然排序，需要转化成对应的chapter的索引(为了直接获取chapter的数据)
      */
      var createChpaterIndexGroup = converChapterIndex(options, createSinglePage, createDoublePage, visualPageIndex);

      /*
       收集创建的页面对象
       1.用于处理2个页面在切换的时候闪屏问题
       2.主要是传递createStyle自定义样式的处理
        */
      var collectPageBase = [];

      /*
      是否触发母版的自动时间
      因为页面每次翻页都会驱动auto事件
      但是母版可能是共享的
       */
      var createMaster = false;

      //收集完成回调
      var collectCallback = function () {
        //收集创建页码的数量
        var createContent = 0;
        return function (callback) {
          ++createContent;
          if (createContent === createTotal) {
            callback();
          }
        };
      }();

      //构建执行代码
      var callbackAction = {
        /*初始化完毕*/
        init: function init() {
          collectCallback(function () {
            self._initPage('init');
          });
        },

        /*翻页完毕，运行自动*/
        flipOver: function flipOver() {
          collectCallback(function () {
            self._runPageBase({
              'createPointer': createChpaterIndexGroup,
              'createMaster': createMaster
            });
          });
        },

        /*跳转处理*/
        toPage: function toPage() {
          collectCallback(function () {
            toPageCallback(collectPageBase);
          });
        }
      };

      /**
       * 预编译
       * 因为要需要对多个页面进行预处理
       * 需要同步多个页面数据判断
       * 这样需要预编译出数据，做了中间处理后再执行后续动作
       * @type {Array}
       */
      var compile = new Stack();

      /*收集有用的数据*/
      var styleDataset = hash();

      /*双页，初始化页面的Translate容器坐标*/
      if (action === 'init') {
        this.pageMgr.setInitTranslate(visualPageIndex);
      }

      /*
        1.pageIndex：页面自然索引号
        2.visualPageIndex：页面自然索引号，可见编号
          3.chapterIndex： 页面chpater的索引号
        4.visualChapterIndex:  可见页面的的chpater索引号
       */
      _.each(createChpaterIndexGroup, function (chapterIndex) {

        compile.push(function () {

          /*
          双页模式
          1:子页面从属主页面，一左一右从属
            比如子页面   chapterIndex：  [2,3,0,1,4,5]
            从属的主页面 belongMainIndex:[1,1,0,0,2,2]
            2:计算页面是左右摆放位置
            position: left/right
           */
          var _getDoubleOption = getDoubleOption(chapterIndex, createDoublePage),
              doubleMainIndex = _getDoubleOption.doubleMainIndex,
              doublePosition = _getDoubleOption.doublePosition;

          var chapterData = converChapterData(chapterIndex);

          if (chapterData === undefined) {
            $warn('\u521B\u5EFA\u9875\u9762\u51FA\u9519,chapterIndex:' + chapterIndex);
            return;
          }

          /*
          1.转化可视区页码对应的chapter的索引号
          2.获取出实际的pageIndex自然索引号
          因为多场景的情况下
          chapterIndex != pageIndex
          每一个新的场景，可包含有多个chpater，pageIndex都是从0开始的
          chapterIndex，不一定是从0开始的
          */

          var _converVisualPid = converVisualPid(options, chapterIndex, visualPageIndex),
              visualChapterIndex = _converVisualPid.visualChapterIndex,
              pageIndex = _converVisualPid.pageIndex;

          if (createTotal === 1) {
            options.chapterId = chapterData._id;
          }

          /*
          跳转的时候，创建新页面可以自动样式信息
          优化设置，只是改变当前页面即可
          */
          if (isToPageAction && visualChapterIndex !== chapterIndex) {
            userStyle = undefined;
          }

          /*自定义页面的style属性*/
          styleDataset[chapterIndex] = {
            userStyle: userStyle,
            chapterIndex: chapterIndex,
            visualChapterIndex: visualChapterIndex,
            doublePosition: doublePosition, //双页面位置
            doubleMainIndex: doubleMainIndex, //从属主页面，双页模式
            /*页面的布局位置*/
            position: getPosition(doubleMainIndex !== undefined ? doubleMainIndex : chapterIndex, visualChapterIndex),
            pageVisualMode: getVisualMode(chapterData)
          };

          ///////////////////////////
          /// 延迟创建,先处理style规则
          ///////////////////////////
          return function (pageStyle) {
            //创建新的页面管理，masterFilter 母板过滤器回调函数
            var _createPageBase = function _createPageBase(masterFilter) {

              //初始化构建页面对象
              //1:page，2:master
              var currentStyle = pageStyle[chapterIndex];
              var pageBase = this.create({
                pageIndex: pageIndex,
                chapterData: chapterData,
                chapterIndex: chapterIndex,
                hasMultiPage: hasMultiPage,
                'getStyle': currentStyle
              }, pageIndex, masterFilter, function (shareMaster) {
                if (config.debug.devtools && shareMaster.getStyle.pageVisualMode !== currentStyle.pageVisualMode) {
                  $warn('\u6BCD\u7248\u4E0E\u9875\u9762VisualMode\u4E0D\u4E00\u81F4,\u9519\u8BEF\u9875\u7801:' + (pageIndex + 1) + ',\u6BCD\u7248visualMode:' + shareMaster.getStyle.pageVisualMode + ',\u9875\u9762visualMode:' + currentStyle.pageVisualMode);
                }
              });

              //判断pageBase是因为母版不需要重复创建
              //母版是共享多个paga
              if (pageBase) {
                //开始线程任务，如果是翻页模式,支持快速创建
                pageBase.startThreadTask(isFlipAction, function () {
                  callbackAction[action]();
                });

                //收集自定义样式的页面对象
                if (userStyle) {
                  collectPageBase.push(pageBase);
                }
              }
            };

            //创建母版层
            if (chapterData.pptMaster && self.masterMgr) {
              _createPageBase.call(self.masterMgr, function () {
                //母版是否创建等待通知
                //母版是共享的所以不一定每次翻页都会创建
                //如果需要创建,则叠加总数
                ++createTotal;
                createMaster = true;
              });
            }

            //创建页面层
            _createPageBase.call(self.pageMgr);
          };
        }());
      });

      /**
       * 创建页面的样式与翻页的布局
       * 存在存在flows页面处理
       * 这里创建处理的Transfrom
       */
      compile.shiftAll(setCustomStyle(styleDataset)).destroy();
    }

    /**
     * 滑动处理
     *  1 滑动
     *  2 反弹
     *  3 翻页
     */

  }, {
    key: 'movePageBases',
    value: function movePageBases(options) {
      var action = //应用边界反弹
      //设置翻页无效
      options.action,
          speed = options.speed,
          outerCallFlip = options.outerCallFlip,
          distance = options.distance,
          frontIndex = options.frontIndex,
          middleIndex = options.middleIndex,
          backIndex = options.backIndex,
          direction = options.direction,
          orientation = options.orientation,
          isAppBoundary = options.isAppBoundary,
          setSwipeInvalid = options.setSwipeInvalid;

      //用户强制直接切换模式
      //禁止页面跟随滑动

      if (config.launch.banMove && action == 'flipMove') {
        return;
      }

      var visualObj = this.pageMgr.$$getPageBase(middleIndex);

      //2016.11.8
      //mini杂志功能
      //一次是拦截
      //一次是触发动作
      if (config.launch.swipeDelegate && visualObj) {

        //如果是swipe就全局处理
        if (action === 'swipe') {
          //执行动画序列
          visualObj.callSwipeSequence(direction);
          return;
        }

        //2016.11.8
        //mini杂志功能
        //如果有动画序列
        //拦截翻页动作
        //执行序列动作
        //拦截
        if (visualObj.hasSwipeSequence(direction)) {
          //设置为无效翻页
          setSwipeInvalid && setSwipeInvalid();
          return;
        }
      }

      /*视觉差页面滑动*/
      var nodes = void 0;
      if (visualObj) {
        var chapterData = visualObj.chapterData;
        nodes = chapterData && chapterData.nodes ? chapterData.nodes : undefined;
      }

      /*移动的距离,合集*/
      var moveDistance = getVisualDistance({
        action: action,
        distance: distance,
        direction: direction,
        frontIndex: frontIndex,
        middleIndex: middleIndex,
        backIndex: backIndex,
        orientation: orientation
      });

      /**
       * 外部设置swiper内部的反弹
       * 主要是模式5的情况下处理
       * swiper延伸判断，通过这里获取到页面真是的坐标
       * 反馈给swiper,如果是反弹就不再处理了
       */
      if (options.setPageBanBounce && options.setPageBanBounce(moveDistance[1])) {
        return;
      }

      var data = {
        nodes: nodes,
        speed: speed,
        action: action,
        outerCallFlip: outerCallFlip,
        moveDistance: moveDistance,
        direction: direction,
        frontIndex: frontIndex,
        middleIndex: middleIndex,
        backIndex: backIndex
      };

      /*移动页面*/
      this.pageMgr.move(data);
      this.getMasterContext(function () {
        this.move(data, isAppBoundary);
      });

      //更新页码
      if (action === 'flipOver') {
        Xut.nextTick(function () {
          Xut.View.UpdatePage({
            action: action,
            parentIndex: direction === 'next' ? backIndex : frontIndex,
            direction: direction
          });
        });
      }
    }

    /**
     * 翻页松手后
     * 暂停页面的各种活动动作
     */

  }, {
    key: 'suspendPageBases',
    value: function suspendPageBases(options) {
      var _this = this;

      var frontIndex = options.frontIndex,
          middleIndex = options.middleIndex,
          backIndex = options.backIndex,
          stopIndex = options.stopIndex;

      /*暂停*/

      var suspendAction = function suspendAction(front, middle, back, stop) {
        _this.pageMgr.suspend(front, middle, back, stop);
        _this.getMasterContext(function () {
          this.suspend(stop);
        });
      };

      var stopPageIndexs = converDoublePage(stopIndex);

      /*多页面,停止每个页面的动作
      1.停止的可能是多页面
      2.转化对应的页面数据，用于停止页面任务创建*/
      if (stopPageIndexs && stopPageIndexs.length) {
        var leftIds = converDoublePage(frontIndex);
        var currIds = converDoublePage(middleIndex);
        var rightIds = converDoublePage(backIndex);
        /**
         * 因为stopPageIndexs是数组形式，
         * 所以会调用多次相同的任务关闭操作
         * 所以这里为了优化，强制只处理一次
         */
        var onlyonce = false;
        stopPageIndexs.forEach(function (index) {
          if (onlyonce) {
            /*只关闭，任务不需要重复再处理了*/
            suspendAction('', '', '', index);
          } else {
            suspendAction(leftIds, currIds, rightIds, index);
            onlyonce = true;
          }
        });
      } else {
        /*单页面*/
        suspendAction(frontIndex, middleIndex, backIndex, stopIndex);
      }

      //复位工具栏
      Xut.View.ResetToolbar();
    }

    /**
     * 翻页动画完毕后
     * 1.需要解锁页面滑动
     * 2.需要创建更新页面
     * 3.需要清理页面
     */

  }, {
    key: 'completePageBases',
    value: function completePageBases(options) {
      var direction = options.direction,
          pagePointer = options.pagePointer,
          unlock = options.unlock,
          isQuickTurn = options.isQuickTurn;
      /*方向*/

      this.direction = direction;
      /*是否快速翻页*/
      this.isQuickTurn = isQuickTurn || false;
      /*翻页解锁*/
      this.unlock = unlock;
      /*清理上一个页面*/
      this._clearPage(pagePointer.destroyIndex);
      /*更新索引*/
      this._updatePointer(pagePointer);
      //预创建下一页
      this._createNextPage(direction, pagePointer);
    }

    /**
     * 自动运行处理
     *  流程四:执行自动触发动作
     *   1.初始化创建页面完毕
     *   2.翻页完毕
     *   3.跳转后
     */

  }, {
    key: '_runPageBase',
    value: function _runPageBase(para) {

      var $$mediator = this.$$mediator;
      var options = this.$$mediator.options;
      var pagePointer = this.pagePointer;
      var frontIndex = pagePointer.frontIndex;
      var middleIndex = pagePointer.middleIndex;
      var backIndex = pagePointer.backIndex;
      var action = para ? para.action : '';
      var createPointer = para ? para.createPointer : '';
      var direction = this.direction;

      /*跳转与翻页的情况下，转化页码标记*/
      if (createPointer) {
        createPointer = converVisualPid(options, createPointer);
      }

      var data = {
        frontIndex: frontIndex,
        middleIndex: middleIndex,
        backIndex: backIndex,
        direction: direction,
        createPointer: createPointer,
        'isQuickTurn': this.isQuickTurn,

        /**
         * 暂停的页面索引autorun
         */
        'suspendIndex': action === 'init' ? '' : direction === 'next' ? frontIndex : backIndex,

        /**
         * 中断通知
         */
        'suspendCallback': options.suspendAutoCallback,

        /**
         * 构建完成通知,用于处理历史缓存记录
         * 如果是调试模式 && 不是收费提示页面 && 多场景应用
         */
        buildComplete: function buildComplete(seasonId) {
          if (config.launch.historyMode && !options.isInApp && options.hasMultiScene) {
            var history = sceneController.sequence(seasonId, middleIndex);
            if (history) {
              $setStorage("history", history);
            }
          }
        },


        /**
         * 流程结束通知
         * 包括动画都已经结束了
         */
        processComplete: function processComplete() {
          Xut.Application.Notify('autoRunComplete');
        }
      };

      //页面自动运行
      this.pageMgr.autoRun(data);

      //模板自动运行
      this.getMasterContext(function () {
        //如果动作是初始化，或者触发了母版自动运行
        //如果是越界处理
        //console.log(action,this.isBoundary,para.createMaster)
        if (action || this.isBoundary) {
          this.autoRun(data);
        }
      });

      /*初始化与跳转针对翻页案例的设置逻辑*/
      var setToolbar = function setToolbar() {
        //不显示首尾对应的按钮
        if (middleIndex == 0) {
          Xut.View.HidePrevBar();
        } else if (middleIndex == options.pageTotal - 1) {
          Xut.View.HideNextBar();
          Xut.View.ShowNextBar();
        } else {
          Xut.View.ShowNextBar();
          Xut.View.ShowPrevBar();
        }
      };

      switch (action) {
        case 'init':
          //更新页码标示
          Xut.View.UpdatePage({
            action: action,
            parentIndex: middleIndex,
            direction: direction
          });
          setToolbar.call(this);
          break;
        case 'toPage':
          //更新页码标示
          Xut.View.UpdatePage({
            action: action,
            parentIndex: middleIndex,
            direction: direction
          });
          setToolbar.call(this);
          break;
      }

      /**
       * 线性结构
       * 保存目录索引
       */
      if (config.launch && config.launch.historyMode && !options.hasMultiScene) {
        $setStorage("pageIndex", middleIndex);
      }

      /**
       * 解锁翻页
       * 允许继续执行下一个翻页作用
       */
      if (this.unlock) {
        this.unlock();
        this.unlock = null;
      }

      //关闭快速翻页
      this.isQuickTurn = false;
    }

    /**
     * 清理页面结构,双页与单页
     */

  }, {
    key: '_clearPage',
    value: function _clearPage(destroyIndex) {
      var _this2 = this;

      getRealPage(destroyIndex, 'clearPage').forEach(function (index) {
        _this2.pageMgr.clearPage(index);
      });
    }

    /**
     * 更新页码索引标示
     */

  }, {
    key: '_updatePointer',
    value: function _updatePointer(pointer) {
      this.pagePointer = pointer;
    }

    /**
     * 预创建新页面
     */

  }, {
    key: '_createNextPage',
    value: function _createNextPage(direction, pagePointer) {
      var _this3 = this;

      var pageTotal = this.$$mediator.options.pageTotal;
      var createIndex = pagePointer.createIndex;
      var middleIndex = pagePointer.middleIndex;

      /*清理页码*/
      var clearPointer = function clearPointer() {
        pagePointer.createIndex = null;
        pagePointer.destroyIndex = null;
      };

      /*创建新的页面对象*/
      var createNextPageBase = function createNextPageBase() {
        return _this3.createPageBase([createIndex], middleIndex, 'flipOver');
      };

      //如果是前翻页
      if (direction === 'prev') {
        //首尾无须创建页面
        if (middleIndex === 0) {
          this._runPageBase();
          if (pageTotal == 2) {
            //如果总数只有2页，那么首页的按钮是关闭的，需要显示
            Xut.View.ShowNextBar();
          }
          Xut.View.HidePrevBar();
          return;
        }
        if (middleIndex > -1) {
          //创建的页面
          createNextPageBase();
          clearPointer();
          Xut.View.ShowNextBar();
          return;
        }
      }

      //如果是后翻页
      if (direction === 'next') {
        //首尾无须创建页面
        if (middleIndex === pageTotal - 1) {
          this._runPageBase();
          if (pageTotal == 2) {
            //如果总数只有2页，那么首页的按钮是关闭的，需要显示
            Xut.View.ShowPrevBar();
          }
          //多页处理
          Xut.View.HideNextBar();
          return;
        }
        if (createIndex < pageTotal) {
          //创建的页面
          createNextPageBase();
          clearPointer();
          Xut.View.ShowPrevBar();
          return;
        }
      }

      clearPointer();

      return;
    }

    /**
     * 页面跳转
     */

  }, {
    key: 'gotoPageBases',
    value: function gotoPageBases(data) {

      Xut.View.ShowBusy();

      //如果是非线性,创建页面修改
      if (!this.$$mediator.options.hasMultiPage) {
        data.create = [data.targetIndex]; //创建
        data.destroy = [data.visualIndex]; //销毁
        data.ruleOut = [data.targetIndex]; //排除已存在
        /*更新索引值*/
        data.pagePointer = {
          middleIndex: data.targetIndex
        };
      }

      //执行页面切换
      goToPage(this, data, function (data) {
        this._updatePointer(data.pagePointer);
        this._runPageBase({
          'action': 'toPage',
          'createPointer': data.create
        });
        Xut.View.HideBusy();
      });
    }

    /**
     * 调用母版管理器
     */

  }, {
    key: 'getMasterContext',
    value: function getMasterContext(callback) {
      if (this.masterMgr) {
        callback.call(this.masterMgr);
      }
    }

    /**
     * 销毁接口
     * 销毁页面的所有的管理
     * 一般是退出处理
     */

  }, {
    key: 'destroyManage',
    value: function destroyManage() {
      this.pageMgr.destroyManage();
      this.getMasterContext(function () {
        this.destroyManage();
      });
    }

    /*
     *加载页面事件与动作
     *每次初始化一个新的场景都会触发
     */

  }, {
    key: '_initPage',
    value: function _initPage(action) {
      var _this4 = this;

      var autoRun = function autoRun() {
        return _this4._runPageBase({ action: action });
      };

      //触发自动任务
      var triggerAuto = function triggerAuto() {
        //第一次进入，处理背景
        var $cover = $(".xut-cover");
        if ($cover.length) {
          //主动探测,只检查一次
          var complete = function complete() {
            $cover && $cover.remove();
            $cover = null;
            autoRun();
          };

          //是否配置启动动画关闭
          if (config.launch.launchAnim === false) {
            complete();
          } else {
            //有动画
            $cover.transition({
              opacity: 0,
              duration: 1000,
              easing: 'in',
              complete: complete
            });
          }
        }
        //第二次
        else {
            $cover = null;
            autoRun();
          }
      };

      //创建完成回调
      this.$$mediator.$$emit('change:createComplete', function () {
        if (_this4.$$mediator.options.hasMultiScene) {
          triggerAuto();
        }
        //第一次加载
        //进入应用
        else {
            if (window.GLOBALIFRAME) {
              triggerAuto();
              return;
            }
            //获取应用的状态
            if (Xut.Application.getAppState()) {
              //保留启动方法
              var pre = Xut.Application.LaunchApp;
              Xut.Application.LaunchApp = function () {
                pre();
                triggerAuto();
              };
            } else {
              triggerAuto();
            }
          }
      });
    }
  }]);
  return Scheduler;
}();

/********************************************
 * 场景API
 * 数据接口。和电子杂志的数据相关的接口，都在这里。
 ********************************************/
/**
 * 命名前缀
 * @type {String}
 */
var CONTENTPREFIX = 'Content_';

function extendPresentation(access, $$globalSwiper) {

  /**
   * 获取当前页码
   */
  Xut.Presentation.GetPageIndex = function () {
    return $$globalSwiper.getVisualIndex();
  };

  /**
   *  四大数据接口
   *  快速获取一个页面的nodes值
   *  获取当前页面的页码编号 - chapterId
   *  快速获取指定页面的chapter数据
   *  pagebase页面管理对象
   * @return {[type]}            [description]
   */
  _.each(["GetPageId", "GetPageNode", "GetPageData", "GetPageBase"], function (apiName) {
    Xut.Presentation[apiName] = function (pageType, pageIndex) {
      return access(function (manager, pageType, pageIndex) {
        if (pageIndex === undefined) {
          pageIndex = $$globalSwiper.getVisualIndex(); //当前页面
        }
        /*$$-manage-super接口*/
        return manager["$$" + apiName](pageIndex, pageType);
      }, pageType, pageIndex);
    };
  });

  /**
   * 获取页面的总数据
   * 1 chapter数据
   * 2 section数据
   * @return {[type]}
   */
  _.each(["Section", "Page"], function (apiName) {
    Xut.Presentation['GetApp' + apiName + 'Data'] = function (callback) {
      var i = 0,
          temp = [],
          cps = Xut.data.query('app' + apiName),
          cpsLength = cps.length;
      for (i; i < cpsLength; i++) {
        temp.push(cps.item(i));
      }
      return temp;
    };
  });

  /*
  获取浮动元素的根节点
  1 page
  2 master
   */
  Xut.Presentation.GetFloatContainer = function (pageType) {
    var pageObj = Xut.Presentation.GetPageBase(pageType);
    var containerName = pageType === 'page' ? 'pageContainer' : 'masterContainer';
    if (pageObj.floatGroup[containerName].length) {
      return pageObj.floatGroup[containerName];
    } else {
      $warn(pageType + ',浮动根节点没有找到');
    }
  };

  /**
   * 获取首页的pageId
   * @param {[type]} seasonId [description]
   */
  Xut.Presentation.GetFirstPageId = function (seasonId) {
    var sectionRang = Xut.data.query('sectionRelated', seasonId);
    var pageData = Xut.data.query('appPage');
    return pageData.item(sectionRang.start);
  };

  /**
   * 得到页面根节点
   * li节点
   */
  Xut.Presentation.GetPageElement = function () {
    var obj = Xut.Presentation.GetPageBase();
    return obj.$pageNode;
  };

  /**
   * 获取页面样式配置文件
   * @return {[type]} [description]
   */
  Xut.Presentation.GetPageStyle = function (pageIndex) {
    var pageBase = Xut.Presentation.GetPageBase(pageIndex);
    if (pageBase && pageBase.getStyle) {
      return pageBase.getStyle;
    } else {
      $warn('页面Style配置文件获取失败,pageIndex:' + pageIndex);
    }
  };

  /**
   * 获取页码标记
   * 因为非线性的关系，页面都是按chpater组合的
   * page_0
   * page_10
   * 但是每一个章节页面的索引是从0开始的
   * 区分pageIndex
   */
  Xut.Presentation.GetPagePrefix = function (pageType, pageIndex) {
    var pageObj = Xut.Presentation.GetPageBase(pageType, pageIndex);
    return pageObj.chapterIndex;
  };

  /**
   * 得到content的命名规则
   */
  Xut.Presentation.GetContentPrefix = function (pageIndex) {
    return CONTENTPREFIX + Xut.Presentation.GetPagePrefix(pageIndex) + "_";
  };

  /**
   * 获取命名规则
   */
  Xut.Presentation.GetContentName = function (id) {
    if (id) {
      return CONTENTPREFIX + Xut.Presentation.GetPagePrefix() + "_" + id;
    } else {
      return CONTENTPREFIX + Xut.Presentation.GetPagePrefix();
    }
  };
}

/********************************************
 * 场景API
 * 视图接口。视图是窗口的展示方式，和页面相关的接口，都在这里。
 ********************************************/
function extendView($$mediator, access, $$globalSwiper) {

  var options = $$mediator.options;

  /**
   * 获取页面根节点的ID命名规则
   * chapterId是页面ID编号
   * base.pageType + "-" + (base.pageIndex + 1) + "-" + base.chapterId
   */
  Xut.View.GetPageNodeIdName = function (pageType, pageIndex, chapterId) {
    return pageType + '-' + (pageIndex + 1) + '-' + chapterId;
  };

  //========================
  //  页面工具栏按钮
  //========================

  /**
   * 更新页码
   * @param {[type]} point [description]
   *   parentIndex  父索引
   *   subIndex     子索引
   */
  Xut.View.UpdatePage = function () {
    for (var _len = arguments.length, arg = Array(_len), _key = 0; _key < _len; _key++) {
      arg[_key] = arguments[_key];
    }

    $$mediator.$$emit.apply($$mediator, ['change:updatePage'].concat(arg));
  };

  /**
   * 显示上一页按钮
   * @param {...[type]} arg [description]
   */
  Xut.View.ShowPrevBar = function () {
    for (var _len2 = arguments.length, arg = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      arg[_key2] = arguments[_key2];
    }

    $$mediator.$$emit.apply($$mediator, ['change:showPrev'].concat(arg));
  };

  /**
   * 隐藏上一页按钮
   * @param {...[type]} arg [description]
   */
  Xut.View.HidePrevBar = function () {
    for (var _len3 = arguments.length, arg = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      arg[_key3] = arguments[_key3];
    }

    $$mediator.$$emit.apply($$mediator, ['change:hidePrev'].concat(arg));
  };

  /**
   * 显示下一页按钮
   * @param {...[type]} arg [description]
   */
  Xut.View.ShowNextBar = function () {
    for (var _len4 = arguments.length, arg = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      arg[_key4] = arguments[_key4];
    }

    $$mediator.$$emit.apply($$mediator, ['change:showNext'].concat(arg));
  };

  /**
   * 隐藏下一页按钮
   * @param {...[type]} arg [description]
   */
  Xut.View.HideNextBar = function () {
    for (var _len5 = arguments.length, arg = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      arg[_key5] = arguments[_key5];
    }

    $$mediator.$$emit.apply($$mediator, ['change:hideNext'].concat(arg));
  };

  /**
   * state, pointer
   */
  Xut.View.ToggleToolbar = function () {
    for (var _len6 = arguments.length, arg = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      arg[_key6] = arguments[_key6];
    }

    $$mediator.$$emit.apply($$mediator, ['change:toggleToolbar'].concat(arg));
  };

  /**
   * 显示工具栏
   * 没有参数显示 工具栏与控制翻页按钮
   * 有参数单独显示指定的
   */
  Xut.View.ShowToolBar = function (point) {
    Xut.View.ToggleToolbar('show', point);
  };

  /**
   * 隐藏工具栏
   * 没有参数隐藏 工具栏与控制翻页按钮
   * 有参数单独隐藏指定
   */
  Xut.View.HideToolBar = function (point) {
    Xut.View.ToggleToolbar('hide', point);
  };

  /**
   * 复位工具栏
   */
  Xut.View.ResetToolbar = function () {
    $$mediator.$$emit('change:resetToolbar');
  };

  /**
   * 指定特定的显示与隐藏
   *  Xut.View.Toolbar({
   *       show :'bottom',
   *       hide :'controlBar'
   *   })
   *
   *  //工具栏与翻页按钮全部显示/隐藏
   *  Xut.View.Toolbar('show')
   *  Xut.View.Toolbar('hide')
   *
   */
  Xut.View.Toolbar = function (cfg) {
    Xut.View.ToggleToolbar(cfg);
  };

  /*
  跳转页面
   options
     obj / fn
   direction
     prev
     next
   */
  var gotoPage = function gotoPage(data, direction) {
    var seasonId = void 0,
        chapterId = void 0,
        callback = void 0,
        speed = void 0;

    /**
     * data 可以传，可以不传递
     * 1 传递回调函数
     * 2 传递对象
     */
    if (data) {
      if (_.isFunction(data)) {
        //回调
        callback = data;
      } else {
        seasonId = data.seasonId;
        chapterId = data.chapterId;
        callback = data.callback;
        speed = data.speed;
      }
    }

    if (seasonId && chapterId) {
      Xut.View.LoadScenario({
        'seasonId': seasonId,
        'chapterId': chapterId
      }, callback);
      return;
    }

    //ibooks模式下的跳转
    //全部转化成超链接
    if (Xut.IBooks.Enabled && Xut.IBooks.runMode()) {
      var pageIndex = direction === 'prev' ? Xut.IBooks.pageIndex - 1 : Xut.IBooks.pageIndex + 1;
      location.href = pageIndex + ".xhtml";
      callback && callback();
      return;
    }

    options.hasMultiPage && $$globalSwiper[direction]({ callback: callback, speed: speed });
  };

  /**
   * 跳转到上一个页面
   */
  Xut.View.GotoPrevSlide = function (data) {
    gotoPage(data, 'prev');
  };

  /**
   * 跳转到下一个页面
   */
  Xut.View.GotoNextSlide = function (data) {
    gotoPage(data, 'next');
  };

  /**
   * 是否启动
   * @return {[type]} [description]
   */
  Xut.View.HasEnabledSwiper = function () {
    return $$globalSwiper.hasEnabled();
  };

  /**
   * 禁止滑动
   */
  Xut.View.SetSwiperDisable = function () {
    $$globalSwiper.disable();
  };

  /**
   * 允许滑动
   */
  Xut.View.SetSwiperEnable = function () {
    $$globalSwiper.enable();
  };

  /**
   * 设置翻页完成
   */
  Xut.View.SetSwiperFilpComplete = function () {
    $$globalSwiper.setTransitionComplete.apply($$globalSwiper, arguments);
  };

  /**
   * 获取全局swiper的动作选择
   * 1.翻页
   * 2.反弹
   * distX, distY, duration
   */
  Xut.View.GetSwiperActionType = function () {
    return $$globalSwiper.getActionType.apply($$globalSwiper, arguments);
  };

  /**
   * 是否为翻页的边界
   * @return {Boolean} [description]
   */
  Xut.View.GetSwpierBorderBounce = function (distance) {
    return $$globalSwiper.isBorder(distance);
  };

  /**
   * 跳转页面
   * 场景内部切换
   * 跳转到指定编号的页面
   * Action 类型跳转
   * xxtlink 超连接跳转,svg内嵌跳转标记处理
   * 文本框跳转
   * ........
   */
  Xut.View.GotoSlide = function (seasonId, chapterId) {

    //修正参数
    var fixParameter = function fixParameter(pageIndex) {
      pageIndex = Number(pageIndex) - 1;
      if (pageIndex < 0) {
        pageIndex = 0;
      }
      return pageIndex;
    };

    //ibooks模式下的跳转
    //全部转化成超链接
    if (Xut.IBooks.Enabled && Xut.IBooks.runMode() && chapterId) {
      location.href = chapterId + ".xhtml";
      return;
    }

    //兼容数据错误
    if (!seasonId && !chapterId) return;

    //如果是一个参数是传递页码数,则为内部跳转
    if (arguments.length === 1) {
      //复位翻页按钮
      Xut.View.ShowNextBar();
      return $$globalSwiper.scrollToPage(fixParameter(seasonId));
    }

    //场景模式内部跳转
    if (options.seasonId == seasonId) {
      //chpaterId 转化成实际页码
      var sectionRang = Xut.data.query('sectionRelated', seasonId);
      var pageIndex = chapterId - sectionRang.start;
      Xut.View.ShowNextBar();
      return $$globalSwiper.scrollToPage(fixParameter(pageIndex));
    }

    //场景与场景的跳转
    return Xut.View.LoadScenario({
      'seasonId': seasonId,
      'chapterId': chapterId
    });
  };

  /**
   * 页面滑动
   * action 动作
   * direction 方向
   * distance 移动距离
   * speed 速度
   *
      action: "flipRebound"
      backIndex : 4
      direction : "prev"
      distance : 0
      frontIndex : 2
      middleIndex: 3
      orientation : "h"
      speed : 300
   *
   */
  Xut.View.SetSwiperMove = function (_ref) {
    var action = _ref.action,
        direction = _ref.direction,
        distance = _ref.distance,
        speed = _ref.speed,
        orientation = _ref.orientation;


    //如果禁止翻页模式 || 如果是滑动,不是边界
    if (!options.hasMultiPage || $$globalSwiper.getMoved() || action === 'flipMove' && $$globalSwiper.isBorder(distance)) {
      return;
    }

    var pagePointer = $$globalSwiper.getPointer();

    /**
     * 在column中滑动的时候，会丢失Direction
     * 具体就是flow在首页，而且chpater只有一个flow的情况下
     */
    $$globalSwiper.setDirection(distance);

    /*如果没有传递布方向，就取页面，这个在全局接口中处理*/
    orientation = orientation || config.launch.scrollMode;

    $$mediator.$$scheduler.movePageBases({
      action: action,
      direction: direction,
      distance: distance,
      speed: speed,
      orientation: orientation,
      'frontIndex': pagePointer.frontIndex,
      'middleIndex': pagePointer.middleIndex,
      'backIndex': pagePointer.backIndex
    });
  };
}

/********************************************
 * 场景API
 * 辅助对象
 ********************************************/

function extendAssist(access, $$globalSwiper) {

  /**
   * 滤镜渐变动画
   * content id
   * 滤镜样式名
   * 1  ".filter-blur-a2"
   * 优先查找page层，后查找master层
   */
  Xut.Assist.FilterGradient = function (contentId, filterClassName) {
    if (contentId && filterClassName) {
      var contentObj = Xut.Contents.Get('page', contentId);
      if (!contentObj) {
        contentObj = Xut.Contents.Get('master', contentId);
        if (contentObj) return;
      }
      if (filterClassName.length) {
        filterClassName = filterClassName.join(' ');
      }
      contentObj.$contentNode.addClass(filterClassName);
    }
  };

  /**
   * 针对HOT的显示与隐藏
   * @param {[type]} activityId    [activity中的Id]
   * @param {[type]} start         [显示与隐藏]
   *     Xut.Assist.TriggerPoint(activityId, 'show')
         Xut.Assist.TriggerPoint(activityId, 'hide')
   */
  Xut.Assist.TriggerPoint = function (activityId, state) {
    var data = Xut.data.query('Activity', activityId);
    if (data) {
      var $dom = $('#' + data.actType + '_' + data._id);
      if ($dom.length) {
        if (state === 'show') {
          Xut.nextTick(function () {
            $dom.css('visibility', 'visible');
          });
        }
        if (state === 'hide') {
          $dom.css('visibility', 'hidden');
        }
      }
    }
  };

  /**
   * 文字动画
   * @param {[type]} contentId [description]
   */
  Xut.Assist.TextFx = function (contentId) {
    var pageObj = Xut.Presentation.GetPageBase();
    var fxObj = pageObj.getLetterObjs(contentId);
    if (fxObj) {
      fxObj.play();
    }
  };

  /**
   * 辅助对象的控制接口
   * 运行辅助动画
   * 辅助对象的activityId,或者合集activityId
   * Run
   * stop
   * 1 零件
   * 2 音频动画
   */
  _.each(["Run", "Stop"], function (apiName) {
    Xut.Assist[apiName] = function (pageType, activityId, outCallBack) {
      access(function (manager, pageType, activityId, outCallBack) {
        //数组
        if (_.isArray(activityId)) {
          //完成通知
          var markComplete = function () {
            var completeStatistics = activityId.length; //动画完成统计
            return function () {
              if (completeStatistics === 1) {
                outCallBack && outCallBack();
                markComplete = null;
              }
              completeStatistics--;
            };
          }();
          _.each(activityId, function (id) {
            manager.assistAppoint(id, $$globalSwiper.getVisualIndex(), markComplete, apiName);
          });
        } else {
          manager.assistAppoint(activityId, $$globalSwiper.getVisualIndex(), outCallBack, apiName);
        }
      }, pageType, activityId, outCallBack);
    };
  });
}

var typeFilter = ['page', 'master'];

/********************************************
 * 场景API
 * 针对page页面的content类型操作接口
 ********************************************/
function extendContent(access, $$globalSwiper) {

  /**
   * 获取指定的对象
   * 传递参数
   * 单一 id
   * 数据id合集 [1,2,4,5,6]
   * @param {[type]}   contentIds  [description]
   * @param {Function} eachContext 回调遍历每一个上下文
   */
  Xut.Contents.Get = function (pageType, contentIds, eachContext) {

    return access(function (manager, pageType, contentIds, eachContext) {

      var contentObj,
          contentObjs,
          pageIndex = Xut.Presentation.GetPageIndex();

      function findContent(currIndex, contentId) {
        var pageObj;
        if (pageObj = manager.$$getPageBase(currIndex)) {
          return pageObj.baseGetContentObject(contentId);
        }
      }

      //如果传递是数组合集
      if (_.isArray(contentIds)) {
        contentObjs = [];
        _.each(contentIds, function (id) {
          contentObj = findContent(pageIndex, id);
          if (eachContext) {
            //传递每一个处理的上下文
            eachContext(id, contentObj);
          } else {
            if (contentObj) {
              contentObjs.push(contentObj);
            } else {
              // console.log('error', '找不到对应的content数据' + id)
            }
          }
        });
        return contentObjs;
      }

      //如果传递的是Content_1_3组合情况
      if (/_/.test(contentIds)) {
        var expr = contentIds.split('_');
        if (expr.length > 1) {
          return findContent(expr[1], expr[2]);
        }
      }

      //单一content id
      contentObj = findContent(pageIndex, contentIds);

      if (eachContext) {
        eachContext(contentObj);
      } else {
        return contentObj;
      }
    }, pageType, contentIds, eachContext);
  };

  /**
   * 得到指定页面零件的数据
   * 获取指定的content数据
   * @param  {[type]} contentId [description]
   * @return {[type]}           [description]
   */
  Xut.Contents.GetPageWidgetData = function (pageType, contentId, pageProportion) {

    //如果没有传递pageType取默认
    if (-1 === typeFilter.indexOf(pageType)) {
      contentId = pageType;
      pageType = 'page';
    }

    //必须有数据
    if (!contentId || !contentId.length) {
      return;
    }

    //保证是数组格式
    if (_.isString(contentId)) {
      contentId = [contentId];
    }

    var contentData,
        contents = [];

    Xut.Contents.Get(pageType, contentId, function (cid, content) {
      //是内部对象
      if (content && (contentData = content.contentData)) {
        //通过内部管理获取对象
        contents.push({
          'id': content.id,
          'idName': content.actName,
          'element': content.$contentNode,
          'theTitle': contentData.theTitle,
          'scaleHeight': contentData.scaleHeight,
          'scaleLeft': contentData.scaleLeft,
          'scaleTop': contentData.scaleTop,
          'scaleWidth': contentData.scaleWidth,
          'contentData': contentData,
          'source': 'innerObjet' //获取方式内部对象
        });
      } else {
        //如果通过内部找不到对象的content数据,则直接查找数据库
        //可能是一个事件的钩子对象
        if (contentData = seekQuery(cid, pageProportion)) {
          var actName = Xut.Presentation.GetContentName(cid);
          var element;
          //如果对象是事件钩子或者是浮动对象
          //没有具体的数据
          if (content && content.$contentNode) {
            element = content.$contentNode;
          } else {
            element = $('#' + actName);
          }
          contents.push({
            'id': cid,
            'idName': actName,
            'element': element,
            'theTitle': contentData.theTitle,
            'scaleHeight': contentData.scaleHeight,
            'scaleLeft': contentData.scaleLeft,
            'scaleTop': contentData.scaleTop,
            'scaleWidth': contentData.scaleWidth,
            'contentData': contentData,
            'source': 'dataBase'
          });
        } else {
          // console.log('error', '找不到对应的GetPageWidgetData数据' + cid)
        }
      }
    });
    return contents;
  };

  //数据库查找
  function seekQuery(id, proportion) {
    var contentData = Xut.data.query('Content', id);
    if (contentData) {
      return reviseSize({
        results: _.extend({}, contentData),
        proportion: proportion
      });
    }
  }

  /**
   * 互斥接口
   * 直接显示\隐藏\停止动画
   */

  //检测类型为字符串
  function typeCheck(objNameList) {
    return !objNameList || typeof objNameList !== 'string' ? true : false;
  }

  /**
   * 针对文本对象的直接操作
   * 显示
   * 隐藏
   * 停止动画
   */
  _.each(["Show", "Hide", "StopAnim"], function (operate) {
    Xut.Contents[operate] = function (pageType, nameList) {
      access(function (manager, pageType, nameList) {
        if (typeCheck(nameList)) return;
        var pageBaseObj;
        if (!(pageBaseObj = manager.assistPocess($$globalSwiper.getVisualIndex()))) {
          console.log('注入互斥接口数据错误！');
          return;
        }
        _.each(nameList.split(','), function (contentId) {
          pageBaseObj.baseContentMutex(contentId, operate);
        });
      }, pageType, nameList);
    };
  });
}

/********************************************
 * 场景API
 * app应用接口
 ********************************************/

function extendApplication(access, $$mediator, $$globalSwiper) {
  /**
   * 获取一个存在的实例对象
   * 区分不同层级page/master
   * 不同类型    content/widget
   */
  Xut.Application.GetExistObject = function (pageType, data) {
    return access(function (manager, pageType) {
      var pageObj;
      if (pageObj = manager.$$getPageBase(data.pageIndex)) {
        if (data.type === 'Content') {
          return pageObj.baseSpecifiedContent(data);
        } else {
          return pageObj.baseSpecifiedComponent(data);
        }
      }
    }, pageType);
  };

  /**
   * 获取全局滚动条对象
   */
  Xut.Application.GetScrollBarObject = function () {
    if ($$mediator.miniBar) {
      if ($$mediator.miniBar.length) {
        for (var i = 0; i < $$mediator.miniBar.length; i++) {
          if ($$mediator.miniBar[i].type === 'Scrollbar') {
            return $$mediator.miniBar[i];
          }
        }
      } else {
        if ($$mediator.miniBar.type === 'Scrollbar') {
          return $$mediator.miniBar;
        }
      }
    }
  };

  /**
   * 获取迷你滚动条对象数量
   */
  Xut.Application.GetMiniBars = function () {
    if ($$mediator.miniBar) {
      return $$mediator.miniBar.length;
    }
    return 0;
  };
}

/********************************************
 * 虚拟摄像机运行的接口
 ********************************************/
function extendCamera(access, $$globalSwiper) {

  /**
   * 移动页面
   * 针对当期那页面操作
     λ  position=0，代表DOM页面的最左边，
     λ  position=50，代表DOM页面的中间，
     λ  position=100，代表DOM页面的最右边
     delay 延时执行时间
   */
  Xut.Camera.MoveX = function (position, speed, delay) {
    if (config.launch.visualMode === 5) {
      $$globalSwiper.scrollToPosition(position, speed, delay);
    }
  };
}

/**
 * 合并参数设置
 * 1 pageMgr
 * 2 masterMgr
 * 3 修正pageType
 * 4 args参数
 * 5 回调每一个上下文
 */
function createaAccess(mgr) {
  return function (callback, pageType, args, eachContext) {
    //如果第一个参数不是pageType模式
    //参数移位
    if (pageType !== undefined && -1 === typeFilter.indexOf(pageType)) {
      var temp = args;
      args = pageType;
      eachContext = temp;
      pageType = 'page';
    }
    //pageIndex为pageType参数
    if (-1 !== typeFilter.indexOf(args)) {
      pageType = args;
      args = null;
    }
    pageType = pageType || 'page';
    if (mgr[pageType]) {
      return callback(mgr[pageType], pageType, args, eachContext);
    } else {
      $warn('传递到access的pageType错误,pageType=' + pageType);
    }
  };
}

/********************************************
 * 场景API
 * 此模块的所有方法都是动态修正上下文，自动切换场景
 * @return {[type]} [description]
 ********************************************/

function initSceneApi($$mediator) {
  var $$globalSwiper = $$mediator.$$globalSwiper;

  //页面与母版的管理器
  var access = createaAccess({
    page: $$mediator.$$scheduler.pageMgr,
    master: $$mediator.$$scheduler.masterMgr
  });

  extendCamera(access, $$globalSwiper);
  extendPresentation(access, $$globalSwiper); //数据接口
  extendView($$mediator, access, $$globalSwiper); //视图接口
  extendAssist(access, $$globalSwiper); // 辅助对象
  extendContent(access, $$globalSwiper); //content对象
  extendApplication(access, $$mediator, $$globalSwiper); //app应用接口

  return function () {
    $$globalSwiper = null;
    access = null;
    $$mediator = null;
  };
}

/*********************************************************************
 *              场景容器构造器
 *          1 构件页面级容器
 *          2 翻页全局事件
 *
 **********************************************************************/
/**
 * 配置多页面参数
 * @return {[type]} [description]
 */
var configMultiple = function configMultiple(options) {
  //如果是epub,强制转换为单页面
  if (Xut.IBooks.Enabled) {
    options.hasMultiPage = false;
  } else {

    ////////////////////////////////
    /// scrollMode全局定义翻页模式  ////
    /// pageMode当前页面定义模式  ////
    ////////////////////////////////
    var pageMode = Number(options.pageMode);

    //如果是禁止翻页，然后还要看是不是有pageMode的设置
    if (config.launch.banMove) {
      options.hasMultiPage = false;
      if (pageMode > 0) {
        //如果工具栏单独设置了页面模式，那么多页面强制改成true
        options.hasMultiPage = true;
      }
    } else {
      if (pageMode === 0) {
        //如果工具栏强制禁止滑动
        options.hasMultiPage = false;
      } else {
        /*判断多页面情况*/
        options.hasMultiPage = true;
      }
    }
  }
};

/**
 * 判断处理那个页面层次
 * 找到pageType类型
 * 项目分4个层
 * page mater page浮动 mater浮动
 * 通过
 * 因为冒泡的元素，可能是页面层，也可能是母板上的
 * @return {Boolean} [description]
 */
var isBelong = function isBelong(node) {
  var pageType = 'page';
  if (node.dataset && node.dataset.belong) {
    pageType = node.dataset.belong;
  }
  return pageType;
};

var Mediator = function (_Observer) {
  inherits(Mediator, _Observer);

  function Mediator(parameter) {
    classCallCheck(this, Mediator);

    var _this = possibleConstructorReturn(this, (Mediator.__proto__ || Object.getPrototypeOf(Mediator)).call(this));

    var $$mediator = _this;

    //配置文件
    var options = $$mediator.options = _.extend({
      //是否多场景加载
      //单页场景 false
      //多场景   true
      'hasMultiScene': false,
      //是否为连续页面
      //通过pageMode的参数定义
      'hasMultiPage': false
    }, parameter);

    //配置多页面参数
    configMultiple(options);

    //启用内部滚动模式
    var insideScroll = false;
    if (config.launch.visualMode === 5) {
      insideScroll = true;
    }

    var setOptions = {
      insideScroll: insideScroll, //内部滚动
      scope: 'child', //translate
      snap: true, //分段
      hasHook: true,
      container: options.sceneNode,
      visualIndex: options.initIndex,
      totalIndex: options.pageTotal,
      actualWidth: config.visualSize.width,
      actualHeight: config.visualSize.height,
      visualWidth: config.screenSize.width, //可视区的宽度
      hasMultiPage: options.hasMultiPage, //多页面
      sectionRang: options.sectionRang //分段值
    };

    /*如果没有强制关闭，并且是竖版的情况下，会启动鼠标滚动模式*/
    if (config.launch.mouseWheel !== false && config.launch.scrollMode === 'v') {
      setOptions.mouseWheel = true;
    }

    /*虚拟摄像头模式，关闭边界反弹*/
    if (config.launch.visualMode === 5) {
      setOptions.borderBounce = false;
    }

    /*快速配置了*/
    _.extend(setOptions, Swiper.getConfig());

    var $$globalSwiper = $$mediator.$$globalSwiper = new Swiper(setOptions);
    var $$scheduler = $$mediator.$$scheduler = new Scheduler($$mediator);

    //如果是主场景,才能切换系统工具栏
    if (options.hasMultiPage) {
      _this.addTools($$mediator);
    }

    //事件句柄对象
    var handlerObj = null;

    /**
     * 过滤器.全局控制函数
     * return true 阻止页面滑动
     */
    $$globalSwiper.$$watch('onFilter', function (hookCallback, point, evtObj) {
      var node = point.target;
      swiperHook(evtObj, node);
      //页面类型
      var pageType = isBelong(node);
      //冒泡的ul根节点
      var parentNode = $$globalSwiper.findBubbleRootNode(point, pageType);
      //执行过滤处理
      handlerObj = closestProcessor.call(parentNode, point, pageType);

      //如果找到是空节点
      //并且是虚拟模式2的话
      //默认允许滑动
      if (!handlerObj) {
        if (config.launch.visualMode === 2) {
          return;
        } else if (config.launch.visualMode === 5) {
          return;
        }
      }

      //停止翻页,针对content对象可以拖动,滑动的情况处理
      if (!handlerObj || handlerObj.attribute === 'disable') {
        hookCallback();
      }
    });

    /**
     * 触屏松手点击，无滑动，判断为点击
     */
    $$globalSwiper.$$watch('onTap', function (pageIndex, hookCallback) {
      if (handlerObj) {
        if (handlerObj.handlers) {
          handlerObj.handlers(handlerObj.elem, handlerObj.attribute, handlerObj.rootNode, pageIndex);
        } else {
          if (!Xut.Contents.Canvas.getIsTap()) {
            Xut.View.ToggleToolbar();
          }
        }
        handlerObj = null;
        hookCallback();
      }
    });

    /**
     * 触屏滑动,通知pageMgr处理页面移动
     */
    $$globalSwiper.$$watch('onMove', function (data) {
      $$scheduler.movePageBases(data);
    });

    /**
     * 触屏滑动,通知ProcessMgr关闭所有激活的热点
     */
    $$globalSwiper.$$watch('onEnd', function (pointers) {
      $$scheduler.suspendPageBases(pointers);
    });

    /**
     * 翻页动画完成回调
     */
    $$globalSwiper.$$watch('onComplete', function () {
      $$scheduler.completePageBases.apply($$scheduler, arguments);
    });

    /**
     * 鼠标滚轮
     */
    var wheellook = false; //如果首页向上滑动，那么锁定马上可以向下滑动
    $$globalSwiper.$$watch('onWheel', function (e, wheelDeltaY) {

      var currPageBase = Xut.Presentation.GetPageBase($$globalSwiper.visualIndex);

      /*如果当前是流式页面*/
      if (currPageBase && currPageBase.hasColumnData) {
        var columnObj = currPageBase.columnGroup.get()[0];
        if (columnObj) {
          /*如果flow的进去是touch的方式，那么这里不需要控制了*/
          if (columnObj.getEntry() === 'touch') {
            wheellook = false;
          }
          /*等待翻页结束后才可以委托到columnObj内部的onWheel滚动
          避免在翻页的时候重复触发*/
          if (!wheellook) {
            var direction = wheelDeltaY > 0 ? 'up' : 'down';
            columnObj && columnObj.onWheel(e, wheelDeltaY, direction);
          }
        }
      } else {

        ///////////////////
        /// PPT页面滚动
        /// 1 mac上鼠标有惯性
        /// 2 win上鼠标每次滑动一点，就是100的值
        ///////////////////

        wheellook = true;

        /*向上滚动*/
        if (wheelDeltaY > 0) {
          $$globalSwiper.prev({
            speed: Xut.plat.isMacOS ? 600 : 300,
            callback: function callback() {
              wheellook = false;
            }
          });
        } else {
          $$globalSwiper.next({
            speed: Xut.plat.isMacOS ? 600 : 300,
            callback: function callback() {
              wheellook = false;
            }
          });
        }
      }
    });

    /**
     * 切换页面
     * @return {[type]}      [description]
     */
    $$globalSwiper.$$watch('onJumpPage', function (data) {
      $$scheduler.gotoPageBases(data);
    });

    /**
     * 退出应用
     * @return {[type]}      [description]
     */
    $$globalSwiper.$$watch('onDropApp', function (data) {
      window.GLOBALIFRAME && Xut.publish('magazine:dropApp');
    });

    /**
     * 母板移动反馈
     * 只有存在data-parallaxProcessed
     * 才需要重新激活对象
     * 删除parallaxProcessed
     */
    $$globalSwiper.$$watch('onMasterMove', function (hindex, target) {
      if (/Content/i.test(target.id) && target.getAttribute('data-parallaxProcessed')) {
        $$scheduler.masterMgr && $$scheduler.masterMgr.reactivation(target);
      }
    });

    /**
     * 销毁接口api
     * @type {[type]}
     */
    _this.destorySceneApi = initSceneApi(_this);
    return _this;
  }

  /**
   * 系统工具栏
   */


  createClass(Mediator, [{
    key: 'addTools',
    value: function addTools($$mediator) {

      _.extend(delegateHooks, {

        /**
         * li节点,多线程创建的时候处理滑动
         */
        'data-container': function dataContainer() {
          Xut.View.ToggleToolbar();
        },


        /**
         * 是背景层
         */
        'data-multilayer': function dataMultilayer() {
          //改变工具条状态
          Xut.View.ToggleToolbar();
        },


        /**
         * 默认content元素可以翻页
         */
        'data-behavior': function dataBehavior(target, attribute, rootNode, pageIndex) {
          //没有事件的元素,即可翻页又可点击切换工具栏
          if (attribute == 'click-swipe') {
            Xut.View.ToggleToolbar();
          }
        }
      });
    }
  }]);
  return Mediator;
}(Observer);

defAccess(Mediator.prototype, '$hasMultiScene', {
  get: function get$$1() {
    return this.options.hasMultiScene;
  }
});

/**
 * 动态注入对象接口
 * 注入对象管理,注册所有widget组件对象
 *  content类型  创建时注册
 *  widget类型   执行时注册
 *  widget 包括 视频 音频 Action 子文档 弹出口 类型
 *  这种类型是冒泡处理，无法传递钩子，直接用这个接口与场景对接
 */
defAccess(Mediator.prototype, '$injectionComponent', {
  set: function set$$1(regData) {
    var injection;
    if (injection = this.$$scheduler[regData.pageType + 'Mgr']) {
      injection.assistPocess(regData.pageIndex, function (pageObj) {
        pageObj.baseAddComponent.call(pageObj, regData.widget);
      });
    } else {
      console.log('注册injection失败,regData=' + regData);
    }
  }
});

/**
 * 得到当前的视图页面
 * @return {[type]}   [description]
 */
defAccess(Mediator.prototype, '$curVmPage', {
  get: function get$$1() {
    return this.$$scheduler.pageMgr.$$getPageBase(this.$$globalSwiper.getVisualIndex());
  }
});

/**
 *  监听viewmodel内部的状态的改变,触发后传入值
 *
 *  与状态有关的change:
 *      翻页
 *          'flipOver' : function(pageIndex) {},
 *
 *      切换工具栏
 *          'toggleToolbar' : function(state, pointer) {},
 *
 *      复位工具栏
 *          'resetToolbar'  : function() {},
 *
 *      隐藏下一页按钮
 *          'hideNext'   : function(state) {},
 *
 *      显示下一页按钮
 *          'showNext'   : function() {}
 *
 *  与创建相关
 *      创建完毕回调
 *          'createComplete': null,
 *      创建后中断自动运行回调
 *          'suspendAutoCallback': null
 *
 */
defProtected(Mediator.prototype, '$bind', function (key, callback) {
  var $$mediator = this;
  $$mediator.$$watch('change:' + key, function () {
    callback.apply($$mediator, arguments);
  });
});

/**
 * 创建页面
 * @return {[type]} [description]
 */
defProtected(Mediator.prototype, '$init', function () {
  this.$$scheduler.initCreate();
});

/**
 * 运动动画
 * @return {[type]} [description]
 */
defProtected(Mediator.prototype, '$run', function () {
  var $$mediator = this;
  $$mediator.$$scheduler.pageMgr.activateAutoRuns($$mediator.$$globalSwiper.getVisualIndex(), Xut.Presentation.GetPageBase());
});

/**
 * 复位对象
 * @return {[type]} [description]
 */
defProtected(Mediator.prototype, '$reset', function () {
  return this.$$scheduler.pageMgr.resetOriginal(this.$$globalSwiper.getVisualIndex());
});

/**
 * 停止所有任务
 * @return {[type]} [description]
 */
defProtected(Mediator.prototype, '$suspend', function () {
  Xut.Application.Suspend({
    skipAudio: true //跨页面不处理
  });
});

/**
 * 销毁场景内部对象
 * @return {[type]} [description]
 */
defProtected(Mediator.prototype, '$destroy', function () {
  this.$$unWatch(); //观察事件
  this.$$globalSwiper.destroy(); //全局事件
  this.$$scheduler.destroyManage(); //派发器
  this.$$scheduler = null;
  this.$$globalSwiper = null;
  this.destorySceneApi(); //动态api
});

var isIOS$2 = Xut.plat.isIOS;
var isBrowser$1 = Xut.plat.isBrowser;

/**
 * 获取翻页按钮位置
 * @return {[type]} [description]
 */
var getArrowStyle = function getArrowStyle() {
  var height = config.data.iconHeight;
  var styleText = 'height:' + height + 'px;width:' + height + 'px';
  var setTable = config.data.settings;
  if (setTable) {
    switch (setTable.NavbarPos) {
      case 0:
        styleText += ';top:0';
        break; //顶部
      case 1:
        styleText += ';margin-top:' + -height / 2 + 'px';
        break; //中间
      case 2:
        styleText += ';top:auto;bottom:0';
        break; //底部
      default:
        break;
    }
  }
  return styleText;
};

/**
 * 工具栏超类
 */

var BarSuper = function () {
  function BarSuper(options) {
    classCallCheck(this, BarSuper);


    if (options) {
      _.extend(this, options);
    }

    /**
     * 系统状态栏高度
     * 在ios浏览器中状态栏高度为0
     * @type {[type]}
     */
    this.$$barHeight = isIOS$2 && !isBrowser$1 ? 20 : 0;

    //获取高度缩放比
    //自动选择缩放比例
    var prop = config.proportion;
    this.$$propHeight = config.layoutMode == "horizontal" ? prop.width : prop.height;

    //获取图标高度
    //工具栏图标高度
    var iconHeight = config.data.iconHeight;
    this.$$iconHeight = isIOS$2 ? iconHeight : Math.round(this.$$propHeight * iconHeight);

    //应用标题
    this.$$appName = config.data.shortName;

    //应用默认配置
    this.$$setTable = config.data.settings;

    /*模板*/
    this._initState();
    this._initToolbar();
  }

  /////////////////////////////////////
  ///        超类私有方法
  /////////////////////////////////////

  createClass(BarSuper, [{
    key: '_$$getArrowOption',
    value: function _$$getArrowOption() {
      var style = getArrowStyle();
      var state = this.barStatus ? '' : 'hide';
      var height = config.data.iconHeight;
      return {
        style: style,
        state: state,
        height: height
      };
    }

    /**
     * 客户端指定：自定义翻页按钮
     * @return {[type]} [description]
     */

  }, {
    key: '_$$createIcon',
    value: function _$$createIcon() {
      var style = getArrowStyle();
      var state = this.toolBarStatus ? '' : 'hide';

      //默认图标路径
      var leftStyle = style + ';background-image:url(images/icons/pageforward_' + config.data.appId + '.svg);background-size:cover';
      var rightStyle = style + ';background-image:url(images/icons/pageback_' + config.data.appId + '.svg);background-size:cover';

      return '<div name="prevArrow"\n                 class="xut-flip-control xut-flip-control-left ' + state + '"\n                 style="' + leftStyle + '">\n           </div>\n           <div name="nextArrow"\n                class="xut-flip-control xut-flip-control-right ' + state + '"\n                style="' + rightStyle + '">\n           </div>';
    }

    /**
     * font字体版本：箭头翻页按钮
     */

  }, {
    key: '_$$createArrow',
    value: function _$$createArrow() {
      var option = this._$$getArrowOption();
      return '<div class="si-icon xut-flip-control xut-flip-control-left icon-angle-left ' + option.state + '"\n                 style="' + option.style + ';text-align:center;line-height:' + option.height + 'px;font-size:4vh;">\n            </div>\n            <div class="si-icon xut-flip-control xut-flip-control-right icon-angle-right ' + option.state + '"\n                 style="' + option.style + ';text-align:center;line-height:' + option.height + 'px;">\n            </div>';
    }

    /**
     * 绑定左右翻页事件响应
     */

  }, {
    key: '_$$bindArrow',
    value: function _$$bindArrow(el, callback) {
      el.on("mouseup touchend", function (e) {
        callback();
        return false;
      });
      return function () {
        el.off();
        el = null;
      };
    }

    /**
     * 显示工具栏
     */

  }, {
    key: '_$$showToolBar',
    value: function _$$showToolBar(pointer) {
      switch (pointer) {
        case 'controlBar':
          this._showTopBar();
          break;
        case 'button':
          this._$$showArrow();
          this.Lock = false;
          break;
        default:
          this._showTopBar();
          this._$$showArrow();
      }
    }

    /**
     *  隐藏工具栏
     */

  }, {
    key: '_$$hideToolBar',
    value: function _$$hideToolBar(pointer) {
      switch (pointer) {
        case 'controlBar':
          this._hideTopBar();
          break;
        case 'button':
          this._$$hideArrow();
          this.Lock = false;
          break;
        default:
          this._hideTopBar();
          this._$$hideArrow();
      }
    }

    /**
     * 针对单个按钮的显示隐藏处理
     */

  }, {
    key: '_$$toggleArrow',
    value: function _$$toggleArrow(dir, status) {
      if (!this.arrows) return;
      var arrow = this.arrows[dir];
      //如果没有创建翻页按钮,则不处理
      if (!arrow) return;
      arrow.able = status;
      //如果人为隐藏了工具栏,则不显示翻页按钮
      if (this.hasTopBar && !this.toolBarStatus && status) {
        return;
      }
      arrow.el[status ? 'show' : 'hide']();
    }

    /////////////////////////////////////
    ///       超类暴露给子类接口
    /////////////////////////////////////

    /**
     * 显示IOS系统工具栏
     *  iOS状态栏0=show,1=hide
     */

  }, {
    key: '_$$showSystemBar',
    value: function _$$showSystemBar() {
      isIOS$2 && Xut.plat.hasPlugin && Xut.Plugin.statusbarPlugin.setStatus(null, null, 0);
    }

    /**
     * 隐藏IOS系统工具栏
     */

  }, {
    key: '_$$hideSystemBar',
    value: function _$$hideSystemBar() {
      isIOS$2 && Xut.plat.hasPlugin && Xut.Plugin.statusbarPlugin.setStatus(null, null, 1);
    }

    /**
     * 创建翻页按钮
     * @return {[type]} [description]
     */

  }, {
    key: '_$$createArrows',
    value: function _$$createArrows() {

      /*存放左右翻页按钮*/
      this.arrows = hash();

      var $str = void 0;

      //动态图标，数据库定义的翻页图标
      //font字体画翻页图标
      //是否使用自定义的翻页按钮: true /false
      //图标名称是客户端指定的：pageforward_'+appId+'.svg
      if (this.$$setTable.customButton) {
        $str = $(String.styleFormat(this._$$createIcon()));
      } else {
        $str = $(String.styleFormat(this._$$createArrow()));
      }
      var $left = $str.eq(0);
      var $right = $str.eq($str.length - 1); //存在文本节点

      this.arrows = {
        prev: {
          off: this._$$bindArrow($left, function () {
            Xut.View.GotoPrevSlide();
          }),
          el: $left,
          able: true
        },
        next: {
          off: this._$$bindArrow($right, function () {
            Xut.View.GotoNextSlide();
          }),
          el: $right,
          able: true
        }
      };

      this.$sceneNode.append($str);
    }

    /**
     * 显示翻页按钮
     */

  }, {
    key: '_$$showArrow',
    value: function _$$showArrow() {
      var arrows = this.arrows;
      for (var dir in arrows) {
        var arrow = arrows[dir];
        arrow.able && arrow.el.show();
      }
    }

    /**
     * 隐藏翻页按钮
     */

  }, {
    key: '_$$hideArrow',
    value: function _$$hideArrow() {
      var arrows = this.arrows;
      for (var dir in arrows) {
        arrows[dir].el.hide();
      }
    }

    /////////////////////////////////////
    ///   对外接口，子类向上转型接口
    /////////////////////////////////////


    /**
     * 隐藏下一页按钮
     */

  }, {
    key: 'hideNext',
    value: function hideNext() {
      this._$$toggleArrow('next', false);
    }

    /**
     * 显示下一页按钮
     */

  }, {
    key: 'showNext',
    value: function showNext() {
      this._$$toggleArrow('next', true);
    }

    /**
     * 隐藏上一页按钮
     */

  }, {
    key: 'hidePrev',
    value: function hidePrev() {
      this._$$toggleArrow('prev', false);
    }

    /**
     * 显示上一页按钮
     */

  }, {
    key: 'showPrev',
    value: function showPrev() {
      this._$$toggleArrow('prev', true);
    }

    /**
     * 切换状态
     */

  }, {
    key: 'toggle',
    value: function toggle(state, pointer) {
      if (this.Lock) return;
      this.Lock = true;
      switch (state) {
        case 'show':
          this._$$showToolBar(pointer);
          break;
        case 'hide':
          this._$$hideToolBar(pointer);
          break;
        default:
          //默认：工具栏显示隐藏互斥处理
          this.toolBarStatus ? this._$$hideToolBar(pointer) : this._$$showToolBar(pointer);
          break;
      }
    }

    /**
     * 超类销毁
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      /*销毁子类*/
      this._destroy();
      /*销毁自身*/
      if (this.arrows) {
        this.arrows.prev.off();
        this.arrows.next.off();
        this.arrows = null;
      }
    }
  }]);
  return BarSuper;
}();

var round$1 = Math.round;
var ratio = 6;
var isIOS$3 = Xut.plat.isIOS;
var TOP = isIOS$3 ? 20 : 0;

var getNavOptions = function getNavOptions() {

  var iconHeight = config.data.iconHeight;
  var proportion = config.proportion;
  var visualSize = config.visualSize;

  //横版模式
  var isHorizontal = config.layoutMode == 'horizontal';

  proportion = isHorizontal ? proportion.width : proportion.height;
  iconHeight = isIOS$3 ? iconHeight : round$1(proportion * iconHeight);

  //导航菜单宽高
  var navHeight = void 0,
      navWidth = void 0;
  var sWidth = visualSize.width;
  var sHeight = visualSize.height;

  //横版模版
  if (isHorizontal) {
    navHeight = round$1(sHeight / ratio);
  } else {
    navWidth = Math.min(sWidth, sHeight) / (isIOS$3 ? 8 : 3);
    navHeight = round$1((sHeight - iconHeight - TOP) * 0.96);
  }

  return {
    sWidth: sWidth,
    sHeight: sHeight,
    navHeight: navHeight,
    navWidth: navWidth,
    proportion: proportion
  };
};

/**
 * 获得css配置数据
 * @param  {[type]} seasonlist [description]
 * @return {[type]}            [description]
 */
var getWrapper = function getWrapper(seasonlist) {

  var width = void 0,
      height = void 0,
      blank = void 0,
      scroller = void 0,
      contentstyle = void 0,
      containerstyle = void 0,
      overwidth = void 0,
      overHeigth = void 0;

  //获得css配置数据
  var options = getNavOptions();
  var font = round$1(options.proportion * 2);

  var navWidth = options.navWidth;
  var navHeight = options.navHeight;
  var sWidth = options.sWidth;
  var sHeight = options.sHeight;

  if (config.layoutMode == 'horizontal') {
    height = round$1(navHeight * 0.9);
    width = round$1(height * sWidth / sHeight); //保持缩略图的宽高比
    blank = round$1(navHeight * 0.05); //缩略图之间的间距
    scroller = 'width:' + seasonlist * (width + blank) + 'px>';
    contentstyle = 'float:left;width:' + width + 'px;height:' + height + 'px;margin-left:' + blank + 'px';
    containerstyle = 'width:96%;height:' + height + 'px;margin:' + blank + 'px auto;font-size:' + font + 'em';
    //横版左右滑动
    //溢出长度+上偏移量
    overwidth = width * seasonlist + seasonlist * blank;
  } else {
    width = round$1(navWidth * 0.9);
    height = round$1(navWidth * 1.1);
    blank = round$1(navWidth * 0.05);
    contentstyle = 'width:' + width + 'px;height:' + height + 'px;margin:' + blank + 'px auto;border-bottom:1px solid rgba(0,0,0,0.3)';
    containerstyle = 'height:' + (navHeight - 4) + 'px;overflow:hidden;margin:2px auto;font-size:' + font + 'em';
    //竖版上下滑动
    overHeigth = height * seasonlist + seasonlist * blank;
  }

  return {
    contentstyle: contentstyle,
    containerstyle: containerstyle,
    overwidth: overwidth,
    overHeigth: overHeigth,
    scroller: scroller
  };
};

/**
 * 导航菜单
 * @param  {[type]} seasonSqlRet [description]
 * @return {[type]}              [description]
 */
function navLayout(results) {

  var seasonlist = results.length;
  var options = getWrapper(seasonlist);

  var list = '';
  var seasonId = void 0;
  var chapterId = void 0;
  var data = void 0;
  var xxtlink = void 0;

  for (var i = 0; i < seasonlist; i++) {
    data = results[i];
    seasonId = data.seasonId;
    chapterId = data._id;
    xxtlink = seasonId + '-' + chapterId;
    list += '<li style="' + options.contentstyle + '">\n                <div data-xxtlink="' + xxtlink + '">\n                    ' + (i + 1) + '\n                </div>\n           </li>';
  }

  //导航
  var navHTML = '<div id="xut-nav-wrapper" style="' + options.containerstyle + '">\n            <div style="width:' + options.overwidth + 'px;\n                                           height:' + options.overHeigth + 'px;\n                                           ' + options.scroller + '">\n                <ul id="xut-nav-section-list">\n                    ' + list + '\n                </ul>\n            </div>\n        </div>';

  return String.styleFormat(navHTML);
}

/**
 * 下拉章节列表
 */

var Section = function () {
  function Section(data) {
    classCallCheck(this, Section);

    this._isHorizontal = config.layoutMode === 'horizontal';
    this._pagedata = data;
    this._$section = $('#xut-nav-section-list');
    this._$list = this._$section.find("li");
  }

  /**
   * 卷滚条
   * @param  {[type]} pageIndex [description]
   * @return {[type]}           [description]
   */


  createClass(Section, [{
    key: 'userIscroll',
    value: function userIscroll(pageIndex) {
      var _this = this;

      var isHorizontal = this._isHorizontal;

      if (this.hBox) {
        if (isHorizontal) {
          this.hBox.goToPage(pageIndex, 0, 0);
        } else {
          this.hBox.goToPage(0, pageIndex, 0);
        }
      } else {
        this.hBox = IScroll('#xut-nav-wrapper', {
          snap: 'li',
          tap: true,
          scrollX: isHorizontal,
          scrollY: !isHorizontal,
          scrollbars: 'custom',
          fadeScrollbars: true,
          stopPropagation: true
        });

        //滑动结束,动态处理缩略图
        this.hBox.on('scrollEnd', function (e) {
          _this.createThumb();
          _this._removeThumb();
        });

        this._$section.on('tap', this._toJump);
      }
    }

    /**
     * 点击元素跳转
     */

  }, {
    key: '_toJump',
    value: function _toJump(e) {
      var target = e.target;
      var xxtlink = void 0;
      if (target) {
        var _xxtlink = target.getAttribute('data-xxtlink');
        if (_xxtlink) {
          _xxtlink = _xxtlink.split('-');
          Xut.View.GotoSlide(_xxtlink[0], _xxtlink[1]);
        }
      }
    }

    /**
     * [ 创建缩略图]
     * @return {[type]} [description]
     */

  }, {
    key: 'createThumb',
    value: function createThumb() {
      var index = this._getPageIndex(),
          //最左边的索引
      count = this._getViewLen(),
          //允许显示的页数
      createBak = this.createBak || [],
          //已创建的页码索引
      createNew = [],
          //新建的页码索引
      pageData = this._pagedata,
          maxLen = pageData.length;

      //确保不会溢出
      count = count > maxLen ? maxLen : count;
      //尽可能地填满
      index = index + count > maxLen ? maxLen - count : index;

      var i = 0;
      var j = void 0;
      var page = void 0;

      for (i = 0; i < count; i++) {
        j = index + i;
        page = pageData[j];
        createNew.push(j);
        if (_.contains(createBak, j)) continue;
        createBak.push(j);

        //如果是分层母板了,此时用icon代替
        if (page.iconImage) {
          this._$list.eq(j).css({
            'background-image': 'url(' + getFileFullPath(page.iconImage, 'navbar-bg') + ')'
          });
        } else {
          this._$list.eq(j).css({
            'background-image': 'url(' + getFileFullPath(page.md5, 'navbar-bg') + ')',
            'background-color': 'white'
          });
        }
      }

      this.createNew = createNew;
      this.createBak = createBak;
    }

    /**
     * [ 清理隐藏的缩略图]
     * @return {[type]} [description]
     */

  }, {
    key: '_removeThumb',
    value: function _removeThumb() {
      var list = this._$list;
      var createNew = this.createNew;
      var createBak = this.createBak;

      _.each(createBak, function (val, i) {
        if (!_.contains(createNew, val)) {
          //标记要清理的索引
          createBak[i] = -1;
          list.eq(val).css({
            'background': ''
          });
        }
      });

      //执行清理
      this.createBak = _.without(createBak, -1);
    }

    /**
     * [ 得到滑动列表中最左侧的索引]
     * @return {[type]} [description]
     */

  }, {
    key: '_getPageIndex',
    value: function _getPageIndex() {
      if (this.hBox.options.scrollX) {
        return this.hBox.currentPage.pageX;
      } else {
        return this.hBox.currentPage.pageY;
      }
    }

    /**
     * [ 获取待创建的缩略图的个数]
     * @return {[type]} [description]
     */

  }, {
    key: '_getViewLen',
    value: function _getViewLen() {
      var hBox = this.hBox,
          eleSize = 1,
          //单个li的高度,
      count = 1,
          len = this._pagedata.length; //li的总数

      if (this._isHorizontal) {
        eleSize = hBox.scrollerWidth / len;
        count = hBox.wrapperWidth / eleSize;
      } else {
        eleSize = hBox.scrollerHeight / len;
        count = hBox.wrapperHeight / eleSize;
      }
      //多创建一个
      return Math.ceil(count) + 1;
    }

    /**
     * 滚动指定位置
     */

  }, {
    key: 'scrollTo',
    value: function scrollTo(pageIndex) {
      this.userIscroll(pageIndex);
    }

    /**
     * 刷新
     */

  }, {
    key: 'refresh',
    value: function refresh() {
      this.hBox && this.hBox.refresh();
    }

    /**
     * 销毁
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.hBox) {
        this._$section.off();
        this._$section = null;
        this._$list = null;
        this.hBox.destroy();
        this.hBox = null;
      }
      this._pagedata = null;
    }
  }]);
  return Section;
}();

/**
 * 目录列表
 * @param  {[type]} hindex    [description]
 * @param  {[type]} pageArray [description]
 * @param  {[type]} modules   [description]
 * @return {[type]}           [description]
 */
var Navbar = function () {
  createClass(Navbar, [{
    key: 'toggle',


    /**
     * 切换
     * @param  {[type]} pageIndex [description]
     * @return {[type]}           [description]
     */
    value: function toggle(pageIndex) {
      this.pageIndex = pageIndex;
      this._navControl();
    }

    /**
     * 隐藏
     * @return {[type]} [description]
     */

  }, {
    key: 'hide',
    value: function hide() {
      this.isRunning && this._navControl();
    }

    /**
     * 销毁
     * @return {[type]} [description]
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.sectionObj) {
        this.sectionObj.destroy();
        this.sectionObj = null;
      }
      this.$container = null;
      this.$button = null;
    }
  }]);

  function Navbar(pageIndex) {
    classCallCheck(this, Navbar);

    this.pageIndex = pageIndex;
    this.isRunning = false; //运行状态
    this.$container = $(".xut-nav-bar"); //显示容器
    this.$button = $(".xut-control-navbar"); //触发按钮
    this._initialize();
  }

  createClass(Navbar, [{
    key: '_initialize',
    value: function _initialize() {
      var _this = this;

      var data = [];
      Xut.data.query('Chapter', Xut.data.novelId, 'seasonId', function (item) {
        return data.push(item);
      });
      Xut.nextTick({
        'container': this.$container,
        'content': navLayout(data)
      }, function () {
        _this.sectionObj = new Section(data); //目录对象
        _this.sectionObj.userIscroll(_this.pageIndex); //初始化滑动
        _this.sectionObj.createThumb(); //初始缩略图
        _this._navControl(); //初始化样式
      });
    }

    /**
     * 控制导航条
     * @return {[type]} [description]
     */

  }, {
    key: '_navControl',
    value: function _navControl() {

      var action = this.$button.attr('fly') || 'in'; //判断点击的动作
      var isIn = action === 'in';

      //初始化目录栏的样式
      //能够显示出来
      if (isIn) {
        this.$container.css({
          'z-index': 0,
          'opacity': 0,
          'display': 'block'
        });
      }

      //触发控制条
      this.$button.css('opacity', isIn ? 0.5 : 1);

      //执行动画
      //出现
      if (isIn) {
        //导航需要重置
        //不同的页面定位不一定
        this.sectionObj.refresh();
        this.sectionObj.scrollTo(this.pageIndex);

        //动画出现
        this.$container.css({
          'z-index': Xut.zIndexlevel(),
          'opacity': 1
        });
        this.$button.attr('fly', 'out');
        this.isRunning = true;
      } else {
        //隐藏
        this.$button.attr('fly', 'in');
        this.$container.hide();
        this.isRunning = false;
      }
    }
  }]);
  return Navbar;
}();

/**
 * 创建主页按钮
 * @param  {[type]} bar [description]
 * @return {[type]}     [description]
 */
function createHomeIcon(height) {
  return "<div class=\"xut-control-backhome\"\n                 style=\"float:left;text-indent:0.25em;height:" + height + "px;line-height:" + height + "px;color:#007aff\">\n                \u4E3B\u9875\n            </div>";
}

/**
 * 创建目录按钮
 * @param  {[type]} bar [description]
 * @return {[type]}     [description]
 */
function createDirIcon(height) {
  return "<div class=\"xut-control-navbar\"\n                 style=\"float:left;margin-left:4px;width:" + height + "px;height:" + height + "px;background-size:cover\">\n            </div>";
}

/**
 * 应用标题
 * @param  {[type]} bar [description]
 * @return {[type]}     [description]
 */
function createTitle(height, appName) {
  return "<div class=\"xut-control-title\"\n                 style=\"z-index:-99;width:100%;position:absolute;line-height:" + height + "px;pointer-events:none\">\n                " + appName + "\n            </div>";
}

/**
 * 创建页码数
 * @param  {[type]} bar [description]
 * @return {[type]}     [description]
 */
function createPageNumber(height, currentPage, pageTotal) {
  var marginTop = height * 0.25;
  var iconH = height * 0.5;
  return "<div class=\"xut-control-pageIndex\"\n                 style=\"float:right;\n                        margin:" + marginTop + "px 4px;\n                        padding:0 0.25em;\n                        height:" + iconH + "px;\n                        line-height:" + iconH + "px;\n                        border-radius:0.5em\">\n                  <span class=\"control-current-page\">" + currentPage + "</span>/<span>" + pageTotal + "</span>\n            </div>";
}

/**
 * 工具栏隐藏按钮
 * @param  {[type]} bar [description]
 * @return {[type]}     [description]
 */
function createHideToolbar(height) {
  return "<div class=\"xut-control-hidebar\"\n                 style=\"float:right;width:" + height + "px;height:" + height + "px;background-size:cover\">\n            </div>";
}

/**
 * 关闭子文档按钮(font字体版本)
 * @param  {[type]} height [description]
 * @return {[type]}        [description]
 */
function createCloseIcon$1(height) {
  return "<div class=\"si-icon icon-close2\"\n                 style=\"float:right;margin-right:4px;width:" + height + "px;height:" + height + "px\">\n            </div>";
}

/**
 * 系统工具栏
 * 主场景工具栏
 */
/**
 * 系统工具栏
 * 模拟ios风格
 */

var IosBar = function (_BarSuper) {
  inherits(IosBar, _BarSuper);

  /**
      $sceneNode,
      arrowButton,
      pageTotal,
      currentPage,
      toolType
   */
  function IosBar(options) {
    classCallCheck(this, IosBar);
    return possibleConstructorReturn(this, (IosBar.__proto__ || Object.getPrototypeOf(IosBar)).call(this, options));
  }

  ////////////////////////
  ///  私有方法
  ///////////////////////

  createClass(IosBar, [{
    key: '_initState',
    value: function _initState() {
      this.Lock = false; //操作锁
      this.delay = 50; //动画延时
      this.hasTopBar = true; //有顶部工具条
      this.currPageNode = null; //当前页码对象
      this.$controlNode = this.$sceneNode.find('.xut-control-bar');
      this.eventElement = this.$controlNode[0]; //绑定事件
    }

    /**
     * 初始化工具栏
     */

  }, {
    key: '_initToolbar',
    value: function _initToolbar() {
      //顶部工具栏可配置
      //0 禁止工具栏
      //1 系统工具栏 - 显示IOS系统工具栏
      if (_.some(this.toolType)) {
        this._initTopBar();
      }

      /*翻页按钮*/
      if (this.arrowButton) {
        this._$$createArrows();
      }
    }

    /**
     * 系统工具条的位置
     * position
     *     0 顶部
     *     1 底部
     */

  }, {
    key: '_barPostion',
    value: function _barPostion(element, position) {
      if (position == 1) {
        //在底部
        element.css({
          bottom: 0,
          height: this.$$iconHeight + 'px'
        });
      } else {
        element.css({ //在顶部
          top: 0,
          height: this.$$iconHeight + 'px',
          paddingTop: '' + this.$$barHeight
        });
      }
    }

    /**
     * 初始化顶部工具栏
     */

  }, {
    key: '_initTopBar',
    value: function _initTopBar() {

      var $controlNode = this.$controlNode;

      //工具栏的显示状态
      this.toolBarStatus = $controlNode.css('display') === 'none' ? false : true;

      //工具栏摆放位置
      this._barPostion($controlNode, this.$$setTable.ToolbarPos);

      var html = '';

      //首页按钮
      if (this.$$setTable.HomeBut) {
        html += createHomeIcon(this.$$iconHeight);
      }
      //目录按钮
      if (this.$$setTable.ContentBut) {
        html += createDirIcon(this.$$iconHeight);
      }
      //添加标题
      html += createTitle(this.$$iconHeight, this.$$appName);
      //工具栏隐藏按钮
      html += createHideToolbar(this.$$iconHeight);
      //关闭子文档
      if (this.$$setTable.CloseBut) {
        html += createCloseIcon$1(this.$$iconHeight);
      }
      //页码数
      if (this.$$setTable.PageBut) {
        html += createPageNumber(this.$$iconHeight, this.currentPage, this.pageTotal);
      }

      //显示
      Xut.nextTick($controlNode.append(String.styleFormat(html)));

      //当前页码标识
      this.currPageNode = $controlNode.find('.control-current-page');

      //事件
      $on(this.eventElement, { start: this });
    }

    /**
     * 跳转到主页
     */

  }, {
    key: '_toggleNavBar',


    /**
     * 切换目录导航
     */
    value: function _toggleNavBar() {
      var pageIndex = Xut.Presentation.GetPageIndex();
      if (this.navbarObj) {
        this.navbarObj.toggle(pageIndex);
      } else {
        this.navbarObj = new Navbar(pageIndex);
      }
    }

    /**
     * 相应事件
     */

  }, {
    key: 'handleEvent',
    value: function handleEvent(e) {
      $handle({
        start: function start(e) {
          switch ($target(e).className) {
            //跳主页
            case "xut-control-backhome":
              IosBar.goHomePage();
              break;
            //切换目录
            case "xut-control-navbar":
              this._toggleNavBar();
              break;
            //隐藏工具栏
            case 'xut-control-hidebar':
              this._hideTopBar();
              break;
          }
        }
      }, this, e);
    }

    ////////////////////////
    ///  提供super接口
    ///////////////////////

    /**
     * 显示顶部工具栏
     */

  }, {
    key: '_showTopBar',
    value: function _showTopBar() {
      var self = this;

      if (this.toolBarStatus) {
        this.Lock = false;
        return;
      }
      this.$controlNode.css({
        'display': 'block',
        'opacity': 0
      });

      self.$controlNode && self.$controlNode.transition({
        'opacity': 1
      }, self.delay, 'in', function () {
        self.hideNavbar();
        self._$$showSystemBar();
        self.toolBarStatus = true;
        self.Lock = false;
      });
    }

    /**
     * 隐藏顶部工具栏
     */

  }, {
    key: '_hideTopBar',
    value: function _hideTopBar() {
      var self = this;
      if (!this.toolBarStatus) {
        this.Lock = false;
        return;
      }
      this.$controlNode && this.$controlNode.transition({
        'opacity': 0
      }, self.delay, 'in', function () {
        self.hideNavbar();
        self.$controlNode.hide();
        self._$$hideSystemBar();
        self.toolBarStatus = false;
        self.Lock = false;
      });
    }

    /**
     * 销毁
     * @return {[type]} [description]
     */

  }, {
    key: '_destroy',
    value: function _destroy() {
      //目录导航
      this.navbarObj && this.navbarObj.destroy();
      //解除事件
      $off(this.eventElement);
      this.currPageNode = null;
      this.toolBarStatus = false;
      this.$controlNode = null;
      this.eventElement = null;
    }

    ////////////////////////
    ///  外部接口
    ///////////////////////

    /**
     * 重置翻页按钮,状态以工具栏为标准
     */

  }, {
    key: 'resetArrow',
    value: function resetArrow() {
      this.toolBarStatus ? this._$$showArrow() : this._$$hideArrow();
    }

    /**
     * 隐藏导航栏
     */

  }, {
    key: 'hideNavbar',
    value: function hideNavbar() {
      this.navbarObj && this.navbarObj.hide('hide');
    }

    /**
     * 更新页码指示
     */

  }, {
    key: 'updatePointer',
    value: function updatePointer(_ref) {
      var parentIndex = _ref.parentIndex;

      this.currPageNode && this.currPageNode.html(parentIndex + 1);
    }
  }], [{
    key: 'goHomePage',
    value: function goHomePage() {
      if (window.DUKUCONFIG) {
        Xut.Application.Suspend({
          processed: function processed() {
            Xut.Application.DropApp(); //退出应用
          }
        });
        return;
      }
      //动作处理
      //如果有动作则关闭，否则直接跳转
      Xut.Application.Suspend({
        processed: function processed() {
          Xut.View.GotoSlide(1);
        }
      });
    }
  }]);
  return IosBar;
}(BarSuper);

/**
 * 函数工具栏
 */

var isIOS$4 = Xut.plat.isIOS;

var closeScenario = function closeScenario() {
  Xut.View.CloseScenario();
};

var fnBar = function (_BarSuper) {
  inherits(fnBar, _BarSuper);

  /*
      arrowButton = false,
      sceneNode,
      toolType,
      pageTotal,
      currentPage
   */
  function fnBar(options) {
    classCallCheck(this, fnBar);
    return possibleConstructorReturn(this, (fnBar.__proto__ || Object.getPrototypeOf(fnBar)).call(this, options));
  }

  /**
   * 初始化
   * @return {[type]} [description]
   */


  createClass(fnBar, [{
    key: '_initState',
    value: function _initState() {
      this.pageTips = null;
      this.currTip = null;
      this.tipsMode = 0;
      this.top = this.$$barHeight;
      this.Lock = false;
      this.delay = 50;
      this.hasTopBar = false;
      this.barStatus = true;
    }

    /**
     * 创建工具栏
     * toolType:
     *      0   禁止工具栏
     *      1   系统工具栏   - 显示IOS系统工具栏
     *      2   场景工具栏   - 显示关闭按钮
     *      3   场景工具栏   - 显示返回按钮
     *      4   场景工具栏   - 显示顶部小圆点式标示
       */

  }, {
    key: '_initToolbar',
    value: function _initToolbar() {
      var type = void 0;
      this.$sceneNode.hide();
      this.controlBar = [];
      //配置工具栏
      while (type = this.toolType.shift()) {
        switch (type) {
          case 1:
            this._createSystemBar();
            break;
          case 2:
            this._createCloseIcon();
            break;
          case 3:
            this._createBackIcon();
            break;
          case 4:
            this._createPageTips();
            break;
          default:
            this.barStatus = false;
            this.hasTopBar = false;
            break;
        }
      }
      //创建翻页按钮
      if (this.arrowButton) {
        this._$$createArrows();
      }
      this.$sceneNode.show();
    }

    /**
     * 系统工具栏
     */

  }, {
    key: '_createSystemBar',
    value: function _createSystemBar() {
      var html = '<div class="xut-control-bar"\n                         style="top:0;height:' + this.$$iconHeight + 'px;padding-top:' + this.top + 'px">\n                    </div>';
      html = $(String.styleFormat(html));
      this._$$showSystemBar();
      this._createBackIcon(html);
      this._createTitle(html);
      this._createPageNum(html);
      this.controlBar = html;
      this.$sceneNode.append(html);
      this.hasTopBar = true;
    }

    /**
     * 页码小圆点
     */

  }, {
    key: '_createPageTips',
    value: function _createPageTips() {
      var _this2 = this;

      var chapters = this.pageTotal;
      var height = this.$$iconHeight;
      var html = '';

      //li内容
      var content = '';

      //如果只有一页则不显示小圆
      if (chapters < 2) {
        return html;
      }

      //圆点尺寸
      var size = isIOS$4 ? 7 : Math.max(8, Math.round(this.$$propHeight * 8));
      var width = 2.5 * size; //圆点间距
      var tipsWidth = chapters * width; //圆点总宽度
      var top = (height - size) / 2; //保持圆点垂直居中
      var left = (config.visualSize.width - tipsWidth) / 2; //保持圆点水平居中


      for (var i = 1; i <= chapters; i++) {
        content += '<li class="xut-scenario-dark"\n                      style="float:left;width:' + width + 'px;height:' + height + 'px;"\n                      data-index="' + i + '">\n                    <div class="xut-scenario-radius"\n                          style="width:' + size + 'px;height:' + size + 'px;margin:' + top + 'px auto">\n                    </div>\n                </li>';
      }

      html = '<ul class="xut-scenario-tips"\n                    style="top:' + this.top + 'px;left:' + left + 'px;width:' + tipsWidth + 'px;opacity:0.6">\n                    ' + content + '\n                </ul>';

      html = $(String.styleFormat(html));

      //点击跳转页面
      this.$tipsNode = html;
      this.$tipsNode.on('click', function (e) {
        var target = e.target;
        switch (target.className) {
          case 'xut-control-nav-hide':
            _this2.hideTopBar();
            break;
          case 'xut-scenario-dark':
            if (_this2.arrowButton) {
              var index = target.getAttribute('data-index') || 1;
              Xut.View.GotoSlide(Number(index));
            }
            break;
          default:
            break;
        }
      });
      this.pageTips = html.children();
      this.tipsMode = 1;
      this.controlBar.push(html);
      this.$sceneNode.append(html);
    }
  }, {
    key: '_onBackClose',
    value: function _onBackClose(el) {
      el.on("mouseup touchend", function (e) {
        closeScenario();
        return false;
      });
      return function () {
        el.off();
        el = null;
      };
    }

    /**
     * font字体版本：关闭按钮
     * @return {[type]} [description]
     */

  }, {
    key: '_createCloseIcon',
    value: function _createCloseIcon() {
      var height = this.$$iconHeight;
      var html = $('<div class="si-icon xut-scenario-close icon-close2"\n                style="top:' + this.top + 'px;width:' + height + 'px;height:' + height + 'px;line-height:' + height + 'px;text-align:center;font-size:3vh;">\n            </div>');

      this.$closeIcon = html;
      this._onBackClose(this.$closeIcon);
      this.controlBar.push(html);
      this.$sceneNode.append(html);
    }

    /**
     * font字体版本：返回按钮
     * @return {[type]} [description]
     */

  }, {
    key: '_createBackIcon',
    value: function _createBackIcon() {
      var height = this.$$iconHeight;
      var html = $('<div class="si-icon xut-scenario-back icon-arrow-left"\n                  style="top:' + this.top + 'px;width:' + height + 'px;height:' + height + 'px;line-height:' + height + 'px;">\n            </div>');

      this.$backIcon = html;
      this._onBackClose(this.$backIcon);
      this.controlBar.push(html);
      this.$sceneNode.append(html);
    }

    /**
     * 创建页码数
     * @param  {[type]} $sceneNode [description]
     * @return {[type]}            [description]
     */

  }, {
    key: '_createPageNum',
    value: function _createPageNum($sceneNode) {
      var pageTotal = this.pageTotal,
          TOP = this.top,
          height = this.$$iconHeight,
          currentPage = this.currentPage,
          style,
          html;

      html = '<div class="xut-control-pageindex"\n                  style="position:absolute;\n                         right:4px;\n                         top:' + (height * 0.25 + TOP) + 'px;\n                         padding:0 0.25em;\n                         height:' + height * 0.5 + 'px;\n                         line-height:' + height * 0.5 + 'px;\n                         border-radius:0.5em">\n                <span class="currentPage">' + currentPage + '</span>/<span>' + pageTotal + '</span>\n            </div>';
      html = $(String.styleFormat(html));
      this.tipsMode = 2;
      this.currTip = html.children().first();
      $sceneNode.append(html);
    }

    /**
     * 应用标题
     * @param  {[type]} $sceneNode [description]
     * @return {[type]}            [description]
     */

  }, {
    key: '_createTitle',
    value: function _createTitle($sceneNode) {
      var html = '<div class="xut-control-title"\n                  style="line-height:' + this.$$iconHeight + 'px">\n                ' + this.$$appName + '\n            </div>';
      $sceneNode.append(String.styleFormat(html));
    }

    ////////////////////////
    ///  提供super接口
    ///////////////////////

    /**
     * 显示顶部工具栏
     */

  }, {
    key: '_showTopBar',
    value: function _showTopBar() {
      var that = this,
          delay = this.delay,
          controlBar = this.controlBar;
      if (this.barStatus) {
        this.Lock = false;
        return;
      }
      if (this.hasTopBar) {
        controlBar.css({
          'display': 'block',
          'opacity': 0
        });
        setTimeout(function () {
          controlBar.transition({
            'opacity': 1
          }, delay, 'linear', function () {
            that.__showSystemBar();
            that.barStatus = true;
            that.Lock = false;
          });
        });
      } else {
        controlBar.forEach(function (el) {
          el.show();
          that.Lock = false;
          that.barStatus = true;
        });
      }
    }

    /**
     * 隐藏顶部工具栏
     */

  }, {
    key: '_hideTopBar',
    value: function _hideTopBar() {
      var that = this,
          delay = this.delay,
          controlBar = this.controlBar;

      if (!this.barStatus) {
        this.Lock = false;
        return;
      }
      if (this.hasTopBar) {
        controlBar.transition({
          'opacity': 0
        }, delay, 'linear', function () {
          that.controlBar.hide();
          that.__hideSystemBar();
          that.barStatus = false;
          that.Lock = false;
        });
      } else {
        controlBar.forEach(function (el) {
          el.hide(delay, function () {
            that.Lock = false;
            that.barStatus = false;
          });
        });
      }
    }

    /**
     * 销毁
     */

  }, {
    key: '_destroy',
    value: function _destroy() {
      this.$sceneNode = null;
      this.controlBar = null;
      this.pageTips = null;
      this.currTip = null;
      this.prevTip = null;

      //小图标点击事件
      if (this.$tipsNode) {
        this.$tipsNode.off();
        this.$tipsNode = null;
      }

      //关闭按钮
      if (this.$closeIcon) {
        this.$closeIcon.off();
        this.$closeIcon = null;
      }

      //返回按钮
      if (this.$backIcon) {
        this.$backIcon.off();
        this.$backIcon = null;
      }
    }

    ////////////////////////
    ///  外部接口
    ///////////////////////

    /**
     * 更新页码指示
     */

  }, {
    key: 'updatePointer',
    value: function updatePointer(_ref) {
      var parentIndex = _ref.parentIndex;

      switch (this.tipsMode) {
        case 1:
          if (this.prevTip) {
            this.prevTip.className = 'xut-scenario-dark';
          }
          this.currTip = this.pageTips[parentIndex];
          this.currTip.className = 'xut-scenario-light';
          this.prevTip = this.currTip;
          break;
        case 2:
          this.currTip.html(parentIndex + 1);
          break;
        default:
          break;
      }
    }
  }]);
  return fnBar;
}(BarSuper);

/**
 * 迷你工具栏超类
 *$sceneNode: $sceneNode,
  visualIndex: pageIndex,
  pageTotal: getPageTotal()
 */

var MiniSuper = function () {
  function MiniSuper(pageBar, options) {
    classCallCheck(this, MiniSuper);

    this.pageBar = pageBar;
    for (var key in options) {
      this[key] = options[key];
    }
    this._$$template();
  }

  /**
   * 模板初始化
   * @return {[type]} [description]
   */


  createClass(MiniSuper, [{
    key: '_$$template',
    value: function _$$template() {
      var _this = this;

      this._init && this._init();
      this._parseBar && this._parseBar();
      var html = this._createHTML();
      if (html) {
        this.$container = $(String.styleFormat(html));
        this._getContextNode();
        this.status = true;
        Xut.nextTick(function () {
          _this._render();
        });
      }
    }
  }, {
    key: '_$$showlBar',
    value: function _$$showlBar() {
      this.status = true;
      this.$container.show();
    }
  }, {
    key: '_$$hideBar',
    value: function _$$hideBar() {
      this.status = false;
      this.$container.hide();
    }
  }, {
    key: '_$$update',
    value: function _$$update(action, index, time) {
      /*避免滚动页面重复更新*/
      if (this._visualIndex != index) {
        this._updateSingle(action, index, time);
      }
      this._visualIndex = index;
    }

    //==========================
    //        对外接口
    //==========================


  }, {
    key: 'destroy',
    value: function destroy() {
      if (this._destroy) {
        this._destroy();
      }
      this.$sceneNode = null;
      this.$container = null;
    }
  }, {
    key: 'toggle',
    value: function toggle(state, pointer) {
      if (pointer !== 'pageNumber') return;
      switch (state) {
        case 'show':
          this._$$showlBar();
          break;
        case 'hide':
          this._$$hideBar();
          break;
        default:
          //默认：工具栏显示隐藏互斥处理
          this.status ? this._$$showlBar() : this._$$hideBar();
          break;
      }
    }

    /**
     * 更新页码
     */

  }, {
    key: 'updatePointer',
    value: function updatePointer(_ref) {
      var _ref$time = _ref.time,
          time = _ref$time === undefined ? 600 : _ref$time,
          action = _ref.action,
          direction = _ref.direction,
          parentIndex = _ref.parentIndex,
          _ref$hasSon = _ref.hasSon,
          hasSon = _ref$hasSon === undefined ? false : _ref$hasSon,
          _ref$sonIndex = _ref.sonIndex,
          sonIndex = _ref$sonIndex === undefined ? 0 : _ref$sonIndex;


      var chapterData = Xut.Presentation.GetPageData('page', parentIndex);

      //从正索引开始
      ++parentIndex;

      //没有column
      if (!hasColumn()) {
        this._$$update(action, parentIndex, time);
        return;
      }

      //默认，需要拿到前置的总和(出去当前)
      var beforeCount = getBeforeCount(chapterData.seasonId, chapterData._id);
      var updateIndex = parentIndex + beforeCount + sonIndex;

      //前翻页，需要叠加flow的总和
      if (direction === 'prev') {
        //前翻页：内部翻页
        if (hasSon) {
          updateIndex = parentIndex + beforeCount + sonIndex - 2;
        }
        //前翻页：外部往内部翻页，正好前一页是内部页，所以需要获取内部页总和
        else {
            //前翻页，需要拿到当期那到前置的总和
            updateIndex = parentIndex + getCurrentBeforeCount(chapterData.seasonId, chapterData._id);
          }
      }

      this._$$update(action, updateIndex, time);
    }
  }]);
  return MiniSuper;
}();

/**
 * 迷你杂志页面工具栏扩展
 * 数字类型
 */

var Digital = function (_MiniSuper) {
  inherits(Digital, _MiniSuper);

  function Digital(pageBar, options) {
    classCallCheck(this, Digital);
    return possibleConstructorReturn(this, (Digital.__proto__ || Object.getPrototypeOf(Digital)).call(this, pageBar, options));
  }

  createClass(Digital, [{
    key: '_createHTML',
    value: function _createHTML() {
      //存在模式3的情况，所以页码要处理溢出的情况。left值
      var right = 0;
      if (config.visualSize.overflowWidth) {
        right = Math.abs(config.visualSize.left * 2) + 'px';
      }
      return '<div class="xut-page-number"style="right:' + right + ';bottom:0;">\n                  <div>1</div>\n                  <strong>/</strong>\n                  <div>' + this.pageTotal + '</div>\n            </div>';
    }
  }, {
    key: '_getContextNode',
    value: function _getContextNode() {
      this.$currtNode = this.$container.find('div:first');
      this.$allNode = this.$container.find('div:last');
    }
  }, {
    key: '_render',
    value: function _render() {
      this.$sceneNode.append(this.$container);
    }

    /**
     * 更新单页
     */

  }, {
    key: '_updateSingle',
    value: function _updateSingle(action, updateIndex) {
      var _this2 = this;

      Xut.nextTick(function () {
        _this2.$currtNode.text(updateIndex);
        if (action === 'init') {
          _this2.$container.show();
        }
      });
    }
  }, {
    key: '_destroy',
    value: function _destroy() {
      this.$currtNode = null;
      this.$allNode = null;
    }

    //==========================
    //        对外接口
    //==========================


    /**
     * 更新总页数
     */

  }, {
    key: 'updateTotal',
    value: function updateTotal(newTotalIndex) {
      /*更新数必须大于当前数*/
      if (newTotalIndex > this.pageTotal) {
        this.pageTotal = newTotalIndex;
        this.$allNode.text(newTotalIndex);
      }
    }
  }]);
  return Digital;
}(MiniSuper);

//样式类型
var dotStyleClass = ["dotIcon-brightness_1", "dotIcon-circle-full", "dotIcon-cd", "dotIcon-adjust", "dotIcon-stop", "dotIcon-record"];

/**
 * 迷你杂志页面工具栏扩展
 * 圆形类型
 */

var Circular = function (_MiniSuper) {
  inherits(Circular, _MiniSuper);

  function Circular(pageBar, options) {
    classCallCheck(this, Circular);
    return possibleConstructorReturn(this, (Circular.__proto__ || Object.getPrototypeOf(Circular)).call(this, pageBar, options));
  }

  /**
   * 解析参数
   * @return {[type]} [description]
   */


  createClass(Circular, [{
    key: "_parseBar",
    value: function _parseBar() {
      var pageBar = this.pageBar;
      //圆点模式样式
      this.dotStyle = Number(pageBar.mode) || 1;
      //样式
      this.dotStyleClass = dotStyleClass[this.dotStyle - 1];
      //位置
      if (pageBar.position) {
        var left = pageBar.position.left;
        var top = pageBar.position.top;
        var width = 'width:100%;';
        if (_.isUndefined(left)) {
          left = 'width:100%;text-align:center;';
        } else {
          width = "width:" + (100 - parseInt(left)) + "%;";
          left = "left:" + left + ";";
        }
        if (_.isUndefined(top)) {
          top = 'bottom:0;';
        } else {
          top = "top:" + top + ";";
        }
        this.position = "" + width + left + top;
      } else {
        this.position = "width:100%;text-align:center;bottom:0;margin-bottom:0.3rem";
      }
    }
  }, {
    key: "_createHTML",
    value: function _createHTML() {
      var dotString = '';
      var countPage = this.pageTotal;
      while (countPage--) {
        dotString += "<span class=\"slider-pager-page\"><i class= " + this.dotStyleClass + "></i></span>";
      }
      return "<div class=\"xut-page-number\"style=\"" + this.position + ";\">" + dotString + "</div>";
    }
  }, {
    key: "_getContextNode",
    value: function _getContextNode() {
      this.$currtNode = this.$container.find('span:first');
    }
  }, {
    key: "_render",
    value: function _render() {
      this.$sceneNode.append(this.$container);
    }

    /**
     * 更新单页
     */

  }, {
    key: "_updateSingle",
    value: function _updateSingle(action, updateIndex) {
      var _this2 = this;

      Xut.nextTick(function () {
        _this2.$container.find('span.slider-pager-page.active').removeClass('active');
        $(_this2.$container.find('span.slider-pager-page')[updateIndex - 1]).addClass("active");
        if (action === 'init') {
          _this2.$container.show();
        }
      });
    }
  }, {
    key: "_destroy",
    value: function _destroy() {
      this.$currtNode = null;
    }

    //==========================
    //        对外接口
    //==========================

    /**
     * 更新总页数
     */

  }, {
    key: "updateTotal",
    value: function updateTotal(newTotalIndex) {
      if (newTotalIndex > this.pageTotal) {
        var visualIndex = 0;
        var span, iconi;
        _.each(this.$container.find('span.slider-pager-page'), function (value, index) {
          if (value.className != "slider-pager-page") {
            visualIndex = index;
          }
        });
        this.$container.empty();
        for (var i = 0; i < newTotalIndex; i++) {
          span = document.createElement('span');
          if (i == visualIndex) {
            span.className = "slider-pager-page active";
          } else {
            span.className = "slider-pager-page";
          }
          iconi = document.createElement('i');
          iconi.className = this.dotStyleClass;
          span.appendChild(iconi);
          this.$container.append(span);
        }
      }
    }
  }]);
  return Circular;
}(MiniSuper);

/**
 * 迷你杂志页面工具栏扩展
 * 卷滚类型
 */

var Scrollbar = function (_MiniSuper) {
  inherits(Scrollbar, _MiniSuper);

  function Scrollbar(pageBar, options) {
    classCallCheck(this, Scrollbar);
    return possibleConstructorReturn(this, (Scrollbar.__proto__ || Object.getPrototypeOf(Scrollbar)).call(this, pageBar, options));
  }

  createClass(Scrollbar, [{
    key: '_init',
    value: function _init() {
      this.visualHeight = config.visualSize.height;
      this.visualWidth = config.visualSize.width;
    }
  }, {
    key: '_parseBar',
    value: function _parseBar() {
      this.direction = this.pageBar.direction || config.launch.scrollMode;
    }
  }, {
    key: '_createHTML',
    value: function _createHTML() {
      //横向翻页
      if (this.direction == "h") {
        this.ratio = this.visualWidth / this.pageTotal;
        return '<div class="xut-iscroll-bar"\n                   style="height:.3rem;left: 2px; right: 2px; bottom: 1px; overflow: hidden;">\n                <div class="xut-iscroll-indicator" style="height: 100%;width: ' + this.ratio + 'px; "></div>\n             </div>';
      } else {
        this.ratio = this.visualHeight / this.pageTotal;
        return '<div class="xut-iscroll-bar"\n                   style="width:.3rem;bottom: 2px; top: 2px; right: 1px; overflow: hidden;">\n                <div class="xut-iscroll-indicator" style="width: 100%;height: ' + this.ratio + 'px;"></div>\n             </div>';
      }
    }

    /**
     * 获取卷滚条对象
     */

  }, {
    key: '_getContextNode',
    value: function _getContextNode() {
      this.$indicatorNode = this.$container.find('div:first');
      this.indicatorNode = this.$indicatorNode[0];
    }
  }, {
    key: '_render',
    value: function _render() {
      this.$sceneNode.append(this.$container);
    }
  }, {
    key: '_setTranslate',
    value: function _setTranslate() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var speed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      Xut.style.setTranslate({ x: x, y: y, speed: speed, node: this.indicatorNode });
    }
  }, {
    key: '_updateTranslate',
    value: function _updateTranslate(updateIndex, speed) {
      if (this.indicatorNode) {
        var distance = void 0;
        if (this.direction == "h") {
          distance = this.visualWidth * (updateIndex - 1) / this.pageTotal;
          this._setTranslate(distance, 0, speed);
        } else {
          distance = this.visualHeight * (updateIndex - 1) / this.pageTotal;
          this._setTranslate(0, distance, speed);
        }
        this.baesTranslateY = this.initTranslateY = distance;
      }
    }
  }, {
    key: '_clearTimer',
    value: function _clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    }

    /**
     * 更新单页
     * PPT页面更新
     */

  }, {
    key: '_updateSingle',
    value: function _updateSingle(action, updateIndex, speed) {
      var _this2 = this;

      if (this.barState === 'hide') {
        this.showBar();
      }

      if (!this.timer) {
        this.timer = setTimeout(function () {
          _this2.hideBar();
        }, 1500);
      }

      /*初始化处理*/
      if (action === 'init') {
        this._updateTranslate(updateIndex, 0);
        this.$container.show();
      } else {
        /*边界处翻页处理*/
        this._updateTranslate(updateIndex, speed);
      }
    }
  }, {
    key: '_destroy',
    value: function _destroy() {
      this._clearTimer();
      this.$indicatorNode = null;
      this.indicatorNode = null;
    }

    //==========================
    //        对外接口
    //==========================


    /**
     * Flow内部滚动
     * 内部滑动页面操作
     * 更新坐标
     */

  }, {
    key: 'updatePosition',
    value: function updatePosition(scrollY) {
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var action = arguments[2];

      var distance = void 0;
      /*向下*/
      if (action === 'down') {
        distance = scrollY + this.initTranslateY;
        this.preTranslateY = distance;
        /*清楚上滑动的参考基础值*/
        this.baesTranslateY = null;
      }
      /*向上*/
      if (action === 'up') {
        /*preTranslateY的值是一直在变化的，但是每次改变其实只要拿到最后一次值，当做基础值设置*/
        if (!this.baesTranslateY) {
          this.baesTranslateY = this.preTranslateY;
        }
        distance = this.baesTranslateY - scrollY;
        this.preTranslateY = distance;
      }
      this._setTranslate(0, distance, time);
    }

    /*显示滚动条*/

  }, {
    key: 'showBar',
    value: function showBar() {
      if (this.barState === 'hide') {
        this.$indicatorNode.css('opacity', 1);
        this.barState = 'show';
      }
    }

    /*隐藏滚动条*/

  }, {
    key: 'hideBar',
    value: function hideBar() {
      this.barState = 'hide';
      this.$indicatorNode.transition({
        opacity: 0,
        duration: 1500,
        easing: 'in'
      });
      this._clearTimer();
    }

    /**
     * 更新总页数
     * flow数据开始不完全，动态补全后重新处理
     */

  }, {
    key: 'updateTotal',
    value: function updateTotal(newTotalIndex) {
      /*更新数必须大于当前数*/
      if (newTotalIndex > this.pageTotal) {
        this.pageTotal = newTotalIndex;
        /*更新基数*/
        if (this.direction == "h") {
          this.ratio = this.visualWidth / this.pageTotal;
          this.$indicatorNode.css('width', this.ratio);
        } else {
          this.ratio = this.visualHeight / this.pageTotal;
          this.$indicatorNode.css('height', this.ratio);
        }
      }
    }
  }]);
  return Scrollbar;
}(MiniSuper);

var matchBar = {
  Digital: Digital,
  Circular: Circular,
  Scrollbar: Scrollbar
};

var create$1 = function create(type, pageBar, options) {
  type = titleCase(type);
  options.type = type;
  //digital
  //circular
  //scrollbar
  if (matchBar[type]) {
    return new matchBar[type](pageBar, options);
  } else {
    /*默认发送数字显示类型*/
    return new Digital(pageBar, options);
  }
};

/**
 * 迷你杂志页面工具栏
 */
function MiniBar() {
  var pageBar = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = arguments[1];

  var arr = [];
  /*多个*/
  if (_.isArray(pageBar.type)) {
    for (var i = 0; i < pageBar.type.length; i++) {
      arr.push(create$1(pageBar.type[i], pageBar, options));
    }
  } else {
    /**单个 */
    arr.push(create$1(pageBar.type, pageBar, options));
  }
  return arr;
}

/**
 * 布局文件
 * 1 控制条
 * 2 导航栏
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
var round$2 = Math.round;
var ratio$1 = 6;
var isIOS$5 = Xut.plat.isIOS;
var TOP$1 = isIOS$5 ? 20 : 0;

/**
 * 主场景
 * @return {[type]} [description]
 */
function mainScene() {
  var layoutMode = config.layoutMode,
      iconHeight = config.iconHeight,
      proportion = config.proportion,
      screenSize = config.screenSize,
      visualSize = config.visualSize,
      originalVisualSize = config.originalVisualSize;
  var sWidth = visualSize.sWidth,
      sHeight = visualSize.sHeight;

  var isHorizontal = layoutMode == 'horizontal';

  proportion = isHorizontal ? proportion.width : proportion.height;
  iconHeight = isIOS$5 ? iconHeight : round$2(proportion * iconHeight);

  var navBarWidth = isHorizontal ? '100%' : Math.min(sWidth, sHeight) / (isIOS$5 ? 8 : 3) + 'px';
  var navBarHeight = isHorizontal ? round$2(sHeight / ratio$1) : round$2((sHeight - iconHeight - TOP$1) * 0.96);
  var navBarTop = isHorizontal ? '' : 'top:' + (iconHeight + TOP$1 + 2) + 'px;';
  var navBarLeft = isHorizontal ? '' : 'left:' + iconHeight + 'px;';
  var navBarBottom = isHorizontal ? 'bottom:4px;' : '';
  var navBaroOverflow = isHorizontal ? 'hidden' : 'visible';

  //导航
  var navBarHTML = '<div class="xut-nav-bar"\n          style="width:' + navBarWidth + ';\n                 height:' + navBarHeight + 'px;\n                 ' + navBarTop + '\n                 ' + navBarLeft + '\n                 ' + navBarBottom + '\n                 background-color:white;\n                 border-top:1px solid rgba(0,0,0,0.1);\n                 overflow:' + navBaroOverflow + ';">\n    </div>';

  //如果启动了双页模式
  //那么可视区的宽度是就是全屏的宽度了，因为有2个页面拼接
  var width = config.launch.doublePageMode ? config.screenSize.width : visualSize.width;

  return String.styleFormat('<div id="xut-main-scene"\n          style="width:' + width + 'px;\n                 height:' + screenSize.height + 'px;\n                 top:0;\n                 left:' + originalVisualSize.left + 'px;\n                 position:absolute;\n                 z-index:' + sceneController.createIndex() + ';\n                 overflow:hidden;">\n\n        <div id="xut-control-bar" class="xut-control-bar"></div>\n        <ul id="xut-page-container" class="xut-flip"></ul>\n        <ul id="xut-master-container" class="xut-master xut-flip"></ul>\n        ' + navBarHTML + '\n        <div id="xut-tool-tip"></div>\n    </div>');
}

/**
 * 副场景
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function deputyScene(id) {
  var visualSize = config.visualSize,
      originalVisualSize = config.originalVisualSize;


  return String.styleFormat('<div id="' + ('scenario-' + id) + '"\n          style="width:' + visualSize.width + 'px;\n                 height:100%;\n                 top:0;\n                 left:' + originalVisualSize.left + 'px;\n                 z-index:' + sceneController.createIndex() + ';\n                 position:absolute;\n                 overflow:hidden;">\n        <ul id="' + ('scenarioPage-' + id) + '" class="xut-flip" style="z-index:2"></ul>\n        <ul id="' + ('scenarioMaster-' + id) + '" class="xut-flip" style="z-index:1"></ul>\n    </div>');
}

/**
 *
 * 配置工具栏行为
 *  1.  工具栏类型
 *  tbType：(如果用户没有选择任何工具栏信息处理，tbType字段就为空)
 *   0  禁止工具栏
 *   1  系统工具栏   - 显示IOS系统工具栏
 *   2  场景工具栏   - 显示关闭按钮
 *   3  场景工具栏   - 显示返回按钮
 *   4  场景工具栏   - 显示顶部小圆点式标示
 *
 *  2.  翻页模式
 *  pageMode：(如果用户没有选择任何处理，pageMode字段就为空)
 *   0 禁止滑动
 *   1 允许滑动无翻页按钮
 *   2 允许滑动带翻页按钮
 *
 * @return {[type]} [description]
 */

/**
 * 分解工具栏配置文件
 */
var parseTooBar = function parseTooBar(toolbar, toolType, pageMode) {
  if (toolbar = parseJSON(toolbar)) {
    //兼容数据库中未指定的情况
    var n = Number(toolbar.pageMode);
    pageMode = _.isFinite(n) ? n : pageMode;
    if (_.isString(toolbar.tbType)) {
      toolType = _.map(toolbar.tbType.split(','), function (num) {
        return Number(num);
      });
    }
  }
  return {
    'toolType': toolType,
    'pageMode': pageMode
  };
};

/**
 * 主场景工具栏配置
 * pageMode:默认2 允许滑动,带翻页按钮
 */
function getMainBar(seasonId) {
  var related = Xut.data.query('sectionRelated', seasonId);

  //默认显示系统工具栏
  var toolType = [1];

  /*如果有多页面，就允许滑动，带翻页按钮
    如果没有多页面，0禁止滑动*/
  var pageMode = related.length > 1 ? 2 : 0;
  return parseTooBar(related.toolbar, toolType, pageMode);
}

/**
 * 副场景工具栏配置
 * pageMode 是否支持滑动翻页  0禁止滑动 1允许滑动
 * toolType   工具栏显示的类型 [0-5]
 */
function getDeputyBar(toolbar, totalCount) {
  var toolType = [0];

  /*如果有多页面，就允许滑动，但是不带翻页按钮
    如果没有多页面，0禁止滑动*/
  var pageMode = totalCount > 1 ? 1 : 0;
  return parseTooBar(toolbar, toolType, pageMode);
}

/**
 * 找到对应容器
 * @return {[type]}            [description]
 */
var findContainer = function findContainer($context, id, isMain) {
  return function (pane, parallax) {
    var node;
    if (isMain) {
      node = '#' + pane;
    } else {
      node = '#' + parallax + id;
    }
    return $context.find(node)[0];
  };
};

/**
 * 如果启动了缓存记录
 * 加载新的场景
 * @return {[type]} [description]
 */
var checkHistory = function checkHistory(history) {
  //直接启用快捷调试模式
  if (config.debug.deBugHistory) {
    Xut.View.LoadScenario(config.debug.deBugHistory);
    return true;
  }

  //如果有历史记录
  if (history) {
    var scenarioInfo = sceneController.seqReverse(history);
    if (scenarioInfo) {
      scenarioInfo = scenarioInfo.split('-');
      Xut.View.LoadScenario({
        'seasonId': scenarioInfo[0],
        'chapterId': scenarioInfo[1],
        'pageIndex': scenarioInfo[2]
      });
      return true;
    } else {
      return false;
    }
  }
};

/**
 * 场景创建类
 */
var SceneFactory = function () {
  function SceneFactory(data) {
    var _this = this;

    classCallCheck(this, SceneFactory);

    var options = _.extend(this, data);
    //创建主场景
    this._createHTML(options, function () {
      if (!Xut.IBooks.Enabled) {
        _this._initToolBar();
      }
      _this._createMediator();
      sceneController.add(data.seasonId, data.chapterId, _this);
    });
  }

  /**
   * 创建场景
   * @return {[type]} [description]
   */


  createClass(SceneFactory, [{
    key: '_createHTML',
    value: function _createHTML(options, callback) {
      //如果是静态文件执行期
      //支持Xut.IBooks模式
      //都不需要创建节点
      if (Xut.IBooks.runMode()) {
        this.$sceneNode = $('#xut-main-scene');
        callback();
        return;
      }
      this.$sceneNode = $(options.isMain ? mainScene() : deputyScene(this.seasonId));
      Xut.nextTick({
        'container': $('.xut-scene-container'),
        'content': this.$sceneNode
      }, callback);
    }

    /**
     * 初始化工具栏
     * @return {[type]} [description]
     */

  }, {
    key: '_initToolBar',
    value: function _initToolBar() {
      var seasonId = this.seasonId,
          pageTotal = this.pageTotal,
          pageIndex = this.pageIndex,
          $sceneNode = this.$sceneNode;


      _.extend(this, this._initDefaultBar(pageIndex, pageTotal, $sceneNode, seasonId));

      this._initMiniBar(pageIndex, pageTotal, $sceneNode);
    }

    /**
     * 初始化传统工具栏
     * 1 主场景，系统工具栏
     * 2 副场景，函数工具栏
     */

  }, {
    key: '_initDefaultBar',
    value: function _initDefaultBar(pageIndex, pageTotal, $sceneNode, seasonId) {

      //配置文件
      var barConfig = {};

      //主场景工具栏设置
      if (this.isMain) {
        barConfig = getMainBar(seasonId, pageTotal);
        if (_.some(barConfig.toolType)) {
          this.mainToolbar = new IosBar({
            $sceneNode: $sceneNode,
            pageTotal: pageTotal,
            currentPage: pageIndex + 1,
            toolType: barConfig.toolType,
            arrowButton: barConfig.pageMode === 2
          });
        }
      } else {
        //副场工具栏配置
        barConfig = getDeputyBar(this.barInfo, pageTotal);
        if (_.some(barConfig.toolType)) {
          this.deputyToolbar = new fnBar({
            $sceneNode: $sceneNode,
            toolType: barConfig.toolType,
            pageTotal: pageTotal,
            currentPage: pageIndex,
            arrowButton: barConfig.pageMode === 2
          });
        }
      }

      return barConfig;
    }

    /**
     * 初始化迷你工具栏
     * 1 全场景，页码显示（右下角）
     * 2 星星显示
     * 3 滚动条
     * @return {[type]} [description]
     */

  }, {
    key: '_initMiniBar',
    value: function _initMiniBar(pageIndex, pageTotal, $sceneNode) {
      var _this2 = this;

      //2016.9.29
      //新增页码显示
      //如果有分栏
      var columnCounts = getColumnCount$1(this.seasonId);

      //如果是min平台强制启动
      if (config.launch.platform === 'mini' || config.debug.toolType.number !== false && columnCounts) {

        /*获取页面总数*/
        var getPageTotal = function getPageTotal(again) {
          if (again) {
            //高度变化后，重新获取
            columnCounts = getColumnCount$1(_this2.seasonId);
          }
          var columnChapterCount = 0;
          if (columnCounts) {
            columnChapterCount = getColumnChapterCount(_this2.seasonId);
          }
          return columnCounts ? pageTotal + columnCounts - columnChapterCount : pageTotal;
        };

        this.miniBar = MiniBar(config.launch.pageBar, {
          $sceneNode: $sceneNode,
          visualIndex: pageIndex,
          pageTotal: getPageTotal()
        });

        /*页面总数改变*/
        if (config.launch.columnCheck) {
          Xut.Application.Watch('change:number:total', function () {
            _this2._eachMiniBar(function () {
              this.updateTotal(getPageTotal(true));
            });
          });
        }
      }
    }

    /**
     * minibar可能是一个合集对象
     * 可以同时存在的可能
     */

  }, {
    key: '_eachMiniBar',
    value: function _eachMiniBar(callback) {
      if (this.miniBar) {
        this.miniBar.forEach(function (bar) {
          callback.call(bar);
        });
      }
    }

    /**
     * 构建创建对象
     * @return {[type]} [description]
     */

  }, {
    key: '_createMediator',
    value: function _createMediator() {
      var _this3 = this;

      var isMain = this.isMain,
          $sceneNode = this.$sceneNode,
          seasonId = this.seasonId,
          pageTotal = this.pageTotal,
          pageIndex = this.pageIndex;


      var tempfind = findContainer($sceneNode, seasonId, isMain);
      var scenePageNode = tempfind('xut-page-container', 'scenarioPage-');
      var sceneMasterNode = tempfind('xut-master-container', 'scenarioMaster-');

      //场景容器对象
      var $$mediator = this.$$mediator = new Mediator({
        scenePageNode: scenePageNode,
        sceneMasterNode: sceneMasterNode,
        'pageMode': this.pageMode,
        'sceneNode': this.$sceneNode[0],
        'hasMultiScene': !isMain,
        'initIndex': pageIndex, //保存索引从0开始
        'pageTotal': pageTotal,
        'sectionRang': this.sectionRang,
        'seasonId': seasonId,
        'chapterId': this.chapterId,
        'isInApp': this.isInApp //提示页面
      });

      $$mediator.miniBar = this.miniBar;

      /**
       * 配置选项
       */
      var pptBar = this.pptBar = this.deputyToolbar ? this.deputyToolbar : this.mainToolbar;

      /**
       * 监听翻页
       * 用于更新页码
       *   parentIndex  父索引
       *   subIndex     子索引
       * @return {[type]} [description]
       */
      $$mediator.$bind('updatePage', function () {
        for (var _len = arguments.length, arg = Array(_len), _key = 0; _key < _len; _key++) {
          arg[_key] = arguments[_key];
        }

        pptBar && pptBar.updatePointer.apply(pptBar, arg);
        _this3._eachMiniBar(function () {
          this.updatePointer.apply(this, arg);
        });
      });

      /**
       * 显示下一页按钮
       */
      $$mediator.$bind('showNext', function () {
        pptBar && pptBar.showNext();
      });

      /**
       * 隐藏下一页按钮
       */
      $$mediator.$bind('hideNext', function () {
        pptBar && pptBar.hideNext();
      });

      /**
       * 显示上一页按钮
       */
      $$mediator.$bind('showPrev', function () {
        pptBar && pptBar.showPrev();
      });

      /**
       * 隐藏上一页按钮
       */
      $$mediator.$bind('hidePrev', function () {
        pptBar && pptBar.hidePrev();
      });

      /**
       * 切换工具栏
       * state, pointer
       */
      $$mediator.$bind('toggleToolbar', function () {
        for (var _len2 = arguments.length, arg = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          arg[_key2] = arguments[_key2];
        }

        pptBar && pptBar.toggle.apply(pptBar, arg);
        _this3._eachMiniBar(function () {
          this.toggle.apply(this, arg);
        });
      });

      /**
       * 复位工具栏
       */
      $$mediator.$bind('resetToolbar', function () {
        if (_this3.mainToolbar) {
          _this3.mainToolbar.resetArrow(); //左右翻页按钮
          _this3.mainToolbar.hideNavbar(); //导航栏
        }
      });

      /**
       * 监听创建完成
       * @return {[type]} [description]
       */
      $$mediator.$bind('createComplete', function (nextAction) {
        _this3.complete && setTimeout(function () {
          if (isMain) {
            _this3.complete(function () {
              Xut.View.HideBusy();
              //检测是不是有缓存加载
              if (!checkHistory(_this3.history)) {
                //指定自动运行的动作
                nextAction && nextAction();
              }
            });
          } else {
            _this3.complete(nextAction);
          }
        }, 200);
      });

      /**
       * 获取滚动条对象
       */
      $$mediator.$bind('getMiniBar', function () {
        return _this3.miniBar;
      });

      //如果是读酷端加载
      if (window.DUKUCONFIG && isMain && window.DUKUCONFIG.success) {
        window.DUKUCONFIG.success();
        $$mediator.$init();
        //如果是客户端加载
      } else if (window.CLIENTCONFIGT && isMain && window.CLIENTCONFIGT.success) {
        window.CLIENTCONFIGT.success();
        $$mediator.$init();
      } else {
        //正常加载
        $$mediator.$init();
      }
    }

    /**
     * 获取场景根节点
     * @return {[type]} [description]
     */

  }, {
    key: 'getSceneNode',
    value: function getSceneNode() {
      return this.$sceneNode;
    }

    /**
     * 销毁场景对象
     * @return {[type]} [description]
     */

  }, {
    key: 'destroy',
    value: function destroy() {

      if (config.launch.columnCheck) {
        Xut.Application.unWatch('change:number:total');
      }

      //销毁工具栏
      if (this.pptBar) {
        this.pptBar.destroy();
        this.pptBar = null;
      }
      this._eachMiniBar(function () {
        this.destroy();
      });
      this.$$mediator.miniBar = null;

      //销毁当前场景
      this.$$mediator.$destroy();

      //销毁节点
      this.$sceneNode.off();
      this.$sceneNode.remove();
      this.$sceneNode = null;

      //销毁引用
      sceneController.remove(this.seasonId);
    }
  }]);
  return SceneFactory;
}();

function initView() {

  //重复点击
  var repeatClick = false;

  /**
   * 忙碌光标
   * */
  $extend(Xut.View, {
    'ShowBusy': showBusy,
    'HideBusy': hideBusy,
    'ShowTextBusy': showTextBusy
  });

  /**
   * 关闭场景
   */
  Xut.View.CloseScenario = function () {
    if (repeatClick) return;
    repeatClick = true;
    var serial = sceneController.takeOutPrevChainId();
    Xut.View.LoadScenario({
      'seasonId': serial.seasonId,
      'chapterId': serial.chapterId,
      'createMode': 'sysClose'
    }, function () {
      repeatClick = false;
    });
  };

  /**
   * 加载一个新的场景
   * 1 节与节跳
   *    单场景情况
   *    多场景情况
   * 2 章与章跳
   * useUnlockCallBack 用来解锁回调,重复判断
   * isInApp 是否跳转到提示页面
   */
  var _loadScenario = function _loadScenario(options, callback) {

    var seasonId = toNumber(options.seasonId);
    var chapterId = toNumber(options.chapterId);
    var pageIndex = toNumber(options.pageIndex);
    var createMode = options.createMode;

    //ibooks模式下的跳转
    //全部转化成超链接
    if (!options.main && Xut.IBooks.Enabled && Xut.IBooks.runMode()) {
      location.href = chapterId + ".xhtml";
      return;
    }

    //当前活动场景容器对象
    var current = sceneController.containerObj('current');

    /*获取到当前的页面对象,用于跳转去重复*/
    var curVmPage = current && current.$$mediator && current.$$mediator.$curVmPage;
    if (curVmPage && curVmPage.seasonId == seasonId && curVmPage.chapterId == chapterId) {
      $warn('\u91CD\u590D\u89E6\u53D1\u9875\u9762\u52A0\u8F7D:seasonId:' + seasonId + ',chapterId:' + chapterId);
      return;
    }

    /*用户指定的跳转入口，而不是通过内部关闭按钮处理的*/
    var userAssign = createMode === 'sysClose' ? false : true;

    /**
     * 场景内部跳转
     * 节相同，章与章的跳转
     * 用户指定跳转模式,如果目标对象是当前应用页面，按内部跳转处理
     * @return {[type]}            [description]
     */
    if (userAssign && current && current.seasonId === seasonId) {
      Xut.View.GotoSlide(seasonId, chapterId);
      return;
    }

    //////////////////////////////////////
    ///
    ///  以下代码是加载一个新场景处理
    ///
    /////////////////////////////////////

    /*清理热点动作,场景外部跳转,需要对场景的处理*/
    current && current.$$mediator.$suspend();

    /*通过内部关闭按钮加载新场景处理，检测是不是往回跳转,重复处理*/
    if (current && userAssign) {
      sceneController.checkToRepeat(seasonId);
    }

    /*读酷启动时不需要忙碌光标*/
    if (options.main && window.DUKUCONFIG) {
      Xut.View.HideBusy();
    } else {
      Xut.View.ShowBusy();
    }

    /**
     * 跳出去
     * $hasMultiScene
     * 场景模式
     * $hasMultiScene
     *      true  多场景
     *      false 单场景模式
     * 如果当前是从主场景加载副场景
     * 关闭系统工具栏
     */
    if (current && !current.$$mediator.$hasMultiScene) {
      Xut.View.HideToolBar();
    }

    /*重写场景的顺序编号,用于记录场景最后记录*/
    var pageId = void 0;
    if (current && (pageId = Xut.Presentation.GetPageId())) {
      sceneController.rewrite(current.seasonId, pageId);
    }

    /*场景信息*/
    var sectionRang = Xut.data.query('sectionRelated', seasonId);

    /**
     * 通过chapterId转化为实际页码指标
     * season 2 {
     *     chapterId : 1  => 0
     *     chpaterId : 2  => 1
     *  }
     * [description]
     * @return {[type]} [description]
     */
    var getInitIndex = function getInitIndex() {
      return chapterId ? function () {
        //如果节点内部跳转方式加载,无需转化页码
        if (createMode === 'GotoSlide') {
          return chapterId;
        }
        //初始页从0开始，减去下标1
        return chapterId - sectionRang.start - 1;
      }() : 0;
    };

    /*传递的参数*/
    var data = {
      seasonId: seasonId, //节ID
      chapterId: chapterId, //页面ID
      sectionRang: sectionRang, //节信息
      isInApp: options.isInApp, //是否跳到收费提示页
      history: options.history, // 历史记录
      barInfo: sectionRang.toolbar, //工具栏配置文件
      pageIndex: pageIndex || getInitIndex(), //指定页码
      pageTotal: sectionRang.length, //页面总数
      complete: function complete(nextBack) {
        //构件完毕回调

        /*第一次加载的外部回调*/
        callback && callback();

        //销毁旧场景
        current && current.destroy();
        //下一个任务存在,执行切换回调后,在执行页面任务
        nextBack && nextBack();
        //去掉忙碌
        Xut.View.HideBusy();
      }
    };

    //主场景判断（第一个节,因为工具栏的配置不同）
    if (options.main || sceneController.mianId === seasonId) {
      //清理缓存
      $removeStorage("history");
      //确定主场景
      sceneController.mianId = seasonId;
      //是否主场景
      data.isMain = true;
    }

    new SceneFactory(data);
  };

  Xut.View.LoadScenario = function (options, callback) {
    /**
     * 如果启动了预加载模式
     * 需要处理跳转的页面预加载逻辑
     */
    var chapterId = toNumber(options.chapterId);
    if (!options.main && chapterId && config.launch.preload) {
      var status = requestInterrupt({
        chapterId: chapterId,
        type: 'nolinear',
        processed: function processed() {
          _loadScenario(options, callback);
          Xut.View.HideBusy();
        }
      });

      /*如果还在预加载，禁止加载*/
      if (status) {
        Xut.View.ShowBusy();
        return;
      }
    }

    /*正常加载*/
    _loadScenario(options, callback);
  };

  /**
   * 通过插件打开一个新view窗口
   */
  Xut.View.Open = function (pageUrl, width, height, left, top) {
    Xut.Plugin.WebView.open(pageUrl, left, top, height, width, 1);
  };

  /**
   * 关闭view窗口
   */
  Xut.View.Close = function () {
    Xut.Plugin.WebView.close();
  };
}

function initAsset() {

  /**
   * 跳转接口
   * @param {[type]} seasonId  [description]
   * @param {[type]} chapterId [description]
   */
  Xut.U3d.View = function (seasonId, chapterId) {
    Xut.View.LoadScenario({
      'seasonId': seasonId,
      'chapterId': chapterId
    });
  };

  /**
   *读取系统中保存的变量的值。
   *如果变量不存在，则新建这个全局变量
   *如果系统中没有保存的值，用默认值进行赋值
   *这个函数，将是创建全局变量的默认函数。
   */
  window.XXTAPI.ReadVar = function (variable, defaultValue) {
    var temp;
    if (temp = $getStorage(variable)) {
      return temp;
    } else {
      $setStorage(variable, defaultValue);
      return defaultValue;
    }
  };

  /**
   * 将变量的值保存起来
   */
  window.XXTAPI.SaveVar = function (variable, value) {
    $setStorage(variable, value);
  };

  /*
   *对变量赋值，然后保存变量的值
   *对于全局变量，这个函数将是主要使用的，替代简单的“=”赋值
   */
  window.XXTAPI.SetVar = function (variable, value) {
    $setStorage(variable, value);
  };
}

function initContents() {

  //存在文档碎片
  //针对音频字幕增加的快捷查找
  Xut.Contents.contentsFragment = {};

  /**
   * 是否为canvas元素
   * 用来判断事件冒泡
   * 判断当前元素是否支持滑动
   * 默认任何元素都支持滑动
   * @type {Boolean}
   */
  Xut.Contents.Canvas = {

    /**
     * 是否允许滑动
     * @type {Boolean}
     */
    SupportSwipe: true,

    /**
     * 对象是否滑动
     * @type {Boolean}
     */
    isSwipe: false,

    /**
     * 对象是否点击
     */
    isTap: false,

    /**
     * 复位标记
     */
    Reset: function Reset() {
      Xut.Contents.Canvas.SupportSwipe = true;
      Xut.Contents.Canvas.isSwipe = false;
    },


    /**
     * 判断是否可以滑动
     * @return {[type]} [description]
     */
    getSupportState: function getSupportState() {
      var state;
      if (Xut.Contents.Canvas.SupportSwipe) {
        state = true;
      } else {
        state = false;
      }
      //清空状态
      Xut.Contents.Canvas.Reset();
      return state;
    },


    /**
     * 判断是否绑定了滑动事件
     * @return {Boolean} [description]
     */
    getIsSwipe: function getIsSwipe() {
      var state;
      if (Xut.Contents.Canvas.isSwipe) {
        state = true;
      } else {
        state = false;
      }
      //清空状态
      Xut.Contents.Canvas.Reset();
      return state;
    },


    /**
     * 是否绑定了点击事件
     */
    getIsTap: function getIsTap() {
      Xut.Contents.Canvas.isTap = false;
      return Xut.Contents.Canvas.isTap;
    }
  };

  /**
   * 恢复节点的默认控制
   * 默认是系统接管
   * 如果'drag', 'dragTag', 'swipeleft', 'swiperight', 'swipeup', 'swipedown'等事件会重写
   * 还需要考虑第三方调用，所以需要给一个重写的接口
   * @return {[type]} [description]
   * Content_1_3
   * [Content_1_3,Content_1_4,Content_1_5]
   */
  Xut.Contents.ResetDefaultControl = function (pageType, id, value) {
    if (!id) return;
    var elements;
    var handle = function handle(ele) {
      if (value) {
        ele.attr('data-behavior', value);
      } else {
        ele.attr('data-behavior', 'disable');
      }
    };
    if ((elements = Xut.Contents.Get(pageType, id)) && elements.$contentNode) {
      handle(elements.$contentNode);
    } else {
      elements = $("#" + id);
      elements.length && handle(elements);
    }
  };

  /**
   * 针对SVG无节点操作
   * 关闭控制
   */
  Xut.Contents.DisableControl = function (callback) {
    return {
      behavior: 'data-behavior',
      value: 'disable'
    };
  };

  /**
   * 针对SVG无节点操作
   * 启动控制
   */
  Xut.Contents.EnableControl = function (Value) {
    return {
      behavior: 'data-behavior',
      value: Value || 'click-swipe'
    };
  };
}

/**
 * 销毁缓存
 */
function clearCache(isRefresh) {
  removeCache(); //userCache
}

/**
 * 销毁结果集
 * @param  {Boolean} isRefresh [description]
 * @return {[type]}            [description]
 */
function clearResult(isRefresh) {
  removeResults(); //json database
}

/**
 * 销毁接口
 * action 可能是
 * 1 exit 默认，单页面切换，只做销毁。但是代码还是同一份
 * 2 refresh 刷新，旋转切换（需要做一些数据保留，比如外联json数据）
 * 3 destory 退出应用，所以这个应该是全销毁
 * @param {[type]} action [description]
 */
function Destroy() {
  var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'exit';


  //销毁所有场景
  sceneController.destroyAllScene();

  //销毁只创建一次的对象
  //修复的音频对象
  //数据的结果集
  if (action === 'destory') {
    //修复的音频对象
    clearFixAudio();
  }

  // refresh状态不删除结果集
  // 只处理destory与exit状态
  if (action === 'destory' || action === 'exit') {
    //删除结果集
    clearResult();

    //删除流式布局的数据
    var $flowNode = $("#xut-stream-flow");
    if ($flowNode.length) {
      $flowNode.remove();
      $flowNode = null;
    }
  }

  //默认全局事件
  clearGlobalEvent();

  //config路径缓存
  clearConfig();

  //删除数据匹配缓存
  clearCache();

  //音视频
  clearAudio$1();

  //音频
  clearVideo();

  //销毁独立APK的键盘事件
  clearAndroid();

  /**
   * 重设缓存的UUID
   * 为了只计算一次
   * @return {[type]} [description]
   */
  clearId();

  Xut.TransformFilter.empty();
  Xut.CreateFilter.empty();

  //销毁节点
  clearRootNode();

  /*清理预加载*/
  clearPreload();

  //删除动态加载的两个css文件
  $('link[data-type]').each(function (index, link) {
    var type = link.getAttribute('data-type');
    if (type === 'svgsheet' || type === 'xxtflow') {
      link.parentNode.removeChild(link);
    }
  });

  //停止分栏探测
  clearColumnDetection();

  //启动配置文件去掉
  config.launch = null;
}

/****************************************************
 *  杂志全局API
 *  Xut.Application
 *  整个应用程序的接口，执行应用级别的操作，例如退出应用之类
 * **************************************************/

function initApplication() {

  /**
   * 后台运行
   * @type {Number}
   */
  var backstage = 0;

  /**
   * 应用加载状态
   * false未加载
   * true 已加载
   * @type {Boolean}
   */
  var appState = false;

  /**
   * 应用事件监听
   * 1.Xut.Application.Watch('complete',fn)
   * 2.initComplete
   */
  var __app__ = new Observer();

  /**
   * 监听应用事件
   * @param {[type]}   event    [description]
   * @param {Function} callback [description]
   */
  Xut.Application.Watch = function (event, callback) {
    var fn = function fn() {
      callback.apply(__app__, arguments);
    };
    __app__.$$watch(event, fn);
    return fn;
  };

  /**
   * 只监听一次
   * 触发后就销毁
   */
  Xut.Application.onceWatch = function (event, callback) {
    var fn = function fn() {
      callback.apply(__app__, arguments);
    };
    __app__.$$once(event, fn);
    return fn;
  };

  /**
   * 触发通知
   * @param {...[type]} arg [description]
   */
  Xut.Application.Notify = function () {
    __app__.$$emit.apply(__app__, arguments);
  };

  /**
   * 销毁
   */
  Xut.Application.unWatch = function (event, fn) {
    __app__.$$unWatch(event, fn);
  };

  /**
   * 后台运行
   * @type {Number}
   */
  Xut.Application.IsBackStage = function () {
    return backstage;
  };

  /**
   * home隐藏
   * 后台运行的时候,恢复到初始化状态
   * 用于进来的时候激活Activate
   */
  Xut.Application.Original = function () {
    backstage = 1;
    //传递一个完全关闭的参数
    $suspend('', '', true);
    $original();
  };

  /**
   * home显示
   * 后台弹回来
   * 激活应用行为
   */
  Xut.Application.Activate = function () {
    backstage = 0;
    $autoRun();
  };

  /**
   * 退出应用
   */
  Xut.Application.Exit = function () {
    /*启动代码用户操作跟踪*/
    config.sendTrackCode('exit', { time: +new Date() - config.launch.launchTime });
    Destroy('exit');
  };

  /**
   * 2016.10.11
   * 刷新程序
   * 这个与销毁有点区别
   * 比如外联的数据，不需要删除
   */
  Xut.Application.Refresh = function () {
    Destroy('refresh');
  };

  /**
   * 销毁应用
   */
  Xut.Application.Destroy = function () {
    Xut.Application.DropApp();
  };

  /**
   * 销毁
   * 退出app
   * 提供给iframe方式加载后退出app处理接口
   */
  Xut.Application.DropApp = function () {

    /**
     * iframe模式,退出处理
     * @return {[type]} [description]
     */
    var destroy = function destroy() {
      __app__.$$unWatch();
      Destroy('destory');
      window.GLOBALCONTEXT = null;
    };

    /**
     * 通过launch启动动态配置
     */
    if (config.launch.lauchMode === 1) {
      destroy();
      return;
    }

    //如果读酷
    if (window.DUKUCONFIG) {
      //外部回调通知
      if (window.DUKUCONFIG.iframeDrop) {
        var appId = $getStorage('appId');
        window.DUKUCONFIG.iframeDrop(['appId-' + appId, 'novelId-' + appId, 'pageIndex-' + appId]);
      }
      window.DUKUCONFIG = null;
      destroy();
      return;
    }

    //客户端模式
    if (window.CLIENTCONFIGT) {
      //外部回调通知
      if (window.CLIENTCONFIGT.iframeDrop) {
        window.CLIENTCONFIGT.iframeDrop();
      }
      window.CLIENTCONFIGT = null;
      destroy();
      return;
    }

    //妙妙学客户端
    if (window.MMXCONFIG) {
      //外部回调通知
      if (window.MMXCONFIG.iframeDrop) {
        window.MMXCONFIG.iframeDrop();
      }
      window.MMXCONFIG = null;
      destroy();
      return;
    }
  };

  /**
   * 停止应用
   * skipMedia 跳过音频你处理(跨页面)
   * dispose   成功处理回调
   * processed 处理完毕回调
   */
  Xut.Application.Suspend = function (_ref) {
    var skipAudio = _ref.skipAudio,
        dispose = _ref.dispose,
        processed = _ref.processed;

    $stop(skipAudio);
    processed && processed();
  };

  /**
   * 启动应用
   */
  Xut.Application.Launch = function () {};

  /**
   * 设置应用状态
   */
  Xut.Application.setAppState = function () {
    appState = true;
  };

  /**
   * 删除应用状态
   * @return {[type]} [description]
   */
  Xut.Application.delAppState = function () {
    appState = false;
  };

  /**
   * 获取应用加载状态
   * @return {[type]} [description]
   */
  Xut.Application.getAppState = function () {
    return appState;
  };

  /**
   * 延时APP运用
   * 一般是在等待视频先加载完毕
   * @return {[type]} [description]
   */
  Xut.Application.delayAppRun = function () {
    Xut.Application.setAppState();
  };

  /**
   * 启动app
   * 重载启动方法
   * 如果调用在重载之前，就删除，
   * 否则被启动方法重载
   * @type {[type]}
   */
  Xut.Application.LaunchApp = function () {
    Xut.Application.delAppState();
  };
}

/**
 * 通过全局方法 Xut.extend() 使用插件:
 */
function initExtend() {
  Xut.extend = function (plugin) {
    //   if (plugin.installed) {
    //     return
    //   }
    //   const args = _.toArray(arguments, 1)
    //   args.unshift(this)
    //   if (typeof plugin.install === 'function') {
    //     plugin.install.apply(plugin, args)
    //   } else {
    //     plugin.apply(null, args)
    //   }
    //   plugin.installed = true
    //   return this
  };
}

/**
 *
 * 杂志全局API
 *
 *  *** 有方法体的是全局接口，不会被重载***
 *  *** 无方法体的是场景接口，总会切换到当前可视区域场景***
 *
 * 1.   Xut.Application
 *          a)  整个应用程序的接口，执行应用级别的操作，例如退出应用之类。
 * 2.   Xut.DocumentWindow
 *          a)  窗口的接口。窗口就是电子杂志的展示区域，可以操作诸如宽度、高度、长宽比之类。
 * 3.   Xut.View
 *          a)  视图接口。视图是窗口的展示方式，和页面相关的接口，都在这里。
 * 4.   Xut.Presentation
 *          a)  数据接口。和电子杂志的数据相关的接口，都在这里。
 * 5.   Xut.Slides
 *          a)  所有页面的集合
 * 6.   Xut.Slide
 *          a)  单个页面
 * 7.   Xut.Master
 *          a)  页面的母版
 */
var assignInit = function assignInit(interName) {
  if (!Xut[interName]) {
    Xut[interName] = {};
  }
};

function initGlobalAPI() {

  //初始化接口
  assignInit('U3d');
  assignInit('View');
  assignInit('Assist');
  assignInit('Contents');
  assignInit('Application');
  assignInit('Presentation');

  /*新增虚拟摄像机运行的接口
  2017.6.2*/
  assignInit('Camera');

  //脚本接口
  window.XXTAPI = {};

  initExtend();
  initAsset();
  initView();
  initContents();
  initApplication();
}

////////////////////////////////
///
/// 全局config与 launch配置优先级
/// lauch可以覆盖全局config配置
///
////////////////////////////////

/**
 * 获取后缀
 * @return {[type]} [description]
 * ios 支持apng '_i'
 * 安卓支持webp  '_a'
 */
function getSuffix() {
  return Xut.plat.supportWebp ? '_a' : '_i';
}

/*预先判断br的基础类型*/
// 1 在线模式 返回增加后缀
// 2 手机模式 返回删除后缀
// 3 PC模式，不修改
function getBrType(mode) {

  //自适应平台
  if (mode === 1) {
    if (Xut.plat.isIOS) {
      return getBrType(2);
    }
    if (Xut.plat.isAndroid) {
      return getBrType(3);
    }
  }

  //ios
  if (mode === 2) {
    if (Xut.plat.isBrowser) {
      //浏览器访问
      return getSuffix();
    } else {
      //app访问
      return 'delete';
    }
  }
  //android
  if (mode === 3) {
    if (Xut.plat.isBrowser) {
      //浏览器访问
      return getSuffix();
    } else {
      //app访问
      return 'delete';
    }
  }

  /**
   * 纯PC端
   * 自动选择支持的
   * 但是不用APNG了
   */
  if (Xut.plat.isBrowser) {
    return getSuffix();
  }

  /*默认选择png，理论不会走这里了*/
  return '';
}

/*
  获取真实的配置文件 priority
  优先级： launch > config
  1 cursor
  2 trackCode
  3 brModel
 */
function priorityConfig() {

  /*独立app与全局配置文件*/
  var launch = config.launch;
  var golbal = config.golbal;

  //////////////////////////////////
  /// 忙碌光标
  //////////////////////////////////
  if (launch) {
    /*因为光标可以配置false 关闭，所以这里需要注意判断*/
    var cursor = launch.cursor || launch.cursor === false ? launch.cursor : golbal.cursor;

    /*每次配置光标之前都重置，可能被上个给覆盖默认的*/
    resetCursor();

    /*如果配置了关闭*/
    if (cursor === false) {
      setDisable();
    } else if (cursor) {
      /*自定义忙碌*/
      if (cursor.time) {
        setDelay(cursor.time);
      }
      if (cursor.url) {
        setPath(cursor.url);
      }
    }
  }

  //////////////////////////////////
  /// 如果启动了代码追踪，配置基本信息
  //////////////////////////////////
  var trackTypes = launch && launch.trackCode || golbal.trackCode;
  config.sendTrackCode = function () {};
  config.hasTrackCode = function () {};
  /*'launch', 'init', 'exit', 'flip', 'content', 'hot', 'swipe']*/
  if (trackTypes && _.isArray(trackTypes) && trackTypes.length) {
    if (!launch.trackCode) {
      launch.trackCode = {};
    }
    trackTypes.forEach(function (type) {
      launch.trackCode[type] = true;
    });
    var uuid = Xut.guid();

    /*检测是否有代码追踪*/
    config.hasTrackCode = function (type) {
      if (launch && launch.trackCode && launch.trackCode[type]) {
        return true;
      }
    };

    /*合并命令，动作类型归类为action*/
    var modifyName = ['content', 'hot'];
    var getTrackName = function getTrackName(type) {
      if (~modifyName.indexOf(type)) {
        return 'action';
      }
      return type;
    };

    /*发送代码追踪数据*/
    config.sendTrackCode = function (type) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (config.hasTrackCode(type)) {
        Xut.Application.Notify('trackCode', getTrackName(type), _.extend(options || {}, {
          uuid: uuid,
          appId: config.data.appId,
          appName: config.data.shortName
        }));
      }
    };
  }

  //////////////////////////////////
  /// 图片模式webp
  //////////////////////////////////
  if (launch) {
    if (!launch.brModel && golbal.brModel) {
      launch.brModel = golbal.brModel;
    }

    /*预先判断出基础类型*/
    if (launch.brModel) {
      launch.brModelType = getBrType(launch.brModel);
    }
  }

  //////////////////////////////////
  ///golbal混入到launch中
  //////////////////////////////////
  for (var key in golbal) {
    if (launch[key] === undefined) {
      launch[key] = golbal[key];
    }
  }

  //////////////////////////////////
  ///竖版的情况下，页面模式都强制为1
  //////////////////////////////////
  if (launch.scrollMode === 'v') {
    launch.visualMode = 1;
  }
}

/*代码初始化*/
initAudio();
initVideo();
initGlobalAPI();

Xut.Version = 887.9;

/*加载应用app*/
var initApp = function initApp() {
  for (var _len = arguments.length, arg = Array(_len), _key = 0; _key < _len; _key++) {
    arg[_key] = arguments[_key];
  }

  /*针对异步的代码以前检测出来*/
  initAsyn(function () {
    /*配置优先级*/
    priorityConfig();
    /*全局的一些事件处理*/
    initGlobalEvent();
    /*根节点*/

    var _initRootNode = initRootNode.apply(undefined, arg),
        $rootNode = _initRootNode.$rootNode,
        $contentNode = _initRootNode.$contentNode;

    nextTick({ container: $rootNode, content: $contentNode }, main);
  });
};

/*提供全局配置文件*/
var mixGolbalConfig = function mixGolbalConfig(setConfig) {
  if (setConfig) {
    Xut.mixin(config.golbal, setConfig);
  }
};

/*接口接在参数,用户横竖切换刷新*/
var cacheOptions = void 0;
var delayTimer = null;

/*横竖切换*/
var bindOrientateMode = Xut.plat.isBrowser && config.orientateMode ? function () {
  $(window).on('orientationchange', function (e) {

    /**
     * 2017.5.23
     * 安卓手机播放视频，全屏的情况下，会强制横版
     * 导致了触发横竖切换关闭应用
     */
    if (Xut.Application.PlayHTML5Video) {
      return;
    }

    //安卓设备上,对横竖切换的处理反映很慢
    //所以这里需要延时加载获取设备新的分辨率
    //2016.11.8
    function delay(fn) {
      if (!delayTimer) {
        delayTimer = setTimeout(function () {
          Xut.Application.Refresh();
          clearTimeout(delayTimer);
          delayTimer = null;
          fn();
        }, 1000);
      }
    }

    var temp = cacheOptions;
    if (temp && temp.length) {
      delay(function () {
        Xut.Application.Launch(temp.pop());
        temp = null;
      });
    } else {
      delay(function () {
        initApp();
      });
    }
  });
} : function () {};

/*新版本加载*/
Xut.Application.Launch = function (option) {
  if (config.launch) {
    return;
  }
  var setConfig = Xut.Application.setConfig;
  if (setConfig && setConfig.lauchMode === 1) {
    mixGolbalConfig(setConfig);
    /*当前的launch配置文件，用于横竖切换处理*/
    cacheOptions = [option];
    config.launch = $.extend(true, { launchTime: +new Date() }, option);
    if (option.path) {
      _.each(option.path, function (value, key) {
        config.launch[key] = key === 'resource' ? slashPostfix(value) : value;
      });
      delete config.launch.path;
    }
    bindOrientateMode();
    initApp(option.el, option.cursor);
  }
};

/*判断是否script有data-plat属性*/
var hasLaunch = function hasLaunch() {
  var scripts = document.querySelectorAll('script');
  for (var i = 0; i < scripts.length; i++) {
    var node = scripts[i];
    if (node.getAttribute('data-plat') === 'mini') {
      return true;
    }
  }
};

/*老版本加载*/
setTimeout(function () {
  var setConfig = Xut.Application.setConfig;
  if (!setConfig || setConfig && setConfig.lauchMode !== 1) {
    if (hasLaunch()) {
      return;
    }
    mixGolbalConfig(setConfig);
    /*保证兼容，不需要判断launch存在，初始空对象*/
    config.launch = {};
    initApp();
  }
}, 100);

})));
