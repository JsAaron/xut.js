/**
 * html文本框
 * @param  {[type]} ){} [description]
 * @return {[type]}       [description]
 */

import { bindContentEvent } from '../event/event'
import { bindEvent, offEvent } from '../../../util/event'
import { config } from '../../../config/index'
import {
    _set,
    _get
}
from '../../../util/stroage'

let defaultFontSize
let baseValue1
let baseValue2
let baseValue3
let docEl = document.documentElement
let whiteObject = {
    "rgb(255, 255, 255)": true,
    "#ffffff": true,
    "#FFFFFF": true,
    "#fff": true,
    "#FFF": true

}

function setOption() {

    let defaultFontSize

    try {
        defaultFontSize = parseInt(getComputedStyle(docEl).fontSize)
    } catch (er) {
        defaultFontSize = 16
    }

    //实际字体大小
    defaultFontSize = defaultFontSize * config.proportion.width;

    //设置默认rem
    docEl.style.fontSize = defaultFontSize + "px"

    baseValue1 = Math.floor(defaultFontSize * 1.5);
    baseValue2 = Math.floor(defaultFontSize * 2.0);
    baseValue3 = Math.floor(defaultFontSize * 2.5);
}

/**
 * 工具栏布局
 * @return {[type]} [description]
 */
function textLayer() {
    var str = '  <div class="htmlbox_close_container">' + '        <a class="htmlbox_close"></a>' + ' </div>' + ' <ul class="htmlbox_fontsizeUl">' + '    <li>' + '        <a class="htmlbox_small" style="width:{0}px;height:{1}px;margin-top:-{2}px"></a>' + '     </li>' + '     <li>' + '        <a class="htmlbox_middle" style="width:{3}px;height:{4}px;margin-top:-{5}px"></a>' + '     </li>' + '    <li>' + '        <a class="htmlbox_big" style="width:{6}px;height:{7}px;margin-top:-{8}px"></a>' + '    </li>' + ' </ul>'

    return String.format(str,
        baseValue1, baseValue1, baseValue1 / 2,
        baseValue2, baseValue2, baseValue2 / 2,
        baseValue3, baseValue3, baseValue3 / 2
    );
}

/**
 * 创建盒子容器
 * @return {[type]} [description]
 */
function createWapper(boxName, textLayer, iscrollName, textContent) {
    var wapper = ' <div id="{0}" class="htmlbox_container">' + '    <div class="htmlbox-toolbar">{1}</div>' + '    <div id="{2}" style="overflow:hidden;position:absolute;width:100%;height:92%;">' + '        <ul>' + '          {3}' + '        </ul>' + '     </div>' + ' </div>'

    return String.format(wapper, boxName, textLayer, iscrollName, textContent)
}


function HtmlBox(contentId, $contentNode) {

    setOption();
    this.contentId = contentId;
    this.$contentNode = $contentNode;
    var self = this;

    //事件对象引用
    var eventHandler = function(eventReference, eventHandler) {
        self.eventReference = eventReference;
        self.eventHandler = eventHandler;
    }

    //绑定点击事件
    bindContentEvent({
        'eventRun': function() {
            Xut.View.HideToolbar();
            self.init(contentId, $contentNode)
        },
        'eventHandler': eventHandler,
        'eventContext': $contentNode,
        'eventName': "tap",
        'domMode': true
    });
}



HtmlBox.prototype = {
    /**
     * 调整字体大小
     * @return {[type]} [description]
     */
    adjustSize: function(value, save) {
        value = parseInt(value);
        docEl.style.fontSize = value + "px";
        save && _set(this.storageName, value)
    },
    /**
     * 遍历p span文字标签 调整字体颜色
     * @return {[type]} [description]
     */
    adjustColor: function() {
        this.textLabelArray = ['p', 'span'];
        var self = this;
        _.each(self.textLabelArray, function(text) {
            _.each(self.$contentNode.find(text), function(el) {
                var formerColor = getComputedStyle(el).color;
                //若字体颜色为白色 调整为黑色
                if (whiteObject.hasOwnProperty(formerColor)) {
                    el.hasFormerColor = true;
                    el.style.color = "black"
                }
            })
        })
    },
    /**
     * 恢复放大过的字体颜色
     * @return {[type]} [description]
     */
    restoreColor: function() {
        var self = this;
        _.each(self.textLabelArray, function(text) {
            _.each(self.$contentNode.find(text), function(el) {
                //将字体由黑色恢复为白色
                if (el.hasFormerColor) {
                    el.style.color = "white";
                    el.hasFormerColor = false;
                }
            })
        });

    },

    /**
     * 卷滚
     * @param  {[type]} iscrollName [description]
     * @return {[type]}             [description]
     */
    createIscroll: function(iscrollName) {
        this.iscroll = new iScroll("#" + iscrollName, {
            scrollbars: true,
            fadeScrollbars: true
        });
    },

    init: function(contentId, $contentNode) {
        var self = this;

        self.adjustColor();

        //移除偏移量 存在偏移量造成文字被覆盖
        var textContent = $contentNode.find(">").html();
        textContent = textContent.replace(/translate\(0px, -\d+px\)/g, 'translate(0px,0px)');

        var boxName = "htmlbox_" + contentId;
        var iscrollName = "htmlbox_iscroll_" + contentId;

        //缓存名
        this.storageName = boxName + config.appId;

        //获取保存的字体值
        var storageValue = _get(this.storageName)
        if (storageValue) {
            this.adjustSize(storageValue)
        }

        //创建容器
        this.$str = $(createWapper(boxName, textLayer(), iscrollName, textContent));
        $contentNode.after(this.$str);

        //卷滚
        this.createIscroll(iscrollName);

        //绑定事件上下文呢
        this.eventContext = this.$str.find('.htmlbox-toolbar')[0];
        //字体大小
        var sizeArray = ["1", "1.25", "1.5"];
        //改变字体与刷新卷滚
        var change = function(fontsize) {
                self.adjustSize(fontsize * defaultFontSize, true);
                self.iscroll.refresh()
            }
            //处理器
        var process = {
                htmlbox_close_container: function() {
                    self.restoreColor();
                    self.adjustSize(defaultFontSize)
                    self.removeBox();
                },
                htmlbox_close: function() {
                    self.restoreColor();
                    self.adjustSize(defaultFontSize)
                    self.removeBox();

                },
                htmlbox_small: function() {
                    change(sizeArray[0]);
                },
                htmlbox_middle: function() {
                    change(sizeArray[1]);
                },
                htmlbox_big: function() {
                    change(sizeArray[2]);
                }
            }
            //冒泡匹配按钮点击
        this.start = function(e) {
            var className = e.target.className;
            process[className] && process[className]();
        }

        bindEvent(this.eventContext, {
            start: this.start
        })
    },

    //移除盒子
    removeBox: function() {
        offEvent(this.eventContext, {
            start: this.start
        })
        this.$str && this.$str.remove();
        this.iscroll && this.iscroll.destroy();
        this.iscroll = null;
    },

    //销毁外部点击事件与
    destroy: function() {
        _.each(this.eventReference, function(off) {
            off("tap")
        })
        this.removeBox();
    }
}


export {
    HtmlBox
}
