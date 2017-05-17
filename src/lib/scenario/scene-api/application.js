/********************************************
 * 场景API
 * app应用接口
 ********************************************/

export function extendApplication(access, $globalSwiper) {

  /**
   * 获取一个存在的实例对象
   * 区分不同层级page/master
   * 不同类型    content/widget
   */
  Xut.Application.GetSpecifiedObject = function (pageType, data) {
    return access(function (manager, pageType) {
      var pageObj;
      if (pageObj = manager.$$getPageBase(data.pageIndex)) {
        if (data.type === 'Content') {
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
   * 是否启动
   * @return {[type]} [description]
   */
  Xut.Application.hasEnabled = function () {
    return $globalSwiper.hasEnabled()
  }

  /**
   * 是否翻页中
   * @return {Boolean} [description]
   */
  Xut.Application.Swiping = function () {
    return $globalSwiper.moving()
  }

  /**
   * 禁止滑动
   */
  Xut.Application.SwipeBan = function () {
    $globalSwiper.swipeBan();
  }

  /**
   * 允许滑动
   */
  Xut.Application.SwipeEnable = function () {
    $globalSwiper.swipeEnable();
  }

  /**
   * 设置翻页完成
   */
  Xut.Application.tiggerFilpComplete = function (...arg) {
    $globalSwiper.setTransitionComplete(...arg)
  }

  _.each([
    "closeSwipe",
    "openSwipe"
  ], function (operate) {
    Xut.Application[operate] = function () {
      $globalSwiper[operate]();
    }
  })


}
