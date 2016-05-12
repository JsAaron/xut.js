/**
 *	创建主容器任务片
 *  state状态
 *   	0 未创建
 *    	1 正常创建
 *     	2 创建完毕
 *      3 创建失败
 */

var prefixStyle = Xut.plat.prefixStyle;

/**
 * 创建父容器li结构
 */
function createContainer(transform, data) {

    var str = '',
        containerBackground = '',
        userStyle = data.userStyle,
        baseData = data.baseData,
        url = baseData.md5;

    var config = Xut.config

    var proportion = config.proportion;
    var calculate = proportion.calculateContainer();
    var sWidth = calculate.width;
    var sHeight = calculate.height;

    //chpater有背景，不是svg格式
    if (!/.svg$/i.test(url)) {
        containerBackground = 'background-image:url(' + config.pathAddress + url + ');'
    }

    function createli(customStyle) {
        customStyle = customStyle ? customStyle : '';
        var str;
        var offsetLeft = 0;
        var pageType = data.pageType;
        if (config.virtualMode) {
            if (data.virtualOffset === 'right') {
                offsetLeft = -(config.screenSize.width - proportion.offsetLeft);
            }
            str = String.format(
                '<li id="{0}" class="xut-flip" data-map="{1}" data-pageType="{2}" data-container="true" style="overflow:hidden;{3}:{4};{5}{6}">' +
                '<div style="width:{7}px;left:{8}px;height:100%;position:relative"></div>' +
                '</li>',
                data.prefix, data.pid, pageType, prefixStyle('transform'), transform, containerBackground, customStyle, sWidth, offsetLeft
            );
        } else {
            str = String.format(
                '<li id="{0}" class="xut-flip" data-map="{1}" data-pageType="{2}" data-container="true" style="overflow:hidden;{3}:{4};{5}{6}"></li>',
                data.prefix, data.pid, pageType, prefixStyle('transform'), transform, containerBackground, customStyle
            );
        }
        return str;
    }

    /**
     * 自定义配置了样式
     * 因为单页面跳槽层级的问题处理
     */
    if (userStyle !== undefined) {
        //解析自定义规则
        var customStyle = '';
        _.each(userStyle, function(value, key) {
            customStyle += key + ':' + value + ';'
        })
        str = createli(customStyle)
    } else {
        str = createli()
    }

    return $(str); //转化成文档碎片
}


export function TaskContainer(data, successCallback) {

    var $element;

    //iboosk编译
    //在执行的时候节点已经存在
    //不需要在创建
    if (Xut.IBooks.runMode()) {
        $element = $("#" + data.prefix);
        successCallback($element, pseudoElement)
        return
    }

    var pseudoElement,
        transform = data.initTransformParameter[0],
        direction = data.initTransformParameter[1],
        //创建的flip结构体
        $element = createContainer(transform, data),
        //创建节点的方向
        direction = direction === 'before' ? 'first' : 'last';

    //如果启动了wordMode模式,查找伪li
    if (Xut.config.virtualMode) {
        pseudoElement = $element.find('div');
    }

    Xut.nextTick({
        container: data.rootNode,
        content: $element,
        position: direction
    }, function() {
        successCallback($element, pseudoElement)
    });
}