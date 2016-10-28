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

Xut.Version = 861

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
        Xut.Application.$$removeNode = null
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
Xut.plat.isBrowser && $(window).on('orientationchange', function() {
    //如果启动了这个模式
    if (config.orientateMode) {
        let temp = lauchOptions
        Xut.Application.Refresh()
        if (temp.length) {
            Xut.Application.Launch.apply(null, temp.pop())
            temp = null
        } else {
            loadApp()
        }
    }
})


/**
 * 提供全局配置文件
 * @return {[type]} [description]
 */
const configMode = function(setConfig) {
    if (setConfig) {
        Xut.extend(config, setConfig)
    }
}

//新版本加载
Xut.Application.Launch = function({
    el,
    paths,
    cursor
}) {
    const setConfig = Xut.Application.setConfig
    if (setConfig && setConfig.lauchMode === 1) {
        configMode(setConfig);
        (lauchOptions = []).push(arguments)
        window.DYNAMICCONFIGT = { //外部配置文件
            resource: paths.resource,
            database: paths.database
        }
        loadApp(el, cursor)
    }
}

//老版本加载
setTimeout(() => {
    const setConfig = Xut.Application.setConfig
    if (!setConfig || setConfig && setConfig.lauchMode === 0) {
        configMode(setConfig)
        loadApp()
    }
}, 100)
