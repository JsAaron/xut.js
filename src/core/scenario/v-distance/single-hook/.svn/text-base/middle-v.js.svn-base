/************************
 * 中间页面钩子
 *************************/
export const vMiddlePageHook = {
  flipOver: {
    /**
     * 中间页面向底部滑动
     */
    prev(getStyle) {
      const middle = getStyle('middle')
      return middle.visualHeight
    },
    /**
     * 中间页面向顶部滑动
     */
    next(getStyle) {
      const middle = getStyle('middle')
      return -middle.visualHeight
    }
  }
}
