/**
 * 精灵动画
 * 1 普通精灵
 * 2 高级精灵
 * @param  {[type]} Config) {}          [description]
 * @return {[type]}         [description]
 */
import {
    Factory
}
from './factory'

/**
 * 创建高级精灵动画
 * @param  {[type]} data          [description]
 * @param  {[type]} contentPrefix [description]
 * @param  {[type]} path          [description]
 * @return {[type]}               [description]
 */
function spiritAni(data, path) {
    this.imagesArray = new Array();
    this.maskArray = new Array();
    //默认png格式资源
    this.resType = 0;
    //默认循环播放
    this.loop = 0;
    this.data = data;
    //this.contentPrefix = contentPrefix;
    this.ResourcePath = path;
    this.action = this.data.params["actList"].split(",")[0];
    this.FPS = parseInt(this.data.params[this.action].fps);
    this.imageList = this.data.params[this.action].ImageList;
    //jpg+mask格式资源
    if (this.imageList[0].name.split(".")[1] == "jpg") {
        this.resType = 1;
    }
    this.firstTime = true;
    this.imageIndex = 0;
    //得到图片集合
    this.parseSpiritImages(data, path);
}

/**
 * 解析数据
 * @param  {[type]} data          [description]
 * @param  {[type]} contentPrefix [description]
 * @param  {[type]} path          [description]
 * @return {[type]}               [description]
 */
spiritAni.prototype.parseSpiritImages = function(data, path) {
    for (var i = 0; i < this.imageList.length; i++) {
        var temp = this.imageList[i];
        this.imagesArray.push(path + temp.name);
        if (this.resType) {
            this.maskArray.push(path + temp.name.split(".")[0] + "_mask.png")
        }
    }
}

/**
 * 绘制第一帧
 * @param  {[type]} canvasRelated [description]
 * @return {[type]}               [description]
 */
spiritAni.prototype.init = function(canvasRelated, contents) {
    //初始化位置信息
    this.initPosition(contents);

    //精灵场景容器
    var stage = new PIXI.Container();
    //加入容器
    canvasRelated.addChild(stage);

    this.texture = new Array();
    this.maskTexture = new Array();

    //jpg+mask蒙板
    if (this.resType) {
        for (var i = 0; i < this.maskArray.length; i++) {
            this.maskTexture[i] = PIXI.Texture.fromImage(this.maskArray[i]);
        }
        this.maskSprite = new PIXI.Sprite(this.maskTexture[0]);
        this.maskSprite.position.x = this.spiritLeft;
        this.maskSprite.position.y = this.spiritTop;
        this.maskSprite.width = this.spiritWidth;
        this.maskSprite.height = this.spiritHeight;
        stage.addChild(this.maskSprite);
    }


    //png
    for (var i = 0; i < this.imagesArray.length; i++) {
        this.texture[i] = PIXI.Texture.fromImage(this.imagesArray[i]);
    }

    this.advSprite = new PIXI.Sprite(this.texture[0]);
    this.advSprite.position.x = this.spiritLeft;
    this.advSprite.position.y = this.spiritTop;
    this.advSprite.width = this.spiritWidth;
    this.advSprite.height = this.spiritHeight;
    stage.addChild(this.advSprite);

    this.stage = stage;
};


//初始化位置信息
spiritAni.prototype.initPosition = function(contents) {
    this.spiritWidth = parseInt(contents[0].scaleWidth);
    this.spiritHeight = parseInt(contents[0].scaleHeight);
    this.spiritLeft = parseInt(contents[0].scaleLeft);
    this.spiritTop = parseInt(contents[0].scaleTop);
    this.startPoint = {
        x: this.imageList[0].X,
        y: this.imageList[0].Y,
        w: parseInt(this.data.params[this.action].width),
        h: parseInt(this.data.params[this.action].height)
    };

    this.xRote = this.spiritWidth / this.startPoint.w;
    this.yRote = this.spiritHeight / this.startPoint.h;
    this.startLeft = this.spiritLeft;
    this.startTop = this.spiritTop;
};


//修正图片位置
spiritAni.prototype.changePosition = function(currentFrame) {
    var x = this.imageList[currentFrame].X - this.startPoint.x;
    var y = this.imageList[currentFrame].Y - this.startPoint.y;
    if (this.resType) {
        this.maskSprite.position.x = this.startLeft + x * this.xRote;
        this.maskSprite.position.y = this.startTop + y * this.yRote;
    }
    this.advSprite.position.x = this.startLeft + x * this.xRote;
    this.advSprite.position.y = this.startTop + y * this.yRote;
};


/**
 * 运动
 * @return {[type]} [description]
 */
spiritAni.prototype.runAnimate = function() {

    //第一次不运行
    if (!this.firstTime) {
        this.countNewFrame();
        var imageIndex = this.imageIndex;
        this.changePosition(imageIndex);


        //切换精灵的图片对象
        this.advSprite.texture = this.texture[imageIndex];

        if (this.resType) {
            this.maskSprite.texture = this.maskTexture[imageIndex];
        }
    }

    this.firstTime = false;
};


