
import {hasTouch, onTouchMove} from './support'

import {
    calculateDistance,
    calculateDirection,
    colorHexToRGB
} from './util'


export function internal(animproto) {

    //文字动画
    animproto.getTextAnimation = function (parameter, object, duration, delay, repeat) {
        if (delay == 0) delay = 0.1; //子对象间延时不能为0
        var type = (parameter.effectType) ? parameter.effectType : "text1";
        var color = (parameter.startColor) ? parameter.startColor : "";
        var svgElement = object.find("svg").children();
        var t1 = new TimelineMax({
            repeat: repeat,
            onStart: this.startHandler,
            onStartParams: [parameter, object, {
                visibility: "visible"
            }],
            onComplete: this.completeHandler,
            onCompleteParams: [parameter, object]
        });
        switch (type) {
            default:
            case "text5": //文字逐行蹦出(以行为单位)
            case "text1": //文字逐个蹦出(以字为单位)
                t1.staggerFrom(svgElement.children(), duration, {
                    css: {
                        'opacity': 0
                    }
                }, delay);
                break;
            case "text2": //文字放大出现(以字为单位)
                t1.staggerFrom(svgElement.children(), duration, {
                    css: {
                        'opacity': 0,
                        "font-size": 120
                    },
                    ease: "Strong.easeOut"
                }, delay);
                break;
            case "text3": //文字缩小出现(以字为单位)
                t1.staggerFrom(svgElement.children(), duration, {
                    css: {
                        'opacity': 0,
                        "font-size": 0
                    },
                    ease: "Power1.easeIn"
                }, delay);
                break;
            case "text4": //文字渐变出现(以字为单位)
                t1.staggerFrom(svgElement.children(), duration, {
                    css: {
                        'opacity': 0,
                        "fill": color
                    },
                    ease: "Power1.easeIn"
                }, delay);
                break;
        }
        return t1;
    }

    //出现/消失
    animproto.getEffectAppear = function (parameter, object, isExit, duration, delay, repeat) {
        var t1 = new TimelineMax({
            delay: delay,
            repeat: repeat,
            onStart: this.startHandler,
            onStartParams: [parameter, object],
            onComplete: this.completeHandler,
            onCompleteParams: [parameter, object]
        });
        if (isExit == false)
            t1.to(object, 0.001, {
                autoAlpha: 1
            });
        else
            t1.to(object, 0.001, {
                css: {
                    visibility: "hidden"
                }
            });
        return t1;
    }

    //淡出
    animproto.getEffectFade = function (parameter, object, isExit, duration, delay, repeat) {
        var t1 = null;
        if (isExit == false) {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object]
            });
            t1.from(object, duration, {
                autoAlpha: 0,
                ease: parameter.tweenEase,
                immediateRender: false
            });
        } else {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object, {
                    opacity: 1
                }]
            });
            t1.to(object, duration, {
                autoAlpha: 0,
                ease: parameter.tweenEase
            });
        }
        return t1;
    }

    //飞入效果
    animproto.getEffectFly = function (parameter, object, isExit, duration, delay, repeat) {
        var direction = parameter.direction; //方向(上、下、左、右、左上、左下、右上、右下)
        var t1 = null;
        var objInfo = this._getObjectInfo(object);
        var easeString = Expo.easeOut;
        var x, y

        if (parameter.tweenEase && parameter.tweenEase.length > 0) easeString = parameter.tweenEase;
        if (parameter.smoothStart == 1 || parameter.smoothEnd == 1 || parameter.bounceEnd == 1) {
            if (isExit == true)
                easeString = Power4.easeOut;
            else
                easeString = Elastic.easeOut;
        }

        if (isExit == false) {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object, {
                    visibility: "visible"
                }],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object, {
                    visibility: "visible"
                }]
            });
            switch (direction) {
                case "DirectionDown":
                    y = objInfo.offsetBottom + objInfo.height;
                    t1.from(object, duration, {
                        y: y,
                        ease: easeString,
                        immediateRender: false
                    });
                    break;
                case "DirectionLeft":
                    x = 0 - (objInfo.offsetLeft + objInfo.width);
                    t1.from(object, duration, {
                        x: x,
                        ease: easeString,
                        immediateRender: false
                    });
                    break;
                case "DirectionUp":
                    y = 0 - (objInfo.offsetTop + objInfo.height);
                    t1.from(object, duration, {
                        y: y,
                        ease: easeString,
                        immediateRender: false
                    });
                    break;
                case "DirectionRight":
                    x = objInfo.offsetRight + objInfo.width;
                    t1.from(object, duration, {
                        x: x,
                        ease: easeString,
                        immediateRender: false
                    });
                    break;
                case "DirectionDownLeft":
                    x = 0 - (objInfo.offsetLeft + objInfo.width);
                    y = objInfo.offsetBottom + objInfo.height;
                    t1.from(object, duration, {
                        x: x,
                        y: y,
                        ease: easeString,
                        immediateRender: false
                    });
                    break;
                case "DirectionDownRight":
                    x = objInfo.offsetRight + objInfo.width;
                    y = objInfo.offsetBottom + objInfo.height;
                    t1.from(object, duration, {
                        x: x,
                        y: y,
                        ease: easeString,
                        immediateRender: false
                    });
                    break;
                case "DirectionUpLeft":
                    x = 0 - (objInfo.offsetLeft + objInfo.width);
                    y = 0 - (objInfo.offsetTop + objInfo.height);
                    t1.from(object, duration, {
                        x: x,
                        y: y,
                        ease: easeString,
                        immediateRender: false
                    });
                    break;
                case "DirectionUpRight":
                    x = objInfo.offsetRight + objInfo.width;
                    y = 0 - (objInfo.offsetTop + objInfo.height);
                    t1.from(object, duration, {
                        x: x,
                        y: y,
                        ease: easeString,
                        immediateRender: false
                    });
                    break;
                default:
                    console.log("getEffectFly:parameter error.");
                    break;
            }
        } else {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object, {
                    x: 0,
                    y: 0,
                    visibility: "hidden" //clearProps功能(对象被还原)必须隐藏对象
                }]
            });
            switch (direction) {
                case "DirectionDown":
                    y = objInfo.offsetBottom + objInfo.height;
                    t1.to(object, duration, {
                        y: y,
                        //clearProps: "y",
                        ease: easeString
                    });
                    break;
                case "DirectionLeft":
                    x = 0 - (objInfo.offsetLeft + objInfo.width);
                    t1.to(object, duration, {
                        x: x,
                        //clearProps: "x",
                        ease: easeString
                    });
                    break;
                case "DirectionUp":
                    y = 0 - (objInfo.offsetTop + objInfo.height);
                    t1.to(object, duration, {
                        y: y,
                        //clearProps: "y",
                        ease: easeString
                    });
                    break;
                case "DirectionRight":
                    x = objInfo.offsetRight + objInfo.width;
                    t1.to(object, duration, {
                        x: x,
                        //clearProps: "x",
                        ease: easeString
                    });
                    break;
                case "DirectionDownLeft":
                    x = 0 - (objInfo.offsetLeft + objInfo.width);
                    y = objInfo.offsetBottom + objInfo.height;
                    t1.to(object, duration, {
                        x: x,
                        y: y,
                        //clearProps: "x,y",
                        ease: easeString
                    });
                    break;
                case "DirectionDownRight":
                    x = objInfo.offsetRight + objInfo.width;
                    y = objInfo.offsetBottom + objInfo.height;
                    t1.to(object, duration, {
                        x: x,
                        y: y,
                        //clearProps: "x,y",
                        ease: easeString
                    });
                    break;
                case "DirectionUpLeft":
                    x = 0 - (objInfo.offsetLeft + objInfo.width);
                    y = 0 - (objInfo.offsetTop + objInfo.height);
                    t1.to(object, duration, {
                        x: x,
                        y: y,
                        //clearProps: "x,y",
                        ease: easeString
                    });
                    break;
                case "DirectionUpRight":
                    x = objInfo.offsetRight + objInfo.width;
                    y = 0 - (objInfo.offsetTop + objInfo.height);
                    t1.to(object, duration, {
                        x: x,
                        y: y,
                        //clearProps: "x,y",
                        ease: easeString
                    });
                    break;
                default:
                    console.log("getEffectFly:parameter error.")
                    break;
            }
        }
        return t1;
    }

    //浮入/浮出(下方)
    animproto.getEffectAscend = function (parameter, object, isExit, duration, delay, repeat) {
        var t1 = null;
        if (isExit == false) {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object]
            });
            //t1.to(object, 0.001, {opacity: 0, y: 100}).to(object, duration - 0.001, {autoAlpha: 1, y: 0, ease: parameter.tweenEase});
            t1.from(object, duration, {
                autoAlpha: 0,
                y: 100,
                ease: parameter.tweenEase,
                immediateRender: false
            });
        } else {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object, {
                    opacity: 1,
                    y: 0
                }]
            });
            t1.to(object, duration, {
                autoAlpha: 0,
                y: 100,
                //clearProps: "y", //己失效
                ease: parameter.tweenEase
            });
        }
        return t1;
    }

    //浮入/浮出(上方)
    animproto.getEffectDescend = function (parameter, object, isExit, duration, delay, repeat) {
        var t1 = null;
        if (isExit == false) {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object]
            });
            //t1.to(object, 0.001, {y: -100}).to(object, duration - 0.001, {autoAlpha: 1, y: 0, ease: parameter.tweenEase});
            t1.from(object, duration, {
                autoAlpha: 0,
                y: -100,
                ease: parameter.tweenEase,
                immediateRender: false
            });
        } else {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object, {
                    opacity: 1
                }]
            });
            t1.to(object, duration, {
                autoAlpha: 0,
                y: -100,
                ease: parameter.tweenEase,
                clearProps: "y"
            });
        }
        return t1;
    }

    //形状一(圆)
    animproto.getEffectCircle = function (parameter, object, isExit, duration, delay, repeat) {
        if (this.useMask == false) return this.getEffectAppear(parameter, object, isExit, duration, delay, repeat);

        var direction = parameter.direction; //方向(DirectionIn、DirectionOut)
        var t1 = new TimelineMax({
            delay: delay,
            repeat: repeat,
            onStart: this.startHandler,
            onStartParams: [parameter, object, {
                visibility: "visible"
            }],
            onComplete: this.completeHandler,
            onCompleteParams: [parameter, object]
        })
        var result = this._getObjectInfo(object);
        var radius = Math.ceil(Math.sqrt(result.width * result.width / 4 + result.height * result.height / 4));
        switch (direction) {
            case "DirectionIn": //放大
            case "DirectionOut": //缩小
                if (isExit == false) {
                    t1.to(object, duration, {
                        onUpdate: updateCircleGradient
                    });
                } else {
                    t1.to(object, duration, {
                        onUpdate: updateCircleGradient
                    });
                }
                break;
            default:
                console.log("getEffectCircle:parameter error.");
                break;
        }
        return t1;

        function updateCircleGradient() {
            var progress = t1.progress();
            var len = parseInt(progress * radius);
            if (isExit == false)
                switch (direction) {
                    case "DirectionIn": //DirectionIn放大
                        object.css("-webkit-mask", "-webkit-gradient(radial,center center," + (radius - len) + ",center center,0,from(rgba(0,0,0,1)),to(rgba(0,0,0,0)),color-stop(10%,rgba(0,0,0,0)))");
                        if (len == radius) object.css("-webkit-mask", "none");
                        break;
                    case "DirectionOut": //DirectionOut缩小
                        object.css("-webkit-mask", "-webkit-gradient(radial,center center,0,center center, " + len + ",from(rgba(0,0,0,1)), to(rgba(0,0,0,0)), color-stop(90%, rgba(0,0,0,1)))");
                        if (len == radius) object.css("-webkit-mask", "none");
                        break;
                } else {
                switch (direction) {
                    case "DirectionIn": //DirectionIn放大
                        object.css("-webkit-mask", "-webkit-gradient(radial,center center," + (radius - len) + ",center center,0,from(rgba(0,0,0,0)),to(rgba(0,0,0,1)),color-stop(10%,rgba(0,0,0,1)))");
                        if (len == radius) {
                            //object.css("opacity","0");
                            object.css("visibility", "hidden");
                            object.css("-webkit-mask", "none");
                        }
                        break;
                    case "DirectionOut": //DirectionOut缩小
                        object.css("-webkit-mask", "-webkit-gradient(radial,center center,0,center center, " + len + ",from(rgba(0,0,0,0)), to(rgba(0,0,0,1)), color-stop(90%, rgba(0,0,0,0)))");
                        if (len == radius) {
                            //object.css("opacity","0");
                            object.css("visibility", "hidden");
                            object.css("-webkit-mask", "none");
                        }
                        break;
                }
            }
        }
    }

    //形状二(方框)
    animproto.getEffectBox = function (parameter, object, isExit, duration, delay, repeat) {
        var direction = parameter.direction; //方向(DirectionIn、DirectionOut)
        if (this.useMask == false) direction = "DirectionOut";

        var t1 = new TimelineMax({
            delay: delay,
            repeat: repeat,
            onStart: this.startHandler,
            onStartParams: [parameter, object, {
                visibility: "visible"
            }],
            onComplete: this.completeHandler,
            onCompleteParams: [parameter, object]
        });
        var objInfo = this._getObjectInfo(object);
        t1.to(object, duration, {
            onUpdate: updateEffectBox
        });
        return t1;

        function updateEffectBox() {
            var width, height, left, top
            var progress = t1.progress();
            var percent = progress / 2;
            if (isExit == false) {
                switch (direction) {
                    case "DirectionIn":
                        object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (percent) + ",rgba(0,0,0,1)),color-stop(" + (percent) + ",transparent),color-stop(" + (1 - percent) + ",transparent),color-stop(" + (1 - percent) + ",rgba(0,0,0,1))),-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (percent) + ",rgba(0,0,0,1)),color-stop(" + (percent) + ",transparent),color-stop(" + (1 - percent) + ",transparent),color-stop(" + (1 - percent) + ",rgba(0,0,0,1)))");
                        break;
                    case "DirectionOut":
                        top = objInfo.height * (0.5 - percent);
                        height = objInfo.height - top;
                        left = objInfo.width * (0.5 - percent);
                        width = objInfo.width - left;
                        object.css("clip", "rect(" + top + "px " + width + "px " + height + "px " + left + "px)");
                        break;
                    default:
                        console.log("getEffectBox:parameter error.");
                        break;
                }
                if (percent >= 0.5) object.css("-webkit-mask", "none");
            } else {
                switch (direction) {
                    case "DirectionIn":
                        object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",transparent),color-stop(" + (0.5 + percent) + ",transparent),color-stop(" + (0.5 + percent) + ",rgba(0,0,0,1))),-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",transparent),color-stop(" + (0.5 + percent) + ",transparent),color-stop(" + (0.5 + percent) + ",rgba(0,0,0,1)))");
                        break;
                    case "DirectionOut":
                        top = objInfo.height * percent;
                        height = objInfo.height - top;
                        left = objInfo.width * percent;
                        width = objInfo.width - left;
                        object.css("clip", "rect(" + top + "px " + width + "px " + height + "px " + left + "px)");
                        break;
                    default:
                        console.log("getEffectBox:parameter error.");
                        break;
                }
                if (percent >= 0.5) {
                    //object.css("opacity","0");
                    object.css("visibility", "hidden");
                    object.css("-webkit-mask", "none");
                }
            }
        }
    }

    //形状三(菱形)
    animproto.getEffectDiamond = function (parameter, object, isExit, duration, delay, repeat) {
        if (this.useMask == false) return this.getEffectAppear(parameter, object, isExit, duration, delay, repeat);

        var direction = parameter.direction; //方向(DirectionIn、DirectionOut)
        var t1 = new TimelineMax({
            delay: delay,
            repeat: repeat,
            onStart: this.startHandler,
            onStartParams: [parameter, object, {
                visibility: "visible"
            }],
            onComplete: this.completeHandler,
            onCompleteParams: [parameter, object]
        });
        // var objInfo = this._getObjectInfo(object);
        t1.to(object, duration, {
            onUpdate: updateEffectBox
        });
        return t1;

        function updateEffectBox() {
            var progress = t1.progress();
            var percent = progress / 2;
            if (isExit == false) {
                switch (direction) {
                    case "DirectionOut":
                    case "DirectionIn":
                        object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 100% 100%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (percent) + ",rgba(0,0,0,1)),color-stop(" + (percent) + ",transparent),color-stop(" + (1 - percent) + ",transparent),color-stop(" + (1 - percent) + ",rgba(0,0,0,1))),-webkit-gradient(linear,0% 100%, 100% 0%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (percent) + ",rgba(0,0,0,1)),color-stop(" + (percent) + ",transparent),color-stop(" + (1 - percent) + ",transparent),color-stop(" + (1 - percent) + ",rgba(0,0,0,1)))");
                        break;
                    default:
                        console.log("getEffectBox:parameter error.");
                        break;
                }
                if (percent >= 0.5) object.css("-webkit-mask", "none");
            } else {
                switch (direction) {
                    case "DirectionOut":
                    case "DirectionIn":
                        object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 100% 100%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",transparent),color-stop(" + (0.5 + percent) + ",transparent),color-stop(" + (0.5 + percent) + ",rgba(0,0,0,1))),-webkit-gradient(linear,0% 100%, 100% 0%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",transparent),color-stop(" + (0.5 + percent) + ",transparent),color-stop(" + (0.5 + percent) + ",rgba(0,0,0,1)))");
                        break;
                    default:
                        console.log("getEffectBox:parameter error.");
                        break;
                }
                if (percent >= 0.5) {
                    //object.css("opacity","0");
                    object.css("visibility", "hidden");
                    object.css("-webkit-mask", "none");
                }
            }
        }
    }

    //形状四(加号)
    animproto.getEffectPlus = function (parameter, object, isExit, duration, delay, repeat) {
        if (this.useMask == false) return this.getEffectAppear(parameter, object, isExit, duration, delay, repeat);

        var direction = parameter.direction; //方向(DirectionIn、DirectionOut)
        var t1 = new TimelineMax({
            delay: delay,
            repeat: repeat,
            onStart: this.startHandler,
            onStartParams: [parameter, object, {
                visibility: "visible"
            }],
            onComplete: this.completeHandler,
            onCompleteParams: [parameter, object]
        });
        t1.to(object, duration, {
            onUpdate: updateEffectPlus
        });
        return t1;

        function updateEffectPlus() {
            var progress = t1.progress();
            var percent = progress / 2;
            if (isExit == false) {
                switch (direction) {
                    case "DirectionIn":
                    case "DirectionOut":
                        object.css("-webkit-mask",
                            "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,0)), to(rgba(0,0,0,0))," + "color-stop(" + (0.5 - percent) + ",transparent),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,1))," + "color-stop(" + (0.5 + percent) + ",rgba(0,0,0,1)),color-stop(" + (0.5 + percent) + ",transparent))," + "-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,0)), to(rgba(0,0,0,0))," + "color-stop(" + (0.5 - percent) + ",transparent),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,1))," + "color-stop(" + (0.5 + percent) + ",rgba(0,0,0,1)),color-stop(" + (0.5 + percent) + ",transparent))");
                        break;
                    default:
                        console.log("getEffectPlus:parameter error.");
                        break;
                }
                if (percent >= 0.5) object.css("-webkit-mask", "none");
            } else {
                switch (direction) {
                    case "DirectionIn":
                    case "DirectionOut":
                        object.css("-webkit-mask",
                            "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,0)), to(rgba(0,0,0,0))," + "color-stop(" + (percent) + ",transparent),color-stop(" + (percent) + ",rgba(0,0,0,1))," + "color-stop(" + (1 - percent) + ",rgba(0,0,0,1)),color-stop(" + (1 - percent) + ",transparent))," + "-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,0)), to(rgba(0,0,0,0))," + "color-stop(" + (percent) + ",transparent),color-stop(" + (percent) + ",rgba(0,0,0,1))," + "color-stop(" + (1 - percent) + ",rgba(0,0,0,1)),color-stop(" + (1 - percent) + ",transparent))");
                        break;
                    default:
                        console.log("getEffectPlus:parameter error.");
                        break;
                }
                if (percent >= 0.5) {
                    //object.css("opacity","0");
                    object.css("visibility", "hidden");
                    object.css("-webkit-mask", "none");
                }
            }
        }

    }

    //百叶窗
    animproto.getEffectBlinds = function (parameter, object, isExit, duration, delay, repeat) {
        if (this.useMask == false) return this.getEffectAppear(parameter, object, isExit, duration, delay, repeat);

        var direction = parameter.direction; //方向（水平：DirectionHorizontal、垂直：DirectionVertical）
        var t1 = new TimelineMax({
            delay: delay,
            repeat: repeat,
            onStart: this.startHandler,
            onStartParams: [parameter, object, {
                visibility: "visible"
            }],
            onComplete: this.completeHandler,
            onCompleteParams: [parameter, object]
        });
        t1.to(object, duration, {
            onUpdate: updateEffectBlinds
        });
        return t1;

        function updateEffectBlinds() {
            var num = 6; //分成N等份
            var progress = t1.progress();
            var percent = progress / num;
            var avg = 1 / num;
            var temp = 0.01; //渐变的过渡区
            var str = "";
            if (isExit == false) {
                switch (direction) {
                    case "DirectionHorizontal": //水平
                        str = "-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,1)), to(rgba(0,0,0,0))" + ",color-stop(" + (percent) + ",rgba(0,0,0,1))" + ",color-stop(" + (percent + temp) + ",rgba(0,0,0,0))";
                        for (var i = 1; i < num; i++) {
                            str += ",color-stop(" + (i * avg) + ",rgba(0,0,0,0))" + ",color-stop(" + (i * avg + temp) + ",rgba(0,0,0,1))";
                            str += ",color-stop(" + (i * avg + percent) + ",rgba(0,0,0,1))" + ",color-stop(" + (i * avg + percent + temp) + ",rgba(0,0,0,0))";
                        }
                        str += ")";
                        break;
                    case "DirectionVertical": //垂直
                        str = "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,1)), to(rgba(0,0,0,0))" + ",color-stop(" + (percent) + ",rgba(0,0,0,1))" + ",color-stop(" + (percent + temp) + ",rgba(0,0,0,0))";
                        for (var j = 1; j < num; j++) {
                            str += ",color-stop(" + (j * avg) + ",rgba(0,0,0,0))" + ",color-stop(" + (j * avg + temp) + ",rgba(0,0,0,1))";
                            str += ",color-stop(" + (j * avg + percent) + ",rgba(0,0,0,1))" + ",color-stop(" + (j * avg + percent + temp) + ",rgba(0,0,0,0))";
                        }
                        str += ")";
                        break;
                    default:
                        console.log("getEffectBlinds:parameter error.");
                        break;
                }
                object.css("-webkit-mask", str);
                if (percent >= (avg - temp)) object.css("-webkit-mask", "none");
            } else {
                switch (direction) {
                    case "DirectionHorizontal": //水平
                        str = "-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,1)), to(rgba(0,0,0,0))" + ",color-stop(" + (1 - percent) + ",rgba(0,0,0,0))" + ",color-stop(" + (1 - percent - temp) + ",rgba(0,0,0,1))";
                        for (var n = 1; n < num; n++) {
                            str += ",color-stop(" + (n * avg) + ",rgba(0,0,0,1))" + ",color-stop(" + (n * avg - temp) + ",rgba(0,0,0,0))";
                            str += ",color-stop(" + (n * avg - percent) + ",rgba(0,0,0,0))" + ",color-stop(" + (n * avg - percent - temp) + ",rgba(0,0,0,1))";
                        }
                        str += ")";
                        break;
                    case "DirectionVertical": //垂直
                        str = "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,1)), to(rgba(0,0,0,0))" + ",color-stop(" + (1 - percent) + ",rgba(0,0,0,0))" + ",color-stop(" + (1 - percent - temp) + ",rgba(0,0,0,1))";
                        for (var k = 1; k < num; k++) {
                            str += ",color-stop(" + (k * avg) + ",rgba(0,0,0,1))" + ",color-stop(" + (k * avg - temp) + ",rgba(0,0,0,0))";
                            str += ",color-stop(" + (k * avg - percent) + ",rgba(0,0,0,0))" + ",color-stop(" + (k * avg - percent - temp) + ",rgba(0,0,0,1))";
                        }
                        str += ")";
                        break;
                    default:
                        console.log("getEffectBlinds:parameter error.");
                        break;
                }
                object.css("-webkit-mask", str);
                if (percent >= (avg - temp)) {
                    //object.css("opacity","0");
                    object.css("visibility", "hidden");
                    object.css("-webkit-mask", "none");
                }
            }
        }
    }

    //劈裂
    animproto.getEffectSplit = function (parameter, object, isExit, duration, delay, repeat) {
        if (this.useMask == false) return this.getEffectAppear(parameter, object, isExit, duration, delay, repeat);

        var direction = parameter.direction; //方向(DirectionVerticalIn、DirectionHorizontalIn、DirectionHorizontalOut、DirectionVerticalOut)
        var t1 = new TimelineMax({
            delay: delay,
            repeat: repeat,
            onStart: this.startHandler,
            onStartParams: [parameter, object, {
                visibility: "visible"
            }],
            onComplete: this.completeHandler,
            onCompleteParams: [parameter, object]
        });
        t1.to(object, duration, {
            onUpdate: updateEffectSplit
        });
        return t1;

        function updateEffectSplit() {
            var progress = t1.progress();
            var percent = progress / 2;
            if (isExit == false) {
                if (progress > 0.9) { //跳过最后10%（解决iPad的闪问题）
                    object.css("-webkit-mask", "none");
                    return;
                }
                switch (direction) {
                    case "DirectionVerticalIn": //左右向中间收
                        object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (percent - 0.05) + ",rgba(0,0,0,1)),color-stop(" + percent + ",rgba(0,0,0,0)),color-stop(" + (1 - percent) + ",rgba(0,0,0,0)),color-stop(" + (1 - percent + 0.05) + ",rgba(0,0,0,1)))");
                        break;
                    case "DirectionHorizontalIn": //上下向中间收
                        object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (percent - 0.05) + ",rgba(0,0,0,1)),color-stop(" + percent + ",rgba(0,0,0,0)),color-stop(" + (1 - percent) + ",rgba(0,0,0,0)),color-stop(" + (1 - percent + 0.05) + ",rgba(0,0,0,1)))");
                        break;
                    case "DirectionHorizontalOut": //中间向上下展开
                        object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,0)), to(rgba(0,0,0,0)),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,0)),color-stop(" + (0.55 - percent) + ",rgba(0,0,0,1)),color-stop(" + (0.5 + percent) + ",rgba(0,0,0,1)),color-stop(" + (percent + 0.55) + ",rgba(0,0,0,0)))");
                        break;
                    case "DirectionVerticalOut": //中间向左右展开
                        object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,0)), to(rgba(0,0,0,0)),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,0)),color-stop(" + (0.55 - percent) + ",rgba(0,0,0,1)),color-stop(" + (0.5 + percent) + ",rgba(0,0,0,1)),color-stop(" + (percent + 0.55) + ",rgba(0,0,0,0)))");
                        break;
                    default:
                        console.log("getEffectSplit:parameter error.");
                        break;
                }
                //if (percent >= 0.5) object.css("-webkit-mask", "none");
            } else {
                if (progress < 0.1) return; //跳过前面10%（解决iPad的闪问题）
                switch (direction) {
                    case "DirectionVerticalIn": //左右向中间收
                        object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,0)), to(rgba(0,0,0,0)),color-stop(" + (percent - 0.05) + ",rgba(0,0,0,0)),color-stop(" + percent + ",rgba(0,0,0,1)),color-stop(" + (1 - percent) + ",rgba(0,0,0,1)),color-stop(" + (1 - percent + 0.05) + ",rgba(0,0,0,0)))");
                        break;
                    case "DirectionHorizontalIn": //上下向中间收
                        object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,0)), to(rgba(0,0,0,0)),color-stop(" + (percent - 0.05) + ",rgba(0,0,0,0)),color-stop(" + percent + ",rgba(0,0,0,1)),color-stop(" + (1 - percent) + ",rgba(0,0,0,1)),color-stop(" + (1 - percent + 0.05) + ",rgba(0,0,0,0)))");
                        break;
                    case "DirectionHorizontalOut": //中间向上下展开
                        object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,1)),color-stop(" + (0.55 - percent) + ",rgba(0,0,0,0)),color-stop(" + (0.5 + percent) + ",rgba(0,0,0,0)),color-stop(" + (percent + 0.55) + ",rgba(0,0,0,1)))");
                        break;
                    case "DirectionVerticalOut": //中间向左右展开
                        object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (0.5 - percent) + ",rgba(0,0,0,1)),color-stop(" + (0.55 - percent) + ",rgba(0,0,0,0)),color-stop(" + (0.5 + percent) + ",rgba(0,0,0,0)),color-stop(" + (percent + 0.55) + ",rgba(0,0,0,1)))");
                        break;
                    default:
                        console.log("getEffectSplit:parameter error.");
                        break;
                }
                if (percent >= 0.5) {
                    //object.css("opacity","0");
                    object.css("visibility", "hidden");
                    object.css("-webkit-mask", "none");
                }
            }
        }
    }

    //切入/出
    animproto.getEffectPeek = function (parameter, object, isExit, duration, delay, repeat) {
        var direction = parameter.direction; //方向(上下左右)
        var t1 = null;
        var objInfo = this._getObjectInfo(object);
        if (isExit == false) {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object, {
                    visibility: "visible"
                }],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object]
            });
            switch (direction) {
                case "DirectionUp":
                    t1.from(object, duration, {
                        y: -objInfo.height,
                        ease: Linear.easeNone,
                        onUpdate: this._updateClipRect,
                        onUpdateParams: [t1, object, isExit, "DirectionDown", objInfo]
                    });
                    break;
                case "DirectionDown":
                    t1.from(object, duration, {
                        y: objInfo.height,
                        ease: Linear.easeNone,
                        onUpdate: this._updateClipRect,
                        onUpdateParams: [t1, object, isExit, "DirectionUp", objInfo]
                    });
                    break;
                case "DirectionLeft":
                    t1.from(object, duration, {
                        x: -objInfo.width,
                        ease: Linear.easeNone,
                        onUpdate: this._updateClipRect,
                        onUpdateParams: [t1, object, isExit, "DirectionRight", objInfo]
                    });
                    break;
                case "DirectionRight":
                    t1.from(object, duration, {
                        x: objInfo.width,
                        ease: Linear.easeNone,
                        onUpdate: this._updateClipRect,
                        onUpdateParams: [t1, object, isExit, "DirectionLeft", objInfo]
                    });
                    break;
                default:
                    console.log("getEffectPeek:parameter error.");
                    break;
            }
        } else {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object]
            });
            switch (direction) {
                case "DirectionUp":
                    t1.to(object, duration, {
                        y: -objInfo.height,
                        ease: Linear.easeNone,
                        onUpdate: this._updateClipRect,
                        onUpdateParams: [t1, object, isExit, "DirectionUp", objInfo]
                    });
                    break;
                case "DirectionDown":
                    t1.to(object, duration, {
                        y: objInfo.height,
                        ease: Linear.easeNone,
                        onUpdate: this._updateClipRect,
                        onUpdateParams: [t1, object, isExit, "DirectionDown", objInfo]
                    });
                    break;
                case "DirectionLeft":
                    t1.to(object, duration, {
                        x: -objInfo.width,
                        ease: Linear.easeNone,
                        onUpdate: this._updateClipRect,
                        onUpdateParams: [t1, object, isExit, "DirectionLeft", objInfo]
                    });
                    break;
                case "DirectionRight":
                    t1.to(object, duration, {
                        x: objInfo.width,
                        ease: Linear.easeNone,
                        onUpdate: this._updateClipRect,
                        onUpdateParams: [t1, object, isExit, "DirectionRight", objInfo]
                    });
                    break;
                default:
                    console.log("getEffectPeek:parameter error.");
                    break;
            }
        }
        return t1;
    }

    //擦除
    animproto.getEffectWipe = function (parameter, object, isExit, duration, delay, repeat) {
        var direction = parameter.direction; //方向(上下左右)
        var t1 = new TimelineMax({
            delay: delay,
            repeat: repeat,
            onStart: this.startHandler,
            onStartParams: [parameter, object, {
                visibility: "visible"
            }],
            onComplete: this.completeHandler,
            onCompleteParams: [parameter, object]
        });
        var objInfo = this._getObjectInfo(object);
        if (isExit == false) {
            //t1.to(object,duration,{onStart:this.startHandler,onStartParams:[object],onUpdate:this.updateLineGradient,onUpdateParams:[t1,object,isExit,direction]});
            t1.to(object, duration, {
                onUpdate: this._updateClipRect,
                onUpdateParams: [t1, object, isExit, direction, objInfo]
            });
        } else {
            //t1.to(object,duration,{onUpdate:this.updateLineGradient,onUpdateParams:[t1,object,isExit,direction]});
            t1.to(object, duration, {
                onUpdate: this._updateClipRect,
                onUpdateParams: [t1, object, isExit, direction, objInfo]
            });
        }
        return t1;
    }

    //翻转式由远及近
    animproto.getEffectGrowAndTurn = function (parameter, object, isExit, duration, delay, repeat) {
        var t1 = null;
        if (isExit == false) {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object]
            });
            t1.from(object, duration, {
                autoAlpha: 0,
                scale: 0,
                rotation: "90deg",
                ease: parameter.tweenEase,
                clearProps: "scale,rotation"
            });
        } else {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object, {
                    opacity: 1,
                    scale: 1,
                    rotation: "0deg"
                }]
            });
            t1.to(object, duration, {
                autoAlpha: 0,
                scale: 0,
                rotation: "90deg",
                ease: parameter.tweenEase
            });
        }
        return t1;
    }

    //升起/下沉
    animproto.getEffectRiseUp = function (parameter, object, isExit, duration, delay, repeat) {
        var t1 = null;
        var objInfo = this._getObjectInfo(object);
        var y = objInfo.offsetBottom + objInfo.height;
        var easeString = Back.easeInOut;
        if (parameter.tweenEase && parameter.tweenEase.length > 0) easeString = parameter.tweenEase;
        if (isExit == false) {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object]
            });
            t1.from(object, duration, {
                autoAlpha: 0,
                y: y,
                ease: easeString
            });
        } else {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object, {
                    opacity: 1
                }]
            });
            t1.to(object, duration, {
                autoAlpha: 0,
                y: y,
                ease: easeString
            });
        }
        return t1;
    }

    //基本缩放
    animproto.getEffectZoom = function (parameter, object, isExit, duration, delay, repeat) {
        var direction = parameter.direction; //方向(放大:DirectionIn、屏幕中心放大:DirectionInCenter、轻微放大:DirectionInSlightly、缩小:DirectionOut、屏幕底部缩小:DirectionOutBottom、轻微缩小:DirectionOutSlightly)
        var t1 = null;
        var result
        object.css("-webkit-transform-origin", "center"); //设置缩放基点(默认是正中心点)
        if (isExit == false) {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object, {
                    visibility: "visible"
                }],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object]
            });
            switch (direction) {
                case "DirectionIn":
                    t1.from(object, duration, {
                        scale: 0,
                        ease: parameter.tweenEase
                    });
                    break;
                case "DirectionInCenter":
                    result = this._getDirectionInCenter(object);
                    t1.from(object, duration, {
                        scale: 0,
                        x: result.x,
                        y: result.y,
                        ease: parameter.tweenEase
                    });
                    break;
                case "DirectionInSlightly":
                    t1.from(object, duration, {
                        scale: 0.7,
                        ease: parameter.tweenEase
                    });
                    break;
                case "DirectionOut":
                    t1.from(object, duration, {
                        scale: 3,
                        ease: parameter.tweenEase
                    });
                    break;
                case "DirectionOutBottom":
                    //屏幕底部缩小(理解为底部的中间开始)
                    t1.from(object, duration, {
                        scale: 2,
                        top: this.screenWidth + "px",
                        ease: parameter.tweenEase
                    });
                    break;
                case "DirectionOutSlightly":
                    t1.from(object, duration, {
                        scale: 1.5,
                        ease: parameter.tweenEase
                    });
                    break;
                default:
                    console.log("getEffectZoom:parameter error.");
                    break;
            }
        } else {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object, {
                    visibility: "hidden"
                }]
            });
            switch (direction) {
                case "DirectionIn":
                    t1.to(object, duration, {
                        scale: 0,
                        ease: parameter.tweenEase
                    });
                    break;
                case "DirectionInCenter":
                    result = this._getDirectionInCenter(object);
                    t1.to(object, duration, {
                        scale: 0,
                        x: result.x,
                        y: result.y,
                        ease: parameter.tweenEase
                    });
                    break;
                case "DirectionInSlightly":
                    t1.to(object, duration, {
                        scale: 0.7,
                        ease: parameter.tweenEase
                    });
                    break;
                case "DirectionOut":
                    t1.to(object, duration, {
                        scale: 3,
                        ease: parameter.tweenEase
                    });
                    break;
                case "DirectionOutBottom":
                    t1.to(object, duration, {
                        scale: 2,
                        top: this.screenHeight + "px",
                        ease: parameter.tweenEase
                    });
                    break;
                case "DirectionOutSlightly":
                    t1.to(object, duration, {
                        scale: 1.5,
                        ease: parameter.tweenEase
                    });
                    break;
                default:
                    console.log("getEffectZoom:parameter error.");
                    break;
            }
        }
        return t1;
    }

    //缩放 淡出式缩放
    animproto.getEffectFadedZoom = function (parameter, object, isExit, duration, delay, repeat) {
        var direction = parameter.direction; //方向(对象中心DirectionIn、幻灯片中心DirectionInCenter)
        var t1 = null;
        object.css("-webkit-transform-origin", "center"); //设置缩放基点(默认是正中心点)
        var svgElement = object.find("svg"); //获取SVG对象
        if (svgElement) svgElement.css('-webkit-transform', 'translate3d(0px, 0px, 0px)'); //解决SVG文字错乱问题

        var keepRatio = (parameter.keepRatio == 0) ? false : true; //保持长宽比
        var fullScreen = (parameter.fullScreen == 1) ? true : false; //缩放到全屏
        var scaleX = parameter.scaleX ? parameter.scaleX : 1; //横向缩放比例
        var scaleY = parameter.scaleY ? parameter.scaleY : 1; //纵向缩放比例
        var result
        if (fullScreen == true) {
            //计算比例
            var xScale = this.screenWidth / object.width();
            var yScale = this.screenHeight / object.height();
            var scaleValue = xScale;
            if (xScale > yScale) scaleValue = yScale;
            result = this._getDirectionInCenter(object);
            if (isExit == false) {
                t1 = new TimelineMax({
                    delay: delay,
                    repeat: repeat,
                    onStart: this.startHandler,
                    onStartParams: [parameter, object, {
                        opacity: 0
                    }],
                    onComplete: this.completeHandler,
                    onCompleteParams: [parameter, object]
                });
                t1.to(object, duration, {
                    x: result.x,
                    y: result.y,
                    autoAlpha: 1,
                    scale: scaleValue,
                    ease: parameter.tweenEase
                });
            } else {
                t1 = new TimelineMax({
                    delay: delay,
                    repeat: repeat,
                    onStart: this.startHandler,
                    onStartParams: [parameter, object],
                    onComplete: this.completeHandler,
                    onCompleteParams: [parameter, object]
                });
                t1.to(object, duration, {
                    x: result.x,
                    y: result.y,
                    autoAlpha: 0,
                    scale: scaleValue,
                    ease: parameter.tweenEase
                });
            }
        } else if (isExit == false) {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object]
            });
            switch (direction) {
                case "DirectionIn":
                    if (keepRatio == true)
                        t1.from(object, duration, {
                            autoAlpha: 0,
                            scale: 0,
                            ease: parameter.tweenEase
                        });
                    else {
                        t1.from(object, duration, {
                            autoAlpha: 0,
                            scaleX: scaleX,
                            scaleY: scaleY,
                            ease: parameter.tweenEase
                        });
                    }
                    break;
                case "DirectionInCenter":
                    result = this._getDirectionInCenter(object);
                    if (keepRatio == true)
                        t1.from(object, duration, {
                            x: result.x,
                            y: result.y,
                            autoAlpha: 0,
                            scale: 0,
                            ease: parameter.tweenEase
                        });
                    else
                        t1.from(object, duration, {
                            x: result.x,
                            y: result.y,
                            autoAlpha: 0,
                            scaleX: scaleX,
                            scaleY: scaleY,
                            ease: parameter.tweenEase
                        });
                    break;
                default:
                    console.log("getEffectFadedZoom:parameter error.");
                    break;
            }
        } else {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object, {
                    opacity: 1
                }]
            });
            switch (direction) {
                case "DirectionOut":
                    if (keepRatio == true)
                        t1.to(object, duration, {
                            autoAlpha: 0,
                            scale: 0,
                            ease: parameter.tweenEase,
                            clearProps: "scale"
                        });
                    else
                        t1.to(object, duration, {
                            autoAlpha: 0,
                            scaleX: scaleX,
                            scaleY: scaleY,
                            ease: parameter.tweenEase
                        });
                    break;
                case "DirectionOutCenter":
                    result = this._getDirectionInCenter(object);
                    if (keepRatio == true)
                        t1.to(object, duration, {
                            x: result.x,
                            y: result.y,
                            autoAlpha: 0,
                            scale: 0,
                            ease: parameter.tweenEase
                        });
                    else
                        t1.to(object, duration, {
                            x: result.x,
                            y: result.y,
                            autoAlpha: 0,
                            scaleX: scaleX,
                            scaleY: scaleY,
                            ease: parameter.tweenEase
                        });
                    break;
                default:
                    console.log("getEffectFadedZoom:parameter error.");
                    break;
            }
        }
        return t1;
    }

    //玩具风车
    animproto.getEffectPinwheel = function (parameter, object, isExit, duration, delay, repeat) {
        var t1 = null;
        if (isExit == false) {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object]
            });
            t1.from(object, duration, {
                autoAlpha: 0,
                scale: 0,
                rotation: "540deg",
                ease: parameter.tweenEase
            });
        } else {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object, {
                    opacity: 1,
                    scale: 1,
                    rotation: "0deg"
                }]
            });
            t1.to(object, duration, {
                autoAlpha: 0,
                scale: 0,
                rotation: "540deg",
                ease: parameter.tweenEase
            });
        }
        return t1;
    }

    //回旋
    animproto.getEffectSpinner = function (parameter, object, isExit, duration, delay, repeat) {
        var t1 = null;
        var easeString = Expo.easeOut;
        if (parameter.tweenEase && parameter.tweenEase.length > 0) easeString = parameter.tweenEase;
        if (isExit == false) {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object, {
                    visibility: "visible"
                }],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object]
            });
            t1.from(object, duration, {
                scale: 0,
                rotation: "180deg",
                ease: easeString
            });
        } else {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object, {
                    visibility: "hidden",
                    scale: 1,
                    rotation: "0deg"
                }]
            });
            t1.to(object, duration, {
                scale: 0,
                rotation: "180deg",
                ease: easeString
            });
        }
        return t1;
    }

    //旋转(淡出式回旋)
    animproto.getEffectFadedSwivel = function (parameter, object, isExit, duration, delay, repeat) {
        var t1 = null;
        var easeString = Linear.easeNone;
        var degree = Math.abs(parameter.degree) > 0 ? Number(parameter.degree) : 90;
        if (parameter.clockWise == 0) degree = 0 - degree; //逆时针旋转
        switch (parameter.centerPos) {
            case 1: //左上角
                object.css("-webkit-transform-origin", "left top");
                break;
            case 2: //上边中心
                object.css("-webkit-transform-origin", "center top");
                break;
            case 3: //右上角
                object.css("-webkit-transform-origin", "right top");
                break;
            case 4: //左边中心
                object.css("-webkit-transform-origin", "left cneter");
                break;
            case 5: //右边中心
                object.css("-webkit-transform-origin", "right center");
                break;
            case 6: //左下角
                object.css("-webkit-transform-origin", "left bottom");
                break;
            case 7: //下边中心
                object.css("-webkit-transform-origin", "center bottom");
                break;
            case 8: //右下角
                object.css("-webkit-transform-origin", "right bottom");
                break;
            case 0:
            default: //默认中心0
                object.css("-webkit-transform-origin", "center");
                break;
        }
        if (parameter.tweenEase && parameter.tweenEase.length > 0) easeString = parameter.tweenEase;
        if (isExit == false) {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object]
            });
            //t1.from(object,duration,{autoAlpha:0,rotationY:"540deg",ease:Linear.easeNone}); //PPT默认效果
            switch (parameter.axis) {
                case 0: //Z轴
                    t1.from(object, duration, {
                        autoAlpha: 0,
                        rotation: degree + "deg",
                        ease: easeString,
                        immediateRender: false
                    });
                    break;
                case 1: //X轴
                    t1.from(object, duration, {
                        autoAlpha: 0,
                        rotationX: degree + "deg",
                        ease: easeString,
                        immediateRender: false
                    });
                    break;
                case 2: //Y轴
                default:
                    t1.from(object, duration, {
                        autoAlpha: 0,
                        rotationY: degree + "deg",
                        ease: easeString,
                        immediateRender: false
                    });
                    break;
            }
        } else {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object, {
                    opacity: 1
                }]
            });
            //t1.to(object,duration,{autoAlpha:0,rotationY:"540deg",ease:Linear.easeNone}); //PPT默认效果
            switch (parameter.axis) {
                case 0: //Z轴
                    t1.to(object, duration, {
                        autoAlpha: 0,
                        rotation: degree + "deg",
                        ease: easeString
                    });
                    break;
                case 1: //X轴
                    t1.to(object, duration, {
                        autoAlpha: 0,
                        rotationX: degree + "deg",
                        ease: easeString
                    });
                    break;
                case 2: //Y轴
                default:
                    t1.to(object, duration, {
                        autoAlpha: 0,
                        rotationY: degree + "deg",
                        ease: easeString
                    });
                    break;
            }
        }
        return t1;
    }

    //展开/收缩
    animproto.getEffectExpand = function (parameter, object, isExit, duration, delay, repeat) {
        var t1 = null;
        if (isExit == false) {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object]
            });
            t1.from(object, duration, {
                autoAlpha: 0,
                rotationY: "45deg",
                ease: parameter.tweenEase
            });
        } else {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object, {
                    opacity: 1,
                    rotationY: "0deg"
                }]
            });
            t1.to(object, duration, {
                autoAlpha: 0,
                rotationY: "45deg",
                ease: parameter.tweenEase
            });
        }
        return t1;
    }

    //基本旋转
    animproto.getEffectSwivel = function (parameter, object, isExit, duration, delay, repeat) {
        var direction = parameter.direction; //方向（水平：DirectionHorizontal、垂直：DirectionVertical
        var t1 = null;
        var easeString = Linear.easeNone;
        if (parameter.tweenEase && parameter.tweenEase.length > 0) easeString = parameter.tweenEase;
        if (isExit == false) {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object, {
                    visibility: "visible"
                }],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object]
            });
            switch (direction) {
                case "DirectionHorizontal":
                    t1.from(object, duration, {
                        rotationY: "480deg",
                        ease: easeString
                    });
                    break;
                case "DirectionVertical":
                    t1.from(object, duration, {
                        rotationX: "480deg",
                        ease: easeString
                    });
                    break;
                default:
                    console.log("getEffectSwivel:parameter error.");
                    break;
            }
        } else {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object, {
                    visibility: "hidden"
                }]
            });
            switch (direction) {
                case "DirectionHorizontal":
                    t1.to(object, duration, {
                        rotationY: "480deg",
                        ease: easeString
                    });
                    break;
                case "DirectionVertical":
                    t1.to(object, duration, {
                        rotationX: "480deg",
                        ease: easeString
                    });
                    break;
                default:
                    console.log("getEffectSwivel:parameter error.");
                    break;
            }
        }
        return t1;
    }

    //浮动
    animproto.getEffectFloat = function (parameter, object, isExit, duration, delay, repeat) {
        var t1 = null;
        var objInfo = this._getObjectInfo(object);
        var x, y
        if (isExit == false) {
            x = objInfo.offsetRight + objInfo.width;
            y = 0 - (objInfo.offsetTop + objInfo.height);
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object]
            });
            t1.from(object, duration, {
                autoAlpha: 0,
                rotation: "-45deg",
                x: x,
                y: y,
                ease: parameter.tweenEase
            });
        } else {
            x = objInfo.offsetRight + objInfo.width;
            y = 0 - (objInfo.offsetTop + objInfo.height);
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object, {
                    opacity: 1
                }]
            });
            t1.to(object, duration, {
                autoAlpha: 0,
                rotation: "-45deg",
                x: x,
                y: y,
                ease: parameter.tweenEase
            });
        }
        return t1;
    }

    //字幕式
    animproto.getEffectCredits = function (parameter, object, isExit, duration, delay, repeat) {
        var objInfo = this._getObjectInfo(object);
        var y = 0,
            top = 0;
        if (isExit == false) {
            //从下往上移
            y = 0 - (this.screenHeight + objInfo.height);
            top = objInfo.top + objInfo.offsetBottom + objInfo.height;
        } else {
            //从上往下移
            y = this.screenHeight + objInfo.height;
            top = objInfo.top - (objInfo.offsetTop + objInfo.height);
        }
        var t1 = new TimelineMax({
            delay: delay,
            repeat: repeat,
            onStart: this.startHandler,
            onStartParams: [parameter, object, {
                visibility: "visible",
                top: top + "px"
            }],
            onComplete: this.completeHandler,
            onCompleteParams: [parameter, object]
        });
        t1.to(object, duration, {
            y: y,
            ease: parameter.tweenEase
        });
        return t1;
    }

    //弹跳
    animproto.getEffectBounce = function (parameter, object, isExit, duration, delay, repeat) {
        var t1 = new TimelineMax({
            delay: delay,
            repeat: repeat,
            onStart: this.startHandler,
            onStartParams: [parameter, object, {
                visibility: "visible"
            }],
            onComplete: this.completeHandler,
            onCompleteParams: [parameter, object]
        });
        var objInfo = this._getObjectInfo(object);

        var time2, time3, time4, time5, y1, y2, y3, y4, lastY, height, time1, total, width

        if (isExit == false) {
            total = duration;
            time1 = total / 5;
            time2 = total / 10;
            time3 = total / 20;
            time4 = total / 40;
            time5 = total / 80;
            width = 50 + 20 + 10 + 5 + 2.5 + 1 + 0.5 + 0.2 + 0.1;
            height = this.screenHeight / 4;
            y1 = height / 2;
            y2 = height / 4;
            y3 = height / 8;
            y4 = height / 16;
            lastY = objInfo.offsetBottom - height + objInfo.height;

            t1.to(object, 0.01, {
                x: -width,
                y: -height
            })
                .to(object, time1, {
                    x: "+=50",
                    y: "+=" + height,
                    ease: Circ.easeIn
                }) //慢到快
                .to(object, time1, {
                    x: "+=20",
                    y: "-=" + y1,
                    scaleY: 0.8,
                    ease: Circ.easeOut
                }) //快到慢
                .to(object, time1, {
                    x: "+=10",
                    y: "+=" + y1,
                    scaleY: 1,
                    ease: Circ.easeIn
                })
                .to(object, time2, {
                    x: "+=5",
                    y: "-=" + y2,
                    scaleY: 0.85,
                    ease: Circ.easeOut
                })
                .to(object, time2, {
                    x: "+=2.5",
                    y: "+=" + y2,
                    scaleY: 1,
                    ease: Circ.easeIn
                })
                .to(object, time3, {
                    x: "+=1",
                    y: "-=" + y3,
                    scaleY: 0.9,
                    ease: Circ.easeOut
                })
                .to(object, time3, {
                    x: "+=0.5",
                    y: "+=" + y3,
                    scaleY: 1,
                    ease: Circ.easeIn
                })
                .to(object, time4, {
                    x: "+=0.2",
                    y: "-=" + y4,
                    scaleY: 0.95,
                    ease: Circ.easeOut
                })
                .to(object, time4, {
                    x: "+=0.1",
                    y: "+=" + y4,
                    scaleY: 1,
                    ease: Circ.easeIn,
                    clearProps: "x,y"
                });
            return t1;
        } else {
            total = duration;
            time1 = total / 5;
            time2 = total / 10;
            time3 = total / 20;
            time4 = total / 40;
            time5 = total / 80;
            height = this.screenHeight / 4;
            y1 = height / 2;
            y2 = height / 4;
            y3 = height / 8;
            y4 = height / 16;
            lastY = objInfo.offsetBottom - height + objInfo.height;
            t1.to(object, time1, {
                x: "+=50",
                y: "+=" + height,
                ease: Circ.easeIn
            }) //慢到快
                .to(object, time1, {
                    x: "+=20",
                    y: "-=" + y1,
                    scaleY: 0.8,
                    ease: Circ.easeOut
                }) //快到慢
                .to(object, time1, {
                    x: "+=10",
                    y: "+=" + y1,
                    scaleY: 1,
                    ease: Circ.easeIn
                })
                .to(object, time2, {
                    x: "+=5",
                    y: "-=" + y2,
                    scaleY: 0.85,
                    ease: Circ.easeOut
                })
                .to(object, time2, {
                    x: "+=2.5",
                    y: "+=" + y2,
                    scaleY: 1,
                    ease: Circ.easeIn
                })
                .to(object, time3, {
                    x: "+=1",
                    y: "-=" + y3,
                    scaleY: 0.9,
                    ease: Circ.easeOut
                })
                .to(object, time3, {
                    x: "+=0.5",
                    y: "+=" + y3,
                    scaleY: 1,
                    ease: Circ.easeIn
                })
                .to(object, time4, {
                    x: "+=0.2",
                    y: "-=" + y4,
                    scaleY: 0.95,
                    ease: Circ.easeOut
                })
                .to(object, time4, {
                    x: "+=0.1",
                    y: "+=" + y4,
                    scaleY: 1,
                    ease: Circ.easeIn
                })
                .to(object, time5, {
                    x: "+=0.1",
                    y: "+=" + lastY,
                    ease: Circ.easeIn
                });
        }
        return t1;
    }

    //飞旋
    animproto.getEffectBoomerang = function (parameter, object, isExit, duration, delay, repeat) {
        var t1 = null;
        var time = duration / 3;
        if (isExit == false) {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object]
            });
            t1.add(TweenMax.to(object, 0.01, {
                x: 300,
                y: -200,
                rotation: "-60deg"
            }), "first");
            t1.add(TweenMax.to(object, time, {
                autoAlpha: 1,
                x: 0,
                y: 0,
                rotation: "0deg"
            }), "second");
            t1.add(TweenMax.to(object, time, {
                rotationY: "-80deg"
            }), "second");
            t1.add(TweenMax.to(object, time, {
                rotationY: "0deg"
            }));
        } else {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object, {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    rotation: "0deg"
                }]
            });
            t1.add(TweenMax.to(object, time, {
                rotationY: "-80deg"
            }), "frist");
            t1.add(TweenMax.to(object, time, {
                autoAlpha: 0,
                x: 300,
                y: -200,
                rotation: "-60deg"
            }), "second");
            t1.add(TweenMax.to(object, time, {
                rotationY: "0deg"
            }), "second");
        }
        return t1;
    }

    //中心旋转
    animproto.getEffectCenterRevolve = function (parameter, object, isExit, duration, delay, repeat) {
        var t1 = null;
        var easeString = Power1.easeInOut;
        if (parameter.tweenEase && parameter.tweenEase.length > 0) easeString = parameter.tweenEase;
        if (isExit == false) {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object, {
                    visibility: "visible"
                }],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object]
            });
            t1.from(object, duration, {
                bezier: {
                    type: "cubic",
                    values: [{
                        x: 0,
                        y: 0
                    }, {
                            x: 200,
                            y: 100
                        }, {
                            x: 200,
                            y: 200
                        }, {
                            x: 0,
                            y: 300
                        }]
                },
                ease: easeString
            });
        } else {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object, {
                    visibility: "hidden"
                }]
            });
            t1.to(object, duration, {
                bezier: {
                    type: "cubic",
                    values: [{
                        x: 0,
                        y: 0
                    }, {
                            x: 200,
                            y: 100
                        }, {
                            x: 200,
                            y: 200
                        }, {
                            x: 0,
                            y: 300
                        }]
                },
                ease: easeString
            });
        }
        return t1;
    }

    //螺旋飞入/出
    animproto.getEffectSpiral = function (parameter, object, isExit, duration, delay, repeat) {
        var t1 = new TimelineMax({
            delay: delay,
            repeat: repeat,
            onStart: this.startHandler,
            onStartParams: [parameter, object, {
                visibility: "visible"
            }],
            onComplete: this.completeHandler,
            onCompleteParams: [parameter, object]
        });
        var easeString = Power1.easeInOut;
        if (parameter.tweenEase && parameter.tweenEase.length > 0) easeString = parameter.tweenEase;
        if (isExit == false) {
            t1.from(object, duration, {
                scale: 0,
                bezier: {
                    type: "cubic",
                    values: [{
                        x: 0,
                        y: 0
                    }, {
                            x: 200,
                            y: -200
                        }, {
                            x: 0,
                            y: -400
                        }, {
                            x: -500,
                            y: -600
                        }]
                },
                ease: easeString
            });
        } else {
            t1.to(object, duration, {
                scale: 0,
                bezier: {
                    type: "cubic",
                    values: [{
                        x: 0,
                        y: 0
                    }, {
                            x: 200,
                            y: -200
                        }, {
                            x: 0,
                            y: -400
                        }, {
                            x: -500,
                            y: -600
                        }]
                },
                ease: easeString
            });
        }
        return t1;
    }

    //曲线向上/下
    animproto.getEffectArcUp = function (parameter, object, isExit, duration, delay, repeat) {
        var t1 = null;
        var easeString = Power1.easeInOut;
        if (parameter.tweenEase && parameter.tweenEase.length > 0) easeString = parameter.tweenEase;
        if (isExit == false) {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object]
            });
            t1.from(object, duration, {
                autoAlpha: 0,
                scale: 2,
                bezier: {
                    type: "cubic",
                    values: [{
                        x: 0,
                        y: 0
                    }, {
                            x: 200,
                            y: 200
                        }, {
                            x: 0,
                            y: 400
                        }, {
                            x: -500,
                            y: 600
                        }]
                },
                ease: easeString
            });
        } else {
            t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object, {
                    opacity: 1,
                    scale: 1
                }]
            });
            t1.to(object, duration, {
                autoAlpha: 0,
                scale: 2,
                bezier: {
                    type: "cubic",
                    values: [{
                        x: 0,
                        y: 0
                    }, {
                            x: 200,
                            y: 200
                        }, {
                            x: 0,
                            y: 400
                        }, {
                            x: -500,
                            y: 600
                        }]
                },
                ease: easeString,
                clearProps: "x,y"
            });
        }
        return t1;
    }

    //脉冲
    animproto.getEffectFlashBulb = function (parameter, object, duration, delay, repeat) {
        var t1 = new TimelineMax({
            delay: delay,
            repeat: repeat,
            onStart: this.startHandler,
            onStartParams: [parameter, object],
            onComplete: this.completeHandler,
            onCompleteParams: [parameter, object]
        });
        var range = (Number(parameter.range)) ? parameter.range : 0.1;
        var time = duration / 2;
        t1.to(object, time, {
            autoAlpha: 0.5,
            scale: "+=" + range
        })
            .to(object, time, {
                autoAlpha: 1,
                scale: "-=" + range
            });
        return t1;
    }

    //彩色脉冲
    animproto.getEffectFlicker = function (parameter, object, duration, delay, repeat) {
        if (!("-webkit-filter" in object[0].style)) return new TimelineMax();
        //if (repeat < 2) repeat = 2; //默认三次
        var color2 = parameter.color2 ? parameter.color2 : "#fff"; //颜色
        var maxGlowSize = (parameter.maxGlowSize) ? parameter.maxGlowSize : 0.1; //光晕最大尺寸(百分比)
        var minGlowSize = (parameter.minGlowSize) ? parameter.minGlowSize : 0.05; //光晕最小尺寸(百分比)
        var size = (object.width() > object.height()) ? object.height() : object.width();
        var maxSize = maxGlowSize * size;
        var minSize = minGlowSize * size;
        var opacity = (Number(parameter.opacity)) ? parameter.opcity : 0.75; //不透明度
        var distance = (Number(parameter.distance)) ? parameter.distance * size : 0;//距离
        var color = colorHexToRGB(color2, opacity);
        var t1 = new TimelineMax({
            delay: delay,
            repeat: repeat,
            onStart: this.startHandler,
            onStartParams: [parameter, object],
            onComplete: this.completeHandler,
            onCompleteParams: [parameter, object, {
                //"box-shadow": "none"
                "-webkit-filter": "none"
            }]
        });
        t1.to(object, duration, {
            onUpdate: updateEffectFlicker
        });
        return t1;

        function updateEffectFlicker() {
            var progress = t1.progress();
            var percent = parseInt(progress * (maxSize - minSize));
            if (progress > 0.5) percent = parseInt((1 - progress) * (maxSize - minSize));
            //object.css("box-shadow", distance + "px " + distance + "px " + minSize + "px " + (minSize + percent) + "px " + color);
            object.css("-webkit-filter", "drop-shadow(" + color + " " + distance + "px " + distance + "px " + (minSize + percent) + "px)");
        }
    }

    //跷跷板
    animproto.getEffectTeeter = function (parameter, object, duration, delay, repeat) {
        var t1 = new TimelineMax({
            delay: delay,
            repeat: repeat,
            onStart: this.startHandler,
            onStartParams: [parameter, object],
            onComplete: this.completeHandler,
            onCompleteParams: [parameter, object]
        });
        // var mode = parameter.mode;
        var range = (Number(parameter.range)) ? parameter.range : 0.02;
        var time = duration / 8; //计算指定动画时间内每次运动时间(总时长不变，循环除外)
        switch (parameter.mode) {
            case 1: //左右移动
                range = range * object.width();
                t1.to(object, time, {
                    x: -range
                })
                    .to(object, time * 2, {
                        x: range
                    });
                //for (var i = 1; i < repeat; i++) {
                t1.to(object, time * 2, {
                    x: -range
                });
                t1.to(object, time * 2, {
                    x: range
                });
                //}
                t1.to(object, time, {
                    x: 0
                });
                break;
            case 2: //上下移动
                range = range * object.height();
                t1.to(object, time, {
                    y: -range
                })
                    .to(object, time * 2, {
                        y: range
                    });
                //for (var i = 1; i < repeat; i++) {
                t1.to(object, time * 2, {
                    y: -range
                });
                t1.to(object, time * 2, {
                    y: range
                });
                //}
                t1.to(object, time, {
                    y: 0
                });
                break;
            case 3: //左右挤压
                t1.to(object, time, {
                    scaleX: 1 + range
                })
                    .to(object, time * 2, {
                        scaleX: 1 - range
                    });
                //for (var i = 1; i < repeat; i++) {
                t1.to(object, time * 2, {
                    scaleX: 1 + range
                });
                t1.to(object, time * 2, {
                    scaleX: 1 - range
                });
                //}
                t1.to(object, time, {
                    scaleX: 1
                });
                break;
            case 4: //上下挤压
                t1.to(object, time, {
                    scaleY: 1 + range
                })
                    .to(object, time * 2, {
                        scaleY: 1 - range
                    });
                //for (var i = 1; i < repeat; i++) {
                t1.to(object, time * 2, {
                    scaleY: 1 + range
                });
                t1.to(object, time * 2, {
                    scaleY: 1 - range
                });
                //}
                t1.to(object, time, {
                    scaleY: 1
                });
                break;
            case 0: //左右晃晃
            default:
                range = range * 100;
                t1.to(object, time, {
                    rotation: range + "deg"
                })
                    .to(object, time * 2, {
                        rotation: (-range) + "deg"
                    });
                //for (var i = 1; i < repeat; i++) {
                t1.to(object, time * 2, {
                    rotation: range + "deg"
                });
                t1.to(object, time * 2, {
                    rotation: (-range) + "deg"
                });
                //}
                t1.to(object, time, {
                    rotation: "0deg"
                });
                break;
        }
        return t1;
    }

    //陀螺旋转
    animproto.getEffectSpin = function (parameter, object, duration, delay, repeat) {
        var degree = parameter.amount ? parameter.amount : 360; //陀螺旋转角度
        if (Math.abs(parameter.degree) > 0) degree = parameter.degree;
        if (parameter.clockWise == 0) degree = 0 - degree; //逆时针旋转
        switch (parameter.centerPos) {
            case 1: //左上角
                object.css("-webkit-transform-origin", "left top");
                break;
            case 2: //上边中心
                object.css("-webkit-transform-origin", "center top");
                break;
            case 3: //右上角
                object.css("-webkit-transform-origin", "right top");
                break;
            case 4: //左边中心
                object.css("-webkit-transform-origin", "left cneter");
                break;
            case 5: //右边中心
                object.css("-webkit-transform-origin", "right center");
                break;
            case 6: //左下角
                object.css("-webkit-transform-origin", "left bottom");
                break;
            case 7: //下边中心
                object.css("-webkit-transform-origin", "center bottom");
                break;
            case 8: //右下角
                object.css("-webkit-transform-origin", "right bottom");
                break;
            case 0:
            default: //默认中心0
                object.css("-webkit-transform-origin", "center");
                break;
        }

        var t1 = new TimelineMax({
            delay: delay,
            repeat: repeat,
            onStart: this.startHandler,
            onStartParams: [parameter, object],
            onComplete: this.completeHandler,
            onCompleteParams: [parameter, object]
        });
        //t1.to(object, duration, {rotation:degree+"deg",ease:parameter.tweenEase});
        switch (parameter.axis) {
            case 1: //X轴
                t1.to(object, duration, {
                    rotationX: "+=" + degree + "deg",
                    ease: parameter.tweenEase
                });
                break;
            case 2: //Y轴
                t1.to(object, duration, {
                    rotationY: "+=" + degree + "deg",
                    ease: parameter.tweenEase
                });
                break;
            case 0: //Z轴
            default:
                t1.to(object, duration, {
                    rotation: "+=" + degree + "deg",
                    ease: parameter.tweenEase
                });
                break;
        }
        return t1;
    }

    //放大/缩小
    animproto.getEffectGrowShrink = function (parameter, object, duration, delay, repeat) {
        var scaleX = parameter.scaleX ? parameter.scaleX : 1; //横向缩放比例
        var scaleY = parameter.scaleY ? parameter.scaleY : 1; //纵向缩放比例
        // var keepRatio = (parameter.keepRatio == 0) ? false : true; //保持长宽比
        var fullScreen = (parameter.fullScreen == 1) ? true : false; //缩放到全屏
        var resetSize = (parameter.resetSize == 1) ? true : false; //恢复默认尺寸
        var easeString = Linear.easeNone; //Elastic.easeOut
        if (parameter.tweenEase && parameter.tweenEase.length > 0) easeString = parameter.tweenEase;
        var t1 = new TimelineMax({
            delay: delay,
            repeat: repeat,
            onStart: this.startHandler,
            onStartParams: [parameter, object],
            onComplete: this.completeHandler,
            onCompleteParams: [parameter, object]
        });
        if (fullScreen == true) {
            //计算比例
            var xScale = this.screenWidth / object.width();
            var yScale = this.screenHeight / object.height();
            var scaleValue = xScale;
            if (xScale > yScale) scaleValue = yScale;
            var result = this._getDirectionInCenter(object);
            t1.to(object, duration, {
                x: result.x,
                y: result.y,
                scale: scaleValue,
                ease: parameter.tweenEase
            });
        } else if (resetSize == true) {
            t1.to(object, duration, {
                scaleX: 1,
                scaleY: 1,
                ease: easeString
            });
        } else
            t1.to(object, duration, {
                scaleX: scaleX,
                scaleY: scaleY,
                ease: easeString
            });
        return t1;
    }

    //不饱和
    animproto.getEffectDesaturate = function (parameter, object, duration, delay, repeat) {
        if (!("-webkit-filter" in object[0].style)) return new TimelineMax();
        var saturation = parameter.saturation ? parameter.saturation : 0.5; //饱和度
        var t1 = new TimelineMax({
            delay: delay,
            repeat: repeat,
            onStart: this.startHandler,
            onStartParams: [parameter, object],
            onComplete: this.completeHandler,
            onCompleteParams: [parameter, object, {
                "-webkit-filter": "none"
            }]
        });
        t1.to(object, duration, {
            onUpdate: updateSaturate
        });
        return t1;

        function updateSaturate() {
            var progress = t1.progress();
            var percent = (progress <= 0.5) ? progress * 2 : 1;
            var val = 1 + (saturation - 1) * percent;
            object.css("-webkit-filter", "saturate(" + val + ")");
        }
    }

    //加深
    animproto.getEffectDarken = function (parameter, object, duration, delay, repeat) {
        if (!("-webkit-filter" in object[0].style)) return new TimelineMax();
        var brightness = (parameter.brightness && parameter.brightness < 1) ? brightness.saturation : 0.5; //亮度
        var t1 = new TimelineMax({
            delay: delay,
            repeat: repeat,
            onStart: this.startHandler,
            onStartParams: [parameter, object],
            onComplete: this.completeHandler,
            onCompleteParams: [parameter, object, {
                "-webkit-filter": "none"
            }]
        });
        t1.to(object, duration, {
            onUpdate: updateBrightness
        });
        return t1;

        function updateBrightness() {
            var progress = t1.progress();
            var percent = (progress <= 0.5) ? progress * 2 : 1;
            var val = 1 + (brightness - 1) * percent;
            object.css("-webkit-filter", "brightness(" + val + ")");
        }
    }

    //变淡
    animproto.getEffectLighten = function (parameter, object, duration, delay, repeat) {
        if (!("-webkit-filter" in object[0].style)) return new TimelineMax();
        var brightness = (parameter.brightness && parameter.brightness > 1) ? parameter.brightness : 1.5; //亮度
        var t1 = new TimelineMax({
            delay: delay,
            repeat: repeat,
            onStart: this.startHandler,
            onStartParams: [parameter, object],
            onComplete: this.completeHandler,
            onCompleteParams: [parameter, object, {
                "-webkit-filter": "none"
            }]
        });
        t1.to(object, duration, {
            onUpdate: updateBrightness
        });
        return t1;

        function updateBrightness() {
            var progress = t1.progress();
            var percent = (progress <= 0.5) ? progress * 2 : 1;
            var val = 1 + (brightness - 1) * percent;
            object.css("-webkit-filter", "brightness(" + val + ")");
        }
    }

    //透明
    animproto.getEffectTransparency = function (parameter, object, duration, delay, repeat) {
        var opacity = parameter.amount ? parameter.amount : 0.5; //透明度
        var t1 = new TimelineMax({
            delay: delay,
            repeat: repeat,
            onStart: this.startHandler,
            onStartParams: [parameter, object],
            onComplete: this.completeHandler,
            onCompleteParams: [parameter, object]
        });
        t1.to(object, duration, {
            autoAlpha: opacity,
            ease: parameter.tweenEase
        });
        return t1;
    }

    //补色
    animproto.getEffectComplementaryColor = function (parameter, object, duration, delay, repeat) {
        var zIndex = Number(object.css("z-index"));
        if (isNaN(zIndex)) {
            zIndex = 10;
            console.log("The Z-index property for this object to get error.");
        }
        var t1 = new TimelineMax({
            delay: delay,
            repeat: repeat,
            onStart: this.startHandler,
            onStartParams: [parameter, object, {
                "z-Index": zIndex + 100
            }],
            onComplete: this.completeHandler,
            onCompleteParams: [parameter, object, {
                "z-Index": zIndex
            }]
        });
        t1.to(object, duration, {
            autoAlpha: 1
        });
        return t1;
    }

    //闪烁(一次)
    animproto.getEffectFlashOnce = function (parameter, object, duration, delay, repeat) {
        var t1 = new TimelineMax({
            delay: delay,
            repeat: repeat,
            onStart: this.startHandler,
            onStartParams: [parameter, object],
            onComplete: this.completeHandler,
            onCompleteParams: [parameter, object]
        });
        var time = duration / 3;
        t1.to(object, 0.001, {
            css: {
                visibility: "hidden"
            }
        }).to(object, time * 2, {}).to(object, time, {
            css: {
                visibility: "visible"
            }
        });
        return t1;
    }

    //路径动画
    animproto.getPathAnimation = function (parameter, object, duration, delay, repeat) {
        var t1 = new TimelineMax({
            delay: delay,
            repeat: repeat,
            onStart: this.startHandler,
            onStartParams: [parameter, object],
            onComplete: this.completeHandler,
            onCompleteParams: [parameter, object]
        });
        var path = (parameter.path) ? parameter.path : ""; //路径
        if (!path || path == "") return t1;
        var autoReverse = (parameter.autoReverse == 1) ? true : false; //自动翻转(系统自带,实为沿路径返回)
        var subRepeat = (autoReverse == true) ? 1 : 0; //如果autoReverse为真而子动画必须为1，否则默认为0
        var autoRotate = (parameter.objFollow == 1) ? true : false; //是否跟随路径旋转对象(Z轴)
        var autoTurn = (parameter.objFollow == 2) ? true : false; //反向运动时自动翻转对象(Y轴)
        //连续行为参数处理
        var axis = 0;
        var degree = 0; //旋转角度
        var scaleFactor = null; //缩放比例(未设置时必须为null才能不影响其它动画效果)
        // var motionScript = ""; //连续脚本
        if (parameter.attrAlongPath) {
            axis = parameter.attrAlongPath.axis ? parameter.attrAlongPath.axis : 0;
            degree = Math.abs(parameter.attrAlongPath.degree) > 0 ? Number(parameter.attrAlongPath.degree) : 0;
            scaleFactor = (parameter.attrAlongPath.scaleFactor > 0) ? parameter.attrAlongPath.scaleFactor : null;
            // motionScript = parameter.attrAlongPath.motionScript;
        }

        var currentFrame = 0; //当前帧
        var currentDegree = 0; //当前翻转角度
        var currentOffset = object.offset(); //对象当前位置
        var turnState = ""; //当前运动状态(左/右)
        //对象原点坐标（相对页面原点）
        var objInfo = {
            top: currentOffset.top,
            left: currentOffset.left,
            oX: currentOffset.left + object.width() / 2, //计算object的中心点x坐标
            oY: currentOffset.top + object.height() / 2 //计算object的中心点有y坐标
        };
        //移动起点坐标（默认为对象原点0,0）
        var x0 = 0,
            y0 = 0;
        //对象当前坐标
        var cx = 0,
            cy = 0;

        function resetStartPoint(x, y) {
            //如果路径动画为：EffectPathStairsDown向下阶梯、EffectPathBounceLeft向左弹跳、EffectPathBounceRight 向右弹跳，则需要重置起点坐标(此问题待验证,暂取消)
            /*if (parameter.animationName == "EffectPathStairsDown" || parameter.animationName == "EffectPathBounceLeft" || parameter.animationName == "EffectPathBounceRight") {
            	x0 = x;
            	y0 = y;
            }*/
            //更新当前坐标
            cx = x;
            cy = y;
        }
        var isCurve = (path.indexOf("C") < 0 && path.indexOf("c") < 0); //是否为曲线路径
        var ArrPath = path.split(' ');
        var svgPath = ''; //VML路径转SVG路径(测试)
        var quArr = [];
        var x, y
        for (var k = 0; k < ArrPath.length; k++) {
            var str = ArrPath[k];
            switch (str) {
                case "M": //移动（开始）
                case "m":
                    x = Math.round(ArrPath[k + 1] * this.screenWidth);
                    y = Math.round(ArrPath[k + 2] * this.screenHeight);
                    /*t1.add(TweenMax.to(object, 0.001, {
                    	x: x,
                    	y: y
                    }));*/
                    quArr.push({
                        x: x,
                        y: y
                    });
                    k = k + 2;
                    resetStartPoint(x, y);
                    svgPath += 'M ' + (objInfo.oX + x) + ' ' + (objInfo.oY + y);
                    break;
                case "C": //曲线
                case "c":
                    var x1 = x0 + Math.round(ArrPath[k + 1] * this.screenWidth);
                    var y1 = y0 + Math.round(ArrPath[k + 2] * this.screenHeight);
                    var x2 = x0 + Math.round(ArrPath[k + 3] * this.screenWidth);
                    var y2 = y0 + Math.round(ArrPath[k + 4] * this.screenHeight);
                    var x3 = x0 + Math.round(ArrPath[k + 5] * this.screenWidth);
                    var y3 = y0 + Math.round(ArrPath[k + 6] * this.screenHeight);
                    quArr.push({
                        x: x1,
                        y: y1
                    }, {
                            x: x2,
                            y: y2
                        }, {
                            x: x3,
                            y: y3
                        });
                    k = k + 6;
                    resetStartPoint(x3, y3);
                    svgPath += ' C ' + (objInfo.oX + x1) + ' ' + (objInfo.oY + y1) + ' ' + (objInfo.oX + x2) + ' ' + (objInfo.oY + y2) + ' ' + (objInfo.oX + x3) + ' ' + (objInfo.oY + y3);
                    break;
                case "L": //直线
                case "l":
                    x = x0 + Math.round(ArrPath[k + 1] * this.screenWidth);
                    y = y0 + Math.round(ArrPath[k + 2] * this.screenHeight);
                    if (x == cx && y == cy) {
                        k = k + 2;
                        break;
                    }
                    quArr.push({
                        x: x,
                        y: y
                    });
                    k = k + 2;
                    resetStartPoint(x, y);
                    svgPath += ' L ' + (objInfo.oX + x) + ' ' + (objInfo.oY + y);
                    break;
                case "Z": //闭合
                    if (quArr[0].x != quArr[quArr.length - 1].x || quArr[0].y != quArr[quArr.length - 1].y) {
                        quArr.push({
                            x: quArr[0].x,
                            y: quArr[0].y
                        });
                    }
                    svgPath += ' Z';
                    break;
                case "E": //结束
                    break;
            }
        }
        //启用手势
        if (parameter.gesture) {
            t1 = new TimelineMax({
                paused: true,
                useFrames: true
            });
            parameter.tweenEase = "Linear.easeNone"; //手势控制必须为匀速运动

            //创建SVG路径(用于测试)
            /*if (isDesktop) {
            	if ($("#svgPathContainer").length == 0)
            		this.container.append('<div id="svgPathContainer" style="position:absolute;width:100%;height:100%;"><svg width="100%" height="100%"  xmlns="http://www.w3.org/2000/svg" version="1.1"></svg></div>');
            	var svgDocument = $("#svgPathContainer").find("svg")[0];
            	//创建当前路径
            	var p = makeShape("Path", {
            		id: "Path_" + object[0].id,
            		d: svgPath
            	});
            	svgDocument.appendChild(p);
            }*/

            //创建手势控制区域
            var controlId = object[0].id; //控制区ID
            if (parameter.gesture.controlType == 1) {
                if (parameter.pathContent > 0) {
                    controlId = controlId.replace(/\d+$/, parameter.pathContent);
                } else {
                    controlId = "Cont_" + object[0].id;
                    // var expandArea = 20; //最小可触摸尺寸(扩展外框)
                    //     var rect = p.getBoundingClientRect();
                    //     this.container.append('<div id="' + controlId + '" style="z-index:9999;position:absolute;left:' + (rect.left - expandArea) + 'px;top:' + (rect.top - expandArea) + 'px;width:' + (rect.width + expandArea * 2) + 'px;height:' + (rect.height + expandArea * 2) + 'px;"></div>');
                }
            }
            //计算路径距离
            var distance = 0;
            //distance = p.getTotalLength(); //SVG路径获取长度
            var sprotInfo = [];
            for (var m = 1; m < quArr.length; m++) {
                //获取距离
                distance += calculateDistance(quArr[m], quArr[m - 1]);
                sprotInfo.push({
                    start: 0,
                    end: distance,
                    quadrant: calculateDirection(quArr[m], quArr[m - 1])
                });
            }
            //修改时间为帧数(距离转换为帧)
            duration = Math.floor(distance);
            //触发点列表
            var cuePoints = [];
            if (parameter.gesture.cuePoints) {
                for (var i = 0; i < parameter.gesture.cuePoints.length; i++) {
                    cuePoints.push({
                        cueStart: Math.floor(parameter.gesture.cuePoints[i].cueStart * duration),
                        cueEnd: Math.floor(parameter.gesture.cuePoints[i].cueEnd * duration),
                        valueStart: parameter.gesture.cuePoints[i].valueStart,
                        valueEnd: parameter.gesture.cuePoints[i].valueEnd,
                        mouseEnter: false,
                        mouseLeave: false
                    });
                }
            }

            //绑定手势事件
            var historyPoint = null;

            var startEvent = function (e) {
                historyPoint = {
                    x: (hasTouch ? e.changedTouches[0].pageX : e.clientX),
                    y: (hasTouch ? e.changedTouches[0].pageY : e.clientY)
                };
            }

            var moveEnd = function () {
                historyPoint = null;
                //松手后行为(辅助对象ID)
                if (parameter.gesture.afterTouch > 0)
                    Xut.Assist.Run(parameter.pageType, parameter.gesture.afterTouch, null);
            }

            var moveEvent = function (e) {
                var i
                var currentPoint = {
                    x: (hasTouch ? e.changedTouches[0].pageX : e.clientX),
                    y: (hasTouch ? e.changedTouches[0].pageY : e.clientY)
                }
                var d = calculateDistance(currentPoint, historyPoint); //鼠示移动距离
                var quadrant1 = 0; //对象移动方向
                for ( i = 0; i < sprotInfo.length; i++) {
                    if (currentFrame <= sprotInfo[i].end) {
                        quadrant1 = sprotInfo[i].quadrant;
                        break;
                    }
                }
                var quadrant2 = calculateDirection(currentPoint, historyPoint); //鼠标移动方向
                switch (quadrant1) {
                    case "1":
                    case "2":
                        if (quadrant2 == "1" || quadrant2 == "2")
                            currentFrame = currentFrame + d;
                        else if (quadrant2 == "3" || quadrant2 == "4")
                            currentFrame = currentFrame - d;
                        else if (quadrant2 == "+x" || quadrant2 == "-x")
                            currentFrame = currentFrame + (currentPoint.x - historyPoint.x);
                        else if (quadrant1 == "1" && (quadrant2 == "+y" || quadrant2 == "-y"))
                            currentFrame = currentFrame - (currentPoint.y - historyPoint.y);
                        else if (quadrant1 == "2" && (quadrant2 == "+y" || quadrant2 == "-y"))
                            currentFrame = currentFrame + (currentPoint.y - historyPoint.y);
                        break;
                    case "3":
                    case "4":
                        if (quadrant2 == "3" || quadrant2 == "4")
                            currentFrame = currentFrame + d;
                        else if (quadrant2 == "1" || quadrant2 == "2")
                            currentFrame = currentFrame - d;
                        else if (quadrant2 == "+x" || quadrant2 == "-x")
                            currentFrame = currentFrame - (currentPoint.x - historyPoint.x);
                        else if (quadrant1 == "3" && (quadrant2 == "+y" || quadrant2 == "-y"))
                            currentFrame = currentFrame + (currentPoint.y - historyPoint.y);
                        else if (quadrant1 == "4" && (quadrant2 == "+y" || quadrant2 == "-y"))
                            currentFrame = currentFrame - (currentPoint.y - historyPoint.y);
                        break;
                    case "+x":
                        if (quadrant2 == "1" || quadrant2 == "2")
                            currentFrame = currentFrame + d;
                        else if (quadrant2 == "3" || quadrant2 == "4")
                            currentFrame = currentFrame - d;
                        else if (quadrant2 == "+x" || quadrant2 == "-x")
                            currentFrame = currentFrame + (currentPoint.x - historyPoint.x);
                        break;
                    case "-x":
                        if (quadrant2 == "1" || quadrant2 == "2")
                            currentFrame = currentFrame - d;
                        else if (quadrant2 == "3" || quadrant2 == "4")
                            currentFrame = currentFrame + d;
                        else if (quadrant2 == "+x" || quadrant2 == "-x")
                            currentFrame = currentFrame - (currentPoint.x - historyPoint.x);
                        break;
                    case "+y":
                        if (quadrant2 == "1" || quadrant2 == "4")
                            currentFrame = currentFrame - d;
                        else if (quadrant2 == "2" || quadrant2 == "3")
                            currentFrame = currentFrame + d;
                        else if (quadrant2 == "+y" || quadrant2 == "-y")
                            currentFrame = currentFrame + (currentPoint.y - historyPoint.y);
                        break;
                    case "-y":
                        if (quadrant2 == "1" || quadrant2 == "4")
                            currentFrame = currentFrame + d;
                        else if (quadrant2 == "2" || quadrant2 == "3")
                            currentFrame = currentFrame - d;
                        else if (quadrant2 == "+y" || quadrant2 == "-y")
                            currentFrame = currentFrame - (currentPoint.y - historyPoint.y);
                        break;
                }
                if (currentFrame <= 0) currentFrame = 0;
                if (currentFrame >= duration) currentFrame = duration;
                t1.seek(currentFrame);
                updateTurnState();
                historyPoint = currentPoint; 
                //处理触发点列表
                for (i = 0; i < cuePoints.length; i++) {
                    if (cuePoints[i].mouseEnter == false && currentFrame >= cuePoints[i].cueStart && currentFrame <= cuePoints[i].cueEnd) {
                        cuePoints[i].mouseEnter = true;
                        cuePoints[i].mouseLeave = false;
                        if (cuePoints[i].valueStart > 0) Xut.Assist.Run(parameter.pageType, cuePoints[i].valueStart, null);
                        break;
                    } else if (cuePoints[i].mouseEnter == true && cuePoints[i].mouseLeave == false && (currentFrame < cuePoints[i].cueStart || currentFrame > cuePoints[i].cueEnd)) {
                        cuePoints[i].mouseEnter = false;
                        cuePoints[i].mouseLeave = true;
                        if (cuePoints[i].valueEnd > 0) Xut.Assist.Run(parameter.pageType, cuePoints[i].valueEnd, null);
                        break;
                    }
                } 
            } 

            var objectId = object[0].id;
            if (parameter.gesture.controlType == 1) objectId = controlId;
            new onTouchMove(parameter.pageType, controlId, objectId, startEvent, moveEvent, moveEnd);
        }
        //贝赛尔曲线参数构造
        var bezierObj = {
            type: "soft",
            values: quArr,
            autoRotate: autoRotate
        };
        if (isCurve == true) bezierObj = {
            curviness: 0, //curviness圆滑度(数字越大越圆滑),默认为1,0是直线运动
            values: quArr,
            autoRotate: autoRotate
        };
        //实例化动画参数
        if (degree == 0) {
            t1.to(object, duration, {
                scale: scaleFactor,
                bezier: bezierObj,
                repeat: subRepeat,
                yoyo: autoReverse,
                onUpdate: updateTurnState,
                ease: parameter.tweenEase
            });
        } else {
            switch (axis) {
                default:
                case 0: //Z轴
                    t1.to(object, duration, {
                        scale: scaleFactor,
                        rotation: degree + "deg",
                        bezier: bezierObj,
                        repeat: subRepeat,
                        yoyo: autoReverse,
                        onUpdate: updateTurnState,
                        ease: parameter.tweenEase
                    });
                    break;
                case 1: //X轴
                    t1.to(object, duration, {
                        scale: scaleFactor,
                        rotationX: degree + "deg",
                        bezier: bezierObj,
                        repeat: subRepeat,
                        yoyo: autoReverse,
                        onUpdate: updateTurnState,
                        ease: parameter.tweenEase
                    });
                    break;
                case 2: //Y轴
                    t1.to(object, duration, {
                        scale: scaleFactor,
                        rotationY: degree + "deg",
                        bezier: bezierObj,
                        repeat: subRepeat,
                        yoyo: autoReverse,
                        onUpdate: updateTurnState,
                        ease: parameter.tweenEase
                    });
                    break;
            } 
        } 
        //初始化定位(百分比)
        if (parameter.gesture && parameter.gesture.initPos > 0) {
            currentFrame = duration * parameter.gesture.initPos;
            t1.seek(currentFrame);
        }
        return t1;

        function updateTurnState() {
            /*var sel=object[0]
            sel.style.display = 'none';
            sel.offsetHeight;
            sel.style.display = 'block';*/
            if (autoTurn == false) return;
            var oldOffset = currentOffset;
            currentOffset = object.offset();
            if (turnState == "") {
                if (currentOffset.left > oldOffset.left) {
                    turnState = "left";
                } else if (currentOffset.left < oldOffset.left) {
                    turnState = "right";
                }
            } else {
                if (currentOffset.left > oldOffset.left) {
                    if (turnState == "right") {
                        if (currentDegree == 0) currentDegree = 180;
                        else currentDegree = 0;
                        TweenLite.set(object.children(), {
                            rotationY: currentDegree
                        });
                        turnState = "left";
                    }
                } else if (currentOffset.left < oldOffset.left) {
                    if (turnState == "left") {
                        if (currentDegree == 0) currentDegree = 180;
                        else currentDegree = 0;
                        TweenLite.set(object.children(), {
                            rotationY: currentDegree
                        });
                        turnState = "right";
                    }
                }
            }
        }
    }



    /**
     * rect切割效果更新
     * @param  {[type]}  t1        [description]
     * @param  {[type]}  object    [description]
     * @param  {Boolean} isExit    [description]
     * @param  {[type]}  direction [description]
     * @param  {[type]}  objInfo   [description]
     * @return {[type]}            [description]
     */
    animproto._updateClipRect = function (t1, object, isExit, direction, objInfo) {
        var progress = t1.progress();
        var len = progress;
        var width, left, top, height
        if (isExit == false) {
            top = objInfo.height * (1 - len);
            height = objInfo.height - top;
            left = objInfo.width * (1 - len);
            width = objInfo.width - left;
            switch (direction) {
                case "DirectionUp":
                    object.css("clip", "rect(0px " + objInfo.width + "px " + height + "px 0px)");
                    break;
                case "DirectionDown":
                    object.css("clip", "rect(" + top + "px " + objInfo.width + "px " + objInfo.height + "px 0px)");
                    break;
                case "DirectionLeft":
                    object.css("clip", "rect(0px " + width + "px " + objInfo.height + "px 0px)");
                    break;
                case "DirectionRight":
                    object.css("clip", "rect(0px " + objInfo.width + "px " + objInfo.height + "px " + left + "px)");
                    break;
                default:
                    console.log("_updateClipRect:parameter error.");
                    break;
            }
        } else {
            top = objInfo.height * len;
            height = objInfo.height - top;
            left = objInfo.width * len;
            width = objInfo.width - left;
            switch (direction) {
                case "DirectionUp":
                    object.css("clip", "rect(" + top + "px " + objInfo.width + "px " + objInfo.height + "px 0px)");
                    break;
                case "DirectionDown":
                    object.css("clip", "rect(0px " + objInfo.width + "px " + height + "px 0px)");
                    break;
                case "DirectionLeft":
                    object.css("clip", "rect(0px " + objInfo.width + "px " + objInfo.height + "px " + left + "px)");
                    break;
                case "DirectionRight":
                    object.css("clip", "rect(0px " + width + "px " + objInfo.height + "px 0px)");
                    break;
                default:
                    console.log("_updateClipRect:parameter error.");
                    break;
            }
        }
    }


    /**
     * 获取对象至屏幕中心的距离
     * @param  {[type]} object [description]
     * @return {[type]}        [description]
     */
    animproto._getDirectionInCenter = function (object) {
        var objInfo = this._getObjectInfo(object);
        var x = Math.round(this.screenWidth / 2 - objInfo.offsetLeft - objInfo.width / 2);
        var y = Math.round(this.screenHeight / 2 - objInfo.offsetTop - objInfo.height / 2);
        return {
            x: x,
            y: y
        };
    }

    /**
     * 获取对象相关信息
     * @param  {[type]} object [description]
     * @return {[type]}        [description]
     */
    animproto._getObjectInfo = function (object) {
        var width = Math.round(object.width()); //四舍五入取整
        var height = Math.round(object.height());
        var top = Math.round(object.css("top").replace("px", ""));
        var left = Math.round(object.css("left").replace("px", ""));
        var offsetTop = Math.round(object.offset().top);
        if (object.attr("offsetTop"))
            offsetTop = parseInt(object.attr("offsetTop"));
        else
            object.attr("offsetTop", offsetTop);
        var offsetBottom = Math.ceil(this.screenHeight - offsetTop - height);
        var offsetLeft = Math.round(object.offset().left);
        if (object.attr("offsetLeft"))
            offsetLeft = parseInt(object.attr("offsetLeft"));
        else
            object.attr("offsetLeft", offsetLeft);
        var offsetRight = Math.ceil(this.screenWidth - offsetLeft - width);
        return {
            width: width,
            height: height,
            top: top,
            left: left,
            offsetTop: offsetTop,
            offsetLeft: offsetLeft,
            offsetBottom: offsetBottom,
            offsetRight: offsetRight
        };
    }

}