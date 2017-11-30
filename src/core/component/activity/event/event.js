/**
 * ppt事件接口
 *
 * 允许用户自定义其行为
 *     1 支持14种操作行为
 *     2 默认对象都具有滑动翻页的特性
 *     3 翻页的特性在遇到特性的情况可以被覆盖
 *     比如
 *         行为1：用户定义该名字可以支持  click 点击行为， 那么该元素左右滑动能过翻页
 *         行为2：用户如果定义swipeLeft 行为，该元素左右滑动将不会翻页，因为默认翻页已经被覆盖
 *
 * 此接口函数有作用域隔离
 */
import DragDrop from './bind/drag'
import { simpleEvent } from './bind/simple'
import { complexEvent } from './bind/complex'


/**
 * 事件类型
 * @type {Array}
 * 0 null
 * 1 auto
 * 2 tap
 * 3 drag
 * 4 dragTag
 * .........
 */
var eventName = ['null', 'auto', 'tap', 'drag', 'dragTag',
  'swipeleft', 'swiperight', 'swipeup', 'swipedown', 'doubletap',
  'press', 'pinchout', 'pinchin', 'rotate', 'assist'
]


/**
 * 重写默认事件
 *
 * Content对象默认具有左右翻页的特性
 * 根据过滤来选择是否覆盖重写这个特性
 * 比如 用户如果遇到 swipeLeft，swipeRight 这种本身与翻页行为冲突的
 * 将要覆盖这个行为
 * 过滤事件
 * 如果用户指定了如下操作行为,将覆盖默认的翻页行为
 **/
const filterEvent = ['drag', 'dragTag', 'swipeleft', 'swiperight', 'swipeup', 'swipedown']


/**
 * 是否过滤
 * @param  {[type]} evtName [description]
 * @return {[type]}         [description]
 */
const isfilter = eventName => {
  return filterEvent.indexOf(eventName) === -1 ? true : false;
}

/**
 * 特性摘除
 * 1 ：无事件，默认可以翻页，还可以切换工具栏
 * 2 ：静态事件，默认可以翻页
 * 3 : 冲突事件，默认删除
 * 去除默认元素具有的翻页特性
 * @param  {[type]} evtName [事件名]
 * @return {[type]}         [description]
 */
const setDefaultBehavior = function (supportSwipe, $contentNode) {
  if(supportSwipe) {
    //静态事件，默认可以翻页，还可以切换工具栏
    $contentNode.attr('data-behavior', 'swipe');
  } else {
    //如果事件存在
    $contentNode.attr('data-behavior', 'disable');
  }
}


/**
 * 针对软件培训的操作行为下光标状态需求
 */
const addCursor = function (eventName, $contentNode) {
  if($contentNode) {
    if(!$contentNode.prop('setCursor')) { //只设置一次
      if(eventName === ('drag' || 'dragTag')) {
        $contentNode.css('cursor', 'Move')
      } else {
        $contentNode.css('cursor', 'Pointer')
      }
      $contentNode.prop('setCursor', 'true');
    }
  }
}


/**
 *  绑定事件
 * @param  {[type]} eventDrop [description]
 * @param  {[type]} data      [description]
 * @return {[type]}           [description]
 */
const _bind = function (eventDrop, data) {
  let dragObj
  let handler
  let reference
  let eventContext = data.eventContext
  let eventName = data.eventName
  let supportSwipe = data.supportSwipe

  if(eventName === 'drag') { //拖动
    dragObj = new DragDrop(eventContext, null, data.parameter, eventDrop.startRun, eventDrop.stopRun);
  } else if(eventName === 'dragTag') { //拖拽
    dragObj = new DragDrop(eventContext, data.target, 1, eventDrop.startRun, eventDrop.stopRun);
  } else {
    handler = function () {
        data.eventRun.call(eventContext)
      }
      /////////////////
      /// tap click
      /////////////////
    if(eventName === 'tap' || eventName === 'click') {
      reference = simpleEvent(eventName, eventContext, handler, supportSwipe)
    }
    //复杂用hammer
    else {
      reference = complexEvent(eventContext, eventName, handler, supportSwipe)
    }
  }

  return {
    dragObj,
    reference,
    handler
  }
}



/**
 * /匹配事件
 * parameter 参数
 * 1：对于自由拖动drag，para参数为0，表示松手后，停留在松手的地方
 *                    para参数为1，表示松手后，返回原来的位置
 * 2: 对于拖拽dragTag， para表示目标对象的target
 */
function distribute(data) {
  //针对软件培训的操作行为下光标状态需求
  Xut.plat.isBrowser && data.domMode && addCursor(data.eventName, data.eventContext)

  //绑定事件
  let eventDrop = data.eventDrop

  //拖动,引用,回调
  let eventObj = _bind(eventDrop, data)

  //拖动,拖拽对象处理
  if(eventObj.dragObj && eventDrop.init) {
    eventDrop.init(eventObj.dragObj)
    return
  }
  //其余事件
  data.eventHandler(eventObj.reference, eventObj.handler)
}


//数据库预定义14个事件接口
//提供给content文件
//用于过滤数据库字段指定的行为
//https://github.com/EightMedia/hammer.js/wiki/Getting-Started
//2014.3.18 新增assist 辅助对象事件
export function conversionEventType(eventType) {
  return eventName[Number(eventType) - 1] || null;
}


/**
 * 增加默认行为
 */
export function defaultBehavior($contentNode) {
  $contentNode && $contentNode.attr('data-behavior', 'disable');
}


/**
 * 注册自定义事件
 * this还是引用的当前实例的上下文
 *
 *   '$contentNode'   : 事件对象
 *   'target'    : 目标对象
 *   'parameter' : 拖动参数
 *   'evtName'   : 事件名,
 *
 *   callbackHook 回调函数 ,处理具体的事情
 */
export function bindContentEvent(data) {
  //是否支持翻页
  let supportSwipe = data.supportSwipe = isfilter(data.eventName);
  //检测是否移除元素的默认行为,因为元素都具有翻页的特性
  if(data.domMode) {
    setDefaultBehavior(supportSwipe, data.eventContext);
  }
  distribute(data)
}


/**
 * 销毁对象事件
 */
export function destroyContentEvent(eventRelated, eventName) {
  if(eventRelated.eventReference) {
    eventRelated.eventReference.off(eventName || eventRelated.eventName, eventRelated.eventHandler)
    eventRelated.eventReference = null;
    eventRelated.eventHandler = null
  }
}
