/**
 * 音频说明：
 *  一个音频播放有2种情况：
 *       1、自动播放该音频（autoPlay == true）
 *       2、手动播放该音频（点击触发点）
 *
 *   一个音频被停止有3种情况：
 *       1、手动暂停（点击触发点）
 *       2、同轨道的其他音频开始播放
 *       3、0轨道的音频开始播放
 *   特殊情况：
 *       0轨道的音频播放时，可以停止所有其他轨道的音频
 *       其他轨道的音频播放时，可以停止0轨道的音频
 *
 *   基于上面的条件，补充提示：
 *       同轨道只允许有一个自动播放的音频
 *       如果0轨道音频为自动播放，则其他轨道不允许有自动播放音频
 *       反之亦然，其他轨道有自动播放音频，则0轨道不允许有自动播放音频
 *
 *    ===================================================================================================
 *   该版本说明：
 *   一个音频被打断之后，就被销毁，不会在后续恢复播放，而只会重头开始播放
 *
 *  2014.12.1 版本升级
 *  原来只有热点音频，现在多了动画音频和节音频，所以音频管理需要调整,
 *  有两个要注意的地方：
 *  1. 由于在IOS上,new Audio操作会产生新的进程，且不释放，所以同一个音轨只新建一个音频实例
 *     为了防止交互点击时音频播放混乱，要先清除同音轨的上一个音频
 *  2. 节音频可以跨节共用，如,1,2,3节共用一个音频，那么在这些节之间跳转时不打断
 *
 */

import { parseJSON, hash } from '../../util/index'
import { audioPlayer } from './audio'
import { clearVideo } from '../video/manager'

//动作标示
let ACTIVIT = 'hot' //热点音频
let ANIMATE = 'content' //动画音频
let SEASON = 'season' //节音频

/**
 * 容器合集
 * 1 pageBox 当前待播放的热点音频
 * 2 playBox 播放中的热点音频集合
 */
//[type][pageId][queryId]
var pageBox, playBox

let initBox = () => {
    pageBox = hash()

    //[type][pageId][queryId]
    playBox = hash()
}

initBox()


/**
 * 解析数据
 * @param  {[type]} type    [description]
 * @param  {[type]} queryId [description]
 * @return {[type]}         [description]
 */
let parseData = (type, queryId) => {
    var data;
    switch (type) {
        case ANIMATE:
            data = Xut.data.query('Video', queryId, true);
            break;
        case SEASON:
            data = Xut.data.query('Video', queryId, true);
            break;
        default:
            data = Xut.data.query('Video', queryId);
            break;
    }
    return data;
}

/**
 * 获取父容器
 * @return {[type]} [description]
 */
let getParentDom = (subtitles, pageId, queryId) => {
    //字幕数据
    var parentDoms = hash();
    var ancestorDoms = hash();
    var contentsFragment;
    var dom;
    var pageIndex = (pageId - 1);
    if (subtitles) {
        //获取文档节点
        contentsFragment = Xut.Contents.contentsFragment[pageId];

        //如果maskId大于9000默认为处理
        var isMask = pageId > 9000;
        if (isMask) {
            //指定页码编号
            pageIndex = Xut.Presentation.GetPageIndex();
        }

        //找到对应的节点
        _.each(subtitles, function(data) {
            //'Content_0_1' 规则 类型_页码（0开始）_id
            if (!parentDoms[data.id]) {
                dom = contentsFragment['Content_' + pageIndex + '_' + data.id];
                ancestorDoms[data.id] = dom;
                var $dom = $(dom);
                if ($dom.length) {
                    var _div = $dom.find('div').last();
                    if (_div.length) {
                        parentDoms[data.id] = _div[0]
                    }
                }
            }
        })
    }

    return {
        parents: parentDoms,
        ancestors: ancestorDoms
    };
}

/**
 * 检测数据是否存在
 * @return {[type]}         [description]
 */
let checkRepeat = (pageId, queryId, type) => {
    var pBox = pageBox[type];
    if (pBox && pBox[pageId] && pBox[pageId][queryId]) {
        return true;
    }
    return false;
}

