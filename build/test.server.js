const killOccupied = require('./kill-occupied')
const browserSync = require("browser-sync");

const prot = 3000

killOccupied(prot, () => {
    browserSync({
        port: prot,
        server: {
            baseDir: "./src",
            index: "test.html"
        },
        open: true
    })
})
