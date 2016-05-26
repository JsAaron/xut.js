/**
 * pixi精灵动画
 * @param  {[type]} Utils   [description]
 */

import { observe } from '../../../observer/observe'
import {
    addRenderer,
    stopRenderer,
    destroyRenderer
}
from '../core/index'


/**
 * pixi类
 * 子动画基类
 * @param {[type]} options [description]
 */
var Factory = Xut.CoreObject.extend({

    /**
     * 初始化
     * @param  {[type]} data          [description]
     * @param  {[type]} canvasRelated [description]
     * @return {[type]}               [description]
     */
    init: function() {
        var pixi = this;
        this.action = 'init'
        var args = [
            /**
             * 成功回调
             * @param  {[type]} contentId [description]
             * @return {[type]}           [description]
             */
            function successCallback() {
                //加载完成构建 ppt实例
                pixi.$emit('load')
            },
            /**
             * 失败回调
             * @param  {[type]} contentId [description]
             * @return {[type]}           [description]
             */ 
            function failCallback() {
                //删掉对应的cid记录
                // var index =  canvasRelated.cid.indexOf(contentId)
                // canvasRelated.cid.splice(index,1);
                console.log('failCallback')
            }
        ]
        this.constructor.apply(this, args.concat(slice.call(arguments)))
    }, 
 
    //所有pixi动画共享一个刷新器
    //所以在每一个子动画中传递一个刷新器接口
    playAnim: function() {
        this.action = 'play'
        this.play && this.play(addRenderer)
    }, 
    stopAnim: function() {
        this.action = 'stop'
        this.stop && this.stop(stopRenderer)
    },
    //复位
    resetAnim: function() {
        this.action = 'reset'
        this.reset && this.reset()
    },
    destroyAnim: function() {
        this.action = 'destroy'
        this.destroy && this.destroy(destroyRenderer)
    }

});
  
observe.call(Factory.prototype);


export {
    Factory
}
