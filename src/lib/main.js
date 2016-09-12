//Pre initialized
import { config } from './config/index'
import { api } from './global-api'
import { AudioManager } from './component/audio/manager'
import { VideoManager } from './component/video/manager'
import init from './initialize/index'
//fix audio
import { fixAudio } from './component/audio/fix'
//A predictable state container for apps.
// import store from './redex/store'

if (Xut.plat.isBrowser) {
    //Mobile browser automatically broadcast platform media processing
    if (Xut.plat.noAutoPlayMedia) {
        fixAudio()
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

Xut.Version = 836


init()


