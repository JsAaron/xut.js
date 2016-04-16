import {
    Store as store
}
from './store'

//数据缓存
let dataCache
    //带有场景信息存数
let sectionRelated
    //音频的ActivityId信息;
let videoActivityIdCache


//混入数据到data中
function mixToData(collections) {
    Xut.data = dataCache = collections;
}


//计算数据偏移量
function dataOffset(tableName) {
    var start,
        data = dataCache[tableName];
    if (data.length) {
        if (data.item(0)) {
            if (start = data.item(0)._id) {
                dataCache[tableName].start = start;
            }
        }
    }
}


//转化video的activtiy信息
//因为Video不是靠id关联的 是靠activtiy关联
function videoActivity() {
    var d, activityIds = {},
        data = dataCache.Video;
    _.each(data, function(_, index) {
        d = data.item(index)
        if (d && d.activityId) { //确保activityIdID是有值，这样才是靠activity关联的video,而不是动画的video
            activityIds[d.activityId] = d._id;
        }
    })
    return activityIds;
}


//chpater分段
//转化section信息
//带有场景处理
function conversionSectionRelated() {
    var seasonId, start, length, sid, i, id, seasonInfo, toolbar, Chapters,
        container = {},
        Chapter = dataCache.Chapter,
        l = Chapter.length,
        end = 0;

    //找到指定的season信息
    var findSeasonInfo = function(seasonId) {
        var temp,
            seasonNum = dataCache.Season.length;
        while (seasonNum--) {
            if (temp = dataCache.Season.item(seasonNum)) {
                if (temp._id == seasonId) {
                    return temp;
                }
            }
        }
    }

    for (i = 0; i < l; i++) {
        Chapters = Chapter.item(i);
        if (Chapters) {
            id = Chapters._id - 1; //保存兼容性,用0开头
            seasonId = Chapters.seasonId;
            sid = 'seasonId->' + seasonId;
            //如果不在集合,先创建
            if (!container[sid]) {
                //场景工具栏配置信息
                if (seasonInfo = findSeasonInfo(seasonId)) {
                    toolbar = seasonInfo.parameter;
                }
                container[sid] = {
                    start: id,
                    length: 1,
                    end: id,
                    toolbar: toolbar
                }
            } else {
                container[sid].end = id;
                container[sid].length = (container[sid].length + 1);
            }
        }
    }

    return container;
}


//转化数据结构
function conversion() {

    //数据段标记
    for (var k in dataCache) {
        if (dataCache[k].item) {
            dataOffset(k);
        }
    }


    //============数据特殊处理================

    //vidoe特殊处理，需要记录chapterId范围
    if (dataCache.Video) {
        videoActivityIdCache = videoActivity();
    }


    /**
     * 带有场景处理
     * @type {[type]}
     */
    sectionRelated = conversionSectionRelated();


    /**
     * 标记应用ID
     * @type {[type]}
     */
    dataCache.novelId = store.novelId;

    /**
     * 针对数据库content为空的处理
     * @return {[type]} [description]
     */
    dataCache.preventContent = function() {
        return dataCache.Content.length ? false : true;
    }()

    //===============================================
    //  
    //  查询数据接口
    //
    //  1 video表传递是activityId关联
    //  2 其余表都是传递当前表的id
    //  type 查询ID的类型, 数据的id或者activityId
    //  callback 提供给chapterId使用
    //================================================

    /**
     * 通过ID查询方式
     * @param  {[type]}  tableName [description]
     */
    dataCache.query = function(tableName, id, type, callback) {
        /**
         * 特殊的字段关联
         * 1 activityId
         * 2 chpaterId
         */
        switch (type) {
            /**
             * 通过activityId查询的方式
             *
             * 表名,ID,类型
             * Xut.data.query('Action', id, 'activityId');
             *   
             * @type {[type]}
             */
            case 'activityId':
                var item;
                var activityId = id;
                var data = dataCache[tableName];
                for (var i = 0, len = data.length; i < len; i++) {
                    item = data.item(i);
                    if (item) {
                        if (item[type] == activityId) {
                            return item;
                        }
                    }
                }
                return;

                /**
                 * 通过chpaterId查询方式
                 * parser中的scanActivity过滤处理
                 */
            case 'chapterId':
            case 'seasonId':
                var chapterId = id;
                var data = dataCache[tableName];
                if (data) {
                    var item;
                    for (var i = 0, len = data.length; i < len; i++) {
                        item = data.item(i);
                        if (item) {
                            if (item[type] == chapterId) {
                                callback && callback(item)
                            }
                        }

                    }
                }
                return;
        }


        /**
         * 通过id查询的方式
         */
        switch (tableName) {
            //////////////////////////
            //获取整个一个用的chapter数据 //
            //////////////////////////
            case 'appPage':
                return dataCache.Chapter;

                //////////////////////////
                //获取整个一个用的Section数据 //
                //////////////////////////
            case 'appSection':
                return dataCache.Season;

                //////////////////////
                //如果是是section信息 //
                //////////////////////
            case 'sectionRelated':
                return sectionRelated['seasonId->' + id];

                //////////////
                //如果是音频 //
                //////////////
            case 'Video':
                if (type) {
                    return Query();
                } else {
                    //传递的id是activityId
                    var id = videoActivityIdCache[id];
                    return dataCache.query('Video', id, true);
                }

            default:
                /////////////////
                //默认其余所有表 //
                /////////////////
                return Query();
        }

        //数据信息
        function Query() {
            var data = dataCache[tableName];
            if (id) {
                var index = id - data.start;
                return data.item(index);
            } else {
                return data.length ? data.item(0) : null;
            }
        }
    }


    /**
     * 针对动态表查询
     * 每次需要重新取数据
     * Xut.data.oneQuery('Image',function(){});
     * @return {[type]} [description]
     */
    dataCache.oneQuery = function(tableName, callback) {
        store.oneQuery(tableName, function(data) {
            callback && callback(data);
        })
    }

    /**
     * 删除数据
     * 表名,表ID
     * @return {[type]} [description]
     */
    dataCache.remove = function(tableName, id, success, failure) {
        var dfd = store.remove(tableName, id)
        dfd.done(success, failure)
    }
}


/**
 * 返回错误的表
 * @return {[type]} [description]
 */
export function errorTable() {
    return store.collectError;
}

/**
 *     初始化数据类
    获取ppt总数
 * @return {[type]} [description]
 */
export function createStore() {
    return $.Deferred(function(dfd) {
        store.query().done(function(data) {
            var novel = data.Novel;
            //novel的id
            var novelId = store.novelId = novel.item(0)['_id'];
            //数据转换
            mixToData(data);
            //转化数据结构
            conversion();
            //数据缓存已存在
            // storeMgr.dataCache = true
            dfd.resolve(data.Setting, novel.item(0));
        })
    }).promise();
}
