/***************
  资源预加载
一共有5处位置需要验证是否预加载完毕
1 swpier 移动翻页反弹
2 Xut.View.LoadScenario 全局跳转
3 Xut.View.GotoPrevSlide
4 Xut.View.GotoNextSlide
5 Xut.View.GotoSlide
****************/
import { config } from '../config/index'
import { audioParse, setAudio } from './parser/audio'
import { imageParse, setImage } from './parser/image'
import { videoParse } from './parser/video'
import { svgParse } from './parser/svg'
import formatHooks from './parser/format'
import { AsyAccess } from '../observer/asy-access'
import { $set, $get, $warn, loadFigure, loadFile } from '../util/index'

/**
 * 是否启动预加载
 * true 启动
 * false 关闭
 * 翻页的时候停止
 * 动画结束后开始
 * @type {Boolean}
 */
let enable = true

/**
 * 预加载的资源列表
 */
let preloadData = null

/**
 * 页面chpater Id 总数
 * @type {Number}
 */
let chapterIdCount = 0

/**
 * 正在加载的id标记
 * @type {Number}
 */
let loadingId = 0

/**
 * 预加载回调通知
 * @type {Array}
 */
let notification = null


/**
 * 用于检测图片是否有缓存的情况
 * 检测chapter 1的数据情况
 * 只检测第一个成功的content图片的缓存状态
 * 如果本身图片获取失败，就递归图片检测
 * @return {Boolean} [description]
 */
function checkFigure(url, callback) {
  imageParse(url, (state, cache) => {
    /*如果是有效图，只检测第一次加载的缓存img*/
    if (!checkFigure.url && state) {
      checkFigure.url = url
    }
    callback()
  })
}


const PARSE = {
  // master 母版标记特殊处理，递归PARSE
  // video: videoParse
  content: checkFigure,
  widget: checkFigure,
  autoSprite: checkFigure,
  seniorSprite: checkFigure,
  audio: audioParse,
  svg: svgParse
}


/**
 * 完成后删除资源的列表
 * 2个好处
 * 1 优化内存空间
 * 2 跳页面检测，如果遇到不存在的资源就不处理了
 *   这代表，1.已经加载了
 *          2.资源或错
 * @return {[type]} [description]
 */
function deleteResource(chaperId) {
  preloadData[chaperId] = null
}

/**
 * 获取初始化数
 * @return {[type]} [description]
 */
function getNumber() {
  return typeof config.launch.preload === 'number' ? config.launch.preload : 5
}

/**
 * 创建对应的处理器
 * master 母版数据，需要重新递归解析,类型需要递归创建
 *
 * 正常页面数据
 * content/widget/audio/video/autoSprite/seniorSprite/svg
 */
function createProcessor(type, childData, parse, isInit) {
  if (type === 'master') {
    let masterId = childData
    let masterData = preloadData[masterId]
    if (masterData) {
      return function (callback) {
        loadResource(masterData, function () {
          /*删除母版数据，多个Page会共享同一个母版加载*/
          deleteResource(masterId)
          callback()
        })
      }
    }
  } else {
    childData = formatHooks[type](childData)
    let total = childData.length
    let basePath = childData.basePath
    return function (callback) {

      let section = getNumber()

      /**
       * 分段处理
       */
      function segmentHandle() {

        let analyticData;
        let hasComplete = false

        /*如果可以取整*/
        if (childData.fileNames.length > section) {
          analyticData = childData.fileNames.splice(0, section)
        } else {
          /*如果小于等于检测数*/
          analyticData = childData.fileNames
          hasComplete = true
        }

        /*分段检测的回到次数*/
        let analyticCount = analyticData.length

        // $warn('加载类型：' + type + ' - 数量：' + analyticCount)

        analyticData.forEach(name => {
          parse(basePath + name, () => {
            if (analyticCount === 1) {
              if (hasComplete) {
                /*分段处理完毕就清理，用于判断跳出*/
                callback()
                return
              } else {
                segmentHandle()
              }
            }
            --analyticCount
          })

        })
      }

      segmentHandle()
    }
  }
}

