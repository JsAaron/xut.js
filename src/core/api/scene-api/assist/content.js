//========================
// 控制content接口
//========================

export function extendContent(access, $$globalSwiper) {

  /**
   * 运行独立的content动画
   */
  Xut.Assist.RunContent = function(activityId, contentId) {
    if (!activityId && !contentId) {
      Xut.$Warn('content', '缺少运行RunContent接口的数据')
      return
    }
    //执行运行页面母版上activityId中为activityId的动画
    Xut.Assist.Run('page', activityId, null, contentId)
  }

  /**
   * 辅助对象的控制接口
   * 运行辅助动画
   * 辅助对象的activityId,或者合集activityId
   * Run
   * stop
   * Hide隐藏动画元素
   * 1 零件
   * 2 音频动画
   */
  _.each([
    "Run",
    "Stop",
    "Hide"
  ], function(apiName) {
    Xut.Assist[apiName] = function(pageType, activityId, outCallBack, contentId) {
      access(function(manager, pageType, activityId, outCallBack) {
        function assistAppoint(id, callback) {
          manager.assistAppoint(
            Number(id),
            $$globalSwiper.getVisualIndex(),
            callback,
            apiName,
            contentId
          );
        }

        //数组
        if (_.isArray(activityId)) {
          let markComplete = function() {
            let completeStatistics = activityId.length; //动画完成统计
            return function() {
              if (completeStatistics === 1) {
                outCallBack && outCallBack();
                markComplete = null;
              }
              completeStatistics--;
            }
          }();
          _.each(activityId, function(id) {
            assistAppoint(id, markComplete)
          })
        } else {
          assistAppoint(activityId, outCallBack)
        }
      }, pageType, activityId, outCallBack)
    }
  })


}
