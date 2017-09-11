import { config } from '../../config/index'
import { hasValue, hash, hasIndexOf } from '../../util/lang'

import { leftPageHook } from './single-hook/left'
import { hMiddlePageHook } from './single-hook/middle-h'
import { rightPageHook } from './single-hook/right'

import { topPageHook } from './single-hook/top'
import { vMiddlePageHook } from './single-hook/middle-v'
import { bottomPageHook } from './single-hook/bottom'

/**
 * 获取页面对象的样式配置对象
 * @param  {[type]} pageIndex [description]
 * @return {[type]}           [description]
 */
const _getPageStyle = pageIndex => {
  if (pageIndex === undefined) {
    return {}
  }
  let pageBase = Xut.Presentation.GetPageBase(pageIndex)
  return pageBase && pageBase.getStyle || {}
}


const makeAccess = (action, direction, distance, getStyle) => {
  return (hooks) => {
    return hooks &&
      hooks[action] &&
      hooks[action][direction] &&
      hooks[action][direction](getStyle, distance)
  }
}


/**
 * 单页模式
 * 计算每个页面的移动距离
 * direction  = prev/next
 * orientation  = v/h
 */
const getSingle = function ({
  action,
  distance,
  direction,
  frontIndex,
  middleIndex,
  backIndex,
  orientation
}) {

  /*如果没有传递布方向，就取页面
  flow中没有定义，这个在全局接口中处理*/
  if (!orientation) {
    orientation = config.launch.scrollMode
  }

  let front = 0
  let middle = 0
  let back = 0

  //当前视图页面
  //用来处理页面回调
  let visualPage = undefined

  /*根据后去的定位，获取页面的样式*/
  const getStyle = position => {
    let style, pageIndex
    switch (position) {
      case 'left':
      case 'top':
        pageIndex = frontIndex
        break;
      case 'right':
      case 'bottom':
        pageIndex = backIndex
        break;
      case 'middle':
        pageIndex = middleIndex
        break;
    }
    return _getPageStyle(pageIndex)
  }

  /*获取页面样式*/
  const access = makeAccess(action, direction, distance, getStyle)

  /*滑动与反弹*/
  if (hasIndexOf(action, ['flipMove', 'flipRebound'])) {
    if (orientation === 'h') {
      front = access(leftPageHook)
      back = access(rightPageHook)
    } else {
      front = access(topPageHook)
      back = access(bottomPageHook)
    }
    middle = distance
  }

  /*翻页*/
  if (action === 'flipOver') {
    if (orientation === 'h') {
      front = access(leftPageHook)
      middle = access(hMiddlePageHook)
      back = access(rightPageHook)
    } else {
      front = access(topPageHook)
      middle = access(vMiddlePageHook)
      back = access(bottomPageHook)
    }
    visualPage = direction === 'prev' ? front : back
  }
  return [front, middle, back, visualPage]
}


/*
双页模式
仅计算包裹容器移动的距离
 */
const getDouble = function ({
  action,
  distance, //移动的是固定页面基础值
  direction,
  frontIndex,
  middleIndex,
  backIndex
}) {
  let left = 0
  let middle = 0
  let right = 0
  let view = middleIndex
  const screenWidth = config.screenSize.width
  if (direction === 'next') {
    /*滑动,反弹，需要叠加当期之前之前所有页面的距离综合，
    因为索引从0开始，所以middleIndex就是之前的总和页面数*/
    if (action === 'flipMove' || action === 'flipRebound') {
      middle = -(screenWidth * middleIndex) + distance
    }

    /*翻页，需要设置下一页的页面宽度长度*/
    if (action === 'flipOver') {
      middle = -(screenWidth * backIndex)
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
