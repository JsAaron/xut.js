import { config } from '../../config/index'

/********************************************
 * 场景API
 * 视图接口。视图是窗口的展示方式，和页面相关的接口，都在这里。
 ********************************************/
export function extendView($$mediator, access, $$globalSwiper) {

  const options = $$mediator.options

  //========================
  //  页面工具栏按钮
  //========================


  Xut.View.UpdateScrollPosition = function (...arg) {
    $$mediator.$emit('change:updateScrollPosition', ...arg)
  }


  /**
   * 设置显示滚动工具栏
   */
  Xut.View.ShowScrollBar = function () {
    $$mediator.$emit('change:showScrollBar')
  }

  /**
   * 更新页码
   * @param {[type]} point [description]
   *   parentIndex  父索引
   *   subIndex     子索引
   */
  Xut.View.UpdatePage = function (...arg) {
    $$mediator.$emit('change:updatePage', ...arg)
  }


  /**
   * 显示上一页按钮
   * @param {...[type]} arg [description]
   */
  Xut.View.ShowPrevBar = function (...arg) {
    $$mediator.$emit('change:showPrev', ...arg)
  }

  /**
   * 隐藏上一页按钮
   * @param {...[type]} arg [description]
   */
  Xut.View.HidePrevBar = function (...arg) {
    $$mediator.$emit('change:hidePrev', ...arg)
  }


  /**
   * 显示下一页按钮
   * @param {...[type]} arg [description]
   */
  Xut.View.ShowNextBar = function (...arg) {
    $$mediator.$emit('change:showNext', ...arg)
  }

  /**
   * 隐藏下一页按钮
   * @param {...[type]} arg [description]
   */
  Xut.View.HideNextBar = function (...arg) {
    $$mediator.$emit('change:hideNext', ...arg)
  }

  /**
   * state, pointer
   */
  Xut.View.ToggleToolbar = function (...arg) {
    $$mediator.$emit('change:toggleToolbar', ...arg)
  }

  /**
   * 显示工具栏
   * 没有参数显示 工具栏与控制翻页按钮
   * 有参数单独显示指定的
   */
  Xut.View.ShowToolBar = function (point) {
    Xut.View.ToggleToolbar('show', point)
  }

  /**
   * 隐藏工具栏
   * 没有参数隐藏 工具栏与控制翻页按钮
   * 有参数单独隐藏指定
   */
  Xut.View.HideToolBar = function (point) {
    Xut.View.ToggleToolbar('hide', point)
  }

  /**
   * 复位工具栏
   */
  Xut.View.ResetToolbar = function () {
    $$mediator.$emit('change:resetToolbar')
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
  Xut.View.Toolbar = function (cfg) {
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
  const gotoPage = function (data, direction) {
    let seasonId, chapterId, callback

    if (data) {
      if (_.isFunction) { //回调
        callback = data
      } else {
        seasonId = data.seasonId
        chapterId = data.chapterId
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

    options.hasMultiPage && $$globalSwiper[direction](callback)
  }

  /**
   * 跳转到上一个页面
   */
  Xut.View.GotoPrevSlide = function (data) {
    gotoPage(data, 'prev')
  }

  /**
   * 跳转到下一个页面
   */
  Xut.View.GotoNextSlide = function (data) {
    gotoPage(data, 'next')
  }


  /**
   * 是否启动
   * @return {[type]} [description]
   */
  Xut.View.HasEnabledSwiper = function () {
    return $$globalSwiper.hasEnabled()
  }

  /**
   * 禁止滑动
   */
  Xut.View.SetSwiperDisable = function () {
    $$globalSwiper.disable();
  }

  /**
   * 允许滑动
   */
  Xut.View.SetSwiperEnable = function () {
    $$globalSwiper.enable();
  }

  /**
   * 设置翻页完成
   */
  Xut.View.SetSwiperFilpComplete = function (...arg) {
    $$globalSwiper.setTransitionComplete(...arg)
  }

  /**
   * 获取全局swiper的动作选择
   * 1.翻页
   * 2.反弹
   * distX, distY, duration
   */
  Xut.View.GetSwiperActionType = function (...arg) {
    return $$globalSwiper.getActionType(...arg)
  }

  /**
   * 是否为翻页的边界
   * @return {Boolean} [description]
   */
  Xut.View.GetSwpierBorderBounce = function (distance) {
    return $$globalSwiper.isBorder(distance)
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
  Xut.View.GotoSlide = function (seasonId, chapterId) {

    //修正参数
    const fixParameter = function (pageIndex) {
      pageIndex = Number(pageIndex) - 1
      if (pageIndex < 0) {
        pageIndex = 0
      }
      return pageIndex
    }

    //ibooks模式下的跳转
    //全部转化成超链接
    if (Xut.IBooks.Enabled && Xut.IBooks.runMode() && chapterId) {
      location.href = chapterId + ".xhtml";
      return
    }

    //兼容数据错误
    if (!seasonId && !chapterId) return;

    //如果是一个参数是传递页码数,则为内部跳转
    if (arguments.length === 1) {
      //复位翻页按钮
      Xut.View.ShowNextBar()
      return $$globalSwiper.scrollToPage(fixParameter(seasonId))
    }

    //场景模式内部跳转
    if (options.seasonId == seasonId) {
      //chpaterId 转化成实际页码
      var sectionRang = Xut.data.query('sectionRelated', seasonId)
      var pageIndex = chapterId - sectionRang.start
      Xut.View.ShowNextBar()
      return $$globalSwiper.scrollToPage(fixParameter(pageIndex))
    }

    //场景与场景的跳转
    return Xut.View.LoadScenario({
      'seasonId': seasonId,
      'chapterId': chapterId
    })
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
  Xut.View.SetSwiperMove = function ({
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
