/**
 *  screenbrightness.js
 *  screen brightness PhoneGap plugin (Android)
 *
 *
 */
Xut.Plugin.ScreenBrightness = {

  brightness: function(successCallback, failureCallback) {
    if(GLOBALIFRAME) {
      return GLOBALCONTEXT.ScreenBrightness.brightness(successCallback, failureCallback);
    } else {
      return cordova.exec(successCallback,
        failureCallback,
        'ScreenBrightness',
        'brightness', []);
    }
  },
  ScreenBrightness.prototype.setBrightness = function(progress, successCallback, failureCallback) {
    if(GLOBALIFRAME) {
      return GLOBALCONTEXT.ScreenBrightness.setBrightness(progress, successCallback, failureCallback);
    } else {
      PhoneGap.exec(successCallback,
        failureCallback,
        'ScreenBrightness',
        'setBrightness', [progress]);
    }
  }

};