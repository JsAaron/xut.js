/**
 * 音频文件解析
 * @param  {[type]}   filePath [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
export function audioParse(filePath, callback) {
  var audio = new Audio();
  audio.src = filePath;

  function myhandler() {
    // console.log(audio.src + "开始加载");
    callback()
    audio.removeEventListener("loadstart", myhandler, false)
    audio = null;
  }
  audio.addEventListener("loadstart", myhandler, false);
  audio.addEventListener("error", function () {
    // console.log(audio.src + "资源未找到")
    callback();
  }, false);
}
