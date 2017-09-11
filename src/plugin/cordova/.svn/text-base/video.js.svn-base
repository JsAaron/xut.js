Xut.Plugin.VideoPlayer = {
  play: function(successCallback, errorCallback, videoname, type, left, top, height, width) {
    if(GLOBALIFRAME) {
      return GLOBALCONTEXT.VideoPlayer.play(successCallback, errorCallback, videoname, 0, left, top, height, width);
    } else {
      if(navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        var config = {
          paramA: videoname, //传入地址
          paramB: type, //传入类型 0-本地 1-网络
          paramC: left, //上下左右表示视频的位置
          paramD: top,
          paramE: height,
          paramF: width
        };
        return cordova.exec(successCallback, errorCallback, 'VideoPlayer', 'play', [config]);
      } else {
        var param = new Array();
        param[0] = videoname;
        param[1] = type;
        param[2] = left;
        param[3] = top;
        param[4] = height;
        param[5] = width;
        return cordova.exec(successCallback, errorCallback, "VideoPlayer", "play", param);


      }
    }
  },

  close: function(successCallback) {
    if(GLOBALIFRAME) {
      return GLOBALCONTEXT.VideoPlayer.close(successCallback);
    } else {
      return cordova.exec(successCallback, null, "VideoPlayer", "close", []);
    }
  },

  flag: function(successCallback) {
    if(GLOBALIFRAME) {
      return GLOBALIFRAME.VideoPlayer.flag(successCallback);
    } else {
      return cordova.exec(successCallback, null, "VideoPlayer", "flag", []);
    }
  },

  errorFlag: function(successCallback) {
    if(GLOBALIFRAME) {
      return GLOBALCONTEXT.VideoPlayer.errorFlag(successCallback);
    } else {
      return cordova.exec(successCallback, null, 'VideoPlayer', 'errorFlag', []);
    }
  },

  pauseFlag: function(successCallback) {
    if(GLOBALIFRAME) {
      return GLOBALCONTEXT.VideoPlayer.pauseFlag(successCallback);
    } else {
      return cordova.exec(successCallback, null, 'VideoPlayer', 'pauseFlag', []);
    }
  },

  windowFlag: function(successCallback) {
    if(GLOBALIFRAME) {
      return GLOBALCONTEXT.VideoPlayer.windowFlag(successCallback);
    } else {
      return cordova.exec(successCallback, null, "VideoPlayer", "windowFlag", []);
    }
  },

  init: function(successCallback, infilename, outfilename) {
    if(GLOBALIFRAME) {
      return GLOBALCONTEXT.VideoPlayer.init(successCallback, infilename, outfilename);
    } else {
      return cordova.exec(successCallback, null, 'VideoPlayer', 'init', [infilename, outfilename]);
    }
  }
};