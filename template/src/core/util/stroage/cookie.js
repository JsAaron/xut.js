/////////////////////////////////////////////////////////////////////
///
///  默认用H5的localStorage保存数据
///  例外：safari开启了
///  1 safari无痕模式下被禁用的localStorage，不可写，只能读
///  2 有些机型不能存储信息到localStorage中,微信中通过cookie方式单独修复，直接用浏览器不可以
///
/////////////////////////////////////////////////////////////////////


/**
 * 设置setCookie
 * @param {[type]} c_name     [description]
 * @param {[type]} value      [description]
 * @param {[type]} expiredays [description]
 */
export function setCookie(name, value, expiredays) {
  if (!expiredays) {
    var day = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000);
    expiredays = exp.toGMTString()
  }
  document.cookie = name + "=" + escape(value) + ";expires=" + expiredays;
}


/**
 * 取回cookie
 * @param  {[type]} c_name [description]
 * @return {[type]}        [description]
 */
export function getCookie(name) {
  if (document.cookie.length > 0) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
      return unescape(arr[2]);
    } else {
      return null;
    }
  }
  return null
}

/**
 *  移除
 * @param  {[type]} c_name     [description]
 * @param  {[type]} value      [description]
 * @param  {[type]} expiredays [description]
 * @return {[type]}            [description]
 */
export function removeCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null) {
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
  }
}
