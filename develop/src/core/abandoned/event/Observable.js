
//=================自定义事件===================
//  
//  所有组件的最顶层类
//  
//  一个抽象基类
//  为事件机制的管理提供一个公共接口
//  子类应有一个"events"属性来定义所有的事件。
//
//==============================================
(function () {

    var XUTUTIL = Xut.util,
        EACH  = Xut.each,
        TRUE  = true,
        FALSE = false;

    XUTUTIL.Observable = function () {
        var me = this, e = me.events;
        if (me.listeners) {
            me.on(me.listeners);
            delete me.listeners;
        }
        me.events = e || {};
    };

    /**
     *  1 数据保护
     *  2 事件冒泡
     *  3 事件挂起
     * @type {Object}
     */
    XUTUTIL.Observable.prototype = {

        // private
        filterOptRe:/^(?:scope|delay|buff6er|single)$/,

        fireEvent:function () {
            var a = Array.prototype.slice.call(arguments, 0),
                ename = a[0].toLowerCase(),
                me = this,
                ret = TRUE,
                ce = me.events[ename],
                cc,
                q,
                c;

            if (me.eventsSuspended === TRUE) {
                if (q = me.eventQueue) {
                    q.push(a);
                }
            }
            else if (typeof ce == 'object') {
                if (ce.bubble) {
                    if (ce.fire.apply(ce, a.slice(1)) === FALSE) {
                        return FALSE;
                    }
                    c = me.getBubbleTarget && me.getBubbleTarget();
                    if (c && c.enableBubble) {
                        cc = c.events[ename];
                        if (!cc || typeof cc != 'object' || !cc.bubble) {
                            c.enableBubble(ename);
                        }
                        return c.fireEvent.apply(c, a);
                    }
                }
                else {
                    a.shift();
                    ret = ce.fire.apply(ce, a);
                }
            }
            return ret;
        },

        /**
         * 加入一个事件处理函数
         * @param {String}   事件处理函数的名称
         * @param {Function} 事件处理函数
         * @param {Object}  （可选的） 事件处理函数执行时所在的作用域。处理函数“this”的上下文
         *
         *  eventName 是对象形式，递归分解
         *  events    保存所有事件对象
         */
        addListener:function (eventName, fn, scope, o) {
            var me = this,
                e,
                oe,
                localEvent;

            //分解元素
            if (typeof eventName == 'object') {
                o = eventName;
                for (e in o) {
                    oe = o[e];
                    if (!me.filterOptRe.test(e)) {
                        me.addListener(e, oe.fn || oe, oe.scope || o.scope, oe.fn ? oe : o);
                    }
                }
            } else {
                //创建
                eventName = eventName.toLowerCase();
                localEvent = me.events[eventName] || TRUE;
                //第一次添加,创建Event对象
                if (typeof localEvent == 'boolean') {
                    me.events[eventName] = localEvent = new XUTUTIL.Event(me, eventName);
                }
                localEvent.addListener(fn, scope, typeof o == 'object' ? o : {});
            }
        },

        /**
         * 移除侦听器
         * @param eventName   侦听事件的类型
         * @param fn          移除的处理函数
         * @param scope       处理函数之作用域
         */
        removeListener:function (eventName, fn, scope) {
            var localEvent = this.events[eventName.toLowerCase()];
            if (typeof localEvent == 'object') {
                localEvent.removeListener(fn, scope);
            }
        },

        /**
         * 从这个对象身上移除所有的侦听器
         */
        purgeListeners:function () {
            var events = this.events,
                evt,
                key;
            for (key in events) {
                evt = events[key];
                if (typeof evt == 'object') {
                    evt.clearListeners();
                }
            }
        },

        /**
         * 定义多个观察者的事件
         * @param o
         * 事件保存events集合
         *   1 传入的是多个字符串形式
         *   2 单个
         */
        addEvents:function (o) {
            var me = this;
            me.events = me.events || {};
            if (typeof o == 'string') {
                var a = arguments,
                    i = a.length;
                while (i--) {
                    me.events[a[i]] = me.events[a[i]] || TRUE;
                }
            } else {
                Xut.applyIf(me.events, o);
            }
        },

        /**
         * 检测当前对象是否有指定的事件
         * @param eventName
         * @return {Boolean}
         */
        hasListener:function (eventName) {
            var e = this.events[eventName.toLowerCase()];
            return typeof e == 'object' && e.listeners.length > 0;
        },

        /**
         * 挂起所有事件
         * 暂停所有事件
         * @param queueSuspended
         */
        suspendEvents:function (queueSuspended) {
            this.eventsSuspended = TRUE;
            if (queueSuspended && !this.eventQueue) {
                this.eventQueue = [];
            }
        },

        /**
         * 恢复所有事件
         */
        resumeEvents:function () {
            var me = this,
                queued = me.eventQueue || [];
            me.eventsSuspended = FALSE;
            delete me.eventQueue;
            EACH(queued, function (e) {
                me.fireEvent.apply(me, e);
            });
        }
    };

    var OBSERVABLE = XUTUTIL.Observable.prototype;

    //别名
    OBSERVABLE.on = OBSERVABLE.addListener;
    OBSERVABLE.un = OBSERVABLE.removeListener;

    /**
     * 释放拦截
     * Observable身上移除所有已加入的捕捉captures
     * @param {Observable}
     * @static
     */
    XUTUTIL.Observable.releaseCapture = function (o) {
        o.fireEvent = OBSERVABLE.fireEvent;
    };

    function createTargeted(h, o, scope) {
        return function () {
            if (o.target == arguments[0]) {
                h.apply(scope, Array.prototype.slice.call(arguments, 0));
            }
        };
    };

    function createBuffered(h, o, l, scope) {
        l.task = new XUTUTIL.DelayedTask();
        return function () {
            l.task.delay(o.buffer, h, scope, Array.prototype.slice.call(arguments, 0));
        };
    };

    function createSingle(h, e, fn, scope) {
        return function () {
            e.removeListener(fn, scope);
            return h.apply(scope, arguments);
        };
    };

    function createDelayed(h, o, l, scope) {
        return function () {
            var task = new XUTUTIL.DelayedTask(),
                args = Array.prototype.slice.call(arguments, 0);
            if (!l.tasks) {
                l.tasks = [];
            }
            l.tasks.push(task);
            task.delay(o.delay || 10, function () {
                l.tasks.remove(task);
                h.apply(scope, args);
            }, scope);
        };
    };

    //========================== 事件内部处理==============================
    //
    //    采用对象存储事件
    //    listeners 数组维护监听函数的引用
    //    维护自己内部状态
    //====================================================================

    XUTUTIL.Event = function (obj, name) {
        this.name = name;
        this.obj = obj;
        this.listeners = [];
    };

    XUTUTIL.Event.prototype = {

        //=======================================新增=========================================

        /**
         * 内部增加元素监听
         * @param fn
         * @param scope
         * @param options
         * 处理了同步操作多个数据迭代的问题
         * 如果正在触发事件,则拷贝副本
         */
        addListener:function (fn, scope, options) {
            var that = this, l;
            scope = scope || that.obj;
            if (!that.isListening(fn, scope)) {
                l = that.createListener(fn, scope, options);
                if (that.firing) {
                    that.listeners = that.listeners.slice(0);
                }
                that.listeners.push(l);
            }
        },

        createListener:function (fn, scope, o) {
            o = o || {};
            scope = scope || this.obj;
            var l = {
                fn:fn,
                scope:scope,
                options:o
            }, h = fn;
            if (o.target) {
                h = createTargeted(h, o, scope);
            }
            if (o.delay) {
                h = createDelayed(h, o, l, scope);
            }
            if (o.single) {
                h = createSingle(h, this, fn, scope);
            }
            if (o.buffer) {
                h = createBuffered(h, o, l, scope);
            }
            l.fireFn = h;
            return l;
        },

        findListener:function (fn, scope) {
            var list = this.listeners,
                i = list.length,
                l;

            scope = scope || this.obj;
            while (i--) {
                l = list[i];
                if (l) {
                    if (l.fn == fn && l.scope == scope) {
                        return i;
                    }
                }
            }
            return -1;
        },

        isListening:function (fn, scope) {
            return this.findListener(fn, scope) != -1;
        },

        //========================================移除==================================

        /**
         * 内部处理,移除监听器
         * @param fn
         * @param scope
         * @return {Boolean}
         */
        removeListener:function (fn, scope) {
            var index,
                l,
                k,
                me = this,
                ret = FALSE;

            //数组操作保护机,事件正在触发，制作副本
            //删除时，如果有任务在进行，则强行停止
            if ((index = me.findListener(fn, scope)) != -1) {
                if (me.firing) {
                    me.listeners = me.listeners.slice(0);
                }
                l = me.listeners[index];
                if (l.task) {
                    l.task.cancel();
                    delete l.task;
                }
                k = l.tasks && l.tasks.length;
                if (k) {
                    while (k--) {
                        l.tasks[k].cancel();
                    }
                    delete l.tasks;
                }
                me.listeners.splice(index, 1);
                ret = TRUE;
            }
            return ret;
        },

        // Iterate to stop any buffered/delayed events
        clearListeners:function () {
            var me = this,
                l = me.listeners,
                i = l.length;
            while (i--) {
                me.removeListener(l[i].fn, l[i].scope);
            }
        },

        fire:function () {
            var me = this,
                listeners = me.listeners,
                len = listeners.length,
                i = 0,
                l;

            if (len > 0) {
                me.firing = TRUE;
                var args = Array.prototype.slice.call(arguments, 0);
                for (; i < len; i++) {
                    l = listeners[i];
                    if(l){
                      var fFn = l.fireFn.apply(l.scope || me.obj || window, args);
                      if (fFn === FALSE) {
                        return (me.firing = FALSE);
                      }else{
                        return fFn;
                      }
                    }
                }
            }
            me.firing = FALSE;
            return TRUE;
        }

    };
})();
