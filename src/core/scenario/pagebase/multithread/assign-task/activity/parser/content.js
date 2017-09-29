/********************************************************
 **
 ** 数据过滤,去重算法
 **  content数据解析息息相关的方法
 **
 *********************************************************/

import { parseJSON, arrayUnique, $warn } from '../../../../../../util/index'


//零件类型,快速判断
//新增content卷滚区域,所有JS零件content
//类型选择,content有扩充的子类型
//针对零件类型在category字段中的子分类
let widgetType = {}
_.each("jsWidget content svgWidget canvasWidget path".split(" "), function(key, name) {
  widgetType[key] = true
});


/**
 * 类型统一
 * 满足条件统一为零件类型
 */
function unifyType(activity) {
  return widgetType[activity.category] ? "JsWidget" : activity.actType
}


/**
 * 配合出item中相关信息
 * 1.场景信息
 * 2.收费信息
 * @param  {[type]} tokens [description]
 * @return {[type]}        [description]
 */
const itemTokens = ['seasonId', 'Inapp', 'SearchBar', 'BookMarks']

function relatedTokens(relateds, activitys, tokens) {
  let tokenNumber = Object.keys(tokens)

  //快速过滤，如果仅仅只是Animation
  if (tokenNumber.length === 1 && ~tokenNumber.indexOf('Animation')) {
    return
  }

  const eventId = activitys.imageId;

  /*创建事件容器*/
  const createEventContainer = function() {
    if (!relateds.seasonRelated[eventId]) {
      relateds.seasonRelated[eventId] = {}
    }
  }

  itemTokens.forEach(function(type) {
    let values = tokens[type];
    let chapterId
    if (values !== undefined) {
      createEventContainer(); //创建容器
      switch (type) {
        case 'seasonId': //跳转新场景信息
          chapterId = tokens['chapterId'] || tokens['chapter'];
          relateds.seasonRelated[eventId] = {
            seasonId: values[0],
            chapterId: chapterId ? chapterId[0] : ''
          }
          break;
        case 'Inapp': //收费信息,给事件上绑定收费接口,0 收费 1 已收费
          relateds.seasonRelated[eventId]['Inapp'] = values[0];
          break;
        default: //搜索栏,书签
          relateds.seasonRelated[eventId][type] = eventId;
          break
      }
    }
  })
}



/**
 * 分组
 * @return {[type]} [description]
 */
function tokenGroup(tableName, contentIds) {
  let k, keyName, data, contentId, temp = {},
    dataset = [], //数据合集
    idset = [] //id合集

  const query = Xut.data.query;

  _.each(contentIds, function(id) {
    if (data = query(tableName, id)) {
      contentId = data.contentId;
      if (-1 === idset.indexOf(contentId)) {
        idset.push(contentId)
      }
      //合并同个contentId多条动画数据的情况
      keyName = "contentId-" + contentId;
      if (temp[keyName]) {
        temp[keyName].push(data)
      } else {
        temp[keyName] = [data];
      }
    }
  })

  //转成数组格式
  for (k in temp) {
    dataset.push(temp[k])
  }

  return { dataset, idset }
}



/**
 * 解析基本数据
 * Animation
 * Parallax
 */
function parseBaseTokens(tableName, tokenIds) {
  let tokenId;
  let result = {};
  _.each(tableName, function(name) {
    if (tokenId = tokenIds[name]) {
      if (result[name]) {
        $warn({
          type: 'pagebase',
          content: '未处理解析同一个表'
        })
      } else {
        result[name] = tokenGroup(name, tokenId);
      }
    }
  })
  return result;
}



/**
 * 解析itemArray序列,得到对应的id
   需要分解的contentIds合集
     1 动画表数据    Animation
     2 视觉差数据    Parallax
     3 超链接        seasonId
     4 收费          Inapp
     return token = {
        Animation:[1,2,3......]
        Parallax:[4,5,6.....]
        seasonId:[1,2...]
     }
 */
function parseItems(itemArray) {
  if (!itemArray) return;
  let actType
  let tokens = {}
  itemArray = parseJSON(itemArray)
  if (itemArray.length) {
    _.each(itemArray, function(item) {
      actType = item.actType;
      if (!tokens[actType]) {
        tokens[actType] = [];
      }
      tokens[actType].push(item.id);
    })
  } else {
    actType = itemArray.actType;
    //actType: "Animation", id: 14
    //actType: "Inapp", value: 0
    tokens[actType] = [itemArray.id || itemArray.value]
  }
  return tokens
}


/**
 * 分组Content表中对应的多个
 *  1：Animation表
 *  2: Parallax表
 *  3: seed种子合集 就是解析1：Animation表，Parallax表得到的数据
 */
