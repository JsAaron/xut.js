import init from './entry/index'
import { config } from './config/index'
import { nextTick } from './util/nexttick'
import { slashPostfix } from './util/option'
import { AudioManager } from './component/audio/manager'
import { VideoManager } from './component/video/manager'
import { initRootNode } from './initialize/node'
import { initGlobalEvent } from './initialize/event'
import { initGlobalAPI } from './global-api/index'
import { priorityConfig } from './config/priority-config'

/*全局API初始化*/
initGlobalAPI()

Xut.Version = 881.3

/*加载应用app*/
const initApp = (...arg) => {
  /*配置优先级*/
  priorityConfig()

  /*全局的一些事件处理*/
  initGlobalEvent()
  const { $rootNode, $contentNode } = initRootNode(...arg)
  nextTick({ container: $rootNode, content: $contentNode }, init)
}

/*提供全局配置文件*/
const mixGolbalConfig = setConfig => { setConfig && Xut.mixin(config, setConfig) }

/*接口接在参数,用户横竖切换刷新*/
let cacheOptions

/*横竖切换*/
const bindOrientateMode = Xut.plat.isBrowser && config.orientateMode ? function() {
  $(window).on('orientationchange', () => {
    //安卓设备上,对横竖切换的处理反映很慢
    //所以这里需要延时加载获取设备新的分辨率
    //2016.11.8
    const delay = fn => setTimeout(fn, 500)
    let temp = cacheOptions
    Xut.Application.Refresh()
    if(temp && temp.length) {
      delay(() => {
        Xut.Application.Launch(temp.pop())
        temp = null
      })
    } else {
      delay(() => {
        initApp()
      })
    }
  })
} : function() {}


/**
 * 新版本加载
    style: path.style, //style样式文件
    resource: slashPostfix(path.resource), //资源路径
    database: path.database, //数据库
    launchAnim: option.launchAnim, //启动动画
    convert: option.convert, //资源转化svg=>js
    pageBar: option.pageBar //mini页码显示模式
 */
Xut.Application.Launch = option => {
  if(config.launch) {
    return
  }
  let setConfig = Xut.Application.setConfig
  if(setConfig && setConfig.lauchMode === 1) {
    mixGolbalConfig(setConfig);
    cacheOptions = [option] //多次切换
    config.launch = $.extend(true, { launchTime: (+new Date) }, option)
    if(option.path) {
      _.each(option.path, (value, key) => {
        config.launch[key] = key === 'resource' ? slashPostfix(value) : value
      })
      delete config.launch.path
    }
    bindOrientateMode()
    initApp(option.el, option.cursor)
  }
}


/*老版本加载*/
setTimeout(() => {
  let setConfig = Xut.Application.setConfig
  if(!setConfig || setConfig && !setConfig.lauchMode) {
    mixGolbalConfig(setConfig)
    initApp()
  }
}, 100)
