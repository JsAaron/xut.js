import { config } from '../../../config/index'
import { updateAction } from '../../../component/widget/page/extend/adv.sprite'
import { createContentAudio } from '../../../component/audio/manager'

import fade from './extend/fade'
import fly from './extend/fly'
import path from './extend/path'
import rotate from './extend/rotate'
import special from './extend/special'
import zoom from './extend/zoom'
import shape from './extend/shape'

import {
    parseJSON,
    makeJsonPack
} from '../../../util/lang'

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

    constructor(pageIndex, pageType, chapterId, element, parameter, container) {

        if (_.isArray(parameter) && parameter.length) {
            this.options = parameter
        } else {
            console.log("Animation options error is not Array.");
            return
        }

        this.screenWidth = config.viewSize.width
        this.screenHeight = config.viewSize.height
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
         * 动画前脚本
         * @type {String}
         */
        this.preCode = ''

        /**
         * 动画后脚本
         * @type {String}
         */
        this.postCode = ''

        /**
         * 延时
         * @type {Number}
         */
        this.codeDelay = 0

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
     * @return {[type]} [description]
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
     * @param  {[type]} code1 [description]
     * @param  {[type]} code2 [description]
     * @return {[type]}       [description]
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
     * @return {[type]} [description]
     */
    _initElement() {

        var data = this.options[0]
        this.parameter0 = parseJSON(data.parameter)

        //为高级动画修改增加
        //2016.3.16
        this.parameter0.pageType = this.pageType;
        this.parameter0.pageIndex = this.pageIndex;

        this.isExit0 = this.parameter0.exit ? (this.parameter0.exit).toLowerCase() == "true" : false;

        //获取动画前脚本
        this.preCode = this._parseCode(data.preCode, this.parameter0.preCode)

        //获取动画后脚本
        this.postCode = this._parseCode(data.postCode, this.parameter0.postCode)

        //获取延时时间
        this.codeDelay = this._parseDelayCode(data.codeDelay, this.parameter0.codeDelay)

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
     * @param  {[type]} object [description]
     * @return {[type]}        [description]
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

        var offsetBottom = CEIL(this.screenHeight - offsetTop - height);
        var offsetLeft = ROUND(object.offset().left);
        if (object.attr("offsetLeft")) {
            offsetLeft = parseInt(object.attr("offsetLeft"));
        } else {
            object.attr("offsetLeft", offsetLeft);
        }
        var offsetRight = CEIL(this.screenWidth - offsetLeft - width)

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
     * 子动画通用开始事件
     * @param  {[type]} parameter [description]
     * @param  {[type]} object    [description]
     * @param  {[type]} params    [description]
     * @return {[type]}           [description]
     */
    startHandler(parameter, object, params) {

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

        /*eslint-disable */

        //ppt动画扩展处理
        if (parameter.pptanimation && parameter.pptanimation.pptapi) {

            var params = parameter.pptanimation.parameters ? parameter.pptanimation.parameters : {};
            switch (parameter.pptanimation.pptapi) {
                case "bonesWidget": //骨骼动画
                    bonesWidget.updateAction(object.attr("id"), params.actList);
                    break;
                case "spiritWidget":
                    // if (window.spiritWidget) {
                    updateAction(object.attr("id"), params);
                    // }
                    break;
            }
        }

        /*eslint-enable */
    }

    /**
     * 子动画通用结束事件
     * @param  {[type]} parameter [description]
     * @param  {[type]} object    [description]
     * @param  {[type]} params    [description]
     * @return {[type]}           [description]
     */
    completeHandler(parameter, object, params) {
        //if(parameter.pptAudio) parameter.pptAudio.end(); //声音存在延时问题，马上结束可导制无法听到声音
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
    }

    /**
     * 返回动画对象
     * @param  {[type]} data  [description]
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    _getTimeline(data, index) {
        var object = this.element;
        var parameter = this.parameter0;
        var isExit = this.isExit0;
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

        let animationName = parameter.animationName
        // console.log(this.element, animationName)
            //文字动画
        if (animationName == "xxtTextEffect") {
            return this.getTextAnimation(parameter, object, duration, delay, repeat);
        }

        //路径动画
        if (animationName.indexOf("EffectPath") == 0 || animationName == "EffectCustom") {
            return this.getPathAnimation(parameter, object, duration, delay, repeat);
        }

        switch (animationName) {
            case "EffectFade": //淡出
                return this.getEffectFade(parameter, object, isExit, duration, delay, repeat);
            case "EffectFly": //飞入/飞出
                return this.getEffectFly(parameter, object, isExit, duration, delay, repeat);
            case "EffectAscend": //浮入/浮出(上升)
                return this.getEffectAscend(parameter, object, isExit, duration, delay, repeat);
            case "EffectDescend": //浮入/浮出(下降)
                return this.getEffectDescend(parameter, object, isExit, duration, delay, repeat);
            case "EffectSplit": //劈裂(分割)
                return this.getEffectSplit(parameter, object, isExit, duration, delay, repeat);
            case "EffectWipe": //擦除
                return this.getEffectWipe(parameter, object, isExit, duration, delay, repeat);
            case "EffectCircle": //形状一(圆)
                return this.getEffectCircle(parameter, object, isExit, duration, delay, repeat);
            case "EffectBox": //形状二(方框)
                return this.getEffectBox(parameter, object, isExit, duration, delay, repeat);
            case "EffectDiamond": //形状三(菱形)
                return this.getEffectDiamond(parameter, object, isExit, duration, delay, repeat);
            case "EffectPlus": //形状四(加号)
                return this.getEffectPlus(parameter, object, isExit, duration, delay, repeat);
            case "EffectGrowAndTurn": //翻转式由远及近
                return this.getEffectGrowAndTurn(parameter, object, isExit, duration, delay, repeat);
            case "EffectZoom": //基本缩放
                return this.getEffectZoom(parameter, object, isExit, duration, delay, repeat);
            case "EffectFadedZoom": //淡出式缩放
                return this.getEffectFadedZoom(parameter, object, isExit, duration, delay, repeat);
            case "EffectSwivel": //基本旋转
                return this.getEffectSwivel(parameter, object, isExit, duration, delay, repeat);
            case "EffectFadedSwivel": //旋转(淡出式回旋)
                return this.getEffectFadedSwivel(parameter, object, isExit, duration, delay, repeat);
            case "EffectBounce": //弹跳
                return this.getEffectBounce(parameter, object, isExit, duration, delay, repeat);
            case "EffectBlinds": //百叶窗
                return this.getEffectBlinds(parameter, object, isExit, duration, delay, repeat);
            case "EffectPeek": //切入/出
                return this.getEffectPeek(parameter, object, isExit, duration, delay, repeat);
            case "EffectExpand": //展开/收缩
                return this.getEffectExpand(parameter, object, isExit, duration, delay, repeat);
            case "EffectRiseUp": //升起/下沉
                return this.getEffectRiseUp(parameter, object, isExit, duration, delay, repeat);
            case "EffectCenterRevolve": //中心旋转
                return this.getEffectCenterRevolve(parameter, object, isExit, duration, delay, repeat);
            case "EffectSpinner": //回旋
                return this.getEffectSpinner(parameter, object, isExit, duration, delay, repeat);
            case "EffectFloat": //浮动
                return this.getEffectFloat(parameter, object, isExit, duration, delay, repeat);
            case "EffectSpiral": //螺旋飞入/出
                return this.getEffectSpiral(parameter, object, isExit, duration, delay, repeat);
            case "EffectPinwheel": //玩具风车
                return this.getEffectPinwheel(parameter, object, isExit, duration, delay, repeat);
            case "EffectCredits": //字幕式
                return this.getEffectCredits(parameter, object, isExit, duration, delay, repeat);
            case "EffectBoomerang": //飞旋
                return this.getEffectBoomerang(parameter, object, isExit, duration, delay, repeat);
            case "EffectArcUp": //曲线向上/下
                return this.getEffectArcUp(parameter, object, isExit, duration, delay, repeat);
            case "EffectFlashBulb": //脉冲
                return this.getEffectFlashBulb(parameter, object, duration, delay, repeat);
            case "EffectFlicker": //彩色脉冲
                return this.getEffectFlicker(parameter, object, duration, delay, repeat);
            case "EffectTeeter": //跷跷板
                return this.getEffectTeeter(parameter, object, duration, delay, repeat);
            case "EffectSpin": //陀螺旋转
                return this.getEffectSpin(parameter, object, duration, delay, repeat);
            case "EffectGrowShrink": //放大/缩小
                return this.getEffectGrowShrink(parameter, object, duration, delay, repeat);
            case "EffectDesaturate": //不饱和
                return this.getEffectDesaturate(parameter, object, duration, delay, repeat);
            case "EffectDarken": //加深
                return this.getEffectDarken(parameter, object, duration, delay, repeat);
            case "EffectLighten": //变淡
                return this.getEffectLighten(parameter, object, duration, delay, repeat);
            case "EffectTransparency": //透明
                return this.getEffectTransparency(parameter, object, duration, delay, repeat);
            case "EffectColorBlend": //对象颜色
                return new TimelineMax();
            case "EffectComplementaryColor": //补色
                return this.getEffectComplementaryColor(parameter, object, duration, delay, repeat);
            case "EffectChangeLineColor": //线条颜色
                return new TimelineMax();
            case "EffectChangeFillColor": //填允颜色
                return new TimelineMax();
            case "EffectFlashOnce": //闪烁(一次)
                return this.getEffectFlashOnce(parameter, object, duration, delay, repeat);
                //进入退出动画
            default:
            case "EffectAppear": //出现/消失
                return this.getEffectAppear(parameter, object, isExit, duration, delay, repeat);
        }
    }

    /**
     * 初始化
     * @param  {[type]} startEvent    [description]
     * @param  {[type]} completeEvent [description]
     * @return {[type]}               [description]
     */
    _initAnimation(completeEvent) {
        let self = this

        /**
         * 整个动画完成事件(动画不需继续执行视为执行完成)
         * @return {[type]} [description]
         */
        let completeAction = function() {
            if (completeEvent && _.isFunction(completeEvent)) {
                completeEvent()
            }
        }

        let start = new TimelineLite({
            paused: true,
            onStartParams: [this.preCode],
            onCompleteParams: [this.postCode, this.codeDelay],
            onStart(preCode) {
                //条件判断动画是否执行
                if (preCode && _.isFunction(preCode)) {
                    self.animation.pause();
                    let result = false;
                    try {
                        result = preCode();
                    } catch (error) {
                        console.log("Run preCode is error in startHandler:" + error)
                    }
                    if (result == true)
                        self.animation.resume()
                    else {
                        self.animation.stop()
                        completeAction()
                    }
                }
            },
            onComplete(postCode, codeDelay) {
                self.isCompleted = true;
                //延迟执行postCode代码
                try {
                    if (typeof(postCode) == "function") {
                        if (codeDelay > 0) {
                            setTimeout(postCode, codeDelay);
                        } else {
                            postCode()
                        }
                    }
                } catch (error) {
                    console.log("Run postCode is error in completeHandler:" + error)
                }
                completeAction()
            }
        });

        for (var i = 0; i < this.options.length; i++) {
            if (i == 0) {
                start.add(this._getTimeline(this.options[i], i), "shape0");
            } else {
                var invokeMode = this.options[i].invokeMode;
                if (invokeMode == 2)
                    start.add(this._getTimeline(this.options[i], i));
                else
                    start.add(this._getTimeline(this.options[i], i), "shape0"); //"shape"+(i-1)
            }
        }
        return start;
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
        this.animation = this._initAnimation(animComplete)
        this.animation.play()
    }


    /**
     * 停止动画
     * @return {[type]} [description]
     */
    stop() {
        if (this.animation instanceof TimelineLite) {
            this.animation.stop();
            this.animation.kill();
            this.animation.clear();
        }
        this.animation = null;
    }


    /**
     * 复位动画
     * @return {[type]} [description]
     */
    reset() {
        this.stop();
        if (this.elementStyle && this.elementStyle.length > 0) {
            var origin = this.element.css("-webkit-transform-origin");
            var isscroll = this.element.attr("isscroll");
            if (isscroll == null) this.element[0].style.cssText = this.elementStyle; //卷滚区域里的对象不需要还原
            this.element.css("-webkit-transform-origin", origin);
            this.element.css("visibility", this.elementVisibility);
            this.element.css("-webkit-transform", "none");
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
