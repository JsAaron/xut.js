/************************
 * 底部页面钩子
 *************************/
export const bottomPageHook = {
  flipMove: {
    /*从底部往中间移动*/
    next(getStyle, distance) {
      const bottomPageStyle = getStyle('bottom')
      return distance + bottomPageStyle.visualHeight
    }
  },
  flipRebound: {
    /*底部往中间反弹*/
    next(getStyle) {
      const topPageStyle = getStyle('bottom')
      return topPageStyle.visualHeight
    }
  },
  flipOver: {
    /*底部页面，翻页结束后，目标变为当前可是页面*/
    next() {
      return 0
    }
  }
}
