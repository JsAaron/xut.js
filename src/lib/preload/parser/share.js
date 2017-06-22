/**
 * 创建共享对象
 * 这里是为了限制对象的创建数
 * 优化
 * @param  {[type]} total [description]
 * @return {[type]}       [description]
 */

const TYPE = {
  audio() {
    return new Audio()
  },
  video() {
    return document.createElement("video")
  },
  image() {
    return new Image()
  }
}

export class Share {

  constructor(name) {
    this.name = name
    this.construct = TYPE[name]
    this.index = 0
    this.cache = []
  }

  create(total) {
    /*如果缓存中已经存在*/
    if (this.cache.length) {
      if (total >= this.cache.length) {
        total = total - this.cache.length
      }
    }
    /*创建新的对象*/
    if (total) {
      for (let i = 0; i < total; i++) {
        let object = this.construct()
        this.cache.push(object)
      }
    }
  }

  get() {
    const object = this.cache[this.index++]
    if (!object) {
      this.index = 0
      return this.get()
    }
    return object
  }
}
