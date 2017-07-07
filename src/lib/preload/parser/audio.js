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

  let lagerTimer = null //最大的检测时间
  let loopTimer = null //循环检测时间

  /**
   * 清理定时器检测
   * @return {[type]} [description]
   */
  function clearTimer() {
    if (lagerTimer) {
      clearTimeout(lagerTimer)
      lagerTimer = null
    }
    if (loopTimer) {
      clearTimeout(loopTimer)
      loopTimer = null
    }
  }

  /**
   * 清理检测对象
   * @return {[type]} [description]
   */
  function clear() {
    clearTimer()
    if (audio) {
      audio.removeEventListener("loadedmetadata", success, false)
      audio.removeEventListener("error", error, false)
      audio = null
    }
  }

  /**
   * 成功退出
   * @return {[type]} [description]
   */
  function exit() {
    clear()
    callback()
  }

  /**
   * 文件存在能加载数据，检测检测是否加载完毕
   * 1 网络足够好，支持buffered 直接靠buffered
   * 2 网络很差直接给不支持buffered，直接给5秒的最大下载量
   */
  function success() {

    audio.play()

    /*总时间*/
    let allTime = audio.duration;

    /*是否缓存完毕*/
    function getComplete() {
      console.log(audio.buffered.length)
      if (allTime == audio.buffered.end(audio.buffered.length - 1)) {
        return true
      } else {
        return false
      }
    }


    /**
     * loopBuffered检测
     * 循环500毫秒一次
     * @return {[type]} [description]
     */
    function loopBuffered() {
      loopTimer = setTimeout(function () {
        if (getComplete()) {
          exit()
          return
        } else {
          loopBuffered()
        }
      }, 500)
    }

    /////////////////////////////
    /// ios 10与PC端
    /// 1、速度很快的情况马上就缓存完毕
    /// 2、如果文件已经被缓存过了
    /////////////////////////////
    if (audio.buffered) {
      if (getComplete()) {
        exit()
        return
      }
      /*开始循环*/
      loopBuffered()
    }


    /**
     * 1.IOS10一下与安卓端
     * 2.Buffered检测出错的情况
     * 最大检测5秒的情况
     */
    lagerTimer = setTimeout(function () {
      exit()
    }, 5000)

  }

  /**
   * 文件错误直接算完成了
   * 出现可能就是文件不存在了
   */
  function error() {
    exit()
  }

  audio.addEventListener("loadedmetadata", error, false)
  audio.addEventListener("error", error, false)

  return {
    destory: function () {
      clear()
    }
  }
}
