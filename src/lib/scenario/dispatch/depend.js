import { errorTable } from '../../database/cache'
import { query } from '../../database/query'
import { config } from '../../config/index'

/**
 * 判断是否能整除2
 * @param  {[type]} num [description]
 * @return {[type]}     [description]
 */
export function offsetPage(num) {
  return((num % 2 == 0) ? 'left' : 'right');
}


/**
 * 页面之间关系
 * createIndex 创建的页面
 * visualIndex 可视区页面
 */
export function getDirection(createIndex, visualIndex) {
  let direction
  if(createIndex < visualIndex) {
    direction = 'left'
  } else if(createIndex > visualIndex) {
    direction = 'right'
  } else if(visualIndex == createIndex) {
    direction = 'middle'
  }
  return direction
}

const mixRang = function(pageIndex, start) {
  return pageIndex.map(oldPageIndex => {
    return oldPageIndex - start
  })
}


/**
 * 如果是场景加载，转化页码数
 * 转化按0开始
 * pageIndex 页码
 * visualPageIndex 可见页面chpaterId
 */
export function converVisualPid(options, chapterIndex, visualPageIndex) {
  //转化可视区域值viewPageIndex
  if(options.multiScenario) {
    let sectionRang = options.sectionRang;
    //如果传入的是数组数据
    if(!visualPageIndex && _.isArray(chapterIndex)) {
      return mixRang(chapterIndex, sectionRang.start)
    }
    chapterIndex -= sectionRang.start
    visualPageIndex += sectionRang.start
  } else {
    //pageIndex是数组，并且realPage为空
    if(_.isArray(chapterIndex)) {
      return chapterIndex
    }
  }
  return {
    pageIndex: chapterIndex,
    visualChapterIndex: visualPageIndex
  }
}



/**
 * 计算初始化页码
 */
export function initPointer(targetIndex, pageTotal, multiplePages) {

  var leftscope = 0,
    initPointer = {},
    createPointer = [];

  function setValue(index) {
    if(index.leftIndex !== undefined) {
      initPointer.leftIndex = index.leftIndex;
      createPointer.push(index.leftIndex)
    }
    if(index.currIndex !== undefined) {
      initPointer.currIndex = index.currIndex;
      createPointer.push(index.currIndex)
    }
    if(index.rightIndex !== undefined) {
      initPointer.rightIndex = index.rightIndex;
      createPointer.push(index.rightIndex)
    }
  }

  //如果只有一页 or  非线性,只创建一个页面
  if(pageTotal === 1 || !multiplePages) {
    setValue({
      'currIndex': targetIndex
    })
  } else {
    //多页情况
    if(targetIndex === leftscope) { //首页
      setValue({
        'currIndex': targetIndex,
        'rightIndex': targetIndex + 1
      })
    } else if(targetIndex === pageTotal - 1) { //尾页
      setValue({
        'currIndex': targetIndex,
        'leftIndex': targetIndex - 1
      })
    } else { //中间页
      setValue({
        'currIndex': targetIndex,
        'leftIndex': targetIndex - 1,
        'rightIndex': targetIndex + 1
      })
    }
  }


  /////////////////////////////////////
  ///
  ///启动了双页模式
  ///创建的页面需要修改了索引处理
  ///创建索引0
  /// 变化成 0-1
  ///以此类推
  /////////////////////////////////////
  let createDoublePage = {
    total: 0 //记录总数
  }
  if(config.doublePageMode) {
    let base, left, right
    createPointer.forEach(function(index) {
      if(index === 0) {
        createDoublePage[index] = [0, 1]
        createDoublePage.total += 2
      } else {
        base = index * 2
        left = base
        right = base + 1
        createDoublePage.total += 2;
        (createDoublePage[index] = []).push(left, right)
      }
    })
  }

  return {
    createPointer,
    initPointer,
    createDoublePage
  }
}



/**
  1 加快页面解析，可视区页面最开始创建
  2 双页面页码解析
  3 场景加载模式,计算正确的chapter顺序
  进入 [0,1,2]
  出来
      1 单页面 [1,0,2]
      2 多页面 [2, 3, 0, 1, 4, 5]
 * createSinglePage 需要创建的页面
 * visualPageIndex 可视区页面
 * createDoublePage 多页面索引
 */
export function converChapterIndex(options, createSinglePage, createDoublePage, visualPageIndex) {

  let cloneCreateSinglePage = _.extend([], createSinglePage)

  /*
    保证可视区优先创建
    如果最先创建的的页面不是可视区页面
    就需要切换对应的
   */
  if(cloneCreateSinglePage[0] !== `visualPageIndex`) {
    const indexOf = cloneCreateSinglePage.indexOf(visualPageIndex)
    const less = cloneCreateSinglePage.splice(indexOf, 1)
    cloneCreateSinglePage = less.concat(cloneCreateSinglePage)
  }

  //如果有双页面，那么转化是页面就是这个了
  //而不是传递的createPage单页面
  //[1,0,2] => [2,3,1,2,4,5]
  if(createDoublePage.total) {
    let newCreatePage = []
    cloneCreateSinglePage.forEach(function(pageIndex) {
      let doublePage = createDoublePage[pageIndex]
      if(doublePage.length) {
        newCreatePage.push(doublePage[0])
        if(doublePage[1]) {
          newCreatePage.push(doublePage[1])
        }
      }
    })
    cloneCreateSinglePage = newCreatePage
  }


  //场景加载模式,计算正确的chapter顺序
  //多场景的模式chpater分段后
  //叠加起始段落
  if(options.multiScenario) {
    //需要提前解析数据库的排列方式
    //chpater的开始位置
    const start = options.sectionRang.start
    cloneCreateSinglePage.forEach(function(page, index) {
      cloneCreateSinglePage.splice(index, 1, page + start)
    })
  }

  // [0,1,2] => [73,74,75]
  return cloneCreateSinglePage;
}


/**
 * 页码转化成相对应的chpater表数据
 * @param  {[type]} createPage [description]
 * @return {[type]}            [description]
 */
export function converChapterData(createPage) {
  return query('chapter', createPage);
}


/**
 * 检测是否构建母板模块处理
 * @return {[type]} [description]
 */
export function hasMaster() {
  var table = errorTable()
    //如果没有Master数据,直接过滤
  if(-1 !== table.indexOf('Master') || !Xut.data['Master'] || !Xut.data['Master'].length) {
    return false;
  }
  return true;
}
