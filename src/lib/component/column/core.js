import { config, resetVisualLayout } from '../../config/index'
import { getFileFullPath } from '../../util/option'
import { translation } from '../../scenario/pagebase/move/translation'
import { getColumnCount } from './api'
import { getVisualDistance } from '../../scenario/v-distance/index'
import { ScalePicture } from '../../plugin/extend/scale-picture/index'
import { closeButton } from '../../plugin/extend/close-button'
import { analysisImageName, getHDFilePath } from '../../util/option'

import Swiper from '../../swiper/index'
import swiperHook from '../../swiper/hook.js'
import { closestMedia } from '../../scenario/mediator/closest'


import { clearColumnAudio } from '../audio/api'
import { clearVideo } from '../video/api'

/**
 * 2017.9.7
 * 流式排版
 */
export default class ColumnClass {

  constructor({
    rootNode,
    pptMaster, //母版ID
    pageIndex,
    seasonId,
    chapterId,
    callback
  }) {
    /*存放缩放对象*/
    this._scaleObjs = {}
    this.pptMaster = pptMaster
    this.chapterId = chapterId
    this.seasonId = seasonId
    this.initIndex = pageIndex
    this.$container = $($('#chapter-flow-' + chapterId).html())

    /*布局显示*/
    Xut.nextTick({
      container: rootNode,
      content: this.$container
    }, () => {
      if (config.launch.displayMode === 'h') {
        this._initX()
      } else if (config.launch.displayMode === 'v') {
        this._initY()
      }
      callback()
    })
  }

  /**
   * 缩放图片
   */
  _zoomPicture(node) {
    const src = node.src
    if (!src) {
      return
    }
    const analysisName = analysisImageName(src)
    const originalName = analysisName.original

    /*存在*/
    const zoomObj = this._scaleObjs[originalName]
    if (zoomObj) {
      return zoomObj.play()
    }

    /*创建*/
    this._scaleObjs[originalName] = new ScalePicture({
      element: $(node),
      originalSrc: getFileFullPath(analysisName.suffix, 'column-zoom'),
      hdSrc: getHDFilePath(originalName)
    })
  }

  /**
   * pagesCount = 5
   *   等分=> 0.25/0.5/0.75/1/0
   */
  _getNodes() {
    if (this.pptMaster) {
      let nodes = []
      let ratio = 1 / (this.columnCount - 1) //比值
      for (let i = 1; i < this.columnCount; i++) {
        nodes.push(i * ratio)
      }
      return nodes.push(0)
    }
  }

  /**
   * 获取母版对象
   */
  _getMasterObj() {
    if (this._masterObj) {
      return this._masterObj
    }
    if (this.pptMaster) {
      this._masterObj = Xut.Presentation.GetPageBase('master', this.initIndex)
    }
  }

  /**
   * 移动视觉差
   * 处理当前页面内的视觉差对象效果
   */
  _moveParallax(action, speed, nodes, visualIndex, direction, viewBeHideDistance) {
    const masterObj = this._getMasterObj()
    if (masterObj) {
      masterObj.moveParallax({
        speed,
        action,
        direction,
        pageIndex: visualIndex + 1,
        moveDistance: viewBeHideDistance,
        nodes: direction === 'next' ? nodes[visualIndex] : ''
      })
    }
  }


