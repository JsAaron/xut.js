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
export function initAudio(total) {
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
    audio.removeEventListener("canplay", success, false)
    audio.removeEventListener("error", error, false)
    audio = null
  }

  audio.addEventListener("canplay", success, false)
  audio.addEventListener("error", error, false)

}
