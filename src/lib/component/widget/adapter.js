/********************************************************************
 *
 *                   零件适配器
 *
 *              1 数据过滤
 *              构件5种类型
 *
 * *******************************************************************/
import { IframeWidget } from './iframe'
import { PageWidget } from './page/index'
import { parseJSON } from '../../util/dom'
import { config } from '../../config/index'

let proportion
let screenSize
let appId

let loadWidget = (type, data, widgetClass) => {
    Xut.Application.injectionComponent({
        'pageType': data.pageType, //标记类型区分
        'pageIndex': data.pageIndex,
        'widget': new widgetClass(data)
    });
}

/**
 * 构建5中零件类型
 *  1、iframe零件
 *  2、页面零件
 *  3、SVG零件
 *  4、canvas零件
 *  5、webGL零件
 * @type {Object}
 */
let adapterType = {

    /**
     * iframe零件类型
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    'iframe' (data) {
        loadWidget('widget', data, IframeWidget);
    },
    'widget' (data) {
        loadWidget('widget', data, IframeWidget);
    },

    /**
     * js零件类型处理
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    'js' (data) {
        loadWidget('js', data, PageWidget);
    },
    'page' (data) {
        loadWidget('page', data, PageWidget);
    },
    'svg' (data) {
        loadWidget('svg', data, PageWidget);
    },
    'canvas' (data) {
        loadWidget('canvas', data, PageWidget);
    },
    'webgL' (data) {
        loadWidget('webgL', data, PageWidget);
    }
}


/**
 * 过滤出数据
 * @return {[type]} [description]
 */
let filterData = (data) => {
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
 * 获取widget数据
 * @return {[type]} [description]
 */
let filtrateDas = (data) => {
    data = filterData(data);
    return proportion.calculateElement(data)
}



/**
 * ifarme内部，请求返回数据
 * @return {[type]} [description]
 */
let parsePara = (data) => {
    var inputPara, //输入数据
        outputPara; //输出数据
    if (inputPara = data.inputPara) {
        outputPara = parseJSON(inputPara)
    }
    return outputPara;
}



export function Adapter(para) {

    let data

    proportion = config.proportion;
    screenSize = config.screenSize;
    appId = config.appId;

    //获取数据
    data = filtrateDas(para);

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
