import { config, resetVisualLayout } from '../../config/index'
import { converUrlName, getFileFullPath } from '../../util/index'
import { translation } from '../../scenario/pagebase/move/translation'
import { getColumnCount } from './api'
import { getVisualDistance } from '../../scenario/v-distance/index'
import { ScalePicture } from '../../expand/scale-picture/index'
import { closeButton } from '../../expand/close-button'
import { delegateScrollY } from '../../expand/iscroll'

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
      if (config.launch.scrollMode === 'h') {
        this._initX()
      } else if (config.launch.scrollMode === 'v') {
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

    const conver = converUrlName(src)
    const original = conver.original

    /*存在*/
    const zoomObj = this._scaleObjs[original]
    if (zoomObj) {
      return zoomObj.play()
    }

    /*创建*/
    this._scaleObjs[original] = new ScalePicture({
      element: $(node),
      originalSrc: getFileFullPath(conver.suffix, 'column-zoom'),
      hdSrc: getFileFullPath(conver.hdName, 'getHDFilePath')
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
   * 横版处理
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
    Xut.View.UpdatePage({
      parentIndex: initIndex,
      sonIndex: this.swipe.getVisualIndex() + 1,
      hasSon: true,
      direction: direction
    })
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
      hasMultiPage: true,
      stopPropagation: true,
      visualIndex: Xut.Presentation.GetPageIndex() > coloumnObj.initIndex ? coloumnObj.maxBorder : coloumnObj.minBorder,
      totalIndex: this.columnCount,
      actualWidth: columnWidth
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
    swipe.$$watch('onFilter', (hookCallback, point, evtObj) => {
      /*二维码*/
      hasQrcode = false
      if (swiperHook(evtObj, point.target) === 'qrcode') {
        hasQrcode = true
      }
    });

    swipe.$$watch('onTap', function(pageIndex, hookCallback, point, duration) {
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


    swipe.$$watch('onMove', function(options) {

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
          Xut.View.GotoPrevSlide({ speed })
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
          Xut.View.GotoNextSlide({ speed })
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

    swipe.$$watch('onComplete', ({
      unlock
    }) => {
      coloumnObj.lastDistance = moveDistance
      unlock()
    })
  }

  /**
   * 获取卷滚的索引
   * @return {[type]} [description]
   */
  static getScrollYIndex(distY, rangeY) {
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
   * 获取滚动Y轴的坐标分组
   * 计算出通过坐标模拟分段是区间
   * @return {[type]} [description]
   */
  static getScrollYRange(maxScrollY, columnCount) {
    const baseY = Math.abs(maxScrollY / columnCount)
    let count = columnCount

    /*获取对比的数据区间值，快速比较*/
    const rangeY = {}
    while (count--) {
      rangeY[count] = {
        min: Math.abs(count * baseY),
        max: Math.abs((count + 1) * baseY)
      }
    }
    return rangeY
  }


  /**
   * 竖版模式下，整体数据滑动
   * 1 需要判断2个方式，3个方向，3个值
   * 初始化、通过touch的方式滑动，通过鼠标滑动
   * 根据3种行为区分了3种方式，分别要标明，进来进来的方向
   * 通过这个方向值处理内部的滑动
   */
  _initY() {

    const container = this.$container[0]
    this.columnCount = getColumnCount(this.seasonId, this.chapterId)

    const iscroll = this.iscroll = delegateScrollY(container, {
      // mouseWheel: true,
      // scrollbars: true
    })

    /*全局的卷滚条对象*/
    this.scrollBar = Xut.Application.GetScrollBarObject()

    /*全局不止一个迷你bar对象，所以需要不同的更新机制*/
    // if (this.scrollBar && Xut.Application.GetMiniBars() > 1) {
    //   this.multiToolbar = true
    //   this.rangeY = ColumnClass.getScrollYRange(iscroll.maxScrollY, this.columnCount)
    // }

    this.wheelEntryDirection = '' //鼠标滚动进来的方向
    this.touchEntryDirection = '' //触摸进来的方向
    this.initEntryDirection = '' //初始化进来的方向

    /**
     * 进来flow的方式
     * init / touch / wheel
     * @type {String}
     */
    this.entryWay = ''

    /*如果flow初始化是可视区，那么需要开始就设定wheelEntryDirection的值*/
    let setDirection = false
    if (this.initIndex === Xut.Presentation.GetPageIndex()) {
      setDirection = true
      this.entryWay = 'init'
    }

    /*初始化Y轴的定位位置*/
    if (Xut.Presentation.GetPageIndex() > this.initIndex) {
      /*从下往上滑动,滚动页面设为最大值*/
      iscroll.scrollTo(0, iscroll.maxScrollY)
      this.visualIndex = this.columnCount - 1
      this.touchEntryDirection = 'up'
      if (setDirection) {
        this.initEntryDirection = 'up'
      }
    } else {
      /*从上往下滑动*/
      this.visualIndex = 0
      this.touchEntryDirection = 'down'
      if (setDirection) {
        this.initEntryDirection = 'down'
      }
    }


    let hasQrcode
    iscroll.on('beforeScrollStart', e => {
      hasQrcode = false
      if (swiperHook(e, e.target) === 'qrcode') {
        hasQrcode = true
      }
    })


    /*点击动作
      1. 图片缩放
      2. 点击媒体，视频音频
    */
    iscroll.on('scrollCancel', e => {
      const node = e.target;
      if (!hasQrcode) {
        if (node && node.nodeName.toLowerCase() === "img") {
          this._zoomPicture(node)
        }
        if (!Xut.Contents.Canvas.getIsTap()) {
          Xut.View.Toolbar()
        }
      }
      closestMedia(node, this.chapterId, 0)
    })


    /**
     * 滚动时候变化
     * 强制显示滚动工具栏
     */
    iscroll.on('scroll', e => {
      this.scrollBar.showBar()
    })


    /**
     * 如果是突然中断
     * 停止滚动
     */
    iscroll.on('intermit', y => {
      this._updatePosition(y)
    })


    /**
     * 扩展的API
     * 如果是滚动的内容部分
     */
    iscroll.on('scrollContent', e => {
      if (!this.entryWay) {
        this.entryWay = 'touch'
      }
      this._updatePosition(this.iscroll.y)
    })


    /**
     * 松手后的惯性滑动
     */
    iscroll.on('momentum', (newY, time) => {
      this._updatePosition(newY, time)
    })


    /**
     * 扩展API 滚动翻页
     */
    iscroll.on('scrollExit', (direction) => {
      this._leave(direction)
    })


    /*滑动的平均概率值*/
    this.sizeRatioY = (this.scrollBar.ratio * (this.columnCount - 1)) / this.iscroll.maxScrollY

    /*在翻页的时候，禁止滚动页面*/
    this.wheellook = false
  }


  /*离开页面：
  touchEntryDirection标记的是进来的方向,
  触摸动作需要取反，因为这个是代表出去的方向*/
  _leave(direction) {
    if (direction === 'down') {
      this.touchEntryDirection = 'up'
    } else if (direction === 'up') {
      this.touchEntryDirection = 'down'
    }
    this.wheelEntryDirection = ''
    this.entryWay = ''

    clearColumnAudio()
    clearVideo()
  }


  ////////////////////
  /// 竖版操作
  ///////////////////

  /**
   * 更新滚动坐标
   */
  _updatePosition(y, time, directionY) {

    let direction = ''

    if (this.entryWay === 'init') {
      direction = this.initEntryDirection
    } else if (this.entryWay === 'touch') {
      direction = this.touchEntryDirection
    } else if (this.entryWay === 'wheel') {
      direction = this.wheelEntryDirection
    }

    /*如果是下往上进来的*/
    if (direction === 'up') {
      y = Math.round((this.iscroll.maxScrollY - y) * this.sizeRatioY)
      this.scrollBar.updatePosition(y, time, 'up')
      return
    }

    /*如果是从上往下进来的*/
    if (direction === 'down') {
      y = Math.round(this.sizeRatioY * y) || 0;
      this.scrollBar.updatePosition(y, time, 'down')
    }

  }

  ////////////////////
  /// 鼠标滚动操作
  ///////////////////
  onWheel(e, wheelDeltaY, direction) {

    if (wheelDeltaY === undefined) {
      return
    }

    if (!this.entryWay) {
      this.entryWay = 'wheel'
    }

    /*进来的方向，每次flow页面运行只标记一次*/
    if (!this.wheelEntryDirection) {
      this.wheelEntryDirection = direction
    }


    /*离开页面，鼠标快速滑动，禁止内部滑动*/
    if (!this.wheellook) {

      /*向上移动，离开flow页面*/
      if (this.iscroll.y === 0 && direction === 'up') {
        this.wheellook = true
        Xut.View.GotoPrevSlide(() => {
          /*向下翻页，滚动条设置0*/
          this.iscroll.scrollTo(0, 0)
          this.wheellook = false
          this._leave('up')
        })
        return
      }

      /*向下移动，离开flow页面*/
      if (this.iscroll.y === this.iscroll.maxScrollY && direction === 'down') {
        this.wheellook = true
        Xut.View.GotoNextSlide(() => {
          /*向下翻页，滚动条设置最大值*/
          this.iscroll.scrollTo(0, this.iscroll.maxScrollY)
          this.wheellook = false
          this._leave('down')
        })
        return
      }

      this.iscroll._wheel(e)
    }
  }


  /**
   * 获取进入方向
   * @return {[type]} [description]
   */
  getEntry() {
    return this.entryWay
  }



  ////////////////////
  /// 横版分栏刷新接口
  ///////////////////

  /**
   * 横版分栏更新
   * @param  {[type]} newColumnCount [description]
   * @return {[type]}                [description]
   */
  _resetX(newColumnCount) {
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


  /**
   * 竖版分栏更新
   * @param  {[type]} newColumnCount [description]
   * @return {[type]}                [description]
   */
  _resetY(newColumnCount) {
    console.log('竖版数据丢失，需要添加功能，补全')
    // console.log(this.columnCount,newColumnCount)
    // this.iscroll.refresh()
    // this._updatePosition(this.iscroll.y)
  }

  /**
   * 重新计算分栏依赖
   * @return {[type]} [description]
   */
  resetColumnDep() {
    let newColumnCount = getColumnCount(this.seasonId, this.chapterId)
    /*假如分栏数有变化*/
    if (newColumnCount > this.columnCount) {
      if (config.launch.scrollMode === 'h') {
        this._resetX(newColumnCount)
      } else if (config.launch.scrollMode === 'v') {
        this._resetY(newColumnCount)
      }
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
