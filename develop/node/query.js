
var sqlite = require('./sqlite3');


/**
 * 数据库表
 * @return {[type]}       [description]
 */
var statement = [];
'Setting,Activity,Content,Video,Image,Action,Animation,Widget,Novel,Season,Chapter'.replace(/[^, ]+/g, function(name) {
    statement.push(name, 'select * FROM ' + (name) + ' order by _id ASC')
})


function resolve(databasePath,callback) {
    
    //设置数据库路径
    sqlite.init(databasePath);

    //表数量
    var tableCount = statement.length / 2,
        successResults = {}, //成功的数据
        tempClosure = [], //临时收集器
        errorResults = []; //收集错误查询

    //成功后方法
    function success() {
        executeBuild();
    }

    //失败
    function errorCB(error) {
        errorResults.push(tableName);
        executeBuild();
    }

    /**
     * 构建执行作用域
     */
    function executeTemplate(tName, sql) {
        return {
            tableName: tName,
            execute: function() {
                sqlite.query(sql, function(row) {
                    successResults[tName] = row;
                    success();
                }, function(){
                    successResults[tName] = {};    
                    errorCB()
                })
            }
        }
    }

    /**
     * 执行查询
     * @return {[type]} [description]
     */
    function executeBuild() {
        if (tempClosure.length) {
            var temp = tempClosure.shift();
            tableName = temp.tableName;
            temp.execute();
        } else {
            sqlite.close();
            console.log('数据查询结束：正常的数据表' + Object.keys(successResults).length + '个, 空表' + Object.keys(errorResults).length + "个：" + errorResults);

            callback(successResults, errorResults);
        }
    }


    /**
     * 构建query方法
     * @param  {[type]} key   [description]
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    function makeQueryFn(key, value) {
        tempClosure.push(executeTemplate(key, value));
    }

    /**
     * 创建执行方法
     * @return {[type]} [description]
     */
    function createfactory(sql, fn) {
        var i = 0;
        for (var i = 0; i < sql.length; i++) {
            makeQueryFn(sql[i], sql[++i])
        }
    }

    //开始查询
    createfactory(statement)
    executeBuild()
}

/**
 * 分解表数据
 * @return {[type]} [description]
 */
exports.resolve = function(databasePath,callback) {
    setTimeout(function() {
        resolve(databasePath, callback)
    }, 0)
}
