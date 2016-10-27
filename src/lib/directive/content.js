/**
 * 文本类型
 */
export default {

    /**
     * 创建热点元素结构（用于布局可触发点
     * 预创建
     * @param  {[type]} opts [description]
     * @return {[type]}      [description]
     */
    createDom(opts) {
        var sqlRet = opts.sqlRet,
            pageIndex = opts.pageIndex;
        return function(rootEle, pageIndex) {
            sqlRet['container'] = rootEle || opts.rootEle;
            return sqlRet;
        }
    }

}
