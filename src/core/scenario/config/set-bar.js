import { parseJSON } from '../../util/index'

/**
 *
 * 配置工具栏行为
 *  1.  工具栏类型
 *  tbType：(如果用户没有选择任何工具栏信息处理，tbType字段就为空)
 *   0  禁止工具栏
 *   1  系统工具栏   - 显示IOS系统工具栏
 *   2  场景工具栏   - 显示关闭按钮
 *   3  场景工具栏   - 显示返回按钮
 *   4  场景工具栏   - 显示顶部小圆点式标示
 *
 *  2.  翻页模式
 *  pageMode：(如果用户没有选择任何处理，pageMode字段就为空)
 *   0 禁止滑动
 *   1 允许滑动无翻页按钮
 *   2 允许滑动带翻页按钮
 *
 * @return {[type]} [description]
 */

/**
 * 分解工具栏配置文件
 */
function parseTooBar(toolbar, toolType, pageMode) {
  if (toolbar = parseJSON(toolbar)) {
    //兼容数据库中未指定的情况
    let n = Number(toolbar.pageMode)
    pageMode = _.isFinite(n) ? n : pageMode;
    if (_.isString(toolbar.tbType)) {
      toolType = _.map(toolbar.tbType.split(','), (num) => {
        return Number(num);
      })
    }
  }
  return {
    'toolType': toolType,
    'pageMode': pageMode
  }
}


/**
 * 主场景工具栏配置
 * pageMode:默认2 允许滑动,带翻页按钮
 */
export function getMainBar(seasonId) {
  const related = Xut.data.query('sectionRelated', seasonId)

  //默认显示系统工具栏
  const toolType = [1]

  /*如果有多页面，就允许滑动，带翻页按钮
    如果没有多页面，0禁止滑动*/
  const pageMode = related.length > 1 ? 2 : 0
  return parseTooBar(related.toolbar, toolType, pageMode)
}


/**
 * 副场景工具栏配置
 * pageMode 是否支持滑动翻页  0禁止滑动 1允许滑动
 * toolType   工具栏显示的类型 [0-5]
 */
export function getDeputyBar(toolbar, totalCount) {
  const toolType = [0]

  /*如果有多页面，就允许滑动，但是不带翻页按钮
    如果没有多页面，0禁止滑动*/
  const pageMode = totalCount > 1 ? 1 : 0
  return parseTooBar(toolbar, toolType, pageMode)
}


