import { parseJSON } from '../../../../util/lang'
import { IScroll } from '../../../../expand/iscroll'

/**
 * 眷顾区域扩展
 * @type {Boolean}
 */
export default class ScrollArea {

  constructor(data, options) {
    this.data = data
    this.options = options
    this.scrolls = []
    this._init()
  }

  _init() {
    const content = this.options;
    const prefix = this.data.contentPrefix;
    //创建多个眷滚区域
    for (let i = 0; i < content.length; i++) {
      let iscroll = this._create(content[i], prefix)
      if (iscroll) {
        this.scrolls.push(iscroll)
      }
    }
  }

  _createWrapper() {
    return String.styleFormat(
      `<div data-type="area-wrapper" style="position:absolute;width:100%; height:100%;overflow:hidden;">
          <ul data-type="area-scroller"
               data-behavior="disable"
               style="position:absolute; width:100%; height:100%;overflow:hidden;">
          </ul>
       </div>`
    )
  }

  _create(content, prefix) {

    let contentId = content.id
    let contentName = prefix + contentId

    let theTitle = parseJSON(content.theTitle)

    //data-widgetscrollareaList
    //data-widgetscrollareascrolltype
    let obj = theTitle["data-widgetscrollareaList"].split(",");
    if (obj.length == 0) {
      return
    }

    let contentPanle = $("#" + contentName)
    if (contentPanle.length == 0) {
      console.log(contentId + "not find obj");
      return;
    }

    var scrolltype = theTitle["data-widgetscrollareascrolltype"] ?
      theTitle["data-widgetscrollareascrolltype"] :
      "xy";

    //滚动的方向
    //x / y /xy
    scrolltype = scrolltype.toLowerCase()
    let scrollX = scrolltype.indexOf("x") > -1
    let scrollY = scrolltype.indexOf("y") > -1

    let $wrapper

    //如果来回翻页
    //因为子节点的排列关系已经被改变
    //所以这里直接处理事件
    const hasIscroll = contentPanle.attr("data-iscroll")
    if (hasIscroll) {
      //需要滚动条
      if (hasIscroll === 'visible') {
        $wrapper = contentPanle.children('div[data-type="area-wrapper"]')
        return this._bindIscroll($wrapper[0], scrollX, scrollY, contentId)
      }
      //hidden
      return
    }

    //去掉默认行为
    Xut.Contents.ResetDefaultControl("page", contentName, "")

    var contentSize = {
      x: parseInt(contentPanle.css("left")),
      y: parseInt(contentPanle.css("top")),
      w: parseInt(contentPanle.css("width")),
      h: parseInt(contentPanle.css("height"))
    }

    let size = this._getSize(obj, prefix)
    let min = size.min
    let max = size.max

    //创建容器
    $wrapper = $(this._createWrapper())

    //滚动容器
    let $scroller = $wrapper.children()
    contentPanle.append($wrapper)

    //设置滚动容器宽高
    this._setScrollerStyle(max, min, contentSize, scrollX, scrollY, $scroller)

    //重置各个content的left top值 并得到
    //x轴方向卷滚：snap容器的宽度 个数以及每个snap容器包含的content个数
    //y轴方向卷滚：snap容器的高度 个数以及每个snap容器包含的content个数
    const colsObj = this._resetContents(obj, prefix, contentSize, scrollX, scrollY, min);

    //创建snap容器
    let snapContainer = this._createSnapContainer(colsObj, $scroller, contentId, scrollX, scrollY)

    //将content添加到snap容器中
    if (scrollX) {
      for (var j = 0; j < obj.length; j++) {
        var childId = prefix + obj[j];
        var childObj = $("#" + childId);
        childObj.appendTo(snapContainer[Math.floor(j / colsObj.contentsPerSnapX)]);
      }
    }

    if (scrollY) {
      for (var j = 0; j < obj.length; j++) {
        var childId = prefix + obj[j];
        var childObj = $("#" + childId);
        childObj.appendTo(snapContainer[Math.floor(j / colsObj.contentsPerSnapY)])
      }
    }

    //如果不满足溢出条件
    let $areaScroller = snapContainer.parent()
    if (scrollX) {
      let snapContainerWidth = parseInt($areaScroller.css('width'))
      if (snapContainerWidth < contentSize.w) {
        scrollX = false
      }
    }
    if (scrollY) {
      let snapContainerHeight = parseInt($areaScroller.css('height'))
      if (snapContainerHeight < contentSize.h) {
        scrollY = false
      }
    }

    if (scrollY || scrollX) {
      contentPanle.attr("data-iscroll", "visible");
      //只存在一屏 需要卷滚时 不要要snap
      if (snapContainer.length == 1) {
        return this._bindIscroll($wrapper[0], scrollX, scrollY)
      }
      return this._bindIscroll($wrapper[0], scrollX, scrollY, contentId)
    } else {
      contentPanle.attr("data-iscroll", "hidden");
    }

  }

