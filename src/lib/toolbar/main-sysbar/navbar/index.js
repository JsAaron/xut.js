/**
 * 目录列表
 * @param  {[type]} hindex    [description]
 * @param  {[type]} pageArray [description]
 * @param  {[type]} modules   [description]
 * @return {[type]}           [description]
 */
import layout from './struct'
import Section from './section'

export default class Navbar {

  /**
   * 切换
   * @param  {[type]} pageIndex [description]
   * @return {[type]}           [description]
   */
  toggle(pageIndex) {
    this.pageIndex = pageIndex
    this._navControl()
  }

  /**
   * 隐藏
   * @return {[type]} [description]
   */
  hide() {
    this.isRunning && this._navControl()
  }


  /**
   * 销毁
   * @return {[type]} [description]
   */
  destroy() {
    if(this.sectionObj) {
      this.sectionObj.destroy()
      this.sectionObj = null
    }
    this.$container = null
    this.$button = null
  }

  constructor(pageIndex) {
    this.pageIndex = pageIndex
    this.isRunning = false //运行状态
    this.$container = $(".xut-nav-bar") //显示容器
    this.$button = $(".xut-control-navbar") //触发按钮
    this._initialize()
  }

  _initialize() {
    const data = []
    Xut.data.query('Chapter', Xut.data.novelId, 'seasonId', item => data.push(item))
    Xut.nextTick({
      'container': this.$container,
      'content': layout(data)
    }, () => {
      this.sectionObj = new Section(data) //目录对象
      this.sectionObj.userIscroll(this.pageIndex) //初始化滑动
      this.sectionObj.createThumb() //初始缩略图
      this._navControl() //初始化样式
    })
  }

  /**
   * 控制导航条
   * @return {[type]} [description]
   */
  _navControl() {

    const action = this.$button.attr('fly') || 'in' //判断点击的动作
    const isIn = action === 'in'

    //初始化目录栏的样式
    //能够显示出来
    if(isIn) {
      this.$container.css({
        'z-index': 0,
        'opacity': 0,
        'display': 'block'
      })
    }

    //触发控制条
    this.$button.css('opacity', isIn ? 0.5 : 1)

    //执行动画
    //出现
    if(isIn) {
      //导航需要重置
      //不同的页面定位不一定
      this.sectionObj.refresh()
      this.sectionObj.scrollTo(this.pageIndex)

      //动画出现
      this.$container.css({
        'z-index': Xut.zIndexlevel(),
        'opacity': 1
      })
      this.$button.attr('fly', 'out')
      this.isRunning = true
    } else {
      //隐藏
      this.$button.attr('fly', 'in')
      this.$container.hide()
      this.isRunning = false
    }
  }



}