/**
 * 手动触发控制
 * @return {[type]} [description]
 */

import { Bind } from '../pagebase/task/dispenser/bind'

export function trigger(target, attribute, rootNode, pageIndex) {

    var key, tag, type, id, dir, data, pageType, instance;

    if (key = target.id) {

        tag = key.split('_');
        type = tag[0];
        id = tag[1];
        dir = Bind[type];

        if (dir && dir.eventDelegate) {

            //获取页面类型
            pageType = function() {
                if (rootNode && rootNode.id) {
                    return /page/.test(rootNode.id) ? 'page' : 'master';
                } else {
                    return 'page';
                }
            }();

            data = {
                "id": id,
                "activityId": id,
                "key": key,
                "type": type,
                "rootNode": rootNode,
                "target": target,
                "pageIndex": pageIndex,
                'pageType': pageType
            };

            //如果是重复点击
            if (instance = Xut.Application.GetSpecifiedObject(pageType, data)) {
                if (instance.dispatchProcess) {
                    //如果有对应的处理方法
                    return instance.dispatchProcess();
                }
            }

            //委派新的任务
            dir.eventDelegate(data)
        }
    }
}
