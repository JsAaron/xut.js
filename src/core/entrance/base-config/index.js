import initDatabse from './init-database'
import setData from './set-data'

import { importJsonDatabase } from 'database/result'
import { $warn, loadGolbalStyle } from '../../util/index'
import { createCursor } from '../../expand/cursor'
import { initColumn } from '../../component/column/init'
import { contentFilter } from '../../component/activity/content/content-filter'
import { config, initConfig, initPathAddress } from '../../config/index'
import { initPreload, loadPrelaod } from 'preload/index'
import {
  resetBrMode,
  resetVisualMode,
  resetDelegate,
  setHistory,
  setPaintingMode,
  setGestureSwipe
} from '../../config/launch-config/index.js'

/**
 * 最大屏屏幕尺寸
 * @return {[type]} [description]
 */
function getMaxWidth() {
  if (config.visualSize) {
    return config.visualSize.width
  }
  return window.screen.width > document.documentElement.clientWidth ?
    window.screen.width :
    document.documentElement.clientWidth
}


/**
 * 检车分辨率失败的情况
 * 强制用js转化
 * 750:  '', //0-1079
 * 1080: 'mi', //1080-1439
 * 1440: 'hi' //1440->
 */
function setDefaultSuffix() {
  let doc = document.documentElement
  //竖版的情况才调整
  if (doc.clientHeight > doc.clientWidth) {
    let ratio = window.devicePixelRatio || 1
    let maxWidth = getMaxWidth() * ratio
    if (maxWidth >= 1080 && maxWidth < 1439) {
      config.launch.baseImageSuffix = config.launch.imageSuffix['1080']
    }
    if (maxWidth >= 1440) {
      config.launch.baseImageSuffix = config.launch.imageSuffix['1440']
    }
    $warn({
      type: 'config',
      content: 'css media匹配suffix失败，采用js采用计算 config.launch.baseImageSuffix = ' + config.launch.baseImageSuffix
    })
  }
}


/**
 * 自适应图片
 * @return {[type]} [description]
 */
function adaptiveImage() {
  let $adaptiveImageNode = $('.xut-adaptive-image')
  if ($adaptiveImageNode.length) {
    let baseImageType = $adaptiveImageNode.width()
    let type = config.launch.imageSuffix[baseImageType]
    if (type) {
      config.launch.baseImageSuffix = type
      return
    }
  }
  setDefaultSuffix()
}


/*
  配置初始化
 */
function configInit(novelData, tempSettingData) {

  /*启动代码用户操作跟踪:启动*/
  config.sendTrackCode('launch')

  //创建过滤器
  Xut.CreateFilter = contentFilter('createFilter');
  Xut.TransformFilter = contentFilter('transformFilter');

  //初始化配置一些信息
  initConfig(novelData.pptWidth, novelData.pptHeight)

  //新增模式,用于记录浏览器退出记录
  //如果强制配置文件recordHistory = false则跳过数据库的给值
  setHistory(tempSettingData)

  //2015.2.26
  //启动画轴模式
  setPaintingMode(tempSettingData)

  //创建忙碌光标
  if (!Xut.IBooks.Enabled) {
    createCursor()
  }

  //初始资源地址
  initPathAddress()
}

/**
 * 初始分栏排版
 * 嵌入index分栏
 * 默认有并且没有强制设置关闭的情况，打开缩放
 */
function configColumn(callback) {
  initColumn(haColumnCounts => {
    if (haColumnCounts) {
      resetDelegate()
    }
    callback()
  })
}


export default function baseConfig(callback) {

  //mini杂志设置
  //如果是pad的情况下设置font为125%
  if (config.launch.platform === 'mini' && Xut.plat.isTablet) {
    $('body').css('font-size', '125%')
  }

  /*图片分辨了自适应*/
  if (config.launch.imageSuffix) {
    adaptiveImage()
  }

  //导入数据库
  importJsonDatabase((results) => {
    setDatabse(results)
  })

  function setDatabse(results) {
    initDatabse(results, function(dataRet) {

      $warn('logic', '初始化数据库完成')

      const novelData = dataRet.Novel.item(0)
      const tempSettingData = setData(dataRet.Setting)
      const chapterTotal = dataRet.Chapter.length

      //配置config
      resetVisualMode()
      configInit(novelData, tempSettingData)

      //配置师傅翻页
      setGestureSwipe(novelData)

      //处理预加载文件
      loadPrelaod(function(hasPreFile, globalBrMode) {
        resetBrMode(hasPreFile, globalBrMode)
        loadStyle(novelData, chapterTotal)
      })
    })
  }

  /**
   * 加载样式
   * @return {[type]} [description]
   */
  function loadStyle(novelData, chapterTotal) {
    /*加载svg的样式*/
    loadGolbalStyle('svgsheet', function() {
      //判断是否有分栏处理
      configColumn(function() {
        //如果启动预加载配置
        //先探测下是否能支持
        if (config.launch.preload) {
          initPreload(chapterTotal, () => callback(novelData))
        } else {
          callback(novelData)
        }
      })
    })
  }

}
