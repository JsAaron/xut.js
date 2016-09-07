/**
 * 构建模块任务对象
 * taskCallback 每个模块任务完毕后的回调
 * 用于继续往下个任务构建
 */
export default function(baseProto) {

	/**
	 * 对象实例内部构建
	 * @return {[type]} [description]
	 */
	baseProto.checkInstanceTasks = function (taskName) {
		var tasksObj;
		if (tasksObj = this.createRelated.cacheTasks[taskName]) {
			tasksObj.runSuspendTasks();
			return true;
		}
	}


	/**
	 * 获取页面数据
	 * @return {[type]} [description]
	 */
	baseProto.baseData = function () {
		return this.dataCache[this.pageType];
	}


	/**
	 * 获取热点数据信息
	 * @return {[type]} [description]
	 */
	baseProto.baseActivits = function () {
		return this.dataCache['activitys'];
	}


	/**
	 * 获取自动运行数据
	 * @return {[type]} [description]
	 */
	baseProto.baseAutoRun = function () {
		var autoRunDas = this.dataCache['autoRunDas'];
		return autoRunDas && autoRunDas;
	}


	/**
	 * 获取chapterid
	 * @param  {[type]} pid [description]
	 * @return {[type]}     [description]
	 */
	baseProto.baseGetPageId = function (pid) {
		return this.baseData(pid)['_id'];
	}


	/**
	 * 找到对象的content对象
	 * @param  {[type]}   contentId [description]
	 * @param  {Function} callback  [description]
	 * @return {[type]}             [description]
	 */
	baseProto.baseGetContentObject = function (contentId) {
		var contentsObj;
		if (contentsObj = this._contentsCollector[contentId]) {
			return contentsObj;
		} else {
			//查找浮动母版
			return this.floatContents.Master[contentId];
		}
	}


	/**
	 * Xut.Content.show/hide 针对互斥效果增加接口
	 * 扩充，显示，隐藏，动画控制接口
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	baseProto.baseContentMutex = function (contentId, type) {
		var contentObj,
			base = this;
		if (contentObj = base.baseGetContentObject(contentId)) {

			var element = contentObj.$contentProcess.view
				? contentObj.$contentProcess.view
				: contentObj.$contentProcess

			var handle = {
				'Show': function () {
					if (contentObj.type === 'dom') {
						element.css({
							'display': 'blcok',
							'visibility': 'visible'
						}).prop("mutex", false);
					} else {
						element.visible = true;
						console.log('show')

					}
				},
				'Hide': function () {
					if (contentObj.type === 'dom') {
						element.css({
							'display': 'none',
							'visibility': 'hidden'
						}).prop("mutex", true);
					} else {
						console.log('hide')
						element.visible = false;
					}
				},
				'StopAnim': function () {
					contentObj.stopAnims && contentObj.stopAnims();
				}
			}
			handle[type]()
		}
	}


	//content接口
	_.each([
		"Get",
		"Specified"
	], function (type) {
		baseProto['base' + type + 'Content'] = function (data) {
			switch (type) {
				case 'Get':
					return this._abActivitys.get();
				case 'Specified':
					return this._abActivitys.specified(data);
			}
		}
	})

	//components零件类型处理
	//baseGetComponent
	//baseRemoveComponent
	//baseRegisterComponent
	//baseSpecifiedComponent
	_.each([
		"Get",
		"Remove",
		"Register",
		"Specified"
	], function (type) {
		baseProto['base' + type + 'Component'] = function (data) {
			switch (type) {
				case 'Register':
					return this._components.register(data);
				case 'Get':
					return this._components.get();
				case 'Specified':
					return this._components.specified(data);
				case 'Remove':
					return this._components.remove();
			}
		}
	})


	/**
	 *  运行辅助对象事件
	 * @param  {[type]} activityId  [description]
	 * @param  {[type]} outCallBack [description]
	 * @param  {[type]} actionName  [description]
	 * @return {[type]}             [description]
	 */
	baseProto.baseAssistRun = function (activityId, outCallBack, actionName) {
		var activity;
		if (activity = this._abActivitys) {
			_.each(activity.get(), function (contentObj, index) {
				if (activityId == contentObj.activityId) {
					if (actionName == 'Run') {
						contentObj.runEffects(outCallBack, true);
					}
					if (actionName == 'Stop') {
						contentObj.stopEffects(outCallBack);
					}
				}
			}, this);
		}
	}

}