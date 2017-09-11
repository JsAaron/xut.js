/**
 *  创建widgets对象任务片
 *  state状态
 *      0 未创建
 *      1 正常创建
 *      2 创建完毕
 *      3 创建失败
 */
import TaskSuper from '../super/index'
import directives from '../../../../directive/index'
import { reviseSize } from '../../../../../util/option'

export default class TaskComponents extends TaskSuper {

  constructor(pipeData, success, detector) {

    super(detector)

    //预编译模式跳过创建
    if (Xut.IBooks.runMode()) {
      success();
      return;
    }

    if (pipeData.activitys && pipeData.activitys.length) {
      this.success = success
      this.$containsNode = pipeData.$containsNode
      this.pageBaseHooks = pipeData.pageBaseHooks
      this.pipeData = pipeData
      this._checkNextTask(this._create(pipeData));
    } else {
      success();
    }
  }

  /**
   * 创建dom节点，但是浮动类型例外
   */
  _create() {

    const {
      pageType,
      activitys,
      chpaterData,
      chapterId,
      chapterIndex
    } = this.pipeData

    let resultHTML = [];

    /*
      创建DOM元素结构,返回是拼接字符串
      判断返回值
      1 纯html
      2 对象（浮动音频处理）
    */
    const createDom = (actType, activityData) => {
      activityData = reviseSize({
        results: activityData,
        proportion: this.pipeData.getStyle.pageProportion
      })
      const result = directives[actType]['createDom'](
        activityData,
        chpaterData,
        chapterId,
        chapterIndex,
        Xut.zIndexlevel(),
        pageType
      )
      if (_.isString(result)) {
        resultHTML.push(result)
      } else {
        /*如果有浮动类型，保存*/
        if (result.hasFloat) {
          this.$$floatDivertor[pageType].html.push(result.html)
        } else {
          resultHTML.push(result.html)
        }
      }
    }

    //需要创建的数据结构
    activitys.forEach(function (activityData, index) {
      //创建类型
      let actType = activityData.actType || activityData.animation;
      //特殊类型 showNote
      if (!actType && activityData.note) {
        activityData['actType'] = actType = "ShowNote";
      }
      switch (actType) {
        case 'ShowNote':
        case 'Action':
        case 'Widget':
        case 'Audio':
        case 'Video':
          createDom(actType, activityData)
          break;
      }
    })

    return resultHTML.join("")
  }

  /**
   * 检测下个任务是否中断运行
   */
  _checkNextTask(htmlString) {
    this._$$checkNextTask('内部Component', () => {
      this._float(() => {
        this._render(htmlString)
      })
    })
  }

  /**
   * 浮动处理
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  _float(callback) {

    /*制作浮点回调*/
    this.pipeData.taskCount = 0

    let complete = (() => {
      return () => {
        if (this.pipeData.taskCount === 1) {
          callback()
          return
        }
        --this.pipeData.taskCount;
      }
    })()

    this._$$createFloatLayer(complete, this.pipeData)

    /*如果不存在浮动*/
    if (this.pipeData.taskCount === 0) {
      complete = null
      callback()
    }
  }

  /**
   * 渲染页面*
   * @param  {[type]} htmlString [description]
   * @return {[type]}            [description]
   */
  _render(htmlString) {
    /*正常component*/
    if (htmlString) {
      Xut.nextTick({
        container: this.$containsNode,
        content: $(htmlString)
      }, () => {
        this._destroy()
        this.success()
      })
    } else {
      this._destroy()
      this.success()
    }
  }

  //============================
  //      super方法
  //============================

  _destroy() {
    this.$containsNode = null;
  }

}
