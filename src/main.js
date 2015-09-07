require('./main.styl')

// var Vue = require('vue')

Vue.component('param-demo', {
    props: ['size', 'myMessage'], // simple syntax
    compiled: function() {
        console.log(this.size) // -> 100
        console.log(this.myMessage) // -> 'hello!'
    }
})



// var app = new Vue({
//   el: '#app',
//   data: {
//     view: 'page-a'
//   },
//   components: {
//     // 页面1
//     'page-a': function (resolve) {
//       require(['./views/a'], resolve)
//     },
//     // 页面2
//     'page-b': function (resolve) {
//       require(['./views/b'], resolve)
//     }
//   }
// })


// Vue.directive('disable', function (value) {
//     this.el.disabled = !!value
// })

// var vm = new Vue({
//     el: "#demo",
//     data: {
//         disabled: false
//     }
// })

// vm.watch('message',function(){
//   console.log(arguements)
// })


/**
 * Some really crude routing logic here, just for
 * demonstration purposes. The key thing to note here is
 * that we are simply changing the view of the root app -
 * Vue's async components and Webpack's code splitting will
 * automatically handle all the lazy loading for us.
 */

// function route () {
//   app.view = window.location.hash.slice(1) || 'page-a'
// }

// window.addEventListener('hashchange', route)
// window.addEventListener('load', route)
