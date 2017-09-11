/**
 *     readAssetsFilePlugin.js
 *     readAssetsFilePlugin PhoneGap plugin (Android)
 *
 *     Created by Tanxiangjiang on 05/21/2013.
 */
Xut.Plugin.ReadAssetsFile = {

  readAssetsFileAction: function(path, successCallback, failureCallback) {
    if(GLOBALIFRAME) {
      //客户端插件调用
      if(CLIENTCONFIGT) {
        return GLOBALCONTEXT.Xut.Plugin.ReadAssetsFile.readAssetsFileAction(path, successCallback, failureCallback)
      }
      //读库
      return GLOBALCONTEXT.ReadAssetsFile.readAssetsFileAction(path, successCallback, failureCallback);
    } else {
      //正常模式
      return cordova.exec(
        successCallback,
        failureCallback,
        'ReadAssetsFile',
        'readAssetsFileAction', [path]);
    }
  }

};