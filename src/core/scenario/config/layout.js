/**
 * 布局文件
 * 1 控制条
 * 2 导航栏
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
import { config } from '../../config/index'
import { sceneController } from '../control'

const round = Math.round
const ratio = 6
const isIOS = Xut.plat.isIOS
const TOP = isIOS ? 20 : 0

/**
 * 主场景
 * @return {[type]} [description]
 */
export function mainScene() {

  let {
    layoutMode,
    iconHeight,
    proportion,
    screenSize,
    visualSize,
    originalVisualSize
  } = config

  const { sWidth, sHeight } = visualSize
  const isHorizontal = layoutMode == 'horizontal'

  proportion = isHorizontal ? proportion.width : proportion.height
  iconHeight = isIOS ? iconHeight : round(proportion * iconHeight)

  let navBarWidth
  let navBarHeight
  if (isHorizontal) {
    navBarWidth = '100%'
    navBarHeight = round(sHeight / ratio)
  } else {
    if (sHeight) {
      navBarWidth = Math.min(sWidth, sHeight) / (isIOS ? 8 : 3) + 'px'
      navBarHeight = round((sHeight - iconHeight - TOP) * 0.96)
    }
  }

  const navBarTop = isHorizontal ? '' : 'top:' + (iconHeight + TOP + 2) + 'px;'
  const navBarLeft = isHorizontal ? '' : 'left:' + iconHeight + 'px;'
  const navBarBottom = isHorizontal ? 'bottom:4px;' : ''
  const navBaroOverflow = isHorizontal ? 'hidden' : 'visible'

  //导航
  let navBarHTML
  if (navBarWidth || navBarHeight) {
    navBarHTML =
      `<div class="xut-nav-bar"
          style="width:${navBarWidth};
                 height:${navBarHeight || 0}px;
                 ${navBarTop}
                 ${navBarLeft}
                 ${navBarBottom}
                 background-color:white;
                 border-top:1px solid rgba(0,0,0,0.1);
                 overflow:${navBaroOverflow};">
    </div>`
  } else {
    navBarHTML = '<div class="xut-nav-bar"></div>'
  }


  //如果启动了双页模式
  //那么可视区的宽度是就是全屏的宽度了，因为有2个页面拼接
  const width = config.launch.doublePageMode ? screenSize.width : visualSize.width

  //如果有拼接的页面高度
  //这边是为秒秒学处理的
  let style = ''
  if (config.launch.pageBar && config.launch.pageBar.bottom) {
    style = `style="height:${visualSize.height}px;"`
  }

  //2017.12.4
  //新增全局工具栏容器
  return String.styleFormat(
    `<div id="xut-main-scene"
          style="width:${width}px;
                 height:${screenSize.height}px;
                 top:0;
                 left:${originalVisualSize.left}px;
                 position:absolute;
                 z-index:${sceneController.createIndex()};
                 overflow:hidden;">

        <ul id="xut-page-container" class="xut-flip" ${style}></ul>
        <ul id="xut-master-container" class="xut-master xut-flip" ${style}></ul>
        <div class="xut-control-bar"></div>
        <div class="xut-tool-tip"></div>
        ${navBarHTML}
    </div>`
  )
}


/**
 * 副场景
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
export function deputyScene(id) {

  const {
    visualSize,
    originalVisualSize
  } = config

  return String.styleFormat(
    `<div id="${'scenario-' + id}"
          style="width:${visualSize.width}px;
                 height:100%;
                 top:0;
                 left:${originalVisualSize.left}px;
                 z-index:${sceneController.createIndex()};
                 position:absolute;
                 overflow:hidden;">
        <ul id="${'scenarioPage-' + id}" class="xut-flip" style="z-index:2"></ul>
        <ul id="${'scenarioMaster-' + id}" class="xut-flip" style="z-index:1"></ul>
    </div>`
  )
}
