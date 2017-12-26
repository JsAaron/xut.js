import { typeFilter } from './page-type'

/**
 * 合并参数设置
 * 1 pageMgr
 * 2 masterMgr
 * 3 修正pageType
 * 4 args参数
 * 5 回调每一个上下文
 */
export function createaAccess(mgr) {
  return (callback, pageType, args, eachContext) => {
    //如果第一个参数不是pageType模式
    //参数移位
    if (pageType !== undefined && -1 === typeFilter.indexOf(pageType)) {
      var temp = args;
      args = pageType;
      eachContext = temp;
      pageType = 'page';
    }
    //pageIndex为pageType参数
    if (-1 !== typeFilter.indexOf(args)) {
      pageType = args;
      args = null;
    }
    pageType = pageType || 'page';
    if (mgr[pageType]) {
      return callback(mgr[pageType], pageType, args, eachContext)
    } else {
      Xut.$warn({
        type: 'api',
        content: `传递到access的pageType错误，pageType=${pageType}`,
        color: 'red'
      })
    }
  }
}
