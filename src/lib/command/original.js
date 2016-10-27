/**
 * 复位到初始化的状态
 * @return {[type]} [description]
 */

import access from './access'

/**
 * 优化检测
 * @param  {Function} fn [description]
 * @return {[type]}      [description]
 */
let hasOptimize = (fn) => {
    if (!Xut.config.visualMode !== 1) {
        fn && fn()
    }
}


/**
 * 翻一页处理： 翻页完毕触发
 * 大量操作DOM结构，所以先隐藏根节点
 * 1 删除所有widget节点
 * 2 复位所有content节点
 * @param  {[type]} pageObj [description]
 * @return {[type]}         [description]
 */
export function $$original(pageObj) {

    access(pageObj, (pageObj, contentObjs, componentObjs) => {

        //母版对象不还原
        if (pageObj.pageType === 'master') return;

        var $containsNode

        if ($containsNode = pageObj.getContainsNode()) {

            //隐藏根节点
            //display:none下刷新
            hasOptimize(() => {
                $containsNode.hide()
            })

            //content类型复位
            contentObjs && _.each(contentObjs, (obj) => {
                if (!Xut.CreateFilter.has(obj.pageId, obj.id)) {
                    obj.reset && obj.reset();
                }
            })

            //销毁所有widget类型的节点
            if (componentObjs) {
                _.each(componentObjs, (obj) => {
                    obj && obj.destroy();
                });
                //销毁widget对象管理
                pageObj.baseRemoveComponent()
            }

            hasOptimize(() => {
                setTimeout(() => {
                    $containsNode.show();
                    $containsNode = null;
                }, 0);
            })
        }

    })
}
