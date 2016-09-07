/****************************************************************
 *
 *                     对外接口
 *
 *               1 开始调用任务
 *               2 调用自动运行任务
 *               3 设置中断
 *               4 取消中断设置
 *
 * **************************************************************/

export default function(baseProto) {

	/**
	 * 开始调用任务
	 * @return {[type]} [description]
	 */
	baseProto.startThreadTask = function(flipOver, callback) {

		//制作回调
		//如果是快速翻页,立刻调用
		this.createRelated.preforkComplete = function(context) {
			return function() {
				//滑动允许打断创建
				flipOver ? callback() :
					//所有继续分解任务
					context.checkTasksCreate(function() {
						callback();
					})
			}
		}(this);

		//继续构建任务
		this.dispatchTasks();
	}

	/**
	 * 检测任务是否完成
	 * actTasksCallback 活动任务完成
	 * @return {[type]} [description]
	 */
	baseProto.checkThreadTask = function(actTasksCallback) {
		var self = this;
		this.isAutoRun = true;
		this.checkTasksCreate(function() {
			self.isAutoRun = false;
			actTasksCallback();
		})
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
					self.checkTasksCreate(callback);
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

		this.checkTasksCreate(callback);
	}

	/**
	 * 自动运行：检测是否需要开始创建任务
	 * 1 如果任务全部完成了毕
	 * 2 如果有中断任务,就需要继续创建未完成的任务
	 * 3 如果任务未中断,还在继续创建
	 * currtask 是否为当前任务，加速创建
	 */
	baseProto.checkTasksCreate = function(callback, context) {

		//如果任务全部完成
		if (this.createRelated.nextRunTask === 'complete') {
			return callback.call(context);
		}

		var self = this;

		//开始构未完成的任务
		this.cancelTaskSuspend();

		//完毕回调
		this.createRelated.createTasksComplete = function() {
			callback.call(context)
		};

		//派发任务
		this.nextTasks({
			outNextTasks: function() {
				self.dispatchTasks();
			}
		});
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
	 * 取消任务中断
	 * @return {[type]} [description]
	 */
	baseProto.cancelTaskSuspend = function() {
		this.canvasRelated.isTaskSuspend = false
	}

	/**
	 * 检测任务是否需要中断
	 * @return {[type]} [description]
	 */
	baseProto.checkTaskSuspend = function() {
		return this.canvasRelated.isTaskSuspend;
	}


	/**
	 * 多线程检测
	 * @return {[type]} [description]
	 */
	baseProto.multithreadCheck = function(callbacks, interrupt) {
		//多线程检测
		var self = this;

		function check() {
			if (self.checkTaskSuspend()) {
				self.tasksTimeOutId && clearTimeout(self.tasksTimeOutId)
				callbacks.suspendCallback.call(self);
			} else {
				callbacks.nextTaskCallback.call(self);
			}
		}

		function next() {
			self.tasksTimeOutId = setTimeout(function() {
				check();
			}, self.canvasRelated.tasksTimer);
		}

		//自动运行页面构建
		if (self.isAutoRun) {
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
	baseProto.asyTasks = function(callbacks, interrupt) {

		//如果关闭多线程,不检测任务调度
		if (!this.isMultithread) {
			return callbacks.nextTaskCallback.call(this);
		}

		//多线程检测
		this.multithreadCheck(callbacks, interrupt)
	}

	/**
	 * 开始执行下一个线程任务,检测是否中断
	 * outSuspendTasks,
	 * outNextTasks
	 * taskName
	 * @return {[type]} [description]
	 */
	baseProto.nextTasks = function(callback) {
		var outSuspendTasks,
			outNextTasks,
			taskName;

		this.asyTasks({
			suspendCallback: function() {
				// console.log('@@@@@@@@@@中断创建任务 ' + callback.taskName + ' @@@@@@@@@@@', this.pid + 1, this.element)
				if (outSuspendTasks = callback.outSuspendTasks) {
					outSuspendTasks();
				}
			},
			nextTaskCallback: function() {
				if (outNextTasks = callback.outNextTasks) {
					outNextTasks();
				}
			}
		}, callback.interrupt)
	}


	/**
	 * 任务调度
	 * @return {[type]} [description]
	 */
	baseProto.dispatchTasks = function() {
		var tasks;
		if (tasks = this.tasks[this.createRelated.nextRunTask]) {
			tasks();
		}
	}
}