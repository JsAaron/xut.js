import { config } from '../../config/index'

/*
 封装插件iScroll,代理委托页面滑动处理了
 1 如果锁住了事件冒泡，那么全局翻页不会触发，这里可能需要处理
 2 跟踪代码上下滑动会冲突
*/
export default function IScroll(node, options, delegate) {

  ///////////////////////////////
  /// 启动委托
  /// 启动代码追踪swipe的情况下
  /// 那么停掉事件冒泡，否则滑动会触发
  ///////////////////////////////
  if (delegate && config.hasTrackCode('swipe')) {

    options.stopPropagation = true

    /*启动事件反馈*/
    options.probeType = 2

    const iscroll = new iScroll(node, options)


    iscroll.on('scroll', function (e) {

      /*
      只有横向移动的时候,并且总页面是没有被锁定的，
      因为多个页面都可能iscoll，每个页面的iscoll都能控制翻页，所以这里要排除
      */
      if (this.directionLocked === 'h' && !Xut.Application.hasEnabled()) {

        //减少抖动
        //算一次有效的滑动
        //移动距离必须20px才开始移动
        let xWait = 20
        if (Math.abs(this.distX) <= xWait) return;

        //需要叠加排除值
        if (this.distX > 0) {
          xWait = (-xWait)
        }

        Xut.View.SetSwiperMove({
          action: 'flipMove',
          direction: this.distX > 0 ? 'prev' : 'next',
          distance: this.distX + xWait,
          speed: 0
        })
      }
    })

    iscroll.on('scrollEnd', function (e) {
      if (this.directionLocked === 'h' && this.moved && !Xut.Application.hasEnabled()) {
        const duration = new Date().getTime() - this.startTime
        const deltaX = Math.abs(this.distX)
        const isValidSlide = duration < 200 && deltaX > 30 || deltaX > config.visualSize.width / 6
          /*判断是翻页，并且不是首位边界页面*/
        if (isValidSlide && !Xut.View.GetSwpierBorderBounce(this.distX)) {
          this.distX > 0 ? Xut.View.GotoPrevSlide() : Xut.View.GotoNextSlide()
        } else {
          /*反弹*/
          Xut.View.SetSwiperMove({
            action: 'flipRebound',
            direction: this.distX > 0 ? 'prev' : 'next',
            distance: 0,
            speed: 300
          })
        }
      }
    })

    return iscroll

  }

  return new iScroll(node, options)

}
