import { config } from '../../../../config/index'

const transitionDuration = Xut.style.transitionDuration
const transform = Xut.style.transform
const setTranslateZ = Xut.style.setTranslateZ
const round = Math.round

/**
 * 获取视觉差parallax配置
 * @return {[type]} [description]
 */
export function setStyle({
  $contentNode,
  action, //初始化设置
  property,
  pageIndex,
  targetProperty = {}, //必须给初始值，master页面没有传递
  interaction,
  speed = 0,
  pageOffset = 0,
  opacityStart = 0 //透明度开始值
}) {
  let style = {}
  let transformProperty = {}
  let x = 0
  let y = 0
  let z = 0
  let translateZ

  if(action === 'init') {
    //如果有special属性
    //提取出第一个对象的设置，混入到special
    let special = property.special
    if(special && special[1]) {
      _.extend(property, special[1])
    }
  }

  let specialProperty //特殊属性值
  let lastProperty
  if(action === 'master') {
    let special = targetProperty.special
    if(special) {
      specialProperty = special[pageIndex]
      if(!specialProperty) {
        //上一个属性
        lastProperty = special.lastProperty
      }
    }
  }

  //视觉差对象初始化偏移量
  let parallaxOffset = pageOffset

  //===========
  //  平移
  //===========
  let hasTranslateX = property.translateX !== undefined
  let hasTranslateY = property.translateY !== undefined
  let hasTranslateZ = property.translateZ !== undefined
  if(hasTranslateX) {
    x = round(property.translateX) || 0
    parallaxOffset += x
    transformProperty.translateX = `translateX(${parallaxOffset}px)`
  }
  if(hasTranslateY) {
    y = round(property.translateY) || 0
    transformProperty.translateY = `translateY(${y}px)`
  }
  if(hasTranslateX || hasTranslateY || hasTranslateZ) {
    z = round(property.translateZ) || 0
    transformProperty.translateZ = setTranslateZ(0)
  }

  //===========
  //  旋转
  //===========
  if(property.rotateX !== undefined) {
    transformProperty.rotateX = `rotateX(${round(property.rotateX)}deg)`
  }
  if(property.rotateY !== undefined) {
    transformProperty.rotateY = `rotateY(${round(property.rotateY)}deg)`
  }
  if(property.rotateZ !== undefined) {
    transformProperty.rotateZ = `rotateZ(${round(property.rotateZ)}deg)`
  }

  //===========
  //  缩放
  //===========
  let hasScaleX = property.scaleX !== undefined
  let hasScaleY = property.scaleY !== undefined
  let hasScaleZ = property.scaleZ !== undefined
  if(hasScaleX) {
    x = round(property.scaleX * 100) / 100
    transformProperty.scaleX = `scaleX(${x})`
  }
  if(hasScaleY) {
    y = round(property.scaleY * 100) / 100
    transformProperty.scaleY = `scaleY(${y})`
  }
  if(hasScaleZ) {
    z = round(property.scaleZ * 100) / 100
    transformProperty.scaleZ = `scaleZ(${z})`
  }
  //如果设了XY的缩放，默认增加Z处理
  if(!hasScaleZ && (hasScaleX || hasScaleY)) {
    transformProperty.scaleZ = `scaleZ(1)` //默认打开3D，如不指定iphone闪屏
  }

  //===========
  //  透明度
  //===========
  let hasOpacity = false
  if(property.opacity !== undefined) {
    if(action === 'init') {
      style.opacity = round((property.opacityStart + property.opacity) * 100) / 100;
      hasOpacity = true
    }
    if(action === 'master') {
      style.opacity = round(property.opacity * 100) / 100 + opacityStart;
      hasOpacity = true
    }
  }

  //=================================
  // style可以单独设置opacity属性
  //=================================
  if(transformProperty || hasOpacity) {
    if(transformProperty) {

      if(lastProperty) {
        _.extend(transformProperty, lastProperty)
      }

      style[transitionDuration] = speed + 'ms';
      let tempProperty = ''
      for(let key in transformProperty) {
        tempProperty += transformProperty[key]
      }
      if(tempProperty) {
        style[transform] = tempProperty
      }
    }
    //拿到属性的最终值
    if($contentNode) {
      $contentNode.css(style)
      //翻页做上一个完成记录
      if(interaction === 'flipOver' && specialProperty) {
        for(let key in specialProperty) {
          let speciaValue = specialProperty[key]
          let result = transformProperty[key]
          if(result) {
            //保存特殊的值
            targetProperty.special.lastProperty[key] = result
          }
        }
      }
    }
  }

  return parallaxOffset
}



