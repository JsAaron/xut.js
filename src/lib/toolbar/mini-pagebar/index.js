import Digital from './digital'
import Circular from './circular'

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
      console.log(3)
      break;
    default:
      console.log(4)
      break;
  }
}
