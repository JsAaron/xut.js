/*******************************************
 *   canvas处理模块
 *   2016.2新增机制
 *   扩充pixi动画
 *                                      *
 ******************************************/
import {
  addQueue,
  removeQueue,
  destroyQueue
}
from './queue'


/**
 * 制作uuid
 * @return {[type]} [description]
 */
const makeGuid = () => Xut.guid('rAF')


/**
 * 不断绘制
 * task 外部任务
 * type 执行play的类型 高级，普通精灵
 * @return {[type]} [description]
 */
export function addRenderer(pageIndex, callback, mark) {
  let uuid = makeGuid()
  if(mark) {
    uuid = uuid + '-' + mark
  }
  addQueue(pageIndex, uuid, function play() {
    callback && callback()
  });
  return uuid;
}

/**
 * 停止绘制
 * @return {[type]} [description]
 */
export function stopRenderer(pageIndex, uuid) {
  removeQueue(pageIndex, uuid);
}


/**
 * 销毁
 * @return {[type]} [description]
 */
export function destroyRenderer(pageIndex, uuid) {
  destroyQueue(pageIndex, uuid);
}