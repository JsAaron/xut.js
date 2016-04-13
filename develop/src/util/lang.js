export * from './resourceloader'

/**
 * 简单继承
 * @return {[type]} [description]
 */
export function extend(subClass, superClass) {
    var F = function() {};
    // 只继承了superClass超级类中的方法并不包括属性（如果是定义在构造函数中，不在prototype里）
    F.prototype = superClass.prototype;　
    // 因为F()函数只继承了超级类中prototype中的方法并没有其相关属性，所以subClass.prototype也只有superClass中的方法。　 
    var fProto = new F();
    for (var k in fProto) {
        if (subClass.prototype[k]) {
            console.log('子类与超类的方法名重叠了！')
        } else {
            subClass.prototype[k] = fProto[k]
        }
    }
    subClass.prototype.constructor = subClass;
    superClass = null;
}


/**
 * 迷你版的deferred
 */
export function deferred(func, context) {
    if (this instanceof Deferred === false) {
        return new Deferred(func)
    }
    var tuple = [];
    var promise = {
        resolve: function() {
            var t = tuple.shift(),
                n;
            t && (n = t.apply(null, arguments), n instanceof Deferred && (n.tuple = tuple));
        },
        then: function(n) {
            return tuple.push(n), this;
        }
    }
    if (func) {
        func.call(context || promise, promise.resolve);
    }
    return promise;
};


/**
 * 缩放比
 * @param  {[type]} width  [description]
 * @param  {[type]} height [description]
 * @param  {[type]} left   [description]
 * @param  {[type]} top    [description]
 * @return {[type]}        [description]
 */
function fiexdProportion(width, height, left, top) {
    var proportion = Config.proportion;
    return {
        width: width * proportion.width,
        height: height * proportion.height,
        left: left * proportion.left,
        top: top * proportion.top
    }
}


/**
 * 修正元素尺寸
 * @param  {[type]} results [description]
 * @return {[type]}         [description]
 */
export function revisesize(results) {
    //不同设备下缩放比计算
    var layerSize = fiexdProportion(results.width, results.height, results.left, results.top);
    //新的背景图尺寸
    var backSize = fiexdProportion(results.backwidth, results.backheight, results.backleft, results.backtop);

    //赋值新的坐标
    results.scaleWidth = Math.ceil(layerSize.width);
    results.scaleHeight = Math.ceil(layerSize.height);
    results.scaleLeft = Math.floor(layerSize.left);
    results.scaleTop = Math.floor(layerSize.top);

    //背景坐标
    results.scaleBackWidth = Math.ceil(backSize.width);
    results.scaleBackHeight = Math.ceil(backSize.height);
    results.scaleBackLeft = Math.floor(backSize.left);
    results.scaleBackTop = Math.floor(backSize.top);

    return results;
}
