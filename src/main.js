require('./main.styl')

// var Vue = require('vue')
 
Vue.component('child', {
    // 声明 props
    props: ['msg'],
    // 该 prop 可以在模板内部被使用，
    // 也可以类似 `this.msg` 这样来赋值
    template: '<span>{{msg}}</span>'
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
