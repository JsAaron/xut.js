/********************************************************************
 *
 *                  创建所有的JS零件类
 *                  1 js
 *                  2 page
 *                  3 svg
 *                  4 canvas
 *                  5 webgL
 *
 * *******************************************************************/

import {loadfile} from '../../util/loader'

/**
 * 页面零件
 * @param {[type]} data [description]
 */
function pageWidget(data) {

    //获取数据
    _.extend(this, data)

    this._widgetObj = null;

    var widgetName = this.widgetName + "Widget"

    //加载文件
    if (typeof window[this.widgetName + "Widget"] != "function") {
        this.loadfile(this.executive);
    } else {
        this.executive();
    }
}

pageWidget.prototype = {

    /**
     * 路径地址
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    path: function(fileName) {
        return 'content/widget/' + this.widgetId + '/' + fileName
    },

    /**
     * 加载js,css文件
     * @return {[type]} [description]
     */
    loadfile: function(callback) {
        var jsPath, cssPath, completeCount,
            self = this,
            //定义css,js的命名
            jsName = this.widgetName + '.min.js',
            cssName = (this.widgetType == 'page' || this.widgetType == 'js') ? 'style.min.css' : 0,
            //需要等待完成
            completeCount = function() {
                var count = 0;
                jsName && count++;
                cssName && count++;
                return function() {
                    if (count === 1) {
                        return callback && callback.call(self);
                    }
                    count--;
                }
            }();

        //加载css
        if (cssName) {
            cssPath = this.path(cssName);
            loadfile(cssPath, function() {
                completeCount();
            })
        }

        //加载js
        if (jsName) {
            jsPath = this.path(jsName);
            loadfile(jsPath, function() {
                completeCount();
            });
        }
    },

    /**
     * 创建数据
     * @return {[type]} [description]
     */
    createData: function() {
        var item,
            field,
            source_export = [],
            images = Xut.data['Image'],
            token = null,
            outputPara = this.inputPara,
            items = outputPara.source;

        for (item in items) {
            if (items.hasOwnProperty(item)) {

                field = {};
                token = images.item((parseInt(items[item]) || 1) - 1);
                field['img'] = token.md5;
                field['thumb'] = '';
                field['title'] = token.imageTitle;
                source_export.push(field);

            }
        }

        outputPara.source = source_export;
        outputPara.scrollPaintingMode = this.scrollPaintingMode;
        outputPara.calculate = this.calculate;

        return outputPara;
    },


    /**
     * 解析数据,获取content对象
     * @return {[type]} [description]
     */
    parseContentObjs: function() {
        var contentIds = [],
            inputPara = this.inputPara;
        inputPara.content && _.each(inputPara.content, function(contentId) {
            contentIds.push(contentId);
        });
        return Xut.Contents.GetpageWidgetData(this.pageType, contentIds)
    },


    /**
     * 执行函数
     * @return {[type]} [description]
     */
    executive: function() {
        //得到content对象与数据
        var data = this.createData();
        var contentObjs = this.parseContentObjs();
        if (this.widgetType == 'canvas') {
            var id = contentObjs ? contentObjs[0].id : data.frame;
            var canvasId = "pageWidget_" + id;
            var canvansContent = $("#" + data.contentPrefix + id);
            if ($("#" + canvasId).length < 1) {
                canvansContent.append("<canvas style='position:absolute; z-index:10' id='" + canvasId + "' width='" + canvansContent.width() + "' height='" + canvansContent.height() + "'></canvas>")
            }
            canvansContent.canvasId = canvasId;
        }
        if (typeof(window[this.widgetName + "Widget"]) == "function")
            this._widgetObj = new window[this.widgetName + "Widget"](data, contentObjs);
        else
            console.error("Function [" + this.widgetName + "Widget] does not exist.");
    },


    //================ 外部调用 =====================


    play: function() {
        console.log('widget')
        return this._widgetObj.play();
    },

    getIdName: function() {
        return this._widgetObj.getIdName();
    },

    /**
     * 外部调用接口
     * @return {[type]} [description]
     */
    dispatchProcess: function() {
        this._widgetObj.toggle();
    },

    /**
     * 处理包装容器的状态
     * @return {[type]} [description]
     */
    domWapper: function() {
        if (!this.wapper) return;
        if (this.state) {
            this.$wapper.hide();
        } else {
            this.$wapper.show();
        }
    },

    /**
     * 销毁页面零件
     * @return {[type]} [description]
     */
    destroy: function() {
        console.log(222222)
        if (this._widgetObj && this._widgetObj.destroy)
            this._widgetObj.destroy();
    }
}


export { pageWidget }
