/**
 * 对外规则接口
 * @param  {[type]} Utils   [description]
 */

import { Observer } from '../../observer/index'
import {
  addRenderer,
  stopRenderer,
  destroyRenderer
}
from './core/index'

const slice = Array.slice;

class Rule extends Observer {

  /**
   * 初始化
   * @param  {[type]} data          [description]
   * @param  {[type]} canvasRelated [description]
   * @return {[type]}               [description]
   */
  constructor() {
    super()
    var self = this
    this.action = 'init'

    /**
     * 成功回调
     * @param  {[type]} contentId [description]
     * @return {[type]}           [description]
     */
    this.successCallback = function() {
      //加载完成构建 ppt实例
      self.$$emit('load')
    }

    /**
     * 失败回调
     * @param  {[type]} contentId [description]
     * @return {[type]}           [description]
     */
    this.failCallback = function() {
      //删掉对应的contentId记录
      // var index =  canvasRelated.contentIdset.indexOf(contentId)
      // canvasRelated.contentIdset.splice(index,1);
      console.log('failCallback')
    }
  }

  //所有self动画共享一个刷新器
  //所以在每一个子动画中传递一个刷新器接口
  play() {
    this.action = 'play'
    this._play && this._play(addRenderer)
  }

  stop() {
    this.action = 'stop'
    this._stop && this._stop(stopRenderer)
  }

  //复位
  reset() {
    this.action = 'reset'
    this._reset && this._reset()
  }

  destroy() {
    this.action = 'destroy'
    this._destroy && this._destroy(destroyRenderer)
  }
}


export {
  Rule
}
