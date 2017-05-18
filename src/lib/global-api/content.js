export function initContents() {

  //存在文档碎片
  //针对音频字幕增加的快捷查找
  Xut.Contents.contentsFragment = {}

  /**
   * 是否为canvas元素
   * 用来判断事件冒泡
   * 判断当前元素是否支持滑动
   * 默认任何元素都支持滑动
   * @type {Boolean}
   */
  Xut.Contents.Canvas = {

    /**
     * 是否允许滑动
     * @type {Boolean}
     */
    SupportSwipe: true,

    /**
     * 对象是否滑动
     * @type {Boolean}
     */
    isSwipe: false,

    /**
     * 对象是否点击
     */
    isTap: false,

    /**
     * 复位标记
     */
    Reset() {
      Xut.Contents.Canvas.SupportSwipe = true;
      Xut.Contents.Canvas.isSwipe = false;
    },

    /**
     * 判断是否可以滑动
     * @return {[type]} [description]
     */
    getSupportState() {
      var state;
      if(Xut.Contents.Canvas.SupportSwipe) {
        state = true;
      } else {
        state = false;
      }
      //清空状态
      Xut.Contents.Canvas.Reset();
      return state
    },

    /**
     * 判断是否绑定了滑动事件
     * @return {Boolean} [description]
     */
    getIsSwipe() {
      var state;
      if(Xut.Contents.Canvas.isSwipe) {
        state = true;
      } else {
        state = false;
      }
      //清空状态
      Xut.Contents.Canvas.Reset();
      return state;
    },

    /**
     * 是否绑定了点击事件
     */
    getIsTap() {
      Xut.Contents.Canvas.isTap = false;
      return Xut.Contents.Canvas.isTap;
    }
  }

  /**
   * 恢复节点的默认控制
   * 默认是系统接管
   * 如果'drag', 'dragTag', 'swipeleft', 'swiperight', 'swipeup', 'swipedown'等事件会重写
   * 还需要考虑第三方调用，所以需要给一个重写的接口
   * @return {[type]} [description]
   * Content_1_3
   * [Content_1_3,Content_1_4,Content_1_5]
   */
  Xut.Contents.ResetDefaultControl = function(pageType, id, value) {
    if(!id) return;
    var elements
    var handle = (ele) => {
      if(value) {
        ele.attr('data-behavior', value);
      } else {
        ele.attr('data-behavior', 'disable');
      }
    }
    if((elements = Xut.Contents.Get(pageType, id)) && elements.$contentNode) {
      handle(elements.$contentNode)
    } else {
      elements = $("#" + id);
      elements.length && handle(elements)
    }
  }

  /**
   * 针对SVG无节点操作
   * 关闭控制
   */
  Xut.Contents.DisableControl = function(callback) {
    return {
      behavior: 'data-behavior',
      value: 'disable'
    }
  }

  /**
   * 针对SVG无节点操作
   * 启动控制
   */
  Xut.Contents.EnableControl = function(Value) {
    return {
      behavior: 'data-behavior',
      value: Value || 'click-swipe'
    }
  }

}