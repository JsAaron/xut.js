import iconsConfig from '../../toolbar/base/iconconf.js'
import { svgIcon } from '../../toolbar/base/svgicon'
import { config } from '../../config/index'

const transform = Xut.style.transform
const transitionDuration = Xut.style.transitionDuration
const translateZ = Xut.style.translateZ


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
 * 缩放、平移操作
 */
export default class Slide {

    /**
     * 更新节点样式
     * @return {[type]} [description]
     */
    _updateNodeStyle(speed = 0) {
        if (!this.ticking) {
            Xut.nextTick(() => {
                const data = this.data
                const styleText =
                    `translate(${data.translate.x}px,${data.translate.y}px) ${translateZ}
            scale(${data.scale},${data.scale})`

                this.pinchNode.style[transform] = styleText
                this.pinchNode.style[transitionDuration] = speed + 'ms'
                this.update && this.update(styleText)
                this.ticking = false
            })
            this.ticking = true
        }
    }

    /**
     * 创建按钮
     * @return {[type]} [description]
     */
    _createPinchButton() {
        const $node = createCloseIcon()
        createSVGIcon($node[0], () => {
            //点击还原
            this._initState()
            this._updateNodeStyle(500)
        })
        this.$pinchNode.after($node)
        return $node
    }

    /**
     * 按钮显示
     * @return {[type]} [description]
     */
    _buttonShow() {
        //to heavy
        if (this._buttonRunning) return
        if (this.$buttonNode) {
            Xut.nextTick(() => {
                this.$buttonNode.show()
            })
        } else {
            this.$buttonNode = this._createPinchButton()
        }
        this._buttonRunning = true
    }

    /**
     * 按钮隐藏
     * @return {[type]} [description]
     */
    _buttonHide() {
        if (!this._buttonRunning) return
        if (!this.$buttonNode) {
            this.$buttonNode = this._createPinchButton()
        }
        this.$buttonNode.hide()
        this._buttonRunning = false
    }


    _initState() {

        //允许溢出值
        this.overflowValue = 0.3

        /**
         * 缩放中
         * @type {Boolean}
         */
        this.scaleing = false

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

        this.currentX = START_X
        this.currentY = START_Y

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

        this._buttonHide()
    }


    /**
     * 初始化事件
     * @return {[type]} [description]
     */
    _initEvent() {

        this.hammer = new Hammer.Manager(this.pinchNode)
        this.hammer.add(new Hammer.Pinch())

        _.each({
            'pinchstart pinchmove': '_onPinch',
            'pinchend': '_onPinchEnd',
            'panstart panmove': '_onPan',
            'panend': '_onPanEnd'
        }, (value, key) => {
            this.hammer.on(key, (e) => {
                 e.srcEvent.stopPropagation()
                this[value](e)
            })
        })
    }


    /**
     * 判断是否运行中
     * @return {Boolean} [description]
     */
    _isRunning() {
        return this.data.scale > 1 ? true : false
    }


    /**
     * 缩放移动
     * @param  {[type]} ev [description]
     * @return {[type]}    [description]
     */
    _onPinch(ev) {

        if (!this.scaleing) {
            if (ev.scale < this.overflowValue + 1) {
                return
            }
            this.scaleing = true
        }
 

        let scale = ev.scale - this.overflowValue 

        if (scale > 1) {
            //缩放就需要打开关闭按钮
            this._buttonShow()
        }

        if (ev.type == 'pinchstart') {
            this.lastScale = this.data.scale || 1

            //加入平移
            if (!this.hammer.get('pan')) {
                this.hammer
                    .add(new Hammer.Pan())
                    .recognizeWith(this.hammer.get('pinch'))
            }
        }

        //新的缩放值
        this.data.scale = this.lastScale * scale

        // this._isBoundry()
        this._updateNodeStyle()
    }


    /**
     * 缩放松手
     * @return {[type]} [description]
     */
    _onPinchEnd() {
        if (this.data.scale <= 1) {
            Xut.nextTick(() => {
                this._initState()
                this._updateNodeStyle(500)
            })
        } else {
            this.overflowValue = 0
        }
    }

    /**
     * 平移
     * @param  {[type]} ev [description]
     * @return {[type]}    [description]
     */
    _onPan(ev) {
        if (this._isRunning()) {
            if (this.currentX != START_X || this.currentY != START_Y) {
                this.data.translate = {
                    x: this.currentX + ev.deltaX,
                    y: this.currentY + ev.deltaY
                };
            } else {
                this.data.translate = {
                    x: START_X + ev.deltaX,
                    y: START_Y + ev.deltaY
                }
            }
            this._isBoundry()
            this._updateNodeStyle()
        }
    }


    _onPanEnd() {
        this.currentX = this.data.translate.x
        this.currentY = this.data.translate.y
    }

    _isBoundry() {
        var horizontalBoundry = (this.data.scale - 1) / 2 * this.pinchNode.offsetWidth;
        var verticalBoundry = (this.data.scale - 1) / 2 * this.pinchNode.offsetHeight;
        if (this.data.scale > 1) {
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
            this.data.scale = 1;
            this.data.translate.x = START_X;
            this.data.translate.y = START_Y;
        }
    }


    constructor({
        $pagePinch,
        pageIndex,
        update
    }) {

        $('body').append('<div id="test123" style="color:white;z-index:999999;font-size:22px;position:absolute;top:0px;left:0;"></div>')

        this.debug = function(h) {
            $("#test123").text(h)
        }

        //更新回调
        this.update = update

        //缩放根节点
        this.$pinchNode = $pagePinch
        this.pinchNode = $pagePinch[0]

        //初始化状态
        this._initState()

        //初始化事件
        this._initEvent()
    }

    destroy() {
        this.hammer.destroy()
    }
}
