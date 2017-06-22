/**
 * 2017.7.25
 * 1.高级精灵动画
 *   提供给widget使用
 *
 * 2.复杂精灵动画
 *   提供给普通转化高级使用
 */
import { getFileFullPath, loadFigure } from '../../../util/index'
import { config } from '../../../config/index'

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

    //是否有蒙版图
    //resType:1没有蒙版 0：有蒙版
    this.isMask = false

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
   * 初始化结构
   * @return {[type]} [description]
   */
  _initStructure() {
    let obj = this.obj;
    let framId;
    let resourcePath = this.resourcePath
    let html = ''
    if (this.isMask) {
      const filename = this._getFilename(this.originalImageList[0].name)
      const maskUrl = resourcePath + filename
      html =
        `<div style="width:100%;height:100%;
                     background: url(${maskUrl}.jpg) no-repeat;
                     background-size: 100% 100%;
                     -webkit-mask: url(${maskUrl}.png) no-repeat;
                     -webkit-mask-size: 100% 100%;'>
        </div>`
      this.sprObj = $(String.styleFormat(html))
      obj.append(this.sprObj);
    } else {
      const src = resourcePath + this.originalImageList[0].name
      html = `<img src="${src}" style="width:100%;height:100%;"/>`
      this.sprObj = $(String.styleFormat(html))
      obj.html(this.sprObj)
    }
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
    let collect = function () {
      self._imgArray && self._imgArray.push(this)
      callback && callback()
    }

    let imageList = this.originalImageList
    let resourcePath = this.resourcePath
    if (this.isMask) {
      let filename = this._getFilename(imageList[index].name)
      loadFigure(resourcePath + filename + ".png", collect)
      loadFigure(resourcePath + filename + ".jpg", collect)
    } else {
      loadFigure(resourcePath + imageList[index].name, collect)
    }
  }


  /**
   * 改变图片url
   * @return {[type]} [description]
   */
  _changeImageUrl() {
    let imageList = this.originalImageList
    let curFPS = imageList[this.curFPS];
    let resourcePath = this.resourcePath;

    //第一次循环才加载图片
    if (this.resetCount === 0) {
      this._preloadImage(this.curFPS + this.qualified)
    }

    if (this.isMask) {
      let filename = this._getFilename(curFPS.name);
      this.sprObj.css("background-image", "url(" + resourcePath + filename + ".jpg)");
      this.sprObj.css("-webkit-mask-image", "url(" + resourcePath + filename + ".png)");
    } else {
      let str = resourcePath + curFPS.name
      this.sprObj.attr("src", str);
    }
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
   * 运行动画
   * @return {[type]} [description]
   */
  _change() {
    if (!this.originalImageList) {
      return
    }
    this._changeImageUrl()
    if (this.isSports) {
      this._changePosition()
    }
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
    this._imgArray.forEach(function (img) {
      img = null
    })
    this.originalImageList = null
    this._imgArray = null
  }

}
