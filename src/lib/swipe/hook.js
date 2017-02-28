////////////////////////
/// 全局钩子
////////////////////////

import {
  config
} from '../config/index'

/**
 * 阻止元素的默认行为
 * 在火狐下面image带有href的行为
 * 会自动触发另存为
 * @return {[type]} [description]
 *
 * 2016.3.18
 * 妙妙学 滚动插件默认行为被阻止
 *
 * 2016.7.26
 * 读库强制PC模式了
 */
export default function eventHooks(e) {

  //禁止鼠标右键
  if (e.button && e.button == 2) {
    return
  }

  ////如果是移动端的情况下 && 支持二维码 && 是图片 就不组织默认行为
  if (Xut.plat.hasTouch && config.supportQR && e.target.nodeName.toLowerCase() === "img") {} else {
    if (Xut.plat.isBrowser && !Xut.IBooks.Enabled && !window.MMXCONFIG && !window.DUKUCONFIG) {
      e.preventDefault && e.preventDefault();
    }
  }
}
