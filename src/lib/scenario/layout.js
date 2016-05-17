/**
 * 布局文件
 * 1 控制条
 * 2 导航栏
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
let config
let round
let ratio
let isIOS
let iconHeight
let proportion
let calculate
let TOP
let sWidth
let sHeight
let navHeight //菜单的高度
let navWidth //菜单的宽度

function setOption() {
    config = Xut.config
    round = Math.round
    ratio = 6
    isIOS = Xut.plat.isIOS
    iconHeight = config.iconHeight
    proportion = config.proportion
    calculate = proportion.calculateContainer()
    TOP = isIOS ? 20 : 0
    sWidth = calculate.width
    sHeight = calculate.height
    proportion = config.layoutMode == "horizontal" ? proportion.width : proportion.height
    iconHeight = isIOS ? iconHeight : round(proportion * iconHeight)
}

/**
 * 首页布局
 * @return {[type]} [description]
 */
export function home() {

    setOption()

    let retStr = ''
    let style

    if (config.scrollPaintingMode) {
        retStr = '<div id="sceneHome" style ="width:' + (config.virtualMode ? sWidth / 2 : sWidth) + 'px;height:' + sHeight + 'px;top:' + calculate.top + 'px;left:' + calculate.left + 'px;z-index:' + Xut.sceneController.createIndex() + '" class="xut-chapter">';
    } else {
        //overflow:hidden;
        retStr = '<div id="sceneHome" style ="width:' + (config.virtualMode ? sWidth / 2 : sWidth) + 'px;height:' + sHeight + 'px;top:' + calculate.top + 'px;left:' + calculate.left + 'px;overflow:hidden;z-index:' + Xut.sceneController.createIndex() + '" class="xut-chapter">';
    }
    retStr += '<div id="controlBar" class="xut-controlBar hide"></div>';
    retStr += '<ul id="pageContainer" class="xut-flip"></ul>'; //页面节点
    retStr += '<ul id="masterContainer" class="xut-master xut-flip"></ul>'; //视觉差包装容器

    //滑动菜单
    if (config.layoutMode == 'horizontal') {
        navHeight = round(sHeight / ratio); //菜单的高度
        style = 'overflow:hidden;width:100%;height:' + navHeight + 'px;background-color:white;bottom:4px;border-top:1px solid rgba(0,0,0,0.1)';
    } else {
        navWidth = Math.min(sWidth, sHeight) / (isIOS ? 8 : 3); //菜单宽度
        navHeight = round((sHeight - iconHeight - TOP) * 0.96);
        style = 'width:' + navWidth + 'px;height:' + navHeight + 'px;background-color:white;top:' + (iconHeight + TOP + 2) + 'px;left:' + iconHeight + 'px;border-top:1px solid rgba(0,0,0,0.1)';
    }

    retStr += '<div id="navBar" class="xut-navBar" style="' + style + '"></div>';
    //消息提示框
    retStr += '<div id="toolTip"></div>';
    retStr += '</div>';
    return retStr;
}


/**
 * [scene 创建场景]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
export function scene(id) {

    setOption()

    var wapper = '';
    if (config.scrollPaintingMode) {
        wapper = '<div id="{0}" class="xut-waitLoad" style="width:{1}px;height:{2}px;top:{3}px;left:{4}px;position:absolute;z-index:{5};">' +
            '<ul id="{6}" class="xut-flip" style="z-index:{7}"></ul>' +
            '<ul id="{8}" class="xut-flip" style="z-index:{9}"></ul>' +
            '</div>';
    } else {
        wapper = '<div id="{0}" class="xut-waitLoad" style="width:{1}px;height:{2}px;top:{3}px;left:{4}px;position:absolute;overflow:hidden;z-index:{5};">' +
            '<ul id="{6}" class="xut-flip" style="z-index:{7}"></ul>' +
            '<ul id="{8}" class="xut-flip" style="z-index:{9}"></ul>' +
            '</div>';
    }
    return String.format(wapper, 'scenario-' + id, config.virtualMode ? sWidth / 2 : sWidth, sHeight, calculate.top, calculate.left, Xut.sceneController.createIndex(),
        'scenarioPage-' + id, 2,
        'scenarioMaster-' + id, 1
    );
}


/**
 * [nav 导航菜单]
 * @param  {[type]} seasonSqlRet [description]
 * @return {[type]}              [description]
 */
export function nav(seasonSqlRet) {

    setOption()

    var dirNum = seasonSqlRet.length,
        retStr,
        liCss,
        scroller,
        wrapper,
        seasonId,
        chapterId,
        data,
        xxtlink;

        
    //获得wrapper
    (function SectionWrapper() {
        var width,
            height,
            blank,
            font = round(proportion * 2);
            
        if (config.layoutMode == 'horizontal') {
            height = round(navHeight * 0.9);
            width = round(height * sWidth / sHeight); //保持缩略图的宽高比
            blank = round(navHeight * 0.05); //缩略图之间的间距
            scroller = 'style="width:' + dirNum * (width + blank) + 'px">';
            liCss = 'float:left;width:' + width + 'px;height:' + height + 'px;margin-left:' + blank + 'px';
            wrapper = 'width:96%;height:' + height + 'px;margin:' + blank + 'px auto;font-size:' + font + 'em';
        } else {
            scroller = '>';
            width = round(navWidth * 0.9);
            height = round(navWidth * 1.1);
            blank = round(navWidth * 0.05);
            liCss = 'width:' + width + 'px;height:' + height + 'px;margin:' + blank + 'px auto;border-bottom:1px solid rgba(0,0,0,0.3)';
            wrapper = 'height:' + (navHeight - 4) + 'px;overflow:hidden;margin:2px auto;font-size:' + font + 'em';
        }
    })();
    

    retStr = '<div id="SectionWrapper" style="' + wrapper + '">';
    retStr += '  <div id="Sectionscroller" style="height:100%;" ';
    retStr += scroller;
    retStr += '     <ul id="SectionThelist">';

    for (var i = 0; i < dirNum; i++) {
        data = seasonSqlRet[i];
        seasonId = data.seasonId;
        chapterId = data._id;
        xxtlink = seasonId + '-' + chapterId;
        retStr += '<li style="' + liCss + '">';
        retStr += '<div class="xut-navBar-box" data-xxtlink = "' + xxtlink + '">' + (i + 1) + '</div>';
        retStr += '</li>';
    }

    retStr += '</ul></div>';

    return retStr;
}