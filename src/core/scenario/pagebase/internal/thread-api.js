import { config } from '../../../config/index'

/**
 *  对外接口
 *  1 开始调用任务
 *  2 调用自动运行任务
 *  3 设置中断
 *  4 取消中断设置
 */

export default function(baseProto) {

  /**
   * 开始调用任务
   * dispatch=>index=>create=>startThreadTask
   * 如果是快速翻页，创建container就提前返回callback
   */
  baseProto.startThreadTask = function(isFlipAction, callback) {

    /**
     * 构建container任务完成后的一次调用
     *   1 如果是快速翻頁，並且是翻頁動作
     *   2 否則則繼續創建剩下的任務
     */
    this.threadTaskRelated.preforkComplete = (() => {
      return () => {
        /*当创建完容器后，就允许快速翻页了
        如果此时是快速打开，并且是翻页的动作*/
        if (config.launch.quickFlip && isFlipAction) {
          callback()
        } else {
          /*如果不是快速翻页，那么就继续往下分解任务*/
          this._checkNextTaskCreate(callback)
        }
      }
    })()

    //开始构建任务
    this.dispatchTasks()
  }


  /**
   * 主动调用
   * 检测任务是否完成,自动运行的时候需要检测
   * page => autoRun中需要保证任务完成后才能执行自动运行任务
   * src\lib\scenario\manage\page.js
   */
  baseProto.checkThreadTaskComplete = function(completeCallback) {
    this.hasAutoRun = true;
    this._checkNextTaskCreate(() => {
      this.hasAutoRun = false
      completeCallback()
    })
  }


  /**
   * 主动调用
   * 翻页的时候要设置任务中断
   * left middle right 默认三个页面
   * src\lib\scenario\manage\page.js
   */
  baseProto.setTaskSuspend = function() {
    this.hasAutoRun = false;
    this.canvasRelated.isTaskSuspend = true;
    this.threadTaskRelated.isPreCreateBackground = false;
    this.threadTaskRelated.taskHangFn = null;
  }


  /**
   * 主动调用
   * 后台预创建任务
   * 自动运行任务完成后，需要开始预创建其他页面任务没有创建完毕的的处理
   * 断点续传
   * \src\lib\scenario\manage\page.js:
   */
  baseProto.createPreforkTask = function(callback, isPreCreate) {
    const self = this;
    //2个预创建间隔太短
    //背景预创建还在进行中，先挂起来等待
    if (this.threadTaskRelated.isPreCreateBackground) {
      this.threadTaskRelated.taskHangFn = function(callback) {
        return function() {
          self._checkNextTaskCreate(callback);
        }
      }(callback);
      return;
    }

    /**
     * 翻页完毕后
     * 预创建背景
     */
    if (isPreCreate) {
      this.threadTaskRelated.isPreCreateBackground = true;
    }

    this._checkNextTaskCreate(callback);
  }


  /**
   * 主动调用
   * 2016.10.13 给妙妙学增加watch('complete')
   * 如果有最后一个动作触发，创建最后一次页面动作
   *
   * 只有最后一页的时候才会存在runLastPageAction方法
   * this.runLastPageAction在parseMode中定义
   * \lib\scenario\pagebase\multithread\assign-task\index.js:
   */
  baseProto.createPageAction = function() {
    if (this.runLastPageAction) {
      //返回停止方法
      this.stopLastPageAction = this.runLastPageAction()
    }
  }


  /**
   * 销毁动作触发
   * 处理最后一页动作
   * \src\lib\scenario\manage\page.j
   */
  baseProto.destroyPageAction = function() {
    if (this.stopLastPageAction) {
      this.stopLastPageAction()
      this.stopLastPageAction = null
    }
  }


}
