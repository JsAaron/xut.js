/**
 *
 *  zepto 动画增强
 *        基于animations 关键帧动画
 *
 * 	@by
 *      Aaron  2013.5.25
 * 
 *
 *	-webkit-animation: name, duration, timing-function, delay, iteration_count, direction
 *	
 *	-webkit-animation-name    这个属性的使用必须结合@-webkit-keyframes一起使用
 *	-webkit-animation-duration   表示动画持续的时间
 *	-webkit-animation-timing-function  表示动画使用的时间曲线
 *	-webkit-animation-delay    表示开始动画之前的延时
 *	-webkit-animation-iteration-count  表示动画要重复几次
 *	-webkit-animation-direction   表示动画的方向
 *
 *  -webkit-animation-fill-mode : none (默认)| backwards | forwards | both  设置动画开始之前和结束之后的行为
 *  -webkit-animation-play-state: running（默认） | paused  设置动画的运行状态
 *
 *
 *	综合案例：

		@-webkit-keyframes fontbulger {
		   0% {font-size: 10px;}
		  30% {font-size: 15px;}
		  100% {font-size: 12px;}
		}

	#box {
		-webkit-animation-name:  fontbulger;
		-webkit-animation-duration: 1s;
		-webkit-animation-iteration-count:3;
		-webkit-animation-direction: alternate;
		-webkit-animation-timing-function: ease-out;
		-webkit-animation-fill-mode: both;
		-webkit-animation-delay: 2s;}

		<div id="box">文字变化</div>
 *
 * 
 */
