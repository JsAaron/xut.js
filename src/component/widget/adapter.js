/********************************************************************
 *
 *                   零件适配器
 *
 * 				1 数据过滤
 * 				构件5种类型
 *
 * *******************************************************************/


import { iframeWidget } from './iframe'
import { pageWidget } from './page'


let proportion
let screenSize
let appId


function loadWidget(type, data, widgetClass) {
    //pixi webgl模式
    //2016.4.14
    //高级精灵动画
    var pageObj = Xut.Presentation.GetPageObj(data.pageType, data.pageIndex)
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
    'iframe': function(data) {
        loadWidget('widget', data, iframeWidget);
    },
    'widget': function(data) {
        loadWidget('widget', data, iframeWidget);
    },

    /**
     * js零件类型处理
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    'js': function(data) {
        loadWidget('js', data, pageWidget);
    },
    'page': function(data) {
        loadWidget('page', data, pageWidget);
    },
    'svg': function(data) {
        loadWidget('svg', data, pageWidget);
    },
    'canvas': function(data) {
        loadWidget('canvas', data, pageWidget);
    },
    'webgL': function(data) {
        loadWidget('webgL', data, pageWidget);
    }
}


/**
 * 获取widget数据
 * @return {[type]} [description]
 */
function filtrateDas(data) {
    data = filterData(data);
    return proportion.calculateElement(data)
}

/**
 * 过滤出数据
 * @return {[type]} [description]
 */
function filterData(data) {
    //直接通过id查询数据	
    if (data.widgetId) {
        _.extend(data, Xut.data.query('Widget', data.widgetId))
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
        anminJson = (new Function("return " + itemArray))();
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
        outputPara = ParseJSON(inputPara)
    }
    return outputPara;
}


export function Adapter(para) {

    config = Xut.config;
    proportion = config.proportion;
    screenSize = config.screenSize;
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
    data.inputPara.screenSize = screenSize;
    //content的命名前缀
    data.inputPara.contentPrefix = Xut.Presentation.MakeContentPrefix(data.pageIndex, data.pageType)

    //画轴模式
    data.scrollPaintingMode = config.scrollPaintingMode;
    data.calculate = config.proportion.calculateContainer();


    //执行类构建
    adapterType[(data.widgetType || 'widget').toLowerCase()](data);
}
