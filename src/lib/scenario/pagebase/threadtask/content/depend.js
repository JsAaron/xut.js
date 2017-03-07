import { parseJSON } from '../../../../util/index'
import ActivityClass from '../../../../component/activity/index'

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

/**
 * 给所有content节点绑定对应的事件与动画
 * 1 动画
 * 2 事件
 * 3 视觉差
 * 4 动画音频
 * 5 canvas动画
 * @return {[type]} [description]
 */
export function applyActivitys(data, contentDas, callback) {
  var compiler,
    $containsNode = data.$containsNode,
    eventRelated = data.eventRelated, //合集事件
    pid = data.pid,
    createActivitys = data.createActivitys,
    feedbackBehavior = data.feedbackBehavior, //反馈数据,跟事件相关
    pageBaseHooks = data.pageBaseHooks,
    pageId = data.chapterId;

  //如果有浮动对象,才需要计算偏移量
  //母版里面可能存在浮动或者不浮动的对象
  //那么在布局的时候想对点不一样
  //如果在浮动区域就取浮动初始值
  //否则就是默认的想对点0
  var getTransformOffset = function(ids, initTransformOffset) {
    return function(id) {
      //匹配是不是属于浮动对象
      if(ids.length && ids[id]) {
        //初始化容器布局的坐标
        return initTransformOffset
      }
      return 0
    }
  }(data.floatMaters.ids, data.getStyle.offset);

  //相关回调
  var relatedCallback = {

    /**
     * 绑定卷滚条钩子
     */
    'iscrollHooks': [],

    /**
     * contetn钩子回调
     */
    'contentsHooks': pageBaseHooks.contents,

    /**
     * 收集滑动事件
     * 针对mini
     * 2016.11.8
     */
    'swipeDelegateContents': pageBaseHooks.swipeDelegateContents
  }

  //相关数据
  var relatedData = {
    'floatMaters': data.floatMaters,
    'seasonId': data.chpaterData.seasonId,
    'pageId': pageId,
    'contentDas': contentDas, //所有的content数据合集
    'container': data.liRootNode,
    'seasonRelated': data.seasonRelated,
    'containerPrefix': data.containerPrefix,
    'nodes': data.nodes,
    'pageOffset': data.pageOffset,
    'createContentIds': data.createContentIds,
    'partContentRelated': data.partContentRelated,
    'getTransformOffset': getTransformOffset,
    'contentsFragment': data.contentsFragment,
    'contentHtmlBoxIds': data.contentHtmlBoxIds
  }

  /**
   * 继续下一个任务
   * @return {[type]} [description]
   */
  var nextTask = function() {
    //多事件合集处理pagebase
    if(eventRelated) {
      pageBaseHooks.eventBinding && pageBaseHooks.eventBinding(eventRelated)
    }
    //删除钩子
    delete relatedCallback.contentsHooks;
    callback(relatedCallback)
  }


  /**
   * 生成activty控制对象
   * @type {[type]}
   */
  var makeActivitys = function(compiler) {
    return function(callback) {
      var filters;
      var imageId = compiler['imageIds']; //父id
      var activity = compiler['activity'];
      var eventType = activity.eventType;
      var dragdropPara = activity.para1;
      var eventContentId = imageId;

      /**
       * 多事件数据过滤
       * 为了防止数据写入错误数据
       * 如果当前对象上有多事件的行为
       * 则默认的事件去掉
       * @type {[type]}
       */
      if(filters = eventRelated['eventContentId->' + imageId]) {
        _.each(filters, function(edata) {
          //id不需要
          //eventContentId = void 0;
          if(edata.eventType == activity.eventType) {
            //写入的是伪数据,此行为让多事件抽象接管
            eventType = dragdropPara = undefined
          }
        })
      }

      //需要绑定事件的数据
      var eventData = {
        'eventContentId': eventContentId,
        'eventType': eventType,
        'dragdropPara': dragdropPara,
        'feedbackBehavior': feedbackBehavior
      }

      var actdata = {
        'noticeComplete': callback, //监听完成
        'pageIndex': data.pageIndex,
        'canvasRelated': data.canvasRelated, //父类引用
        'id': imageId || autoUUID(),
        "type": 'Content',
        'pageId': pageId,
        'getStyle': data.getStyle,
        'activityId': activity._id,
        '$containsNode': $containsNode,
        'pageType': compiler['pageType'], //构建类型 page/master
        'seed': compiler['seed'], //动画表数据 or 视觉差表数据
        "pid": pid, //页码
        'eventData': eventData, //事件数据
        'relatedData': relatedData, //相关数据,所有子作用域Activity对象共享
        'relatedCallback': relatedCallback //相关回调
      }

      //注册引用
      pageBaseHooks.registerActivitys(new ActivityClass(actdata))
    }
  }

  //制作curry Activity闭包
  var fnsActivity = []
  while(compiler = createActivitys.shift()) {
    fnsActivity.push(makeActivitys(compiler))
  }

  // 递归解析 activitys
  var recursiveParse = function() {
    if(!fnsActivity.length) {
      nextTask()
      return
    }
    var first = fnsActivity.shift()
    first(function() {
      recursiveParse()
    })
  }
  recursiveParse()
}