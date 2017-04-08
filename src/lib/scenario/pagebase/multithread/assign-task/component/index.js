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

  constructor(data, suspend, success) {

    super()

    //预编译模式跳过创建
    if (Xut.IBooks.runMode()) {
      success();
      return;
    }

    if (data.activitys && data.activitys.length) {
      this.suspend = suspend
      this.success = success
      this.$containsNode = data['$containsNode'];
      this._suspendCompile(this._create(data));
    } else {
      success();
    }
  }


  clearReference() {
    this.$containsNode = null;
  }


  /**
   * 运行被阻断的线程任务
   */
  runSuspendTasks() {
    if (this.suspendQueues) {
      var fn;
      if (fn = this.suspendQueues.pop()) {
        fn();
      }
      this.suspendQueues = null;
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
   * 编译中断函数
   */
  _suspendCompile(str) {

    const self = this;

    //继续执行
    const nextTasks = function() {
      Xut.nextTick({
        container: self.$containsNode,
        content: $(str)
      }, function() {
        self.clearReference();
        self.success();
      });
    }

    //中断方法
    const suspendTasks = function() {
      self.suspendQueues = [];
      self.suspendQueues.push(function() {
        nextTasks()
      })
    }

    self.suspend(nextTasks, suspendTasks);
  }

}
