//========================
// 录音接口相关
//========================

/**
 * 是否存在音频插件
 * @return {Boolean} [description]
 */
function hasRecordPlugin(callback, id) {
  if (window.cordova && Xut.Plugin.Recorder) {
    callback(`${Xut.config.data.originalAppId}-${id}`)
  }
}


export function extendRecord(access, $$globalSwiper) {

  //开始录音
  //用于翻页判断是否关闭
  let startRecord = false

  //记录上一个录音的成功回调
  //用于处理直接跳转的接口
  let currentSucceedCallback = null

  //录音播放的id
  let recordPlayId = null

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
    if (callback) {
      callback();
    }
    setTimeout(function() {
      //执行当前成功的回调
      currentSucceedCallback && currentSucceedCallback()
    }, 1000)
  }

  /**
   * 重复录音
   * 自动定位到当前失败的录音上
   * callback 是成功回调的关闭
   */
  Xut.Assist.RecordRepeat = function(callback) {
    //执行自己的隐藏
    callback && callback()
    // Xut.Assist.Run(12)
    console.log(2)
  }

  // Xut.Assist.RecordStart(id, {
  //   succeed: function() {
  //     Xut.Assist.Run(1)
  //   },
  //   fail: function() {
  //     Xut.Assist.Run(2)
  //   }
  // })
  Xut.Assist.RecordStart = function(id, callback = {}) {
    if (!id) {
      Xut.$warn('record', `没有传递录音的编号id,id:${id}`)
      return
    }
    hasRecordPlugin(function(onlyId) {
      Xut.Assist.RecordStop()
      //保存成功回调
      if (callback.succeed) {
        currentSucceedCallback = callback.succeed
      }
      Xut.$warn('record', `开始录音,id:${onlyId}`)
      startRecord = true
      Xut.Plugin.Recorder.startRecord(onlyId, function() {
        //成功
        startRecord = false
        Xut.$warn('record', `录音完成,id:${onlyId}`)
        callback.succeed && callback.succeed()
      }, function() {
        //失败
        startRecord = false
        Xut.$warn('record', `录音失败,id:${onlyId}`)
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
  Xut.Assist.RecordStop = function() {
    //翻页清空
    currentSucceedCallback = null
    if (startRecord) {
      hasRecordPlugin(function() {
        Xut.$warn('record', `录音停止`)
        startRecord = false
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
      Xut.$warn('record', `没有传递播放录音的编号id:${id}`)
      return
    }
    hasRecordPlugin(function(onlyId) {
      //如果上一个还在播，先停止，保持只播一个
      if (recordPlayId) {
        Xut.Assist.RecordPlayStop(id)
      }
      recordPlayId = id
      Xut.$warn('record', `播放录音,id:${onlyId}`)
      Xut.Plugin.Recorder.startPlay(onlyId, function() {
        recordPlayId = null
      }, function() {
        recordPlayId = null
        Xut.$warn('record', `播放录音失败,播放可能存在的默认回调:${onlyId}`)
        failCallback && failCallback()
      })
    }, id)
  }

  /**
   * 播放停止
   */
  Xut.Assist.RecordPlayStop = function(id) {
    //停止指定的，或者之前播放的
    id = id || recordPlayId
    if (!id) {
      Xut.$warn('record', `没有传递停止播放录音的编号id:${id}`)
      return
    }
    hasRecordPlugin(function(onlyId) {
      recordPlayId = null
      Xut.$warn('record', `播放录音停止,id:${onlyId}`)
      Xut.Plugin.Recorder.stopPlay(onlyId)
    }, id)
  }

}
