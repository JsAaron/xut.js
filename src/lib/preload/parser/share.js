/**
 * 创建共享对象
 * 这里是为了限制对象的创建数
 * 优化
 * @param  {[type]} total [description]
 * @return {[type]}       [description]
 */
export class Share {

  constructor(objectName, total) {
    this.objectName = objectName
    this.total = total
    this.index = 0
    this.cache = []
    this._create()
  }

  _create() {
    for (let i = 0; i < this.total; i++) {
      let object = new [this.objectName]()
      this.cache.push(object)
    }
  }

  get() {
    const object = this.cache[this.index++]
    if (!object) {
      index = 0
      return this.get()
    }
    return object
  }
}


function createShare(object, total) {

  let index = 0
  let cacheAudio = []

  let audio, i

  /*如果缓存中已经存在*/
  if (cacheAudio.length) {
    if (total >= cacheAudio.length) {
      total = total - cacheAudio.length
    }
  }

}
