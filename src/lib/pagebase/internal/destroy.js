import { destroy as _destroy } from '../depend/multievent'

export default function(baseProto) {

    /**
     * 销毁页面对象
     * @return {[type]} [description]
     */
    baseProto.baseDestroy = function() {

        //清理图片缓存
        //读库快速退出模式下报错修正
        try {
            this.$pageNode.hide().find('img').each(function(aaa, img) {
                img.src = 'images/icons/clearmem.png'
            })
        } catch (e) {
            console.log('销毁图片出错')
        }


        //2016/9/30
        //销毁缩放动作
        if(this._pinchObj){
            this._pinchObj.destroy()
        }

        //流式布局对象
        //2016.9.10
        const _flows = this._flows.get()
        if (_flows.length) {
            _flows.forEach(flowObj => {
                flowObj.destroy()
                flowObj = null
            })
            this._flows = null
        }


        //清理线程任务块
        let cacheTasks, key, tasks;
        if (cacheTasks = this.createRelated.cacheTasks) {
            for (key in cacheTasks) {
                if (tasks = cacheTasks[key]) {
                    tasks.clearReference();
                }
            }
        }

        //浮动对象
        const floatMaterContents = this.floatContents.Master

        //是否有浮动对象
        const hasFloatMater = !_.isEmpty(floatMaterContents);

        //清理content类型对象
        let contents
        if (contents = this._abActivitys.get()) {
            contents.forEach(contentObj => {
                contentObj.destroy(destroyObj => {
                    //如果不是浮动对象,清理元素引用
                    if (!hasFloatMater || destroyObj && !floatMaterContents[destroyObj.id]) {
                        destroyObj.$contentNode = null;
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
        let _components;
        if ((_components = this.baseGetComponent())) {
            _components.length && _components.forEach(componentObj => {
                componentObj.destroy && componentObj.destroy();
            })
        }

        //多事件销毁
        _destroy(this);

        //伪li节点
        if (this.$pseudoElement) {
            this.$pseudoElement = null;
        }

        //移除li容器节点节点
        this.$pageNode.remove();
        this.$rootNode = null;
        this.$pageNode = null;
    }

}
