import HTML5Player from './player/html5'
import PhoneGapMedia from './player/phonegap'
import WebPage from './player/web'
import FlarePlayer from './player/flare'
import { removeVideo } from './api'

let VideoPlayer

//浏览器平台
if (Xut.plat.isBrowser) {
  // 安卓手机浏览器全屏问题太多,默认全屏回去的时候会顶出来
  // 苹果手机初始化有一个白色的圆，控制条丢失
  if (Xut.plat.isIOS || Xut.plat.isAndroid) {
    VideoPlayer = FlarePlayer
  } else {
    //pc播放器一律采用FlarePlayer
    //因为秒秒学的浮动工具栏的问题，导致默认播放器不能改控制条的高度
    //所以默认都用一个统一了
    VideoPlayer = FlarePlayer
  }
} else {
  //apk ipa
  if (Xut.plat.isIOS || top.EduStoreClient) {
    //如果是ibooks模式
    if (Xut.IBooks.Enabled) {
      VideoPlayer = FlarePlayer
    } else {
      //如果是ios或读酷pc版则使用html5播放
      VideoPlayer = FlarePlayer
    }
  } else if (Xut.plat.isAndroid) {
    if (window.MMXCONFIG) {
      // 安卓妙妙学强制走h5
      // 由于原生H5控制条不显示的问题
      VideoPlayer = FlarePlayer
    } else {
      //android平台
      VideoPlayer = PhoneGapMedia
    }
  }
}


class VideoClass {
  constructor(options) {
    switch (options.category) {
      case 'video':
        this.video = new VideoPlayer(options, removeVideo)
        break;
      case 'webpage':
        this.video = new WebPage(options, removeVideo);
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
  destroy() {
    this.video.destroy()
  }
}


export { VideoClass }