spiritAni.prototype.countNewFrame = function() {
    // console.log(this.imageIndex);
    this.imageIndex++;
    if (this.imageIndex > this.imagesArray.length - 1) {
        if (this.loop == 0) {
            this.imageIndex = 0;
        } else {
            this.imageIndex = this.imagesArray.length - 1;
            // //停止绘制
            // canvasRelated1.stopRender(uuid);
        }

    }
};



spiritAni.prototype.changeSwitchAni = function(action, loop) {
    this.stop();
    this.action = action;
    this.loop = loop;
    this.imageIndex = 0;
    //  this.animate();
    this.runAnimate();
}

var enterReplace = function(str) {
    return str.replace(/\r\n/ig, '').replace(/\r/ig, '').replace(/\n/ig, '');
}

function getResources(data) {
    var option;
    var ResourcePath = "content/widget/gallery/" + data.id + "/";
    var xhr = new XMLHttpRequest();
    data.resourcePath = ResourcePath;

    xhr.open('GET', ResourcePath + 'app.json', false);
    xhr.send(null);
    try {
        option = eval("(" + xhr.responseText + ")");
    } catch (e) {
        console.log("app.json get error:" + e);
    }
    return option;
}


function getSpiritAni(inputPara, data) {
    // var contentPrefix = data.contentPrefix;
    var path = data.resourcePath;
    if (typeof inputPara == "object") {
        return new spiritAni(inputPara, path);
    } else {
        console.log("inputPara undefine Spirit")
        return {};
    }
}


/**
 * 高级精灵动画构造器
 * @param  {[type]} data            [description]
 * @param  {[type]} canvasRelated   [description]
 * @param  {[type]} successCallback [description]
 * @param  {[type]} failCallback)   {                   }    } [description]
 * @return {[type]}                 [description]
 */
var seniorSprite = Factory.extend({

    /**
     * 初始化
     * @param  {[type]} data          [description]
     * @param  {[type]} canvasRelated [description]
     * @return {[type]}               [description]
     */
    constructor: function(successCallback, failCallback, inputPara, contents, canvasRelated) {
        this.content = contents[0];
        this.data = inputPara;
        this.option = getResources(this.data);
        this.canvasRelated = canvasRelated;
        //修改canvas层级
        this.canvasRelated.container.style.zIndex = this.content.contentData.zIndex;
        var spiritList = this.option.spiritList;

        this.sprObjs = [];

        for (var i = 0; i < spiritList.length; i++) {
            this.sprObjs.push(getSpiritAni(spiritList[i], this.data));
        }

        //运行状态
        this.animState = false;
        this.first = true;

        //初始化子对象
        this.sprObjs.forEach(function(obj) {
            obj.init(canvasRelated, contents);
        })

        successCallback();
    },

    /**
     * 获取到id标示
     * @return {[type]} [description]
     */
    getIdName: function() {
        return this.content.idName;
    },

    /**
     * 开始动画
     * @param  {[type]} canvasRelated [description]
     * @return {[type]}               [description]
     */
    play: function() {
        var sprObjs = this.sprObjs;
        var self = this;
        this.uuid = this.canvasRelated.play('seniorSprite', function() {
                sprObjs.forEach(function(obj) {
                    //第一次
                    if (self.first) {
                        obj.runAnimate();
                        self.first = false;
                    } else {
                        //定时器完毕后执行
                        if (!self.animState) {
                            self.animState = true;
                            self.timer && clearTimeout(self.timer);
                            self.timer = setTimeout(function() {
                                obj.runAnimate();
                                self.animState = false;
                            }, 1000 / (obj.FPS || 10))
                        }
                    }
                })
            })
            // console.log('开始seniorSprite',this.uuid)
    },


    /**
     * 停止
     * @return {[type]} [description]
     */
    stop: function() {
        this.canvasRelated.stop(this.uuid)
            // console.log('停止seniorSprite',this.uuid)
    },

    /**
     * 销毁
     * @return {[type]} [description]
     */
    destroy: function() {
        var containerStage = this.canvasRelated.containerStage
        var sprObjs = this.sprObjs;
        this.stop();
        this.timer && clearTimeout(this.timer);
        sprObjs.forEach(function(obj) {
            if (obj.stage) {
                //父容器删除
                if (containerStage) {
                    containerStage.removeChild(obj.stage);
                }
                obj.stage.destroy();
                obj.maskSprite && obj.maskSprite.destroy(true, true)
                obj.advSprite && obj.advSprite.destroy(true, true)
                obj.texture.forEach(function(texture) {
                    texture && texture.destroy(true);
                });
                obj.maskTexture.forEach(function(maskTexture) {
                    maskTexture && maskTexture.destroy(true);
                });

            }
        })
    }


})


export {
    seniorSprite
}
