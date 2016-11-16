/**
 * 视觉差对象初始化操作
 */

import { config } from '../../../../config/index'
import { parseJSON } from '../../../../util/lang'
import {
    setStyle,
    getInitProperty
} from './calculate'

import {
    hasFlow,
    getFlowCount
} from '../../../flow/get'

/**
 * 变化节点的css3transform属性
 * @param  {[type]} $contentNode   [description]
 * @param  {[type]} property   [description]
 * @param  {[type]} pageOffset [description]
 * @return {[type]}            [description]
 */
const setTransformNodes = function($contentNode, property, pageOffset) {
    return setStyle({ //return parallaxOffset
        $contentNode,
        action: 'init',
        property,
        pageOffset
    })
}


/**
 * 转换成比例值
 * @param  {[type]} parameters [description]
 * @return {[type]}            [description]
 */
const converParameters = function(property) {
    if (property.opacityStart > -1) {
        property.opacity = (property.opacityEnd || 1) - property.opacityStart;
        delete property.opacityEnd;
    }
    return property
}


/**
 * 如果母版依赖的页面是flow页面
 * 需要获取到具体的页面长度
 * @return {[type]} [description]
 */
const getFlowFange = function(pageIndex) {
    var relyPageObj = Xut.Presentation.GetPageObj('page', pageIndex)
    if (relyPageObj && relyPageObj.chapterData.note === 'flow') {
        let seasonId = relyPageObj.chapterData.seasonId
        let chapterId = relyPageObj.chapterId
        let range = getFlowCount(seasonId, chapterId) //分页总数
        return range
    }
}

export default function Parallax(data, relatedData) {

    //转化所有css特效的参数的比例
    let originalProperty = parseJSON(data.getParameter()[0]['parameter'])
    if (!originalProperty) {
        return
    }

    originalProperty = converParameters(originalProperty)

    let pid = data.pid

    //首位分割点
    let currPageOffset

    //如果是flow页面，拿到分页数
    let pageRange = hasFlow() && getFlowFange(data.pageIndex)
    if (pageRange) {
        let visualIndex = Xut.Presentation.GetPageIndex()
        if (data.pageIndex == visualIndex || data.pageIndex > visualIndex) {
            currPageOffset = 1
        } else {
            currPageOffset = pageRange
        }
    } else {
        //页面偏移量
        //["3", "6", "4"]
        //表示第4次采用了这个母板，中间有其他模板间隔开了的情况
        let pageOffset = relatedData.pageOffset && relatedData.pageOffset.split("-");
        //开始的nodes值
        currPageOffset = parseInt(pageOffset[0]);
        //范围区域
        pageRange = parseInt(pageOffset[1])
    }


    //页面偏移比例
    let nodeOffset = (currPageOffset - 1) / (pageRange - 1) || 0

    //计算出新的新的值
    let lastProperty = getInitProperty(originalProperty, nodeOffset)

    //页面分割比
    let nodeRatio = 1 / (pageRange - 1)

    //初始化视觉差对象的坐标偏移量
    let transformOffset = relatedData.getTransformOffset(data.id)
    let parallaxOffset = setTransformNodes(data.$contentNode, lastProperty, transformOffset)


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
        originalProperty, //原始属性
        lastProperty, //最后一个属性值
        nodeRatio, //比值
        parallaxOffset //经过视觉差修正后的偏移量
    }


    return data;
}
