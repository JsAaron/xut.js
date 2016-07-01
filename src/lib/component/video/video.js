/**
 * 视频和网页模块（统一整合到VideoClass里面了）
 * 这里有四种播放器:
 *    1：基于html5原生实现的video标签 for ios
 *    2：基于phoneGap插件实现的media  for android
 *    3: 基于videoJS用flash实现的播放 for pc
 *    4: 用于插入一个网页的webview
 */
import { removeVideo } from './manager'
import {
    supportVideo,
    supportFlash
} from './support'

const pixelRatio = window.devicePixelRatio
const resolution = window.screen

let VideoPlayer = null


/**
 * 网页
 * @param {[type]} options [description]
 */
let _WebPage = (options) => {

    var pageUrl = options.pageUrl;

    //跳转app市场
    //普通网页是1
    //跳转app市场就是2
    if (options.hyperlink == 2) {
        //跳转到app市场
        window.open(pageUrl)
            //数据统计
        $.get('http://www.appcarrier.cn/index.php/adplugin/recordads?aid=16&esbId=ios')
    } else {

        var padding = options.padding || 0,
            width = options.width,
            height = options.height,
            videoId = options.videoId,
            left = options.left,
            top = options.top,
            $videoNode, eleWidth, eleHeight;

        if (padding) {
            eleWidth = width - 2 * padding;
            eleHeight = height - 2 * padding;
        } else {
            eleWidth = width;
            eleHeight = height
        }


        $videoNode = $('<div id="videoWrap_' + videoId + '" style="position:absolute;left:' + left + 'px;top:' + top + 'px;width:' + width + 'px;height:' + height + 'px;z-index:' + Xut.zIndexlevel() + '">' +
            '<div style="position:absolute;left:' + padding + 'px;top:' + padding + 'px;width:' + eleWidth + 'px;height:' + eleHeight + 'px;">' +
            '<iframe src="' + pageUrl + '" style="position:absolute;left:0;top:0;width:100%;height:100%;"></iframe>' +
            '</div>' +
            '</div>');

        options.container.append($videoNode);
    }



    function play() {
        $videoNode && $videoNode.show();
    }

    function stop() {
        $videoNode && $videoNode.hide();
    }

    function close() {
        if ($videoNode) {
            $videoNode.remove();
            $videoNode = null;
        }
    }

    play()

    return {
        play: play,
        stop: stop,
        close: close
    }
}


/**
 * webView弹出框
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
let webView = (options) => {
    var width = options.width,
        height = options.height,
        pageUrl = options.pageUrl,
        left = options.left,
        top = options.top;

    function play() {
        //打开一个网页的时候，需要关闭其他已经打开过的网页
        Xut.Plugin.WebView.close();
        Xut.openWebView = false;
        setTimeout(function() {
            Xut.Plugin.WebView.open(pageUrl, left, top, height, width, 1);
            Xut.openWebView = true;
        }, 500);
    }

    function close() {
        Xut.Plugin.WebView.close();
        Xut.openWebView = false;
    }

    play()

    return {
        play: play,
        stop: close,
        close: close
    }
}


/**
 * 安卓phonegap播放器
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
let _Media = (options) => {

    let width
    let height
    let left
    let top
    let url

    //如果是读库或者妙妙学
    url = (window.MMXCONFIG || window.DUKUCONFIG) ? options.url
        //如果是纯apk模式
        : options.url.substring(0, options.url.lastIndexOf('.'))

    //如果是安卓平台，视频插件去的分辨率
    //所以这里要把 可以区尺寸，转成分辨率
    //读库强制全屏
    if (window.DUKUCONFIG) {
        width = resolution.width
        height = resolution.height
        top = 0
        left = 0
    } else {
        //正常的是按照屏幕尺寸的
        //这是安卓插件问题,按照分辨率计算
        width = options.width * pixelRatio
        height = options.height * pixelRatio
        left = options.left * pixelRatio || 0
        top = options.top * pixelRatio || 0
    }


    let play = () => {
        Xut.Plugin.VideoPlayer.play(() => {
            //成功回调
        }, () => {
            //失败回调
        }, Xut.config.videoPath() + url, 1, left, top, height, width);
    }

    let close = () => {
        Xut.Plugin.VideoPlayer.close();
    }

    play()

    return {
        play: play,
        stop: close,
        close: close
    }
}

/**
 *   html5的video播放器
 *   API :
 *   play();播放
 *   stop();    //停止播放并隐藏界面
 *   destroy(); //清除元素节点及事件绑定
 *  demo :
 *  var video = new Video({url:'1.mp4',width:'320',...});
 *  video.play();
 */
