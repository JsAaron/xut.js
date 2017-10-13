/**
 * 编译content的容器
 * 2013.10.12
 * 1 为处理重复content数据引用问题,增加
 *            createScopeWarpObj方法,用于隔绝content数据的引用关系，导致重复数据被修正的问题
 * 2 多个页面引用同一个content的处理，Conetnt_0_1 ,类型+页码+ID的标示
 * @return {[type]} [description]
 */

import { config } from '../../../../../../config/index'
import { createDom } from './render/dom'
import { createCanvas } from './render/canvas'
import { createContainer } from './render/container'
import { parseCanvas } from '../parser/canvas'
import { parseContentData } from '../parser/dataset'
import {
  $warn,
  parseJSON,
  reviseSize,
  readFileContent,
  getResources,
  createRandomImg,
  getFileFullPath
} from '../../../../../../util/index'

/**
 * 制作包装对象
 * 用于隔绝content数据的引用关系
 * 导致重复数据被修正的问题
 * @return {[type]}             [description]
 */
function createScopeWarpObj(contentId, content, pageType, chapterIndex) {
  //唯一标示符
  let prefix = "_" + chapterIndex + "_" + contentId;
  let fileName = content.md5

  return {
    pageType: pageType,
    contentId: contentId,
    isJs: /.js$/i.test(fileName), //html类型
    isSvg: /.svg$/i.test(fileName), //svg类型
    contentData: content,
    chapterIndex: chapterIndex,
    containerName: 'Content' + prefix,
    makeId(name) {
      return name + prefix;
    }
  }
}



/**
 * 创建图片地址
 * @return {[type]}         [description]
 */
const analysisPath = (wrapObj, conData) => {

  let resourcePath //资源路径,png/jpg/svg..
  let fileName = conData.md5
  let isGif = /.gif$/i.test(fileName)

  /*是自动精灵动画*/
  if (conData.category === "AutoCompSprite") {
    try {
      resourcePath = getFileFullPath(fileName, 'content-autoCompSprite', isGif)
      let results = getResources(resourcePath + '/app.json')
      let spiritList = results.spiritList[0]
      let actListName = spiritList.params.actList
      let name = spiritList.params[actListName].ImageList[0].name
      resourcePath += '/' + name
      conData.resource = results
      conData.containerName = wrapObj.containerName
    } catch (err) {
      console.log('AutoCompSprite获取数据失败')
    }
  } else {

    let fileFullPath = getFileFullPath(fileName, 'content', isGif)

    /*如果启动了预加载，去掉随机后缀*/
    if (config.launch.preload) {
      resourcePath = fileFullPath
    } else {
      //如果没有启动preload，需要随机，保证不缓存
      resourcePath = isGif ? createRandomImg(fileFullPath) : fileFullPath
    }

  }

  wrapObj.fileName = fileName;
  wrapObj.isGif = isGif;
  wrapObj.resourcePath = resourcePath;
}


/**
 * content
 *  svg数据
 *  html数据
 * 解析外部文件
 * @param  {[type]} wrapObj     [description]
 * @param  {[type]} svgCallback [description]
 * @return {[type]}             [description]
 */
const externalFile = (wrapObj, svgCallback) => {
  //svg零件不创建解析具体内容
  if (wrapObj.isSvg) {
    readFileContent(wrapObj.contentData.md5, (svgdata) => {
      wrapObj.svgstr = svgdata
      svgCallback(wrapObj)
    });
  } else if (wrapObj.isJs) {
    //如果是.js的svg文件
    readFileContent(wrapObj.contentData.md5, (htmldata) => {
      wrapObj.htmlstr = htmldata
      svgCallback(wrapObj)
    }, "js")
  } else {
    svgCallback(wrapObj)
  }
}


/**
 * 分配缩放比
 * @return {[type]} [description]
 */
const allotRatio = (fixRadio, headerFooterMode) => {
  if (fixRadio && headerFooterMode) {
    $warn({
      type: 'pagebase',
      content: 'content缩放模式fixRadio与headerFooterMode重叠,优先选择headerFooterMode模式'
    })
  }
  //页眉页脚模式
  if (headerFooterMode) {
    return headerFooterMode
  }
  //设置图片缩放模式1
  if (fixRadio) {
    return 3
  }
}

