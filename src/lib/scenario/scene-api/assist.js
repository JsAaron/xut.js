/********************************************
 * 场景API
 * 辅助对象
 ********************************************/

export function extendAssist(access, $globalEvent) {

  /**
   * 针对HOT的显示与隐藏
   * @param {[type]} activityId    [activity中的Id]
   * @param {[type]} start         [显示与隐藏]
   *     Xut.Assist.TriggerPoint(activityId, 'show')
         Xut.Assist.TriggerPoint(activityId, 'hide')
   */
  Xut.Assist.TriggerPoint = function (activityId, state) {
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
  Xut.Assist.TextFx = function (contentId) {
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
  ], function (apiName) {
    Xut.Assist[apiName] = function (pageType, activityId, outCallBack) {
      access(function (manager, pageType, activityId, outCallBack) {
        //数组
        if (_.isArray(activityId)) {
          //完成通知
          var markComplete = function () {
            var completeStatistics = activityId.length; //动画完成统计
            return function () {
              if (completeStatistics === 1) {
                outCallBack && outCallBack();
                markComplete = null;
              }
              completeStatistics--;
            }
          }();
          _.each(activityId, function (id) {
            manager.$$assistAppoint(id, $globalEvent.getVisualIndex(), markComplete, apiName);
          })
        } else {
          manager.$$assistAppoint(activityId, $globalEvent.getVisualIndex(), outCallBack, apiName);
        }
      }, pageType, activityId, outCallBack)
    }
  })


}
