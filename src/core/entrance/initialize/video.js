import FlarePlayer from '../../component/video/player/flare'


const preloadVideo = {

  //播放状态
  state: false,

  //地址
  path: window.DUKUCONFIG ? window.DUKUCONFIG.path + "duku.mp4" : 'android.resource://#packagename#/raw/duku',

  //加载视频
  load() {
    // if (window.localStorage.getItem("videoPlayer") == 'error') {
    //       alert("error")
    //     return preloadVideo.launchApp();
    // }
    this.play();
    this.state = true;
  },

  //播放视频
  play() {
    //延时应用加载
    Xut.Application.delayAppRun();
    Xut.Plugin.VideoPlayer.play(function () {
      preloadVideo.launchApp();
    }, function () {
      //捕获出错,下次不进入了,,暂无ID号
      // window.localStorage.setItem("videoPlayer", "error")
      preloadVideo.launchApp();
    }, preloadVideo.path, 1, 0, 0, window.innerHeight, window.innerWidth);
  },

  //清理视频
  closeVideo() {
    Xut.Plugin.VideoPlayer.close(function () {
      preloadVideo.launchApp();
    });
  },

  //加载应用
  launchApp() {
    this.state = false;
    Xut.Application.LaunchApp()
  }
}



/**
 * 获取插件视频状态
 */
export function getPlugVideoState() {
  return preloadVideo.state
}

/**
 * 关闭插件视频
 */
export function closePlugVideo() {
  preloadVideo.closeVideo()
}


/**
 * 播放视频插件
 */
export function plugVideo() {
  preloadVideo.load();
}


/**
 *  创建播放器
 *  IOS，PC端执行
 */
export function html5Video() {
  //延时应用开始
  Xut.Application.delayAppRun()
  FlarePlayer({
    url: 'duku.mp4',
    startBoot: function () {
      Xut.Application.LaunchApp();
    }
  })
}
