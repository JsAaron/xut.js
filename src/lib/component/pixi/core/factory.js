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

var arr = [];
var slice = arr.slice;
var concat = arr.concat;

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
    init: function(options) {
        var pixi = this;
        var args = [
            /**
             * 成功回调
             * @param  {[type]} contentId [description]
             * @return {[type]}           [description]
             */
            function successCallback(contentId) {
                //加载完成构建 ppt实例
                pixi.$emit('load')
            },
            /**
             * 失败回调
             * @param  {[type]} contentId [description]
             * @return {[type]}           [description]
             */
            function failCallback(contentId) {
                //删掉对应的cid记录
                // var index =  canvasRelated.cid.indexOf(contentId)
                // canvasRelated.cid.splice(index,1);
                console.log('failCallback')
            }
        ]
        this.constructor.apply(this, args.concat(slice.call(arguments)))
    },

    /**
     * 创建图片地址
     * @return {[type]}         [description]
     */
    analysisPath: function(conData) {
        var pathImg,
            imgContent = conData.md5,
            //是gif格式
            isGif = /.gif$/i.test(imgContent),
            //原始地址
            originalPathImg = Xut.config.pathAddress + imgContent;
        if (isGif) {
            //处理gif图片缓存+随机数
            pathImg = Xut.createRandomImg(originalPathImg)
        } else {
            pathImg = originalPathImg;
        }
        return pathImg;
    },

    //所有pixi动画共享一个刷新器
    //所以在每一个子动画中传递一个刷新器接口
    playAnim: function() {
        this.play(addRenderer)
    },
    stopAnim: function() {
        this.stop(stopRenderer)
    },
    destroyAnim: function() {
        this.destroy(destroyRenderer)
    },

});

observe.call(Factory.prototype);


export {
    Factory
}
