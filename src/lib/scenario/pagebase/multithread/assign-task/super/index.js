import { crateFloat } from './float'

/**
 * 任务基类
 * 1 任务检测
 * 2 浮动层处理
 */

export default class TaskSuper {

  constructor(detector) {
    //中断检测器
    this.$$detector = detector;
    /*中断队列*/
    this.$$suspendQueues = [];
    /*初始化浮动*/
    this._$$initFloat()
  }


  /*
  初始化浮动页面参数
  私有方法
   */
  _$$initFloat() {
    /*
     1.浮动页面,母板事件引起的层级遮挡问题,用于提升最高
     2.浮动模板,用于实现模板上的事件
     */
    this.$$floatDivertor = {}
    _.each(['page', 'master'], type => {
      this.$$floatDivertor[type] = {
        'ids': [], //content保存合集
        'html': [], //component组件触发点字符串
        'zIndex': {}, //保存索引
        'container': null //浮动容器
      }
    })
  }

  /*
  创建浮动
  1 页面浮动层
  2 母版浮动层
  baseFloatGroup: pagebase中的基础，用来处理是否容器已经创建
   */
  _$$createFloatLayer(complete, pipeData, baseFloatGroup) {

    const pageDivertor = this.$$floatDivertor.page
    const masterDivertor = this.$$floatDivertor.master

    /*结束后清理，因为componnet中的条件会影响activity中的条件判断*/
    const clearDivertor = (divertor) => {
      if (divertor.html.length) {
        divertor.html = null
      }
    }

    //=====================================
    //  ids 是content的id
    //  html 是component的html字符
    //  2个中有一个存在就需要处理浮动
    //  但是需要注意component在content之前
    //  所以component处理完毕后，要清理html
    //  否则会影响content的判断
    //=====================================

    /*浮动页面对,浮动对象比任何层级都都要高,超过母版*/
    if (pageDivertor.ids.length || pageDivertor.html.length) {
      crateFloat('page',
        pipeData,
        pageDivertor,
        baseFloatGroup,
        container => {
          pageDivertor.container = container;
          this.pageBaseHooks.floatPages(pageDivertor);
          clearDivertor(pageDivertor)
          complete()
        }
      )
    }

    /*如果存在母版浮动节点,在创建节点structure中过滤出来，根据参数的tipmost*/
    if (masterDivertor.ids.length || masterDivertor.html.length) {
      crateFloat('master',
        pipeData,
        masterDivertor,
        baseFloatGroup,
        container => {
          masterDivertor.container = container;
          this.pageBaseHooks.floatMasters(masterDivertor);
          clearDivertor(masterDivertor)
          complete()
        }
      )
    }
  }


  /*
  检测是否可以运行下一个任务
  1 通过base.detectorTask做的监听，这里的this是pagebase的this
  2 如果检测可以运行直接运行nextTask
  3 如果检测不能运行就会运行suspend 断点
  interrupt 给content使用
   */
  _$$checkNextTask(taskName, nextTask, interrupt) {
    //构建中断方法
    const suspendTask = () => {
      this.$$suspendQueues.push(function () {
        nextTask()
      })
    }

    //外部检测
    this.$$detector && this.$$detector({
      suspendTask,
      nextTask,
      interrupt,
      taskName
    });
  }


  //============================
  //      外部接口
  //============================

  /**
   * 重新运行被阻断的线程任务
   */
  rerunTask() {
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
  destroy() {
    if(this._destroy){
      this._destroy()
    }
    this.$$detector = null
    this.$$suspendQueues = null
  }

}
