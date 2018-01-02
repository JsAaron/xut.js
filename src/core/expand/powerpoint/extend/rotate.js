const transformOrigin = Xut.style.transformOrigin

/**
 * 旋转类动画
 * @param  {[type]} animproto [description]
 * @return {[type]}           [description]
 */
export default function rotate(animproto) {

  //基本旋转
  animproto.getEffectSwivel = function(parameter, object, duration, delay, repeat, isExit) {
    var direction = parameter.direction; //方向（水平：DirectionHorizontal、垂直：DirectionVertical
    var t1 = null;
    var easeString = Linear.easeNone;
    if(parameter.tweenEase && parameter.tweenEase.length > 0) easeString = parameter.tweenEase;
    if(isExit == false) {
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
      switch(direction) {
        case "DirectionHorizontal":
          t1.from(object, duration, {
            rotationY: "480deg",
            ease: easeString
          });
          break;
        case "DirectionVertical":
          t1.from(object, duration, {
            rotationX: "480deg",
            ease: easeString
          });
          break;
        default:
          console.log("getEffectSwivel:parameter error.");
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
      switch(direction) {
        case "DirectionHorizontal":
          t1.to(object, duration, {
            rotationY: "480deg",
            ease: easeString
          });
          break;
        case "DirectionVertical":
          t1.to(object, duration, {
            rotationX: "480deg",
            ease: easeString
          });
          break;
        default:
          console.log("getEffectSwivel:parameter error.");
          break;
      }
    }
    return t1;
  }

  //陀螺旋转
  animproto.getEffectSpin = function(parameter, object, duration, delay, repeat) {
    var degree = parameter.amount ? parameter.amount : 360; //陀螺旋转角度
    if(Math.abs(parameter.degree) > 0) degree = parameter.degree;
    if(parameter.clockWise == 0) degree = 0 - degree; //逆时针旋转

    switch(parameter.centerPos) {
      case 1: //左上角
        object.css(transformOrigin, "left top");
        break;
      case 2: //上边中心
        object.css(transformOrigin, "center top");
        break;
      case 3: //右上角
        object.css(transformOrigin, "right top");
        break;
      case 4: //左边中心
        object.css(transformOrigin, "left cneter");
        break;
      case 5: //右边中心
        object.css(transformOrigin, "right center");
        break;
      case 6: //左下角
        object.css(transformOrigin, "left bottom");
        break;
      case 7: //下边中心
        object.css(transformOrigin, "center bottom");
        break;
      case 8: //右下角
        object.css(transformOrigin, "right bottom");
        break;
      case 0:
      default: //默认中心0
        object.css(transformOrigin, "center");
        break;
    }

    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    //t1.to(object, duration, {rotation:degree+"deg",ease:parameter.tweenEase});
    switch(parameter.axis) {
      case 1: //X轴
        t1.to(object, duration, {
          rotationX: "+=" + degree + "deg",
          ease: parameter.tweenEase
        });
        break;
      case 2: //Y轴
        t1.to(object, duration, {
          rotationY: "+=" + degree + "deg",
          ease: parameter.tweenEase
        });
        break;
      case 0: //Z轴
      default:
        t1.to(object, duration, {
          rotation: "+=" + degree + "deg",
          ease: parameter.tweenEase
        });
        break;
    }
    return t1;
  }

  //飞旋
  animproto.getEffectBoomerang = function(parameter, object, duration, delay, repeat, isExit) {
    var t1 = null;
    var time = duration / 3;
    if(isExit == false) {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object]
      });
      t1.add(TweenMax.to(object, 0.01, {
        x: 300,
        y: -200,
        rotation: "-60deg"
      }), "first");
      t1.add(TweenMax.to(object, time, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        rotation: "0deg"
      }), "second");
      t1.add(TweenMax.to(object, time, {
        rotationY: "-80deg"
      }), "second");
      t1.add(TweenMax.to(object, time, {
        rotationY: "0deg"
      }));
    } else {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object, {
          opacity: 1,
          x: 0,
          y: 0,
          rotation: "0deg"
        }]
      });
      t1.add(TweenMax.to(object, time, {
        rotationY: "-80deg"
      }), "frist");
      t1.add(TweenMax.to(object, time, {
        autoAlpha: 0,
        x: 300,
        y: -200,
        rotation: "-60deg"
      }), "second");
      t1.add(TweenMax.to(object, time, {
        rotationY: "0deg"
      }), "second");
    }
    return t1;
  }

  //中心旋转
  animproto.getEffectCenterRevolve = function(parameter, object, duration, delay, repeat, isExit) {
    var t1 = null;
    var easeString = Power1.easeInOut;
    if(parameter.tweenEase && parameter.tweenEase.length > 0) easeString = parameter.tweenEase;
    if(isExit == false) {
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
      t1.from(object, duration, {
        bezier: {
          type: "cubic",
          values: [{
            x: 0,
            y: 0
          }, {
            x: 200,
            y: 100
          }, {
            x: 200,
            y: 200
          }, {
            x: 0,
            y: 300
          }]
        },
        ease: easeString
      });
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
      t1.to(object, duration, {
        bezier: {
          type: "cubic",
          values: [{
            x: 0,
            y: 0
          }, {
            x: 200,
            y: 100
          }, {
            x: 200,
            y: 200
          }, {
            x: 0,
            y: 300
          }]
        },
        ease: easeString
      });
    }
    return t1;
  }

  //回旋
  animproto.getEffectSpinner = function(parameter, object, duration, delay, repeat, isExit) {
    var t1 = null;
    var easeString = Expo.easeOut;
    if(parameter.tweenEase && parameter.tweenEase.length > 0) easeString = parameter.tweenEase;
    if(isExit == false) {
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
      t1.from(object, duration, {
        scale: 0,
        rotation: "180deg",
        ease: easeString
      });
    } else {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object, {
          visibility: "hidden",
          scale: 1,
          rotation: "0deg"
        }]
      });
      t1.to(object, duration, {
        scale: 0,
        rotation: "180deg",
        ease: easeString
      });
    }
    return t1;
  }

  //旋转(淡出式回旋)
  animproto.getEffectFadedSwivel = function(parameter, object, duration, delay, repeat, isExit) {
    var t1 = null;
    var easeString = Linear.easeNone;
    var degree = Math.abs(parameter.degree) > 0 ? Number(parameter.degree) : 90;
    if(parameter.clockWise == 0) degree = 0 - degree; //逆时针旋转
    switch(parameter.centerPos) {
      case 1: //左上角
        object.css(transformOrigin, "left top");
        break;
      case 2: //上边中心
        object.css(transformOrigin, "center top");
        break;
      case 3: //右上角
        object.css(transformOrigin, "right top");
        break;
      case 4: //左边中心
        object.css(transformOrigin, "left cneter");
        break;
      case 5: //右边中心
        object.css(transformOrigin, "right center");
        break;
      case 6: //左下角
        object.css(transformOrigin, "left bottom");
        break;
      case 7: //下边中心
        object.css(transformOrigin, "center bottom");
        break;
      case 8: //右下角
        object.css(transformOrigin, "right bottom");
        break;
      case 0:
      default: //默认中心0
        object.css(transformOrigin, "center");
        break;
    }
    if(parameter.tweenEase && parameter.tweenEase.length > 0) easeString = parameter.tweenEase;
    if(isExit == false) {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object]
      });
      //t1.from(object,duration,{autoAlpha:0,rotationY:"540deg",ease:Linear.easeNone}); //PPT默认效果
      switch(parameter.axis) {
        case 0: //Z轴
          t1.from(object, duration, {
            autoAlpha: 0,
            rotation: degree + "deg",
            ease: easeString,
            immediateRender: false
          });
          break;
        case 1: //X轴
          t1.from(object, duration, {
            autoAlpha: 0,
            rotationX: degree + "deg",
            ease: easeString,
            immediateRender: false
          });
          break;
        case 2: //Y轴
        default:
          t1.from(object, duration, {
            autoAlpha: 0,
            rotationY: degree + "deg",
            ease: easeString,
            immediateRender: false
          });
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
      //t1.to(object,duration,{autoAlpha:0,rotationY:"540deg",ease:Linear.easeNone}); //PPT默认效果
      switch(parameter.axis) {
        case 0: //Z轴
          t1.to(object, duration, {
            autoAlpha: 0,
            rotation: degree + "deg",
            ease: easeString
          });
          break;
        case 1: //X轴
          t1.to(object, duration, {
            autoAlpha: 0,
            rotationX: degree + "deg",
            ease: easeString
          });
          break;
        case 2: //Y轴
        default:
          t1.to(object, duration, {
            autoAlpha: 0,
            rotationY: degree + "deg",
            ease: easeString
          });
          break;
      }
    }
    return t1;
  }

}
