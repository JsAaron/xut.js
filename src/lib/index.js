//Pre initialized
import { config } from './config/index'
import { api } from './global.api'
import { AudioManager } from './component/audio/manager'
import { VideoManager } from './component/video/manager'
import { fixAudio } from './component/audio/fix'
import { disable } from './util/cursor'
//nextTick
import nextTick from './util/nexttick'
//A predictable state container for apps.
// import store from './redex/store'
import init from './init/index'


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

/**
 * remove old html
 * @return {[type]} [description]
 */
const removeOldNode = function() {
    if (document.getElementById('sceneContainer')) {
        $("#busyIcon").hide().remove()
        $("#message").hide().remove()
        $("#removelayer").hide().remove()
        $("#startupPage").hide().remove()
        $("#sceneContainer").hide().remove()
    }
}

/**
 * common html
 * @return {[type]} [description]
 */
const commonHTML = function() {
    return `<div class="xut-removelayer"></div>
            <div class="xut-start-page xut-fullscreen"></div>
            <div id="xut-scene-container" class="xut-chapter xut-fullscreen xut-overflow-hidden"></div>`
}

const iconHTML = '<div id="xut-busy-icon" class="xut-busy-wrap xut-fullscreen"></div>'


const createMain = function() {

    let rootNode = $("#xxtppt-app-container")
    let tempHTML = `${iconHTML} ${commonHTML()}`

    //create root node
    if (!rootNode.length) {
        rootNode = $('body')
        tempHTML =
            `<div id="xxtppt-app-container" class="xut-chapter xut-fullscreen xut-overflow-hidden">
                ${tempHTML}
            </div>`
    }
    nextTick({
        container: rootNode,
        content: $(tempHTML)
    }, function() {
        rootNode = null
        init()
    })
}



Xut.Application.Launch = function({
    el,
    paths,
    cursor
} = {}) {

    //set supportLaunch == false on load
    if (!Xut.Application.supportLaunch) {
        Xut.Application.isRun = true
        removeOldNode()
        createMain()
        return
    }

    let $el = $(el)
    if (!$el.length) {
        console.log('Is Xut.Application.Launch call,Must pass a root node')
        return
    }

    //清理旧节点
    removeOldNode()

    Xut.Application.supportLaunch = true

    /**
     * add dynamic config
     * @type {Object}
     */
    window.DYNAMICCONFIGT = {
        resource: paths.resource,
        database: paths.database
    }

    let busyIcon = iconHTML

    //disable cursor
    if (!cursor) {
        disable(true)
        busyIcon = ''
    }

    let $html = $(`${busyIcon}${commonHTML()}`)

    $el.css('z-index', 9999999)

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


setTimeout(() => {
    //External interface call
    if (!Xut.Application.supportLaunch && !Xut.Application.isRun) {
        Xut.Application.Launch = function() {}
        removeOldNode()
        createMain()
    }
}, 100)
