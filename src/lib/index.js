import { config } from './config/index'
import { initGlobalAPI } from './global-api/index'
import { AudioManager } from './component/audio/manager'
import { VideoManager } from './component/video/manager'
import { nextTick } from './util/nexttick'
import { slashPostfix } from './util/option'
import { initNode } from './initialize/depend/node'
import { initDefalut } from './initialize/depend/default'
import init from './initialize/index'

//全局API初始化
initGlobalAPI()

Xut.Version = 879.9

/**
 * 加载应用app
 * arg : el / cursor
 * @return {[type]} [description]
 */
const loadApp = (...arg) => {
  initDefalut()
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
const mixGolbalConfig = setConfig => {
  if(setConfig) {
    Xut.mixin(config, setConfig)
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
  const delay = fn => setTimeout(fn, 500)

  //如果启动了这个模式
  if(config.orientateMode) {
    let temp = cacheOptions
    Xut.Application.Refresh()
    if(temp && temp.length) {
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
    config.launch = $.extend(true, {}, option)
    if(option.path) {
      _.each(option.path, (value, key) => {
        config.launch[key] = key === 'resource' ? slashPostfix(value) : value
      })
      delete config.launch.path
    }
    loadApp(option.el, option.cursor)
  }
}


/**
 * 老版本加载
 */
setTimeout(() => {
  let setConfig = Xut.Application.setConfig
  if(!setConfig || setConfig && !setConfig.lauchMode) {
    mixGolbalConfig(setConfig)
    loadApp()
  }
}, 100)
