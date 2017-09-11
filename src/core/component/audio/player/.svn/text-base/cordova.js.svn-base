import AudioSuper from './super'

const createPart = (length) => {
  let uuidpart = ""
  let uuidchar
  for (let i = 0; i < length; i++) {
    uuidchar = parseInt((Math.random() * 256), 10).toString(16);
    if (uuidchar.length == 1) {
      uuidchar = "0" + uuidchar;
    }
    uuidpart += uuidchar;
  }
  return uuidpart;
}

const createUUID = () => [4, 2, 2, 2, 6].map(createPart).join('-')

/**
 * 使用PhoneGap的 js直接调用 cordova Media播放
 */
export class CordovaMedia extends AudioSuper {

  constructor(options, controlDoms) {
    super(options, controlDoms)
  }


  _init() {
    const self = this
    this.id = createUUID();
    const audio = {
      startPlayingAudio: function () {
        window.audioHandler.startPlayingAudio(self.id, self.$$url)
      },
      pausePlayingAudio: function () {
        window.audioHandler.pausePlayingAudio(self.id)
      },
      release: function () {
        window.audioHandler.release(self.id)
      },
      /**
       * 扩充，获取位置
       * @return {[type]} [description]
       */
      expansionCurrentPosition: function () {
        return window.getCurrentPosition(self.id)
      }
    }

    //autoplay
    this.audio = audio;
    this.play()
  }


  /**
   * Compatible with asynchronous
   * for subitile use
   * get audio
   * @return {[type]} [description]
   */
  _getAudioTime(callback) {
    callback(Math.round(this.audio.expansionCurrentPosition() * 1000))
  }


  //播放
  _play() {
    if (this.audio) {
      this.audio.startPlayingAudio();
    }
  }

  //停止
  _pause() {
    this.audio && this.audio.pausePlayingAudio();
  }

  //结束
  _destroy() {
    if (this.audio) {
      this.audio.release();
      this.audio = null;
    }
  }
}
