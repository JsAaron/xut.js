/*
swpie的算法，需要共享到iscroll等这样的代理翻页模块上
 */

/*
支持翻页
_slideTo的最低值要求
  1 fast: time < 200 && x >30
  2 common: x > veiwWidth/6
 */
export function supportFlipOver() {
  let isValidSlide = duration < 200 && deltaX > 30 || deltaX > this._visualWidth / 6
}
