/****************************************************
 *           构建TaskContents对象
 *      依赖数据解析算法类 Algorithm
 *      结构合并创建类    Structure
 *      行为动画绑定类     Content
 * ***************************************************/
import TaskSuper from '../super/index'
import { config } from '../../../../../config/index'
import { nextTick } from '../../../../../util/tick'
import { textFx } from './text-fx'
import { compileActivity } from './compile-activity'
import { zoomPicture } from './zoom-picture'
import { contentParser } from './parser/content'
import { parseParameter } from './parser/parameter'
import { activityParser } from './parser/activity'
import { contentStructure } from './structure/index'
import { sceneController } from '../../../../../scenario/control'


/**
 * 构建快速查询节点对象
 * 转成哈希方式
 * @return {[type]} [description]
 */
function toObject(cachedContentStr) {
  var tempFragmentHash = {};
  _.each($(cachedContentStr), function (ele, index) {
    tempFragmentHash[ele.id] = ele;
  })
  return tempFragmentHash;
}


/**
 * 转成数组格式
 * 分组
 *     主体部分内容
 *     页眉页脚内容
 */
function toArray(contentsFragment, headerFooterMode) {
  let bodyContent = []
  let headerFooterContent = []
  _.each(contentsFragment, function ($node, key) {
    let id = key.split('_').pop()
    let state
    if (headerFooterMode && (state = headerFooterMode[id])) {
      if (state !== 'hide') { //隐藏抛弃的元素，不需要显示了
        headerFooterContent.push($node)
      }
    } else {
      bodyContent.push($node)
    }
  })
  return {
    bodyContent,
    headerFooterContent
  }
}

/**
 * content任务类
 */
export default class TaskActivitys extends TaskSuper {

  /*管道参数，贯通*/
  constructor(pipeData, success, detector) {

    super(detector)

    _.extend(this, pipeData)
    this.success = success

    /*chapter => activity*/
    const activitys = activityParser(pipeData)
    if (activitys) {
      pipeData = contentParser(activitys, pipeData)
      pipeData.createContentIds.length ? this._dataAfterCheck(pipeData) : this._loadComplete();
    } else {
      this._loadComplete();
    }
  }


  /**
   * 检测下个任务创建
   */
  _checkNextTask(taskName, nextTask) {
    //如果是当前页面构建,允许打断一次
    let interrupt
    if (this.base.hasAutoRun && taskName === 'strAfter') {
      interrupt = true;
    }
    this._$$checkNextTask('内部contents', () => {
      nextTask()
    }, interrupt)
  }


  /**
   * 中断一:构建数据之后
   * 构建结构
   */
  _dataAfterCheck(pipeData) {
    this._checkNextTask('dataAfter', () => {

      /*解析Parameter*/
      parseParameter(pipeData)

      /*构建页面content类型结构*/
      contentStructure(pipeData, this.$$floatDivertor, userData => {
        pipeData.contentHtmlBoxIds = userData.contentHtmlBoxIds
        pipeData.contentsFragment = {}
          //iboosk节点预编译
          //在执行的时候节点已经存在
          //不需要在创建
        if (Xut.IBooks.runMode()) {
          _.each(userData.idFix, (id) => {
            pipeData.contentsFragment[id] = pipeData.$containsNode.find("#" + id)[0]
          })
        } else {
          //构件快速查询节点对象
          pipeData.contentsFragment = toObject(userData.contentStr)
          delete userData.contentStr
        }
        //容器的前缀
        pipeData.containerPrefix = userData.containerPrefix
          /* eslint-disable */
          //2015.5.6暴露到全局
          //提供给音频字幕上下文
        if (!Xut.Contents.contentsFragment[pipeData.chapterId]) {
          Xut.Contents.contentsFragment[pipeData.chapterId];
        }
        Xut.Contents.contentsFragment[pipeData.chapterId] = pipeData.contentsFragment
          /* elist-enable */
        this._dataStrCheck(pipeData, userData);
      })

    })
  }

