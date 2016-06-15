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


//原型接口
import {
    init
} from './proto/init'
import {
    threadExternal
} from './proto/thread'
import {
    dataExternal
} from './proto/data'
import {
    destroy
} from './proto/destroy'


export class Pagebase {
    constructor(options) {
        this.initTasks(options)
    }
}

var baseProto = Pagebase.prototype
 
//初始化
init(baseProto)
//多线程接口
threadExternal(baseProto)
//数据接口
dataExternal(baseProto)
//销毁
destroy(baseProto)


