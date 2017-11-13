import { PhoneGapMedia } from './player/phonegap'
import { CordovaMedia } from './player/cordova'
import { HTML5Audio } from './player/html5'
import { fixAudio } from './fix'

let AudioPlayer

/*安卓客户端apk的情况下*/
if (Xut.plat.isAndroid && !Xut.plat.isBrowser) {
  AudioPlayer = PhoneGapMedia
} else {
  /*妙妙学的 客户端浏览器模式*/
  if (window.MMXCONFIG && window.audioHandler) {
    AudioPlayer = CordovaMedia
  } else {

    //需要修复音频
    if (Xut.plat.fixWebkitAutoAudio) {
      fixAudio()
    }

    /*其余所有情况都用原声的H5播放器*/
    AudioPlayer = HTML5Audio
  }
}




export { AudioPlayer }
