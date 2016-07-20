/**
 * 普通精灵动画
 * dom版本
 * css3模式
 */
import { parseJSON } from '../../../../util/index'

const prefix = Xut.plat.prefixStyle
const KEYFRAMES = Xut.plat.KEYFRAMES
const ANIMATION_END = Xut.plat.ANIMATION_END
const playState = prefix('animation-play-state')
const prefixAnims = prefix('animation')

let styleElement = null

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
        styleElement = document.createElement("style");
        styleElement.type = 'text/css';
        styleElement.innerHTML = rule;
        styleElement.uuid = 'aaron';
        document.head.appendChild(styleElement);
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
            document.head.removeChild(styleElement);
            styleElement = null;
        }
    }
}



/**
 * css3模式
 * 单图
 * 矩形图
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
export default function css3(options) {

    var $element, data, callback, aniName, count, fps, time, width, loop, matrix, parameter, rule1, rule2

    $element = options.element.find('.sprite')
    data = options.data
    callback = options.callback || function() {}
    aniName = 'sprite_' + options.id
    count = data.thecount
    fps = data.fps
    time = Math.round(1 / fps * count * 10) / 10
    width = Math.ceil(data.scaleWidth * count)
    loop = data.loop ? 'infinite' : 1


    //如果是矩形图
    if (data.parameter) {
        parameter = parseJSON(data.parameter);
        if (parameter && parameter.matrix) {
            matrix = parameter.matrix.split("-")
        }
    }


    /**
     * 设置精灵动画位置
     * @param {[type]} aniName [description]
     * @param {[type]} x       [description]
     */
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


    /**
     * 格式化样式表达式
     * 2016.7.15 add paused control
     * @param {[type]}   [description]
     */
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

    /**
     * 设置动画样式
     * @param {[type]} $element [description]
     * @param {[type]} rule     [description]
     */
    function initStyle($element, rule) {
        prefixAnims && $element.css(prefixAnims, rule).css(playState, 'paused');
    }


    /**
     * 添加到样式规则中
     * @param {[type]} rule [description]
     */
    function setKeyframes(rule) {
        if (KEYFRAMES) {
            insertCSSRule(KEYFRAMES + rule);
        }
    }


    //动画css关键帧规则
    var rule1 = setStep(aniName, time, count, loop);
    var rule2 = setPostion(aniName, width);


    initStyle($element, rule1);
    setKeyframes(rule2);
    $element.on(ANIMATION_END, callback);

    return {

        play: function() {
            $element.css(playState, 'running');
        },

        stop: function() {
            $element.css(playState, 'paused');
        },

        destroy: function() {
            //停止精灵动画
            deleteCSSRule(aniName);
            $element.off(ANIMATION_END, callback);
            $element = null;
        }


    }
}
