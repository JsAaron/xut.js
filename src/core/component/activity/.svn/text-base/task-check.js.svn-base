/**
 * 2016.4.11
 * 因为canvas模式导致
 * 任务必须等待context上下创建
 * 完成后执行
 * 1 事件
 * 2 预执行
 * @type {Array}
 */
export default function(callback) {
  return {
    context: {
      /**
       * 状态表示
       */

      /**
       * 是否等待创建
       * @type {Boolean}
       */
      wait: false,

      /**
       * 是否完成创建
       * @type {Boolean}
       */
      statas: false,

      /**
       * id合集
       * @type {Array}
       */
      _ids: [],

      /**
       * 事件
       * @type {Array}
       */
      event: [],

      /**
       * 预执行
       * @type {Object}
       */
      pre: {}, //预执行


      /**
       * 检测是否完成
       * @return {[type]} [description]
       */
      check() {
        var total = this.length();
        if(!total.length) {
          //完成创建
          this.statas = true;
        }
        //如果已经等待
        if(this.wait) {
          callback && callback()
          return
        }
        // //创建比流程先执行完毕
        // //一般几乎不存在
        // //但是不排除
        // if (!this.wait && this.statas) {
        //     this.wait = true;
        //     return;
        // }
      },

      add(id) {
        if(-1 === this._ids.indexOf(id)) {
          this._ids.push(id)
        }
      },

      remove(id) {
        if(!id) {
          return
        }
        var index = this._ids.indexOf(id)
        var val = this._ids.splice(index, 1)
        this.check(val);
        return val;
      },

      length() {
        return this._ids.length;
      }
    }
  };
}