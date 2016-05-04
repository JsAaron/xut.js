/**
 * pixi精灵动画
 * @param  {[type]} Utils   [description]
 */

import { observe } from '../../observer/observe'

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
     * 播放
     * @param  {[type]} completeCallback [完成回调]
     * @return {[type]}                  [description]
     */
    playPixi: function(completeCallback) {
        this.checkValidity(function() {
            this.play();
        })
    },

    //停止
    stopPixi: function() {
        this.checkValidity(function() {
            this.stop();
        })
    },

    //相关
    destroyPixi: function() {
        this.checkValidity(function() {
            this.destroy();
        })
    },

    /**
     * 检测是否能有效运行
     * pixi对象是否有效加载
     * @return {[type]} [description]
     */
    checkValidity: function(successCallback) {
        var failCid = this.canvasRelated.failCid;
        var contentId = this.contentId;
        //无效
        if (failCid.length && -1 !== failCid.indexOf(contentId)) {
            return;
        }
        //有效
        successCallback && successCallback.call(this)
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
    }

});

observe.call(Factory.prototype);


export {
    Factory
}
