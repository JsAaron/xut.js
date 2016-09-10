/**
 * 布局文件
 * 1 控制条
 * 2 导航栏
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
import { config } from '../config/index'

const round = Math.round
const ratio = 6
const isIOS = Xut.plat.isIOS
const TOP = isIOS ? 20 : 0

const getOptions = () => {
    let iconHeight = config.iconHeight
    let proportion = config.proportion
    let calculate = proportion.calculateContainer()
        //横版模式
    let isHorizontal = config.layoutMode == 'horizontal'

    proportion = isHorizontal ? proportion.width : proportion.height
    iconHeight = isIOS ? iconHeight : round(proportion * iconHeight)

    return {
        isHorizontal: isHorizontal,
        iconHeight: iconHeight,
        sWidth: calculate.width,
        sHeight: calculate.height,
        sTop: calculate.top,
        sLeft: calculate.left,
        calculate: calculate,
        proportion: proportion
    }
}

/**
 * 首页布局
 * @return {[type]} [description]
 */
export function home() {

    let options = getOptions()
    let sWidth = options.sWidth
    let sHeight = options.sHeight
    let iconHeight = options.iconHeight
    let calculate = options.calculate
    let isHorizontal = options.isHorizontal

    let html = ''
    let template
    let navBar
    let container

    //导航
    html =
        '<div id="navBar" class="xut-navBar" style="' +
        'width:{{width}};' +
        'height:{{height}}px;' +
        'top:{{top}};' +
        'left:{{left}};' +
        'bottom:{{bottom}};' +
        'background-color:white;' +
        'border-top:1px solid rgba(0,0,0,0.1);' +
        'overflow:{{overflow}};' +
        '"></div>'

    navBar = _.template(html, {
        width: isHorizontal ? '100%' : Math.min(sWidth, sHeight) / (isIOS ? 8 : 3) + 'px',
        height: isHorizontal ? round(sHeight / ratio) : round((sHeight - iconHeight - TOP) * 0.96),
        top: isHorizontal ? '' : (iconHeight + TOP + 2) + 'px',
        left: isHorizontal ? '' : iconHeight + 'px',
        overflow: isHorizontal ? 'hidden' : 'visible',
        bottom: isHorizontal ? '4px' : ''
    })

    //主体
    html =
        '<div id="sceneHome" class="xut-chapter" style="' +
        'width:{{width}}px;' +
        'height:{{height}}px;' +
        'top:{{top}}px;' +
        'left:{{left}}px;' +
        'overflow:hidden;' +
        'z-index:{{index}};' +
        'overflow:{{overflow}};" >' +

        ' <div id="controlBar" class="xut-controlBar hide"></div>' +
        //页面节点
        ' <ol id="pageContainer" class="xut-flip"></ol>' +
        //视觉差包装容器
        ' <ol id="masterContainer" class="xut-master xut-flip"></ol>' +
        //滑动菜单
        ' {{navBar}}' +
        //消息提示框
        ' <div id="toolTip"></div>' +
        '</div>'


    /**
     * 可视区域尺寸
     * @type {Object}
     */
    const viewSize = config.viewSize = {
        width: config.virtualMode ? sWidth / 2 : sWidth,
        height: sHeight
    }

    return _.template(html, {
        width: viewSize.width,
        height: viewSize.height,
        top: calculate.top,
        left: calculate.left,
        index: Xut.sceneController.createIndex(),
        overflow: config.scrollPaintingMode ? 'visible' : 'hidden',
        navBar: navBar
    })
}


