/**
 *
 * Base 基类
 *
 */
(function(Xut) {

    var Base = function() {};

    var flexSetter = Xut.Function.flexSetter;

    Xut.apply(Base, {

        $className: 'Xut.Base',

        /**
         * @private
         */
        ownMethod: function(name, fn) {
            var originalFn, className;

            if (fn === Xut.emptyFn) {
                this.prototype[name] = fn;
                return;
            }

            if (fn.$isOwned) {
                originalFn = fn;

                fn = function() {
                    return originalFn.apply(this, arguments);
                };
            }

            className = Xut.getClassName(this);
            if (className) {
                fn.displayName = className + '#' + name;
            }
            fn.$owner = this;
            fn.$name = name;
            fn.$isOwned = true;

            this.prototype[name] = fn;
        },

        /**
         * @private
         */
        borrowMethod: function(name, fn) {
            if (!fn.$isOwned) {
                this.ownMethod(name, fn);
            }
            else {
                this.prototype[name] = fn;
            }
        },

        /**
         * @继承
         * @私有方法
         * @静态方法
         *
         *  传入 data
         *   解析
         *     每个data中的数据,传入函数
         *
         */
        extend: flexSetter(function(name, value) {
            if (Xut.isObject(this.prototype[name]) && Xut.isObject(value)) {
                 Xut.Object.merge(this.prototype[name], value);
            } else if (Xut.isFunction(value)) {
                this.ownMethod(name, value);
            } else {
                this.prototype[name] = value;
            }
        }),

        /**
         * 内部混入处理程序
         * @private
         */
        mixin: flexSetter(function(name, cls) {
            var mixinPrototype = cls.prototype,
                myPrototype = this.prototype,
                i;

            for (i in mixinPrototype) {
                if (mixinPrototype.hasOwnProperty(i)) {
                    if (myPrototype[i] === undefined) {
                        if (Xut.isFunction(mixinPrototype[i])) {
                            this.borrowMethod(i, mixinPrototype[i]);
                        }
                        else {
                            myPrototype[i] = mixinPrototype[i];
                        }
                    }
                    else if (i === 'config' && Xut.isObject(myPrototype[i]) && Xut.isObject(mixinPrototype[i])) {
                        Xut.Object.merge(myPrototype[i], mixinPrototype[i]);
                    }
                }
            }

            if (!myPrototype.mixins) {
                myPrototype.mixins = {};
            }

            myPrototype.mixins[name] = mixinPrototype;
        }),

        createAlias: flexSetter(function(alias, origin) {
            this.prototype[alias] = this.prototype[origin];
        }),

        /**
         * @用于继承
         * @私有方法
         * @静态方法
         */
        implement: function() {
            this.addMembers.apply(this, arguments);
        },

        /**
         * 增加原型成员
         */
        addMembers: function(members) {
            var prototype = this.prototype,
                names = [],
                name, member;

            //<debug>
            var className = this.$className || '';
            //</debug>

            for (name in members) {
                if (members.hasOwnProperty(name)) {
                    member = members[name];

                    if (typeof member == 'function' && !member.$isClass && member !== Xut.emptyFn) {
                        member.$owner = this;
                        member.$name = name;
                        //<debug>
                        member.displayName = className + '#' + name;
                        //</debug>
                    }

                    prototype[name] = member;
                }
            }

            return this;
        }

    });

    /**
     * base原型方法扩展
     */
    Base.implement({

        $className: 'Xut.Base',

        $class: Base,

        self: Base,
        
        /**
         * 默认的构造函数,简单地返回this
         *
         * @constructor
         * @protected
         * @return {Object} this
         */
        constructor: function() {
            return this;
        },

        /**
         * 调用重载父类的方法
         * @return {[type]} [description]
         */
        callParent:function(args){
            var method = this.callParent.caller,
                parentClass, methodName;

            if (!method.$owner) {
                if (!method.caller) {
                    throw new Error("[" + Xut.getClassName(this) + "#callParent] Calling a protected method from the public scope");
                }

                method = method.caller;
            }

            parentClass = method.$owner.superclass;
            methodName = method.$name;

            if (!(methodName in parentClass)) {
                throw new Error("[" + Xut.getClassName(this) + "#" + methodName + "] this.callParent() was called but there's no such method (" + methodName + ") found in the parent class (" +
                    (Xut.getClassName(parentClass) || 'Object') + ")");
            }

            return parentClass[methodName].apply(this, args || []);
        }


    });







    Xut.Base = Base;




})(Xut);















