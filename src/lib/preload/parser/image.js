import { loadFigure } from '../../util/index'


let index = 0
let cacheImage = []

/**
 * 设置image个数
 * 1 根据preload
 * 2 如果是重复加载，判断缓存已创建的
 */
export function setImage(total) {
  let image, i
    /*如果缓存中已经存在*/
  if (cacheImage.length) {
    if (total >= cacheImage.length) {
      total = total - cacheImage.length
    }
  }
  for (i = 0; i < total; i++) {
    cacheImage.push(new Image())
  }
}

function getImage() {
  const image = cacheImage[index++]
  if (!image) {
    index = 0
    return getImage()
  }
  return image
}


/**
 * 图片解析
 */
export function imageParse(url, callback) {
  /**
   * 这里最主要是替换了图片对象，优化了创建
   */
  loadFigure({ image: getImage(), url }, callback)
}
