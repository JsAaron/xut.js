import { config } from '../../config/index'
import { updateAction } from '../../component/widget/page/extend/adv.sprite'
import { createContentAudio } from '../../component/audio/api'

import fade from './extend/fade'
import fly from './extend/fly'
import path from './extend/path'
import rotate from './extend/rotate'
import special from './extend/special'
import zoom from './extend/zoom'
import shape from './extend/shape'

import { parseJSON, makeJsonPack } from '../../util/lang'

const ROUND = Math.round
const CEIL = Math.ceil

const isMacOS = Xut.plat.isMacOS
const isDesktop = Xut.plat.isDesktop

/**
 * 参数说明
 * pageType: 页面类型
 * chapterId: 当前页ID
 * element: 动画对象
 * parameter: 动画参数数组
 * container: 父容器
 * hasLoop: 是否循环动画
 * startEvent: 整个动画开始事件
 * completeEvent: 整个动画结束事件
 **/
export default class Powepoint {

  constructor(pageIndex, pageType, chapterId, element, parameter, container, getStyle) {

    if (_.isArray(parameter) && parameter.length) {
      this.options = parameter
    } else {
      console.log("Animation options error is not Array.");
      return
    }

    this.visualWidth = getStyle.visualWidth
    this.visualHeight = getStyle.visualHeight

    this.container = container || $(document.body); //父容器(主要用于手势控制路径动画)
    this.isDebug = false; //是否显示调试信息

    this.pageIndex = pageIndex;
    this.pageType = pageType;
    this.chapterId = chapterId;
    this.element = element;

    /**
     * 动画对象默认样式
     * @type {String}
     */
    this.elementStyle = '';

    /**
     * 初始化后对象状态
     * @type {String}
     */
    this.elementVisibility = 'visible'

    /**
     * 是否使用CSS渐变效果
     * @type {[type]}
     */
    this.useMask = (isDesktop || isMacOS) ? true : false

    /**
     * 第一个动画参数（默认支持多个动画作用于一个对象）
     * @type {[type]}
     */
    this.parameter0 = null

    /**
     * 第一个动画类型（进入/退出）
     * @type {Boolean}
     */
    this.isExit0 = false

    /**
     * 是否完全执行过(用于解决重复执行问题)
     * @type {Boolean}
     */
    this.isCompleted = false

    /**
     * 初始对象状态:opacity(visibility)
     */
    this._initElement();

  }


  /**
   * 解析脚本代码
   * 包装能函数
   */
  _parseCode(code1, code2) {
    if (code1 && code1.length > 0) {
      return makeJsonPack(code1)
    } else if (code2 && code2.length > 0) {
      return makeJsonPack(code2)
    }
  }

  /**
   * 解析延时脚本
   */
  _parseDelayCode(code1, code2) {
    if (code1 && code1.length > 0) {
      return code1
    } else if (code2 && code2.length > 0) {
      return code2
    }
  }

  /**
   * 根据数据库的设置
   * 对象初始化(visibility)
   */
  _initElement() {

    var data = this.options[0]
    this.parameter0 = parseJSON(data.parameter)

    //为高级动画修改增加
    //2016.3.16
    this.parameter0.pageType = this.pageType;
    this.parameter0.pageIndex = this.pageIndex;

    this.isExit0 = this.parameter0.exit ? (this.parameter0.exit).toLowerCase() == "true" : false;

    //给元素增加ppt属性标记
    if (!this.element.attr("data-pptAnimation")) {
      let animationName = data.animationName

      //路径动画对象默认显示
      if (animationName.indexOf("EffectPath") == 0 || animationName == "EffectCustom") {
        this.element.css("visibility", "visible");
      } else {

        switch (animationName) {
          //强调动画默认显示
          case "EffectFlashBulb": //脉冲
          case "EffectFlicker": //彩色脉冲
          case "EffectTeeter": //跷跷板
          case "EffectSpin": //陀螺旋转
          case "EffectGrowShrink": //放大/缩小
          case "EffectDesaturate": //不饱和
          case "EffectDarken": //加深
          case "EffectLighten": //变淡
          case "EffectTransparency": //透明
          case "EffectColorBlend": //对象颜色
          case "EffectComplementaryColor": //补色
          case "EffectChangeLineColor": //线条颜色
          case "EffectChangeFillColor": //填允颜色
          case "EffectFlashOnce": //闪烁(一次)
            this.element.css("visibility", "visible");
            break;
          case "EffectCredits": //字幕式特殊处理
            this.element.css("visibility", "hidden");
            break;
          default:
            if (this.isExit0)
              this.element.css("visibility", "visible"); //退出动画默认显示
            else
              this.element.css("visibility", "hidden"); //进入动画默认隐藏
            break;
        }
      }

      //标识初始化状态
      this.element.attr("data-pptAnimation", true);
      this.elementStyle = this.element[0].style.cssText;
      this.elementVisibility = this.element.css("visibility");
    }

  }

