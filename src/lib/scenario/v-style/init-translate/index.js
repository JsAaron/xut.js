import { config } from '../../../config/index'
import { leftTranslate } from './hook/left'
import { rightTranslate } from './hook/right'

const translateZ = Xut.style.translateZ

/**
 * 创建translate初始值
 * @param  {[type]} offset [description]
 * @return {[type]}        [description]
 */
const createTranslate = (offset) => {
  return `translate(${offset}px,0) ${translateZ}`
}

/**
 * 默认样式
 * @param  {Object} options.hooks [description]
 * @param  {[type]} createIndex   [description]
 * @param  {Object} currIndex                     } [description]
 * @return {[type]}               [description]
 */
export function initTranslate({
  direction,
  styleDataset
}) {

  let translate
  let offset

  if(direction === 'left') {
    const offsetLeft = leftTranslate(styleDataset)
    translate = createTranslate(offsetLeft)
    offset = offsetLeft
  } else if(direction === 'middle') {
    const offsetMiddle = 0
    translate = createTranslate(offsetMiddle)
    offset = offsetMiddle
  } else if(direction === 'right') {
    const offsetRight = rightTranslate(styleDataset)
    translate = createTranslate(offsetRight)
    offset = offsetRight
  }

  return {
    //translate样式
    translate,
    //偏移量
    offset
  }
}
