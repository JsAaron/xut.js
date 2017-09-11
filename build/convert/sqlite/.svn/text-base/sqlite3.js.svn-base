//数据库接口库
//
//  https://github.com/kripken/sql.js
//  node-webkit 无法x64编译的处理
//

const fs = require("fs")
const SQL = require('./sql.js')
const _ = require("underscore")

let db


exports.init = function(path) {
  var exists = fs.existsSync(path);
  if (!exists) {
    fs.openSync(path, "w");
  }
  db = new SQL.Database(fs.readFileSync(path));
}


exports.query = function(sql, done, err) {

  try {
    var res = db.exec(sql);
  } catch (e) {
    console.log('sql不存在', e)
    err();
    return
  }

  var results = {};
  if (res[0] && res[0].values) {
    var columns = res[0].columns
    _.each(res[0].values, function(ret, index) {
        results[index] = {}
        _.each(ret, function(data, i) {
          results[index][columns[i]] = data;
        })
      })
      // global.$log(sql)
    done(results)
  } else {
    err();
  }
}


exports.close = function(sql, done, err) {
  db.close()
}
