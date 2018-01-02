import {
  colorHexToRGB
} from './util'

const filter = Xut.style.filter

export default function special(animproto) {

  //文字动画
  animproto.getTextAnimation = function(parameter, object, duration, delay, repeat) {
    if(delay == 0) delay = 0.1; //子对象间延时不能为0
    var type = (parameter.effectType) ? parameter.effectType : "text1";
    var color = (parameter.startColor) ? parameter.startColor : "";
    var svgElement = object.find("svg").children();
    var t1 = new TimelineMax({
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object, {
        visibility: "visible"
      }],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    switch(type) {
      default:
        case "text5": //文字逐行蹦出(以行为单位)
        case "text1": //文字逐个蹦出(以字为单位)
        t1.staggerFrom(svgElement.children(), duration, {
          css: {
            'opacity': 0
          }
        }, delay);
      break;
      case "text2": //文字放大出现(以字为单位)
          t1.staggerFrom(svgElement.children(), duration, {
            css: {
              'opacity': 0,
              "font-size": 120
            },
            ease: "Strong.easeOut"
          }, delay);
        break;
      case "text3": //文字缩小出现(以字为单位)
          t1.staggerFrom(svgElement.children(), duration, {
            css: {
              'opacity': 0,
              "font-size": 0
            },
            ease: "Power1.easeIn"
          }, delay);
        break;
      case "text4": //文字渐变出现(以字为单位)
          t1.staggerFrom(svgElement.children(), duration, {
            css: {
              'opacity': 0,
              "fill": color
            },
            ease: "Power1.easeIn"
          }, delay);
        break;
    }
    return t1;
  }

  //脉冲
  animproto.getEffectFlashBulb = function(parameter, object, duration, delay, repeat) {
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    var range = (Number(parameter.range)) ? parameter.range : 0.1;
    var time = duration / 2;
    t1.to(object, time, {
        autoAlpha: 0.5,
        scale: "+=" + range
      })
      .to(object, time, {
        autoAlpha: 1,
        scale: "-=" + range
      });
    return t1;
  }

  //百叶窗
  animproto.getEffectBlinds = function(parameter, object, duration, delay, repeat, isExit) {
    if(this.useMask == false) return this.getEffectAppear(parameter, object, duration, delay, repeat, isExit);

    var direction = parameter.direction; //方向（水平：DirectionHorizontal、垂直：DirectionVertical）
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
    t1.to(object, duration, {
      onUpdate: updateEffectBlinds
    });
    return t1;

    function updateEffectBlinds() {
      var num = 6; //分成N等份
      var progress = t1.progress();
      var percent = progress / num;
      var avg = 1 / num;
      var temp = 0.01; //渐变的过渡区
      var str = "";
      if(isExit == false) {
        switch(direction) {
          case "DirectionHorizontal": //水平
            str = "-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,1)), to(rgba(0,0,0,0))" + ",color-stop(" + (percent) + ",rgba(0,0,0,1))" + ",color-stop(" + (percent + temp) + ",rgba(0,0,0,0))";
            for(var i = 1; i < num; i++) {
              str += ",color-stop(" + (i * avg) + ",rgba(0,0,0,0))" + ",color-stop(" + (i * avg + temp) + ",rgba(0,0,0,1))";
              str += ",color-stop(" + (i * avg + percent) + ",rgba(0,0,0,1))" + ",color-stop(" + (i * avg + percent + temp) + ",rgba(0,0,0,0))";
            }
            str += ")";
            break;
          case "DirectionVertical": //垂直
            str = "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,1)), to(rgba(0,0,0,0))" + ",color-stop(" + (percent) + ",rgba(0,0,0,1))" + ",color-stop(" + (percent + temp) + ",rgba(0,0,0,0))";
            for(var j = 1; j < num; j++) {
              str += ",color-stop(" + (j * avg) + ",rgba(0,0,0,0))" + ",color-stop(" + (j * avg + temp) + ",rgba(0,0,0,1))";
              str += ",color-stop(" + (j * avg + percent) + ",rgba(0,0,0,1))" + ",color-stop(" + (j * avg + percent + temp) + ",rgba(0,0,0,0))";
            }
            str += ")";
            break;
          default:
            console.log("getEffectBlinds:parameter error.");
            break;
        }
        object.css("-webkit-mask", str);
        if(percent >= (avg - temp)) object.css("-webkit-mask", "none");
      } else {
        switch(direction) {
          case "DirectionHorizontal": //水平
            str = "-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,1)), to(rgba(0,0,0,0))" + ",color-stop(" + (1 - percent) + ",rgba(0,0,0,0))" + ",color-stop(" + (1 - percent - temp) + ",rgba(0,0,0,1))";
            for(var n = 1; n < num; n++) {
              str += ",color-stop(" + (n * avg) + ",rgba(0,0,0,1))" + ",color-stop(" + (n * avg - temp) + ",rgba(0,0,0,0))";
              str += ",color-stop(" + (n * avg - percent) + ",rgba(0,0,0,0))" + ",color-stop(" + (n * avg - percent - temp) + ",rgba(0,0,0,1))";
            }
            str += ")";
            break;
          case "DirectionVertical": //垂直
            str = "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,1)), to(rgba(0,0,0,0))" + ",color-stop(" + (1 - percent) + ",rgba(0,0,0,0))" + ",color-stop(" + (1 - percent - temp) + ",rgba(0,0,0,1))";
            for(var k = 1; k < num; k++) {
              str += ",color-stop(" + (k * avg) + ",rgba(0,0,0,1))" + ",color-stop(" + (k * avg - temp) + ",rgba(0,0,0,0))";
              str += ",color-stop(" + (k * avg - percent) + ",rgba(0,0,0,0))" + ",color-stop(" + (k * avg - percent - temp) + ",rgba(0,0,0,1))";
            }
            str += ")";
            break;
          default:
            console.log("getEffectBlinds:parameter error.");
            break;
        }
        object.css("-webkit-mask", str);
        if(percent >= (avg - temp)) {
          //object.css("opacity","0");
          object.css("visibility", "hidden");
          object.css("-webkit-mask", "none");
        }
      }
    }
  }

  //劈裂
  animproto.getEffectSplit = function(parameter, object, duration, delay, repeat, isExit) {
    if(this.useMask == false) return this.getEffectAppear(parameter, object, duration, delay, repeat, isExit);

    var direction = parameter.direction; //方向(DirectionVerticalIn、DirectionHorizontalIn、DirectionHorizontalOut、DirectionVerticalOut)
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
    t1.to(object, duration, {
      onUpdate: updateEffectSplit
    });
    return t1;

    function updateEffectSplit() {
      var progress = t1.progress();
      var percent = progress / 2;
      if(isExit == false) {
        if(progress > 0.9) { //跳过最后10%（解决iPad的闪问题）
          object.css("-webkit-mask", "none");
          return;
        }
        switch(direction) {
          case "DirectionVerticalIn": //左右向中间收
            object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (percent - 0.05) + ",rgba(0,0,0,1)),color-stop(" + percent + ",rgba(0,0,0,0)),color-stop(" + (1 - percent) + ",rgba(0,0,0,0)),color-stop(" + (1 - percent + 0.05) + ",rgba(0,0,0,1)))");
            break;
          case "DirectionHorizontalIn": //上下向中间收
            object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (percent - 0.05) + ",rgba(0,0,0,1)),color-stop(" + percent + ",rgba(0,0,0,0)),color-stop(" + (1 - percent) + ",rgba(0,0,0,0)),color-stop(" + (1 - percent + 0.05) + ",rgba(0,0,0,1)))");
            break;
          case "DirectionHorizontalOut": //中间向上下展开
            object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,0)), to(rgba(0,0,0,0)),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,0)),color-stop(" + (0.55 - percent) + ",rgba(0,0,0,1)),color-stop(" + (0.5 + percent) + ",rgba(0,0,0,1)),color-stop(" + (percent + 0.55) + ",rgba(0,0,0,0)))");
            break;
          case "DirectionVerticalOut": //中间向左右展开
            object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,0)), to(rgba(0,0,0,0)),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,0)),color-stop(" + (0.55 - percent) + ",rgba(0,0,0,1)),color-stop(" + (0.5 + percent) + ",rgba(0,0,0,1)),color-stop(" + (percent + 0.55) + ",rgba(0,0,0,0)))");
            break;
          default:
            console.log("getEffectSplit:parameter error.");
            break;
        }
        //if (percent >= 0.5) object.css("-webkit-mask", "none");
      } else {
        if(progress < 0.1) return; //跳过前面10%（解决iPad的闪问题）
        switch(direction) {
          case "DirectionVerticalIn": //左右向中间收
            object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,0)), to(rgba(0,0,0,0)),color-stop(" + (percent - 0.05) + ",rgba(0,0,0,0)),color-stop(" + percent + ",rgba(0,0,0,1)),color-stop(" + (1 - percent) + ",rgba(0,0,0,1)),color-stop(" + (1 - percent + 0.05) + ",rgba(0,0,0,0)))");
            break;
          case "DirectionHorizontalIn": //上下向中间收
            object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,0)), to(rgba(0,0,0,0)),color-stop(" + (percent - 0.05) + ",rgba(0,0,0,0)),color-stop(" + percent + ",rgba(0,0,0,1)),color-stop(" + (1 - percent) + ",rgba(0,0,0,1)),color-stop(" + (1 - percent + 0.05) + ",rgba(0,0,0,0)))");
            break;
          case "DirectionHorizontalOut": //中间向上下展开
            object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,1)),color-stop(" + (0.55 - percent) + ",rgba(0,0,0,0)),color-stop(" + (0.5 + percent) + ",rgba(0,0,0,0)),color-stop(" + (percent + 0.55) + ",rgba(0,0,0,1)))");
            break;
          case "DirectionVerticalOut": //中间向左右展开
            object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,1)),color-stop(" + (0.55 - percent) + ",rgba(0,0,0,0)),color-stop(" + (0.5 + percent) + ",rgba(0,0,0,0)),color-stop(" + (percent + 0.55) + ",rgba(0,0,0,1)))");
            break;
          default:
            console.log("getEffectSplit:parameter error.");
            break;
        }
        if(percent >= 0.5) {
          //object.css("opacity","0");
          object.css("visibility", "hidden");
          object.css("-webkit-mask", "none");
        }
      }
    }
  }

  //擦除
  animproto.getEffectWipe = function(parameter, object, duration, delay, repeat, isExit) {
    var direction = parameter.direction; //方向(上下左右)
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
    var objInfo = this._getObjectInfo(object);
    if(isExit == false) {
      //t1.to(object,duration,{onStart:this._startHandler,onStartParams:[object],onUpdate:this.updateLineGradient,onUpdateParams:[t1,object,isExit,direction]});
      t1.to(object, duration, {
        onUpdate: this._updateClipRect,
        onUpdateParams: [t1, object, isExit, direction, objInfo]
      });
    } else {
      //t1.to(object,duration,{onUpdate:this.updateLineGradient,onUpdateParams:[t1,object,isExit,direction]});
      t1.to(object, duration, {
        onUpdate: this._updateClipRect,
        onUpdateParams: [t1, object, isExit, direction, objInfo]
      });
    }
    return t1;
  }

  //翻转式由远及近
  animproto.getEffectGrowAndTurn = function(parameter, object, duration, delay, repeat, isExit) {
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
      t1.from(object, duration, {
        autoAlpha: 0,
        scale: 0,
        rotation: "90deg",
        ease: parameter.tweenEase,
        clearProps: "scale,rotation"
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
          scale: 1,
          rotation: "0deg"
        }]
      });
      t1.to(object, duration, {
        autoAlpha: 0,
        scale: 0,
        rotation: "90deg",
        ease: parameter.tweenEase
      });
    }
    return t1;
  }

  //玩具风车
  animproto.getEffectPinwheel = function(parameter, object, duration, delay, repeat, isExit) {
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
      t1.from(object, duration, {
        autoAlpha: 0,
        scale: 0,
        rotation: "540deg",
        ease: parameter.tweenEase
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
          scale: 1,
          rotation: "0deg"
        }]
      });
      t1.to(object, duration, {
        autoAlpha: 0,
        scale: 0,
        rotation: "540deg",
        ease: parameter.tweenEase
      });
    }
    return t1;
  }

  //展开/收缩
  animproto.getEffectExpand = function(parameter, object, duration, delay, repeat, isExit) {
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
      t1.from(object, duration, {
        autoAlpha: 0,
        rotationY: "45deg",
        ease: parameter.tweenEase
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
          rotationY: "0deg"
        }]
      });
      t1.to(object, duration, {
        autoAlpha: 0,
        rotationY: "45deg",
        ease: parameter.tweenEase
      });
    }
    return t1;
  }

  //浮动
  animproto.getEffectFloat = function(parameter, object, duration, delay, repeat, isExit) {
    var t1 = null;
    var objInfo = this._getObjectInfo(object);
    var x, y
    if(isExit == false) {
      x = objInfo.offsetRight + objInfo.width;
      y = 0 - (objInfo.offsetTop + objInfo.height);
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
        rotation: "-45deg",
        x: x,
        y: y,
        ease: parameter.tweenEase
      });
    } else {
      x = objInfo.offsetRight + objInfo.width;
      y = 0 - (objInfo.offsetTop + objInfo.height);
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
        rotation: "-45deg",
        x: x,
        y: y,
        ease: parameter.tweenEase
      });
    }
    return t1;
  }

  //字幕式
  animproto.getEffectCredits = function(parameter, object, duration, delay, repeat, isExit) {
    var objInfo = this._getObjectInfo(object);
    var y = 0,
      top = 0;
    if(isExit == false) {
      //从下往上移
      y = 0 - (this.visualHeight + objInfo.height);
      top = objInfo.top + objInfo.offsetBottom + objInfo.height;
    } else {
      //从上往下移
      y = this.visualHeight + objInfo.height;
      top = objInfo.top - (objInfo.offsetTop + objInfo.height);
    }
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object, {
        visibility: "visible",
        top: top + "px"
      }],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    t1.to(object, duration, {
      y: y,
      ease: parameter.tweenEase
    });
    return t1;
  }

  //弹跳
  animproto.getEffectBounce = function(parameter, object, duration, delay, repeat, isExit) {
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
    var objInfo = this._getObjectInfo(object);

    var time2, time3, time4, time5, y1, y2, y3, y4, lastY, height, time1, total, width

    if(isExit == false) {
      total = duration;
      time1 = total / 5;
      time2 = total / 10;
      time3 = total / 20;
      time4 = total / 40;
      time5 = total / 80;
      width = 50 + 20 + 10 + 5 + 2.5 + 1 + 0.5 + 0.2 + 0.1;
      height = this.visualHeight / 4;
      y1 = height / 2;
      y2 = height / 4;
      y3 = height / 8;
      y4 = height / 16;
      lastY = objInfo.offsetBottom - height + objInfo.height;

      t1.to(object, 0.01, {
          x: -width,
          y: -height
        })
        .to(object, time1, {
          x: "+=50",
          y: "+=" + height,
          ease: Circ.easeIn
        }) //慢到快
        .to(object, time1, {
          x: "+=20",
          y: "-=" + y1,
          scaleY: 0.8,
          ease: Circ.easeOut
        }) //快到慢
        .to(object, time1, {
          x: "+=10",
          y: "+=" + y1,
          scaleY: 1,
          ease: Circ.easeIn
        })
        .to(object, time2, {
          x: "+=5",
          y: "-=" + y2,
          scaleY: 0.85,
          ease: Circ.easeOut
        })
        .to(object, time2, {
          x: "+=2.5",
          y: "+=" + y2,
          scaleY: 1,
          ease: Circ.easeIn
        })
        .to(object, time3, {
          x: "+=1",
          y: "-=" + y3,
          scaleY: 0.9,
          ease: Circ.easeOut
        })
        .to(object, time3, {
          x: "+=0.5",
          y: "+=" + y3,
          scaleY: 1,
          ease: Circ.easeIn
        })
        .to(object, time4, {
          x: "+=0.2",
          y: "-=" + y4,
          scaleY: 0.95,
          ease: Circ.easeOut
        })
        .to(object, time4, {
          x: "+=0.1",
          y: "+=" + y4,
          scaleY: 1,
          ease: Circ.easeIn,
          clearProps: "x,y"
        });
      return t1;
    } else {
      total = duration;
      time1 = total / 5;
      time2 = total / 10;
      time3 = total / 20;
      time4 = total / 40;
      time5 = total / 80;
      height = this.visualHeight / 4;
      y1 = height / 2;
      y2 = height / 4;
      y3 = height / 8;
      y4 = height / 16;
      lastY = objInfo.offsetBottom - height + objInfo.height;
      t1.to(object, time1, {
          x: "+=50",
          y: "+=" + height,
          ease: Circ.easeIn
        }) //慢到快
        .to(object, time1, {
          x: "+=20",
          y: "-=" + y1,
          scaleY: 0.8,
          ease: Circ.easeOut
        }) //快到慢
        .to(object, time1, {
          x: "+=10",
          y: "+=" + y1,
          scaleY: 1,
          ease: Circ.easeIn
        })
        .to(object, time2, {
          x: "+=5",
          y: "-=" + y2,
          scaleY: 0.85,
          ease: Circ.easeOut
        })
        .to(object, time2, {
          x: "+=2.5",
          y: "+=" + y2,
          scaleY: 1,
          ease: Circ.easeIn
        })
        .to(object, time3, {
          x: "+=1",
          y: "-=" + y3,
          scaleY: 0.9,
          ease: Circ.easeOut
        })
        .to(object, time3, {
          x: "+=0.5",
          y: "+=" + y3,
          scaleY: 1,
          ease: Circ.easeIn
        })
        .to(object, time4, {
          x: "+=0.2",
          y: "-=" + y4,
          scaleY: 0.95,
          ease: Circ.easeOut
        })
        .to(object, time4, {
          x: "+=0.1",
          y: "+=" + y4,
          scaleY: 1,
          ease: Circ.easeIn
        })
        .to(object, time5, {
          x: "+=0.1",
          y: "+=" + lastY,
          ease: Circ.easeIn
        });
    }
    return t1;
  }

  //彩色脉冲
  animproto.getEffectFlicker = function(parameter, object, duration, delay, repeat) {
    if(!(filter in object[0].style)) return new TimelineMax();
    //if (repeat < 2) repeat = 2; //默认三次
    var color2 = parameter.color2 ? parameter.color2 : "#fff"; //颜色
    var maxGlowSize = (parameter.maxGlowSize) ? parameter.maxGlowSize : 0.1; //光晕最大尺寸(百分比)
    var minGlowSize = (parameter.minGlowSize) ? parameter.minGlowSize : 0.05; //光晕最小尺寸(百分比)
    var size = (object.width() > object.height()) ? object.height() : object.width();
    var maxSize = maxGlowSize * size;
    var minSize = minGlowSize * size;
    var opacity = (Number(parameter.opacity)) ? parameter.opcity : 0.75; //不透明度
    var distance = (Number(parameter.distance)) ? parameter.distance * size : 0; //距离
    var color = colorHexToRGB(color2, opacity);
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object, {
        //"box-shadow": "none"
        filter: "none"
      }]
    });
    t1.to(object, duration, {
      onUpdate: updateEffectFlicker
    });
    return t1;

    function updateEffectFlicker() {
      var progress = t1.progress();
      var percent = parseInt(progress * (maxSize - minSize));
      if(progress > 0.5) percent = parseInt((1 - progress) * (maxSize - minSize));
      //object.css("box-shadow", distance + "px " + distance + "px " + minSize + "px " + (minSize + percent) + "px " + color);
      object.css(filter, "drop-shadow(" + color + " " + distance + "px " + distance + "px " + (minSize + percent) + "px)");
    }
  }

  //跷跷板
  animproto.getEffectTeeter = function(parameter, object, duration, delay, repeat) {
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    // var mode = parameter.mode;
    var range = (Number(parameter.range)) ? parameter.range : 0.02;
    var time = duration / 8; //计算指定动画时间内每次运动时间(总时长不变，循环除外)
    switch(parameter.mode) {
      case 1: //左右移动
        range = range * object.width();
        t1.to(object, time, {
            x: -range
          })
          .to(object, time * 2, {
            x: range
          });
        //for (var i = 1; i < repeat; i++) {
        t1.to(object, time * 2, {
          x: -range
        });
        t1.to(object, time * 2, {
          x: range
        });
        //}
        t1.to(object, time, {
          x: 0
        });
        break;
      case 2: //上下移动
        range = range * object.height();
        t1.to(object, time, {
            y: -range
          })
          .to(object, time * 2, {
            y: range
          });
        //for (var i = 1; i < repeat; i++) {
        t1.to(object, time * 2, {
          y: -range
        });
        t1.to(object, time * 2, {
          y: range
        });
        //}
        t1.to(object, time, {
          y: 0
        });
        break;
      case 3: //左右挤压
        t1.to(object, time, {
            scaleX: 1 + range
          })
          .to(object, time * 2, {
            scaleX: 1 - range
          });
        //for (var i = 1; i < repeat; i++) {
        t1.to(object, time * 2, {
          scaleX: 1 + range
        });
        t1.to(object, time * 2, {
          scaleX: 1 - range
        });
        //}
        t1.to(object, time, {
          scaleX: 1
        });
        break;
      case 4: //上下挤压
        t1.to(object, time, {
            scaleY: 1 + range
          })
          .to(object, time * 2, {
            scaleY: 1 - range
          });
        //for (var i = 1; i < repeat; i++) {
        t1.to(object, time * 2, {
          scaleY: 1 + range
        });
        t1.to(object, time * 2, {
          scaleY: 1 - range
        });
        //}
        t1.to(object, time, {
          scaleY: 1
        });
        break;
      case 0: //左右晃晃
      default:
        range = range * 100;
        t1.to(object, time, {
            rotation: range + "deg"
          })
          .to(object, time * 2, {
            rotation: (-range) + "deg"
          });
        //for (var i = 1; i < repeat; i++) {
        t1.to(object, time * 2, {
          rotation: range + "deg"
        });
        t1.to(object, time * 2, {
          rotation: (-range) + "deg"
        });
        //}
        t1.to(object, time, {
          rotation: "0deg"
        });
        break;
    }
    return t1;
  }

  //补色
  animproto.getEffectComplementaryColor = function(parameter, object, duration, delay, repeat) {
    var zIndex = Number(object.css("z-index"));
    if(isNaN(zIndex)) {
      zIndex = 10;
      console.log("The Z-index property for this object to get error.");
    }
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object, {
        "z-Index": zIndex + 100
      }],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object, {
        "z-Index": zIndex
      }]
    });
    t1.to(object, duration, {
      autoAlpha: 1
    });
    return t1;
  }

  //rect切割效果更新
  animproto._updateClipRect = function(t1, object, isExit, direction, objInfo) {
    var progress = t1.progress();
    var len = progress;
    var width, left, top, height
    if(isExit == false) {
      top = objInfo.height * (1 - len);
      height = objInfo.height - top;
      left = objInfo.width * (1 - len);
      width = objInfo.width - left;
      switch(direction) {
        case "DirectionUp":
          object.css("clip", "rect(0px " + objInfo.width + "px " + height + "px 0px)");
          break;
        case "DirectionDown":
          object.css("clip", "rect(" + top + "px " + objInfo.width + "px " + objInfo.height + "px 0px)");
          break;
        case "DirectionLeft":
          object.css("clip", "rect(0px " + width + "px " + objInfo.height + "px 0px)");
          break;
        case "DirectionRight":
          object.css("clip", "rect(0px " + objInfo.width + "px " + objInfo.height + "px " + left + "px)");
          break;
        default:
          console.log("_updateClipRect:parameter error.");
          break;
      }
    } else {
      top = objInfo.height * len;
      height = objInfo.height - top;
      left = objInfo.width * len;
      width = objInfo.width - left;
      switch(direction) {
        case "DirectionUp":
          object.css("clip", "rect(" + top + "px " + objInfo.width + "px " + objInfo.height + "px 0px)");
          break;
        case "DirectionDown":
          object.css("clip", "rect(0px " + objInfo.width + "px " + height + "px 0px)");
          break;
        case "DirectionLeft":
          object.css("clip", "rect(0px " + objInfo.width + "px " + objInfo.height + "px " + left + "px)");
          break;
        case "DirectionRight":
          object.css("clip", "rect(0px " + width + "px " + objInfo.height + "px 0px)");
          break;
        default:
          console.log("_updateClipRect:parameter error.");
          break;
      }
    }
  }

}
