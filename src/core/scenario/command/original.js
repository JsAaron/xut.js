import { config } from '../../config/index'

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
  if (!config.launch.visualMode !== 4) {
    fn && fn()
  }
}


/**
 * 翻一页处理： 翻页完毕触发
 * 大量操作DOM结构，所以先隐藏根节点
 * 1 删除所有widget节点
 * 2 复位所有content节点
 * @param  {[type]} pageBase [description]
 * @return {[type]}         [description]
 */
export function $original(pageBase) {

  access(pageBase, (pageBase, activityObjs, componentObjs) => {

    //母版对象不还原
    if (pageBase.pageType === 'master') {
      //因为苗苗学的问题，需要单独处理hasForumClose的还原
      //2017.11.30
      activityObjs && _.each(activityObjs, (obj) => {
        if (!Xut.CreateFilter.has(obj.pageId, obj.id)) {
          if (obj.dataRelated && obj.dataRelated.hasForumClose) {
            obj.reset && obj.reset();
          }
        }
      })
      return
    };

    var $containsNode

    if ($containsNode = pageBase.getContainsNode()) {

      //隐藏根节点
      //display:none下刷新
      hasOptimize(() => {
        $containsNode.hide()
      })

      //content类型复位
      activityObjs && _.each(activityObjs, (obj) => {
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
        pageBase.baseRemoveComponent()
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
