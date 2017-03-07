/**
 * 手动触发控制
 * @return {[type]} [description]
 */
import directives from '../directive/index'

export function $$trigger(target, attribute, rootNode, pageIndex) {

  const key = target.id

  if(key) {
    const tag = key.split('_');
    const type = tag[0];
    const id = tag[1];
    const dir = directives[type];

    if(dir && dir.trigger) {

      //获取页面类型
      const pageType = function() {
        if(rootNode && rootNode.id) {
          return /page/.test(rootNode.id) ? 'page' : 'master';
        } else {
          return 'page';
        }
      }();

      const data = {
        "id": id,
        "activityId": id,
        "key": key,
        "type": type,
        "rootNode": rootNode,
        "target": target,
        "pageIndex": pageIndex,
        'pageType': pageType
      }

      //如果是重复点击
      //比如widget零件
      let instance
      if(instance = Xut.Application.GetSpecifiedObject(pageType, data)) {
        if(instance.toggle) {
          //如果有对应的处理方法
          return instance.toggle()
        }
      }

      //委派新的任务
      dir.trigger(data)
    }
  }
}