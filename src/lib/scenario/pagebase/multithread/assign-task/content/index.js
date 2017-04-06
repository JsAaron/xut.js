/****************************************************
 *           构建TaskContents对象
 *      依赖数据解析算法类 Algorithm
 *      结构合并创建类    Structure
 *      行为动画绑定类     Content
 * ***************************************************/
import { config } from '../../../../../config/index'
import { nextTick } from '../../../../../util/nexttick'
import { bindActivity } from './bindActivity'
import { zoomImage } from './zoomImage'
import { textFx } from './textFx'
import { contentParser } from './parser/content'
import { parseBehavior } from './parser/behavior'
import { activityParser } from './parser/activity'
import { contentStructure } from './structure/index'
import { createFloatMater, createFloatPage } from './structure/float'
import { sceneController } from '../../../../../scenario/scene-control'


/**
 * 构建快速查询节点对象
 * 转成哈希方式
 * @return {[type]} [description]
 */
function toObject(cachedContentStr) {
  var tempFragmentHash = {};
  _.each($(cachedContentStr), function(ele, index) {
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
  _.each(contentsFragment, function($node, key) {
    let id = key.split('_').pop()
    let state
    if(headerFooterMode && (state = headerFooterMode[id])) {
      if(state !== 'hide') { //隐藏抛弃的元素，不需要显示了
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
export default class TaskContents {

  /*管道参数，贯通*/
  constructor(pipeData) {
    _.extend(this, pipeData)
      /*chapter => activity*/
    let activitys
    if(activitys = activityParser(pipeData)) {
      pipeData = contentParser(activitys, pipeData)
      pipeData.createContentIds.length ? this._dataAfterCheck(pipeData) : this._loadComplete();
    } else {
      this._loadComplete();
    }
  }

  /*
  初始化浮动页面参数
   */
  _initFloat(pipeData) {
    //浮动模板
    //用于实现模板上的事件
    pipeData.floatMaters = {
      'ids': [], //浮动id
      'container': {}, //浮动容器
      'zIndex': {}
    }

    //浮动页面
    //母板事件引起的层级遮挡问题
    //用于提升最高
    pipeData.floatPages = {
      'ids': [],
      'zIndex': {}
    }
  }

  /**
   * 中断一:构建数据之后
   * 构建结构
   */
  _dataAfterCheck(pipeData) {
    this._assert('dataAfter', function() {
      /*初始化浮动*/
      this._initFloat(pipeData)
        /*解析点击反馈，点击缩放*/
      parseBehavior(pipeData)
        /*构建页面content类型结构*/
      contentStructure(userData => {
        pipeData.contentHtmlBoxIds = userData.contentHtmlBoxIds
        pipeData.contentsFragment = {}
          //iboosk节点预编译
          //在执行的时候节点已经存在
          //不需要在创建
        if(Xut.IBooks.runMode()) {
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
        if(!Xut.Contents.contentsFragment[pipeData.chapterId]) {
          Xut.Contents.contentsFragment[pipeData.chapterId];
        }
        Xut.Contents.contentsFragment[pipeData.chapterId] = pipeData.contentsFragment
          /* elist-enable */
        this._dataStrCheck(pipeData, userData);
      }, pipeData, this)

    })
  }

  /**
   * 中断二:构建结构之后
   * 绑定事件
   */
  _dataStrCheck(pipeData, userData) {
    this._assert('strAfter', function() {
      /*缩放图片*/
      if(Object.keys(pipeData.zoomBehavior).length) {
        this.zoomObjs = zoomImage(pipeData)
        this.zoomBehavior = pipeData.zoomBehavior
      }
      //文本特效
      if(userData.textFx.length) {
        this.textFxObjs = textFx(pipeData, userData.textFx)
      }
      //保留场景的留信息
      //用做软件制作单页预加载
      sceneController.seasonRelated = pipeData.seasonRelated;
      //初始化content对象
      bindActivity(pipeData, userData.contentDataset, delayHooks => {
        this._eventAfterCheck(pipeData, delayHooks, userData.headerFooterMode)
      })
    })
  }

  /**
   * 中断三:绑定事件事件之后
   * @param  {[type]} iScrollHooks [description]
   * @return {[type]}              [description]
   */
  _eventAfterCheck(pipeData, delayHooks, headerFooterMode) {

    const self = this;
    this._assert('eventAfter', function() {

      /*计算回调的成功的次数*/
      pipeData.taskCount = 1

      /**
       * 完成钩子函数
       * 1 content的卷滚条
       * 2 canvas事件绑定
       */
      const hookfns = function() {
        let iscrollHooks = delayHooks.iscrollHooks
        let hook
        if(iscrollHooks.length) {
          while(hook = iscrollHooks.shift()) {
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
      const complete = function() {
        return function() {
          if(pipeData.taskCount === 1) {
            delayHooks && hookfns()
            self._applyAfterCheck()
            return
          }
          --pipeData.taskCount;
        }
      }()

      /*浮动页面对,浮动对象比任何层级都都要高,超过母版*/
      if(pipeData.floatPages.ids && pipeData.floatPages.ids.length) {
        createFloatPage(this, pipeData, complete)
      }

      /*如果存在母版浮动节点,在创建节点structure中过滤出来，根据参数的tipmost*/
      if(pipeData.floatMaters.ids && pipeData.floatMaters.ids.length) {
        createFloatMater(this, pipeData, complete)
      }

      /*iboosk节点预编译,在执行的时候节点已经存在,不需要在创建*/
      if(Xut.IBooks.runMode()) {
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
        if(!watchCount) {
          complete()
          return
        }

        const watchNextTick = function() {
          return() => {
            if(watchCount === 1) {
              complete()
              return
            }
            --watchCount
          }
        }()

        /*页眉页脚*/
        if(headerFooterContent.length) {
          nextTick({
            'container': pipeData.$headFootNode,
            'content': fragment.headerFooterContent
          }, watchNextTick);
        }

        /*主体内容*/
        if(bodyContent.length) {
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
    this._assert('applyAfter', function() {
      this._loadComplete(true)
    })
  }

  /**
   * 运行被阻断的线程任务
   * @return {[type]} [description]
   */
  runSuspendTasks() {
    if(this.suspendQueues) {
      var fn;
      if(fn = this.suspendQueues.pop()) {
        fn();
      }
      this.suspendQueues = null;
    }
  }

  /**
   * 构建完毕
   * @return {[type]} [description]
   */
  _loadComplete() {
    this.pageBaseHooks.success();
  }

  /**
   * 任务断言
   */
  _assert(taskName, tasks) {

    var self = this;

    //中断方法
    var suspendTasks = function() {
      self.suspendQueues = [];
      self.suspendQueues.push(function() {
        tasks.call(self);
      })
    }

    //完成方法
    var nextTasks = function() {
      tasks.call(self);
    }

    self.pageBaseHooks.suspend(taskName, nextTasks, suspendTasks);
  }


  /**
   * 清理引用
   * @return {[type]} [description]
   */
  clearReference() {

    //文字动画
    if(this.textFxObjs) {
      _.each(this.textFxObjs, function(obj) {
        obj.destroy()
      })
      this.textFxObjs = null
    }

    //删除字幕用的碎片文档
    if(Xut.Contents.contentsFragment[this.chapterId]) {
      delete Xut.Contents.contentsFragment[this.chapterId]
    }

    //清理放大图片功能
    if(this.zoomBehavior && Object.keys(this.zoomBehavior).length) {
      //清理缩放绑定事件
      _.each(this.zoomBehavior, function(zoomBehavior) {
        if(zoomBehavior.off) {
          zoomBehavior.off()
        }
      })
      this.zoomBehavior = null

      //清理缩放对象
      _.each(this.zoomObjs, function(zoom) {
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
