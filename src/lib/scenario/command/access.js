/**
 * 获取访问对象参数
 * 如果pageObj 不存在，则取当前页面的
 * @return {[type]} [description]
 */
export default function access(pageObj, callback) {

  //如果只提供回调函数
  if(arguments.length === 1 && _.isFunction(pageObj)) {
    callback = pageObj
    pageObj = Xut.Presentation.GetPageBase()
  } else {
    pageObj = pageObj || Xut.Presentation.GetPageBase()
  }

  if(pageObj) {
    const contents = pageObj.baseGetContent();
    const components = pageObj.baseGetComponent();
    const pageType = pageObj.pageType || 'page';
    const flag = callback(pageObj, contents.length && contents, components.length && components, pageType)
    return flag
  }
}
