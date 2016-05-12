/*基本动画API*/

var methods = {
    init: function(options) {
        return {
            parameter: {
                direction: "Direction" + options.direction,
                tweenEase: options.tweenEase,
                keepRatio: options.keepRatio,
                scaleX: options.scaleX,
                scaleY: options.scaleY,
                fullScreen: options.fullScreen,
                resetSize: options.resetSize,
                amount: options.amount,
                centerPos: options.centerPos,
                axis: options.axis,
                degree: options.degree,
                clockWise: options.clockWise,
                mode: options.mode,
                range: options.range,
                path: options.path,
                objFollow: options.objFollow,
                distance: options.distance,
                scaleFactor: options.scaleFactor
            },
            isExit: (options.isExit) ? true : false,
            duration: (options.duration > 0) ? options.duration / 1000 : 1,
            delay: Number(options.delay) ? Number(options.delay) / 1000 : 0,
            repeat: options.repeat
        }
    },
    //出现/消失
    appear: function(options) {
        var data = methods.init(options);
        var t1 = new PptAnimation().getEffectAppear(data.parameter, this, data.isExit, data.duration, data.delay, data.repeat);
    },
    //渐渐出现/消失
    fade: function(options) {
        var data = methods.init(options);
        var t1 = new PptAnimation().getEffectFade(data.parameter, this, data.isExit, data.duration, data.delay, data.repeat);
    },
    //飞入/出
    fly: function(options) {
        if (options.direction.length == 0) options.direction = "Down";
        var data = methods.init(options);
        var t1 = new PptAnimation().getEffectFly(data.parameter, this, data.isExit, data.duration, data.delay, data.repeat);
    },
    //浮入/浮出(上方)
    ascend: function(options) {
        var data = methods.init(options);
        var t1 = new PptAnimation().getEffectAscend(data.parameter, this, data.isExit, data.duration, data.delay, data.repeat);
    },
    //浮入/浮出(上方)
    descend: function(options) {
        var data = methods.init(options);
        var t1 = new PptAnimation().getEffectDescend(data.parameter, this, data.isExit, data.duration, data.delay, data.repeat);
    },
    //缩放(淡出式缩放)
    zoom: function(options) {
        if (options.direction.length == 0) {
            if ((options.isExit + "").toLowerCase() == "true")
                options.direction = "Out";
            else
                options.direction = "In";
        }
        var data = methods.init(options);
        var t1 = new PptAnimation().getEffectFadedZoom(data.parameter, this, data.isExit, data.duration, data.delay, data.repeat);
    },
    //旋转(淡出式回旋)
    swivel: function(options) {
        var data = methods.init(options);
        var t1 = new PptAnimation().getEffectFadedSwivel(data.parameter, this, data.isExit, data.duration, data.delay, data.repeat);
    },
    //弹跳
    bounce: function(options) {
        var data = methods.init(options);
        var t1 = new PptAnimation().getEffectBounce(data.parameter, this, data.isExit, data.duration, data.delay, data.repeat);
    },
    //切入/出
    peek: function(options) {
        if (options.direction.length == 0) options.direction = "Down";
        var data = methods.init(options);
        var t1 = new PptAnimation().getEffectPeek(data.parameter, this, data.isExit, data.duration, data.delay, data.repeat);
    },
    //浮动
    floats: function(options) {
        var data = methods.init(options);
        var t1 = new PptAnimation().getEffectFloat(data.parameter, this, data.isExit, data.duration, data.delay, data.repeat);
    },
    //螺旋飞入/出
    spiral: function(options) {
        var data = methods.init(options);
        var t1 = new PptAnimation().getEffectSpiral(data.parameter, this, data.isExit, data.duration, data.delay, data.repeat);
    },
    //曲线向上/下
    arcup: function(options) {
        var data = methods.init(options);
        var t1 = new PptAnimation().getEffectArcUp(data.parameter, this, data.isExit, data.duration, data.delay, data.repeat);
    },
    //脉冲
    bulb: function(options) {
        var data = methods.init(options);
        var t1 = new PptAnimation().getEffectFlashBulb(data.parameter, this, data.duration, data.delay, data.repeat);
    },
    //彩色脉冲
    flicker: function(options) {
        var data = methods.init(options);
        var t1 = new PptAnimation().getEffectFlicker(data.parameter, this, data.duration, data.delay, data.repeat);
    },
    //跷跷板
    teeter: function(options) {
        var data = methods.init(options);
        var t1 = new PptAnimation().getEffectTeeter(data.parameter, this, data.duration, data.delay, data.repeat);
    },
    //陀螺旋转
    spin: function(options) {
        var data = methods.init(options);
        var t1 = new PptAnimation().getEffectSpin(data.parameter, this, data.duration, data.delay, data.repeat);
    },
    //放大/缩小
    growshrink: function(options) {
        var data = methods.init(options);
        var t1 = new PptAnimation().getEffectGrowShrink(data.parameter, this, data.duration, data.delay, data.repeat);
    },
    //路径动画
    path: function(options) {
        var data = methods.init(options);
        //this.css("visibility","visible");
        var t1 = new PptAnimation().getPathAnimation(data.parameter, this, data.duration, data.delay, data.repeat);
    },
    destroy: function() {}
};

$.fn.pptani = function(method, options) {
    var opts = $.extend({}, $.fn.pptani.defaults, options);
    opts.repeat = (opts.repeat > 0) ? opts.repeat - 1 : -1;
    if (methods[method]) {
        method = methods[method];
        return this.each(function() {
            return method.apply($(this), [opts]);
        });
    } else {
        console.error('Method ' + method + ' does not exist on jQuery.pptapi.');
        return this;
    }
};

//插件的defaults
$.fn.pptani.defaults = {
    isExit: false, //是否为退出动画(默认为显示动画)
    direction: '', //运动方向(Down、Up、Left、Right)
    duration: 1000, //动画时间(毫秒)
    delay: 0, //延时时间(毫秒)
    repeat: 1, //执行次数
    //keepRatio : 1, //保持长宽比(1、0)
    //scaleX : 1, //横向缩放比例
    //scaleY : 1, //纵向缩放比例
    //fullScreen : 0, //是否缩放至全屏
    //resetSize : 0, //恢复默认尺寸
    //amount : 0, //陀螺旋转角度或透明度(用于强调动画)
    //centerPos : 0, //中心位置(0~8)
    //axis : 0, //旋转轴(Z:0、X:1、Y:2)
    //degree : 0, //旋转角度
    //clockWise : 1, //顺时针旋转(1:顺时针、0:逆时针)
    //mode : 0, //跷跷板模式(0`4)
    //range : 0.02, //运动幅度(百分比)
    //path : '', //路径(M 0 0 L 0.25 0 E)
    //objFollow : 0, //对象跟随(0:无变化、1:自动旋转、2:自动翻转)
    //distance : 0, //距离
    //scaleFactor : 1, //缩放比例
    tweenEase: 'Linear.easeNone' //ease效果(Linear.easeNone)
};