  /**
   * 横版模式下，页面是通过分栏处理的
   * @return {[type]} [description]
   */
  _initX() {

    /**************************************
     *     横版模式下的分栏处理
     * ************************************/

    const container = this.$container[0]
    const coloumnObj = this
    const columnWidth = resetVisualLayout(1).width

    //分栏数
    this.columnCount = getColumnCount(this.seasonId, this.chapterId)

    //边界
    coloumnObj.minBorder = 0
    coloumnObj.maxBorder = this.columnCount - 1

    let nodes = this._getNodes()

    const setOptions = {
      container,
      scope: 'parent', //父容器滑动
      snap: false, //不分段
      hasHook: true,
      multiplePages: true,
      stopPropagation: true,
      visualIndex: Xut.Presentation.GetPageIndex() > coloumnObj.initIndex ? coloumnObj.maxBorder : coloumnObj.minBorder,
      totalIndex: this.columnCount,
      visualWidth: columnWidth
    }

    _.extend(setOptions, Swiper.getConfig())

    /**
     * 分栏整体控制
     * @type {[type]}
     */
    const swipe = this.swipe = new Swiper(setOptions)

    let moveDistance = 0

    coloumnObj.lastDistance = swipe.getInitDistance()

    let hasQrcode
    swipe.$watch('onFilter', (hookCallback, point, evtObj) => {
      /*二维码*/
      hasQrcode = false
      if (swiperHook(evtObj, point.target) === 'qrcode') {
        hasQrcode = true
      }
    });

    swipe.$watch('onTap', function(pageIndex, hookCallback, point, duration) {
      const node = point.target;
      /*图片缩放*/
      if (!hasQrcode) {
        if (node && node.nodeName.toLowerCase() === "img") {
          coloumnObj._zoomPicture(node)
        }
        if (!Xut.Contents.Canvas.getIsTap()) {
          Xut.View.Toolbar()
        }
      }
      /*点击媒体，视频音频*/
      closestMedia(node, coloumnObj.chapterId, swipe.visualIndex)
    })


    swipe.$watch('onMove', function(options) {

      const {
        action,
        speed,
        distance,
        direction
      } = options

      /**
       * 首页边界
       */
      if (swipe.visualIndex === coloumnObj.minBorder && swipe.direction === 'prev') {
        if (action === 'flipOver') {
          clearColumnAudio()
          clearVideo()
          Xut.View.GotoPrevSlide()
          swipe.simulationComplete()
        } else {
          //前边界前移反弹
          Xut.View.SetSwiperMove({
            speed,
            action,
            distance,
            direction: swipe.direction
          })
        }
      }
      /**
       * 尾页边界
       */
      else if (swipe.visualIndex === coloumnObj.maxBorder && swipe.direction === 'next') {
        if (action === 'flipOver') {
          clearColumnAudio()
          clearVideo()
          Xut.View.GotoNextSlide()
          swipe.simulationComplete()
        } else {
          //后边界前移反弹
          Xut.View.SetSwiperMove({
            speed,
            action,
            distance,
            direction: swipe.direction
          })
        }
      }
      /**
       * 中间页面
       */
      else {

        const visualIndex = Xut.Presentation.GetPageIndex()

        let viewBeHideDistance = getVisualDistance({
          action,
          distance,
          direction,
          frontIndex: visualIndex,
          middleIndex: visualIndex,
          backIndex: visualIndex
        })[1]

        moveDistance = viewBeHideDistance

        switch (direction) {
          case 'prev':
            moveDistance = moveDistance + coloumnObj.lastDistance
            break
          case 'next':
            moveDistance = moveDistance + coloumnObj.lastDistance
            break
        }

        //反弹
        if (action === 'flipRebound') {
          if (direction === 'next') {
            //右翻页，左反弹
            moveDistance = (-columnWidth * swipe.visualIndex)
          } else {
            //左翻页，右反弹
            moveDistance = -(columnWidth * swipe.visualIndex)
          }
        }

        //更新页码
        if (action === 'flipOver') {
          clearColumnAudio()
          clearVideo()
          coloumnObj._updataPageNumber(direction)
        }

        translation[action](container, moveDistance, speed)

        //移动视觉差对象
        coloumnObj._moveParallax(action, speed, nodes, swipe.visualIndex, direction, viewBeHideDistance)
      }

    })

    swipe.$watch('onComplete', ({ unlock }) => {
      coloumnObj.lastDistance = moveDistance
      unlock()
    })
  }

  /**
   * 获取卷滚的索引
   * @return {[type]} [description]
   */
  _getRollIndex(distY, rangeY) {
    let key, value, pageIndex
    let startY = Math.abs(distY)
    for (let key in rangeY) {
      let value = rangeY[key]
      if (startY >= value.min && startY <= value.max) {
        pageIndex = key
        break;
      }
    }
    return Number(pageIndex)
  }

