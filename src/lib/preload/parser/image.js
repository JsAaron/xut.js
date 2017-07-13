import { loadFigure } from '../../util/index'
import { config } from '../../config/index'
import { Share } from './share'

let imageShare = null


function getImage() {
  if (!imageShare) {
    imageShare = new Share()
  }
  if (imageShare) {
    let image = imageShare.get()
    if (image) {
      return image
    }
  }
  return new Image()
}


export function clearImage() {
  if (imageShare) {
    imageShare.destory()
  }
  imageShare = null
}


/**
 * 图片解析
 */
export function imageParse(url, callback) {

  /**如果有缓存图片的后缀*/
  const brModelType = config.launch.brModelType
  if (brModelType) {
    /*必须$结尾，因为url中间有可能存在apng_
    content/22/gallery/apng_70fe7a26b9208e74451c6262fd253cd2_a*/
    url = url.replace(/.png$|.jpg$/, brModelType)
  }

  /**
   * 这里最主要是替换了图片对象，优化了创建
   */
  let imageObject = loadFigure({
    image: getImage(),
    url: url
  }, function () {
    imageShare && imageShare.add(imageObject) //加入到循环队列
    callback()
  })

  return {
    destory: function () {
      if (imageObject) {
        imageObject.src = null
        imageObject.removeAttribute("src")
        imageObject = null
      }
    }
  }
}
