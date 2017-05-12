/********************************************
 * 场景API
 * 此模块的所有方法都是动态修正上下文，自动切换场景
 * @return {[type]} [description]
 ********************************************/


import { extendPresentation } from './presentation'
import { extendView } from './view'
import { extendAssist } from './assist'
import { extendContent } from './content'
import { extendApplication } from './application'
import { createaAccess } from './access'

export function initSceneApi(vm) {
  let $globalEvent = vm.$globalEvent

  //页面与母版的管理器
  let access = createaAccess({
    page: vm.$dispatcher.pageMgr,
    master: vm.$dispatcher.masterMgr
  })

  extendPresentation(access, $globalEvent) //数据接口
  extendView(vm, access, $globalEvent) //视图接口
  extendAssist(access, $globalEvent) // 辅助对象
  extendContent(access, $globalEvent) //content对象
  extendApplication(access, $globalEvent) //app应用接口

  return function () {
    $globalEvent = null
    access = null
    vm = null
  }
}
