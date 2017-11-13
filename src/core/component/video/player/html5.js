import { getFilePath, getContainer, createVideoWrap } from './util'
import { removeVideo } from '../api'
import { config } from '../../../config/index'


/**
 *   html5的video播放器
 *   API :
 *   play();播放
 *   stop();    //停止播放并隐藏界面
 *   destroy(); //清除元素节点及事件绑定
 *  demo :
 *  var video = new Video({url:'1.mp4',width:'320',...});
 *  video.play();
 */
export default class HTML5Player {

  constructor(options) {

    let { width, height, top, left, zIndex, url } = options

    this.options = options
    this.$container = getContainer(options)

    this._initWrap(width, height, top, left, zIndex, getFilePath(url))
    this._initEvent(options)


    //////////////////////////
    ///2016.6.23
    //移动端必须触发2次play
    //安卓ios需要直接调用play开始
    ////////////////////////
    if (Xut.plat.isIOS || Xut.plat.isAndroid) {
      this.play()
    }

    /**
     * 2017.5.23
     * 安卓手机播放视频，全屏的情况下，会强制横版
     * 导致了触发横竖切换关闭应用
     * @type {Boolean}
     */
    Xut.Application.PlayHTML5Video = true
  }

  /*初始化容器*/
  _initWrap(width, height, top, left, zIndex, src) {
    this.$videoWrap = createVideoWrap('video-h5', { width, height, top, left, zIndex })
    this.video = document.createElement('video')

    this.$videoNode = $(this.video).css({ width, height, display: 'block' }).attr({
      src,
      'controls': 'controls',
      'autoplay': 'autoplay',
      'playsinline': 'playsinline'
    })

    //父容器
    this.$videoWrap.append(this.$videoNode)
    this.$container.append(this.$videoWrap);
  }

  /*初始化事件*/
  _initEvent(options) {

    /*开始播放*/
    this._start = () => {
      this.play();
      //防止播放错误时播放界面闪现
      this.$videoWrap.css('visibility', 'visible')
    }

    /*如果是启动视频直接清理*/
    this._clear = () => {
      if (options.startBoot) {
        options.startBoot();
      }
      removeVideo(options.chapterId);
    }

    /*提示该视频已准备好开始播放：*/
    this.video.addEventListener('canplay', this._start, false)
    this.video.addEventListener('ended', this._clear, false)
    this.video.addEventListener('error', this._clear, false)
  }

  play() {
    //iphone手机上，系统接管后，点击完成
    //必须这样处理后，才能再次显示
    this.$videoWrap.show()
    this.video.play()
  }

  stop() {
    this.video.pause();
    //妙妙学只需要停止
    if (!window.MMXCONFIG) {
      this.$videoWrap.hide();
      //用于首页启动视频
      if (this.options.startBoot) {
        this.options.startBoot();
        this.destroy();
      }
    }
  }

  destroy() {
    this.stop()
    this.video.removeEventListener('canplay', this._start, false)
    this.video.removeEventListener('ended', this._clear, false)
    this.video.removeEventListener('error', this._clear, false)
    this.$videoWrap.remove()
    this.$videoNode = null
    this.$videoWrap = null
    this.$container = null
    this.options.container = null
    this.video = null

    /*延时1000后改变，因为视频关闭后复位，会引发浏览器翻转事件*/
    setTimeout(function () {
      Xut.Application.PlayHTML5Video = false
    }, 1000)
  }
}
