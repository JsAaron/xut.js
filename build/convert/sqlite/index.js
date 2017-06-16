const fs = require('fs')
const query = require('./resolve')

exports.resolve = (path, url, callback) => {
  query(url, (results) => {
    results = JSON.stringify(results)
    fs.writeFileSync(path + '/SQLResult.js', 'window.SQLResult = ' + results)
    callback();
  })
}
