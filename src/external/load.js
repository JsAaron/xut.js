var fontName = ['css/font.css']
var cssName = [
  'css/common.css',
  'css/horizontal.css',
  'css/vertical.css',
  'css/adaptive-image.css',
  'css/css3-filters.css',
  'css/global-bar.css',

  'css/font-dot.css',
  'css/font-flaticon.css',
  'css/font-tool.css',
  'css/font-flarevideo.css'
]

//2016.11.14 去掉代码区域
//'css/video-js.css',
//'lib/plugin/library/redux.js',
//'lib/plugin/library/video.js',

//2017.5.5去掉视频flarevideo
// 'css/flarevideo.css',
// 'css/flarevideo.default.css'
//
// 'lib/plugin/library/video/jquery.hammer.js',
// 'lib/plugin/library/video/jquery.ui.slider.js',
// 'lib/plugin/library/video/jquery.ui.touch-punch.js',
// 'lib/plugin/library/video/flarevideo.js',

var jsName = [

  'src/external/device.js',
  'src/external/environ.js',
  'src/external/namespace.js',
  'src/external/support.js',
  'src/external/postmessage.js',
  'src/external/ibooks.epub.js',

  'src/plugin/library/jquery.js',
  'src/plugin/library/jquery.transit.js', //2016.11.2 新增
  'src/plugin/library/underscore.js',
  'src/plugin/library/iscroll.js',
  'src/plugin/library/hammer.js',

  //文字特效
  'src/plugin/library/textfx/charming.js',
  'src/plugin/library/textfx/anime.js',
  'src/plugin/library/textfx/textfx.js',


  // 视频插件
  'src/plugin/library/video/jquery.hammer.js',
  'src/plugin/library/video/jquery.ui.slider.js',
  'src/plugin/library/video/jquery.ui.touch-punch.js',
  'src/plugin/library/video/flarevideo.js',


  'src/plugin/cordova/cordova.js',
  'src/plugin/cordova/record.js',
  'src/plugin/cordova/readAssetsFilePlugin.js',
  'src/plugin/cordova/initDatabase.js',
  'src/plugin/cordova/web.js',
  'src/plugin/cordova/video.js',
  'src/plugin/cordova/openAppPlugin.js',
  'src/plugin/cordova/tabletPlugin.js',
  'src/plugin/cordova/statusbar.js',
  'src/plugin/cordova/iap.js',
  'src/plugin/cordova/AppStoreLink.js',
  'src/plugin/cordova/downloadPlugin.js',
  'src/plugin/cordova/xxteManager.js',
  'src/plugin/cordova/unzipPlugin.js',
  'src/plugin/cordova/readPlugin.js',
  'src/plugin/cordova/deletePlugin.js',

  'src/plugin/animate/draggable.min.js',
  'src/plugin/animate/tweenmax.min.js'
]


function load(fileList, temp) {
  var list = ''
  fileList.forEach(function(name) {
    list += temp(name)
  })
  document.write(list)
}

//for build
if (typeof exports === "object" && typeof module !== "undefined") {
  exports.cssName = cssName
  exports.jsName = jsName
  exports.fontName = fontName
} else {
  //for index.html
  load(cssName.concat(fontName), function(name) {
    return '<link type="text/css" rel="stylesheet" href="' + name + '?random=' + Math.random() + '">'
  })
  load(jsName, function(name) {
    return '<script type="text/javascript" src="' + name + '?random=' + Math.random() + '"><\/script>'
  })
}
