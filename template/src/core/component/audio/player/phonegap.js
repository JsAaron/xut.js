import AudioSuper from './super'

/**
 * 使用PhoneGap的Media播放
 */
export class PhoneGapMedia extends AudioSuper {

  constructor(options, controlDoms) {
    super(options, controlDoms)
  }

  _init() {
    const self = this

    //音频成功与失败调用
    const audio = new window.GLOBALCONTEXT.Media(self.$$url, () => {
      self._$$callbackProcess(true);
    }, () => {
      self._$$callbackProcess(false);
    })

    //autoplay
    this.audio = audio;
    this.play()
  }


  /**
   * 复位接口
   */
  _reset() {
    this.audio.pause();
    this.audio.seekTo(0)
  }


  /**
   * Compatible with asynchronous
   * for subitile use
   * get audio
   * @return {[type]} [description]
   */
  _getAudioTime(callback) {
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


  /**
   * 销毁
   */
  _destroy() {
    if (this.audio) {
      this.audio.release();
      this.audio = null;
    }
  }
}
