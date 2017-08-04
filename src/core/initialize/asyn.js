/**
 * 判断是否支持webp模式
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function supportWebP(callback) {
  var webP = new Image();
  webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  webP.onload = webP.onerror = function() {
    callback(webP.height === 2);
  };
}

/**
 * 提前检测出异步的功能支持
 * @return {[type]} [description]
 */
export function initAsyn(callback) {

  /**
   * 检测是否支持webp格式
   */
  supportWebP(function(state) {
    Xut.plat.supportWebp = state
    callback()
  });

}
