/**
 * 动作复位状态
 * @return {[type]} [description]
 */


//========================================================
//          复位状态
//          状态控制
//  如果返回false证明有热点,
//  第一次只能关闭热点不能退出页面
//=========================================================
export function recovery(pageObj) {
    return Xut.accessControl(pageObj, function(pageObj, ContentObjs, ComponentObjs) {
        var falg = false;
        _.each([ContentObjs, ComponentObjs], function(collectionObj) {
            collectionObj && _.each(collectionObj, function(obj) {
                //如果返回值是false,则是算热点处理行为
                if (obj.recovery && obj.recovery()) {
                    falg = true;
                }
            })
        })
        return falg;
    })
}
