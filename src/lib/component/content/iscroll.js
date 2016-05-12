 // *  iscroll 控制
 // *    传入dom ID
 // *     [onIscroll description]
 // * @param  {[type]} contentWrapperDomId [description]
 // * @return {[type]}                     [description]

 export function Iscroll(element) {
     //是否移动，中途停止了动画
     var distX = 0,
         distY = 0,
         startX,
         startY,
         absDistY,
         absDistX,
         iscroll,
         that = this,
         screenWidth = Xut.config.screenSize.width,
         useswipeleft = function() {
             Xut.View.GotoPrevSlide()
         },
         useswiperight = function() {
             Xut.View.GotoNextSlide()
         };

     return new iScroll(element, {
         scrollbars: true,
         fadeScrollbars: true
             //click          : true,
             //tap            : true,
             //probeType      : 2
     });


     // this.iscroll.on('scrollStart', function() {
     //     iscroll.initDirection = false; //初始化一次滑动方向
     // });
     // this.iscroll.on('scrollEnd', function(e) {
     //     //如果是Y轴滑动者不作处理跳过
     //     if (iscroll.initDirection) {
     //          startY= startX=distX = distY = 0;
     //         iscroll.startTime = 0;
     //         iscroll.initDirection = false;
     //         return;
     //     }

     //     var duration, deltaX, validSlide, distance;
     //     //滑动的距离、

     //     deltaX = distX || 0;
     //     duration = +new Date - iscroll.startTime;
     //     distance = Math.abs(deltaX);
     //     //反弹的边界值
     //     validSlide = Math.ceil(screenWidth / 5);
     //     if (distance < validSlide) {
     //         //快速滑动允许翻页
     //         if (duration < 200 && distance > 20) {
     //             iscroll.swipe = true;
     //             deltaX > 0 ? useswipeleft() : useswiperight();
     //         } else {
     //             //反弹
     //             Xut.View.MovePage(0, 300, deltaX > 0 ? 'prev' : 'next', 'flipRebound')
     //         }
     //     } else {
     //         iscroll.swipe = true;
     //         deltaX > 0 ? useswipeleft() : useswiperight();
     //     }
     //    startY= startX=distX = distY = 0;
     //     iscroll.startTime = 0;
     //     iscroll.initDirection = false;
     // });
     // this.iscroll.on('scroll', function(e) {
     //     startX=startX||e.pageX;
     //     startY=startY||e.pageY;

     //     distX =e.pageX-startX;
     //     distY = e.pageY-startY;

     //     absDistX = Math.abs(distX);
     //     absDistY = Math.abs(distY);


     //     iscroll.startTime = iscroll.startTime || e.timeStamp;
     //     if (absDistY * 1.5 > absDistX) {
     //           //如果是Y轴滑动则做标记不作处理
     //         iscroll.initDirection = true;
     //     } else {
     //         Xut.View.MovePage(distX, 0, distX > 0 ? 'prev' : 'next', 'flipMove');
     //         iscroll.initDirection = false
     //     }
     // });

 }