//=====================================================
//
//  构建content的序列tokens
//  createImageIds,
//  createContentIds
//  pageType,
//  dydCreate //重要判断,动态创建
//
//=======================================================
export function contentStructure(pipeData, $$floatDivertor, callback) {

  let content,
    contentId,
    wrapObj,
    containerObj,
    sizeResults,
    contentCollection,
    contentCount,
    cloneContentCount,
    chapterIndex = pipeData.chapterIndex,
    pageType = pipeData.pageType,
    containerRelated = pipeData.containerRelated,
    seasonRelated = pipeData.seasonRelated,
    isMaster = pageType === 'master',
    //文本框
    //2016.1.7
    contentHtmlBoxIds = [],
    //所有content的id记录
    //返回出去给ibooks预编译使用
    idFix = [],
    //文本效果
    //2017.1.3
    //收集对应的content数据
    textFx = [],
    //缓存contentDataset
    contentDataset = {},
    //缓存content结构
    cachedContentStr = [],
    //页眉页脚对象合集
    headerFooterMode = {},
    //自定义样式
    getStyle = pipeData.getStyle;

  /*开始过滤参数*/
  if (containerRelated && containerRelated.length) {
    containerObj = createContainer(containerRelated, chapterIndex, getStyle);
  }

  /**
   * 转化canvas模式 contentMode 0/1
   * 页面或者母板浮动对象
   * 页面是最顶级的
   */
  function parseContentParameter(parameter, contentId, conData) {
    _.each(parameter, (para) => {
      /*如果有css3的滤镜效果*/
      if (para.filter && para.filter.length) {
        conData.filterNames = parseJSON(para.filter)
      }
      /*是否启动代码追踪*/
      if (para.trackCode) {
        conData.trackCode = true
      }
      /*在模式2与3模式下元素可能会溢出,保证不溢出处理*/
      if (para.fixedPosition) {
        conData.fixedPosition = Number(para.fixedPosition)
      }
      //如果有二维码标记
      //2017.3.1
      if (para.qrCode) {
        conData.qrCode = true
      }
      //有页眉页脚对象
      //2017.1.18
      if (para.HeaderOrFooter) {
        if (headerFooterMode[contentId]) {
          $warn({
            type: 'pagebase',
            content: '页眉页脚对象重复设置,contentId:' + contentId
          })
        }
        headerFooterMode[contentId] = Number(para.HeaderOrFooter)
      }
      //保持图片正比缩放
      //给mini使用
      //2016.12.15
      if (para.fixRadio) {
        conData.fixRadio = true
      }
      //针对母版content的topmost数据处理，找出浮动的对象Id
      //排除数据topmost为0的处理
      let zIndex = para['topmost']
      if (zIndex && zIndex != 0) {
        if (isMaster) {
          //收集浮动的母版对象id
          $$floatDivertor.master.ids.push(contentId)
          $$floatDivertor.master.zIndex[contentId] = zIndex
        } else {
          //浮动页面
          $$floatDivertor.page.ids.push(contentId)
          $$floatDivertor.page.zIndex[contentId] = zIndex
        }
      }
    })
  }

  /*开始过滤参数*/
  function prefilter(conData, contentId) {
    //如果是模板书签，强制为浮动对象
    let eventId;
    if (isMaster && (eventId = seasonRelated[contentId])) {
      if (eventId['BookMarks']) {
        $$floatDivertor.master.ids.push(contentId)
      }
    }

    //如果有parameter参数
    //1 浮动对象
    //2 canvas对象
    if (conData) {
      /*匹配canvas对象数据*/
      conData.category && parseCanvas(contentId, conData.category, conData, pipeData)

      /*如果有parameter,保持数据格式，方便解析*/
      let parameter
      if (parameter = conData.parameter && parseJSON(conData.parameter)) {
        parseContentParameter(parameter.length ? parameter : [parameter], contentId, conData)
      }
    }
  }

  /**
   * 解析出每一个content对应的动作
   * 传递prefilter过滤器
   * 1 浮动动作
   * 2 canvas动作
   * @type {[type]}
   */
  contentCollection = parseContentData(pipeData.createContentIds, prefilter);
  contentCount = cloneContentCount = contentCollection.length;


  //如果是启动了特殊高精灵动画
  //强制打开canvas模式设置
  //这里可以排除掉其余的canvas动画
  if (pipeData.canvasRelated.onlyCompSprite) {
    pipeData.canvasRelated.enable = true
  }

  /*创建content节点*/
  function createRelated(contentId, wrapObj) {
    externalFile(wrapObj, function(wrapObj) {
      let uuid, startStr, contentStr
      let conData = wrapObj.contentData

      /*分析图片地址*/
      analysisPath(wrapObj, conData)

      //////////////////////
      /// 扩展给PPT调用
      /// 处理一次性APNG的不播放问题
      //////////////////////
      conData.resourcePath = wrapObj.resourcePath

      //canvas节点
      if (conData.canvasMode) {
        contentStr = createCanvas(conData, wrapObj)
      } else {
        //dom节点
        contentStr = createDom(conData, wrapObj)
      }
      //如果创建的是容器对象
      if (containerObj && (uuid = containerObj[contentId])) {
        startStr = containerObj[uuid];
        startStr.start.push(contentStr)
      } else {
        //普通对象
        cachedContentStr.unshift(contentStr);
      }
      //检测完毕
      checkComplete();
    });
  }

  /*开始创建*/
  function startCreate(wrapObj, content, contentId) {
    contentDataset[contentId] = content; //缓存数据
    createRelated(contentId, wrapObj)
  }

  /*清理剔除的content*/
  function clearContent(contentId) {
    pipeData.createContentIds.splice(pipeData.createContentIds.indexOf(contentId), 1);
    checkComplete();
  }

  /*返回处理*/
  function checkComplete() {
    if (cloneContentCount === 1) {
      const userData = {
        contentDataset,
        idFix,
        textFx,
        contentHtmlBoxIds,
        headerFooterMode,
        containerPrefix: ''
      }

      //针对容器处理
      if (containerObj) {
        var start, end, containerPrefix, containerStr
        containerStr = []

        //合并容器
        containerObj.createUUID.forEach(function(uuid) {
          start = containerObj[uuid].start.join('');
          end = containerObj[uuid].end;
          containerStr.push(start.concat(end));
        })
        containerStr = containerStr.join('');
        containerPrefix = containerObj.containerName;
        containerObj = null;
        userData.contentStr = cachedContentStr.join('').concat(containerStr)
        userData.containerPrefix = containerPrefix
      } else {
        userData.contentStr = cachedContentStr.join('')
      }
      callback(userData)
    }
    cloneContentCount--;
  }

  //开始生成所有的节点
  //1:dom
  //2:canvas
  while (contentCount--) {
    //根据数据创content结构
    if (content = contentCollection[contentCount]) {
      contentId = content['_id'];
      //创建包装器,处理数据引用关系
      wrapObj = createScopeWarpObj(contentId, content, pageType, chapterIndex);

      idFix.push(wrapObj.containerName)

      //如果有文本效果标记
      //content.texteffect = " "//数据库写错，多了一个空格
      if (content.texteffect && content.texteffect.trim()) {
        content.texteffectId = wrapObj.containerName
        textFx.push(content)
      }
      //保存文本框content的Id
      if (wrapObj.isJs) {
        contentHtmlBoxIds.push(contentId)
      }

      /*转换缩放比*/
      const setRatio = function(proportion = getStyle.pageProportion) {
        sizeResults = reviseSize({
          results: wrapObj.contentData,
          getStyle: getStyle,
          proportion,
          zoomMode: allotRatio(content.fixRadio, headerFooterMode[contentId])
        })
      }
      setRatio()

      /*设置页面缩放比*/
      const setPageProportion = function(baseRatio) {
        let pageProportion = {}
        _.each(getStyle.pageProportion, function(prop, key) {
          pageProportion[key] = prop * baseRatio
        })
        return pageProportion
      }

      /*溢出模式才计算，保证元素不溢出，继续修正缩放比*/
      if (content.fixedPosition && getStyle.pageVisualMode === 3) {
        let originalTop = sizeResults.scaleTop
        let originalHeight = sizeResults.scaleHeight
        let visualLeftInteger = getStyle.visualLeftInteger
        let layerWidth = sizeResults.scaleWidth + sizeResults.scaleLeft
        let overflowMode = ''

        //左边溢出
        if (visualLeftInteger > sizeResults.scaleLeft) {
          overflowMode = 'left'
        }

        //右边溢出
        let rightVisual = getStyle.visualWidth - visualLeftInteger
        if (layerWidth > rightVisual) {
          if (overflowMode === 'left') {
            overflowMode = 'all' //全溢出
          } else {
            overflowMode = 'right'
          }
        }

        if (overflowMode === 'left') {
          let baseRatio = (sizeResults.scaleWidth - visualLeftInteger) / sizeResults.scaleWidth
          setRatio(setPageProportion(baseRatio))
          let ratioWidth = (layerWidth - sizeResults.scaleWidth - visualLeftInteger) / 2
          sizeResults.scaleLeft = visualLeftInteger + ratioWidth
          sizeResults.scaleTop = originalTop + ((originalHeight - sizeResults.scaleHeight) / 2)
        } else if (overflowMode === 'right') {
          let baseRatio = rightVisual / layerWidth
          setRatio(setPageProportion(baseRatio))
          sizeResults.scaleTop = originalTop + ((originalHeight - sizeResults.scaleHeight) / 2)
        } else if (overflowMode === 'all') { //左右都溢出
          //强制全屏
          let baseRatio = config.screenSize.width / sizeResults.scaleWidth
          setRatio(setPageProportion(baseRatio))
          sizeResults.scaleLeft = visualLeftInteger
          sizeResults.scaleTop = originalTop + ((originalHeight - sizeResults.scaleHeight) / 2)
        }
      }

      //如果是隐藏的页面页脚，重写这个标记
      if (sizeResults.isHide && headerFooterMode[contentId]) {
        headerFooterMode[contentId] = 'hide'
      }

      //正常模式下创建
      startCreate(wrapObj, content, contentId)
    } else {
      //或者数据出错
      checkComplete();
    }
  }
}
