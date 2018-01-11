import { config } from '../../config/index'
import { $autoRun } from '../../scenario/command/index'

/********************************************
 * 场景API
 * 视图接口。视图是窗口的展示方式，和页面相关的接口，都在这里。
 ********************************************/
export function extendView($$mediator, access, $$globalSwiper) {

  const options = $$mediator.options

  /**
   * 获取页面根节点的ID命名规则
   * chapterId是页面ID编号
   * base.pageType + "-" + (base.pageIndex + 1) + "-" + base.chapterId
   */
  Xut.View.GetPageNodeIdName = function(pageType, pageIndex, chapterId) {
    return `${pageType}-${pageIndex+1}-${chapterId}`
  }

  //========================
  //  页面工具栏按钮
  //========================

  /**
   * 更新页码
   * @param {[type]} point [description]
   *   parentIndex  父索引
   *   subIndex     子索引
   */
  Xut.View.UpdatePage = function(...arg) {
    $$mediator.$$emit('updatePage', ...arg)
  }


  /**
   * 显示上一页按钮
   * @param {...[type]} arg [description]
   */
  Xut.View.ShowPrevBar = function(...arg) {
    $$mediator.$$emit('showPrev', ...arg)
  }

  /**
   * 隐藏上一页按钮
   * @param {...[type]} arg [description]
   */
  Xut.View.HidePrevBar = function(...arg) {
    $$mediator.$$emit('hidePrev', ...arg)
  }


  /**
   * 显示下一页按钮
   * @param {...[type]} arg [description]
   */
  Xut.View.ShowNextBar = function(...arg) {
    $$mediator.$$emit('showNext', ...arg)
  }

  /**
   * 隐藏下一页按钮
   * @param {...[type]} arg [description]
   */
  Xut.View.HideNextBar = function(...arg) {
    $$mediator.$$emit('hideNext', ...arg)
  }

  /**
   * state, pointer
   */
  Xut.View.ToggleToolbar = function(...arg) {
    $$mediator.$$emit('toggleToolbar', ...arg)
  }

  /**
   * 显示工具栏
   * 没有参数显示 工具栏与控制翻页按钮
   * 有参数单独显示指定的
   */
  Xut.View.ShowToolBar = function(point) {
    Xut.View.ToggleToolbar('show', point)
  }

  /**
   * 隐藏工具栏
   * 没有参数隐藏 工具栏与控制翻页按钮
   * 有参数单独隐藏指定
   */
  Xut.View.HideToolBar = function(point) {
    Xut.View.ToggleToolbar('hide', point)
  }

  /**
   * 复位工具栏
   */
  Xut.View.ResetToolbar = function() {
    $$mediator.$$emit('resetToolbar')
  }


  /**
   * 指定特定的显示与隐藏
   *  Xut.View.Toolbar({
   *       show :'bottom',
   *       hide :'controlBar'
   *   })
   *
   *  //工具栏与翻页按钮全部显示/隐藏
   *  Xut.View.Toolbar('show')
   *  Xut.View.Toolbar('hide')
   *
   */
  Xut.View.Toolbar = function(cfg) {
    Xut.View.ToggleToolbar(cfg)
  };

  /*
  跳转页面
   options
     obj / fn
   direction
     prev
     next
   */
  function gotoPage(data, direction) {
    let seasonId, chapterId, callback, speed

    /**
     * data 可以传，可以不传递
     * 1 传递回调函数
     * 2 传递对象
     */
    if (data) {
      if (_.isFunction(data)) { //回调
        callback = data
      } else {
        seasonId = data.seasonId
        chapterId = data.chapterId
        callback = data.callback
        speed = data.speed
      }
    }


    if (seasonId && chapterId) {
      Xut.View.LoadScenario({
        'seasonId': seasonId,
        'chapterId': chapterId
      }, callback)
      return;
    }

    //ibooks模式下的跳转
    //全部转化成超链接
    if (Xut.IBooks.Enabled && Xut.IBooks.runMode()) {
      const pageIndex = direction === 'prev' ?
        Xut.IBooks.pageIndex - 1 :
        Xut.IBooks.pageIndex + 1
      location.href = pageIndex + ".xhtml";
      callback && callback()
      return
    }

    options.hasMultiPage && $$globalSwiper[direction]({ callback, speed })
  }

  /**
   * 跳转到上一个页面
   */
  Xut.View.GotoPrevSlide = function(data) {
    gotoPage(data, 'prev')
  }

  /**
   * 跳转到下一个页面
   */
  Xut.View.GotoNextSlide = function(data) {
    gotoPage(data, 'next')
  }


  /**
   * 是否启动
   * @return {[type]} [description]
   */
  Xut.View.HasEnabledSwiper = function() {
    return $$globalSwiper.hasEnabled()
  }

  /**
   * 禁止滑动
   */
  Xut.View.SetSwiperDisable = function() {
    $$globalSwiper.disable();
  }

  /**
   * 允许滑动
   */
  Xut.View.SetSwiperEnable = function() {
    $$globalSwiper.enable();
  }

  /**
   * 设置翻页完成
   */
  Xut.View.SetSwiperFilpComplete = function(...arg) {
    $$globalSwiper.setTransitionComplete(...arg)
  }

  /**
   * 获取全局swiper的动作选择
   * 1.翻页
   * 2.反弹
   * distX, distY, duration
   */
  Xut.View.GetSwiperActionType = function(...arg) {
    return $$globalSwiper.getActionType(...arg)
  }

  /**
   * 是否为翻页的边界
   * @return {Boolean} [description]
   */
  Xut.View.GetSwpierBorderBounce = function(distance) {
    return $$globalSwiper.isBorder(distance)
  }


  /**
   * 修正参数
   */
  function fixParameter(index) {
    index = Number(index) - 1
    if (index < 0) {
      index = 0
    }
    return index
  }

  /**
   * 跳转页面
   * 场景内部切换
   * 跳转到指定编号的页面
   * Action 类型跳转
   * xxtlink 超连接跳转,svg内嵌跳转标记处理
   * 文本框跳转
   * ........
   */
  Xut.View.GotoSlide = function(seasonId, chapterId, pageIndex, callback) {

    //ibooks模式下的跳转
    //全部转化成超链接
    if (Xut.IBooks.Enabled && Xut.IBooks.runMode() && chapterId) {
      location.href = chapterId + ".xhtml";
      return
    }

    //兼容数据错误
    if (!seasonId && !chapterId) return;

    ///////////////////////////////////////
    // 如果是一个参数是传递页码数,则为内部跳转
    ///////////////////////////////////////
    if (arguments.length === 1) {
      //复位翻页按钮
      Xut.View.ShowNextBar()
      //seasonId == pageIndex
      return $$globalSwiper.scrollToPage(fixParameter(seasonId), callback)
    }

    ////////////////////////////
    /// 场景模式内部跳转
    /// 1 保证同一个seasonId
    /// 2 如果传递了pageIndex
    /// 3 如果只传递了chpaterId
    ////////////////////////////
    if (options.seasonId == seasonId) {
      if (pageIndex && !chapterId) { //如果传递了页码数
        return $$globalSwiper.scrollToPage(fixParameter(pageIndex), callback)
      } else {
        //chpaterId 转化成实际页码
        var sectionRang = Xut.data.query('sectionRelated', seasonId)
        var pageIndex = chapterId - sectionRang.start
        Xut.View.ShowNextBar()
        return $$globalSwiper.scrollToPage(fixParameter(pageIndex), callback)
      }
    }

    ////////////////////
    // 场景与场景的跳转
    ////////////////////
    return Xut.View.LoadScenario({
      'seasonId': seasonId,
      'chapterId': chapterId
    }, callback)
  }


  /**
   * 动态出入PPT页面
   * 数据中链接的对应映射处理
   * @type {[type]}
   */
  const linkMap = Xut.View.linkMap = {}

  /**
   * 将指定页面插入到目标的页面后面
   * originalChapterId 当前chapterId页面
   * targetChapterId   目标chapterId页面
   * 1.传递2个参数，将指定original页面，插入出入到目标target页面之后
   * 2.如果只有一个参数，只需要传递目标target页面, 默认original为当前页面
   * 3.如果不传递任何参数，讲当前页面插入到下一页
   */
  Xut.View.InsertAfter = function(originalChapterId, targetChapterId) {

    //这个模式必须是禁止手势滑动的
    if (config.launch.gestureSwipe) {
      Xut.$warn({
        type: 'api',
        content: 'gestureSwipe启动了，Xut.View.InsertAfter不生效',
        color: 'red'
      })
      return
    }

    const pageObj = Xut.Presentation.GetPageBase('page')
    if (!pageObj) {
      return
    }

    const chapterId = pageObj.chapterId

    //是下一页
    let isNext = false

    //一个参数情况，只传递目标
    if (originalChapterId && !targetChapterId) {
      //如果目标是当前页之后
      if (originalChapterId === chapterId) {
        isNext = true
      }
    }

    //当前页面直接插入到下一页
    //做一个最简单的还原处理
    if (!originalChapterId && !targetChapterId) {
      isNext = true
    }

    //下一页插入处理
    if (isNext) {
      if (chapterId &&
        !linkMap[chapterId] &&
        linkMap[chapterId] !== 0) {
        linkMap[chapterId] = function() {
          pageObj.hide()
          $$mediator.$reset()
          setTimeout(function() {
            pageObj.show()
            $autoRun()
            //只处理一次
            linkMap[chapterId] = 0
          }, 0)
        }
      }
    }

  }


  /**
   * 页面滑动
   * action 动作
   * direction 方向
   * distance 移动距离
   * speed 速度
   *
      action: "flipRebound"
      backIndex : 4
      direction : "prev"
      distance : 0
      frontIndex : 2
      middleIndex: 3
      orientation : "h"
      speed : 300
   *
   */
  Xut.View.SetSwiperMove = function({
    action,
    direction,
    distance,
    speed,
    orientation
  }) {

    //如果禁止翻页模式 || 如果是滑动,不是边界
    if (!options.hasMultiPage ||
      $$globalSwiper.getMoved() ||
      action === 'flipMove' && $$globalSwiper.isBorder(distance)) {
      return
    }

    const pagePointer = $$globalSwiper.getPointer()

    /**
     * 在column中滑动的时候，会丢失Direction
     * 具体就是flow在首页，而且chpater只有一个flow的情况下
     */
    $$globalSwiper.setDirection(distance)

    /*如果没有传递布方向，就取页面，这个在全局接口中处理*/
    orientation = orientation || config.launch.scrollMode

    $$mediator.$$scheduler.movePageBases({
      action,
      direction,
      distance,
      speed,
      orientation,
      'frontIndex': pagePointer.frontIndex,
      'middleIndex': pagePointer.middleIndex,
      'backIndex': pagePointer.backIndex
    })
  }


}
