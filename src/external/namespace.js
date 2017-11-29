/**
 * 电子杂志全局命名
 * @singleton
 */
//sf浏览器调试 不能用hash 否则报错
window.Xut = {}

/**
 * 插件
 * @type {[type]}
 */
Xut.Plugin = {}
Xut.plugins = {}

/**
 * 平台
 * @type {[type]}
 */
Xut.plat = {}

/**
 * 样式
 * @type {[type]}
 */
Xut.style = {}

/**
 * 浅拷贝
 * @param  {[type]} target [description]
 * @param  {[type]} source [description]
 * @return {[type]}        [description]
 */
Xut.mixin = function(target, source) {
  if (!source) {
    source = target
    target = this
  }
  for (var p in source) {
    if (source.hasOwnProperty(p)) {
      target[p] = source[p]
    }
  }
  return target
}

Xut.mixin({

  /**
   * 生成32位UUID的方法
   * @return {[type]}               [description]
   */
  createUUID: (function(uuidRegEx, uuidReplacer) {
    return function() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(uuidRegEx, uuidReplacer).toUpperCase();
    };
  })(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c == "x" ? r : (r & 3 | 8);
    return v.toString(16);
  }),

  /**
   * 创建一个唯一的uuid
   * @param  {[type]} pre [description]
   * @return {[type]}     [description]
   */
  guid: function(mark) {
    var id = (+new Date()) + (Math.random() + '').slice(-1);
    return mark ? (mark + id) : Number(id)
  },

  /**
   * 数组化
   * @return {[type]} [description]
   */
  toArray: function() {
    var slice = Array.prototype.slice
    return function(a, i, j) {
      return slice.call(a, i || 0, j || a.length);
    }
  }()
})


/**
 * @class String
 * 格式化字符串
 */
String.format = function(format) {
  var args = Xut.toArray(arguments, 1);
  return format.replace(/\{(\d+)\}/g, function(m, i) {
    return args[i];
  });
}


String.styleFormat = function(format) {
  return format.replace(/\s+/g, " ")
}
