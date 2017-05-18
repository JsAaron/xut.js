/*
 增强判断
 ios上支持行内播放，不能用默认的H5控制条，拖动失效，必须要加进度条
 ios低于10的情况下，用原生播放,而且不能是平板，只能是手机，touch
 */
// if (Xut.plat.supportPlayInline && !Xut.plat.isTablet) {
//   h5Player = _flarePlayer
// }

/*
匹配视屏播放器
2017.5.5 去掉_flarePlayer的匹配，因为默认行为处理了
 */

/**
 * html5 and flash player
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
const _flarePlayer = function (options) {
  let container = getContainer(options)
  let url = config.getVideoPath() + options.url
  let { width, height, top, left, zIndex } = options

  let $videoWrap = createVideoWrap('video-flare', {
    width,
    height,
    top,
    left,
    zIndex
  })

  let fv = $videoWrap.flareVideo({
    width,
    height,
    autoplay: true
  })

  fv.load([{
    src: url,
    type: 'video/mp4'
  }])

  container.append($videoWrap)

  fv.video.setAttribute('playsinline', 'playsinline')

  return {
    play: function () {
      fv.play()
    },
    stop: function () {
      fv.pause()
    },
    close: function () {
      fv.remove()
      fv = null
      container = null
    }
  }
}
