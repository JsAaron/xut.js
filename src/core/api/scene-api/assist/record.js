//========================
// 录音接口相关
//========================
import { removeArray } from '../../../util/lang'

/**
 * 是否存在音频插件
 * @return {Boolean} [description]
 */
function hasRecordPlugin(callback, id) {
  //iframe模式下插件的查找
  if (GLOBALIFRAME) {
    if (GLOBALCONTEXT.Recorder) {
      callback(`${Xut.config.data.originalAppId}-${id}`)
    }
    return
  }
  //单独apk情况下
  if (window.cordova && Xut.Plugin.Recorder) {
    callback(`${Xut.config.data.originalAppId}-${id}`)
  }
}



export function extendRecord(access, $$globalSwiper) {

  //正在录音中
  let recording = false
  //下一个动作的回调
  let currentNextCallback = null
  //当前运行的重复执行方法
  let cuurentRepeatCallback = null
  //播放的id合集
  let playIds = []

  /**
   * 给录音的回调动作
   * 增加一个当前页面接管的全局接口
   * 意思就是用户再不录音的情况下，失败的动作中
   * 会弹出一个可以继续往下走的动作，而不会造成死循环
   * 跳到下一个默认录音动作
   * 这样代码默认会绑定最后一个录音的成功动作
   */
  Xut.Assist.RecordNextAction = function(callback) {
    //执行自己的隐藏
    callback && callback()
    if (currentNextCallback) {
      setTimeout(function() {
        //执行当前成功的回调
        currentNextCallback()
      }, 1000)
    } else {
      Xut.$warn('record', `没有currentSucceedCallback,无法继续下个动画`)
    }
  }

  /**
   * 重复录音
   * 自动定位到当前失败的录音上
   * callback 是成功回调的关闭
   */
  Xut.Assist.RecordRepeat = function(callback) {
    //执行自己的隐藏
    callback && callback()
    if (cuurentRepeatCallback) {
      setTimeout(function() {
        //执行当前成功的回调
        cuurentRepeatCallback()
      }, 500)
    } else {
      Xut.$warn('record', `没有cuurentRepeatCallback,无法重复当前动画`)
    }
  }


  /**
   * 脚本函数
   * 1:id
   * 2:提供成功与失败回调
   * 3：injectFn可以注入处理函数
   * Xut.Assist.RecordStart(id, {
   *   succeed: function() {
   *     Xut.Assist.Run(1)
   *   },
   *   fail: function() {
   *     Xut.Assist.Run(2)
   *   }
   * })
   */
  Xut.Assist.RecordStart = function(injectFn, id, callback = {}) {

    if (!injectFn) {
      Xut.$warn('record', `没有传递录音的必要数据${injectFn}`)
      return
    }

    //如果不通过ppt处理，那么只会传递2个参数
    //如果只传递了2个参数id/callback
    if (typeof injectFn !== 'function') {
      let a = id
      id = injectFn
      callback = a
    }


    hasRecordPlugin(function(newId) {
      Xut.Assist.RecordStop(function() {
        Xut.$warn('record', `当前有音频在录制，先强制停止`)
      })
      Xut.$warn('record', `开始录音,id:${newId}`)
      //如果有执行成功回调
      if (callback.succeed) {
        currentNextCallback = callback.succeed
      }
      //如果有注入重新运行的回调
      if (injectFn) {
        cuurentRepeatCallback = injectFn
      }
      recording = true
      Xut.Plugin.Recorder.startRecord(newId,
        //成功
        function() {
          recording = false
          Xut.$warn('record', `录音完成,id:${newId}`)
          callback.succeed && callback.succeed()
        },
        function() {
          //失败
          recording = false
          Xut.$warn('record', `录音失败,id:${newId}`)
          callback.fail && callback.fail()
        })
    }, id)
  }

  /**
   * 停止录音
   * 每次翻页都会调用一次
   * 1 清空记录
   * 2 判断如果还有录音的，强制停止
   */
  Xut.Assist.RecordStop = function(callback) {
    //翻页清空
    currentNextCallback = null
    cuurentRepeatCallback = null
    if (recording) {
      hasRecordPlugin(function() {
        callback && callback
        recording = false
        Xut.Plugin.Recorder.stopRecord()
      })
    }
  }


  /**
   * 播放录音
   * failCallback 播放录音失败回调
   * 播放成功与播放失败
   */
  Xut.Assist.RecordPlay = function(id, failCallback) {
    if (!id) {
      Xut.$warn('record', `播放录音失败,缺少id:${id}`)
      return
    }
    hasRecordPlugin(function(newId) {
      //如果上一个还在播，先停止，保持只播一个
      Xut.Assist.RecordPlayStop()
      playIds.push(newId)
      Xut.$warn('record', `播放录音,id:${newId}`)
      Xut.Plugin.Recorder.startPlay(newId, function() {
        removeArray(playIds, newId)
        Xut.$warn('record', `播放录音成功:${newId},id合集编号:${playIds.toString()},数量:${playIds.length}`)
      }, function() {
        Xut.$warn('record', `播放录音失败,id合集编号:${playIds.toString()}`)
        removeArray(playIds, newId)
        failCallback && failCallback()
      })
    }, id)
  }

  /**
   * 播放停止
   * ids  一个或者数组
   * 1 播放之前停止
   * 2 翻页停止
   * 3 强制停止
   */
  Xut.Assist.RecordPlayStop = function(id) {
    //强制停止,传递是外部接口的直接id
    if (id) {
      hasRecordPlugin(function(newId) {
        if (!newId) {
          Xut.$warn('record', `停止录音失败,缺少id:${id}`)
          return
        }
        removeArray(playIds, newId)
        Xut.$warn('record', `播放录音停止,id:${newId}`)
        Xut.Plugin.Recorder.stopPlay(newId)
      }, id)
    } else if (playIds.length) {
      Xut.$warn('record', `停止播放音乐,id合集编号:${playIds.toString()},数量:${playIds.length}`)
      //翻页停止，或者播放之前停止，传递是封装后的id
      hasRecordPlugin(function() {
        playIds.forEach(function(newId) {
          Xut.$warn('record', `播放录音停止,id:${newId}`)
          Xut.Plugin.Recorder.stopPlay(newId)
          removeArray(playIds, newId)
        })
      })
    }
  }

}
