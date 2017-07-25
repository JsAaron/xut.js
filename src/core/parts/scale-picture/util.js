import { config } from '../../config/index'

/**
 * given the wrapper's width and height,
 * calculates the final width, height, left and top for the image to fit inside
 * @param  {[type]} imageSize   [description]
 * @param  {[type]} wrapperSize [description]
 * @return {[type]}             [description]
 */
function getFinalSizePosition(imageSize, wrapperSize) {

  // image size
  var imgW = imageSize.width,
    imgH = imageSize.height,
    // container size
    wrapperW = wrapperSize.width,
    wrapperH = wrapperSize.height,
    finalW, finalH, finalL, finalT,
    // flag to indicate we could check for another source (smaller) for the image
    checksource = false,
    ratio;

  //宽度100% 自适应高度
  var widthFullAdaptiveHeight = function () {
    finalW = wrapperW;
    // calculate the height given the finalW
    ratio = imgW / wrapperW;
    finalH = imgH / ratio;
    if (finalH > wrapperH) {
      checksource = true;
      ratio = finalH / wrapperH;
      finalW /= ratio;
      finalH = wrapperH;
    }
  }

  //高度100% 自适应宽度
  var heightFullAdaptiveWidth = function () {
    finalH = wrapperH;
    // calculate the width given the finalH
    ratio = imgH / wrapperH;
    finalW = imgW / ratio;
    checksource = true;
    if (finalW > wrapperW) {
      checksource = false;
      ratio = finalW / wrapperW;
      finalW = wrapperW;
      finalH /= ratio;
    }
  }

  // check which image side is bigger
  //横屏图片
  if (imgW > imgH) {
    widthFullAdaptiveHeight();
  } else {
    //竖屏图片
    //竖版显示
    if (wrapperH > wrapperW) {
      widthFullAdaptiveHeight();
    }
    //横版显示
    else {
      heightFullAdaptiveWidth();
    }

  }

  return {
    width: finalW,
    height: finalH,
    left: (wrapperW - finalW) / 2 - wrapperSize.left,
    top: (wrapperH - finalH) / 2,
    checksource: checksource
  }
}


/**
 * 随机生成0-30之间的不重复的数字作为li的id
 * @return {[type]} [description]
 */
export function createUnpeatableNumbers() {
  var rand = parseInt(Math.random() * 30);
  if ($("#oriHdimg" + rand).length > 0) {
    return createUnpeatableNumbers();
  }
  return rand;
}


/**
 * the single view will include the image
 * navigation buttons and close, play, and pause buttons
 * @return {[type]} [description]
 */
export function createContainerView(imgContainer) {
  let html;
  let visualSize = config.visualSize
  let right = visualSize.overflowWidth && Math.abs(visualSize.right) || 0
  let top = visualSize.overflowHeight && Math.abs(visualSize.top) || 0
  let rightCopy = right + 4;
  let rightCopy2 = right + 3.5;
  let topCopy = top + 4;

  let zoomImg = `<img class="xut-zoom-fly"
                      src="${imgContainer.originSrc}"
                      style="width:${imgContainer.width}px;
                             height:${imgContainer.height}px;
                             top:${imgContainer.top}px;
                             left:${imgContainer.left}px;" />`

  if (config.screenHorizontal) {
    html = `<div class="xut-zoom-view">
                <div class="xut-zoom-overlay"></div>
                <div class="xut-zoom-close" style="right:${rightCopy}px;top:${topCopy}px;">
                    <div class="si-icon Flaticon xut-flaticon-error" style="font-size:5vw;border-radius:50%;right:0">
                    </div>
                </div>
                ${zoomImg}
            </div>`;
  } else {
    //竖屏
    html = `<div class="xut-zoom-view">
                <div class="xut-zoom-overlay"></div>
                <div class="xut-zoom-close" style=";right:${rightCopy}px;top:${topCopy}px;">
                    <div class="si-icon Flaticon xut-flaticon-error" style="font-size:5vh;border-radius:50%;right:0">
                    </div>
                </div>
                ${zoomImg}
            </div>`;

  }

  return String.styleFormat(html)
}


