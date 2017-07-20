import { config } from '../../../../../config/index'
import { getFileFullPath } from '../../../../../util/option'

const maskBoxImage = Xut.style.maskBoxImage

/**
 * 修正尺寸
 * @return {[type]} [description]
 */
const setDataSize = function(data) {
  //缩放比
  const proportion = config.proportion

  if(data.imageWidth) {
    data.imageWidth = data.imageWidth * proportion.width
  }
  if(data.imageHeight) {
    data.imageHeight = data.imageHeight * proportion.height
  }
  if(data.imageLeft) {
    data.imageLeft = data.imageLeft * proportion.left
  }
  if(data.imageTop) {
    data.imageTop = data.imageTop * proportion.top
  }
}


/**
 * 计算出对页排版偏移值
 * @return {[type]} [description]
 */
const getOffset = function(pageSide) {
  let background
  switch(Number(pageSide)) {
    case 1:
      background = 'background-position:0'
      break
    case 2:
      background = 'background-position:' + config.screenSize.width + 'px'
      break
  }
  return background
}



/**
 * 创建分层背景图层
 * [createMaster description]
 * @param  {[type]} svgContent [description]
 * @param  {[type]} data       [description]
 * @return {[type]}            [description]
 */
export default function createBackground(svgContent, data) {

  var imageLayer,
    maskLayer,
    imageLayerData = data.imageLayer, //图片层
    imageMaskData = data.imageMask, //蒙版层
    backImageData = data.backImage, //真实图片层
    backMaskData = data.backMask, //真实蒙版层
    masterData = data.master, //母板
    backText = data.md5, //背景文字
    pptMaster = data.pptMaster; //母板PPTID

  /**
   * 未分层结构
   * 只有SVG数据，没有层次数据 ,不是视觉差
   * @return {[type]}          [description]
   */
  if(backText && !masterData && !pptMaster && !imageLayerData && !backImageData) {
    return svgContent ?
      String.styleFormat(`<div data-multilayer ="true"class="multilayer"> ${svgContent} </div>`) :
      ''
  }


  /**
   * 分层结构
   * 1 分母板 文字层 背景 蒙版
   * 2 视觉差分层处理
   */

  /**
   * 修正尺寸
   */
  setDataSize(data);


  /**
   * 母版图
   * 如果有母板数据,如果不是视觉差
   * @return {[type]} [description]
   */
  let masterHTML = ''
  if(masterData && !pptMaster) {
    masterHTML = `<div class="multilayer-master" style="background-image:url(${getFileFullPath(masterData,'multilayer-master')})"></div>`
  }

  /**
   * 存在背景图
   * @return {[type]}
   */
  let maskHTML = ''
  if(imageLayerData) {
    //蒙版图（与背景图是组合关系）
    const maskLayer = data.imageMask ? maskBoxImage + ":url(" + getFileFullPath(data.imageMask,'multilayer-maskLayer') + ");" : "";
    const maskImage = getFileFullPath(imageLayerData,'multilayer-maskImage')
    maskHTML =
      `<div class="multilayer-imageLayer"
            style="width:${data.imageWidth}px;
                   height:${data.imageHeight}px;
                   top:${data.imageTop}px;
                   left:${data.imageLeft}px;
                   background-image:url(${maskImage});${maskLayer}">
       </div>`
  }

  /**
   * 新增的 真实背景图 默认全屏
   * @return {[type]
   */
  let backImageHTML = ''
  if(backImageData) {
    //计算出对页排版偏移值
    const backImageOffset = getOffset(data.pageSide)
    const backImagePosition = backImageOffset ? backImageOffset : ''
    const newWidth = backImageOffset ? '200%' : '100%'
    const newBackImage = getFileFullPath(backImageData,'multilayer-backImage')
    const newBackMask = getFileFullPath(backMaskData,'multilayer-backMask')
    if(backMaskData) {
      //带蒙版
      if(maskBoxImage != undefined) {
        backImageHTML =
          `<div class="multilayer-backImage"
                style="width:${newWidth};
                       background-image:url(${newBackImage});
                       ${maskBoxImage}:url(${newBackMask});
                       ${ backImagePosition }">
           </div>`
      } else {
        //无蒙版
        backImageHTML =
          `<canvas class="multilayer-backImage edges"
                   height=${document.body.clientHeight}
                   width=${document.body.clientWidth}
                   src=${newBackImage}
                   mask=${newBackMask}
                   style="width:${newWidth};
                          opacity:0;
                          ${maskBoxImage}:url(${newBackImage});
                          ${ backImagePosition }">
           </canvas>`
      }
    } else {
      //图片层
      backImageHTML = `<div class="multilayer-backImage"
                            style="width:${newWidth};
                                   background-image:url(${newBackImage});
                                   ${ backImagePosition }">
                       </div>`
    }
  }

  /*存在svg文字*/
  const backTextHTML = backText ? `<div class="multilayer-word"> ${svgContent} </div>` : ''

  /*组层背景图开始*/
  return String.styleFormat(
    `<div data-multilayer ="true"
          class="multilayer">
        ${masterHTML}
        ${maskHTML}
        ${backImageHTML}
        ${backTextHTML}
    </div>`
  )
}
