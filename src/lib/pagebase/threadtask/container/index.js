/**
 *  创建主容器任务片
 *  state状态
 *      0 未创建
 *      1 正常创建
 *      2 创建完毕
 *      3 创建失败
 */
import { config } from '../../../config/index'
import nextTick from '../../../core/tick'

const prefixStyle = Xut.plat.prefixStyle;

const createli = function({
    data,
    transform,
    customStyle,
    containerBackground
} = {}) {

    let html
    let offsetLeft = 0
    let proportion = config.proportion
    let calculate = proportion.calculateContainer()
    let sWidth = calculate.width
    let pageType = data.pageType
    let virtualMode = config.virtualMode
    let virtualNode = ''

    if (virtualMode) {
        if (data.virtualOffset === 'right') {
            offsetLeft = -(config.screenSize.width - proportion.offsetLeft);
        }
        virtualNode =
            '<div style=' +
            '"' +
            'width:{{sWidth}}px;' +
            'left:{{offsetLeft}}px;' +
            'height:100%;' +
            'position:relative' +
            '">' +
            '</div>'

        virtualNode = _.template(virtualNode, {
            sWidth: sWidth,
            offsetLeft: offsetLeft
        })
    }

    html =
        '<li ' +
        'id="{{id}}" ' +
        'class="xut-flip" ' +
        'data-map="{{pid}}" ' +
        'data-pageType="{{pageType}}" ' +
        'data-container="true" ' +
        'style="overflow:hidden;{{prefixStyle}}:{{transform}};{{containerBackground}}{{customStyle}}">' +
        '{{virtualNode}}' +
        '</li>'

    return _.template(html, {
        id: data.prefix,
        pid: data.pid,
        pageType: pageType,
        prefixStyle: prefixStyle('transform'),
        transform: transform,
        containerBackground: containerBackground,
        customStyle: customStyle,
        virtualNode: virtualNode
    })
}


/**
 * 创建父容器li结构
 */
const createContainer = (transform, data) => {

    let containerBackground = ''
    let userStyle = data.userStyle
    let baseData = data.baseData
    let url = baseData.md5

    //chpater有背景，不是svg格式
    if (!/.svg$/i.test(url)) {
        containerBackground = 'background-image:url(' + config.pathAddress + url + ');'
    }

    /**
     * 自定义配置了样式
     * 因为单页面跳槽层级的问题处理
     */
    let customStyle = '';
    if (userStyle !== undefined) {
        //解析自定义规则
        _.each(userStyle, (value, key) => {
            customStyle += key + ':' + value + ';'
        })
    }

    return $(createli({
        data,
        transform,
        customStyle,
        containerBackground
    }))
}


export default function(data, successCallback) {

    let $element, pseudoElement, direction, transform

    //iboosk编译
    //在执行的时候节点已经存在
    //不需要在创建
    if (Xut.IBooks.runMode()) {
        $element = $("#" + data.prefix);
        successCallback($element, pseudoElement)
        return
    }

    transform = data.initTransformParameter[0]
    direction = data.initTransformParameter[1]

    //创建的flip结构体
    $element = createContainer(transform, data)

    //如果启动了wordMode模式,查找伪li
    if (Xut.config.virtualMode) {
        pseudoElement = $element.find('div');
    }

    nextTick({
        container: data.rootNode,
        content: $element,
        position: direction === 'before' ? 'first' : 'last'
    }, () => {
        successCallback($element, pseudoElement)
    });
}
