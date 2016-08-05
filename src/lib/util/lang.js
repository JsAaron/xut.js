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
 * 创建一个纯存的hash对象
 */
export function hash() {
    return Object.create(null)
}


/**
 * 简单继承
 * @return {[type]} [description]
 */
export function extend(subClass, superClass) {
    var F = function() {}
    F.prototype = superClass.prototype
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


/**
 * 标准化文件路径，主要解决 '.'和'..'相对路径问题。
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
function normalize(path) {
    // 利用帮助函数获取文件路径的信息
    var result = statPath(path),
        // 盘符
        device = result.device,
        // 是否为windows的UNC路径
        isUnc = result.isUnc,
        // 是否为绝对路径
        isAbsolute = result.isAbsolute,
        // 文件路径结尾
        tail = result.tail,
        // 尾部是否为'\' 或者 '/' 结尾。
        trailingSlash = /[\\\/]$/.test(tail);

    // Normalize the tail path
    //标准化tail路径，处理掉'.' '..' 以 '\' 连接 
    tail = normalizeArray(tail.split(/[\\\/]+/), !isAbsolute).join('\\');
    // 处理tail为空的情况
    if (!tail && !isAbsolute) {
        tail = '.';
    }
    // 当原始路径中有slash时候，需要加上
    if (tail && trailingSlash) {
        tail += '\\';
    }

    // Convert slashes to backslashes when `device` points to an UNC root.
    // Also squash multiple slashes into a single one where appropriate.
    // 处理windows UNC的情况。
    if (isUnc) {
        // 获取具体的路径，如果是UNC的情况
        device = normalizeUNCRoot(device);
    }
    // 返回具体的路径
    return device + (isAbsolute ? '\\' : '') + tail;
}


/**
 * 获取文件路径详细信息
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
function statPath(path) {
    var splitDeviceRe =
        /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
    // 和上述的函数一样，解析路径中的信息。
    var result = splitDeviceRe.exec(path),
        device = result[1] || '',
        // 判断是否 为UNC path
        isUnc = !!device && device[1] !== ':';
    // 返回具体的对象，盘符，是否为统一路径，绝对路径， 以及结尾
    return {
        device: device,
        isUnc: isUnc,
        isAbsolute: isUnc || !!result[2], // UNC paths are always absolute
        tail: result[3]
    };
}


/**
 * 解决文件目录中的相对路径
 * @param  {[type]} parts          文件目录数组，从0- 高位分别代表一级目录
 * @param  {[type]} allowAboveRoot 布尔值，代表是否可以超过根目录
 * @return {[type]}                解决掉相对路径后的数组，比如说数组 
                                   ['/test'， '/re'， '..']将会返回 ['/test']
 */
function normalizeArray(parts, allowAboveRoot) {
    // 返回值
    var res = [];
    // 遍历数组，处理数组中的相对路径字符 '.' 或者'..'
    for (var i = 0; i < parts.length; i++) {
        // 取得当前的数组的字符
        var p = parts[i];

        // ignore empty parts
        // 对空或者'.'不处理
        if (!p || p === '.')
            continue;
        // 处理相对路径中的'..'
        if (p === '..') {
            if (res.length && res[res.length - 1] !== '..') {
                // 直接弹出返回队列，当没有到达根目录时
                res.pop();
            } else if (allowAboveRoot) {
                //allowAboveRoot 为真时，插入'..'
                res.push('..');
            }
        } else {
            // 非 '.' 和'..'直接插入返回队列。 
            res.push(p);
        }
    }
    // 返回路径数组
    return res;
}



/**
 *帮助函数，将路径UNC路径标准化成\\pathname\\
 * @param  {[type]} device [description]
 * @return {[type]}        [description]
 */
function normalizeUNCRoot(device) {
    return '\\\\' + device.replace(/^[\\\/]+/, '').replace(/[\\\/]+/g, '\\');
}



/**
 *  文件路径拼接
 * @return {[type]} [description]
 */
export function joinPaths() {
    var paths = [];
    for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        // 确保函数参数为字符串
        try {
            if (Object.prototype.toString.call(arg) != "[object String]") {
                throw new Error('Arguments to path.join must be strings');
            }
            if (arg) {
                // 放入参数数组
                paths.push(arg);
            }
        } catch (e) {
            console.log(e);
        }

    }

    var joined = paths.join("/");


    if (!/^[\\\/]{2}[^\\\/]/.test(paths[0])) {
        joined = joined.replace(/^[\\\/]{2,}/, '\\');
    }
    // 利用标准化接口 获取具体的文件路径
    return normalize(joined);
}
