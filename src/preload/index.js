/***************
资源预加载
一共有5处位置需要验证是否预加载完毕
1 swpier 移动翻页反弹
2 Xut.View.LoadScenario 全局跳转
3 Xut.View.GotoPrevSlide
4 Xut.View.GotoNextSlide
5 Xut.View.GotoSlide
****************/
import { config } from 'core/config/index'
import { audioParse, clearAudio } from './parser/audio'
import { imageParse, clearImage } from './parser/image'
import { videoParse } from './parser/video'
import { svgParse } from './parser/svg'
import pathHooks from './path-hook'
import { AsyAccess } from 'core/observer/asy-access'
import { $warn, loadFigure, loadFile, $setStorage, $getStorage } from 'core/util/index'
import { addLoop, clearLoop } from './loop'
import { Detect } from './detect'

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


let asyObject = null

/**
 * 用于检测图片是否有缓存的情况
 * 检测chapter 1的数据情况
 * 只检测第一个成功的content图片的缓存状态
 * 如果本身图片获取失败，就递归图片检测
 * @return {Boolean} [description]
 */
function checkFigure(url, callback) {
  return imageParse(url, (newUrl, data) => {
    if (data.state === 'success') {
      //保持最后一张加载图片的有效值
      //用于处理加载检测
      //这里必须用data.url因为原始的url被修改了
      checkFigure.url = newUrl
    }
    callback()
  })
}


const PARSER = {
  // master 母版标记特殊处理，递归PARSE
  // video: videoParse
  content: checkFigure,
  widget: checkFigure,
  autoSprite: checkFigure,
  seniorSprite: checkFigure,
  audio: audioParse,
  svg: svgParse
}

function getDataset(id) {
  if (!window.preloadData) {
    return ''
  }
  return window.preloadData[id]
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
  if (window.preloadData) {
    window.preloadData[chaperId] = null
  }
}

/**
 * 获取初始化数
 * @return {[type]} [description]
 */
function getNumber() {
  //退出清理的情况下
  if (!config.launch) {
    return false
  }
  return typeof config.launch.preload === 'number' ? config.launch.preload : 5
}

/**
 * 母版类型处理
 * 需要重新递归解析,类型需要递归创建
 * @return {[type]} [description]
 */
function masterHandle(childData) {
  let masterId = childData
  let masterData = getDataset(masterId)
  if (masterData) {
    return function(callback) {
      loadResource(masterId, masterData, function() {
        /*删除母版数据，多个Page会共享同一个母版加载*/
        deleteResource(masterId)
        callback()
      })
    }
  }
}

/**
 * 页面层的处理
 * content/widget/audio/video/autoSprite/seniorSprite/svg
 * @return {[type]} [description]
 */
function pageHandle(type, childData, parser) {
  childData = pathHooks[type](childData)
  let total = childData.length

  return function(callback) {
    let section = getNumber()

    /**
     * 分段处理
     * section 是分段数量
     */
    function segmentHandle() {

      let detectObjs = {} /*预加载对象列表*/
      let analyticData
      let hasComplete = false

      /*如果可以取整*/
      if (childData.fileNames.length > section) {
        analyticData = childData.fileNames.splice(0, section)
      } else {
        /*如果小于等于检测数*/
        analyticData = childData.fileNames
        hasComplete = true
      }

      /**
       * 分段检测的回到次数
       * @type {[type]}
       */
      let analyticCount = analyticData.length

      /**
       * 检测完成度
       * @return {[type]} [description]
       */
      function complete() {
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
      }


      function reduce(path) {
        detectObjs[path] = new Detect(parser, path)
        detectObjs[path].start(2000, function(state) {
          if (state) {
            /*如果请求成功了，就必须销毁*/
            detectObjs[path].destory()
          } else {
            /*失败加入到循环队列*/
            addLoop(path, detectObjs[path])
          }
          detectObjs[path] = null
          window.preloadData && complete()
        })
      }

      /**
       * 分配任务
       * 1 分配到每个解析器去处理
       * 2 给一个定时器的范围
       * 主动检测2秒
       * 成功与失败都认为通过
       * 失败单独加到循环队列中去处理
       */
      for (let i = 0; i < analyticData.length; i++) {
        reduce(analyticData[i])
      }

    }

    section && segmentHandle()
  }
}

/**
 * 创建对应的处理器
 */
function createHandle(type, childData, parser) {
  if (type === 'master') {
    return masterHandle(childData)
  } else {
    return pageHandle(type, childData, parser)
  }
}

/**
 * 开始加载资源
 */
function loadResource(id, data, callback) {
  asyObject = new AsyAccess()
  for (let key in data) {
    let parser = PARSER[key]
    if (parser) {
      /*audio优先解析*/
      asyObject.create(createHandle(key, data[key], parser), key === 'audio' ? 'unshift' : 'push')
    }
  }

  /*执行后监听,监听完成*/
  asyObject.exec().$$watch('complete', function() {
    asyObject = null
    callback()
  })
}


