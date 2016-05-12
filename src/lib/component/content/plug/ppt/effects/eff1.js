/**
 * 扩展的特效动画
 * @return {[type]} [description]
 */
export function eff1() {

    return { 
        //文字动画
        getTextAnimation: function(parameter, object, duration, delay, repeat) {
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
        },
        //出现/消失
        getEffectAppear: function(parameter, object, isExit, duration, delay, repeat) {
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
        },
        //淡出
        getEffectFade: function(parameter, object, isExit, duration, delay, repeat) {
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
        },
        //飞入效果
        getEffectFly: function(parameter, object, isExit, duration, delay, repeat) {
            var direction = parameter.direction; //方向(上、下、左、右、左上、左下、右上、右下)
            var t1 = null;
            var objInfo = this.getObjectInfo(object);
            var easeString = Expo.easeOut;
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
                        var y = objInfo.offsetBottom + objInfo.height;
                        t1.from(object, duration, {
                            y: y,
                            ease: easeString,
                            immediateRender: false
                        });
                        break;
                    case "DirectionLeft":
                        var x = 0 - (objInfo.offsetLeft + objInfo.width);
                        t1.from(object, duration, {
                            x: x,
                            ease: easeString,
                            immediateRender: false
                        });
                        break;
                    case "DirectionUp":
                        var y = 0 - (objInfo.offsetTop + objInfo.height);
                        t1.from(object, duration, {
                            y: y,
                            ease: easeString,
                            immediateRender: false
                        });
                        break;
                    case "DirectionRight":
                        var x = objInfo.offsetRight + objInfo.width;
                        t1.from(object, duration, {
                            x: x,
                            ease: easeString,
                            immediateRender: false
                        });
                        break;
                    case "DirectionDownLeft":
                        var x = 0 - (objInfo.offsetLeft + objInfo.width);
                        var y = objInfo.offsetBottom + objInfo.height;
                        t1.from(object, duration, {
                            x: x,
                            y: y,
                            ease: easeString,
                            immediateRender: false
                        });
                        break;
                    case "DirectionDownRight":
                        var x = objInfo.offsetRight + objInfo.width;
                        var y = objInfo.offsetBottom + objInfo.height;
                        t1.from(object, duration, {
                            x: x,
                            y: y,
                            ease: easeString,
                            immediateRender: false
                        });
                        break;
                    case "DirectionUpLeft":
                        var x = 0 - (objInfo.offsetLeft + objInfo.width);
                        var y = 0 - (objInfo.offsetTop + objInfo.height);
                        t1.from(object, duration, {
                            x: x,
                            y: y,
                            ease: easeString,
                            immediateRender: false
                        });
                        break;
                    case "DirectionUpRight":
                        var x = objInfo.offsetRight + objInfo.width;
                        var y = 0 - (objInfo.offsetTop + objInfo.height);
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
                        var y = objInfo.offsetBottom + objInfo.height;
                        t1.to(object, duration, {
                            y: y,
                            //clearProps: "y",
                            ease: easeString
                        });
                        break;
                    case "DirectionLeft":
                        var x = 0 - (objInfo.offsetLeft + objInfo.width);
                        t1.to(object, duration, {
                            x: x,
                            //clearProps: "x",
                            ease: easeString
                        });
                        break;
                    case "DirectionUp":
                        var y = 0 - (objInfo.offsetTop + objInfo.height);
                        t1.to(object, duration, {
                            y: y,
                            //clearProps: "y",
                            ease: easeString
                        });
                        break;
                    case "DirectionRight":
                        var x = objInfo.offsetRight + objInfo.width;
                        t1.to(object, duration, {
                            x: x,
                            //clearProps: "x",
                            ease: easeString
                        });
                        break;
                    case "DirectionDownLeft":
                        var x = 0 - (objInfo.offsetLeft + objInfo.width);
                        var y = objInfo.offsetBottom + objInfo.height;
                        t1.to(object, duration, {
                            x: x,
                            y: y,
                            //clearProps: "x,y",
                            ease: easeString
                        });
                        break;
                    case "DirectionDownRight":
                        var x = objInfo.offsetRight + objInfo.width;
                        var y = objInfo.offsetBottom + objInfo.height;
                        t1.to(object, duration, {
                            x: x,
                            y: y,
                            //clearProps: "x,y",
                            ease: easeString
                        });
                        break;
                    case "DirectionUpLeft":
                        var x = 0 - (objInfo.offsetLeft + objInfo.width);
                        var y = 0 - (objInfo.offsetTop + objInfo.height);
                        t1.to(object, duration, {
                            x: x,
                            y: y,
                            //clearProps: "x,y",
                            ease: easeString
                        });
                        break;
                    case "DirectionUpRight":
                        var x = objInfo.offsetRight + objInfo.width;
                        var y = 0 - (objInfo.offsetTop + objInfo.height);
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
        },
        //浮入/浮出(下方)
        getEffectAscend: function(parameter, object, isExit, duration, delay, repeat) {
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
        },
        //浮入/浮出(上方)
        getEffectDescend: function(parameter, object, isExit, duration, delay, repeat) {
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
        },
        //形状一(圆)
        getEffectCircle: function(parameter, object, isExit, duration, delay, repeat) {
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
            });;
            var result = this.getObjectInfo(object);
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
        },
        //形状二(方框)
        getEffectBox: function(parameter, object, isExit, duration, delay, repeat) {
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
            var objInfo = this.getObjectInfo(object);
            t1.to(object, duration, {
                onUpdate: updateEffectBox
            });
            return t1;

            function updateEffectBox() {
                var progress = t1.progress();
                var percent = progress / 2;
                if (isExit == false) {
                    switch (direction) {
                        case "DirectionIn":
                            object.css("-webkit-mask", "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (percent) + ",rgba(0,0,0,1)),color-stop(" + (percent) + ",transparent),color-stop(" + (1 - percent) + ",transparent),color-stop(" + (1 - percent) + ",rgba(0,0,0,1))),-webkit-gradient(linear,0% 0%, 100% 0%, from(rgba(0,0,0,1)), to(rgba(0,0,0,1)),color-stop(" + (percent) + ",rgba(0,0,0,1)),color-stop(" + (percent) + ",transparent),color-stop(" + (1 - percent) + ",transparent),color-stop(" + (1 - percent) + ",rgba(0,0,0,1)))");
                            break;
                        case "DirectionOut":
                            var top = objInfo.height * (0.5 - percent);
                            var height = objInfo.height - top;
                            var left = objInfo.width * (0.5 - percent);
                            var width = objInfo.width - left;
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
                            var top = objInfo.height * percent;
                            var height = objInfo.height - top;
                            var left = objInfo.width * percent;
                            var width = objInfo.width - left;
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
        },
        //形状三(菱形)
        getEffectDiamond: function(parameter, object, isExit, duration, delay, repeat) {
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
            var objInfo = this.getObjectInfo(object);
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
                            //break;
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
                            //break;
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
        },
        //形状四(加号)
        getEffectPlus: function(parameter, object, isExit, duration, delay, repeat) {
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
                            //break;
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
                            //break;
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

        },
        //百叶窗
        getEffectBlinds: function(parameter, object, isExit, duration, delay, repeat) {
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
                            for (var i = 1; i < num; i++) {
                                str += ",color-stop(" + (i * avg) + ",rgba(0,0,0,0))" + ",color-stop(" + (i * avg + temp) + ",rgba(0,0,0,1))";
                                str += ",color-stop(" + (i * avg + percent) + ",rgba(0,0,0,1))" + ",color-stop(" + (i * avg + percent + temp) + ",rgba(0,0,0,0))";
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
                            for (var i = 1; i < num; i++) {
                                str += ",color-stop(" + (i * avg) + ",rgba(0,0,0,1))" + ",color-stop(" + (i * avg - temp) + ",rgba(0,0,0,0))";
                                str += ",color-stop(" + (i * avg - percent) + ",rgba(0,0,0,0))" + ",color-stop(" + (i * avg - percent - temp) + ",rgba(0,0,0,1))";
                            }
                            str += ")";
                            break;
                        case "DirectionVertical": //垂直
                            str = "-webkit-gradient(linear,0% 0%, 0% 100%, from(rgba(0,0,0,1)), to(rgba(0,0,0,0))" + ",color-stop(" + (1 - percent) + ",rgba(0,0,0,0))" + ",color-stop(" + (1 - percent - temp) + ",rgba(0,0,0,1))";
                            for (var i = 1; i < num; i++) {
                                str += ",color-stop(" + (i * avg) + ",rgba(0,0,0,1))" + ",color-stop(" + (i * avg - temp) + ",rgba(0,0,0,0))";
                                str += ",color-stop(" + (i * avg - percent) + ",rgba(0,0,0,0))" + ",color-stop(" + (i * avg - percent - temp) + ",rgba(0,0,0,1))";
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
        },
        //劈裂
        getEffectSplit: function(parameter, object, isExit, duration, delay, repeat) {
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
        },
        //切入/出
        getEffectPeek: function(parameter, object, isExit, duration, delay, repeat) {
            var direction = parameter.direction; //方向(上下左右)
            var t1 = null;
            var objInfo = this.getObjectInfo(object);
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
                            onUpdate: this.updateClipRect,
                            onUpdateParams: [t1, object, isExit, "DirectionDown", objInfo]
                        });
                        break;
                    case "DirectionDown":
                        t1.from(object, duration, {
                            y: objInfo.height,
                            ease: Linear.easeNone,
                            onUpdate: this.updateClipRect,
                            onUpdateParams: [t1, object, isExit, "DirectionUp", objInfo]
                        });
                        break;
                    case "DirectionLeft":
                        t1.from(object, duration, {
                            x: -objInfo.width,
                            ease: Linear.easeNone,
                            onUpdate: this.updateClipRect,
                            onUpdateParams: [t1, object, isExit, "DirectionRight", objInfo]
                        });
                        break;
                    case "DirectionRight":
                        t1.from(object, duration, {
                            x: objInfo.width,
                            ease: Linear.easeNone,
                            onUpdate: this.updateClipRect,
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
                            onUpdate: this.updateClipRect,
                            onUpdateParams: [t1, object, isExit, "DirectionUp", objInfo]
                        });
                        break;
                    case "DirectionDown":
                        t1.to(object, duration, {
                            y: objInfo.height,
                            ease: Linear.easeNone,
                            onUpdate: this.updateClipRect,
                            onUpdateParams: [t1, object, isExit, "DirectionDown", objInfo]
                        });
                        break;
                    case "DirectionLeft":
                        t1.to(object, duration, {
                            x: -objInfo.width,
                            ease: Linear.easeNone,
                            onUpdate: this.updateClipRect,
                            onUpdateParams: [t1, object, isExit, "DirectionLeft", objInfo]
                        });
                        break;
                    case "DirectionRight":
                        t1.to(object, duration, {
                            x: objInfo.width,
                            ease: Linear.easeNone,
                            onUpdate: this.updateClipRect,
                            onUpdateParams: [t1, object, isExit, "DirectionRight", objInfo]
                        });
                        break;
                    default:
                        console.log("getEffectPeek:parameter error.");
                        break;
                }
            }
            return t1;
        },
        //擦除
        getEffectWipe: function(parameter, object, isExit, duration, delay, repeat) {
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
            var objInfo = this.getObjectInfo(object);
            if (isExit == false) {
                //t1.to(object,duration,{onStart:this.startHandler,onStartParams:[object],onUpdate:this.updateLineGradient,onUpdateParams:[t1,object,isExit,direction]});
                t1.to(object, duration, {
                    onUpdate: this.updateClipRect,
                    onUpdateParams: [t1, object, isExit, direction, objInfo]
                });
            } else {
                //t1.to(object,duration,{onUpdate:this.updateLineGradient,onUpdateParams:[t1,object,isExit,direction]});
                t1.to(object, duration, {
                    onUpdate: this.updateClipRect,
                    onUpdateParams: [t1, object, isExit, direction, objInfo]
                });
            }
            return t1;
        },
        //翻转式由远及近
        getEffectGrowAndTurn: function(parameter, object, isExit, duration, delay, repeat) {
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
        },
        //升起/下沉
        getEffectRiseUp: function(parameter, object, isExit, duration, delay, repeat) {
            var t1 = null;
            var objInfo = this.getObjectInfo(object);
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
        },
        //基本缩放
        getEffectZoom: function(parameter, object, isExit, duration, delay, repeat) {
            var direction = parameter.direction; //方向(放大:DirectionIn、屏幕中心放大:DirectionInCenter、轻微放大:DirectionInSlightly、缩小:DirectionOut、屏幕底部缩小:DirectionOutBottom、轻微缩小:DirectionOutSlightly)
            var t1 = null;
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
                        var result = this.getDirectionInCenter(object);
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
                        var result = this.getDirectionInCenter(object);
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
        },
        //缩放 淡出式缩放
        getEffectFadedZoom: function(parameter, object, isExit, duration, delay, repeat) {
            var direction = parameter.direction; //方向(对象中心DirectionIn、幻灯片中心DirectionInCenter)
            var t1 = null;
            object.css("-webkit-transform-origin", "center"); //设置缩放基点(默认是正中心点)
            var svgElement = object.find("svg"); //获取SVG对象
            if (svgElement) svgElement.css('-webkit-transform', 'translate3d(0px, 0px, 0px)'); //解决SVG文字错乱问题

            var keepRatio = (parameter.keepRatio == 0) ? false : true; //保持长宽比
            var fullScreen = (parameter.fullScreen == 1) ? true : false; //缩放到全屏
            var scaleX = parameter.scaleX ? parameter.scaleX : 1; //横向缩放比例
            var scaleY = parameter.scaleY ? parameter.scaleY : 1; //纵向缩放比例
            if (fullScreen == true) {
                //计算比例
                var xScale = this.screenWidth / object.width();
                var yScale = this.screenHeight / object.height();
                var scaleValue = xScale;
                if (xScale > yScale) scaleValue = yScale;
                var result = this.getDirectionInCenter(object);
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
                        var result = this.getDirectionInCenter(object);
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
                        var result = this.getDirectionInCenter(object);
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
        },
        //玩具风车
        getEffectPinwheel: function(parameter, object, isExit, duration, delay, repeat) {
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
        },
        //回旋
        getEffectSpinner: function(parameter, object, isExit, duration, delay, repeat) {
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
        },
        //旋转(淡出式回旋)
        getEffectFadedSwivel: function(parameter, object, isExit, duration, delay, repeat) {
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
        },
        //展开/收缩
        getEffectExpand: function(parameter, object, isExit, duration, delay, repeat) {
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
    }
}
