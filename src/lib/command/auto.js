/**
 * 自动触发控制
 * @return {[type]} [description]
 */

import { access } from './access'
import allowNext from '../backstage'
import directives from '../directive/index'

const noop = function() {}

//content任务超时Id
let contentTaskTimer

const cleanTimer = function() {
    if (contentTaskTimer) {
        clearTimeout(contentTaskTimer)
        contentTaskTimer = null
    }
}

/**
 * 运行自动的content对象
 * 延时500毫秒执行
 * @return {[type]} [description]
 */
const autoContents = (contentObjs, taskAnimCallback) => {
    cleanTimer()

    contentTaskTimer = setTimeout(() => {

        cleanTimer()

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
const autoComponents = (pageObj, pageIndex, autoRunComponents, pageType) => {

    let chapterId = pageObj.baseGetPageId(pageIndex)
    let dir

    if (pageIndex === undefined) {
        pageIndex = Xut.Presentation.GetPageIndex()
    }

    _.each(autoRunComponents, (data, index) => {
        dir = directives[data.type]
        if (dir && dir.autoPlay) {
            dir.autoPlay({
                'id'        : data.id,
                'key'       : data.key,
                'type'      : data.type,
                'pageType'  : pageType,
                'rootNode'  : pageObj.element,
                'chapterId' : chapterId,
                'category'  : data.category,
                'autoPlay'  : data.autoPlay,
                'pageIndex' : pageIndex
            });
        }
    });
}


/**
 * 自动动作
 * @param  {[type]} pageObj          [description]
 * @param  {[type]} pageIndex        [description]
 * @param  {[type]} taskAnimCallback [description]
 * @return {[type]}                  [description]
 */
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
    access(pageObj, (pageObj, contentObjs, componentObjs, pageType) => {

        //如果是母版对象，一次生命周期种只激活一次
        if (pageObj.pageType === 'master') {
            if (pageObj.onceMaster) {
                return
            }
            pageObj.onceMaster = true
        }

        taskAnimCallback = taskAnimCallback || noop


        let autoData = pageObj.baseAutoRun()
        if (autoData) {
            autoComponents(pageObj, pageIndex, autoData, pageType)
        }

        if (contentObjs) {
            autoContents(contentObjs, taskAnimCallback)
        } else {
            taskAnimCallback(); //无动画
        }

        Xut.log('debug', pageType + '层，第' + (pageIndex + 1) + '页开始,本页面Id为' + pageObj.chapterId)
    })

}
