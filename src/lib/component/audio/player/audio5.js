import AudioSuper from './super'

/**
 * 采用_Audio5js播放
 */
class _Audio5js extends AudioSuper {

  constructor(options, controlDoms) {
    super()

    let self = this

    //构建之前处理
    this.$$preRelated(options.trackId, options);

    let audio = new Audio5js({
      ready: function (player) {
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