  /**
   * 获取对象相关信息
   */
  _getObjectInfo(object) {
    var width = ROUND(object.width()); //四舍五入取整
    var height = ROUND(object.height());
    var top = ROUND(parseInt(object.css("top")))
    var left = ROUND(parseInt(object.css("left")))
    var offsetTop = ROUND(object.offset().top);

    if (object.attr("offsetTop")) {
      offsetTop = parseInt(object.attr("offsetTop"));
    } else {
      object.attr("offsetTop", offsetTop);
    }

    var offsetBottom = CEIL(this.visualHeight - offsetTop - height);
    var offsetLeft = ROUND(object.offset().left);
    if (object.attr("offsetLeft")) {
      offsetLeft = parseInt(object.attr("offsetLeft"));
    } else {
      object.attr("offsetLeft", offsetLeft);
    }
    var offsetRight = CEIL(this.visualWidth - offsetLeft - width)

    return {
      width,
      height,
      top,
      left,
      offsetTop,
      offsetLeft,
      offsetBottom,
      offsetRight
    };
  }

  /**
   * 返回动画对象
   */
  _getTimeline(data, index, completeAction) {
    var object = this.element;
    var parameter = this.parameter0;
    var isExit = this.isExit0;

    ////////////////////////
    /// 如果有多个动画序列参数
    ///////////////////////
    if (index > 0 || this.parameter0 == null) {
      parameter = parseJSON(data.parameter);
      isExit = parameter.exit ? (parameter.exit).toLowerCase() == "true" : false; //false:进入 true:消失
      if (index == 0) {
        this.parameter0 = parameter;
        this.isExit0 = isExit;
      }
    }
    var duration = data.speed / 1000; //执行时间
    var delay = data.delay / 1000; //延时时间
    if (navigator.epubReadingSystem) { //如果是epub阅读器则动画延时0.15秒
      delay += 0.15
    }
    var repeat = (data.repeat >= 0) ? data.repeat - 1 : 0; //重复次数
    parameter.pageType = this.pageType;
    parameter.chapterId = this.chapterId;
    parameter.animationName = data.animationName;
    //赋给动画音频Id
    parameter.videoId = data.videoId;
    //子动画中如果遇到停止了
    //就直接调用退出通知
    parameter.completeAction = completeAction

    ////////////////////////////////////
    /// 赋予脚本处理代码
    /// 每个对象数据都可以带脚本代码
    /// 所以需要把脚本匹配到每一个子动画中
    ///////////////////////////////////
    //获取动画前脚本
    parameter.preCode = this._parseCode(data.preCode)
    //获取动画后脚本
    parameter.postCode = this._parseCode(data.postCode)
    //获取延时时间
    parameter.codeDelay = this._parseDelayCode(data.codeDelay)
    //赋予父对象的引用
    parameter.parent = this

    let animationName = parameter.animationName
    let arg1 = [parameter, object, isExit, duration, delay, repeat]
    let arg2 = [parameter, object, duration, delay, repeat]

    //文字动画
    if (animationName === "xxtTextEffect") {
      return this.getTextAnimation.apply(this, arg2)
    }

    //路径动画
    if (animationName.indexOf("EffectPath") == 0 || animationName == "EffectCustom") {
      return this.getPathAnimation.apply(this, arg2)
    }

    switch (animationName) {
      case "EffectFade": //淡出
        return this.getEffectFade.apply(this, arg1)
      case "EffectFly": //飞入/飞出
        return this.getEffectFly.apply(this, arg1)
      case "EffectAscend": //浮入/浮出(上升)
        return this.getEffectAscend.apply(this, arg1)
      case "EffectDescend": //浮入/浮出(下降)
        return this.getEffectDescend.apply(this, arg1)
      case "EffectSplit": //劈裂(分割)
        return this.getEffectSplit.apply(this, arg1)
      case "EffectWipe": //擦除
        return this.getEffectWipe.apply(this, arg1)
      case "EffectCircle": //形状一(圆)
        return this.getEffectCircle.apply(this, arg1)
      case "EffectBox": //形状二(方框)
        return this.getEffectBox.apply(this, arg1)
      case "EffectDiamond": //形状三(菱形)
        return this.getEffectDiamond.apply(this, arg1)
      case "EffectPlus": //形状四(加号)
        return this.getEffectPlus.apply(this, arg1)
      case "EffectGrowAndTurn": //翻转式由远及近
        return this.getEffectGrowAndTurn.apply(this, arg1)
      case "EffectZoom": //基本缩放
        return this.getEffectZoom.apply(this, arg1)
      case "EffectFadedZoom": //淡出式缩放
        return this.getEffectFadedZoom.apply(this, arg1)
      case "EffectSwivel": //基本旋转
        return this.getEffectSwivel.apply(this, arg1)
      case "EffectFadedSwivel": //旋转(淡出式回旋)
        return this.getEffectFadedSwivel.apply(this, arg1)
      case "EffectBounce": //弹跳
        return this.getEffectBounce.apply(this, arg1)
      case "EffectBlinds": //百叶窗
        return this.getEffectBlinds.apply(this, arg1)
      case "EffectPeek": //切入/出
        return this.getEffectPeek.apply(this, arg1)
      case "EffectExpand": //展开/收缩
        return this.getEffectExpand.apply(this, arg1)
      case "EffectRiseUp": //升起/下沉
        return this.getEffectRiseUp.apply(this, arg1)
      case "EffectCenterRevolve": //中心旋转
        return this.getEffectCenterRevolve.apply(this, arg1)
      case "EffectSpinner": //回旋
        return this.getEffectSpinner.apply(this, arg1)
      case "EffectFloat": //浮动
        return this.getEffectFloat.apply(this, arg1)
      case "EffectSpiral": //螺旋飞入/出
        return this.getEffectSpiral.apply(this, arg1)
      case "EffectPinwheel": //玩具风车
        return this.getEffectPinwheel.apply(this, arg1)
      case "EffectCredits": //字幕式
        return this.getEffectCredits.apply(this, arg1)
      case "EffectBoomerang": //飞旋
        return this.getEffectBoomerang.apply(this, arg1)
      case "EffectArcUp": //曲线向上/下
        return this.getEffectArcUp.apply(this, arg1)
      case "EffectFlashBulb": //脉冲
        return this.getEffectFlashBulb.apply(this, arg2)
      case "EffectFlicker": //彩色脉冲
        return this.getEffectFlicker.apply(this, arg2)
      case "EffectTeeter": //跷跷板
        return this.getEffectTeeter.apply(this, arg2)
      case "EffectSpin": //陀螺旋转
        return this.getEffectSpin.apply(this, arg2)
      case "EffectGrowShrink": //放大/缩小
        return this.getEffectGrowShrink.apply(this, arg2)
      case "EffectDesaturate": //不饱和
        return this.getEffectDesaturate.apply(this, arg2)
      case "EffectDarken": //加深
        return this.getEffectDarken.apply(this, arg2)
      case "EffectLighten": //变淡
        return this.getEffectLighten.apply(this, arg2)
      case "EffectTransparency": //透明
        return this.getEffectTransparency.apply(this, arg2)
      case "EffectColorBlend": //对象颜色
        return new TimelineMax();
      case "EffectComplementaryColor": //补色
        return this.getEffectComplementaryColor.apply(this, arg2)
      case "EffectChangeLineColor": //线条颜色
        return new TimelineMax();
      case "EffectChangeFillColor": //填允颜色
        return new TimelineMax();
      case "EffectFlashOnce": //闪烁(一次)
        return this.getEffectFlashOnce.apply(this, arg2)
        //进入退出动画
      default:
      case "EffectAppear": //出现/消失
        return this.getEffectAppear.apply(this, arg1)
    }
  }

