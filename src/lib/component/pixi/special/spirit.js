import { setProportion } from '../../../util/option'




/**
 * 创建高级精灵动画
 * @param  {[type]} data          [description]
 * @param  {[type]} contentPrefix [description]
 * @param  {[type]} path          [description]
 * @return {[type]}               [description]
 */
function spiritAni(data, canvasEl, condata) {
    this.canvasEl = canvasEl;
    this.imagesArray = new Array();
    this.maskArray = new Array();
    //默认png格式资源
    this.resType = 0;
    //1循环播放 0只播放一次
    this.loop = condata.loop;
    this.data = data;
    //this.contentPrefix = contentPrefix;
    this.path = this.ResourcePath = condata.resourcePath;
    //this.action = this.data.params["actList"].split(",")[0];
    this.FPS = parseInt(data.fps);
    this.imageList = data.ImageList;
    //从1开始
    this.allcount = this.imageList.length - 1

    //jpg+mask格式资源
    if (this.imageList[0].name.split(".")[1] == "jpg") {
        this.resType = 1;
    }

    //是否第一次运行
    this.firstTime = true;

    //当前图片的游标
    this.imgIndex = 1

    //初始化
    this.setContainer();

    //初始化精灵
    this.makeSprite();
}


/**
 * 初始化位置信息
 * @param  {[type]} condata [description]
 * @return {[type]}         [description]
 */
spiritAni.prototype.setContainer = function () {
    //尺寸
    var proportion = setProportion(this.data.width, this.data.height, this.imageList[0].X, this.imageList[0].Y)
    this.spiritWidth = parseInt(proportion.width);
    this.spiritHeight = parseInt(proportion.height);
    this.canvasEl.width = this.spiritWidth;
    this.canvasEl.height = this.spiritHeight;
    this.canvasEl.style.left = parseInt(proportion.left) + 'px';
    this.canvasEl.style.top = parseInt(proportion.top) + 'px';
};


/**
 * 每次获取不同坐标的图标
 * @param  {[type]} data          [description]
 * @param  {[type]} contentPrefix [description]
 * @param  {[type]} path          [description]
 * @return {[type]}               [description]
 */
spiritAni.prototype.getImages = function (i) {
    var p1, p2, temp
    temp = this.imageList[i];
    //普通
    p1 = this.path + temp.name
    if (this.resType) {
        //mask图片
        p2 = this.path + temp.name.split(".")[0] + "_mask.png"
    }
    return [p1, p2]
}

/**
 * 得到图片纹理
 */
spiritAni.prototype.getFromImage = function (img) {
    return PIXI.Texture.fromImage(img);
}


/**
 * 制作精灵
 */
spiritAni.prototype.makeSprite = function (pic) {

    this.stage = new PIXI.Container();

    //第一次获取图片位置合集
    var imgArr = this.getImages(this.imgIndex)

    //jpg+mask蒙板
    if (this.resType) {
        this.textureMask = this.getFromImage(imgArr[1]);
        this.spriteMask = new PIXI.Sprite(this.textureMask);
        this.spriteMask.position.x = 0;
        this.spriteMask.position.y = 0;
        this.spriteMask.width = this.spiritWidth;
        this.spriteMask.height = this.spiritHeight;
        this.stage.addChild(this.spriteMask);
    }

    //jpg and mask or png
    this.textureAdv = this.getFromImage(imgArr[0]);;
    this.spriteAdv = new PIXI.Sprite(this.textureAdv);
    this.spriteAdv.position.x = 0;
    this.spriteAdv.position.y = 0;
    this.spriteAdv.width = this.spiritWidth;
    this.spriteAdv.height = this.spiritHeight;
    this.stage.addChild(this.spriteAdv);
}


/**
 * 设置纹理
 */
spiritAni.prototype.setTexture = function (texture, sprite, ulr) {
    this['old' + texture] = this[texture]
    this[texture] = this.getFromImage(ulr)
    this[sprite]['texture'] = this[texture] 
}
  
/**
 * 销毁纹理
 */
spiritAni.prototype.destroyTexture = function () {

}
  
  
/**
 * 计算下一个游标
 */
spiritAni.prototype.nextPox = function () {
    if (this.imgIndex == this.allcount) {
        this.imgIndex = 1
        return
    }
    this.imgIndex++
};

/**
 * 运动
 * @return {[type]} [description]
 */
spiritAni.prototype.runAnimate = function () {

    //第二次运行
    if (!this.firstTime) {
        this.nextPox();
        //第一次获取图片位置合集
        var imgArr = this.getImages(this.imgIndex)
        if (this.spriteMask) {
            this.setTexture('textureMask', 'spriteMask', imgArr[1])
            // this.oldTextureMask = this.textureMask
            // this.textureMask = this.getFromImage(imgArr[1])
            // this.spriteMask.texture = this.textureMask

        }  
        if (this.spriteAdv) {
            this.setTexture('textureAdv', 'spriteAdv', imgArr[0])
            // this.oldTextureAdv = this.textureAdv
            // this.textureAdv = this.getFromImage(imgArr[0])
            // this.spriteAdv.texture = this.textureAdv
        }
    }

    this.firstTime = false;

    //清理旧的texture的内存消耗
    if (this.oldTextureMask) {
        this.oldTextureMask.destroy(true);
    }
    if (this.oldTextureAdv) {
        // console.log(1)
        this.oldTextureAdv.destroy(true);
    }
};



/**
 * 销毁
 */
spiritAni.prototype.destroy = function () {
    if (this.stage) {
        this.stage.destroy(this.stage.length ? true : false)
    }

}

export {
spiritAni
}
