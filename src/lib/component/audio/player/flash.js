import AudioSuper from './super'

/**
 * 采用Falsh播放
 */
class _Flash extends AudioSuper {

  constructor(options, controlDoms) {
    super(options, controlDoms)
  }

  _init() {
    const self = this
    const audio = new Audio5js({
      swf_path: './lib/data/audio5js.swf',
      throw_errors: true,
      format_time: true,
      ready: function () {
        this.load(self.$$url);
        //如果调用了播放
        this.play()
        self.status = "playing"
      }
    });

    this.audio = audio;
    this.status = 'playing';
    this.isFlash = true;
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
