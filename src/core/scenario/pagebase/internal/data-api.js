import { config } from '../../../config/index'

/**
 * 构建模块任务对象
 * taskCallback 每个模块任务完毕后的回调
 * 用于继续往下个任务构建
 */
export default function(baseProto) {

  /**
   * 设置页面容器层级
   * 页面跳转使用接口
   * @return {[type]} [description]
   */
  baseProto.setPageContainerHierarchy = function(style) {
    this.$pageNode.css(style)
  }

  /**
   * 获取文字动画对象
   * 2017.1.6
   * @return {[type]} [description]
   */
  baseProto.getLetterObjs = function(contentId) {
    let activity = this.threadTaskRelated.assignTaskGroup['assgin-activity']
    if (activity && activity.textFxObjs) {
      return activity.textFxObjs[contentId]
    }
  }


  /**
   * 转化序列名
   * @return {[type]} [description]
   */
  baseProto._converSequenceName = function(direction) {
    return direction === 'next' ? 'swipeleft' : 'swiperight'
  }


  /**
   * 是否有动画序列
   */
  baseProto.hasSwipeSequence = function(direction) {
    let eventName = this._converSequenceName(direction)
    let swipeSequence = this.swipeSequence

    //如果执行完毕了
    if (swipeSequence[eventName + 'Index'] === swipeSequence[eventName + 'Total']) {
      return false
    }
    return swipeSequence[eventName].length
  }

  /**
   * 执行动画序列
   * @return {[type]} [description]
   */
  baseProto.callSwipeSequence = function(direction) {
    if (!this.swipeSequence) {
      return
    }
    let eventName = this._converSequenceName(direction)
    let sequence = this.swipeSequence[eventName]
    let callAnimSequence = sequence[this.swipeSequence[eventName + 'Index']]
    if (callAnimSequence) {
      ++this.swipeSequence[eventName + 'Index']
      callAnimSequence() //动画不能在回调中更改状态，因为翻页动作可能在动画没有结束之前，所以会导致翻页卡住
    }
  }


  /**
   * 复位动画序列
   * @param  {[type]} direction [description]
   * @return {[type]}           [description]
   */
  baseProto.resetSwipeSequence = function() {
    if (!this.swipeSequence) {
      return
    }
    this.swipeSequence.swipeleftIndex = 0
    this.swipeSequence.swiperightIndex = 0
  }


  /**
   * 对象实例内部构建
   * 重新实例运行任务
   */
  baseProto.rerunInstanceTask = function(taskName) {
    var tasksObj
    if (tasksObj = this.threadTaskRelated.assignTaskGroup[taskName]) {
      tasksObj.rerunTask && tasksObj.rerunTask()
      return true;
    }
  }


  /**
   * 获取页面数据
   * @return {[type]} [description]
   */
  baseProto.baseData = function() {
    return this.dataActionGroup[this.pageType]
  }


  /**
   * 获取热点数据信息
   * @return {[type]} [description]
   */
  baseProto.baseActivits = function() {
    return this.dataActionGroup['activitys']
  }


  /**
   * 获取自动运行数据
   * @return {[type]} [description]
   */
  baseProto.baseAutoRun = function() {
    const data = this.dataActionGroup['auto']
    return data && data;
  }


  /**
   * 获取chapterid
   * @return {[type]}     [description]
   */
  baseProto.baseGetPageId = function(index) {
    return this.baseData(index)['_id'];
  }


  /**
   * 找到对象的content对象
   * @param  {[type]}   contentId [description]
   * @param  {Function} callback  [description]
   * @return {[type]}             [description]
   */
  baseProto.baseGetContentObject = function(contentId) {
    const contentsObj = this.contentGroup[contentId]
    if (contentsObj) {
      return contentsObj
    }

    //查找浮动母版
    return this.floatGroup.masterGroup[contentId];
  }


  /**
   * Xut.Content.show/hide 针对互斥效果增加接口
   * 扩充，显示，隐藏，动画控制接口
   * @param  {[type]} name [description]
   * @return {[type]}      [description]
   */
  baseProto.baseContentMutex = function(contentId, type) {
    let contentObj
    if (contentObj = this.baseGetContentObject(contentId)) {
      const $contentElement = contentObj.$contentNode.view ?
        contentObj.$contentNode.view :
        contentObj.$contentNode

      const handle = {
        'Show' () {
          if (contentObj.type === 'dom') {
            $contentElement.css({
              'display': 'blcok',
              'visibility': 'visible'
            }).prop("mutex", false);
          } else {
            $contentElement.visible = true;
          }
        },
        'Hide' () {
          if (contentObj.type === 'dom') {
            $contentElement.css({
              'display': 'none',
              'visibility': 'hidden'
            }).prop("mutex", true);
          } else {
            $contentElement.visible = false;
          }
        },
        'StopAnim' () {
          contentObj.stopAnims && contentObj.stopAnims();
        }
      }
      handle[type]()
    }
  }


  //获取Activity对象
  baseProto.baseGetActivity = function(callback) {
    let activitys = this.activityGroup.get();
    if (activitys && activitys.length) {
      if (callback) {
        _.each(activitys, obj => callback(obj))
      } else {
        return activitys
      }
    }
  }


  baseProto.baseSpecifiedContent = function(data) {
    return this.activityGroup.specified(data);
  }


  /**
   * 隐藏li节点
   * @return {[type]} [description]
   */
  baseProto.hide = function() {
    this.$pageNode.hide()
  }

  /**
   * 显示li节点
   * @return {[type]} [description]
   */
  baseProto.show = function() {
    this.$pageNode.show()
  }


  //components零件类型处理
  //baseGetComponent
  //baseRemoveComponent
  //baseAddComponent
  //baseSpecifiedComponent
  _.each([
    "Get",
    "Remove",
    "Add",
    "Specified"
  ], function(type) {
    baseProto['base' + type + 'Component'] = function(data) {
      switch (type) {
        case 'Add':
          return this.componentGroup.add(data);
        case 'Get':
          return this.componentGroup.get();
        case 'Specified':
          return this.componentGroup.specified(data);
        case 'Remove':
          return this.componentGroup.remove();
      }
    }
  })


  /**
   *  运行辅助对象事件
   *  执行运行对象的动画
   *  但是如果提供contentID，那么就是只运行这组序列动画中的
   *  指定contentID的这个动画
   */
  baseProto.baseAssistRun = function(activityId, outCallBack, actionName, contentId) {
    var activity;
    if (activity = this.activityGroup) {
      _.each(activity.get(), function(contentObj, index) {
        if (activityId == contentObj.activityId) {
          if (actionName == 'Run') {
            contentObj.runAnimation(outCallBack, true, contentId);
          }
          if (actionName == 'Stop') {
            contentObj.stopAnimation(outCallBack);
          }
          if (actionName == 'Hide') {
            contentObj.hideAnimation(outCallBack);
          }
        }
      }, this);
    }
  }

}
