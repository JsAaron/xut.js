/**
 * 	WebParsePlugin.js
 * 	WebParse PhoneGap plugin (Android)
 *
 * 	Created by Tanxiangjiang on 07/16/2012.
 */
Xut.Plugin.CpuCoreNumber = {
  getCpuCoreNumber: function(successCallback, failureCallback) {
    if(GLOBALIFRAME) {
      return GLOBALCONTEXT.CpuCoreNumber.getCpuCoreNumber(successCallback, failureCallback);
    } else {
      return cordova.exec(
        successCallback,
        failureCallback,
        'CpuCoreNumber',
        'getCpuCoreNumber', []);
    }
  }

};