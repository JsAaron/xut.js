var fs = require('fs');
var query = require('./query');

var path = "./src/content/"

/**
 * 生成数据文件
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.resolve = (callback) => {
    query.resolve(path + 'xxtebook.db', (successResults) => {
        // 转成字符串;
        var results = JSON.stringify(successResults);
        // //挂在数据
        var stringify = 'window.SQLResult = ' + results;
        fs.writeFileSync(path + 'SQLResult.js', stringify);
        callback && callback();
    })
}
