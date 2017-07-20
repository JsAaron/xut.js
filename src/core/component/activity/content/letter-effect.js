/*****************
 文字特效
 https://tympanus.net/codrops/2016/10/18/inspiration-for-letter-effects/
******************/

export class LetterEffect {

  /**
   * 文本节点
   * 编号
   * @param  {[type]} node   [description]
   * @param  {[type]} serial [description]
   * @return {[type]}        [description]
   */
  constructor(contentId) {
    this.contentId = contentId
    this.queueLength = 0
    this.queueIndex = 0
    this.fxQueue = []
  }

  /**
   * 执行队列动画
   */
  _makeFn(node, serial) {
    let text = new TextFx(node)
    return function(fn) {
      text.show('fx' + serial, fn)
    }
  }

  /**
   * 加入队列
   */
  addQueue(node, serial) {
    this.queueLength++;
    this.fxQueue.push('fx' + serial, new TextFx(node))
  }


  _animate(action) {
    let fxName = this.fxQueue[this.queueIndex]
    let fxObj = this.fxQueue[++this.queueIndex]
    if(fxName && fxObj) {
      fxObj[action](fxName, () => {
        ++this.queueIndex
        this._animate(action)
      })
    }
  }

  /**
   * 运行动画
   * @return {[type]} [description]
   */
  play() {
    this.queueIndex = 0
    this._animate('show')
  }

  /**
   * 停止动画
   * @return {[type]} [description]
   */
  stop() {

  }

  /**
   * 销毁动画
   * @return {[type]} [description]
   */
  destroy() {
    // console.log(this)
  }


}