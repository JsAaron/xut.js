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

/**
 * ie10下面mouse事件怪异
 * @return {Boolean} [description]
 */
var isIE10 = document.documentMode === 10;


/**
 * 事件类型
 * @type {Array}
 */
var eventName = ['null', 'auto', 'tap', 'drag', 'dragTag',
    'swipeleft', 'swiperight', 'swipeup', 'swipedown', 'doubletap',
    'press', 'pinchout', 'pinchin', 'rotate', 'assist'
]

/*********************************************************************
 *                重写默认事件
 *
 *                Content对象默认具有左右翻页的特性
 *                根据过滤来选择是否覆盖重写这个特性
 *                比如 用户如果遇到 swipeLeft，swipeRight 这种本身与翻页行为冲突的
 *                将要覆盖这个行为
 *                                                         *
 **********************************************************************/

//过滤事件
//如果用户指定了如下操作行为,将覆盖默认的翻页行为
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
function checkDefaultBehavior(supportSwipe, element) {
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
 * 针对canvas模式
 * 特殊的hack
 */
function setCanvasStart(supportSwipe) {
    Xut.Contents.Canvas.Reset()
    //当前点击的元素是滑动元素
    //处理元素的全局事件
    Xut.Contents.Canvas.SupportSwipe = supportSwipe;
    Xut.Contents.Canvas.isTap = true;
}

function setCanvasMove() {
    Xut.Contents.Canvas.isSwipe = true;
}


/**
 * 兼容事件对象
 * @return {[type]}   [description]
 */
function compatibilityEvent(e) {
    var point;
    if (e.touches && e.touches[0]) {
        point = e.touches[0];
    } else {
        point = e;
    }
    return point
}

/**
 * 如果是简单的点击事件
 */
function tapEvent(eventContext, eventHandle, supportSwipe) {

    eventContext.isTap = false;

    //这里单独绑定事件有个问题,单击move被触发
    //如果停止e.stopPropagation，那么默认行为就不会被触发
    //你绑定单击的情况下可以翻页
    //这里通过坐标的位置来判断
    var start = function (e) {
        var point = compatibilityEvent(e);
        //记录开始坐标
        eventContext.pageX = point.pageX;
        //是否是tap事件
        eventContext.isTap = true;
        setCanvasStart(supportSwipe);
    }

    var move = function (e) {
        if (!eventContext.isTap) {
            return
        }
        var point = compatibilityEvent(e),
            deltaX = point.pageX - eventContext.pageX;
        //如果有move事件，则取消tap事件
        if (Math.abs(deltaX)) {
            eventContext.isTap = false;
            setCanvasMove(supportSwipe);
        }
    }
    
    var end = function () {
        //触发tap事件
        eventContext.isTap && eventHandle();
    }


    eventContext = eventContext[0];
    //IE10是不支持touch事件，直接绑定click事件
    if (isIE10) {
        eventContext.isTap = true;
        eventContext.addEventListener('click', end, false);
    } else {
        Xut.plat.execEvent('on', {
            context: eventContext,
            callback: {
                start: start,
                move: move,
                end: end
            }
        })
    }


    //销毁接口
    return {
        off: function () {
            if (eventContext) {
                if (isIE10) {
                    eventContext.removeEventListener('click', end, false);
                } else {
                    Xut.plat.execEvent('off', {
                        context: eventContext,
                        callback: {
                            start: start,
                            move: move,
                            end: end
                        }
                    })
                }
                eventContext = null;
            }
        }
    }
}


/**
 * 优化hammer创建,生成必要配置文件
 * @return {[type]} [description]
 */
function createRecognizers(eventName) {
    var recognizers = [];
    switch (eventName) {
        //如果是swipe处理
        case 'swipeleft':
        case 'swiperight':
        case 'swipeup':
        case 'swipedown':
            var direction = Hammer.DIRECTION_HORIZONTAL;
            if (eventName === 'swipeup' || eventName === "swipedown") {
                direction = Hammer.DIRECTION_VERTICAL;
            }
            recognizers.push([Hammer.Swipe, { 'direction': direction, 'velocity': 0.01 }])
            break;
        case 'doubletap': //双击
            recognizers.push([Hammer.Tap])
            recognizers.push([Hammer.Tap, { event: 'doubletap', taps: 2 },
                ['tap']
            ])
            break
        case 'press': //长按
            recognizers.push([Hammer.Press])
            return
    }
    return recognizers;
}


/**
 * 创建hammer引用
 * @return {[type]}         [description]
 */
function createHammer(eventContext, eventName, supportSwipe) {
    var eventReference;
    var context = eventContext[0];
    var recognizer = createRecognizers(eventName)
    if (recognizer && recognizer.length) {
        eventReference = Hammer(context, {
            'recognizers': recognizer
        });
    } else {
        eventReference = Hammer(context)
    }
    return eventReference;
}

/**
 * 复杂的事件
 * @return {[type]} [description]
 */
function complexEvent(eventContext, eventName, eventHandler, supportSwipe) {
    var eventReference = createHammer(eventContext, eventName, supportSwipe);
    eventReference.on(eventName, function () {
        eventHandler();
    });
    return eventReference;
}

//绑定事件
function bindEvent(eventDrop, data) {
    var dragObj, eventHandler, eventReference;
    var eventContext = data.eventContext;
    var eventName = data.eventName;
    switch (eventName) {
        case 'drag': //拖动
            dragObj = new DragDropClass(eventContext, null, data.parameter, eventDrop.startRun, eventDrop.stopRun);
            break;
        case 'dragTag': //拖拽
            dragObj = new DragDropClass(eventContext, data.target, 1, eventDrop.startRun, eventDrop.stopRun);
            break;
        default:
            //事件句柄
            eventHandler = function () {
                data.eventRun.call(eventContext);
            };
            eventReference = eventName === 'tap'
                ? tapEvent(eventContext, eventHandler, data.supportSwipe)
                : complexEvent(eventContext, eventName, eventHandler, data.supportSwipe)
            break;
    }
    return [dragObj, eventReference, eventHandler]
}



//绑定事件
// parameter 参数
// 1：对于自由拖动drag，para参数为0，表示松手后，停留在松手的地方
//                      para参数为1，表示松手后，返回原来的位置
//
// 2: 对于拖拽dragTag， para表示目标对象的target
function applyEvent(data) {

    //针对软件培训的操作行为下光标状态需求
    Xut.plat.isBrowser && data.domMode && addCursor(data.eventName, data.eventContext)

    //绑定事件
    var eventDrop = data.eventDrop,
        eventObj = bindEvent(eventDrop, data);

    //拖动,拖拽对象处理
    if (eventObj[0] && eventDrop.init) {
        eventDrop.init(eventObj[0]);
    } else {
        //传递引用
        data.eventHandler(eventObj[1], eventObj[2])
    }
}




//================事件接口====================

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
        checkDefaultBehavior(supportSwipe, data.eventContext);
    }
    //执行事件绑定
    applyEvent(data);
}

//数据库预定义14个事件接口
//提供给content文件
//用于过滤数据库字段指定的行为
//https://github.com/EightMedia/hammer.js/wiki/Getting-Started
//2014.3.18 新增assist 辅助对象事件
export function conversionEventType(eventType) {
    return eventName[Number(eventType) - 1] || null;
}


export function defaultBehavior(element) {
    element && element.attr('data-behavior', 'disable');
}

//销毁对象事件
export function destroyEvents(eventData, eventName) {
    if (eventData.eventReference) {
        eventData.eventReference.off(eventName || eventData.eventName, eventData.eventHandler)
        eventData.eventReference = null;
        eventData.eventHandler = null
    }
}
