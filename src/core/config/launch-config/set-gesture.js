import { config } from '../../config/index'
import { parseJSON } from '../../util/lang'

/**
 * 通过数据库的定义
 * 设置用户是否允许翻页
 * 设置手势gestureSwipe
 * @return {[type]} [description]
 */
export default function setGestureSwipe(novelData) {

  /**
   * 切换切换模式
   * 多模式判断
   * 如果
   *   缓存存在
   *   否则数据库解析
         全局翻页模式
         0 滑动翻页 =》true
         1 直接换  =》 false
   * 所以pageFlip只有在左面的情况下
   * @type {Boolean}
   */
  if (novelData.parameter) {
    const parameter = parseJSON(novelData.parameter)
    /*全局优先设置覆盖*/
    if (config.launch.gestureSwipe === undefined && parameter.pageflip !== undefined) {
      switch (Number(parameter.pageflip)) {
        case 0: //滑动翻页
          config.launch.gestureSwipe = true
          break;
        case 1: //直接换
          config.launch.pageFlip = true
          config.launch.gestureSwipe = false
          break
      }
    }
  }

  /*默认不锁定页面，支持手势滑动*/
  if (config.launch.gestureSwipe === undefined) {
    config.launch.gestureSwipe = true
  }

}
