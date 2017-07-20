import AudioSuper from './super'

/**
 * 采用_Audio5js播放
 */
class _Audio5js extends AudioSuper {

  constructor(options, controlDoms) {
    super(options, controlDoms)
  }

  /**
   * 初始化
   */
  _init() {
    let self = this
    let audio = new Audio5js({
      ready: function (player) {
        this.load(self.$$url);
        //如果调用了播放
        this.play()
        self.status = "playing"
      }
    });
    this.audio = audio;
    this.status = 'playing';
  }

  /**
   * Compatible with asynchronous
   * for subitile use
   * get audio
   * @return {[type]} [description]
   */
  _getAudioTime(callback) {
    callback(Math.round(this.audio.audio.audio.currentTime * 1000))
  }

  _destroy() {
    if (this.audio) {
      this.audio.destroy();
      this.audio = null;
    }
  }
}
