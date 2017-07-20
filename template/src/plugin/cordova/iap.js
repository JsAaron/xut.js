/**
 *  iap.js
 *  iap PhoneGap plugin (IOS)
 *
 *  Created by YangQingming on 2013-07-01.
 **/

Xut.Plugin.iapPlugin = {
  restore: function(successfullCallback, failedCallback, appInfo) {
    if(GLOBALIFRAME) {
      return GLOBALCONTEXT.iapPlugin.restore(successfullCallback, failedCallback, appInfo);
    } else {
      return cordova.exec(successfullCallback, failedCallback, 'IAPPlguin', 'restoreGood', [appInfo]);
    }
  },

  buyGood: function(successfullCallback, failedCallback, appInfo) {
    if(GLOBALIFRAME) {
      return GLOBALCONTEXT.iapPlugin.buyGood(successfullCallback, failedCallback, appInfo);
    } else {
      return cordova.exec(successfullCallback, failedCallback, 'IAPPlguin', 'buyIAP', [appInfo]);
    }
  },

  selectInfo: function(successfullCallback, failedCallback, appInfo) {
    if(GLOBALIFRAME) {
      return GLOBALCONTEXT.iapPlugin.selectInfo(successfullCallback, failedCallback, appInfo);
    } else {
      return cordova.exec(successfullCallback, failedCallback, 'IAPPlguin', 'selectInfo', [appInfo]);
    }
  }
};