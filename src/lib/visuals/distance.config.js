import { config } from '../config/index'

/**
 * 动态计算翻页距离
 * @return {[type]} [description]
 */
export default function getFlipDistance({
    action,
    distance,
    direction,
    leftIndex,
    currIndex,
    rightIndex,
} = {}) {

    //当前视图页面
    //用来处理页面翻页的主页确定
    let realView

    //隐藏变删除的页面
    //next: left => hideBeRemove
    //prev: right => hideBeRemove
    let hideBeRemove

    //显示变隐藏的页面
    //next：currIndex => viewBeHide
    //prev：currIndex => viewBeHide
    let viewBeHide

    //隐藏变展示的页面
    let hideBeView

    //默认滑动区域宽度
    const veiwWidth = config.viewSize.width

    //滑动
    if (action === 'flipMove') {
        hideBeRemove = distance - veiwWidth
        hideBeView = distance + veiwWidth
        viewBeHide = distance
    }

    //反弹
    if (action === 'flipRebound') {
        hideBeRemove = -veiwWidth
        viewBeHide = distance;
        hideBeView = veiwWidth
    }

    //翻页
    if (action === 'flipOver') {
        //前翻
        if (direction === 'prev') {
            hideBeRemove = 0
            viewBeHide = veiwWidth
            hideBeView = 2 * veiwWidth
            realView = hideBeRemove
        }
        //后翻
        if (direction === 'next') {
            hideBeRemove = -2 * veiwWidth
            hideBeView = distance
            viewBeHide = -veiwWidth
            realView = hideBeView
        }
    }

    return [hideBeRemove, viewBeHide, hideBeView, realView]
}
