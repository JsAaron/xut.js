import { initPointer } from './pointer'

/* 计算当前已经创建的页面索引*/
const calculationIndex = (currIndex, targetIndex, totalIndex) => {
  var i = 0,
    existpage,
    createpage,
    pageIndex,
    ruleOut = [],
    create = [],
    destroy,
    viewFlip;

  //存在的页面
  if(currIndex === 0) {
    existpage = [currIndex, currIndex + 1];
  } else if(currIndex === totalIndex - 1) {
    existpage = [currIndex - 1, currIndex];
  } else {
    existpage = [currIndex - 1, currIndex, currIndex + 1];
  }

  //需要创建的新页面
  if(targetIndex === 0) {
    createpage = [targetIndex, targetIndex + 1];
  } else if(targetIndex === totalIndex - 1) {
    createpage = [targetIndex - 1, targetIndex];
  } else {
    createpage = [targetIndex - 1, targetIndex, targetIndex + 1];
  }

  for(; i < createpage.length; i++) {
    pageIndex = createpage[i];
    //跳过存在的页面
    if(-1 === existpage.indexOf(pageIndex)) {
      //创建目标的页面
      create.push(pageIndex);
    } else {
      //排除已存在的页面
      ruleOut.push(pageIndex);
    }
  }

  _.each(ruleOut, function(ruleOutIndex) {
    existpage.splice(existpage.indexOf(ruleOutIndex), 1)
  });

  destroy = existpage;

  viewFlip = [].concat(create).concat(ruleOut).sort(function(a, b) {
    return a - b
  });

  return {
    'create': create,
    'ruleOut': ruleOut,
    'destroy': destroy,
    'viewFlip': viewFlip,
    'targetIndex': targetIndex,
    'currIndex': currIndex
  }
}

