 /**
  *
  * 注册处理器
  *   预处理器Preprocessor
  *   后处理器Postprocessor
  *
  *   按顺序加载处理
  *
  */
 (function(Class, ClassManager) {

   //需要加载转换  字符串-> 对象引用
   var dependencyProperties = ['extend', 'mixins', 'requires'];


   /**
    *
    *  注册className
    *
    */
   Class.registerPreprocessor('className', function(cls, data, fn) {
     if (data.$className) {
       cls.$className = data.$className;
       cls.displayName = cls.$className;
     }
     fn && fn.call(this, cls, data);
   });


   /**
    *
    * 类名转换
    *
    */
   Class.registerPreprocessor('loader', function(cls, data, fn) {

     var dependencies = [],
       className = ClassManager.getName(cls),
       i, j, ln, subLn, value, propertyName, propertyValue;

     for (i = 0, ln = dependencyProperties.length; i < ln; i++) {
       propertyName = dependencyProperties[i];

       if (data.hasOwnProperty(propertyName)) {
         propertyValue = data[propertyName];

         if (Xut.isString(propertyValue)) {

           data[propertyName] = ClassManager.getClass(propertyValue);

         } else if (Xut.isArray(propertyValue)) {
           for (j = 0, subLn = propertyValue.length; j < subLn; j++) {
             value = propertyValue[j];

             if (Xut.isString(value)) {
               data[propertyValueyName][j] = ClassManager.getClass(value);
             }
           }
         } else {
           for (var k in propertyValue) {
             if (propertyValue.hasOwnProperty(k)) {
               value = propertyValue[k];

               if (Xut.isString(value)) {
                 data[propertyName][k] = ClassManager.getClass(value);
               }
             }
           }
         }
       }
     };

     fn && fn.call(this, cls, data);

   });


   /**
    *
    *  继承父类或者base顶层基类
    *
    */
   Class.registerPreprocessor('extend', function(cls, data, fn) {

     var extend = data.extend,
       base = Xut.Base,
       temp = function() {},
       parent, i, k, ln, staticName, parentStatics;

     delete data.extend;

     //继承顶级base,默认继承父类
     if (typeof extend === 'function' && extend !== Object) {
       parent = extend;
     } else {
       parent = base;
     }

     temp.prototype = parent.prototype;
     cls.prototype = new temp();

     if (!('$class' in parent)) {
       for (i in base.prototype) {
         if (!parent.prototype[i]) {
           parent.prototype[i] = base.prototype[i];
         }
       }
     }

     cls.prototype.self = cls;

     if (data.hasOwnProperty('constructor')) {
       cls.prototype.constructor = cls;
     } else {
       cls.prototype.constructor = parent.prototype.constructor;
     }

     cls.superclass = cls.prototype.superclass = parent.prototype;

     delete data.extend;


     fn.call(this, cls, data);

   });


   /**
    *
    *  混入类
    *
    */
   Class.registerPreprocessor('mixins', function(cls, data, fn) {

     var mixins = data.mixins;

     if (mixins) {
       cls.mixin(mixins);
     }

     delete data.mixins;

     fn.call(this, cls, data);

   });


   /**
    *
    *  静态方法扩充
    *
    */
   Class.registerPreprocessor('statics', function(cls, data, fn) {

     var statics = data.statics,
       inheritableStatics = data.inheritableStatics,
       name;

     if (Xut.isObject(statics) || Xut.isObject(inheritableStatics)) {

       if (statics) {
         for (name in statics) {
           if (statics.hasOwnProperty(name)) {
             cls[name] = statics[name];
           }
         }

         delete data.statics;
       }

       if (inheritableStatics) {
         cls.$inheritableStatics = [];

         for (name in inheritableStatics) {
           if (inheritableStatics.hasOwnProperty(name)) {
             cls[name] = inheritableStatics[name];
             cls.$inheritableStatics.push(name);
           }
         }

         delete data.inheritableStatics;
       }
     }

     if (fn) {
       fn.call(this, cls, data);
     }

   });



 })(Xut.ClassFactory, Xut.ClassManager);