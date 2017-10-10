/********************************************
 * 场景API
 * 辅助对象
 ********************************************/

export function extendAssist(access, $$globalSwiper) {

  /**
   * 标记讨论区状态
   * @type {Boolean}
   */
  Xut.Assist.ForumStatus = false


  function setForum(context, fn) {
    if (context[fn]) {
      //从1开始算
      const pageIndex = Xut.Presentation.GetPageIndex() + 1
      Xut.Assist.ForumStatus = true
      context[fn](pageIndex)
      return true
    }
  }

  /**
   * 针对秒秒学的api
   * 打开讨论区
   */
  Xut.Assist.ForumOpen = function() {
    //如果存在IFRAME优先找最外层的
    //否则就找当前层
    if (setForum(top, 'GolbalForumOpen')) {
      return
    }
    setForum(window, 'GolbalForumOpen')
  }


  /**
   * 针对秒秒学的api
   * 关闭讨论区
   */
  Xut.Assist.ForumClose = function() {
    //如果存在IFRAME优先找最外层的
    //否则就找当前层
    if (setForum(top, 'GolbalForumClose')) {
      return
    }
    setForum(window, 'GolbalForumClose')
  }


  /**
   * 滤镜渐变动画
   * content id
   * 滤镜样式名
   * 1  ".filter-blur-a2"
   * 优先查找page层，后查找master层
   */
  Xut.Assist.FilterGradient = function(contentId, filterClassName) {
    if (contentId && filterClassName) {
      let contentObj = Xut.Contents.Get('page', contentId)
      if (!contentObj) {
        contentObj = Xut.Contents.Get('master', contentId)
        if (contentObj) return
      }
      if (filterClassName.length) {
        filterClassName = filterClassName.join(' ')
      }
      contentObj.$contentNode.addClass(filterClassName)
    }
  }


  /**
   * 针对HOT的显示与隐藏
   * @param {[type]} activityId    [activity中的Id]
   * @param {[type]} start         [显示与隐藏]
   *     Xut.Assist.TriggerPoint(activityId, 'show')
         Xut.Assist.TriggerPoint(activityId, 'hide')
   */
  Xut.Assist.TriggerPoint = function(activityId, state) {
    const data = Xut.data.query('Activity', activityId);
    if (data) {
      const $dom = $(`#${data.actType}_${data._id}`)
      if ($dom.length) {
        if (state === 'show') {
          Xut.nextTick(() => {
            $dom.css('visibility', 'visible')
          })
        }
        if (state === 'hide') {
          $dom.css('visibility', 'hidden')
        }
      }
    }
  }


  /**
   * 文字动画
   * @param {[type]} contentId [description]
   */
  Xut.Assist.TextFx = function(contentId) {
    const pageObj = Xut.Presentation.GetPageBase()
    const fxObj = pageObj.getLetterObjs(contentId)
    if (fxObj) {
      fxObj.play()
    }
  }

  /**
   * 辅助对象的控制接口
   * 运行辅助动画
   * 辅助对象的activityId,或者合集activityId
   * Run
   * stop
   * 1 零件
   * 2 音频动画
   */
  _.each([
    "Run",
    "Stop"
  ], function(apiName) {
    Xut.Assist[apiName] = function(pageType, activityId, outCallBack) {
      access(function(manager, pageType, activityId, outCallBack) {
        //数组
        if (_.isArray(activityId)) {
          //完成通知
          var markComplete = function() {
            var completeStatistics = activityId.length; //动画完成统计
            return function() {
              if (completeStatistics === 1) {
                outCallBack && outCallBack();
                markComplete = null;
              }
              completeStatistics--;
            }
          }();
          _.each(activityId, function(id) {
            manager.assistAppoint(id, $$globalSwiper.getVisualIndex(), markComplete, apiName);
          })
        } else {
          manager.assistAppoint(activityId, $$globalSwiper.getVisualIndex(), outCallBack, apiName);
        }
      }, pageType, activityId, outCallBack)
    }
  })


}
