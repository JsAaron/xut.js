import { config } from '../config/index'

/**
 * 横版委托
 * 横版状态下，如果iscroll是Y轴滚动
 */
export function delegateScrollX(node, options) {

  _.extend(options, {
    stopPropagation: true,
    probeType: 2
  })

  const iscroll = new iScroll(node, options)

  iscroll.on('scroll', function (e) {
    /*如果横版滑动了，并且页面允许翻页*/
    if (iscroll.directionLocked === 'h' && Xut.View.HasEnabledSwiper()) {
      if (iscroll.distX > 0) {
        /*prev*/
        Xut.View.SetSwiperMove({
          action: 'flipMove',
          direction: 'prev',
          distance: iscroll.distX - 10,
          speed: 0
        })
      } else {
        /*next*/
        Xut.View.SetSwiperMove({
          action: 'flipMove',
          direction: 'next',
          distance: iscroll.distX + 10,
          speed: 0
        })
      }
    }
  })

  iscroll.on('scrollEnd', function (e) {
    const typeAction = Xut.View.GetSwiperActionType(iscroll.distX, 0, iscroll.endTime - iscroll.startTime, 'h')
    if (typeAction === 'flipOver') {
      if (iscroll.distX > 0) {
        Xut.View.GotoPrevSlide()
      } else {
        Xut.View.GotoNextSlide()
      }
    } else if (typeAction === 'flipRebound') {
      if (iscroll.distX > 0) {
        /*left*/
        Xut.View.SetSwiperMove({
          action: 'flipRebound',
          direction: 'prev',
          distance: 0,
          speed: 300
        })
      } else {
        /*right*/
        Xut.View.SetSwiperMove({
          action: 'flipRebound',
          direction: 'next',
          distance: 0,
          speed: 300
        })
      }
    }
  })

  return iscroll
}


/**
 * 竖版委托
 * 上下滑动的时候，可以翻页
 * @return {[type]} [description]
 */
export function delegateScrollY(node, options) {

  _.extend(options, {
    stopPropagation: true,
    preventDefault: false,
    bounce: false,
    probeType: 2
  })

  const iscroll = new iScroll(node, options)

  /*如果是边界翻页*/
  let hasBorderRun = false
  iscroll.on('beforeScrollStart', e => {
    hasBorderRun = false
  })

  /**
   * directionY
   *   1 向后
   *   -1 向前
   */
  iscroll.on('scroll', e => {
    /*探测下全局是否可以滑动了*/
    if (Xut.View.HasEnabledSwiper()) {
      if (iscroll.directionY === -1 && iscroll.startY === 0) {
        hasBorderRun = true
          /*top*/
        Xut.View.SetSwiperMove({
          action: 'flipMove',
          direction: 'prev',
          distance: iscroll.distY - 10,
          speed: 0
        })
      } else if (iscroll.directionY === 1 && iscroll.startY === iscroll.maxScrollY) {
        /*down*/
        hasBorderRun = true
        Xut.View.SetSwiperMove({
          action: 'flipMove',
          direction: 'next',
          distance: iscroll.distY + 10,
          speed: 0
        })
      } else {
        /**
         * 内部滑动
         */
        iscroll._execEvent('scrollContent', e);
      }
    }
  })

  iscroll.on('scrollEnd', function (e) {
    if (hasBorderRun) {
      const typeAction = Xut.View.GetSwiperActionType(0, iscroll.distY, iscroll.endTime - iscroll.startTime, 'v')
      if (typeAction === 'flipOver') {
        if (iscroll.directionY === 1) {
          Xut.View.GotoNextSlide()
          iscroll._execEvent('scrollExit', 'down');
        } else if (iscroll.directionY === -1) {
          Xut.View.GotoPrevSlide()
          iscroll._execEvent('scrollExit', 'up');
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



  return iscroll
}


/*
 封装插件iScroll,代理委托页面滑动处理了
 1 横版模式下，竖版滑动iscroll 不处理，(上下滑动，左右全局翻页)
 2 竖版模式下，竖版滑动iscroll 需要处理，竖版边界要翻页
*/
export function IScroll(node, options, delegate) {

  ///////////////////////////////
  /// 竖版禁止上下滑动的冒泡，并且不是强制的横屏滑动模式
  ///////////////////////////////
  if (delegate && config.launch.scrollMode === 'v') {
    /*如果是竖版滑动，那么就需要代理下，竖版滑动后，上下翻页*/
    if (!options.scrollX || options.scrollY) {
      return new delegateScrollY(node, options)
    }
  }

  ///////////////////////////////
  /// 启动委托
  /// 启动代码追踪swipe的情况下
  /// 那么停掉事件冒泡，否则滑动会触发
  ///////////////////////////////
  // if (delegate && config.launch.scrollMode === 'h') {
  /*默认参数：横版，上下滑动, 代理左右*/
  // if (options.scrollX === undefined && options.scrollY === undefined || options.scrollY === true) {
  // return new delegateScrollX(node, options)
  // }
  // }

  // if (config.hasTrackCode('swipe')) {
  //   /*启动事件追踪，需要禁止左右默认的左右翻页*/
  //   options.stopPropagation = true
  //   return new iScroll(node, options)
  // }

  return new iScroll(node, options)

}
