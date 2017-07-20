/**
 * 多事件模块
 */
import {
  conversionEventType,
  bindContentEvent,
  destroyContentEvent
}
from '../../../component/activity/event/event'


/**
 * 获取对应的activity对象
 * @param  {[type]}   activityId [description]
 * @param  {Function} callback   [description]
 * @return {[type]}              [description]
 */
const getActivity = function(activityId, callback) {
  var activity;
  if (activity = this.activityGroup) {
    _.each(activity.get(), function(contentObj, index) {
      if (activityId == contentObj.activityId) {
        callback(contentObj)
        return;
      }
    }, this);
  }
}


/**
 * 制作一个处理绑定函数
 * @param  {[type]} pagebase [description]
 * @return {[type]}          [description]
 */
const makeRunBinding = function(pagebase) {
  var registers = this.registers;
  var shift;
  return function() {
    var activityId = registers[0];
    getActivity.call(pagebase, activityId, function(activityObj) {
      activityObj.runAnimation(function() {
        shift = registers.shift();
        registers.push(shift);
      })
    })
  }
}


/**
 * 多事件处理
 * 每次通过同一个热点,触发不同的对象操作
 * @return {[type]} [description]
 */
const combineEvents = function(pagebase, eventRelated) {
  var contentObj, eventName;
  //多条activty数据,一个对象上多事件
  _.each(eventRelated, function(edata) {
    _.each(edata, function(scope) {
      contentObj = pagebase.baseGetContentObject(scope.eventContentId)
      if (!contentObj) {
        // console.log('error', 'pagebase.js第' + pagebase.pageIndex + '页多事件处理出错!!!!')
        return
      }
      eventName = conversionEventType(scope.eventType);
      //制动运行动作
      scope.runAnimation = makeRunBinding.call(scope, pagebase);
      //销毁方法
      scope.destroy = function() {
        destroyContentEvent(scope, eventName);
        scope.registers = null
        scope.runAnimation = null;
      }

      //事件绑定
      bindContentEvent({
        'eventRun': function() {
          scope.runAnimation();
        },
        'eventHandler': function(eventReference, eventHandler) {
          scope.eventReference = eventReference;
          scope.eventHandler = eventHandler;
        },
        'eventContext': contentObj.$contentNode,
        'eventName': eventName,
        'parameter': scope.dragdropPara,
        'target': null,
        'domMode': true
      })
    })

    //暴露引用
    pagebase.divertorHooks.registerEvent = eventRelated;
  })
}



export function create(pagebase, eventRelated) {
  combineEvents(pagebase, eventRelated);
}


export function destroy(pagebase) {
  const registerEvent = pagebase.divertorHooks.registerEvent
  if (registerEvent) {
    _.each(registerEvent, function(edata) {
      _.each(edata, function(obj) {
        obj.destroy && obj.destroy();
      })
    })
    pagebase.divertorHooks.registerEvent = null;
  }
}
