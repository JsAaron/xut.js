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
    let effect = ''
    let x = 0
    let y = 0
    let z = 0

    //视觉差对象初始化偏移量
    let parallaxOffset = pageOffset

    //平移
    if (property.translateX !== undefined
        || property.translateY !== undefined
        || property.translateZ !== undefined) {
        x = round(property.translateX) || 0
        y = round(property.translateY) || 0
        z = round(property.translateZ) || 0
        parallaxOffset += x
        let translateZ = setTranslateZ(z)
        effect += `translate(${parallaxOffset}px,${y}px) ${translateZ}`
    }

    //旋转
    if (property.rotateX !== undefined
        || property.rotateY !== undefined
        || property.rotateZ !== undefined) {
        x = round(property.rotateX);
        y = round(property.rotateY);
        z = round(property.rotateZ);
        effect += x ? 'rotateX(' + x + 'deg) ' : '';
        effect += y ? 'rotateY(' + y + 'deg) ' : '';
        effect += z ? 'rotateZ(' + z + 'deg) ' : '';
    }

    //缩放
    if (property.scaleX !== undefined
        || property.scaleY !== undefined
        || property.scaleZ !== undefined) {
        x = round(property.scaleX * 100) / 100 || 1;
        y = round(property.scaleY * 100) / 100 || 1;
        z = round(property.scaleZ * 100) / 100 || 1;
        effect += String.format('scale3d({0},{1},{2}) ', x, y, z);
    }

    //透明度
    if (property.opacity !== undefined) {
        if (action === 'init') {
            style.opacity = round((property.opacityStart + property.opacity) * 100) / 100;
        }
        if (action === 'master') {
            style.opacity = round(property.opacity * 100) / 100 + opacityStart;
        }
        effect += ';'
    }

    if (effect) {
        style[transitionDuration] = speed + 'ms';
        style[transform] = effect
        $contentNode && $contentNode.css(style)
    }

    return parallaxOffset
}



/**
 * transform转化成相对应的偏移量
 */
export function converValue(property, distance, nodes) {
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
 */
export function flipMove(property, repairProperty) {
    var temp = {};
    var start = property.opacityStart;
    for (var i in property) {
        temp[i] = property[i] + repairProperty[i];
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
export function overMemory(property, repairProperty) {
    for (var i in property) {
        repairProperty[i] = property[i];
    }
}
