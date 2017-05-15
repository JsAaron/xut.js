/************************
 * 中间页面钩子
 *************************/
export const middlePageHook = {
  flipMove: {
    left() {},
    right() {}
  },
  flipOver: {
    /**
     * 左翻页结束
     */
    left(distance, pageStyles) {
      let middlePageStyle = pageStyles.middle
      let leftPageStyle = pageStyles.left

      //中间：溢出
      if(middlePageStyle && middlePageStyle.visualLeftInteger) {
        //左边：溢出
        if(leftPageStyle && leftPageStyle.visualLeftInteger) {
          return middlePageStyle.visualWidth
        }
        //左边：正常
        else {
          return middlePageStyle.visualWidth - middlePageStyle.visualLeftInteger
        }
      }
      //中间：正常
      else {
        //左边：溢出
        if(leftPageStyle && leftPageStyle.visualLeftInteger) {
          return middlePageStyle.visualWidth + leftPageStyle.visualLeftInteger
        }
        //左边：正常
        else {
          return middlePageStyle.visualWidth
        }
      }
    },
    /**
     * 右翻页结束
     */
    right(distance, pageStyles) {
      let middlePageStyle = pageStyles.middle
      let rightPageStyle = pageStyles.right

      //中间：溢出
      if(middlePageStyle && middlePageStyle.visualLeftInteger) {
        //右边：溢出
        if(rightPageStyle && rightPageStyle.visualLeftInteger) {
          return -middlePageStyle.visualWidth
        }
        //右边：正常
        else {
          return -(middlePageStyle.visualWidth - middlePageStyle.visualLeftInteger)
        }
      }
      //中间：正常
      else {
        //右边：溢出
        if(rightPageStyle && rightPageStyle.visualLeftInteger) {
          return -(middlePageStyle.visualWidth + rightPageStyle.visualLeftInteger)
        }
        //右边：正常
        else {
          return -rightPageStyle.visualWidth
        }
      }
    }
  }
}
