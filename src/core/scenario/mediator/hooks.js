 //调度器
 import { $trigger } from '../command/index'


 //委托事件处理钩子
 export default {

   /**
    * 超连接,跳转
    * svg内嵌跳转标记处理
    */
   'data-xxtlink' (target, attribute, rootNode, pageIndex) {
     try {
       var para = attribute.split('-');
       if (para.length > 1) { //如果有多个就是多场景的组合
         Xut.View.GotoSlide(para[0], para[1])
       } else {
         Xut.View.GotoSlide(para[0])
       }
     } catch (err) {
       console.log('跳转错误')
     }
   },

   /**
    * Action', 'Widget', 'Video', 'ShowNote', 'SubDoc'委托
    * arg
    *   target, attribute, rootNode, pageIndex
    */
   'data-delegate' (target, attribute, rootNode, pageIndex) {
     $trigger({
       target,
       attribute,
       rootNode,
       pageIndex
     })
   },


   /**
    * 有效,可滑动
    */
   'data-flow' () {

   },

   /**
    * 如果是canvas节点
    */
   'data-canvas' (cur) {
     // alert(1)
   }
 }
