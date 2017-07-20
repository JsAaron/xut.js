//检测是否支持HTML5的video播放
let supportVideo = (() => {
  let video = document.createElement('video')
  let type = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
  return !!video.canPlayType && "probably" == video.canPlayType(type);
})()

//检测是否安装了flash插件
let supportFlash = (() => {
  let i_flash = false;
  if(navigator.plugins) {
    for(let i = 0; i < navigator.plugins.length; i++) {
      if(navigator.plugins[i].name.toLowerCase().indexOf("shockwave flash") != -1) {
        i_flash = true;
      }
    }
  }
  return i_flash;
})()

export {
  supportVideo,
  supportFlash
}