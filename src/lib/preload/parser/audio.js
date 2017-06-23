/**
 * 音频文件解析
 * @param  {[type]}   filePath [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 *
 * */

import { Share } from './share'

let audioShare = null

/**
 * 设置audio个数
 * 1 根据preload
 * 2 如果是重复加载，判断缓存已创建的
 */
export function setAudio(total) {
  if (audioShare) {
    audioShare.create(total)
  } else {
    audioShare = new Share('audio')
    audioShare.create(total)
  }
}

function getAudio() {
  if (audioShare) {
    return audioShare.get()
  } else {
    return new Audio()
  }
}


/**
 * 音频文件解析
 */
export function audioParse(url, callback) {

  let audio = getAudio()

  audio.src = url;
  audio.muted = "muted";
  audio.preload = "auto";
  audio.autobuffer = true

  function success() {
    clear()
    callback()
  }

  function error() {
    clear()
    callback()
  }

  function clear() {
    audio.removeEventListener("loadstart", success, false)
    audio.removeEventListener("error", error, false)
    audio = null
  }

  audio.addEventListener("loadstart", success, false)
  audio.addEventListener("error", error, false)

}
