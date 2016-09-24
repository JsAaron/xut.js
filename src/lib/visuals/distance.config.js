import { config } from '../config/index'
import { hasValue } from '../util/lang'
import { getFlowStyle } from './type.page.config'

/**
 * 下一页是否为flow页面
 * 要根据这个判断来处理翻页的距离
 * @return {[type]} [description]
 */
const checkNextFlow = function(pageIndex) {
    const pageObj = Xut.Presentation.GetPageObj(pageIndex)
    return pageObj && pageObj._isFlows
}


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
    const veiwLeft = config.viewSize.left

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

            //下一页如果是flow页面处理
            //修正 1：viewBeHide = flow页面的宽度
            //     2：hideBeView = 页面的溢出值
            if (checkNextFlow(rightIndex)) {
                const flowstyle = getFlowStyle()
                if (hasValue(flowstyle.flipOverDistance)) {
                    viewBeHide = -flowstyle.newViewWidth
                    hideBeView = -veiwLeft
                }
            } else {
                viewBeHide = -veiwWidth
                hideBeView = distance
            }

            realView = hideBeView

        }
    }

    return [hideBeRemove, viewBeHide, hideBeView, realView]
}