/**
 * 初始化元素属性
 */
export function getInitProperty(property, nodeOffset, specialProperty, getStyle) {
  let results = {}
  let width = -getStyle.visualWidth
  let height = -getStyle.visualHeight

  for(let key in property) {
    //special使用
    //给属性打上标记，用于翻页的时候过滤
    //因为采用动态滑动视觉差
    //可能在某些页面设置属性，某些页面跳过
    if(specialProperty) {
      specialProperty.special[key] = true
    }

    switch(key) {
      case 'special': //特殊属性
        results[key] = {}
        for(let i in property[key]) {
          //因为是独立设置，所以nodeOffset的比值不需要了
          //nodeOffset = 1
          let props = getInitProperty(property[key][i], 1, property)
          results[key][i] = props
        }
        break;
      case 'scaleX':
      case 'scaleY':
      case 'scaleZ':
        //缩放是从1开始
        //变化值是property[key] - 1
        //然后用nodeOffset处理，算出比值
        results[key] = 1 + (property[key] - 1) * nodeOffset
        break;
      case 'translateX':
      case 'translateZ':
        results[key] = property[key] * nodeOffset * width;
        break;
      case 'translateY':
        results[key] = property[key] * nodeOffset * height;
        break;
      case 'opacityStart':
        results[key] = property[key];
        break;
      default:
        results[key] = property[key] * nodeOffset;
    }
  }
  return results;
}


/**
 * 获取属性单步变化的比值
 */
export function getStepProperty({
  nodes,
  isColumn,
  distance,
  pageIndex,
  lastProperty,
  targetProperty
}) {
  let temp = {}
  let property = targetProperty //浅复制
  let lastSpecialProperty //上一个特殊的对象属性

  //动态属性页面
  let specialProperty
  let nextSpecialProperty
  if(targetProperty.special) {
    specialProperty = targetProperty.special[pageIndex]
    nextSpecialProperty = targetProperty.special[pageIndex + 1]
    if(specialProperty) {
      //深复制，这样修改的目的是混入了specialProperty后，不会改变targetProperty原对象
      property = _.extend({}, targetProperty, specialProperty)
    }
  }

  //这里有页面模式的配置处理
  //获取的页面翻页的区域值不一样
  let size = isColumn ? config.screenSize : config.visualSize
  let width = size.width
  let height = size.height

  for(let key in property) {
    switch(key) {
      case 'scaleX':
      case 'scaleY':
      case 'scaleZ':
        //特殊属性的计算
        //没有中间值，直接就 = 百分比*变化区间
        if(specialProperty[key]) {
          var percentage = -distance / width
          if(nextSpecialProperty[key]) {
            var changeProperty = nextSpecialProperty[key] - specialProperty[key]
            if(changeProperty) {
              temp[key] = percentage * changeProperty
            }
          }
        } else {
          temp[key] = -1 * distance / width * (property[key] - 1) * nodes
        }
        break;
      case 'translateX':
      case 'translateZ':
        temp[key] = distance * nodes * property[key]
        break;
      case 'translateY':
        temp[key] = distance * (height / width) * nodes * property[key]
        break;
      case 'opacityStart':
        temp[key] = property.opacityStart;
        break;
      default:
        //乘以-1是为了向右翻页时取值为正,位移不需这样做
        temp[key] = -1 * distance / width * property[key] * nodes
    }
  }
  return temp
}


/**
 * 移动叠加值
 */
export function flipMove(stepProperty, lastProperty) {
  let temp = {};
  let start = stepProperty.opacityStart;
  for(let i in stepProperty) { //叠加值
    temp[i] = stepProperty[i] + lastProperty[i]
  }
  if(start > -1) {
    temp.opacityStart = start;
  }
  return temp;
}


/**
 * 翻页结束
 */
export function flipOver(...arg) {
  return flipMove(...arg)
}


/**
 * 反弹
 */
export function flipRebound(stepProperty, lastProperty) {
  var temp = {};
  for(var i in stepProperty) {
    temp[i] = lastProperty[i] || stepProperty[i];
  }
  return temp;
}


/**
 * 结束后缓存上一个记录
 */
export function cacheProperty(stepProperty, lastProperty) {
  for(var i in stepProperty) {
    lastProperty[i] = stepProperty[i];
  }
}
