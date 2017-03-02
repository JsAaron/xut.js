/********************************************
 * 场景API
 * 辅助对象
 ********************************************/

export function extendAssist(access, $globalEvent) {

    /**
     * 文字动画
     * @param {[type]} contentId [description]
     */
    Xut.Assist.TextFx = function(contentId) {
        let pageObj = Xut.Presentation.GetPageObj()
        let fxObj = pageObj.getLetterObjs(contentId)
        if(fxObj) {
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
                if(_.isArray(activityId)) {
                    //完成通知
                    var markComplete = function() {
                        var completeStatistics = activityId.length; //动画完成统计
                        return function() {
                            if(completeStatistics === 1) {
                                outCallBack && outCallBack();
                                markComplete = null;
                            }
                            completeStatistics--;
                        }
                    }();
                    _.each(activityId, function(id) {
                        manager.abstractAssistAppoint(id, $globalEvent.getVisualIndex(), markComplete, apiName);
                    })
                } else {
                    manager.abstractAssistAppoint(activityId, $globalEvent.getVisualIndex(), outCallBack, apiName);
                }
            }, pageType, activityId, outCallBack)
        }
    })



}