  _bindIscroll(wrapper, hasScrollX, hasScrollY, contentId) {
    if (contentId) {
      return IScroll(wrapper, {
        scrollX: hasScrollX ? true : false,
        scrollY: hasScrollY ? true : false,
        snap: ".contentsContainer" + contentId,
        scrollbars: 'custom',
        probeType: 2
      })
    } else {
      return IScroll(wrapper, {
        scrollX: hasScrollX ? true : false,
        scrollY: hasScrollY ? true : false,
        scrollbars: 'custom',
        probeType: 2
      })
    }

  }

  _getSize(objIds, prefix) {
    //最大区间
    var max = {
      l: null,
      t: null
    }

    //最小区间
    var min = {
      l: null,
      t: null
    }

    let obj
    for (var i = 0; i < objIds.length; i++) {
      obj = $("#" + prefix + objIds[i])
      if (obj.length == 0) {
        console.log(objIds[i] + " not find");
        continue;
      }
      var width = parseInt(obj.css("width"))
      var left = parseInt(obj.css("left"))
      var height = parseInt(obj.css("height"))
      var top = parseInt(obj.css("top"))

      //获取最小区间
      var xMin = left
      var yMin = top
      if (min.l == null || min.l > xMin) {
        min.l = xMin;
      }
      if (min.t == null || min.t > yMin) {
        min.t = yMin
      }

      //获取最大元素的值
      var xMax = width + left
      var yMax = height + top
      if (max.l == null || max.l < xMax) {
        max.l = xMax
      }
      if (max.t == null || max.t < yMax) {
        max.t = yMax
      }
    }

    return {
      min,
      max
    }
  }

  /**
   * 设置scroller标签的宽高
   * @param {[type]} max         [description]
   * @param {[type]} min         [description]
   * @param {[type]} contentSize [description]
   * @param {[type]} scrollX     [description]
   * @param {[type]} scrollY     [description]
   * @param {[type]} $scroller   [description]
   */
  _setScrollerStyle(max, min, contentSize, scrollX, scrollY, $scroller) {
    var width = 0
    var height = 0
    var start = { x: 0, y: 0 }
    var end = { x: 0, y: 0 }

    if (min.l < contentSize.x) {
      start.x = min.l;
    } else {
      start.x = contentSize.x;
    }

    if (min.t < contentSize.y) {
      start.y = min.t;
    } else {
      start.y = contentSize.y;
    }

    if (max.l > contentSize.x + contentSize.w) {
      end.x = max.l;
    } else {
      end.x = contentSize.x + contentSize.w;
    }

    if (max.t > contentSize.y + contentSize.h) {
      end.y = max.t;
    } else {
      end.y = contentSize.y + contentSize.h;
    }

    if (!scrollX && end.x - start.x > contentSize.w) {
      width = contentSize.w
    } else {
      width = end.x - start.x;
    }

    if (!scrollY && end.y - start.y > contentSize.h) {
      height = contentSize.h
    } else {
      height = end.y - start.y;
    }

    $scroller.css({
      width: width + "px",
      height: height + "px"
    });
  }

