/**
 * 处理合集
 */
export default function Collection() {
  this.remove()
}


Collection.prototype = {

  /*加入合集*/
  add(obj) {
    if (!this._group) {
      this._group = [obj]
    } else {
      this._group.push(obj)
    }
  },

  /*得到合集*/
  get() {
    return this._group
  },

  /**
   * 是否存在
   */
  isExist: function() {
    return this._group.length
  },

  /**
   * 得到一个指定的实例
   */
  specified(data) {
    let instance;
    let length = this._group.length;
    while (length) {
      length--;
      if (instance = this._group[length]) {
        if (instance.type === data.type && instance.id === data.id) {
          return instance;
        }
      }
    }
  },

  remove() {
    this._group = []
  },

  reset() {
    this.remove()
  }

};
