/********************************************************************
 *
 *                  创建所有的JS页面零件类
 *                  1 js
 *                  2 page
 *                  3 svg
 *                  4 canvas
 *                  5 webgL
 *
 * *******************************************************************/

import { fileLoad, removeFileLoad } from './loader'
import { createData } from './data'
import AdvSprite from './extend/adv.sprite'
import ScrollArea from './extend/scroll.area'
import { parseJSON } from '../../../util/lang'

/**
 * 解析数据,获取content对象
 * @return {[type]} [description]
 */
function parseContentObjs(pageType, inputPara, pageProportion) {
  let contentIds = [];
  inputPara.content && _.each(inputPara.content, (contentId) => {
    contentIds.push(contentId);
  });
  return Xut.Contents.GetPageWidgetData(pageType, contentIds, pageProportion)
}


/**
 * 页面零件
 * @param {[type]} data [description]
 */
export default class PageWidget {

  constructor(data) {
    _.extend(this, data)
    this.pageObj = null
    this._init()
  }

  /**
   * 初始化,加载文件
   * @return {[type]} [description]
   */
  _init() {
    //滚动区域
    if (this.widgetId == 60 && this.widgetName == "scrollarea") {
      var arg = this._getOptions()
      let resetStyle = this._resetOpacityVisibility(arg[0], arg[1])
      this.pageObj = new ScrollArea(arg[0], arg[1])
      //还原原有样式
      _.each(resetStyle, function(resetFunction, value) {
        resetFunction();
      })
      resetStyle = null;

    }
    //Load the localized code first
    //Combined advanced Sprite
    else if (this.widgetId == 72 && this.widgetName == "spirit") {
      var arg = this._getOptions()
      this.pageObj = AdvSprite(arg[0], arg[1])
    }
    //直接扩展加载
    else {
      //If there is no
      if (typeof window[this.widgetName + "Widget"] != "function") {
        this.hasload = true
        fileLoad(this._executive, this)
      } else {
        this._executive()
      }
    }
  }

  /**
   * 获取参数
   * 得到content对象与数据
   * @return {[type]} [description]
   */
  _getOptions() {
    return [
      createData(this.inputPara, this.scrollPaintingMode, this.calculate),
      parseContentObjs(this.pageType, this.inputPara, this.pageProportion)
    ]
  }

  /**
   * 元素隐藏状态下，绑定iScroll获取高度是有问题
   * 所以这里需要补丁方式修正一下
     让其不可见，但是可以获取高度 存在卷滚区域 第一个子元素最开始也要修改样式
     修改第一个子元素样式后 在初始化卷滚条后不是将第一个子元素的visibility还原为
     其最开始的状态，而是跟scroll.area.js中346行一样的值
   * @return {[type]} [description]
   */
  _resetOpacityVisibility(firstArg, secondArg) {
    let resetStyle = new Array();

    for (var i = 0; i < secondArg.length; i++) {
      let content = secondArg[i];
      let $parentNode = $("#" + content.idName)
      let visible = $parentNode.css('visibility')
      //元素隐藏状态下，绑定iScroll获取高度是有问题
      //所以这里需要补丁方式修正一下
      //让其不可见，但是可以获取高度 存在卷滚区域 只有第一个卷滚区域的第一个子元素最开始也要修改样式
      if (visible == 'hidden') {
        if (i == 0) {
          //第一个卷滚区域的第一个子元素样式修改 如果不改的话 强制显示后他会显示出来 出现闪图现象
          let parent = secondArg[0]
          let prefix = firstArg.contentPrefix
          let contentName, $firstChild
          let theTitle = parseJSON(parent.theTitle)
          let obj = theTitle["data-widgetscrollareaList"].split(",");
          if (obj[0]) {
            contentName = prefix + obj[0]
            $firstChild = $("#" + contentName)
            $firstChild.css('visibility', "hidden")
          }

          const firstChildTemp = function() {
            $firstChild.css('visibility', "inherit")
          }
          resetStyle.push(firstChildTemp)
        }

        let opacity = $parentNode.css('opacity')
        let setStyle = function(key, value) {
          arguments.length > 1 ? $parentNode.css(key, value) : $parentNode.css(key)
        }
        //如果设置了不透明,则简单设为可见的
        //否则先设为不透明,再设为可见
        if (opacity == 0) {
          setStyle('visibility', 'visible')
          const temp = function() {
            setStyle('visibility', visible)
          }
          resetStyle.push(temp)
        } else {
          setStyle({
            'opacity': 0,
            'visibility': 'visible'
          })
          const temp = function() {
            setStyle({
              'visibility': visible,
              'opacity': opacity

            })
          }
          resetStyle.push(temp)

        }
      }
    }

    return resetStyle;
  }

  /**
   * 执行函数
   * @return {[type]} [description]
   */
  _executive() {
    if (typeof(window[this.widgetName + "Widget"]) == "function") {
      var arg = this._getOptions()
      this.pageObj = new window[this.widgetName + "Widget"](arg[0], arg[1]);
    } else {
      console.error("Function [" + this.widgetName + "Widget] does not exist.");
    }
  }


  /**
   * 动画运行
   * @return {[type]} [description]
   */
  play() {
    return this.pageObj.play();
  }


  /**
   * 外部切换调用接口
   * @return {[type]} [description]
   */
  toggle() {
    this.pageObj && this.pageObj.toggle && this.pageObj.toggle();
  }

  /**
   * 动作停止接口
   * @return {[type]} [description]
   */
  stop() {
    this.pageObj && this.pageObj.stop && this.pageObj.stop();
  }

  /**
   * 销毁页面零件
   * @return {[type]} [description]
   */
  destroy() {
    this.hasload && removeFileLoad()
    this.pageObj && this.pageObj.destroy && this.pageObj.destroy();
  }

}
