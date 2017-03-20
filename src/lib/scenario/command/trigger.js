import { config } from '../../config/index'
import directives from '../directive/index'

/**
 * 全局事件
 * 手动触发控制
 */
export function $$trigger(target, attribute, rootNode, pageIndex) {

  const key = target.id

  if(key) {
    const tag = key.split('_');
    const type = tag[0];
    const id = tag[1];
    const directive = directives[type];

    if(directive && directive.trigger) {

      /*获取页面类型,page或master*/
      const pageType = rootNode && rootNode.id ?
        /page/.test(rootNode.id) ? 'page' : 'master' :
        'page';

      const data = { id, key, type, rootNode, target, pageIndex, pageType, "activityId": id, }

      /*如果有代码跟踪*/
      if(config.launch && config.launch.trackCode && config.launch.trackCode['hot']) {
        Xut.Application.Notify('trackCode', 'hot', _.extend({
          id,
          type,
          pageId: Xut.Presentation.GetPageId(pageType, pageIndex),
          eventName: 'tap'
        }, config.launch.trackCode.dataset))
      }

      /*如果是重复点击,比如widget零件*/
      const instance = Xut.Application.GetSpecifiedObject(pageType, data)
      if(instance) {
        if(instance.toggle) {
          //如果有对应的处理方法
          return instance.toggle()
        }
      }

      //委派新的任务
      directive.trigger(data)
    }
  }
}
