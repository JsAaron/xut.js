import { config } from '../../config/index'

const transitionDuration = Xut.style.transitionDuration
const transform = Xut.style.transform
const setTranslateZ = Xut.style.setTranslateZ

const hasValue = function(value) {
    return value != undefined
}

/**
 * transform转化成相对应的偏移量
 */
export function _transformConversion(property, distance, nodes) {
    var temp = {},
        i;

    for (i in property) {
        switch (i) {
            case 'translateX':
            case 'translateZ':
                temp[i] = distance * nodes * property[i];
                break;
            case 'translateY':
                temp[i] = distance * (config.viewSize.height / config.viewSize.width) * nodes * property[i]
                break;
            case 'opacityStart':
                temp[i] = property.opacityStart;
                break;
            default:
                //乘以-1是为了向右翻页时取值为正,位移不需这样做
                temp[i] = -1 * distance / config.viewSize.width * property[i] * nodes;
        }
    }
    return temp;
}



/**
 * 移动叠加值
 * @param  {[type]} property       [description]
 * @param  {[type]} repairProperty [description]
 * @return {[type]}                [description]
 */
export function _flipMove(property, repairProperty) {
    var temp = {};
    var start = property.opacityStart;
    for (var i in property) {
        temp[i] = property[i] + repairProperty[i];
    }
    if (start > -1) temp.opacityStart = start;
    return temp;
}


/**
 * 翻页结束
 * @param  {[type]} property       [description]
 * @param  {[type]} repairProperty [description]
 * @return {[type]}                [description]
 */
export function _flipOver(property, repairProperty) {
    return _flipMove(property, repairProperty);
}


/**
 * 反弹
 * @param  {[type]} property       [description]
 * @param  {[type]} repairProperty [description]
 * @return {[type]}                [description]
 */
export function _flipRebound(property, repairProperty) {
    var temp = {};
    for (var i in property) {
        temp[i] = repairProperty[i] || property[i];
    }
    return temp;
}


/**
 * 结束后缓存上一个记录
 * @param  {[type]} property       [description]
 * @param  {[type]} repairProperty [description]
 * @return {[type]}                [description]
 */
export function _overMemory(property, repairProperty) {
    for (var i in property) {
        repairProperty[i] = property[i];
    }
}


/**
 * 变化节点的css3transform属性
 * @param  {[type]} $containsNode     [description]
 * @param  {[type]} speed        [description]
 * @param  {[type]} property     [description]
 * @param  {[type]} opacityStart [description]
 * @return {[type]}              [description]
 */
export function _transformNodes($contentNode, speed, property, opacityStart) {
    var style = {},
        effect = '',
        x = 0,
        y = 0,
        z = 0,
        round = Math.round;

    if (hasValue(property.translateX) || hasValue(property.translateY) || hasValue(property.translateZ)) {
        x = round(property.translateX) || 0;
        y = round(property.translateY) || 0;
        z = round(property.translateZ) || 0;
        const translateZ = setTranslateZ(z)
        effect += `translate(${x}px,${y}px) ${translateZ}`
    }

    if (hasValue(property.rotateX) || hasValue(property.rotateY) || hasValue(property.rotateZ)) {
        x = round(property.rotateX)
        y = round(property.rotateY)
        z = round(property.rotateZ)
        effect += x ? 'rotateX(' + x + 'deg) ' : ''
        effect += y ? 'rotateY(' + y + 'deg) ' : ''
        effect += z ? 'rotateZ(' + z + 'deg) ' : ''
    }

    if (hasValue(property.scaleX) || hasValue(property.scaleY) || hasValue(property.scaleZ)) {
        x = round(property.scaleX * 100) / 100 || 1;
        y = round(property.scaleY * 100) / 100 || 1;
        z = round(property.scaleZ * 100) / 100 || 1;
        effect += String.format('scale3d({0},{1},{2}) ', x, y, z);
    }

    if (property.opacity != undefined) {
        style.opacity = round(property.opacity * 100) / 100 + opacityStart;
        effect += ';'
    }

    ////////////////
    //最终改变视觉对象的坐标 //
    ////////////////
    if (effect) {
        style[transitionDuration] = speed + 'ms';
        style[transform] = effect;
        $contentNode.css(style);
    }
}
