import { config } from '../../../config/index'

/**
 * 多线程检测代码
 */
export default function threadCheck(baseProto) {


  /**
   * 自动运行：检测是否需要开始创建任务
   * 1 如果任务全部完成了毕
   * 2 如果有中断任务,就需要继续创建未完成的任务
   * 3 如果任务未中断,还在继续创建
   * currtask 是否为当前任务，加速创建
   */
  baseProto._checkNextTaskCreate = function(callback) {

    //如果任务全部完成
    if (this.threadTaskRelated.nextTaskName === 'complete') {
      return callback()
    }

    //开始构未完成的任务
    this._cancelTaskSuspend()

    //任务创建完毕回调
    this.threadTaskRelated.createTasksComplete = () => {
      this.divertorHooks && this.divertorHooks.threadtaskComplete()
      callback()
    };

    //派发任务
    this.detectorTask({
      nextTask() {
        this.dispatchTasks();
      }
    });
  }

  /**
   * 任务调度，自动创建下个任务
   * container/background/column/component/activity
   */
  baseProto.dispatchTasks = function(...arg) {
    const threadtasks = this.threadtasks[this.threadTaskRelated.nextTaskName]
    if (threadtasks) {
      Xut.$warn({
        type: 'create',
        content: `开始调度任务${this.threadTaskRelated.nextTaskName}`
      })
      threadtasks(...arg)
    }
  }


  /**
   * 开始执行下一个线程任务,检测是否中断
      suspendTask,
      nextTask,
      interrupt,
      taskName
   * @return {[type]} [description]
   */
  baseProto.detectorTask = function(options) {
    this._asyTasks({
      suspendCallback() {
        options.suspendTask && options.suspendTask.call(this)
      },
      nextTaskCallback() {
        options.nextTask && options.nextTask.call(this)
      }
    }, options.interrupt)
  }


  /**
   * 任务队列挂起
   * nextTaskCallback 成功回调
   * suspendCallback  中断回调
   * @return {[type]} [description]
   */
  baseProto._asyTasks = function(callbacks, interrupt) {
    //如果关闭多线程,不检测任务调度
    if (!this.hasMultithread) {
      return callbacks.nextTaskCallback.call(this);
    }
    //多线程检测
    this._multithreadCheck(callbacks, interrupt)
  }


  /**
   * 多线程检测
   * @return {[type]} [description]
   */
  baseProto._multithreadCheck = function(callbacks, interrupt) {
    const check = () => {
      if (this._checkTaskSuspend()) {
        this.tasksTimeOutId && clearTimeout(this.tasksTimeOutId)
        callbacks.suspendCallback.call(this);
      } else {
        callbacks.nextTaskCallback.call(this);
      }
    }
    const next = () => {
      this.tasksTimeOutId = setTimeout(() => {
        check();
      }, this.canvasRelated.tasksTimer);
    }

    //自动运行页面构建
    if (this.hasAutoRun) {
      //自动运行content中断检测 打断一次
      if (interrupt) {
        next()
      } else {
        check()
      }
    } else {
      //后台构建
      next()
    }
  }


  /**
   * 取消任务中断
   */
  baseProto._cancelTaskSuspend = function() {
    this.canvasRelated.isTaskSuspend = false
  }


  /**
   * 检测任务是否需要中断
   */
  baseProto._checkTaskSuspend = function() {
    return this.canvasRelated.isTaskSuspend;
  }

}
