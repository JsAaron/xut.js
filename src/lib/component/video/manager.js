/*
    视频和远程网页管理模块
*/
import { VideoClass } from './video'
import { config } from '../../config/index'

let pageBox
let playBox

let initBox = () => {
    pageBox = {} //当前页面包含的视频数据
    playBox = {}//播放过的视频数据 （播放集合)
}

initBox()


/**
 * 配置视频结构
 * @param  {[type]} data       [description]
 * @param  {[type]} pageId     [description]
 * @param  {[type]} activityId [description]
 * @return {[type]}            [description]
 */
let deployVideo = (data, pageId, activityId) => {

    let proportion = config.proportion

    let videoInfo = {
        'pageId': pageId,
        'videoId': activityId,
        'url': data.md5,
        'pageUrl': data.url,
        'left': data.left * proportion.left || 0,
        'top': data.top * proportion.top || 0,
        'width': data.width * proportion.width || config.viewSize.width,
        'height': data.height * proportion.height || config.viewSize.height,
        'padding': data.padding * proportion.left || 0,
        'zIndex': data.zIndex || 2147483647,
        'background': data.background,
        'category': data.category,
        'hyperlink': data.hyperlink
    };

    if (!_.isObject(pageBox[pageId])) {
        pageBox[pageId] = {};
    }

    pageBox[pageId][activityId] = videoInfo;
}




/**
 * 检测数据是否存在
 * @param  {[type]} pageId     [description]
 * @param  {[type]} activityId [description]
 * @return {[type]}            [description]
 */
let checkRepeat = (pageId, activityId) => {
    var chapterData = pageBox[pageId];
    //如果能在pageBox找到对应的数据
    if (chapterData && chapterData[activityId]) {
        return true;
    }
    return false;
}



//处理重复数据
// 1:pageBox能找到对应的 videoId
// 2:重新查询数据
let parseVideo = (pageId, activityId) => {
    //复重
    if (checkRepeat(pageId, activityId)) {
        return
    }
    //新的查询
    let data = Xut.data.query('Video', activityId)
    deployVideo(data, pageId, activityId)
}



/**
 * 加载视频
 * @param  {[type]} pageId     [description]
 * @param  {[type]} activityId [description]
 * @param  {[type]} container  [description]
 * @return {[type]}            [description]
 */
let loadVideo = (pageId, activityId, container) => {
    let data = pageBox[pageId][activityId]

    //search video cache
    if (playBox[pageId] && playBox[pageId][activityId]) {
        //console.log('*********cache*********');
        playBox[pageId][activityId].play()
    } else {
        //console.log('=========new=============');
        if (!_.isObject(playBox[pageId])) {
            playBox[pageId] = {};
        }
        //cache video object
        playBox[pageId][activityId] = new VideoClass(data, container)
    }
}


/**
 * 触发视频
 * @param  {[type]} pageId     [description]
 * @param  {[type]} activityId [description]
 * @param  {[type]} container  [description]
 * @return {[type]}            [description]
 */
let initVideo = (pageId, activityId, container) => {
    //解析数据
    parseVideo(pageId, activityId);
    //调用播放
    loadVideo(pageId, activityId, container);
}


/**
 * 自动播放
 * @param  {[type]} pageId     [description]
 * @param  {[type]} activityId [description]
 * @param  {[type]} container  [description]
 * @return {[type]}            [description]
 */
export function autoVideo(pageId, activityId, container) {
    initVideo(pageId, activityId, container)
}


/**
 * 手动播放
 * @param  {[type]} pageId     [description]
 * @param  {[type]} activityId [description]
 * @param  {[type]} container  [description]
 * @return {[type]}            [description]
 */
export function triggerVideo(pageId, activityId, container) {
    initVideo(pageId, activityId, container)
}


/**
 * 清理移除页的视频
 * @param  {[type]} pageId [description]
 * @return {[type]}        [description]
 */
export function removeVideo(pageId) {
    //清理视频
    if (playBox && playBox[pageId]) {
        for (let activityId in playBox[pageId]) {
            playBox[pageId][activityId].close();
        }
        delete playBox[pageId]
    }
    //清理数据
    if (pageBox && pageBox[pageId]) {
        delete pageBox[pageId]
    }
}


/**
 * 清理全部视频
 * @return {[type]} [description]
 */
export function clearVideo() {
    let flag = false //记录是否处理过销毁状态
    for (let pageId in playBox) {
        for (let activityId in playBox[pageId]) {
            playBox[pageId][activityId].close();
            flag = true;
        }
    }
    initBox()
    return flag;
}


/**
 * 挂起视频
 * @param  {[type]} pageId [description]
 * @return {[type]}        [description]
 */
export function hangUpVideo(pageId) {
    for (let pageId in playBox) {
        for (let activityId in playBox[pageId]) {
            playBox[pageId][activityId].stop();
        }
    }
}
