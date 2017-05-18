/**
 * 优化hammer创建,生成必要配置文件
 * @return {[type]} [description]
 */
function createRecognizers(eventName) {
  var recognizers = [];
  switch(eventName) {
    //如果是swipe处理
    case 'swipeleft':
    case 'swiperight':
    case 'swipeup':
    case 'swipedown':
      var direction = Hammer.DIRECTION_HORIZONTAL;
      if(eventName === 'swipeup' || eventName === "swipedown") {
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
  if(recognizer && recognizer.length) {
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
export function complexEvent(eventContext, eventName, eventHandler, supportSwipe) {
  var eventReference = createHammer(eventContext, eventName, supportSwipe);
  eventReference.on(eventName, function() {
    eventHandler();
  });
  return eventReference;
}