/**
 * [scene 创建场景]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
export function scene(id) {

    let options = getOptions()

    let sWidth = options.sWidth
    let sHeight = options.sHeight
    let calculate = options.calculate

    let html =
        '<div id="{{id}}" style="' +
        'width:{{width}}px;' +
        'height:{{height}}px;' +
        'top:{{top}}px;' +
        'left:{{left}}px;' +
        'position:absolute;' +
        'z-index:{{zIndex}};' +
        'overflow:{{overflow}};' +
        '">' +

        ' <ul id="{{pageId}}" class="xut-flip" style="z-index:{{zIndexPage}}"></ul>' +
        ' <ul id="{{masterId}}" class="xut-flip" style="z-index:{{zIndexMaster}}"></ul>' +
        '</div>';


    return _.template(html, {
        id: 'scenario-' + id,
        width: config.viewSize.width,
        height: config.viewSize.height,
        top: calculate.top,
        left: calculate.left,
        zIndex: Xut.sceneController.createIndex(),
        overflow: config.scrollPaintingMode ? 'visible' : 'hidden',
        pageId: 'scenarioPage-' + id,
        zIndexPage: 2,
        masterId: 'scenarioMaster-' + id,
        zIndexMaster: 1
    })

}


const getNavOptions = () => {

    //导航菜单宽高
    let navHeight, navWidth
    let options = getOptions()
    let sWidth = options.sWidth
    let sHeight = options.sHeight
    let proportion = options.proportion
    let isHorizontal = options.isHorizontal

    //横版模版
    if (isHorizontal) {
        navHeight = round(sHeight / ratio)
    } else {
        navWidth = Math.min(sWidth, sHeight) / (isIOS ? 8 : 3)
        navHeight = round((sHeight - options.iconHeight - TOP) * 0.96)
    }

    return {
        sWidth: sWidth,
        sHeight: sHeight,
        navHeight: navHeight,
        navWidth: navWidth,
        proportion: proportion
    }

}


//获得css配置数据
const getWrapper = (seasonlist) => {

    let width, height, blank, scroller, contentstyle, containerstyle, overwidth, overHeigth

    //获得css配置数据
    let options = getNavOptions()
    let font = round(options.proportion * 2)

    let navWidth = options.navWidth
    let navHeight = options.navHeight
    let sWidth = options.sWidth
    let sHeight = options.sHeight

    if (config.layoutMode == 'horizontal') {
        height = round(navHeight * 0.9);
        width = round(height * sWidth / sHeight); //保持缩略图的宽高比
        blank = round(navHeight * 0.05); //缩略图之间的间距
        scroller = 'width:' + seasonlist * (width + blank) + 'px>';
        contentstyle = 'float:left;width:' + width + 'px;height:' + height + 'px;margin-left:' + blank + 'px';
        containerstyle = 'width:96%;height:' + height + 'px;margin:' + blank + 'px auto;font-size:' + font + 'em';
        //横版左右滑动
        //溢出长度+上偏移量
        overwidth = (width * seasonlist) + (seasonlist * blank)
    } else {
        width = round(navWidth * 0.9);
        height = round(navWidth * 1.1);
        blank = round(navWidth * 0.05);
        contentstyle = 'width:' + width + 'px;height:' + height + 'px;margin:' + blank + 'px auto;border-bottom:1px solid rgba(0,0,0,0.3)';
        containerstyle = 'height:' + (navHeight - 4) + 'px;overflow:hidden;margin:2px auto;font-size:' + font + 'em';
        //竖版上下滑动
        overHeigth = (height * seasonlist) + (seasonlist * blank)
    }

    return {
        contentstyle: contentstyle,
        containerstyle: containerstyle,
        overwidth: overwidth,
        overHeigth: overHeigth,
        scroller: scroller
    }
}

/**
 * [nav 导航菜单]
 * @param  {[type]} seasonSqlRet [description]
 * @return {[type]}              [description]
 */
export function nav(seasonSqlRet) {

    let seasonId, chapterId, data, xxtlink
    let seasonlist = seasonSqlRet.length
    let options = getWrapper(seasonlist)

    let list = ''
    let i = 0

    for (i; i < seasonlist; i++) {
        data = seasonSqlRet[i];
        seasonId = data.seasonId;
        chapterId = data._id;
        xxtlink = seasonId + '-' + chapterId;
        list += '<li style="' + options.contentstyle + '">';
        list += '  <div class="xut-navBar-box" data-xxtlink = "' + xxtlink + '">' + (i + 1) + '</div>';
        list += '</li>';
    }

    //导航
    let html =
        '<div id="SectionWrapper" style="{{style}}">' +
        '  <div id="Sectionscroller" style="width:{{width}}px;height:{{height}}px;{{scroller}}">' +
        '    <ul id="SectionThelist">' +
        '       {{list}}' +
        '    </ul>' +
        '  </div>' +
        '</div>'

    return _.template(html, {
        style: options.containerstyle,
        width: options.overwidth,
        height: options.overHeigth,
        scroller: options.scroller,
        list: list
    })
}
