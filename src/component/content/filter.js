import {
    _set, _get, remove, _save, parseJSON, hash
}
from '../../util/index'

/**
 * content对象的创建过滤器
 * 用于阻断对象的创建
 */
export function contentFilter(filterName) {

    //过滤的节点
    var listFilters = function() {
        var values = getCache();
        var h = hash()
        if (values) {
            //keep the listFilters has no property
            _.each(values, function(v, i) {
                h[i] = v;
            });
        }
        return h;
    }();

    function setCache(listFilters) {
        _save(filterName, listFilters)
    }

    function getCache() {
        var jsonStr = _get(filterName);
        return parseJSON(jsonStr);
    }

    function access(callback, pageId, contentId) {
        //如果是transformFilter,不需要pageIndex处理
        if (filterName === 'transformFilter' && contentId === undefined) {
            contentId = pageId;
            pageId = 'transformFilter'
        }
        return callback(pageId, Number(contentId))
    }

    return {
        add: function(pageId, contentId) {
            access(function(pageId, contentId) {
                if (!listFilters[pageId]) {
                    listFilters[pageId] = [];
                }
                //去重
                if (-1 === listFilters[pageId].indexOf(contentId)) {
                    listFilters[pageId].push(contentId);
                    setCache(listFilters)
                }
            }, pageId, contentId)
        },

        remove: function(pageId, contentId) {
            access(function(pageId, contentId) {
                var target = listFilters[pageId] || [],
                    index = target.indexOf(contentId);
                if (-1 !== index) {
                    target.splice(index, 1);
                    setCache(listFilters);
                }
            }, pageId, contentId)
        },

        has: function(pageId, contentId) {
            return access(function(pageId, contentId) {
                var target = listFilters[pageId];
                return target ? -1 !== target.indexOf(contentId) ? true : false : false;
            }, pageId, contentId)
        },

        /**
         * 创建过滤器
         * @param  {[type]} pageId [description]
         * @return {[type]}        [description]
         */
        each: function(pageId) {
            return access(function(pageId, contentId) {
                var target, indexOf;
                if (target = listFilters[pageId]) {
                    return function(contentIds, callback) {
                        _.each(target, function(ids) {
                            var indexOf = contentIds.indexOf(ids);
                            if (-1 !== indexOf) {
                                callback(indexOf); //如果找到的过滤项目
                            }
                        })
                    }
                }
            }, pageId)
        },

        //过滤器数量
        size: function() {
            return _.keys(listFilters).length;
        },

        empty: function() {
            _remove(filterName);
            listFilters = {};
        }
    }
};