/**
 * choose a source based on the item's size and on the configuration
 * set by the user in the initial HTML
 */
export function chooseImgSource(sources, w) {
  if (w <= 0) w = 1;
  for (var i = 0, len = sources.length; i < len; ++i) {
    var source = sources[i];
    if (w > source.width)
      return source;
  }
}


/**
 * 执行动画
 */
export function execAnimation({
  element,
  style,
  speed = 100
}, callback = function () {}) {
  if (!element) return
  setTimeout(function () {
    element.stop().transition(style, speed, 'linear', callback)
  }, 0)
}


export function getImgConfig(properties) {
  let imgMaxW = 0
  let imgMaxH = 0
  let sources = properties.sources
  let source = chooseImgSource(sources, properties.wrapper.width)

  // calculate final size and position of image
  let finalSizePosition = getFinalSizePosition(properties.image, properties.wrapper)


  // we still need to check one more detail:
  // if the source is the largest one provided in the html rules,
  // then we need to check if the final width/height are eventually bigger
  // than the original image sizes. If so, we will show the image
  // with its original size, avoiding like this that the image gets pixelated
  if (source.pos === 0 && (imgMaxW !== 0 && finalSizePosition.width > imgMaxW || imgMaxH !== 0 && finalSizePosition.height > imgMaxH)) {
    if (imgMaxW !== 0 && finalSizePosition.width > imgMaxW) {
      var ratio = finalSizePosition.width / imgMaxW;
      finalSizePosition.width = imgMaxW;
      finalSizePosition.height /= ratio;
    } else if (imgMaxH !== 0 && finalSizePosition.height > imgMaxH) {
      var ratio = finalSizePosition.height / imgMaxH;
      finalSizePosition.height = imgMaxH;
      finalSizePosition.width /= ratio;
    }
    finalSizePosition.left = properties.wrapper.width / 2 - finalSizePosition.width / 2;
    finalSizePosition.top = properties.wrapper.height / 2 - finalSizePosition.height / 2;
  }
  return {
    source: source,
    position: finalSizePosition
  }

}

/**
 * gets the position and sizes of the image given its container properties
 */
export function getFinalImgConfig(properties, imgMaxW = 0, imgMaxH = 0) {
  var sources = properties.sources,
    source = chooseImgSource(sources, properties.wrapper.width),
    // calculate final size and position of image
    finalSizePosition = getFinalSizePosition(properties.image, properties.wrapper);

  // check for new source
  if (finalSizePosition.checksource) {
    source = chooseImgSource(sources, finalSizePosition.width);

  }

  // we still need to check one more detail:
  // if the source is the largest one provided in the html rules,
  // then we need to check if the final width/height are eventually bigger
  // than the original image sizes. If so, we will show the image
  // with its original size, avoiding like this that the image gets pixelated
  if (source.pos === 0 && (imgMaxW !== 0 && finalSizePosition.width > imgMaxW || imgMaxH !== 0 && finalSizePosition.height > imgMaxH)) {
    if (imgMaxW !== 0 && finalSizePosition.width > imgMaxW) {
      var ratio = finalSizePosition.width / imgMaxW;
      finalSizePosition.width = imgMaxW;
      finalSizePosition.height /= ratio;
    } else if (imgMaxH !== 0 && finalSizePosition.height > imgMaxH) {
      var ratio = finalSizePosition.height / imgMaxH;
      finalSizePosition.height = imgMaxH;
      finalSizePosition.width /= ratio;
    }
    finalSizePosition.left = properties.wrapper.width / 2 - finalSizePosition.width / 2;
    finalSizePosition.top = properties.wrapper.height / 2 - finalSizePosition.height / 2;
  }
  return {
    source: source,
    finalSizePosition: finalSizePosition
  }

}
