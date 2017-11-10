import { PhoneGapMedia } from './player/phonegap'
import { CordovaMedia } from './player/cordova'
import { NativeAudio } from './player/native'
import { fixAudio } from './fix'

let audioPlayer

/*安卓客户端apk的情况下*/
if (Xut.plat.isAndroid && !Xut.plat.isBrowser) {
  audioPlayer = PhoneGapMedia
} else {
  /*妙妙学的 客户端浏览器模式*/
  if (window.MMXCONFIG && window.audioHandler) {
    audioPlayer = CordovaMedia
  } else {

    //需要修复音频
    if (Xut.plat.supportFixAudio) {
      fixAudio()
    }

    /*其余所有情况都用原声的H5播放器*/
    audioPlayer = NativeAudio
  }
}




export { audioPlayer }
