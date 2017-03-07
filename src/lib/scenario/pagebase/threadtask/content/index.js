/****************************************************
 *           构建TaskContents对象
 *      依赖数据解析算法类 Algorithm
 *      结构合并创建类    Structure
 *      行为动画绑定类     Content
 * ***************************************************/
import {
  config
} from '../../../../config/index'
import {
  contentStructure
} from './dom/index'
import {
  LetterEffect
} from '../../../../component/activity/content/letter-effect'
import {
  Zoom
} from '../../../../plugin/extend/zoom/index'
import {
  contentParser,
  activityParser
} from './data'
import {
  createFloatMater,
  createFloatPage
} from './float'
import {
  sceneController
} from '../../../../scenario/scene-control'

import {
  nextTick
} from '../../../../util/nexttick'
import {
  $$on,
  $$off
} from '../../../../util/dom'
import {
  analysisImageName,
  insertImageUrlSuffix
} from '../../../../util/option'

import {
  createFn,
  toArray,
  toObject,
  parseBehavior,
  autoUUID,
  applyActivitys
} from './depend'



/**
 * content任务类
 */
export default class TaskContents {

  constructor(activityData) {
    _.extend(this, activityData)
    //只解析content有关的activityData
    let compileActivitys = activityParser(activityData)
    //如果有预执行动作
    //Activity表数据存在
    if(compileActivitys) {
      //解析动画表数据结构
      activityData = contentParser(compileActivitys, activityData)

      //如果有需要构建的content
      //开始多线程处理
      activityData.createContentIds.length ? this._dataAfterCheck(activityData) : this._loadComplete();
    } else {
      this._loadComplete();
    }
  }

  /**
   * 中断一:构建数据之后
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  _dataAfterCheck(data) {

    this._assert('dataAfter', function() {
      //浮动模板
      //用于实现模板上的事件
      data.floatMaters = {
        'ids': [], //浮动id
        'container': {}, //浮动容器
        'zIndex': {}
      }

      //浮动页面
      //母板事件引起的层级遮挡问题
      //用于提升最高
      data.floatPages = {
        'ids': [],
        'zIndex': {}
      }

      //解析activitys.parameter中的数据里
      //点击反馈
      //点击缩放
      parseBehavior(data)

      //构建页面content类型结构
      //contentDas, contentStr, containerPrefix, idFix, contentHtmlBoxIds
      contentStructure(userData => {

        data.contentHtmlBoxIds = userData.contentHtmlBoxIds
        data.contentsFragment = {}

        //iboosk节点预编译
        //在执行的时候节点已经存在
        //不需要在创建
        if(Xut.IBooks.runMode()) {
          _.each(userData.idFix, function(id) {
            data.contentsFragment[id] = data.$containsNode.find("#" + id)[0]
          })
        } else {
          //构件快速查询节点对象
          data.contentsFragment = toObject(userData.contentStr)
          delete userData.contentStr
        }

        //容器的前缀
        data.containerPrefix = userData.containerPrefix

        /* eslint-disable */
        //2015.5.6暴露到全局
        //提供给音频字幕上下文
        if(!Xut.Contents.contentsFragment[data.chapterId]) {
          Xut.Contents.contentsFragment[data.chapterId];
        }
        Xut.Contents.contentsFragment[data.chapterId] = data.contentsFragment
        /* elist-enable */

