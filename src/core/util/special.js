/**
 * 一些特殊的功能函数
 */


/**
 * 捕获完成
 * 用于多组回调循环
 * 只捕获到唯一的回调
 * count次数
 * callback={
 *   pre  回调处理
 *   post 后回调处理
 * }
 */
export function captureComplete(count, callback = {}) {
  let pre = callback.pre
  let post = callback.post
  if (typeof callback === 'function') {
    post = callback
  }
  return function(scope) {
    pre && pre(scope)
    //捕获动画状态
    if (count === 1) {
      post && post(scope)
    } else {
      --count;
    }
  }
}
