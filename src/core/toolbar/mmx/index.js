/**
 * 秒秒学定制工具栏
 */
import { config } from '../../config/index'
import { getPostMessageFn } from '../../api/post-message'
import {
  hash,
  $on,
  $off,
  $handle,
  $target,
  defAccess
} from '../../util/index'

/**
 * 全局工具栏
 */
export default class GlobalBar {

  constructor({
    $sceneNode,
    pageTotal,
    currentPage
  } = {}) {
    this.$sceneNode = $sceneNode
    this.pageTotal = pageTotal
    this.currentPage = currentPage
    this._init()
  }

  _init() {
    //标记最大的索引号
    this._maxIndex = 0
    this._initData()
    this._initContainer()
    this._leftView()
    this._centerView()
    this._rightView()
    this._bindEvent()
    this._bindWatch()
    this.pageElement = this.container.find('.g-page .g-page-current')
    this.$sceneNode.append(this.container)
    config.launch.pageBar.height = config.visualSize.height - this.container.offset().top
  }

  /**
   * 绑定监听
   * @return {[type]} [description]
   */
  _bindWatch() {

    const self = this

    /**
     * 设置小圆点的变化
     */
    function setDot(className) {
      //通过接收外部的状态
      //修改本身的圆点
      //data.dot /show /hide
      let dotStatus = 'hide' //默认隐藏
      let element = self.container.find(className)
      return function(pageIndex, newState, className) {
        //只处理当前页面
        if (pageIndex && pageIndex == self.currentPage) {
          if (newState && newState !== dotStatus) {
            if (newState === 'show') {
              element.removeClass(className + '-defalut')
              element.addClass(className + '-message')
            }
            if (newState === 'hide') {
              element.removeClass(className + '-message')
              element.addClass(className + '-defalut')
            }
            dotStatus = newState //更新状态
          }
        }
      }
    }

    if (this.bottomConfig) {
      //如果配置了答题讨论
      //才提供可更新
      if (this.bottomConfig.forum) {
        const updateDot = setDot('.g-forum-click')
        Xut.Application.Watch('globalForumDot', function(data) {
          updateDot(data.pageIndex, data.dot, 'forum')
        })
      }

      //提交作业
      if (this.bottomConfig.commitWork) {
        const updateDot = setDot('.g-work-click')
        Xut.Application.Watch('globalCommitWorkDot', function(data) {
          updateDot(data.pageIndex, data.dot, 'commitWork')
        })
      }
    }

    //停止关闭下一个翻页箭头控制
    Xut.Application.Watch('enableFlip', function(pageIndex) {
      self._directionArrows && self._directionArrows.resetNext(pageIndex)
    })

  }

  /**
   * 绑定事件
   * @return {[type]} [description]
   */
  _bindEvent() {
    const self = this
    $on(this.container, {
      end: function(event) {
        event.stopPropagation()
        //有3个按钮样式有多个样式
        //只取第一个
        const classNames = event.target.className.split(' ')
        switch (classNames[0]) {
          case "g-cover": //回主页
            Xut.View.GotoSlide(1)
            break;
          case "g-dir": //打开目录
            Xut.Assist.GlobalDirToggle()
            break;
          case "g-prev":
            Xut.View.GotoPrevSlide()
            break;
          case "g-next":
            //如果不允许跳转
            if (~event.target.parentNode.className.indexOf('g-direction-end')) {
              return
            }
            Xut.View.GotoNextSlide()
            break;
          case "g-learn-click": //继续学习
            if (classNames[1] === 'on-click') { //必须要可点击
              Xut.Assist.GlobalKeepLearn()
            }
            break;
          case "g-work-click": //提交作业
            Xut.Assist.GlobalCommitWork()
            break;
          case "g-forum-click": //答题讨论
            Xut.Assist.GlobalForumToggle()
            break;
        }
      }
    })
  }

  _initData() {
    this.learnButtonClassName = '' //学习按钮的样式
    //工具栏的高度
    this.barHeight = config.launch.pageBar.bottom || Math.round(config.visualSize.height / 17)
  }


  /**
   * 容器
   * @return {[type]} [description]
   */
  _initContainer() {
    this.container = $(`<ul class="xut-global-bar"></ul>`)
  }

  /**
   * 左边区域
   * @return {[type]} [description]
   */
  _leftView() {
    const html =
      `<li class="g-left">
          <div><a class="g-dir"></a></div>
          <div><a class="g-cover"></a></div>
       </li>`
    this.container.append(String.styleFormat(html))
  }

