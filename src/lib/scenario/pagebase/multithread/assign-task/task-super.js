/**
 * 多线程任务基类
 */

export default class TaskSuper {

  constructor(detector) {
    //中断检测器
    this.$$detector = detector

    /*中断队列*/
    this.$$suspendQueues = [];
  }

  /*
  检测是否可以运行下一个任务
  1 通过base.detectorTask做的监听，这里的this是pagebase的this
  2 如果检测可以运行直接运行nextTask
  3 如果检测不能运行就会运行suspend 断点
  interrupt 给content使用
   */
  $$checkNextTask(taskName, nextTask, interrupt) {
    //构建中断方法
    const suspendTask = () => {
      self.$$suspendQueues.push(function() {
        nextTask()
      })
    }

    //外部检测
    this.$$detector({
      suspendTask,
      nextTask,
      interrupt,
      taskName
    });
  }


  /**
   * 重新运行被阻断的线程任务
   */
  $$rerunTask() {
    if (this.$$suspendQueues && this.$$suspendQueues.length) {
      let task;
      if (task = this.$$suspendQueues.pop()) {
        task();
      }
      this.$$suspendQueues = [];
    }
  }

  /*
  销毁任务
   */
  $$destroy() {
    this.$$detector = null
    this.$$suspendQueues = null
  }

}
