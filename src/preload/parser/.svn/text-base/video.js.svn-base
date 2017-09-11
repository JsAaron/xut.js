/**
 * 视频文件解析
 * @param  {[type]}   filePath [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
export function videoParse(filePath, callback) {
    var video = document.createElement("video")
    video.src = filePath;

    function success() {
        callback()
        clear()
    }

    function error() {
        callback()
        clear()
    }

    function clear() {
        video.removeEventListener("loadstart", success, false)
        video.removeEventListener("error", error, false)
        video = null
    }

    video.addEventListener("loadstart", success, false);
    video.addEventListener("error", error, false);
}
