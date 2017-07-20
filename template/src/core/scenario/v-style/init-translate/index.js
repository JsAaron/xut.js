import { config } from '../../../config/index'
import { getOffset } from './layout-hook/index'

/**
 * 创建translate初始值
 * @param  {[type]} offset [description]
 * @return {[type]}        [description]
 */
const setTranslate = (x = 0, y = 0) => {
  return Xut.style.setTranslateStyle(x, y)
}

/**
 * 默认样式
 */
export function initTranslate({
  position,
  styleDataset
}) {

  let translate
  let offset

  switch (position) {
    case 'left':
    case 'right':
      /*设置X轴*/
      offset = getOffset(position, styleDataset)
      translate = setTranslate(offset)
      break;
    case 'top':
    case 'bottom':
      /*设置Y轴*/
      offset = getOffset(position, styleDataset)
      translate = setTranslate(0, offset)
      break;
    case 'middle':
      translate = setTranslate()
      offset = 0
      break;
  }

  return {
    //translate样式
    translate,
    //偏移量
    offset
  }
}
