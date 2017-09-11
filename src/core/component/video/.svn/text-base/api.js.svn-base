import { initBox, playVideo, getPlayBox } from './manager'

/*
初始化视频
 */
export function initVideo() {
  initBox()
}

/**
 * 自动播放
 */
export function autoVideo(...arg) {
  playVideo(...arg)
}


/**
 * 手动播放
 */
export function triggerVideo(...arg) {
  playVideo(...arg)
}


/**
 * 清理移除指定页的视频
 */
export function removeVideo(chapterId) {
  const playBox = getPlayBox()
    //清理视频
  if (playBox && playBox[chapterId]) {
    for (let activityId in playBox[chapterId]) {
      playBox[chapterId][activityId].destroy();
      playBox[chapterId][activityId] = null
    }
    delete playBox[chapterId]
  }
}


/**
 * 清理全部视频
 */
export function clearVideo() {
  const playBox = getPlayBox()
  let flag = false //记录是否处理过销毁状态
  for (let chapterId in playBox) {
    for (let activityId in playBox[chapterId]) {
      playBox[chapterId][activityId].destroy();
      flag = true;
    }
  }
  initBox()
  return flag;
}
