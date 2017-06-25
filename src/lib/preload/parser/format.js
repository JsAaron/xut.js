import { config } from '../../config/index'


/**
 * 格式字符串
 */
const formatString = function(data, basePath) {
  data = data.split(',')
  let sizes = []
  let fileNames = []
  data.forEach(function(name) {
    const dataset = name.split('-')
    sizes.push(dataset[0])
    fileNames.push(basePath + '/' + dataset[1])
  })
  return {
    sizes,
    fileNames,
    length: data.length
  }
}


/**
 * 格式对象
 */
const formatObject = function(data, basePath) {
  let fileNames = []
  let sizes = [] //尺寸
  for (let dir in data) {
    let d = data[dir].split(',')
    d.forEach(function(name) {
      const dataset = name.split('-')
      sizes.push(dataset[0])
      fileNames.push(basePath + dir + '/' + dataset[1])
    })
  }
  return {
    sizes,
    fileNames,
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
     * svg
     */
    svg(data) {
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
