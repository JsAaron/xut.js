const noop = function() {}

export default function initThreadState(instance) {

  return {
    /**
     * 主线任务等待
     */
    taskHangFn: null,

    /**
     * 创建相关的信息
     * @type {Object}
     */
    tasksTimer: 0,

    /**
     * 当前任务是否中断
     * return
     *     true  中断
     *     false 没有中断
     */
    isTaskSuspend: false,

    /**
     * 是否预创建背景中
     */
    isPreCreateBackground:false,

    /*
    缓存的任务名
    动态注册
     */
    assignTaskGroup:null,

    /**
     * 下一个将要运行的任务标示
     */
    nextTaskName: '',

    /**
     * 预创建
     * 构建页面主容器完毕后,此时可以翻页
     * @return {[type]} [description]
     */
    preforkComplete: noop,

    /**
     * 整个页面都构建完毕通知
     * @return {[type]} [description]
     */
    createTasksComplete: noop
  }
}