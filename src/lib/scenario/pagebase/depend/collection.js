/**
 * [ description]
 * @return {[type]} [description]
 */

/**
 * 处理合集
 */
export default function Collection() {
  this.remove()
}

Collection.prototype = {

  register(contentObj) {
    if(!this.list) {
      this.list = [contentObj]
    } else {
      this.list.push(contentObj)
    }
  },

  get() {
    return this.list
  },

  /**
   * 是否存在
   * @return {Boolean} [description]
   */
  isExist: function() {
    return this.list.length
  },

  /**
   * 得到一个指定的实例
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  specified(data) {
    var instance;
    var listLength = this.list.length;
    while(listLength) {
      listLength--;
      if(instance = this.list[listLength]) {
        if(instance.type === data.type && instance.id === data.id) {
          return instance;
        }
      }
    }
  },

  remove() {
    this.list = []
  },

  reset() {
    this.remove()
  }

};