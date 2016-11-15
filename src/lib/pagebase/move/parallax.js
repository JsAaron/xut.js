import {
    flipMove,
    flipOver,
    flipRebound,
    overMemory,
    converProperty,
    setStyle
} from '../../component/activity/content/parallax/util'

/**
 * 移动视觉差对象
 */
const translateParallax = function({
    $contentNode,
    scope,
    direction,
    action,
    speed,
    nodes,
    distance
}) {

    let initProperty = scope.initProperty
    let originalProperty = scope.originalProperty

    //往前翻页
    if (direction === 'prev') {
        //分割的比例
        let nodes_1 = scope.nodeProportion;
        //如果往前溢出则取0
        nodes = (nodes == nodes_1) ? 0 : nodes_1;
    }


    let property = converProperty({
        nodes,
        distance,
        initProperty,
        originalProperty
    })

    // if($contentNode[0].id == 'Content_1_4'){
    //     // console.log(property)
    // }

    switch (action) {
        case 'flipMove': //移动中
            property = flipMove(property, initProperty);
            break;
        case 'flipRebound': //反弹
            property = flipRebound(property, initProperty);
            break;
        case 'flipOver':
            if (direction === 'prev') {
                property = flipOver(property, initProperty);
            }

            //缩放特殊
            //值需要从1开始算起
            // if (direction === 'next') {
            //     if (property.scaleX) {
            //         property.scaleX = property.scaleX + (originalProperty.scaleX - initProperty.scaleX)
            //     }
            //     if (property.scaleY) {
            //         property.scaleY = property.scaleY + (originalProperty.scaleX - initProperty.scaleX)
            //     }
            // }

            //翻页结束,记录上一页的坐标
            overMemory(property, initProperty);
            break
    }


    //直接操作元素
    setStyle({
        $contentNode,
        action: 'master',
        property: property,
        speed: speed,
        opacityStart: initProperty.opacityStart
    })

}


/**
 * 滑动
 * @param  {[type]} baseProto [description]
 * @return {[type]}           [description]
 */
export default function(baseProto) {

    /**
     * 移动视察对象
     */
    baseProto.moveParallax = function({
        action,
        direction,
        moveDist,
        speed,
        nodes,
        parallaxProcessedContetns
    }) {

        let base = this
        let baseContents = this.baseGetContent()

        if (!baseContents) {
            return
        }

        //移动距离
        let distance = moveDist.length ? moveDist[1] : moveDist

        //遍历所有活动对象
        _.each(baseContents, content => {
            content.eachAssistContents(scope => {
                //如果是视察对象移动
                if (scope.parallax) {

                    let $contentNode = scope.parallax.$contentNode;

                    /**
                     * 如果有这个动画效果
                     * 先停止否则通过视觉差移动会出问题
                     * 影响，摩天轮转动APK
                     * 重新激动视觉差对象
                     * 因为视察滑动对象有动画
                     * 2个CSS3动画冲突的
                     * 所以在视察滑动的情况下先停止动画
                     * 然后给每一个视察对象打上对应的hack=>data-parallaxProcessed
                     * 通过动画回调在重新加载动画
                     */
                    if (parallaxProcessedContetns) {
                        let contentObj = base.baseGetContentObject(scope.id)
                        if (contentObj &&
                            action === "flipMove" &&
                            contentObj.pptObj && //ppt动画
                            !contentObj.parallaxProcessed) {
                            //标记
                            let actName = contentObj.actName;
                            contentObj.stopAnimations();
                            //视觉差处理一次,停止过动画
                            contentObj.parallaxProcessed = true;
                            //增加标记
                            $contentNode.attr('data-parallaxProcessed', actName);
                            //记录
                            parallaxProcessedContetns[actName] = contentObj
                        }
                    }


                    //移动视觉差对象
                    translateParallax({
                        $contentNode,
                        scope: scope.parallax,
                        direction,
                        action,
                        speed,
                        nodes,
                        distance
                    })

                }
            })
        })
    }


}