  /**
   * 中间区域，拼接问题
   * 所以合并到一个li中
   * @return {[type]} [description]
   */
  _centerView() {

    const html =
      `<li class="g-center g-direction-first">
         <div class="g-prev g-prev-noclick"></div>
         <div class="g-title"><a>${config.launch.pageBar.title || config.data.shortName}</a></div>
         <div class="g-next g-next-noclick"></div>
       </li>`

    this.container.append(String.styleFormat(html))

    let self = this

    /**
     * 根据页面的类型
     * 设置是否显示下一页箭头可点击
     * 必须要练习题页面
     */
    function setNextArrows(rootElement, pageIndex) {
      const pb = Xut.Presentation.GetPageBase(self.currentPage - 1)
      //如果已经游览过的页面
      //跳过设置
      if (self._maxIndex >= pageIndex) {
        return false
      }
      if (pb && pb.pageAttr === 'practicepage') {
        rootElement.addClass('g-direction-end')
        return true
      }
    }

    //控制按钮状态
    function setIcon() {
      let rootElement = self.container.find('.g-center')
      let isFirst = true
      let isEnd = true
      let addClass = (className) => rootElement.addClass(className)
      let removeClass = (className) => rootElement.removeClass(className)
      return {
        /**
         * 设置默认状态
         */
        default: function(pageIndex) {
          //每次都复位练习，重新设置题状态
          //默认下一页箭头显示
          let nextArrowsShow = true
          //首页
          if (self.currentPage === 1) {
            if (isEnd) { //直接重尾页跳到首页
              isEnd = false
              removeClass('g-direction-end')
            }
            isFirst = true
            addClass('g-direction-first')
          }
          //尾页
          else if (self.currentPage === self.pageTotal) {
            if (isFirst) { //直接重首页跳到尾页
              isFirst = false
              removeClass('g-direction-first')
            }
            isEnd = true
            addClass('g-direction-end')
          } else {

            //如果是练习题就标记
            //否则就还清状态
            if (setNextArrows(rootElement, pageIndex)) {
              nextArrowsShow = false
            }

            //中间页面
            if (isFirst) {
              isFirst = false
              removeClass('g-direction-first')
            }

            if (isEnd) {
              isEnd = false
              removeClass('g-direction-end')
            }

            if (nextArrowsShow) {
              //如果显示下一页箭头
              removeClass('g-direction-end')
            } else {
              //隐藏下一页箭头
              addClass('g-direction-end')
            }
          }
        },
        /**
         * 重设下一页状态
         */
        resetNext(pageIndex) {
          self._maxIndex = ++pageIndex
          //如果不是尾页设置
          if (self.currentPage !== self.pageTotal) {
            removeClass('g-direction-end')
          }
        }
      }
    }

    //控制方向图片
    //前进或者后退
    this._directionArrows = setIcon()
  }

  /**
   * 获取学习按钮的状态
   */
  _getLearnButtonClassName() {
    //如果是最后一页或倒数第二页，允许点击
    if (this.currentPage >= this.pageTotal - 1) {
      return 'on-click'
    }
    return 'no-click'
  }

  /**
   * 设置学习按钮
   */
  _setLearnButton() {
    //如果状态不对，就需要重新设置
    const className = this._getLearnButtonClassName()
    if (className !== this.learnButtonClassName) {
      const element = this.container.find('.g-learn-click')
      //移除旧样式 增加新的
      element.removeClass(this.learnButtonClassName)
      element.addClass(className)
      this.learnButtonClassName = className
    }
  }

  /**
   * 右边区域
   * @return {[type]} [description]
   */
  _rightView() {
    //根据iframe的配置，确定是否显示继续学习
    //如果没有则占空位
    const button = this.bottomConfig = config.launch.pageBar && config.launch.pageBar.button

    let goLearnHtml = ''
    let commitWorkHtml = ''
    let forumHTML = ''

    if (button) {
      //下一节，继续学习
      if (button.keepLearn) {
        function getLearn(clickClass) {
          return `<div class="g-learn"><a class="g-learn-click ${clickClass}"></a></div>`
        }
        //如果是最后一页或倒数第二页，允许点击
        if (this._getLearnButtonClassName() === 'on-click') {
          this.learnButtonClassName = 'on-click'
          goLearnHtml = getLearn('on-click')
        } else {
          this.learnButtonClassName = 'no-click'
          goLearnHtml = getLearn('no-click')
        }
      }

      //提交作业
      if (button.commitWork) {
        //commitWork-defalut commitWork-message
        commitWorkHtml = `<div class="g-work"><a class="g-work-click commitWork-defalut"></a></div>`
      }

      //答题讨论
      if (button.forum) {
        forumHTML = `<div class="g-forum"><a class="g-forum-click forum-defalut"></a></div>`
      }

    }


    const html =
      `<li class="g-right">
          <div class="g-page">
            <div>
              <a class="g-page-current">${this.currentPage}</a>
              <a>${this.pageTotal}</a>
            </div>
          </div>
          ${forumHTML}
          ${commitWorkHtml}
          ${goLearnHtml}
       </li>`
    this.container.append(String.styleFormat(html))
  }

  /**
   * 更新页码
   * @return {[type]} [description]
   */
  updatePointer({
    parentIndex
  }) {
    ++parentIndex //从1开始索引，parentIndex默认从0开始
    if (parentIndex !== undefined && parentIndex !== this.currentPage) {
      this.currentPage = parentIndex
      this.pageElement.html(parentIndex)
      this._setLearnButton()
    }

    //首尾，控制方向图片
    this._directionArrows.default(parentIndex)

    //每次翻页需要圆点状态请求
    if (this.bottomConfig) {
      if (this.bottomConfig.forum) {
        Xut.Assist.RequestDot('forumDot', this.currentPage)
      }
      if (this.bottomConfig.commitWork) {
        Xut.Assist.RequestDot('commitWorkDot', this.currentPage)
      }
    }
  }

  /**
   * 销毁
   * @return {[type]} [description]
   */
  destroy() {
    Xut.Application.unWatch('globalForumDot')
    Xut.Application.unWatch('globalCommitWorkDot')
    Xut.Application.unWatch('enableFlip')
    this._directionArrows = null
    $off(this.container)
    this.$sceneNode = null
    this.container = null
    this.pageElement = null
  }

}
