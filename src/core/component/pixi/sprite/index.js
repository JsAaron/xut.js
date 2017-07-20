/**
 * pixi精灵动画
 * @param  {[type]} Utils   [description]
 * @param  {[type]} Config) {}          [description]
 * @return {[type]}         [description]
 */

import { Rule } from '../index'
//普通精灵动画
import { Sprite as OrdinarySprite } from './sprite'


/**
 * 精灵动画
 */
class Sprite extends Rule {

  constructor(options) {
    super()
    this.pageIndex = options.pageIndex
    //普通精灵动画
    this.sprite = new OrdinarySprite(options, this.successCallback)
  }

  /**
   * 运行动画
   * @return {[type]} [description]
   */
  _play(addQueue) {
    var sprite = this.sprite
    //绘制页面
    this.uuid = addQueue(this.pageIndex, function() {
      sprite.render()
    })
  }

  /**
   * 停止动画
   * stopQueue 停止队列
   * @return {[type]} [description]
   */
  _stop(stopQueue) {
    stopQueue(this.pageIndex, this.uuid)
  }

  /**
   * 销毁动画
   * @return {[type]} [description]
   */
  _destroy(destroyQueue) {
    this.sprite.destroy()
    destroyQueue(this.pageIndex, this.uuid)
  }
}



export {
  Sprite
}