//Pre initialized
import { config } from './config/index'
import { api } from './global-api'
import { AudioManager } from './component/audio/manager'
import { VideoManager } from './component/video/manager'
import { fixAudio } from './component/audio/fix'
import { disable } from './util/cursor'
//nextTick
import nextTick from './nexttick'
//A predictable state container for apps.
// import store from './redex/store'
import init from './init/index'

/**
 * Version
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


Xut.Application.Launch = function({
    el,
    paths,
    cursor
} = {}) {

    /**
     * add dynamic config
     * @type {Object}
     */
    window.DYNAMICCONFIGT = {
        resource: paths.resource,
        database: paths.database
    }

    let busyIcon = '<div id="xut-busyIcon" class="xut-busy-wrap xut-fullScreen"></div>'

    //disable cursor
    if (!cursor) {
        disable(true)
        busyIcon = ''
    }
    const $html = $(`
    ${busyIcon}
    <div class="xut-removelayer"></div>
    <div class="xut-startupPage xut-fullScreen"></div>
    <div id="xut-scene-container" class="xut-chapter xut-fullScreen xut-overflow"></div>`)
    const $el = $(el)
    $el.css('z-index', 99999)

    window.DYNAMICCONFIGT.removeNode = function() {
        $html.remove()
    }

    nextTick({
        container: $el,
        content: $html
    }, init)
}


setTimeout(() => {
    //External interface call
    if (!Xut.Application.supportLaunch) {
        $("#xxtppt-app-container").hide()
        init()
    }
}, 0)
