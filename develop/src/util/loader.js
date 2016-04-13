/**
 * 资源加载
 * @return {[type]} [description]
 */
var loader = function () {
    return {
        /**入口函数,动态脚本加载
         * @param fileList:           需要动态加载的资源列表
         * @param callback:           所有资源都加载完后调用的回调函数,通常是页面上需要onload就执行的函数
         * @param scope:              作用范围
         * @param preserveOrder:      是否保持脚本顺序
         */
        load: function(fileList, callback, scope, preserveOrder) {
            //过来数组元素
            if (fileList.length && preserveOrder) {
                var temp = [];
                fileList.forEach(function(val, index) {
                    if (val) {
                        temp.push(val);
                    }
                })
                fileList = temp.reverse();
                temp = null;
            }

            var scope = scope || this,
                //var scope =this,//默认作用范围是当前页面
                head = document.getElementsByTagName("head")[0],
                fragment = document.createDocumentFragment(),
                numFiles = fileList.length,
                loadedFiles = 0;

            //加载一个特定的文件从fileList通过索引
            var loadFileIndex = function(index) {
                head.appendChild(scope.buildScriptTag(fileList[index], onFileLoaded));
            };

            /**
             * 调用回调函数,当所有文件都加载完后调用
             */
            var onFileLoaded = function() {
                loadedFiles++;
                //如果当前文件是最后一个要加载的文件，则调用回调函数，否则加载下一个文件
                if (numFiles == loadedFiles && typeof callback == 'function') {
                    callback.call(scope);
                } else {
                    if (preserveOrder === true) {
                        loadFileIndex(loadedFiles);
                    }
                }
            };

            if (preserveOrder === true) {
                loadFileIndex.call(this, 0);
            } else {
                for (var i = 0, len = fileList.length; i < len; i++) {
                    fragment.appendChild(this.buildScriptTag(fileList[i], onFileLoaded));
                }
                head.appendChild(fragment);
            }
        },

        //构造javascript和link 标签
        buildScriptTag: function(filename, callback) {
            var exten = filename.substr(filename.lastIndexOf('.') + 1);
            if (exten == 'js') {
                var script = document.createElement('script');
                script.type = "text/javascript";
                script.src = filename;
                script.onload = callback;
                return script;
            }
            if (exten == 'css') {
                var style = document.createElement('link');
                style.rel = 'stylesheet';
                style.type = 'text/css';
                style.href = filename;
                callback();
                return style;
            }
        }
    };
}();



export {loader}
