/*!
 * build.js vundefined
 * (c) 2016 Aaron
 * Released under the MIT License.
 */
(function (global, factory) {
     typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
     typeof define === 'function' && define.amd ? define(factory) :
     (factory());
}(this, function () { 'use strict';

     var babelHelpers = {};
     babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
       return typeof obj;
     } : function (obj) {
       return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
     };
     babelHelpers;

     //定义属性
     var def = Object.defineProperty;

     /**
      * 定义一个新的对象
      * 重写属性
      */
     function def$1(obj, key, val, enumerable, writable) {
         def(obj, key, {
             value: val,
             enumerable: enumerable,
             writable: writable,
             configurable: true
         });
     }

     /**
      * 定义访问控制器
      * @return {[type]} [description]
      */
     function defAccess(obj, key, access) {
         def(obj, key, {
             get: access.get,
             set: access.set
         });
     }

     /**
      * 创建一个纯存的hash对象
      */
     function hash() {
         return Object.create(null);
     }

     /**
      * 转化数组
      * @param  {[type]} o [description]
      * @return {[type]}   [description]
      */
     function toNumber(o) {
         return Number(o) || null;
     };

     /**
      * 保证有效值
      * @return {[type]} [description]
      */
     function toEmpty(val) {
         return Number(val);
     }

     /**
      * 简单继承
      * @return {[type]} [description]
      */
     function extend(subClass, superClass) {
         var F = function F() {};
         // 只继承了superClass超级类中的方法并不包括属性（如果是定义在构造函数中，不在prototype里）
         F.prototype = superClass.prototype;
         // 因为F()函数只继承了超级类中prototype中的方法并没有其相关属性，所以subClass.prototype也只有superClass中的方法。　
         var fProto = new F();
         for (var k in fProto) {
             if (subClass.prototype[k]) {
                 console.log('子类与超类的方法名重叠了！');
             } else {
                 subClass.prototype[k] = fProto[k];
             }
         }
         subClass.prototype.constructor = subClass;
         superClass = null;
     }

     /**
      * 全局字体修复
      * @return {[type]} [description]
      */
     function setRootfont() {
         var rootSize = 16;
         switch (window.innerWidth + window.innerHeight) {
             case 3000:
                 //1920+1080
                 //samsumg galaxy s4
                 rootSize = 32;
                 break;
             case 2000:
                 //1280+720
                 //HD Android phone
                 rootSize = 26;
                 break;
             case 2048:
                 //1280+768
                 rootSize = Xut.plat.isIpad ? 16 : 26;
                 break;
             case 1624:
                 //1024+600
                 rootSize = 18;
                 break;
             case 888:
                 //568+320
                 rootSize = 12;
                 break;
             case 800:
                 //480+320
                 rootSize = 14;
                 break;
             case 560:
                 //320+240
                 rootSize = 12;
                 break;
             default:
                 //其他分辨率 取默认值
                 break;
         }
         16 != rootSize && $("html").css("font-size", rootSize + "px");
     }

     function portExtend(object, config) {
         for (var i in config) {
             if (i) {
                 if (object[i]) {
                     console.log('接口方法重复', 'Key->' + i, 'Value->' + object[i]);
                 } else {
                     object[i] = config[i];
                 }
             }
         }
     };

     /**
      * 修正判断是否存在处理
      * @param  {[type]} arr [description]
      * @return {[type]}     [description]
      */
     function arrayUnique(arr) {
         //去重
         if (arr && arr.length) {
             var length = arr.length;
             while (--length) {
                 //如果在前面已经出现，则将该位置的元素删除
                 if (arr.lastIndexOf(arr[length], length - 1) > -1) {
                     arr.splice(length, 1);
                 }
             }
             return arr;
         } else {
             return arr;
         }
     }

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
             load: function load(fileList, callback, scope, preserveOrder) {
                 //过来数组元素
                 if (fileList.length && preserveOrder) {
                     var temp = [];
                     fileList.forEach(function (val, index) {
                         if (val) {
                             temp.push(val);
                         }
                     });
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
                 var loadFileIndex = function loadFileIndex(index) {
                     head.appendChild(scope.buildScriptTag(fileList[index], onFileLoaded));
                 };

                 /**
                  * 调用回调函数,当所有文件都加载完后调用
                  */
                 var onFileLoaded = function onFileLoaded() {
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
             buildScriptTag: function buildScriptTag(filename, callback) {
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

     function pollCss(node, callback) {
         var sheet = node.sheet,
             isLoaded;
         var isOldWebKit = +navigator.userAgent.replace(/.*AppleWebKit\/(\d+)\..*/, "$1") < 536;
         // for WebKit < 536
         if (isOldWebKit) {
             if (sheet) {
                 isLoaded = true;
             }
         }
         // for Firefox < 9.0
         else if (sheet) {
                 try {
                     if (sheet.cssRules) {
                         isLoaded = true;
                     }
                 } catch (ex) {
                     // The value of `ex.name` is changed from "NS_ERROR_DOM_SECURITY_ERR"
                     // to "SecurityError" since Firefox 13.0. But Firefox is less than 9.0
                     // in here, So it is ok to just rely on "NS_ERROR_DOM_SECURITY_ERR"
                     if (ex.name === "NS_ERROR_DOM_SECURITY_ERR") {
                         isLoaded = true;
                     }
                 }
             }

         setTimeout(function () {
             if (isLoaded) {
                 // Place callback here to give time for style rendering
                 callback();
             } else {
                 pollCss(node, callback);
             }
         }, 20);
     }

     function addOnload(node, callback, isCSS, url) {
         var supportOnload = "onload" in node;
         var isOldWebKit = +navigator.userAgent.replace(/.*AppleWebKit\/(\d+)\..*/, "$1") < 536;
         // for Old WebKit and Old Firefox
         if (isCSS) {
             setTimeout(function () {
                 pollCss(node, callback);
             }, 1); // Begin after node insertion
             return;
         }

         if (supportOnload) {
             node.onload = onload;
             node.onerror = function () {
                 onload();
             };
         } else {
             node.onreadystatechange = function () {
                 if (/loaded|complete/.test(node.readyState)) {
                     onload();
                 }
             };
         }

         function onload() {
             // Ensure only run once and handle memory leak in IE
             node.onload = node.onerror = node.onreadystatechange = null;
             // Remove the script to reduce memory leak
             if (!isCSS) {
                 var head = document.getElementsByTagName("head")[0] || document.documentElement;
                 head.removeChild(node);
             }
             // Dereference the node
             node = null;
             callback();
         }
     }

     function request(url, callback, charset) {
         var IS_CSS_RE = /\.css(?:\?|$)/i,
             isCSS = IS_CSS_RE.test(url),
             node = document.createElement(isCSS ? "link" : "script");

         if (charset) {
             var cs = isFunction(charset) ? charset(url) : charset;
             if (cs) {
                 node.charset = cs;
             }
         }
         addOnload(node, callback, isCSS, url);
         if (isCSS) {
             node.rel = "stylesheet";
             node.href = url;
         } else {
             node.async = true;
             node.src = url;
         }
         // For some cache cases in IE 6-8, the script executes IMMEDIATELY after
         // the end of the insert execution, so use `currentlyAddingScript` to
         // hold current node, for deriving url in `define` call
         //currentlyAddingScript = node
         var head = document.getElementsByTagName("head")[0] || document.documentElement;
         var baseElement = head.getElementsByTagName("base")[0];
         // ref: #185 & http://dev.jquery.com/ticket/2709
         baseElement ? head.insertBefore(node, baseElement) : head.appendChild(node);
         //currentlyAddingScript = null
     }

     var _loadfile = request;

     var onlyId;
     var storage = window.localStorage;
     var TAG = 'aaron';

     //如果数据库为写入appid ,则创建
     var createAppid = function createAppid() {
         //添加UUID
         var appId = 'aaron-' + new Date().getDate();
         //写入数据库
         Xut.config.db && Xut.config.db.transaction(function (tx) {
             tx.executeSql("UPDATE Setting SET 'value' = " + appId + " WHERE [name] = 'appId'", function () {}, function () {});
         }, function () {
             //  callback && callback();
         }, function () {
             //  callback && callback();
         });
         return appId;
     };

     //过滤
     var filter = function filter(key) {
         //添加头部标示
         if (onlyId) {
             return key + onlyId;
         } else {
             if (!Xut.config.appUUID) {
                 Xut.config.appUUID = createAppid();
             }
             //子文档标记
             if (SUbCONFIGT && SUbCONFIGT.dbId) {
                 onlyId = "-" + Xut.config.appUUID + "-" + SUbCONFIGT.dbId;
             } else {
                 onlyId = "-" + Xut.config.appUUID;
             }
         }
         return key + onlyId;
     };

     /**
      * 设置localStorage
      * @param {[type]} key [description]
      * @param {[type]} val [description]
      */
     function _set(key, val) {
         var setkey;

         //ipad ios8.3setItem出问题
         function set(key, val) {
             try {
                 storage.setItem(key, val);
             } catch (e) {
                 console.log('storage.setItem(setkey, key[i]);');
             }
         }

         if ((typeof key === 'undefined' ? 'undefined' : babelHelpers.typeof(key)) === 'object') {
             for (var i in key) {
                 if (key.hasOwnProperty(i)) {
                     setkey = filter(i);
                     set(setkey, key[i]);
                 }
             }
         } else {
             key = filter(key);
             set(key, val);
         }
     };

     /**
      * 获取localstorage中的值
      * @param  {[type]} key [description]
      * @return {[type]}     [description]
      */
     function _get(key) {
         key = filter(key);
         return storage.getItem(key);
     };

     /**
      * 删除localStorage中指定项
      * @param  {[type]} key [description]
      * @return {[type]}     [description]
      */
     function _remove$1(key) {
         key = filter(key);
         storage.removeItem(key);
     };

     function _save(name, val) {
         set(name || TAG, JSON.stringify(val));
     }

     /**
      * /解析json字符串
      * @param  {[type]} itemArray [description]
      * @return {[type]}           [description]
      */
     function parseJSON(itemArray) {
         var anminJson;
         try {
             anminJson = JSON.parse(itemArray);
         } catch (error) {
             anminJson = new Function("return " + itemArray)();
         }
         return anminJson;
     }

     /**
      * 提示信息
      * @param  {[type]} require [description]
      * @param  {[type]} exports [description]
      * @param  {[type]} module  [description]
      * @return {[type]}         [description]
      */

     var msgBox = void 0;
     var toolTip = void 0;
     var config$1 = void 0;

     /**
      * 显示提示信息
      */
     function show(opts) {

         var prop = config$1.proportion,
             prefix = Xut.plat.prefixStyle,
             fontsize = (prop.width + prop.height) * 0.5 + 'em',
             content = opts.content,
             time = opts.time || 3000,
             css = {
             'font-size': fontsize,
             'background-image': 'url(images/icons/nodeBig.png)',
             'z-index': 99999,
             'bottom': '1%',
             'left': '5%',
             'padding': '0.2em 0.5em',
             'color': 'white',
             'position': 'absolute'
         };

         if (!toolTip) {
             toolTip = $('#toolTip');
             toolTip.css(css);
             toolTip.css(prefix('border-radius'), '5px');
         } else {
             toolTip.empty().show();
         }

         Xut.nextTick({
             'container': toolTip,
             'content': content
         }, hide);
     }

     /**
      * [模拟alert提示框]
      * @param  {[type]} message [description]
      * @return {[type]}         [description]
      */
     function messageBox$1(message) {

         config$1 = Xut.config;

         var size = config$1.screenSize,
             width = size.width * 0.25,
             Box = msgBox || $('#message'),
             html = '<div class="messageBox" style="width:' + width + 'px;">' + '<div class="messageTex" style="line-height:2">' + message + '</div>' + '<div class="messageBtn" style="line-height:1.5">OK</div>' + '</div>';

         //remove the node when user click
         Box.html(html).show().on("touchend mouseup", function (e) {
             if (e.target.className === 'messageBtn') {
                 this.innerHTML = '';
                 this.style.display = 'none';
             }
         });
     }

     function hide() {
         setTimeout(function () {
             toolTip.hide(1000);
         }, 1500);
     }

     /**
      * 执行脚本注入
      */
     function injectScript(code, type) {
         //过滤回车符号
         var enterReplace = function enterReplace(str) {
             return str.replace(/\r\n/ig, '').replace(/\r/ig, '').replace(/\n/ig, '');
         };
         try {
             new Function("(function(){" + enterReplace(code) + "})")();
         } catch (e) {
             console.log('加载脚本错误', type);
         }
     }

     /**
      * [ 消息框]
      * @param  {[type]} message [description]
      * @return {[type]}         [description]
      */
     function messageBox(message) {
         messageBox$1(message);
     }

     //缩放比
     function fiexdProportion$1(width, height, left, top) {
         var proportion = Xut.config.proportion;
         return {
             width: width * proportion.width,
             height: height * proportion.height,
             left: left * proportion.left,
             top: top * proportion.top
         };
     }

     /*
      * 修复元素的尺寸
      * @type {[type]}
      */

     function reviseSize(results) {
         //不同设备下缩放比计算
         var layerSize = fiexdProportion$1(results.width, results.height, results.left, results.top);
         //新的背景图尺寸
         var backSize = fiexdProportion$1(results.backwidth, results.backheight, results.backleft, results.backtop);

         //赋值新的坐标
         results.scaleWidth = Math.ceil(layerSize.width);
         results.scaleHeight = Math.ceil(layerSize.height);
         results.scaleLeft = Math.floor(layerSize.left);
         results.scaleTop = Math.floor(layerSize.top);

         //背景坐标
         results.scaleBackWidth = Math.ceil(backSize.width);
         results.scaleBackHeight = Math.ceil(backSize.height);
         results.scaleBackLeft = Math.floor(backSize.left);
         results.scaleBackTop = Math.floor(backSize.top);

         return results;
     }

     /**
      *  读取SVG内容
      *  @return {[type]} [string]
      */
     function readFile(path, callback, type) {

         var paths, name, data;
         var config = Xut.config;

         /**
          * ibooks模式 单独处理svg转化策划给你js,加载js文件
          * @param  {[type]} IBOOKSCONFIG [description]
          * @return {[type]}              [description]
          */
         if (Xut.IBooks.CONFIG) {
             paths = config.svgPath().replace("svg", 'js') + path;
             name = path.replace(".svg", '');
             request(paths.replace(".svg", '.js'), function () {
                 data = Xut.IBooks.CONFIG[name];
                 if (data) {
                     callback(data);
                     delete Xut.IBooks.CONFIG[name];
                 } else {
                     callback('脚本加载失败,文件名:' + path);
                 }
             });
             return;
         }

         //如果是js动态文件
         //content的html结构
         if (type === "js") {
             paths = config.svgPath() + path;
             name = path.replace(".js", '');
             request(paths, function () {
                 data = window.HTMLCONFIG[name];
                 if (data) {
                     callback(data);
                     delete window.HTMLCONFIG[name];
                 } else {
                     callback('脚本加载失败,文件名:' + path);
                 }
             });
             return;
         }

         //svg文件
         //游览器模式
         if (Xut.plat.isBrowser) {
             $.ajax({
                 type: 'get',
                 dataType: 'html',
                 url: config.svgPath().replace("www/", "") + path,
                 success: function success(svgContent) {
                     callback(svgContent);
                 },
                 error: function error(xhr, type) {
                     callback('ReadFile数据加载失败');
                     console.log('SVG' + path + '解析出错!');
                 }
             });
         } else {
             //手机模式
             Xut.Plugin.ReadAssetsFile.readAssetsFileAction(config.svgPath() + path, function (svgContent) {
                 callback(svgContent);
             }, function (err) {
                 callback('数据加载失败');
             });
         }
     }

     /****************************************************
      *
      *         	缓存池
      *
      * ***************************************************/
     //创建缓存
     function createCache() {
         var keys = [];

         function cache(key, value) {
             if (keys.push(key) > 20) {
                 delete cache[keys.shift()];
             }
             return cache[key] = value;
         }
         return cache;
     }
     var contentCache = createCache();

     /**
      * 创建执行方法
      * @return {[type]} [description]
      */
     function createfactory(sql, fn) {
         var key;
         if (typeof sql === 'string') {
             fn(key, sql);
         } else {
             for (key in sql) {
                 fn(key, sql[key]);
             }
         }
     }

     //模拟database获取数据
     function executeDB(sql, callback, errorCB, tName) {
         //如果存在生成好的数据文件则直接取
         if (window.SQLResult) {
             if (window.SQLResult[tName]) {
                 var data = window.SQLResult[tName],
                     SQLResultSetRowList = {};

                 SQLResultSetRowList = {
                     length: Object.keys(data).length,
                     item: function item(num) {
                         return data[num];
                     }
                 };
                 callback(SQLResultSetRowList);
             } else {
                 errorCB({
                     tName: ':table not exist!!'
                 });
             }
         } else {
             //否则分次查询数据
             $.ajax({
                 url: Xut.config.onlineModeUrl,
                 dataType: 'json',
                 data: {
                     xxtsql: sql
                 },
                 success: function success(rs) {
                     var data = rs,
                         SQLResultSetRowList = {};
                     SQLResultSetRowList = {
                         length: rs.length,
                         item: function item(num) {
                             return data[num];
                         }
                     };
                     callback(SQLResultSetRowList);
                 },
                 error: errorCB
             });
         }
     }

     //建立sql查询,
     function execute(selectSql, callback) {

         var database = Xut.config.db,
             tableName,
             //表名
         successResults = {},
             //成功的数据
         tempClosure = [],
             //临时收集器
         collectError = [],
             //收集错误查询
         buildTotal = function () {
             //如果只有一条
             if (typeof selectSql === 'string') {
                 return 1;
             } else {
                 return Object.keys(selectSql).length;
             }
         }();

         createfactory(selectSql, function (key, value) {
             //开始执行查询
             createSelect(key || 'results', value);
         });

         /**
          * 创建查询
          */
         function createSelect(key, value) {
             buildTotal--;
             tempClosure.push(executeTemplate(key, value));
             0 === buildTotal && executeBuild();
         }

         /**
          * 执行查询
          * @return {[type]} [description]
          */
         function executeBuild() {
             if (tempClosure.length) {
                 var temp = tempClosure.shift();
                 tableName = temp.tableName;
                 temp.execute();
             } else {
                 //successResults['results'] 成功表数据
                 //collectError 失败表
                 callback(successResults['results'] ? successResults['results'] : successResults, collectError);
             }
         }

         //成功后方法
         function success() {
             executeBuild();
         }

         //失败
         function errorCB(error) {
             collectError.push(tableName);
             console.log("数据查询错误 " + error.message, '类型', tableName);
             executeBuild();
         }

         /**
          * 构建执行作用域
          */
         function executeTemplate(tName, sql) {
             return {
                 tableName: tName,
                 execute: function execute() {
                     //查询
                     if (database) {
                         database.transaction(function (tx) {
                             tx.executeSql(sql, [], function (tx, result) {
                                 successResults[tName] = result.rows;
                             });
                         }, errorCB, success);
                     } else {
                         executeDB(sql, function (result) {
                             successResults[tName] = result;
                             success();
                         }, errorCB, tName);
                     }
                 }
             };
         }
     };

     /**
      * 音频动作
      * @param  {[type]} global [description]
      * @return {[type]}        [description]
      */

     //音频动作
     //替换背景图
     //指定动画
     function Action(options) {

         var element = document.querySelector('#Audio_' + options.audioId);

         //页面从属
         var pageType = element.getAttribute('data-belong');

         //切换背景
         function toggle(linker) {
             element.style.backgroundImage = 'url(' + Xut.conifg.pathAddress + linker + ')';
         }

         function run(ids) {
             ids = ids.split(',');
             Xut.Assist.Run(pageType, ids);
         }

         function stop(ids) {
             ids = ids.split(',');
             Xut.Assist.Stop(pageType, ids);
         }
         return {
             play: function play() {
                 options.startImg && toggle(options.startImg);
                 options.startScript && run(options.startScript);
             },
             pause: function pause() {
                 options.stopImg && toggle(options.stopImg);
                 options.stopScript && stop(options.startScript);
             },
             destroy: function destroy() {
                 element = null;
             }
         };
     }

     /**
      * 音频字幕
      * @param  {[type]} global [description]
      * @return {[type]}        [description]
      */
     //字幕检测时间
     var Interval = 50;

     var getStyles = function getStyles(elem, name) {
         var styles = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
         return styles.getPropertyValue(name);
     };

     /**
      * 字幕类
      * audio  音频实例
      * options 参数
      */
     function Subtitle(audio, options, controlDoms) {

         var visibility;
         this.audio = audio;
         this.options = options;
         this.parents = controlDoms.parents;
         this.ancestors = controlDoms.ancestors;

         this.timer = 0;
         //缓存创建的div节点
         this.cacheCreateDivs = {};

         //保存原始的属性
         var orgAncestorVisibility = this.orgAncestorVisibility = {};
         _.each(this.ancestors, function (node, cid) {
             visibility = getStyles(node, 'visibility');
             if (visibility) {
                 orgAncestorVisibility[cid] = visibility;
             }
         });

         //去重记录
         this.recordRepart = {};
         //phonegap getCurrentPosition得到的音频播放位置不从0开始 记录起始位置
         this.changeValue = 0;

         //快速处理匹配数据
         var checkData = {};
         _.each(options.subtitles, function (data) {
             checkData[data.start + '-start'] = data;
             checkData[data.end + '-end'] = data;
         });
         this.createSubtitle(checkData);
     }

     Subtitle.prototype = {
         /**
          * 运行字幕
          * @return {[type]}
          */
         createSubtitle: function createSubtitle(checkData) {
             var self = this,
                 audio = this.audio,
                 options = this.options;

             //准备创建字幕
             function createAction(audioTime) {
                 _.each(checkData, function (data, key) {
                     var match = key.split('-');
                     //创建动作
                     self.action(match[0], audioTime, match[1], data);
                 });
                 self.createSubtitle(checkData);
             }

             function JudgePlat() {
                 var audioTime;
                 //phonegap
                 if (audio.getCurrentPosition) {
                     audio.getCurrentPosition(function (position) {
                         position = position * 1000;
                         if (!self.changeValue) {
                             self.changeValue = position;
                         }
                         position -= self.changeValue;
                         if (position > -1) {
                             audioTime = Math.round(position);
                         }
                         createAction(audioTime);
                     }, function (e) {
                         console.log("error:" + e);
                         //出错继续检测
                         self.createSubtitle(checkData);
                     });
                 } else if (audio.expansionCurrentPosition) {
                     //扩充的对象
                     audioTime = Math.round(audio.expansionCurrentPosition() * 1000);
                     createAction(audioTime);
                 } else {
                     //html5
                     audioTime = Math.round(audio.currentTime * 1000);
                     createAction(audioTime);
                 }
             }

             self.timer = setTimeout(function () {
                 JudgePlat();
             }, Interval);
         },

         //执行动作
         //创建文本框
         //显示/隐藏
         action: function action(currentTime, audioTime, _action, data) {
             if (audioTime > currentTime - Interval && audioTime < currentTime + Interval) {
                 //创建
                 if (!this.recordRepart[data.start] && _action === 'start') {
                     this.recordRepart[data.start] = true;
                     //创建字幕dom
                     this.createDom(data);

                     //如果是一段字幕结束处理
                 } else if (!this.recordRepart[data.end] && _action === 'end') {
                         this.recordRepart[data.end] = true;
                         // //隐藏
                         var ancestorNode = this.ancestors[data.id];
                         if (ancestorNode) {
                             ancestorNode.style.visibility = "hidden";
                         }
                     }
             }
         },

         createDom: function createDom(data) {

             //屏幕分辨率
             var proportion = Xut.config.proportion;
             var proportionWidth = proportion.width;
             var proportionHeight = proportion.height;
             var screenWidth = Xut.config.screenSize.width;
             var screenHeight = Xut.config.screenSize.height;

             var cid = data.id;
             var parentNode = this.parents[cid];
             var ancestorNode = this.ancestors[cid];
             var preDiv = this.cacheCreateDivs[cid];
             var preP = preDiv && preDiv.children[0];

             //缩放
             var sTop = data.top * proportion.top;
             var sLeft = data.left * proportion.left;
             var sHeight = data.height * proportion.height;
             var sWidth = data.width * proportion.width;

             //转换行高
             var sLineHeight = data.lineHeight ? data.lineHeight : '100%';

             //公用同一个contengid,已经存在
             if (preDiv) {
                 createContent(preDiv, preP, data);
             } else {
                 //创建父元素与子元素
                 var createDiv = document.createElement('div');
                 var createP = document.createElement('p');
                 //设置样式
                 createContent(createDiv, createP, data);
                 createDiv.appendChild(createP); //添加到指定的父元素 

                 parentNode.appendChild(createDiv);

                 //保存引用
                 this.cacheCreateDivs[cid] = createDiv;
             }

             //创建内容
             function createContent(parent, p, data) {
                 createDivStyle(parent, data); //设置div
                 createPStyle(p, data);
             }

             //设置父容器div 字体颜色，大小，类型，位置，文本水平、垂直居中
             function createDivStyle(parent, data) {
                 var cssText = 'position       :absolute; ' + 'display        :table;' + 'vertical-align :center;' + 'top            :{0}px;' + 'left           :{1}px;' + 'height         :{2}px;' + 'width          :{3}px;';

                 parent.style.cssText = String.format(cssText, sTop, sLeft, sHeight, sWidth);
             }

             //内容元素的样式
             function createPStyle(p, data) {

                 var cssText = ' text-align     :center;' + ' display        :table-cell;' + ' vertical-align :middle;' + ' color          :{0};' + ' font-family    :{1};' + ' font-bold      :{2};' + ' font-size      :{3}px;' + ' line-height    :{4}%';

                 //设置字体间距
                 p.style.cssText = String.format(cssText, data.fontColor, data.fontName, data.fontBold, data.fontSize * proportionWidth, sLineHeight);
                 //设置文字内容
                 p.innerHTML = data.title;
             }

             //操作最外层的content节点
             if (ancestorNode) {
                 var ancestorNodeValue = getStyles(ancestorNode, 'visibility');
                 if (ancestorNodeValue != 'visible') {
                     ancestorNode.style.visibility = 'visible';
                 }
             }
         },

         /**
          * 清理音频
          * @return {[type]}
          */
         destroy: function destroy() {
             var self = this;
             _.each(this.cacheCreateDivs, function (node) {
                 node.parentNode.removeChild(node);
             });
             //恢复初始状态
             _.each(this.ancestors, function (node, id) {
                 var orgValue = self.orgAncestorVisibility[id];
                 var currValue = getStyles(node, 'visibility');
                 if (currValue != orgValue) {
                     node.style.visibility = orgValue;
                 }
             });
             this.ancestors = null;
             this.cacheCreateDivs = null;
             this.changeValue = 0;
             this.parents = null;
             if (this.timer) {
                 clearTimeout(this.timer);
                 this.timer = 0;
             }
         }

     };

     var instance = hash(); //存放不同音轨的一个实例
     var html5Audio = void 0;

     /**
      * 音频工厂类
      * @param {[type]} options [description]
      */
     var AudioFactory = Xut.CoreObject.extend({

         //构建之前关数据
         preRelated: function preRelated(trackId, options) {
             //完成end后 外部回调删除这个对象
             //单独调用引用对象
             //传递一个 options.complete
             this.innerCallback = options.innerCallback;
             //仅运行一次
             //外部调用
             this.outerCallback = trackId == 9999 ? options.complete : null;
         },

         //构建之后关数据
         afterRelated: function afterRelated(audio, options, controlDoms) {
             //音频重复播放次数
             if (options.data && options.data.repeat) {
                 this.repeat = Number(options.data.repeat); //需要重复
             }
             //音频动作
             if (options.action) {
                 this.acitonObj = Action(options);
             }
             //字幕对象
             if (options.subtitles && options.subtitles.length > 0) {
                 //创建字幕对象
                 this.subtitleObject = new Subtitle(audio, options, controlDoms);
             }

             //如果有外部回调处理
             if (this.outerCallback) {
                 this.outerCallback.call(this);
             }
         },
         //运行成功失败后处理方法
         //phoengap会调用callbackProcess
         //导致乱了
         callbackProcess: function callbackProcess(sysCommand) {
             if (this.outerCallback) {
                 //外部调用结束
                 this.end();
             } else {
                 //安卓没有重复播放
                 //phonegap未处理
                 if (!Xut.plat.isAndroid && this.repeat) {
                     //如果需要重复
                     this.repeatProcess();
                 } else {
                     //外部清理对象
                     //audioManager中直接删当前对象
                     this.innerCallback(this);
                 }
             }
         },

         //重复处理
         repeatProcess: function repeatProcess() {
             --this.repeat;
             this.play();
         },

         //播放
         play: function play() {
             //flash模式不执行
             if (this.audio && !this.isFlash) {
                 this.status = 'playing';
                 this.audio.play();
             }
             this.acitonObj && this.acitonObj.play();
         },

         //停止
         pause: function pause() {
             this.status = 'paused';
             this.audio.pause();
             this.acitonObj && this.acitonObj.pause();
         },

         //销毁
         end: function end() {
             this.status = 'ended';
             this.audio.end();
             this.audio = null;
             this.acitonObj && this.acitonObj.destroy();
         },

         //相关
         destroyRelated: function destroyRelated() {
             //销毁字幕
             if (this.subtitleObject) {
                 this.subtitleObject.destroy();
                 this.subtitleObject = null;
             }
             //动作
             if (this.acitonObj) {
                 this.acitonObj.destroy();
                 this.acitonObj = null;
             }
         }
     });

     /**
      * 使用PhoneGap的Media播放
      * @param  {string} url 路径
      * @return {[type]}      [description]
      */
     var _Media = AudioFactory.extend({

         init: function init(options, controlDoms) {

             var url = Xut.config.audioPath() + options.url,
                 trackId = options.trackId,
                 self = this,
                 audio;

             //构建之前处理
             this.preRelated(trackId, options);

             //音频成功与失败调用
             audio = new GLOBALCONTEXT.Media(url, function () {
                 self.callbackProcess(true);
             }, function () {
                 self.callbackProcess(true);
             });

             //autoplay
             this.audio = audio;
             this.trackId = trackId;
             this.options = options;

             //相关数据
             this.afterRelated(audio, options, controlDoms);
         },
         //取反
         end: function end() {
             if (this.audio) {
                 this.audio.release();
                 this.audio = null;
             }
             this.status = 'ended';
             this.destroyRelated();
         }
     });

     /**
      * 采用Falsh播放
      * @type {[type]}
      */
     var _Flash = AudioFactory.extend({
         init: function init(options, controlDoms) {
             var trackId = options.trackId,
                 url = Xut.config.audioPath() + options.url,
                 self = this,
                 audio;

             //构建之前处理
             this.preRelated(trackId, options);

             audio = new Audio5js({
                 swf_path: './lib/data/audio5js.swf',
                 throw_errors: true,
                 format_time: true,
                 ready: function ready(player) {
                     this.load(url);
                     //如果调用了播放
                     this.play();
                     self.status = "playing";
                 }
             });

             this.audio = audio;
             this.trackId = trackId;
             this.status = 'playing';
             this.options = options;

             this.isFlash = true;

             //相关数据
             this.afterRelated(audio, options, controlDoms);
         },

         end: function end() {
             if (this.audio) {
                 this.audio.destroy();
                 this.audio = null;
             }
             this.status = 'ended';
             this.destroyRelated();
         }
     });

     /**
      * 使用html5的audio播放
      * @param  {string} url    音频路径
      * @param  {object} options 可选参数
      * @return {object}         [description]
      */
     var _Audio = AudioFactory.extend({
         init: function init(options, controlDoms) {
             var trackId = options.trackId,
                 url = Xut.config.audioPath() + options.url,
                 self = this,
                 audio;

             //构建之前处理
             this.preRelated(trackId, options);

             if (instance[trackId]) {
                 audio = Xut.fix.audio ? Xut.fix.audio : instance[trackId];
                 audio.src = url;
             } else {
                 //create a new Audio instance
                 //如果为ios browser 用Xut.fix.audio 指定src 初始化见app.js
                 if (Xut.fix.audio) {
                     audio = Xut.fix.audio;
                     audio.src = url;
                 } else {
                     audio = new Audio(url);
                 }

                 //更新音轨
                 //妙妙学方式不要音轨处理
                 if (!Xut.fix.audio) {
                     instance[trackId] = audio;
                 }

                 audio.addEventListener('ended', function () {
                     self.callbackProcess();
                 }, false);

                 audio.addEventListener('error', function () {
                     self.callbackProcess();
                 }, false);
             }

             this.audio = audio;
             this.trackId = trackId;
             this.status = 'playing';
             this.options = options;

             //相关数据
             this.afterRelated(audio, options, controlDoms);
         },

         end: function end() {
             if (this.audio) {
                 this.audio.pause();
                 this.audio.removeEventListener('ended', this.callbackProcess, false);
                 this.audio.removeEventListener('error', this.callbackProcess, false);
                 this.audio = null;
             }
             this.status = 'ended';
             this.destroyRelated();
         }
     });

     var createUUID = function createUUID() {
         return UUIDcreatePart(4) + '-' + UUIDcreatePart(2) + '-' + UUIDcreatePart(2) + '-' + UUIDcreatePart(2) + '-' + UUIDcreatePart(6);
     };

     function UUIDcreatePart(length) {
         var uuidpart = "";
         for (var i = 0; i < length; i++) {
             var uuidchar = parseInt(Math.random() * 256, 10).toString(16);
             if (uuidchar.length == 1) {
                 uuidchar = "0" + uuidchar;
             }
             uuidpart += uuidchar;
         }
         return uuidpart;
     }

     /**
      * 使用PhoneGap的 js直接调用 cordova Media播放
      * @param  {string} url 路径
      * @return {[type]}      [description]
      */
     var _cordovaMedia = AudioFactory.extend({

         init: function init(options, controlDoms) {

             var url = Xut.config.audioPath() + options.url,
                 trackId = options.trackId,
                 self = this,
                 audio;

             this.id = createUUID();

             //构建之前处理
             this.preRelated(trackId, options);

             var audio = {
                 startPlayingAudio: function startPlayingAudio() {
                     audioHandler.startPlayingAudio(self.id, url);
                 },
                 pausePlayingAudio: function pausePlayingAudio() {
                     audioHandler.pausePlayingAudio(self.id);
                 },
                 release: function release() {
                     audioHandler.release(self.id);
                 },
                 /**
                  * 扩充，获取位置
                  * @return {[type]} [description]
                  */
                 expansionCurrentPosition: function expansionCurrentPosition() {
                     return getCurrentPosition(self.id);
                 }
             };

             //autoplay
             this.audio = audio;
             this.trackId = trackId;
             this.options = options;

             //相关数据
             this.afterRelated(audio, options, controlDoms);
         },

         //播放
         play: function play() {
             if (this.audio) {
                 this.status = 'playing';
                 this.audio.startPlayingAudio();
             }
             this.acitonObj && this.acitonObj.play();
         },

         //停止
         pause: function pause() {
             this.status = 'paused';
             this.audio && this.audio.pausePlayingAudio();
             this.acitonObj && this.acitonObj.pause();
         },

         //结束
         end: function end() {
             if (this.audio) {
                 this.audio.release();
                 this.audio = null;
             }
             this.status = 'ended';
             this.destroyRelated();
         }
     });

     //apk的情况下
     if (Xut.plat.isAndroid && !Xut.plat.isBrowser) {
         html5Audio = _Media;
     } else {

         //妙妙学的 客户端浏览器模式
         if (MMXCONFIG && audioHandler) {
             html5Audio = _cordovaMedia;
         } else {
             //pc
             html5Audio = _Audio;
         }

         //2015.12.23
         //如果不支持audio改用flash
         // supportAudio(function() {
         //     Xut.Audio = _Flash;
         // });
     }

     Xut.Audio = html5Audio;

     function AudioManager() {

         //动作标示
         var ACTIVIT = 'hot'; //热点音频
         var ANIMATE = 'content'; //动画音频
         var SEASON = 'season'; //节音频

         /**
          * 容器合集
          * 1 pageBox 当前待播放的热点音频
          * 2 playBox 播放中的热点音频集合
          */
         //[type][pageId][queryId]
         var pageBox, playBox;

         function initBox() {
             pageBox = hash();
             //[type][pageId][queryId]
             playBox = hash();
         }

         initBox();

         //===============================================
         //
         //              预装配数据
         //
         //===============================================

         /**
          * 解析数据
          * @param  {[type]} type    [description]
          * @param  {[type]} queryId [description]
          * @return {[type]}         [description]
          */
         function parseData(type, queryId) {
             var data;
             switch (type) {
                 case ANIMATE:
                     data = Xut.data.query('Video', queryId, true);
                     break;
                 case SEASON:
                     data = Xut.data.query('Video', queryId, true);
                     break;
                 default:
                     data = Xut.data.query('Video', queryId);
                     break;
             }
             return data;
         }

         /**
          * 获取父容器
          * @return {[type]} [description]
          */
         function getParentDom(subtitles, pageId, queryId) {
             //字幕数据
             var parentDoms = hash();
             var ancestorDoms = hash();
             var contentsFragment;
             var dom;
             var pageIndex = pageId - 1;
             if (subtitles) {
                 //获取文档节点
                 contentsFragment = Xut.Contents.contentsFragment[pageId];

                 //如果maskId大于9000默认为处理
                 var isMask = pageId > 9000;
                 if (isMask) {
                     //指定页码编号
                     pageIndex = Xut.Presentation.GetPageIndex();
                 }

                 //找到对应的节点
                 _.each(subtitles, function (data) {
                     //'Content_0_1' 规则 类型_页码（0开始）_id
                     if (!parentDoms[data.id]) {
                         dom = contentsFragment['Content_' + pageIndex + '_' + data.id];
                         ancestorDoms[data.id] = dom;
                         var $dom = $(dom);
                         if ($dom.length) {
                             var _div = $dom.find('div').last();
                             if (_div.length) {
                                 parentDoms[data.id] = _div[0];
                             }
                         }
                     }
                 });
             }

             return {
                 parents: parentDoms,
                 ancestors: ancestorDoms
             };
         }

         /**
          * 检测数据是否存在
          * @return {[type]}         [description]
          */
         function checkRepeat(pageId, queryId, type) {
             var pBox = pageBox[type];
             if (pBox && pBox[pageId] && pBox[pageId][queryId]) {
                 return true;
             }
             return false;
         }

         /**
          * 组合热点音频数据结构
          * data, pageId, queryId, type
          * 数据，页码编号，videoId, 查询的类型
          * @return {[type]}         [description]
          */
         function combination(data, pageId, queryId, type, eleName) {
             var tempDoms;
             if (!pageBox[type]) {
                 pageBox[type] = hash();
             }
             if (!pageBox[type][pageId]) {
                 pageBox[type][pageId] = hash();
             }
             //有字幕处理
             if (data.theTitle) {
                 var subtitles = parseJSON(data.theTitle);
             }
             //配置音频结构
             return pageBox[type][pageId][queryId] = {
                 'trackId': data.track, //音轨
                 'url': data.md5, //音频名字
                 'subtitles': subtitles,
                 'audioId': queryId,
                 'data': data
             };
         }

         /**
          * 装配音频数据
          * @param  {int} pageId    页面id或节的分组id
          * @param  {int} queryId   查询id,支持activityId,audioId
          * @param  {string} type   音频来源类型[动画音频,节音频,热点音频]
          */
         function deployAudio(pageId, queryId, type, actionData) {
             //避免复重查询
             if (checkRepeat(pageId, queryId, type)) {
                 return false;
             }
             //解析合集数据
             var data = parseData(type, queryId);
             //存在音频文件
             if (data && data.md5) {
                 //新的查询
                 var ret = combination(data, pageId, queryId, type, actionData);
                 //混入新的动作数据
                 //2015.9.24
                 //音频替换图片
                 //触发动画
                 if (actionData) {
                     _.extend(ret, actionData, {
                         action: true //快速判断存在动作数据
                     });
                 }
             }
         }

         //===============================================
         //
         //              初始化加载音频
         //
         //===============================================

         /**
          * 检查要打断的音频
          * @param  {[type]} type    音频类型
          * @param  {[type]} pageId  [description]
          * @param  {[type]} queryId [description]
          * @param  {[type]} pageBox [description]
          * @return {boolen}         不打断返回true,否则返回false
          */
         function checkBreakAudio(type, pageId, queryId, pageBox) {
             var playObj = playBox[type][pageId][queryId],
                 trackId = pageBox.trackId,
                 _trackId = playObj.trackId;

             //如果是节音频，且地址相同，则不打断
             if (type == SEASON && playObj.url == pageBox.url) {
                 return true;
             }

             //如果要用零音轨||零音轨有音乐在播||两音轨相同
             //则打断
             if (trackId == 0 || _trackId == 0 || trackId == _trackId) {
                 playObj.end();
                 delete playBox[type][pageId][queryId];
             }
             return false;
         }

         /**
          * 播放音频之前检查
          * @param  {int} pageId    [description]
          * @param  {int} queryId    查询id
          * @param  {string} type    决定video表按哪个字段查询
          * @return {object}         音频对象/不存在为null
          */
         function preCheck(pageId, queryId, type) {
             var t,
                 p,
                 q,
                 playObj = pageBox[type][pageId][queryId],
                 seasonAudio = null;
             for (t in playBox) {
                 for (p in playBox[t]) {
                     for (q in playBox[t][p]) {
                         if (checkBreakAudio(t, p, q, playObj)) {
                             seasonAudio = playBox[t][p][q];
                         }
                     }
                 }
             }
             return seasonAudio;
         }

         /**
          * 加载音频对象
          * @return {[type]}         [description]
          */
         function loadAudio(pageId, queryId, type) {
             //找到页面对应的音频
             //类型=》页面=》指定音频Id
             var pageObj = pageBox[type][pageId][queryId];
             //检测
             var seAudio = preCheck(pageId, queryId, type);

             //播放音频时关掉视频
             Xut.VideoManager.clearVideo();

             //构建播放列表
             if (!playBox[type]) {
                 playBox[type] = hash();
             }
             if (!playBox[type][pageId]) {
                 playBox[type][pageId] = hash();
             }
             //假如有字幕信息
             //找到对应的文档对象
             if (pageObj.subtitles) {
                 var tempDoms = getParentDom(pageObj.subtitles, pageId, queryId);
             }

             //播放完成处理
             pageObj.innerCallback = function (audio) {
                 if (playBox[type] && playBox[type][pageId] && playBox[type][pageId][queryId]) {
                     audio.end();
                     delete playBox[type][pageId][queryId];
                 }
             };

             //new播放对象
             var newObj = seAudio || new html5Audio(pageObj, tempDoms);
             newObj.play();

             //存入播放对象池
             playBox[type][pageId][queryId] = newObj;
         }

         /**
          * 交互点击
          * @param  {int} pageId     [description]
          * @param  {int} queryId    [description]
          * @param  {string} type    ACTIVIT
          * @return {[type]}         [description]
          */
         function loadTiggerAudio(pageId, queryId, type) {
             var playObj, status;
             if (playBox[type] && playBox[type][pageId] && playBox[type][pageId][queryId]) {
                 playObj = playBox[type][pageId][queryId];
                 status = playObj.audio ? playObj.status : null;
             }
             switch (status) {
                 case 'playing':
                     playObj.pause();
                     break;
                 case 'paused':
                     playObj.play();
                     break;
                 default:
                     loadAudio(pageId, queryId, type);
                     break;
             }
         }

         /**
          * 清理全部音频
          * @return {[type]} [description]
          */
         function removeAudio() {
             var flag = false,
                 t,
                 p,
                 a;
             for (t in playBox) {
                 for (p in playBox[t]) {
                     for (a in playBox[t][p]) {
                         playBox[t][p][a].end();
                         flag = true;
                     }
                 }
             }
             initBox();
             return flag;
         }

         var out = {

             ///////////////////
             //1 独立音频处理, 音轨/跨页面 //
             //2 动画音频,跟动画一起播放与销毁
             ///////////////////

             //自动播放触发接口
             autoPlay: function autoPlay(pageId, activityId, actionData) {
                 deployAudio(pageId, activityId, ACTIVIT, actionData);
                 loadAudio(pageId, activityId, ACTIVIT);
             },

             //手动触发
             trigger: function trigger(pageId, activityId, actionData) {
                 deployAudio(pageId, activityId, ACTIVIT, actionData);
                 loadTiggerAudio(pageId, activityId, ACTIVIT);
             },

             //动画音频触发接口
             contentAudio: function contentAudio(pageId, audioId) {
                 deployAudio(pageId, audioId, ANIMATE);
                 loadAudio(pageId, audioId, ANIMATE);
             },

             //节音频触发接口
             seasonAudio: function seasonAudio(seasonAudioId, audioId) {
                 deployAudio(seasonAudioId, audioId, SEASON);
                 loadAudio(seasonAudioId, audioId, SEASON);
             },

             //挂起音频
             hangUpAudio: function hangUpAudio() {
                 var t, p, a;
                 for (t in playBox) {
                     for (p in playBox[t]) {
                         for (a in playBox[t][p]) {
                             playBox[t][p][a].pause();
                         }
                     }
                 }
             },

             //销毁动画音频
             clearContentAudio: function clearContentAudio(pageId) {
                 if (!playBox[ANIMATE] || !playBox[ANIMATE][pageId]) {
                     return false;
                 }
                 var playObj = playBox[ANIMATE][pageId];
                 if (playObj) {
                     for (var i in playObj) {
                         playObj[i].end();
                         delete playBox[ANIMATE][pageId][i];
                     }
                 }
             },

             //清理音频
             clearAudio: function clearAudio(pageId) {
                 if (pageId) {
                     //如果只跳槽关闭动画音频
                     out.clearContentAudio(pageId);
                 } else {
                     removeAudio(); //多场景模式,不处理跨页面
                 }
             }

         };

         return out;
     };

     Xut.AudioManager = AudioManager();

     /**
      * 视频和网页模块（统一整合到VideoClass里面了）
      * 这里有四种播放器:
      *    1：基于html5原生实现的video标签 for ios
      *    2：基于phoneGap插件实现的media  for android
      *    3: 基于videoJS用flash实现的播放 for pc
      *    4: 用于插入一个网页的webview
      */

     var VideoPlayer = null;
     var noop$1 = function noop() {};
     var supportVideo = function () {
         var video = document.createElement('video'),
             type = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
         return !!video.canPlayType && "probably" == video.canPlayType(type);
     }();
     var supportFlash = function () {
         var i_flash = false;

         if (navigator.plugins) {
             for (var i = 0; i < navigator.plugins.length; i++) {
                 if (navigator.plugins[i].name.toLowerCase().indexOf("shockwave flash") != -1) {
                     i_flash = true;
                 }
             }
         }
         return i_flash;
     }();
     //移动端浏览器平台
     if (Xut.plat.isBrowser) {
         VideoPlayer = Video5;
     } else {
         //检测平台
         if (Xut.plat.isIOS || top.EduStoreClient) {
             //如果是ibooks模式
             if (Xut.IBooks.Enabled) {
                 VideoPlayer = VideoJS;
             } else {
                 //如果是ios或读酷pc版则使用html5播放
                 VideoPlayer = Video5;
             }
         } else if (Xut.plat.isAndroid) {
             //android平台
             VideoPlayer = _Media$1;
         }
     }

     /**
      * @param {[type]} options   [description]
      *   options.videoId;
      *   options.pageId;
      *   options.pageUrl;
      *   options.left;
      *   options.top;
      *   options.width;
      *   options.height;
      *   options.padding;
      *   options.category;
      * @param {[type]} container 视频元素容器
      */

     function VideoClass(options, container) {
         options.container = container;
         if ('video' == options.category) {
             this.video = VideoPlayer(options);
         } else if ('webpage' == options.category) {
             this.video = WebPage(options);
         } else {
             console.log('options.category must be video or webPage ');
         }
     }

     VideoClass.prototype = {
         play: function play() {
             //隐藏工具栏
             Xut.View.Toolbar("hide");
             this.video.play();
         },
         stop: function stop() {
             //显示工具栏
             Xut.View.Toolbar("show");
             this.video.stop();
         },
         close: function close() {
             this.video.close();
         }
     };

     // 网页
     function WebPage(options) {

         var pageUrl = options.pageUrl;

         //跳转app市场
         //普通网页是1 
         //跳转app市场就是2
         if (options.hyperlink == 2) {
             //跳转到app市场
             window.open(pageUrl);
             //数据统计
             $.get('http://www.appcarrier.cn/index.php/adplugin/recordads?aid=16&esbId=ios');
         } else {

             var padding = options.padding || 0,
                 width = options.width,
                 height = options.height,
                 videoId = options.videoId,
                 left = options.left,
                 top = options.top,
                 $videoNode,
                 eleWidth,
                 eleHeight;

             if (padding) {
                 eleWidth = width - 2 * padding;
                 eleHeight = height - 2 * padding;
             } else {
                 eleWidth = width;
                 eleHeight = height;
             }

             $videoNode = $('<div id="videoWrap_' + videoId + '" style="position:absolute;left:' + left + 'px;top:' + top + 'px;width:' + width + 'px;height:' + height + 'px;z-index:' + Xut.zIndexlevel() + '">' + '<div style="position:absolute;left:' + padding + 'px;top:' + padding + 'px;width:' + eleWidth + 'px;height:' + eleHeight + 'px;">' + '<iframe src="' + pageUrl + '" style="position:absolute;left:0;top:0;width:100%;height:100%;"></iframe>' + '</div>' + '</div>');

             options.container.append($videoNode);
         }

         function play() {
             $videoNode && $videoNode.show();
         }

         function stop() {
             $videoNode && $videoNode.hide();
         }

         function close() {
             if ($videoNode) {
                 $videoNode.remove();
                 $videoNode = null;
             }
         }

         return {
             play: play,
             stop: stop,
             close: close
         };
     }

     /**
      * 安卓phonegap播放器
      * @param  {[type]} options [description]
      * @return {[type]}         [description]
      */
     function _Media$1(options) {
         var url = MMXCONFIG ? options.url : options.url.substring(0, options.url.lastIndexOf('.')),
             width = options.width,
             height = options.height,
             top = options.top || 0,
             left = options.left || 0;

         function play() {
             //var calculate = Xut.config.proportion.calculateContainer();
             //top += Math.ceil(calculate.top);
             //left += Math.ceil(calculate.left);
             Xut.Plugin.VideoPlayer.play(function () {
                 //成功回调
             }, function () {
                 //失败回调
             }, Xut.config.videoPath() + url, 1, left, top, height, width);
         }

         function close() {
             Xut.Plugin.VideoPlayer.close();
         }

         play();

         return {
             play: play,
             stop: close,
             close: close
         };
     }

     /**
      *   html5的video播放器
      *   API :
      *   play();播放
      *   stop();    //停止播放并隐藏界面
      *   destroy(); //清除元素节点及事件绑定
      *  demo :
      *  var video = new Video({url:'1.mp4',width:'320',...});
      *  video.play();
      */

     function Video5(options) {

         var container = options.container || $('body'),
             url = Xut.config.videoPath() + options.url,
             width = options.width,
             height = options.height,
             top = options.top,
             left = options.left,
             zIndex = options.zIndex,

         /*创建播放器*/
         $videoWrap = $('<div></div>');

         var $video = $(document.createElement('video'));

         //音频对象
         var video = $video[0];

         video.play();

         $video.css({
             width: width,
             height: height
         }).attr({
             'src': url,
             'controls': 'controls',
             'autoplay': 'autoplay'
         });

         $videoWrap.append($video).css({
             position: 'absolute',
             'z-index': -1,
             top: top,
             left: left,
             width: 0,
             height: 0
         });

         //播放
         function play() {
             $videoWrap.show();
             video.play();
         }

         //停止
         function stop() {
             video.pause();
             //复位视频
             if (video.duration) {
                 video.currentTime = 0.01;
             }
             //在全屏时无法隐藏元素,须先退出
             //this.video.webkitExitFullScreen();
             $videoWrap.hide();

             //用于启动视频
             if (options.startBoot) {
                 options.startBoot();
                 destroy();
             }
         }

         function error() {
             //用于启动视频
             if (options.startBoot) {
                 options.startBoot();
                 destroy();
             }
         }

         /**
          * 防止播放错误时播放界面闪现
          * @return {[type]} [description]
          */
         function start() {
             $videoWrap.css({
                 width: width + 'px',
                 height: height + 'px',
                 zIndex: zIndex
             });
         }

         //销毁
         function destroy() {
             video.removeEventListener('ended', stop, false);
             video.removeEventListener('error', error, false);
             video.removeEventListener('loadeddata', start, false);
             video.removeEventListener('webkitendfullscreen', stop, false);
             $videoWrap.hide().remove();
         }

         container.append($videoWrap);

         video.addEventListener('ended', stop, false);
         video.addEventListener('error', error, false);
         video.addEventListener('loadeddata', start, false);
         video.addEventListener('webkitendfullscreen', stop, false);

         return {
             play: play,
             stop: stop,
             close: destroy
         };
     };

     /**
      * https://github.com/videojs/video.js/blob/master/docs/guides/setup.md
      * 基于video.js的web播放器,在pc端flash优先
      * @param {[type]} options [description]
      */

     function VideoJS(options) {
         var container = options.container || $('body'),
             videoId = options.videoId,
             url = Xut.config.videoPath() + options.url,
             width = options.width,
             height = options.height,
             zIndex = options.zIndex,
             top = options.top,
             left = options.left,
             video,
             source,
             player,
             api;

         video = document.createElement('video');
         source = document.createElement('source');
         source.setAttribute('src', url);
         source.setAttribute('type', 'video/mp4');
         video.id = 'video_' + videoId;
         video.className = "video-js vjs-sublime-skin";
         video.appendChild(source);
         container.append(video);
         //指定本地的swf地址取代网络地址
         videojs.options.flash.swf = "lib/data/video-js.swf";

         var clear = function clear() {
             //结束后清理自己
             Xut.VideoManager.removeVideo(options.pageId);
         };

         //videojs是videojs定义的全局函数
         player = videojs(video, {
             //视频引擎顺序,位置排前面的优先级越高
             "techOrder": ["html5", "flash"],
             //预加载
             "preload": "auto",
             //是否有控制条
             "controls": true,
             "autoplay": true,
             "width": width,
             "height": height,
             //播放元素相关设置
             children: {
                 //暂停时是否显示大大的播放按钮
                 bigPlayButton: false,
                 //是否显示错误提示
                 errorDisplay: false,
                 //是否显示视频快照
                 posterImage: false,
                 //是否显示字幕
                 textTrackDisplay: false
             },
             //控制条相关设置
             controlBar: {
                 //是否显示字幕按钮
                 captionsButton: false,
                 chaptersButton: false,
                 liveDisplay: false,
                 //是否显示剩余时间
                 remainingTimeDisplay: false,
                 //是否显示子标题按钮
                 subtitlesButton: false,
                 //是否显示回放菜单按钮
                 playbackRateMenuButton: false,
                 //是否显示时间分隔符"/"
                 timeDivider: false,
                 //是否显示当前视频的当前时间值
                 currentTimeDisplay: false,
                 //是否显示视频时长
                 durationDisplay: false
             }
         }, function () {
             //可以播放时提升层级，防止闪现
             this.on('canplay', function () {
                 wrap.style.zIndex = zIndex;
             });

             //播放完毕后自动关闭
             this.on('ended', function () {
                 //结束后清理自己
                 clear();
             });

             this.on('error', function () {
                 clear();
             });

             //因为没有关闭按钮,又不想自己做,就把全屏变成关闭好了.
             this.on("touchend mouseup", function (e) {
                 var className = e.target.className.toLowerCase();
                 if (-1 != className.indexOf('vjs-fullscreen-control')) {
                     clear();
                 }
             });
         });

         //修正视频样式
         var wrap = player.el(),
             videoElement = wrap.children[0];
         wrap.style.left = left + 'px';
         wrap.style.top = top + 'px';
         wrap.style.zIndex = -1;

         api = {
             play: noop$1,

             stop: function stop() {
                 player.stop();
             },

             close: function close() {
                 player && player.dispose();
                 player = null;
             }
         };

         return api;
     }

     Xut.Video5 = Video5;

     Xut.Video = VideoClass;

     /*
         视频和远程网页管理模块
     */

     //综合管理video, webpage
     function VideoManager() {
         this.pageBox = {}; //当前页面包含的视频数据
         this.playBox = {}; //播放过的视频数据 （播放集合）
     }

     /**
      *  参数:
      *    pageId    就是chapterId,对应每一个页面
      *    videoId   对应每一个视频热点的ID
      *    container 容器
      */

     VideoManager.prototype = {

         //=============消息接口================
         //

         //自动播放
         autoPlay: function autoPlay(pageId, activityId, container) {
             this.initVideo.apply(this, arguments);
         },

         //手动播放
         trigger: function trigger(pageId, activityId, container) {
             this.initVideo.apply(this, arguments);
         },

         //=================视频调用===========================

         //触发视频
         initVideo: function initVideo(pageId, activityId, container) {
             //解析数据
             this.parseVideo(pageId, activityId);
             //调用播放
             this.loadVideo(pageId, activityId, container);
         },

         //=================视频数据处理===========================

         //处理重复数据
         // 1:pageBox能找到对应的 videoId
         // 2:重新查询数据
         parseVideo: function parseVideo(pageId, activityId) {
             //复重
             if (this.checkRepeat(pageId, activityId)) {
                 return;
             }
             var data = Xut.data.query('Video', activityId);
             //新的查询
             this.deployVideo(data, pageId, activityId);
         },

         //检测数据是否存在
         checkRepeat: function checkRepeat(pageId, activityId) {
             var chapterData = this.pageBox[pageId];
             //如果能在pageBox找到对应的数据
             if (chapterData && chapterData[activityId]) {
                 return true;
             }
             return false;
         },

         //配置视频结构
         deployVideo: function deployVideo(data, pageId, activityId) {
             var proportion = Xut.config.proportion,
                 screenSize = Xut.config.screenSize,
                 videoInfo = {
                 'pageId': pageId,
                 'videoId': activityId,
                 'url': data.md5,
                 'pageUrl': data.url,
                 'left': data.left * proportion.left || 0,
                 'top': data.top * proportion.top || 0,
                 'width': data.width * proportion.width || screenSize.width,
                 'height': data.height * proportion.height || screenSize.height,
                 'padding': data.padding * proportion.left || 0,
                 'zIndex': data.zIndex || 2147483647,
                 'background': data.background,
                 'category': data.category,
                 'hyperlink': data.hyperlink
             };

             if (babelHelpers.typeof(this.pageBox[pageId]) != 'object') {
                 this.pageBox[pageId] = {};
             }

             this.pageBox[pageId][activityId] = videoInfo;
         },

         //=================视频动作处理============================

         //加载视频
         loadVideo: function loadVideo(pageId, activityId, container) {
             var playBox = this.playBox,
                 data = this.pageBox[pageId][activityId];

             //播放视频时停止所有的音频
             //视频的同时肯能存在音频
             // Xut.AudioManager.clearAudio();

             //this.beforePlayVideo(pageId,videoId)
             //search video cache
             if (playBox[pageId] && playBox[pageId][activityId]) {
                 //console.log('*********cache*********');
                 playBox[pageId][activityId].play();
             } else {
                 //console.log('=========new=============');
                 if (babelHelpers.typeof(playBox[pageId]) !== 'object') {
                     playBox[pageId] = {};
                 }
                 //cache video object
                 playBox[pageId][activityId] = new VideoClass(data, container);
             }
         },

         //播放视频之前检查要停的视频
         beforePlayVideo: function beforePlayVideo(pageId, activityId) {},

         //清理移除页的视频
         removeVideo: function removeVideo(pageId) {
             var playBox = this.playBox,
                 pageBox = this.pageBox;

             //清理视频
             if (playBox && playBox[pageId]) {
                 for (var activityId in playBox[pageId]) {
                     playBox[pageId][activityId].close();
                 }
                 delete this.playBox[pageId];
             }
             //清理数据
             if (pageBox && pageBox[pageId]) {
                 delete this.pageBox[pageId];
             }
         },

         //清理全部视频
         clearVideo: function clearVideo() {
             var playBox = this.playBox,
                 flag = false; //记录是否处理过销毁状态

             for (var pageId in playBox) {
                 for (var activityId in playBox[pageId]) {
                     playBox[pageId][activityId].close();
                     flag = true;
                 }
             }

             this.playBox = {};
             this.pageBox = {};
             return flag;
         },

         //离开页面
         leavePage: function leavePage(pageId) {
             var playBox = this.playBox;
             if (playBox && playBox[pageId]) {
                 for (var activityId in playBox[pageId]) {
                     playBox[pageId][activityId].stop();
                 }
             }
         },

         //显示按钮
         showIconFlag: function showIconFlag(activityId) {},

         //隐藏按钮
         hideIconFlag: function hideIconFlag(activityId) {}
     };

     Xut.VideoManager = new VideoManager();

     /**
      * 用css3实现的忙碌光标
      * @return {[type]} [description]
      */
     function cursor() {
         var sWidth = window.innerWidth,
             sHeight = window.innerHeight,
             width = Math.min(sWidth, sHeight) / 4,
             space = Math.round((sHeight - width) / 2),
             delay = [0, 0.9167, 0.833, 0.75, 0.667, 0.5833, 0.5, 0.41667, 0.333, 0.25, 0.1667, 0.0833],
             deg = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
             i = 12,
             prefix = Xut.plat.prefixStyle,
             html;

         html = '<div style="width:' + width + "px;height:" + width + 'px;margin:' + space + 'px auto;">';
         html += '<div style="height:30%;"></div><div class="xut-busy-middle">';

         while (i--) {
             html += '<div class="xut-busy-spinner" style="' + prefix('transform') + ':rotate(' + deg[i] + 'deg) translate(0,-142%);' + prefix('animation-delay') + ':-' + delay[i] + 's;"></div>';
         }

         html += '</div><div class="xut-busy-text"></div></div>';

         Xut.View.busyIcon = $('#busyIcon').html(html);
     }

     /**
      * 场景控制器
      * 场景对象之间的顺序处理
      * @return {[type]} [description]
      */

     //场景层级控制
     var zIndex = 999999;

     //场景合集
     //主场景
     //副场景
     var sceneCollection = {
         //场景顺序
         scenarioStack: [],
         //场景链表
         scenarioChain: []
     };

     var sceneControll = {

         //场景层级控制
         createIndex: function createIndex() {
             return --zIndex;
         },

         //设置一个新场景
         add: function add(scenarioId, relevant, sceneObj) {
             sceneCollection.scenarioStack.push(scenarioId);
             sceneCollection['scenarioId->' + scenarioId] = sceneObj;
             //场景链表,拥挤记录场景的加载上一页
             sceneCollection.scenarioChain.push({
                 'scenarioId': scenarioId,
                 'chapterId': relevant
             });
             return sceneObj;
         },

         //=============== 场景链相关方法 ==========================

         //取出上一个场景链
         takeOutPrevChainId: function takeOutPrevChainId() {
             var pre = sceneCollection.scenarioChain.pop();
             if (sceneCollection.scenarioChain.length > 1) {
                 return sceneCollection.scenarioChain.pop();
             } else {
                 return sceneCollection.scenarioChain[0];
             }
         },

         //检测重复
         checkToRepeat: function checkToRepeat(seasonId) {
             var last,
                 len = sceneCollection.scenarioChain.length;
             if (len > 1) {
                 last = sceneCollection.scenarioChain[len - 2];
             } else {
                 last = sceneCollection.scenarioChain[len - 1];
             }

             //往回跳一级
             if (last['scenarioId'] == seasonId) {
                 this.takeOutPrevChainId();
             }

             //直接会跳到主场景
             if (sceneCollection.scenarioStack[0] == seasonId) {
                 var scenarioChain = sceneCollection.scenarioChain.shift();
                 sceneCollection.scenarioChain.length = 0;
                 sceneCollection.scenarioChain.push(scenarioChain);
             }
         },

         /**
          * 返回活动对象
          * @return {[type]} [description]
          */
         containerObj: function containerObj(scenarioId) {
             if (scenarioId === 'current') {
                 var scenarioStack = sceneCollection.scenarioStack;
                 scenarioId = scenarioStack[scenarioStack.length - 1];
             }
             return sceneCollection['scenarioId->' + scenarioId];
         },

         /**
          * 找到索引位置的Id
          * @param  {[type]} scenarioId [description]
          * @return {[type]}            [description]
          */
         findIndexOfId: function findIndexOfId(scenarioId) {
             return sceneCollection.scenarioStack.lastIndexOf(scenarioId);
         },

         //删除指定场景引用
         remove: function remove(scenarioId) {
             var indexOf = this.findIndexOfId(scenarioId);
             //删除索引
             sceneCollection.scenarioStack.splice(indexOf, 1);
             //删除场景对象区域
             delete sceneCollection['scenarioId->' + scenarioId];
         },

         //销毁所有场景
         destroyAllScene: function destroyAllScene() {
             var cache = _.clone(sceneCollection.scenarioStack);
             _.each(cache, function (scenarioId) {
                 sceneCollection['scenarioId->' + scenarioId].destroy();
             });
             sceneCollection.scenarioChain = [];
         },

         /**
          * 重写场景的顺序编号
          * 用于记录最后一次跳转的问题
          * @return {[type]} [description]
          */
         rewrite: function rewrite(scenarioId, chapterId) {
             _.each(sceneCollection.scenarioChain, function (scenarioChain) {
                 if (scenarioChain.scenarioId == scenarioId) {
                     scenarioChain.chapterId = chapterId;
                 }
             });
         },

         //暴露接口
         expose: function expose() {
             return sceneCollection;
         },

         //===============================================
         //
         //			记录历史缓存
         //
         //===============================================

         //解析序列
         sequence: function sequence(scenarioId, currPageIndex) {
             var chains = sceneCollection.scenarioChain;
             //有多个场景关系,需要记录
             if (chains.length > 1) {
                 var history = [];
                 //只刷新当前场景的页面
                 _.each(chains, function (chain) {
                     if (chain.scenarioId == scenarioId) {
                         history.push(chain.scenarioId + '-' + chain.chapterId + '-' + currPageIndex);
                     } else {
                         history.push(chain.scenarioId + '-' + chain.chapterId);
                     }
                 });
                 return history;
             }
         },

         //反解析
         seqReverse: function seqReverse(chains) {
             var chains = chains.split(",");
             var chainsNum = chains.length;

             if (chainsNum === 1) {
                 return false;
             }

             //如果只有2层
             if (chainsNum === 2) {
                 return chains[1];
             }

             //拼接作用域链
             //排除首页(已存在)
             //尾页(新创建)
             _.each(chains, function (chain, index) {
                 if (index >= 1 && index < chainsNum - 1) {
                     //从1开始吸入,排除最后一个
                     var chain = chain.split('-');
                     sceneCollection.scenarioChain.push({
                         'scenarioId': chain[0],
                         'chapterId': chain[1],
                         'pageIndex': chain[2]
                     });
                 }
             });
             return chains[chainsNum - 1];
         }
     };

     Xut.sceneController = sceneControll;

     /**
      *
      *  动作对象
      *      1 跳转页面
      *      2 打开系统程序
      *      3 加载子文档
      *
      */

     function Action$2(data) {

         _.extend(this, data);

         this.id = parseInt(this.id);

         this.actType = this.type;

         //加载数据
         this.setup(Xut.data.query('Action', this.id, 'activityId'));
     }

     Action$2.prototype = {

         setup: function setup(results) {
             var para1 = results.para1,
                 //跳转参数
             para2 = results.para2,
                 //ppt
             dbId = results._id;

             var actionType = parseInt(results.actionType);

             //跳转或打开本地程序
             switch (actionType) {
                 case 0:
                     this.toPage(para1);
                     break;
                 case 1:
                     if (Xut.plat.isBrowser) return;
                     //打开插件
                     Xut.Plugin.OpenApp.openAppAction(para1, function (r) {}, function (e) {});
                     break;
                 case 2:
                     //子文档处理
                     this.loadSubdoc(para1, dbId);
                     break;
             }

             this.state = true;
         },

         open: function open() {
             this.state = true;
             //打开插件
             Xut.Plugin.OpenApp.openAppAction(para1, function (r) {}, function (e) {});
         },

         //跳转页面
         toPage: function toPage(para1) {
             para1 = JSON.parse(para1);
             if (para1.seasonId) {
                 Xut.View.GotoSlide(para1.seasonId, para1.chapterId);
             } else {
                 //向下兼容
                 Xut.View.GotoSlide(para1);
             }
         },

         /***********************************************************
          *
          *                   子文档处理
          *
          * **********************************************************/

         //加载子文档
         loadSubdoc: function loadSubdoc(path, dbId) {
             var self = this,
                 wapper,
                 configPath = 'www/content/subdoc/' + path + '/content/gallery/';

             //配置子文档加载路径
             window.XXTSUbDOC = {
                 'path': path,
                 'dbId': dbId
             };

             this.subPath = path;

             //构建子文档的容器
             wapper = this.$wapper = this.createWapper();

             Xut.nextTick({
                 'container': $(this.rootNode),
                 'content': wapper
             }, function () {
                 self.destroyCache();
             });
         },

         //iframe加载完毕
         iframeComplete: function iframeComplete() {
             var self = this;
             //关闭事件
             Xut.one('subdoc:dropApp', function () {
                 self.destroyCache('iframe', self.iframe[0].contentWindow);
             });
             //隐藏全局工具栏
             Xut.View.HideToolbar();
             Xut.isRunSubDoc = true;
             self.$wapper.css({
                 'opacity': '1'
             });
         },

         //获取iframe颞部window上下文
         destroyCache: function destroyCache(contentWindow) {
             var self = this,
                 iframe;

             if (contentWindow) {
                 iframe = true;
             } else {
                 contentWindow = window;
             }

             function clear() {
                 Xut.View.ShowToolbar();
                 self.$wapper.remove();
                 self.$wapper = null;
                 self.iframe = null;
                 self.rootNode = null;
                 Xut.isRunSubDoc = false;
             }

             try {
                 contentWindow.require("Dispatcher", function (c) {
                     if (iframe) {
                         //子文档操作
                         if (c.stopHandles()) {
                             c.promptMessage('再按一次将退出子目录！');
                         } else {
                             clear();
                         }
                     } else {
                         //父级操作
                         c.stopHandles();
                     }
                 });
             } catch (err) {
                 clear();
             }
         },

         createWapper: function createWapper() {
             var zIndex, str, dom, ifr;

             //层级设定
             if (this.zIndex === 0) {
                 zIndex = this.zIndex;
             } else {
                 zIndex = this.zIndex || Xut.zIndexlevel();
             }

             this.zIndex = zIndex;

             str = '<div id="Subdoc_{0}" style="z-index:{1};width:{2}px;height:{3}px;top:{4}px;left:{5}px;position:absolute;opacity:0" >' + '</div>';

             dom = String.format(str, this.id, zIndex, this.screenSize.width, this.screenSize.height, 0, 0);

             ifr = this.iframe = this.createIframe();

             return $(dom).append(ifr);
         },

         /**
          * 加载iframe
          * @return {[type]} [description]
          */
         createIframe: function createIframe() {
             var me = this,
                 path = 'content/subdoc/' + this.subPath + '/index.html?xxtParaIn=' + this.key,
                 ifr = document.createElement('iframe');

             ifr.id = 'iframe_' + this.id;
             ifr.src = path;
             ifr.style.width = '100%';
             ifr.style.height = '100%';
             ifr.sandbox = "allow-scripts allow-same-origin";
             ifr.frameborder = 0;
             if (ifr.attachEvent) {
                 ifr.attachEvent('onload', function () {
                     me.iframeComplete();
                 });
             } else {
                 ifr.onload = function () {
                     me.iframeComplete();
                 };
             }

             return $(ifr);
         }
     };

     var Action$1 = {

         createDom: function createDom(activityData, chpaterData, chapterId, pageIndex, zIndex, pageType) {
             var backgroundImage = '',

             //等比缩放
             width = activityData.scaleWidth,
                 height = activityData.scaleHeight,
                 top = activityData.scaleTop,
                 left = activityData.scaleLeft;

             var md5;

             //热点背景图
             if (md5 = activityData.md5) {
                 backgroundImage = "background-image: url(" + Xut.onfig.pathAddress + md5 + ");";
             }

             //==============创建触发点结构=============
             return String.format('<div id="{0}"' + ' data-belong = "{1}"' + ' data-delegate="Action"'
             // +' autoplay="{2}" ' svg打包不可以属性
              + ' style="cursor: pointer;width:{3}px;height:{4}px;left:{5}px;top:{6}px;background-size:100% 100%;position:absolute;z-index:{7};{8}"></div>', activityData.actType + "_" + activityData._id, pageType, activityData.autoPlay, width, height, left, top, zIndex, backgroundImage);
         },

         /**
          * 是否阻止全局事件派发
          * @type {Boolean}
          *   false 事件由全局接管派发
          *   false 事件由hotspot处理触发
          *   全局提供的事件接口
          *   {
          *       globalTouchStart
          *       globalTouchMove
          *       globalTouchEnd
          *   }
          */
         stopDelegate: false,

         /**
          * touchEnd 全局派发的点击事件
          * 如果stopGlobalEvent == ture 事件由全局派发
          */
         eventDelegate: function eventDelegate(data) {
             new Action$2(data);
         },

         //========复位对象==========
         //
         //  通过按物理键，关闭当前热点
         //
         //  @return 如果当前没有需要处理的Action,
         //  需要返回一个状态标示告诉当前是否应该退出应用
         //
         recovery: function recovery(opts) {
             if (this.state) {
                 this.state = false;
                 return true;
             } else {
                 return false;
             }
         }
     };

     /**
      * 文本类型
      */

     var Content = {

         //==========创建热点元素结构（用于布局可触发点）===============
         //
         //   预创建
         //
         createDom: function createDom(opts) {
             var sqlRet = opts.sqlRet,
                 pageIndex = opts.pageIndex;
             return function (rootEle, pageIndex) {
                 sqlRet['container'] = rootEle || opts.rootEle;
                 return sqlRet;
             };
         },

         /**
          * 绑定热点事件
          * 用户交互动作产生Action或者widget对象
          */
         bindEvent: function bindEvent() {},

         /**
          * 在当前页面自动触发的通知
          *
          * 作用：
          *   生成Action或者widget触发点对象
          *
          * 有一种情况，如果当前Action对象，已存在必须要做重复处理
          *
          * Xut.ActionMgr.getOne(key) 接口，是获取当前是否有实例对象的引用
          *
          */
         autoPlay: function autoPlay(scopeComplete) {
             return this.autoPlay && this.autoPlay(scopeComplete);
         },

         /**
          * 开始翻页
          *
          * 滑动页面的时候触发
          *
          * 处理要关闭的对象
          *
          * 比如（音频，视频），不能停留到下一个页面,滑动必须立刻关闭或者清理销毁
          *
          * @param  {[type]} this  当前活动对象
          *
          */
         flipOver: function flipOver() {
             return this.flipOver();
         },

         /**
          * 翻页完成
          * @return {[type]} [description]
          */
         flipComplete: function flipComplete() {
             return this.flipComplete();
         },

         /**
          * 销毁接口
          *
          * 1 销毁页面绑定的事件
          *   A hotspotBind 接口绑定的的热点触发事件
          *   B autoPlay 等接口 产生的具体Action对象事件
          *
          * 2 销毁热点元素的在控制器中的引用
          *
          * 3 清理页面结构
          *
          * 注：
          *   2,3操作暂时由控制器已经内部统一完成了,暂时只需要处理1销毁绑定的事件
          *
          * @param  {[type]} pageIndex    [页码标示]
          * @param  {[type]} rootEle      [根元素]
          * @return {[type]}              [description]
          */
         destroy: function destroy() {
             return this.destroy();
         },

         /**
          *  复位状态通知
          *
          *  作用：用户按页面右上角返回，或者pad手机上的物理返回键
          *
          *  那么：
          *      1 按一次， 如果当前页面有活动热点，并且热点对象还在可视活动状态（比如文本，是显示，音频正在播放）
          *        那么则调用此方法，做复位处理，即文本隐藏，音频关闭
          *        然后返回true, 用于反馈给控制器,停止下一步调用
          *        按第二次,则退出页面
          *
          *     2 按一次，如果没有活动的对象，return false,这直接退出页面
          *
          * @param  {[type]} activeObejct [description]
          * @return {[type]}              [description]
          */
         recovery: function recovery(opts) {
             return this.recovery && this.recovery();
         }

     };

     //临时音频动作数据
     var tempData = {};

     var Media = {

         createDom: function createDom(activityData, chpaterData, chapterId, pageIndex, zIndex, pageType) {
             var width = activityData.scaleWidth,
                 height = activityData.scaleHeight,
                 top = activityData.scaleTop,
                 left = activityData.scaleLeft,
                 actType = activityData.actType,
                 id = activityData._id;

             //如果没有宽高则不创建绑定节点
             if (!width || !height) return '';

             var category = activityData.category;
             var mediaIcon,
                 mediaIconSize,
                 posX,
                 posY,
                 start,
                 stop,
                 itemArray,
                 startImage = "";

             var screenSize = Xut.config.screenSize;

             //只针对网页插件增加单独的点击界面
             if (category == 'webpage' && width > 200 && height > 100 && width <= screenSize.width && height <= screenSize.height) {
                 mediaIcon = 'background-image:url(images/icons/web_hotspot.png)';
             }

             //解析音乐动作
             //冒泡动作靠节点传递数据
             if (itemArray = activityData.itemArray) {
                 itemArray = parseJSON(itemArray);
                 start = itemArray[0];
                 stop = itemArray[1];
                 tempData[id] = {};
                 if (start) {
                     if (start.startImg) {
                         startImage = start.startImg;
                         tempData[id]['startImg'] = startImage;
                         startImage = 'background-image:url(' + startImage + ');';
                     }
                     if (start.script) {
                         tempData[id]['startScript'] = start.script;
                     }
                 }
                 if (stop) {
                     if (stop.stopImg) {
                         tempData[id]['stopImg'] = stop.stopImg;
                     }
                     if (stop.script) {
                         tempData[id]['stopScript'] = stop.script;
                     }
                 }
             }

             //首字母大写
             var mediaType = category.replace(/(\w)/, function (v) {
                 return v.toUpperCase();
             });

             //创建音频对象
             //Webpage_1
             //Audio_1
             //Video_1
             var tpl = String.format('<div id="{0}"' + ' data-belong="{1}"' + ' data-delegate="{2}"' + ' style="width:{3}px;height:{4}px;left:{5}px;top:{6}px;z-index:{7};{8}background-size:100% 100%;position:absolute;">', mediaType + "_" + id, pageType, category, width, height, left, top, zIndex, startImage);

             //如果有视频图标
             if (mediaIcon) {
                 mediaIconSize = 74;
                 posX = (width - mediaIconSize) / 2;
                 posY = (height - mediaIconSize) / 2;

                 tpl += String.format('<div id="icon_{0}"' + ' type="icon"' + ' style="position:absolute;top:{1}px;left:{2}px;width:{3}px;height:{4}px;{5};">' + ' </div>', id, posY, posX, mediaIconSize, mediaIconSize, mediaIcon);
             }

             tpl += '</div>';

             return tpl;
         },

         //仅创建一次
         //data传递参数问题
         onlyCreateOnce: function onlyCreateOnce(id) {
             var data;
             if (data = tempData[id]) {
                 delete tempData[id];
                 return data;
             }
         },

         /**
          * touchEnd 全局派发的点击事件
          * 如果stopGlobalEvent == ture 事件由全局派发
          */
         eventDelegate: function eventDelegate(data) {
             var category, chapterId;
             if (category = data.target.getAttribute('data-delegate')) {
                 //触发类型
                 chapterId = Xut.Presentation.GetPageId(data.pageIndex);
                 /**
                  * 传入chapterId 页面ID
                  * activityId    视频ID
                  * eleName       节点名  //切换控制
                  * 根节点
                  */
                 if (category == 'audio') {
                     Xut.AudioManager.trigger(chapterId, data.activityId, this.onlyCreateOnce(data.id));
                 } else {
                     Xut.VideoManager.trigger(chapterId, data.activityId, $(data.rootNode));
                 }
             }
         },

         //自动运行
         autoPlay: function autoPlay(data) {
             var category = data.category;
             if (!category) return;
             var rootNode = data.rootNode,
                 pageIndex = data.pageIndex,
                 chapterId = data.chapterId,
                 activityId = data.id,
                 triggerType = category == 'audio' ? 'audioManager' : 'videoManager';

             //数据库视频音频不规则问题导致
             //首字母大写
             var mediaType = category.replace(/(\w)/, function (v) {
                 return v.toUpperCase();
             });

             //自动音频
             if (category == 'audio') {
                 Xut.AudioManager.autoPlay(chapterId, activityId, this.onlyCreateOnce(data.id));
             } else {
                 //自动视频
                 Xut.VideoManager.autoPlay(chapterId, activityId, rootNode);
             }
         }

     };

     /**
      * 创建iframe零件包装器
      */

     function iframeWidget(data) {

         var self = this;

         //获取数据
         _.extend(this, data);

         //创建页面零件包装器
         this.$wapper = this.createWapper();

         Xut.nextTick({
             'container': self.rootNode,
             'content': this.$wapper
         }, function () {
             self.rootNode = null;
             self.bindPMS();
         });

         return this;
     }

     iframeWidget.prototype = {

         /**
          * 创建包含容器
          * @return {[type]} [description]
          */
         createWapper: function createWapper() {
             var zIndex, str, dom, ifr;

             //层级设定
             if (this.zIndex === 0) {
                 zIndex = this.zIndex;
             } else {
                 zIndex = this.zIndex || Xut.zIndexlevel();
             }

             this.zIndex = zIndex;

             str = '<div id="iframeWidget_{0}" style="z-index:{1};width:{2}px;height:{3}px;top:{4}px;left:{5}px;position:absolute;" ></div>';

             dom = String.format(str, this.id, zIndex, this.width, this.height, this.top, this.left);

             ifr = this.createIframe();

             this._iframe = ifr;

             return $(dom).append(ifr);
         },

         /**
          * 加载iframe
          * @return {[type]} [description]
          */
         createIframe: function createIframe() {
             var me = this,
                 path = 'content/widget/' + this.widgetId + '/index.html?xxtParaIn=' + this.key,
                 ifr = document.createElement('iframe');

             ifr.id = 'iframe_' + this.id;
             ifr.src = path;
             ifr.style.width = '100%';
             ifr.style.height = '100%';
             ifr.sandbox = "allow-scripts allow-same-origin";
             ifr.frameborder = 0;
             if (ifr.attachEvent) {
                 ifr.attachEvent('onload', function () {
                     me.iframeComplete();
                 });
             } else {
                 ifr.onload = function () {
                     me.iframeComplete();
                 };
             }
             return ifr;
         },

         /**
          * iframe加载完毕回调
          * @return {[type]} [description]
          */
         iframeComplete: function iframeComplete() {
             var me = this;
             var dataSource = this.loadData();
             var width = me._iframe.offsetWidth;
             var height = me._iframe.offsetHeight;

             if (dataSource.screenSize.width * 0.98 <= width && dataSource.screenSize.height * 0.98 <= height) {
                 Xut.View.Toolbar({
                     show: 'button',
                     hide: 'controlBar'
                 });
             } else if (dataSource.screenSize.width * 0.7 <= width && dataSource.screenSize.height * 0.7 <= height) {
                 Xut.View.Toolbar({
                     show: 'button'
                 });
             }

             this.PMS.send({
                 target: me._iframe.contentWindow,
                 origin: '*',
                 type: 'loadData',
                 data: dataSource,
                 //消息传递完毕后的回调
                 success: success,
                 error: function error() {}
             });

             function success() {}
             // console.log('完毕')


             //iframe加载的状态
             me.state = true;
         },

         /**
          * ifarme内部，请求返回数据
          * @return {[type]} [description]
          */
         loadData: function loadData() {
             var item,
                 field,
                 source_export = [],
                 images = Xut.data['Image'],
                 token = null,
                 outputPara = this.inputPara,
                 items = outputPara.source;

             for (item in items) {
                 if (items.hasOwnProperty(item)) {
                     field = {};
                     token = images.item((parseInt(items[item]) || 1) - 1);
                     field['img'] = '../gallery/' + token.md5;
                     field['thumb'] = '';
                     field['title'] = token.imageTitle;
                     source_export.push(field);
                 }
             }

             outputPara.source = source_export;

             return outputPara;
         },

         /********************************************************************
          *
          *                   与iframe通讯接口
          *
          * ********************************************************************/

         /**
          * 与iframe通讯接口
          * @return {[type]} [description]
          */
         bindPMS: function bindPMS() {
             var me = this,
                 markId = this.id;

             this.PMS = PMS;
             //隐藏widget
             PMS.bind("onHideWapper" + markId, function (e) {
                 var $wapper = me.$wapper;
                 $wapper.hide();
                 me.state = false;
             }, '*');

             //全屏操作
             PMS.bind("onFullscreen" + markId, function (e) {
                 var $wapper = me.$wapper,
                     $iframe = $(me._iframe);

                 if (!$iframe.length) return;
                 //关闭视频
                 Xut.VideoManager.clearVideo();

                 $wapper.css({
                     width: '100%',
                     height: '100%',
                     zIndex: Xut.zIndexlevel(),
                     top: 0,
                     left: 0
                 });

                 //Widget全屏尺寸自动调整
                 if (e.full == false) {
                     var body = document.body,
                         width = parseInt(body.clientWidth),
                         height = parseInt(body.clientHeight),
                         rote = me.width / me.height,
                         getRote = function getRote(width, height, rote) {
                         var w = width,
                             h = width / rote;
                         if (h > height) {
                             h = height;
                             w = h * rote;
                         }
                         return {
                             w: parseInt(w),
                             h: parseInt(h)
                         };
                     },
                         size = getRote(width, height, rote),
                         left = (width - size.w) / 2,
                         top = (height - size.h) / 2;

                     $iframe.css({
                         width: size.w,
                         height: size.h,
                         position: 'absolute',
                         top: top,
                         left: left
                     });
                 }
                 //隐藏工作条
                 Xut.View.Toolbar("hide");
             }, '*');

             //还原初始窗口操作
             PMS.bind("onReset" + markId, function (e) {
                 var $wapper = me.$wapper,
                     $iframe = $(me._iframe);

                 if (!$iframe.length) return;

                 $wapper.css({
                     zIndex: me.zIndex,
                     width: me.width + 'px',
                     height: me.height + 'px',
                     top: me.top + 'px',
                     left: me.left + 'px'
                 });

                 //还原iframe样式
                 $iframe.css({
                     width: '100%',
                     height: '100%',
                     position: '',
                     top: '0',
                     left: '0'
                 });

                 Xut.View.Toolbar("show");
             }, '*');

             //显示工作条
             PMS.bind("onShowToolbar" + markId, function (e) {
                 // Xut.View.ShowToolbar();
             }, '*');

             //隐藏工作条
             PMS.bind("onHideToolbar" + markId, function (e) {
                 Xut.View.HideToolbar();
             }, '*');

             //跳转页面
             PMS.bind('scrollToPage' + markId, function (data) {
                 Xut.View.GotoSlide(data['ppts'], data['pageIndex']);
             }, '*');
         },

         //=============外部调用接口===================

         /**
          * 外部调用接口
          * 显示隐藏
          * @return {[type]} [description]
          */
         dispatchProcess: function dispatchProcess() {
             if (this.state) {
                 this.stop();
             } else {
                 this.start();
             }
         },

         /**
          * 开始
          * @return {[type]} [description]
          */
         start: function start() {
             var me = this;
             me.domWapper();
             this.PMS.send({
                 target: me._iframe.contentWindow,
                 url: me._iframe.src,
                 origin: '*',
                 type: 'onShow',
                 success: function success() {
                     // alert(123)
                 }
             });
             setTimeout(function () {
                 me.state = true;
             }, 0);
         },

         /**
          * 暂停
          * @return {[type]} [description]
          */
         stop: function stop() {
             var me = this;
             me.domWapper();
             this.PMS.send({
                 target: me._iframe.contentWindow,
                 url: me._iframe.src,
                 origin: '*',
                 type: 'onHide',
                 success: function success() {}
             });
             setTimeout(function () {
                 me.state = false;
             }, 0);
         },

         /**
          * 处理包装容器的状态
          * @return {[type]} [description]
          */
         domWapper: function domWapper() {
             if (this.state) {
                 this.$wapper.hide();
             } else {
                 this.$wapper.show();
             }
         },

         //复位
         recovery: function recovery() {
             var me = this;
             if (me.state) {
                 me.PMS.send({
                     target: me._iframe.contentWindow,
                     url: me._iframe.src,
                     origin: '*',
                     type: 'onHide',
                     success: function success() {}
                 });
                 me.domWapper();
                 me.state = false;
                 return true;
             }
             return false;
         },

         //销毁接口
         destroy: function destroy() {

             var me = this,
                 iframe = this._iframe,
                 PMS = this.PMS;

             //销毁内部事件
             PMS.send({
                 target: iframe.contentWindow,
                 url: iframe.src,
                 origin: '*',
                 type: 'onDestory',
                 success: function success() {}
             });

             //销毁事件绑定
             PMS.unbind();

             //销魂节点
             setTimeout(function () {
                 me._iframe = null;
                 me.$wapper.remove();
                 me.$wapper = null;
             }, 0);
         }

     };

     /**
      * 页面零件
      * @param {[type]} data [description]
      */
     function pageWidget(data) {

         //获取数据
         _.extend(this, data);

         this._widgetObj = null;

         var widgetName = this.widgetName + "Widget";

         //加载文件
         if (typeof window[this.widgetName + "Widget"] != "function") {
             this.loadfile(this.executive);
         } else {
             this.executive();
         }
     }

     pageWidget.prototype = {

         /**
          * 路径地址
          * @param  {[type]} name [description]
          * @return {[type]}      [description]
          */
         path: function path(fileName) {
             return 'content/widget/' + this.widgetId + '/' + fileName;
         },

         /**
          * 加载js,css文件
          * @return {[type]} [description]
          */
         loadfile: function loadfile(callback) {
             var jsPath,
                 cssPath,
                 completeCount,
                 self = this,

             //定义css,js的命名
             jsName = this.widgetName + '.min.js',
                 cssName = this.widgetType == 'page' || this.widgetType == 'js' ? 'style.min.css' : 0,

             //需要等待完成
             completeCount = function () {
                 var count = 0;
                 jsName && count++;
                 cssName && count++;
                 return function () {
                     if (count === 1) {
                         return callback && callback.call(self);
                     }
                     count--;
                 };
             }();

             //加载css
             if (cssName) {
                 cssPath = this.path(cssName);
                 _loadfile(cssPath, function () {
                     completeCount();
                 });
             }

             //加载js
             if (jsName) {
                 jsPath = this.path(jsName);
                 _loadfile(jsPath, function () {
                     completeCount();
                 });
             }
         },

         /**
          * 创建数据
          * @return {[type]} [description]
          */
         createData: function createData() {
             var item,
                 field,
                 source_export = [],
                 images = Xut.data['Image'],
                 token = null,
                 outputPara = this.inputPara,
                 items = outputPara.source;

             for (item in items) {
                 if (items.hasOwnProperty(item)) {

                     field = {};
                     token = images.item((parseInt(items[item]) || 1) - 1);
                     field['img'] = token.md5;
                     field['thumb'] = '';
                     field['title'] = token.imageTitle;
                     source_export.push(field);
                 }
             }

             outputPara.source = source_export;
             outputPara.scrollPaintingMode = this.scrollPaintingMode;
             outputPara.calculate = this.calculate;

             return outputPara;
         },

         /**
          * 解析数据,获取content对象
          * @return {[type]} [description]
          */
         parseContentObjs: function parseContentObjs() {
             var contentIds = [],
                 inputPara = this.inputPara;
             inputPara.content && _.each(inputPara.content, function (contentId) {
                 contentIds.push(contentId);
             });
             return Xut.Contents.GetPageWidgetData(this.pageType, contentIds);
         },

         /**
          * 执行函数
          * @return {[type]} [description]
          */
         executive: function executive() {
             //得到content对象与数据
             var data = this.createData();
             var contentObjs = this.parseContentObjs();
             if (this.widgetType == 'canvas') {
                 var id = contentObjs ? contentObjs[0].id : data.frame;
                 var canvasId = "pageWidget_" + id;
                 var canvansContent = $("#" + data.contentPrefix + id);
                 if ($("#" + canvasId).length < 1) {
                     canvansContent.append("<canvas style='position:absolute; z-index:10' id='" + canvasId + "' width='" + canvansContent.width() + "' height='" + canvansContent.height() + "'></canvas>");
                 }
                 canvansContent.canvasId = canvasId;
             }
             if (typeof window[this.widgetName + "Widget"] == "function") this._widgetObj = new window[this.widgetName + "Widget"](data, contentObjs);else console.error("Function [" + this.widgetName + "Widget] does not exist.");
         },

         //================ 外部调用 =====================

         play: function play() {
             console.log('widget');
             return this._widgetObj.play();
         },

         getIdName: function getIdName() {
             return this._widgetObj.getIdName();
         },

         /**
          * 外部调用接口
          * @return {[type]} [description]
          */
         dispatchProcess: function dispatchProcess() {
             this._widgetObj.toggle();
         },

         /**
          * 处理包装容器的状态
          * @return {[type]} [description]
          */
         domWapper: function domWapper() {
             if (!this.wapper) return;
             if (this.state) {
                 this.$wapper.hide();
             } else {
                 this.$wapper.show();
             }
         },

         /**
          * 销毁页面零件
          * @return {[type]} [description]
          */
         destroy: function destroy() {
             if (this._widgetObj && this._widgetObj.destroy) this._widgetObj.destroy();
         }
     };

     var proportion = void 0;
     var screenSize$1 = void 0;
     var appId = void 0;

     function loadWidget(type, data, widgetClass) {
         //pixi webgl模式
         //2016.4.14
         //高级精灵动画
         var pageObj = Xut.Presentation.GetPageObj(data.pageType, data.pageIndex);
         if (pageObj) {
             if (pageObj.canvasRelated.enable) {
                 //高级精灵动画不处理
                 //已经改成本地化pixi=>content调用了
                 if (data.widgetName === "spirit") {
                     return;
                 }
             }
         }

         var widgetObj = new widgetClass(data);

         //特殊的零件，也是只加载脚本
         if (data.widgetName != "bones") {
             //保存引用
             //特殊的2个个零件不保存
             Xut.Application.injectionComponent({
                 'pageType': data.pageType, //标记类型区分
                 'pageIndex': data.pageIndex,
                 'widget': widgetObj
             });
         }
     }

     /**
      * 构建5中零件类型
      * 	1、iframe零件
      *	2、页面零件
      *	3、SVG零件
      *	4、canvas零件
      *	5、webGL零件
      * @type {Object}
      */
     var adapterType = {

         /**
          * iframe零件类型
          * @param  {[type]} data [description]
          * @return {[type]}      [description]
          */
         'iframe': function iframe(data) {
             loadWidget('widget', data, iframeWidget);
         },
         'widget': function widget(data) {
             loadWidget('widget', data, iframeWidget);
         },

         /**
          * js零件类型处理
          * @param  {[type]} data [description]
          * @return {[type]}      [description]
          */
         'js': function js(data) {
             loadWidget('js', data, pageWidget);
         },
         'page': function page(data) {
             loadWidget('page', data, pageWidget);
         },
         'svg': function svg(data) {
             loadWidget('svg', data, pageWidget);
         },
         'canvas': function canvas(data) {
             loadWidget('canvas', data, pageWidget);
         },
         'webgL': function webgL(data) {
             loadWidget('webgL', data, pageWidget);
         }
     };

     /**
      * 获取widget数据
      * @return {[type]} [description]
      */
     function filtrateDas(data) {
         data = filterData(data);
         return proportion.calculateElement(data);
     }

     /**
      * 过滤出数据
      * @return {[type]} [description]
      */
     function filterData(data) {
         //直接通过id查询数据	
         if (data.widgetId) {
             _.extend(data, Xut.data.query('Widget', data.widgetId));
         } else {
             //直接通过activityId查询数据	
             _.extend(data, Xut.data.query('Widget', data.activityId, 'activityId'));
         }
         return data;
     }

     /**
      * 解析json数据
      * @param  {[type]} itemArray [description]
      * @return {[type]}           [description]
      */
     function ParseJSON(itemArray) {
         var anminJson;
         try {
             anminJson = JSON.parse(itemArray);
         } catch (error) {
             anminJson = new Function("return " + itemArray)();
         }
         return anminJson;
     }

     /**
      * ifarme内部，请求返回数据
      * @return {[type]} [description]
      */
     function parsePara(data) {
         var inputPara, //输入数据
         outputPara; //输出数据
         if (inputPara = data.inputPara) {
             outputPara = ParseJSON(inputPara);
         }
         return outputPara;
     }

     function Adapter(para) {

         config = Xut.config;
         proportion = config.proportion;
         screenSize$1 = config.screenSize;
         appId = config.appId;

         //获取数据
         var data = filtrateDas(para);

         para = null;

         data.id = data.activityId;

         //解析数据
         data.inputPara = parsePara(data);

         if (!data.inputPara) {
             data.inputPara = {};
         }

         //增加属性参数
         if (data.widgetType === 'page') {
             data.inputPara.container = data.rootNode;
         }

         data.inputPara.uuid = appId + '-' + data.activityId; //唯一ID标示
         data.inputPara.id = data.activityId;
         data.inputPara.screenSize = screenSize$1;
         //content的命名前缀
         data.inputPara.contentPrefix = Xut.Presentation.MakeContentPrefix(data.pageIndex, data.pageType);

         //画轴模式
         data.scrollPaintingMode = config.scrollPaintingMode;
         data.calculate = config.proportion.calculateContainer();

         //执行类构建
         adapterType[(data.widgetType || 'widget').toLowerCase()](data);
     }

     var Widget = {
         //==========创建热点元素结构（用于布局可触发点）===============
         //
         // 根据数据创建自己的热点元素结构（用于拼接结构字符串）
         //
         // 要retrun返回这个结构，主要是多人操作时,保证只有最终的dom渲染只有一次
         //
         // sqlRet    具体动作对象的数据
         // pageData  当前页面数据
         // chaperId  当前页面的chapterId
         // pageIndex 当前页面索引号
         // zIndex    热点元素的层级
         //
         createDom: function createDom(activityData, chpaterData, chapterId, pageIndex, zIndex, pageType) {
             var retStr = '',
                 layerId,
                 cssStyle,
                 autoPlay = activityData.autoPlay;

             //如果是自动播放,则不创建结构
             if (autoPlay) {
                 return retStr;
             }

             var backgroundImage = '',
                 width = activityData.scaleWidth,
                 height = activityData.scaleHeight,
                 top = activityData.scaleTop,
                 left = activityData.scaleLeft,
                 actType = activityData.actType,
                 md5 = activityData.md5;

             //热点背景图
             if (md5) {
                 backgroundImage = "background-image: url(" + Xut.config.pathAddress + md5 + ");";
             }

             //创建触发点结构
             layerId = actType + "_" + activityData._id;
             cssStyle = 'cursor: pointer;width:' + width + 'px;height:' + height + 'px;left:' + left + 'px;top:' + top + 'px;background-size:100% 100%;position:absolute;z-index:' + zIndex + ';' + backgroundImage + '';

             return String.format('<div id="{0}"' + ' data-belong ="{1}"' + ' data-delegate="{2}"'
             // +' autoplay="{3}"' svg打包不可以属性
              + ' style="{4}">' + ' </div>', layerId, pageType, actType, autoPlay, cssStyle);
         },

         //事件委托
         //通过点击触发
         eventDelegate: function eventDelegate(data) {
             return Adapter(data);
         },

         //在当前页面自动触发的通知
         autoPlay: function autoPlay(data) {
             Adapter({
                 'rootNode': data.rootNode,
                 "type": data.type,
                 "pageType": data.pageType,
                 "activityId": data.id,
                 "pageIndex": data.pageIndex,
                 "isAutoPlay": true
             });
         },

         /**
          *  复位状态通知
          *
          *  作用：用户按页面右上角返回，或者pad手机上的物理返回键
          *
          *  那么：
          *      1 按一次， 如果当前页面有活动热点，并且热点对象还在可视活动状态（比如文本，是显示，音频正在播放）
          *        那么则调用此方法，做复位处理，即文本隐藏，音频关闭
          *        然后返回true, 用于反馈给控制器,停止下一步调用
          *        按第二次,则退出页面
          *
          *     2 按一次，如果没有活动的对象，return false,这直接退出页面
          *
          * @param  {[type]} activeObejct [description]
          * @return {[type]}              [description]
          */
         recovery: function recovery(opts) {
             return this.recovery();
         }
     };

     // *  iscroll 控制
     // *    传入dom ID
     // *     [onIscroll description]
     // * @param  {[type]} contentWrapperDomId [description]
     // * @return {[type]}                     [description]

     function Iscroll(element) {
          //是否移动，中途停止了动画
          var distX = 0,
              distY = 0,
              startX,
              startY,
              absDistY,
              absDistX,
              iscroll,
              that = this,
              screenWidth = Xut.config.screenSize.width,
              useswipeleft = function useswipeleft() {
               Xut.View.GotoPrevSlide();
          },
              useswiperight = function useswiperight() {
               Xut.View.GotoNextSlide();
          };

          return new iScroll(element, {
               scrollbars: true,
               fadeScrollbars: true
               //click          : true,
               //tap            : true,
               //probeType      : 2
          });

          // this.iscroll.on('scrollStart', function() {
          //     iscroll.initDirection = false; //初始化一次滑动方向
          // });
          // this.iscroll.on('scrollEnd', function(e) {
          //     //如果是Y轴滑动者不作处理跳过
          //     if (iscroll.initDirection) {
          //          startY= startX=distX = distY = 0;
          //         iscroll.startTime = 0;
          //         iscroll.initDirection = false;
          //         return;
          //     }

          //     var duration, deltaX, validSlide, distance;
          //     //滑动的距离、

          //     deltaX = distX || 0;
          //     duration = +new Date - iscroll.startTime;
          //     distance = Math.abs(deltaX);
          //     //反弹的边界值
          //     validSlide = Math.ceil(screenWidth / 5);
          //     if (distance < validSlide) {
          //         //快速滑动允许翻页
          //         if (duration < 200 && distance > 20) {
          //             iscroll.swipe = true;
          //             deltaX > 0 ? useswipeleft() : useswiperight();
          //         } else {
          //             //反弹
          //             Xut.View.MovePage(0, 300, deltaX > 0 ? 'prev' : 'next', 'flipRebound')
          //         }
          //     } else {
          //         iscroll.swipe = true;
          //         deltaX > 0 ? useswipeleft() : useswiperight();
          //     }
          //    startY= startX=distX = distY = 0;
          //     iscroll.startTime = 0;
          //     iscroll.initDirection = false;
          // });
          // this.iscroll.on('scroll', function(e) {
          //     startX=startX||e.pageX;
          //     startY=startY||e.pageY;

          //     distX =e.pageX-startX;
          //     distY = e.pageY-startY;

          //     absDistX = Math.abs(distX);
          //     absDistY = Math.abs(distY);

          //     iscroll.startTime = iscroll.startTime || e.timeStamp;
          //     if (absDistY * 1.5 > absDistX) {
          //           //如果是Y轴滑动则做标记不作处理
          //         iscroll.initDirection = true;
          //     } else {
          //         Xut.View.MovePage(distX, 0, distX > 0 ? 'prev' : 'next', 'flipMove');
          //         iscroll.initDirection = false
          //     }
          // });
     }

     function ShowNote$1(data) {
         data.id = parseInt(data.id);
         data.actType = data.type;
         _.extend(this, data);
         this.setup();
     }

     ShowNote$1.prototype = {
         setup: function setup() {
             var that = this,
                 note = this.data.note,
                 prop = Xut.config.proportion,
                 width = Math.round((prop.width + prop.height) / 2 * Xut.config.iconHeight),
                 space = Math.round(width / 2);
             retStr = '<div class="xut-shownote-box" style="z-index:' + Xut.zIndexlevel() + '">' + '<div class="close" style="width:' + width + 'px;height:' + width + 'px;top:-' + space + 'px;right:-' + space + 'px"></div>' + '<div class="content">' + note + '</div>' + '</div>';

             this._dom = $(retStr);
             this._dom.find('.close').on("touchend mouseup", function () {
                 that.dispatchProcess();
             });
             $(this.rootNode).append(this._dom);

             this.show();
             this.iscroll = Iscroll(this._dom.find('.content')[0]);
             return true;
         },

         //外部调用接口
         dispatchProcess: function dispatchProcess() {
             //自动热点 取消关闭
             if (this.isAutoPlay) return;
             //当前对象状态
             this.state ? this.hide() : this.show();
         },

         recovery: function recovery() {
             if (this.state) {
                 this.dispatchProcess();
                 return true;
             }
             return false;
         },

         hide: function hide() {
             this.state = false;
             $("#ShowNote_" + this.id).css('background-image', 'url(images/icons/hideNote.png)');
             this._dom.hide();
         },

         show: function show() {
             this.state = true;
             $("#ShowNote_" + this.id).css('background-image', 'url(images/icons/showNote.png)');
             this._dom.show();
         },

         destroy: function destroy() {
             if (this._dom) {
                 this._dom.find('.close').off();
                 this._dom && this._dom.hide().remove();
             }

             //iscroll销毁
             if (this.iscroll) {
                 this.iscroll.destroy();
                 this.iscroll = null;
             }
         }

     };

     var ShowNote = {

         //==========创建热点元素结构（用于布局可触发点）===============
         //
         // 根据数据创建自己的热点元素结构（用于拼接结构字符串）
         //
         // 要retrun返回这个结构，主要是多人操作时,保证只有最终的dom渲染只有一次
         //actType + "_" + _id
         createDom: function createDom(activityData, chpaterData, chapterId, pageIndex, zIndex, pageType) {
             var retStr = "",
                 newWidth,
                 id = activityData['_id'],
                 width = activityData.scaleWidth,
                 height = activityData.scaleHeight,
                 newWidth = (width + height) / 2 * Xut.config.iconHeight;

             retStr += '<div id="ShowNote_' + id + '" class="xut-showNote" data-belong =' + pageType + ' data-delegate="ShowNote" style="width:' + newWidth + 'px;height:' + newWidth + 'px"></div>';
             return retStr;
         },

         /**
          * touchEnd 全局派发的点击事件
          * 如果stopGlobalEvent == ture 事件由全局派发
          */
         eventDelegate: function eventDelegate(data) {
             data.data = Xut.Presentation.GetPageData(data.pageIndex);
             new ShowNote$1(data);
         },

         //自动运行生成Action或者widget触发点对象
         autoPlay: function autoPlay(opts) {},

         /**
          * 翻页后处理页面中活动热点的状态
          * @param  {[type]} activeObejct [需要处理的活动对象]
          *
          * 比如音频,视频 翻页需要暂停，也可以销毁
          */
         flipOver: function flipOver(opts) {
             //console.log('翻页处理活动对象', activeObejct ,pageIndex);
         },

         /**
          * 销毁页面hotspot事件与Action或widget事件
          * @param  {[type]} activeObejct [需要处理的活动对象]
          * @param  {[type]} pageIndex    [页码标示]
          * @param  {[type]} rootEle      [根元素]
          * @return {[type]}              [description]
          */
         destroy: function destroy(opts) {
             this && this.destroy();
         },

         //========复位对象==========
         //
         //  通过按物理键，关闭当前热点
         //
         //  @return 如果当前没有需要处理的Action,
         //  需要返回一个状态标示告诉当前是否应该退出应用
         //
         recovery: function recovery(opts) {
             if (this.state) {
                 this.dispatchProcess();
                 return true;
             }
             return false;
         }
     };

     var Webpage = Media;
     var Video = Media;
     var Audio$1 = Media;

     var Bind = {
         Video: Video,
         Audio: Audio$1,
         Action: Action$1,
         Content: Content,
         Webpage: Webpage,
         Widget: Widget,
         ShowNote: ShowNote
     };

     var contentTaskOutId;
     /**
      * 运行自动的content对象
      * 延时500毫秒执行
      * @return {[type]} [description]
      */
     function runContent(contentObjs, taskAnimCallback) {

         var contentTaskOutId = setTimeout(function () {

             clearTimeout(contentTaskOutId);

             //完成通知
             var markComplete = function () {
                 var completeStatistics = contentObjs.length; //动画完成统计
                 return function () {
                     if (completeStatistics === 1) {
                         taskAnimCallback && taskAnimCallback();
                         markComplete = null;
                     }
                     completeStatistics--;
                 };
             }();

             _.each(contentObjs, function (obj, index) {
                 if (!Xut.CreateFilter.has(obj.pageId, obj.id)) {
                     obj.autoPlay(markComplete);
                 } else {
                     markComplete();
                 }
             });
         }, 500);
     }
     /**
      * 运行自动的静态类型
      * @return {[type]} [description]
      */
     function runComponent(pageObj, pageIndex, autoRunComponents, pageType) {

         var chapterId = pageObj.baseGetPageId(pageIndex);

         if (pageIndex === undefined) {
             pageIndex = Xut.Presentation.GetPageIndex();
         }
         _.each(autoRunComponents, function (data, index) {
             var dir = Bind[data.type];
             if (dir && dir.autoPlay) {
                 dir.autoPlay({
                     'id': data.id,
                     'key': data.key,
                     'type': data.type,
                     'pageType': pageType,
                     'rootNode': pageObj.element,
                     'chapterId': chapterId,
                     'category': data.category,
                     'autoPlay': data.autoPlay,
                     'pageIndex': pageIndex
                 });
             }
         });
     }

     function _autoRun(pageObj, pageIndex, taskAnimCallback) {

         /**
          * 编译IBOOKSCONFIG的时候过滤自动运行的调用
          * @return {[type]}              [description]
          */
         if (Xut.IBooks.compileMode()) {
             return;
         }

         //pageType
         //用于区别触发类型
         //页面还是母版
         Xut.accessControl(pageObj, function (pageObj, ContentObjs, ComponentObjs, pageType) {

             //如果是母版对象，一次生命周期种只激活一次
             if (pageObj.pageType === 'master') {
                 if (pageObj.onceMaster) {
                     return;
                 }
                 pageObj.onceMaster = true;
             }

             taskAnimCallback = taskAnimCallback || function () {};

             //自动运行的组件
             var autoRunComponents;
             if (autoRunComponents = pageObj.baseAutoRun()) {
                 runComponent(pageObj, pageIndex, autoRunComponents, pageType);
             }

             //自动运行content
             clearTimeout(contentTaskOutId);

             if (ContentObjs) {
                 runContent(ContentObjs, taskAnimCallback);
             } else {
                 taskAnimCallback(); //无动画
             }

             Xut.log('debug', pageType + '层，第' + (pageIndex + 1) + '页开始,本页面Id为' + pageObj.chapterId);
         });
     }

     function trigger(target, attribute, rootNode, pageIndex) {

         var key, tag, type, id, dir, data, pageType, instance;

         if (key = target.id) {

             tag = key.split('_');
             type = tag[0];
             id = tag[1];
             dir = Bind[type];

             if (dir && dir.eventDelegate) {

                 //获取页面类型
                 pageType = function () {
                     if (rootNode && rootNode.id) {
                         return (/page/.test(rootNode.id) ? 'page' : 'master'
                         );
                     } else {
                         return 'page';
                     }
                 }();

                 data = {
                     "id": id,
                     "activityId": id,
                     "key": key,
                     "type": type,
                     "rootNode": rootNode,
                     "target": target,
                     "pageIndex": pageIndex,
                     'pageType': pageType
                 };

                 //如果是重复点击
                 if (instance = Xut.Application.GetSpecifiedObject(pageType, data)) {
                     if (instance.dispatchProcess) {
                         //如果有对应的处理方法
                         return instance.dispatchProcess();
                     }
                 }

                 //委派新的任务
                 dir.eventDelegate(data);
             }
         }
     }

     /**
      * 暂停控制
      * @return {[type]} [description]
      */

     //翻页时,暂停滑动页面的所有热点动作
     //翻页停止content动作
     function _suspend(pageObj, pageId) {

         Xut.accessControl(pageObj, function (pageObj, ContentObjs, ComponentObjs) {
             //多媒体处理
             if (pageId !== undefined) {
                 //离开页面销毁视频
                 Xut.VideoManager.removeVideo(pageId);
                 //翻页停止母板音频
                 if (pageObj.pageType === 'master') {
                     Xut.AudioManager.hangUpAudio();
                 }
             }

             //content类型
             if (ContentObjs) {
                 _.each(ContentObjs, function (obj) {
                     obj.flipOver && obj.flipOver();
                 });
             }
         });
     }

     /**
      * 复位到初始化的状态
      * @return {[type]} [description]
      */

     /////////
     //优化检测 //
     /////////
     function checkOptimize(fn) {
         if (!Xut.config.scrollPaintingMode) {
             fn && fn();
         }
     }

     //===============================================================
     //     
     //           翻一页处理： 翻页完毕触发
     //
     //  大量操作DOM结构，所以先隐藏根节点
     //  1 删除所有widget节点
     //  2 复位所有content节点
     // 
     //==============================================================
     function _original(pageObj) {

         Xut.accessControl(pageObj, function (pageObj, ContentObjs, ComponentObjs) {

             //母版对象不还原
             if (pageObj.pageType === 'master') return;

             var element;

             if (element = pageObj.element) {
                 checkOptimize(function () {
                     element.hide();
                 });

                 //销毁所有widget类型的节点
                 if (ComponentObjs) {
                     _.each(ComponentObjs, function (obj) {
                         obj && obj.destroy();
                     });
                     //销毁widget对象管理
                     pageObj.baseRemoveComponent();
                 }

                 //停止动作
                 ContentObjs && _.each(ContentObjs, function (obj) {
                     if (!Xut.CreateFilter.has(obj.pageId, obj.id)) {
                         obj.resetAnimation && obj.resetAnimation();
                     }
                 });

                 checkOptimize(function () {
                     setTimeout(function () {
                         element.show();
                         element = null;
                     }, 0);
                 });
             }
         });
     }

     /**
      * 动作复位状态
      * @return {[type]} [description]
      */

     //========================================================
     //          复位状态
     //          状态控制
     //  如果返回false证明有热点,
     //  第一次只能关闭热点不能退出页面
     //=========================================================
     function recovery(pageObj) {
         return Xut.accessControl(pageObj, function (pageObj, ContentObjs, ComponentObjs) {
             var falg = false;
             _.each([ContentObjs, ComponentObjs], function (collectionObj) {
                 collectionObj && _.each(collectionObj, function (obj) {
                     //如果返回值是false,则是算热点处理行为
                     if (obj.recovery && obj.recovery()) {
                         falg = true;
                     }
                 });
             });
             return falg;
         });
     }

     /**
      * 获取访问对象参数
      *
      * 如果pageObj 不存在，则取当前页面的
      * 
      * @return {[type]} [description]
      */
     Xut.accessControl = function (pageObj, callback) {
         var flag,
             pageObj = pageObj || Xut.Presentation.GetPageObj();
         if (pageObj) {
             var contents = pageObj.baseGetContent();
             var components = pageObj.baseGetComponent();
             var pageType = pageObj.pageType || 'page';
             flag = callback(pageObj, contents.length && contents, components.length && components, pageType);
         }
         return flag;
     };

     var prefix = Xut.plat.prefixStyle;
     var sectionInstance = null;
     var lockAnimation = void 0; //执行动画
     function toAnimation(navControlBar, navhandle, action) {
         var end = function end() {
             navControlBar.css(prefix('transition'), '');
             Xut.View.HideBusy();
             lockAnimation = false;
         };

         if (action == 'in') {
             sectionInstance.refresh();
             sectionInstance.scrollTo();
             navControlBar.animate({
                 'z-index': Xut.zIndexlevel(),
                 'opacity': 1
             }, 'fast', 'linear', function () {
                 navhandle.attr('fly', 'out');
                 end();
             });
         } else {
             navhandle.attr('fly', 'in');
             navControlBar.hide();
             end();
         }
     }

     //控制按钮改变
     function navControl(action, navhandle) {
         navhandle.css('opacity', action === "in" ? 0.5 : 1);
     }

     function initialize() {
         //动画状态
         if (lockAnimation) {
             return false;
         }

         lockAnimation = true;
         Xut.View.ShowBusy();
         startpocess();
     };

     function startpocess() {
         //控制按钮
         var navhandle = $("#backDir"),
             action = navhandle.attr('fly') || 'in',
             navControlBar = $("#navBar");

         //初始化样式
         initStyle(navControlBar, action, function () {
             //触发控制条
             navControl(action, navhandle);
             //执行动画
             toAnimation(navControlBar, navhandle, action);
         });
     };

     function initStyle(navControlBar, action, fn) {
         sectionInstance.state = false;
         if (action == 'in') {
             sectionInstance.state = true;
             navControlBar.css({
                 'z-index': 0,
                 'opacity': 0,
                 'display': 'block'
             });
         }
         fn && fn();
     }

     //关闭
     function _close(callback) {
         if (sectionInstance && sectionInstance.state) {
             callback && callback();
             initialize();
         }
     }

     /***********************************************
      *	      热点动作控制器模块
      *         1 所有content热点停止
      *         2 所有content热点销毁
      *         3 app应用销毁
      * **********************************************/

     //消息提示框
     function promptMessage(info) {
         show({
             hindex: Xut.Presentation.GetPageIndex(),
             content: info || "再按一次将退回到主页",
             time: 3000
         });
     };

     /************************************************************
      *
      * 			检测媒体的播放状态
      * 			1 视频
      * 			2 音频
      *
      * ***********************************************************/
     function checkMedia(pageId) {
         var flag = false; //音频 视频 是否有处理

         if (Xut.AudioManager.clearAudio(pageId)) {
             flag = true;
         }

         if (Xut.VideoManager.clearVideo()) {
             flag = true;
         }

         return flag;
     }

     /************************************************************
      *
      * 			检测热点的运行状态
      *
      * ***********************************************************/
     function checkWidgets(context, pageIndex) {
         return recovery();
     }

     /************************************************************
      * 			停止所有热点动作,并返回状态
      * 			1 content
      * 			2 widget
      * 			动画,视频,音频...........................
      * 			增加场景模式判断
      * ***********************************************************/
     function suspendHandles(context, pageIndex, skipMedia) {

         //是否存在运行中
         var stateRun = false;

         //处理音频
         if (checkMedia(skipMedia)) {
             stateRun = true;
         }

         //正在运行的热点
         ///content,Action', 'Widget', 'ShowNote'
         if (checkWidgets(context, pageIndex)) {
             stateRun = true;
         }

         //处理导航
         _close(function () {
             stateRun = true;
         });

         return stateRun;
     }

     var config$5 = void 0;

     /**
      * 设置缓存
      * @param {[type]} parameter [description]
      */
     function setDataToStorage(parameter) {
         config$5.pageIndex = parameter.pageIndex;
         config$5.novelId = parameter.novelId;
         _set({
             "pageIndex": parameter.pageIndex,
             "novelId": parameter.novelId
         });
     };

     /**
      * 初始化值
      * @param {[type]} options [description]
      */
     function initDefaultValues(options) {
         var pageFlip = options.pageFlip;
         //配置全局翻页模式
         //pageflip可以为0
         //兼容pageFlip错误,强制转化成数字类型
         if (pageFlip !== undefined) {
             config$5.pageFlip = toEmpty(pageFlip);
         }
         return {
             'novelId': toEmpty(options.novelId),
             'pageIndex': toEmpty(options.pageIndex),
             'history': options.history
         };
     };

     /**
      * 检测脚本注入
      * @return {[type]} [description]
      */
     function checkInjectScript() {
         var preCode,
             novels = Xut.data.query('Novel');
         if (preCode = novels.preCode) {
             injectScript(preCode, 'novelpre脚本');
         }
     }

     function loadScene(options) {

         config$5 = Xut.config;

         //获取默认参数
         var parameter = initDefaultValues(options || {});

         //设置缓存
         setDataToStorage(parameter);

         //应用脚本注入
         checkInjectScript();

         //检测下scenarioId的正确性
         //scenarioId = 1 找不到chapter数据
         //通过sectionRelated递归检测下一条数据
         var scenarioId, seasondata, i;
         for (i = 0; i < Xut.data.Season.length; i++) {
             seasondata = Xut.data.Season.item(i);
             if (Xut.data.query('sectionRelated', seasondata._id)) {
                 scenarioId = seasondata._id;
                 break;
             }
         }

         //加载新的场景
         Xut.View.LoadScenario({
             'main': true, //主场景入口
             'scenarioId': scenarioId,
             'pageIndex': parameter.pageIndex,
             'history': parameter.history
         });
     }

     /**
      * 布局文件
      * 1 控制条
      * 2 导航栏
      * @param  {[type]} config [description]
      * @return {[type]}        [description]
      */
     var config$7 = void 0;
     var round = void 0;
     var ratio = void 0;
     var isIOS = void 0;
     var iconHeight$1 = void 0;
     var proportion$1 = void 0;
     var calculate = void 0;
     var TOP = void 0;
     var sWidth = void 0;
     var sHeight = void 0;
     var navHeight = void 0; //菜单的高度
     var navWidth = void 0; //菜单的宽度

     function setOption() {
         config$7 = Xut.config;
         round = Math.round;
         ratio = 6;
         isIOS = Xut.plat.isIOS;
         iconHeight$1 = config$7.iconHeight;
         proportion$1 = config$7.proportion;
         calculate = proportion$1.calculateContainer();
         TOP = isIOS ? 20 : 0;
         sWidth = calculate.width;
         sHeight = calculate.height;
         proportion$1 = config$7.layoutMode == "horizontal" ? proportion$1.width : proportion$1.height;
         iconHeight$1 = isIOS ? iconHeight$1 : round(proportion$1 * iconHeight$1);
     }

     /**
      * 首页布局
      * @return {[type]} [description]
      */
     function home() {

         setOption();

         var retStr = '';
         var style = void 0;

         if (config$7.scrollPaintingMode) {
             retStr = '<div id="sceneHome" style ="width:' + (config$7.virtualMode ? sWidth / 2 : sWidth) + 'px;height:' + sHeight + 'px;top:' + calculate.top + 'px;left:' + calculate.left + 'px;z-index:' + Xut.sceneController.createIndex() + '" class="xut-chapter">';
         } else {
             //overflow:hidden;
             retStr = '<div id="sceneHome" style ="width:' + (config$7.virtualMode ? sWidth / 2 : sWidth) + 'px;height:' + sHeight + 'px;top:' + calculate.top + 'px;left:' + calculate.left + 'px;overflow:hidden;z-index:' + Xut.sceneController.createIndex() + '" class="xut-chapter">';
         }
         retStr += '<div id="controlBar" class="xut-controlBar hide"></div>';
         retStr += '<ul id="pageContainer" class="xut-flip"></ul>'; //页面节点
         retStr += '<ul id="masterContainer" class="xut-master xut-flip"></ul>'; //视觉差包装容器

         //滑动菜单
         if (config$7.layoutMode == 'horizontal') {
             navHeight = round(sHeight / ratio); //菜单的高度
             style = 'overflow:hidden;width:100%;height:' + navHeight + 'px;background-color:white;bottom:4px;border-top:1px solid rgba(0,0,0,0.1)';
         } else {
             navWidth = Math.min(sWidth, sHeight) / (isIOS ? 8 : 3); //菜单宽度
             navHeight = round((sHeight - iconHeight$1 - TOP) * 0.96);
             style = 'width:' + navWidth + 'px;height:' + navHeight + 'px;background-color:white;top:' + (iconHeight$1 + TOP + 2) + 'px;left:' + iconHeight$1 + 'px;border-top:1px solid rgba(0,0,0,0.1)';
         }

         retStr += '<div id="navBar" class="xut-navBar" style="' + style + '"></div>';
         //消息提示框
         retStr += '<div id="toolTip"></div>';
         retStr += '</div>';
         return retStr;
     }

     /**
      * [scene 创建场景]
      * @param  {[type]} options [description]
      * @return {[type]}         [description]
      */
     function scene(id) {

         setOption();

         var wapper = '';
         if (config$7.scrollPaintingMode) {
             wapper = '<div id="{0}" class="xut-waitLoad" style="width:{1}px;height:{2}px;top:{3}px;left:{4}px;position:absolute;z-index:{5};">' + '<ul id="{6}" class="xut-flip" style="z-index:{7}"></ul>' + '<ul id="{8}" class="xut-flip" style="z-index:{9}"></ul>' + '</div>';
         } else {
             wapper = '<div id="{0}" class="xut-waitLoad" style="width:{1}px;height:{2}px;top:{3}px;left:{4}px;position:absolute;overflow:hidden;z-index:{5};">' + '<ul id="{6}" class="xut-flip" style="z-index:{7}"></ul>' + '<ul id="{8}" class="xut-flip" style="z-index:{9}"></ul>' + '</div>';
         }
         return String.format(wapper, 'scenario-' + id, config$7.virtualMode ? sWidth / 2 : sWidth, sHeight, calculate.top, calculate.left, Xut.sceneController.createIndex(), 'scenarioPage-' + id, 2, 'scenarioMaster-' + id, 1);
     }

     /**
      * svgicons.js v1.0.0
      * http://www.codrops.com
      *
      * Licensed under the MIT license.
      * http://www.opensource.org/licenses/mit-license.php
      *
      * Copyright 2013, Codrops
      * http://www.codrops.com
      */

     /*** helper functions ***/

     // from https://github.com/desandro/classie/blob/master/classie.js
     function classReg(className) {
         return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
     }

     function hasClass(el, c) {
         return 'classList' in document.documentElement ? el.classList.contains(c) : classReg(c).test(el.className);
     }

     function extend$1(a, b) {
         for (var key in b) {
             if (b.hasOwnProperty(key)) {
                 a[key] = b[key];
             }
         }
         return a;
     }

     // http://snipplr.com/view.php?codeview&id=5259
     function isMouseLeaveOrEnter(e, handler) {
         if (e.type != 'mouseout' && e.type != 'mouseover') return false;
         var reltg = e.relatedTarget ? e.relatedTarget : e.type == 'mouseout' ? e.toElement : e.fromElement;
         while (reltg && reltg != handler) {
             reltg = reltg.parentNode;
         }return reltg != handler;
     }

     /*** svgIcon ***/

     function svgIcon(el, config, options) {
         this.el = el;
         this.options = extend$1({}, this.options);
         extend$1(this.options, options);
         this.svg = Snap(this.options.size.w, this.options.size.h);
         this.svg.attr('viewBox', '0 0 32 32');
         this.el.appendChild(this.svg.node);
         // state
         this.toggled = false;
         // icons configuration
         this.config = config[this.el.getAttribute('data-icon-name')];
         // reverse?
         if (hasClass(this.el, 'si-icon-reverse')) {
             this.reverse = true;
         }
         if (!this.config) return;
         var self = this;
         // load external svg
         Snap.load(this.config.url, function (f) {
             var g = f.select('g');
             self.svg.append(g);
             self.options.onLoad();
             self._initEvents();
             if (self.reverse) {
                 self.toggle(true);
             }
         });
     }

     svgIcon.prototype.options = {
         speed: 200,
         easing: mina.linear,
         evtoggle: 'click', // click || mouseover
         size: {
             w: 44,
             h: 44
         },
         onLoad: function onLoad() {
             return false;
         },
         onToggle: function onToggle() {
             return false;
         }
     };

     svgIcon.prototype._initEvents = function () {
         var self = this,
             toggleFn = function toggleFn(ev) {
             if ((ev.type.toLowerCase() === 'mouseover' || ev.type.toLowerCase() === 'mouseout') && isMouseLeaveOrEnter(ev, this) || ev.type.toLowerCase() === 'touchstart' || ev.type.toLowerCase() === 'mousedown') {
                 self.toggle(true);
                 self.options.onToggle();
             }
             return false;
         };

         if (this.options.evtoggle === 'mouseover') {
             this.el.addEventListener('mouseover', toggleFn);
             this.el.addEventListener('mouseout', toggleFn);
         } else {
             Xut.plat.execEvent('on', {
                 context: this.el,
                 callback: {
                     start: function start(e) {
                         toggleFn(e);
                     }
                 }
             });
         }
     };

     svgIcon.prototype.toggle = function (motion) {
         if (!this.config.animation) return;
         var self = this;
         for (var i = 0, len = this.config.animation.length; i < len; ++i) {
             var a = this.config.animation[i],
                 el = this.svg.select(a.el),
                 animProp = this.toggled ? a.animProperties.from : a.animProperties.to,
                 val = animProp.val,
                 timeout = motion && animProp.delayFactor ? animProp.delayFactor : 0;

             if (animProp.before) {
                 el.attr(JSON.parse(animProp.before));
             }

             if (motion) {
                 setTimeout(function (el, val, animProp) {
                     return function () {
                         el.animate(JSON.parse(val), self.options.speed, self.options.easing, function () {
                             if (animProp.after) {
                                 this.attr(JSON.parse(animProp.after));
                             }
                             if (animProp.animAfter) {
                                 this.animate(JSON.parse(animProp.animAfter), self.options.speed, self.options.easing);
                             }
                         });
                     };
                 }(el, val, animProp), timeout * self.options.speed);
             } else {
                 el.attr(JSON.parse(val));
             }
         }
         this.toggled = !this.toggled;
     };

     /**
      * [svgIconConfig description]
      * http://tympanus.net/Development/AnimatedSVGIcons/
      * @type {Object}
      */
     var iconConfig = {
         nextArrow: {
             url: 'images/icons/pageback.svg',
             animation: [{
                 el: 'path:nth-child(1)',
                 animProperties: {
                     from: {
                         val: '{"transform" : "r0 16 16", "fill-opacity" : "0.9"}',
                         before: '{"fill-opacity" : "0.9", "stroke-opacity" : "0" , "transform" : "r90 16 16"}'
                     },
                     to: {
                         val: '{"transform" : "r360 16 16", "fill-opacity": "0"}',
                         before: '{"fill-opacity" : "0", "stroke-opacity" : "1" }'
                     }
                 }
             }]
         },
         prevArrow: {
             url: 'images/icons/pageforward.svg',
             animation: [{
                 el: 'path:nth-child(1)',
                 animProperties: {
                     from: {
                         val: '{"transform" : "r0 16 16", "fill-opacity" : "0.9"}',
                         before: '{"fill-opacity" : "0.9", "stroke-opacity" : "0" , "transform" : "r90 16 16"}'
                     },
                     to: {
                         val: '{"transform" : "r360 16 16", "fill-opacity": "0"}',
                         before: '{"fill-opacity" : "0", "stroke-opacity" : "1" }'
                     }
                 }
             }]
         },
         close: {
             url: 'images/icons/close.svg',
             animation: [{
                 el: 'path:nth-child(1)',
                 animProperties: {
                     from: {
                         val: '{"transform" : "r0 16 16", "fill-opacity" : "0.9"}',
                         before: '{"fill-opacity" : "0.9", "stroke-opacity" : "0" , "transform" : "r90 16 16"}'
                     },
                     to: {
                         val: '{"transform" : "r360 16 16", "fill-opacity": "0"}',
                         before: '{"fill-opacity" : "0", "stroke-opacity" : "1" }'
                     }
                 }
             }]
         },
         back: {
             url: 'images/icons/back.svg',
             animation: [{
                 el: 'path:nth-child(1)',
                 animProperties: {
                     from: {
                         val: '{"transform" : "r0 16 16", "fill-opacity" : "0.9"}',
                         before: '{"fill-opacity" : "0.9", "stroke-opacity" : "0" , "transform" : "r90 16 16"}'
                     },
                     to: {
                         val: '{"transform" : "r360 16 16", "fill-opacity": "0"}',
                         before: '{"fill-opacity" : "0", "stroke-opacity" : "1" }'
                     }
                 }
             }]
         }
     };

     var isIOS$1 = Xut.plat.isIOS;

     //获取翻页按钮位置
     var arrowStyle = function arrowStyle() {
         var config = Xut.config;
         var height = config.iconHeight;
         var settings = config.settings;
         var styleText = 'height:' + height + 'px;width:' + height + 'px';
         switch (settings.NavbarPos) {
             case 0:
                 styleText += ';top:0';
                 break; //顶部
             case 1:
                 styleText += ';margin-top:' + -height / 2 + 'px';
                 break; //中间
             case 2:
                 styleText += ';top:auto;bottom:0';
                 break; //底部
             default:
                 break;
         }

         return styleText;
     };

     //工具栏基础类
     var ToolBar = Xut.CoreObject.extend({
         barHeight: isIOS$1 ? 20 : 0, //系统状态栏高度
         enableLeft: true, //默认创建左翻页按钮
         enableRight: true //默认创建右翻页按钮
     });

     ToolBar.prototype.initConfig = function (config) {
         var propHeight;
         //获取高度缩放比
         //自动选择缩放比例
         this.propHeight = propHeight = function () {
             var layout = config.layoutMode,
                 prop = config.proportion;
             return layout == "horizontal" ? prop.width : prop.height;
         }();

         //获取图标高度
         //工具栏图标高度
         this.iconHeight = function () {
             var height = config.iconHeight;
             return isIOS$1 ? height : Math.round(propHeight * height);
         }();

         this.appName = config.shortName; //应用标题
         this.settings = config.settings; //应用默认配置
     };

     //创建翻页按钮
     ToolBar.prototype.createArrows = function () {
         //是否使用自定义的翻页按钮: true /false
         //图标名称是客户端指定的：pageforward_'+appId+'.svg
         var isCustom = this.settings.customButton;

         if (this.enableLeft) {
             isCustom ? this.createLeftIcon() : this.createLeftArrow();
         }

         if (this.enableRight) {
             isCustom ? this.createRightIcon() : this.createRightArrow();
         }
     };

     //左箭头翻页按钮
     ToolBar.prototype.createLeftArrow = function () {
         var style = arrowStyle(),
             state = this.barStatus ? '' : 'hide',
             $dom;
         $dom = $('<div class="si-icon xut-flip-control left ' + state + '" data-icon-name="prevArrow" style="' + style + '"></div>');

         this.createSVGIcon($dom[0], function () {
             Xut.View.GotoPrevSlide();
         });

         this.container.append($dom);
         this.arrows.prev = {
             el: $dom,
             able: true
         };
     };

     //右箭头翻页按钮
     ToolBar.prototype.createRightArrow = function () {
         var style = arrowStyle(),
             state = this.barStatus ? '' : 'hide',
             $dom;
         $dom = $('<div class="si-icon xut-flip-control right ' + state + '" data-icon-name="nextArrow" style="' + style + '"></div>');

         this.createSVGIcon($dom[0], function () {
             Xut.View.GotoNextSlide();
         });

         this.container.append($dom);
         this.arrows.next = {
             el: $dom,
             able: true
         };
     };

     //自定义左翻页按钮
     ToolBar.prototype.createLeftIcon = function () {
         var style = arrowStyle(),
             appId = this.config.appId,
             state = this.barStatus ? '' : 'hide',
             $dom;
         style += ';background-image:url(images/icons/pageforward_' + appId + '.svg);background-size:cover';
         $dom = $('<div name="prevArrow" class="xut-flip-control left ' + state + '" style="' + style + '"></div>');

         $dom.on("touchend mouseup", function () {
             Xut.View.GotoPrevSlide();
         });

         this.container.append($dom);
         this.arrows.prev = {
             el: $dom,
             able: true
         };
     };

     //自定义右翻页按钮
     ToolBar.prototype.createRightIcon = function () {
         var style = arrowStyle(),
             appId = this.config.appId,
             state = this.barStatus ? '' : 'hide',
             $dom;
         style += ';background-image:url(images/icons/pageback_' + appId + '.svg);background-size:cover';
         $dom = $('<div name="nextArrow" class="xut-flip-control right ' + state + '" style="' + style + '"></div>');

         $dom.on("touchend mouseup", function () {
             Xut.View.GotoNextSlide();
         });

         this.container.append($dom);
         this.arrows.next = {
             el: $dom,
             able: true
         };
     };

     /**
      * [ description]
      * @param  {[type]} dir [next,prev]
      * @param  {[type]} status  [true/false]
      * @return {[type]}       [description]
      */
     ToolBar.prototype.toggleArrow = function (dir, status) {
         var arrow = this.arrows[dir];
         //如果没有创建翻页按钮,则不处理
         if (!arrow) return;
         arrow.able = status;
         //如果人为隐藏了工具栏,则不显示翻页按钮
         if (this.hasTopBar && !this.barStatus && status) {
             return;
         }
         arrow.el[status ? 'show' : 'hide']();
     };

     //隐藏下一页按钮
     ToolBar.prototype.hideNext = function () {
         this.toggleArrow('next', false);
     };

     //显示下一页按钮
     ToolBar.prototype.showNext = function () {
         this.toggleArrow('next', true);
     };

     //隐藏上一页按钮
     ToolBar.prototype.hidePrev = function () {
         this.toggleArrow('prev', false);
     };

     //显示上一页按钮
     ToolBar.prototype.showPrev = function () {
         this.toggleArrow('prev', true);
     };

     /**
      * [ 显示翻页按钮]
      * @return {[type]}        [description]
      */
     ToolBar.prototype.showPageBar = function () {
         var arrows = this.arrows;

         for (var dir in arrows) {
             var arrow = arrows[dir];
             arrow.able && arrow.el.show();
         }
     };

     /**
      * [ 隐藏翻页按钮]
      * @param  {[type]} unlock [description]
      * @return {[type]}        [description]
      */
     ToolBar.prototype.hidePageBar = function () {
         var arrows = this.arrows;
         for (var dir in arrows) {
             arrows[dir].el.hide();
         }
     };

     /**
      * [description]
      * @param  {[type]} state   [description]
      * @param  {[type]} pointer [description]
      * @return {[type]}         [description]
      */
     ToolBar.prototype.toggle = function (state, pointer) {
         if (this.Lock) return;
         this.Lock = true;

         switch (state) {
             case 'show':
                 this.showToolbar(pointer);
                 break;
             case 'hide':
                 this.hideToolbar(pointer);
                 break;
             default:
                 this.barStatus ? this.hideToolbar(pointer) : this.showToolbar(pointer);
                 break;
         }
     };

     /**
      * [ 显示工具栏]
      * @param  {[type]} pointer [description]
      * @return {[type]}         [description]
      */
     ToolBar.prototype.showToolbar = function (pointer) {
         switch (pointer) {
             case 'controlBar':
                 this.showTopBar();
                 break;
             case 'button':
                 this.showPageBar();
                 this.Lock = false;
                 break;
             default:
                 this.showTopBar();
                 this.showPageBar();
         }
     };

     /**
      * [ 隐藏工具栏]
      * @param  {[type]} pointer [description]
      * @return {[type]}         [description]
      */
     ToolBar.prototype.hideToolbar = function (pointer) {
         switch (pointer) {
             case 'controlBar':
                 this.hideTopBar();
                 break;
             case 'button':
                 this.hidePageBar();
                 this.Lock = false;
                 break;
             default:
                 this.hideTopBar();
                 this.hidePageBar();
         }
     };

     /**
      * 显示IOS系统工具栏
      *  iOS状态栏0=show,1=hide
      * @return {[type]} [description]
      */
     ToolBar.prototype.showSystemBar = function () {
         isIOS$1 && Xut.Plugin.statusbarPlugin.setStatus(null, null, 0);
     };

     /**
      * 隐藏IOS系统工具栏
      * @return {[type]} [description]
      */
     ToolBar.prototype.hideSystemBar = function () {
         isIOS$1 && Xut.Plugin.statusbarPlugin.setStatus(null, null, 1);
     };

     //创建SVG按钮
     ToolBar.prototype.createSVGIcon = function (el, callback) {
         var options = {
             speed: 6000,
             size: {
                 w: this.iconHeight,
                 h: this.iconHeight
             },
             onToggle: callback
         };
         return new svgIcon(el, iconConfig, options);
     };

     //重置翻页按钮,状态以工具栏为标准
     ToolBar.prototype.reset = function () {
         this.barStatus ? this.showPageBar() : this.hidePageBar();
     };

     var sToolbar = ToolBar.extend({
         init: function init(options) {
             this.arrows = Object.create(null);
             this.curTips = null; //当前页码对象
             this.Lock = false; //操作锁
             this.delay = 50; //动画延时
             this.hasTopBar = true; //有顶部工具条
             this.controlBar = options.controlBar;
             this.container = options.container;
             this.pageMode = options.pageMode;
             this.pageTotal = options.pageTotal;
             this.currentPage = options.currentPage;

             //配置属性
             //config
             this.config = Xut.config;
             this.initConfig(this.config);

             this.initTool();
         }
     });

     sToolbar.prototype.initTool = function () {

         var bar = this.controlBar,
             setting = this.settings;

         //工具栏的显示状态
         this.barStatus = bar.css('display') === 'none' ? false : true;

         //工具栏摆放位置
         this.toolbarPostion(bar, setting.ToolbarPos);

         //首页按钮
         setting.HomeBut && this.createHomeIcon(bar);

         //目录按钮
         setting.ContentBut && this.createDirIcon(bar);

         //添加标题
         this.createTitle(bar);

         //关闭子文档
         setting.CloseBut && this.createCloseIcon(bar);

         //页码数
         setting.PageBut && this.createPageNum(bar);

         //工具栏隐藏按钮
         this.createHideToolbar(bar);

         //翻页按钮
         if (this.pageMode == 2) {
             this.createArrows();
         }

         //邦定事件
         this.bindButtonsEvent(bar);
     };

     //工具条的位置
     sToolbar.prototype.toolbarPostion = function (bar, position) {
         var height = this.iconHeight,
             TOP = this.barHeight;
         if (position == 1) {
             //在底部
             bar.css({
                 bottom: 0,
                 height: height + 'px'
             });
         } else {
             //在顶部
             bar.css({
                 top: 0,
                 height: height + 'px',
                 paddingTop: TOP + 'px'
             });
         }
     };

     //创建主页按钮
     sToolbar.prototype.createHomeIcon = function (bar) {
         var str = '<div id="backHome" style="float:left;text-indent:0.25em;height:{0}px;line-height:{1}px;color:#007aff">主页</div>',
             height = this.iconHeight,
             html = $(String.format(str, height, height));
         bar.append(html);
     };

     //创建目录按钮
     sToolbar.prototype.createDirIcon = function (bar) {
         var str = '<div id="backDir" class="xut-controlBar-backDir" style="float:left;margin-left:4px;width:{0}px;height:{1}px;background-size:cover"></div>',
             height = this.iconHeight,
             html = $(String.format(str, height, height));
         bar.append(html);
     };

     //创建页码数
     sToolbar.prototype.createPageNum = function (bar) {
         var height = this.iconHeight,
             marginTop = height * 0.25,
             iconH = height * 0.5,
             str,
             html;
         str = '<div class="xut-controlBar-pageNum" style="float:right;margin:{0}px 4px;padding:0 0.25em;height:{1}px;line-height:{2}px;border-radius:0.5em"><span>{3}</span>/<span>{4}</span></div>';
         html = $(String.format(str, marginTop, iconH, iconH, this.currentPage, this.pageTotal));
         this.curTips = html.children().first();
         bar.append(html);
     };

     //工具栏隐藏按钮
     sToolbar.prototype.createHideToolbar = function (bar) {
         var html,
             style,
             height = this.iconHeight;
         style = 'float:right;width:' + height + 'px;height:' + height + 'px;background-size:cover';
         html = '<div id="hideToolbar" class="xut-controlBar-hide" style="' + style + '"></div>';
         bar.append(html);
     };

     //关闭子文档按钮
     sToolbar.prototype.createCloseIcon = function (bar) {
         var style,
             html,
             height = this.iconHeight;
         style = 'float:right;margin-right:4px;width:' + height + 'px;height:' + height + 'px';
         html = '<div class="si-icon" data-icon-name="close" style="' + style + '"></div>';
         html = $(html);
         this.createSVGIcon(html[0], function () {
             if (SUbDOCCONTEXT) {
                 SUbDOCCONTEXT.Xut.publish('subdoc:dropApp');
             } else {
                 Xut.publish('magazine:dropApp');
             }
         });
         bar.append(html);
     };

     //应用标题
     sToolbar.prototype.createTitle = function (bar) {
         var style,
             html,
             appName = this.appName,
             height = this.iconHeight;
         style = 'width:100%;position:absolute;line-height:' + height + 'px;pointer-events:none';
         html = '<div class="xut-controlBar-title" style="z-index:-99;' + style + '">' + appName + '</div>';
         bar.append(html);
     };

     /**
      * [ 返回按钮]
      * @return {[type]} [description]
      */
     sToolbar.prototype.createBackIcon = function (container) {
         var style,
             html,
             height = this.iconHeight;
         style = 'float:left;width:' + height + 'px;height:' + height + 'px';
         html = '<div class="si-icon" data-icon-name="back" style="' + style + '"></div>';
         html = $(html);
         this.createSVGIcon(html[0], function () {
             Xut.Application.Suspend({
                 dispose: function dispose() {
                     //停止热点动作
                     Xut.Application.DropApp(); //退出应用
                 },
                 processed: function processed() {
                     Xut.Application.DropApp(); //退出应用
                 }
             });
         });
         container.append(html);
     };

     /**
      * 更新页码指示
      * @return {[type]} [description]
      */
     sToolbar.prototype.updatePointer = function (pageIndex) {
         this.curTips && this.curTips.html(pageIndex + 1);
     };

     sToolbar.prototype.bindButtonsEvent = function (bar) {
         var that = this;
         bar.on("touchend mouseup", function (e) {
             var type = Xut.plat.evtTarget(e).id;
             switch (type) {
                 case "backHome":
                     that.homeControl();
                     break;
                 case "backDir":
                     that.navigationBar();
                     break;
                 case 'hideToolbar':
                     that.hideTopBar();
                     break;
             }
         });
     };

     /**
      * [ 跳转处理]
      * @return {[type]} [description]
      */
     sToolbar.prototype.homeControl = function () {
         if (DUKUCONFIG) {
             Xut.Application.Suspend({
                 dispose: function dispose() {
                     Xut.Application.DropApp(); //退出应用
                 },
                 processed: function processed() {
                     Xut.Application.DropApp(); //退出应用
                 }
             });
             return;
         }

         Xut.Application.Suspend({
             dispose: function dispose(promptMessage) {
                 //停止热点动作
                 //promptMessage('再按一次将跳至首页！')
             },
             processed: function processed() {
                 Xut.View.GotoSlide(1); //调整到首页
             }
         });
     };

     /**
      * [ 打开目录关闭当前页面活动热点]
      * @return {[type]} [description]
      */
     sToolbar.prototype.navigationBar = function () {
         initNavBar(Xut.Presentation.GetPageIndex());
     };

     /**
      * [ 显示顶部工具栏]
      * @return {[type]} [description]
      */
     sToolbar.prototype.showTopBar = function () {
         var that = this;

         if (this.barStatus) {
             this.Lock = false;
             return;
         }
         this.controlBar.css({
             'display': 'block',
             'opacity': 0
         });

         setTimeout(function () {
             that.controlBar.animate({
                 'opacity': 1
             }, that.delay, 'linear', function () {
                 _close();
                 that.showSystemBar();
                 that.barStatus = true;
                 that.Lock = false;
             });
         });
     };

     /**
      * [ 隐藏顶部工具栏]
      * @return {[type]} [description]
      */
     sToolbar.prototype.hideTopBar = function () {
         var that = this;

         if (!this.barStatus) {
             this.Lock = false;
             return;
         }

         this.controlBar.animate({
             'opacity': 0
         }, that.delay, 'linear', function () {
             _close();
             that.controlBar.hide();
             that.hideSystemBar();
             that.barStatus = false;
             that.Lock = false;
         });
     };

     //销毁
     sToolbar.prototype.destroy = function () {
         this.controlBar.off();
         this.controlBar = null;
         this.arrows = null;
         this.curTips = null;
         this.barStatus = false;
     };

     var fToolbar = ToolBar.extend({
         init: function init(options) {
             this.pageTips = null;
             this.currTip = null;
             this.tipsMode = 0;
             this.top = 0;
             this.Lock = false;
             this.delay = 50;
             this.hasTopBar = false;
             this.barStatus = true;
             this.arrows = Object.create(null);
             //options
             this.pageMode = options.pageMode;
             this.id = options.id;
             this.container = options.container;
             this.tbType = options.tbType;
             this.pageTotal = options.pageTotal;
             this.currentPage = options.currentPage;

             //配置属性
             //config
             this.config = Xut.config;
             this.initConfig(this.config);

             this.initTool();
         }
     });

     /**
      * 创建工具栏
      * tbType:
      *		0	禁止工具栏
      *		1	系统工具栏   - 显示IOS系统工具栏
      *		2	场景工具栏   - 显示关闭按钮
      *		3	场景工具栏   - 显示返回按钮
      *		4	场景工具栏   - 显示顶部小圆点式标示
      *	pageMode:
      *  	0禁止滑动
      *	  	1允许滑动无翻页按钮
      *	   	2 允许滑动带翻页按钮
      * @return {[type]} [description]
      */
     fToolbar.prototype.initTool = function () {
         var container = this.container,
             type;

         container.hide();
         this.controlBar = [];

         while (type = this.tbType.shift()) {
             switch (type) {
                 case 1:
                     this.createSystemBar();
                     break;
                 case 2:
                     this.createCloseIcon();
                     break;
                 case 3:
                     this.createBackIcon(container);
                     break;
                 case 4:
                     this.createPageTips();
                     break;
                 default:
                     this.barStatus = false;
                     this.hasTopBar = false;
                     break;
             }
         }

         //创建翻页按钮
         if (this.pageMode === 2) {
             this.createArrows();
         }

         container.show();

         //邦定事件
         this.bindButtonsEvent();
     };

     /**
      * 系统工具栏
      */
     fToolbar.prototype.createSystemBar = function () {
         var id = this.id,
             TOP = this.barHeight,
             html = '',
             style = 'top:0;height:' + this.iconHeight + 'px;padding-top:' + TOP + 'px';
         html = '<div id="controlBar' + id + '" class="xut-controlBar" style="' + style + '"></div>';
         html = $(html);
         this.top = TOP;
         this.showSystemBar();
         this.createBackIcon(html);
         this.createTitle(html);
         this.createPageNum(html);
         this.controlBar = html;
         this.container.append(html);
         this.hasTopBar = true;
     };

     /**
      * 页码小圆点
      */
     fToolbar.prototype.createPageTips = function () {
         var chapters = this.pageTotal,
             height = this.iconHeight,
             TOP = this.top,
             isIOS = Xut.plat.isIOS,
             html = '';

         //如果只有一页则不显示小圆
         if (chapters < 2) {
             return '';
         }

         var calculate = this.config.proportion.calculateContainer();
         //圆点尺寸
         var size = isIOS ? 7 : Math.max(8, Math.round(this.propHeight * 8)),
             width = 2.5 * size,
             //圆点间距
         tipsWidth = chapters * width,
             //圆点总宽度
         top = (height - size) / 2,
             //保持圆点垂直居中
         left = (calculate.width - tipsWidth) / 2; //保持圆点水平居中

         html = '<ul class="xut-scenario-tips"  style="top:' + TOP + 'px;left:' + left + 'px;width:' + tipsWidth + 'px;opacity:0.6">';
         for (var i = 1; i <= chapters; i++) {
             html += '<li class="xut-scenario-dark" style="float:left;width:' + width + 'px;height:' + height + 'px;" data-index="' + i + '">';
             html += '<div class="xut-scenario-radius" style="width:' + size + 'px;height:' + size + 'px;margin:' + top + 'px auto"></div></li>';
         }
         html += '</ul>';
         html = $(html);
         this.pageTips = html.children();
         this.tipsMode = 1;
         this.controlBar.push(html);
         this.container.append(html);
     };

     /**
      * 更新页码指示
      * @return {[type]} [description]
      */
     fToolbar.prototype.updatePointer = function (pageIndex) {
         switch (this.tipsMode) {
             case 1:
                 if (this.prevTip) {
                     this.prevTip.className = 'xut-scenario-dark';
                 }
                 this.currTip = this.pageTips[pageIndex];
                 this.currTip.className = 'xut-scenario-light';
                 this.prevTip = this.currTip;
                 break;
             case 2:
                 this.currTip.html(pageIndex + 1);
                 break;
             default:
                 break;
         }
     };

     /**
      * [ 关闭按钮]
      * @return {[type]} [description]
      */
     fToolbar.prototype.createCloseIcon = function () {
         var style,
             html,
             TOP = this.top,
             height = this.iconHeight;
         style = 'top:' + TOP + 'px;width:' + height + 'px;height:' + height + 'px';
         html = '<div class="si-icon xut-scenario-close" data-icon-name="close" style="' + style + '"></div>';
         html = $(html);
         this.createSVGIcon($(html)[0], function () {
             Xut.View.CloseScenario();
         });
         this.controlBar.push(html);
         this.container.append(html);
     };

     /**
      * [ 返回按钮]
      * @return {[type]} [description]
      */
     fToolbar.prototype.createBackIcon = function (container) {
         var style,
             html,
             TOP = this.top,
             height = this.iconHeight;
         style = 'top:' + TOP + 'px;width:' + height + 'px;height:' + height + 'px';
         html = '<div class="si-icon xut-scenario-back" data-icon-name="back" style="' + style + '"></div>';
         html = $(html);
         this.createSVGIcon(html[0], function () {
             Xut.View.CloseScenario();
         });
         this.controlBar.push(html);
         container.append(html);
     };

     //创建页码数
     fToolbar.prototype.createPageNum = function (container) {
         var pageTotal = this.pageTotal,
             TOP = this.top,
             height = this.iconHeight,
             currentPage = this.currentPage,
             style,
             html;
         style = 'position:absolute;right:4px;top:' + (height * 0.25 + TOP) + 'px;padding:0 0.25em;height:' + height * 0.5 + 'px;line-height:' + height * 0.5 + 'px;border-radius:0.5em';
         html = '<div class="xut-controlBar-pageNum" style="' + style + '">';
         html += '<span class="currentPage">' + currentPage + '</span>/<span>' + pageTotal + '</span>';
         html += '</div>';
         html = $(html);
         this.tipsMode = 2;
         this.currTip = html.children().first();
         container.append(html);
     };

     //工具栏隐藏按钮
     fToolbar.prototype.createHideToolbar = function (container) {
         var html,
             style,
             TOP = this.top,
             height = this.iconHeight,
             right = iconHeight * 2.5;
         style = 'position:absolute;right:' + right + 'px;top:' + TOP + 'px;width:' + height + 'px;height:' + height + 'px;background-size:cover';
         html = '<div class="xut-controlBar-hide" style="' + style + '"></div>';
         container.append(html);
     };

     //应用标题
     fToolbar.prototype.createTitle = function (container) {
         var style,
             html,
             appName = this.appName;
         style = 'line-height:' + this.iconHeight + 'px';
         html = '<div class="xut-controlBar-title" style="' + style + '">' + appName + '</div>';
         container.append(html);
     };

     /**
      * [ 普通按钮邦定事件]
      * @param  {[type]} bar [description]
      * @return {[type]}     [description]
      */
     fToolbar.prototype.bindButtonsEvent = function () {
         var that = this,
             index = 1,
             id = this.id;

         this.container.on("touchend touchend", function (e) {
             var target = Xut.plat.evtTarget(e),
                 type = target.className;
             switch (type) {
                 case 'xut-controlBar-hide':
                     that.hideTopBar();
                     break;
                 case 'xut-scenario-dark':
                     if (that.pageMode) {
                         index = target.getAttribute('data-index') || 1;
                         Xut.View.GotoSlide(Number(index));
                     }
                     break;
                 default:
                     break;
             }
         });
     };

     /**
      * [ 显示顶部工具栏]
      * @return {[type]} [description]
      */
     fToolbar.prototype.showTopBar = function () {
         var that = this,
             delay = this.delay,
             controlBar = this.controlBar;
         if (this.barStatus) {
             this.Lock = false;
             return;
         }
         if (this.hasTopBar) {
             controlBar.css({
                 'display': 'block',
                 'opacity': 0
             });
             setTimeout(function () {
                 controlBar.animate({
                     'opacity': 1
                 }, delay, 'linear', function () {
                     that.showSystemBar();
                     that.barStatus = true;
                     that.Lock = false;
                 });
             });
         } else {
             controlBar.forEach(function (el) {
                 el.show();
                 that.Lock = false;
                 that.barStatus = true;
             });
         }
     };

     /**
      * [ 隐藏顶部工具栏]
      * @return {[type]} [description]
      */
     fToolbar.prototype.hideTopBar = function () {
         var that = this,
             delay = this.delay,
             controlBar = this.controlBar;

         if (!this.barStatus) {
             this.Lock = false;
             return;
         }
         if (this.hasTopBar) {
             controlBar.animate({
                 'opacity': 0
             }, delay, 'linear', function () {
                 that.controlBar.hide();
                 that.hideSystemBar();
                 that.barStatus = false;
                 that.Lock = false;
             });
         } else {
             controlBar.forEach(function (el) {
                 el.hide(delay, function () {
                     that.Lock = false;
                     that.barStatus = false;
                 });
             });
         }
     };

     fToolbar.prototype.destroy = function () {
         this.container.off();
         this.controlBar = null;
         this.arrows = null;
         this.pageTips = null;
         this.currTip = null;
         this.prevTip = null;
     };

     var icons = {
     	hide: 'images/icons/arrowDown.svg'
     };
     var sLineHeiht = parseInt($('body').css('font-size')) || 16;
     var BOOKCACHE;
     //书签缓存

     function BookMark(options) {
     	this.parent = options.parent;
     	this.pageId = options.pageId;
     	this.seasonId = options.seasonId;

     	this.screenSize = Xut.config.screenSize, this.sHeight = screenSize.height, this.sWidth = screenSize.width,

     	//是否已存储
     	this.isStored = false;
     	this.init();
     }

     /**
      * 初始化
      * @return {[type]} [description]
      */
     BookMark.prototype.init = function () {
     	var $bookMark = this.createBookMark(),
     	    dom = this.parent[0],
     	    that = this;

     	this.parent.append($bookMark);
     	this.bookMarkMenu = $bookMark.eq(0);
     	//显示书签
     	setTimeout(function () {
     		that.restore();
     	}, 20);
     	//获取历史记录
     	BOOKCACHE = this.getHistory();

     	//邦定用户事件
     	Xut.plat.execEvent('on', {
     		context: dom,
     		callback: {
     			end: this
     		}
     	});
     };

     /**
      * 创建书签
      * @return {[object]} [jquery生成的dom对象]
      */
     BookMark.prototype.createBookMark = function () {
     	var height = sLineHeiht * 3,
     	    // menu的高为3em
     	box = '<div class="xut-bookmark-menu" style="width:100%;height:{0}px;left:0;top:{1}px;">' + '<div class="xut-bookmark-wrap">' + '<div class="xut-bookmark-add">加入书签</div>' + '<div class="xut-bookmark-off" style="background-image:url({2})"></div>' + '<div class="xut-bookmark-view">书签记录</div>' + '</div>' + '</div>' + '<div class="xut-bookmark-list" style="display:none;width:100%;height:{3}px;">' + '<ul class="xut-bookmark-head">' + '<li class="xut-bookmark-back">返回</li>' + '<li>书签</li>' + '</ul>' + '<ul class="xut-bookmark-body"></ul>' + '</div>';
     	box = String.format(box, height, this.sHeight, icons.hide, this.sHeight);
     	this.markHeight = height;
     	return $(box);
     };

     /**
      * 生成书签列表
      * @return {[type]} [description]
      */
     BookMark.prototype.createMarkList = function () {
     	var tmp,
     	    seasonId,
     	    pageId,
     	    list = '',
     	    box = '',
     	    self = this;

     	//取历史记录
     	_.each(BOOKCACHE, function (mark) {
     		tmp = mark.split('-');
     		seasonId = tmp[0];
     		pageId = tmp[1];
     		mark = self.getMarkId(seasonId, pageId);
     		list += '<li><a data-mark="' + mark + '" class="xut-bookmark-id" href="javascript:0">第' + pageId + '页</a><a class="xut-bookmark-del" data-mark="' + mark + '" href="javascript:0">X</a></li>';
     	});

     	return list;
     };

     /**
      * 创建存储标签
      * 存储格式 seasonId-pageId
      * @return {string} [description]
      */
     BookMark.prototype.getMarkId = function (seasonId, pageId) {
     	return seasonId + '-' + pageId;
     };

     /**
      * 获取历史记录
      * @return {[type]} [description]
      */
     BookMark.prototype.getHistory = function () {
     	var mark = _get('bookMark');
     	if (mark) {
     		return mark.split(',');
     	}
     	return [];
     };

     /**
      * 添加书签
      * @return {[type]} [description]
      */
     BookMark.prototype.addBookMark = function () {
     	var key;

     	this.updatePageInfo();
     	key = this.getMarkId(this.seasonId, this.pageId);

     	//避免重复缓存
     	if (BOOKCACHE.indexOf(key) > -1) {
     		return;
     	}
     	BOOKCACHE.push(key);
     	_set('bookMark', BOOKCACHE);
     };

     /**
      * 更新页信息
      *  针对母板层上的书签
      */
     BookMark.prototype.updatePageInfo = function () {
     	var pageData = Xut.Presentation.GetPageData();
     	this.pageId = pageData._id;
     	this.seasonId = pageData.seasonId;
     };

     /**
      * 删除书签
      * @param {object} [key] [事件目标对象]
      * @return {[type]} [description]
      */
     BookMark.prototype.delBookMark = function (target) {
     	if (!target || !target.dataset) return;

     	var key = target.dataset.mark,
     	    index = BOOKCACHE.indexOf(key);

     	BOOKCACHE.splice(index, 1);
     	_set('bookMark', BOOKCACHE);

     	if (BOOKCACHE.length == 0) {
     		_remove('bookMark');
     	}

     	//移除该行
     	$(target).parent().remove();
     };

     /**
      * 显示书签
      * @param {object} [target] [事件目标对象]
      * @return {[type]} [description]
      */
     BookMark.prototype.viewBookMark = function (target) {
     	var $bookMarkList,
     	    list = this.createMarkList();

     	if (this.bookMarkList) {
     		$bookMarkList = this.bookMarkList;
     	} else {
     		$bookMarkList = $(target).parent().parent().next();
     	}
     	//更新书签内容
     	$bookMarkList.find('.xut-bookmark-body').html(list);
     	this.bookMarkList = $bookMarkList;
     	$bookMarkList.fadeIn();
     };

     /**
      * 点击放大效果
      * @param  {[object]} target [事件目标对象]
      * @return {[type]}      [description]
      */
     BookMark.prototype.iconManager = function (target) {
     	var $icon = this.bookMarkIcon = $(target),
     	    restore = this.iconRestore;

     	$icon.css({
     		'transform': 'scale(1.2)',
     		'transition-duration': '500ms'
     	})[0].addEventListener(Xut.plat.TRANSITION_EV, restore.bind(this), false);
     };

     /**
      * 复原按钮
      * @return {[type]} [description]
      */
     BookMark.prototype.iconRestore = function () {
     	this.bookMarkIcon.css('transform', '');
     };

     /**
      * 跳转到书签页
      * @param  {[type]} target [description]
      * @return {[type]}        [description]
      */
     BookMark.prototype.goBookMark = function (target) {
     	if (!target || !target.dataset) return;

     	var key = target.dataset.mark.split('-'),
     	    seasonId = Number(key[0]),
     	    pageId = Number(key[1]);

     	this.updatePageInfo();
     	//关闭书签列表
     	this.backBookMark();

     	//忽略当前页的跳转
     	if (this.pageId == pageId && this.seasonId == seasonId) {
     		return;
     	}

     	Xut.View.LoadScenario({
     		'scenarioId': seasonId,
     		'chapterId': pageId
     	});
     };

     /**
      * 书签回退键
      * @return {[type]} [description]
      */
     BookMark.prototype.backBookMark = function () {
     	this.bookMarkList.fadeOut();
     };

     /**
      * 邦定事件
      * @param  {[type]} evt [事件]
      * @return {[type]}     [description]
      */
     BookMark.prototype.handleEvent = function (evt) {
     	var target = evt.target;
     	switch (target.className) {
     		//加入书签
     		case 'xut-bookmark-add':
     			this.addBookMark();
     			this.iconManager(target);
     			break;
     		//显示书签记录
     		case 'xut-bookmark-view':
     			this.viewBookMark(target);
     			this.iconManager(target);
     			break;
     		//关闭书签
     		case 'xut-bookmark-off':
     			this.closeBookMark(target);
     			break;
     		//返回书签主菜单
     		case 'xut-bookmark-back':
     			this.backBookMark();
     			break;
     		//删除书签记录
     		case 'xut-bookmark-del':
     			this.delBookMark(target);
     			break;
     		//跳转到书签页
     		case 'xut-bookmark-id':
     			this.goBookMark(target);
     			break;
     		default:
     			//console.log(target.className)
     			break;
     	}
     };

     /**
      * 关闭书签菜单
      * @return {[type]} [description]
      */
     BookMark.prototype.closeBookMark = function (target) {
     	this.bookMarkMenu.css({
     		transform: 'translate3d(0,0,0)',
     		'transition-duration': '1s'
     	});
     };

     /**
      * 恢复书签菜单
      */
     BookMark.prototype.restore = function () {
     	this.bookMarkMenu.css({
     		transform: 'translate3d(0,-' + this.markHeight + 'px,0)',
     		'transition-duration': '1s'
     	});
     };

     /**
      * 销毁书签
      * @return {[type]} [description]
      */
     BookMark.prototype.destroy = function () {
     	var dom = this.parent[0],
     	    events = Xut.plat;

     	dom.removeEventListener('touchend', this, false);
     	dom.removeEventListener('mouseup', this, false);

     	//菜单部分
     	if (this.bookMarkMenu) {
     		this.bookMarkMenu.remove();
     		this.bookMarkMenu = null;
     	}

     	//列表部分
     	if (this.bookMarkList) {
     		this.bookMarkList.remove();
     		this.bookMarkList = null;
     	}

     	//按钮效果
     	if (this.bookMarkIcon) {
     		this.bookMarkIcon[0].removeEventListener(events.TRANSITION_EV, this.iconRestore, false);
     		this.bookMarkIcon = null;
     	}

     	this.parent = null;
     };

     /**
      * 阅读模式工具栏
      * @param options object
      * @demo {container:页面容器,controlBar:工具栏容器,...}
      * @desc 继承自Toolbar.js
      */

     var Bar = ToolBar.extend({
         init: function init(options) {
             //左右箭头
             this.arrows = {};
             //工具栏父容器
             this.container = options.container;
             //工具栏容器
             this.controlBar = options.controlBar;
             this.pageMode = options.pageMode;
             //是否有顶部工具栏
             this.hasTopBar = true;
             this.Lock = false;
             this.delay = 50;
             //图书工具栏高度
             this.topBarHeight = this.iconHeight * 1.25;

             //配置属性
             //config
             this.config = Xut.config;
             this.initConfig(this.config);

             this.initTool();
         }
     });

     /**
      * 初始化
      */
     Bar.prototype.initTool = function () {
         //工具栏的显示状态
         var display = this.controlBar.css('display');
         this.barStatus = display == 'none' ? false : true;
         this.setToolbarStyle();
         this.createBackIcon();
         this.createDirIcon();
         this.createMarkIcon();
         // this.createStarIcon();

         //翻页按钮
         if (this.pageMode == 2) {
             this.createArrows();
         }

         //监听事件
         var ele = this.container[0];

         Xut.plat.execEvent('on', {
             context: ele,
             callback: {
                 end: this
             }
         });
     };

     /**
      * 工具条的样式
      */
     Bar.prototype.setToolbarStyle = function () {
         var height = this.topBarHeight,
             TOP = this.barHeight; //系统工具栏占用的高度

         //在顶部
         this.controlBar.css({
             top: 0,
             height: height + 'px',
             paddingTop: TOP + 'px',
             backgroundColor: 'rgba(0, 0, 0, 0.2)', //transparent
             fontSize: '0.625em',
             color: 'white'
         });
     };

     /**
      * 更新页码
      */
     Bar.prototype.updatePointer = function () {}
     //预留


     /**
      * 创建目录图标
      */
     ;Bar.prototype.createDirIcon = function (bar) {
         var icon = document.createElement('div');
         icon.innerHTML = '目录';
         icon.style.width = this.iconHeight + 'px';
         icon.style.lineHeight = 1.5 * this.topBarHeight + 'px';
         icon.className = 'xut-book-bar-dir';
         this.controlBar.append(icon);
     };

     //创建书签图标
     Bar.prototype.createMarkIcon = function (bar) {
         var icon = document.createElement('div');
         icon.innerHTML = '书签';
         icon.style.width = this.iconHeight + 'px';
         icon.style.lineHeight = 1.5 * this.topBarHeight + 'px';
         icon.className = 'xut-book-bar-mark';
         this.controlBar.append(icon);
     };

     /**
      * 创建评分图标
      */
     Bar.prototype.createStarIcon = function (bar) {
         var icon = document.createElement('div');
         icon.innerHTML = '评分';
         icon.style.width = this.iconHeight + 'px';
         icon.style.lineHeight = 1.5 * this.topBarHeight + 'px';
         icon.className = 'xut-book-bar-star';
         this.controlBar.append(icon);
     };

     /**
      * 后退按钮
      * @return {[type]} [description]
      */
     Bar.prototype.createBackIcon = function () {
         var icon = document.createElement('div');
         icon.style.width = this.topBarHeight + 'px';
         icon.className = 'xut-book-bar-back';
         this.controlBar.append(icon);
     };

     /**
      * 显示顶部工具栏
      * @return {[type]} [description]
      */
     Bar.prototype.showTopBar = function () {
         var that = this;

         if (this.barStatus) {
             this.Lock = false;
             return;
         }

         this.controlBar.css({
             'display': 'block',
             'opacity': 0
         });

         setTimeout(function () {
             that.controlBar.animate({
                 'opacity': 1
             }, that.delay, 'linear', function () {
                 that.showSystemBar();
                 that.barStatus = true;
                 that.Lock = false;
             });
         }, 50);
     };

     /**
      * 隐藏顶部工具栏
      * @return {[type]} [description]
      */
     Bar.prototype.hideTopBar = function () {
         var that = this;

         if (!this.barStatus) {
             this.Lock = false;
             return;
         }

         this.controlBar.animate({
             'opacity': 0
         }, that.delay, 'linear', function () {
             that.controlBar.hide();
             that.hideSystemBar();
             that.barStatus = false;
             that.Lock = false;
         });
     };

     /**
      * 创建目录菜单
      */
     Bar.prototype.createDirMenu = function () {
         var self = this;
         var wrap = document.createElement('div');
         var mask = document.createElement('div');
         //添加遮层
         mask.className = 'xut-book-menu-mask';
         //获取内容
         this.getDirContent();
         wrap.className = 'xut-book-menu';
         wrap.innerHTML = '<ul>' + this.contentText + '</ul>';
         this.container.append(wrap);
         //是否滚动
         this.isScrolled = false;

         //添加滚动条
         //url : http://iscrolljs.com/
         this.iscroll = new iScroll(wrap, {
             scrollbars: true,
             fadeScrollbars: true,
             scrollX: false
         });

         this.menu = wrap;

         this.setColor();

         this.iscroll.on('scrollStart', function (e) {
             self.isScrolled = true;
         });

         this.iscroll.on('scrollEnd', function (e) {
             self.isScrolled = false;
         });

         wrap.appendChild(mask);
     };

     /**
      *  显示目录菜单
      */
     Bar.prototype.showDirMenu = function () {
         //获取当前页面
         var page = Xut.Presentation.GetPageElement();

         if (this.menu) {
             this.menu.style.display = 'block';
         } else {
             this.createDirMenu();
         }

         //添加模糊效果
         page.addClass('filter');
         this.page = page;

         //隐藏顶部工具栏
         this.controlBar.hide();
         var iscroll = this.iscroll;
         //自动定位到上一位置
         if (iscroll.y > iscroll.wrapperHeight) {
             iscroll.scrollToElement(this.selectedChild);
         }
     };

     /**
      *  隐藏目录菜单
      */
     Bar.prototype.hideDirMenu = function () {
         this.menu.style.display = 'none';
         //恢复顶部工具栏
         this.controlBar.show();
         //移除模糊效果
         this.page.removeClass('filter');
     };

     /**
      *  创建目录内容
      */
     Bar.prototype.getDirContent = function () {

         var Api = Xut.Presentation;
         var data = Api.GetAppSectionData();
         var sns = data[0];
         var seaonId = sns._id;
         var cids = Xut.data.Chapter;

         ////////////////////////////
         //针对book模式，合并了Season的参数 //
         //1 SeasonTitle
         //2 ChapterList列表的范围区间
         ////////////////////////////
         data = parseJSON(sns.parameter);

         if (!data) {
             console.log('book模式parameter数据出错');
             return;
         }

         //二级目录
         function secondaryDirectory(startCid, endCid) {
             var cid,
                 str = '';
             for (startCid; startCid <= endCid; startCid++) {
                 cid = cids.item(startCid - 1);
                 if (cid && cid.chapterTitle) {
                     str += '<section><a class="xut-book-menu-item" data-mark=' + seaonId + '-' + startCid + ' href="javascript:0">' + cid.chapterTitle + '</a></section>';
                 }
             }
             return str;
         }

         var i = 0;
         var len = data.length;
         var li = '<li class="title"><center class="select">目录</center></li>';
         var seasonInfo, mark, seasonTitle, seaonId, startCid, endCid;

         for (i; i < len; i++) {
             seasonInfo = data[i];
             startCid = seasonInfo.ChapterList[0];
             endCid = seasonInfo.ChapterList[1];
             mark = seaonId + '-' + startCid;
             if (seasonInfo.SeasonTitle.length <= 0) continue;
             seasonTitle = seasonInfo.SeasonTitle || '第' + (i + 1) + '章';
             //第一级目录
             li += '<li>' + '<a class="xut-book-menu-item" data-mark="' + mark + '" href="javascript:0">' + seasonTitle + '</a>' +
             //第二级目录
             secondaryDirectory(startCid, endCid);
             '</li>';
         }

         this.contentText = li;
     };

     /**
      * 突出显示点击颜色
      */
     Bar.prototype.setColor = function (element) {
         if (this.selectedChild) {
             this.selectedChild.className = 'xut-book-menu-item';
         }

         element = element || this.menu.querySelectorAll('li')[1].children[0];
         element.className = 'select';
         this.selectedChild = element;
     };

     /**
      * 跳转到指定书页
      */
     Bar.prototype.turnToPage = function (target) {
         //忽略滚动点击
         if (this.isScrolled) return;
         this.setColor(target);
         this.hideDirMenu();
         var data = target.dataset.mark || '';
         if (data) {
             data = data.split('-');
             Xut.View.LoadScenario({
                 'scenarioId': data[0],
                 'chapterId': data[1]
             });
         }
     };

     /**
      * 显示书签
      */
     Bar.prototype.showBookMark = function () {
         if (this.bookMark) {
             this.bookMark.restore();
         } else {
             var pageData = Xut.Presentation.GetPageData();
             this.bookMark = new BookMark({
                 parent: this.container,
                 seasonId: pageData.seasonId,
                 pageId: pageData._id
             });
         }
     };

     /**
      * 返回首页
      */

     Bar.prototype.goBack = function () {
         var self = this;
         Xut.Application.Suspend({
             dispose: function dispose(promptMessage) {
                 //停止热点动作
                 //promptMessage('再按一次将跳至首页！')
             },
             processed: function processed() {
                 Xut.View.GotoSlide(1); //调整到首页
                 self.setColor();
             }
         });
     };

     /**
      * 事件处理
      */
     Bar.prototype.handleEvent = function (e) {

         var target = e.target || e.srcElement;

         var name = target.className;

         switch (name) {
             case 'xut-book-bar-back':
                 this.goBack();
                 //返回
                 break;
             case 'xut-book-bar-dir':
                 //目录
                 this.showDirMenu();
                 break;
             case 'xut-book-bar-mark':
                 //书签
                 this.showBookMark();
                 break;
             case 'xut-book-bar-star':
                 //评分
                 break;
             case 'xut-book-menu-item':
                 //跳转
                 this.turnToPage(target);
                 break;
             case 'xut-book-menu-mask':
             case 'select':
                 this.hideDirMenu();
                 break;
             default:
                 // console.log(name+':undefined')
                 break;
         }
     };

     /**
      * 销毁
      */
     Bar.prototype.destroy = function () {
         this.iscroll && this.iscroll.destroy();
         this.bookMark && this.bookMark.destroy();
         var ele = this.container[0];
         ele.removeEventListener('touchend', this, false);
         ele.removeEventListener('mouseup', this, false);
         this.iscroll = null;
         this.menu = null;
         this.page = null;
     };

     /**
      *
      * 基本事件管理
      *
      */

     var observe = function (slice) {

         var ArrayProto = Array.prototype;
         var nativeIndexOf = ArrayProto.indexOf;
         var slice = ArrayProto.slice;

         function bind(event, fn) {
             var i, part;
             var events = this.events = this.events || {};
             var parts = event.split(/\s+/);
             var num = parts.length;

             for (i = 0; i < num; i++) {
                 events[part = parts[i]] = events[part] || [];
                 if (_indexOf(events[part], fn) === -1) {
                     events[part].push(fn);
                 }
             }
             return this;
         }

         function one(event, fn) {
             // [notice] The value of fn and fn1 is not equivalent in the case of the following MSIE.
             // var fn = function fn1 () { alert(fn === fn1) } ie.<9 false
             var fnc = function fnc() {
                 this.unbind(event, fnc);
                 fn.apply(this, slice.call(arguments));
             };
             this.bind(event, fnc);
             return this;
         }

         function unbind(event, fn) {
             var eventName, i, index, num, parts;
             var events = this.events;

             if (!events) return this;

             //指定
             if (arguments.length) {
                 parts = event.split(/\s+/);
                 for (i = 0, num = parts.length; i < num; i++) {
                     if ((eventName = parts[i]) in events !== false) {
                         index = fn ? _indexOf(events[eventName], fn) : -1;
                         if (index !== -1) {
                             events[eventName].splice(index, 1);
                         }
                     }
                 }
             } else {
                 this.events = null;
             }

             return this;
         }

         function trigger(event) {
             var args, i;
             var events = this.events,
                 handlers;

             if (!events || event in events === false) {
                 return this;
             }

             args = slice.call(arguments, 1);
             handlers = events[event];
             for (i = 0; i < handlers.length; i++) {
                 handlers[i].apply(this, args);
             }
             return this;
         }

         function _indexOf(array, needle) {
             var i, l;

             if (nativeIndexOf && array.indexOf === nativeIndexOf) {
                 return array.indexOf(needle);
             }

             for (i = 0, l = array.length; i < l; i++) {
                 if (array[i] === needle) {
                     return i;
                 }
             }
             return -1;
         }

         return function () {
             this.$watch = this.bind = bind;
             this.$off = this.unbind = unbind;
             this.$emit = trigger;
             this.$once = one;
             return this;
         };
     }([].slice);

     /**
      * 初始化首次范围
      * @return {[type]} [description]
      */
     function initPointer(init, pagetotal) {
         var leftscope = 0,
             pagePointer = {};

         if (init === leftscope) {
             //首页
             pagePointer['currIndex'] = init;
             pagePointer['rightIndex'] = init + 1;
         } else if (init === pagetotal - 1) {
             //首页
             pagePointer['currIndex'] = init;
             pagePointer['leftIndex'] = init - 1;
         } else {
             //中间页
             pagePointer['leftIndex'] = init - 1;
             pagePointer['currIndex'] = init;
             pagePointer['rightIndex'] = init + 1;
         }

         return pagePointer;
     }

     //============================
     //
     //    自定义事件类型
     //
     // //触屏点击
     // 'onSwipeDown',
     // //触屏移动
     // 'onSwipeMove',
     // //触屏松手
     // 'onSwipeUp',
     // //触屏松手 滑动处理
     // 'onSwipeUpSlider',
     // //松手动画（反弹）
     // 'onFlipSliding',
     // //执行反弹
     // 'onFlipRebound',
     // //动画完成
     // 'onAnimComplete',
     // //退出应用
     // 'onDropApp'

     //element   根容器元素
     //pageIndex 页面索引
     function GlobalEvent(options, config) {

         options.hindex = options.initIndex;

         this.screenWidth = config.screenSize.width;

         _.extend(this, options);

         // this.element = options.rootPage;
         this.element = options.container;

         /**
          * 翻页时间
          * @type {Number}
          */
         this.speed = options.pageFlip ? 0 : 500;

         /**
          * 翻页速率
          * @type {Number}
          */
         this.clickSpeed = 600;

         /**
          * 速率
          * @type {[type]}
          */
         this.speedRate = this.originalRate = this.speed / this.screenWidth;

         /**
          * 计算初始化页码
          * @type {[type]}
          */
         this.pagePointer = initPointer(options.hindex, options.pagetotal);

         /**
          * 初始化绑定事件
          */
         if (!this.prveIndex) {
             this.prveIndex = this.hindex;
         }

         //ibooks不绑定全局事件
         // if (!Xut.IBooks.runMode()) {
         this._bindEvt();
         // }

         //用于查找跟元素
         var ul = this.element.querySelectorAll('ul');
         this.bubbleNode = {
             page: ul[0],
             master: ul[1]
         };
     };

     var edProto = GlobalEvent.prototype;

     /**
      * 首位越界处理，不反弹
      * @param  {[type]} deltaX [description]
      * @return {[type]}        [description]
      */
     edProto.overstep = function (deltaX) {
         //首页,并且是左滑动
         if (this.hindex === 0 && deltaX > 0) {
             return true;
             //尾页
         } else if (this.hindex === this.pagetotal - 1 && deltaX < 0) {
                 return true;
             }
     };

     /**
      * 前翻页接口
      * @return {[type]} [description]
      */
     edProto.prev = function () {
         if (!this.overstep(1)) {
             this.slideTo('prev');
         };
     };

     /**
      * 后翻页接口
      * @return {Function} [description]
      */
     edProto.next = function () {
         if (!this.overstep(-1)) {
             this.slideTo('next');
         }
     };

     /**
      * 检车是否还在移动中
      * @return {Boolean} [description]
      */
     edProto.isMove = function () {
         return this.fliplock;
     };

     /**
      * 是否为边界
      * @param  {[type]}  distance [description]
      * @return {Boolean}          [description]
      */
     edProto.isBorder = function (distance) {
         //起点左偏移
         if (this.hindex === 0 && distance > 0) {
             return true;
         }
         //终点右偏移
         if (this.hindex === this.pagetotal - 1 && distance < 0) {
             return true;
         }
     };

     /**
      * 目标元素
      * 找到li元素
      * @param  {Function} callback [description]
      * @return {[type]}            [description]
      */
     edProto.findRootElement = function (point, pageType) {
         var liNode,
             map,
             hindex = this.hindex,
             sectionRang = this.sectionRang,

         //找到对应的li
         childNodes = this.bubbleNode[pageType].childNodes,
             numNodes = childNodes.length;

         while (numNodes--) {
             liNode = childNodes[numNodes];
             map = liNode.getAttribute('data-map');
             if (sectionRang) {
                 hindex += sectionRang.start;
             }
             if (map == hindex) {
                 return liNode;
             }
             hindex = this.hindex;
         }
     };

     /**
      * 溢出控制
      * @param  {[type]} direction [description]
      * @return {[type]}           [description]
      */
     edProto.scopePointer = function (direction) {
         var overflow,
             pointer = this.pagePointer,
             fillength = Object.keys(pointer).length;

         switch (direction) {
             case 'prev':
                 //前翻页
                 overflow = pointer.currIndex === 0 && fillength === 2 ? true : false;
                 break;
             case 'next':
                 //后翻页
                 overflow = pointer.currIndex === this.pagetotal - 1 && fillength === 2 ? true : false;
                 break;
         }

         return {
             pointer: pointer,
             overflow: overflow //是否溢出
         };
     };

     //转换页码索引
     //direction 方向
     //pointer 当前页码标示
     //[17 18 19]  pagePointer
     //[18 19 20]  转换后
     // 17 销毁
     // 20 创建
     edProto.shiftPointer = function (pointer) {
         var createPointer, //创建的页
         destroyPointer; //销毁的页

         switch (this.direction) {
             case 'prev':
                 //前处理
                 createPointer = pointer.leftIndex - 1;
                 destroyPointer = pointer.rightIndex;
                 break;
             case 'next':
                 //后处理
                 createPointer = pointer.rightIndex + 1;
                 destroyPointer = pointer.leftIndex;
                 break;
         }

         pointer['createPointer'] = createPointer;
         pointer['destroyPointer'] = destroyPointer;

         return pointer;
     };

     //修正页码指示
     edProto.revisedFilpPointer = function (pointer) {

         //需要停止动作的页面索引
         var stopPointer = pointer.currIndex;

         switch (this.direction) {
             case 'prev':
                 //前处理
                 if (-1 < pointer.createPointer) {
                     //首页情况
                     this.updataPointer(pointer.createPointer, pointer.leftIndex, pointer.currIndex);
                 }
                 if (-1 === pointer.createPointer) {
                     this.pagePointer['rightIndex'] = pointer.currIndex;
                     this.pagePointer['currIndex'] = pointer.leftIndex;
                     delete this.pagePointer['leftIndex'];
                 }
                 break;
             case 'next':
                 //后处理
                 if (this.pagetotal > pointer.createPointer) {
                     this.updataPointer(pointer.currIndex, pointer.rightIndex, pointer.createPointer);
                 }
                 if (this.pagetotal === pointer.createPointer) {
                     //如果是尾页
                     this.pagePointer['leftIndex'] = pointer.currIndex;
                     this.pagePointer['currIndex'] = pointer.rightIndex;
                     delete this.pagePointer['rightIndex'];
                 }
                 break;
         }

         this.pagePointer['createPointer'] = pointer.createPointer;
         this.pagePointer['destroyPointer'] = pointer.destroyPointer;
         this.pagePointer['stopPointer'] = stopPointer;

         return this.pagePointer;
     };

     //更新页码标示
     edProto.updataPointer = function (leftIndex, currIndex, rightIndex) {
         if (arguments.length === 3) {
             this.pagePointer = {
                 'leftIndex': leftIndex,
                 'currIndex': currIndex,
                 'rightIndex': rightIndex
             };
             return;
         }

         if (arguments.length === 1) {
             var data = leftIndex;
             var viewFlip = data['viewFlip'];

             this.fixHindex(data.targetIndex);

             if (viewFlip.length === 3) {
                 this.updataPointer(viewFlip[0], viewFlip[1], viewFlip[2]);
             }
             if (viewFlip.length === 2) {
                 if (viewFlip[0] === 0) {
                     //首页
                     this.pagePointer['rightIndex'] = viewFlip[1];
                     this.pagePointer['currIndex'] = viewFlip[0];
                     delete this.pagePointer['leftIndex'];
                 } else {
                     //尾页
                     this.pagePointer['leftIndex'] = viewFlip[0];
                     this.pagePointer['currIndex'] = viewFlip[1];
                     delete this.pagePointer['rightIndex'];
                 }
             }
             return;
         }
     };

     //修正页面索引
     edProto.fixHindex = function (currIndex) {
         this.hindex = currIndex; //翻页索引
     };

     edProto.slideTo = function (direction) {
         var resolve;
         //如果在忙碌状态,如果翻页还没完毕
         if (Xut.busyBarState || this.fliplock) {
             return;
         };
         resolve = this.scopePointer(direction);
         if (resolve.overflow) return;
         this.startAnimTo(resolve.pointer, direction);
     };

     edProto.startAnimTo = function (pointer, direction) {
         this.fliplock = true;
         this.prveHindex = this.hindex;
         this.direction = direction;
         this.judgeQuickTurn();
         if (direction === 'next') {
             this.nextRun(pointer);
         } else {
             this.preRun(pointer);
         }
     };

     //上翻页
     edProto.preRun = function (pointer) {
         var pointers,
             me = this;

         function createPrev() {
             pointers = me.shiftPointer(pointer);
             pointers = me.revisedFilpPointer(pointers);
             me.sliderStop(pointers);
             me.fixHindex(pointers.currIndex);
         }

         this.processorMove({
             'pageIndex': this.hindex,
             'speed': this.calculatespeed(),
             'distance': 0,
             'direction': this.direction,
             'action': 'flipOver'
         });

         //动画执行
         setTimeout(createPrev);
     };

     //下翻页
     edProto.nextRun = function (pointer) {
         var pointers,
             me = this;

         function createNext() {
             pointers = me.shiftPointer(pointer);
             pointers = me.revisedFilpPointer(pointers);
             me.sliderStop(pointers);
             me.fixHindex(pointers.currIndex);
         }

         this.processorMove({
             'pageIndex': this.hindex,
             'speed': this.calculatespeed(),
             'distance': 0,
             'direction': this.direction,
             'action': 'flipOver'
         });

         //动画执行
         setTimeout(createNext);
     };

     /**
      * 判断是否快速翻页
      * @return {[type]} [description]
      */
     edProto.judgeQuickTurn = function () {

         var startDate = +new Date();

         if (this.preClickTime) {
             if (startDate - this.preClickTime < this.clickSpeed) {
                 this.setRate();
             }
         }

         this.preClickTime = +new Date();
     };

     /**
      * 计算滑动速度
      * @return {[type]} [description]
      */
     edProto.calculatespeed = function () {
         return (this.screenWidth - Math.abs(this.deltaX)) * this.speedRate || this.speed;
     };

     /**
      * 处理松手后滑动
      * pageIndex 页面
      * distance  移动距离
      * speed     时间
      * viewTag   可使区标记
      * follow    是否为跟随滑动
      * @return {[type]} [description]
      */
     edProto.processorMove = function (data) {
         var pagePointer = this.pagePointer;
         data.leftIndex = pagePointer.leftIndex;
         data.rightIndex = pagePointer.rightIndex;
         this.$emit('onSwipeMove', data);
     };

     /**
      * 滑动事件派发处理
      * 停止动画,视频 音频
      * @return {[type]} [description]
      */
     edProto.sliderStop = function (pointers) {
         this.$emit('onSwipeUpSlider', pointers);
     };

     /*********************************************************************
      *                 页面交互
      *                                                         *
      **********************************************************************/

     /**
      * 兼容事件对象
      * @return {[type]}   [description]
      */
     function compatibilityEvent(e) {
         var point;
         if (e.touches && e.touches[0]) {
             point = e.touches[0];
         } else {
             point = e;
         }
         return point;
     }

     edProto.onTouchStart = function (e) {

         var interrupt,
             point = compatibilityEvent(e);

         if (!point) {
             return interrupt = this.preventSwipe = true;
         }

         /**
          * 获取观察对象
          * 钩子函数
          * point 事件对象
          * @return {[type]} [description]
          */
         this.$emit('filter', function () {
             interrupt = true;
         }, point, e);

         //打断动作
         if (interrupt) return;

         this.deltaX = 0;
         this.deltaY = 0;
         this.preventSwipe = false, //是否滑动事件受限
         this.isoverstep = false; //是否边界溢出
         this.isScrollX = false; //是否为X轴滑动
         this.isScrollY = false; //是否为Y轴滑动
         this.isTouching = true; //点击了屏幕

         this.start = {
             pageX: point.pageX,
             pageY: point.pageY,
             time: +new Date()
         };
     };

     edProto.onTouchMove = function (e) {

         //如果没有点击
         //或是Y轴滑动
         //或者是阻止滑动
         if (!this.isTouching || this.isScrollY || this.preventSwipe) return;

         var point = compatibilityEvent(e),
             deltaX = point.pageX - this.start.pageX,
             deltaY = point.pageY - this.start.pageY,
             absDeltaX = Math.abs(deltaX),
             absDeltaY = Math.abs(deltaY);

         if (!this.isScrollY) {
             //===============Y轴滑动======================
             //
             if (absDeltaY > absDeltaX) {
                 this.isScrollY = true; //为Y轴滑动
                 return;
             }
         }

         //===============X轴滑动======================

         //越界处理
         if (this.isoverstep = this.overstep(deltaX)) return;

         //防止滚动
         e.preventDefault();

         this.deltaX = deltaX / (!this.hindex && deltaX > 0 // 在首页
          || this.hindex == this.pagetotal - 1 // 尾页
          && deltaX < 0 // 中间
         ? absDeltaX / this.screenWidth + 1 : 1);

         if (!this.isScrollX && this.deltaX) {
             this.isScrollX = true;
         }

         //算一次有效的滑动
         if (absDeltaX <= 25) return;

         var delayX = 0;

         if (this.deltaX < 0) {
             delayX = 20;
         } else {
             delayX = -20;
         }

         !this.fliplock && this.processorMove({
             'pageIndex': this.hindex,
             'distance': this.deltaX + delayX,
             'speed': 0,
             'direction': this.deltaX > 0 ? 'prev' : 'next',
             'action': 'flipMove'
         });
     };

     edProto.onTouchEnd = function (e) {

         this.isTouching = false;

         if (this.isoverstep || this.preventSwipe) return;

         //点击
         if (!this.isScrollX && !this.isScrollY) {
             var isReturn = false;
             this.$emit('onSwipeUp', this.hindex, function () {
                 isReturn = true;
             });
             if (isReturn) return;
         }

         //如果是左右滑动
         if (this.isScrollX) {

             var duration = +new Date() - this.start.time,
                 deltaX = Math.abs(this.deltaX),

             //如果是首尾
             isPastBounds = !this.hindex && this.deltaX > 0 || this.hindex == this.pagetotal - 1 && this.deltaX < 0,
                 isValidSlide = Number(duration) < 200 && Math.abs(deltaX) > 30 || Math.abs(deltaX) > this.screenWidth / 6;

             //跟随移动
             if (!this.fliplock && isValidSlide && !isPastBounds) {
                 if (this.deltaX < 0) {
                     //true:right, false:left
                     this.slideTo('next');
                 } else {
                     this.slideTo('prev');
                 }
             } else {
                 //反弹
                 this.processorMove({
                     'pageIndex': this.hindex,
                     'direction': this.deltaX > 0 ? 'prev' : 'next',
                     'distance': 0,
                     'speed': 300,
                     'action': 'flipRebound'
                 });
             }
         }
     };

     /**
      * 设置动画完成
      * @param {[type]} element [description]
      */
     edProto.setAnimComplete = function (element) {
         this.distributed(element[0]);
     };

     /**
      * 动画结束后处理
      * @param  {[type]} e [description]
      * @return {[type]}   [description]
      */
     edProto.onAnimComplete = function (e) {
         var target = e.target,
             pageType = target.getAttribute('data-pageType'),
             view = target.getAttribute('data-view'); //操作的可视窗口

         //反弹效果,未翻页
         if (!view) {
             if (!pageType) {
                 //只针对母板处理
                 this.$emit('onMasterMove', this.hindex, target);
             }
             return;
         }

         this.distributed(target);
     };

     /**
      * 派发事件
      * @return {[type]} [description]
      */
     edProto.distributed = function (element) {

         //针对拖拽翻页阻止
         this.preventSwipe = true;
         this.isTouching = false;

         //快速翻页
         var isQuickTurn = this.isQuickTurn;

         //恢复速率
         this.resetRate();

         element.removeAttribute('data-view', 'false');

         var slef = this;
         setTimeout(function () {
             slef.$emit('onAnimComplete', slef.direction, slef.pagePointer, slef.unlock.bind(slef), isQuickTurn);
         }, 100);
     };

     edProto.lock = function () {
         this.fliplock = true;
     };

     //解锁翻页
     edProto.unlock = function () {
         this.fliplock = false;
     };

     //快速翻页时间计算
     edProto.setRate = function () {
         this.speedRate = 50 / this.screenWidth;
         this.isQuickTurn = true;
     };

     //复位速率
     edProto.resetRate = function () {
         this.speedRate = this.originalRate;
         this.isQuickTurn = false;
     };

     edProto.openSwipe = function () {
         this._bindEvt();
     };

     edProto.closeSwipe = function () {
         this.evtDestroy();
     };

     /*********************************************************************
      *
      *                 页面跳转事件
      *                                                         *
      **********************************************************************/

     //计算当前已经创建的页面索引
     function calculationPosition(currIndex, targetIndex, pagetotal) {
         var i = 0,
             existpage,
             createpage,
             pageIndex,
             ruleOut = [],
             create = [],
             destroy,
             viewFlip;

         //存在的页面
         if (currIndex === 0) {
             existpage = [currIndex, currIndex + 1];
         } else if (currIndex === pagetotal - 1) {
             existpage = [currIndex - 1, currIndex];
         } else {
             existpage = [currIndex - 1, currIndex, currIndex + 1];
         }

         //需要创建的新页面
         if (targetIndex === 0) {
             createpage = [targetIndex, targetIndex + 1];
         } else if (targetIndex === pagetotal - 1) {
             createpage = [targetIndex - 1, targetIndex];
         } else {
             createpage = [targetIndex - 1, targetIndex, targetIndex + 1];
         }

         for (; i < createpage.length; i++) {
             pageIndex = createpage[i];
             //跳过存在的页面
             if (-1 === existpage.indexOf(pageIndex)) {
                 //创建目标的页面
                 create.push(pageIndex);
             } else {
                 //排除已存在的页面
                 ruleOut.push(pageIndex);
             }
         }

         _.each(ruleOut, function (ruleOutIndex) {
             existpage.splice(existpage.indexOf(ruleOutIndex), 1);
         });

         destroy = existpage;

         viewFlip = [].concat(create).concat(ruleOut).sort(function (a, b) {
             return a - b;
         });

         return {
             'create': create,
             'ruleOut': ruleOut,
             'destroy': destroy,
             'viewFlip': viewFlip,
             'targetIndex': targetIndex,
             'currIndex': currIndex
         };
     }

     edProto.scrollToPage = function (targetIndex, preMode, complete) {
         //目标页面

         //如果还在翻页中
         if (this.fliplock) return;

         var data;
         var currIndex = this.hindex; //当前页面

         switch (targetIndex) {
             //前一页
             case currIndex - 1:
                 if (this.multiplePages) {
                     return this.prev();
                 }
                 break;
             //首页
             case currIndex:
                 if (currIndex == 0) {
                     this.$emit('onDropApp');
                 }
                 return;
             //后一页
             case currIndex + 1:
                 if (this.multiplePages) {
                     return this.next();
                 }
                 break;
         }

         //算出是相关数据
         data = calculationPosition(currIndex, targetIndex, this.pagetotal);

         //更新页码索引
         this.updataPointer(data);

         data.pagePointer = this.pagePointer;

         this.$emit('onJumpPage', data);
     };

     /**
      * 事件处理
      * @param  {[type]} e [description]
      * @return {[type]}   [description]
      */
     edProto.handleEvent = function (e) {
         Xut.plat.handleEvent({
             start: function start(e) {
                 this.onTouchStart(e);
             },
             move: function move(e) {
                 this.onTouchMove(e);
             },
             end: function end(e) {
                 this.onTouchEnd(e);
             },
             transitionend: function transitionend(e) {
                 this.onAnimComplete(e);
             }
         }, this, e);
     };

     /**
      * 绑定事件
      * @return {[type]} [description]
      */
     edProto._bindEvt = function () {
         var self = this;
         //pageFlip启动，没有滑动处理
         if (this.pageFlip) {
             Xut.plat.execEvent('on', {
                 context: this.element,
                 callback: {
                     start: this,
                     end: this,
                     transitionend: this
                 }
             });
         } else if (this.multiplePages) {
             Xut.plat.execEvent('on', {
                 context: this.element,
                 callback: {
                     start: this,
                     move: this,
                     end: this,
                     transitionend: this
                 }
             });
         } else {
             Xut.plat.execEvent('on', {
                 context: this.element,
                 callback: {
                     start: this,
                     end: this
                 }
             });
         }
     };

     /**
      * 销毁事件
      * @return {[type]} [description]
      */
     edProto.evtDestroy = function () {
         var self = this;
         Xut.plat.execEvent('off', {
             context: this.element,
             callback: {
                 start: this,
                 move: this,
                 end: this,
                 transitionend: this
             }
         });
     };

     /**
      * 销毁所有
      * @return {[type]} [description]
      */
     edProto.destroy = function () {
         this.evtDestroy();
         this.$off();
         this.bubbleNode.page = null;
         this.bubbleNode.master = null;
         this.element = null;
     };

     /**
      * 扩充事件
      */
     observe.call(GlobalEvent.prototype);

     var typeFilter = ['page', 'master'];

     /**
      * 合并参数设置
      * 1 pageMgr
      * 2 masterMgr
      * 3 修正pageType
      * 4 args参数
      * 5 回调每一个上下文
      */
     function createaAccess(mgr) {
         return function (callback, pageType, args, eachContext) {
             //如果第一个参数不是pageType模式
             //参数移位
             if (pageType !== undefined && -1 === typeFilter.indexOf(pageType)) {
                 var temp = args;
                 args = pageType;
                 eachContext = temp;
                 pageType = 'page';
             }

             //pageIndex为pageType参数
             if (-1 !== typeFilter.indexOf(args)) {
                 pageType = args;
                 args = null;
             }

             pageType = pageType || 'page';

             if (mgr[pageType]) {
                 return callback(mgr[pageType], pageType, args, eachContext);
             } else {
                 console.log('传递到access的pageType错误！');
             }
         };
     }

     /**
      * 判断是否存在页码索引
      * 如果不存在默认取当前页面
      */
     function createExistIndex($globalEvent) {
         return function (pageIndex) {
             //如果不存在
             if (pageIndex == undefined) {
                 pageIndex = $globalEvent.hindex; //当前页面
             }
             return pageIndex;
         };
     }

     function overrideApi(vm) {

         var $globalEvent = vm.$globalEvent;
         var options = vm.options;
         var $scheduler = vm.$scheduler;

         //页面与母版的管理器
         var access = createaAccess({
             page: $scheduler.pageMgr,
             master: $scheduler.masterMgr
         });

         var isExistIndex = createExistIndex($globalEvent);

         //***************************************************************
         //
         //  数据接口
         //
         //***************************************************************

         var Presentation = Xut.Presentation;

         /**
          * 获取当前页码
          */
         Presentation.GetPageIndex = function () {
             return $globalEvent.hindex;
         };

         ///////////////
         //获取页面的总数据 //
         //1 chapter数据
         //2 section数据
         ///////////////
         _.each(["Section", "Page"], function (apiName) {
             Presentation['GetApp' + apiName + 'Data'] = function (callback) {
                 var i = 0,
                     temp = [],
                     cps = Xut.data.query('app' + apiName),
                     cpsLength = cps.length;
                 for (i; i < cpsLength; i++) {
                     temp.push(cps.item(i));
                 }
                 return temp;
             };
         });

         //////////////////
         //获取首页的pageId //
         //////////////////
         Presentation.GetFirstPageId = function (seasonId) {
             var sectionRang = Xut.data.query('sectionRelated', seasonId);
             var pageData = Xut.data.query('appPage');
             return pageData.item(sectionRang.start);
         };

         //==========================================
         //	四大数据接口
         //	快速获取一个页面的nodes值
         //	获取当前页面的页码编号 - chapterId
         //	快速获取指定页面的chapter数据
         //	pagebase页面管理对象
         //==========================================
         _.each(["GetPageId", "GetPageNode", "GetPageData", "GetPageObj"], function (apiName) {
             Presentation[apiName] = function (pageType, pageIndex) {
                 return access(function (manager, pageType, pageIndex) {
                     pageIndex = isExistIndex(pageIndex);
                     return manager["abstract" + apiName](pageIndex, pageType);
                 }, pageType, pageIndex);
             };
         });

         /**
          * 得到页面根节点
          * li节点
          */
         Presentation.GetPageElement = function () {
             var obj = Presentation.GetPageObj();
             return obj.element;
         };

         /**
          * 获取页码标记
          * 因为非线性的关系，页面都是按chpater组合的
          * page_0
          * page_10
          * 但是每一个章节页面的索引是从0开始的
          * 区分pageIndex
          */
         Presentation.GetPagePrefix = function (pageType, pageIndex) {
             var pageObj = Presentation.GetPageObj(pageType, pageIndex);
             return pageObj.pid;
         };

         //命名前缀
         var prefix = 'Content_';

         /**
          * 创建一个content的命名规则
          */
         Presentation.MakeContentPrefix = function (pageIndex) {
             return prefix + Presentation.GetPagePrefix(pageIndex) + "_";
         };

         /**
          * 获取命名规则
          */
         Presentation.GetContentName = function (id) {
             if (id) {
                 return prefix + Presentation.GetPagePrefix() + "_" + id;
             } else {
                 return prefix + Presentation.GetPagePrefix();
             }
         };

         //***************************************************************
         //
         //  视图接口
         //
         //***************************************************************

         var View = Xut.View;

         /**
          * 显示工具栏
          * 没有参数显示 工具栏与控制翻页按钮
          * 有参数单独显示指定的
          */
         View.ShowToolbar = function (point) {
             vm.$emit('change:toggleToolbar', 'show', point);
         };

         /**
          * 隐藏工具栏
          * 没有参数隐藏 工具栏与控制翻页按钮
          * 有参数单独隐藏指定
          */
         View.HideToolbar = function (point) {
             vm.$emit('change:toggleToolbar', 'hide', point);
         };

         /**
          * 指定特定的显示与隐藏
          *  Xut.View.Toolbar({
          *       show :'bottom',
          *       hide :'controlBar'
          *   })
          *
          *  //工具栏与翻页按钮全部显示/隐藏
          *  Xut.View.Toolbar('show')
          *  Xut.View.Toolbar('hide')
          *
          * @return {[type]} [description]
          */
         View.Toolbar = function (cfg) {
             vm.$emit('change:toggleToolbar', cfg);
         };

         /**
          * 跳转到上一个页面
          */
         View.GotoPrevSlide = function (seasonId, chapterId) {
             if (seasonId && chapterId) {
                 Xut.View.LoadScenario({
                     'scenarioId': seasonId,
                     'chapterId': chapterId
                 });
                 return;
             }

             //ibooks模式下的跳转
             //全部转化成超链接
             if (Xut.IBooks.Enabled && Xut.IBooks.runMode()) {
                 location.href = Xut.IBooks.pageIndex - 1 + ".xhtml";
                 return;
             }

             options.multiplePages && $globalEvent.prev();
         };

         /**
          * 跳转到下一个页面
          */
         View.GotoNextSlide = function (seasonId, chapterId) {
             if (seasonId && chapterId) {
                 Xut.View.LoadScenario({
                     'scenarioId': seasonId,
                     'chapterId': chapterId
                 });
                 return;
             }

             //ibooks模式下的跳转
             //全部转化成超链接
             if (Xut.IBooks.Enabled && Xut.IBooks.runMode()) {
                 location.href = Xut.IBooks.pageIndex + 1 + ".xhtml";
                 return;
             }

             options.multiplePages && $globalEvent.next();
         };

         /**
          * 跳转页面
          * 场景内部切换
          * 跳转到指定编号的页面
          * Action 类型跳转
          * xxtlink 超连接跳转,svg内嵌跳转标记处理
          * 文本框跳转
          * ........
          */
         View.GotoSlide = function (seasonId, chapterId) {
             var count,
                 sceneObj,
                 currscene,
                 sceneController,

             //修正参数
             fixParameter = function fixParameter(pageIndex) {
                 pageIndex = Number(pageIndex) - 1;
                 if (pageIndex < 0) {
                     pageIndex = 0;
                 }
                 return pageIndex;
             };

             //ibooks模式下的跳转
             //全部转化成超链接
             if (Xut.IBooks.Enabled && Xut.IBooks.runMode() && chapterId) {
                 location.href = chapterId + ".xhtml";
                 return;
             }

             //兼容数据错误
             if (!seasonId && !chapterId) return;

             //如果是一个参数是传递页码数,则为内部跳转
             if (arguments.length === 1) {
                 //复位翻页按钮
                 vm.$emit('change:showNext');
                 return $globalEvent.scrollToPage(fixParameter(seasonId));
             }

             //场景模式内部跳转
             if (options.scenarioId == seasonId) {
                 //chpaterId 转化成实际页码
                 var sectionRang = Xut.data.query('sectionRelated', seasonId);
                 var pageIndex = chapterId - sectionRang.start;
                 vm.$emit('change:showNext');
                 return $globalEvent.scrollToPage(fixParameter(pageIndex));
             }
             //场景与场景的跳转
             return View.LoadScenario({
                 'scenarioId': seasonId,
                 'chapterId': chapterId
             });
         };

         //页面滑动
         View.MovePage = function (distance, speed, direction, action) {
             //如果禁止翻页模式 || 如果是滑动,不是边界
             if (!options.multiplePages || $globalEvent.isMove() || action === 'flipMove' && $globalEvent.isBorder(distance)) {
                 return;
             }
             var pagePointer = $globalEvent.pagePointer,
                 data = {
                 'distance': distance,
                 'speed': speed,
                 'direction': direction,
                 'action': action,
                 'leftIndex': pagePointer.leftIndex,
                 'pageIndex': pagePointer.currIndex,
                 'rightIndex': pagePointer.rightIndex
             };
             $scheduler.move(data);
             pagePointer = null;
         };

         //***************************************************************
         //
         //  辅助对象的控制接口
         //
         //***************************************************************

         /**
          * 运行辅助动画
          * 辅助对象的activityId,或者合集activityId
          * Run
          * stop
          * 1 零件
          * 2 音频动画
          */
         var Assist = Xut.Assist;

         _.each(["Run", "Stop"], function (apiName) {
             Assist[apiName] = function (pageType, activityId, outCallBack) {
                 access(function (manager, pageType, activityId, outCallBack) {
                     //数组
                     if (_.isArray(activityId)) {
                         //完成通知
                         var markComplete = function () {
                             var completeStatistics = activityId.length; //动画完成统计
                             return function () {
                                 if (completeStatistics === 1) {
                                     outCallBack && outCallBack();
                                     markComplete = null;
                                 }
                                 completeStatistics--;
                             };
                         }();
                         _.each(activityId, function (id) {
                             manager.abstractAssistAppoint(id, $globalEvent.hindex, markComplete, apiName);
                         });
                     } else {
                         manager.abstractAssistAppoint(activityId, $globalEvent.hindex, outCallBack, apiName);
                     }
                 }, pageType, activityId, outCallBack);
             };
         });

         //***************************************************************
         //
         //  针对page页面的content类型操作接口
         //
         //***************************************************************

         var Contents = Xut.Contents;

         /**
          * 获取指定的对象
          * 传递参数
          * 单一 id
          * 数据id合集 [1,2,4,5,6]
          * @param {[type]}   contentIds  [description]
          * @param {Function} eachContext 回调遍历每一个上下文
          */
         Contents.Get = function (pageType, contentIds, eachContext) {

             return access(function (manager, pageType, contentIds, eachContext) {

                 var contentObj,
                     contentObjs,
                     pageIndex = Presentation.GetPageIndex();

                 function findContent(currIndex, contentId) {
                     var pageObj;
                     if (pageObj = manager.abstractGetPageObj(currIndex)) {
                         return pageObj.baseGetContentObject(contentId);
                     }
                 }

                 //如果传递是数组合集
                 if (_.isArray(contentIds)) {
                     contentObjs = [];
                     _.each(contentIds, function (id) {
                         contentObj = findContent(pageIndex, id);
                         if (eachContext) {
                             //传递每一个处理的上下文
                             eachContext(id, contentObj);
                         } else {
                             if (contentObj) {
                                 contentObjs.push(contentObj);
                             } else {
                                 Xut.log('error', '找不到对应的content数据' + id);
                             }
                         }
                     });
                     return contentObjs;
                 }

                 //如果传递的是Content_1_3组合情况
                 if (/_/.test(contentIds)) {
                     var expr = contentIds.split('_');
                     if (expr.length > 1) {
                         return findContent(expr[1], expr[2]);
                     }
                 }

                 //单一content id
                 contentObj = findContent(pageIndex, contentIds);

                 if (eachContext) {
                     eachContext(contentObj);
                 } else {
                     return contentObj;
                 }
             }, pageType, contentIds, eachContext);
         };

         /**
          * 得到指定页面零件的数据
          * 获取指定的content数据
          * @param  {[type]} contentId [description]
          * @return {[type]}           [description]
          */
         Contents.GetPageWidgetData = function (pageType, contentId) {

             //如果没有传递pageType取默认
             if (-1 === typeFilter.indexOf(pageType)) {
                 contentId = pageType;
                 pageType = 'page';
             }

             //必须有数据
             if (!contentId || !contentId.length) {
                 return;
             }

             //保证是数组格式
             if (_.isString(contentId)) {
                 contentId = [contentId];
             }

             var contentDas,
                 contents = [];

             Contents.Get(pageType, contentId, function (cid, content) {
                 //是内部对象
                 if (content && (contentDas = content.contentDas)) {
                     //通过内部管理获取对象
                     contents.push({
                         'id': content.id,
                         'idName': content.actName,
                         'element': content.$contentProcess,
                         'theTitle': contentDas.theTitle,
                         'scaleHeight': contentDas.scaleHeight,
                         'scaleLeft': contentDas.scaleLeft,
                         'scaleTop': contentDas.scaleTop,
                         'scaleWidth': contentDas.scaleWidth,
                         'contentData': contentDas,
                         'source': 'innerObjet' //获取方式内部对象
                     });
                 } else {
                         //如果通过内部找不到对象的content数据,则直接查找数据库
                         //可能是一个事件的钩子对象
                         if (contentDas = seekQuery(cid)) {
                             var actName = Presentation.GetContentName(cid);
                             var element;
                             //如果对象是事件钩子或者是浮动对象
                             //没有具体的数据
                             if (content && content.$contentProcess) {
                                 element = content.$contentProcess;
                             } else {
                                 element = $('#' + actName);
                             }
                             contents.push({
                                 'id': cid,
                                 'idName': actName,
                                 'element': element,
                                 'theTitle': contentDas.theTitle,
                                 'scaleHeight': contentDas.scaleHeight,
                                 'scaleLeft': contentDas.scaleLeft,
                                 'scaleTop': contentDas.scaleTop,
                                 'scaleWidth': contentDas.scaleWidth,
                                 'contentData': contentDas,
                                 'source': 'dataBase'
                             });
                         } else {
                             Xut.log('error', '找不到对应的GetPageWidgetData数据' + cid);
                         }
                     }
             });
             return contents;
         };

         //数据库查找
         function seekQuery(id) {
             var contentData = Xut.data.query('Content', id);
             if (contentData) {
                 return reviseSize(_.extend({}, contentData));
             }
         }

         //******************************************
         //
         //		互斥接口
         //		直接显示\隐藏\停止动画
         //
         //*******************************************

         //检测类型为字符串
         function typeCheck(objNameList) {
             return !objNameList || typeof objNameList !== 'string' ? true : false;
         }

         /**
          * 针对文本对象的直接操作
          * 显示
          * 隐藏
          * 停止动画
          */
         _.each(["Show", "Hide", "StopAnim"], function (operate) {
             Contents[operate] = function (pageType, nameList) {
                 access(function (manager, pageType, nameList) {
                     if (typeCheck(nameList)) return;
                     var pageBaseObj;
                     if (!(pageBaseObj = manager.abstractAssistPocess($globalEvent.hindex))) {
                         console.log('注入互斥接口数据错误！');
                         return;
                     }
                     _.each(nameList.split(','), function (contentId) {
                         pageBaseObj.baseContentMutex(contentId, operate);
                     });
                 }, pageType, nameList);
             };
         });

         //******************************************
         //
         //		Application
         //		应用接口
         //
         //*******************************************

         var Application = Xut.Application;

         /**
          * 获取一个存在的实例对象
          * 区分不同层级page/master
          * 不同类型	   content/widget
          */
         Application.GetSpecifiedObject = function (pageType, data) {
             return access(function (manager, pageType) {
                 var pageObj;
                 if (pageObj = manager.abstractGetPageObj(data.pageIndex)) {
                     if (data.type === 'Content') {
                         return pageObj.baseSpecifiedContent(data);
                     } else {
                         return pageObj.baseSpecifiedComponent(data);
                     }
                 }
             }, pageType);
         };

         /**
          * 应用滑动接口
          * @return {[type]}
          */
         _.each(["closeSwipe", "openSwipe"], function (operate) {
             Application[operate] = function () {
                 $globalEvent[operate]();
             };
         });
     }

     /**
      * 抽象管理接口
      * @return {[type]} [description]
      */

     function Abstract() {}

     Abstract.prototype = {
         /**
          * 创建页面合集
          * @return {[type]} [description]
          */
         abstractCreateCollection: function abstractCreateCollection() {
             this.Collections = {};
         },

         /**
          * 增加合集管理
          */
         abstractAddCollection: function abstractAddCollection(pageIndex, pageObj) {
             this.Collections[pageIndex] = pageObj;
         },

         /**
          * 得到页面合集
          * @return {[type]} [description]
          */
         abstractGetCollection: function abstractGetCollection() {
             return this.Collections;
         },

         /**
          * 删除合集管理
          * @return {[type]} [description]
          */
         abstractRemoveCollection: function abstractRemoveCollection(pageIndex) {
             delete this.Collections[pageIndex];
         },

         /**
          * 销毁合集
          * @return {[type]} [description]
          */
         abstractDestroyCollection: function abstractDestroyCollection() {
             var k,
                 Collections = this.Collections;
             for (k in Collections) {
                 Collections[k].baseDestroy();
             }
             this.Collections = null;
         },

         /**
          * 找到页面对象
          * 1.页面直接pageIndex索引
          * 2.母版通过母版Id索引
          * @return {[type]} [description]
          */
         abstractGetPageObj: function abstractGetPageObj(pageIndex, pageType) {
             pageType = pageType || this.pageType;
             //模板传递的可能不是页码
             if (pageType === 'master') {
                 if (!/-/.test(pageIndex)) {
                     //如果不是母版ID，只是页码
                     pageIndex = this.conversionMasterId(pageIndex); //转化成母版id
                 }
             }
             return this.Collections[pageIndex];
         },

         /**
          * 合并处理
          * @return {[type]} [description]
          */
         abstractAssistPocess: function abstractAssistPocess(pageIndex, callback) {
             var pageObj;
             if (pageObj = this.abstractGetPageObj(pageIndex, this.pageType)) {
                 if (callback) {
                     callback(pageObj);
                 } else {
                     return pageObj;
                 }
             }
         },

         /**
          * 获取页面容器ID
          * chpaterID
          * masterID
          * @return {[type]} [description]
          */
         abstractGetPageId: function abstractGetPageId(pageIndex, pageType) {
             var key = pageType === 'page' ? '_id' : 'pptMaster';
             return this.abstractGetPageData(pageIndex, key, pageType);
         },

         /**
          * 获取页面数据
          */
         abstractGetPageData: function abstractGetPageData(pageIndex, key, pageType) {
             var pageObj;
             //如果传递key是 pageType
             if (!pageType && key == 'page' || key == 'master') {
                 pageType = key;
                 key = null;
             }
             if (pageObj = this.abstractGetPageObj(pageIndex, pageType)) {
                 return key ? pageObj.chapterDas[key] : pageObj.chapterDas;
             }
         },

         /**
          * 得到页面的nodes数据
          * @param  {[type]} pageIndex [description]
          * @return {[type]}           [description]
          */
         abstractGetPageNode: function abstractGetPageNode(pageIndex, pageType) {
             return this.abstractGetPageData(pageIndex, 'nodes', pageType);
         },

         //***************************************************************
         //
         //  执行辅助对象事件
         //
         //***************************************************************
         abstractAssistAppoint: function abstractAssistAppoint(activityId, currIndex, outCallBack, actionName) {
             var pageObj;
             if (pageObj = this.abstractGetPageObj(currIndex)) {
                 return pageObj.baseAssistRun(activityId, outCallBack, actionName);
             }
         }

     };

     /**
      * [ description]
      * @return {[type]} [description]
      */

     function Collection() {
         this.reset();
     }

     Collection.prototype = {

         register: function register(contentObj) {
             if (!this._list) {
                 this._list = [contentObj];
             } else {
                 this._list.push(contentObj);
             }
         },

         get: function get() {
             return this._list;
         },

         //得到一个指定的实例
         specified: function specified(data) {
             var instance;
             var listLength = this._list.length;
             while (listLength) {
                 listLength--;
                 if (instance = this._list[listLength]) {
                     if (instance.type === data.type && instance.id === data.id) {
                         return instance;
                     }
                 }
             }
         },

         remove: function remove() {
             this._list = [];
         },

         reset: function reset() {
             this._list = [];
         }

     };

     /**
      * 页面切换效果
      * 平移
      * @return {[type]} [description]
      */
     var prefix$1 = Xut.plat.prefixStyle;
     var xxtTrans = function xxtTrans(offset) {
         offset = Xut.config.virtualMode ? offset / 2 : offset;
         return "translate3d(" + offset + "px, 0, 0)";
     };
     function dydTransform(distance) {
         distance = Xut.config.virtualMode ? distance / 2 : distance;
         return prefix$1('transform') + ':' + 'translate3d(' + distance + 'px,0px,0px)';
     }

     //保持缩放比,计算缩放比情况下的转化
     var calculateContainer = void 0;
     var offsetLeft = void 0;
     var offsetRight = void 0;
     var offsetCut = void 0;
     var prevEffect = void 0;
     var currEffect = void 0;
     var nextEffect = void 0;

     function setConfig() {
         calculateContainer = Xut.config.proportion.calculateContainer(), offsetLeft = -1 * calculateContainer.width, offsetRight = calculateContainer.width, offsetCut = 0, prevEffect = xxtTrans(offsetLeft), currEffect = xxtTrans(offsetCut), nextEffect = xxtTrans(offsetRight);
     }

     //切换坐标
     function toTranslate3d(distance, speed, element) {
         distance = Xut.config.virtualMode ? distance / 2 : distance;
         if (element = element || this.element || this.$contentProcess) {
             element.css(prefix$1('transform'), 'translate3d(' + distance + 'px,0px,0px)');
             if (Xut.config.pageFlip) {
                 //修正pageFlip切换页面的处理
                 //没有翻页效果
                 if (distance === 0) {
                     var cur = Xut.sceneController.containerObj('current');
                     cur.vm.$globalEvent.setAnimComplete(element);
                 }
             } else {
                 element.css(prefix$1('transition-duration'), speed + "ms");
             }
         }
     }

     /**
      * 创建起始坐标
      * @return {[type]}
      */
     function createTransform(currPageIndex, createPageIndex) {
         setConfig();
         var translate3d, direction, offset;
         if (createPageIndex < currPageIndex) {
             translate3d = prevEffect;
             offset = offsetLeft;
             direction = 'before';
         } else if (createPageIndex > currPageIndex) {
             translate3d = nextEffect;
             offset = offsetRight;
             direction = 'after';
         } else if (currPageIndex == createPageIndex) {
             translate3d = currEffect;
             offset = offsetCut;
             direction = 'original';
         }
         return [translate3d, direction, offset, dydTransform];
     }

     function reset() {
         var element;
         if (element = this.element || this.$contentProcess) {
             element.css(prefix$1('transition-duration'), '');
             element.css(prefix$1('transform'), 'translate3d(0px,0px,0px)');
         }
     }

     /**
      * 移动
      * @return {[type]} [description]
      */
     function flipMove(distance, speed, element) {
         toTranslate3d.apply(this, arguments);
     }

     /**
      * 移动反弹
      * @return {[type]} [description]
      */
     function flipRebound(distance, speed) {
         toTranslate3d.apply(this, arguments);
     }

     /**
      * 移动结束
      * @return {[type]} [description]
      */
     function flipOver(distance, speed) {
         /**
          * 过滤多个动画回调，保证指向始终是当前页面
          */
         if (this.pageType === 'page') {
             if (distance === 0) {
                 //目标页面传递属性
                 this.element.attr('data-view', true);
             }
         }
         toTranslate3d.apply(this, arguments);
     }

     var translation = {
         reset: reset,
         flipMove: flipMove,
         flipRebound: flipRebound,
         flipOver: flipOver
     };

     /**
      * ppt事件接口
      *
      * 允许用户自定义其行为
      *     1 支持14种操作行为
      *     2 默认对象都具有滑动翻页的特性
      *     3 翻页的特性在遇到特性的情况可以被覆盖
      *     比如
      *         行为1：用户定义该名字可以支持  click 点击行为， 那么该元素左右滑动能过翻页
      *         行为2：用户如果定义swipeLeft 行为，该元素左右滑动将不会翻页，因为默认翻页已经被覆盖
      *
      * 此接口函数有作用域隔离
      */

     /**
      * ie10下面mouse事件怪异
      * @return {Boolean} [description]
      */
     var isIE10 = document.documentMode === 10;

     /**
      * 事件类型
      * @type {Array}
      */
     var eventName = ['null', 'auto', 'tap', 'drag', 'dragTag', 'swipeleft', 'swiperight', 'swipeup', 'swipedown', 'doubletap', 'press', 'pinchout', 'pinchin', 'rotate', 'assist'];

     /*********************************************************************
      *                重写默认事件
      *
      *                Content对象默认具有左右翻页的特性
      *                根据过滤来选择是否覆盖重写这个特性
      *                比如 用户如果遇到 swipeLeft，swipeRight 这种本身与翻页行为冲突的
      *                将要覆盖这个行为
      *                                                         *
      **********************************************************************/

     //过滤事件
     //如果用户指定了如下操作行为,将覆盖默认的翻页行为
     var filterEvent = ['drag', 'dragTag', 'swipeleft', 'swiperight', 'swipeup', 'swipedown'];

     /**
      * 是否过滤
      * @param  {[type]} evtName [description]
      * @return {[type]}         [description]
      */
     function isfilter(eventName) {
         return filterEvent.indexOf(eventName) === -1 ? true : false;
     }

     /**
      * 特性摘除
      * 1 ：无事件，默认可以翻页，还可以切换工具栏
      * 2 ：静态事件，默认可以翻页
      * 3 : 冲突事件，默认删除
      * 去除默认元素具有的翻页特性
      * @param  {[type]} evtName [事件名]
      * @return {[type]}         [description]
      */
     function checkDefaultBehavior(supportSwipe, element) {
         if (supportSwipe) {
             //静态事件，默认可以翻页，还可以切换工具栏
             element.attr('data-behavior', 'swipe');
         } else {
             //如果事件存在
             element.attr('data-behavior', 'disable');
             this.defaultEvent = false;
         }
     }

     /**
      * 针对软件培训的操作行为下光标状态需求
      * @param {[type]} element [description]
      */
     function addCursor(eventName, $element) {
         if ($element) {
             if (!$element.prop('setCursor')) {
                 //只设置一次
                 if (eventName === ('drag' || 'dragTag')) {
                     $element.css('cursor', 'Move');
                 } else {
                     $element.css('cursor', 'Pointer');
                 }
                 $element.prop('setCursor', 'true');
             }
         }
     }

     /**
      * 针对canvas模式
      * 特殊的hack
      */
     function setCanvasStart(supportSwipe) {
         Xut.Contents.Canvas.Reset();
         //当前点击的元素是滑动元素
         //处理元素的全局事件
         Xut.Contents.Canvas.SupportSwipe = supportSwipe;
         Xut.Contents.Canvas.isTap = true;
     }

     function setCanvasMove() {
         Xut.Contents.Canvas.isSwipe = true;
     }

     /**
      * 兼容事件对象
      * @return {[type]}   [description]
      */
     function compatibilityEvent$1(e) {
         var point;
         if (e.touches && e.touches[0]) {
             point = e.touches[0];
         } else {
             point = e;
         }
         return point;
     }

     /**
      * 如果是简单的点击事件
      */
     function tapEvent(eventContext, domMode, eventHandle, supportSwipe) {

         eventContext.isTap = false;

         //这里单独绑定事件有个问题,单击move被触发
         //如果停止e.stopPropagation，那么默认行为就不会被触发
         //你绑定单击的情况下可以翻页
         //这里通过坐标的位置来判断
         var start = function start(e) {
             var point = compatibilityEvent$1(e);
             //记录开始坐标
             eventContext.pageX = point.pageX;
             //是否是tap事件
             eventContext.isTap = true;
             setCanvasStart(supportSwipe);
         },
             move = function move(e) {
             if (!eventContext.isTap) {
                 return;
             }
             var point = compatibilityEvent$1(e),
                 deltaX = point.pageX - eventContext.pageX;
             //如果有move事件，则取消tap事件
             if (Math.abs(deltaX)) {
                 eventContext.isTap = false;
                 setCanvasMove(supportSwipe);
             }
         },
             end = function end(e) {
             //触发tap事件
             eventContext.isTap && eventHandle();
         };

         //绑定canvas事件
         function onCanvas(eventContext) {
             eventContext.mousedown = eventContext.touchstart = start;
             eventContext.mousemove = eventContext.touchmove = move;
             eventContext.mouseup = eventContext.touchend = end;
         }

         function offCanvas(eventContext) {
             eventContext.mousedown = eventContext.touchstart = null;
             eventContext.mousemove = eventContext.touchmove = null;
             eventContext.mouseup = eventContext.touchend = null;
         }

         if (domMode) {
             eventContext = eventContext[0];
             //IE10是不支持touch事件，直接绑定click事件
             if (isIE10) {
                 eventContext.isTap = true;
                 eventContext.addEventListener('click', end, false);
             } else {
                 Xut.plat.execEvent('on', {
                     context: eventContext,
                     callback: {
                         start: start,
                         move: move,
                         end: end
                     }
                 });
             }
         } else {
             //canvas开启模式
             eventContext.interactive = true;
             onCanvas(eventContext);
         }

         //销毁接口
         return {
             off: function off() {
                 if (eventContext) {
                     if (domMode) {
                         if (isIE10) {
                             eventContext.removeEventListener('click', end, false);
                         } else {
                             Xut.plat.execEvent('off', {
                                 context: eventContext,
                                 callback: {
                                     start: start,
                                     move: move,
                                     end: end
                                 }
                             });
                         }
                         eventContext = null;
                     } else {
                         //canvas模式处理
                         if (eventContext.destroy) {
                             eventContext.destroy();
                         } else {
                             offCanvas(eventContext);
                         }
                         eventContext = null;
                     }
                 }
             }
         };
     }

     /**
      * 优化hammer创建,生成必要配置文件
      * @return {[type]} [description]
      */
     function createRecognizers(eventName) {
         var recognizers = [];
         switch (eventName) {
             //如果是swipe处理
             case 'swipeleft':
             case 'swiperight':
             case 'swipeup':
             case 'swipedown':
                 var direction = Hammer.DIRECTION_HORIZONTAL;
                 if (eventName === 'swipeup' || eventName === "swipedown") {
                     direction = Hammer.DIRECTION_VERTICAL;
                 }
                 recognizers.push([Hammer.Swipe, { 'direction': direction, 'velocity': 0.01 }]);
                 break;
             case 'doubletap':
                 //双击
                 recognizers.push([Hammer.Tap]);
                 recognizers.push([Hammer.Tap, { event: 'doubletap', taps: 2 }, ['tap']]);
                 break;
             case 'press':
                 //长按
                 recognizers.push([Hammer.Press]);
                 return;
         }
         return recognizers;
     }

     /**
      * 创建hammer引用
      * @return {[type]}         [description]
      */
     function createHammer(eventContext, eventName, domMode, supportSwipe) {
         var eventReference;
         if (domMode) {
             var context = eventContext[0];
             var recognizer = createRecognizers(eventName);
             if (recognizer && recognizer.length) {
                 eventReference = Hammer(context, {
                     'recognizers': recognizer
                 });
             } else {
                 eventReference = Hammer(context);
             }
         } else {
             //canvas模式事件绑定
             eventContext.interactive = true;
             eventReference = Hammer(context, {
                 'recognizers': recognizer,
                 'pixiContext': eventContext,
                 'returnStart': function returnStart(evt) {
                     setCanvasStart(supportSwipe);
                 },
                 'returnMove': function returnMove() {
                     setCanvasMove(supportSwipe);
                 }
             });
         }
         return eventReference;
     }

     /**
      * 复杂的事件
      * @return {[type]} [description]
      */
     function complexEvent(eventContext, eventName, domMode, eventHandler, supportSwipe) {
         var eventReference = createHammer(eventContext, eventName, domMode, supportSwipe);
         eventReference.on(eventName, function (ev) {
             eventHandler();
         });
         return eventReference;
     }

     //绑定事件
     function bindEvent(eventDrop, data) {
         var dragObj, eventHandler, eventReference;
         var eventContext = data.eventContext;
         var eventName = data.eventName;
         var domMode = data.domMode;
         switch (eventName) {
             case 'drag':
                 //拖动
                 dragObj = new DragDropClass(eventContext, null, data.parameter, eventDrop.startRun, eventDrop.stopRun);
                 break;
             case 'dragTag':
                 //拖拽
                 dragObj = new DragDropClass(eventContext, data.target, 1, eventDrop.startRun, eventDrop.stopRun);
                 break;
             default:
                 //事件句柄
                 eventHandler = function eventHandler() {
                     data.eventRun.call(eventContext);
                 };
                 eventReference = eventName === 'tap' ? tapEvent(eventContext, domMode, eventHandler, data.supportSwipe) : complexEvent(eventContext, eventName, domMode, eventHandler, data.supportSwipe);
                 break;
         }
         return [dragObj, eventReference, eventHandler];
     }

     //绑定事件
     // parameter 参数
     // 1：对于自由拖动drag，para参数为0，表示松手后，停留在松手的地方
     //                      para参数为1，表示松手后，返回原来的位置
     //
     // 2: 对于拖拽dragTag， para表示目标对象的target
     function applyEvent(data) {

         //针对软件培训的操作行为下光标状态需求
         Xut.plat.isBrowser && data.domMode && addCursor(data.eventName, data.eventContext);

         //绑定事件
         var eventDrop = data.eventDrop,
             eventObj = bindEvent(eventDrop, data);

         //拖动,拖拽对象处理
         if (eventObj[0] && eventDrop.init) {
             eventDrop.init(eventObj[0]);
         } else {
             //传递引用
             data.eventHandler(eventObj[1], eventObj[2]);
         }
     }

     //================事件接口====================

     /**
      * 注册自定义事件
      * this还是引用的当前实例的上下文
      *
      *   'element'   : 事件对象
      *   'target'    : 目标对象
      *   'parameter' : 拖动参数
      *   'evtName'   : 事件名,
      *
      *   callbackHook 回调函数 ,处理具体的事情
      */
     function bindEvents(data) {
         //是否支持翻页
         var supportSwipe = data.supportSwipe = isfilter(data.eventName);
         //检测是否移除元素的默认行为,因为元素都具有翻页的特性
         if (data.domMode) {
             checkDefaultBehavior(supportSwipe, data.eventContext);
         }
         //执行事件绑定
         applyEvent(data);
     }

     //数据库预定义14个事件接口
     //提供给content文件
     //用于过滤数据库字段指定的行为
     //https://github.com/EightMedia/hammer.js/wiki/Getting-Started
     //2014.3.18 新增assist 辅助对象事件
     function conversionEventType(eventType) {
         return eventName[Number(eventType) - 1] || null;
     }

     //销毁对象事件
     function destroyEvents(eventData, eventName) {
         if (eventData.eventReference) {
             eventData.eventReference.off(eventName || eventData.eventName, eventData.eventHandler);
             eventData.eventReference = null;
             eventData.eventHandler = null;
         }
     }

     //获取对应的activity对象
     var getActivity = function getActivity(activityId, callback) {
         var activity;
         if (activity = this.abActivitys) {
             _.each(activity.get(), function (contentObj, index) {
                 if (activityId == contentObj.activityId) {
                     callback(contentObj);
                     return;
                 }
             }, this);
         }
     };

     //制作一个处理绑定函数
     var makeRunBinding = function makeRunBinding(pagebase) {
         var registers = this.registers;
         var shift;
         return function () {
             var activityId = registers[0];
             getActivity.call(pagebase, activityId, function (activityObj) {
                 activityObj.runEffects(function () {
                     shift = registers.shift();
                     registers.push(shift);
                 });
             });
         };
     };

     /**
      * 多事件处理
      * 每次通过同一个热点,触发不同的对象操作
      * @return {[type]} [description]
      */
     function combineEvents(pagebase, eventRelated) {

         var contentObj, element, eventName;

         //多条activty数据,一个对象上多事件
         _.each(eventRelated, function (edata) {

             _.each(edata, function (scope) {

                 contentObj = pagebase.baseGetContentObject(scope.eventContentId);

                 if (!contentObj) {
                     Xut.log('error', 'pagebase.js第' + pagebase.pageIndex + '页多事件处理出错!!!!');
                     return;
                 }

                 element = contentObj.$contentProcess;
                 eventName = conversionEventType(scope.eventType);

                 //制动运行动作
                 scope.runEffects = makeRunBinding.call(scope, pagebase);

                 //销毁方法
                 scope.destroy = function () {
                     destroyEvents(scope, eventName);
                     scope.registers = null;
                     scope.runEffects = null;
                 };

                 //事件绑定
                 bindEvents({
                     'eventRun': function eventRun() {
                         scope.runEffects();
                     },
                     'eventHandler': function eventHandler(eventReference, _eventHandler) {
                         scope.eventReference = eventReference;
                         scope.eventHandler = _eventHandler;
                     },
                     'eventContext': element,
                     'eventName': eventName,
                     'parameter': scope.dragdropPara,
                     'target': null,
                     'domMode': true
                 });
             });

             //暴露引用
             pagebase.listenerHooks.registerEvents = eventRelated;
         });
     }

     function create(pagebase, eventRelated) {
         combineEvents(pagebase, eventRelated);
     }

     function destroy$2(pagebase) {
         var registerEvents;
         if (registerEvents = pagebase.listenerHooks.registerEvents) {
             _.each(registerEvents, function (edata) {
                 _.each(edata, function (obj) {
                     obj.destroy && obj.destroy();
                 });
             });
         }
         pagebase.listenerHooks.registerEvents = null;
     }

     //查询接口
     function query(tableName, options, callback) {
         switch (tableName) {
             case 'page':
                 //得到页面关联的数据
                 return getPageData(options, callback);
             case 'master':
                 //得到母版关联的数据
                 return getMasterData(options, callback);
             case 'chapter':
                 //得到chapter表数据
                 return parseChapter(options);
             case 'scenarioChapter':
                 return scenarioChapter(options);
         }
     }

     /**
      * 根据指定的chpaterId解析
      * @return {[type]} [description]
      */
     function scenarioChapter(chapterId) {
         var chapterSection = Xut.data.chapterSection;
         var rang = chapterSection['seasonId->' + chapterId];
         return rang;
     }

     /*********************************************************************
      *
      *               1 解析chapter页面数据
      *               2 解析对应的Activity数据
      *               3 解析出自动widget数据结构
      *                                                         *
      **********************************************************************/
     function getPageData(data, callback) {
         var parsePointer = data['pageIndex'],
             pageData = data['pageData'];

         if (pageData) {
             getActivity$1(pageData, callback);
         } else {
             //解析章节数据
             parseChapter(parsePointer, function (pageData) {
                 //生成chapter数据
                 getActivity$1(pageData.length ? pageData[0] : pageData, callback);
             });
         }
     };

     //解析关联的Activity表数据
     function getActivity$1(pageData, callback) {
         parseActivity(pageData, function (activitys, autoData) {
             callback(pageData, activitys, autoData);
         });
     }

     /**
      * 递归分解
      * chpater直接对应页面的ID编码，直接去下标即可
      * waitCreatePointer     需要分解的页面
      */
     function parseChapter(waitCreatePointer) {
         var chapters = [],
             chapter,
             dataChpater = Xut.data.Chapter,
             points = waitCreatePointer.length,
             key;

         while (points--) {
             key = waitCreatePointer[points];
             if (chapter = dataChpater.item(key)) {
                 chapters.unshift(chapter);
             }
         }

         return chapters;
     };

     /*********************************************************************
      *
      *                解析视觉差的数据
      *                                                         *
      **********************************************************************/
     function getMasterData(data, callback) {
         var pptMaster = data['pptMaster'];
         var masterDas = Xut.data.query('Master', pptMaster);
         parseActivity(masterDas, function (activitys, autoData) {
             callback(masterDas, activitys, autoData);
         });
     }

     /*********************************************************************
      *                解析activity表的数据
      *                                                         *
      **********************************************************************/
     /**
      * chpaters = {
      *     pageIndex-12: Object
      *     pageIndex-13: Object
      *     pageIndex-14: Object
      *  }
      **/
     function parseActivity(data, callback) {
         if (!data) callback();
         var activitys = [];
         var chapterId = data['_id'];

         Xut.data.query('Activity', chapterId, 'chapterId', function (item) {
             activitys.push(item);
         });

         //混入文本提示框
         mixShowNote(data, activitys);

         //自动运行的数据
         //解析出每一页自动运行的 Widget,Action,Video数据
         var autoData = filterAutoRun(activitys);

         callback(activitys, autoData);
     };

     /**
      * 混入shownote
      * 组合showNote数据,弹出信息框,也看作一个热点
      * shownote是chater的信息，混入到activity列表中当作每页的对象处理
      * @return {[type]} [description]
      */
     function mixShowNote(onechapter, activitydata) {
         if (onechapter.note) {
             activitydata.push(onechapter);
         }
     };

     //解析出页面自动运行的数据
     function filterAutoRun(activitys) {

         var collectAutoBuffers, key, id, key, sub;

         if (!activitys || !activitys.length) return;

         collectAutoBuffers = []; //自动热点

         activitys.forEach(function (target, b) {
             //如果是自动播放,并且满足自定义条件
             //并且不是content类型
             if (target.autoPlay && target.actType !== 'Content') {
                 //增加note提示信息数据
                 id = target['_id'];
                 key = target.actType ? target.actType + "_" + id : 'showNote_' + id;
                 sub = {
                     'id': id,
                     'type': target.actType,
                     'animation': target.animation,
                     'key': key,
                     'category': target.category,
                     'autoPlay': target.autoPlay
                 };
                 collectAutoBuffers.push(sub);
             }
         });

         if (collectAutoBuffers.length) {
             return collectAutoBuffers;
         }
     }

     /**
      *	创建主容器任务片
      *  state状态
      *   	0 未创建
      *    	1 正常创建
      *     	2 创建完毕
      *      3 创建失败
      */

     var prefixStyle = Xut.plat.prefixStyle;

     /**
      * 创建父容器li结构
      */
     function createContainer(transform, data) {

         var str = '',
             containerBackground = '',
             userStyle = data.userStyle,
             baseData = data.baseData,
             url = baseData.md5;
         config = Xut.config;

         var proportion = config.proportion;
         var calculate = proportion.calculateContainer();
         var sWidth = calculate.width;
         var sHeight = calculate.height;

         //chpater有背景，不是svg格式
         if (!/.svg$/i.test(url)) {
             containerBackground = 'background-image:url(' + config.pathAddress + url + ');';
         }

         function createli(customStyle) {
             customStyle = customStyle ? customStyle : '';
             var str;
             var offsetLeft = 0;
             var pageType = data.pageType;
             if (config.virtualMode) {
                 if (data.virtualOffset === 'right') {
                     offsetLeft = -(config.screenSize.width - proportion.offsetLeft);
                 }
                 str = String.format('<li id="{0}" class="xut-flip" data-map="{1}" data-pageType="{2}" data-container="true" style="overflow:hidden;{3}:{4};{5}{6}">' + '<div style="width:{7}px;left:{8}px;height:100%;position:relative"></div>' + '</li>', data.prefix, data.pid, pageType, prefixStyle('transform'), transform, containerBackground, customStyle, sWidth, offsetLeft);
             } else {
                 str = String.format('<li id="{0}" class="xut-flip" data-map="{1}" data-pageType="{2}" data-container="true" style="overflow:hidden;{3}:{4};{5}{6}"></li>', data.prefix, data.pid, pageType, prefixStyle('transform'), transform, containerBackground, customStyle);
             }
             return str;
         }

         /**
          * 自定义配置了样式
          * 因为单页面跳槽层级的问题处理
          */
         if (userStyle !== undefined) {
             //解析自定义规则
             var customStyle = '';
             _.each(userStyle, function (value, key) {
                 customStyle += key + ':' + value + ';';
             });
             str = createli(customStyle);
         } else {
             str = createli();
         }

         return $(str); //转化成文档碎片
     }

     function TaskContainer(data, successCallback) {

         var $element;

         //iboosk编译
         //在执行的时候节点已经存在
         //不需要在创建
         if (Xut.IBooks.runMode()) {
             $element = $("#" + data.prefix);
             successCallback($element, pseudoElement);
             return;
         }

         var pseudoElement,
             transform = data.initTransformParameter[0],
             direction = data.initTransformParameter[1],

         //创建的flip结构体
         $element = createContainer(transform, data),

         //创建节点的方向
         direction = direction === 'before' ? 'first' : 'last';

         //如果启动了wordMode模式,查找伪li
         if (config.virtualMode) {
             pseudoElement = $element.find('div');
         }

         Xut.nextTick({
             container: data.rootNode,
             content: $element,
             position: direction
         }, function () {
             successCallback($element, pseudoElement);
         });
     }

     /**
      *	创建背景
      */

     var prefix$2 = Xut.plat.prefixStyle;

     /**
      * 构建背景类
      * @param {[type]} rootNode             [根节点]
      * @param {[type]} data                 [数据]
      * @param {[type]} suspendCallback      [中断回调]
      * @param {[type]} successCallback      [description]
      */
     function TaskBackground(rootNode, data, suspendCallback, successCallback) {
         var layer,
             suspendTasks,
             nextTasks,
             self = this,
             content = data["md5"],
             isSVGContent = /.svg$/i.test(content) ? true : false;

         this.callback = {
             'suspendCallback': suspendCallback,
             'successCallback': successCallback
         };

         //iboosk节点预编译
         //在执行的时候节点已经存在
         //不需要在创建
         if (Xut.IBooks.runMode()) {
             //找到背景节点
             var $element = rootNode.find('.multilayer');
             successCallback();
             return;
         }

         //背景是否需要SVG解析
         this.parseMaster(isSVGContent, content, createWarpper);
         //构建背景
         function createWarpper(svgContents) {
             var backgroundStr = createMaster(svgContents, data);
             if (backgroundStr) {
                 svgContents = null;
                 self.compileSuspend($(backgroundStr), rootNode);
             } else {
                 successCallback();
             }
         }
     }

     TaskBackground.prototype = {

         clearReference: function clearReference() {},

         //构建中断函数
         compileSuspend: function compileSuspend($background, rootNode) {

             var nextTasks,
                 suspendTasks,
                 self = this;

             //继续执行
             nextTasks = function nextTasks() {
                 Xut.nextTick({
                     'container': rootNode,
                     'content': $background
                 }, function () {
                     self.clearReference();
                     self.callback.successCallback();
                 });
             };

             //中断方法
             suspendTasks = function suspendTasks() {
                 self.suspendQueues = [];
                 self.suspendQueues.push(function () {
                     nextTasks();
                 });
             };
             self.callback.suspendCallback(nextTasks, suspendTasks);
         },

         //运行被阻断的线程任务
         runSuspendTasks: function runSuspendTasks() {
             if (this.suspendQueues) {
                 var fn;
                 if (fn = this.suspendQueues.pop()) {
                     fn();
                 }
                 this.suspendQueues = null;
             }
         },

         //解析SVG背景
         parseMaster: function parseMaster(isSVGContent, content, callback) {
             if (isSVGContent) {
                 //背景需要SVG解析的
                 readFile(content, function (svgContents) {
                     callback(svgContents);
                 });
             } else {
                 callback('');
             }
         }
     };

     /**
      * 修正尺寸
      * @return {[type]} [description]
      */

     function fixSize(data) {
         //缩放比
         var proportion = Xut.config.proportion;
         data.path = Xut.config.pathAddress;
         data.imageWidth = data.imageWidth * proportion.width;
         data.imageHeight = data.imageHeight * proportion.height;
         data.imageLeft = data.imageLeft * proportion.left;
         data.imageTop = data.imageTop * proportion.top;
     }

     /*********************************************************************
      *                创建分层背景图层
      *                master               - 母版
      *                imageLayer,imageMask - 图像层图
      *                md5                  - 文字层图                                                                                     *
      **********************************************************************/

     function createMaster(svgContent, data) {
         var imageLayer,
             maskLayer,
             restr = '',
             imageLayerData = data["imageLayer"],
             //图片层
         imageMaskData = data["imageMask"],
             //蒙版层
         backImageData = data["backImage"],
             //真实图片层
         backMaskData = data["backMask"],
             //真实蒙版层
         masterData = data["master"],
             //母板
         backText = data['md5'],
             //背景文字
         pptMaster = data['pptMaster']; //母板PPTID

         //=======================未分层结构===========================
         //
         //		 只有SVG数据，没有层次数据 ,不是视觉差
         //
         // ============================================================
         if (backText && !masterData && !pptMaster && !imageLayerData) {
             return svgContent ? '<div class="multilayer" data-multilayer ="true" style="width:100%; height:100%;position:absolute;left:0;top:0;z-index:0;">' + svgContent + '</div>' : '';
         }

         //=========================分层结构============================
         //
         //   1 分母板 文字层 背景 蒙版
         //   2 视觉差分层处理
         //
         //=============================================================

         //修正尺寸
         fixSize(data);

         //============= 组层背景图开始 ====================

         restr = '<div class="multilayer" data-multilayer ="true" style="width:100%; height:100%;position:absolute;left:0;top:0;z-index:0;">';

         //如果有母板数据,如果不是视觉差
         if (masterData && !pptMaster) {
             //母版图
             restr += '<div class="master" style="width:100%; height:100%;background-size:100% 100%;position:absolute;z-index:0;background-image:url({0});"></div>';
         }

         //存在背景图
         if (imageLayerData) {
             //蒙版图（与背景图是组合关系）
             maskLayer = data["imageMask"] ? prefix$2("mask-box-image") + ":url(" + data.path + data["imageMask"] + ");" : "";
             //图片层
             restr += '<div class="imageLayer" style="width:{1}px;height:{2}px;top:{3}px;left:{4}px;position:absolute;z-index:2;background-size:100% 100%;background-image:url({5});{6};"></div>';
         }

         //新增的 真实背景图 默认全屏
         if (backImageData) {
             //计算出对页排版偏移值
             var backImageOffset = function () {
                 var background,
                     pageSide = data['pageSide'];

                 switch (Number(pageSide)) {
                     case 1:
                         background = 'background-position:0';
                         break;
                     case 2:
                         background = 'background-position:' + Xut.config.screenSize.width + 'px';
                         break;
                 }

                 return background;
             }();

             if (backMaskData) {
                 //带蒙版
                 if (prefix$2('mask-box-image') != undefined) {
                     restr += '<div class="backImage" style="width:{7};height:100%;position:absolute;z-index:1;background-size:100% 100%;background-image:url(' + data.path + backImageData + ');' + prefix$2('mask-box-image') + ':url(' + data.path + backMaskData + ');{8}"></div>';
                 } else {
                     restr += '<canvas class="backImage edges" height=' + document.body.clientHeight + ' width=' + document.body.clientWidth + '  style="width:{7};opacity:0;height:100%;background-size:100% 100%;position:absolute;z-index:1;-webkit-mask-box-image:url(' + data.path + backMaskData + ');{8}" src=' + data.path + backImageData + ' mask=' + data.path + backMaskData + '></canvas>';
                 }
             } else {
                 //图片层
                 restr += '<div class="backImage" style="width:{7};height:100%;position:absolute;z-index:1;background-size:100% 100%;background-image:url(' + data.path + backImageData + ');{8}"></div>';
             }
         }

         //存在svg文字
         if (backText) {
             restr += '<div class="words" style="width:100%;height:100%;top:0;left:0;position:absolute;z-index:3;">{9}</div>';
         }

         restr += '</div>';

         //============= 组层背景图结束 ====================

         return String.format(restr, data.path + masterData, data.imageWidth, data.imageHeight, data.imageTop, data.imageLeft, data.path + imageLayerData, maskLayer, backImageOffset ? '200%' : '100%', backImageOffset ? backImageOffset : '', svgContent);
     }

     //零件类型,快速判断
     //新增content卷滚区域,所有JS零件content
     //类型选择,content有扩充的子类型
     //针对零件类型在category字段中的子分类
     var widgetType = {};
     _.each("jsWidget content svgWidget canvasWidget path".split(" "), function (key, name) {
         widgetType[key] = true;
     });

     function typeExtend(Activity) {
         return widgetType[Activity.category] ? "JsWidget" : Activity.actType;
     }

     /**
      * 创建事件容器
      * @param  {[type]} eventId [description]
      * @return {[type]}         [description]
      */
     function createEventContainer(relateds, eventId) {
         if (!relateds.seasonRelated[eventId]) {
             relateds.seasonRelated[eventId] = {};
         }
     }

     /**
      * 配合出item中相关信息
      * 1.场景信息
      * 2.收费信息
      * @param  {[type]} tokens [description]
      * @return {[type]}        [description]
      */
     function adapterItemArrayRelated(relateds, activitys, tokens) {
         //如果分解出节信息
         var seasonId,
             inAppValue,
             chapterId,
             values,
             eventId = activitys.imageId;

         _.each(['seasonId', 'Inapp', 'SearchBar', 'BookMarks'], function (type) {
             values = tokens[type];
             //如果有值
             if (values !== undefined) {
                 //创建容器
                 createEventContainer(relateds, eventId);
                 switch (type) {
                     //跳转新场景信息
                     case 'seasonId':
                         chapterId = tokens['chapterId'] || tokens['chapter'];
                         relateds.seasonRelated[eventId] = {
                             seasonId: values[0],
                             chapterId: chapterId ? chapterId[0] : ''
                         };
                         break;
                     //收费信息,给事件上绑定收费接口
                     //0 收费 1 已收费
                     case 'Inapp':
                         relateds.seasonRelated[eventId]['Inapp'] = values[0];
                         break;
                     default:
                         //搜索栏
                         //书签
                         relateds.seasonRelated[eventId][type] = eventId;
                         break;
                 }
             }
         });
     }

     ////////////
     //解析相关数据 //
     ////////////
     function parserRelated(preCompileContents, data) {
         var activitys,
             createType,
             resultsActivitys,
             //结果结合
         i = preCompileContents.length,
             pageType = data.pageType,
             pid = data.pid,


         /**
          * 相关数据合集
          * @type {Object}
          */
         activityRelated = [],
             //Activit合集相关数据信息
         tempRelated = [],
             //临时数据

         /**
          * 解析出来的相关信息
          * @type {Object}
          */
         relateds = {
             seasonRelated: {}, //节信息
             containerRelated: [], //容器合集相关数据信息
             eventRelated: {}, //多事件容器合集
             partContentRelated: [] //卷滚conten只创建,不处理行为
         };

         /**
          * 创建解析
          * @param  {Function} callback [description]
          * @return {[type]}            [description]
          */
         function createResolve(callback) {
             return resolveContentToActivity(function (tokens) {
                 return callback(tokens);
             }, activitys, pageType, pid);
         }

         /**
          * 类型处理器
          * 除去动画的其余处理类型
          * @type {Object}
          */
         var hookResolve = {
             //单独处理容器类型
             "Container": function Container(relateds) {
                 relateds.containerRelated.push(createResolve(function (tokens) {
                     return {
                         'Container': tokens['Content']
                     };
                 }));
             },

             //多事件
             "Contents": function Contents(relateds) {
                 var item;
                 if (item = createResolve(function (tokens) {
                     return {
                         'Contents': [tokens]
                     };
                 })[0]) {
                     //给content注册多个绑定事件
                     var eventId = activitys.imageId;
                     var eventData = {
                         'eventContentId': eventId,
                         'activityId': activitys._id,
                         'registers': item['activity'],
                         'eventType': activitys.eventType,
                         'dragdropPara': activitys.para1 //拖拽对象
                     };
                     var isEvt = relateds.eventRelated['eventContentId->' + eventId];
                     if (isEvt) {
                         isEvt.push(eventData);
                     } else {
                         relateds.eventRelated['eventContentId->' + eventId] = [eventData];
                     }
                 }
             },

             //所有js零件
             "JsWidget": function JsWidget(relateds) {
                 var scrollContents = parseJSON(activitys.itemArray);
                 if (_.isArray(scrollContents)) {
                     _.each(scrollContents, function (data) {
                         relateds.partContentRelated.push(data.id);
                     });
                 } else {
                     relateds.partContentRelated.push(scrollContents.id);
                 }
             }
         };

         /**
          * 解析出当前页面的所有的Activit表
          * 1个chpater页面 可以对应多个Activit表中的数据
          * 1 Container 容器类型
          * 2 page 类型
          * 3 parallax 类型
          * 4 Scenario 类型
          * 5 content合集 contents处理
          *
          */
         while (activitys = preCompileContents.shift()) {

             createType = typeExtend(activitys);

             if (!hookResolve[createType]
             //钩子事件
              || hookResolve[createType] && hookResolve[createType](relateds)) {

                 /////////////////////
                 //Content类型处理 //
                 /////////////////////

                 //如果是动画表,视觉差表关联的content类型
                 resultsActivitys = createResolve(function (tokens) {
                     //解析itemArray字段中的相关的信息
                     adapterItemArrayRelated(relateds, activitys, tokens);
                     //解析表数据
                     switch (pageType) {
                         case 'page':
                             return parseTypeRelation(['Animation'], tokens);
                         case 'master':
                             //新增第三个参数，
                             //视觉差支持所有content动画
                             return parseTypeRelation(['Animation', 'Parallax'], tokens);
                     }
                 });

                 //如果有手动触发器,置于最后
                 if (activitys.imageId) {
                     tempRelated.push(resultsActivitys);
                 } else {
                     activityRelated.push(resultsActivitys);
                 }
             }
         }

         //合并排序
         if (tempRelated.length) {
             activityRelated = activityRelated.concat(tempRelated);
         }

         /**
          *	过滤出与创建相关的content合集ID
          *	return [
          *		createImageIds  主content列表 (用来绑定eventType事件)
          *	    createContentIds 合并所有content操作后,过滤掉重复的content,得到可以创建的content的ID合集
          *	]
          *
          * 	wContentRelated  混入合并的数据
          * partContentRelated 需要过滤的数据
          */
         // console.log(activityRelated.slice(0))
         var createImageIds,
             createContentIds,
             cacheUUID = 'createRelevant-' + data.chapterId,
             createRelevant = contentCache[cacheUUID];

         //创建缓存
         if (!createRelevant) {
             createRelevant = contentCache(cacheUUID, toRepeatCombineGroup(activityRelated, relateds.partContentRelated, pageType));
         }

         createImageIds = createRelevant[0].slice(0);
         createContentIds = createRelevant[1].slice(0);

         //如果存在过滤器
         if (Xut.CreateFilter.size()) {
             var filterEach = Xut.CreateFilter.each(data.chapterId);
             if (filterEach) {
                 filterEach(createImageIds, function (indexOf) {
                     createImageIds.splice(indexOf, 1);
                 });
                 filterEach(createContentIds, function (indexOf) {
                     createContentIds.splice(indexOf, 1);
                 });
                 filterEach = null;
             }
         }

         return _.extend(data, relateds, {
             'createImageIds': createImageIds, //事件ID数
             'createContentIds': createContentIds, //创建的content总ID数
             'originalCreateContentIds': createContentIds.slice(0), //保留原始的创建副本
             'activityRelated': activityRelated
         });
     };

     /**************************************************************************
      *
      * 		分组Content表中对应的多个Conte
      *   	1：Animation表
      *    	2: Parallax表
      *     	3: seed种子合集 就是解析1：Animation表，Parallax表得到的数据
      *
      ****************************************************************************/
     function resolveContentToActivity(callback, activity, pageType, pid) {
         var animContentIds,
             paraContentIds,
             parallaxRelated,
             parallaxDas,
             animRelated,
             animationDas = '',
             eventId = activity.imageId,

         //需要分解的contentIds合集
         // 1 动画表数据		Animation
         // 2 视觉差数据     Parallax
         // 3 超链接			seasonId
         // 4 收费			Inapp
         tokens = tokenize(activity['itemArray']) || [],

         //解析Animations,Parallaxs数据
         //	seed {
         //		Animation:[data,Ids]
         //		Parallax:[data,Ids]
         //	}
         seed = callback(tokens),


         //判断类型
         type = Object.keys(seed)[0];

         /**
          * 去重事件ID
          * original  原ID合集
          * detection 需要检测去重的ID
          *
          */
         function toRepeatContents(original) {
             if (original && eventId) {
                 var indexOf = original.indexOf(eventId);
                 if (-1 !== indexOf) {
                     original.splice(indexOf, 1);
                 }
             }
         }

         switch (type) {
             //容器
             case 'Container':
                 animContentIds = seed.Container;
                 toRepeatContents(animContentIds);
                 break;
             //多事件处理
             case 'Contents':
                 return seed.Contents;
             default:
                 /**
                  * 如果是对象处理，
                  * 针对动画表，视觉差表,行为的处理
                  */
                 //需要创建的content合集
                 if (_.keys(seed).length) {
                     animRelated = seed.Animation;
                     parallaxRelated = seed.Parallax;
                     //页面模式
                     if (pageType === 'page') {
                         if (animRelated) {
                             animContentIds = animRelated.ids;
                             animationDas = animRelated.das;
                         }
                     } else {
                         //视觉差存在视觉差表处理
                         // console.log(1111,animRelated, parallaxRelated)
                         //母版的动画数据
                         if (animRelated) {
                             animContentIds = animRelated.ids;
                             animationDas = animRelated.das;
                         }
                         //母版的视察数据
                         if (parallaxRelated) {
                             paraContentIds = parallaxRelated.ids;
                             parallaxDas = parallaxRelated.das;
                         }
                     }

                     //如果id都存在
                     //合并
                     if (animContentIds && paraContentIds) {
                         animContentIds = animContentIds.concat(paraContentIds);
                     }

                     //只存在视察
                     if (!animContentIds && paraContentIds) {
                         animContentIds = paraContentIds;
                     }
                     toRepeatContents(animContentIds);
                 }
                 break;
         }

         //创建对象是层次关系
         return {
             'pageType': pageType,
             'activity': activity,
             'imageIds': eventId,
             //data
             'seed': {
                 'animation': animationDas,
                 'parallax': parallaxDas
             },
             //id
             'ids': {
                 'content': animContentIds,
                 'parallax': paraContentIds
             }
         };
     }

     /************************************************************************
      *
      *     合并,过滤需要处理的content
      *     combineImageIds  可以创建的imageId合集，也就是content的合集,用来绑定自定义事件
      *     createContentIds 可以创建的content合集,过滤合并重复
      *
      * **********************************************************************/
     function toRepeatCombineGroup(compilerActivitys, mixFilterRelated, pageType) {
         var ids,
             contentIds,
             needCreateContentIds,
             imageIds,
             activityRelated,
             parallaxId,
             combineItemIds = [],
             combineImageIds = [],
             i = compilerActivitys.length;

         function pushCache(target, original, callback) {
             var id,
                 i = original.length;
             while (i--) {
                 id = Number(original[i]);
                 target.push(id);
                 callback && callback(id);
             }
         }

         while (i--) {
             //开始执行过滤操作
             activityRelated = compilerActivitys[i];
             ids = activityRelated.ids;
             contentIds = ids.content;
             parallaxId = ids.parallax; //浮动类型的对象
             imageIds = activityRelated.imageIds;

             //针对普通content对象
             if (contentIds && contentIds.length) {
                 //如果不为空
                 pushCache(combineItemIds, contentIds);
             }

             //视察对象
             if (parallaxId && parallaxId.length) {
                 //如果不为空
                 pushCache(combineItemIds, parallaxId);
             }

             //事件合集
             if (imageIds) {
                 combineImageIds.push(Number(imageIds));
             }
         }

         //混入外部合并了逻辑
         if (mixFilterRelated && mixFilterRelated.length) {
             _.each(mixFilterRelated, function (data) {
                 if (data) {
                     combineItemIds = combineItemIds.concat(data);
                 }
             });
         }

         //过滤合并多个content数据
         if (combineImageIds.length) {
             needCreateContentIds = arrayUnique(combineItemIds.concat(combineImageIds));
         } else {
             needCreateContentIds = arrayUnique(combineItemIds);
         }

         //排序
         needCreateContentIds = needCreateContentIds.sort(function (a, b) {
             return a - b;
         });

         /**
          * 合并创建信息
          * 需要创建的事件
          * 需要创建的所有对象
          */
         return [combineImageIds, needCreateContentIds];
     }

     /**
      * 解析指定类型数据
      * strengthenAnmin 视觉差增强动画表
      * @return {[type]}
      */
     function parseTypeRelation(tableName, tokenIds) {
         var tokenId;
         var itemData = {};
         _.each(tableName, function (tName) {
             if (tokenId = tokenIds[tName]) {
                 if (itemData[tName]) {
                     console.log('未处理解析同一个表');
                 } else {
                     itemData[tName] = inGroup(tName, tokenId);
                 }
             }
         });
         return itemData;
     }

     /**
      * 分组
      * @return {[type]} [description]
      */
     function inGroup(tableName, contentIds) {
         var k,
             keyName,
             data,
             contentId,
             temp = {},
             das = [],
             ids = [],
             query = Xut.data.query;

         _.each(contentIds, function (id) {
             if (data = query(tableName, id)) {
                 contentId = data.contentId;
                 if (-1 === ids.indexOf(contentId)) {
                     ids.push(contentId);
                 }
                 //合并同个contentId多条动画数据的情况
                 keyName = "contentId-" + contentId;
                 if (temp[keyName]) {
                     temp[keyName].push(data);
                 } else {
                     temp[keyName] = [data];
                 }
             }
         });

         //转成数组格式
         for (k in temp) {
             das.push(temp[k]);
         }

         return {
             das: das,
             ids: ids
         };
     }

     //解析itemArray序列,得到对应的id
     function tokenize(itemArray) {
         var itemJson,
             actType,
             anmins = {};
         if (!itemArray) return;
         itemJson = parseJSON(itemArray);
         //解析多个参数
         if (itemJson.length) {
             _.each(itemJson, function (opts) {
                 actType = opts.actType;
                 if (!anmins[actType]) {
                     anmins[actType] = [];
                 }
                 anmins[actType].push(opts.id);
             });
         } else {
             actType = itemJson.actType;
             anmins[actType] = [];
             //actType: "Animation", id: 14
             //actType: "Inapp", value: 0
             anmins[actType].push(itemJson.id || itemJson.value);
         }
         return anmins;
     }

     /**
      * pixi帧队列控制器
      * @param  {[type]} Utils        [description]
      * @param  {[type]} Config       [description]
      * @param  {[type]} pixiFactory) {               var rAF [description]
      * @return {[type]}              [description]
      */

     var rAF = function rAF(callback) {
         return window.setTimeout(callback, 1000 / 10);
     };

     //收集绘制内容
     var rQueue = {};

     // $("body").on("click",function(){
     //     console.log(rQueue,Xut.Presentation.GetPageObj())
     // })

     /**
      * 运动动画
      * @param  {[type]} activeIndex [description]
      * @return {[type]}             [description]
      */
     function requestAnimation(activeIndex) {
         var key, content;
         var queue = rQueue[activeIndex];
         var timeout = 0;
         var state = true;
         var clern = function clern() {
             clearTimeout(timeout);
             timeout = null;
         };
         var run = function run() {
             //如果停止
             if (!state) {
                 clern();
                 return;
             }
             if (rQueue[activeIndex]) {
                 var fns = queue["fns"];
                 //刷新
                 for (key in fns) {
                     fns[key](); //执行刷新
                 }
                 // console.log('runRequestAnimation....',activeIndex, Object.keys(fns).length)
                 timeout = rAF(function () {
                     run();
                 });
             }
         };
         run();
         //停止刷新
         this.stop = function () {
             if (state) {
                 state = false;
                 clern();
             }
         };
         //刷新停止
         //外部重新激活
         this.activate = function () {
             if (!state) {
                 state = true;
                 run();
             }
         };
         return this;
     }

     /**
      * 检测运行
      * @param  {[type]} pageIndex [description]
      * @return {[type]}           [description]
      */
     function checkRun(pageIndex) {
         // 活动页面索引
         var activeIndex = Xut.Presentation.GetPageIndex();
         //激活
         if (activeIndex === pageIndex) {
             var queue = rQueue[activeIndex];
             //去重
             if (queue.rAF) {
                 queue.rAF.activate();
             } else {
                 queue.rAF = new requestAnimation(activeIndex);
             }
         }
     }

     /**
      * 用于绘制显示的，特殊处理
      * 单独只刷新一次
      * @return {[type]} [description]
      */
     function oneQueue(fn) {
         var start = +new Date();
         var timeout;
         var state = true;
         var run = function run() {
             if (!state) {
                 timeout && clearTimeout(timeout);
             }
             timeout = rAF(run);
         };
         if (+new Date() - start > 100) {
             state = false;
             clearTimeout(timeout);
             timeout = null;
         }
     }

     /**
      * 加入绘制队列
      * @param {[type]} pageIndex [description]
      * @param {[type]} key       [description]
      * @param {[type]} value     [description]
      */
     function addQueue(pageIndex, key, value, type) {
         // console.log('c',pageIndex,key)
         if (!rQueue[pageIndex]) {
             rQueue[pageIndex] = hash();
             rQueue[pageIndex]['rAF'] = 0;
             rQueue[pageIndex]['fns'] = hash();
             rQueue[pageIndex]['types'] = hash();
             rQueue[pageIndex]['length'] = 0;
             rQueue[pageIndex]['pageIndex'] = pageIndex;
         }
         if (!rQueue[pageIndex]['fns'][key]) {
             rQueue[pageIndex]['fns'][key] = value;
             rQueue[pageIndex]['types'][key] = type;
             ++rQueue[pageIndex]['length'];
         } else {
             console.log('rQueue' + key + '已存在');
         }
         //开始运行
         checkRun(pageIndex);
     }

     /**
      * 移除刷新队列
      * @param  {[type]} pageIndex [description]
      * @param  {[type]} key       [description]
      * @return {[type]}           [description]
      */
     function removeQueue(pageIndex, key) {
         if (rQueue[pageIndex] && rQueue[pageIndex]['fns']) {
             delete rQueue[pageIndex]['fns'][key];
             delete rQueue[pageIndex]['types'][key];
             --rQueue[pageIndex]['length'];
             if (!Object.keys(rQueue[pageIndex]['fns']).length) {
                 if (rQueue[pageIndex].rAF) {
                     rQueue[pageIndex].rAF.stop();
                 }
             }
         } else {
             console.log('删除的页面不存在');
         }
     }

     /**
      * 销毁
      * @return {[type]} [description]
      */
     function destroyQueue(pageIndex) {
         if (rQueue[pageIndex]) {
             if (rQueue[pageIndex].rAF) {
                 rQueue[pageIndex].rAF.stop();
             }
             if (!Object.keys(rQueue[pageIndex]['fns']).length) {
                 delete rQueue[pageIndex];
             }
         }
     }

     /**
      * 制作uuid
      * @return {[type]} [description]
      */
     function makeGuid() {
         return Xut.guid('rAF');
     }

     /**
      * 创建pipx对象
      * @param  {[type]} canvasContainer [description]
      * @param  {[type]} wrapObj         [description]
      * @return {[type]}                 [description]
      */
     function Container(data, canvasIndex) {

         var width = Xut.config.screenSize.width;
         var height = Xut.config.screenSize.height;
         var pageIndex = data.pageIndex;

         var renderer = PIXI.autoDetectRenderer(width, height, {
             transparent: true
         });
         //设置层级关系
         renderer.view.style.position = "absolute";
         renderer.view.style.zIndex = canvasIndex;

         //放入容器
         data.element.append(renderer.view);

         //根容器
         var containerStage = new PIXI.Container();

         //扩充场景处理接口
         var expandRelated = {
             stageWidth: width,
             stageHeight: height,
             container: renderer.view, //canvas容器
             containerStage: containerStage, //根容器
             sprites: {}, //保存精灵合集

             /**
              * 将子pixi加入进来
              */
             addChild: function addChild(stage) {
                 containerStage.addChild(stage);
             },

             /**
              * 初始化绘制,3秒的时间
              * 尽量保证节点加载完毕
              * @return {[type]} [description]
              */
             display: function display() {
                 oneQueue(pageIndex, function display() {
                     renderer.render(containerStage);
                 });
             },

             /**
              * 绘制一次
              * @return {[type]} [description]
              */
             oneRender: function oneRender() {
                 renderer.render(containerStage);
             },

             /**
              * 不断绘制
              * task 外部任务
              * type 执行play的类型 高级，普通精灵
              * @return {[type]} [description]
              */
             play: function play(type, task) {
                 var uuid = makeGuid();
                 addQueue(pageIndex, uuid, function play() {
                     task && task();
                     renderer.render(containerStage);
                 }, type);
                 return uuid;
             },

             /**
              * 停止绘制
              * @return {[type]} [description]
              */
             stop: function stop(uuid) {
                 removeQueue(pageIndex, uuid);
             },

             /**
              * 销毁
              * @return {[type]} [description]
              */
             destroy: function destroy() {
                 if (data.canvasRelated) {
                     destroyQueue(pageIndex);
                     data.canvasRelated.container = null;
                     if (data.canvasRelated.containerStage) {
                         data.canvasRelated.containerStage.removeChildren();
                     }
                     data.canvasRelated = null;
                 }
             }
         };

         //扩充pixi控制
         _.extend(data.canvasRelated, expandRelated);
     }

     var prefix$3 = Xut.plat.prefixStyle;

     /**
      * 解析序列中需要的数据
      * @param  {[type]}   contentIds [description]
      * @param  {Function} callback   [description]
      * @return {[type]}              [description]
      */
     function parseContentDas(contentIds, callback) {
         var data,
             temp = [];
         contentIds.forEach(function (contentId, index) {
             data = Xut.data.query('Content', contentId);
             temp.unshift(data);
             callback && callback(data, contentId);
         });
         return temp;
     }

     /**
      * 制作包装对象
      * 用于隔绝content数据的引用关系
      * 导致重复数据被修正的问题
      * @return {[type]}             [description]
      */
     function makeWarpObj(contentId, content, pageType, pid, virtualOffset) {
         //唯一标示符
         var prefix = "_" + pid + "_" + contentId;
         return {
             pageType: pageType,
             contentId: contentId,
             isJs: /.js$/i.test(content.md5), //html类型
             isSvg: /.svg$/i.test(content.md5), //svg类型
             data: content,
             pid: pid,
             virtualOffset: virtualOffset, //布局位置
             containerName: 'Content' + prefix,
             makeId: function makeId(name) {
                 return name + prefix;
             }
         };
     }

     /**
      * 创建图片地址
      * @return {[type]}         [description]
      */
     function analysisPath(wrapObj, conData) {
         var pathImg,
             imgContent = conData.md5,

         //是gif格式
         isGif = /.gif$/i.test(imgContent),

         //原始地址
         originalPathImg = Xut.config.pathAddress + imgContent;

         if (isGif) {
             //处理gif图片缓存+随机数
             pathImg = Xut.createRandomImg(originalPathImg);
         } else {
             pathImg = originalPathImg;
         }
         wrapObj['imgContent'] = imgContent;
         wrapObj['isGif'] = isGif;
         wrapObj['pathImg'] = pathImg;
     }

     /**
      * 组成HTML结构
      * @param  {[type]} argument [description]
      * @return {[type]}          [description]
      */
     function createDom(data, wrapObj) {
         var restr = '';
         //创建包装容器
         restr += createWapper(data, wrapObj);
         //创建内容
         restr += createContent(data, wrapObj);
         restr += "</div></div>";
         return restr;
     }

     /**
      * 创建包含容器
      * @param  {[type]} data    [description]
      * @param  {[type]} wrapObj [description]
      * @return {[type]}         [description]
      */
     function createWapper(data, wrapObj) {
         var wapper,
             actName,
             offset,
             visibility,
             backwidth,
             backheight,
             backleft,
             backtop,
             zIndex = data['zIndex'],
             id = data['_id'],
             containerName = wrapObj.containerName,
             pid = wrapObj.pid,
             makeId = wrapObj.makeId,
             background = data.background ? 'background-image: url(' + Xut.config.pathAddress + data.background + ');' : '';

         //背景尺寸优先
         if (data.scaleBackWidth && data.scaleBackHeight) {
             backwidth = data.scaleBackWidth;
             backheight = data.scaleBackHeight;
             backleft = data.scaleBackLeft;
             backtop = data.scaleBackTop;
             wrapObj.backMode = true; //背景图模式
         } else {
                 backwidth = data.scaleWidth;
                 backheight = data.scaleHeight;
                 backleft = data.scaleLeft;
                 backtop = data.scaleTop;
             }

         //content默认是显示的数据的
         //content.visible = 0
         //如果为1 就隐藏改成hidden
         //05.1.14
         visibility = 'visible';
         if (data.visible) {
             visibility = 'hidden';
         }

         // var isHtml = "";
         //2015.12.29
         //如果是html内容
         if (wrapObj.isJs) {
             //正常content类型
             wapper = '<div id="{0}"' + ' data-behavior="click-swipe"' + ' style="overflow:hidden;width:{1}px;height:{2}px;top:{3}px;left:{4}px;position:absolute;z-index:{5};visibility:{6};background-size:100% 100%;{10}">' + ' <div id="{7}" style="width:{8}px;position:absolute;">';

             return String.format(wapper, containerName, backwidth, backheight, backtop, backleft, zIndex, visibility, makeId('contentWrapper'), backwidth, backheight, background);
         }

         //正常content类型
         wapper = '<div id="{0}"' + ' data-behavior="click-swipe"' + ' style="overflow:hidden;width:{1}px;height:{2}px;top:{3}px;left:{4}px;position:absolute;z-index:{5};visibility:{6};">' + ' <div id="{7}" style="width:{8}px;height:{9}px;{10}position:absolute;background-size:100% 100%;">';

         return String.format(wapper, containerName, backwidth, backheight, backtop, backleft, zIndex, visibility, makeId('contentWrapper'), backwidth, backheight, background);
     }

     /**
      * content
      * 	svg数据
      * 	html数据
      * 解析外部文件
      * @param  {[type]} wrapObj     [description]
      * @param  {[type]} svgCallback [description]
      * @return {[type]}             [description]
      */
     function externalFile(wrapObj, svgCallback) {
         //svg零件不创建解析具体内容
         if (wrapObj.isSvg) {
             readFile(wrapObj.data.md5, function (svgdata) {
                 wrapObj['svgstr'] = svgdata;
                 svgCallback(wrapObj);
             });
         } else if (wrapObj.isJs) {
             //如果是.js的svg文件
             readFile(wrapObj.data.md5, function (htmldata) {
                 wrapObj['htmlstr'] = htmldata;
                 svgCallback(wrapObj);
             }, "js");
         } else {
             svgCallback(wrapObj);
         }
     }

     /**
      * 创建内容
      * @param  {[type]} data    [description]
      * @param  {[type]} wrapObj [description]
      * @return {[type]}         [description]
      */
     function createContent(data, wrapObj) {
         var restr = "";
         //如果内容是图片
         //如果是svg或者html
         if (wrapObj.imgContent) {
             //如果是SVG
             if (wrapObj.isSvg) {
                 restr += svgContent(data, wrapObj);
             } else if (wrapObj.isJs) {
                 //如果是.js结构的html文件
                 restr += jsContent(data, wrapObj);
             } else {
                 //如果是蒙板，或者是gif类型的动画，给高度
                 restr += maskContent(data, wrapObj);
             }
         } else {
             //纯文本文字
             restr += textContent(data, wrapObj);
         }
         return restr;
     }

     /**
      * 如果是.js结尾的
      * 新增的html文件
      * @param  {[type]} data    [description]
      * @param  {[type]} wrapObj [description]
      * @return {[type]}         [description]
      */
     function jsContent(data, wrapObj) {
         return wrapObj["htmlstr"];
     }

     /**
      * 如果内容是svg
      * @param  {[type]} data    [description]
      * @param  {[type]} wrapObj [description]
      * @return {[type]}         [description]
      */
     function svgContent(data, wrapObj) {
         var restr = "",
             svgstr = wrapObj['svgstr'],
             scaleWidth = data['scaleWidth'];

         //从SVG文件中，读取Viewport的值
         if (svgstr != undefined) {
             var startPos = svgstr.search('viewBox="');
             var searchTmp = svgstr.substring(startPos, startPos + 64).replace('viewBox="', '').replace('0 0 ', '');
             var endPos = searchTmp.search('"');
             var temp = searchTmp.substring(0, endPos);
             var sptArray = temp.split(" ");
             var svgwidth = sptArray[0];
             var svgheight = sptArray[1];

             //svg内容宽度:svg内容高度 = viewBox宽:viewBox高
             //svg内容高度 = svg内容宽度 * viewBox高 / viewBox宽
             var svgRealHeight = Math.floor(scaleWidth * svgheight / svgwidth);
             //如果svg内容高度大于布局高度则添加滚动条
             if (svgRealHeight > data.scaleHeight + 1) {
                 var svgRealWidth = Math.floor(scaleWidth);
                 //if there do need scrollbar, then restore text to its original prop
                 //布局位置
                 var marginleft = wrapObj['backMode'] ? data.scaleLeft - data.scaleBackLeft : 0;
                 var margintop = wrapObj['backMode'] ? data.scaleTop - data.scaleBackTop : 0;
                 temp = '<div style="width:{0}; height:{1};margin-left:{2}px;margin-top:{3}px;">{4}</div>';

                 if (data.isScroll) {
                     restr = String.format(temp, svgRealWidth + 'px', svgRealHeight + 'px', marginleft, margintop, svgstr);
                 } else {
                     restr = String.format(temp, '100%', '100%', marginleft, margintop, svgstr);
                 }
             } else {
                 restr += svgstr;
             }
         }
         return restr;
     }

     /**
      * 蒙版动画
      * @param  {[type]} data    [description]
      * @param  {[type]} wrapObj [description]
      * @return {[type]}         [description]
      */
     function maskContent(data, wrapObj) {

         var restr = "",

         //如果有蒙版图
         isMaskImg = data.mask ? prefix$3('mask-box-image') + ":url(" + Xut.config.pathAddress + data.mask + ");" : "";

         //蒙板图
         if (data.mask || wrapObj['isGif']) {
             //蒙版图
             if (prefix$3('mask-box-image') != undefined) {
                 restr += String.format('<img' + ' id="img_{1}"' + ' class="contentScrollerImg"' + ' src="{0}"' + ' style="width:{2}px;height:{3}px;position:absolute;background-size:100% 100%;{4}"/>', wrapObj['pathImg'], data['_id'], data.scaleWidth, data.scaleHeight, isMaskImg);
             } else {
                 //canvas
                 restr += String.format(' <canvas src="{0}"' + ' class="contentScrollerImg edges"' + ' mask="{5}"' + ' id = "img_{1}"' + ' width="{2}"' + ' height="{3}"' + ' style="width:{2}px; height:{3}px;opacity:0; background-size:100% 100%; {4}"' + ' />', wrapObj['pathImg'], data['_id'], data.scaleWidth, data.scaleHeight, isMaskImg, Xut.config.pathAddress.replace(/\//g, "\/") + data.mask);
             }
             //精灵图
         } else if (data.category == 'Sprite') {

                 var matrixX = 100 * data.thecount;
                 var matrixY = 100;

                 //如果有参数
                 //精灵图是矩阵图
                 if (data.parameter) {
                     var parameter = Utils.parseJSON(data.parameter);
                     if (parameter && parameter.matrix) {
                         var matrix = parameter.matrix.split("-");
                         matrixX = 100 * Number(matrix[0]);
                         matrixY = 100 * Number(matrix[1]);
                     }
                 }
                 restr += String.format('<div' + ' class="sprite"' + ' style="height:{0}px;background-image:url({1});background-size:{2}% {3}%;"></div>', data.scaleHeight, wrapObj['pathImg'], matrixX, matrixY);
             } else {
                 //普通图片
                 restr += String.format('<img' + ' src="{0}"' + ' class="contentScrollerImg"' + ' id="img_{1}"' + ' style="width:{2}px;height:{3}px;position:absolute;background-size:100% 100%; {4}"/>', wrapObj['pathImg'], data['_id'], data.scaleWidth, data.scaleHeight, isMaskImg);
             }

         return restr;
     }

     /**
      * 纯文本内容
      * @param  {[type]} data [description]
      * @return {[type]}      [description]
      */
     function textContent(data) {
         return String.format('<div' + ' id = "{0}"' + ' style="background-size:100% 100%;height:auto">{1}</div>', data['_id'], data.content);
     }

     /**
      * 针对容器类型的处理
      * @param  {[type]} containerName [description]
      * @param  {[type]} contentId     [description]
      * @param  {[type]} pid     [description]
      * @return {[type]}               [description]
      */
     function createContainerWrap(containerName, contentId, pid) {
         var contentDas = parseContentDas([contentId]),
             data = reviseSize(contentDas[0]),
             wapper = '<div' + ' id="{0}"' + ' data-behavior="click-swipe"' + ' style="width:{1}px;height:{2}px;top:{3}px;left:{4}px;position:absolute;z-index:{5};">';

         return String.format(wapper, containerName, data.scaleWidth, data.scaleHeight, data.scaleTop, data.scaleLeft, data.zIndex);
     }

     function createContainer$1(containerRelated, pid) {
         var itemIds,
             uuid,
             contentId,
             containerName,
             containerObj = {
             createUUID: [],
             containerName: []
         };
         containerRelated.forEach(function (data, index) {
             contentId = data.imageIds;
             containerName = "Container_" + pid + "_" + contentId, uuid = "aaron" + Math.random();
             containerObj[uuid] = {
                 'start': [createContainerWrap(containerName, contentId, pid)],
                 'end': '</div>'
             };
             containerObj.createUUID.push(uuid);
             containerObj.containerName.push(containerName);
             data.itemIds.forEach(function (id) {
                 containerObj[id] = uuid;
             });
         });
         return containerObj;
     }

     //=====================================================
     //
     //	构建content的序列tokens
     //	createImageIds,
     //	containerRelated,
     //	createContentIds
     //	pid,
     //	pageType,
     //	dydCreate //重要判断,动态创建
     //
     //=======================================================
     function structure(callback, data, context) {
         var content,
             contentId,
             wrapObj,
             containerObj,
             sizeResults,
             contentCollection,
             contentCount,
             cloneContentCount,
             createImageIds = data.createImageIds,
             pid = data.pid,
             pageType = data.pageType,
             containerRelated = data.containerRelated,
             seasonRelated = data.seasonRelated,
             isMaster = pageType === 'master',


         //容器li生成的位置
         //left,right
         virtualOffset = data.virtualOffset,


         ////////////
         //浮动处理 //
         //1.浮动母版对象
         //2.浮动页面对象
         ////////////
         floatMaters = data.floatMaters,
             floatPages = data.floatPages,


         //文本框
         //2016.1.7
         contentHtmlBoxIds = [],


         //所有content的id记录
         //返回出去给ibooks预编译使用
         idFix = [],


         //默认canvas容器的层级
         //取精灵动画最高层级
         //2016.2.25
         canvasIndex = 1,


         //缓存contentDas
         contentDas = {},

         //缓存content结构
         cachedContentStr = [];

         //启动cnavas模式
         var canvasRelatedMode = data.canvasRelated.enable;

         //容器结构创建
         if (containerRelated && containerRelated.length) {
             containerObj = createContainer$1(containerRelated, pid);
         }

         //========================================
         //
         //	    创建dom结构
         //
         //========================================

         /**
          * 转化canvas模式 contentMode 0/1
          * 页面或者母板浮动对象
          * 页面是最顶级的
          * @return {[type]}           [description]
          */
         var eachPara = function eachPara(parameter, contentId, conData) {
             var zIndex;
             _.each(parameter, function (para) {
                 //针对母版content的topmost数据处理，找出浮动的对象Id
                 //排除数据topmost为0的处理
                 zIndex = para['topmost'];
                 if (zIndex && zIndex != 0) {
                     if (isMaster) {
                         //收集浮动的母版对象id
                         floatMaters.ids.push(contentId);
                         floatMaters.zIndex[contentId] = zIndex;
                     } else {
                         //浮动页面
                         floatPages.ids.push(contentId);
                         floatPages.zIndex[contentId] = zIndex;
                     }
                 }
             });
         };

         /**
          * 设置canvas数据
          */
         var createCanvasData = function createCanvasData(type, contentId, conData) {
             //content收集id标记
             //cid =>content=> 普通动画 ppt
             //wid =>widget=>高级动画
             if (data.canvasRelated[type].indexOf(contentId) == -1) {
                 data.canvasRelated[type].push(contentId);
                 conData.actionTypes[type] = true;
             }

             if (data.canvasRelated.cid.indexOf(contentId) == -1) {
                 data.canvasRelated.cid.push(contentId);
             }

             //给content数据增加直接判断标示
             conData.canvasMode = true;

             //拿到最高层级
             if (conData.zIndex) {
                 if (conData.zIndex > canvasIndex) {
                     canvasIndex = conData.zIndex;
                 }
             }
         };

         /**
          * canvas pixi.js类型处理转化
          * 填充cid, wid
          * @type {Object}
          */
         var pixiType = {
             //普通精灵动画
             "Sprite": function Sprite(contentId, conData) {
                 //启动精灵模式
                 //在动画处理的时候给initAnimations快速调用
                 createCanvasData('spiritId', contentId, conData);
             },
             //ppt=》pixi动画
             "PPT": function PPT(contentId, conData) {
                 createCanvasData('pptId', contentId, conData);
             },
             //高级精灵动画
             //widget
             "SeniorSprite": function SeniorSprite(contentId, conData) {
                 createCanvasData('widgetId', contentId, conData);
             }
         };

         /**
          * 开始过滤参数
          * @return {[type]}           [description]
          */
         var prefilter = function prefilter(conData, contentId) {
             var eventId, parameter;
             var category = conData.category;

             //如果是模板书签，强制为浮动对象
             if (isMaster && (eventId = seasonRelated[contentId])) {
                 if (eventId['BookMarks']) {
                     floatMaters.ids.push(contentId);
                 }
             }

             //如果有parameter参数
             //1 浮动对象
             //2 canvas对象
             if (conData) {
                 //转成canvas标记
                 //如果有pixi的处理类型
                 //2016.2.25
                 //SeniorSprite,PPT
                 //Sprite,PPT
                 //SeniorSprite
                 //Sprite
                 //PPT
                 //5种处理方式
                 //可以组合
                 if (canvasRelatedMode && category) {
                     var _cat;
                     var cat;
                     var _cats = category.split(",");
                     var i = _cats.length;
                     //动作类型
                     conData.actionTypes = {};
                     if (i) {
                         while (i--) {
                             cat = _cats[i];
                             //匹配数据类型
                             pixiType[cat] && pixiType[cat](contentId, conData);
                         }
                     }
                 }

                 //如果有parameter
                 if (conData.parameter) {
                     if (parameter = parseJSON(conData.parameter)) {
                         //parameter保持数组格式
                         eachPara(parameter.length ? parameter : [parameter], contentId, conData);
                     }
                 }
             }
         };

         /**
          * 解析出每一个content对应的动作
          * 传递prefilter过滤器
          * 1 浮动动作
          * 2 canvas动作
          * @type {[type]}
          */
         contentCollection = parseContentDas(data.createContentIds, prefilter);
         contentCount = cloneContentCount = contentCollection.length;

         //创建canvas画布
         if (canvasRelatedMode) {
             Container(data, canvasIndex);
         }

         ////////////////
         //开始生成所有的节点 //
         //1:dom
         //2:canvas
         ////////////////
         while (contentCount--) {

             //根据数据创content结构
             if (content = contentCollection[contentCount]) {
                 contentId = content['_id'];
                 //创建包装器,处理数据引用关系
                 wrapObj = makeWarpObj(contentId, content, pageType, pid, virtualOffset);
                 idFix.push(wrapObj.containerName);

                 //保存文本框content的Id
                 if (wrapObj.isJs) {
                     contentHtmlBoxIds.push(contentId);
                 }
                 //转换缩放比
                 sizeResults = reviseSize(wrapObj.data);

                 //如果启用了virtualMode模式
                 //对象需要分离创建
                 if (Xut.config.virtualMode) {
                     virtualCreate(sizeResults, wrapObj, content, contentId);
                 } else {
                     //正常模式下创建
                     startCreate(wrapObj, content, contentId);
                 }
             } else {
                 //或者数据出错
                 checkComplete();
             }
         }

         //开始创建节点
         function startCreate(wrapObj, content, contentId) {
             //缓存数据
             contentDas[contentId] = content;
             //开始创建
             createRelated(contentId, wrapObj);
         }

         /**
          * 清理剔除的content
          * @param  {[type]} contentId [description]
          * @return {[type]}           [description]
          */
         function clearContent(contentId) {
             data.createContentIds.splice(data.createContentIds.indexOf(contentId), 1);
             checkComplete();
         }

         /**
          * 虚拟模式区分创建
          * @param  {[type]} sizeResults [description]
          * @param  {[type]} wrapObj     [description]
          * @param  {[type]} content     [description]
          * @param  {[type]} contentId   [description]
          * @return {[type]}             [description]
          */
         function virtualCreate(sizeResults, wrapObj, content, contentId) {
             // 创建分布左边的对象
             if (wrapObj.virtualOffset === 'left') {
                 if (sizeResults.scaleLeft < Xut.config.screenSize.width) {
                     startCreate(wrapObj, content, contentId);
                 } else {
                     clearContent(contentId);
                 }
             }
             // 创建分布右边的对象
             if (wrapObj.virtualOffset === 'right') {
                 if (sizeResults.scaleLeft > Xut.config.screenSize.width) {
                     startCreate(wrapObj, content, contentId);
                 } else {
                     clearContent(contentId);
                 }
             }
         }

         /**
          * 创建content节点
          * @param  {[type]} wrapObj [description]
          * @return {[type]}         [description]
          */
         function createRelated(contentId, wrapObj) {
             //解析外部文件
             externalFile(wrapObj, function (wrapObj) {
                 var uuid,
                     startStr,
                     contentStr,
                     conData = wrapObj.data;

                 //拼接地址
                 analysisPath(wrapObj, conData);

                 //dom模式下生成dom节点
                 //canvas模式下不处理，因为要合并到pixi场景中
                 if (!conData.canvasMode) {
                     contentStr = createDom(conData, wrapObj);
                 }

                 //如果创建的是容器对象
                 if (containerObj && (uuid = containerObj[contentId])) {
                     startStr = containerObj[uuid];
                     startStr.start.push(contentStr);
                 } else {
                     //普通对象
                     cachedContentStr.unshift(contentStr);
                 }

                 //检测完毕
                 checkComplete();
             });
         }

         /**
          * 返回处理
          * @return {[type]} [description]
          */
         function checkComplete() {
             if (cloneContentCount === 1) {
                 //针对容器处理
                 if (containerObj) {
                     var start,
                         end,
                         containerStr = [];
                     //合并容器
                     containerObj.createUUID.forEach(function (uuid) {
                         start = containerObj[uuid].start.join('');
                         end = containerObj[uuid].end;
                         containerStr.push(start.concat(end));
                     });
                     containerStr = containerStr.join('');
                     containerName = containerObj.containerName;
                     containerObj = null;
                     callback.call(context, contentDas, cachedContentStr.join('').concat(containerStr), containerName, idFix, contentHtmlBoxIds);
                 } else {
                     callback.call(context, contentDas, cachedContentStr.join(''), '', idFix, contentHtmlBoxIds);
                 }
             }
             cloneContentCount--;
         }
     }

     /**
      * 针对分段处理
      * 只构件必要的节点节点对象
      * content字段中visible === 0 是构建显示的对象
      * 					 	=== 1 是构建隐藏的对象
      *
      * 并且不是动态创建
      */
     // if (false && (1 == content.visible) && !data.dydCreate) {
     // endReturn();  //false 先屏蔽 ，客户端未实现
     // }else{}

     /**
      * 填充缺少的content对象
      * @return {[type]} [description]
      */

     /**
      * 按照shift取出执行代码
      * @return {[type]} [description]
      */
     function segmentation(delayBind) {
         var exetBind;
         while (exetBind = delayBind.shift()) {
             exetBind();
         }
     }

     function Mix(base, waitCreateContent, exitCallback) {
         var abstractContents = base.abstractContents,
             contentsFragment = base.relatedData.contentsFragment,
             pid = base.pid,
             pageType = base.pageType,

         //因为要dom去重,要处理创建的内容
         execWaitCreateContent = function execWaitCreateContent() {
             var willCreate = [],
                 prefix;
             _.each(waitCreateContent, function (contentId) {
                 prefix = base.makePrefix('Content', base.pid, contentId);
                 if (!contentsFragment[prefix]) {
                     //如果dom不存在,则创建
                     willCreate.push(contentId);
                 }
             });
             return willCreate;
         };

         /**
          * 合并创建节点
          **/
         function fillStructure(callback) {
             conStructure({
                 'dydCreate': true,
                 createContentIds: execWaitCreateContent,
                 pid: pid,
                 pageType: pageType
             }, function (contentDas, cachedContentStr, containerPrefix) {
                 callback(contentDas, $(cachedContentStr), containerPrefix);
             });
         }

         /**
          * 填充空节点数据
          * contentsFragment临时文档碎片
          * @return {[type]}       [description]
          */
         function fillFragment(cachedContentStr) {
             _.each(cachedContentStr, function (ele, index) {
                 contentsFragment[ele.id] = ele;
             });
         }

         /**
          * 填充作用域对象
          * @return {[type]} [description]
          */
         function fillAssistContents() {
             _.each(abstractContents, function (scope, index) {
                 var scopeObj;
                 if (!scope.$contentProcess) {
                     scopeObj = base.createHandlers(scope, 'waitCreate');
                     abstractContents.splice(index, 1, scopeObj); //替换作用域对象
                 }
             });
         }

         /**
          * 重构动态事件
          * 需要跳到不同的作用域对象
          * @return {[type]}           [description]
          */
         function fillEvent() {
             var collectEventRelated = base.relatedData.collectEventRelated,
                 eventObj,
                 parent,
                 delayBind = []; //延时绑定
             _.each(waitCreateContent, function (contentId) {
                 eventObj = collectEventRelated[contentId];
                 //事件对象存在,并且没有绑定事件
                 if (eventObj && !eventObj.isBind) {
                     parent = eventObj.parent;
                     parent.createEvent.call(parent);
                     delayBind.push(function () {
                         parent.bindEvent.call(parent);
                     });
                 }
             });
             return delayBind;
         }

         /**
          * 清理
          * @return {[type]} [description]
          */
         function clean() {
             base.waitCreateContent = null;
         }

         /**
          * 绘制显示
          * @return {[type]} [description]
          */
         function toRedraw(cachedContentStr) {
             Xut.nextTick({
                 'container': base.rootNode,
                 'content': cachedContentStr
             }, function () {
                 clean();
                 //绑定滑动isScroll
                 segmentation(base.relatedCallback.iScrollHooks);
                 exitCallback();
             });
         }

         function pocessContent(contentDas, cachedContentStr, containerPrefix) {

             //填充数据
             cachedContentStr && fillFragment(cachedContentStr);

             // 填充动画对象
             fillAssistContents();

             /**
              * 填充事件
              * 执行后绑定
              * 跨作用域
              */
             segmentation(fillEvent());

             /**
              * 开始初始化构建
              */
             self.initEffects();

             /**
              * 绘制页面
              */
             if (cachedContentStr) {
                 toRedraw(cachedContentStr);
             } else {
                 clean();
                 exitCallback();
             }
         }

         /**
          * 需要创建节点
          */
         if (execWaitCreateContent && execWaitCreateContent.length) {
             fillStructure(pocessContent);
         } else {
             //不需要创建节点
             pocessContent();
         }
     }

     var DOC = document;
     var prefix$4 = Xut.plat.prefixStyle;
     var KEYFRAMES = Xut.plat.KEYFRAMES;
     var ANIMATION_EV = Xut.plat.ANIMATION_EV;
     //全局样式style
     var styleElement = null;
     var playState = prefix$4('animation-play-state');
     //动画前缀
     var prefixAnims = prefix$4('animation');

     //css3模式-单图
     function css3Animate(options) {
         var $element = options.element,
             data = options.data,
             callback = options.callback || function () {},
             aniName = 'sprite_' + options.id,
             count = data.thecount,
             fps = data.fps,
             time = Math.round(1 / fps * count * 10) / 10,
             width = Math.ceil(data.scaleWidth * count),
             loop = data.loop ? 'infinite' : 1;

         //如果是矩形图
         var matrix;
         if (data.parameter) {
             var parameter = parseJSON(data.parameter);
             //矩阵
             if (parameter && parameter.matrix) {
                 matrix = parameter.matrix.split("-");
             }
         }

         /**
          * [ description]动态插入一条样式规则
          * @param  {[type]} rule [样式规则]
          * @return {[type]}      [description]
          */
         function insertCSSRule(rule) {
             var number, sheet, cssRules;
             //如果有全局的style样式文件
             if (styleElement) {
                 number = 0;
                 try {
                     sheet = styleElement.sheet;
                     cssRules = sheet.cssRules;
                     number = cssRules.length;
                     sheet.insertRule(rule, number);
                 } catch (e) {
                     console.log(e);
                 }
             } else {
                 //创建样式文件
                 styleElement = DOC.createElement("style");
                 styleElement.type = 'text/css';
                 styleElement.innerHTML = rule;
                 styleElement.uuid = 'aaron';
                 DOC.head.appendChild(styleElement);
             }
         }

         /**
          * [ description]删除一条样式规则
          * @param  {[type]} ruleName [样式名]
          * @return {[type]}          [description]
          */
         function deleteCSSRule(ruleName) {
             if (styleElement) {
                 var sheet = styleElement.sheet,
                     cssRules = sheet.rules || sheet.cssRules,
                     //取得规则列表
                 i = 0,
                     n = cssRules.length,
                     rule;
                 for (i; i < n; i++) {
                     rule = cssRules[i];
                     if (rule.name === ruleName) {
                         //删除单个规则
                         sheet.deleteRule(i);
                         break;
                     }
                 }
                 //删除style样式
                 if (cssRules.length == 0) {
                     DOC.head.removeChild(styleElement);
                     styleElement = null;
                 }
             }
         }

         //格式化样式表达式
         function setStep(aniName, time, count, loop) {
             var rule;
             if (matrix) {
                 rule = '{0} {1}s step-start {2}';
                 return String.format(rule, aniName, time, loop);
             } else {
                 rule = '{0} {1}s steps({2}, end) {3}';
                 return String.format(rule, aniName, time, count, loop);
             }
         }

         //设置精灵动画位置
         function setPostion(aniName, x) {
             //矩阵生成step的处理
             //  0 1 2
             //  3 4 5
             //  6 7 8
             if (matrix) {
                 var frames = [];
                 var base = 100 / count;
                 var col = Number(matrix[0]); //列数
                 //首次
                 frames.push(0 + '% { background-position:0% 0%}');
                 for (var i = 0; i < count; i++) {
                     var currRow = Math.ceil((i + 1) / col); //当前行数
                     var currCol = Math.floor(i / col); //当前列数 
                     var period = currCol * col; //每段数量 
                     var x = 100 * (i - period);
                     var y = 100 * currCol;

                     x = x == 0 ? x : "-" + x;
                     y = y == 0 ? y : "-" + y;
                     frames.push((i + 1) * base + '% { background-position: ' + x + '% ' + y + '%}');
                 }
                 return aniName + '{' + frames.join("") + '}';
             } else {
                 var rule = '{0} {from { background-position:0 0; } to { background-position: -{1}px 0px}}';
                 return String.format(rule, aniName, Math.round(x));
             }
         }

         //设置动画样式
         function setAnimition($element, rule) {
             prefixAnims && $element.css(prefixAnims, rule);
         }

         //添加到样式规则中
         function setKeyframes(rule) {
             if (KEYFRAMES) {
                 insertCSSRule(KEYFRAMES + rule);
             }
         }

         //动画css关键帧规则
         var rule1 = setStep(aniName, time, count, loop);
         var rule2 = setPostion(aniName, width);

         setAnimition($element, rule1);
         setKeyframes(rule2);
         $element.on(ANIMATION_EV, callback);

         return {

             runSprites: function runSprites() {
                 //运行动画
                 $element.show().css(playState, '');
             },

             stopSprites: function stopSprites() {
                 //停止精灵动画
                 deleteCSSRule(aniName);
                 $element.off(ANIMATION_EV, callback);
                 $element = null;
             },

             pauseSprites: function pauseSprites() {
                 //暂停精灵动画
                 $element.css(playState, 'paused');
             },

             playSprites: function playSprites() {
                 //恢复精灵动画
                 $element.css(playState, '');
             }

         };
     }

     //帧模式-多图
     function keyframes(options) {
         var $element = options.element,
             status = '',
             data = options.data,
             src = data.md5,
             count = data.thecount || 0,
             loop = data.loop,
             fps = data.fps || 1,
             root = Xut.config.pathAddress,
             info = parsePath(src),
             url = root + info.name,
             ext = info.ext,
             num = info.num || 0,
             timer = 0,
             image = DOC.createElement('img');

         image.src = root + src;
         $element.append(image);

         function _runSprites() {
             timer = setTimeout(function () {
                 image.src = url + num + ext;
                 num++;
                 check();
             }, 1000 / fps);
         }

         function check() {
             if (status === 'paused') {
                 return;
             }
             if (num > count) {
                 if (loop) {
                     num %= count;
                     _runSprites();
                 } else {
                     timer = null;
                     callback();
                 }
             } else {
                 _runSprites();
             }
         }

         //分解路径,得到扩展名和文件名
         function parsePath(path) {
             var tmp = path.split('.'),
                 ext = '.' + tmp[1],
                 tmp = tmp[0].split('-'),
                 name = tmp[0] + '-',
                 num = tmp[1] - 0;
             return {
                 name: name,
                 ext: ext,
                 num: num
             };
         }

         _runSprites();

         return {

             runSprites: function runSprites() {
                 status = 'play';
                 _runSprites();
             },

             stopSprites: function stopSprites() {
                 //停止精灵动画
                 clearTimeout(timer);
                 status = 'paused';
                 num = 0;
                 $element = null;
                 image = null;
             },

             pauseSprites: function pauseSprites() {
                 //暂停精灵动画
                 status = 'paused';
             },

             playSprites: function playSprites() {
                 //恢复精灵动画
                 status = 'play';
                 check();
             }

         };
     }

     //用pixi库实现的精灵动画
     function pixiAnimate(options) {
         var $element = options.element.parent(),
             data = options.data,
             callback = options.callback || function () {},
             count = data.thecount,
             fps = data.fps,
             width = Math.ceil(data.scaleWidth),
             height = Math.ceil(data.scaleHeight),
             loop = data.loop ? true : false;

         var scalex = Xut.config.proportion.width;
         var scaley = Xut.config.proportion.height;
         var path = Xut.config.pathAddress + data.md5;
         var i = 0;
         var x = 0;
         var data = [];
         var stage = new PIXI.Stage(0xFFFFFF);
         var renderer = PIXI.autoDetectRenderer(width, height, null, true);

         $element.empty().append(renderer.view);
         var sprite = new PIXI.Sprite.fromImage(path);
         sprite.scale.x = scalex;
         sprite.scale.y = scaley;

         for (var i = 0; i < count; i++) {
             data.push(i * width);
         }

         stage.addChild(sprite);

         requestAnimFrame(animate);

         function animate() {
             //控制刷新频率
             if (i % 15 == 0) {
                 sprite.position.x = -data[x];
                 renderer.render(stage);
                 x++;
                 if (x > data.length - 1) {
                     x = 0;
                     i = 0;
                 }
             }

             i++;
             requestAnimFrame(animate);
         }
     }

     function spriteAnimate(options) {
         var sprite = options.element,
             data = options.data,
             count = data.thecount,
             width = Math.ceil(data.scaleWidth),
             height = Math.ceil(data.scaleHeight),
             loop = data.loop ? true : false;

         var i = 0;
         var x = 0;
         var data = [];

         for (var i = 0; i < count; i++) {
             data.push(i * width);
         }

         requestAnimFrame(animate);

         function animate() {
             //控制刷新频率
             if (i % 15 == 0) {
                 sprite.position.x = -data[x];

                 x++;
                 if (x > data.length - 1) {
                     x = 0;
                     i = 0;
                 }
             }

             i++;
             //requestAnimFrame(animate);
         }
     }

     /**
      * css3动画
      * 1 帧动画
      * 2 定时器动画
      * 3 canvas动画
      * @param {[type]} options [description]
      */
     function Sprite(options) {
         var mode = options.mode || 'css';
         switch (mode) {
             case 'css':
                 return css3Animate(options);
             case 'timer':
                 return keyframes(options);
             case 'canvas':
                 return spriteAnimate(options);
             default:
                 return pixiAnimate(options);
         }
     }

     var arr = [];
     var slice = arr.slice;
     var concat = arr.concat;

     /**
      * pixi类
      * 子动画基类
      * @param {[type]} options [description]
      */
     var Factory = Xut.CoreObject.extend({

         /**
          * 初始化
          * @param  {[type]} data          [description]
          * @param  {[type]} canvasRelated [description]
          * @return {[type]}               [description]
          */
         init: function init(options) {
             var pixi = this;
             var args = [
             /**
              * 成功回调
              * @param  {[type]} contentId [description]
              * @return {[type]}           [description]
              */
             function successCallback(contentId) {
                 //加载完成构建 ppt实例
                 pixi.$emit('load');
             },
             /**
              * 失败回调
              * @param  {[type]} contentId [description]
              * @return {[type]}           [description]
              */
             function failCallback(contentId) {
                 //删掉对应的cid记录
                 // var index =  canvasRelated.cid.indexOf(contentId)
                 // canvasRelated.cid.splice(index,1);
                 console.log('failCallback');
             }];
             this.constructor.apply(this, args.concat(slice.call(arguments)));
         },

         /**
          * 播放
          * @param  {[type]} completeCallback [完成回调]
          * @return {[type]}                  [description]
          */
         playPixi: function playPixi(completeCallback) {
             this.checkValidity(function () {
                 this.play();
             });
         },

         //停止
         stopPixi: function stopPixi() {
             this.checkValidity(function () {
                 this.stop();
             });
         },

         //相关
         destroyPixi: function destroyPixi() {
             this.checkValidity(function () {
                 this.destroy();
             });
         },

         /**
          * 检测是否能有效运行
          * pixi对象是否有效加载
          * @return {[type]} [description]
          */
         checkValidity: function checkValidity(successCallback) {
             var failCid = this.canvasRelated.failCid;
             var contentId = this.contentId;
             //无效
             if (failCid.length && -1 !== failCid.indexOf(contentId)) {
                 return;
             }
             //有效
             successCallback && successCallback.call(this);
         },

         /**
          * 创建图片地址
          * @return {[type]}         [description]
          */
         analysisPath: function analysisPath(conData) {
             var pathImg,
                 imgContent = conData.md5,

             //是gif格式
             isGif = /.gif$/i.test(imgContent),

             //原始地址
             originalPathImg = Xut.config.pathAddress + imgContent;
             if (isGif) {
                 //处理gif图片缓存+随机数
                 pathImg = Xut.createRandomImg(originalPathImg);
             } else {
                 pathImg = originalPathImg;
             }
             return pathImg;
         }

     });

     observe.call(Factory.prototype);

     /**
      * 精灵动画
      * @param  {[type]} data          [description]
      * @param  {[type]} canvasRelated [description]
      * @return {[type]}               [description]
      */
     var Sprite$1 = Factory.extend({

         /**
          * 初始化
          * @param  {[type]} data          [description]
          * @param  {[type]} canvasRelated [description]
          * @return {[type]}               [description]
          */
         constructor: function constructor(successCallback, failCallback, data, canvasRelated) {

             var self = this;
             this.data = data;
             this.canvasRelated = canvasRelated;
             //id标示
             //可以用来过滤失败的pixi对象
             this.contentId = data._id;

             //精灵场景容器
             var spriteTtage = new PIXI.Container();
             //加入场景容器
             canvasRelated.addChild(spriteTtage);

             //矩形图
             var imgUrl = this.analysisPath(data);
             var imageFilename = imgUrl.replace(/^.*[\\\/]/, '');

             //support both png and jpg+mask
             var maskFilename = "mask_" + imageFilename;
             var imageextension = imgUrl.split('.').pop();
             var maskUrl = imgUrl.replace('.jpg', '_mask.png');

             //保证和以前版本的兼容性，旧版本精灵只有一行，因此没有matrix参数
             var matrixCols = data.thecount;
             var matrixRows = 1;
             if (data.parameter) {
                 //获取参数, 允许参数为null
                 try {
                     var paraObject = JSON.parse(data.parameter);
                 } catch (err) {
                     console.log('content parameter error');
                     return;
                 }
                 var dataMatrix = paraObject.matrix;
                 var matrixs = dataMatrix.split("-");
                 matrixCols = matrixs[0];
                 matrixRows = matrixs[1];
             }

             var jsonUrl = "lib/data/spritesheet.json" + "?imageurl=" + imgUrl + "&cols=" + matrixCols + "&rows=" + matrixRows + "&total=" + data.thecount + "&fps=" + data.fps;
             var movie;
             var contentId = this.contentId;

             //这里我们动态创建loader，加载完资源之后，就删除了。因此呢，也就没有缓存资源的情况了
             //我觉得这样似乎更好。因为我们整本书的动画很多，如果所有资源都缓存下来，可能内存消耗极大
             //现在这样每页动态创建，不加缓存，虽然性能上稍微差了一些，但是应该能够节省很多的内存
             var loader = new PIXI.loaders.Loader();
             if ('png' == imageextension) {
                 loader.add(imageFilename, jsonUrl).load(onAssetsLoaded);
             } else {
                 var maskJsonUrl = "lib/data/spritesheet.json" + "?imageurl=" + maskUrl + "&cols=" + matrixCols + "&rows=" + matrixRows + "&total=" + data.thecount + "&fps=" + data.fps;
                 loader.add(imageFilename, jsonUrl).add(maskFilename, maskJsonUrl).load(onAssetsLoaded);
             }
             loader = null;

             function onAssetsLoaded(loader, res) {

                 //资源加载失败
                 // if (arguments[1] && Object.keys(arguments[1]).length < 2) {
                 //     failCallback(contentId);
                 //     return
                 // }

                 //zhangyun, get the name of spritesheet
                 var textures = [];
                 var maskTextures = [];
                 //create textures array from res's textures object
                 var resObject, maskObject;
                 if ("object" == (typeof res === 'undefined' ? 'undefined' : babelHelpers.typeof(res))) {
                     //首次加载
                     resObject = res[Object.keys(res)[0]];
                 } else {
                     //重复加载时，传递的是字符串参数
                     //实际上这个分支没用到，如果需要处理缓存，则需要用到，现在我们没有缓存
                     resObject = PIXI.loader.resources[res];
                 }

                 //var resTextures = resObject.textures;
                 textures = Object.keys(resObject.textures).map(function (k) {
                     return resObject.textures[k];
                 });

                 //get fps
                 var fps = parseInt(resObject.url.split("fps=")[1]);

                 movie = new PIXI.extras.MovieClip(textures);
                 movie.width = data.scaleWidth;
                 movie.height = data.scaleHeight;
                 movie.position.x = data.scaleLeft;
                 movie.position.y = data.scaleTop;

                 //if there are masks, make mask textures;
                 var imageextension = resObject.name.split('.').pop();
                 if ("jpg" == imageextension) {
                     var maskObject = res[Object.keys(res)[1]];

                     maskTextures = Object.keys(maskObject.textures).map(function (k) {
                         return maskObject.textures[k];
                     });
                     movie.maskTextures = maskTextures;
                     spriteTtage.addChild(movie.maskSprite);
                 }

                 //动画速率
                 movie.animationSpeed = 0.15 * fps / 10;
                 movie.play();
                 spriteTtage.addChild(movie);

                 self.movie = movie;

                 //加载完毕
                 successCallback(contentId);
             }
         },

         /**
          * 运行动画
          * @return {[type]} [description]
          */
         play: function play() {
             //绘制页面
             this.uuid = this.canvasRelated.play('sprite');
         },

         /**
          * 停止动画
          * @return {[type]} [description]
          */
         stop: function stop() {
             this.canvasRelated.stop(this.uuid);
         },

         /**
          * 销毁动画
          * @return {[type]} [description]
          */
         destroy: function destroy() {
             //if there are movie sprite, destory it
             if (this.movie) {
                 //remove it from stage
                 if (this.stage) {
                     this.stage.removeChild(this.movie);
                 }
                 //remove texture for movie
                 for (var i = 0; i < this.movie.textures.length; i++) {
                     this.movie.textures[i].destroy(true);
                     if (this.movie.maskSprite) {
                         this.movie.maskTextures[i].destroy(true);
                     }
                 }

                 //remove movie sprite
                 this.movie.destroy(true, true);
             }
             this.canvasRelated.destroy();
         }

     });

     /**
      * 销毁动画音频
      * @param  {[type]} videoIds  [description]
      * @param  {[type]} chapterId [description]
      * @return {[type]}           [description]
      */
     function destroyContentAudio(videoIds, chapterId) {
         var isExist = false;
         //如果有音频存在
         videoIds && _.each(videoIds, function (data, index) {
             //如果存在对象音频
             if (data.videoId) {
                 isExist = true;
                 return 'breaker';
             }
         });
         if (isExist) {
             Xut.AudioManager.clearContentAudio(chapterId);
         }
     }

     /**
      * 判断是否存在
      * @return {Boolean} [description]
      */
     function bind(instance, success, fail) {
         if (instance) {
             success.call(instance, instance);
         } else {
             fail && fail();
         }
     }

     /**
      * 动画对象控制
      * @param {[type]} options [description]
      */
     var Animation = function Animation(options) {
         //mix参数
         _.extend(this, options);
     };

     var animProto = Animation.prototype;

     /**
      * 绑定动画
      * 为了向上兼容API
      * element 
      *  1 dom动画
      *  2 canvas动画
      * @param  {[type]} context   [description]
      * @param  {[type]} rootNode  [description]
      * @param  {[type]} chapterId [description]
      * @param  {[type]} parameter [description]
      * @param  {[type]} pageType  [description]
      * @return {[type]}           [description]
      */
     animProto.init = function (id, context, rootNode, chapterId, parameter, pageType) {

         var canvasRelated = this.canvasRelated;
         var pageIndex = this.pageIndex;
         var self = this;
         var actionTypes;
         var create = function create(constructor, newContext) {
             return new constructor(pageIndex, pageType, chapterId, newContext || context, parameter, rootNode);
         };

         //dom模式
         if (this.domMode) {
             //ppt动画
             this.pptObj = create(PptAnimation);
             //普通精灵动画
             this.domSprites = this.contentDas.category === 'Sprite' ? true : false;
         }

         //canvas模式
         //比较复杂
         //1 普通与ppt组合
         //2 高级与ppt组合
         //3 ppt独立
         //4 普通精灵动画
         //  其中 高级精灵动画是widget创建，需要等待
         if (this.canvasMode) {

             //动作类型
             //可能是组合动画
             actionTypes = this.contentDas.actionTypes;

             //精灵动画
             if (actionTypes.spiritId) {
                 //加入任务队列
                 this.nextTask.context.add(id);
                 this.pixiSpriteObj = new Sprite$1(this.contentDas, canvasRelated);
                 //ppt动画
                 if (actionTypes.pptId) {
                     //构建精灵动画完毕后
                     //构建ppt对象
                     this.pixiSpriteObj.$once('load', function () {
                         //content=>MovieClip
                         self.pptObj = create(CanvasAnimation, this.movie);
                         //任务完成
                         self.nextTask.context.remove(id);
                     });
                 }
             }

             if (actionTypes.widgetId) {

                 console.log(this, parameter);
             }

             //  console.log(actionTypes.widgetId)

             //高级精灵动画
             //这个比较麻烦
             //因为精灵动画是widget创建类型
             //所以代码需要延后，等待高级content先创建
             // if (actionTypes.widgetId) {
             //     this.linker = function() {
             //         return function widgetppt(context) {
             //             self.pptObj = create(CanvasAnimation, context.sprObjs[0].advSprite);
             //             self.linker.dep.notify(self.pptObj)
             //         }
             //     }();
             //     // 收集依赖
             //     this.linker.dep = new Dep()
             // }
         }
     };

     /**
      * 运行动画
      * @param  {[type]} scopeComplete   [动画回调]
      * @param  {[type]} canvasContainer [description]
      * @return {[type]}                 [description]
      */
     animProto.run = function (scopeComplete) {

         var self = this,
             defaultIndex,
             element = this.$contentProcess;

         var pptRun = function pptRun(animObj) {
             //优化处理,只针对互斥的情况下
             //处理层级关系
             if (element.prop && element.prop("mutex")) {
                 element.css({ //强制提升层级
                     'display': 'block'
                 });
             }
             //指定动画
             animObj.runAnimation(scopeComplete);
         };
         //ppt动画
         bind(this.pptObj, pptRun);

         //canvas精灵动画
         bind(this.pixiSpriteObj, function (animObj) {
             animObj.playPixi(scopeComplete);
         });

         //dom精灵动画
         if (this.domSprites && element) {
             //存在动画
             if (this.spriteObj) {
                 this.spriteObj.playSprites();
                 return;
             }
             element = this.$contentProcess.find('.sprite').show();
             this.spriteObj = Sprite({
                 element: element,
                 data: this.contentDas,
                 id: this.id,
                 mode: 'css'
             });
         }
     };

     /**
      * 停止动画
      * @param  {[type]} chapterId [description]
      * @return {[type]}           [description]
      */
     animProto.stop = function (chapterId) {

         //ppt动画
         bind(this.pptObj, function (animObj) {
             //销毁ppt音频
             destroyContentAudio(animObj.options, chapterId);
             //停止PPT动画
             animObj.stopAnimation();
         });

         //canvas精灵
         bind(this.pixiSpriteObj, function (animObj) {
             animObj.stopPixi();
         });
         //dom精灵
         bind(this.spriteObj, function (sprObj) {
             sprObj.pauseSprites();
         });
     };

     /**
      * 翻页结束，复位上一页动画
      * @return {[type]} [description]
      */
     animProto.reset = function () {
         bind(this.pptObj, function (animObj) {
             animObj.resetAnimation();
         });
     };

     /**
      * 销毁动画
      * @return {[type]} [description]
      */
     animProto.destroy = function () {

         //canvas
         bind(this.pixiSpriteObj, function (animObj) {
             animObj.destroyPixi();
         });

         //dom ppt
         bind(this.pptObj, function (animObj) {
             animObj.destroyAnimation();
         });

         //dom 精灵
         bind(this.spriteObj, function (sprObj) {
             sprObj.stopSprites();
         });

         this.pptObj = null;
         this.spriteObj = null;
         this.getParameter = null;
         this.pixiSpriteObj = null;
     };

     /***************************************************************
      *
      *          视觉差对象初始化操作
      *
      ****************************************************************/

     var screenSize$2 = void 0;

     //变化节点的css3transform属性
     function transformNodes(rootNode, property, pageOffset) {
         var style = {},
             effect = '',
             parallaxOffset,
             //最终的偏移量X
         x = 0,
             y = 0,
             z = 0,
             round = Math.round,
             prefix = Xut.plat.prefixStyle,


         //浮动对象初始化偏移量
         parallaxOffset = pageOffset;

         if (property.translateX != undefined || property.translateY != undefined || property.translateZ != undefined) {
             x = round(property.translateX) || 0;
             y = round(property.translateY) || 0;
             z = round(property.translateZ) || 0;
             parallaxOffset += x;
             effect += String.format('translate3d({0}px,{1}px,{2}px) ', parallaxOffset, y, z);
         }

         if (property.rotateX != undefined || property.rotateY != undefined || property.rotateZ != undefined) {
             x = round(property.rotateX);
             y = round(property.rotateY);
             z = round(property.rotateZ);
             effect += x ? 'rotateX(' + x + 'deg) ' : '';
             effect += y ? 'rotateY(' + y + 'deg) ' : '';
             effect += z ? 'rotateZ(' + z + 'deg) ' : '';
         }

         if (property.scaleX != undefined || property.scaleY != undefined || property.scaleZ != undefined) {
             x = round(property.scaleX * 100) / 100 || 1;
             y = round(property.scaleY * 100) / 100 || 1;
             z = round(property.scaleZ * 100) / 100 || 1;
             effect += String.format('scale3d({0},{1},{2}) ', x, y, z);
         }

         if (property.opacity != undefined) {
             style.opacity = round((property.opacityStart + property.opacity) * 100) / 100;
             effect += ';';
         }

         if (effect) {
             style[prefix('transform')] = effect;
             rootNode.css(style);
         }

         return parallaxOffset;
     }

     //转换成比例值
     function conversionRatio(parameters) {
         if (parameters.opacityStart > -1) {
             parameters.opacity = (parameters.opacityEnd || 1) - parameters.opacityStart;
             delete parameters.opacityEnd;
         }
         return parameters;
     }

     //转化成实际值
     function conversionValue(parameters, nodeProportion, screenSize) {
         var results = {},
             width = -screenSize.width,
             height = -screenSize.height;

         for (var i in parameters) {
             switch (i) {
                 case 'translateX':
                 case 'translateZ':
                     results[i] = parameters[i] * nodeProportion * width;
                     break;
                 case 'translateY':
                     results[i] = parameters[i] * nodeProportion * height;
                     break;
                 case 'opacityStart':
                     results[i] = parameters[i];
                     break;
                 default:
                     results[i] = parameters[i] * nodeProportion;
             }
         }

         return results;
     }

     function Parallax(data) {

         screenSize$2 = Xut.config.screenSize;

         try {
             //转化所有css特效的参数的比例
             var parameters = JSON.parse(data.getParameter()[0]['parameter']);
         } catch (err) {
             return false;
         }
         var pid = data.pid,
             translate = conversionRatio(parameters),

         //页面偏移量
         pageOffset = this.relatedData.pageOffset && this.relatedData.pageOffset.split("-"),

         //开始的nodes值
         currPageOffset = pageOffset[0],

         //范围区域
         pageRange = pageOffset[1],

         //页面偏移比例
         nodeOffsetProportion = (currPageOffset - 1) / (pageRange - 1),

         //计算出偏移值
         offsetTranslate = conversionValue(translate, nodeOffsetProportion, screenSize$2),

         //页面分割比
         nodeProportion = 1 / (pageRange - 1);

         //改变节点的transform属性
         //返回改变后translateX值
         var parallaxOffset = transformNodes(data.$contentProcess, _.extend({}, offsetTranslate), data.transformOffset);

         /**
          * 为了兼容动画，把视觉差当作一种行为处理
          * 合并data数据
          * @type {Object}
          */
         data.parallax = {
             //计算页码结束边界值,用于跳转过滤
             calculateRangePage: function calculateRangePage() {
                 return {
                     'start': pid - currPageOffset + 1,
                     'end': pageRange - currPageOffset + pid
                 };
             },
             'translate': translate,
             'offsetTranslate': offsetTranslate,
             'nodeProportion': nodeProportion,
             'rootNode': data.$contentProcess,
             'parallaxOffset': parallaxOffset //经过视觉差修正后的偏移量
         };

         return data;
     }

     /**
      * 预运行动作
      * 自动 && 出现 && 无时间 && 无音乐
      *  && 不是精灵动画 && 没有脚本代码 && 并且不能是收费
      * @return {[type]}         [description]
      */
     function preRunAction(data, eventName) {
         var para,
             scopem,
             parameter = data.getParameter();
         //过滤预生成动画
         if (parameter.length === 1) {
             para = parameter[0];
             if (para.animationName === 'EffectAppear' && eventName === 'auto' && !para.videoId && !para.delay && data.contentDas.category !== 'Sprite' && !para.preCode //动画前脚本
              && !para.postCode //动画后脚本
              && !/"inapp"/i.test(para.parameter)) {
                 //并且不能是收费处理

                 /***********************************************
                  *      针对预处理动作,并且没有卷滚的不注册
                  *      满足是静态动画
                  * **********************************************/
                 //true是显示,false隐藏
                 return data.isRreRun = /"exit":"False"/i.test(para.parameter) === true ? 'visible' : 'hidden';
             }
         }
     }

     /**
      * 构建动画
      * @return {[type]} [description]
      */
     function createScope(base, contentId, pid, actName, contentDas, parameter, hasParallax) {
         //默认启动dom模式
         var data = {
             type: 'dom',
             canvasMode: false,
             domMode: true
         },
             $contentProcess,
             pageType = base.pageType;

         //如果启动了canvas模式
         //改成作用域的一些数据
         if (base.canvasRelated.enable) {
             //如果找到对应的canvas对象
             if (-1 !== base.canvasRelated.cid.indexOf(contentId)) {
                 $contentProcess = {}; //等待填充
                 data.type = 'canvas';
                 data.canvasMode = true;
                 data.domMode = false;
             }
         }

         //如果是dom模式
         if (!$contentProcess) {
             /**
              * 确保节点存在
              * @type {[type]}
              */
             if (!($contentProcess = base.findContentElement(actName))) {
                 return;
             };
         }

         /**
          * 制作公共数据
          * @type {Object}
          */
         _.extend(data, {
             base: base,
             id: contentId,
             pid: pid,
             actName: actName,
             contentDas: contentDas,
             $contentProcess: $contentProcess,
             pageType: pageType,
             pageIndex: base.pageIndex,
             canvasRelated: base.canvasRelated,
             nextTask: base.nextTask
         });

         /**
          * 如果是母版层理,视觉差处理
          * processType 三种情况
          *          parallax
          *          animation
          *          both(parallax,animation)
          * @type {[type]}
          */
         if (hasParallax && pageType === 'master') {
             data.processType = 'parallax';
         } else {
             data.processType = 'animation';
         }

         //生成查询方法
         data.getParameter = function () {
             //分区母版与页面的数据结构
             //parameter-master-parallax
             //parameter-master-animation
             //parameter-page-animation
             var fix = 'parameter-' + pageType + '-' + data.processType;
             data[fix] = parameter;
             return function () {
                 return data[fix];
             };
         }();

         /**
          * 生成视觉差作用域
          * @type {[type]}
          */
         if (data.processType === 'parallax') {
             //初始化视觉差对象的坐标偏移量
             data.transformOffset = base.relatedData.transformOffset(data.id);
             return Parallax.call(base, data);
         }

         /**
          *  优化机制,预生成处理
          *  过滤自动热点并且是出现动作，没有时间，用于提升体验
          */
         preRunAction(data, base.eventData.eventName);

         /**
          * 生成子作用域对象，用于抽象处理动画,行为
          */
         return new Animation(data);
     }

     /**
      * 分解每个子作用域
      * 1 生成临时占位作用域,用于分段动画
      * 2 生成所有动画子作用域
      * @param  {[type]} parameter [description]
      * @return {[type]}           [description]
      */
     function createHandlers(base, parameter, waitCreate) {
         /**
          * 如果是动态分段创建
          * 混入新的作用域
          */
         if (waitCreate) {
             return createScope.apply(base, parameter);
         }

         //dom对象
         var para = parameter[0],
             contentId = para['contentId'],
             //可能有多个动画数据 [Object,Object,Object]
         pid = base.pid,
             actName = base.makePrefix('Content', pid, contentId),
             contentDas = base.relatedData.contentDas[contentId];

         /**
          * 客户端未实现
          * 针对分段创建优化
          * 初始化必要加载数据
          * 临时占位数据
          */
         // if(contentDas && 1==contentDas.visible){
         //  //记录分段标记,用户合并创建节点
         //  base.waitCreateContent.push(contentId)
         //  return [contentId, pid, actName, contentDas, parameter];
         // }

         /**
          * 构建子作用域
          */
         return createScope(base, contentId, pid, actName, contentDas, parameter, para.masterId);
     }

     /**
      * 构建作用域
      * @return {[type]} [description]
      */
     function fnCreate(base) {
         return function (data, callback) {
             var para, handlers;
             if (data && data.length) {
                 //生成动画作用域对象
                 while (para = data.shift()) {
                     if (handlers = createHandlers(base, para)) {
                         callback(handlers);
                     }
                 }
             }
         };
     }

     /**
      * 源对象复制到目标对象
      */
     function innerExtend(target, source) {
         for (property in source) {
             if (target[property] === undefined) {
                 target[property] = source[property];
             }
         }
     }

     //处理itemArray绑定的动画对象
     //注入动画
     //绑定用户事件
     function Child(base) {
         var animation = base.seed.animation,
             parallax = base.seed.parallax,

         //抽出content对象
         abstractContents = [],

         //创建引用
         batcheCreate = fnCreate(base);

         switch (base.pageType) {
             case 'page':
                 batcheCreate(animation, function (handlers) {
                     abstractContents.push(handlers);
                 });
                 break;
             case 'master':
                 //母版层的处理
                 var tempParallaxScope = {},
                     tempAnimationScope = {},
                     tempAssistContents = [];
                 //视觉差处理
                 batcheCreate(parallax, function (handlers) {
                     tempParallaxScope[handlers.id] = handlers;
                 });

                 batcheCreate(animation, function (handlers) {
                     tempAnimationScope[handlers.id] = handlers;
                 });

                 var hasParallax = _.keys(tempParallaxScope).length,
                     hasAnimation = _.keys(tempAnimationScope).length;

                 //动画为主
                 //合并，同一个对象可能具有动画+视觉差行为
                 if (hasParallax && hasAnimation) {
                     _.each(tempAnimationScope, function (target) {
                         var id = target.id,
                             source;
                         if (source = tempParallaxScope[id]) {
                             //如果能找到就需要合并
                             innerExtend(target, source); //复制方法
                             target.processType = 'both'; //标记新组合
                             delete tempParallaxScope[id]; //删除引用
                         }
                     });
                     //剩余的处理
                     if (_.keys(tempParallaxScope).length) {
                         _.extend(tempAnimationScope, tempParallaxScope);
                     }
                     tempParallaxScope = null;
                 }
                 //转化成数组
                 _.each(hasAnimation ? tempAnimationScope : tempParallaxScope, function (target) {
                     tempAssistContents.push(target);
                 });
                 abstractContents = tempAssistContents;
                 break;
         }

         batcheCreate = null;

         return abstractContents;
     }

     /**
      * 搜索栏
      * 方便用户更加便捷的找到所需要的信息
      *
      */

     //图标
     var icons$1 = {
         search: 'images/icons/search.svg',
         clear: 'images/icons/clear.svg',
         exit: 'images/icons/exit.svg'
     };

     function SearchBar(options) {
         //父容器
         this.parent = options.parent;
         //提示信息
         this.tips = options.tips;
         this.init();
     }

     /**
      * 初始化
      * @return {[type]} [description]
      */
     SearchBar.prototype.init = function () {
         var $box = this.searchForm(),
             dom = this.parent[0];

         this.parent.append($box);
         this.searchBox = $box;
         this.resultBox = $box.find('.xut-search-result');
         this.input = $box.find('.xut-search-input');
         this.searchBtn = $box.find('.xut-search-btn');

         //用户操作事件邦定
         Xut.plat.execEvent('on', {
             context: dom,
             callback: {
                 end: this
             }
         });

         //即时搜索
         dom.addEventListener('keyup', this, false);
     };

     /**
      * 创建搜索框
      * @return {[object]} [jquery生成的dom对象]
      */
     SearchBar.prototype.searchForm = function () {
         var W = window.innerWidth * 0.3,
             H = window.innerHeight;
         var text = this.tips || '请在搜索框中输入要搜索的关键字';

         var box = '<div class="xut-form-search">' + '<div class="xut-form-search-wrap">' + '<div style="height:17%;">' + '<div style="height:20%"></div>' + '<div class="xut-search-row">' + '<input type="text" class="xut-search-input">' + '<div class="xut-search-btn" style="background-image: url(' + icons$1.search + ')"></div>' + '</div>' + '<p class="xut-search-tips" style="line-height:' + Math.round(H * 0.06) + 'px">' + text + '</p>' + '</div>' + '<div style="height:76%">' + '<ul class="xut-search-result"></ul>' + '</div>' + '<div style="height:7%">' + '<div class="xut-search-exit" style="background-image: url(' + icons$1.exit + ')"></div>' + '</div>' + '</div></div>';

         var $box = $(box);

         $box.css('width', W < 200 ? 200 : W);

         return $box;
     };

     /**
      * 搜索
      * @param {string} [keyword] [搜索关键字]
      */
     SearchBar.prototype.search = function (keyword) {
         var data = Xut.data.Chapter,
             ln = data.length,
             list = '',
             rs,
             pageId,
             seasonId;

         if (!keyword) {
             this.resultBox.html('');
             return;
         }

         for (var i = 0; i < ln; i++) {
             rs = data.item(i);
             if (rs.chapterTitle.indexOf(keyword) > -1) {
                 pageId = rs._id;
                 seasonId = rs.seasonId;
                 list += '<li><a class="xut-search-link" data-mark="' + seasonId + '-' + pageId + '" href="javascript:0">' + rs.chapterTitle + '</a></li>';
             }
         }

         this.resultBox.html(list);
     };

     /**
      * 切换搜索按钮图标
      * @param  {[type]} icon [图标路径]
      * @return {[type]}      [description]
      */
     SearchBar.prototype.iconManager = function (icon) {
         if (this.isChange) {
             this.searchBtn.css('background-image', 'url(' + icon + ')');
         };
     };

     /**
      * 跳转到搜索结果页
      * @param  {[type]} target [description]
      * @return {[type]}        [description]
      */
     SearchBar.prototype.searchLink = function (target) {
         if (!target || !target.dataset) return;
         var mark = target.dataset.mark.split('-'),
             seasonId = mark[0],
             pageId = mark[1];

         Xut.View.LoadScenario({
             'scenarioId': seasonId,
             'chapterId': pageId
         });
     };

     /**
      * 邦定事件
      * @param  {[type]} evt [事件]
      * @return {[type]}     [description]
      */
     SearchBar.prototype.handleEvent = function (evt) {
         var target = evt.target;
         switch (target.className) {
             case 'xut-search-btn':
                 //点击搜索
                 this.search(this.input.val());
                 this.isChange = true;
                 this.iconManager(icons$1.clear);
                 break;
             case 'xut-search-input':
                 //实时搜索
                 this.search(target.value);
                 //还原按钮图标
                 this.iconManager(icons$1.search);
                 this.isChange = false;
                 break;
             case 'xut-search-exit':
                 //关闭搜索框
                 this.exit();
                 break;
             case 'xut-search-link':
                 //跳转
                 this.searchLink(target);
                 break;
             default:
                 break;
         }
     };

     /**
      * 关闭搜索框
      * @return {[type]} [description]
      */
     SearchBar.prototype.exit = function () {
         this.input.val('');
         this.resultBox.empty();
         this.searchBox.hide();
     };

     /**
      * 恢复搜索框
      */
     SearchBar.prototype.restore = function () {
         var searchBox = this.searchBox;
         searchBox && searchBox.show();
     };

     /**
      * 销毁搜索框
      * @return {[type]} [description]
      */
     SearchBar.prototype.destroy = function () {
         var dom = this.parent[0];
         dom.removeEventListener('keyup', this, false);
         dom.removeEventListener('touchend', this, false);
         dom.removeEventListener('mouseup', this, false);

         this.searchBox.remove();
         this.searchBox = null;
         this.resultBox = null;
         this.searchBtn = null;
         this.input = null;
         this.parent = null;
     };

     var icons$2 = {
         hide: 'images/icons/arrowDown.svg'
     };
     var sLineHeiht$1 = parseInt($('body').css('font-size')) || 16;
     var BOOKCACHE$1;
     //书签缓存

     function BookMark$1(options) {
         this.parent = options.parent;
         this.pageId = options.pageId;
         this.seasonId = options.seasonId;
         //是否已存储
         this.isStored = false;
         this.init();
     }

     /**
      * 初始化
      * @return {[type]} [description]
      */
     BookMark$1.prototype.init = function () {
         var $bookMark = this.createBookMark(),
             dom = this.parent[0],
             that = this;

         this.parent.append($bookMark);
         this.bookMarkMenu = $bookMark.eq(0);
         //显示书签
         setTimeout(function () {
             that.restore();
         }, 20);
         //获取历史记录
         BOOKCACHE$1 = this.getHistory();

         //邦定用户事件
         Xut.plat.execEvent('on', {
             context: dom,
             callback: {
                 end: this
             }
         });
     };

     /**
      * 创建书签
      * @return {[object]} [jquery生成的dom对象]
      */
     BookMark$1.prototype.createBookMark = function () {

         var screenSize = Xut.config.screenSize;
         var sHeight = screenSize.height;

         var height = sLineHeiht$1 * 3,
             // menu的高为3em
         box = '<div class="xut-bookmark-menu" style="width:100%;height:{0}px;left:0;top:{1}px;">' + '<div class="xut-bookmark-wrap">' + '<div class="xut-bookmark-add">加入书签</div>' + '<div class="xut-bookmark-off" style="background-image:url({2})"></div>' + '<div class="xut-bookmark-view">书签记录</div>' + '</div>' + '</div>' + '<div class="xut-bookmark-list" style="display:none;width:100%;height:{3}px;">' + '<ul class="xut-bookmark-head">' + '<li class="xut-bookmark-back">返回</li>' + '<li>书签</li>' + '</ul>' + '<ul class="xut-bookmark-body"></ul>' + '</div>';
         box = String.format(box, height, sHeight, icons$2.hide, sHeight);
         this.markHeight = height;
         return $(box);
     };

     /**
      * 生成书签列表
      * @return {[type]} [description]
      */
     BookMark$1.prototype.createMarkList = function () {
         var tmp,
             seasonId,
             pageId,
             list = '',
             box = '',
             self = this;

         //取历史记录
         _.each(BOOKCACHE$1, function (mark) {
             tmp = mark.split('-');
             seasonId = tmp[0];
             pageId = tmp[1];
             mark = self.getMarkId(seasonId, pageId);
             list += '<li><a data-mark="' + mark + '" class="xut-bookmark-id" href="javascript:0">第' + pageId + '页</a><a class="xut-bookmark-del" data-mark="' + mark + '" href="javascript:0">X</a></li>';
         });

         return list;
     };

     /**
      * 创建存储标签
      * 存储格式 seasonId-pageId
      * @return {string} [description]
      */
     BookMark$1.prototype.getMarkId = function (seasonId, pageId) {
         return seasonId + '-' + pageId;
     };

     /**
      * 获取历史记录
      * @return {[type]} [description]
      */
     BookMark$1.prototype.getHistory = function () {
         var mark = _get('bookMark');
         if (mark) {
             return mark.split(',');
         }
         return [];
     };

     /**
      * 添加书签
      * @return {[type]} [description]
      */
     BookMark$1.prototype.addBookMark = function () {
         var key;

         this.updatePageInfo();
         key = this.getMarkId(this.seasonId, this.pageId);

         //避免重复缓存
         if (BOOKCACHE$1.indexOf(key) > -1) {
             return;
         }
         BOOKCACHE$1.push(key);
         _set('bookMark', BOOKCACHE$1);
     };

     /**
      * 更新页信息
      *  针对母板层上的书签
      */
     BookMark$1.prototype.updatePageInfo = function () {
         var pageData = Xut.Presentation.GetPageData();
         this.pageId = pageData._id;
         this.seasonId = pageData.seasonId;
     };

     /**
      * 删除书签
      * @param {object} [key] [事件目标对象]
      * @return {[type]} [description]
      */
     BookMark$1.prototype.delBookMark = function (target) {
         if (!target || !target.dataset) return;

         var key = target.dataset.mark,
             index = BOOKCACHE$1.indexOf(key);

         BOOKCACHE$1.splice(index, 1);
         _set('bookMark', BOOKCACHE$1);

         if (BOOKCACHE$1.length == 0) {
             _remove$1('bookMark');
         }

         //移除该行
         $(target).parent().remove();
     };

     /**
      * 显示书签
      * @param {object} [target] [事件目标对象]
      * @return {[type]} [description]
      */
     BookMark$1.prototype.viewBookMark = function (target) {
         var $bookMarkList,
             list = this.createMarkList();

         if (this.bookMarkList) {
             $bookMarkList = this.bookMarkList;
         } else {
             $bookMarkList = $(target).parent().parent().next();
         }
         //更新书签内容
         $bookMarkList.find('.xut-bookmark-body').html(list);
         this.bookMarkList = $bookMarkList;
         $bookMarkList.fadeIn();
     };

     /**
      * 点击放大效果
      * @param  {[object]} target [事件目标对象]
      * @return {[type]}      [description]
      */
     BookMark$1.prototype.iconManager = function (target) {
         var $icon = this.bookMarkIcon = $(target),
             restore = this.iconRestore;

         $icon.css({
             'transform': 'scale(1.2)',
             'transition-duration': '500ms'
         })[0].addEventListener(Xut.plat.TRANSITION_EV, restore.bind(this), false);
     };

     /**
      * 复原按钮
      * @return {[type]} [description]
      */
     BookMark$1.prototype.iconRestore = function () {
         this.bookMarkIcon.css('transform', '');
     };

     /**
      * 跳转到书签页
      * @param  {[type]} target [description]
      * @return {[type]}        [description]
      */
     BookMark$1.prototype.goBookMark = function (target) {
         if (!target || !target.dataset) return;

         var key = target.dataset.mark.split('-'),
             seasonId = Number(key[0]),
             pageId = Number(key[1]);

         this.updatePageInfo();
         //关闭书签列表
         this.backBookMark();

         //忽略当前页的跳转
         if (this.pageId == pageId && this.seasonId == seasonId) {
             return;
         }

         Xut.View.LoadScenario({
             'scenarioId': seasonId,
             'chapterId': pageId
         });
     };

     /**
      * 书签回退键
      * @return {[type]} [description]
      */
     BookMark$1.prototype.backBookMark = function () {
         this.bookMarkList.fadeOut();
     };

     /**
      * 邦定事件
      * @param  {[type]} evt [事件]
      * @return {[type]}     [description]
      */
     BookMark$1.prototype.handleEvent = function (evt) {
         var target = evt.target;
         switch (target.className) {
             //加入书签
             case 'xut-bookmark-add':
                 this.addBookMark();
                 this.iconManager(target);
                 break;
             //显示书签记录
             case 'xut-bookmark-view':
                 this.viewBookMark(target);
                 this.iconManager(target);
                 break;
             //关闭书签
             case 'xut-bookmark-off':
                 this.closeBookMark(target);
                 break;
             //返回书签主菜单
             case 'xut-bookmark-back':
                 this.backBookMark();
                 break;
             //删除书签记录
             case 'xut-bookmark-del':
                 this.delBookMark(target);
                 break;
             //跳转到书签页
             case 'xut-bookmark-id':
                 this.goBookMark(target);
                 break;
             default:
                 //console.log(target.className)
                 break;
         }
     };

     /**
      * 关闭书签菜单
      * @return {[type]} [description]
      */
     BookMark$1.prototype.closeBookMark = function (target) {
         this.bookMarkMenu.css({
             transform: 'translate3d(0,0,0)',
             'transition-duration': '1s'
         });
     };

     /**
      * 恢复书签菜单
      */
     BookMark$1.prototype.restore = function () {
         this.bookMarkMenu.css({
             transform: 'translate3d(0,-' + this.markHeight + 'px,0)',
             'transition-duration': '1s'
         });
     };

     /**
      * 销毁书签
      * @return {[type]} [description]
      */
     BookMark$1.prototype.destroy = function () {
         var dom = this.parent[0],
             events = Xut.plat;

         dom.removeEventListener('touchend', this, false);
         dom.removeEventListener('mouseup', this, false);

         //菜单部分
         if (this.bookMarkMenu) {
             this.bookMarkMenu.remove();
             this.bookMarkMenu = null;
         }

         //列表部分
         if (this.bookMarkList) {
             this.bookMarkList.remove();
             this.bookMarkList = null;
         }

         //按钮效果
         if (this.bookMarkIcon) {
             this.bookMarkIcon[0].removeEventListener(events.TRANSITION_EV, this.iconRestore, false);
             this.bookMarkIcon = null;
         }

         this.parent = null;
     };

     var defaultFontSize = void 0;
     var baseValue1 = void 0;
     var baseValue2 = void 0;
     var baseValue3 = void 0;

     function setOption$1() {
         var proportion = Xut.config.proportion.width;
         var docEl = document.documentElement;
         try {
             defaultFontSize = parseInt(getComputedStyle(docEl).fontSize);
         } catch (er) {
             defaultFontSize = 16;
         }

         //实际字体大小
         defaultFontSize = defaultFontSize * proportion;

         //设置默认rem
         docEl.style.fontSize = defaultFontSize + "px";

         baseValue1 = Math.floor(defaultFontSize * 1.5);
         baseValue2 = Math.floor(defaultFontSize * 2.0);
         baseValue3 = Math.floor(defaultFontSize * 2.5);
     }

     /**
      * 工具栏布局
      * @return {[type]} [description]
      */
     function textLayer() {
         var str = '  <div class="htmlbox_close_container">' + '        <a class="htmlbox_close"></a>' + ' </div>' + ' <ul class="htmlbox_fontsizeUl">' + '    <li>' + '        <a class="htmlbox_small" style="width:{0}px;height:{1}px;margin-top:-{2}px"></a>' + '     </li>' + '     <li>' + '        <a class="htmlbox_middle" style="width:{3}px;height:{4}px;margin-top:-{5}px"></a>' + '     </li>' + '    <li>' + '        <a class="htmlbox_big" style="width:{6}px;height:{7}px;margin-top:-{8}px"></a>' + '    </li>' + ' </ul>';

         return String.format(str, baseValue1, baseValue1, baseValue1 / 2, baseValue2, baseValue2, baseValue2 / 2, baseValue3, baseValue3, baseValue3 / 2);
     }

     /**
      * 创建盒子容器
      * @return {[type]} [description]
      */
     function createWapper$1(boxName, textLayer, iscrollName, textContent) {
         var wapper = ' <div id="{0}" class="htmlbox_container">' + '    <div class="htmlbox-toolbar">{1}</div>' + '    <div id="{2}" style="overflow:hidden;position:absolute;width:100%;height:92%;">' + '        <ul>' + '          {3}' + '        </ul>' + '     </div>' + ' </div>';

         return String.format(wapper, boxName, textLayer, iscrollName, textContent);
     }

     function HtmlBox(contentId, element) {

         setOption$1();

         this.contentId = contentId;
         this.element = element;
         var self = this;

         //事件对象引用
         var eventHandler = function eventHandler(eventReference, _eventHandler) {
             self.eventReference = eventReference;
             self.eventHandler = _eventHandler;
         };

         //绑定点击事件
         bindEvents({
             'eventRun': function eventRun() {
                 Xut.View.HideToolbar();
                 self.init(contentId, element);
             },
             'eventHandler': eventHandler,
             'eventContext': element,
             'eventName': "tap",
             'domMode': true
         });
     }

     HtmlBox.prototype = {

         /**
          * 调整字体大小
          * @return {[type]} [description]
          */
         adjustSize: function adjustSize(value, save) {
             value = parseInt(value);
             docEl.style.fontSize = value + "px";
             save && _set(this.storageName, value);
         },

         /**
          * 卷滚
          * @param  {[type]} iscrollName [description]
          * @return {[type]}             [description]
          */
         createIscroll: function createIscroll(iscrollName) {
             this.iscroll = new iScroll("#" + iscrollName, {
                 scrollbars: true,
                 fadeScrollbars: true
             });
         },

         init: function init(contentId, element) {

             var self = this;

             //移除偏移量 存在偏移量造成文字被覆盖
             var textContent = element.find(">").html();
             textContent = textContent.replace(/translate\(0px, -\d+px\)/g, 'translate(0px,0px)');

             var boxName = "htmlbox_" + contentId;
             var iscrollName = "htmlbox_iscroll_" + contentId;

             //缓存名
             this.storageName = boxName + Xut.config.appId;

             //获取保存的字体值
             var storageValue = _get(this.storageName);
             if (storageValue) {
                 this.adjustSize(storageValue);
             }

             //创建容器
             this.$str = $(createWapper$1(boxName, textLayer(), iscrollName, textContent));
             element.after(this.$str);

             //卷滚
             this.createIscroll(iscrollName);

             //绑定事件上下文呢
             this.eventContext = this.$str.find('.htmlbox-toolbar')[0];
             //字体大小
             var sizeArray = ["1", "1.25", "1.5"];
             //改变字体与刷新卷滚
             var change = function change(fontsize) {
                 self.adjustSize(fontsize * defaultFontSize, true);
                 self.iscroll.refresh();
             };
             //处理器
             var process = {
                 htmlbox_close_container: function htmlbox_close_container() {
                     self.adjustSize(defaultFontSize);
                     self.removeBox();
                 },
                 htmlbox_close: function htmlbox_close() {
                     self.adjustSize(defaultFontSize);
                     self.removeBox();
                 },
                 htmlbox_small: function htmlbox_small() {
                     change(sizeArray[0]);
                 },
                 htmlbox_middle: function htmlbox_middle() {
                     change(sizeArray[1]);
                 },
                 htmlbox_big: function htmlbox_big() {
                     change(sizeArray[2]);
                 }
             };
             //冒泡匹配按钮点击
             this.start = function (e) {
                 var className = e.target.className;
                 process[className] && process[className]();
             };
             Xut.plat.execEvent('on', {
                 context: this.eventContext,
                 callback: {
                     start: this.start
                 }
             });
         },

         //移除盒子
         removeBox: function removeBox() {
             Xut.plat.execEvent('off', {
                 context: this.eventContext,
                 callback: {
                     start: this.start
                 }
             });
             this.$str && this.$str.remove();
             this.iscroll && this.iscroll.destroy();
             this.iscroll = null;
         },

         //销毁外部点击事件与
         destroy: function destroy() {
             _.each(this.eventReference, function (off) {
                 off("tap");
             });
             this.removeBox();
         }
     };

     /**
      * pixi事件绑定
      * @param  {[type]} Utils   [description]
      * @param  {[type]} Config) {}          [description]
      * @return {[type]}         [description]
      */

     /**
      * 动作适配
      * @type {Object}
      */
     var adapter = {
       /**
        * 单击
        * @return {[type]} [description]
        */
       "tap": function tap(eventData) {
         var eventContext = eventData.eventContext;
         eventContext.on('mousedown', eventData.eventRun);
         eventContext.on('touchstart', eventData.eventRun);
       }
     };

     /**
      * 绑定事件
      * @param  {[type]} eventData [description]
      * @return {[type]}           [description]
      */
     function bindEvents$1(eventData) {
       //开启交互
       eventData.eventContext.interactive = true;
       adapter[eventData.eventName](eventData);
     }

     /**
      * 2016.4.11
      * 因为canvas模式导致
      * 任务必须等待context上下创建
      * 完成后执行
      * 1 事件
      * 2 预执行
      * @type {Array}
      */
     function createNextTask(callback) {
         return {
             //子对象上下文
             context: {
                 wait: false, //是否等待创建
                 statas: false, //是否完成创建
                 _ids: [],
                 /**
                  * 检测是否完成
                  * @return {[type]} [description]
                  */
                 check: function check() {
                     var total = this.length();
                     if (!total.length) {
                         //完成创建
                         this.statas = true;
                     }
                     //如果已经等待
                     if (this.wait) {
                         callback && callback();
                         return;
                     }
                     //创建比流程先执行完毕
                     //一般几乎不存在
                     //但是不排除
                     if (!this.wait && this.statas) {
                         this.wait = true;
                         return;
                     }
                 },
                 add: function add(id) {
                     if (-1 === this._ids.indexOf(id)) {
                         this._ids.push(id);
                     }
                 },
                 remove: function remove(id) {
                     if (!id) return;
                     var index = this._ids.indexOf(id);
                     var val = this._ids.splice(index, 1);
                     this.check(val);
                     return val;
                 },
                 length: function length() {
                     return this._ids.length;
                 }
             },
             event: [], //事件
             pre: {} //预执行
         };
     }

     function activityClass(data) {

         var self = this;

         _.extend(this, data);

         /**
          * 2016.4.11
          * 因为canvas模式导致
          * 任务必须等待context上下创建
          * 完成后执行
          * 1 事件
          * 2 预执行
          * @type {Array}
          */
         this.nextTask = createNextTask(this.monitorComplete);

         /**
          * 初始化自定义事件
          */
         this.createEventRelated();

         /**
          * 为分段处理,记录需要加载的分段数据
          * @type {Array}
          */
         this.waitCreateContent = [];

         /**
          * 保存子对象（PPT辅助对象）
          * 1 动画作用域
          * 2 视觉差作用域
          * @type {Array}
          */
         this.abstractContents = Child(this);

         /**
          * 处理html文本框
          * 2016.1.6
          */
         this.htmlTextBox();

         /**
          * 注册用户自定义事件
          * dom
          * canvas
          */
         this.registerEvent();

         /**
          * 构建用户行为
          */
         this.createActions();

         /**
          * 2016.2.26
          * 修复妙妙学
          * 妙妙客户端处理
          * 点击效果的音频处理
          * @type {Array}
          */
         this._fixAudio = [];

         /**
          * 是否正在等待创建的子对象
          * 如果创建比流程先执行完毕
          * @return {[type]}   
          */
         if (this.nextTask.context.wait) {
             this.monitorComplete();
             return this;
         }

         /**
          * 等待创建执行
          * @param  {[type]} this.nextTask.context.length() 
          * @return {[type]}                                
          */
         if (this.nextTask.context.length()) {
             this.nextTask.context.wait = true;
             return this;
         }

         this.monitorComplete();
     }

     var activitPro = activityClass.prototype;

     /*********************************************************************
      *                 代码初始化
      *                初始基本参数
      *                构建动画关系作用域
      *                绑定基本事件
      **********************************************************************/

     /**
      * 检测是HTML文本框处理
      * @return {[type]} [description]
      */
     activitPro.htmlTextBox = function () {
         var self = this;
         var eventData = this.eventData;
         var relatedData = this.relatedData;
         var contentHtmlBoxIds = relatedData.contentHtmlBoxIds;
         var contentId;
         var contentName;
         var eventElement;
         //文本框实例对象
         //允许一个activity有多个
         this.htmlBoxInstance = [];
         //创建文本框对象
         if (contentHtmlBoxIds.length && relatedData.contentDas) {
             _.each(relatedData.contentDas, function (cds) {
                 if (~contentHtmlBoxIds.indexOf(cds._id)) {
                     contentId = cds._id;
                     contentName = self.makePrefix('Content', self.pid, contentId);
                     //找到对应绑定事件的元素
                     eventElement = self.findContentElement(contentName);
                     if (!eventElement.attr("data-htmlbox")) {
                         //构建html文本框对象
                         self.htmlBoxInstance.push(new HtmlBox(contentId, eventElement));
                         //增加htmlbox标志去重
                         //多个actictiy共享问题
                         eventElement.attr("data-htmlbox", "true");
                     }
                 }
             });
         }
     };

     /**
      * 制作一个查找标示
      * @return {[type]}
      */
     activitPro.makePrefix = function (name, pid, id) {
         return name + "_" + pid + "_" + id;
     };

     /**
      * 从文档碎片中找到对应的dom节点
      * 查找的范围
      * 1 文档根节点
      * 2 文档容器节点
      * @param  {[type]} prefix [description]
      * @return {[type]}        [description]
      */
     activitPro.findContentElement = function (prefix) {
         var element,
             containerPrefix,
             contentsFragment = this.relatedData.contentsFragment;

         if (element = contentsFragment[prefix]) {
             element = $(element);
         } else {
             //容器处理
             if (containerPrefix = this.relatedData.containerPrefix) {
                 _.each(containerPrefix, function (containerName, index) {
                     element = contentsFragment[containerName];
                     element = $(element).find('#' + prefix);
                     if (element.length) {
                         return;
                     }
                 });
             }
         }
         return element;
     };

     /*********************************************************************
      *
      *                 动画控制
      *
      **********************************************************************/

     /**
      * 保证正确遍历
      * @return {[type]} [description]
      */
     activitPro.eachAssistContents = function (callback) {
         _.each(this.abstractContents, function (scope) {
             //保存只能处理动画
             //scope.processType === 'animation' || scope.processType === 'both')
             callback.call(this, scope);
         }, this);
     };

     /**
      * 初始化PPT动画与音频
      * @return {[type]} [description]
      */
     activitPro.createActions = function () {

         var pageId = this.relatedData.pageId,
             rootNode = this.rootNode,
             collectorHooks = this.relatedCallback.contentsHooks,
             pageType = this.pageType;

         this.eachAssistContents(function (scope) {

             var context, type, id, isRreRun, parameter;

             //针对必须创建
             if (!(context = scope.$contentProcess)) {
                 return;
             };

             //如果是视觉差对象，也需要实现收集器
             if (scope.processType === 'parallax') {
                 collectorHooks(scope.pid, scope.id, scope);
                 return;
             }

             //如果是动画才处理
             id = scope.id, isRreRun = scope.isRreRun, parameter = scope.getParameter();

             //如果不是预生成
             //注册动画事件
             if (isRreRun === undefined) {
                 scope.init(id, context, rootNode, pageId, parameter, pageType);
             }

             //绑定DOM一些属性
             this.domRepeatBind(id, context, isRreRun, scope, collectorHooks, scope.canvasMode);
         });
     };

     /**
      * dom节点去重绑定
      * 1 翻页特性
      * 2 注册钩子
      * 3 预显示
      * @return {[type]} [description]
      */
     activitPro.domRepeatBind = function (id, context, isRreRun, scope, collectorHooks, canvasMode) {
         var indexOf,
             relatedData = this.relatedData;
         //过滤重复关系
         if (-1 !== (indexOf = relatedData.createContentIds.indexOf(id))) {
             //去重
             relatedData.createContentIds.splice(indexOf, 1);
             //收集每一个content注册
             collectorHooks(scope.pid, id, scope);
             //canvas模式
             if (canvasMode) {
                 if (isRreRun) {
                     // console.log(id,scope)
                     //直接改变元素状态
                     // context.visible = isRreRun === 'visible' ? true : false;
                     this.nextTask.pre[id] = function () {
                         this.nextTask.pre.push(function pre(context) {
                             console.log('预执行', isRreRun);
                             //this.canvasRelated.oneRender();
                         });
                     };
                 }
             } else {
                     //dom模式
                     //增加翻页特性
                     this.addIScroll(scope, context);
                     //直接复位状态,针对出现动画 show/hide
                     if (isRreRun) {
                         //直接改变元素状态
                         context.css({
                             'visibility': isRreRun
                         });
                     }
                 }
         }
     };

     /**
      * 增加翻页特性
      * 可能有多个引用关系
      * @return {[type]}         [description]
      */
     activitPro.addIScroll = function (scope, element) {
         var self = this,
             elementName,
             contentDas = scope.contentDas;

         //给外部调用处理
         function makeUseFunction(element) {

             var prePocess = self.makePrefix('Content', scope.pid, scope.id),
                 preEle = self.findContentElement(prePocess);

             //重置元素的翻页处理
             // defaultBehavior(preEle);

             //ios or pc
             if (!Xut.plat.isAndroid) {
                 return function () {
                     self.iscroll = Iscroll(element);
                 };
             }

             //在安卓上滚动文本的互斥不显示做一个补丁处理
             //如果是隐藏的,需要强制显示,待邦定滚动之后再还原
             //如果是显示的,则不需要处理,
             var visible = preEle.css('visibility'),
                 restore = function restore() {};

             if (visible == 'hidden') {
                 var opacity = preEle.css('opacity');
                 //如果设置了不透明,则简单设为可见的
                 //否则先设为不透明,再设为可见
                 if (opacity == 0) {
                     preEle.css({
                         'visibility': 'visible'
                     });
                     restore = function restore() {
                         preEle.css({
                             'visibility': visible
                         });
                     };
                 } else {
                     preEle.css({
                         'opacity': 0
                     }).css({
                         'visibility': 'visible'
                     });
                     restore = function restore() {
                         preEle.css({
                             'opacity': opacity
                         }).css({
                             'visibility': visible
                         });
                     };
                 }
             }

             return function () {
                 self.iscroll = Iscroll(element);
                 restore();
                 preEle = null;
                 restore = null;
             };
         }

         //增加卷滚条
         if (contentDas.isScroll) {
             //去掉高度，因为有滚动文本框
             element.find(">").css("height", "");
             // elementName = this.makePrefix('contentWrapper', scope.pid, scope.id);
             this.relatedCallback.iscrollHooks.push(makeUseFunction(element[0]));
         }

         //如果是图片则补尝允许范围内的高度
         if (!contentDas.mask || !contentDas.isGif) {
             element.find && element.find('img').css({
                 'height': contentDas.scaleHeight
             });
         }
     };

     /**
      * 检测创建完成度
      */
     activitPro.checkCreate = function (callback) {
         var waitCreateContent = this.waitCreateContent;
         if (waitCreateContent && waitCreateContent.length) {
             Mix(this, waitCreateContent, callback);
         } else {
             callback();
         }
     };

     /**
      * 运行动画
      * @param  {[type]} outComplete [动画回调]
      * @return {[type]}             [description]
      * evenyClick 每次都算有效点击
      */
     activitPro.runEffects = function (outComplete, evenyClick) {

         var self = this;
         var pageId = this.relatedData.pageId;

         if (evenyClick) {
             self.preventRepeat = false;
         }

         //防止重复点击
         if (self.preventRepeat) {
             return false;
         }

         self.preventRepeat = true;

         //如果没有运行动画
         if (!self.seed.animation) {
             self.preventRepeat = false;
             self.relevantOperation();
             return;
         }

         //创建的无行为content
         var partContentRelated = self.relatedData.partContentRelated;
         var closeAnim;

         //制作作用于内动画完成
         //等待动画完毕后执行动作or场景切换
         var captureAnimComplete = self.captureAnimComplete = function (counts) {
             return function (scope) {
                 //动画结束,删除这个hack
                 scope && scope.$contentProcess && scope.$contentProcess.removeProp && scope.$contentProcess.removeProp('animOffset');

                 //如果快速翻页
                 //运行动画的时候，发现不是可视页面
                 //需要关闭这些动画 
                 closeAnim = pageId != Xut.Presentation.GetPageId();

                 if (closeAnim && scope) {
                     scope.stop && scope.stop(pageId);
                     scope.reset && scope.reset();
                 }

                 //捕获动画状态
                 if (counts === 1) {
                     if (closeAnim) {
                         //复位动画
                         self.resetAloneAnim();
                     }
                     self.preventRepeat = false;
                     self.relevantOperation();
                     outComplete && outComplete();
                     self.captureAnimComplete = null;
                 } else {
                     --counts;
                 }
             };
         }(this.abstractContents.length);

         /**
          * 如果是preRun处理
          * @return {Boolean} [description]
          */
         function isRreRunPocess(scope) {
             //针对空跳过处理
             if (partContentRelated && partContentRelated.length && -1 !== partContentRelated.indexOf(scope.id)) {
                 captureAnimComplete();
             } else {
                 //必须要修改
                 if (scope.$contentProcess) {
                     if (scope.canvasMode) {
                         //直接改变元素状态
                         scope.$contentProcess.visible = scope.isRreRun === 'visible' ? true : false;
                         self.canvasRelated.oneRender();
                     } else {
                         //因为执行的顺序问题，动画与页面零件
                         //isscroll标记控制
                         if (!scope.$contentProcess.attr('isscroll')) {
                             scope.$contentProcess.css({
                                 'visibility': scope.isRreRun
                             });
                         }
                     }
                 }
                 captureAnimComplete();
             }
         }

         /**
          * 检测创建完成度
          * 递归创建
          * @return {[type]}       [description]
          */
         self.checkCreate(function () {
             //执行动画
             self.eachAssistContents(function (scope) {
                 if (scope.isRreRun) {
                     isRreRunPocess(scope);
                 } else {
                     //标记动画正在运行
                     scope.$contentProcess && scope.$contentProcess.prop && scope.$contentProcess.prop({
                         'animOffset': scope.$contentProcess.offset()
                     });
                     //ppt动画
                     //ppt音频
                     scope.run(function () {
                         captureAnimComplete(scope);
                     });
                 }
             });
             self.runState = true;
         });
     };

     /**
      * 停止动画
      * @return {[type]} [description]
      */
     activitPro.stopEffects = function () {
         var pageId = this.relatedData.pageId;
         this.runState = false;
         this.eachAssistContents(function (scope) {
             !scope.isRreRun && scope.stop && scope.stop(pageId);
         });
     };

     /**
      * 处理拖动对象
      * @return {[type]} [description]
      */
     function accessDrop(eventData, callback) {
         if (eventData && eventData.dragDrop) {
             callback(eventData.dragDrop);
         }
     }

     /**
      * 复位独立动画
      * 提供快速翻页复用
      * @return {[type]} [description]
      */
     activitPro.resetAloneAnim = function () {
         //复位拖动对象
         accessDrop(this.eventData, function (drop) {
             drop.reset();
         });
         //如果是运行canvas模式
         //停止绘制
         if (this.canvasRelated.stopRender) {
             setTimeout(function () {
                 this.canvasRelated.stopRender();
             }.bind(this), 0);
         }
     };

     //复位状态
     activitPro.resetAnimation = function () {
         this.eachAssistContents(function (scope) {
             !scope.isRreRun && scope.reset && scope.reset(); //ppt动画
         });

         this.resetAloneAnim();
     };

     //销毁动画
     activitPro.destroyEffects = function (elementCallback) {
         //销毁拖动对象
         accessDrop(this.eventData, function (drop) {
             drop.destroy();
         });
         this.eachAssistContents(function (scope) {
             if (scope.destroy) {
                 scope.destroy();
             }
             elementCallback && elementCallback(scope);
         });
     };

     /**
      * 动画运行之后
      * 1 创建一个新场景
      * 2 执行跳转到收费提示页面
      * 3 触发搜索工具栏
      * @return {[type]} [description]
      */
     activitPro.relevantOperation = function () {

         var scenarioInfo, eventContentId;

         //触发事件的content id
         if (this.eventData) {
             eventContentId = this.eventData.eventContentId;
         }

         if (eventContentId) {

             //查找出当前节的所有信息
             if (scenarioInfo = this.relatedData.seasonRelated[eventContentId]) {

                 //如果存在搜索栏触发
                 if (scenarioInfo.SearchBar) {
                     this.createSearchBar();
                     return;
                 }

                 //如果存在书签
                 if (scenarioInfo.BookMarks) {
                     this.createBookMark();
                     return;
                 }

                 //收费处理
                 if (scenarioInfo.Inapp !== undefined) {
                     if (scenarioInfo.Inapp == 1) {
                         Xut.Application.HasBuyGood(); //已收费
                     } else {
                             Xut.Application.BuyGood(); //付费接口
                         }
                     return;
                 }

                 //处理新的场景
                 if (scenarioInfo.seasonId || scenarioInfo.chapterId) {
                     setTimeout(function () {
                         Xut.View.LoadScenario({
                             'scenarioId': scenarioInfo.seasonId,
                             'chapterId': scenarioInfo.chapterId
                         });
                     }, Xut.fix.audio ? 1000 : 0);
                     return;
                 }

                 // console.log('content跳转信息出错',scenarioInfo)
             }
         }
     };

     /**
      * 创建搜索框
      * @return {[type]} [description]
      */
     activitPro.createSearchBar = function () {
         var options = {
             parent: this.rootNode
         };
         if (this.searchBar) {
             //如果上次只是隐藏则可以恢复
             this.searchBar.restore();
         } else {
             this.searchBar = new SearchBar(options);
         }
     };

     /**
      * 创建书签
      * @return {[type]} [description]
      */
     activitPro.createBookMark = function () {
         var element, seasonId, pageId, pageData;
         if (this.pageType === 'master') {
             //模板取对应的页面上的数据
             pageData = Xut.Presentation.GetPageData();
             element = this.relatedData.floatMaters.container;
             pageId = pageData._id;
             seasonId = pageData.seasonId;
         } else {
             element = this.rootNode;
             seasonId = this.relatedData.seasonId;
             pageId = this.pageId;
         }
         var options = {
             parent: element,
             seasonId: seasonId,
             pageId: pageId
         };

         if (this.bookMark) {
             //如果上次只是隐藏则可以恢复
             this.bookMark.restore();
         } else {
             this.bookMark = new BookMark$1(options);
         }
     };

     /*********************************************************************
      *
      *                      用户自定义接口事件
      *                                                                    *
      **********************************************************************/

     /**
      * 构建事件体系
      * @return {[type]} [description]
      */
     activitPro.createEventRelated = function () {

         //配置事件节点
         var eventId,
             pid,
             contentName,

         //事件上下文对象
         eventContext,
             eventData = this.eventData;

         //如果存在imageIds才处理,单独绑定事件处理
         if (eventId = eventData.eventContentId) {
             var domEvent = function domEvent() {
                 pid = this.pid;
                 contentName = this.makePrefix('Content', pid, this.id);
                 //找到对应绑定事件的元素
                 eventContext = this.findContentElement(contentName);
             };

             var canvasEvent = function canvasEvent() {
                 eventContext = {};
                 eventData.type = 'canvas';
                 eventData.canvasMode = true;
                 eventData.domMode = false;
             };

             //canvas事件


             //默认dom模式
             _.extend(eventData, {
                 'type': 'dom',
                 'domMode': true,
                 'canvasMode': false
             });

             if (-1 !== this.canvasRelated.cid.indexOf(eventId)) {
                 canvasEvent.call(this);
             } else {
                 //dom事件
                 domEvent.call(this);
             }

             eventData.eventContext = eventContext;

             if (eventContext) {
                 //绑定事件加入到content钩子
                 this.relatedCallback.contentsHooks(pid, eventId, {
                     $contentProcess: eventContext,
                     //增加外部判断
                     isBindEventHooks: true,
                     type: eventData.type
                 });
             } else {
                 /**
                  * 针对动态事件处理
                  * 快捷方式引用到父对象
                  * @type {[type]}
                  */
                 eventData.parent = this;
             }
         }

         /**
          * 解析出事件类型
          */
         eventData.eventName = conversionEventType(eventData.eventType);
     };

     /**
      * 绑定事件行为
      * @return {[type]} [description]
      */
     activitPro.bindEventBehavior = function (callback) {
         var self = this,
             eventData = this.eventData,
             eventName = eventData.eventName,
             eventContext = eventData.eventContext;

         /**
          * 运行动画
          * @return {[type]} [description]
          */
         function startRunAnim() {
             //当前事件对象没有动画的时候才能触发关联动作
             var animOffset,
                 boundary = 5; //边界值

             if (eventData.domMode && (animOffset = eventContext.prop('animOffset'))) {
                 var originalLeft = animOffset.left;
                 var originalTop = animOffset.top;
                 var newOffset = eventContext.offset();
                 var newLeft = newOffset.left;
                 var newTop = newOffset.top;
                 //在合理的动画范围是允许点击的
                 //比如对象只是一个小范围的内的改变
                 //正负10px的移动是允许接受的
                 if (originalLeft > newLeft - boundary && originalLeft < newLeft + boundary || originalTop > newTop - boundary && originalTop < newTop + boundary) {
                     self.runEffects();
                 }
             } else {
                 self.runEffects();
             }
         }

         /**
          * 设置按钮的行为
          * 音频
          * 反弹
          */
         function setBehavior(feedbackBehavior) {

             var behaviorSound;
             //音频地址
             if (behaviorSound = feedbackBehavior.behaviorSound) {

                 var createAuido = function createAuido() {
                     return new Xut.Audio({
                         url: behaviorSound,
                         trackId: 9999,
                         complete: function complete() {
                             this.play();
                         }
                     });
                 };
                 //妙妙学客户端强制删除
                 if (MMXCONFIG && audioHandler) {
                     self._fixAudio.push(createAuido());
                 } else {
                     createAuido();
                 }
             }
             //反弹效果
             if (feedbackBehavior.isButton) {
                 //div通过css实现反弹
                 if (eventData.domMode) {
                     eventContext.addClass('xut-behavior');
                     setTimeout(function () {
                         eventContext.removeClass('xut-behavior');
                         startRunAnim();
                     }, 500);
                 } else {
                     //canvas反弹
                     var sx = eventContext.scale.x;
                     var px = eventContext.position.x;

                     eventContext.scale.x += 0.1;
                     eventContext.position.x -= Math.round(px * 0.05);
                     self.canvasRelated.oneRender();

                     setTimeout(function () {
                         eventContext.scale.x = sx;
                         eventContext.position.x = px;
                         self.canvasRelated.oneRender();
                     }, 200);
                 }
             } else {
                 startRunAnim();
             }
         }

         /**
          * 事件引用钩子
          * 用户注册与执行
          * @type {Object}
          */
         var eventDrop = {
             //保存引用,方便直接销毁
             init: function init(drag) {
                 eventData.dragDrop = drag;
             },
             //拖拽开始的处理
             startRun: function startRun() {},
             //拖拽结束的处理
             stopRun: function stopRun(isEnter) {
                 if (isEnter) {
                     //为true表示拖拽进入目标对象区域
                     self.runEffects();
                 }
             }
         };

         /**
          * 正常动画执行
          * 除去拖动拖住外的所有事件
          * 点击,双击,滑动等等....
          * @return {[type]} [description]
          */
         var eventRun = function eventRun() {
             //如果存在反馈动作
             //优先于动画执行
             var feedbackBehavior;
             if (feedbackBehavior = eventData.feedbackBehavior[eventData.eventContentId]) {
                 setBehavior(feedbackBehavior);
             } else {
                 startRunAnim();
             }
         };

         /**
          * 事件对象引用
          * @return {[type]} [description]
          */
         var eventHandler = function eventHandler(eventReference, _eventHandler) {
             eventData.eventReference = eventReference;
             eventData.eventHandler = _eventHandler;
         };

         //绑定用户自定义事件
         if (eventContext && eventName) {

             var domName,
                 target,
                 dragdropPara = eventData.dragdropPara;

             //获取拖拽目标对象
             if (eventName === 'dragTag') {
                 domName = this.makePrefix('Content', this.pid, dragdropPara);
                 target = this.findContentElement(domName);
             }

             //增加事件绑定标示
             //针对动态加载节点事件的行为过滤
             eventData.isBind = true;

             callback.call(this, {
                 'eventDrop': eventDrop,
                 'eventRun': eventRun,
                 'eventHandler': eventHandler,
                 'eventContext': eventContext,
                 'eventName': eventName,
                 'parameter': dragdropPara,
                 'target': target,
                 'domMode': eventData.domMode
             });
         }
     };

     /**
      * 注册事件
      * @return {[type]} [description]
      */
     activitPro.registerEvent = function () {
         var eventData = this.eventData;
         /**
          * 2016.2.19
          * 绑定canvas事件
          * 由于canvas有异步加载
          * 这里content创建的时候不阻断加载
          * 所以canvas的事件体系
          * 放到所有异步文件加载后才执行
          */
         if (eventData.type === "canvas") {
             var eventData = this.eventData;
             var makeFunction = function bind() {
                 //找到对应的上下文pixi stoge
                 eventData.eventContext = {};
                 this.bindEventBehavior(function (eventData) {
                     bindEvents$1(eventData);
                 });
             };
             this.nextTask.event.push(makeFunction.bind(this));
         } else {
             //dom事件
             this.bindEventBehavior(function (eventData) {
                 bindEvents(eventData);
             });
         }
     };

     /*********************************************************************
      *
      *                      外部调用接口
      *                                                                    *
      **********************************************************************/

     //自动运行
     activitPro.autoPlay = function (outComplete) {
         var eventData = this.eventData;
         if (eventData && eventData.eventName === 'auto') {
             this.runEffects(outComplete);
         } else {
             outComplete();
         }
     };

     //翻页开始
     activitPro.flipOver = function () {
         if (this.runState) {
             this.stopEffects();
         }
         this.preventRepeat = false;
         //复位盒子
         if (this.htmlBoxInstance.length) {
             _.each(this.htmlBoxInstance, function (instance) {
                 instance.removeBox();
             });
         }
         //修复妙妙客户端
         //没有点击音频结束的回调
         //最多允许播放5秒
         if (this._fixAudio.length) {
             _.each(this._fixAudio, function (instance) {
                 setTimeout(function () {
                     instance.end();
                 }, 5000);
             });
             this._fixAudio = [];
         }
     };

     //翻页完成复位动画
     activitPro.flipComplete = function () {
         this.resetAnimation();
     };

     //销毁
     //提供一个删除回调
     //用于处理浮动对象的销毁
     activitPro.destroy = function (elementCallback) {

         //销毁绑定事件
         if (this.eventData.eventContext) {
             destroyEvents(this.eventData);
             this.eventData.eventContext = null;
         }

         //2016.1.7
         //如果有文本框事件
         //一个activity允许有多个文本框
         //所以是数组索引
         if (this.htmlBoxInstance.length) {
             _.each(this.htmlBoxInstance, function (instance) {
                 instance.destroy();
             });
             this.htmlBoxInstance = null;
         }

         //销毁动画
         this.destroyEffects(elementCallback);

         //iscroll销毁
         if (this.iscroll) {
             this.iscroll.destroy();
             this.iscroll = null;
         }

         //销毁搜索框
         if (this.searchBar) {
             this.searchBar.destroy();
             this.searchBar = null;
         }

         //销毁书签
         if (this.bookMark) {
             this.bookMark.destroy();
             this.bookMark = null;
         }

         this.rootNode = null;
     };

     //复位
     activitPro.recovery = function () {
         if (this.runState) {
             this.stopEffects();
             return true;
         }
         return false;
     };

     function TaskContents(data) {
         var preCompileContents;
         data = _.extend(this, data);

         //如果有预执行动作
         //Activity表数据存在
         if (preCompileContents = parseContents(data)) {
             //解析动画表数据结构
             data = parserRelated(preCompileContents, data);
             //如果有需要构建的content
             //开始多线程处理
             data.createContentIds.length ? this.dataAfterCheck(data) : this.loadComplete();
         } else {
             this.loadComplete();
         }
     }

     var taskProto = TaskContents.prototype;

     /**
      * 任务断言
      */
     taskProto.assert = function (taskName, tasks) {

         var self = this;

         //中断方法
         var suspendTasks = function suspendTasks() {
             self.suspendQueues = [];
             self.suspendQueues.push(function () {
                 tasks.call(self);
             });
         };

         //完成方法
         var nextTasks = function nextTasks() {
             tasks.call(self);
         };

         self.pageBaseHooks.suspend(taskName, nextTasks, suspendTasks);
     };

     /**
      * 运行被阻断的线程任务
      * @return {[type]} [description]
      */
     taskProto.runSuspendTasks = function () {
         if (this.suspendQueues) {
             var fn;
             if (fn = this.suspendQueues.pop()) {
                 fn();
             }
             this.suspendQueues = null;
         }
     };

     /**
      * 构建完毕
      * @return {[type]} [description]
      */
     taskProto.loadComplete = function () {
         this.pageBaseHooks.success();
     };

     function createFn(obj, id, callback) {
         var cObj = obj[id];
         if (!cObj) {
             cObj = obj[id] = {};
         }
         callback.call(cObj);
     }

     /**
      * 转成数组格式
      * @param  {[type]} contentsFragment [description]
      * @return {[type]}                  [description]
      */
     function toArray(o) {
         var contentsFragment = [];
         _.each(o, function (contentElements) {
             contentsFragment.push(contentElements);
         });
         return contentsFragment;
     }

     /**
      * 构建快速查询节点对象
      * 转成哈希方式
      * @return {[type]} [description]
      */
     function toObject(cachedContentStr) {
         var tempFragmentHash = {};
         _.each($(cachedContentStr), function (ele, index) {
             tempFragmentHash[ele.id] = ele;
         });
         return tempFragmentHash;
     };

     /**
      * 行为反馈
      *  content id = {
      *      弹动
      *      音频URl
      *  }
      */
     function addBehavior(data) {
         var parameter,
             soundSrc,
             contentId,
             isButton,
             feedbackBehavior = data.feedbackBehavior = {};
         _.each(data.activitys, function (activitys) {
             if (activitys.parameter && (parameter = parseJSON(activitys.parameter))) {
                 contentId = activitys.imageId;
                 //视觉反馈
                 if (isButton = parameter['isButton']) {
                     if (isButton != 0) {
                         //过滤数据的字符串类型
                         createFn(feedbackBehavior, contentId, function () {
                             this['isButton'] = true;
                         });
                     }
                 }
                 //音频行为
                 if (soundSrc = parameter['behaviorSound']) {
                     if (soundSrc != 0) {
                         createFn(feedbackBehavior, contentId, function () {
                             this['behaviorSound'] = soundSrc;
                         });
                     }
                 }
             }
         });
     }

     /**
      * 中断一:构建数据之后
      * @param  {[type]} data [description]
      * @return {[type]}      [description]
      */
     taskProto.dataAfterCheck = function (data) {

         this.assert('dataAfter', function () {

             //浮动模板
             //用于实现模板上的事件
             data.floatMaters = {
                 'ids': [], //浮动id
                 'container': {}, //浮动容器
                 'zIndex': {}
                 // offset : {}  //初始化坐标数据
             };

             //浮动页面
             //母板事件引起的层级遮挡问题
             //用于提升最高
             data.floatPages = {
                 'ids': [],
                 'zIndex': {}
             };

             //增加点击行为反馈
             addBehavior(data);

             //构建页面content类型结构
             var createStr = function createStr(contentDas, cachedContentStr, containerPrefix, idFix, contentHtmlBoxIds) {

                 data.contentHtmlBoxIds = contentHtmlBoxIds;

                 data.contentsFragment = {};

                 //iboosk节点预编译
                 //在执行的时候节点已经存在
                 //不需要在创建
                 if (Xut.IBooks.runMode()) {
                     _.each(idFix, function (id) {
                         data.contentsFragment[id] = data.element.find("#" + id)[0];
                     });
                 } else {
                     //构件快速查询节点对象
                     data.contentsFragment = toObject(cachedContentStr);
                 }

                 //容器的前缀
                 data.containerPrefix = containerPrefix;

                 //2015.5.6暴露到全局
                 //提供给音频字幕上下文               
                 if (!Xut.Contents.contentsFragment[data.chapterId]) {
                     Xut.Contents.contentsFragment[data.chapterId];
                 }
                 Xut.Contents.contentsFragment[data.chapterId] = data.contentsFragment;

                 //开始下一个任务
                 this.dataStrCheck(data, contentDas);
             };

             //构建页面节点
             structure(createStr, data, this);
         });
     };

     /**
      * 中断二:构建结构之后
      * @param  {[type]} data       [description]
      * @param  {[type]} contentDas [description]
      * @return {[type]}            [description]
      */
     taskProto.dataStrCheck = function (data, contentDas) {
         this.assert('strAfter', function () {

             //保留场景的留信息
             //用做软件制作单页预加载
             Xut.sceneController.seasonRelated = data.seasonRelated;

             //初始化content对象
             //绑定content
             //1 动画
             //2 事件
             //3 视觉差
             //4 动画音频
             //5 canvas动画
             contentsBehavior(function (delayHooks) {
                 //渲染页面
                 this.eventAfterCheck(data, delayHooks);
             }.bind(this), data, contentDas);
         });
     };

     ///////////////
     //创建浮动相关的信息 //
     ///////////////
     function crateFloat(callback, floatName, dasFloat, data, base) {

         var elements = [];
         var prefix = 'Content_' + data.pid + "_";

         //去重复
         dasFloat.ids = arrayUnique(dasFloat.ids);

         var makePrefix,
             fragment,
             zIndex,
             zIndexs = dasFloat.zIndex;

         data.count++;

         //分离出浮动节点
         _.each(dasFloat.ids, function (id) {
             makePrefix = prefix + id;
             if (fragment = data.contentsFragment[makePrefix]) {
                 zIndex = zIndexs[id];
                 //保证层级关系
                 // fragment.style.zIndex = (Number(zIndex) + Number(fragment.style.zIndex))
                 elements.push(fragment);
                 delete data.contentsFragment[makePrefix];
             }
         });

         //floatPages模式下面
         //如果是当前页面
         //因为会产生三页面并联
         //所以中间去最高层级
         if (floatName === 'floatPages' && base.initTransformParameter[2] === 0) {
             zIndex = 2001;
         } else {
             zIndex = 2000;
         }

         //浮动根节点
         //floatPages设置的content溢出后处理
         //在非视区增加overflow:hidden
         //可视区域overflow:''
         var overflow = 'overflow:hidden;';
         //如果是母板,排除
         if (floatName === 'floatMaters') {
             overflow = '';
         }
         var floatStr = String.format('<div id="' + floatName + '-li-{0}" class="xut-float" style="' + Xut.plat.prefixStyle('transform') + ':{1};z-index:' + zIndex + ';{2}"></div>', data.pid, base.initTransformParameter[0], overflow);

         var container = $(floatStr);

         //增加浮动容器
         $(data.rootNode).after(container);

         callback(elements, container);
     }

     /**
      * 创建浮动母版对象
      * @return {[type]} [description]
      */
     function createFloatMater(base, data, complete) {
         //创建浮动对象
         crateFloat(function (elements, container) {
             //浮动容器
             data.floatMaters.container = container;

             Xut.nextTick({
                 'container': container,
                 'content': elements
             }, function () {
                 //收集浮动母版对象标识
                 base.pageBaseHooks.collector.floatMaters(data.floatMaters);
                 complete(data);
             });
         }, 'floatMaters', data.floatMaters, data, base);
     }

     /**
      * 创建浮动的页面对象
      */
     function createFloatPage(base, data, complete) {
         //创建浮动对象
         crateFloat(function (elements, container) {
             //浮动容器
             data.floatPages.container = container;
             Xut.nextTick({
                 'container': container,
                 'content': elements
             }, function () {
                 //收集浮动母版对象标识
                 base.pageBaseHooks.collector.floatPages(data.floatPages);
                 complete(data);
             });
         }, 'floatPages', data.floatPages, data, base);
     }

     /**
      * 中断三:绑定事件事件之后
      * @param  {[type]} iScrollHooks [description]
      * @return {[type]}              [description]
      */
     taskProto.eventAfterCheck = function (data, delayHooks) {

         var self = this;

         this.assert('eventAfter', function () {

             data.count = 1; //计算回调的成功的次数

             /**
              * 完成钩子函数
              * 1 content的卷滚条
              * 2 canvas事件绑定
              * @return {[type]} [description]
              */
             var completeHooks = function completeHooks() {
                 var hooks;
                 _.each(delayHooks, function (fns) {
                     while (hooks = fns.shift()) {
                         hooks();
                     }
                 });
             };

             var nextTask = function nextTask() {
                 completeHooks();
                 self.applyAfterCheck();
             };

             /**
              * 1 页面浮动
              * 2 母版浮动
              * 3 正常对象
              */
             var complete = function (data) {
                 return function () {
                     if (data.count === 1) {
                         /**
                          * 2016.2.16
                          * 绘制canvas节点
                          * @return {[type]}                           
                          */
                         if (data.canvasRelated.enable && data.canvasRelated.cid.length) {
                             //初始化绘制canvas
                             //页面显示
                             data.canvasRelated.display();
                             nextTask();
                         } else {
                             nextTask();
                         }
                         return;
                     }
                     data.count--;
                 };
             }(data);

             //浮动页面对
             //浮动对象比任何层级都都要高
             //超过母版
             if (data.floatPages.ids && data.floatPages.ids.length) {
                 createFloatPage(this, data, complete);
             }

             //如果存在母版浮动节点
             //在创建节点structure中过滤出来，根据参数的tipmost
             if (data.floatMaters.ids && data.floatMaters.ids.length) {
                 createFloatMater(this, data, complete);
             }

             //iboosk节点预编译
             //在执行的时候节点已经存在
             //不需要在创建
             if (Xut.IBooks.runMode()) {
                 complete();
             } else {
                 //正常对象
                 Xut.nextTick({
                     'container': data.element,
                     'content': toArray(data.contentsFragment)
                 }, complete);
             }
         });
     };

     /**
      * 中断四：渲染content
      * @return {[type]} [description]
      */
     taskProto.applyAfterCheck = function () {
         this.assert('applyAfter', function () {
             //构建页面节点
             // Xut.log('debug', '第' + (self.pid + 1) + '页面content相关的节点与事件全部构建完毕................')
             this.loadComplete(true);
         });
     };

     /**
      * 清理引用
      * @return {[type]} [description]
      */
     taskProto.clearReference = function () {
         //删除字幕用的碎片文档
         if (Xut.Contents.contentsFragment[this.chapterId]) {
             delete Xut.Contents.contentsFragment[this.chapterId];
         }
         this.element = null;
         this.rootNode = null;
         this.contentsFragment = null;
     };

     /** 配置ID
      * @return {[type]} [description]
      */
     function autoUUID() {
         return 'autoRun-' + Math.random().toString(36).substring(2, 15);
     }

     /**
      * 给所有content节点绑定对应的事件与动画
      * @return {[type]} [description]
      */
     function contentsBehavior(callback, data, contentDas) {
         var compiler,
             element = data.element,
             eventRelated = data.eventRelated,
             //合集事件
         pid = data.pid,
             activityRelated = data.activityRelated,
             feedbackBehavior = data.feedbackBehavior,
             //反馈数据,跟事件相关
         pageBaseHooks = data.pageBaseHooks,
             pageId = data.chapterId;

         //如果有浮动对象,才需要计算偏移量
         //母版里面可能存在浮动或者不浮动的对象
         //那么在布局的时候想对点不一样
         //如果在浮动区域就取浮动初始值
         //否则就是默认的想对点0
         var transformOffset = function (ids, initTransformOffset) {
             return function (id) {
                 //匹配是不是属于浮动对象
                 if (ids.length && ids[id]) {
                     //初始化容器布局的坐标
                     return initTransformOffset;
                 }
                 return 0;
             };
         }(data.floatMaters.ids, data.initTransformParameter[2]);

         //相关回调
         var relatedCallback = {
             //绑定卷滚条钩子
             'iscrollHooks': [],
             //contetn钩子回调
             'contentsHooks': pageBaseHooks.collector.contents
         };

         //相关数据
         var relatedData = {
             'floatMaters': data.floatMaters,
             'seasonId': data.chpaterData.seasonId,
             'pageId': pageId,
             'contentDas': contentDas, //所有的content数据合集
             'container': data.liRootNode,
             'seasonRelated': data.seasonRelated,
             'containerPrefix': data.containerPrefix,
             'nodes': data.nodes,
             'pageOffset': data.pageOffset,
             'createContentIds': data.createContentIds,
             'partContentRelated': data.partContentRelated,
             'transformOffset': transformOffset,
             'contentsFragment': data.contentsFragment,
             'contentHtmlBoxIds': data.contentHtmlBoxIds
         };

         /**
          * 收集事件信息
          * 为处理动态分段绑定的问题
          * @type {Object}
          */
         var collectEventRelated = {};

         /**
          * 继续下一个任务
          * @return {[type]} [description]
          */
         var nextTask = function nextTask() {
             //多事件合集处理pagebase
             if (eventRelated) {
                 pageBaseHooks.eventBinding && pageBaseHooks.eventBinding(eventRelated);
             }
             //删除钩子
             delete relatedCallback.contentsHooks;
             callback(relatedCallback);
         };

         /**
          * 2016.4.11
          * canvas模式创建的才完成数
          * 监控完成度
          * 如果是canvas就需要监听创建
          * 因为存在异步创建
          * @type {Object}
          */
         var monitor = {
             total: activityRelated.length,
             current: 0,
             complete: function complete() {
                 ++monitor.current;
                 if (monitor.current == monitor.total) {
                     nextTask();
                 }
             }
         };

         /**
          * 生成activty控制对象
          * @type {[type]}
          */
         while (compiler = activityRelated.shift()) {

             var filters;
             var imageId = compiler['imageIds']; //父id
             var activity = compiler['activity'];
             var eventType = activity.eventType;
             var dragdropPara = activity.para1;
             var eventContentId = imageId;

             /**
              * 多事件数据过滤
              * 为了防止数据写入错误数据
              * 如果当前对象上有多事件的行为
              * 则默认的事件去掉
              * @type {[type]}
              */
             if (filters = eventRelated['eventContentId->' + imageId]) {
                 _.each(filters, function (edata) {
                     //id不需要
                     //eventContentId = void 0;
                     if (edata.eventType == activity.eventType) {
                         //写入的是伪数据,此行为让多事件抽象接管
                         eventType = dragdropPara = void 0;
                     }
                 });
             }

             //需要绑定事件的数据
             var eventData = {
                 'eventContentId': eventContentId,
                 'eventType': eventType,
                 'dragdropPara': dragdropPara,
                 'feedbackBehavior': feedbackBehavior
             };

             //缓存所有的事件数据
             if (eventContentId) {
                 collectEventRelated[eventContentId] = eventData;
                 relatedData['collectEventRelated'] = collectEventRelated;
             }

             //注册引用
             pageBaseHooks.registerAbstractActivity(new activityClass({
                 'monitorComplete': monitor.complete, //监听完成
                 'pageIndex': data.pageIndex,
                 'canvasRelated': data.canvasRelated, //父类引用
                 'id': imageId || autoUUID(),
                 "type": 'Content',
                 'pageId': pageId,
                 'activityId': activity._id,
                 'rootNode': element,
                 'pageType': compiler['pageType'], //构建类型 page/master
                 'seed': compiler['seed'], //动画表数据 or 视觉差表数据
                 "pid": pid, //页码
                 'eventData': eventData, //事件数据
                 'relatedData': relatedData, //相关数据,所有子作用域Activity对象共享
                 'relatedCallback': relatedCallback //相关回调
             }));
         }
     }

     /**
      * 解析出需要构建的content对象
      * @param  {[type]} data [description]
      * @return {[type]}      [description]
      */
     function parseContents(data) {
         var actType,
             preCompileContent = [];

         //需要创建的数据结构
         _.each(data.activitys, function (activityData) {
             actType = activityData.actType || activityData.animation;
             //特殊类型 showNote
             if (!actType && activityData.note) {
                 activityData['actType'] = actType = "ShowNote";
             }
             if (activityData.itemArray || activityData.autoPlay !== 2) {
                 switch (actType) {
                     case 'Container':
                     case 'Content':
                     case 'Parallax':
                     case 'Contents':
                         preCompileContent.push(activityData);
                         //compileContent();
                         break;
                 }
             }
             //编译content类型
             // 1 通过Animation表产生
             // 2 通过Parallax 表产生
             function compileContent() {
                 preCompileContent.push({
                     postprocessor: function postprocessor(rootEle, pid) {
                         activityData['nodes'] = data['nodes'];
                         activityData['pageOffset'] = data['pageOffset'];
                         return activityData;
                     }
                 });
             }
         });
         return preCompileContent.length ? preCompileContent : null;
     }

     function TaskComponents(data, suspendCallback, successCallback) {

         //预编译模式跳过创建
         if (Xut.IBooks.runMode()) {
             successCallback();
             return;
         }

         if (data['activitys'].length) {
             var str;
             this.rootNode = data['rootNode'];
             this.callback = {
                 'suspendCallback': suspendCallback,
                 'successCallback': successCallback
             };
             str = this.create(data);
             this.compileSuspend(str);
         } else {
             successCallback();
         }
     }

     TaskComponents.prototype = {

         clearReference: function clearReference() {
             this.rootNode = null;
         },

         create: function create(data) {
             var actType,
                 pageType = data.pageType,
                 createWidgets = data.activitys,
                 chpaterData = data.chpaterData,
                 chapterId = data.chapterId,
                 pid = data.pid,
                 virtualOffset = data.virtualOffset,
                 widgetRetStr = [];

             function virtualCreate(actType, activityData) {
                 var scaleLeft = activityData.scaleLeft;
                 // 创建分布左边的对象
                 if (virtualOffset === 'left') {
                     if (scaleLeft < Xut.config.screenSize.width) {
                         startCreate(actType, activityData);
                     }
                 }
                 //创建分布右边的对象
                 if (virtualOffset === 'right') {
                     if (scaleLeft > Xut.config.screenSize.width) {
                         startCreate(actType, activityData);
                     }
                 }
             }

             //创建
             function startCreate(actType, activityData) {
                 //创建DOM元素结构
                 //返回是拼接字符串
                 widgetRetStr.push(Bind[actType]['createDom'](activityData, chpaterData, chapterId, pid, Xut.zIndexlevel(), pageType));
             }

             //需要创建的数据结构
             createWidgets.forEach(function (activityData, index) {

                 //创建类型
                 actType = activityData.actType || activityData.animation;

                 //特殊类型 showNote
                 if (!actType && activityData.note) {
                     activityData['actType'] = actType = "ShowNote";
                 }

                 switch (actType) {
                     case 'ShowNote':
                     case 'Action':
                     case 'Widget':
                     case 'Audio':
                     case 'Video':

                         //缩放比
                         activityData = reviseSize(activityData);

                         //处理虚拟模式创建
                         if (Xut.config.virtualMode) {
                             virtualCreate(actType, activityData);
                         } else {
                             startCreate(actType, activityData);
                         }
                         break;
                 }
             });

             return widgetRetStr.join("");
         },

         /**
          * 编译中断函数
          * @return {[type]} [description]
          */
         compileSuspend: function compileSuspend(str) {

             var nextTasks,
                 suspendTasks,
                 self = this;

             //继续执行
             nextTasks = function nextTasks() {
                 Xut.nextTick({
                     container: self.rootNode,
                     content: $(str)
                 }, function () {
                     self.clearReference();
                     self.callback.successCallback();
                 });
             };

             //中断方法
             suspendTasks = function suspendTasks() {
                 self.suspendQueues = [];
                 self.suspendQueues.push(function () {
                     nextTasks();
                 });
             };

             self.callback.suspendCallback(nextTasks, suspendTasks);
         },

         //运行被阻断的线程任务
         runSuspendTasks: function runSuspendTasks() {
             if (this.suspendQueues) {
                 var fn;
                 if (fn = this.suspendQueues.pop()) {
                     fn();
                 }
                 this.suspendQueues = null;
             }
         }
     };

     //更新数据缓存
     function updataCache(pid, callback) {
         var fn,
             base = this,
             pageType = base.pageType;

         //缓存数据
         function addCacheDas(namespace, data) {
             var key;
             if (!base.dataCache[namespace]) {
                 base.dataCache[namespace] = data;
             } else {
                 for (key in data) {
                     base.dataCache[namespace][key] = data[key];
                 }
             }
         }

         //增加数据缓存
         function addCache(data, activitys, autoRunDas) {
             addCacheDas(base.pageType, data); //挂载页面容器数据
             addCacheDas('activitys', activitys); //挂载activitys数据
             addCacheDas('autoRunDas', autoRunDas); //挂载自动运行数据
         }

         query(pageType, {
             'pageIndex': pid,
             'pageData': base.chapterDas,
             'pptMaster': base.pptMaster
         }, function (data, activitys, autoRunDas) {
             addCache.apply(addCache, arguments);
             callback(data);
         });
     }

     /**
      * 分配Container构建任务
      * 1 同步数据
      * 2 构建容器
      * 3 给出构建回调,这里不能中断,翻页必须存在节点
      * 4 等待之后自动创建或者后台空闲创建之后的任务
      * @return {[type]} [description]
      */
     var assignedTasks = {

         'Container': function Container(taskCallback, base) {
             //同步数据
             updataCache.call(base, [base.pid], function () {
                 var pageData = base.baseData();
                 if (pageData.parameter) {
                     // contentMode 分为  0 或者 1
                     // 1 是dom模式
                     // 0 是canvas模式
                     // 以后如果其余的在增加
                     // 针对页面chapter中的parameter写入 contentMode   值为 1
                     // 针对每一个content中的parameter写入 contentMode 值为 1
                     // 如果是canvas模式的时候，同时也是能够存在dom模式是
                     try {
                         var parameter = JSON.parse(pageData.parameter);
                         if (parameter && parameter.contentMode && parameter.contentMode == 1) {
                             //启动dom模式
                             base.canvasRelated.enable = true;
                         }
                     } catch (e) {
                         console.log('JSON错误,chpterId为', base.chapterId, pageData.parameter);
                     }
                 }

                 //创建主容器
                 TaskContainer({
                     'rootNode': base.root,
                     'prefix': base.pageType + "-" + (base.pageIndex + 1) + "-" + base.chapterId,
                     'pageType': base.pageType,
                     'pid': base.pid,
                     'baseData': pageData,
                     'virtualOffset': base.virtualOffset,
                     'initTransformParameter': base.createRelated.initTransformParameter,
                     'userStyle': base.userStyle //创建自定义style
                 }, taskCallback);
             });
         },

         /**
          *  分配背景构建任务
          *    1 构建数据与结构,执行中断检测
          *    2 绘制结构,执行回调
          *
          *  提供2组回调
          *    1 构建数据结构 suspendCallback
          *    2 执行innerhtml构建完毕 successCallback
          */
         'Background': function Background(taskCallback, base) {

             if (base.checkInstanceTasks('background')) {
                 return;
             }

             var data = base.baseData(base.pid),

             //构建中断回调
             suspendCallback = function suspendCallback(innerNextTasks, innerSuspendTasks) {
                 base.nextTasks({
                     'taskName': '内部background',
                     'outSuspendTasks': innerSuspendTasks,
                     'outNextTasks': innerNextTasks
                 });
             },

             //获取数据成功回调
             successCallback = function successCallback() {
                 taskCallback();
             };

             base.createRelated.cacheTasks['background'] = new TaskBackground(base.getElement(), data, suspendCallback, successCallback);
         },

         /**
          * 分配Components构建任务
          * @return {[type]} [description]
          */
         'Components': function Components(taskCallback, base) {

             if (base.checkInstanceTasks('components')) {
                 return;
             }

             var chapterDas = base.chapterDas,
                 baseData = base.baseData(),

             //构建中断回调
             suspendCallback = function suspendCallback(innerNextTasks, innerSuspendTasks) {
                 base.nextTasks({
                     'taskName': '内部widgets',
                     'outSuspendTasks': innerSuspendTasks,
                     'outNextTasks': innerNextTasks
                 });
             },

             //获取数据成功回调
             successCallback = function successCallback() {
                 taskCallback();
             };

             base.createRelated.cacheTasks['components'] = new TaskComponents({
                 'rootNode': base.getElement(),
                 'nodes': chapterDas['nodes'],
                 'pageOffset': chapterDas['pageOffset'],
                 'activitys': base.baseActivits(),
                 'chpaterData': baseData,
                 'chapterId': baseData['_id'],
                 'pid': base.pid,
                 'pageType': base.pageType,
                 'virtualOffset': base.virtualOffset
             }, suspendCallback, successCallback);
         },

         /**
          * 分配contetns构建任务
          * @return {[type]} [description]
          */
         'Contetns': function Contetns(taskCallback, base) {

             //通过content数据库为空处理
             if (Xut.data.preventContent) {
                 return taskCallback();
             }

             if (base.checkInstanceTasks('contents')) {
                 return;
             }

             var chapterDas = base.chapterDas,
                 baseData = base.baseData(),
                 chapterId = baseData['_id'],
                 activitys = base.baseActivits(),


             //生成钩子
             // collector                : function (pageIndex, id, contentScope) {
             // eventBinding             : function () { [native code] }
             // floatMaters              : function (masters){
             // registerAbstractActivity : function (pageIndex, type, contentsObjs) {
             // successCallback          : function () {
             // suspendCallback          : function (taskName, innerNextTasks, innerSuspendTasks) {
             pageBaseHooks = _.extend({}, {
                 //构建中断回调
                 suspend: function suspend(taskName, innerNextTasks, innerSuspendTasks) {
                     //如果是当前页面构建,允许打断一次
                     var interrupt;
                     if (base.isAutoRun && taskName === 'strAfter') {
                         interrupt = true;
                     }
                     base.nextTasks({
                         'interrupt': interrupt,
                         'taskName': '内部contents',
                         'outSuspendTasks': innerSuspendTasks,
                         'outNextTasks': innerNextTasks
                     });
                 },
                 //获取数据成功回调
                 success: function success() {
                     taskCallback();
                 }
             }, base.listenerHooks);

             base.createRelated.cacheTasks['contents'] = new TaskContents({
                 'canvasRelated': base.canvasRelated,
                 'rootNode': base.root,
                 'element': base.getElement(),
                 'pageType': base.pageType,
                 'nodes': chapterDas['nodes'],
                 'pageOffset': chapterDas['pageOffset'],
                 'activitys': activitys,
                 'chpaterData': baseData,
                 'chapterId': chapterId,
                 'pageIndex': base.pageIndex,
                 'pid': base.pid,
                 'pageBaseHooks': pageBaseHooks,
                 'virtualOffset': base.virtualOffset,
                 'initTransformParameter': base.createRelated.initTransformParameter
             });
         }
     };

     /**
      * canvas相关处理
      * 启动canvas,pixi库
      * 事件，动画等
      * 需要收集所有content的执行
      * 因为canvas只能绘制一次
      * cnavas模式下 category === "Sprite" 转化cid
      */

     var Factory$1 = function Factory() {

         /**
          * 是否启动模式
          * @type {Boolean}
          */
         this.enable = false;

         /**
          * 加载失败content列表
          * @type {Array}
          */
         this.failCid = [];

         //所有contentId
         this.cid = [];

         //开启了contentMode的节点
         //对应的content转化成canvas模式
         //普通精灵动画
         //ppt动画=>转化
         this.pptId = [];

         //普通灵精
         this.spiritId = [];

         //widget零件保存的content id
         //高级精灵动画
         this.widgetId = [];

         /**
          * cid=>wid
          * 对应的pixi对象容器
          * @type {Object}
          */
         this.collections = {};
     };

     observe.call(Factory$1.prototype);

     function PageBase() {};
     var baseProto = PageBase.prototype;

     /********************************************************************
      *
      *                    多线程创建管理
      *
      ********************************************************************/

     /**
      * 初始化多线程任务
      * @return {[type]} [description]
      */
     baseProto.initTasks = function (options) {

         var self = this;

         _.extend(self, options);

         /**
          * 数据缓存容器
          * @type {Object}
          */
         this.dataCache = {};
         this.scenarioId = this.chapterDas.seasonId;
         this.chapterId = this.chapterDas._id;

         /**
          * 是否开启多线程,默认开启
          * 如果是非线性，则关闭多线程创建
          * 启动 true
          * 关闭 false
          * @type {[type]}
          */
         this.isMultithread = this.multiplePages ? true : false;

         //母版处理
         if (self.pageType === 'master') {
             this.isMaster = true;
         }

         /**
          * canvas模式
          * @type {Boolean}
          */
         this.canvasRelated = new Factory$1();

         /**
          * 创建相关的信息
          * @type {Object}
          */
         var createRelated = this.createRelated = {

             /**
              * 主线任务等待
              */
             tasksHang: null,

             /**
              * 创建相关的信息
              * @type {Object}
              */
             tasksTimer: 0,

             /**
              * 当前任务是否中断
              * return
              *     true  中断
              *     false 没有中断
              */
             isTaskSuspend: false,

             /**
              * 是否预创建背景中
              */
             preCreateTasks: false,

             /**
              * 下一个将要运行的任务标示
              * 1 主容器任务
              * 2 背景任务
              * 3 widget热点任务
              * 4 content对象任务
              */
             nextRunTask: 'container',

             /**
              * 缓存构建中断回调
              * 构建分2步骤
              * 1 构建数据与结构（执行中断处理）
              * 2 构建绘制页面
              * @type {Object}
              */
             cacheTasks: function () {
                 var cacheTasks = {};
                 _.each(["background", "components", "contents"], function (taskName) {
                     cacheTasks[taskName] = false;
                 });
                 return cacheTasks;
             }(),

             /**
              * 与创建相关的信息
              * 创建坐标
              * 1 创建li位置
              * 2 创建浮动对象
              * "translate3d(0px, 0, 0)", "original"
              */
             initTransformParameter: createTransform(this.visiblePid, this.pid),

             /**
              * 预创建
              * 构建页面主容器完毕后,此时可以翻页
              * @return {[type]} [description]
              */
             preforkComplete: function preforkComplete() {},

             /**
              * 整个页面都构建完毕通知
              * @return {[type]} [description]
              */
             createTasksComplete: function createTasksComplete() {}
         };

         //==================内部钩子相关===========================
         //
         // * 监听状态的钩子
         // * 注册所有content对象管理
         // * 收集所有content对象
         // * 构建li主结构后,即可翻页
         // * 构建所有对象完毕后处理
         //

         //抽象activtiys合集,用于关联各自的content
         //划分各自的子作用域
         //1对多的关系
         this.abActivitys = new Collection();

         //widget热点处理类
         //1 iframe零件
         //2 页面零件
         //只存在当前页面
         this.components = new Collection();

         /**
          * 缓存所有的content对象引用
          * 1对1的关系
          * @type {Object}
          */
         this.contentsCollector = {};

         /**
          * 浮动对象
          * 1 母版中
          * 2 页面中
          * 页面中是最高的
          * [floatContents description]
          * @type {Object}
          */
         var floatContents = this.floatContents = {

             /**
              * 页面浮动对象容器
              * @type {[type]}
              */
             PageContainer: null,

             /**
              * 浮动页面对象
              * @type {Object}
              */
             Page: {},

             /**
              * 浮动母版容器
              */
             MasterContainer: null,

             /**
              * 浮动母版的content对象
              * 用于边界切换,自动加上移动
              * @type {Object}
              *     1：Object {}      //空对象,零件
              *     2: PPTeffect  {}  //行为对象
              */
             Master: {}
         };

         /**
          * 对象的处理情况的内部钩子方法
          * @type {Object}
          */
         this.listenerHooks = {

             //注册抽象Activity类content(大类,总content对象)
             registerAbstractActivity: function registerAbstractActivity(contentsObjs) {
                 self.abActivitys.register(contentsObjs);
             },

             //收集器
             collector: {
                 //搜集所有的content(每一个content对象)
                 //因为content多页面共享的,所以content的合集需要保存在pageMgr中（特殊处理）
                 contents: function contents(pid, id, contentScope) {
                     var scope = self.baseGetContentObject[id];
                     //特殊处理,如果注册了事件ID,上面还有动画,需要覆盖
                     if (scope && scope.isBindEventHooks) {
                         self.contentsCollector[id] = contentScope;
                     }
                     if (!scope) {
                         self.contentsCollector[id] = contentScope;
                     }
                 },

                 //2014.11.7
                 //新概念，浮动页面对象
                 //用于是最顶层的，比母版浮动对象还要高
                 //所以这个浮动对象需要跟随页面动
                 floatPages: function floatPages(data) {
                     var contentObj;
                     //浮动页面对象容器
                     floatContents.PageContainer = data.container;
                     _.each(data.ids, function (id) {
                         if (contentObj = self.baseGetContentObject(id)) {
                             //初始视察坐标
                             if (contentObj.parallax) {
                                 contentObj.parallaxOffset = contentObj.parallax.parallaxOffset;
                             }
                             floatContents.Page[id] = contentObj;
                         } else {
                             console.log('页面浮动对象找不到');
                         }
                     });
                 },

                 //浮动母版对象
                 //1 浮动的对象是有动画数据或者视觉差数据
                 //2 浮动的对象是用于零件类型,这边只提供创建
                 //  所以需要制造一个空的容器，用于母版交界动
                 floatMaters: function floatMaters(data) {
                     var prefix, contentObj, contentProcess, contentsFragment;
                     //浮动容器
                     floatContents.MasterContainer = data.container;
                     //浮动对象
                     _.each(data.ids, function (id) {
                         //转化成实际操作的浮动对象,保存
                         if (contentObj = self.baseGetContentObject(id)) {
                             //初始视察坐标
                             if (contentObj.parallax) {
                                 contentObj.parallaxOffset = contentObj.parallax.parallaxOffset;
                             }
                             floatContents.Master[id] = contentObj;
                         } else {
                             Xut.plat.isBrowser && console.log('浮动母版对象数据不存在原始对象,制作伪对象母版移动', id);
                             //获取DOM节点
                             if (contentsFragment = self.createRelated.cacheTasks.contents.contentsFragment) {
                                 prefix = 'Content_' + self.pid + "_";
                                 _.each(contentsFragment, function (dom) {
                                     makePrefix = prefix + id;
                                     if (dom.id == makePrefix) {
                                         contentProcess = dom;
                                     }
                                 });
                             }
                             //制作一个伪数据
                             //作为零件类型的空content处理
                             floatContents.Master[id] = {
                                 id: id,
                                 pid: self.pid,
                                 $contentProcess: $(contentProcess),
                                 'empty': true //空类型
                             };
                         }
                     });
                 }
             },

             //多事件钩子
             //执行多事件绑定
             eventBinding: function eventBinding(eventRelated) {
                 create(self, eventRelated);
             }
         };

         /**
          * 设置下一个标记
          */
         function setNextRunTask(taskName) {
             createRelated.nextRunTask = taskName;
         }

         function callContext(taskName, fn) {
             return assignedTasks[taskName](fn, self);
         }

         /**
          * 任务钩子
          * @type {Object}
          */
         self.tasks = {
             container: function container() {
                 callContext('Container', function (element, pseudoElement) {
                     //////////////
                     //li,li-div //
                     //////////////
                     self.element = element;
                     self.pseudoElement = pseudoElement;
                     //获取根节点
                     self.getElement = function () {
                         return pseudoElement ? pseudoElement : element;
                     };

                     setNextRunTask('background');
                     //构建主容器li完毕,可以提前执行翻页动作
                     createRelated.preforkComplete();
                     //视觉差不管
                     if (self.isMaster) {
                         self.nextTasks({
                             'taskName': '外部background',
                             'outNextTasks': function outNextTasks() {
                                 self.dispatchTasks();
                             }
                         });
                     }
                 });
             },
             background: function background() {
                 var nextRun = function nextRun() {
                     createRelated.preCreateTasks = false;
                     setNextRunTask('components');
                     //针对当前页面的检测
                     if (!createRelated.tasksHang || self.isMaster) {
                         self.nextTasks({
                             'taskName': '外部widgets',
                             outNextTasks: function outNextTasks() {
                                 self.dispatchTasks();
                             }
                         });
                     }

                     //如果有挂起任务，则继续执行
                     if (createRelated.tasksHang) {
                         createRelated.tasksHang();
                     }
                 };

                 callContext('Background', nextRun);
             },
             components: function components() {
                 //构件零件类型任务
                 callContext('Components', function () {
                     setNextRunTask('contents');
                     self.nextTasks({
                         'taskName': '外部contents',
                         outNextTasks: function outNextTasks() {
                             self.dispatchTasks();
                         }
                     });
                 });
             },
             contents: function contents() {
                 callContext('Contetns', function () {
                     setNextRunTask('complete');
                     createRelated.createTasksComplete();
                 });
             }
         };
     };

     /****************************************************************
      *
      *                     对外接口
      *
      *               1 开始调用任务
      *               2 调用自动运行任务
      *               3 设置中断
      *               4 取消中断设置
      *
      * **************************************************************/

     /**
      * 开始调用任务
      * @return {[type]} [description]
      */
     baseProto.startThreadTask = function (flipOver, callback) {

         //制作回调
         //如果是快速翻页,立刻调用
         this.createRelated.preforkComplete = function (context) {
             return function () {
                 //滑动允许打断创建
                 flipOver ? callback() :
                 //所有继续分解任务
                 context.checkTasksCreate(function () {
                     callback();
                 });
             };
         }(this);

         //继续构建任务
         this.dispatchTasks();
     };

     /**
      * 检测任务是否完成
      * actTasksCallback 活动任务完成
      * @return {[type]} [description]
      */
     baseProto.checkThreadTask = function (actTasksCallback) {
         var self = this;
         this.isAutoRun = true;
         this.checkTasksCreate(function () {
             self.isAutoRun = false;
             actTasksCallback();
         });
     };

     /**
      * 后台预创建任务
      * @param  {[type]} tasksTimer [时间间隔]
      * @return {[type]}            [description]
      */
     baseProto.createPreforkTasks = function (callback, isPreCreate) {
         var self = this;
         //2个预创建间隔太短
         //背景预创建还在进行中，先挂起来等待
         if (this.createRelated.preCreateTasks) {
             this.createRelated.tasksHang = function (callback) {
                 return function () {
                     self.checkTasksCreate(callback);
                 };
             }(callback);
             return;
         }

         /**
          * 翻页完毕后
          * 预创建背景
          */
         if (isPreCreate) {
             this.createRelated.preCreateTasks = true;
         }

         this.checkTasksCreate(callback);
     };

     /**
      * 自动运行：检测是否需要开始创建任务
      * 1 如果任务全部完成了毕
      * 2 如果有中断任务,就需要继续创建未完成的任务
      * 3 如果任务未中断,还在继续创建
      * currtask 是否为当前任务，加速创建
      */
     baseProto.checkTasksCreate = function (callback, context) {

         //如果任务全部完成
         if (this.createRelated.nextRunTask === 'complete') {
             return callback.call(context);
         }

         var self = this;

         //开始构未完成的任务
         this.cancelTaskSuspend();

         //完毕回调
         this.createRelated.createTasksComplete = function () {
             callback.call(context);
         };

         //派发任务
         this.nextTasks({
             outNextTasks: function outNextTasks() {
                 self.dispatchTasks();
             }
         });
     };

     /**
      * 设置任务中断
      */
     baseProto.setTaskSuspend = function () {
         this.isAutoRun = false;
         this.canvasRelated.isTaskSuspend = true;
         this.createRelated.preCreateTasks = false;
         this.createRelated.tasksHang = null;
     };

     /**
      * 取消任务中断
      * @return {[type]} [description]
      */
     baseProto.cancelTaskSuspend = function () {
         this.canvasRelated.isTaskSuspend = false;
     };

     /**
      * 检测任务是否需要中断
      * @return {[type]} [description]
      */
     baseProto.checkTaskSuspend = function () {
         return this.canvasRelated.isTaskSuspend;
     };

     /**
      * 多线程检测
      * @return {[type]} [description]
      */
     baseProto.multithreadCheck = function (callbacks, interrupt) {
         //多线程检测
         var self = this;

         function check() {
             if (self.checkTaskSuspend()) {
                 self.tasksTimeOutId && clearTimeout(self.tasksTimeOutId);
                 callbacks.suspendCallback.call(self);
             } else {
                 callbacks.nextTaskCallback.call(self);
             }
         }

         function next() {
             self.tasksTimeOutId = setTimeout(function () {
                 check();
             }, self.canvasRelated.tasksTimer);
         }

         //自动运行页面构建
         if (self.isAutoRun) {
             //自动运行content中断检测 打断一次
             if (interrupt) {
                 next();
             } else {
                 check();
             }
         } else {
             //后台构建
             next();
         }
     };

     /**
      * 任务队列挂起
      * nextTaskCallback 成功回调
      * suspendCallback  中断回调
      * @return {[type]} [description]
      */
     baseProto.asyTasks = function (callbacks, interrupt) {

         //如果关闭多线程,不检测任务调度
         if (!this.isMultithread) {
             return callbacks.nextTaskCallback.call(this);
         }

         //多线程检测
         this.multithreadCheck(callbacks, interrupt);
     };

     /**
      * 开始执行下一个线程任务,检测是否中断
      * outSuspendTasks,
      * outNextTasks
      * taskName
      * @return {[type]} [description]
      */
     baseProto.nextTasks = function (callback) {
         var outSuspendTasks, outNextTasks, taskName;

         this.asyTasks({
             suspendCallback: function suspendCallback() {
                 // console.log('@@@@@@@@@@中断创建任务 ' + callback.taskName + ' @@@@@@@@@@@', this.pid + 1, this.element)
                 if (outSuspendTasks = callback.outSuspendTasks) {
                     outSuspendTasks();
                 }
             },
             nextTaskCallback: function nextTaskCallback() {
                 if (outNextTasks = callback.outNextTasks) {
                     outNextTasks();
                 }
             }
         }, callback.interrupt);
     };

     /**
      * 任务调度
      * @return {[type]} [description]
      */
     baseProto.dispatchTasks = function () {
         var tasks;
         if (tasks = this.tasks[this.createRelated.nextRunTask]) {
             tasks();
         }
     };

     //========================构建模块任务对象=========================
     //
     //  taskCallback 每个模块任务完毕后的回调
     //  用于继续往下个任务构建
     //
     //==================================================================

     /**
      * 对象实例内部构建
      * @return {[type]} [description]
      */
     baseProto.checkInstanceTasks = function (taskName) {
         var tasksObj;
         if (tasksObj = this.createRelated.cacheTasks[taskName]) {
             tasksObj.runSuspendTasks();
             return true;
         }
     };

     //获取页面数据
     baseProto.baseData = function () {
         return this.dataCache[this.pageType];
     };

     //获取热点数据信息
     baseProto.baseActivits = function () {
         return this.dataCache['activitys'];
     };

     //获取自动运行数据
     baseProto.baseAutoRun = function () {
         var autoRunDas = this.dataCache['autoRunDas'];
         return autoRunDas && autoRunDas;
     };

     //获取chapterid
     baseProto.baseGetPageId = function (pid) {
         return this.baseData(pid)['_id'];
     };

     /**
      * 找到对象的content对象
      * @param  {[type]}   contentId [description]
      * @param  {Function} callback  [description]
      * @return {[type]}             [description]
      */
     baseProto.baseGetContentObject = function (contentId) {
         var contentsObj;
         if (contentsObj = this.contentsCollector[contentId]) {
             return contentsObj;
         } else {
             //查找浮动母版
             return this.floatContents.Master[contentId];
         }
     };

     /**
      * Xut.Content.show/hide 针对互斥效果增加接口
      * 扩充，显示，隐藏，动画控制接口
      * @param  {[type]} name [description]
      * @return {[type]}      [description]
      */
     baseProto.baseContentMutex = function (contentId, type) {
         var contentObj,
             base = this;
         if (contentObj = base.baseGetContentObject(contentId)) {
             var context = contentObj.$contentProcess;
             var handle = {
                 'Show': function Show() {
                     if (contentObj.type === 'dom') {
                         context.css({
                             'display': 'blcok',
                             'visibility': 'visible'
                         }).prop("mutex", false);
                     } else {
                         context.visible = true;
                         console.log('show');
                         base.canvasRelated.oneRender();
                     }
                 },
                 'Hide': function Hide() {
                     if (contentObj.type === 'dom') {
                         context.css({
                             'display': 'none',
                             'visibility': 'hidden'
                         }).prop("mutex", true);
                     } else {
                         console.log('hide');
                         context.visible = false;
                         base.canvasRelated.oneRender();
                     }
                 },
                 'StopAnim': function StopAnim() {
                     contentObj.stopAnims && contentObj.stopAnims();
                 }
             };
             handle[type]();
         }
     };

     //content接口
     _.each(["Get", "Specified"], function (type) {
         baseProto['base' + type + 'Content'] = function (data) {
             switch (type) {
                 case 'Get':
                     return this.abActivitys.get();
                 case 'Specified':
                     return this.abActivitys.specified(data);
             }
         };
     });

     //components零件类型处理
     //baseGetComponent
     //baseRemoveComponent
     //baseRegisterComponent
     //baseSpecifiedComponent
     _.each(["Get", "Remove", "Register", "Specified"], function (type) {
         baseProto['base' + type + 'Component'] = function (data) {
             switch (type) {
                 case 'Register':
                     return this.components.register(data);
                 case 'Get':
                     return this.components.get();
                 case 'Specified':
                     return this.components.specified(data);
                 case 'Remove':
                     return this.components.remove();
             }
         };
     });

     //***************************************************************
     //
     //               运行辅助对象事件
     //
     //***************************************************************
     baseProto.baseAssistRun = function (activityId, outCallBack, actionName) {
         var activity;
         if (activity = this.abActivitys) {
             _.each(activity.get(), function (contentObj, index) {
                 if (activityId == contentObj.activityId) {
                     if (actionName == 'Run') {
                         contentObj.runEffects(outCallBack, true);
                     }
                     if (actionName == 'Stop') {
                         contentObj.stopEffects(outCallBack);
                     }
                 }
             }, this);
         }
     };

     //销毁页面对象
     baseProto.baseDestroy = function () {

         //清理图片缓存
         //读库快速退出模式下报错修正
         try {
             this.element.hide().find('img').each(function (aaa, img) {
                 img.src = 'images/icons/clearmem.png';
             });
         } catch (e) {}

         //清理线程任务块
         var cacheTasks, key, tasks;
         if (cacheTasks = this.createRelated.cacheTasks) {
             for (key in cacheTasks) {
                 if (tasks = cacheTasks[key]) {
                     tasks.clearReference();
                 }
             }
         }

         //浮动对象
         var floatMaterContents = this.floatContents.Master;
         //是否有浮动对象
         var hasFloatMater = !_.isEmpty(floatMaterContents);

         //清理content类型对象
         var contents;
         if (contents = this.abActivitys.get()) {
             contents.forEach(function (contentObj) {
                 contentObj.destroy(function (destroyObj) {
                     //如果不是浮动对象,清理元素引用
                     if (!hasFloatMater || destroyObj && !floatMaterContents[destroyObj.id]) {
                         destroyObj.$contentProcess = null;
                     }
                 });
             });
         }

         //清除母版浮动容器
         if (hasFloatMater && this.floatContents.MasterContainer) {
             this.floatContents.MasterContainer.remove();
         }

         //清除浮动页面对象
         if (this.floatContents.Page && this.floatContents.PageContainer) {
             this.floatContents.PageContainer.remove();
         }

         //清理零件类型对象
         var components;
         if (components = this.baseGetComponent()) {
             components.length && components.forEach(function (componentObj) {
                 componentObj.destroy && componentObj.destroy();
             });
         }

         //多事件销毁
         destroy$2(this);

         //销毁canvas相关
         if (this.canvasRelated && this.canvasRelated.destroy) {
             this.canvasRelated.destroy();
         }

         //伪li节点
         if (this.pseudoElement) {
             this.pseudoElement = null;
         }

         //移除li容器节点节点
         this.element.remove();
         this.root = null;
         this.element = null;
     };

     var Master = Xut.extend(PageBase, {
     	constructor: function constructor(options) {
     		//多线程处理
     		this.initTasks(options);
     		return this;
     	}
     });

     /**
      * 利用canvas绘制出蒙板效果替换，需要蒙板效果的图片先用一个canvas占位，绘制是异步的
      */

     function _getCanvas(className) {
         var children = document.getElementsByTagName('canvas'),
             elements = new Array(),
             i = 0,
             child,
             classNames,
             j = 0;
         for (i = 0; i < children.length; i++) {
             child = children[i];
             classNames = child.className.split(' ');
             for (var j = 0; j < classNames.length; j++) {
                 if (classNames[j] == className) {
                     elements.push(child);
                     break;
                 }
             }
         }
         return elements;
     }

     function _addEdge(canvas) {

         var img = new Image(),
             maskimg = new Image();
         classNames = canvas.className.split(' ');
         var context = canvas.getContext("2d");
         img.addEventListener("load", loadimg);
         maskimg.addEventListener("load", loadmask);

         function loadimg() {
             context.clearRect(0, 0, canvas.width, canvas.height);
             context.globalCompositeOperation = "source-over";
             context.drawImage(img, 0, 0, canvas.width, canvas.height);
             maskimg.src = canvas.getAttribute("mask");
             img.removeEventListener("load", loadimg);
             img.src = null;
             img = null;
         }

         function loadmask() {
             context.globalCompositeOperation = "destination-atop";
             context.drawImage(maskimg, 0, 0, canvas.width, canvas.height);
             canvas.style.opacity = 1;
             maskimg.removeEventListener("load", loadmask);
             maskimg.src = null;
             maskimg = null;
             context = null;
             classNames = null;
             canvas.className = canvas.className.replace("edges", "");
         }
         img.src = canvas.getAttribute("src");
     }

     function addEdges() {
         var thecanvas = _getCanvas('edges'),
             i;
         for (i = 0; i < thecanvas.length; i++) {
             _addEdge(thecanvas[i]);
         }
     }

     function PageMgr(vm) {

         this.pageType = 'page';

         /**
          * 页面根节点
          * @type {[type]}
          */
         this.rootNode = vm.options.rootPage;

         /**
          * 抽象方法
          * 创建合集容器
          */
         this.abstractCreateCollection();
     };

     var PageMgrProto = PageMgr.prototype;

     /****************************************************************
      *
      *                 对外接口
      *
      ***************************************************************/

     //====================页面结构处理===========================

     //创建页新的页面
     PageMgrProto.create = function (dataOpts, pageIndex) {

         //生成指定页面对象
         var pageObjs = new Master(_.extend(dataOpts, {
             'pageType': this.pageType, //创建页面的类型
             'root': this.rootNode //根元素
         }));

         //增加页面管理
         this.abstractAddCollection(pageIndex, pageObjs);

         return pageObjs;
     };

     /**
      * 清理视频
      * @return {[type]} [description]
      */
     function removeVideo(clearPageIndex) {
         //处理视频
         var pageId = Xut.Presentation.GetPageId(clearPageIndex);
         Xut.VideoManager.removeVideo(pageId);
     }

     //清理其中的一个页面
     PageMgrProto.clearPage = function (clearPageIndex) {
         var pageObj;
         //清理视频
         // removeVideo(clearPageIndex);
         //销毁页面对象事件
         if (pageObj = this.abstractGetPageObj(clearPageIndex)) {
             //移除事件
             pageObj.baseDestroy();
             //移除列表
             this.abstractRemoveCollection(clearPageIndex);
         }
     };

     //销毁整个页面管理对象
     PageMgrProto.destroy = function () {
         //清理视频
         removeVideo(Xut.Presentation.GetPageIndex());
         //清理对象
         this.abstractDestroyCollection();
         //清理节点
         this.rootNode = null;
     };

     /**
      * 检测脚本注入
      * @return {[type]} [description]
      */
     function checkInjectScript$1(pageObject, type) {
         var code;
         if (code = pageObject.chapterDas[type]) {
             injectScript(code, type);
         }
     }

     /****************************************************************
      *
      *                 多线程任务片段调用
      *
      ***************************************************************/

     /**
      * 设置中断正在创建的页面对象任务
      * @param {[type]}   currIndex [description]
      * @param {Function} callback  [description]
      */
     PageMgrProto.suspendInnerCreateTasks = function (pointers) {
         var pageObj,
             self = this;
         [pointers.leftIndex, pointers.currIndex, pointers.rightIndex].forEach(function (pointer) {
             if (pageObj = self.abstractGetPageObj(pointer)) {
                 pageObj.setTaskSuspend();
             }
         });
     };

     /**
      * 检测活动窗口任务
      * @return {[type]} [description]
      */
     PageMgrProto.checkTaskCompleted = function (currIndex, callback) {
         var currPageObj,
             self = this;
         // console.log('激活活动任务',currIndex)
         if (currPageObj = self.abstractGetPageObj(currIndex)) {
             currPageObj.checkThreadTask(function () {
                 // console.log('11111111111当前页面创建完毕',currIndex+1)
                 callback(currPageObj);
             });
         }
     };

     /**
      * 检测后台预创建任务
      * @return {[type]} [description]
      */
     PageMgrProto.checkPreforkTasks = function (resumePointer, preCreateTask) {
         var resumeObj, resumeCount;
         if (!resumePointer.length) {
             resumePointer = [resumePointer];
         }
         resumeCount = resumePointer.length;
         while (resumeCount--) {
             if (resumeObj = this.abstractGetPageObj(resumePointer[resumeCount])) {
                 resumeObj.createPreforkTasks(function () {
                     // console.log('后台处理完毕')
                 }, preCreateTask);
             }
         }
     };

     /************************************************************
      *
      *                       页面滑动
      *
      * **********************************************************/
     PageMgrProto.move = function (leftIndex, currIndex, rightIndex, direction, speed, action, moveDistance) {

         //////////////
         //找到需要滑动的页面 //
         //////////////
         function findPage() {
             return [this.abstractGetPageObj(leftIndex), this.abstractGetPageObj(currIndex), this.abstractGetPageObj(rightIndex)];
         }

         ///////////
         //开始移动页面 //
         ///////////
         _.each(findPage.call(this), function (pageObj, index) {
             if (pageObj) {
                 //移动浮动页面容器
                 var flaotElement;
                 if (flaotElement = pageObj.floatContents.PageContainer) {
                     translation[action].call(pageObj, moveDistance[index], speed, flaotElement);
                 }
                 //正常页面
                 translation[action].call(pageObj, moveDistance[index], speed);
             }
         });
     };

     /****************************************************************
      *
      *                  流程状态控制
      *
      ***************************************************************/

     /**
      * 触屏翻页开始
      * 1 中断所有任务
      * 2 停止热点对象运行
      *     停止动画,视频音频等等
      */
     PageMgrProto.suspend = function (pointers) {
         var stopPointer = pointers.stopPointer,
             suspendPageObj = this.abstractGetPageObj(stopPointer),
             prveChpterId = suspendPageObj.baseGetPageId(stopPointer);

         //翻页结束脚本
         checkInjectScript$1(suspendPageObj, 'postCode');

         //中断节点创建任务
         this.suspendInnerCreateTasks(pointers);

         //停止活动对象活动
         _suspend(suspendPageObj, prveChpterId);
     };

     /**
      * 复位初始状态
      * @return {[type]} [description]
      */
     PageMgrProto.resetOriginal = function (pageIndex) {
         var originalPageObj, flaotElement;
         if (originalPageObj = this.abstractGetPageObj(pageIndex)) {
             if (flaotElement = originalPageObj.floatContents.PageContainer) {
                 //floatPages设置的content溢出后处理
                 //在非视区增加overflow:hidden
                 //可视区域overflow:''
                 flaotElement.css({
                     'zIndex': 2000,
                     'overflow': 'hidden'
                 });
             }
             _original(originalPageObj);
         }
     };

     /**
      * 触屏翻页完成
      * 1 停止热点动作
      * 2 触发新的页面动作
      * @param  {[type]} prevPageIndex [上一页面]
      * @param  {[type]} currPageIndex [当前页码]
      * @param  {[type]} nextPageIndex [下一页页码]
      * @param  {[type]} suspendIndex  [停止动作的页码]因为要区分滑动的方向
      * @param  {[type]} createPointer [正在创建的页面]
      * @param  {[type]} direction     [滑动方向]
      */
     PageMgrProto.autoRun = function (data) {

         var self = this;

         //检测当前页面构建任务的情况
         //如果任务没有完成，则等待任务完成
         this.checkTaskCompleted(data.currIndex, function (currPageObj) {

             //提升当前页面浮动对象的层级
             //因为浮动对象可以是并联的
             var flaotElement;
             if (flaotElement = currPageObj.floatContents.PageContainer) {
                 flaotElement.css({
                     'zIndex': 2001,
                     'overflow': ''
                 });
             }

             //IE上不支持蒙版效果的处理
             if (Xut.plat.noMaskBoxImage) {
                 addEdges();
             }

             //构件完成通知
             data.buildComplete(currPageObj.scenarioId);

             //执行自动动作之前的脚本
             checkInjectScript$1(currPageObj, 'preCode');

             //热点状态复位
             self.resetOriginal(data.suspendIndex);

             //预构建背景
             preCreate('background');

             //等待动画结束后构建
             startAutoRun(currPageObj, data);
         });

         /**
          * 预执行背景创建
          * 支持多线程快速翻页
          * 1 初始化,或者快速翻页补全前后页面
          * 2 正常翻页创建前后
          */
         function preCreate(preCreateTask) {
             var resumePointer;
             if (data.isQuickTurn || !data.direction) {
                 resumePointer = [data.prevIndex, data.nextIndex];
             } else {
                 resumePointer = data.createPointer || data.nextIndex || data.prevIndex;
             }
             self.checkPreforkTasks(resumePointer, preCreateTask);
         };

         //激活自动运行对象
         function startAutoRun(currPageObj, data) {

             //结束通知
             function complete() {
                 data.processComplete();
                 preCreate();
             }

             //如果页面容器存在,才处理自动运行
             var currRootNode = currPageObj.element;
             if (!currRootNode) {
                 return complete();
             }

             //运行动作
             function startRun() {
                 _autoRun(currPageObj, data.currIndex, complete);
             }

             //运行如果被中断,则等待
             if (data.suspendCallback) {
                 data.suspendCallback(startRun);
             } else {
                 startRun();
             }
         }
     };

     //混入抽象接口方法
     extend(PageMgr, Abstract);

     var prefix$5 = Xut.plat.prefixStyle;
     var rword = "-";

     /**
      * parallaObjsCollection: Object
      *  	0: Page
      *	    1: Page
      *
      *	recordMasterId: Object
      *		0: 9001
      *	 	1: 9001
      *
      *	recordMasterscope: Object
      *		9001: Array[2]
      *
      *	rootNode: ul # parallax.xut - parallax xut - flip
      *
      *	currMasterId: 9001 //实际的可使区
      */

     function MasterMgr(vm) {

         var config = Xut.config;

         this.screenWidth = config.screenSize.width;
         this.screenHeight = config.screenSize.height;

         this.pageType = 'master';

         this.rootNode = vm.options.rootMaster;
         this.recordMasterscope = {}; //记录master区域范围
         this.recordMasterId = {}; //记录页面与母板对应的编号
         this.currMasterId = null; //可视区母板编号

         //记录视察处理的对象
         this.parallaxProcessedContetns = {};

         /**
          * 抽象方法
          * 创建视觉差容器
          */
         this.abstractCreateCollection();
     }

     var MasterProto = MasterMgr.prototype;

     /****************************************************************
      *
      *                 对外接口
      *
      ***************************************************************/

     //====================页面结构处理===========================

     MasterProto.create = function (dataOpts, pageIndex, createCallBack) {
         var masterObj,
             reuseMasterId,
             reuseMasterKey,
             pptMaster = dataOpts.chapterDas.pptMaster,
             pageOffset = dataOpts.chapterDas.pageOffset;

         //母板复用的标示
         reuseMasterId = pageOffset && pageOffset.split(rword);

         //组合下标
         if (reuseMasterId && reuseMasterId.length === 3) {
             reuseMasterKey = pptMaster + rword + reuseMasterId[2];
         } else {
             reuseMasterKey = pptMaster;
         }

         //检测视觉差对象是否重复创建
         if (this._checkRepeat(reuseMasterKey, pageOffset, pageIndex)) {
             return;
         }

         //通知外部,需要创建的母版
         createCallBack();

         masterObj = new Master(_.extend(dataOpts, {
             'pageType': this.pageType, //创建页面的类型
             'root': this.rootNode, //根元素
             'pptMaster': pptMaster //ppt母板ID
         }));

         //增加页面管理
         this.abstractAddCollection(reuseMasterKey, masterObj);

         return masterObj;
     };

     //销毁整个页面对象
     MasterProto.destroy = function () {
         this.rootNode = null;
         //销毁对象
         this.abstractDestroyCollection();
     };

     /**
      * 找到当前页面的可以需要滑动是视觉页面对象
      * @return {[type]}            [description]
      */
     MasterProto.findMaster = function (leftIndex, currIndex, rightIndex, direction, action) {
         var prevFlag,
             nextFlag,
             prevMasterObj,
             currMasterObj,
             nextMasterObj,
             prevMasterId = this.conversionMasterId(leftIndex),
             currMasterId = this.conversionMasterId(currIndex),
             nextMasterId = this.conversionMasterId(rightIndex);

         switch (direction) {
             case 'prev':
                 if (prevFlag = currMasterId !== prevMasterId) {
                     currMasterObj = this.abstractGetPageObj(currMasterId);
                 }
                 if (prevMasterId && prevFlag) {
                     action === 'flipOver' && this.checkClear([currMasterId, prevMasterId]); //边界清理
                     prevMasterObj = this.abstractGetPageObj(prevMasterId);
                 }
                 break;
             case 'next':
                 if (nextFlag = currMasterId !== nextMasterId) {
                     currMasterObj = this.abstractGetPageObj(currMasterId);
                 }
                 if (nextMasterId && nextFlag) {
                     action === 'flipOver' && this.checkClear([currMasterId, nextMasterId]); //边界清理
                     nextMasterObj = this.abstractGetPageObj(nextMasterId);
                 }
                 break;
         }
         return [prevMasterObj, currMasterObj, nextMasterObj];
     };

     /**
      * 页面滑动处理
      * 1 母版之间的切换
      * 2 浮动对象的切换
      */
     MasterProto.move = function (leftIndex, currIndex, rightIndex, direction, moveDistance, action, speed, nodes) {
         var parallaxOffset,
             self = this,
             isBoundary = false; //是边界处理

         //找到需要滑动的母版
         _.each(this.findMaster(leftIndex, currIndex, rightIndex, direction, action), function (pageObj, index) {
             if (pageObj) {
                 isBoundary = true;
                 //母版交接判断
                 //用户事件的触发
                 pageObj.onceMaster = false;
                 //移动母版
                 translation[action].call(pageObj, moveDistance[index], speed);
                 //移动浮动容器
                 if (pageObj.floatContents.MasterContainer) {
                     translation[action].call(pageObj, moveDistance[index], speed, pageObj.floatContents.MasterContainer);
                 }
             }
         });

         //越界不需要处理内部视察对象
         this.isBoundary = isBoundary;
         if (isBoundary) {
             return;
         }

         //移动视察对象
         function moveParallaxObject(nodes) {
             self.moveParallaxs(moveDistance, currIndex, action, direction, speed, nodes);
         }

         //移动视察对象
         switch (direction) {
             case 'prev':
                 moveParallaxObject();
                 break;
             case 'next':
                 nodes && moveParallaxObject(nodes);
                 break;
         }
     };

     /**
      * 停止行为
      * @return {[type]} [description]
      */
     MasterProto.suspend = function (pointers) {
         //如果未越界不需要处理行为
         if (!this.isBoundary) return;
         var masterObj,
             stopPointer = pointers.stopPointer;
         if (masterObj = this.abstractGetPageObj(stopPointer)) {
             var pageId = masterObj.baseGetPageId(stopPointer);
             //停止活动对象活动
             _suspend(masterObj, pageId);
         }
     };

     /**
      * 复位初始状态
      * @return {[type]} [description]
      */
     MasterProto.resetOriginal = function (pageIndex) {
         var originalPageObj;
         if (originalPageObj = this.abstractGetPageObj(pageIndex)) {
             _original(originalPageObj);
         }
     };

     /**
      * 	母版自动运行
      */
     MasterProto.autoRun = function (data) {
         var masterObj, element;
         if (masterObj = this.abstractGetPageObj(data.currIndex)) {
             //热点状态复位
             this.resetOriginal(data.suspendIndex);
             _autoRun(masterObj, data.currIndex);
         }
     };

     /**
      * 移动内部的视察对象
      */
     MasterProto.moveParallaxs = function (moveDistance, currIndex, action, direction, speed, nodes) {
         var rootNode,
             floatObj,
             contentObj,
             contentObjs,
             baseContents,
             currParallaxObj,
             currMoveDistance,
             hasFloatMater,
             floatMaterParallaxChange,

         //需要执行动画
         activationAnim = action === "flipRebound" || action === "flipOver",
             self = this;

         //处理当前页面内的视觉差对象效果
         if (currParallaxObj = this.abstractGetPageObj(this.conversionMasterId(currIndex))) {
             if (baseContents = currParallaxObj.baseGetContent()) {
                 self.baseContents = baseContents;
                 //移动距离
                 currMoveDistance = moveDistance[1];
                 //遍历所有活动对象
                 _.each(baseContents, function (content) {
                     content.eachAssistContents(function (scope) {
                         //如果是视察对象移动
                         if (scope.parallax) {
                             rootNode = scope.parallax.rootNode;
                             contentObj = currParallaxObj.baseGetContentObject(scope.id);
                             /////////////////////
                             //如果有这个动画效果 //
                             //先停止否则通过视觉差移动会出问题
                             // //影响，摩天轮转动APK
                             // * 重新激动视觉差对象
                             // * 因为视察滑动对象有动画
                             // * 2个CSS3动画冲突的
                             // * 所以在视察滑动的情况下先停止动画
                             // * 然后给每一个视察对象打上对应的hack=>data-parallaxProcessed
                             // * 通过动画回调在重新加载动画
                             /////////////////////
                             if (action === "flipMove" && contentObj.anminInstance && !contentObj.parallaxProcessed) {
                                 //标记
                                 var actName = contentObj.actName;
                                 contentObj.stopAnimations();
                                 //视觉差处理一次,停止过动画
                                 contentObj.parallaxProcessed = true;
                                 //增加标记
                                 rootNode.attr('data-parallaxProcessed', actName);
                                 //记录
                                 self.parallaxProcessedContetns[actName] = contentObj;
                             }

                             //移动视觉差对象
                             conversionTranslateX(rootNode, scope.parallax, direction, action, speed, nodes, currMoveDistance, floatMaterParallaxChange);
                         }
                     });
                 });
             }
         }

         function conversionTranslateX(rootNode, scope, direction, action, speed, nodes, currMoveDistance, floatMaterParallaxChange) {
             var translate = scope.translate,
                 offsetTranslate = scope.offsetTranslate,
                 nodes_1,
                 moveTranslate;

             //往前翻页
             if (direction === 'prev') {
                 //分割的比例
                 nodes_1 = scope.nodeProportion;
                 //如果往前溢出则取0
                 nodes = nodes == nodes_1 ? 0 : nodes_1;
             }

             //视觉对象移动的距离
             moveTranslate = self._transformConversion(translate, currMoveDistance, nodes);

             switch (action) {
                 //移动中
                 case 'flipMove':
                     moveTranslate = self._flipMove(moveTranslate, offsetTranslate);
                     break;
                 //反弹
                 case 'flipRebound':
                     moveTranslate = self._flipRebound(moveTranslate, offsetTranslate);
                     break;
                 //翻页结束,记录上一页的坐标
                 case 'flipOver':
                     if (direction === 'prev') {
                         moveTranslate = self._flipOver(moveTranslate, offsetTranslate);
                     }
                     self._overMemory(moveTranslate, offsetTranslate);
                     /**
                      * 记录浮动母版视察修改
                      * 2014.6.30针对浮动处理
                      */
                     // floatMaterParallaxChange && floatMaterParallaxChange(moveTranslate.translateX)
                     break;
             }

             //直接操作元素
             self._transformNodes(rootNode, speed, moveTranslate, offsetTranslate.opacityStart || 0);
         }
     };

     /**
      * 重新激动视觉差对象
      * 因为视察滑动对象有动画
      * 2个CSS3动画冲突的
      * 所以在视察滑动的情况下先停止动画
      * 然后给每一个视察对象打上对应的hack=>data-parallaxProcessed
      * 通过动画回调在重新加载动画
      * @return {[type]} [description]
      */
     MasterProto.reactivation = function (target) {
         if (this.parallaxProcessedContetns) {
             var actName = target.id;
             var contentObj = this.parallaxProcessedContetns[actName];
             if (contentObj) {
                 contentObj.runAnimations();
                 //视觉差处理一次,停止过动画
                 contentObj.parallaxProcessed = false;
                 //移除标记
                 target.removeAttribute('data-parallaxProcessed');
                 //记录
                 delete this.parallaxProcessedContetns[actName];
             }
         }
     };

     //变化节点的css3transform属性
     MasterProto._transformNodes = function (rootNode, speed, property, opacityStart) {
         var style = {},
             effect = '',
             x = 0,
             y = 0,
             z = 0,
             round = Math.round;

         if (property.translateX != undefined || property.translateY != undefined || property.translateZ != undefined) {
             x = round(property.translateX) || 0;
             y = round(property.translateY) || 0;
             z = round(property.translateZ) || 0;
             effect += String.format('translate3d({0}px,{1}px,{2}px) ', x, y, z);
         }

         if (property.rotateX != undefined || property.rotateY != undefined || property.rotateZ != undefined) {
             x = round(property.rotateX);
             y = round(property.rotateY);
             z = round(property.rotateZ);
             effect += x ? 'rotateX(' + x + 'deg) ' : '';
             effect += y ? 'rotateY(' + y + 'deg) ' : '';
             effect += z ? 'rotateZ(' + z + 'deg) ' : '';
         }

         if (property.scaleX != undefined || property.scaleY != undefined || property.scaleZ != undefined) {
             x = round(property.scaleX * 100) / 100 || 1;
             y = round(property.scaleY * 100) / 100 || 1;
             z = round(property.scaleZ * 100) / 100 || 1;
             effect += String.format('scale3d({0},{1},{2}) ', x, y, z);
         }

         if (property.opacity != undefined) {
             style.opacity = round(property.opacity * 100) / 100 + opacityStart;
             effect += ';';
         }

         ////////////////
         //最终改变视觉对象的坐标 //
         ////////////////
         if (effect) {
             style[prefix$5('transition-duration')] = speed + 'ms';
             style[prefix$5('transform')] = effect;
             rootNode.css(style);
         }
     };

     //针对跳转页面
     //制作处理器
     MasterProto.makeJumpPocesss = function (data) {
         var filter;
         var master = this;
         return {
             pre: function pre() {
                 var targetIndex = data.targetIndex;
                 //目标母板对象
                 var targetkey = master.conversionMasterId(targetIndex);
                 //得到过滤的边界keys
                 //在filter中的页面为过滤
                 filter = master.scanBounds(targetIndex, targetkey);
                 //清理多余母板
                 //filter 需要保留的范围
                 master.checkClear(filter, true);
                 //更新可视母板编号
                 master.currMasterId = targetkey;
             },
             //修正位置
             clean: function clean(currIndex, targetIndex) {
                 master._fixPosition(filter);
                 master._checkParallaxPox(currIndex, targetIndex);
             }
         };
     };

     //扫描边界
     //扫描key的左右边界
     //当前页面的左右边
     MasterProto.scanBounds = function (currPage, currkey) {
         var currKey = this.conversionMasterId(currPage),
             filter = {},
             i = currPage,
             prevKey,
             nextKey;

         //往前
         while (i--) {
             prevKey = this.conversionMasterId(i);
             if (prevKey && prevKey !== currkey) {
                 filter['prev'] = prevKey;
                 break;
             }
         }

         //往后
         nextKey = this.conversionMasterId(currPage + 1);

         //如果有下一条记录
         if (nextKey && nextKey !== currkey) {
             //如果不是当期页面满足范围要求
             filter['next'] = nextKey;
         }

         //当前页面
         if (currKey) {
             filter['curr'] = currKey;
         }
         return filter;
     };

     //修正位置
     MasterProto._fixPosition = function (filter) {

         var self = this;

         function setPosition(parallaxObj, position) {
             //设置移动
             function toMove(distance, speed) {
                 var element = parallaxObj.element;
                 if (element) {
                     element.css(prefix$5('transition-duration'), speed + 'ms');
                     element.css(prefix$5('transform'), 'translate3d(' + distance + 'px,0px,0px)');
                 }
             }

             if (position === 'prev') {
                 toMove(-self.screenWidth);
             } else if (position === 'next') {
                 toMove(self.screenWidth);
             } else if (position === 'curr') {
                 toMove(0);
             }
         }

         for (var key in filter) {
             switch (key) {
                 case 'prev':
                     setPosition(this.abstractGetPageObj(filter[key]), 'prev');
                     break;
                 case 'curr':
                     setPosition(this.abstractGetPageObj(filter[key]), 'curr');
                     break;
                 case 'next':
                     setPosition(this.abstractGetPageObj(filter[key]), 'next');
                     break;
             }
         }
     };

     MasterProto._checkParallaxPox = function (currPageIndex, targetIndex) {
         var key,
             pageObj,
             pageCollection = this.abstractGetCollection();
         for (key in pageCollection) {
             pageObj = pageCollection[key];
             //跳跃过的视觉容器处理
             this._fixParallaxPox(pageObj, currPageIndex, targetIndex);
         }
     };

     //=======================去重检测==============================

     //当前同一视觉页面作用的范围
     MasterProto._toRepeat = function (reuseMasterKey, pageIndex) {
         var temp;
         if (temp = this.recordMasterscope[reuseMasterKey]) {
             return temp;
         }
         return false;
     };

     //更新母板作用域范围
     //recordMasterscope:{
     //	 9001-1:[0,1], master 对应记录的页码
     //	 9002-1:[2,3]
     //	 9001-2:[4,5]
     //}
     MasterProto._updataMasterscope = function (reuseMasterKey, pageIndex) {
         var scope;
         if (scope = this.recordMasterscope[reuseMasterKey]) {
             if (-1 === scope.indexOf(pageIndex)) {
                 scope.push(pageIndex);
             }
         } else {
             this.recordMasterscope[reuseMasterKey] = [pageIndex];
         }
     };

     //记录页面与模板标示的映射
     MasterProto._updatadParallaxMaster = function (reuseMasterKey, pageIndex) {
         //记录页面与模板标示的映射
         this.recordMasterId[pageIndex] = reuseMasterKey;
         //更新可视区母板的编号
         this.currMasterId = this.conversionMasterId(Xut.Presentation.GetPageIndex());
     };

     //检测是否需要创建视觉差
     MasterProto._checkRepeat = function (reuseMasterKey, pageOffset, pageIndex) {
         var tag = this._toRepeat(reuseMasterKey, pageIndex); //false就是没找到视察对象
         this._updataMasterscope(reuseMasterKey, pageIndex);
         this._updatadParallaxMaster(reuseMasterKey, pageIndex);
         return tag;
     };

     //transform转化成相对应的偏移量
     MasterProto._transformConversion = function (property, moveDistance, nodes) {
         var temp = {},
             i;

         for (i in property) {
             switch (i) {
                 case 'translateX':
                 case 'translateZ':
                     temp[i] = moveDistance * nodes * property[i];
                     break;
                 case 'translateY':
                     temp[i] = moveDistance * (this.screenHeight / this.screenWidth) * nodes * property[i];
                     break;
                 case 'opacityStart':
                     temp[i] = property.opacityStart;
                     break;
                 default:
                     //乘以-1是为了向右翻页时取值为正,位移不需这样做
                     temp[i] = -1 * moveDistance / this.screenWidth * property[i] * nodes;
             }
         }
         return temp;
     };

     //移动叠加值
     MasterProto._flipMove = function (property, repairProperty) {
         var temp = {};
         var start = property.opacityStart;
         for (var i in property) {
             temp[i] = property[i] + repairProperty[i];
         }
         if (start > -1) temp.opacityStart = start;
         return temp;
     };

     //反弹
     MasterProto._flipRebound = function (property, repairProperty) {
         var temp = {};
         for (var i in property) {
             temp[i] = repairProperty[i] || property[i];
         }
         return temp;
     };

     //翻页结束
     MasterProto._flipOver = function (property, repairProperty) {
         return this._flipMove(property, repairProperty);
     };

     //结束后缓存上一个记录
     MasterProto._overMemory = function (property, repairProperty) {
         for (var i in property) {
             repairProperty[i] = property[i];
         }
     };

     //修正跳转后视觉对象坐标
     MasterProto._fixParallaxPox = function (parallaxObj, currPageIndex, targetIndex) {
         var self = this,
             contentObjs,
             prevNodes,
             nodes;
         if (contentObjs = parallaxObj.baseGetContent()) {
             contentObjs.forEach(function (contentObj) {
                 contentObj.eachAssistContents(function (scope) {
                     if (scope.parallax) {
                         repairNodes.call(self, scope.parallax, currPageIndex, targetIndex);
                     }
                 });
             });
         }

         function repairNodes(scope, currPageIndex, targetIndex) {
             var rangePage = scope.calculateRangePage(),
                 rootNode = scope.rootNode,
                 translate = scope.translate,
                 offsetTranslate = scope.offsetTranslate,
                 moveTranslate,
                 nodes = Xut.Presentation.GetPageNode(targetIndex - 1);

             if (targetIndex > currPageIndex) {
                 //next
                 if (targetIndex > rangePage['end']) {
                     nodes = 1;
                 }
             } else {
                 //prev
                 if (targetIndex < rangePage['start']) {
                     nodes = 0;
                 }
             }

             moveTranslate = this._transformConversion(translate, -self.screenWidth, nodes);
             this._transformNodes(rootNode, 300, moveTranslate, offsetTranslate.opacityStart);
             this._overMemory(moveTranslate, offsetTranslate);
         }
     };

     //扁平化对象到数组
     function toArray$1(filter) {
         var arr = [];
         if (!filter.length) {
             for (var key in filter) {
                 arr.push(filter[key]);
             }
             filter = arr;
         }
         return filter;
     }

     //检测是否需要清理
     // 1 普通翻页清理  【数组过滤条件】
     // 2 跳转页面清理  【对象过滤条件】
     MasterProto.checkClear = function (filter, toPage) {
         var key,
             indexOf,
             removeMasterId = _.keys(this.abstractGetCollection());

         // 如果有2个以上的母板对象,就需要清理
         if (removeMasterId.length > 2 || toPage) {
             //或者是跳转页面
             //解析对象
             filter = toArray$1(filter);
             //过滤
             _.each(filter, function (masterId) {
                 if (masterId !== undefined) {
                     indexOf = removeMasterId.indexOf(masterId.toString());
                     if (-1 !== indexOf) {
                         //过滤需要删除的对象
                         removeMasterId.splice(indexOf, 1);
                     }
                 }
             });
             this.clearMemory(removeMasterId);
         }
     };

     //清理内存
     //需要清理的key合集
     MasterProto.clearMemory = function (removeMasterId) {
         var pageObj,
             self = this;
         _.each(removeMasterId, function (removekey) {
             //销毁页面对象事件
             if (pageObj = self.abstractGetPageObj(removekey)) {
                 //移除事件
                 pageObj.baseDestroy();
                 //移除列表
                 self.abstractRemoveCollection(removekey);
                 self.removeRecordMasterscope(removekey);;
             }
             //清理作用域缓存
             delete self.recordMasterscope[removekey];
         });
     };

     //注册状态管理
     MasterProto.register = function (pageIndex, type, hotspotObj) {
         var parallaxObj;
         if (parallaxObj = this.abstractGetPageObj(this.conversionMasterId(pageIndex))) {
             parallaxObj.registerCotents.apply(pageObj, arguments);
         }
     };

     //=======================工具方法==============================

     //page转化成母版ID
     MasterProto.conversionMasterId = function (pageIndex) {
         return this.recordMasterId ? this.recordMasterId[pageIndex] : undefined;
     };

     MasterProto.removeRecordMasterscope = function (removekey) {
         var me = this;
         var recordMasterscope = me.recordMasterscope[removekey];
         //清理页码指示标记
         recordMasterscope.forEach(function (scope) {
             delete me.recordMasterId[scope];
         });
     };

     //混入抽象接口方法
     extend(MasterMgr, Abstract);

     /**
      * 数据查询
      * @type {Object}
      */
     var Store = {

         statement: {},

         /**
          * novel表ID
          * @type {[type]}
          */
         novelId: null,

         /**
          * ppt总数
          * @type {Number}
          */
         count: 0,

         /**
          * 不存在的数据库表
          * @type {Array}
          */
         collectError: []
     };

     //热点合集
     var dataRet = {};

     'Setting,Parallax,Master,Activity,Content,Video,Image,Action,Animation,Widget,Novel,Season,Chapter'.replace(/[^, ]+/g, function (name) {
         Store.statement[name] = 'select * FROM ' + name + ' order by _id ASC';
     });

     /**
      * 查询单一的数据
      * @return {[type]} [description]
      */
     Store.oneQuery = function (tableName, callback) {
         execute('select * FROM ' + tableName + ' order by _id ASC', function (sqlRet, collectError) {
             callback(sqlRet);
         });
     };

     /**
      * 查询总数据
      */
     Store.query = function () {
         var i,
             self = this;
         return $.Deferred(function (dfd) {
             //数据库表重复数据只查询一次
             if (Object.keys(dataRet).length) {
                 dfd.resolve(dataRet);
                 return;
             }
             //ibook模式，数据库外部注入的
             if (Xut.IBooks.CONFIG) {
                 // self.collectError = collectError;
                 dfd.resolve(Xut.IBooks.CONFIG.data);
             } else {
                 //查询所有数据
                 execute(Store.statement, function (sqlRet, collectError) {
                     for (i in sqlRet) {
                         dataRet[i] = sqlRet[i];
                     }
                     dfd.resolve(dataRet);
                 });
             }
         }).promise();
     };

     /**
      * 删除数据
      * @type {[type]}
      */
     Store.remove = function (tableName, id) {
         var i,
             self = this;
         var sql = 'delete from ' + tableName + ' where _id = ' + id;
         return $.Deferred(function (dfd) {
             //查询所有数据
             execute(sql, function (success, failure) {
                 if (success) {
                     //成功回调
                     dfd.resolve();
                 } else if (failure) {
                     //失败回调
                     dfd.reject();
                 }
             });
         }).promise();
     };

     //数据缓存
     var dataCache = void 0;
     //带有场景信息存数
     var sectionRelated = void 0;
     //音频的ActivityId信息;
     var videoActivityIdCache = void 0;

     //混入数据到data中
     function mixToData(collections) {
         Xut.data = dataCache = collections;
     }

     //计算数据偏移量
     function dataOffset(tableName) {
         var start,
             data = dataCache[tableName];
         if (data.length) {
             if (data.item(0)) {
                 if (start = data.item(0)._id) {
                     dataCache[tableName].start = start;
                 }
             }
         }
     }

     //转化video的activtiy信息
     //因为Video不是靠id关联的 是靠activtiy关联
     function videoActivity() {
         var d,
             activityIds = {},
             data = dataCache.Video;
         _.each(data, function (_, index) {
             d = data.item(index);
             if (d && d.activityId) {
                 //确保activityIdID是有值，这样才是靠activity关联的video,而不是动画的video
                 activityIds[d.activityId] = d._id;
             }
         });
         return activityIds;
     }

     //chpater分段
     //转化section信息
     //带有场景处理
     function conversionSectionRelated() {
         var seasonId,
             start,
             length,
             sid,
             i,
             id,
             seasonInfo,
             toolbar,
             Chapters,
             container = {},
             Chapter = dataCache.Chapter,
             l = Chapter.length,
             end = 0;

         //找到指定的season信息
         var findSeasonInfo = function findSeasonInfo(seasonId) {
             var temp,
                 seasonNum = dataCache.Season.length;
             while (seasonNum--) {
                 if (temp = dataCache.Season.item(seasonNum)) {
                     if (temp._id == seasonId) {
                         return temp;
                     }
                 }
             }
         };

         for (i = 0; i < l; i++) {
             Chapters = Chapter.item(i);
             if (Chapters) {
                 id = Chapters._id - 1; //保存兼容性,用0开头
                 seasonId = Chapters.seasonId;
                 sid = 'seasonId->' + seasonId;
                 //如果不在集合,先创建
                 if (!container[sid]) {
                     //场景工具栏配置信息
                     if (seasonInfo = findSeasonInfo(seasonId)) {
                         toolbar = seasonInfo.parameter;
                     }
                     container[sid] = {
                         start: id,
                         length: 1,
                         end: id,
                         toolbar: toolbar
                     };
                 } else {
                     container[sid].end = id;
                     container[sid].length = container[sid].length + 1;
                 }
             }
         }

         return container;
     }

     //转化数据结构
     function conversion() {

         //数据段标记
         for (var k in dataCache) {
             if (dataCache[k].item) {
                 dataOffset(k);
             }
         }

         //============数据特殊处理================

         //vidoe特殊处理，需要记录chapterId范围
         if (dataCache.Video) {
             videoActivityIdCache = videoActivity();
         }

         /**
          * 带有场景处理
          * @type {[type]}
          */
         sectionRelated = conversionSectionRelated();

         /**
          * 标记应用ID
          * @type {[type]}
          */
         dataCache.novelId = Store.novelId;

         /**
          * 针对数据库content为空的处理
          * @return {[type]} [description]
          */
         dataCache.preventContent = function () {
             return dataCache.Content.length ? false : true;
         }();

         //===============================================
         // 
         //  查询数据接口
         //
         //  1 video表传递是activityId关联
         //  2 其余表都是传递当前表的id
         //  type 查询ID的类型, 数据的id或者activityId
         //  callback 提供给chapterId使用
         //================================================

         /**
          * 通过ID查询方式
          * @param  {[type]}  tableName [description]
          */
         dataCache.query = function (tableName, id, type, callback) {
             /**
              * 特殊的字段关联
              * 1 activityId
              * 2 chpaterId
              */
             switch (type) {
                 /**
                  * 通过activityId查询的方式
                  *
                  * 表名,ID,类型
                  * Xut.data.query('Action', id, 'activityId');
                  *   
                  * @type {[type]}
                  */
                 case 'activityId':
                     var item;
                     var activityId = id;
                     var data = dataCache[tableName];
                     for (var i = 0, len = data.length; i < len; i++) {
                         item = data.item(i);
                         if (item) {
                             if (item[type] == activityId) {
                                 return item;
                             }
                         }
                     }
                     return;

                 /**
                  * 通过chpaterId查询方式
                  * parser中的scanActivity过滤处理
                  */
                 case 'chapterId':
                 case 'seasonId':
                     var chapterId = id;
                     var data = dataCache[tableName];
                     if (data) {
                         var item;
                         for (var i = 0, len = data.length; i < len; i++) {
                             item = data.item(i);
                             if (item) {
                                 if (item[type] == chapterId) {
                                     callback && callback(item);
                                 }
                             }
                         }
                     }
                     return;
             }

             /**
              * 通过id查询的方式
              */
             switch (tableName) {
                 //////////////////////////
                 //获取整个一个用的chapter数据 //
                 //////////////////////////
                 case 'appPage':
                     return dataCache.Chapter;

                 //////////////////////////
                 //获取整个一个用的Section数据 //
                 //////////////////////////
                 case 'appSection':
                     return dataCache.Season;

                 //////////////////////
                 //如果是是section信息 //
                 //////////////////////
                 case 'sectionRelated':
                     return sectionRelated['seasonId->' + id];

                 //////////////
                 //如果是音频 //
                 //////////////
                 case 'Video':
                     if (type) {
                         return Query();
                     } else {
                         //传递的id是activityId
                         var id = videoActivityIdCache[id];
                         return dataCache.query('Video', id, true);
                     }

                 default:
                     /////////////////
                     //默认其余所有表 //
                     /////////////////
                     return Query();
             }

             //数据信息
             function Query() {
                 var data = dataCache[tableName];
                 if (id) {
                     var index = id - data.start;
                     return data.item(index);
                 } else {
                     return data.length ? data.item(0) : null;
                 }
             }
         };

         /**
          * 针对动态表查询
          * 每次需要重新取数据
          * Xut.data.oneQuery('Image',function(){});
          * @return {[type]} [description]
          */
         dataCache.oneQuery = function (tableName, callback) {
             Store.oneQuery(tableName, function (data) {
                 callback && callback(data);
             });
         };

         /**
          * 删除数据
          * 表名,表ID
          * @return {[type]} [description]
          */
         dataCache.remove = function (tableName, id, success, failure) {
             var dfd = Store.remove(tableName, id);
             dfd.done(success, failure);
         };
     }

     /**
      * 返回错误的表
      * @return {[type]} [description]
      */
     function errorTable() {
         return Store.collectError;
     }

     /**
      *     初始化数据类
         获取ppt总数
      * @return {[type]} [description]
      */
     function createStore() {
         return $.Deferred(function (dfd) {
             Store.query().done(function (data) {
                 var novel = data.Novel;
                 //novel的id
                 var novelId = Store.novelId = novel.item(0)['_id'];
                 //数据转换
                 mixToData(data);
                 //转化数据结构
                 conversion();
                 //数据缓存已存在
                 // storeMgr.dataCache = true
                 dfd.resolve(data.Setting, novel.item(0));
             });
         }).promise();
     }

     /**
      * 页面切换逻辑
      * @param  {[type]} ) [description]
      * @return {[type]}   [description]
      */

     /**
      * 跳转之前提高层级问题
      * @return {[type]}          [description]
      */
     function prev(complier, data) {
         var currIndex = data.currIndex;
         //跳转之前提高层级问题
         complier.pageMgr.abstractAssistPocess(currIndex, function (pageObj) {
             pageObj.element.css({
                 'z-index': 9997
             });
         });
         //提高母版层级
         complier.callMasterMgr(function () {
             this.abstractAssistPocess(currIndex, function (pageObj) {
                 pageObj.element.css({
                     'z-index': 1
                 });
             });
         });
     }

     //处理跳转逻辑
     function calculateFlip(complier, data, createCallback) {
         //缓存当前页面索引用于销毁
         var pageIndex,
             i = 0,
             collectContainers = [],
             create = data.create,
             targetIndex = data.targetIndex;

         //需要创建的页面闭包器
         for (; i < create.length; i++) {
             pageIndex = create[i];
             collectContainers.push(function (targetIndex, pageIndex) {
                 return function (callback) {
                     //创建新结构
                     complier.create([pageIndex], targetIndex, 'toPage', callback, {
                         'opacity': 0 //同页面切换,规定切换的样式
                     });
                 };
             }(targetIndex, pageIndex));
         }

         /**
          * 二维数组保存，创建返回的对象
          * 1 page对象
          * 2 母版对象
          * @type {Array}
          */
         data.pageBaseCollect = [];

         var i = 0,
             collectLength,
             count,
             count = collectLength = collectContainers.length;

         if (collectContainers && collectLength) {
             for (; i < collectLength; i++) {
                 //收集创建的根节点,异步等待容器的创建
                 collectContainers[i].call(complier, function (callbackPageBase) {
                     if (count === 1) {
                         collectContainers = null;
                         setTimeout(function () {
                             createCallback(data);
                         }, 100);
                     }
                     //接受创建后返回的页面对象
                     data.pageBaseCollect.push(callbackPageBase);
                     count--;
                 });
             }
         }
     }

     //节点创建完毕后，切换页面动，执行动作
     function createContainerView(complier, data) {

         var prveHindex = data.currIndex;
         var pageMgr = complier.pageMgr;

         //停止当前页面动作
         complier.suspend({
             'stopPointer': prveHindex
         });

         //========处理跳转中逻辑=========

         /**
          * 清除掉不需要的页面
          * 排除掉当前提高层次页面
          */
         _.each(data['destroy'], function (destroyIndex) {
             if (destroyIndex !== data.currIndex) {
                 pageMgr.clearPage(destroyIndex);
             }
         });

         //修正翻页2页的页面坐标值
         _.each(data['ruleOut'], function (pageIndex) {
             if (pageIndex > data['targetIndex']) {
                 pageMgr.abstractAssistAppoint(pageIndex, function (pageObj) {
                     Translation.fix.call(pageObj, 'nextEffect');
                 });
             }
             if (pageIndex < data['targetIndex']) {
                 pageMgr.abstractAssistAppoint(pageIndex, function (pageObj) {
                     Translation.fix.call(pageObj, 'prevEffect');
                 });
             }
         });

         var jumpPocesss;

         //母版
         complier.callMasterMgr(function () {
             jumpPocesss = this.makeJumpPocesss(data);
             jumpPocesss.pre();
         });

         //===========跳槽后逻辑========================
         pageMgr.clearPage(prveHindex);

         jumpPocesss && jumpPocesss.clean(data.currIndex, data.targetIndex);

         /**
          * 同页面切换,规定切换的样式复位
          * @param  {[type]} pageBase [description]
          * @return {[type]}          [description]
          */
         _.each(data.pageBaseCollect, function (pageBase) {
             _.each(pageBase, function (pageObj) {
                 pageObj.element && pageObj.element.css({
                     'opacity': 1
                 });
             });
         });

         data.pageBaseCollect = null;
         jumpPocesss = null;
     }

     function SwitchPage(complier, data, success) {
         //跳前逻辑
         prev(complier, data);
         //处理逻辑
         calculateFlip(complier, data, function (data) {
             createContainerView(complier, data);
             success.call(complier, data);
         });
     }

     //判断是否能整除2
     function offsetPage(num) {
         return num % 2 == 0 ? 'left' : 'right';
     }

     //如果是场景加载，转化页码数
     //转化按0开始
     //pageIndex 页码
     //visiblePid 可见页面chpaterId
     function conversionPageOpts(pageIndex, visiblePid) {
         var sectionRang;
         //转化可视区域值viewPageIndex
         if (this.options.multiScenario) {
             sectionRang = this.options.sectionRang;
             //如果传入的是数据
             if (!visiblePid && _.isArray(pageIndex)) {
                 pageIndex.forEach(function (ele, index) {
                     pageIndex.splice(index, 1, ele - sectionRang.start);
                 });
                 return pageIndex;
             }
             pageIndex -= sectionRang.start;
             visiblePid += sectionRang.start;
         } else {
             //pageIndex是数组，并且realPage为空
             if (_.isArray(pageIndex)) {
                 return pageIndex;
             }
         }

         return {
             'pageIndex': pageIndex,
             'visiblePid': visiblePid
         };
     }

     ///////////
     //计算翻页距离 //
     ///////////
     function calculateDistance(action, distance, direction) {
         var leftOffset, currOffset, rightOffset;

         //保持缩放比,计算缩放比情况下的转化
         var calculateContainer = Xut.config.proportion.calculateContainer();
         var containerWidth = calculateContainer.width;

         switch (direction) {
             //前翻
             case 'prev':
                 switch (action) {
                     case 'flipMove':
                         leftOffset = distance - containerWidth;
                         currOffset = distance;
                         rightOffset = distance + containerWidth;
                         break;
                     case 'flipRebound':
                         leftOffset = -containerWidth;
                         currOffset = distance;
                         rightOffset = containerWidth;
                         break;
                     case 'flipOver':
                         leftOffset = 0;
                         currOffset = containerWidth;
                         rightOffset = 2 * containerWidth;
                         break;
                 }
                 break;
             //后翻
             case 'next':
                 switch (action) {
                     case 'flipMove':
                         leftOffset = distance - containerWidth;
                         rightOffset = distance + containerWidth;
                         currOffset = distance;
                         break;
                     case 'flipRebound':
                         leftOffset = -containerWidth;
                         rightOffset = containerWidth;
                         currOffset = distance;
                         break;
                     case 'flipOver':
                         leftOffset = -2 * containerWidth;
                         rightOffset = distance;
                         currOffset = -containerWidth;
                         break;
                 }
                 break;
         }

         return [leftOffset, currOffset, rightOffset];
     }

     ////////////
     //计算初始化页码 //
     ////////////
     function calculatePointer(targetIndex, pageTotal, multiplePages) {

         var leftscope = 0,
             pagePointer = {},
             createPointer = [];

         function setValue(index) {
             if (index.leftIndex !== undefined) {
                 pagePointer.leftIndex = index.leftIndex;
                 createPointer.push(index.leftIndex);
             }
             if (index.currIndex !== undefined) {
                 pagePointer.currIndex = index.currIndex;
                 createPointer.push(index.currIndex);
             }
             if (index.rightIndex !== undefined) {
                 pagePointer.rightIndex = index.rightIndex;
                 createPointer.push(index.rightIndex);
             }
         }

         //如果只有一页 or  非线性,只创建一个页面
         if (pageTotal === 1 || !multiplePages) {
             setValue({
                 'currIndex': targetIndex
             });
         } else {
             //多页情况
             if (targetIndex === leftscope) {
                 //首页
                 setValue({
                     'currIndex': targetIndex,
                     'rightIndex': targetIndex + 1
                 });
             } else if (targetIndex === pageTotal - 1) {
                 //尾页
                 setValue({
                     'currIndex': targetIndex,
                     'leftIndex': targetIndex - 1
                 });
             } else {
                 //中间页
                 setValue({
                     'currIndex': targetIndex,
                     'leftIndex': targetIndex - 1,
                     'rightIndex': targetIndex + 1
                 });
             }
         }

         this.pagePointer = pagePointer;

         return createPointer;
     }

     //保证可视页面第一个分解
     //createPage 需要创建的页面 [0,1,2]
     //visualPage 可视区页面       [1]
     function conversionCid(createPage, visualPage) {

         var indexOf, start, less;

         //如果第一个不是可视区域
         //切换位置
         //加快创建速度
         if (createPage[0] !== visualPage) {
             indexOf = createPage.indexOf(visualPage), less = createPage.splice(indexOf, 1), createPage = less.concat(createPage);
         }

         //场景加载模式,计算正确的chapter顺序
         //多场景的模式chpater分段后
         //叠加起始段落
         if (this.options.multiScenario) {
             //需要提前解析数据库的排列方式
             //chpater的开始位置
             start = this.options.sectionRang.start;
             //拼接位置
             createPage.forEach(function (page, index) {
                 createPage.splice(index, 1, page + start);
             });
         }

         // [0,1,2] => [73,74,75]
         return createPage;
     }

     //页码转化成相对应的chpater表数据
     function conversionPids(createPage) {
         return query('chapter', createPage);
     }

     //检测是否构建母板模块处理
     function checkMasterCreate() {
         var table = errorTable();
         //如果没有Master数据,直接过滤
         if (-1 !== table.indexOf('Master') || !Xut.data['Master'] || !Xut.data['Master'].length) {
             return false;
         }
         return true;
     }

     ////////
     //调度器 //
     ////////
     function Scheduler(vm) {

         this.vm = vm;
         this.options = vm.options;

         /**
          * 创建前景页面管理模块
          * @type {PageMgr}
          */
         this.pageMgr = new PageMgr(vm);

         /**
          * 检测是否需要创母版模块
          * @return {[type]} [description]
          */
         if (checkMasterCreate()) {
             this.masterMgr = new MasterMgr(vm);
         }
     };

     var SchedulerProto = Scheduler.prototype;

     /**
      * 初始化页面创建
      * 因为多个页面的问题，所以不是创建调用
      * 统一回调
      * @return {[type]} [description]
      */
     SchedulerProto.initCreate = function () {
         var options = this.options;
         /**
          * 初始化构建页面
          */
         this.create(calculatePointer.call(this, options.initIndex, options.pagetotal, options.multiplePages), options.initIndex, 'init');
     };

     /**
      *  创建普通页面
      *  创建母版页面
      *  createPointer  需要创建的页面索引
      *  visiblePage       当前可视区页面索引
      *  action         toPage/init/flipOver
      *  toPageCallback 跳转页面支持回调通知
      *  userStyle      规定创建的style属性
      **/
     SchedulerProto.create = function (createPage, visiblePage, action, toPageCallback, userStyle) {

         //2016.1.20
         //修正苗苗学问题 确保createPage不是undefined
         if (void 0 === createPage[0]) {
             return;
         }

         // console.debug('当前页面:' + this.pagePointer.currIndex + ',创建新页面:"'+ createPointer + '",动作:' +action)
         var createPid,
             pageBase,
             visiblePid,
             pageIndex,
             conversion,
             newCreate,
             callbackAction,
             virtualMode = Xut.config.virtualMode,
             self = this,
             multiplePages = this.options.multiplePages,
             //是否线性
         total = createPage.length,
             toPageAction = action === 'toPage',
             //如果是跳转
         filpOverAction = action === 'flipOver',
             //如果是翻页

         //使用第一个是分解可见页面
         //将页码pageIndex转化成对应的chapter
         createPids = conversionCid.call(this, createPage, visiblePage),


         //收集创建的页面对象
         //用于处理2个页面在切换的时候闪屏问题
         //主要是传递createStyle自定义样式的处理
         collectCreatePageBase = [],


         //是否触发母版的自动时间
         //因为页面每次翻页都会驱动auto事件
         //但是母版可能是共享的
         createMaster = false,


         //收集完成回调
         collectCallback = function () {
             //收集创建页码的数量
             var createContent = 0;
             return function (callback) {
                 ++createContent;
                 if (createContent === total) {
                     callback();
                 }
             };
         }(),


         //构建执行代码
         callbackAction = {
             //初始化
             init: function init() {
                 collectCallback(function () {
                     self.loadPage('init');
                 });
             },
             //翻页
             flipOver: function flipOver() {
                 collectCallback(function () {
                     self.autoRun({ //翻页
                         'createPointer': createPids,
                         'createMaster': createMaster
                     });
                 });
             },
             //跳转
             toPage: function toPage() {
                 collectCallback(function () {
                     toPageCallback(collectCreatePageBase);
                 });
             }
         };

         ////////////////////
         //pid=>chpterData //
         ////////////////////
         var results = conversionPids(createPids);

         ////////////
         //如果是最后一页 //
         //没有对应的虚拟数据，取前一页的
         ////////////
         if (virtualMode && !results.length) {
             var virtualPid = _.extend([], createPids);
             createPids.forEach(function (pid, index) {
                 virtualPid.splice(index, 1, --pid);
             });
             results = conversionPids(virtualPid);
         }

         //页码转成数据
         _.each(results, function (chapterData, index) {

             //转化值
             //chapterId => createPid
             createPid = createPids[index];

             //createPid
             //pageIndex
             conversion = conversionPageOpts.call(self, createPid, visiblePage);
             visiblePid = conversion.visiblePid;
             pageIndex = conversion.pageIndex;

             ////////////////
             // 如果启动了虚拟页面模式 //
             ////////////////
             var virtualPid = false; //虚拟页面的pid编号
             var virtualOffset = false; //页面坐标left,right
             if (virtualMode) {

                 //获取新的chpater数据

                 var fixCids = function fixCids(originalIndex) {
                     var originalPid = conversionCid.call(self, [originalIndex]);
                     return conversionPids([originalPid])[0];
                 };

                 ////////////
                 //如果是翻页创建 //
                 //由于是拼接的所以chapter移位了
                 ////////////


                 //页面位置
                 virtualOffset = offsetPage(pageIndex);if (virtualOffset === 'left') {
                     chapterData = fixCids(pageIndex / 2);
                 }
                 //修正右边chapter
                 if (virtualOffset === 'right') {
                     chapterData = fixCids((pageIndex - 1) / 2);
                 }
             }

             if (total === 1) {
                 self.options.chapterId = chapterData._id;
             }

             //构件新的页面
             //masterFilter 母板过滤器回调函数
             newCreate = function newCreate(masterFilter) {

                 //跳转的时候，创建新页面可以自动样式信息
                 //优化设置，只是改变当前页面即可
                 if (toPageAction && visiblePid !== createPid) {
                     userStyle = undefined;
                 }

                 var dataOpts = {
                     'pageIndex': pageIndex,
                     'multiplePages': multiplePages,
                     'pid': createPid, //页码chapterId
                     'chapterDas': chapterData, //当前页面的chpater数据
                     'visiblePid': visiblePid, //实际中页面显示的索引
                     'userStyle': userStyle,
                     'virtualPid': virtualPid, //pid
                     'virtualOffset': virtualOffset //虚拟页面位置
                 };

                 //初始化构建页面对象
                 //page
                 //master
                 pageBase = this.create(dataOpts, pageIndex, masterFilter);

                 //构建页面对象后
                 //开始执行
                 if (pageBase) {
                     //开始线程任务
                     //当为滑动模式,支持快速创建
                     pageBase.startThreadTask(filpOverAction, function () {
                         // console.log('创建完毕************** ' + (createPid+1) +' '+ action)
                         callbackAction[action]();
                     });
                     //收集自定义样式的页面对象
                     if (userStyle) {
                         collectCreatePageBase.push(pageBase);
                     }
                 }
             };

             //母版层
             if (chapterData.pptMaster && self.masterMgr) {
                 newCreate.call(self.masterMgr, function () {
                     //母版是否创建等待通知
                     //母版是共享的所以不一定每次翻页都会创建
                     //如果需要创建,则叠加总数
                     ++total;
                     createMaster = true;
                 });
             }

             //页面层
             newCreate.call(self.pageMgr);
         });
     };

     /**
      * 滑动处理
      *  1 滑动
      *  2 反弹
      *  3 翻页
      */
     SchedulerProto.move = function (data) {

         //动作
         var action = data.action;

         //用户强制直接切换模式
         //禁止页面跟随滑动
         if (this.options.pageFlip && action == 'flipMove') {
             return;
         }

         var speed = data.speed;
         var distance = data.distance;
         var leftIndex = data.leftIndex;
         var currIndex = data.pageIndex;
         var rightIndex = data.rightIndex;
         var direction = data.direction;
         //移动的距离
         var moveDistance = calculateDistance(action, distance, direction);
         //视觉差页面滑动
         var nodes = this.pageMgr.abstractGetPageObj(currIndex)['chapterDas']['nodes'];

         ///////
         //页面改变 //
         ///////
         //通知page模块
         this.pageMgr.move(leftIndex, currIndex, rightIndex, direction, speed, action, moveDistance);

         //通知视觉差模块
         this.callMasterMgr(function () {
             this.move(leftIndex, currIndex, rightIndex, direction, moveDistance, action, speed, nodes);
         });

         //更新页码标示
         'flipOver' === action && setTimeout(function () {
             this.vm.$emit('change:pageUpdate', direction === 'next' ? rightIndex : leftIndex);
         }.bind(this), 0);
     };

     /**
      * 翻页松手后
      * 暂停页面的各种活动动作
      * @param  {[type]} pointers [description]
      * @return {[type]}          [description]
      */
     SchedulerProto.suspend = function (pointers) {
         //关闭层事件
         this.pageMgr.suspend(pointers);
         this.callMasterMgr(function () {
             this.suspend(pointers);
         });
         //目录栏
         _close();
         //复位工具栏
         this.vm.$emit('change:resetToolbar');
     };

     /**
      * 翻页动画完毕后
      * @return {[type]}              [description]
      */
     SchedulerProto.complete = function (direction, pagePointer, unfliplock, isQuickTurn) {
         //方向
         this.direction = direction;
         //是否快速翻页
         this.isQuickTurn = isQuickTurn || false;
         //解锁
         this.unfliplock = unfliplock;
         //清理上一个页面
         this._clearPage(pagePointer.destroyPointer);
         this._updatePointer(pagePointer);
         //预创建下一页
         this._advanceCreate(direction, pagePointer);
     };

     //清理页面结构
     SchedulerProto._clearPage = function (clearPageIndex) {
         this.pageMgr.clearPage(clearPageIndex);
     };

     //更新页码索引标示
     SchedulerProto._updatePointer = function (pagePointer) {
         this.pagePointer = pagePointer;
     };

     //预创建新页面
     SchedulerProto._advanceCreate = function (direction, pagePointer) {
         var pagetotal = this.options.pagetotal,
             vm = this.vm,
             createPointer = pagePointer.createPointer,
             destroyPointer = pagePointer.destroyPointer,

         //清理页码
         clear = function clear() {
             delete pagePointer.createPointer;
             delete pagePointer.destroyPointer;
         },

         //创建新的页面对象
         createNextContainer = function createNextContainer(createPointer, currIndex) {
             this.create([createPointer], currIndex, 'flipOver');
         };

         //如果是右边翻页
         if (direction === 'next') {
             //首尾无须创建页面
             if (pagePointer.currIndex === pagetotal - 1) {
                 this.autoRun();
                 //如果总数只有2页，那么首页的按钮是关闭的，需要显示
                 if (pagetotal == 2) {
                     vm.$emit('change:showPrev');
                 }
                 //多页处理
                 vm.$emit('change:hideNext');
                 return;
             }
             if (createPointer < pagetotal) {
                 //创建的页面
                 createNextContainer.call(this, createPointer, pagePointer.currIndex);
                 clear();
                 vm.$emit('change:showPrev');
                 return;
             }
         }

         //如果是左边翻页
         if (direction === 'prev') {
             //首尾无须创建页面
             if (pagePointer.currIndex === 0) {
                 this.autoRun();
                 //如果总数只有2页，那么首页的按钮是关闭的，需要显示
                 if (pagetotal == 2) {
                     vm.$emit('change:showNext');
                 }
                 vm.$emit('change:hidePrev');
                 return;
             }
             if (pagePointer.currIndex > -1) {
                 //创建的页面
                 createNextContainer.call(this, createPointer, pagePointer.currIndex);
                 clear();
                 vm.$emit('change:showNext');
                 return;
             }
         }

         clear();

         return;
     };

     /**
      * 自动运行处理
      *  流程四:执行自动触发动作
      *   1.初始化创建页面完毕
      *   2.翻页完毕
      */
     SchedulerProto.autoRun = function (para) {
         var options = this.options,
             pagePointer = this.pagePointer,
             prevIndex = pagePointer.leftIndex,
             currIndex = pagePointer.currIndex,
             nextIndex = pagePointer.rightIndex,
             action = para ? para.action : '',
             createPointer = para ? para.createPointer : '',
             direction = this.direction,

         //暂停的页面索引autorun
         suspendIndex = action === 'init' ? '' : direction === 'next' ? prevIndex : nextIndex;

         /**
          * 存在2中模式的情况下
          * 转化页码标记
          */
         if (createPointer) {
             createPointer = conversionPageOpts.call(this, createPointer);
         }

         var data = {
             'prevIndex': prevIndex,
             'currIndex': currIndex,
             'nextIndex': nextIndex,
             'suspendIndex': suspendIndex,
             'createPointer': createPointer,
             'direction': direction,
             'isQuickTurn': this.isQuickTurn,
             //中断通知
             'suspendCallback': options.suspendAutoCallback,
             //构建完毕通知
             'buildComplete': function buildComplete(scenarioId) {
                 //==========================================
                 //
                 //      构建完成通知,用于处理历史缓存记录
                 //      如果是调试模式
                 //      && 不是收费提示页面
                 //      && 多场景应用
                 //
                 //==========================================
                 if (Xut.config.recordHistory && !options.isInApp && options.multiScenario) {
                     var history;
                     if (history = Xut.sceneController.sequence(scenarioId, currIndex)) {
                         _set("history", history);
                     }
                 }
             },

             //流程结束通知
             //包括动画都已经结束了
             'processComplete': function processComplete() {}
         };

         //页面自动运行
         this.pageMgr.autoRun(data);

         //模板自动运行
         this.callMasterMgr(function () {
             //如果动作是初始化，或者触发了母版自动运行
             //如果是越界处理
             //console.log(action,this.isBoundary,para.createMaster)
             if (action || this.isBoundary) {
                 this.autoRun(data);
             }
         });

         /**
          * 触发自动通知
          * @type {[type]}
          */
         var vm = this.vm;

         switch (action) {
             case 'init':
                 //更新页码标示
                 vm.$emit('change:pageUpdate', currIndex);
                 resetToolbar.call(this);
                 setTimeout(function () {
                     $("#startupPage").remove();
                     $("#removelayer").remove();
                 }, 2000);
                 break;
             case 'toPage':
                 //更新页码标示
                 vm.$emit('change:pageUpdate', currIndex);
                 resetToolbar.call(this);
                 break;
         }

         /**
          * 初始化与跳转针对翻页案例的设置逻辑
          * @return {[type]} [description]
          */
         function resetToolbar() {
             //不显示首尾对应的按钮
             if (currIndex == 0) {
                 vm.$emit('change:hidePrev');
             } else if (currIndex == options.pagetotal - 1) {
                 vm.$emit('change:hideNext');
                 vm.$emit('change:showPrev');
             } else {
                 vm.$emit('change:showNext');
                 vm.$emit('change:showPrev');
             }
         }

         /**
          * 线性结构
          * 保存目录索引
          */
         if (!options.multiScenario) {
             _set("pageIndex", currIndex);
         }

         /**
          * 解锁翻页
          * 允许继续执行下一个翻页作用
          */
         if (this.unfliplock) {
             this.unfliplock();
             this.unfliplock = null;
         }

         //关闭快速翻页
         this.isQuickTurn = false;
     };

     /**
      * 页面跳转切换处
      * @param  {[type]} data [description]
      * @return {[type]}      [description]
      */
     SchedulerProto.jumpPage = function (data) {

         Xut.View.ShowBusy();

         //如果是非线性,创建页面修改
         if (!this.options.multiplePages) {
             data.create = [data.targetIndex];
             data.destroy = [data.currIndex];
             data.ruleOut = [data.targetIndex];
             data.pagePointer = {
                 currIndex: data.targetIndex
             };
         }

         //执行页面切换
         SwitchPage(this, data, function (data) {
             this._updatePointer(data.pagePointer);
             this.autoRun({
                 'action': 'toPage',
                 'createPointer': data['create']
             });
             Xut.View.HideBusy();
         });
     };

     /**
      * 加载页面事件与动作
      * @param  {[type]} action [description]
      * @return {[type]}        [description]
      */
     SchedulerProto.loadPage = function (action) {
         var self = this;

         //触发自动任务
         function trigger() {
             self.autoRun({
                 'action': 'init'
             });
         }

         //加载主场景页面
         function firstLoading() {

             $("#sceneHome").css({
                 'visibility': 'visible'
             });

             if (GLOBALIFRAME) {
                 trigger();
                 return;
             }
             //获取应用的状态
             if (Xut.Application.getAppState()) {
                 //保留启动方法
                 var pre = Xut.Application.LaunchApp;
                 Xut.Application.LaunchApp = function () {
                     pre();
                     trigger();
                 };
             } else {
                 trigger();
             }
         }

         //创建完成回调
         self.vm.$emit('change:createComplete', function () {
             if (self.options.multiScenario) {
                 trigger();
             } else {
                 //第一次加载
                 //进入应用
                 firstLoading();
             }
         });
     };

     /**
      * 调用母版管理器
      * @return {[type]} [description]
      */
     SchedulerProto.callMasterMgr = function (callback) {
         if (this.masterMgr) {
             callback.call(this.masterMgr);
         }
     };

     /**
      * 销毁接口
      * 对应多场景操作
      * @return {[type]} [description]
      */
     SchedulerProto.destroy = function () {
         this.pageMgr.destroy();
         this.callMasterMgr(function () {
             this.destroy();
         });
     };

     var config$8 = void 0;

     // 'container'     : this.elements[0],
     // 'pageMode'      : pageMode,
     // 'multiScenario' : !isMain,
     // 'rootPage'      : scenarioPage,
     // 'rootMaster'    : scenarioMaster,
     // 'initIndex'     : pageIndex, //保存索引从0开始
     // 'pagetotal'     : pageTotal,
     // 'sectionRang'   : this.sectionRang,
     // 'scenarioId'    : scenarioId,
     // 'chapterId'     : this.chapterId,
     // 'isInApp'       : this.isInApp //提示页面
     function Manager(parameter) {

         config$8 = Xut.config;

         var vm = this;

         var options = {
             //数据库定义的翻页模式
             //用来兼容客户端的制作模式
             //妙妙学模式处理，多页面下翻页切换
             //0 翻页滑动
             //1 没有滑动过程,直接切换页面
             'pageFlip': config$8.pageFlip,

             //翻页模式
             //根据页码数决定,主要是优化一些代码
             //true  是多页面模式,支持翻页滑动
             //false 单页面模式,不能翻页，只能跳转
             'pageMode': false,

             //是否多场景加载
             //单页场景 false
             //多场景   true
             'multiScenario': false,

             //是否为连续页面
             //通过pageMode的参数定义
             'multiplePages': false
         };

         //配置文件
         options = vm.options = _.extend(options, parameter);

         //强制转换
         //multiplePages
         //是否为连续页面
         if (Xut.IBooks.Enabled) {
             options.multiplePages = false;
         } else {
             options.multiplePages = options.pageFlip ? options.pageFlip : options.pageMode ? true : false;
         }

         //创建翻页滑动
         var $globalEvent = vm.$globalEvent = new GlobalEvent(options, config$8);

         // console.log( $globalEvent)

         //创建page页面管理
         var $scheduler = vm.$scheduler = new Scheduler(vm);

         //委托事件处理钩子
         var delegateHooks = {
             //超连接,跳转
             //svg内嵌跳转标记处理
             'data-xxtlink': function dataXxtlink(target, attribute, rootNode, pageIndex) {
                 try {
                     var para = attribute.split('-');
                     if (para.length > 1) {
                         //如果有多个就是多场景的组合
                         Xut.View.GotoSlide(para[0], para[1]);
                     } else {
                         Xut.View.GotoSlide(para[0]);
                     }
                 } catch (err) {
                     console.log('跳转错误');
                 }
             },

             //Action', 'Widget', 'Video', 'ShowNote', 'SubDoc'委托
             'data-delegate': function dataDelegate(target, attribute, rootNode, pageIndex) {
                 trigger.apply(null, arguments);
             },

             //如果是canvas节点
             'data-canvas': function dataCanvas(cur) {
                 // alert(1)
             }
         };

         //如果是主场景,才能切换系统工具栏
         if (options.multiplePages) {
             _.extend(delegateHooks, {
                 //li节点,多线程创建的时候处理滑动
                 'data-container': function dataContainer() {
                     vm.$emit('change:toggleToolbar');
                 },

                 //是背景层
                 'data-multilayer': function dataMultilayer() {
                     //改变工具条状态
                     vm.$emit('change:toggleToolbar');
                 },

                 //默认content元素可以翻页
                 'data-behavior': function dataBehavior(target, attribute, rootNode, pageIndex) {
                     //没有事件的元素,即可翻页又可点击切换工具栏
                     if (attribute == 'click-swipe') {
                         vm.$emit('change:toggleToolbar');
                     }
                 }
             });
         }

         //简化委托处理，默认一层元素只能绑定一个委托事件
         function filterProcessor(event, pageType) {
             var i,
                 k,
                 attribute,
                 attributes,
                 value,
                 cur = event.target;

             if (cur.nodeType) {
                 //如果触发点直接是li
                 if (cur === this) {
                     return {
                         'rootNode': this,
                         'elem': cur,
                         'handlers': delegateHooks['data-container']
                     };
                 }
                 //否则是内部的节点
                 try {
                     for (; cur !== this; cur = cur.parentNode || this) {
                         //如果是canvas节点
                         if (cur.nodeName && cur.nodeName.toLowerCase() === 'canvas') {
                             //是否为滑动行为
                             if (Xut.Contents.Canvas.getSupportState()) {
                                 return true;
                             } else {
                                 return false;
                             }
                         }
                         //如果是dom节点
                         attributes = cur['attributes'];
                         for (k in delegateHooks) {
                             if (attribute = attributes[k]) {
                                 value = attribute['value' || 'nodeValue'];
                                 return {
                                     'rootNode': this,
                                     'elem': cur,
                                     'attribute': value,
                                     'pageType': pageType,
                                     'handlers': delegateHooks[k]
                                 };
                             }
                         }
                     }
                 } catch (err) {
                     // config.isBrowser && console.log('默认事件跟踪', err)
                 }
             }
         }

         /**
          * 判断处理那个页面层次
          * 找到pageType类型
          * 项目分4个层
          * page mater page浮动 mater浮动
          * 通过
          * 因为冒泡的元素，可能是页面层，也可能是母板上的
          * @return {Boolean} [description]
          */
         function isBelong(target) {
             var pageType = 'page';
             if (target.dataset && target.dataset.belong) {
                 pageType = target.dataset.belong;
             }
             return pageType;
         }

         /**
          * 阻止元素的默认行为
          * 在火狐下面image带有href的行为
          * 会自动触发另存为
          * @return {[type]} [description]
          *
          * 2016.3.18
          * 妙妙学 滚动插件默认行为被阻止
          */
         function preventDefault(evtObj, target) {
             //var tagName = target.nodeName.toLowerCase();
             if (Xut.plat.isBrowser && !Xut.IBooks.Enabled && !MMXCONFIG) {
                 evtObj.preventDefault && evtObj.preventDefault();
             }
         }

         /*********************************************************************
          *                对页面事件的调控与状态动作的处理
          *                1 触屏 onswipedown
          *                2 滑动 onSwipeMove
          *                3 松手 onSwipeUp
          *                3 松手继续滑动 onSwipeUpSlider
          *                4 动画结束后处理 onAnimComplete                                                                               *
          **********************************************************************/

         /**
          * 事件句柄对象
          */
         var handlerObj = null;

         /**
          * 过滤器.全局控制函数
          * return true 阻止页面滑动
          */
         $globalEvent.$watch('filter', function (hookCallback, point, evtObj) {
             var target, pageType, parentNode;
             target = point.target;
             //阻止默认行为
             preventDefault(evtObj, target);
             //页面类型
             pageType = isBelong(target);
             //根节点
             parentNode = $globalEvent.findRootElement(point, pageType);
             //执行过滤处理
             handlerObj = filterProcessor.call(parentNode, point, pageType);
             if (!handlerObj || handlerObj.attribute === 'disable') {
                 //停止翻页,针对content对象可以拖动,滑动的情况处理
                 hookCallback();
             }
         });

         /**
          * 触屏滑动,通知pageMgr处理页面移动
          * @return {[type]} [description]
          */
         $globalEvent.$watch('onSwipeMove', function () {
             $scheduler.move.apply($scheduler, arguments);
         });

         /**
          * 触屏松手点击
          * 无滑动
          */
         $globalEvent.$watch('onSwipeUp', function (pageIndex, hookCallback) {
             if (handlerObj) {
                 if (handlerObj.handlers) {
                     handlerObj.handlers(handlerObj.elem, handlerObj.attribute, handlerObj.rootNode, pageIndex);
                 } else {
                     if (!Xut.Contents.Canvas.getIsTap()) {
                         vm.$emit('change:toggleToolbar');
                     }
                 }
                 handlerObj = null;
                 hookCallback();
             }
         });

         /**
          * 触屏滑动,通知ProcessMgr关闭所有激活的热点
          * @return {[type]}          [description]
          */
         $globalEvent.$watch('onSwipeUpSlider', function (pointers) {
             $scheduler.suspend(pointers);
         });

         /**
          * 翻页动画完成回调
          * @return {[type]}              [description]
          */
         $globalEvent.$watch('onAnimComplete', function (direction, pagePointer, unfliplock, isQuickTurn) {
             $scheduler.complete.apply($scheduler, arguments);
         });

         /**
          * 切换页面
          * @return {[type]}      [description]
          */
         $globalEvent.$watch('onJumpPage', function (data) {
             $scheduler.jumpPage(data);
         });

         /**
          * 退出应用
          * @return {[type]}      [description]
          */
         $globalEvent.$watch('onDropApp', function (data) {
             GLOBALIFRAME && Xut.publish('magazine:dropApp');
         });

         /**
          * 母板移动反馈
          * 只有存在data-parallaxProcessed
          * 才需要重新激活对象
          * 删除parallaxProcessed
          */
         $globalEvent.$watch('onMasterMove', function (hindex, target) {
             if (/Content/i.test(target.id) && target.getAttribute('data-parallaxProcessed')) {
                 $scheduler.masterMgr && $scheduler.masterMgr.reactivation(target);
             }
         });

         vm.$overrideApi();
     }

     //***************************************************************
     //
     //                      应用接口
     //
     //***************************************************************

     var VMProto = Manager.prototype;

     /**
      * 扩充事件
      */
     observe.call(VMProto);

     /**
      * 是否多场景模式
      */
     defAccess(VMProto, '$multiScenario', {
         get: function get() {
             return this.options.multiScenario;
         }
     });

     /**
      * 动态注入对象接口
      * 注入对象管理,注册所有widget组件对象
      *  content类型  创建时注册
      *  widget类型   执行时注册
      *  widget 包括 视频 音频 Action 子文档 弹出口 类型
      *  这种类型是冒泡处理，无法传递钩子，直接用这个接口与场景对接
      */
     defAccess(VMProto, '$injectionComponent', {
         set: function set(regData) {
             var injection;
             if (injection = this.$scheduler[regData.pageType + 'Mgr']) {
                 injection.abstractAssistPocess(regData.pageIndex, function (pageObj) {
                     pageObj.baseRegisterComponent.call(pageObj, regData.widget);
                 });
             } else {
                 console.log('注册injection失败,regData=' + regData);
             }
         }
     });

     /**
      * 得到当前的视图页面
      * @return {[type]}   [description]
      */
     defAccess(VMProto, '$curVmPage', {
         get: function get() {
             return this.$scheduler.pageMgr.abstractGetPageObj(this.$globalEvent.hindex);
         }
     });

     /**
      *  监听viewmodel内部的状态的改变,触发后传入值
      *
      *  与状态有关的change:
      *      翻页
      *          'flipOver' : function(pageIndex) {},
      *
      *      切换工具栏
      *          'toggleToolbar' : function(state, pointer) {},
      *
      *      复位工具栏
      *          'resetToolbar'  : function() {},
      *
      *      隐藏下一页按钮
      *          'hideNext'   : function(state) {},
      *
      *      显示下一页按钮
      *          'showNext'   : function() {}
      *
      *  与创建相关
      *      创建完毕回调
      *          'createComplete': null,
      *      创建后中断自动运行回调
      *          'suspendAutoCallback': null
      *
      */
     def$1(VMProto, '$bind', function (key, callback) {
         var vm = this;
         vm.$watch('change:' + key, function () {
             callback.apply(vm, arguments);
         });
     });

     /**
      * 创建页面
      * @return {[type]} [description]
      */
     def$1(VMProto, '$init', function () {
         this.$scheduler.initCreate();
     });

     /**
      * 运动动画
      * @return {[type]} [description]
      */
     def$1(VMProto, '$run', function () {
         var vm = this;
         vm.$scheduler.pageMgr.activateAutoRuns(vm.$globalEvent.hindex, Xut.Presentation.GetPageObj());
     });

     /**
      * 复位对象
      * @return {[type]} [description]
      */
     def$1(VMProto, '$reset', function () {
         return this.$scheduler.pageMgr.resetOriginal(this.$globalEvent.hindex);
     });

     /**
      * 停止所有任务
      * @return {[type]} [description]
      */
     def$1(VMProto, '$suspend', function () {
         Xut.Application.Suspend({
             skipMedia: true //跨页面不处理
         });
     });

     /**
      * 销毁场景内部对象
      * @return {[type]} [description]
      */
     def$1(VMProto, '$destroy', function () {
         this.$off();
         this.$globalEvent.destroy();
         this.$scheduler.destroy();
         this.$scheduler = null;
         this.$globalEvent = null;
     });

     /**
      * 设置所有API接口
      * @return {[type]} [description]
      */
     def$1(VMProto, '$overrideApi', function () {
         overrideApi(this);
     });

     var config$6 = void 0;

     //========================场景容器,工具栏创建相关================================

     /**
      * 分解工具栏配置文件
      * @return {[type]}          [description]
      */
     function parseTooBar(toolbar, tbType, pageMode) {
     	if (toolbar = parseJSON(toolbar)) {
     		//兼容数据库中未指定的情况
     		var n = Number(toolbar.pageMode);
     		pageMode = _.isFinite(n) ? n : pageMode;
     		if (_.isString(toolbar.tbType)) {
     			tbType = _.map(toolbar.tbType.split(','), function (num) {
     				return Number(num);
     			});
     		}
     	}
     	return {
     		'tbType': tbType,
     		'pageMode': pageMode
     	};
     }

     /**
      * 主场景工具栏配置
      * pageMode:默认2 允许滑动,带翻页按钮
      * 
      * @param  {[type]} scenarioId [description]
      * @return {[type]}            [description]
      */
     function pMainBar(scenarioId) {
     	var sectionRang = Xut.data.query('sectionRelated', scenarioId),
     	    toolbar = sectionRang.toolbar,
     	    //场景工具栏配置信息
     	pagetotal = sectionRang.length,
     	    tbType = [1],
     	    //默认显示系统工具栏
     	pageMode = pagetotal > 1 ? 2 : 0; //默认2 允许滑动,带翻页按钮
     	return parseTooBar(toolbar, tbType, pageMode);
     }

     /**
      * 副场景工具栏配置
      * pageMode 是否支持滑动翻页  0禁止滑动 1允许滑动
      * tbType   工具栏显示的类型 [0-5]
      */
     function pDeputyBar(toolbar, pagetotal) {
     	var tbType = [0],
     	    pageMode = pagetotal > 1 ? 1 : 0;
     	return parseTooBar(toolbar, tbType, pageMode);
     }

     /**
      * 找到对应容器
      * @return {[type]}            [description]
      */
     function findContainer(elements, scenarioId, isMain) {
     	return function (pane, parallax) {
     		var node;
     		if (isMain) {
     			node = '#' + pane;
     		} else {
     			node = '#' + parallax + scenarioId;
     		}
     		return elements.find(node)[0];
     	};
     }

     /**
      * 如果启动了缓存记录
      * 加载新的场景
      * @return {[type]} [description]
      */
     function checkHistory(history) {

     	//直接启用快捷调试模式
     	if (config$6.deBugHistory) {
     		Xut.View.LoadScenario(config$6.deBugHistory);
     		return true;
     	}

     	//如果有历史记录
     	if (history) {
     		var scenarioInfo = sceneControll.seqReverse(history);
     		if (scenarioInfo) {
     			scenarioInfo = scenarioInfo.split('-');
     			Xut.View.LoadScenario({
     				'scenarioId': scenarioInfo[0],
     				'chapterId': scenarioInfo[1],
     				'pageIndex': scenarioInfo[2]
     			});
     			return true;
     		} else {
     			return false;
     		}
     	}
     }

     /**
      * 场景创建类
      * @param  {[type]} seasonId               [description]
      * @param  {[type]} chapterId              [description]
      * @param  {[type]} createCompleteCallback [创建完毕通知回调]
      * @param  {[type]} createMode             [创建模式]
      * @param  {[type]} sceneChainId           [场景ID链,用于后退按钮加载前一个场景]
      * @return {[type]}                        [description]
      */
     function SceneFactory(data) {

     	config$6 = Xut.config;

     	//基本配置信息
     	var seasonId = data.seasonId;
     	var chapterId = data.chapterId;

     	var options = _.extend(this, data, {
     		'scenarioId': seasonId,
     		'chapterId': chapterId,
     		'container': $('#sceneContainer')
     	});

     	//////////////
     	// 创建场景容器 //
     	//////////////
     	var complete = function complete() {
     		//配置工具栏行为
     		if (!Xut.IBooks.Enabled) {
     			_.extend(this, this.initToolBar());
     		}

     		//构件vm对象
     		this.createViewModel();

     		//注入场景管理
     		sceneControll.add(seasonId, chapterId, this);
     	};
     	this.createScenario(complete, options);
     }

     var sceneProto = SceneFactory.prototype;

     /**
      * 创建场景
      * @return {[type]} [description]
      */
     sceneProto.createScenario = function (callback, options) {

     	//如果是静态文件执行期
     	//支持Xut.IBooks模式
     	//都不需要创建节点
     	if (Xut.IBooks.runMode()) {
     		this.elements = $('#sceneHome');
     		callback.call(this);
     		return;
     	}

     	var elements,
     	    str,
     	    self = this;
     	if (options.isMain) {
     		str = home();
     	} else {
     		str = scene(this.scenarioId);
     	}

     	//创建场景容器
     	elements = this.elements = $(str);
     	Xut.nextTick({
     		'container': self.container,
     		'content': elements
     	}, function () {
     		callback.call(self);
     	});
     };

     /**
      * 
      * 配置工具栏行为
      *	1.	工具栏类型 
      *	tbType：(如果用户没有选择任何工具栏信息处理，tbType字段就为空)
      *	 0	禁止工具栏
      *	 1	系统工具栏   - 显示IOS系统工具栏
      *	 2	场景工具栏   - 显示关闭按钮
      *	 3	场景工具栏   - 显示返回按钮
      *	 4	场景工具栏   - 显示顶部小圆点式标示
      *
      *	2.	翻页模式
      *	pageMode：(如果用户没有选择任何处理，pageMode字段就为空)
      *	 0禁止滑动
      *	 1 允许滑动无翻页按钮
      *	 2 允许滑动带翻页按钮
      *
      * @return {[type]} [description]
      */
     sceneProto.initToolBar = function () {
     	var scenarioId = this.scenarioId;
     	var pageTotal = this.pageTotal;
     	var pageIndex = this.pageIndex;
     	var elements = this.elements;
     	var bar;
     	var findControlBar = function findControlBar() {
     		return elements.find('#controlBar');
     	};

     	/**
       * 主场景工具栏设置
       */
     	if (this.isMain) {
     		bar = pMainBar(scenarioId, pageTotal);
     		if (config$6.scrollPaintingMode) {
     			//word模式,自动启动工具条
     			this.sToolbar = new Bar({
     				container: elements,
     				controlBar: findControlBar(),
     				pageMode: bar.pageMode
     			});
     		} else if (_.some(bar.tbType)) {
     			//普通模式
     			this.sToolbar = new sToolbar({
     				container: elements,
     				controlBar: findControlBar(),
     				pageTotal: pageTotal,
     				currentPage: pageIndex + 1,
     				pageMode: bar.pageMode
     			});
     		}
     	} else {
     		/**
        * 副场景
        * @type {[type]}
        */
     		bar = pDeputyBar(this.barInfo, pageTotal);
     		//创建工具栏
     		if (bar) {
     			this.cToolbar = new fToolbar({
     				id: scenarioId,
     				container: elements,
     				tbType: bar.tbType,
     				pageTotal: pageTotal,
     				currentPage: pageIndex,
     				pageMode: bar.pageMode
     			});
     		}
     	}

     	return bar;
     };

     /**
      * 构建创建对象
      * @return {[type]} [description]
      */
     sceneProto.createViewModel = function () {

     	var self = this;
     	var scenarioId = this.scenarioId;
     	var pageTotal = this.pageTotal;
     	var pageIndex = this.pageIndex;
     	var elements = this.elements;
     	var pageMode = this.pageMode;
     	var isMain = this.isMain;
     	var tempfind = findContainer(elements, scenarioId, isMain);
     	//页面容器
     	var scenarioPage = tempfind('pageContainer', 'scenarioPage-');
     	//视差容器
     	var scenarioMaster = tempfind('masterContainer', 'scenarioMaster-');

     	//场景容器对象
     	var vm = this.vm = new Manager({
     		'container': this.elements[0],
     		'pageMode': pageMode,
     		'multiScenario': !isMain,
     		'rootPage': scenarioPage,
     		'rootMaster': scenarioMaster,
     		'initIndex': pageIndex, //保存索引从0开始
     		'pagetotal': pageTotal,
     		'sectionRang': this.sectionRang,
     		'scenarioId': scenarioId,
     		'chapterId': this.chapterId,
     		'isInApp': this.isInApp //提示页面
     	});

     	/**
       * 配置选项
       * @type {[type]}
       */
     	var isToolbar = this.isToolbar = this.cToolbar ? this.cToolbar : this.sToolbar;

     	/**
       * 监听翻页
       * 用于更新页码
       * @return {[type]} [description]
       */
     	vm.$bind('pageUpdate', function (pageIndex) {
     		isToolbar && isToolbar.updatePointer(pageIndex);
     	});

     	/**
       * 显示下一页按钮
       * @return {[type]} [description]
       */
     	vm.$bind('showNext', function () {
     		isToolbar && isToolbar.showNext();
     	});

     	/**
       * 隐藏下一页按钮
       * @return {[type]} [description]
       */
     	vm.$bind('hideNext', function () {
     		isToolbar && isToolbar.hideNext();
     	});

     	/**
       * 显示上一页按钮
       * @return {[type]} [description]
       */
     	vm.$bind('showPrev', function () {
     		isToolbar && isToolbar.showPrev();
     	});

     	/**
       * 隐藏上一页按钮
       * @return {[type]} [description]
       */
     	vm.$bind('hidePrev', function () {
     		isToolbar && isToolbar.hidePrev();
     	});

     	/**
       * 切换工具栏
       * @return {[type]} [description]
       */
     	vm.$bind('toggleToolbar', function (state, pointer) {
     		isToolbar && isToolbar.toggle(state, pointer);
     	});

     	/**
       * 复位工具栏
       * @return {[type]} [description]
       */
     	vm.$bind('resetToolbar', function () {
     		self.sToolbar && self.sToolbar.reset();
     	});

     	/**
       * 监听创建完成
       * @return {[type]} [description]
       */
     	vm.$bind('createComplete', function (nextAction) {
     		self.complete && setTimeout(function () {
     			if (isMain) {
     				self.complete(function () {
     					Xut.View.HideBusy();
     					//检测是不是有缓存加载
     					if (!checkHistory(self.history)) {
     						//指定自动运行的动作
     						nextAction && nextAction();
     					}
     					//全局接口,应用加载完毕
     					Xut.Application.AddEventListener();
     				});
     			} else {
     				self.complete(nextAction);
     			}
     		}, 200);
     	});

     	//如果是读酷端加载
     	if (DUKUCONFIG && isMain && DUKUCONFIG.success) {
     		DUKUCONFIG.success();
     		vm.$init();
     		//如果是客户端加载
     	} else if (CLIENTCONFIGT && isMain && CLIENTCONFIGT.success) {
     			CLIENTCONFIGT.success();
     			vm.$init();
     		} else {
     			//正常加载
     			vm.$init();
     		}

     	/**
       * 绑定桌面调试
       */
     	config$6.debugMode && Xut.plat.isBrowser && this.bindWatch();
     };

     /**
      * 为桌面测试
      * 绑定调试
      * @return {[type]} [description]
      */
     sceneProto.bindWatch = function () {
     	// for test
     	if (Xut.plat.isBrowser) {
     		var vm = this.vm;
     		this.testWatch = $(".xut-controlBar-pageNum").click(function () {
     			console.log('主场景', vm);
     			console.log('主场景容器', vm.$scheduler.pageMgr.Collections);
     			console.log('主场景视觉差容器', vm.$scheduler.parallaxMgr && vm.$scheduler.parallaxMgr.Collections);
     			console.log('多场景', sceneControll.expose());
     			console.log('音频', Xut.AudioManager);
     			console.log('视频', Xut.VideoManager);
     			console.log('数据库', Xut.data);
     		});
     	}
     };

     //=============================退出处理,销毁=============================================

     /**
      * 销毁场景对象
      * @return {[type]} [description]
      */
     sceneProto.destroy = function () {
     	/**
       * 桌面调试
       */
     	if (this.testWatch) {
     		this.testWatch.off();
     		this.testWatch = null;
     	}

     	/**
       * 销毁当前场景
       */
     	this.vm.$destroy();

     	/**
       * 销毁工具栏
       */
     	if (this.isToolbar) {
     		this.isToolbar.destroy();
     		this.isToolbar = null;
     	}

     	this.container = null;

     	//销毁节点
     	this.elements.off();
     	this.elements.remove();
     	this.elements = null;

     	//销毁引用
     	sceneControll.remove(this.scenarioId);
     };

     var config$3 = Xut.config;
     var plat = Xut.plat;
     var LOCK = 1;
     var UNLOCK = 2;
     var IsPay = false;
     //

     /**
      * 代码注入空间
      * @type {Object}
      */
     var external = {};

     /**
      * 桌面绑定鼠标控制
      */
     if (plat.isBrowser) {
         $(document).keyup(function (event) {
             switch (event.keyCode) {
                 case 37:
                     Xut.View.GotoPrevSlide();
                     break;
                 case 39:
                     Xut.View.GotoNextSlide();
                     break;
             }
         });
     }

     //================================================
     //
     //              电子杂志所有接口
     //
     //=================================================
     Xut.Assist = {};
     var Presentation = Xut.Presentation = {};
     var _View = Xut.View = {};
     var Contents = Xut.Contents = {};
     var Application = Xut.Application = {};

     /**
      * 忙碌光标
      * */
     portExtend(_View, {

         busyBarState: false,

         //忙碌光标的引用
         busyIcon: null,

         ShowBusy: function ShowBusy() {
             if (Xut.IBooks.Enabled) return;
             _View.busyBarState = true;
             _View.busyIcon.show();
         },

         HideBusy: function HideBusy() {
             if (Xut.IBooks.Enabled) return;
             var busyIcon = _View.busyIcon;
             if (_View.ShowBusy.lock) return; //显示忙碌加锁，用于不处理hideBusy
             _View.busyBarState = false;
             busyIcon.hide();
             IsPay && busyIcon.css('pointer-events', '').find('.xut-busy-text').html('');
         },

         ShowTextBusy: function ShowTextBusy(txt) {
             if (Xut.IBooks.Enabled) return;
             _View.busyIcon.css('pointer-events', 'none').find('.xut-busy-text').html(txt);
             _View.ShowBusy();
         }
     });

     /**
      * [检查是否购买]
      **/
     function CheckBuyGood(seasonId, chapterId, createMode, pageIndex) {
         //已付费
         if (IsPay) {
             return false;
         }

         try {
             var data = Xut.data.query('sectionRelated', seasonId).toolbar,
                 item = [];
             data = JSON.parse(data);
             //判断是否免费章节
             if (!data.Inapp) {
                 return false;
             }
             //判断是否交费
             if (UNLOCK == data.Inapp || UNLOCK == _get(inAppId)) {
                 setUnlock();
                 return false;
             }
             //判断是否收费章节
             if (LOCK == data.Inapp && data.inappInfo) {
                 item = _.map(data.inappInfo.split('-'), function (num) {
                     return Number(num);
                 });
                 //收费提示页
                 if (item[0] == chapterId && item[1] == seasonId) {
                     return false;
                 } else {
                     _View.LoadScenario({
                         'scenarioId': item[1],
                         'chapterId': item[0],
                         'createMode': createMode,
                         'pageIndex': pageIndex,
                         'isInApp': 'isInApp'
                     });
                 }
             }
         } catch (e) {
             console.log('Data error:', e);
         }
         return true;
     }

     //重复点击
     var repeatClick = false;

     /**
      * 场景
      * */
     portExtend(_View, {

         /**
          * 关闭场景
          */
         CloseScenario: function CloseScenario() {
             if (repeatClick) return;
             repeatClick = true;
             var serial = sceneControll.takeOutPrevChainId();
             _View.LoadScenario({
                 'scenarioId': serial.scenarioId,
                 'chapterId': serial.chapterId,
                 'createMode': 'sysClose'
             }, function () {
                 repeatClick = false;
             });
         },

         /**
          * 加载一个新的场景
          * 1 节与节跳
          *    单场景情况
          *    多场景情况
          * 2 章与章跳
          * useUnlockCallBack 用来解锁回调,重复判断
          * isInApp 是否跳转到提示页面
          */
         LoadScenario: function LoadScenario(options, useUnlockCallBack) {

             var seasonId = toNumber(options.scenarioId),
                 chapterId = toNumber(options.chapterId),
                 pageIndex = toNumber(options.pageIndex),
                 createMode = options.createMode,
                 isInApp = options.isInApp;

             //ibooks模式下的跳转
             //全部转化成超链接
             if (!options.main && Xut.IBooks.Enabled && Xut.IBooks.runMode()) {
                 location.href = chapterId + ".xhtml";
                 return;
             }

             //检查应用内是否收费
             if (current && CheckBuyGood(seasonId, chapterId, createMode, pageIndex)) {
                 //未交费
                 return false;
             }

             //处理场景跳转
             var sceneController = sceneControll,

             //用户指定的跳转入口，而不是通过内部关闭按钮处理的
             userAssign = createMode === 'sysClose' ? false : true,

             //当前活动场景容器对象
             current = sceneController.containerObj('current');

             //获取到当前的页面对象
             //用于跳转去重复
             if (current && current.vm) {
                 var curVmPage;
                 if (curVmPage = current.vm.$curVmPage) {
                     if (curVmPage.scenarioId == seasonId && curVmPage.chapterId == chapterId) {
                         console.log('无效的重复触发');
                         return;
                     }
                 }
             }

             //==================场景内部跳转===============================
             //
             //  节相同，章与章的跳转
             //  用户指定跳转模式,如果目标对象是当前应用页面，按内部跳转处理
             //
             //=============================================================
             if (userAssign && current && current.scenarioId === seasonId) {
                 _View.GotoSlide(seasonId, chapterId);
                 return;
             }

             //==================场景外部跳转===============================
             //
             //  节与节的跳转,需要对场景的处理
             //
             //=============================================================

             //清理热点动作
             current && current.vm.$suspend();

             //通过内部关闭按钮加载新场景处理
             if (current && userAssign) {
                 //检测是不是往回跳转,重复处理
                 sceneController.checkToRepeat(seasonId);
             }

             //================加载新的场景=================

             //读酷启动时不需要忙碌光标
             if (DUKUCONFIG && options.main) {
                 Xut.View.HideBusy();
             } else {
                 Xut.View.ShowBusy();
             }

             /**
              * 跳出去
              * $multiScenario
              * 场景模式
              * $multiScenario
              *      true  多场景
              *      false 单场景模式
              * 如果当前是从主场景加载副场景
              * 关闭系统工具栏
              */
             if (current && !current.vm.$multiScenario) {
                 _View.HideToolbar();
             }

             /**
              * 重写场景的顺序编号
              * 用于记录场景最后记录
              */
             var pageId;
             if (current && (pageId = Xut.Presentation.GetPageId())) {
                 sceneController.rewrite(current.scenarioId, pageId);
             }

             /**
              * 场景信息
              * @type {[type]}
              */
             var sectionRang = Xut.data.query('sectionRelated', seasonId);
             var barInfo = sectionRang.toolbar,
                 //场景工具栏配置信息
             pageTotal = sectionRang.length,

             //通过chapterId转化为实际页码指标
             //season 2
             //       {
             //          chapterId : 1  => 0
             //          chpaterId : 2  => 1
             //       }
             //
             parseInitIndex = function parseInitIndex() {
                 return chapterId ? function () {
                     //如果节点内部跳转方式加载,无需转化页码
                     if (createMode === 'GotoSlide') {
                         return chapterId;
                     }
                     //初始页从0开始，减去下标1
                     return chapterId - sectionRang.start - 1;
                 }() : 0;
             };

             //如果启动了虚拟模式
             if (config$3.virtualMode) {
                 pageTotal = pageTotal * 2;
             }

             /**
              * 传递的参数
              * seasonId    节ID
              * chapterId   页面ID
              * pageIndex   指定页码
              * isInApp     是否跳到收费提示页
              * pageTotal   页面总数
              * barInfo     工具栏配置文件
              * history     历史记录
              * sectionRang 节信息
              * complete    构件完毕回调
              * @type {Object}
              */
             var data = {
                 seasonId: seasonId,
                 chapterId: chapterId,
                 pageIndex: pageIndex || parseInitIndex(),
                 isInApp: isInApp,
                 pageTotal: pageTotal,
                 barInfo: barInfo,
                 history: options.history,
                 sectionRang: sectionRang,
                 //制作场景切换后处理
                 complete: function complete(nextBack) {
                     //销毁多余场景
                     current && current.destroy();
                     //下一个任务存在,执行切换回调后,在执行页面任务
                     nextBack && nextBack();
                     //去掉忙碌
                     _View.HideBusy();
                     //解锁回调
                     useUnlockCallBack && useUnlockCallBack();
                 }
             };

             //主场景判断（第一个节,因为工具栏的配置不同）
             if (options.main || sceneController.mianId === seasonId) {
                 //清理缓存
                 _remove$1("history");
                 //确定主场景
                 sceneController.mianId = seasonId;
                 //是否主场景
                 data.isMain = true;
             }
             new SceneFactory(data);
         }
     });

     /**
      * 行为
      * */
     portExtend(_View, {
         /**
          * 通过插件打开一个新view窗口
          */
         Open: function Open(pageUrl, width, height, left, top) {
             Xut.Plugin.WebView.open(pageUrl, left, top, height, width, 1);
         },

         //关闭view窗口
         Close: function Close() {
             Xut.Plugin.WebView.close();
         }
     });

     /**
      * content
      * */
     portExtend(Contents, {

         //存在文档碎片
         //针对音频字幕增加的快捷查找
         contentsFragment: {},

         /**
          * 是否为canvas元素
          * 用来判断事件冒泡
          * 判断当前元素是否支持滑动
          * 默认任何元素都支持滑动
          * @type {Boolean}
          */
         Canvas: {

             /**
              * 是否允许滑动
              * @type {Boolean}
              */
             SupportSwipe: true,

             /**
              * 对象是否滑动
              * @type {Boolean}
              */
             isSwipe: false,

             /**
              * 对象是否点击
              */
             isTap: false,

             /**
              * 复位标记
              */
             Reset: function Reset() {
                 Contents.Canvas.SupportSwipe = true;
                 Contents.Canvas.isSwipe = false;
             },

             /**
              * 判断是否可以滑动
              * @return {[type]} [description]
              */
             getSupportState: function getSupportState() {
                 var state;
                 if (Contents.Canvas.SupportSwipe) {
                     state = true;
                 } else {
                     state = false;
                 }
                 //清空状态
                 Contents.Canvas.Reset();
                 return state;
             },

             /**
              * 判断是否绑定了滑动事件
              * @return {Boolean} [description]
              */
             getIsSwipe: function getIsSwipe() {
                 var state;
                 if (Contents.Canvas.isSwipe) {
                     state = true;
                 } else {
                     state = false;
                 }
                 //清空状态
                 Contents.Canvas.Reset();
                 return state;
             },

             /**
              * 是否绑定了点击事件
              */
             getIsTap: function getIsTap() {
                 var state = Contents.Canvas.isTap;
                 Contents.Canvas.isTap = false;
                 return state;
             }
         },

         /**
          * 恢复节点的默认控制
          * 默认是系统接管
          * 如果'drag', 'dragTag', 'swipeleft', 'swiperight', 'swipeup', 'swipedown'等事件会重写
          * 还需要考虑第三方调用，所以需要给一个重写的接口
          * @return {[type]} [description]
          * Content_1_3
          * [Content_1_3,Content_1_4,Content_1_5]
          */
         ResetDefaultControl: function ResetDefaultControl(pageType, id, value) {
             if (!id) return;
             var elements,
                 handle = function handle(ele) {
                 if (value) {
                     ele.attr('data-behavior', value);
                 } else {
                     ele.attr('data-behavior', 'disable');
                 }
             };
             if ((elements = Contents.Get(pageType, id)) && elements.$contentProcess) {
                 handle(elements.$contentProcess);
             } else {
                 elements = $("#" + id);
                 elements.length && handle(elements);
             }
         },

         /**
          * 针对SVG无节点操作
          * 关闭控制
          */
         DisableControl: function DisableControl(callback) {
             return {
                 behavior: 'data-behavior',
                 value: 'disable'
             };
         },

         /**
          * 针对SVG无节点操作
          * 启动控制
          */
         EnableControl: function EnableControl(Value) {
             return {
                 behavior: 'data-behavior',
                 value: Value || 'click-swipe'
             };
         }
     });

     function getStorage(name) {
         return parseInt(_get(name));
     }

     /**
      * [ 执行解锁]
      * @return {[type]} [description]
      */
     function setUnlock() {
         IsPay = true;
     }

     //购买成功
     function pass() {
         //如果提前关闭了忙碌光标说明被用户中止
         if (!_View.busyBarState) return;
         //将购买记录存入数据库
         var db = config$3.db,
             sql = 'UPDATE Setting SET value=? WHERE name=?';

         db.transaction(function (tx) {
             tx.executeSql(sql, [null, 'Inapp']);
         }, function (e) {
             _set(inAppId, UNLOCK);
         });

         setUnlock();
         _View.CloseScenario();
         _View.HideBusy();
     }

     //购买失败
     function failed() {
         if (!_View.busyBarState) return;
         messageBox('购买失败');
         _View.HideBusy();
     }

     portExtend(Application, {

         /**
          * 应用平台
          * @type {[type]}
          */
         Platform: function () {
             //平台缩写
             var platformName = ['duku', 'pc', 'ios', 'android'];
             if (GLOBALIFRAME) {
                 //嵌套iframe平台
                 return platformName[0];
             } else {
                 if (config$3.isBrowser) {
                     return platformName[1];
                 } else if (Xut.plat.isIOS) {
                     return platformName[2];
                 } else if (Xut.plat.isAndroid) {
                     return platformName[3];
                 }
             }
         }(),

         /**
          * [ 锁状态]
          * @return {[type]} [description]
          */
         Unlock: function Unlock() {
             return IsPay;
         },

         /**
          * [ 检查是否解锁]
          * @return {[type]}       [description]
          */
         CheckOut: function CheckOut() {
             var Inapp = config$3.Inapp;
             if (!Inapp || _get(Inapp) === UNLOCK || Xut.plat.isAndroid) {
                 setUnlock();
             }
         },

         /**
          * [ 付费接口]
          * @param  {[type]} seasonId   [description]
          * @param  {[type]} chapterId  [description]
          * @param  {[type]} createMode [description]
          * @param  {[type]} pageIndex  [description]
          * @return {[type]}            [description]
          */
         BuyGood: function BuyGood() {
             var inAppId = config$3.Inapp;
             if (_View.busyBarState) return;
             _View.ShowTextBusy('请稍候...');
             //调式模式
             if (plat.isBrowser) {
                 setTimeout(function () {
                     pass();
                 }, 3000);
                 return;
             }
             //从AppStore查询是否交费
             Xut.Plugin.iapPlugin.selectInfo(function () {
                 pass(); //查询成功则表明已购买
             }, function () {
                 //否则提示购买
                 Xut.Plugin.iapPlugin.buyGood(function () {
                     pass();
                 }, function (e) {
                     failed();
                 }, inAppId);
             }, inAppId);
         },

         /**
          * 已付费接口
          * @return {[type]} [description]
          */
         HasBuyGood: function HasBuyGood() {
             var inAppId = config$3.Inapp;
             if (_View.busyBarState) return;
             _View.ShowTextBusy('请稍候...');
             //调式模式
             if (plat.isBrowser) {
                 setTimeout(function () {
                     pass();
                 }, 3000);
                 return;
             }

             Xut.Plugin.iapPlugin.restore(function () {
                 pass(); //查询成功则表明已购买
             }, function () {
                 failed();
             }, inAppId);
         },

         /**
          * 刷新页面
          */
         Resize: function Resize() {

             //清理对象
             sceneControll.destroyAllScene();

             //清理节点
             $("#sceneContainer").empty();

             //加载新的页面
             var novelId,
                 pageIndex = getStorage('pageIndex');

             //缓存加载
             if (pageIndex !== void 0) {
                 novelId = getStorage("novelId");
                 //加强判断
                 if (novelId) {
                     loadScene({
                         "novelId": novelId,
                         "pageIndex": pageIndex,
                         'history': _get('history')
                     });
                 };
             }
         },

         /**
          * home隐藏
          * 后台运行的时候,恢复到初始化状态
          * 用于进来的时候激活Activate
          */
         Original: function Original() {
             _suspend();
             _original();
         },

         /**
          * home显示
          * 后台弹回来
          * 激活应用行为
          */
         Activate: function Activate() {
             _autoRun();
         },

         /**
          * 销毁应用
          */
         Destroy: function Destroy() {
             if (plat.isBrowser) {
                 //销毁桌面控制
                 $(document).off();
             }
             //销毁所有场景
             sceneControll.destroyAllScene();
         },

         /**
          * 退出app
          */
         DropApp: function DropApp() {
             //如果读酷
             if (DUKUCONFIG) {
                 //外部回调通知
                 if (DUKUCONFIG.iframeDrop) {
                     var appId = _get('appId');
                     DUKUCONFIG.iframeDrop(['appId-' + appId, 'novelId-' + appId, 'pageIndex-' + appId]);
                 }
                 DUKUCONFIG = null;
                 unEvent();
                 destroy();
                 return;
             }

             //客户端模式
             if (CLIENTCONFIGT) {
                 //外部回调通知
                 if (CLIENTCONFIGT.iframeDrop) {
                     CLIENTCONFIGT.iframeDrop();
                 }
                 CLIENTCONFIGT = null;
                 unEvent();
                 destroy();
                 return;
             }

             //妙妙学客户端
             if (MMXCONFIG) {
                 //外部回调通知
                 if (MMXCONFIG.iframeDrop) {
                     MMXCONFIG.iframeDrop();
                 }
                 MMXCONFIG = null;
                 destroy();
                 return;
             }

             function unEvent() {
                 //并且是安卓情况下
                 //安卓销毁按键事件
                 if (Xut.plat.isAndroid) {
                     GLOBALCONTEXT.document.removeEventListener("backbutton", config$3._event.back, false);
                     GLOBALCONTEXT.document.removeEventListener("pause", config$3._event.pause, false);
                 }
             }

             //iframe模式,退出处理
             function destroy() {
                 //销毁内存对象
                 Application.Destroy();
                 GLOBALCONTEXT = null;
             }

             //单应用dialogs
             if (!plat.isBrowser) {
                 GLOBALCONTEXT.navigator.notification.confirm('您确认要退出吗？', function (button) {
                     if (1 == button) {
                         GLOBALCONTEXT.navigator.app.exitApp();
                     }
                 }, '退出', ['确定', '取消']);
             }
         },

         /**
          * 暂停应用
          * skipMedia 跳过音频你处理(跨页面)
          * dispose   成功处理回调
          * processed 处理完毕回调
          */
         Suspend: function Suspend(opts) {
             if (suspendHandles(opts.skipMedia)) {
                 //停止热点动作
                 if (opts.dispose) {
                     opts.dispose(promptMessage);
                 }
             } else {
                 opts.processed && opts.processed();
             }
         },

         //============================================================
         //
         //  注册所有组件对象
         //
         //  2 widget 包括 视频 音频 Action 子文档 弹出口 类型
         //    这种类型是冒泡处理，无法传递钩子，直接用这个接口与场景对接
         //
         injectionComponent: function injectionComponent(regData) {
             var sceneObj = sceneControll.containerObj('current');
             sceneObj.vm.$injectionComponent = regData;
         }
     });

     portExtend(Application, {

         /**
          * 应用加载状态
          * false未加载
          * true 已加载
          * @type {Boolean}
          */
         appState: false,

         setAppState: function setAppState() {
             Application.appState = true;
         },

         delAppState: function delAppState() {
             Application.appState = false;
         },

         /**
          * 获取应用加载状态
          * @return {[type]} [description]
          */
         getAppState: function getAppState() {
             return Application.appState;
         },

         /**
          * 延时APP运用
          * 一般是在等待视频先加载完毕
          * @return {[type]} [description]
          */
         delayAppRun: function delayAppRun() {
             Application.setAppState();
         },

         /**
          * 启动app
          * 重载启动方法
          * 如果调用在重载之前，就删除，
          * 否则被启动方法重载
          * @type {[type]}
          */
         LaunchApp: function LaunchApp() {
             Application.delAppState();
         },

         /**
          * 应用加载完毕
          */
         AddEventListener: function AddEventListener() {}
     });

     //========================================================
     //
     //          脚本注入接口
     //
     //========================================================

     external = {

         /**
                读取系统中保存的变量的值。
                如果变量不存在，则新建这个全局变量
                如果系统中没有保存的值，用默认值进行赋值
                这个函数，将是创建全局变量的默认函数。
              */
         ReadVar: function ReadVar(variable, defaultValue) {
             var temp;
             if (temp = _get(variable)) {
                 return temp;
             } else {
                 _set(variable, defaultValue);
                 return defaultValue;
             }
         },

         /**
          * 将变量的值保存起来
          */
         SaveVar: function SaveVar(variable, value) {
             _set(variable, value);
         },

         /*
                对变量赋值，然后保存变量的值
                对于全局变量，这个函数将是主要使用的，替代简单的“=”赋值
              */
         SetVar: function SetVar(variable, value) {
             _set(variable, value);
         }

     };

     /**
      * u3d接口
      */
     Xut.U3d = {
         /**
          * 跳转接口
          * @param {[type]} seasonId  [description]
          * @param {[type]} chapterId [description]
          */
         View: function View(seasonId, chapterId) {
             _View.LoadScenario({
                 'scenarioId': serial.scenarioId,
                 'chapterId': serial.chapterId
             });
         }
     };

     //导出注入接口
     window.XXTAPI = external;

     /**
      * content对象的创建过滤器
      * 用于阻断对象的创建
      */
     function contentFilter(filterName) {

         //过滤的节点
         var listFilters = function () {
             var values = getCache();
             var h = hash();
             if (values) {
                 //keep the listFilters has no property
                 _.each(values, function (v, i) {
                     h[i] = v;
                 });
             }
             return h;
         }();

         function setCache(listFilters) {
             _save(filterName, listFilters);
         }

         function getCache() {
             var jsonStr = _get(filterName);
             return parseJSON(jsonStr);
         }

         function access(callback, pageId, contentId) {
             //如果是transformFilter,不需要pageIndex处理
             if (filterName === 'transformFilter' && contentId === undefined) {
                 contentId = pageId;
                 pageId = 'transformFilter';
             }
             return callback(pageId, Number(contentId));
         }

         return {
             add: function add(pageId, contentId) {
                 access(function (pageId, contentId) {
                     if (!listFilters[pageId]) {
                         listFilters[pageId] = [];
                     }
                     //去重
                     if (-1 === listFilters[pageId].indexOf(contentId)) {
                         listFilters[pageId].push(contentId);
                         setCache(listFilters);
                     }
                 }, pageId, contentId);
             },

             remove: function remove(pageId, contentId) {
                 access(function (pageId, contentId) {
                     var target = listFilters[pageId] || [],
                         index = target.indexOf(contentId);
                     if (-1 !== index) {
                         target.splice(index, 1);
                         setCache(listFilters);
                     }
                 }, pageId, contentId);
             },

             has: function has(pageId, contentId) {
                 return access(function (pageId, contentId) {
                     var target = listFilters[pageId];
                     return target ? -1 !== target.indexOf(contentId) ? true : false : false;
                 }, pageId, contentId);
             },

             /**
              * 创建过滤器
              * @param  {[type]} pageId [description]
              * @return {[type]}        [description]
              */
             each: function each(pageId) {
                 return access(function (pageId, contentId) {
                     var target, indexOf;
                     if (target = listFilters[pageId]) {
                         return function (contentIds, callback) {
                             _.each(target, function (ids) {
                                 var indexOf = contentIds.indexOf(ids);
                                 if (-1 !== indexOf) {
                                     callback(indexOf); //如果找到的过滤项目
                                 }
                             });
                         };
                     }
                 }, pageId);
             },

             //过滤器数量
             size: function size() {
                 return _.keys(listFilters).length;
             },

             empty: function empty() {
                 _remove(filterName);
                 listFilters = {};
             }
         };
     };

     var config$2 = void 0;

     function getCache(name) {
         return parseInt(_get(name));
     }

     /**
      * 进入主页面
      * @return {[type]} [description]
      */
     function initMain(novelData) {

         var novelId,
             parameter,
             pageIndex = getCache('pageIndex'),
             pageFlip = getCache('pageFlip') || 0;

         /**
          * IBOOS模式
          */
         if (Xut.IBooks.Enabled) {
             //删除背景图
             $("#removelayer").remove();
             LoadScene({
                 "pageIndex": Xut.IBooks.CONFIG.pageIndex
             });
             return;
         }

         /**
          * 多模式判断
          * 全局翻页模式
          * 0 滑动翻页
          * 1 直接换
          * 所以pageFlip只有在左面的情况下
          */
         if (parameter = novelData.parameter) {
             //拿出pageflip的值
             parameter = parseJSON(parameter);
             //获取pageflip的值得
             //pageflip用来标
             //不能翻页
             //直接切换模式
             pageFlip = parameter.pageflip;
             if (pageFlip !== undefined) {
                 //设置缓存
                 _set({
                     'pageFlip': pageFlip
                 });
             }
         }

         //缓存加载
         //如果启动recordHistory记录
         if (config$2.recordHistory && pageIndex !== undefined) {
             //加强判断
             if (novelId = getCache("novelId")) {
                 return loadScene({
                     'pageFlip': pageFlip,
                     "novelId": novelId,
                     "pageIndex": pageIndex,
                     'history': _get('history')
                 });
             }
         }

         //第一次加载
         //没有缓存
         loadScene({
             "novelId": novelData._id,
             "pageIndex": 0,
             'pageFlip': pageFlip
         });
     };

     /**
      * 根据set表初始化数据
      * @return {[type]} [description]
      */
     function initValue() {
         createStore().done(function (setData, novelData) {
             initDefaults(setData);
             fixedSize(novelData);
             initMain(novelData);
         });
     };

     /**
      * 配置默认数据
      * @return {[type]} [description]
      */
     function initDefaults(setData) {
         var rs,
             data = {},
             cfg = {},

         //工具栏默认参数
         defaults = {
             ToolbarPos: 0, //工具栏[0顶部,1底部]
             NavbarPos: 1, //左右翻页按钮[0顶部, 1中间, 2底部]
             HomeBut: 1, //主页按钮[0不显示,1显示]
             ContentBut: 1, //目录按钮[0不显示,1显示]
             PageBut: 1, //页码按钮[0不显示,1显示]
             NavLeft: 1, //左翻页按钮[0不显示,1显示]
             NavRight: 1, //右翻页按钮[0不显示,1显示]
             customButton: 0, //自定义翻页按钮
             CloseBut: SUbDOCCONTEXT ? 1 : 0 //关闭按钮[0不显示,1显示]
         };

         for (var i = 0, len = setData.length; i < len; i++) {
             rs = setData.item(i);
             data[rs.name] = rs.value;
         }

         _.defaults(data, defaults);

         for (i in defaults) {
             cfg[i] = Number(data[i]);
         }

         config$2.settings = cfg;
         config$2.appId = data.appId; //应用配置唯一标示符
         config$2.shortName = data.shortName;
         config$2.Inapp = data.Inapp; //是否为应用内购买

         //应用的唯一标识符
         //生成时间+appid
         config$2.appUUID = data.adUpdateTime ? data.appId + '-' + /\S*/.exec(data.adUpdateTime)[0] : data.adUpdateTime;

         //检查是否解锁
         Xut.Application.CheckOut();

         //资源路径配置
         config$2.initResourcesPath();

         //缓存应用ID
         _set({
             'appId': data.appId
         });

         //新增模式,用于记录浏览器退出记录
         cfgHistory(data);

         //广告Id
         //2014.9.2
         Xut.Presentation.AdsId = data.adsId;

         //2015.2.26
         //启动画轴模式
         //防止是布尔0成立
         if (data.scrollPaintingMode && data.scrollPaintingMode == 1) {
             config$2.scrollPaintingMode = true;
         }

         //假如启用了画轴模式，看看是不是竖版的情况，需要切半模版virtualMode
         if (config$2.scrollPaintingMode) {
             if (config$2.screenSize.width < config$2.screenSize.height) {
                 config$2.virtualMode = true;
             }
         }

         //创建过滤器
         Xut.CreateFilter = contentFilter('createFilter');
         Xut.TransformFilter = contentFilter('transformFilter');
     }

     //新增模式,用于记录浏览器退出记录
     //默认启动
     //是否回到退出的页面
     //set表中写一个recordHistory
     //是   1
     //否   0
     function cfgHistory(data) {

         var recordHistory = 1; //默认启动
         if (data.recordHistory !== undefined) {
             recordHistory = Number(data.recordHistory);
         }

         //如果启动桌面调试模式
         //自动打开缓存加载
         if (!recordHistory && config$2.isBrowser && config$2.debugMode) {
             recordHistory = 1;
         }

         config$2.recordHistory = recordHistory;
     }

     /**
      * 修正尺寸
      * 修正实际分辨率
      * @return {[type]} [description]
      */
     function fixedSize(novelData) {
         if (novelData) {
             if (novelData.pptWidth || novelData.pptHeight) {
                 config$2.setProportion(novelData.pptWidth, novelData.pptHeight);
             }
         }
     }

     /**
      * 数据库检测
      * @return {[type]} [description]
      */
     function checkTestDB() {
         var database = config$2.db,
             sql = 'SELECT * FROM Novel';
         if (database) {
             database.transaction(function (tx) {
                 tx.executeSql(sql, [], function (tx, rs) {
                     initValue();
                 }, function () {
                     Xut.config.db = null;
                     initValue();
                 });
             });
         } else {
             initValue();
         }
     }

     /**
      * 初始化
      * 数据结构
      */
     function nextTask() {

         config$2 = Xut.config;

         //加载忙碌光标
         if (!Xut.IBooks.Enabled) {
             cursor();
         }

         if (window.openDatabase) {
             try {
                 //数据库链接对象
                 config$2.db = window.openDatabase(config$2.dbName, "1.0", "Xxtebook Database", config$2.dbSize);
             } catch (err) {
                 console.log('window.openDatabase出错');
             }
         }

         //检查数据库
         checkTestDB();
     }

     var preloadVideo = {
         //播放状态
         state: false,
         //地址
         path: DUKUCONFIG ? DUKUCONFIG.path + "duku.mp4" : 'android.resource://#packagename#/raw/duku',

         //加载视频
         load: function load() {
             // if (window.localStorage.getItem("videoPlayer") == 'error') {
             //       alert("error")
             //     return preloadVideo.launchApp();
             // }
             this.play();
             this.state = true;
         },

         //播放视频
         play: function play() {
             //延时应用加载
             Xut.Application.delayAppRun();
             Xut.Plugin.VideoPlayer.play(function () {
                 preloadVideo.launchApp();
             }, function () {
                 //捕获出错,下次不进入了,,暂无ID号
                 // window.localStorage.setItem("videoPlayer", "error")
                 preloadVideo.launchApp();
             }, preloadVideo.path, 1, 0, 0, window.innerHeight, window.innerWidth);
         },

         //清理视频
         closeVideo: function closeVideo() {
             Xut.Plugin.VideoPlayer.close(function () {
                 preloadVideo.launchApp();
             });
         },

         //加载应用
         launchApp: function launchApp() {
             this.state = false;
             Xut.Application.LaunchApp();
         }
     };

     function loadVideo() {
         preloadVideo.load();
     }

     /**************
      * 物理按键处理
      **************/

     //退出加锁,防止过快点击
     var outLock = false;

     //回退按钮状态控制器
     function controller(state) {
         //如果是子文档处理
         if (Xut.isRunSubDoc) {
             //通过Action动作激活的,需要到Action类中处理
             Xut.publish('subdoc:dropApp');
             return;
         }
         //正常逻辑
         outLock = true;

         Xut.Application.Suspend({
             dispose: function dispose() {
                 //停止热点动作
                 setTimeout(function () {
                     outLock = false;
                 }, 100);
             },
             processed: function processed() {
                 //退出应用
                 state === 'back' && Xut.Application.DropApp();
             }
         });
     }

     /**
      * 绑定控制案例事件
      * @param  {[type]} config [description]
      * @return {[type]}        [description]
      */
     function bindEvent$1(config) {
         //存放绑定事件
         config._event = {
             //回退键
             back: function back() {
                 //如果是预加载视频
                 if (preloadVideo.state) {
                     preloadVideo.closeVideo();
                 } else {
                     controller('back');
                 }
             },
             //暂停键
             pause: function pause() {
                 controller('pause');
             }
         };
     }

     /**
      *  创建播放器
      *  IOS，PC端执行
      */
     function html5Video() {
         //延时应用开始
         Xut.Application.delayAppRun();
         var videoPlay = Xut.Video5({
             url: 'duku.mp4',
             startBoot: function startBoot() {
                 Xut.Application.LaunchApp();
             }
         });
         videoPlay.play();
     }

     function init() {

         var config = Xut.config;
         var isBrowser = config.isBrowser;

         //绑定键盘事件
         bindEvent$1(config);

         //如果不是读库模式
         //播放HTML5视频
         //在IOS
         if (!DUKUCONFIG && !GLOBALIFRAME && Xut.plat.isIOS) {
             html5Video();
         }

         //Ifarme嵌套处理
         //1 新阅读
         //2 子文档
         //=======
         //3 pc
         //4 ios/android
         if (GLOBALIFRAME) {
             creatDatabase(config);
         } else {
             //PC还是移动
             if (isBrowser) {
                 loadApp(config);
             } else {
                 //如果不是iframe加载,则创建空数据库
                 window.openDatabase(config.dbName, "1.0", "Xxtebook Database", config.dbSize);
                 //等待硬件加载完毕
                 document.addEventListener("deviceready", creatDatabase, false);
             }
         }
     }

     /**
      * 如果是安卓桌面端
      * 绑定事件
      * 创建数据库
      * @return {[type]} [description]
      */
     function creatDatabase(config) {

         //安卓上
         if (Xut.plat.isAndroid) {

             //预加载处理视频
             //妙妙学不加载视频
             //读库不加载视频
             if (!MMXCONFIG && !DUKUCONFIG) {
                 loadVideo();
             }

             //不是子文档指定绑定按键
             if (!SUbCONFIGT) {
                 Xut.Application.AddEventListener = function () {
                     GLOBALCONTEXT.document.addEventListener("backbutton", config._event.back, false);
                     GLOBALCONTEXT.document.addEventListener("pause", config._event.pause, false);
                 };
             }
         }

         if (DUKUCONFIG) {
             var PMS = PMS || require("PMS");
             PMS.bind("MagazineExit", function () {
                 PMS.unbind();
                 Xut.Application.DropApp();
             }, "*");
         }

         //拷贝数据库
         Xut.Plugin.XXTEbookInit.startup(config.dbName, loadApp, function () {});
     };

     /**
      * 加载app应用
      * @param  {[type]} config [description]
      * @return {[type]}        [description]
      */
     function loadApp(config) {

         //修正API接口
         //iframe要要Xut.config
         Xut.config.revised();

         //加载横版或者竖版css
         var baseCss = './css/' + Xut.config.layoutMode + '.css';
         var svgsheet = './content/gallery/svgsheet.css';

         var cssArr = [baseCss, svgsheet];
         //是否需要加载svg
         //如果是ibooks模式
         //并且没有svg
         //兼容安卓2.x
         if (Xut.IBooks.Enabled && !Xut.IBooks.existSvg) {
             cssArr = [baseCss];
         }

         //动态加载脚本
         loader.load(cssArr, function () {
             //修正全局字体
             setRootfont();
             nextTask();
         }, null, true);
     }

     /**
      * 应用入口
      * @return {[type]} [description]
      */
     var App = function App() {

         //更新版本号记录
         Xut.Version = 779;

         /**
          * 动态html文件挂载点
          * 用于content动态加载js文件
          * @type {Object}
          */
         window.HTMLCONFIG = {};

         /**
          * 2015.10.19新增
          * ibooks处理
          */
         var IBOOKSCONFIG = window.IBOOKSCONFIG;

         //如果是IBOOS模式处理
         //注入保持与数据库H5查询一致
         if (IBOOKSCONFIG && IBOOKSCONFIG.data) {
             _.each(IBOOKSCONFIG.data, function (data, tabName) {
                 data.item = function (index) {
                     return this[index];
                 };
             });
             //ios上的ibooks模式
             //直接修改改isBrowser模式
             Xut.plat.isBrowser = true;
             Xut.plat.isIOS = false;
         }

         //配置ibooks参数
         Xut.IBooks = {

             /**
              * 当前页面编号
              * @return {[type]} [description]
              */
             pageIndex: function () {
                 if (IBOOKSCONFIG) {
                     //当期页面索引1开始
                     return IBOOKSCONFIG.pageIndex + 1;
                 }
             }(),

             /**
              * 是否存在svg
              * @type {[type]}
              */
             existSvg: IBOOKSCONFIG ? IBOOKSCONFIG.existSvg : false,

             /**
              * 是否启动了ibooks模式
              * @return {[type]} [description]
              */
             Enabled: function () {
                 return IBOOKSCONFIG ? true : false;
             }(),

             /**
              * 全部对象
              * @type {[type]}
              */
             CONFIG: IBOOKSCONFIG,

             /**
              * 运行期间
              * @return {[type]} [description]
              */
             runMode: function runMode() {
                 //确定为ibooks的运行状态
                 //而非预编译状态
                 if (IBOOKSCONFIG && !IBOOKSCONFIG.compiled) {
                     return true;
                 }
                 return false;
             },
             /**
              * 编译期间
              * @return {[type]} [description]
              */
             compileMode: function compileMode() {
                 //确定为ibooks的编译状态
                 //而非预编译状态
                 if (IBOOKSCONFIG && IBOOKSCONFIG.compiled) {
                     return true;
                 }
                 return false;
             }
         };

         //修复ios 安卓浏览器不能自动播放音频的问题
         //在加载时创建新的audio.video 用的时候更换
         Xut.fix = Xut.fix || {};

         //移动端浏览器平台
         if (Xut.plat.isBrowser && (Xut.plat.isIOS || Xut.plat.isAndroid)) {
             var fixaudio = function fixaudio() {
                 if (!Xut.fix.audio) {
                     Xut.fix.audio = new Audio();
                     Xut.fix.video = document.createElement("Video");
                     document.removeEventListener('touchstart', fixaudio, false);
                 }
             };
             document.addEventListener('touchstart', fixaudio, false);
         }

         init();
     };

     $(function () {
         App();
     });

}));