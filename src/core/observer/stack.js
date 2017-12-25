/**
 * 加入数组处理
 */
export default class Stack {

  constructor() {
    this._cache = []
  }

  /**
   * 加入首部
   * @return {[type]} [description]
   */
  shift(fn) {
    this._cache.unshift(fn)
  }

  /**
   * 获取总数
   * @return {[type]} [description]
   */
  getTotal(){
    return this._cache.length
  }

  /**
   * 加入尾部
   * @param  {Function} fn [description]
   * @return {[type]}      [description]
   */
  push(fn) {
    this._cache.push(fn)
  }

  /**
   * 从头部取出全部执行
   * @return {[type]} [description]
   */
  shiftAll() {
    if(this._cache.length) {
      let fn
      while(fn = this._cache.shift()) {
        fn.apply(null, arguments)
      }
    }
    return this
  }

  /**
   * 尾部取出执行
   * @return {[type]} [description]
   */
  popAll() {
    if(this._cache.length) {
      let fn
      while(fn = this._cache.pop()) {
        fn.apply(null, arguments)
      }
    }
    return this
  }

  destroy() {
    this._cache = null
  }

}
