importScripts('parse/loadfigure.js', 'parse/audio.js', 'parse/format.js');

var PARSE = {
  // master 母版标记特殊处理
  // video: videoParse
  content: loadFigure,
  widget: loadFigure,
  autoSprite: loadFigure,
  seniorSprite: loadFigure,
  audio: audioParse
}

/**
 * 是否启动预加载
 * true 启动
 * false 关闭
 * 翻页的时候停止
 * 动画结束后开始
 * @type {Boolean}
 */
var enable = true

/**
 * 预加载的资源列表
 */
var preloadData = null

/**
 * 页面chpater Id 总数
 * @type {Number}
 */
var chapterIdCount = 0

/**
 * 正在加载的id标记
 * @type {Number}
 */
var loadingId = 0

/**
 * 预加载回调通知
 * @type {Array}
 */
var notification = null

/**
 * 基础路径
 * @type {[type]}
 */
var rootPath = null


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
 * 创建对应的处理器
 * master 母版数据，需要重新递归解析,类型需要递归创建
 *
 * 正常页面数据
 * content/widget/audio/video/autoSprite/seniorSprite
 */
function createProcessor(type, childData, parse) {
  if (type === 'master') {
    var masterId = childData
    var masterData = preloadData[masterId]
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
    childData = formatHooks[type](childData, rootPath)
    var total = childData.length
    var basePath = childData.basePath
    return function (callback) {
      childData.fileNames.forEach(function (name) {
        parse(basePath + name, function () {
          if (total === 1) {
            callback()
            return;
          }
          --total
        })
      })
    }
  }
}


/**
 * 开始加载资源
 */
function loadResource(data, callback) {

  var asys = []
  var vernier = 0

  for (var key in data) {
    var parse = PARSE[key]
    if (parse) {
      asys.push(createProcessor(key, data[key], parse))
    }
  }

  // if (asys.length) {
  //   var watchComplete = () => {
  //     ++vernier;
  //     if (asys.length === vernier) {
  //       console.log('123123')
  //       return
  //     }
  //   }
  //   for (var i = 0; i < asys.length; i++) {
  //     asys[i](watchComplete)
  //   }
  // } else {
  //   callback()
  // }

}


/**
 * 检测下一个解析任务
 * 以及任务的完成度
 */
function repeatCheck(loadingId, callback) {

  /*第一次加载才有回调*/
  if (callback) {
    callback()
    return
  }

  /*执行预加载等待的回调通知对象*/
  if (notification) {
    var newChapterId = notification[0]
    if (loadingId === newChapterId) {
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
  if (loadingId === chapterIdCount) {
    $warn('全部预加载完成')
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
  var pageData = preloadData[chapterId]
  if (pageData) {
    loadResource(pageData, function () {
      $warn('预加资源完成chapterId: ' + chapterId)
      deleteResource(chapterId)
      repeatCheck(loadingId, callback)
    })
  } else {
    $warn('预加资源已处理，chapterId: ' + chapterId)
    repeatCheck(loadingId, callback)
  }
}



self.addEventListener('message', function (e) {
  /*初始化数据*/
  if (e.data.action === 'initData') {
    preloadData = e.data.value
    rootPath = e.data.rootPath
  }
  /*第一次加载首页*/
  if (e.data.action === 'initTask') {
    nextTask('', function () {
      console.log('完成')
    })
  }

}, false);
