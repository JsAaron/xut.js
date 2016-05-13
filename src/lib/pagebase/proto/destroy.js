
import { destroy as _destroy } from '../depend/multievent'

export function destroy(baseProto) {
	//销毁页面对象
	baseProto.baseDestroy = function() {

		//清理图片缓存
		//读库快速退出模式下报错修正
		try {
			this.element.hide().find('img').each(function(aaa, img) {
				img.src = 'images/icons/clearmem.png'
			})
		} catch (e) {

		}

		//清理线程任务块
		var cacheTasks, key, tasks;
		if (cacheTasks = this.createRelated.cacheTasks) {
			for (key in cacheTasks) {
				if (tasks = cacheTasks[key]) {
					tasks.clearReference();
				}
			}
		}

		//浮动对象
		var floatMaterContents = this.floatContents.Master
			//是否有浮动对象
		var hasFloatMater = !_.isEmpty(floatMaterContents);

		//清理content类型对象
		var contents;
		if (contents = this.abActivitys.get()) {
			contents.forEach(function(contentObj) {
				contentObj.destroy(function(destroyObj) {
					//如果不是浮动对象,清理元素引用
					if (!hasFloatMater || destroyObj && !floatMaterContents[destroyObj.id]) {
						destroyObj.$contentProcess = null;
					}
				});
			})
		}

		//清除母版浮动容器
		if (hasFloatMater && this.floatContents.MasterContainer) {
			this.floatContents.MasterContainer.remove();
		}

		//清除浮动页面对象
		if (this.floatContents.Page && this.floatContents.PageContainer) {
			this.floatContents.PageContainer.remove();
		}

		//清理零件类型对象
		var components;
		if ((components = this.baseGetComponent())) {
			components.length && components.forEach(function(componentObj) {
				componentObj.destroy && componentObj.destroy();
			})
		}

		//多事件销毁
		_destroy(this);

		//销毁canvas相关
		if (this.canvasRelated && this.canvasRelated.destroy) {
			this.canvasRelated.destroy();
		}

		//伪li节点
		if (this.pseudoElement) {
			this.pseudoElement = null;
		}

		//移除li容器节点节点
		this.element.remove();
		this.root = null;
		this.element = null;
	}

}