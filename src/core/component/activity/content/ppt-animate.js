/*********************************************************************
 *
 * content的动画类对象
 * 1 ppt 动画
 * 2 精灵动画
 * 3 show/hide接口
 * 4 canvas动画
 * @return {[type]} [description]
 *
 ********************************************************************/
import Powepoint from '../../../expand/powerpoint/index'
import ComSprite from './sprite/com'
import AutoSprite from './sprite/auto'
import { resetContentAudio, destroyContentAudio } from '../../audio/api'
import { makeJsonPack, cleanImage, setImage } from '../../../util/index'

//2016.7.15废弃
//pixi暂时不使用
let pixiSpirit = {}
let pixiSpecial = {}

// import { Sprite as pixiSpirit } from '../pixi/sprite/index'
// import { specialSprite as pixiSpecial } from '../pixi/special/index'

/**
 * 1.复位音频
 * 2.销毁音频
 */
const audioHandle = (context, options, chapterId) => {
  options && _.each(options, (data) => {
    //如果存在对象音频
    if (data.videoId) {
      context(chapterId, data.videoId)
    }
  })
}


/**
 * 4种扩展对象
 * @type {Array}
 */
const OBJNAME = [
  'pptObj',
  'pixiObj',
  'comSpriteObj',
  'autoSpriteObj'
]


/**
 * Traverse each value of OBJNAME
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
const access = (callback) => {
  OBJNAME.forEach((key) => {
    callback(key)
  })
}


/**
 * 动画效果
 * @param {[type]} options [description]
 */
export default class Animation {

  constructor(options) {
    _.extend(this, options);
  }

  /**
   * Build the canvas of animation
   * 比较复杂
   * 1 普通与ppt组合
   * 2 高级与ppt组合
   * 3 ppt独立
   * 4 普通精灵动画
   * 8  其中 高级精灵动画是widget创建，需要等待
   * @return {[type]} [description]
   */
  _createCanvas(id, parameter, category, callback) {

    let initstate

    //动作类型
    //可能是组合动画
    const actionTypes = this.contentData.actionTypes
    const makeOpts = {
      data: this.contentData,
      renderer: this.$contentNode,
      pageIndex: this.pageIndex
    }

    //创建pixi上下文的ppt对象
    const createPixiPPT = () => {
      //parameter存在就是ppt动画
      if ((parameter || actionTypes.pptId) && this.$contentNode.view) {
        this.pptObj = callback(Powepoint, $(this.$contentNode.view));
        this.pptObj.contentId = id
      }
    }

    const $veiw = this.$contentNode.view
    if ($veiw) {
      initstate = $veiw.getAttribute('data-init')
    }

    const setState = () => {
      $veiw.setAttribute('data-init', true)
    }

    //多个canvas对应多个ppt
    //容器不需要重复创建
    //精灵动画
    if (actionTypes.spiritId) {
      if (initstate) {
        createPixiPPT()
      } else {
        //加入任务队列
        this.nextTask.context.add(id)
        this.pixiObj = new pixiSpirit(makeOpts);
        //防止多条一样的数据绑多个动画
        //构建精灵动画完毕后
        //构建ppt对象
        this.pixiObj.$$once('load', () => {
          //ppt动画
          createPixiPPT()

          //任务完成
          this.nextTask.context.remove(id)
        })
        setState()
      }
    }

    //特殊高级动画
    //必须是ppt与pixi绑定的
    if (actionTypes.compSpriteId) {
      // console.log(this,this.id,this.contentData.initpixi)
      //这个dom已经创建了pixi了
      if (initstate) {
        createPixiPPT()
      } else {
        this.pixiObj = new pixiSpecial(makeOpts);
        setState()

        //ppt动画
        createPixiPPT()
      }

    }
  }


