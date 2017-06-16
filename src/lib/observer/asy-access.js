import { Observer } from './index'

/**
 *  异步存取器
 *  用于异步任务创建
 *  转化同步处理的一个类
 */

export class AsyAccess extends Observer {

  constructor() {
    super()
    this.asys = []
  }

  /**
   * 只接受函数类型
   * @param  {Function} fn [description]
   * @return {[type]}      [description]
   */
  create(fn) {
    if (fn && typeof fn === 'function') {
      this.asys.push(fn)
    }
  }

  /**
   * 执行
   * @return {[type]} [description]
   */
  exec() {
    if (this.asys.length) {
      const next = () => {
        if (this.asys.length) {
          const asy = this.asys.shift()
          asy(next)
        } else {
          this.$$emit('complete')
        }
      }
      next()
    }
    return this
  }

}
