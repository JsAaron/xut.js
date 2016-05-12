/**
 * 创建执行方法
 * @return {[type]} [description]
 */
function createfactory(sql, fn) {
    var key;
    if (typeof sql === 'string') {
        fn(key, sql);
    } else {
        for (key in sql) {
            fn(key, sql[key]);
        }
    }
}

//模拟database获取数据
function executeDB(sql, callback, errorCB, tName) {
    //如果存在生成好的数据文件则直接取
    if (window.SQLResult) {
        if (window.SQLResult[tName]) {
            var data = window.SQLResult[tName],
                SQLResultSetRowList = {};

            SQLResultSetRowList = {
                length: Object.keys(data).length,
                item: function(num) {
                    return data[num];
                }
            };
            callback(SQLResultSetRowList);
        } else {
            errorCB({
                tName: ':table not exist!!'
            });
        }
    } else { //否则分次查询数据
        $.ajax({
            url: Xut.config.onlineModeUrl,
            dataType: 'json',
            data: {
                xxtsql: sql
            },
            success: function(rs) {
                var data = rs,
                    SQLResultSetRowList = {};
                SQLResultSetRowList = {
                    length: rs.length,
                    item: function(num) {
                        return data[num];
                    }
                };
                callback(SQLResultSetRowList);
            },
            error: errorCB
        })
    }
}

//建立sql查询,
export function execute(selectSql, callback) {

    var database = Xut.config.db,
        tableName, //表名
        successResults = {}, //成功的数据
        tempClosure = [], //临时收集器
        collectError = [], //收集错误查询
        buildTotal = function() {
            //如果只有一条
            if (typeof selectSql === 'string') {
                return 1;
            } else {
                return Object.keys(selectSql).length;
            }
        }();


    createfactory(selectSql, function(key, value) {
        //开始执行查询
        createSelect(key || 'results', value);
    })


    /**
     * 创建查询
     */
    function createSelect(key, value) {
        buildTotal--;
        tempClosure.push(executeTemplate(key, value));
        0 === buildTotal && executeBuild();
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
            //successResults['results'] 成功表数据
            //collectError 失败表
            callback(successResults['results'] ?
                successResults['results'] : successResults, collectError);
        }
    }


    //成功后方法
    function success() {
        executeBuild();
    }

    //失败
    function errorCB(error) {
        collectError.push(tableName);
        console.log("数据查询错误 " + error.message, '类型', tableName);
        executeBuild();
    }

    /**
     * 构建执行作用域
     */
    function executeTemplate(tName, sql) {
        return {
            tableName: tName,
            execute: function() {
                //查询
                if (database) {
                    database.transaction(function(tx) {
                        tx.executeSql(sql, [], function(tx, result) {
                            successResults[tName] = result.rows
                        });
                    }, errorCB, success);
                } else {
                    executeDB(sql, function(result) {
                        successResults[tName] = result;
                        success();
                    }, errorCB, tName)
                }
            }
        }
    }

};
