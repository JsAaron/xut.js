/********************************************
 * 场景API
 * 数据接口。和电子杂志的数据相关的接口，都在这里。
 ********************************************/

/**
 * 命名前缀
 * @type {String}
 */
const CONTENTPREFIX = 'Content_';

export function extendPresentation(access, $$globalSwiper) {


  /**
   * 获取当前页码
   */
  Xut.Presentation.GetPageIndex = () => $$globalSwiper.getVisualIndex()

  /**
   *  四大数据接口
   *  快速获取一个页面的nodes值
   *  获取当前页面的页码编号 - chapterId
   *  快速获取指定页面的chapter数据
   *  pagebase页面管理对象
   * @return {[type]}            [description]
   */
  _.each([
    "GetPageId",
    "GetPageNode",
    "GetPageData",
    "GetPageBase"
  ], (apiName) => {
    Xut.Presentation[apiName] = (pageType, pageIndex) => {
      return access((manager, pageType, pageIndex) => {
        if (pageIndex === undefined) {
          pageIndex = $$globalSwiper.getVisualIndex() //当前页面
        }
        /*$$-manage-super接口*/
        return manager["$$" + apiName](pageIndex, pageType)
      }, pageType, pageIndex)
    }
  })


  /**
   * 获取页面的总数据
   * 1 chapter数据
   * 2 section数据
   * @return {[type]}
   */
  _.each(["Section", "Page"], (apiName) => {
    Xut.Presentation['GetApp' + apiName + 'Data'] = callback => {
      var i = 0,
        temp = [],
        cps = Xut.data.query('app' + apiName),
        cpsLength = cps.length;
      for (i; i < cpsLength; i++) {
        temp.push(cps.item(i))
      }
      return temp;
    }
  })


  /*
  获取浮动元素的根节点
  1 page
  2 master
   */
  Xut.Presentation.GetFloatContainer = function(pageType) {
    const pageObj = Xut.Presentation.GetPageBase(pageType)
    const containerName = pageType === 'page' ? 'pageContainer' : 'masterContainer'
    if (pageObj.floatGroup[containerName].length) {
      return pageObj.floatGroup[containerName]
    } else {
      Xut.$warn({
        type: 'api',
        content: `浮动根节点没有找到, pageType:${pageType}`,
        color: 'red'
      })
    }
  }

  /**
   * 获取首页的pageId
   * @param {[type]} seasonId [description]
   */
  Xut.Presentation.GetFirstPageId = (seasonId) => {
    var sectionRang = Xut.data.query('sectionRelated', seasonId);
    var pageData = Xut.data.query('appPage');
    return pageData.item(sectionRang.start);
  }

  /**
   * 得到页面根节点
   * li节点
   */
  Xut.Presentation.GetPageRootNode = (pageType) => {
    var obj = Xut.Presentation.GetPageBase(pageType || 'page')
    return obj.$pageNode
  }

  /**
   * 获取页面样式配置文件
   * @return {[type]} [description]
   */
  Xut.Presentation.GetPageStyle = (pageIndex) => {
    let pageBase = Xut.Presentation.GetPageBase(pageIndex)
    if (pageBase && pageBase.getStyle) {
      return pageBase.getStyle
    } else {
      Xut.$warn({
        type: 'api',
        content: `页面Style配置文件获取失败, pageIndex:${pageIndex}`,
        color: 'red'
      })
    }
  }

  /**
   * 获取页码标记
   * 因为非线性的关系，页面都是按chpater组合的
   * page_0
   * page_10
   * 但是每一个章节页面的索引是从0开始的
   * 区分pageIndex
   */
  Xut.Presentation.GetPagePrefix = (pageType, pageIndex) => {
    let pageObj = Xut.Presentation.GetPageBase(pageType, pageIndex);
    return pageObj.chapterIndex;
  }

  /**
   * 得到content的命名规则
   */
  Xut.Presentation.GetContentPrefix = function(pageIndex) {
    return CONTENTPREFIX + Xut.Presentation.GetPagePrefix(pageIndex) + "_";
  }

  /**
   * 获取命名规则
   */
  Xut.Presentation.GetContentName = function(id) {
    if (id) {
      return CONTENTPREFIX + Xut.Presentation.GetPagePrefix() + "_" + id;
    } else {
      return CONTENTPREFIX + Xut.Presentation.GetPagePrefix()
    }
  }

}
