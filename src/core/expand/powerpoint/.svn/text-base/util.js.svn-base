let ceil = Math.ceil
let pow = Math.pow
let regexpRGB = /^(rgb|RGB)\([0-9]{1,3},\s?[0-9]{1,3},\s?[0-9]{1,3}\)$/; //RGB
let regexpHex = /^#[0-9a-fA-F]{3,6}$/; //Hex

/**
 * 计算两点直线距离
 */
export function calculateDistance(currentPoint, historyPoint) {
  var xdiff = currentPoint.x - historyPoint.x;
  var ydiff = currentPoint.y - historyPoint.y;
  return ceil(pow(xdiff * xdiff + ydiff * ydiff, 0.5));
}


/**
 * 区间计算
 */
export function calculateDirection(currentPoint, historyPoint) {
  var quadrant = ""; //象限
  if(currentPoint.y == historyPoint.y && currentPoint.x > historyPoint.x)
    quadrant = "+x"; //水平正方向
  else if(currentPoint.y == historyPoint.y && currentPoint.x < historyPoint.x)
    quadrant = "-x"; //水平负方向
  else if(currentPoint.x == historyPoint.x && currentPoint.y > historyPoint.y)
    quadrant = "+y"; //垂直正方向
  else if(currentPoint.x == historyPoint.x && currentPoint.y < historyPoint.y)
    quadrant = "-y"; //垂直负方向
  else if(currentPoint.x > historyPoint.x && currentPoint.y < historyPoint.y)
    quadrant = "1"; //第一象限
  else if(currentPoint.x > historyPoint.x && currentPoint.y > historyPoint.y)
    quadrant = "2"; //第二象限
  else if(currentPoint.x < historyPoint.x && currentPoint.y > historyPoint.y)
    quadrant = "3"; //第三象限
  else if(currentPoint.x < historyPoint.x && currentPoint.y < historyPoint.y)
    quadrant = "4"; //第四象限
  return quadrant;
}


/**
 * 十六进制颜色转换为RGB颜色
 * @param color 要转换的十六进制颜色
 * @return RGB颜色
 */
export function colorHexToRGB(color, opacity) {
  color = color.toUpperCase();
  if(regexpHex.test(color)) {
    var hexArray = new Array();
    var count = 1;
    for(var i = 1; i <= 3; i++) {
      if(color.length - 2 * i > 3 - i) {
        hexArray.push(Number("0x" + color.substring(count, count + 2)));
        count += 2;
      } else {
        hexArray.push(Number("0x" + color.charAt(count) + color.charAt(count)));
        count += 1;
      }
    }
    if(opacity && opacity > 0)
      return "RGBA(" + hexArray.join(",") + "," + opacity + ")";
    else
      return "RGB(" + hexArray.join(",") + ")";
  } else {
    console.error("Hex Color string(" + color + ") format conversion error.")
    return color;
  }
}


/**
 * RGB颜色转换为十六进制颜色
 * @param color 要转换的RGB颜色
 * @return 十六进制颜色
 */
export function colorRGBToHex(color) {
  if(regexpRGB.test(color)) {
    color = color.replace(/(\(|\)|rgb|RGB)*/g, "").split(",");
    var colorHex = "#";
    for(var i = 0; i < color.length; i++) {
      var hex = Number(color[i]).toString(16);
      if(hex.length == 1) hex = "0" + hex;
      colorHex += hex;
    }
    return colorHex;
  } else {
    console.error("RGB Color string(" + color + ") format conversion error.")
    return color;
  }
}