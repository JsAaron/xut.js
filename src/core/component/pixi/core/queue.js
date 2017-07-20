import {
  hash
}
from '../../util/lang'


/**
 * pixi帧队列控制器
 * @param  {[type]} Utils        [description]
 * @param  {[type]} Config       [description]
 * @param  {[type]} pixiFactory) {               var rAF [description]
 * @return {[type]}              [description]
 */

var rAF = (callback) => {
  return window.setTimeout(callback, 1000 / 10);
};


//收集绘制内容
var rQueue = {};

// $('body').on('dblclick',function(){
//     console.log(rQueue)
// })

/**
 * 运动动画
 * @param  {[type]} activeIndex [description]
 * @return {[type]}             [description]
 */
function requestAnimation(activeIndex) {
  var key;
  var queue = rQueue[activeIndex];
  var timeout = 0;
  var state = true
  var clern = function() {
    clearTimeout(timeout)
    timeout = null;
  }
  var run = function() {
    //如果停止
    if(!state) {
      clern();
      state = false
      return
    }
    if(rQueue[activeIndex]) {
      var fns = queue["fns"];
      //刷新
      for(key in fns) {
        fns[key](); //执行刷新
      }
      // console.log('runRequestAnimation....',activeIndex, Object.keys(fns).length)
      timeout = rAF(function() {
        run()
      })
    }
  }
  run();

  //停止刷新
  this.stop = function() {
    if(state) {
      state = false
      clern()
    }
  }

  //刷新停止
  //外部重新激活
  this.activate = function() {
    if(!state) {
      state = true
      run();
    }
  }
  return this;
}


/**
 * 检测运行
 * @param  {[type]} pageIndex [description]
 * @return {[type]}           [description]
 */
function checkRun(pageIndex) {
  // 活动页面索引
  var activeIndex = Xut.Presentation.GetPageIndex();
  //激活
  if(activeIndex === pageIndex) {
    var queue = rQueue[activeIndex];
    //去重
    if(queue.rAF) {
      queue.rAF.activate();
    } else {
      queue.rAF = new requestAnimation(activeIndex);
    }
  }
}



/**
 * 用于绘制显示的，特殊处理
 * 单独只刷新一次
 * @return {[type]} [description]
 */
export function oneQueue() {
  var start = (+new Date());
  var timeout;
  var state = true
  var run = function() {
    if(!state) {
      timeout && clearTimeout(timeout)
    }
    timeout = rAF(run)
  }
  if((+new Date()) - start > 100) {
    state = false
    clearTimeout(timeout)
    timeout = null;
  }
}

/**
 * 加入绘制队列
 * @param {[type]} pageIndex [description]
 * @param {[type]} key       [description]
 * @param {[type]} value     [description]
 */
export function addQueue(pageIndex, key, value) {
  // console.log('c',pageIndex,key)
  if(!rQueue[pageIndex]) {
    rQueue[pageIndex] = hash();
    rQueue[pageIndex]['rAF'] = 0;
    rQueue[pageIndex]['fns'] = hash();
    rQueue[pageIndex]['length'] = 0;
    rQueue[pageIndex]['pageIndex'] = pageIndex;
  }
  if(!rQueue[pageIndex]['fns'][key]) {
    rQueue[pageIndex]['fns'][key] = value;
    ++rQueue[pageIndex]['length']
  } else {
    console.log('rQueue' + key + '已存在')
  }
  //开始运行
  checkRun(pageIndex)
}

/**
 * 移除刷新队列
 * @param  {[type]} pageIndex [description]
 * @param  {[type]} key       [description]
 * @return {[type]}           [description]
 */
export function removeQueue(pageIndex, key) {
  if(rQueue[pageIndex] && rQueue[pageIndex]['fns']) {
    delete rQueue[pageIndex]['fns'][key]
      --rQueue[pageIndex]['length']
    if(!Object.keys(rQueue[pageIndex]['fns']).length) {
      if(rQueue[pageIndex].rAF) {
        rQueue[pageIndex].rAF.stop();
      }
    }
  } else {
    console.log('Queue删除的页面不存在')
  }
}

/**
 * 销毁
 * @return {[type]} [description]
 */
export function destroyQueue(pageIndex) {
  if(rQueue[pageIndex]) {
    if(rQueue[pageIndex].rAF) {
      rQueue[pageIndex].rAF.stop();
    }
    delete rQueue[pageIndex];
  }
}

/**
 * 查询队列
 * @return {[type]} [description]
 */
export function getQueue() {
  return rQueue
}