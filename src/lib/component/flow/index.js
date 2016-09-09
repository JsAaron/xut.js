import { config } from '../../config/index'
import { translation } from '../../pagebase/translation'
import Swipe from '../../swipe/index'
import render from './render'

import {
    calculateDistance
} from '../../manager/dispatch/depend'

/**
 * 2017.9.7
 * 流式排版
 */
export default class Flow {

    constructor(base, callback) {

        const self = this
        this.callback = callback
        this.base = base

        const rootNode = base.element
        const chapterId = base.chapterId
        const domId = 'chapter-' + chapterId
        const dataNode = $("#" + domId)

        render({
            rootNode,
            dataNode,
            chapterId,
            callback($container, $content) {
                self._init($container, $content)
            }
        })
    }

    _init($container, $content) {

        //分段数
        const pagesCount = this._resolveHeight($content)

        const MIN = 0
        const MAX = pagesCount + 1
        const viewWidth = config.viewSize.width

        const gapWidth = 20

        const swipe = new Swipe({
            borderBounce: true,
            linear: true,
            initIndex: 0,
            container: $content[0],
            pageFlip: 0,
            multiplePages: 1,
            pagetotal: pagesCount
        })

        let moveDistance = 0
        let lastDistance = 0

        swipe.$watch('onMove', function({
            action,
            speed,
            distance,
            leftIndex,
            pageIndex,
            rightIndex,
            direction
        } = {}) {

            const dist = calculateDistance(action, distance, direction)[1]
            moveDistance = dist


            switch (direction) {
                case 'next':
                    moveDistance = moveDistance - gapWidth + lastDistance
                    break
                case 'prev':
                    moveDistance = moveDistance + gapWidth + lastDistance
                    break
            }

            //反弹
            if (action === 'flipRebound') {
                moveDistance = direction === 'next' ?
                    (-viewWidth * this._hindex - this._hindex * gapWidth) :
                    -(viewWidth * this._hindex + this._hindex * gapWidth)
            }


            if (this._hindex === MIN && this.direction === 'prev') {
                Xut.View.MovePage(dist, speed, this.direction, action)
            } else if (this._hindex === MAX - 1 && this.direction === 'next') {
                return
            } else {
                translation[action]({}, moveDistance, speed, $content)
            }

        })


        swipe.$watch('onComplete', (direction, pagePointer, unfliplock, isQuickTurn) => {
            lastDistance = moveDistance
            unfliplock()
        })

        this.callback()
    }


    _init1($container, $content) {

        //分段数
        const pagesCount = this._resolveHeight($content)

        const MIN = 0
        const MIX = pagesCount + 1
        const viewWidth = config.viewSize.width / 6

        $content.width(config.viewSize.width * MIX)

        const iscroll = this.iscroll = new iScroll($container[0], {
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            snap: true,
            snapSpeed: 500,
            keyBindings: true,
            fadeScrollbars: false,
            probeType: 3
        })

        if (Xut.Presentation.GetPageIndex() > this.base.pageIndex) {
            iscroll.goToPage(config.viewSize.width * MIX, 0, 0, 0)
        }

        //回调N次
        //只触发一次有效的
        let oneHandle = false

        iscroll.on('beforeScrollStart', function(e) {
            oneHandle = true
        })

        const move = function(distX, action) {
            //减少抖动
            //算一次有效的滑动
            //移动距离必须25px才开始移动
            if (Math.abs(distX) <= 25) return;
            let delayX = 0;
            //需要叠加排除值
            if (distX < 0) {
                delayX = 20;
            } else {
                delayX = (-20);
            }
            Xut.View.MovePage(distX + delayX, 0, action, 'flipMove')
        }

        iscroll.on('scroll', function(e) {
            if (!this.distX || !oneHandle) return
            if (this.directionLocked === 'h') {
                if (this.currentPage.pageX == MIN) {
                    if (this.directionX < 0 && this.absStartX == 0) {
                        move(this.distX, 'prev')
                    }
                }
                if (this.currentPage.pageX == MIX - 1) {
                    if (this.directionX > 0) {
                        move(this.distX, 'next')
                    }
                }
            }
        })


        const end = (distX, action, exec) => {
            const duration = new Date().getTime() - this.startTime
            const deltaX = Math.abs(distX)
            const isValidSlide = Number(duration) < 200 && deltaX > 30 || deltaX > viewWidth
            if (isValidSlide) {
                exec()
            } else {
                Xut.View.MovePage(0, 300, action, 'flipRebound')
            }
        }


        iscroll.on('scrollEnd', function(e) {
            if (!oneHandle) {
                return
            }
            oneHandle = false
            if (this.directionLocked === 'h') {
                if (this.currentPage.pageX == MIN) {
                    end(this.distX, 'prev', Xut.View.GotoPrevSlide)
                }
                if (this.currentPage.pageX == MIX - 1) {
                    end(this.distX, 'next', Xut.View.GotoNextSlide)
                }
            }
        })



        // const swipe = new Swipe({
        //     initIndex: 0,
        //     container: $content[0],
        //     pageFlip: 0,
        //     multiplePages: 1,
        //     pagetotal: pagesCount
        // })

        // let moveDistance = 0
        // let lastDistance = 0

        // swipe.$watch('onMove', function({
        //     action,
        //     speed,
        //     distance,
        //     leftIndex,
        //     pageIndex,
        //     rightIndex,
        //     direction
        // } = {}) {

        //     moveDistance = calculateDistance(action, distance, direction)[1]

        //     switch (direction) {
        //         case 'next':
        //             moveDistance = moveDistance - gapWidth + lastDistance
        //             break
        //         case 'prev':
        //             moveDistance = moveDistance + gapWidth + lastDistance
        //             break
        //     }

        //     translation[action]({}, moveDistance, speed, $content)
        // })


        // swipe.$watch('onComplete', (direction, pagePointer, unfliplock, isQuickTurn) => {
        //     lastDistance = moveDistance
        //     unfliplock()
        // })

        this.callback()
    }


    /**
     * parse height
     * @return {[type]} [description]
     */
    _resolveHeight($content) {
        const theChildren = $content.children().children()
        let paraHeight = 0
        for (let i = 0; i < theChildren.length; i++) {
            paraHeight += $(theChildren[i]).height()
        }
        return Math.floor(paraHeight / config.viewSize.height)
    }


}