let _Video5 = (options) => {

    let container = options.container || $('body')
    let url = Xut.config.videoPath() + options.url
    let width = options.width
    let height = options.height
    let top = options.top
    let left = options.left
    let zIndex = options.zIndex


    let $videoWrap = $('<div></div>')
    let $video = $(document.createElement('video'))
    let video = $video[0]


    //video节点
    $video.css({
        width: width,
        height: height
    }).attr({
        'src': url,
        'controls': 'controls',
        'autoplay': 'autoplay'
    })

    //父容器
    $videoWrap.append($video).css({
        position: 'absolute',
        'z-index': -1,
        top: top,
        left: left,
        width: 0,
        height: 0
    })

    /**
     * 播放视频
     * @return {[type]} [description]
     */
    let _paly = () => {
        $videoWrap.show()
        video.play()
    }

    //////////////////////////
    ///2016.6.23
    //安卓ios需要直接调用play开始
    ////////////////////////
    if (Xut.plat.isIOS || Xut.plat.isAndroid) {
        _paly()
    }

    /**
     * 停止
     * @return {[type]} [description]
     */
    let stop = () => {

        video.pause();

        //妙妙学只需要停止
        if (!window.MMXCONFIG) {
            //复位视频
            if (video.duration) {
                video.currentTime = 0.01;
            }

            $videoWrap.hide();

            //用于启动视频
            if (options.startBoot) {
                options.startBoot();
                destroy();
            }
        }

    }

    /**
     * 错误
     * @return {[type]} [description]
     */
    let error = () => {
        //用于启动视频
        if (options.startBoot) {
            options.startBoot();
            destroy()
        }
    }

    /**
     * 防止播放错误时播放界面闪现
     * @return {[type]} [description]
     */
    let start = () => {
        $videoWrap.css({
            width: width + 'px',
            height: height + 'px',
            zIndex: zIndex
        })

        //加完后播放视频
        _paly()
    }

    /**
     * 销毁
     * @return {[type]} [description]
     */
    let destroy = () => {
        video.removeEventListener('ended', stop, false)
        video.removeEventListener('error', error, false)
        video.removeEventListener('loadeddata', start, false)
        video.removeEventListener('webkitendfullscreen', stop, false)
        $videoWrap.hide().remove()
    }

    container.append($videoWrap);

    video.addEventListener('ended', stop, false)
    video.addEventListener('error', error, false)
    video.addEventListener('loadeddata', start, false)
    video.addEventListener('webkitendfullscreen', stop, false)

    return {
        play: _paly,
        stop: stop,
        close: destroy
    }
};


/**
 * https://github.com/videojs/video.js/blob/master/docs/guides/setup.md
 * 基于video.js的web播放器,在pc端flash优先
 * @param {[type]} options [description]
 */
