// /**
//  * 音频文件解析
//  * @param  {[type]}   filePath [description]
//  * @param  {Function} callback [description]
//  * @return {[type]}            [description]
//  */
// export function audioParse(filePath, callback) {
//   var audio = new Audio();
//   audio.src = filePath;

//   function myhandler() {
//     // console.log(audio.src + "开始加载");
//     callback()
//     audio.removeEventListener("loadstart", myhandler, false)
//     audio = null;
//   }
//   audio.addEventListener("loadstart", myhandler, false);
//   audio.addEventListener("error", function () {
//     // console.log(audio.src + "资源未找到")
//     callback();
//   }, false);
// }

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
  var audio = getAudio();
  var checkAudioBuffer = false;
  audio.src = filePath;
  audio.autoplay = "autoplay";
  audio.muted = "muted";
  audio.preload = "auto";

  function myhandler() {
    if (audio.buffered.end(audio.buffered.length - 1) == audio.duration && !checkAudioBuffer) {
      // console.log(audio.src + "缓冲完成");
      checkAudioBuffer = true;
      callback()
      audio.removeEventListener("canplaythrough", myhandler, false)
      audio = null;
    }
  }
  audio.addEventListener("canplaythrough", myhandler, false);
  audio.addEventListener("error", function () {
    // console.log(audio.src + "资源未找到")
    callback();
  }, false);
}
