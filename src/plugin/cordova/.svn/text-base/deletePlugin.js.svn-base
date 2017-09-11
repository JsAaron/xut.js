/**
 * 	deletePlugin.js
 * 	delete PhoneGap plugin (Android)
 *
 * 	Created by Tanxiangjiang on 4/8/2013.
 *  Last-Modified  11:03 4/8/2013
 */
Xut.Plugin.DeletePlugin = {
  deleteAction: function(successCallback, failureCallback, id) {
    if(GLOBALIFRAME) {
      return GLOBALCONTEXT.DeletePlugin.deleteAction(directory, successCallback, failureCallback);
    } else {
      return cordova.exec(successCallback, failureCallback, 'DeletePlugin', 'deleteAction', [id]);
    }
  }
}