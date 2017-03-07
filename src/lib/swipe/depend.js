//转换页码索引
//direction 方向
//pointer 当前页码标示
//[17 18 19]  pagePointer
//[18 19 20]  转换后
// 17 销毁
// 20 创建
export const getActionPointer = function(direction, leftIndex, rightIndex) {
  let createPointer //创建的页
  let destroyPointer //销毁的页
  switch(direction) {
    case 'prev': //前处理
      createPointer = (leftIndex - 1);
      destroyPointer = (rightIndex);
      break;
    case 'next': //后处理
      createPointer = (rightIndex + 1);
      destroyPointer = (leftIndex);
      break;
  }
  return {
    createPointer,
    destroyPointer
  }
}


/**
 * 初始化首次范围
 * @return {[type]} [description]
 */
export const initPointer = (init, pageTotal) => {
  var leftscope = 0,
    pagePointer = {};

  if(init === leftscope) { //首页
    pagePointer['currIndex'] = init;
    pagePointer['rightIndex'] = init + 1;
  } else if(init === pageTotal - 1) { //首页
    pagePointer['currIndex'] = init;
    pagePointer['leftIndex'] = init - 1;
  } else { //中间页
    pagePointer['leftIndex'] = init - 1;
    pagePointer['currIndex'] = init;
    pagePointer['rightIndex'] = init + 1;
  }
  return pagePointer;
}

/**
 * 兼容事件对象
 * @return {[type]}   [description]
 */
export const compatibilityEvent = (e) => {
  var point;
  if(e.touches && e.touches[0]) {
    point = e.touches[0];
  } else {
    point = e;
  }
  return point
}

/**
 * 计算当前已经创建的页面索引
 */
export const calculationIndex = (currIndex, targetIndex, pageTotal) => {
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
  } else if(currIndex === pageTotal - 1) {
    existpage = [currIndex - 1, currIndex];
  } else {
    existpage = [currIndex - 1, currIndex, currIndex + 1];
  }

  //需要创建的新页面
  if(targetIndex === 0) {
    createpage = [targetIndex, targetIndex + 1];
  } else if(targetIndex === pageTotal - 1) {
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