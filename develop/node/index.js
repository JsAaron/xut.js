var fs    = require('fs');
var query = require('./query');

var path  = "./develop/content/xxtebook.db"

/**
 * 生成数据文件
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.resolve = function(callback) {
    query.resolve(path, function(successResults) {
		// 转成字符串;
		var results = JSON.stringify(successResults);
		// //挂在数据
		var stringify = 'window.SQLResult = ' + results;
		fs.writeFileSync('./develop/content/SQLResult.js', stringify);
		callback && callback();
    })
}
