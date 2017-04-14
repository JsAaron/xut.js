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
  if(delegate && config.hasTrackCode('swipe')) {

    options.stopPropagation = true

    /*启动事件反馈*/
    options.probeType = 2

    const iscroll = new iScroll(node, options)

    iscroll.on('scroll', function(e) {
      /*只有横向移动的时候*/
      if(this.directionLocked === 'h') {
        this.distX > 0 ?
          Xut.View.MovePage(this.distX, 0, "prev", "flipMove") :
          Xut.View.MovePage(this.distX, 0, "next", "flipMove")
      }
    })

    iscroll.on('scrollEnd', function(e) {
      if(this.directionLocked === 'h' && this.moved) {
        const duration = new Date().getTime() - this.startTime
        const deltaX = Math.abs(this.distX)
        const isValidSlide = duration < 200 && deltaX > 30 || deltaX > config.visualSize.width / 6
        if(isValidSlide) {
          this.distX > 0 ? Xut.View.GotoPrevSlide() : Xut.View.GotoNextSlide()
        } else {
          /*反弹*/
          Xut.View.MovePage(0, 300, "next", "flipRebound")
        }
      }
    })

    return iscroll

  } else {
    /*其余滑动*/
    return new iScroll(node, options)
  }
}
