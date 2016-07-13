 /////////////////////////////////////////////////////////
 ///2015.3.24 新增
 //=====================事件单独处理========================= //
 //1 isBrowser
 //2 isMobile
 //3 isSurface
 /////////////////////////////////////////////////////////

 const plat = Xut.plat
 const TRANSITION_END = plat.TRANSITION_END

 //2015.3.23
 //可以点击与触摸
 const isSurface = plat.isSurface;
 //触发事件名
 const touchName = ['touchstart', 'touchmove', 'touchend', TRANSITION_END];
 const mouseName = ['mousedown', 'mousemove', 'mouseup', TRANSITION_END];
 const EVENT_NAME = function() {
     if (isSurface) {
         return {
             touch: touchName,
             mouse: mouseName
         }
     }
     return [plat.START_EV, plat.MOVE_EV, plat.END_EV, TRANSITION_END];
 }()


 /**
  * 合并事件绑定处理
  * 因为isSurface设备上
  * 要同时支持2种方式
  * @return {[type]} [description]
  */
 function _bind(events, callback) {
     callback.start && this.addEventListener(events[0], callback.start, false);
     callback.move && this.addEventListener(events[1], callback.move, false);
     callback.end && this.addEventListener(events[2], callback.end, false);
     callback.transitionend && this.addEventListener(events[3], callback.transitionend, false);
 }

 function _remove(events, callback) {
     callback.start && this.removeEventListener(events[0], callback.start, false);
     callback.move && this.removeEventListener(events[1], callback.move, false);
     callback.end && this.removeEventListener(events[2], callback.end, false);
     callback.transitionend && this.removeEventListener(events[3], callback.transitionend, false);
 }


 /**
  * processor
  * @param  {[type]}   processor    [处理器]
  * @param  {[type]}   eventContext [上下文]
  * @param  {Function} callback     [回调函数]
  * @return {[type]}                [description]
  */
 function _exec(processor, eventContext, callback) {
     //如果两者都支持
     //鼠标与触摸
     if (isSurface) {
         // touch :['touchstart','touchmove','touchend'],
         // mouse :['mousedown','mousemove','mouseup']
         _.each(EVENT_NAME, function(events) {
             processor.call(eventContext, events, callback);
         })
     } else {
         processor.call(eventContext, EVENT_NAME, callback);
     }
 }


 /**
  * 合并事件绑定处理
  * 因为isSurface设备上
  * 要同时支持2种方式
  * on('on/off',{
  *     context : eventContext,
  *     callback:{
  *         start   : start,
  *         move    : move,
  *         end     : end
  *     }
  * })
  * @return {[type]} [description]
  */
 export function on(eventName, opts) {
     if (eventName === 'on') {
         _exec(_bind, opts.context, opts.callback)
     } else {
         console.log('简单事件on出错')
     }
 }

 export function off(eventName, opts) {
     if (eventName === 'off') {
         _exec(_remove, opts.context, opts.callback)
     } else {
         console.log('简单事件off出错')
     }
 }


 /**
  * 如果execEvent的callback绑定的this
  *handle(e, {
  *     start: function(e) {
  *         self.onTouchStart(e);
  *     },
  *     move: function(e) {
  *         self.onTouchMove(e);
  *     },
  *     end: function(e) {
  *         self.onTouchEnd(e);
  *     },
  *     transitionend: function(e) {
  *         self.onAnimComplete(e);
  *     }
  * })
  * @return {[type]}           [description]
  */
 export function handle(processor, context, event) {
     switch (event.type) {
         case 'touchstart':
         case 'mousedown':
             processor.start && processor.start.call(context, event)
             break;
         case 'touchmove':
         case 'mousemove':
             processor.move && processor.move.call(context, event)
             break;
         case 'touchend':
         case 'mouseup':
             processor.end && processor.end.call(context, event)
             break;
         case TRANSITION_END:
             processor.transitionend && processor.transitionend.call(context, event)
             break;
     }
 }

