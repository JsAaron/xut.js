/**
 * html文本框
 * @param  {[type]} ){} [description]
 * @return {[type]}       [description]
 */

import { config } from '../../../config/index'
import { bindContentEvent } from '../event/event'
import { $on, $off, $setStorage, $getStorage } from '../../../util/index'
import { IScroll } from '../../../expand/iscroll'

const docElement = document.documentElement

//默认字体
let defaultFontSize

try {
  defaultFontSize = parseInt(getComputedStyle(docElement).fontSize)
} catch(er) {
  defaultFontSize = 16
}

//新的字体大小
let newFontSize

let whiteObject = {
  "rgb(255, 255, 255)": true,
  "#ffffff": true,
  "#FFFFFF": true,
  "#fff": true,
  "#FFF": true
}

/**
 * 字体大小
 * @type {Array}
 */
const sizeArray = ["1", "1.5", "2.0"]

const getFontSize = () => {
  newFontSize = defaultFontSize * config.proportion.width
  return [
    Math.floor(newFontSize * 1.5),
    Math.floor(newFontSize * 2.0),
    Math.floor(newFontSize * 2.5)
  ]
}

/**
 * 工具栏布局
 * @return {[type]} [description]
 */
function toolBar(fontSize) {
  const baseValue1 = fontSize[0]
  const baseValue2 = fontSize[1]
  const baseValue3 = fontSize[2]
  const boxHTML =
    `<div class="htmlbox_close_container">
            <a class="htmlbox_close"></a>
        </div>
        <ul class="htmlbox_fontsizeUl">
            <li>
                <a class="htmlbox_small"
                   style="width:${baseValue1}px;height:${baseValue1}px;margin-top:-${baseValue1 / 2}px"></a>
            </li>
            <li>
                <a class="htmlbox_middle"
                   style="width:${baseValue2}px;height:${baseValue2}px;margin-top:-${baseValue2 / 2}px"></a></li>
            <li>
                <a class="htmlbox_big"
                   style="width:${baseValue3}px;height:${baseValue3}px;margin-top:-${baseValue3 / 2}px"></a>
            </li>
        </ul>`


  return String.styleFormat(boxHTML)
}

/**
 * 创建盒子容器
 * @return {[type]} [description]
 */
function createWapper(boxHeight, context, iscrollName, textContent) {
  var wapper =
    `<div class="htmlbox-container">
            <div class="htmlbox-toolbar" style="height:${boxHeight}px;line-height:${boxHeight}px;">${context}</div>
            <div class="${iscrollName}" style="overflow:hidden;position:absolute;width:100%;height:92%;">
                <ul>${textContent}</ul>
            </div>
        </div>`
  return String.styleFormat(wapper)
}


export default class HtmlBox {

  constructor(contentId, $contentNode) {

    this.contentId = contentId
    this.$contentNode = $contentNode

    const self = this

    //事件对象引用
    const eventHandler = function(eventReference, eventHandler) {
      self.eventReference = eventReference;
      self.eventHandler = eventHandler;
    }

    //绑定点击事件
    bindContentEvent({
      'eventRun': function() {
        Xut.View.HideToolBar('pageNumber')
        self._init(contentId, $contentNode)
      },
      'eventHandler': eventHandler,
      'eventContext': $contentNode,
      'eventName': "tap",
      'domMode': true
    })
  }

  _init(contentId, $contentNode) {
    var self = this;

    self._adjustColor();

    //移除偏移量 存在偏移量造成文字被覆盖
    var textContent = $contentNode.find(">").html();
    textContent = textContent.replace(/translate\(0px, -\d+px\)/g, 'translate(0px,0px)');

    var iscrollName = "htmlbox-iscroll-" + contentId;

    //缓存名
    this.storageName = iscrollName + config.data.appId;

    const fontSize = getFontSize()

    //工具栏的高度必须大于最大的字体大小
    const boxHeight = fontSize[2] + 2;
    //关闭按钮的top值
    const closeTop = Math.floor(boxHeight / 2);

    //获取保存的字体值
    const initValue = $getStorage(this.storageName)
    if(initValue) {
      this._adjustSize(initValue)
    } else {
      //默认
      this._adjustSize(newFontSize)
    }

    /**
     * 创建容器
     * @type {[type]}
     */
    this.$htmlbox = $(createWapper(boxHeight, toolBar(fontSize), iscrollName, textContent))

    $contentNode.after(this.$htmlbox)

    //修改::before ::after伪元素top值 确保关闭按钮垂直居中
    document.styleSheets[0].addRule('.htmlbox_close::before', 'top:' + closeTop + 'px');
    document.styleSheets[0].insertRule('.htmlbox_close::before { top:' + closeTop + 'px }', 0);
    document.styleSheets[0].addRule('.htmlbox_close::after', 'top:' + closeTop + 'px');
    document.styleSheets[0].insertRule('.htmlbox_close::after { top:' + closeTop + 'px }', 0);

    //修正htmlbox位置
    this._relocateToolbar(iscrollName);
    //卷滚
    this._createIscroll(this.$htmlbox, iscrollName)

    /**
     * 绑定事件上下文呢
     * @type {[type]}
     */
    this.eventContext = this.$htmlbox.find('.htmlbox-toolbar')[0]

    /**
     * 改变字体与刷新卷滚
     * @param  {[type]} fontsize [description]
     * @return {[type]}          [description]
     */
    const change = function(fontsize) {
      self._adjustSize(fontsize * newFontSize, true);
      self.iscroll && self.iscroll.refresh()
    }

    /**
     * 关闭
     * @return {[type]} [description]
     */
    const colse = function() {
      self._restoreColor()

      //还原跟字体大小
      self._adjustSize(defaultFontSize)
      self.removeBox()
      Xut.View.ShowToolBar('pageNumber')
    }


    //处理器
    var process = {
      htmlbox_close_container: colse,
      htmlbox_close: colse,
      htmlbox_small() {
        change(sizeArray[0]);
      },
      htmlbox_middle() {
        change(sizeArray[1]);
      },
      htmlbox_big() {
        change(sizeArray[2]);
      }
    }

    $on(this.eventContext, {
      start: function(e) {
        var className = e.target.className;
        process[className] && process[className]();
      }
    })
  }


