/////////////////////////////////////////////////////////////////////
///  探测资源的正确性
///
///  1. 通过每个parser自己去请求缓存成功
///  2. 如果parser的第一次请求时间大于2秒，那么主动就默认返回失败
///  3. 失败文件就会走loop队列
///
/////////////////////////////////////////////////////////////////////
import { $warn } from '../util/index'

export class Detect {

  constructor({
    parser,
    filePath
  }) {
    this.state = false
    this.timer = null
    this.parser = parser
    this.filePath = filePath
  }

  /**
   * 清理
   * @return {[type]} [description]
   */
  _clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  /**
   * 销毁检测对象
   * 如果parser解析完毕后，主动调用销毁接口
   * 1 audio
   */
  _destoryDownload() {
    if (this.downObject) {
      this.downObject.destory && this.downObject.destory()
      this.downObject = null
    }
  }


  /**
   * 开始通过API下载文件
   * @return {[type]} [description]
   */
  _downloadFile() {
    this.downObject = this.parser(this.filePath, () => {
      this.state = true;
      this._clearTimer();
      this._destoryDownload()
      this.callback(this.state)
    })
  }


  /**
   * 创建主动监听
   * @return {[type]} [description]
   */
  _createActive(time, fn) {
    if (!this.state) {
      this.timer = setTimeout(() => {
        this._clearTimer();
        fn()
      }, time);
    }
  }



  ///////////////////
  ///
  ///    对外接口
  ///
  //////////////////

  /**
   * 重设检测
   * 1 在第一次检测失败后
   * 2 循环队列中开始重复检测
   * @return {[type]} [description]
   */
  reset({
    checkTime, //最大的循环检测时间12秒
    callback //完毕后的处理
  }) {
    /*重写回调,等待_request的执行完毕*/
    this.callback = callback

    /*开始新的主动检测最长12秒*/
    this._createActive(checkTime, () => {
      this._destoryDownload()
      this.callback()
    })
  }


  /**
   * 开始执行，主动完成，与被动监听
   * callback //不管是失败或者成功都会调用，为了销毁对象的引用
   * @return {[type]} [description]
   */
  start({
    checkTime,
    callback
  }) {
    this.callback = callback;

    /*自动检测*/
    this._downloadFile();

    /**
     * 主动监听
     * 如果parser同步加载完毕了，那么这里不执行了
     * 这里会递归检测循环loopTime的指定次数
     * 如果parse在这loop没完成就强制退出
     * @return {[type]} [description]
     */
    this._createActive(checkTime, () => {
      this.callback(this.state)
    })
  }


  /**
   * 销毁
   * @return {[type]} [description]
   */
  destory() {
    this._destoryDownload()
    this._clearTimer()
    this.callback = function(){}
    this.parse = null
  }
}
