/**
 *  创建widgets对象任务片
 *  state状态
 *      0 未创建
 *      1 正常创建
 *      2 创建完毕
 *      3 创建失败
 */
import TaskSuper from '../super'
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
      this._checkNextTask(this._create(pipeData));
    } else {
      success();
    }
  }


  /*
  初始化浮动页面参数
   */
  _initFloat() {
    return {
      'page': [],
      'master': []
    }
  }

  /*创建dom节点，但是浮动类型例外*/
  _create(pipeData) {

    const {
      pageType,
      activitys,
      chpaterData,
      chapterId,
      chapterIndex
    } = pipeData

    let resultHTML = [];

    let flostDivertor = this._initFloat()

    /*
      创建DOM元素结构,返回是拼接字符串
      判断返回值
      1 纯html
      2 对象（浮动音频处理）
    */
    const createDom = function(actType, activityData) {
      activityData = reviseSize({
        results: activityData,
        proportion: pipeData.getStyle.pageProportion
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
        resultHTML.push(result.html)
        if (result.hasFloat) {
          /*这个参数要传递到content中*/
          // flostDivertor[pageType].push(result.html)
        } else {
          // resultHTML.push(result.html)
        }
      }
    }

    //需要创建的数据结构
    activitys.forEach(function(activityData, index) {
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

    return {
      html: resultHTML.join(""),
      flostDivertor
    }
  }

  /**
   * 检测下个任务是否中断运行
   */
  _checkNextTask(result) {
    this.$$checkNextTask('内部Component', () => {
      this._render(result)
    })
  }


  /*渲染页面*/
  _render(result) {
    if (!result.html) {
      this.destroy()
      this.success(result.flostDivertor)
      return
    }
    Xut.nextTick({
      container: this.$containsNode,
      content: $(result.html)
    }, () => {
      this.destroy()
      this.success(result.flostDivertor)
    });
  }

  destroy() {
    this.$containsNode = null;
    this.$$destroy()
  }

}
