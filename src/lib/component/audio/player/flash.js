import AudioSuper from './super'

/**
 * 采用Falsh播放
 */
class _Flash extends AudioSuper {

  constructor(options, controlDoms) {
    super()

    const self = this

    //构建之前处理
    this.$$preRelated(options.trackId, options);

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
    this.trackId = options.trackId;
    this.status = 'playing';
    this.options = options;

    this.isFlash = true;

    //相关数据
    this.$$afterRelated(options, controlDoms);
  }

  /**
   * Compatible with asynchronous
   * for subitile use
   * get audio
   * @return {[type]} [description]
   */
  getAudioTime(callback) {
    callback(Math.round(this.audio.audio.audio.currentTime * 1000))
  }

  play() {
    this.$$play()
  }

  pause() {
    this.$$pause()
  }

  end() {
    if (this.audio) {
      this.audio.destroy();
      this.audio = null;
    }
    this.$$destroy()
  }
}
