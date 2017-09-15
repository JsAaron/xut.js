import baseConfig from './base-config/index'
import initMainScene from './main-scene'
import { config } from '../config/index'
import { bindAndroid } from '../initialize/button'
import { plugVideo, html5Video } from '../initialize/video'
import { $getStorage, parseJSON } from '../util/index'

const getCache = name => $getStorage(name)

const initMain = novelData => {

  /**
   * IBOOS模式
   */
  if (Xut.IBooks.Enabled) {
    //删除背景图
    $(".xut-cover").remove()
    initMainScene({
      "pageIndex": Xut.IBooks.CONFIG.pageIndex
    })
    return
  }

  /**
   * 切换切换模式
   * 多模式判断
   * 如果
   *   缓存存在
   *   否则数据库解析
         全局翻页模式
         0 滑动翻页 =》true
         1 直接换  =》 false
   * 所以pageFlip只有在左面的情况下
   * @type {Boolean}
   */
  if (novelData.parameter) {
    const parameter = parseJSON(novelData.parameter)
    /*全局优先设置覆盖*/
    if (config.launch.gestureGlide === undefined && parameter.pageflip !== undefined) {
      switch (Number(parameter.pageflip)) {
        case 0: //滑动翻页
          config.launch.gestureGlide = true
          break;
        case 1: //直接换
          config.launch.pageFlip = true
          config.launch.gestureGlide = false
          break
      }
    }
  }

  /*默认不锁定页面，支持手势滑动*/
  if (config.launch.gestureGlide === undefined) {
    config.launch.gestureGlide = true
  }

  /**
   * 缓存加载
   * 如果启动recordHistory记录
   */
  let pageIndex = Number(getCache('pageIndex'))
  if (config.launch.historyMode && pageIndex !== undefined) {
    let novelId = parseInt(getCache("novelId"))
    if (novelId) {
      return initMainScene({
        "novelId": novelId,
        "pageIndex": pageIndex,
        'history': $getStorage('history')
      })
    }
  }

  //第一次加载
  //没有缓存
  initMainScene({ "novelId": novelData._id, "pageIndex": 0 })
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
      /*app初始化完毕*/
      Xut.Application.Watch('initComplete', function() {
        bindAndroid()
      })
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


/*
  如果不是读库模式
  播放HTML5视频
  在IOS
  if (!window.DUKUCONFIG && !window.GLOBALIFRAME && Xut.plat.isIOS) {
      html5Video()
  }
  Ifarme嵌套处理
  1 新阅读
  2 子文档
  3 pc
  4 ios/android
 */
export default function main() {
  if (window.GLOBALIFRAME) {
    bindPlatEvent()
  } else {
    //brower
    if (Xut.plat.isBrowser) {
      initApp()
    } else {
      //mobile(apk or ipa)
      window.openDatabase(config.data.dbName, "1.0", "Xxtebook Database", config.data.dbSize);
      document.addEventListener("deviceready", () => {
        Xut.plat.hasPlugin = true //支持插件
        Xut.Plugin.XXTEbookInit.startup(config.data.dbName, bindPlatEvent, function() {});
      }, false)
    }
  }
}
