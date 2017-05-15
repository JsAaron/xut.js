/************************
 * right页面钩子
 * distance -1 -2 -3 -N 递减
 *************************/
export const rightPageHook = {
  flipMove: {
    left() {},
    /**
     * 右滑动
     * distance -1 -> -N 递减
     */
    right(distance, pageStyles) {

      let middlePageStyle = pageStyles.middle
      let rightPageStyle = pageStyles.right

      //中间：溢出
      if(middlePageStyle && middlePageStyle.visualLeftInteger) {
        //右边：溢出
        if(rightPageStyle && rightPageStyle.visualLeftInteger) {
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
        if(rightPageStyle && rightPageStyle.visualLeftInteger) {
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
    left() {},
    right(distance, pageStyles) {

      let middlePageStyle = pageStyles.middle
      let rightPageStyle = pageStyles.right

      //中间：溢出
      if(middlePageStyle && middlePageStyle.visualLeftInteger) {
        //右边：溢出
        if(rightPageStyle && rightPageStyle.visualLeftInteger) {
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
        if(rightPageStyle && rightPageStyle.visualLeftInteger) {
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
    left() {},
    right() {
      return 0
    }
  }
}
