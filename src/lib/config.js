/**
 * 配置文件
 * @param  {[type]} require [description]
 * @param  {[type]} exports [description]
 * @param  {[type]} module  [description]
 * @return {[type]}         [description]
 */
Xut.config = function () {
    //配置对象
    var config = {},
        layoutMode,
        screenSize,
        proportion,
        isIOS = Xut.plat.isIOS,
        isIphone = Xut.plat.isIphone,
        isAndroid = Xut.plat.isAndroid,
        isBrowser = Xut.plat.isBrowser,
        sourceUrl = "content/gallery/";

    var FLOOR = Math.floor;
    var CEIL = Math.ceil;

    /**
     * 屏幕尺寸
     * @return {[type]} [description]
     */
    function judgeScreen() {
        //如果是IBooks模式处理
        if (Xut.IBooks.Enabled) {
            var screenSize = Xut.IBooks.CONFIG.screenSize;
            if (screenSize) {
                return {
                    "width": screenSize.width,
                    "height": screenSize.height
                }
            }
        }

        return {
            "width": $(window).width(),
            // 1024 768
            "height": $(window).height()
        }
    }

    //排版判断
    function judgeLayer() {
        return screenSize.width > screenSize.height ? "horizontal" : "vertical";
    }


    //缩放比例
    function judgeScale(pptWidth, pptHeight) {
        var dbmode, scaleWidth, scaleHeight,
            width = screenSize.width,
            height = screenSize.height,
            // 根据设备判断设备的横竖屏 1 横板 0 竖版
            horizontalMode = width > height ? 1 : 0,

            //默认ppt尺寸
            defaultWidth = pptWidth ? pptWidth : horizontalMode ? 1024 : 768,
            defaultHeight = pptHeight ? pptHeight : horizontalMode ? 720 : 976,

            //当前屏幕的尺寸与数据库设计的尺寸，比例
            wProp = width / defaultWidth,
            hProp = height / defaultHeight,

            //布局的偏移量，可能是采用了画轴模式，一个可视区可以容纳3个页面
            offsetTop = 0,
            offsetLeft = 0;

        if (pptWidth && pptHeight && isBrowser) {
            dbmode = pptWidth > pptHeight ? 1 : 0; // 根据数据库判断横杂志的竖屏 1 横板 0 竖版
            if (dbmode != horizontalMode) {
                if (dbmode === 1) {
                    hProp = wProp;
                } else {
                    wProp = hProp;
                }
            }
        }

        //画轴模式
        if (config.scrollPaintingMode) {
            //    Dw       width - 2 * left 
            //   ----  =  -------------------
            //    Dh       height - 2 * top

            if (horizontalMode) {
                scaleWidth = defaultWidth * hProp;
                offsetLeft = (width - scaleWidth) / 2;
                wProp = hProp;
            } else {
                scaleHeight = defaultHeight * hProp;
                offsetTop = (height - scaleHeight) / 2;
                hProp = wProp;
            }
        }

        //word模式下的竖版
        if (config.virtualMode && !horizontalMode) {
            //假设高度不会溢出,按两倍屏宽计算
            var _prop = 2 * width / defaultWidth;
            offsetLeft = 0;
            scaleHeight = defaultHeight * _prop;
            offsetTop = (height - scaleHeight) / 2;

            //如果高度溢出,按屏高计算
            if (scaleHeight > height) {
                _prop = height / defaultHeight;
                scaleWidth = defaultWidth * _prop;

                offsetTop = 0;
                offsetLeft = (2 * width - scaleWidth) / 2;
            }

            wProp = hProp = _prop;
        }

        var opts = {
            width: wProp,
            height: hProp,
            left: wProp,
            top: hProp,
            offsetTop: offsetTop,
            offsetLeft: offsetLeft,
            pptWidth: pptWidth,
            pptHeight: pptHeight
        }

        return opts;
    }

    /**
     * 修正API接口
     * @return {[type]} [description]
     */
    function fiexdAPI() {
        screenSize = config.screenSize = judgeScreen();
        layoutMode = config.layoutMode = judgeLayer();
        proportion = config.proportion = judgeScale();
    }

    /**
     * 修复缩放比
     * 如果PPT有编辑指定的宽度与高度
     */
    function setProportion(pptWidth, pptHeight) {

        //计算新的缩放比
        proportion = config.proportion = judgeScale(pptWidth, pptHeight);

        //计算容器的宽高比
        proportion.calculateContainer = (function () {

            var pptWidth = proportion.pptWidth,
                pptHeight = proportion.pptHeight,
                scaleWidth = proportion.width,
                scaleHeight = proportion.height;

            return function (width, height, left, top) {

                width = arguments[0] ? arguments[0] : screenSize.width;
                height = arguments[1] ? arguments[1] : screenSize.height;
                left = arguments[2] ? arguments[2] : 0;
                top = arguments[3] ? arguments[3] : 0;

                if (pptWidth && pptHeight && isBrowser) {
                    //维持竖版的缩放比
                    var _width = scaleWidth * pptWidth;
                    var _height = scaleHeight * pptHeight;

                    //虚拟模式并且是竖版
                    if (config.virtualMode && height > width) {
                        return {
                            width: FLOOR(_width),
                            height: FLOOR(_height),
                            left: FLOOR((width - _width / 2) / 2),
                            top: FLOOR((height - _height) / 2)
                        }
                    }
                    //横版模式
                    return {
                        width: FLOOR(_width),
                        height: FLOOR(_height),
                        left: FLOOR((width - _width) / 2),
                        top: FLOOR((height - _height) / 2)
                    };
                } else {
                    return {
                        width: FLOOR(width),
                        height: FLOOR(height),
                        left: FLOOR(left),
                        top: FLOOR(top)
                    }
                }
            }
        })();

        //计算元素的缩放比
        proportion.calculateElement = function (data) {
            var data = _.extend({}, data)
            data.width = CEIL(data.width * proportion.width);
            data.height = CEIL(data.height * proportion.height);
            data.top = FLOOR(data.top * proportion.top);
            data.left = FLOOR(data.left * proportion.left);
            return data;
        }
    }


    //层级关系
    _.extend(Xut, {
        zIndexlevel: function () {
            return ++config.zIndexlevel;
        }
    })

    //通过新学堂加载
    //用于处理iframe窗口去全屏
    if (/xinxuetang/.test(window.location.href)) {
        config.iframeFullScreen = true;
    }


    /********************************************************************
     *
     *              通过iframe加载判断当前的加载方式
     *              1 本地iframe打开子文档
     *              2 读酷加载电子杂志
     *              3 读酷加载电子杂志打开子文档
     *
     * *******************************************************************/
    var iframeMode = (function () {
        var mode;
        if (SUbCONFIGT && DUKUCONFIG) {
            //通过读酷客户端开打子文档方式
            mode = 'iframeDuKuSubDoc'
        } else {
            //子文档加载
            if (SUbCONFIGT) {
                mode = 'iframeSubDoc'
            }

            //读酷客户端加载
            if (DUKUCONFIG) {
                mode = 'iframeDuKu'
            }

            //客户端模式
            //通过零件加载
            if (CLIENTCONFIGT) {
                mode = 'iframeClient'
            }

            //秒秒学客户端加载
            if (MMXCONFIG) {
                mode = 'iframeMiaomiaoxue'
            }

        }
        return mode;
    } ());


    //读酷模式下的路径
    DUKUCONFIG && (DUKUCONFIG.path = DUKUCONFIG.path.replace('//', '/'));

    //除右端的"/"
    var rtrim = function (str) {
        if (typeof str != 'string') return str;
        var lastIndex = str.length - 1;
        if (str.charAt(lastIndex) === '/') {
            return str.substr(0, lastIndex)
        } else {
            return str;
        }
    }

    // var MMXCONFIGPath = '.'
    // if (MMXCONFIG && MMXCONFIG.path) {
    //     MMXCONFIGPath = location.href.replace(/^file:\/\/\/?/i, '/').replace(/[^\/]*$/, '');
    // }
    var MMXCONFIGPath = location.href.replace(/^file:\/\/\/?/i, '/').replace(/[^\/]*$/, '');
    if (MMXCONFIG && MMXCONFIG.path) {
        MMXCONFIGPath = rtrim(MMXCONFIG.path)
    }


    //iframe嵌套配置
    //1 新阅读
    //2 子文档
    //3 秒秒学
    var iframeConfig = {
        //资源图片
        resources: function () {
            if (isIOS) {
                switch (iframeMode) {
                    case 'iframeDuKu':
                        return DUKUCONFIG.path;
                    case 'iframeSubDoc':
                        return sourceUrl;
                    case 'iframeDuKuSubDoc':
                        return sourceUrl;
                    case 'iframeClient':
                        return CLIENTCONFIGT.path;
                    case 'iframeMiaomiaoxue':
                        return MMXCONFIGPath + '/content/gallery/';
                }
            }

            if (isAndroid) {
                switch (iframeMode) {
                    case 'iframeDuKu':
                        return DUKUCONFIG.path;
                    case 'iframeSubDoc':
                        return '/android_asset/www/content/subdoc/' + SUbCONFIGT.path + '/content/gallery/';
                    case 'iframeDuKuSubDoc':
                        return DUKUCONFIG.path.replace('gallery', 'subdoc') + SUbCONFIGT.path + '/content/gallery/';
                    case 'iframeClient':
                        return CLIENTCONFIGT.path;
                    case 'iframeMiaomiaoxue':
                        return MMXCONFIGPath + '/content/gallery/';
                }
            }
        },

        //视频路径
        video: function () {
            if (isIOS) {
                switch (iframeMode) {
                    case 'iframeDuKu':
                        return DUKUCONFIG.path;
                    case 'iframeSubDoc':
                        return sourceUrl
                    case 'iframeDuKuSubDoc':
                        return sourceUrl;
                    case 'iframeClient':
                        return CLIENTCONFIGT.path;
                    case 'iframeMiaomiaoxue':
                        return MMXCONFIGPath + '/content/gallery/';
                }
            }

            if (isAndroid) {
                switch (iframeMode) {
                    case 'iframeDuKu':
                        return DUKUCONFIG.path;
                    case 'iframeSubDoc':
                        return 'android.resource://#packagename#/raw/';
                    case 'iframeDuKuSubDoc':
                        return DUKUCONFIG.path.replace('gallery', 'subdoc') + SUbCONFIGT.path + '/content/gallery/';
                    case 'iframeClient':
                        return CLIENTCONFIGT.path;
                    case 'iframeMiaomiaoxue':
                        return MMXCONFIGPath + '/content/gallery/';
                }
            }
        },

        //音频路径
        audio: function () {
            if (isIOS) {
                switch (iframeMode) {
                    case 'iframeDuKu':
                        return DUKUCONFIG.path;
                    case 'iframeSubDoc':
                        return sourceUrl;
                    case 'iframeDuKuSubDoc':
                        return sourceUrl;
                    case 'iframeClient':
                        return CLIENTCONFIGT.path;
                    case 'iframeMiaomiaoxue':
                        return MMXCONFIGPath + '/content/gallery/';
                }
            }
            if (isAndroid) {
                switch (iframeMode) {
                    case 'iframeDuKu':
                        return DUKUCONFIG.path;
                    case 'iframeSubDoc':
                        return '/android_asset/www/content/subdoc/' + SUbCONFIGT.path + '/content/gallery/';
                    case 'iframeDuKuSubDoc':
                        return DUKUCONFIG.path.replace('gallery', 'subdoc') + SUbCONFIGT.path + '/content/gallery/';
                    case 'iframeClient':
                        return CLIENTCONFIGT.path;
                    case 'iframeMiaomiaoxue':
                        return MMXCONFIGPath + '/content/gallery/';
                }
            }
        },

        //调用插件处理
        svg: function () {
            if (isIOS) {
                switch (iframeMode) {
                    case 'iframeDuKu':
                        return DUKUCONFIG.path;
                    case 'iframeSubDoc':
                        //www/content/subdoc/00c83e668a6b6bad7eda8eedbd2110ad/content/gallery/
                        return 'www/content/subdoc/' + SUbCONFIGT.path + '/content/gallery/';
                    case 'iframeDuKuSubDoc':
                        return DUKUCONFIG.path.replace('gallery', 'subdoc') + SUbCONFIGT.path + '/content/gallery/';
                    case 'iframeClient':
                        return CLIENTCONFIGT.path;
                    case 'iframeMiaomiaoxue':
                        return MMXCONFIGPath + '/content/gallery/';
                }
            }

            if (isAndroid) {
                switch (iframeMode) {
                    case 'iframeDuKu':
                        return DUKUCONFIG.path;
                    case 'iframeSubDoc':
                        return 'www/content/subdoc/' + SUbCONFIGT.path + '/content/gallery/';
                    case 'iframeDuKuSubDoc':
                        return DUKUCONFIG.path.replace('gallery', 'subdoc') + SUbCONFIGT.path + '/content/gallery/';
                    case 'iframeClient':
                        return CLIENTCONFIGT.path;
                    case 'iframeMiaomiaoxue':
                        return MMXCONFIGPath + '/content/gallery/';
                }
            }
        }

    }


    //杂志直接打开
    var nativeConfig = {
        //资源图片
        resources: function () {
            if (isIOS) {
                return sourceUrl;
            }

            if (isAndroid) {
                if (parseInt(config.storageMode)) {
                    //sd卡加载资源数据
                    return "/sdcard/appcarrier/magazine/" + config.appId + "/" + sourceUrl;
                } else {
                    //android_asset缓存加载资源
                    return "/android_asset/www/" + sourceUrl;
                }
            }
        },

        //视频路径
        // ios平台在缓存
        // 安卓在编译raw中
        video: function () {
            if (isIOS) {
                return sourceUrl;
            }
            if (isAndroid) {
                return 'android.resource://#packagename#/raw/';
            }
        },

        //音频路径
        // ios平台在缓存
        // 安卓在缓存中
        audio: function () {
            if (isIOS) {
                return sourceUrl;
            }
            if (isAndroid) {
                return "/android_asset/www/" + sourceUrl;
            }
        },

        //读取svg路径前缀
        svg: function () {
            return 'www/' + sourceUrl;
        }
    }



    //缓存
    var cacheResourcesPath, cacheVideoPath, cacheAudioPath, cacheSvgPath;


    /**
     * pc端模式
     * 而且是客户端模式
     * @return {[type]} [description]
     */
    function pcMode() {
        //如果是iframe加载
        //而且是客户端模式
        if (GLOBALIFRAME && CLIENTCONFIGT) {
            return CLIENTCONFIGT.path;
        }

        if (typeof initGalleryUrl != 'undefined') {
            return sourceUrl;
        } else {
            //资源存放位置
            // * storageMode 存放的位置
            // * 0 APK应用本身
            // 1 外置SD卡
            if (Number(config.storageMode)) {
                return "sdcard/" + config.appId + "/" + sourceUrl;
            } else {
                return sourceUrl;
            }
        }
    };

    /**
     * 平台加载用于
     * 视频.音频妙妙学处理
     * 1 桌面
     * 2 移动端
     * 3 安卓打包后通过网页访问=>妙妙学
     * @return {[type]} [description]
     */
    function runLoad() {
        if (MMXCONFIG) {
            return false
        }
        return isBrowser;
    }

    /**
     * 图片资源配置路径
     * [resourcesPath description]
     * @return {[type]} [description]
     */
    function resourcesPath() {
        if (cacheResourcesPath) {
            return cacheResourcesPath;
        }
        //移动端模式
        var mobileMode = function () {
            return GLOBALIFRAME ? iframeConfig.resources() : nativeConfig.resources();
        };
        return cacheResourcesPath = isBrowser ? pcMode() : mobileMode();
    }


    /**
     * mp3 mp4 音频文件路径
     * 1 音频加载就会自动拷贝到SD卡上
     * 2 或者asset上的资源
     * @return {[type]} [description]
     */
    function videoPath() {
        if (cacheVideoPath) {
            return cacheVideoPath;
        }
        var mobilePath = function () {
            return GLOBALIFRAME ? iframeConfig.video() : nativeConfig.video();
        };
        return cacheVideoPath = runLoad() ? pcMode() : mobilePath();
    }


    /**
     * 音频路径
     * @return {[type]} [description]
     */
    function audioPath() {
        if (cacheAudioPath) {
            return cacheAudioPath;
        }
        //移动端
        var mobileMode = function () {
            return GLOBALIFRAME ? iframeConfig.audio() : nativeConfig.audio();
        };
        return cacheAudioPath = runLoad() ? pcMode() : mobileMode();
    };


    /**
     * SVG文件路径
     * @return {[type]} [description]
     */
    function svgPath() {
        if (cacheSvgPath) {
            return cacheSvgPath;
        }
        var mobileMode = function () {
            return GLOBALIFRAME ? iframeConfig.svg() : nativeConfig.svg();
        };
        return cacheSvgPath = isBrowser ? pcMode() : mobileMode();
    }


    //打印信息
    Xut.log = function (info, name) {
        if (!config.debugMode) return;
        switch (info) {
            case 'error':
                console.error && console.error(name);
                break;
            case 'debug':
                console.debug && console.debug(name);
                break;
            default:
                console.log(info)
                break;
        }
    }


    //=============================================
    //
    //             调试模式代码
    //
    //============================================
    _.extend(config, {

        //调试模式
        //如果启动桌面调试模式,自动打开缓存加载,就是每次都打开都回到最后看到的一页
        debugMode: false,

        //直接通过数据库的历史记录定位到指定的页面
        // Xut.View.LoadScenario({
        //     'scenarioId' : scenarioInfo[0],
        //     'chapterId'  : scenarioInfo[1],
        //     'pageIndex'  : scenarioInfo[2]
        // })
        // {
        //     'scenarioId' : 7,
        //     'chapterId'  : 9
        // }
        // 
        // 
        deBugHistory: false
    })


    /**
     * 全局模式配置
     */
    _.extend(config, {

        //支持电子在在线阅读,向服务端取数据
        //自定义配置地址即可
        onlineModeUrl: 'lib/data/database.php',

        //数据库名
        dbName: window.xxtmagzinedbname || 'magazine',

        //全局翻页模式
        //0 滑动翻页
        //1 直接换
        pageFlip: 0,

        //存储模式  
        //0 APK应用本身 
        //1 外置SD卡
        storageMode: 0,

        //虚拟模式
        //采用word排版，如果是横屏的布局放到竖版的手机上
        //就需要分割排版布局
        virtualMode: false,

        //画轴模式
        //在不同分辨率下，按照正比缩放拼接
        //在一个可视区中，可以看到3个li拼接后的效果
        scrollPaintingMode: false,

        //独立canvas模式处理
        //为了测试方便  
        //可以直接切换到dom模式
        onlyDomMode: false,

        //canvas的处理模式
        //合并模式：merge
        //单个模式：single
        canvasProcessMode: 'merge'
    })


    /**
     * 对应的接口
     */
    _.extend(config, {

        //应用路径唯一标示
        appId: null,

        //配置图片路径地址
        //初始化资源路径
        initResourcesPath: function () {
            this.pathAddress = resourcesPath();
        },

        //视频文件路径
        videoPath: function () {
            return videoPath();
        },

        //音频文件路径
        audioPath: function () {
            return audioPath();
        },

        //配置SVG文件路径
        svgPath: function () {
            return svgPath();
        },
        
        //设备尺寸
        screenSize: screenSize,
        //排版模式
        layoutMode: layoutMode,
        //缩放比例
        proportion: proportion,
        isBrowser: isBrowser,
        //全局层级初始值
        zIndexlevel: 1000,
        //默认图标高度
        iconHeight: isIphone ? 32 : 44,
        //修正
        revised: fiexdAPI,
        //修正缩放比
        setProportion: setProportion,
        //数据库尺寸
        dbSize: 1
    });

    return config;
} ();