//Pre initialized
import { config } from './config/index'
import { api } from './global.api'
import { AudioManager } from './component/audio/manager'
import { VideoManager } from './component/video/manager'
import { fixAudio } from './component/audio/fix'
import { disable } from './initialize/busy.cursor'
//nextTick
import nextTick from './util/nexttick'
//A predictable state container for apps.
// import store from './redex/store'
import init from './initialize/index'

Xut.Version = 851

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
 * 接口接在参数
 * 用户横竖切换刷新
 * @type {Array}
 */
let lauchOptions


/**
 * 创建基本结构
 * @return {[type]} [description]
 */
const createHTML = function(nodeName = '#xxtppt-app-container', cursor = true) { //默认需要忙了光标

    let $rootNode
    if (nodeName) {
        $rootNode = $(nodeName)
    }

    if (!$rootNode.length) {
        //如果没有传递节点名，直接放到body下面
        nodeName = ''
        $rootNode = $('body')
    }

    //忙碌可配置
    let busyIcon = '<div class="xut-busy-icon xut-fullscreen"></div>'
    if (!cursor) {
        disable(true)
        busyIcon = ''
    }

    //基本结构
    //默认背景图
    const cover = window.DYNAMICCONFIGT && window.DYNAMICCONFIGT.resource ? window.DYNAMICCONFIGT.resource + '/gallery/cover.jpg' : './content/gallery/cover.jpg'
    const commonHTML =
        `<div class="xut-cover xut-fullscreen" style="background-image: url(${cover});"></div>
         <div class="xut-scene-container xut-fullscreen xut-overflow-hidden"></div>`

    let html = `${busyIcon}${commonHTML}`

    //如果根节点不存在,配置根节点
    if (!nodeName) {
        html = `<div id="xxtppt-app-container" class="xut-fullscreen xut-overflow-hidden "> ${html}</div>`
    }

    let $appNode = $(String.styleFormat(html))

    Xut.Application.$$removeNode = function() {
        lauchOptions = null
        $appNode.remove()
        $rootNode = null
        $appNode = null
    }

    nextTick({
        container: $rootNode,
        content: $appNode
    }, init)
}


/**
 * 加载应用app
 * @return {[type]} [description]
 */
const loadApp = function(...arg) {
    //清理旧节点
    if (document.getElementById('sceneContainer')) {
        "busyIcon message removelayer startupPage sceneContainer"
        .split(' ').forEach(id => {
            $(`#${id}`).hide().remove()
        })
    }
    //创建新节点
    createHTML(...arg)
}

// $('body').on('dblclick', () => {
//     Xut.Application.Refresh()
//     loadApp()
// })

//横竖切换
Xut.plat.isBrowser && window.addEventListener("orientationchange", function() {
    //0模式，默认关闭横竖切换
    if (config.orientateMode === 0) {
        return
    }
    Xut.Application.Refresh()
    if (lauchOptions.length) {
        Xut.Application.Launch.apply(null, lauchOptions.pop())
    } else {
        loadApp()
    }
}, false)


//新版本加载
Xut.Application.Launch = function({
    el,
    paths,
    cursor
}) {
    if (Xut.Application.setConfig.lauchMode === 1) {
        (lauchOptions = []).push(arguments)
        //外部配置文件
        window.DYNAMICCONFIGT = {
            resource: paths.resource,
            database: paths.database
        }
        loadApp(el, cursor)
    }
}


setTimeout(() => {

    //提供全局配置文件
    if (Xut.Application.setConfig) {
        Xut.extend(config, Xut.Application.setConfig)
    }

    //lauchMode = 0
    //老版本加载
    if (config.lauchMode === 0) {
        loadApp()
    }

}, 100)
