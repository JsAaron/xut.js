/**
 * 视频和网页模块（统一整合到VideoClass里面了）
 * 这里有四种播放器:
 *    1：基于html5原生实现的video标签 for ios
 *    2：基于phoneGap插件实现的media  for android
 *    3: 基于videoJS用flash实现的播放 for pc
 *    4: 用于插入一个网页的webview
 */

var VideoPlayer = null,
    noop = function() {},

    //检测是否支持HTML5的video播放
    supportVideo = function() {
        var video = document.createElement('video'),
            type = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
        return !!video.canPlayType && "probably" == video.canPlayType(type);
    }(),

    //检测是否安装了flash插件
    supportFlash = function() {
        var i_flash = false;

        if (navigator.plugins) {
            for (var i = 0; i < navigator.plugins.length; i++) {
                if (navigator.plugins[i].name.toLowerCase().indexOf("shockwave flash") != -1) {
                    i_flash = true;
                }
            }
        }
        return i_flash;
    }();


//移动端浏览器平台
if (Xut.plat.isBrowser) {
    VideoPlayer = Video5
} else {
    //检测平台
    if (Xut.plat.isIOS || top.EduStoreClient) {
        //如果是ibooks模式
        if (Xut.IBooks.Enabled) {
            VideoPlayer = VideoJS
        } else {
            //如果是ios或读酷pc版则使用html5播放
            VideoPlayer = Video5;
        }
    } else if (Xut.plat.isAndroid) {
        //android平台
        VideoPlayer = _Media;
    }
}

/**
 * @param {[type]} options   [description]
 *   options.videoId;
 *   options.pageId;
 *   options.pageUrl;
 *   options.left;
 *   options.top;
 *   options.width;
 *   options.height;
 *   options.padding;
 *   options.category;
 * @param {[type]} container 视频元素容器
 */

function VideoClass(options, container) {
    options.container = container;
    if ('video' == options.category) {
        this.video = VideoPlayer(options);
    } else if ('webpage' == options.category) {
        this.video = WebPage(options);
    } else {
        console.log('options.category must be video or webPage ')
    }
}

VideoClass.prototype = {
    play: function() {
        //隐藏工具栏
        Xut.View.Toolbar("hide");
        this.video.play();
    },
    stop: function() {
        //显示工具栏
        Xut.View.Toolbar("show");
        this.video.stop();
    },
    close: function() {
        this.video.close();
    }
}


// 网页
function WebPage(options) {

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

    return {
        play: play,
        stop: stop,
        close: close
    }
}


function webView(options) {
    var width = options.width,
        height = options.height,
        pageUrl = options.pageUrl,
        left = options.left,
        top = options.top;

    function play() {
        //打开一个网页的时候，需要关闭其他已经打开过的网页
        Xut.Plugin.WebView.close();
        Xut.VideoManager.openWebView = false;
        setTimeout(function() {
            Xut.Plugin.WebView.open(pageUrl, left, top, height, width, 1);
            Xut.VideoManager.openWebView = true;
        }, 500);
    }

    function close() {
        Xut.Plugin.WebView.close();
        Xut.VideoManager.openWebView = false;
    }

    return {
        play: play,
        stop: close,
        close: close
    }
}


/**
 * ios窗口化canvas播放器
 */
function VideoCanvas(options) {

    var container = options.container || $('body'),
        url = Xut.Config.videoPath() + options.url,
        width = options.width,
        height = options.height,
        top = options.top,
        left = options.left,
        zIndex = options.zIndex;

    var video = new InlineVideo(container, {
        'loop': false,
        'autoplay': true,
        'src': url,
        'width': width,
        'height': height,
        'top': top,
        'left': left,
        'zIndex': zIndex
    })

    return {
        play: function() {
            video.play()
        },
        stop: function() {
            video.pause()
        },
        close: function() {
            video.destroy()
        }
    }
}


