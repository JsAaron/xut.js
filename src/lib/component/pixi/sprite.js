/**
 * pixi精灵动画
 * @param  {[type]} Utils   [description]
 * @param  {[type]} Config) {}          [description]
 * @return {[type]}         [description]
 */

import {
    Factory
}
from './factory'

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
    constructor: function(successCallback, failCallback, data, canvasRelated) {

        var self = this;
        this.data = data;
        this.canvasRelated = canvasRelated;
        //id标示
        //可以用来过滤失败的pixi对象
        this.contentId = data._id

        //精灵场景容器
        var spriteTtage = new PIXI.Container();
        //加入场景容器
        canvasRelated.addChild(spriteTtage);

        //矩形图
        var imgUrl = this.analysisPath(data);
        var imageFilename = imgUrl.replace(/^.*[\\\/]/, '');

        //support both png and jpg+mask 
        var maskFilename = "mask_" + imageFilename;
        var imageextension = imgUrl.split('.').pop();
        var maskUrl = imgUrl.replace('.jpg', '_mask.png');

        //保证和以前版本的兼容性，旧版本精灵只有一行，因此没有matrix参数
        var matrixCols = data.thecount;
        var matrixRows = 1;
        if (data.parameter) {
            //获取参数, 允许参数为null
            try {
                var paraObject = JSON.parse(data.parameter);
            } catch (err) {
                console.log('content parameter error')
                return;
            }
            var dataMatrix = paraObject.matrix;
            var matrixs = dataMatrix.split("-");
            matrixCols = matrixs[0];
            matrixRows = matrixs[1];
        }


        var jsonUrl = "lib/data/spritesheet.json" + "?imageurl=" + imgUrl + "&cols=" + matrixCols + "&rows=" + matrixRows + "&total=" + data.thecount + "&fps=" + data.fps;
        var movie;
        var contentId = this.contentId;

        //这里我们动态创建loader，加载完资源之后，就删除了。因此呢，也就没有缓存资源的情况了
        //我觉得这样似乎更好。因为我们整本书的动画很多，如果所有资源都缓存下来，可能内存消耗极大
        //现在这样每页动态创建，不加缓存，虽然性能上稍微差了一些，但是应该能够节省很多的内存
        var loader = new PIXI.loaders.Loader();
        if ('png' == imageextension) {
            loader
                .add(imageFilename, jsonUrl)
                .load(onAssetsLoaded);
        } else {
            var maskJsonUrl = "lib/data/spritesheet.json" + "?imageurl=" + maskUrl + "&cols=" + matrixCols + "&rows=" + matrixRows + "&total=" + data.thecount + "&fps=" + data.fps;
            loader
                .add(imageFilename, jsonUrl)
                .add(maskFilename, maskJsonUrl)
                .load(onAssetsLoaded);
        }
        loader = null;

        function onAssetsLoaded(loader, res) {


            //资源加载失败
            // if (arguments[1] && Object.keys(arguments[1]).length < 2) {
            //     failCallback(contentId);
            //     return
            // }

            //zhangyun, get the name of spritesheet
            var textures = [];
            var maskTextures = [];
            //create textures array from res's textures object
            var resObject, maskObject;
            if ("object" == typeof res) {
                //首次加载
                resObject = res[Object.keys(res)[0]];
            } else {
                //重复加载时，传递的是字符串参数
                //实际上这个分支没用到，如果需要处理缓存，则需要用到，现在我们没有缓存
                resObject = PIXI.loader.resources[res];
            }

            //var resTextures = resObject.textures;
            textures = Object.keys(resObject.textures).map(function(k) {
                return resObject.textures[k];
            });

            //get fps
            var fps = parseInt((resObject.url).split("fps=")[1]);

            movie = new PIXI.extras.MovieClip(textures);
            movie.width = data.scaleWidth;
            movie.height = data.scaleHeight;
            movie.position.x = data.scaleLeft;
            movie.position.y = data.scaleTop;

            //if there are masks, make mask textures;
            var imageextension = resObject.name.split('.').pop();
            if ("jpg" == imageextension) {
                var maskObject = res[Object.keys(res)[1]];

                maskTextures = Object.keys(maskObject.textures).map(function(k) {
                    return maskObject.textures[k];
                });
                movie.maskTextures = maskTextures;
                spriteTtage.addChild(movie.maskSprite);
            }

            //动画速率
            movie.animationSpeed = 0.15 * fps / 10;
            movie.play();
            spriteTtage.addChild(movie);

            self.movie = movie;

            //加载完毕
            successCallback(contentId);
        }
    },

    /**
     * 运行动画
     * @return {[type]} [description]
     */
    play: function() {
        //绘制页面
        this.uuid = this.canvasRelated.play('sprite')
    },

    /**
     * 停止动画
     * @return {[type]} [description]
     */
    stop: function() {
        this.canvasRelated.stop(this.uuid)
    },


    /**
     * 销毁动画
     * @return {[type]} [description]
     */
    destroy: function() {
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
    Sprite
}
