import { config } from '../../config/index'
import { leftTranslate } from './translate-hook/left'
import { rightTranslate } from './translate-hook/right'

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
export function styleTranslate({
  createIndex,
  currIndex,
  direction,
  useStyleData
}) {

  let translate
  let offset
  let offsetLeft
  let offsetMiddle
  let offsetRight

  if(direction === 'before') {
    offsetLeft = leftTranslate(useStyleData)
    translate = createTranslate(offsetLeft)
    offset = offsetLeft
  } else if(direction === 'middle') {
    offsetMiddle = 0
    translate = createTranslate(offsetMiddle)
    offset = offsetMiddle
  } else if(direction === 'after') {
    offsetRight = rightTranslate(useStyleData)
    translate = createTranslate(offsetRight)
    offset = offsetRight
  }

  return {
    translate,
    offset
  }
}