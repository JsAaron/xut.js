const sqlite = require('../sqlite/index')
const fs = require('fs');
const fsextra = require('fs-extra')
const xxtebook = './src/content/xxtebook.db'
const SQLResult = './src/content/SQLResult.js'
const watch = require('gulp-watch');


const monitor = () => {
    watch(xxtebook, () => {
        console.log('【xxtebook.db is change!】')
        sqlite.resolve(() => {
            console.log('【new xxtebook.db is complete!】')
        })
    })
}

module.exports = (conf, spinner) => {

    if (!fs.existsSync(xxtebook)) {
        console.log('【xxtebook not available!】')
        spinner.stop()
        return
    }

    if (!fs.existsSync(SQLResult)) {
        console.log('【SQLResult.js not available!】')
        sqlite.resolve(monitor)
    } else {
        monitor()
    }
}
