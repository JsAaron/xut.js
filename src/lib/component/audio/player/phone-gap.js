import AudioSuper from './super'

/**
 * 使用PhoneGap的Media播放
 */
export class PhoneGapMedia extends AudioSuper {

  constructor(options, controlDoms) {
    super()

    const self = this

    //构建之前处理
    this.$$preRelated(options.trackId, options);

    //音频成功与失败调用
    const audio = new window.GLOBALCONTEXT.Media(self.$$url, () => {
      self.$$callbackProcess(true);
    }, () => {
      self.$$callbackProcess(false);
    })

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
    this.audio.getCurrentPosition((position) => {
      let audioTime
      position = position * 1000;
      if (!this.changeValue) {
        this.changeValue = position
      }
      position -= this.changeValue;
      if (position > -1) {
        audioTime = Math.round(position);
      }
      callback(audioTime)
    }, (e) => {
      console.log("error:" + e);
      //出错继续检测
      callback()
    })
  }

  play() {
    this.$$play()
  }

  pause() {
    this.$$pause()
  }

  /**
   * 取反
   * @return {[type]} [description]
   */
  end() {
    if (this.audio) {
      this.audio.release();
      this.audio = null;
    }
    this.$$destroy()
  }
}
