import Digital from './digital'
import Circular from './circular'
import Scrollbar from './scrollbar'


/**
 * 迷你杂志页面工具栏
 */
export default function MiniBar(pageBar = {}, options) {
  switch (pageBar.type) {
    case "digital":
      return new Digital(pageBar, options)
    case "circular":
      return new Circular(pageBar, options)
    case "scrollbar":
      return new Scrollbar(pageBar, options)
    default:
      /*默认发送数字显示类型*/
      return new Digital(pageBar, options)
  }
}
