import {
  config
} from '../config/index'
import {
  plugVideo,
  html5Video
} from './depend/video'
import baseConfig from './base'
import {
  bindAndroid
} from './depend/button'
import loadScene from './scenario'

import {
  $$set,
  $$get,
  parseJSON
}
from '../util/index'


const getCache = (name) => $$get(name)

/**
 * 进入主页面
 */
const initMain = (novelData) => {

  /**
   * IBOOS模式
   */
  if (Xut.IBooks.Enabled) {
    //删除背景图
    $(".xut-cover").remove()
    loadScene({
      "pageIndex": Xut.IBooks.CONFIG.pageIndex
    })
    return
  }

  /**
   * 多模式判断
   * 如果
   *   缓存存在
   *   否则数据库解析
         全局翻页模式
         0 滑动翻页 =》allow
         1 直接换  =》ban
   * 所以pageFlip只有在左面的情况下
   */
  let __flipMode = getCache('flipMode')
  if (!__flipMode && novelData.paramete) {
    let parameter = parseJSON(novelData.paramete)
    if (parameter.pageflip !== undefined) {
      __flipMode = Number(parameter.pageflip)
      if (__flipMode === 0) {
        config.flipMode = 'allow' //允许翻页
      } else if (__flipMode === 1) {
        config.flipMode = 'ban' //禁止翻页
      }
      //缓存
      $$set({
        'flipMode': config.flipMode
      })
    }
  }


  /**
   * 缓存加载
   * 如果启动recordHistory记录
   */
  let pageIndex = Number(getCache('pageIndex'))
  if (config.historyMode && pageIndex !== undefined) {
    let novelId = parseInt(getCache("novelId"))
    if (novelId) {
      return loadScene({
        "novelId": novelId,
        "pageIndex": pageIndex,
        'history': $$get('history')
      })
    }
  }

  //第一次加载
  //没有缓存
  loadScene({
    "novelId": novelData._id,
    "pageIndex": 0
  })
}


/**
 * 加载app应用
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
const initApp = () => baseConfig(initMain)


/**
 * 如果是安卓桌面端
 * 绑定事件
 * @return {[type]} [description]
 */
const bindPlatEvent = () => {

  //安卓上并且不是浏览器打开的情况
  if (Xut.plat.isAndroid && !Xut.plat.isBrowser) {

    //预加载处理视频
    //妙妙学不加载视频
    //读库不加载视频
    if (window.MMXCONFIG && !window.DUKUCONFIG) {
      plugVideo();
    }

    //不是子文档指定绑定按键
    if (!window.SUbCONFIGT) {
      Xut.Application.AddEventListener = () => {
        bindAndroid()
      }
    }
  }

  if (window.DUKUCONFIG) {
    PMS.bind("MagazineExit", () => {
      PMS.unbind();
      Xut.Application.DropApp();
    }, "*")
  }
  initApp()
}


export default function init() {

  //如果不是读库模式
  //播放HTML5视频
  //在IOS
  // if (!window.DUKUCONFIG && !window.GLOBALIFRAME && Xut.plat.isIOS) {
  //     html5Video()
  // }

  //Ifarme嵌套处理
  //1 新阅读
  //2 子文档
  //3 pc
  //4 ios/android
  if (window.GLOBALIFRAME) {
    bindPlatEvent()
  } else {

    //brower
    if (config.isBrowser) {
      initApp()
    } else {
      //mobile(apk or ipa)
      window.openDatabase(config.dbName, "1.0", "Xxtebook Database", config.dbSize);
      document.addEventListener("deviceready", () => {
        Xut.plat.hasPlugin = true //支持插件
        Xut.Plugin.XXTEbookInit.startup(config.dbName, bindPlatEvent, function() {});
      }, false)
    }
  }

}
