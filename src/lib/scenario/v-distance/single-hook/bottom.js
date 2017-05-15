/************************
 * 底部页面钩子
 *************************/
export const bottomPageHook = {
  flipMove: {
    top() {},
    /*从底部往上动画，正数的布局需要递减*/
    bottom(distance, pageStyles) {
      let bottomPageStyle = pageStyles.bottom
      return distance + bottomPageStyle.visualHeight
    }
  },
  flipRebound: {
    top() {},
    /*底部页面反弹，就设置页面高度*/
    bottom(distance, pageStyles) {
      return pageStyles.bottom.visualHeight
    }
  },
  flipOver: {
    top() {},
    /*底部页面，翻页结束后，目标变为当前可是页面*/
    bottom(distance, pageStyles) {
      return 0
    }
  }
}
