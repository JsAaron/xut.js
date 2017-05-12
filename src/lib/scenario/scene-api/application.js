/********************************************
 * 场景API
 * app应用接口
 ********************************************/

export function extendApplication(access, $globalEvent) {

  /**
   * 获取一个存在的实例对象
   * 区分不同层级page/master
   * 不同类型    content/widget
   */
  Xut.Application.GetSpecifiedObject = function(pageType, data) {
    return access(function(manager, pageType) {
      var pageObj;
      if(pageObj = manager.$$getPageBase(data.pageIndex)) {
        if(data.type === 'Content') {
          return pageObj.baseSpecifiedContent(data);
        } else {
          return pageObj.baseSpecifiedComponent(data);
        }
      }
    }, pageType)
  }


  /**
   * 应用滑动接口
   * @return {[type]}
   */


  /**
   * 是否锁定页面
   * @return {[type]} [description]
   */
  Xut.Application.HasLockFlip = function() {
    return $globalEvent.hasLockFlip()
  }

  /**
   * 是否翻页中
   * @return {Boolean} [description]
   */
  Xut.Application.Swiping = function() {
    return $globalEvent.isMoving()
  }

  /**
   * 禁止滑动
   */
  Xut.Application.Bansliding = function() {
    $globalEvent.bansliding();
  }

  /**
   * 允许滑动
   */
  Xut.Application.Allowliding = function() {
    $globalEvent.allowliding();
  }

  /**
   * 获取翻页速率
   * @return {[type]} [description]
   */
  Xut.Application.getFlipOverSpeed = function(...arg) {
    return $globalEvent.getFlipOverSpeed(...arg)
  }

  /**
   * 设置翻页完成
   */
  Xut.Application.tiggerFilpComplete = function(...arg) {
    $globalEvent.setTransitionComplete(...arg)
  }

  _.each([
    "closeSwipe",
    "openSwipe"
  ], function(operate) {
    Xut.Application[operate] = function() {
      $globalEvent[operate]();
    }
  })


}
