/********************************************
 * 场景API
 * 辅助对象
 ********************************************/
import { extendRecord } from './record'
import { extendGlobal } from './global'
import { extendAnswer } from './answer'

export function extendAssist(access, $$globalSwiper) {

  //录音接口相关
  extendRecord(access, $$globalSwiper)
  //继承全局接口相关
  extendGlobal(access, $$globalSwiper)
  //继承答题接口
  extendAnswer(access, $$globalSwiper)

  //========================
  //  其他平台接口
  //========================

  /**
   * 允许翻页
   */
  //最大的翻页索引标记
  //这个是顺序
  let maxFlipIndex = 0
  Xut.Assist.EnableFlip = function() {
    let pageIndex = Xut.Presentation.GetPageIndex()
    if (pageIndex > maxFlipIndex) {
      maxFlipIndex = pageIndex
      Xut.Application.Notify('enableFlip', maxFlipIndex)
    }
  }

  /**
   * 滤镜渐变动画
   * content id
   * 滤镜样式名
   * 1  ".filter-blur-a2"
   * 优先查找page层，后查找master层
   */
  Xut.Assist.FilterGradient = function(contentId, filterClassName) {
    if (contentId && filterClassName) {
      let contentObj = Xut.Contents.Get('page', contentId)
      if (!contentObj) {
        contentObj = Xut.Contents.Get('master', contentId)
        if (contentObj) return
      }
      if (filterClassName.length) {
        filterClassName = filterClassName.join(' ')
      }
      contentObj.$contentNode.addClass(filterClassName)
    }
  }

  /**
   * 针对HOT的显示与隐藏
   * @param {[type]} activityId    [activity中的Id]
   * @param {[type]} start         [显示与隐藏]
   *     Xut.Assist.TriggerPoint(activityId, 'show')
         Xut.Assist.TriggerPoint(activityId, 'hide')
   */
  Xut.Assist.TriggerPoint = function(activityId, state) {
    const data = Xut.data.query('Activity', activityId);
    if (data) {
      const $dom = $(`#${data.actType}_${data._id}`)
      if ($dom.length) {
        if (state === 'show') {
          Xut.nextTick(() => {
            $dom.css('visibility', 'visible')
          })
        }
        if (state === 'hide') {
          $dom.css('visibility', 'hidden')
        }
      }
    }
  }

  /**
   * 文字动画
   * @param {[type]} contentId [description]
   */
  Xut.Assist.TextFx = function(contentId) {
    const pageObj = Xut.Presentation.GetPageBase()
    const fxObj = pageObj.getLetterObjs(contentId)
    if (fxObj) {
      fxObj.play()
    }
  }

  /**
   * 辅助对象的控制接口
   * 运行辅助动画
   * 辅助对象的activityId,或者合集activityId
   * Run
   * stop
   * Hide隐藏动画元素
   * 1 零件
   * 2 音频动画
   */
  _.each([
    "Run",
    "Stop",
    "Hide"
  ], function(apiName) {
    Xut.Assist[apiName] = function(pageType, activityId, outCallBack) {
      access(function(manager, pageType, activityId, outCallBack) {
        function assistAppoint(id, callback) {
          manager.assistAppoint(
            Number(id),
            $$globalSwiper.getVisualIndex(),
            callback,
            apiName
          );
        }

        //数组
        if (_.isArray(activityId)) {
          let markComplete = function() {
            let completeStatistics = activityId.length; //动画完成统计
            return function() {
              if (completeStatistics === 1) {
                outCallBack && outCallBack();
                markComplete = null;
              }
              completeStatistics--;
            }
          }();
          _.each(activityId, function(id) {
            assistAppoint(id, markComplete)
          })
        } else {
          assistAppoint(activityId, outCallBack)
        }
      }, pageType, activityId, outCallBack)
    }
  })


}
