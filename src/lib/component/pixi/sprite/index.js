/**
 * pixi精灵动画
 * @param  {[type]} Utils   [description]
 * @param  {[type]} Config) {}          [description]
 * @return {[type]}         [description]
 */

import { Factory } from '../core/factory'

//普通精灵动画
import { Sprite as OrdinarySprite } from './sprite'

/**
 * 精灵动画
 * @param  {[type]} data          [description]
 * @param  {[type]} canvasRelated [description]
 * @return {[type]}               [description]
 */
var Sprite = Factory.extend({

    /**
     * 初始化
     * @param  {[type]} data          [description]
     * @param  {[type]} canvasRelated [description]
     * @return {[type]}               [description]
     */
    constructor: function (successCallback, failCallback, options) {
        this.pageIndex = options.pageIndex
        //普通精灵动画
        this.sprite = new OrdinarySprite(options, successCallback)
    },

    /**
     * 运行动画
     * @return {[type]} [description]
     */
    play: function (addQueue) {
        var sprite = this.sprite
        //绘制页面
        this.uuid = addQueue(this.pageIndex, function () {
             sprite.render()
        })
    },

    /**
     * 停止动画
     * stopQueue 停止队列
     * @return {[type]} [description]
     */
    stop: function (stopQueue) {
        stopQueue(this.pageIndex, this.uuid)
    },

    /**
     * 销毁动画
     * @return {[type]} [description]
     */
    destroy: function (destroyQueue) {
        destroyQueue(this.pageIndex, this.uuid)
    }

})


export {
Sprite
}
