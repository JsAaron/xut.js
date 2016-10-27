/**
 * 停止动作
 * 给全局stop接口使用
 * 与suspend的区别就是，这个全除了suspend的处理，还包括零件的暂停
 * @return {[type]} [description]
 */
import access from './access'


/**
 * 复位状态/状态控制
 * 如果返回false证明有热点
 * 第一次只能关闭热点不能退出页面
 * @param  {[type]} pageObj [description]
 * @return {[type]}         [description]
 */
export function $$stop(pageObj) {

    return access(pageObj, (pageObj, contentObjs, componentObjs) => {

        //如果返回值是false,则是算热点处理行为
        let falg = false

        //content类型
        _.each(contentObjs, function(obj) {
            if (obj.stop && obj.stop()) {
                falg = true
            }
        })

        //零件类型
        _.each(componentObjs, function(obj) {
            if (obj.stop && obj.stop()) {
                falg = true
            }
        })

        return falg;
    })
}
