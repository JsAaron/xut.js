import { config } from '../../config/index'


/**
 * 格式字符串
 */
const formatString = function (data, basePath) {
  data = data.split(',')
  return {
    basePath,
    fileNames: data,
    length: data.length
  }
}


/**
 * 格式对象
 */
const formatObject = function (data, basePath) {
  let fileNames = []
  for (let dir in data) {
    let d = data[dir].split(',')
    d.forEach(function (name) {
      fileNames.push(basePath + dir + '/' + name)
    })
  }
  return {
    fileNames,
    basePath: '', //路径写到fileNames中了
    length: fileNames.length
  }
}

export default {

  /**
   * 文本图片
   */
  content(data) {
      return formatString(data, config.data.pathAddress)
    },

    /**
     * 媒体
     * @type {[type]}
     */
    audio(data) {
      return formatString(data, config.data.pathAddress)
    },
    video(data) {
      return formatString(data, config.data.pathAddress)
    },


    /**
     * 零件图片
     */
    widget(data) {
      return formatString(data, config.data.rootPath + '/widget/gallery/')
    },

    /**
     * content下的自动精灵动画
     * autoSprite: {
     *   2: '1.jpg,2.jpg',
     *   3: '1.jpg,2.jpg'
     * }
     */
    autoSprite(data) {
      return formatObject(data, config.data.pathAddress)
    },

    /*
      高级精灵动画
      seniorSprite: {
        2: '1.jpg,2.jpg',
        3: '1.jpg,2.jpg'
      }
    */
    seniorSprite(data) {
      return formatObject(data, config.data.rootPath + '/widget/gallery/')
    }
}
