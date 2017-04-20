import { config } from '../../../config/index'

const round = Math.round
const ratio = 6
const isIOS = Xut.plat.isIOS
const TOP = isIOS ? 20 : 0

const getNavOptions = () => {

  let iconHeight = config.data.iconHeight
  let proportion = config.proportion
  let visualSize = config.visualSize

  //横版模式
  let isHorizontal = config.layoutMode == 'horizontal'

  proportion = isHorizontal ? proportion.width : proportion.height
  iconHeight = isIOS ? iconHeight : round(proportion * iconHeight)

  //导航菜单宽高
  let navHeight, navWidth
  let sWidth = visualSize.width
  let sHeight = visualSize.height

  //横版模版
  if(isHorizontal) {
    navHeight = round(sHeight / ratio)
  } else {
    navWidth = Math.min(sWidth, sHeight) / (isIOS ? 8 : 3)
    navHeight = round((sHeight - iconHeight - TOP) * 0.96)
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

  if(config.layoutMode == 'horizontal') {
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
export default function navLayout(results) {

  let seasonlist = results.length
  let options = getWrapper(seasonlist)

  let list = ''
  let seasonId
  let chapterId
  let data
  let xxtlink

  for(let i = 0; i < seasonlist; i++) {
    data = results[i]
    seasonId = data.seasonId
    chapterId = data._id
    xxtlink = seasonId + '-' + chapterId
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
