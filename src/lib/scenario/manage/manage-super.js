
/**
 * 抽象管理接口
 * @return {[type]} [description]
 */
export class ManageSuper {

  constructor() {
    //初始化容器
    this._group = {}

    /*数据快速获取接口，首字母直接大写的快捷方式*/
    this.$$GetPageId = this.$$getPageId
    this.$$GetPageNode = this.$$getPageNode
    this.$$GetPageData = this.$$getPageData
    this.$$GetPageObj = this.$$getPageObj
  }

  /**
   * 增加合集管理
   */
  $$addGroup(pageIndex, pageObj) {
    this._group[pageIndex] = pageObj
  }

  /**
   * 得到页面合集
   */
  $$getGroup() {
    return this._group
  }

  /**
   * 删除合集管理
   */
  $$removeGroup(pageIndex) {
    delete this._group[pageIndex]
  }


  /**
   * 销毁合集
   */
  $$destroyGroup() {
    let k, _group = this._group
    for (k in _group) {
      _group[k].baseDestroy()
    }
    this._group = null;
  }


  /**
   * 合并处理
   */
  $$assistPocess(pageIndex, callback) {
    var pageObj;
    if (pageObj = this.$$getPageObj(pageIndex, this.pageType)) {
      if (callback) {
        callback(pageObj)
      } else {
        return pageObj;
      }
    }
  }

  /**
   * 执行辅助对象事件
   */
  $$assistAppoint(activityId, currIndex, outCallBack, actionName) {
    var pageObj;
    if (pageObj = this.$$getPageObj(currIndex)) {
      return pageObj.baseAssistRun(activityId, outCallBack, actionName);
    }
  }


  /////////////////////////////////
  //  "GetPageId",
  //  "GetPageNode",
  //  "GetPageData",
  //  "GetPageObj"
  //////////////////////////////////

  /**
   * 获取页面容器ID
   * chpaterID
   * masterID
   * @return {[type]} [description]
   */
  $$getPageId(pageIndex, pageType) {
    var key = pageType === 'page' ? '_id' : 'pptMaster'
    return this.$$getPageData(pageIndex, key, pageType)
  }

  /**
   * 得到页面的nodes数据
   */
  $$getPageNode(pageIndex, pageType) {
    return this.$$getPageData(pageIndex, 'nodes', pageType);
  }

  /**
   * 找到页面对象
   * 1.页面直接pageIndex索引
   * 2.母版通过母版Id索引
   * @return {[type]} [description]
   */
  $$getPageObj(pageIndex, pageType) {
    pageType = pageType || this.pageType;
    //模板传递的可能不是页码
    if (pageType === 'master') {
      //如果不是母版ID，只是页码
      if (!/-/.test(pageIndex)) {
        //转化成母版id
        pageIndex = this.converMasterId(pageIndex)
      }
    }
    return this._group && this._group[pageIndex]
  }


  /**
   * 获取页面数据
   */
  $$getPageData(pageIndex, key, pageType) {
    var pageObj;
    //如果传递key是 pageType
    if (!pageType && key == 'page' || key == 'master') {
      pageType = key;
      key = null;
    }
    if (pageObj = this.$$getPageObj(pageIndex, pageType)) {
      return key ? pageObj.chapterData[key] : pageObj.chapterData;
    }
  }


}
