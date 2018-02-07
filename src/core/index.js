import enterApp from './entrance/index'
import { config } from './config/index'
import { removeSlash, mixGlobalConfig } from './util/index'

/////////////////
////  版本号  ////
/////////////////
Xut.Version = 894.2


//接口接在参数,用户横竖切换刷新
let cacheOptions
let delayTimer = null

/**
 * 横竖切换
 */
const bindOrientateMode = Xut.plat.isBrowser && config.orientateMode ? function() {
  $(window).on('orientationchange', (e) => {

    /**
     * 2017.5.23
     * 安卓手机播放视频，全屏的情况下，会强制横版
     * 导致了触发横竖切换关闭应用
     */
    if (Xut.Application.PlayHTML5Video) {
      return
    }

    //安卓设备上,对横竖切换的处理反映很慢
    //所以这里需要延时加载获取设备新的分辨率
    //2016.11.8
    function delay(fn) {
      if (!delayTimer) {
        delayTimer = setTimeout(function() {
          Xut.Application.Refresh()
          clearTimeout(delayTimer)
          delayTimer = null
          fn()
        }, 1000)
      }
    }

    let temp = cacheOptions
    if (temp && temp.length) {
      delay(() => {
        Xut.Application.Launch(temp.pop())
        temp = null
      })
    } else {
      delay(() => {
        enterApp()
      })
    }
  })
} : function() {}


/**
 * 新版本加载
 */
Xut.Application.Launch = option => {
  if (config.launch) {
    return
  }
  const setConfig = Xut.Application.setConfig
  if (setConfig && setConfig.lauchMode === 1) {
    mixGlobalConfig(setConfig);
    /*当前的launch配置文件，用于横竖切换处理*/
    cacheOptions = [option]
    config.launch = $.extend(true, { launchTime: (+new Date) }, option)
    if (option.path) {
      _.each(option.path, (value, key) => {
        config.launch[key] = key === 'resource' ? removeSlash(value) : value
      })
      delete config.launch.path
    }
    bindOrientateMode()
    enterApp()
  }
}


/**
 * 判断是否script有data-plat或者data-mode属性
 */
function hasLaunch() {
  const scripts = document.querySelectorAll('script')
  for (let i = 0; i < scripts.length; i++) {
    let node = scripts[i]
    if (node.getAttribute('data-lauchMode') == 1) {
      return true
    }
    if (node.getAttribute('data-plat') === 'mini') {
      return true
    }
  }
}


/**
 * 老版本加载
 */
setTimeout(() => {
  const setConfig = Xut.Application.setConfig
  if (!setConfig || setConfig && setConfig.lauchMode !== 1) {
    if (hasLaunch()) {
      return
    }
    mixGlobalConfig(setConfig)
    /*保证兼容，不需要判断launch存在，初始空对象*/
    config.launch = {}
    enterApp()
  }
}, 100)
