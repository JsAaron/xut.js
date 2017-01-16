/**
 * 自动触发控制
 * @return {[type]} [description]
 */

import access from './access'
import allowNext from '../allow-next'
import directives from '../directive/index'

const noop = function() {}

/**
 * 运行自动的content对象
 * 延时500毫秒执行
 * @return {[type]} [description]
 */
const autoContents = (contentObjs, taskAnimCallback) => {

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
            //同一个对象类型
            //直接调用对象接口
            obj.autoPlay(markComplete)
        } else {
            markComplete();
        }
    })

}


/**
 * 运行自动的静态类型
 * @return {[type]} [description]
 */
const autoComponents = (pageObj, pageIndex, autoData, pageType) => {

    let chapterId = pageObj.baseGetPageId(pageIndex)
    let dir

    if (pageIndex === undefined) {
        pageIndex = Xut.Presentation.GetPageIndex()
    }

    _.each(autoData, (data, index) => {
        dir = directives[data.actType]
        //零件类型的接口调用不一致
        //这里需要转接口处理
        if (dir && dir.autoPlay) {
            dir.autoPlay({
                'id': data.id,
                'pageType': pageType,
                'rootNode': pageObj.getContainsNode(),
                'chapterId': chapterId,
                'category': data.category,
                'autoPlay': data.autoPlay,
                'pageIndex': pageIndex
            })
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
export function $$autoRun(pageObj, pageIndex, taskAnimCallback) {

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

        // console.log('debug', pageType + '层，第' + (pageIndex + 1) + '页开始,本页面Id为' + pageObj.chapterId)
    })

}
