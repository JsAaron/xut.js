/********************************************
 * 场景API
 * app应用接口
 ********************************************/

export function extendApplication(access) {
  /**
   * 获取一个存在的实例对象
   * 区分不同层级page/master
   * 不同类型    content/widget
   */
  Xut.Application.GetExistObject = function(pageType, data) {
    return access(function(manager, pageType) {
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


}
