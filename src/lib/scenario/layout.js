/**
 * 布局文件
 * 1 控制条
 * 2 导航栏
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
import { config } from '../config/index'
import { sceneController } from './controller'

const round = Math.round
const ratio = 6
const isIOS = Xut.plat.isIOS
const TOP = isIOS ? 20 : 0

/**
 * 主场景
 * @return {[type]} [description]
 */
export function mainScene() {

    let iconHeight = config.iconHeight
    let proportion = config.proportion

    const sWidth = config.visualSize.width
    const sHeight = config.visualSize.height

    //横版模式
    const isHorizontal = config.layoutMode == 'horizontal'

    proportion = isHorizontal ? proportion.width : proportion.height
    iconHeight = isIOS ? iconHeight : round(proportion * iconHeight)

    const navBarWidth = isHorizontal ? '100%' : Math.min(sWidth, sHeight) / (isIOS ? 8 : 3) + 'px'
    const navBarHeight = isHorizontal ? round(sHeight / ratio) : round((sHeight - iconHeight - TOP) * 0.96)
    const navBarTop = isHorizontal ? '' : 'top:' + (iconHeight + TOP + 2) + 'px;'
    const navBarLeft = isHorizontal ? '' : 'left:' + iconHeight + 'px;'
    const navBarBottom = isHorizontal ? 'bottom:4px;' : ''
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

    //主体
    const homeHTML =
        `<div id="xut-main-scene"
              style="width:${config.visualSize.width}px;
                     height:${config.screenSize.height}px;
                     top:0;
                     left:${config.visualSize.left}px;
                     position:absolute;
                     z-index:${sceneController.createIndex()};
                     overflow:hidden;">

            <div id="xut-control-bar" class="xut-control-bar"></div>
            <ul id="xut-page-container" class="xut-flip"></ul>
            <ul id="xut-master-container" class="xut-master xut-flip"></ul>
            ${navBarHTML}
            <div id="xut-tool-tip"></div>
        </div>`

    return String.styleFormat(homeHTML)
}


/**
 * 副场景
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
export function deputyScene(id) {
    const html =
        `<div id="${'scenario-' + id}"
              style="width:${config.visualSize.width}px;
                     height:100%;
                     top:0;
                     left:${config.visualSize.left}px;
                     z-index:${sceneController.createIndex()};
                     position:absolute;
                     overflow:hidden;">
            <ul id="${'scenarioPage-' + id}" class="xut-flip" style="z-index:2"></ul>
            <ul id="${'scenarioMaster-' + id}" class="xut-flip" style="z-index:1"></ul>
        </div>`

    return String.styleFormat(html)
}
