import { $on, $off } from '../../util/event'
import { getPlayBox } from './manager'

/**
 * audio对象下标
 * @type {Number}
 */
let index = 0
let loop = 10
let audioes = []

///////////////////////////////////////////////////////////////////
/// 2017.6.28
/// 安卓5以后 chrome浏览器单独的问题处理 需要绑定click事件
/// 因为可能存在修复音频的click事件
/// 如果需要修复音频但是click的事件没有被触发，这里需要跳过preventDefault
/// 因为touchstart的动作优先于click
///////////////////////////////////////////////////////////////////

/*自动音频的click事件，是否被响应了*/
let hasClick = false

/*是否需要修复*/
let hasFix = false

/**
 * 修复audio
 * @param  {[type]} obj    [description]
 * @param  {[type]} key    [description]
 * @param  {[type]} access [description]
 * @return {[type]}        [description]
 */
export function fixAudio(obj, key, access) {
  hasFix = true
  let click = () => {
    hasClick = true
    let audio, i
    for (i = 0; i < loop; i++) {
      audio = new Audio()
      audio.play()
      audioes.push(audio)
    }
    /*如果*/
    const playBox = getPlayBox()
    var t, p, a;
    for (t in playBox) {
      for (p in playBox[t]) {
        for (a in playBox[t][p]) {
          if (playBox[t][p][a].needFix) {
            playBox[t][p][a].resetContext()
          }
        }
      }
    }

    $off(document)
  }
  $on(document, { click })
}

/**
 * 是否触发了音频修复
 * @return {[type]} [description]
 */
export function hasFixClick() {
  /*如果不需要修复，直接退出，模拟点击状态*/
  if (!hasFix) {
    return true
  }
  return hasClick
}


/**
 * 销毁创建的video对象
 * @return {[type]} [description]
 */
export function clearFixAudio() {
  hasClick = false
  hasFix = false
  for (let i = 0; i < audioes.length; i++) {
    audioes[i].destroy && audioes[i].destroy()
    audioes[i] = null
  }
  audioes = null
}


export function hasAudioes() {
  return audioes.length
}

export function getAudio() {
  var audio = audioes[index++]
  if (!audio) {
    index = 0
    return getAudio()
  }
  return audio
}
