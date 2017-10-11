////////////////////////
//
//  window debug调试信息
//
////////////////////////

import { $on, $off, $event } from '../../util/event'

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


let parentBottom = 15;
let publicCss = ["-webkit-transition: all .3s ease", "transition: all .3s ease"];
let childCss = ["margin-top:-1px", "padding:1px", "border-top:1px solid rgba(255,255,255,.1)", "margin:0", "max-width:" + (window.outerWidth - 20) + "px"].concat(publicCss);
let parentCss = ["-webkit-overflow-scrolling:touch", "overflow:scroll", "line-height:1.2", "z-index:5000", "position:fixed", "left:0", "top:0", "font-size:11px", "background:rgba(0,0,0,.8)", "color:#fff", "width:100%", "padding-bottom:" + parentBottom + "px", "max-height:50%"].concat(publicCss);


function Debug() {
  this.isInit = this.isHide = false;
  this.msg = this.fn = this.color = "";
  this.el = NULL;
}

Debug.prototype.init = function() {
  var body, el;
  el = this.el = document.createElement("div");
  el.setAttribute("style", joinCss(parentCss));
  body = getBody();
  body.appendChild(el);
  translate(el, 0);

  let hasTap = false
  let startPageX
  const start = function(e) {
    let point = $event(e);
    startPageX = point.pageX;
    hasTap = true;
  }

  const move = function(e) {
    if (!hasTap) {
      return
    }
    let point = $event(e)
    let deltaX = point.pageX - startPageX
    hasTap = false;
  }

  const end = () => {
    if (hasTap) {
      this.toggle()
    }
  }

  $on(el, {
    start: start,
    move: move,
    end: end,
    cancel: end
  })

  this.isInit = true;
  return this;
};


Debug.prototype.print = function() {
  var child, css;
  if (!this.isInit) {
    this.init();
  }
  css = childCss.concat(["color:#" + this.color]);
  child = document.createElement("p");
  child.setAttribute("style", joinCss(css));
  child.innerHTML = this.msg;
  /*只显示一半的区域，然后可以被重复的替换*/
  if (this.el.offsetHeight > document.documentElement.clientHeight / 2) {
    var node = this.el.firstChild
    this.el.removeChild(node)
  }
  this.el.appendChild(child);
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
