//Pre initialized
import { config } from './config/index'
import { api } from './global-api'
import { AudioManager } from './component/audio/manager'
import { VideoManager } from './component/video/manager'
import { init } from './init/index'

//repair ios android browser doesn't automatically play audio problems
//when loaded. Create a new audio video and use it every time you change
Xut.fix = Xut.fix || {}

if (Xut.plat.isBrowser) {
    //Mobile browser automatically broadcast platform media processing
    if (Xut.plat.isIOS || Xut.plat.isAndroid) {
        let fixaudio = () => {
            if (!Xut.fix.audio) {
                Xut.fix.audio = new Audio();
                Xut.fix.video = document.createElement("Video");
                document.removeEventListener('touchstart', fixaudio, false);
            }
        }
        document.addEventListener('touchstart', fixaudio, false);
    } else {
        //Desktop binding mouse control
        $(document).keyup((event) => {
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

Xut.Version = 830

init()
