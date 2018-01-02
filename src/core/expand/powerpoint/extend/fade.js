const filter = Xut.style.filter

/**
 * 淡入淡出动画
 * @param  {[type]} animproto [description]
 * @return {[type]}           [description]
 */
export default function fade(animproto) {

  //出现/消失
  animproto.getEffectAppear = function(parameter, object, duration, delay, repeat, isExit) {
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    if (isExit == false)
      t1.to(object, 0.001, {
        autoAlpha: 1
      });
    else
      t1.to(object, 0.001, {
        css: {
          visibility: "hidden"
        }
      });
    return t1;
  }

  //淡出
  animproto.getEffectFade = function(parameter, object, duration, delay, repeat, isExit) {
    var t1 = null;
    if (isExit == false) {
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
        ease: parameter.tweenEase
      });
    }
    return t1;
  }

  //闪烁(一次)
  animproto.getEffectFlashOnce = function(parameter, object, duration, delay, repeat) {
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    var time = duration / 3;
    t1.to(object, 0.001, {
      css: {
        visibility: "hidden"
      }
    }).to(object, time * 2, {}).to(object, time, {
      css: {
        visibility: "visible"
      }
    });
    return t1;
  }

  //不饱和
  animproto.getEffectDesaturate = function(parameter, object, duration, delay, repeat) {
    if (!(filter in object[0].style)) return new TimelineMax();
    var saturation = parameter.saturation ? parameter.saturation : 0.5; //饱和度
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object, {
        filter: "none"
      }]
    });
    t1.to(object, duration, {
      onUpdate: updateSaturate
    });
    return t1;

    function updateSaturate() {
      var progress = t1.progress();
      var percent = (progress <= 0.5) ? progress * 2 : 1;
      var val = 1 + (saturation - 1) * percent;
      object.css(filter, "saturate(" + val + ")");
    }
  }

  //加深
  animproto.getEffectDarken = function(parameter, object, duration, delay, repeat) {
    if (!(filter in object[0].style)) return new TimelineMax();
    var brightness = (parameter.brightness && parameter.brightness < 1) ? brightness.saturation : 0.5; //亮度
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object, {
        filter: "none"
      }]
    });
    t1.to(object, duration, {
      onUpdate: updateBrightness
    });
    return t1;

    function updateBrightness() {
      var progress = t1.progress();
      var percent = (progress <= 0.5) ? progress * 2 : 1;
      var val = 1 + (brightness - 1) * percent;
      object.css(filter, "brightness(" + val + ")");
    }
  }

  //变淡
  animproto.getEffectLighten = function(parameter, object, duration, delay, repeat) {
    if (!(filter in object[0].style)) return new TimelineMax();
    var brightness = (parameter.brightness && parameter.brightness > 1) ? parameter.brightness : 1.5; //亮度
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object, {
        filter: "none"
      }]
    });
    t1.to(object, duration, {
      onUpdate: updateBrightness
    });
    return t1;

    function updateBrightness() {
      var progress = t1.progress();
      var percent = (progress <= 0.5) ? progress * 2 : 1;
      var val = 1 + (brightness - 1) * percent;
      object.css(filter, "brightness(" + val + ")");
    }
  }

  //透明
  animproto.getEffectTransparency = function(parameter, object, duration, delay, repeat) {
    var opacity = parameter.amount ? parameter.amount : 0.5; //透明度
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    t1.to(object, duration, {
      autoAlpha: opacity,
      ease: parameter.tweenEase
    });
    return t1;
  }

}