export default function api(Swipe) {

  /**
   * column的情况
   * 动态设置新的页面总数
   */
  Swipe.prototype.setLinearTotal = function(total, location) {

    //如果当前是column
    if(location === 'middle') {

      let borderIndex
        //必须是有2页以上并且当前页面就是最后一页
        //如果分栏默认只分出1页的情况，后需要不全就跳过这个处理
      if(this.totalIndex > 1 && this.visualIndex == this.totalIndex - 1) {
        borderIndex = this.visualIndex
      }

      this.totalIndex = total

      //如果是最后一页，叠加新的页面
      //需要重写一些数据
      if(borderIndex !== undefined) {
        this.setPointer(borderIndex - 1, total)
        this._updateActionPointer()
      }
    }

    //如果左边是column页面
    //改变总页面数
    //改变可视区页面为最后页
    if(location === 'left') {
      this.totalIndex = total
      this.visualIndex = total - 1;
      this.setPointer(this.visualIndex, total)
      this._updateActionPointer()
        //设置Transform的偏移量，为最后一页
      this._setTransform(this.visualIndex)
    }

    //如果是右边的column
    if(location === 'right') {
      this.totalIndex = total
    }

    this._setContainerWidth()
  }

  /**
   * 获取翻页over速率
   * @return {[type]} [description]
   */
  Swipe.prototype.getFlipOverSpeed = function(newVisualWidth) {
    return this._getFlipOverSpeed(newVisualWidth)
  }

  /**
   * 获取初始化距离值
   * @return {[type]} [description]
   */
  Swipe.prototype.getInitDistance = function() {
    return this._initDistance
  }

  /**
   * 模拟完成状态调用
   * @return {[type]} [description]
   */
  Swipe.prototype.simulationComplete = function() {
    setTimeout(() => {
      this._restore()
      this._removeFlipLock()
    })
  }

  //允许滑动
  Swipe.prototype.allowliding = function() {
    this._removeFlipLock()
  }

  //禁止滑动
  Swipe.prototype.bansliding = function() {
    this._addFlipLock()
  }


  /**
   * 停止翻页
   * @return {[type]} [description]
   */
  Swipe.prototype.openSwipe = function() {
    this._initOperation();
  }


  /**
   * 启动翻页
   * @return {[type]} [description]
   */
  Swipe.prototype.closeSwipe = function() {
    if(!this._isMoving) {
      this._off()
    }
  }


  /**
   * 是否为边界
   * @param  {[type]}  distance [description]
   * @return {Boolean}          [description]
   */
  Swipe.prototype.isBorder = function(...arg) {
    this._borderBounce(...arg)
  }


  /**
   * 检车是否还在移动中
   * @return {Boolean} [description]
   */
  Swipe.prototype.isMoving = function() {
    return this._isMoving
  }


  /**
   * 外部直接调用
   * 前翻页接口
   * @return {[type]} [description]
   */
  Swipe.prototype.prev = function() {
    if(!this._borderBounce(1)) {
      this._slideTo('prev', 'outer');
    } else {
      //边界反弹
      this._setRebound(this.visualIndex, 'next')
    }
  }


  /**
   * 外部直接调用
   * 后翻页接口
   * @return {Function} [description]
   */
  Swipe.prototype.next = function() {
    if(!this._borderBounce(-1)) {
      this._slideTo('next', 'outer');
    } else {
      //边界反弹
      this._setRebound(this.visualIndex, 'prev', 'isAppBoundary')
    }
  }


  /**
   * 获取当前页码
   * @return {[type]} [description]
   */
  Swipe.prototype.getVisualIndex = function() {
    return this.visualIndex
  }


  /**
   * 主动设置页码编号
   * 因为分栏的关系，内部修改外部
   * 页面需要拼接
   */
  Swipe.prototype.setPointer = function(target, totalIndex) {
    this.pagePointer = initPointer(target, totalIndex || this.totalIndex)
  }


  /**
   * 获取页面Pointer
   * @return {[type]} [description]
   */
  Swipe.prototype.getPointer = function() {
    return this.pagePointer
  }


  /**
   * 跳指定页面
   * @param  {[type]} targetIndex [description]
   * @param  {[type]} preMode     [description]
   * @param  {[type]} complete    [description]
   * @return {[type]}             [description]
   */
  Swipe.prototype.scrollToPage = function(targetIndex) { //目标页面

    //如果还在翻页中
    if(this._lockFlip) return

    const currIndex = this.visualIndex //当前页面

    //相邻页
    switch(targetIndex) {
      //前一页
      case(currIndex - 1):
        if(this.options.multiplePages) {
          return this.prev();
        }
        break
        //首页
      case currIndex:
        if(currIndex == 0) {
          this.$emit('onDropApp');
        }
        return
        //后一页
      case(currIndex + 1):
        if(this.options.multiplePages) {
          return this.next();
        }
        break
    }

    //算出是相关数据
    const data = calculationIndex(currIndex, targetIndex, this.totalIndex)

    //更新页码索引
    this._updataPointer(data)

    data.pagePointer = this.pagePointer

    this.$emit('onJumpPage', data)
  }


  /**
   * 销毁所有
   * @return {[type]} [description]
   */
  Swipe.prototype.destroy = function() {
    this._off();
    this.$off();
    if(this._bubbleNode) {
      this._bubbleNode.page = null
      this._bubbleNode.master = null
    }
    this.container = null
  }


  /**
   * 调用动画完成
   * @param {[type]} element [description]
   */
  Swipe.prototype.setTransitionComplete = function(...arg) {
    this._distributed(...arg)
  }


  /**
   * 目标元素
   * 找到li元素
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  Swipe.prototype.findBubbleRootNode = function(point, pageType) {
    let liNode, pageChpaterIndex
    let visualIndex = this.visualIndex
    let sectionRang = this.options.sectionRang

    //找到对应的li
    let childNodes = this._bubbleNode[pageType].childNodes
    let nodeTotal = childNodes.length

    while(nodeTotal--) {
      liNode = childNodes[nodeTotal]
      pageChpaterIndex = liNode.getAttribute('data-chapter-index');
      if(sectionRang) {
        visualIndex += sectionRang.start;
      }
      if(pageChpaterIndex == visualIndex) {
        return liNode
      }
      visualIndex = this.visualIndex;
    }
  }


}
