import { config } from '../config/index'
import { plugVideo, html5Video } from './video'
import dynamic from './dynamic'
import button from './button'
import loadScene from './scene'

import {
    _set,
    _get,
    parseJSON
}
from '../util/index'


const getCache = (name) => parseInt(_get(name))


/**
 * 进入主页面
 * @return {[type]} [description]
 */
const initMain = (novelData) => {

    let novelId
    let parameter
    let pageIndex = getCache('pageIndex')
    let pageFlip  = getCache('pageFlip') || 0

    /**
     * IBOOS模式
     */
    if (Xut.IBooks.Enabled) {
        //删除背景图
        $(".xut-removelayer").remove()
        loadScene({
            "pageIndex": Xut.IBooks.CONFIG.pageIndex
        })
        return
    }

    /**
     * 多模式判断
     * 全局翻页模式
     * 0 滑动翻页
     * 1 直接换
     * 所以pageFlip只有在左面的情况下
     */
    if (parameter = novelData.parameter) {
        //拿出pageflip的值
        parameter = parseJSON(parameter);
        //获取pageflip的值得
        //pageflip用来标
        //不能翻页
        //直接切换模式
        pageFlip = parameter.pageflip
        if (pageFlip !== undefined) {
            _set({'pageFlip': pageFlip})
        }
    }


    /**
     * 缓存加载
     * 如果启动recordHistory记录
     * [if description]
     */
    if (config.recordHistory && pageIndex !== undefined) {
        //加强判断
        if (novelId = getCache("novelId")) {
            return loadScene({
                'pageFlip'  : pageFlip,
                "novelId"   : novelId,
                "pageIndex" : pageIndex,
                'history'   : _get('history')
            });
        }
    }

    //第一次加载
    //没有缓存
    loadScene({
        "novelId"   : novelData._id,
        "pageIndex" : 0,
        'pageFlip'  : pageFlip
    });
}


/**
 * 加载app应用
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
const initApp = () => dynamic(initMain)


/**
 * 如果是安卓桌面端
 * 绑定事件
 * @return {[type]} [description]
 */
const operation = () => {
    //安卓上
    if (Xut.plat.isAndroid) {
        //预加载处理视频
        //妙妙学不加载视频
        //读库不加载视频
        if (!window.MMXCONFIG && !window.DUKUCONFIG) {
            plugVideo();
        }

        //不是子文档指定绑定按键
        if (!window.SUbCONFIGT) {
            Xut.Application.AddEventListener = () => {
                window.GLOBALCONTEXT.document.addEventListener("backbutton", config._event.back, false);
                window.GLOBALCONTEXT.document.addEventListener("pause", config._event.pause, false);
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

    //安卓按键
    button(config)

    //如果不是读库模式
    //播放HTML5视频
    //在IOS
    if (!window.DUKUCONFIG && !window.GLOBALIFRAME && Xut.plat.isIOS) {
        html5Video()
    }

    //Ifarme嵌套处理
    //1 新阅读
    //2 子文档
    //3 pc
    //4 ios/android
    if (window.GLOBALIFRAME) {
        operation()
    } else {
        //brower or mobile(apk or ipa)
        if (config.isBrowser) {
            initApp()
        } else {
            window.openDatabase(config.dbName, "1.0", "Xxtebook Database", config.dbSize);
            document.addEventListener("deviceready", () => {
                Xut.Plugin.XXTEbookInit.startup(config.dbName, operation, () => {});
            }, false)
        }
    }

}
