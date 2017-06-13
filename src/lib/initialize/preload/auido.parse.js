/**
 * 音频文件解析
 * @param  {[type]}   filePath [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
export function audioParse(filePath, callback) {
  var audio = new Audio();
  var checkAudioBuffer = false;
  audio.src = filePath;
  audio.controls = "controls";
  audio.autoplay = "autoplay";
  audio.muted = "muted";
  function myhandler() {
    if (audio.buffered.end(audio.buffered.length - 1) == audio.duration && !checkAudioBuffer) {
      console.log(audio.src + "缓冲完成");
      checkAudioBuffer = true;
      callback()
      audio.removeEventListener("timeupdate", myhandler, false)
      audio = null;
    }
  }
  audio.addEventListener("timeupdate", myhandler, false);
}
