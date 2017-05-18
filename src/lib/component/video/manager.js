/*
    视频和远程网页管理模块
*/
import { VideoClass } from './video'
import { config } from '../../config/index'
import { setProportion, hash } from '../../util/index'

let playBox

/*
初始化盒子
1 当前页面包含的视频数据
2 播放过的视频数据 （播放集合)
 */
const initBox = () => {
  playBox = hash()
}


/**
 * 配置视频结构
 */
const deployVideo = (videoData, options, columnData) => {
  const palyData = {}
  const { chapterId, activityId, pageIndex, pageType } = options

  if (columnData) {
    /*width, height, top, left, zIndex, url*/
    _.extend(palyData, {
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      zIndex: 1,
      chapterId,
      container: columnData.container,
      url: columnData.fileName,
      isColumn: columnData.isColumn,
      position: columnData.position,
      category: 'video'
    })

  } else {
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
    _.extend(palyData, layerSize, {
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
  }

  return palyData
}


/*
装配数据
 */
const assemblyData = (options) => {
  /*column处理*/
  if (options.columnData && options.columnData.isColumn) {
    return deployVideo({}, options, options.columnData)
  } else {
    //新的查询
    const videoData = Xut.data.query('Video', options.activityId)
    return deployVideo(videoData, options)
  }
}

/**
 * 加载视频
 */
const createVideo = (options, videoData) => {
  const { chapterId, activityId, rootNode } = options

  /*如果已经存在，直接调用播放*/
  if (playBox[chapterId] && playBox[chapterId][activityId]) {
    playBox[chapterId][activityId].play()
  } else {
    if (!_.isObject(playBox[chapterId])) {
      playBox[chapterId] = {}
    }
    if (rootNode) {
      videoData.container = rootNode
    }
    playBox[chapterId][activityId] = new VideoClass(videoData)
  }
}

/**
 * 初始化视频
 */
const initVideo = (options) => {
  //解析数据
  const videoData = assemblyData(options);
  //调用播放
  createVideo(options, videoData);
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


function getPlayBox() {
  return playBox
}

export {
  initBox,
  playVideo,
  getPlayBox
}
