/************************
 * right页面钩子
 * distance -1 -2 -3 -N 递减
 *************************/
export const rightPageHook = {
  flipMove: {
    prev() {},
    /**
     * 右滑动
     * distance -1 -> -N 递减
     */
    next(getStyle, distance) {

      let middlePageStyle = getStyle('middle')
      let rightPageStyle = getStyle('right')

      //中间：溢出
      if (middlePageStyle && middlePageStyle.visualLeftInteger) {
        //右边：溢出
        if (rightPageStyle && rightPageStyle.visualLeftInteger) {
          return distance + rightPageStyle.visualWidth
        }
        //右边：正常
        else {
          return distance + middlePageStyle.visualWidth - middlePageStyle.visualLeftInteger
        }
      }
      //中间：正常
      else {
        //右边：溢出
        if (rightPageStyle && rightPageStyle.visualLeftInteger) {
          return distance + middlePageStyle.visualWidth + rightPageStyle.visualLeftInteger
        }
        //右边：正常
        else {
          return distance + rightPageStyle.visualWidth
        }
      }
    }
  },
  flipRebound: {
    prev() {},
    next(getStyle) {

      let rightPageStyle = getStyle('right')

      /*如果页面模式是5，特殊处理,返回半页宽度*/
      if (rightPageStyle && rightPageStyle.pageVisualMode === 5) {
        return rightPageStyle.visualWidth / 2
      }

      let middlePageStyle = getStyle('middle')

      //中间：溢出
      if (middlePageStyle && middlePageStyle.visualLeftInteger) {
        //右边：溢出
        if (rightPageStyle && rightPageStyle.visualLeftInteger) {
          return rightPageStyle.visualWidth
        }
        //右边：正常
        else {
          return middlePageStyle.visualWidth - middlePageStyle.visualLeftInteger
        }
      }
      //中间：正常
      else {
        //右边：溢出
        if (rightPageStyle && rightPageStyle.visualLeftInteger) {
          return middlePageStyle.visualWidth + rightPageStyle.visualLeftInteger
        }
        //右边：正常
        else {
          return middlePageStyle.visualWidth
        }
      }
    }
  },
  flipOver: {
    prev() {},
    next() {
      return 0
    }
  }
}
