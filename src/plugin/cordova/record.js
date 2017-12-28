/**
 * 录音插件
 * @type {Object}
 */
Xut.Plugin.Recorder = {
  // 开始录音
  startRecord: function(id, time, successCallback, errorCallback) {
    return XXT.plugin_exec(successCallback, errorCallback, "XXTRecord", "startRecord", [id, time]);
  },
  // 结束录音
  stopRecord: function(successCallback, errorCallback) {
    return XXT.plugin_exec(successCallback, errorCallback, "XXTRecord", "stopRecord", []);
  },
  // 开始播放
  startPlay: function(id, successCallback, errorCallback) {
    return XXT.plugin_exec(successCallback, errorCallback, "XXTRecord", "startPlay", [id]);
  },
  // 结束播放
  stopPlay: function(id, successCallback, errorCallback) {
    return XXT.plugin_exec(successCallback, errorCallback, "XXTRecord", "stopPlay", [id]);
  }
}
