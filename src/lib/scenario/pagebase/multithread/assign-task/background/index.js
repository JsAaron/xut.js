import TaskSuper from '../task-super'
import { readFile, replacePath } from '../../../../../util/option'
import createBackground from './layout'

/**
 * 解析背景内容
 */
const parseContent = function(content, callback) {
  //背景是svg文件
  if (/.svg$/i.test(content)) {
    readFile(content, function(svgContent) {
      callback(svgContent);
    });
  } else {
    callback('');
  }
}

/**
 * 构建背景类
 * @param {[type]} $containsNode         [根节点]
 * @param {[type]} data                 [数据]
 * @param {[type]} suspendCallback      [中断回调]
 * @param {[type]} successCallback      [description]
 */
export default class TaskBackground extends TaskSuper {

  constructor(data, $containsNode, suspend, success) {

    super()

    const self = this
    const content = data.md5

    this.suspend = suspend
    this.success = success

    //iboosk节点预编译
    //在执行的时候节点已经存在
    //不需要在创建
    if (Xut.IBooks.runMode()) {
      //找到背景节点
      // var $element = $containsNode.find('.multilayer');
      success()
      return;
    }

    //背景是否需要SVG解析
    parseContent(content, function(svgContent) {
      svgContent = replacePath(svgContent)
      const htmlstr = createBackground(svgContent, data)
      if (htmlstr) {
        svgContent = null
        self._suspendCompile($(htmlstr), $containsNode)
      } else {
        success()
      }
    })

  }


  clearReference() {}


  /**
   * 构建中断函数
   * @param  {[type]} $background [description]
   * @return {[type]}             [description]
   */
  _suspendCompile($background, $containsNode) {

    const self = this;

    //继续执行
    const nextTasks = function() {
      Xut.nextTick({
        'container': $containsNode,
        'content': $background
      }, function() {
        self.clearReference()
        self.success()
      });
    }

    //中断方法
    const suspendTasks = function() {
      self.suspendQueues = [];
      self.suspendQueues.push(function() {
        nextTasks()
      })
    }

    self.suspend(nextTasks, suspendTasks);
  }

  /**
   * 运行被阻断的线程任务
   * @return {[type]} [description]
   */
  runSuspendTasks() {
    if (this.suspendQueues) {
      var fn;
      if (fn = this.suspendQueues.pop()) {
        fn();
      }
      this.suspendQueues = null;
    }
  }

}
