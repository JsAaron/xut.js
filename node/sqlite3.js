//数据库接口库
//
//  https://github.com/kripken/sql.js
//  node-webkit 无法x64编译的处理
//

var fs   = require("fs");
var SQL  = require('sql.js');
var _    = require("./underscore");

var db;


/**
 * 设置数据库路径
 * @param {[type]}   sql  [description]
 * @param {Function} done [description]
 * @param {[type]}   err  [description]
 */
exports.init = function(path) {
    var exists = fs.existsSync(path);
    //文件没有读到
    if (!exists) {
        fs.openSync(path, "w");
    }
    db = new SQL.Database(fs.readFileSync(path));
}


/**
 * 查询表数据
 * @param  {[type]}   sql  [description]
 * @param  {Function} done [description]
 * @return {[type]}        [description]
 */
exports.query = function(sql, done, err) {
    var res = db.exec(sql);
    // //数据域
    var results = {};
    //如果有数据
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

/**
 * 关闭数据库
 * @param  {[type]}   sql  [description]
 * @param  {Function} done [description]
 * @param  {[type]}   err  [description]
 * @return {[type]}        [description]
 */
exports.close = function(sql, done, err) {
    db.close()
}