/**
 * 检测下一个解析任务
 * 以及任务的完成度
 */
function repeatCheck(id, callback) {

  //判断是否所有页面加载完毕
  function completeLoad() {
    /*如果加载数等于总计量数，这个证明加载完毕*/
    if (id === chapterIdCount) {
      $warn({
        type: 'preload',
        content: `全部预加载完成,本次处理了${chapterIdCount}页`,
        color: 'red'
      })
      $setStorage('preload', checkFigure.url)
      clearAudio()
      clearImage()
      window.preloadData = null //全加载完毕了，就可以清理了
      return true
    }
    return false
  }

  /*第一次加载才有回调*/
  if (callback) {
    callback()
    if (completeLoad()) {
      return;
    }
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
      /*跳转页面的情况,跳到任何一页，newChapterId不等于id*/
      nextTask(newChapterId)
      return
    }
  }


  /*如果加载数等于总计量数，这个证明加载完毕*/
  if (completeLoad()) {
    return;
  }

  /*启动了才继续可以预加载*/
  if (enable) {
    nextTask()
  }
}


/**
 * 检测下一个页面加载执行
 * 如果传入了检测chpaterId
 * 否则就用默认的正索引
 */
function nextTask(chapterId, callback) {
  if (!chapterId) {
    /*新加载的Id游标*/
    ++loadingId;
    chapterId = loadingId
  }

  /*只有没有预加载的数据才能被找到*/
  const pageData = getDataset(chapterId)

  function complete(data) {
    //如果加载了数据，但是数据还未加载完毕
    if (window.preloadData) {
      $warn({
        type: 'preload',
        content: data
      })
      deleteResource(chapterId)
      repeatCheck(chapterId, callback)
    }
  }

  /*必须保证pageData不是一个空对象*/
  if (pageData && Object.keys(pageData).length) {
    // $warn('----预加资源开始chapterId: ' + chapterId)
    loadResource(chapterId, pageData, () => complete(`第${chapterId}页，预加资源完成`))
  } else {
    complete(`第${chapterId}页，预加载数据是空`)
  }
}


/**
 * 判断是否有预加载文件
 * @return {Boolean} [description]
 */
export function loadPrelaod(callback) {
  loadFile(config.data.pathAddress + 'preload.js', function() {
    if (window.preloadData) {
      callback(true, window.globalBrMode)
    } else {
      callback(false)
    }
  })
}


/**
 * 监听预加载初始化调用
 * 1 原则上是监听一次autoRunComplete事件
 * 2 可能autoRunComplete会丢失，所以需要定时器处理
 * @return {[type]} [description]
 */
function watchPreloadInit() {

  //如果预加载的只有1页数据 判断第一页加载完成后return
  if (!getDataset(chapterIdCount)) {
    return
  }

  let timer = null
  let count = 2

  /*从第二次开始加载数据*/
  function startDownload(type) {
    if (count === 2) {
      clearTimeout(timer)
      timer = null
      enable = true
      nextTask()
    }
    --count
  }

  /*监听初始化第一次完成*/
  Xut.Application.onceWatch('autoRunComplete', startDownload);

  /*防止autoRunComplete事件丢失处理,或者autoRunComplete执行很长*/
  timer = setTimeout(startDownload, 5000)
}



/**
 * 资源加载接口
 * 必须先预加载第一页
 */
export function initPreload(total, callback) {

  function exitFn() {
    config.launch.preload = null
    callback(false)
  }

  /**
   * 初始化，只预加载第一次的内容
   */
  function firstDownload() {
    $warn({
      type: 'preload',
      content: `开始执行资源预加载`
    })
    /*监听预加载初始化*/
    nextTask('', function() {
      watchPreloadInit()
      callback(true);
    })
  }

  /**
   * 检测缓存是否存在
   * 如果没有预加载完毕就继续加载
   * 否则缓存存在就退出
   */
  function checkCache(next, finish) {
    const cahceUrl = $getStorage('preload')
    if (cahceUrl) {
      //这里主要加强判断，用户可能会清理数据的情况
      loadFigure(cahceUrl, (data) => {
        if (data.state === 'success') {
          $warn({
            type: 'preload',
            content: '预加载已完成了',
            color: 'red'
          })
          finish()
        } else {
          next()
        }
      })
    } else {
      next()
    }
  }

  if (window.preloadData) {
    chapterIdCount = total
    checkCache(firstDownload, exitFn)
  } else {
    exitFn()
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
  if (!getDataset(chapterId)) {
    return false
  } else {
    /*正在预加载，等待记录回调*/
    if (!processed) {
      $warn({
        type: 'preload',
        content: `错误,预加载必须传递处理器`,
        level: 'error'
      })
    }
    //等待预加载完毕后调用
    notification = [chapterId, function() {
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

  if (asyObject) {
    asyObject.destory()
    asyObject = null
  }

  checkFigure.url = null
  enable = true
  chapterIdCount = 0
  loadingId = 0
  window.preloadData = null
  notification = null
  clearLoop()
}
