 //预初始化
 import { config } from './config/index'
 import { api } from './api'
 import { AudioManager } from './component/audio/manager'
 import { VideoManager } from './component/video/manager'
 // //init
 import { init } from './init/index'

 //初始化音频视频
 Xut.VideoManager = new VideoManager()
 Xut.AudioManager = new AudioManager()

 //修复ios 安卓浏览器不能自动播放音频的问题
 //在加载时创建新的audio.video 用的时候更换
 Xut.fix = Xut.fix || {}

 if (Xut.plat.isBrowser) {
     //移动端浏览器平台媒体自动播放处理
     if (Xut.plat.isIOS || Xut.plat.isAndroid) {
         var fixaudio = function() {
             if (!Xut.fix.audio) {
                 Xut.fix.audio = new Audio();
                 Xut.fix.video = document.createElement("Video");
                 document.removeEventListener('touchstart', fixaudio, false);
             }
         }
         document.addEventListener('touchstart', fixaudio, false);
     } else {
         //桌面绑定鼠标控制
         $(document).keyup(function(event) {
             switch (event.keyCode) {
                 case 37:
                     Xut.View.GotoPrevSlide()
                     break;
                 case 39:
                     Xut.View.GotoNextSlide()
                     break;
             }
         })
     }
 }

 Xut.Version = 809

 init()