  /**
   * 竖版模式下，整体数据滑动
   * @return {[type]} [description]
   */
  _initY() {

    /**************************************
     *     竖版模式下的分栏处理
     * ************************************/

    const container = this.$container[0]

    this.columnCount = getColumnCount(this.seasonId, this.chapterId)

    const iscroll = this.iscroll = new iScroll(container, {
      stopPropagation: true,
      preventDefault: false,
      mouseWheel: true,
      scrollbars: true,
      bounce: false,
      probeType: 2
    })

    /**
     * 计算出通过坐标模拟分段是区间
     */
    const baseY = Math.abs(iscroll.maxScrollY / this.columnCount)
    let count = this.columnCount

    let pageIndex = 0

    /*获取对比的数据区间值，快速比较*/
    const rangeY = {}
    while (count--) {
      rangeY[count] = {
        min: Math.abs(count * baseY),
        max: Math.abs((count + 1) * baseY)
      }
    }

    /*从下往上滑动*/
    if (Xut.Presentation.GetPageIndex() > this.initIndex) {
      iscroll.scrollTo(0, iscroll.maxScrollY)
      this.visualIndex = this.columnCount - 1
    } else {
      /*从上往下滑动*/
      this.visualIndex = 0
    }


    /*如果是边界翻页*/
    let hasBorderRun = false
    let hasQrcode

    iscroll.on('beforeScrollStart', e => {
      pageIndex = this._getRollIndex(iscroll.startY, rangeY)
      hasBorderRun = false
        /*二维码*/
      hasQrcode = false
      if (swiperHook(e, e.target) === 'qrcode') {
        hasQrcode = true
      }
    })

    /*点击动作*/
    iscroll.on('scrollCancel', e => {
      const node = e.target;
      /*图片缩放*/
      if (!hasQrcode) {
        if (node && node.nodeName.toLowerCase() === "img") {
          this._zoomPicture(node)
        }
        if (!Xut.Contents.Canvas.getIsTap()) {
          Xut.View.Toolbar()
        }
      }
      /*点击媒体，视频音频*/
      closestMedia(node, this.chapterId, 0)
    })

    /**
     * directionY
     *   1 向后
     *   -1 向前
     */
    iscroll.on('scroll', e => {
      /*探测下全局是否可以滑动了*/
      if (Xut.View.GetSwiperEnabled()) {
        if (iscroll.directionY === -1 && iscroll.startY === 0) {
          hasBorderRun = true
          Xut.View.SetSwiperMove({
            action: 'flipMove',
            direction: 'prev',
            distance: this.distY - 10,
            speed: 0
          })
        } else if (iscroll.directionY === 1 && iscroll.startY === iscroll.maxScrollY) {
          hasBorderRun = true
          Xut.View.SetSwiperMove({
            action: 'flipMove',
            direction: 'next',
            distance: this.distY + 10,
            speed: 0
          })
        } else {
          this._scrollToPage(iscroll.startY, iscroll.directionY, rangeY)
        }
      }
    })

    iscroll.on('scrollEnd', function(e) {
      if (hasBorderRun) {
        const typeAction = Xut.View.GetSwiperActionType(0, iscroll.distY, iscroll.endTime - iscroll.startTime, 'v')
        if (typeAction === 'flipOver') {
          if (iscroll.directionY === 1) {
            clearColumnAudio()
            clearVideo()
            Xut.View.GotoNextSlide()
          } else if (iscroll.directionY === -1) {
            clearColumnAudio()
            clearVideo()
            Xut.View.GotoPrevSlide()
          }
        } else if (typeAction === 'flipRebound') {
          if (iscroll.directionY === 1) {
            Xut.View.SetSwiperMove({
              action: 'flipRebound',
              direction: 'next',
              distance: 0,
              speed: 300
            })
          } else if (iscroll.directionY === -1) {
            Xut.View.SetSwiperMove({
              action: 'flipRebound',
              direction: 'prev',
              distance: 0,
              speed: 300
            })
          }
        }
      }
    })

    /**
     * 松手后的惯性滑动
     */
    iscroll.on('momentum', (newY, time, easing) => {
      this._scrollToPage(newY, iscroll.directionY, rangeY, time)
    })

  }

  /**
   * 滚动指定的页面
   * @return {[type]} [description]
   */
  _scrollToPage(distY, directionY, rangeY, time) {
    const pageIndex = this._getRollIndex(distY, rangeY);
    /*只有页码不一致的时候才更新，并且只更新一次*/
    if (this.visualIndex !== pageIndex) {
      this._updataScrollbars(pageIndex, directionY, time)
      this.visualIndex = pageIndex
    }
  }

  /**
   * 更新页面滚动条
   * direction = 1 下滑动
   */
  _updataScrollbars(pageIndex, direction, time) {
    Xut.View.SetPageNumber({
      time,
      parentIndex: this.initIndex,
      sonIndex: direction === 1 ? pageIndex : pageIndex + 2,
      hasSon: true,
      direction: direction === 1 ? 'next' : 'prev'
    })
  }

  /**
   * 更新页码
   */
  _updataPageNumber(direction, location) {
    let initIndex = this.initIndex
    if (location) {
      direction = location === 'right' ? 'prev' : 'next'
      if (location === 'middle' && initIndex > 0) {
        //如果中间是分栏页
        --initIndex
      }
    }
    Xut.View.SetPageNumber({
      parentIndex: initIndex,
      sonIndex: this.swipe.getVisualIndex() + 1,
      hasSon: true,
      direction: direction
    })
  }

  /*重新计算分栏依赖*/
  resetColumnDep() {
    let newColumnCount = getColumnCount(this.seasonId, this.chapterId)

    //如果分栏页面总数不正确
    if (this.columnCount !== newColumnCount) {

      this.columnCount = newColumnCount
      this.maxBorder = newColumnCount - 1

      let visualPageId = Xut.Presentation.GetPageId()
      let columnPageId = this.chapterId
      let location

      //区分控制column属于哪个页面对象
      if (visualPageId > columnPageId) {
        location = 'left'
      } else if (visualPageId < columnPageId) {
        location = 'right'
      } else if (visualPageId === columnPageId) {
        location = 'middle'
      }

      //设置column
      this.swipe.setLinearTotal(newColumnCount, location)

      this.lastDistance = this.swipe.getInitDistance()

      //页码
      this._updataPageNumber('', location)
    }
  }

  /*销毁*/
  destroy() {

    //销毁缩放图片
    if (Object.keys(this._scaleObjs).length) {
      _.each(this._scaleObjs, (obj, key) => {
        obj.destroy()
        this._scaleObjs[key] = null
      })
    }

    this.iscroll && this.iscroll.destroy()
    this.swipe && this.swipe.destroy()
  }

}