        //开始下一个任务
        this._dataStrCheck(data, userData);

      }, data, this)

    })
  }

  /**
   * 中断二:构建结构之后
   * @param  {[type]} data       [description]
   * @param  {[type]} contentDas [description]
   * @return {[type]}            [description]
   */
  _dataStrCheck(data, userData) {
    this._assert('strAfter', function() {
      let contentDas = userData.contentDas

      //放大图片
      if(Object.keys(data.zoomBehavior).length) {
        this._zoomImage(data)
      }

      //文本特效
      if(userData.textFx.length) {
        this._textFx(data, userData.textFx)
      }

      //保留场景的留信息
      //用做软件制作单页预加载
      sceneController.seasonRelated = data.seasonRelated;

      //初始化content对象
      applyActivitys(data, contentDas, delayHooks => {
        this._eventAfterCheck(data, delayHooks, userData.headerFooterMode)
      })
    })
  }

  /**
   * 中断三:绑定事件事件之后
   * @param  {[type]} iScrollHooks [description]
   * @return {[type]}              [description]
   */
  _eventAfterCheck(data, delayHooks, headerFooterMode) {

    const self = this;

    this._assert('eventAfter', function() {

      data.count = 1; //计算回调的成功的次数

      /**
       * 完成钩子函数
       * 1 content的卷滚条
       * 2 canvas事件绑定
       * @return {[type]} [description]
       */
      const callHooks = function() {
        let iscrollHooks = delayHooks.iscrollHooks
        let hook
        if(iscrollHooks.length) {
          while(hook = iscrollHooks.shift()) {
            hook()
          }
        }
      }

      const nextTask = function() {
        delayHooks && callHooks()
        self._applyAfterCheck()
      }

      /**
       * 1 页面浮动
       * 2 母版浮动
       * 3 正常对象
       */
      const complete = function(data) {
        return function() {
          if(data.count === 1) {
            nextTask()
            return
          }
          data.count--;
        }
      }(data);

      //浮动页面对
      //浮动对象比任何层级都都要高
      //超过母版
      if(data.floatPages.ids && data.floatPages.ids.length) {
        createFloatPage(this, data, complete)
      }

      //如果存在母版浮动节点
      //在创建节点structure中过滤出来，根据参数的tipmost
      if(data.floatMaters.ids && data.floatMaters.ids.length) {
        createFloatMater(this, data, complete)
      }

      //iboosk节点预编译
      //在执行的时候节点已经存在
      //不需要在创建
      if(Xut.IBooks.runMode()) {
        complete();
      } else {

        let fragment = toArray(data.contentsFragment, headerFooterMode)
        let bodyContent = fragment.bodyContent
        let headerFooterContent = fragment.headerFooterContent

        let watchCount = 0
        headerFooterContent.length && ++watchCount
        bodyContent.length && ++watchCount

        //如果bodyContent与headerFooterContent都没有
        //直接返回回调
        if(!watchCount) {
          complete()
          return
        }

        let watchNextTick = function() {
          return() => {
            if(watchCount === 1) {
              complete()
              return
            }
            --watchCount
          }
        }()

        //页眉页脚
        if(headerFooterContent.length) {
          nextTick({
            'container': data.$headFootNode,
            'content': fragment.headerFooterContent
          }, watchNextTick);
        }

        //主体内容
        if(bodyContent.length) {
          nextTick({
            'container': data.$containsNode,
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
   * 点击放大图
   * @return {[type]} [description]
   */
  _zoomImage(data) {
    let self = this
    self.zoomObjs = {} //保存缩放对象
    _.each(data.contentsFragment, function(node) {
      //需要单独绑定点击放大功能
      let behaviorData = data.zoomBehavior[node.id]
      let size
      let promptHtml
      if(behaviorData) {
        //缩放提示图片
        if(behaviorData.prompt) {
          size = config.screenSize.width > config.screenSize.height ? '2vw' : '2vh'
          promptHtml = `<div class="icon-maximize"
                             style="font-size:${size};position:absolute;right:0;">
                        </div>`
          $(node).append(String.styleFormat(promptHtml))
        }
        let hasMove = false
        $$on(node, {
          start() {
            hasMove = false
          },
          move() {
            hasMove = true
          },
          end() {
            if(hasMove) return
            let $node = $(node)
            let $imgNode = $node.find('img')

            if(!$imgNode.length) {
              return
            }

            let src = $imgNode[0].src
            let zoomObj = self.zoomObjs[src]

            if(zoomObj) {
              zoomObj.play()
            } else {
              let hqSrc
              let analysisName = analysisImageName(src)
              //如果启动了高清图片
              if(config.useHDImageZoom && config.imageSuffix && config.imageSuffix['1440']) {
                hqSrc = config.pathAddress + insertImageUrlSuffix(analysisName.original, config.imageSuffix['1440'])
              }
              self.zoomObjs[src] = new Zoom({
                element: $imgNode,
                originalSrc: config.pathAddress + analysisName.suffix,
                hdSrc: hqSrc
              })
            }
          }
        })
        behaviorData.off = function() {
          $$off(node)
          node = null
        }
      }
    })
    this.zoomBehavior = data.zoomBehavior
  }

  /**
   * 文本特效
   * @return {[type]} [description]
   */
  _textFx(data, textFx) {

    let uuid = 1
    let content
    let contentNode
    let parentNodes = [] //收集父节点做比对
    let group = {}
    let textfxNodes
    let parentNode

    //文本特效对象
    let textFxObjs = {}

    while(content = textFx.shift()) {
      if(contentNode = data.contentsFragment[content.texteffectId]) {
        let contentId = content._id

        //初始化文本对象
        textFxObjs[contentId] = new LetterEffect(contentId)
        textfxNodes = contentNode.querySelectorAll('a[data-textfx]')

        if(textfxNodes.length) {
          textfxNodes.forEach(function(node) {
            //如果是共享了父节点
            parentNode = node.parentNode
            if(-1 != parentNodes.indexOf(parentNode)) {
              group[parentNode.textFxId].push(node)
            } else {
              parentNode.textFxId = uuid
              group[uuid] = []
              group[uuid++].push(node)
            }
            parentNodes.push(parentNode)
            textFxObjs[contentId].addQueue(node, node.getAttribute('data-textfx'))
          })
        }
      }
    }

    this.textFxObjs = textFxObjs
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