(function($){
	//默认只兼容webkit内核的动画
	var animation = 'WebkitAnimation';
	var prefixJS  = 'Webkit';
	var prefixCSS = '-webkit-';
	var animationend;

    var hasOwn     = Object.prototype.hasOwnProperty;
    var ArrayProto = Array.prototype;
    var slice      = ArrayProto.slice;
    var rformat    = /\\?\#{([^{}]+)\}/gm;

    /**
     * animation-play-state检索或设置对象动画的状态，
     *    running：默认值。运动
     *    paused：暂停
     * 如果提供多个属性值，以逗 号进行分隔。
     */
    var playState = 'WebkitAnimationPlayState';

	//事件名称
    var eventName = {
        AnimationEvent: 'animationend',
        WebKitAnimationEvent: 'webkitAnimationEnd'
    };

    //事件侦测
    for (var name in eventName) {
        try {
            document.createEvent(name);
            animationend = eventName[name];
            break;
        } catch (e) {
        }
    }


    //CSSStyleRule的模板
    var classRule = ".#{className}{ #{prefix}animation: #{frameName} #{duration} #{easing} " +
            "#{count} #{direction}; #{prefix}animation-fill-mode:#{mode}  }";


    //CSSKeyframesRule的模板
    var frameRule = "@#{prefix}keyframes #{frameName}{ 0%{ #{from}; } 100%{  #{to}; }  }";
	

    //=============================各种合成动画==================================
    //
    var fxAttrs = [
        ["height", "marginTop", "marginBottom", "borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"],
        ["width", "marginLeft", "marginRight", "borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"],
        ["opacity"]
    ];

    //生成属性包
    function genFx(type, num) { 
        var obj = {};
        fxAttrs.concat.apply([], fxAttrs.slice(0, num)).forEach(function(name) {
            obj[name] = type;
        });
        return obj;
    }

    //=================================参数处理==================================
    function addOption(opts, p) {
        switch (typeof p) {
            case "object":
                mix(opts, p);
                delete p.props;
                break;
            case "number":
                opts.duration = p;
                break;
            case "string":
                opts.easing = p;
                break;
            case "function":
                opts.complete = p;
                break;
        }
    }


    function addOptions(duration) {
        var opts = {};
        //如果第二参数是对象
        for (var i = 1; i < arguments.length; i++) {
            addOption(opts, arguments[i]);
        }
        duration = opts.duration;
        duration = /^\d+(ms|s)?$/.test(duration) ? duration + "" : "1000ms";
        if (duration.indexOf("s") === -1) {
            duration += "ms";
        }
        opts.duration = duration;
        opts.effect = opts.effect || "fx";
        opts.queue = !!(opts.queue == null || opts.queue); //默认使用列队
        opts.easing = easingMap[opts.easing] ? opts.easing : "easeIn";
        return opts;
    }


    //=================================扩展动画==================================

    var emptyfn = [];
    var preAnimate = $.fn.animate;

    $.fn.animate = function(keyframe){
		if (keyframe != 'usekeyframe') {
			return preAnimate.apply(this, arguments);
		} else {
			var args = emptyfn.concat.apply([genFx(name, 3), {
					effect: name
				}
			], emptyfn.slice.call(arguments, 1));
			return animate.apply(this, args);
		}
    }

    function animate(props){
        var opts = {
            queue: true
        };

        opts = addOptions.apply(null, arguments);

        //转换为驼峰风格并加上必要的私有前缀
		props = {
			opacity: "show"
		};
 	
 		//此对象引用的所有元素都共用同一类名,类名是在这id加工而来
		var id = setTimeout("1");

		return this.each(function(i, node) {
			//通过此方法决定执行与否
			var queue = [];
			queue.push([id, props, opts]);
			nextAnimation(node, queue);
		});
    }


    var noop = function(){};
    var AnimationRegister = {};

    function startAnimation(node, id, props, opts){

        var effectName = opts.effect;
        var className = "fx_" + effectName + "_" + id;
        var frameName = "keyframe_" + effectName + "_" + id;

        //各种回调
        var after    = opts.after || noop;
        var before   = opts.before || noop;
        var complete = opts.complete || noop;
        var from     = [],
        to           = [];

        var count = AnimationRegister[className];

        //保存到元素上，方便stop方法调用
        node[className] = props;


        if(!count){
            //如果样式表中不存在这两条样式规则
            count = AnimationRegister[className] = 0;

            $.each(props, function(key, val) {
                var selector = key.replace(/[A-Z]/g, function(a) {
                    return "-" + a.toLowerCase();
                });

                if (val === "show") {
                    from.push(selector + ":0");
                    to.push(selector + ":1")
                } else if (val === "hide") { //hide
                    from.push(selector + ":1");
                    to.push(selector + ":0")
                } 
            });    

            var easing = "cubic-bezier( " + easingMap[opts.easing] + " )";

            var mode = effectName === "hide" ? "backwards" : "forwards";

            var rule1 = format(classRule, {
                className : className,
                duration  : opts.duration,
                easing    : easing,
                frameName : frameName,
                mode      : mode,
                prefix    : prefixCSS,
                count     : opts.revert ? 2 : 1,
                direction : opts.revert ? "alternate" : ""
            });

            var rule2 = format(frameRule, {
                frameName : frameName,
                prefix    : prefixCSS,
                from      : from.join("; "),
                to        : to.join(";")
            });

            insertCSSRule(rule1);
            insertCSSRule(rule2);
        }

        //生成一条规则
        AnimationRegister[className] = count + 1;
        
        //监控动画
        $(node).bind(animationend, function() {

            $(node).unbind(animationend);

            var styles = window.getComputedStyle(node, null);

            // 保存最后的样式
            for (var i in props) {
                if (props.hasOwnProperty(i)) {
                    node.style[i] = styles[i];
                }
            }

            $(node).removeClass(className); //移除类名

            stopAnimation(className); //尝试移除keyframe

            complete(node);
        });

        before(node);

        $(node).addClass(className)
    }


    function stopAnimation(className) {
        var count = AnimationRegister[className];
        if (count) {
            AnimationRegister[className] = count - 1;
            if (AnimationRegister[className] <= 0) {
                var frameName = className.replace("fx", "keyframe");
                deleteKeyFrames(frameName);
                deleteCSSRule("." + className);
            }
        }
    }

	function nextAnimation(node, queue) {
        //动画开始计数
        if (!queue.busy) {
            queue.busy = 1;
            var args = queue.shift();
            if (isFinite(args)) {//如果是数字
                setTimeout(function() {
                    queue.busy = 0;
                    nextAnimation(node, queue);
                }, args);
            } else if (Array.isArray(args)) {
                startAnimation(node, args[0], args[1], args[2]);
            } else {
                queue.busy = 0;
            }
        }
	}

    //==================样式规则相关辅助函数===============

    var styleElement;

    function insertCSSRule(rule) {
        //动态插入一条样式规则
        if (styleElement) {
            var number = 0;
            try {
                var sheet = styleElement.sheet;
                var cssRules = sheet.cssRules; 
                number = cssRules.length;
                sheet.insertRule(rule, number);
            } catch (e) {
                console.log(e.message + rule);
            }
        } else {
            styleElement = document.createElement("style");
            styleElement.innerHTML = rule;
            document.head.appendChild(styleElement);
        }
    }

    function deleteCSSRule(ruleName, keyframes) {
        //删除一条样式规则
        var prop = keyframes ? "name" : "selectorText";
        var name = keyframes ? "@keyframes " : "cssRule ";//调试用
        if (styleElement) {
            var sheet = styleElement.sheet;// styleElement.styleSheet;
            var cssRules = sheet.cssRules;// sheet.rules;
            for (var i = 0, n = cssRules.length; i < n; i++) {
                var rule = cssRules[i];
                if (rule[prop] === ruleName) {
                    sheet.deleteRule(i);
                    console.log("已经成功删除" + name + " " + ruleName);
                    break;
                }
            }
        }
    }

    function deleteKeyFrames(name) {
        //删除一条@keyframes样式规则
        deleteCSSRule(name, true);
    }


    //=======================方法增强==========================
    //
	function mix(receiver, supplier) {
		var args = [].slice.call(arguments),
			i = 1,
			key, //如果最后参数是布尔，判定是否覆写同名属性
			ride = typeof args[args.length - 1] === "boolean" ? args.pop() : true;
		if (args.length === 1) { //处理$.mix(hash)的情形
			receiver = !this.window ? this : {};
			i = 0;
		}
		while ((supplier = args[i++])) {
			for (key in supplier) { //允许对象糅杂，用户保证都是对象
				if (hasOwn.call(supplier, key) && (ride || !(key in receiver))) {
					receiver[key] = supplier[key];
				}
			}
		}
		return receiver;
	}

    /**
     * 字符串插值，有两种插值方法。
     * 第一种，第二个参数为对象，#{}里面为键名，替换为键值，适用于重叠值够多的情况
     * 第二种，把第一个参数后的参数视为一个数组，#{}里面为索引值，从零开始，替换为数组元素
     * http://www.cnblogs.com/rubylouvre/archive/2011/05/02/1972176.html
     * @param {String}
     * @param {Object|Any} 插值包或某一个要插的值
     * @return {String}
     */
    function format(str, object) {
        var array = slice(arguments, 1);
        return str.replace(rformat, function(match, name) {
            if (match.charAt(0) === "\\")
                return match.slice(1);
            var index = Number(name);
            if (index >= 0)
                return array[index];
            if (object && object[name] !== void 0)
                return object[name];
            return '';
        });
    };


    //提供以下原型方法
    //fx animate, fadeIn fadeToggle fadeOut slideUp, slideDown slideToggle show hide toggle delay resume stop
    var easingMap = {
        "linear": [0.250, 0.250, 0.750, 0.750],
        "ease": [0.250, 0.100, 0.250, 1.000],
        "easeIn": [0.420, 0.000, 1.000, 1.000],
        "easeOut": [0.000, 0.000, 0.580, 1.000],
        "easeInOut": [0.420, 0.000, 0.580, 1.000],
        "easeInQuad": [0.550, 0.085, 0.680, 0.530],
        "easeInCubic": [0.550, 0.055, 0.675, 0.190],
        "easeInQuart": [0.895, 0.030, 0.685, 0.220],
        "easeInQuint": [0.755, 0.050, 0.855, 0.060],
        "easeInSine": [0.470, 0.000, 0.745, 0.715],
        "easeInExpo": [0.950, 0.050, 0.795, 0.035],
        "easeInCirc": [0.600, 0.040, 0.980, 0.335],
        "easeInBack": [0.600, -0.280, 0.735, 0.045],
        "easeOutQuad": [0.250, 0.460, 0.450, 0.940],
        "easeOutCubic": [0.215, 0.610, 0.355, 1.000],
        "easeOutQuart": [0.165, 0.840, 0.440, 1.000],
        "easeOutQuint": [0.230, 1.000, 0.320, 1.000],
        "easeOutSine": [0.390, 0.575, 0.565, 1.000],
        "easeOutExpo": [0.190, 1.000, 0.220, 1.000],
        "easeOutCirc": [0.075, 0.820, 0.165, 1.000],
        "easeOutBack": [0.175, 0.885, 0.320, 1.275],
        "easeInOutQuad": [0.455, 0.030, 0.515, 0.955],
        "easeInOutCubic": [0.645, 0.045, 0.355, 1.000],
        "easeInOutQuart": [0.770, 0.000, 0.175, 1.000],
        "easeInOutQuint": [0.860, 0.000, 0.070, 1.000],
        "easeInOutSine": [0.445, 0.050, 0.550, 0.950],
        "easeInOutExpo": [1.000, 0.000, 0.000, 1.000],
        "easeInOutCirc": [0.785, 0.135, 0.150, 0.860],
        "easeInOutBack": [0.680, -0.550, 0.265, 1.550],
        "custom": [0.000, 0.350, 0.500, 1.300],
        "random": [Math.random().toFixed(3),
            Math.random().toFixed(3),
            Math.random().toFixed(3),
            Math.random().toFixed(3)]
    };

})(Zepto);









