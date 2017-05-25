import { titleCase } from '../../util/lang'

import Digital from './digital'
import Circular from './circular'
import Scrollbar from './scrollbar'

const matchBar = {
  Digital,
  Circular,
  Scrollbar
}

const create = function (type, pageBar, options) {
  type = titleCase(type)
  options.type = type
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

/**
 * 迷你杂志页面工具栏
 */
export default function MiniBar(pageBar = {}, options) {
  let arr = []
  /*多个*/
  if (_.isArray(pageBar.type)) {
    for (let i = 0; i < pageBar.type.length; i++) {
      arr.push(create(pageBar.type[i], pageBar, options))
    }
  } else {
    /**单个 */
    arr.push(create(pageBar.type, pageBar, options))
  }
  return arr
}
