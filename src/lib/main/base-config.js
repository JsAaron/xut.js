import initTooBar from './toolbar'
import { $$warn, loadStyle } from '../util/index'
import { createCursor } from '../initial/cursor'
import { initColumn } from '../component/column/core-init'
import { contentFilter } from '../component/activity/content/content-filter'
import { importJsonDatabase } from '../database/result'
import { config, initConfig, initPathAddress } from '../config/index'
import { priorityConfig } from '../config/priority-config'
/**
 * 新增模式,用于记录浏览器退出记录
 * 默认启动
 * 是否回到退出的页面
 * set表中写一个recordHistory
 * 是   1
 * 否   0
 */
const setHistory = (data) => {
  //Launch接口定义
  if(config.historyMode !== undefined) {
    return
  }
  //数据库定义 && == 1
  if(data.recordHistory !== undefined && Number(data.recordHistory)) {
    config.historyMode = true
    return
  }
  //调试模式，默认启动缓存
  if(config.devtools) {
    config.historyMode = true
  }
}

/*画轴模式*/
const setPaintingMode = function(data) {
  if(!config.visualMode && Number(data.scrollPaintingMode)) {
    config.visualMode = 4
  }
}

/*最大屏屏幕尺寸*/
const getMaxWidth = function() {
  if(config.visualSize) {
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
const setDefaultSuffix = function() {
  //竖版的情况才调整
  if(config.screenVertical) {
    let ratio = window.devicePixelRatio || 1
    let maxWidth = getMaxWidth() * ratio

    if(maxWidth > 1080 && maxWidth < 1439) {
      config.baseImageSuffix = config.imageSuffix['1080']
    }
    if(maxWidth > 1440) {
      config.baseImageSuffix = config.imageSuffix['1440']
    }
    if(config.devtools && config.baseImageSuffix) {
      $$warn('css media匹配suffix失败，采用js采用计算. config.baseImageSuffix =' + config.baseImageSuffix)
    }
  }
}


export default function baseConfig(callback) {

  //mini杂志设置
  //如果是pad的情况下设置font为125%
  if(config.platform === 'mini' && Xut.plat.isTablet) {
    $('body').css('font-size', '125%')
  }

  //图片分辨了自适应
  if(config.imageSuffix) {
    let $adaptiveImageNode = $('.xut-adaptive-image')
    if($adaptiveImageNode.length) {
      let baseImageType = $adaptiveImageNode.width()
      let type = config.imageSuffix[baseImageType]
      if(type) {
        //定义基础的图片后缀
        config.baseImageSuffix = type
      } else {
        setDefaultSuffix()
      }
    } else {
      setDefaultSuffix()
    }
  }

  //导入JSON数据缓存
  importJsonDatabase(() => {

    //初始化工具栏
    //与数据库setting数据
    initTooBar((novelData, tempSettingData) => {

      /*配置优先级*/
      priorityConfig()

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
      if(!Xut.IBooks.Enabled) {
        createCursor()
      }

      //初始资源地址
      initPathAddress()

      //全局样式
      loadStyle('svgsheet', () => {
        /**
         * 初始分栏排版
         * 嵌入index分栏
         * 默认有并且没有强制设置关闭的情况，打开缩放
         */
        initColumn(haColumnCounts => {
          if(haColumnCounts) {
            //动画事件委托
            if(config.swipeDelegate !== false) {
              config.swipeDelegate = true
            }
          }
          callback(novelData)
        })
      })
    })
  })
}
