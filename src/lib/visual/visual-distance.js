import { config } from '../config/index'
import { leftPageHook } from './style-config/distance-hook/left'
import { middlePageHook } from './style-config/distance-hook/middle'
import { rightPageHook } from './style-config/distance-hook/right'

import {
  hasValue,
  hash
} from '../util/lang'


/**
 * 获取页面对象的样式配置对象
 * @param  {[type]} pageIndex [description]
 * @return {[type]}           [description]
 */
const getPageStyle = pageIndex => {
  let pageBase = Xut.Presentation.GetPageObj(pageIndex)
  return pageBase && pageBase.getStyle || {}
}

const makeAccess = (action, direction, distance, pageStyles) => {
  return(hooks) => {
    return hooks[action][direction](distance, pageStyles)
  }
}

/**
 * 动态计算翻页距离
 * @return {[type]} [description]
 */
export function getVisualDistance({
  action,
  distance,
  direction,
  leftIndex,
  middleIndex,
  rightIndex
}) {

  let left = 0
  let middle = 0
  let right = 0

  //当前视图页面
  //用来处理页面回调
  let view = undefined

  //页面的配置样式
  let pageStyles = {
    left: getPageStyle(leftIndex),
    middle: getPageStyle(middleIndex),
    right: getPageStyle(rightIndex)
  }

  let hooks = makeAccess(action, direction, distance, pageStyles)

  if(action === 'flipMove' || action === 'flipRebound') {
    left = hooks(leftPageHook)
    middle = distance
    right = hooks(rightPageHook)
  }

  if(action === 'flipOver') {
    left = hooks(leftPageHook)
    middle = hooks(middlePageHook)
    right = hooks(rightPageHook)
    if(direction === 'prev') {
      view = left
    } else {
      view = right
    }
  }

  return [left, middle, right, view]
}