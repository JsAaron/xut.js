const rollup = require('../rollup.base.conf')
rollup({
    entry: 'template/test/src/index.js',
    tarDir: 'template/test/src',
    tarDir: 'template/test/dest',
    rollup: 'template/test/dest/rollup.js',
}).then(function() {
	// console.log(123)
})
