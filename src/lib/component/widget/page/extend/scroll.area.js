import { parseJSON } from '../../../../util/lang'

/**
 * 眷顾区域扩展
 * @type {Boolean}
 */
export default class ScrollArea {

    constructor(data, options) {
        this.data = data
        this.options = options
        this.scrolls = []
        this._init()
    }

    _init() {
        const content = this.options;
        const prefix = this.data.contentPrefix;
        //创建多个眷滚区域
        for (let i = 0; i < content.length; i++) {
            this.scrolls.push(this._create(content[i], prefix))
        }
    }

    _createWrapper() {
        return String.styleFormat(
            `<div data-type="area-wrapper"
                  style="position:absolute;width:100%; height:100%;overflow:hidden;">
                <div data-type="area-scroller"
                     data-behavior="disable"
                     style="position:absolute; width:100%; height:100%;overflow:hidden;">
                </div>
             </div>`
        )
    }

    _create(content, prefix) {

        let cid = content.id
        let contentName = prefix + cid

        let theTitle = parseJSON(content.theTitle)

        //data-widgetscrollareaList
        //data-widgetscrollareascrolltype
        let obj = theTitle["data-widgetscrollareaList"].split(",");
        if (obj.length == 0) {
            return
        }

        let contentPanle = $("#" + contentName)
        if (contentPanle.length == 0) {
            console.log(cid + "not find obj");
            return;
        }
        if (contentPanle.attr("data-iscroll") == "true") {
            return;
        }

        //去掉默认行为
        Xut.Contents.ResetDefaultControl("page", contentName, "")

        let $wrapper = $(this._createWrapper()) //创建容器
        let $scroller = $wrapper.children() //滚动容器

        contentPanle.append($wrapper)

        var contentSize = {
            x: parseInt(contentPanle.css("left")),
            y: parseInt(contentPanle.css("top")),
            w: parseInt(contentPanle.css("width")),
            h: parseInt(contentPanle.css("height"))
        }
        var scrolltype = theTitle["data-widgetscrollareascrolltype"] ?
            theTitle["data-widgetscrollareascrolltype"] :
            "xy";

        //滚动的方向
        //x / y /xy
        scrolltype = scrolltype.toLowerCase()
        var scrollX = scrolltype.indexOf("x") > -1
        var scrollY = scrolltype.indexOf("y") > -1

        let size = this._getSize(obj, prefix)
        let min = size.min
        let max = size.max

        var width = 0
        var height = 0
        var start = { x: 0, y: 0 }
        var end = { x: 0, y: 0 }

        if (min.l < contentSize.x) {
            start.x = min.l;
        } else {
            start.x = contentSize.x;
        }

        if (min.t < contentSize.y) {
            start.y = min.t;
        } else {
            start.y = contentSize.y;
        }

        if (max.l > contentSize.x + contentSize.w) {
            end.x = max.l;
        } else {
            end.x = contentSize.x + contentSize.w;
        }

        if (max.t > contentSize.y + contentSize.h) {
            end.y = max.t;
        } else {
            end.y = contentSize.y + contentSize.h;
        }

        if (!scrollX && end.x - start.x > contentSize.w) {
            width = contentSize.w
        } else {
            width = end.x - start.x;
        }

        if (!scrollY && end.y - start.y > contentSize.h) {
            height = contentSize.h
        } else {
            height = end.y - start.y;
        }

        $scroller.css({
            width: width + "px",
            height: height + "px"
        });

        for (var j = 0; j < obj.length; j++) {
            var chldId = prefix + obj[j];
            var chldObj = $("#" + chldId);
            Xut.Contents.ResetDefaultControl("page", chldId, "")
            if (chldObj.attr("data-iscroll") == "true") {
                continue;
            }
            var chldLeft = parseInt(chldObj.css("left"));
            var chldTop = parseInt(chldObj.css("top"));

            if (min.l < contentSize.x && scrollX) {
                chldLeft = chldLeft - min.l;
            } else {
                chldLeft = chldLeft - contentSize.x;
            }

            if (min.t < contentSize.y && scrollY) {
                chldTop = chldTop - min.t;
            } else {
                chldTop = chldTop - contentSize.y;
            }

            chldObj.css("left", chldLeft);
            chldObj.css("top", chldTop);

            chldObj.appendTo($scroller)
            chldObj.css("visibility", "inherit")
            chldObj.attr("data-iscroll", "true")
        }

        contentPanle.attr("data-iscroll", "true");

        let scroll = new iScroll($wrapper[0], {
            scrollX: scrollX ? true : false,
            scrollY: scrollY ? true : false,
            snap: true
        })

        if (min.l < contentSize.x && scrollX) {
            scroll.scrollTo(-Math.abs(min.l - contentSize.x), 0, 0, true)
        }
        if (min.t < contentSize.y && scrollY) {
            scroll.scrollTo(0, -Math.abs(min.t - contentSize.y), 0, true)
        }
        return scroll
    }


    _getSize(objIds, prefix) {
        //最大区间
        var max = {
            l: null,
            t: null
        }

        //最小区间
        var min = {
            l: null,
            t: null
        }

        let obj
        for (var i = 0; i < objIds.length; i++) {
            obj = $("#" + prefix + objIds[i])
            if (obj.length == 0) {
                console.log(objIds[i] + " not find");
                continue;
            }
            var width = parseInt(obj.css("width"))
            var left = parseInt(obj.css("left"))
            var height = parseInt(obj.css("height"))
            var top = parseInt(obj.css("top"))

            //获取最小区间
            var xMin = left
            var yMin = top
            if (min.l == null || min.l > xMin) {
                min.l = xMin;
            }
            if (min.t == null || min.t > yMin) {
                min.t = yMin
            }

            //获取最大元素的值
            var xMax = width + left
            var yMax = height + top
            if (max.l == null || max.l < xMax) {
                max.l = xMax
            }
            if (max.t == null || max.t < yMax) {
                max.t = yMax
            }
        }

        return {
            min,
            max
        }
    }


    destroy() {
        if (this.scrolls.length) {
            for (let i = 0; i < this.scrolls.length; i++) {
                let obj = this.scrolls[i]
                obj.destroy()
                this.scrolls[i] = null
            }
        }
    }

}
