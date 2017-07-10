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

  let audio = new Audio()
  audio.src = url;
  audio.preload = "auto";
  audio.autobuffer = true
  audio.autoplay = true
  audio.muted = true //ios 10以上静音后可以自动播放

  let loopTimer = null //循环检测时间

  /**
   * 清理检测对象
   * @return {[type]} [description]
   */
  function clear(isExit) {
    if (loopTimer) {
      clearTimeout(loopTimer)
      loopTimer = null
    }
    if (audio) {
      audio.removeEventListener("loadedmetadata", success, false)
      audio.removeEventListener("error", exit, false)
      audio.url = null
      audio = null
    }
  }


  /**
   * 成功退出
   * @return {[type]} [description]
   */
  function exit(isExit) {
    clear(isExit)
    callback()
  }


  /**
   * 支持buffered的情况下
   * 可以通过buffered提前判断
   * 为了优化下载的时间
   * @return {[type]} [description]
   */
  function startBuffered() {

    audio.play()

    /*总时间*/
    let allTime = audio.duration;

    /*是否缓存完毕*/
    function getComplete(loop) {
      if (allTime == audio.buffered.end(audio.buffered.length - 1)) {
        return true
      } else {
        return false
      }
    }

    /*如果第一次就已经加载结束*/
    if (getComplete()) {
      exit('isExit')
      return
    }

    /**
     * loopBuffered检测
     * 循环500毫秒一次
     * @return {[type]} [description]
     */
    function loopBuffered() {
      loopTimer = setTimeout(function () {
        if (getComplete()) {
          exit('isExit')
          return
        } else {
          loopBuffered()
        }
      }, 500)
    }
    loopBuffered()
  }


  /**
   * 在loadedmetadata事件完成后
   * 1 如果支持buffered判断，那么走buffered
   * 2 如果不支持buffered那么靠外部的定时器处理
   */
  function success() {
    if (!audio.buffered) {
      exit() //如果不支持buffered，直接退出
      return
    }
    /////////////////////////////
    /// ios 10与PC端
    /// 1、速度很快的情况马上就缓存完毕
    /// 2、如果文件已经被缓存过了
    /////////////////////////////
    startBuffered()
  }


  audio.addEventListener("loadedmetadata", success, false)
  audio.addEventListener("error", exit, false)

  return {
    destory: clear
  }
}
