/**
 *     AppToAppPlugin.js
 *     AppToApp PhoneGap plugin (Android)
 *
 *     Created by Tanxiangjiang on 06/11/2012.
 */
Xut.Plugin.OpenApp = {

  openAppAction: function(appName, successCallback, failureCallback) {
    if(GLOBALIFRAME) {
      return GLOBALCONTEXT.OpenApp.openAppAction(appName, successCallback, failureCallback);
    } else {
      return cordova.exec(
        successCallback,
        failureCallback,
        'OpenApp',
        'openAppAction', [appName]);
    }
  }

};