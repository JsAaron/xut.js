/***************************************************************
 *
 *          视觉差对象初始化操作
 *
 ****************************************************************/


let screenSize

//变化节点的css3transform属性
function transformNodes(rootNode, property, pageOffset) {
    var style = {},
        effect = '',
        parallaxOffset, //最终的偏移量X
        x = 0,
        y = 0,
        z = 0,
        round = Math.round,
        prefix = Xut.plat.prefixStyle,

        //浮动对象初始化偏移量
        parallaxOffset = pageOffset;

    if (property.translateX != undefined || property.translateY != undefined || property.translateZ != undefined) {
        x = round(property.translateX) || 0;
        y = round(property.translateY) || 0;
        z = round(property.translateZ) || 0;
        parallaxOffset += x;
        effect += String.format('translate3d({0}px,{1}px,{2}px) ', parallaxOffset, y, z);
    }

    if (property.rotateX != undefined || property.rotateY != undefined || property.rotateZ != undefined) {
        x = round(property.rotateX);
        y = round(property.rotateY);
        z = round(property.rotateZ);
        effect += x ? 'rotateX(' + x + 'deg) ' : '';
        effect += y ? 'rotateY(' + y + 'deg) ' : '';
        effect += z ? 'rotateZ(' + z + 'deg) ' : '';
    }

    if (property.scaleX != undefined || property.scaleY != undefined || property.scaleZ != undefined) {
        x = round(property.scaleX * 100) / 100 || 1;
        y = round(property.scaleY * 100) / 100 || 1;
        z = round(property.scaleZ * 100) / 100 || 1;
        effect += String.format('scale3d({0},{1},{2}) ', x, y, z);
    }

    if (property.opacity != undefined) {
        style.opacity = round((property.opacityStart + property.opacity) * 100) / 100;
        effect += ';'
    }

    if (effect) {
        style[prefix('transform')] = effect;
        rootNode.css(style);
    }

    return parallaxOffset;
}

//转换成比例值
function conversionRatio(parameters) {
    if (parameters.opacityStart > -1) {
        parameters.opacity = (parameters.opacityEnd || 1) - parameters.opacityStart;
        delete parameters.opacityEnd;
    }
    return parameters;
}

//转化成实际值
function conversionValue(parameters, nodeProportion, screenSize) {
    var results = {},
        width = -screenSize.width,
        height = -screenSize.height;

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

    screenSize = Xut.config.screenSize

    try {
        //转化所有css特效的参数的比例
        var parameters = JSON.parse(data.getParameter()[0]['parameter']);
    } catch (err) {
        return false;
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
        offsetTranslate = conversionValue(translate, nodeOffsetProportion, screenSize),
        //页面分割比
        nodeProportion = 1 / (pageRange - 1);

    //改变节点的transform属性
    //返回改变后translateX值
    var parallaxOffset = transformNodes(data.$contentProcess, _.extend({}, offsetTranslate), data.transformOffset);

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
        'translate': translate,
        'offsetTranslate': offsetTranslate,
        'nodeProportion': nodeProportion,
        'rootNode': data.$contentProcess,
        'parallaxOffset': parallaxOffset //经过视觉差修正后的偏移量
    }

    return data;
}
