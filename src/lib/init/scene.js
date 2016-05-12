import {
    _set,
    _get,
    injectScript,
    toEmpty
}
from '../util/index'

let config


/**
 * 设置缓存
 * @param {[type]} parameter [description]
 */
function setDataToStorage(parameter) {
    config.pageIndex = parameter.pageIndex;
    config.novelId = parameter.novelId;
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
        config.pageFlip = toEmpty(pageFlip);
    }
    return {
        'novelId'   : toEmpty(options.novelId),
        'pageIndex' : toEmpty(options.pageIndex),
        'history'   : options.history
    }
};


/**
 * 检测脚本注入
 * @return {[type]} [description]
 */
function checkInjectScript() {
    var preCode,
        novels = Xut.data.query('Novel');
    if (preCode = novels.preCode) {
        injectScript(preCode, 'novelpre脚本')
    }
}

export function loadScene(options) {
 
    config = Xut.config

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
        seasondata = Xut.data.Season.item(i)
        if (Xut.data.query('sectionRelated', seasondata._id)) {
            scenarioId = seasondata._id
            break;
        }
    }

    //加载新的场景
    Xut.View.LoadScenario({
        'main'       : true, //主场景入口
        'scenarioId' : scenarioId,
        'pageIndex'  : parameter.pageIndex,
        'history'    : parameter.history
    });

}
