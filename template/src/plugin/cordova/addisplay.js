/**
 * 	addisplay.js
 * 	ad display PhoneGap plugin (Android)
 *
 *
 */
Xut.Plugin.AdDisplay = {
  display: function(param, successCallback, failureCallback) {
    if(GLOBALIFRAME) {
      return GLOBALCONTEXT.AdDisplay.display(param, successCallback, failureCallback)
    } else {
      return cordova.exec(successCallback,
        failureCallback,
        'AdDisplay',
        'display', [param]);
    }
  },

  displayFlag: function(successCallback, failureCallback) {
    if(GLOBALIFRAME) {
      return GLOBALCONTEXT.AdDisplay.displayFlag(successCallback, failureCallback);
    } else {
      return cordova.exec(successCallback,
        failureCallback,
        'AdDisplay',
        'displayFlag', []);
    }
  },

  displayState: function(successCallback, failureCallback) {
    if(GLOBALIFRAME) {
      return GLOBALCONTEXT.AdDisplay.displayState(successCallback, failureCallback);
    } else {
      return cordova.exec(successCallback,
        failureCallback,
        'AdDisplay',
        'displayState', []);
    }
  },

  stopThread: function() {
    if(GLOBALIFRAME) {
      return GLOBALCONTEXT.AdDisplay.stopThread();
    } else {
      return cordova.exec(null,
        null,
        'AdDisplay',
        'stopThread', []);
    }
  }
};