import { config } from '../../../config/index'
import { Action } from '../action'
import { Subtitle } from '../subtitle'

/**
 * 音频工厂类
 * @param {[type]} options [description]
 */
export default class AudioSuper {

  constructor(options, controlDoms) {
    this.options = options

    this.trackId = options.trackId
    this.controlDoms = controlDoms;

    /*构建之前处理*/
    this._$$preRelated(options);
    /*初始化数据*/
    this._init();
    //相关数据
    this._$$afterRelated(options)
  }

  //=============================
  //    私有方法
  //=============================

  /**
   * 构建之前关数据
   * 2个回调处理
   *  1 内部manage
   *  2 外部content的行为音频
   *  二者只会同时存在一个
   */
  _$$preRelated(options) {

    /*匹配URL地址*/
    this.$$url = config.getAudioPath() + options.url

    //在manager中附加，播放一次后删除这个对象
    this.innerCallback = options.innerCallback;

    /*按钮的反弹点击触发，设置按钮的行为*/
    if (this.trackId == 9999 && options.complete) {
      this.outerCallback = options.complete
    }
  }

  /**
   * 构建之后关数据
   */
  _$$afterRelated(options) {
    //音频重复播放次数
    if (options.data && options.data.repeat) {
      this.repeatNumber = Number(options.data.repeat)
    }
    //音频动作
    if (options.action) {
      this.acitonObj = Action(options);
    }
    //字幕对象
    if (options.subtitles && options.subtitles.length > 0) {
      this.subtitleObject = new Subtitle(options, this.controlDoms, (cb) => this._getAudioTime(cb))
    }
    //如果有外部回调处理
    if (this.outerCallback) {
      this.outerCallback.call(this);
    }
  }


  //=============================
  //    提供给子类方法
  //=============================


  /**
   * 运行成功失败后处理方法
   * phoengap会调用callbackProcess
   * state
   *   true 成功回调
   *   false 失败回调
   */
  _$$callbackProcess(state) {

    /**************************
        处理content的反馈回调
    ***************************/
    if (this.outerCallback) {
      this.destroy()
    } else {

      /**************************
       内部播放的回调，manage的处理
      ***************************/
      /*播放失败*/
      if (!state) {
        this.innerCallback && this.innerCallback(this);
        return
      }

      /*如果有需要重复的音频*/
      if (this.repeatNumber) {
        --this.repeatNumber
        this.play()
      } else {
        /*如果不存在重复，那么播放完毕后，直接清理这个对象*/
        this.innerCallback && this.innerCallback(this);
      }
    }

  }

  /**
   * 获取微信播放对象
   * 2017.8.10
   * 妙妙学ios公众号问题
   * 如果嵌套了iframe必须要找parent的WeixinJSBridge
   */
  $$getWeixinJSBridgeContext() {
    //必须是微信平台
    //2017.11.24
    //秒秒学在线打开
    //本地化资源后报错这个，强制判断必须是微信
    if (!Xut.plat.isWeiXin) {
      return
    }

    if (window.WeixinJSBridge) {
      return window.WeixinJSBridge
    }
    if (window.parent && window.parent.WeixinJSBridge) {
      return window.parent.WeixinJSBridge
    }
  }


  //=============================
  //    提供外部接口，向上转型
  //=============================

  getTrackId() {
    return this.trackId
  }

  /**
   * 播放
   * @return {[type]} [description]
   */
  play() {

    /*子类提供了播放*/
    if (this._play) {
      this._play()
    }

    this.status = 'playing';

    //flash模式不执行
    if (this.audio) {
      //支持自动播放,微信上单独处理
      const weixinJSBridge = this.$$getWeixinJSBridgeContext()
      if (weixinJSBridge) {
        weixinJSBridge.invoke('getNetworkType', {}, (e) => {
          if (this.audio) {
            Xut.$warn({
              type: 'weixinJSBridgeAudio',
              content: `+播放音频,audio的id:${this.options.audioId}`
            })
            this.audio.play();
          }
        })
      } else {
        //秒秒学提示play不存在
        if (this.audio.play) {
          Xut.$warn({
            type: 'html5Audio',
            content: `+播放音频,audio的id:${this.options.audioId}`
          })

          this.audio.play()
        }
      }
    }
    this.acitonObj && this.acitonObj.play();
  }

  /**
   * 停止
   * @return {[type]} [description]
   */
  pause() {

    /*子类提供了暂停*/
    if (this._pause) {
      this._pause()
    }

    this.status = 'paused';
    this.audio && this.audio.pause && this.audio.pause();
    this.acitonObj && this.acitonObj.pause();
  }


  /**
   * 复位接口
   * @return {[type]} [description]
   */
  reset() {
    /*子类提供了复位*/
    if (this._reset) {
      this._reset()
    }
    this.status = 'reseted';
  }


  /**
   * 销毁
   */
  destroy() {

    /*子类提供了销毁*/
    if (this._destroy) {
      this._destroy()
    }

    this.status = 'ended';

    //销毁字幕
    if (this.subtitleObject) {
      this.subtitleObject.destroy()
      this.subtitleObject = null;
    }

    //动作
    if (this.acitonObj) {
      this.acitonObj.destroy();
      this.acitonObj = null;
    }

    Xut.$warn({
      type: 'html5Audio',
      content: `-销毁音频,audio的id:${this.options.audioId}`
    })

  }

}
