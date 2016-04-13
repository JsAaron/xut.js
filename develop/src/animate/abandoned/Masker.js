/*
    简易版Masker,针对当前的项目简易实现
*/
(function(global){
    //基础配置
    var slice = Array.prototype.slice;

    //基础工具函数
    function isFunction() {
        return Object.prototype.toString.call(arguments[0]) === '[object Function]';
    }

    function css() {
        if (typeof arguments[1] === 'string') {
            return window.getComputedStyle(arguments[0],'')[arguments[1]];
        }
        
        for (var i in arguments[1]) {
            arguments[0].style[i] = arguments[1][i];
        }
    }
    
    function mix() {
        var arg, prop, temp = {};
        for (arg = 0; arg < arguments.length; arg++) {
            for (prop in arguments[arg]) {
                if (arguments[arg].hasOwnProperty(prop)) {
                    temp[prop] = arguments[arg][prop];
                }
            }
        }
        return temp;
    }

    var anim = null;

    //特效集
    var effectSet = {
        Shrink : function() {   
            anim = function(arg){
                arg = (arg === undefined) ? 0.5 : arg;

                css(this.currentNode, { '-webkit-transform' : 'scale(' + arg + ')' });
            }.bind(this);
        },

        Rotate : function() {
            anim = function(arg){
                arg = this.alwaysRun ? 360 : ((arg === undefined) ? 145 : arg);

                css(this.currentNode, { '-webkit-transform' : 'rotate(' + arg + 'deg)' });
            }.bind(this);
        },

        Translate : function() {
            anim = function(arg){
                var trans = '',
                    dir = '';

                switch (this.direction) {
                    case 'left' :
                        dir = '-'; 
                    case 'right' : 
                        arg = (arg === undefined) ? this.rootWidth : arg;
                        trans = 'translate3d(' + dir + arg/2 + 'px ,0 , 0 )';
                        break;
                    case 'up' : 
                        dir = '-'
                    case 'down' : 
                        arg = (arg === undefined) ? this.rootHeight : arg;
                        trans = 'translate3d(0 , ' + dir + arg/2 + 'px , 0)';
                        break;
                }

                css(this.currentNode, { '-webkit-transform' : trans })
            }.bind(this);
        }
    };

    //Effecter模块
    var Masker =  function(config){
        if (!(this instanceof Masker)) {
            return new Masker(config);
        }

        this.init(config);
    };

    Masker.prototype = {
        effects : {},

        //初始化
        init : function(config) {
            this.rootNode    = document.getElementById(config.container);
            this.rootWidth   = parseInt(css(this.rootNode, 'width'));
            this.rootHeight  = parseInt(css(this.rootNode, 'height'));
           
            this.resetConfig = config;
            this.alwaysRun   = config.alwaysRun || false;
            this.autoPlay    = config.autoPlay || false; 
            this.duration    = config.duration || '2s'; 
            this.direction   = config.direction || 'left';
            this.effectArg   = config.effectArg || '';
            this.effectName  = config.effectName || 'rotate';
            this.targetImg   = config.targetImg || '';    
            this.maskerTimeout = null;
            
            //延迟注册需要实现的效果
            !isFunction(this.effects[this.effectName]) && this.register(this.effectName);
        },

        //重置
        reset : function() {
            this.timeoutFlag && clearTimeout(this.timeoutFlag);
            this.init(this.resetConfig);
            this.begin();
        },

        //开始动画
        begin : function() {
            this.rootNode.firstElementChild && this.rootNode.removeChild(this.rootNode.firstElementChild);
    
            this.currentNode = document.createElement('div');

            var l = '50%', 
                t = '50%';
            if (this.effectName === 'Translate') {
                switch (this.direction) {
                    case 'left' :
                        l = '0';
                        break;
                    case 'right' :
                        l = '100%';
                        break;
                    case 'up' :
                        t = '100%';
                        break;
                    case 'down' :
                        t = '100%';
                        break;
                }
            }
            css(this.currentNode, {
                'z-index':100,
                'width' : this.rootWidth * 2 + 'px',
                'height' : this.rootHeight * 2 + 'px',
                'position' : 'absolute',
                'left' : '50%',
                'top' : '50%',
                'margin-left' : '-' + this.rootWidth + 'px',
                'margin-top' : '-' + this.rootHeight + 'px',
                'background' : 'url(' + this.targetImg + ') no-repeat ' + l + ' ' + t,
                '-webkit-transition-timing-function' : 'linear',
                // '-webkit-backface-visibility' : 'hidden',
                '-webkit-transition-duration' : this.duration
            });
           
            this.rootNode.appendChild(this.currentNode);
            
            this.rootNode.addEventListener('webkitTransitionEnd', this.finish.bind(this), false);
            
            setTimeout(function(){
                this.autoPlay && this.run();
            }.bind(this),100)
        },

        //动画结束之后执行
        finish : function(event) {
            event.stopPropagation();
        },

        //运行特效
        run : function() {
            var effectFn = this.effects[this.effectName];

            if (!isFunction(effectFn)) {
                throw new Error('不存在此效果！');
            }

            effectFn.call(this);

            var runFn = function(){
                anim.call(this, this.effectArg);

                if (this.alwaysRun) {
                    this.maskerTimeout = setTimeout(function(){
                        runFn();
                    }, 0);
                } 
            }.bind(this);

            this.maskerTimeout = setTimeout(function(){
                runFn();
            }, 0);
        },

        //注册特效
        register : function(effect) {
            Masker.prototype.effects[effect] = effectSet[effect];
        },

        //解除特效
        unregister : function(effect) {
            Masker.prototype.effects[effect] = null;  
        }
    };

    global.Masker = Masker;
})(this);