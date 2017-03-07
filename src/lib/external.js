var footName = ['css/font.css']
var cssName = [
  'css/common.css',
  'css/horizontal.css',
  'css/vertical.css',
  'css/adaptive-image.css',
  'css/flarevideo.css',
  'css/flarevideo.default.css'
]

//2016.11.14 去掉代码区域
//'css/video-js.css',
//'lib/plugin/library/redux.js',
//'lib/plugin/library/video.js',

var jsName = [

  'lib/external/device.js',
  'lib/external/environ.js',
  'lib/external/namespace.js',
  'lib/external/support.js',
  'lib/external/postmessage.js',
  'lib/external/ibooks.epub.js',

  'lib/plugin/library/jquery.js',
  'lib/plugin/library/jquery.transit.js', //2016.11.2 新增
  'lib/plugin/library/underscore.js',
  'lib/plugin/library/iscroll.js',
  'lib/plugin/library/hammer.js',

  //文字特效
  'lib/plugin/library/textfx/charming.js',
  'lib/plugin/library/textfx/anime.js',
  'lib/plugin/library/textfx/textfx.js',


  // 视频插件
  'lib/plugin/library/video/jquery.hammer.js',
  'lib/plugin/library/video/jquery.ui.slider.js',
  'lib/plugin/library/video/jquery.ui.touch-punch.js',
  'lib/plugin/library/video/flarevideo.js',

  'lib/plugin/cordova/cordova.js',
  'lib/plugin/cordova/readAssetsFilePlugin.js',
  'lib/plugin/cordova/initDatabase.js',
  'lib/plugin/cordova/web.js',
  'lib/plugin/cordova/video.js',
  'lib/plugin/cordova/openAppPlugin.js',
  'lib/plugin/cordova/tabletPlugin.js',
  'lib/plugin/cordova/statusbar.js',
  'lib/plugin/cordova/iap.js',
  'lib/plugin/cordova/AppStoreLink.js',
  'lib/plugin/cordova/downloadPlugin.js',
  'lib/plugin/cordova/xxteManager.js',
  'lib/plugin/cordova/unzipPlugin.js',
  'lib/plugin/cordova/readPlugin.js',
  'lib/plugin/cordova/deletePlugin.js',

  'lib/plugin/animate/draggable.min.js',
  'lib/plugin/animate/tweenmax.min.js'
]


function load(fileList, temp) {
  var list = ''
  fileList.forEach(function(name) {
    list += temp(name)
  })
  document.write(list)
}

//for build
if(typeof exports === "object" && typeof module !== "undefined") {
  exports.cssName = cssName
  exports.jsName = jsName
} else {
  //for index.html
  load(cssName.concat(footName), function(name) {
    return '<link type="text/css" rel="stylesheet" href="' + name + '?random=' + Math.random() + '">'
  })
  load(jsName, function(name) {
    return '<script type="text/javascript" src="' + name + '?random=' + Math.random() + '"><\/script>'
  })
}