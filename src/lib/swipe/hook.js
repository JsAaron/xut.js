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
export default function eventHooks(e, node) {

  //禁止鼠标右键
  if (e.button && e.button == 2) {
    return
  }

  //如果是移动端的情况下 && 支持二维码 && 是图片 && 是二维码标记
  if (config.supportQR
    && Xut.plat.hasTouch
    && node.nodeName.toLowerCase() === "img"
    && node.getAttribute('data-type') === 'qrcode') {
    return 'qrcode'
  } else {
    if (Xut.plat.isBrowser
      && !Xut.IBooks.Enabled
      && !window.MMXCONFIG
      && !window.DUKUCONFIG
      && node.getAttribute('data-type') !=='hyperlink') { //超链接不阻止
      e.preventDefault && e.preventDefault();
    }
  }
}
