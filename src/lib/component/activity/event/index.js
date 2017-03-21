import { config } from '../../../config/index'
import { audioPlayer } from '../../audio/audio'
import { conversionEventType, bindContentEvent } from './event'

export default function(activitProto) {

  /**
   * 构建事件体系
   * 解析出事件类型
   */
  activitProto._initEvents = function() {
    this.eventData.eventName = conversionEventType(this.eventData.eventType);
  }

  /**
   * 找到事件上下文
   * @return {[type]} [description]
   */
  activitProto._findContentName = function(pid, cid, eventId) {
    let contentName
    let eventData = this.eventData

    //dom
    //找到对应绑定事件的元素
    const parseDom = () => {
      contentName = this.makePrefix('Content', pid, cid)
      eventData.type = 'dom';
      eventData.canvasMode = false;
      eventData.domMode = true;
    }

    //canvas模式非常特别
    //canvas容器+内部pixi对象
    //所以事件绑定在最外面
    const parseCanavs = () => {
      contentName = this.makePrefix('canvas', pid, cid)
      eventData.type = 'canvas';
      eventData.canvasMode = true;
      eventData.domMode = false;
    }

    //canvas事件
    if(eventId && -1 !== this.canvasRelated.cid.indexOf(eventId)) {
      parseCanavs()
    } else {
      //dom事件
      parseDom()
    }

    return contentName
  }

  /**
   * 获取事件上下文
   * @return {[type]} [description]
   */
  activitProto._parseEventContext = function() {
    //事件上下文对象
    let eventData = this.eventData
    let eventId = eventData.eventContentId
    let eventContext = eventData.eventContext

    if(eventId) {
      if(!eventContext) {
        //被重写过的事件
        let cid = eventData.rewrite ? eventId : this.id
        let contentName = this._findContentName(this.pid, cid, eventId)
        eventContext = this.getContextNode(contentName)
        eventData.eventContext = eventContext;
      }
      if(eventContext) {
        //绑定事件加入到content钩子
        this.relatedCallback.contentsHooks(this.pid, eventId, {
          $contentNode: eventContext,
          //增加外部判断
          isBindEventHooks: true,
          type: eventData.type
        })
      } else {
        /**
         * 针对动态事件处理
         * 快捷方式引用到父对象
         */
        eventData.parent = this;
      }
    }

    return eventContext
  }

  /**
   * 绑定事件行为
   * @return {[type]} [description]
   */
  activitProto._bindEvents = function(callback) {
    let self = this
    let eventData = this.eventData
    let eventName = eventData.eventName
    let eventContext = this._parseEventContext()

    /**
     * 运行动画
     * @return {[type]} [description]
     */
    const startRunAnim = function() {
      //当前事件对象没有动画的时候才能触发关联动作
      let animOffset
      let boundary = 5 //边界值
      if(eventData.domMode && (animOffset = eventContext.prop('animOffset'))) {
        let originalLeft = animOffset.left;
        let originalTop = animOffset.top;
        let newOffset = eventContext.offset();
        let newLeft = newOffset.left;
        let newTop = newOffset.top;
        //在合理的动画范围是允许点击的
        //比如对象只是一个小范围的内的改变
        //正负10px的移动是允许接受的
        if(originalLeft > (newLeft - boundary) &&
          originalLeft < (newLeft + boundary) || originalTop > (newTop - boundary) &&
          originalTop < (newTop + boundary)) {
          self.runAnimation()
        }
      } else {
        self.runAnimation()
      }
    }

    /**
     * 设置按钮的行为
     * 音频
     * 反弹
     */
    const setBehavior = function(feedbackBehavior) {
      let behaviorSound
        //音频地址
      if(behaviorSound = feedbackBehavior.behaviorSound) {
        //妙妙学客户端强制删除
        if(window.MMXCONFIG && window.audioHandler) {
          self._fixAudio.push(new audioPlayer({
            url: behaviorSound,
            trackId: 9999,
            complete: function() {
              this.play()
            }
          }))
        } else {
          //其余平台,如果存在点击过的
          //这里主要是防止重复点击创建
          let audio = self._cacheBehaviorAudio[behaviorSound]
          if(audio) {
            audio.play()
          } else {
            //相同对象创建一次
            //以后取缓存
            audio = new audioPlayer({
              url: behaviorSound
            })
            self._cacheBehaviorAudio[behaviorSound] = audio
          }
        }
      }

      //反弹效果
      if(feedbackBehavior.isButton) {
        //div通过css实现反弹
        if(eventData.domMode) {
          eventContext.addClass('xut-behavior');
          setTimeout(function() {
            eventContext.removeClass('xut-behavior');
            startRunAnim();
          }, 500)
        } else {
          console.log('feedbackBehavior')
        }
      } else {
        startRunAnim();
      }
    }

    /**
     * 事件引用钩子
     * 用户注册与执行
     */
    const eventDrop = {
      //保存引用,方便直接销毁
      init: function(drag) {
        eventData.dragDrop = drag;
      },
      //拖拽开始的处理
      startRun: function() {

      },
      //拖拽结束的处理
      stopRun: function(isEnter) {
        if(isEnter) { //为true表示拖拽进入目标对象区域
          self.runAnimation();
        }
      }
    }

    /**
     * 正常动画执行
     * 除去拖动拖住外的所有事件
     * 点击,双击,滑动等等....
     */
    const eventRun = function() {

      /*跟踪点击动作*/
      config.hasTrackCode('action', function(notify) {
        /*如果有标记才处理*/
        const contentData = self.relatedData.contentDataset[self.id]
        if(contentData && contentData.trackCode) {
          notify({
            pageId: self.pageId,
            id: self.id,
            type: self.type,
            eventName: eventData.eventName
          })
        }
      })

      //脚本动画
      if(eventData.rewrite) {
        self.runAnimation()
        return
      }
      //如果存在反馈动作
      //优先于动画执行
      const feedbackBehavior = eventData.feedbackBehavior[eventData.eventContentId]
      if(feedbackBehavior) {
        setBehavior(feedbackBehavior)
      } else {
        startRunAnim();
      }
    }


    /**
     * 事件对象引用
     */
    const eventHandler = function(eventReference, eventHandler) {
      eventData.eventReference = eventReference;
      eventData.eventHandler = eventHandler;
    }

    //绑定用户自定义事件
    if(eventContext && eventName) {
      //如果是翻页委托启动了
      //这里处理swiperight与swipeleft
      if(config.swipeDelegate && (eventName === 'swiperight' || eventName === 'swipeleft')) {
        self.relatedCallback.swipeDelegateContents(eventName, (callback) => {
          self.runAnimation(callback)
        })
      }
      //给独立对象绑定事件
      else {

        let domName
        let target
        let dragdropPara

        dragdropPara = eventData.dragdropPara;

        //获取拖拽目标对象
        if(eventName === 'dragTag') {
          domName = this.makePrefix('Content', this.pid, dragdropPara);
          target = this.getContextNode(domName);
        }

        //增加事件绑定标示
        //针对动态加载节点事件的行为过滤
        eventData.isBind = true;

        bindContentEvent({
          target,
          eventName,
          eventRun,
          eventDrop,
          eventHandler,
          eventContext,
          'parameter': dragdropPara,
          'domMode': eventData.domMode
        })
      }
    }
  }

}
