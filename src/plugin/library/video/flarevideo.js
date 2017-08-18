/**
 * 修改代码
 * 1 503处，增加控制条开始隐藏
 */

;
(function ($) {

  var clickName = function () {
    if (Xut.plat.isMouseTouch) {
      return "touchend mouseup"
    }
    return Xut.plat.hasTouch ? 'touchend' : 'mouseup'
  }();


  var testVideoElement = $("<video />")[0];
  var nativeSupport = (typeof testVideoElement.canPlayType != 'undefined');
  var nativeFullScreenSupport = (
    (typeof testVideoElement.webkitEnterFullScreen != 'undefined') ? 'webkit' :
    (typeof testVideoElement.mozRequestFullScreen != 'undefined') ? 'mozGecko' :
    false);


  // webkitEnterFullScreen fails under Chrome at the moment
  if (navigator.userAgent.match('Chrome')) nativeFullScreenSupport = false;


  // width: this.options.width,
  // height: this.options.height,
  // poster: this.options.poster,
  // autoplay: this.options.autoplay,
  // preload: this.options.preload,
  // controls: this.options.controls,
  // autobuffer: this.options.autobuffer

  var defaults = {
    autoplay: false,
    controls: true,
    preload: "auto",
    poster: null,
    srcs: []
  };

  defaults.useNative = nativeSupport;
  defaults.useNativeFullScreen = nativeFullScreenSupport;

  var FlareVideo = function (parent, options) {

    this._class = FlareVideo;

    this.parent = parent;
    this.options = $.extend({}, defaults, options);

    /*
      <source src="horse.ogg" type="audio/ogg">
      media/src/type
     */
    this.sources = this.options.srcs || this.options.sources;

    this.useNative = this.options.useNative;
    // Only use full screen on HTML 5 atm
    this.options.useFullScreen = !!this.useNative;

    this.state = null;
    this.canPlay = false;
    this.inFullScreen = false;
    this.loaded = false;
    this.readyList = [];

    /*创建父容器*/
    this.setupElement();
    /*创建HTML5元素*/
    this.setupNative();
    /*绑定事件*/
    this.setupEvents();
    /*创建控制条*/
    this.setupControls();

    this.change("initial");

    /*开始加载视频*/
    this._load();

    /*绑定监控工具条的显示隐藏控制*/
    this.initHideIdie = false
    if (this.options.controls) {
      this.createIdleTimer();
    }
  };


  FlareVideo.fn = FlareVideo.prototype;


  FlareVideo.fn.clearTimeout = function () {
    if (this.checkTimer) {
      clearTimeout(this.checkTimer);
      this.checkTimer = null
    }
  }

  /**
   * 控制条显示检测时间
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  FlareVideo.fn.createIdleTimer = function () {

    var self = this
    var idle = false;

    /*检测的定时器*/
    var checkTimer = null

    self.triggerIdle = function (e, time) {

      var time = time || 2000

      /*如果点击是控制条区域，那么控制条不关闭，重新计算时间*/
      if (e && e.target && e.target.className !== 'video') {
        self.clearTimeout()
        self.checkTimer = setTimeout(self.triggerIdle, time);
        return
      }

      if (idle) {
        idle = false;
        self.idle("idle", true);
        /*通过手动触发，取消自动关闭*/
        self.clearTimeout()
      } else {
        idle = true;
        self.idle("idle", false);
        self.checkTimer = setTimeout(self.triggerIdle, time);
      }
    }

    this.element.on(clickName, self.triggerIdle);

    /*如果触发了控制条*/
    this.controls.on('touchmove mousemove', function (e) {
      self.triggerIdle(e, 3000)
    })
  };

  /**
   * 隐藏控制条
   * 开始播放第一次调用2S后隐藏控制条
   * @return {[type]} [description]
   */
  FlareVideo.fn.hideIdleTimer = function () {
    /*只处理第一次的隐藏*/
    if (!this.initHideIdie) {
      this.initHideIdie = true
      this.triggerIdle()
    }
  }


  /**
   * 异步流程控制
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  FlareVideo.fn.ready = function (callback) {
    this.readyList.push(callback);
    if (this.loaded) callback.call(this);
  };

  /**
   * 提供视频的加载接口
   * 合并Source对象的属性传递
   * @param  {[type]} srcs [description]
   * @return {[type]}      [description]
   */
  FlareVideo.fn._load = function () {

    if (typeof this.sources == "string")
      this.sources = {
        src: this.sources
      };

    if (!$.isArray(this.sources))
      this.sources = [this.sources];

    this.ready(function () {
      this.change("loading");
      this.video.loadSources(this.sources);
    });
  };


  FlareVideo.fn.seek = function (offset) {
    this.video.setCurrentTime(offset);
  }

  FlareVideo.fn.setVolume = function (num) {
    this.video.setVolume(num);
  };

  FlareVideo.fn.getVolume = function () {
    return this.video.getVolume();
  };

  FlareVideo.fn.mute = function (state) {
    if (typeof state == "undefined") state = true;
    this.setVolume(state ? 1 : 0);
  };


  FlareVideo.fn.bind = function () {
    this.videoElement.bind.apply(this.videoElement, arguments);
  };

  FlareVideo.fn.one = function () {
    this.videoElement.one.apply(this.videoElement, arguments);
  };

  FlareVideo.fn.trigger = function () {
    this.videoElement.trigger.apply(this.videoElement, arguments);
  };

  // Proxy jQuery events
  var events = ["click", "dblclick",
    "onerror", "onloadeddata", "oncanplay",
    "ondurationchange", "ontimeupdate",
    "onpause", "onplay", "onended", "onvolumechange"
  ];
  for (var i = 0; i < events.length; i++) {
    (function () {
      var functName = events[i];
      var eventName = functName.replace(/^(on)/, "");
      FlareVideo.fn[functName] = function () {
        var args = $.makeArray(arguments);
        args.unshift(eventName);
        this.bind.apply(this, args);
      };
    })();
  }

  //////////////
  /// 私有方法
  ///////////////


  /**
   * 视频父节点
   * @return {[type]} [description]
   */
  FlareVideo.fn.setupElement = function () {
    this.element = $("<div />");
    this.element.addClass("flareVideo");
    this.element.css('visibility', 'hidden')
    this.parent.append(this.element);
  };

  /**
   * 视频节点
   * @return {[type]} [description]
   */
  FlareVideo.fn.setupNative = function () {
    this.videoElement = $("<video />");
    this.videoElement.addClass("video");
    this.videoElement.attr({
      width: this.options.width,
      height: this.options.height,
      poster: this.options.poster,
      autoplay: this.options.autoplay,
      preload: this.options.preload,
      controls: false, //默认关闭自己的控制条
      autobuffer: this.options.autobuffer
    });

    this.element.append(this.videoElement);
    this.video = this.videoElement[0];

    var self = this;


    ////////////////
    /// 扩展视频方法
    ////////////////
    this.video.loadSources = function (srcs) {
      self.videoElement.empty();
      for (var i in srcs) {
        var srcEl = $("<source />");
        srcEl.attr(srcs[i]);
        self.videoElement.append(srcEl);
      }
      self.video.load();
    };

    this.video.getStartTime = function () {
      return (this.startTime || 0);
    };

    this.video.getEndTime = function () {
      if (this.duration == Infinity && this.buffered) {
        return (this.buffered.end(this.buffered.length - 1));
      } else {
        return ((this.startTime || 0) + this.duration);
      }
    };

    this.video.getCurrentTime = function () {
      try {
        return this.currentTime;
      } catch (e) {
        return 0;
      }
    };

    this.video.setCurrentTime = function (val) {
      this.currentTime = val;
    }
    this.video.getVolume = function () {
      return this.volume;
    };
    this.video.setVolume = function (val) {
      this.volume = val;
    };
    this.video.enterFullScreen = function () {
      // Because we don't know when full screen is exited
      self.inFullScreen = false;
      this.webkitEnterFullScreen();
    };
    this.video.exitFullScreen = function () {
      this.webkitExitFullScreen();
    };

    this.loaded = true;
  };

  /**
   * 绑定视频反馈事件
   * @return {[type]} [description]
   */
  FlareVideo.fn.setupEvents = function () {

    /*暂停*/
    this.onpause($.proxy(function () {
      this.element.removeClass("playing");
      this.change("paused");
    }, this));

    /*播放*/
    this.onplay($.proxy(function () {
      this.element.addClass("playing");
      this.change("playing");
    }, this));

    /*结束*/
    this.onended($.proxy(function () {
      this.element.removeClass("playing");
      this.fullScreen(false);
      this.stop()
      this.change("ended");
    }, this));

    /*错误*/
    this.onerror($.proxy(function (e) {
      this.change("error");
      console.error("Error - " + this.video.error);
    }, this));

    /*提示该视频已准备好开始播放*/
    this.oncanplay($.proxy(function () {
      this.hideIdleTimer()
      this.canPlay = true;
      this.controls.removeClass("disabled");
      this.element.css('visibility', 'visible')
    }, this));

  };

  /**
   * 创建控制条
   * @return {[type]} [description]
   */
  FlareVideo.fn.setupControls = function () {

    if (!this.options.controls) return;

    this.controls = $("<div />");
    this.controls.addClass("controls");
    this.controls.addClass("disabled");

    this.setupBeforeButtons();
    this.setupTiming()
    this.setupSeek();
    this.setupAfterButtons();

    /*开始隐藏*/
    // this.element.addClass("idle");

    this.element.append(this.controls);
  };

  /**
   * 创建控制条按钮
   * @return {[type]} [description]
   */
  FlareVideo.fn.setupBeforeButtons = function () {
    var play = $("<div />");
    play.addClass("play");

    var self = this

    /*点击播放停止按钮*/
    play.on(clickName, function (e) {
      if (!self.canPlay) return;
      self.play();
      return false
    });
    this.controls.append(play);

    var pause = $("<div />");
    pause.addClass("pause");

    pause.on(clickName, function () {
      if (!self.canPlay) return;
      self.pause();
      return false
    });
    this.controls.append(pause);
  };

  FlareVideo.fn.setupAfterButtons = function () {
    var self = this
    var fullScreen = $("<div />");
    fullScreen.addClass("fullScreen");
    //fullScreen.text("Full Screen");
    fullScreen.on(clickName, function () {
      self.toggleFullScreen()
      return false
    });
    if (!this.options.useFullScreen) {
      fullScreen.addClass("disabled");
    }
    this.controls.append(fullScreen);

    /*关闭按钮*/
    var close = $("<div />");
    close.addClass("close");
    close.on(clickName, function () {
      self.trigger("close")
      return false
    });

    this.controls.append(close);
  };



  /**
   * 创建拖动条
   * @return {[type]} [description]
   */
  FlareVideo.fn.setupSeek = function () {
    var seek = $("<div />");
    seek.addClass("seek");

    var seekRange = this.createRange();
    seekRange.addClass("seekRange");
    seekRange.setValue(0);

    /*被改变的最终值*/
    seekRange.change($.proxy(function () {
      this.seek(seekRange.getValue());
    }, this));

    /*当指定音频/视频的时长数据发生变化时，发生 durationchange 事件。*/
    this.ondurationchange($.proxy(function () {
      seekRange.setOptions({
        min: this.video.getStartTime(),
        max: this.video.getEndTime(),
        value: this.video.getCurrentTime()
      });
    }, this));

    /*视频运行，更新时间*/
    this.ontimeupdate($.proxy(function () {
      seekRange.setOptions({
        max: this.video.getEndTime(),
        value: this.video.getCurrentTime()
      });
    }, this));

    seek.append(seekRange);
    this.controls.append(seek);
  };

  /**
   * 创建拖动条的圆点
   * @return {[type]} [description]
   */
  FlareVideo.fn.createRange = function () {
    var result = $("<div />");
    if (!result.slider)
      throw "jQuery UI with the slider component is required."

    var banChange = false
    var preOptions

    result.slider({
      start: function (event, ui) {
        /*点击的时候确保滚动条位置正确*/
        if (preOptions) {
          result.slider("option", preOptions);
        }
        banChange = true
      },
      stop: function (event, ui) {
        banChange = false
      }
    });

    var currentValue = 0;
    result.getValue = function () {
      return currentValue;
    };

    result.setValue = function (value) {
      if (result.find(".ui-slider-handle:first").hasClass("ui-state-active")) return;
      currentValue = value;
      result.slider("option", "value", value);
    };

    result.setOptions = function (options) {
      if (!banChange) {
        preOptions = options
        result.slider("option", options);
      }
    };

    result.bind("slidestop", function (e, ui) {
      currentValue = ui.value;
      result.trigger("change")
    });
    return result;
  }

  /**
   * 创建显示进度时间
   * @return {[type]} [description]
   */
  FlareVideo.fn.setupTiming = function () {

    var scheduleTime = $("<div />");
    scheduleTime.addClass('scheduleTime')

    var timeChange = $("<div />");
    timeChange.addClass("timeChange");
    scheduleTime.append(timeChange);

    var timeUn = $("<div>/</div>");
    timeUn.addClass("timeUn");
    scheduleTime.append(timeUn);

    var timeMax = $("<div />");
    timeMax.addClass("timeMax");
    scheduleTime.append(timeMax);


    // // timeToGo.addClass("timeMin");
    var pad = function (num) {
      if (num < 10)
        return "0" + num;
      return num;
    }

    var secondsFormat = function (sec) {
      var result = [];
      var minutes = Math.floor(sec / 60);
      var hours = Math.floor(sec / 3600);
      var seconds = (sec == 0) ? 0 : (sec % 60)
      seconds = Math.round(seconds);
      if (hours > 0) {
        result.push(pad(hours));
      }
      result.push(pad(minutes));
      result.push(pad(seconds));
      return result.join(":");
    };


    this.ontimeupdate($.proxy(function () {
      timeMax.text(secondsFormat(this.video.getEndTime()))
      //timeToGo.text(secondsFormat(this.video.getCurrentTime()));
      timeChange.text(secondsFormat(this.video.getCurrentTime()))
    }, this));

    /*视频准备好后出发一次，更新总时间*/
    this.videoElement.one("canplay", $.proxy(function () {
      timeMax.text(secondsFormat(this.video.getEndTime() - this.video.getCurrentTime()))
      this.videoElement.trigger("timeupdate");
    }, this));

    //this.controls.append(timeToGo);
    this.controls.append(scheduleTime);
  };



  /**
   * 切换工具栏的状态
   * @param  {[type]} e      [description]
   * @param  {[type]} toggle [description]
   * @return {[type]}        [description]
   */
  FlareVideo.fn.idle = function (e, toggle) {
    if (toggle) {
      if (this.state == "playing")
        this.element.addClass("idle");
    } else {
      this.element.removeClass("idle");
    }
  }

  /**
   * 触发改变
   * @param  {[type]} state [description]
   * @return {[type]}       [description]
   */
  FlareVideo.fn.change = function (state) {
    this.state = state;
    this.element.attr("data-state", this.state);
    this.element.trigger("state.fv", this.state);
  }



  //////////////
  ///对外接口
  //////////////

  FlareVideo.fn.play = function () {
    this.video.play();
  };

  FlareVideo.fn.pause = function () {
    this.video.pause();
  };

  FlareVideo.fn.stop = function () {
    this.seek(0);
    this.pause();
  };

  FlareVideo.fn.remove = function () {
    this.triggerIdle = null
    this.clearTimeout()
    if (this.controls) {
      this.controls.remove()
      this.controls = null
    }
    this.element.remove();
    this.videoElement = null
    this.parent = null
    this.element = null
  };

  FlareVideo.fn.fullScreen = function (state) {
    if (typeof state == "undefined") {
      state = true
    };

    this.inFullScreen = state;

    switch (this.options.useNativeFullScreen) {
      case 'webkit':
        this.video[state ? "enterFullScreen" : "exitFullScreen"]();
        break;
      case 'mozGecko':
        this.video[state ? "mozRequestFullScreen" : "mozCancelFullScreen"]();
        break;
      default:
        (state ? $("body") : this.parent).prepend(this.element);
        var isPlaying = (this.state == "playing");
        this.element[state ? "addClass" : "removeClass"]("fullScreen");
        if (isPlaying) this.ready($.proxy(this.play, this));
    }
  };

  FlareVideo.fn.togglePlay = function () {
    if (this.state == "playing") {
      this.pause();
    } else {
      this.play();
    }
  };

  /*切换全屏与窗口化*/
  FlareVideo.fn.toggleFullScreen = function () {
    this.fullScreen(!this.inFullScreen);
  };


  $.fn.flareVideo = function (options, callback) {
    return (new FlareVideo(this, options));
  };

  window.FlareVideo = FlareVideo;

})(jQuery);
