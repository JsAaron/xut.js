/**
 *  tabletPlugin.js
 *  tablet PhoneGap plugin (Android)
 *
 *  Created by Tanxiangjiang on 06/16/2012
 */
Xut.Plugin.Tablet = {

  paintPath: function(successCallback, failureCallback) {
    if(GLOBALIFRAME) {
      return GLOBALCONTEXT.Tablet.paintPath(successCallback, failureCallback);
    } else {
      return cordova.exec(
        successCallback,
        failureCallback,
        'Tablet',
        'paintPath', []);
    }
  },

  openAction: function(path, filename, BitmapWidth, BitmapHeight, left, top, height, weight, successCallback, failureCallback) {
    if(GLOBALIFRAME) {
      return GLOBALCONTEXT.Tablet.openAction(path, filename, BitmapWidth, BitmapHeight, left, top, height, weight, successCallback, failureCallback);
    } else {
      return cordova.exec(successCallback,
        failureCallback,
        'Tablet',
        'openAction', [path, filename, BitmapWidth, BitmapHeight, left, top, height, weight]);
    }
  },

  closeAction: function(successCallback, failureCallback) {
    if(GLOBALIFRAME) {
      return GLOBALCONTEXT.Tablet.closeAction(successCallback, failureCallback);
    } else {
      return cordova.exec(successCallback,
        failureCallback,
        'Tablet',
        'closeAction', []);
    }
  }

};