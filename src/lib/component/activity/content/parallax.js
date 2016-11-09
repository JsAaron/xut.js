/**
 * 视觉差对象初始化操作
 */

import { config } from '../../../config/index'
import { parseJSON } from '../../../util/lang'
import { getParallaxStyle } from '../../../pagebase/move/util.parallax'

/**
 * 变化节点的css3transform属性
 * @param  {[type]} $contentNode   [description]
 * @param  {[type]} property   [description]
 * @param  {[type]} pageOffset [description]
 * @return {[type]}            [description]
 */
const setTransformNodes = function($contentNode, property, pageOffset) {
    let value = getParallaxStyle({
        action: 'init',
        property,
        pageOffset
    })
    if (value.style) {
        $contentNode.css(value.style)
    }
    return value.parallaxOffset
}


/**
 * 转换成比例值
 * @param  {[type]} parameters [description]
 * @return {[type]}            [description]
 */
const converParameters = function(parameters) {
    if (parameters.opacityStart > -1) {
        parameters.opacity = (parameters.opacityEnd || 1) - parameters.opacityStart;
        delete parameters.opacityEnd;
    }
    return parameters
}


/**
 * 转化成实际值
 * @param  {[type]} parameters     [description]
 * @param  {[type]} nodeProportion [description]
 * @return {[type]}                [description]
 */
const converValue = function(parameters, nodeProportion) {
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


export default function Parallax(data, relatedData) {

    //转化所有css特效的参数的比例
    let parameters = parseJSON(data.getParameter()[0]['parameter'])
    if (!parameters) {
        return
    }

    parameters = converParameters(parameters)

    let pid = data.pid

    //页面偏移量
    //["3", "6", "1"]
    let pageOffset = relatedData.pageOffset && relatedData.pageOffset.split("-")

    //开始的nodes值
    let currPageOffset = pageOffset[0]

    //范围区域
    let pageRange = pageOffset[1]

    //页面偏移比例
    let nodeOffsetProportion = (currPageOffset - 1) / (pageRange - 1)

    //计算出新的新的值
    let property = converValue(parameters, nodeOffsetProportion)

    //页面分割比
    let nodeProportion = 1 / (pageRange - 1)

    //初始化视觉差对象的坐标偏移量
    let transformOffset = relatedData.getTransformOffset(data.id)
    let parallaxOffset = setTransformNodes(data.$contentNode, property, transformOffset)

    /**
     * 为了兼容动画，把视觉差当作一种行为处理
     * 合并data数据
     * @type {Object}
     */
    data.parallax = {
        $contentNode: data.$contentNode,
        /**
         * 计算页码结束边界值,用于跳转过滤
         */
        calculateRangePage() {
            return {
                'start': pid - currPageOffset + 1,
                'end': pageRange - currPageOffset + pid
            }
        },
        parameters,
        initProperty: property,
        nodeProportion,
        /**
         * 经过视觉差修正后的偏移量
         */
        parallaxOffset
    }


    return data;
}