/**
 * 安卓phonegap播放器
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function _Media(options) {
    var url = MMXCONFIG ? options.url : options.url.substring(0, options.url.lastIndexOf('.')),
        width = options.width,
        height = options.height,
        top = options.top || 0,
        left = options.left || 0;

    function play() {
        //var calculate = Xut.Config.proportion.calculateContainer();
        //top += Math.ceil(calculate.top);
        //left += Math.ceil(calculate.left);
        Xut.Plugin.VideoPlayer.play(function() {
            //成功回调
        }, function() {
            //失败回调
        }, Xut.Config.videoPath() + url, 1, left, top, height, width);
    }

    function close() {
        Xut.Plugin.VideoPlayer.close();
    }

    play();

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

function Video5(options) {

    var container = options.container || $('body'),
        url = Xut.Config.videoPath() + options.url,
        width = options.width,
        height = options.height,
        top = options.top,
        left = options.left,
        zIndex = options.zIndex,
        /*创建播放器*/
        $videoWrap = $('<div></div>');

    var $video = $(document.createElement('video'));

    //音频对象
    var video = $video[0];

    video.play();

    $video.css({
        width: width,
        height: height
    }).attr({
        'src': url,
        'controls': 'controls',
        'autoplay': 'autoplay'
    });

    $videoWrap.append($video).css({
        position: 'absolute',
        'z-index': -1,
        top: top,
        left: left,
        width: 0,
        height: 0
    });

    //播放
    function play() {
        $videoWrap.show();
        video.play();
    }

    //停止
    function stop() {
        video.pause();
        //复位视频
        if (video.duration) {
            video.currentTime = 0.01;
        }
        //在全屏时无法隐藏元素,须先退出
        //this.video.webkitExitFullScreen();
        $videoWrap.hide();

        //用于启动视频
        if (options.startBoot) {
            options.startBoot();
            destroy();
        }
    }

    function error() {
        //用于启动视频
        if (options.startBoot) {
            options.startBoot();
            destroy();
        }
    }

    /**
     * 防止播放错误时播放界面闪现
     * @return {[type]} [description]
     */
    function start() {
        $videoWrap.css({
            width: width + 'px',
            height: height + 'px',
            zIndex: zIndex
        });
    }

    //销毁
    function destroy() {
        video.removeEventListener('ended', stop, false);
        video.removeEventListener('error', error, false);
        video.removeEventListener('loadeddata', start, false);
        video.removeEventListener('webkitendfullscreen', stop, false);
        $videoWrap.hide().remove();
    }

    container.append($videoWrap);

    video.addEventListener('ended', stop, false);
    video.addEventListener('error', error, false);
    video.addEventListener('loadeddata', start, false);
    video.addEventListener('webkitendfullscreen', stop, false);

    return {
        play: play,
        stop: stop,
        close: destroy
    }
};

/**
 * https://github.com/videojs/video.js/blob/master/docs/guides/setup.md
 * 基于video.js的web播放器,在pc端flash优先
 * @param {[type]} options [description]
 */

function VideoJS(options) {
    var container = options.container || $('body'),
        videoId = options.videoId,
        url = Xut.Config.videoPath() + options.url,
        width = options.width,
        height = options.height,
        zIndex = options.zIndex,
        top = options.top,
        left = options.left,
        video, source, player, api;

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
        Xut.VideoManager.removeVideo(options.pageId);
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
            textTrackDisplay: false
        },
        //控制条相关设置
        controlBar: {
            //是否显示字幕按钮
            captionsButton: false,
            chaptersButton: false,
            liveDisplay: false,
            //是否显示剩余时间
            remainingTimeDisplay: false,
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
    });

    //修正视频样式
    var wrap = player.el(),
        videoElement = wrap.children[0];
    wrap.style.left = left + 'px';
    wrap.style.top = top + 'px';
    wrap.style.zIndex = -1;

    api = {
        play: noop,

        stop: function() {
            player.stop();
        },

        close: function() {
            player && player.dispose();
            player = null;
        }
    }

    return api;
}

Xut.Video5 = Video5;

Xut.Video = VideoClass;


export {
    VideoClass as Html5Video

}
