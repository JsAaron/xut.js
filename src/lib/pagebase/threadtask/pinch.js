import iconsConfig from '../../toolbar/base/iconconf.js'
import { svgIcon } from '../../toolbar/base/svgicon'
import { config } from '../../config/index'
import { letterFirstUpperCase } from '../../util/lang'

const transform = Xut.style.transform
const translateZ = Xut.style.translateZ
const transitionDuration = Xut.style.transitionDuration

const createSVGIcon = function(el, callback) {
    var options = {
        speed: 6000,
        onToggle: callback
    };
    return new svgIcon(el, iconsConfig, options);
}


const createCloseIcon = function() {
    const proportion = config.proportion
    const width = proportion.width * 55
    const height = proportion.height * 70
    const top = proportion.height * 10
    const right = config.viewSize.left ? Math.abs(config.viewSize.left) + (top * 2) : top * 2
    const html =
        `<div class="si-icon xut-scenario-close" 
                 data-icon-name="close" 
                 style="width:${width}px;height:${height}px;top:${top}px;right:${right}px">
            </div>'`
    return $(html)
}


const START_X = 0
const START_Y = 0


/**
 * 缩放平移
 * @param {[type]} node [description]
 */
export default class Pinch {


    /**
     * 创建按钮
     * @return {[type]} [description]
     */
    _createPinchButton() {
        const $pinchButton = createCloseIcon()
        createSVGIcon($pinchButton[0], () => {
            this._initState()
            this._requestUpdate()
            this._pinchButtonHide()
        })
        this.$pinchNode.after($pinchButton)
        return $pinchButton
    }


    /**
     * 缩放按钮显示
     * @return {[type]} [description]
     */
    _pinchButtonShow() {
        if (this._pinchButtonState) return
        if (this._$pinchButton) {
            this._$pinchButton.show()
        } else {
            this._$pinchButton = this._createPinchButton()
        }
        this._pinchButtonState = true
    }


    /**
     * 缩放按钮隐藏
     * @return {[type]} [description]
     */
    _pinchButtonHide() {
        this._$pinchButton.hide()
        this._pinchButtonState = false
    }


    /**
     * 相关母版
     * @return {[type]} [description]
     */
    _relatedMasterNode(pageIndex) {
        let belongMaster = Xut.Presentation.GetPageObj('master', pageIndex)
        if (belongMaster) {
            return belongMaster.getContainsNode()[0]
        }
    }


    /**
     * 更新样式
     * @return {[type]} [description]
     */
    _requestUpdate(speed = 0) {

        const updateTransform = () => {
            const data = this.data
            const styleText =
                `translate(${data.translate.x}px,${data.translate.y}px) ${translateZ}
                  scale(${data.scale},${data.scale})`
            this.pinchNode.style[transform] = styleText
            this.pinchNode.style[transitionDuration] = speed + 'ms'

            if (this.masterNode) {
                this.masterNode.style[transform] = styleText
                this.masterNode.style[transitionDuration] = speed + 'ms'
            }
            this.ticking = false
        }

        if (!this.ticking) {
            Xut.nextTick(updateTransform)
            this.ticking = true
        }
    }


    _initBind() {
        this.hammer = new Hammer.Manager(this.pinchNode)
        this.hammer.add(new Hammer.Pinch())

        //注册事件
        _.each([
            'pinchstart',
            'pinchmove',
            'pinchend',
            'panmove',
            'panend'
        ], eventName => {
            this.hammer.on(eventName, e => {
                this._stopPropagation(e)
                this['_on' + letterFirstUpperCase(eventName)](e)
            })
        })
    }


    _stopPropagation(ev) {
        //缩放时，阻止冒泡
        if (this.data.scale > 1) {
            ev.srcEvent.stopPropagation()
        }
    }


    /**
     * 缩放
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    _onPinchstart(ev) {
        if (!this.hammer.get('pan')) {
            this.hammer.add(new Hammer.Pan())
        }
    }

    _onPinchmove(ev) {
        //显示关闭按钮
        this._pinchButtonShow()
        this.data.scale = this.lastScale * ev.scale
        this._requestUpdate()
    }


    _onPinchend(ev) {
        //还原缩放比 
        if (this.data.scale <= 1) {
            this.data.scale = 1
            this._pinchButtonHide()
            this._requestUpdate(600)
        }
        //保存上一个缩放值
        this.lastScale = this.data.scale
    }


    _onPanmove(ev) {
        if (this.data.scale > 1) {
            if (this.currentX != START_X || this.currentY != START_Y) {
                this.data.translate = {
                    x: this.currentX + ev.deltaX,
                    y: this.currentY + ev.deltaY
                }
            } else {
                this.data.translate = {
                    x: START_X + ev.deltaX,
                    y: START_Y + ev.deltaY
                }
            }
            this._isBoundry(ev)
            this._requestUpdate();
        }
    }

    _onPanend(ev) {
        this.currentX = data.translate.x
        this.currentY = data.translate.y
    }


    /**
     * 边界判断
     * @return {Boolean} [description]
     */
    _isBoundry() {
        const pinchNode = this.pinchNode
        const scale = this.data.scale
        const horizontalBoundry = (scale - 1) / 2 * pinchNode.offsetWidth;
        const verticalBoundry = (scale - 1) / 2 * pinchNode.offsetHeight;
        if (scale > 1) {
            //左边界
            if (this.data.translate.x >= horizontalBoundry) {
                this.data.translate.x = horizontalBoundry
            }
            //右边界
            if (this.data.translate.x <= -horizontalBoundry) {
                this.data.translate.x = -horizontalBoundry
            }
            //上边界
            if (this.data.translate.y >= verticalBoundry) {
                this.data.translate.y = verticalBoundry
            }
            //下边界
            if (this.data.translate.y <= -verticalBoundry) {
                this.data.translate.y = -verticalBoundry
            }
        } else {
            this.data.scale = 1
            this.data.translate.x = START_X
            this.data.translate.y = START_Y
        }
    }


    _initState() {

        /**
         * 开始计算的缩放值
         * 这里存在操作误差处理
         * @type {Number}
         */
        this.errorScale = 0.5

        /**
         * 最后一个缩放值
         * @type {Number}
         */
        this.lastScale = 1

        /**
         * 是否更新中
         * @type {Boolean}
         */
        this.ticking = false

        /**
         * 需要更新的数据
         * @type {Object}
         */
        this.data = {
            translate: {
                x: START_X,
                y: START_Y
            },
            scale: 1
        }

        this.currentX = START_X
        this.currentY = START_Y
    }

    constructor({
        $pagePinch,
        pageIndex
    }) {

        $('body').append('<div id="test123" style="color:white;z-index:999999;font-size:22px;position:absolute;top:0px;left:0;"></div>')

        //初始化状态
        this._initState()

        this.$pinchNode = $pagePinch

        this.pinchNode = $pagePinch[0]

        //母版
        this.masterNode = this._relatedMasterNode(pageIndex)

        //bind event
        this._initBind()
    }

    destroy() {
        this.hammer.destroy()
    }

}
