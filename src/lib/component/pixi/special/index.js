/**
 * 特殊pixi精灵动画
 * @param  {[type]} Utils   [description]
 * @param  {[type]} Config) {}          [description]
 * @return {[type]}         [description]
 */

import { Factory} from '../factory'



var specialSprite = Factory.extend({

    /**
     * 初始化
     * @param  {[type]} data          [description]
     * @param  {[type]} canvasRelated [description]
     * @return {[type]}               [description]
     */
    constructor: function (successCallback, failCallback, data, canvasRelated) {

        var self = this;
        this.data = data;
        this.canvasRelated = canvasRelated;
        //id标示
        //可以用来过滤失败的pixi对象
        this.contentId = data._id


        successCallback(this.contentId);
    },

    /**
     * 运行动画
     * @return {[type]} [description]
     */
    play: function () {
        //绘制页面
        this.uuid = this.canvasRelated.play('sprite')
    },

    /**
     * 停止动画
     * @return {[type]} [description]
     */
    stop: function () {
        this.canvasRelated.stop(this.uuid)
    },


    /**
     * 销毁动画
     * @return {[type]} [description]
     */
    destroy: function () {
        //if there are movie sprite, destory it
        if (this.movie) {
            //remove it from stage
            if (this.stage) {
                this.stage.removeChild(this.movie);
            }
            //remove texture for movie
            for (var i = 0; i < this.movie.textures.length; i++) {
                this.movie.textures[i].destroy(true);
                if (this.movie.maskSprite) {
                    this.movie.maskTextures[i].destroy(true);
                }
            }

            //remove movie sprite
            this.movie.destroy(true, true);
        }
        this.canvasRelated.destroy();
    }


})


export {
    specialSprite
}
