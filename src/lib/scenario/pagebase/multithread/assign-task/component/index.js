/**
 *  创建widgets对象任务片
 *  state状态
 *      0 未创建
 *      1 正常创建
 *      2 创建完毕
 *      3 创建失败
 */
import TaskSuper from '../task-super'
import directives from '../../../../directive/index'
import { reviseSize } from '../../../../../util/option'

export default class TaskComponents extends TaskSuper {

  constructor(data, success, detector) {

    super(detector)

    //预编译模式跳过创建
    if (Xut.IBooks.runMode()) {
      success();
      return;
    }

    if (data.activitys && data.activitys.length) {
      this.success = success
      this.$containsNode = data.$containsNode
      this._checkNextTask(this._create(data));
    } else {
      success();
    }
  }


  _create(data) {
    var actType,
      pageType = data.pageType,
      createWidgets = data.activitys,
      chpaterData = data.chpaterData,
      chapterId = data.chapterId,
      chapterIndex = data.chapterIndex,
      widgetRetStr = [];

    //创建
    function startCreate(actType, activityData) {
      //创建DOM元素结构
      //返回是拼接字符串
      widgetRetStr.push(directives[actType]['createDom'](
        activityData, chpaterData, chapterId, chapterIndex, Xut.zIndexlevel(), pageType
      ));
    }

    //需要创建的数据结构
    createWidgets.forEach(function(activityData, index) {

      //创建类型
      actType = activityData.actType || activityData.animation;

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
          //缩放比
          activityData = reviseSize({
            results: activityData,
            proportion: data.getStyle.pageProportion
          });
          startCreate(actType, activityData)
          break;
      }
    })

    return widgetRetStr.join("");
  }

  /**
   * 检测下个任务是否中断运行
   */
  _checkNextTask(str) {
    this.$$checkNextTask('内部Component', () => {
      this._render(str)
    })
  }


  /*渲染页面*/
  _render(str) {
    Xut.nextTick({
      container: this.$containsNode,
      content: $(str)
    }, () => {
      this.$$destroy()
      this.success()
    });
  }

}
