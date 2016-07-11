/**
 * 普通精灵动画
 * dom版本
 */

import {
    parseJSON
}
from '../../../util/index'

let DOC = document
let prefix = Xut.plat.prefixStyle
let KEYFRAMES = Xut.plat.KEYFRAMES
let ANIMATION_EV = Xut.plat.ANIMATION_EV
//全局样式style
let styleElement = null
let playState = prefix('animation-play-state')
//动画前缀
let prefixAnims = prefix('animation')

//css3模式-单图
function css3Animate(options) {
    var $element = options.element,
        data = options.data,
        callback = options.callback || function () { },
        aniName = 'sprite_' + options.id,
        count = data.thecount,
        fps = data.fps,
        time = Math.round(1 / fps * count * 10) / 10,
        width = Math.ceil(data.scaleWidth * count),
        loop = data.loop ? 'infinite' : 1;

    //如果是矩形图
    var matrix;
    if (data.parameter) {
        var parameter = parseJSON(data.parameter);
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
    function insertCSSRule(rule) {
        var number, sheet, cssRules;
        //如果有全局的style样式文件
        if (styleElement) {
            number = 0
            try {
                sheet = styleElement.sheet;
                cssRules = sheet.cssRules;
                number = cssRules.length;
                sheet.insertRule(rule, number);
            } catch (e) {
                console.log(e);
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
                cssRules = sheet.rules || sheet.cssRules, //取得规则列表
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
        var rule
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
            var frames = [];
            var base = 100 / count;
            var col = Number(matrix[0]); //列数
            //首次
            frames.push(0 + '% { background-position:0% 0%}')
            for (var i = 0; i < count; i++) {
                // var currRow = Math.ceil((i + 1) / col); //当前行数
                var currCol = Math.floor(i / col); //当前列数  
                var period = currCol * col; //每段数量  
                x = 100 * (i - period)
                var y = 100 * currCol;
                x = x == 0 ? x : "-" + x;
                y = y == 0 ? y : "-" + y;
                frames.push(((i + 1) * base) + '% { background-position: ' + x + '% ' + y + '%}')
            }
            return aniName + '{' + frames.join("") + '}';
        } else {
            var rule = '{0} {from { background-position:0 0; } to { background-position: -{1}px 0px}}';
            return String.format(rule, aniName, Math.round(x));
        }
    }


    //设置动画样式
    function setAnimition($element, rule) {
        prefixAnims && $element.css(prefixAnims, rule);
    }

    //添加到样式规则中
    function setKeyframes(rule) {
        if (KEYFRAMES) {
            insertCSSRule(KEYFRAMES + rule);
        }
    }


    //动画css关键帧规则
    var rule1 = setStep(aniName, time, count, loop);
    var rule2 = setPostion(aniName, width);

    setAnimition($element, rule1);
    setKeyframes(rule2);
    $element.on(ANIMATION_EV, callback);

    return {

        runSprites: function () {
            //运行动画
            $element.show().css(playState, '');
        },

        stopSprites: function () {
            //停止精灵动画
            deleteCSSRule(aniName);
            $element.off(ANIMATION_EV, callback);
            $element = null;
        },

        pauseSprites: function () {
            //暂停精灵动画
            $element.css(playState, 'paused');
        },

        playSprites: function () {
            //恢复精灵动画
            $element.css(playState, '');
        }

    }
}

//帧模式-多图
function keyframes(options) {
    var $element = options.element,
        status = '',
        data = options.data,
        src = data.md5,
        count = data.thecount || 0,
        loop = data.loop,
        fps = data.fps || 1,
        root = Xut.config.pathAddress,
        info = parsePath(src),
        url = root + info.name,
        ext = info.ext,
        num = info.num || 0,
        timer = 0,
        image = DOC.createElement('img');

    image.src = root + src;
    $element.append(image);

    function runSprites() {
        timer = setTimeout(function () {
            image.src = url + num + ext;
            num++;
            check();
        }, 1000 / fps);
    }

    function check() {
        if (status === 'paused') {
            return;
        }
        if (num > count) {
            if (loop) {
                num %= count;
                runSprites();
            } else {
                timer = null;
            }
        } else {
            runSprites();
        }
    }

    //分解路径,得到扩展名和文件名
    function parsePath(path) {
        var tmp, ext, name, num

        tmp = path.split('.')
        ext = '.' + tmp[1]
        tmp = tmp[0].split('-')
        name = tmp[0] + '-'
        num = tmp[1] - 0
        return {
            name: name,
            ext: ext,
            num: num
        };
    }

    runSprites();

    return {

        runSprites: function () {
            status = 'play';
            runSprites();
        },

        stopSprites: function () {
            //停止精灵动画
            clearTimeout(timer);
            status = 'paused';
            num = 0;
            $element = null;
            image = null;
        },

        pauseSprites: function () {
            //暂停精灵动画
            status = 'paused';
        },

        playSprites: function () {
            //恢复精灵动画
            status = 'play';
            check();
        }

    }
}

/**
 * css3动画
 * 1 帧动画
 * 2 定时器动画
 * 3 canvas动画
 * @param {[type]} options [description]
 */
export function ComSpirit(options) {
    var mode = options.mode || 'css';
    switch (mode) {
        case 'css':
            return css3Animate(options);
        case 'timer':
            return keyframes(options);
    }
}
