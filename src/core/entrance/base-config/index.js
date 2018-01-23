import initDatabse from './init-database'
import getSetData from './set-data'
import { importJsonDatabase } from 'database/result'
import { $warn, loadGlobalStyle, nextTick } from '../../util/index'
import { initRootNode } from '../../expand/root-node'
import { initColumn } from '../../component/column/init'
import { contentFilter } from '../../component/activity/content/content-filter'
import { config, initConfig, initPathAddress } from '../../config/index'
import { initPreload, loadPrelaod } from 'preload/index'
import { adaptiveImage } from './adp-image'
import {
  setLaunch,
  resetBrMode,
  resetDelegate,
  setHistory,
  setPaintingMode
} from '../../config/launch-config/index.js'


export default function baseConfig(callback) {

  //导入数据库
  importJsonDatabase(results => setDatabse(results))

  /**
   * 根据数据库的配置设置
   */
  function setDatabse(results) {
    initDatabse(results, function(dataRet) {
      $warn('logic', '初始化数据库完成')
      const novelData = dataRet.Novel.item(0)
      const setData = getSetData(dataRet.Setting)
      const chapterTotal = dataRet.Chapter.length
      setBaseConfig(novelData, setData, chapterTotal)
    })
  }

  /**
   * 设置一些基础配置
   */
  function setBaseConfig(novelData, setData, chapterTotal) {
    //配置lanuch
    setLaunch(novelData)
    //配置config
    setConfig(novelData, setData)
    //配置图片
    setImage()
    //创建根节点
    //开始预加载文件
    createRoot(() => initPrelaod(novelData, chapterTotal))
  }

  /**
   * 处理预加载文件
   * @return {[type]} [description]
   */
  function initPrelaod(novelData, chapterTotal) {
    loadPrelaod(function(hasPreFile, globalBrMode) {
      resetBrMode(hasPreFile, globalBrMode)
      loadStyle(novelData, chapterTotal)
    })
  }

  /**
   * 加载样式
   * @return {[type]} [description]
   */
  function loadStyle(novelData, chapterTotal) {
    /*加载svg的样式*/
    loadGlobalStyle('svgsheet', function() {
      //判断是否有分栏处理
      setColumn(function() {
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

/**
 * 创建根节点
 * @return {[type]} [description]
 */
function createRoot(complete) {
  //根节点
  const { $rootNode, $contentNode } = initRootNode(config.launch.el, config.launch.cursor);
  $warn('logic', '初始化设置参数完成')
  nextTick({
    container: $rootNode,
    content: $contentNode
  }, complete)
}

/*
  配置初始化
 */
function setConfig(novelData, tempSettingData) {
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
  //初始资源地址
  initPathAddress()
}

/**
 * 初始分栏排版
 * 嵌入index分栏
 * 默认有并且没有强制设置关闭的情况，打开缩放
 */
function setColumn(callback) {
  initColumn(haColumnCounts => {
    if (haColumnCounts) {
      resetDelegate()
    }
    callback()
  })
}

function setImage() {
  //mini杂志设置
  //如果是pad的情况下设置font为125%
  if (config.launch.platform === 'mini' && Xut.plat.isTablet) {
    $('body').css('font-size', '125%')
  }
  /*图片分辨了自适应*/
  if (config.launch.imageSuffix) {
    adaptiveImage()
  }
}
