/**
 *   动画效果
 *   @param {Objecj}
    *   @param {Objecj}
    */
/**
 * @descript 简单动画效果 , ｛飞入飞出 , 淡入淡出｝
 */
;
(function ($) {

    $.fn.ImageSlide = function (opts, handler) {
        var args = {
            animationName:'',
            speed:'0.5s',
            dealy:'0s',
            to:250,
            form:'',
            ease:'ease',
            type:'fly',
            action:'in',
            direction:'horizontal', //verticality
            x:0,
            y:0,
            opacity:1
        };

        var args = $.extend(args, opts);

        var that = this;

        var endHalder = function () {
            that.isRun = -1;
        };

        if ($.isFunction(handler)) {
            endHalder = function (e) {
                e.stopPropagation();
                var a = (args.action == 'in' ? 'out' : 'in');
                handler(a, args.type);
                that.isRun = -1;
                that.unbind('webkitTransitionEnd');
            };
        }

        that.bind('webkitTransitionEnd', endHalder);
        //-----------------------------------------------------------------------------------------------------------

        //新图片将从开始点和透明度飞入
        /**
         * 飞入飞出所需参数
         * {x ,y , type} //必要必数
         * {speed , dealy , ease ,action ,direction} //可选参数
         */
        var Fly = function (type) {
            var width , height , opacity , left , top , x , y;
            x = 0;
            y = 0;
            
            if(args.d3){
                x = args.x;
                y = args.y;
            }else{
                $(that).css("position", "absolute");
                width = parseInt(that.css('width'));
                height = parseInt(that.css('height'));
                top = parseInt(that.css('top'));
                left = parseInt(that.css('left'));
                if (args.direction === 'verticality') {
                    if (top < 0) {
                        y = Math.abs(top) + args.y;
                    } else {
                        y = -(Math.abs(top) - args.y)
                    }
                } else {
                    if (left < 0) {
                        x = Math.abs(left) + args.x;
                    } else {
                        x = -(Math.abs(left) - args.x);
                    }
                }
            }

            if (type) {
                $(that).css({
                    '-webkit-transition':'all ' + (args.speed || '1s' ) + ' ' + (args.dealy || '0s' ) + ' ' + (args.ease || 'ease' ) + ' ',
                    '-webkit-transform':'translate3d(' + ( x || 0 ) + 'px ,' + ( y || 0 ) + 'px , 0px)',
                    'opacity':1
                });
            } else {

                if (args.d3) {
                    $(that).css({
                        '-webkit-transition': 'all ' + (args.speed || '1s') + ' ' + (args.dealy || '0s') + ' ' + (args.ease || 'ease') + ' ',
                        '-webkit-transform': 'translate3d(' + (x || 0) + 'px ,' + (y || 0) + 'px , 0px)',
                        'opacity': args.opacity
                    });
                } else {
                    $(that).css({
                        '-webkit-transition': 'all ' + (args.speed || '1s') + ' ' + (args.dealy || '0s') + ' ' + (args.ease || 'ease') + ' ',
                        '-webkit-transform': 'translate3d(0px ,0px, 0px)',
                        'opacity': args.opacity
                    });
                }
            }

        };

        //淡入淡出效果
        /**
         * 淡入淡出所需参数
         * {speed ,dealy ,ease}        //可选
         */
        var Fade = function (type) {
            if (type) {
                $(that).css({
                    '-webkit-transition':'opacity' + (args.speed || '1s' ) + ' ' + (args.dealy || '0s' ) + ' ' + (args.ease || 'ease' ) + ' ',
                    'opacity':1
                }).show();
            } else {
                $(that).css({
                    '-webkit-transition':'opacity' + (args.speed || '1s' ) + ' ' + (args.dealy || '0s' ) + ' ' + (args.ease || 'ease' ) + ' ',
                    'opacity':0
                });
            }
        };

        //擦除效果
        /**
         * 擦除所需参数
         * {speed ,dealy ,ease}    //可选
         */
        var Wipe = function (type) {
            var width , height , opacity , left , top , x , y;
            $(that).css("position", "absolute");

            width = parseInt(that.css('width'));
            height = parseInt(that.css('height'));
            top = parseInt(that.css('top'));
            left = parseInt(that.css('left'));
            if (type) {
                $(that).css({
                    '-webkit-transition':'all ' + (args.speed || '1s' ) + ' ' + (args.dealy || '0s' ) + ' ' + (args.ease || 'ease' ) + ' ',
                    'clip':'rect(0px ' + (left + width) + 'px ' + (top + height) + 'px 0px)',
                    'opacity':1
                });
            } else {
                $(that).css({
                    '-webkit-transition':'all ' + (args.speed || '1s' ) + ' ' + (args.dealy || '0s' ) + ' ' + (args.ease || 'ease' ) + ' ',
                    'clip':'rect(0px ' + (left + width) + 'px 0px 0px)',
                    'opacity':1
                });
            }
        };

        //缩放效果
        /**
         * 缩放所需参数
         * {speed ,dealy ,ease , width ,height , src ,close}    //可选
         */
        var Zoom = function (options) {
            var options = options || {speed : '0.7s'},
                zooming = false,
                zoomEl = null,
                zoomContentEl = null,
                contentEl = null,
                curTop = null ,
                curLeft = null,
                that = this ,
                width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
                height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight);
            isShow = false;
            if ($('#zoom').length == 0) {
                var html = '<div id="zoom" style="display:none;"><div id="zoom_content"></div></div>';
                $('#chapterPage').append(html);
            }

            zoomEl = $('#zoom');
            zoomContentEl = $('#zoom_content');

            zoomEl.bind('webkitTransitionEnd', function () {
                if(!isShow){
                    //that.show();
                    zoomEl.hide();
                    //zoomEl.unbind('click');
                }
                zoomEl.css({
                    '-webkit-transition':'none'
                });
                zooming = false;
            });

            this.each(function (i) {
                $(this).click(show);
            });
            return this;

            function show(e) {
                var zWidth,
                    zHeight,
                    width,
                    height,
                    x,
                    y,
                    rect,
                    newTop,
                    newLeft;
                if (zooming)
                    return false;


                zooming = true;
                isShow = true;
                zWidth = options.width || window.innerWidth - 10;
                zHeight = options.height || window.innerHeight - 10;

                x = window.pageXOffset || (window.document.documentElement.scrollLeft || window.document.body.scrollLeft);
                y = window.pageYOffset || (window.document.documentElement.scrollTop || window.document.body.scrollTop);
                rect = {
                    'width':width,
                    'height':height,
                    'x':x,
                    'y':y
                };


                contentEl = $('<img/>').attr("src", options.src).css({width:'100%', height:'100%'});
                width = (zWidth || contentEl.width()) + 2;
                height = (zHeight || contentEl.height()) + 2;

                var zoomX = that.width() / width ;
                var zoomY = that.height() / height ;

                newTop = Math.max((rect.height / 2) - (height / 2) + y, 0);
                newLeft = (rect.width / 2) - (width / 2);
                curTop = e.pageY;
                curLeft = e.pageX;
                zoomEl.css({position:'absolute',left : '0px' , top : '0px' ,width : width + 'px',height : height +'px'})
                zoomEl.hide().css({
                    '-webkit-transition':'none',
                    '-webkit-transform': 'translate3d('+curLeft+'px , '+curTop+'px ,0px) scale3d('+(zoomX + 0.1)+', '+(zoomY + 0.1)+', 1)'
                }).show();

                if (options.close) {
                    zoomEl.click(hide);
                }

                zoomContentEl.html(contentEl);

                $(zoomEl).css({
                    '-webkit-transition':'all ' + (args.speed || '1s' ) + ' ' + (args.dealy || '0s' ) + ' ' + (args.ease || 'cubic-bezier(0,1.07,.86,1.12)' ) + ' ',
                    '-webkit-perspective':'1000',
                    '-webkit-backface-visibility': 'hidden',
                    '-webkit-transform-origin': '0% 0%',
                    ' -webkit-transform': 'translate3d(0px ,0px ,0px) scale3d(1, 1, 1)',
                    opacity : 1
                });
                //that.hide();
                return true;
            };

            function hide() {
                if (zooming)
                    return false;
                zooming = true;
                isShow = false;


                var zoomX = that.width() / width ;
                var zoomY = that.height() / height ;
                zoomEl.css({
                    '-webkit-transition':'all ' + (args.speed || '1s' ) + ' ' + (args.dealy || '0s' ) + ' ' + (args.ease || 'cubic-bezier(0,1.07,.86,1.12)' ) + ' ',
                    ' -webkit-transform': 'translate3d('+that.offset().left+'px , '+that.offset().top+'px ,0px) scale3d('+(zoomX )+', '+(zoomY)+', 1)',
                    opacity : 0
                });

                return false;
            }

        };

        function isAnimating() {
            if (that.isRun !== undefined || that.isRun > 0) {
                return true;
            } else {
                return false;
            }
        };

        return this.each(function () {
            that = $(this);
            if (!isAnimating()) {
                that.isRun = new Date().getTime();
                switch (args.type) {
                    case 'fly' :
                        Fly(args.action == 'in');
                        break;
                    case 'fade' :
                        Fade(args.action == 'in');
                        break;
                    case 'wipe' :
                        Wipe(args.action == 'in');
                        break;
                    case 'zoom' :
                        Zoom.call(that, args);
                        ;
                        break;
                }

            }
        });
    };
})(Zepto);