  /**
   * 重设各个子content的left top值 以包裹他们的父容器为基准
   * 并且得到snapContainer的个数 宽度 以及每个snapContainer中可以放的content个数
   */
  _resetContents(obj, prefix, contentSize, scrollX, scrollY, min) {
    let contentsPerSnapX,
      contentsPerSnapY,
      snapXCount,
      snapYCount,
      snapContainerWidth,
      snapContainerHeight;

    let contentsXTemp = 0;
    let contentsYTemp = 0;
    let leftArray = new Array();
    let topArray = new Array();

    const contentsLength = obj.length;

    for (var j = 0; j < contentsLength; j++) {
      var childId = prefix + obj[j];
      var childObj = $("#" + childId);

      Xut.Contents.ResetDefaultControl("page", childId, "")
      if (childObj.attr("data-iscroll") == "true") {
        continue;
      }

      var childLeft = parseInt(childObj.css("left"));
      var childTop = parseInt(childObj.css("top"));
      var childWidth = parseInt(childObj.css("width"))

      if (min.l < contentSize.x && scrollX) {
        childLeft = childLeft - min.l;
      } else {
        childLeft = childLeft - contentSize.x;
      }

      if (min.t < contentSize.y && scrollY) {
        childTop = childTop - min.t;
      } else {
        childTop = childTop - contentSize.y;
      }


      childObj.css("left", childLeft);
      childObj.css("top", childTop);

      leftArray.push(childLeft)
      topArray.push(childTop)

      childObj.css("visibility", "inherit")
      childObj.attr("data-iscroll", "true")
    }


    //将left值进行冒泡排序处理 以便后面比较left值与content宽之间的大小 确定一个snap容器中可以放几个content以及snap容器的宽度
    //将top值进行冒泡排序处理 以便后面比较top值与content高之间的大小 确定一个snap容器中可以放几个content以及snap容器的高度
    leftArray = this._bubbleSort(leftArray)
    topArray = this._bubbleSort(topArray)

    //x轴卷滚
    if (scrollX) {
      for (var i = 0; i < leftArray.length; i++) {
        var temp = leftArray[i];
        if (temp < contentSize.w) {
          contentsXTemp++;
        } else {
          if (!contentsPerSnapX) {
            contentsPerSnapX = contentsXTemp;
            snapContainerWidth = temp
          }
        }
      }

      //无需创建卷滚
      if (!contentsPerSnapX) {
        contentsPerSnapX = obj.length;
        snapXCount = 1;
        snapContainerWidth = contentSize.w;
      } else {
        snapXCount = Math.ceil(obj.length / contentsPerSnapX);
      }
    }

    //y轴卷滚
    if (scrollY) {
      for (var i = 0; i < topArray.length; i++) {
        var temp = topArray[i];
        //contentSize.h 有1px的差距，在不同设备下
        //导致布局出错，所以这里减去1
        if (temp < contentSize.h - 1) {
          contentsYTemp++;
        } else {
          if (!contentsPerSnapY) {
            contentsPerSnapY = contentsYTemp;
            snapContainerHeight = temp
          }
        }
      }

      //得到卷滚区域一行可以放多少列
      let colsPerRow = 1;
      for (var k = 0; k < contentsLength; k++) {
        var childId = prefix + obj[k];
        var childObj = $("#" + childId);
        var childTop = parseInt(childObj.css("top"));
        if (k > 0) {
          var prevChildId = prefix + obj[k - 1];
          var prevChildObj = $("#" + prevChildId);
          var prevChildTop = parseInt(prevChildObj.css("top"));
          if (childTop < prevChildTop + 10) {
            colsPerRow++;
          } else {
            break;
          }
        }
      }

      //无需创建卷滚
      if (!contentsPerSnapY) {
        contentsPerSnapY = Math.floor(obj.length / colsPerRow) + 1; ////在不需要卷滚的条件下 只会存在一个snap snap中的行数由content的总数/每行的个数 +1
        snapYCount = 1;
        snapContainerHeight = contentSize.h;
      } else {
        snapYCount = Math.ceil(obj.length / contentsPerSnapY);
      }
    }

    return {
      contentsPerSnapX,
      snapXCount,
      snapContainerWidth,
      contentsPerSnapY,
      snapYCount,
      snapContainerHeight
    }
  }

  /**
   * 冒泡排序
   * @param  {[type]} array [description]
   * @return {[type]}       [description]
   */
  _bubbleSort(array) {
    for (var i = 0; i < array.length - 1; i++) {
      for (var j = 0; j < array.length - 1 - i; j++) {
        if (array[j] > array[j + 1]) {
          var temp = array[j]
          array[j] = array[j + 1]
          array[j + 1] = temp;
        }
      }
    }
    return array;
  }

  /**
   * 创建snapContainer并添加到scroller中
   * @param  {[type]} colsObj   [description]
   * @param  {[type]} $scroller [description]
   * @param  {[type]} contentId [description]
   * @return {[type]}           [description]
   */
  _createSnapContainer(colsObj, $scroller, contentId, scrollX, scrollY) {
    let snapContainer = '';

    if (scrollX) {
      const scrollerWidth = parseInt($scroller.css("width"));
      const snapXCount = colsObj.snapXCount;
      const snapContainerWidth = colsObj.snapContainerWidth
      const lastSnapContainerWidth = scrollerWidth - (snapXCount - 1) * snapContainerWidth;
      let containerWidth
      for (var i = 0; i < colsObj.snapXCount; i++) {
        //最后一个snap容器的宽度需要单独设置 否则可能所有的snap容器宽度和会大于scroller的宽度
        if (i == colsObj.snapXCount - 1) {
          containerWidth = lastSnapContainerWidth
        } else {
          containerWidth = snapContainerWidth
        }
        snapContainer += `<li class="contentsContainer${contentId}"
                              style='width:${containerWidth}px;height:100%;float:left;'>
                          </li>`
      }
    }
    //Y轴滚动
    else if (scrollY) {
      const scrollerHeight = parseInt($scroller.css("height"))
      const snapYCount = colsObj.snapYCount;
      const snapContainerHeight = colsObj.snapContainerHeight
      const lastSnapContainerHeight = scrollerHeight - (snapYCount - 1) * snapContainerHeight;
      for (var i = 0; i < colsObj.snapYCount; i++) {
        snapContainer += `<li class="contentsContainer${contentId}"
                              style='height:${snapContainerHeight}px;width:100%;float:left;'>
                          </li>`
      }
    }

    snapContainer = $(snapContainer)
    snapContainer.appendTo($scroller)
    return snapContainer
  }

  destroy() {
    if (this.scrolls.length) {
      for (let i = 0; i < this.scrolls.length; i++) {
        let obj = this.scrolls[i]
        if (obj) {
          obj.scrollTo(0, 0)
          obj.destroy()
        }
        this.scrolls[i] = null
      }
      this.scrolls = null
    }
    this.data.container = null
    this.options = null
  }

}
