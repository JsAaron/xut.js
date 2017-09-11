/*
 * PhoneGap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) 2005-2010, Nitobi Software Inc.
 * Copyright (c) 2011, IBM Corporation
 */

Xut.Plugin.WebView = {
  open: function(url, left, top, height, width, mode) {
    if(GLOBALIFRAME) {
      return GLOBALCONTEXT.WebView.open(url, left, top, height, width, mode);
    } else {
      return cordova.exec(null, null, "WebView", "open", [url, left, top, height, width, mode]);
    }
  },
  close: function() {
    if(GLOBALIFRAME) {
      return GLOBALCONTEXT.WebView.close();
    } else {
      return cordova.exec(null, null, "WebView", "close", []);
    }
  },
  flag: function(successCallback) {
    if(GLOBALIFRAME) {
      return GLOBALCONTEXT.WebView.flag(successCallback);
    } else {
      return cordova.exec(successCallback, null, "WebView", "flag", []);
    }
  }
};