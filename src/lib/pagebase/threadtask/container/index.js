/**
 *  创建主容器任务片
 *  state状态
 *      0 未创建
 *      1 正常创建
 *      2 创建完毕
 *      3 创建失败
 */
import { config } from '../../../config/index'
import nextTick from '../../../util/nexttick'
import { hasValue } from '../../../util/lang'

const TANSFROM = Xut.style.transform

/**
 * 创建页面容器li
 */
const createli = function({
    base,
    prefix,
    transform,
    customStyle,
    pageData,
    background
} = {}) {

    let offsetLeft = 0
    let virtualNode = ''

    const proportion = config.proportion
    const viewSize = config.viewSize

    let viewWidth = viewSize.width
    let viewHeight = viewSize.height
    let viewTop = viewSize.top
    let viewLeft = 0

    if (config.virtualMode) {
        if (base.virtualOffset === 'right') {
            offsetLeft = -(config.screenSize.width - proportion.offsetLeft);
        }
        virtualNode = `<div style="width:${viewWidth}px;left:${offsetLeft}px;height:100%;position:relative"></div>`
    }

    //自动配置样式
    //提供创建样式覆盖
    const getStyle = base.getStyle
    if (hasValue(getStyle.newViewWidth)) {
        viewWidth = getStyle.newViewWidth
    }
    if (hasValue(getStyle.newViewHeight)) {
        viewHeight = getStyle.newViewHeight
    }
    if (hasValue(getStyle.newViewTop)) {
        viewTop = getStyle.newViewTop
    }
    if (hasValue(getStyle.newViewLeft)) {
        viewLeft = getStyle.newViewLeft
    }

    return String.styleFormat(
        `<li id="${prefix}"
            data-id="${pageData._id}"
            data-map="${base.pid}"
            data-pageType="${base.pageType}"
            data-container="true"
            class="xut-flip"
            style="width:${viewWidth}px;
                   height:${viewHeight}px;
                   top:${viewTop}px;
                   left:${viewLeft}px;
                   ${TANSFROM}:${transform};
                   ${background}
                   ${customStyle}
                   overflow:hidden;">
            ${virtualNode}
        </li>`
    )
}


/**
 * 创建父容器li结构
 */
const createContainer = (base, pageData, getStyle, prefix) => {

    let background = ''

    //chpater有背景，不是svg格式
    if (!/.svg$/i.test(pageData.md5)) {
        background = 'background-image:url(' + config.pathAddress + pageData.md5 + ');'
    }

    /**
     * 自定义配置了样式
     * 因为单页面跳槽层级的问题处理
     */
    let customStyle = ''
    let userStyle = getStyle.userStyle
    if (userStyle !== undefined) {
        //解析自定义规则
        _.each(userStyle, (value, key) => {
            customStyle += key + ':' + value + ';'
        })
    }

    return $(createli({
        base,
        prefix,
        transform: getStyle.transforms[0],
        customStyle,
        pageData,
        background
    }))
}


/**
 *'rootNode'      : base.root,
 *'prefix'        : base.pageType + "-" + (base.pageIndex + 1) + "-" + base.chapterId,
 *'pageType'      : base.pageType,
 *'pid'           : base.pid,
 *'baseData'      : pageData,
 *'virtualOffset' : base.virtualOffset,
 *'userStyle'     : base.userStyle, //创建自定义style
 *'isFlows'       : base._isFlows //如果是flows页面
 **/
export default function(base, pageData, taskCallback) {

    let $element, pseudoElement

    const prefix = base.pageType + "-" + (base.pageIndex + 1) + "-" + base.chapterId
    const getStyle = base.getStyle

    //iboosk编译
    //在执行的时候节点已经存在
    //不需要在创建
    if (Xut.IBooks.runMode()) {
        $element = $("#" + prefix);
        taskCallback($element, pseudoElement)
        return
    }

    //创建的flip结构体
    $element = createContainer(base, pageData, getStyle, prefix)

    //如果启动了wordMode模式,查找伪li
    if (config.virtualMode) {
        pseudoElement = $element.find('div');
    }

    nextTick({
        container: base.root,
        content: $element,
        position: getStyle.transforms[1] === 'before' ? 'first' : 'last'
    }, () => {
        taskCallback($element, pseudoElement)
    });
}
