/**
 * 复位到初始化的状态
 * @return {[type]} [description]
 */

/////////
//优化检测 //
/////////
function checkOptimize(fn) {
    if (!Xut.config.scrollPaintingMode) {
        fn && fn()
    }
}

//===============================================================
//
//           翻一页处理： 翻页完毕触发
//
//  大量操作DOM结构，所以先隐藏根节点
//  1 删除所有widget节点
//  2 复位所有content节点
//
//==============================================================
export function original(pageObj) {

    Xut.accessControl(pageObj, function(pageObj, ContentObjs, ComponentObjs) {

        //母版对象不还原
        if (pageObj.pageType === 'master') return;

        var element;

        if (element = pageObj.element) {
            checkOptimize(function() {
                element.hide();
            })


            //销毁所有widget类型的节点
            if (ComponentObjs) {
                _.each(ComponentObjs, function(obj) {
                    obj && obj.destroy();
                });
                //销毁widget对象管理
                pageObj.baseRemoveComponent();
            }

            //停止动作
            ContentObjs && _.each(ContentObjs, function(obj) {
                if (!Xut.CreateFilter.has(obj.pageId, obj.id)) {
                    obj.resetAnimation && obj.resetAnimation();
                }
            })

            checkOptimize(function() {
                setTimeout(function() {
                    element.show();
                    element = null;
                }, 0);
            })
        }

    })
}