  /**
   * Build the dom of animation
   * @return {[type]} [description]
   */
  _createDom(category, callback) {
    if (category) {
      const data = {
        id: this.id,
        data: this.contentData,
        $contentNode: this.$contentNode
      }
      switch (category) {
        //普通精灵动画
        case "Sprite":
          this.comSpriteObj = ComSprite(data)
          break
          //普通转复杂精灵动画
        case "AutoCompSprite":
          this.autoSpriteObj = new AutoSprite(data)
          break
      }
    }

    //ppt动画
    this.pptObj = callback(Powepoint)
  }


  /**
   * 绑定动画
   * 为了向上兼容API
   *  1 dom动画
   *  2 canvas动画
   */
  init(contentId,
    $contentNode,
    $containsNode,
    chapterId,
    parameter,
    pageType,
    activityId) {
    let category = this.contentData.category
    let pageIndex = this.pageIndex
    let create = (constr, newContext) => {
      let element = newContext || $contentNode
      if (element.length) {
        return new constr(
          pageIndex,
          pageType,
          chapterId,
          element,
          parameter,
          $containsNode,
          this.getStyle,
          contentId,
          activityId);
      } else {
        console.log(`创建:${constr}失败`)
      }
    }
    this.domMode ?
      this._createDom(category, create) :
      this._createCanvas(contentId, parameter, category, create)
  }


  /**
   * 运行动画
   * @param  {[type]} scopeComplete   [动画回调]
   * @param  {[type]} canvasContainer [description]
   * @return {[type]}                 [description]
   */
  play(playComplete) {
    let $contentNode = this.$contentNode

    //canvas
    if ($contentNode && $contentNode.view) {
      $contentNode = this.$contentNode.view
    }

    access((key) => {
      if (this[key]) {
        if (key === 'pptObj') {
          //优化处理,只针对互斥的情况下
          //处理层级关系
          if ($contentNode.prop && $contentNode.prop("mutex")) {
            $contentNode.css({ //强制提升层级
              'display': 'block'
            })
          }
        }

        if (this.useDynamicDiagram) {
          //如果是一次性动画
          //如果存在重复点击的情况
          //重新给img的src赋值
          //解决闪动问题
          if (this.$contentNode) {
            setImage(this.$contentNode, this.contentData.resourcePath)
          }
          if (this[key]) {
            this[key].play && this[key].play(playComplete)
          }
        } else {
          this[key].play && this[key].play(playComplete)
        }
      }
    })
  }


  /**
   * 停止动画
   * @param  {[type]} chapterId [description]
   * @return {[type]}           [description]
   */
  stop(chapterId) {
    access((key) => {
      if (this[key]) {
        if (key === 'pptObj') {
          audioHandle(destroyContentAudio, this[key].options, chapterId);
        }
        if (this[key].stop) {
          this[key].stop()
        }
      }
    })
  }


  /**
   * 隐藏动画
   * @param  {[type]} chapterId [description]
   * @return {[type]}           [description]
   */
  hide() {
    access((key) => {
      if (this[key]) {
        if (this[key].hide) {
          this[key].hide()
        }
      }
    })
  }


  /**
   * 翻页结束，复位上一页动画
   * @return {[type]} [description]
   */
  reset() {
    access((key) => {
      if (this[key]) {
        //如果是一次性动画，需要动态处理
        if (this.useDynamicDiagram) {
          cleanImage(this.$contentNode)
        }
        this[key].reset && this[key].reset()
      }
    })
  }


  /**
   * 销毁动画
   * @return {[type]} [description]
   */
  destroy(chapterId) {

    access((key) => {
      this[key] && this[key].destroy && this[key].destroy()
    })

    //销毁renderer = new PIXI.WebGLRenderer
    if (this.canvasMode) {
      this.$contentNode.view && this.$contentNode.destroy()
    }

    //销毁每一个数据上的canvas上下文引用
    if (this.contentData.$contentNode) {
      this.contentData.$contentNode = null;
    }

    access((key) => {
      this[key] = null
    })

    this.$contentNode = null
    this.getParameter = null
  }

}
