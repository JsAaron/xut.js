/**
 * 自动触发控制
 * @return {[type]} [description]
 */


import {Bind} from '../pagebase/thread/dispenser/bind'


//content任务超时Id
var contentTaskOutId, markComplete;

/**
 * 运行自动的content对象
 * 延时500毫秒执行
 * @return {[type]} [description]
 */
function runContent(contentObjs, taskAnimCallback) {

        var contentTaskOutId = setTimeout(function() {

            clearTimeout(contentTaskOutId);

            //完成通知
            var markComplete = function() {
                var completeStatistics = contentObjs.length; //动画完成统计
                return function() {
                    if (completeStatistics === 1) {
                        taskAnimCallback && taskAnimCallback();
                        markComplete = null;
                    }
                    completeStatistics--;
                }
            }();

            _.each(contentObjs, function(obj, index) {
                if (!Xut.CreateFilter.has(obj.pageId, obj.id)) {
                    obj.autoPlay(markComplete)
                } else {
                    markComplete();
                }
            });
        }, 500);
    }
    /**
     * 运行自动的静态类型
     * @return {[type]} [description]
     */
function runComponent(pageObj, pageIndex, autoRunComponents, pageType) {

    var chapterId = pageObj.baseGetPageId(pageIndex);

    if (pageIndex === undefined) {
        pageIndex = Xut.Presentation.GetPageIndex();
    }
    _.each(autoRunComponents, function(data, index) {
        var dir = Bind[data.type];
        if (dir && dir.autoPlay) {
            dir.autoPlay({
                'id': data.id,
                'key': data.key,
                'type': data.type,
                'pageType': pageType,
                'rootNode': pageObj.element,
                'chapterId': chapterId,
                'category': data.category,
                'autoPlay': data.autoPlay,
                'pageIndex': pageIndex
            });
        }
    });
}

export function autoRun(pageObj, pageIndex, taskAnimCallback) {

    /**
     * 编译IBOOKSCONFIG的时候过滤自动运行的调用
     * @return {[type]}              [description]
     */
    if (Xut.IBooks.compileMode()) {
        return;
    }

    //pageType
    //用于区别触发类型
    //页面还是母版
    Xut.accessControl(pageObj, function(pageObj, ContentObjs, ComponentObjs, pageType) {

        //如果是母版对象，一次生命周期种只激活一次
        if (pageObj.pageType === 'master') {
            if (pageObj.onceMaster) {
                return
            }
            pageObj.onceMaster = true;
        }

        taskAnimCallback = taskAnimCallback || function() {};

        //自动运行的组件
        var autoRunComponents;
        if (autoRunComponents = pageObj.baseAutoRun()) {
            runComponent(pageObj, pageIndex, autoRunComponents, pageType)
        }

        //自动运行content
        clearTimeout(contentTaskOutId);

        if (ContentObjs) {
            runContent(ContentObjs, taskAnimCallback);
        } else {
            taskAnimCallback(); //无动画
        }

        Xut.log('debug', pageType + '层，第' + (pageIndex + 1) + '页开始,本页面Id为' + pageObj.chapterId)
    })

}
