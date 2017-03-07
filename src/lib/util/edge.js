/**
 * 利用canvas绘制出蒙板效果替换，需要蒙板效果的图片先用一个canvas占位，绘制是异步的
 */

function _getCanvas(className) {
  var children = document.getElementsByTagName('canvas'),
    elements = new Array(),
    i = 0,
    child,
    classNames,
    j = 0;
  for(i = 0; i < children.length; i++) {
    child = children[i];
    classNames = child.className.split(' ');
    for(var j = 0; j < classNames.length; j++) {
      if(classNames[j] == className) {
        elements.push(child);
        break;
      }
    }
  }
  return elements;
}


function _addEdge(canvas) {

  var img = new Image(),
    maskimg = new Image();

  var classNames = canvas.className.split(' ');
  var context = canvas.getContext("2d");
  img.addEventListener("load", loadimg);
  maskimg.addEventListener("load", loadmask);

  function loadimg() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = "source-over";
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    maskimg.src = canvas.getAttribute("mask");
    img.removeEventListener("load", loadimg);
    img.src = null;
    img = null;
  }

  function loadmask() {
    context.globalCompositeOperation = "destination-atop";
    context.drawImage(maskimg, 0, 0, canvas.width, canvas.height);
    canvas.style.opacity = 1;
    maskimg.removeEventListener("load", loadmask);
    maskimg.src = null;
    maskimg = null;
    context = null;
    classNames = null;
    canvas.className = canvas.className.replace("edges", "");
  }
  img.src = canvas.getAttribute("src");
}

export function addEdges() {
  var thecanvas = _getCanvas('edges'),
    i;
  for(i = 0; i < thecanvas.length; i++) {
    _addEdge(thecanvas[i]);
  }
}