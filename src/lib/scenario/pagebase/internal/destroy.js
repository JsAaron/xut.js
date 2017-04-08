import { destroy as _destroy } from '../depend/multievent'
import { unWatchColumn } from '../watch'

export default function(baseProto) {

  /**
   * 销毁页面对象
   * @return {[type]} [description]
   */
  baseProto.baseDestroy = function() {
    // console.log(this)
    // //清理图片缓存
    // //读库快速退出模式下报错修正
    // try {
    //     this.$pageNode.hide().find('img').each(function(aaa, img) {
    //         img.src = 'images/icons/clearmem.png'
    //     })
    // } catch (e) {
    //     console.log('销毁图片出错')
    // }

    //最后一页动作处理
    //for miaomiaoxue
    this.destroyPageAction()

    //2016/9/30
    //页面缩放对象
    if (this._pageScaleObj) {
      this._pageScaleObj.destroy()
      this._pageScaleObj = null
    }

    //流式布局对象
    //2016.9.10
    const columns = this.columnGroup.get()
    if (columns && columns.length) {
      columns.forEach(flowObj => {
        flowObj.destroy()
      })
    }


    //清理线程任务块
    let cacheTasks, key, tasks;
    if (cacheTasks = this.createRelated.cacheTasks) {
      for (key in cacheTasks) {
        if (tasks = cacheTasks[key]) {
          tasks.clearReference && tasks.clearReference();
        }
      }
    }

    //浮动对象
    const floatMaterContents = this.floatContentGroup.masterGroup

    //是否有浮动对象
    const hasFloatMater = !_.isEmpty(floatMaterContents);

    //清理content类型对象
    const contents = this.activityGroup.get()
    if (contents && contents.length) {
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
    if (hasFloatMater && this.floatContentGroup.masterContainer) {
      this.floatContentGroup.masterContainer.remove();
    }

    //清除浮动页面对象
    if (this.floatContentGroup.pageGroup && this.floatContentGroup.pageContainer) {
      this.floatContentGroup.pageContainer.remove();
    }

    //清理零件类型对象
    const components = this.baseGetComponent()
    if (components && components.length) {
      components.forEach(obj => {
        obj.destroy && obj.destroy();
      })
    }

    //多事件销毁
    _destroy(this);

    //伪li节点
    if (this.$pseudoElement) {
      this.$pseudoElement = null;
    }

    unWatchColumn(this)

    //移除li容器节点节点
    this.$pageNode.remove();
    this.rootNode = null;
    this.$pageNode = null;
  }

}
