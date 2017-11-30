import {
  calculateDistance,
  calculateDirection
} from './util'

import MoveMent from './move.ment'

const hasTouch = Xut.plat.hasTouch

/**
 * 路径动画
 * @param  {[type]} animproto [description]
 * @return {[type]}           [description]
 */
export default function path(animproto) {

  //路径动画
  animproto.getPathAnimation = function(parameter, object, duration, delay, repeat) {
    var t1 = new TimelineMax({
      delay: delay,
      repeat: repeat,
      onStart: this._startHandler,
      onStartParams: [parameter, object],
      onComplete: this._completeHandler,
      onCompleteParams: [parameter, object]
    });
    var path = (parameter.path) ? parameter.path : ""; //路径
    if(!path || path == "") return t1;

    var autoReverse = (parameter.autoReverse == 1) ? true : false; //自动翻转(系统自带,实为沿路径返回)
    var subRepeat = (autoReverse == true) ? 1 : 0; //如果autoReverse为真而子动画必须为1，否则默认为0
    var autoRotate = (parameter.objFollow == 1) ? true : false; //是否跟随路径旋转对象(Z轴)
    var autoTurn = (parameter.objFollow == 2) ? true : false; //反向运动时自动翻转对象(Y轴)
    //连续行为参数处理
    var axis = 0;
    var degree = 0; //旋转角度
    var scaleFactor = null; //缩放比例(未设置时必须为null才能不影响其它动画效果)

    // var motionScript = ""; //连续脚本
    if(parameter.attrAlongPath) {
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
    for(var k = 0; k < ArrPath.length; k++) {
      var str = ArrPath[k];
      switch(str) {
        case "M": //移动（开始）
        case "m":
          x = Math.round(ArrPath[k + 1] * this.visualWidth);
          y = Math.round(ArrPath[k + 2] * this.visualHeight);
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
          var x1 = x0 + Math.round(ArrPath[k + 1] * this.visualWidth);
          var y1 = y0 + Math.round(ArrPath[k + 2] * this.visualHeight);
          var x2 = x0 + Math.round(ArrPath[k + 3] * this.visualWidth);
          var y2 = y0 + Math.round(ArrPath[k + 4] * this.visualHeight);
          var x3 = x0 + Math.round(ArrPath[k + 5] * this.visualWidth);
          var y3 = y0 + Math.round(ArrPath[k + 6] * this.visualHeight);
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
          x = x0 + Math.round(ArrPath[k + 1] * this.visualWidth);
          y = y0 + Math.round(ArrPath[k + 2] * this.visualHeight);
          if(x == cx && y == cy) {
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
          if(quArr[0].x != quArr[quArr.length - 1].x || quArr[0].y != quArr[quArr.length - 1].y) {
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
    if(parameter.gesture) {
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
      if(parameter.gesture.controlType == 1) {
        if(parameter.pathContent > 0) {
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
      for(var m = 1; m < quArr.length; m++) {
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
      if(parameter.gesture.cuePoints) {
        for(var i = 0; i < parameter.gesture.cuePoints.length; i++) {
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

      var startEvent = function(e) {
        historyPoint = {
          x: (hasTouch ? e.changedTouches[0].pageX : e.clientX),
          y: (hasTouch ? e.changedTouches[0].pageY : e.clientY)
        };
      }

      var moveEnd = function() {
        historyPoint = null;
        //松手后行为(辅助对象ID)
        if(parameter.gesture.afterTouch > 0)
          Xut.Assist.Run(parameter.pageType, parameter.gesture.afterTouch, null);
      }

      var moveEvent = function(e) {
        var i
        var currentPoint = {
          x: (hasTouch ? e.changedTouches[0].pageX : e.clientX),
          y: (hasTouch ? e.changedTouches[0].pageY : e.clientY)
        }
        var d = calculateDistance(currentPoint, historyPoint); //鼠示移动距离
        var quadrant1 = 0; //对象移动方向
        for(i = 0; i < sprotInfo.length; i++) {
          if(currentFrame <= sprotInfo[i].end) {
            quadrant1 = sprotInfo[i].quadrant;
            break;
          }
        }
        var quadrant2 = calculateDirection(currentPoint, historyPoint); //鼠标移动方向
        switch(quadrant1) {
          case "1":
          case "2":
            if(quadrant2 == "1" || quadrant2 == "2")
              currentFrame = currentFrame + d;
            else if(quadrant2 == "3" || quadrant2 == "4")
              currentFrame = currentFrame - d;
            else if(quadrant2 == "+x" || quadrant2 == "-x")
              currentFrame = currentFrame + (currentPoint.x - historyPoint.x);
            else if(quadrant1 == "1" && (quadrant2 == "+y" || quadrant2 == "-y"))
              currentFrame = currentFrame - (currentPoint.y - historyPoint.y);
            else if(quadrant1 == "2" && (quadrant2 == "+y" || quadrant2 == "-y"))
              currentFrame = currentFrame + (currentPoint.y - historyPoint.y);
            break;
          case "3":
          case "4":
            if(quadrant2 == "3" || quadrant2 == "4")
              currentFrame = currentFrame + d;
            else if(quadrant2 == "1" || quadrant2 == "2")
              currentFrame = currentFrame - d;
            else if(quadrant2 == "+x" || quadrant2 == "-x")
              currentFrame = currentFrame - (currentPoint.x - historyPoint.x);
            else if(quadrant1 == "3" && (quadrant2 == "+y" || quadrant2 == "-y"))
              currentFrame = currentFrame + (currentPoint.y - historyPoint.y);
            else if(quadrant1 == "4" && (quadrant2 == "+y" || quadrant2 == "-y"))
              currentFrame = currentFrame - (currentPoint.y - historyPoint.y);
            break;
          case "+x":
            if(quadrant2 == "1" || quadrant2 == "2")
              currentFrame = currentFrame + d;
            else if(quadrant2 == "3" || quadrant2 == "4")
              currentFrame = currentFrame - d;
            else if(quadrant2 == "+x" || quadrant2 == "-x")
              currentFrame = currentFrame + (currentPoint.x - historyPoint.x);
            break;
          case "-x":
            if(quadrant2 == "1" || quadrant2 == "2")
              currentFrame = currentFrame - d;
            else if(quadrant2 == "3" || quadrant2 == "4")
              currentFrame = currentFrame + d;
            else if(quadrant2 == "+x" || quadrant2 == "-x")
              currentFrame = currentFrame - (currentPoint.x - historyPoint.x);
            break;
          case "+y":
            if(quadrant2 == "1" || quadrant2 == "4")
              currentFrame = currentFrame - d;
            else if(quadrant2 == "2" || quadrant2 == "3")
              currentFrame = currentFrame + d;
            else if(quadrant2 == "+y" || quadrant2 == "-y")
              currentFrame = currentFrame + (currentPoint.y - historyPoint.y);
            break;
          case "-y":
            if(quadrant2 == "1" || quadrant2 == "4")
              currentFrame = currentFrame + d;
            else if(quadrant2 == "2" || quadrant2 == "3")
              currentFrame = currentFrame - d;
            else if(quadrant2 == "+y" || quadrant2 == "-y")
              currentFrame = currentFrame - (currentPoint.y - historyPoint.y);
            break;
        }
        if(currentFrame <= 0) currentFrame = 0;
        if(currentFrame >= duration) currentFrame = duration;
        t1.seek(currentFrame);
        updateTurnState();
        historyPoint = currentPoint;
        //处理触发点列表
        for(i = 0; i < cuePoints.length; i++) {
          if(cuePoints[i].mouseEnter == false && currentFrame >= cuePoints[i].cueStart && currentFrame <= cuePoints[i].cueEnd) {
            cuePoints[i].mouseEnter = true;
            cuePoints[i].mouseLeave = false;
            if(cuePoints[i].valueStart > 0) Xut.Assist.Run(parameter.pageType, cuePoints[i].valueStart, null);
            break;
          } else if(cuePoints[i].mouseEnter == true && cuePoints[i].mouseLeave == false && (currentFrame < cuePoints[i].cueStart || currentFrame > cuePoints[i].cueEnd)) {
            cuePoints[i].mouseEnter = false;
            cuePoints[i].mouseLeave = true;
            if(cuePoints[i].valueEnd > 0) Xut.Assist.Run(parameter.pageType, cuePoints[i].valueEnd, null);
            break;
          }
        }
      }

      var objectId = object[0].id;
      if(parameter.gesture.controlType == 1) {
        objectId = controlId
      }

      new MoveMent(parameter.pageType, controlId, objectId, startEvent, moveEvent, moveEnd);
    }
    //贝赛尔曲线参数构造
    var bezierObj = {
      type: "soft",
      values: quArr,
      autoRotate: autoRotate
    };
    if(isCurve == true) {
      bezierObj = {
        curviness: 0, //curviness圆滑度(数字越大越圆滑),默认为1,0是直线运动
        values: quArr,
        autoRotate: autoRotate
      }
    }
    //实例化动画参数
    if(degree == 0) {
      t1.to(object, duration, {
        scale: scaleFactor,
        bezier: bezierObj,
        repeat: subRepeat,
        yoyo: autoReverse,
        onUpdate: updateTurnState,
        ease: parameter.tweenEase
      });
    } else {
      switch(axis) {
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
    if(parameter.gesture && parameter.gesture.initPos > 0) {
      currentFrame = duration * parameter.gesture.initPos;
      t1.seek(currentFrame);
    }

    return t1;

    function updateTurnState() {
      /*var sel=object[0]
      sel.style.display = 'none';
      sel.offsetHeight;
      sel.style.display = 'block';*/
      if(autoTurn == false) return;
      var oldOffset = currentOffset;
      currentOffset = object.offset();
      if(turnState == "") {
        if(currentOffset.left > oldOffset.left) {
          turnState = "left";
        } else if(currentOffset.left < oldOffset.left) {
          turnState = "right";
        }
      } else {
        if(currentOffset.left > oldOffset.left) {
          if(turnState == "right") {
            if(currentDegree == 0) currentDegree = 180;
            else currentDegree = 0;
            TweenLite.set(object.children(), {
              rotationY: currentDegree
            });
            turnState = "left";
          }
        } else if(currentOffset.left < oldOffset.left) {
          if(turnState == "left") {
            if(currentDegree == 0) currentDegree = 180;
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
