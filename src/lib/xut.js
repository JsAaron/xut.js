/**
 * 电子杂志全局命名
 * @singleton
 */
window.Xut = Object.create(null)

Xut.Plugin = Object.create(null)
Xut.plugins = Object.create(null)



//生成32位UUID的方法
Xut.createUUID = (function(uuidRegEx, uuidReplacer) {
    return function() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(uuidRegEx, uuidReplacer).toUpperCase();
    };
})(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c == "x" ? r : (r & 3 | 8);
    return v.toString(16);
})



/**
 * 创建一个唯一的uuid
 * @param  {[type]} pre [description]
 * @return {[type]}     [description]
 */
Xut.guid = function(pre) {
    return (pre || 'Xut_') + (+new Date()) + (Math.random() + '').slice(-8);
}


/**
 * 将任何可以迭代的对象转化成数组
 * @return {[type]} [description]
 */
Xut.toArray = function() {
    var slice = Array.prototype.slice
    return function(a, i, j) {
        return slice.call(a, i || 0, j || a.length);
    }
}()


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


String.styleFormat = function(format){
    return format.replace(/\s+/g, " ")
}


//模拟继承
Xut.CoreObject = function() {};

Xut.CoreObject.extend = function(props) {
    var init, subObj;

    props = props || {};
    // Set up the constructor using the supplied init method
    // or using the init of the parent object

    init = props.init || this.prototype.init || function() {};

    subObj = function() {
        init.apply(this, arguments);
    };

    // Inherit from this object's prototype
    subObj.prototype = Object.create(this.prototype);
    // Reset the constructor property for subObj otherwise
    // instances of subObj would have the constructor of the parent Object
    subObj.prototype.constructor = subObj;

    // Make the class extendable
    subObj.extend = Xut.CoreObject.extend;

    // Extend subObj's prototype with functions and other properties from props
    for (var name in props) {
        if (props.hasOwnProperty(name)) {
            subObj.prototype[name] = props[name];
        }
    }

    return subObj;
};
