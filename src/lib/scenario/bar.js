import { parseJSON } from '../util/index'

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
 * @return {[type]}          [description]
 */
const parseTooBar = (toolbar, toolType, pageMode) => {
    if (toolbar = parseJSON(toolbar)) {
        //兼容数据库中未指定的情况
        var n = Number(toolbar.pageMode)
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
 * @param  {[type]} scenarioId [description]
 * @return {[type]}            [description]
 */
export function pMainBar(scenarioId) {
    let sectionRang = Xut.data.query('sectionRelated', scenarioId)

    //场景工具栏配置信息
    let toolbar = sectionRang.toolbar
    let pagetotal = sectionRang.length

    //默认显示系统工具栏
    let toolType = [1]

    //默认2 允许滑动,带翻页按钮
    let pageMode = pagetotal > 1 ? 2 : 0

    return parseTooBar(toolbar, toolType, pageMode)
}


/**
 * 副场景工具栏配置
 * pageMode 是否支持滑动翻页  0禁止滑动 1允许滑动
 * toolType   工具栏显示的类型 [0-5]
 */
export function pDeputyBar(toolbar, pagetotal) {
    let toolType = [0]
    let pageMode = pagetotal > 1 ? 1 : 0
    return parseTooBar(toolbar, toolType, pageMode)
}
