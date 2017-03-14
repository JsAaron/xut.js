/**
 *  创建widgets对象任务片
 *  state状态
 *      0 未创建
 *      1 正常创建
 *      2 创建完毕
 *      3 创建失败
 */
import directives from '../../../directive/index'
import { reviseSize } from '../../../../util/option'

export default function TaskComponents(data, suspendCallback, successCallback) {

  //预编译模式跳过创建
  if(Xut.IBooks.runMode()) {
    successCallback();
    return;
  }

  if(data['activitys'].length) {
    var str;
    this.$containsNode = data['$containsNode'];
    this.callback = {
      'suspendCallback': suspendCallback,
      'successCallback': successCallback
    }
    str = this.create(data);
    this.compileSuspend(str);
  } else {
    successCallback();
  }
}


TaskComponents.prototype = {

  clearReference: function() {
    this.$containsNode = null;
  },

  create: function(data) {
    var actType,
      pageType = data.pageType,
      createWidgets = data.activitys,
      chpaterData = data.chpaterData,
      chapterId = data.chapterId,
      pid = data.pid,
      widgetRetStr = [];

    //创建
    function startCreate(actType, activityData) {
      //创建DOM元素结构
      //返回是拼接字符串
      widgetRetStr.push(directives[actType]['createDom'](
        activityData, chpaterData, chapterId, pid, Xut.zIndexlevel(), pageType
      ));
    }

    //需要创建的数据结构
    createWidgets.forEach(function(activityData, index) {

      //创建类型
      actType = activityData.actType || activityData.animation;

      //特殊类型 showNote
      if(!actType && activityData.note) {
        activityData['actType'] = actType = "ShowNote";
      }

      switch(actType) {
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
  },

  /**
   * 编译中断函数
   * @return {[type]} [description]
   */
  compileSuspend: function(str) {

    var nextTasks, suspendTasks,
      self = this;

    //继续执行
    nextTasks = function() {
      Xut.nextTick({
        container: self.$containsNode,
        content: $(str)
      }, function() {
        self.clearReference();
        self.callback.successCallback();
      });
    }

    //中断方法
    suspendTasks = function() {
      self.suspendQueues = [];
      self.suspendQueues.push(function() {
        nextTasks()
      })
    }

    self.callback.suspendCallback(nextTasks, suspendTasks);
  },

  //运行被阻断的线程任务
  runSuspendTasks: function() {
    if(this.suspendQueues) {
      var fn;
      if(fn = this.suspendQueues.pop()) {
        fn();
      }
      this.suspendQueues = null;
    }
  }
}
