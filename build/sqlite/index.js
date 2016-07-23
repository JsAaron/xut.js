const fs = require('fs')
const query = require('./resolve')
const fsextra = require('fs-extra')
const path = "./src/content/"

exports.resolve = (callback) => {
    query(path + 'xxtebook.db', (results) => {
        results = JSON.stringify(results)
        var stringify = 'window.SQLResult = ' + results
        fs.writeFileSync(path + 'SQLResult.js', stringify);
        callback();
    })
}
