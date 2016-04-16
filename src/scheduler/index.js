export * from './auto'
export * from './trigger'
export * from './suspend'
export * from './original'
export * from './recovery'


/**
 * 获取访问对象参数
 *
 * 如果pageObj 不存在，则取当前页面的
 * 
 * @return {[type]} [description]
 */
Xut.accessControl = function(pageObj, callback) {
    var flag, pageObj = pageObj || Xut.Presentation.GetPageObj();
    if (pageObj) {
        var contents = pageObj.baseGetContent();
        var components = pageObj.baseGetComponent();
        var pageType = pageObj.pageType || 'page';
        flag = callback(pageObj, contents.length && contents, components.length && components, pageType)
    }
    return flag;
}
