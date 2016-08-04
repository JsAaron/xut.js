/**
 * 自动触发控制
 * @return {[type]} [description]
 */

import { access } from './access'
import allowNext from '../backstage'
import directives from '../directive/index'

//content任务超时Id
let contentTaskOutId
let markComplete

/**
 * 运行自动的content对象
 * 延时500毫秒执行
 * @return {[type]} [description]
 */
let runContent = (contentObjs, taskAnimCallback) => {

    let contentTaskOutId = setTimeout(() => {

        clearTimeout(contentTaskOutId);

        /**
         * 完成通知
         * @param  {[type]} () [description]
         * @return {[type]}    [description]
         */
        let markComplete = (() => {
            let completeStatistics = contentObjs.length; //动画完成统计
            return () => {
                if (completeStatistics === 1) {
                    taskAnimCallback && taskAnimCallback();
                    markComplete = null;
                }
                completeStatistics--;
            }
        })()

        _.each(contentObjs, (obj, index) => {
            if (!Xut.CreateFilter.has(obj.pageId, obj.id)) {
                obj.autoPlay(markComplete)
            } else {
                markComplete();
            }
        })

    }, 500)
}

/**
 * 运行自动的静态类型
 * @return {[type]} [description]
 */
let runComponent = (pageObj, pageIndex, autoRunComponents, pageType) => {

    let chapterId = pageObj.baseGetPageId(pageIndex)
    let dir

    if (pageIndex === undefined) {
        pageIndex = Xut.Presentation.GetPageIndex()
    }

    _.each(autoRunComponents, (data, index) => {
        dir = directives[data.type];
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

    //When the home button by invoking
    //Does not perform automatic animation
    //fix 2016.6.29
    // originalApp
    // window.miaomiaoxue.back = 1;
    // activateApp
    // window.miaomiaoxue.back = 0;
    if (!allowNext()) {
        taskAnimCallback()
        return
    }


    //pageType
    //用于区别触发类型
    //页面还是母版
    access(pageObj, (pageObj, ContentObjs, ComponentObjs, pageType) => {

        //如果是母版对象，一次生命周期种只激活一次
        if (pageObj.pageType === 'master') {
            if (pageObj.onceMaster) {
                return
            }
            pageObj.onceMaster = true;
        }

        taskAnimCallback = taskAnimCallback || function() {};

        //自动运行的组件
        let autoRunComponents = pageObj.baseAutoRun()
        if (autoRunComponents) {
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
