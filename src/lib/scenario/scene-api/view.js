/********************************************
 * 场景API
 * 视图接口。视图是窗口的展示方式，和页面相关的接口，都在这里。
 ********************************************/
export function extendView(vm, access, $globalEvent) {

  let options = vm.options

  /**
   * 设置页面的potion编码
   * 为分栏修改
   */
  Xut.View.setPointer = function(pageIndex) {
    $globalEvent.setPointer(pageIndex)
  }

  /**
   * 更新页码
   * @param {[type]} point [description]
   *   parentIndex  父索引
   *   subIndex     子索引
   */
  Xut.View.setPageNumber = function(...arg) {
    vm.$emit('change:pageUpdate', ...arg)
  }

  /**
   * 显示工具栏
   * 没有参数显示 工具栏与控制翻页按钮
   * 有参数单独显示指定的
   */
  Xut.View.ShowToolBar = function(point) {
    vm.$emit('change:toggleToolbar', 'show', point)
  }

  /**
   * 隐藏工具栏
   * 没有参数隐藏 工具栏与控制翻页按钮
   * 有参数单独隐藏指定
   */
  Xut.View.HideToolBar = function(point) {
    vm.$emit('change:toggleToolbar', 'hide', point)
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
   * @return {[type]} [description]
   */
  Xut.View.Toolbar = function(cfg) {
    vm.$emit('change:toggleToolbar', cfg)
  };

  /*
  跳转页面
   options
     obj / fn
   direction
     prev
     next
   */
  const gotoPage = function(data, direction) {
    let seasonId, chapterId, callback

    if(data) {
      if(_.isFunction) { //回调
        callback = data
      } else {
        seasonId = data.seasonId
        chapterId = data.chapterId
      }
    }

    if(seasonId && chapterId) {
      Xut.View.LoadScenario({
        'scenarioId': seasonId,
        'chapterId': chapterId
      }, callback)
      return;
    }

    //ibooks模式下的跳转
    //全部转化成超链接
    if(Xut.IBooks.Enabled && Xut.IBooks.runMode()) {
      const pageIndex = direction === 'prev' ?
        Xut.IBooks.pageIndex - 1 :
        Xut.IBooks.pageIndex + 1
      location.href = pageIndex + ".xhtml";
      callback && callback()
      return
    }

    options.multiplePages && $globalEvent[direction](callback)
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
   * 跳转页面
   * 场景内部切换
   * 跳转到指定编号的页面
   * Action 类型跳转
   * xxtlink 超连接跳转,svg内嵌跳转标记处理
   * 文本框跳转
   * ........
   */
  Xut.View.GotoSlide = function(seasonId, chapterId) {

    //修正参数
    const fixParameter = function(pageIndex) {
      pageIndex = Number(pageIndex) - 1
      if(pageIndex < 0) {
        pageIndex = 0
      }
      return pageIndex
    }

    //ibooks模式下的跳转
    //全部转化成超链接
    if(Xut.IBooks.Enabled && Xut.IBooks.runMode() && chapterId) {
      location.href = chapterId + ".xhtml";
      return
    }

    //兼容数据错误
    if(!seasonId && !chapterId) return;

    //如果是一个参数是传递页码数,则为内部跳转
    if(arguments.length === 1) {
      //复位翻页按钮
      vm.$emit('change:showNext')
      return $globalEvent.scrollToPage(fixParameter(seasonId))
    }

    //场景模式内部跳转
    if(options.scenarioId == seasonId) {
      //chpaterId 转化成实际页码
      var sectionRang = Xut.data.query('sectionRelated', seasonId)
      var pageIndex = chapterId - sectionRang.start
      vm.$emit('change:showNext')
      return $globalEvent.scrollToPage(fixParameter(pageIndex))
    }

    //场景与场景的跳转
    return Xut.View.LoadScenario({
      'scenarioId': seasonId,
      'chapterId': chapterId
    })
  }


  /**
   * 是否为翻页的边界
   * @return {Boolean} [description]
   */
  Xut.View.GetFlipBorderBounce = function(distance) {
    return $globalEvent.isBorder(distance)
  }


  /**
   * 页面滑动
   * action 动作
   * direction 方向
   * distance 移动距离
   * speed 速度
   */
  Xut.View.MovePage = function(action, direction, distance, speed) {

    //如果禁止翻页模式 || 如果是滑动,不是边界
    if(!options.multiplePages ||
      $globalEvent.moving() ||
      action === 'flipMove' && $globalEvent.isBorder(distance)) {
      return
    }

    const pagePointer = $globalEvent.getPointer()

    vm.$scheduler.movePageBases({
      'distance': distance,
      'speed': speed,
      'direction': direction,
      'action': action,

      'frontIndex': pagePointer.frontIndex,
      'middleIndex': pagePointer.middleIndex,
      'backIndex': pagePointer.backIndex
    })
  };

}
