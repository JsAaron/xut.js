const fs = require('fs')
const query = require('./query')
const fsextra = require('fs-extra')
const path = "./src/content/"

/**
 * 生成数据文件
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.resolve = (callback) => {
    query.resolve(path + 'xxtebook.db', (successResults) => {
        var results = JSON.stringify(successResults);
        var stringify = 'window.SQLResult = ' + results;
        fs.writeFileSync(path + 'SQLResult.js', stringify);
        callback && callback();
    })
}
