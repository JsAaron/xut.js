const filter = Xut.style.filter

/**
 * 缩放类动画
 * @param  {[type]} animproto [description]
 * @return {[type]}           [description]
 */
export default function zoom(animproto) {

  //基本缩放
  animproto.getEffectZoom = function (parameter, object, duration, delay, repeat, isExit) {
    var direction = parameter.direction; //方向(放大:DirectionIn、屏幕中心放大:DirectionInCenter、轻微放大:DirectionInSlightly、缩小:DirectionOut、屏幕底部缩小:DirectionOutBottom、轻微缩小:DirectionOutSlightly)
    var t1 = null;
    var result
    object.css(Xut.style.transformOrigin, "center"); //设置缩放基点(默认是正中心点)
    if (isExit == false) {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object, {
          visibility: "visible"
        }],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object]
      });
      switch (direction) {
        case "DirectionIn":
          t1.from(object, duration, {
            scale: 0,
            ease: parameter.tweenEase
          });
          break;
        case "DirectionInCenter":
          result = this._getDirectionInCenter(object);
          t1.from(object, duration, {
            scale: 0,
            x: result.x,
            y: result.y,
            ease: parameter.tweenEase
          });
          break;
        case "DirectionInSlightly":
          t1.from(object, duration, {
            scale: 0.7,
            ease: parameter.tweenEase
          });
          break;
        case "DirectionOut":
          t1.from(object, duration, {
            scale: 3,
            ease: parameter.tweenEase
          });
          break;
        case "DirectionOutBottom":
          //屏幕底部缩小(理解为底部的中间开始)
          t1.from(object, duration, {
            scale: 2,
            top: this.visualWidth + "px",
            ease: parameter.tweenEase
          });
          break;
        case "DirectionOutSlightly":
          t1.from(object, duration, {
            scale: 1.5,
            ease: parameter.tweenEase
          });
          break;
        default:
          console.log("getEffectZoom:parameter error.");
          break;
      }
    } else {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object, {
          visibility: "hidden"
        }]
      });
      switch (direction) {
        case "DirectionIn":
          t1.to(object, duration, {
            scale: 0,
            ease: parameter.tweenEase
          });
          break;
        case "DirectionInCenter":
          result = this._getDirectionInCenter(object);
          t1.to(object, duration, {
            scale: 0,
            x: result.x,
            y: result.y,
            ease: parameter.tweenEase
          });
          break;
        case "DirectionInSlightly":
          t1.to(object, duration, {
            scale: 0.7,
            ease: parameter.tweenEase
          });
          break;
        case "DirectionOut":
          t1.to(object, duration, {
            scale: 3,
            ease: parameter.tweenEase
          });
          break;
        case "DirectionOutBottom":
          t1.to(object, duration, {
            scale: 2,
            top: this.visualHeight + "px",
            ease: parameter.tweenEase
          });
          break;
        case "DirectionOutSlightly":
          t1.to(object, duration, {
            scale: 1.5,
            ease: parameter.tweenEase
          });
          break;
        default:
          console.log("getEffectZoom:parameter error.");
          break;
      }
    }
    return t1;
  }

  //缩放 淡出式缩放
  animproto.getEffectFadedZoom = function (parameter, object, duration, delay, repeat, isExit) {
    var direction = parameter.direction; //方向(对象中心DirectionIn、幻灯片中心DirectionInCenter)
    var t1 = null;
    object.css(Xut.style.transformOrigin, "center"); //设置缩放基点(默认是正中心点)
    var svgElement = object.find("svg"); //获取SVG对象
    //解决SVG文字错乱问题
    if (svgElement) {
      Xut.style.setTranslate({
        node: svgElement,
        x: 0,
        y: 0
      })
    }

    var keepRatio = (parameter.keepRatio == 0) ? false : true; //保持长宽比
    var fullScreen = (parameter.fullScreen == 1) ? true : false; //缩放到全屏
    var scaleX = parameter.scaleX ? parameter.scaleX : 1; //横向缩放比例
    var scaleY = parameter.scaleY ? parameter.scaleY : 1; //纵向缩放比例
    var result
    if (fullScreen == true) {
      //计算比例
      var xScale = this.visualWidth / object.width();
      var yScale = this.visualHeight / object.height();
      var scaleValue = xScale;
      if (xScale > yScale) scaleValue = yScale;
      result = this._getDirectionInCenter(object);
      if (isExit == false) {
        t1 = new TimelineMax({
          delay: delay,
          repeat: repeat,
          onStart: this._startHandler,
          onStartParams: [parameter, object, {
            opacity: 0
          }],
          onComplete: this._completeHandler,
          onCompleteParams: [parameter, object]
        });
        t1.to(object, duration, {
          x: result.x,
          y: result.y,
          autoAlpha: 1,
          scale: scaleValue,
          ease: parameter.tweenEase
        });
      } else {
        t1 = new TimelineMax({
          delay: delay,
          repeat: repeat,
          onStart: this._startHandler,
          onStartParams: [parameter, object],
          onComplete: this._completeHandler,
          onCompleteParams: [parameter, object]
        });
        t1.to(object, duration, {
          x: result.x,
          y: result.y,
          autoAlpha: 0,
          scale: scaleValue,
          ease: parameter.tweenEase
        });
      }
    } else if (isExit == false) {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object]
      });
      switch (direction) {
        case "DirectionIn":
          if (keepRatio == true)
            t1.from(object, duration, {
              autoAlpha: 0,
              scale: 0,
              ease: parameter.tweenEase
            });
          else {
            t1.from(object, duration, {
              autoAlpha: 0,
              scaleX: scaleX,
              scaleY: scaleY,
              ease: parameter.tweenEase
            });
          }
          break;
        case "DirectionInCenter":
          result = this._getDirectionInCenter(object);
          if (keepRatio == true)
            t1.from(object, duration, {
              x: result.x,
              y: result.y,
              autoAlpha: 0,
              scale: 0,
              ease: parameter.tweenEase
            });
          else
            t1.from(object, duration, {
              x: result.x,
              y: result.y,
              autoAlpha: 0,
              scaleX: scaleX,
              scaleY: scaleY,
              ease: parameter.tweenEase
            });
          break;
        default:
          console.log("getEffectFadedZoom:parameter error.");
          break;
      }
    } else {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object, {
          opacity: 1
        }]
      });
      switch (direction) {
        case "DirectionOut":
          if (keepRatio == true)
            t1.to(object, duration, {
              autoAlpha: 0,
              scale: 0,
              ease: parameter.tweenEase,
              clearProps: "scale"
            });
          else
            t1.to(object, duration, {
              autoAlpha: 0,
              scaleX: scaleX,
              scaleY: scaleY,
              ease: parameter.tweenEase
            });
          break;
        case "DirectionOutCenter":
          result = this._getDirectionInCenter(object);
          if (keepRatio == true)
            t1.to(object, duration, {
              x: result.x,
              y: result.y,
              autoAlpha: 0,
              scale: 0,
              ease: parameter.tweenEase
            });
          else
            t1.to(object, duration, {
              x: result.x,
              y: result.y,
              autoAlpha: 0,
              scaleX: scaleX,
              scaleY: scaleY,
              ease: parameter.tweenEase
            });
          break;
        default:
          console.log("getEffectFadedZoom:parameter error.");
          break;
      }
    }
    return t1;
  }

  //放大/缩小
  animproto.getEffectGrowShrink = function (parameter, object, duration, delay, repeat) {
    var scaleX = parameter.scaleX ? parameter.scaleX : 1; //横向缩放比例
    var scaleY = parameter.scaleY ? parameter.scaleY : 1; //纵向缩放比例
    // var keepRatio = (parameter.keepRatio == 0) ? false : true; //保持长宽比
    var fullScreen = (parameter.fullScreen == 1) ? true : false; //缩放到全屏
    var resetSize = (parameter.resetSize == 1) ? true : false; //恢复默认尺寸
    var easeString = Linear.easeNone; //Elastic.easeOut
    if (parameter.tweenEase && parameter.tweenEase.length > 0) easeString = parameter.tweenEase;
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    if (fullScreen == true) {
      //计算比例
      var xScale = this.visualWidth / object.width();
      var yScale = this.visualHeight / object.height();
      var scaleValue = xScale;
      if (xScale > yScale) scaleValue = yScale;
      var result = this._getDirectionInCenter(object);
      t1.to(object, duration, {
        x: result.x,
        y: result.y,
        scale: scaleValue,
        ease: parameter.tweenEase
      });
    } else if (resetSize == true) {
      t1.to(object, duration, {
        scaleX: 1,
        scaleY: 1,
        ease: easeString
      });
    } else
      t1.to(object, duration, {
        scaleX: scaleX,
        scaleY: scaleY,
        ease: easeString
      });
    return t1;
  }

  /**
   * 获取对象至屏幕中心的距离
   * @param  {[type]} object [description]
   * @return {[type]}        [description]
   */
  animproto._getDirectionInCenter = function (object) {
    var objInfo = this._getObjectInfo(object);
    var x = Math.round(this.visualWidth / 2 - objInfo.offsetLeft - objInfo.width / 2);
    var y = Math.round(this.visualHeight / 2 - objInfo.offsetTop - objInfo.height / 2);
    return {
      x: x,
      y: y
    }
  }
}
