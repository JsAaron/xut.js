/**
 * 获取访问对象参数
 * 如果pageBase 不存在，则取当前页面的
 * @return {[type]} [description]
 */
export default function access(pageBase, callback) {

  //如果只提供回调函数
  if (arguments.length === 1 && _.isFunction(pageBase)) {
    callback = pageBase
    pageBase = Xut.Presentation.GetPageBase && Xut.Presentation.GetPageBase()
  } else {
    pageBase = pageBase || (Xut.Presentation.GetPageBase && Xut.Presentation.GetPageBase())
  }

  if (pageBase) {
    const activitys = pageBase.baseGetActivity();
    const components = pageBase.baseGetComponent();
    const pageType = pageBase.pageType || 'page';
    const flag = callback(pageBase, activitys, components.length && components, pageType)
    return flag
  }
}
