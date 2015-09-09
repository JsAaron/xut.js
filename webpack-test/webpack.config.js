
module.exports = function(config) {
    var bulid = config.script.name.replace("js", config.script.name)
    return {
        watch:true,
        //页面入口
        entry: config.script.entry,
        //出口文件输出配置
        output: {
            path     : config.script.dest,
            filename : config.script.name
        }

        //页面入口
        // entry: {
        //     app:[config.script.src] 
        //         // vendor: ["jquery"]
        // },
        // 表示这个依赖项是外部lib，遇到require它不需要编译，
        // 且在浏览器端对应window.React
        // externals: {
        //   'vue': 'window.vue'
        // },
        //出口文件输出配置
        // output: {
        //     filename : config.script.name
        // }
        // plugins: [
        //     new webpack.optimize.CommonsChunkPlugin( /* chunkName= */ config.script.name, /* filename= */ bulid)
        // ]
    }

}