  /**
   * 子动画通用开始事件
   */
  _startHandler(parameter, object, params) {
    for (var item in params) {
      switch (item) {
        case "x":
          TweenLite.set(object, {
            x: params[item]
          });
          break;
        case "y":
          TweenLite.set(object, {
            y: params[item]
          });
          break;
        case "rotation":
          TweenLite.set(object, {
            rotation: params[item]
          });
          break;
        case "rotationX":
          TweenLite.set(object, {
            rotationX: params[item]
          });
          break;
        case "rotationY":
          TweenLite.set(object, {
            rotationY: params[item]
          });
          break;
        case "scale":
          TweenLite.set(object, {
            scale: params[item]
          });
          break;
        default:
          object.css(item, params[item]);
          break;
      }
    }

    //ppt动画音频
    if (parameter.videoId > 0) {
      createContentAudio(parameter.chapterId, parameter.videoId)
    }

    //ppt动画扩展处理
    let pptanimation = parameter.pptanimation
    if (pptanimation && pptanimation.pptapi) {
      let params = pptanimation.parameters ? pptanimation.parameters : {};
      if (pptanimation.pptapi === 'bonesWidget') {
        //骨骼动画
        bonesWidget.updateAction(object.attr("id"), params.actList);
      } else if (pptanimation.pptapi === 'spiritWidget') {
        //零件，高级精灵
        updateAction(object.attr("id"), params);
      }
    }

    //////////////////
    ///开始脚本动画
    ///1 保持父引用的操作
    //////////////////
    let preCode = parameter.preCode
    if (preCode && _.isFunction(preCode)) {
      parameter.parent.animation.pause();
      let result = false;
      try {
        result = preCode();
      } catch (error) {
        console.log("Run preCode is error in startHandler:" + error)
      }
      if (result == true)
        parameter.parent.animation.resume()
      else {
        //如果遇到停止了
        //动画直接退出
        //调用外部通知接口
        parameter.parent.animation.stop()
        parameter.completeAction()
      }
    }

  }

