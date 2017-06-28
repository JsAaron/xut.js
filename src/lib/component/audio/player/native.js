import AudioSuper from './super'
import { hasAudioes, getAudio } from '../fix'

/**
 * 使用html5的audio播放
 * 1-支持audio的autoplay，大部分安卓机子的自带浏览器和微信，大部分的IOS微信（无需特殊解决）
 * 2-不支持audio的autoplay，部分的IOS微信
 * 3-不支持audio的autoplay，部分的安卓机子的自带浏览器（比如小米，开始模仿safari）和全部的ios safari（这种只能做用户触屏时就触发播放了）
 *
 * ios10.3  不支持canplay事件
 */
export class NativeAudio extends AudioSuper {

  constructor(options, controlDoms) {
    super(options, controlDoms);
  }

  /**
   * 初始化
   * @return {[type]} [description]
   */
  _init() {
    let self = this
    let trackId = this.trackId
    let hasAudio = hasAudioes()

    if (hasAudio) {
      this.audio = getAudio()
      this.audio.src = this.$$url
    } else {
      this.audio = new Audio(this.$$url)
      this.needFix = true
    }
    this._watchAudio(true)
  }

  /**
   * 重设音频上下文
   * 因为自动音频播放的关系
   * 在点击后修复这个音频
   * @return {[type]} [description]
   */
  resetContext() {
    this._destroy()
    this.audio = getAudio()
    this.audio.src = this.$$url
    this._watchAudio(this.status === 'playing' ? true : false)
  }


  /**
   * 监听音频播放
   * status
   *   如果为true就是时间完毕后，允许播放
   *   否则就是在resetContext调用处理，音频已经跳过了playing，可能关闭或者停止了
   */
  _watchAudio(status) {

    //自动播放，只处理一次
    //手动调用的时候会调用play的时候会调用canplay
    //导致重复播放，所以在第一次的去掉这个事件
    this._canplayCallBack = () => {
      if (status) {
        this._startPlay()
      }
      this.audio.removeEventListener('loadedmetadata', this._canplayCallBack, false)
    }

    this._endCallBack = () => {
      this._$$callbackProcess(true)
    }
    this._errorCallBack = () => {
      this._$$callbackProcess(false)
    }

    /*微信不支持canplay事件*/
    if (window.WeixinJSBridge) {
      this._startPlay()
    } else {
      this.audio.addEventListener('loadedmetadata', this._canplayCallBack, false)
    }
    this.audio.addEventListener('ended', this._endCallBack, false)
    this.audio.addEventListener('error', this._errorCallBack, false)
  }

  /**
   * 开始播放音频
   */
  _startPlay() {
    /**
     * safari 自动播放
     * 手机浏览器需要加
     * 2016.8.26
     * @type {Boolean}
     */
    this.audio.autoplay = true
    this.status = 'playing';
    this.play()
  }

  /**
   * Compatible with asynchronous
   * for subitile use
   * get audio
   * @return {[type]} [description]
   */
  _getAudioTime(callback) {
    callback(Math.round(this.audio.currentTime * 1000))
  }

  /**
   * 复位接口
   */
  _reset() {
    this.audio.pause();
    this.audio.currentTime = 0
  }

  /**
   * 销毁方法
   * @return {[type]} [description]
   */
  _destroy() {
    if (this.audio) {
      this.audio.pause();
      //快速切换，防止在播放中就移除，导致没有销毁
      this.audio.removeEventListener('loadedmetadata', this._canplayCallBack, false)
      this.audio.removeEventListener('ended', this._endCallBack, false)
      this.audio.removeEventListener('error', this._errorCallBack, false)
      this.audio = null;
    }
  }


}
