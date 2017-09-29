/////////////////////////////////////////////////////////////////////
///  探测资源的正确性
///
///  1. 通过每个parser自己去请求缓存成功
///  2. 如果parser的第一次请求时间大于2秒，那么主动就默认返回失败
///  3. 失败文件就会走loop队列
///
/////////////////////////////////////////////////////////////////////

export class Detect {

  /**
   * [constructor description]
   * @param  {[type]} parser   [解析器]
   * @param  {[type]} filePath [路径]
   * @return {[type]}          [description]
   */
  constructor(parser, filePath) {
    this.state = false
    this.timer = null
    this.parser = parser
    this.filePath = filePath
  }

  /**
   * 销毁检测对象
   * 如果parser解析完毕后，主动调用销毁接口
   * 1 audio
   */
  _clearDownload() {
    if (this._downObj) {
      this._downObj.destory && this._downObj.destory()
      this._downObj = null
    }
  }

  /**
   * 开始通过API下载文件
   * @return {[type]} [description]
   */
  _downloadFile() {
    this._downObj = this.parser(this.filePath, () => {
      this.state = true;
      this.callback && this.callback()
    })
  }


  /**
   * 清理定时器
   * @return {[type]} [description]
   */
  _clearWatcher() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  /**
   * 创建主动监听
   * @return {[type]} [description]
   */
  _createWather(time) {
    if (!this.state) {
      this.timer = setTimeout(() => {
        this.callback && this.callback()
      }, time);
    }
  }

  /**
   * 创建退出函数
   * @return {[type]} [description]
   */
  _createExitFn(fn) {
    this.callback = () => {
      this._clearWatcher(); //清理主动观察
      this.callback = null
      fn(this.state)
    }
  }

  /////////////////////////////////////
  ///
  ///          对外接口
  ///
  /////////////////////////////////////

  /**
   * 开始下载
   * @param  {[type]}   checkTime [主动检测时间]
   * @param  {Function} fn        [不管成功或者失败都会调用]
   * @return {[type]}             [description]
   */
  start(checkTime, fn) {

    this._createExitFn(fn)

    /*开始下载*/
    this._downloadFile()

    /**
     * 主动监听
     * 如果在主动观察指定的时间内自动下载没有完毕
     * 那么主动就会被调用，这个detect对象就会走循环队列
     * 执行reset长轮询
     */
    this._createWather(checkTime)
  }

  /**
   * 重设检测
   * 1 在第一次检测失败后
   * 2 循环队列中开始重复检测
   * @return {[type]} [description]
   */
  reset(checkTime, fn) {

    this._createExitFn(fn)

    // 开始新的主动检测最长12秒
    this._createWather(checkTime)
  }

  /**
   * 销毁
   * @return {[type]} [description]
   */
  destory() {
    this._clearDownload()
    this._clearWatcher()
    this.callback = null
    this.parse = null
  }
}
