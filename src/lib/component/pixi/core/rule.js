/**
 * 对外规则接口
 * @param  {[type]} Utils   [description]
 */

import {
    Observer
} from '../../../observer/index'
import {
    addRenderer,
    stopRenderer,
    destroyRenderer
}
from '../core/index'

let arr = [];
let slice = arr.slice;


class Rule extends Observer {

    /**
     * 初始化
     * @param  {[type]} data          [description]
     * @param  {[type]} canvasRelated [description]
     * @return {[type]}               [description]
     */
    constructor() {
        super()
        var self = this
        this.action = 'init'

        /**
         * 成功回调
         * @param  {[type]} contentId [description]
         * @return {[type]}           [description]
         */
        this.successCallback = function() {
            //加载完成构建 ppt实例
            self.$emit('load')
        }

        /**
         * 失败回调
         * @param  {[type]} contentId [description]
         * @return {[type]}           [description]
         */
        this.failCallback = function() {
            //删掉对应的cid记录
            // var index =  canvasRelated.cid.indexOf(contentId)
            // canvasRelated.cid.splice(index,1);
            console.log('failCallback')
        }
    }

    //所有self动画共享一个刷新器
    //所以在每一个子动画中传递一个刷新器接口
    playAnim() {
        this.action = 'play'
        this.play && this.play(addRenderer)
    }

    stopAnim() {
        this.action = 'stop'
        this.stop && this.stop(stopRenderer)
    }

    //复位
    resetAnim() {
        this.action = 'reset'
        this.reset && this.reset()
    }

    destroyAnim() {
        this.action = 'destroy'
        this.destroy && this.destroy(destroyRenderer)
    }
}


export {
    Rule
}