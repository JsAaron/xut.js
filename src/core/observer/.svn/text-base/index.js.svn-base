/**
 *
 * 基本事件管理
 * 1 异步
 * 2 同步
 *
 */

const ArrayProto = Array.prototype
const nativeIndexOf = ArrayProto.indexOf
const slice = ArrayProto.slice
const _indexOf = (array, needle) => {
  var i, l;
  if(nativeIndexOf && array.indexOf === nativeIndexOf) {
    return array.indexOf(needle);
  }
  for(i = 0, l = array.length; i < l; i++) {
    if(array[i] === needle) {
      return i;
    }
  }
  return -1;
}



export class Observer {

  constructor() {
    this.$$watch = this.bind
    this.$$unWatch = this.unbind
    this.$$emit = this.trigger
    this.$$once = this.one

    //触发列表名称
    //防止同步触发
    this._handleName = {}
  }


  bind(event, fn) {
    var i, part;
    var events = this.events = this.events || {};
    var parts = event.split(/\s+/);
    var num = parts.length;

    for(i = 0; i < num; i++) {
      events[(part = parts[i])] = events[part] || [];
      if(_indexOf(events[part], fn) === -1) {
        events[part].push(fn);
      }
    }

    //假如存在同步句柄
    //执行
    var data
    if(data = this._handleName[event]) {
      this.$$emit(event, data[0])
    }

    return this;
  }

  one(event, fn) {
    // [notice] The value of fn and fn1 is not equivalent in the case of the following MSIE.
    // var fn = function fn1 () { alert(fn === fn1) } ie.<9 false
    var fnc = function() {
      this.unbind(event, fnc);
      fn.apply(this, slice.call(arguments));
    };
    this.bind(event, fnc);
    return this;
  }

  //event = 'a b c' 空格分离多个事件名
  //提供fn 指定在某个事件中删除某一个
  //否则只提供事件名 ，全删除
  unbind(event, fn) {

    var eventName, i, index, num, parts;
    var events = this.events;

    if(!events) return this;

    //指定
    if(arguments.length) {
      parts = event.split(/\s+/);
      for(i = 0, num = parts.length; i < num; i++) {
        if((eventName = parts[i]) in events !== false) {
          //如果提供函数引用
          //那么就是在数组中删除其中一个
          if(fn) {
            index = _indexOf(events[eventName], fn)
            if(index !== -1) {
              events[eventName].splice(index, 1);
            }
          } else {
            //如果只提供了名字，则全删除
            events[eventName] = null
          }

          //如果没有内容了
          if(!events[eventName] || !events[eventName].length) {
            delete events[eventName]
          }
        }
      }
    } else {
      this.events = null;
    }


    return this;
  }

  trigger(event) {
    var args, i;
    var events = this.events,
      handlers;

    //参数
    args = slice.call(arguments, 1);

    if(!events || event in events === false) {
      // console.log(event)
      //同步的情况
      //如果除非了事件，可能事件句柄还没有加载
      this._handleName[event] = args
      return this;
    }

    handlers = events[event];
    for(i = 0; i < handlers.length; i++) {
      handlers[i].apply(this, args);
    }
    return this;
  }

}
