import { calculationIndex } from './depend'


export default function api(Swipe) {


    Swipe.prototype.openSwipe = function() {
        this._initOperation();
    }

    Swipe.prototype.closeSwipe = function() {
        this._evtDestroy();
    }


    /**
     * 是否为边界
     * @param  {[type]}  distance [description]
     * @return {Boolean}          [description]
     */
    Swipe.prototype.isBorder = function(distance) {
        //起点左偏移
        if (this.hindex === 0 && distance > 0) {
            return true;
        }
        //终点右偏移
        if (this.hindex === (this.pagetotal - 1) && distance < 0) {
            return true
        }
    }


    /**
     * 检车是否还在移动中
     * @return {Boolean} [description]
     */
    Swipe.prototype.isMove = function() {
        return this.fliplock;
    }


    /**
     * 前翻页接口
     * @return {[type]} [description]
     */
    Swipe.prototype.prev = function() {
        if (!this._overstep(1)) {
            this._slideTo('prev');
        }
    }

    /**
     * 后翻页接口
     * @return {Function} [description]
     */
    Swipe.prototype.next = function() {
        if (!this._overstep(-1)) {
            this._slideTo('next');
        }
    }


    /**
     * 跳指定页面
     * @param  {[type]} targetIndex [description]
     * @param  {[type]} preMode     [description]
     * @param  {[type]} complete    [description]
     * @return {[type]}             [description]
     */
    Swipe.prototype.scrollToPage = function(targetIndex, preMode, complete) { //目标页面

        //如果还在翻页中
        if (this.fliplock) return

        var data;
        var currIndex = this.hindex; //当前页面

        switch (targetIndex) {
            //前一页
            case (currIndex - 1):
                if (this.multiplePages) {
                    return this.prev();
                }
                break;
                //首页
            case currIndex:
                if (currIndex == 0) {
                    this.$emit('onDropApp');
                }
                return
                //后一页
            case (currIndex + 1):
                if (this.multiplePages) {
                    return this.next();
                }
                break;
        }

        //算出是相关数据
        data = calculationIndex(currIndex, targetIndex, this.pagetotal)

        //更新页码索引
        this._updataPointer(data);

        data.pagePointer = this.pagePointer;

        this.$emit('onJumpPage', data);
    }


    /**
     * 销毁所有
     * @return {[type]} [description]
     */
    Swipe.prototype.destroy = function() {
        this._evtDestroy();
        this.$off();
        this.bubbleNode.page = null;
        this.bubbleNode.master = null;
        this.element = null;
    }


    /**
     * 设置动画完成
     * @param {[type]} element [description]
     */
    Swipe.prototype.setAnimComplete = function(element) {
        this.distributed(element[0])
    }


    /**
     * 目标元素
     * 找到li元素
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    Swipe.prototype.findRootElement = function(point, pageType) {
        var liNode, map,
            hindex = this.hindex,
            sectionRang = this.sectionRang,
            //找到对应的li
            childNodes = this.bubbleNode[pageType].childNodes,
            numNodes = childNodes.length;

        while (numNodes--) {
            liNode = childNodes[numNodes];
            map = liNode.getAttribute('data-map');
            if (sectionRang) {
                hindex += sectionRang.start;
            }
            if (map == hindex) {
                return liNode
            }
            hindex = this.hindex;
        }
    }


}
