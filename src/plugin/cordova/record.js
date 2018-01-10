/**
 * 录音插件
 * @type {Object}
 */
Xut.Plugin.Recorder = {
  // 开始录音
  startRecord: function(id, successCallback, errorCallback) {
    if (GLOBALIFRAME) {
      return GLOBALCONTEXT.Recorder.startRecord(id, successCallback, errorCallback);
    } else {
      return cordova.exec(successCallback, errorCallback, "XXTRecord", "startRecord", [id])
    }
  },
  // 结束录音
  stopRecord: function(successCallback, errorCallback) {
    if (GLOBALIFRAME) {
      return GLOBALCONTEXT.Recorder.stopRecord();
    } else {
      return cordova.exec(successCallback, errorCallback, "XXTRecord", "stopRecord", [])
    }
  },
  // 开始播放
  startPlay: function(id, successCallback, errorCallback) {
    if (GLOBALIFRAME) {
      return GLOBALCONTEXT.Recorder.startPlay(id, successCallback, errorCallback);
    } else {
      return cordova.exec(successCallback, errorCallback, "XXTRecord", "startPlay", [id])
    }
  },
  // 结束播放
  stopPlay: function(id, successCallback, errorCallback) {
    if (GLOBALIFRAME) {
      return GLOBALCONTEXT.Recorder.stopPlay(id);
    } else {
      return cordova.exec(successCallback, errorCallback, "XXTRecord", "stopPlay", [id])
    }
  }
}