/**
 * 开始加载资源
 */
function loadResource(data, callback, isInit) {
  const asy = new AsyAccess()
  for (let key in data) {
    let parse = PARSE[key]
    if (parse) {
      asy.create(createProcessor(key, data[key], parse, isInit))
    }
  }
  /*执行后监听,监听完成*/
  asy.exec().$$watch('complete', callback)
}


/**
 * 检测下一个解析任务
 * 以及任务的完成度
 */
function repeatCheck(id, callback) {

  /*第一次加载才有回调*/
  if (callback) {
    callback()
    return
  }

  /*执行预加载等待的回调通知对象*/
  if (notification) {
    const newChapterId = notification[0]
    if (id === newChapterId) {
      /*如果下一个解析正好是等待的页面*/
      notification[1]()
      notification = null
    } else {
      /*跳转页面的情况， 如果不是按照顺序的预加载方式*/
      nextTask(newChapterId)
      return
    }
  }

  /*如果加载数等于总计量数，这个证明加载完毕*/
  if (id === chapterIdCount) {
    $warn('全部预加载完成')
    $set('preload', checkFigure.url)
    return
  }

  /*启动了才继续可以预加载*/
  if (enable) {
    nextTask()
  }
}


/**
 * 检测下一个页面加载执行
 * @return {Function} [description]
 */
function nextTask(chapterId, callback) {
  if (!chapterId) {
    /*新加载的Id游标*/
    ++loadingId;
    chapterId = loadingId
  }

  /*只有没有预加载的数据才能被找到*/
  const pageData = preloadData[chapterId]
  if (pageData) {
    loadResource(pageData, function () {
      $warn('----预加资源完成chapterId: ' + chapterId)
      deleteResource(chapterId)
      repeatCheck(loadingId, callback)
    }, callback)
  } else {
    $warn('----预加资源已处理，chapterId: ' + chapterId)
    repeatCheck(loadingId, callback)
  }
}


/**
 * 检测缓存是否存在
 * @return {[type]} [description]
 */
function checkCache(finish, next) {
  const cahceUrl = $get('preload')
  if (cahceUrl) {
    loadFigure(cahceUrl, (state, cache) => {
      if (cache) {
        finish()
      } else {
        next()
      }
    })
  } else {
    next()
  }
}

/**
 * 资源加载接口
 * 必须先预加载第一页
 * @return {[type]} [description]
 */
export function initPreload(total, callback) {

  const close = function () {
    preloadData = null
    config.launch.preload = false
    callback()
  }

  const start = function () {
    nextTask('', callback)
  }

  loadFile(config.data.pathAddress + 'preload.js', function () {
    if (window.preloadData) {
      chapterIdCount = total
      preloadData = window.preloadData
      window.preloadData = null;
      //初始化音频数量
      setAudio(getNumber())
      setImage(getNumber())
      checkCache(close, start)
    } else {
      close()
    }
  })
}


/**
 * 继续开始加载
 * 初始化只加载了一页
 * 在页面init进入后，在开始这个调用
 * 继续解析剩下的页面
 */
export function startPreload() {
  /*从第2页开始预加载*/
  if (preloadData) {
    enable = true
    setTimeout(function () {
      nextTask()
    }, 0)
  }
}


/**
 * 翻页停止预加载
 */
export function stopPreload() {
  enable = false
}



/**
 * 预加载请求中断处理
 * 监听线性翻页预加载加载
 * 类型，方向，处理器
 * context 处理器的上下文
 */
export function requestInterrupt({
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

  /*如果不存在预加载数据，就说明加载完毕，或者没有这个数据*/
  if (!preloadData[chapterId]) {
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
  checkFigure.url = null
  enable = true
  chapterIdCount = 0
  loadingId = 0
  preloadData = null
  notification = null
}
