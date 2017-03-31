/**
 * 抽象管理接口
 * @return {[type]} [description]
 */
export class Abstract {

  /**
   * 创建页面合集
   * @return {[type]} [description]
   */
  abstractCreateCollection() {
    this._collection = {}
  }

  /**
   * 增加合集管理
   */
  abstractAddCollection(pageIndex, pageObj) {
    this._collection[pageIndex] = pageObj;
  }

  /**
   * 得到页面合集
   * @return {[type]} [description]
   */
  abstractGetCollection() {
    return this._collection;
  }

  /**
   * 删除合集管理
   * @return {[type]} [description]
   */
  abstractRemoveCollection(pageIndex) {
    delete this._collection[pageIndex];
  }

  /**
   * 销毁合集
   * @return {[type]} [description]
   */
  abstractDestroyCollection() {
    var k, _collection = this._collection;
    for(k in _collection) {
      _collection[k].baseDestroy()
    }
    this._collection = null;
  }

  /**
   * 找到页面对象
   * 1.页面直接pageIndex索引
   * 2.母版通过母版Id索引
   * @return {[type]} [description]
   */
  abstractGetPageObj(pageIndex, pageType) {
    pageType = pageType || this.pageType;
    //模板传递的可能不是页码
    if(pageType === 'master') {
      //如果不是母版ID，只是页码
      if(!/-/.test(pageIndex)) {
        //转化成母版id
        pageIndex = this.converMasterId(pageIndex)
      }
    }
    return this._collection && this._collection[pageIndex]
  }

  /**
   * 合并处理
   * @return {[type]} [description]
   */
  abstractAssistPocess(pageIndex, callback) {
    var pageObj;
    if(pageObj = this.abstractGetPageObj(pageIndex, this.pageType)) {
      if(callback) {
        callback(pageObj)
      } else {
        return pageObj;
      }
    }
  }

  /**
   * 获取页面容器ID
   * chpaterID
   * masterID
   * @return {[type]} [description]
   */
  abstractGetPageId(pageIndex, pageType) {
    var key = pageType === 'page' ? '_id' : 'pptMaster'
    return this.abstractGetPageData(pageIndex, key, pageType)
  }

  /**
   * 获取页面数据
   */
  abstractGetPageData(pageIndex, key, pageType) {
    var pageObj;
    //如果传递key是 pageType
    if(!pageType && key == 'page' || key == 'master') {
      pageType = key;
      key = null;
    }
    if(pageObj = this.abstractGetPageObj(pageIndex, pageType)) {
      return key ? pageObj.chapterData[key] : pageObj.chapterData;
    }
  }

  /**
   * 得到页面的nodes数据
   * @param  {[type]} pageIndex [description]
   * @return {[type]}           [description]
   */
  abstractGetPageNode(pageIndex, pageType) {
    return this.abstractGetPageData(pageIndex, 'nodes', pageType);
  }

  /**
   * 执行辅助对象事件
   * @param  {[type]} activityId  [description]
   * @param  {[type]} currIndex   [description]
   * @param  {[type]} outCallBack [description]
   * @param  {[type]} actionName  [description]
   * @return {[type]}             [description]
   */
  abstractAssistAppoint(activityId, currIndex, outCallBack, actionName) {
    var pageObj;
    if(pageObj = this.abstractGetPageObj(currIndex)) {
      return pageObj.baseAssistRun(activityId, outCallBack, actionName);
    }
  }



}
