import css3 from '../../../../expand/sprite/css3'
import keyframe from '../../../../expand/sprite/frame'

//判断是否支持css3属性
const animationPlayState = Xut.style.animationPlayState

/**
 * css3动画
 * 1 帧动画
 * 2 定时器动画
 * @param {[type]} options [description]
 */
export default function(options) {
  //timer,css
  var mode = options.mode || 'css';
  return mode === 'css' && animationPlayState ? css3(options) : keyframe(options)
}
