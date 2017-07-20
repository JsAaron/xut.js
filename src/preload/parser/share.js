/**
 * 创建共享对象
 * 这里是为了限制对象的创建数
 * 优化
 *
 * @param  {[type]} total [description]
 * @return {[type]}       [description]
 */

export class Share {

  constructor(name) {
    this.state = 'init'
    this.cache = []
  }

  add(object) {
    this.cache.push(object)
  }

  get() {

    if (this.cache.length) {
      return this.cache.shift()
    }
  }

  destory() {
    for (let i = 0; i < this.cache.length; i++) {
      if (this.cache[i]) {
        this.cache[i].src = null;
        this.cache[i].removeAttribute("src")
        this.cache[i] = null
      }
    }
  }

}
