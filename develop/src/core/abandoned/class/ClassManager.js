/**
 *  ClassManager 类管理
 *
 */

(function(Xut, Class) {


    var ClassManager = Xut.ClassManager = {


        /**
         * @已经注册的类
         * @type Object
         * 所有的课程都通过ClassManager定义键是名称的类和值是引用的类。
         * @私有
         */
        classes: {},

        /**
         * @private
         */
        namespaceRewrites: [{
            from : 'Xut.',
            to   : Xut
        }],
        

        /**
         * 获得类的名称的引用或它的实例
         * @param  {[type]} object [description]
         * @return {[type]}        [description]
         */
        getName: function(object) {
            return object && object.$className || '';
        },

        /**
         * 注册引用
         * Class工厂创建的类
         * @param {String} name
         * @param {Object} value
         * @return {Xut.ClassManager} this
         * @return {[type]} [description]
         */
        regClasses: function(name, value) {
            this.classes[name] =  this.assignNamespace(name, value);
            return this;
        },

        /**
         * 得到类的引用
         * @param  {[type]} name [description]
         * @return {[type]}      [description]
         */
        getClass: function(name) {
            if (this.classes.hasOwnProperty(name)) {
                return this.classes[name];
            }
        },

        /**
         * 支持改写命名空间
         * @private
         */
        parseNamespace: function(namespace) {

            if (!Xut.isString(namespace)) {
                throw new Error("[Xut.ClassManager.parseNamespace] namespace must be a string");
            }

            var parts = [],
                rewrites = this.namespaceRewrites,
                rewrite, from, to, i, ln, root = Xut.global;

            for (i = 0, ln = rewrites.length; i < ln; i++) {
                rewrite = rewrites[i];
                from = rewrite.from;
                to = rewrite.to;

                //如果是Xut.命名开头
                if (namespace === from || namespace.substring(0, from.length) === from) {
                    namespace = namespace.substring(from.length);

                    if (!Xut.isString(to)) {
                        root = to;
                    } else {
                        parts = parts.concat(to.split('.'));
                    }

                    break;
                }
            }

            parts.push(root);

            //[Xut, "Person"]
            parts = parts.concat(namespace.split('.'));

            return Xut.Array.clean(parts);
        },

       /**
         * 创建一个名称空间和分配值来创建的对象
         Xut.ClassManager.assignNamespace('MyCompany.pkg.Example', someObject);
         alert(MyCompany.pkg.Example === someObject); 
         * @param {String} name
         * @param {Mixed} value
         * @markdown
         */
        assignNamespace: function(name, value) {

            var root = Xut.global,
                parts = this.parseNamespace(name),
                leaf = parts.pop(),
                i, ln, part;

            for (i = 0, ln = parts.length; i < ln; i++) {
                part = parts[i];

                if (!Xut.isString(part)) {
                    root = part;
                } else {
                    if (!root[part]) {
                        root[part] = {};
                    }
                    root = root[part];
                }
            }

            root[leaf] = value;

            return root[leaf];
        },


        /**
         * @私有方法
         * @创建类
         */
        create: function(className, data, createdFn) {

            if (typeof className != 'string') {
                throw new Error("[Xut.delimit] 无效类名 '" + className + "',必须是一个非空字符串");
            }

            data.$className = className;

            //创建类
            return new Class(data, function() {

                //注册类管理
                ClassManager.regClasses(className, this);

                //返回类初始化完毕回调
                if (Xut.isFunction(createdFn)) {
                    createdFn.call(this, this);
                }

                return;
            });
        },

        /**
         * 创建类实例对象
         * @return {[type]} [description]
         */
        instantiate: function() {
            var args = Xut.toArray(arguments),
                temp = function() {},
                className = args.shift(),
                cls, constructor, instanceCls;

            cls = this.getClass(className);

            constructor = cls.prototype.constructor;
            instanceCls = function() {
                return constructor.apply(this, args);
            };

            temp.prototype = cls.prototype;
            instanceCls.prototype = new temp();
            instanceCls.prototype.constructor = instanceCls;

            return new instanceCls();
        }


    };


    function alias(object, methodName) {
        return function() {
            return object[methodName].apply(object, arguments);
        };
    }


    /**
     * 外部接口
     */
    Xut.apply(Xut, {

        /**
         * 定义一个类
         * @member Ext
         * @method delimit
         */
        define: alias(ClassManager, 'create'),

        /**
         * 创建一个新对象
         * @type {[type]}
         */
        create: alias(ClassManager, 'instantiate'),

        /**
         * 得到类名
         * @member Ext
         * @method getClassName
         */
        getClassName: alias(ClassManager, 'getName')
    });



})(Xut, Xut.ClassFactory);