/**
 * dragdrop.js - Drag & Drop for Zepto/jQuery with touch and mouse events.
 *requestAnimationFrame
 * 参数说明
 * dragElement: 自动拖动对象
 * dropElement: 拖拽目标对象
 * autoReturn: 1:自动返回 0:留在原地(整型值)
 * dragCallback: 拖动对象时执行的回调方法
 * dropCallback: 结束拖动后执行的回调方法(有一个boolean参数,回调时true代表拖动到了目标对象)
 * container: 允许拖拽区域（当启用缓冲时且未设置拖拽区域即可扔出屏外）
 * throwProps:是否缓冲(默认为true,只有当autoReturn为0时生效)
 *
 **/
;
function CanvasDragDropClass(dragElement, dropElement, autoReturn, dragCallback, dropCallback, container, throwProps) {

    dragElement.visible=true
    this.dragElement = dragElement;

    this.defaultPoint = null;
    this.dropElement = dropElement;
    this.autoReturn = (autoReturn >= 1) ? true : false; //1:自动返回(true) 0:留在原地(false)
    this.dragCallback = (typeof(dragCallback) == "function") ? dragCallback : null;
    this.dropCallback = (typeof(dropCallback) == "function") ? dropCallback : null;
    this.throwProps = (throwProps == false || this.autoReturn) ? false : true;
    this.container = container;
    this.dragObject = null; //创建的拖拽对象实例
     var isInit = this.dragElement.initDragDrop
    if (isInit == null) {
        this.init();
        this.dragElement.initDragDrop= true;
    } else {
        console.log("This element has binding DragDropClass.");
    }
}
CanvasDragDropClass.prototype={
    reset:function(){
        var self = this;
        this.disable();
        if (self.defaultPoint) {
            self.dragElement.x=self.defaultPoint.x;
            self.dragElement.y= self.defaultPoint.y;
        }

    },
    disable:function(){
    this.dragElement.interactive=false;
    this.dragElement.initDragDrop=null;
    },
    destroy:function(){
    this.dragElement.interactive=false;
    this.dragElement.initDragDrop=null;
    },
    init:function(){
        var self=this;
        self.defaultPoint =null;
        this.dragElement.interactive=true;
         this.dragElement.mousedown = this.dragElement.touchstart = function(data) {
            if (self.defaultPoint == null) {
                self.defaultPoint = {
                    x: this.x,
                    y: this.y

                };
            }
            Xut.Contents.Canvas.SupportSwipe=false;
            self.data=data;
            this.alpha = 1;
            this.dragging = true;
            if (self.dragCallback) self.dragCallback();
        }
         this.dragElement.mousemove = this.dragElement.touchmove = function(data) {
            if (this.dragging) {
                var newPosition = self.data.getLocalPosition(this.parent);
                this.position.x = newPosition.x-this.width/2;
                this.position.y = newPosition.y-this.height/2;
            }
        }
        this.dragElement.mouseup= this.dragElement.touchend= this.dragElement.touchcancel=function(data) {
             this.dragging=false;
               var dropElement = self.dropElement,
                    isEnter = false; //是否进入目标
                var newPosition = self.data.getLocalPosition(this.parent);
                if (dropElement) {
                    //获取拖拽对象当前参数
                    var fromOffset = self.dragElement;
                    var fromPoint = {
                        x: fromOffset.x,
                        y: fromOffset.x,
                        w: self.dragElement.width,
                        h: self.dragElement.height
                    }
                    //获取目标对象参数
                    var toOffset = self.dropElement;
                    var toPoint = {
                        x: toOffset.x,
                        y: toOffset.x,
                        w: dropElement.width,
                        h: dropElement.height
                    };
                    //目标对象中心点
                    var targetCenter = {
                        x: toPoint.x + toPoint.w / 2,
                        y: toPoint.y + toPoint.h / 2
                    };
                    //拖拽点位于目标框中或目标中心点位于拖拽框中视为拖拽成功
                    if (newPosition.x > toPoint.x && newPosition.x < (toPoint.x + toPoint.w) && newPosition.y > toPoint.y && newPosition.y < (toPoint.y + toPoint.h)) {
                        isEnter = true;
                          this.dragElement.interactive=false;
                    } else if (targetCenter.x > fromPoint.x && targetCenter.x < (fromPoint.x + fromPoint.w) && targetCenter.x > fromPoint.y && targetCenter.y < (fromPoint.y + fromPoint.h)) {
                        isEnter = true;
                        this.dragElement.interactive=false;
                    }
                    //拖拽成功
                    if (isEnter == true) {
                       //结束后恢复层级关系
                      // self.dragElement.css("z-index", self.dragElement.attr("data-defaultindex"));
                       
                        //拖拽对象与目标对象中心点差
                        var moveX = targetCenter.x - (self.defaultPoint.x + fromPoint.w / 2);
                        var moveY = targetCenter.y - (self.defaultPoint.y + fromPoint.h / 2);
                        //拖拽对象最终停放位置
                        var newLeft = self.defaultPoint.x + moveX;
                        var newTop = self.defaultPoint.y + moveY;
                        //自动拖拽到位
                        TweenLite.to(self.dragElement, 0.30, {
                                x: newLeft,
                                y: newTop,
                                ease: Expo.easeOut
                        });
                    } else if (self.autoReturn) TweenLite.to(self.dragElement, 0.70, {
                      
                            x: self.defaultPoint.x,
                            y: self.defaultPoint.y
                        
                    });
                } else if (self.autoReturn) TweenLite.to(self.dragElement, 0.70, {
                   
                        x: self.defaultPoint.x,
                        y: self.defaultPoint.y
                    
                });
                //调用结束事件
                if (self.dropCallback) self.dropCallback(isEnter);
        }

    }



}
function DragDropClass(dragElement, dropElement, autoReturn, dragCallback, dropCallback, container, throwProps) {

    if(!dragElement.length){
      return new CanvasDragDropClass(dragElement, dropElement, autoReturn, dragCallback, dropCallback, container, throwProps); 
    }
    if (!(this instanceof DragDropClass)) {
        return new DragDropClass(dragElement, dropElement, autoReturn, dragCallback, dropCallback, container, throwProps);
    }
    this.dragElement = dragElement;
	this.defaultPoint = null;
    this.dropElement = dropElement;
    this.autoReturn = (autoReturn >= 1) ? true : false; //1:自动返回(true) 0:留在原地(false)
    this.dragCallback = (typeof(dragCallback) == "function") ? dragCallback : null;
    this.dropCallback = (typeof(dropCallback) == "function") ? dropCallback : null;
    this.throwProps = (throwProps == false || this.autoReturn) ? false : true;
    this.container = container;
    this.dragElement.attr("data-defaultindex", this.dragElement.css("z-index"))
    //this.dragObject = null; //创建的拖拽对象实例
    
    var isInit = this.dragElement.attr("data-DragDrop");
    if (isInit == null) {
        this.init();
        this.dragElement.attr("data-DragDrop", true);
    } else {
        console.log("This element has binding DragDropClass.");
    }
}