  /**
   * 子动画通用结束事件
   */
  _completeHandler(parameter, object, params) {
    for (var item in params) {
      switch (item) {
        case "x":
          TweenLite.set(object, {
            x: params[item]
          });
          break;
        case "y":
          TweenLite.set(object, {
            y: params[item]
          });
          break;
        case "rotation":
          TweenLite.set(object, {
            rotation: params[item]
          });
          break;
        case "rotationX":
          TweenLite.set(object, {
            rotationX: params[item]
          });
          break;
        case "rotationY":
          TweenLite.set(object, {
            rotationY: params[item]
          });
          break;
        case "scale":
          TweenLite.set(object, {
            scale: params[item]
          });
          break;
        default:
          object.css(item, params[item]);
          break;
      }
    }

    //延迟执行postCode代码
    let postCode = parameter.postCode
    if (postCode) {
      try {
        //简单判断是函数可执行
        if (_.isFunction(postCode)) {
          let codeDelay = parameter.codeDelay
          if (codeDelay > 0) {
            setTimeout(postCode, codeDelay)
          } else {
            postCode()
          }
        }
      } catch (error) {
        console.log("Run postCode is error in completeHandler:" + error)
      }
    }
  }

  /**
   * 初始化
   */
  _initAnimation(callback) {
    let self = this

    /**
     * 整个动画完成事件(动画不需继续执行视为执行完成)
     * 1 子动画中，有任意的脚本遇到停止，那么就提前调用完成
     * 2 全部动画完成户调用此接口
     */
    function completeAction() {
      if (callback && _.isFunction(callback)) {
        callback()
      }
    }

    let tl = new TimelineLite({
      paused: true,
      //动画全部完成
      onComplete() {
        self.isCompleted = true;
        completeAction()
      }
    });

    for (var i = 0; i < this.options.length; i++) {
      if (i == 0) {
        tl.add(this._getTimeline(this.options[i], i, completeAction), "shape0");
      } else {
        var invokeMode = this.options[i].invokeMode;
        if (invokeMode == 2) {
          tl.add(this._getTimeline(this.options[i], i, completeAction));
        } else {
          //"shape"+(i-1)
          tl.add(this._getTimeline(this.options[i], i, completeAction), "shape0");
        }
      }
    }
    return tl;
  }


  /**
   * 执行动画
   * @param  {[type]} scopeComplete [description]
   * @return {[type]}               [description]
   */
  play(animComplete) {
    if (this.isCompleted) {
      this.reset()
    }
    if (this.animation) {
      this.stop();
    }
    this.animation = this._initAnimation(animComplete)
    this.animation.play()
  }

  /**
   * 停止动画
   * @return {[type]} [description]
   */
  stop() {
    if (this.animation) {
      this.animation.stop()
      this.animation.kill()
      this.animation.clear()
      this.animation.vars = null
    }
    this.animation = null;
  }


  /**
   * 复位动画
   * @return {[type]} [description]
   */
  reset() {
    this.animation && this.stop();
    if (this.elementStyle && this.elementStyle.length) {
      const origin = this.element.css(Xut.style.transformOrigin);
      //卷滚区域里的对象不需要还原
      if (this.element.attr("data-iscroll") == null) {
        this.element[0].style.cssText = this.elementStyle;
      }
      this.element.css(Xut.style.transformOrigin, origin);
      this.element.css("visibility", this.elementVisibility);
      this.element.css(Xut.style.transform, "none");
      this.element[0]["_gsTransform"] = null; //清理对象上绑定的动画属性
    }
    this.isCompleted = false;
  }


  /**
   * 销毁动画
   * @return {[type]} [description]
   */
  destroy() {
    this.stop();
    this.container = null;
    this.options = null;
    this.element = null;
  }

}

//动画扩展
fade(Powepoint.prototype)
fly(Powepoint.prototype)
path(Powepoint.prototype)
rotate(Powepoint.prototype)
special(Powepoint.prototype)
zoom(Powepoint.prototype)
shape(Powepoint.prototype)
