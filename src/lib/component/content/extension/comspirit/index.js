import css3 from './css3'
import keyframe from './keyframe'

/**
 * css3动画
 * 1 帧动画
 * 2 定时器动画
 * @param {[type]} options [description]
 */
export function ComSpirit(options) {
    //timer,css
    var mode = options.mode || 'css';
    return mode === 'css' ? css3(options) : keyframe(options)
}
