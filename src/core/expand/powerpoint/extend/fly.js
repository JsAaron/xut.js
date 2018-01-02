/**
 * 飞入飞出动画
 * @param  {[type]} animproto [description]
 * @return {[type]}           [description]
 */
export default function fly(animproto) {

  //飞入效果
  animproto.getEffectFly = function(parameter, object, duration, delay, repeat, isExit) {
    var direction = parameter.direction; //方向(上、下、左、右、左上、左下、右上、右下)
    var t1 = null;
    var objInfo = this._getObjectInfo(object);
    var easeString = Expo.easeOut;
    var x, y

    if(parameter.tweenEase && parameter.tweenEase.length > 0) easeString = parameter.tweenEase;
    if(parameter.smoothStart == 1 || parameter.smoothEnd == 1 || parameter.bounceEnd == 1) {
      if(isExit == true)
        easeString = Power4.easeOut;
      else
        easeString = Elastic.easeOut;
    }

    if(isExit == false) {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object, {
          visibility: "visible"
        }],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object, {
          visibility: "visible"
        }]
      });
      switch(direction) {
        case "DirectionDown":
          y = Math.abs(objInfo.offsetBottom + objInfo.height);
          t1.from(object, duration, {
            y: y,
            ease: easeString,
            immediateRender: false
          });
          break;
        case "DirectionLeft":
          x =  - Math.abs(objInfo.offsetLeft + objInfo.width);
          t1.from(object, duration, {
            x: x,
            ease: easeString,
            immediateRender: false
          });
          break;
        case "DirectionUp":
          y = - Math.abs(objInfo.offsetTop + objInfo.height);
          t1.from(object, duration, {
            y: y,
            ease: easeString,
            immediateRender: false
          });
          break;
        case "DirectionRight":
          x = Math.abs(objInfo.offsetRight + objInfo.width);
          t1.from(object, duration, {
            x: x,
            ease: easeString,
            immediateRender: false
          });
          break;
        case "DirectionDownLeft":
          x = - Math.abs(objInfo.offsetLeft + objInfo.width);
          y = objInfo.offsetBottom + objInfo.height;
          t1.from(object, duration, {
            x: x,
            y: y,
            ease: easeString,
            immediateRender: false
          });
          break;
        case "DirectionDownRight":
          x = Math.abs(objInfo.offsetRight + objInfo.width);
          y = Math.abs(objInfo.offsetBottom + objInfo.height);
          t1.from(object, duration, {
            x: x,
            y: y,
            ease: easeString,
            immediateRender: false
          });
          break;
        case "DirectionUpLeft":
          x =  - Math.abs(objInfo.offsetLeft + objInfo.width);
          y =  - Math.abs(objInfo.offsetTop + objInfo.height);
          t1.from(object, duration, {
            x: x,
            y: y,
            ease: easeString,
            immediateRender: false
          });
          break;
        case "DirectionUpRight":
          x = Math.abs(objInfo.offsetRight + objInfo.width);
          y = - Math.abs(objInfo.offsetTop + objInfo.height);
          t1.from(object, duration, {
            x: x,
            y: y,
            ease: easeString,
            immediateRender: false
          });
          break;
        default:
          console.log("getEffectFly:parameter error.");
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
          x: 0,
          y: 0,
          visibility: "hidden" //clearProps功能(对象被还原)必须隐藏对象
        }]
      });
      switch(direction) {
        case "DirectionDown":
          y = Math.abs(objInfo.offsetBottom + objInfo.height);
          t1.to(object, duration, {
            y: y,
            //clearProps: "y",
            ease: easeString
          });
          break;
        case "DirectionLeft":
          x =  - Math.abs(objInfo.offsetLeft + objInfo.width);
          t1.to(object, duration, {
            x: x,
            //clearProps: "x",
            ease: easeString
          });
          break;
        case "DirectionUp":
          y =  - Math.abs(objInfo.offsetTop + objInfo.height);
          t1.to(object, duration, {
            y: y,
            //clearProps: "y",
            ease: easeString
          });
          break;
        case "DirectionRight":
          x = Math.abs(objInfo.offsetRight + objInfo.width);
          t1.to(object, duration, {
            x: x,
            //clearProps: "x",
            ease: easeString
          });
          break;
        case "DirectionDownLeft":
          x = - Math.abs(objInfo.offsetLeft + objInfo.width);
          y = objInfo.offsetBottom + objInfo.height;
          t1.to(object, duration, {
            x: x,
            y: y,
            //clearProps: "x,y",
            ease: easeString
          });
          break;
        case "DirectionDownRight":
          x = Math.abs(objInfo.offsetRight + objInfo.width);
          y = Math.abs(objInfo.offsetBottom + objInfo.height);
          t1.to(object, duration, {
            x: x,
            y: y,
            //clearProps: "x,y",
            ease: easeString
          });
          break;
        case "DirectionUpLeft":
          x =  - Math.abs(objInfo.offsetLeft + objInfo.width);
          y =  - Math.abs(objInfo.offsetTop + objInfo.height);
          t1.to(object, duration, {
            x: x,
            y: y,
            //clearProps: "x,y",
            ease: easeString
          });
          break;
        case "DirectionUpRight":
          x = Math.abs(objInfo.offsetRight + objInfo.width);
          y =  - Math.abs(objInfo.offsetTop + objInfo.height);
          t1.to(object, duration, {
            x: x,
            y: y,
            //clearProps: "x,y",
            ease: easeString
          });
          break;
        default:
          console.log("getEffectFly:parameter error.")
          break;
      }
    }
    return t1;
  }

  //浮入/浮出(下方)
  animproto.getEffectAscend = function(parameter, object, duration, delay, repeat, isExit) {
    var t1 = null;
    if(isExit == false) {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object]
      });
      //t1.to(object, 0.001, {opacity: 0, y: 100}).to(object, duration - 0.001, {autoAlpha: 1, y: 0, ease: parameter.tweenEase});
      t1.from(object, duration, {
        autoAlpha: 0,
        y: 100,
        ease: parameter.tweenEase,
        immediateRender: false
      });
    } else {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object, {
          opacity: 1,
          y: 0
        }]
      });
      t1.to(object, duration, {
        autoAlpha: 0,
        y: 100,
        //clearProps: "y", //己失效
        ease: parameter.tweenEase
      });
    }
    return t1;
  }

  //浮入/浮出(上方)
  animproto.getEffectDescend = function(parameter, object, duration, delay, repeat, isExit) {
    var t1 = null;
    if(isExit == false) {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object]
      });
      //t1.to(object, 0.001, {y: -100}).to(object, duration - 0.001, {autoAlpha: 1, y: 0, ease: parameter.tweenEase});
      t1.from(object, duration, {
        autoAlpha: 0,
        y: -100,
        ease: parameter.tweenEase,
        immediateRender: false
      });
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
      t1.to(object, duration, {
        autoAlpha: 0,
        y: -100,
        ease: parameter.tweenEase,
        clearProps: "y"
      });
    }
    return t1;
  }

  //切入/出
  animproto.getEffectPeek = function(parameter, object, duration, delay, repeat, isExit) {
    var direction = parameter.direction; //方向(上下左右)
    var t1 = null;
    var objInfo = this._getObjectInfo(object);
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
        case "DirectionUp":
          t1.from(object, duration, {
            y: -objInfo.height,
            ease: Linear.easeNone,
            onUpdate: this._updateClipRect,
            onUpdateParams: [t1, object, isExit, "DirectionDown", objInfo]
          });
          break;
        case "DirectionDown":
          t1.from(object, duration, {
            y: objInfo.height,
            ease: Linear.easeNone,
            onUpdate: this._updateClipRect,
            onUpdateParams: [t1, object, isExit, "DirectionUp", objInfo]
          });
          break;
        case "DirectionLeft":
          t1.from(object, duration, {
            x: -objInfo.width,
            ease: Linear.easeNone,
            onUpdate: this._updateClipRect,
            onUpdateParams: [t1, object, isExit, "DirectionRight", objInfo]
          });
          break;
        case "DirectionRight":
          t1.from(object, duration, {
            x: objInfo.width,
            ease: Linear.easeNone,
            onUpdate: this._updateClipRect,
            onUpdateParams: [t1, object, isExit, "DirectionLeft", objInfo]
          });
          break;
        default:
          console.log("getEffectPeek:parameter error.");
          break;
      }
    } else {
      t1 = new TimelineMax({
        delay: delay,
        repeat: repeat,
        onStart: this._startHandler,
        onStartParams: [parameter, object],
        onComplete: this._completeHandler,
        onCompleteParams: [parameter, object]
      });
      switch(direction) {
        case "DirectionUp":
          t1.to(object, duration, {
            y: -objInfo.height,
            ease: Linear.easeNone,
            onUpdate: this._updateClipRect,
            onUpdateParams: [t1, object, isExit, "DirectionUp", objInfo]
          });
          break;
        case "DirectionDown":
          t1.to(object, duration, {
            y: objInfo.height,
            ease: Linear.easeNone,
            onUpdate: this._updateClipRect,
            onUpdateParams: [t1, object, isExit, "DirectionDown", objInfo]
          });
          break;
        case "DirectionLeft":
          t1.to(object, duration, {
            x: -objInfo.width,
            ease: Linear.easeNone,
            onUpdate: this._updateClipRect,
            onUpdateParams: [t1, object, isExit, "DirectionLeft", objInfo]
          });
          break;
        case "DirectionRight":
          t1.to(object, duration, {
            x: objInfo.width,
            ease: Linear.easeNone,
            onUpdate: this._updateClipRect,
            onUpdateParams: [t1, object, isExit, "DirectionRight", objInfo]
          });
          break;
        default:
          console.log("getEffectPeek:parameter error.");
          break;
      }
    }
    return t1;
  }

  //螺旋飞入/出
  animproto.getEffectSpiral = function(parameter, object, duration, delay, repeat, isExit) {
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object, {
        visibility: "visible"
      }],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    var easeString = Power1.easeInOut;
    if(parameter.tweenEase && parameter.tweenEase.length > 0) easeString = parameter.tweenEase;
    if(isExit == false) {
      t1.from(object, duration, {
        scale: 0,
        bezier: {
          type: "cubic",
          values: [{
            x: 0,
            y: 0
          }, {
            x: 200,
            y: -200
          }, {
            x: 0,
            y: -400
          }, {
            x: -500,
            y: -600
          }]
        },
        ease: easeString
      });
    } else {
      t1.to(object, duration, {
        scale: 0,
        bezier: {
          type: "cubic",
          values: [{
            x: 0,
            y: 0
          }, {
            x: 200,
            y: -200
          }, {
            x: 0,
            y: -400
          }, {
            x: -500,
            y: -600
          }]
        },
        ease: easeString
      });
    }
    return t1;
  }

  //曲线向上/下
  animproto.getEffectArcUp = function(parameter, object, duration, delay, repeat, isExit) {
    var t1 = null;
    var easeString = Power1.easeInOut;
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
      t1.from(object, duration, {
        autoAlpha: 0,
        scale: 2,
        bezier: {
          type: "cubic",
          values: [{
            x: 0,
            y: 0
          }, {
            x: 200,
            y: 200
          }, {
            x: 0,
            y: 400
          }, {
            x: -500,
            y: 600
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
          opacity: 1,
          scale: 1
        }]
      });
      t1.to(object, duration, {
        autoAlpha: 0,
        scale: 2,
        bezier: {
          type: "cubic",
          values: [{
            x: 0,
            y: 0
          }, {
            x: 200,
            y: 200
          }, {
            x: 0,
            y: 400
          }, {
            x: -500,
            y: 600
          }]
        },
        ease: easeString,
        clearProps: "x,y"
      });
    }
    return t1;
  }

  //升起/下沉
  animproto.getEffectRiseUp = function(parameter, object, duration, delay, repeat, isExit) {
    var t1 = null;
    var objInfo = this._getObjectInfo(object);
    var y = objInfo.offsetBottom + objInfo.height;
    var easeString = Back.easeInOut;
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
      t1.from(object, duration, {
        autoAlpha: 0,
        y: y,
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
          opacity: 1
        }]
      });
      t1.to(object, duration, {
        autoAlpha: 0,
        y: y,
        ease: easeString
      });
    }
    return t1;
  }

}