/**
 * 组合热点音频数据结构
 * data, pageId, queryId, type
 * 数据，页码编号，videoId, 查询的类型
 * @return {[type]}         [description]
 */
let combination = (data, pageId, queryId, type, eleName) => {
    var tempDoms;
    if (!pageBox[type]) {
        pageBox[type] = hash();
    }
    if (!pageBox[type][pageId]) {
        pageBox[type][pageId] = hash();
    }
    //有字幕处理
    if (data.theTitle) {
        var subtitles = parseJSON(data.theTitle);
    }
    //配置音频结构
    return pageBox[type][pageId][queryId] = {
        'trackId': data.track, //音轨
        'url': data.md5, //音频名字
        'subtitles': subtitles,
        'audioId': queryId,
        'data': data
    }
}


/**
 * 装配音频数据
 * @param  {int} pageId    页面id或节的分组id
 * @param  {int} queryId   查询id,支持activityId,audioId
 * @param  {string} type   音频来源类型[动画音频,节音频,热点音频]
 */
let deployAudio = (pageId, queryId, type, actionData) => {
    //避免复重查询
    if (checkRepeat(pageId, queryId, type)) {
        return false;
    }
    //解析合集数据
    var data = parseData(type, queryId);
    //存在音频文件
    if (data && data.md5) {
        //新的查询
        var ret = combination(data, pageId, queryId, type, actionData);
        //混入新的动作数据
        //2015.9.24
        //音频替换图片
        //触发动画
        if (actionData) {
            _.extend(ret, actionData, {
                action: true //快速判断存在动作数据
            })
        }
    }
}



/**
 * 检查要打断的音频
 * @param  {[type]} type    音频类型
 * @param  {[type]} pageId  [description]
 * @param  {[type]} queryId [description]
 * @param  {[type]} pageBox [description]
 * @return {boolen}         不打断返回true,否则返回false
 */
let checkBreakAudio = (type, pageId, queryId, pageBox) => {
    var playObj = playBox[type][pageId][queryId],
        trackId = pageBox.trackId,
        _trackId = playObj.trackId;

    //如果是节音频，且地址相同，则不打断
    if (type == SEASON && playObj.url == pageBox.url) {
        return true;
    }

    //如果要用零音轨||零音轨有音乐在播||两音轨相同
    //则打断
    if (trackId == 0 || _trackId == 0 || trackId == _trackId) {
        playObj.end();
        delete playBox[type][pageId][queryId];
    }
    return false;
}


/**
 * 播放音频之前检查
 * @param  {int} pageId    [description]
 * @param  {int} queryId    查询id
 * @param  {string} type    决定video表按哪个字段查询
 * @return {object}         音频对象/不存在为null
 */
let preCheck = (pageId, queryId, type) => {
    var t, p, q,
        playObj = pageBox[type][pageId][queryId],
        seasonAudio = null;
    for (t in playBox) {
        for (p in playBox[t]) {
            for (q in playBox[t][p]) {
                if (checkBreakAudio(t, p, q, playObj)) {
                    seasonAudio = playBox[t][p][q];
                }
            }
        }
    }
    return seasonAudio;
}


/**
 * 加载音频对象
 * @return {[type]}         [description]
 */
let loadAudio = (pageId, queryId, type) => {

    //找到页面对应的音频
    //类型=》页面=》指定音频Id
    var pageObj = pageBox[type][pageId][queryId];
    //检测
    var seAudio = preCheck(pageId, queryId, type);

    //播放音频时关掉视频
    // clearVideo()

    //构建播放列表
    if (!playBox[type]) {
        playBox[type] = hash();
    }
    if (!playBox[type][pageId]) {
        playBox[type][pageId] = hash();
    }
    //假如有字幕信息
    //找到对应的文档对象
    if (pageObj.subtitles) {
        var tempDoms = getParentDom(pageObj.subtitles, pageId, queryId);
    }

    //播放完成处理
    pageObj.innerCallback = (audio) => {
        if (playBox[type] && playBox[type][pageId] && playBox[type][pageId][queryId]) {
            audio.end();
            delete playBox[type][pageId][queryId];
        }
    }

    //存入播放对象池
    playBox[type][pageId][queryId] = seAudio || new audioPlayer(pageObj, tempDoms)
}


