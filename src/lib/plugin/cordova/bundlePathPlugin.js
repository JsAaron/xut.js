Xut.Plugin.BundlePath = {
  getBudlePath: function(successCallback, failureCallback) {
    if(GLOBALIFRAME) {
      return GLOBALCONTEXT.BundlePath.getBudlePath(directory, successCallback, failureCallback);
    } else {
      return cordova.exec(
        successCallback,
        failureCallback,
        'BundlePath',
        'getBudlePath', []);
    }
  }
}