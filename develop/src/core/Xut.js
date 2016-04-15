/**
 * 电子杂志
 * 2012,5,7
 *
 * @by Aaron
 *
 * @requires Zepto JavaScript Library
 *
 * 第一次重构
 * 2012.8.31 修改模块模式
 * 2012.9.2  增加 沙箱模式管理
 * 2012.9.8  增加 模块扩展接口
 * 2012.9.10 修改 符合common js 规范
 * 2012.9.13 数据分段加载
 * 2012.9.14 修复折叠bug
 * 2012.10.10 模块化热点类
 *
 *
 * 2013.2.28 开始第二次重构
 * 2013.3.1  增加常用方法
 *
 *
 * @class Xut
 * 杂志的核心工具类
 *
 *   1 常用工具
 *   2 事件管理
 *   3 模块加载
 *   4 类继承
 *
 * @singleton
 */
Xut = {
    Plugin: {}//插件
};

/**
 * 复制config对象的所有属性到obj
 *（第一个参数为obj，第二个参数为config）。
 * @param  {[type]} o        [属性接受方对象]
 * @param  {[type]} c        [属性源对象]
 * @param  {[type]} defaults [默认对象，如果该参数存在，obj将会得到那些defaults有而config没有的属性]
 * @return {[type]}          [description]
 */
Xut.apply = function(object, config, defaults) {
    if (defaults) {
        Xut.apply(object, defaults);
    }

    if (object && config && typeof config === 'object') {
        var i, j, k;

        for (i in config) {
            object[i] = config[i];
        }
    }
    return object;
};

//插件命名空间
Xut.plugins = {};

(function(global, DOC , Xut) {

    var ArrayProto = Array.prototype,
        ObjProto   = Object.prototype,
        FuncProto  = Function.prototype;

    var slice            = ArrayProto.slice,
        unshift          = ArrayProto.unshift,
        toString         = ObjProto.toString,
        hasOwnProperty   = ObjProto.hasOwnProperty;

    var
        nativeForEach      = ArrayProto.forEach,
        nativeMap          = ArrayProto.map,
        nativeReduce       = ArrayProto.reduce,
        nativeReduceRight  = ArrayProto.reduceRight,
        nativeFilter       = ArrayProto.filter,
        nativeEvery        = ArrayProto.every,
        nativeSome         = ArrayProto.some,
        nativeIndexOf      = ArrayProto.indexOf,
        nativeLastIndexOf  = ArrayProto.lastIndexOf,
        nativeIsArray      = Array.isArray,
        nativeKeys         = Object.keys,
        nativeBind         = FuncProto.bind;

    /**
     * 返回true,如果传递的值不是未定义。
     * @param {Mixed}
     * @return {Boolean}
     */
    function isDefined(v) {
        return typeof v !== 'undefined';
    }

    /**
     * 拷贝对象，跳过已存在的
     * @param  {[type]} o [接受方对象]
     * @param  {[type]} c [源对象]
     * @return {[type]}   [description]
     */
    function applyIf(o, c) {
        if (o) {
            for (var p in c) {
                //跳过已存在
                if (!isDefined(o[p])) {
                    o[p] = c[p];
                }
            }
        }
        return o;
    }

    //=================================继承方法=================================
    //
    Xut.apply(Xut, {

        /**
          * 继承，并由传递的值决定是否覆盖原对象的属性
          * 返回的对象中也增加了 override() 函数，用于覆盖实例的成员
          * @param { Object } subclass 子类，用于继承（该类继承了父类所有属性，并最终返回该对象）
          * @param { Object } superclass 父类，被继承
          * @param { Object } overrides （该参数可选） 一个对象，将它本身携带的属性对子类进行覆盖
          * @method extend
          */
        extend: (function() {
            //覆盖
            var io = function(o) {
                    for(var m in o) {
                        this[m] = o[m];
                    }
                };

            //顶层原型对象
            var oc = ObjProto.constructor;

            return function(subClass, superClass, overrides) {

                //参数移位
                if(typeof superClass == 'object') {
                    overrides = superClass;
                    superClass = subClass;
                    //如果overrides中含有constructor就是子类的构造器
                    subClass = overrides.constructor != oc ? overrides.constructor : function() {
                        superClass.apply(this, arguments);
                    };
                }

                var F = function() {},
                    subClassPrototype,
                    superClassPrototype = superClass.prototype;

                //简单继承
                F.prototype = superClassPrototype;
                subClassPrototype = subClass.prototype = new F();
                subClassPrototype.constructor = subClass;


                // 添加了 superclass 属性指向 superclass 的 prototype
                // 子类调用父类构造函数
                subClass.superclass = superClassPrototype;
                if(superClassPrototype.constructor == oc) {
                    superClassPrototype.constructor = superClass;
                }

                // 为 subClass 和 subClassPrototype 添加 override 函数
                subClass.override = function(o) {
                    Xut.override(subClass, o);
                };
                subClassPrototype.superclass = (function() {
                    return superClassPrototype;
                });
                subClassPrototype.override = io;

                //静态拷贝
                Xut.override(subClass, overrides);

                //子类具有继承功能
                subClass.extend = function(o) {
                    return Xut.extend(subClass, o);
                };

                return subClass;
            };

        })(),

        override:function (origclass, overrides) {
            if (overrides) {
                var p = origclass.prototype;
                for (var method in overrides) {
                    p[method] = overrides[method];
                }
            }
        },

        //生成32位UUID的方法
        createUUID : (function(uuidRegEx, uuidReplacer) {
            return function() {
                return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(uuidRegEx, uuidReplacer).toUpperCase();
            };
        })(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == "x" ? r : (r & 3 | 8);
            return v.toString(16);
        }),

        /**
         * 将任何可以迭代的对象转化成数组
         * @return {[type]} [description]
         */
        toArray: function(a, i, j) {
            return slice.call(a, i || 0, j || a.length);
        },

        /**
         * 创建一个唯一的uuid
         * @param  {[type]} pre [description]
         * @return {[type]}     [description]
         */
        guid: function(pre) {
            return(pre || 'Xut_') + (+new Date()) + (Math.random() + '').slice(-8);
        }

    });

    /**
     * @class String
     * 格式化字符串
     */
    applyIf(String, {
        format:function (format) {
            var args = Xut.toArray(arguments, 1);
            return format.replace(/\{(\d+)\}/g, function (m, i) {
                return args[i];
            });
        }
    });


})(this, this.document , Xut);


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
