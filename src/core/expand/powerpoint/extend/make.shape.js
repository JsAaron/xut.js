var makeShape = function(type, params) {
  var shape = null;
  var svgns = "http://www.w3.org/2000/svg";
  switch(type) {
    case "Circle": //圆
      shape = document.createElementNS(svgns, "circle");
      shape.setAttributeNS(null, "cx", 25);
      shape.setAttributeNS(null, "cy", 25);
      shape.setAttributeNS(null, "r", 20);
      shape.setAttributeNS(null, "fill", "green");
      break;
    case "Ellipse": //椭圆
      shape = document.createElementNS(svgns, "ellipse");
      shape.setAttributeNS(null, "cx", 25);
      shape.setAttributeNS(null, "cy", 25);
      shape.setAttributeNS(null, "rx", 20);
      shape.setAttributeNS(null, "ry", 10);
      shape.setAttributeNS(null, "fill", "green");
      break;
    case "Line": //直线
      shape = document.createElementNS(svgns, "line");
      shape.setAttributeNS(null, "x1", 5);
      shape.setAttributeNS(null, "y1", 5);
      shape.setAttributeNS(null, "x2", 45);
      shape.setAttributeNS(null, "y2", 45);
      shape.setAttributeNS(null, "stroke", "green");
      break;
    case "Path": //路径
      shape = document.createElementNS(svgns, "path");
      shape.setAttributeNS(null, "id", params.id);
      shape.setAttributeNS(null, "d", params.d);
      shape.setAttributeNS(null, "fill", "none");
      shape.setAttributeNS(null, "stroke", "green");
      //shape.setAttributeNS(null, "stroke-width", 2);
      break;
    case "Polygon": //多边形
      shape = document.createElementNS(svgns, "polygon");
      shape.setAttributeNS(null, "points", "5,5 45,45 5,45 45,5");
      shape.setAttributeNS(null, "fill", "none");
      shape.setAttributeNS(null, "stroke", "green");
      break;
    case "Polyline": //折线
      shape = document.createElementNS(svgns, "polyline");
      shape.setAttributeNS(null, "points", "5,5 45,45 5,45 45,5");
      shape.setAttributeNS(null, "fill", "none");
      shape.setAttributeNS(null, "stroke", "green");
      break;
    case "Rectangle": //(圆角)矩形
      shape = document.createElementNS(svgns, "rect");
      shape.setAttributeNS(null, "x", 5);
      shape.setAttributeNS(null, "y", 5);
      shape.setAttributeNS(null, "rx", 5); //圆角大小
      shape.setAttributeNS(null, "ry", 5); //圆角大小
      shape.setAttributeNS(null, "width", 40);
      shape.setAttributeNS(null, "height", 40);
      shape.setAttributeNS(null, "fill", "green");
      break;
  }
  //svgDocument.appendChild(shape);
  return shape;
};