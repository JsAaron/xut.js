import baseConfig from './base-config/index'
import initMainScene from './main-scene'
import { config } from '../config/index'
import { bindAndroid } from './initialize/button'
import { plugVideo, html5Video } from './initialize/video'
import { $getStorage, $warn } from '../util/index'
import initBase from './initialize/index'

function initMain(novelData) {

  $warn('logic', '初始化base-config完成')

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
   * 缓存加载
   * 如果启动recordHistory记录
   */
  let pageIndex = Number($getStorage('pageIndex'))
  if (config.launch.historyMode && pageIndex !== undefined) {
    let novelId = parseInt($getStorage("novelId"))
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
 */
const initApp = () => baseConfig(initMain)


/**
 * 如果是安卓桌面端
 * 绑定事件
 * @return {[type]} [description]
 */
function bindPlatEvent() {
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
export default function entrance(options) {
  //初始化全局一些配置
  initBase(() => {
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
  })
}
