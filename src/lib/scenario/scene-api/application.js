/********************************************
 * 场景API
 * app应用接口
 ********************************************/

export function extendApplication(access, $$mediator, $$globalSwiper) {
  /**
   * 获取一个存在的实例对象
   * 区分不同层级page/master
   * 不同类型    content/widget
   */
  Xut.Application.GetExistObject = function (pageType, data) {
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
   * 获取全局滚动条对象
   */
  Xut.Application.GetScrollBarObject = function () {
    if ($$mediator.miniBar) {
      if ($$mediator.miniBar.length) {
        for (let i = 0; i < $$mediator.miniBar.length; i++) {
          if ($$mediator.miniBar[i].type === 'Scrollbar') {
            return $$mediator.miniBar[i]
          }
        }
      } else {
        if ($$mediator.miniBar.type === 'Scrollbar') {
          return $$mediator.miniBar
        }
      }
    }
  }

  /**
   * 获取迷你滚动条对象数量
   */
  Xut.Application.GetMiniBars = function () {
    if($$mediator.miniBar){
      return $$mediator.miniBar.length
    }
    return 0
  }

}
