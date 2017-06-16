/**
 * 音频文件解析
 * @param  {[type]}   filePath [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 *
 * */

let index = 0
let audioes = []
let audio, i
for (i = 0; i < 6; i++) {
  audio = new Audio()
  audio.play()
  audioes.push(audio)
}

function getAudio() {
  var audio = audioes[index++]
  if (!audio) {
    index = 0
    return getAudio()
  }
  return audio
}

/**
 * 音频文件解析
 * @param  {[type]}   filePath [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
export function audioParse(filePath, callback) {

  let audio = new Audio();
  let checkAudioBuffer = false;
  audio.src = filePath;
  audio.muted = "muted";
  audio.preload = "auto";
  audio.autobuffer = true

  function watchComplete() {
    callback()
    clear()
  }

  function error() {
    callback()
    clear()
  }

  function clear() {
    audio.removeEventListener("canplaythrough", watchComplete, false)
    audio.removeEventListener("error", error, false)
    audio = null
  }

  audio.addEventListener("canplaythrough", watchComplete, false)
  audio.addEventListener("error", error, false)
}