  /**
   * 遍历p span文字标签 调整字体颜色
   * @return {[type]} [description]
   */
  _adjustColor() {
    this.textLabelArray = ['p', 'span'];
    var self = this;
    _.each(self.textLabelArray, function(text) {
      _.each(self.$contentNode.find(text), function(el) {
        var formerColor = getComputedStyle(el).color;
        //若字体颜色为白色 调整为黑色
        if(whiteObject.hasOwnProperty(formerColor)) {
          el.hasFormerColor = true;
          el.style.color = "black"
        }
      })
    })
  }


  /**
   * 调整字体大小
   * @return {[type]} [description]
   */
  _adjustSize(value, save) {
    value = parseInt(value);
    docElement.style.fontSize = value + 'px'
    save && $setStorage(this.storageName, value)
  }


  /**
   * 恢复放大过的字体颜色
   * @return {[type]} [description]
   */
  _restoreColor() {
    var self = this;
    _.each(self.textLabelArray, function(text) {
      _.each(self.$contentNode.find(text), function(el) {
        //将字体由黑色恢复为白色
        if(el.hasFormerColor) {
          el.style.color = "white";
          el.hasFormerColor = false;
        }
      })
    });
  }

  /**
   * 修正htmlbox位置
   * @param  {[type]} iscrollName [description]
   * @return {[type]}             [description]
   */
  _relocateToolbar(iscrollName) {
    //修正模式2下屏幕溢出高度
    const visualSize = config.visualSize
    const left = visualSize.overflowWidth && Math.abs(visualSize.left) || 0
    const top = visualSize.overflowHeight && Math.abs(visualSize.top) || 0
    this.$htmlbox[0].style.cssText += "margin-top:" + top + "px";

    //修正模式3下屏幕溢出宽度
    //1.修正关闭按钮::before ::after伪元素left值 确保关闭按钮水平居中
    //首先恢复到最开始的left:2%状态
    document.styleSheets[0].addRule('.htmlbox_close::before', 'left:2%');
    document.styleSheets[0].insertRule('.htmlbox_close::before { left:2% }', 0);
    document.styleSheets[0].addRule('.htmlbox_close::after', 'left:2%');
    document.styleSheets[0].insertRule('.htmlbox_close::after { left:2% }', 0);
    const formerLeft = window.getComputedStyle(this.$htmlbox.find('.htmlbox_close')[0], '::before').getPropertyValue('left');
    const currentLeft = parseInt(formerLeft) + left;


    //开始修正
    document.styleSheets[0].addRule('.htmlbox_close::before', 'left:' + currentLeft + 'px');
    document.styleSheets[0].insertRule('.htmlbox_close::before { left:' + currentLeft + 'px }', 0);
    document.styleSheets[0].addRule('.htmlbox_close::after', 'left:' + currentLeft + 'px');
    document.styleSheets[0].insertRule('.htmlbox_close::after { left:' + currentLeft + 'px }', 0);
    //2.修正字体放大ul按钮
    this.$htmlbox.find(".htmlbox_fontsizeUl")[0].style.cssText += "margin-right:" + left + "px";
    //3.修正文本框
    this.$htmlbox.find("." + iscrollName)[0].style.cssText += "margin-left:" + left + "px;";
    var formerScrollWidth = window.getComputedStyle(this.$htmlbox.find("." + iscrollName)[0]).getPropertyValue('width');

    var currentScrollWidth = parseInt(formerScrollWidth) - 2 * left;

    this.$htmlbox.find("." + iscrollName).width(currentScrollWidth)

  }

  /**
   * 卷滚
   * @param  {[type]} iscrollName [description]
   * @return {[type]}             [description]
   */
  _createIscroll($htmlbox, iscrollName) {
    const ulHeight = $htmlbox.find(`.${iscrollName} >ul`).css('height')
    const htmlboxHeight = $htmlbox.find(`.${iscrollName}`).css('height')

    //溢出，增加卷滚
    if(parseInt(ulHeight) > parseInt(htmlboxHeight)) {
      this.iscroll = IScroll("." + iscrollName, {
        scrollbars: 'custom',
        fadeScrollbars: true
      })
    }
  }

  /**
   * 移除盒子
   * @return {[type]} [description]
   */
  removeBox() {
    if(this.eventContext) {
      $off(this.eventContext)
      this.eventContext = null
    }
    this.$htmlbox && this.$htmlbox.remove()
    if(this.iscroll) {
      this.iscroll.destroy()
      this.iscroll = null
    }
  }

  /**
   * 销毁
   * @return {[type]} [description]
   */
  destroy() {
    _.each(this.eventReference, function(off) {
      off("tap")
    })
    this.removeBox()
  }
}
