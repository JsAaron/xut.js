import { config, resetVisualLayout } from '../../config/index'
import { getFileFullPath } from '../../util/option'
import { translation } from '../../scenario/pagebase/move/translation'
import { getColumnCount } from './depend'
import { getVisualDistance } from '../../scenario/v-distance/index'
import { Zoom } from '../../plugin/extend/zoom/index'
import { closeButton } from '../../plugin/extend/close-button'
import { analysisImageName, getHDFilePath } from '../../util/option'
import Swipe from '../../swipe/index'
import swipeHooks from '../../swipe/hook.js'

/**
 * 2017.9.7
 * 流式排版
 */
export default class ColumnClass {

  constructor({
    pptMaster, //母版ID
    pageIndex,
    $pinchNode,
    seasonId,
    chapterId,
    successCallback
  }) {
    /*存放缩放对象*/
    this.zoomObjs = {}
    this.pptMaster = pptMaster
    this.chapterId = chapterId
    this.seasonId = seasonId
    this.initIndex = pageIndex
    this.$pinchNode = $pinchNode
    this.$container = $($('#chapter-flow-' + chapterId).html())
    this._layout(successCallback)
  }

  /*布局显示*/
  _layout(successCallback) {
    Xut.nextTick({
      container: this.$pinchNode,
      content: this.$container
    }, () => {
      this._init()
      successCallback()
    })
  }

  /*缩放图片*/
  _zoomImage(node) {
    const src = node.src
    if(!src) {
      return
    }
    const analysisName = analysisImageName(src)
    const originalName = analysisName.original
    const zoomObj = this.zoomObjs[originalName]
    if(zoomObj) {
      zoomObj.play()
    } else {
      this.zoomObjs[originalName] = new Zoom({
        element: $(node),
        originalSrc: getFileFullPath(analysisName.suffix,'column-zoom'),
        hdSrc: getHDFilePath(originalName)
      })
    }
  }

  /**
   * pagesCount = 5
   *   等分=> 0.25/0.5/0.75/1/0
   */
  _getNodes() {
    if(this.pptMaster) {
      let nodes = []
      let ratio = 1 / (this.columnCount - 1) //比值
      for(let i = 1; i < this.columnCount; i++) {
        nodes.push(i * ratio)
      }
      return nodes.push(0)
    }
  }

  /*获取母版对象*/
  _getMasterObj() {
    if(this._masterObj) {
      return this._masterObj
    }
    if(this.pptMaster) {
      this._masterObj = Xut.Presentation.GetPageObj('master', this.initIndex)
    }
  }

  /**
   * 移动视觉差
   * 处理当前页面内的视觉差对象效果
   */
  _moveParallax(action, speed, nodes, visualIndex, direction, viewBeHideDistance) {
    const masterObj = this._getMasterObj()
    if(masterObj) {
      masterObj.moveParallax({
        speed,
        action,
        direction,
        pageIndex: visualIndex + 1,
        moveDist: viewBeHideDistance,
        nodes: direction === 'next' ? nodes[visualIndex] : ''
      })
    }
  }

