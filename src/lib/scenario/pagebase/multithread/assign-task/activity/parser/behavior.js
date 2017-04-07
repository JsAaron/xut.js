import { createFn, parseJSON } from '../../../../../../util/index'

/**
 * 行为反馈
 *  content id = {
 *      弹动
 *      音频URl
 *  }
 *  2016.12.6
 *     增加，点击放大 zoom
 */
export function parseBehavior(pipeData) {
  let parameter
  let soundSrc
  let contentId
  let isButton
  let feedbackBehavior = pipeData.feedbackBehavior = {} //点击行为
  let zoomBehavior = pipeData.zoomBehavior = {} //缩放行为
  let hasZoom
  let chapterIndex = pipeData.chapterIndex
  let prefix
  let id

  _.each(pipeData.activitys, function(activitys) {
    if(activitys.parameter && (parameter = parseJSON(activitys.parameter))) {
      contentId = activitys.imageId;

      //视觉反馈
      if(isButton = parameter['isButton']) {
        if(isButton != 0) { //过滤数据的字符串类型
          createFn(feedbackBehavior, contentId, function() {
            this['isButton'] = true;
          })
        }
      }

      //音频行为
      if(soundSrc = parameter['behaviorSound']) {
        if(soundSrc != 0) {
          createFn(feedbackBehavior, contentId, function() {
            this['behaviorSound'] = soundSrc;
          })
        }
      }

      //点击图片放大
      if(hasZoom = parameter['zoom']) {
        if(hasZoom.length) {
          _.each(hasZoom, function(zoomData) {
            id = zoomData.content
            if(id) {
              //保存于节点node命名一致，方便快速查找
              prefix = "Content_" + chapterIndex + "_" + id
              createFn(zoomBehavior, prefix, function() {
                //缩放提示图片
                this['prompt'] = zoomData.prompt ? true : false
              })
            }
          })
        }
      }
    }
  })

}
