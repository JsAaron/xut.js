import { config } from './config/index'
import { api } from './global.api'
import { AudioManager } from './component/audio/manager'
import { VideoManager } from './component/video/manager'
import { fixAudio } from './component/audio/fix'
import nextTick from './util/nexttick'
import init from './initialize/index'
import initNode from './initialize/init.node'

Xut.Version = 874.9


if (Xut.plat.isBrowser) {

    //禁止全局的缩放处理
    $('body').on('touchmove', function(e) {
        e.preventDefault && e.preventDefault()
    })

    //Mobile browser automatically broadcast platform media processing
    if (Xut.plat.noAutoPlayMedia) {
        fixAudio()
    }

    //Desktop binding mouse control
    $(document).keyup(event => {
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
 * 加载应用app
 * arg : el / cursor
 * @return {[type]} [description]
 */
const loadApp = (...arg) => {
    let node = initNode(...arg)
    Xut.Application.$$removeNode = () => {
        node.$contentNode.remove()
        node.$contentNode = null
        node.$rootNode = null
        node = null
        Xut.Application.$$removeNode = null
    }

    nextTick({
        container: node.$rootNode,
        content: node.$contentNode
    }, init)
}


/**
 * 提供全局配置文件
 */
const mixModeConfig = setConfig => {
    if (setConfig) {
        Xut.extend(config, setConfig)
    }
}


/**
 * 接口接在参数
 * 用户横竖切换刷新
 * @type {Array}
 */
let cacheOptions


/**
 * 横竖切换
 */
Xut.plat.isBrowser && $(window).on('orientationchange', () => {

    //安卓设备上,对横竖切换的处理反映很慢
    //所以这里需要延时加载获取设备新的分辨率
    //2016.11.8
    let delay = function(fn) {
        setTimeout(fn, 500)
    }

    //如果启动了这个模式
    if (config.orientateMode) {
        let temp = cacheOptions
        Xut.Application.Refresh()
        if (temp && temp.length) {
            delay(() => {
                Xut.Application.Launch(temp.pop())
                temp = null
            })
        } else {
            delay(() => {
                loadApp()
            })
        }
    }
})


/**
 * 新版本加载
 */
Xut.Application.Launch = ({
    el,
    path,
    launchAnim,
    cursor,
    convert //'svg' 资源转化svg=>js，用来读取数据
}) => {

    if (Xut.launchConfig) {
        return
    }

    let setConfig = Xut.Application.setConfig
    if (setConfig && setConfig.lauchMode === 1) {
        mixModeConfig(setConfig);
        cacheOptions = [{
            el,
            path,
            cursor
        }]

        //地址结尾是否包含了斜杠，如果包含了去掉
        let resource = path.resource
        if (/\/$/.test(resource)) {
            resource = resource.substring(0, resource.length - 1)
        }

        /**
         * 应用启动配置
         * @type {Object}
         */
        Xut.launchConfig = { //外部配置文件
            resource: resource, //资源路径
            database: path.database, //数据库
            launchAnim, //启动动画
            convert //资源转化svg=>js
        }
        loadApp(el, cursor)
    }
}

/**
 * 老版本加载
 */
setTimeout(() => {
    let setConfig = Xut.Application.setConfig
    if (!setConfig || setConfig && !setConfig.lauchMode) {
        mixModeConfig(setConfig)
        loadApp()
    }
}, 100)
