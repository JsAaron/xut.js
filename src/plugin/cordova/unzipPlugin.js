/**
 * 	unzipPlugin.js
 * 	Unzip PhoneGap plugin (Android)
 *
 * 	Created by Tanxiangjiang on 18/6/2013.
 */

Xut.Plugin.UnzipPlugin = {
  storageAction: function(json, successCallback, failureCallback) {
    return cordova.exec(successCallback, failureCallback, 'UnzipPlugin', 'storageAction', [json]);
  }
}