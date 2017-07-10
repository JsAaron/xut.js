import { loadFigure } from '../../util/index'
import { config } from '../../config/index'
import { Share } from './share'

let imageShare = null

/**
 * 设置image个数
 * 1 根据preload
 * 2 如果是重复加载，判断缓存已创建的
 */
export function initImage(total) {
  if (imageShare) {
    imageShare.create(total)
  } else {
    imageShare = new Share('image')
    imageShare.create(total)
  }
}

function getImage() {
  if (imageShare) {
    return imageShare.get()
  } else {
    return new Image()
  }
}


/**
 * 图片解析
 */
export function imageParse(url, callback) {

  /**如果有缓存图片的后缀*/
  const brModelType = config.launch.brModelType
  if (brModelType) {
    url = url.replace(/.png|.jpg/, brModelType)
  }

  /**
   * 这里最主要是替换了图片对象，优化了创建
   */
  let object = loadFigure(url, callback)

  return {
    destory: function () {
      if (object) {
        object.src = null
        object = null
      }
    }
  }
}
