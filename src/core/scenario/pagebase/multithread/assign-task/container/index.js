import { config } from '../../../../../config/index'
import { hasValue } from '../../../../../util/lang'
import { getFileFullPath } from '../../../../../util/option'

/**
 *  创建主容器任务片
 *  state状态
 *      0 未创建
 *      1 正常创建
 *      2 创建完毕
 *      3 创建失败
 */
export default function(base, pageData, taskCallback) {

  let $pageNode
  let $pseudoElement

  const prefix = Xut.View.GetPageNodeIdName(base.pageType, base.pageIndex, base.chapterId)
  const getStyle = base.getStyle

  //iboosk编译
  //在执行的时候节点已经存在
  //不需要在创建
  if (Xut.IBooks.runMode()) {
    $pageNode = $("#" + prefix)
    taskCallback($pageNode, $pseudoElement)
    return
  }

  //创建的li结构体
  $pageNode = createContainer(base, pageData, getStyle, prefix)

  Xut.nextTick({
    container: base.rootNode,
    content: $pageNode,
    position: (getStyle.position === 'left' || getStyle.position === 'top') ? 'first' : 'last'
  }, function() {
    taskCallback($pageNode, $pseudoElement)
  })

}


/**
 * 创建页面容器li
 */
function createHTML({
  base,
  prefix,
  translate,
  customStyle,
  pageData,
  background
}) {
  const getStyle = base.getStyle

  //设置滑动的偏移量
  //双页面只有布局偏移量，没有滑动偏移量
  const setTranslate = translate ? `${ Xut.style.transform }:${ translate }` : ''

  //增加一个main-content放body内容
  //增加一个header-footer放溢出的页眉页脚
  return String.styleFormat(
    `<li id="${prefix}"
         data-type="${base.pageType}"
         data-cix="${base.chapterIndex}"
         data-container="true"
         class="xut-flip preserve-3d"
         style="width:${getStyle.visualWidth}px;
                height:${getStyle.visualHeight}px;
                left:${getStyle.visualLeft}px;
                top:${getStyle.visualTop}px;
                ${setTranslate};
                ${background}
                ${customStyle}">
        <div class="page-scale">
            <div data-type="main-content"></div>
            <div data-type="header-footer"></div>
        </div>
    </li>`)
}


/**
 * 创建父容器li结构
 */
function createContainer(base, pageData, getStyle, prefix) {

  let background = ''

  //chpater有背景，不是svg格式
  if (!/.svg$/i.test(pageData.md5)) {
    background = 'background-image:url(' + getFileFullPath(pageData.md5, 'container-bg') + ');'
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

  return $(createHTML({
    base,
    prefix,
    translate: getStyle.translate,
    customStyle,
    pageData,
    background
  }))
}
