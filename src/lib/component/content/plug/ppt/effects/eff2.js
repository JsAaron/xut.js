/**
 * 扩展的特效动画
 * @return {[type]} [description]
 */
export function eff1() {

    return { 
        //基本旋转
        getEffectSwivel: function(parameter, object, isExit, duration, delay, repeat) {
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
        },
        //浮动
        getEffectFloat: function(parameter, object, isExit, duration, delay, repeat) {
            var t1 = null;
            var objInfo = this.getObjectInfo(object);
            if (isExit == false) {
                var x = objInfo.offsetRight + objInfo.width;
                var y = 0 - (objInfo.offsetTop + objInfo.height);
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
                var x = objInfo.offsetRight + objInfo.width;
                var y = 0 - (objInfo.offsetTop + objInfo.height);
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
        },
        //字幕式
        getEffectCredits: function(parameter, object, isExit, duration, delay, repeat) {
            var objInfo = this.getObjectInfo(object);
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
        },
        //弹跳
        getEffectBounce: function(parameter, object, isExit, duration, delay, repeat) {
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
                var total = duration;
                var time1 = total / 5;
                time2 = total / 10;
                time3 = total / 20;
                time4 = total / 40;
                time5 = total / 80;
                var width = 50 + 20 + 10 + 5 + 2.5 + 1 + 0.5 + 0.2 + 0.1;
                var height = this.screenHeight / 4;
                var y1 = height / 2;
                y2 = height / 4;
                y3 = height / 8;
                y4 = height / 16;
                var lastY = objInfo.offsetBottom - height + objInfo.height;

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
                var total = duration;
                var time1 = total / 5;
                time2 = total / 10;
                time3 = total / 20;
                time4 = total / 40;
                time5 = total / 80;
                var height = this.screenHeight / 4;
                var y1 = height / 2;
                y2 = height / 4;
                y3 = height / 8;
                y4 = height / 16;
                var lastY = objInfo.offsetBottom - height + objInfo.height;
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
        },
        //飞旋
        getEffectBoomerang: function(parameter, object, isExit, duration, delay, repeat) {
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
        },
        //中心旋转
        getEffectCenterRevolve: function(parameter, object, isExit, duration, delay, repeat) {
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
        },
        //螺旋飞入/出
        getEffectSpiral: function(parameter, object, isExit, duration, delay, repeat) {
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
        },
        //曲线向上/下
        getEffectArcUp: function(parameter, object, isExit, duration, delay, repeat) {
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
        },
        //脉冲
        getEffectFlashBulb: function(parameter, object, duration, delay, repeat) {
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
        },
        //彩色脉冲
        getEffectFlicker: function(parameter, object, duration, delay, repeat) {
            if (!("-webkit-filter" in object[0].style)) return new TimelineMax();
            //if (repeat < 2) repeat = 2; //默认三次
            var color2 = parameter.color2 ? parameter.color2 : "#fff"; //颜色
            var maxGlowSize = (parameter.maxGlowSize) ? parameter.maxGlowSize : 0.1; //光晕最大尺寸(百分比)
            var minGlowSize = (parameter.minGlowSize) ? parameter.minGlowSize : 0.05; //光晕最小尺寸(百分比)
            var size = (object.width() > object.height()) ? object.height() : object.width();
            var maxSize = maxGlowSize * size;
            var minSize = minGlowSize * size;
            var opacity = (Number(parameter.opacity)) ? parameter.opcity : 0.75; //不透明度
            var distance = (Number(parameter.distance)) ? parameter.distance * size : 0;; //距离
            var color = this.colorHexToRGB(color2, opacity);
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
        },
        //跷跷板
        getEffectTeeter: function(parameter, object, duration, delay, repeat) {
            var t1 = new TimelineMax({
                delay: delay,
                repeat: repeat,
                onStart: this.startHandler,
                onStartParams: [parameter, object],
                onComplete: this.completeHandler,
                onCompleteParams: [parameter, object]
            });
            var mode = parameter.mode;
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
        },
        //陀螺旋转
        getEffectSpin: function(parameter, object, duration, delay, repeat) {
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
        },
        //放大/缩小
        getEffectGrowShrink: function(parameter, object, duration, delay, repeat) {
            var scaleX = parameter.scaleX ? parameter.scaleX : 1; //横向缩放比例
            var scaleY = parameter.scaleY ? parameter.scaleY : 1; //纵向缩放比例
            var keepRatio = (parameter.keepRatio == 0) ? false : true; //保持长宽比
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
                var result = this.getDirectionInCenter(object);
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
        },
        //不饱和
        getEffectDesaturate: function(parameter, object, duration, delay, repeat) {
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
        },
        //加深
        getEffectDarken: function(parameter, object, duration, delay, repeat) {
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
        },
        //变淡
        getEffectLighten: function(parameter, object, duration, delay, repeat) {
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
        },
        //透明
        getEffectTransparency: function(parameter, object, duration, delay, repeat) {
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
        },
        //补色
        getEffectComplementaryColor: function(parameter, object, duration, delay, repeat) {
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
        },
        //闪烁(一次)
        getEffectFlashOnce: function(parameter, object, duration, delay, repeat) {
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
        },
        //路径动画
        getPathAnimation: function(parameter, object, duration, delay, repeat) {
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
            var motionScript = ""; //连续脚本
            if (parameter.attrAlongPath) {
                axis = parameter.attrAlongPath.axis ? parameter.attrAlongPath.axis : 0;
                degree = Math.abs(parameter.attrAlongPath.degree) > 0 ? Number(parameter.attrAlongPath.degree) : 0;
                scaleFactor = (parameter.attrAlongPath.scaleFactor > 0) ? parameter.attrAlongPath.scaleFactor : null;
                motionScript = parameter.attrAlongPath.motionScript;
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
            for (var k = 0; k < ArrPath.length; k++) {
                var str = ArrPath[k];
                switch (str) {
                    case "M": //移动（开始）
                    case "m":
                        var x = Math.round(ArrPath[k + 1] * this.screenWidth);
                        var y = Math.round(ArrPath[k + 2] * this.screenHeight);
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
                        var x = x0 + Math.round(ArrPath[k + 1] * this.screenWidth);
                        var y = y0 + Math.round(ArrPath[k + 2] * this.screenHeight);
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
                /*if (PptAni.isDesktop) {
                    if ($("#svgPathContainer").length == 0)
                        this.container.append('<div id="svgPathContainer" style="position:absolute;width:100%;height:100%;"><svg width="100%" height="100%"  xmlns="http://www.w3.org/2000/svg" version="1.1"></svg></div>');
                    var svgDocument = $("#svgPathContainer").find("svg")[0];
                    //创建当前路径
                    var p = PptAni.makeShape("Path", {
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
                        var expandArea = 20; //最小可触摸尺寸(扩展外框)
                        var rect = p.getBoundingClientRect();
                        this.container.append('<div id="' + controlId + '" style="z-index:9999;position:absolute;left:' + (rect.left - expandArea) + 'px;top:' + (rect.top - expandArea) + 'px;width:' + (rect.width + expandArea * 2) + 'px;height:' + (rect.height + expandArea * 2) + 'px;"></div>');
                    }
                }
                //计算路径距离
                var distance = 0;
                //distance = p.getTotalLength(); //SVG路径获取长度
                var sprotInfo = [];
                for (var k = 1; k < quArr.length; k++) {
                    //获取距离
                    distance += this.calculateDistance(quArr[k], quArr[k - 1]);
                    sprotInfo.push({
                        start: 0,
                        end: distance,
                        quadrant: this.calculateDirection(quArr[k], quArr[k - 1])
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
                var self = this;
                var historyPoint = null;
                var throwStart = throwEnd = {};

                function throwProps(time, dist) {
                    if (time < 300) {
                        var toX, deceleration = 0.0006,
                            speed = Math.abs(dist) / time,
                            newDist = (speed * speed) / (2 * deceleration);
                        if (dist > 0) {
                            toX = currentFrame + newDist;
                            newTime = speed / deceleration;
                            step = newDist / newTime * 10;
                        } else {
                            toX = currentFrame - newDist;
                            newTime = speed / deceleration;
                            step = newDist / newTime * 10;
                        }
                        var medialSpeed = newDist / newTime * 10; //平均速度
                        var startSpeed = medialSpeed * 10; //开始速度
                        var throwTimer = setInterval(function() {
                            var newFrame = 0;
                            if (dist > 0)
                                newFrame = currentFrame + startSpeed;
                            else
                                newFrame = currentFrame - startSpeed;
                            if (newFrame >= duration) newFrame = duration;
                            else if (newFrame <= 0) newFrame = 0;
                            t1.seek(newFrame);
                            currentFrame = newFrame;
                            startSpeed -= medialSpeed;
                            if (startSpeed <= 0 || currentFrame <= 0 || currentFrame >= duration) clearInterval(throwTimer);
                        }, 10);
                    }
                }

                function startEvent(e) {
                    throwStart = {
                        time: Date.now(),
                        frame: currentFrame
                    };
                    historyPoint = {
                        x: (PptAni.hasTouch ? e.changedTouches[0].pageX : e.clientX),
                        y: (PptAni.hasTouch ? e.changedTouches[0].pageY : e.clientY)
                    };
                }

                function moveEnd(e) {
                    throwEnd = {
                        time: Date.now(),
                        frame: currentFrame
                    };
                    //throwProps(throwEnd.time - throwStart.time, throwEnd.frame - throwStart.frame);
                    historyPoint = null;
                    //松手后行为(辅助对象ID)
                    if (parameter.gesture.afterTouch > 0)
                        Xut.Assist.Run(parameter.pageType, parameter.gesture.afterTouch, null);
                }

                function moveEvent(e) {
                    var currentPoint = {
                        x: (PptAni.hasTouch ? e.changedTouches[0].pageX : e.clientX),
                        y: (PptAni.hasTouch ? e.changedTouches[0].pageY : e.clientY)
                    }
                    var d = self.calculateDistance(currentPoint, historyPoint); //鼠示移动距离
                    var quadrant1 = 0; //对象移动方向
                    for (var i = 0; i < sprotInfo.length; i++) {
                        if (currentFrame <= sprotInfo[i].end) {
                            quadrant1 = sprotInfo[i].quadrant;
                            break;
                        }
                    }
                    var quadrant2 = self.calculateDirection(currentPoint, historyPoint); //鼠标移动方向
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
                    for (var i = 0; i < cuePoints.length; i++) {
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
                new PptAni.onTouchMove(parameter.pageType, controlId, objectId, startEvent, moveEvent, moveEnd);
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
    }
}
