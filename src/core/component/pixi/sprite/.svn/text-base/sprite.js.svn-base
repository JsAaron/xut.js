
import { getFileFullPath } from '../util/option'

/**
 * 普通精灵动画
 */
export class Sprite {

  constructor(option, callback) {

    this.callback = callback
    this.renderer = option.renderer
    var data = this.data = option.data

    //矩形图
    var imgUrl = this.analysisPath();
    var imageFilename = imgUrl.replace(/^.*[\\\/]/, '');

    //support both png and jpg+mask
    var maskFilename = "mask_" + imageFilename;
    var imageextension = imgUrl.split('.').pop();
    var maskUrl = imgUrl.replace('.jpg', '_mask.png');

    //保证和以前版本的兼容性，旧版本精灵只有一行，因此没有matrix参数
    var matrixCols = data.thecount;
    var matrixRows = 1;
    var paraObject, dataMatrix, matrixs
    if(data.parameter) {
      //获取参数, 允许参数为null
      try {
        paraObject = JSON.parse(data.parameter);
      } catch(err) {
        console.log('content parameter error')
        return;
      }
      dataMatrix = paraObject.matrix;
      matrixs = dataMatrix.split("-");
      matrixCols = matrixs[0];
      matrixRows = matrixs[1];
    }

    //制作json数据
    var jsonUrl = "lib/data/spritesheet.json" + "?imageurl=" + imgUrl + "&cols=" + matrixCols + "&rows=" + matrixRows + "&total=" + data.thecount + "&fps=" + data.fps;


    //这里我们动态创建loader，加载完资源之后，就删除了。因此呢，也就没有缓存资源的情况了
    //我觉得这样似乎更好。因为我们整本书的动画很多，如果所有资源都缓存下来，可能内存消耗极大
    //现在这样每页动态创建，不加缓存，虽然性能上稍微差了一些，但是应该能够节省很多的内存
    var loader = new PIXI.loaders.Loader();
    if('png' == imageextension) {
      loader
        .add(imageFilename, jsonUrl)
        .load(this.load.bind(this));
    } else {
      var maskJsonUrl = "lib/data/spritesheet.json" + "?imageurl=" + maskUrl + "&cols=" + matrixCols + "&rows=" + matrixRows + "&total=" + data.thecount + "&fps=" + data.fps;
      loader
        .add(imageFilename, jsonUrl)
        .add(maskFilename, maskJsonUrl)
        .load(this.load.bind(this));
    }
    loader = null;

  }


  /**
   * 创建图片地址
   * @return {[type]}         [description]
   */

  analysisPath() {
    var imgPath, fileName = this.data.md5,
      //是gif格式
      isGif = /.gif$/i.test(fileName),
      //原始地址
      originalPathImg = getFileFullPath(fileName,'pixi-sprite')
    if(isGif) {
      //处理gif图片缓存+随机数
      // imgPath = Xut.createRandomImg(originalPathImg)
    } else {
      imgPath = originalPathImg;
    }
    return imgPath;
  }


  /**
   * 加载
   */
  load(loader, res) {

    //精灵场景容器
    var stage = new PIXI.Container()
    var data = this.data


    //zhangyun, get the name of spritesheet
    var textures = [];
    var maskTextures = [];
    //create textures array from res's textures object
    var resObject, maskObject;
    if(_.isObject(res)) {
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
    var movie = new PIXI.extras.MovieClip(textures);


    movie.width = data.scaleWidth
    movie.height = data.scaleHeight
    movie.position.x = 0
    movie.position.y = 0


    //if there are masks, make mask textures;
    var imageextension = resObject.name.split('.').pop();
    if("jpg" == imageextension) {
      maskObject = res[Object.keys(res)[1]];
      maskTextures = Object.keys(maskObject.textures).map(function(k) {
        return maskObject.textures[k];
      });
      movie.maskTextures = maskTextures;
      stage.addChild(movie.maskSprite);
    }

    //动画速率
    movie.animationSpeed = 0.15 * fps / 10;
    movie.play();
    stage.addChild(movie);

    this.movie = movie;
    this.stage = stage

    //加载完毕
    this.callback && this.callback();
  }


  /**
   * 绘制动画
   */
  render() {
    this.renderer.render(this.stage);
  }

  destroy() {
    //if there are movie sprite, destory it
    if(this.movie) {
      //remove it from stage
      if(this.stage) {
        this.stage.removeChild(this.movie);
      }
      //remove texture for movie
      for(var i = 0; i < this.movie.textures.length; i++) {
        this.movie.textures[i].destroy(true);
        if(this.movie.maskSprite) {
          this.movie.maskTextures[i].destroy(true);
        }
      }
      //remove movie sprite
      this.movie.destroy(true, true);
    }
  }

}
