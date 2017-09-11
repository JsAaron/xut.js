/**
 * 	aptestPlugin.js
 * 	aptestPlugin PhoneGap plugin (IOS)
 *
 * 	Created by YangQingming on 2013-07-01.
 * 	appInfo  1:hide ; 0:show
 */
Xut.Plugin.statusbarPlugin = {
  setStatus: function(successfullCallback, failedCallback, appInfo) {
    if(GLOBALIFRAME) {
      return GLOBALCONTEXT.XXT.plugins.statusbarPlugin.setStatus(successfullCallback, failedCallback, appInfo);
    } else {
      return cordova.exec(successfullCallback, failedCallback, 'statusbarSet', 'set', [appInfo]);
    }
  }
};