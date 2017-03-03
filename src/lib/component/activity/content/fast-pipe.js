import {
  makeJsonPack
} from '../../../util/lang'

import {
  simpleEvent
} from '../event/bind/simple'



/**
 * 预处理脚本
 * 1 动画直接显示与隐藏设置
 * 2 动画脚本与处理（跳转）
 */
export default function FastPipe(options, base) {
  let {
    id,
    canvasMode,
    $contentNode,
    prepTag, //标签形式，通过a标签处理
    prepVisible, //预显示动画
    prepScript //预跳转脚本
  } = options

  /////////////////////////////
  ///如果是被预处理截断，跳过动画创建
  ///重写原事件的相关数据
  ///改动脚本auto为click事件
  /////////////////////////////
  if (prepScript) {
    base.eventData.rewrite = true
    base.eventData.eventName = 'click'
    base.eventData.eventContentId = id
  }

  /////////////////////////////
  //创建a标签跳转
  /////////////////////////////
  if (prepTag) {
    try {
      makeJsonPack(prepTag)()
    } catch (err) {
      console.log(`预处理截断执行脚本失败`)
    }
    prepTag = window.XXTAPI.PreCode
    if (prepTag && prepTag.length) {
      let contentNode = base.getContextNode(base._findContentName(base.pid, id))
      let imgContext = contentNode.find('img')
      if (imgContext.length) {
        //替换img为div>a
        imgContext.replaceWith(String.styleFormat(
          `<div class="inherit-size fullscreen-background fix-miaomiaoxue-img"
                style="background-image:url(${imgContext.attr('src')});">
              <a data-type="hyperlink"
                  href="${prepTag[0]}"
                  class="inherit-size"
                  style="display:block;"/>
              </a>
          </div>`))
        window.XXTAPI.PreCode = null
        base.eventData.eventContext = contentNode.find('a')
        base.eventData.rewrite = true
        base.eventData.eventName = 'tap'
        base.eventData.eventContentId = id
      }
    }
  }

  /**
   * 显示预处理,直接越过动画
   */
  const setPrepVisible = () => {
    //创建的无行为content
    const partContentRelated = base.relatedData.partContentRelated
      //针对空跳过处理
    if (partContentRelated && partContentRelated.length && (-1 !== partContentRelated.indexOf(id))) {} else {
      if (canvasMode) {
        console.log('canvsa prepVisible')
        return
      }
      //因为执行的顺序问题，动画与页面零件,isscroll标记控制
      if ($contentNode && !$contentNode.attr('data-iscroll')) {
        //必须是设定值与原始值不一致才修改,苹果上闪屏问题
        if ($contentNode.css('visibility') != prepVisible) {
          $contentNode.css({
            'visibility': prepVisible
          })
        }
      }
    }
  }


  return {
    fastpipe: true, //特殊标记，用于外部过滤

    init() {
      //预显示跳过动画创建
      if (prepVisible) {
        $contentNode.css({
          'visibility': prepVisible
        })
      }
    },

    play(callback) {

      //处理显示动画
      if (prepVisible) {
        setPrepVisible(callback)
      }

      //a标签附带的脚本函数
      if (prepTag && prepTag[1]) {
        try {
          prepTag[1]()
        } catch (err) {
          console.log(`快速处理脚本函数执行失败`)
        }
      }

      //如果是被预处理截断
      //执行脚本
      if (prepScript) {
        try {
          makeJsonPack(prepScript)()
        } catch (err) {
          console.log(`快速处理执行脚本失败`)
        }
      }

      callback && callback()
    },

    destroy() {
      $contentNode = null
      prepTag = null
    }
  }
}
