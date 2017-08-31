import { config } from '../../config/index'
import directives from '../directive/index'

/**
 * 全局事件
 * 手动触发控制
 */
export function $trigger({
  /*ppt数据*/
  target,
  attribute,
  rootNode,
  pageIndex
}, columnData) {
  let id, type
  let key = target.id
  if (columnData) {
    type = columnData.type
    id = columnData.id
  } else if (key) {
    const tag = key.split('_');
    type = tag[0];
    id = tag[1];
  }

  if (type && id) {
    const directive = directives[type];
    if (directive && directive.trigger) {

      /*获取页面类型,page或master*/
      const pageType = rootNode && rootNode.id ?
        /page/.test(rootNode.id) ? 'page' : 'master' :
        'page';

      const data = { id, key, type, rootNode, target, pageIndex, pageType, "activityId": id, columnData }

      /*如果有代码跟踪*/
      config.sendTrackCode('hot', {
        id,
        type,
        pageId: Xut.Presentation.GetPageId(pageType, pageIndex),
        eventName: 'tap'
      })

      /*如果是重复点击,比如widget零件*/
      const instance = Xut.Application.GetExistObject(pageType, data)
      if (instance) {
        if (instance.toggle) {
          //如果有对应的处理方法
          return instance.toggle()
        }
      }

      //委派新的任务
      directive.trigger(data)
    }
  }
}
