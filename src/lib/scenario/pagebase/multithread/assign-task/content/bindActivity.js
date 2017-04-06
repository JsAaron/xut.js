import ActivityClass from '../../../../../component/activity/index'


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
export function bindActivity(pipeData, contentDataset, callback) {
  var compiler,
    $containsNode = pipeData.$containsNode,
    eventRelated = pipeData.eventRelated, //合集事件
    chapterIndex = pipeData.chapterIndex,
    createActivitys = pipeData.createActivitys,
    feedbackBehavior = pipeData.feedbackBehavior, //反馈数据,跟事件相关
    pageBaseHooks = pipeData.pageBaseHooks,
    pageId = pipeData.chapterId;

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
  }(pipeData.floatMaters.ids, pipeData.getStyle.offset);

  //相关回调
  const relatedCallback = {
    /*绑定卷滚条钩子*/
    'iscrollHooks': [],
    /*contetn钩子回调*/
    'contentsHooks': pageBaseHooks.contents,
    /**
     * 收集滑动事件
     * 针对mini
     * 2016.11.8
     */
    'swipeDelegateContents': pageBaseHooks.swipeDelegateContents
  }

  //相关数据
  const relatedData = {
    'floatMaters': pipeData.floatMaters,
    'seasonId': pipeData.chpaterData.seasonId,
    'pageId': pageId,
    'contentDataset': contentDataset, //所有的content数据合集
    'container': pipeData.liRootNode,
    'seasonRelated': pipeData.seasonRelated,
    'containerPrefix': pipeData.containerPrefix,
    'nodes': pipeData.nodes,
    'pageOffset': pipeData.pageOffset,
    'createContentIds': pipeData.createContentIds,
    'partContentRelated': pipeData.partContentRelated,
    'getTransformOffset': getTransformOffset,
    'contentsFragment': pipeData.contentsFragment,
    'contentHtmlBoxIds': pipeData.contentHtmlBoxIds
  }

  /**
   * 继续下一个任务
   * @return {[type]} [description]
   */
  const nextTask = function() {
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
  const makeActivitys = function(compiler) {
    return function(callback) {
      var filters;
      var imageId = compiler.imageIds; //父id
      var activity = compiler.activity;
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
      const eventData = { eventContentId, eventType, dragdropPara, feedbackBehavior }

      const actdata = {
        'noticeComplete': callback, //监听完成
        'pageIndex': pipeData.pageIndex,
        'canvasRelated': pipeData.canvasRelated, //父类引用
        'id': imageId || autoUUID(),
        "type": 'Content',
        'pageId': pageId,
        'getStyle': pipeData.getStyle,
        'activityId': activity._id,
        '$containsNode': $containsNode,
        'pageType': compiler.pageType, //构建类型 page/master
        'dataset': compiler.dataset, //动画表数据 or 视觉差表数据
        "chapterIndex": chapterIndex, //页码
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