DragDropClass.prototype = {
    //复位动画与状态
    reset: function() {
        var self = this;
        var dragObject;
        if (dragObject = this.dragObject) {
            dragObject.enable();
			if(self.defaultPoint){
				self.dragElement.css("left",self.defaultPoint.left);
				self.dragElement.css("top",self.defaultPoint.top);
			}
            /*TweenLite.to(self.dragElement, 0, {
                css: {
                    x: 0,
                    y: 0
                }
            });*/
        }
    },

    disable: function() {
        var dragObject;
        if (dragObject = this.dragObject) {
            dragObject.disable();
        }
    },

    destroy: function() {
        this.dragObject && this.dragObject.disable();
        this.dropElement = null;
        this.dragElement = null;
        this.dragObject = null;
    },

    init: function() {
        if (this.dragObject != null) return;

        var dragObject, self = this,
            defaultPoint;
        //now make both boxes draggable.
        dragObject = this.dragObject = Draggable.create(this.dragElement, {
            bounds: this.container,
            dragResistance: 0,
            edgeResistance: 0.8,
            type: "left,top", //rotation、scroll(x+y模式与PPT动画冲突)
			force3D:false, //是否启用硬件加速(left+top模式无需启用，启用后存在闪现问题)
            throwProps: this.throwProps,
            snap: {
                left: function(endValue) {
                    return endValue;
                },
                top: function(endValue) {
                    return endValue;
                }
            },
            onDragStart: function(e) {
                //获取拖拽对象原始参数
                var defaultOffset = self.dragElement.offset();
                self.defaultPoint = {
                    x: defaultOffset.left,
                    y: defaultOffset.top,
                    left: Number(self.dragElement.css("left").replace("px", "")),
                    top: Number(self.dragElement.css("top").replace("px", ""))
                };
                if (self.dragCallback) self.dragCallback();
            },
            onDragEnd: function(e) {
                var dropElement = self.dropElement,
                    isEnter = false; //是否进入目标

                if (dropElement) {
                    //获取拖拽对象当前参数
                    var fromOffset = self.dragElement.offset();
                    var fromPoint = {
                        x: fromOffset.left,
                        y: fromOffset.top,
                        w: self.dragElement.width(),
                        h: self.dragElement.height()
                    }
                    //获取目标对象参数
                    var toOffset = dropElement.offset();
                    var toPoint = {
                        x: toOffset.left,
                        y: toOffset.top,
                        w: dropElement.width(),
                        h: dropElement.height()
                    };
                    //目标对象中心点
                    var targetCenter = {
                        pointerX: toPoint.x + toPoint.w / 2,
                        pointerY: toPoint.y + toPoint.h / 2
                    };
                    //拖拽点位于目标框中或目标中心点位于拖拽框中视为拖拽成功
                    if (dragObject.pointerX > toPoint.x && dragObject.pointerX < (toPoint.x + toPoint.w) && dragObject.pointerY > toPoint.y && dragObject.pointerY < (toPoint.y + toPoint.h)) {
                        isEnter = true;
                        dragObject.disable();
                    } else if (targetCenter.pointerX > fromPoint.x && targetCenter.pointerX < (fromPoint.x + fromPoint.w) && targetCenter.pointerY > fromPoint.y && targetCenter.pointerY < (fromPoint.y + fromPoint.h)) {
                        isEnter = true;
                        dragObject.disable();
                    }
                    self.dragElement.css("z-index", self.dragElement.attr("data-defaultindex"));
                    //拖拽成功
                    if (isEnter == true) {
                       //结束后恢复层级关系
                      // self.dragElement.css("z-index", self.dragElement.attr("data-defaultindex"));
                       
                        //拖拽对象与目标对象中心点差
                        var moveX = targetCenter.pointerX - (self.defaultPoint.x + fromPoint.w / 2);
                        var moveY = targetCenter.pointerY - (self.defaultPoint.y + fromPoint.h / 2);
                        //拖拽对象最终停放位置
                        var newLeft = self.defaultPoint.left + moveX;
                        var newTop = self.defaultPoint.top + moveY;
                        //自动拖拽到位
                        TweenLite.to(self.dragElement, 0.30, {
                            css: {
                                left: newLeft,
                                top: newTop
                            },
                            ease: Expo.easeOut
                        });
                    } else if (self.autoReturn) TweenLite.to(self.dragElement, 0.70, {
                        css: {
                            left: self.defaultPoint.left,
                            top: self.defaultPoint.top
                        }
                    });
                } else if (self.autoReturn) TweenLite.to(self.dragElement, 0.70, {
                    css: {
                        left: self.defaultPoint.left,
                        top: self.defaultPoint.top
                    }
                });
                //调用结束事件
                if (self.dropCallback) self.dropCallback(isEnter);
            }
        })[0];
    }
}