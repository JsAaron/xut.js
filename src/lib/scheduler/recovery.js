/**
 * 动作复位状态
 * @return {[type]} [description]
 */
import { access } from './access'


/**
 * 复位状态/状态控制
 * 如果返回false证明有热点
 * 第一次只能关闭热点不能退出页面
 * @param  {[type]} pageObj [description]
 * @return {[type]}         [description]
 */
export function recovery(pageObj) {
    return access(pageObj, (pageObj, ContentObjs, ComponentObjs) => {
        let falg = false;
        _.each([ContentObjs, ComponentObjs], (collectionObj) => {
            collectionObj && _.each(collectionObj, (obj) => {
                //如果返回值是false,则是算热点处理行为
                if (obj.recovery && obj.recovery()) {
                    falg = true;
                }
            })
        })
        return falg;
    })
}
