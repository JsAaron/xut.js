import {
    _set,
    _get,
    parseJSON
}
from '../../util/index'

import { cursor } from '../cursor'
import { createStore } from './storemgr'
import { contentFilter } from '../../component/content/filter'
import { loadScene } from '../scene'


let config;

let getCache = (name) => parseInt(_get(name))


/**
 * 配置默认数据
 * @return {[type]} [description]
 */
let initDefaults = (setData) => {
    let rs
    let data = {}
    let setConfig = {}

    //工具栏默认参数
    let defaults = {
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

    for (let i = 0, len = setData.length; i < len; i++) {
        rs = setData.item(i);
        data[rs.name] = rs.value;
    }

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

    //检查是否解锁
    Xut.Application.CheckOut();

    //资源路径配置
    config.initResourcesPath();

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
        config.scrollPaintingMode = true;
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

//新增模式,用于记录浏览器退出记录
//默认启动
//是否回到退出的页面
//set表中写一个recordHistory
//是   1
//否   0
let cfgHistory = (data) => {

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
 * 修正尺寸
 * 修正实际分辨率
 * @return {[type]} [description]
 */
let fixedSize = (novelData) => {
    if (novelData) {
        if (novelData.pptWidth || novelData.pptHeight) {
            config.setProportion(novelData.pptWidth, novelData.pptHeight);
        }
    }
}


/**
 * 进入主页面
 * @return {[type]} [description]
 */
let initMain = (novelData) => {

    let novelId
    let parameter
    let pageIndex = getCache('pageIndex')
    let pageFlip = getCache('pageFlip') || 0

    /**
     * IBOOS模式
     */
    if (Xut.IBooks.Enabled) {
        //删除背景图
        $("#removelayer").remove();
        loadScene({
            "pageIndex": Xut.IBooks.CONFIG.pageIndex
        });
        return
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
        pageFlip = parameter.pageflip
        if (pageFlip !== undefined) {
            //设置缓存
            _set({
                'pageFlip': pageFlip
            });
        }
    }

    //缓存加载
    //如果启动recordHistory记录
    if (config.recordHistory && pageIndex !== undefined) {
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
}


/**
 * 根据set表初始化数据
 * @return {[type]} [description]
 */
let initValue = () => {
    createStore((dataRet) => {
        let novelData = dataRet.Novel.item(0)
        initDefaults(dataRet.Setting)
        fixedSize(novelData)
        initMain(novelData)
    })
}


/**
 * 数据库检测
 * @return {[type]} [description]
 */
let checkTestDB = () => {
    var database = config.db,
        sql = 'SELECT * FROM Novel'
    if (database) {
        database.transaction(function(tx) {
            tx.executeSql(sql, [], function(tx, rs) {
                initValue();
            }, function() {
                Xut.config.db = null;
                initValue();
            })
        })
    } else {
        initValue();
    }
}


/**
 * 初始化
 * 数据结构
 */
export default function() {
    config = Xut.config
        //加载忙碌光标
    if (!Xut.IBooks.Enabled) {
        cursor()
    }
    if (window.openDatabase) {
        try {
            //数据库链接对象
            config.db = window.openDatabase(config.dbName, "1.0", "Xxtebook Database", config.dbSize);
        } catch (err) {
            console.log('window.openDatabase出错')
        }
    }
    //检查数据库
    checkTestDB();
}
