/**
 * pixi事件绑定
 * @param  {[type]} Utils   [description]
 * @param  {[type]} Config) {}          [description]
 * @return {[type]}         [description]
 */

/**
 * 动作适配
 * @type {Object}
 */
var adapter = {
    /**
     * 单击
     * @return {[type]} [description]
     */
    "tap": function(eventData) {
        var eventContext = eventData.eventContext;
        eventContext.on('mousedown', eventData.eventRun);
        eventContext.on('touchstart', eventData.eventRun);
    }
}

/**
 * 绑定事件
 * @param  {[type]} eventData [description]
 * @return {[type]}           [description]
 */
export function bindEvents(eventData) {
    //开启交互
    eventData.eventContext.interactive = true;
    adapter[eventData.eventName](eventData);
}

/**
 * 销毁事件
 * @return {[type]} [description]
 */
export function destroyEvents() {

}
