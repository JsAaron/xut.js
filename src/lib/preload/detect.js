///////////////////////
///  探测资源的正确性
///////////////////////
import { $warn } from '../util/index'

export class Detect {

  constructor({
    parser,
    filePath,
    checkTime = 2000 //默认12秒 最大检测事件
  }) {
    this.state = false
    this.timer = null
    this.parser = parser
    this.filePath = filePath
    this.checkTime = checkTime
  }

  /**
   * 清理
   * @return {[type]} [description]
   */
  _clear() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  /**
   * 开始轮询，最多2次
   * @return {[type]} [description]
   */
  _request() {
    this.parser(this.filePath, () => {
      this.state = true
      this._clear()
        // $warn(`文件循环加载成功 ${this.filePath}`)
      this.callback(this.state)
    })
  }

  /**
   * 主动监听
   * 如果parser同步加载完毕了，那么这里不执行了
   * 这里会递归检测循环loopTime的指定次数
   * 如果parse在这loop没完成就强制退出
   * @return {[type]} [description]
   */
  _active() {
    if (!this.state) {
      this.timer = setTimeout(() => {
        this._clear();
        if (this.state) {
          // $warn(`文件加载成功 ${this.filePath}`)
        } else {
          $warn(`文件加载失败 ${this.filePath}`)
        }
        this.callback(this.state)
      }, this.checkTime);
    }
  }

  ///////////////////
  ///
  ///    对外接口
  ///
  //////////////////

  /**
   * 开始执行，主动完成，与被动监听
   * callback //不管是失败或者成功都会调用，为了销毁对象的引用
   * @return {[type]} [description]
   */
  start(callback) {
    this.callback = callback
    this._request()
    this._active()
  }


  /**
   * 销毁
   * @return {[type]} [description]
   */
  destory() {
    this.clear()
    this.callback = function () {}
    this.parse = null
  }
}
