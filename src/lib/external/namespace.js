/**
 * 电子杂志全局命名
 * @singleton
 */
window.Xut = Object.create(null)

/**
 * 插件
 * @type {[type]}
 */
Xut.Plugin = Object.create(null)
Xut.plugins = Object.create(null)

/**
 * 平台
 * @type {[type]}
 */
Xut.plat = Object.create(null)

/**
 * 样式
 * @type {[type]}
 */
Xut.style = Object.create(null)



/**
 * 浅拷贝
 * @param  {[type]} target [description]
 * @param  {[type]} source [description]
 * @return {[type]}        [description]
 */
Xut.extend = function(target, source) {
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

Xut.extend({

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
    guid: function(pre) {
        return (pre || 'Xut_') + (+new Date()) + (Math.random() + '').slice(-8);
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
