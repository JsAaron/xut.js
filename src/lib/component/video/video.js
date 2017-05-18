import h5Player from './player/native'
import PhoneGapMedia from './player/phonegap'
import WebPage from './player/web'

let VideoPlayer

//浏览器平台
if (Xut.plat.isBrowser) {
  VideoPlayer = h5Player
} else {
  //apk ipa
  if (Xut.plat.isIOS || top.EduStoreClient) {
    //如果是ibooks模式
    if (Xut.IBooks.Enabled) {
      VideoPlayer = h5Player
    } else {
      //如果是ios或读酷pc版则使用html5播放
      VideoPlayer = h5Player
    }
  } else if (Xut.plat.isAndroid) {
    if (window.MMXCONFIG) {
      // 安卓妙妙学强制走h5
      // 由于原生H5控制条不显示的问题
      VideoPlayer = h5Player
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
        this.video = new VideoPlayer(options)
        break;
      case 'webpage':
        this.video = new WebPage(options);
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


export {
  h5Player,
  VideoClass
}
