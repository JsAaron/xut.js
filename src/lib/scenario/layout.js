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
    const calculate = proportion.calculateContainer()

    //横版模式
    const isHorizontal = config.layoutMode == 'horizontal'

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

    const options      = getOptions()
    const sWidth       = options.sWidth
    const sHeight      = options.sHeight
    const iconHeight   = options.iconHeight
    const calculate    = options.calculate
    const isHorizontal = options.isHorizontal

    const navBarWidth     = isHorizontal ? '100%' : Math.min(sWidth, sHeight) / (isIOS ? 8 : 3) + 'px'
    const navBarHeight    = isHorizontal ? round(sHeight / ratio) : round((sHeight - iconHeight - TOP) * 0.96)
    const navBarTop       = isHorizontal ? '' : 'top:' + (iconHeight + TOP + 2) + 'px;'
    const navBarLeft      = isHorizontal ? '' :'left:' + iconHeight + 'px;'
    const navBarBottom    = isHorizontal ? 'bottom:4px;' : ''
    const navBaroOverflow = isHorizontal ? 'hidden' : 'visible'

    //导航
    const navBarHTML =
        `<div class="xut-nav-bar"
              style="width:${navBarWidth};
                     height:${navBarHeight}px;
                     ${navBarTop}
                     ${navBarLeft}
                     ${navBarBottom}
                     background-color:white;
                     border-top:1px solid rgba(0,0,0,0.1);
                     overflow:${navBaroOverflow};">
        </div>`


    const homeWidth = config.viewSize.width
    // const homeHeight = config.viewSize.height
    // const homeTop = calculate.top
    const homeLeft = calculate.left
    const homeIndex = Xut.sceneController.createIndex()
    const homeOverflow = config.scrollPaintingMode ? 'visible' : 'hidden'

    //主体
    const homeHTML =
        `<div id="xut-main-scene"
              class="xut-chapter"
              style="width:${homeWidth}px;
                     height:100%;
                     left:${homeLeft}px;
                     z-index:${homeIndex};
                     overflow:${homeOverflow};">

            <div id="xut-control-bar" class="xut-control-bar"></div>
            <ul id="xut-page-container" class="xut-flip"></ul>
            <ul id="xut-master-container" class="xut-master xut-flip"></ul>
            ${navBarHTML}
            <div id="xut-tool-tip"></div>
        </div>`

    return  String.styleFormat(homeHTML)
}


/**
 * [scene 创建场景]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
export function scene(id) {

    const options   = getOptions()
    const sWidth    = options.sWidth
    const sHeight   = options.sHeight
    const calculate = options.calculate

    const scenarioId = 'scenario-' + id
    const overflow = config.scrollPaintingMode ? 'visible' : 'hidden'
    const pageId =  'scenarioPage-' + id
    const masterId = 'scenarioMaster-' + id

    const html =
        `<div id="${scenarioId}"
              style="width:${config.viewSize.width}px;
                     height:100%;
                     left:${calculate.left}px;
                     z-index:${Xut.sceneController.createIndex()};
                     overflow:{{overflow}};">
            <ul id="${pageId}" class="xut-flip" style="z-index:2"></ul>
            <ul id="${masterId}" class="xut-flip" style="z-index:1"></ul>
        </div>`

    return String.styleFormat(html)
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


/**
 * 获得css配置数据
 * @param  {[type]} seasonlist [description]
 * @return {[type]}            [description]
 */
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
 * 导航菜单
 * @param  {[type]} seasonSqlRet [description]
 * @return {[type]}              [description]
 */
export function navMenu(results) {

    let seasonlist = results.length
    let options    = getWrapper(seasonlist)

    let list = ''
    let seasonId
    let chapterId
    let data
    let xxtlink

    for (let i = 0; i < seasonlist; i++) {
        data      = results[i]
        seasonId  = data.seasonId
        chapterId = data._id
        xxtlink   = seasonId + '-' + chapterId
        list +=
           `<li style="${options.contentstyle}">
                <div data-xxtlink="${xxtlink}">
                    ${i + 1}
                </div>
           </li>`
    }

    //导航
    let navHTML =
        `<div id="xut-nav-wrapper" style="${options.containerstyle}">
            <div style="width:${options.overwidth}px;
                                           height:${options.overHeigth}px;
                                           ${options.scroller}">
                <ul id="xut-nav-section-list">
                    ${list}
                </ul>
            </div>
        </div>`

    return String.styleFormat(navHTML)
}
