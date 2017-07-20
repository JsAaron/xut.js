////////////////////////
/// 全局钩子
////////////////////////

import { config } from '../config/index'

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
export default function swiperHook(e, node) {

  //禁止鼠标右键
  if (e.button && e.button == 2) {
    return
  }

  const dataType = node.getAttribute('data-type')

  //代码跟踪
  //如果是点击的超链接页面
  //这个是fast-pipe功能
  let hasTyperlink = false
  if (dataType === 'hyperlink') {
    hasTyperlink = true
    config.sendTrackCode('hot', {
      id: node.getAttribute('data-id'),
      pageId: node.getAttribute('data-page-id'),
      type: 'hyperlink',
      eventName: 'tap'
    })
  }

  const nodeName = node.nodeName.toLowerCase()

  //如果是移动端的情况下 && 支持二维码 && 是图片 && 是二维码标记
  if (config.launch.supportQR &&
    Xut.plat.hasTouch &&
    nodeName === "img" &&
    dataType === 'qrcode') {
    return 'qrcode'
  } else {
    if (Xut.plat.isBrowser &&
      !Xut.IBooks.Enabled &&
      !window.MMXCONFIG &&
      !window.DUKUCONFIG &&
      nodeName !== 'a' && //并且不是a标签(在cloumn中有a标签，需要跳转)
      nodeName !== 'video' && //pc视频控制条不灵敏问题
      !hasTyperlink) { //超链接不阻止
      e.preventDefault && e.preventDefault();
    }
  }
}