let _VideoJS = (options) => {
    var container = options.container || $('body'),
        videoId = options.videoId,
        url = Xut.config.videoPath() + options.url,
        width = options.width,
        height = options.height,
        zIndex = options.zIndex,
        top = options.top,
        left = options.left,
        video, source, player;

    video = document.createElement('video');
    source = document.createElement('source');
    source.setAttribute('src', url);
    source.setAttribute('type', 'video/mp4');
    video.id = 'video_' + videoId;
    video.className = "video-js vjs-sublime-skin";
    video.appendChild(source);
    container.append(video);
    //指定本地的swf地址取代网络地址
    videojs.options.flash.swf = "lib/data/video-js.swf";

    var clear = function() {
        //结束后清理自己
        removeVideo(options.pageId);
    }

    //videojs是videojs定义的全局函数
    player = videojs(video, {
        //视频引擎顺序,位置排前面的优先级越高
        "techOrder": ["html5", "flash"],
        //预加载
        "preload": "auto",
        //是否有控制条
        "controls": true,
        "autoplay": true,
        "width": width,
        "height": height,
        //播放元素相关设置
        children: {
            //暂停时是否显示大大的播放按钮
            bigPlayButton: false,
            //是否显示错误提示
            errorDisplay: false,
            //是否显示视频快照
            posterImage: false,
            //是否显示字幕
            textTrackDisplay: false,
            volumeMenuButton: false
        },
        //控制条相关设置
        controlBar: {
            //是否显示字幕按钮
            captionsButton: false,
            chaptersButton: false,

            liveDisplay: false,
            //是否显示剩余时间
            remainingTimeDisplay: true,
            //是否显示子标题按钮
            subtitlesButton: false,
            //是否显示回放菜单按钮
            playbackRateMenuButton: false,
            //是否显示时间分隔符"/"
            timeDivider: false,
            //是否显示当前视频的当前时间值
            currentTimeDisplay: false,
            //是否显示视频时长
            durationDisplay: false
        }
    }, function() {
        //可以播放时提升层级，防止闪现
        this.on('canplay', function() {
            wrap.style.zIndex = zIndex;
        });

        //播放完毕后自动关闭
        this.on('ended', function() {
            //结束后清理自己
            clear()
        });

        this.on('error', function() {
            clear()
        });

        //因为没有关闭按钮,又不想自己做,就把全屏变成关闭好了.
        this.on("touchend mouseup", function(e) {
            var className = e.target.className.toLowerCase();
            if (-1 != className.indexOf('vjs-fullscreen-control')) {
                clear()
            }
        })
    })

    //修正视频样式
    var wrap = player.el()
    var videoElement = wrap.children[0]
    wrap.style.left = left + 'px'
    wrap.style.top = top + 'px'
    wrap.style.zIndex = -1

    return {

        play: function() {
            console.log(111);
        },

        stop: function() {
            player.pause();
        },

        close: function() {
            player.dispose();
            player = null;
        }
    }


}



//浏览器平台
if (Xut.plat.isBrowser) {
    VideoPlayer = _Video5
} else {
    //检测平台
    if (Xut.plat.isIOS || top.EduStoreClient) {
        //如果是ibooks模式
        if (Xut.IBooks.Enabled) {
            VideoPlayer = _VideoJS
        } else {
            //如果是ios或读酷pc版则使用html5播放
            VideoPlayer = _Video5
        }
    } else if (Xut.plat.isAndroid) {
        if (window.MMXCONFIG) {
            // 安卓妙妙学强制走h5
            VideoPlayer = _Video5
        } else {
            //android平台
            VideoPlayer = _Media
        }
    }
}



class VideoClass {

    constructor(options, container) {

        options.container = container;
        if ('video' == options.category) {
            this.video = VideoPlayer(options)
        } else if ('webpage' == options.category) {
            this.video = _WebPage(options);
        } else {
            console.log('options.category must be video or webPage ')
        }
        Xut.View.Toolbar("hide")
    }

    play() {
        //隐藏工具栏
        Xut.View.Toolbar("hide")
        this.video.play()
    }

    stop() {
        //显示工具栏
        Xut.View.Toolbar("show")
        this.video.stop()
    }

    close() {
        this.video.close()
    }

}


export {
    _Video5 as Video5,
    VideoClass
}
