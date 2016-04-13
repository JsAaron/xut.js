/*********************************************************************
 *                 精灵动画
 *             实现目标：
 *                1.由css3的animate帧动画实现
 *                2.由切换img的src实现
 *
 *    Sprite(options);
 *                                                         *
 **********************************************************************/
define('Sprite', [
  'Config',
  'Utils'
], function(Config,Utils) {

    var DOC   = document,
        prefix       = Xut.plat.prefixStyle,
        keyframes    = Xut.plat.KEYFRAMES,
        ANIMATION_EV = Xut.plat.ANIMATION_EV,
        //全局样式style
        styleElement = null,
        playState    = prefix('animation-play-state'),
        //动画前缀
        prefixAnims  = prefix('animation');

    /**
     * css3动画
     * 1 帧动画
     * 2 定时器动画
     * 3 canvas动画
     * @param {[type]} options [description]
     */
    function Sprite(options){
        var mode = options.mode || 'css';
        switch (mode) {
          case 'css':
            return css3Animate(options);
          case 'timer':
            return keyframes(options);
          case 'canvas':
            return spriteAnimate(options);
          default:
            return pixiAnimate(options);
        }
    }

    //css3模式-单图
    function css3Animate(options){
        var $element = options.element,
            data     = options.data,
            callback = options.callback || function(){},
            aniName  = 'sprite_' + options.id,
            count    = data.thecount,
            fps      = data.fps,
            time     = Math.round(1 / fps * count*10)/10,
            width    = Math.ceil(data.scaleWidth * count),
            loop     = data.loop ? 'infinite' : 1;

        //如果是矩形图
        var matrix;
        if (data.parameter) {
            var parameter = Utils.parseJSON(data.parameter);
            //矩阵
            if (parameter && parameter.matrix) {
                matrix = parameter.matrix.split("-")
            }
        }

        /**
         * [ description]动态插入一条样式规则
         * @param  {[type]} rule [样式规则]
         * @return {[type]}      [description]
         */
        function insertCSSRule (rule) {
            var number,sheet,cssRules;
            //如果有全局的style样式文件
            if (styleElement) {
                number = 0
                try {
                    sheet = styleElement.sheet;
                    cssRules = sheet.cssRules;
                    number = cssRules.length;
                    sheet.insertRule(rule, number);
                } catch (e) {
                    console.log(e.message + rule);
                }
            } else {
                //创建样式文件
                styleElement = DOC.createElement("style");
                styleElement.type = 'text/css';
                styleElement.innerHTML = rule;
                styleElement.uuid = 'aaron';
                DOC.head.appendChild(styleElement);
            }
        }


        /**
         * [ description]删除一条样式规则
         * @param  {[type]} ruleName [样式名]
         * @return {[type]}          [description]
         */
        function deleteCSSRule(ruleName) {
            if (styleElement) {
              var sheet = styleElement.sheet,
                cssRules = sheet.rules || sheet.cssRules,//取得规则列表
                i = 0,
                n = cssRules.length,
                rule;
              for (i; i < n; i++) {
                  rule = cssRules[i];
                  if (rule.name === ruleName) {
                    //删除单个规则
                    sheet.deleteRule(i);
                    break;
                  }
              }
              //删除style样式
              if (cssRules.length == 0) {
                DOC.head.removeChild(styleElement);
                styleElement = null;
              }
            }
        }

        //格式化样式表达式
        function setStep(aniName, time, count, loop) {
          if (matrix) {
            rule = '{0} {1}s step-start {2}';
            return String.format(rule, aniName, time, loop);
          } else {
            rule = '{0} {1}s steps({2}, end) {3}';
            return String.format(rule, aniName, time, count, loop);
          }
        }
        
        //设置精灵动画位置
        function setPostion(aniName, x) {
            //矩阵生成step的处理
            //  0 1 2
            //  3 4 5
            //  6 7 8
            if (matrix) {
                var keyframes = [];
                var base = 100 / count;
                var col = Number(matrix[0]); //列数
                //首次
                keyframes.push(0 + '% { background-position:0% 0%}')
                for (var i = 0; i < count; i++) {
                    var currRow = Math.ceil((i + 1) / col); //当前行数
                    var currCol = Math.floor(i / col); //当前列数  
                    var period = currCol * col; //每段数量  
                    var x = 100 * (i - period)
                    var y = 100 * currCol;

                    x = x == 0 ? x : "-" + x;
                    y = y == 0 ? y : "-" + y;
                    keyframes.push(((i + 1) * base) + '% { background-position: ' + x + '% ' + y + '%}')
                }
                return aniName + '{' + keyframes.join("") + '}';
            } else {
                rule = '{0} {from { background-position:0 0; } to { background-position: -{1}px 0px}}';
                return String.format(rule, aniName, Math.round(x));
            }
        }


        //设置动画样式
        function setAnimition($element, rule) {
          prefixAnims && $element.css(prefixAnims, rule);
        }

        //添加到样式规则中
        function setKeyframes(rule){
          if(keyframes){
            insertCSSRule(keyframes+rule);
          }
        }


        //动画css关键帧规则
        var rule1 = setStep(aniName, time, count, loop);
        var rule2 = setPostion(aniName, width);

        setAnimition($element,rule1);
        setKeyframes(rule2);
        $element.on(ANIMATION_EV,callback);

        return {

          runSprites : function() {
            //运行动画
            $element.show().css(playState,'');
          },

          stopSprites : function() {
            //停止精灵动画
            deleteCSSRule(aniName);
            $element.off(ANIMATION_EV,callback);
            $element = null;
          },

          pauseSprites : function() {
            //暂停精灵动画
            $element.css(playState,'paused');
          },

          playSprites : function() {
            //恢复精灵动画
            $element.css(playState,'');
          }

        }
    }

    //帧模式-多图
    function keyframes(options){
        var $element = options.element,
            status = '',
            data  = options.data,
            src   = data.md5,
            count = data.thecount||0,
            loop  = data.loop,
            fps   = data.fps||1,
            root  = Config.pathAddress,
            info  = parsePath(src),
            url   = root + info.name,
            ext   = info.ext,
            num   = info.num||0,
            timer = 0,
            image = DOC.createElement('img');

        image.src = root + src;
        $element.append(image);

        function runSprites(){
          timer = setTimeout(function(){
            image.src = url + num + ext;
            num++;
            check();
          },1000/fps);
        }

        function check(){
          if(status === 'paused'){
              return;
          }
          if(num > count){
              if(loop){
                num %= count;
                runSprites();
              }else{
                timer = null;
                callback();
              }
            }else{
              runSprites();
            }
        }

        //分解路径,得到扩展名和文件名
        function parsePath(path){
          var tmp = path.split('.'),
              ext = '.'+tmp[1],
              tmp = tmp[0].split('-'),
              name = tmp[0]+'-',
              num = tmp[1]-0;
          return {name:name,ext:ext,num:num};
        }

        runSprites();

        return {

          runSprites : function(){
            status = 'play';
            runSprites();
          },

          stopSprites : function() {
            //停止精灵动画
            clearTimeout(timer);
            status = 'paused';
            num = 0;
            $element = null;
            image = null;
          },

          pauseSprites : function() {
            //暂停精灵动画
            status = 'paused';
          },

          playSprites : function() {
            //恢复精灵动画
            status = 'play';
            check();
          }

        }
    }

    //用pixi库实现的精灵动画
    function pixiAnimate(options){
      var $element = options.element.parent(),
          data     = options.data,
          callback = options.callback || function(){},
          count    = data.thecount,
          fps      =  data.fps,
          width    = Math.ceil(data.scaleWidth),
          height   = Math.ceil(data.scaleHeight),
          loop     =  data.loop ? true : false;

      var scalex = Config.proportion.width;
      var scaley = Config.proportion.height;
      var path   = Config.pathAddress+data.md5;
      var i          =0;
      var x          = 0;
      var data       = [];
      var stage      = new PIXI.Stage(0xFFFFFF);
      var renderer   = PIXI.autoDetectRenderer(width, height,null,true);
      
      $element.empty().append(renderer.view);
      var sprite     = new PIXI.Sprite.fromImage(path);
      sprite.scale.x = scalex;
      sprite.scale.y = scaley;

      for(var i = 0; i < count; i++){
            data.push(i*width);
      }

      stage.addChild(sprite);

      requestAnimFrame(animate);

      function animate(){
         //控制刷新频率
         if( i % 15 == 0){
            sprite.position.x = -data[x];
            renderer.render(stage);
            x++;
            if(x > data.length -1){
                  x = 0;
                  i = 0;
            }
         }

         i++;
         requestAnimFrame(animate);
      }
    }

    function spriteAnimate(options){
      var sprite = options.element,
      data = options.data,
 
      count = data.thecount,
 
      width = Math.ceil(data.scaleWidth),
      height = Math.ceil(data.scaleHeight),
      loop =  data.loop ? true : false;

      var i=0;
      var x = 0;
      var data = [];

      for(var i = 0; i < count; i++){
            data.push(i*width);
      }

      requestAnimFrame(animate);

      function animate(){
         //控制刷新频率
         if( i % 15 == 0){
            sprite.position.x = -data[x];
           
            x++;
            if(x > data.length -1){
                  x = 0;
                  i = 0;
            }
         }

         i++;
        //requestAnimFrame(animate);
      }
    }

    return Sprite;
});