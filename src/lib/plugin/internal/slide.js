import iconsConfig from '../../toolbar/base/iconconf.js'
import { svgIcon } from '../../toolbar/base/svgicon'
import { config } from '../../config/index'

const transform = Xut.style.transform
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
    _updateNodeStyle() {
        if (!this.ticking) {
            Xut.nextTick(() => {
                const data = this.data
                const styleText =
                    `translate(${data.translate.x}px,${data.translate.y}px) ${translateZ}
            scale(${data.scale},${data.scale})`
                this.pinchNode.style[transform] = styleText
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
            this._initState()
            this._requestNodeUpdate();
            this._buttonHide()
        })
        this.$pinchNode.after($node)
        return $node
    }

    /**
     * 按钮显示
     * @return {[type]} [description]
     */
    _buttonShow() {
        if (this.$buttonNode) {
            this.$buttonNode.show()
        } else {
            this.$buttonNode = this._createPinchButton()
        }
        this.isRunning = true
    }

    /**
     * 按钮隐藏
     * @return {[type]} [description]
     */
    _buttonHide() {
        if (!this.$buttonNode) {
            this.$buttonNode = this._createPinchButton()
        }
        this.$buttonNode.hide()
        this.isRunning = false
    }


    _initState() {

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

        this.isRunning = false
    }


    /**
     * 初始化事件
     * @return {[type]} [description]
     */
    _initEvent() {
        this.hammer = new Hammer.Manager(this.pinchNode)
        this.hammer.add(new Hammer.Pinch())
        this.hammer.on("pinchstart pinchmove", (e) => {
            this._onPinch(e)
        })
    }


    /**
     * 缩放
     * @param  {[type]} ev [description]
     * @return {[type]}    [description]
     */
    _onPinch(ev) {
        if (this.data.scale > 1) {
            ev.srcEvent.stopPropagation()
            this.hammer.get('pan').set({ enable: true });
        }

        if (ev.type == 'pinchstart') {
            this.lastScale = this.data.scale || 1;
            if (!this.hammer.get('pan')) {
                this._buttonHide()
                this.hammer.add(new Hammer.Pan())
                this.hammer.on("panstart panmove", onPan);
                this.hammer.on("panend", onPanEnd)
            } else {
                if (!this.isRunning) {
                    this._buttonShow()
                }
            }
        }

        this.data.scale = this.lastScale * ev.scale

        //还原
        if (this.data.scale < 1) {
            this.data.scale = 1
            this._buttonHide()
        }

        this._isBoundry()
        this._updateNodeStyle()
    }


    _onPan(ev) {
        if (this.data.scale > 1) {
            //取消冒泡 pinch层滑动 li层不可滑动
            ev.srcEvent.stopPropagation()
            this.hammer.get('pan').set({ enable: true });

            if (this.currentX != START_X || this.currentY != START_Y) {
                this.data.translate = {
                    x: this.currentX + ev.deltaX,
                    y: this.currentY + ev.deltaY
                };
            } else {
                this.data.translate = {
                    x: START_X + ev.deltaX,
                    y: START_Y + ev.deltaY
                };
            }

            this._isBoundry()
            this._updateNodeStyle()
        } else {
            //不取消冒泡 禁止pinch层滑动 此时li层可以滑动
            this.hammer.get('pan').set({ enable: false });
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
