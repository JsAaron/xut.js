/*基本动画类鼠标响应事件*/

const hasTouch = Xut.plat.hasTouch

import { $on, $off, $handle } from '../../../util/event'


export default class MoveMent {

  constructor(pageType, parentId, objectId, startCallback, moveCallback, endCallback) {
    this.hasTouch = hasTouch;
    this.parent = document.getElementById(parentId);
    this.scroller = document.getElementById(objectId);
    this.startCallback = startCallback;
    this.moveCallback = moveCallback;
    this.endCallback = endCallback;
    if(this.scroller == null) {
      console.error("The control area of the object is empty.");
      return;
    }

    //取消默认翻页行为
    if(Xut.Contents.ResetDefaultControl) {
      Xut.Contents.ResetDefaultControl(pageType, parentId);
    }

    //注销重复事件
    if(this.scroller["bindMoveMent"]) {
      this.scroller["bindMoveMent"].destroy()
    }

    $on(this.scroller, {
      start: this
    })

    this.scroller["bindMoveMent"] = this; //实例化对象绑定到元素，便于后期调用
  }

  handleEvent(e) {
    $handle({
      start(e) {
        this._start(e)
      },
      move(e) {
        this._move(e)
      },
      end(e) {
        this._end(e)
      },
      cancel(e) {
        this._end(e)
      }
    }, this, e)
  }

  _start(e) {
    e.preventDefault();
    if(typeof(this.startCallback) == "function") this.startCallback(e);
    $on(this.scroller, {
      move: this,
      end: this,
      cancel: this
    })
  }

  _move(e) {
    if(typeof(this.moveCallback) == "function") this.moveCallback(e);
  }

  _end(e) {
    $off(this.scroller)
    if(typeof(this.endCallback) == "function") this.endCallback(e);
  }

  destroy(type, el, bubble) {
    $off(this.scroller)
    this.scroller = null
  }

}
