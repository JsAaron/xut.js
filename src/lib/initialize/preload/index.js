/***************
  资源预加载
****************/
import { config } from '../../config/index'
import { $warn, loadFigure, loadFile } from '../../util/index'
import { audioParse } from './auido.parse'
import { videoParse } from './video.parse'

const PARSE = {
  content: loadFigure,
  widget: loadFigure,
  audio: audioParse,
  video: videoParse
}

/**
 * 预加载的资源列表
 */
let preloadData = {}

/**
 * 资源加载接口
 * @return {[type]} [description]
 */
export function initPreload() {
  loadFile(config.data.pathAddress + 'preload.js', function () {
    preloadData = window.preloadData
    window.preloadData = null

    /*开始加载*/
    if (preloadData) {
      preloadFile(1, function () {
        console.log('完成')
      })
    }
  })
}


/**
 * 强制成数组格式
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
const formatArray = function (data) {
  const type = typeof data
  if (type === 'string') {
    data = data.split(',')
    return {
      fileNames: data,
      basePath: config.data.pathAddress,
      length: data.length
    }
  } else if (type === 'object') {
    /*解析零件*/
    let fileNames = []
    let basePath = config.data.rootPath + '/widget/gallery/'
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
}


function createAccess(data, parse) {
  data = formatArray(data)
  let total = data.length
  let basePath = data.basePath
  return function (callback) {
    const watchComplete = function () {
      if (total === 1) {
        callback()
        return;
      }
      --total
    }
    data.fileNames.forEach(function (fileName) {
      parse(basePath + fileName, watchComplete)
    })
  }
}


/**
 * 开始预加载资源
 * @param  {[type]} chaperId [description]
 * @return {[type]}          [description]
 */
export function preloadFile(chaperId, callback) {
  const res = preloadData[chaperId]
  if (!res) {
    $warn('预加载资源不存在')
    return
  }

  let curryParse = []

  for (let key in res) {
    let parse = PARSE[key]
    if (parse) {
      curryParse.push(createAccess(res[key], parse))
    }
  }

  const watchComplete = (function () {
    let total = curryParse.length
    return function () {
      if (total === 1) {
        callback()
        return
      }
      --total
    }
  })()


  curryParse.forEach(function (fn) {
    fn(watchComplete)
  })

}




/**
 * 是否加载中
 * @return {Boolean} [description]
 */
export function hasLoaded(chaperId) {

}



/**
 * 资源销毁接口
 * @return {[type]} [description]
 */
export function destory() {

}
