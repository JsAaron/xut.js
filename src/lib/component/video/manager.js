/*
    视频和远程网页管理模块
*/
import { VideoClass } from './video'


//综合管理video, webpage
export class VideoManager {

    constructor() {
        this.pageBox = {}; //当前页面包含的视频数据
        this.playBox = {}; //播放过的视频数据 （播放集合）
    }

    /**
     * 自动播放
     * @param  {[type]} pageId     [description]
     * @param  {[type]} activityId [description]
     * @param  {[type]} container  [description]
     * @return {[type]}            [description]
     */
    autoPlay(pageId, activityId, container) {
        this.initVideo.apply(this, arguments);
    }

    /**
     * 手动播放
     * @param  {[type]} pageId     [description]
     * @param  {[type]} activityId [description]
     * @param  {[type]} container  [description]
     * @return {[type]}            [description]
     */
    trigger(pageId, activityId, container) {
        this.initVideo.apply(this, arguments);
    }


    /**
     * 触发视频
     * @param  {[type]} pageId     [description]
     * @param  {[type]} activityId [description]
     * @param  {[type]} container  [description]
     * @return {[type]}            [description]
     */
    initVideo(pageId, activityId, container) {
        //解析数据
        this.parseVideo(pageId, activityId);
        //调用播放
        this.loadVideo(pageId, activityId, container);
    }



    //处理重复数据
    // 1:pageBox能找到对应的 videoId
    // 2:重新查询数据
    parseVideo(pageId, activityId) {
        //复重
        if (this.checkRepeat(pageId, activityId)) {
            return;
        }
        var data = Xut.data.query('Video', activityId);
        //新的查询
        this.deployVideo(data, pageId, activityId);
    }


    /**
     * 检测数据是否存在
     * @param  {[type]} pageId     [description]
     * @param  {[type]} activityId [description]
     * @return {[type]}            [description]
     */
    checkRepeat(pageId, activityId) {
        var chapterData = this.pageBox[pageId];
        //如果能在pageBox找到对应的数据
        if (chapterData && chapterData[activityId]) {
            return true;
        }
        return false;
    }


    /**
     * 配置视频结构
     * @param  {[type]} data       [description]
     * @param  {[type]} pageId     [description]
     * @param  {[type]} activityId [description]
     * @return {[type]}            [description]
     */
    deployVideo(data, pageId, activityId) {
        var config = Xut.config
        var proportion = config.proportion
        var screenSize = config.screenSize

        var width = data.width * proportion.width || screenSize.width
        var height = data.height * proportion.height || screenSize.height
        var left = data.left * proportion.left || 0
        var top = data.top * proportion.top || 0

        //如果是安卓平台，视频插件去的分辨率
        //所以这里要把 可以区尺寸，转成分辨率
        if (Xut.plat.isAndroid) {
            //读库强制全屏
            if (window.DUKUCONFIG) {
                //获取分辨率
                var screen = window.screen
                width = screen.width
                height = screen.height
                top = 0
                left = 0
            } else {
                //正常的是按照屏幕尺寸的
                //这是安卓插件问题,按照分辨率计算
                var pixelRatio = window.devicePixelRatio
                width = width * pixelRatio
                height = height * pixelRatio
                left = left * pixelRatio
                top = top * pixelRatio
            }
        }

        var videoInfo = {
            'pageId': pageId,
            'videoId': activityId,
            'url': data.md5,
            'pageUrl': data.url,
            'left': left,
            'top': top,
            'width': width,
            'height': height,
            'padding': data.padding * proportion.left || 0,
            'zIndex': data.zIndex || 2147483647,
            'background': data.background,
            'category': data.category,
            'hyperlink': data.hyperlink
        };

        if (!_.isObject(this.pageBox[pageId])) {
            this.pageBox[pageId] = {};
        }

        this.pageBox[pageId][activityId] = videoInfo;
    }



    /**
     * 加载视频
     * @param  {[type]} pageId     [description]
     * @param  {[type]} activityId [description]
     * @param  {[type]} container  [description]
     * @return {[type]}            [description]
     */
    loadVideo(pageId, activityId, container) {
        var playBox = this.playBox,
            data = this.pageBox[pageId][activityId];

        //播放视频时停止所有的音频
        //视频的同时肯能存在音频
        // Xut.AudioManager.clearAudio();

        //this.beforePlayVideo(pageId,videoId)
        //search video cache
        if (playBox[pageId] && playBox[pageId][activityId]) {
            //console.log('*********cache*********');
            playBox[pageId][activityId].play();
        } else {
            //console.log('=========new=============');
            if (!_.isObject(playBox[pageId])) {
                playBox[pageId] = {};
            }
            //cache video object
            playBox[pageId][activityId] = new VideoClass(data, container);

        }

    }


    /**
     * 播放视频之前检查要停的视频
     * @param  {[type]} pageId     [description]
     * @param  {[type]} activityId [description]
     * @return {[type]}            [description]
     */
    beforePlayVideo(pageId, activityId) {

    }


    /**
     * 清理移除页的视频
     * @param  {[type]} pageId [description]
     * @return {[type]}        [description]
     */
    removeVideo(pageId) {
        var playBox = this.playBox,
            pageBox = this.pageBox;

        //清理视频
        if (playBox && playBox[pageId]) {
            for (var activityId in playBox[pageId]) {
                playBox[pageId][activityId].close();
            }
            delete this.playBox[pageId];
        }
        //清理数据
        if (pageBox && pageBox[pageId]) {
            delete this.pageBox[pageId];
        }
    }


    /**
     * 清理全部视频
     * @return {[type]} [description]
     */
    clearVideo() {
        var playBox = this.playBox,
            flag = false; //记录是否处理过销毁状态

        for (var pageId in playBox) {
            for (var activityId in playBox[pageId]) {
                playBox[pageId][activityId].close();
                flag = true;
            }
        }

        this.playBox = {};
        this.pageBox = {};
        return flag;
    }


    /**
     * 离开页面
     * @param  {[type]} pageId [description]
     * @return {[type]}        [description]
     */
    leavePage(pageId) {
        var playBox = this.playBox;
        if (playBox && playBox[pageId]) {
            for (var activityId in playBox[pageId]) {
                playBox[pageId][activityId].stop();
            }
        }
    }

}
