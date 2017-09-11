import { setProportion } from '../../util/option'

/**
 * 创建高级精灵动画
 * @param  {[type]} data          [description]
 * @param  {[type]} contentPrefix [description]
 * @param  {[type]} path          [description]
 * @return {[type]}               [description]
 */
export class spiritAni {

  constructor(data, canvasEl, condata) {

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
    if(this.imageList[0].name.split(".")[1] == "jpg") {
      this.resType = 1;
    }

    //是否第一次运行
    this.firstTime = true;

    //当前图片的游标
    this.vernier = 1

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
  setContainer() {
    //尺寸
    var proportion = setProportion({
      width: this.data.width,
      height: this.data.height,
      left: this.imageList[0].X,
      top: this.imageList[0].Y
    })
    this.spiritWidth = parseInt(proportion.width);
    this.spiritHeight = parseInt(proportion.height);
    this.canvasEl.width = this.spiritWidth;
    this.canvasEl.height = this.spiritHeight;
    this.canvasEl.style.left = parseInt(proportion.left) + 'px';
    this.canvasEl.style.top = parseInt(proportion.top) + 'px';
  }


  /**
   * 每次获取不同坐标的图标
   * @param  {[type]} data          [description]
   * @param  {[type]} contentPrefix [description]
   * @param  {[type]} path          [description]
   * @return {[type]}               [description]
   */
  getImageUrl(i) {
    var p1, p2, temp

    temp = this.imageList[i];
    //普通
    p1 = this.path + temp.name
    if(this.resType) {
      //mask图片
      p2 = this.path + temp.name.split(".")[0] + "_mask.png"
    }
    return [p1, p2]
  }

  /**
   * 得到图片纹理
   */
  getFromImage(img) {
    return PIXI.Texture.fromImage(img);
  }


  /**
   * 制作精灵
   */
  makeSprite(pic) {

    this.stage = new PIXI.Container();

    //第一次获取图片位置合集
    var imgUrl = this.getImageUrl(1)

    //jpg+mask蒙板
    if(this.resType) {
      this.textureMask = this.getFromImage(imgUrl[1])
      this.spriteMask = new PIXI.Sprite(this.textureMask)
      this.spriteMask.position.x = 0
      this.spriteMask.position.y = 0
      this.spriteMask.width = this.spiritWidth
      this.spriteMask.height = this.spiritHeight
      this.stage.addChild(this.spriteMask)
    }

    //jpg and mask or png
    this.texturePng = this.getFromImage(imgUrl[0])
    this.spritePng = new PIXI.Sprite(this.texturePng)
    this.spritePng.position.x = 0
    this.spritePng.position.y = 0
    this.spritePng.width = this.spiritWidth
    this.spritePng.height = this.spiritHeight
    this.stage.addChild(this.spritePng);
  }


  /**
   * 设置纹理
   */
  setTexture(texture, sprite, ulr) {
    this['old' + texture] = this[texture]
    this[texture] = this.getFromImage(ulr)
    this[sprite]['texture'] = this[texture]
  }


  /**
   * 计算下一个游标
   */
  nextVernier() {
    //循环
    if(this.vernier == this.allcount) {
      this.vernier = 1
      return
    }
    this.vernier++
  }

  /**
   * 运动
   * @return {[type]} [description]
   */
  runAnimate() {

    var imgUrl

    //第二次运行
    if(!this.firstTime) {

      //计算游标
      this.nextVernier();

      //获取下一张图片位置合集
      imgUrl = this.getImageUrl(this.vernier)

      //带蒙版
      if(this.spriteMask) {
        this.oldTextureMask = this.textureMask
        this.textureMask = this.getFromImage(imgUrl[1])
        this.spriteMask.texture = this.textureMask
      }
      //普通png
      if(this.spritePng) {
        this.oldTexturePng = this.texturePng
        this.texturePng = this.getFromImage(imgUrl[0])
        this.spritePng.texture = this.texturePng
      }
    }

    this.firstTime = false;

    //清理旧的texture的内存消耗
    this.oldTextureMask && this.oldTextureMask.destroy(true)
    this.oldTexturePng && this.oldTexturePng.destroy(true)
  }



  /**
   * 销毁
   */
  destroy() {
    this.textureMask && this.textureMask.destroy(true)
    this.texturePng && this.texturePng.destroy(true)
    this.oldTextureMask && this.oldTextureMask.destroy(true)
    this.oldTexturePng && this.oldTexturePng.destroy(true)

    this.stage.destroy(true)
    this.spritePng = null
    this.spriteMask = null
    this.canvasEl = null
    this.imageList = null
  }

}