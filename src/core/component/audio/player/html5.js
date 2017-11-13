import AudioSuper from './super'
import { hasFixAudio, getAudioContext } from '../fix'

/**
 * 使用html5的audio播放
 *
 * 1.移动端自动播放，需要调用2次play，但是通过getAudioContext的方法获取的上下文，每个context被自动play一次
 * 2.如果需要修复自动播放的情况下
 *   A. 音频的执行比hasFixAudio的处理快，那么需要resetContext正在播放的音频上下文
 *   B. 如果hasFixAudio有了后，在执行音频，正常播放
 * 3.不需要修复自动播放的情况，只有正常的1次play了
 */
export class HTML5Audio extends AudioSuper {

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

    if (Xut.plat.fixWebkitAutoAudio) {
      //webkit移动端....
      //不支持自动播放
      this._createContext();
    } else {

      //微信有接口
      //PC正常播放
      this.audio = new Audio(this.$$url)

      //通过微信自己的事件处理，支持自动播放了
      if (this.$$getWeixinJSBridgeContext()) {
        this._startPlay()
      } else {
        this._bindPlay()
      }
    }
  }


  /**
   * 创建音频上下文对象
   */
  _createContext() {
    this.audio = getAudioContext();
    if (!this.audio) {
      //还没有点击修复，并且已经运行的是自动
      //第一次进入页面才会存在
      this._needFix = true
      return
    }
    this._needFix = false
    /*IOS上手动点击播放的修复
    1 必须调用，点击播放的时候没有声音
    2 必须手动播放，自动播放跳过，否则有杂音*/
    if (Xut.plat.isIOS && this.options.isTrigger) {
      this.audio.play && this.audio.play()
    }
    /**由于修复的问题，先调用了play，改src, 会提示中断报错，所以这延时修改src*/
    setTimeout(() => {
      if (this.audio) {
        this.audio.src = this.$$url;
        this._bindPlay()
      }
    }, 150)
  }


  /**
   * 清理定时器
   * @return {[type]} [description]
   */
  _clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  /**
   * 监听音频播放
   */
  _bindPlay() {

    this._endBack = () => {
      this._clearTimer()
      this._$$callbackProcess(true)
    }

    this._errorBack = () => {
      this._clearTimer()
      this._$$callbackProcess(false)
    }

    this._startBack = () => {
      this.status = 'ready';
      /*延时150毫秒执行*/
      this.timer = setTimeout(() => {
        this._clearTimer();
        /*必须保证状态正确，因为有翻页太快，状态被修改*/
        if (this.status === 'ready') {
          this._startPlay()
        }
      }, 150)
    }

    /**
     * loadedmetadata 准好就播
     * canplay 循环一小段
     */
    this.audio.addEventListener('loadedmetadata', this._startBack, false)
    this.audio.addEventListener('ended', this._endBack, false)
    this.audio.addEventListener('error', this._errorBack, false)
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
    this.audio.autoplay = 'autoplay'
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
      if (!window.WeixinJSBridge) { //微信通过自己API 没有绑定事件
        this.audio.removeEventListener('loadedmetadata', this._startBack, false)
        this.audio.removeEventListener('ended', this._endBack, false)
        this.audio.removeEventListener('error', this._errorBack, false)
      }
      this.audio = null;
    }
  }

  ///////////////////////////
  ///   对外接口，修复上下文
  //////////////////////////

  /**
   * 重设音频上下文
   * 因为自动音频播放的关系
   * 在点击后修复这个音频
   */
  resetContext() {
    //不支持自动播放的情况下
    //又开始了自动播放
    //但是又没有点击动作
    //所以自动播放被阻止了
    //需要修复
    if (this._needFix) {
      this._createContext()
    }
  }


}
