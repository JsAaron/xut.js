(function() {

    var TemplateClass = function() {};

    Xut.Object = {

        /**
         * 返回一个新的对象与给定的对象作为原型链。
         * @param {Object} object 对象原型链的新对象
         */
        chain: ('create' in Object) ? function(object) {
            return Object.create(object);
        } : function(object) {
            TemplateClass.prototype = object;
            var result = new TemplateClass();
            TemplateClass.prototype = null;
            return result;
        },

        /**
         * 合并任意数量的对象没有引用他们或者他们的递归
         * @param {Object} source,...
         * @return {Object} 合并的对象创建的结果合并所有对象传入
         */
        merge: function(source, key, value) {
            if (Xut.isString(key)) {
                if (Xut.isObject(value) && Xut.isObject(source[key])) {
                    if (value.constructor === Object) {
                        Xut.Object.merge(source[key], value);
                    } else {
                        source[key] = value;
                    }
                } else if (Xut.isObject(value) && value.constructor !== Object) {
                    source[key] = value;
                } else {
                    source[key] = Xut.clone(value);
                }

                return source;
            }

            var i = 1,
                len = arguments.length,

                obj, prop;

            for (; i < len; i++) {
                obj = arguments[i];
                for (prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        Xut.Object.merge(source, prop, obj[prop]);
                    }
                }
            }

            return source;
        }

    }

})();