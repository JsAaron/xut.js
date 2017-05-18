import { PhoneGapMedia } from './player/phonegap'
import { CordovaMedia } from './player/cordova'
import { NativeVideo } from './player/native'

let audioPlayer

/*安卓客户端apk的情况下*/
if (Xut.plat.isAndroid && !Xut.plat.isBrowser) {
  audioPlayer = PhoneGapMedia
} else {
  /*妙妙学的 客户端浏览器模式*/
  if (window.MMXCONFIG && window.audioHandler) {
    audioPlayer = CordovaMedia
  } else {
    /*其余所有情况都用原声的H5播放器*/
    audioPlayer = NativeVideo
  }
}

export { audioPlayer }