function coreParser(callback, activity, pageType, chapterIndex) {
  var contentIdset,
    parallaxContentIdset,
    seedParallaxs,
    parallaxDataset,
    seedAnimations,
    contentDataset = '',
    eventId = activity.imageId,
    tokens = parseItems(activity['itemArray']) || [],
    /*
      解析Animations,Parallaxs数据
      seed {
          Animation:[dataset,Idset]
          Parallax:[dataset,Idset]
      }
     */
    seed = callback(tokens),

    //判断类型
    type = Object.keys(seed)[0];

  /**
   * 去重事件ID
   * original  原ID合集
   * detection 需要检测去重的ID
   *
   */
  function toRepeatContents(original) {
    if (original && eventId) {
      var indexOf = original.indexOf(eventId);
      if (-1 !== indexOf) {
        original.splice(indexOf, 1);
      }
    }
  }

  switch (type) {
    case 'Container': //容器
      contentIdset = seed.Container;
      toRepeatContents(contentIdset);
      break;
    case 'Contents': //多事件处理
      return seed.Contents;
    default:

      ////////////////////////////////////////
      ///       如果是对象处理，              //
      ///       针对动画表，视觉差表,行为的处理 //
      ////////////////////////////////////////

      /*需要创建的content合集*/
      if (_.keys(seed).length) {

        let seedAnimations = seed.Animation;
        let seedParallaxs = seed.Parallax;

        //页面模式
        if (pageType === 'page') {
          if (seedAnimations) {
            contentIdset = seedAnimations.idset;
            contentDataset = seedAnimations.dataset;
          }
        } else {
          //视觉差存在视觉差表处理
          // console.log(1111,seedAnimations, seedParallaxs)
          //母版的动画数据
          if (seedAnimations) {
            contentIdset = seedAnimations.idset;
            contentDataset = seedAnimations.dataset;
          }
          //母版的视察数据
          if (seedParallaxs) {
            parallaxContentIdset = seedParallaxs.idset;
            parallaxDataset = seedParallaxs.dataset;
          }
        }

        //如果id都存在
        //合并
        if (contentIdset && parallaxContentIdset) {
          contentIdset = contentIdset.concat(parallaxContentIdset)
        }

        //只存在视察
        if (!contentIdset && parallaxContentIdset) {
          contentIdset = parallaxContentIdset;
        }
        toRepeatContents(contentIdset);
      }
      break;
  }


  //创建对象是层次关系
  return {
    'pageType': pageType,
    'activity': activity,
    'imageIds': eventId,
    //data
    'dataset': {
      'animation': contentDataset,
      'parallax': parallaxDataset
    },
    //id
    'idset': {
      'content': contentIdset,
      'parallax': parallaxContentIdset
    }
  }
}


/**
 * 合并,过滤需要处理的content
 *  combineImageIds  可以创建的imageId合集，也就是content的合集,用来绑定自定义事件
 *  createContentIds 可以创建的content合集,过滤合并重复
 */
function toRepeatCombineGroup(compilerActivitys, mixFilterRelated, pageType) {
  var idset,
    contentIds,
    needCreateContentIds,
    imageIds,
    activityRelated,
    parallaxId,
    combineItemIds = [],
    combineImageIds = [],
    i = compilerActivitys.length;

  function pushCache(target, original, callback) {
    var id,
      i = original.length;
    while (i--) {
      id = Number(original[i]);
      target.push(id)
      callback && callback(id);
    }
  }

  while (i--) {
    //开始执行过滤操作
    activityRelated = compilerActivitys[i];
    idset = activityRelated.idset;
    contentIds = idset.content;
    parallaxId = idset.parallax; //浮动类型的对象
    imageIds = activityRelated.imageIds;

    //针对普通content对象
    if (contentIds && contentIds.length) { //如果不为空
      pushCache(combineItemIds, contentIds);
    }

    //视察对象
    if (parallaxId && parallaxId.length) { //如果不为空
      pushCache(combineItemIds, parallaxId);
    }

    //事件合集
    if (imageIds) {
      combineImageIds.push(Number(imageIds))
    }
  }

  //混入外部合并了逻辑
  if (mixFilterRelated && mixFilterRelated.length) {
    _.each(mixFilterRelated, function(data) {
      if (data) {
        combineItemIds = combineItemIds.concat(data)
      }
    })
  }

  //过滤合并多个content数据
  if (combineImageIds.length) {
    needCreateContentIds = arrayUnique(combineItemIds.concat(combineImageIds));
  } else {
    needCreateContentIds = arrayUnique(combineItemIds);
  }

  //排序
  needCreateContentIds = needCreateContentIds.sort(function(a, b) {
    return a - b;
  });

  /**
   * 合并创建信息
   * 需要创建的事件
   * 需要创建的所有对象
   */
  return [combineImageIds, needCreateContentIds];
}



