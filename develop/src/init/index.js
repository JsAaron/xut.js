import {
    loader,
    setRootfont
}
from '../util/index'
import {
    nextTask
}
from './data'
import {
    loadVideo,
    html5Video,
    bindEvent
}
from './initprocess'

export function init() {

    var config = Xut.Config;
    var isBrowser = config.isBrowser;

    //绑定键盘事件
    bindEvent(config)

    //如果不是读库模式
    //播放HTML5视频
    //在IOS
    if (!DUKUCONFIG && !GLOBALIFRAME && Xut.plat.isIOS) {
        html5Video();
    }

    //Ifarme嵌套处理
    //1 新阅读
    //2 子文档
    //=======
    //3 pc
    //4 ios/android
    if (GLOBALIFRAME) {
        creatDatabase(config);
    } else {
        //PC还是移动
        if (isBrowser) {
            loadApp(config);
        } else {
            //如果不是iframe加载,则创建空数据库
            window.openDatabase(config.dbName, "1.0", "Xxtebook Database", config.dbSize);
            //等待硬件加载完毕
            document.addEventListener("deviceready", creatDatabase, false);
        }
    }

}


/**
 * 如果是安卓桌面端
 * 绑定事件
 * 创建数据库
 * @return {[type]} [description]
 */
function creatDatabase(config) {

    //安卓上
    if (Xut.plat.isAndroid) {

        //预加载处理视频
        //妙妙学不加载视频
        //读库不加载视频
        if (!MMXCONFIG && !DUKUCONFIG) {
            loadVideo();
        }

        //不是子文档指定绑定按键
        if (!SUbCONFIGT) {
            Xut.Application.AddEventListener = function() {
                GLOBALCONTEXT.document.addEventListener("backbutton", config._event.back, false);
                GLOBALCONTEXT.document.addEventListener("pause", config._event.pause, false);
            }
        }
    }

    if (DUKUCONFIG) {
        var PMS = PMS || require("PMS");
        PMS.bind("MagazineExit", function() {
            PMS.unbind();
            Xut.Application.DropApp();
        }, "*")
    }

    //拷贝数据库
    Xut.Plugin.XXTEbookInit.startup(config.dbName, loadApp, function() {});
};


/**
 * 加载app应用
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
function loadApp(config) {

    //修正API接口
    config.reviseAPI();

    //加载横版或者竖版css
    var baseCss = './css/' + (config.layoutMode) + '.css';
    var svgsheet = './content/gallery/svgsheet.css';

    var cssArr = [baseCss, svgsheet];
    //是否需要加载svg
    //如果是ibooks模式
    //并且没有svg
    //兼容安卓2.x
    if (Xut.IBooks.Enabled && !Xut.IBooks.existSvg) {
        cssArr = [baseCss]
    }

    //动态加载脚本
    loader.load(cssArr, function() {
        //修正全局字体
        setRootfont();
        nextTask();
    }, null, true);
}
