/**
 *
 *  内部工厂类
 *  XutClass
 *
 */
(function() {

    var XutClass,
    Base = Xut.Base,
        baseStaticMembers = [],
        baseStaticMember,
        baseStaticMemberLength;

    for (baseStaticMember in Base) {
        if (Base.hasOwnProperty(baseStaticMember)) {
            baseStaticMembers.push(baseStaticMember);
        }
    }

    baseStaticMemberLength = baseStaticMembers.length;

    /**
     * 包装类工厂方法
     * @param {[type]} newClass  [要创建的类]
     * @param {[type]} classData [数据]
     * @param {[type]} createdFn [创建类成功后回调处理]
     */
    Xut.ClassFactory = XutClass = function(newClass, classData, createdFn) {
        if (Xut.isObject(newClass)) {
            createdFn = classData;
            classData = newClass;
            newClass = null;
        }

        //newClass 创建,静态拷贝处理
        newClass = XutClass.create(newClass);

        //预处理器
        XutClass.process.call(this, newClass, classData, createdFn);

        return newClass;
    };


    Xut.apply(XutClass, {

        /**
         * 创建类
         * @私有方法
         * @静态方法
         *
         * 继承Base类的静态方法，通过Xut.define创建的类都是Base的直接
         * 或间接子类，此处只把Base中的static属性掺进新的创建的类中。
         */
        create: function(newClass) {
            var name, i;

            if (!newClass) {
                newClass = function() {
                    return this.constructor.apply(this, arguments);
                };
            }

            //继承Base类的静态方法
            for (i = 0; i < baseStaticMemberLength; i++) {
                name = baseStaticMembers[i];
                newClass[name] = Base[name];
            }

            return newClass;
        },

        /**
         * 确定类声明的前置处理函数和后置处理函数的地方
         * @私有方法
         * @静态方法
         * preprocessors
         *     注册的预处理器
         *     ["className", "loader", "extend", "mixins", "config", "statics"]
         */
        process: function(newClass, classData, createdFn) {
            //当前上下文引用
            var self = this.constructor,
                //获取注册的预处理器
                preprocessors = classData.preprocessors || XutClass.getDefaultPreprocessors(),

                fn, perform, preprocessorName, clones;

            delete classData.preprocessors;

            perform = function(cls, data) {

                preprocessorName = preprocessors.shift();

                //preprocessorName == 'undefined'
                //类创建成功后执行后处理器方法
                if (!preprocessorName) {
                    //复制创建类的原型到class
                    cls.extend(data);
                    if (Xut.isFunction(createdFn)) {
                        createdFn.call(cls);
                    }
                    return;
                }

                fn = this.getPreprocessor(preprocessorName);

                //执行预处理器
                fn.call(this, cls, data, perform);
            };

            perform.call(self, newClass, classData);
        },


        /**
         * @前置处理器
         * @私有方法
         * @静态方法
         */
        preprocessors: {},

        /**
         * 注册一个新的预处理程序中会用到的类的创建过程
         *
         * @私有方法
         * @静态方法
         */
        registerPreprocessor: function(name, fn) {

            //当前前置处理器的回调函数  
            this.preprocessors[name] = fn;

            //注册默认名
            this.setDefaultPreprocessorPosition(name);

            return this;
        },



        /**
         * 检索一个预处理程序回调函数,它的名字,它之前已经注册。
         *
         * @私有方法
         * @静态方法
         * @param {String} name
         * @return {Function} preprocessor
         */
        getPreprocessor: function(name) {
            return this.preprocessors[name];
        },

        /**
         * 得到所有的预处理
         * @私有方法
         * @静态方法
         */
        getPreprocessors: function() {
            return this.preprocessors;
        },


        /**
         * 默认预处理
         * @私有方法
         * @静态方法
         */
        defaultPreprocessors: [],


        /**
         * 检索数组堆默认预处理器。
         * @私有方法
         * @静态方法
         * @return {Function} defaultPreprocessors
         */
        getDefaultPreprocessors: function() {
            return this.defaultPreprocessors.slice(0);
        },


        /**
         * 设置默认堆栈数组的默认预处理器。
         * @私有方法
         * @静态方法
         * @param {Array} preprocessors
         * @return {Ext.Class} this
         */
        setDefaultPreprocessors: function(preprocessors) {
            this.defaultPreprocessors = Ext.Array.from(preprocessors);
            return this;
        },


        /**
         * 任何现有的预处理程序
         * 插入这个预处理程序在一个特定的位置在堆栈中,选择相对
         */
        setDefaultPreprocessorPosition: function(name) {
            var defaultPreprocessors = this.defaultPreprocessors;
            defaultPreprocessors.push(name);
            return this;
        }

    });



})();