  /*初始化*/
  _init() {

    const coloumnObj = this
    const columnWidth = resetVisualLayout(1).width
    const container = this.$container[0]

    //分栏数
    this.columnCount = getColumnCount(this.seasonId, this.chapterId)

    //边界
    coloumnObj.minBorder = 0
    coloumnObj.maxBorder = this.columnCount - 1

    let nodes = this._getNodes()

    /**
     * 分栏整体控制
     * @type {[type]}
     */
    const swipe = this.swipe = new Swipe({
      hasHook: true,
      swipeWidth: columnWidth,
      linear: true,
      initIndex: Xut.Presentation.GetPageIndex() > coloumnObj.initIndex ? coloumnObj.maxBorder : coloumnObj.minBorder,
      container,
      flipMode: 'allow',
      multiplePages: 1,
      stopPropagation: true,
      totalIndex: this.columnCount
    })

    let moveDistance = 0

    coloumnObj.lastDistance = swipe.getInitDistance()

    //判断二维码，去掉默认行为
    let hasQrcode
    swipe.$watch('onFilter', (hookCallback, point, evtObj) => {
      hasQrcode = false
      if(swipeHooks(evtObj, point.target) === 'qrcode') {
        hasQrcode = true
      }
    });

    swipe.$watch('onTap', function(pageIndex, hookCallback, ev, duration) {
      //图片缩放
      if(!hasQrcode) {
        const node = ev.target
        if(node && node.nodeName.toLowerCase() === "img") {
          coloumnObj._zoomImage(node)
        }
        if(!Xut.Contents.Canvas.getIsTap()) {
          Xut.View.Toolbar()
        }
      }
    });

    swipe.$watch('onMove', function({
      action,
      speed,
      distance,
      leftIndex,
      pageIndex,
      rightIndex,
      direction
    }) {

      /**
       * 首页边界
       */
      if(swipe.visualIndex === coloumnObj.minBorder && swipe.direction === 'prev') {
        if(action === 'flipOver') {
          Xut.View.GotoPrevSlide()
          swipe.simulationComplete()
        } else {
          //前边界前移反弹
          Xut.View.MovePage(distance, speed, swipe.direction, action)
        }
      }
      /**
       * 尾页边界
       */
      else if(swipe.visualIndex === coloumnObj.maxBorder && swipe.direction === 'next') {
        if(action === 'flipOver') {
          Xut.View.GotoNextSlide()
          swipe.simulationComplete()
        } else {
          //后边界前移反弹
          Xut.View.MovePage(distance, speed, swipe.direction, action)
        }
      }
      /**
       * 中间页面
       */
      else {

        let viewBeHideDistance = getVisualDistance({
          action,
          distance,
          direction
        })[1]

        moveDistance = viewBeHideDistance

        switch(direction) {
          case 'next':
            moveDistance = moveDistance + coloumnObj.lastDistance
            break
          case 'prev':
            moveDistance = moveDistance + coloumnObj.lastDistance
            break
        }

        //反弹
        if(action === 'flipRebound') {
          if(direction === 'next') {
            //右翻页，左反弹
            moveDistance = (-columnWidth * swipe.visualIndex)
          } else {
            //左翻页，右反弹
            moveDistance = -(columnWidth * swipe.visualIndex)
          }
        }

        //更新页码
        if(action === 'flipOver') {
          coloumnObj._updataPageNumber(direction)
        }

        translation[action](container, moveDistance, speed)

        //移动视觉差对象
        coloumnObj._moveParallax(action, speed, nodes, swipe.visualIndex, direction, viewBeHideDistance)
      }

    })


    swipe.$watch('onComplete', (direction, pagePointer, unfliplock, isQuickTurn) => {
      coloumnObj.lastDistance = moveDistance
      unfliplock()
    })

  }

  /*更新页码*/
  _updataPageNumber(direction, location) {
    let initIndex = this.initIndex
    if(location) {
      direction = location === 'right' ? 'prev' : 'next'
      if(location === 'middle' && initIndex > 0) {
        //如果中间是分栏页
        --initIndex
      }
    }
    Xut.View.setPageNumber({
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
    if(this.columnCount !== newColumnCount) {

      this.columnCount = newColumnCount
      this.maxBorder = newColumnCount - 1

      let visualPageId = Xut.Presentation.GetPageId()
      let columnPageId = this.chapterId
      let location

      //区分控制column属于哪个页面对象
      if(visualPageId > columnPageId) {
        location = 'left'
      } else if(visualPageId < columnPageId) {
        location = 'right'
      } else if(visualPageId === columnPageId) {
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
    if(Object.keys(this.zoomObjs).length) {
      _.each(this.zoomObjs, (obj, key) => {
        obj.destroy()
        this.zoomObjs[key] = null
      })
    }

    this.swipe && this.swipe.destroy()
  }

}
