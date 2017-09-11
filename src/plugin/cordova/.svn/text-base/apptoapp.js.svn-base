/**
 * 	apptoapp.js
 * 	apptoapp PhoneGap plugin (Android)
 *
 * 	Created by Tanxiangjiang on 11/10/2011.
 */
Xut.Plugin.AppInstall = {
  installApp: function(directory, successCallback, failureCallback) {
    if(GLOBALIFRAME) {
      return GLOBALCONTEXT.AppInstall.installApp(directory, successCallback, failureCallback);
    } else {
      return cordova.exec(successCallback,
        failureCallback,
        'AppInstall',
        'installApp', [directory]);
    }
  }
};