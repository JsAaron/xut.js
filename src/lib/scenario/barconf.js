
import { parseJSON } from '../util/index'

/**
 * 分解工具栏配置文件
 * @return {[type]}          [description]
 */
const parseTooBar = (toolbar, tbType, pageMode) => {
    if (toolbar = parseJSON(toolbar)) {
        //兼容数据库中未指定的情况
        var n = Number(toolbar.pageMode);
        pageMode = _.isFinite(n) ? n : pageMode;
        if (_.isString(toolbar.tbType)) {
            tbType = _.map(toolbar.tbType.split(','), (num) => {
                return Number(num);
            });
        }
    }
    return {
        'tbType': tbType,
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
    let tbType = [1]

    //默认2 允许滑动,带翻页按钮
    let pageMode = pagetotal > 1 ? 2 : 0

    return parseTooBar(toolbar, tbType, pageMode)
}


/**
 * 副场景工具栏配置
 * pageMode 是否支持滑动翻页  0禁止滑动 1允许滑动
 * tbType   工具栏显示的类型 [0-5]
 */
export function pDeputyBar(toolbar, pagetotal) {
    let tbType = [0]
    let pageMode = pagetotal > 1 ? 1 : 0
    return parseTooBar(toolbar, tbType, pageMode)
}
