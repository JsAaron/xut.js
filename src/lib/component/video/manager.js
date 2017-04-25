/*
    视频和远程网页管理模块
*/
import { VideoClass } from './video'
import { config } from '../../config/index'
import { setProportion, hash } from '../../util/index'

let dataBox
let playBox

/*
初始化盒子
1 当前页面包含的视频数据
2 播放过的视频数据 （播放集合)
 */
const initBox = () => {
  dataBox = hash()
  playBox = hash()
}


/**
 * 配置视频结构
 */
const deployVideo = (videoData, options) => {

  const { chapterId, activityId, pageIndex, pageType } = options

  const getStyle = Xut.Presentation.GetPageStyle(pageIndex)
  const layerSize = setProportion({
    getStyle: getStyle,
    proportion: getStyle.pageProportion,
    width: videoData.width || config.visualSize.width,
    height: videoData.height || config.visualSize.height,
    left: videoData.left,
    top: videoData.top,
    padding: videoData.padding
  })

  const videoInfo = _.extend(layerSize, {
    pageType,
    chapterId,
    isfloat: videoData.isfloat, //是否浮动
    'videoId': activityId,
    'url': videoData.md5,
    'pageUrl': videoData.url,
    'zIndex': videoData.zIndex || 2147483647,
    'background': videoData.background,
    'category': videoData.category,
    'hyperlink': videoData.hyperlink
  })

  if (!_.isObject(dataBox[chapterId])) {
    dataBox[chapterId] = {};
  }

  dataBox[chapterId][activityId] = videoInfo;
}

/**
 * 检测数据是否已经装配过
 * 缓存
 */
const hasAssembly = (chapterId, activityId) => {
  const chapterData = dataBox[chapterId];
  //如果能在dataBox找到对应的数据
  if (chapterData && chapterData[activityId]) {
    return true;
  }
  return false;
}

/*
装配数据
1 去重复
2 组合新数据
 */
const assemblyData = (options) => {
  //复重
  if (hasAssembly(options.chapterId, options.activityId)) {
    return
  }
  //新的查询
  const data = Xut.data.query('Video', options.activityId)
  deployVideo(data, options)
}

/**
 * 加载视频
 */
const createVideo = (options) => {
  const { chapterId, activityId, rootNode } = options
  /*创建数据*/
  const createData = dataBox[chapterId][activityId]
    /*如果已经存在，直接调用播放*/
  if (playBox[chapterId] && playBox[chapterId][activityId]) {
    playBox[chapterId][activityId].play()
  } else {
    /*创建新的*/
    if (!_.isObject(playBox[chapterId])) {
      playBox[chapterId] = {}
    }
    playBox[chapterId][activityId] = new VideoClass(createData, rootNode)
  }
}

/**
 * 初始化视频
 */
const initVideo = (options) => {
  //解析数据
  assemblyData(options);
  //调用播放
  createVideo(options);
}


/**
 * 是否有视频对象
 * @return {Boolean} [description]
 */
function hasVideoObj(chapterId, activityId) {
  if (playBox[chapterId]) {
    return playBox[chapterId][activityId]
  }
}

/*播放视频
1 存在实例
2 重新创建
{ chapterId, activityId, rootNode, pageIndex, pageType }
*/
function playVideo(options) {
  let videoObj = hasVideoObj(options.chapterId, options.activityId)
  if (videoObj) {
    videoObj.play()
  } else {
    initVideo(options)
  }
}

function getDataBox() {
  return dataBox
}

function getPlayBox() {
  return playBox
}

export {
  initBox,
  playVideo,
  getPlayBox,
  getDataBox
}
