/**
 * 自动触发控制
 * @return {[type]} [description]
 */

import { config } from '../../config/index'
import access from './access'
import allowNext from './allow-next'
import directives from '../directive/index'
import { pushWatcher, clearWatcher } from '../../observer/batcher'

const noop = function() {}

/**
 * 运行自动的Activity对象
 * 延时500毫秒执行
 * @return {[type]} [description]
 */
function autoActivitys(activityObjs, taskAnimCallback) {
  let markComplete = (() => {
    let completeStatistics = activityObjs.length; //动画完成统计
    return () => {
      if (completeStatistics === 1) {
        taskAnimCallback && taskAnimCallback();
        markComplete = null;
      }
      completeStatistics--;
    }
  })()

  _.each(activityObjs, (obj, index) => {
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
function autoComponents(pageBase, pageIndex, autoData, pageType) {

  if (pageIndex === undefined) {
    pageIndex = Xut.Presentation.GetPageIndex()
  }

  let chapterId = pageBase.baseGetPageId(pageIndex)
  let directive

  _.each(autoData, (data, index) => {
    directive = directives[data.actType]
    //零件类型的接口调用不一致
    //这里需要转接口处理
    if (directive && directive.autoPlay) {
      directive.autoPlay({
        'id': data.id,
        'pageType': pageType,
        'rootNode': pageBase.getContainsNode(),
        'chapterId': chapterId,
        'category': data.category,
        'autoPlay': data.autoPlay,
        'pageIndex': pageIndex
      })
    }
  });
}


/*翻页停止，
翻页速度大于定会器的延时，
那么这个任务就会被重复叠加触发，
所以每次翻页必须停止*/
export function $stopAutoWatch() {
  clearWatcher()
}

/**
 * 兼容高级动画闪动的问题处理
 * 新版本只有apng动画了
 */
function delayWatcher(pageIndex, fn) {
  if (window.preloadData) {
    pushWatcher(pageIndex, fn)
  } else {
    fn()
  }
}

/**
 * 自动动作
 */
export function $autoRun(pageBase, pageIndex, taskAnimCallback) {

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

  /**
   * 设置母版不重复，但是需要排除一个问题
    //标记已经运行过autoComponent的命令了
    //因为采用delayWatcher
    //那么共享模板，如果翻页低于delayWatcher的延时
    //那么自动运行的动作在第二页会丢失
    //所以这里需要标注下
    //只要满足一个，就可以了
   */
  function setMaster(pageBase) {
    if (pageBase && pageBase.pageType === 'master') {
      pageBase.onceMaster = true
    }
  }

  //pageType
  //用于区别触发类型
  //页面还是母版
  access(pageBase, (pageBase, activityObjs, componentObjs, pageType) => {

    //如果是母版对象，一次生命周期种只激活一次
    if (pageBase.onceMaster) {
      return
    }

    taskAnimCallback = taskAnimCallback || noop

    /*自动组件*/
    let autoData = pageBase.baseAutoRun()
    if (autoData) {
      delayWatcher(pageIndex, function() {
        setMaster(pageBase)
        autoComponents(pageBase, pageIndex, autoData, pageType)
      })
    }

    /*自动Activity*/
    if (activityObjs) {
      delayWatcher(pageIndex, function() {
        setMaster(pageBase)
        autoActivitys(activityObjs, taskAnimCallback)
      })
    } else {
      taskAnimCallback(); //无动画
    }

  })

}
