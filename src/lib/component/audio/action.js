/**
 * 音频动作
 * @param  {[type]} global [description]
 * @return {[type]}        [description]
 */

import { getFileFullPath } from '../../util/option'
import { loadFigure } from '../../util/loader/image'

//音频动作
//替换背景图
//指定动画
export function Action(options) {

  let element, pageType

  /*这里需要注意，浮动音频的情况，翻页DOM被重新创建，所以这里要每次要重新获取最新的*/
  const getAudioNode = function () {
    element = document.querySelector('#Audio_' + options.audioId)
  }

  let startImage = options.startImage && getFileFullPath(options.startImage, 'audio-action')
  let stopImage = options.stopImage && getFileFullPath(options.stopImage, 'audio-action')

  //切换背景
  const toggleImage = function (fileName) {
    getAudioNode() //每次都重新获取新的节点
    if (element) {
      element.style.backgroundImage = `url(${fileName})`
    }
  }

  getAudioNode()
  pageType = element.getAttribute('data-belong')


  stopImage && loadFigure(stopImage)

  return {
    play() {
      stopImage && toggleImage(stopImage)
      if (options.startScript) {
        Xut.Assist.Run(pageType, options.startScript.split(','))
      }
    },
    pause() {
      startImage && toggleImage(startImage)
      if (options.stopScript) {
        Xut.Assist.Stop(pageType, options.stopScript.split(','))
      }
    },
    destroy() {
      this.pause()
      element = null;
    }
  }
}
