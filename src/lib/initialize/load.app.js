import { config } from '../config/index'

import {
    $$set,
    $$get,
    execScript
}
from '../util/index'


/**
 * 设置缓存
 * @param {[type]} parameter [description]
 */
const setDataToStorage = (parameter) => {
    config.pageIndex = parameter.pageIndex;
    config.novelId   = parameter.novelId;
    $$set({
        "pageIndex" : parameter.pageIndex,
        "novelId"   : parameter.novelId
    });
};


/**
 * 初始化值
 * @param {[type]} options [description]
 */
const initDefaultValues = (options) => {
    return {
        'novelId'   : Number(options.novelId),
        'pageIndex' : Number(options.pageIndex),
        'history'   : options.history
    }
};


/**
 * 检测脚本注入
 * @return {[type]} [description]
 */
const runScript = () => {
    var preCode, novels = Xut.data.query('Novel');
    if (preCode = novels.preCode) {
        execScript(preCode, 'novelpre脚本')
    }
}


export default function(options) {

    options = initDefaultValues(options || {});

    //设置缓存
    setDataToStorage(options)

    //应用脚本注入
    runScript();

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
        'pageIndex'  : options.pageIndex,
        'history'    : options.history
    });

}
