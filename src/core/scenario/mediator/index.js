/*********************************************************************
 *              场景容器构造器
 *          1 构件页面级容器
 *          2 翻页全局事件
 *
 **********************************************************************/
import { config } from '../../config/index'
import { Observer } from '../../observer/index'
import Scheduler from '../scheduler/index'
import delegateHooks from './hooks'
import { closestProcessor } from './closest'
import Swiper from '../../swiper/index.js'
import swiperHook from '../../swiper/hook.js'
import { initSceneApi } from '../../api/scene-api/index'
import { defProtected, defAccess } from '../../util/index'

/**
 * 配置多页面参数
 */
function configMultiple(options) {
  //如果是epub,强制转换为单页面
  if (Xut.IBooks.Enabled) {
    options.hasMultiPage = false
  } else {

    ////////////////////////////////
    /// scrollMode全局定义翻页模式  ////
    /// pageMode当前页面定义模式  ////
    ////////////////////////////////
    let pageMode = Number(options.pageMode)

    //如果是禁止翻页，然后还要看是不是有pageMode的设置
    if (!config.launch.gestureSwipe) {

      //喵喵学模式比较特别
      //在数据里中设定了filpMode为1
      //那么就是锁定了不允许翻页，但是还要能支持左右跳页面
      //这里就需要按照多页面的模式处理
      //强制是多页面的方式创建，但是锁住翻页而已
      if (config.launch.pageFlip) {
        options.hasMultiPage = true
        return
      }

      options.hasMultiPage = false
      //如果工具栏单独设置了页面模式，那么多页面强制改成true
      if (pageMode > 0) {
        options.hasMultiPage = true
      }
    } else {
      if (pageMode === 0) { //如果工具栏强制禁止滑动
        options.hasMultiPage = false
      } else {
        /*判断多页面情况*/
        options.hasMultiPage = true
      }
    }
  }
}

/**
 * 判断处理那个页面层次
 * 找到pageType类型
 * 项目分4个层
 * page mater page浮动 mater浮动
 * 通过
 * 因为冒泡的元素，可能是页面层，也可能是母板上的
 * @return {Boolean} [description]
 */
function isBelong(node) {
  var pageType = 'page';
  if (node.dataset && node.dataset.belong) {
    pageType = node.dataset.belong;
  }
  return pageType
}


////////////////////////////////////////////
///
/// 中介类
/// 全局事件Swiper与全局调度器Scheduler通讯
///
////////////////////////////////////////////
export default class Mediator extends Observer {

