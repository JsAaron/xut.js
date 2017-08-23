import { config } from '../../../../../../../config/index'
import {
  parseJSON,
  replacePath,
  getFileFullPath
} from '../../../../../../../util/index'

const maskBoxImage = Xut.style.maskBoxImage
const FLOOR = Math.floor


/**
 * 蒙版动画
 */
const maskContent = (data, wrapObj) => {

  //如果有蒙版图
  let isMaskImg = data.mask ? maskBoxImage + ":url(" + getFileFullPath(data.mask, 'content-mask') + ");" : ""
  let resourcePath = wrapObj.resourcePath
  let restr = ""

  function getImgSrc() {
    return `src="${resourcePath}"
            onerror="fixNodeError('image',this,'${wrapObj.chapterIndex}','${resourcePath}')"
            style="${isMaskImg}"`
  }

  //蒙板图
  if (data.mask || wrapObj.isGif) {
    //蒙版图
    if (maskBoxImage != undefined) {
      restr += String.styleFormat(
        `<img data-type="${data.qrCode ? 'qrcode' : 'mask'}"
              class="inherit-size fullscreen-background edges"
              ${getImgSrc()}/>`
      )
    } else {
      //canvas
      restr += String.styleFormat(
        `<canvas class="inherit-size fullscreen-background edges"
                 src="${resourcePath}"
                 mask="${isMaskImg}"
                 width="${data.scaleWidth}"
                 height="${data.scaleHeight}"
                 style="opacity:0;${config.data.pathAddress.replace(/\//g, "\/") + data.mask}"/>`
      )
    }

    //精灵图
  } else if (data.category == 'Sprite') {

    let matrixX = 100 * data.thecount;
    let matrixY = 100;

    //如果有参数
    //精灵图是矩阵图
    if (data.parameter) {
      let parameter = parseJSON(data.parameter);
      if (parameter && parameter.matrix) {
        let matrix = parameter.matrix.split("-")
        matrixX = 100 * Number(matrix[0])
        matrixY = 100 * Number(matrix[1])
      }
    }
    restr += String.styleFormat(
      `<div data-type="sprite-images"
            class="sprite"
            style="height:${data.scaleHeight}px;
                   background-image:url(${resourcePath});
                   background-size:${matrixX}% ${matrixY}%;">
      </div>`
    )
  } else {
    //普通图片
    restr += String.styleFormat(
      `<img data-type="${data.qrCode ? 'qrcode' : 'ordinary'}"
            class="inherit-size fullscreen-background fix-miaomiaoxue-img"
            ${getImgSrc()}/>`
    )
  }

  return restr
}


/**
 * 纯文本内容
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
const textContent = (data) => {
  return String.styleFormat(
    `<div id="${data['_id']}"
          style="background-size:100% 100%;height:auto">
          ${data.content}
    </div>`)
}

/**
 * 如果是.js结尾的
 * 新增的html文件
 * @param  {[type]} data    [description]
 * @param  {[type]} wrapObj [description]
 * @return {[type]}         [description]
 */
const jsContent = (data, wrapObj) => replacePath(wrapObj.htmlstr)

/**
 * 如果内容是svg
 * @param  {[type]} data    [description]
 * @param  {[type]} wrapObj [description]
 * @return {[type]}         [description]
 */
const svgContent = (data, wrapObj) => {
  let restr = ""
  let svgstr = wrapObj.svgstr
  let scaleWidth = data.scaleWidth

  //从SVG文件中，读取Viewport的值
  if (svgstr != undefined) {

    //替换svg内部读取文件地址
    svgstr = replacePath(svgstr)

    let startPos = svgstr.search('viewBox="');
    let searchTmp = svgstr.substring(startPos, startPos + 64).replace('viewBox="', '').replace('0 0 ', '');
    let endPos = searchTmp.search('"');
    let temp = searchTmp.substring(0, endPos);
    let sptArray = temp.split(" ");
    let svgwidth = sptArray[0];
    let svgheight = sptArray[1];

    //svg内容宽度:svg内容高度 = viewBox宽:viewBox高
    //svg内容高度 = svg内容宽度 * viewBox高 / viewBox宽
    let svgRealHeight = FLOOR(scaleWidth * svgheight / svgwidth);
    //如果svg内容高度大于布局高度则添加滚动条
    if (svgRealHeight > (data.scaleHeight + 1)) {
      let svgRealWidth = FLOOR(scaleWidth);
      //if there do need scrollbar, then restore text to its original prop
      //布局位置
      let marginleft = wrapObj.backMode ? data.scaleLeft - data.scaleBackLeft : 0;
      let margintop = wrapObj.backMode ? data.scaleTop - data.scaleBackTop : 0;

      if (data.isScroll) {
        restr = String.styleFormat(
          `<div data-type="svg"
                style="width:${svgRealWidth}px;
                       height:${svgRealHeight}px;
                       margin-left:${marginleft}px;
                       margin-top:${margintop}px;">
                ${svgstr}
          </div>`
        )
      } else {
        restr = String.styleFormat(
          `<div data-type="svg"
                class="inherit-size"
                style="margin-left:${marginleft}px;
                       margin-top:${margintop}px;">
              ${svgstr}
          </div>`
        )
      }
    } else {
      restr += svgstr
    }
  }
  return restr
}

