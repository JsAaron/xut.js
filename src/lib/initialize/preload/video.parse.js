/**
 * 视频文件解析
 * @param  {[type]}   filePath [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
export function videoParse(filePath, callback) {
    var video = document.createElement("video")
    var checkVideoBuffer = false;
    video.src = filePath;
    $(video).attr("playsinline", "playsinline")
    video.controls = "controls";
    video.autoplay = "autoplay";
    video.muted = "muted";
    //iphone android 加上添加到body 才能播放
    $(video).css("visibility", "hidden")
    document.body.appendChild(video)
    video.play();


    function myhandler() {
        if (video.buffered.end(video.buffered.length - 1) == video.duration && !checkVideoBuffer) {
            console.log(video.src + "缓冲完成");
            video.pause();
            checkVideoBuffer = true;
            callback()
            video.removeEventListener("timeupdate", myhandler, false)
            $(video).remove();
            video = null;
        }
    }
    video.addEventListener("timeupdate", myhandler, false);
}
