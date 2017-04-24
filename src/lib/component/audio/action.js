/**
 * 音频动作
 * @param  {[type]} global [description]
 * @return {[type]}        [description]
 */

import { getFileFullPath } from '../../util/option'

//音频动作
//替换背景图
//指定动画
export function Action(options) {

  let audioNode, pageType

  /*这里需要注意，浮动音频的情况，翻页DOM被重新创建，所以这里要每次要重新获取最新的*/
  const getNode = function () {
    audioNode = document.querySelector('#Audio_' + options.audioId)
  }

  //切换背景
  const toggleImage = function (fileName) {
    getNode() //每次都重新获取新的节点
    if (audioNode) {
      audioNode.style.backgroundImage = `url(${ getFileFullPath(fileName,'audio-action')})`
    }
  }

  const runAssist = function (ids) {
    ids = ids.split(',');
    Xut.Assist.Run(pageType, ids)
  }

  const stopAssist = function (ids) {
    ids = ids.split(',');
    Xut.Assist.Stop(pageType, ids)
  }

  getNode()

  pageType = audioNode.getAttribute('data-belong')

  return {
    play: function () {
      options.startImg && toggleImage(options.startImg)
      options.startScript && runAssist(options.startScript);
    },
    pause: function () {
      options.stopImg && toggleImage(options.stopImg)
      options.stopScript && stopAssist(options.startScript);
    },
    destroy: function () {
      this.pause()
      audioNode = null;
    }
  }
}
