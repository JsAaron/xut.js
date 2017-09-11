import { getFilePath } from './util'
import { config } from '../../../config/index'

const pixelRatio = window.devicePixelRatio
const resolution = window.screen

/**
 * 安卓phonegap播放器
 */
export default class PhoneGapMedia {

  constructor(options) {

    //如果是读库或者妙妙学
    const url = (window.MMXCONFIG || window.DUKUCONFIG) ? options.url
      //如果是纯apk模式
      : options.url.substring(0, options.url.lastIndexOf('.'))

    this.url = getFilePath(url)

    //如果是安卓平台，视频插件去的分辨率
    //所以这里要把 可以区尺寸，转成分辨率
    //读库强制全屏
    if (window.DUKUCONFIG) {
      this.width = resolution.width
      this.height = resolution.height
      this.top = 0
      this.left = 0
    } else {
      //正常的是按照屏幕尺寸的
      //这是安卓插件问题,按照分辨率计算
      this.width = options.width * pixelRatio
      this.height = options.height * pixelRatio
      this.left = options.left * pixelRatio || 0
      this.top = options.top * pixelRatio || 0
    }

    this.play()
  }

  play() {
    Xut.Plugin.VideoPlayer.play(() => {
      console.log('success')
    }, () => {
      console.log('fail')
    }, this.url, 1, this.left, this.top, this.height, this.width)
  }

  stop() {
    Xut.Plugin.VideoPlayer.close();
  }

  destroy() {
    this.stop()
  }

}
