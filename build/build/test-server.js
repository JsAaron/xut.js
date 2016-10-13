const fs = require('fs')
const browserSync = require("browser-sync");
const sqlite = require('../sqlite/index')

module.exports = (conf) => {
    return new Promise((resolve, reject) => {
        let complete = () => {
            console.log("【Build complete, Will open the HTTP to test wait for 5 seconds  】")
            resolve()
            conf.server && setTimeout(() => {
                browserSync({
                    port: 3000,
                    server: {
                        baseDir: "./src",
                        index: "test.html"
                    },
                    open: true
                })
            }, 5000)
        }

        // if (!fs.existsSync("./src/content/xxtebook.db")) {
        //     console.log("【Can't test Because the xxtebook does not exist】")
        //     reject()
        //     return
        // }

        if (!fs.existsSync("./src/content/SQLResult.js")) {
            console.log("【Can't test Because the SQLResult does not exist】")
            reject()
            return
        }

        fs.exists("./src/content/SQLResult.js", (result) => {
            if (!result) {
                sqlite.resolve(complete)
                return;
            }

            complete()
        })
    })
}
