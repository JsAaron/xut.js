import {
    loader,
    setRootfont
}
from '../util/index'

import {initData} from './data'


export function init(argument) {
    var config = Xut.Config;
    var isBrowser = config.isBrowser;


    var preloadVideo = {
        //播放状态
        state: false,
        //地址
        path: DUKUCONFIG ? DUKUCONFIG.path + "duku.mp4" : 'android.resource://#packagename#/raw/duku',

        //加载视频
        load: function() {
            // if (window.localStorage.getItem("videoPlayer") == 'error') {
            //       alert("error")
            //     return preloadVideo.launchApp();
            // }
            this.play();
            this.state = true;
        },

        //播放视频
        play: function() {
            //延时应用加载
            Xut.Application.delayAppRun();
            Xut.Plugin.VideoPlayer.play(function() {
                preloadVideo.launchApp();
            }, function() {
                //捕获出错,下次不进入了,,暂无ID号
                // window.localStorage.setItem("videoPlayer", "error")
                preloadVideo.launchApp();
            }, preloadVideo.path, 1, 0, 0, window.innerHeight, window.innerWidth);
        },

        //清理视频
        closeVideo: function() {
            Xut.Plugin.VideoPlayer.close(function() {
                preloadVideo.launchApp();
            });
        },

        //加载应用
        launchApp: function() {
            this.state = false;
            Xut.Application.LaunchApp()
        }
    }


    //存放绑定事件
    config._event = {
        //回退键
        back: function() {
            //如果是预加载视频
            if (preloadVideo.state) {
                preloadVideo.closeVideo()
            } else {
                controller('back');
            }
        },
        //暂停键
        pause: function() {
            controller('pause');
        }

    }

    //如果不是读库模式
    //播放HTML5视频
    //在IOS
    if (!DUKUCONFIG && !GLOBALIFRAME && Xut.plat.isIOS) {
        createHtml5Video();
    }


    //Ifarme嵌套处理
    //1 新阅读
    //2 子文档
    if (GLOBALIFRAME) {
        initDB(config);
    } else {
        //PC还是移动
        if (isBrowser) {
            loadApp(config);
        } else {
            //如果不是iframe加载,则创建空数据库
            window.openDatabase(config.dbName, "1.0", "Xxtebook Database", config.dbSize);
            //等待硬件加载完毕
            document.addEventListener("deviceready", initDB, false);
        }
    }



    /**************
     * 物理按键处理
     **************/

    //退出加锁,防止过快点击
    var outLock = false;

    //回退按钮状态控制器
    function controller(state) {
        //如果是子文档处理
        if (Xut.isRunSubDoc) {
            //通过Action动作激活的,需要到Action类中处理
            Xut.publish('subdoc:dropApp');
            return;
        }
        //正常逻辑
        outLock = true;

        Xut.Application.Suspend({
            dispose: function() { //停止热点动作
                setTimeout(function() {
                    outLock = false;
                }, 100)
            },
            processed: function() { //退出应用
                state === 'back' && Xut.Application.DropApp();
            }
        });
    }


    /**
     *  创建播放器
     *  IOS，PC端执行
     */
    function createHtml5Video() {
        //延时应用开始
        Xut.Application.delayAppRun();
        var videoPlay = Xut.Video5({
            url: 'duku.mp4',
            startBoot: function() {
                Xut.Application.LaunchApp();
            }
        });
        videoPlay.play();
    }

}



/**
 * 如果是安卓桌面端
 * @return {[type]} [description]
 */
function initDB(config) {

    //安卓上
    if (Xut.plat.isAndroid) {

        //预加载处理视频
        //妙妙学不加载视频
        //读库不加载视频
        if (!MMXCONFIG && !DUKUCONFIG) {
            preloadVideo.load();
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
 *  创建播放器
 *  IOS，PC端执行
 */
function createHtml5Video() {
    //延时应用开始
    Xut.Application.delayAppRun();
    var videoPlay = Xut.Video5({
        url: 'duku.mp4',
        startBoot: function() {
            Xut.Application.LaunchApp();
        }
    });
    videoPlay.play();
}


/**
 * 加载app应用
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
function loadApp(config) {

    //修正API接口
    config.reviseAPI();

    //加载横版或者竖版css
	var baseCss  = './css/' + (config.layoutMode) + '.css';
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
        initData();
    }, null, true);
}
