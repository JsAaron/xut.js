import { destroy as _destroy } from '../depend/multievent'
import { unWatchColumn } from '../watch'
import { clearRepairImage } from 'repair/image'
import { cleanImage } from '../../../util/option'

export default function(baseProto) {

  /**
   * 销毁页面对象
   * @return {[type]} [description]
   */
  baseProto.baseDestroy = function() {

    /**
     * 2017.6.26
     * 销毁图片apng
     * 一次性的apng图片，必须要清理src
     * 否则重复不生效，因为缓存的关系
     */
    cleanImage(this.$pageNode)

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

    /**
     * 清理可能错误的img修复文件列表
     */
    clearRepairImage(this.chapterIndex)

    //清理多线程任务块
    const taskGroup = this.threadTaskRelated.assignTaskGroup
    if (taskGroup) {
      for (let key in taskGroup) {
        let task = taskGroup[key]
        if (task) {
          task.destroy && task.destroy()
        }
      }
    }

    //浮动对象
    const floatMaterContents = this.floatGroup.masterGroup

    //是否有浮动对象
    const hasFloatMater = !_.isEmpty(floatMaterContents);

    //清理activity类型对象
    const activitys = this.activityGroup.get()
    if (activitys && activitys.length) {
      activitys.forEach(activityObj => {
        activityObj.destroy(destroyObj => {
          //如果不是浮动对象,清理元素引用
          if (!hasFloatMater || destroyObj && !floatMaterContents[destroyObj.id]) {
            destroyObj.$contentNode = null;
          }
        });
      })
    }

    //清除母版浮动容器
    if (hasFloatMater && this.floatGroup.masterContainer) {
      this.floatGroup.masterContainer.remove();
    }

    //清除浮动页面对象
    if (this.floatGroup.pageGroup && this.floatGroup.pageContainer) {
      this.floatGroup.pageContainer.remove();
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
