import { titleCase } from '../../util/lang'

import Digital from './digital'
import Circular from './circular'
import Scrollbar from './scrollbar'

const matchBar = {
  Digital,
  Circular,
  Scrollbar
}

/**
 * 迷你杂志页面工具栏
 */
export default function MiniBar(pageBar = {}, options) {
  const type = titleCase(pageBar.type)
    //digital
    //circular
    //scrollbar
  if (matchBar[type]) {
    return new matchBar[type](pageBar, options)
  } else {
    /*默认发送数字显示类型*/
    return new Digital(pageBar, options)
  }
}
