/**
 * 复位到初始化的状态
 * @return {[type]} [description]
 */

import { access } from './access'

/**
 * 优化检测
 * @param  {Function} fn [description]
 * @return {[type]}      [description]
 */
let checkOptimize = (fn) => {
    if (!Xut.config.scrollPaintingMode) {
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
export function original(pageObj) {

    access(pageObj, (pageObj, ContentObjs, ComponentObjs) => {

        //母版对象不还原
        if (pageObj.pageType === 'master') return;

        var element;

        if (element = pageObj.element) {
            checkOptimize(() => {
                element.hide();
            })


            //销毁所有widget类型的节点
            if (ComponentObjs) {
                _.each(ComponentObjs, (obj) => {
                    obj && obj.destroy();
                });
                //销毁widget对象管理
                pageObj.baseRemoveComponent();
            }

            //停止动作
            ContentObjs && _.each(ContentObjs, (obj) => {
                if (!Xut.CreateFilter.has(obj.pageId, obj.id)) {
                    obj.resetAnimation && obj.resetAnimation();
                }
            })

            checkOptimize(() => {
                setTimeout(() => {
                    element.show();
                    element = null;
                }, 0);
            })
        }

    })
}