/**
 * 填充content内容
 * @param  {[type]} data    [description]
 * @param  {[type]} wrapObj [description]
 * @return {[type]}         [description]
 */
const fillContent = (data, wrapObj) => {
  let restr = '';
  //如果内容是图片
  //如果是svg或者html
  if (wrapObj.fileName) {
    //如果是SVG
    if (wrapObj.isSvg) {
      restr += svgContent(data, wrapObj);
    }
    //如果是.js结构的html文件
    else if (wrapObj.isJs) {
      restr += jsContent(data, wrapObj)
    }
    //如果是蒙板，或者是gif类型的动画，给高度
    else {
      restr += maskContent(data, wrapObj);
    }
  }
  //纯文本文字
  else {
    restr += textContent(data, wrapObj);
  }
  return restr;
}



/**
 * 创建包含容器content
 * @param  {[type]} data    [description]
 * @param  {[type]} wrapObj [description]
 * @return {[type]}         [description]
 */
const createContainer = (data, wrapObj) => {
  let wapper
  let backwidth, backheight, backleft, backtop
  let zIndex = data.zIndex
  let id = data._id

  //Content_23_37
  //Content_23_38
  //Content_23_39
  let containerName = wrapObj.containerName

  //背景尺寸优先
  if (data.scaleBackWidth && data.scaleBackHeight) {
    backwidth = data.scaleBackWidth;
    backheight = data.scaleBackHeight;
    backleft = data.scaleBackLeft;
    backtop = data.scaleBackTop;
    wrapObj.backMode = true //背景图模式
  } else {
    backwidth = data.scaleWidth;
    backheight = data.scaleHeight;
    backleft = data.scaleLeft;
    backtop = data.scaleTop;
  }

  //content默认是显示的数据的
  //content.visible = 0
  //如果为1 就隐藏改成hidden
  //05.1.14
  let visibility = 'visible'
  if (data.visible) {
    visibility = 'hidden';
  }

  /*css3 滤镜效果 2017.5.12支持,filterNames数组形式*/
  const filterName = data.filterNames ? data.filterNames.join(' ') : ''


  // var isHtml = "";
  //2015.12.29
  //如果是html内容
  if (wrapObj.isJs) {
    wapper = `<div id="${containerName}"
                   data-behavior="click-swipe"
                   class="fullscreen-background ${filterName}"
                   style="width:${backwidth}px;
                          height:${backheight}px;
                          top:${backtop}px;
                          left:${backleft}px;
                          position:absolute;
                          z-index:${zIndex};
                          visibility:${visibility};
                          {10}">
               <div data-type="scroller"
                    style="width:${backwidth}px;
                           position:absolute;">`
    return String.styleFormat(wapper)
  } else {
    //scroller:=> absolute 因为别的元素有依赖
    let background = data.background ? 'background-image: url(' + getFileFullPath(data.background, 'content-container') + ');' : ''

    //正常content类型
    //如果是scroller需要绝对的尺寸，所以替换100% 不可以
    wapper = `<div id="${containerName}"
                   data-behavior="click-swipe"
                   class="${filterName}"
                   style="width:${backwidth}px;
                          height:${backheight}px;
                          top:${backtop}px;
                          left:${backleft}px;
                          position:absolute;
                          z-index:${zIndex};
                          visibility:${visibility}">
              <div data-type="scroller"
                   class="fullscreen-background "
                   style="width:${backwidth}px;
                          height:${backheight}px;
                          position:absolute;
                          ${background}">`

    return String.styleFormat(wapper)
  }

}



/**
 * 组成HTML结构
 * @param  {[type]} argument [description]
 * @return {[type]}          [description]
 */
export function createDom(data, wrapObj) {
  let restr = ''

  //创建包装容器content节点
  restr += createContainer(data, wrapObj)

  //创建内容
  restr += fillContent(data, wrapObj)
  restr += "</div></div>"

  return restr
}
