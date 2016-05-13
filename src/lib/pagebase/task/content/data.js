/********************************************************
 *
 *	数据过滤,去重算法
 *	content数据解析息息相关的方法
 *
 *======================================================*/

import { parseJSON, arrayUnique, contentCache } from '../../../util/index'


//零件类型,快速判断
//新增content卷滚区域,所有JS零件content
//类型选择,content有扩充的子类型
//针对零件类型在category字段中的子分类
var widgetType = {};
_.each("jsWidget content svgWidget canvasWidget path".split(" "), function(key, name) {
    widgetType[key] = true
});


/**
 * 类型统一
 * @param  {[type]} activity [description]
 * @return {[type]}          [description]
 */
function unifyType(activity) {
    //满足条件统一为零件类型
    return widgetType[activity.category] ? "JsWidget" : activity.actType
}


/**
 * 创建事件容器
 * @param  {[type]} eventId [description]
 * @return {[type]}         [description]
 */
function createEventContainer(relateds, eventId) {
    if (!relateds.seasonRelated[eventId]) {
        relateds.seasonRelated[eventId] = {}
    }
}


/**
 * 配合出item中相关信息
 * 1.场景信息
 * 2.收费信息
 * @param  {[type]} tokens [description]
 * @return {[type]}        [description]
 */
function adapterItemArrayRelated(relateds, activitys, tokens) {
    //如果分解出节信息
    var seasonId,
        inAppValue,
        chapterId,
        values,
        eventId = activitys.imageId;

    _.each(['seasonId', 'Inapp', 'SearchBar', 'BookMarks'], function(type) {
        values = tokens[type];
        //如果有值
        if (values !== undefined) {
            //创建容器
            createEventContainer(relateds, eventId);
            switch (type) {
                //跳转新场景信息
                case 'seasonId':
                    chapterId = tokens['chapterId'] || tokens['chapter'];
                    relateds.seasonRelated[eventId] = {
                        seasonId: values[0],
                        chapterId: chapterId ? chapterId[0] : ''
                    };
                    break;
                    //收费信息,给事件上绑定收费接口
                    //0 收费 1 已收费
                case 'Inapp':
                    relateds.seasonRelated[eventId]['Inapp'] = values[0];
                    break;
                default:
                    //搜索栏
                    //书签
                    relateds.seasonRelated[eventId][type] = eventId;
                    break
            }
        }
    })
}


