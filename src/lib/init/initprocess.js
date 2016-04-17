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

export function loadVideo() {
    preloadVideo.load();
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
 * 绑定控制案例事件
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
export function bindEvent(config) {
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
}



/**
 *  创建播放器
 *  IOS，PC端执行
 */
export function html5Video() {
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
