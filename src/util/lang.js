//定义属性
var def = Object.defineProperty;

/**
 * 定义一个新的对象
 * 重写属性
 */
export function defProtected(obj, key, val, enumerable, writable) {
    def(obj, key, {
        value: val,
        enumerable: enumerable,
        writable: writable,
        configurable: true
    })
}

/**
 * 定义访问控制器
 * @return {[type]} [description]
 */
export function defAccess(obj, key, access) {
    def(obj, key, {
        get: access.get,
        set: access.set
    })
}


/**
 * 创建一个纯存的hash对象
 */
export function hash() {
    return Object.create(null)
}



/**
 * 转化数组
 * @param  {[type]} o [description]
 * @return {[type]}   [description]
 */
export function toNumber(o) {
    return Number(o) || null;
};

/**
 * 保证有效值
 * @return {[type]} [description]
 */
export function toEmpty(val) {
    return Number(val);
}

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
    var proportion = Xut.config.proportion;
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


/**
 * 全局字体修复
 * @return {[type]} [description]
 */
export function setRootfont() {
    var rootSize = 16;
    switch (window.innerWidth + window.innerHeight) {
        case 3000: //1920+1080
            //samsumg galaxy s4
            rootSize = 32;
            break;
        case 2000: //1280+720
            //HD Android phone
            rootSize = 26;
            break;
        case 2048: //1280+768
            rootSize = Xut.plat.isIpad ? 16 : 26;
            break;
        case 1624: //1024+600
            rootSize = 18;
            break;
        case 888: //568+320
            rootSize = 12;
            break;
        case 800: //480+320
            rootSize = 14;
            break;
        case 560: //320+240
            rootSize = 12;
            break;
        default:
            //其他分辨率 取默认值
            break;
    }
    16 != rootSize && $("html").css("font-size", rootSize + "px");
}



export function portExtend(object, config) {
    for (var i in config) {
        if (i) {
            if (object[i]) {
                console.log('接口方法重复', 'Key->' + i, 'Value->' + object[i])
            } else {
                object[i] = config[i];
            }
        }
    }
};



/**
 * 修正判断是否存在处理
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
export function arrayUnique(arr) { //去重
    if (arr && arr.length) {
        var length = arr.length;
        while (--length) {
            //如果在前面已经出现，则将该位置的元素删除
            if (arr.lastIndexOf(arr[length], length - 1) > -1) {
                arr.splice(length, 1);
            }
        }
        return arr;
    } else {
        return arr
    }
}