  /**
   * 中断二:构建结构之后
   * 绑定事件
   */
  _dataStrCheck(pipeData, userData) {
    this._checkNextTask('strAfter', () => {
      /*缩放图片*/
      if (Object.keys(pipeData.zoomBehavior).length) {
        this.zoomObjs = zoomPicture(pipeData)
        this.zoomBehavior = pipeData.zoomBehavior
      }
      //文本特效
      if (userData.textFx.length) {
        this.textFxObjs = textFx(pipeData, userData.textFx)
      }
      //保留场景的留信息
      //用做软件制作单页预加载
      sceneController.seasonRelated = pipeData.seasonRelated;
      //初始化content对象
      compileActivity(delayHooks => {
        this._eventAfterCheck(pipeData, delayHooks, userData.headerFooterMode)
      }, pipeData, userData.contentDataset, this.$$floatDivertor)
    })
  }

  /**
   * 中断三:绑定事件事件之后
   * @param  {[type]} iScrollHooks [description]
   * @return {[type]}              [description]
   */
  _eventAfterCheck(pipeData, delayHooks, headerFooterMode) {


    this._checkNextTask('eventAfter', () => {

      /*
      计算回调的成功的次数
      1 正常节点创建
      2 浮动节点创建
      3 页眉页脚创建
       */
      pipeData.taskCount = 1

      /**
       * 完成钩子函数
       * 1 content的卷滚条
       * 2 canvas事件绑定
       */
      const hookfns = function () {
        let iscrollHooks = delayHooks.iscrollHooks
        let hook
        if (iscrollHooks.length) {
          while (hook = iscrollHooks.shift()) {
            hook()
          }
        }
      }

      /**
       * 1 页面浮动
       * 2 母版浮动
       * 3 正常对象
       * 4 页眉页脚
       */
      const complete = (() => {
        return () => {
          if (pipeData.taskCount === 1) {
            delayHooks && hookfns()
            this._applyAfterCheck()
            return
          }
          --pipeData.taskCount;
        }
      })()

      /*创建浮动层*/
      this._$$createFloatLayer(complete, pipeData, this.base.floatGroup)

      /*iboosk节点预编译,在执行的时候节点已经存在,不需要在创建*/
      if (Xut.IBooks.runMode()) {
        complete();
      } else {
        let fragment = toArray(pipeData.contentsFragment, headerFooterMode)
        let bodyContent = fragment.bodyContent
        let headerFooterContent = fragment.headerFooterContent
        let watchCount = 0

        /*页面页脚需要叠加计算*/
        headerFooterContent.length && ++watchCount
        bodyContent.length && ++watchCount

        /*没有渲染数据*/
        if (!watchCount) {
          complete()
          return
        }

        const watchNextTick = function () {
          return () => {
            if (watchCount === 1) {
              complete()
              return
            }
            --watchCount
          }
        }()

        /*页眉页脚*/
        if (headerFooterContent.length) {
          nextTick({
            'container': pipeData.$headFootNode,
            'content': fragment.headerFooterContent
          }, watchNextTick);
        }

        /*主体内容*/
        if (bodyContent.length) {
          nextTick({
            'container': pipeData.$containsNode,
            'content': fragment.bodyContent
          }, watchNextTick);
        }
      }
    })
  }

  /**
   * 中断四：渲染content
   * @return {[type]} [description]
   */
  _applyAfterCheck() {
    this._checkNextTask('applyAfter', () => {
      this._loadComplete(true)
    })
  }


  /**
   * 构建完毕
   * @return {[type]} [description]
   */
  _loadComplete() {
    this.success && this.success();
  }


  //============================
  //      super方法
  //============================

  /**
   * 清理引用
   * @return {[type]} [description]
   */
  _destroy() {

    //文字动画
    if (this.textFxObjs) {
      _.each(this.textFxObjs, function (obj) {
        obj.destroy()
      })
      this.textFxObjs = null
    }

    //删除字幕用的碎片文档
    if (Xut.Contents.contentsFragment[this.chapterId]) {
      delete Xut.Contents.contentsFragment[this.chapterId]
    }

    //清理放大图片功能
    if (this.zoomBehavior && Object.keys(this.zoomBehavior).length) {
      //清理缩放绑定事件
      _.each(this.zoomBehavior, function (zoomBehavior) {
        if (zoomBehavior.off) {
          zoomBehavior.off()
        }
      })
      this.zoomBehavior = null

      //清理缩放对象
      _.each(this.zoomObjs, function (zoom) {
        zoom.destroy()
      })
      this.zoomObjs = null
    }

    this.canvasRelated = null
    this.pageBaseHooks = null
    this.$containsNode = null;
    this.rootNode = null;
    this.contentsFragment = null;
  }

}
