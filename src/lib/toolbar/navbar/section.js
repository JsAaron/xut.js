import { config } from '../../config/index'


/**
 * 下拉章节列表
 */
export default class Section {

    constructor(data) {
        this._isHorizontal = config.layoutMode === 'horizontal'
        this._pagedata = data
        this._$navlist = $('#xut-nav-section-list')
        this._list = this._$navlist.find("li")
    }


    /**
     * 卷滚条
     * @param  {[type]} pageIndex [description]
     * @return {[type]}           [description]
     */
    userIscroll(pageIndex) {
        let H = !!(this._isHorizontal)

        if (this.hBox) {
            if (H) {
                //hBox.goToPage(pageIndex, 0, 0)
            } else {
                this.hBox.goToPage(0, pageIndex, 0);
            }
        } else {
            this.hBox = new iScroll('#xut-nav-wrapper', {
                snap: 'li',
                tap: true,
                scrollX: H,
                scrollY: !H,
                scrollbars: true,
                fadeScrollbars: true,
                stopPropagation: true
            });

            //滑动结束,动态处理缩略图
            this.hBox.on('scrollEnd', e => {
                this.createThumb();
                this.removeThumb();
            });

            this._$navlist.on('tap', self.tojump);
        }
    }


    /**
     * [ 创建缩略图]
     * @return {[type]} [description]
     */
    createThumb() {
        let index = this.getPageIndex(), //最左边的索引
            count = this.getViewLen(), //允许显示的页数
            createBak = this.createBak || [], //已创建的页码索引
            createNew = [], //新建的页码索引
            pageData = this._pagedata,
            maxLen = pageData.length,
            path = config.pathAddress;

        //确保不会溢出
        count = count > maxLen ? maxLen : count;
        //尽可能地填满
        index = index + count > maxLen ? maxLen - count : index;

        let i = 0
        let j
        let page

        for (i = 0; i < count; i++) {
            j = index + i
            page = pageData[j]
            createNew.push(j);
            if (_.contains(createBak, j)) continue;
            createBak.push(j);

            //如果是分层母板了,此时用icon代替
            if (page.iconImage) {
                this._list.eq(j).css({
                    'background-image': 'url(' + path + page.iconImage + ')'
                });
            } else {
                this._list.eq(j).css({
                    'background-image': 'url(' + path + page.md5 + ')',
                    'background-color': 'white'
                });
            }
        }

        this.createNew = createNew;
        this.createBak = createBak;
    }


    /**
     * [ 清理隐藏的缩略图]
     * @return {[type]} [description]
     */
    removeThumb() {
        let list = this._list
        let createNew = this.createNew
        let createBak = this.createBak

        _.each(createBak, function(val, i) {
            if (!_.contains(createNew, val)) {
                //标记要清理的索引
                createBak[i] = -1;
                list.eq(val).css({
                    'background': ''
                });
            }
        });

        //执行清理
        this.createBak = _.without(createBak, -1);
    }

    /**
     * [ 得到滑动列表中最左侧的索引]
     * @return {[type]} [description]
     */
    getPageIndex() {
        if (this.hBox.options.scrollX) {
            return this.hBox.currentPage.pageX;
        } else {
            return this.hBox.currentPage.pageY;
        }

    }

    /**
     * [ 获取待创建的缩略图的个数]
     * @return {[type]} [description]
     */
    getViewLen() {
        var hBox = this.hBox,
            eleSize = 1, //单个li的高度,
            count = 1,
            len = this._pagedata.length; //li的总数

        if (this._isHorizontal) {
            eleSize = hBox.scrollerWidth / len;
            count = hBox.wrapperWidth / eleSize;
        } else {
            eleSize = hBox.scrollerHeight / len;
            count = hBox.wrapperHeight / eleSize;
        }
        //多创建一个
        return Math.ceil(count) + 1;
    }


    /**
     * 点击元素跳转
     */
    tojump(env) {
        var target
        var xxtlink
        if (target = env.target) {
            // initialize();
            if (xxtlink = target.getAttribute('data-xxtlink')) {
                xxtlink = xxtlink.split('-');
                Xut.View.GotoSlide(xxtlink[0], xxtlink[1]);
            }
        }
    }


    /**
     * 滚动指定位置
     */
    scrollTo() {
        this.userIscroll()
    }

    /**
     * 刷新
     */
    refresh() {
        this.hBox && this.hBox.refresh();
    }

    /**
     * 销毁
     */
    destroy() {
        if (this.hBox) {
            this._$navlist.off();
            this.hBox.destroy();
            this.hBox = null;
        }
        this._pagedata = null;
    }

}
