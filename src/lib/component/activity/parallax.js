/**
 * 视觉差对象初始化操作
 */

import { config } from '../../config/index'

const transform = Xut.style.transform
const setTranslateZ = Xut.style.setTranslateZ

const hasValue = function(value) {
    return value != undefined
}

/**
 * 变化节点的css3transform属性
 * @param  {[type]} $contentNode   [description]
 * @param  {[type]} property   [description]
 * @param  {[type]} pageOffset [description]
 * @return {[type]}            [description]
 */
const transformNodes = function($contentNode, property, pageOffset) {
    var style = {},
        effect = '',
        parallaxOffset, //最终的偏移量X
        x = 0,
        y = 0,
        z = 0,
        round = Math.round;

    //浮动对象初始化偏移量
    parallaxOffset = pageOffset;

    if (hasValue(property.translateX) || hasValue(property.translateY) || hasValue(property.translateZ)) {
        x = round(property.translateX) || 0
        y = round(property.translateY) || 0
        z = round(property.translateZ) || 0
        parallaxOffset += x
        const translateZ = setTranslateZ(z)
        effect += `translate(${parallaxOffset}px,${y}px) ${translateZ}`
    }

    if (hasValue(property.rotateX) || hasValue(property.rotateY) || hasValue(property.rotateZ)) {
        x = round(property.rotateX);
        y = round(property.rotateY);
        z = round(property.rotateZ);
        effect += x ? 'rotateX(' + x + 'deg) ' : '';
        effect += y ? 'rotateY(' + y + 'deg) ' : '';
        effect += z ? 'rotateZ(' + z + 'deg) ' : '';
    }

    if (hasValue(property.scaleX) || hasValue(property.scaleY) || hasValue(property.scaleZ)) {
        x = round(property.scaleX * 100) / 100 || 1;
        y = round(property.scaleY * 100) / 100 || 1;
        z = round(property.scaleZ * 100) / 100 || 1;
        effect += String.format('scale3d({0},{1},{2}) ', x, y, z);
    }

    if (hasValue(property.opacity)) {
        style.opacity = round((property.opacityStart + property.opacity) * 100) / 100;
        effect += ';'
    }

    if (effect) {
        style[transform] = effect;
        $contentNode.css(style);
    }

    return parallaxOffset;
}


/**
 * 转换成比例值
 * @param  {[type]} parameters [description]
 * @return {[type]}            [description]
 */
const conversionRatio = function(parameters) {
    if (parameters.opacityStart > -1) {
        parameters.opacity = (parameters.opacityEnd || 1) - parameters.opacityStart;
        delete parameters.opacityEnd;
    }
    return parameters;
}


/**
 * 转化成实际值
 * @param  {[type]} parameters     [description]
 * @param  {[type]} nodeProportion [description]
 * @return {[type]}                [description]
 */
const conversionValue = function(parameters, nodeProportion) {
    var results = {},
        width = -config.viewSize.width,
        height = -config.viewSize.height;

    for (var i in parameters) {
        switch (i) {
            case 'translateX':
            case 'translateZ':
                results[i] = parameters[i] * nodeProportion * width;
                break;
            case 'translateY':
                results[i] = parameters[i] * nodeProportion * height;
                break;
            case 'opacityStart':
                results[i] = parameters[i];
                break;
            default:
                results[i] = parameters[i] * nodeProportion;
        }
    }

    return results;
}


export function Parallax(data) {
    let parameters
    try {
        //转化所有css特效的参数的比例
        parameters = JSON.parse(data.getParameter()[0]['parameter']);
    } catch (err) {
        return false
    }

    var pid = data.pid,
        translate = conversionRatio(parameters),
        //页面偏移量
        pageOffset = this.relatedData.pageOffset && this.relatedData.pageOffset.split("-"),
        //开始的nodes值
        currPageOffset = pageOffset[0],
        //范围区域
        pageRange = pageOffset[1],
        //页面偏移比例
        nodeOffsetProportion = (currPageOffset - 1) / (pageRange - 1),
        //计算出偏移值
        offsetTranslate = conversionValue(translate, nodeOffsetProportion),
        //页面分割比
        nodeProportion = 1 / (pageRange - 1);

    //改变节点的transform属性
    //返回改变后translateX值
    const parallaxOffset = transformNodes(data.$contentNode, _.extend({}, offsetTranslate), data.transformOffset);

    /**
     * 为了兼容动画，把视觉差当作一种行为处理
     * 合并data数据
     * @type {Object}
     */
    data.parallax = {
        //计算页码结束边界值,用于跳转过滤
        calculateRangePage: function() {
            return {
                'start': pid - currPageOffset + 1,
                'end': pageRange - currPageOffset + pid
            }
        },
        'translate'       : translate,
        'offsetTranslate' : offsetTranslate,
        'nodeProportion'  : nodeProportion,
        '$contentNode'    : data.$contentNode,
        'parallaxOffset'  : parallaxOffset //经过视觉差修正后的偏移量
    }

    return data;
}
