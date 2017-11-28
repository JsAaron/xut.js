////////////////////////
//
//  window debug调试信息
//
////////////////////////

import { $on, $off, $event } from '../../util/event'
import { resetCount } from './index'

let NULL = null;

let dom = document.querySelectorAll;
let toString = {}.toString;

function isNull(val) {
  return val === NULL;
};

const isArray = Array.isArray || function(val) {
  return val && "[object Array]" === toString.call(val);
};

function isObejct(val) {
  return typeof val === "object" && !isArray(val) && !isNull(val);
};

function getBody() {
  var ref, ref1;
  return document["body"] || ((ref = dom("body")) != null ? ref[0] : void 0) || ((ref1 = dom("html")) != null ? ref1[0] : void 0);
};


const debugMap = {
  log: "0074cc",
  danger: "da4f49",
  warn: "faa732",
  success: "5bb75b",
  error: "bd362f"
};


function render(msg) {
  var arr, i, item, len, text;
  text = "";
  arr = [];
  if (isArray(msg)) {
    for (i = 0, len = msg.length; i < len; i++) {
      item = msg[i];
      if (typeof item === "object") {
        arr.push(render(item));
        text = "[" + arr.join(',') + "]";
      } else {
        arr.push("" + item);
        text = "[" + arr.join(',') + "]";
      }
    }
  } else if (isObejct(msg)) {
    for (item in msg) {
      if (typeof msg[item] === "object") {
        arr.push((item + ": ") + render(msg[item]));
        text = "{" + arr.join(',') + "}";
      } else {
        arr.push(item + ": " + msg[item]);
        text = "{" + arr.join(',') + "}";
      }
    }
  } else {
    text = String(msg);
  }
  return text;
};


function translate(el, y) {
  el.style.webkitTransform = "translate3d(0," + y + ",0)";
  return el.style.transform = "translate3d(0," + y + ",0)";
};


function joinCss(css) {
  return css.join(";");
};


let parentBottom = 50;
let publicCss = ["-webkit-transition: all .3s ease", "transition: all .3s ease"];
let childCss = ["margin-top:-1px", "padding:1px", "border-top:1px solid rgba(255,255,255,.1)", "margin:0", "max-width:" + (window.outerWidth - 20) + "px"].concat(publicCss);
let parentCss = ["-webkit-overflow-scrolling:touch", "overflow-y:scroll", "line-height:1.2", "z-index:5000", "position:fixed", "left:0", "top:0", "font-size:11px", "background:rgba(0,0,0,.8)", "color:#fff", "width:100%", "padding-bottom:" + parentBottom + "px", "max-height:55%"].concat(publicCss);
let clearCSS = "text-align:right;font-size:16px;color:white;margin-top:30px;margin-right:10px;position:absolute;right:0;"
let clearCountCSS = "text-align:right;font-size:16px;;color:white;margin-right:10px;margin-top:30px;position:absolute;right:50px;"

let showNodeCSS = "text-align:right;font-size:16px;;color:white;margin-right:70px;margin-top:30px;position:absolute;right:50px;"
let hideNodeCSS = "text-align:right;font-size:16px;;color:white;margin-right:120px;position:absolute;right:50px;margin-top:30px;"



let containerCSS = "width:100%;height:90%;padding:10px"

function Debug() {
  this.isInit = this.isHide = false;
  this.msg = this.fn = this.color = "";
  this.el = NULL;
}

Debug.prototype.init = function() {
  var body, el;
  var self = this

  el = this.el = document.createElement("div");

  var clearNode = document.createElement("a");
  var clearCount = document.createElement("a");
  var showNode = document.createElement("a");
  var hideNode = document.createElement("a");

  this.container = document.createElement("div");
  this.container.setAttribute("style", containerCSS)

  showNode.textContent = '显示'
  hideNode.textContent = '隐藏'
  clearNode.textContent = '清屏'
  clearCount.textContent = '清计数'

  clearNode.setAttribute("style", clearCSS);
  clearCount.setAttribute("style", clearCountCSS);
  showNode.setAttribute("style", showNodeCSS);
  hideNode.setAttribute("style", hideNodeCSS);

  el.setAttribute("style", joinCss(parentCss));
  el.appendChild(this.container)
  el.appendChild(clearNode)
  el.appendChild(clearCount)
  el.appendChild(showNode)
  el.appendChild(hideNode)

  body = getBody();
  body.appendChild(el);

  translate(el, 0);

  function setColor(node) {
    node.style.backgroundColor = 'red'
    setTimeout(function() {
      node.style.backgroundColor = ''
    }, 50)
  }

  $on(clearCount, {
    end: function(e) {
      setColor(clearCount)
      e.stopPropagation()
      resetCount()
    }
  })

  $on(clearNode, {
    end: function(e) {
      setColor(clearNode)
      e.stopPropagation()
      self.container.innerHTML = ''
    }
  })


  $on(showNode, {
    end: function(e) {
      setColor(showNode)
      e.stopPropagation()
      self.show()
    }
  })

  $on(hideNode, {
    end: function(e) {
      setColor(hideNode)
      e.stopPropagation()
      self.hide()
    }
  })

  this.isInit = true;
  return this;
};


Debug.prototype.print = function() {
  var child, css;
  if (!this.isInit) {
    this.init();
  }

  if(this.isHide){
    this.show()
  }

  css = childCss.concat(["color:#" + this.color]);
  child = document.createElement("p");
  child.setAttribute("style", joinCss(css));
  child.innerHTML = this.msg;
  /*只显示一半的区域，然后可以被重复的替换*/
  if (this.container.offsetHeight > document.documentElement.clientHeight / 2) {
    var node = this.container.firstChild
    if (node.nodeName === 'P') {
      this.container.removeChild(node)
    }
  }
  this.container.appendChild(child);
  return this;
};

Debug.prototype.toggle = function(event) {
  return (this.isHide ? this.show : this.hide).call(this, event);
};

Debug.prototype.show = function(event) {
  translate(this.el, 0);
  this.isHide = false;
  return this;
};

Debug.prototype.hide = function(event) {
  translate(this.el, "-" + (this.el.offsetHeight - parentBottom) + "px");
  this.isHide = true;
  return this;
};

for (let fn in debugMap) {
  Debug.prototype[fn] = function(msg) {
    this.fn = fn;
    this.msg = render(msg);
    this.color = debugMap[fn];
    return this.print();
  }
}

export default Debug