  constructor(parameter) {

    super()

    const $$mediator = this

    //配置文件
    const options = $$mediator.options = _.extend({
      //是否多场景加载
      //单页场景 false
      //多场景   true
      'hasMultiScene': false,
      //是否为连续页面
      //通过pageMode的参数定义
      'hasMultiPage': false
    }, parameter)

    //配置多页面参数
    configMultiple(options)

    //启用内部滚动模式
    let insideScroll = false
    if (config.launch.visualMode === 5) {
      insideScroll = true
    }

    const setOptions = {
      insideScroll, //内部滚动
      scope: 'child', //translate
      snap: true, //分段
      hasHook: true,
      container: options.sceneNode,
      visualIndex: options.initIndex,
      totalIndex: options.pageTotal,
      actualWidth: config.visualSize.width,
      actualHeight: config.visualSize.height,
      visualWidth: config.screenSize.width, //可视区的宽度
      hasMultiPage: options.hasMultiPage, //多页面
      sectionRang: options.sectionRang //分段值
    }

    /*如果没有强制关闭，并且是竖版的情况下，会启动鼠标滚动模式*/
    if (config.launch.mouseWheel !== false && config.launch.scrollMode === 'v') {
      setOptions.mouseWheel = true
    }

    /*虚拟摄像头模式，关闭边界反弹*/
    if (config.launch.visualMode === 5) {
      setOptions.borderBounce = false
    }

    /*快速配置了*/
    _.extend(setOptions, Swiper.getConfig())

    const $$globalSwiper = $$mediator.$$globalSwiper = new Swiper(setOptions)
    const $$scheduler = $$mediator.$$scheduler = new Scheduler($$mediator)

    //如果是主场景,才能切换系统工具栏
    if (options.hasMultiPage) {
      this._mixTool($$mediator)
    }

    //事件句柄对象
    let handlerObj = null;

    /**
     * 过滤器.全局控制函数
     * return true 阻止页面滑动
     */
    $$globalSwiper.$$watch('onFilter', (hookCallback, point, evtObj) => {
      let node = point.target
      swiperHook(evtObj, node)
      //页面类型
      let pageType = isBelong(node);
      //冒泡的ul根节点
      let parentNode = $$globalSwiper.findBubbleRootNode(point, pageType);
      //执行过滤处理
      handlerObj = closestProcessor.call(parentNode, point, pageType);

      //如果找到是空节点
      //并且是虚拟模式2的话
      //默认允许滑动
      if (!handlerObj) {
        if (config.launch.visualMode === 2) {
          return
        } else if (config.launch.visualMode === 5) {
          return
        }
      }

      //停止翻页,针对content对象可以拖动,滑动的情况处理
      if (!handlerObj || handlerObj.attribute === 'disable') {
        hookCallback();
      }
    });


    /**
     * 触屏松手点击，无滑动，判断为点击
     */
    $$globalSwiper.$$watch('onTap', (pageIndex, hookCallback) => {
      if (handlerObj) {
        if (handlerObj.handlers) {
          handlerObj.handlers(handlerObj.elem, handlerObj.attribute, handlerObj.rootNode, pageIndex)
        } else {
          if (!Xut.Contents.Canvas.getIsTap()) {
            Xut.View.ToggleToolbar()
          }
        }
        handlerObj = null;
        hookCallback();
      }
    });


    /**
     * 触屏滑动,通知pageMgr处理页面移动
     */
    $$globalSwiper.$$watch('onMove', (data) => {
      $$scheduler.movePageBases(data)
    });


    /**
     * 触屏滑动,通知ProcessMgr关闭所有激活的热点
     */
    $$globalSwiper.$$watch('onEnd', (pointers) => {
      $$scheduler.suspendPageBases(pointers)
    });


    /**
     * 翻页动画完成回调
     */
    $$globalSwiper.$$watch('onComplete', (...arg) => {
      $$scheduler.completePageBases(...arg)
    });


    /**
     * 鼠标滚轮
     */
    let wheellook = false //如果首页向上滑动，那么锁定马上可以向下滑动
    $$globalSwiper.$$watch('onWheel', (e, wheelDeltaY) => {

      const currPageBase = Xut.Presentation.GetPageBase($$globalSwiper.visualIndex)

      /*如果当前是流式页面*/
      if (currPageBase && currPageBase.hasColumnData) {
        const columnObj = currPageBase.columnGroup.get()[0]
        if (columnObj) {
          /*如果flow的进去是touch的方式，那么这里不需要控制了*/
          if (columnObj.getEntry() === 'touch') {
            wheellook = false
          }
          /*等待翻页结束后才可以委托到columnObj内部的onWheel滚动
          避免在翻页的时候重复触发*/
          if (!wheellook) {
            const direction = wheelDeltaY > 0 ? 'up' : 'down'
            columnObj && columnObj.onWheel(e, wheelDeltaY, direction)
          }
        }
      } else {

        ///////////////////
        /// PPT页面滚动
        /// 1 mac上鼠标有惯性
        /// 2 win上鼠标每次滑动一点，就是100的值
        ///////////////////

        wheellook = true

        /*向上滚动*/
        if (wheelDeltaY > 0) {
          $$globalSwiper.prev({
            speed: Xut.plat.isMacOS ? 600 : 300,
            callback: function() {
              wheellook = false
            }
          })
        } else {
          $$globalSwiper.next({
            speed: Xut.plat.isMacOS ? 600 : 300,
            callback: function() {
              wheellook = false
            }
          })
        }
      }

    })


    /**
     * 切换页面
     * @return {[type]}      [description]
     */
    $$globalSwiper.$$watch('onJumpPage', (data) => {
      $$scheduler.gotoPageBases(data);
    });


    /**
     * 退出应用
     * @return {[type]}      [description]
     */
    $$globalSwiper.$$watch('onDropApp', (data) => {
      window.GLOBALIFRAME && Xut.publish('magazine:dropApp');
    });


    /**
     * 母板移动反馈
     * 只有存在data-parallaxProcessed
     * 才需要重新激活对象
     * 删除parallaxProcessed
     */
    $$globalSwiper.$$watch('onMasterMove', (hindex, target) => {
      if (/Content/i.test(target.id) && target.getAttribute('data-parallaxProcessed')) {
        $$scheduler.masterMgr && $$scheduler.masterMgr.reactivation(target);
      }
    });

    /**
     * 销毁接口api
     * @type {[type]}
     */
    this.destorySceneApi = initSceneApi(this)
  }


