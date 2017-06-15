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
import { AsyAccess } from '../../observer/asy-access'

const PARSE = {
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
 * 初始的ID游标值
 * @type {Number}
 */
let idVernier = 1

/**
 * 预加载回调通知
 * @type {Array}
 */
let notification = null


/**
 * 格式字符串
 */
const formatString = function(data, basePath) {
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
const formatObject = function(data, basePath) {
  let fileNames = []
  for (let dir in data) {
    let d = data[dir].split(',')
    d.forEach(function(name) {
      fileNames.push(basePath + dir + '/' + name)
    })
  }
  return {
    fileNames,
    basePath: '', //路径写到fileNames中了
    length: fileNames.length
  }
}

const formatHooks = {
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
 * 开始加载资源
 */
function loadResource(data, callback) {
  const asy = new AsyAccess()

  /*创建对应的处理器*/
  const createProcessor = function(type, childData, parse) {
    if (type === 'master') {
      /**
       * 母版数据，需要重新递归解析
       */
      let masterId = childData
      let masterData = preloadData[masterId]
      if (masterData) {
        return function(callback) {
          loadResource(masterData, function() {
            /*删除母版数据，多个Page会共享同一个母版加载*/
            deleteResource(masterId)
            callback()
          })
        }
      }
    } else {
      /**
       * 正常页面数据
       * content/widget/audio/video
       */
      childData = formatHooks[type](childData)
      let total = childData.length
      let basePath = childData.basePath
      return function(callback) {
        childData.fileNames.forEach(name => {
          parse(basePath + name, () => {
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

  for (let key in data) {
    let parse = PARSE[key]
    if (parse) {
      asy.create(createProcessor(key, data[key], parse))
    }
  }

  /*执行后监听,监听完成*/
  asy.exec().$$watch('complete', callback)
}


/**
 * 检测下一个页面加载执行
 * @return {Function} [description]
 */
function nextTask(chapterId, callback) {

  chapterId = chapterId || idVernier

  /**
   * 检测下一个解析任务
   * 以及人物的完成度
   */
  const _repeatCheck = function() {

    /*第一次加载才有回调*/
    if (callback) {
      ++idVernier;
      callback()
      return
    }

    /*如果加载数等于总计量数，这个证明加载完毕*/
    if (idVernier === chapterIdCount) {
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
        /*跳转页面的情况， 如果不是按照顺序的预加载方式*/
        nextTask(cid)
        return
      }
    }

    ++idVernier;

    /*启动了才可以预加载*/
    if (enable) {
      nextTask(idVernier)
    }
  }

  /*只有没有预加载的数据才能被找到*/
  const data = preloadData[chapterId]
  if (data) {
    loadResource(data, function() {
      $warn('完成chapterId: ' + chapterId)
      deleteResource(chapterId)
      _repeatCheck()
    })
  } else {
    $warn('预加载资源不存在，chapterId: ' + chapterId)
    _repeatCheck()
  }

}



/**
 * 资源加载接口
 * 必须先预加载第一页
 * @return {[type]} [description]
 */
export function initPreload(total, callback) {
  loadFile(config.data.pathAddress + 'preload.js', function() {
    if (window.preloadData) {
      chapterIdCount = total
      preloadData = window.preloadData
      window.preloadData = null
      nextTask(1, callback)
    } else {
      callback()
    }
  })
}


/**
 * 继续开始加载
 * 初始化只加载了一页
 * 在页面init进入后，在开始这个调用
 * 继续解析剩下的页面
 */
export function startPreload(total, callback) {
  /*从第2页开始预加载*/
  if (preloadData) {
    enable = true
    setTimeout(function() {
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
  enable = true
  chapterIdCount = 0
  idVernier = 1
  preloadData = null
  notification = null
}
