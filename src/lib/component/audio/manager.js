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
import { SEASON } from './audio-type'
import { getMediaData } from './api'
import { audioPlayer } from './player'


/**
 * 容器合集
 * 1 dataBox 当前待播放的热点音频
 * 2 playBox 播放中的热点音频集合
 */
//[type][pageId][queryId]
let dataBox, playBox

const initBox = () => {
  dataBox = hash()
  playBox = hash()
}

/**
 * 获取父容器
 * @return {[type]} [description]
 */
const getParentNode = (subtitles, pageId, queryId) => {
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
    _.each(subtitles, function (data) {
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
 * 检测数据是否已经装配过
 * 缓存
 */
const hasAssembly = (pageId, queryId, type) => {
  var pBox = dataBox[type];
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
const combination = (data, pageId, queryId, type, eleName) => {
  let subtitles
  if (!dataBox[type]) {
    dataBox[type] = hash();
  }
  if (!dataBox[type][pageId]) {
    dataBox[type][pageId] = hash();
  }
  //有字幕处理
  if (data.theTitle) {
    subtitles = parseJSON(data.theTitle);
  }
  //配置音频结构
  return dataBox[type][pageId][queryId] = {
    'trackId': data.track, //音轨
    'url': data.md5, //音频名字
    'subtitles': subtitles,
    'audioId': queryId,
    'data': data
  }
}


const deployAudio = (data, pageId, queryId, type, actionData) => {
  //新的查询
  const ret = combination(data, pageId, queryId, type, actionData);
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


/**
 * 装配音频数据
 * @param  {int} pageId    页面id或节的分组id
 * @param  {int} queryId   查询id,支持activityId,audioId
 * @param  {string} type   音频来源类型[动画音频,节音频,热点音频]
 */
const assemblyData = (pageId, queryId, type, actionData) => {
  //避免复重查询
  if (hasAssembly(pageId, queryId, type)) {
    return false;
  }
  //解析合集数据
  const data = getMediaData(type, queryId);

  //存在音频文件
  if (data && data.md5) {
    deployAudio(data, pageId, queryId, type, actionData)
  }
}


/**
 * 检查要打断的音频
 * 不打断返回true,否则返回false
 */
const checkBreakAudio = (type, pageId, queryId, auidoData) => {
  const playObj = playBox[type][pageId][queryId]
  const trackId = auidoData.trackId
  const _trackId = playObj.trackId

  //如果是节音频，且地址相同，则不打断
  if (type == SEASON && playObj.url == auidoData.url) {
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
const preCheck = (auidoData) => {
  var t, p, q, seasonAudio = null;
  for (t in playBox) {
    for (p in playBox[t]) {
      for (q in playBox[t][p]) {
        if (checkBreakAudio(t, p, q, auidoData)) {
          seasonAudio = playBox[t][p][q];
        }
      }
    }
  }
  return seasonAudio;
}

/*填充box,构建播放列表*/
const fillBox = function (pageId, type) {
  if (!playBox[type]) {
    playBox[type] = hash();
  }
  if (!playBox[type][pageId]) {
    playBox[type][pageId] = hash();
  }
}

/*创建音频*/
const playAudio = (pageId, queryId, type) => {
  let subtitleNode

  //找到页面对应的音频
  //类型=》页面=》指定音频Id
  let audioData = dataBox[type][pageId][queryId];
  //检测
  let seasonAudio = preCheck(audioData);

  //构建播放列表
  fillBox(pageId, type)

  //假如有字幕信息
  //找到对应的文档对象
  if (audioData.subtitles) {
    subtitleNode = getParentNode(audioData.subtitles, pageId, queryId);
  }

  //播放完成处理
  audioData.innerCallback = (audio) => {
    if (playBox[type] && playBox[type][pageId] && playBox[type][pageId][queryId]) {
      audio.end();
      delete playBox[type][pageId][queryId];
    }
  }

  playBox[type][pageId][queryId] = seasonAudio || new audioPlayer(audioData, subtitleNode)

}


/*交互点击*/
const tiggerAudio = (pageId, queryId, type) => {
  let playObj, status;
  if (playBox[type] && playBox[type][pageId] && playBox[type][pageId][queryId]) {
    playObj = playBox[type][pageId][queryId];
    status = playObj.audio ? playObj.status : null;
  }

  switch (status) {
    case 'playing':
      playObj.pause()
      break;
    case 'paused':
      playObj.play()
      break;
    default:
      playAudio(pageId, queryId, type)
      break;
  }
}


/**
 * 加载音频对象
 */
const loadAudio = ({
  pageId,
  queryId,
  type,
  action,
  data
}) => {

  pageId = Number(pageId)
  queryId = Number(queryId)

  /*缓存数据*/
  assemblyData(pageId, queryId, type, data);

  /*手动触发的热点,这种比较特别，手动点击可以切换状态*/
  if (type === 'hot' && action == 'trigger') {
    tiggerAudio(pageId, queryId, type);
  } else {
    playAudio(pageId, queryId, type)
  }
}


/**
 * 清理全部音频
 */
const removeAudio = () => {
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


function getPlayBox() {
  return playBox
}

export {
  initBox,
  getPlayBox,
  loadAudio,
  removeAudio
}
