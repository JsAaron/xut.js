import TaskSuper from '../super/index'
import { readFileContent, replacePath } from '../../../../../util/index'
import createBackground from './layout'

/**
 * 解析背景内容
 */
const parseContent = function (content, callback) {
  //背景是svg文件
  if (/.svg$/i.test(content)) {
    readFileContent(content, function (svgContent) {
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

  constructor(data, $containsNode, success, detector) {

    super(detector)

    const self = this
    const content = data.md5

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
    parseContent(content, function (svgContent) {
      svgContent = replacePath(svgContent)
      const htmlstr = createBackground(svgContent, data)
      if (htmlstr) {
        svgContent = null
        self._checkNextTask($(htmlstr), $containsNode)
      } else {
        success()
      }
    })
  }

  /**
   * 检测下一个任务
   */
  _checkNextTask($background, $containsNode) {
    this._$$checkNextTask('内部background', () => {
      this._render($background, $containsNode)
    })
  }

  /*渲染页面*/
  _render(content, container) {
    Xut.nextTick({ content, container }, () => {
      this.destroy()
      this.success()
    });
  }


}
