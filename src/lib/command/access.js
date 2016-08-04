/**
 * 获取访问对象参数
 * 如果pageObj 不存在，则取当前页面的
 * @return {[type]} [description]
 */
export function access(pageObj, callback) {
    let flag, contents, components, pageType
    pageObj = pageObj || Xut.Presentation.GetPageObj()
    if (pageObj) {
        contents = pageObj.baseGetContent();
        components = pageObj.baseGetComponent();
        pageType = pageObj.pageType || 'page';
        flag = callback(pageObj, contents.length && contents, components.length && components, pageType)
    }
    return flag;
}