/**
 * 解析解析每一条 Activitys 对应的数据结构
 * @param  {[type]} compileActivitys [description]
 * @param  {[type]} data             [description]
 * @return {[type]}                  [description]
 */
export function contentParser(compileActivitys, pipeData) {

  let activity, hookType, //结果合集
    i = compileActivitys.length,
    pageType = pipeData.pageType,
    chapterIndex = pipeData.chapterIndex,

    /*相关数据合集*/
    activityRelated = [], //Activit合集相关数据信息
    tempRelated = [], //临时数据

    /*解析出来的相关信息*/
    relateds = {
      seasonRelated: {}, //节信息
      containerRelated: [], //容器合集相关数据信息
      eventRelated: {}, //多事件容器合集
      partContentRelated: [] //卷滚conten只创建,不处理行为
    }

  /*创建解析*/
  const createResolve = (callback) => {
    return coreParser((tokens) => {
      return callback(tokens);
    }, activity, pageType, chapterIndex)
  }

  /*类型处理器，除去动画的其余处理类型*/
  const hookResolve = {

    /*单独处理容器类型*/
    Container() {
      relateds.containerRelated.push(
        createResolve(function(tokens) {
          return {
            'Container': tokens['Content']
          }
        })
      )
    },

    /*多事件*/
    Contents() {
      var item;
      if (item = createResolve(function(tokens) {
          return {
            'Contents': [tokens]
          }
        })[0]) {
        //给content注册多个绑定事件
        var eventId = activity.imageId;
        var eventData = {
          'eventContentId': eventId,
          'activityId': activity._id,
          'registers': item['activity'],
          'eventType': activity.eventType,
          'dragdropPara': activity.para1 //拖拽对象
        }
        var isEvt = relateds.eventRelated['eventContentId->' + eventId];
        if (isEvt) {
          isEvt.push(eventData);
        } else {
          relateds.eventRelated['eventContentId->' + eventId] = [eventData]
        }
      }
    },

    /*所有js零件*/
    JsWidget() {
      const scrollContents = parseJSON(activity.itemArray);
      if (_.isArray(scrollContents)) {
        _.each(scrollContents, function(content) {
          relateds.partContentRelated.push(content.id)
        })
      } else {
        relateds.partContentRelated.push(scrollContents.id);
      }
    }
  }

  /**
   * 解析出当前页面的所有的Activit表
   * 1个chpater页面 可以对应多个Activit表中的数据
   * 1 Container 容器类型
   * 2 page 类型
   * 3 parallax 类型
   * 4 Scenario 类型
   * 5 content合集 contents处理
   */
  while (activity = compileActivitys.shift()) {
    //统一类型
    hookType = unifyType(activity)

    /*如果有钩子匹配就先处理钩子*/
    if (!hookResolve[hookType] || (hookResolve[hookType] && hookResolve[hookType](relateds))) {
      /*如果是动画表,视觉差表关联的content类型 ,tokens => itemArray分类数据*/
      let results = createResolve((tokens) => {
        //解析其余tokens
        relatedTokens(relateds, activity, tokens)
        //母版是可能带视觉差的，所以除了Animation还有Parallax
        if (pageType === 'page') {
          return parseBaseTokens(['Animation'], tokens)
        } else if (pageType === 'master') {
          return parseBaseTokens(['Animation', 'Parallax'], tokens)
        }
      })

      //如果有手动触发器,置于最后
      if (activity.imageId) {
        tempRelated.push(results)
      } else {
        activityRelated.push(results)
      }
    }
  }

  //合并排序
  if (tempRelated.length) {
    activityRelated = activityRelated.concat(tempRelated)
    tempRelated = null
  }


  /**
   *  过滤出与创建相关的content合集ID
   *      createEventIds  主content列表 (用来绑定eventType事件)
   *      createContentIds 合并所有content操作后,过滤掉重复的content,得到可以创建的content的ID合集
   */
  let createRelevant = toRepeatCombineGroup(activityRelated, relateds.partContentRelated, pageType)
  let createEventIds = createRelevant[0]
  let createContentIds = createRelevant[1]

  //如果存在过滤器
  if (Xut.CreateFilter.size()) {
    var filterEach = Xut.CreateFilter.each(pipeData.chapterId)
    if (filterEach) {
      filterEach(createEventIds, function(indexOf) {
        createEventIds.splice(indexOf, 1)
      })
      filterEach(createContentIds, function(indexOf) {
        createContentIds.splice(indexOf, 1)
      })
      filterEach = null;
    }
  }

  return _.extend(pipeData, relateds, {
    'createEventIds': createEventIds, //事件ID数
    'createContentIds': createContentIds, //创建的content总ID数
    'createActivitys': activityRelated
  })
}