////////////
//解析相关数据 //
//解析每一条 Activitys 对应的数据结构
////////////
function parserRelated(compileActivitys, data) {

    var activitys,
        hookType,
        resultsActivitys, //结果结合
        i        = compileActivitys.length,
        pageType = data.pageType,
        pid      = data.pid,

        /**
         * 相关数据合集
         * @type {Object}
         */
        activityRelated = [], //Activit合集相关数据信息
        tempRelated     = [], //临时数据

        /**
         * 解析出来的相关信息
         * @type {Object}
         */
        relateds = {
            seasonRelated      : {}, //节信息
            containerRelated   : [], //容器合集相关数据信息
            eventRelated       : {}, //多事件容器合集
            partContentRelated : []  //卷滚conten只创建,不处理行为
        };


    /**
     * 创建解析
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    var createResolve = function(callback) {
        return resolveContentToActivity(function(tokens) {
            return callback(tokens);
        }, activitys, pageType, pid)
    }


    /**
     * 类型处理器
     * 除去动画的其余处理类型
     * @type {Object}
     */
    var hookResolve = {

        /**
         * 单独处理容器类型
         * @param  {[type]} relateds [description]
         * @return {[type]}          [description]
         */
        "Container": function() {
            relateds.containerRelated.push(
                createResolve(function(tokens) {
                    return {
                        'Container': tokens['Content']
                    }
                })
            )
        },

        /**
         * 多事件
         * @param  {[type]} relateds [description]
         * @return {[type]}          [description]
         */
        "Contents": function() {
            var item;
            if (item = createResolve(function(tokens) {
                    return {
                        'Contents': [tokens]
                    }
                })[0]) {
                //给content注册多个绑定事件
                var eventId = activitys.imageId;
                var eventData = {
                    'eventContentId' : eventId,
                    'activityId'     : activitys._id,
                    'registers'      : item['activity'],
                    'eventType'      : activitys.eventType,
                    'dragdropPara'   : activitys.para1 //拖拽对象
                }
                var isEvt = relateds.eventRelated['eventContentId->' + eventId];
                if (isEvt) {
                    isEvt.push(eventData);
                } else {
                    relateds.eventRelated['eventContentId->' + eventId] = [eventData]
                }
            }
        },

        /**
         * 所有js零件
         * @param  {[type]} relateds [description]
         * @return {[type]}          [description]
         */
        "JsWidget": function() {
            var scrollContents = parseJSON(activitys.itemArray);
            if (_.isArray(scrollContents)) {
                _.each(scrollContents, function(data) {
                    relateds.partContentRelated.push(data.id)
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
     *
     */
    while (activitys = compileActivitys.shift()) {

        //统一类型
        hookType = unifyType(activitys);

        //类型匹配
        if (!hookResolve[hookType]
            /////////////////
            ///钩子事件
            ////////////////
            || (hookResolve[hookType] && hookResolve[hookType](relateds)) ) {


            /////////////////////
            //Content类型处理 //
            /////////////////////

            //如果是动画表,视觉差表关联的content类型
            resultsActivitys = createResolve(function(tokens) {

                //解析itemArray字段中的相关的信息
                adapterItemArrayRelated(relateds, activitys, tokens);

                //解析表数据
                switch (pageType) {
                    case 'page':
                        return parseTypeRelation(['Animation'], tokens)
                    case 'master':
                        //新增第三个参数，
                        //视觉差支持所有content动画
                        return parseTypeRelation(['Animation', 'Parallax'], tokens);
                }

            });


            //如果有手动触发器,置于最后
            if (activitys.imageId) {
                tempRelated.push(resultsActivitys);
            } else {
                activityRelated.push(resultsActivitys);
            }
        }
    }

    //合并排序
    if (tempRelated.length) {
        activityRelated = activityRelated.concat(tempRelated);
    }

    /**
     *	过滤出与创建相关的content合集ID
     *	return [
     *		createEventIds  主content列表 (用来绑定eventType事件)
     *	    createContentIds 合并所有content操作后,过滤掉重复的content,得到可以创建的content的ID合集
     *	]
     *
     * 	wContentRelated  混入合并的数据
     * partContentRelated 需要过滤的数据
     */
    // console.log(activityRelated.slice(0))
    var createEventIds,
        createContentIds,
        cacheUUID = 'createRelevant-' + data.chapterId,
        createRelevant = contentCache[cacheUUID];

    //创建缓存
    if (!createRelevant) {
        createRelevant = contentCache(cacheUUID,
            toRepeatCombineGroup(activityRelated, relateds.partContentRelated, pageType));
    }

    createEventIds   = createRelevant[0].slice(0);
    createContentIds = createRelevant[1].slice(0);

    //如果存在过滤器
    if (Xut.CreateFilter.size()) {
        var filterEach = Xut.CreateFilter.each(data.chapterId)
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

    return _.extend(data, relateds, {
        'createEventIds'              : createEventIds, //事件ID数
        'createContentIds'            : createContentIds, //创建的content总ID数
        // 'originalCreateContentIds' : createContentIds.slice(0), //保留原始的创建副本
        'createActivitys'             : activityRelated
    });
};


/**************************************************************************
 *
 * 		分组Content表中对应的多个Conte
 *   	1：Animation表
 *    	2: Parallax表
 *     	3: seed种子合集 就是解析1：Animation表，Parallax表得到的数据
 *
 ****************************************************************************/
function resolveContentToActivity(callback, activity, pageType, pid) {
    var animContentIds,
        paraContentIds,
        parallaxRelated,
        parallaxDas,
        animRelated,
        animationDas = '',
        eventId = activity.imageId,
        //需要分解的contentIds合集
        // 1 动画表数据		Animation
        // 2 视觉差数据     Parallax
        // 3 超链接			seasonId
        // 4 收费			Inapp
        tokens = tokenize(activity['itemArray']) || [],
        //解析Animations,Parallaxs数据
        //	seed {
        //		Animation:[data,Ids]
        //		Parallax:[data,Ids]
        //	}
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
        //容器
        case 'Container':
            animContentIds = seed.Container;
            toRepeatContents(animContentIds);
            break;
            //多事件处理
        case 'Contents':
            return seed.Contents;
        default:
            /**
             * 如果是对象处理，
             * 针对动画表，视觉差表,行为的处理
             */
            //需要创建的content合集
            if (_.keys(seed).length) {
                animRelated = seed.Animation;
                parallaxRelated = seed.Parallax;
                //页面模式
                if (pageType === 'page') {
                    if (animRelated) {
                        animContentIds = animRelated.ids;
                        animationDas = animRelated.das;
                    }
                } else {
                    //视觉差存在视觉差表处理
                    // console.log(1111,animRelated, parallaxRelated)
                    //母版的动画数据
                    if (animRelated) {
                        animContentIds = animRelated.ids;
                        animationDas = animRelated.das;
                    }
                    //母版的视察数据
                    if (parallaxRelated) {
                        paraContentIds = parallaxRelated.ids;
                        parallaxDas = parallaxRelated.das;
                    }
                }

                //如果id都存在
                //合并
                if (animContentIds && paraContentIds) {
                    animContentIds = animContentIds.concat(paraContentIds)
                }

                //只存在视察
                if (!animContentIds && paraContentIds) {
                    animContentIds = paraContentIds;
                }
                toRepeatContents(animContentIds);
            }
            break;
    }


    //创建对象是层次关系
    return {
        'pageType': pageType,
        'activity': activity,
        'imageIds': eventId,
        //data
        'seed': {
            'animation': animationDas,
            'parallax': parallaxDas
        },
        //id
        'ids': {
            'content': animContentIds,
            'parallax': paraContentIds
        }
    }
}


/************************************************************************
 *
 *     合并,过滤需要处理的content
 *     combineImageIds  可以创建的imageId合集，也就是content的合集,用来绑定自定义事件
 *     createContentIds 可以创建的content合集,过滤合并重复
 *
 * **********************************************************************/
function toRepeatCombineGroup(compilerActivitys, mixFilterRelated, pageType) {
    var ids,
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
        ids             = activityRelated.ids;
        contentIds      = ids.content;
        parallaxId      = ids.parallax; //浮动类型的对象
        imageIds        = activityRelated.imageIds;

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
 * 解析指定类型数据
 * strengthenAnmin 视觉差增强动画表
 * @return {[type]}
 */
function parseTypeRelation(tableName, tokenIds) {
    var tokenId;
    var itemData = {};
    _.each(tableName, function(tName) {
        if (tokenId = tokenIds[tName]) {
            if (itemData[tName]) {
                console.log('未处理解析同一个表')
            } else {
                itemData[tName] = inGroup(tName, tokenId);
            }
        }
    })
    return itemData;
}


/**
 * 分组
 * @return {[type]} [description]
 */
function inGroup(tableName, contentIds) {
    var k, keyName, data, contentId,
        temp = {},
        das = [],
        ids = [],
        query = Xut.data.query;

    _.each(contentIds, function(id) {
        if (data = query(tableName, id)) {
            contentId = data.contentId;
            if (-1 === ids.indexOf(contentId)) {
                ids.push(contentId)
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
        das.push(temp[k])
    }

    return {
        das: das,
        ids: ids
    }
}


//解析itemArray序列,得到对应的id
function tokenize(itemArray) {
    var itemJson,
        actType,
        anmins = {};
    if (!itemArray) return;
    itemJson = parseJSON(itemArray);
    //解析多个参数
    if (itemJson.length) {
        _.each(itemJson, function(opts) {
            actType = opts.actType;
            if (!anmins[actType]) {
                anmins[actType] = [];
            }
            anmins[actType].push(opts.id);
        })
    } else {
        actType = itemJson.actType;
        anmins[actType] = [];
        //actType: "Animation", id: 14
        //actType: "Inapp", value: 0
        anmins[actType].push(itemJson.id || itemJson.value)
    }
    return anmins;
}


export { parserRelated }
