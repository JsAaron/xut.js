import { setProportion } from '../../../util/option'




/**
 * 创建高级精灵动画
 * @param  {[type]} data          [description]
 * @param  {[type]} contentPrefix [description]
 * @param  {[type]} path          [description]
 * @return {[type]}               [description]
 */
function spiritAni(data, path, condata) {

    // this.canvasX = condata.scaleLeft
    // this.canvasY = condata.scaleTop

    this.imagesArray = new Array();
    this.maskArray = new Array();
    //默认png格式资源
    this.resType = 0;
    //默认循环播放
    this.loop = 0;
    this.data = data;
    //this.contentPrefix = contentPrefix;
    this.ResourcePath = path;
    //this.action = this.data.params["actList"].split(",")[0];
    this.FPS = parseInt(data.fps);
    this.imageList = data.ImageList;
    //jpg+mask格式资源
    if (this.imageList[0].name.split(".")[1] == "jpg") {
        this.resType = 1;
    }

    this.dataWidth = data.width;
    this.firstTime = true;
    this.imageIndex = 0;
    //得到图片集合
    this.parseSpiritImages(data, path);

    //初始化数据
    this.initdata();

    this.init()
}


/**
 * 解析数据
 * @param  {[type]} data          [description]
 * @param  {[type]} contentPrefix [description]
 * @param  {[type]} path          [description]
 * @return {[type]}               [description]
 */
spiritAni.prototype.parseSpiritImages = function (data, path) {
    for (var i = 0; i < this.imageList.length; i++) {
        var temp = this.imageList[i];
        this.imagesArray.push(path + temp.name);
        if (this.resType) {
            this.maskArray.push(path + temp.name.split(".")[0] + "_mask.png")
        }
    }
}


/**
 * 初始化位置信息
 * @param  {[type]} condata [description]
 * @return {[type]}         [description]
 */
spiritAni.prototype.initdata = function () {
    //尺寸
    var proportion = setProportion(this.data.width, this.data.height, this.imageList[0].X, this.imageList[0].Y)
    this.spiritWidth = parseInt(proportion.width);
    this.spiritHeight = parseInt(proportion.height);

    this.startPoint = {
        x: proportion.left,
        y: proportion.top,
        w: this.spiritWidth,
        h: this.spiritHeight
    };
};


/**
 * 绘制第一帧
 * @param  {[type]} canvasRelated [description]
 * @return {[type]}               [description]
 */
spiritAni.prototype.init = function () {

    //精灵场景容器
    this.stage = new PIXI.Container();

    this.texture = new Array();
    this.maskTexture = new Array();

    //jpg+mask蒙板
    if (this.resType) {
        for (var i = 0; i < this.maskArray.length; i++) {
            this.maskTexture[i] = PIXI.Texture.fromImage(this.maskArray[i]);
        }
        this.maskSprite = new PIXI.Sprite(this.maskTexture[0]);
        this.maskSprite.position.x = this.startPoint.x;
        this.maskSprite.position.y = this.startPoint.y;
        this.maskSprite.width = this.spiritWidth;
        this.maskSprite.height = this.spiritHeight;
        this.stage.addChild(this.maskSprite);
    }


    //png
    for (var i = 0; i < this.imagesArray.length; i++) {
        this.texture[i] = PIXI.Texture.fromImage(this.imagesArray[i]);
    }

    this.advSprite = new PIXI.Sprite(this.texture[0]);
    this.advSprite.position.x = this.startPoint.x;
    this.advSprite.position.y = this.startPoint.y;
    this.advSprite.width = this.spiritWidth;
    this.advSprite.height = this.spiritHeight;
    this.stage.addChild(this.advSprite);
};



//修正图片位置
spiritAni.prototype.changePosition = function (currentFrame) {

    var proportion = setProportion(0, 0, this.imageList[currentFrame].X, this.imageList[currentFrame].Y)

    var x = proportion.left
    var y = proportion.top

    if (this.resType) {
        this.maskSprite.position.x = x;
        this.maskSprite.position.y = y;
    }
    this.advSprite.position.x = x;
    this.advSprite.position.y = y;
};


/**
 * 运动
 * @return {[type]} [description]
 */
spiritAni.prototype.runAnimate = function () {
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


spiritAni.prototype.countNewFrame = function () {
    this.imageIndex++;
    if (this.imageIndex > this.imagesArray.length - 1) {
        if (this.loop == 0) {
            this.imageIndex = 0;
        } else {
            this.imageIndex = this.imagesArray.length - 1;
        }

    }
};


export {
spiritAni
}
