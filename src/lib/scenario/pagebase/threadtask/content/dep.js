import { parseJSON } from '../../../../util/index'


export function createFn(obj, id, callback) {
  var cObj = obj[id];
  if(!cObj) {
    cObj = obj[id] = {};
  }
  callback.call(cObj);
}

/**
 * 转成数组格式
 * 分组
 *     主体部分内容
 *     页眉页脚内容
 * @param  {[type]} contentsFragment [description]
 * @return {[type]}                  [description]
 */
export function toArray(contentsFragment, headerFooterMode) {
  let bodyContent = []
  let headerFooterContent = []
  _.each(contentsFragment, function($node, key) {
    let id = key.split('_').pop()
    let state
    if(headerFooterMode && (state = headerFooterMode[id])) {
      if(state !== 'hide') { //隐藏抛弃的元素，不需要显示了
        headerFooterContent.push($node)
      }
    } else {
      bodyContent.push($node)
    }
  })

  return {
    bodyContent,
    headerFooterContent
  }
}

/**
 * 构建快速查询节点对象
 * 转成哈希方式
 * @return {[type]} [description]
 */
export function toObject(cachedContentStr) {
  var tempFragmentHash = {};
  _.each($(cachedContentStr), function(ele, index) {
    tempFragmentHash[ele.id] = ele;
  })
  return tempFragmentHash;
}

/**
 * 行为反馈
 *  content id = {
 *      弹动
 *      音频URl
 *  }
 *  2016.12.6
 *     增加，点击放大 zoom
 */
export function parseBehavior(data) {
  let parameter
  let soundSrc
  let contentId
  let isButton
  let feedbackBehavior = data.feedbackBehavior = {} //点击行为
  let zoomBehavior = data.zoomBehavior = {} //缩放行为
  let hasZoom
  let pid = data.pid
  let prefix
  let id

  _.each(data.activitys, function(activitys) {
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
              prefix = "Content_" + pid + "_" + id
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


/** 配置ID
 * @return {[type]} [description]
 */
export function autoUUID() {
  return 'autoRun-' + Math.random().toString(36).substring(2, 15)
}


