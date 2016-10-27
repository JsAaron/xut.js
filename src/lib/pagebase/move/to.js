import { config } from '../../config/index'
import { translation } from './translation'

import {
    _flipMove,
    _flipOver,
    _flipRebound,
    _overMemory,
    _transformNodes,
    _transformConversion
} from './parallax'


/**
 * 移动视觉差对象
 */
const _translate = function($contentNode, scope, direction, action, speed, nodes, distance) {

    let translate = scope.translate
    let offsetTranslate = scope.offsetTranslate
    let nodes_1

    //往前翻页
    if (direction === 'prev') {
        //分割的比例
        nodes_1 = scope.nodeProportion;
        //如果往前溢出则取0
        nodes = (nodes == nodes_1) ? 0 : nodes_1;
    }

    //视觉对象移动的距离
    let moveTranslate = _transformConversion(translate, distance, nodes);

    switch (action) {
        //移动中
        case 'flipMove':
            moveTranslate = _flipMove(moveTranslate, offsetTranslate);
            break;
            //反弹
        case 'flipRebound':
            moveTranslate = _flipRebound(moveTranslate, offsetTranslate);
            break;
            //翻页结束,记录上一页的坐标
        case 'flipOver':
            if (direction === 'prev') {
                moveTranslate = _flipOver(moveTranslate, offsetTranslate);
            }
            _overMemory(moveTranslate, offsetTranslate);
            break
    }

    //直接操作元素
    _transformNodes($contentNode, speed, moveTranslate, offsetTranslate.opacityStart || 0);
}


/**
 * 滑动
 * @param  {[type]} baseProto [description]
 * @return {[type]}           [description]
 */
export default function(baseProto) {

    /**
     * 页面移动
     * @return {[type]} [description]
     */
    baseProto.toMove = function(action, distance, speed, viewOffset) {

        const pageNode = this.$pageNode[0]

        //浮动页面
        if (this.pageType === 'page') {
            //移动浮动页面容器
            const $floatElement = this.floatContents.PageContainer
            if ($floatElement) {
                translation[action]($floatElement[0], distance, speed)
            }
        }

        //浮动母版
        if (this.pageType === 'master') {
            //母版交接判断
            //用户事件的触发
            this.onceMaster = false

            //移动浮动容器
            const $masterElement = this.floatContents.MasterContainer
            if ($masterElement) {
                translation[action]($masterElement[0], distance, speed)
            }
        }

        //过滤多个动画回调，
        //保证指向始终是当前页面
        //翻页 && 是母版页 && 是当前页面
        let isVisual = false // 是可视页面
        if (action === 'flipOver' && this.pageType === 'page' && distance === viewOffset) {
            //增加可视页面标记
            pageNode.setAttribute('data-view', true)
            isVisual = true
        }

        //当前页面
        translation[action](pageNode, distance, speed, () => {
            //修正flipMode切换页面的处理
            //没有翻页效果
            //强制给动画结束触发
            //可视区页面
            //排除母版的情况
            if (config.flipMode && isVisual) {
                //设置动画完成
                Xut.Application.SetTransitionComplete(pageNode, pageNode.getAttribute('data-view'))
                return true
            }
        })
    }


    /**
     * 移动视察对象
     */
    baseProto.moveParallax = function(action, direction, moveDist, speed, nodes, parallaxProcessedContetns) {

        var base = this;

        const baseContents = this.baseGetContent()
        if (baseContents) {
            //移动距离
            const distance = moveDist[1];
            //遍历所有活动对象
            _.each(baseContents, function(content) {
                content.eachAssistContents(function(scope) {
                    //如果是视察对象移动
                    if (scope.parallax) {
                        const $contentNode = scope.parallax.$contentNode;
                        const contentObj = base.baseGetContentObject(scope.id)

                        /////////////////////
                        //如果有这个动画效果 //
                        //先停止否则通过视觉差移动会出问题
                        // //影响，摩天轮转动APK
                        // * 重新激动视觉差对象
                        // * 因为视察滑动对象有动画
                        // * 2个CSS3动画冲突的
                        // * 所以在视察滑动的情况下先停止动画
                        // * 然后给每一个视察对象打上对应的hack=>data-parallaxProcessed
                        // * 通过动画回调在重新加载动画
                        /////////////////////
                        if (action === "flipMove" && contentObj.anminInstance && !contentObj.parallaxProcessed) {
                            //标记
                            var actName = contentObj.actName;
                            contentObj.stop();
                            //视觉差处理一次,停止过动画
                            contentObj.parallaxProcessed = true;
                            //增加标记
                            $contentNode.attr('data-parallaxProcessed', actName);
                            //记录
                            parallaxProcessedContetns[actName] = contentObj
                        }

                        //移动视觉差对象
                        _translate($contentNode, scope.parallax, direction, action, speed, nodes, distance);
                    }
                })
            })
        }
    }


}