/**
 * 交互点击
 * @param  {int} pageId     [description]
 * @param  {int} queryId    [description]
 * @param  {string} type    ACTIVIT
 * @return {[type]}         [description]
 */
let loadTiggerAudio = (pageId, queryId, type) => {
    var playObj, status;
    if (playBox[type] && playBox[type][pageId] && playBox[type][pageId][queryId]) {
        playObj = playBox[type][pageId][queryId];
        status = playObj.audio ? playObj.status : null;
    }
    switch (status) {
        case 'playing':
            playObj.pause();
            break;
        case 'paused':
            playObj.play();
            break;
        default:
            loadAudio(pageId, queryId, type);
            break;
    }
}


/**
 * 清理全部音频
 * @return {[type]} [description]
 */
let removeAudio = () => {
    var t, p, a;
    for (t in playBox) {
        for (p in playBox[t]) {
            for (a in playBox[t][p]) {
                playBox[t][p][a].end();
            }
        }
    }
    initBox()
}



///////////////////
//1 独立音频处理, 音轨/跨页面 //
//2 动画音频,跟动画一起播放与销毁
///////////////////

/**
 * 自动播放触发接口
 * @param  {[type]} pageId     [description]
 * @param  {[type]} activityId [description]
 * @param  {[type]} actionData [description]
 * @return {[type]}            [description]
 */
export function autoAudio(pageId, activityId, actionData) {
    deployAudio(pageId, activityId, ACTIVIT, actionData);
    loadAudio(pageId, activityId, ACTIVIT);
}


/**
 * 手动触发
 * @param  {[type]} pageId     [description]
 * @param  {[type]} activityId [description]
 * @param  {[type]} actionData [description]
 * @return {[type]}            [description]
 */
export function triggerAudio(pageId, activityId, actionData) {
    deployAudio(pageId, activityId, ACTIVIT, actionData);
    loadTiggerAudio(pageId, activityId, ACTIVIT);
}



/**
 * 节音频触发接口
 * @param  {[type]} seasonAudioId [description]
 * @param  {[type]} audioId       [description]
 * @return {[type]}               [description]
 */
export function seasonAudio(seasonAudioId, audioId) {
    deployAudio(seasonAudioId, audioId, SEASON);
    loadAudio(seasonAudioId, audioId, SEASON);
}


/**
 * 挂起音频
 * @return {[type]} [description]
 */
export function hangUpAudio() {
    var t, p, a;
    for (t in playBox) {
        for (p in playBox[t]) {
            for (a in playBox[t][p]) {
                playBox[t][p][a].pause();
            }
        }
    }
}


/**
 * 动画音频触发接口
 * @param  {[type]} pageId  [description]
 * @param  {[type]} audioId [description]
 * @return {[type]}         [description]
 */
export function createContentAudio(pageId, audioId) {
    deployAudio(pageId, audioId, ANIMATE);
    loadAudio(pageId, audioId, ANIMATE);
}


/**
 * 销毁动画音频
 * @param  {[type]} pageId [description]
 * @return {[type]}        [description]
 */
export function clearContentAudio(pageId) {
    if (!playBox[ANIMATE] || !playBox[ANIMATE][pageId]) {
        return false;
    }
    var playObj = playBox[ANIMATE][pageId];
    if (playObj) {
        for (var i in playObj) {
            playObj[i].end();
            delete playBox[ANIMATE][pageId][i];
        }
    }
}

/**
 * 清理音频
 * @param  {[type]} pageId [description]
 * @return {[type]}        [description]
 */
export function clearAudio(pageId) {
    if (pageId) { //如果只跳槽关闭动画音频
        clearContentAudio(pageId)
    } else {
        removeAudio() //多场景模式,不处理跨页面
    }
}

