/************************
 * 顶部页面钩子
 *************************/
export const topPageHook = {
  flipMove: {
    /*顶部页面往中间移动*/
    prev(getStyle, distance) {
      const topPageStyle = getStyle('top')
      return distance - topPageStyle.visualHeight
    }
  },
  flipRebound: {
    /*顶部往中间反弹*/
    prev(getStyle) {
      const topPageStyle = getStyle('top')
      return -topPageStyle.visualHeight
    }
  },
  flipOver: {
    /*顶部往中间翻页*/
    prev() {
      return 0
    }
  }
}
