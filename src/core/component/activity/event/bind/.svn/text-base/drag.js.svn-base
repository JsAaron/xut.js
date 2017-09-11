/**
 * 拖拽类
 */
export default class {

  constructor(dragElement, dropElement, autoReturn, dragCallback, dropCallback, container, throwProps) {

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
    if(isInit == null) {
      this.init();
      this.dragElement.attr("data-DragDrop", true);
    } else {
      console.log("This element has binding DragDropClass.");
    }
  }

  /**
   * 初始化拖拽
   * @return {[type]} [description]
   */
  init() {
    if(this.dragObject != null) return;

    let self = this

    //now make both boxes draggable.
    let dragObject = this.dragObject = Draggable.create(this.dragElement, {
      bounds: this.container,
      dragResistance: 0,
      edgeResistance: 0.8,
      type: "left,top", //rotation、scroll(x+y模式与PPT动画冲突)
      force3D: false, //是否启用硬件加速(left+top模式无需启用，启用后存在闪现问题)
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
        if(self.dragCallback) self.dragCallback();
      },
      onDragEnd: function(e) {
        var dropElement = self.dropElement,
          isEnter = false; //是否进入目标

        //目标元素可见才可以拖拽成功
        if(dropElement && dropElement[0].style.visibility != "hidden") {
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
          if(dragObject.pointerX > toPoint.x && dragObject.pointerX < (toPoint.x + toPoint.w) && dragObject.pointerY > toPoint.y && dragObject.pointerY < (toPoint.y + toPoint.h)) {
            isEnter = true;
            dragObject.disable();
          } else if(targetCenter.pointerX > fromPoint.x && targetCenter.pointerX < (fromPoint.x + fromPoint.w) && targetCenter.pointerY > fromPoint.y && targetCenter.pointerY < (fromPoint.y + fromPoint.h)) {
            isEnter = true;
            dragObject.disable();
          }
          //拖拽成功
          if(isEnter == true) {
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
          } else if(self.autoReturn) TweenLite.to(self.dragElement, 0.70, {
            css: {
              left: self.defaultPoint.left,
              top: self.defaultPoint.top
            }
          });
        } else if(self.autoReturn) TweenLite.to(self.dragElement, 0.70, {
          css: {
            left: self.defaultPoint.left,
            top: self.defaultPoint.top
          }
        });
        //不管是否存在拖拽目标元素 拖拽成功与否最后还原成原来的z-index
        self.dragElement.css("z-index", self.dragElement.attr("data-defaultindex"));
        //调用结束事件
        if(self.dropCallback) self.dropCallback(isEnter);
      }
    })[0];
  }

  /**
   * 复位动画与状态
   * @return {[type]} [description]
   */
  reset() {
    var self = this;
    var dragObject;
    if(dragObject = this.dragObject) {
      dragObject.enable();
      if(self.defaultPoint) {
        self.dragElement.css("left", self.defaultPoint.left);
        self.dragElement.css("top", self.defaultPoint.top);
      }
      /*TweenLite.to(self.dragElement, 0, {
          css: {
              x: 0,
              y: 0
          }
      });*/
    }
  }


  disable() {
    var dragObject;
    if(dragObject = this.dragObject) {
      dragObject.disable();
    }
  }


  destroy() {
    this.dragObject && this.dragObject.kill();
    this.dropElement = null;
    this.dragElement = null;
    this.dragObject = null;
  }

}