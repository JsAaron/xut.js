/**
 *  对外接口
 *  1 开始调用任务
 *  2 调用自动运行任务
 *  3 设置中断
 *  4 取消中断设置
 */

export default function(baseProto) {

    /**
     * 开始调用任务
     * dispatch=>index=>create=>startThreadTask
     * @return {[type]} [description]
     */
    baseProto.startThreadTask = function(flipOver, callback) {

        //制作回调
        //如果是快速翻页,立刻调用
        //构建container调用preforkComplete
        this.createRelated.preforkComplete = (() => {
            return () => {
                //1 滑动允许打断创建
                //
                //swich
                //2 所有继续分解任务
                flipOver ? callback() : this._checkTasksCreate(callback, this)
            }
        })()

        //继续构建任务
        this.dispatchTasks()
    }


    /**
     * 任务调度
     * @return {[type]} [description]
     */
    baseProto.dispatchTasks = function() {
        let threadtasks
        if (threadtasks = this.threadtasks[this.createRelated.nextRunTask]) {
            threadtasks()
        }
    }


    /**
     * 检测任务是否完成
     * page => autoRun中需要保证任务完成后才能执行
     * 快速翻页中遇到
     * actTasksCallback 活动任务完成
     * @return {[type]} [description]
     */
    baseProto.checkThreadTask = function(actTasksCallback) {
        this.isAutoRun = true;
        this._checkTasksCreate(() => {
            this.isAutoRun = false
            actTasksCallback()
        })
    }


    /**
     * 开始执行下一个线程任务,检测是否中断
     * outSuspendTasks,
     * outNextTasks
     * taskName
     * @return {[type]} [description]
     */
    baseProto.nextTasks = function(callback) {
        this._asyTasks({
            suspendCallback() {
                callback.outSuspendTasks && callback.outSuspendTasks()
            },
            nextTaskCallback() {
                callback.outNextTasks && callback.outNextTasks()
            }
        }, callback.interrupt)
    }



    /**
     * 设置任务中断
     */
    baseProto.setTaskSuspend = function() {
        this.isAutoRun = false;
        this.canvasRelated.isTaskSuspend = true;
        this.createRelated.preCreateTasks = false;
        this.createRelated.tasksHang = null;
    }


    /**
     * 后台预创建任务
     * @param  {[type]} tasksTimer [时间间隔]
     * @return {[type]}            [description]
     */
    baseProto.createPreforkTasks = function(callback, isPreCreate) {
        var self = this;
        //2个预创建间隔太短
        //背景预创建还在进行中，先挂起来等待
        if (this.createRelated.preCreateTasks) {
            this.createRelated.tasksHang = function(callback) {
                return function() {
                    self._checkTasksCreate(callback);
                }
            }(callback);
            return;
        }

        /**
         * 翻页完毕后
         * 预创建背景
         */
        if (isPreCreate) {
            this.createRelated.preCreateTasks = true;
        }

        this._checkTasksCreate(callback);
    }


    /**
     * 自动运行：检测是否需要开始创建任务
     * 1 如果任务全部完成了毕
     * 2 如果有中断任务,就需要继续创建未完成的任务
     * 3 如果任务未中断,还在继续创建
     * currtask 是否为当前任务，加速创建
     */
    baseProto._checkTasksCreate = function(callback, context) {

        //如果任务全部完成
        if (this.createRelated.nextRunTask === 'complete') {
            return callback.call(context)
        }

        var self = this;

        //开始构未完成的任务
        this._cancelTaskSuspend();

        //完毕回调
        this.createRelated.createTasksComplete = function() {
            callback.call(context)
        };

        //派发任务
        this.nextTasks({
            outNextTasks() {
                self.dispatchTasks();
            }
        });
    }


    /**
     * 取消任务中断
     * @return {[type]} [description]
     */
    baseProto._cancelTaskSuspend = function() {
        this.canvasRelated.isTaskSuspend = false
    }


    /**
     * 检测任务是否需要中断
     * @return {[type]} [description]
     */
    baseProto._checkTaskSuspend = function() {
        return this.canvasRelated.isTaskSuspend;
    }


    /**
     * 多线程检测
     * @return {[type]} [description]
     */
    baseProto._multithreadCheck = function(callbacks, interrupt) {

        const check = () => {
            if (this._checkTaskSuspend()) {
                this.tasksTimeOutId && clearTimeout(this.tasksTimeOutId)
                callbacks.suspendCallback.call(this);
            } else {
                callbacks.nextTaskCallback.call(this);
            }
        }

        const next = () => {
            this.tasksTimeOutId = setTimeout(() => {
                check();
            }, this.canvasRelated.tasksTimer);
        }

        //自动运行页面构建
        if (this.isAutoRun) {
            //自动运行content中断检测 打断一次
            if (interrupt) {
                next();
            } else {
                check();
            }
        } else {
            //后台构建
            next();
        }
    }


    /**
     * 任务队列挂起
     * nextTaskCallback 成功回调
     * suspendCallback  中断回调
     * @return {[type]} [description]
     */
    baseProto._asyTasks = function(callbacks, interrupt) {

        //如果关闭多线程,不检测任务调度
        if (!this.isMultithread) {
            return callbacks.nextTaskCallback.call(this);
        }

        //多线程检测
        this._multithreadCheck(callbacks, interrupt)
    }

}
