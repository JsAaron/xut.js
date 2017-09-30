/**
 * 2017.7.25
 * 1.高级精灵动画
 *   提供给widget使用
 *
 * 2.复杂精灵动画
 *   提供给普通转化高级使用
 */
import { getFileFullPath, loadFigure } from '../../util/index'
import { config } from '../../config/index'

/*
1 高级精灵动画 =>  替换一张张图片
2 简单精灵强制转换复杂精灵动画
options.type
  1 seniorSprite
  2 autoSprite
 */
export default class {

  constructor(data, options) {
    this.data = data;

    //高级精灵动画
    if (options.type == 'seniorSprite') {
      this.contentPrefix = options.contentPrefix;
      this.obj = $("#" + this.contentPrefix + this.data.framId);
      this.resourcePath = options.resourcePath;
    }

    //简单精灵强制转换复杂精灵动画
    if (options.type === 'autoSprite') {
      this.contentId = options.contentId;
      this.obj = $(options.ele);
      this.resourcePath = getFileFullPath(options.resourcePath, 'autoSprite') + "/";
    }

    this.curFPS = 0

    /*默认值循环一次*/
    this.loop = 1
    this.resetCount = 0

    let params = this.data.params
    let action = this.action = params["actList"].split(",")[0]
    let pa = params[action];
    this.FPS = parseInt(pa.fps);
    this.playerType = (pa.playerType);

    //isSports:0非运动状态 isSports:1运动状态
    this.isSports = parseInt(pa.isSports);
    this.originalImageList = pa.ImageList;

    /**webp图片的后缀*/
    const brModeType = config.launch.brModeType;
    if (brModeType) {
      _.each(this.originalImageList, function(imageData) {
        if (imageData.name) {
          imageData.name = imageData.name.replace(/.png|.jpg/, brModeType)
        }
      })
    }

    this.totalFPS = this.originalImageList.length;
    this._imgArray = []
    this.sprObj = null

    /*
      默认值播放一次
      如果设置了循环就直接循环处理
     */
    if (this.playerType == "loop") {
      this.loop = 'loop';
    }

    this._init()
  }


  /**
   * 初始化
   * @return {[type]} [description]
   */
  _init() {
    this._initImage()

    //判断是否运动状态
    if (this.isSports) {
      //初始化位置信息
      this._initPosition();
    }
    //初始化结构
    this._initStructure();
  }


  /**
   * 检查是否可以运行
   * 第一次预加载必须先结束
   * @return {[type]} [description]
   */
  _checkNextAction(task) {
    if (this._initImageState) {
      task()
    } else {
      this._waitTask = []
      this._waitTask.push(task)
    }
  }


  /**
   * 初始化位置信息
   * @return {[type]} [description]
   */
  _initPosition() {
    let obj = this.obj;
    let params = this.data.params;
    let action = this.action;
    this.startPoint = {
      x: this.originalImageList[0].X,
      y: this.originalImageList[0].Y,
      w: parseInt(params[action].width),
      h: parseInt(params[action].height)
    }
    this.xRote = parseInt(obj.css("width")) / this.startPoint.w
    this.yRote = parseInt(obj.css("height")) / this.startPoint.h
    this.startLeft = parseInt(obj.css("left"))
    this.startTop = parseInt(obj.css("top"))
  }


  /**
   * 初始化qualified张图片
   * @return {[type]} [description]
   */
  _initImage() {
    let i = 0
    let qualified = 10
    let count = this.qualified = this.totalFPS >= qualified ? qualified : this.totalFPS
    let collect = (() => {
      return () => {
        if (count == 1) {
          this._initImageState = true
          if (this._waitTask && this._waitTask.length) {
            this._waitTask.pop()()
          }
        } else {
          count--
        }
      }
    })()

    for (i; i < this.qualified; i++) {
      this._preloadImage(i, collect)
    }
  }



  /**
   * 初始化结构
   * @return {[type]} [description]
   */
  _initStructure() {
    const src = this.resourcePath + this.originalImageList[0].name
    const html = `<img src="${src}" style="width:100%;height:100%;"/>`
    const $sprObj = $(String.styleFormat(html))
    this.sprObj = $sprObj[0]
    this.obj.html(this.sprObj)
  }


  /**
   * 获取文件名
   * @param  {[type]} name [description]
   * @return {[type]}      [description]
   */
  _getFilename(name) {
    return name.substr(0, name.indexOf('.'));
  }


  /**
   * 图片预加载
   * 1 png
   * 2 jpg mask
   * @return {[type]} [description]
   */
  _preloadImage(index, callback) {
    if (index >= this.totalFPS) {
      return
    }
    let self = this
    let imageList = this.originalImageList
    let resourcePath = this.resourcePath
    loadFigure(resourcePath + imageList[index].name, function() {
      self._imgArray && self._imgArray.push(this)
      callback && callback()
    })
  }


  /**
   * 改变图片位置
   * @return {[type]} [description]
   */
  _changePosition() {
    let imageList = this.originalImageList
    let curFPS = imageList[this.curFPS];
    let x = curFPS.X - this.startPoint.x;
    let y = curFPS.Y - this.startPoint.y;
    this.obj.css({
      left: this.startLeft + x * this.xRote,
      top: this.startTop + y * this.yRote
    })
  }

  /**
   * 改变图片url 与 变化的位置
   * @return {[type]} [description]
   */
  _changeImage() {
    let imageList = this.originalImageList
    let curFPS = imageList[this.curFPS];
    let resourcePath = this.resourcePath;

    /*第一次循环才加载图片*/
    if (this.resetCount === 0) {
      this._preloadImage(this.curFPS + this.qualified)
    }

    /*如果图片需要运动，改变地址*/
    if (this.isSports) {
      this._changePosition();
    }

    /*改变图片*/
    this.sprObj.setAttribute('src', resourcePath + curFPS.name)
  }


  /**
   * 运行动画
   * @return {[type]} [description]
   */
  _change() {
    if (!this.originalImageList) {
      return
    }
    /*切换图片*/
    this._changeImage()
  }


  _time() {
    this.timer = setTimeout(() => {
      clearTimeout(this.timer)
      this.timer = null
      this._change();
      this.curFPS++;
      this._set();
    }, 1000 / this.FPS);
  }


  /**
   * 设置动画运行状态
   * look 0  循环
   * lokk 1~n 指定次数
   */
  _set() {
    //循环复位
    if (this.curFPS >= this.totalFPS) {
      this.curFPS = 0
      this.resetCount++
    }

    if (this.loop !== 'loop' && this.loop == this.resetCount) {
      this._stop()
      return
    }

    this._checkNextAction(() => {
      this._time()
    })
  }


  _stop() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null
    }
    this.curFPS = 0
    this.resetCount = 0
  }


  /**
   * 开始运行动画
   * loop
   *   1 零件高级动画 loop => N / loop
   *   1 普通转高级动画 loop => N / loop
   */
  play(action, loop) {
    this.action = action;
    if (!this.data.params[action]) {
      console.log(" Function changeSwitchAni  parameters " + action + " error");
      return;
    }
    if (loop) {
      this.loop = loop
    }
    this._stop()
    this._set()
  }


  /**
   * 停止
   * @return {[type]} [description]
   */
  stop() {
    this._stop()
  }


  /**
   * 销毁
   * @return {[type]} [description]
   */
  destroy() {
    this._stop();
    this.obj = null
    this.sprObj = null
    this.data.params = null
    this.data = null
    this._imgArray.forEach(function(img) {
      img = null
    })
    this.originalImageList = null
    this._imgArray = null
  }

}
