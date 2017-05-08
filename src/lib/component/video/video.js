/**
 * 视频和网页模块（统一整合到VideoClass里面了）
 * 这里有四种播放器:
 *    1：基于html5原生实现的video标签 for ios
 *    2：基于phoneGap插件实现的media  for android
 *    3: 基于videoJS用flash实现的播放 for pc
 *    4: 用于插入一个网页的webview
 */
import { config } from '../../config/index'
import { removeVideo } from './api'
import { supportVideo, supportFlash } from './support'

const pixelRatio = window.devicePixelRatio
const resolution = window.screen

/**
 * 获取容器
 * 1 浮动视频单独处理
 * 2 没有浮动视频
 * @return {[type]} [description]
 */
const getContainer = options => {

  /*视频已经浮动,找到浮动容器的根节点floatGroup*/
  if (options.isfloat) {
    return Xut.Presentation.GetFloatContainer(options.pageType)
  }

  const container = options.container

  /*如果是isColumn的使用，直接用触发节点*/
  if (options.isColumn) {
    return $(container)
  }

  //jquery对象
  if (container.length) {
    return container.children()
  }

  //dom
  return container.children ? $(container.children) : $('body')
}


/**
 * webView弹出框
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
const webView = options => {

  const { width, height, pageUrl, left, top } = options

  const play = () => {
    //打开一个网页的时候，需要关闭其他已经打开过的网页
    Xut.Plugin.WebView.close();
    Xut.openWebView = false;
    setTimeout(() => {
      Xut.Plugin.WebView.open(pageUrl, left, top, height, width, 1);
      Xut.openWebView = true;
    }, 500);
  }

  const close = () => {
    Xut.Plugin.WebView.close();
    Xut.openWebView = false;
  }

  play()

  return {
    play,
    close,
    stop: close
  }
}


/**
 * 网页
 * @param {[type]} options [description]
 */
const _webPage = options => {

  let pageUrl = options.pageUrl;
  let container = getContainer(options)

  //跳转app市场
  //普通网页是1
  //跳转app市场就是2
  if (options.hyperlink == 2) {
    //跳转到app市场
    window.open(pageUrl)
      //数据统计
    $.get('http://www.appcarrier.cn/index.php/adplugin/recordads?aid=16&esbId=ios')
  } else {

    var padding = options.padding || 0,
      width = options.width,
      height = options.height,
      videoId = options.videoId,
      left = options.left,
      top = options.top,
      $videoNode, eleWidth, eleHeight;

    if (padding) {
      eleWidth = width - 2 * padding;
      eleHeight = height - 2 * padding;
    } else {
      eleWidth = width;
      eleHeight = height
    }


    $videoNode = $('<div id="videoWrap_' + videoId + '" style="position:absolute;left:' + left + 'px;top:' + top + 'px;width:' + width + 'px;height:' + height + 'px;z-index:' + Xut.zIndexlevel() + '">' +
      '<div style="position:absolute;left:' + padding + 'px;top:' + padding + 'px;width:' + eleWidth + 'px;height:' + eleHeight + 'px;">' +
      '<iframe src="' + pageUrl + '" style="position:absolute;left:0;top:0;width:100%;height:100%;"></iframe>' +
      '</div>' +
      '</div>');

    container.append($videoNode);
  }



  function play() {
    $videoNode && $videoNode.show();
  }


  play()

  return {
    play: play,
    stop() {
      $videoNode && $videoNode.hide();
    },
    close() {
      if ($videoNode) {
        $videoNode.remove();
        $videoNode = null;
      }
      container = null
    }
  }
}


/**
 * 安卓phonegap播放器
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
const _mediaPlayer = options => {

  let width
  let height
  let left
  let top

  //如果是读库或者妙妙学
  let url = (window.MMXCONFIG || window.DUKUCONFIG) ? options.url
    //如果是纯apk模式
    : options.url.substring(0, options.url.lastIndexOf('.'))

  //如果是安卓平台，视频插件去的分辨率
  //所以这里要把 可以区尺寸，转成分辨率
  //读库强制全屏
  if (window.DUKUCONFIG) {
    width = resolution.width
    height = resolution.height
    top = 0
    left = 0
  } else {
    //正常的是按照屏幕尺寸的
    //这是安卓插件问题,按照分辨率计算
    width = options.width * pixelRatio
    height = options.height * pixelRatio
    left = options.left * pixelRatio || 0
    top = options.top * pixelRatio || 0
  }

  const play = () => {
    Xut.Plugin.videoPlayer.play(() => {}, () => {}, config.getVideoPath() + url, 1, left, top, height, width);
  }

  const close = () => {
    Xut.Plugin.videoPlayer.close();
  }

  play()

  return {
    play,
    close,
    stop: close
  }
}

/**
 * 创建视频容器
 */
