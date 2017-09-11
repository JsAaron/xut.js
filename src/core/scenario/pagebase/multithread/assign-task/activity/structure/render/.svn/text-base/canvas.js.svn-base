/**
 * 组成HTML结构
 * @param  {[type]} argument [description]
 * @return {[type]}          [description]
 */
export function createCanvas(data, wrapObj) {

  var mark = ''
  if(data.category) {
    var cats = data.category.split(",")
    var len = cats.length
    if(len) {
      while(len--) {
        mark += cats[len]
      }
    }
  }

  var temp =
    '<canvas id="{0}"' +
    ' data-ctype={1}' +
    ' width="{2}"' +
    ' height="{3}">' +
    '</canvas>'

  var str = String.format(
    temp,
    wrapObj.makeId('canvas'),
    mark.toLocaleLowerCase(),
    data.scaleWidth,
    data.scaleHeight
  )

  return str;
}