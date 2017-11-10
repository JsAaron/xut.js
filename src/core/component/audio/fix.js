import { $on, $off } from '../../util/event'
import { resetAudioContext } from './api'

/**
 * audio对象下标
 * @type {Number}
 */
let index = 0
let loop = 10
let audioes = []
//usable  可用状态
let status = ''


///////////////////////////////////////////////////////////////////
/// 2017.6.28
/// 安卓5以后 chrome浏览器单独的问题处理 需要绑定touchend事件
/// 如果用click那么需要处理swiper的hook 这里需要跳过preventDefault
///////////////////////////////////////////////////////////////////

/**
 * 修复audio
 * @param  {[type]} obj    [description]
 * @param  {[type]} key    [description]
 * @param  {[type]} access [description]
 * @return {[type]}        [description]
 */
export function fixAudio(obj, key, access) {
  $on(document, {
    end() {
      for (let i = 0; i < loop; i++) {
        let audio = new Audio()
        audio.play() /*必须调用，自动播放的时候没有声音*/
        audioes.push(audio)
      }
      //修改为可用状态
      status = 'usable'
      //修复音频上下文对象
      resetAudioContext()
      $off(document)
    }
  })
}


/**
 * 销毁创建的video对象
 * @return {[type]} [description]
 */
export function clearFixAudio() {
  for (let i = 0; i < audioes.length; i++) {
    audioes[i].destroy && audioes[i].destroy()
    audioes[i] = null
  }
  audioes = null
  status = ''
}


/**
 * 是否存在修复的音频对象
 * @return {Boolean} [description]
 */
export function hasFixAudio() {
  return audioes.length
}


/**
 * 获取音频对象
 * @return {[type]} [description]
 */
export function getAudioContext() {
  if (status === 'usable') {
    var audio = audioes[index++]
    if (!audio) {
      index = 0
      return getAudioContext()
    }
    return audio
  }
}
