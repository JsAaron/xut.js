/*
计算当前已经创建的页面索引
 */
export function calculationIndex(visualIndex, targetIndex, totalIndex) {
  var i = 0,
    existpage,
    createpage,
    pageIndex,
    ruleOut = [],
    create = [],
    destroy,
    viewFlip;

  //存在的页面
  if (visualIndex === 0) {
    existpage = [visualIndex, visualIndex + 1];
  } else if (visualIndex === totalIndex - 1) {
    existpage = [visualIndex - 1, visualIndex];
  } else {
    existpage = [visualIndex - 1, visualIndex, visualIndex + 1];
  }

  //需要创建的新页面
  if (targetIndex === 0) {
    createpage = [targetIndex, targetIndex + 1];
  } else if (targetIndex === totalIndex - 1) {
    createpage = [targetIndex - 1, targetIndex];
  } else {
    createpage = [targetIndex - 1, targetIndex, targetIndex + 1];
  }

  for (; i < createpage.length; i++) {
    pageIndex = createpage[i];
    //跳过存在的页面
    if (-1 === existpage.indexOf(pageIndex)) {
      //创建目标的页面
      create.push(pageIndex);
    } else {
      //排除已存在的页面
      ruleOut.push(pageIndex);
    }
  }

  _.each(ruleOut, function (ruleOutIndex) {
    existpage.splice(existpage.indexOf(ruleOutIndex), 1)
  });

  destroy = existpage;

  viewFlip = [].concat(create).concat(ruleOut).sort(function (a, b) {
    return a - b
  });

  return {
    'create': create, //创建的页面
    'ruleOut': ruleOut, //排除已存在的页面
    'destroy': destroy, //销毁的页面
    'viewFlip': viewFlip,
    'targetIndex': targetIndex,
    'visualIndex': visualIndex
  }
}


/**
 * 初始化首次范围
 * 动态分页一共有3页
 * 横版
 *   左中右 front middle back
 * 竖版
 *   上中下 front middle back
 * @return {[type]} [description]
 */
export function initPointer(init, totalIndex) {
  const pointer = {}
  if (init === 0) { //首页
    pointer['middleIndex'] = init;
    pointer['backIndex'] = init + 1;
  } else if (init === totalIndex - 1) { //尾页
    pointer['middleIndex'] = init;
    pointer['frontIndex'] = init - 1;
  } else { //中间页
    pointer['frontIndex'] = init - 1;
    pointer['middleIndex'] = init;
    pointer['backIndex'] = init + 1;
  }
  return pointer
}


/*
  转换页码索引
  direction 方向
  pointer 当前页码标示
  [17 18 19]  pagePointer
  [18 19 20]  转换后
  17 销毁
  20 创建
 */
export function getActionPointer(direction, frontIndex, backIndex) {
  let createIndex //创建的页
  let destroyIndex //销毁的页
  switch (direction) {
    case 'prev': //前处理
      createIndex = (frontIndex - 1);
      destroyIndex = (backIndex);
      break;
    case 'next': //后处理
      createIndex = (backIndex + 1);
      destroyIndex = (frontIndex);
      break;
  }
  return { createIndex, destroyIndex }
}
