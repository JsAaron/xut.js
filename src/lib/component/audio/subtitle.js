/**
 * 音频字幕
 * @param  {[type]} global [description]
 * @return {[type]}        [description]
 */
//字幕检测时间
var Interval = 50;

var getStyles = function(elem, name) {
    var styles = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
    return styles.getPropertyValue(name);
};

/**
 * 字幕类
 * audio  音频实例
 * options 参数
 */
function Subtitle(audio, options, controlDoms) {

    var visibility;
    this.audio = audio;
    this.options = options;
    this.parents = controlDoms.parents;
    this.ancestors = controlDoms.ancestors;

    this.timer = 0;
    //缓存创建的div节点
    this.cacheCreateDivs = {};

    //保存原始的属性
    var orgAncestorVisibility = this.orgAncestorVisibility = {};
    _.each(this.ancestors, function(node, cid) {
        visibility = getStyles(node, 'visibility');
        if (visibility) {
            orgAncestorVisibility[cid] = visibility;
        }
    })

    //去重记录
    this.recordRepart = {};
    //phonegap getCurrentPosition得到的音频播放位置不从0开始 记录起始位置
    this.changeValue = 0;

    //快速处理匹配数据
    var checkData = {};
    _.each(options.subtitles, function(data) {
        checkData[data.start + '-start'] = data;
        checkData[data.end + '-end'] = data;
    })
    this.createSubtitle(checkData);
}

Subtitle.prototype = {
    /**
     * 运行字幕
     * @return {[type]}
     */
    createSubtitle: function(checkData) {
        var self = this,
            audio = this.audio,
            options = this.options;

        //准备创建字幕
        function createAction(audioTime) {
            _.each(checkData, function(data, key) {
                var match = key.split('-');
                //创建动作
                self.action(match[0], audioTime, match[1], data);
            })
            self.createSubtitle(checkData);
        }

        function JudgePlat() {
            var audioTime;
            //phonegap
            if (audio.getCurrentPosition) {
                audio.getCurrentPosition(function(position) {
                        position = position * 1000;
                        if (!self.changeValue) {
                            self.changeValue = position
                        }
                        position -= self.changeValue;
                        if (position > -1) {
                            audioTime = Math.round(position);
                        }
                        createAction(audioTime)
                    },
                    function(e) {
                        console.log("error:" + e);
                        //出错继续检测
                        self.createSubtitle(checkData);
                    });
            } else if (audio.expansionCurrentPosition) {
                //扩充的对象
                audioTime = Math.round(audio.expansionCurrentPosition() * 1000);
                createAction(audioTime);
            } else {
                //html5
                audioTime = Math.round(audio.currentTime * 1000);
                createAction(audioTime);
            }
        }

        self.timer = setTimeout(function() {
            JudgePlat();
        }, Interval);
    },

    //执行动作
    //创建文本框
    //显示/隐藏
    action: function(currentTime, audioTime, action, data) {
        if (audioTime > currentTime - Interval && audioTime < currentTime + Interval) {
            //创建
            if (!this.recordRepart[data.start] && action === 'start') {
                this.recordRepart[data.start] = true;
                //创建字幕dom
                this.createDom(data);

                //如果是一段字幕结束处理
            } else if (!this.recordRepart[data.end] && action === 'end') {
                this.recordRepart[data.end] = true;
                // //隐藏
                var ancestorNode = this.ancestors[data.id];
                if (ancestorNode) {
                    ancestorNode.style.visibility = "hidden"
                }
            }
        }
    },

    createDom: function(data) {

        var config = Xut.config

        //屏幕分辨率
        var proportion = config.proportion;
        var proportionWidth = proportion.width;
        var proportionHeight = proportion.height;
        var screenWidth = config.screenSize.width;
        var screenHeight = config.screenSize.height;

        var cid = data.id;
        var parentNode = this.parents[cid];
        var ancestorNode = this.ancestors[cid];
        var preDiv = this.cacheCreateDivs[cid];
        var preP = preDiv && preDiv.children[0];

        //缩放
        var sTop = data.top * proportion.top;
        var sLeft = data.left * proportion.left;
        var sHeight = data.height * proportion.height;
        var sWidth = data.width * proportion.width;

        //转换行高
        var sLineHeight = data.lineHeight ? data.lineHeight : '100%';

        //公用同一个contengid,已经存在
        if (preDiv) {
            createContent(preDiv, preP, data);
        } else {
            //创建父元素与子元素
            var createDiv = document.createElement('div');
            var createP = document.createElement('p');
            //设置样式
            createContent(createDiv, createP, data);
            createDiv.appendChild(createP) //添加到指定的父元素  

            parentNode.appendChild(createDiv);

            //保存引用
            this.cacheCreateDivs[cid] = createDiv;
        }

        //创建内容
        function createContent(parent, p, data) {
            createDivStyle(parent, data) //设置div
            createPStyle(p, data)
        }

        //设置父容器div 字体颜色，大小，类型，位置，文本水平、垂直居中
        function createDivStyle(parent, data) {
            var cssText =
                'position       :absolute; ' +
                'display        :table;' +
                'vertical-align :center;' +
                'top            :{0}px;' +
                'left           :{1}px;' +
                'height         :{2}px;' +
                'width          :{3}px;'

            parent.style.cssText = String.format(cssText,
                sTop,
                sLeft,
                sHeight,
                sWidth
            )
        }

        //内容元素的样式
        function createPStyle(p, data) {

            var cssText =
                ' text-align     :center;' +
                ' display        :table-cell;' +
                ' vertical-align :middle;' +
                ' color          :{0};' +
                ' font-family    :{1};' +
                ' font-bold      :{2};' +
                ' font-size      :{3}px;' +
                ' line-height    :{4}%';

            //设置字体间距
            p.style.cssText = String.format(
                    cssText,
                    data.fontColor,
                    data.fontName,
                    data.fontBold,
                    data.fontSize * proportionWidth,
                    sLineHeight
                )
                //设置文字内容
            p.innerHTML = data.title;
        }


        //操作最外层的content节点
        if (ancestorNode) {
            var ancestorNodeValue = getStyles(ancestorNode, 'visibility')
            if (ancestorNodeValue != 'visible') {
                ancestorNode.style.visibility = 'visible';
            }
        }
    },

    /**
     * 清理音频
     * @return {[type]}
     */
    destroy: function() {
        var self = this;
        _.each(this.cacheCreateDivs, function(node) {
                node.parentNode.removeChild(node)
            })
            //恢复初始状态
        _.each(this.ancestors, function(node, id) {
            var orgValue = self.orgAncestorVisibility[id];
            var currValue = getStyles(node, 'visibility')
            if (currValue != orgValue) {
                node.style.visibility = orgValue;
            }
        })
        this.ancestors = null;
        this.cacheCreateDivs = null;
        this.changeValue = 0;
        this.parents = null;
        if (this.timer) {
            clearTimeout(this.timer)
            this.timer = 0;
        }
    }

}


export {
    Subtitle
}
