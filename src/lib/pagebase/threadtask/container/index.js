/**
 *  创建主容器任务片
 *  state状态
 *      0 未创建
 *      1 正常创建
 *      2 创建完毕
 *      3 创建失败
 */
import { config } from '../../../config/index'
import { hasValue } from '../../../util/lang'

const TANSFROM = Xut.style.transform

/**
 * 创建页面容器li
 */
const createli = function({
    base,
    prefix,
    translate,
    customStyle,
    pageData,
    background
} = {}) {

    const getStyle = base.getStyle

    let offsetLeft = 0
    let virtualNode = ''

    if (config.virtualMode) {
        if (base.virtualOffset === 'right') {
            offsetLeft = -(config.screenSize.width - config.proportion.offsetLeft);
        }
        virtualNode = `<div style="width:${viewWidth}px;left:${offsetLeft}px;height:100%;position:relative"></div>`
    }

    return String.styleFormat(
        `<li id="${prefix}"
            data-id="${pageData._id}"
            data-map="${base.pid}"
            data-pageType="${base.pageType}"
            data-container="true"
            class="xut-flip"
            style="width:${getStyle.viewWidth}px;
                   height:${getStyle.viewHeight}px;
                   top:${getStyle.viewTop}px;
                   left:${getStyle.viewLeft}px;
                   ${TANSFROM}:${translate};
                   ${background}
                   ${customStyle}
                   overflow:hidden;">
            <div data-type="pinch" style="width:100%;height:100%">
                ${virtualNode}
            </div
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
        translate: getStyle.translate,
        customStyle,
        pageData,
        background
    }))
}


export default function(base, pageData, taskCallback) {

    let $pageNode
    let $pseudoElement

    const prefix = base.pageType + "-" + (base.pageIndex + 1) + "-" + base.chapterId
    const getStyle = base.getStyle

    //iboosk编译
    //在执行的时候节点已经存在
    //不需要在创建
    if (Xut.IBooks.runMode()) {
        $pageNode = $("#" + prefix);
        taskCallback($pageNode, $pseudoElement)
        return
    }

    //创建的flip结构体
    $pageNode = createContainer(base, pageData, getStyle, prefix)

    //如果启动了wordMode模式,查找伪li
    if (config.virtualMode) {
        $pseudoElement = $pageNode.find('div');
    }

    Xut.nextTick({
        container: base.$rootNode,
        content: $pageNode,
        position: getStyle.direction === 'before' ? 'first' : 'last'
    }, () => {
        taskCallback($pageNode, $pseudoElement)
    });
}
