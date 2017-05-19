import { config } from '../../config/index'

/**
 * 获取母版页面的visualMode设置
 * 覆盖全局的设置
 * 预先抽出母版上的页面模式定义
 * 定义visualMode：1/2/3/4 覆盖全局页面模式
 * 母版关联的页面必须跟这个参数统一
 * @return {[type]} [description]
 */
export function getVisualMode(chapterData) {

  //反向模式设置
  //如果是全局模式1，并且是竖向横显示
  if(config.launch.visualMode === 1 && config.verticalToHorizontalVisual) {
    return 1
  }

  //flow页面返回1
  if(chapterData.note === 'flow') {
    return 1
  }

  //如果有独立的页面模式
  let parameter = chapterData.parameter
  if(parameter) {
    let matchMode = parameter.match(/visualMode[":\s]*(\d)/)
    if(matchMode) {
      return Number(matchMode[1])
    }
  }

  //返回全局页面模式
  return config.launch.visualMode || 1
}
