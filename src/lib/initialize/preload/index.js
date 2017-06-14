/***************
  资源预加载
一共有5处位置需要验证是否预加载完毕
1 swpier 移动翻页反弹
2 Xut.View.LoadScenario 全局跳转
3 Xut.View.GotoPrevSlide
4 Xut.View.GotoNextSlide
5 Xut.View.GotoSlide
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
let preloadData = null

/**
 * 页面chpater Id 总数
 * @type {Number}
 */
let chapterIds = 0

/**
 * 初始的ID游标值
 * @type {Number}
 */
let idVernier = 1

/**
 * 由于跳转页面存在
 * 页面解析是按照顺序的
 * 如果刚好跳转的不是解析的顺序
 * 大于解析顺序，那么需要记录这个插入的解析id
 * 这样在正常解析的时候，可以跳过
 * @type {Array}
 */
let insertIdVernier = []

/**
 * 预加载回调通知
 * @type {Array}
 */
let notification = null

/**
 * 强制成数组格式
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


/**
 * 创建对应的处理器
 */
function createProcessor(data, parse) {
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
 */
function startLoad(data, callback) {

  let curryParse = []

  for (let key in data) {
    let parse = PARSE[key]
    if (parse) {
      curryParse.push(createProcessor(data[key], parse))
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
 * 检测下一个页面加载执行
 * @return {Function} [description]
 */
function next(chaperId, callback) {

  chaperId = chaperId || idVernier

  /**
   * 检测下一个解析任务
   * 以及人物的完成度
   */
  const _repeatCheck = function () {

    callback && callback()

    if (idVernier === chapterIds) {
      /*因为最后一页的判断是需要大于请求的，所以这里需要叠加一次*/
      ++idVernier;
      $warn('全部预加载完成')
      return
    }

    /*执行预加载等待的回调通知对象*/
    if (notification) {
      const cid = notification[0]
      if (idVernier === cid) {
        /*如果下一个解析正好是等待的页面*/
        notification[1]()
        notification = null
      } else {
        /*
        跳转页面的情况
        如果不是按照顺序的预加载方式
        这里idVernier找不到对应的标记*/
        insertIdVernier.push(cid)
        next(cid)
        return
      }

    }

    ++idVernier;
    next(idVernier)
  }


  /*如果已经被动态解析过了*/
  if (~insertIdVernier.indexOf(chaperId)) {
    $warn('完成chaperId: ' + chaperId)
    _repeatCheck()
  } else {
    const data = preloadData[chaperId]
    if (data) {
      startLoad(data, function () {
        $warn('完成chaperId: ' + chaperId)
        _repeatCheck()
      })
    } else {
      $warn('预加载资源不存在,chaperId: ' + chaperId)
      _repeatCheck()
    }
  }


}



/**
 * 资源加载接口
 * 必须先预加载第一页
 * @return {[type]} [description]
 */
export function initPreload(total, callback) {
  loadFile(config.data.pathAddress + 'preload.js', function () {
    if (window.preloadData) {
      chapterIds = total
      preloadData = window.preloadData
      window.preloadData = null
      next(1, callback)
    } else {
      callback()
    }
  })
}



/**
 * 监听线性翻页预加载加载
 * 类型，方向，处理器
 * context 处理器的上下文
 */
export function hasPreload({
  type,
  chapterId,
  direction,
  processed
}, context) {

  /*如果是线性模式，左右翻页的情况处理*/
  if (type === 'linear') {
    const currentId = Xut.Presentation.GetPageId()
    chapterId = direction === 'next' ? currentId + 1 : currentId - 1
  } else if (type === 'nolinear') {
    /*非线性模式,跳转模式*/
  }

  /**
   * 证明加载完毕了
   * 1 如果游标大于等于chaperId
   * 2 如果被动态插入，动态加载过了
   */
  if (idVernier > chapterId || insertIdVernier.indexOf(chapterId) !== -1) {
    return false
  } else {
    /*正在预加载，等待记录回调*/
    if (!processed) {
      $warn('预加载必须传递处理器，有错误')
    }
    notification = [chapterId, function () {
      processed.call(context)
    }]
    return true
  }

}


/**
 * 资源销毁接口
 * @return {[type]} [description]
 */
export function clearPreload() {
  chapterIds = 0
  idVernier = 1
  preloadData = null
  notification = null
  insertIdVernier = []
}
