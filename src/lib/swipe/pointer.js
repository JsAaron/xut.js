/**
 * 初始化首次范围
 * @return {[type]} [description]
 */
export function initPointer(init, pageTotal) {
  const pointer = {}
  if(init === 0) { //首页
    pointer['currIndex'] = init;
    pointer['rightIndex'] = init + 1;
  } else if(init === pageTotal - 1) { //尾页
    pointer['currIndex'] = init;
    pointer['leftIndex'] = init - 1;
  } else { //中间页
    pointer['leftIndex'] = init - 1;
    pointer['currIndex'] = init;
    pointer['rightIndex'] = init + 1;
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
export function getActionPointer(direction, leftIndex, rightIndex) {
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
