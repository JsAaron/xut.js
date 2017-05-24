/*
 增强判断
 ios上支持行内播放，不能用默认的H5控制条，拖动失效，必须要加进度条
 ios低于10的情况下，用原生播放,而且不能是平板，只能是手机，touch
 */

import { getFilePath, getContainer, createVideoWrap } from './util'

/**
 * html5 and flash player
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
export default class flarePlayer {

  constructor(options) {

    let url = getFilePath(options.url)
    let { width, height, top, left, zIndex } = options

    this.container = getContainer(options)

    let $videoWrap = createVideoWrap('video-flare', {
      width,
      height,
      top,
      left,
      zIndex
    })

    let fv = this.fv = $videoWrap.flareVideo({
      width,
      height,
      autoplay: true
    })

    fv.load([{
      src: url,
      type: 'video/mp4'
    }])

    /*窗口化*/
    fv.video.setAttribute('playsinline', 'playsinline')

    this.container.append($videoWrap)
  }

  play() {
    this.fv.play()
  }

  stop() {
    this.fv.pause()
  }

  destroy() {
    this.fv.remove()
    this.fv = null
    this.container = null
  }

}
