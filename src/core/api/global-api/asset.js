import { $setStorage, $getStorage } from '../../util/index'
import { createContentAudio } from '../../component/audio/api'

export function initAsset() {

  //ppt动画需要扩展音频api，所以挂到辅助中
  Xut.Assist.ContentAudioCreate = createContentAudio

  /**
   * 跳转接口
   * @param {[type]} seasonId  [description]
   * @param {[type]} chapterId [description]
   */
  Xut.U3d.View = function(seasonId, chapterId) {
    Xut.View.LoadScenario({
      'seasonId': seasonId,
      'chapterId': chapterId
    })
  }

  /**
   *读取系统中保存的变量的值。
   *如果变量不存在，则新建这个全局变量
   *如果系统中没有保存的值，用默认值进行赋值
   *这个函数，将是创建全局变量的默认函数。
   */
  window.XXTAPI.ReadVar = function(variable, defaultValue) {
    var temp;
    if (temp = $getStorage(variable)) {
      return temp;
    } else {
      $setStorage(variable, defaultValue);
      return defaultValue;
    }
  }

  /**
   * 将变量的值保存起来
   */
  window.XXTAPI.SaveVar = function(variable, value) {
    $setStorage(variable, value)
  }

  /*
   *对变量赋值，然后保存变量的值
   *对于全局变量，这个函数将是主要使用的，替代简单的“=”赋值
   */
  window.XXTAPI.SetVar = function(variable, value) {
    $setStorage(variable, value)
  }

}
