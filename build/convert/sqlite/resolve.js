const sqlite = require('./sqlite3')

var statement = []

'Setting,Parallax,Master,Activity,Content,Video,Image,Action,Animation,Widget,Novel,Season,Chapter '
.replace(/[^, ]+/g, (name) => {
  statement.push(name, 'select * FROM ' + (name) + ' order by _id ASC')
})


let resolve = (databasePath, callback) => {

  //设置数据库路径
  sqlite.init(databasePath);

  //表数量
  var tableCount = statement.length / 2,
    successResults = {}, //成功的数据
    tempClosure = [], //临时收集器
    errorResults = []; //收集错误查询


  function success() {
    executeBuild();
  }


  function errorCB(error) {
    errorResults.push(tableName);
    executeBuild();
  }


  function executeTemplate(tName, sql) {
    return {
      tableName: tName,
      execute: function() {
        sqlite.query(sql, function(row) {
          successResults[tName] = row;
          success();
        }, function() {
          successResults[tName] = {};
          errorCB()
        })
      }
    }
  }


  function executeBuild() {
    if (tempClosure.length) {
      var temp = tempClosure.shift();
      tableName = temp.tableName;
      temp.execute();
    } else {
      sqlite.close();
      // console.log('数据查询结束：正常的数据表' + Object.keys(successResults).length + '个, 空表' + Object.keys(errorResults).length + "个：" + errorResults);
      callback(successResults, errorResults);
    }
  }


  function makeQueryFn(key, value) {
    tempClosure.push(executeTemplate(key, value));
  }


  function createfactory(sql, fn) {
    var i = 0;
    for (var i = 0; i < sql.length; i++) {
      makeQueryFn(sql[i], sql[++i])
    }
  }

  createfactory(statement)
  executeBuild()
}


module.exports = (databasePath, callback) => {
  setTimeout(() => {
    resolve(databasePath, callback)
  }, 0)
}
