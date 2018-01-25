import {
  flipMove,
  flipOver,
  flipRebound,
  cacheProperty,
  getStepProperty,
  setStyle
} from '../../../component/activity/content/parallax/depend'

/**
 * 移动视觉差对象
 */
const translateParallax = function({
  $contentNode,
  scope,
  direction,
  pageIndex,
  action,
  speed,
  nodes,
  distance,
  isColumn
}) {

  let lastProperty = scope.lastProperty
  let targetProperty = scope.targetProperty

  //往前翻页
  if(direction === 'prev') {
    //分割的比例
    let nodeRatio = scope.nodeRatio

    //如果往前溢出则取0
    nodes = (nodes == nodeRatio) ? 0 : nodeRatio
  }

  //每次单步变化属性值
  let stepProperty = getStepProperty({
    nodes,
    isColumn,
    distance,
    lastProperty,
    pageIndex,
    targetProperty
  })

  switch(action) {
    case 'flipMove': //移动中
      stepProperty = flipMove(stepProperty, lastProperty)
      break;
    case 'flipRebound': //反弹
      stepProperty = flipRebound(stepProperty, lastProperty)
      break;
    case 'flipOver':
      if(direction === 'prev') {
        stepProperty = flipOver(stepProperty, lastProperty)
      }

      //缩放单独处理
      //因为缩放是从1开始的
      //所以每次计算出单步的值后，需要叠加原始的值1
      if(direction === 'next') {
        if(stepProperty.scaleX !== undefined) {
          stepProperty.scaleX = stepProperty.scaleX + 1
        }
        if(stepProperty.scaleY !== undefined) {
          stepProperty.scaleY = stepProperty.scaleY + 1
        }
        if(stepProperty.scaleZ !== undefined) {
          stepProperty.scaleZ = stepProperty.scaleZ + 1
        }
      }

      //翻页结束,记录上一页的坐标
      cacheProperty(stepProperty, lastProperty)
      break
  }

  // if($contentNode[0].id === 'Content_1_4'){
  //     console.log(stepProperty)
  // }


  //直接操作元素
  setStyle({
    $contentNode,
    action: 'master',
    interaction: action,
    pageIndex,
    targetProperty,
    property: stepProperty,
    speed: speed,
    opacityStart: lastProperty.opacityStart
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
    moveDistance,
    pageIndex,
    speed,
    nodes,
    parallaxProcessedContetns
  }) {

    let base = this
    let activitys = this.baseGetActivity()

    if(!activitys) {
      return
    }

    //是珊栏页面，那么翻页的参数需要转化
    let isColumn = base.getStyle.pageVisualMode === 1

    //移动距离
    let distance = moveDistance.length ? moveDistance[1] : moveDistance

    //遍历所有活动对象
    _.each(activitys, content => {
      content.eachAssistContents(scope => {
        //如果是视察对象移动
        if(scope.parallax) {

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
          if(parallaxProcessedContetns) {
            let contentObj = base.baseGetContentObject(scope.id)
            if(contentObj &&
              action === "flipMove" &&
              contentObj.pptObj && //ppt动画
              !contentObj.parallaxProcessed) {
              //标记
              let actName = contentObj.actName;
              contentObj.stop && contentObj.stop();
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
            pageIndex,
            $contentNode,
            scope: scope.parallax,
            direction,
            action,
            speed,
            nodes,
            distance,
            isColumn
          })

        }
      })
    })
  }


}
