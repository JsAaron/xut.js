/**
 * 2016.4.11
 * 因为canvas模式导致
 * 任务必须等待context上下创建
 * 完成后执行
 * 1 事件
 * 2 预执行
 * @type {Array}
 */
export function createNextTask(callback) {
    return {
        //子对象上下文
        context: {
            /**
             * 状态表示
             */
            wait: false, //是否等待创建
            statas: false, //是否完成创建
            _ids: [],
            /**
             * 检测是否完成
             * @return {[type]} [description]
             */
            check: function() {
                var total = this.length();
                if (!total.length) {
                    //完成创建
                    this.statas = true;
                } 
                //如果已经等待
                if (this.wait) {
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
            add: function(id) {
                if (-1 === this._ids.indexOf(id)) {
                    this._ids.push(id)
                }
            }, 
            remove: function(id) {
                if (!id){
                    return
                }  
                var index = this._ids.indexOf(id)
                var val = this._ids.splice(index, 1)
                this.check(val);
                return val;
            },
            length: function() {
                return this._ids.length;
            }
        },
        event: [], //事件
        pre: {} //预执行
    };
}
