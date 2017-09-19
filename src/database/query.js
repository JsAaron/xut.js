/**
 * 根据指定的chpaterId解析
 * @return {[type]} [description]
 */
function scenarioChapter(chapterId) {
  var chapterSection = Xut.data.chapterSection;
  var rang = chapterSection['seasonId->' + chapterId];
  return rang;
}



/**
 * 递归分解
 * chpater直接对应页面的ID编码，直接去下标即可
 * waitCreatePointer     需要分解的页面
 */
function parseChapter(createPointer) {

  let points = createPointer.length
  let chapter, key
  let dataChpater = Xut.data.Chapter

  //如果是合集
  if (points) {
    let chapterDataset = []
    while (points--) {
      key = createPointer[points];
      if (chapter = dataChpater.item(key)) {
        chapterDataset.unshift(chapter);
      }
    }
    return chapterDataset
  } else {
    //独立的索引号
    return dataChpater.item(createPointer)
  }

};


/**
 * 解析视觉差的数据
 * @param  {[type]}   data     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function getMasterData(data, callback) {
  var pptMaster = data['pptMaster'];
  var masterData = Xut.data.query('Master', pptMaster)
  makeActivitys(masterData, function(activitys, autoData) {
    callback(masterData, activitys, autoData);
  })
}



/**
 * 解析出页面自动运行的数据
 * autoplay && !Content
 * @param  {[type]} activitys [description]
 * @return {[type]}           [description]
 */
function makeAuto(activityData) {

  if (!activityData || !activityData.length) return

  let sub;
  //自动热点
  const collectAutoBuffers = []

  activityData.forEach((target, b) => {
    //如果是自动播放,并且满足自定义条件
    //并且不是content类型
    if (target.autoPlay && target.actType !== 'Content') {
      //增加note提示信息数据
      // id = target._id
      // key = target.actType ? target.actType + "_" + id : 'showNote_' + id
      sub = {
        'id': target._id,
        'actType': target.actType,
        'category': target.category,
        'autoPlay': target.autoPlay
      }
      collectAutoBuffers.push(sub);
    }
  })

  return collectAutoBuffers.length && collectAutoBuffers
}


/**
 * 混入shownote
 * 组合showNote数据,弹出信息框,也看作一个热点
 * shownote是chater的信息，混入到activity列表中当作每页的对象处理
 * @return {[type]} [description]
 */
function mixShowNote(oneChapter, activityData) {
  if (oneChapter.note) {
    activityData.push(oneChapter);
  }
}


/**
 * 制作activity表的数据
 * chpaters = {
 *     pageIndex-12: Object
 *     pageIndex-13: Object
 *     pageIndex-14: Object
 *  }
 **/
function makeActivitys(chapterData, callback) {
  if (!chapterData) callback()

  const activitys = []
  const chapterId = chapterData._id

  Xut.data.query('Activity', chapterId, 'chapterId', function(item) {
    activitys.push(item)
  })

  //混入文本提示框
  mixShowNote(chapterData, activitys)

  //自动运行的数据
  //解析出每一页自动运行的 Widget,Action,Video数据
  const autoData = makeAuto(activitys);

  callback(activitys, autoData);
}



/**
 * 解析关联的Activity表数据
 * @param  {[type]}   pageData [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function getActivitys(chapterData, callback) {
  makeActivitys(chapterData, function(activitys, autoData) {
    callback(chapterData, activitys, autoData);
  })
}


/**
 * 1 解析chapter页面数据
 * 2 解析对应的Activity数据
 * 3 解析出自动widget数据结构
 * @param  {[type]}   data     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function getPageData(data, callback) {
  let parsePointer = data.pageIndex
  let chapterData = data.pageData
  if (chapterData) {
    getActivitys(chapterData, callback);
  } else {
    //解析章节数据
    parseChapter(parsePointer, function(chapter) {
      //生成chapter数据
      getActivitys(chapter.length ? chapter[0] : chapter, callback)
    })
  }
};

/**
 * 查询接口
 * @param  {[type]}   tableName [description]
 * @param  {[type]}   options   [description]
 * @param  {Function} callback  [description]
 * @return {[type]}             [description]
 */
export function query(tableName, options, callback) {
  switch (tableName) {
    case 'page':
      //得到页面关联的数据
      return getPageData(options, callback);
    case 'master':
      //得到母版关联的数据
      return getMasterData(options, callback);
    case 'chapter':
      //得到chapter表数据
      return parseChapter(options)
    case 'scenarioChapter':
      return scenarioChapter(options);
  }
}
