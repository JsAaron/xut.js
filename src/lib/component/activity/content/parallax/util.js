import { config } from '../../../../config/index'

const transitionDuration = Xut.style.transitionDuration
const transform = Xut.style.transform
const translateZ = Xut.style.translateZ
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
    speed = 0,
    pageOffset = 0,
    opacityStart = 0 //透明度开始值
}) {
    let style = {}
    let transformEffect = ''
    let x = 0
    let y = 0
    let z = 0
    let translateZ

    //视觉差对象初始化偏移量
    let parallaxOffset = pageOffset

    //平移
    let hasTranslateX = property.translateX !== undefined
    let hasTranslateY = property.translateY !== undefined
    let hasTranslateZ = property.translateZ !== undefined
    if (hasTranslateX) {
        x = round(property.translateX) || 0
        parallaxOffset += x
        transformEffect += `translateX(${parallaxOffset}px)`
    }
    if (hasTranslateY) {
        y = round(property.translateY) || 0
        transformEffect += `translateY(${y}px)`
    }
    if (hasTranslateX || hasTranslateY || hasTranslateZ) {
        z = round(property.translateZ) || 0
        transformEffect += setTranslateZ(z)
    }


    //旋转
    if (property.rotateX !== undefined) {
        transformEffect += `rotateX(${round(property.rotateX)}deg)`
    }
    if (property.rotateY !== undefined) {
        transformEffect += `rotateY(${round(property.rotateY)}deg)`
    }
    if (property.rotateZ !== undefined) {
        transformEffect += `rotateZ(${round(property.rotateZ)}deg)`
    }


    //缩放
    if (property.scaleX !== undefined) {
        x = round(property.scaleX * 100) / 100
        transformEffect += `scaleX(${x})`
    }
    if (property.scaleY !== undefined) {
        y = round(property.scaleY * 100) / 100
        transformEffect += `scaleY(${y})`
    }
    if (property.scaleZ !== undefined) {
        z = round(property.scaleZ * 100) / 100
        transformEffect += `scaleZ(${z})`
    }

    //透明度
    let hasOpacity = false
    if (property.opacity !== undefined) {
        if (action === 'init') {
            style.opacity = round((property.opacityStart + property.opacity) * 100) / 100;
            hasOpacity = true
        }
        if (action === 'master') {
            style.opacity = round(property.opacity * 100) / 100 + opacityStart;
            hasOpacity = true
        }
    }

    //style可以单独设置opacity属性
    if (transformEffect || hasOpacity) {
        if (transformEffect) {
            style[transitionDuration] = speed + 'ms';
            style[transform] = transformEffect
        }
        $contentNode && $contentNode.css(style)
    }

    return parallaxOffset
}



/**
 * 初始化元素属性
 * @param  {[type]} parameters     [description]
 * @param  {[type]} nodeProportion [description]
 * @return {[type]}                [description]
 */
export function getInitProperty(property, nodeOffsetProportion) {
    var results = {},
        width = -config.viewSize.width,
        height = -config.viewSize.height;

    for (let key in property) {
        switch (key) {
            case 'scaleX':
            case 'scaleY':
            case 'scaleZ':
                //缩放的初始值都为1
                //或者等比变化值
                results[key] = property[key] * nodeOffsetProportion || 1
                break;
            case 'translateX':
            case 'translateZ':
                results[key] = property[key] * nodeOffsetProportion * width;
                break;
            case 'translateY':
                results[key] = property[key] * nodeOffsetProportion * height;
                break;
            case 'opacityStart':
                results[key] = property[key];
                break;
            default:
                results[key] = property[key] * nodeOffsetProportion;
        }
    }

    return results;
}


/**
 * 获取属性单步变化的比值
 */
export function getStepProperty({
    nodes,
    isFlows,
    distance,
    lastProperty,
    originalProperty
}) {
    let temp = {}
    //这里有页面模式的配置处理
    //获取的页面翻页的区域值不一样
    let size = isFlows ? config.screenSize : config.viewSize
    let width = size.width
    let height = size.height
    for (let key in originalProperty) {
        switch (key) {
            case 'translateX':
            case 'translateZ':
                temp[key] = distance * nodes * originalProperty[key];
                break;
            case 'translateY':
                temp[key] = distance * (height / width) * nodes * originalProperty[key]
                break;
            case 'opacityStart':
                temp[key] = originalProperty.opacityStart;
                break;
            default:
                //乘以-1是为了向右翻页时取值为正,位移不需这样做
                temp[key] = -1 * distance / width * originalProperty[key] * nodes
        }
    }
    return temp;
}


/**
 * 移动叠加值
 */
export function flipMove(property, repairProperty) {
    let temp = {};
    let start = property.opacityStart;
    for (let i in property) { //叠加值
        temp[i] = property[i] + repairProperty[i]
    }
    if (start > -1) {
        temp.opacityStart = start;
    }
    return temp;
}


/**
 * 翻页结束
 */
export function flipOver(property, repairProperty) {
    return flipMove(property, repairProperty);
}


/**
 * 反弹
 */
export function flipRebound(property, repairProperty) {
    var temp = {};
    for (var i in property) {
        temp[i] = repairProperty[i] || property[i];
    }
    return temp;
}


/**
 * 结束后缓存上一个记录
 */
export function cacheProperty(property, repairProperty) {
    for (var i in property) {
        repairProperty[i] = property[i];
    }
}
