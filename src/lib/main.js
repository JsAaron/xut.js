//Pre initialized
import { config } from './config/index'
import { api } from './global-api'
import { AudioManager } from './component/audio/manager'
import { VideoManager } from './component/video/manager'
import init from './initialize/index'
//fix audio
import { fixAudio } from './component/audio/fix'
import nextTick from './nexttick'
//A predictable state container for apps.
// import store from './redex/store'


/**
 * 版本号
 * @type {Number}
 */
Xut.Version = 836


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


export default Xut


const main = function(node) {
    const html = `
    <div id="xut-busyIcon" class="xut-busy-wrap xut-fullScreen"></div>
    <div class="xut-busy-wrap xut-fullScreen xut-hide"></div>
    <div class="xut-removelayer"></div>
    <div class="xut-startupPage xut-fullScreen"></div>
    <div id="xut-scene-container" class="xut-chapter xut-fullScreen xut-overflow"></div>`

    nextTick({
        container: $(node),
        content: $(html)
    }, function() {
        init()
    })
}


Xut.Application.Launch = main

setTimeout(() => {
    if (Xut.Application.setLaunch) {
         main()
    }
}, 0)
