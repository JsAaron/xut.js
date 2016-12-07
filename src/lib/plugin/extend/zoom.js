import { config } from '../../config/index'
import {
    $$on,
    $$off
} from '../../util/dom'

/**
 * 随机生成0-30之间的不重复的数字作为li的id
 * @return {[type]} [description]
 */
function createUnpeatableNumbers() {
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
function createView() {
    let html;
    let viewSize = config.viewSize
    let right = viewSize.overflowWidth && Math.abs(viewSize.right) || 0
    let top = viewSize.overflowHeight && Math.abs(viewSize.top) || 0
    let rightCopy = right + 4;
    let rightCopy2 = right + 3.5;
    let topCopy = top + 4;

    //移动端
    //横屏
    if (config.screenSize.width > config.screenSize.height) {
        html = `<div class="gamma-single-view">
                    <div class="gamma-overlay"></div>
                    <div class="gamma-options gamma-options-single">
                        <div class="gamma-btn-close ionicons ion-ios-close"
                             style="font-size:6vw;width:6vw;height:6vw;
                                    position:absolute;
                                    top:${topCopy}px;
                                    right:${rightCopy}px;
                                    z-index:10001;
                                    text-align:center;
                                    cursor:pointer;">
                                <div class="ionicons ion-ios-close-outline"
                                     style="position:absolute;
                                            top:0;right:${rightCopy2}px;
                                            cursor:pointer;">
                                </div>
                        </div>
                    </div>
                </div>`;
    } else {
        //竖屏
        html = `<div class="gamma-single-view">
                    <div class="gamma-overlay"></div>
                    <div class="gamma-options gamma-options-single">
                        <div class="gamma-btn-close ionicons ion-ios-close"
                             style="font-size:6vh;width:6vh;height:6vh;
                                    position:absolute;
                                    top:${topCopy}px;
                                    right:${rightCopy}px;
                                    z-index:10001;
                                    text-align:center;
                                    cursor:pointer;">
                             <div class="ionicons ion-ios-close-outline"
                                  style="position:absolute;top:0;right:${rightCopy2};cursor:pointer;">
                             </div>
                        </div>
                    </div>
                </div>`;

    }

    return String.styleFormat(html)
}


// choose a source based on the item's size and on the configuration set by the user in the initial HTML
function chooseImgSource(sources, w) {
    if (w <= 0) w = 1;
    for (var i = 0, len = sources.length; i < len; ++i) {
        var source = sources[i];
        if (w > source.width)
            return source;
    }
}


// given the wrapper's width and height, calculates the final width, height, left and top for the image to fit inside
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
    var widthFullAdaptiveHeight = function() {
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
    var heightFullAdaptiveWidth = function() {
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
        left: wrapperW / 2 - finalW / 2,
        top: wrapperH / 2 - finalH / 2,
        checksource: checksource
    }
}


const transEndEventName = Xut.style.transitionEnd
const supportTransitions = true
const svImageTransitionSpeedFade = 100
const svImageTransitionEasingFade = 'ease-in-out'
const svImageTransitionSpeedResize = 200
const svImageTransitionEasingResize = 'ease-in-out'
const svMargins = { vertical: 0, horizontal: 0 }
const speed = 100
const easing = 'ease'
const overlayAnimated = true;

const $body = $('body');

/**
 * 图片缩放功能
 * 2016.12.5
 */
export default class Zoom {

    constructor({
        container,
        element,
        originalSrc,
        hdSrc
    }) {

        this.originSrc = originalSrc
        this.hdSrc = hdSrc
        this.$imgNode = element
        this.$container = container
console.log(this.$imgNode,this.$imgNode.parent().css('left'))

        //原始图位置
        this.originImgWidth = parseInt(container.css('width'))
        this.originImgHeight = parseInt(container.css('height'))
        this.originImgLeft = parseInt(container.css('left')) + config.viewSize.left
        this.originImgTop = parseInt(container.css('top')) + config.viewSize.top

        this.source = [{
            pos: 0,
            src: hdSrc ? hdSrc : originalSrc,
            width: 200
        }]

        this.play()
    }

    /**
     * 播放
     * @return {[type]} [description]
     */
    play() {
        this._initSingleView()
        this._initData()
        this._startZoom()
    }

    /**
     * 构建容器
     * @return {[type]} [description]
     */
    _initSingleView() {
        this.singleview = $(createView())
        this.singleview.appendTo($body)
        this.overlay = this.singleview.find('.gamma-overlay')
        this.svclose = this.singleview.find('div.gamma-btn-close')
        this.callbackEnd = () => {
            this._closeSingleView()
        }
        $$on(this.svclose[0], {
            end: this.callbackEnd,
            cancel: this.callbackEnd
        })
    }

    /**
     * 创建原图img对象，克隆到新的节点
     * 用于缩放
     * @return {[type]} [description]
     */
    _createOriginImgNode() {
        let $container = this.$container
        let imgLeft = parseInt($container.css('left')) + config.viewSize.left
        let imgTop = parseInt($container.css('top')) + config.viewSize.top
        let flyImgHTML = String.styleFormat(`
            <img src="${this.originSrc}"
                 class="gamma-img-fly"
                 style="width:${this.originImgWidth}px;
                        height:${this.originImgHeight}px;
                        left:${this.originImgLeft}px;
                        top:${this.originImgTop}px;">`)

        this.$flyNode = $(flyImgHTML)
        this.singleview.append(this.$flyNode)
    }

    /**
     * 初始化缩放数据
     * @return {[type]} [description]
     */
    _initData() {
        this._createOriginImgNode()
        this.finalConfig = this._getImgConfig({
            sources: this.source,
            wrapper: {
                width: config.screenSize.width,
                height: config.screenSize.height
            },
            image: {
                width: this.originImgWidth,
                height: this.originImgHeight
            }
        })
    }

    /**
     * 执行缩放
     * @return {[type]} [description]
     */
    _startZoom() {
        let source = this.finalConfig.source
        let finalSizePosition = this.finalConfig.finalSizePosition
        let style = {
            width: finalSizePosition.width,
            height: finalSizePosition.height,
            left: finalSizePosition.left + $(window).scrollLeft() + svMargins.horizontal / 2,
            top: finalSizePosition.top + $(window).scrollTop() + svMargins.vertical / 2
        }

        //隐藏原图
        this.$imgNode.hide()
        this._execAnimation(this.$flyNode, style, () => {
            this._replaceHdImg(finalSizePosition, source.src);
        })
    }

    /**
     * 执行动画
     */
    _execAnimation(element, style, callback, speed = 100) {
        element.transition(style, speed, 'ease', callback)
    }

    /**
     * 创建高清img对象，克隆到新的节点
     * 用于缩放
     * @return {[type]} [description]
     */
    _createHdImgNode(position) {
        let imgWidth = position.width
        let imgHeight = position.height
        let imgLeft = position.left + svMargins.horizontal / 2
        let imgTop = position.top + svMargins.vertical / 2
        let hdImgHTML = String.styleFormat(`
            <img src="${this.hdSrc}"
                 class="gamma-img-fly"
                 style="width:${imgWidth}px;
                        height:${imgHeight}px;
                        left:${imgLeft}px;
                        top:${imgTop}px;">`)

        this.$hdImgNode = $(hdImgHTML)
        this.singleview.append(this.$hdImgNode)
    }

    /**
     * 替换成高清图
     */
    _replaceHdImg(position, src) {
        if (this.hdSrc) {
            this._createHdImgNode(position)
            this._execAnimation(this.$flyNode, { 'opacity': 0 }, () => {

            })
        }

    }

    _getImgConfig(properties, imgMaxW = 0, imgMaxH = 0) {
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
            finalSizePosition: finalSizePosition
        }

    }

    /**
     * gets the position and sizes of the image given its container properties
     */
    _getFinalImgConfig(properties, imgMaxW = 0, imgMaxH = 0) {
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

    /**
     * 关闭放大高清图
     * @return {[type]} [description]
     */
    _closeSingleView() {
        this._execAnimation(this.$hdImgNode, {
            width: this.originImgWidth,
            height: this.originImgHeight,
            left: this.originImgLeft,
            top: this.originImgTop
        }, () => {
            this.$imgNode.show()
            this.overlay.hide()
            this._execAnimation(this.$hdImgNode, { 'opacity': 0 }, () => {
                this.destroy()
            })
        });
    }

    /**
     * 销毁
     * @return {[type]} [description]
     */
    destroy() {
        console.log(123)
    }

}
