import AudioSuper from './super'
import { hasAudioes, getAudio } from '../fix'

/**
 * 使用html5的audio播放
 * 1-支持audio的autoplay，大部分安卓机子的自带浏览器和微信，大部分的IOS微信（无需特殊解决）
 * 2-不支持audio的autoplay，部分的IOS微信
 * 3-不支持audio的autoplay，部分的安卓机子的自带浏览器（比如小米，开始模仿safari）和全部的ios safari（这种只能做用户触屏时就触发播放了）
 */
export class NativeVideo extends AudioSuper {

  constructor(options, controlDoms) {
    super(options, controlDoms);
    /**标记是否为预加载模式 */
    if (options.preload && this instanceof NativeVideo) {
      this.status = 'preload';
    }
  }

  /**
   * 初始化
   * @return {[type]} [description]
   */
  _init() {
    let audio
    let self = this
    let trackId = this.trackId
    let hasAudio = hasAudioes()
    if (hasAudio) {
      audio = getAudio()
      audio.src = this.$$url
    } else {
      audio = new Audio(this.$$url)
    }
    this.audio = audio;
    this._watchAudio()
  }

  /**
   * 监听音频播放
   */
  _watchAudio() {

    //自动播放，只处理一次
    //手动调用的时候会调用play的时候会调用canplay
    //导致重复播放，所以在第一次的去掉这个事件
    this._canplayCallBack = () => {
      if (this.status === 'preload') {
        this.audio.preload = 'metadata'
        this.status = 'canplay' //可以准备播放
      } else {
        /**没有预加载，自动播放 */
        this._startPlay()
      }
      this.audio.removeEventListener('canplay', this._canplayCallBack, false)
    }

    this._endCallBack = () => {
      this._$$callbackProcess(true)
    }
    this._errorCallBack = () => {
      this._$$callbackProcess(false)
    }

    this.audio.addEventListener('canplay', this._canplayCallBack, false)
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
   * 销毁方法
   * @return {[type]} [description]
   */
  _destroy() {
    if (this.audio) {
      this.audio.pause();
      //快速切换，防止在播放中就移除，导致没有销毁
      this.audio.removeEventListener('canplay', this._canplayCallBack, false)
      this.audio.removeEventListener('ended', this._endCallBack, false)
      this.audio.removeEventListener('error', this._errorCallBack, false)
      this.audio = null;
    }
  }

  ///////////////////////////
  //  对外接口
  //////////////////////////

  /**
   * 预处理接口
   * 请求播放
   * 这个接口是因为预处理的关系
   * 预处理还在加载中
   * 必须先等待加载完毕才能继续
   */
  requestPlay() {
    if (this.status === 'canplay') {
      this._startPlay()
    } else {
      console.log('音频没有准备完毕')
    }
  }

  /**
   * 预处理接口
   * 是否有预加载
   */
  hasPreload() {
    if (this.status === 'preload' || this.status === 'canplay') {
      return true
    }
  }
}