  /**
   * 系统工具栏
   */
  _mixTool($$mediator) {

    _.extend(delegateHooks, {

      /**
       * li节点,多线程创建的时候处理滑动
       */
      'data-container' () {
        Xut.View.ToggleToolbar()
      },

      /**
       * 是背景层
       */
      'data-multilayer' () {
        //改变工具条状态
        Xut.View.ToggleToolbar()
      },

      /**
       * 默认content元素可以翻页
       */
      'data-behavior' (target, attribute, rootNode, pageIndex) {
        //没有事件的元素,即可翻页又可点击切换工具栏
        if (attribute == 'click-swipe') {
          Xut.View.ToggleToolbar()
        }
      }
    })

  }

}


/**
 * 是否多场景模式
 */
defAccess(Mediator.prototype, '$hasMultiScene', {
  get: function() {
    return this.options.hasMultiScene
  }
})


/**
 * 动态注入对象接口
 * 注入对象管理,注册所有widget组件对象
 *  content类型  创建时注册
 *  widget类型   执行时注册
 *  widget 包括 视频 音频 Action 子文档 弹出口 类型
 *  这种类型是冒泡处理，无法传递钩子，直接用这个接口与场景对接
 */
defAccess(Mediator.prototype, '$injectionComponent', {
  set: function(regData) {
    var injection;
    if (injection = this.$$scheduler[regData.pageType + 'Mgr']) {
      injection.assistPocess(regData.pageIndex, function(pageObj) {
        pageObj.baseAddComponent.call(pageObj, regData.widget);
      })
    } else {
      console.log('注册injection失败,regData=' + regData)
    }
  }
});

/**
 * 得到当前的视图页面
 * @return {[type]}   [description]
 */
defAccess(Mediator.prototype, '$visualPageBase', {
  get: function() {
    return this.$$scheduler.pageMgr.$$getPageBase(this.$$globalSwiper.getVisualIndex());
  }
});


/**
 *  监听viewmodel内部的状态的改变,触发后传入值
 *
 *  与状态有关的change:
 *      翻页
 *          'flipOver' : function(pageIndex) {},
 *
 *      切换工具栏
 *          'toggleToolbar' : function(state, pointer) {},
 *
 *      复位工具栏
 *          'resetToolbar'  : function() {},
 *
 *      隐藏下一页按钮
 *          'hideNext'   : function(state) {},
 *
 *      显示下一页按钮
 *          'showNext'   : function() {}
 *
 *  与创建相关
 *      创建完毕回调
 *          'createPageComplete': null,
 *      创建后中断自动运行回调
 *          'suspendAutoCallback': null
 *
 */
defProtected(Mediator.prototype, '$bind', function(key, callback) {
  const $$mediator = this
  $$mediator.$$watch(key, function() {
    callback.apply($$mediator, arguments)
  })
})


/**
 * 创建页面
 * @return {[type]} [description]
 */
defProtected(Mediator.prototype, '$init', function() {
  //如果是主场景，并且有历史记录
  //那么就不需要创建当前页面了
  if (this.options.isMain && this.options.hasHistory) {
    this.$$scheduler.initPage('init', false)
  } else {
    this.$$scheduler.initCreate();
  }
});



/**
 * 复位对象
 * @return {[type]} [description]
 */
defProtected(Mediator.prototype, '$reset', function({ pageType, pageIndex } = {}) {
  pageType = pageType || 'page'
  const mgr = pageType === 'page' ? 'pageMgr' : 'masterMgr'
  this.$$scheduler[mgr].resetOriginal(pageIndex || this.$$globalSwiper.getVisualIndex());
})


/**
 * 停止所有任务
 * @return {[type]} [description]
 */
defProtected(Mediator.prototype, '$suspend', function(pageIndex) {
  if (pageIndex) {

  } else {
    Xut.Application.Suspend({
      skipAudio: true //跨页面不处理
    })
  }
})

/**
 * 销毁场景内部对象
 * @return {[type]} [description]
 */
defProtected(Mediator.prototype, '$destroy', function() {
  this.$$unWatch(); //观察事件
  this.$$globalSwiper.destroy(); //全局事件
  this.$$scheduler.destroyManage(); //派发器
  this.$$scheduler = null;
  this.$$globalSwiper = null;
  this.destorySceneApi() //动态api
})
