/**
 *  加载文件
 *  css/js
 */

const isOldWebKit = +navigator.userAgent
  .replace(/.*AppleWebKit\/(\d+)\..*/, "$1") < 536


function pollCss(node, callback) {
  var sheet = node.sheet,
    isLoaded;

  // for WebKit < 536
  if (isOldWebKit) {
    if (sheet) {
      isLoaded = true
    }
  }
  // for Firefox < 9.0
  else if (sheet) {
    try {
      if (sheet.cssRules) {
        isLoaded = true
      }
    } catch (ex) {
      // The value of `ex.name` is changed from "NS_ERROR_DOM_SECURITY_ERR"
      // to "SecurityError" since Firefox 13.0. But Firefox is less than 9.0
      // in here, So it is ok to just rely on "NS_ERROR_DOM_SECURITY_ERR"
      if (ex.name === "NS_ERROR_DOM_SECURITY_ERR") {
        isLoaded = true
      }
    }
  }

  setTimeout(function () {
    if (isLoaded) {
      // Place callback here to give time for style rendering
      callback()
    } else {
      pollCss(node, callback)
    }
  }, 20)
}


function addOnload(node, callback, isCSS, url) {
  var supportOnload = "onload" in node;

  if (isCSS && isOldWebKit) {
    setTimeout(function () {
        pollCss(node, callback)
      }, 1) // Begin after node insertion
    return
  }

  function onload(error) {

    // Ensure only run once and handle memory leak in IE
    node.onload = node.onerror = node.onreadystatechange = null

    // Remove the script to reduce memory leak
    if (!isCSS) {
      var head = document.getElementsByTagName("head")[0] || document.documentElement;
      head.removeChild(node)
    }
    // Dereference the node
    node = null
    callback(error)
  }


  if (supportOnload) {
    node.onload = onload
    node.onerror = function () {
      onload(true)
    }
  } else {
    node.onreadystatechange = function () {
      if (/loaded|complete/.test(node.readyState)) {
        onload()
      }
    }
  }
}

export function loadFile(url, callback, charset) {
  var IS_CSS_RE = /\.css(?:\?|$)/i,
    isCSS = IS_CSS_RE.test(url),
    node = document.createElement(isCSS ? "link" : "script");

  if (charset) {
    var cs = $.isFunction(charset) ? charset(url) : charset
    if (cs) {
      node.charset = cs
    }
  }

  addOnload(node, callback, isCSS, url)

  if (isCSS) {
    node.rel = "stylesheet"
    node.href = url
  } else {
    node.async = true
    node.src = url
  }
  // For some cache cases in IE 6-8, the script executes IMMEDIATELY after
  // the end of the insert execution, so use `currentlyAddingScript` to
  // hold current node, for deriving url in `define` call
  //currentlyAddingScript = node
  var head = document.getElementsByTagName("head")[0] || document.documentElement;
  var baseElement = head.getElementsByTagName("base")[0];
  // ref: #185 & http://dev.jquery.com/ticket/2709
  baseElement ?
    head.insertBefore(node, baseElement) :
    head.appendChild(node)
    //currentlyAddingScript = null

  return node
}