const createVideoWrap = (type, options) => {
  const { width, height, zIndex, top, left } = options
  return $(String.styleFormat(
    `<div data-type="${type}"
          style="width:${width}px;
                 height:${height}px;
                 position:absolute;
                 visibility:hidden;
                 z-index:${zIndex};
                 top:${top}px;
                 left:${left}px;">
     </div>`))
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
const _html5Player = options => {

  let { width, height, top, left, zIndex, url } = options
  let container = getContainer(options)
  let src = config.getVideoPath() + url
  let poster = options.poster ? (config.getVideoPath() + options.poster) : ''

  let $videoWrap = createVideoWrap('video-h5', { width, height, top, left, zIndex })
  let video = document.createElement('video')
  let $videoNode = $(video).css({ width, height }).attr({
    src,
    'poster': poster,
    'controls': 'controls',
    'autoplay': 'autoplay',
    'playsinline': 'playsinline'
  })

  //父容器
  $videoWrap.append($videoNode)

  /**
   * 播放视频
   * @return {[type]} [description]
   */
  function play() {
    //iphone手机上，系统接管后，点击完成
    //必须这样处理后，才能再次显示
    $videoWrap.show()
    video.play()
  }

  function start() {
    play();
    //防止播放错误时播放界面闪现
    $videoWrap.css('visibility', 'visible')
  }

  /**
   * 停止
   * @return {[type]} [description]
   */
  function stop() {
    video.pause();
    //妙妙学只需要停止
    if (!window.MMXCONFIG) {
      //复位视频
      if (video.duration) {
        video.currentTime = 0.01;
      }
      $videoWrap.hide();
      //用于启动视频
      if (options.startBoot) {
        options.startBoot();
        destroy();
      }
    }
  }

  /**
   * 错误
   * @return {[type]} [description]
   */
  function error() {
    if (options.startBoot) {
      options.startBoot();
    }
    removeVideo(options.chapterId);
  }

  function clear() {
    stop()
    removeVideo(options.chapterId);
  }

  /**
   * 销毁
   */
  function destroy() {
    video.removeEventListener('ended', clear, false)
    video.removeEventListener('error', error, false)
    video.removeEventListener('canplay', start, false)
    $videoWrap.remove()
    $videoNode = null
    $videoWrap = null
    container = null
  }


  video.addEventListener('ended', clear, false)
  video.addEventListener('error', error, false)
  video.addEventListener('canplay', start, false)

  //////////////////////////
  ///2016.6.23
  //安卓ios需要直接调用play开始
  //移动端必须触发2次play
  ////////////////////////
  if (Xut.plat.isIOS || Xut.plat.isAndroid) {
    play()
  }

  container.append($videoWrap);

  return {
    play: play,
    stop: stop,
    close: destroy
  }
}


/**
 * html5 and flash player
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
const _flarePlayer = function (options) {
  let container = getContainer(options)
  let url = config.getVideoPath() + options.url
  let { width, height, top, left, zIndex } = options

  let $videoWrap = createVideoWrap('video-flare', {
    width,
    height,
    top,
    left,
    zIndex
  })

  let fv = $videoWrap.flareVideo({
    width,
    height,
    autoplay: true
  })

  fv.load([{
    src: url,
    type: 'video/mp4'
  }])

  container.append($videoWrap)

  fv.video.setAttribute('playsinline', 'playsinline')

  return {
    play: function () {
      fv.play()
    },
    stop: function () {
      fv.pause()
    },
    close: function () {
      fv.remove()
      fv = null
      container = null
    }
  }
}


/*
 增强判断
 ios上支持行内播放，不能用默认的H5控制条，拖动失效，必须要加进度条
 ios低于10的情况下，用原生播放,而且不能是平板，只能是手机，touch
 */
// if (Xut.plat.supportPlayInline && !Xut.plat.isTablet) {
//   h5Player = _flarePlayer
// }

/*
匹配视屏播放器
2017.5.5 去掉_flarePlayer的匹配，因为默认行为处理了
 */
const videoPlayer = (function () {
  let player = null
    //浏览器平台
  if (Xut.plat.isBrowser) {
    player = _html5Player
  } else {
    //apk ipa
    if (Xut.plat.isIOS || top.EduStoreClient) {
      //如果是ibooks模式
      if (Xut.IBooks.Enabled) {
        player = _html5Player
      } else {
        //如果是ios或读酷pc版则使用html5播放
        player = _html5Player
      }
    } else if (Xut.plat.isAndroid) {
      if (window.MMXCONFIG) {
        // 安卓妙妙学强制走h5
        // 由于原生H5控制条不显示的问题
        player = _html5Player
      } else {
        //android平台
        player = _mediaPlayer
      }
    }
  }
  return player
})()


/*
视频接口
 */
class VideoClass {
  constructor(options) {
    switch (options.category) {
      case 'video':
        this.video = videoPlayer(options)
        break;
      case 'webpage':
        this.video = _webPage(options);
        break;
      default:
        console.log('options.category must be video or webPage ')
        break
    }
    Xut.View.Toolbar("hide")
  }
  play() {
    Xut.View.Toolbar("hide")
    this.video.play()
  }
  stop() {
    Xut.View.Toolbar("show")
    this.video.stop()
  }
  close() {
    this.video.close()
  }
}


export {
  VideoClass,
  _html5Player as h5Player
}
