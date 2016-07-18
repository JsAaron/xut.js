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

import { DragDropClass } from './drag'
import { simpleEvent } from './simple'
import { complexEvent } from './complex'


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
var filterEvent = ['drag', 'dragTag', 'swipeleft', 'swiperight', 'swipeup', 'swipedown'];


/**
 * 是否过滤
 * @param  {[type]} evtName [description]
 * @return {[type]}         [description]
 */
function isfilter(eventName) {
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
function setDefaultBehavior(supportSwipe, element) {
    if (supportSwipe) {
        //静态事件，默认可以翻页，还可以切换工具栏
        element.attr('data-behavior', 'swipe');
    } else {
        //如果事件存在
        element.attr('data-behavior', 'disable');
    }
}

/**
 * 针对软件培训的操作行为下光标状态需求
 * @param {[type]} element [description]
 */
function addCursor(eventName, $element) {
    if ($element) {
        if (!$element.prop('setCursor')) { //只设置一次
            if (eventName === ('drag' || 'dragTag')) {
                $element.css('cursor', 'Move')
            } else {
                $element.css('cursor', 'Pointer')
            }
            $element.prop('setCursor', 'true');
        }
    }
}


/**
 *  绑定事件
 * @param  {[type]} eventDrop [description]
 * @param  {[type]} data      [description]
 * @return {[type]}           [description]
 */
function _bind(eventDrop, data) {
    var dragObj, eventHandler, eventReference, eventContext, eventName, supportSwipe

    eventContext = data.eventContext
    eventName = data.eventName
    supportSwipe = data.supportSwipe

    switch (eventName) {
        case 'drag': //拖动
            dragObj = new DragDropClass(eventContext, null, data.parameter, eventDrop.startRun, eventDrop.stopRun);
            break;
        case 'dragTag': //拖拽
            dragObj = new DragDropClass(eventContext, data.target, 1, eventDrop.startRun, eventDrop.stopRun);
            break;
        default:

            //事件句柄
            eventHandler = function() {
                data.eventRun.call(eventContext);
            }

            //简单单机
            if (eventName === 'tap') {
                eventReference = simpleEvent(eventContext, eventHandler, supportSwipe)
            } else {
                //复杂用hammer
                eventReference = complexEvent(eventContext, eventName, eventHandler, supportSwipe)
            }
            break;
    }

    return [dragObj, eventReference, eventHandler]
}



/**
 * /匹配事件
 * parameter 参数
 * 1：对于自由拖动drag，para参数为0，表示松手后，停留在松手的地方
 *                      para参数为1，表示松手后，返回原来的位置
 * 2: 对于拖拽dragTag， para表示目标对象的target
 */
function matchEvent(data) {
    //针对软件培训的操作行为下光标状态需求
    Xut.plat.isBrowser &&
        data.domMode &&
        addCursor(data.eventName, data.eventContext)

    //绑定事件
    var eventDrop = data.eventDrop

    //拖动,引用,回调
    var eventObj = _bind(eventDrop, data)

    //拖动,拖拽对象处理
    //动作初始化
    if (eventObj[0] && eventDrop.init) {
        eventDrop.init(eventObj[0]);
    } else {
        //传递引用
        data.eventHandler(eventObj[1], eventObj[2])
    }
}


/**
 * 注册自定义事件
 * this还是引用的当前实例的上下文
 *
 *   'element'   : 事件对象
 *   'target'    : 目标对象
 *   'parameter' : 拖动参数
 *   'evtName'   : 事件名,
 *
 *   callbackHook 回调函数 ,处理具体的事情
 */
export function bindEvents(data) {
    //是否支持翻页
    var supportSwipe = data.supportSwipe = isfilter(data.eventName);
    //检测是否移除元素的默认行为,因为元素都具有翻页的特性
    if (data.domMode) {
        setDefaultBehavior(supportSwipe, data.eventContext);
    }
    //执行事件绑定
    matchEvent(data);
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
export function defaultBehavior(element) {
    element && element.attr('data-behavior', 'disable');
}


/**
 * 销毁对象事件
 */
export function destroyEvents(eventData, eventName) {
    if (eventData.eventReference) {
        eventData.eventReference.off(eventName || eventData.eventName, eventData.eventHandler)
        eventData.eventReference = null;
        eventData.eventHandler = null
    }
}
