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

export function initSceneApi($$mediator) {
  let $$globalSwiper = $$mediator.$$globalSwiper

  //页面与母版的管理器
  let access = createaAccess({
    page: $$mediator.$$scheduler.pageMgr,
    master: $$mediator.$$scheduler.masterMgr
  })

  extendPresentation(access, $$globalSwiper) //数据接口
  extendView($$mediator, access, $$globalSwiper) //视图接口
  extendAssist(access, $$globalSwiper) // 辅助对象
  extendContent(access, $$globalSwiper) //content对象
  extendApplication(access, $$globalSwiper) //app应用接口

  return function () {
    $$globalSwiper = null
    access = null
    $$mediator = null
  }
}
