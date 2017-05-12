import { config } from '../../config/index'
import { hasValue, hash } from '../../util/lang'

import { leftPageHook } from './single-hook/left'
import { middlePageHook } from './single-hook/middle'
import { rightPageHook } from './single-hook/right'


/**
 * 获取页面对象的样式配置对象
 * @param  {[type]} pageIndex [description]
 * @return {[type]}           [description]
 */
const getPageStyle = pageIndex => {
  let pageBase = Xut.Presentation.GetPageBase(pageIndex)
  return pageBase && pageBase.getStyle || {}
}

const makeAccess = (action, direction, distance, pageStyles) => {
  return(hooks) => {
    return hooks[action][direction](distance, pageStyles)
  }
}


/*
单页模式
计算每个页面的移动距离
 */
const getSingle = function({
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


/*
双页模式
仅计算包裹容器移动的距离
 */
const getDouble = function({
  action,
  distance, //移动的是固定页面基础值
  direction,
  leftIndex,
  middleIndex,
  rightIndex
}) {
  let left = 0
  let middle = 0
  let right = 0
  let view = middleIndex
  const screenWidth = config.screenSize.width
  if(direction === 'next') {

    /*滑动,反弹，需要叠加当期之前之前所有页面的距离综合，
    因为索引从0开始，所以middleIndex就是之前的总和页面数*/
    if(action === 'flipMove' || action === 'flipRebound') {
      middle = -(screenWidth * middleIndex) + distance
    }

    /*翻页，需要设置下一页的页面宽度长度*/
    if(action === 'flipOver') {
      middle = -(screenWidth * rightIndex)
    }

  }

  return [left, middle, right, view]
}


/**
 * 动态计算翻页距离
 * @return {[type]} [description]
 */
export function getVisualDistance(options) {
  return config.launch.doublePageMode ? getDouble(options) : getSingle(options)
}
