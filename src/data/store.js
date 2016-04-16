import {
    execute
}
from '../util/execute'

/**
 * 数据查询
 * @type {Object}
 */
var Store = {

    statement: {},

    /**
     * novel表ID
     * @type {[type]}
     */
    novelId: null,

    /**
     * ppt总数
     * @type {Number}
     */
    count: 0,

    /**
     * 不存在的数据库表
     * @type {Array}
     */
    collectError: []
}

//热点合集
var dataRet = {};


'Setting,Parallax,Master,Activity,Content,Video,Image,Action,Animation,Widget,Novel,Season,Chapter'.replace(/[^, ]+/g, function(name) {
    Store.statement[name] = 'select * FROM ' + (name) + ' order by _id ASC';
})

/**
 * 查询单一的数据
 * @return {[type]} [description]
 */
Store.oneQuery = function(tableName, callback) {
    execute('select * FROM ' + tableName + ' order by _id ASC', function(sqlRet, collectError) {
        callback(sqlRet);
    })
}

/**
 * 查询总数据
 */
Store.query = function() {
    var i, self = this;
    return $.Deferred(function(dfd) {
        //数据库表重复数据只查询一次
        if (Object.keys(dataRet).length) {
            dfd.resolve(dataRet);
            return;
        }
        //ibook模式，数据库外部注入的
        if (Xut.IBooks.CONFIG) {
            // self.collectError = collectError;
            dfd.resolve(Xut.IBooks.CONFIG.data);
        } else {
            //查询所有数据
            execute(Store.statement, function(sqlRet, collectError) {
                for (i in sqlRet) {
                    dataRet[i] = sqlRet[i];
                }
                dfd.resolve(dataRet);
            })
        }
    }).promise();
}


/**
 * 删除数据
 * @type {[type]}
 */
Store.remove = function(tableName, id) {
    var i, self = this;
    var sql = 'delete from ' + tableName + ' where _id = ' + id;
    return $.Deferred(function(dfd) {
        //查询所有数据
        execute(sql, function(success, failure) {
            if (success) { //成功回调
                dfd.resolve();
            } else if (failure) { //失败回调
                dfd.reject();
            }
        })
    }).promise();
}


export {
    Store
}
