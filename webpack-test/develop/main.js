// With proper loader configuration you can load,
// pre-process and insert css directly with require().
// See webpack.config.js for details.  
require('./main.sass')

new Vue({
    el       : '#replace',
    template : '<p>replaced</p>'
})