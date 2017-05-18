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
    super()

    const self = this

    this.id = createUUID();

    //构建之前处理
    this.$$preRelated(options.trackId, options);

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
    this.trackId = options.trackId;
    this.options = options;

    //相关数据
    this.$$afterRelated(options, controlDoms)

    this.play()
  }


  /**
   * Compatible with asynchronous
   * for subitile use
   * get audio
   * @return {[type]} [description]
   */
  getAudioTime(callback) {
    callback(Math.round(this.audio.expansionCurrentPosition() * 1000))
  }


  //播放
  play() {
    if (this.audio) {
      this.audio.startPlayingAudio();
    }
    this.$$play()
  }

  //停止
  pause() {
    this.audio && this.audio.pausePlayingAudio();
    this.$$pause()
  }


  //结束
  end() {
    if (this.audio) {
      this.audio.release();
      this.audio = null;
    }
    this.$$destroy()
  }
}
