/*********************************************************************
 *                 构建页面对象
 *             实现目标：
 *                快速翻页
 *                最快中断任务
 *                提高优先级
 *
 *             1 构建四个大任务，每个大人物附属一堆小任务
 *             2 每次触发一个新的任务，都会去检测是否允许创建的条件
 *
 *  2014.11.18
 *  新增canvan模式
 *    contentMode 分为  0 或者 1
 *    0 是dom模式
 *    1 是canvas模式
 *    以后如果其余的在增加
 *    针对页面chapter中的parameter写入 contentMode   值为 1
 *    如果是canvas模式的时候，同时也是能够存在dom模式是
 *
 *                                                         *
 **********************************************************************/

import initstate from './internal/init'
import threadCheck from './internal/thread'
import threadExternal from './internal/thread-api'
import dataExternal from './internal/data-api'
import destroy from './internal/destroy'
import movePage from './move/page'
import moveParallax from './move/parallax'

export class Pagebase {
  constructor(options) {
    this.init(options)
  }
}

const baseProto = Pagebase.prototype

initstate(baseProto)
threadCheck(baseProto)
threadExternal(baseProto)
dataExternal(baseProto)
movePage(baseProto)
moveParallax(baseProto)
destroy(baseProto)
