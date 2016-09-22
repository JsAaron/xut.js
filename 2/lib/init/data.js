import { createStore } from '../database/index'
import { contentFilter } from '../component/activity/filter'
import { config } from '../config/index'
import { _set } from '../util/index'


/**
 * 新增模式,用于记录浏览器退出记录
 * 默认启动
 * 是否回到退出的页面
 * set表中写一个recordHistory
 * 是   1
 * 否   0
 * [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
const cfgHistory = (data) => {

    let recordHistory = 1; //默认启动
    if (data.recordHistory !== undefined) {
        recordHistory = Number(data.recordHistory);
    }

    //如果启动桌面调试模式
    //自动打开缓存加载
    if (!recordHistory && config.isBrowser && config.debugMode) {
        recordHistory = 1;
    }

    config.recordHistory = recordHistory;
}


/**
 * 默认工具栏配置
 * @type {Object}
 */
const defaults = {
    ToolbarPos: 0, //工具栏[0顶部,1底部]
    NavbarPos: 1, //左右翻页按钮[0顶部, 1中间, 2底部]
    HomeBut: 1, //主页按钮[0不显示,1显示]
    ContentBut: 1, //目录按钮[0不显示,1显示]
    PageBut: 1, //页码按钮[0不显示,1显示]
    NavLeft: 1, //左翻页按钮[0不显示,1显示]
    NavRight: 1, //右翻页按钮[0不显示,1显示]
    customButton: 0, //自定义翻页按钮
    CloseBut: window.SUbDOCCONTEXT ? 1 : 0 //关闭按钮[0不显示,1显示]
}


/**
 * 配置默认数据
 * @return {[type]} [description]
 */
const initDefaults = (SettData) => {
    let rs
    const data = {}
    const setConfig = {}

    _.each(SettData, (key, index) => {
        rs = SettData.item(index);
        data[rs.name] = rs.value;
    })

    _.defaults(data, defaults);

    for (let i in defaults) {
        setConfig[i] = Number(data[i]);
    }

    config.settings = setConfig;
    config.appId = data.appId; //应用配置唯一标示符
    config.shortName = data.shortName;
    config.Inapp = data.Inapp; //是否为应用内购买

    //应用的唯一标识符
    //生成时间+appid
    config.appUUID = data.adUpdateTime ? data.appId + '-' + /\S*/.exec(data.adUpdateTime)[0] : data.adUpdateTime;

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
    if (config.visualMode === 1 || data.scrollPaintingMode && data.scrollPaintingMode == 1) {
        config.scrollPaintingMode = true
        config.visualMode === 1
    }

    //假如启用了画轴模式，看看是不是竖版的情况，需要切半模版virtualMode
    if (config.scrollPaintingMode) {
        if (config.screenSize.width < config.screenSize.height) {
            config.virtualMode = true
        }
    }

    //创建过滤器
    Xut.CreateFilter = contentFilter('createFilter');
    Xut.TransformFilter = contentFilter('transformFilter');
}


/**
 * 根据set表初始化数据
 * @return {[type]} [description]
 */
const setStore = (callback) => {
    createStore((dataRet) => {
        let novelData = dataRet.Novel.item(0)
        initDefaults(dataRet.Setting)
        callback(novelData)
    })
}


/**
 * 数据库支持
 * @return {[type]} [description]
 */
const supportTransaction = (callback) => {
    if (window.openDatabase) {
        try {
            //数据库链接对象
            Xut.config.db = window.openDatabase(config.dbName, "1.0", "Xxtebook Database", config.dbSize);
        } catch (err) {
            console.log('window.openDatabase出错')
        }
    }
    //如果读不出数据
    if (Xut.config.db) {
        Xut.config.db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM Novel', [], function(tx, rs) {
                callback()
            }, function() {
                Xut.config.db = null
                callback()
            })
        })
    } else {
        callback()
    }
}


/**
 * 初始化
 * 数据结构
 */
export default function(callback) {
    supportTransaction(() => setStore(callback))
}
