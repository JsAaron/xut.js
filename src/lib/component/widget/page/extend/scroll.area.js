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
                <ul data-type="area-scroller"
                     data-behavior="disable"
                     style="position:absolute; width:100%; height:100%;overflow:hidden;">
                </ul>
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

        var scrolltype = theTitle["data-widgetscrollareascrolltype"] ?
            theTitle["data-widgetscrollareascrolltype"] :
            "xy";

        //滚动的方向
        //x / y /xy
        scrolltype = scrolltype.toLowerCase()
        let scrollX = scrolltype.indexOf("x") > -1
        let scrollY = scrolltype.indexOf("y") > -1

        let $wrapper

        //如果来回翻页
        //因为子节点的排列关系已经被改变
        //所以这里直接处理事件
        const hasIscroll = contentPanle.attr("data-iscroll")
        if (hasIscroll) {
            //需要滚动条
            if (hasIscroll === 'visible') {
                $wrapper = contentPanle.children('div[data-type="area-wrapper"]')
                return this._bindIscroll($wrapper[0], scrollX, scrollY, cid)
            }
            //hidden
            return
        }

        //去掉默认行为
        Xut.Contents.ResetDefaultControl("page", contentName, "")

        var contentSize = {
            x: parseInt(contentPanle.css("left")),
            y: parseInt(contentPanle.css("top")),
            w: parseInt(contentPanle.css("width")),
            h: parseInt(contentPanle.css("height"))
        }

        let size = this._getSize(obj, prefix)
        let min = size.min
        let max = size.max

        //创建容器
        $wrapper = $(this._createWrapper())

        //滚动容器
        let $scroller = $wrapper.children()
        contentPanle.append($wrapper)

        //设置滚动容器宽高
        this._setScrollerStyle(max, min, contentSize, scrollX, scrollY, $scroller)

        //重置各个content的left top值 并得到
        //x轴方向卷滚：snap容器的宽度 个数以及每个snap容器包含的content个数
        //y轴方向卷滚：snap容器的高度 个数以及每个snap容器包含的content个数
        const colsObj = this._resetContents(obj, prefix, contentSize, scrollX, scrollY, min);

        //若只存在一个snap容器则不需要进行卷滚
        if ((scrollX && colsObj.snapXCount == 1) || (scrollY && colsObj.snapYCount == 1)) {
            contentPanle.attr("data-iscroll", "hidden");
            return;
        }

        //创建snap容器
        let snapContainer = this._createSnapContainer(colsObj, $scroller, cid, scrollX, scrollY)

        //将content添加到snap容器中
        if (scrollX) {
            for (var j = 0; j < obj.length; j++) {
                var childId = prefix + obj[j];
                var childObj = $("#" + childId);
                childObj.appendTo(snapContainer[Math.floor(j / colsObj.contentsPerSnapX)]);
            }
        }
        if (scrollY) {
            for (var j = 0; j < obj.length; j++) {
                var childId = prefix + obj[j];
                var childObj = $("#" + childId);
                childObj.appendTo(snapContainer[Math.floor(j / colsObj.contentsPerSnapY)])
            }
        }

        contentPanle.attr("data-iscroll", "visible");

        return this._bindIscroll($wrapper[0], scrollX, scrollY, cid)
    }

    _bindIscroll(wrapper, scrollX, scrollY, cid) {
        return new iScroll(wrapper, {
            scrollX: scrollX ? true : false,
            scrollY: scrollY ? true : false,
            snap: ".contentsContainer" + cid
        })
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

    /**
     * 设置scroller标签的宽高
     * @param {[type]} max         [description]
     * @param {[type]} min         [description]
     * @param {[type]} contentSize [description]
     * @param {[type]} scrollX     [description]
     * @param {[type]} scrollY     [description]
     * @param {[type]} $scroller   [description]
     */
    _setScrollerStyle(max, min, contentSize, scrollX, scrollY, $scroller) {
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
    }

    /**
     * 重设各个子content的left top值 以包裹他们的父容器为基准
     * 并且得到snapContainer的个数 宽度 以及每个snapContainer中可以放的content个数
     * @param  {[type]} obj         [description]
     * @param  {[type]} prefix      [description]
     * @param  {[type]} contentSize [description]
     * @param  {[type]} scrollX     [description]
     * @param  {[type]} scrollY     [description]
     * @param  {[type]} min         [description]
     * @return {[type]}             [description]
     */
    _resetContents(obj, prefix, contentSize, scrollX, scrollY, min) {
        let contentsPerSnapX,
            contentsPerSnapY,
            snapXCount,
            snapYCount,
            snapContainerWidth,
            snapContainerHeight
        let contentsXTemp = 0;
        let contentsYTemp = 0;
        const contentsLength = obj.length;

        for (var j = 0; j < contentsLength; j++) {
            var childId = prefix + obj[j];
            var childObj = $("#" + childId);
            Xut.Contents.ResetDefaultControl("page", childId, "")
            if (childObj.attr("data-iscroll") == "true") {
                continue;
            }
            var childLeft = parseInt(childObj.css("left"));
            var childTop = parseInt(childObj.css("top"));
            var childWidth = parseInt(childObj.css("width"))

            if (min.l < contentSize.x && scrollX) {
                childLeft = childLeft - min.l;
            } else {
                childLeft = childLeft - contentSize.x;
            }

            if (min.t < contentSize.y && scrollY) {
                childTop = childTop - min.t;
            } else {
                childTop = childTop - contentSize.y;
            }

            childObj.css("left", childLeft);
            childObj.css("top", childTop);

            //x轴卷滚
            if (scrollX) {
                if (childLeft < contentSize.w) {
                    contentsXTemp++;
                } else {
                    if (!contentsPerSnapX) {
                        contentsPerSnapX = contentsXTemp;
                        snapContainerWidth = childLeft
                    }
                }
            }
            //y轴卷滚
            if (scrollY) {
                if (childTop < contentSize.h) {
                    contentsYTemp++;
                } else {
                    if (!contentsPerSnapY) {
                        contentsPerSnapY = contentsYTemp;
                        snapContainerHeight = childTop
                    }
                }
            }

            childObj.css("visibility", "inherit")
            childObj.attr("data-iscroll", "true")
        }


        if (scrollX) {
            //无需创建卷滚
            if (!contentsPerSnapX) {
                contentsPerSnapX = obj.length;
                snapXCount = 1;
                snapContainerWidth = contentSize.w;
            } else {
                snapXCount = Math.ceil(obj.length / contentsPerSnapX);
            }
        }

        if (scrollY) {
            //得到卷滚区域一行可以放多少列
            let colsPerRow = 1;
            for (var k = 0; k < contentsLength; k++) {
                var childId = prefix + obj[k];
                var childObj = $("#" + childId);
                var childTop = parseInt(childObj.css("top"));
                if (k > 0) {
                    var prevChildId = prefix + obj[k - 1];
                    var prevChildObj = $("#" + prevChildId);
                    var prevChildTop = parseInt(prevChildObj.css("top"));
                    if (childTop < prevChildTop + 10) {
                        colsPerRow++;
                    } else {
                        break;
                    }
                }
            }

            //无需创建卷滚
            if (!contentsPerSnapY) {
                contentsPerSnapY = Math.floor(obj.length / colsPerRow) + 1; ////在不需要卷滚的条件下 只会存在一个snap snap中的行数由content的总数/每行的个数 +1
                snapYCount = 1;
                snapContainerHeight = contentSize.h;
            } else {
                snapYCount = Math.ceil(obj.length / contentsPerSnapY);
            }
        }


        return {
            contentsPerSnapX,
            snapXCount,
            snapContainerWidth,
            contentsPerSnapY,
            snapYCount,
            snapContainerHeight
        }
    }

    /**
     * 创建snapContainer并添加到scroller中
     * @param  {[type]} colsObj   [description]
     * @param  {[type]} $scroller [description]
     * @param  {[type]} cid       [description]
     * @return {[type]}           [description]
     */
    _createSnapContainer(colsObj, $scroller, cid, scrollX, scrollY) {
        let snapContainer = '';

        if (scrollX) {
            const scrollerWidth = parseInt($scroller.css("width"));
            const snapXCount = colsObj.snapXCount;
            const snapContainerWidth = colsObj.snapContainerWidth
            const lastSnapContainerWidth = scrollerWidth - (snapXCount - 1) * snapContainerWidth;
            let containerWidth
            for (var i = 0; i < colsObj.snapXCount; i++) {
                //最后一个snap容器的宽度需要单独设置 否则可能所有的snap容器宽度和会大于scroller的宽度
                if (i == colsObj.snapXCount - 1) {
                    containerWidth = lastSnapContainerWidth
                } else {
                    containerWidth = snapContainerWidth
                }
                snapContainer += `<li class="contentsContainer${cid}"
                                      style='width:${containerWidth}px;height:100%;float:left;'>
                                  </li>`
            }
        }
        //Y轴滚动
        else if (scrollY) {
            const scrollerHeight = parseInt($scroller.css("height"))
            const snapYCount = colsObj.snapYCount;
            const snapContainerHeight = colsObj.snapContainerHeight
            const lastSnapContainerHeight = scrollerHeight - (snapYCount - 1) * snapContainerHeight;
            for (var i = 0; i < colsObj.snapYCount; i++) {
                snapContainer += `<li class="contentsContainer${cid}"
                                      style='height:${snapContainerHeight}px;width:100%;float:left;'>
                                  </li>`
            }
        }

        snapContainer = $(snapContainer)
        snapContainer.appendTo($scroller)
        return snapContainer
    }

    destroy() {
        if (this.scrolls.length) {
            for (let i = 0; i < this.scrolls.length; i++) {
                let obj = this.scrolls[i]
                obj.scrollTo(0, 0)
                obj.destroy()
                this.scrolls[i] = null
            }
            this.scrolls = null
        }
        this.data.container = null
        this.options = null
    }

}
