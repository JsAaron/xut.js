/**
 *  AppStoreLink.js
 *  AppStoreLink PhoneGap plugin (IOS)
 *
 *  Created by HuXi on 2014-05-29.
 **/

Xut.Plugin.appStoreLinkPlugin = {
  callProductView: function(successfullCallback, failedCallback, appId) {
    if(GLOBALIFRAME) {
      return GLOBALCONTEXT.appStoreLinkPlugin.callProductView(successfullCallback, failedCallback, appId);
    } else {
      return cordova.exec(successfullCallback, failedCallback, "AppStoreLink", "callProductView", [appId]);
    }
  }
};