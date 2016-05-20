
import { init } from './init/index'


//更新版本号记录
Xut.Version = 790;

//修复ios 安卓浏览器不能自动播放音频的问题 
//在加载时创建新的audio.video 用的时候更换
Xut.fix = Xut.fix || {};

//移动端浏览器平台
if (Xut.plat.isBrowser && (Xut.plat.isIOS || Xut.plat.isAndroid)) {
    var fixaudio = function() {
        if (!Xut.fix.audio) {
            Xut.fix.audio = new Audio();
            Xut.fix.video = document.createElement("Video");
            document.removeEventListener('touchstart', fixaudio, false);
        }
    };
    document.addEventListener('touchstart', fixaudio, false);
}

$(function() {
	//进入
    init()
})
