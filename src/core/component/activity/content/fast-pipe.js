import { makeJsonPack } from '../../../util/lang'
import { simpleEvent } from '../event/bind/simple'


/**
 * 预处理脚本
 * 1 动画直接显示与隐藏设置
 * 2 动画脚本与处理（跳转）
 */
export default function fastPipe(data, base) {
  let {
    id,
    canvasMode,
    $contentNode,
    prepTag, //标签形式，通过a标签处理
    prepVisible, //预显示动画
    prepScript //预跳转脚本
  } = data

  /////////////////////////////
  ///如果是被预处理截断，跳过动画创建
  ///重写原事件的相关数据
  ///改动脚本auto为click事件
  /////////////////////////////
  if(prepScript) {
    base.eventRelated.rewrite = true
    base.eventRelated.eventName = 'click'
    base.eventRelated.eventContentId = id
  }

  /////////////////////////////
  //创建a标签跳转
  /////////////////////////////
  let preCode
  if(prepTag) {
    try {
      makeJsonPack(prepTag)()
    } catch(err) {
      console.log(`预处理截断执行脚本失败`)
    }
    preCode = window.XXTAPI.PreCode

    if(preCode) {
      let contentNode = base.getContextNode(base._findContentName(base.chapterIndex, id))
      let imgContext = contentNode.find('img')
      if(imgContext.length) {
        let href
        if(_.isString(preCode)) {
          //如果只有一个参数并且是字符串，那么就是URL
          href = preCode
        } else if(_.isArray(preCode)) {
          //数组
          href = preCode[0]
        }

        //替换img为div>a
        imgContext.replaceWith(String.styleFormat(
          `<div class="inherit-size fullscreen-background fix-miaomiaoxue-img"
                style="background-image:url(${imgContext.attr('src')});">
              <a  data-id="${id}"
                  data-page-id="${base.pageId}"
                  data-type="hyperlink"
                  href="${href}"
                  class="inherit-size"
                  style="display:block;"/>
              </a>
          </div>`))
        window.XXTAPI.PreCode = null

        //如果有回调，就绑定事件
        if(preCode[1] && _.isFunction(preCode[1])) {
          base.eventRelated.eventContext = contentNode.find('a')
          base.eventRelated.rewrite = true
          base.eventRelated.eventName = 'tap'
          base.eventRelated.eventContentId = id
        } else {
          //清空auto动作
          base.eventRelated.eventName = ''
        }
      }
    }
  }

  /**
   * 显示预处理,直接越过动画
   */
  const setPrepVisible = () => {
    //创建的无行为content
    const partContentRelated = base.dataRelated.partContentRelated
      //针对空跳过处理
    if(partContentRelated && partContentRelated.length && (-1 !== partContentRelated.indexOf(id))) {} else {
      if(canvasMode) {
        console.log('canvsa prepVisible')
        return
      }
      //因为执行的顺序问题，动画与页面零件,isscroll标记控制
      if($contentNode && !$contentNode.attr('data-iscroll')) {
        //必须是设定值与原始值不一致才修改,苹果上闪屏问题
        if($contentNode.css('visibility') != prepVisible) {
          $contentNode.css({
            'visibility': prepVisible
          })
        }
      }
    }
  }


  return _.extend(data, {

    constructor:'fastPipe',

    init() {
      //预显示跳过动画创建
      prepVisible && $contentNode.css({ 'visibility': prepVisible })
    },

    play(callback) {

      //处理显示动画
      if(prepVisible) {
        setPrepVisible(callback)
      }

      //a标签附带的脚本函数
      if(preCode && preCode[1]) {
        try {
          preCode[1]()
        } catch(err) {
          console.log(`快速处理脚本函数执行失败`)
        }
      }

      //如果是被预处理截断
      //执行脚本
      if(prepScript) {
        try {
          makeJsonPack(prepScript)()
        } catch(err) {
          console.log(`快速处理执行脚本失败`)
        }
      }

      callback && callback()
    },

    destroy() {
      preCode = null
      $contentNode = null
      prepTag = null
    }
  })

}
