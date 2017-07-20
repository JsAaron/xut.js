/**
 * Constructor
 */
Xut.Plugin.XXTEbookInit = {

  /**
   * Play the passed in text as synthasized speech
   *
   * @param {DOMString} text
   * @param {Object} successCallback
   * @param {Object} errorCallback
   */
  update: function(text, successCallback, errorCallback) {
    return cordova.exec(successCallback, errorCallback, "XxtebookInit", "update", [text]);
  },

  /**
   * Starts up the XXTEbookInit Service
   * @param {string} databaseName
   * @param {Object} successCallback
   * @param {Object} errorCallback
   */
  startup: function(databaseName, successCallback, errorCallback) {
    if(GLOBALIFRAME) {
      return successCallback();
    } else {
      return cordova.exec(successCallback, errorCallback, "XxtebookInit", "startup", [databaseName]);
    }
  },

  /**
   * Finds out if the language is currently supported by the XXTEbookInit service.
   *
   * @param {DOMSting} lang
   * @param {Object} successCallback
   * @param {Object} errorCallback
   */
  getInfo: function(text, successCallback, errorCallback) {
    return cordova.exec(successCallback, errorCallback, "XxtebookInit", "getInfo", [text]);
  },

  /**
   * Finds out the current language of the XXTEbookInit service.
   *
   * @param {Object} successCallback
   * @param {Object} errorCallback
   */
  getChapter: function(chapterId, successCallback, errorCallback) {
    return cordova.exec(successCallback, errorCallback, "XxtebookInit", "getChapter", [chapterId]);
  },



  getPercent: function(successCallback, errorCallback) {
    return cordova.exec(successCallback, errorCallback, "XxtebookInit", "getPercent", []);
  }

};