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
import init from './main/index'


Xut.Version = 836


if (Xut.plat.isBrowser) {
    //Mobile browser automatically broadcast platform media processing
    if (Xut.plat.noAutoPlayMedia) {
        fixAudio()
    }
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


Xut.Application.Launch = function({
    el,
    paths,
    cursor
} = {}) {

    let $el = $(el)
    if(!$el.length){
        console.log('Must pass a root node')
        return
    }
    
    Xut.Application.supportLaunch = true

    /**
     * add dynamic config
     * @type {Object}
     */
    window.DYNAMICCONFIGT = {
        resource: paths.resource,
        database: paths.database
    }

    let busyIcon = '<div id="xut-busy-icon" class="xut-busy-wrap xut-fullscreen"></div>'

    //disable cursor
    if (!cursor) {
        disable(true)
        busyIcon = ''
    }

    let $html = $(`
    ${busyIcon}
    <div class="xut-removelayer"></div>
    <div class="xut-start-page xut-fullscreen"></div>
    <div id="xut-scene-container" class="xut-chapter xut-fullscreen xut-overflow"></div>`)

    $el.css('z-index', 99999)

    window.DYNAMICCONFIGT.removeNode = function() {
        $html.remove()
        $html = null
        $el = null
    }

    nextTick({
        container: $el,
        content: $html
    }, init)
}


const createMain = function() {
    let rootNode = $("#xxtppt-app-container")
    let nodeHhtml = '<div id="xxtppt-app-container" class="xut-chapter xut-fullscreen xut-overflow"></div>'
    let tempHtml = `<div id="xut-busy-icon" class="xut-busy-wrap xut-fullscreen"></div>
                    <div class="xut-removelayer"></div>
                    <div class="xut-start-page xut-fullscreen"></div>
                    <div id="xut-scene-container" class="xut-chapter xut-fullscreen xut-overflow"></div>`

    let $html
    if (rootNode.length) {
        $html = $(tempHtml)
    } else {
        rootNode = $('body')
        $html = $(
            `<div id="xxtppt-app-container" class="xut-chapter xut-fullscreen xut-overflow">${tempHtml}</div>`
        )
    }
    nextTick({
        container: rootNode,
        content: $html
    }, function() {
        init()
    })
}

setTimeout(() => {
    //External interface call
    if (!Xut.Application.supportLaunch) {
        Xut.Application.Launch = null
        $("#xxtppt-app-container").remove()
        init()
    }
}, 0)
