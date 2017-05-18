import AudioSuper from './super'
import { hasAudioes, getAudio } from '../fix'

let instance = {} //存放不同音轨的一个实例

/**
 * 使用html5的audio播放
 * 1-支持audio的autoplay，大部分安卓机子的自带浏览器和微信，大部分的IOS微信（无需特殊解决）
 * 2-不支持audio的autoplay，部分的IOS微信
 * 3-不支持audio的autoplay，部分的安卓机子的自带浏览器（比如小米，开始模仿safari）和全部的ios safari（这种只能做用户触屏时就触发播放了）
 */
export class NativeVideo extends AudioSuper {

  constructor(options, controlDoms) {

    super()

    let audio
    let self = this
    let trackId = options.trackId

    let hasAudio = hasAudioes()

    //构建之前处理
    this.$$preRelated(trackId, options);

    if (instance[trackId]) {
      audio = hasAudio ? getAudio() : instance[trackId]
      audio.src = this.$$url
    } else {
      if (hasAudio) {
        audio = getAudio()
        audio.src = this.$$url
      } else {
        audio = new Audio(this.$$url)
          //更新音轨
          //妙妙学方式不要音轨处理
        if (trackId) {
          instance[trackId] = audio
        }
      }
    }

    //自动播放，只处理一次
    //手动调用的时候会调用play的时候会调用canplay
    //导致重复播放，所以在第一次的去掉这个事件
    this._canplayCallBack = () => {
      this.play()
      this.audio && this.audio.removeEventListener('canplay', this._canplayCallBack, false)
    }

    this._endCallBack = () => {
      this.$$callbackProcess(true)
    }

    this._errorCallBack = () => {
      this.$$callbackProcess(false)
    }

    /**
     * safari 自动播放
     * 手机浏览器需要加
     * 2016.8.26
     * @type {Boolean}
     */
    audio.autoplay = true

    audio.addEventListener('canplay', this._canplayCallBack, false)
    audio.addEventListener('ended', this._endCallBack, false)
    audio.addEventListener('error', this._errorCallBack, false)

    this.audio = audio;
    this.trackId = trackId;
    this.status = 'playing';
    this.options = options;

    //相关数据
    this.$$afterRelated(options, controlDoms)
  }

  /**
   * Compatible with asynchronous
   * for subitile use
   * get audio
   * @return {[type]} [description]
   */
  getAudioTime(callback) {
    callback(Math.round(this.audio.currentTime * 1000))
  }

  play() {
    this.$$play()
  }

  pause() {
    this.$$pause()
  }

  end() {
    if (this.audio) {
      this.audio.pause();
      //快速切换，防止在播放中就移除，导致没有销毁
      this.audio.removeEventListener('canplay', this._canplayCallBack, false)
      this.audio.removeEventListener('ended', this._endCallBack, false)
      this.audio.removeEventListener('error', this._errorCallBack, false)
      this.audio = null;
    }
    this.$$destroy()
  }
}
