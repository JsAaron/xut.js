/**
 * 形状动画
 * @param  {[type]} animproto [description]
 * @return {[type]}           [description]
 */
export default function shape(animproto) {

  //形状一(圆)
  animproto.getEffectCircle = function(parameter, object, duration, delay, repeat, isExit) {
    if(this.useMask == false) return this.getEffectAppear(parameter, object, duration, delay, repeat, isExit);

    var direction = parameter.direction; //方向(DirectionIn、DirectionOut)
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object, {
        visibility: "visible"
      }],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    })
    var result = this._getObjectInfo(object);
    var radius = Math.ceil(Math.sqrt(result.width * result.width / 4 + result.height * result.height / 4));
    switch(direction) {
      case "DirectionIn": //放大
      case "DirectionOut": //缩小
        if(isExit == false) {
          t1.to(object, duration, {
            onUpdate: updateCircleGradient
          });
        } else {
          t1.to(object, duration, {
            onUpdate: updateCircleGradient
          });
        }
        break;
      default:
        console.log("getEffectCircle:parameter error.");
        break;
    }
    return t1;

    function updateCircleGradient() {
      var progress = t1.progress();
      var len = parseInt(progress * radius);
      if(isExit == false)
        switch(direction) {
          case "DirectionIn": //DirectionIn放大
            object.css("-webkit-mask", "-webkit-gradient(radial,center center," + (radius - len) + ",center center,0,from(rgba(0,0,0,1)),to(rgba(0,0,0,0)),color-stop(10%,rgba(0,0,0,0)))");
            if(len == radius) object.css("-webkit-mask", "none");
            break;
          case "DirectionOut": //DirectionOut缩小
            object.css("-webkit-mask", "-webkit-gradient(radial,center center,0,center center, " + len + ",from(rgba(0,0,0,1)), to(rgba(0,0,0,0)), color-stop(90%, rgba(0,0,0,1)))");
            if(len == radius) object.css("-webkit-mask", "none");
            break;
        } else {
          switch(direction) {
            case "DirectionIn": //DirectionIn放大
              object.css("-webkit-mask", "-webkit-gradient(radial,center center," + (radius - len) + ",center center,0,from(rgba(0,0,0,0)),to(rgba(0,0,0,1)),color-stop(10%,rgba(0,0,0,1)))");
              if(len == radius) {
                //object.css("opacity","0");
                object.css("visibility", "hidden");
                object.css("-webkit-mask", "none");
              }
              break;
            case "DirectionOut": //DirectionOut缩小
              object.css("-webkit-mask", "-webkit-gradient(radial,center center,0,center center, " + len + ",from(rgba(0,0,0,0)), to(rgba(0,0,0,1)), color-stop(90%, rgba(0,0,0,0)))");
              if(len == radius) {
                //object.css("opacity","0");
                object.css("visibility", "hidden");
                object.css("-webkit-mask", "none");
              }
              break;
          }
        }
    }
  }

  //形状二(方框)
  animproto.getEffectBox = function(parameter, object, duration, delay, repeat, isExit) {
    var direction = parameter.direction; //方向(DirectionIn、DirectionOut)
    if(this.useMask == false) direction = "DirectionOut";

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
    t1.to(object, duration, {
      onUpdate: updateEffectBox
    });
    return t1;

    function updateEffectBox() {
      var width, height, left, top
      var progress = t1.progress();
      var percent = progress / 2;
      if(isExit == false) {
        switch(direction) {
          case "DirectionIn":
            object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (percent) + ",rgba(0,0,0,1)),color-stop(" + (percent) + ",transparent),color-stop(" + (1 - percent) + ",transparent),color-stop(" + (1 - percent) + ",rgba(0,0,0,1))),-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (percent) + ",rgba(0,0,0,1)),color-stop(" + (percent) + ",transparent),color-stop(" + (1 - percent) + ",transparent),color-stop(" + (1 - percent) + ",rgba(0,0,0,1)))");
            break;
          case "DirectionOut":
            top = objInfo.height * (0.5 - percent);
            height = objInfo.height - top;
            left = objInfo.width * (0.5 - percent);
            width = objInfo.width - left;
            object.css("clip", "rect(" + top + "px " + width + "px " + height + "px " + left + "px)");
            break;
          default:
            console.log("getEffectBox:parameter error.");
            break;
        }
        if(percent >= 0.5) object.css("-webkit-mask", "none");
      } else {
        switch(direction) {
          case "DirectionIn":
            object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",transparent),color-stop(" + (0.5 + percent) + ",transparent),color-stop(" + (0.5 + percent) + ",rgba(0,0,0,1))),-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",transparent),color-stop(" + (0.5 + percent) + ",transparent),color-stop(" + (0.5 + percent) + ",rgba(0,0,0,1)))");
            break;
          case "DirectionOut":
            top = objInfo.height * percent;
            height = objInfo.height - top;
            left = objInfo.width * percent;
            width = objInfo.width - left;
            object.css("clip", "rect(" + top + "px " + width + "px " + height + "px " + left + "px)");
            break;
          default:
            console.log("getEffectBox:parameter error.");
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

  //形状三(菱形)
  animproto.getEffectDiamond = function(parameter, object, duration, delay, repeat, isExit) {
    if(this.useMask == false) return this.getEffectAppear(parameter, object, duration, delay, repeat, isExit);

    var direction = parameter.direction; //方向(DirectionIn、DirectionOut)
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
    // var objInfo = this._getObjectInfo(object);
    t1.to(object, duration, {
      onUpdate: updateEffectBox
    });
    return t1;

    function updateEffectBox() {
      var progress = t1.progress();
      var percent = progress / 2;
      if(isExit == false) {
        switch(direction) {
          case "DirectionOut":
          case "DirectionIn":
            object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 100% 100%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (percent) + ",rgba(0,0,0,1)),color-stop(" + (percent) + ",transparent),color-stop(" + (1 - percent) + ",transparent),color-stop(" + (1 - percent) + ",rgba(0,0,0,1))),-webkit-gradient(linear,0% 100%, 100% 0%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (percent) + ",rgba(0,0,0,1)),color-stop(" + (percent) + ",transparent),color-stop(" + (1 - percent) + ",transparent),color-stop(" + (1 - percent) + ",rgba(0,0,0,1)))");
            break;
          default:
            console.log("getEffectBox:parameter error.");
            break;
        }
        if(percent >= 0.5) object.css("-webkit-mask", "none");
      } else {
        switch(direction) {
          case "DirectionOut":
          case "DirectionIn":
            object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 100% 100%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",transparent),color-stop(" + (0.5 + percent) + ",transparent),color-stop(" + (0.5 + percent) + ",rgba(0,0,0,1))),-webkit-gradient(linear,0% 100%, 100% 0%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",transparent),color-stop(" + (0.5 + percent) + ",transparent),color-stop(" + (0.5 + percent) + ",rgba(0,0,0,1)))");
            break;
          default:
            console.log("getEffectBox:parameter error.");
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

  //形状四(加号)
  animproto.getEffectPlus = function(parameter, object, duration, delay, repeat, isExit) {
    if(this.useMask == false) return this.getEffectAppear(parameter, object, duration, delay, repeat, isExit);

    var direction = parameter.direction; //方向(DirectionIn、DirectionOut)
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
      onUpdate: updateEffectPlus
    });
    return t1;

    function updateEffectPlus() {
      var progress = t1.progress();
      var percent = progress / 2;
      if(isExit == false) {
        switch(direction) {
          case "DirectionIn":
          case "DirectionOut":
            object.css("-webkit-mask",
              "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,0)), to(rgba(0,0,0,0))," + "color-stop(" + (0.5 - percent) + ",transparent),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,1))," + "color-stop(" + (0.5 + percent) + ",rgba(0,0,0,1)),color-stop(" + (0.5 + percent) + ",transparent))," + "-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,0)), to(rgba(0,0,0,0))," + "color-stop(" + (0.5 - percent) + ",transparent),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,1))," + "color-stop(" + (0.5 + percent) + ",rgba(0,0,0,1)),color-stop(" + (0.5 + percent) + ",transparent))");
            break;
          default:
            console.log("getEffectPlus:parameter error.");
            break;
        }
        if(percent >= 0.5) object.css("-webkit-mask", "none");
      } else {
        switch(direction) {
          case "DirectionIn":
          case "DirectionOut":
            object.css("-webkit-mask",
              "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,0)), to(rgba(0,0,0,0))," + "color-stop(" + (percent) + ",transparent),color-stop(" + (percent) + ",rgba(0,0,0,1))," + "color-stop(" + (1 - percent) + ",rgba(0,0,0,1)),color-stop(" + (1 - percent) + ",transparent))," + "-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,0)), to(rgba(0,0,0,0))," + "color-stop(" + (percent) + ",transparent),color-stop(" + (percent) + ",rgba(0,0,0,1))," + "color-stop(" + (1 - percent) + ",rgba(0,0,0,1)),color-stop(" + (1 - percent) + ",transparent))");
            break;
          default:
            console.log("getEffectPlus:parameter error.");
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

}
