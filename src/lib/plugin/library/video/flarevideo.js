/**
 * 修改代码
 * 1 503处，增加控制条开始隐藏
 */

;
(function ($) {

  var clickName = 'touchstart mousedown'
  var idleEvents = "touchstart mousemove keydown DOMMouseScroll mousewheel mousedown reset.idle";

  /**
   * 控制条显示检测时间
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  $.fn.idleTimer = function () {

    var element = $(this);

    var idle = false;
    var first = true

    /*检测的定时器*/
    var checkTimer = null

    var run = function (e) {

      /*点击播放第一次的触发跳过*/
      if (first) {
        first = false
        return
      }

      /*如果点击是控制条区域，那么控制条不关闭，重新计算时间*/
      if (e && e.target && e.target.className !== 'video') {
        if (checkTimer) {
          clearTimeout(checkTimer);
          checkTimer = null
        }
        checkTimer = setTimeout(run, 2000);
        return
      }

      if (idle) {
        idle = false;
        element.trigger("idle", true);
        /*通过手动触发，取消自动关闭*/
        if (checkTimer) {
          clearTimeout(checkTimer);
          checkTimer = null
        }
      } else {
        idle = true;
        element.trigger("idle", false);
        checkTimer = setTimeout(run, 2000);
      }
    };

    element.bind(idleEvents, run);
  };

  var testVideoElement = $("<video />")[0];
  var nativeSupport = (typeof testVideoElement.canPlayType != 'undefined');
  var nativeFullScreenSupport = (
    (typeof testVideoElement.webkitEnterFullScreen != 'undefined') ? 'webkit' :
    (typeof testVideoElement.mozRequestFullScreen != 'undefined') ? 'mozGecko' :
    false);


  // webkitEnterFullScreen fails under Chrome at the moment
  if (navigator.userAgent.match('Chrome')) nativeFullScreenSupport = false;

  var defaults = {
    autoplay: false,
    controls: false,
    preload: "auto",
    poster: null,
    srcs: [],
    keyShortcut: true,
    flashSrc: "media/FlareVideo.swf"
  };

  defaults.useNative = nativeSupport;
  defaults.useNativeFullScreen = nativeFullScreenSupport;

  var FlareVideo = function (parent, options) {

    this._class = FlareVideo;

    this.parent = parent;
    this.options = $.extend({}, defaults, options);
    this.sources = this.options.srcs || this.options.sources;
    this.useNative = this.options.useNative;
    // Only use full screen on HTML 5 atm
    this.options.useFullScreen = !!this.useNative;

    this.state = null;
    this.canPlay = false;
    this.inFullScreen = false;
    this.loaded = false;
    this.readyList = [];

    this.setupElement();
    this.setupNative();

    this.ready($.proxy(function () {
      this.setupEvents();
      this.setupControls();
      this.change("initial");
      this.load();

      this.element.idleTimer();
      this.element.bind("idle", $.proxy(this.idle, this));
      this.element.bind("state.fv", $.proxy(function () {
        this.element.trigger("reset.idle");
      }, this))
    }, this));
  };

  FlareVideo.fn = FlareVideo.prototype;

  // Public methods

  FlareVideo.fn.ready = function (callback) {
    this.readyList.push(callback);
    if (this.loaded) callback.call(this);
  };

  FlareVideo.fn.load = function (srcs) {
    if (srcs)
      this.sources = srcs;

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

  FlareVideo.fn.togglePlay = function () {
    if (this.state == "playing") {
      this.pause();
    } else {
      this.play();
    }
  };

  FlareVideo.fn.fullScreen = function (state) {
    if (typeof state == "undefined") state = true;
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

  FlareVideo.fn.toggleFullScreen = function () {
    this.fullScreen(!this.inFullScreen);
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

  FlareVideo.fn.remove = function () {
    this.element.remove();
    this.controls = null
    this.videoElement = null
    this.parent = null
    this.element = null
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

  // Private methods

  FlareVideo.fn.triggerReady = function () {
    for (var i in this.readyList) {
      this.readyList[i].call(this);
    }
    this.loaded = true;
  };

  FlareVideo.fn.setupElement = function () {
    this.element = $("<div />");
    this.element.addClass("flareVideo");
    this.element.css('visibility', 'hidden')
    this.parent.append(this.element);
  };

  FlareVideo.fn.idle = function (e, toggle) {
    if (toggle) {
      if (this.state == "playing")
        this.element.addClass("idle");
    } else {
      this.element.removeClass("idle");
    }
  };

  FlareVideo.fn.change = function (state) {
    this.state = state;
    this.element.attr("data-state", this.state);
    this.element.trigger("state.fv", this.state);
  }

  FlareVideo.fn.setupNative = function () {
    this.videoElement = $("<video />");
    this.videoElement.addClass("video");
    this.videoElement.attr({
      width: this.options.width,
      height: this.options.height,
      poster: this.options.poster,
      autoplay: this.options.autoplay,
      preload: this.options.preload,
      controls: this.options.controls,
      autobuffer: this.options.autobuffer
    });

    this.element.append(this.videoElement);
    this.video = this.videoElement[0];

    var self = this;

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

    var self = this;

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

    this.triggerReady();
  };


  FlareVideo.eiTrigger = function (id, name) {
    try {
      this.flashInstance[id].trigger(name);
    } catch (e) {
      console.error(e);
    }
  };

  FlareVideo.eiTriggerReady = function (id) {
    try {
      this.flashInstance[id].triggerReady();
    } catch (e) {
      console.error(e);
    }
  };

  FlareVideo.fn.setupButtons = function () {
    var play = $("<div />");
    play.addClass("play");
    play.text("Play");

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
    pause.text("Pause");
    pause.on(clickName, function () {
      if (!self.canPlay) return;
      self.pause();
      return false
    });
    this.controls.append(pause);

    var fullScreen = $("<div />");
    fullScreen.addClass("fullScreen");
    fullScreen.text("Full Screen");
    fullScreen.on(clickName, function () {
      self.toggleFullScreen()
      return false
    });
    if (!this.options.useFullScreen) {
      fullScreen.addClass("disabled");
    }
    this.controls.append(fullScreen);
  };

  FlareVideo.fn.createRange = function () {
    var result = $("<div />");
    if (!result.slider)
      throw "jQuery UI with the slider component is required."

    result.slider();

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
      result.slider("option", options);
    };

    result.bind("slidestop", function (e, ui) {
      currentValue = ui.value;
      result.trigger("change")
    });
    return result;
  }

  FlareVideo.fn.setupSeek = function () {
    var seek = $("<div />");
    seek.addClass("seek");

    var seekRange = this.createRange();
    seekRange.addClass("seekRange");
    seekRange.setValue(0);

    seekRange.change($.proxy(function () {
      this.seek(seekRange.getValue());
    }, this));

    this.ondurationchange($.proxy(function () {
      seekRange.setOptions({
        min: this.video.getStartTime(),
        max: this.video.getEndTime(),
        value: this.video.getCurrentTime()
      });
    }, this));

    this.ontimeupdate($.proxy(function () {
      seekRange.setOptions({
        max: this.video.getEndTime(),
        value: this.video.getCurrentTime()
      });
    }, this));

    seek.append(seekRange);
    this.controls.append(seek);
  };

  FlareVideo.fn.setupTiming = function () {
    var timeToGo = $("<div />");
    var timeLeft = $("<div />");

    timeToGo.addClass("timeMin");
    timeLeft.addClass("timeMax");

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

      if (hours > 0)
        result.push(pad(hours));

      result.push(pad(minutes));
      result.push(pad(seconds));

      return result.join(":");
    };

    this.ontimeupdate($.proxy(function () {
      timeToGo.text(secondsFormat(this.video.getCurrentTime()));
      timeLeft.text("-" + secondsFormat(this.video.getEndTime() - this.video.getCurrentTime()))
    }, this));

    this.videoElement.one("canplay", $.proxy(function () {
      this.videoElement.trigger("timeupdate");
    }, this));

    this.controls.append(timeToGo);
    this.controls.append(timeLeft);
  };

  FlareVideo.fn.setupControls = function () {
    // Use native controls
    if (this.options.controls) return;

    this.controls = $("<div />");
    this.controls.addClass("controls");
    this.controls.addClass("disabled");

    this.setupButtons();
    this.setupSeek();
    this.setupTiming()

    /*开始隐藏*/
    this.element.addClass("idle");

    this.element.append(this.controls);
  };

  FlareVideo.fn.fallbackToFlash = function () {
    this.useNative = false;
    this.element.unload();
    this.remove()
    this.setupElement();
  };

  FlareVideo.fn.setupEvents = function () {
    this.onpause($.proxy(function () {
      this.element.removeClass("playing");
      this.change("paused");
    }, this));

    this.onplay($.proxy(function () {
      this.element.addClass("playing");
      this.change("playing");
    }, this));

    this.onended($.proxy(function () {
      this.element.removeClass("playing");
      this.fullScreen(false);
      this.stop()
      this.change("ended");
    }, this));

    this.onerror($.proxy(function (e) {
      if (this.useNative) {
        if (this.video.error && this.video.error.code == 4) {
          var flashType = this.flashSources()[0];
          if (flashType) {
            this.fallbackToFlash();
          } else {
            this.change("error");
            console.error("Format not supported");
          }
        } else {
          this.change("error");
          console.error("Error - " + this.video.error);
        }
      } else {
        this.change("error");
        console.error("Flash error");
      }
    }, this));

    this.oncanplay($.proxy(function () {
      this.canPlay = true;
      this.controls.removeClass("disabled");
      this.element.css('visibility', 'visible')
    }, this));

    // if (this.options.keyShortcut);
    // $(document).keydown($.proxy(function(e) {
    //     if (e.keyCode == 32) { // Space
    //         this.togglePlay();
    //         return false;
    //     }

    //     if (e.keyCode == 27 && this.inFullScreen) { // Escape
    //         this.fullScreen(false);
    //         this.element.trigger("reset.idle");
    //         return false;
    //     }

    // }, this));
  };

  $.fn.flareVideo = function (options, callback) {
    return (new FlareVideo(this, options));
  };

  window.FlareVideo = FlareVideo;

})(jQuery);
