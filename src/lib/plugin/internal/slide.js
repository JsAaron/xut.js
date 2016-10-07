import closeButton from './close.icon'
import { config } from '../../config/index'

const transform = Xut.style.transform
const transitionDuration = Xut.style.transitionDuration
const translateZ = Xut.style.translateZ


const START_X = 0
const START_Y = 0

/**
 * 缩放、平移操作
 */
export default class Slide {

    constructor({
        $pagePinch,
        hasButton = true,
        update
    }) {

        $('body').append('<div id="test123" style="z-index:99999999;position:absolute;top:0;left:0;"></div>')

        this.log = function(text) {
            $('#test123').append('<div>' + text + '</div>')
        }

        this.update = update

        //是否配置关闭按钮
        this.hasButton = hasButton

        //缩放根节点
        this.$pinchNode = $pagePinch

        this.pinchNode = $pagePinch[0]

        this._offsetWidth = this.pinchNode.offsetWidth
        this._offsetHeight = this.pinchNode.offsetHeight

        //初始化状态
        this._initState()

        //初始化事件
        this._initEvent()
    }


    _initState() {

        //允许溢出值
        this.overflowValue = 0.5

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
        this.hammer.add(new Hammer.Pan({ enable: false }))
            .recognizeWith(this.hammer.get('pinch'))

        _.each({
            'pinchstart': '_onPinchStart',
            'pinchmove': '_onPinchMove',
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


    _onPinchStart(ev) {
        this.lastScale = this.data.scale || 1
    }

    /**
     * 缩放移动
     * @param  {[type]} ev [description]
     * @return {[type]}    [description]
     */
    _onPinchMove(ev) {

        //允许溢出值
        if (!this.scaleing) {
            if (ev.scale < this.overflowValue + 1) {
                return
            }
            this.scaleing = true
        }

        let scale = ev.scale - this.overflowValue

        //新的缩放值
        this.data.scale = this.lastScale * scale

        this._buttonShow()
        this._isBoundry()
        this._updateNodeStyle()
    }


    /**
     * 缩放松手
     * @return {[type]} [description]
     */
    _onPinchEnd(ev) {
        if (this.data.scale < 1) {
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
        if (this._isRunning) {
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


    /**
     * 平移松手
     * @return {[type]} [description]
     */
    _onPanEnd() {
        this.currentX = this.data.translate.x
        this.currentY = this.data.translate.y
    }


    /**
     * 边界反弹
     * @return {Boolean} [description]
     */
    _isBoundry() {
        if (this._isRunning) {
            var horizontalBoundry = (this.data.scale - 1) / 2 * this._offsetWidth
            var verticalBoundry = (this.data.scale - 1) / 2 * this._offsetHeight

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
                this.update && this.update(styleText, speed)
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
        const $node = closeButton(() => {
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
        if (this._isRunning) return
        if (this.data.scale > 1) {
            //必须启动配置
            if (this.hasButton) {
                if (this.$buttonNode) {
                    Xut.nextTick(() => {
                        this.$buttonNode.show()
                    })
                } else {
                    this.$buttonNode = this._createPinchButton()
                }
            }
            this._isRunning = true
            this.hammer.get('pan').set({ enable: true })
        }
    }

    /**
     * 按钮隐藏
     * @return {[type]} [description]
     */
    _buttonHide() {
        if (!this._isRunning) return
        this.hasButton && this.$buttonNode.hide()
        this._isRunning = false
        this.hammer.get('pan').set({ enable: false })
    }


    destroy() {
        this.hammer.destroy()
    }
}
