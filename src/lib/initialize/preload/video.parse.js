/**
 * 视频文件解析
 * @param  {[type]}   filePath [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
export function videoParse(filePath, callback) {
    var video = document.createElement("video")
    video.src = filePath;

    function myhandler() {
            console.log(video.src + "开始加载");
            callback()
            video.removeEventListener("loadstart", myhandler, false)
            video = null;
    }
    video.addEventListener("loadstart", myhandler, false);
    video.addEventListener("error",function() {
        console.log(video.src+"资源未找到")
        callback();
    },false);
}
