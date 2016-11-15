/**
 * 视频和网页模块（统一整合到VideoClass里面了）
 * 这里有四种播放器:
 *    1：基于html5原生实现的video标签 for ios
 *    2：基于phoneGap插件实现的media  for android
 *    3: 基于videoJS用flash实现的播放 for pc
 *    4: 用于插入一个网页的webview
 */
import { config } from '../../config/index'
import { removeVideo } from './manager'
import {
    supportVideo,
    supportFlash
} from './support'

const pixelRatio = window.devicePixelRatio
const resolution = window.screen

let VideoPlayer = null


/**
 * 获取容器
 * @return {[type]} [description]
 */
const getContainer = container => {
    return container.children ? $(container.children) : $('body')
}

/**
 * 网页
 * @param {[type]} options [description]
 */
const _WebPage = options => {

    let pageUrl = options.pageUrl;
    let container = getContainer(options.container)

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

        container.append($videoNode);
    }



    function play() {
        $videoNode && $videoNode.show();
    }


    play()

    return {
        play: play,
        stop() {
            $videoNode && $videoNode.hide();
        },
        close() {
            if ($videoNode) {
                $videoNode.remove();
                $videoNode = null;
            }
            container = null
        }
    }
}


/**
 * webView弹出框
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
const webView = options => {
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

    play()

    return {
        play: play,
        stop: close,
        close() {
            Xut.Plugin.WebView.close();
            Xut.openWebView = false;
        }
    }
}


/**
 * 安卓phonegap播放器
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
const _Media = options => {

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
        }, config.getVideoPath() + url, 1, left, top, height, width);
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
 * 创建视频容器
 */
const createVideoWrap = function({
    type,
    width,
    height,
    zIndex,
    top,
    left
}) {
    let wrap =
        `<div data-type="${type}"
              style="width:${width}px;
                     height:${height}px;
                     position:absolute;
                     visibility:hidden;
                     z-index:${zIndex};
                     top:${top}px;
                     left:${left}px;">
         </div>`

    return $(String.styleFormat(wrap))
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
const _Video5 = options => {

    let container = getContainer(options.container)
    let url = config.getVideoPath() + options.url
    let width = options.width
    let height = options.height

    let $videoWrap = createVideoWrap({
        type:'video-h5',
        width,
        height,
        top: options.top,
        left: options.left,
        zIndex: options.zIndex
    })
    let video = document.createElement('video')
    let $videoNode = $(video).css({
        width: width,
        height: height
    }).attr({
        'src': url,
        'controls': 'controls',
        'autoplay': 'autoplay'
    })

    //父容器
    $videoWrap.append($videoNode)

    /**
     * 播放视频
     * @return {[type]} [description]
     */
    function play() {
        //iphone手机上，系统接管后，点击完成
        //必须这样处理后，才能再次显示
        $videoWrap.show()
        video.play()
    }

    function start() {
        play();
        //防止播放错误时播放界面闪现
        $videoWrap.css('visibility', 'visible')
    }

    /**
     * 停止
     * @return {[type]} [description]
     */
    function stop() {
        video.pause()
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
    function error() {
        if (options.startBoot) {
            options.startBoot();
        }
        removeVideo(options.pageId);
    }

    function clear() {
        stop()
        removeVideo(options.pageId);
    }

    /**
     * 销毁
     */
    function destroy() {
        video.removeEventListener('ended', clear, false)
        video.removeEventListener('error', error, false)
        video.removeEventListener('canplay', start, false)
        video.removeEventListener('webkitendfullscreen', stop, false)
        $videoWrap.remove()
        $videoNode = null
        $videoWrap = null
        container = null
    }

    video.addEventListener('ended', clear, false)
    video.addEventListener('error', error, false)
    video.addEventListener('canplay', start, false)
    video.addEventListener('webkitendfullscreen', stop, false)

    //////////////////////////
    ///2016.6.23
    //安卓ios需要直接调用play开始
    //移动端必须触发2次play
    ////////////////////////
    if (Xut.plat.isIOS || Xut.plat.isAndroid) {
        play()
    }

    container.append($videoWrap);

    return {
        play: play,
        stop: stop,
        close: destroy
    }
}


/**
 * html5 and flash player
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
const _FlareVideo = function(options) {
    let container = getContainer(options.container)
    let url = config.getVideoPath() + options.url
    let width = options.width
    let height = options.height

    let $videoWrap = createVideoWrap({
        type:'video-flare',
        width,
        height,
        top: options.top,
        left: options.left,
        zIndex: options.zIndex
    })

    let fv = $videoWrap.flareVideo({
        autoplay: true,
        flashSrc: 'lib/data/FlareVideo.swf'
    })
    fv.load([{
        src: url,
        type: 'video/mp4'
    }])

    container.append($videoWrap);

    return {
        play: function() {
            fv.play()
        },
        stop: function() {
            fv.pause()
        },
        close: function() {
            fv.remove()
            fv = null
            container = null
        }
    }
}


//浏览器平台
if (Xut.plat.isBrowser) {
    // 安卓妙妙学强制走h5
    // 由于原生H5控制条不显示的问题
    // 这里用插件播放ch
    if (Xut.plat.isAndroid) {
        VideoPlayer = _FlareVideo
    } else {
        //pc ios 浏览器打开方式
        VideoPlayer = _Video5
    }
} else {
    //apk ipa
    if (Xut.plat.isIOS || top.EduStoreClient) {
        //如果是ibooks模式
        if (Xut.IBooks.Enabled) {
            VideoPlayer = _FlareVideo
        } else {
            //如果是ios或读酷pc版则使用html5播放
            VideoPlayer = _Video5
        }
    } else if (Xut.plat.isAndroid) {
        if (window.MMXCONFIG) {
            // 安卓妙妙学强制走h5
            // 由于原生H5控制条不显示的问题
            // 这里用插件播放
            VideoPlayer = _FlareVideo
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
